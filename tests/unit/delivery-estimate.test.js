import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { renderComponentSection as render } from '../helpers/component-library-renderer.mjs';

const json = (path) => {
  const source = readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
  return JSON.parse(source.slice(source.indexOf('{')));
};
const token = '[PLAZO_ENTREGA]';
const shop = (value) => ({ metafields: { custom: value === undefined ? {} : { plazo_entrega_receta: { value } } } });
const legal = (value, content = `<p>Entrega ${token}</p>`, language = 'es') => render('lemoon-legal-page', {
  language,
  settings: { kind: 'shipping', use_section_content: true, content },
  context: { shop: shop(value), page: { title: 'Envíos', content: '' } },
});
const faq = (value, answer = `<p>Entrega ${token}</p>`, language = 'es') => render('lemoon-faq-page', {
  language,
  blocks: [{ id: 'delivery', type: 'question', settings: { group: 'ordering', question: '¿Cuánto demora?', answer } }],
  context: { shop: shop(value) },
});

test.each([['legal', legal], ['FAQ', faq]])('%s renders the merchant estimate safely and leaves unrelated Liquid text opaque', (_name, renderPage) => {
  const html = renderPage('<script>alert(1)</script> & 10 días', `<p>${token}; ${token}; {{ shop.name }}</p>`);
  expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt; &amp; 10 días');
  expect(html).not.toContain('<script>alert(1)</script>');
  expect(html.match(/&lt;script&gt;alert\(1\)&lt;\/script&gt;/g)).toHaveLength(2);
  expect(html).toContain('{{ shop.name }}');
  expect(html).not.toContain(token);
});

test.each([
  ['legal Spanish', legal, 'es', 'un plazo informado antes de finalizar la compra'],
  ['legal English', legal, 'en', 'a timeframe provided before checkout'],
  ['FAQ Spanish', faq, 'es', 'un plazo informado antes de finalizar la compra'],
  ['FAQ English', faq, 'en', 'a timeframe provided before checkout'],
])('%s uses the storefront language when the estimate is missing or blank', (_name, renderPage, language, expected) => {
  for (const value of [undefined, null, '', '   ']) {
    const html = renderPage(value, `<p>Entrega ${token}</p>`, language);
    expect(html).toContain(expected);
    expect(html).not.toContain(token);
  }
});

test.each([['legal', legal], ['FAQ', faq]])('%s preserves and escapes the configured value in both languages', (_name, renderPage) => {
  for (const language of ['es', 'en']) {
    const html = renderPage('3 < 5 & 7 days', `<p>Entrega ${token}</p>`, language);
    expect(html).toContain('3 &lt; 5 &amp; 7 days');
    expect(html).not.toContain('3 < 5 & 7 days');
    expect(html).not.toContain(token);
  }
});

test('shipping and FAQ templates render the shared estimate for all orders', () => {
  const legalTemplate = json('templates/page.envios-y-entregas.json').sections.main;
  const faqTemplate = json('templates/page.preguntas-frecuentes.json').sections.main;
  const blocks = faqTemplate.block_order.map(id => ({ id, ...faqTemplate.blocks[id] }));
  const value = '8 a 15 días hábiles';
  const shipping = render('lemoon-legal-page', { settings: legalTemplate.settings, context: { shop: shop(value), page: { title: 'Envíos', content: '' } } });
  const questions = render('lemoon-faq-page', { settings: faqTemplate.settings, blocks, context: { shop: shop(value) } });
  for (const html of [shipping, questions]) {
    expect(html).toContain(value);
    expect(html).not.toContain(token);
    expect(html).toMatch(/requieren? receta/i);
  }
});


test('shipping fallback resolves the estimate and return address without overriding CMS', () => {
  const settings = json('templates/page.envios-y-entregas.json').sections.main.settings;
  const show = (address, content = '') => render('lemoon-legal-page', {
    settings: { ...settings, use_section_content: false, return_address: address },
    context: { shop: shop('8 a 15 días hábiles'), page: { title: 'Envíos', content } },
  });
  const html = show('Calle <Ejemplo> 123');
  expect(html).toContain('8 a 15 días hábiles');
  expect(html).toContain('Calle &lt;Ejemplo&gt; 123');
  expect(html).not.toContain('[DIRECCION_DEVOLUCION]');
  expect(html).not.toContain(token);
  const empty = show('');
  expect(empty).not.toContain('[DIRECCION_DEVOLUCION]');
  expect(empty).not.toContain('Dirección de devolución:');
  const cms = show('Calle <Ejemplo> 123', '<p>Contenido CMS prioritario</p>');
  expect(cms).toContain('Contenido CMS prioritario');
  expect(cms).not.toContain('Calle &lt;Ejemplo&gt; 123');
});

test('shipping template renders the effective date and hides an unconfigured return address', () => {
  const settings = json('templates/page.envios-y-entregas.json').sections.main.settings;
  const html = render('lemoon-legal-page', { settings, context: { shop: shop('5 a 13 días hábiles'), page: { title: 'Envíos', content: '' } } });
  expect(html).toContain('4 de noviembre de 2026');
  expect(html).not.toContain('[DIRECCION_DEVOLUCION]');
  expect(html).not.toContain('Dirección de devolución:');
});
