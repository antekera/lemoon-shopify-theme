import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { renderAdoption } from '../helpers/component-adoption-renderer.mjs';
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
  const html = renderAdoption('article-error');
  expect(html).toContain('value="Nombre &lt;&amp;&#34;"');
  expect(html).toContain('value="test@example.test"');
  expect(html).toContain('>Texto &lt;&amp;&#34;</textarea>');
  expect(html).not.toContain('&amp;lt;');
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

test('related articles prioritize shared topics and fill to three without current or duplicate IDs', async () => {
  const { renderJournalArticle, journalArticle } = await import('../helpers/journal-renderer.mjs');
  const current = journalArticle(12, { tags: ['Cuidado'] });
  const articles = [current, journalArticle(112, { tags: ['Estilo'] }), journalArticle(23, { tags: ['Cuidado'], title: 'Relacionado <&"' }), journalArticle(24, { tags: ['Cuidado'] }), journalArticle(25, { tags: ['Historias'] })];
  const html = renderJournalArticle({ article: current, articles });
  const related = html.split('<ul class="lemoon-article__related-list">')[1].split('</ul>')[0];
  expect(related.match(/<li /g)).toHaveLength(3);
  expect([...related.matchAll(/href="([^"]+)"/g)].map(([, url]) => url)).toEqual(['/blogs/news/articulo-23', '/blogs/news/articulo-24', '/blogs/news/articulo-112']);
  expect(related).toContain('Relacionado &lt;&amp;&#34;');
  expect(related).not.toContain('/blogs/news/articulo-12"');
});

test('related articles hide for a sole current article and render without a required image', async () => {
  const { renderJournalArticle, journalArticle } = await import('../helpers/journal-renderer.mjs');
  const article = journalArticle(1, { tags: [] });
  expect(renderJournalArticle({ article, articles: [article] })).not.toContain('<aside class="lemoon-article__related"');
  const html = renderJournalArticle({ article, articles: [article, journalArticle(2)] });
  expect(html).toContain('href="/blogs/news/articulo-2"');
  expect(html).not.toContain('<img');
});

test('article CMS body preserves semantic rich content while title and excerpt remain text', async () => {
  const { renderJournalArticle, journalArticle } = await import('../helpers/journal-renderer.mjs');
  const body = '<h2>Cuidados</h2><ul><li>Guarda tus lentes</li></ul><figure><img src="/assets/lemoon-category-opticos-generic-v1.jpg" alt="Estuche"><figcaption>Ilustración original.</figcaption></figure><iframe title="Demostración" src="https://www.youtube-nocookie.com/embed/example" width="560" height="315" loading="lazy"></iframe>';
  const html = renderJournalArticle({ article: journalArticle(1, { title: 'Título <&"', excerpt: '<p>Resumen <strong>editable</strong></p>', content: body }) });
  expect(html).toContain('Título &lt;&amp;&#34;');
  expect(html).toContain('Resumen editable');
  expect(html).toContain(body);
  expect(html).not.toContain('autoplay');
});

test('reading time counts words separated by adjacent HTML paragraphs and has a minimum of one minute', async () => {
  const { renderJournalArticle, journalArticle } = await import('../helpers/journal-renderer.mjs');
  const html = renderJournalArticle({ article: journalArticle(1, { content: '<p>palabra</p>'.repeat(201) }) });
  expect(html).toContain('2 min de lectura');
  expect(renderJournalArticle({ article: journalArticle(1, { content: '' }) })).toContain('1 min de lectura');
});
