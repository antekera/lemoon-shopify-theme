import { test, expect } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const route = '/tests/fixtures/style-quiz.html';
const visibleCards = quiz => quiz.locator('[data-quiz-product]:visible');
// Keep this worktree's real source isolated from any reusable server on 4173.
// The HTTP shell supplies an origin; the renderer and assets come from here.
async function installFixtureRoutes(target) {
  await target.route('**/tests/fixtures/style-quiz.html*', async request => {
    const scenario = new URL(request.request().url()).searchParams.get('scenario') || 'default';
    const body = execFileSync(process.execPath, [resolve('tests/helpers/style-quiz-fixture-build.mjs'), scenario], { encoding: 'utf8', maxBuffer: 5 * 1024 * 1024 });
    await request.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body });
  });
  await target.route('**/assets/*', async request => {
    const pathname = new URL(request.request().url()).pathname;
    if (!/^\/assets\/[\w.-]+$/.test(pathname)) return request.continue();
    const extension = pathname.split('.').pop();
    const contentType = { js: 'text/javascript', css: 'text/css', svg: 'image/svg+xml', jpg: 'image/jpeg', png: 'image/png', woff2: 'font/woff2' }[extension] || 'application/octet-stream';
    try { await request.fulfill({ status: 200, contentType, body: await readFile(resolve(pathname.slice(1))) }); }
    catch { await request.fulfill({ status: 404, body: 'Missing fixture asset' }); }
  });
}
test.beforeEach(async ({ page }) => { await installFixtureRoutes(page); });
async function openQuiz(page, scenario = 'default') {
  const response = await page.goto(`${route}?scenario=${scenario}`);
  expect(response.status()).toBe(200);
  const quiz = page.locator('[data-style-quiz]');
  await expect(quiz.locator('[data-quiz-start]')).toBeVisible();
  await expect(quiz.locator('[data-quiz-form]')).toBeHidden();
  return quiz;
}
async function start(quiz) {
  await quiz.locator('[data-quiz-start]').click();
  await expect(quiz.locator('[data-step="shape"]')).toBeVisible();
}
async function skipToResults(quiz, count = 5) {
  for (let i = 0; i < count; i++) await quiz.locator('[data-quiz-skip]').click();
  await expect(quiz.locator('[data-quiz-results]')).toBeVisible();
}

for (const width of [390, 1440]) {
  test.describe(`quiz journey at ${width}px (real Liquid, fixture Product objects)`, () => {
    test.use({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });

    test('retains multiple selections on back and clears a skipped stage before editorial results', async ({ page }, testInfo) => {
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      const quiz = await openQuiz(page);
      if (width === 390) {
        await page.evaluate(() => document.fonts.ready);
        await quiz.screenshot({ path: testInfo.outputPath('mobile-intro.png') });
      }
      await start(quiz);
      const round = quiz.locator('input[name="shape"][value="round"]');
      const rectangular = quiz.locator('input[name="shape"][value="rectangular"]');
      await round.check(); await rectangular.check();
      await quiz.locator('[data-quiz-next]').click();
      await expect(quiz.locator('[data-step="color"] [data-quiz-question]')).toBeFocused();
      await quiz.locator('[data-quiz-back]').click();
      await expect(round).toBeChecked(); await expect(rectangular).toBeChecked();
      await skipToResults(quiz);
      await expect(quiz.locator('input:checked')).toHaveCount(0);
      await expect(quiz.locator('[data-quiz-results] h2')).toBeFocused();
      await expect(visibleCards(quiz)).toHaveCount(3);
      await expect(quiz.locator('[data-quiz-more]')).toBeVisible();
      await quiz.locator('[data-quiz-more]').click();
      await expect(visibleCards(quiz)).toHaveCount(6);
      const ids = await visibleCards(quiz).evaluateAll(nodes => nodes.map(node => node.dataset.id));
      expect(ids).toEqual(['101', '102', '103', '104', '105', '106']);
      expect(new Set(ids).size).toBe(ids.length);
      await expect(quiz.getByText(/demostración/i).first()).toBeVisible();
      await expect(quiz.getByText(/editorial/i).first()).toBeVisible();
      await quiz.locator('[data-quiz-restart]').click();
      await expect(quiz.locator('input:checked')).toHaveCount(0);
      await expect(quiz.locator('[data-quiz-results]')).toBeHidden();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(errors).toEqual([]);
    });

    test('shows the full shape-matched group and lets people edit their preference', async ({ page }) => {
      const quiz = await openQuiz(page); await start(quiz);
      await quiz.locator('input[name="shape"][value="rectangular"]').check();
      await quiz.locator('[data-quiz-next]').click();
      await skipToResults(quiz, 4);
      await expect(visibleCards(quiz)).toHaveCount(3);
      await quiz.locator('[data-quiz-more]').click();
      await expect(visibleCards(quiz)).toHaveCount(5);
      await expect(visibleCards(quiz).first().locator('[data-quiz-reasons]')).not.toBeEmpty();
      await quiz.locator('[data-quiz-edit="shape"]').click();
      await expect(quiz.locator('input[name="shape"][value="rectangular"]')).toBeChecked();
      await quiz.locator('input[name="shape"][value="rectangular"]').uncheck();
      await quiz.locator('input[name="shape"][value="round"]').check();
      await quiz.locator('[data-quiz-next]').click();
      await expect(quiz.locator('[data-quiz-results]')).toBeVisible();
      await expect(visibleCards(quiz)).toHaveCount(1);
      await expect(visibleCards(quiz)).toHaveAttribute('data-id', '101');
      await expect(quiz.locator('[data-quiz-more]')).toBeHidden();
    });
  });
}

