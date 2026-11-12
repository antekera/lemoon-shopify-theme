import { renderComponentSection } from './component-library-renderer.mjs';
import { themeFontLinks } from './theme-fonts.mjs';

export function renderSizeGuidePageFixture(scenario = 'default', localeRoot = '/') {
  const settings = { guide_kind: 'measurements', padding_top: 64, padding_bottom: 64 };
  if (scenario === 'editor') Object.assign(settings, {
    measurements_intro: '<p>Introducción editable de prueba.</p>',
    measurements_step_1_title: 'Primero: revisa la patilla',
    measurements_step_1_body: '<p>Cuerpo editorial de prueba.</p><ul><li>Una indicación editable.</li></ul>',
    measurements_help_body: '<p>Ayuda editorial de prueba.</p>',
  });
  if (scenario === 'blank') Object.assign(settings, { measurements_intro: '<p></p>', measurements_step_1_body: '<p>&nbsp;</p>', measurements_help_body: '<p> </p>' });
  const title = scenario === 'long' ? 'Cómo medir un armazón con un título editorial extenso '.repeat(9) : 'Cómo medir tus anteojos';
  const content = renderComponentSection('lemoon-guide-page', {
    id: 'measurement-page-fixture', settings,
    routes: { root_url: localeRoot, all_products_collection_url: `${localeRoot === '/' ? '' : localeRoot}/collections/all` },
    context: { page: { title } },
  });
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>LEM-105 · Guía de medidas local</title>${themeFontLinks}<style>:root{--font-body-family:var(--lemoon-font-body);--font-heading-family:var(--lemoon-font-heading);--font-body-scale:1;--font-heading-scale:1;--font-body-weight:400;--font-heading-weight:600;--color-background:255,255,255;--color-foreground:26,26,26;--color-shadow:11,31,58}html{box-sizing:border-box;font-size:62.5%}*,*::before,*::after{box-sizing:inherit}body{margin:0;font-size:1.6rem}</style><link rel="stylesheet" href="/assets/lemoon-tokens.css"><link rel="stylesheet" href="/assets/base.css"><link rel="stylesheet" href="/assets/lemoon-components.css"></head><body><p style="padding:16px">LEM-105 · Preview local del código Liquid con contenido de prueba; sin asignación de plantilla en Shopify.</p><main>${content}</main></body></html>`;
}
