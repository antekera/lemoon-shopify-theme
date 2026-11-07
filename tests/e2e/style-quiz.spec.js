import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

// Render this checkout's real Liquid source and assets even when reusing another
// checkout's fixture server. This is not Shopify/filter-index matching evidence.
const root = process.cwd();
const route = '/tests/fixtures/style-quiz.html';
const rendered = () => execFileSync(process.execPath, ['tests/helpers/style-quiz-fixture-build.mjs'], { cwd: root, encoding: 'utf8' });
async function install(page, transform = html => html) {
  await page.route('**/tests/fixtures/style-quiz.html*', request => request.fulfill({ contentType: 'text/html', headers: { 'Cache-Control': 'no-store' }, body: transform(rendered()) }));
  await page.route('**/assets/lemoon-style-quiz*', request => {
    const file = new URL(request.request().url()).pathname.slice(1);
    return request.fulfill({ contentType: file.endsWith('.css') ? 'text/css' : 'text/javascript', body: readFileSync(path.join(root, file)) });
  });
  await page.route('**/collections/all*', request => request.fulfill({ contentType: 'text/html', headers: { 'Cache-Control': 'no-store' }, body: '<!doctype html><h1>Colección de prueba</h1><p>Fixture de destino; no representa filtros de Shopify.</p>' }));
}
async function open(page, transform) {
  await install(page, transform); await page.goto(route);
  const quiz = page.locator('[data-style-quiz]');
  await expect(quiz.locator('[data-quiz-start]')).toBeEnabled();
  await expect(quiz).not.toContainText(/Liquid (?:syntax )?error/);
  return quiz;
}
const current = (quiz, stage) => quiz.locator(`[data-step="${stage}"]`);
async function at(quiz, stage) { await expect(current(quiz, stage)).toBeVisible(); await expect(current(quiz, stage).locator('[data-quiz-question]')).toBeFocused(); }
async function start(quiz) { await quiz.locator('[data-quiz-start]').click(); await at(quiz, 'category'); }
async function next(quiz, count = 1) { for (let index = 0; index < count; index++) await quiz.locator('[data-quiz-next]').click(); }
const selected = quiz => quiz.locator('input:checked').evaluateAll(nodes => nodes.map(node => `${node.name}:${node.value}`));
const configTransform = mutate => html => html.replace(/(<script type="application\/json" data-quiz-filter-config>)([\s\S]*?)(<\/script>)/, (_, before, json, after) => { const config = JSON.parse(json); mutate(config); return before + JSON.stringify(config) + after; });

