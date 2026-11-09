import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it, vi } from 'vitest';
import { buildFaceGuidePayload, initializeFaceGuideTracking, publishFaceGuideClick } from '../../assets/lemoon-face-guide.js';

const pixelSource = readFileSync(new URL('../../docs/analytics/face-guide-ga4-pixel.js', import.meta.url), 'utf8');
const validClick = () => ({ guide_id: 'face_shape', action: 'family_catalogue', link_position: 'family', destination: 'filtered_catalogue', face_family: 'long', selected_shapes: ['aviator', 'round'] });

function anchorFixture(overrides = {}) {
  const metadata = { dataset: { faceGuideAction: 'family_catalogue', faceGuidePosition: 'family', faceGuideDestination: 'filtered_catalogue', faceGuideShapes: 'aviador|redondo', ...overrides } };
  const family = { dataset: { faceGuideFamily: 'long' } };
  const root = { contains: node => node === metadata || node === family };
  const anchor = {
    closest: selector => ({ '[data-face-guide]': root, '[data-face-guide-action]': metadata, '[data-face-guide-family]': family, 'a[href]': anchor })[selector],
    matches: selector => selector === 'a[href]',
    get href() { throw new Error('Analytics must not inspect a potentially personal URL'); },
    get textContent() { throw new Error('Analytics must not inspect a merchant label'); },
  };
  return { anchor, root, metadata, family };
}

function trackingEnvironment({ allowed = true, hasAPI = true } = {}) {
  const listeners = new Map();
  const publish = vi.fn(() => Promise.resolve(true));
  const privacy = { analyticsProcessingAllowed: vi.fn(() => allowed) };
  const doc = { querySelector: () => ({}), addEventListener: vi.fn((type, callback) => { if (!listeners.has(type)) listeners.set(type, []); listeners.get(type).push(callback); }) };
  const environment = { document: doc, Shopify: { analytics: { publish }, ...(hasAPI ? { customerPrivacy: privacy } : {}) } };
  const emit = (type, target, details = {}) => {
    const event = { type, target, button: type === 'auxclick' ? 1 : 0, defaultPrevented: false, preventDefault: vi.fn(), ...details };
    for (const callback of listeners.get(type) || []) callback(event);
    return event;
  };
  return { environment, doc, privacy, publish, emit };
}

