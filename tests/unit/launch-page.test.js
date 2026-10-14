import { readFileSync } from 'node:fs';
import { test, expect } from 'vitest';
const file = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const json = (path) => { const text = file(path); return JSON.parse(text.slice(text.indexOf('{'))); };
test('launch subscription uses native customer form with explicit unchecked required marketing consent', () => {
  const source = file('sections/lemoon-launch-page.liquid');
  expect(source).toContain("form 'customer'");
  expect(source).toContain('name="contact[tags]" value="newsletter"');
  const email = source.match(/<input[^>]*name="contact\[email\]"[^>]*>/s)[0];
  expect(email).toContain('type="email"');
  expect(email).toContain('required');
  expect(email).toContain('form.email | escape');
  const consent = source.match(/<input[^>]*name="contact\[accepts_marketing\]"[^>]*>/s)[0];
  expect(consent).toContain('type="checkbox"');
  expect(consent).toContain('value="true"');
  expect(consent).toContain('required');
  expect(consent).not.toContain('checked');
  expect(source).toContain('role="alert"');
  expect(source).toContain('role="status"');
  expect(source).toContain('aria-invalid="true"');
  expect(source).toContain('aria-describedby="{{ launch_form_id }}-error"');
});
test('password template preserves the native password layout and old editor content', () => {
  const template = json('templates/password.json');
  expect(template.layout).toBe('password');
  expect(template.sections.main.type).toBe('lemoon-launch-page');
  expect(template.sections.legacy_banner.disabled).toBe(true);
  expect(template.sections.legacy_banner.type).toBe('email-signup-banner');
  expect(template.order.filter((id) => !template.sections[id].disabled)).toEqual(['main']);
  const source = file('sections/lemoon-launch-page.liquid');
  expect(source.match(/<h1\b/g)).toHaveLength(1);
  expect(source).not.toContain("form 'storefront_password'");
  expect(source).toContain('aria-hidden="true"');
  expect(source).toContain('section.settings.headline | escape');
  expect(source).toContain('section.settings.intro | escape');
});
test('launch schema supports optional imagery, editable localized copy and standard padding', () => {
  const source = file('sections/lemoon-launch-page.liquid');
  const schema = JSON.parse(source.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
  expect(schema.settings.find(({ id }) => id === 'image').type).toBe('image_picker');
  for (const id of ['headline', 'intro']) expect(schema.settings.find((setting) => setting.id === id).default).toBeUndefined();
  expect(schema.settings.filter(({ type }) => type === 'range').map(({ id }) => id)).toEqual(['padding_top', 'padding_bottom']);
  expect(schema.presets[0].name).toBe('t:sections.lemoon_launch_page.name');
  for (const locale of ['en.default', 'es']) {
    const copy = json(`locales/${locale}.json`).sections.lemoon_launch_page;
    for (const key of ['title', 'intro', 'email', 'consent', 'submit', 'success']) expect(copy[key]).toBeTruthy();
    expect(json(`locales/${locale}.schema.json`).sections.lemoon_launch_page.name).toBeTruthy();
    expect(JSON.stringify(copy)).not.toMatch(/202[0-9]|\d{1,2} de (enero|febrero|marzo|abril)|free shipping|envío gratis/i);
  }
});
