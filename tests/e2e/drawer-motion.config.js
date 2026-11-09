import { defineConfig } from '@playwright/test';

const port = Number(process.env.DRAWER_MOTION_PORT || 4192);
export default defineConfig({
  testDir: '.',
  testMatch: ['drawer-motion.spec.js'],
  outputDir: '../../test-results/drawer-motion',
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: { baseURL: `http://127.0.0.1:${port}`, trace: 'retain-on-failure' },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
  webServer: {
    command: `PORT=${port} node fixture-server.mjs`,
    url: `http://127.0.0.1:${port}/tests/fixtures/size-guide.html`,
    reuseExistingServer: true,
  },
});
