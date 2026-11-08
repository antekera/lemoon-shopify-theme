/**
 * Local LiquidJS overlay for the measurement-guide page. Shopify supplies the
 * surrounding document; this renderer does not upload or synchronize anything.
 * Theme source, template settings and locale files are read on every request.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { renderComponentSection } from '../tests/helpers/component-library-renderer.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
export const previewAssetPrefix = '/__lem129_preview/';
export const previewAssets = new Map([
  [`${previewAssetPrefix}lemoon-measurement-guide-analytics.js`, resolve(root, 'assets/lemoon-measurement-guide-analytics.js')],
  [`${previewAssetPrefix}lemoon-cookie-preferences.js`, resolve(root, 'assets/lemoon-cookie-preferences.js')],
  [`${previewAssetPrefix}component-lemoon-size-guide.css`, resolve(root, 'assets/component-lemoon-size-guide.css')],
  [`${previewAssetPrefix}lemoon-components.css`, resolve(root, 'assets/lemoon-components.css')],
]);

export function isSizeGuidePage(pathname) {
  return /^\/(?:en\/)?pages\/como-medir-tus-lentes\/?$/.test(pathname);
}

function pageSection(html) {
  // Skip comments and raw-text elements so markup-like script/style strings
  // cannot end the selected wrapper. Nested sections are counted explicitly.
  const tokens = /<!--[\s\S]*?-->|<(script|style|textarea)\b[^>]*>[\s\S]*?<\/\1\s*>|<\/?section\b[^>]*>/gi;
  const candidates = [];
  let current;
  let depth = 0;
  for (const token of html.matchAll(tokens)) {
    const tag = token[0];
    if (!/^<\/?section\b/i.test(tag)) continue;
    if (/^<\/section\b/i.test(tag)) {
      if (current && --depth === 0) {
        candidates.push({ ...current, closeStart: token.index, inner: html.slice(current.openEnd, token.index) });
        current = undefined;
      }
      continue;
    }
    if (current) { depth++; continue; }
    const id = tag.match(/\bid=["']shopify-section-(template--[^"']+__main)["']/i)?.[1];
    if (id) { current = { id, openEnd: token.index + tag.length }; depth = 1; }
  }
  if (candidates.length !== 1) throw new Error(`Expected one measurement-page main section; found ${candidates.length}`);
  return candidates[0];
}

function plainTitle(markup) {
  const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  return markup.replace(/<[^>]*>/g, '').replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (match, entity) => {
    if (!entity.startsWith('#')) return entities[entity.toLowerCase()] ?? match;
    const value = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
    return value > 0 && value <= 0x10ffff ? String.fromCodePoint(value) : match;
  }).trim();
}

export function overlaySizeGuidePage(html, { pathname }) {
  if (!isSizeGuidePage(pathname)) return html;
  const section = pageSection(html);
  const language = pathname.startsWith('/en/') ? 'en' : 'es';
  const localeRoot = language === 'en' ? '/en/' : '/';
  const templateSource = readFileSync(resolve(root, 'templates/page.guia-medidas.json'), 'utf8');
  const template = JSON.parse(templateSource.slice(templateSource.indexOf('{')));
  const guideSettings = template.sections?.main?.settings;
  if (template.sections?.main?.type !== 'lemoon-guide-page') throw new Error('Local size-guide template has no canonical main section');
  const titleMarkup = section.inner.match(/<h1\b[^>]*>([\s\S]*?)<\/h1\s*>/i)?.[1];
  const rendered = renderComponentSection('lemoon-guide-page', {
    language,
    id: section.id,
    settings: guideSettings,
    routes: { root_url: localeRoot, all_products_collection_url: `${localeRoot}collections/all` },
    context: { page: { title: titleMarkup ? plainTitle(titleMarkup) : '' }, request: { locale: { iso_code: language } } },
  });
  // The helper's test wrapper is discarded. Keep Shopify's original wrapper
  // and surrounding markup, including its attributes. The shared stylesheet
  // reference is redirected to the local allowlist below for local variants.
  const openEnd = rendered.indexOf('>') + 1;
  const closeStart = rendered.lastIndexOf('</section>');
  if (!openEnd || closeStart < openEnd) throw new Error('Local guide renderer did not emit its expected wrapper');
  let inner = rendered.slice(openEnd, closeStart);
  inner = inner.replaceAll('/assets/component-lemoon-size-guide.css', `${previewAssetPrefix}component-lemoon-size-guide.css`);
  inner = inner.replaceAll('/assets/lemoon-measurement-guide-analytics.js', `${previewAssetPrefix}lemoon-measurement-guide-analytics.js`);
  const document = html.slice(0, section.openEnd) + inner + html.slice(section.closeStart);
  return document.replace(/(href=["'])(?:\/cdn\/shop\/t\/\d+\/assets\/|\/assets\/)lemoon-components\.css(?:\?[^"']*)?(["'])/g,
    (_, prefix, quote) => `${prefix}${previewAssetPrefix}lemoon-components.css${quote}`);
}
