import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

const file = (name) => readFileSync(new URL(`../../${name}`, import.meta.url), 'utf8');
const source = () => file('sections/lemoon-contact-page.liquid');
const json = (name) => { const text = file(name); return JSON.parse(text.slice(text.indexOf('{'))); };

test('contact page uses native Shopify contact processing with required accessible fields', () => {
  const section = source();
  expect(section).toMatch(/form 'contact'/);
  for (const field of ['name', 'email', 'body']) {
    const tag = field === 'body' ? 'textarea' : 'input';
    const markup = section.match(new RegExp(`<${tag}[^>]*name="contact\\[${field}\\]"[^>]*>`))?.[0];
    expect(markup, `${field} is required`).toContain('required');
    expect(section).toContain(`for="{{ contact_form_id }}-${field}"`);
  }
  const phone = section.match(/<input[^>]*name="contact\[phone\]"[^>]*>/s)?.[0];
  expect(phone).toBeTruthy();
  expect(phone).toContain('type="tel"');
  expect(phone).not.toMatch(/pattern=|required/);
  expect(section).toContain('form.posted_successfully?');
  expect(section).toContain('form.errors');
  expect(section).toContain('aria-invalid="true"');
  expect(section).toContain('aria-describedby="{{ contact_form_id }}-email-error"');
  expect(section).toContain('tabindex="-1" autofocus');
  expect(section).toContain('aria-live="polite"');
  expect(section).toContain('aria-live="assertive"');
});

test('contact redisplayed values escape user/customer inputs and exposes only configured business channels', () => {
  const section = source();
  for (const value of ['form.name', 'form.email', 'form.phone', 'form.body', 'customer.name', 'customer.email', 'customer.phone']) expect(section).toContain(`${value} | escape`);
  for (const setting of ['contact_email', 'contact_hours', 'whatsapp_url']) expect(section).toContain(`if section.settings.${setting} != blank`);
  expect(section).not.toMatch(/wa\.me\/\d|\+56\s?9\s?\d|lunes a viernes/i);
  expect(section.match(/<h1\b/g)).toHaveLength(1);
  expect(section).not.toMatch(/{{\s*page\.title/);
  expect(section).toContain("routes.root_url | append: '/pages/preguntas-frecuentes' | replace: '//', '/'");
  for (const root of ['/', '/en']) expect(`${root}/pages/preguntas-frecuentes`.replaceAll('//', '/')).toBe(`${root === '/' ? '' : root}/pages/preguntas-frecuentes`);
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
