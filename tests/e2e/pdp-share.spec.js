import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';

function headingFixture() {
  const heading = execFileSync(process.execPath, ['--input-type=module', '-e', `
    import { createComponentEngine } from './tests/helpers/component-library-renderer.mjs';
    const engine = createComponentEngine();
    process.stdout.write(engine.renderFileSync('lemoon-product-heading', {
      product: { id: 123, url: '/products/marco', title: 'Marco de prueba', selected_or_first_available_variant: { available: true, price: 1000 } },
      request: { origin: 'https://lemoon.cl' },
      shop: { metafields: {} },
    }));
  `], { encoding: 'utf8' });
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/assets/base.css"><link rel="stylesheet" href="/assets/lemoon-tokens.css"><link rel="stylesheet" href="/assets/lemoon-pdp-layout.css"></head><body>${heading}<script type="module" src="/assets/lemoon-pdp-tools.js"></script></body></html>`;
}

async function openProduct(page, mode = 'share', width = 1440) {
  await page.setViewportSize({ width, height: 900 });
  await page.addInitScript(mode => {
    window.shareCalls = [];
    window.copyCalls = [];
    Object.defineProperty(navigator, 'share', { configurable: true, value: mode === 'clipboard' || mode === 'copy-error' ? undefined : async data => {
      window.shareCalls.push(data);
      if (mode === 'cancel') throw new DOMException('Cancelled', 'AbortError');
      if (mode === 'share-error') throw new Error('Share unavailable');
    } });
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async text => {
      window.copyCalls.push(text);
      if (mode === 'copy-error') throw new Error('Clipboard unavailable');
    } } });
  }, mode);
  await page.route('**/products/marco?**', route => route.fulfill({ contentType: 'text/html; charset=utf-8', body: headingFixture() }));
  await page.goto('/products/marco?variant=42&pb=0&preview_theme_id=123');
}

const expectedUrl = 'https://lemoon.cl/products/marco?variant=42';

test('share is desktop-only and remains hidden until its controller loads', async ({ page }) => {
  await openProduct(page);
  const share = page.getByRole('button', { name: 'Compartir este producto' });
  await expect(share).toBeVisible();
  await page.setViewportSize({ width: 749, height: 900 });
  await expect(share).toBeHidden();
  await page.setViewportSize({ width: 750, height: 900 });
  await expect(share).toBeVisible();
  const raw = headingFixture();
  expect(raw).toMatch(/data-product-share[^>]* hidden/);
});

test('Web Share receives the product title and current variant without preview parameters', async ({ page }) => {
  await openProduct(page);
  const share = page.getByRole('button', { name: 'Compartir este producto' });
  await share.focus();
  await page.keyboard.press('Enter');
  await expect.poll(() => page.evaluate(() => window.shareCalls)).toEqual([{ title: 'Marco de prueba', url: expectedUrl }]);
  expect(await page.evaluate(() => window.copyCalls)).toEqual([]);
});

test('sharing follows variant changes and supports products without a variant parameter', async ({ page }) => {
  await openProduct(page, 'clipboard');
  const share = page.getByRole('button', { name: 'Compartir este producto' });
  await page.evaluate(() => history.replaceState({}, '', '/products/marco?variant=99&pb=0'));
  await share.click();
  await expect.poll(() => page.evaluate(() => window.copyCalls)).toEqual(['https://lemoon.cl/products/marco?variant=99']);
  await page.evaluate(() => history.replaceState({}, '', '/products/marco?pb=0'));
  await share.click();
  await expect.poll(() => page.evaluate(() => window.copyCalls)).toEqual(['https://lemoon.cl/products/marco?variant=99', 'https://lemoon.cl/products/marco']);
});

