import { defineConfig } from '@playwright/test';
const port = Number(process.env.SIZE_GUIDE_PORT || 4189);
export default defineConfig({
  testDir: '.', testMatch: ['size-guide.spec.js', 'size-guide-page.spec.js', 'eyewear-product.spec.js'], workers: 1, retries: 0,
  reporter: [['list']], use: { baseURL: `http://127.0.0.1:${port}`, trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: { command: `PORT=${port} node fixture-server.mjs`, url: `http://127.0.0.1:${port}/tests/fixtures/size-guide.html`, reuseExistingServer: true },
});
