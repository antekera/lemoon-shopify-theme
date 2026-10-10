import { test, expect } from '@playwright/test';

const cases = [
  {
    name: 'óptico',
    path: process.env.STOREFRONT_OPTICAL_PRODUCT || '/products/lemoon-colca',
    collection: '/collections/opticos',
  },
  {
    name: 'solar',
    path: process.env.STOREFRONT_SUN_PRODUCT || '/products/muestra-de-catalogo-solar-mariposa',
    collection: '/collections/lentes-de-sol',
  },
];

test('the accessory carousel waits until it is near the viewport', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop');
  const accessoryRequests = [];
  page.on('request', (request) => {
    if (request.url().includes('/collections/accesorios?view=carousel-accessories')) accessoryRequests.push(request.url());
  });

  await page.goto('/products/lemoon-colca');
  const carousels = page.locator('.lemoon-featured-products');
  await expect(carousels.first()).toHaveAttribute('data-ready', 'true');
  await expect(carousels.nth(1)).not.toHaveAttribute('data-ready', 'true');
  expect(accessoryRequests).toHaveLength(0);

  await carousels.nth(1).scrollIntoViewIfNeeded();
  await expect(carousels.nth(1)).toHaveAttribute('data-ready', 'true');
  expect(accessoryRequests).toHaveLength(1);
});

for (const { name, path, collection } of cases) {
  test(`the ${name} PDP shows category-related frames and accessories`, async ({ page }, testInfo) => {
    const carouselRequests = [];
    page.on('request', (request) => {
      if (request.url().includes('view=carousel')) carouselRequests.push(request.url());
    });
    await page.goto(path);

    const carousels = page.locator('.lemoon-featured-products');
    await expect(carousels).toHaveCount(2);
    const frames = carousels.nth(0);
    const accessories = carousels.nth(1);
    await expect(frames).toHaveAttribute('data-collection-url', collection);
    await expect(accessories).toHaveAttribute('data-collection-url', '/collections/accesorios');
    await expect(carousels.locator('.lemoon-featured-products__eyebrow')).toHaveCount(0);
    await expect(carousels.locator('.lemoon-featured-products__link')).toHaveCount(0);

    await frames.scrollIntoViewIfNeeded();
    await expect(frames).toHaveAttribute('data-ready', 'true');
    await expect(frames.locator('.lemoon-featured-products__item')).toHaveCount(5);
    await expect(frames.locator('.lemoon-product-card__quick-add')).toHaveCount(0);
    expect(carouselRequests.some((url) => url.includes(collection))).toBe(true);

    const selected = await frames.locator('.lemoon-featured-products__item').evaluateAll((items) => items.map((item) => ({
      href: item.querySelector('.card__heading a')?.getAttribute('href'),
      score: Number(item.dataset.relatedScore),
    })));
    expect(selected.every((item) => !item.href?.startsWith(path))).toBe(true);
    expect(selected.map((item) => item.score)).toEqual(selected.map((item) => item.score).sort((a, b) => b - a));

    const track = frames.locator('.lemoon-featured-products__track');
    await track.evaluate((element) => { element.scrollLeft = element.scrollWidth; });
    await expect.poll(() => frames.locator('.lemoon-featured-products__item').count()).toBeGreaterThan(5);
    if (name === 'óptico') {
      await expect(frames.locator('.lemoon-featured-products__item')).toHaveCount(10);
      await track.evaluate((element) => { element.scrollLeft = element.scrollWidth; });
      await expect(frames.locator('.lemoon-featured-products__item')).toHaveCount(15);
    }

    await accessories.scrollIntoViewIfNeeded();
    await expect(accessories).toHaveAttribute('data-ready', 'true');
    expect(await accessories.locator('.lemoon-featured-products__item').count()).toBeGreaterThan(0);
    expect(await accessories.locator('.lemoon-featured-products__item').count()).toBeLessThanOrEqual(5);
    await expect(accessories.locator('.lemoon-product-card__quick-add')).toHaveCount(await accessories.locator('.lemoon-featured-products__item').count());

    if (testInfo.project.name === 'mobile') {
      const scroll = await track.evaluate((track) => ({
        width: track.clientWidth,
        scrollWidth: track.scrollWidth,
      }));
      expect(scroll.scrollWidth).toBeGreaterThan(scroll.width);
    }
  });
}
