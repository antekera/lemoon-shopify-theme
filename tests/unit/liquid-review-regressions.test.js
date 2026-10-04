import { readFile } from 'node:fs/promises';
import { expect, test } from 'vitest';

const themeFile = (path) => new URL(`../../${path}`, import.meta.url);

test('keeps product card styles enabled until the first product result', async () => {
  const source = await readFile(themeFile('snippets/main-search-results.liquid'), 'utf8');
  const resultLoop = source.match(/\{%- for item in search_results -%\}([\s\S]*?)\{%- endfor -%\}/)?.[1];

  expect(resultLoop).toMatch(/\{%- if item\.object_type == 'product' -%\}[\s\S]*?assign skip_card_product_styles = true[\s\S]*?\{%- endif -%\}/);
});

test('renders account links only when customer accounts are enabled', async () => {
  const source = await readFile(themeFile('sections/header.liquid'), 'utf8');
  const accountBlocks = [...source.matchAll(/\{%- if show_account -%\}([\s\S]*?)\{%- endif -%\}/g)];

  expect(source).toMatch(/assign show_account = shop\.customer_accounts_enabled/);
  expect(accountBlocks).toHaveLength(2);
  expect(accountBlocks.every(([, block]) => block.includes('routes.account_url'))).toBe(true);
});
