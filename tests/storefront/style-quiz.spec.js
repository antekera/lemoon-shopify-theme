import { test, expect } from '@playwright/test';
import { openStorefrontPage } from '../helpers/storefront-page.mjs';

// This suite requires an authorized Shopify-rendered preview of LEM-11.
// Local Liquid fixtures are covered separately in tests/e2e/style-quiz.spec.js.
const route = '/pages/buscar-mi-estilo?view=buscar-mi-estilo';
const cards = quiz => quiz.locator('[data-quiz-product]:visible');
async function expectNoLiquidErrors(quiz) {
  // Shopify can return HTTP 200 and working JS while rendering missing-snippet errors.
  await expect(quiz).not.toContainText(/Liquid (?:syntax )?error/i);
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
async function skipSteps(quiz, count) {
  for (let i = 0; i < count; i++) {
    await expectNoLiquidErrors(quiz);
    await quiz.locator('[data-quiz-skip]').click();
    await expectNoLiquidErrors(quiz);
  }
}
async function expandAll(quiz) {
  const more = quiz.locator('[data-quiz-more]');
  // Bounded by the documented 50-product curated collection contract.
  for (let i = 0; i < 17 && await more.isVisible(); i++) await more.click();
  await expect(more).toBeHidden();
}

test('five optional style stages retain selections, show the complete editorial group and reset', async ({ page }) => {
  const quiz = await openQuiz(page);
  await expect(page.locator('#MainContent h1')).toHaveCount(1);
  await expect(quiz.locator('[data-step="budget"]')).toHaveCount(0);
  await quiz.locator('[data-quiz-start]').click();
  await expectNoLiquidErrors(quiz);
  const rectangular = quiz.locator('input[name="shape"][value="rectangular"]');
  const catEye = quiz.locator('input[name="shape"][value="cat-eye"]');
  await rectangular.check(); await catEye.check();
  await quiz.locator('[data-quiz-next]').click();
  await expectNoLiquidErrors(quiz);
  await expect(quiz.locator('[data-step="color"] [data-quiz-question]')).toBeFocused();
  await quiz.locator('[data-quiz-back]').click();
  await expect(rectangular).toBeChecked(); await expect(catEye).toBeChecked();
  await skipSteps(quiz, 5);
  const results = quiz.locator('[data-quiz-results]');
  await expect(results).toBeVisible();
  await expectNoLiquidErrors(quiz);
  await expect(results.locator('h2')).toBeFocused();
  await expect(quiz.locator('input:checked')).toHaveCount(0);
  await expect(quiz.getByText(/editorial/i).first()).toBeVisible();
  expect(await cards(quiz).count()).toBeGreaterThan(0);
  await expandAll(quiz);
  const ids = await cards(quiz).evaluateAll(nodes => nodes.map(node => node.dataset.id));
  expect(ids.length).toBeGreaterThan(3);
  expect(new Set(ids).size).toBe(ids.length);
  await expect(cards(quiz).first().locator('.card-wrapper')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await quiz.locator('[data-quiz-restart]').click();
  await expect(results).toBeHidden();
  await expect(quiz.locator('input:checked')).toHaveCount(0);
});

test('pattern matching preserves a single recommended variant through the canonical card and PDP link', async ({ page }) => {
  const quiz = await openQuiz(page);
  await quiz.locator('[data-quiz-start]').click();
  await expectNoLiquidErrors(quiz);
  await skipSteps(quiz, 2);
  const patterns = quiz.locator('[data-quiz-tab="patterns"]');
  if (await patterns.count()) await patterns.click();
  await quiz.locator('input[name="pattern"][value="tortoise"]').check();
  await quiz.locator('[data-quiz-next]').click();
  await expectNoLiquidErrors(quiz);
  await skipSteps(quiz, 2);
  await expect(quiz.locator('[data-quiz-results]')).toBeVisible();
  await expectNoLiquidErrors(quiz);
  expect(await cards(quiz).count()).toBeGreaterThan(0);
  await expandAll(quiz);
  const ids = await cards(quiz).evaluateAll(nodes => nodes.map(node => node.dataset.id));
  expect(new Set(ids).size).toBe(ids.length);
  const first = cards(quiz).first();
  const variantId = await first.getAttribute('data-variant-id');
  await expect(first.locator('[data-quiz-reasons]')).not.toBeEmpty();
  const link = first.locator('a[href*="/products/"]').first();
  const href = await link.getAttribute('href');
  expect(new URL(href, 'https://lemoon.cl').searchParams.get('variant')).toBe(variantId);
  const selected = first.locator('.lemoon-product-card__swatch[aria-pressed="true"]');
  if (await selected.count()) await expect(selected).toHaveAttribute('data-variant-url', new RegExp(`variant=${variantId}(?:&|$)`));
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
    await expect(quiz.locator('[data-quiz-restart]')).toBeHidden();
    await quiz.locator('[data-quiz-catalogue]').click();
    await expect(page).toHaveURL(/\/collections\//);
  } finally { await context.close(); }
});
