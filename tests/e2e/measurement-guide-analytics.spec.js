import { test, expect } from '@playwright/test';
const base = '/tests/fixtures/measurement-guide-analytics.html';
const stepId = step => `#Guide-measurement-analytics-fixture-${step}`;
const events = page => page.evaluate(() => window.fixtureEvents);
async function ready(page) {
  await page.evaluate(async () => {
    const { initializeMeasurementGuideAnalytics } = await import('/assets/lemoon-measurement-guide-analytics.js');
    await initializeMeasurementGuideAnalytics(document.querySelector('[data-measurement-guide]'))?.ready;
  });
}
async function privacy(page, allowed) { await page.evaluate(value => window.fixtureSetConsent(value), allowed); }
async function heading(page, step) { await page.locator(`${stepId(step)} h2`).scrollIntoViewIfNeeded(); await expect(page.locator(`${stepId(step)} h2`)).toBeInViewport({ ratio: 0.5 }); }
async function navigation(page) {
  await page.evaluate(() => {
    const publish = Shopify.analytics?.publish;
    if (publish) Shopify.analytics.publish = (...args) => { const result = publish(...args); sessionStorage.setItem('fixtureGuideEvents', JSON.stringify(window.fixtureEvents)); return result; };
  });
  await page.route(/\/(?:en\/)?collections\/all$/, route => route.fulfill({ status: 200, contentType: 'text/html', body: '<h1>Catálogo de prueba</h1>' }));
}
test.beforeEach(async ({ page }) => {
  // Fonts and any Google endpoint are aborted before outbound traffic. The
  // native publish function is a local recorder; this suite never installs GA.
  await page.route(/google|doubleclick/i, route => route.abort('blockedbyclient'));
});
for (const width of [390, 1440]) for (const language of ['es', 'en']) {
  test(`guide analytics ${width}px ${language}: visible steps, pointer/keyboard clicks and catalogue navigation`, async ({ page }, testInfo) => {
    const errors = [], googleAnalytics = []; page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => { if (/googletagmanager|google-analytics|googleadservices|doubleclick/.test(request.url())) googleAnalytics.push(request.url()); });
    await page.setViewportSize({ width, height: 900 }); await page.goto(`${base}?locale=${language}`); await ready(page);
    await expect.poll(async () => (await events(page)).filter(event => event.name === 'lemoon:size_guide_view').length).toBe(1);
    for (const step of [1, 2, 3]) {
      const link = page.locator(`[data-measurement-guide-step-click="${step}"]`);
      if (step === 2) { await link.focus(); await page.keyboard.press('Enter'); } else await link.click();
      await expect(page).toHaveURL(new RegExp(`${stepId(step)}$`)); await heading(page, step);
      await expect.poll(async () => (await events(page)).filter(event => event.name === 'lemoon:size_guide_step_view' && event.payload.step_number === step).length).toBe(1);
      expect((await events(page)).filter(event => event.name === 'lemoon:size_guide_step_click' && event.payload.step_number === step)).toHaveLength(1);
    }
    await heading(page, 1); await heading(page, 3);
    const recorded = await events(page);
    expect(recorded.filter(event => event.name === 'lemoon:size_guide_view')).toHaveLength(1);
    expect(recorded.filter(event => event.name === 'lemoon:size_guide_step_view')).toHaveLength(3);
    for (const event of recorded) expect(event.payload).toEqual({ guide_type: 'measurements', guide_language: language, ...(event.name.includes('step_') ? { step_number: event.payload.step_number } : {}) });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await navigation(page);
    const catalogue = page.locator('[data-measurement-guide-catalogue] a');
    const destination = `${language === 'en' ? '/en' : ''}/collections/all`;
    await expect(catalogue).toHaveAttribute('href', destination);
    await catalogue.focus(); await page.keyboard.press('Enter'); await expect(page).toHaveURL(new RegExp(`${destination}$`));
    const afterNavigation = await page.evaluate(() => JSON.parse(sessionStorage.getItem('fixtureGuideEvents')));
    expect(afterNavigation.filter(event => event.name === 'lemoon:size_guide_catalog_click')).toEqual([{ name: 'lemoon:size_guide_catalog_click', payload: { guide_type: 'measurements', guide_language: language, link_destination: 'catalogue' } }]);
    await testInfo.attach('published-events.json', { body: JSON.stringify(afterNavigation, null, 2), contentType: 'application/json' });
    expect(googleAnalytics).toEqual([]); expect(errors).toEqual([]);
  });
}
test('guide analytics: denied interactions are discarded; grant observes current headings only and revocation stops events', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto(`${base}?consent=denied`); await ready(page);
  await page.locator('[data-measurement-guide-step-click="1"]').click(); await heading(page, 1);
  await heading(page, 3); expect(await events(page)).toEqual([]);
  await privacy(page, true);
  await expect.poll(async () => (await events(page)).map(event => [event.name, event.payload.step_number])).toEqual([['lemoon:size_guide_view', undefined], ['lemoon:size_guide_step_view', 3]]);
  await privacy(page, false); await page.locator('[data-measurement-guide-step-click="2"]').click(); await heading(page, 2);
  expect(await events(page)).toHaveLength(2);
  await privacy(page, true); await expect.poll(async () => (await events(page)).filter(event => event.name === 'lemoon:size_guide_step_view' && event.payload.step_number === 2).length).toBe(1);
  expect((await events(page)).filter(event => event.name === 'lemoon:size_guide_step_click')).toEqual([]);
});
test('guide analytics: deep anchor entry records the guide and current step once without synthetic clicks', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto(`${base}${stepId(3)}`); await ready(page); await heading(page, 3);
  await expect.poll(async () => (await events(page)).filter(event => event.name === 'lemoon:size_guide_step_view' && event.payload.step_number === 3).length).toBe(1);
  const recorded = await events(page);
  expect(recorded.filter(event => event.name === 'lemoon:size_guide_view')).toHaveLength(1);
  expect(recorded.filter(event => event.name === 'lemoon:size_guide_step_click')).toHaveLength(0);
  // Native smooth anchor scrolling may expose earlier headings on the way.
  const steps = recorded.filter(event => event.name === 'lemoon:size_guide_step_view').map(event => event.payload.step_number);
  for (const step of steps) expect([1, 2, 3]).toContain(step);
  expect(new Set(steps).size).toBe(steps.length);
});
for (const consent of ['privacy-missing', 'privacy-throw', 'sdk-missing']) test(`guide analytics: ${consent} fails closed and keeps anchor navigation`, async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${base}?consent=${consent}`); await ready(page);
  const link = page.locator('[data-measurement-guide-step-click="2"]'); await link.focus(); await page.keyboard.press('Enter');
  await expect(page).toHaveURL(new RegExp(`${stepId(2)}$`)); await heading(page, 2);
  expect(await events(page)).toEqual([]); expect(errors).toEqual([]);
});
for (const scenario of ['kind=face', 'editor=1']) test(`guide analytics: ${scenario} never loads the publisher`, async ({ page }) => {
  await page.goto(`${base}?${scenario}`);
  await expect(page.locator('script[src*="lemoon-measurement-guide-analytics.js"]')).toHaveCount(0);
  const link = page.locator('.lemoon-guide__nav a').first(); await link.focus(); await page.keyboard.press('Enter');
  await expect(page).toHaveURL(new RegExp(`${stepId(1)}$`)); expect(await events(page)).toEqual([]);
});
