import { test, expect } from '@playwright/test';
// Shopify's editor sample: this route does not issue gift card credit.
const route = '/gift_cards/123456/preview';
async function openCard(page) {
  const response = await page.goto(route);
  expect(response.status()).toBe(200);
  expect(new URL(response.url()).pathname).toBe('/gift_cards/123456/preview');
  await expect(page.locator('body.gift-card')).toBeVisible();
}
test('native sample renders balance, full code, QR and store actions', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await openCard(page);
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.locator('.gift-card__price')).toHaveText('$100');
  await expect(page.locator('#gift-card-code')).toHaveText('A1B2 3C4D 5E6F 7G8H');
  await expect(page.locator('.gift-card__qr-code img')).toBeVisible();
  await page.locator('.gift-card__copy-button').click();
  await expect(page.getByRole('status')).not.toBeEmpty();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('A1B23C4D5E6F7G8H');
  await expect(page.locator('.gift-card__print-button')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test('native sample stays usable without JavaScript', async ({ browser, baseURL, viewport, storageState }) => {
  const context = await browser.newContext({ baseURL, viewport, storageState, javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await openCard(page);
    await expect(page.locator('#gift-card-code')).toHaveText('A1B2 3C4D 5E6F 7G8H');
    await expect(page.locator('.gift-card__actions a')).toBeVisible();
    await expect(page.locator('.gift-card__copy-button')).toBeHidden();
    await expect(page.locator('.gift-card__print-button')).toBeHidden();
  } finally { await context.close(); }
});
