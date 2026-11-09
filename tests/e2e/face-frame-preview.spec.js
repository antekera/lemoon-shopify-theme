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
  test(`oval previews suggested and alternative shapes, retains only the current extra filter and navigates at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await ready(page);
    const article = oval(page);
    await expect(page.locator('[data-face-frame-preview]')).toHaveCount(6);
    await expect(article.locator('[data-face-frame-fallback]')).toBeHidden();
    await expect(article.locator('[data-face-frame-value]')).toHaveCount(6);
    expect(await article.locator('[data-face-frame-value]').evaluateAll(nodes => nodes.map(node => node.dataset.faceFrameValue))).toEqual(faceGuideShapes);
    await expect(choice(page, 'rectangular')).toHaveAttribute('aria-pressed', 'true');
    expect(await selectedShapes(page)).toEqual(['rectangular', 'redondo']);
    const assertChoicePresentation = async selected => {
      for (const suggested of ['rectangular', 'redondo']) {
        await expect(choice(page, suggested).locator('.lemoon-face-guide__choice-tag')).toHaveCSS('background-color', 'rgb(247, 230, 0)');
      }
      for (const value of faceGuideShapes) {
        const item = choice(page, value);
        await expect(item).toHaveCSS('border-top-color', value === selected ? 'rgb(11, 31, 58)' : 'rgba(0, 0, 0, 0)');
        if (value !== 'rectangular' && value !== 'redondo') {
          await expect(item.locator('.lemoon-face-guide__choice-tag')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
        }
      }
    };
    await assertChoicePresentation('rectangular');
    const overlay = article.locator('[data-face-frame-overlay]');
    await expect(overlay).toBeVisible();
    const toggle = article.getByRole('button', { name: 'Ver sin armazón', exact: true });
    expect(await toggle.getAttribute('aria-controls')).toBe(await overlay.getAttribute('id'));
    await expect(toggle).not.toHaveAttribute('aria-pressed');
    for (const value of faceGuideShapes) {
      const button = choice(page, value);
      await button.click();
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      await expect(article.locator('[data-face-frame-value][aria-pressed="true"]')).toHaveCount(1);
      await assertChoicePresentation(value);
      const selectedSVG = await button.locator('svg').innerHTML();
      expect(await overlay.locator('svg').innerHTML()).toBe(selectedSVG);
      await expect(article.getByRole('status')).toContainText(await button.getAttribute('data-face-frame-label'));
      expect(await selectedShapes(page)).toEqual(value === 'rectangular' || value === 'redondo' ? ['rectangular', 'redondo'] : ['rectangular', 'redondo', value]);
    }
    await page.setViewportSize({ width: width === 390 ? 430 : 1280, height: 900 });
    await expect(choice(page, 'ojo de gato')).toHaveAttribute('aria-pressed', 'true');
    expect(await selectedShapes(page)).toEqual(['rectangular', 'redondo', 'ojo de gato']);
    await page.setViewportSize({ width, height: 900 });
    // A toggle only removes the illustrative overlay; it preserves the chosen exit.
    const shapesBeforeToggle = await selectedShapes(page);
    await article.getByRole('button', { name: 'Ver sin armazón', exact: true }).click();
    await expect(overlay).toBeHidden();
    expect(await selectedShapes(page)).toEqual(shapesBeforeToggle);
    await article.getByRole('button', { name: 'Ver con armazón', exact: true }).click();
    await expect(overlay).toBeVisible();
    await choice(page, 'redondo').click();
    expect(await selectedShapes(page)).toEqual(['rectangular', 'redondo']);
    await choice(page, 'ojo de gato').click();
    const computed = await overlay.evaluate(node => {
      const rect = node.getBoundingClientRect();
      const portrait = node.parentElement.getBoundingClientRect();
      return { x: rect.x >= portrait.x, y: rect.y >= portrait.y, right: rect.right <= portrait.right, bottom: rect.bottom <= portrait.bottom, centerOffset: Math.abs(rect.x + rect.width / 2 - portrait.x - portrait.width / 2) };
    });
    expect(computed).toMatchObject({ x: true, y: true, right: true, bottom: true });
    // Bounding-box centering is a layout check, not proof of alignment with the drawn eyes.
    expect(computed.centerOffset).toBeLessThan(0.75);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await article.screenshot({ path: testInfo.outputPath(`oval-alternative-${width}.png`) });
    await page.route('**/collections/all?*', request => request.fulfill({ contentType: 'text/html; charset=utf-8', body: '<!doctype html><html lang="es"><meta charset="utf-8"><title>Destino local</title><h1>Catálogo local</h1></html>' }));
    await exit(page).click();
    await expect(page.getByRole('heading', { name: 'Catálogo local' })).toBeVisible();
    expect(new URL(page.url()).searchParams.getAll(param)).toEqual(['rectangular', 'redondo', 'ojo de gato']);
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
  await choice(page, 'rectangular').focus();
  await page.keyboard.press(browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab');
  await expect(choice(page, 'redondo')).toBeFocused();
  await expect(choice(page, 'redondo')).toHaveCSS('outline-style', 'solid');
  await expect(choice(page, 'redondo')).toHaveCSS('outline-width', '2px');
  await page.keyboard.press('Enter');
  await expect(choice(page, 'redondo')).toHaveAttribute('aria-pressed', 'true');
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

for (const width of [390, 1440]) {
  for (const [familyIndex, name] of familyNames.entries()) {
    test(`${name} independently previews all six shapes and its native exit at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      const articles = familyNames.map(familyName => page.getByRole('article', { name: familyName, exact: true }));
      // Load every lazy portrait so selection isolation is checked against six active controls.
      for (const article of articles) {
        await article.scrollIntoViewIfNeeded();
        await expect(article.locator('[data-face-frame-picker]')).toBeVisible();
      }
      const article = articles[familyIndex];
      const pair = nativePairs[familyIndex];
      const buttons = article.locator('[data-face-frame-value]');
      const buttonFor = value => article.locator(`[data-face-frame-value="${value}"]`);
      const overlay = article.locator('[data-face-frame-overlay]');
      const cta = article.getByRole('link', { name: 'Ver armazones', exact: true });
      expect(await buttons.evaluateAll(nodes => nodes.map(node => node.dataset.faceFrameValue))).toEqual([...pair, ...faceGuideShapes.filter(value => !pair.includes(value))]);
      await expect(buttonFor(pair[0])).toHaveAttribute('aria-pressed', 'true');
      for (const value of faceGuideShapes) {
        const button = buttonFor(value);
        await expect(button.locator('.lemoon-face-guide__choice-tag')).toHaveText(pair.includes(value) ? 'Sugerida' : 'Otra forma');
        await expect(button).toContainText(shapeLabels[value]);
        await button.click();
        await expect(button).toHaveAttribute('aria-pressed', 'true');
        await expect(article.locator('[data-face-frame-value][aria-pressed="true"]')).toHaveCount(1);
        await expect(overlay).toBeVisible();
        expect(await overlay.locator('svg').innerHTML()).toBe(await button.locator('svg').innerHTML());
        const destination = new URL(await cta.getAttribute('href'), page.url());
        expect(destination.pathname).toBe('/collections/all');
        expect(destination.searchParams.getAll(param)).toEqual(pair.includes(value) ? pair : [...pair, value]);
        for (const suggested of pair) await expect(buttonFor(suggested).locator('.lemoon-face-guide__choice-tag')).toHaveCSS('background-color', 'rgb(247, 230, 0)');
        for (const [otherIndex, other] of articles.entries()) {
          if (otherIndex === familyIndex) continue;
          await expect(other.locator(`[data-face-frame-value="${nativePairs[otherIndex][0]}"]`)).toHaveAttribute('aria-pressed', 'true');
          const untouched = new URL(await other.locator('.lemoon-face-guide__cta').getAttribute('href'), page.url());
          expect(untouched.searchParams.getAll(param)).toEqual(nativePairs[otherIndex]);
        }
      }
      const relativeCenter = () => overlay.evaluate(node => {
        const frame = node.getBoundingClientRect();
        const portrait = node.parentElement.getBoundingClientRect();
        return { x: (frame.x + frame.width / 2 - portrait.x) / portrait.width, y: (frame.y + frame.height / 2 - portrait.y) / portrait.height };
      });
      await buttonFor('rectangular').click();
      const regular = await relativeCenter();
      await buttonFor('aviador').click();
      const aviator = await relativeCenter();
      expect(Math.abs(aviator.x - .5)).toBeLessThan(.002);
      expect(aviator.y - regular.y).toBeGreaterThan(.005);
      expect(aviator.y - regular.y).toBeLessThan(.03);
      await buttonFor('redondo').click();
      const round = await relativeCenter();
      expect(Math.abs(round.y - regular.y)).toBeLessThan(.002);
      const alternative = faceGuideShapes.find(value => !pair.includes(value));
      await buttonFor(alternative).click();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await article.screenshot({ path: testInfo.outputPath(`${familyKinds[familyIndex]}-selected-${width}.png`) });
      await page.route('**/collections/all?*', request => request.fulfill({ contentType: 'text/html; charset=utf-8', body: '<!doctype html><html lang="es"><meta charset="utf-8"><h1>Catálogo local</h1></html>' }));
      await cta.click();
      await expect(page.getByRole('heading', { name: 'Catálogo local' })).toBeVisible();
      expect(new URL(page.url()).searchParams.getAll(param)).toEqual([...pair, alternative]);
    });
  }
}
