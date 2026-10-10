import { test, expect } from '@playwright/test';

test('mobile summary precedes the gallery, swiping updates the counter and desktop restores the layout', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/tests/fixtures/eyewear-product.html');
  const summary = page.locator('.lemoon-mobile-summary');
  await expect(summary).toBeVisible();
  await expect(summary.locator('h1')).toHaveCount(1);
  await expect(summary.locator('[data-favourite]')).toBeVisible();
  await expect(summary.locator('[data-heading-sku]')).toHaveCount(0);
  await expect(page.locator('.lemoon-pdp__info [data-heading-sku]')).toBeVisible();
  await expect(summary.locator('[data-price]')).toBeVisible();
  await expect(summary.locator('.lemoon-pdp__tax')).toHaveText('IVA incluido.');
  const order = await summary.locator('lemoon-product-tools').evaluate(el => [...el.children].map(node => node.className));
  expect(order).toEqual(['lemoon-product-status', 'lemoon-product-heading', 'lemoon-mobile-price-row', 'lemoon-pdp__promotions']);
  const stage = page.locator('.lemoon-pdp__stage');
  expect(await summary.evaluate(el => el.getBoundingClientRect().bottom)).toBeLessThanOrEqual(await stage.evaluate(el => el.getBoundingClientRect().top));
  await expect(page.locator('lemoon-thumbnail-rail')).toBeHidden();
  await expect(page.locator('[data-gallery-current]')).toHaveText('1');
  await stage.evaluate(el => el.scrollTo({ left: el.clientWidth, behavior: 'instant' }));
  await expect(page.locator('[data-gallery-current]')).toHaveText('2');
  await stage.evaluate(el => el.scrollTo({ left: 0, behavior: 'instant' }));
  await expect(page.locator('[data-gallery-current]')).toHaveText('1');
  await page.setViewportSize({ width: 1280, height: 844 });
  await expect(summary).toBeHidden();
  await expect(page.locator('.lemoon-pdp__info h1')).toBeVisible();
  await expect(page.locator('.lemoon-pdp__info .lemoon-mobile-price-row > .lemoon-pdp__price')).toBeVisible();
  await expect(page.locator('.lemoon-pdp__info .lemoon-mobile-price-row > .lemoon-pdp__tax')).toBeVisible();
  const desktopOrder = await page.locator('.lemoon-pdp__info lemoon-product-tools').evaluate(el => [...el.children].map(node => node.className));
  expect(desktopOrder).toEqual(order);
  const desktopOptions = await page.locator('.lemoon-pdp__frame-options').evaluate(el => {
    const color = el.querySelector('.lemoon-pdp__options--color legend').getBoundingClientRect();
    const size = el.querySelector('.lemoon-pdp__size-row > div').getBoundingClientRect();
    const guide = el.querySelector('.lemoon-pdp__size-row > button').getBoundingClientRect();
    return { colorTop: color.top, sizeTop: size.top, sizeBottom: size.bottom, guideTop: guide.top };
  });
  expect(desktopOptions.sizeTop).toBeCloseTo(desktopOptions.colorTop, 0);
  expect(desktopOptions.guideTop).toBeGreaterThanOrEqual(desktopOptions.sizeBottom);
  await expect(page.locator('lemoon-thumbnail-rail')).toBeVisible();
  await expect(page.locator('.lemoon-mobile-gallery-count')).toBeHidden();
});


test('dragging the mobile photo changes the image without opening zoom and keeps the counter over the photo', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/tests/fixtures/eyewear-product.html');
  const stage = page.locator('.lemoon-pdp__stage');
  const count = page.locator('.lemoon-mobile-gallery-count');
  const rect = await stage.boundingBox();
  const pill = await count.boundingBox();
  expect(pill.y + pill.height).toBeLessThan(rect.y + rect.height);
  expect(pill.x + pill.width / 2).toBeCloseTo(rect.x + rect.width / 2, 0);
  await expect(count).toHaveCSS('font-size', '15px');
  await page.mouse.move(rect.x + rect.width * .8, rect.y + rect.height * .5);
  await page.mouse.down();
  await page.mouse.move(rect.x + rect.width * .2, rect.y + rect.height * .5, { steps: 12 });
  await page.mouse.up();
  await expect(page.locator('[data-gallery-current]')).toHaveText('2');
  await expect(page.locator('dialog[open]')).toHaveCount(0);
  await page.mouse.move(rect.x + rect.width * .2, rect.y + rect.height * .5);
  await page.mouse.down();
  await page.mouse.move(rect.x + rect.width * .8, rect.y + rect.height * .5, { steps: 12 });
  await page.mouse.up();
  await expect(page.locator('[data-gallery-current]')).toHaveText('1');
});

test('intermediate widths show the photo counter instead of horizontal thumbnails', async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 844 });
  await page.goto('/tests/fixtures/eyewear-product.html');
  const stage = page.locator('.lemoon-pdp__stage');
  const count = page.locator('.lemoon-mobile-gallery-count');
  await expect(page.locator('lemoon-thumbnail-rail')).toBeHidden();
  await expect(count).toBeVisible();
  await expect(count).toContainText('1 / 5');
  await stage.evaluate(el => el.scrollTo({ left: el.clientWidth, behavior: 'instant' }));
  await expect(count).toContainText('2 / 5');
  await page.setViewportSize({ width: 1280, height: 844 });
  await expect(count).toBeHidden();
  await expect(page.locator('lemoon-thumbnail-rail')).toBeVisible();
});

test('description and SKU precede the benefits and thumbnail images fill their buttons', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 844 });
  await page.goto('/tests/fixtures/eyewear-product.html');
  const description = await page.locator('.product__description').boundingBox();
  const sku = await page.locator('[data-heading-sku-row]').boundingBox();
  const benefits = await page.locator('.lemoon-pdp__benefits').boundingBox();
  expect(description.y + description.height).toBeLessThanOrEqual(sku.y);
  expect(sku.y + sku.height).toBeLessThanOrEqual(benefits.y);
  for (const img of await page.locator('.lemoon-pdp__thumbnails img').all()) {
    await expect(img).toHaveCSS('object-fit', 'cover');
    const sizes = await img.evaluate(el => ({ image: el.getBoundingClientRect().height, button: el.parentElement.getBoundingClientRect().height }));
    expect(sizes.image).toBeLessThanOrEqual(sizes.button);
  }
});
