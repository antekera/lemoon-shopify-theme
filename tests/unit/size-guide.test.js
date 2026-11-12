import { describe, it, expect } from 'vitest';
import { renderSizeContent, sizeGuideContext } from '../helpers/size-guide-renderer.mjs';
import { createComponentEngine } from '../helpers/component-library-renderer.mjs';
const options = process.env.SIZE_GUIDE_SOURCE_ROOT ? { sourceRoot: process.env.SIZE_GUIDE_SOURCE_ROOT } : {};
const referenceValues = html => {
  const list = html.match(/<dl class="lemoon-measurement-diagram__values"[^>]*>([\s\S]*?)<\/dl>/)?.[1] ?? '';
  return [...list.matchAll(/<dt>([\s\S]*?)<\/dt>\s*<dd>([\s\S]*?)<\/dd>/g)].map(([, term, value]) => value.replace(/<[^>]*>/g, '').trim());
};
const completeValues = ['A: 140 mm', 'B: 52 mm', 'C: 18 mm', 'D: 42 mm', 'E: 145 mm'];
const unavailableValues = ['A: —', 'B: —', 'C: —', 'D: —', 'E: —'];
describe('product measurements Liquid rendering', () => {
  it('annotates diagram markers with only validated available dimensions in both presentations', () => {
    for (const presentation of ['dialog', 'inline']) {
      const mode = presentation === 'dialog' ? { presentation: 'dialog' } : {};
      const full = renderSizeContent('complete', { ...options, ...mode }).replace(/<[^>]*>/g, '');
      for (const label of ['A · 140 mm', 'B · 52 mm', 'C · 18 mm', 'D · 42 mm', 'E · 145 mm']) expect(full).toContain(label);
      const partial = renderSizeContent('partial', { ...options, ...mode }).replace(/<[^>]*>/g, '');
      expect(partial).toContain('B · 52 mm');
      expect(partial).toContain('E · 145 mm');
      expect(partial).not.toContain('A · 140 mm');
      expect(partial).not.toContain('C · 18 mm');
      expect(partial).not.toContain('D · 42 mm');
      const absent = renderSizeContent('missing', { ...options, ...mode }).replace(/<[^>]*>/g, '');
      expect(absent).not.toMatch(/[A-E] · \d+ mm/);
    }
  });
  it('renders all supplied mm measurements without substitutions', () => {
    const html = renderSizeContent('complete', options);
    for (const value of [140, 52, 18, 42, 145]) expect(html).toContain(`data-mm="${value}"`);
  });
  it('renders only available measurements for partial data', () => {
    const html = renderSizeContent('partial', options);
    expect(html.match(/data-mm=/g)).toHaveLength(2);
    expect(html).toContain('data-mm="52"');
    expect(html).toContain('data-mm="145"');
  });
  for (const scenario of ['missing', 'empty-object', 'unknown', 'invalid']) {
    it(`shows a truthful fallback for ${scenario} measurements`, () => {
      const html = renderSizeContent(scenario, options);
      expect(html).not.toContain('data-mm=');
      expect(html).not.toContain('lemoon-frame-information__diagram');
      expect(html).toContain('Las medidas de este armazón aún no están disponibles.');
      expect(html).not.toContain('data-units');
      expect(html).not.toMatch(/<dl[^>]*>\s*<p/);
    });
  }
});

