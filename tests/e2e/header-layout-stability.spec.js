import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

for (const width of [390, 1280]) {
  test(`announcement reserves its space before JavaScript and after rotation at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    let releaseScript;
    const scriptReady = new Promise(resolve => { releaseScript = resolve; });
    await page.route('**/assets/global.js', async route => { await scriptReady; await route.continue(); });
    const html = (await readFile('tests/fixtures/announcement-bar.html', 'utf8'))
      .replace('</head>', '<style>html{font-size:10px}body{margin:0;--font-body-scale:1;--lemoon-font-body:Arial,sans-serif}</style></head>')
      .replace('First announcement', 'Envío gratis a todo Chile en compras sobre $70.000')
      .replace('</body>', '<main>Contenido de la página</main></body>');
    await page.route('**/tests/fixtures/announcement-bar.html', route => route.fulfill({ contentType: 'text/html', body: html }));
    await page.goto('/tests/fixtures/announcement-bar.html', { waitUntil: 'commit' });
    await expect(page.locator('main')).toBeVisible();
    const initialTop = await page.locator('main').evaluate(el => el.getBoundingClientRect().top);
    expect(initialTop).toBeGreaterThanOrEqual(44);
    releaseScript();
    await page.waitForLoadState('load');
    expect(await page.locator('main').evaluate(el => el.getBoundingClientRect().top)).toBe(initialTop);
    await page.locator('.slider-button--next').click();
    await expect(page.locator('#Slide-fixture-2')).toHaveAttribute('aria-hidden', 'false');
    expect(await page.locator('main').evaluate(el => el.getBoundingClientRect().top)).toBe(initialTop);
  });
}