describe('theme face-guide event publisher', () => {
  it('builds controlled selection metadata without accessing URLs or merchant text', () => {
    expect(buildFaceGuidePayload(anchorFixture().anchor)).toEqual(validClick());
  });

  it('publishes the two suggestions and the distinct current extra shape as controlled codes', () => {
    const { anchor } = anchorFixture({ faceGuideShapes: 'rectangular|redondo|ojo de gato' });
    expect(buildFaceGuidePayload(anchor).selected_shapes).toEqual(['rectangular', 'round', 'cat-eye']);
  });

  it.each([
    ['redondo', 'round'], ['rectangular', 'rectangular'], ['geométrico', 'geometric'], ['ovalado', 'oval'], ['aviador', 'aviator'], ['ojo de gato', 'cat-eye'],
  ])('maps native shape %s to stable analytics code %s', (native, expected) => {
    const { anchor } = anchorFixture({ faceGuideAction: 'frame_shape', faceGuideFrame: native });
    expect(buildFaceGuidePayload(anchor)).toEqual({ guide_id: 'face_shape', action: 'frame_shape', link_position: 'family', destination: 'filtered_catalogue', face_family: 'long', frame_shape: expected });
  });

  it.each([
    { faceGuideAction: '__proto__' }, { faceGuideAction: 'purchase' }, { faceGuidePosition: 'closing' },
    { faceGuideDestination: 'https://private.test' }, { faceGuideShapes: 'redondo|redondo' },
    { faceGuideShapes: 'redondo' }, { faceGuideShapes: 'rectangular|redondo|redondo' },
    { faceGuideShapes: 'rectangular|redondo|ovalado|aviador' }, { faceGuideShapes: 'redondo|private@example.test' },
  ])('rejects unknown/inconsistent metadata instead of emitting free-form values: %j', override => {
    expect(buildFaceGuidePayload(anchorFixture(override).anchor)).toBeNull();
  });

  it('drops missing/unowned family metadata and non-links', () => {
    const { anchor, family, root } = anchorFixture();
    family.dataset.faceGuideFamily = 'private@example.test';
    expect(buildFaceGuidePayload(anchor)).toBeNull();
    family.dataset.faceGuideFamily = 'long';
    anchor.matches = () => false;
    expect(buildFaceGuidePayload(anchor)).toBeNull();
    anchor.matches = () => true;
    root.contains = () => false;
    expect(buildFaceGuidePayload(anchor)).toBeNull();
    expect(buildFaceGuidePayload(null)).toBeNull();
  });

  it.each(['catalogue', 'custom'])('does not claim selected shapes when the actual destination is %s', destination => {
    const { anchor } = anchorFixture({ faceGuideDestination: destination });
    expect(buildFaceGuidePayload(anchor)).toEqual({ guide_id: 'face_shape', action: 'family_catalogue', link_position: 'family', destination, face_family: 'long' });
  });

  it('checks effective consent on every attempt, including revocation, without recording a denied click for replay', async () => {
    const { environment, privacy, publish } = trackingEnvironment({ allowed: false });
    const { anchor } = anchorFixture();
    expect(publishFaceGuideClick(anchor, environment)).toBe(false);
    privacy.analyticsProcessingAllowed.mockReturnValue(true);
    expect(publish).not.toHaveBeenCalled();
    expect(publishFaceGuideClick(anchor, environment)).toBe(true);
    privacy.analyticsProcessingAllowed.mockReturnValue(false);
    expect(publishFaceGuideClick(anchor, environment)).toBe(false);
    expect(publish).toHaveBeenCalledExactlyOnceWith('lemoon:face_guide_click', validClick());
  });

  it('fails closed for unknown consent or unavailable publisher and contains thrown/rejected APIs', async () => {
    const { anchor } = anchorFixture();
    expect(publishFaceGuideClick(anchor, {})).toBe(false);
    const { environment, publish, privacy } = trackingEnvironment();
    privacy.analyticsProcessingAllowed.mockImplementation(() => { throw new Error('privacy unavailable'); });
    expect(publishFaceGuideClick(anchor, environment)).toBe(false);
    privacy.analyticsProcessingAllowed.mockReturnValue(true);
    publish.mockImplementation(() => { throw new Error('publisher unavailable'); });
    expect(publishFaceGuideClick(anchor, environment)).toBe(false);
    publish.mockRejectedValue(new Error('publisher unavailable'));
    expect(publishFaceGuideClick(anchor, environment)).toBe(true);
    await Promise.resolve();
  });

  it('uses one listener per interaction, accepts nested/keyboard/middle clicks and never cancels navigation', () => {
    const { environment, doc, publish, emit } = trackingEnvironment();
    const { anchor } = anchorFixture();
    expect(initializeFaceGuideTracking(environment)).toBe(true);
    expect(initializeFaceGuideTracking(environment)).toBe(false);
    const nested = { closest: selector => selector === 'a[href]' ? anchor : null };
    for (const [type, details] of [['click', { detail: 0 }], ['click', {}], ['auxclick', { button: 1 }]]) {
      expect(emit(type, nested, details).preventDefault).not.toHaveBeenCalled();
    }
    expect(publish).toHaveBeenCalledTimes(3);
    emit('click', nested, { defaultPrevented: true });
    emit('click', nested, { button: 2 });
    emit('auxclick', nested, { button: 2 });
    expect(publish).toHaveBeenCalledTimes(3);
    emit('shopify:section:load');
    expect(doc.addEventListener).toHaveBeenCalledTimes(3);
  });

  it('requests the privacy feature once without delaying or replaying clicks while permission is unknown', () => {
    const { environment, publish, emit } = trackingEnvironment({ hasAPI: false });
    environment.Shopify.loadFeatures = vi.fn();
    initializeFaceGuideTracking(environment);
    const { anchor } = anchorFixture();
    const event = emit('click', anchor);
    emit('shopify:section:load');
    expect(environment.Shopify.loadFeatures).toHaveBeenCalledExactlyOnceWith([{ name: 'consent-tracking-api', version: '0.2' }], expect.any(Function));
    expect(publish).not.toHaveBeenCalled();
    expect(event.preventDefault).not.toHaveBeenCalled();
    environment.Shopify.customerPrivacy = { analyticsProcessingAllowed: () => true };
    environment.Shopify.loadFeatures.mock.calls[0][1]();
    expect(publish).not.toHaveBeenCalled();
    emit('click', anchor);
    expect(publish).toHaveBeenCalledTimes(1);
  });
});

