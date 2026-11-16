import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { openStorefrontPage } from '../helpers/storefront-page.mjs';

// Run only against an authorized Shopify-rendered version of this revision.
// This file deliberately has no fixture interception or passing substitute for
// the native filter index, real page assignment, or old-handle HTTP status.
const route = '/pages/descubre-tu-estilo';
const required = ['filter.p.product_type', 'filter.p.m.custom.frame_shape', 'filter.p.m.custom.frame_material', ...['color', 'finish', 'pattern', 'transparency', 'use', 'presence'].map(axis => `filter.v.m.custom.style_filter_${axis}`)];
async function open(page) {
  const response = await openStorefrontPage(page, route); expect(response.status()).toBe(200);
  await expect(page).not.toHaveURL(/\/password/); await expect(page.locator('body')).not.toContainText(/Liquid (?:syntax )?error/);
  const quiz = page.locator('[data-style-quiz]'); await expect(quiz).toBeVisible(); await expect(quiz.locator('[data-quiz-start]')).toBeEnabled();
  return quiz;
}
async function next(quiz, count = 1) { for (let i = 0; i < count; i++) await quiz.locator('[data-quiz-next]').click(); }

// Hidden quiz axes have removable applied chips rather than sidebar checkboxes.
// Match the removal URL, not the translated label or a minimum chip count.
const filterPairs = url => [...new URL(url).searchParams].filter(([field, value]) => field.startsWith('filter.') && !(value === '' && ['filter.v.price.gte', 'filter.v.price.lte'].includes(field))).map(pair => JSON.stringify(pair)).sort();
async function expectAppliedSelections(page, expected = filterPairs(page.url())) {
  await expect(page.locator('#ProductCount')).toBeAttached();
  await expect.poll(async () => filterPairs(page.url())).toEqual(expected);
  const chips = page.locator('.lemoon-applied-filters .lemoon-filter-pill');
  await expect(chips, 'one removable applied chip per selected value').toHaveCount(expected.length);
  const links = await chips.evaluateAll(nodes => nodes.map(node => node.href));
  for (const [index, pair] of expected.entries()) {
    const remaining = expected.filter((_, selectedIndex) => selectedIndex !== index);
    expect(links.filter(url => JSON.stringify(filterPairs(url)) === JSON.stringify(remaining)), `removal link for ${pair}`).toHaveLength(1);
  }
  return chips;
}
// Public Ajax product data proves display coherence and omits style metafields.
// Source/derived rules have a versioned plan and backoffice tests; this helper does not prove them.
async function expectCardVariantInformation(page) {
  await expect(page.locator('#ProductCount')).toBeAttached();
  await expect(page.locator('.collection.loading')).toHaveCount(0);
  expect(await page.evaluate(() => window.Shopify.currency.active)).toBe('CLP');
  const cards = page.locator('#ProductGridContainer #product-grid > li .card-wrapper');
  const products = new Map();
  for (const card of await cards.all()) {
    const target = new URL(await card.locator('a[id^="CardLink-"]').getAttribute('href'), page.url());
    expect(target.origin).toBe(new URL(page.url()).origin);
    const ids = target.searchParams.getAll('variant');
    expect(ids, `${target.pathname} has one canonical variant link`).toHaveLength(1);
    if (!products.has(target.pathname)) {
      const response = await page.request.get(new URL(`${target.pathname}.js`, page.url()).href);
      expect(response.ok(), `${target.pathname} public product data`).toBe(true);
      products.set(target.pathname, await response.json());
    }
    const product = products.get(target.pathname);
    const variant = product.variants.find(value => String(value.id) === ids[0]);
    expect(variant, `${target.pathname} linked variant belongs to this product`).toBeDefined();
    const visiblePrice = await card.locator('.card-information .price-item--sale').innerText();
    expect(Number(visiblePrice.replace(/[^0-9]/g, '')), `${target.pathname} variant price`).toBe(Math.round(variant.price / 100));
    const primary = card.locator('.card__media img').first();
    if (variant.featured_image?.src) {
      const imagePath = source => new URL(source, page.url()).pathname;
      expect(imagePath(await primary.getAttribute('src')), `${target.pathname} variant photograph`).toBe(imagePath(variant.featured_image.src));
    } else {
      expect(await primary.getAttribute('src'), `${target.pathname} missing media uses honest fallback`).toContain('lemoon-product-fallback.png');
    }
    const swatches = card.locator('.lemoon-product-card__swatch');
    if (await swatches.count()) {
      const chosen = card.locator('.lemoon-product-card__swatch[aria-pressed="true"]');
      await expect(chosen).toHaveCount(1);
      const swatchTarget = new URL(await chosen.getAttribute('data-variant-url'), page.url());
      expect(swatchTarget.searchParams.getAll('variant'), `${target.pathname} selected swatch variant`).toEqual(ids);
      const colorIndex = product.options.findIndex(option => /colou?r/i.test(typeof option === 'string' ? option : option.name));
      if (colorIndex >= 0) expect(await chosen.getAttribute('aria-label')).toBe(variant.options[colorIndex]);
    }
  }
}

