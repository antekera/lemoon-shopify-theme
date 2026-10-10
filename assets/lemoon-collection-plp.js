(() => {
  if (window.lemoonCollectionPlpReady) return;
  window.lemoonCollectionPlpReady = true;

  const storageKey = 'lemoon-plp-mobile-columns';
  const initialized = new WeakSet();
  const pageLayouts = new WeakMap();

  window.lemoonSelectProductPage = (container, mobileHtml) => {
    const current = container.querySelector('[data-plp-page-size]');
    if (!current) return;
    if (mobileHtml !== undefined) {
      pageLayouts.set(container, { desktop: current.outerHTML, mobile: mobileHtml, mode: 'desktop' });
    }
    const layouts = pageLayouts.get(container);
    if (!layouts) return;
    const mode = window.matchMedia('(max-width: 749px)').matches ? 'mobile' : 'desktop';
    if (mode === layouts.mode) return;
    const template = document.createElement('template');
    template.innerHTML = layouts[mode];
    const page = template.content.firstElementChild;
    if (!page) return;
    page.querySelectorAll('.scroll-trigger').forEach((item) => {
      item.classList.remove('scroll-trigger--offscreen');
      item.classList.add('scroll-trigger--cancel');
    });
    current.replaceWith(page);
    layouts.mode = mode;
    const lastPage = Number(page.dataset.plpPageCount);
    const url = new URL(window.location.href);
    if (lastPage > 0 && Number(url.searchParams.get('page') || 1) > lastPage) {
      url.searchParams.set('page', String(lastPage));
      window.location.replace(url.href);
    }
  };

  const syncSidebar = (root) => {
    const body = root.querySelector('.lemoon-plp-sidebar-body');
    const header = root.querySelector('.lemoon-plp-sidebar-header');
    if (!body || !header) return;
    const updateShadow = () => {
      header.classList.toggle('lemoon-plp-sidebar-header--scrolled', body.scrollTop > 0);
      body.parentElement.classList.toggle('lemoon-plp-sidebar--more-below', body.scrollHeight - body.clientHeight - body.scrollTop > 1);
    };
    if (!body.dataset.scrollBound) {
      body.dataset.scrollBound = 'true';
      body.addEventListener('scroll', updateShadow, { passive: true });
      const observer = new ResizeObserver(updateShadow);
      observer.observe(body);
      if (body.firstElementChild) observer.observe(body.firstElementChild);
    }
    updateShadow();
  };

  const syncSort = (root) => {
    const select = root.querySelector('#SortBy');
    const menu = root.querySelector('[data-sort-menu]');
    if (!select || !menu) return;
    if (!menu.dataset.bound) {
      menu.dataset.bound = 'true';
      menu.addEventListener('toggle', () => menu.querySelector('summary').setAttribute('aria-expanded', String(menu.open)));
    }
    menu.querySelector('[data-sort-label]').textContent = `${root.dataset.sortPrefix} ${select.selectedOptions[0]?.textContent || ''}`;
    const list = menu.querySelector('[data-sort-options]');
    list.replaceChildren(...Array.from(select.options, (option) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('role', 'option');
      button.setAttribute('aria-selected', String(option.selected));
      button.dataset.sortValue = option.value;
      button.textContent = option.textContent;
      return button;
    }));
    menu.closest('.sorting').classList.add('lemoon-sort-enhanced');
  };

  const applyView = (root, columns) => {
    root.dataset.columns = columns;
    root.style.setProperty('--plp-mobile-columns', columns);
    const toggle = root.querySelector('[data-grid-toggle]');
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(columns === '1'));
      toggle.setAttribute('aria-label', columns === '1' ? toggle.dataset.labelTwo : toggle.dataset.labelOne);
    }
  };

  const sync = (root) => {
    syncSidebar(root);
    syncSort(root);
    const appliedCount = root.querySelectorAll('#ProductGridContainer .lemoon-filter-pill').length;
    const badge = root.querySelector('[data-applied-filter-count]');
    if (badge) {
      badge.textContent = appliedCount;
      badge.hidden = appliedCount === 0;
    }
    const results = root.querySelector('[data-mobile-results]');
    if (results) results.textContent = results.dataset.label.replace('__COUNT__', root.querySelector('#ProductCount')?.dataset.productCount || '0');
    const viewResults = root.querySelector('[data-view-results]');
    if (viewResults) {
      const count = root.querySelector('#ProductCount')?.dataset.productCount || '0';
      viewResults.textContent = count === '1' ? viewResults.dataset.labelOne : viewResults.dataset.label.replace('__COUNT__', count);
    }
    const mobileSort = root.querySelector('#FacetFiltersFormMobile input[name="sort_by"]');
    if (mobileSort) mobileSort.value = root.querySelector('#SortBy')?.value || mobileSort.value;
  };

  const init = () => {
    document.querySelectorAll('.lemoon-plp').forEach((root) => {
      // Old shape links filtered by tag; use only the native metafield filter.
      if (root.dataset.legacyShape) {
        const destination = new URL(root.dataset.collectionUrl, window.location.origin);
        destination.search = window.location.search;
        if (!destination.searchParams.has('filter.p.m.custom.frame_shape')) {
          destination.searchParams.set('filter.p.m.custom.frame_shape', root.dataset.legacyShape);
        }
        destination.searchParams.delete('page');
        ['filter.v.price.gte', 'filter.v.price.lte'].forEach((key) => {
          if (!destination.searchParams.get(key)) destination.searchParams.delete(key);
        });
        window.location.replace(destination.href);
        return;
      }
      if (initialized.has(root)) return;
      initialized.add(root);
      const mobilePage = root.closest('collection-component').querySelector('[data-plp-mobile-grid]');
      if (mobilePage) window.lemoonSelectProductPage(root.querySelector('#ProductGridContainer'), mobilePage.innerHTML);
      let columns = root.dataset.defaultColumns === '1' ? '1' : '2';
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved === '1' || saved === '2') columns = saved;
      } catch (_) { /* Use the configured view when browser storage is unavailable. */ }
      applyView(root, columns);
      const drawer = root.querySelector('menu-drawer.mobile-facets__wrapper');
      const slot = root.querySelector('.lemoon-plp-drawer-slot');
      if (drawer && slot) slot.append(drawer);
      sync(root);
    });
  };

  document.addEventListener('click', (event) => {
    const filterToggle = event.target.closest('[data-filter-toggle]');
    if (filterToggle) {
      const root = filterToggle.closest('.lemoon-plp');
      const hidden = root.classList.toggle('lemoon-plp--filters-hidden');
      const sidebar = root.querySelector('#main-collection-filters');
      filterToggle.setAttribute('aria-expanded', String(!hidden));
      filterToggle.querySelector('span').textContent = hidden ? filterToggle.dataset.labelShow : filterToggle.dataset.labelHide;
      if (sidebar && window.matchMedia('(min-width: 750px)').matches) sidebar.inert = hidden;
      return;
    }
    const sortOption = event.target.closest('[data-sort-value]');
    if (sortOption) {
      const root = sortOption.closest('.lemoon-plp');
      const select = root.querySelector('#SortBy');
      select.value = sortOption.dataset.sortValue;
      const menu = sortOption.closest('[data-sort-menu]');
      menu.open = false;
      menu.querySelector('summary').focus();
      sync(root);
      select.dispatchEvent(new Event('input', { bubbles: true }));
      return;
    }
    document.querySelectorAll('[data-sort-menu][open]').forEach((menu) => {
      if (!menu.contains(event.target)) menu.open = false;
    });
    const toggle = event.target.closest('[data-grid-toggle]');
    if (!toggle) return;
    const root = toggle.closest('.lemoon-plp');
    const columns = root.dataset.columns === '1' ? '2' : '1';
    applyView(root, columns);
    try { window.localStorage.setItem(storageKey, columns); } catch (_) { /* Keep the in-memory preference. */ }
    if (window.matchMedia('(max-width: 749px)').matches) {
      const toolbar = root.querySelector('.lemoon-plp-toolbar');
      const offset = parseFloat(getComputedStyle(toolbar).top) || 0;
      toggle.focus({ preventScroll: true });
      window.scrollTo({ top: window.scrollY + toolbar.getBoundingClientRect().top - offset, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
  });

  document.addEventListener('input', (event) => {
    if (event.target.id !== 'SortBy') return;
    const root = event.target.closest('.lemoon-plp');
    if (root) sync(root);
  });
  document.addEventListener('lemoon:facets-updated', () => document.querySelectorAll('.lemoon-plp').forEach(sync));
  document.addEventListener('keydown', (event) => {
    const menu = event.target.closest('[data-sort-menu]');
    if (!menu) return;
    if (event.key === 'Escape') { menu.open = false; menu.querySelector('summary').focus(); return; }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    menu.open = true;
    const options = Array.from(menu.querySelectorAll('[data-sort-value]'));
    let index = options.indexOf(document.activeElement);
    if (event.key === 'Home') index = 0;
    else if (event.key === 'End') index = options.length - 1;
    else index = (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
    options[index]?.focus();
  });
  window.addEventListener('resize', () => {
    document.querySelectorAll('.lemoon-plp').forEach((root) => {
      window.lemoonSelectProductPage(root.querySelector('#ProductGridContainer'));
      const sidebar = root.querySelector('#main-collection-filters');
      if (sidebar) sidebar.inert = window.matchMedia('(min-width: 750px)').matches && root.classList.contains('lemoon-plp--filters-hidden');
    });
  });
  document.addEventListener('shopify:section:load', init);
  document.addEventListener('DOMContentLoaded', init);
  init();
})();
