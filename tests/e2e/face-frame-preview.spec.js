import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const familyNames = ['Ovalado', 'Redondo', 'Cuadrado', 'Corazón', 'Diamante', 'Alargado'];
const familyKinds = ['oval', 'round', 'square', 'heart', 'diamond', 'long'];
const nativePairs = JSON.parse(readFileSync('tests/fixtures/face-guide-catalogue-links.json')).map(entry => entry.shapes);
const shapeLabels = { rectangular: 'Rectangulares', redondo: 'Redondos', 'geométrico': 'Geométricos', ovalado: 'Ovalados', aviador: 'Aviador', 'ojo de gato': 'Ojo de gato' };
const faceGuideShapes = ['rectangular', 'redondo', 'geométrico', 'ovalado', 'aviador', 'ojo de gato'];

// Actual Liquid/snippets and browser behavior with deterministic Shopify-owned Drops.
// The catalogue destination is acknowledged locally; this is not live Shopify QA.
const route = '/tests/fixtures/face-guide.html';
const param = 'filter.p.m.custom.frame_shape';
const oval = page => page.getByRole('article', { name: /^(Ovalado|Oval)$/, exact: true });
const exit = page => oval(page).getByRole('link', { name: 'Ver armazones', exact: true });
const choice = (page, value) => oval(page).locator(`[data-face-frame-value="${value}"]`);
const selectedShapes = async page => new URL(await exit(page).getAttribute('href'), page.url()).searchParams.getAll(param);
async function ready(page, destination = route) {
  await page.goto(destination);
  await oval(page).scrollIntoViewIfNeeded();
  await expect(oval(page).locator('[data-face-frame-picker]')).toBeVisible();
}
async function renderScenario(page, options) {
  // Playwright's CJS test transpiler cannot load this import.meta-based MJS helper.
  // Use Node's native ESM loader, with options passed as an argument (never shell code).
  const body = execFileSync(process.execPath, ['--input-type=module', '-e', `
    import { faceGuideSection, renderFaceGuide } from './tests/helpers/face-guide-renderer.mjs';
    import { renderComponentFixture } from './tests/helpers/component-library-renderer.mjs';
    const options = JSON.parse(process.argv[1]);
    if (options.ovalSettings) {
      const section = faceGuideSection();
      Object.assign(section.blocks[0].settings, options.ovalSettings);
      options.section = section;
      delete options.ovalSettings;
    }
    const shell = renderComponentFixture('controls', { themeBoxSizing: true });
    process.stdout.write(shell.replace(/<body>[\\s\\S]*<\\/body>/, '<body><main>' + renderFaceGuide(options) + '</main></body>'));
  `, JSON.stringify(options)], { encoding: 'utf8' });
  await page.route(`**${route}`, request => request.fulfill({ contentType: 'text/html; charset=utf-8', body }));
}

