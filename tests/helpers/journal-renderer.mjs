import { readFileSync } from 'node:fs';
import { createComponentEngine, renderComponentFixture } from './component-library-renderer.mjs';

const read = name => readFileSync(new URL(`../../${name}`, import.meta.url), 'utf8');
const escape = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const picture = '/assets/lemoon-category-opticos-generic-v1.jpg';

export function journalImage() {
  const source = { url: picture, width: 1402, height: 1122, alt: 'Ilustración editorial de prueba' };
  return { ...source, aspect_ratio: source.width / source.height, src: { ...source } };
}

// Shopify-owned tag/filter stand-ins are explicit. Section/snippet markup and
// CSS are read from the current theme, not reproduced as a hand-written page.
function engine() {
  const liquid = createComponentEngine();
  // Shopify globals remain visible through {% render %}; ordinary fixture
  // context properties do not survive LiquidJS's isolated render scope.
  liquid.options.globals.settings = { blog_card_style: 'standard', blog_card_color_scheme: 'scheme-1' };
  liquid.registerFilter('handleize', value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  liquid.registerFilter('time_tag', value => `<time datetime="${escape(value)}">1 de noviembre de 2026</time>`);
  const imageSources = new Map();
  liquid.registerFilter('image_url', (value, ...args) => {
    const url = typeof value === 'string' ? value : value?.url || value?.src?.url;
    if (!url) throw new Error('Journal image_url fixture requires a complete image Drop or URL');
    const width = args.find(([key]) => key === 'width')?.[1];
    const transformed = width ? `${url}?width=${width}` : url;
    imageSources.set(transformed, typeof value === 'object' ? value : {});
    return transformed;
  });
  liquid.registerFilter('image_tag', (url, ...args) => {
    const options = Object.fromEntries(args);
    const source = imageSources.get(url);
    return `<img src="${escape(url)}" alt="${escape(source.alt)}" width="${source.width}" height="${source.height}" loading="${escape(options.loading || 'lazy')}" sizes="${escape(options.sizes || '100vw')}">`;
  });
  return liquid;
}

export function journalArticle(id, overrides = {}) {
  const article = { id, title: `Artículo ${id}`, url: `/blogs/news/articulo-${id}`, excerpt: `<p>Extracto ${id} editable desde Shopify.</p>`, content: '<p>Contenido del CMS.</p>', tags: ['Estilo'], comments_count: 0, author: 'Lemoon', published_at: '2026-11-01T12:00:00Z', image: null, ...overrides };
  return { ...article, excerpt_or_content: article.excerpt || article.content };
}

export function renderJournal({ articles = [], blogTitle = 'Una nueva mirada', tags = [], currentTags = [], layout = 'collage', currentPage = 1, pages = 1, total = articles.length, showImage = true } = {}) {
  const source = read('sections/main-blog.liquid')
    .replace(/{%-?\s*schema\s*-?%}[\s\S]*?{%-?\s*endschema\s*-?%}/g, '')
    .replace(/{%-?\s*style\s*-?%}/g, '<style>').replace(/{%-?\s*endstyle\s*-?%}/g, '</style>')
    .replace(/{%-?\s*(?:paginate [^%]+|endpaginate)\s*-?%}/g, '')
    .replace(/{%-?\s*form\s+'customer',\s*id:\s*newsletter_id\s*-?%}/g, '<form data-shopify-form-fixture>')
    .replace(/{%-?\s*endform\s*-?%}/g, '</form>');
  return `<section id="shopify-section-journal-test">${engine().parseAndRenderSync(source, {
    section: { id: 'journal-test', settings: { layout, show_image: showImage, image_height: 'medium', show_date: true, show_author: false, show_newsletter: false, padding_top: 64, padding_bottom: 64 } },
    blog: { title: blogTitle, url: '/blogs/news', articles, all_tags: tags, 'comments_enabled?': false },
    current_tags: currentTags,
    paginate: { current_page: currentPage, pages, items: total },
    settings: { blog_card_style: 'standard' },
    routes: { all_products_collection_url: '/collections/all' },
  })}</section>`;
}

export function renderJournalArticle({ article = journalArticle(1), articles = [], image = false } = {}) {
  const blocks = [
    { id: 'title', type: 'title', settings: { blog_show_date: true, blog_show_author: true } },
    { id: 'image', type: 'featured_image', settings: { image_height: 'adapt' } },
    { id: 'content', type: 'content', settings: {} },
  ];
  if (image) article = { ...article, image: journalImage() };
  return `<section id="shopify-section-journal-test">${engine().renderFileSync('main-article', {
    section: { id: 'journal-test', blocks, settings: { padding_top: 64, padding_bottom: 64 } },
    settings: { animations_reveal_on_scroll: false },
    article, blog: { title: 'Una nueva mirada', url: '/blogs/news', articles, 'comments_enabled?': false },
    routes: { all_products_collection_url: '/collections/all' },
  })}</section>`;
}

export function journalBrowserFixture(content) {
  // Exact blog-card variables emitted by layout/theme.liquid. Without these,
  // calc(100% - 2 * var(--image-padding)) becomes invalid in this fixture.
  const cardVariables = '<style>:root{--blog-card-image-padding:0rem;--blog-card-corner-radius:0rem;--blog-card-text-alignment:left;--blog-card-border-width:0rem;--blog-card-border-opacity:0;--blog-card-shadow-opacity:0.1;--blog-card-shadow-visible:1;--blog-card-shadow-horizontal-offset:0rem;--blog-card-shadow-vertical-offset:0rem;--blog-card-shadow-blur-radius:0rem}</style>';
  return renderComponentFixture('controls', { themeBoxSizing: true }).replace('</head>', `${cardVariables}</head>`).replace(/<body>[\s\S]*?<script>/, `<body><main>${content}</main><script>`);
}

export function renderJournalScenario(scenario) {
  const longTitle = 'Una mirada distinta '.repeat(9) + 'PalabraExtremadamenteLarga'.repeat(8);
  const articles = Array.from({ length: 6 }, (_, index) => journalArticle(index + 1, { title: index === 0 ? longTitle : `Artículo ${index + 1}`, tags: [index === 0 ? 'Elegir tus lentes' : 'Estilo'] }));
  let content;
  if (scenario === 'blog-images') content = renderJournal({ articles: articles.map(article => ({ ...article, image: journalImage() })), tags: ['Elegir tus lentes', 'Estilo', 'Cuidado'] });
  else if (scenario === 'empty-topic') content = renderJournal({ currentTags: ['Cuidado'] });
  else if (scenario === 'single') content = renderJournal({ articles: [journalArticle(1)] });
  else if (scenario === 'article') {
    const body = '<h2>Cómo cuidar tus lentes</h2><p>' + 'Consejos útiles de cuidado. '.repeat(20) + '</p><iframe src="https://www.youtube-nocookie.com/embed/fixture" title="Demostración de cuidado" width="560" height="315" loading="lazy"></iframe><p><a href="https://example.test/fuente">Fuente consultada</a></p>';
    content = renderJournalArticle({ article: journalArticle(1, { title: longTitle, content: body }), articles, image: true });
  } else content = renderJournal({ articles, tags: ['Elegir tus lentes', 'Estilo', 'Cuidado'] });
  return journalBrowserFixture(content);
}
