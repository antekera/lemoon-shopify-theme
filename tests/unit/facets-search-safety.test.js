import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

test('facet resets encode query parameters and result labels escape customer search terms', () => {
  const source = readFileSync(new URL('../../snippets/facets.liquid', import.meta.url), 'utf8');
  expect(source).toContain('assign terms = results.terms | url_encode');
  expect(source).toContain('assign escaped_search_terms = results.terms | escape');
  expect(source).not.toMatch(/t: terms: results\.terms/);
  expect(source.match(/t: terms: escaped_search_terms/g)).toHaveLength(3);
  expect(source.match(/name="type" value="product"/g)).toHaveLength(3);
  expect(source).toContain('&type=product&options%5Bprefix%5D=last');
});
