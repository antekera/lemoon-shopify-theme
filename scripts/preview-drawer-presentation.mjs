/** Local-only drawer asset/control overlay for native shell snapshots. */
import { previewAssetPrefix } from './preview-size-guide-page.mjs';

export function overlayDrawerPresentation(html) {
  let document = html;
  for (const name of ['cart-drawer.js', 'lemoon-mobile-nav.css', 'lemoon-mobile-nav.js', 'lemoon-collection-plp.css', 'pickup-availability.js']) {
    const escaped = name.replaceAll('.', '\\.');
    document = document.replace(new RegExp(`((?:href|src)=["'])(?:/cdn/shop/t/\\d+/assets/|/assets/)${escaped}(?:\\?[^"']*)?(["'])`, 'g'),
      (_, prefix, quote) => `${prefix}${previewAssetPrefix}${name}${quote}`);
  }
  if (!document.includes(`${previewAssetPrefix}component-lemoon-drawer.css`)) {
    document = document.replace('</head>', `<link rel="stylesheet" href="${previewAssetPrefix}component-lemoon-drawer.css"></head>`);
  }
  if (document.includes('data-lemoon-nav')) {
    const nav = /(<div\b[^>]*\bdata-lemoon-nav(?:\s|=)[^>]*>)/g;
    if ([...document.matchAll(nav)].length !== 1) throw new Error('Expected one native mobile navigation drawer');
  }
  return document;
}
