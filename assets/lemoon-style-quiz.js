export function rankProducts(products, answers) {
  const cap = answers.budget === 'none' ? Infinity : Number(answers.budget);
  if (answers.budget === '' || (answers.budget !== 'none' && !Number.isFinite(cap)) || cap < 0) return [];
  const seen = new Set();
  return products.flatMap((product, index) => {
    if (!product.id || seen.has(product.id) || !product.available || !Number.isFinite(product.price) || product.price < 0 || product.price > cap) return [];
    seen.add(product.id);
    const score = ['face','style','use'].reduce((total, key) => total + (answers[key] !== 'unsure' && product[key] === answers[key] ? 1 : 0), 0);
    return score ? [{ product, score, index }] : [];
  }).sort((a,b) => b.score - a.score || a.index - b.index).slice(0,3).map(({product}) => product);
}

export function catalogueUrl(url, parameter, budget) {
  const amount = Number(budget);
  if (!parameter || budget === 'none' || budget === '' || !Number.isFinite(amount) || amount < 0) return url;
  const [path, query = ''] = url.split('?');
  const params = new URLSearchParams(query);
  params.set(parameter, String(amount / 100));
  return `${path}?${params}`;
}

async function discoverPriceParameter(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);
  try {
    const response = await fetch(url, { signal: controller.signal, credentials: 'same-origin' });
    if (!response.ok) return '';
    const collectionDocument = new DOMParser().parseFromString(await response.text(), 'text/html');
    const field = collectionDocument.querySelector('#MainContent form input[name="filter.v.price.lte"]');
    return field?.getAttribute('name') || '';
  } catch {
    return '';
  } finally {
    clearTimeout(timer);
  }
}

function initializeQuiz(root) {
  if (root.dataset.ready) return;
  root.dataset.ready = 'true';
  const form = root.querySelector('[data-quiz-form]');
  const steps = [...form.querySelectorAll('fieldset')];
  const results = root.querySelector('[data-quiz-results]');
  const cards = [...root.querySelectorAll('[data-quiz-product]')];
  const productGrid = root.querySelector('.lemoon-quiz__products');
  const candidates = cards.map(card => ({ ...card.dataset, price: Number(card.dataset.price), available: true, card }));
  const next = root.querySelector('[data-quiz-next]');
  const back = root.querySelector('[data-quiz-back]');
  const error = root.querySelector('[data-quiz-error]');
  const status = root.querySelector('[data-quiz-status]');
  const link = root.querySelector('[data-quiz-catalogue]');
  let step = 0;
  let submittedAnswers = null;
  function updateCatalogueLink(answers) {
    link.href = catalogueUrl(root.dataset.catalogue, root.dataset.priceParameter, answers.budget);
    link.textContent = answers.budget !== 'none' && root.dataset.priceParameter ? root.dataset.budgetLabel : root.dataset.catalogueLabel;
  }
  if (!root.dataset.priceParameter) {
    discoverPriceParameter(root.dataset.catalogue).then(parameter => {
      root.dataset.priceParameter = parameter;
      if (submittedAnswers) updateCatalogueLink(submittedAnswers);
    });
  }
  function showStep(focus = true) {
    form.hidden = false; results.hidden = true; error.hidden = true;
    steps.forEach((fieldset,index) => {
      fieldset.hidden = index !== step;
      fieldset.removeAttribute('aria-invalid');
      fieldset.removeAttribute('aria-describedby');
    });
    back.hidden = step === 0;
    next.textContent = step === steps.length - 1 ? root.dataset.resultLabel : root.dataset.nextLabel;
    status.textContent = root.dataset.stepLabel.replace('[current]',String(step+1)).replace('[total]',String(steps.length));
    root.querySelector('[data-quiz-progress]').value = step + 1;
    if (focus) steps[step].querySelector('legend').focus();
  }
  form.hidden = false; results.hidden = true;
  root.querySelector('[data-quiz-restart]').hidden = false;
  showStep(false);
  back.addEventListener('click', () => { step -= 1; showStep(); });
  root.querySelector('[data-quiz-restart]').addEventListener('click', () => {
    form.reset(); step = 0; submittedAnswers = null; cards.forEach(card => { card.hidden = false; productGrid.append(card); }); showStep();
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!steps[step].querySelector('input:checked')) {
      error.hidden = false;
      steps[step].setAttribute('aria-invalid','true');
      steps[step].setAttribute('aria-describedby',error.id);
      steps[step].querySelector('input').focus(); return;
    }
    if (step < steps.length - 1) { step += 1; showStep(); return; }
    const answers = Object.fromEntries(new FormData(form));
    const recommendations = rankProducts(candidates, answers);
    cards.forEach(card => { card.hidden = true; });
    recommendations.forEach(product => { product.card.hidden = false; productGrid.append(product.card); });
    root.querySelector('[data-quiz-empty]').hidden = recommendations.length > 0;
    root.querySelector('[data-quiz-result-count]').textContent = root.dataset.countLabel.replace('[count]',String(recommendations.length));
    submittedAnswers = answers;
    updateCatalogueLink(answers);
    form.hidden = true; results.hidden = false; error.hidden = true;
    status.textContent = root.dataset.finishedLabel;
    results.querySelector('h2').focus();
  });
}
if (typeof document !== 'undefined') {
  document.querySelectorAll('[data-style-quiz]').forEach(initializeQuiz);
  document.addEventListener('shopify:section:load', event => event.target.querySelectorAll('[data-style-quiz]').forEach(initializeQuiz));
}