test('copy fallback reports success accessibly when Web Share is unavailable', async ({ page }) => {
  await openProduct(page, 'clipboard');
  const heading = page.locator('lemoon-product-tools');
  const before = await heading.boundingBox();
  await page.getByRole('button', { name: 'Compartir este producto' }).click();
  await expect.poll(() => page.evaluate(() => window.copyCalls)).toEqual([expectedUrl]);
  const status = page.getByRole('status');
  await expect(status).toHaveAttribute('aria-live', 'polite');
  await expect(status).toHaveText('Enlace copiado al portapapeles');
  const visuallyHidden = await status.evaluate(el => {
    const box = el.getBoundingClientRect();
    const css = getComputedStyle(el);
    return box.width <= 1 && box.height <= 1 && css.position === 'absolute';
  });
  expect(visuallyHidden).toBe(true);
  expect((await heading.boundingBox()).height).toBe(before.height);
  await expect(page.getByRole('textbox', { name: 'Enlace' })).toBeHidden();
});

test('cancelling native share never copies or announces a false success', async ({ page }) => {
  await openProduct(page, 'cancel');
  await page.getByRole('button', { name: 'Compartir este producto' }).click();
  await expect.poll(() => page.evaluate(() => window.shareCalls.length)).toBe(1);
  expect(await page.evaluate(() => window.copyCalls)).toEqual([]);
  await expect(page.getByRole('status')).toBeEmpty();
  await expect(page.locator('[data-product-share-fallback]')).toBeHidden();
});

test('a failed clipboard exposes the selected URL with an accessible error', async ({ page }) => {
  await openProduct(page, 'copy-error');
  await page.getByRole('button', { name: 'Compartir este producto' }).click();
  const fallback = page.getByRole('textbox', { name: 'Enlace' });
  await expect(fallback).toBeVisible();
  await expect(fallback).toHaveValue(expectedUrl);
  await expect(fallback).toBeFocused();
  expect(await fallback.evaluate(el => [el.selectionStart, el.selectionEnd])).toEqual([0, expectedUrl.length]);
  await expect(page.getByRole('status')).toHaveText('No pudimos copiar el enlace. Selecciónalo para copiarlo.');
  await expect(page.getByRole('status')).toBeVisible();
});

test('a clipboard failure after success shows the error instead of keeping it visually hidden', async ({ page }) => {
  await openProduct(page, 'clipboard');
  const share = page.getByRole('button', { name: 'Compartir este producto' });
  const status = page.getByRole('status');
  await share.click();
  await expect(status).toHaveText('Enlace copiado al portapapeles');
  await page.evaluate(() => { navigator.clipboard.writeText = async () => { throw new Error('Clipboard unavailable'); }; });
  await share.click();
  await expect(status).toHaveText('No pudimos copiar el enlace. Selecciónalo para copiarlo.');
  await expect(status).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Enlace' })).toBeVisible();
});

test('desktop share and favourite icons stay aligned and sharing turns yellow on hover', async ({ page }) => {
  await openProduct(page);
  const slot = page.locator('[data-product-favourite-slot]');
  await slot.evaluate(el => {
    el.innerHTML = '<div class="Vtl-WishlistIcon__ProductPageWrapper"><div role="button" tabindex="0" aria-label="Añadir a favoritos" class="Vtl-WishlistButton__WishlistIconButton"><svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="M1 1h18v18H1z"></path></svg></div></div>';
  });
  const share = page.getByRole('button', { name: 'Compartir este producto' });
  const favourite = page.getByRole('button', { name: 'Añadir a favoritos' });
  const shareBox = await share.boundingBox();
  const favouriteBox = await favourite.boundingBox();
  expect(shareBox.width).toBeGreaterThanOrEqual(44);
  expect(favouriteBox.width).toBeGreaterThanOrEqual(44);
  expect(Math.abs((shareBox.y + shareBox.height / 2) - (favouriteBox.y + favouriteBox.height / 2))).toBeLessThanOrEqual(2);
  expect(favouriteBox.x - (shareBox.x + shareBox.width)).toBeLessThanOrEqual(8);
  await share.hover();
  await expect(share).toHaveCSS('color', 'rgb(247, 230, 0)');
  await expect(share.locator('svg')).toHaveCSS('color', 'rgb(247, 230, 0)');
});

test('unexpected native share errors fall back to copying', async ({ page }) => {
  await openProduct(page, 'share-error');
  await page.getByRole('button', { name: 'Compartir este producto' }).click();
  await expect.poll(() => page.evaluate(() => window.copyCalls)).toEqual([expectedUrl]);
  await expect(page.getByRole('status')).toHaveText('Enlace copiado al portapapeles');
});
