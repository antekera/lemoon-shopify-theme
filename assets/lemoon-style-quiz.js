const RESULT_BATCH_SIZE = 12;
const AXES = ['shape', 'color', 'finish', 'pattern', 'material', 'transparency', 'use', 'presence'];
const ALIASES = {
  color: { brown: 'neutral', light: 'neutral' },
  shape: { redondo: 'round', rectangular: 'rectangular', 'ojo de gato': 'cat-eye', cat_eye: 'cat-eye', aviador: 'aviator', geometrico: 'geometric', cuadrado: 'square', ovalado: 'oval', pantostico: 'panto' },
  material: { acetato: 'acetate', metal: 'metal', titanio: 'titanium', 'tr-90': 'tr90', madera: 'wood', mixto: 'mixed' },
};
function valuesFor(axis, values) {
  if (!Array.isArray(values)) return [];
  return [...new Set(values.filter(value => typeof value === 'string').map(value => {
    const normalized = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
    return ALIASES[axis]?.[normalized] || normalized;
  }).filter(Boolean))];
}
const identity = value => (typeof value === 'string' && value.trim() !== '') || (typeof value === 'number' && Number.isFinite(value) && value > 0);

// Editorial prototype rule for visual proportion, not total frame width or physical fit.
// The temple is validated as a reference; it does not change the frontal proportion.
const MEASURE_RANGES = { lens_width: [30, 80], bridge: [10, 35], temple: [100, 180] };
export function suggestPresence(measures = {}) {
  const values = {};
  for (const [key, [min, max]] of Object.entries(MEASURE_RANGES)) {
    const raw = String(measures?.[key] ?? '').trim();
    if (!/^\d{2,3}$/.test(raw)) return null;
    values[key] = Number(raw);
    if (values[key] < min || values[key] > max) return null;
  }
  const referenceSpan = 2 * values.lens_width + values.bridge;
  return referenceSpan < 118 ? 'compact' : referenceSpan <= 128 ? 'medium' : 'oversize';
}

/** Return every qualifying product, represented by its best available variant. */
export function rankProducts(candidates, answers = {}) {
  if (!Array.isArray(candidates)) return [];
  const selected = Object.fromEntries(AXES.map(axis => [axis, valuesFor(axis, answers?.[axis])]));
  const category = Array.isArray(answers?.category) ? answers.category.find(value => ['optical', 'sun'].includes(value)) : undefined;
  const editorial = AXES.every(axis => selected[axis].length === 0);
  const products = new Map();
  candidates.forEach((candidate, index) => {
    if (category && candidate?.category !== category) return;
    if (!candidate || !identity(candidate.id) || !identity(candidate.variantId) || candidate.available !== true || typeof candidate.price !== 'number' || !Number.isFinite(candidate.price) || candidate.price < 0) return;
    const matched = AXES.filter(axis => {
      const values = valuesFor(axis, candidate.attributes?.[axis]);
      return selected[axis].some(value => values.includes(value));
    });
    if (!editorial && matched.length === 0) return;
    const result = { ...candidate, score: matched.length, matched, editorial };
    const key = String(candidate.id);
    const previous = products.get(key);
    if (!previous || result.score > previous.result.score) products.set(key, { result, index });
  });
  return [...products.values()].sort((a, b) => b.result.score - a.result.score || a.index - b.index).map(({ result }) => result);
}

