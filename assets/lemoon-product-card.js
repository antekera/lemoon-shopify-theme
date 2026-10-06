(() => {
  if (window.lemoonProductCardReady) return;
  window.lemoonProductCardReady = true;

  const galleryStates = new WeakMap();
  const galleryTransitionFinishes = new WeakMap();
  const suppressedClicks = new WeakSet();
  const galleryObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        hydrateSecondImage(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '240px 0px' })
    : null;

  const getGallery = (card, swatch = null) => {
    const images = [];
    const addImage = (src, alt) => {
      if (!src || images.some((image) => image.src === src)) return;
      images.push({ src, alt: alt || '' });
    };

    if (swatch) {
      addImage(swatch.dataset.primarySrc, swatch.dataset.primaryAlt);
      addImage(swatch.dataset.secondarySrc, swatch.dataset.secondaryAlt);
    } else {
      const media = card.querySelector('.card__media .media');
      const primary = media?.querySelector('img:first-child');
      const secondary = media?.querySelector('img:nth-child(2)');
      addImage(primary?.currentSrc || primary?.getAttribute('src'), primary?.alt);
      addImage(secondary?.dataset.lazySrc || secondary?.currentSrc || secondary?.getAttribute('src'), secondary?.alt);
    }

    return images.slice(0, 2);
  };

  const hydrateSecondImage = (card, swatch = null) => {
    const secondary = card.querySelector('.card__media .media img:nth-child(2)');
    if (!secondary) return;
    const selectedSwatch = swatch || card.querySelector('.lemoon-product-card__swatch.is-selected');
    const src = selectedSwatch?.dataset.secondarySrc || secondary.dataset.lazySrc;
    if (!src || secondary.dataset.loadedSrc === src) return;
    const srcset = selectedSwatch?.dataset.secondarySrcset || secondary.dataset.lazySrcset;
    secondary.removeAttribute('srcset');
    if (srcset) secondary.srcset = srcset;
    const sizes = selectedSwatch?.dataset.secondarySizes || secondary.dataset.lazySizes;
    if (sizes) secondary.sizes = sizes;
    secondary.src = src;
    secondary.alt = selectedSwatch?.dataset.secondaryAlt || secondary.alt;
    secondary.dataset.loadedSrc = src;
  };

  const setGalleryIndex = (card, index, slideDirection = 0) => {
    galleryTransitionFinishes.get(card)?.();
    const state = galleryStates.get(card);
    if (!state?.images.length) return;
    state.index = ((index % state.images.length) + state.images.length) % state.images.length;

    const media = card.querySelector('.card__media .media');
    const primary = media?.querySelector('img:first-child');
    if (!primary) return;
    const current = state.images[state.index];
    if (slideDirection && (primary.currentSrc || primary.src) !== current.src) {
      media.classList.add('lemoon-product-card__gallery-active');
      card.dataset.gallerySliding = 'true';

      const incoming = document.createElement('img');
      incoming.className = 'lemoon-product-card__slide-layer';
      incoming.alt = '';
      incoming.setAttribute('aria-hidden', 'true');
      incoming.src = current.src;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const duration = reducedMotion ? 0 : 260;
      const transition = `transform ${duration}ms cubic-bezier(.2, .7, .2, 1)`;
      const enterFrom = `translateX(${slideDirection < 0 ? '100%' : '-100%'})`;
      const exitTo = `translateX(${slideDirection < 0 ? '-100%' : '100%'})`;
      incoming.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;z-index:2;opacity:1;pointer-events:none;will-change:transform';
      incoming.style.setProperty('transition', transition, 'important');
      incoming.style.setProperty('transform', enterFrom, 'important');
      primary.style.setProperty('transition', transition, 'important');
      primary.style.setProperty('transform', 'translateX(0)', 'important');
      media.append(incoming);

      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        primary.srcset = '';
        primary.src = current.src;
        primary.alt = current.alt;
        incoming.remove();
        media.classList.remove('lemoon-product-card__gallery-sliding');
        primary.style.removeProperty('transition');
        primary.style.removeProperty('transform');
        delete card.dataset.gallerySliding;
        if (galleryTransitionFinishes.get(card) === finish) galleryTransitionFinishes.delete(card);
      };
      galleryTransitionFinishes.set(card, finish);

      if (reducedMotion) {
        finish();
        return;
      }

      const startTransition = () => {
        if (finished) return;
        media.classList.add('lemoon-product-card__gallery-sliding');
        requestAnimationFrame(() => {
          incoming.getBoundingClientRect();
          primary.style.setProperty('transform', exitTo, 'important');
          incoming.style.setProperty('transform', 'translateX(0)', 'important');
        });
        window.setTimeout(finish, duration + 80);
      };

      incoming.addEventListener('transitionend', finish, { once: true });
      incoming.addEventListener('error', finish, { once: true });
      if (typeof incoming.decode === 'function') incoming.decode().then(startTransition, finish);
      else if (incoming.complete && incoming.naturalWidth > 0) startTransition();
      else incoming.addEventListener('load', startTransition, { once: true });
      return;
    }

    media.classList.remove('lemoon-product-card__gallery-active');
    primary.srcset = '';
    primary.src = current.src;
    primary.alt = current.alt;

  };

  const updatePrice = (card, swatch) => {
    const price = card.querySelector('.card-information > .price');
    if (!price || !swatch.dataset.price) return;
    const comparePrice = swatch.dataset.comparePrice;
    price.classList.toggle('price--on-sale', Boolean(comparePrice));
    const regular = price.querySelector('.price__regular .price-item--regular');
    const sale = price.querySelector('.price__sale .price-item--sale');
    const previous = price.querySelector('.price__sale s.price-item--regular');
    if (regular) regular.textContent = swatch.dataset.price;
    if (sale) sale.textContent = swatch.dataset.price;
    if (previous) previous.textContent = comparePrice || '';
  };

  const selectSwatch = (card, swatch, loadImage = false) => {
    card.querySelectorAll('.lemoon-product-card__swatch').forEach((button) => {
      const selected = button === swatch;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });

    galleryStates.set(card, { images: getGallery(card, swatch), index: 0 });
    setGalleryIndex(card, 0);
    if (loadImage) hydrateSecondImage(card, swatch);
    updatePrice(card, swatch);

    if (swatch.dataset.variantUrl) {
      card.querySelectorAll('.card__heading a, .lemoon-product-card__image-link').forEach((link) => {
        link.href = swatch.dataset.variantUrl;
      });
    }
  };

  const bindGallery = (card) => {
    const media = card.querySelector('.card__media .media');
    if (!media || media.dataset.galleryBound) return;
    const gestureTarget = card;
    media.dataset.galleryBound = 'true';
    let start = null;

    if (galleryObserver) {
      if (!card.dataset.galleryObserved) {
        card.dataset.galleryObserved = 'true';
        galleryObserver.observe(card);
      }
    } else {
      media.addEventListener('pointerenter', () => hydrateSecondImage(card), { once: true });
    }

    if (!card.hasAttribute('data-enable-gallery-swipe')) return;

    gestureTarget.addEventListener('pointerdown', (event) => {
      if (card.dataset.gallerySliding) return;
      const bounds = media.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) return;
      if (event.button !== 0 && event.pointerType === 'mouse') return;
      start = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
      if (gestureTarget.setPointerCapture) gestureTarget.setPointerCapture(event.pointerId);
    });

    gestureTarget.addEventListener('pointerup', (event) => {
      if (!start) return;
      if (event.pointerId !== start.pointerId) return;
      const deltaX = event.clientX - start.x;
      const deltaY = event.clientY - start.y;
      const cardState = galleryStates.get(card);
      start = null;
      if (!cardState || Math.abs(deltaX) < 36 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return;
      event.preventDefault();
      setGalleryIndex(card, cardState.index + (deltaX < 0 ? 1 : -1), deltaX < 0 ? -1 : 1);
      suppressedClicks.add(card);
      window.setTimeout(() => suppressedClicks.delete(card), 0);
    });

    gestureTarget.addEventListener('pointercancel', () => { start = null; });
  };

  const initialize = (root = document) => {
    root.querySelectorAll('.product-card-wrapper[data-product-id]').forEach((card) => {
      bindGallery(card);
      const selected = card.querySelector('.lemoon-product-card__swatch.is-selected')
        || card.querySelector('.lemoon-product-card__swatch');
      if (selected) selectSwatch(card, selected);
      else {
        galleryStates.set(card, { images: getGallery(card), index: 0 });
        setGalleryIndex(card, 0);
      }
    });
  };

  document.addEventListener('click', (event) => {
    const card = event.target.closest('.product-card-wrapper[data-product-id]');
    if (card && suppressedClicks.has(card)) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    const swatch = event.target.closest('.lemoon-product-card__swatch');
    if (swatch) {
      selectSwatch(swatch.closest('.product-card-wrapper'), swatch, true);
      return;
    }

    if (!card || event.target.closest('a, button, .lemoon-product-card__try-on')) return;
    const productLink = card.querySelector('.lemoon-product-card__image-link');
    if (productLink?.href) window.location.assign(productLink.href);
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => initialize());
  else initialize();
  document.addEventListener('shopify:section:load', (event) => initialize(event.target));
})();
