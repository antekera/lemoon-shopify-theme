import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { consumerSemanticContract } from '../helpers/consumer-semantic-contract.mjs';
const baseline = JSON.parse(readFileSync('tests/fixtures/consumer-contract-baseline.json', 'utf8'));
const fixture = scenario => `/tests/fixtures/consumer-contract.html?scenario=${scenario}`;

for (const scenario of Object.keys(baseline.dom)) {
  test(`${scenario}: real consumer retains baseline semantics`, async ({ page }) => {
    // Pure parsed DOM before controllers upgrade it; interaction tests below load
    // the local fixture shell and actual global.js separately.
    await page.goto(`${fixture(scenario)}&runtime=0`);
    expect(await page.locator('body').evaluate(consumerSemanticContract)).toEqual(baseline.dom[scenario]);
  });
}

for (const scenario of ['facets-horizontal', 'facets-drawer', 'facets-vertical', 'collection-preferred', 'collection-fallback', 'collection-relevance']) {
  test(`${scenario}: native sort identity, FormData and bubbling survive`, async ({ page }) => {
    const response = await page.goto(fixture(scenario));
    expect(response.status()).toBe(200);
    const selects = page.locator('select[name="sort_by"]');
    expect(await selects.count()).toBeGreaterThan(0);
    for (const select of await selects.all()) {
      const before = await select.evaluate(node => ({ id: node.id, description: node.getAttribute('aria-describedby'), form: node.form?.id, labelled: Boolean(node.getAttribute('aria-label') || node.labels?.length), value: node.value }));
      expect(before.description).toBe('a11y-refresh-page-message');
      expect(before.labelled).toBe(true);
      const value = scenario.startsWith('collection') ? 'price-ascending' : 'manual';
      await select.selectOption(value, { force: true });
      expect(await select.evaluate(node => new FormData(node.form).get('sort_by'))).toBe(value);
      await expect(page.locator('body')).toHaveAttribute('data-fixture-changed', 'sort_by');
      expect(await select.getAttribute('id')).toBe(before.id);
    }
  });
}

for (const scenario of ['slider-collection', 'slider-blog', 'slider-multicolumn']) {
  test(`${scenario}: actual Dawn controller updates counter and button states`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto(fixture(scenario));
    const slider = page.locator('slider-component');
    const previous = slider.locator('button[name="previous"]'), next = slider.locator('button[name="next"]');
    await expect(previous).toBeDisabled();
    await expect(next).toBeEnabled();
    await expect(slider.locator('.slider-counter--current')).toHaveText('1');
    await expect(slider.locator('.slider-counter--total')).toHaveText('4');
    await next.click();
    await expect(slider.locator('.slider-counter--current')).toHaveText('2');
    await expect(previous).toBeEnabled();
    await previous.click();
    await expect(slider.locator('.slider-counter--current')).toHaveText('1');
    await expect(previous).toBeDisabled();
  });
}

test('password and default social consumers keep distinct configured orders and accessible labels', async ({ page }) => {
  for (const scenario of ['password-social', 'default-social']) {
    await page.goto(fixture(scenario));
    const links = page.locator('ul.list-social a');
    expect(await links.count()).toBe(9);
    const order = await links.evaluateAll(nodes => nodes.map(node => new URL(node.href).pathname.slice(1)));
    expect(order).toEqual(scenario === 'password-social' ? ['twitter', 'facebook', 'pinterest', 'instagram', 'tiktok', 'tumblr', 'snapchat', 'youtube', 'vimeo'] : ['facebook', 'instagram', 'youtube', 'tiktok', 'twitter', 'pinterest', 'snapchat', 'tumblr', 'vimeo']);
    for (const link of await links.all()) await expect(link).toHaveAccessibleName(/\S/);
  }
});

