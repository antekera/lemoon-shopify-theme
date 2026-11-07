import { describe, it, expect } from 'vitest';
import { buildQuizCollectionURL } from '../../assets/lemoon-style-quiz-filters.js';
import { quizDictionary, quizAvailableFilters } from '../helpers/style-quiz-renderer.mjs';

const config = () => ({ collectionUrl: '/collections/all', dictionaryComplete: true, availableFilters: quizAvailableFilters(), categories: { optical: ['Óptico', 'Ópticos', 'Optical'], sun: ['Solar', 'Solares', 'Lentes de sol', 'Sunglasses'] }, traits: quizDictionary() });
const params = (answers, settings = config()) => new URL(buildQuizCollectionURL(answers, settings), 'https://example.test').searchParams;
const references = (group, codes) => quizDictionary().filter(row => row.group === group && codes.includes(row.code)).map(row => row.id);

describe('native collection filter URL contract', () => {
  it('leaves skipped answers unrestricted and preserves localized collection routes', () => {
    expect(buildQuizCollectionURL({}, config())).toBe('/collections/all');
    expect(buildQuizCollectionURL({ shape: [], color: [] }, { ...config(), collectionUrl: '/es-cl/collections/all' })).toBe('/es-cl/collections/all');
  });
  it('repeats native fields for OR values per criterion and keeps independent AND criteria', () => {
    const query = params({ category: ['optical', 'sun'], shape: ['round', 'cat-eye', 'panto', 'geometric'], material: ['tr90', 'metal'], color: ['black', 'silver'], finish: ['matte', 'glossy'], pattern: ['tortoise'], transparency: ['transparent'], use: ['everyday', 'outdoors'], presence: ['medium'] });
    expect([...new Set(query.keys())]).toEqual(['filter.p.product_type', 'filter.p.m.custom.frame_shape', 'filter.p.m.custom.frame_material', ...['color', 'finish', 'pattern', 'transparency', 'use', 'presence'].map(axis => `filter.v.m.custom.style_filter_${axis}`)]);
    expect(query.getAll('filter.p.product_type')).toEqual(['Óptico', 'Ópticos', 'Optical', 'Solar', 'Solares', 'Lentes de sol', 'Sunglasses']);
    expect(query.getAll('filter.p.m.custom.frame_shape')).toEqual(['redondo', 'ojo de gato', 'pantóstico', 'geométrico']);
    expect(query.getAll('filter.p.m.custom.frame_material')).toEqual(['TR-90', 'metal']);
    for (const [group, codes] of Object.entries({ color: ['black', 'silver'], finish: ['matte', 'glossy'], pattern: ['tortoise'], transparency: ['transparent'], use: ['everyday', 'outdoors'], presence: ['medium'] })) {
      expect(query.getAll(`filter.v.m.custom.style_filter_${group}`)).toEqual(references(group, codes));
    }
    expect([...query.keys()].some(key => /frame_size|style_traits|option.color/.test(key))).toBe(false);
  });
  it.each([['round', 'redondo'], ['rectangular', 'rectangular'], ['cat-eye', 'ojo de gato'], ['aviator', 'aviador'], ['geometric', 'geométrico'], ['square', 'cuadrado'], ['oval', 'ovalado'], ['panto', 'pantóstico']])('maps shape %s to its actual controlled value %s', (code, value) => {
    expect(params({ shape: [code] }).get('filter.p.m.custom.frame_shape')).toBe(value);
  });
  it.each([['acetate', 'acetato'], ['metal', 'metal'], ['titanium', 'titanio'], ['tr90', 'TR-90'], ['wood', 'madera'], ['mixed', 'mixto']])('maps material %s to %s', (code, value) => {
    expect(params({ material: [code] }).get('filter.p.m.custom.frame_material')).toBe(value);
  });
  it('includes legacy brown/light plus neutral only in the neutral color family', () => {
    expect(params({ color: ['neutral'] }).getAll('filter.v.m.custom.style_filter_color')).toEqual(references('color', ['neutral', 'brown', 'light']));
    expect([...params({ pattern: ['tortoise'], transparency: ['transparent'] }).keys()]).toEqual(['filter.v.m.custom.style_filter_pattern', 'filter.v.m.custom.style_filter_transparency']);
  });
  it.each(['neutral', 'brown', 'light'])('retains the complete search when neutral family member %s is missing', missingCode => {
    const settings = config();
    settings.traits = settings.traits.filter(row => row.group !== 'color' || row.code !== missingCode);
    expect(() => buildQuizCollectionURL({ shape: ['round'], color: ['neutral'], finish: ['matte'] }, settings)).toThrow();
  });
  it('uses the current environment dictionary IDs, deduplicates and does not mutate input', () => {
    const answers = { shape: ['round', 'round'], finish: ['matte', 'matte'] };
    const settings = config(); settings.traits.find(row => row.group === 'finish' && row.code === 'matte').id = 'gid://shopify/Metaobject/987654321';
    const before = JSON.stringify({ answers, settings });
    expect(params(answers, settings).get('filter.v.m.custom.style_filter_finish')).toBe('gid://shopify/Metaobject/987654321');
    expect(params(answers, settings).get('filter.p.m.custom.frame_shape')).toBe('redondo');
    expect(JSON.stringify({ answers, settings })).toBe(before);
  });
  it.each(['https://foreign.test/collections/all', '//foreign.test/collections/all', '/products/a', '/collections/all?filter=x', '/collections/all#x', '/collections/../all', '/collections/all\\evil'])('rejects unsafe or prefiltered destination %s', collectionUrl => {
    expect(() => buildQuizCollectionURL({ shape: ['round'] }, { ...config(), collectionUrl })).toThrow();
  });
  it.each([null, [], 'round', { color: 'black' }, { color: [null] }, { shape: ['unknown'] }, { category: ['unknown'] }, { presence: ['wide'] }, { budget: ['10000'] }])('rejects malformed or unsupported answers %j', answers => {
    expect(() => buildQuizCollectionURL(answers, config())).toThrow();
  });
  it('fails the entire selected criterion for missing, cross-group, invalid and duplicate references', () => {
    for (const mutate of [
      settings => { settings.traits = settings.traits.filter(row => row.code !== 'matte'); },
      settings => { settings.traits.find(row => row.code === 'matte').group = 'color'; },
      settings => { settings.traits.find(row => row.code === 'matte').id = '123'; },
      settings => { settings.traits.push({ ...settings.traits.find(row => row.code === 'matte') }); },
      settings => { settings.traits.find(row => row.code === 'glossy').id = settings.traits.find(row => row.code === 'matte').id; },
      settings => { settings.dictionaryComplete = false; },
      settings => { settings.availableFilters = settings.availableFilters.filter(name => !name.endsWith('style_filter_finish')); },
    ]) {
      const settings = config(); mutate(settings);
      expect(() => buildQuizCollectionURL({ shape: ['round'], finish: ['matte', 'glossy'] }, settings)).toThrow();
    }
  });
  it.each([[], [''], ['Óptico,Optical'], [null]])('rejects an unresolvable category mapping %j', types => {
    expect(() => buildQuizCollectionURL({ category: ['optical'] }, { ...config(), categories: { optical: types } })).toThrow();
  });
});

