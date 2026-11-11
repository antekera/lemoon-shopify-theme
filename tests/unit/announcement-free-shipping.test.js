import { readFileSync } from 'node:fs';
import { Liquid } from 'liquidjs';
import { describe, expect, it } from 'vitest';

const source = readFileSync('sections/announcement-bar.liquid', 'utf8')
  .replace(/{% schema %}[\s\S]*?{% endschema %}/, '')
  .replace(/{%-? form '[\s\S]*?{%-? endform -?%}/g, '');
const engine = new Liquid();
engine.registerFilter('money', value => '$' + Number(value / 100).toLocaleString('es-CL'));
engine.registerFilter('t', value => value === 'general.slider.of' ? 'de' : value);
engine.registerFilter('inline_asset_content', () => '');
engine.registerFilter('stylesheet_tag', () => '');
const shipping = { settings: { text: 'Envío gratis desde [MONTO_ENVIO_GRATIS]' } };
const message = text => ({ settings: { text } });
const render = (value, blocks) => engine.parseAndRender(source, {
  section: { id: 'fixture', settings: {}, blocks }, settings: {}, request: {},
  shop: { metafields: { custom: { free_shipping_threshold: { value } } } },
  localization: { available_countries: [], available_languages: [] },
});

describe('free shipping announcement', () => {
  it('formats the shared value without changing other messages', async () => {
    const html = await render(70000, [shipping, message('Bienvenidos'), message('Explora')]);
    expect(html).toContain('Envío gratis desde $70.000');
    expect(html).toContain('Bienvenidos');
    expect(html).toContain('Explora');
    expect(html).toContain('aria-label="3 de 3"');
  });
  it('uses a changed amount without a hardcoded threshold', async () => {
    const html = await render(85000, [shipping]);
    expect(html).toContain('Envío gratis desde $85.000');
    expect(html).not.toContain('$70.000');
  });
  it.each([undefined, 0, -1])('omits the shipping slide for missing or nonpositive %s', async value => {
    const html = await render(value, [shipping, message('Bienvenidos'), message('Explora')]);
    expect(html).not.toContain('Envío gratis');
    expect(html).not.toContain('[MONTO_ENVIO_GRATIS]');
    expect(html).toContain('aria-label="2 de 2"');
  });
  it('shows the remaining announcement outside a carousel', async () => {
    const html = await render(undefined, [shipping, message('Bienvenidos')]);
    expect(html).toContain('Bienvenidos');
    expect(html).not.toContain('<slideshow-component');
  });
  it('shows no message if the unavailable shipping announcement is the only block', async () => {
    const html = await render(undefined, [shipping]);
    expect(html).not.toContain('announcement-bar__message');
  });
});
