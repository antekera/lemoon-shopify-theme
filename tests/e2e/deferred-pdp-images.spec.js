import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

for (const width of [1280, 390]) {
  test(`gallery waits to request hidden photos until selected at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    let html = await readFile('tests/fixtures/eyewear-product.html', 'utf8');
    let imageIndex = 0;
    html = html.replace(/(<div data-media-panel="[^"]+"[^>]*><button[^>]*>)([\s\S]*?)(<\/button><\/div>)/g, (match, before, image, after) => {
      imageIndex++;
      const tag = image.replace(/src="[^"]*"/, `src="/assets/lemoon-product-fallback.png?gallery=${imageIndex}"`).replace(/srcset="[^"]*"/g, '').replace(/loading="[^"]*"/, 'loading="eager"');
      return before + (imageIndex <= 2 ? tag : `<lemoon-deferred-image><template>${tag}</template></lemoon-deferred-image>`) + after;
    });
    const requested = new Set();
    page.on('request', (request) => { const id = new URL(request.url()).searchParams.get('gallery'); if (id) requested.add(id); });
    await page.route('**/tests/fixtures/eyewear-product.html', route => route.fulfill({ contentType: 'text/html', body: html }));
    await page.goto('/tests/fixtures/eyewear-product.html');
    await expect.poll(() => requested.has('1') && requested.has('2')).toBe(true);
    expect(requested.has('3')).toBe(false);
    expect(requested.has('4')).toBe(false);
    if (width < 750) await page.locator('.lemoon-pdp__stage').evaluate(el => el.scrollTo({ left: 2 * el.clientWidth, behavior: 'instant' }));
    else await page.locator('[data-media-target="46280637907112"]').click();
    await expect.poll(() => requested.has('3')).toBe(true);
    expect(requested.has('4')).toBe(false);
    await expect(page.locator('[data-media-panel="46280637907112"] img')).toBeVisible();
  });
}
