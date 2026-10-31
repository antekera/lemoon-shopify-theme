import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createComponentEngine, renderComponentSection, renderComponentFixture } from './component-library-renderer.mjs';

const root = resolve(new URL('../..', import.meta.url).pathname);
const read = (path, sourceRoot = root) => readFileSync(resolve(sourceRoot, path), 'utf8');
const taxOwners = ['sections/main-cart-footer.liquid', 'snippets/cart-drawer.liquid', 'snippets/quick-order-list.liquid'];
const priceOwners = ['sections/main-product.liquid', 'sections/featured-product.liquid'];
const sliderOwners = ['sections/collection-list.liquid', 'sections/featured-blog.liquid', 'sections/multicolumn.liquid'];
export const taxCases = [false, true].flatMap(duties => [false, true].flatMap(taxes => [false, true].map(policy => ({ duties, taxes, policy }))));
export const priceCases = [
  { name: 'unconfigured', configured: false },
  { name: 'plain', breaks: [] },
  { name: 'sale', breaks: [], compare: 14000 },
  { name: 'below-tier', cart: 0 },
  { name: 'at-first-tier', cart: 2 },
  { name: 'at-last-tier', cart: 7, compare: 14000 },
  { name: 'above-last-tier', cart: 20 },
  { name: 'minimum-reaches-tier', cart: 0, minimum: 5 },
  { name: 'increment-reaches-tier', cart: 1, increment: 4 },
];
export const domScenarios = ['about', 'service-benefits', 'service-operations', 'crystal', 'password-social', 'default-social', 'facets-horizontal', 'facets-drawer', 'facets-vertical', 'collection-preferred', 'collection-fallback', 'collection-relevance', 'carousel', 'carousel-accessories', 'slider-collection', 'slider-blog', 'slider-multicolumn'];

function engine(sourceRoot) {
  const liquid = createComponentEngine({ sourceRoot });
  // Prices are deterministic fixture cents, not Shopify money formatting proof.
  liquid.registerFilter('money_with_currency', value => `${value} CLP`);
  liquid.registerFilter('standard_event_data', () => '{}');
  liquid.registerFilter('metafield_tag', () => { throw Error('Metafield richtext is outside sorting fixture scope'); });
  return liquid;
}
function renderSection(name, { sourceRoot, settings, context }) {
  return engine(sourceRoot).renderFileSync(name, { section: { id: 'consumer-fixture', settings: { padding_top: 36, padding_bottom: 36, ...settings }, blocks: [] }, settings: {}, routes: { root_url: '/', all_products_collection_url: '/collections/all' }, ...context });
}
function fragment(source, marker) {
  const start = source.indexOf(marker);
  if (start < 0) throw Error(`Missing source boundary: ${marker}`);
  let depth = 0;
  for (const tag of source.slice(start).matchAll(/<div\b[^>]*>|<\/div>/g)) {
    depth += tag[0].startsWith('</') ? -1 : 1;
    if (depth === 0) return source.slice(start, start + tag.index + tag[0].length);
  }
  throw Error(`Unbalanced source boundary: ${marker}`);
}
function renderCall(source, name) {
  return source.match(new RegExp(`{%-?\\s*render '${name}'[\\s\\S]*?-?%}`))?.[0];
}
export const normalizeMarkup = html => html.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();