for (const width of [390, 750, 1440]) {
  test(`editorial consumers retain baseline viewport widths at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const scenario of ['about', 'service-benefits', 'service-operations', 'crystal']) {
      await page.goto(fixture(scenario));
      // Services already overflow to424px at390 in the base offline fixture.
      // Preserve this known limitation without calling the extraction a reflow fix.
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(baseline.reflow[width][scenario]);
      await expect(page.locator('h1,h2').first()).toBeVisible();
    }
  });
}

test('rendered volume tiers drive the real price-per-item controller as quantity changes', async ({ page }) => {
  await page.goto(fixture('price-controller'));
  const input = page.getByLabel('Cantidad');
  const price = page.locator('#Price-Per-Item-contract-price .price-per-item--current');
  await expect(price).toContainText('10000 CLP');
  for (const [quantity, expected] of [['3', '9000 CLP'], ['8', '7000 CLP'], ['1', '10000 CLP']]) {
    await input.fill(quantity);
    await input.dispatchEvent('change');
    await expect(price).toContainText(expected);
  }
});

test('collection native fallback keeps a continuous border and separate focus without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  try {
    await page.goto(fixture('collection-preferred'));
    const select = page.locator('#SortBy');
    await expect(select).toBeVisible();
    await expect(page.locator('.lemoon-sort-menu')).toBeHidden();
    for (const edge of ['top', 'right', 'bottom', 'left']) {
      await expect(select).toHaveCSS(`border-${edge}-width`, '1px');
      await expect(select).toHaveCSS(`border-${edge}-color`, 'rgb(11, 31, 58)');
    }
    await select.focus();
    await expect(select).toHaveCSS('outline-width', '2px');
    await expect(select).toHaveCSS('outline-color', 'rgb(11, 31, 58)');
    expect(await select.evaluate(node => parseFloat(getComputedStyle(node).outlineOffset))).toBeGreaterThanOrEqual(2);
    await page.emulateMedia({ forcedColors: 'active' });
    await expect(select).toHaveCSS('border-top-style', 'solid');
    await expect(select).toHaveCSS('border-top-width', '1px');
    await expect(select).toHaveCSS('outline-style', 'solid');
    await expect(select).toHaveCSS('outline-width', '2px');
  } finally { await context.close(); }
});

test('enhanced collection sorting hides the native select and retains focus on its visible summary', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(fixture('collection-preferred'));
  await expect(page.locator('#SortBy')).toBeHidden();
  const summary = page.locator('.lemoon-sort-menu summary');
  await expect(summary).toBeVisible();
  await summary.focus();
  await expect(summary).toHaveCSS('outline-width', '2px');
  await expect(summary).toHaveCSS('outline-color', 'rgb(11, 31, 58)');
  expect(await summary.evaluate(node => parseFloat(getComputedStyle(node).outlineOffset))).toBeGreaterThanOrEqual(2);
});

test('facet sort selectors retain approved boundaries and focus in the production stylesheet order', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(fixture('facets-horizontal'));
  const select = page.locator('#SortBy');
  await expect(select).toBeVisible();
  for (const edge of ['top', 'right', 'bottom', 'left']) {
    await expect(select).toHaveCSS(`border-${edge}-width`, '1px');
    await expect(select).toHaveCSS(`border-${edge}-color`, 'rgb(11, 31, 58)');
  }
  await select.focus();
  await expect(select).toHaveCSS('outline-width', '2px');
  await expect(select).toHaveCSS('outline-color', 'rgb(11, 31, 58)');
  expect(await select.evaluate(node => parseFloat(getComputedStyle(node).outlineOffset))).toBeGreaterThanOrEqual(2);
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(select).toHaveCSS('border-top-style', 'solid');
  await expect(select).toHaveCSS('border-top-width', '1px');
  await expect(select).toHaveCSS('outline-style', 'solid');
  await expect(select).toHaveCSS('outline-width', '2px');
});

test('mobile facet sort retains separate navy focus after component-facets stylesheet', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(fixture('facets-horizontal'));
  await page.locator('details.mobile-facets__disclosure > summary').click();
  const select = page.locator('#SortBy-mobile');
  await expect(select).toBeVisible();
  await select.focus();
  await expect(select).toHaveCSS('border-top-width', '1px');
  await expect(select).toHaveCSS('border-top-color', 'rgb(11, 31, 58)');
  await expect(select).toHaveCSS('outline-width', '2px');
  await expect(select).toHaveCSS('outline-color', 'rgb(11, 31, 58)');
  expect(await select.evaluate(node => parseFloat(getComputedStyle(node).outlineOffset))).toBeGreaterThanOrEqual(2);
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(select).toHaveCSS('border-top-style', 'solid');
  await expect(select).toHaveCSS('border-top-width', '1px');
  await expect(select).toHaveCSS('outline-style', 'solid');
  await expect(select).toHaveCSS('outline-width', '2px');
});
