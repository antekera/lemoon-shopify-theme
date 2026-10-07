(() => {
  if (window.lemoonHeaderNavReady) return;
  window.lemoonHeaderNavReady = true;
  const initialized = new WeakSet();

  const initialize = () => {
    document.querySelectorAll('.lemoon-header__quick-nav--desktop').forEach((nav) => {
      if (initialized.has(nav)) return;
      initialized.add(nav);
      const links = [...nav.querySelectorAll('.lemoon-header__quick-link')];
      const active = links.find((link) => link.getAttribute('aria-current') === 'page');
      let hovered = null;

      const update = () => {
        const focused = links.find((link) => link === document.activeElement);
        const target = hovered || focused || active;
        if (!target || !nav.getClientRects().length) {
          nav.style.setProperty('--nav-indicator-opacity', '0');
          return;
        }
        const navRect = nav.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        nav.style.setProperty('--nav-indicator-left', `${targetRect.left - navRect.left + nav.scrollLeft}px`);
        nav.style.setProperty('--nav-indicator-width', `${targetRect.width}px`);
        nav.style.setProperty('--nav-indicator-opacity', '1');
      };

      links.forEach((link) => {
        link.addEventListener('pointerenter', () => {
          hovered = link;
          update();
        });
      });
      nav.addEventListener('pointerleave', () => {
        hovered = null;
        update();
      });
      nav.addEventListener('focusin', update);
      nav.addEventListener('focusout', () => requestAnimationFrame(update));
      new ResizeObserver(update).observe(nav);
      if (document.fonts) document.fonts.ready.then(update);
      update();
      nav.classList.add('lemoon-header__quick-nav--sliding');
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize);
  else initialize();
  document.addEventListener('shopify:section:load', initialize);
})();
