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
  it('keeps all SVG and description associations unique across multiple instances', () => {
    const html = ['first', 'second'].map(instance_id => render('lemoon-frame-measurement-diagram', { instance_id, label: 'Esquema de medidas' }) + render('lemoon-size-guide-comparison', { instance_id: `${instance_id}-comparison` })).join('');
    const values = ids(html);
    expect(new Set(values).size).toBe(values.length);
    for (const [, references] of html.matchAll(/aria-(?:labelledby|describedby)="([^"]+)"/g)) {
      for (const reference of references.split(' ')) expect(values).toContain(reference);
    }
  });
});
