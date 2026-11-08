import { test, expect } from '@playwright/test';
import { openStorefrontPage } from '../helpers/storefront-page.mjs';

// Run only against an authorized Shopify-rendered version of this revision.
// This file deliberately has no fixture interception or passing substitute for
// the native filter index, real page assignment, or old-handle HTTP status.
const route = '/pages/descubre-tu-estilo';
const required = ['filter.p.product_type', 'filter.p.m.custom.frame_shape', 'filter.p.m.custom.frame_material', ...['color', 'finish', 'pattern', 'transparency', 'use', 'presence'].map(axis => `filter.v.m.custom.style_filter_${axis}`)];
async function open(page) {
  const response = await openStorefrontPage(page, route); expect(response.status()).toBe(200);
  await expect(page).not.toHaveURL(/\/password/); await expect(page.locator('body')).not.toContainText(/Liquid (?:syntax )?error/);
  const quiz = page.locator('[data-style-quiz]'); await expect(quiz).toBeVisible(); await expect(quiz.locator('[data-quiz-start]')).toBeEnabled();
  return quiz;
}
async function next(quiz, count = 1) { for (let i = 0; i < count; i++) await quiz.locator('[data-quiz-next]').click(); }

test('natural route renders the quiz and the old handle returns HTTP404 without redirection', async ({ page, baseURL }) => {
  const quiz = await open(page);
  await expect(page.locator('#MainContent h1')).toHaveText('Descubre tu estilo ideal.');
  await expect(quiz.locator('[data-quiz-product], [data-candidate], [data-quiz-results]')).toHaveCount(0);
  const oldURL = new URL('/pages/buscar-mi-estilo', baseURL);
  // Reuse the authenticated browser cookies; preview_theme_id itself introduces
  // Shopify's 302 preview handshake and is not part of the natural public URL.
  const response = await page.request.get(oldURL.href, { maxRedirects: 0 });
  expect(response.status()).toBe(404); expect(response.headers().location).toBeUndefined();
  await page.goto(oldURL.href); expect(new URL(page.url()).pathname).toBe('/pages/buscar-mi-estilo'); await expect(page.locator('[data-style-quiz]')).toHaveCount(0);
});

test('Shopify exposes every selected axis and applies editable native filters before returning to the final stage', async ({ page }) => {
  const quiz = await open(page);
  const config = JSON.parse(await quiz.locator('[data-quiz-filter-config]').textContent());
  expect(config.dictionaryComplete).toBe(true); expect(config.availableFilters).toEqual(expect.arrayContaining(required));
  for (const trait of config.traits) expect(trait.id).toMatch(/^gid:\/\/shopify\/Metaobject\/[1-9]\d*$/);
  await quiz.locator('[data-quiz-start]').click(); await quiz.locator('input[value="optical"]').check(); await next(quiz);
  await quiz.locator('input[name="shape"][value="round"]').check(); await next(quiz);
  for (const value of ['black', 'silver', 'tortoise', 'transparent']) await quiz.locator(`[data-step="color"] input[value="${value}"]`).check(); await next(quiz);
  await quiz.locator('input[name="finish"][value="matte"]').check(); await quiz.locator('input[name="finish"][value="glossy"]').check(); await quiz.locator('input[name="material"][value="metal"]').check(); await next(quiz);
  await quiz.locator('input[name="use"][value="everyday"]').check(); await next(quiz);
  await quiz.locator('input[name="presence"][value="medium"]').check(); await next(quiz);
  await expect(page).toHaveURL(/\/collections\/all\?/); await expect(page.locator('#ProductCount')).toBeAttached();
  await expect(page.locator('#MainContent')).not.toContainText(/Liquid (?:syntax )?error/);
  const query = new URL(page.url()).searchParams;
  for (const field of required) {
    expect(query.has(field), field).toBe(true);
    const checked = page.locator(`input[name="${field}"]:checked`);
    expect(await checked.count(), `Shopify must recognize active ${field}`).toBeGreaterThan(0);
  }
  const chips = page.locator('.lemoon-applied-filters .lemoon-filter-pill');
  expect(await chips.count()).toBeGreaterThanOrEqual(9);
  const initialChipCount = await chips.count();
  await chips.first().click(); await expect(chips).toHaveCount(initialChipCount - 1);
  // Native zero-results is valid; it must retain honest controls for removal.
  await expect(page.locator('.lemoon-filter-reset a')).toBeVisible();
  await page.goBack(); await page.goBack(); await expect(page.locator('[data-step="presence"]')).toBeVisible();
  await expect(page.locator('input[name="presence"][value="medium"]')).toBeChecked();
});

test('an unrestricted quiz hands the complete catalogue count and pagination to Shopify', async ({ page }) => {
  const quiz = await open(page); await quiz.locator('[data-quiz-start]').click(); await next(quiz, 6);
  await expect(page).toHaveURL(/\/collections\/all(?:\?|$)/);
  expect([...new URL(page.url()).searchParams.keys()].filter(key => key.startsWith('filter.'))).toEqual([]);
  // Desktop hides its count on mobile; data attributes remain the count contract.
  const count = page.locator('#ProductCount'); await expect(count).toBeAttached();
  const expectedCount = Number(await count.getAttribute('data-product-count'));
  expect(expectedCount).toBe(Number(await count.getAttribute('data-total-count')));
  const cards = page.locator('#product-grid > li');
  if (expectedCount > await cards.count()) {
    const nextPage = page.locator('.pagination__item--prev[href*="page="]');
    await expect(nextPage).toBeVisible(); const firstIDs = await cards.evaluateAll(nodes => nodes.map(node => node.querySelector('[id]')?.id));
    await nextPage.click(); await expect(page).toHaveURL(/[?&]page=2/);
    const secondIDs = await cards.evaluateAll(nodes => nodes.map(node => node.querySelector('[id]')?.id));
    expect(secondIDs.length).toBeGreaterThan(0); expect(secondIDs.some(id => firstIDs.includes(id))).toBe(false);
  }
});

test('without JavaScript the real catalogue remains accessible', async ({ browser, baseURL, viewport, storageState }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL, viewport, storageState });
  const page = await context.newPage();
  try {
    const response = await page.goto(route); expect(response.status()).toBe(200);
    await expect(page.locator('[data-quiz-form]')).toBeHidden(); await expect(page.locator('[data-style-quiz] noscript')).toBeVisible();
    await page.locator('[data-quiz-fallback] a').click(); await expect(page).toHaveURL(/\/collections\/all/);
  } finally { await context.close(); }
});
