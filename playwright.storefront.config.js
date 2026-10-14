import { defineConfig } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const previewThemeId = process.env.STOREFRONT_PREVIEW_THEME_ID;
if (previewThemeId) {
  process.env.STOREFRONT_STORAGE_STATE ||= join(tmpdir(), `lemoon-storefront-${randomUUID()}.json`);
}

// These tests exercise Shopify-rendered Liquid and real section responses.
// Keep them separate from the deterministic component fixtures in npm test.
export default defineConfig({
  globalSetup: previewThemeId ? './tests/helpers/storefront-auth.mjs' : undefined,
  testDir: './tests/storefront',
  forbidOnly: Boolean(process.env.CI),
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  outputDir: 'test-results/storefront',
  reporter: [['list'], ['html', { outputFolder: 'playwright-report/storefront', open: 'never' }]],
  use: {
    browserName: 'chromium',
    baseURL: process.env.STOREFRONT_URL || 'http://127.0.0.1:9292',
    storageState: previewThemeId ? process.env.STOREFRONT_STORAGE_STATE : undefined,
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'tablet', use: { viewport: { width: 820, height: 1180 } } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
});
