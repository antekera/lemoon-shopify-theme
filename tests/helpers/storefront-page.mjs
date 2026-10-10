import { expect } from '@playwright/test';

// Content flows start after a real privacy choice. Consent tests keep their own
// clean sessions and must not use this helper.
export async function openStorefrontPage(page, path) {
  const previewThemeId = process.env.STOREFRONT_PREVIEW_THEME_ID;
  if (!previewThemeId) return page.goto(path);

  const url = new URL(path, process.env.STOREFRONT_URL || 'http://127.0.0.1:9292');
  url.searchParams.set('preview_theme_id', previewThemeId);
  // Official Shopify preview option; no CSS or network interception of the bar.
  url.searchParams.set('pb', '0');
  const response = await page.goto(url.href);
  expect(response.status()).toBe(200);
  expect(String(await page.evaluate(() => window.Shopify?.theme?.id))).toBe(previewThemeId);

  const preferences = page.locator('.lemoon-footer__cookie-preferences');
  await preferences.focus();
  await preferences.press('Enter');
  const dialog = page.locator('[data-cookie-dialog]');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Rechazar todas', exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(page.locator('#shopify-pc__banner')).toBeHidden();
  return response;
}
