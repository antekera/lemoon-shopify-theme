import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { createComponentEngine, renderComponentSection } from '../helpers/component-library-renderer.mjs';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const json = (path) => { const source = read(path); return JSON.parse(source.slice(source.indexOf('{'))); };
const shopWith = (name, rut) => ({
  name: 'Lemoon',
  metafields: { custom: { razon_social: { value: name }, rut_empresa: { value: rut } } },
});

function engine(language = 'es', globals = {}) {
  return createComponentEngine({ language, globals });
}

const renderContent = (content, company_name, company_rut, legacy_demo = false) => engine().renderFileSync('lemoon-business-content', { content, company_name, company_rut, legacy_demo });

test('identity fields update every explicit CMS token while preserving editorial markup', () => {
  const content = '<h2>{{ razon_social }}</h2><p>RUT: {{ rut_empresa }}; {{ razon_social }}</p><a href="/pages/contact">Ayuda</a>';
  expect(renderContent(content, 'Nueva Empresa SPA', '12.345.678-9')).toBe('<h2>Nueva Empresa SPA</h2><p>RUT: 12.345.678-9; Nueva Empresa SPA</p><a href="/pages/contact">Ayuda</a>');
  expect(renderContent(content, 'Otra Empresa', '98.765.432-1')).toContain('<h2>Otra Empresa</h2><p>RUT: 98.765.432-1; Otra Empresa</p>');
});

test('merchant field values are escaped without escaping trusted CMS HTML or evaluating CMS Liquid', () => {
  const content = '<p>{{ razon_social }} / {{ rut_empresa }}</p><p>{{ shop.name }}</p>{% assign injected = "bad" %}';
  const html = renderContent(content, '<img src=x onerror=alert(1)> & "SPA"', '<script>bad</script>');
  expect(html).toContain('<p>&lt;img src=x onerror=alert(1)&gt; &amp; &#34;SPA&#34; / &lt;script&gt;bad&lt;/script&gt;</p>');
  expect(html).toContain('<p>{{ shop.name }}</p>{% assign injected = "bad" %}');
  expect(html).not.toContain('<img');
  expect(html).not.toContain('<script>');
});

test.each([undefined, null, '', '   '])('missing or blank identity values preserve unresolved tokens (%s)', (value) => {
  const content = '<p>{{ razon_social }} / {{ rut_empresa }}</p>';
  expect(renderContent(content, value, value)).toBe(content);
  expect(renderContent(content, 'Nombre confirmado', value)).toBe('<p>Nombre confirmado / {{ rut_empresa }}</p>');
});

test('normal CMS preserves historical company/RUT literals; only explicit demo mode migrates them', () => {
  const content = '<p>Servioptic SpA; Servioptic SPA; 00.000.000-0</p>';
  expect(renderContent(content, 'Empresa actual', '11.111.111-1')).toBe(content);
  expect(renderContent(content, 'Empresa actual', '11.111.111-1', true)).toBe('<p>Empresa actual; Empresa actual; 11.111.111-1</p>');
  expect(renderContent(content, undefined, undefined, true)).toBe(content);
  expect(renderContent(content, 'Empresa actual', '11.111.111-1', 'true')).toBe(content);
});

test('known bracket identity markers resolve without changing other pending business facts', () => {
  const content = '<p>[RAZÓN SOCIAL POR COMPLETAR] / [RUT POR COMPLETAR] / [DOMICILIO POR COMPLETAR]</p>';
  expect(renderContent(content, 'Empresa & Hijos', '12.345.678-9')).toBe('<p>Empresa &amp; Hijos / 12.345.678-9 / [DOMICILIO POR COMPLETAR]</p>');
  expect(renderContent(content, '', '')).toBe(content);
});

test.each([false, true])('inserted field values stay opaque even when they contain identity tokens or demo literals (demo=%s)', (legacy) => {
  const name = 'Empresa {{ rut_empresa }} 00.000.000-0 & SPA';
  const rut = '{{ razon_social }} Servioptic SpA <id>';
  expect(renderContent('<p>{{ razon_social }} / {{ rut_empresa }}</p>', name, rut, legacy)).toBe('<p>Empresa {{ rut_empresa }} 00.000.000-0 &amp; SPA / {{ razon_social }} Servioptic SpA &lt;id&gt;</p>');
  if (legacy) expect(renderContent('Servioptic SpA / 00.000.000-0', name, rut, true)).toBe('Empresa {{ rut_empresa }} 00.000.000-0 &amp; SPA / {{ razon_social }} Servioptic SpA &lt;id&gt;');
});

test.each([
  ['', ''],
  ['{{ razon_social }}', 'Empresa'],
  ['{{ razon_social }}inicio', 'Empresainicio'],
  ['fin{{ razon_social }}', 'finEmpresa'],
  ['{{ razon_social }}{{ razon_social }}', 'EmpresaEmpresa'],
  ['{{ razon_social }} / {{ razon_social }} / {{ rut_empresa }}', 'Empresa / Empresa / 12.345.678-9'],
])('token substitution preserves leading, trailing and repeated boundaries in %s', (content, expected) => {
  expect(renderContent(content, 'Empresa', '12.345.678-9')).toBe(expected);
});

test('unavailable company values keep original name tokens while substituting the available RUT', () => {
  const content = '{{ razon_social }}{{ rut_empresa }}{{ razon_social }}';
  expect(renderContent(content, '', '12.345.678-9')).toBe('{{ razon_social }}12.345.678-9{{ razon_social }}');
  expect(renderContent('', '', '12.345.678-9', true)).toBe('');
});


test.each([
  ['es', 'La persona jurídica que opera comercialmente Lemoon es'],
  ['en', 'The legal entity operating Lemoon is'],
])('legal identity is localized and escapes both fields in %s', (language, phrase) => {
  const render = (company_name, company_address) => engine(language).renderFileSync('lemoon-business-content', {
    content: '<h2>Contacto</h2>[IDENTIDAD_LEGAL_EMPRESA]', company_name, company_address, company_rut: '123',
  });
  const html = render('Empresa <SPA>', 'Calle & {{ rut_empresa }}');
  expect(html).toContain(phrase);
  expect(html).toContain('<strong>Empresa &lt;SPA&gt;</strong>');
  expect(html).toContain('Calle &amp; {{ rut_empresa }}');
  expect(render('', 'Calle')).toBe('<h2>Contacto</h2>');
  expect(render('Empresa', '')).toBe('<h2>Contacto</h2>');
});
