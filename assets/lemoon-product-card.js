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
    const media = secondary.parentElement;
    media.classList.remove('lemoon-product-card__secondary-ready');
    const srcset = selectedSwatch?.dataset.secondarySrcset || secondary.dataset.lazySrcset;
    secondary.removeAttribute('srcset');
    if (srcset) secondary.srcset = srcset;
    const sizes = selectedSwatch?.dataset.secondarySizes || secondary.dataset.lazySizes;
    if (sizes) secondary.sizes = sizes;
    secondary.src = src;
    secondary.alt = selectedSwatch?.dataset.secondaryAlt || secondary.alt;
    secondary.dataset.loadedSrc = src;
    whenImageReady(secondary, () => {
      if (secondary.dataset.loadedSrc === src && secondary.naturalWidth > 0) {
        media.classList.add('lemoon-product-card__secondary-ready');
      }
    }, () => {});
  };

  const whenImageReady = (image, onReady, onError = onReady) => {
    if (typeof image.decode === 'function') {
      image.decode().then(onReady, onError);
    } else if (image.complete) {
      (image.naturalWidth > 0 ? onReady : onError)();
    } else {
      image.addEventListener('load', onReady, { once: true });
      image.addEventListener('error', onError, { once: true });
    }
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

      const incoming = document.createElement('img');
      incoming.className = 'lemoon-product-card__slide-layer';
      incoming.alt = '';
      incoming.draggable = false;
      incoming.setAttribute('aria-hidden', 'true');
      incoming.src = current.src;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const duration = reducedMotion ? 0 : 500;
      const transition = `opacity ${duration}ms ease`;
      incoming.style.cssText = 'z-index:2;opacity:0;pointer-events:none;will-change:opacity';
      incoming.style.setProperty('transition', transition, 'important');
      primary.style.setProperty('transition', transition, 'important');
      primary.style.setProperty('opacity', '1', 'important');
      media.append(incoming);

      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;

        if (!incoming.complete || incoming.naturalWidth === 0) {
          incoming.remove();
          primary.style.setProperty('opacity', '1', 'important');
          if (galleryTransitionFinishes.get(card) === finish) galleryTransitionFinishes.delete(card);
          return;
        }

        const outgoingSrc = primary.currentSrc || primary.src;
        const outgoingAlt = primary.alt;
        incoming.className = primary.className;
        incoming.alt = current.alt;
        incoming.style.cssText = '';
        incoming.removeAttribute('aria-hidden');
        media.replaceChild(incoming, primary);

        const secondary = media.querySelector('img:nth-child(2)');
        if (secondary) {
          secondary.srcset = '';
          secondary.src = outgoingSrc;
          secondary.alt = outgoingAlt;
          secondary.dataset.loadedSrc = outgoingSrc;
        }

        media.classList.add('lemoon-product-card__gallery-active');
        if (galleryTransitionFinishes.get(card) === finish) galleryTransitionFinishes.delete(card);
      };
      galleryTransitionFinishes.set(card, finish);

      if (reducedMotion) {
        whenImageReady(incoming, finish);
        return;
      }

      const startTransition = () => {
        if (finished) return;
        requestAnimationFrame(() => {
          incoming.getBoundingClientRect();
          primary.style.setProperty('opacity', '0', 'important');
          incoming.style.setProperty('opacity', '1', 'important');
        });
        window.setTimeout(finish, duration + 80);
      };

      incoming.addEventListener('transitionend', finish, { once: true });
      whenImageReady(incoming, startTransition, finish);
      return;
    }

    media.classList.remove('lemoon-product-card__gallery-active');
    // Preserve the rendered image while a different color image is loading.
    primary.dataset.pendingSrc = current.src;
    if ((primary.currentSrc || primary.src) === new URL(current.src, document.baseURI).href) return;
    const replacement = new Image();
    replacement.src = current.src;
    whenImageReady(replacement, () => {
      if (primary.dataset.pendingSrc !== current.src || media.querySelector('img:first-child') !== primary) return;
      primary.srcset = '';
      primary.src = current.src;
      primary.alt = current.alt;
    }, () => {});

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
    // Initial markup already contains the selected color's responsive image.
    // Only replace it when the customer actually selects another swatch.
    if (loadImage) {
      setGalleryIndex(card, 0);
      hydrateSecondImage(card, swatch);
    }
    updatePrice(card, swatch);

    if (swatch.dataset.variantUrl) {
      card.querySelectorAll('.card__heading a, .lemoon-product-card__image-link').forEach((link) => {
        link.href = swatch.dataset.variantUrl;
      });
      const variantId = new URL(swatch.dataset.variantUrl, window.location.href).searchParams.get('variant');
      const quickAddVariant = card.querySelector('[data-card-quick-add-variant]');
      const quickAddButton = card.querySelector('.lemoon-product-card__quick-add button[type="submit"]');
      if (variantId && quickAddVariant) quickAddVariant.value = variantId;
      if (quickAddButton) quickAddButton.disabled = swatch.dataset.variantAvailable !== 'true';
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
      if (galleryTransitionFinishes.has(card)) return;
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
  document.addEventListener('lemoon:facets-updated', () => initialize());
  document.addEventListener('lemoon:featured-products-updated', (event) => initialize(event.detail.root));
})();
