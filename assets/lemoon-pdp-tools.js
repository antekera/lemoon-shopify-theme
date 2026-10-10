export function whiteCanvasBounds(data, width, height) {
  const white = (index) => data[index + 3] < 16 || (Math.min(data[index], data[index + 1], data[index + 2]) > 239 && Math.max(data[index], data[index + 1], data[index + 2]) - Math.min(data[index], data[index + 1], data[index + 2]) < 12);
  const corners = [0, (width - 1) * 4, (height - 1) * width * 4, (width * height - 1) * 4];
  if (!corners.every(white)) return null;
  let left = width, top = height, right = -1, bottom = -1;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    if (!white((y * width + x) * 4)) { left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y); }
  }
  if (right < left || (right - left) < width * .15 || (bottom - top) < height * .04) return null;
  const margin = Math.ceil(width * .025);
  left = Math.max(0, left - margin); right = Math.min(width - 1, right + margin);
  top = Math.max(0, top - margin); bottom = Math.min(height - 1, bottom + margin);
  return { x: left / width, y: top / height, width: (right - left + 1) / width, height: (bottom - top + 1) / height };
}

if (typeof window !== 'undefined' && !customElements.get('lemoon-deferred-image')) {
  customElements.define('lemoon-deferred-image', class extends HTMLElement {
    connectedCallback() {
      const template = this.querySelector('template');
      if (!template) return;
      const panel = this.closest('[data-media-panel], .product__media-item') || this.parentElement;
      const load = () => {
        if (!this.isConnected) return;
        const content = template.content.cloneNode(true);
        content.querySelectorAll('img').forEach((image) => image.loading = 'eager');
        this.replaceWith(content);
      };
      this.visibility = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.1)) load();
      }, { threshold: 0.1 });
      this.visibility.observe(panel);
      this.selection = new MutationObserver(() => {
        if (panel.matches('.is-active, [data-media-panel]:not([hidden])')) load();
      });
      this.selection.observe(panel, { attributes: true, attributeFilter: ['class', 'hidden'] });
    }
    disconnectedCallback() {
      this.visibility?.disconnect();
      this.selection?.disconnect();
    }
  });
}