const colorChoices = [
  ['bold', 'color', ['bold']], ['neutral', 'color', ['neutral', 'brown', 'light']],
  ['black', 'color', ['black']], ['tortoise', 'pattern', ['tortoise']],
  ['two_tone', 'color', ['two_tone']], ['transparent', 'transparency', ['transparent']],
  ['silver', 'color', ['silver']],
];

test('natural route renders the quiz and the old handle returns HTTP404 without redirection', async ({ page, baseURL }) => {
  const quiz = await open(page);
  await expect(page.locator('#MainContent h1')).toHaveText('Descubre tu estilo ideal.');
  await expect(quiz.locator('[data-quiz-product], [data-candidate], [data-quiz-results]')).toHaveCount(0);
  const oldURL = new URL('/pages/buscar-mi-estilo', baseURL);
  // Reuse the authenticated browser cookies; preview_theme_id itself introduces
  // Shopify's 302 preview handshake and is not part of the natural public URL.
  const response = await page.request.get(oldURL.href, { maxRedirects: 0 });
  expect(response.status()).toBe(404); expect(response.headers().location).toBeUndefined();
  await page.goto(oldURL.href); expect(new URL(page.url()).pathname).toBe('/pages/buscar-mi-estilo'); await expect(page.locator('[data-style-quiz]')).toHaveCount(0);
});

test('Shopify exposes every selected axis and applies editable native filters before returning to the final stage', async ({ page }) => {
  const quiz = await open(page);
  const config = JSON.parse(await quiz.locator('[data-quiz-filter-config]').textContent());
  expect(config.dictionaryComplete).toBe(true); expect(config.availableFilters).toEqual(expect.arrayContaining(required));
  for (const trait of config.traits) expect(trait.id).toMatch(/^gid:\/\/shopify\/Metaobject\/[1-9]\d*$/);
  await quiz.locator('[data-quiz-start]').click(); await quiz.locator('input[value="optical"]').check(); await next(quiz);
  await quiz.locator('input[name="shape"][value="round"]').check(); await next(quiz);
  for (const value of ['black', 'silver', 'tortoise', 'transparent']) await quiz.locator(`[data-step="color"] input[value="${value}"]`).check(); await next(quiz);
  await quiz.locator('input[name="finish"][value="matte"]').check(); await quiz.locator('input[name="finish"][value="glossy"]').check(); await quiz.locator('input[name="material"][value="metal"]').check(); await next(quiz);
  await quiz.locator('input[name="use"][value="everyday"]').check(); await next(quiz);
  await quiz.locator('input[name="presence"][value="medium"]').check(); await next(quiz);
  await expect(page).toHaveURL(/\/collections\/all\?/); await expect(page.locator('#ProductCount')).toBeAttached();
  await expect(page.locator('#MainContent')).not.toContainText(/Liquid (?:syntax )?error/);
  const query = new URL(page.url()).searchParams;
  for (const field of required) expect(query.has(field), field).toBe(true);
  const chips = await expectAppliedSelections(page);
  const remaining = filterPairs(new URL(await chips.first().getAttribute('href'), page.url()).href);
  await chips.first().click(); await expectAppliedSelections(page, remaining);
  // Native zero-results is valid; it must retain honest controls for removal.
  await expect(page.locator('.lemoon-filter-reset a')).toBeVisible();
  await page.goBack(); await page.goBack(); await expect(page.locator('[data-step="presence"]')).toBeVisible();
  await expect(page.locator('input[name="presence"][value="medium"]')).toBeChecked();
});

for (const [choice, group, codes] of colorChoices) {
  test(`quiz color ${choice} retains every selected value through sorting and removal`, async ({ page }) => {
    const quiz = await open(page);
    const config = JSON.parse(await quiz.locator('[data-quiz-filter-config]').textContent());
    const field = `filter.v.m.custom.style_filter_${group}`;
    const values = codes.map(code => {
      const matches = config.traits.filter(trait => trait.group === group && trait.code === code);
      expect(matches, `${group}/${code} dictionary reference`).toHaveLength(1);
      expect(matches[0].id).toMatch(/^gid:\/\/shopify\/Metaobject\/[1-9]\d*$/);
      return matches[0].id;
    });
    await quiz.locator('[data-quiz-start]').click(); await next(quiz, 2);
    await quiz.locator(`[data-step="color"] input[name="${group}"][value="${choice}"]`).check();
    await next(quiz, 4);
    await expect(page).toHaveURL(/\/collections\/all\?/);
    const expected = values.map(value => JSON.stringify([field, value])).sort();
    await expectCardVariantInformation(page);
    const chips = await expectAppliedSelections(page, expected);
    await page.locator('[data-sort-menu] summary').click();
    await page.locator('[data-sort-value="price-ascending"]').click();
    await expect(page).toHaveURL(/sort_by=price-ascending/);
    await expectAppliedSelections(page, expected);
    const remaining = filterPairs(new URL(await chips.first().getAttribute('href'), page.url()).href);
    await chips.first().click(); await expectAppliedSelections(page, remaining);
    expect(new URL(page.url()).searchParams.get('sort_by')).toBe('price-ascending');
  });
}

