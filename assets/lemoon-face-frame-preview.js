const FILTER = 'filter.p.m.custom.frame_shape';
const SHAPES = new Set(['rectangular', 'redondo', 'geométrico', 'ovalado', 'aviador', 'ojo de gato']);
const INITIALIZED = new WeakSet();

// Suggested shapes stay selected; additional choices use native OR values.
export function facePreviewDestination(href, suggested, selected, baseURL) {
  if (!Array.isArray(suggested)) return null;
  const values = [...new Set(suggested)];
  if (values.length !== 2 || !values.every(value => SHAPES.has(value)) || !Array.isArray(selected) || !selected.every(value => SHAPES.has(value))) return null;
  let url;
  try {
    url = new URL(href, baseURL);
    if (url.origin !== new URL(baseURL).origin) return null;
  } catch { return null; }
  const existing = url.searchParams.getAll(FILTER);
  if (existing.length !== 2 || !values.every(value => existing.includes(value))) return null;
  const shapes = [...new Set([...values, ...selected])];
  url.searchParams.delete(FILTER);
  for (const shape of shapes) url.searchParams.append(FILTER, shape);
  return { href: `${url.pathname}${url.search}${url.hash}`, shapes };
}

export function initializeFaceFramePreviews(doc = document) {
  for (const family of doc.querySelectorAll('[data-face-frame-preview]')) {
    if (INITIALIZED.has(family)) continue;
    INITIALIZED.add(family);
    const picker = family.querySelector('[data-face-frame-picker]');
    const carousel = picker?.querySelector('[data-face-frame-carousel]');
    const choices = [...(carousel?.querySelectorAll('[data-face-frame-value]') || [])];
    const overlay = family.querySelector('[data-face-frame-overlay]');
    const toggle = family.querySelector('[data-face-frame-toggle]');
    const fallback = family.querySelector('[data-face-frame-fallback]');
    const portrait = family.querySelector('.lemoon-face-guide__portrait img');
    if (!choices.length || !overlay || !toggle || !portrait || !fallback) continue;
    const exit = family.querySelector('[data-face-guide-action="family_catalogue"]');
    const anchor = exit?.querySelector('a[href]');
    const originalHref = anchor?.getAttribute('href');
    const suggested = choices.filter(choice => choice.hasAttribute('data-face-frame-suggested')).map(choice => choice.dataset.faceFrameValue);
    const status = picker.querySelector('[data-face-frame-current]');
    const arrows = [...picker.querySelectorAll('[data-face-frame-scroll]')];
    let active = false;
    const selected = new Set(suggested);
    const reducedMotion = () => doc.defaultView.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const updateArrows = () => {
      arrows[0].disabled = carousel.scrollLeft <= 2;
      arrows[1].disabled = carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth - 2;
    };
    const select = choice => {
      for (const button of choices) button.setAttribute('aria-pressed', String(selected.has(button.dataset.faceFrameValue)));
      const artwork = choice.querySelector('svg')?.cloneNode(true);
      if (artwork) overlay.replaceChildren(artwork);
      overlay.dataset.faceFrameShape = choice.dataset.faceFrameValue;
      overlay.hidden = false;
      toggle.textContent = toggle.dataset.visibleLabel;
      status.textContent = choice.dataset.faceFrameLabel;
      // Custom destinations and incomplete native pairs retain their server-rendered exit.
      if (exit?.dataset.faceGuideDestination !== 'filtered_catalogue' || !anchor) return;
      const next = facePreviewDestination(originalHref, suggested, [...selected], doc.location.href);
      if (!next) return;
      anchor.setAttribute('href', next.href);
      exit.dataset.faceGuideShapes = next.shapes.join('|');
    };
    const show = () => {
      if (active) return; // Responsive srcset loads must not reset the current choice.
      active = true;
      picker.hidden = false;
      toggle.hidden = false;
      fallback.hidden = true;
      select(choices.find(choice => selected.has(choice.dataset.faceFrameValue)) || choices[0]);
      updateArrows();
    };
    const restore = () => {
      active = false;
      picker.hidden = true;
      toggle.hidden = true;
      overlay.hidden = true;
      fallback.hidden = false;
      if (anchor) anchor.setAttribute('href', originalHref);
      if (exit?.dataset.faceGuideDestination === 'filtered_catalogue') exit.dataset.faceGuideShapes = suggested.join('|');
    };
    for (const choice of choices) choice.addEventListener('click', () => {
      const value = choice.dataset.faceFrameValue;
      if (selected.has(value) && !suggested.includes(value)) selected.delete(value);
      else selected.add(value);
      const preview = selected.has(value) ? choice : choices.findLast(button => selected.has(button.dataset.faceFrameValue));
      select(preview || choice);
    });
    toggle.addEventListener('click', () => {
      overlay.hidden = !overlay.hidden;
      toggle.textContent = overlay.hidden ? toggle.dataset.hiddenLabel : toggle.dataset.visibleLabel;
    });
    for (const arrow of arrows) arrow.addEventListener('click', () => {
      const max = carousel.scrollWidth - carousel.clientWidth;
      const start = carousel.getBoundingClientRect().left;
      const padding = parseFloat(getComputedStyle(carousel).paddingLeft);
      const stops = choices.map(choice => Math.min(max, Math.max(0,
        choice.getBoundingClientRect().left - start + carousel.scrollLeft - padding)));
      const forward = Number(arrow.dataset.faceFrameScroll) > 0;
      const left = forward ? stops.find(stop => stop > carousel.scrollLeft + 2) ?? max
        : stops.findLast(stop => stop < carousel.scrollLeft - 2) ?? 0;
      carousel.scrollTo({ left, behavior: reducedMotion() ? 'instant' : 'smooth' });
    });
    carousel.addEventListener('scroll', updateArrows, { passive: true });
    if (doc.defaultView.ResizeObserver) new doc.defaultView.ResizeObserver(updateArrows).observe(carousel);
    portrait.addEventListener('load', show);
    portrait.addEventListener('error', restore);
    if (portrait.complete && portrait.naturalWidth > 0) show();
  }
}

if (typeof document !== 'undefined') {
  initializeFaceFramePreviews();
  document.addEventListener('shopify:section:load', () => initializeFaceFramePreviews());
}
