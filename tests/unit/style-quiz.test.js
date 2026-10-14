import { describe, it, expect } from 'vitest';
import { rankProducts, catalogueUrl } from '../../assets/lemoon-style-quiz.js';
const picks = { face: 'round', style: 'minimal', use: 'work', budget: '100000' };
const product = (id, extra = {}) => ({ id, price: 50000, available: true, face: 'round', style: 'minimal', use: 'work', ...extra });
describe('editorial recommendations', () => {
  it('ranks explicit preferences then keeps merchant order for ties', () => {
    expect(rankProducts([product('a',{style:'retro'}),product('b'),product('c'),product('d')],picks).map(p=>p.id)).toEqual(['b','c','d']);
  });
  it('excludes unavailable and over-budget products without relaxing the cap', () => {
    expect(rankProducts([product('a',{available:false}),product('b',{price:100001}),product('c',{price:100000})],picks).map(p=>p.id)).toEqual(['c']);
  });
  it('deduplicates products and treats zero as a real budget', () => {
    expect(rankProducts([product('a'),product('a'),product('free',{price:0})],{...picks,budget:'0'}).map(p=>p.id)).toEqual(['free']);
  });
  it('returns empty when no preferences match and never invents a product', () => {
    expect(rankProducts([product('a',{face:'oval',style:'retro',use:'outdoors'})],picks)).toEqual([]);
    expect(rankProducts([],picks)).toEqual([]);
  });
  it('allows an uncertain face and an unlimited budget while preserving other preferences', () => {
    expect(rankProducts([product('a',{price:200000,face:'heart'})],{...picks,face:'unsure',budget:'none'}).map(p=>p.id)).toEqual(['a']);
  });
  it('rejects malformed price data and malformed budgets', () => {
    expect(rankProducts([product('a',{price:NaN}),product('b',{price:-1})],picks)).toEqual([]);
    expect(rankProducts([product('a')],{...picks,budget:'oops'})).toEqual([]);
    expect(rankProducts([product('a')],{...picks,budget:'Infinity'})).toEqual([]);
  });
});
describe('real collection budget links', () => {
  it('uses the supported native parameter and Shopify cents conversion', () => {
    expect(catalogueUrl('/es/collections/opticos','filter.v.price.lte','100000')).toBe('/es/collections/opticos?filter.v.price.lte=1000');
    expect(catalogueUrl('/collections/opticos','filter.v.price.lte','0')).toBe('/collections/opticos?filter.v.price.lte=0');
  });
  it('does not invent filters for unsupported or unlimited collections', () => {
    expect(catalogueUrl('/collections/opticos','','100000')).toBe('/collections/opticos');
    expect(catalogueUrl('/collections/opticos','filter.v.price.lte','none')).toBe('/collections/opticos');
  });
});
