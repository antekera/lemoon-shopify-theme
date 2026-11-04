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

test('shipping legacy template reads the native policy and FAQ uses the configured estimate', () => {
  const settings = json('templates/page.envios-y-entregas.json').sections.main.settings;
  const faqTemplate = json('templates/page.preguntas-frecuentes.json').sections.main;
  const blocks = faqTemplate.block_order.map(id => ({ id, ...faqTemplate.blocks[id] }));
  const shipping = render('lemoon-legal-page', { settings, context: { shop: { shipping_policy: { body: '<p>Native shipping policy</p>' } }, page: { handle: 'envios-y-entregas', title: 'Envíos', content: '' } } });
  const questions = render('lemoon-faq-page', { settings: faqTemplate.settings, blocks, context: { shop: shop('8 a 15 días hábiles') } });
  expect(shipping).toContain('Native shipping policy');
  expect(questions).toContain('8 a 15 días hábiles');
  expect(settings).not.toHaveProperty('content');
});

test('shipping section fallback still resolves estimate and return address', () => {
  const settings = { kind: 'shipping', content: `<p>${token}</p><p>[DIRECCION_DEVOLUCION]</p>` };
  const show = (address, content = '') => render('lemoon-legal-page', { settings: { ...settings, return_address: address }, context: { shop: shop('8 a 15 días hábiles'), page: { title: 'Envíos', content } } });
  expect(show('Calle <Ejemplo>')).toContain('Calle &lt;Ejemplo&gt;');
  expect(show('')).not.toContain('[DIRECCION_DEVOLUCION]');
  expect(show('Calle', '<p>Contenido CMS prioritario</p>')).toContain('Contenido CMS prioritario');
});
