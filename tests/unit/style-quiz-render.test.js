import { describe, it, expect } from 'vitest';
import { renderQuizSection, quizProduct } from '../helpers/style-quiz-renderer.mjs';

const decode = value => value.replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code))).replaceAll('&quot;', '"').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');
const candidates = html => [...html.matchAll(/data-candidate=(?:"([^"]*)"|'([^']*)')/g)].map(match => JSON.parse(decode(match[1] ?? match[2])));

describe('Liquid quiz catalog boundary (declared Shopify-shaped fixtures)', () => {
  it('emits only ready products and marks sold-out variants ineligible', () => {
    const rows = candidates(renderQuizSection());
    expect(rows).toHaveLength(14);
    expect([...new Set(rows.map(row => String(row.id)))]).toEqual(['101', '102', '103', '104', '105', '106', '108']);
    expect(rows.filter(row => row.available)).toHaveLength(12);
    expect(rows.filter(row => String(row.id) === '108').every(row => row.available === false)).toBe(true);
    expect(rows.every(row => typeof row.price === 'number')).toBe(true);
  });

  it('overrides product traits only for groups explicitly assigned to the variant', () => {
    const rows = candidates(renderQuizSection({ products: [quizProduct(101)] }));
    const blue = rows.find(row => String(row.variantId) === '1011');
    const tortoise = rows.find(row => String(row.variantId) === '1012');
    expect(blue.attributes).toMatchObject({ color: ['bold'], pattern: ['plain'], finish: ['matte'], use: ['work'], presence: ['compact'] });
    expect(tortoise.attributes).toMatchObject({ color: ['brown'], pattern: ['tortoise'], finish: ['glossy'], use: ['work'], presence: ['compact'] });
    expect(tortoise.attributes.finish).not.toContain('matte');
  });

  it('keeps product material and shape independent of the presence and color trait groups', () => {
    const [row] = candidates(renderQuizSection({ products: [quizProduct(101, { shape: 'pantóstico', material: 'metal' })] }));
    expect(row.attributes.shape).toEqual(['pantóstico']);
    expect(row.attributes.material).toEqual(['metal']);
    expect(row.attributes.presence).toEqual(['compact']);
  });

  it('escapes untrusted product text instead of introducing executable HTML', () => {
    const html = renderQuizSection({ scenario: 'unsafe' });
    expect(html).not.toContain('<img src=x onerror="alert(1)">');
    expect(html).toContain('&lt;img');
    expect(candidates(html)).toHaveLength(14);
  });

  it('handles products without media and an empty curated collection', () => {
    const html = renderQuizSection({ products: [quizProduct(106, { noMedia: true })] });
    expect(candidates(html)).toHaveLength(2);
    expect(html).toContain('lemoon-product-fallback.png');
    expect(candidates(renderQuizSection({ scenario: 'empty' }))).toEqual([]);
  });

  it('bounds emitted catalog data to fifty products and twenty variants per product', () => {
    const products = Array.from({ length: 51 }, (_, index) => quizProduct(index + 1));
    const rows = candidates(renderQuizSection({ products }));
    expect(rows).toHaveLength(100);
    expect(rows.some(row => String(row.id) === '51')).toBe(false);
    const product = quizProduct(101);
    product.variants = Array.from({ length: 21 }, (_, index) => ({ ...product.variants[0], id: 2000 + index }));
    const variants = candidates(renderQuizSection({ products: [product] }));
    expect(variants).toHaveLength(20);
    expect(variants.some(row => String(row.variantId) === '2020')).toBe(false);
  });
});
