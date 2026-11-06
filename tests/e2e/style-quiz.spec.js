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
  await expect(quiz.locator('[data-step="category"]')).toBeVisible();
  await quiz.locator('[data-quiz-next]').click();
  await expect(quiz.locator('[data-step="shape"]')).toBeVisible();
}
async function continueToResults(quiz, count = 5) {
  for (let i = 0; i < count; i++) await quiz.locator('[data-quiz-next]').click();
  await expect(quiz.locator('[data-quiz-results]')).toBeVisible();
}

// Results are read-only; changing a prior answer uses the sequential back controls.
async function returnToStep(quiz, stage) {
  const order = ['category', 'shape', 'color', 'details', 'use', 'presence'];
  await quiz.locator('[data-quiz-results-back]').click();
  for (let index = order.length - 1; index > order.indexOf(stage); index--) await quiz.locator('[data-quiz-back]').click();
  await expect(quiz.locator(`[data-step="${stage}"]`)).toBeVisible();
}

async function expectCanonicalResults(quiz) {
  await expect(quiz.locator('[data-quiz-preferences]')).toHaveCount(1);
  await expect(quiz.locator('[data-quiz-preferences]')).toBeVisible();
  await expect(quiz.locator('[data-quiz-preference]')).toHaveCount(6);
  await expect(quiz.locator('[data-quiz-preferences] button, [data-quiz-preferences] a, [data-quiz-edit]')).toHaveCount(0);
  await expect(quiz.locator('[data-quiz-product] [data-quiz-reasons]')).toHaveCount(0);
  const extraContent = await visibleCards(quiz).evaluateAll(nodes => nodes.map(article => {
    const copy = article.cloneNode(true);
    copy.querySelectorAll('.card-wrapper, template').forEach(node => node.remove());
    return copy.textContent.trim();
  }).filter(Boolean));
  expect(extraContent).toEqual([]);
  expect(await quiz.evaluate(root => Boolean(root.querySelector('[data-quiz-preferences]').compareDocumentPosition(root.querySelector('[data-quiz-products]')) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
}

for (const width of [390, 1440]) {
  test.describe(`read-only results summary at ${width}px`, () => {
    test.use({ viewport: { width, height: 1100 }, reducedMotion: 'reduce' });
    test('shows every selection in six equal tiles, filled catalogue action and sequential back', async ({ page }, testInfo) => {
      const quiz = await openQuiz(page, 'colors');
      await quiz.locator('[data-quiz-start]').click();
      await quiz.locator('input[name="category"][value="optical"]').check();
      await quiz.locator('[data-quiz-next]').click();
      for (const input of await quiz.locator('input[name="shape"]').all()) await input.check();
      await quiz.locator('[data-quiz-next]').click();
      for (const input of await quiz.locator('[data-step="color"] input').all()) await input.check();
      await quiz.locator('[data-quiz-next]').click();
      for (const input of await quiz.locator('input[name="finish"]').all()) await input.check();
      await quiz.locator('[data-quiz-tab="materials"]').click();
      for (const input of await quiz.locator('input[name="material"]').all()) await input.check();
      await quiz.locator('[data-quiz-next]').click();
      for (const input of await quiz.locator('input[name="use"]').all()) await input.check();
      await quiz.locator('[data-quiz-next]').click();
      await quiz.locator('input[name="presence"][value="medium"]').check();
      const checkedBefore = await quiz.locator('input:checked').evaluateAll(nodes => nodes.map(node => `${node.name}:${node.value}`));
      const expectedLabels = await quiz.locator('input:checked').evaluateAll(nodes => nodes.map(node => node.closest('label').querySelector('[data-quiz-option-label]').textContent.trim()));
      await quiz.locator('[data-quiz-next]').click();
      await expectCanonicalResults(quiz);
      const summary = quiz.locator('[data-quiz-preferences]');
      for (const label of expectedLabels) await expect(summary).toContainText(label);
      await expect(quiz.locator('[data-quiz-demo], [data-quiz-restart]')).toHaveCount(0);
      const tiles = quiz.locator('[data-quiz-preference]');
      const boxes = await tiles.evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().toJSON()));
      for (const box of boxes) { expect(box.width).toBeCloseTo(boxes[0].width, 1); expect(box.height).toBeCloseTo(boxes[0].height, 1); }
      const selectedCount = await quiz.locator('input:checked').count();
      await tiles.first().click();
      await expect(quiz.locator('[data-quiz-results]')).toBeVisible();
      await expect(quiz.locator('input:checked')).toHaveCount(selectedCount);
      const catalogue = quiz.locator('[data-quiz-results] [data-quiz-catalogue]');
      await expect(catalogue).toHaveAttribute('href', '/collections/all');
      await expect(quiz.locator('[data-quiz-intro] [data-quiz-catalogue]')).toHaveAttribute('href', '/collections/all');
      await expect(catalogue).toHaveCSS('background-color', 'rgb(11, 31, 58)');
      const buttonShape = await catalogue.evaluate(node => ({ radius: parseFloat(getComputedStyle(node).borderRadius), height: node.getBoundingClientRect().height }));
      expect(buttonShape.radius).toBeGreaterThanOrEqual(buttonShape.height / 2);
      await summary.screenshot({ path: testInfo.outputPath('read-only-summary.png') });
      await quiz.locator('[data-quiz-results] .lemoon-quiz__actions').screenshot({ path: testInfo.outputPath('results-actions.png') });
      await quiz.locator('[data-quiz-results-back]').click();
      await expect(quiz.locator('[data-step="presence"]')).toBeVisible();
      await expect(quiz.locator('[data-step="presence"] [data-quiz-question]')).toBeFocused();
      expect(await quiz.locator('input:checked').evaluateAll(nodes => nodes.map(node => `${node.name}:${node.value}`))).toEqual(checkedBefore);
      await quiz.locator('[data-quiz-back]').click();
      await expect(quiz.locator('[data-step="use"]')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    });
  });
}

test.describe('canonical result grid at mobile width', () => {
  test.use({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  test('shows six products immediately in two columns with PLP spacing', async ({ page }) => {
    const quiz = await openQuiz(page); await start(quiz); await continueToResults(quiz);
    await expect(visibleCards(quiz)).toHaveCount(6);
    await expect(quiz.locator('[data-quiz-more]')).toBeHidden();
    await expectCanonicalResults(quiz);
    const boxes = await visibleCards(quiz).evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().toJSON()));
    expect(boxes[0].y).toBeCloseTo(boxes[1].y, 1);
    expect(boxes[1].x - boxes[0].right).toBeCloseTo(12, 1);
    expect(boxes[2].x).toBeCloseTo(boxes[0].x, 1);
    expect(boxes[2].y - boxes[0].bottom).toBeCloseTo(24, 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });

  test('reveals batches of twelve without repeating criteria or resetting an explored swatch', async ({ page }) => {
    const quiz = await openQuiz(page, 'paginated'); await start(quiz);
    await quiz.locator('[data-quiz-next]').click();
    await quiz.locator('[data-step="color"] input[name="pattern"][value="tortoise"]').check();
    await quiz.locator('[data-quiz-next]').click(); await continueToResults(quiz, 3);
    await expect(visibleCards(quiz)).toHaveCount(12);
    await expectCanonicalResults(quiz);
    await expect(quiz.locator('[data-quiz-preferences]')).toContainText('Carey');
    const first = visibleCards(quiz).first();
    await first.getByRole('button', { name: 'Azul', exact: true }).click();
    const blueURL = await first.locator('a[href*="/products/"]').first().getAttribute('href');
    await quiz.locator('[data-quiz-more]').click();
    await expect(visibleCards(quiz)).toHaveCount(24);
    await expect(first.getByRole('button', { name: 'Azul', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(first.locator('a[href*="/products/"]').first()).toHaveAttribute('href', blueURL);
    await expectCanonicalResults(quiz);
    await quiz.locator('[data-quiz-more]').click();
    await expect(visibleCards(quiz)).toHaveCount(27);
    await expect(quiz.locator('[data-quiz-more]')).toBeHidden();
    const ids = await visibleCards(quiz).evaluateAll(nodes => nodes.map(node => node.dataset.id));
    expect(ids).toEqual(Array.from({ length: 27 }, (_, index) => String(201 + index)));
    expect(new Set(ids).size).toBe(27);
    await expect(first.getByRole('button', { name: 'Azul', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(quiz.locator('[data-quiz-preferences]')).toContainText('Carey');
  });
});

for (const width of [390, 1440]) {
  test.describe(`quiz journey at ${width}px (real Liquid, fixture Product objects)`, () => {
    test.use({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });

    test('retains multiple selections on back and allows unanswered stages before editorial results', async ({ page }, testInfo) => {
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
      await round.uncheck(); await rectangular.uncheck();
      await continueToResults(quiz);
      await expect(quiz.locator('input:checked')).toHaveCount(0);
      await expect(quiz.locator('[data-quiz-results] h2')).toBeFocused();
      await expect(visibleCards(quiz)).toHaveCount(6);
      await expect(quiz.locator('[data-quiz-more]')).toBeHidden();
      await expectCanonicalResults(quiz);
      const ids = await visibleCards(quiz).evaluateAll(nodes => nodes.map(node => node.dataset.id));
      expect(ids).toEqual(['101', '102', '103', '104', '105', '106']);
      expect(new Set(ids).size).toBe(ids.length);
      await expect(quiz.locator('[data-quiz-demo]')).toHaveCount(0);
      await expect(quiz.getByText(/editorial/i).first()).toBeVisible();
      await quiz.locator('[data-quiz-results-back]').click();
      await expect(quiz.locator('input:checked')).toHaveCount(0);
      await expect(quiz.locator('[data-step="presence"]')).toBeVisible();
      await expect(quiz.locator('[data-quiz-results]')).toBeHidden();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(errors).toEqual([]);
    });

    test('shows the full shape-matched group and lets people edit their preference', async ({ page }) => {
      const quiz = await openQuiz(page); await start(quiz);
      await quiz.locator('input[name="shape"][value="rectangular"]').check();
      await quiz.locator('[data-quiz-next]').click();
      await continueToResults(quiz, 4);
      await expect(visibleCards(quiz)).toHaveCount(5);
      await expect(quiz.locator('[data-quiz-more]')).toBeHidden();
      await expectCanonicalResults(quiz);
      await expect(quiz.locator('[data-quiz-preferences]')).toContainText('Rectangulares');
      await returnToStep(quiz, 'shape');
      await expect(quiz.locator('input[name="shape"][value="rectangular"]')).toBeChecked();
      await quiz.locator('input[name="shape"][value="rectangular"]').uncheck();
      await quiz.locator('input[name="shape"][value="round"]').check();
      await continueToResults(quiz, 5);
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
  await expect(quiz.locator('[data-step="category"] [data-quiz-question]')).toBeFocused();
  await quiz.locator('[data-quiz-next]').click();
  await expect(quiz.locator('[data-step="shape"] [data-quiz-question]')).toBeFocused();
  const option = quiz.locator('input[name="shape"][value="round"]');
  await option.focus(); await page.keyboard.press('Space'); await expect(option).toBeChecked();
  await quiz.locator('[data-quiz-next]').click();
  for (let i = 0; i < 3; i++) await quiz.locator('[data-quiz-next]').click();
  const help = quiz.locator('[data-quiz-measures]');
  await expect(help).toBeVisible();
  await help.locator('summary').focus(); await page.keyboard.press('Enter');
  await expect(help).toHaveAttribute('open', '');
  await page.keyboard.press('Enter'); await expect(help).not.toHaveAttribute('open');
});

for (const width of [390, 1440]) {
  test.describe(`editable measurement suggestion at ${width}px`, () => {
    test.use({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    test('autoselects only after three valid values and retains manual choices and reference state on back', async ({ page }, testInfo) => {
      const quiz = await openQuiz(page, 'categories');
      await start(quiz);
      for (let i = 0; i < 4; i++) await quiz.locator('[data-quiz-next]').click();
      const step = quiz.locator('[data-step="presence"]');
      const help = step.locator('[data-quiz-measures]');
      const chevron = help.locator('summary .lemoon-icon--chevron-down');
      const status = help.locator('[data-quiz-measure-status]');
      const lens = help.locator('[data-quiz-measure="lens_width"]');
      const bridge = help.locator('[data-quiz-measure="bridge"]');
      const temple = help.locator('[data-quiz-measure="temple"]');
      const selected = step.locator('input[name="presence"]:checked');
      await expect(chevron).toBeVisible();
      await expect(chevron).toHaveCSS('transform', 'none');
      await help.locator('summary').click();
      await expect(chevron).toHaveCSS('transform', 'matrix(-1, 0, 0, -1, 0, 0)');
      await page.evaluate(() => document.fonts.ready);
      const restingBoxes = await help.locator('[data-quiz-measure]').evaluateAll(nodes => nodes.map(node => {
        const box = node.getBoundingClientRect();
        return { x: box.x + scrollX, y: box.y + scrollY, width: box.width, height: box.height };
      }));
      for (const field of [lens, bridge, temple]) {
        await field.click();
        await expect(field).toBeFocused();
        await expect(field).toHaveCSS('border-top-width', '2px');
        await expect(field).toHaveCSS('outline-width', '0px');
        await expect(field).toHaveCSS('box-shadow', 'none');
      }
      await help.locator('summary').focus();
      for (const field of [lens, bridge, temple]) await expect(field).toHaveCSS('border-top-width', '1px');
      await lens.focus();
      await page.keyboard.press('Tab');
      await expect(bridge).toBeFocused();
      await expect(bridge).toHaveCSS('border-top-width', '2px');
      await expect(bridge).toHaveCSS('outline-width', '0px');
      await expect(bridge).toHaveCSS('box-shadow', 'none');
      const focusedBoxes = await help.locator('[data-quiz-measure]').evaluateAll(nodes => nodes.map(node => {
        const box = node.getBoundingClientRect();
        return { x: box.x + scrollX, y: box.y + scrollY, width: box.width, height: box.height };
      }));
      focusedBoxes.forEach((box, index) => {
        for (const dimension of ['x', 'y', 'width', 'height']) expect(box[dimension]).toBeCloseTo(restingBoxes[index][dimension], 1);
      });
      await lens.fill('50'); await bridge.fill('18');
      await expect(selected).toHaveCount(0);
      await temple.fill('140');
      await expect(selected).toHaveCount(1); await expect(selected).toHaveValue('medium');
      await expect(status).toContainText('Intermedios');
      await step.locator('input[value="oversize"]').check();
      await expect(selected).toHaveValue('oversize');
      await expect(status).toContainText('tu elección');
      await help.locator('summary').click(); await help.locator('summary').click();
      await expect(selected).toHaveValue('oversize');
      await quiz.locator('[data-quiz-back]').click(); await quiz.locator('[data-quiz-next]').click();
      await expect(selected).toHaveValue('oversize'); await expect(lens).toHaveValue('50');
      await quiz.locator('[data-quiz-next]').click();
      await expect(quiz.locator('[data-quiz-preference="presence"]')).toContainText('Oversize');
      await returnToStep(quiz, 'presence');
      await expect(selected).toHaveValue('oversize');
      await lens.fill('48'); await expect(selected).toHaveValue('compact');
      await lens.fill('58'); await expect(selected).toHaveValue('oversize');
      await temple.fill(''); await expect(selected).toHaveCount(0);
      await temple.fill('abc');
      await expect(temple).toHaveAttribute('aria-invalid', 'true');
      await expect(status).toContainText('Revisa las medidas');
      await expect(selected).toHaveCount(0);
      await temple.fill('140');
      await expect(temple).not.toHaveAttribute('aria-invalid');
      await expect(selected).toHaveValue('oversize');
      await lens.fill('50');
      await expect(selected).toHaveValue('medium');
      await help.screenshot({ path: testInfo.outputPath('single-border-focus.png') });
      await quiz.screenshot({ path: testInfo.outputPath('reference-measures.png') });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await quiz.locator('[data-quiz-next]').click();
      await returnToStep(quiz, 'presence');
      await expect(help).toHaveAttribute('open', '');
      await expect(lens).toHaveValue('50'); await expect(bridge).toHaveValue('18'); await expect(temple).toHaveValue('140');
      await expect(status).toContainText('Intermedios'); await expect(selected).toHaveValue('medium');
      // A malformed optional reference does not block the quiz or invent a selection.
      await lens.fill('abc'); await quiz.locator('[data-quiz-next]').click();
      await expect(quiz.locator('[data-quiz-results]')).toBeVisible();
    });
  });
}

for (const [axis, value, swatch, suffix] of [['color', 'bold', 'Azul', '1'], ['pattern', 'tortoise', 'Carey', '2']]) {
  test(`a standalone ${value} choice in Color selects the matching ${swatch} variants`, async ({ page }) => {
    const quiz = await openQuiz(page); await start(quiz);
    await quiz.locator('[data-quiz-next]').click();
    const color = quiz.locator('[data-step="color"]');
    const option = color.locator(`input[name="${axis}"][value="${value}"]`);
    const label = await color.locator(`label:has(input[name="${axis}"][value="${value}"]) [data-quiz-option-label]`).innerText();
    await option.check();
    await quiz.locator('[data-quiz-next]').click(); await continueToResults(quiz, 3);
    await expect(visibleCards(quiz)).toHaveCount(6);
    await expect(quiz.locator('[data-quiz-more]')).toBeHidden();
    await expectCanonicalResults(quiz);
    await expect(quiz.locator('[data-quiz-preferences]')).toContainText(label);
    const variants = await visibleCards(quiz).evaluateAll(nodes => nodes.map(node => node.dataset.variantId));
    expect(variants).toEqual([101, 102, 103, 104, 105, 106].map(id => `${id}${suffix}`));
    for (const card of await visibleCards(quiz).all()) await expect(card.getByRole('button', { name: swatch, exact: true })).toHaveAttribute('aria-pressed', 'true');
  });
}

test.describe('variant exploration at mobile width', () => {
  test.use({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  test('explores colors within canonical cards while retaining the chosen criteria once above the grid', async ({ page }, testInfo) => {
    const quiz = await openQuiz(page); await start(quiz);
    await quiz.locator('[data-quiz-next]').click();
    const pattern = quiz.locator('[data-step="color"] input[name="pattern"][value="tortoise"]');
    const patternLabel = await quiz.locator('[data-step="color"] label:has(input[name="pattern"][value="tortoise"]) [data-quiz-option-label]').innerText();
    await pattern.check();
    await quiz.screenshot({ path: testInfo.outputPath('mobile-color-carey.png') });
    await quiz.locator('[data-quiz-next]').click(); await continueToResults(quiz, 3);
    const first = visibleCards(quiz).first();
    const variantId = await first.getAttribute('data-variant-id');
    await expect(first.locator('a[href*="/products/"]').first()).toHaveAttribute('href', new RegExp(`variant=${variantId}(?:&|$)`));
    await expect(first.getByRole('button', { name: 'Carey', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(first.getByRole('button', { name: 'Azul', exact: true }).locator('.swatch')).toHaveCSS('background-color', 'rgb(51, 79, 131)');
    await expectCanonicalResults(quiz);
    const preferences = quiz.locator('[data-quiz-preferences]');
    await expect(preferences).toContainText(patternLabel);
    const recommendedURL = await first.locator('a[href*="/products/"]').first().getAttribute('href');
    for (const card of await visibleCards(quiz).all()) {
      const image = card.locator('.card__media img').first();
      // Product 106 intentionally has no media; its canonical placeholder remains valid.
      if (!await image.count()) { await expect(card.locator('.card-wrapper')).toBeVisible(); continue; }
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
    await expectCanonicalResults(quiz);
    await expect(preferences).toContainText(patternLabel);
    await expect(first.locator('a[href*="/products/"]').first()).not.toHaveAttribute('href', recommendedURL);
    await expect(first.getByRole('button', { name: 'Azul', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(visibleCards(quiz)).toHaveCount(6);
    await expect(quiz.locator('[data-quiz-more]')).toBeHidden();
    await first.getByRole('button', { name: 'Carey', exact: true }).click();
    await expect(first.locator('a[href*="/products/"]').first()).toHaveAttribute('href', recommendedURL);
    await expect(preferences).toContainText(patternLabel);
    await expectCanonicalResults(quiz);
    await expect(first.getByRole('button', { name: 'Carey', exact: true })).toHaveAttribute('aria-pressed', 'true');
  });
});

for (const width of [390, 1440]) {
  test.describe(`missing-media color exploration at ${width}px`, () => {
    test.use({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    test('changes photo to neutral fallback and back while keeping variant price and links coherent', async ({ page }, testInfo) => {
      const quiz = await openQuiz(page, 'missing-media'); await start(quiz); await continueToResults(quiz);
      const result = visibleCards(quiz).first();
      await expect(visibleCards(quiz)).toHaveCount(1);
      const primary = result.locator('.card__media img').first();
      const media = result.locator('.card__media .media');
      const secondary = result.locator('.card__media img').nth(1);
      const blue = result.getByRole('button', { name: 'Azul', exact: true });
      const tortoise = result.getByRole('button', { name: 'Carey', exact: true });
      const price = result.locator('.price-item--regular').first();
      const productLinks = result.locator('a[href*="/products/"]');
      const expectVariant = async swatch => {
        await expect(swatch).toHaveAttribute('aria-pressed', 'true');
        const expectedURL = await swatch.getAttribute('data-variant-url');
        const expectedPrice = await swatch.getAttribute('data-price');
        for (const link of await productLinks.all()) await expect(link).toHaveAttribute('href', expectedURL);
        await expect(price).toHaveText(expectedPrice);
      };
      await expect(primary).toHaveAttribute('src', /lemoon-category-opticos-generic-v1\.jpg/);
      await expectVariant(blue);
      await expect(secondary).toHaveAttribute('src', /lemoon-quiz-category-optical-studio-v1-480\.jpg/);
      await expect(media).toHaveClass(/lemoon-product-card__secondary-ready/);
      const blueSource = await blue.getAttribute('data-primary-src');
      await tortoise.click();
      await expectVariant(tortoise);
      await expect(primary).toHaveAttribute('src', '/assets/lemoon-product-fallback.png');
      await expect.poll(() => primary.evaluate(node => node.complete && node.naturalWidth > 0)).toBe(true);
      await expect.poll(() => primary.evaluate(node => new URL(node.currentSrc).pathname)).toBe('/assets/lemoon-product-fallback.png');
      await expect(primary).toHaveAttribute('alt', '');
      await result.hover();
      await expect(media).not.toHaveClass(/lemoon-product-card__secondary-ready/);
      await expect(primary).toHaveCSS('opacity', '1');
      await expect(secondary).toHaveCSS('opacity', '0');
      await result.screenshot({ path: testInfo.outputPath('missing-media-neutral-fallback.png') });
      await blue.click();
      await expectVariant(blue);
      await expect(primary).toHaveAttribute('src', blueSource);
      await expect(primary).not.toHaveAttribute('src', /lemoon-product-fallback/);
      await expect.poll(() => primary.evaluate(node => node.complete && node.naturalWidth > 0)).toBe(true);
      await expect.poll(() => primary.evaluate(node => new URL(node.currentSrc).pathname)).toBe('/assets/lemoon-category-opticos-generic-v1.jpg');
      await expect(secondary).toHaveAttribute('src', /lemoon-quiz-category-optical-studio-v1-480\.jpg/);
      await expect(media).toHaveClass(/lemoon-product-card__secondary-ready/);
      await expectCanonicalResults(quiz);
    });
  });
}

test('a previous color decode cannot restore the secondary image after choosing a missing-media color', async ({ page }) => {
  await page.addInitScript(() => {
    const decode = HTMLImageElement.prototype.decode;
    const pending = [];
    const releases = [];
    window.__quizSecondaryDecode = {
      count: () => pending.length,
      release: async () => {
        releases.splice(0).forEach(resolve => resolve());
        await Promise.all(pending);
      },
    };
    HTMLImageElement.prototype.decode = function () {
      const loaded = decode.call(this);
      if (!this.src.includes('lemoon-quiz-category-optical-studio-v1-480.jpg')) return loaded;
      const gate = new Promise(resolve => releases.push(resolve));
      const held = Promise.all([loaded, gate]).then(() => undefined);
      pending.push(held);
      return held;
    };
  });
  const quiz = await openQuiz(page, 'missing-media'); await start(quiz); await continueToResults(quiz);
  const result = visibleCards(quiz).first();
  const media = result.locator('.card__media .media');
  const primary = result.locator('.card__media img').first();
  await expect.poll(() => page.evaluate(() => window.__quizSecondaryDecode.count())).toBeGreaterThan(0);
  await expect(media).not.toHaveClass(/lemoon-product-card__secondary-ready/);
  await result.getByRole('button', { name: 'Carey', exact: true }).click();
  await expect(primary).toHaveAttribute('src', '/assets/lemoon-product-fallback.png');
  await page.evaluate(() => window.__quizSecondaryDecode.release());
  await expect(media).not.toHaveClass(/lemoon-product-card__secondary-ready/);
  await expect(primary).toHaveCSS('opacity', '1');
});

test('an empty catalog produces useful zero results rather than invented products', async ({ page }) => {
  const quiz = await openQuiz(page, 'empty'); await start(quiz); await continueToResults(quiz);
  await expect(visibleCards(quiz)).toHaveCount(0);
  await expect(quiz.locator('[data-quiz-empty]')).toBeVisible();
  await expect(quiz.locator('[data-quiz-results-back]')).toBeVisible();
});

test('malformed candidate data leaves the editorial fallback usable instead of starting a broken quiz', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  const response = await page.goto(`${route}?scenario=malformed`); expect(response.status()).toBe(200);
  const quiz = page.locator('[data-style-quiz]');
  await expect(quiz.locator('[data-quiz-start]')).toBeHidden();
  await expect(quiz.locator('[data-quiz-form]')).toBeHidden();
  await expect(quiz.locator('[data-quiz-status]')).not.toBeEmpty();
  await expect(quiz.locator('[data-quiz-status]')).toBeVisible();
  await expect(quiz.locator('[data-quiz-status]')).not.toHaveClass(/visually-hidden/);
  await expect(visibleCards(quiz)).toHaveCount(6);
  await expect(quiz.locator('[data-quiz-results] [data-quiz-catalogue]')).toBeVisible();
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
    await expect(quiz.locator('[data-quiz-results-back]')).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  } finally { await context.close(); }
});


for (const width of [390, 1440]) {
  test.describe(`category-first journey at ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });
    test('solar choice adapts use, filters results and preserves styles across category edits', async ({ page }, testInfo) => {
      const quiz = await openQuiz(page, 'categories');
      await quiz.locator('[data-quiz-start]').click();
      await expect(quiz.locator('[data-step="category"] [data-quiz-question]')).toBeFocused();
      await expect(quiz.locator('[data-quiz-status]')).toContainText('1 de 6');
      const sun = quiz.locator('input[name="category"][value="sun"]');
      const optical = quiz.locator('input[name="category"][value="optical"]');
      await optical.check(); await sun.check();
      await expect(optical).not.toBeChecked();
      await quiz.locator('[data-quiz-next]').click();
      await quiz.locator('input[name="shape"][value="rectangular"]').check();
      await quiz.locator('[data-quiz-next]').click();
      await quiz.locator('[data-quiz-next]').click();
      await quiz.locator('[data-quiz-next]').click();
      const work = quiz.locator('input[name="use"][value="work"]');
      await expect(work).toBeDisabled();
      await expect(work.locator('..')).toBeHidden();
      await expect(quiz.locator('[data-step="use"]')).toContainText('Paseos y viajes');
      await quiz.screenshot({ path: testInfo.outputPath('sun-use.png') });
      await continueToResults(quiz, 2);
      await expect(visibleCards(quiz)).toHaveCount(2);
      expect(await visibleCards(quiz).evaluateAll(nodes => nodes.map(node => node.dataset.id))).toEqual(['302', '303']);
      await expect(quiz.locator('[data-quiz-preferences]')).toContainText('Rectangulares');
      await returnToStep(quiz, 'category');
      await optical.check(); await continueToResults(quiz, 6);
      await expect(visibleCards(quiz)).toHaveCount(1);
      await expect(visibleCards(quiz)).toHaveAttribute('data-id', '301');
      await expect(quiz.locator('input[name="shape"][value="rectangular"]')).toBeChecked();
      await returnToStep(quiz, 'use');
      await expect(work).toBeEnabled();
      await work.check(); await continueToResults(quiz, 2);
      await returnToStep(quiz, 'category');
      await sun.check(); await continueToResults(quiz, 6);
      await expect(work).not.toBeChecked(); await expect(work).toBeDisabled();
      await expect(visibleCards(quiz)).toHaveCount(2);
      await returnToStep(quiz, 'category');
      await quiz.locator('[data-quiz-back]').click();
      await expect(quiz.locator('[data-quiz-intro]')).toBeVisible();
      await expect(sun).toBeChecked();
      await quiz.locator('[data-quiz-start]').click();
      await optical.check();
      await quiz.locator('[data-quiz-next]').click();
      await quiz.locator('input[name="shape"][value="rectangular"]').uncheck();
      for (let i = 0; i < 3; i++) await quiz.locator('[data-quiz-next]').click();
      await expect(work).toBeEnabled();
      await expect(work.locator('..')).toBeVisible();
      await expect(quiz.locator('[data-step="use"]')).toContainText('Paseos al aire libre');
      await expect(quiz.locator('[data-step="use"]')).not.toContainText('Paseos y viajes');
      await continueToResults(quiz, 2);
      await expect(optical).toBeChecked();
      await expect(quiz.locator('input[name="shape"]:checked')).toHaveCount(0);
      await expect(visibleCards(quiz)).toHaveCount(1);
      await expect(visibleCards(quiz)).toHaveAttribute('data-id', '301');
    });
  });
}


test('choosing only a category keeps editorial results within it and supports the keyboard', async ({ page }) => {
  const quiz = await openQuiz(page, 'categories');
  await quiz.locator('[data-quiz-start]').click();
  const sun = quiz.locator('input[name="category"][value="sun"]');
  await sun.focus(); await page.keyboard.press('Space');
  await expect(sun).toBeChecked();
  await quiz.locator('[data-quiz-next]').click();
  await continueToResults(quiz);
  await expect(visibleCards(quiz)).toHaveCount(2);
  await expect(quiz.locator('[data-quiz-editorial]')).toBeVisible();
  expect(await visibleCards(quiz).evaluateAll(nodes => nodes.map(node => node.dataset.id))).toEqual(['302', '303']);
});


for (const width of [390, 1440]) {
  test.describe(`circular progress and bottom navigation at ${width}px`, () => {
    test.use({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    test('tracks submitted stages and retains progress and choices when returning from results', async ({ page }, testInfo) => {
      const quiz = await openQuiz(page);
      await quiz.locator('[data-quiz-start]').click();
      const progress = quiz.getByRole('progressbar', { includeHidden: true });
      const segments = progress.locator('[data-quiz-segment]');
      async function expectCurrent(stage) {
        const current = progress.locator('[data-quiz-segment][data-current="true"]');
        await expect(current).toHaveCount(1);
        await expect(current).toHaveAttribute('data-quiz-segment', stage);
        await expect(current).toHaveCSS('outline-color', 'rgb(11, 31, 58)');
        await expect(current).toHaveCSS('outline-width', '2px');
        await expect(current).toHaveCSS('outline-offset', '4px');
      }
      await expect(progress).toHaveAttribute('aria-valuemin', '0');
      await expect(progress).toHaveAttribute('aria-valuemax', '6');
      await expect(progress).toHaveAttribute('aria-valuenow', '0');
      await expect(segments).toHaveCount(6);
      await expectCurrent('category');
      await expect(quiz.locator('[data-quiz-skip]')).toHaveCount(0);
      await expect(quiz.locator('.lemoon-quiz__navigation [data-quiz-back]')).toHaveCount(0);
      const back = quiz.locator('.lemoon-quiz__actions [data-quiz-back]');
      await expect(back).toHaveCount(1);
      await expect(quiz.locator('[data-quiz-status]')).toHaveClass(/visually-hidden/);
      for (const segment of await segments.all()) {
        await expect(segment).toHaveAttribute('data-complete', 'false');
        await expect(segment).toHaveCSS('background-color', 'rgb(247, 230, 0)');
      }
      const barBox = await progress.boundingBox();
      expect(barBox.x + barBox.width / 2).toBeCloseTo(width / 2, 0);
      const boxes = await segments.evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().toJSON()));
      for (const box of boxes) {
        expect(box.width).toBeGreaterThan(0);
        expect(box.width).toBeCloseTo(box.height, 1);
      }
      const radii = await segments.evaluateAll(nodes => nodes.map(node => parseFloat(getComputedStyle(node).borderRadius)));
      radii.forEach((radius, index) => expect(radius).toBeGreaterThanOrEqual(boxes[index].width / 2));
      for (let i = 1; i < boxes.length; i++) expect(boxes[i].x).toBeGreaterThan(boxes[i - 1].right);
      const category = quiz.locator('input[name="category"][value="optical"]');
      await category.check();
      await quiz.locator('[data-quiz-next]').click();
      await expect(progress).toHaveAttribute('aria-valuenow', '1');
      await expectCurrent('shape');
      await expect(segments.nth(0)).toHaveAttribute('data-complete', 'true');
      await expect(segments.nth(0)).toHaveCSS('background-color', 'rgb(11, 31, 58)');
      await expect(segments.nth(1)).toHaveCSS('background-color', 'rgb(247, 230, 0)');
      const round = quiz.locator('input[name="shape"][value="round"]');
      await round.check(); await quiz.locator('[data-quiz-next]').click();
      await expect(progress).toHaveAttribute('aria-valuenow', '2');
      await expectCurrent('color');
      await expect(segments.nth(1)).toHaveCSS('background-color', 'rgb(11, 31, 58)');
      await back.click();
      await expectCurrent('shape');
      await expect(round).toBeChecked();
      await expect(progress).toHaveAttribute('aria-valuenow', '2');
      await back.click(); await expect(category).toBeChecked();
      await expectCurrent('category');
      await back.click();
      await expect(quiz.locator('[data-quiz-intro]')).toBeVisible();
      await expect(quiz.locator('[data-quiz-start]')).toBeFocused();
      await quiz.locator('[data-quiz-start]').click();
      await expect(category).toBeChecked();
      await expect(progress).toHaveAttribute('aria-valuenow', '2');
      await quiz.screenshot({ path: testInfo.outputPath('circular-progress.png') });
      await continueToResults(quiz, 6);
      await expect(progress).toHaveAttribute('aria-valuenow', '6');
      await quiz.locator('[data-quiz-results-back]').click();
      await expect(progress).toHaveAttribute('aria-valuenow', '6');
      await expectCurrent('presence');
      await expect(category).toBeChecked(); await expect(round).toBeChecked();
      for (const segment of await segments.all()) {
        await expect(segment).toHaveAttribute('data-complete', 'true');
        await expect(segment).toHaveCSS('background-color', 'rgb(11, 31, 58)');
      }
    });
  });
}

for (const width of [390, 1440]) {
  test.describe(`compact color choices at ${width}px`, () => {
    test.use({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    test('keeps Carey and transparency only in Color and retains them through read-only summary and sequential navigation', async ({ page }, testInfo) => {
      const quiz = await openQuiz(page, 'colors'); await start(quiz);
      await quiz.locator('[data-quiz-next]').click();
      const color = quiz.locator('[data-step="color"]');
      const details = quiz.locator('[data-step="details"]');
      const choices = color.locator('label:has(input)');
      await expect(choices).toHaveCount(7);
      await expect(color.locator('[data-quiz-option-label]')).toHaveText(['Colores', 'Tonos neutros', 'Negros', 'Carey', 'Bicolor', 'Transparentes', 'Plateados']);
      await expect(color).not.toContainText(/dorado|gold/i);
      const boxes = await choices.evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().toJSON()));
      const columns = width === 390 ? 2 : 3;
      for (let index = 0; index < columns; index++) expect(boxes[index].y).toBeCloseTo(boxes[0].y, 1);
      expect(boxes[columns].y).toBeGreaterThan(boxes[0].bottom);
      boxes.forEach(box => expect(box.height).toBeGreaterThanOrEqual(72));
      const colorCarey = color.locator('input[name="pattern"][value="tortoise"]');
      const colorTransparent = color.locator('input[name="transparency"][value="transparent"]');
      await expect(quiz.locator('input[name="pattern"][value="tortoise"]')).toHaveCount(1);
      await expect(quiz.locator('input[name="transparency"][value="transparent"]')).toHaveCount(1);
      await colorCarey.check(); await colorTransparent.check();
      await quiz.screenshot({ path: testInfo.outputPath('compact-colors.png') });
      await quiz.locator('[data-quiz-next]').click();
      await expect(details.locator('[data-quiz-tab]')).toHaveCount(2);
      await expect(details.locator('[data-quiz-tab]')).toHaveText(['Acabados', 'Materiales']);
      await expect(details.locator('input[name="pattern"], input[name="transparency"]')).toHaveCount(0);
      await expect(details.locator('[data-quiz-tab="patterns"]')).toHaveCount(0);
      await expect(details.locator('input[name="finish"]')).toHaveCount(2);
      await quiz.locator('[data-quiz-tab="materials"]').click();
      await expect(details.locator('input[name="material"][value="metal"]')).toBeVisible();
      await quiz.screenshot({ path: testInfo.outputPath('simplified-details.png') });
      await quiz.locator('[data-quiz-next]').click(); await continueToResults(quiz, 2);
      expect(await visibleCards(quiz).evaluateAll(nodes => nodes.map(node => node.dataset.id))).toEqual(['407', '408']);
      const colorSummary = quiz.locator('[data-quiz-preference="color"]');
      const detailsSummary = quiz.locator('[data-quiz-preference="details"]');
      await expect(colorSummary).toContainText('Carey'); await expect(colorSummary).toContainText('Transparentes');
      await expect(detailsSummary).toContainText('Sin preferencia');
      await expect(detailsSummary).not.toContainText(/Carey|Transparente/);
      await returnToStep(quiz, 'color');
      await expect(colorCarey).toBeChecked(); await expect(colorTransparent).toBeChecked();
      await colorCarey.uncheck();
      await continueToResults(quiz, 4);
      await expect(visibleCards(quiz)).toHaveCount(1);
      await expect(visibleCards(quiz)).toHaveAttribute('data-id', '407');
      await expect(colorSummary).toContainText('Transparentes');
      await returnToStep(quiz, 'color'); await colorTransparent.uncheck();
      await continueToResults(quiz, 4);
      await expect(visibleCards(quiz)).toHaveCount(9);
      await expect(colorSummary).toContainText('Sin preferencia');
      await returnToStep(quiz, 'color');
      await expect(quiz.locator('input:checked')).toHaveCount(0);
      await expect(colorCarey).not.toBeChecked(); await expect(colorTransparent).not.toBeChecked();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    });
  });
}

test('neutral, two-tone and silver choices match explicit traits without inferring silver from metal', async ({ page }) => {
  const quiz = await openQuiz(page, 'colors'); await start(quiz);
  await quiz.locator('[data-quiz-next]').click();
  const color = quiz.locator('[data-step="color"]');
  await color.locator('input[value="neutral"]').check();
  await quiz.locator('[data-quiz-next]').click(); await continueToResults(quiz, 3);
  expect(await visibleCards(quiz).evaluateAll(nodes => nodes.map(node => node.dataset.id))).toEqual(['401', '402']);
  for (const [value, id] of [['two_tone', '404'], ['silver', '405'], ['black', '403'], ['bold', '409']]) {
    await returnToStep(quiz, 'color');
    for (const selected of await color.locator('input:checked').all()) await selected.uncheck();
    await color.locator(`input[value="${value}"]`).check();
    await continueToResults(quiz, 4);
    await expect(visibleCards(quiz)).toHaveCount(1);
    await expect(visibleCards(quiz)).toHaveAttribute('data-id', id);
  }
});
