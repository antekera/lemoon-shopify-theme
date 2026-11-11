import { createComponentEngine } from './component-library-renderer.mjs';
import { renderSizeGuideFixture, sizeGuideContext } from './size-guide-renderer.mjs';
import { readFileSync } from 'node:fs';

// Synthetic catalog data; real snippets/controllers, not a Shopify commercial fixture.
export function pdpInformationContext(scenario = 'complete') {
  const context = sizeGuideContext(scenario);
  context.product.description = scenario === 'no-description' ? '' : '<p>Un marco de <strong>acetato</strong> para cada día.</p><p>Descripción completa: incluye un segundo párrafo que debe conservarse.</p>';
  context.shop = {
    refund_policy: { url: '/policies/refund-policy' },
    shipping_policy: { url: '/policies/shipping-policy' },
    metafields: { custom: { plazo_entrega_receta: { value: '5 a 13 días hábiles' } } },
    enabled_payment_types: [],
  };
  context.warranty_page = { url: '/pages/garantias' };
  if (scenario === 'accessory') {
    context.product.type = 'Accesorio';
    context.product.tags = ['armazón'];
  }
  return context;
}

export function pdpInformationEngine(options = {}) {
  const engine = createComponentEngine(options);
  // LiquidJS 10.30 only recognizes five entities here. Match Shopify Liquid's
  // HTML_ESCAPE_ONCE_REGEXP, including decimal and named entities, for this fixture.
  // https://github.com/Shopify/liquid/blob/main/lib/liquid/standardfilters.rb
  const escapes = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  engine.registerFilter('escape_once', value => String(value ?? '').replace(/[\"><']|&(?!([a-zA-Z]+|(#\d+));)/g, token => escapes[token]));
  // Only the Shopify payment logo filter is modeled; enabled methods remain inputs.
  engine.registerFilter('payment_type_svg_tag', value => `<svg data-payment-type="${String(value).replaceAll('"', '&quot;')}" role="img"><title>${value}</title></svg>`);
  return engine;
}

// Render the actual standard description block branch without modeling the
// unrelated Shopify form, inventory, recommendations and checkout section APIs.
export function renderStandardDescriptionBlock(context) {
  const source = readFileSync(new URL('../../sections/main-product.liquid', import.meta.url), 'utf8');
  const branch = source.match(/\{%- when 'description' -%\}([\s\S]*?)\{%- when 'sku' -%\}/)?.[1];
  if (!branch) throw new Error('Standard description block branch missing');
  return pdpInformationEngine().parseAndRenderSync(branch, context);
}

// Hero-only Shopify fixture: preserve the real main section's root, generated
// padding styles, wrappers, gallery render call and Dawn CSS. Product images
// are deterministic local assets; purchase forms/Shopify section APIs are out
// of scope. The older size-guide shell below intentionally stays independent.
function heroFixtureContext(mediaCount = 2) {
  const context = pdpInformationContext();
  const raw = readFileSync(new URL('../../templates/product.json', import.meta.url), 'utf8');
  const main = JSON.parse(raw.slice(raw.indexOf('{'))).sections.main;
  const settings = main.settings;
  context.section = { id: 'hero-fixture', blocks: main.block_order.map(id => ({ ...main.blocks[id], id, shopify_attributes: '' })), settings: { ...settings, padding_top: 24, enable_sticky_info: true } };
  context.settings = { page_width: 1280, animations_reveal_on_scroll: true };
  context.template = { name: 'product' };
  context.product.media = ['amber', 'side'].slice(0, mediaCount).map((view, index) => ({
    id: index + 1, media_type: 'image', aspect_ratio: 1,
    preview_image: { src: `/assets/lemoon-product-demo-${view}.png`, aspect_ratio: 1, alt: 'Synthetic frame' },
  }));
  context.product.url = '/products/synthetic-model';
  context.product.price_min = 39900;
  context.product.price_max = 39900;
  context.product.selected_or_first_available_variant = { id: 101, featured_media: context.product.media[0], price: 39900, available: true };
  context.request = { page_type: 'product', origin: 'https://lemoon.cl' };
  const engine = pdpInformationEngine({ globals: {
    product: context.product, section: context.section, settings: context.settings, template: context.template,
  } });
  // The full section loop contains Shopify-only filters in branches not used
  // by this title/price/text fixture; those branches are never rendered here.
  engine.options.strictFilters = false;
  const escapeAttribute = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
  engine.registerFilter('image_url', image => image.src);
  engine.registerFilter('money', amount => `$${Number(amount).toLocaleString('es-CL')}`);
  engine.registerFilter('money_with_currency', amount => `$${Number(amount).toLocaleString('es-CL')} CLP`);
  engine.registerFilter('image_tag', (src, ...attributes) => `<img src="${escapeAttribute(src)}" width="1024" height="1024" ${attributes
    .filter(attribute => Array.isArray(attribute) && ['class', 'id', 'alt', 'loading', 'fetchpriority'].includes(attribute[0]))
    .map(([name, value]) => `${name}="${escapeAttribute(value)}"`).join(' ')}>`);
  for (const filter of ['external_video_url', 'external_video_tag', 'media_tag']) {
    engine.registerFilter(filter, () => { throw new Error(`${filter} is outside the image-only hero fixture`); });
  }
  return { context, engine };
}

function heroFixtureDocument(content, inlineStyle = '') {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PDP hero fixture</title>
    <style>:root{--font-body-scale:1;--font-heading-scale:1;--font-body-weight:400;--font-heading-weight:600;--color-background:255,255,255;--color-foreground:26,26,26;--color-shadow:11,31,58;--page-width:128rem}html{box-sizing:border-box;font-size:62.5%}*,*::before,*::after{box-sizing:inherit}body{margin:0;font-size:1.6rem}header{height:72px}</style>
    <link rel="stylesheet" href="/assets/lemoon-tokens.css"><link rel="stylesheet" href="/assets/base.css"><link rel="stylesheet" href="/assets/lemoon-components.css"><link rel="stylesheet" href="/assets/section-main-product.css"><link rel="stylesheet" href="/assets/lemoon-eyewear-product.css"><link rel="stylesheet" href="/assets/lemoon-pdp-layout.css"><link rel="stylesheet" href="/assets/component-slider.css">${inlineStyle}
    </head><body><header aria-label="Synthetic header"></header>${content}</body></html>`;
}

export function renderStandardPdpHeroFixture(mediaCount = 2, blocks = null) {
  const { context, engine } = heroFixtureContext(mediaCount);
  context.section.blocks = blocks || context.section.blocks.filter(block => ['title', 'price'].includes(block.type));
  const source = readFileSync(new URL('../../sections/main-product.liquid', import.meta.url), 'utf8');
  const root = source.match(/^<product-info\b[\s\S]*?\n>/)?.[0];
  const style = source.match(/\{%- style -%\}([\s\S]*?)\{%- endstyle -%\}/)?.[1];
  const blocksCapture = source.match(/\{%- liquid\s+assign product_form_id[\s\S]*?(?=<product-component)/)?.[0];
  const summaryAndWrappers = source.match(/<div class="page-width">[\s\S]*?(?=<div class="grid__item product__media-wrapper">)/)?.[0];
  const infoOpening = source.match(/<div class="product__info-wrapper[\s\S]*?<section[\s\S]*?>/)?.[0];
  if (!root || !style || !blocksCapture || !summaryAndWrappers || !infoOpening) throw new Error('Main PDP hero boundaries changed; update its fixture extraction');
  // Shopify app blocks and installment forms are represented by deterministic
  // placeholders; their position is still decided by the real section loop.
  const blocksSource = blocksCapture
    .replace(/\{%-?\s*form 'product'[\s\S]*?\{%-?\s*endform\s*-?%\}/g, '<form class="installment"></form>')
    .replace(/\{%\s*render block\s*%\}/g, '<aside data-test-app="{{ block.id }}">{{ block.settings.test_content }}</aside>');
  const media = '<div class="grid__item product__media-wrapper">{% render "product-media-gallery", variant_images: variant_images %}</div>';
  const html = engine.parseAndRenderSync(root + blocksSource + summaryAndWrappers + media + infoOpening + '{{ details_markup }}', context) +
    '<p>A short product description.</p></section></div></div></div></product-info>';
  return heroFixtureDocument(html, `<style>${engine.parseAndRenderSync(style, context)}</style>`);
}

export function renderDefaultGalleryRevealFixture() {
  const { context, engine } = heroFixtureContext();
  // No opt-out: other shared-gallery consumers retain the merchant's reveal setting.
  return heroFixtureDocument(engine.renderFileSync('product-media-gallery', { ...context, variant_images: [] }));
}

// Render the optical section's actual server-side summary over its existing
// deterministic interaction fixture; the controller and variant data stay real.
export function renderEyewearSsrFixture(scenario = 'complete', originalFixture = null) {
  const context = pdpInformationContext(scenario);
  context.product.url = '/products/synthetic-model';
  context.product.selected_or_first_available_variant = { id: 67616399392936, price: 39900, available: true };
  context.request = { page_type: 'product', origin: 'https://lemoon.cl' };
  const engine = pdpInformationEngine();
  engine.registerFilter('money', amount => `$${Number(amount).toLocaleString('es-CL')}`);
  const source = readFileSync(new URL('../../sections/lemoon-eyewear-product.liquid', import.meta.url), 'utf8');
  const start = source.indexOf('<div class="lemoon-mobile-summary lemoon-product-summary');
  const end = source.indexOf('<div class="lemoon-pdp__gallery">', start);
  if (start < 0 || end < 0) throw new Error('Optical SSR summary boundaries changed');
  const summary = engine.parseAndRenderSync('{% assign current_variant = product.selected_or_first_available_variant %}' + source.slice(start, end), context);
  let fixture = originalFixture || readFileSync(new URL('../fixtures/eyewear-product.html', import.meta.url), 'utf8');
  const oldSummary = /(<div class="lemoon-pdp__info">\s*)<nav class="lemoon-breadcrumb"[\s\S]*?<\/lemoon-product-tools>/;
  const oldPrice = /<div class="lemoon-pdp__price"[\s\S]*?<\/div>\s*<p class="lemoon-pdp__tax">[\s\S]*?<\/p>/;
  if (!oldSummary.test(fixture) || !oldPrice.test(fixture)) throw new Error('Optical interaction fixture boundaries changed');
  fixture = fixture.replace(/(<lemoon-eyewear\b[^>]*>)\s*<nav class="lemoon-breadcrumb"[\s\S]*?<\/nav>/, '$1');
  fixture = fixture.replace(oldSummary, '$1').replace(oldPrice, '');
  return fixture.replace('<div class="lemoon-pdp__grid">', `<div class="lemoon-pdp__grid">${summary}`);
}

export function renderPdpInformationFixture(shell = 'standard', scenario = 'complete') {
  const context = pdpInformationContext(scenario);
  const engine = pdpInformationEngine({ globals: { settings: context.settings } });
  const information = engine.renderFileSync('lemoon-frame-information', { ...context, instance_id: 'size-fixture-inline' });
  const introduction = engine.renderFileSync('lemoon-product-intro', context);
  const confidence = engine.renderFileSync('lemoon-pdp-purchase-confidence', context);
  let html = renderSizeGuideFixture(shell, scenario)
    .replace(/<aside data-inline-measurements>[\s\S]*?<\/aside>/, `<aside data-inline-measurements>${information}</aside>`);
  if (shell === 'eyewear') {
    html = renderEyewearSsrFixture(scenario, html);
    html = html.replace(/<div class="product__description rte">[\s\S]*?<\/div>/, '')
      .replace('<form method="post"', `${introduction}<form method="post"`)
      .replace(/<div class="lemoon-pdp__benefits">[\s\S]*?<\/div>/, confidence)
      .replace(/<aside data-inline-measurements>[\s\S]*?<\/aside>/, '')
      .replace(/<div class="lemoon-pdp__details">[\s\S]*?(?=<div id="EyewearReviews)/, `<div class="lemoon-pdp__details">${information}<dl><div><dt>SKU</dt><dd data-sku>LM-DALTON-DEMO-111</dd></div></dl></div>`);
  } else {
    html = html.replace('<main>', '<main><product-info class="lemoon-standard-pdp">')
      .replace('</main>', '</product-info></main>')
      .replace('<button type="button">Control anterior</button>', `<button type="button">Control anterior</button>${introduction}${confidence}`);
  }
  // The historical shell contains Shopify CDN URLs; use its local synthetic media.
  return html.replace(/\/cdn\/shop\/files\/lemoon-product-demo-(amber|diagonal|side|back)(?:_[\w-]+)?\.png/g, '/assets/lemoon-product-demo-$1.png')
    .replaceAll('/cdn/shop/files/lemoon-product-fallback.png', '/assets/lemoon-product-fallback.png');
}
