import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
const read = (file) => readFileSync(new URL(`../../${file}`, import.meta.url), 'utf8');
const json = (file) => { const text = read(file); return JSON.parse(text.slice(text.indexOf('{'))); };
const source = read('sections/lemoon-crystal-guide.liquid');
const schema = JSON.parse(source.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);

test('lens guide is supplementary to the collection and has no invented product fallback', () => {
  expect(source.trimStart()).toMatch(/^\{%- if collection\.handle == 'cristales' -%\}/);
  expect(source).not.toMatch(/<h1\b|all_products\[|\/products\/lemoon-|variant\.price|add\.js/);
  expect(source.match(/<li class="lemoon-crystal-guide__tile">/g)).toHaveLength(3);
  expect(source.match(/aria-hidden="true" focusable="false"/g)).toHaveLength(3);
  expect(source).toContain("routes.root_url | append: '/collections/opticos' | replace: '//', '/'");
  expect(source).toContain("routes.root_url | append: '/pages/como-enviar-prescripcion' | replace: '//', '/'");
  expect(source).toContain("if option.name == 'Lentes'");
  expect(source).toContain('configurator_product.variants.size > 0');
  expect(source).toContain('if has_lens_options');
  expect(source).toContain('{{ configurator_product.url }}?view=configurador');
  expect(source).toContain('t: product: configurator_product.title | escape');
  expect(source).toContain("'lemoon_lens_flow.prototype' | t");
});

test('lens guide editor settings preserve padding, optional product selection and localized preset', () => {
  expect(schema.disabled_on.groups).toEqual(['header', 'footer']);
  expect(schema.settings.filter(({type}) => type === 'range').map(({id}) => id)).toEqual(['padding_top', 'padding_bottom']);
  expect(schema.settings.find(({id}) => id === 'configurator_product')).toMatchObject({type: 'product'});
  expect(schema.settings.find(({id}) => id === 'configurator_product').default).toBeUndefined();
  expect(schema.presets[0].name).toBe('t:sections.lemoon_crystal_guide.name');
  expect(source).not.toMatch(/padding:\s*\{\{[^\n]*\}\}px 0/);
});

test('English and Spanish have matching content keys and every section translation resolves', () => {
  const keys = [...source.matchAll(/['"](?:t:)?(sections\.lemoon_crystal_guide[^'"]+)['"]/g)].map((match) => match[1]);
  const locales = ['en.default', 'es'].map((locale) => ({content: json(`locales/${locale}.json`), schema: json(`locales/${locale}.schema.json`)}));
  expect(Object.keys(locales[0].content.sections.lemoon_crystal_guide).sort()).toEqual(Object.keys(locales[1].content.sections.lemoon_crystal_guide).sort());
  for (const locale of locales) for (const key of keys) {
    const lookup = (object) => key.split('.').reduce((value, part) => value?.[part], object);
    expect(lookup(locale.content) || lookup(locale.schema), key).toBeTruthy();
  }
});
