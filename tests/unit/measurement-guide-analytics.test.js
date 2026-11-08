import { test, expect, vi } from 'vitest';
import { initializeMeasurementGuideAnalytics } from '../../assets/lemoon-measurement-guide-analytics.js';
import { renderComponentSection } from '../helpers/component-library-renderer.mjs';
function harness({ allowed = true, language = 'es', sdk = true, editor = false, loader, hidden = false } = {}) {
  const doc = new EventTarget(); doc.visibilityState = hidden ? 'hidden' : 'visible';
  const environment = new EventTarget(); const instances = [];
  const publish = vi.fn(() => Promise.resolve(true));
  const privacy = { analyticsProcessingAllowed: vi.fn(() => allowed) };
  Object.assign(environment, { document: doc, AbortController, Shopify: { designMode: editor, ...(sdk ? { analytics: { publish } } : {}) }, IntersectionObserver: class {
    constructor(callback, options) { this.callback = callback; this.options = options; this.targets = []; this.disconnected = false; instances.push(this); }
    observe(target) { this.targets.push(target); }
    disconnect() { this.disconnected = true; }
  } });
  const guide = new EventTarget(), title = {}, headings = [{}, {}, {}];
  const links = [1, 2, 3].map(step => ({ dataset: { measurementGuideStepClick: String(step) } }));
  const catalogue = {};
  Object.assign(guide, { ownerDocument: doc, dataset: { guideLanguage: language }, contains: target => links.includes(target) || target === catalogue,
    querySelector: () => title, querySelectorAll: () => headings.map((heading, index) => ({ dataset: { measurementGuideStep: String(index + 1) }, querySelector: () => heading })) });
  const privacyLoader = vi.fn(loader || (() => Promise.resolve(privacy)));
  const initialize = () => initializeMeasurementGuideAnalytics(guide, { environment, privacyLoader });
  const controller = initialize();
  const click = (step = null) => {
    const event = new Event('click', { cancelable: true });
    Object.defineProperty(event, 'target', { value: { closest: selector => step ? selector.startsWith('a[') ? links[step - 1] : null : selector.startsWith('[data-measurement-guide-catalogue]') ? catalogue : null } });
    guide.dispatchEvent(event); return event;
  };
  const emit = (target, ratio = 1, instance = instances.at(-1)) => instance?.callback([{ target, isIntersecting: ratio > 0, intersectionRatio: ratio }]);
  const consent = value => { privacy.analyticsProcessingAllowed.mockReturnValue(value); doc.dispatchEvent(new Event('visitorConsentCollected')); };
  const visibility = value => { doc.visibilityState = value; doc.dispatchEvent(new Event('visibilitychange')); };
  const lifecycle = (name, persisted) => { const event = new Event(name); Object.defineProperty(event, 'persisted', { value: persisted }); environment.dispatchEvent(event); };
  return { guide, title, headings, links, catalogue, doc, environment, instances, publish, privacy, privacyLoader, controller, initialize, click, emit, consent, visibility, lifecycle };
}
test('publisher gates strictly on native analytics consent and unavailable privacy fails closed', async () => {
  for (const allowed of [false, undefined, 'yes', 1]) {
    const h = harness({ allowed: false }); h.privacy.analyticsProcessingAllowed.mockReturnValue(allowed); await h.controller.ready;
    h.click(1); h.click(); expect(h.publish).not.toHaveBeenCalled(); expect(h.instances).toHaveLength(0); h.controller.destroy();
  }
  const h = harness({ loader: () => Promise.reject(Error('Native API unavailable')) }); await h.controller.ready;
  h.click(); expect(h.publish).not.toHaveBeenCalled(); expect(h.instances).toHaveLength(0);
  h.controller.destroy();
});
test('publisher observes heading thresholds, handles deep entry and deduplicates only views', async () => {
  const h = harness({ language: 'en' }); await h.controller.ready;
  expect(h.instances[0].options.threshold).toBe(0.5); expect(h.instances[0].targets).toEqual([h.title, ...h.headings]);
  h.emit(h.title, 0.49); h.emit({}); expect(h.publish).not.toHaveBeenCalled();
  h.emit(h.headings[2], 0.5); h.emit(h.headings[2]); h.emit(h.title);
  expect(h.publish.mock.calls).toEqual([['lemoon:size_guide_view', { guide_type: 'measurements', guide_language: 'en' }], ['lemoon:size_guide_step_view', { guide_type: 'measurements', guide_language: 'en', step_number: 3 }]]);
  h.emit(h.headings[0]); h.emit(h.headings[1]); h.emit(h.headings[0]);
  expect(h.publish.mock.calls.filter(([name]) => name.endsWith('step_view')).map(([, data]) => data.step_number)).toEqual([3, 1, 2]);
  h.click(2); h.click(2); h.click();
  expect(h.publish.mock.calls.slice(-3)).toEqual([['lemoon:size_guide_step_click', { guide_type: 'measurements', guide_language: 'en', step_number: 2 }], ['lemoon:size_guide_step_click', { guide_type: 'measurements', guide_language: 'en', step_number: 2 }], ['lemoon:size_guide_catalog_click', { guide_type: 'measurements', guide_language: 'en', link_destination: 'catalogue' }]]);
  h.controller.destroy();
});
test('pending or denied interactions are discarded and consent grants use only fresh visible intersections', async () => {
  let release; const native = { analyticsProcessingAllowed: () => false };
  const h = harness({ loader: () => new Promise(resolve => { release = resolve; }) });
  h.click(1); await Promise.resolve(); release(native); await h.controller.ready;
  h.click(2); expect(h.publish).not.toHaveBeenCalled(); expect(h.instances).toHaveLength(0);
  native.analyticsProcessingAllowed = () => true; h.doc.dispatchEvent(new Event('visitorConsentCollected'));
  h.emit(h.headings[2]);
  expect(h.publish.mock.calls.map(([name, payload]) => [name, payload.step_number])).toEqual([['lemoon:size_guide_view', undefined], ['lemoon:size_guide_step_view', 3]]);
  native.analyticsProcessingAllowed = () => false; h.doc.dispatchEvent(new Event('visitorConsentCollected')); h.click(1); h.emit(h.headings[0], 1, h.instances[0]);
  expect(h.publish).toHaveBeenCalledTimes(2); h.controller.destroy();
});
test('hidden documents discard clicks and stale observations, with fresh observation on visibility return', async () => {
  const h = harness(); await h.controller.ready; const old = h.instances[0];
  h.visibility('hidden'); h.click(); h.emit(h.headings[0], 1, old); expect(h.publish).not.toHaveBeenCalled(); expect(old.disconnected).toBe(true);
  h.visibility('visible'); h.emit(h.headings[0], 1, old); expect(h.publish).not.toHaveBeenCalled();
  h.emit(h.headings[1]); expect(h.publish).toHaveBeenCalledTimes(2); h.controller.destroy();
});
test('missing SDK, API errors and rejected publishes never interrupt navigation or create an interaction queue', async () => {
  const h = harness({ sdk: false }); await h.controller.ready; h.emit(h.title); expect(h.click().defaultPrevented).toBe(false);
  h.environment.Shopify.analytics = { publish: h.publish }; h.emit(h.title); expect(h.publish).toHaveBeenCalledTimes(1);
  h.publish.mockImplementation(() => { throw Error('SDK unavailable'); }); expect(h.click(1).defaultPrevented).toBe(false);
  h.publish.mockImplementation(() => Promise.reject(Error('SDK rejected'))); expect(h.click().defaultPrevented).toBe(false); await Promise.resolve();
  h.privacy.analyticsProcessingAllowed.mockImplementation(() => { throw Error('Privacy unavailable'); }); const count = h.publish.mock.calls.length; h.click(); expect(h.publish).toHaveBeenCalledTimes(count);
  h.controller.destroy();
});
test('initialization is idempotent, BFCache preserves once-only views, and destruction removes handlers', async () => {
  const h = harness(); await h.controller.ready; expect(h.initialize()).toBe(h.controller); expect(h.privacyLoader).toHaveBeenCalledTimes(1);
  h.emit(h.title); h.lifecycle('pagehide', true); h.click(); h.emit(h.headings[0]); expect(h.publish).toHaveBeenCalledTimes(1);
  h.lifecycle('pageshow', true); h.emit(h.title); h.emit(h.headings[0]); expect(h.publish).toHaveBeenCalledTimes(2);
  h.lifecycle('pagehide', false); h.click(1); h.emit(h.headings[1]); expect(h.publish).toHaveBeenCalledTimes(2);
  const next = h.initialize(); expect(next).not.toBe(h.controller); await next.ready; next.destroy();
});
test('theme editor never initializes analytics and section hooks remain scoped to measurements', async () => {
  const h = harness({ editor: true }); expect(h.controller).toBeNull(); expect(h.privacyLoader).not.toHaveBeenCalled();
  for (const kind of ['measurements', 'face', 'order', 'try_on', 'prescription']) for (const editor of [false, true]) {
    const html = renderComponentSection('lemoon-guide-page', { settings: { guide_kind: kind }, context: { request: { design_mode: editor, locale: { iso_code: 'en' } } } });
    if (kind === 'measurements' && !editor) expect(html).toContain('/assets/lemoon-measurement-guide-analytics.js');
    else expect(html).not.toContain('/assets/lemoon-measurement-guide-analytics.js');
    if (kind === 'measurements') expect(html).toContain('data-guide-language="en"');
    else expect(html).not.toContain('data-measurement-guide');
  }
});
