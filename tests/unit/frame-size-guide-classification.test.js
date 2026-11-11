import { describe, expect, it } from 'vitest';
import { createComponentEngine } from '../helpers/component-library-renderer.mjs';
import { sizeGuideContext } from '../helpers/size-guide-renderer.mjs';
import { readFileSync } from 'node:fs';

const engine = createComponentEngine();
function renderGuide({ type = '', tags = [], custom = {} } = {}) {
  const context = sizeGuideContext('missing');
  context.product.type = type;
  context.product.tags = tags;
  context.product.metafields.custom = custom;
  return engine.renderFileSync('lemoon-product-size-guide', context);
}

function renderEyewearGuide(evidence, whitespace = false) {
  const source = readFileSync('sections/lemoon-eyewear-product.liquid', 'utf8');
  const parts = ['data-frame-size', 'data-dialog="size"'].map(marker => {
    const position = source.indexOf(marker);
    const start = source.lastIndexOf("{%- if frame_product == 'true' -%}", position);
    const end = source.indexOf('{%- endif -%}', source.indexOf(marker === 'data-frame-size' ? '</button></div>' : '</dialog>', position)) + '{%- endif -%}'.length;
    if (position < 0 || start < 0 || end < '{%- endif -%}'.length) throw new Error('Eyewear guide boundaries changed');
    return source.slice(start, end);
  });
  const context = sizeGuideContext('missing');
  context.product.type = evidence.type || '';
  context.product.tags = evidence.tags || [];
  context.product.metafields.custom = evidence.custom || {};
  const prelude = source.match(/capture frame_product[\s\S]*?assign frame_product = frame_product \| strip/)?.[0];
  if (!prelude) throw new Error('Optical classification capture boundaries changed');
  const capture = whitespace ? prelude.replace("render 'lemoon-frame-classification', product: product", "echo '  true  '") : prelude;
  return engine.parseAndRenderSync('{% liquid\n' + capture + '\n%}' + parts.join(''), context);
}

describe('product size guide frame classification', () => {
  it.each(['Óptico', 'Opticos', 'Armazon', 'Solar', 'Muestra solar', 'Lentes de sol'])('shows the guide for %s even without measurements', type => {
    const html = renderGuide({ type });
    expect(html).toContain('data-size-open');
    expect(html).toContain('<dialog');
  });

  it.each([
    { tags: ['armazón'] },
    { tags: ['lemoon-menu-sol'] },
    { custom: { frame_shape: { value: 'Redondo' } } },
    { custom: { frame_size: { value: 'M' } } },
    { custom: { frame_dimensions: { value: { lens_width: 52 } } } },
  ])('accepts explicit frame catalog evidence: %j', evidence => {
    expect(renderGuide(evidence)).toContain('data-size-open');
  });

  it.each([
    { type: 'Accesorios' },
    { type: 'Accesorio', tags: ['armazón'], custom: { frame_size: { value: 'M' } } },
    { type: 'Bolso' },
    {},
    { custom: { prescription_type: { value: ['Sin receta'] } } },
  ])('omits the guide and dialog without frame evidence: %j', evidence => {
    const html = renderGuide(evidence);
    expect(html).not.toContain('data-size-open');
    expect(html).not.toContain('<dialog');
  });

  it.each([
    [{ type: 'Óptico' }, true],
    [{ type: 'Muestra solar' }, true],
    [{ type: 'Accesorios', custom: { frame_size: { value: 'M' } } }, false],
    [{ type: '' }, false],
  ])('uses the same guard for the optical section: %j', (evidence, expected) => {
    const html = renderEyewearGuide(evidence);
    expect(html.includes('data-open-dialog="size"')).toBe(expected);
    expect(html.includes('data-dialog="size"')).toBe(expected);
  });

  it('accepts whitespace around a captured true classification in both consumers', () => {
    const context = sizeGuideContext('missing');
    const source = readFileSync('snippets/lemoon-product-size-guide.liquid', 'utf8')
      .replace("render 'lemoon-frame-classification', product: product", "echo '  true  '");
    const standard = engine.parseAndRenderSync(source.replace(/\{% doc %\}[\s\S]*?\{% enddoc %\}/, ''), context);
    const optical = renderEyewearGuide({ type: 'Óptico' }, true);
    expect(standard).toContain('data-size-open');
    expect(optical).toContain('data-open-dialog="size"');
    expect(optical).toContain('data-dialog="size"');
  });
});
