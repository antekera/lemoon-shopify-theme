import { describe, it, expect } from 'vitest';
import { rankProducts, suggestPresence } from '../../assets/lemoon-style-quiz.js';

const candidate = (id, attributes = {}, extra = {}) => ({ id, variantId: `${id}-blue`, price: 50000, available: true, attributes, ...extra });
const ids = result => result.map(item => item.id);

describe('optional measurement-based visual proportion suggestion', () => {
  it.each([
    [48, 18, 'compact'], [49, 19, 'compact'], [49, 20, 'medium'],
    [50, 18, 'medium'], [54, 20, 'medium'], [55, 19, 'oversize'], [58, 18, 'oversize'],
  ])('suggests a visual proportion for %s / %s mm', (lens_width, bridge, expected) => {
    expect(suggestPresence({ lens_width, bridge, temple: 140 })).toBe(expected);
  });

  it('requires three valid measurements and does not treat temple length as frontal width', () => {
    expect(suggestPresence({ lens_width: ' 50 ', bridge: '18', temple: '140' })).toBe('medium');
    for (const temple of [100, 140, 180]) expect(suggestPresence({ lens_width: 50, bridge: 18, temple })).toBe('medium');
    for (const missing of ['lens_width', 'bridge', 'temple']) {
      const measures = { lens_width: 50, bridge: 18, temple: 140 };
      delete measures[missing];
      expect(suggestPresence(measures)).toBeNull();
    }
    expect(suggestPresence()).toBeNull();
    expect(suggestPresence(null)).toBeNull();
  });

  it('does not classify malformed, fractional or out-of-range references', () => {
    for (const lens_width of ['', 'abc', '5e1', '50.5', -50, 0, 29, 81, Infinity]) {
      expect(suggestPresence({ lens_width, bridge: 18, temple: 140 })).toBeNull();
    }
    for (const bridge of [9, 36]) expect(suggestPresence({ lens_width: 50, bridge, temple: 140 })).toBeNull();
    for (const temple of [99, 181]) expect(suggestPresence({ lens_width: 50, bridge: 18, temple })).toBeNull();
  });
});

