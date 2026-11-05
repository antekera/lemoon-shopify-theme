const RESULT_BATCH_SIZE = 12;
const AXES = ['shape', 'color', 'finish', 'pattern', 'material', 'transparency', 'use', 'presence'];
const ALIASES = {
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

/** Return every qualifying product, represented by its best available variant. */
export function rankProducts(candidates, answers = {}) {
  if (!Array.isArray(candidates)) return [];
  const selected = Object.fromEntries(AXES.map(axis => [axis, valuesFor(axis, answers?.[axis])]));
  const editorial = AXES.every(axis => selected[axis].length === 0);
  const products = new Map();
  candidates.forEach((candidate, index) => {
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
  if (!form || !intro || !start || !results || !grid || steps.length !== 5) return;
  let candidates;
  try {
    candidates = cards.map(card => ({ ...JSON.parse(card.dataset.candidate), card }));
  } catch {
    const status = root.querySelector('[data-quiz-status]');
    if (status) status.textContent = root.dataset.errorLabel || '';
    return;
  }
  root.dataset.ready = 'true';
  const status = root.querySelector('[data-quiz-status]');
  const next = root.querySelector('[data-quiz-next]');
  const back = root.querySelector('[data-quiz-back]');
  const more = root.querySelector('[data-quiz-more]');
  const restart = root.querySelector('[data-quiz-restart]');
  const summary = root.querySelector('[data-quiz-preferences]');
  const progress = root.querySelector('[data-quiz-progress]');
  let step = 0;
  let editing = false;
  let ranked = [];
  let visibleCount = RESULT_BATCH_SIZE;
  let preparedCards = new WeakSet();
  const readAnswers = () => Object.fromEntries(AXES.map(axis => [axis, [...form.querySelectorAll(`input[name="${axis}"]:checked`)].map(input => input.value)]));
  const labelFor = input => input.closest('label')?.querySelector('[data-quiz-option-label]')?.textContent.trim() || input.value;
  const focus = node => node?.focus({ preventScroll: false });
  function tab(name) {
    root.querySelectorAll('[data-quiz-tab]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.quizTab === name)));
    root.querySelectorAll('[data-quiz-panel]').forEach(panel => { panel.hidden = panel.dataset.quizPanel !== name; });
  }
  root.querySelectorAll('[data-quiz-tab]').forEach(button => button.addEventListener('click', () => tab(button.dataset.quizTab)));
  root.querySelector('[data-quiz-tabs]')?.removeAttribute('hidden');
  tab('finishes');
  function showStep() {
    intro.hidden = true;
    results.hidden = true;
    form.hidden = false;
    steps.forEach((node, index) => { node.hidden = index !== step; });
    back.hidden = false;
    next.textContent = editing || step === steps.length - 1 ? root.dataset.resultLabel : root.dataset.nextLabel;
    if (progress) progress.value = step + 1;
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
    ranked = rankProducts(candidates, readAnswers());
    visibleCount = RESULT_BATCH_SIZE;
    preparedCards = new WeakSet();
    form.hidden = true;
    intro.hidden = true;
    results.hidden = false;
    summary.hidden = false;
    root.querySelectorAll('[data-quiz-edit]').forEach(button => {
      const stage = steps.find(node => node.dataset.step === button.dataset.quizEdit);
      const labels = [...stage.querySelectorAll('input:checked')].map(labelFor);
      const value = button.querySelector('[data-quiz-preference-value]');
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
    restart.hidden = false;
    showCards();
    if (status) status.textContent = root.dataset.finishedLabel || '';
    focus(results.querySelector('h2'));
  }
  function reset() {
    form.reset();
    editing = false;
    step = 0;
    ranked = [];
    form.querySelectorAll('details').forEach(details => { details.open = false; });
    tab('finishes');
    form.hidden = true;
    results.hidden = true;
    intro.hidden = false;
    if (status) status.textContent = '';
    focus(start);
  }
  start.hidden = false;
  results.hidden = true;
  start.addEventListener('click', () => { editing = false; showStep(); });
  back.addEventListener('click', () => {
    if (editing) { showResults(); return; }
    if (step === 0) {
      form.hidden = true; intro.hidden = false;
      if (status) status.textContent = '';
      focus(start);
    } else { step -= 1; showStep(); }
  });
  restart.addEventListener('click', reset);
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (editing || step === steps.length - 1) showResults();
    else { step += 1; showStep(); }
  });
  root.querySelector('[data-quiz-skip]').addEventListener('click', () => {
    steps[step].querySelectorAll('input:checked').forEach(input => { input.checked = false; });
    if (editing || step === steps.length - 1) showResults();
    else { step += 1; showStep(); }
  });
  root.querySelectorAll('[data-quiz-edit]').forEach(button => button.addEventListener('click', () => {
    step = steps.findIndex(node => node.dataset.step === button.dataset.quizEdit);
    if (step < 0) return;
    editing = true;
    showStep();
  }));
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
