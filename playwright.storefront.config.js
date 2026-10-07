import { defineConfig } from '@playwright/test';

// These tests exercise Shopify-rendered Liquid and real section responses.
// Keep them separate from the deterministic component fixtures in npm test.
export default defineConfig({
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
