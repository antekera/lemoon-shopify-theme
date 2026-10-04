(() => {
  const footerSections = document.querySelectorAll('[data-lemoon-footer]');
  if (!footerSections.length) return;

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
