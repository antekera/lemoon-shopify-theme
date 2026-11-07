import { buildQuizCollectionURL } from './lemoon-style-quiz-filters.js';

const AXES = ['category', 'shape', 'color', 'finish', 'pattern', 'material', 'transparency', 'use', 'presence'];
const STAGES = ['intro', 'category', 'shape', 'color', 'details', 'use', 'presence'];
const HISTORY_KEY = 'lemoonStyleQuiz';
const HISTORY_VERSION = 1;

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

/** Enhance the six-question flow; Shopify owns results, counts and pagination. */
export function initializeQuiz(root) {
  if (!root || root.dataset.ready) return;
  const form = root.querySelector('[data-quiz-form]');
  const intro = root.querySelector('[data-quiz-intro]');
  const start = root.querySelector('[data-quiz-start]');
  const fallback = root.querySelector('[data-quiz-fallback]');
  const status = root.querySelector('[data-quiz-status]');
  const next = root.querySelector('[data-quiz-next]');
  const back = root.querySelector('[data-quiz-back]');
  const progress = root.querySelector('[data-quiz-progress]');
  const steps = [...(form?.querySelectorAll('[data-step]') || [])];
  function showError() {
    status?.classList.remove('visually-hidden');
    if (status) status.textContent = root.dataset.errorLabel || '';
    if (fallback) fallback.hidden = false;
  }
  let config;
  try {
    if (!form || !intro || !start || !fallback || !next || !back || steps.length !== 6 || steps.some((node, index) => node.dataset.step !== STAGES[index + 1])) throw new Error('Quiz markup');
    config = JSON.parse(root.querySelector('[data-quiz-filter-config]')?.textContent || '');
    if (!config.categories || typeof config.categories !== 'object' || !Array.isArray(config.traits)) throw new Error('Quiz configuration');
    buildQuizCollectionURL({}, config);
  } catch {
    root.classList.remove('lemoon-quiz--enhancing');
    showError();
    return;
  }
  const view = root.ownerDocument.defaultView;
  const { history, location } = view;
  const inputs = [...form.querySelectorAll('input[name]')];
  const allowed = Object.fromEntries(AXES.map(axis => [axis, new Set(inputs.filter(input => input.name === axis).map(input => input.value))]));
  const measureInputs = [...form.querySelectorAll('[data-quiz-measure]')];
  const measureStatus = form.querySelector('[data-quiz-measure-status]');
  const measuresDetails = form.querySelector('[data-quiz-measures]');
  const presenceInputs = inputs.filter(input => input.name === 'presence');
  const labelFor = input => input.closest('label')?.querySelector('[data-quiz-option-label]')?.textContent.trim() || input.value;
  let stage = 'intro';
  let position = 0;
  let trail = ['intro'];
  let completed = new Set();
  let presenceMode = 'none';
  const readAnswers = () => Object.fromEntries(AXES.map(axis => [axis, inputs.filter(input => input.name === axis && input.checked).map(input => input.value)]));
  const readMeasures = () => Object.fromEntries(measureInputs.map(input => [input.dataset.quizMeasure, input.value]));
  function snapshot() {
    return { version: HISTORY_VERSION, path: location.pathname, stage, position, trail: [...trail], answers: readAnswers(), completed: [...completed], measures: readMeasures(), presenceMode, measuresOpen: !!measuresDetails?.open };
  }
  function validSnapshot(state) {
    if (!state || state.version !== HISTORY_VERSION || state.path !== location.pathname || !STAGES.includes(state.stage)) return false;
    if (!Number.isSafeInteger(state.position) || state.position < 0 || state.position > 100 || !Array.isArray(state.trail) || state.trail.length !== state.position + 1 || state.trail[state.position] !== state.stage || state.trail.some(name => !STAGES.includes(name))) return false;
    if (!state.answers || typeof state.answers !== 'object' || Array.isArray(state.answers)) return false;
    if (Object.keys(state.answers).some(axis => !AXES.includes(axis))) return false;
    if (!AXES.every(axis => Array.isArray(state.answers[axis]) && state.answers[axis].every(code => allowed[axis].has(code)) && (!['category', 'presence'].includes(axis) || state.answers[axis].length <= 1))) return false;
    if (!Array.isArray(state.completed) || state.completed.some(name => !STAGES.slice(1).includes(name))) return false;
    if (!['none', 'auto', 'manual'].includes(state.presenceMode) || typeof state.measuresOpen !== 'boolean') return false;
    return state.measures && Object.keys(MEASURE_RANGES).every(key => typeof state.measures[key] === 'string' && state.measures[key].length <= 3);
  }
  function writeHistory(method = 'replaceState') {
    const foreign = history.state;
    const state = foreign && typeof foreign === 'object' && !Array.isArray(foreign)
      ? { ...foreign } : foreign == null ? {} : { lemoonStyleQuizForeignState: foreign };
    state[HISTORY_KEY] = snapshot();
    history[method](state, '', `${location.pathname}${location.search}#style-quiz-${stage}`);
  }
  function updateCategory() {
    const sun = inputs.find(input => input.name === 'category' && input.checked)?.value === 'sun';
    const work = inputs.find(input => input.name === 'use' && input.value === 'work');
    if (work) {
      work.disabled = sun;
      work.closest('label').hidden = sun;
      if (sun) work.checked = false;
    }
    root.querySelectorAll('[data-optical-label][data-sun-label]').forEach(node => {
      node.textContent = sun ? node.dataset.sunLabel : node.dataset.opticalLabel;
    });
  }
  function renderMeasures() {
    let invalid = false;
    measureInputs.forEach(input => {
      const raw = input.value.trim();
      const [min, max] = MEASURE_RANGES[input.dataset.quizMeasure];
      const bad = raw !== '' && (!/^\d{2,3}$/.test(raw) || Number(raw) < min || Number(raw) > max);
      if (bad) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
      invalid ||= bad;
    });
    if (!measureStatus) return;
    const selected = presenceInputs.find(input => input.checked);
    const hasMeasures = measureInputs.some(input => input.value.trim());
    measureStatus.textContent = invalid ? measureStatus.dataset.invalidLabel
      : presenceMode === 'manual' && hasMeasures ? measureStatus.dataset.manualLabel
        : presenceMode === 'auto' && selected ? measureStatus.dataset.suggestionLabel.replace('[size]', labelFor(selected)) : '';
  }
  function render(shouldFocus = false) {
    updateCategory();
    renderMeasures();
    intro.hidden = stage !== 'intro';
    form.hidden = stage === 'intro';
    fallback.hidden = true;
    steps.forEach(node => { node.hidden = node.dataset.step !== stage; });
    next.textContent = stage === 'presence' ? root.dataset.resultLabel : root.dataset.nextLabel;
    if (progress) {
      progress.setAttribute('aria-valuenow', String(completed.size));
      progress.querySelectorAll('[data-quiz-segment]').forEach(segment => {
        segment.dataset.complete = String(completed.has(segment.dataset.quizSegment));
        segment.dataset.current = String(segment.dataset.quizSegment === stage);
      });
    }
    status?.classList.add('visually-hidden');
    if (status) status.textContent = stage === 'intro' ? '' : (root.dataset.stepLabel || '').replace('[current]', String(STAGES.indexOf(stage))).replace('[total]', '6');
    if (shouldFocus) (stage === 'intro' ? start : steps.find(node => node.dataset.step === stage)?.querySelector('[data-quiz-question]'))?.focus();
  }
  function restore(state, shouldFocus) {
    const saved = state?.[HISTORY_KEY];
    if (validSnapshot(saved)) {
      stage = saved.stage;
      position = saved.position; trail = [...saved.trail];
      completed = new Set(saved.completed);
      presenceMode = saved.presenceMode;
      inputs.forEach(input => { input.checked = saved.answers[input.name]?.includes(input.value) || false; });
      measureInputs.forEach(input => { input.value = saved.measures[input.dataset.quizMeasure]; });
      if (measuresDetails) measuresDetails.open = saved.measuresOpen;
    } else {
      stage = 'intro'; position = 0; trail = ['intro']; completed = new Set(); presenceMode = 'none';
      inputs.forEach(input => { input.checked = false; });
      measureInputs.forEach(input => { input.value = ''; });
      if (measuresDetails) measuresDetails.open = false;
    }
    render(shouldFocus);
  }
  function moveTo(destination) {
    writeHistory();
    stage = destination;
    // Only forward navigation adds an entry; drop the obsolete forward branch.
    trail = [...trail.slice(0, position + 1), destination];
    position += 1;
    writeHistory('pushState');
    render(true);
  }
  const restoredStage = history.state?.[HISTORY_KEY];
  restore(history.state, validSnapshot(restoredStage) && restoredStage.stage !== 'intro');
  try { writeHistory(); } catch {
    root.classList.remove('lemoon-quiz--enhancing');
    form.hidden = true; intro.hidden = false;
    showError();
    return;
  }
  root.dataset.ready = 'true';
  start.disabled = false;
  start.addEventListener('click', () => moveTo('category'));
  back.addEventListener('click', () => {
    const previous = STAGES[STAGES.indexOf(stage) - 1] || 'intro';
    writeHistory();
    if (position > 0 && trail[position - 1] === previous) history.back();
    else {
      // A restored/direct entry may have no preceding entry owned by this quiz.
      stage = previous; trail[position] = previous;
      writeHistory(); render(true);
    }
  });
  measureInputs.forEach(input => input.addEventListener('input', () => {
    const suggestion = suggestPresence(readMeasures());
    if (suggestion) {
      presenceInputs.forEach(choice => { choice.checked = choice.value === suggestion; });
      presenceMode = 'auto';
    } else if (presenceMode === 'auto') {
      presenceInputs.forEach(choice => { choice.checked = false; });
      presenceMode = 'none';
    }
    renderMeasures();
    writeHistory();
  }));
  measuresDetails?.addEventListener('toggle', () => writeHistory());
  form.addEventListener('change', event => {
    if (event.target.name === 'category') updateCategory();
    if (event.target.name === 'presence') { presenceMode = 'manual'; renderMeasures(); }
    writeHistory();
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    completed.add(stage);
    if (stage !== 'presence') { moveTo(STAGES[STAGES.indexOf(stage) + 1]); return; }
    writeHistory();
    render();
    try { location.assign(buildQuizCollectionURL(readAnswers(), config)); }
    catch { showError(); }
  });
  view.addEventListener('popstate', event => restore(event.state, true));
  // Rehydrate from the history entry even when the browser rebuilds the document.
  view.addEventListener('pageshow', event => restore(history.state, event.persisted && stage !== 'intro'));
}
if (typeof document !== 'undefined') {
  document.querySelectorAll('[data-style-quiz]').forEach(initializeQuiz);
  document.addEventListener('shopify:section:load', event => {
    if (event.target.matches?.('[data-style-quiz]')) initializeQuiz(event.target);
    event.target.querySelectorAll('[data-style-quiz]').forEach(initializeQuiz);
  });
}
