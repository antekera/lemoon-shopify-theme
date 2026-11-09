import { readFileSync } from 'node:fs';
import { test, expect } from 'vitest';
import { createComponentEngine, renderComponentSection as render } from '../helpers/component-library-renderer.mjs';
const file = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const json = (path) => { const text = file(path); return JSON.parse(text.slice(text.indexOf('{'))); };
const kinds = { medidas: 'measurements', rostro: 'face', pedido: 'order', probador: 'try_on', prescripcion: 'prescription' };
test('each guide template chooses one guide without duplicating the page heading', () => {
  for (const [slug, kind] of Object.entries(kinds)) {
    const template = json(`templates/page.guia-${slug}.json`);
    expect(template.order).toEqual(['main']);
    expect(template.sections.main.type).toBe(slug === 'rostro' ? 'lemoon-face-guide' : 'lemoon-guide-page');
    if (slug !== 'rostro') expect(template.sections.main.settings.guide_kind).toBe(kind);
  }
  for (const guide_kind of Object.values(kinds)) expect(render('lemoon-guide-page', { settings: { guide_kind } }).match(/<h1\b/g)).toHaveLength(1);
});
test('guide anchors are unique per section and links preserve the locale root', () => {
  for (const guide_kind of Object.values(kinds)) {
    for (const root_url of ['/', '/en']) {
      const html = render('lemoon-guide-page', { id: guide_kind, settings: { guide_kind }, routes: { root_url } });
      for (const step of [1, 2, 3]) {
        expect(html).toContain(`href="#Guide-${guide_kind}-${step}"`);
        expect(html).toContain(`id="Guide-${guide_kind}-${step}"`);
      }
      const contactHref = `href="${root_url === '/' ? '' : root_url}/pages/contact"`;
      if (guide_kind === 'measurements') expect(html).not.toContain(contactHref);
      else expect(html).toContain(contactHref);
      expect(html).toContain('href="/collections/all"');
      const catalogueLink = html.match(/<a\b[^>]*href="\/collections\/all"[^>]*>/)?.[0];
      if (guide_kind === 'measurements') {
        expect(catalogueLink).toContain('button--accent');
        expect(catalogueLink).not.toContain('lemoon-guide__cta');
      } else {
        expect(catalogueLink).toContain('lemoon-guide__cta');
        expect(catalogueLink).not.toContain('button--accent');
      }
      expect(html).not.toMatch(/<form|type="file"|getUserMedia|mailto:/);
      expect(html).toContain('aria-hidden="true"');
      expect(html).toContain('<figcaption>');
    }
  }
});
test('guides expose all bilingual instructions and do not invent available services', () => {
  for (const locale of ['en.default', 'es']) {
    const copy = json(`locales/${locale}.json`).sections.lemoon_guide;
    for (const kind of Object.values(kinds)) {
      for (const key of ['title', 'intro', 'visual_title', 'visual_copy', 'step_1_title', 'step_1_body', 'step_2_title', 'step_2_body', 'step_3_title', 'step_3_body']) expect(copy[kind][kind === 'measurements' && /^step_[123]_body$/.test(key) ? `${key}_html` : key], `${locale} ${kind}.${key}`).toBeTruthy();
    }
  }
  const es = json('locales/es.json').sections.lemoon_guide;
  expect(es.try_on.step_1_body).toContain('si');
  expect(es.prescription.step_1_body).toContain('si');
  expect(JSON.stringify(es)).not.toMatch(/365|30 días|inteligencia artificial|envíala después/i);
});
test('guide schema has five kinds, padding, localized labels and a preset', () => {
  const source = file('sections/lemoon-guide-page.liquid');
  const schema = JSON.parse(source.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
  expect(schema.settings.find(({ id }) => id === 'guide_kind').options.map(({ value }) => value)).toEqual(Object.values(kinds));
  expect(schema.disabled_on.groups).toEqual(['header', 'footer']);
  expect(schema.settings.filter(({ type }) => type === 'range').map(({ id }) => id)).toEqual(['padding_top', 'padding_bottom']);
  expect(schema.presets).toHaveLength(1);
  for (const locale of ['en.default', 'es']) {
    const copy = json(`locales/${locale}.schema.json`).sections.lemoon_guide;
    expect(copy.name).toBeTruthy();
    expect(copy.kind_label).toBeTruthy();
    for (const kind of Object.values(kinds)) expect(copy[kind]).toBeTruthy();
  }
  expect(source).toContain('#shopify-section-{{ section.id }}');
});

test('measurements uses CMS title and editor text with semantic richtext fallbacks', () => {
  const settings = { guide_kind: 'measurements', measurements_intro: '<p>Introducción editorial.</p>', measurements_step_1_title: 'Patilla <segura>', measurements_step_1_body: '<p>Texto del paso.</p><ul><li>Detalle editorial.</li></ul>', measurements_step_2_title: 'Medición editorial', measurements_step_2_body: '<p>Segundo cuerpo editorial.</p>', measurements_step_3_title: 'Comparación editorial', measurements_step_3_body: '<p>Tercer cuerpo editorial.</p>', measurements_help_body: '<p>Ayuda editorial.</p>' };
  const html = render('lemoon-guide-page', { settings, context: { page: { title: 'Guía <CMS>' } } });
  expect(html.match(/<h1\b/g)).toHaveLength(1);
  expect(html).toContain('Guía &lt;CMS&gt;');
  for (const text of ['Introducción editorial.', 'Patilla &lt;segura&gt;', 'Texto del paso.', 'Detalle editorial.', 'Medición editorial', 'Segundo cuerpo editorial.', 'Comparación editorial', 'Tercer cuerpo editorial.', 'Ayuda editorial.']) expect(html).toContain(text);
  expect(html).not.toMatch(/<p\b[^>]*>\s*<p/);
  expect(html).not.toMatch(/<figure[^>]+class="lemoon-guide__visual"/);
  expect(html).toContain('Ejemplo educativo.');
  expect(html).toContain('class="lemoon-size-comparison__inscription"');
  expect(html).not.toMatch(/data-mm|data-units|<dialog/);
  for (const blank of ['', '<p></p>', '<p> </p>', '<p>&nbsp;</p>', '<p><br></p>', '<p>\u00a0</p>']) {
    const fallback = render('lemoon-guide-page', { settings: { guide_kind: 'measurements', measurements_intro: blank, measurements_step_1_body: blank, measurements_help_body: blank } });
    expect(fallback).toBe(render('lemoon-guide-page', { settings: { guide_kind: 'measurements' } }));
    expect(fallback).toContain('Ejemplo educativo.');
    expect(fallback).not.toMatch(/<div[^>]*class="[^"]*(?:intro|body|help-body)[^"]*"[^>]*>\s*<p>\s*(?:&nbsp;)?\s*<\/p>/);
    expect(fallback).not.toMatch(/<p\b[^>]*>\s*<p/);
  }
});

test('measurement overrides leave the other four guide variants unchanged', () => {
  const overrides = { measurements_intro: '<p>IGNORED INTRO</p>', measurements_step_1_title: 'IGNORED TITLE', measurements_step_1_body: '<p>IGNORED BODY</p>', measurements_step_2_title: 'IGNORED TWO', measurements_step_2_body: '<p>IGNORED SECOND</p>', measurements_step_3_title: 'IGNORED THREE', measurements_step_3_body: '<p>IGNORED THIRD</p>', measurements_help_body: '<p>IGNORED HELP</p>' };
  for (const guide_kind of ['face', 'order', 'try_on', 'prescription']) {
    const baseline = render('lemoon-guide-page', { id: guide_kind, settings: { guide_kind } });
    const actual = render('lemoon-guide-page', { id: guide_kind, settings: { guide_kind, ...overrides }, context: { page: { title: 'IGNORED CMS' } } });
    expect(actual).toBe(baseline);
    expect(actual).toContain('<figcaption>');
    expect(actual).not.toContain('lemoon-size-comparison__inscription');
  }
});

test('measurement editor settings are typed and localized in both schema languages', () => {
  const schema = JSON.parse(file('sections/lemoon-guide-page.liquid').match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
  const required = { measurements_intro: 'richtext', measurements_help_body: 'richtext' };
  for (const step of [1, 2, 3]) Object.assign(required, { [`measurements_step_${step}_title`]: 'text', [`measurements_step_${step}_body`]: 'richtext' });
  for (const [id, type] of Object.entries(required)) {
    const setting = schema.settings.find(item => item.id === id);
    expect(setting, id).toBeTruthy();
    expect(setting.type).toBe(type);
    for (const language of ['es', 'en.default']) {
      const messages = json(`locales/${language}.schema.json`);
      for (const field of ['label', 'default'].filter(field => setting[field])) {
        expect(setting[field]).toMatch(/^t:/);
        expect(setting[field].slice(2).split('.').reduce((value, key) => value?.[key], messages)).toBeTruthy();
      }
    }
  }
});


// Shopify escapes storefront translations unless the leaf key ends in _html.
// This adapter is intentionally local to this regression: changing the general
// LiquidJS fixture would alter unrelated consumers' existing test semantics.
for (const language of ['es', 'en.default']) {
  test(`measurement fallback paragraphs survive native translation escaping (${language})`, () => {
    const messages = json(`locales/${language}.json`);
    const engine = createComponentEngine({ language });
    const escapeNative = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
    engine.registerFilter('t', key => {
      const value = String(key).split('.').reduce((result, part) => result?.[part], messages);
      if (typeof value !== 'string') throw new Error(`Missing translation: ${key}`);
      return String(key).endsWith('_html') ? value : escapeNative(value);
    });
    const html = engine.renderFileSync('lemoon-guide-page', {
      section: { id: 'native-translation-fixture', settings: { guide_kind: 'measurements', padding_top: 64, padding_bottom: 64 } },
      settings: { animations_reveal_on_scroll: false },
      routes: { root_url: '/', all_products_collection_url: '/collections/all' },
      page: { title: 'Measurement guide' },
    });
    expect(html).not.toContain('&lt;p&gt;');
    expect(html).not.toContain('&lt;/p&gt;');
    const stepBodies = [...html.matchAll(/<div class="lemoon-guide__measurement-body rte">([\s\S]*?)<\/div>/g)].map(match => match[1]);
    expect(stepBodies).toHaveLength(3);
    for (const body of stepBodies) expect(body).toMatch(/<p\b/);
    const help = html.split('<aside class="lemoon-guide__help"')[1];
    expect(help).toMatch(/<div class="rte">\s*<p\b/);
  });
}

for (const language of ['es', 'en.default']) {
  test(`step3 keeps the approved HTML complete within locale upload limits (${language})`, () => {
    const approved = json('tests/fixtures/measurement-step-three-approved.json')[language];
    const bodies = html => [...html.matchAll(/<div class="lemoon-guide__measurement-body rte">([\s\S]*?)<\/div>/g)].map(match => match[1].trim());
    const html = render('lemoon-guide-page', { language, settings: { guide_kind: 'measurements' } });
    expect(bodies(html)[2]).toBe(approved);
    const override = '<p>Contenido propio del editor.</p>';
    const changed = render('lemoon-guide-page', { language, settings: { guide_kind: 'measurements', measurements_step_3_body: override } });
    expect(bodies(changed)[2]).toBe(override);
    const schema = JSON.parse(file('sections/lemoon-guide-page.liquid').match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
    expect(schema.settings.find(({ id }) => id === 'measurements_step_3_body').type).toBe('richtext');
    expect(schema.settings.find(({ id }) => id === 'measurements_step_3_body')).not.toHaveProperty('default');
  });
}
