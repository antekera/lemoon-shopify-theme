import { readFileSync } from 'node:fs';
import { createComponentEngine } from './component-library-renderer.mjs';

// Render the real buy-buttons markup, adapting only Shopify's product form tag.
const source = readFileSync('snippets/buy-buttons.liquid', 'utf8');
const start = source.indexOf('<product-form');
const end = source.indexOf('</product-form>', start) + '</product-form>'.length;
if (start < 0 || end < '</product-form>'.length) throw new Error('Product form markup not found');
const liquid = source.slice(start, end)
  .replace(/{%-?\s*form\s+'product',[\s\S]*?-?%}/, '<form action="/cart/add" method="post" class="form">')
  .replace(/{%-?\s*endform\s*-?%}/, '</form>');
const engine = createComponentEngine();
engine.registerFilter('payment_button', () => '');
const html = engine.parseAndRenderSync(liquid, {
  product: { selected_or_first_available_variant: { id: 123, available: true, inventory_management: 'shopify', inventory_policy: 'deny', inventory_quantity: 10, quantity_rule: { min: 1 } }, metafields: { custom: {} } },
  section: { id: 'fixture' }, section_id: 'fixture', block: { settings: {} },
});
process.stdout.write(html);
