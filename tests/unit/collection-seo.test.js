import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { createComponentEngine } from '../helpers/component-library-renderer.mjs';

const layoutHead = readFileSync(new URL('../../layout/theme.liquid', import.meta.url), 'utf8').split('<script type="module">')[0];

function renderHead({ handle, count, title, description, page = 1 }, language = 'es') {
  const engine = createComponentEngine({ language });
  engine.registerFilter('money_without_currency', () => { throw new Error('Product price is outside collection SEO coverage'); });
  return engine.parseAndRenderSync(layoutHead, {
    request: { page_type: 'collection', origin: 'https://lemoon.cl', path: `/collections/${handle}`, locale: { iso_code: language } },
    collection: { handle, all_products_count: count },
    canonical_url: `https://lemoon.cl/collections/${handle}`,
    page_title: title,
    page_description: description,
    current_page: page,
    shop: { name: 'lemoon', description: '' },
    settings: {},
    pages: {},
  });
}

test('the virtual all collection has localized, consistent search and social metadata', () => {
  const html = renderHead({ handle: 'all', count: 20, title: 'Products', description: '' });
  expect(html).toContain('Catálogo de lentes y accesorios &ndash; lemoon');
  expect(html).toContain('<meta name="description" content="Explora el catálogo de Lemoon.');
  expect(html).toContain('<meta property="og:title" content="Catálogo de lentes y accesorios">');
  expect(html).toContain('<link rel="canonical" href="https://lemoon.cl/collections/all">');
  expect(html).not.toContain('<meta name="robots"');
});

test('a merchant collection keeps its Shopify SEO text and localizes pagination', () => {
  const html = renderHead({ handle: 'opticos', count: 20, title: 'Armazones ópticos', description: 'Texto SEO desde Shopify.', page: 2 });
  expect(html).toContain('Armazones ópticos &ndash; Página 2 &ndash; lemoon');
  expect(html).toContain('<meta name="description" content="Texto SEO desde Shopify.">');
  expect(html).toContain('<meta property="og:description" content="Texto SEO desde Shopify.">');
});

test('merchant SEO titles are escaped in the document title', () => {
  const html = renderHead({ handle: 'opticos', count: 20, title: 'Lentes & <armazones>', description: '' });
  expect(html).toContain('Lentes &amp; &lt;armazones&gt; &ndash; lemoon');
});

test('an empty collection signals noindex without changing its canonical URL', () => {
  const html = renderHead({ handle: 'para-pantallas', count: 0, title: 'Para pantallas', description: '' });
  expect(html).toContain('<meta name="robots" content="noindex, follow">');
  expect(html).toContain('<link rel="canonical" href="https://lemoon.cl/collections/para-pantallas">');
});

test('collections below the catalogue threshold stay out of the index', () => {
  const thin = renderHead({ handle: 'opticos-ninos', count: 7, title: 'Niños', description: '' });
  const ready = renderHead({ handle: 'opticos-hombre', count: 8, title: 'Hombre', description: '' });
  expect(thin).toContain('<meta name="robots" content="noindex, follow">');
  expect(ready).not.toContain('<meta name="robots"');
});