// Runs the actual installable pixel in its documented sandbox shape, with no SDK
// or network. Queue assertions prove mapping; they do not prove GA4 reception.
function pixel(initialPermission, { privacyMode = 'available' } = {}) {
  const events = new Map();
  const privacy = new Map();
  const document = { createElement: vi.fn(() => ({})), head: { appendChild: vi.fn() } };
  const subscribe = vi.fn((name, callback) => {
    if (privacyMode === 'throw') throw new Error('privacy subscription failed');
    if (privacyMode === 'reject') return Promise.reject(new Error('privacy subscription failed'));
    privacy.set(name, callback);
    return Promise.resolve();
  });
  const environment = {
    window: {}, document, init: { customerPrivacy: initialPermission },
    analytics: { subscribe: vi.fn((name, callback) => { events.set(name, callback); return Promise.resolve(); }) },
    // Custom Pixels expose privacy through api; unlike App Pixels, there is no
    // destructured/global customerPrivacy variable in this fixture.
    ...(privacyMode === 'missing' ? {} : { api: privacyMode === 'empty' ? {} : { customerPrivacy: { subscribe } } }),
  };
  const execute = () => runInNewContext(pixelSource, environment);
  execute();
  const commands = () => (environment.window.dataLayer || []).map(args => [...args]);
  return {
    environment, document, execute, commands,
    subscriptions: events,
    fire: (data = validClick()) => events.get('lemoon:face_guide_click')({ customData: data }),
    page: location => events.get('page_viewed')({ context: { document: { location } } }),
    consent: permission => privacy.get('visitorConsentCollected')({ customerPrivacy: permission }),
    analyticsEvents: () => commands().filter(([command]) => command === 'event'),
  };
}