for (const width of [390, 1440]) {
  test(`oval retains suggestions while toggling alternatives and navigates at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await ready(page);
    const article = oval(page), overlay = article.locator('[data-face-frame-overlay]');
    await expect(page.locator('[data-face-frame-preview]')).toHaveCount(6);
    await expect(article.locator('[data-face-frame-fallback]')).toBeHidden();
    await expect(article.locator('[data-face-frame-value]')).toHaveCount(6);
    await expect(article.locator('[data-face-frame-value][aria-pressed="true"]')).toHaveCount(2);
    expect(await selectedShapes(page)).toEqual(nativePairs[0]);
    let selected = [...nativePairs[0]];
    const toggleShape = async value => {
      const wasSelected = selected.includes(value);
      if (!nativePairs[0].includes(value)) selected = wasSelected ? selected.filter(item => item !== value) : [...selected, value];
      await choice(page, value).click();
      for (const shape of faceGuideShapes) {
        await expect(choice(page, shape)).toHaveAttribute('aria-pressed', String(selected.includes(shape)));
        await expect(choice(page, shape)).toHaveCSS('border-top-color', selected.includes(shape) ? 'rgb(11, 31, 58)' : 'rgba(0, 0, 0, 0)');
      }
      expect(await selectedShapes(page)).toEqual(selected);
      const preview = await overlay.getAttribute('data-face-frame-shape');
      expect(selected).toContain(preview);
      if (!wasSelected || nativePairs[0].includes(value)) expect(preview).toBe(value);
      expect(await overlay.locator('svg').innerHTML()).toBe(await choice(page, preview).locator('svg').innerHTML());
    };
    // Suggested choices preview on every click, retaining both catalogue filters.
    for (const shape of ['redondo', 'rectangular', 'rectangular', 'redondo']) await toggleShape(shape);
    expect(await selectedShapes(page)).toEqual(nativePairs[0]);
    for (const value of faceGuideShapes.filter(value => !nativePairs[0].includes(value))) await toggleShape(value);
    await expect(article.locator('[data-face-frame-value][aria-pressed="true"]')).toHaveCount(6);
    await toggleShape('ovalado');
    await expect(choice(page, 'ovalado')).toHaveAttribute('aria-pressed', 'false');
    await toggleShape('ovalado');
    for (const shape of nativePairs[0]) await expect(choice(page, shape).locator('.lemoon-face-guide__choice-tag')).toHaveCSS('background-color', 'rgb(247, 230, 0)');
    await page.setViewportSize({ width: width === 390 ? 430 : 1280, height: 900 });
    expect(await selectedShapes(page)).toEqual(selected);
    await page.setViewportSize({ width, height: 900 });
    await article.getByRole('button', { name: 'Ver sin armazón', exact: true }).click();
    await expect(overlay).toBeHidden();
    expect(await selectedShapes(page)).toEqual(selected);
    await article.getByRole('button', { name: 'Ver con armazón', exact: true }).click();
    await expect(overlay).toBeVisible();
    await expect(exit(page)).toHaveCSS('background-color', 'rgb(11, 31, 58)');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await article.screenshot({ path: testInfo.outputPath(`oval-multi-${width}.png`) });
    await page.route('**/collections/all?*', request => request.fulfill({ contentType: 'text/html; charset=utf-8', body: '<!doctype html><html lang="es"><meta charset="utf-8"><h1>Catálogo local</h1></html>' }));
    await exit(page).click();
    await expect(page.getByRole('heading', { name: 'Catálogo local' })).toBeVisible();
    expect(new URL(page.url()).searchParams.getAll(param)).toEqual(selected);
    expect(errors).toEqual([]);
  });
}

test('carousel arrows expose additional choices, keyboard selection retains focus, and fragment navigation has no article halo', async ({ page, browserName }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await ready(page);
  const article = oval(page);
  const carousel = article.locator('[data-face-frame-carousel]');
  const previous = article.getByRole('button', { name: 'Formas anteriores' });
  const next = article.getByRole('button', { name: 'Más formas' });
  await expect(previous).toBeDisabled();
  await expect(next).toBeEnabled();
  await next.click();
  await expect.poll(() => carousel.evaluate(node => node.scrollLeft)).toBeGreaterThan(0);
  await expect(previous).toBeEnabled();
  await previous.click();
  await expect.poll(() => carousel.evaluate(node => node.scrollLeft)).toBe(0);
  for (const arrow of [previous, next]) {
    await expect(arrow).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await arrow.hover();
    await expect(arrow).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  }
  const padding = await carousel.evaluate(node => parseFloat(getComputedStyle(node).paddingLeft));
  const initialGap = await carousel.evaluate(node => node.firstElementChild.getBoundingClientRect().left - node.getBoundingClientRect().left);
  expect(initialGap).toBeCloseTo(padding, 0);
  let steps = 0;
  while (await carousel.evaluate(node => node.scrollLeft < node.scrollWidth - node.clientWidth - 2)) {
    const before = await carousel.evaluate(node => node.scrollLeft);
    await next.click();
    await expect.poll(() => carousel.evaluate(node => node.scrollLeft)).toBeGreaterThan(before);
    expect(++steps).toBeLessThanOrEqual(6);
  }
  await expect(next).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  const end = await carousel.evaluate(node => ({ gap: node.getBoundingClientRect().right - node.lastElementChild.getBoundingClientRect().right, max: node.scrollWidth - node.clientWidth, scroll: node.scrollLeft }));
  expect(end.scroll).toBeCloseTo(end.max, 0);
  expect(end.gap).toBeCloseTo(padding, 0);
  for (let step = 0; step < 6 && await carousel.evaluate(node => node.scrollLeft > 2); step++) {
    const before = await carousel.evaluate(node => node.scrollLeft);
    await previous.click();
    await expect.poll(() => carousel.evaluate(node => node.scrollLeft)).toBeLessThan(before);
  }
  await expect.poll(() => carousel.evaluate(node => node.scrollLeft)).toBe(0);
  await choice(page, 'rectangular').focus();
  await page.keyboard.press(browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab');
  await expect(choice(page, 'redondo')).toBeFocused();
  await expect(choice(page, 'redondo')).toHaveCSS('outline-style', 'solid');
  await expect(choice(page, 'redondo')).toHaveCSS('outline-width', '2px');
  await page.keyboard.press('Enter');
  await expect(choice(page, 'redondo')).toHaveAttribute('aria-pressed', 'true');
  await expect(article.locator('[data-face-frame-overlay]')).toHaveAttribute('data-face-frame-shape', 'redondo');
  expect(await selectedShapes(page)).toEqual(nativePairs[0]);
  await expect(choice(page, 'redondo')).toBeFocused();
  const index = page.getByRole('navigation').getByRole('link', { name: 'Ovalado', exact: true });
  await index.click();
  await expect(page).toHaveURL(/#FaceFamily-face-fixture-oval$/);
  await expect(article).toHaveCSS('box-shadow', 'none');
  await expect(article).toHaveCSS('outline-width', '0px');
});

test('without JavaScript the suggested native links remain usable and preview controls stay hidden', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
  try {
    const page = await context.newPage();
    await page.goto(new URL(route, baseURL).href);
    for (const [index, name] of familyNames.entries()) {
      const article = page.getByRole('article', { name, exact: true });
      await expect(article.locator('[data-face-frame-picker]')).toBeHidden();
      await expect(article.locator('[data-face-frame-toggle]')).toBeHidden();
      await expect(article.locator('[data-face-frame-overlay]')).toBeHidden();
      await expect(article.locator('[data-face-frame-fallback]')).toBeVisible();
      for (const shape of nativePairs[index]) await expect(article.getByRole('link', { name: shapeLabels[shape], exact: true })).toBeVisible();
      const href = await article.getByRole('link', { name: 'Ver armazones', exact: true }).getAttribute('href');
      expect(new URL(href, page.url()).searchParams.getAll(param)).toEqual(nativePairs[index]);
    }
  } finally { await context.close(); }
});

test('missing filter has no interactive options and keeps the truthful full-catalogue fallback', async ({ page }) => {
  await page.goto(`${route}?scenario=missing-filter`);
  const article = oval(page);
  await expect(article.locator('[data-face-frame-picker]')).toBeHidden();
  await expect(article.locator('[data-face-frame-toggle]')).toBeHidden();
  await expect(article.getByRole('link', { name: 'Ver catálogo', exact: true })).toHaveAttribute('href', '/collections/all');
  await expect(article.getByText('Puedes explorar el catálogo completo', { exact: false })).toBeVisible();
});

test('a missing suggested value can be illustrated without claiming a partial native selection', async ({ page }) => {
  await renderScenario(page, { shapes: faceGuideShapes.filter(value => value !== 'rectangular') });
  await ready(page);
  await choice(page, 'ovalado').click();
  await expect(oval(page).getByRole('link', { name: 'Ver catálogo', exact: true })).toHaveAttribute('href', '/collections/all');
  await expect(oval(page).getByText('Puedes explorar el catálogo completo', { exact: false })).toBeVisible();
});

test('merchant image replacement preserves the native pair instead of placing inaccurately aligned frames on it', async ({ page }) => {
  await page.goto(`${route}?scenario=merchant`);
  const article = page.getByRole('article').first();
  await expect(article.locator('[data-face-frame-overlay]')).toHaveCount(0);
  await expect(article.locator('[data-face-frame-picker]')).toHaveCount(0);
  await expect(article.getByRole('link', { name: 'Rectangulares', exact: true })).toBeVisible();
  await expect(article.locator('img')).toHaveAttribute('src', /lemoon-category-opticos-generic-v1\.jpg/);
  await expect(page.locator('[data-face-frame-preview]')).toHaveCount(5);
  for (const name of familyNames.slice(1)) {
    const other = page.getByRole('article', { name, exact: true });
    await other.scrollIntoViewIfNeeded();
    await expect(other.locator('[data-face-frame-picker]')).toBeVisible();
    await expect(other.locator('[data-face-frame-overlay]')).toBeVisible();
  }
});

test('custom merchant exit and localized native routes retain their contracts after an alternative preview', async ({ page }) => {
  await ready(page, `${route}?scenario=localized`);
  await choice(page, 'ojo de gato').click();
  const localized = oval(page).getByRole('link', { name: 'View frames', exact: true });
  const url = new URL(await localized.getAttribute('href'), page.url());
  expect(url.pathname).toBe('/en/collections/all');
  expect(url.searchParams.getAll(param)).toEqual(['rectangular', 'redondo', 'ojo de gato']);
  await renderScenario(page, { ovalSettings: { destination: '/collections/opticos?sort_by=title-ascending' } });
  await ready(page);
  const custom = oval(page).locator('.lemoon-face-guide__cta');
  const before = await custom.getAttribute('href');
  await expect(oval(page).locator('[data-face-frame-value][aria-pressed="true"]')).toHaveCount(2);
  for (const shape of nativePairs[0]) await expect(choice(page, shape)).toHaveAttribute('aria-pressed', 'true');
  await choice(page, 'redondo').click();
  await choice(page, 'rectangular').click();
  await expect(oval(page).locator('[data-face-frame-value][aria-pressed="true"]')).toHaveCount(2);
  for (const shape of nativePairs[0]) await expect(choice(page, shape)).toHaveAttribute('aria-pressed', 'true');
  await choice(page, 'aviador').click();
  await expect(custom).toHaveAttribute('href', before);
  expect(new URL(before, page.url()).searchParams.has(param)).toBe(false);
});

test('failed portrait restores the native pair rather than leaving a floating frame overlay', async ({ page }) => {
  await ready(page);
  await choice(page, 'ovalado').click();
  await oval(page).locator('.lemoon-face-guide__portrait img').evaluate(img => img.dispatchEvent(new Event('error')));
  await expect(oval(page).locator('[data-face-frame-picker]')).toBeHidden();
  await expect(oval(page).locator('[data-face-frame-overlay]')).toBeHidden();
  await expect(oval(page).locator('[data-face-frame-toggle]')).toBeHidden();
  await expect(oval(page).locator('[data-face-frame-fallback]')).toBeVisible();
  expect(await selectedShapes(page)).toEqual(['rectangular', 'redondo']);
});

test('the native catalogue exit publishes the three controlled shapes only with effective analytics consent', async ({ page }) => {
  const events = [];
  await page.exposeFunction('recordFacePreviewClick', (name, data) => events.push({ name, data }));
  await page.addInitScript(() => {
    window.facePreviewAnalyticsAllowed = true;
    window.Shopify = {
      customerPrivacy: { analyticsProcessingAllowed: () => window.facePreviewAnalyticsAllowed },
      analytics: { publish: (name, data) => window.recordFacePreviewClick(name, data) },
    };
  });
  await page.route('**/collections/all?*', request => request.fulfill({ contentType: 'text/html; charset=utf-8', body: '<!doctype html><html lang="es"><meta charset="utf-8"><title>Destino local</title><h1>Catálogo local</h1></html>' }));
  await ready(page);
  await choice(page, 'ojo de gato').click();
  await exit(page).click();
  await expect.poll(() => events.filter(({ data }) => data.action === 'family_catalogue').length).toBe(1);
  expect(events.find(({ data }) => data.action === 'family_catalogue')).toEqual({
    name: 'lemoon:face_guide_click',
    data: { guide_id: 'face_shape', action: 'family_catalogue', link_position: 'family', destination: 'filtered_catalogue', face_family: 'oval', selected_shapes: ['rectangular', 'round', 'cat-eye'] },
  });
  await ready(page);
  await page.evaluate(() => { window.facePreviewAnalyticsAllowed = false; });
  const before = events.length;
  await choice(page, 'aviador').click();
  await exit(page).click();
  await expect(page.getByRole('heading', { name: 'Catálogo local' })).toBeVisible();
  expect(events).toHaveLength(before);
});

for (const count of [2, 6]) test(`catalogue analytics sends exactly ${count} selected shapes`, async ({ page }) => {
  const events = [];
  await page.exposeFunction('recordSelection', (name, data) => events.push({ name, data }));
  await page.addInitScript(() => { window.Shopify = { customerPrivacy: { analyticsProcessingAllowed: () => true }, analytics: { publish: (name, data) => window.recordSelection(name, data) } }; });
  await ready(page);
  let selected;
  if (count === 2) { await choice(page, 'rectangular').click(); selected = ['rectangular', 'round']; }
  else {
    for (const shape of faceGuideShapes.filter(shape => !nativePairs[0].includes(shape))) await choice(page, shape).click();
    selected = ['rectangular', 'round', 'geometric', 'oval', 'aviator', 'cat-eye'];
  }
  await page.route('**/collections/all?*', request => request.fulfill({ contentType: 'text/html; charset=utf-8', body: '<!doctype html><h1>Catálogo local</h1>' }));
  await exit(page).click();
  await expect.poll(() => events.filter(event => event.data.action === 'family_catalogue').length).toBe(1);
  expect(events.find(event => event.data.action === 'family_catalogue').data.selected_shapes).toEqual(selected);
});

for (const width of [390, 1440]) {
  for (const [familyIndex, name] of familyNames.entries()) {
    test(`${name} independently selects all six shapes with exact native exit at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      const articles = familyNames.map(familyName => page.getByRole('article', { name: familyName, exact: true }));
      for (const article of articles) { await article.scrollIntoViewIfNeeded(); await expect(article.locator('[data-face-frame-picker]')).toBeVisible(); }
      const article = articles[familyIndex], pair = nativePairs[familyIndex];
      const buttonFor = value => article.locator(`[data-face-frame-value="${value}"]`);
      const overlay = article.locator('[data-face-frame-overlay]'), cta = article.getByRole('link', { name: 'Ver armazones', exact: true });
      await expect(article.locator('[data-face-frame-value][aria-pressed="true"]')).toHaveCount(2);
      for (const value of pair) await expect(buttonFor(value)).toHaveAttribute('aria-pressed', 'true');
      let selected = [...pair];
      for (const value of faceGuideShapes.filter(value => !pair.includes(value))) {
        await buttonFor(value).click(); selected.push(value);
        await expect(buttonFor(value)).toHaveAttribute('aria-pressed', 'true');
        await expect(overlay).toHaveAttribute('data-face-frame-shape', value);
        expect(await overlay.locator('svg').innerHTML()).toBe(await buttonFor(value).locator('svg').innerHTML());
        expect(new URL(await cta.getAttribute('href'), page.url()).searchParams.getAll(param)).toEqual(selected);
        for (const [otherIndex, other] of articles.entries()) if (otherIndex !== familyIndex) {
          await expect(other.locator('[data-face-frame-value][aria-pressed="true"]')).toHaveCount(2);
          expect(new URL(await other.locator('.lemoon-face-guide__cta').getAttribute('href'), page.url()).searchParams.getAll(param)).toEqual(nativePairs[otherIndex]);
        }
      }
      await expect(article.locator('[data-face-frame-value][aria-pressed="true"]')).toHaveCount(6);
      // Re-select each shape to make it the latest preview while preserving all six.
      const preview = async value => { await buttonFor(value).click(); await buttonFor(value).click(); await expect(overlay).toHaveAttribute('data-face-frame-shape', value); };
      const geometry = () => overlay.evaluate(node => { const box = node.getBoundingClientRect(), portrait = node.parentElement.getBoundingClientRect(); return { width: box.width, x: (box.x + box.width / 2 - portrait.x) / portrait.width, y: (box.y + box.height / 2 - portrait.y) / portrait.height }; });
      await preview('rectangular'); const regular = await geometry();
      await preview('aviador'); const aviator = await geometry();
      expect(aviator.width / regular.width).toBeCloseTo(.9, 2);
      expect(Math.abs(aviator.x - .5)).toBeLessThan(.002);
      expect(aviator.y - regular.y).toBeGreaterThan(.005);
      expect(aviator.y - regular.y).toBeLessThan(.03);
      await article.screenshot({ path: testInfo.outputPath(`${familyKinds[familyIndex]}-aviator-${width}.png`) });
      await preview('redondo'); const round = await geometry();
      expect(Math.abs(round.y - regular.y)).toBeLessThan(.002);
      // Alternatives toggle off; suggested choices remain selected and always preview.
      for (const value of faceGuideShapes.filter(value => !pair.includes(value))) await buttonFor(value).click();
      for (const value of [...pair, ...pair]) {
        await buttonFor(value).click();
        await expect(buttonFor(value)).toHaveAttribute('aria-pressed', 'true');
        await expect(overlay).toHaveAttribute('data-face-frame-shape', value);
        expect(await overlay.locator('svg').innerHTML()).toBe(await buttonFor(value).locator('svg').innerHTML());
        await expect(article.locator('[data-face-frame-value][aria-pressed="true"]')).toHaveCount(2);
        expect(new URL(await cta.getAttribute('href'), page.url()).searchParams.getAll(param)).toEqual(pair);
      }
      expect(new URL(await cta.getAttribute('href'), page.url()).searchParams.getAll(param)).toEqual(pair);
      await page.route('**/collections/all?*', request => request.fulfill({ contentType: 'text/html; charset=utf-8', body: '<!doctype html><html lang="es"><meta charset="utf-8"><h1>Catálogo local</h1></html>' }));
      await cta.click();
      await expect(page.getByRole('heading', { name: 'Catálogo local' })).toBeVisible();
      expect(new URL(page.url()).searchParams.getAll(param)).toEqual(pair);
    });
  }
}
