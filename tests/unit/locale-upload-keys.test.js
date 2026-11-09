import { readFileSync, readdirSync } from 'node:fs';
import { expect, test } from 'vitest';

const locales = new URL('../../locales/', import.meta.url);
for (const file of readdirSync(locales).filter(name => name.endsWith('.json'))) {
  test(`locale upload identifiers, lengths and counts meet constraints: ${file}`, () => {
    const source = readFileSync(new URL(file, locales), 'utf8');
    const content = JSON.parse(source.slice(source.indexOf('{')));
    const invalid = [];
    const translations = [];
    function visit(value, path = []) {
      if (!value || typeof value !== 'object') return;
      for (const [key, child] of Object.entries(value)) {
        const name = [...path, key].join('.');
        if (!/^[A-Za-z0-9_-]+$/.test(key)) invalid.push({ path: name, reason: 'non-ASCII identifier' });
        if (typeof child === 'string') {
          translations.push(name);
          if (Array.from(child).length > 1000) invalid.push({ path: name, reason: 'more than 1000 characters' });
        }
        visit(child, [...path, key]);
      }
    }
    visit(content);
    expect(invalid).toEqual([]);
    expect(translations.length).toBeLessThanOrEqual(3400);
  });
}