if (typeof window !== 'undefined') {
  if (!customElements.get('lemoon-size-guide')) customElements.define('lemoon-size-guide', class extends HTMLElement {
    connectedCallback() {
      if (this.ready) return;
      this.ready = true;
      this.tabs = [...this.querySelectorAll('[data-size-tab]')];
      this.selectTab = (tab, focus = false) => {
        this.tabs.forEach((item) => {
          const selected = item === tab;
          item.setAttribute('aria-selected', String(selected));
          item.tabIndex = selected ? 0 : -1;
          this.querySelector(`[data-size-panel="${item.dataset.sizeTab}"]`)?.toggleAttribute('hidden', !selected);
        });
        if (focus) tab.focus();
      };
      this.addEventListener('click', (event) => {
        const tab = event.target.closest('[data-size-tab]');
        if (tab && this.contains(tab)) this.selectTab(tab);
      });
      this.addEventListener('keydown', (event) => {
        const current = event.target.closest('[data-size-tab]');
        if (!current || !this.contains(current)) return;
        const index = this.tabs.indexOf(current);
        let next = index;
        if (event.key === 'ArrowRight') next = (index + 1) % this.tabs.length;
        else if (event.key === 'ArrowLeft') next = (index - 1 + this.tabs.length) % this.tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = this.tabs.length - 1;
        else return;
        event.preventDefault();
        this.selectTab(this.tabs[next], true);
      });
    }
  });

  if (!customElements.get('lemoon-product-tools')) customElements.define('lemoon-product-tools', class extends HTMLElement {
    connectedCallback() {
      if (this.ready) return;
      this.ready = true;
      const favourite = this.querySelector('[data-favourite]');
      const restore = () => {
        try { favourite?.setAttribute('aria-pressed', String(JSON.parse(localStorage.getItem('lemoon-saved-products') || '[]').includes(this.dataset.productId))); }
        catch { if (favourite) favourite.hidden = true; }
      };
      restore();
      this.addEventListener('click', (event) => {
        if (event.target.closest('[data-favourite]')) {
          try {
            const saved = JSON.parse(localStorage.getItem('lemoon-saved-products') || '[]');
            const next = saved.includes(this.dataset.productId) ? saved.filter((id) => id !== this.dataset.productId) : [...saved, this.dataset.productId];
            localStorage.setItem('lemoon-saved-products', JSON.stringify(next)); restore();
          } catch { favourite.hidden = true; }
        }
        if (event.target.closest('[data-size-open]')) this.querySelector('dialog').showModal();
        if (event.target.closest('[data-size-close]')) this.querySelector('dialog').close();
      });
      const dialog = this.querySelector('dialog');
      dialog?.addEventListener('close', () => this.querySelector('[data-size-open]').focus());
      dialog?.addEventListener('click', (event) => { const rect = dialog.getBoundingClientRect(); if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close(); });
      dialog?.addEventListener('change', (event) => {
        if (!event.target.matches('[data-units]')) return;
        dialog.querySelectorAll('[data-mm]').forEach((label) => { label.textContent = event.target.value === 'in' ? `${(Number(label.dataset.mm) / 25.4).toFixed(2)} in` : `${label.dataset.mm} mm`; });
      });
    }
  });
  document.addEventListener('change', (event) => {
    if (!event.target.matches('input[name="id"]')) return;
    const productInfo = event.target.closest('.lemoon-standard-pdp');
    const link = productInfo?.querySelector('.lemoon-lens-config-cta');
    if (!link || !link.hasAttribute('href')) return;
    const url = new URL(link.href);
    if (event.target.value) url.searchParams.set('variant', event.target.value);
    else url.searchParams.delete('variant');
    link.href = url.toString();
  });
  const mobileSummaries = new WeakSet();
  const setupMobileSummaries = () => document.querySelectorAll('.lemoon-standard-pdp, lemoon-eyewear').forEach((host) => {
    if (mobileSummaries.has(host)) return;
    const grid = host.querySelector('.product, .lemoon-pdp__grid');
    const info = host.querySelector('.product__info-container, .lemoon-pdp__info');
    if (!grid || !info) return;
    mobileSummaries.add(host);
    const summary = document.createElement('div');
    summary.className = 'lemoon-mobile-summary';
    summary.hidden = true;
    const nodes = [...info.children].filter((node) => node.matches('.lemoon-breadcrumb, .product__title, lemoon-product-tools:has(.lemoon-product-heading), [id^="price-"], .product__tax, .lemoon-pdp__price, .lemoon-pdp__tax'));
    const homes = nodes.map((node) => {
      const marker = document.createComment('');
      node.before(marker);
      return { node, marker };
    });
    const heading = info.querySelector('.lemoon-product-heading');
    const priceNodes = nodes.filter((node) => node.matches('[id^="price-"], .product__tax, .lemoon-pdp__price, .lemoon-pdp__tax'));
    const priceRow = document.createElement('div');
    priceRow.className = 'lemoon-mobile-price-row';
    grid.prepend(summary);
    const mobile = window.matchMedia('(max-width: 749px)');
    const update = () => {
      summary.hidden = !mobile.matches;
      homes.forEach(({ node, marker }) => {
        if (mobile.matches) summary.append(node);
        else marker.after(node);
      });
      if (heading && priceNodes.length) {
        heading.after(priceRow);
        priceNodes.forEach((node) => priceRow.append(node));
      } else priceRow.remove();
    };
    mobile.addEventListener('change', update);
    update();
  });
  const draggableGalleries = new WeakSet();
  const setupGalleryDrag = () => document.querySelectorAll('.lemoon-pdp__stage, .lemoon-standard-pdp .product__media-list').forEach((stage) => {
    if (draggableGalleries.has(stage)) return;
    draggableGalleries.add(stage);
    let gesture = null;
    let suppressClick = false;
    const mobile = window.matchMedia('(max-width: 989px)');
    stage.addEventListener('pointerdown', (event) => {
      if (!mobile.matches || event.pointerType === 'touch' || event.button !== 0 || event.target.closest('video, iframe, model-viewer')) return;
      gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, left: stage.scrollLeft, dragged: false };
    });
    stage.addEventListener('pointermove', (event) => {
      if (!gesture || gesture.id !== event.pointerId) return;
      const dx = event.clientX - gesture.x;
      if (!gesture.dragged) {
        if (Math.abs(event.clientY - gesture.y) > Math.abs(dx)) { gesture = null; return; }
        if (Math.abs(dx) < 8) return;
        gesture.dragged = true;
        stage.setPointerCapture(event.pointerId);
        stage.classList.add('is-dragging');
      }
      event.preventDefault();
      stage.scrollLeft = gesture.left - dx;
    });
    const finish = (event) => {
      if (!gesture || gesture.id !== event.pointerId) return;
      const current = gesture;
      gesture = null;
      if (!current.dragged) return;
      suppressClick = true;
      stage.classList.remove('is-dragging');
      if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
      const offset = event.clientX - current.x;
      const index = Math.round(current.left / stage.clientWidth);
      const next = event.type !== 'pointercancel' && Math.abs(offset) > stage.clientWidth * .15 ? index + (offset < 0 ? 1 : -1) : Math.round(stage.scrollLeft / stage.clientWidth);
      stage.scrollTo({ left: Math.max(0, next) * stage.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      setTimeout(() => { suppressClick = false; }, 0);
    };
    stage.addEventListener('pointerup', finish);
    stage.addEventListener('pointercancel', finish);
    stage.addEventListener('click', (event) => {
      if (suppressClick) { event.preventDefault(); event.stopImmediatePropagation(); }
    }, true);
    stage.addEventListener('dragstart', (event) => { if (mobile.matches) event.preventDefault(); });
  });
  const processed = new WeakSet();
  const cropImage = async (img) => {
    if (processed.has(img) || /card-model|modelo|model view/i.test(img.alt)) return;
    processed.add(img);
    const source = new Image();
    source.crossOrigin = 'anonymous';
    source.src = img.currentSrc || img.src;
    try {
      await source.decode();
      const canvas = document.createElement('canvas');
      canvas.width = 256; canvas.height = Math.max(1, Math.round(256 * source.naturalHeight / source.naturalWidth));
      const context = canvas.getContext('2d', { willReadFrequently: true });
      context.drawImage(source, 0, 0, canvas.width, canvas.height);
      const bounds = whiteCanvasBounds(context.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height);
      if (!bounds || !img.isConnected) return;
      const frame = document.createElement('span'); frame.className = 'lemoon-image-crop';
      frame.style.setProperty('--crop-ratio', bounds.width * source.naturalWidth / (bounds.height * source.naturalHeight));
      frame.style.setProperty('--crop-width', `${100 / bounds.width}%`);
      frame.style.setProperty('--crop-left', `${-100 * bounds.x / bounds.width}%`);
      frame.style.setProperty('--crop-top', `${-100 * bounds.y / bounds.height}%`);
      img.before(frame); frame.append(img);
    } catch {}
  };
  const bleedGalleries = () => document.querySelectorAll('.lemoon-standard-pdp media-gallery, .lemoon-pdp__gallery').forEach((gallery) => gallery.style.setProperty('--lemoon-gallery-bleed', `${Math.max(0, gallery.getBoundingClientRect().left)}px`));
  window.addEventListener('resize', bleedGalleries);
  const scan = () => {
    setupMobileSummaries();
    setupGalleryDrag();
    bleedGalleries();
    document.querySelectorAll('.lemoon-pdp__image-button > img, .lemoon-standard-pdp .media-type-image .product__media > img').forEach((img) => {
    if (img.complete && img.naturalWidth) cropImage(img);
    else img.addEventListener('load', () => cropImage(img), { once: true });
    });
  };
  scan();
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
}

if (typeof window !== 'undefined' && !customElements.get('lemoon-sticky-purchase')) {
  customElements.define('lemoon-sticky-purchase', class extends HTMLElement {
    connectedCallback() {
      this.host = this.closest('product-info, lemoon-eyewear');
      if (!this.host) return;
      this.configure = this.querySelector('[data-sticky-configure]');
      this.price = this.querySelector('[data-sticky-price]');
      this.image = this.querySelector('img');
      this.hidden = false;
      this.setAttribute('inert', '');
      this.setAttribute('aria-hidden', 'true');
      this.resizeObserver = new ResizeObserver(() => {
        document.documentElement.style.setProperty('--lemoon-sticky-purchase-height', `${this.getBoundingClientRect().height}px`);
      });
      this.resizeObserver.observe(this);
      document.documentElement.style.setProperty('--lemoon-sticky-purchase-height', `${this.getBoundingClientRect().height}px`);
      this.setVisible = (visible) => {
        if (this.classList.contains('is-visible') !== visible) this.classList.toggle('is-visible', visible);
        this.toggleAttribute('inert', !visible);
        this.setAttribute('aria-hidden', String(!visible));
        document.documentElement.classList.toggle('lemoon-sticky-purchase-active', visible);
      };
      this.update = () => {
        const submit = this.host.querySelector('[data-add], .product-form__submit');
        const frameOnly = this.host.querySelector('[data-frame-only-add], .lemoon-frame-only-add');
        const framePurchase = frameOnly || submit;
        const configure = this.host.querySelector('[data-configure], .lemoon-lens-config-cta');
        if (!framePurchase) { this.setVisible(false); return; }
        const header = document.querySelector('sticky-header');
        const top = Math.max(0, header?.getBoundingClientRect().bottom || 0);
        const rect = submit.getBoundingClientRect();
        const configVisible = configure && !configure.hidden && configure.getClientRects().length > 0;
        const actionsBottom = Math.max(rect.bottom, configVisible ? configure.getBoundingClientRect().bottom : 0);
        const shouldHide = (!rect.height && !configVisible) || actionsBottom > top;
        this.setVisible(!shouldHide);
        const configureLabel = this.configure.dataset.label;
        if (configureLabel && this.configure.textContent !== configureLabel) this.configure.textContent = configureLabel;
        if (this.configure.hidden !== !configure) this.configure.hidden = !configure;
        const configDisabled = !configure || Boolean(configure.disabled) || configure.getAttribute('aria-disabled') === 'true';
        if (this.configure.disabled !== configDisabled) this.configure.disabled = configDisabled;
        const nativePrice = this.host.querySelector('[data-price]') || this.host.querySelector('.price:not(.price--on-sale) .price__regular .price-item--regular, .price.price--on-sale .price-item--sale');
        if (nativePrice && this.price.textContent !== nativePrice.textContent.trim()) this.price.textContent = nativePrice.textContent.trim();
        const photo = this.host.querySelector('[data-media-panel]:not([hidden]) img, .product__media-item.is-active img');
        if (this.image && photo) {
          const src = photo.currentSrc || photo.src;
          if (src && this.image.getAttribute('src') !== src) { this.image.removeAttribute('srcset'); this.image.setAttribute('src', src); }
        }
      };
      this.onScroll = () => {
        if (this.frame) return;
        this.frame = requestAnimationFrame(() => { this.frame = null; this.update(); });
      };
      this.onClick = (event) => {
        const configure = this.host.querySelector('[data-configure], .lemoon-lens-config-cta');
        if (event.target.closest('[data-sticky-configure]') && !this.configure.disabled) {
          configure.click();
          if (configure.tagName !== 'A') {
            const heading = this.host.querySelector('[data-flow-title]');
            heading?.scrollIntoView({ block: 'center' });
            heading?.focus({ preventScroll: true });
          }
        }
      };
      this.addEventListener('click', this.onClick);
      this.observer = new MutationObserver(this.update);
      this.observer.observe(this.host, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['disabled', 'aria-disabled', 'aria-busy', 'hidden', 'class', 'src'] });
      window.addEventListener('scroll', this.onScroll, { passive: true });
      window.addEventListener('resize', this.onScroll);
      this.update();
    }
    disconnectedCallback() {
      this.observer?.disconnect();
      this.resizeObserver?.disconnect();
      window.removeEventListener('scroll', this.onScroll);
      window.removeEventListener('resize', this.onScroll);
      this.removeEventListener('click', this.onClick);
      cancelAnimationFrame(this.frame);
      document.documentElement.classList.remove('lemoon-sticky-purchase-active');
      document.documentElement.style.removeProperty('--lemoon-sticky-purchase-height');
    }
  });
}

