import { validatePrescription } from './lemoon-eyewear-product.js';

export function parseLensPackage(label) {
  const value = String(label).toLocaleLowerCase('es').normalize('NFD').replace(/\p{Diacritic}/gu, '').trim();
  const known = {
    monofocal: { use: 'mono', crystal: 'clear', extra: 'none' },
    'monofocal + filtro azul': { use: 'mono', crystal: 'clear', extra: 'blue' },
    'monofocal fotocromatico': { use: 'mono', crystal: 'photo', extra: 'none' },
    progresivo: { use: 'progressive', crystal: 'clear', extra: 'none' },
    'solar sin receta': { use: 'solar', crystal: 'sun', extra: 'none' },
  };
  return known[value] || null;
}

export function createLensCatalogue(variants, optionNames, selectedId) {
  const normal = (value) => String(value).toLocaleLowerCase('es').normalize('NFD').replace(/\p{Diacritic}/gu, '');
  const lensIndex = optionNames.findIndex((name) => normal(name) === 'lentes');
  const indexIndex = optionNames.findIndex((name) => normal(name) === 'indice');
  const selected = variants.find(({ id }) => String(id) === String(selectedId)) || variants.find(({ available }) => available) || variants[0];
  if (!selected || lensIndex < 0 || indexIndex < 0) return { rows: [], selected, variants, lensIndex };
  const rows = variants.filter((variant) => variant.available && variant.options.every((value, index) => index === lensIndex || index === indexIndex || value === selected.options[index])).flatMap((variant) => {
    const parsed = parseLensPackage(variant.options[lensIndex]);
    return parsed ? [{ ...parsed, index: variant.options[indexIndex], variant }] : [];
  });
  return { rows, selected, variants, lensIndex, indexIndex };
}

export function lensChoices(catalogue, state, key) {
  const dependencies = { use: [], crystal: ['use'], index: ['use', 'crystal'], extra: ['use', 'crystal', 'index'] }[key];
  const rows = catalogue.rows.filter((row) => dependencies.every((field) => !state[field] || row[field] === state[field]));
  return [...new Set(rows.map((row) => row[key]))];
}

export function chooseLens(catalogue, state, key, value) {
  const next = { ...state, [key]: value };
  const order = ['use', 'crystal', 'index', 'extra'];
  for (const dependent of order.slice(order.indexOf(key) + 1)) next[dependent] = null;
  if (key === 'use') { next.distance = null; next.recipeMode = 'manual'; }
  if (next.crystal) {
    const indices = lensChoices(catalogue, next, 'index');
    if (indices.length === 1) next.index = indices[0];
    const extras = lensChoices(catalogue, next, 'extra');
    if (extras.length === 1) next.extra = extras[0];
  }
  return next;
}

export function resolveLensVariant(catalogue, state) {
  return catalogue.rows.find((row) => ['use', 'crystal', 'index', 'extra'].every((key) => row[key] === state[key]))?.variant;
}

export function lensSteps(catalogue, state) {
  const steps = ['use'];
  if (state.use !== 'solar') steps.push('prescription');
  steps.push('crystal');
  if (!state.crystal || lensChoices(catalogue, state, 'index').length > 1) steps.push('index');
  if (state.use !== 'solar' && (!state.crystal || lensChoices(catalogue, state, 'extra').length > 1)) steps.push('extra');
  steps.push('review');
  return steps;
}

