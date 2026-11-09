/** Local-only drawer asset/control overlay for native shell snapshots. */
import { readFileSync } from 'node:fs';
import { createComponentEngine } from '../tests/helpers/component-library-renderer.mjs';
import { previewAssetPrefix } from './preview-size-guide-page.mjs';

export function overlayDrawerPresentation(html, { language = 'es' } = {}) {
  let document = html;
  for (const name of ['cart-drawer.js', 'lemoon-mobile-nav.css', 'lemoon-mobile-nav.js', 'lemoon-collection-plp.css', 'pickup-availability.js']) {
    const escaped = name.replaceAll('.', '\\.');
    document = document.replace(new RegExp(`((?:href|src)=["'])(?:/cdn/shop/t/\\d+/assets/|/assets/)${escaped}(?:\\?[^"']*)?(["'])`, 'g'),
      (_, prefix, quote) => `${prefix}${previewAssetPrefix}${name}${quote}`);
  }
  if (!document.includes(`${previewAssetPrefix}component-lemoon-drawer.css`)) {
    document = document.replace('</head>', `<link rel="stylesheet" href="${previewAssetPrefix}component-lemoon-drawer.css"></head>`);
  }
  if (document.includes('data-lemoon-nav') && !document.includes('data-lemoon-nav-controls')) {
    const source = readFileSync(new URL('../snippets/lemoon-mobile-nav.liquid', import.meta.url), 'utf8');
    const controls = source.match(/  <div class="lemoon-mobile-nav__controls"[\s\S]*?<\/div>/)?.[0];
    if (!controls) throw new Error('Current mobile navigation controls are unavailable');
    const rendered = createComponentEngine({ language }).parseAndRenderSync(controls, {});
    const nav = /(<div\b[^>]*\bdata-lemoon-nav(?:\s|=)[^>]*>)/g;
    if ([...document.matchAll(nav)].length !== 1) throw new Error('Expected one native mobile navigation drawer');
    document = document.replace(nav, (_, opening) => opening + rendered);
  }
  return document;
}
