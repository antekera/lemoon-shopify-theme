import { describe, expect, it } from 'vitest';
import { facePreviewDestination } from '../../assets/lemoon-face-frame-preview.js';
import { faceGuideSection, faceGuideShapes, renderFaceGuide, shapeParam } from '../helpers/face-guide-renderer.mjs';

const origin = 'https://fixture.test/pages/elegir-lentes-segun-tu-rostro';
const suggested = ['rectangular', 'redondo'];
const href = `/collections/all?${shapeParam}=rectangular&${shapeParam}=redondo`;

describe('native collection exit from selected illustrative frames', () => {
  it.each([[['ovalado']], [['redondo', 'aviador']], [faceGuideShapes]])('preserves suggestions alongside selected alternatives %j', selected => {
    const result = facePreviewDestination(href, suggested, selected, origin);
    const expected = [...new Set([...suggested, ...selected])];
    expect(result.shapes).toEqual(expected);
    expect(new URL(result.href, origin).searchParams.getAll(shapeParam)).toEqual(expected);
  });

  it('deduplicates repeated suggestions and alternatives', () => {
    const result = facePreviewDestination(href, suggested, ['redondo', 'ovalado', 'ovalado', 'rectangular'], origin);
    expect(result.shapes).toEqual([...suggested, 'ovalado']);
    expect(new URL(result.href, origin).searchParams.getAll(shapeParam)).toEqual([...suggested, 'ovalado']);
  });

  it('restores the suggested pair when the selection is empty', () => {
    const result = facePreviewDestination(href, suggested, [], origin);
    expect(result.shapes).toEqual(suggested);
    expect(new URL(result.href, origin).searchParams.getAll(shapeParam)).toEqual(suggested);
  });

  it('keeps the language route, unrelated parameters and hash intact', () => {
    const result = facePreviewDestination(`/en${href}&sort_by=title-ascending&filter.v.availability=1#products`, suggested, ['ojo de gato'], origin);
    const url = new URL(result.href, origin);
    expect(url.pathname).toBe('/en/collections/all');
    expect(url.searchParams.get('sort_by')).toBe('title-ascending');
    expect(url.searchParams.get('filter.v.availability')).toBe('1');
    expect(url.hash).toBe('#products');
    expect(url.searchParams.getAll(shapeParam)).toEqual([...suggested, 'ojo de gato']);
  });

  it.each([
    { href: '/collections/all', pair: suggested, selected: ['ovalado'] },
    { href: `/collections/all?${shapeParam}=rectangular`, pair: suggested, selected: ['ovalado'] },
    { href: `${href}&${shapeParam}=aviador`, pair: suggested, selected: ['ovalado'] },
    { href: `https://another.test${href}`, pair: suggested, selected: ['ovalado'] },
    { href, pair: ['rectangular', 'rectangular'], selected: ['ovalado'] },
    { href, pair: ['rectangular', 'unknown'], selected: ['ovalado'] },
    { href, pair: suggested, selected: ['not-a-native-shape'] },
    { href, pair: suggested, selected: 'ovalado' },
  ])('declines incomplete, unknown or foreign destinations: %j', ({ href: destination, pair, selected }) => {
    expect(facePreviewDestination(destination, pair, selected, origin)).toBeNull();
  });
});

describe('six face previews progressively rendered by the actual Liquid section', () => {
  it('exposes one preview per family with its own suggestions first and visible native pairs initially', () => {
    const html = renderFaceGuide();
    expect(html.match(/data-face-frame-preview(?:\s|>)/g)).toHaveLength(6);
    const articles = [...html.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)].map(([article]) => article);
    for (const [index, block] of faceGuideSection().blocks.entries()) {
      const article = articles[index];
      const pair = [block.settings.shape_1, block.settings.shape_2];
      const choices = [...article.matchAll(/data-face-frame-value="([^"]+)"/g)].map(([, value]) => value);
      expect(choices).toEqual([...pair, ...faceGuideShapes.filter(shape => !pair.includes(shape))]);
      expect(article).toMatch(/data-face-frame-picker hidden/);
      expect(article).toMatch(/data-face-frame-fallback>/);
      expect(article).toContain(`lemoon-face-${block.settings.kind}-editorial-v3-640.webp`);
      expect(article).toContain('data-face-frame-overlay');
    }
  });

  it.each(faceGuideSection().blocks.map((block, index) => [block.settings.kind, index]))('merchant replacement for %s disables only that family overlay', (kind, index) => {
    const section = faceGuideSection();
    section.blocks[index].settings.image = { url: '/assets/lemoon-category-opticos-generic-v1.jpg', width: 1402, height: 1122 };
    const html = renderFaceGuide({ section });
    const articles = [...html.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)].map(([article]) => article);
    const overridden = articles[index];
    expect(overridden).not.toContain('data-face-frame-preview');
    expect(overridden).not.toContain('data-face-frame-overlay');
    expect(overridden).toContain('lemoon-category-opticos-generic-v1.jpg');
    expect(overridden.match(/class="lemoon-face-guide__frame"/g)).toHaveLength(2);
    expect(html.match(/data-face-frame-preview(?:\s|>)/g)).toHaveLength(5);
    for (const [otherIndex, article] of articles.entries()) if (otherIndex !== index) expect(article).toContain('data-face-frame-overlay');
  });
});
