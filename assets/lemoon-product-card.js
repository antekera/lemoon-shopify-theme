(() => {
  if (window.lemoonProductCardReady) return;
  window.lemoonProductCardReady = true;

  const galleryStates = new WeakMap();
  const suppressedClicks = new WeakSet();

  const getGallery = (card, swatch = null) => {
    const colorKey = (swatch?.dataset.colorKey || '').toLocaleLowerCase();
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
      addImage(primary?.currentSrc || primary?.src, primary?.alt);
      addImage(secondary?.currentSrc || secondary?.src, secondary?.alt);
    }

    [...card.querySelectorAll('[data-gallery-src]')]
      .filter((source) => !swatch || !source.dataset.galleryColor || source.dataset.galleryColor.toLocaleLowerCase() === colorKey)
      .sort((a, b) => Number(a.dataset.galleryOrder || a.dataset.galleryIndex) - Number(b.dataset.galleryOrder || b.dataset.galleryIndex))
      .forEach((source) => addImage(source.dataset.gallerySrc, source.dataset.galleryAlt));

    return images;
  };

  const setGalleryIndex = (card, index, wasDragged = false) => {
    const state = galleryStates.get(card);
    if (!state?.images.length) return;
    state.index = Math.max(0, Math.min(index, state.images.length - 1));

    const media = card.querySelector('.card__media .media');
    const primary = media?.querySelector('img:first-child');
    if (!primary) return;
    media.classList.toggle('lemoon-product-card__gallery-active', wasDragged);

    const current = state.images[state.index];
    primary.srcset = '';
    primary.src = current.src;
    primary.alt = current.alt;

    let secondary = media.querySelector('img:nth-child(2)');
    const next = state.images[state.index + 1];
    if (next) {
      if (!secondary) {
        secondary = document.createElement('img');
        secondary.className = 'motion-reduce';
        secondary.loading = 'lazy';
        media.insertBefore(secondary, media.querySelector('[data-gallery-src]'));
      }
      secondary.srcset = '';
      secondary.src = next.src;
      secondary.alt = next.alt;
      secondary.hidden = false;
    } else if (secondary) {
      secondary.hidden = true;
    }
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

  const selectSwatch = (card, swatch) => {
    card.querySelectorAll('.lemoon-product-card__swatch').forEach((button) => {
      const selected = button === swatch;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });

    galleryStates.set(card, { images: getGallery(card, swatch), index: 0 });
    setGalleryIndex(card, 0);
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
    media.dataset.galleryBound = 'true';
    let start = null;

    media.addEventListener('pointerdown', (event) => {
      if (event.button !== 0 && event.pointerType === 'mouse') return;
      start = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
      if (media.setPointerCapture) media.setPointerCapture(event.pointerId);
    });

    media.addEventListener('pointerup', (event) => {
      if (!start) return;
      const deltaX = event.clientX - start.x;
      const deltaY = event.clientY - start.y;
      const cardState = galleryStates.get(card);
      start = null;
      if (!cardState || Math.abs(deltaX) < 36 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return;
      event.preventDefault();
      setGalleryIndex(card, cardState.index + (deltaX < 0 ? 1 : -1), true);
      suppressedClicks.add(card);
      window.setTimeout(() => suppressedClicks.delete(card), 0);
    });

    media.addEventListener('pointercancel', () => { start = null; });
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
      selectSwatch(swatch.closest('.product-card-wrapper'), swatch);
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
