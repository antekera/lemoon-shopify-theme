import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { renderComponentSection as render, contactErrors } from '../helpers/component-library-renderer.mjs';

const file = (name) => readFileSync(new URL(`../../${name}`, import.meta.url), 'utf8');
const source = () => file('sections/lemoon-contact-page.liquid');
const json = (name) => { const text = file(name); return JSON.parse(text.slice(text.indexOf('{'))); };

test('contact page uses native Shopify contact processing with required accessible fields', () => {
  expect(source()).toMatch(/form 'contact'/);
  const html = render('lemoon-contact-page');
  expect(html).toMatch(/<form[^>]*method="post"/);
  for (const field of ['name', 'email', 'body']) {
    const markup = html.match(new RegExp(`<(?:input|textarea)[^>]*name="contact\\[${field}\\]"[^>]*>`))?.[0];
    expect(markup, `${field} required`).toMatch(/\srequired(?:\s|>|=)/);
    expect(html).toContain(`for="LemoonContact-component-fixture-${field}"`);
  }
  const phone = html.match(/<input[^>]*name="contact\[phone\]"[^>]*>/)?.[0];
  expect(phone).toContain('type="tel"');
  expect(phone).not.toMatch(/pattern=|required/);
  const success = render('lemoon-contact-page', { form: { 'posted_successfully?': true } });
  expect(success).toContain('role="status"');
  expect(success).toContain('aria-live="polite"');
  expect(success).toMatch(/tabindex="-1"[^>]*autofocus/);
  const error = render('lemoon-contact-page', { form: { errors: contactErrors() } });
  expect(error).toContain('role="alert"');
  expect(error).toContain('aria-live="assertive"');
  expect(error).toContain('aria-invalid="true"');
  expect(error).toContain('aria-describedby="LemoonContact-component-fixture-email-error"');
});

test('contact redisplays form before customer values, escapes once, and exposes configured channels only', () => {
  for (const owner of ['form', 'customer']) {
    const values = { name: 'N"<&', email: 'e"<&', phone: 'p"<&', body: '</textarea>\n&' };
    const html = render('lemoon-contact-page', { [owner]: values });
    for (const value of ['N&#34;&lt;&amp;', 'e&#34;&lt;&amp;', 'p&#34;&lt;&amp;']) expect(html).toContain(value);
    if (owner === 'form') expect(html).toContain('&lt;/textarea&gt;\n&amp;');
    expect(html).not.toContain('&amp;lt;');
  }
  const precedence = render('lemoon-contact-page', { form: { name: 'From form' }, customer: { name: 'From customer' } });
  expect(precedence).toContain('value="From form"');
  expect(precedence).not.toContain('From customer');
  for (const root_url of ['/', '/en']) {
    const html = render('lemoon-contact-page', { routes: { root_url } });
    expect(html).toContain(`href="${root_url === '/' ? '' : root_url}/pages/preguntas-frecuentes"`);
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).not.toMatch(/mailto:|wa\.me/);
  }
  const configured = render('lemoon-contact-page', { settings: { contact_email: 'test@example.test', whatsapp_url: 'https://example.test/chat?a=1&b=2', contact_hours: 'Fixture hours' } });
  expect(configured).toContain('mailto:test@example.test');
  expect(configured).toContain('https://example.test/chat?a=1&amp;b=2');
  expect(configured).toContain('Fixture hours');
});

test('contact template selects custom section and editor settings are localized and padded', () => {
  const section = source();
  const template = json('templates/page.contact.json');
  expect(template.order).toEqual(['main']);
  expect(template.sections.main.type).toBe('lemoon-contact-page');
  const schema = JSON.parse(section.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
  expect(schema.disabled_on.groups).toEqual(['header', 'footer']);
  expect(schema.presets[0].name).toBe('t:sections.lemoon_contact_page.name');
  expect(schema.settings.filter(({ type }) => type === 'range').map(({ id }) => id)).toEqual(['padding_top', 'padding_bottom']);
  for (const setting of schema.settings.filter(({ id }) => ['contact_email', 'contact_hours', 'whatsapp_url'].includes(id))) expect(setting.default).toBeUndefined();
  expect(section).toContain('#shopify-section-{{ section.id }}');
});

test('contact storefront and schema translation keys exist in English and Spanish with matching structure', () => {
  const paths = [...source().matchAll(/['"](?:t:)?(sections\.lemoon_contact_page[^'"]+)['"]/g)].map((match) => match[1]);
  for (const locale of ['en.default', 'es']) {
    const messages = json(`locales/${locale}.json`);
    const schemaMessages = json(`locales/${locale}.schema.json`);
    for (const path of paths) {
      const keys = path.split('.');
      const lookup = (object) => keys.reduce((value, key) => value?.[key], object);
      expect(lookup(messages) || lookup(schemaMessages), `${locale}: ${path}`).toBeTruthy();
    }
  }
  expect(Object.keys(json('locales/en.default.json').sections.lemoon_contact_page)).toEqual(Object.keys(json('locales/es.json').sections.lemoon_contact_page));
});
