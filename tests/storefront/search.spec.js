import { test, expect } from '@playwright/test';

test('search shows real product results, retains the query and excludes indexing', async ({ page }) => {
  await page.goto('/search?q=Colca&type=product');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  await expect(page.locator('#MainContent h1')).toHaveText('Busca sin perderte.');
  await expect(page.locator('[id^="Search-In-Template-"]')).toHaveValue('Colca');
  const products = page.locator('#product-grid .product-card-wrapper');
  expect(await products.count()).toBeGreaterThan(0);
  await expect(products.first()).toContainText('Colca');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const link = products.first().locator('a[href*="/products/"]:visible').first();
  await link.click();
  await expect(page).toHaveURL(/\/products\/[^?]+/);
});

test('empty results preserve special characters and offer a real catalogue route', async ({ page }) => {
  const query = 'sin-resultados-20261010 <marco> & azul';
  await page.goto(`/search?q=${encodeURIComponent(query)}&type=product`);
  await expect(page.locator('[id^="Search-In-Template-"]')).toHaveValue(query);
  await expect(page.locator('#MainContent')).toContainText('¿No era lo que buscabas?');
  await expect(page.locator('#MainContent marco')).toHaveCount(0);
  const catalogue = page.locator('#MainContent a[href="/collections/all"]').last();
  await catalogue.click();
  await expect(page).toHaveURL(/\/collections\/all$/);
});

test('prominent form submits a new query and blank search browses the catalogue', async ({ page }) => {
  await page.goto('/search');
  expect(await page.locator('#product-grid .product-card-wrapper').count()).toBeGreaterThan(0);
  await page.locator('[id^="Search-In-Template-"]').fill('Colca');
  await page.locator('#MainContent form.search button[type="submit"]').click();
  await expect(page).toHaveURL(/\/search\?.*q=Colca/);
  await expect(page.locator('#product-grid')).toContainText('Colca');
});

test('native sorting keeps the catalogue restriction and current query', async ({ page }, testInfo) => {
  await page.goto('/search?q=Colca&type=product');
  if (testInfo.project.name === 'mobile') await page.locator('#MainContent .mobile-facets__open').click();
  const sort = page.locator('#MainContent select[name="sort_by"]:visible').first();
  await sort.selectOption('price-ascending');
  await expect.poll(() => new URL(page.url()).searchParams.get('sort_by')).toBe('price-ascending');
  expect(new URL(page.url()).searchParams.get('type')).toBe('product');
  expect(new URL(page.url()).searchParams.get('q')).toBe('Colca');
});