const nativeIDs = { bold: 'gid://shopify/Metaobject/660341522600', brown: 'gid://shopify/Metaobject/660341457064', light: 'gid://shopify/Metaobject/660341489832', neutral: 'gid://shopify/Metaobject/660676051112', matte: 'gid://shopify/Metaobject/660341555368', glossy: 'gid://shopify/Metaobject/660341588136' };
const nativeConfig = () => ({ ...config(), traits: Object.entries(nativeIDs).map(([code, id]) => ({ id, code, group: ['matte', 'glossy'].includes(code) ? 'finish' : 'color' })) });
describe('observed Shopify native form multi-reference regressions', () => {
  // Published theme 155307737256 returned zero/no active chips for percent-encoded
  // comma-joined GIDs; native repeated parameters returned five/two active chips.
  it('encodes each real color reference independently as the native form does', () => {
    const result = params({ color: ['bold', 'neutral'] }, nativeConfig());
    expect(result.getAll('filter.v.m.custom.style_filter_color')).toEqual([nativeIDs.bold, nativeIDs.brown, nativeIDs.light, nativeIDs.neutral]);
    expect(result.toString()).not.toContain('%2C');
  });
  it('preserves all three real neutral-family references as separate OR values', () => {
    expect(params({ color: ['neutral'] }, nativeConfig()).getAll('filter.v.m.custom.style_filter_color')).toEqual([nativeIDs.brown, nativeIDs.light, nativeIDs.neutral]);
  });
  it('keeps real color OR values independent from finish OR values for native AND composition', () => {
    const result = params({ color: ['bold', 'neutral'], finish: ['matte', 'glossy'] }, nativeConfig());
    expect([...result]).toEqual([
      ...[nativeIDs.bold, nativeIDs.brown, nativeIDs.light, nativeIDs.neutral].map(id => ['filter.v.m.custom.style_filter_color', id]),
      ...[nativeIDs.matte, nativeIDs.glossy].map(id => ['filter.v.m.custom.style_filter_finish', id]),
    ]);
  });
});
