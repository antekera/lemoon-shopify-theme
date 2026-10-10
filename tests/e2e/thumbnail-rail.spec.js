import { test, expect } from '@playwright/test';

test('five standard PDP thumbnails fit without showing a scroll arrow', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/tests/fixtures/mobile-search.html');
  await page.setContent(`<product-info class="lemoon-standard-pdp"><div class="product"><div class="product__media-wrapper"><media-gallery><slider-component class="thumbnail-slider"><lemoon-thumbnail-rail>
    <button type="button" class="lemoon-thumbnail-arrow" data-rail-direction="up" disabled>Up</button>
    <ul class="thumbnail-list slider slider--tablet-up">${Array.from({ length: 5 }, (_, index) => `<li class="thumbnail-list__item slider__slide"><button class="thumbnail"${index === 0 ? ' aria-current="true"' : ''}>${index + 1}</button></li>`).join('')}</ul>
    <button type="button" class="lemoon-thumbnail-arrow" data-rail-direction="down" disabled>Down</button>
  </lemoon-thumbnail-rail></slider-component></media-gallery></div></div></product-info>`);
  for (const file of ['base.css', 'section-main-product.css', 'lemoon-pdp-layout.css']) {
    await page.addStyleTag({ path: `assets/${file}` });
  }
  await page.addScriptTag({ path: 'assets/lemoon-pdp-tools.js', type: 'module' });
  const rail = page.locator('lemoon-thumbnail-rail');
  const list = rail.locator('.thumbnail-list');
  await expect.poll(() => list.evaluate(element => element.scrollHeight - element.clientHeight)).toBe(0);
  await expect(rail.locator('[data-rail-direction="up"]')).toBeHidden();
  await expect(rail.locator('[data-rail-direction="down"]')).toBeHidden();
  const selected = list.locator('.thumbnail[aria-current]');
  await selected.click();
  await expect(selected).toHaveCSS('border-width', '1px');
  await expect(selected).toHaveCSS('box-shadow', 'none');
});

test('desktop shows five thumbnails and scrolls both ways without changing the product photo', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/tests/fixtures/eyewear-product.html');
  const rail = page.locator('lemoon-thumbnail-rail');
  const list = rail.locator('.lemoon-pdp__thumbnails');
  await list.evaluate((element) => {
    while (element.children.length < 7) {
      const thumbnail = element.children[1].cloneNode(true);
      thumbnail.setAttribute('aria-pressed', 'false');
      element.append(thumbnail);
    }
  });
  await expect(list).toHaveCSS('max-height', '310px');
  await expect(rail.locator('[data-rail-direction="up"]')).toBeHidden();
  await expect(rail.locator('[data-rail-direction="down"]')).toBeVisible();
  const first = list.locator('button').first();
  await expect(first).toHaveCSS('border-radius', '8px');
  await expect(first).toHaveCSS('border-width', '1px');
  expect(await page.locator('.lemoon-pdp__stage').evaluate(el => Math.round(el.getBoundingClientRect().left))).toBe(0);
  await rail.locator('[data-rail-direction="down"]').click();
  await expect.poll(() => list.evaluate(el => el.scrollTop)).toBe(64);
  await expect(rail.locator('[data-rail-direction="up"]')).toBeVisible();
  await rail.locator('[data-rail-direction="down"]').click();
  await expect.poll(() => list.evaluate(el => el.scrollTop)).toBe(128);
  await expect(rail.locator('[data-rail-direction="down"]')).toBeHidden();
  await expect(first).toHaveAttribute('aria-pressed', 'true');
  await rail.locator('[data-rail-direction="up"]').click();
  await expect.poll(() => list.evaluate(el => el.scrollTop)).toBe(64);
  await rail.locator('[data-rail-direction="up"]').click();
  await expect.poll(() => list.evaluate(el => el.scrollTop)).toBe(0);
  await expect(rail.locator('[data-rail-direction="up"]')).toBeHidden();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(rail.locator('[data-rail-direction="down"]')).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});


test('stops at the exact end after rapid clicks, including a partial final thumbnail', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/tests/fixtures/eyewear-product.html');
  const rail = page.locator('lemoon-thumbnail-rail');
  const list = rail.locator('.lemoon-pdp__thumbnails');
  await list.evaluate(el => {
    while (el.children.length < 8) el.append(el.children[1].cloneNode(true));
    el.style.maxHeight = '307px';
  });
  await rail.locator('[data-rail-direction=down]').evaluate(button => {
    for (let i = 0; i < 8; i++) button.click();
  });
  await expect.poll(() => list.evaluate(el => Math.abs(el.scrollTop - (el.scrollHeight - el.clientHeight)))).toBeLessThan(1);
  await expect(rail.locator('[data-rail-direction=down]')).toBeDisabled();
  const end = await list.evaluate(el => el.scrollTop);
  await rail.locator('[data-rail-direction=down]').evaluate(button => button.click());
  expect(await list.evaluate(el => el.scrollTop)).toBe(end);
});
