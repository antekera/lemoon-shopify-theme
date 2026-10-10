import { test, expect } from '@playwright/test';

for (const viewport of [{ width: 1280, height: 720 }, { width: 390, height: 844 }]) {
  test(`sticky purchase keeps only the shared lens action at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/tests/fixtures/eyewear-product.html');
    const sticky = page.locator('lemoon-sticky-purchase');
    await expect(sticky).toBeHidden();
    await page.locator('lemoon-eyewear').evaluate((host) => {
      const content = document.createElement('div');
      content.style.height = '1500px';
      host.append(content);
    });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(sticky).toBeVisible();
    await expect(sticky.locator('[data-sticky-price]')).toHaveText('$39.900');
    await expect(sticky.locator('[data-sticky-add]')).toHaveCount(0);
    await expect(sticky.locator('[data-sticky-configure]')).toHaveText('Seleccionar lentes y comprar');
    await expect(sticky.locator('[data-sticky-configure]')).toHaveCSS('text-transform', 'none');
    await expect(sticky.locator('[data-sticky-configure]')).toHaveCSS('font-size', '16px');
    await expect(sticky.locator('[data-sticky-configure]')).toHaveCSS('font-weight', '400');
    await expect(page.locator('[data-configure]')).toHaveCSS('text-transform', 'none');
    await expect(page.locator('[data-configure]')).toHaveCSS('font-size', '16px');
    await expect(page.locator('[data-configure]')).toHaveCSS('font-weight', '400');
    await expect(page.locator('[data-frame-only-add]')).toHaveCSS('font-size', '16px');
    await expect(page.locator('[data-frame-only-add]')).toHaveCSS('font-weight', '400');
    await expect(page.locator('[data-frame-only-add]')).toHaveCSS('text-transform', 'none');
    if (viewport.width < 750) await expect.poll(() => sticky.evaluate((bar) => Math.round(bar.getBoundingClientRect().bottom))).toBe(viewport.height);
    else await expect.poll(() => sticky.evaluate((bar) => Math.round(bar.getBoundingClientRect().top))).toBe(72);
    await sticky.locator('[data-sticky-configure]').click();
    await expect(page.locator('[data-flow-title]')).toBeFocused();
    await expect(page.locator('[data-lens-panel]')).toBeVisible();
    await page.getByLabel('Delgado 1.67', { exact: true }).check();
    await page.getByLabel('Ingresar receta ahora', { exact: true }).check();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(sticky).toBeVisible();
    await expect(sticky.locator('[data-sticky-price]')).toHaveText('$84.900');
    await expect(sticky.locator('[data-sticky-configure]')).toBeVisible();
  });
}

test('mobile sticky bar slides in and meets the footer without a gap', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/tests/fixtures/eyewear-product.html');
  const sticky = page.locator('lemoon-sticky-purchase');
  await expect(sticky).toBeHidden();
  await page.evaluate(() => {
    const footer = document.createElement('footer');
    footer.style.height = '400px';
    document.body.append(footer);
  });
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await expect(sticky).toBeVisible();
  await expect(sticky).toHaveCSS('transition-duration', '0.3s, 0.3s, 0s');
  await expect.poll(() => sticky.evaluate(el => Math.round(el.getBoundingClientRect().bottom))).toBe(844);
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await expect.poll(() => page.evaluate(() => {
    const footerBottom = document.querySelector('footer').getBoundingClientRect().bottom;
    const stickyTop = document.querySelector('lemoon-sticky-purchase').getBoundingClientRect().top;
    return Math.abs(footerBottom - stickyTop);
  })).toBeLessThan(1);
  await page.evaluate(() => scrollTo(0, 0));
  await expect(sticky).toBeHidden();
  await expect.poll(() => sticky.evaluate(el => el.getBoundingClientRect().top)).toBeGreaterThanOrEqual(844);
});
