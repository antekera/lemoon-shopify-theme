import { describe, it, expect } from 'vitest';
import { createQuizEngine, quizProduct, fixtureProducts } from '../helpers/style-quiz-renderer.mjs';

function card(product, recommended_variant, params = {}) {
  const engine = createQuizEngine();
  engine.registerFilter('placeholder_svg_tag', () => '<svg data-fixture-placeholder></svg>');
  return engine.renderFileSync('card-product', {
    card_product: product, recommended_variant, section_id: 'quiz-card-test',
    show_secondary_image: false, show_vendor: false, show_rating: false,
    skip_styles: false, show_quick_add: false, lazy_load: true, ...params,
  });
}
const links = html => [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(match => match[1]);
const regularPrice = html => html.match(/<span class="price-item price-item--regular">([\s\S]*?)<\/span>/)?.[1].trim();
const primaryImage = html => html.match(/<img\b[^>]*>/)?.[0];

describe('canonical card recommended variant', () => {
  it('renders the chosen variant media, price, links and selected swatch together', () => {
    const product = quizProduct(1);
    product.variants[1].featured_media.url = '/carey-selected.jpg';
    const html = card(product, product.variants[1]);
    expect(links(html)).toEqual(['/products/lente-1?variant=12', '/products/lente-1?variant=12', '/products/lente-1?variant=12']);
    expect(primaryImage(html)).toContain('src="/carey-selected.jpg?width=533"');
    expect(regularPrice(html)).toBe('$140.01');
    const buttons = html.match(/<button\b[^>]*>/g);
    expect(buttons.find(tag => tag.includes('aria-label="Carey"'))).toContain('aria-pressed="true"');
    expect(buttons.find(tag => tag.includes('aria-label="Azul"'))).toContain('aria-pressed="false"');
  });

  it('preserves the original card when no recommended variant is supplied', () => {
    const product = quizProduct(1);
    const html = card(product);
    expect(links(html)).toEqual(['/products/lente-1', '/products/lente-1', '/products/lente-1']);
    expect(regularPrice(html)).toBe('$100.01');
    expect(html.match(/<button\b[^>]*aria-label="Azul"[^>]*>/)?.[0]).toContain('aria-pressed="true"');
  });

  it('ignores an unrelated variant instead of crossing product data', () => {
    const product = quizProduct(1);
    expect(card(product, quizProduct(2).variants[1])).toBe(card(product));
  });

  it('uses a neutral fallback when the selected variant has no media', () => {
    const product = quizProduct(1);
    product.variants[1].featured_media = null;
    const html = card(product, product.variants[1]);
    expect(primaryImage(html)).toContain('/assets/lemoon-product-fallback.png');
    expect(regularPrice(html)).toBe('$140.01');
  });

  it('provides a neutral image source for a missing-media alternate color on a photographed recommended card', () => {
    const [product] = fixtureProducts('missing-media');
    const html = card(product, product.variants[0], { show_secondary_image: true });
    expect(primaryImage(html)).toContain('lemoon-category-opticos-generic-v1.jpg');
    const alternate = html.match(/<button\b[^>]*aria-label="Carey"[^>]*>/)?.[0];
    expect(alternate).toContain('data-primary-src="/assets/lemoon-product-fallback.png"');
    expect(alternate).toContain('data-primary-alt=""');
    expect(alternate).toContain('data-secondary-src=""');
    expect(alternate).toContain('data-variant-url="/products/lente-601?variant=6012"');
    expect(alternate).toContain('data-price="$146.01"');
    const legacyAlternate = card(product).match(/<button\b[^>]*aria-label="Carey"[^>]*>/)?.[0];
    expect(legacyAlternate).toContain('data-primary-src="/assets/lemoon-category-opticos-generic-v1.jpg?width=720"');
  });

  it('preserves non-color options when exploring a color from a recommended variant', () => {
    const product = quizProduct(1);
    product.options = ['Color', 'Talla'];
    product.variants[0].options = ['Azul', 'S'];
    product.variants[1].options = ['Carey', 'S'];
    const blueLarge = { ...product.variants[0], id: 13, options: ['Azul', 'L'], url: '/products/lente-1?variant=13' };
    const tortoiseLarge = { ...product.variants[1], id: 14, options: ['Carey', 'L'], url: '/products/lente-1?variant=14' };
    product.variants.push(blueLarge, tortoiseLarge);
    const html = card(product, tortoiseLarge);
    expect(html.match(/<button\b[^>]*aria-label="Azul"[^>]*>/)?.[0]).toContain('data-variant-url="/products/lente-1?variant=13"');
    expect(html.match(/<button\b[^>]*aria-label="Carey"[^>]*>/)?.[0]).toContain('data-variant-url="/products/lente-1?variant=14"');
    product.variants = product.variants.filter(variant => variant.id !== 13);
    expect(card(product, tortoiseLarge).match(/<button\b[^>]*aria-label="Azul"[^>]*>/)?.[0]).toMatch(/\sdisabled(?:[\s>])/);
  });

  it('keeps an opted-in quick-add form on the displayed recommended variant', () => {
    const product = quizProduct(1);
    expect(card(product, product.variants[1], { show_quick_add: true })).toContain('name="id" value="12"');
    expect(card(product, undefined, { show_quick_add: true })).toContain('name="id" value="11"');
    expect(card(product, quizProduct(2).variants[1], { show_quick_add: true })).toContain('name="id" value="11"');
  });

  it('only renders a secondary image associated with the recommended color', () => {
    const product = quizProduct(1);
    const blueDiagonal = { ...product.featured_media, id: 'blue-diagonal', url: '/blue-diagonal.jpg', alt: 'card-diagonal:azul' };
    product.media = [product.featured_media, blueDiagonal, product.variants[1].featured_media];
    const html = card(product, product.variants[1], { show_secondary_image: true });
    expect(html).not.toContain('data-lazy-src="/blue-diagonal.jpg');
    const careyDiagonal = { ...blueDiagonal, id: 'carey-diagonal', url: '/carey-diagonal.jpg', alt: 'card-diagonal:carey' };
    product.media.push(careyDiagonal);
    expect(card(product, product.variants[1], { show_secondary_image: true })).toContain('data-lazy-src="/carey-diagonal.jpg');
  });

  it('renders only the primary photograph when the recommended color has no diagonal', () => {
    const product = quizProduct(1);
    const html = card(product, product.variants[1], { show_secondary_image: true });
    expect(html.match(/<img\b[^>]*>/g)).toHaveLength(1);
    expect(primaryImage(html)).toContain(`src="${product.variants[1].featured_media.url}?width=533"`);
    expect(html).not.toContain('data-lazy-src=');
    expect(html).not.toContain('data-lazy-srcset=');
    expect(html).not.toContain('Liquid error');
  });
});
