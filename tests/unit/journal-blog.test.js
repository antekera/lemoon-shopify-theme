import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { Liquid } from 'liquidjs';
const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const section = read('sections/main-blog.liquid');
const json = (path) => { const source = read(path); return JSON.parse(source.slice(source.indexOf('{'))); };
test.each([
  ['collage', 1, 6, 5, true],
  ['grid', 1, 6, 6, false],
  ['collage', 2, 6, 6, false],
  ['collage', 1, 1, 0, true],
  ['collage', 1, 0, 0, false],
])('journal %s page %i with %i articles keeps each article in its proper place', (layout, currentPage, count, gridCount, featured) => {
  const body = section.slice(section.indexOf('<div class="lemoon-journal page-width">'), section.indexOf("{%- if section.settings.show_newsletter -%}"));
  const engine = new Liquid({ root: new URL('../../snippets/', import.meta.url).pathname, extname: '.liquid' });
  engine.registerFilter('t', (key) => key);
  const articles = Array.from({ length: count }, (_, index) => ({ id: index + 1, title: `Article ${index + 1}`, url: `/blogs/news/article-${index + 1}`, content: '', excerpt: '' }));
  const html = engine.parseAndRenderSync(body, {
    section: { id: 'journal-test', settings: { layout, show_image: false } },
    blog: { articles, all_tags: [] },
    paginate: { current_page: currentPage, items: count, pages: 1 },
    settings: {},
  });
  const grid = html.split('<div class="lemoon-journal__grid">')[1] || '';
  expect(html.includes('class="lemoon-journal__feature"')).toBe(featured);
  expect((grid.match(/class="lemoon-journal__story"/g) || []).length).toBe(gridCount);
  for (const [index, article] of articles.entries()) {
    expect(html).toContain(`href="${article.url}"`);
    expect(grid.includes(`href="${article.url}"`)).toBe(!featured || index > 0);
  }
});
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
