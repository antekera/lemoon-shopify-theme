import { defineConfig } from '@playwright/test';
import base from './playwright.config.js';

export default defineConfig({
  ...base,
  outputDir: './test-results/cross-browser',
  reporter: [['list']],
  workers: process.env.CI ? 1 : 3,
  projects: [
    { name: 'webkit', use: { browserName: 'webkit' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
  ],
});
