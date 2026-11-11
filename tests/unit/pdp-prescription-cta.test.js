import { describe, expect, it } from 'vitest';
import { createComponentEngine } from '../helpers/component-library-renderer.mjs';

const engine = createComponentEngine();
const render = (value, context = 'link', disabled = false) => engine.renderFileSync('lemoon-select-lenses-button', {
  context,
  disabled,
  product: {
    url: '/products/frame',
    selected_or_first_available_variant: { id: 42 },
    metafields: { custom: value === undefined ? {} : { prescription_type: { value } } },
  },
});

describe('PDP prescription action', () => {
  for (const context of ['link', 'eyewear', 'sticky']) {
    it(`omits the ${context} action when the prescription list is missing or empty`, () => {
      expect(render(undefined, context).trim()).toBe('');
      expect(render([], context).trim()).toBe('');
    });
    it(`shows the ${context} action for a nonempty prescription list`, () => {
      expect(render(['Monofocal'], context)).toContain('lemoon-select-lenses-button');
      expect(render(['Sin receta'], context)).toContain('lemoon-select-lenses-button');
    });
  }
  it('retains the selected variant in the configurator link', () => {
    expect(render(['Monofocal'])).toContain('/products/frame?variant=42&view=configurador');
  });
});
