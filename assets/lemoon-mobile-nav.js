import { getToggleAction } from './lemoon-mobile-nav-logic.js';

let controller = null;

function find(scope, selector) {
  if (scope.matches?.(selector)) return scope;
  return scope.querySelector(selector);
}

function destroy() {
  if (!controller) return;
  controller.abort.abort();
  if (controller.drawer.classList.contains('is-open')) {
    document.body.style.overflow = controller.previousOverflow;
  }
  controller.overlay.remove();
  controller.drawer.remove();
  controller = null;
}

function initialize(scope = document) {
  const drawer = find(scope, '[data-lemoon-nav]');
  const overlay = find(scope, '[data-lemoon-nav-overlay]');
  const header = find(scope, '.lemoon-header');
  if (!drawer || !overlay || !header) return;
  if (controller?.drawer === drawer) return;
  destroy();

  const triggers = [...header.querySelectorAll('[data-lemoon-nav-open]')];
  const root = drawer.querySelector('[data-lemoon-nav-root]');
  const panels = [...drawer.querySelectorAll('[data-lemoon-nav-panel]')];
  if (!root || !triggers.length) return;

  document.body.append(overlay, drawer);
  const abort = new AbortController();
  const { signal } = abort;
  const sectionId = drawer.dataset.lemoonNavSection;
  let level = 'closed';
  let lastTrigger = null;
  let previousOverflow = '';
  const focusable = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  controller = { abort, drawer, overlay, header, sectionId, get previousOverflow() { return previousOverflow; } };

  function measure() {
    const main = header.querySelector(
      window.matchMedia('(max-width: 749px)').matches ? '.lemoon-header__mobile-inner' : '.lemoon-header__desktop'
    );
    const top = Math.max(0, main.getBoundingClientRect().bottom);
    drawer.style.setProperty('--lemoon-nav-top', `${top}px`);
    overlay.style.setProperty('--lemoon-nav-top', `${top}px`);
  }

  function updateTriggers() {
    triggers.forEach((trigger) => {
      trigger.setAttribute('aria-expanded', String(level !== 'closed'));
      trigger.setAttribute('aria-label', level === 'sub' ? trigger.dataset.navBackLabel : level === 'root' ? trigger.dataset.navCloseLabel : trigger.dataset.navOpenLabel);
      trigger.dataset.navState = level;
    });
  }

  function showRoot(focus = true) {
    level = 'root';
    root.hidden = false;
    root.setAttribute('aria-hidden', 'false');
    panels.forEach((panel) => {
      panel.hidden = true;
      panel.setAttribute('aria-hidden', 'true');
    });
    updateTriggers();
    if (focus) root.querySelector(focusable)?.focus();
  }

  function showPanel(slot) {
    const panel = panels.find((item) => item.dataset.lemoonNavPanel === slot);
    if (!panel) return;
    level = 'sub';
    root.hidden = true;
    root.setAttribute('aria-hidden', 'true');
    panels.forEach((item) => {
      item.hidden = item !== panel;
      item.setAttribute('aria-hidden', String(item !== panel));
    });
    drawer.scrollTop = 0;
    updateTriggers();
    (panel.querySelector(focusable) || panel).focus();
  }

  function open(trigger) {
    lastTrigger = trigger;
    measure();
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    drawer.inert = false;
    drawer.setAttribute('aria-hidden', 'false');
    drawer.classList.add('is-open');
    overlay.classList.add('is-open');
    showRoot();
  }

  function close() {
    if (level === 'closed') return;
    level = 'closed';
    drawer.classList.remove('is-open');
    overlay.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.inert = true;
    document.body.style.overflow = previousOverflow;
    updateTriggers();
    lastTrigger?.focus();
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const action = getToggleAction(level);
      if (action === 'open') open(trigger);
      else if (action === 'back') showRoot();
      else if (action === 'close') close();
    }, { signal });
  });
  drawer.addEventListener('click', (event) => {
    const target = event.target.closest('[data-lemoon-nav-target]');
    if (target) showPanel(target.dataset.lemoonNavTarget);
  }, { signal });
  overlay.addEventListener('click', close, { signal });
  window.addEventListener('resize', () => { if (level !== 'closed') measure(); }, { signal });
  window.addEventListener('scroll', () => { if (level !== 'closed') measure(); }, { passive: true, signal });
  document.addEventListener('keydown', (event) => {
    if (level === 'closed') return;
    if (event.key === 'Escape') { close(); return; }
    if (event.key !== 'Tab') return;
    const activeTrigger = triggers.find((trigger) => trigger.getClientRects().length > 0);
    const currentPanel = level === 'root' ? root : panels.find((panel) => !panel.hidden);
    const items = [activeTrigger, ...currentPanel.querySelectorAll(focusable)].filter(Boolean);
    const index = items.indexOf(document.activeElement);
    if (event.shiftKey && index <= 0) {
      event.preventDefault();
      items[items.length - 1].focus();
    } else if (!event.shiftKey && index === items.length - 1) {
      event.preventDefault();
      items[0].focus();
    }
  }, { signal });
  document.addEventListener('click', (event) => {
    if (level !== 'closed' && event.target.closest('[data-lemoon-search-open]')) close();
  }, { capture: true, signal });
  updateTriggers();
}

initialize();
document.addEventListener('shopify:section:load', (event) => initialize(event.target));
document.addEventListener('shopify:section:unload', (event) => {
  if (!controller) return;
  const sectionId = event.detail?.sectionId;
  if ((sectionId && sectionId === controller.sectionId) || event.target === controller.header || event.target.contains?.(controller.header)) destroy();
});
