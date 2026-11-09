import { readFileSync, readdirSync } from 'node:fs';
import { expect, test } from 'vitest';

const locales = new URL('../../locales/', import.meta.url);
for (const file of readdirSync(locales).filter(name => name.endsWith('.json'))) {
  test(`locale upload keys do not contain whitespace: ${file}`, () => {
    const source = readFileSync(new URL(file, locales), 'utf8');
    const content = JSON.parse(source.slice(source.indexOf('{')));
    const invalid = [];
    function visit(value, path = []) {
      if (!value || typeof value !== 'object') return;
      for (const [key, child] of Object.entries(value)) {
        if (/\s/u.test(key)) invalid.push([...path, key].join('.'));
        visit(child, [...path, key]);
      }
    }
    visit(content);
    expect(invalid).toEqual([]);
  });
}