test('keyboard can start and choose a shape, and the measures help is an optional disclosure', async ({ page }) => {
  const quiz = await openQuiz(page);
  await quiz.locator('[data-quiz-start]').focus(); await page.keyboard.press('Enter');
  await expect(quiz.locator('[data-step="shape"] [data-quiz-question]')).toBeFocused();
  const option = quiz.locator('input[name="shape"][value="round"]');
  await option.focus(); await page.keyboard.press('Space'); await expect(option).toBeChecked();
  await quiz.locator('[data-quiz-next]').click();
  for (let i = 0; i < 3; i++) await quiz.locator('[data-quiz-skip]').click();
  const help = quiz.locator('[data-quiz-measures]');
  await expect(help).toBeVisible();
  await help.locator('summary').focus(); await page.keyboard.press('Enter');
  await expect(help).toHaveAttribute('open', '');
  await page.keyboard.press('Enter'); await expect(help).not.toHaveAttribute('open');
});

for (const axis of ['color', 'pattern']) {
  test(`a standalone ${axis === 'color' ? 'bold color' : 'plain pattern'} preference selects the matching blue variants`, async ({ page }) => {
    const quiz = await openQuiz(page); await start(quiz);
    await quiz.locator('[data-quiz-skip]').click();
    if (axis === 'pattern') {
      await quiz.locator('[data-quiz-skip]').click();
      await quiz.locator('[data-quiz-tab="patterns"]').click();
    }
    const option = quiz.locator(`input[name="${axis}"][value="${axis === 'color' ? 'bold' : 'plain'}"]`);
    const label = await quiz.locator(`label:has(input[name="${axis}"][value="${axis === 'color' ? 'bold' : 'plain'}"]) [data-quiz-option-label]`).innerText();
    await option.check();
    await quiz.locator('[data-quiz-next]').click();
    await skipToResults(quiz, axis === 'color' ? 3 : 2);
    await expect(visibleCards(quiz)).toHaveCount(3);
    await expect(visibleCards(quiz).first().locator('[data-quiz-reasons]')).toContainText(label);
    await quiz.locator('[data-quiz-more]').click();
    await expect(visibleCards(quiz)).toHaveCount(6);
    const variants = await visibleCards(quiz).evaluateAll(nodes => nodes.map(node => node.dataset.variantId));
    expect(variants).toEqual(['1011', '1021', '1031', '1041', '1051', '1061']);
    for (const card of await visibleCards(quiz).all()) await expect(card.getByRole('button', { name: 'Azul', exact: true })).toHaveAttribute('aria-pressed', 'true');
  });
}

