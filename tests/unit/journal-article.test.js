import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const source = read('sections/main-article.liquid');
const json = (path) => { const raw = read(path); return JSON.parse(raw.slice(raw.indexOf('{'))); };
test('article presents native CMS content and calculated reading time', () => {
  expect(source).toContain('article.title | escape');
  expect(source).toContain('article.excerpt | strip_html | escape');
  expect(source).toContain('{{ article.content }}');
  expect(source).toContain('article_words | divided_by: 200.0 | ceil | at_least: 1');
  expect(source).toContain('if article.image');
  expect(source).toContain('article.author | escape');
  expect(source).toContain('tag | escape');
  expect(source).toContain('tag | handleize');
  expect(source).toContain('routes.all_products_collection_url');
  expect(source).toContain('{{ article | structured_data }}');
  expect(source.match(/<h1\b/g)).toHaveLength(1);
  expect(source).not.toMatch(/6 min de lectura|figma\.com/);
});
test('native comments and sharing are retained with safe redisplayed inputs', () => {
  expect(source).toContain("form 'new_comment', article");
  expect(source).toContain('paginate article.comments by 5');
  expect(source).toContain('blog.comments_enabled?');
  expect(source).toContain('blog.moderated?');
  expect(source).toContain('form.posted_successfully?');
  expect(source).toContain('role="alert"');
  expect(source).toContain('role="status"');
  for (const field of ['author','email','body']) expect(source).toContain(`form.${field} | escape`);
  expect(source).toContain('comment.author | escape');
  expect(source).toContain("render 'share-button', block: block, share_link: share_url");
  expect(source).toContain('CommentForm-{{ section.id }}-');
});
test('article templates select semantic block order and localized schema/padding', () => {
  for (const template of ['article.json','article.editorial.json']) {
    const main = json(`templates/${template}`).sections.main;
    expect(main.type).toBe('main-article');
    expect(main.block_order).toEqual(['title','featured_image','content','share']);
    expect(main.settings.padding_top).toBe(64);
  }
  const schema = JSON.parse(source.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
  expect(schema.disabled_on.groups).toEqual(['header','footer']);
  expect(schema.presets).toHaveLength(1);
  expect(schema.settings.filter(({type}) => type === 'range').map(({id}) => id)).toEqual(['padding_top','padding_bottom']);
  for (const lang of ['en.default','es']) {
    const messages = json(`locales/${lang}.json`);
    const schemaMessages = json(`locales/${lang}.schema.json`);
    for (const [,path] of source.matchAll(/['"](?:t:)?(sections\.lemoon_article[^'"]+)['"]/g)) {
      const lookup = (obj) => path.split('.').reduce((value,key) => value?.[key],obj);
      expect(lookup(messages) || lookup(schemaMessages), `${lang}: ${path}`).toBeTruthy();
    }
  }
});
