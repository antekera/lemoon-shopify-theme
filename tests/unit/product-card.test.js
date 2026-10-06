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

test('defers product gallery images after the first two and removes quick-add markup', async () => {
  const template = await readFile(themeFile('snippets/card-product.liquid'), 'utf8');
  const script = await readFile(themeFile('assets/lemoon-product-card.js'), 'utf8');

  expect(template).toMatch(/data-gallery-src=/);
  expect(template).toMatch(/data-gallery-index=/);
  expect(script).toMatch(/pointerdown/);
  expect(script).toMatch(/pointerup/);
  expect(script).toMatch(/data-gallery-src/);
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