if (typeof window !== 'undefined' && !customElements.get('lemoon-thumbnail-rail')) {
  customElements.define('lemoon-thumbnail-rail', class extends HTMLElement {
    connectedCallback() {
      this.list = this.querySelector('.thumbnail-list, .lemoon-pdp__thumbnails');
      if (!this.list) return;
      this.gallery = this.closest('media-gallery, .lemoon-pdp__gallery');
      this.desktop = window.matchMedia('(min-width: 990px)');
      this.update = () => {
        if (this.gallery) this.gallery.style.setProperty('--lemoon-gallery-bleed', `${Math.max(0, this.gallery.getBoundingClientRect().left)}px`);
        const maximum = this.list.scrollHeight - this.list.clientHeight;
        if (this.targetScroll !== undefined && Math.abs(this.list.scrollTop - this.targetScroll) < 1) this.targetScroll = undefined;
        const position = this.targetScroll ?? this.list.scrollTop;
        this.querySelectorAll('[data-rail-direction]').forEach((button) => {
          const disabled = !this.desktop.matches || maximum < 2 || (button.dataset.railDirection === 'up' ? position < 2 : position >= maximum - 1);
          button.disabled = disabled;
          button.setAttribute('aria-hidden', String(disabled));
        });
      };
      this.onClick = (event) => {
        const arrow = event.target.closest('[data-rail-direction]');
        if (!arrow || arrow.disabled) return;
        const maximum = Math.max(0, this.list.scrollHeight - this.list.clientHeight);
        const current = this.targetScroll ?? this.list.scrollTop;
        const direction = arrow.dataset.railDirection === 'up' ? -1 : 1;
        let target = Math.max(0, Math.min(maximum, current + direction * 64));
        if (maximum - target <= 2) target = maximum;
        if (target <= 2) target = 0;
        this.targetScroll = target;
        this.update();
        this.list.scrollTo({ top: target, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      };
      this.revealSelected = () => {
        if (!this.desktop.matches) return;
        const selected = this.list.querySelector('button[aria-current], button[aria-pressed=true]');
        if (selected) {
          const item = selected.closest('li') || selected;
          const rect = item.getBoundingClientRect(), viewport = this.list.getBoundingClientRect();
          if (rect.top < viewport.top || rect.bottom > viewport.bottom) this.list.scrollTop += rect.top - viewport.top;
        }
        this.update();
      };
      this.addEventListener('click', this.onClick);
      this.onScrollEnd = () => { this.targetScroll = undefined; this.update(); };
      this.list.addEventListener('scroll', this.update, { passive: true });
      this.list.addEventListener('scrollend', this.onScrollEnd);
      this.observer = new MutationObserver(this.revealSelected);
      this.observer.observe(this.list, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-current', 'aria-pressed'] });
      this.resizeObserver = new ResizeObserver(this.update);
      this.resizeObserver.observe(this.list);
      window.addEventListener('resize', this.update);
      this.update();
    }
    disconnectedCallback() {
      this.removeEventListener('click', this.onClick);
      this.list?.removeEventListener('scroll', this.update);
      this.list?.removeEventListener('scrollend', this.onScrollEnd);
      window.removeEventListener('resize', this.update);
      this.observer?.disconnect();
      this.resizeObserver?.disconnect();
    }
  });
}
