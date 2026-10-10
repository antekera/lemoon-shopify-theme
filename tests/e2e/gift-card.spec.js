import { test, expect } from '@playwright/test';
const route = '/tests/fixtures/gift-card.html';

for (const width of [320, 390, 820, 1440]) {
  test(`gift card at ${width}px keeps the code and actions within the viewport`, async ({ page, context }) => {
    await page.setViewportSize({ width, height: 900 });
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tu tarjeta de regalo');
    await expect(page.locator('.gift-card__price')).toHaveText('$100');
    const copy = page.getByRole('button', { name: 'Copiar el código de la tarjeta de regalo' });
    await copy.focus();
    await copy.press('Enter');
    await expect(page.getByRole('status')).toHaveText('El código se copió correctamente');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('A1B23C4D5E6F7G8H');
    await expect(copy).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole('link', { name: 'Visitar la tienda online' })).toHaveAttribute('href', 'https://lemoon.cl');
  });
}

test('denied clipboard access displays a manual-copy message and keeps the code visible', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: async () => { throw new DOMException('Denied', 'NotAllowedError'); } },
  }));
  await page.goto(route);
  await page.getByRole('button', { name: 'Copiar el código de la tarjeta de regalo' }).click();
  await expect(page.getByRole('status')).toHaveText('No pudimos copiarlo. Selecciona el código para copiarlo.');
  await expect(page.locator('#gift-card-code')).toHaveText('A1B2 3C4D 5E6F 7G8H');
  await expect(page.getByRole('button', { name: 'Copiar el código de la tarjeta de regalo' })).toBeEnabled();
});

test('printing keeps balance and code while hiding interactive actions', async ({ page }) => {
  await page.goto(route);
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.gift-card__price')).toBeVisible();
  await expect(page.locator('#gift-card-code')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Copiar el código de la tarjeta de regalo' })).toBeHidden();
  await expect(page.getByRole('button', { name: 'Imprimir tarjeta' })).toBeHidden();
  await expect(page.getByRole('link', { name: 'Visitar la tienda online' })).toBeHidden();
});

test('without JavaScript the code and store link work without inert copy or print controls', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto(route);
    await expect(page.locator('#gift-card-code')).toHaveText('A1B2 3C4D 5E6F 7G8H');
    await expect(page.getByRole('link', { name: 'Visitar la tienda online' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copiar el código de la tarjeta de regalo' })).toBeHidden();
    await expect(page.getByRole('button', { name: 'Imprimir tarjeta' })).toBeHidden();
  } finally { await context.close(); }
});
