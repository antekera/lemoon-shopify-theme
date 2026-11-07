import { test, expect } from '@playwright/test';
import { storefrontRequest } from '../helpers/storefront-request.mjs';

const path = '/lemoon-page-that-does-not-exist-20261010';

test('unknown route keeps HTTP 404 and offers four recovery links without search', async ({ page }) => {
  const response = await page.goto(path);
  expect(response.status()).toBe(404);
  const content = page.locator('.lemoon-not-found');
  await expect(content.getByRole('heading', { level: 1 })).toHaveText('No encontramos esta página');
  await expect(content.getByRole('link', { name: 'Volver al inicio' })).toHaveAttribute('href', '/');
  const catalogue = content.getByRole('link', { name: 'Ver todos los armazones' });
  await expect(catalogue).toHaveAttribute('href', '/collections/all');
  await expect(content.getByRole('link', { name: 'Preguntas frecuentes', exact: true })).toHaveAttribute('href', '/pages/preguntas-frecuentes');
  await expect(content.getByRole('link', { name: 'Contáctanos', exact: true })).toHaveAttribute('href', '/pages/contact');
  await expect(content.getByRole('link')).toHaveCount(4);
  await expect(content.locator('form, input')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await catalogue.click();
  await expect(page).toHaveURL(/\/collections\/all/);
  expect((await storefrontRequest(page).get('/collections/all')).status()).toBe(200);
});

test('four recovery links are reachable by keyboard with a single focus outline', async ({ page }) => {
  await page.goto(path);
  const content = page.locator('.lemoon-not-found');
  const links = content.getByRole('link');
  await expect(links).toHaveCount(4);
  await links.first().focus();
  for (let index = 0; index < 4; index += 1) {
    const link = links.nth(index);
    await expect(link).toBeFocused();
    await expect(content.locator(':focus-visible')).toHaveCount(1);
    const focus = await link.evaluate((element) => {
      const style = getComputedStyle(element);
      return { outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth, boxShadow: style.boxShadow };
    });
    expect(focus.outlineStyle).toBe('solid');
    expect(parseFloat(focus.outlineWidth)).toBeGreaterThanOrEqual(2);
    expect(focus.boxShadow).toBe('none');
    if (index < 3) await page.keyboard.press('Tab');
  }
});
