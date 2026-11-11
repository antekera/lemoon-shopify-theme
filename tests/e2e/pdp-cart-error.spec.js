import { execFileSync } from 'node:child_process';
import { test, expect } from '@playwright/test';

const markup = execFileSync(process.execPath, ['tests/helpers/pdp-buy-renderer.mjs'], { encoding: 'utf8' });

for (const width of [390, 1440]) {
  test(`cart stock error preserves button position at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/tests/fixtures/mobile-search.html');
    await page.setContent(`<html lang="es"><head><style>html{font-size:62.5%}body{margin:0}.lemoon-standard-pdp{width:min(100% - 40px,600px);margin:80px auto}</style></head><body><div class="lemoon-standard-pdp"><div class="lemoon-pdp-buy-buttons">${markup}</div></div></body></html>`);
    for (const asset of ['lemoon-tokens.css', 'base.css', 'lemoon-components.css', 'section-main-product.css', 'lemoon-pdp-layout.css']) await page.addStyleTag({ url: `/assets/${asset}` });
    await page.evaluate(() => {
      window.routes = { cart_add_url: '/cart/add.js', cart_url: '/cart' };
      window.fetchConfig = () => ({ method: 'POST', headers: {} });
      window.PUB_SUB_EVENTS = { cartError: 'cart-error' };
      window.publish = () => Promise.resolve();
      window.CartPerformance = { measureFromEvent: () => {} };
    });
    let posts = 0;
    await page.route('**/cart/add.js', async route => {
      posts++;
      await route.fulfill({ status: 422, json: { status: 422, description: 'No puedes agregar más de este producto al carrito.' } });
    });
    await page.addScriptTag({ url: '/assets/product-form.js' });
    const button = page.locator('product-form').getByRole('button', { name: /agregar al carrito/i });
    const before = await button.boundingBox();
    await button.click();
    const alert = page.locator('product-form').getByRole('alert');
    await expect(alert).toBeVisible();
    await expect(alert).toContainText('No puedes agregar más de este producto al carrito.');
    const after = await button.boundingBox();
    expect(after.x).toBe(before.x);
    expect(after.y).toBe(before.y);
    expect(posts).toBe(1);
  });
}
