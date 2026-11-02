import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { renderComponentSection } from '../helpers/component-library-renderer.mjs';

const file = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const json = (path) => { const text = file(path); return JSON.parse(text.slice(text.indexOf('{'))); };
const source = file('sections/lemoon-about-page.liquid');
const template = json('templates/page.nosotros.json');
const settings = template.sections.main.settings;
const schema = JSON.parse(source.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
const text = html => html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<[^>]*>/g, ' ')
  .replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'")
  .replaceAll('&lt;', '<').replaceAll('&gt;', '>').replace(/\s+/g, ' ').trim();
const publicDraft = file('docs/content/2026-11-01-quienes-somos-draft.md').split('## Contenido de página')[1].split('\n---')[0];
const approvedCopy = publicDraft.split(/\n\s*\n/).map(part => part.trim())
  .filter(part => part && !part.startsWith('**[')).map(part => part.replace(/^#+\s*/, '').replaceAll('**', ''));
const render = options => renderComponentSection('lemoon-about-page', { settings, ...options });

test('about preserves approved copy and the abstract placeholder without demo, names, suppliers or price', () => {
  const html = render();
  const renderedText = text(html);
  for (const paragraph of approvedCopy) {
    expect(renderedText, paragraph).toContain(paragraph);
    expect(renderedText.split(paragraph).length - 1, paragraph).toBe(1);
  }
  expect(html.match(/<h1\b/g)).toHaveLength(1);
  expect(html).not.toMatch(/<img\b|<figure\b|<p\b[^>]*>\s*<p\b/);
  expect(html).toContain('lemoon-about-page__abstract" aria-hidden="true"');
  expect(renderedText).not.toMatch(/proveedor|suministra|a buen precio|Miguel|Servioptic|demostraci[oó]n|00\.000\.000|Avenida de Ejemplo|POR CONFIRMAR/i);
  expect(settings.demo_data).toBe(false);
  expect(settings).not.toHaveProperty('demo_content');
  expect(settings).not.toHaveProperty('image');
  expect(settings.contact).toBe('');
});

for (const root of ['/', '/en/']) {
  test(`about renders only the two catalogue actions under localized root ${root}`, () => {
    const prefix = root === '/' ? '' : '/en';
    const html = render({ routes: { root_url: root, all_products_collection_url: `${prefix}/collections/all` } });
    const links = [...html.matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].map(([, href, label]) => ({ href, label: text(label) }));
    expect(links).toEqual([
      { href: `${prefix}/collections/all`, label: 'Conoce nuestros lentes' },
      { href: `${prefix}/collections/all`, label: 'Encuentra tu próximo par' },
    ]);
  });
}

test('about editor text overrides escape headings while preserving formatted paragraphs and verified history', () => {
  const html = render({ settings: {
    ...settings,
    title: 'Título <&"',
    intro: '<p>Texto <strong>editable</strong>.</p><p>Segundo párrafo.</p>',
    story: '<p>Historia <strong>confirmada</strong>.</p>',
  } });
  expect(html).toMatch(/<h1>Título &lt;&amp;(?:&quot;|&#34;)<\/h1>/);
  expect(html).toContain('<p>Texto <strong>editable</strong>.</p><p>Segundo párrafo.</p>');
  expect(html).toContain('<p>Historia <strong>confirmada</strong>.</p>');
  expect(text(html)).not.toContain('Hay cosas que se vuelven parte de ti.');
  expect(html).not.toMatch(/<p\b[^>]*>\s*<p\b/);
});

for (const language of ['es', 'en']) {
  test(`about preserves translated fallback content when editor fields are absent (${language})`, () => {
    const messages = json(`locales/${language === 'es' ? 'es' : 'en.default'}.json`).sections.lemoon_about_page;
    const html = renderComponentSection('lemoon-about-page', { language });
    const renderedText = text(html);
    for (const field of ['eyebrow', 'title', 'intro', 'style_title', 'style_body', 'fit_title', 'fit_body', 'information_title', 'information_body', 'help_title', 'help_body']) {
      expect(renderedText, field).toContain(messages[field]);
    }
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).not.toMatch(/undefined|translation missing/i);
  });
}

test('about template content is editor-configurable and its labels resolve in both schema locales', () => {
  expect(template.order).toEqual(['main']);
  expect(template.sections.main.type).toBe('lemoon-about-page');
  expect(schema.disabled_on.groups).toEqual(['header', 'footer']);
  expect(schema.presets).toHaveLength(1);
  expect(schema.settings.find(({ id }) => id === 'story').default).toBeUndefined();
  expect(schema.settings.filter(({ type }) => type === 'range').map(({ id }) => id)).toEqual(['padding_top', 'padding_bottom']);
  for (const [id, value] of Object.entries(settings)) {
    if (typeof value !== 'string') continue;
    expect(schema.settings.find(setting => setting.id === id), id).toMatchObject({ type: id === 'image' ? 'image_picker' : value.startsWith('<p>') ? 'richtext' : 'text' });
  }
  for (const language of ['en.default', 'es']) {
    const messages = json(`locales/${language}.json`);
    const schemaMessages = json(`locales/${language}.schema.json`);
    const lookup = (obj, path) => path.split('.').reduce((value, key) => value?.[key], obj);
    for (const [, path] of source.matchAll(/['"](?:t:)?(sections\.lemoon_about_page[^'"]+)['"]/g)) {
      expect(lookup(messages, path) || lookup(schemaMessages, path), `${language}: ${path}`).toBeTruthy();
    }
  }
});
