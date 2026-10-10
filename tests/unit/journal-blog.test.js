import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const section = read('sections/main-blog.liquid');
const json = (path) => { const source = read(path); return JSON.parse(source.slice(source.indexOf('{'))); };
test('journal uses native articles, real tag routes and pagination without mock content', () => {
  expect(section).toContain('paginate blog.articles by 6');
  expect(section).toContain('for article in blog.articles');
  expect(section).toContain('for tag in blog.all_tags');
  expect(section).toContain('tag | handleize');
  expect(section).toContain('tag | escape');
  expect(section).toContain("render 'pagination', paginate: paginate");
  expect(section).toContain("render 'article-card', blog: blog, article: article");
  expect(section).toContain('feature.title | escape');
  expect(section).not.toMatch(/figma.com|Cómo saber si unos lentes te quedan bien|Tu receta, sin enredos/);
  expect(section.match(/<h1\b/g)).toHaveLength(1);
});
test('newsletter requires email and explicit opt-in and uses native customer processing', () => {
  expect(section).toContain("form 'customer', id: newsletter_id");
  const email = section.match(/<input[^>]*type="email"[^>]*>/s)?.[0];
  expect(email).toContain('required');
  expect(email).toContain('form.email | escape');
  const consent = section.match(/<input[^>]*type="checkbox"[^>]*>/s)?.[0];
  expect(consent).toContain('name="contact[accepts_marketing]"');
  expect(consent).toContain('required');
  expect(consent).not.toContain('checked');
  expect(section).toContain('form.posted_successfully?');
  expect(section).toContain('role="alert"');
  expect(section).toContain('role="status"');
});
test('journal template and editor schema remain valid and localized', () => {
  const schema = JSON.parse(section.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
  expect(schema.disabled_on.groups).toEqual(['header', 'footer']);
  expect(schema.presets).toHaveLength(1);
  expect(schema.settings.filter(({type}) => type === 'range').map(({id}) => id)).toEqual(['padding_top','padding_bottom']);
  for (const template of ['blog.json','blog.editorial.json']) expect(json(`templates/${template}`).sections.main.type).toBe('main-blog');
  for (const locale of ['en.default','es']) {
    const messages = json(`locales/${locale}.json`);
    const schemaMessages = json(`locales/${locale}.schema.json`);
    for (const [, path] of section.matchAll(/['"](?:t:)?(sections\.lemoon_journal[^'"]+)['"]/g)) {
      const keys = path.split('.');
      const lookup = (obj) => keys.reduce((value,key) => value?.[key],obj);
      expect(lookup(messages) || lookup(schemaMessages), `${locale}: ${path}`).toBeTruthy();
    }
  }
});
