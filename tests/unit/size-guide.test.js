import { describe, it, expect } from 'vitest';
import { renderSizeContent } from '../helpers/size-guide-renderer.mjs';
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

describe('continuous PDP dialog composition', () => {
  it('uses semantic sections instead of tabs while retaining default inline tabs', () => {
    const dialog = renderSizeContent('complete', { ...options, presentation: 'dialog' });
    expect(dialog).not.toMatch(/role="(?:tablist|tab|tabpanel)"/);
    expect(dialog).toContain('Ejemplo educativo.');
    expect(dialog.match(/data-mm=/g)).toHaveLength(5);
    for (const text of ['Acetato', 'Rectangular', '22 g', 'Unisex', 'Ovalado, corazón']) expect(dialog).toContain(text);
    expect(renderSizeContent('complete', options).match(/role="tab"/g)).toHaveLength(3);
  });
  it('puts units and every product value before the explanatory drawing in dialog reading order', () => {
    const html = renderSizeContent('complete', { ...options, presentation: 'dialog' });
    const unitSelector = html.indexOf('<select');
    const diagram = html.indexOf('<figure');
    expect(unitSelector).toBeGreaterThan(-1);
    for (const value of [140, 52, 18, 42, 145]) {
      const position = html.indexOf(`data-mm="${value}"`);
      expect(position).toBeGreaterThan(unitSelector);
      expect(position).toBeLessThan(diagram);
    }
  });
  it('preserves drawing, units and values in the default inline reading order', () => {
    const html = renderSizeContent('complete', options);
    const diagram = html.indexOf('<figure');
    const unitSelector = html.indexOf('<select');
    expect(diagram).toBeGreaterThan(-1);
    expect(unitSelector).toBeGreaterThan(diagram);
    for (const value of [140, 52, 18, 42, 145]) expect(html.indexOf(`data-mm="${value}"`)).toBeGreaterThan(unitSelector);
  });
});

describe('continuous dialog data and page boundaries', () => {
  const dialog = (scenario, context) => renderSizeContent(scenario, { ...options, presentation: 'dialog', context });
  for (const scenario of ['missing', 'empty-object', 'unknown', 'invalid', 'size-only']) {
    it(`keeps education separate from unavailable product measurements (${scenario})`, () => {
      const html = dialog(scenario);
      expect(html).not.toMatch(/data-mm=|data-units/);
      expect(html).toContain('Las medidas de este armazón aún no están disponibles.');
      expect(html).toContain('Ejemplo educativo.');
      if (scenario === 'size-only') expect(html).toMatch(/<dd>\s*M\s*<\/dd>/);
      else expect(html).not.toMatch(/<dl[^>]*class="lemoon-size-guide__specs"/);
    });
  }
  it('renders partial supplied values and their information warning', () => {
    const html = dialog('partial');
    expect(html.match(/data-mm=/g)).toHaveLength(2);
    expect(html).toContain('data-mm="52"'); expect(html).toContain('data-mm="145"');
    expect(html).toContain('Se muestran las medidas disponibles de este armazón.');
  });
  it('omits absent secondary sections while keeping supplied numeric measurements', () => {
    const html = dialog('secondary-empty');
    expect(html.match(/data-mm=/g)).toHaveLength(5);
    expect(html).not.toMatch(/<dl[^>]*class="lemoon-size-guide__specs"/);
  });
  it('escapes product context and never embeds the long CMS guide in the dialog', () => {
    const title = dialog('long-title');
    expect(title).toContain('&lt;script&gt;');
    expect(title).not.toContain('<script>título largo</script>');
    expect(dialog('long')).not.toContain('Contenido sintético extenso');
    expect(renderSizeContent('long', options)).toContain('Contenido sintético extenso');
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
