import { createComponentEngine, renderComponentFixture } from './component-library-renderer.mjs';
import { AssignTag, Drop } from 'liquidjs';

const escape = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const picture = '/assets/lemoon-category-opticos-generic-v1.jpg';

// Real section/snippet source is rendered by LiquidJS. These filters, tags and
// plain Product-shaped objects model only the deterministic inputs below;
// they are not Shopify ProductDrop, publication or currency-format evidence.
export function createQuizEngine({ language = 'es' } = {}) {
  const engine = createComponentEngine({ language });
  const originalFS = engine.options.fs;
  const adapt = source => source.replace(/{%-?\s*form\s+'product'[^%]*%}/g, '<form data-fixture-product-form>');
  engine.options.fs = {
    ...originalFS,
    readFileSync: path => adapt(originalFS.readFileSync(path)),
    readFile: async path => adapt(await originalFS.readFile(path)),
  };
  engine.options.globals.settings = {
    card_style: 'standard', card_color_scheme: 'scheme-1', currency_code_enabled: false,
    animations_reveal_on_scroll: false, card_show_vendor: false, page_width: 1200,
  };
  engine.options.globals.request = { page_type: 'page', design_mode: false };
  engine.options.globals.shop = { currency: 'CLP', money_format: '${{amount_no_decimals}}' };
  // LiquidJS preserves assigned BlankDrop/EmptyDrop objects. Their equality
  // against `blank` and truthiness differ from Shopify's absent-value behavior;
  // normalize only these sentinel assignments, never arbitrary image objects.
  engine.registerTag('assign', class QuizFixtureAssign extends AssignTag {
    *render(ctx) {
      yield* super.render(ctx);
      const value = ctx.bottom()[this.key];
      if (value instanceof Drop && (value.valueOf() === null || ['BlankDrop', 'EmptyDrop'].includes(value.constructor.name))) ctx.bottom()[this.key] = null;
    }
  });
  engine.registerFilter('standard_event_data', () => '{}');
  engine.registerFilter('placeholder_svg_tag', () => '<svg data-fixture-placeholder aria-hidden="true"></svg>');
  engine.registerFilter('json', value => JSON.stringify(value ?? null));
  engine.registerFilter('money', value => `$${Number(value ?? 0) / 100}`);
  engine.registerFilter('money_with_currency', value => `$${Number(value ?? 0) / 100} CLP`);
  engine.registerFilter('money_without_currency', value => String(Number(value ?? 0) / 100));
  engine.registerFilter('handleize', value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  const imageSources = new Map();
  engine.registerFilter('image_url', (image, ...args) => {
    const url = typeof image === 'string' ? image : image?.url || image?.src?.url || image?.preview_image?.url;
    if (!url) throw new Error('Quiz fixture image_url requires a valid image input');
    const width = args.find(([key]) => key === 'width')?.[1];
    const transformed = width ? `${url}?width=${width}` : url;
    imageSources.set(transformed, typeof image === 'object' ? image : {});
    return transformed;
  });
  engine.registerFilter('image_tag', (url, ...args) => {
    const opts = Object.fromEntries(args); const image = imageSources.get(url) || {};
    return `<img src="${escape(url)}" alt="${escape(opts.alt ?? image.alt ?? '')}" width="${image.width || 1402}" height="${image.height || 1122}" loading="${escape(opts.loading || 'lazy')}"${opts.class ? ` class="${escape(opts.class)}"` : ''}>`;
  });
  return engine;
}

function image(id, suffix, extra = {}) {
  const value = { id: `${id}-${suffix}`, url: picture, width: 1402, height: 1122, aspect_ratio: 1402 / 1122, alt: `Muestra ${suffix}`, ...extra };
  return { ...value, preview_image: { ...value }, src: { ...value } };
}
export const quizTrait = (group, code, label = code) => ({ group: { value: group }, code: { value: code }, label: { value: label } });
export const quizDictionary = () => Object.entries({
  color: ['bold', 'neutral', 'brown', 'light', 'black', 'two_tone', 'silver'],
  finish: ['matte', 'glossy'], pattern: ['tortoise'], transparency: ['transparent'],
  use: ['work', 'everyday', 'going_out', 'outdoors'], presence: ['compact', 'medium', 'oversize'],
}).flatMap(([group, codes]) => codes.map(code => ({ group, code })))
  .map((trait, index) => ({ id: `gid://shopify/Metaobject/${index + 100}`, ...trait }));
export const quizAvailableFilters = () => ['filter.p.product_type', 'filter.p.m.custom.frame_shape', 'filter.p.m.custom.frame_material', ...['color', 'finish', 'pattern', 'transparency', 'use', 'presence'].map(axis => `filter.v.m.custom.style_filter_${axis}`)];

export function quizProduct(id, { shape = 'rectangular', material = 'acetato', ready = true, demo = true, noMedia = false, unavailable = false, category = 'Óptico', title = `Lente de prueba ${id}` } = {}) {
  const blue = image(id, 'blue'); const tortoise = image(id, 'tortoise');
  const variant = (variantId, name, media, traits, price) => ({
    id: variantId, product: { id }, title: name, options: [name], price, compare_at_price: null, available: !unavailable,
    featured_media: noMedia ? null : media, featured_image: noMedia ? null : media,
    url: `/products/lente-${id}?variant=${variantId}`, quantity_rule: { min: 1, increment: 1 }, unit_price_measurement: null,
    metafields: { custom: { style_traits: { value: traits } } },
  });
  const variants = [
    variant(id * 10 + 1, 'Azul', blue, [quizTrait('color', 'bold'), quizTrait('pattern', 'plain')], 10000 + id),
    variant(id * 10 + 2, 'Carey', tortoise, [quizTrait('color', 'brown'), quizTrait('pattern', 'tortoise'), quizTrait('finish', 'glossy')], 14000 + id),
  ];
  return {
    id, title, handle: `lente-${id}`, url: `/products/lente-${id}`, available: !unavailable, vendor: 'Lemoon', type: category, tags: [],
    variants, selected_or_first_available_variant: variants[0], selected_variant: null,
    featured_media: noMedia ? null : blue, featured_image: noMedia ? null : blue, media: noMedia ? [] : [blue, tortoise], images: noMedia ? [] : [blue, tortoise],
    price: variants[0].price, price_min: variants[0].price, price_max: variants[1].price, price_varies: true,
    compare_at_price: null, compare_at_price_varies: false, has_only_default_variant: false,
    options: ['Color'], options_with_values: [{ name: 'Color', position: 1, values: [
      { name: 'Azul', selected: true, variant: variants[0], swatch: { color: { rgb: '51,79,131' } } },
      { name: 'Carey', selected: false, variant: variants[1], swatch: { color: { rgb: '137,90,48' } } },
    ] }],
    metafields: { custom: {
      style_quiz_ready: { value: ready }, style_quiz_demo: { value: demo },
      frame_shape: { value: shape }, frame_material: { value: material }, frame_width: { value: 'estándar' },
      style_traits: { value: [quizTrait('finish', 'matte'), quizTrait('use', 'work'), quizTrait('presence', 'compact')] },
    } },
  };
}

export function fixtureProducts(scenario = 'default') {
  if (scenario === 'empty') return [];
  if (scenario === 'missing-media') {
    const product = quizProduct(601);
    const diagonal = image(601, 'blue-diagonal', { url: '/assets/lemoon-quiz-category-optical-studio-v1-480.jpg', alt: 'card-diagonal:azul' });
    product.variants[1].featured_media = null;
    product.variants[1].featured_image = null;
    product.media = [product.featured_media, diagonal];
    product.images = [product.featured_image, diagonal];
    return [product];
  }
  if (scenario === 'categories') return [
    quizProduct(301, { category: 'Óptico' }),
    quizProduct(302, { category: 'Solar' }),
    quizProduct(303, { category: 'Sunglasses' }),
    quizProduct(304, { category: 'Accesorios' }),
  ];
  if (scenario === 'colors') {
    const traits = [
      [quizTrait('color', 'brown')], [quizTrait('color', 'light')],
      [quizTrait('color', 'black')], [quizTrait('color', 'two_tone')],
      [quizTrait('color', 'silver')], [],
      [quizTrait('transparency', 'transparent')], [quizTrait('pattern', 'tortoise')],
      [quizTrait('color', 'bold')],
    ];
    return traits.map((values, index) => {
      const product = quizProduct(401 + index, { material: 'metal' });
      product.metafields.custom.style_traits.value = values;
      product.variants.forEach(variant => { variant.metafields.custom.style_traits.value = values; });
      return product;
    });
  }
  // 27 eligible products exercise two complete 12-card batches plus a final partial batch.
  if (scenario === 'paginated') return Array.from({ length: 27 }, (_, index) => quizProduct(201 + index));
  const products = [quizProduct(101, { shape: 'redondo' }), ...[102, 103, 104, 105, 106].map(id => quizProduct(id, { noMedia: id === 106 }))];
  if (scenario === 'unsafe') products[0].title = 'Lente <img src=x onerror="alert(1)">';
  // Ineligible rows test the actual Liquid eligibility boundary.
  products.push(quizProduct(107, { ready: false }), quizProduct(108, { unavailable: true }));
  return products;
}

export function renderQuizSection({ scenario = 'default', products = fixtureProducts(scenario), language = 'es', sectionId = 'quiz-fixture', traits = quizDictionary(), types = ['Óptico', 'Ópticos', 'Optical', 'Solar', 'Solares', 'Lentes de sol', 'Sunglasses'], dictionaryPages = 1, availableFilters = quizAvailableFilters() } = {}) {
  const collection = { handle: 'quiz-fixture', url: '/collections/quiz-fixture', title: 'Colección de prueba', products, products_count: products.length, all_products_count: products.length };
  const engine = createQuizEngine({ language });
  engine.options.globals.shop.types = types;
  return `<section id="shopify-section-${escape(sectionId)}">${engine.renderFileSync('lemoon-style-quiz', {
    section: { id: sectionId, settings: { catalogue: collection, padding_top: 64, padding_bottom: 64 }, blocks: [] },
    collection, collections: { 'quiz-fixture': collection, all: { ...collection, filters: availableFilters.map(param_name => ({ param_name })) } }, all_products: Object.fromEntries(products.map(product => [product.handle, product])),
    // Shopify Liquid exposes system.id as a number, unlike Admin GraphQL GIDs.
    metaobjects: { lemoon_style_trait: { values: traits.map(({ id, group, code }) => ({ system: { id: Number(id.split('/').at(-1)) }, ...quizTrait(group, code) })) } },
    paginate: { pages: dictionaryPages, current_page: 1, items: traits.length },
    routes: { root_url: '/', all_products_collection_url: '/collections/all' },
  })}</section>`;
}

export function renderQuizFixture(scenario = 'default') {
  let content = renderQuizSection({ scenario });
  if (scenario === 'malformed') content = content.replace(/(<script type="application\/json" data-quiz-filter-config>)[\s\S]*?(<\/script>)/, '$1{broken$2');
  const shell = renderComponentFixture('controls', { themeBoxSizing: true });
  // Exact product-card settings emitted by layout/theme.liquid. Omitting these
  // collapses the card's absolute media width despite successful image loads.
  const layoutContext = '<style>:root{--page-width:120rem;--page-width-margin:0rem;--product-card-image-padding:0rem;--product-card-corner-radius:0rem;--product-card-text-alignment:left;--product-card-border-width:0rem;--product-card-border-opacity:0;--product-card-shadow-opacity:0.1;--product-card-shadow-visible:1;--product-card-shadow-horizontal-offset:0rem;--product-card-shadow-vertical-offset:0rem;--product-card-shadow-blur-radius:0rem}</style>';
  // The same brand font stylesheet used by theme.liquid; functional tests do
  // not depend on network font availability and screenshots report that limit.
  const fonts = '<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=Urbanist:wght@300;400;500;600;700&display=swap" rel="stylesheet">';
  return shell.replace('</head>', `${layoutContext}${fonts}</head>`).replace(/<body>[\s\S]*?<script>/, `<body><main id="MainContent">${content}</main><script>`)
    .replace('</body>', '<script src="/assets/constants.js"></script><script src="/assets/pubsub.js"></script><script src="/assets/global.js"></script></body>');
}
