import { expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { renderTax, taxCases, renderPrice, priceCases, renderContract, renderSlider, renderSocial, normalizeMarkup } from '../helpers/consumer-contract-renderer.mjs';

const baseline = JSON.parse(readFileSync(new URL('../fixtures/consumer-contract-baseline.json', import.meta.url), 'utf8'));
const sourceRoot = process.env.LEMOON_CONTRACT_SOURCE_ROOT;

for (const [caseIndex, state] of taxCases.entries()) {
  for (const owner of [0, 1, 2]) {
    test(`tax-note owner ${owner}: duties ${state.duties}, taxes ${state.taxes}, policy ${state.policy}`, () => {
      const html = normalizeMarkup(renderTax(owner, state, sourceRoot));
      expect(html).toBe(baseline.tax[caseIndex].html);
      expect(html).toMatch(/^<small class="tax-note caption-large rte">/);
      expect(html.includes('<a ')).toBe(state.policy);
      expect(html).not.toContain('undefined');
    });
  }
}
for (const [caseIndex, state] of priceCases.entries()) {
  for (const owner of [0, 1]) {
    test(`product unit-price owner ${owner}: ${state.name}, including following quantity rules and volume table`, () => {
      const html = normalizeMarkup(renderPrice(owner, state, sourceRoot));
      expect(html).toBe(baseline.price[caseIndex].html[owner]);
      expect(html).toContain('id="Quantity-Rules-contract-price"');
      if (state.configured === false) expect(html).not.toContain('<price-per-item');
      else {
        expect(html).toContain('id="Price-Per-Item-contract-price"');
        expect(html).toContain('data-section-id="contract-price"');
        expect(html).toContain('data-variant-id="91"');
        expect(html).toContain('id="Volume-contract-price"');
      }
    });
  }
}

test('volume pricing crosses a tier using minimum at zero cart quantity and increment for existing cart quantity', () => {
  expect(renderPrice(0, priceCases.find(c => c.name === 'below-tier'), sourceRoot)).toContain('10000 CLP');
  for (const name of ['at-first-tier', 'minimum-reaches-tier', 'increment-reaches-tier']) expect(renderPrice(0, priceCases.find(c => c.name === name), sourceRoot).split('</price-per-item>')[0]).toContain('9000 CLP');
  expect(renderPrice(0, priceCases.find(c => c.name === 'at-last-tier'), sourceRoot).split('</price-per-item>')[0]).toContain('7000 CLP');
});

test('carousel owner filters zero-price/unavailable products, retains next page and delegated card inputs', () => {
  for (const scenario of ['carousel', 'carousel-accessories']) {
    const html = renderContract(scenario, sourceRoot);
    expect(html).toContain('data-product-id="1"');
    expect(html).toContain('data-product-id="4"');
    expect(html).not.toMatch(/data-product-id="[23]"/);
    expect(html).toContain('data-next-page="/collections/all?view=carousel&amp;page=2"');
    expect(html).toContain(scenario === 'carousel' ? 'data-section="carousel" data-quick-add="false"' : 'data-section="accessory-carousel" data-quick-add="true"');
    expect(html).toContain('data-square="square" data-lazy="true" data-skip-styles="true"');
    expect(html).toContain('data-secondary="true" data-vendor="false" data-rating="false"');
    expect(html).toContain('data-product-tags="[&#34;A &lt;&amp;');
  }
});

for (const postLimit of [1, 2]) {
  test(`blog slider retains responsive control classes at post_limit ${postLimit}`, () => {
    const html = renderSlider(1, sourceRoot, postLimit);
    expect(html).toContain(postLimit === 1 ? 'class="slider-buttons medium-hide small-hide"' : 'class="slider-buttons medium-hide"');
    expect(html).toContain(`<span class="slider-counter--total">${postLimit}</span>`);
    expect(html).toContain('name="previous"');
    expect(html).toContain('name="next"');
  });
}

test('social settings omit absent networks and unknown order entries without altering valid order', () => {
  const html = renderSocial('twitter,unknown,instagram,vimeo', ['instagram', 'twitter'], sourceRoot);
  expect(html).not.toMatch(/unknown|icon-vimeo|social_youtube/);
  expect(html.match(/<li /g)).toHaveLength(2);
  expect(html.indexOf('example.test/twitter')).toBeLessThan(html.indexOf('example.test/instagram'));
  expect(html).toContain('?x=1&amp;y=2');
  expect(renderSocial(undefined, [], sourceRoot)).not.toContain('<li');
});

test('carousel final page retains empty next-page cursor for both response views', () => {
  for (const scenario of ['carousel-final', 'carousel-accessories-final']) {
    const html = renderContract(scenario, sourceRoot);
    expect(html).toContain('data-next-page=""');
    expect(html).toContain('data-product-id="1"');
    expect(html).not.toContain('page=2');
  }
});
