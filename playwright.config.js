import { defineConfig } from '@playwright/test';

const fixturePort = process.env.LEMOON_FIXTURE_PORT || '4173';
const fixtureURL = `http://127.0.0.1:${fixturePort}`;

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.js',
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    [process.env.CI ? 'list' : 'line'],
    ['html', { open: 'never' }],
  ],
  use: {
    baseURL: fixtureURL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: {
    command: 'node tests/e2e/fixture-server.mjs',
    url: `${fixtureURL}/tests/fixtures/mobile-search.html`,
    reuseExistingServer: !process.env.CI,
    timeout: 10_000,
  },
});
