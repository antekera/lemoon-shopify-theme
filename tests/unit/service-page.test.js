import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const json = (path) => { const s=read(path); return JSON.parse(s.slice(s.indexOf('{'))); };

test('service section has a single localized heading, honest contact routing and optional verified rich text', () => {
 const source=read('sections/lemoon-service-page.liquid');
 expect(source.match(/<h1\b/g)).toHaveLength(1);
 expect(source).toContain('sections.lemoon_service_page.operations_title');
 expect(source).toContain('sections.lemoon_service_page.benefits_title');
 expect(source).toContain("{{ routes.root_url | append: '/pages/contact' | replace: '//', '/' }}?subject=operativos");
 expect(source).not.toMatch(/page\.content|hola@lemon\.cl|<form|contact\[|RUT/);
 expect(source).toContain('if section.settings.verified_details != blank');
 expect(source).toContain('{{ section.settings.verified_details }}');
 expect(source).toContain('if section.settings.image != blank');
});
test('service pages select the proper kind and editor settings have valid localized padding', () => {
 for(const [handle,kind] of [['operativos-oftalmologicos','operations'],['isapres-y-fonasa','benefits']]) {
  const template=json(`templates/page.${handle}.json`); expect(template.order).toEqual(['main']);expect(template.sections.main.type).toBe('lemoon-service-page');expect(template.sections.main.settings.kind).toBe(kind);
 }
 const schema=JSON.parse(read('sections/lemoon-service-page.liquid').match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
 expect(schema.settings.filter(({type}) => type==='range').map(({id}) => id)).toEqual(['padding_top','padding_bottom']);expect(schema.disabled_on.groups).toEqual(['header','footer']);expect(schema.presets[0].name).toBe('t:sections.lemoon_service_page.name');
 expect(schema.settings.find(({id})=>id==='verified_details').default).toBeUndefined();
});
test('service copy and schema have complete English/Spanish keys and no invented benefits or fixed availability', () => {
 const source=read('sections/lemoon-service-page.liquid');
 const keys=[...source.matchAll(/['"](?:t:)?(sections\.lemoon_service_page[^'"]+)['"]/g)].map((m)=>m[1]);expect(keys.length).toBeGreaterThan(10);
 for(const locale of ['en.default','es']) {
  const texts=json(`locales/${locale}.json`);const schemas=json(`locales/${locale}.schema.json`);
  for(const key of keys) {const find=(obj)=>key.split('.').reduce((value,k)=>value?.[k],obj);expect(find(texts)||find(schemas),key).toBeTruthy();}
  expect(JSON.stringify(texts.sections.lemoon_service_page)).not.toMatch(/\d+%|reembolso garantizado|free eye exam|examen gratis/i);
 }
});
