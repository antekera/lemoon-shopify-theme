import { execFileSync } from 'node:child_process';
import { expect, test } from '@playwright/test';

const render = (id = '') => execFileSync(process.execPath, ['tests/helpers/mobile-nav-renderer.mjs', id], { encoding: 'utf8' });
const open = async page => { await page.locator('[data-lemoon-nav-open]').filter({ visible: true }).focus(); await page.keyboard.press('Enter'); };
async function load(page, id = '') {
  await page.route('**/tests/fixtures/mobile-menu.html', route => route.fulfill({ contentType: 'text/html', body: render(id) }));
  await page.goto('/tests/fixtures/mobile-menu.html');
}

for (const width of [390, 1280]) {
  test(`configured entries stay hidden while menu navigation remains available at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await load(page);
    await open(page);
    const dialog = page.getByRole('dialog', { name: 'Menú' });
    await expect(dialog).toBeVisible();
    for (const name of ['Más vendidos', 'Nueva colección', 'Envíos y retornos']) await expect(dialog.getByRole('link', { name, exact: true })).toHaveCount(0);
    await expect(dialog.getByRole('link', { name: 'Preguntas frecuentes' })).toHaveAttribute('href', '/pages/preguntas-frecuentes');
    await expect(dialog.getByRole('link', { name: 'Accesorios', exact: true })).toHaveAttribute('href', '/collections/accesorios');
    for (const slot of ['opticos', 'sol']) {
      await dialog.locator(`[data-lemoon-nav-target="${slot}"]`).click();
      const panel = dialog.locator(`[data-lemoon-nav-panel="${slot}"]`);
      await expect(panel).toBeVisible();
      await expect(panel.getByRole('link', { name: 'Ver todo' })).toBeVisible();
      await expect(panel.getByRole('link', { name: 'Más vendidos', exact: true })).toHaveCount(0);
      await expect(panel.getByRole('link', { name: 'Nueva colección', exact: true })).toHaveCount(0);
      await page.locator('[data-lemoon-nav-open]').filter({ visible: true }).click();
      await expect(dialog.locator('[data-lemoon-nav-root]')).toBeVisible();
    }
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(page.locator('[data-lemoon-nav-open]').filter({ visible: true })).toBeFocused();
  });
}

for (const [id, title, parent] of [
  ['vendidos', 'Más vendidos', null], ['nueva', 'Nueva colección', null], ['envios', 'Envíos y retornos', null],
  ['mas_vendidos', 'Más vendidos', 'opticos'], ['nueva_coleccion', 'Nueva colección', 'opticos'],
  ['sol_mas_vendidos', 'Más vendidos', 'sol'], ['sol_nueva_coleccion', 'Nueva colección', 'sol'],
]) {
  test(`the ${id} editor option restores only its configured link`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await load(page, id);
    await open(page);
    const dialog = page.getByRole('dialog', { name: 'Menú' });
    if (parent) await dialog.locator(`[data-lemoon-nav-target="${parent}"]`).click();
    const panel = parent ? dialog.locator(`[data-lemoon-nav-panel="${parent}"]`) : dialog.locator('[data-lemoon-nav-root]');
    await expect(panel.getByRole('link', { name: title, exact: true })).toBeVisible();
    await expect(panel.getByRole('link', { name: title, exact: true })).toHaveAttribute('href', /\S+/);
    for (const other of ['Más vendidos', 'Nueva colección', 'Envíos y retornos'].filter(name => name !== title)) await expect(dialog.getByRole('link', { name: other, exact: true })).toHaveCount(0);
  });
}
