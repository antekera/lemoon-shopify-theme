import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
const file = (name) => readFileSync(new URL(`../../${name}`, import.meta.url), 'utf8');
const json = (name) => { const text = file(name); return JSON.parse(text.slice(text.indexOf('{'))); };

test('search encodes clear-filter URL query while escaping the displayed query separately', () => {
  const section = file('sections/main-search.liquid');
  const results = file('snippets/main-search-results.liquid');
  expect(section).toContain('assign terms = search.terms | url_encode');
  expect(section).toContain("'&type=product&options%5Bprefix%5D=last&sort_by='");
  expect(results).toContain('value="{{ search.terms | escape }}"');
  expect(results).toContain('assign escaped_search_terms = search.terms | escape');
  expect(results).not.toMatch(/t: terms: search\.terms/);
});

test('search preserves predictive search, actual paginated Shopify results, facets and existing product cards', () => {
  const section = file('sections/main-search.liquid');
  const results = file('snippets/main-search-results.liquid');
  expect(section).toContain('paginate collections.all.products by 24');
  expect(section).toContain('paginate search.results by 24');
  expect(results).toContain('<predictive-search');
  expect(results).toContain('<main-search>');
  expect(results).toContain('name="type" value="product"');
  expect(results).toContain("render 'facets'");
  expect(results).toContain("render 'main-search-result-card'");
  expect(results).toContain("render 'pagination', paginate: paginate");
  expect(results).toContain('search.filters != empty');
});

test('search presentation uses configured three/one product columns, one heading and recovery catalogue link', () => {
  const results = file('snippets/main-search-results.liquid');
  const template = json('templates/search.json');
  expect(template.sections.main.settings.columns_desktop).toBe(3);
  expect(template.sections.main.settings.columns_mobile).toBe('1');
  expect(results.match(/<h1\b/g)).toHaveLength(1);
  expect(results).toContain('sections.lemoon_search_page.title');
  expect(results).toContain('href="{{ routes.all_products_collection_url }}"');
  expect(results).toContain('lemoon-search__recovery');
  const schema = JSON.parse(file('sections/main-search.liquid').match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
  expect(schema.disabled_on.groups).toEqual(['header', 'footer']);
  expect(schema.presets[0].name).toBe('t:sections.main-search.name');
});

test('search copy is bilingual with no fabricated result counts or static catalogue products', () => {
  const results = file('snippets/main-search-results.liquid');
  const keys = [...results.matchAll(/'sections\.lemoon_search_page\.([^']+)'/g)].map((match) => match[1]);
  expect(keys.length).toBeGreaterThan(4);
  for (const locale of ['en.default', 'es']) {
    const messages = json(`locales/${locale}.json`).sections.lemoon_search_page;
    for (const key of keys) expect(messages[key], `${locale} ${key}`).toBeTruthy();
  }
  expect(results).not.toMatch(/Dalton|89\.990|36 resultados/i);
});
