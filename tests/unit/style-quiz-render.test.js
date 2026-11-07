import { it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { renderQuizSection, quizProduct, quizDictionary, quizAvailableFilters } from '../helpers/style-quiz-renderer.mjs';

const configuration = html => JSON.parse(html.match(/<script type="application\/json" data-quiz-filter-config>([\s\S]*?)<\/script>/)[1]);
it('retains the internal page template to the quiz', () => {
  const raw = readFileSync(new URL('../../templates/page.buscar-mi-estilo.json', import.meta.url), 'utf8');
  const template = JSON.parse(raw.slice(raw.indexOf('{')));
  expect(template.order).toEqual(['main']);
  expect(template.sections.main.type).toBe('lemoon-style-quiz');
});
it('renders dictionary and real product types without enumerating products or variants', () => {
  const products = Array.from({ length: 51 }, (_, index) => quizProduct(index + 1));
  const html = renderQuizSection({ products, types: ['Óptico', 'Optical', 'Solar', 'Sunglasses', 'Muestra solar', 'Accesorios', 'Muestra de navegación'] });
  expect(configuration(html)).toEqual({ collectionUrl: '/collections/all', categories: { optical: ['Óptico', 'Optical'], sun: ['Solar', 'Sunglasses', 'Muestra solar'] }, traits: quizDictionary(), dictionaryComplete: true, availableFilters: quizAvailableFilters() });
  expect(html).not.toMatch(/data-(?:candidate|quiz-product|quiz-results|quiz-more|quiz-card-template)/);
  expect(html).not.toContain('Lente de prueba');
  expect(configuration(renderQuizSection({ products: [] }))).toEqual(configuration(renderQuizSection({ products })));
});
it('retains filter exposure and incomplete dictionary evidence for fail-closed navigation', () => {
  expect(configuration(renderQuizSection({ availableFilters: [] })).availableFilters).toEqual([]);
  expect(configuration(renderQuizSection({ dictionaryPages: 2 })).dictionaryComplete).toBe(false);
});
it('serializes dictionary text safely inside an inert script', () => {
  const traits = [{ id: 'gid://shopify/Metaobject/123', group: 'color', code: '</script><img src=x onerror=alert(1)>' }];
  const html = renderQuizSection({ traits });
  expect(html).not.toContain('</script><img');
  expect(configuration(html).traits).toEqual(traits);
});
it('keeps SVG definitions unique across two instances and resolves local references', () => {
  const html = ['first', 'second'].map(sectionId => renderQuizSection({ sectionId })).join('');
  const allIds = []; let referenceCount = 0;
  for (const [svg] of html.matchAll(/<svg\b[^>]*>[\s\S]*?<\/svg>/g)) {
    const ids = [...svg.matchAll(/\sid\s*=\s*(["'])(.*?)\1/g)].map(match => match[2]); allIds.push(...ids);
    const references = [...svg.matchAll(/url\(\s*["']?#([^"')\s]+)["']?\s*\)/g)].map(match => match[1]);
    referenceCount += references.length;
    for (const reference of references) expect(ids.filter(id => id === reference)).toHaveLength(1);
  }
  expect(referenceCount).toBeGreaterThan(0); expect(new Set(allIds).size).toBe(allIds.length);
});
it('renders six accessible stages and a bottom back action without a skip or budget stage', () => {
  const html = renderQuizSection();
  expect([...html.matchAll(/data-step="([^"]+)"/g)].map(row => row[1])).toEqual(['category', 'shape', 'color', 'details', 'use', 'presence']);
  expect(html.match(/data-quiz-segment=/g)).toHaveLength(6);
  expect(html).toContain('role="progressbar"'); expect(html).toContain('aria-valuemax="6"');
  expect(html).not.toContain('data-quiz-skip'); expect(html).toMatch(/lemoon-quiz__actions[\s\S]*data-quiz-back/);
});
it('retains the seven color choices and independent Carey/transparency criteria', () => {
  const html = renderQuizSection();
  const color = html.match(/<fieldset\b[^>]*data-step="color"[\s\S]*?<\/fieldset>/)[0];
  const inputs = [...color.matchAll(/<input\b[^>]*>/g)].map(([markup]) => Object.fromEntries([...markup.matchAll(/(\w+)="([^"]*)"/g)].map(match => [match[1], match[2]])));
  expect(inputs.map(input => [input.name, input.value])).toEqual([['color', 'bold'], ['color', 'neutral'], ['color', 'black'], ['pattern', 'tortoise'], ['color', 'two_tone'], ['transparency', 'transparent'], ['color', 'silver']]);
  expect(inputs.every(input => input.type === 'checkbox')).toBe(true);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]); expect(new Set(ids).size).toBe(ids.length);
});
it('places finishes before materials in two visible detail groups with no tabs', () => {
  const details = renderQuizSection().match(/<fieldset\b[^>]*data-step="details"[\s\S]*?<\/fieldset>/)[0];
  expect(details).not.toMatch(/data-quiz-tab|data-quiz-panel|name="(?:pattern|transparency)"/);
  expect([...details.matchAll(/<h3>([^<]+)<\/h3>/g)].map(match => match[1])).toEqual(['Acabados', 'Materiales']);
  expect([...details.matchAll(/<input\b[^>]*name="([^"]+)"/g)].map(match => match[1])).toEqual(['finish', 'finish', 'material', 'material', 'material', 'material', 'material', 'material']);
});
