import { describe, it, expect } from 'vitest';
import { createComponentEngine } from '../helpers/component-library-renderer.mjs';
const render = (name, params = {}) => createComponentEngine().renderFileSync(name, params);
const ids = html => [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);

describe('shared educational measurement graphics', () => {
  it('renders named original front/side diagrams without product numbers or controls', () => {
    const html = render('lemoon-frame-measurement-diagram', { instance_id: 'drawing', label: 'Frente y patilla del armazón' });
    expect(html).toContain('Frente y patilla del armazón');
    expect(html).toContain('role="img"');
    for (const reference of ['A', 'B', 'C', 'D', 'E']) expect(html).toMatch(new RegExp(`>\\s*${reference}\\s*<`));
    expect(html).not.toMatch(/data-mm|data-units|<script|<form|https?:\/\/|(?:52|145)\s*(?:mm|□)/);
  });
  it('labels its code as an educational example with three independently highlighted segments', () => {
    const html = render('lemoon-size-guide-comparison', { instance_id: 'comparison', heading_level: 3 });
    expect(html).toContain('Ejemplo educativo. No representa las medidas de un producto específico.');
    expect(html).toMatch(/<h3\b/);
    expect(html).toContain('52'); expect(html).toContain('18'); expect(html).toContain('145');
    expect(html).toMatch(/<strong[^>]*>\s*52\s*<\/strong>/);
    expect(html).toMatch(/<strong[^>]*>\s*18\s*<\/strong>/);
    expect(html).toMatch(/<strong[^>]*>\s*145\s*<\/strong>/);
    expect(html).not.toMatch(/data-mm|data-units|<form|<script|https?:\/\//);
  });
  it('can omit its heading under a page step without losing the example note', () => {
    const html = render('lemoon-size-guide-comparison', { instance_id: 'page-comparison', show_heading: false });
    expect(html).not.toMatch(/<h[1-6]\b/);
    expect(html).toContain('Ejemplo educativo.');
  });
  it('can omit a repeated host introduction while retaining the educational example and three definitions', () => {
    const params = { instance_id: 'host-introduction' };
    const intro = render('lemoon-size-guide-comparison', params).match(/<p class="lemoon-size-comparison__intro">([\s\S]*?)<\/p>/)?.[1];
    expect(intro).toBeTruthy();
    const html = render('lemoon-size-guide-comparison', { ...params, show_intro: false });
    expect(html).not.toContain(intro);
    expect(html).toContain('Ejemplo educativo. No representa las medidas de un producto específico.');
    for (const value of [52, 18, 145]) expect(html).toMatch(new RegExp(`<strong[^>]*>\\s*${value}\\s*<\\/strong>`));
    expect(html.match(/class="lemoon-size-comparison__definition"/g)).toHaveLength(3);
  });
  it('annotates the page illustration with a caption below while preserving the default artwork and note placement', () => {
    const params = { instance_id: 'annotated-comparison' };
    const normal = render('lemoon-size-guide-comparison', params);
    expect(render('lemoon-size-guide-comparison', { ...params, annotated_temple: false })).toBe(normal);
    expect(normal).not.toMatch(/__inscription|<figcaption/);
    expect(normal.indexOf('class="lemoon-size-comparison__note"')).toBeLessThan(normal.indexOf('<svg'));
    const annotated = render('lemoon-size-guide-comparison', { ...params, annotated_temple: true });
    expect(annotated).toContain('class="lemoon-size-comparison__inscription"');
    expect(annotated).toMatch(/<figcaption[^>]*>Ejemplo educativo\. No representa las medidas de un producto específico\.<\/figcaption>/);
    expect(annotated.indexOf('<figcaption')).toBeGreaterThan(annotated.indexOf('</svg>'));
    const illustrationPaths = html => {
      const svg = html.match(/<svg class="lemoon-size-comparison__temple"[\s\S]*?<\/svg>/)[0];
      return [...svg.replace(/<g class="lemoon-size-comparison__inscription"[\s\S]*?<\/g>/, '').matchAll(/<path\b[^>]*\bd="([^"]+)"/g)].map(match => match[1]);
    };
    expect(illustrationPaths(annotated)).toEqual(illustrationPaths(normal));
  });
  it('keeps all SVG and description associations unique across multiple instances', () => {
    const html = ['first', 'second'].map(instance_id => render('lemoon-frame-measurement-diagram', { instance_id, label: 'Esquema de medidas' }) + render('lemoon-size-guide-comparison', { instance_id: `${instance_id}-comparison` })).join('');
    const values = ids(html);
    expect(new Set(values).size).toBe(values.length);
    for (const [, references] of html.matchAll(/aria-(?:labelledby|describedby)="([^"]+)"/g)) {
      for (const reference of references.split(' ')) expect(values).toContain(reference);
    }
  });
});
