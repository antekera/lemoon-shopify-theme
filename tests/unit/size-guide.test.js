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
