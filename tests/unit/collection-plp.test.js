import { readFile } from 'node:fs/promises';
import { expect, test } from 'vitest';

const source = (path) => readFile(new URL(`../../${path}`, import.meta.url), 'utf8');
const schemaOf = (liquid) => JSON.parse(liquid.match(/\{% schema %\}([\s\S]*?)\{% endschema %\}/)[1]);

test('desktop and mobile pagination limits remain configurable separately', async () => {
  const [section, template] = await Promise.all([
    source('sections/main-collection-product-grid.liquid'),
    source('snippets/lemoon-plp-product-page.liquid'),
  ]);
  const settings = schemaOf(section).settings;

  expect(settings.find(({ id }) => id === 'products_per_page')).toMatchObject({ min: 5, max: 50, step: 5, default: 15 });
  expect(settings.find(({ id }) => id === 'products_per_page_mobile')).toMatchObject({ min: 4, max: 50, step: 1, default: 16 });
  expect(section).toMatch(/paginate collection\.products by section\.settings\.products_per_page_mobile/);
  expect(template).toMatch(/data-plp-page-size="\{\{ page_size \}\}"/);
});

test('price slider rounds the available ceiling and keeps steps at one thousand', async () => {
  const [slider, styles, facets] = await Promise.all([
    source('snippets/lemoon-price-slider.liquid'),
    source('assets/lemoon-collection-plp.css'),
    source('assets/facets.js'),
  ]);

  expect(slider).toMatch(/divided_by: 1000\.0 \| ceil \| times: 1000/);
  expect(slider.match(/step="1000"/g)).toHaveLength(2);
  expect(slider).not.toContain('El precio más alto');
  expect(slider).not.toContain('data-label="Para"');
  expect(styles).toMatch(/\.lemoon-price-slider__track/);
  expect(facets).toMatch(/updateSlider\(changed\)/);
  expect(facets).toMatch(/aria-valuetext/);
});

test('mobile filter drawer keeps its title, filter groups and distinct clear and close actions', async () => {
  const [facets, styles] = await Promise.all([
    source('snippets/facets.liquid'),
    source('assets/lemoon-collection-plp.css'),
  ]);

  expect(facets).toContain('data-view-results');
  expect(facets).toContain('data-applied-filter-count');
  expect(facets).toMatch(/data-facet-accordion open/);
  expect(facets).toMatch(/mobile-facets__clear-wrapper/);
  expect(facets).toMatch(/'lemoon\.collection\.view_results'/);
  expect(styles).toMatch(/\.lemoon-plp \.mobile-facets__inner \{\s*max-width:\s*320px/);
  expect(styles).toMatch(/\.lemoon-plp \.mobile-facets__header\s*\{[^}]*border-bottom/);
});

test('responsive toolbar retains filter count, sort, grid toggle and result count behavior', async () => {
  const [section, script] = await Promise.all([
    source('sections/main-collection-product-grid.liquid'),
    source('assets/lemoon-collection-plp.js'),
  ]);

  expect(section).toContain('data-sort-menu');
  expect(section).toContain('data-grid-toggle');
  expect(section).toContain('data-mobile-results');
  expect(script).toContain('data-applied-filter-count');
  expect(script).toContain('lemoon-plp-mobile-columns');
  expect(script).toContain('window.lemoonSelectProductPage');
  expect(script).toContain('lemoon:facets-updated');
});
