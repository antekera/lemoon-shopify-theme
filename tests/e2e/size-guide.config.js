import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: '.', testMatch: 'size-guide.spec.js', workers: 1, retries: 0,
  reporter: [['list']], use: { baseURL: 'http://127.0.0.1:4189', trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: { command: 'PORT=4189 node fixture-server.mjs', url: 'http://127.0.0.1:4189/tests/fixtures/size-guide.html', reuseExistingServer: true },
});
