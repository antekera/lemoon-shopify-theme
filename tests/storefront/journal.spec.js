import {test,expect} from '@playwright/test';
import { openStorefrontPage } from '../helpers/storefront-page.mjs';
test('private draft renders its real article, reading time, guide and catalogue routes', async ({page}) => {
  test.skip(!process.env.ARTICLE_PREVIEW_URL, 'A fresh private draft preview URL is required; no article is published by this test.');
  const response = await page.goto(process.env.ARTICLE_PREVIEW_URL);
  expect(response.status()).toBe(200);
  await expect(page.locator('#MainContent h1')).toHaveText('Cómo elegir un armazón que se sienta tuyo');
  await expect(page.locator('#MainContent')).toContainText('Por Lemoon');
  await expect(page.locator('#MainContent')).toContainText('min de lectura');
  await expect(page.locator('#MainContent h2')).toHaveCount(7);
  await expect(page.locator('#MainContent a[href="/pages/como-medir-tus-lentes"]')).toBeVisible();
  await expect(page.locator('#MainContent a[href="/collections/all"]').last()).toBeVisible();
  await expect(page.locator('#MainContent a[href="/blogs/news"]').last()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test('empty Journal has recovery and requires explicit consent before native newsletter submission', async ({page}) => {
  await openStorefrontPage(page, '/blogs/news');
  await expect(page.locator('#MainContent h1')).toHaveText('Ver mejor también se aprende.');
  await expect(page.locator('.lemoon-journal__empty')).toBeVisible();
  const recovery = page.locator('.lemoon-journal__empty a');
  await expect(recovery).toHaveAttribute('href','/collections/all');
  expect(await recovery.evaluate(el => getComputedStyle(el).color)).toBe('rgb(255, 255, 255)');
  const form = page.locator('.lemoon-journal__newsletter form');
  const email = form.locator('input[type="email"]');
  const consent = form.locator('input[type="checkbox"]');
  await expect(consent).not.toBeChecked();
  await email.fill('synthetic@example.com');
  expect(await form.evaluate(form=>form.checkValidity())).toBe(false);
  await consent.check();
  expect(await form.evaluate(form=>form.checkValidity())).toBe(true);
  // No subscription is sent: verify native input contract without creating a customer.
  await expect(form).toHaveAttribute('method','post');
  await expect(form.locator('[name="contact[tags]"]')).toHaveValue('newsletter');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
