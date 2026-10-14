export function findEyewearVariant(variants, options) {
  return variants.find((variant) => variant.options.every((value, index) => value === options[index]));
}

export function lensConfiguratorUrl(productUrl, variantId, origin) {
  const url = new URL(productUrl, origin);
  url.searchParams.set('variant', String(variantId));
  url.searchParams.set('view', 'configurador');
  url.searchParams.delete('lens_flow');
  return url.href;
}

export function hasSelectedLensPackage(optionNames, options) {
  const index = optionNames.indexOf('Lentes');
  return index >= 0 && Boolean(options[index]) && options[index] !== 'Solo armazón';
}

export function validatePrescription(values, progressive) {
  const errors = [];
  const number = (key, min, max, step, required = false) => {
    const raw = String(values[key] ?? '').trim();
    if (!raw) { if (required) errors.push(key); return; }
    const value = Number(raw);
    if (!Number.isFinite(value) || value < min || value > max || Math.abs(value / step - Math.round(value / step)) > 0.0001) errors.push(key);
  };
  for (const eye of ['od', 'oi']) {
    number(`${eye}_sph`, -20, 10, 0.25, true);
    number(`${eye}_cyl`, -6, 6, 0.25);
    number(`${eye}_axis`, 0, 180, 1, Boolean(Number(values[`${eye}_cyl`])));
    if (values[`${eye}_axis`] && !String(values[`${eye}_cyl`] ?? '').trim()) errors.push(`${eye}_cyl`);
    if (progressive) number(`${eye}_add`, 0.25, 4, 0.25, true);
  }
  number('pd', 40, 80, 0.5, true);
  return [...new Set(errors)];
}