describe('product guide and inline information boundaries', () => {
  it('keeps product-information tabs and secondary details outside the modal measurements', () => {
    const dialog = renderSizeContent('complete', { ...options, presentation: 'dialog' });
    expect(dialog).not.toMatch(/role="(?:tablist|tab|tabpanel)"/);
    expect(dialog).toContain('Ejemplo educativo.');
    expect(dialog).not.toMatch(/data-mm=|data-units/);
    const inline = renderSizeContent('complete', options);
    expect(inline.match(/role="tab"/g)).toHaveLength(2);
    expect(inline.match(/data-mm=/g)).toHaveLength(5);
    for (const text of ['Acetato', 'Rectangular', '22 g', 'Unisex', 'Ovalado, corazón']) {
      expect(inline).toContain(text);
      expect(dialog).not.toContain(text);
    }
  });
  it('puts one named set of actual product values below the first illustration without measuring paragraphs', () => {
    const html = renderSizeContent('complete', { ...options, presentation: 'dialog' });
    expect(html.match(/role="img"/g)).toHaveLength(2);
    expect(referenceValues(html)).toEqual(completeValues);
    expect(html.match(/class="lemoon-measurement-diagram__values"/g)).toHaveLength(1);
    const legend = html.match(/<dl class="lemoon-measurement-diagram__values"[^>]*>([\s\S]*?)<\/dl>/)[1];
    expect(legend).not.toContain('visually-hidden');
    for (const name of ['Ancho total', 'Ancho del cristal', 'Puente', 'Alto del cristal', 'Largo de patilla']) expect(legend).toContain(name);
    expect(html.indexOf('lemoon-measurement-diagram__values')).toBeGreaterThan(html.indexOf('FrameSide-'));
    expect(html.indexOf('lemoon-measurement-diagram__values')).toBeLessThan(html.indexOf('<details'));
    expect(html).not.toContain('lemoon-measurement-definitions');
    expect(html).not.toContain('Mide en línea horizontal');
    expect(html).not.toContain('Mide un solo cristal');
    expect(html).not.toMatch(/data-units|Armazón sintético/);
    expect(html).toContain('Ejemplo educativo. No representa las medidas de un producto específico.');
    const pageDefinitions = createComponentEngine(options).renderFileSync('lemoon-measurement-definitions', {});
    expect(referenceValues(pageDefinitions)).toEqual([]);
    expect(pageDefinitions.match(/<dd>/g)).toHaveLength(5);
    expect(pageDefinitions).toContain('Mide en línea horizontal');
  });
  it('does not substitute the educational inscription for distinct product values', () => {
    const product = sizeGuideContext('complete').product;
    const dimensions = { frame_width: 152, lens_width: 56, bridge: 19, lens_height: 43, temple: 150 };
    product.metafields.custom.frame_dimensions.value = dimensions;
    const html = renderSizeContent('complete', { ...options, presentation: 'dialog', context: { product } });
    expect(referenceValues(html)).toEqual(['A: 152 mm', 'B: 56 mm', 'C: 19 mm', 'D: 43 mm', 'E: 150 mm']);
    expect(html).toContain('52 □ 18–145');
  });
  it('keeps inline values in mm with one contextual diagram and no educational instructions', () => {
    const html = renderSizeContent('complete', options);
    for (const value of [140, 52, 18, 42, 145]) expect(html).toContain(`>${value} mm</dd>`);
    expect(html.match(/<figure/g)).toHaveLength(1);
    expect(html).not.toMatch(/data-units|Ejemplo educativo|Mide en línea horizontal/);
    const characteristics = html.match(/data-size-panel="frame"[^>]*>([\s\S]*?)<\/section>/)?.[1];
    expect(characteristics).toBeTruthy();
    expect(characteristics).not.toMatch(/<svg|<figure|data-mm=/);
    expect(html).not.toContain('data-size-panel="fit"');
    expect(renderSizeContent('long', options)).not.toContain('Contenido sintético extenso');
  });
});

