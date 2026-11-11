import { execFileSync } from 'node:child_process';
import { expect, test } from '@playwright/test';

for (const enabled of [true, false]) {
  test(`editor setting ${enabled ? 'enables' : 'disables'} the menu wishlist without duplicating it in search`, async ({ page, context }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const mode = enabled ? 'on' : 'off';
    const nav = execFileSync(process.execPath, ['tests/helpers/mobile-nav-renderer.mjs', '', mode], { encoding: 'utf8' });
    const search = execFileSync(process.execPath, ['tests/helpers/search-renderer.mjs', mode], { encoding: 'utf8' });
    await page.route('**/tests/fixtures/mobile-menu.html', route => route.fulfill({ contentType: 'text/html', body: nav }));
    await page.goto('/tests/fixtures/mobile-menu.html');
    const trigger = page.locator('[data-lemoon-nav-open]').filter({ visible: true });
    await trigger.focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog', { name: 'Menú' });
    const wishlist = dialog.getByRole('link', { name: 'Mis favoritos', exact: true });
    await expect(wishlist).toHaveCount(enabled ? 1 : 0);
    if (enabled) {
      await expect(wishlist).toHaveAttribute('href', '/apps/page/wishlist');
      await page.route('**/apps/page/wishlist', route => route.fulfill({ contentType: 'text/html', body: '<h1>Lista simulada</h1>' }));
      await wishlist.focus();
      await page.keyboard.press('Enter');
      await expect(page.getByRole('heading', { name: 'Lista simulada' })).toBeVisible();
    } else {
      await page.keyboard.press('Escape');
      await expect(trigger).toBeFocused();
    }
    const searchPage = await context.newPage();
    await searchPage.setViewportSize({ width: 390, height: 844 });
    await searchPage.route('**/tests/fixtures/mobile-search.html', route => route.fulfill({ contentType: 'text/html', body: search }));
    await searchPage.goto('/tests/fixtures/mobile-search.html');
    await searchPage.locator('[data-lemoon-search-open]').filter({ visible: true }).click();
    const searchDialog = searchPage.getByRole('dialog', { name: 'Buscar productos' });
    await expect(searchDialog).toBeVisible();
    await expect(searchDialog.getByRole('link', { name: 'Mis favoritos', exact: true })).toHaveCount(0);
    await expect(searchDialog.getByRole('link', { name: 'Envíos y entregas' })).toBeVisible();
    await searchPage.close();
  });
}
