import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

const file = (name) => readFileSync(new URL(`../../${name}`, import.meta.url), 'utf8');

test('404 offers four recovery routes without search or redirects', () => {
  const section = file('sections/main-404.liquid');
  expect(section).toContain('href="{{ routes.root_url }}"');
  expect(section).toContain('href="{{ routes.all_products_collection_url }}"');
  expect(section).toContain('/pages/preguntas-frecuentes');
  expect(section).toContain('/pages/contact');
  expect(section.match(/<a\b/g)).toHaveLength(4);
  expect(section).not.toMatch(/<form\b|<input\b|routes\.search_url|lemoon-not-found__(?:search|input|submit|label)/);
  expect(section).not.toMatch(/window\.location|http-equiv=["']refresh|<script/);
  expect(section.match(/<h1\b/g)).toHaveLength(1);
});

test('404 schema remains editable and references valid bilingual translations', () => {
  const section = file('sections/main-404.liquid');
  const schema = JSON.parse(section.match(/{% schema %}([\s\S]*?){% endschema %}/)?.[1] || '{}');
  expect(schema.settings?.filter(({ type }) => type === 'range').map(({ id }) => id)).toEqual(['padding_top', 'padding_bottom']);
  expect(schema.disabled_on?.groups).toEqual(['header', 'footer']);
  for (const locale of ['en.default', 'es']) {
    const text = file(`locales/${locale}.json`);
    const messages = JSON.parse(text.slice(text.indexOf('{'))).templates['404'];
    for (const key of ['description', 'home', 'catalogue', 'faq', 'contact']) expect(messages[key]).toBeTruthy();
  }
});
