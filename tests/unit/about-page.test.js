import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
const file = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const source = file('sections/lemoon-about-page.liquid');
const json = (path) => { const text = file(path); return JSON.parse(text.slice(text.indexOf('{'))); };
test('about uses real optional imagery and only configured verified history', () => {
  expect(source).toContain('if section.settings.image != blank');
  expect(source).toContain('section.settings.image | image_url');
  expect(source).toContain('if section.settings.story != blank');
  expect(source).toContain('{{ section.settings.story }}');
  expect(source).toContain('lemoon-about-page__abstract" aria-hidden="true"');
  expect(source).not.toMatch(/placeholder_svg_tag|https?:\/\/|page\.content/);
  expect(source.match(/<h1\b/g)).toHaveLength(1);
});
test('about offers locale-safe existing catalogue, measurement and contact routes', () => {
  expect(source).toContain('routes.all_products_collection_url');
  for (const handle of ['como-medir-tus-lentes','contact']) expect(source).toContain(`routes.root_url | append: '/pages/${handle}' | replace: '//', '/'`);
  for (const root of ['/','/en']) for (const handle of ['como-medir-tus-lentes','contact']) expect(`${root}/pages/${handle}`.replaceAll('//','/')).toBe(`${root === '/' ? '' : root}/pages/${handle}`);
});
test('about template and localized editor schema remain limited to the new alternative', () => {
  const template = json('templates/page.nosotros.json');
  expect(template.order).toEqual(['main']);
  expect(template.sections.main.type).toBe('lemoon-about-page');
  const schema = JSON.parse(source.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
  expect(schema.disabled_on.groups).toEqual(['header','footer']);
  expect(schema.presets).toHaveLength(1);
  expect(schema.settings.find(({id}) => id === 'story').default).toBeUndefined();
  expect(schema.settings.filter(({type}) => type === 'range').map(({id}) => id)).toEqual(['padding_top','padding_bottom']);
  for (const lang of ['en.default','es']) {
    const messages = json(`locales/${lang}.json`);
    const schemaMessages = json(`locales/${lang}.schema.json`);
    for (const [,path] of source.matchAll(/['"](?:t:)?(sections\.lemoon_about_page[^'"]+)['"]/g)) {
      const lookup = (obj) => path.split('.').reduce((value,key) => value?.[key],obj);
      expect(lookup(messages) || lookup(schemaMessages), `${lang}: ${path}`).toBeTruthy();
    }
    const copy = JSON.stringify(messages.sections.lemoon_about_page);
    expect(copy).not.toMatch(/\b20\d{2}\b|certific|garant|365|30 d[ií]as|taller|office|equipo|founded/i);
  }
});
