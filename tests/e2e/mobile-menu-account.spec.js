import { execFileSync } from 'node:child_process';
import { expect, test } from '@playwright/test';

const fixture = '/tests/fixtures/mobile-menu.html';
async function load(page, customer = 'guest') {
  const html = execFileSync(process.execPath, ['tests/helpers/mobile-nav-renderer.mjs', '', 'on', customer], { encoding: 'utf8' });
  await page.route(`**${fixture}`, route => route.fulfill({ contentType: 'text/html', body: html }));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(fixture);
}

for (const customer of ['guest', 'signed-in']) {
  test(`${customer}: correct account actions and no duplicate account link`, async ({ page }) => {
    await load(page, customer);
    await page.locator('[data-lemoon-nav-open]:visible').click();
    const dialog = page.getByRole('dialog', { name: 'Menú' });
    const account = dialog.getByRole('link', { name: 'Mi cuenta', exact: true });
    const login = dialog.getByRole('link', { name: 'Iniciar sesión', exact: true });
    const register = dialog.getByRole('link', { name: 'Crear cuenta', exact: true });
    if (customer === 'signed-in') {
      await expect(account).toHaveCount(1);
      await expect(account).toHaveAttribute('href', '/account');
      await expect(login).toHaveCount(0);
      await expect(register).toHaveCount(0);
    } else {
      await expect(account).toHaveCount(0);
      await expect(login).toHaveAttribute('href', '/account/login');
      await expect(register).toHaveAttribute('href', '/account/register');
    }
  });
}

test('menu uses header control for close and back; keyboard focus remains usable', async ({ page }) => {
  await load(page);
  const trigger = page.locator('[data-lemoon-nav-open]:visible');
  await trigger.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Menú' });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('[data-lemoon-nav-close]')).toHaveCount(0);
  await expect(dialog.locator('[data-lemoon-nav-controls]')).toHaveCount(0);
  const primary = dialog.locator('[data-lemoon-nav-target="opticos"]');
  await primary.focus();
  await page.keyboard.press('Enter');
  await expect(dialog.locator('[data-lemoon-nav-panel="opticos"]')).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-label', 'Volver atrás');
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(dialog.locator('[data-lemoon-nav-root]')).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-label', 'Cerrar menú');
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('primary links and buttons use natural case and requested order', async ({ page }) => {
  await load(page);
  await page.locator('[data-lemoon-nav-open]:visible').click();
  const primary = page.locator('.lemoon-mobile-nav__primary');
  const labels = primary.locator('.lemoon-mobile-nav__primary-button');
  await expect(labels).toHaveCount(5);
  await expect(labels).toHaveText(['Anteojos ópticos', 'Anteojos de sol', 'Cristales', 'Accesorios', 'Descubre tu estilo']);
  for (const item of await labels.all()) await expect(item).toHaveCSS('text-transform', 'none');
});

test('disabled accounts expose no account actions', async ({ page }) => {
  await load(page, 'disabled');
  await page.locator('[data-lemoon-nav-open]:visible').click();
  const dialog = page.getByRole('dialog', { name: 'Menú' });
  await expect(dialog.getByRole('link', { name: /^(Mi cuenta|Iniciar sesión|Crear cuenta)$/ })).toHaveCount(0);
});

test('keyboard can reach header control, return from submenu and close with Escape', async ({ page, browserName }) => {
  await load(page);
  const trigger = page.locator('[data-lemoon-nav-open]:visible');
  await trigger.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Menú' });
  await dialog.locator('[data-lemoon-nav-target="opticos"]').focus();
  await page.keyboard.press('Enter');
  await expect(dialog.locator('[data-lemoon-nav-panel="opticos"]')).toBeVisible();
  // Reach the header control through the keyboard's actual tab order.
  let reached = false;
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press(browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab');
    if (await trigger.evaluate(element => element === document.activeElement)) { reached = true; break; }
  }
  expect(reached).toBe(true);
  await page.keyboard.press('Enter');
  await expect(dialog.locator('[data-lemoon-nav-root]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});
