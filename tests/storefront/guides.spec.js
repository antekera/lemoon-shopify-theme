import { test, expect } from '@playwright/test';
import { openStorefrontPage } from '../helpers/storefront-page.mjs';
const guides = [
  ['como-medir-tus-lentes','guia-medidas','measurements'],
  ['elegir-lentes-segun-tu-rostro','guia-rostro','face'],
  ['como-hacer-tu-pedido','guia-pedido','order'],
  ['como-usar-probador-virtual','guia-probador','try_on'],
  ['como-enviar-prescripcion','guia-prescripcion','prescription'],
];
for (const [handle,view,kind] of guides) test(`guide ${kind} renders its real instructions, anchor index and help routes`, async ({page}) => {
  await openStorefrontPage(page, `/pages/${handle}?view=${view}`);
  const guide = page.locator(`[data-guide-kind="${kind}"]`);
  await expect(guide).toBeVisible();
  await expect(page.locator('#MainContent h1')).toHaveCount(1);
  await expect(guide.locator('.lemoon-guide__step')).toHaveCount(3);
  const anchor = guide.locator('nav a').first();
  await anchor.focus(); await expect(anchor).toBeFocused(); await anchor.press('Enter');
  await expect.poll(() => new URL(page.url()).hash).toContain('#Guide-');
  await expect(guide.locator('a[href="/pages/contact"]')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await guide.locator('a[href="/collections/all"]').click();
  await expect(page).toHaveURL(/\/collections\/all$/);
});
