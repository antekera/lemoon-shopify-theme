import { describe, it, expect } from 'vitest';
import { renderSizeContent, sizeGuideContext } from '../helpers/size-guide-renderer.mjs';
const options = process.env.SIZE_GUIDE_SOURCE_ROOT ? { sourceRoot: process.env.SIZE_GUIDE_SOURCE_ROOT } : {};
describe('product measurements Liquid rendering', () => {
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
      expect(html).toContain('Las medidas de este armazón aún no están disponibles.');
      expect(html).not.toContain('data-units');
      expect(html).not.toMatch(/<dl[^>]*>\s*<p/);
    });
  }
});

describe('generic guide and product information boundaries', () => {
  it('keeps the three product-information tabs and their real data outside the generic dialog', () => {
    const dialog = renderSizeContent('complete', { ...options, presentation: 'dialog' });
    expect(dialog).not.toMatch(/role="(?:tablist|tab|tabpanel)"/);
    expect(dialog).toContain('Ejemplo educativo.');
    expect(dialog).not.toMatch(/data-mm=|data-units/);
    const inline = renderSizeContent('complete', options);
    expect(inline.match(/role="tab"/g)).toHaveLength(3);
    expect(inline.match(/data-mm=/g)).toHaveLength(5);
    for (const text of ['Acetato', 'Rectangular', '22 g', 'Unisex', 'Ovalado, corazón']) {
      expect(inline).toContain(text);
      expect(dialog).not.toContain(text);
    }
  });
  it('renders diagrams and five explanations without a current-product table or conversion control', () => {
    const html = renderSizeContent('complete', { ...options, presentation: 'dialog' });
    expect(html.match(/role="img"/g)).toHaveLength(2);
    expect(html.match(/<dt>/g)).toHaveLength(5);
    expect(html).not.toMatch(/data-mm=|data-units|140 mm|42 mm|Armazón sintético/);
    expect(html).toContain('Ejemplo educativo. No representa las medidas de un producto específico.');
  });
  it('keeps inline measurements in mm without the educational diagrams or CMS guide body', () => {
    const html = renderSizeContent('complete', options);
    for (const value of [140, 52, 18, 42, 145]) expect(html).toContain(`>${value} mm</dd>`);
    expect(html).not.toMatch(/<svg|<figure|data-units|Ejemplo educativo/);
    expect(renderSizeContent('long', options)).not.toContain('Contenido sintético extenso');
  });
});

describe('generic dialog data independence and page boundaries', () => {
  const dialog = (scenario, context) => renderSizeContent(scenario, { ...options, presentation: 'dialog', context });
  const reference = () => dialog('complete');
  for (const scenario of ['missing', 'empty-object', 'unknown', 'invalid', 'size-only']) {
    it(`keeps the generic reference identical for ${scenario} product measurements`, () => {
      expect(dialog(scenario)).toBe(reference());
    });
  }
  it('keeps partial supplied values and their warning in product information only', () => {
    const html = renderSizeContent('partial', options);
    expect(html.match(/data-mm=/g)).toHaveLength(2);
    expect(html).toContain('data-mm="52"'); expect(html).toContain('data-mm="145"');
    expect(html).toContain('Se muestran las medidas disponibles de este armazón.');
    expect(dialog('partial')).toBe(reference());
  });
  it('preserves the numeric table when secondary product information is absent', () => {
    const html = renderSizeContent('secondary-empty', options);
    expect(html.match(/data-mm=/g)).toHaveLength(5);
    expect(html).not.toMatch(/<dl[^>]*class="lemoon-size-guide__specs"/);
    expect(dialog('secondary-empty')).toBe(reference());
  });
  it('does not require a product or expose its title or CMS body in the generic guide', () => {
    expect(dialog('long-title')).toBe(reference());
    expect(dialog('complete', { product: null })).toBe(reference());
    expect(dialog('long')).not.toContain('Contenido sintético extenso');
  });
  it('identifies explicitly tagged demo numbers only beside a nonempty PDP table', () => {
    const taggedProduct = scenario => ({ ...sizeGuideContext(scenario).product, tags: ['lemoon-measurements-demo'] });
    const notice = 'Medidas de prueba para revisar esta página.';
    const tagged = renderSizeContent('complete', { ...options, context: { product: taggedProduct('complete') } });
    expect(tagged).toContain(notice);
    expect(tagged.match(/data-mm=/g)).toHaveLength(5);
    expect(tagged.indexOf(notice)).toBeLessThan(tagged.indexOf('data-mm='));
    expect(renderSizeContent('complete', options)).not.toContain(notice);
    expect(renderSizeContent('missing', { ...options, context: { product: taggedProduct('missing') } })).not.toContain(notice);
    expect(dialog('complete', { product: taggedProduct('complete') })).toBe(reference());
  });
  it('links the full guide only for a selected published guide template', () => {
    const page = { url: '/en/pages/como-medir-tus-lentes', template_suffix: 'guia-medidas', published_at: '2026-10-04', content: '<p>NEVER EMBED THIS BODY</p>' };
    const renderPage = selected => dialog('complete', { routes: { root_url: '/en' }, settings: { lemoon_size_guide_page: selected } });
    const html = renderPage(page);
    expect(html).toContain(`href="${page.url}"`);
    expect(html).toContain('href="/en/pages/contact"');
    expect(html).not.toContain('NEVER EMBED THIS BODY');
    for (const selected of [null, { ...page, url: '' }, { ...page, template_suffix: null }, { ...page, template_suffix: 'contact' }, { ...page, published_at: null }]) expect(renderPage(selected)).not.toContain(`href="${page.url}"`);
  });
});
