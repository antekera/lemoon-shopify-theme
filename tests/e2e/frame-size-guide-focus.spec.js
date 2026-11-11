import { expect, test } from '@playwright/test';

test('measurement guide has a visible keyboard underline without an outline', async ({ page, browserName }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/tests/fixtures/size-guide.html?shell=standard&scenario=missing');
  await page.getByRole('button', { name: 'Control anterior' }).focus();
  await page.keyboard.press(browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab');
  const guide = page.locator('[data-size-open]');
  await expect(guide).toBeFocused();
  await expect(guide).toHaveCSS('outline-style', 'none');
  await expect(guide).toHaveCSS('text-decoration-line', 'underline');
  await expect(guide).toHaveCSS('text-decoration-thickness', '3px');
  await page.keyboard.press('Enter');
  await expect(page.locator('dialog.lemoon-size-drawer')).toBeVisible();
});

test('optical shell remains interactive when a non-frame product has no size guide', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/tests/fixtures/eyewear-product.html', async route => {
    const response = await route.fetch();
    let html = await response.text();
    const row = /<div class="lemoon-pdp__size-row" data-frame-size>[\s\S]*?<\/button><\/div>/;
    const dialog = /<dialog class="lemoon-pdp__dialog lemoon-size-drawer" data-dialog="size"[\s\S]*?<\/dialog>/;
    expect(html).toMatch(row);
    expect(html).toMatch(dialog);
    html = html.replace(row, '').replace(dialog, '');
    await route.fulfill({ response, body: html });
  });
  await page.goto('/tests/fixtures/eyewear-product.html');
  await expect(page.locator('[data-frame-size], [data-dialog="size"]')).toHaveCount(0);
  await expect(page.locator('lemoon-eyewear')).toHaveJSProperty('ready', true);
  await expect(page.locator('[data-add]')).toBeEnabled();
  await page.getByLabel('Azul', { exact: true }).check();
  await expect(page.locator('[name="id"]').first()).toHaveValue('67616399720616');
  expect(errors).toEqual([]);
});
