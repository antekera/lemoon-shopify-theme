import { readFile } from 'node:fs/promises';
import { expect, test } from 'vitest';

const themeFile = (path) => new URL(`../../${path}`, import.meta.url);

test('renders up to three compact product labels while preserving label color variants', async () => {
  const template = await readFile(themeFile('snippets/card-product.liquid'), 'utf8');
  const labels = await readFile(themeFile('snippets/lemoon-product-card-labels.liquid'), 'utf8');
  const styles = await readFile(themeFile('assets/lemoon-components.css'), 'utf8');

  expect(labels).toMatch(/for label_tag in card_product\.tags[\s\S]*?rendered_label_styles contains label_signature[\s\S]*?rendered_label_count < max_label_count[\s\S]*?lemoon-product-card__label/);
  expect(labels).toMatch(/card_product\.available == false[\s\S]*?max_label_count = 2[\s\S]*?label--sold-out/);
  expect(styles).toMatch(/\.lemoon-product-card__label\s*\{[^}]*border-radius:\s*var\(--lemoon-radius-full\)/);
  expect(styles).toMatch(/\.lemoon-product-card__label--flash-sale\s*\{\s*background:\s*#F7E600;\s*color:\s*#0B1F3A;/);
  expect(styles).toMatch(/\.lemoon-product-card__label--new\s*\{\s*background:\s*#0B1F3A;\s*color:\s*#FFFFFF;/);
  expect(styles).toMatch(/\.lemoon-product-card__label--best-seller\s*\{\s*background:\s*#316653;\s*color:\s*#FFFFFF;/);
});

test('keeps the future AR try-on hidden and the card title secondary to price', async () => {
  const template = await readFile(themeFile('snippets/card-product.liquid'), 'utf8');
  const styles = await readFile(themeFile('assets/lemoon-components.css'), 'utf8');

  expect(template).toMatch(/class="lemoon-product-card__try-on"[\s\S]*?icon: 'ar-try-on'/);
  expect(template).not.toMatch(/class="lemoon-product-card__try-on"[^>]*href=/);
  expect(styles).toMatch(/\.lemoon-product-card__try-on\s*\{[^}]*display:\s*none/);
  expect(styles).toMatch(/\.product-card-wrapper \.card__heading\s*\{[^}]*font-size:\s*1\.3rem/);
  expect(styles).toMatch(/\.product-card-wrapper \.card-information \.price-item--sale,[\s\S]*?font-size:\s*1\.8rem/);
});

test('keeps sale prices single, shows unit prices, and outlines selected dark swatches', async () => {
  const price = await readFile(themeFile('snippets/price.liquid'), 'utf8');
  const styles = await readFile(themeFile('assets/lemoon-components.css'), 'utf8');

  expect(price).toMatch(/unit_price_measurement[\s\S]*?render 'unit-price'/);
  expect(styles).toMatch(/\.product-card-wrapper \.card-information \.price--on-sale \.price__sale\s*\{[^}]*display:\s*flex/);
  expect(styles).toMatch(/\.lemoon-product-card__swatch\s*\{[^}]*width:\s*2rem;[^}]*height:\s*2rem/);
  expect(styles).toMatch(/\.lemoon-product-card__swatch-color\s*\{[^}]*width:\s*1\.6rem;[^}]*height:\s*1\.6rem/);
  expect(styles).toMatch(/\.lemoon-product-card__swatch\.is-selected\s*\{[^}]*border:\s*1px solid #5F6368;[^}]*box-shadow:\s*none/);
  expect(styles).toMatch(/\.product-card-wrapper \.card__inner\s*\{[^}]*z-index:\s*1/);
  expect(styles).toMatch(/@media screen and \(max-width: 749px\)\s*\{[^}]*\.lemoon-product-card__swatch\s*\{[^}]*width:\s*1\.6rem;[^}]*height:\s*1\.6rem/);
  expect(styles).toMatch(/--ratio-percent:\s*96% !important/);
  expect(styles).toMatch(/\.product-card-wrapper \.card__media \.media > img\s*\{[^}]*width:\s*100%;[^}]*height:\s*100%;[^}]*object-fit:\s*cover/);
});

test('uses color-specific gallery images first and preserves query params in variant links', async () => {
  const template = await readFile(themeFile('snippets/card-product.liquid'), 'utf8');
  const colorSpecificMarker = template.indexOf("assign secondary_marker = 'card-diagonal:' | append: value.name");
  const genericMarker = template.indexOf("assign secondary_marker = 'card-view:diagonal'");

  expect(colorSpecificMarker).toBeGreaterThanOrEqual(0);
  expect(genericMarker).toBeGreaterThan(colorSpecificMarker);
  expect(template).toMatch(/assign swatch_product_url = value\.product_url \| default: card_product\.url[\s\S]*?if swatch_product_url contains '\?'[\s\S]*?assign variant_separator = '&'/);
  expect(template).toMatch(/data-variant-url="\{\{ swatch_product_url \}\}\{\{ variant_separator \}\}variant=\{\{ swatch_variant\.id \}\}"/);
  expect(template).toMatch(/if swatch_secondary == blank\s+assign secondary_marker = 'card-model:' \| append: value\.name/);
  expect(template).not.toMatch(/if swatch_secondary == blank and swatch_primary\.id == card_product\.featured_media\.id/);
});

test('renders each variant media preview as a valid Shopify image URL', async () => {
  const template = await readFile(themeFile('snippets/card-product.liquid'), 'utf8');

  expect(template).toMatch(/assign swatch_secondary_image = swatch_secondary\.preview_image \| default: swatch_secondary/);
  expect(template).toMatch(/data-secondary-src="\{% if swatch_secondary_image %\}\{\{ swatch_secondary_image \| image_url: width: 720 \}\}/);
  expect(template).toMatch(/swatch_secondary_image \| image_url: width: 360/);
  expect(template).not.toMatch(/swatch_secondary \| image_url/);
});

test('defers the second product card image until near the viewport and removes quick-add markup', async () => {
  const template = await readFile(themeFile('snippets/card-product.liquid'), 'utf8');
  const script = await readFile(themeFile('assets/lemoon-product-card.js'), 'utf8');
  const collection = await readFile(themeFile('sections/main-collection-product-grid.liquid'), 'utf8');

  expect(template).toMatch(/data-lazy-srcset=/);
  expect(template).toMatch(/data-lazy-src=/);
  expect(template.match(/draggable="false"/g)).toHaveLength(3);
  expect(template).not.toMatch(/data-gallery-src=/);
  expect(script).toMatch(/IntersectionObserver/);
  expect(collection).toMatch(/enable_gallery_swipe:\s*true/);
  expect(template).toMatch(/if enable_gallery_swipe %\} data-enable-gallery-swipe/);
  expect(script).toMatch(/if \(!card\.hasAttribute\('data-enable-gallery-swipe'\)\) return/);
  expect(script).toMatch(/rootMargin: '240px 0px'/);
  expect(script).toMatch(/pointerdown/);
  expect(script).toMatch(/pointerup/);
  expect(template).not.toMatch(/quick-add-modal|modal-opener|quick-add__submit/);
  expect(template).not.toMatch(/quick_add|quantity-popover|quick-order-list/);
  expect(template).not.toMatch(/lemoon-product-card__wishlist/);
  expect(script).not.toMatch(/lemoon:favorites|localStorage/);
});

test('keeps the generic fallback image from exposing a product-title tooltip', async () => {
  const template = await readFile(themeFile('snippets/card-product.liquid'), 'utf8');

  expect(template).toMatch(/src="\{\{ 'lemoon-product-fallback\.png' \| asset_url \}\}"\s+alt=""/);
  expect(template).not.toMatch(/if card_product\.featured_media %\} card--media\{% else %\} card--text/);
  expect(template).toMatch(/card card--\{\{ settings\.card_style \}\}[\s\S]{0,180}card--media/);
});

test('header account icons link directly to the Shopify customer profile route', async () => {
  const header = await readFile(themeFile('sections/header.liquid'), 'utf8');

  expect(header.match(/href="\{\{ routes\.account_profile_url \}\}"/g)).toHaveLength(2);
});
