import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { createComponentEngine } from '../helpers/component-library-renderer.mjs';
import { sizeGuideContext } from '../helpers/size-guide-renderer.mjs';

function renderNote(type, language = 'es') {
  const context = sizeGuideContext('missing');
  context.product.type = type;
  return createComponentEngine({ language }).renderFileSync('lemoon-frame-price-note', context);
}

describe('PDP frame base price note', () => {
  it.each(['Óptico', 'Solar', 'Muestra solar'])('explains the price for %s frames', type => {
    expect(renderNote(type)).toContain('Precio base del marco. Cristales y tratamiento se suman aparte.');
  });

  it.each(['Accesorio', 'Accesorios', ''])('does not describe %s as a frame', type => {
    expect(renderNote(type)).not.toContain('lemoon-pdp__price-note');
  });

  it('uses localized copy and appears after the price in both PDP sections', () => {
    expect(renderNote('Óptico', 'en')).toContain('Frame base price. Lenses and treatments are added separately.');
    for (const section of ['main-product', 'lemoon-eyewear-product']) {
      const source = readFileSync(`sections/${section}.liquid`, 'utf8');
      const price = source.indexOf('class="lemoon-mobile-price-row"');
      const note = source.indexOf("render 'lemoon-frame-price-note', product: product");
      expect(price).toBeGreaterThanOrEqual(0);
      expect(note).toBeGreaterThan(price);
      expect(source.slice(price, note)).not.toContain('lemoon-product-promotions');
    }
  });
});
