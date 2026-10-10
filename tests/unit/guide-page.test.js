import { readFileSync } from 'node:fs';
import { test, expect } from 'vitest';
const file = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const json = (path) => { const text = file(path); return JSON.parse(text.slice(text.indexOf('{'))); };
const kinds = { medidas: 'measurements', rostro: 'face', pedido: 'order', probador: 'try_on', prescripcion: 'prescription' };
test('each guide template chooses one guide without duplicating the page heading', () => {
  for (const [slug, kind] of Object.entries(kinds)) {
    const template = json(`templates/page.guia-${slug}.json`);
    expect(template.order).toEqual(['main']);
    expect(template.sections.main.type).toBe('lemoon-guide-page');
    expect(template.sections.main.settings.guide_kind).toBe(kind);
  }
  expect(file('sections/lemoon-guide-page.liquid').match(/<h1\b/g)).toHaveLength(1);
});
test('guide anchors are unique per section and links preserve the locale root', () => {
  const source = file('sections/lemoon-guide-page.liquid');
  expect(source).toContain('Guide-{{ section.id }}-{{ step }}');
  expect(source).toContain("routes.root_url | append: '/pages/contact' | replace: '//', '/'");
  expect(source).toContain('routes.all_products_collection_url');
  expect(source).not.toMatch(/<form|type="file"|getUserMedia|mailto:/);
  expect(source).toContain('aria-hidden="true"');
  expect(source).toContain('figcaption');
});
test('guides expose all bilingual instructions and do not invent available services', () => {
  for (const locale of ['en.default', 'es']) {
    const copy = json(`locales/${locale}.json`).sections.lemoon_guide;
    for (const kind of Object.values(kinds)) {
      for (const key of ['title', 'intro', 'visual_title', 'visual_copy', 'step_1_title', 'step_1_body', 'step_2_title', 'step_2_body', 'step_3_title', 'step_3_body']) expect(copy[kind][key], `${locale} ${kind}.${key}`).toBeTruthy();
    }
  }
  const es = json('locales/es.json').sections.lemoon_guide;
  expect(es.try_on.step_1_body).toContain('si');
  expect(es.prescription.step_1_body).toContain('si');
  expect(JSON.stringify(es)).not.toMatch(/365|30 días|inteligencia artificial|envíala después/i);
});
test('guide schema has five kinds, padding, localized labels and a preset', () => {
  const source = file('sections/lemoon-guide-page.liquid');
  const schema = JSON.parse(source.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
  expect(schema.settings.find(({ id }) => id === 'guide_kind').options.map(({ value }) => value)).toEqual(Object.values(kinds));
  expect(schema.disabled_on.groups).toEqual(['header', 'footer']);
  expect(schema.settings.filter(({ type }) => type === 'range').map(({ id }) => id)).toEqual(['padding_top', 'padding_bottom']);
  expect(schema.presets).toHaveLength(1);
  for (const locale of ['en.default', 'es']) {
    const copy = json(`locales/${locale}.schema.json`).sections.lemoon_guide;
    expect(copy.name).toBeTruthy();
    expect(copy.kind_label).toBeTruthy();
    for (const kind of Object.values(kinds)) expect(copy[kind]).toBeTruthy();
  }
  expect(source).toContain('#shopify-section-{{ section.id }}');
});
