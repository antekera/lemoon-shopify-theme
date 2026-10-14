import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const json = (path) => { const source = read(path); return JSON.parse(source.slice(source.indexOf('{'))); };

test('legal shell preserves real CMS content, escapes headings and isolates native privacy fallback', () => {
 const source = read('sections/lemoon-legal-page.liquid');
 expect(source).toContain('{{ page.title | escape }}');
 expect(source).toContain('{{ page.content }}');
 expect(source).toContain('{{ section.settings.intro | escape }}');
 expect(source).toMatch(/elsif section.settings.kind == 'privacy' and shop.privacy_policy.body != blank[\s\S]*?{{ shop.privacy_policy.body }}/);
 expect(source).toContain("'sections.lemoon_legal_page.empty_content' | t");
 expect(source.match(/<h1\b/g)).toHaveLength(1);
 expect(source).not.toMatch(/30 días|365 días|\$\d|[0-9]+%/);
});

test('legal navigation uses configured or actual native policies and contact path respects the locale root', () => {
 const source = read('sections/lemoon-legal-page.liquid');
 expect(source).toContain("{{ routes.root_url | append: '/pages/contact' | replace: '//', '/' }}");
 for (const policy of ['shipping_policy','refund_policy','terms_of_service','privacy_policy']) expect(source).toContain(`shop.${policy}.url`);
 for (const link of ['shipping_url','returns_url','terms_url','privacy_url','warranty_url']) expect(source).toContain(`section.settings.${link}`);
 expect(source).not.toMatch(/href="\/pages\//);
});

test('four legal templates select their explicit kinds and schema uses valid translated padding controls', () => {
 const kinds = {'envios-y-entregas':'shipping','politica-de-devoluciones':'returns','terminos-y-condiciones':'terms','garantias':'warranty'};
 for (const [handle,kind] of Object.entries(kinds)) {
  const template = json(`templates/page.${handle}.json`);
  expect(template.order).toEqual(['main']);
  expect(template.sections.main.type).toBe('lemoon-legal-page');
  expect(template.sections.main.settings.kind).toBe(kind);
 }
 const source = read('sections/lemoon-legal-page.liquid');
 const schema = JSON.parse(source.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
 expect(schema.settings.filter(({type}) => type === 'range').map(({id}) => id)).toEqual(['padding_top','padding_bottom']);
 expect(schema.presets[0].name).toBe('t:sections.lemoon_legal_page.name');
 expect(schema.disabled_on.groups).toEqual(['header','footer']);
});

test('new legal copy and schema keys have English and Spanish translations without filling business claims', () => {
 const source = read('sections/lemoon-legal-page.liquid');
 const keys = [...source.matchAll(/['"](?:t:)?(sections\.lemoon_legal_page[^'"]+)['"]/g)].map((match) => match[1]);
 expect(keys.length).toBeGreaterThan(5);
 for (const locale of ['en.default','es']) {
  const text = json(`locales/${locale}.json`); const schemaText = json(`locales/${locale}.schema.json`);
  for (const key of keys) { const lookup = (object) => key.split('.').reduce((value,part) => value?.[part],object); expect(lookup(text)||lookup(schemaText),`${locale}: ${key}`).toBeTruthy(); }
 }
});
