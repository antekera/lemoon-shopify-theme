import { readFileSync } from 'node:fs';
import { createComponentEngine, renderComponentFixture } from './component-library-renderer.mjs';

const read = path => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const json = path => { const text = read(path); return JSON.parse(text.slice(text.indexOf('{'))); };
const escape = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
export const shapeParam = 'filter.p.m.custom.frame_shape';
export const faceGuideShapes = ['rectangular', 'redondo', 'geométrico', 'ovalado', 'aviador', 'ojo de gato'];

export function faceGuideSchema() {
  return JSON.parse(read('sections/lemoon-face-guide.liquid').match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
}

export function faceGuideSection() {
  const defaults = settings => Object.fromEntries(settings.filter(setting => 'default' in setting).map(({ id, default: value }) => [id, value]));
  const template = json('templates/page.guia-rostro.json').sections.main;
  const schema = faceGuideSchema();
  return {
    id: 'face-fixture', settings: { ...defaults(schema.settings), ...template.settings },
    blocks: template.block_order.map(id => {
      const block = template.blocks[id];
      return { id, type: block.type, shopify_attributes: `data-editor-block="${id}"`, settings: { ...defaults(schema.blocks.find(({ type }) => type === block.type).settings), ...block.settings } };
    }),
  };
}

// The real section and nested snippets are always rendered. Only Shopify-owned
// image transforms and collection/filter Drops use deterministic fixture inputs.
// This proves Liquid behavior locally, not Shopify rendering or live inventory.
export function renderFaceGuide({ section = faceGuideSection(), shapes = faceGuideShapes, filters, root = '/', language = 'es', catalogueURL = `${root === '/' ? '' : root.replace(/\/$/, '')}/collections/all` } = {}) {
  const engine = createComponentEngine({ language });
  // Shopify ID normalization; same adapter as the quiz/journal renderers.
  engine.registerFilter('handleize', value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  const imageSources = new Map();
  engine.registerFilter('image_url', (image, ...args) => {
    if (!image?.url) throw new Error('Face-guide fixture expects an Image-shaped object');
    const width = args.find(([key]) => key === 'width')?.[1];
    const url = width ? `${image.url}?width=${width}` : image.url;
    imageSources.set(url, image);
    return url;
  });
  engine.registerFilter('image_tag', (url, ...args) => {
    const opts = Object.fromEntries(args); const image = imageSources.get(url);
    return `<img src="${escape(url)}" alt="${escape(opts.alt ?? image.alt ?? '')}" width="${image.width}" height="${image.height}" loading="${escape(opts.loading || 'lazy')}"${opts.class ? ` class="${escape(opts.class)}"` : ''}>`;
  });
  const catalogue = { url: catalogueURL, handle: 'all', filters: filters ?? [{ param_name: shapeParam, type: 'list', values: shapes.map(value => ({ value, label: value, count: 4 })) }] };
  return `<section id="shopify-section-${escape(section.id)}">${engine.renderFileSync('lemoon-face-guide', {
    section, collections: { all: catalogue }, routes: { root_url: root, all_products_collection_url: catalogueURL },
    request: { page_type: 'page', design_mode: false }, settings: { animations_reveal_on_scroll: false },
  })}</section>`;
}

export function renderFaceGuideFixture(scenario = 'default') {
  const options = {};
  if (scenario === 'missing-filter') options.filters = [];
  if (scenario === 'missing-value') options.shapes = faceGuideShapes.filter(value => value !== 'geométrico');
  if (scenario === 'localized') Object.assign(options, { root: '/en', language: 'en' });
  if (scenario === 'merchant') {
    const section = faceGuideSection();
    Object.assign(section.blocks[0].settings, {
      name_label: 'Mi contorno <img src=x onerror="alert(1)">',
      cue_1: 'Primera pista de la tienda <script>window.injected=true</script>',
      cue_2: 'Segunda pista & referencia',
      reason: 'Una explicación propia de la tienda.',
      image: { url: '/assets/lemoon-category-opticos-generic-v1.jpg', width: 1402, height: 1122, alt: 'Retrato de prueba " <' },
    });
    options.section = section;
  }
  const shell = renderComponentFixture('controls', { themeBoxSizing: true });
  return shell.replace(/<body>[\s\S]*<\/body>/, `<body><main id="MainContent">${renderFaceGuide(options)}</main></body>`);
}
