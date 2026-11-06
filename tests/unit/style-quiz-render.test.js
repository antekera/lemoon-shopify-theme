import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { renderQuizSection, quizProduct } from '../helpers/style-quiz-renderer.mjs';

const decode = value => value.replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code))).replaceAll('&quot;', '"').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');
const candidates = html => [...html.matchAll(/data-candidate=(?:"([^"]*)"|'([^']*)')/g)].map(match => JSON.parse(decode(match[1] ?? match[2])));

it('wires the natural style-quiz page template to the quiz with an all-category candidate source', () => {
  const raw = readFileSync(new URL('../../templates/page.buscar-mi-estilo.json', import.meta.url), 'utf8');
  const template = JSON.parse(raw.slice(raw.indexOf('{')));
  expect(template.order).toEqual(['main']);
  expect(template.sections.main.type).toBe('lemoon-style-quiz');
  expect(template.sections.main.settings.catalogue).toBe('all');

  const rows = candidates(renderQuizSection({ products: [
    quizProduct(501, { category: 'Óptico' }), quizProduct(502, { category: 'Solar' }),
    quizProduct(503, { category: 'Solar', ready: false }),
  ] }));
  expect([...new Set(rows.map(row => row.category))]).toEqual(['optical', 'sun']);
  expect([...new Set(rows.map(row => row.id))]).toEqual(['501', '502']);
});

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

  it('keeps SVG definitions unique across two section instances and resolves each local reference', () => {
    const html = ['quiz-first', 'quiz-second'].map(sectionId => renderQuizSection({ sectionId, products: [] })).join('');
    const svgs = [...html.matchAll(/<svg\b[^>]*>[\s\S]*?<\/svg>/g)].map(match => match[0]);
    const allIds = [];
    let referenceCount = 0;
    for (const svg of svgs) {
      const ids = [...svg.matchAll(/\sid\s*=\s*(["'])(.*?)\1/g)].map(match => match[2]);
      allIds.push(...ids);
      const references = [
        ...[...svg.matchAll(/url\(\s*["']?#([^"')\s]+)["']?\s*\)/g)].map(match => match[1]),
        ...[...svg.matchAll(/(?:\s|:)href\s*=\s*["']#([^"']+)["']/g)].map(match => match[1]),
      ];
      referenceCount += references.length;
      for (const reference of references) expect(ids.filter(id => id === reference)).toHaveLength(1);
    }
    expect(referenceCount).toBeGreaterThan(0);
    expect(new Set(allIds).size).toBe(allIds.length);
    for (const sectionId of ['quiz-first', 'quiz-second']) expect(allIds.some(id => id.includes(sectionId))).toBe(true);
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


it('serializes declared product categories and leaves unknown types unclassified', () => {
  const types = ['Óptico', 'Ópticos', 'Optical', 'Solar', 'Solares', 'Lentes de sol', 'Sunglasses', 'Accesorios', ''];
  const rows = candidates(renderQuizSection({ products: types.map((category, index) => quizProduct(301 + index, { category })) }));
  expect(rows.filter((_, index) => index % 2 === 0).map(row => row.category)).toEqual([
    'optical', 'optical', 'optical', 'sun', 'sun', 'sun', 'sun', '', '',
  ]);
});


it('renders one six-segment accessible progressbar and bottom back navigation without skip', () => {
  const html = renderQuizSection({ products: [] });
  expect(html.match(/data-quiz-segment=/g)).toHaveLength(6);
  expect(html).toContain('role="progressbar"');
  expect(html).toContain('aria-valuemin="0"');
  expect(html).toContain('aria-valuemax="6"');
  expect(html).toContain('aria-valuenow="0"');
  expect(html).not.toContain('data-quiz-skip');
  expect(html.match(/data-quiz-back/g)).toHaveLength(1);
  expect(html).toMatch(/lemoon-quiz__actions[\s\S]*data-quiz-back/);
});

it('renders seven color choices with Carey and transparent routed to their actual criteria and unique IDs', () => {
  const html = renderQuizSection({ products: [] });
  const colorStage = html.match(/<fieldset\b[^>]*data-step="color"[\s\S]*?<\/fieldset>/)?.[0];
  const inputs = [...colorStage.matchAll(/<input\b[^>]*>/g)].map(([markup]) => Object.fromEntries([...markup.matchAll(/(\w+)="([^"]*)"/g)].map(match => [match[1], match[2]])));
  expect(inputs.map(input => [input.name, input.value])).toEqual([
    ['color', 'bold'], ['color', 'neutral'], ['color', 'black'], ['pattern', 'tortoise'],
    ['color', 'two_tone'], ['transparency', 'transparent'], ['color', 'silver'],
  ]);
  expect(inputs.every(input => input.type === 'checkbox')).toBe(true);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  expect(new Set(ids).size).toBe(ids.length);
});


it('keeps Details limited to finishes and materials with pattern/transparency only in Color', () => {
  const html = renderQuizSection({ products: [] });
  const details = html.match(/<fieldset\b[^>]*data-step="details"[\s\S]*?<\/fieldset>/)?.[0];
  const tabs = [...details.matchAll(/data-quiz-tab="([^"]+)"/g)].map(match => match[1]);
  expect(tabs).toEqual(['finishes', 'materials']);
  expect(details).not.toMatch(/name="(?:pattern|transparency)"/);
  expect([...details.matchAll(/<input\b[^>]*name="([^"]+)"/g)].map(match => match[1])).toEqual([
    'finish', 'finish', 'material', 'material', 'material', 'material', 'material', 'material',
  ]);
  expect(html.match(/name="pattern"/g)).toHaveLength(1);
  expect(html.match(/name="transparency"/g)).toHaveLength(1);
});
