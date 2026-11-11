import { expect, test } from '@playwright/test';
import { resolve } from 'node:path';

test('category recommendations stop after five pages with no matching frames', async ({ page }) => {
  const requests = [];
  await page.route('**/collections/pagination-test?**', async (route) => {
    const url = new URL(route.request().url());
    const number = Number(url.searchParams.get('page') || '1');
    requests.push(number);
    await route.fulfill({ contentType: 'text/html', body: `<div class="lemoon-featured-products__results" data-next-page="/collections/pagination-test?view=carousel&page=${number + 1}"><li data-product-id="${number}" data-product-shape="Cuadrado"></li></div>` });
  });
  await page.goto('/tests/fixtures/mobile-search.html');
  await page.setContent('<section class="lemoon-featured-products" data-deferred data-match-characteristics data-product-shape="Redondo" data-collection-url="/collections/pagination-test" data-current-product-id="current" data-initial-items="5" data-max-items="15"><ul class="lemoon-featured-products__track" aria-busy="true"></ul></section>');
  await page.addScriptTag({ path: resolve('assets/lemoon-featured-products.js') });
  const section = page.locator('.lemoon-featured-products');
  await expect(section).toHaveAttribute('data-ready', 'true');
  await expect(section).toBeHidden();
  expect(requests).toEqual([1, 2, 3, 4, 5]);
});
