import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../../', import.meta.url));
import { themeFontLinks } from './theme-fonts.mjs';
import { createComponentEngine } from './component-library-renderer.mjs';

// Synthetic measurements exercise presentation only; they are never Shopify data.
export function sizeGuideContext(scenario = 'complete') {
  const dimensions = scenario === 'partial' ? { lens_width: 52, temple: 145 } :
    scenario === 'invalid' ? { frame_width: 0, lens_width: -52, bridge: '18', lens_height: '52abc', temple: null, unknown: 140 } :
    scenario === 'unknown' ? { unknown: 140 } :
    scenario === 'empty-object' ? {} :
    ['missing', 'size-only'].includes(scenario) ? null : { frame_width: 140, lens_width: 52, bridge: 18, lens_height: 42, temple: 145 };
  const empty = ['missing', 'empty-object', 'invalid', 'unknown'].includes(scenario);
  const values = scenario === 'size-only' ? { frame_size: 'M' } : (empty || scenario === 'secondary-empty') ? {} : { frame_shape: 'rectangular', frame_material: 'acetato', frame_size: 'M', frame_width: 'medio', frame_weight: 22, gender: 'unisex', face_shapes_compatible: 'ovalado, corazón' };
  const custom = Object.fromEntries(Object.entries({ ...values, frame_dimensions: dimensions }).map(([key, value]) => [key, { value }]));
  return { product: { id: 'synthetic-size-guide', title: scenario === 'long-title' ? 'Armazón sintético <script>título largo</script> '.repeat(12) : 'Armazón sintético de prueba', tags: scenario === 'demo' ? ['lemoon-measurements-demo'] : [], metafields: { custom } }, routes: { root_url: '/' }, settings: scenario === 'long' ? { lemoon_size_guide_page: { url: '/pages/como-medir-tus-lentes', template_suffix: 'guia-medidas', published_at: '2026-10-04', content: `<p>${'Contenido sintético extenso para verificar scroll. '.repeat(140)}</p><a href="#fixture-end">Fin de las instrucciones</a>` } } : {}, section_id: 'size-fixture', section: { id: 'size-fixture' }, instance_id: 'size-fixture-drawer', drawer_instance_id: 'size-fixture-drawer' };
}

export function renderSizeContent(scenario, options = {}) {
  const context = { ...sizeGuideContext(scenario), ...options.context };
  if (options.presentation !== undefined) context.presentation = options.presentation;
  return createComponentEngine({ ...options, globals: { settings: context.settings } }).renderFileSync('lemoon-size-guide-content', context);
}

export function renderSizeGuideFixture(shell = 'standard', scenario = 'complete') {
  const context = sizeGuideContext(scenario);
  const engine = createComponentEngine({ globals: { settings: context.settings } });
  const inline = `<aside data-inline-measurements>${engine.renderFileSync('lemoon-frame-information', { ...context, instance_id: 'size-fixture-inline' })}</aside>`;
  const banner = '<p style="padding:16px">LEM-129 · Vista local con datos sintéticos; no representa un producto a la venta.</p>';
  if (shell === 'eyewear') {
    const source = readFileSync(resolve(root, 'sections/lemoon-eyewear-product.liquid'), 'utf8');
    const dialog = source.match(/<dialog class="lemoon-pdp__dialog lemoon-size-drawer"[\s\S]*?<\/dialog>/)[0];
    return readFileSync(resolve(root, 'tests/fixtures/eyewear-product.html'), 'utf8')
      .replace('</style>', '</style><style>html{box-sizing:border-box}*,*::before,*::after{box-sizing:inherit}:root{--font-body-family:var(--lemoon-font-body);--font-heading-family:var(--lemoon-font-heading);--font-body-scale:1;--font-heading-scale:1;--font-body-weight:400;--font-heading-weight:600;--color-background:255,255,255;--color-foreground:26,26,26;--color-shadow:11,31,58}</style><link rel="stylesheet" href="/assets/base.css"><link rel="stylesheet" href="/assets/component-lemoon-size-guide.css">')
      .replace('</head>', `${themeFontLinks}</head>`)
      .replace('<body>', `<body>${banner}`)
      .replace(/<dialog class="lemoon-pdp__dialog lemoon-size-drawer"[\s\S]*?<\/dialog>/, `${inline}${engine.parseAndRenderSync(dialog, context)}`);
  }
  const content = engine.renderFileSync('lemoon-product-size-guide', context);
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>LEM-129 · Guía de medidas</title>${themeFontLinks}<style>:root{--font-body-family:var(--lemoon-font-body);--font-heading-family:var(--lemoon-font-heading);--font-body-scale:1;--font-heading-scale:1;--font-body-weight:400;--font-heading-weight:600;--color-background:255,255,255;--color-foreground:26,26,26;--color-shadow:11,31,58}html{box-sizing:border-box;font-size:62.5%}*,*::before,*::after{box-sizing:inherit}body{margin:0;font-size:1.6rem}main{padding:24px;min-height:160vh}</style><link rel="stylesheet" href="/assets/lemoon-tokens.css"><link rel="stylesheet" href="/assets/base.css"><link rel="stylesheet" href="/assets/lemoon-components.css"><link rel="stylesheet" href="/assets/lemoon-eyewear-product.css"><link rel="stylesheet" href="/assets/lemoon-pdp-layout.css"><link rel="stylesheet" href="/assets/component-lemoon-size-guide.css"><script type="module" src="/assets/lemoon-pdp-tools.js"></script></head><body>${banner}<main><h1>Guía de medidas · Prueba local</h1><button type="button">Control anterior</button>${content}${inline}<button type="button">Control posterior</button><div id="fixture-end"></div></main></body></html>`;
}
