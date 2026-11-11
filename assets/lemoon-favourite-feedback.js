(() => {
  const wishlistLabel = document.currentScript?.dataset.wishlistViewProduct || 'View product';
  const wishlistPage = /\/apps\/page\/wishlist\/?$/.test(window.location.pathname);
  const mountedWishlists = new WeakSet();
  const mountWishlist = (wishlistRoot) => {
    if (!wishlistRoot || mountedWishlists.has(wishlistRoot)) return;
    mountedWishlists.add(wishlistRoot);
    const updateWishlistLinks = () => {
      wishlistRoot.querySelectorAll('.Vtl-WishlistProduct').forEach((card) => {
        const productLink = card.querySelector('a.Vtl-WishlistProduct__Link[href]');
        const existingLink = card.querySelector('.lemoon-wishlist-product-link');
        if (!productLink) {
          existingLink?.remove();
          return;
        }
        const url = new URL(productLink.href, window.location.href);
        if (url.origin !== window.location.origin || !url.pathname.includes('/products/')) {
          existingLink?.remove();
          return;
        }
        const link = existingLink || document.createElement('a');
        if (!existingLink) {
          link.className = 'button lemoon-wishlist-product-link';
          link.textContent = wishlistLabel;
          card.append(link);
        }
        if (link.href !== url.href) link.href = url.href;
      });
    };
    new MutationObserver(updateWishlistLinks).observe(wishlistRoot, { childList: true, subtree: true, attributes: true, attributeFilter: ['href'] });
    updateWishlistLinks();
  };
  if (wishlistPage) {
    const main = document.querySelector('#MainContent');
    if (main) {
      const findWishlist = () => mountWishlist(main.querySelector('.vtl-proxy-page-wishlist'));
      new MutationObserver(findWishlist).observe(main, { childList: true, subtree: true });
      findWishlist();
    }
  }
  let audioContext;
  const play = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      audioContext ||= new AudioContextClass();
      if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const now = audioContext.currentTime;
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(620, now);
      oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.1);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.035, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.15);
    } catch { /* Audio feedback is optional. */ }
  };
  const toast = document.querySelector('[data-favourite-toast]');
  let toastTimer;
  const hideToast = () => { if (toast) toast.hidden = true; };
  const showToast = () => {
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.hidden = false;
    toastTimer = setTimeout(() => {
      if (!toast.matches(':hover, :focus-within')) hideToast();
    }, 8000);
  };
  toast?.querySelector('[data-favourite-toast-close]')?.addEventListener('click', hideToast);
  // Keep the provider's own product-page control and its state; never mirror a
  // separate local wishlist. The app can inject or replace its widget later.
  let placementFrame = 0;
  const placeProductWidget = () => {
    placementFrame = 0;
    const slot = document.querySelector('[data-product-favourite-slot]');
    if (!slot?.dataset.productId) return;
    const expected = `Vtl-WishlistIcon__ProductPageWrapper--Id-${slot.dataset.productId}`;
    const widget = [...document.querySelectorAll('.Vtl-WishlistIcon__ProductPageWrapper')]
      .find((element) => element.classList.contains(expected));
    if (widget && widget.parentElement !== slot) slot.replaceChildren(widget);
  };
  const schedulePlacement = () => {
    if (!placementFrame) placementFrame = requestAnimationFrame(placeProductWidget);
  };
  const productRoot = document.querySelector('#MainContent');
  if (productRoot?.querySelector('[data-product-favourite-slot]')) {
    new MutationObserver(schedulePlacement).observe(productRoot, { childList: true, subtree: true });
  }
  schedulePlacement();
  const appButtonSelector = '.Vtl-CollectionCardWidget .Vtl-WishlistButton__WishlistIconButton, [data-product-favourite-slot] .Vtl-WishlistButton__WishlistIconButton';
  const watched = new WeakSet();
  const watchAppSave = (button) => {
    if (watched.has(button) || !/^(añadir|agregar|add|guardar|save)\b/i.test(button.getAttribute('aria-label') || '')) return;
    watched.add(button);
    const observer = new MutationObserver(() => {
      if (!/^(quitar|eliminar|remove|delete|añadido|agregado|added|saved)\b/i.test(button.getAttribute('aria-label') || '')) return;
      observer.disconnect();
      watched.delete(button);
      showToast();
    });
    observer.observe(button, { attributes: true, attributeFilter: ['aria-label'] });
    setTimeout(() => { observer.disconnect(); watched.delete(button); }, 10000);
  };
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const button = event.target.closest(appButtonSelector);
    if (button) watchAppSave(button);
  }, true);
  document.addEventListener('click', (event) => {
    const button = event.target.closest(appButtonSelector);
    if (!button) return;
    if (button.matches('.Vtl-WishlistButton__WishlistIconButton')) watchAppSave(button);
    const adding = /^(añadir|agregar|add|guardar|save)\b/i.test(button.getAttribute('aria-label') || '');
    if (!adding) return;
    play();
    button.classList.remove('lemoon-favourite-animating');
    void button.offsetWidth;
    button.classList.add('lemoon-favourite-animating');
  }, true);
  document.addEventListener('animationend', (event) => {
    if (event.animationName === 'lemoon-card-favourite-burst') event.target.classList.remove('lemoon-favourite-animating');
  });
})();