export class LemoonLensFlow {
  constructor(root) {
    this.root = root;
    const data = root.querySelector('[data-lens-data]');
    if (!data) return;
    this.data = JSON.parse(data.textContent);
    this.copy = JSON.parse(root.querySelector('[data-lens-copy]').textContent);
    this.catalogue = createLensCatalogue(this.data.variants, this.data.options, this.data.selectedId);
    this.state = { recipeMode: 'manual' };
    this.stage = 'use';
    this.form = root.querySelector('[data-configurator-form]');
    this.next = root.querySelector('[data-configurator-next]');
    this.back = root.querySelector('[data-configurator-back]');
    this.error = root.querySelector('[data-flow-error]');
    this.id = root.querySelector('[name="id"]');
    this.fields = [...root.querySelectorAll('[data-rx]')];
    this.file = root.querySelector('[data-recipe-file]');
    if (!this.catalogue.rows.length) {
      root.querySelector('[data-flow-unavailable]').hidden = false;
      root.querySelector('[data-flow-panels]').hidden = true;
      root.querySelector('[data-flow-actions]').hidden = true;
      const frameOnly = root.querySelector('[data-frame-only-add]');
      if (this.catalogue.lensIndex < 0 && this.catalogue.selected?.available) {
        this.id.disabled = false;
        this.id.value = this.catalogue.selected.id;
        frameOnly.hidden = false;
      }
      return;
    }
    root.querySelector('[data-flow-panels]').hidden = false;
    root.querySelector('[data-flow-actions]').hidden = false;
    root.addEventListener('change', (event) => this.onChange(event));
    this.next.addEventListener('click', () => this.forward());
    this.back.addEventListener('click', () => {
      const stages = lensSteps(this.catalogue, this.state);
      this.go(stages[Math.max(0, stages.indexOf(this.stage) - 1)]);
    });
    this.form.addEventListener('submit', (event) => this.submit(event));
    this.render();
  }
  label(key, value) { return this.copy[`${key}_${value}`] || value; }
  onChange(event) {
    const input = event.target;
    if (input.dataset.lensChoice) {
      const key = input.dataset.lensChoice;
      this.state = chooseLens(this.catalogue, this.state, key, input.value);
      if (key === 'use') { this.fields.forEach((field) => { field.value = ''; field.removeAttribute('aria-invalid'); }); this.file.value = ''; }
      this.render();
      [...this.root.querySelectorAll('[data-lens-choice]')].find((radio) => radio.dataset.lensChoice === key && radio.value === input.value)?.focus();
    }
    if (input.matches('[data-distance]')) { this.state.distance = input.value; this.render(); }
    if (input.matches('[data-recipe-mode]')) {
      this.state.recipeMode = input.value;
      if (input.value === 'manual') this.file.value = '';
      this.updateRecipe();
    }
    if (input.matches('[data-rx], [data-recipe-file]')) { input.removeAttribute('aria-invalid'); this.error.hidden = true; }
  }
  renderChoices(key) {
    const container = this.root.querySelector(`[data-choices="${key}"]`);
    container.replaceChildren();
    for (const value of lensChoices(this.catalogue, this.state, key)) {
      const label = document.createElement('label'); label.className = 'lemoon-lens-flow__choice';
      const radio = document.createElement('input'); radio.type = 'radio'; radio.name = `flow_${key}`; radio.value = value; radio.dataset.lensChoice = key; radio.checked = this.state[key] === value;
      const text = document.createElement('span'); text.textContent = this.label(key, value);
      label.append(radio, text); container.append(label);
    }
  }
  updateRecipe() {
    const active = this.state.use && this.state.use !== 'solar';
    this.fields.forEach((field) => {
      const addition = field.dataset.rx.endsWith('_add');
      field.disabled = !active || this.state.recipeMode !== 'manual' || (addition && this.state.use !== 'progressive');
      field.closest('[data-addition]')?.toggleAttribute('hidden', this.state.use !== 'progressive');
    });
    this.file.disabled = !active || this.state.recipeMode !== 'upload';
    this.root.querySelector('[data-manual-panel]').hidden = this.state.recipeMode !== 'manual';
    this.root.querySelector('[data-upload-panel]').hidden = this.state.recipeMode !== 'upload';
    const property = this.root.querySelector('[data-recipe-property]');
    property.disabled = !active;
    property.value = this.copy[`recipe_${this.state.recipeMode}`];
    this.root.querySelectorAll('[data-recipe-mode]').forEach((input) => { input.checked = input.value === this.state.recipeMode; });
  }
  render() {
    for (const key of ['use', 'crystal', 'index', 'extra']) this.renderChoices(key);
    this.root.querySelector('[data-distance-options]').hidden = this.state.use !== 'mono';
    this.root.querySelectorAll('[data-distance]').forEach((input) => { input.checked = input.value === this.state.distance; input.disabled = this.state.use !== 'mono'; });
    this.updateRecipe();
    this.variant = resolveLensVariant(this.catalogue, this.state);
    this.id.disabled = !this.variant;
    this.id.value = this.variant?.id || '';
    const price = this.root.querySelector('[data-flow-price]');
    price.textContent = this.variant?.priceLabel || this.copy.price_pending;
    const purpose = this.root.querySelector('[data-purpose-property]');
    purpose.disabled = this.state.use !== 'mono' || !this.state.distance;
    purpose.value = this.state.distance ? this.copy[`distance_${this.state.distance}`] : '';
    const summary = this.root.querySelector('[data-configurator-summary]');
    summary.replaceChildren();
    for (const key of ['use', 'crystal', 'index', 'extra']) {
      const row = document.createElement('div'); const dt = document.createElement('dt'); const dd = document.createElement('dd');
      dt.textContent = this.copy[`summary_${key}`]; dd.textContent = this.state[key] ? this.label(key, this.state[key]) : this.copy.pending;
      if (key === 'use' && this.state.use === 'mono' && this.state.distance) dd.textContent += ` · ${this.copy[`distance_${this.state.distance}`]}`;
      row.append(dt, dd); summary.append(row);
    }
    const recipe = this.root.querySelector('[data-recipe-summary]');
    recipe.textContent = this.state.use === 'solar' ? this.copy.no_recipe : this.copy[`recipe_${this.state.recipeMode}`];
    this.go(this.stage, false);
  }
  go(stage, focus = true) {
    this.stage = stage;
    const stages = lensSteps(this.catalogue, this.state);
    this.root.querySelectorAll('[data-step]').forEach((panel) => { panel.hidden = panel.dataset.step !== stage; });
    const progress = this.root.querySelector('[data-flow-progress]'); progress.replaceChildren();
    stages.forEach((key) => { const item = document.createElement('li'); item.textContent = this.copy[`step_${key}`]; if (key === stage) item.setAttribute('aria-current', 'step'); progress.append(item); });
    this.root.querySelector('[data-step-count]').textContent = this.copy.progress.replace('{current}', stages.indexOf(stage) + 2).replace('{total}', stages.length + 1);
    this.back.hidden = stage === 'use';
    this.next.textContent = stage === 'review' ? this.copy.add : this.copy.continue;
    this.next.disabled = stage === 'review' ? !this.variant : stage === 'use' ? !this.state.use || (this.state.use === 'mono' && !this.state.distance) : ['crystal', 'index', 'extra'].includes(stage) ? !this.state[stage] : false;
    this.next.setAttribute('aria-disabled', String(this.next.disabled));
    if (stage === 'review') this.reviewRecipe();
    if (focus) this.root.querySelector(`[data-step="${stage}"] h2`)?.focus();
  }
  reviewRecipe() {
    const details = this.root.querySelector('[data-recipe-details]');
    details.replaceChildren();
    if (this.state.use === 'solar') return;
    if (this.state.recipeMode === 'upload') {
      const row = document.createElement('p'); row.textContent = this.file.files?.[0]?.name || this.copy.pending; details.append(row); return;
    }
    for (const input of this.fields.filter((field) => !field.disabled && field.value)) {
      const row = document.createElement('p');
      const eye = input.dataset.rx.startsWith('od') ? 'OD' : input.dataset.rx.startsWith('oi') ? 'OI' : '';
      row.textContent = `${eye} ${input.closest('label').childNodes[0].textContent.trim()}: ${input.value}`.trim();
      details.append(row);
    }
  }
  checkRecipe() {
    if (this.state.use === 'solar') return true;
    if (this.state.recipeMode === 'upload') {
      const file = this.file.files?.[0];
      if (file && file.size <= 10 * 1024 * 1024 && /\.(pdf|jpe?g|png)$/i.test(file.name)) return true;
      this.go('prescription'); this.showError(this.copy.file_error); this.file.setAttribute('aria-invalid','true'); this.file.focus(); return false;
    }
    const values = Object.fromEntries(this.fields.filter((field) => !field.disabled).map((field) => [field.dataset.rx, field.value]));
    const errors = validatePrescription(values, this.state.use === 'progressive');
    this.fields.forEach((field) => field.setAttribute('aria-invalid', String(errors.includes(field.dataset.rx))));
    if (!errors.length) return true;
    this.go('prescription'); this.showError(this.copy.recipe_error); this.fields.find((field) => errors.includes(field.dataset.rx))?.focus(); return false;
  }
  forward() {
    if (this.busy || this.next.disabled) return;
    if (this.stage === 'prescription' && !this.checkRecipe()) return;
    if (this.stage === 'review') { this.form.requestSubmit(); return; }
    const stages = lensSteps(this.catalogue, this.state); this.go(stages[stages.indexOf(this.stage) + 1]);
  }
  showError(message) { this.error.textContent = message; this.error.hidden = false; }
  async submit(event) {
    event.preventDefault();
    if (this.busy || this.stage !== 'review' || !this.variant?.available || !this.checkRecipe()) return;
    this.error.hidden = true;
    this.busy = true; this.next.disabled = true; this.next.setAttribute('aria-disabled', 'true'); this.next.setAttribute('aria-busy', 'true');
    if (!this.file.disabled) { HTMLFormElement.prototype.submit.call(this.form); return; }
    const data = new FormData(this.form);
    for (const [key, value] of [...data.entries()]) if (key.startsWith('flow_') || (key.startsWith('properties[') && !String(value).trim())) data.delete(key);
    try {
      const response = await fetch(this.root.dataset.addUrl, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      const result = await response.json();
      if (!response.ok || result.status) throw new Error(result.description || this.copy.cart_error);
      location.assign(this.root.dataset.cartUrl);
    } catch (error) { this.showError(error.message || this.copy.cart_error); }
    finally { this.busy = false; this.next.disabled = !this.variant?.available; this.next.setAttribute('aria-disabled', String(this.next.disabled)); this.next.removeAttribute('aria-busy'); }
  }
}

const initializedFlows = new WeakSet();
function initializeLensFlow(root) {
  if (initializedFlows.has(root)) return;
  new LemoonLensFlow(root);
  initializedFlows.add(root);
}

if (typeof document !== 'undefined') {
  document.querySelectorAll('[data-lens-flow]').forEach(initializeLensFlow);
  document.addEventListener('shopify:section:load', event => {
    event.target.querySelectorAll('[data-lens-flow]').forEach(initializeLensFlow);
  });
}
