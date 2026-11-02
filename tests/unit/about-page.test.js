import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { renderComponentSection } from '../helpers/component-library-renderer.mjs';

const file = path => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const json = path => { const raw = file(path); return JSON.parse(raw.slice(raw.indexOf('{'))); };
const source = file('sections/lemoon-about-page.liquid');
const template = json('templates/page.nosotros.json');
const settings = template.sections.main.settings;
const schema = JSON.parse(source.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
const text = html => html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<[^>]*>/g, ' ')
  .replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'")
  .replaceAll('&lt;', '<').replaceAll('&gt;', '>').replace(/\s+/g, ' ').trim();
const publicDraft = file('docs/content/2026-11-01-quienes-somos-draft.md').split('## Contenido de página')[1].split('\n---')[0];
const approvedCopy = publicDraft.trim().split(/\n\s*\n/).map(part => part.trim().replace(/^#+\s*/, '').replaceAll('**', ''));
const render = (options = {}) => renderComponentSection('lemoon-about-page', {
  ...options, settings: { ...settings, ...options.settings },
});

test('about renders the approved narrative and separate global slogan once', () => {
  const html = render({ context: { settings: { brand_slogan: 'Se te ven bien' } } });
  expect(text(html)).toBe(approvedCopy.join(' '));
  expect(html.match(/<h1\b/g)).toHaveLength(1);
  expect(html.match(/<p\b/g)).toHaveLength(7);
  const body = html.match(/<div class="lemoon-about-page__body">([\s\S]*?)<\/div>/)[1];
  expect(body.match(/<p\b/g)).toHaveLength(6);
  expect(text(body)).not.toContain('Se te ven bien');
  expect(html).toMatch(/<\/div>\s*<p class="lemoon-about-page__slogan">Se te ven bien<\/p>/);
  expect(html).not.toMatch(/<(?:img|figure|a|form|button|h[2-6])\b|lemoon-about-page__(?:abstract|value|hero)|<p\b[^>]*>\s*<p\b/);
  expect(Object.keys(settings).sort()).toEqual(['body', 'padding_bottom', 'padding_top', 'title']);
});

test('global slogan changes render as escaped separate text and blank values hide it without fallback', () => {
  const html = render({ context: { settings: { brand_slogan: 'Otro eslogan <&"' } } });
  expect(html).toMatch(/<p class="lemoon-about-page__slogan">Otro eslogan &lt;&amp;(?:&quot;|&#34;)<\/p>/);
  expect(text(html)).not.toContain('Se te ven bien');
  for (const brand_slogan of ['', null, undefined]) {
    const withoutSlogan = render({ context: { settings: { brand_slogan } } });
    expect(withoutSlogan).not.toContain('class="lemoon-about-page__slogan"');
    expect(text(withoutSlogan)).toBe(approvedCopy.slice(0, -1).join(' '));
  }
});

test('global brand slogan has a localized editor label and the same approved default in Spanish and English', () => {
  const group = JSON.parse(file('config/settings_schema.json')).find(item => item.name === 't:settings_schema.brand_information.name');
  const field = group.settings.find(item => item.id === 'brand_slogan');
  expect(field.type).toBe('text');
  for (const key of ['label', 'default']) expect(field[key]).toMatch(/^t:/);
  for (const language of ['es', 'en.default']) {
    const messages = json(`locales/${language}.schema.json`);
    const lookup = key => key.slice(2).split('.').reduce((value, part) => value?.[part], messages);
    expect(lookup(field.label)).toEqual(expect.any(String));
    expect(lookup(field.label).length).toBeGreaterThan(0);
    expect(lookup(field.default)).toBe('Se te ven bien');
  }
});

test('about editor escapes the plain title and preserves richtext paragraph formatting', () => {
  const html = render({ settings: {
    title: 'Título <&"',
    body: '<p>Texto <strong>editable</strong>.</p><p>Segundo párrafo.</p>',
  } });
  expect(html).toMatch(/<h1[^>]*>Título &lt;&amp;(?:&quot;|&#34;)<\/h1>/);
  expect(html).toContain('<p>Texto <strong>editable</strong>.</p><p>Segundo párrafo.</p>');
  expect(text(html)).not.toContain(approvedCopy[1]);
  expect(html).not.toMatch(/<p\b[^>]*>\s*<p\b/);
});

for (const language of ['es', 'en']) {
  test(`about retains a translated title fallback with empty editor fields (${language})`, () => {
    const messages = json(`locales/${language === 'es' ? 'es' : 'en.default'}.json`).sections.lemoon_about_page;
    const html = renderComponentSection('lemoon-about-page', { language });
    expect(text(html)).toContain(messages.title);
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).not.toMatch(/undefined|translation missing/i);
  });
}

test('about editor exposes only narrative fields and keeps the separate randomized carousel', () => {
  expect(template.order).toEqual(['main', 'products']);
  expect(template.sections.products).toMatchObject({
    type: 'lemoon-featured-products',
    settings: { collection: 'all', collection_source: 'fixed', randomize: true, products_to_show: 8, show_quick_add: false, defer_load: false },
  });
  expect(template.sections.main.type).toBe('lemoon-about-page');
  expect(schema.disabled_on.groups).toEqual(['header', 'footer']);
  expect(schema.presets).toHaveLength(1);
  expect(schema.settings.filter(setting => setting.id).map(({ id, type }) => ({ id, type }))).toEqual([
    { id: 'title', type: 'text' },
    { id: 'body', type: 'richtext' },
    { id: 'padding_top', type: 'range' },
    { id: 'padding_bottom', type: 'range' },
  ]);
  for (const language of ['en.default', 'es']) {
    const messages = json(`locales/${language}.json`);
    const schemaMessages = json(`locales/${language}.schema.json`);
    const lookup = (obj, path) => path.split('.').reduce((value, key) => value?.[key], obj);
    for (const [, path] of source.matchAll(/['"](?:t:)?(sections\.lemoon_about_page[^'"]+)['"]/g)) {
      expect(lookup(messages, path) || lookup(schemaMessages, path), `${language}: ${path}`).toBeTruthy();
    }
  }
});
