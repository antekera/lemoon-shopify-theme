import { test, expect } from '@playwright/test';
import { openStorefrontPage } from '../helpers/storefront-page.mjs';

test('contact offers one Spanish heading, native fields and working help route', async ({ page }) => {
  await openStorefrontPage(page, '/pages/contact');
  await expect(page.locator('#MainContent h1:visible')).toHaveCount(1);
  await expect(page.locator('#MainContent h1')).toHaveText('Conversemos');
  const form = page.locator('#MainContent form[action*="/contact"]');
  await expect(form).toHaveAttribute('method', 'post');
  await expect(form.locator('[name="contact[name]"]')).toHaveAttribute('required', '');
  await expect(form.locator('[name="contact[email]"]')).toHaveAttribute('type', 'email');
  await expect(form.locator('[name="contact[body]"]')).toHaveAttribute('required', '');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const help = page.locator('#MainContent a[href="/pages/preguntas-frecuentes"]');
  await help.click();
  await expect(page).toHaveURL(/\/pages\/preguntas-frecuentes$/);
});

test('required fields prevent empty submission and accept a Chilean phone number', async ({ page }) => {
  // No message is sent: this verifies native validation before a request exists.
  await page.route('**/contact', (route) => {
    if (route.request().method() === 'POST') throw new Error('Contact validation must not send a message');
    return route.continue();
  });
  await openStorefrontPage(page, '/pages/contact');
  const form = page.locator('#MainContent form[action*="/contact"]');
  const name = form.locator('[name="contact[name]"]');
  await form.locator('button[type="submit"]').click();
  await expect(name).toBeFocused();
  expect(await form.evaluate((element) => element.checkValidity())).toBe(false);
  await name.fill('Prueba local');
  const email = form.locator('[name="contact[email]"]');
  await email.fill('correo-invalido');
  const phone = form.locator('[name="contact[phone]"]');
  await phone.fill('+56 9 1234 5678');
  expect(await phone.evaluate((element) => element.checkValidity())).toBe(true);
  await form.locator('[name="contact[body]"]').fill('Consulta de validación local; no enviar.');
  expect(await email.evaluate((element) => element.validity.typeMismatch)).toBe(true);
  await email.fill('prueba@example.com');
  expect(await form.evaluate((element) => element.checkValidity())).toBe(true);
});
