import { test, expect } from '@playwright/test';

async function openGallery(page, count) {
  await page.goto('/tests/fixtures/mobile-search.html');
  await page.route('**/gallery-photo.svg', route => route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="960" height="1280"><rect width="960" height="1280" fill="white"/><rect x="40" y="450" width="880" height="380" fill="#172b4d"/></svg>' }));
  await page.setContent(`<div class="lemoon-standard-pdp"><div class="product product--thumbnail_slider"><media-gallery><slider-component id="GalleryViewer-test"><ul id="Slider-test" class="product__media-list grid slider slider--mobile" style="display:flex;overflow:auto;padding:0;margin:0;list-style:none">${Array.from({ length: count }, (_, i) => `<li id="Slide-test-${i}" class="product__media-item slider__slide${i === 0 ? ' is-active' : ''}" style="flex:0 0 100%"><div class="product-media-container media-type-image"><div class="product__media media"><img src="/gallery-photo.svg" alt="Lente"></div></div></li>`).join('')}</ul><div class="slider-buttons"><button name="previous">Anterior</button><span class="slider-counter"><span class="slider-counter--current">1</span> / <span class="slider-counter--total">${count}</span></span><button name="next">Siguiente</button></div></slider-component><slider-component class="thumbnail-slider"><ul class="thumbnail-list slider">${Array.from({ length: count }, (_, i) => `<li class="thumbnail-list__item"><button class="thumbnail"><img src="/gallery-photo.svg" alt="Miniatura ${i + 1}"></button></li>`).join('')}</ul></slider-component></media-gallery></div></div>`);
  for (const file of ['base.css', 'section-main-product.css', 'lemoon-pdp-layout.css']) await page.addStyleTag({ path: `assets/${file}` });
  await page.addScriptTag({ path: 'assets/global.js' });
  await page.addScriptTag({ path: 'assets/lemoon-pdp-tools.js', type: 'module' });
}

for (const width of [390, 1280]) {
  test(`standard PDP keeps the cropped photo inside the gallery and vertically centered at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await openGallery(page, 2);
    const crop = page.locator('.lemoon-image-crop').first();
    await expect(crop).toBeVisible();
    await expect(crop).toHaveCSS('position', 'relative');
    const box = await crop.boundingBox();
    const stage = await page.locator('.product__media').first().boundingBox();
    expect(box.height).toBeLessThanOrEqual(stage.height + 1);
    const ratio = await crop.evaluate(el => Number(el.style.getPropertyValue('--crop-ratio')));
    expect(box.width / box.height).toBeCloseTo(ratio, 2);
    expect(box.y + box.height / 2).toBeCloseTo(stage.y + stage.height / 2, 0);
    expect(box.x).toBeGreaterThanOrEqual(stage.x);
    expect(box.x + box.width).toBeLessThanOrEqual(stage.x + stage.width + 1);
    if (width >= 990) {
      expect(box.width).toBeLessThanOrEqual(760);
      expect(box.x).toBeGreaterThan(stage.x + 80);
    }
  });
}

test('single-photo PDP keeps a 1/1 counter after updates and resizing', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openGallery(page, 1);
  await page.locator('#GalleryViewer-test').evaluate(slider => slider.update());
  await expect(page.locator('.slider-counter--current')).toHaveText('1');
  await expect(page.locator('.slider-counter--total')).toHaveText('1');
  await page.setViewportSize({ width: 430, height: 844 });
  await page.locator('#GalleryViewer-test').evaluate(slider => slider.update());
  await expect(page.locator('.slider-counter--current')).toHaveText('1');
  await expect(page.locator('.slider-counter--total')).toHaveText('1');
});

test('tablet standard PDP hides thumbnails and updates its photo counter on swipe', async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 844 });
  await openGallery(page, 5);
  await expect(page.locator('.thumbnail-slider')).toBeHidden();
  await expect(page.locator('#GalleryViewer-test > .slider-buttons')).toBeVisible();
  const slider = page.locator('#Slider-test');
  await slider.evaluate(el => el.scrollTo({ left: el.clientWidth, behavior: 'instant' }));
  await expect(page.locator('.slider-counter--current')).toHaveText('2');
  await expect(page.locator('.slider-counter--total')).toHaveText('5');
  await page.setViewportSize({ width: 1280, height: 844 });
  await expect(page.locator('.thumbnail-slider')).toBeVisible();
  await expect(page.locator('#GalleryViewer-test > .slider-buttons')).toBeHidden();
});
