import { describe, expect, test } from 'vitest';

const logic = () => import('../../assets/lemoon-mobile-search-logic.js');

describe('mobile search rules', () => {
  // Catches requesting predictions before the trimmed three-character boundary.
  test.each([['', false], ['a', false], ['ab', false], [' ab ', false], ['abc', true], [' áéí ', true]])('predictive threshold for %j', async (term, expected) => {
    const { shouldPredict } = await logic();
    expect(shouldPredict(term)).toBe(expected);
  });

  // Catches duplicate suggestions, mutation of catalog data, or exceeding three cards.
  test('selects three unique shuffled products without changing the catalog', async () => {
    const { selectSuggestions } = await logic();
    const products = Array.from({ length: 7 }, (_, i) => ({ id: i + 1 }));
    const result = selectSuggestions([...products, products[0]], () => 0);
    expect(result.map(({ id }) => id)).toEqual([2, 3, 4]);
    expect(products.map(({ id }) => id)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });
  test('handles an empty or small suggestion catalog', async () => {
    const { selectSuggestions } = await logic();
    expect(selectSuggestions([])).toEqual([]);
    expect(selectSuggestions([{ id: 1 }, { id: 1 }])).toEqual([{ id: 1 }]);
  });

  // Catches a hardcoded locale, broken encoding, or an invented query on empty submit.
  test.each([
    ['/search', '', '/search'],
    ['/es/search', '  ', '/es/search'],
    ['/es/search', ' lentes & sol ', '/es/search?q=lentes+%26+sol&type=product'],
    ['/search', 'á +/?', '/search?q=%C3%A1+%2B%2F%3F&type=product'],
  ])('builds a destination for %j and %j', async (route, term, expected) => {
    const { buildSearchUrl } = await logic();
    expect(buildSearchUrl(route, term)).toBe(expected);
  });
  test('requests JSON and at most five product resources on the localized route', async () => {
    const { buildPredictiveUrl } = await logic();
    expect(buildPredictiveUrl('/es/search/suggest', 'sol & mar')).toBe('/es/search/suggest.json?q=sol+%26+mar&resources%5Btype%5D=product&resources%5Blimit%5D=5');
  });

  // Catches accepting an earlier response after a newer query or after closure.
  test('only the newest request can publish', async () => {
    const { createRequestGate } = await logic();
    const gate = createRequestGate();
    const first = gate.next();
    const second = gate.next();
    expect(gate.isCurrent(first)).toBe(false);
    expect(gate.isCurrent(second)).toBe(true);
    gate.invalidate();
    expect(gate.isCurrent(second)).toBe(false);
  });
});
