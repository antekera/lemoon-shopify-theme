import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { renderComponentSection } from '../helpers/component-library-renderer.mjs';
import { renderAdoption } from '../helpers/component-adoption-renderer.mjs';
const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const json = (path) => { const source = read(path); return JSON.parse(source.slice(source.indexOf('{'))); };

test('legal shell preserves real CMS content, escapes headings and isolates native privacy fallback', () => {
 const source = read('sections/lemoon-legal-page.liquid');
 const html = renderAdoption('legal-shipping');
 expect(html).toContain('<h1>Legal &lt;&amp;&#34;</h1>');
 expect(source).toContain('{{ page.content }}');
 expect(source).toContain('{{ section.settings.intro | escape }}');
 expect(source).toMatch(/elsif section.settings.kind == 'privacy' and shop.privacy_policy.body != blank[\s\S]*?{{ shop.privacy_policy.body }}/);
 expect(source).toContain("'sections.lemoon_legal_page.empty_content' | t");
 expect(html.match(/<h1\b/g)).toHaveLength(1);
 expect(source).not.toMatch(/30 días|365 días|\$\d|[0-9]+%/);
});

test('legal navigation uses configured or actual native policies and contact path respects the locale root', () => {
 const source = read('sections/lemoon-legal-page.liquid');
 expect(renderAdoption('legal-shipping')).toContain('href="/es/pages/contact"');
 expect(renderAdoption('legal-terms')).toContain('href="/ayuda?x=1&amp;y=2"');
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

test('legal shell keeps native privacy fallback and demo privacy heading separate from CMS', () => {
 const normal = renderComponentSection('lemoon-legal-page', { settings: { kind: 'privacy' }, context: { page: { title: 'CMS <&', content: '' }, shop: { privacy_policy: { body: '<p>Native privacy</p>' } } } });
 expect(normal).toContain('<h1>CMS &lt;&amp;</h1>');
 expect(normal).toContain('<p>Native privacy</p>');
 const demo = renderComponentSection('lemoon-legal-page', { settings: { kind: 'privacy', demo_data: true, demo_content: '<p>Demo</p>' }, context: { page: { title: 'CMS title' } } });
 expect(demo).toContain('<h1>Privacidad</h1>');
 expect(demo).not.toContain('<h1>CMS title</h1>');
});
