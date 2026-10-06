import { readFile } from 'node:fs/promises';
import { expect, test } from 'vitest';

const themeFile = (path) => new URL(`../../${path}`, import.meta.url);

test('removes the visible information heading and conditionally adds the Square wishlist link', async () => {
  const snippet = await readFile(themeFile('snippets/lemoon-mobile-search.liquid'), 'utf8');
  const header = await readFile(themeFile('sections/header.liquid'), 'utf8');
  const group = await readFile(themeFile('sections/header-group.json'), 'utf8');

  expect(snippet).not.toMatch(/<h3[^>]*>\{\{ 'sections\.mobile_search\.information' \| t \}\}<\/h3>/);
  expect(snippet).toMatch(/if section\.settings\.mobile_search_show_wishlist[\s\S]*?href="\/apps\/page\/wishlist"[\s\S]*?'sections\.mobile_search\.wishlist' \| t[\s\S]*?endif/);
  expect(header).toMatch(/"id": "mobile_search_show_wishlist"[\s\S]*?"default": true/);
  expect(group).toMatch(/"mobile_search_show_wishlist": true/);
});

test('configures the search carousel with a Shopify collection and renders at most three products', async () => {
  const snippet = await readFile(themeFile('snippets/lemoon-mobile-search.liquid'), 'utf8');
  const header = await readFile(themeFile('sections/header.liquid'), 'utf8');
  const styles = await readFile(themeFile('assets/lemoon-mobile-search.css'), 'utf8');

  expect(header).toMatch(/"type": "collection",\s*"id": "mobile_search_trending_collection"/);
  expect(header).not.toMatch(/"id": "mobile_search_trending_products"/);
  expect(snippet).toMatch(/assign trend_collection = section\.settings\.mobile_search_trending_collection/);
  expect(snippet).toMatch(/for trend_product in trend_collection\.products limit: 3/);
  expect(snippet).toMatch(/trend_collection\.products_count \| at_most: 3/);
  expect(snippet).toMatch(/media_aspect_ratio: 'adapt'[\s\S]*?show_secondary_image: true/);
  expect(snippet).not.toMatch(/quick_add: 'standard'/);
  expect(styles).toMatch(/\.lemoon-mobile-search \.lemoon-product-card__swatch\s*\{[^}]*min-width:\s*0;[^}]*min-height:\s*0/);
});

test('labels suggestions as recently viewed and exposes the current product for search history', async () => {
  const snippet = await readFile(themeFile('snippets/lemoon-mobile-search.liquid'), 'utf8');
  const spanish = await readFile(themeFile('locales/es.json'), 'utf8');
  const script = await readFile(themeFile('assets/lemoon-mobile-search.js'), 'utf8');

  expect(spanish).toMatch(/"suggested_products": "Visto recién"/);
  expect(snippet).toMatch(/data-current-product-id="\{\{ product\.id \| escape \}\}"/);
  expect(snippet).toMatch(/data-current-product-image=/);
  expect(script).toMatch(/lemoon:recently-viewed-products/);
  expect(script).toMatch(/this\.recentProducts\(\)/);
});
