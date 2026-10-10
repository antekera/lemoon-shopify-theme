import { test, expect } from '@playwright/test';

test('disables the lens action for an unavailable variant and restores it for an available colour', async ({ page }) => {
  await page.route('**/tests/fixtures/eyewear-product.html', async route => {
    const response = await route.fetch();
    const html = (await response.text()).replace('"available":true', '"available":false');
    await route.fulfill({ response, body: html });
  });
  await page.goto('/tests/fixtures/eyewear-product.html');
  const configure = page.locator('[data-configure]');
  await expect(configure).toBeDisabled();
  await expect(configure).toHaveText('Agotado');
  await expect(page.locator('[data-pdp-status]')).toBeVisible();
  await expect(page.locator('[data-status-sold-out]')).toBeVisible();
  await expect(page.locator('[data-status-sale]')).toBeHidden();
  await expect(configure).toHaveCSS('background-color', 'rgb(232, 234, 237)');
  await page.getByRole('radio', { name: 'Azul', exact: true }).check();
  await expect(configure).toBeEnabled();
  await expect(configure).toHaveText('Seleccionar lentes y comprar');
  await expect(page.locator('[data-pdp-status]')).toBeHidden();
  await expect(configure).toHaveCSS('background-color', 'rgb(247, 230, 0)');
});

test('shows a sale tag above the title for a discounted variant', async ({ page }) => {
  await page.route('**/tests/fixtures/eyewear-product.html', async route => {
    const response = await route.fetch();
    const html = (await response.text()).replace('"formattedCompare":null', '"formattedCompare":"$49.900"');
    await route.fulfill({ response, body: html });
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/tests/fixtures/eyewear-product.html');
  const summary = page.locator('.lemoon-mobile-summary');
  const status = summary.locator('[data-pdp-status]');
  await expect(status).toBeVisible();
  await expect(status.locator('[data-status-sale]')).toHaveText('Oferta');
  await expect(status.locator('[data-status-sold-out]')).toBeHidden();
  const title = await summary.locator('h1').boundingBox();
  const badge = await status.boundingBox();
  expect(badge.y + badge.height).toBeLessThanOrEqual(title.y);
});
