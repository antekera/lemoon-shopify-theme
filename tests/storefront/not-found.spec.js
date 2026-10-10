import { test, expect } from '@playwright/test';
import { storefrontRequest } from '../helpers/storefront-request.mjs';

const path = '/lemoon-page-that-does-not-exist-20261010';

test('unknown route keeps HTTP 404 and offers working home/catalogue recovery', async ({ page }) => {
  const response = await page.goto(path);
  expect(response.status()).toBe(404);
  const content = page.locator('.lemoon-not-found');
  await expect(content.getByRole('heading', { level: 1 })).toHaveText('No encontramos esta página');
  await expect(content.getByRole('link', { name: 'Volver al inicio' })).toHaveAttribute('href', '/');
  const catalogue = content.getByRole('link', { name: 'Ver todos los armazones' });
  await expect(catalogue).toHaveAttribute('href', '/collections/all');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await catalogue.click();
  await expect(page).toHaveURL(/\/collections\/all/);
  expect((await storefrontRequest(page).get('/collections/all')).status()).toBe(200);
});

test('native product search works by keyboard from the error page', async ({ page }) => {
  await page.goto(path);
  const query = page.getByLabel('Buscar en el catálogo');
  await query.focus();
  await expect(query).toBeFocused();
  await query.fill('Colca');
  await query.press('Tab');
  await expect(page.locator('.lemoon-not-found').getByRole('button', { name: 'Buscar lentes' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/search\?/);
  const url = new URL(page.url());
  expect(url.searchParams.get('q')).toBe('Colca');
  expect(url.searchParams.get('type')).toBe('product');
});
