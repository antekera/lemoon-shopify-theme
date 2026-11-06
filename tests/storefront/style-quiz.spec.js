import { test, expect } from '@playwright/test';
import { openStorefrontPage } from '../helpers/storefront-page.mjs';

// This suite requires an authorized Shopify-rendered preview of LEM-11.
// Local Liquid fixtures are covered separately in tests/e2e/style-quiz.spec.js.
const route = '/pages/buscar-mi-estilo';
const cards = quiz => quiz.locator('[data-quiz-product]:visible');
async function expectNoLiquidErrors(quiz) {
  // Shopify can return HTTP 200 and working JS while rendering missing-snippet errors.
  await expect(quiz).not.toContainText(/Liquid (?:syntax )?error/i);
}
async function expectCanonicalResults(page, quiz) {
  await expect(quiz.locator('[data-quiz-preferences]')).toHaveCount(1);
  await expect(quiz.locator('[data-quiz-preferences]')).toBeVisible();
  await expect(quiz.locator('[data-quiz-product] [data-quiz-reasons]')).toHaveCount(0);
  const extra = await cards(quiz).evaluateAll(nodes => nodes.map(article => {
    const copy = article.cloneNode(true);
    copy.querySelectorAll('.card-wrapper, template').forEach(node => node.remove());
    return copy.textContent.trim();
  }).filter(Boolean));
  expect(extra).toEqual([]);
  expect(await quiz.evaluate(root => Boolean(root.querySelector('[data-quiz-preferences]').compareDocumentPosition(root.querySelector('[data-quiz-products]')) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
  if (page.viewportSize().width === 390 && await cards(quiz).count() >= 3) {
    const boxes = await cards(quiz).evaluateAll(nodes => nodes.slice(0, 3).map(node => node.getBoundingClientRect().toJSON()));
    expect(boxes[0].y).toBeCloseTo(boxes[1].y, 1);
    expect(boxes[1].x - boxes[0].right).toBeCloseTo(12, 1);
    expect(boxes[2].x).toBeCloseTo(boxes[0].x, 1);
    expect(boxes[2].y - boxes[0].bottom).toBeCloseTo(24, 1);
  }
}
async function openQuiz(page) {
  const response = await openStorefrontPage(page, route);
  expect(response.status()).toBe(200);
  await expect(page).not.toHaveURL(/\/password/);
  await expectNoLiquidErrors(page.locator('body'));
  const quiz = page.locator('[data-style-quiz]');
  await expect(quiz).toBeVisible();
  await expectNoLiquidErrors(quiz);
  await expect(quiz.locator('[data-quiz-start]')).toBeVisible();
  await expect(quiz.locator('[data-quiz-form]')).toBeHidden();
  return quiz;
}
async function continueSteps(quiz, count) {
  for (let i = 0; i < count; i++) {
    await expectNoLiquidErrors(quiz);
    await quiz.locator('[data-quiz-next]').click();
    await expectNoLiquidErrors(quiz);
  }
}
async function expandAll(quiz) {
  const more = quiz.locator('[data-quiz-more]');
  // Bounded by the documented 50-product curated collection contract.
  for (let i = 0; i < 5 && await more.isVisible(); i++) await more.click();
  await expect(more).toBeHidden();
}

test('category plus five optional style stages retain selections, show the complete editorial group and go back', async ({ page }) => {
  const quiz = await openQuiz(page);
  await expect(page.locator('#MainContent h1')).toHaveCount(1);
  await expect(quiz.locator('[data-step="budget"]')).toHaveCount(0);
  await quiz.locator('[data-quiz-start]').click();
  await expect(quiz.locator('[data-step="category"]')).toBeVisible();
  await quiz.locator('[data-quiz-next]').click();
  await expectNoLiquidErrors(quiz);
  const rectangular = quiz.locator('input[name="shape"][value="rectangular"]');
  const catEye = quiz.locator('input[name="shape"][value="cat-eye"]');
  await rectangular.check(); await catEye.check();
  await quiz.locator('[data-quiz-next]').click();
  await expectNoLiquidErrors(quiz);
  await expect(quiz.locator('[data-step="color"] [data-quiz-question]')).toBeFocused();
  await quiz.locator('[data-quiz-back]').click();
  await expect(rectangular).toBeChecked(); await expect(catEye).toBeChecked();
  await rectangular.uncheck(); await catEye.uncheck();
  await continueSteps(quiz, 5);
  const results = quiz.locator('[data-quiz-results]');
  await expect(results).toBeVisible();
  await expectNoLiquidErrors(quiz);
  await expect(results.locator('h2')).toBeFocused();
  await expect(quiz.locator('input:checked')).toHaveCount(0);
  await expect(quiz.getByText(/editorial/i).first()).toBeVisible();
  const editorialCount = await quiz.locator('[data-quiz-product]').evaluateAll(nodes => new Set(nodes.filter(node => JSON.parse(node.dataset.candidate).available).map(node => node.dataset.id)).size);
  await expect(cards(quiz)).toHaveCount(Math.min(12, editorialCount));
  if (editorialCount <= 12) await expect(quiz.locator('[data-quiz-more]')).toBeHidden();
  await expectCanonicalResults(page, quiz);
  await expandAll(quiz);
  const ids = await cards(quiz).evaluateAll(nodes => nodes.map(node => node.dataset.id));
  expect(ids.length).toBeGreaterThan(3);
  expect(new Set(ids).size).toBe(ids.length);
  await expect(cards(quiz).first().locator('.card-wrapper')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await quiz.locator('[data-quiz-results-back]').click();
  await expect(results).toBeHidden();
  await expect(quiz.locator('input:checked')).toHaveCount(0);
});

test('pattern matching preserves a single recommended variant through the canonical card and PDP link', async ({ page }) => {
  const quiz = await openQuiz(page);
  await quiz.locator('[data-quiz-start]').click();
  await expect(quiz.locator('[data-step="category"]')).toBeVisible();
  await quiz.locator('[data-quiz-next]').click();
  await expectNoLiquidErrors(quiz);
  await continueSteps(quiz, 1);
  const patternLabel = await quiz.locator('[data-step="color"] label:has(input[name="pattern"][value="tortoise"]) [data-quiz-option-label]').innerText();
  await quiz.locator('[data-step="color"] input[name="pattern"][value="tortoise"]').check();
  await quiz.locator('[data-quiz-next]').click();
  await expectNoLiquidErrors(quiz);
  await continueSteps(quiz, 3);
  await expect(quiz.locator('[data-quiz-results]')).toBeVisible();
  await expectNoLiquidErrors(quiz);
  expect(await cards(quiz).count()).toBeGreaterThan(0);
  await expandAll(quiz);
  const ids = await cards(quiz).evaluateAll(nodes => nodes.map(node => node.dataset.id));
  expect(new Set(ids).size).toBe(ids.length);
  const first = cards(quiz).first();
  const variantId = await first.getAttribute('data-variant-id');
  await expectCanonicalResults(page, quiz);
  await expect(quiz.locator('[data-quiz-preferences]')).toContainText(patternLabel);
  const link = first.locator('a[href*="/products/"]').first();
  const href = await link.getAttribute('href');
  expect(new URL(href, 'https://lemoon.cl').searchParams.get('variant')).toBe(variantId);
  const selected = first.locator('.lemoon-product-card__swatch[aria-pressed="true"]');
  if (await selected.count()) await expect(selected).toHaveAttribute('data-variant-url', new RegExp(`variant=${variantId}(?:&|$)`));
  const selectedLabel = await selected.getAttribute('aria-label');
  await first.getByRole('button', { name: 'Azul', exact: true }).click();
  await expect(first.getByRole('button', { name: 'Azul', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expectCanonicalResults(page, quiz);
  await expect(quiz.locator('[data-quiz-preferences]')).toContainText(patternLabel);
  await first.getByRole('button', { name: selectedLabel, exact: true }).click();
  await expect(link).toHaveAttribute('href', href);
  const pdpErrors = [];
  page.on('pageerror', error => pdpErrors.push(error.message));
  await page.goto(href);
  await expect(page.locator('#MainContent h1').first()).toBeVisible();
  await expectNoLiquidErrors(page.locator('#MainContent'));
  expect(pdpErrors).toEqual([]);
  expect(new URL(page.url()).searchParams.get('variant')).toBe(variantId);
});

test('without JavaScript visitors can browse a real editorial selection and catalogue', async ({ browser, baseURL, viewport, storageState }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL, viewport, storageState });
  const page = await context.newPage();
  try {
    const response = await page.goto(route); expect(response.status()).toBe(200);
    const quiz = page.locator('[data-style-quiz]');
    await expectNoLiquidErrors(page.locator('body'));
    await expect(quiz).toBeVisible();
    await expect(quiz.locator('[data-quiz-form]')).toBeHidden();
    await expect(quiz.locator('noscript')).toBeVisible();
    await expectNoLiquidErrors(quiz);
    const ids = await cards(quiz).evaluateAll(nodes => nodes.map(node => node.dataset.id));
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
    await expect(quiz.locator('[data-quiz-results-back]')).toBeHidden();
    await quiz.locator('[data-quiz-results] [data-quiz-catalogue]').click();
    await expect(page).toHaveURL(/\/collections\//);
  } finally { await context.close(); }
});
