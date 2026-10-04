import { shouldPredict, selectSuggestions, buildSearchUrl, buildPredictiveUrl, createRequestGate } from './lemoon-mobile-search-logic.js';

const selector = (name) => `[data-lemoon-search-${name}]`;

// Restrict externally supplied destinations to web URLs before assigning DOM attributes.
function safeUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    return ['http:', 'https:'].includes(new URL(value, window.location.href).protocol) ? value : null;
  } catch {
    return null;
  }
}

function saveStyles(element, properties) {
  const values = properties.map((name) => [name, element.style.getPropertyValue(name), element.style.getPropertyPriority(name)]);
  return () => values.forEach(([name, value, priority]) => {
    if (value) element.style.setProperty(name, value, priority);
    else element.style.removeProperty(name);
  });
}

class MobileSearch {
  constructor(root) {
    this.root = root;
    this.panel = root.querySelector(selector('panel'));
    this.input = root.querySelector(selector('input'));
    this.results = root.querySelector(selector('results'));
    this.status = root.querySelector(selector('status'));
    this.fallbackImage = safeUrl(root.dataset.fallbackImage);
    this.all = root.querySelector(selector('all'));
    this.form = root.querySelector(selector('form'));
    this.template = root.querySelector(selector('product-template'));
    this.header = root.closest('sticky-header')?.querySelector('[data-lemoon-search-header]');
    this.section = root.closest('.section-header');
    this.sticky = root.closest('sticky-header');
    // Keep the dialog outside the sticky header's containing block. WebKit can
    // scroll or zoom focused inputs when they live under fixed/sticky ancestors.
    document.body.append(root);
    this.triggers = [...document.querySelectorAll(selector('open'))].filter((button) => button.getAttribute('aria-controls') === this.panel.id);
    this.slides = [...root.querySelectorAll(selector('slide'))];
    this.slideTrack = root.querySelector(selector('slides'));
    this.dots = [...root.querySelectorAll(selector('dot'))];
    this.previous = root.querySelector(selector('previous'));
    this.next = root.querySelector(selector('next'));
    this.gate = createRequestGate();
    this.events = new AbortController();
    this.isOpen = false;
    this.index = 0;
    try {
      this.products = JSON.parse(root.querySelector(selector('products'))?.textContent || '[]');
      if (!Array.isArray(this.products)) this.products = [];
    } catch { this.products = []; }
    this.triggers.forEach((button) => this.listen(button, 'click', () => this.open(button)));
    this.listen(this.header, 'click', (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (this.isOpen && !target?.closest(selector('open'))) this.close(true, false);
    }, { capture: true });
    this.listen(root.querySelector(selector('close')), 'click', () => this.close());
    this.listen(root.querySelector(selector('overlay')), 'click', () => this.close());
    this.listen(this.input, 'input', () => this.onInput());
    this.listen(this.form, 'submit', (event) => {
      event.preventDefault();
      window.location.assign(this.destination());
    });
    this.listen(this.all, 'click', () => this.updateLink());
    this.listen(document, 'keydown', (event) => this.onKeydown(event));
    this.listen(document, 'touchmove', (event) => {
      if (this.isOpen && !this.panel.contains(event.target)) event.preventDefault();
    }, { passive: false });
    this.listen(document, 'wheel', (event) => {
      if (this.isOpen && !this.panel.contains(event.target)) event.preventDefault();
    }, { passive: false });
    this.listen(window, 'resize', () => this.onResize());
    this.listen(window.visualViewport, 'resize', () => this.measure());
    this.listen(window.visualViewport, 'scroll', () => this.measure());
    this.listen(this.previous, 'click', () => this.showSlide(this.index - 1, true));
    this.listen(this.next, 'click', () => this.showSlide(this.index + 1, true));
    this.dots.forEach((dot) => this.listen(dot, 'click', () => this.showSlide(Number(dot.dataset.slideIndex), true)));
    const carousel = root.querySelector(selector('carousel'));
    this.listen(carousel, 'pointerdown', () => this.stopAutoplay(), { passive: true });
    this.listen(carousel, 'touchstart', (event) => {
      this.touch = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
    }, { passive: true });
    this.listen(carousel, 'touchend', (event) => {
      const end = event.changedTouches[0];
      if (this.touch && end) {
        const dx = end.clientX - this.touch.x;
        const dy = end.clientY - this.touch.y;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) this.showSlide(this.index + (dx < 0 ? 1 : -1), true);
      }
      this.touch = null;
    }, { passive: true });
    this.listen(carousel, 'touchcancel', () => { this.touch = null; }, { passive: true });
    this.showSlide(0);
  }

  listen(target, event, handler, options = {}) {
    target?.addEventListener(event, handler, { ...options, signal: this.events.signal });
  }

  duration() {
    return Math.max(...getComputedStyle(this.root).transitionDuration.split(',').map((duration) => parseFloat(duration) * (duration.trim().endsWith('ms') ? 1 : 1000)));
  }

  destination() {
    return buildSearchUrl(this.root.dataset.searchUrl || this.form.getAttribute('action'), this.input.value);
  }

  updateLink() { this.all.href = this.destination(); }

  measure() {
    if (!this.isOpen) return;
    const viewport = window.visualViewport;
    const headerOffset = Math.max(0, this.header?.getBoundingClientRect().bottom || 0);
    this.root.style.setProperty('--lemoon-search-top', `${window.scrollY + headerOffset}px`);
    this.root.style.setProperty('--lemoon-search-header-offset', `${headerOffset}px`);
    this.root.style.setProperty('--lemoon-search-viewport-height', `${viewport ? viewport.height + viewport.offsetTop : window.innerHeight}px`);
  }

  prepareInputForFocus() {
    // Safari can auto-zoom a focused field when the page is pinched out, even
    // when its CSS font size is normally above the 16px threshold. Compensate
    // for the current visual scale before calling focus so the text stays at
    // least as large on screen as it is at the default page scale.
    const scale = window.visualViewport?.scale;
    const visualScale = Number.isFinite(scale) && scale > 0 ? scale : 1;
    this.input.style.fontSize = `${Math.max(18, 18 / visualScale)}px`;
  }

  open(button) {
    if (this.isOpen) return;
    clearTimeout(this.hideTimer);
    clearTimeout(this.focusTimer);
    this.opener = button;
    this.isOpen = true;
    this.cancelRequest();
    this.scroll = { x: window.scrollX, y: window.scrollY };
    this.restoreHtml = saveStyles(document.documentElement, ['scroll-behavior']);
    this.background = [];
    // Inert siblings at each ancestor preserve the dialog while excluding the rest of the page.
    for (let current = this.root; current && current !== document.body; current = current.parentElement) {
      for (const sibling of current.parentElement.children) {
        if (sibling !== current && sibling instanceof HTMLElement && !sibling.contains(this.header)) {
          this.background.push([sibling, sibling.inert]);
          sibling.inert = true;
        }
      }
    }
    this.input.value = '';
    this.restoreInputStyles = saveStyles(this.input, ['font-size']);
    this.panel.scrollTop = 0;
    const suggestions = selectSuggestions(this.products);
    if (suggestions.length > 1 && suggestions.map((product) => product.id).join(',') === this.initial?.map((product) => product.id).join(',')) suggestions.push(suggestions.shift());
    this.initial = suggestions;
    this.render(suggestions);
    this.status.textContent = '';
    this.updateLink();
    this.showSlide(0);
    this.root.hidden = false;
    this.root.inert = false;
    this.measure();
    this.root.getBoundingClientRect();
    this.root.classList.add('is-open');
    this.triggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'true'));
    this.startAutoplay();
    this.focusTimer = setTimeout(() => {
      if (!this.isOpen) return;
      this.prepareInputForFocus();
      this.input.focus({ preventScroll: true });
    }, this.duration());
  }

  close(immediate = false, restoreFocus = true) {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.stopAutoplay();
    this.cancelRequest();
    clearTimeout(this.focusTimer);
    this.root.classList.remove('is-open');
    this.root.inert = true;
    this.triggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));
    this.background.forEach(([element, wasInert]) => { element.inert = wasInert; });
    this.restoreInputStyles?.();
    this.restoreInputStyles = null;
    document.documentElement.style.setProperty('scroll-behavior', 'auto', 'important');
    window.scrollTo(this.scroll.x, this.scroll.y);
    this.restoreHtml();
    if (this.sticky) this.sticky.currentScrollTop = this.scroll.y;
    if (restoreFocus) this.opener?.focus({ preventScroll: true });
    const hide = () => { if (!this.isOpen) this.root.hidden = true; };
    if (immediate) hide();
    else this.hideTimer = setTimeout(hide, this.duration());
  }

  cancelRequest() {
    clearTimeout(this.debounceTimer);
    this.request?.abort();
    this.gate.invalidate();
    this.results.setAttribute('aria-busy', 'false');
  }

  onInput() {
    this.updateLink();
    this.cancelRequest();
    if (!this.isOpen) return;
    const term = this.input.value.trim();
    if (!shouldPredict(term)) {
      this.render(this.initial);
      this.status.textContent = '';
      return;
    }
    const token = this.gate.next();
    this.debounceTimer = setTimeout(() => this.predict(term, token), 250);
  }

  async predict(term, token) {
    this.request = new AbortController();
    this.results.setAttribute('aria-busy', 'true');
    this.results.replaceChildren();
    this.status.textContent = this.root.dataset.loading;
    try {
      const response = await fetch(buildPredictiveUrl(this.root.dataset.predictiveUrl, term), { signal: this.request.signal, headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`Predictive search: ${response.status}`);
      const data = await response.json();
      if (!this.isOpen || !this.gate.isCurrent(token)) return;
      const products = data?.resources?.results?.products;
      if (!Array.isArray(products)) throw new Error('Invalid predictive product response');
      const count = this.render(products.slice(0, 5));
      this.status.textContent = count ? this.root.dataset.resultsCount.replace('__COUNT__', String(count)) : this.root.dataset.noResults.replace('__TERMS__', term);
    } catch (error) {
      if (this.isOpen && this.gate.isCurrent(token) && error.name !== 'AbortError') {
        this.results.replaceChildren();
        this.status.textContent = this.root.dataset.error;
      }
    } finally {
      if (this.gate.isCurrent(token)) this.results.setAttribute('aria-busy', 'false');
    }
  }

  render(products) {
    const fragment = document.createDocumentFragment();
    let count = 0;
    for (const product of products) {
      const url = safeUrl(product.url);
      if (!url) continue;
      const card = this.template.content.cloneNode(true);
      card.querySelector('[data-product-link]').href = url;
      card.querySelector('[data-product-title]').textContent = String(product.title || '');
      const imageUrl = safeUrl(product.image || product.featured_image?.url) || this.fallbackImage;
      if (imageUrl) {
        const image = document.createElement('img');
        image.src = imageUrl;
        image.alt = String(product.title || '');
        image.loading = 'lazy';
        image.width = 96;
        image.height = 72;
        card.querySelector('[data-product-image]').replaceChildren(image);
      }
      fragment.append(card);
      count += 1;
    }
    this.results.replaceChildren(fragment);
    return count;
  }

  startAutoplay() {
    this.stopAutoplay();
    if (this.slides.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.autoplayTimer = window.setInterval(() => {
      if (!this.isOpen || this.index >= this.slides.length - 1) {
        this.stopAutoplay();
        return;
      }
      this.showSlide(this.index + 1);
      if (this.index >= this.slides.length - 1) this.stopAutoplay();
    }, 3000);
  }

  stopAutoplay() {
    clearInterval(this.autoplayTimer);
    this.autoplayTimer = null;
  }

  showSlide(index, manual = false) {
    if (!this.slides.length) return;
    if (manual) this.stopAutoplay();
    this.index = Math.max(0, Math.min(index, this.slides.length - 1));
    this.slides.forEach((slide, position) => {
      const active = position === this.index;
      slide.setAttribute('aria-hidden', String(!active));
      slide.inert = !active;
    });
    if (this.slideTrack) {
      const isLastSlide = this.index === this.slides.length - 1;
      const viewport = this.slideTrack.parentElement;
      const offset = isLastSlide && viewport
        ? Math.max(0, this.slideTrack.scrollWidth - viewport.clientWidth)
        : this.slides[this.index].offsetLeft - this.slides[0].offsetLeft;
      this.slideTrack.style.transform = `translate3d(${-offset}px, 0, 0)`;
    }
    this.dots.forEach((dot, position) => dot.setAttribute('aria-current', String(position === this.index)));
    if (this.previous) this.previous.disabled = this.index === 0;
    if (this.next) this.next.disabled = this.index === this.slides.length - 1;
  }

  onKeydown(event) {
    if (!this.isOpen) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
    }
  }

  onResize() {
    this.measure();
    this.showSlide(this.index);
  }

  disconnect() {
    this.close(true);
    clearTimeout(this.hideTimer);
    this.events.abort();
    this.root.remove();
  }
}

const controllers = new Map();
function initialize() {
  document.querySelectorAll('[data-lemoon-search]').forEach((root) => {
    if (!controllers.has(root)) controllers.set(root, new MobileSearch(root));
  });
}
initialize();
document.addEventListener('shopify:section:load', initialize);
document.addEventListener('shopify:section:unload', (event) => {
  for (const [root, controller] of controllers) {
    if (event.target === controller.section || event.target.contains(controller.section)) { controller.disconnect(); controllers.delete(root); }
  }
});
