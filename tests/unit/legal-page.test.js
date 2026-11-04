import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { createComponentEngine, renderComponentSection } from '../helpers/component-library-renderer.mjs';
import { renderAdoption } from '../helpers/component-adoption-renderer.mjs';
const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const json = (path) => { const source = read(path); return JSON.parse(source.slice(source.indexOf('{'))); };

test('legal shell preserves real CMS content, escapes headings and isolates native privacy fallback', () => {
 const source = read('sections/lemoon-legal-page.liquid');
 const html = renderAdoption('legal-shipping');
 expect(html).toContain('<h1>Legal &lt;&amp;&#34;</h1>');
 expect(source).toContain("render 'lemoon-business-content', content: page.content");
 expect(source).toContain('{{ section.settings.intro | escape }}');
 expect(source).toMatch(/elsif section.settings.kind == 'privacy' and shop.privacy_policy.body != blank[\s\S]*?render 'lemoon-business-content', content: shop.privacy_policy.body/);
 expect(source).toContain("'sections.lemoon_legal_page.empty_content' | t");
 expect(html.match(/<h1\b/g)).toHaveLength(1);
 const renderedCopy = html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
 expect(renderedCopy).not.toMatch(/30 días|365 días|\$\d|[0-9]+%/);
});

test('legal pages omit the sidebar and eyebrow while preserving localized and configured contact paths', () => {
 const source = read('sections/lemoon-legal-page.liquid');
 expect(renderAdoption('legal-shipping')).toContain('href="/es/pages/contact"');
 expect(renderAdoption('legal-terms')).toContain('href="/ayuda?x=1&amp;y=2"');
 for (const kind of ['shipping','returns','terms','privacy','warranty']) {
  const html = renderAdoption(`legal-${kind}`);
  expect(html).toContain('<p>CMS <strong>original</strong></p>');
  expect(html).not.toMatch(/<nav\b|lemoon-legal-page__eyebrow/);
 }
 const schema = JSON.parse(source.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
 // Keep saved editor settings compatible even though the lateral navigation is removed.
 for (const link of ['shipping_url','returns_url','terms_url','privacy_url','warranty_url']) expect(schema.settings.map(({ id }) => id)).toContain(link);
 expect(source).not.toMatch(/href="\/pages\//);
});

test('four legal templates select their explicit kinds and schema uses valid translated padding controls', () => {
 const kinds = {'envios-y-entregas':'shipping','politica-de-devoluciones':'returns','terminos-y-condiciones':'terms','garantias':'warranty'};
 for (const [handle,kind] of Object.entries(kinds)) {
  const template = json(`templates/page.${handle}.json`);
  expect(template.order).toEqual(['main']);
  expect(template.sections.main.type).toBe('lemoon-legal-page');
  expect(template.sections.main.settings.kind).toBe(kind);
 }
 const source = read('sections/lemoon-legal-page.liquid');
 const schema = JSON.parse(source.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
 expect(schema.settings.filter(({type}) => type === 'range').map(({id}) => id)).toEqual(['padding_top','padding_bottom']);
 expect(schema.settings.find(({id}) => id === 'use_section_content')).toMatchObject({ type: 'checkbox', default: false });
 expect(schema.presets[0].name).toBe('t:sections.lemoon_legal_page.name');
 expect(schema.disabled_on.groups).toEqual(['header','footer']);
});

test('new legal copy and schema keys have English and Spanish translations without filling business claims', () => {
 const source = read('sections/lemoon-legal-page.liquid');
 const keys = [...source.matchAll(/['"](?:t:)?(sections\.lemoon_legal_page[^'"]+)['"]/g)].map((match) => match[1]);
 expect(keys.length).toBeGreaterThan(5);
 for (const locale of ['en.default','es']) {
  const text = json(`locales/${locale}.json`); const schemaText = json(`locales/${locale}.schema.json`);
  for (const key of keys) { const lookup = (object) => key.split('.').reduce((value,part) => value?.[part],object); expect(lookup(text)||lookup(schemaText),`${locale}: ${key}`).toBeTruthy(); }
 }
});

test('legal shell keeps native privacy fallback and demo privacy heading separate from CMS', () => {
 const normal = renderComponentSection('lemoon-legal-page', { settings: { kind: 'privacy' }, context: { page: { title: 'CMS <&', content: '' }, shop: { privacy_policy: { body: '<p>Native privacy</p>' } } } });
 expect(normal).toContain('<h1>CMS &lt;&amp;</h1>');
 expect(normal).toContain('<p>Native privacy</p>');
 const demo = renderComponentSection('lemoon-legal-page', { settings: { kind: 'privacy', demo_data: true, demo_content: '<p>Demo</p>' }, context: { page: { title: 'CMS title' } } });
 expect(demo).toContain('<h1>Privacidad</h1>');
 expect(demo).not.toContain('<h1>CMS title</h1>');
});

test('the Spanish privacy template reads only the native policy without extra introduction or demo content', () => {
 const template = json('templates/page.politica-de-privacidad.json');
 expect(template.sections.main.settings).toMatchObject({ kind: 'privacy', use_native_privacy: true, demo_data: false, padding_top: 64, padding_bottom: 64 });
 const html = renderComponentSection('lemoon-legal-page', {
  settings: { ...template.sections.main.settings, demo_data: true, demo_content: '<p>Conflicting demo</p>', intro: 'Conflicting introduction' },
  context: {
   page: { title: 'Conflicting CMS title', content: '<p>Conflicting CMS</p>' },
   shop: { privacy_policy: { title: 'Política de privacidad', body: '<p><strong>Fecha de entrada en vigor:</strong> 1 de noviembre de 2026</p><p>[RAZÓN SOCIAL POR COMPLETAR]</p>' } },
  },
 });
 expect(html).toContain('<h1>Política de privacidad</h1>');
 expect(html).toContain('<p><strong>Fecha de entrada en vigor:</strong> 1 de noviembre de 2026</p>');
 expect(html).toContain('<p>[RAZÓN SOCIAL POR COMPLETAR]</p>');
 expect(html).not.toMatch(/Conflicting|lemoon-legal-page__intro\"|lemoon-legal-page__eyebrow|<nav\b/);
 expect(html.indexOf('<h1>')).toBeLessThan(html.indexOf('Fecha de entrada en vigor:'));
});

test('native privacy mode shows the localized empty state instead of silently using other copy', () => {
 const html = renderComponentSection('lemoon-legal-page', {
  settings: { kind: 'privacy', use_native_privacy: true, demo_data: true, demo_content: '<p>Conflicting demo</p>' },
  context: { page: { title: 'Privacidad', content: '<p>Conflicting CMS</p>' }, shop: { privacy_policy: { body: '' } } },
 });
 expect(html).toContain(json('locales/es.json').sections.lemoon_legal_page.empty_content);
 expect(html).not.toMatch(/Conflicting|lemoon-legal-page__intro\"/);
});

test('native privacy mode is opt-in and does not replace other legal page kinds', () => {
 const html = renderComponentSection('lemoon-legal-page', {
  settings: { kind: 'shipping', use_native_privacy: true },
  context: { page: { title: 'Envíos', content: '<p>Shipping CMS</p>' }, shop: { privacy_policy: { body: '<p>Native privacy</p>' } } },
 });
 expect(html).toContain('<p>Shipping CMS</p>');
 expect(html).not.toContain('<p>Native privacy</p>');
});

test('returns address is shown only when configured and escapes editor input', () => {
 const settings = json('templates/page.politica-de-devoluciones.json').sections.main.settings;
 const render = (address) => renderComponentSection('lemoon-legal-page', {
  settings: { ...settings, return_address: address },
  context: { page: { title: 'Política de reembolso', content: '' }, shop: {} },
 });
 for (const address of [undefined, '', '   ']) {
  const html = render(address);
  expect(html).not.toContain('[DIRECCION_DEVOLUCION]');
  expect(html).not.toContain('Dirección de devolución:');
 }
 const html = render('Calle <Ejemplo> 123');
 expect(html).toContain('Dirección de devolución:');
 expect(html).toContain('Calle &lt;Ejemplo&gt; 123');
 expect(html).not.toContain('[DIRECCION_DEVOLUCION]');
});

test('fallback section content resolves the return address and leaves CMS content authoritative', () => {
 const settings = json('templates/page.politica-de-devoluciones.json').sections.main.settings;
 const render = (address, pageContent = '') => renderComponentSection('lemoon-legal-page', {
  settings: { ...settings, use_section_content: false, return_address: address },
  context: { page: { title: 'Política de reembolso', content: pageContent }, shop: {} },
 });
 const configured = render('Calle <Ejemplo> 123');
 expect(configured).toContain('Dirección de devolución:');
 expect(configured).toContain('Calle &lt;Ejemplo&gt; 123');
 expect(configured).not.toContain('[DIRECCION_DEVOLUCION]');
 for (const address of [undefined, '', '   ']) {
  const html = render(address);
  expect(html).not.toContain('Dirección de devolución:');
  expect(html).not.toContain('[DIRECCION_DEVOLUCION]');
 }
 const cms = render('Calle <Ejemplo> 123', '<p>Contenido CMS prioritario</p>');
 expect(cms).toContain('<p>Contenido CMS prioritario</p>');
 expect(cms).not.toContain('Calle &lt;Ejemplo&gt; 123');
 expect(cms).not.toContain('[DIRECCION_DEVOLUCION]');
});

test.each([
 ['politica-de-privacidad', 'privacy_policy'],
 ['terminos-y-condiciones', 'terms_of_service'],
 ['politicas', 'refund_policy'],
 ['envios-y-entregas', 'shipping_policy'],
])('shared legal template selects only the native policy for %s', (handle, policyKey) => {
 const settings = json('templates/page.legal.json').sections.main.settings;
 const page = { handle, title: 'Título CMS', content: '<p>Contenido CMS antiguo</p>' };
 const shop = { [policyKey]: { title: 'Título nativo', body: '<p>Texto de política nativa</p>' } };
 const engine = createComponentEngine({ globals: { shop } });
 engine.registerFilter('handleize', value => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-'));
 const html = engine.renderFileSync('lemoon-legal-page', { section: { id: 'legal-shared', settings }, page, shop, routes: { root_url: '/' } });
 expect(html).toContain('<h1>Título CMS</h1>');
 expect(html).toContain('<p>Texto de política nativa</p>');
 expect(html).not.toContain('Contenido CMS antiguo');
 expect(html).not.toContain('lemoon-legal-page__intro"');
 const empty = renderComponentSection('lemoon-legal-page', { settings, context: { page, shop: {} } });
 expect(empty).toContain(json('locales/es.json').sections.lemoon_legal_page.empty_content);
 expect(empty).not.toContain('Contenido CMS antiguo');
});

test('shared legal template preserves page CMS for warranty and other pages', () => {
 const settings = json('templates/page.legal.json').sections.main.settings;
 for (const handle of ['garantias', 'otra-pagina']) {
  const html = renderComponentSection('lemoon-legal-page', { settings, context: { page: { handle, title: 'Título', content: '<p>Contenido CMS</p>' }, shop: { refund_policy: { body: '<p>Política ajena</p>' } } } });
  expect(html).toContain('<p>Contenido CMS</p>');
  expect(html).not.toContain('Política ajena');
 }
});


test.each(['[RAZÓN SOCIAL POR COMPLETAR]', '[RUT POR COMPLETAR]', '[DOMICILIO LEGAL POR COMPLETAR]', '[IDENTIDAD_LEGAL_EMPRESA]', '[PLAZO_ENTREGA]', '[DIRECCION_DEVOLUCION]', '{{ razon_social }}', '{{ rut_empresa }}', '{{ domicilio_legal }}'])('shared legal template hides native policy with unresolved marker %s', (marker) => {
 const settings = json('templates/page.legal.json').sections.main.settings;
 const html = renderComponentSection('lemoon-legal-page', { settings, context: { page: { handle: 'politica-de-privacidad', title: 'Privacidad', content: '<p>CMS antiguo</p>' }, shop: { privacy_policy: { title: 'Privacidad', body: `<p>${marker}</p>` } } } });
 expect(html).toContain(json('locales/es.json').sections.lemoon_legal_page.empty_content);
 expect(html).not.toContain(marker);
 expect(html).not.toContain('CMS antiguo');
});
