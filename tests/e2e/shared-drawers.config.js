import { defineConfig } from '@playwright/test';
const port = Number(process.env.SHARED_DRAWER_PORT || 4192);
export default defineConfig({
  testDir: '.', testMatch: ['shared-drawers.spec.js'], workers: 1, retries: 0,
  reporter: [['list']], use: { baseURL: `http://127.0.0.1:${port}`, trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: { command: `PORT=${port} node fixture-server.mjs`, url: `http://127.0.0.1:${port}/tests/fixtures/shared-drawers.html`, reuseExistingServer: true },
});
