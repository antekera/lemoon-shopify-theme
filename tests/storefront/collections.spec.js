import { test, expect } from '@playwright/test';
import { storefrontRequest } from '../helpers/storefront-request.mjs';

// Existing Shopify collection routes share the approved collection.json PLP.
// No alternate directory, invented collection or fixture products are used here.
const routes = ['/collections/all', '/collections/opticos', '/collections/lentes-de-sol'];

for (const route of routes) {
  test(`${route} renders its native collection and real product cards`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response.status()).toBe(200);
    await expect(page.locator('#MainContent h1')).toHaveCount(1);
    await expect(page.locator('#MainContent h1')).not.toBeEmpty();
    await expect(page.locator('.lemoon-crystal-guide')).toHaveCount(0);
    await expect(page.locator('.lemoon-plp')).toHaveAttribute('data-collection-url', route);
    // Shopify's all-products collection is virtual and has no collection ID.
    if (route !== '/collections/all') await expect(page.locator('collection-component')).toHaveAttribute('data-collection-id', /^\d+$/);
    const cards = page.locator('#product-grid .product-card-wrapper');
    expect(await cards.count()).toBeGreaterThan(0);
    const first = cards.first();
    const link = first.locator('a[href*="/products/"]:visible').first();
    const href = await link.getAttribute('href');
    const productPath = new URL(href, page.url()).pathname;
    const productResponse = await storefrontRequest(page).get(`${productPath}.js`);
    expect(productResponse.ok()).toBe(true);
    const product = await productResponse.json();
    await expect(first).toHaveAttribute('data-product-id', String(product.id));
    await expect(first).toContainText(product.title);
    expect(product.available).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${productPath}(?:\\?|$)`));
  });

  test(`${route} sorting retains the native collection route`, async ({ page }) => {
    await page.goto(route);
    const menu = page.locator('[data-sort-menu]');
    await menu.locator('summary').click();
    await menu.locator('[data-sort-value="price-ascending"]').click();
    await expect.poll(() => new URL(page.url()).searchParams.get('sort_by')).toBe('price-ascending');
    expect(new URL(page.url()).pathname).toBe(route);
    await expect(page.locator('.lemoon-plp')).toHaveAttribute('data-collection-url', route);
    expect(await page.locator('#product-grid .product-card-wrapper').count()).toBeGreaterThan(0);
  });
}

test('cristales explains the available choices and links to the real prototype configurator', async ({ page }) => {
  const response = await page.goto('/collections/cristales');
  expect(response.status()).toBe(200);
  await expect(page.locator('#MainContent h1')).toHaveCount(1);
  const guide = page.locator('.lemoon-crystal-guide');
  await expect(guide).toBeVisible();
  expect(await page.locator('#MainContent h1').evaluate(heading => Boolean(heading.compareDocumentPosition(document.querySelector('.lemoon-crystal-guide')) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
  await expect(guide.locator('.lemoon-crystal-guide__tile')).toHaveCount(3);
  await expect(guide.locator('a[href="/collections/opticos"]')).toBeVisible();
  await expect(guide.locator('a[href="/pages/como-enviar-prescripcion"]')).toBeVisible();
  const configurator = guide.locator('a[href*="view=configurador"]');
  await expect(configurator).toContainText('Prototipo');
  expect(await page.locator('#product-grid .product-card-wrapper').count()).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await configurator.click();
  await expect(page.locator('.lemoon-lens-flow')).toBeVisible();
  await expect(page.locator('[data-step="use"]')).toBeVisible();
});

test('native price filter empty state offers collection recovery', async ({ page }) => {
  await page.goto('/collections/all?filter.v.price.gte=999999999');
  await expect(page.locator('#product-grid .product-card-wrapper')).toHaveCount(0);
  await expect(page.locator('#product-grid h2')).toBeVisible();
  const recovery = page.locator('#product-grid a[href="/collections/all"]');
  await recovery.click();
  await expect(page).toHaveURL(/\/collections\/all$/);
  expect(await page.locator('#product-grid .product-card-wrapper').count()).toBeGreaterThan(0);
});