test.describe('variant exploration at mobile width', () => {
  test.use({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  test('keeps reasons honest when exploring another color and restores them on the matching variant', async ({ page }, testInfo) => {
    const quiz = await openQuiz(page); await start(quiz);
    await quiz.locator('[data-quiz-skip]').click(); await quiz.locator('[data-quiz-skip]').click();
    await quiz.locator('[data-quiz-tab="patterns"]').click();
    const pattern = quiz.locator('input[name="pattern"][value="tortoise"]');
    const patternLabel = await quiz.locator('label:has(input[name="pattern"][value="tortoise"]) [data-quiz-option-label]').innerText();
    await pattern.check();
    await quiz.screenshot({ path: testInfo.outputPath('mobile-details.png') });
    await quiz.locator('[data-quiz-next]').click(); await skipToResults(quiz, 2);
    const first = visibleCards(quiz).first();
    const variantId = await first.getAttribute('data-variant-id');
    await expect(first.locator('a[href*="/products/"]').first()).toHaveAttribute('href', new RegExp(`variant=${variantId}(?:&|$)`));
    await expect(first.getByRole('button', { name: 'Carey', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(first.getByRole('button', { name: 'Azul', exact: true }).locator('.swatch')).toHaveCSS('background-color', 'rgb(51, 79, 131)');
    const reasons = first.locator('[data-quiz-reasons]');
    await expect(reasons).toContainText(patternLabel);
    const matchingReason = await reasons.innerText();
    for (const card of await visibleCards(quiz).all()) {
      const image = card.locator('.card__media img').first();
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate(node => node.complete && node.naturalWidth > 0)).toBe(true);
      await expect(image).toBeVisible();
    }
    const mediaDiagnostics = await first.locator('.card__media img').evaluateAll(images => images.map(node => ({
      src: node.src, naturalWidth: node.naturalWidth, rect: node.getBoundingClientRect().toJSON(),
      opacity: getComputedStyle(node).opacity, visibility: getComputedStyle(node).visibility, display: getComputedStyle(node).display,
      parent: { opacity: getComputedStyle(node.parentElement).opacity, rect: node.parentElement.getBoundingClientRect().toJSON() },
    })));
    const fonts = await page.evaluate(async () => {
      await document.fonts.ready;
      return [...document.fonts].map(font => ({ family: font.family, status: font.status }));
    });
    await writeFile(testInfo.outputPath('media-diagnostic.json'), JSON.stringify({ images: mediaDiagnostics, fonts }, null, 2));
    await testInfo.attach('media-diagnostic.json', { path: testInfo.outputPath('media-diagnostic.json'), contentType: 'application/json' });
    await quiz.locator('[data-quiz-results] h2').scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    await quiz.screenshot({ path: testInfo.outputPath('mobile-results.png') });
    await first.getByRole('button', { name: 'Azul', exact: true }).click();
    await expect(reasons).not.toContainText(patternLabel);
    await expect(reasons).not.toHaveText(matchingReason);
    await expect(first.getByRole('button', { name: 'Azul', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await quiz.locator('[data-quiz-more]').click();
    await expect(visibleCards(quiz)).toHaveCount(6);
    await expect(reasons).not.toContainText(patternLabel);
    await first.getByRole('button', { name: 'Carey', exact: true }).click();
    await expect(reasons).toHaveText(matchingReason);
    await expect(first.getByRole('button', { name: 'Carey', exact: true })).toHaveAttribute('aria-pressed', 'true');
  });
});

test('an empty catalog produces useful zero results rather than invented products', async ({ page }) => {
  const quiz = await openQuiz(page, 'empty'); await start(quiz); await skipToResults(quiz);
  await expect(visibleCards(quiz)).toHaveCount(0);
  await expect(quiz.locator('[data-quiz-empty]')).toBeVisible();
  await expect(quiz.locator('[data-quiz-restart]')).toBeVisible();
});

test('malformed candidate data leaves the editorial fallback usable instead of starting a broken quiz', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  const response = await page.goto(`${route}?scenario=malformed`); expect(response.status()).toBe(200);
  const quiz = page.locator('[data-style-quiz]');
  await expect(quiz.locator('[data-quiz-start]')).toBeHidden();
  await expect(quiz.locator('[data-quiz-form]')).toBeHidden();
  await expect(quiz.locator('[data-quiz-status]')).not.toBeEmpty();
  await expect(visibleCards(quiz)).toHaveCount(6);
  await expect(quiz.locator('[data-quiz-catalogue]')).toBeVisible();
  expect(errors).toEqual([]);
});

test('without JavaScript the real Liquid provides one editorial card per eligible product', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  try {
    await installFixtureRoutes(context);
    const page = await context.newPage();
    const response = await page.goto(route); expect(response.status()).toBe(200);
    const quiz = page.locator('[data-style-quiz]');
    await expect(quiz.locator('[data-quiz-form]')).toBeHidden();
    await expect(quiz.locator('noscript')).toBeVisible();
    await expect(visibleCards(quiz)).toHaveCount(6);
    const ids = await visibleCards(quiz).evaluateAll(nodes => nodes.map(node => node.dataset.id));
    expect(new Set(ids).size).toBe(ids.length);
    await expect(quiz.locator('[data-quiz-restart]')).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  } finally { await context.close(); }
});
