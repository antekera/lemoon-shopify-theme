import { readFileSync } from 'node:fs';
import { test, expect } from 'vitest';
const read = path => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const json = path => { const source=read(path); return JSON.parse(source.slice(source.indexOf('{'))); };
test('sample identity uses the corrected company and non-operational contact data', () => {
 const data=json('docs/content/commercial-test-data.json');
 expect(data.company).toBe('Servioptic SpA');
 expect(data.rut).toBe('00.000.000-0');
 expect(data.email.endsWith('.example')).toBe(true);
 for(const content of Object.values(data.content))expect(content).not.toContain('Servioproc');
});
test('sample content is opt-in; disabling it preserves native legal CMS and privacy content', () => {
 for(const section of ['legal','contact','service']) {
  const source=read(`sections/lemoon-${section}-page.liquid`);
  const schema=JSON.parse(source.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
  expect(schema.settings.find(s=>s.id==='demo_data').default).toBe(false);
 }
 const legal=read('sections/lemoon-legal-page.liquid');
 expect(legal).toMatch(/if section.settings.demo_data[\s\S]*?elsif page.content != blank[\s\S]*?render 'lemoon-business-content', content: page.content/);
 expect(legal).toContain("render 'lemoon-business-content', content: shop.privacy_policy.body");
 const snippet=read('snippets/lemoon-commercial-demo.liquid');
 expect(snippet).toContain('{%- if enabled -%}');
 expect(snippet).toContain("'sections.lemoon_demo.notice' | t");
});
test('sample content remains editable while Nosotros opts out and contact stays disabled', () => {
 const data=json('docs/content/commercial-test-data.json');
 for(const [handle,content] of Object.entries(data.content)) {
  const settings=json(`templates/page.${handle}.json`).sections.main.settings;
  if (handle === 'nosotros') {
   expect(settings).not.toHaveProperty('demo_data');
   expect(settings).not.toHaveProperty('demo_content');
  } else if (handle === 'envios-y-entregas') {
   expect(settings.demo_data).toBe(false);
   expect(settings.demo_content).toBe(content);
   expect(settings.use_section_content).toBe(true);
   expect(settings.content).toMatch(/<h2>/);
  } else if (['garantias', 'politica-de-devoluciones', 'terminos-y-condiciones'].includes(handle)) {
   expect(settings.demo_data).toBe(false);
   expect(settings).not.toHaveProperty('demo_content');
   expect(settings.content).toMatch(/<h2>/);
  } else {
   expect(settings.demo_data).toBe(handle !== 'contact');
   expect(settings.demo_content).toBe(content);
  }
 }
});