export function renderTax(index, state, sourceRoot = root) {
  const source = read(taxOwners[index], sourceRoot);
  const template = renderCall(source, 'lemoon-cart-tax-note') ?? source.match(/<small class="tax-note[\s\S]*?<\/small>/)?.[0];
  if (!template) throw Error('Missing tax-note owner');
  const shipping_policy = { body: state.policy ? '<p>Policy</p>' : '', url: '/policies/shipping?x=1&y=2' };
  return engine(sourceRoot).parseAndRenderSync(template, { cart: { duties_included: state.duties, taxes_included: state.taxes }, shop: { shipping_policy } });
}
export function priceContext(state) {
  const variant = { id: 91, price: 10000, compare_at_price: state.compare ?? null, quantity_rule: { min: state.minimum ?? 1, increment: state.increment ?? 1 }, quantity_price_breaks: state.breaks ?? [{ quantity: 3, minimum_quantity: 3, price: 9000 }, { quantity: 8, minimum_quantity: 8, price: 7000 }] };
  return { product: { selected_or_first_available_variant: variant, 'quantity_price_breaks_configured?': state.configured !== false }, section: { id: 'contract-price' }, cart_qty: state.cart ?? 0 };
}
export function renderPrice(index, state, sourceRoot = root) {
  const source = read(priceOwners[index], sourceRoot);
  const start = source.lastIndexOf('{%- liquid', source.indexOf('assign volume_pricing_array'));
  const end = source.indexOf('</volume-pricing>', start) + '</volume-pricing>'.length;
  const endif = source.indexOf('{%- endif -%}', end) + '{%- endif -%}'.length;
  const template = source.slice(start, endif);
  return engine(sourceRoot).parseAndRenderSync(template, priceContext(state));
}
export function renderSlider(index, sourceRoot = root, postLimit = 4) {
  const source = read(sliderOwners[index], sourceRoot);
  const call = renderCall(source, 'lemoon-dawn-slider-controls');
  const capture = source.match(/{%-?\s*capture slider_control_classes[\s\S]*?endcapture\s*-?%}/)?.[0] ?? '';
  const template = call ? capture + call : fragment(source, '<div class="slider-buttons');
  return engine(sourceRoot).parseAndRenderSync(template, { section: { blocks: [1, 2, 3, 4], settings: { post_limit: postLimit } } });
}
export function renderSocial(order, enabled = ['instagram', 'youtube'], sourceRoot = root) {
  const liquid = engine(sourceRoot);
  liquid.options.globals.settings = Object.fromEntries(enabled.map(key => [`social_${key}_link`, `https://example.test/${key}?x=1&y=2`]));
  return liquid.renderFileSync('social-icons', { order });
}
const sorts = [{ value: 'manual', name: 'Destacados' }, { value: 'most-relevant', name: 'Relevancia' }, { value: 'created-descending', name: 'Nuevos' }, { value: 'best-selling', name: 'Vendidos' }, { value: 'price-ascending', name: 'Menor precio' }, { value: 'price-descending', name: 'Mayor precio' }, { value: 'title-descending', name: 'Título <&"' }];
export function renderContract(scenario, sourceRoot = root) {
  if (scenario === 'about') return renderComponentSection('lemoon-about-page', { sourceRoot, settings: { story: '<p>Historia <strong>real</strong></p>' }, routes: { root_url: '/es/' } });
  if (scenario.startsWith('service-')) return renderComponentSection('lemoon-service-page', { sourceRoot, settings: { kind: scenario.replace('service-', ''), verified_details: '<p>Confirmado</p>' }, routes: { root_url: '/es/' } });
  if (scenario.startsWith('crystal')) return renderComponentSection('lemoon-crystal-guide', { sourceRoot, settings: scenario === 'crystal-configurator' ? { configurator_product: { url: '/products/fixture', title: 'Prototipo <&"', variants: [{ id: 7 }], options_with_values: [{ name: 'Lentes' }] } } : {}, context: { collection: { handle: 'cristales' } }, routes: { root_url: '/es/' } });
  if (scenario.endsWith('social')) {
    const settings = Object.fromEntries(['twitter', 'facebook', 'pinterest', 'instagram', 'tiktok', 'tumblr', 'snapchat', 'youtube', 'vimeo'].map(key => [`social_${key}_link`, `https://example.test/${key}`]));
    settings.color_schemes = [{ id: 'scheme-1' }];
    const liquid = engine(sourceRoot);
    // Shopify settings is a global, including inside isolated render scopes.
    liquid.options.globals.settings = settings;
    if (scenario === 'password-social') return liquid.renderFileSync('main-password-footer', { section: { settings: { color_scheme: 'scheme-1' } } });
    return liquid.renderFileSync('social-icons');
  }
  if (scenario.startsWith('facets-')) {
    return engine(sourceRoot).renderFileSync('facets', { enable_filtering: false, enable_sorting: true, filter_type: scenario.replace('facets-', ''), results: { url: '/collections/all', filters: [], products_count: 0, all_products_count: 0, sort_by: 'title-descending', sort_options: sorts }, settings: {}, section: { id: 'contract' } });
  }
  if (scenario.startsWith('collection-')) {
    return renderSection('main-collection-product-grid', { sourceRoot, settings: { enable_sorting: true, products_per_page: 15, products_per_page_mobile: 16, columns_mobile: '2', columns_desktop: 4 }, context: { paginate: { pages: 1 }, collection: { id: 5, title: 'Colección <&"', handle: 'fixture', url: '/collections/fixture', products: [], products_count: 0, all_products_count: 0, filters: [], metafields: { custom: { plp_seo_copy: { value: '' }, seo_content: '', seo_block: '', plp_bottom_content: '', bottom_content: '' } }, sort_by: scenario.endsWith('fallback') ? 'title-descending' : scenario.endsWith('relevance') ? 'most-relevant' : 'price-descending', default_sort_by: 'manual', sort_options: scenario.endsWith('relevance') ? sorts : sorts.filter(o => o.value !== 'most-relevant') } } });
  }
  if (scenario.startsWith('carousel')) {
    const liquid = engine(sourceRoot);
    const fsRead = liquid.options.fs.readFileSync;
    // The canonical card is a delegated boundary: observe exact inputs, not a copy
    // of card markup. The list/filter/pagination sources execute unchanged.
    liquid.options.fs.readFileSync = path => path.endsWith('/card-product.liquid') ? '<article data-card="{{ card_product.id }}" data-section="{{ section_id }}" data-quick-add="{{ show_quick_add | default: false }}" data-square="{{ media_aspect_ratio }}" data-lazy="{{ lazy_load }}" data-skip-styles="{{ skip_styles }}" data-secondary="{{ show_secondary_image }}" data-vendor="{{ show_vendor | default: false }}" data-rating="{{ show_rating | default: false }}"></article>' : fsRead(path);
    const template = read(`templates/collection.${scenario.replace('-final', '')}.liquid`, sourceRoot).replace(/{% layout none %}/g, '').replace(/{%-?\s*(?:paginate [^%]+|endpaginate)\s*-?%}/g, '');
    const collection = { products: [{ id: 1, price: 1000, available: true, tags: ['A <&"'] }, { id: 2, price: 0, available: true }, { id: 3, price: 2000, available: false }, { id: 4, price: 3000, available: true, tags: [] }] };
    return liquid.parseAndRenderSync(template, { collection, paginate: { next: scenario.endsWith('-final') ? null : { url: '/collections/all?view=carousel&page=2' } } });
  }
  if (scenario === 'price-controller') return '<label for="Quantity-contract-price">Cantidad</label><input id="Quantity-contract-price" type="number" value="1" step="1" data-cart-quantity="0">' + renderPrice(0, priceCases.find(c => c.name === 'below-tier'), sourceRoot);
  if (scenario.startsWith('slider-')) return renderSlider(['slider-collection', 'slider-blog', 'slider-multicolumn'].indexOf(scenario), sourceRoot);
  throw Error(`Unknown consumer contract: ${scenario}`);
}
export function renderContractFixture(scenario, runtime = true) {
  let content = renderContract(scenario);
  if (!runtime) content = content.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
  if (runtime && scenario.startsWith('slider-')) content = `<slider-component><ul id="Slider-contract" style="display:flex;overflow:auto;width:200px;scroll-behavior:instant;list-style:none;padding:0;gap:0">${[1, 2, 3, 4].map(n => `<li id="Slide-contract-${n}" style="flex:0 0 200px;height:80px">Slide ${n}</li>`).join('')}</ul>${content}</slider-component>`;
  if (runtime && scenario === 'price-controller') content += '<script src="/assets/constants.js"></script><script src="/assets/pubsub.js"></script><script src="/assets/price-per-item.js"></script>';
  const shell = renderComponentFixture('controls').replace('</head>', scenario.startsWith('facets-') ? '<link rel="stylesheet" href="/assets/component-facets.css"></head>' : '</head>');
  return shell.replace(/<body>[\s\S]*?<script>/, `<body>${content}<script>`).replace('</body>', runtime ? '<script src="/assets/global.js"></script></body>' : '</body>');
}
