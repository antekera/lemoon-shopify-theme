(() => {
  const footerSections = document.querySelectorAll('[data-lemoon-footer]');
  if (!footerSections.length) return;

  // Keep Shopify's native submit and CAPTCHA handlers; only the navigation target changes.
  document.querySelectorAll('.lemoon-newsletter__form').forEach((form) => {
    const status = form.querySelector('.lemoon-newsletter__status');
    if (!status || !form.id) return;
    const frame = document.createElement('iframe');
    frame.hidden = true;
    frame.name = `${form.id}-response`;
    frame.title = 'Newsletter response';
    document.body.append(frame);
    form.target = frame.name;
    let pending = false;
    let waitTimer;
    form.addEventListener('submit', () => {
      pending = true;
      clearTimeout(waitTimer);
      waitTimer = setTimeout(() => {
        if (pending) status.textContent = status.dataset.pendingMessage || '';
      }, 5000);
    });
    frame.addEventListener('load', () => {
      if (!pending) return;
      try {
        if (frame.contentWindow.location.href === 'about:blank') return;
        pending = false;
        clearTimeout(waitTimer);
        const resultForm = frame.contentDocument?.getElementById(form.id);
        const resultStatus = resultForm?.querySelector('.lemoon-newsletter__status');
        const message = resultStatus?.querySelector('.lemoon-newsletter__message');
        if (!message) throw new Error('Unconfirmed newsletter response');
        status.replaceChildren(document.importNode(message, true));
        const input = form.querySelector('input[type="email"]');
        const isError = message.getAttribute('role') === 'alert';
        if (input) {
          input.setAttribute('aria-describedby', message.id);
          if (isError) input.setAttribute('aria-invalid', 'true');
          else { input.removeAttribute('aria-invalid'); input.value = ''; }
        }
      } catch (_) {
        pending = false;
        clearTimeout(waitTimer);
        // An unexpected response or challenge must never be presented as success.
        status.textContent = status.dataset.fallbackMessage || '';
        form.removeAttribute('target');
      }
    });
  });

  const mobileQuery = window.matchMedia('(max-width: 749px)');
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const animations = new WeakMap();
  const targetStates = new WeakMap();

  const clearAnimation = (menu) => {
    animations.get(menu)?.cancel();
    animations.delete(menu);
    targetStates.delete(menu);
    const content = menu.querySelector('.lemoon-footer__menu-content');
    if (content) content.style.removeProperty('overflow');
  };

  const animateMenu = (menu, open) => {
    const content = menu.querySelector('.lemoon-footer__menu-content');
    if (!content || !mobileQuery.matches || reducedMotionQuery.matches) {
      menu.open = open;
      return;
    }

    const runningAnimation = animations.get(menu);
    const currentHeight = content.getBoundingClientRect().height;
    const fromHeight = runningAnimation ? currentHeight : open ? 0 : currentHeight;
    runningAnimation?.cancel();

    if (open) menu.open = true;
    content.style.overflow = 'hidden';

    const animation = content.animate(
      [
        { height: `${fromHeight}px`, opacity: fromHeight ? 1 : 0 },
        { height: `${open ? content.scrollHeight : 0}px`, opacity: open ? 1 : 0 },
      ],
      { duration: 260, easing: 'ease', fill: 'both' }
    );

    animations.set(menu, animation);
    targetStates.set(menu, open);
    animation.onfinish = () => {
      if (animations.get(menu) !== animation) return;
      menu.open = open;
      content.style.removeProperty('overflow');
      animation.cancel();
      animations.delete(menu);
      targetStates.delete(menu);
    };
  };

  const updateMenuState = () => {
    footerSections.forEach((footer) => {
      footer.querySelectorAll('.lemoon-footer__menu').forEach((menu) => {
        clearAnimation(menu);
        menu.open = mobileQuery.matches ? menu.dataset.mobileOpen === 'true' : true;
      });
    });
  };

  footerSections.forEach((footer) => {
    footer.querySelectorAll('.lemoon-footer__menu > summary').forEach((summary) => {
      summary.addEventListener('click', (event) => {
        event.preventDefault();
        const menu = summary.parentElement;
        if (!mobileQuery.matches) {
          menu.open = true;
          return;
        }

        const isOpen = targetStates.has(menu) ? targetStates.get(menu) : menu.open;
        animateMenu(menu, !isOpen);
      });
    });
  });

  updateMenuState();
  mobileQuery.addEventListener('change', updateMenuState);
})();
