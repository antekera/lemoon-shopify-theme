import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { test, expect } from 'vitest';
const source = () => readFileSync(new URL('../../scripts/shopify-pixels/lemoon-measurement-guide-ga4.js', import.meta.url), 'utf8');
const names = ['view', 'step_view', 'step_click', 'catalog_click'];
function harness(allowed = true, options = {}) {
  const subscriptions = new Map(), privacySubscriptions = new Map(), scripts = [];
  const environment = {
    URL, Set, Map, console,
    analytics: { subscribe: (name, callback) => subscriptions.set(name, callback) },
    init: { customerPrivacy: { analyticsProcessingAllowed: allowed } },
    api: { customerPrivacy: { subscribe: (name, callback) => privacySubscriptions.set(name, callback) } },
    document: { createElement: () => ({}), head: { appendChild: element => scripts.push(element) } },
    ...options,
  };
  environment.window = environment;
  const run = () => runInNewContext(source(), environment);
  run();
  const send = (name = 'view', changes = {}) => {
    const event = { id: `fixture-${name}`, name: `lemoon:size_guide_${name}`, customData: { guide_type: 'measurements', guide_language: 'es', ...(['step_view', 'step_click'].includes(name) ? { step_number: 2 } : {}), ...(name === 'catalog_click' ? { link_destination: 'catalogue' } : {}) }, context: { document: { location: { href: 'https://lemoon.cl/pages/como-medir-tus-anteojos?private=discard#step' }, referrer: 'https://private.invalid/sensitive' } }, ...changes };
    subscriptions.get(`lemoon:size_guide_${name}`)?.(event);
    return event;
  };
  const commands = () => (environment.dataLayer || []).map(command => [...command]);
  const events = () => commands().filter(([kind]) => kind === 'event');
  const consent = state => privacySubscriptions.get('visitorConsentCollected')?.({ customerPrivacy: { analyticsProcessingAllowed: state } });
  return { environment, subscriptions, privacySubscriptions, scripts, run, send, commands, events, consent };
}
test('pixel subscribes only four guide events and initializes Google lazily without page_view or advertising', () => {
  const h = harness();
  expect([...h.subscriptions.keys()].sort()).toEqual(names.map(name => `lemoon:size_guide_${name}`).sort());
  expect(h.scripts).toEqual([]); expect(h.events()).toEqual([]);
  for (const name of names) h.send(name);
  expect(h.scripts).toHaveLength(1);
  expect(h.scripts[0].src).toBe('https://www.googletagmanager.com/gtag/js?id=G-QD3MYEBH5F');
  expect(h.events().map(([, name]) => name)).toEqual(names.map(name => `size_guide_${name}`));
  expect(h.commands().find(([name]) => name === 'config')).toEqual(['config', 'G-QD3MYEBH5F', expect.objectContaining({ send_page_view: false })]);
  for (const [, , payload] of h.events()) {
    expect(payload).toEqual(expect.objectContaining({ guide_type: 'measurements', guide_language: 'es', send_to: 'G-QD3MYEBH5F' }));
    expect(JSON.stringify(payload)).not.toMatch(/private|discard|sensitive/);
    expect(payload.page_referrer).toBe('');
  }
  for (const [, , consent] of h.commands().filter(([name]) => name === 'consent')) expect(consent).toEqual(expect.objectContaining({ ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' }));
});
test('pixel denies unknown consent, updates consent, drops earlier interactions and stops after revocation', () => {
  for (const initial of [false, undefined, 'yes', 1]) {
    const h = harness(initial, { init: { customerPrivacy: { analyticsProcessingAllowed: initial } } }); h.send('step_click'); expect(h.scripts).toHaveLength(0); expect(h.events()).toHaveLength(0);
    h.consent(true); expect(h.events()).toHaveLength(0);
    h.send('view'); expect(h.events()).toHaveLength(1);
    h.consent(false); h.send('catalog_click'); expect(h.events()).toHaveLength(1);
  }
});
test('pixel restricts destination to both canonical hosts and guide paths, including trailing slash', () => {
  for (const host of ['lemoon.cl', 'www.lemoon.cl']) for (const path of ['/pages/como-medir-tus-anteojos', '/en/pages/como-medir-tus-anteojos/']) {
    const h = harness(); h.send('view', { customData: { guide_type: 'measurements', guide_language: path.startsWith('/en/') ? 'en' : 'es' }, context: { document: { location: { href: `https://${host}${path}` } } } }); expect(h.events()).toHaveLength(1);
  }
  for (const href of ['http://lemoon.cl/pages/como-medir-tus-anteojos', 'https://evil.lemoon.cl/pages/como-medir-tus-anteojos', 'https://lemoon-8277.myshopify.com/pages/como-medir-tus-anteojos', 'https://localhost/pages/como-medir-tus-anteojos', 'https://lemoon.cl/products/any', 'https://lemoon.cl/pages/como-medir-tus-anteojos?preview_theme_id=1', 'https://lemoon.cl/admin/themes/current/editor']) {
    const h = harness(); h.send('view', { context: { document: { location: { href } } } }); expect(h.scripts, href).toHaveLength(0); expect(h.events(), href).toHaveLength(0);
  }
});
test('pixel rejects malformed events before any Google initialization', () => {
  const invalid = [
    { id: '' }, { id: null }, { id: 'x'.repeat(201) }, { id: 7 },
    { customData: { guide_type: 'other', guide_language: 'es' } },
    { customData: { guide_type: 'measurements', guide_language: 'es-CL' } },
    { customData: { guide_type: 'measurements', guide_language: 'unknown' } },
    { context: {} }, { context: { document: { location: { href: 'not-a-url' } } } },
  ];
  for (const change of invalid) { const h = harness(); h.send('view', change); expect(h.events(), JSON.stringify(change)).toHaveLength(0); expect(h.scripts).toHaveLength(0); }
  for (const number of [0, 4, -1, '2', NaN, null, undefined]) {
    const h = harness(); h.send('step_view', { customData: { guide_type: 'measurements', guide_language: 'es', step_number: number } }); expect(h.events(), String(number)).toHaveLength(0);
  }
});
test('pixel emits only whitelisted payload and preserves valid English steps and catalogue classification', () => {
  const h = harness();
  h.send('step_click', { context: { document: { location: { href: 'https://lemoon.cl/en/pages/como-medir-tus-anteojos' } } }, customData: { guide_type: 'measurements', guide_language: 'en', step_number: 3, email: 'private@example.invalid', page_location: 'https://private.invalid', link_destination: 'untrusted' } });
  const payload = h.events()[0][2];
  expect(payload).toEqual(expect.objectContaining({ guide_language: 'en', step_number: 3 }));
  expect(payload).not.toHaveProperty('email'); expect(payload).not.toHaveProperty('link_destination');
  expect(JSON.stringify(payload)).not.toMatch(/private/);
});
test('pixel deduplicates native event IDs, bounds memory and is idempotent when evaluated twice', () => {
  const h = harness(); h.run();
  h.send('view'); h.send('view'); expect(h.events()).toHaveLength(1);
  for (let index = 0; index < 257; index++) h.send('step_view', { id: `bounded-${index}` });
  const count = h.events().length;
  h.send('step_view', { id: 'bounded-256' }); expect(h.events()).toHaveLength(count);
  h.send('view'); expect(h.events()).toHaveLength(count + 1);
  expect(h.scripts).toHaveLength(1);
});
test('pixel fails closed when required native privacy or analytics integration is absent', () => {
  for (const change of [{ api: {} }, { analytics: {} }, { init: {} }]) {
    const h = harness(false, change); h.send(); expect(h.events()).toHaveLength(0); expect(h.scripts).toHaveLength(0);
  }
});
