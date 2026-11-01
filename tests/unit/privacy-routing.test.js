import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { createComponentEngine, renderComponentSection } from '../helpers/component-library-renderer.mjs';

const nativePath = '/policies/privacy-policy';
const spanishPath = '/pages/politica-de-privacidad';
const origin = 'https://lemoon.cl';
const availablePage = { url: spanishPath, template_suffix: 'politica-de-privacidad', published_at: '2026-11-01T18:00:00Z' };
const unavailablePages = [
  ['absent', undefined],
  ['blank', null],
  ['empty', {}],
  ['an unpublished page object', { ...availablePage, published_at: null }],
  ['different template', { ...availablePage, template_suffix: 'privacidad' }],
];

function renderFooter(privacyPage, privacyPath = nativePath) {
  return renderComponentSection('footer', {
    context: {
      request: { page_type: 'page' },
      pages: { 'politica-de-privacidad': privacyPage },
      shop: { privacy_policy: { url: privacyPath } },
    },
  });
}

function footerPrivacyLinks(html) {
  const legalLinks = html.match(/<ul class="lemoon-footer__legal-links"[^>]*>([\s\S]*?)<\/ul>/)?.[1];
  return {
    legal: legalLinks?.match(/<a href="([^"]+)">Privacidad<\/a>/)?.[1],
    preferences: html.match(/class="lemoon-cookie-dialog__policy" href="([^"]+)"/)?.[1],
  };
}

// Render the actual canonical head block and actual meta-tags call together.
// The unrelated font/CSS/header-group machinery of the full layout is outside
// this unit's scope; no routing logic or metadata markup is recreated here.
const layout = readFileSync(new URL('../../layout/theme.liquid', import.meta.url), 'utf8');
const canonicalEnd = layout.indexOf('>', layout.indexOf('<link rel="canonical"')) + 1;
const metadataCall = layout.match(/{%\s*render 'meta-tags'[^%]*%}/)?.[0];
const routingHead = layout.slice(0, canonicalEnd) + metadataCall;

function renderHead(privacyPage, { path = nativePath, pageType = 'policy', privacyPath = nativePath } = {}) {
  const engine = createComponentEngine();
  // Required for parsing the actual snippet, but product-price execution is
  // deliberately excluded rather than replaced by an invented pricing filter.
  engine.registerFilter('money_without_currency', () => { throw new Error('Product prices are outside privacy-routing coverage'); });
  return engine.parseAndRenderSync(routingHead, {
    canonical_url: `${origin}${path}`,
    request: { page_type: pageType, path, origin, locale: { iso_code: 'es' } },
    pages: { 'politica-de-privacidad': privacyPage },
    shop: { privacy_policy: { url: privacyPath } },
    settings: {},
  });
}

function canonicalLinks(html) {
  return {
    canonical: html.match(/<link rel="canonical" href="([^"]+)"/)?.[1],
    openGraph: html.match(/<meta property="og:url" content="([^"]+)"/)?.[1],
  };
}

test.each(unavailablePages)('footer and cookie preferences retain native privacy when the Spanish page is %s', (_, privacyPage) => {
  expect(footerPrivacyLinks(renderFooter(privacyPage))).toEqual({ legal: nativePath, preferences: nativePath });
});

test('footer and cookie preferences use the same available Spanish privacy page', () => {
  expect(footerPrivacyLinks(renderFooter(availablePage))).toEqual({ legal: spanishPath, preferences: spanishPath });
});

test('the bottom legal row omits shipping and returns even when those pages exist', () => {
  const html = renderComponentSection('footer', {
    context: {
      pages: {
        'politica-de-privacidad': availablePage,
        'terminos-y-condiciones': { url: '/pages/terminos-y-condiciones' },
        'envios-y-entregas': { url: '/pages/envios-y-entregas' },
        politicas: { url: '/pages/politicas' },
      },
      shop: { privacy_policy: { url: nativePath } },
    },
  });
  const legalRow = html.match(/<ul class="lemoon-footer__legal-links"[^>]*>([\s\S]*?)<\/ul>/)?.[1];
  expect(legalRow).toContain(`href="${spanishPath}"`);
  expect(legalRow).toContain('href="/pages/terminos-y-condiciones"');
  expect(legalRow).toContain('data-cookie-preferences');
  expect(legalRow).not.toMatch(/href="\/pages\/(?:envios-y-entregas|politicas)"|>Envíos<|>Devoluciones</);
});

test('footer uses the localized page URL instead of constructing a root-language path', () => {
  const url = `/es-cl${spanishPath}`;
  expect(footerPrivacyLinks(renderFooter({ ...availablePage, url }, `/es-cl${nativePath}`))).toEqual({ legal: url, preferences: url });
});

test.each(unavailablePages)('native privacy keeps its canonical and Open Graph URL when the Spanish page is %s', (_, privacyPage) => {
  const expected = `${origin}${nativePath}`;
  expect(canonicalLinks(renderHead(privacyPage))).toEqual({ canonical: expected, openGraph: expected });
});

test('native privacy nominates the Spanish page consistently in canonical and Open Graph metadata', () => {
  const expected = `${origin}${spanishPath}`;
  expect(canonicalLinks(renderHead(availablePage))).toEqual({ canonical: expected, openGraph: expected });
});

test('localized native privacy nominates the localized Spanish page', () => {
  const path = `/es-cl${nativePath}`;
  const url = `/es-cl${spanishPath}`;
  const expected = `${origin}${url}`;
  expect(canonicalLinks(renderHead({ ...availablePage, url }, { path, privacyPath: path }))).toEqual({ canonical: expected, openGraph: expected });
});

test.each([
  ['another policy', '/policies/shipping-policy', 'policy'],
  ['an unrelated page', '/pages/contact', 'page'],
  ['the Spanish privacy page itself', spanishPath, 'page'],
])('%s retains its own canonical and Open Graph URL', (_, path, pageType) => {
  const expected = `${origin}${path}`;
  expect(canonicalLinks(renderHead(availablePage, { path, pageType }))).toEqual({ canonical: expected, openGraph: expected });
});