describe('GA4 custom-pixel receiver for face-guide clicks', () => {
  it('uses the Custom Pixel api.customerPrivacy observer without requiring an App Pixel global', () => {
    const p = pixel({ analyticsProcessingAllowed: true });
    expect(p.environment).not.toHaveProperty('customerPrivacy');
    expect(p.environment.api.customerPrivacy.subscribe).toHaveBeenCalledExactlyOnceWith('visitorConsentCollected', expect.any(Function));
    p.fire();
    p.consent({ analyticsProcessingAllowed: false });
    p.fire();
    expect(p.analyticsEvents()).toHaveLength(1);
  });

  it.each(['missing', 'empty', 'throw', 'reject'])('fails closed if the Custom Pixel privacy observer is %s', async privacyMode => {
    const p = pixel({ analyticsProcessingAllowed: true }, { privacyMode });
    await Promise.resolve();
    p.subscriptions.get('page_viewed')?.({ context: { document: { location: { pathname: '/pages/elegir-lentes-segun-tu-rostro' } } } });
    p.subscriptions.get('lemoon:face_guide_click')?.({ customData: validClick() });
    expect(p.analyticsEvents()).toEqual([]);
    expect(p.document.head.appendChild).not.toHaveBeenCalled();
    if (privacyMode !== 'reject') expect(p.environment.analytics.subscribe).not.toHaveBeenCalled();
  });

  it.each([
    '/pages/elegir-lentes-segun-tu-rostro',
    '/pages/elegir-lentes-segun-tu-rostro/',
    '/en/pages/elegir-lentes-segun-tu-rostro',
    '/es-cl/pages/elegir-lentes-segun-tu-rostro/',
  ])('prepares the SDK on the permitted guide page before an outbound click, without forwarding page_viewed: %s', pathname => {
    const p = pixel({ analyticsProcessingAllowed: true });
    p.page({ pathname });
    expect(p.document.head.appendChild).toHaveBeenCalledTimes(1);
    expect(p.commands().filter(([command]) => command === 'config')).toHaveLength(1);
    expect(p.commands().find(([command]) => command === 'config')[2].send_page_view).toBe(false);
    expect(p.analyticsEvents()).toEqual([]);
    p.fire();
    expect(p.analyticsEvents()).toHaveLength(1);
    expect(p.document.head.appendChild).toHaveBeenCalledTimes(1);
  });

  it.each([undefined, '/', '/collections/all', '/pages/nosotros', '/pages/elegir-lentes-segun-tu-rostro/extra'])('does not initialize a vendor or forward standard events outside the guide: %s', pathname => {
    const p = pixel({ analyticsProcessingAllowed: true });
    p.page({ pathname });
    p.consent({ analyticsProcessingAllowed: true });
    expect(p.document.head.appendChild).not.toHaveBeenCalled();
    expect(p.commands()).toEqual([]);
  });

  it('waits for effective consent on the guide, warms up on a later grant and never turns page or denied-click events into GA4 events', () => {
    const p = pixel({ analyticsProcessingAllowed: false });
    p.page({ pathname: '/pages/elegir-lentes-segun-tu-rostro' });
    p.fire();
    expect(p.commands()).toEqual([]);
    p.consent({ analyticsProcessingAllowed: true });
    expect(p.document.head.appendChild).toHaveBeenCalledTimes(1);
    expect(p.analyticsEvents()).toEqual([]);
    p.consent({ analyticsProcessingAllowed: false });
    expect(p.commands().at(-1)).toEqual(['consent', 'update', { analytics_storage: 'denied' }]);
    p.fire();
    expect(p.analyticsEvents()).toEqual([]);
    p.consent({ analyticsProcessingAllowed: true });
    p.fire();
    expect(p.analyticsEvents()).toHaveLength(1);
    expect(p.document.head.appendChild).toHaveBeenCalledTimes(1);
  });

  it('does not warm up after leaving the guide while consent was unknown', () => {
    const p = pixel(undefined);
    p.page({ pathname: '/pages/elegir-lentes-segun-tu-rostro' });
    p.page({ pathname: '/collections/all' });
    p.consent({ analyticsProcessingAllowed: true });
    expect(p.commands()).toEqual([]);
    expect(p.document.head.appendChild).not.toHaveBeenCalled();
  });

  it('reads only pathname for page scoping and uses a fixed public page URL in the GA4 config', () => {
    const p = pixel({ analyticsProcessingAllowed: true });
    p.page({
      pathname: '/pages/elegir-lentes-segun-tu-rostro',
      get href() { throw new Error('Do not read personal query values'); },
      get search() { throw new Error('Do not read personal query values'); },
    });
    expect(p.commands().find(([command]) => command === 'config')[2]).toMatchObject({ page_location: 'https://lemoon.cl/pages/elegir-lentes-segun-tu-rostro', page_referrer: '' });
    expect(p.analyticsEvents()).toEqual([]);
  });

  it.each([undefined, {}, { analyticsProcessingAllowed: false }, { analyticsProcessingAllowed: 'yes' }])('does not load Google or retain a click without explicit effective permission: %j', permission => {
    const p = pixel(permission);
    p.fire();
    expect(p.commands()).toEqual([]);
    expect(p.document.head.appendChild).not.toHaveBeenCalled();
    p.consent({ analyticsProcessingAllowed: true });
    expect(p.commands()).toEqual([]);
    expect(p.document.head.appendChild).not.toHaveBeenCalled();
  });

  it('lazily configures only the existing stream and forwards allowlisted metadata without pageview or commerce events', () => {
    const p = pixel({ analyticsProcessingAllowed: true });
    p.fire({ ...validClick(), email: 'private@example.test', destination_url: '/collections/all?email=private@example.test', customer_id: 'sensitive', label: 'Customer name' });
    expect(p.environment.analytics.subscribe).toHaveBeenCalledWith('lemoon:face_guide_click', expect.any(Function));
    expect(p.document.head.appendChild).toHaveBeenCalledTimes(1);
    expect(p.document.head.appendChild.mock.calls[0][0]).toMatchObject({ async: true, src: 'https://www.googletagmanager.com/gtag/js?id=G-QD3MYEBH5F' });
    const commands = p.commands();
    expect(commands[0]).toEqual(['consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' }]);
    expect(commands.find(([command]) => command === 'config')).toEqual(['config', 'G-QD3MYEBH5F', {
      send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false,
      page_location: 'https://lemoon.cl/pages/elegir-lentes-segun-tu-rostro', page_referrer: '',
    }]);
    expect(p.analyticsEvents()).toEqual([['event', 'face_guide_click', {
      guide_id: 'face_shape', action: 'family_catalogue', link_position: 'family', destination: 'filtered_catalogue', face_family: 'long', selected_shapes: 'aviator|round', send_to: 'G-QD3MYEBH5F',
    }]]);
    expect(JSON.stringify(commands)).not.toMatch(/private@|sensitive|Customer name|purchase/);
  });

  it('forwards three distinct controlled shapes from the illustrative preview', () => {
    const p = pixel({ analyticsProcessingAllowed: true });
    p.fire({ ...validClick(), selected_shapes: ['rectangular', 'round', 'cat-eye'] });
    expect(p.analyticsEvents()[0][2].selected_shapes).toBe('rectangular|round|cat-eye');
  });

  it('updates consent, drops revoked clicks, never replays them and initializes the vendor only once', () => {
    const p = pixel({ analyticsProcessingAllowed: true });
    p.fire();
    p.consent({ analyticsProcessingAllowed: false });
    expect(p.commands().at(-1)).toEqual(['consent', 'update', { analytics_storage: 'denied' }]);
    p.fire();
    expect(p.analyticsEvents()).toHaveLength(1);
    p.consent({ analyticsProcessingAllowed: true });
    expect(p.analyticsEvents()).toHaveLength(1);
    p.fire();
    expect(p.analyticsEvents()).toHaveLength(2);
    expect(p.document.head.appendChild).toHaveBeenCalledTimes(1);
    expect(p.commands().filter(([command]) => command === 'config')).toHaveLength(1);
  });

  it.each([
    null, {}, { guide_id: 'other' }, { action: 'purchase' }, { link_position: 'private@example.test' }, { destination: 'https://private.test' },
    { face_family: 'private@example.test' }, { frame_shape: 'unknown' }, { selected_shapes: ['round'] },
    { selected_shapes: ['round', 'round'] }, { selected_shapes: ['round', 'oval', 'round'] },
    { selected_shapes: ['round', 'oval', 'aviator', 'cat-eye'] }, { selected_shapes: ['round', 'private@example.test'] }, { selected_shapes: 'round|aviator' },
  ])('ignores malformed or uncontrolled event data before loading the SDK: %j', patch => {
    const p = pixel({ analyticsProcessingAllowed: true });
    p.fire(patch === null ? null : Object.keys(patch).length ? { ...validClick(), ...patch } : {});
    expect(p.commands()).toEqual([]);
    expect(p.document.head.appendChild).not.toHaveBeenCalled();
  });

  it('does not register another receiver when the pixel is evaluated twice', () => {
    const p = pixel({ analyticsProcessingAllowed: true });
    p.execute();
    expect(p.environment.analytics.subscribe).toHaveBeenCalledTimes(2);
    expect(p.environment.analytics.subscribe.mock.calls.map(([name]) => name)).toEqual(['page_viewed', 'lemoon:face_guide_click']);
    expect(p.environment.api.customerPrivacy.subscribe).toHaveBeenCalledTimes(1);
    p.fire();
    expect(p.analyticsEvents()).toHaveLength(1);
  });

  it('contains a blocked vendor SDK failure without throwing into the event publisher', () => {
    const p = pixel({ analyticsProcessingAllowed: true });
    p.document.createElement.mockImplementation(() => { throw new Error('blocked SDK'); });
    expect(() => p.page({ pathname: '/pages/elegir-lentes-segun-tu-rostro' })).not.toThrow();
    expect(() => p.fire()).not.toThrow();
    expect(p.analyticsEvents()).toHaveLength(0);
  });
});