if (typeof window !== 'undefined' && !customElements.get('lemoon-eyewear')) {
  class LemoonEyewear extends HTMLElement {
    connectedCallback() {
      if (this.ready) return;
      this.ready = true;
      this.variants = JSON.parse(this.querySelector('[data-variants]').textContent);
      this.copy = JSON.parse(this.querySelector('[data-copy]').textContent);
      this.form = this.querySelector('form[data-purchase]');
      this.submit = this.querySelector('[data-add]');
      this.error = this.querySelector('[data-error]');
      this.panels = [...this.querySelectorAll('[data-media-panel]')];
      const optionNames = [...this.querySelectorAll('[data-option-group]')].map(group => group.dataset.optionName);
      const returningToProduct = new URLSearchParams(window.location.search).get('lens_flow') === 'return';
      this.inLensFlow = !returningToProduct && hasSelectedLensPackage(optionNames, this.selectedOptions());
      if (this.dataset.configuratorUrl && this.inLensFlow) {
        const selected = findEyewearVariant(this.variants, this.selectedOptions());
        if (selected) {
          window.location.replace(lensConfiguratorUrl(this.dataset.configuratorUrl, selected.id, window.location.origin));
          return;
        }
      }
      this.addEventListener('change', (event) => {
        if (event.target.matches('[data-option]')) this.updateVariant();
        if (event.target.matches('[data-recipe-mode]')) this.updatePrescription();
        if (event.target.matches('[data-rx]')) event.target.removeAttribute('aria-invalid');
        if (event.target.matches('[data-units]')) this.updateUnits(event.target.value);
      });
      this.addEventListener('click', (event) => {
        const thumb = event.target.closest('[data-media-target]');
        if (thumb) this.showMedia(thumb.dataset.mediaTarget);
        const opener = event.target.closest('[data-open-dialog]');
        if (opener) {
          this.dialogOpener = opener;
          this.querySelector(`[data-dialog="${opener.dataset.openDialog}"]`).showModal();
        }
        const close = event.target.closest('[data-close-dialog]');
        if (close) close.closest('dialog').close();
        if (event.target.closest('[data-back-to-frame]')) {
          this.inLensFlow = false;
          this.chooseFrameOnly();
          this.querySelector('[data-configure]').focus();
        }
        if (event.target.closest('[data-configure]')) {
          if (this.dataset.configuratorUrl && this.variant?.available) {
            window.location.assign(lensConfiguratorUrl(this.dataset.configuratorUrl, this.variant.id, window.location.origin));
            return;
          }
          this.inLensFlow = true;
          const options = this.querySelectorAll('[data-option-group="1"] input');
          const lens = [...options].find((input) => input.value !== 'Solo armazón' && !input.disabled);
          if (lens) { lens.checked = true; this.updateVariant(); }
          this.querySelector('[data-flow-title]').focus();
        }
        if (event.target.closest('[data-frame-only-add]')) {
          const frameOnlyButton = event.target.closest('[data-frame-only-add]');
          const selection = this.getFrameOnlySelection();
          if (!selection?.variant?.available) return;
          this.inLensFlow = false;
          selection.input.checked = true;
          this.updateVariant();
          this.pendingButton = frameOnlyButton;
          this.form.requestSubmit();
        }
      });
      this.querySelectorAll('dialog').forEach((dialog) => {
        dialog.addEventListener('close', () => this.dialogOpener?.focus());
        dialog.addEventListener('click', (event) => { const rect = dialog.getBoundingClientRect(); if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close(); });
      });
      this.form.addEventListener('submit', (event) => this.addToCart(event));
      this.stage = this.querySelector('.lemoon-pdp__stage');
      this.mobileGallery = window.matchMedia('(max-width: 989px)');
      this.stage.addEventListener('scroll', () => {
        if (!this.mobileGallery.matches || this.galleryFrame) return;
        this.galleryFrame = requestAnimationFrame(() => {
          this.galleryFrame = null;
          const index = Math.min(this.panels.length - 1, Math.max(0, Math.round(this.stage.scrollLeft / this.stage.clientWidth)));
          if (this.panels[index]) this.showMedia(this.panels[index].dataset.mediaPanel, false);
        });
      }, { passive: true });
      this.mobileGallery.addEventListener('change', () => {
        if (this.mobileGallery.matches && this.stage.scrollLeft > 0) {
          const index = Math.min(this.panels.length - 1, Math.round(this.stage.scrollLeft / this.stage.clientWidth));
          if (this.panels[index]) this.showMedia(this.panels[index].dataset.mediaPanel, false);
          return;
        }
        const current = this.panels.find((panel) => !panel.hidden);
        if (current) this.showMedia(current.dataset.mediaPanel);
      });
      this.updateVariant(false);

    }

    selectedOptions() {
      return [...this.querySelectorAll('[data-option-group]')].map((group) => group.querySelector('input:checked')?.value);
    }

    updateVariant(changeUrl = true) {
      const options = this.selectedOptions();
      const frameOnly = options[1] === 'Solo armazón' || options[1] === 'Solar sin receta';
      const indexGroup = this.querySelector('[data-option-group="2"]');
      if (indexGroup) {
        indexGroup.hidden = !this.inLensFlow || frameOnly;
        if (frameOnly) {
          const standard = indexGroup.querySelector('input');
          standard.checked = true;
          options[2] = standard.value;
        }
      }
      this.variant = findEyewearVariant(this.variants, options);
      this.querySelector('[name="id"]').value = this.variant?.id || '';
      this.querySelector('[name="id"]').disabled = !this.variant;
      this.submit.disabled = !this.variant?.available;
      const addLabel = this.submit.querySelector('[data-add-label]');
      if (addLabel) addLabel.textContent = this.variant ? (this.variant.available ? (this.inLensFlow ? this.copy.add : this.copy.buyFrame) : this.copy.soldOut) : this.copy.unavailable;
      this.querySelector('[data-price]').textContent = this.variant?.formattedPrice || this.copy.unavailable;
      const compare = this.querySelector('[data-compare]');
      compare.textContent = this.variant?.formattedCompare || '';
      compare.hidden = !this.variant?.formattedCompare;
      const status = this.querySelector('[data-pdp-status]');
      if (status) {
        const soldOut = Boolean(this.variant && !this.variant.available);
        const onSale = Boolean(this.variant?.available && this.variant.formattedCompare);
        status.hidden = !soldOut && !onSale;
        status.querySelector('[data-status-sale]').hidden = !onSale;
        status.querySelector('[data-status-sold-out]').hidden = !soldOut;
      }
      this.querySelector('[data-sku]').textContent = this.variant?.sku || '—';
      const headingSku = this.querySelector('[data-heading-sku]');
      if (headingSku) {
        headingSku.textContent = this.variant?.sku || '';
        headingSku.closest('[data-heading-sku-row]').hidden = !this.variant?.sku;
      }
      this.querySelector('[data-selection]').textContent = options.filter(Boolean).join(' · ');
      this.querySelectorAll('[data-option-group]').forEach((group, index) => {
        if (index !== 2) group.hidden = index === 0 ? this.inLensFlow : !this.inLensFlow;
        const output = group.querySelector('[data-selected-label]');
        if (output) output.textContent = options[index] || '';
        group.querySelectorAll('[data-option]').forEach((input) => {
          const possible = [...options]; possible[index] = input.value;
          if (index === 1 && ['Solo armazón', 'Solar sin receta'].includes(input.value) && indexGroup) possible[2] = indexGroup.querySelector('input').value;
          const variant = findEyewearVariant(this.variants, possible);
          input.disabled = !variant;
          input.closest('label').classList.toggle('is-sold-out', Boolean(variant && !variant.available));
        });
      });
      if (this.variant?.mediaId) this.showMedia(String(this.variant.mediaId));
      if (changeUrl && this.variant) {
        const url = new URL(location.href); url.searchParams.set('variant', this.variant.id); history.replaceState({}, '', url);
      }
      this.error.hidden = true;
      this.querySelector('[data-flow-heading]').hidden = !this.inLensFlow;
      this.querySelector('[data-flow-summary]').hidden = !this.inLensFlow;
      this.querySelector('[data-frame-size]').hidden = this.inLensFlow;
      this.querySelector('[data-configure]').hidden = this.inLensFlow;
      this.querySelector('[data-configure]').disabled = !this.variant?.available;
      this.querySelector('[data-configure]').textContent = this.variant?.available ? this.copy.configure : this.copy.soldOut;
      this.submit.hidden = !this.inLensFlow;
      const frameOnlyButton = this.querySelector('[data-frame-only-add]');
      const frameOnlySelection = this.getFrameOnlySelection();
      frameOnlyButton.hidden = this.inLensFlow || !frameOnlySelection?.input;
      frameOnlyButton.disabled = !frameOnlySelection?.variant?.available;
      this.updatePrescription();
    }

    updatePrescription() {
      const lens = this.selectedOptions()[1] || '';
      const needsPrescription = this.inLensFlow && (lens.includes('Monofocal') || lens.includes('Progresivo'));
      const progressive = lens.includes('Progresivo');
      const recipe = this.querySelector('[data-prescription]');
      recipe.hidden = !needsPrescription;
      const manual = needsPrescription && this.querySelector('[data-recipe-mode]:checked')?.value === 'manual';
      const upload = needsPrescription && this.querySelector('[data-recipe-mode]:checked')?.value === 'upload';
      this.querySelector('[data-manual-recipe]').hidden = !manual;
      this.querySelector('[data-upload-recipe]').hidden = !upload;
      this.querySelector('[data-recipe-file]').disabled = !upload;
      this.querySelector('[data-recipe-property]').disabled = !needsPrescription;
      this.querySelector('[data-recipe-property]').value = manual ? this.copy.manual : (upload ? this.copy.upload : this.copy.later);
      this.querySelectorAll('[data-addition]').forEach((label) => { label.hidden = !progressive; });
      this.querySelectorAll('[data-rx]').forEach((input) => {
        const addition = input.dataset.rx.endsWith('_add');
        input.disabled = !manual || (addition && !progressive);
        input.required = manual && (input.dataset.rx.endsWith('_sph') || input.dataset.rx === 'pd' || (addition && progressive));
      });
    }

    chooseFrameOnly() {
      const selection = this.getFrameOnlySelection();
      if (selection?.input) { selection.input.checked = true; this.updateVariant(); }
    }

    getFrameOnlySelection(options = this.selectedOptions()) {
      const inputs = [...this.querySelectorAll('[data-option-group="1"] input')].filter((input) => ['Solo armazón', 'Solar sin receta'].includes(input.value));
      const indexOptions = this.querySelector('[data-option-group="2"]');
      for (const input of inputs) {
        const candidate = [...options];
        candidate[1] = input.value;
        if (indexOptions) candidate[2] = indexOptions.querySelector('input')?.value;
        const variant = findEyewearVariant(this.variants, candidate);
        if (variant?.available) return { input, variant };
      }
      return inputs.length ? { input: inputs[0], variant: undefined } : undefined;
    }

    showMedia(id, scroll = true) {
      if (!this.panels.some((panel) => panel.dataset.mediaPanel === id)) return;
      this.panels.forEach((panel) => {
        panel.hidden = panel.dataset.mediaPanel !== id;
        if (panel.hidden) panel.querySelectorAll('video').forEach((video) => video.pause());
      });
      this.querySelectorAll('[data-media-target]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.mediaTarget === id)));
      const index = this.panels.findIndex((panel) => panel.dataset.mediaPanel === id);
      const counter = this.querySelector('[data-gallery-current]');
      if (counter) counter.textContent = String(index + 1);
      if (scroll && this.mobileGallery?.matches) {
        this.stage.scrollTo({ left: index * this.stage.clientWidth, behavior: 'instant' });
      }
    }

    updateUnits(unit) {
      this.querySelectorAll('[data-mm]').forEach((value) => {
        value.textContent = unit === 'in' ? `${(Number(value.dataset.mm) / 25.4).toFixed(2)} in` : `${value.dataset.mm} mm`;
      });
    }

    showError(message) { this.error.textContent = message; this.error.hidden = false; }

    async addToCart(event) {
      event.preventDefault();
      if (this.busy || !this.variant?.available) return;
      const actionButton = this.pendingButton || event.submitter || this.submit;
      this.pendingButton = null;
      this.error.hidden = true;
      const fields = [...this.querySelectorAll('[data-rx]:not(:disabled)')];
      if (fields.length) {
        const values = Object.fromEntries(fields.map((input) => [input.dataset.rx, input.value]));
        const errors = validatePrescription(values, this.selectedOptions()[1].includes('Progresivo'));
        fields.forEach((input) => input.setAttribute('aria-invalid', String(errors.includes(input.dataset.rx))));
        if (errors.length) { this.showError(this.copy.recipeError); fields.find((input) => errors.includes(input.dataset.rx))?.focus(); return; }
      }
      const attachment = this.querySelector('[data-recipe-file]');
      if (!attachment.disabled) {
        const file = attachment.files?.[0];
        if (!file || file.size > 10 * 1024 * 1024 || !/\.(pdf|jpe?g|png)$/i.test(file.name)) {
          this.showError(this.copy.uploadError); attachment.focus(); return;
        }
        this.busy = true;
        this.submit.disabled = true;
        this.form.enctype = 'multipart/form-data';
        HTMLFormElement.prototype.submit.call(this.form);
        return;
      }
      this.busy = true;
      this.submit.disabled = true;
      actionButton.disabled = true;
      actionButton.classList.add('loading');
      actionButton.setAttribute('aria-busy', 'true');
      actionButton.querySelector('.loading__spinner')?.classList.remove('hidden');
      const data = new FormData(this.form);
      for (const [key, value] of [...data.entries()]) if (key.startsWith('properties[') && !String(value).trim()) data.delete(key);
      const cart = document.querySelector('cart-drawer') || document.querySelector('cart-notification');
      if (cart?.getSectionsToRender) {
        data.set('sections', cart.getSectionsToRender().map((section) => section.id).join(','));
        data.set('sections_url', location.pathname); cart.setActiveElement?.(this.submit);
      }
      try {
        const root = window.Shopify?.routes?.root || '/';
        const response = await fetch(`${root}cart/add.js`, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
        const result = await response.json();
        if (!response.ok || result.status) throw new Error(result.description || this.copy.cartError);
        if (cart?.renderContents && result.sections) {
          cart.classList.remove('is-empty'); await cart.renderContents(result);
        } else location.assign(this.dataset.cartUrl);
      } catch (error) { this.showError(error.message || this.copy.cartError); }
      finally {
        this.busy = false;
        this.submit.disabled = !this.variant?.available;
        actionButton.disabled = actionButton.matches('[data-frame-only-add]')
          ? !this.getFrameOnlySelection()?.variant?.available
          : !this.variant?.available;
        actionButton.classList.remove('loading');
        actionButton.removeAttribute('aria-busy');
        actionButton.querySelector('.loading__spinner')?.classList.add('hidden');
      }
    }
  }
  customElements.define('lemoon-eyewear', LemoonEyewear);
}