describe('style affinity recommendations', () => {
  it('returns the complete ranked group and truthful reasons, preserving order for ties', () => {
    const result = rankProducts([
      candidate('color', { color: ['blue'] }), candidate('both', { shape: ['round'], color: ['blue'] }),
      candidate('shape', { shape: ['round'] }), candidate('fourth', { shape: ['round'] }), candidate('fifth', { color: ['blue'] }),
    ], { shape: ['round'], color: ['blue'] });
    expect(ids(result)).toEqual(['both', 'color', 'shape', 'fourth', 'fifth']);
    expect(result[0]).toMatchObject({ score: 2, matched: ['shape', 'color'], editorial: false });
    expect(result[1]).toMatchObject({ score: 1, matched: ['color'] });
  });
  it('counts each axis once regardless of duplicate and multiple values', () => {
    const result = rankProducts([
      candidate('one', { color: ['blue', 'blue', 'green', 'red'] }),
      candidate('two', { color: ['blue'], material: ['metal'] }),
    ], { color: ['blue', 'blue', 'green', 'red'], material: ['metal'] });
    expect(ids(result)).toEqual(['two', 'one']);
    expect(result.map(item => item.score)).toEqual([2, 1]);
  });
  it('selects the highest-affinity variant before deduplicating products', () => {
    const result = rankProducts([
      candidate('a', { color: ['blue'] }, { variantId: 'a-blue' }), candidate('b', { color: ['brown'] }),
      candidate('a', { color: ['brown'], pattern: ['tortoise'] }, { variantId: 'a-tortoise' }),
    ], { color: ['brown'], pattern: ['tortoise'] });
    expect(ids(result)).toEqual(['a', 'b']);
    expect(result[0]).toMatchObject({ variantId: 'a-tortoise', matched: ['color', 'pattern'] });
  });
  it('never joins attributes of different variants into an imaginary match', () => {
    const result = rankProducts([
      candidate('split', { color: ['blue'], finish: ['glossy'] }, { variantId: 'split-blue' }),
      candidate('split', { color: ['brown'], finish: ['matte'] }, { variantId: 'split-matte' }),
      candidate('actual', { color: ['blue'], finish: ['matte'] }),
    ], { color: ['blue'], finish: ['matte'] });
    expect(ids(result)).toEqual(['actual', 'split']);
    expect(result[1]).toMatchObject({ variantId: 'split-blue', score: 1, matched: ['color'] });
  });
  it('uses the available alternative instead of an unavailable stronger variant', () => {
    const result = rankProducts([
      candidate('a', { shape: ['round'], color: ['blue'] }, { variantId: 'sold-out', available: false }),
      candidate('a', { shape: ['round'] }, { variantId: 'in-stock' }),
    ], { shape: ['round'], color: ['blue'] });
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ variantId: 'in-stock', score: 1 });
  });
  it('keeps the first variant when scores are tied', () => {
    const result = rankProducts([
      candidate('b', { shape: ['round'] }, { variantId: 'b-first' }), candidate('a', { shape: ['round'] }),
      candidate('b', { shape: ['round'] }, { variantId: 'b-second' }),
    ], { shape: ['round'] });
    expect(ids(result)).toEqual(['b', 'a']);
    expect(result[0].variantId).toBe('b-first');
  });
  it('identifies all-skipped results as editorial and keeps candidates without attributes', () => {
    const result = rankProducts([candidate('a', { shape: ['round'] }), candidate('b'), candidate('a', {}, { variantId: 'a-other' })], { shape: [], color: [], use: [] });
    expect(ids(result)).toEqual(['a', 'b']);
    expect(result.every(item => item.editorial && item.score === 0 && item.matched.length === 0)).toBe(true);
  });
  it('handles absent answers as editorial', () => {
    expect(ids(rankProducts([candidate('a')]))).toEqual(['a']);
    expect(ids(rankProducts([candidate('a')], null))).toEqual(['a']);
  });
  it('does not filter or order by budget, gender or face shape', () => {
    const products = [candidate('expensive', { shape: ['round'] }, { price: 900000 }), candidate('cheap', { shape: ['round'] }, { price: 100 })];
    expect(ids(rankProducts(products, { shape: ['round'], budget: 0, gender: 'woman', face: 'square' }))).toEqual(['expensive', 'cheap']);
    expect(rankProducts(products, { budget: 0 })[0].editorial).toBe(true);
  });
  it('rejects malformed prices and preserves a real zero price', () => {
    const products = [undefined, null, NaN, Infinity, -1, '100'].map((price, index) => candidate(`bad-${index}`, { shape: ['round'] }, { price }));
    products.push(candidate('zero', { shape: ['round'] }, { price: 0 }));
    expect(ids(rankProducts(products, { shape: ['round'] }))).toEqual(['zero']);
  });
  it('rejects unidentifiable and unavailable candidates', () => {
    expect(rankProducts([candidate('', { shape: ['round'] }), candidate('missing-variant', { shape: ['round'] }, { variantId: '' }), candidate('unavailable', { shape: ['round'] }, { available: false })], { shape: ['round'] })).toEqual([]);
  });
  it('does not manufacture matches from missing or malformed attributes', () => {
    expect(rankProducts([candidate('missing'), candidate('null', null), candidate('wrong-type', { shape: { round: true } }), candidate('unknown', { shape: ['square'] })], { shape: ['round'] })).toEqual([]);
  });
  it('keeps finish, pattern, material, transparency and presence independent', () => {
    const result = rankProducts([
      candidate('matte', { finish: ['matte'], material: ['acetate'] }), candidate('pattern', { pattern: ['tortoise'], color: ['brown'] }),
      candidate('presence', { presence: ['oversize'], width: ['wide'] }),
    ], { finish: ['matte'], pattern: ['tortoise'], transparency: ['clear'], presence: ['compact'] });
    expect(ids(result)).toEqual(['matte', 'pattern']);
    expect(result.map(item => item.matched)).toEqual([['finish'], ['pattern']]);
  });
  it('normalizes existing Spanish shape and material without silently reclassifying panto as round', () => {
    const result = rankProducts([candidate('cat', { shape: ['ojo de gato'], material: ['acetato'] }), candidate('oval', { shape: ['ovalado'], material: ['titanio'] })], { shape: ['cat-eye'], material: ['acetate'] });
    expect(ids(result)).toEqual(['cat']);
    expect(result[0].matched).toEqual(['shape', 'material']);
    expect(rankProducts([candidate('panto', { shape: ['pantóstico'] })], { shape: ['round'] })).toEqual([]);
  });
  it('does not mutate input candidates or answer arrays', () => {
    const product = candidate('a', { shape: ['round'] }); const answers = { shape: ['round'] };
    const before = JSON.stringify({ product, answers }); const [result] = rankProducts([product], answers);
    expect(JSON.stringify({ product, answers })).toBe(before);
    expect(result).not.toBe(product); expect(product).not.toHaveProperty('score');
  });
  it('returns honest zero, one and two match groups', () => {
    const products = [candidate('a', { shape: ['round'] }), candidate('b', { color: ['blue'] })];
    expect(rankProducts([], { shape: ['round'] })).toEqual([]);
    expect(rankProducts(products, { shape: ['square'] })).toEqual([]);
    expect(ids(rankProducts(products, { shape: ['round'] }))).toEqual(['a']);
    expect(ids(rankProducts(products, { shape: ['round'], color: ['blue'] }))).toEqual(['a', 'b']);
  });
});