/** Enhance one server-rendered quiz; malformed candidate data keeps its editorial fallback. */
export function initializeQuiz(root) {
  if (!root || root.dataset.ready) return;
  const form = root.querySelector('[data-quiz-form]');
  const intro = root.querySelector('[data-quiz-intro]');
  const start = root.querySelector('[data-quiz-start]');
  const results = root.querySelector('[data-quiz-results]');
  const grid = root.querySelector('[data-quiz-products]');
  const steps = [...(form?.querySelectorAll('[data-step]') || [])];
  const cards = [...root.querySelectorAll('[data-quiz-product]')];
  if (!form || !intro || !start || !results || !grid || steps.length !== 6) {
    root.classList.remove('lemoon-quiz--enhancing');
    return;
  }
  let candidates;
  try {
    candidates = cards.map(card => ({ ...JSON.parse(card.dataset.candidate), card }));
  } catch {
    root.classList.remove('lemoon-quiz--enhancing');
    const status = root.querySelector('[data-quiz-status]');
    if (status) status.textContent = root.dataset.errorLabel || '';
    return;
  }
  root.dataset.ready = 'true';
  const status = root.querySelector('[data-quiz-status]');
  const next = root.querySelector('[data-quiz-next]');
  const back = root.querySelector('[data-quiz-back]');
  const more = root.querySelector('[data-quiz-more]');
  const resultsBack = root.querySelector('[data-quiz-results-back]');
  const summary = root.querySelector('[data-quiz-preferences]');
  const progress = root.querySelector('[data-quiz-progress]');
  let step = 0;
  const completedSteps = new Set();
  let ranked = [];
  let visibleCount = RESULT_BATCH_SIZE;
  let preparedCards = new WeakSet();
  const readAnswers = () => Object.fromEntries(['category', ...AXES].map(axis => [axis, [...form.querySelectorAll(`input[name="${axis}"]:checked`)].map(input => input.value)]));
  const labelFor = input => input.closest('label')?.querySelector('[data-quiz-option-label]')?.textContent.trim() || input.value;
  const focus = node => node?.focus({ preventScroll: false });
  const measureInputs = [...form.querySelectorAll('[data-quiz-measure]')];
  const measureStatus = form.querySelector('[data-quiz-measure-status]');
  const presenceInputs = [...form.querySelectorAll('input[name="presence"]')];
  let autoPresence = false;
  function updateMeasures() {
    const measures = Object.fromEntries(measureInputs.map(input => [input.dataset.quizMeasure, input.value]));
    let invalid = false;
    measureInputs.forEach(input => {
      const raw = input.value.trim();
      const [min, max] = MEASURE_RANGES[input.dataset.quizMeasure];
      const bad = raw !== '' && (!/^\d{2,3}$/.test(raw) || Number(raw) < min || Number(raw) > max);
      if (bad) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
      invalid ||= bad;
    });
    const suggestion = suggestPresence(measures);
    if (!suggestion) {
      if (autoPresence) presenceInputs.forEach(input => { input.checked = false; });
      autoPresence = false;
      if (measureStatus) measureStatus.textContent = invalid ? measureStatus.dataset.invalidLabel : '';
      return;
    }
    presenceInputs.forEach(input => { input.checked = input.value === suggestion; });
    autoPresence = true;
    const selected = presenceInputs.find(input => input.checked);
    if (measureStatus && selected) measureStatus.textContent = measureStatus.dataset.suggestionLabel.replace('[size]', labelFor(selected));
  }
  measureInputs.forEach(input => input.addEventListener('input', updateMeasures));
  function tab(name) {
    root.querySelectorAll('[data-quiz-tab]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.quizTab === name)));
    root.querySelectorAll('[data-quiz-panel]').forEach(panel => { panel.hidden = panel.dataset.quizPanel !== name; });
  }
  root.querySelectorAll('[data-quiz-tab]').forEach(button => button.addEventListener('click', () => tab(button.dataset.quizTab)));
  root.querySelector('[data-quiz-tabs]')?.removeAttribute('hidden');
  tab('finishes');
  function updateCategory() {
    const sun = form.querySelector('input[name="category"]:checked')?.value === 'sun';
    const work = form.querySelector('input[name="use"][value="work"]');
    if (work) {
      work.disabled = sun;
      work.closest('label').hidden = sun;
      if (sun) work.checked = false;
    }
    root.querySelectorAll('[data-optical-label][data-sun-label]').forEach(node => {
      node.textContent = sun ? node.dataset.sunLabel : node.dataset.opticalLabel;
    });
  }
  form.addEventListener('change', event => {
    if (event.target.name === 'category') updateCategory();
    if (event.target.name === 'presence') {
      autoPresence = false;
      if (measureStatus && measureInputs.some(input => input.value.trim())) {
        measureStatus.textContent = measureStatus.dataset.manualLabel;
      }
    }
  });
  function updateProgress() {
    if (!progress) return;
    progress.setAttribute('aria-valuenow', String(completedSteps.size));
    progress.querySelectorAll('[data-quiz-segment]').forEach(segment => {
      segment.dataset.complete = String(completedSteps.has(segment.dataset.quizSegment));
      segment.dataset.current = String(segment.dataset.quizSegment === steps[step].dataset.step);
    });
  }
  function showStep() {
    updateCategory();
    intro.hidden = true;
    results.hidden = true;
    form.hidden = false;
    steps.forEach((node, index) => { node.hidden = index !== step; });
    back.hidden = false;
    next.textContent = step === steps.length - 1 ? root.dataset.resultLabel : root.dataset.nextLabel;
    updateProgress();
    status?.classList.add('visually-hidden');
    if (status) status.textContent = (root.dataset.stepLabel || '').replace('[current]', String(step + 1)).replace('[total]', String(steps.length));
    focus(steps[step].querySelector('[data-quiz-question]') || steps[step].querySelector('legend'));
  }
  function hydrate(card) {
    const template = card.querySelector('[data-quiz-card-template]');
    if (template) {
      template.replaceWith(template.content.cloneNode(true));
    }
  }
  function swatchVariant(swatch) {
    try { return new URL(swatch.dataset.variantUrl, document.baseURI).searchParams.get('variant') || ''; }
    catch { return ''; }
  }
  function showCards(announce = false) {
    cards.forEach(card => { card.hidden = true; });
    ranked.slice(0, visibleCount).forEach(product => {
      const card = product.card;
      hydrate(card);
      grid.append(card);
      card.hidden = false;
      if (!preparedCards.has(card)) {
        const initialSwatch = [...card.querySelectorAll('.lemoon-product-card__swatch')].find(swatch => swatchVariant(swatch) === String(product.variantId));
        if (initialSwatch && initialSwatch.getAttribute('aria-pressed') !== 'true') initialSwatch.click();
        preparedCards.add(card);
      }
    });
    more.hidden = visibleCount >= ranked.length;
    grid.dispatchEvent(new CustomEvent('lemoon:featured-products-updated', { bubbles: true, detail: { root: grid } }));
    if (announce && status) status.textContent = root.querySelector('[data-quiz-result-count]')?.textContent || '';
  }
  function showResults() {
    updateCategory();
    ranked = rankProducts(candidates, readAnswers());
    visibleCount = RESULT_BATCH_SIZE;
    preparedCards = new WeakSet();
    form.hidden = true;
    intro.hidden = true;
    results.hidden = false;
    summary.hidden = false;
    root.querySelectorAll('[data-quiz-preference]').forEach(item => {
      const stage = steps.find(node => node.dataset.step === item.dataset.quizPreference);
      const labels = [...stage.querySelectorAll('input:checked')].map(labelFor);
      const value = item.querySelector('[data-quiz-preference-value]');
      if (value) value.textContent = labels.join(', ') || root.dataset.noneLabel;
    });
    const count = root.querySelector('[data-quiz-result-count]');
    if (count) count.textContent = ranked.length === 1 && root.dataset.countOneLabel ? root.dataset.countOneLabel : (root.dataset.countLabel || '').replace('[count]', String(ranked.length));
    const empty = root.querySelector('[data-quiz-empty]');
    if (empty) empty.hidden = ranked.length !== 0;
    const few = root.querySelector('[data-quiz-few]');
    if (few) few.hidden = ranked.length === 0 || ranked.length >= 3;
    const editorial = root.querySelector('[data-quiz-editorial]');
    if (editorial) editorial.hidden = !ranked[0]?.editorial;
    resultsBack.hidden = false;
    showCards();
    if (status) status.textContent = root.dataset.finishedLabel || '';
    focus(results.querySelector('h2'));
  }
  results.hidden = true;
  start.addEventListener('click', showStep);
  start.disabled = false;
  back.addEventListener('click', () => {
    if (step === 0) {
      form.hidden = true; intro.hidden = false;
      if (status) status.textContent = '';
      focus(start);
    } else { step -= 1; showStep(); }
  });
  resultsBack.addEventListener('click', () => {
    step = steps.length - 1;
    showStep();
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    completedSteps.add(steps[step].dataset.step);
    updateProgress();
    if (step === steps.length - 1) showResults();
    else { step += 1; showStep(); }
  });

  more.addEventListener('click', () => {
    const previouslyVisible = visibleCount;
    visibleCount += RESULT_BATCH_SIZE;
    showCards(true);
    // The activated button may disappear after the final batch. Keep focus in the newly revealed group.
    const newlyShown = ranked[previouslyVisible]?.card.querySelector('a,button');
    focus(newlyShown);
  });
}
if (typeof document !== 'undefined') {
  document.querySelectorAll('[data-style-quiz]').forEach(initializeQuiz);
  document.addEventListener('shopify:section:load', event => {
    if (event.target.matches?.('[data-style-quiz]')) initializeQuiz(event.target);
    event.target.querySelectorAll('[data-style-quiz]').forEach(initializeQuiz);
  });
}
