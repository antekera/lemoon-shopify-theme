import { defineConfig } from '@playwright/test';

const port = Number(process.env.PDP_INFORMATION_PORT || 4186);
export default defineConfig({
  testDir: '.',
  testMatch: ['pdp-information.spec.js'],
  outputDir: '../../test-results/pdp-information',
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: { baseURL: `http://127.0.0.1:${port}`, trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: {
    command: `PORT=${port} node fixture-server.mjs`,
    url: `http://127.0.0.1:${port}/tests/fixtures/mobile-search.html`,
    reuseExistingServer: false,
  },
});
