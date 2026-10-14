import { chromium } from '@playwright/test';
import { writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';

// Authenticate outside test traces. The temporary cookies never enter the repository.
export default async function setup(config) {
  const { baseURL, storageState } = config.projects[0].use;
  const origin = new URL(baseURL).origin;
  if (origin !== 'https://lemoon.cl') throw new Error('Preview authentication requires https://lemoon.cl');
  const themeId = process.env.STOREFRONT_PREVIEW_THEME_ID;
  if (!/^\d+$/.test(themeId)) throw new Error('A numeric preview theme ID is required');
  if (!process.env.SHOPIFY_FLAG_STORE_PASSWORD) process.loadEnvFile('.env');
  const password = process.env.SHOPIFY_FLAG_STORE_PASSWORD;
  if (!password) throw new Error('SHOPIFY_FLAG_STORE_PASSWORD is required');
  const browser = await chromium.launch({ headless: config.projects[0].use.headless ?? true });
  try {
    const context = await browser.newContext({
      locale: 'es-CL',
      ...(existsSync(storageState) ? { storageState } : {}),
    });
    const page = await context.newPage();
    const previewURL = `${origin}/?preview_theme_id=${themeId}`;
    const initial = await page.goto(previewURL);
    if (!initial.ok()) throw new Error(`Preview access returned HTTP ${initial.status()}`);
    if (new URL(page.url()).pathname === '/password') {
      await page.locator('password-modal summary').click();
      await page.locator('input[name="password"]').fill(password);
      const submitted = page.waitForResponse(response =>
        response.request().method() === 'POST' && new URL(response.url()).pathname === '/password');
      await page.locator('form.password-form button[name="commit"]').click();
      const response = await submitted;
      if (response.status() !== 302) throw new Error(`Preview authentication returned HTTP ${response.status()}`);
      await page.waitForURL(url => url.pathname !== '/password');
    }
    await page.goto(previewURL);
    const renderedThemeId = await page.evaluate(() => window.Shopify?.theme?.id);
    if (String(renderedThemeId) !== themeId) throw new Error('The requested preview theme was not selected');
    await writeFile(storageState, JSON.stringify(await context.storageState()), { mode: 0o600 });
  } catch (error) {
    await rm(storageState, { force: true });
    throw new Error(error.message.replaceAll(password, '[redacted]').replaceAll(encodeURIComponent(password), '[redacted]'));
  } finally {
    await browser.close();
  }
  return () => rm(storageState, { force: true });
}
