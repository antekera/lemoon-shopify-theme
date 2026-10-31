import { expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { renderComponent as render, renderComponentSection as section } from '../helpers/component-library-renderer.mjs';
import { renderWave } from '../helpers/second-wave-renderer.mjs';

test('unwrapped field preserves label order, local classes and false native ARIA without changing defaults', () => {
  const html = render('field', { id: 'mail', name: 'contact[email]', type: 'email', label: 'Correo <&', label_class: 'visually-hidden', control_class: 'newsletter-input', unwrapped: true, label_before: true, aria_required: false, autocorrect: 'off' });
  expect(html).not.toContain('<div');
  expect(html.indexOf('<label')).toBeLessThan(html.indexOf('<input'));
  expect(html).toContain('aria-required="false"');
  expect(html).toContain('autocorrect="off"');
  expect(html).toContain('Correo &lt;&amp;');
  const defaults = render('field', { id: 'normal', label: 'Normal' });
  expect(defaults).toContain('<div class="lemoon-ui-field field">');
  expect(defaults.indexOf('<input')).toBeLessThan(defaults.indexOf('<label'));
  expect(defaults).not.toContain('aria-required=');
  expect(defaults).not.toContain('autocorrect=');
});

test('field trusted suffix and in-wrapper feedback preserve required markers and error nesting', () => {
  const html = render('field', { id: 'author', label: 'Nombre', label_suffix_html: '<span aria-hidden="true">*</span>', feedback_html: '<small id="error"><span>Error</span></small>', describedby: 'error' });
  expect(html).toContain('Nombre<span aria-hidden="true">*</span></label>');
  expect(html).toMatch(/<small id="error">[\s\S]*?<\/small>\s*<\/div>/);
  expect(html.match(/id="error"/g)).toHaveLength(1);
});

test('native submit input retains its value and does not get button contents or a closing input tag', () => {
  const html = render('action', { element: 'input', type: 'submit', label: 'Enviar <&"', name: 'commit' });
  expect(html).toContain('<input');
  expect(html).toContain('type="submit"');
  expect(html).toContain('value="Enviar &lt;&amp;&#34;"');
  expect(html).not.toMatch(/<span|<\/input>|loading__spinner/);
  expect(render('action', { element: 'input', type: 'button', label: 'Ordinary' })).toContain('<button');
});

test('comment status h3 preserves autofocus/tabindex and message tag remains allowlisted', () => {
  expect(render('message', { tag: 'h3', text: 'Error <&', autofocus: true, tabindex: '-1' })).toContain('<h3 tabindex="-1" autofocus>Error &lt;&amp;</h3>');
  expect(render('message', { tag: 'script', text: 'Safe', autofocus: false })).toBe('<p>Safe</p>\n');
});

test('comment/newsletter states retain their own announcement semantics and moderation branch', () => {
  expect(renderWave('article-error')).toContain('role="alert"');
  expect(renderWave('article-success')).toContain('role="status"');
  expect(renderWave('article-moderated-success')).not.toBe(renderWave('article-success'));
  expect(renderWave('newsletter-error')).not.toContain('autofocus');
  expect(renderWave('newsletter-success')).toMatch(/id="LemoonNewsletterSuccess-[^"]+"[^>]*tabindex="-1"/);
  expect(renderWave('newsletter')).not.toContain('aria-invalid=');
});

test('form identities remain distinct across instances and the five legal templates still consume their shell', () => {
  const first = section('footer', { id: 'one', settings: { newsletter_enable: true } });
  const second = section('footer', { id: 'two', settings: { newsletter_enable: true } });
  expect(first).toContain('id="LemoonNewsletterEmail-one"');
  expect(second).toContain('id="LemoonNewsletterEmail-two"');
  for (const handle of ['envios-y-entregas','politica-de-devoluciones','terminos-y-condiciones','privacidad','garantias']) {
    const text = readFileSync(`templates/page.${handle}.json`, 'utf8');
    expect(JSON.parse(text.slice(text.indexOf('{'))).sections.main.type).toBe('lemoon-legal-page');
  }
});