for (const width of [390, 749, 750, 989, 990, 1440]) {
  test.describe(`approved quiz at ${width}px`, () => {
    test.use({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    test('shows vertical finishes and materials, readable text, keyboard choices and no overflow', async ({ page }, testInfo) => {
      const quiz = await open(page); await start(quiz); await next(quiz, 3); await at(quiz, 'details');
      const details = current(quiz, 'details');
      await expect(details.getByRole('heading', { name: 'Acabados', exact: true })).toBeVisible();
      await expect(details.getByRole('heading', { name: 'Materiales', exact: true })).toBeVisible();
      await expect(details.locator('[data-quiz-tab], [data-quiz-panel]')).toHaveCount(0);
      const finishBox = await details.locator('.lemoon-quiz__detail-group').nth(0).boundingBox();
      const materialBox = await details.locator('.lemoon-quiz__detail-group').nth(1).boundingBox();
      expect(materialBox.y).toBeGreaterThanOrEqual(finishBox.y + finishBox.height);
      const matte = details.locator('input[value="matte"]'); await matte.focus(); await page.keyboard.press('Space'); await expect(matte).toBeChecked();
      const metal = details.locator('input[value="metal"]'); await metal.focus(); await page.keyboard.press('Space'); await expect(metal).toBeChecked();
      for (const input of await details.locator('input').all()) await expect(input.locator('..')).toBeVisible();
      const textMetrics = await details.locator('[data-quiz-option-label], .lemoon-quiz__question > p:not(.lemoon-quiz__eyebrow)').evaluateAll(nodes => nodes.map(node => ({ text: node.textContent, size: parseFloat(getComputedStyle(node).fontSize), weight: getComputedStyle(node).fontWeight })));
      textMetrics.forEach(metric => { expect(metric.size, metric.text).toBeGreaterThanOrEqual(16); expect(metric.weight, metric.text).toBe('400'); });
      for (const action of await quiz.locator('[data-quiz-next], [data-quiz-back]').all()) { await expect(action).toHaveCSS('font-size', '16px'); await expect(action).toHaveCSS('font-weight', '600'); }
      expect(await details.locator('.lemoon-quiz__hint').evaluate(node => parseFloat(getComputedStyle(node).fontSize))).toBeGreaterThanOrEqual(14);
      await next(quiz, 2); await at(quiz, 'presence'); await quiz.locator('[data-quiz-measures] summary').click();
      for (const field of await quiz.locator('[data-quiz-measure]').all()) { await expect(field).toHaveCSS('font-size', '16px'); await expect(field).toHaveCSS('font-weight', '400'); }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await quiz.screenshot({ path: testInfo.outputPath('readable-presence.png') });
    });
  });
}

test('six stages submit one native collection URL with all criteria and return from a rebuilt document', async ({ page }) => {
  await page.addInitScript(() => { window.__quizDocumentID = crypto.randomUUID(); });
  const quiz = await open(page); const documentID = await page.evaluate(() => window.__quizDocumentID); await start(quiz);
  await quiz.locator('input[name="category"][value="optical"]').check(); await next(quiz);
  for (const value of ['round', 'cat-eye']) await quiz.locator(`input[name="shape"][value="${value}"]`).check(); await next(quiz);
  for (const value of ['neutral', 'silver', 'tortoise', 'transparent']) await current(quiz, 'color').locator(`input[value="${value}"]`).check(); await next(quiz);
  for (const value of ['matte', 'glossy', 'tr90']) await current(quiz, 'details').locator(`input[value="${value}"]`).check(); await next(quiz);
  await quiz.locator('input[name="use"][value="everyday"]').check(); await next(quiz);
  await quiz.locator('input[name="presence"][value="oversize"]').check();
  const before = await selected(quiz);
  await expect(quiz.locator('[data-quiz-product], [data-quiz-results], [data-candidate]')).toHaveCount(0);
  await next(quiz); await expect(page).toHaveURL(/\/collections\/all\?/);
  const query = new URL(page.url()).searchParams;
  expect(query.getAll('filter.p.m.custom.frame_shape')).toEqual(['redondo', 'ojo de gato']);
  expect(query.get('filter.p.m.custom.frame_material')).toBe('TR-90');
  expect(query.getAll('filter.v.m.custom.style_filter_color')).toHaveLength(4);
  expect(query.getAll('filter.v.m.custom.style_filter_finish')).toHaveLength(2);
  for (const group of ['pattern', 'transparency', 'use', 'presence']) expect(query.has(`filter.v.m.custom.style_filter_${group}`)).toBe(true);
  await page.goBack(); await at(page.locator('[data-style-quiz]'), 'presence');
  expect(await page.evaluate(() => window.__quizDocumentID), 'return must rebuild the quiz document rather than reuse bfcache').not.toBe(documentID);
  expect(await selected(page.locator('[data-style-quiz]'))).toEqual(before);
  await page.reload(); await expect(current(page.locator('[data-style-quiz]'), 'presence')).toBeVisible();
  expect(await selected(page.locator('[data-style-quiz]'))).toEqual(before);
  expect(await page.evaluate(() => performance.getEntriesByType('navigation')[0].type)).toBe('reload');
});

test('skipping every answer navigates unrestricted instead of embedding a capped catalogue', async ({ page, baseURL }) => {
  const quiz = await open(page); await start(quiz); await next(quiz, 6);
  await expect(page).toHaveURL(new URL('/collections/all', baseURL).href);
});

test('history restores exact snapshots, replaces input changes, preserves foreign state and truncates a new branch', async ({ page }) => {
  await page.addInitScript(() => { if (!history.state) history.replaceState({ unrelatedFeature: { value: 7 } }, ''); });
  const quiz = await open(page);
  const initialLength = await page.evaluate(() => history.length);
  await start(quiz); await quiz.locator('input[value="optical"]').check();
  expect(await page.evaluate(() => history.length)).toBe(initialLength + 1);
  await next(quiz); await quiz.locator('input[value="round"]').check(); await next(quiz); await quiz.locator('input[value="silver"]').check();
  const originalColor = await page.evaluate(() => history.state.lemoonStyleQuiz);
  await page.goBack(); await at(quiz, 'shape'); await expect(quiz.locator('input[value="round"]')).toBeChecked();
  await quiz.locator('input[value="round"]').uncheck(); await quiz.locator('input[value="cat-eye"]').check();
  await page.goForward(); await at(quiz, 'color');
  expect(await page.evaluate(() => history.state.lemoonStyleQuiz)).toEqual(originalColor);
  await expect(quiz.locator('input[value="round"]')).toBeChecked(); await expect(quiz.locator('input[value="silver"]')).toBeChecked();
  await page.goBack(); await at(quiz, 'shape'); await expect(quiz.locator('input[value="cat-eye"]')).toBeChecked();
  await next(quiz); await at(quiz, 'color'); await expect(quiz.locator('input[value="silver"]')).not.toBeChecked();
  const newURL = page.url(); await page.goForward(); expect(page.url()).toBe(newURL);
  expect(await page.evaluate(() => history.state.unrelatedFeature)).toEqual({ value: 7 });
  await page.reload(); await expect(current(quiz, 'color')).toBeVisible(); await expect(quiz.locator('input[value="cat-eye"]')).toBeChecked();
});

test('UI back uses owned stage entries and intro browser back can leave the quiz', async ({ page }) => {
  await page.goto('/tests/fixtures/mobile-search.html'); const previous = page.url();
  const quiz = await open(page); await start(quiz); await next(quiz); await quiz.locator('[data-quiz-back]').click(); await at(quiz, 'category');
  await quiz.locator('[data-quiz-back]').click(); await expect(quiz.locator('[data-quiz-start]')).toBeFocused();
  await page.goBack(); await expect(page).toHaveURL(previous);
});

test('a directly restored stage has a safe UI back fallback without adding a history entry', async ({ page }) => {
  const quiz = await open(page); await start(quiz); await next(quiz, 3);
  await page.evaluate(() => {
    const state = history.state;
    state.lemoonStyleQuiz.position = 0;
    state.lemoonStyleQuiz.trail = ['details'];
    history.replaceState(state, '');
  });
  await page.reload(); await at(quiz, 'details');
  const length = await page.evaluate(() => history.length);
  await quiz.locator('[data-quiz-back]').click(); await at(quiz, 'color');
  expect(await page.evaluate(() => history.length)).toBe(length);
});

test('preserves primitive foreign history state when creating its namespace', async ({ page }) => {
  await page.addInitScript(() => { if (!history.state) history.replaceState('external-state', ''); });
  const quiz = await open(page);
  expect(await page.evaluate(() => history.state.lemoonStyleQuizForeignState)).toBe('external-state');
  await start(quiz); await next(quiz); await page.goBack(); await at(quiz, 'category');
});

for (const corrupt of ['unknown-code', 'wrong-version', 'wrong-path', 'malformed', 'foreign-only']) {
  test(`safely recovers ${corrupt} history without overwriting unrelated data`, async ({ page }) => {
    const quiz = await open(page); await start(quiz); await next(quiz);
    await page.evaluate(kind => {
      const state = { ...history.state, external: 'preserved' };
      if (kind === 'unknown-code') state.lemoonStyleQuiz.answers.shape = ['not-a-shape'];
      if (kind === 'wrong-version') state.lemoonStyleQuiz.version = 999;
      if (kind === 'wrong-path') state.lemoonStyleQuiz.path = '/somewhere-else';
      if (kind === 'malformed') state.lemoonStyleQuiz = { stage: 'shape' };
      if (kind === 'foreign-only') delete state.lemoonStyleQuiz;
      history.replaceState(state, '', '#style-quiz-shape');
    }, corrupt);
    await page.reload(); await expect(quiz.locator('[data-quiz-intro]')).toBeVisible(); await expect(quiz.locator('input:checked')).toHaveCount(0);
    expect(await page.evaluate(() => history.state.external)).toBe('preserved');
    await start(quiz); await at(quiz, 'category');
  });
}

test('measurement suggestion, validation and manual override survive back, forward and reload', async ({ page }) => {
  const quiz = await open(page); await start(quiz); await next(quiz, 5); await quiz.locator('[data-quiz-measures] summary').click();
  const lens = quiz.locator('[data-quiz-measure="lens_width"]');
  await lens.fill('abc'); await expect(lens).toHaveAttribute('aria-invalid', 'true');
  await lens.fill('50'); await quiz.locator('[data-quiz-measure="bridge"]').fill('18'); await quiz.locator('[data-quiz-measure="temple"]').fill('140');
  await expect(quiz.locator('input[name="presence"][value="medium"]')).toBeChecked(); await expect(lens).not.toHaveAttribute('aria-invalid', 'true');
  const oversize = quiz.locator('input[name="presence"][value="oversize"]'); await oversize.check();
  await expect(quiz.locator('[data-quiz-measure-status]')).toContainText('Mantuvimos tu elección');
  await page.goBack(); await at(quiz, 'use'); await page.goForward(); await at(quiz, 'presence');
  await expect(oversize).toBeChecked(); await expect(lens).toHaveValue('50'); await expect(quiz.locator('[data-quiz-measures]')).toHaveAttribute('open', '');
  await page.reload(); await expect(oversize).toBeChecked(); await expect(lens).toHaveValue('50');
  expect(await page.evaluate(() => history.state.lemoonStyleQuiz.presenceMode)).toBe('manual');
  await lens.fill('48'); await expect(quiz.locator('input[name="presence"][value="compact"]')).toBeChecked();
  await lens.fill(''); await expect(quiz.locator('input[name="presence"]:checked')).toHaveCount(0);
});

for (const missing of ['dictionary', 'exposure']) {
  test(`missing ${missing} stops navigation visibly and preserves answers`, async ({ page }) => {
    const quiz = await open(page, configTransform(config => {
      if (missing === 'dictionary') config.traits = config.traits.filter(row => row.code !== 'matte');
      else config.availableFilters = config.availableFilters.filter(key => !key.endsWith('style_filter_finish'));
    }));
    await start(quiz); await next(quiz, 3); await quiz.locator('input[value="matte"]').check(); await next(quiz, 3);
    await expect(current(quiz, 'presence')).toBeVisible(); await expect(quiz.locator('[data-quiz-status]')).toBeVisible();
    await expect(quiz.locator('[data-quiz-status]')).toContainText('No pudimos'); await expect(quiz.locator('input[value="matte"]')).toBeChecked();
    await expect(quiz.locator('[data-quiz-fallback] a')).toHaveAttribute('href', '/collections/all');
    expect(new URL(page.url()).pathname).toBe(route);
  });
}

test('category change removes the unsupported sun work choice without altering unrelated answers', async ({ page }) => {
  const quiz = await open(page); await start(quiz); await quiz.locator('input[value="optical"]').check(); await next(quiz, 4);
  await quiz.locator('input[name="use"][value="work"]').check();
  for (let i = 0; i < 4; i++) { await page.goBack(); }
  await at(quiz, 'category'); await quiz.locator('input[value="sun"]').check(); await next(quiz, 4);
  await expect(quiz.locator('input[name="use"][value="work"]')).toBeDisabled(); await expect(quiz.locator('input[name="use"][value="work"]')).not.toBeChecked();
  await expect(quiz.locator('input[name="use"][value="outdoors"]')).toBeVisible();
});

for (const width of [390, 1440]) {
  test(`stable first paint while the module loads at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    // Isolate controller initialization from external font timing. Firefox and
    // WebKit keep fonts.ready pending until this intentionally gated module loads.
    await install(page, html => html.replace(/<link href="https:\/\/fonts\.googleapis\.com[^>]*>/g, ''));
    let release; const gate = new Promise(resolve => { release = resolve; });
    await page.route('**/assets/lemoon-style-quiz.js', async request => { await gate; await request.fulfill({ contentType: 'text/javascript', body: readFileSync(path.join(root, 'assets/lemoon-style-quiz.js')) }); });
    try {
      await page.goto(route, { waitUntil: 'commit' }); const quiz = page.locator('[data-style-quiz]');
      await quiz.locator('.lemoon-quiz__editorial img').waitFor();
      await page.evaluate(async () => { await document.querySelector('.lemoon-quiz__editorial img').decode(); await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); const footer = document.createElement('footer'); footer.id = 'test-footer'; footer.textContent = 'Contenido posterior'; document.querySelector('main').after(footer); });
      const before = await page.locator('#test-footer').boundingBox(); await expect(quiz.locator('[data-quiz-start]')).toBeDisabled();
      release(); await expect(quiz.locator('[data-quiz-start]')).toBeEnabled();
      const after = await page.locator('#test-footer').boundingBox(); expect(after.y).toBeCloseTo(before.y, 1);
      writeFileSync(testInfo.outputPath('first-paint.json'), JSON.stringify({ before, after }));
      await expect(quiz.locator('[data-quiz-form]')).toBeHidden(); await expect(quiz.locator('[data-quiz-fallback]')).toBeHidden();
    } finally { release(); }
  });
}

test('a failed module or disabled JavaScript retains a real catalogue alternative', async ({ page, browser, baseURL }) => {
  await install(page); await page.route('**/assets/lemoon-style-quiz.js', request => request.abort('failed')); await page.goto(route);
  await expect(page.locator('[data-quiz-form]')).toBeHidden(); await expect(page.locator('[data-quiz-fallback] a')).toBeVisible();
  const context = await browser.newContext({ javaScriptEnabled: false }); const noJS = await context.newPage();
  try { await install(noJS); await noJS.goto(new URL(route, baseURL).href); await expect(noJS.locator('noscript')).toBeVisible(); await noJS.locator('[data-quiz-fallback] a').click(); await expect(noJS).toHaveURL(/\/collections\/all$/); } finally { await context.close(); }
});

test('at 200% zoom equivalent width the keyboard flow retains focus and avoids overflow', async ({ page }) => {
  await page.setViewportSize({ width: 720, height: 450 }); const quiz = await open(page);
  await quiz.locator('[data-quiz-start]').focus(); await page.keyboard.press('Enter'); await at(quiz, 'category');
  await quiz.locator('input[value="optical"]').focus(); await page.keyboard.press('Space');
  await quiz.locator('[data-quiz-next]').focus(); await page.keyboard.press('Enter'); await at(quiz, 'shape');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
