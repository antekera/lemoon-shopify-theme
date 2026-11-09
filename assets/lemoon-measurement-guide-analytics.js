import { loadCustomerPrivacy } from './lemoon-cookie-preferences.js';

const controllers = new WeakMap();
const stepNumber = (value) => [1, 2, 3].includes(Number(value)) ? Number(value) : null;

/** Publish only bounded guide metadata through Shopify's custom-events API. */
export function initializeMeasurementGuideAnalytics(guide, {
  environment = window,
  privacyLoader = loadCustomerPrivacy,
} = {}) {
  if (!guide || environment.Shopify?.designMode) return null;
  if (controllers.has(guide)) return controllers.get(guide);
  const doc = guide.ownerDocument || environment.document;
  if (!doc) return null;

  const abort = new environment.AbortController();
  const { signal } = abort;
  const language = guide.dataset.guideLanguage === 'en' ? 'en' : 'es';
  const targets = new Map();
  const title = guide.querySelector('[data-measurement-guide-intro] h1');
  if (title) targets.set(title, null);
  guide.querySelectorAll('[data-measurement-guide-step]').forEach((host) => {
    const step = stepNumber(host.dataset.measurementGuideStep);
    const heading = host.querySelector('h2');
    if (step && heading) targets.set(heading, step);
  });

  let privacy;
  let privacyLoading;
  let observer;
  let observerGeneration = 0;
  let suspended = false;
  let destroyed = false;
  let viewed = false;
  const stepsViewed = new Set();

  function permitted() {
    if (destroyed || suspended || environment.Shopify?.designMode || doc.visibilityState !== 'visible') return false;
    try { return privacy?.analyticsProcessingAllowed?.() === true; } catch { return false; }
  }

  function publish(event, step) {
    if (!permitted() || typeof environment.Shopify?.analytics?.publish !== 'function') return false;
    const payload = { guide_type: 'measurements', guide_language: language };
    if (step) payload.step_number = step;
    if (event === 'lemoon:size_guide_catalog_click') payload.link_destination = 'catalogue';
    try {
      // No queue: denied/unavailable clicks are discarded, including while the
      // privacy service loads. Rejections never interrupt navigation or the UI.
      const result = environment.Shopify.analytics.publish(event, payload);
      if (result && typeof result.then === 'function') Promise.resolve(result).catch(() => {});
      return true;
    } catch { return false; }
  }

  function stopObservation() {
    observerGeneration++;
    observer?.disconnect();
    observer = undefined;
  }

  function observeCurrentHeadings() {
    stopObservation();
    if (!permitted() || typeof environment.IntersectionObserver !== 'function') return;
    const generation = observerGeneration;
    observer = new environment.IntersectionObserver((entries) => {
      if (destroyed || suspended || generation !== observerGeneration) return;
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.5 || !targets.has(entry.target)) return;
        const step = targets.get(entry.target);
        if (!viewed && publish('lemoon:size_guide_view')) viewed = true;
        if (step && !stepsViewed.has(step) && publish('lemoon:size_guide_step_view', step)) stepsViewed.add(step);
      });
    }, { threshold: 0.5 });
    targets.forEach((_, heading) => observer.observe(heading));
  }

  function ensurePrivacy() {
    if (destroyed) return Promise.resolve();
    if (privacy) { observeCurrentHeadings(); return Promise.resolve(); }
    if (privacyLoading) return privacyLoading;
    privacyLoading = Promise.resolve().then(() => privacyLoader(environment)).then((api) => {
      if (destroyed) return;
      privacy = api;
      observeCurrentHeadings();
    }).catch(() => {}).finally(() => { privacyLoading = undefined; });
    return privacyLoading;
  }

  guide.addEventListener('click', (event) => {
    const stepLink = event.target?.closest?.('a[data-measurement-guide-step-click][href]');
    if (stepLink && guide.contains(stepLink)) {
      const step = stepNumber(stepLink.dataset.measurementGuideStepClick);
      if (step) publish('lemoon:size_guide_step_click', step);
      return;
    }
    const catalogueLink = event.target?.closest?.('[data-measurement-guide-catalogue] a[href]');
    if (catalogueLink && guide.contains(catalogueLink)) publish('lemoon:size_guide_catalog_click');
  }, { signal });

  // Re-observing after a grant or tab visibility change obtains fresh heading
  // intersections. It never replays a heading visited while consent was denied.
  doc.addEventListener('visitorConsentCollected', () => { ensurePrivacy(); }, { signal });
  doc.addEventListener('visibilitychange', () => {
    if (doc.visibilityState === 'visible') ensurePrivacy();
    else stopObservation();
  }, { signal });
  environment.addEventListener('pagehide', (event) => {
    suspended = true;
    stopObservation();
    if (!event.persisted) destroy();
  }, { signal });
  environment.addEventListener('pageshow', (event) => {
    if (!event.persisted || destroyed) return;
    suspended = false;
    ensurePrivacy();
  }, { signal });

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    stopObservation();
    abort.abort();
    controllers.delete(guide);
  }

  const controller = { destroy, ready: ensurePrivacy() };
  controllers.set(guide, controller);
  return controller;
}

if (typeof document !== 'undefined' && typeof window !== 'undefined' && !window.Shopify?.designMode) {
  document.querySelectorAll('[data-measurement-guide]').forEach((guide) => initializeMeasurementGuideAnalytics(guide));
}