describe('quiz category boundary', () => {
  const products = [
    candidate('optical', { shape: ['round'] }, { category: 'optical' }),
    candidate('sun', { shape: ['round'], color: ['brown'] }, { category: 'sun' }),
    candidate('unknown', { shape: ['round'], color: ['brown'] }),
  ];
  it('excludes other and unknown categories even when their style score is stronger', () => {
    expect(ids(rankProducts(products, { category: ['optical'], shape: ['round'], color: ['brown'] }))).toEqual(['optical']);
    expect(ids(rankProducts(products, { category: ['sun'], shape: ['round'] }))).toEqual(['sun']);
  });
  it('allows a category-only editorial selection without adding a style score', () => {
    const result = rankProducts(products, { category: ['sun'] });
    expect(ids(result)).toEqual(['sun']);
    expect(result[0]).toMatchObject({ score: 0, matched: [], editorial: true });
  });
  it('keeps the mixed editorial selection when category is skipped', () => {
    expect(ids(rankProducts(products, { category: [] }))).toEqual(['optical', 'sun', 'unknown']);
  });
});


describe('compact color choices preserve independent catalog criteria', () => {
  it('normalizes legacy brown/light colors into the neutral family in candidates and answers', () => {
    const products = [
      candidate('brown', { color: ['brown'] }), candidate('light', { color: ['light'] }),
      candidate('neutral', { color: ['neutral'] }), candidate('bold', { color: ['bold'] }),
    ];
    expect(ids(rankProducts(products, { color: ['neutral'] }))).toEqual(['brown', 'light', 'neutral']);
    expect(ids(rankProducts(products, { color: ['brown', 'light'] }))).toEqual(['brown', 'light', 'neutral']);
    expect(rankProducts(products, { color: ['neutral', 'brown', 'light'] }).every(row => row.score === 1)).toBe(true);
  });
  it('counts duplicated Carey/transparency selections once per actual criterion', () => {
    const [result] = rankProducts([candidate('both', { pattern: ['tortoise'], transparency: ['transparent'] })], {
      pattern: ['tortoise', 'tortoise'], transparency: ['transparent', 'transparent'],
    });
    expect(result).toMatchObject({ score: 2, matched: ['pattern', 'transparency'] });
  });
  it('requires declared silver color and does not infer it from a metallic material', () => {
    expect(ids(rankProducts([
      candidate('metal', { material: ['metal'] }), candidate('titanium', { material: ['titanium'] }),
      candidate('silver', { color: ['silver'], material: ['acetate'] }),
    ], { color: ['silver'] }))).toEqual(['silver']);
  });
  it('does not reinterpret tortoise or transparency as a color attribute', () => {
    const products = [candidate('color-only', { color: ['tortoise', 'transparent'] }), candidate('actual', { pattern: ['tortoise'], transparency: ['transparent'] })];
    expect(ids(rankProducts(products, { pattern: ['tortoise'], transparency: ['transparent'] }))).toEqual(['actual']);
  });
});