describe('modal measurement validation and page boundaries', () => {
  const dialog = (scenario, context) => renderSizeContent(scenario, { ...options, presentation: 'dialog', context });
  const reference = () => dialog('complete');
  for (const scenario of ['missing', 'empty-object', 'unknown', 'invalid', 'size-only']) {
    it(`keeps A–E unavailable rather than inventing numbers for ${scenario} data`, () => {
      const html = dialog(scenario);
      expect(referenceValues(html)).toEqual(unavailableValues);
      expect(html).toContain('Las medidas de este armazón aún no están disponibles.');
      expect(html).not.toMatch(/>\s*0 mm\s*</);
    });
  }
  it('preserves only supplied partial values in both inline information and compact modal references', () => {
    const html = renderSizeContent('partial', options);
    expect(html.match(/data-mm=/g)).toHaveLength(2);
    expect(html).toContain('data-mm="52"'); expect(html).toContain('data-mm="145"');
    expect(html).toContain('Se muestran las medidas disponibles de este armazón.');
    expect(referenceValues(dialog('partial'))).toEqual(['A: —', 'B: 52 mm', 'C: —', 'D: —', 'E: 145 mm']);
    expect(dialog('partial')).toContain('Se muestran las medidas disponibles de este armazón.');
  });
  it('preserves the numeric table when secondary product information is absent', () => {
    const html = renderSizeContent('secondary-empty', options);
    expect(html.match(/data-mm=/g)).toHaveLength(5);
    expect(html).not.toMatch(/<dl[^>]*class="lemoon-size-guide__specs"/);
    expect(dialog('secondary-empty')).toBe(reference());
  });
  it('keeps title and CMS body out of the modal while a missing product stays unmeasured', () => {
    expect(dialog('long-title')).toBe(reference());
    expect(referenceValues(dialog('complete', { product: null }))).toEqual(unavailableValues);
    expect(dialog('long')).not.toContain('Contenido sintético extenso');
  });
  it('shows demo notices only for tagged products that supply at least one valid measurement', () => {
    const taggedProduct = scenario => ({ ...sizeGuideContext(scenario).product, tags: ['lemoon-measurements-demo'] });
    const notice = 'Medidas de prueba para revisar esta página.';
    const tagged = renderSizeContent('complete', { ...options, context: { product: taggedProduct('complete') } });
    expect(tagged).toContain(notice);
    expect(tagged.match(/data-mm=/g)).toHaveLength(5);
    expect(tagged.indexOf(notice)).toBeLessThan(tagged.indexOf('data-mm='));
    expect(renderSizeContent('complete', options)).not.toContain(notice);
    expect(renderSizeContent('missing', { ...options, context: { product: taggedProduct('missing') } })).not.toContain(notice);
    const taggedDialog = dialog('complete', { product: taggedProduct('complete') });
    expect(taggedDialog).toContain(notice);
    expect(taggedDialog.indexOf(notice)).toBeLessThan(taggedDialog.indexOf('class="lemoon-measurement-diagram__values"'));
    expect(dialog('partial', { product: taggedProduct('partial') })).toContain(notice);
    expect(dialog('complete')).not.toContain(notice);
    for (const scenario of ['missing', 'invalid', 'unknown']) expect(dialog(scenario, { product: taggedProduct(scenario) })).not.toContain(notice);
  });
  it('starts the comparison closed and removes the former help and comparison-limit footer', () => {
    const html = reference();
    expect(html).toMatch(/<details class="lemoon-size-guide__comparison">\s*<summary>/);
    expect(html).not.toContain('href="/pages/contact"');
    expect(html).not.toContain('La forma del puente y de las patillas también influye');
    const comparison = html.slice(html.indexOf('<details'), html.indexOf('</details>'));
    expect(comparison).toContain('lemoon-size-comparison__inscription');
    expect(comparison).toContain('<figcaption class="lemoon-size-comparison__note">');
    expect(comparison).not.toContain('lemoon-size-comparison__rows');
    expect(comparison).toContain('¿Tienes más dudas?');
    expect(comparison).toContain('href="/pages/como-medir-tus-anteojos"');
    expect(comparison.indexOf('lemoon-size-guide__links')).toBeGreaterThan(comparison.indexOf('lemoon-size-comparison__footer'));
    expect(html.slice(html.indexOf('</details>'))).not.toContain('lemoon-size-guide__links');
  });
  it('honors a selected published guide and falls back to the localized canonical guide for absent or unsuitable selections', () => {
    const page = { url: '/en/pages/selected-measurement-guide', template_suffix: 'guia-medidas', published_at: '2026-10-04', content: '<p>NEVER EMBED THIS BODY</p>' };
    const renderPage = (selected, root = '/en') => dialog('complete', { routes: { root_url: root }, settings: { lemoon_size_guide_page: selected } });
    const html = renderPage(page);
    expect(html).toContain(`href="${page.url}"`);
    expect(html).not.toContain('href="/en/pages/contact"');
    expect(html).not.toContain('NEVER EMBED THIS BODY');
    for (const selected of [null, { ...page, url: '' }, { ...page, template_suffix: null }, { ...page, template_suffix: 'contact' }, { ...page, published_at: null }]) {
      expect(renderPage(selected)).toContain('href="/en/pages/como-medir-tus-anteojos"');
      expect(renderPage(selected)).not.toContain(`href="${page.url}"`);
    }
    for (const [root, href] of [['/', '/pages/como-medir-tus-anteojos'], ['/en', '/en/pages/como-medir-tus-anteojos'], ['/en/', '/en/pages/como-medir-tus-anteojos']]) expect(renderPage(null, root)).toContain(`href="${href}"`);
    const english = renderSizeContent('complete', { ...options, language: 'en', presentation: 'dialog', context: { routes: { root_url: '/en' } } });
    expect(english).toContain('href="/en/pages/como-medir-tus-anteojos"');
    expect(english).not.toContain('¿Tienes más dudas?');
  });
});
