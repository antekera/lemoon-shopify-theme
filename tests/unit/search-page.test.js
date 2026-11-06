import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, test } from 'vitest';
import { renderComponentSection, searchFixtureOptions } from '../helpers/component-library-renderer.mjs';
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

test('all-products search renders the supplied collection count and items without a global collections object', () => {
  const sourceRoot = mkdtempSync(join(tmpdir(), 'lemoon-search-context-'));
  mkdirSync(join(sourceRoot, 'snippets'));
  // Isolate collection selection from the commercial card's money/image adapters.
  // The parent results snippet and all other nested controls remain real source.
  writeFileSync(join(sourceRoot, 'snippets/main-search-result-card.liquid'), '<li data-result-id="{{ item.id }}">{{ item.title | escape }}</li>');
  const options = searchFixtureOptions();
  const supplied = { products_count: 2, products: [{ id: 'optical', title: 'Óptico de referencia' }, { id: 'sun', title: 'Solar de referencia' }] };
  const render = context => renderComponentSection('main-search-results', {
    ...options, sourceRoot,
    context: { ...options.context, show_all_products: true, has_results: true, ...context },
  });
  try {
    const html = render({ all_collection: supplied });
    expect(html).toMatch(/lemoon-search__count[^>]*>\s*2 productos/);
    expect([...html.matchAll(/data-result-id="([^"]+)"/g)].map(match => match[1])).toEqual(['optical', 'sun']);
    expect(html).toContain('Óptico de referencia');
    expect(html).toContain('Solar de referencia');
    expect(html).not.toMatch(/Liquid (?:syntax )?error/);

    const conflictingGlobal = render({ all_collection: supplied, collections: { all: { products_count: 1, products: [{ id: 'wrong-global', title: 'Colección no seleccionada' }] } } });
    expect(conflictingGlobal).not.toContain('wrong-global');
    expect(conflictingGlobal).toContain('data-result-id="sun"');

    const legacyConsumer = render({ collections: { all: supplied } });
    expect(legacyConsumer).toMatch(/lemoon-search__count[^>]*>\s*2 productos/);
    expect(legacyConsumer).toContain('data-result-id="optical"');
  } finally {
    rmSync(sourceRoot, { recursive: true, force: true });
  }
});
