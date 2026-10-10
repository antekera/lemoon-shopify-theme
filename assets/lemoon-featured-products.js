(() => {
  if (window.lemoonFeaturedProductsReady) return;
  window.lemoonFeaturedProductsReady = true;

  const shuffle = (items) => {
    for (let index = items.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [items[index], items[randomIndex]] = [items[randomIndex], items[index]];
    }
    return items;
  };

  const parseTags = (value) => {
    try {
      return JSON.parse(value || '[]');
    } catch {
      return [];
    }
  };

  const initializeCarouselControls = (section) => {
    if (section.dataset.carouselControlsInitialized === 'true') return;
    const track = section.querySelector('.lemoon-featured-products__track');
    const controls = section.querySelector('[data-lemoon-carousel-controls]');
    const previous = controls?.querySelector('[data-lemoon-carousel-prev]');
    const next = controls?.querySelector('[data-lemoon-carousel-next]');
    if (!track || !controls || !previous || !next) return;

    section.dataset.carouselControlsInitialized = 'true';
    const update = () => {
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      controls.hidden = maxScroll <= 1;
      previous.disabled = track.scrollLeft <= 1;
      next.disabled = maxScroll <= track.scrollLeft + 1;
    };
    const scroll = (direction) => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      track.scrollBy({ left: direction * Math.max(track.clientWidth * 0.85, 1), behavior: reducedMotion ? 'auto' : 'smooth' });
    };

    previous.addEventListener('click', () => scroll(-1));
    next.addEventListener('click', () => scroll(1));
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    document.addEventListener('lemoon:featured-products-updated', (event) => {
      if (event.detail?.root === track) update();
    });
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(update);
      observer.observe(track);
      if (track.firstElementChild) observer.observe(track.firstElementChild);
    }
    update();
  };

  const initializeDeferred = (section) => {
    if (section.dataset.initialized === 'true') return;
    const track = section.querySelector('.lemoon-featured-products__track');
    if (!track) return;
    section.dataset.initialized = 'true';

    const currentTags = new Set(parseTags(section.dataset.productTags));
    const currentProductId = section.dataset.currentProductId;
    const randomized = section.hasAttribute('data-randomize');
    const maximum = Number(section.dataset.maxItems) || 15;
    const initial = Math.min(Number(section.dataset.initialItems) || 5, maximum);
    const seen = new Set([currentProductId]);
    const buffer = [];
    const collectionUrl = section.dataset.collectionUrl;
    const carouselView = section.dataset.carouselView || 'carousel';
    const pageNumbers = randomized
      ? shuffle(Array.from({ length: Math.ceil(Number(section.dataset.collectionCount) / 10) }, (_, index) => index + 1))
      : [];
    const randomizedUrl = () => pageNumbers.length
      ? `${collectionUrl}?view=carousel&page=${pageNumbers.shift()}`
      : null;
    let nextUrl = randomized ? randomizedUrl() : `${collectionUrl}?view=${encodeURIComponent(carouselView)}`;
    let loading = false;
    let loaded = 0;

    const fetchPage = async () => {
      const url = new URL(nextUrl, window.location.origin);
      const response = await fetch(`${window.location.origin}${url.pathname}${url.search}`, {
        headers: { Accept: 'text/html' },
      });
      if (!response.ok) throw new Error(`Carousel request failed: ${response.status}`);

      const documentFragment = new DOMParser().parseFromString(await response.text(), 'text/html');
      const results = documentFragment.querySelector('.lemoon-featured-products__results');
      if (!results) throw new Error('Carousel results missing');
      nextUrl = randomized ? randomizedUrl() : results.dataset.nextPage || null;

      const items = [...results.children].filter((item) => {
        const id = item.dataset.productId;
        if (!id || seen.has(id)) return false;
        seen.add(id);
        const tags = parseTags(item.dataset.productTags);
        item.dataset.relatedScore = String(tags.filter((tag) => currentTags.has(tag)).length);
        return true;
      });

      if (randomized) {
        shuffle(items).sort((first, second) => Number(second.dataset.relatedScore) - Number(first.dataset.relatedScore));
      }
      buffer.push(...items);
    };

    const loadBatch = async (count) => {
      if (loading || loaded >= maximum) return;
      loading = true;
      track.setAttribute('aria-busy', 'true');
      const needed = Math.min(count, maximum - loaded);
      try {
        while (buffer.length < needed && nextUrl) await fetchPage();
        const batch = buffer.splice(0, needed);
        if (batch.length) {
          if (loaded === 0) {
            const visibleCards = window.matchMedia('(max-width: 749px)').matches ? 2 : 4;
            batch.slice(0, visibleCards).forEach((item) => {
              const image = item.querySelector('.card__media img:first-child');
              if (image) image.loading = 'eager';
            });
          }
          track.append(...batch);
          loaded += batch.length;
          document.dispatchEvent(new CustomEvent('lemoon:featured-products-updated', { detail: { root: track } }));
        }
        section.dataset.loadedCount = String(loaded);
        section.dataset.ready = 'true';
        if (!loaded && !nextUrl) section.hidden = true;
      } catch (error) {
        if (window.Shopify?.designMode) console.warn(error);
      } finally {
        track.setAttribute('aria-busy', 'false');
        loading = false;
      }
    };

    const preload = () => loadBatch(initial);
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(async (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          await preload();
          if (section.dataset.ready === 'true') observer.disconnect();
        }
      }, { rootMargin: '300px 0px' });
      observer.observe(section);
    } else {
      preload();
    }

    let scrollScheduled = false;
    track.addEventListener('scroll', () => {
      if (scrollScheduled) return;
      scrollScheduled = true;
      requestAnimationFrame(() => {
        scrollScheduled = false;
        const cardWidth = track.firstElementChild?.getBoundingClientRect().width || 0;
        const remaining = track.scrollWidth - track.clientWidth - track.scrollLeft;
        if (loaded > 0 && remaining <= cardWidth * 1.5) loadBatch(5);
      });
    }, { passive: true });
  };

  const initializeRandomized = (section) => {
    if (section.dataset.randomized === 'true') return;
    const track = section.querySelector('.lemoon-featured-products__track');
    if (!track) return;

    const items = [...track.children];
    const matching = shuffle(items.filter((item) => Number(item.dataset.relatedScore) > 0))
      .sort((first, second) => Number(second.dataset.relatedScore) - Number(first.dataset.relatedScore));
    const remaining = shuffle(items.filter((item) => Number(item.dataset.relatedScore) === 0));
    const limit = Number(section.dataset.visibleCount) || items.length;
    const selected = [...matching, ...remaining].slice(0, limit);

    selected.forEach((item) => { item.hidden = false; });
    track.replaceChildren(...selected);
    section.dataset.randomized = 'true';
    document.dispatchEvent(new CustomEvent('lemoon:featured-products-updated', { detail: { root: track } }));
  };

  const initialize = (root = document) => {
    const sections = root.matches?.('.lemoon-featured-products')
      ? [root]
      : root.querySelectorAll('.lemoon-featured-products');
    sections.forEach((section) => {
      initializeCarouselControls(section);
      if (section.hasAttribute('data-deferred')) initializeDeferred(section);
      else if (section.hasAttribute('data-randomize')) initializeRandomized(section);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initialize(), { once: true });
  } else {
    initialize();
  }
  document.addEventListener('shopify:section:load', (event) => initialize(event.target));
})();
