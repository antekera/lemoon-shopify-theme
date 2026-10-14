import { readFile } from 'node:fs/promises';
import { expect, test } from 'vitest';

const source = await readFile(new URL('../../sections/cart-upsell-row.liquid', import.meta.url), 'utf8');
const schema = JSON.parse(source.match(/\{% schema %\}([\s\S]*?)\{% endschema %\}/)[1]);

test('upsell markup requires a populated cart and at least one real configured product', () => {
  expect(source).toMatch(/if block\.settings\.product != blank[\s\S]*?assign has_upsell_products = true/);
  expect(source).toMatch(/if cart\.item_count > 0 and has_upsell_products[\s\S]*?<div class="lemoon-cart-upsell"/);
  expect(source).toMatch(/if product != blank[\s\S]*?<article/);
  expect(source).not.toContain('placeholder_title');
  expect(source).not.toContain('placeholder_price');
  expect(schema.blocks[0].settings.map(({ id }) => id)).toEqual(['product']);
});

test('quick add requires one available variant; multi-variant and sold out products lead to product page', () => {
  expect(source).toMatch(/if product\.variants\.size == 1 and upsell_variant\.available[\s\S]*?form 'product', product/);
  expect(source).toMatch(/name="id" value="{{ upsell_variant\.id }}"/);
  expect(source).toMatch(/endform[\s\S]*?else[\s\S]*?href="{{ product\.url }}"[\s\S]*?sections\.cart_upsell\.view_product/);
  expect(source).toContain('{{ block.shopify_attributes }}');
});

test('products use real escaped titles, responsive lazy images, and a truthful variable-price label', () => {
  expect(source).toContain('{{ product.title | escape }}');
  expect(source).toContain("image_tag: loading: 'lazy'");
  expect(source).toMatch(/if product\.price_varies[\s\S]*?sections\.cart_upsell\.from_price[\s\S]*?else[\s\S]*?{{ upsell_price }}/);
  expect(source).toContain('assign upsell_price = product.price | money');
});

test('editor schema has localized product settings, padding controls, and empty-product presets', () => {
  expect(schema.name).toBe('t:sections.cart_upsell.name');
  expect(schema.presets[0].name).toBe('t:sections.cart_upsell.presets.name');
  expect(schema.settings.filter(({ type }) => type === 'range').map(({ id }) => id)).toEqual(['padding_top', 'padding_bottom']);
  expect(schema.blocks[0].name).toBe('t:sections.cart_upsell.blocks.product.name');
  expect(schema.blocks[0].settings[0].type).toBe('product');
  expect(source).toContain('#shopify-section-{{ section.id }}');
  expect(source).toContain('section.settings.padding_top');
  expect(source).toContain('section.settings.padding_bottom');
});
