import { readFileSync } from 'node:fs';
import { test, expect } from 'vitest';
const file = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const json = (path) => { const text = file(path); return JSON.parse(text.slice(text.indexOf('{'))); };
test('FAQ uses native accessible disclosure groups without custom keyboard code', () => {
  const section = file('sections/lemoon-faq-page.liquid');
  expect(section.match(/<h1\b/g)).toHaveLength(1);
  expect(section).toContain('<details');
  expect(section).toContain('<summary');
  expect(section).not.toMatch(/role="button"|aria-expanded=|<script/);
  expect(section).toContain(':focus-visible');
  expect(section).toContain('FaqGroup-{{ section.id }}-{{ group }}');
  expect(section).toContain('FaqQuestion-{{ section.id }}-{{ group }}-{{ question }}');
});
test('FAQ preserves merchant questions while the new section is the active page', () => {
  const template = json('templates/page.preguntas-frecuentes.json');
  expect(template.sections.main.type).toBe('lemoon-faq-page');
  expect(template.sections.legacy_faq.type).toBe('lemoon-faq');
  expect(template.sections.legacy_faq.disabled).toBe(true);
  expect(Object.keys(template.sections.legacy_faq.blocks)).toEqual(['fit', 'shipping', 'returns']);
  expect(template.order.filter((id) => !template.sections[id].disabled)).toEqual(['main']);
});
test('FAQ uses actual routes and conditional prescription/try-on copy in both languages', () => {
  const source = file('sections/lemoon-faq-page.liquid');
  expect(source).toContain('routes.account_login_url');
  expect(source).toContain('routes.all_products_collection_url');
  expect(source).toContain("routes.root_url | append: '/pages/'");
  expect(source).toContain("replace: '//', '/'");
  for (const locale of ['en.default', 'es']) {
    const copy = json(`locales/${locale}.json`).sections.lemoon_faq_page;
    for (const [group, count] of [['choosing', 3], ['lenses', 2], ['ordering', 3], ['policies', 3]]) {
      expect(copy[group].title).toBeTruthy();
      for (let i = 1; i <= count; i++) {
        expect(copy[group][`question_${i}`].question).toBeTruthy();
        expect(copy[group][`question_${i}`].answer).toBeTruthy();
      }
    }
    expect(JSON.stringify(copy)).not.toMatch(/365|30 días|envío gratis|free shipping|convenio|inteligencia artificial/i);
  }
  const es = json('locales/es.json').sections.lemoon_faq_page;
  expect(es.choosing.question_3.answer).toContain('solo');
  expect(es.lenses.question_1.answer).toContain('si');
});
test('FAQ has a valid localized padded editor schema and section-scoped styles', () => {
  const source = file('sections/lemoon-faq-page.liquid');
  const schema = JSON.parse(source.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
  expect(schema.disabled_on.groups).toEqual(['header', 'footer']);
  expect(schema.presets[0].name).toBe('t:sections.lemoon_faq_page.name');
  expect(schema.settings.filter(({ type }) => type === 'range').map(({ id }) => id)).toEqual(['padding_top', 'padding_bottom']);
  for (const locale of ['en.default', 'es']) expect(json(`locales/${locale}.schema.json`).sections.lemoon_faq_page.name).toBeTruthy();
  expect(source).toContain('#shopify-section-{{ section.id }}');
});

test('editor questions are escaped, answers use richtext, and complete custom blocks replace a group fallback', () => {
  const source = file('sections/lemoon-faq-page.liquid');
  expect(source).toContain('block.shopify_attributes');
  expect(source).toContain('block.settings.question | escape');
  expect(source).toContain('block.settings.link | escape');
  expect(source).toContain('block.settings.link_label | escape');
  expect(source).toContain('if custom_question_count == 0');
  expect(source).toContain('block.settings.question != blank and block.settings.answer != blank');
  const schema = JSON.parse(source.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
  expect(schema.blocks[0].settings.find(({ id }) => id === 'group').options.map(({ value }) => value)).toEqual(['choosing', 'lenses', 'ordering', 'policies']);
  expect(schema.blocks[0].settings.find(({ id }) => id === 'answer').type).toBe('richtext');
  expect(schema.max_blocks).toBe(32);
  for (const locale of ['en.default', 'es']) {
    const copy = json(`locales/${locale}.schema.json`).sections.lemoon_faq_page;
    for (const setting of schema.blocks[0].settings) {
      expect(copy[setting.label.split('.').at(-1)]).toBeTruthy();
      if (setting.default?.startsWith('t:')) expect(copy[setting.default.split('.').at(-1)]).toBeTruthy();
    }
  }
});