// Synthetic LM-DEMO assignments come from the versioned catalog plan, not a current Admin audit.
// Other products may legitimately combine bold color and Carey on one variant.
const demoProducts = JSON.parse(readFileSync('scripts/style-quiz-catalog-plan.json', 'utf8')).assignments.map(product => product.productId.split('/').at(-1));

for (const [name, choices] of [
  ['color OR', [['color', 'bold'], ['color', 'neutral']]],
  ['color AND pattern', [['color', 'bold'], ['pattern', 'tortoise']]],
  ['color OR with independent pattern', [['color', 'bold'], ['color', 'neutral'], ['pattern', 'tortoise']]],
]) {
  test(`quiz ${name} keeps each returned card photograph, price and variant link coherent`, async ({ page }) => {
    const quiz = await open(page);
    const config = JSON.parse(await quiz.locator('[data-quiz-filter-config]').textContent());
    await quiz.locator('[data-quiz-start]').click(); await next(quiz, 2);
    const expected = [];
    for (const [group, code] of choices) {
      await quiz.locator(`[data-step="color"] input[name="${group}"][value="${code}"]`).check();
      const codes = code === 'neutral' ? ['neutral', 'brown', 'light'] : [code];
      for (const expectedCode of codes) {
        const trait = config.traits.find(value => value.group === group && value.code === expectedCode);
        expect(trait, `${group}/${expectedCode}`).toBeDefined();
        expected.push(JSON.stringify([`filter.v.m.custom.style_filter_${group}`, trait.id]));
      }
    }
    await next(quiz, 4); await expect(page).toHaveURL(/\/collections\/all\?/);
    await expectCardVariantInformation(page);
    if (name === 'color AND pattern') {
      const returnedIDs = await page.locator('#ProductGridContainer #product-grid .card-wrapper').evaluateAll(cards => cards.map(card => card.dataset.productId));
      expect(returnedIDs.filter(id => demoProducts.includes(id)), 'demo bold and Carey belong to different variants').toEqual([]);
    }
    await expectAppliedSelections(page, expected.sort());
  });
}

test('an unrestricted quiz hands the complete catalogue count and pagination to Shopify', async ({ page }) => {
  const quiz = await open(page); await quiz.locator('[data-quiz-start]').click(); await next(quiz, 6);
  await expect(page).toHaveURL(/\/collections\/all(?:\?|$)/);
  expect([...new URL(page.url()).searchParams.keys()].filter(key => key.startsWith('filter.'))).toEqual([]);
  // Desktop hides its count on mobile; data attributes remain the count contract.
  const count = page.locator('#ProductCount'); await expect(count).toBeAttached();
  const expectedCount = Number(await count.getAttribute('data-product-count'));
  expect(expectedCount).toBe(Number(await count.getAttribute('data-total-count')));
  const cards = page.locator('#product-grid > li');
  if (expectedCount > await cards.count()) {
    const nextPage = page.locator('.pagination__item--prev[href*="page="]');
    await expect(nextPage).toBeVisible(); const firstIDs = await cards.evaluateAll(nodes => nodes.map(node => node.querySelector('[id]')?.id));
    await nextPage.click(); await expect(page).toHaveURL(/[?&]page=2/);
    const secondIDs = await cards.evaluateAll(nodes => nodes.map(node => node.querySelector('[id]')?.id));
    expect(secondIDs.length).toBeGreaterThan(0); expect(secondIDs.some(id => firstIDs.includes(id))).toBe(false);
  }
});

test('without JavaScript the real catalogue remains accessible', async ({ browser, baseURL, viewport, storageState }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL, viewport, storageState });
  const page = await context.newPage();
  try {
    const response = await page.goto(route); expect(response.status()).toBe(200);
    await expect(page.locator('[data-quiz-form]')).toBeHidden(); await expect(page.locator('[data-style-quiz] noscript')).toBeVisible();
    await page.locator('[data-quiz-fallback] a').click(); await expect(page).toHaveURL(/\/collections\/all/);
  } finally { await context.close(); }
});
