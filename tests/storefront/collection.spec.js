import { test, expect } from '@playwright/test';

const collectionPath = process.env.STOREFRONT_COLLECTION || '/collections/opticos';
const cardItems = '#ProductGridContainer #product-grid > li';

test.beforeEach(async ({ page }) => {
  await page.goto(collectionPath);
  await expect(page.locator('.lemoon-plp-intro h1')).toBeVisible();
  await expect(page.locator('[data-sort-value]')).not.toHaveCount(0);
});

test('responsive pagination preserves the chosen page and has no current hover underline', async ({ page }, testInfo) => {
  const pageSize = testInfo.project.name === 'mobile' ? 16 : 15;
  await expect(page.locator('#ProductGridContainer [data-plp-page-size]')).toHaveAttribute('data-plp-page-size', String(pageSize));
  await expect(page.locator(cardItems)).toHaveCount(pageSize);
  const current = page.locator('.pagination__item--current');
  const color = await current.evaluate((el) => getComputedStyle(el).backgroundColor);
  await current.hover();
  await expect(current).toHaveCSS('background-color', color);
  await expect(current).toHaveCSS('text-decoration-line', 'none');
  await expect(current).toHaveCSS('cursor', 'default');
  if (testInfo.project.name === 'mobile') {
    const arrow = page.locator('.pagination__item-arrow[aria-label="Página siguiente"]');
    const number = page.locator('.pagination__item[href][aria-label="Página 2"]');
    await page.mouse.move(0, 0);
    expect(await arrow.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(await number.evaluate((el) => getComputedStyle(el).backgroundColor));
    const arrowBox = await arrow.boundingBox();
    const numberBox = await number.boundingBox();
    expect(Math.abs(arrowBox.y - numberBox.y)).toBeLessThanOrEqual(1);
    expect(arrowBox.height).toBe(numberBox.height);
  }
  await page.locator('.pagination__item-arrow[aria-label="Página siguiente"]').click();
  await expect(page).toHaveURL(/page=2/);
  await expect(current).toHaveText('2');
  await expect(page.locator(cardItems)).toHaveCount(pageSize);
});

test('sort, filter, clear and browser back refresh the catalogue', async ({ page }, testInfo) => {
  if (testInfo.project.name === 'mobile') {
    await expect(page.locator('[data-sort-menu] summary')).toHaveCSS('font-size', '12px');
  }
  await page.locator('[data-sort-menu] summary').click();
  await page.locator('[data-sort-value="price-ascending"]').click();
  await expect(page).toHaveURL(/sort_by=price-ascending/);
  await expect(page.locator('.collection.loading')).toHaveCount(0);
  const form = testInfo.project.name === 'mobile' ? '#FacetFiltersFormMobile' : '#FacetFiltersForm';
  if (testInfo.project.name === 'mobile') await page.locator('.mobile-facets__open-wrapper').click();
  await page.locator(`${form} input[name="filter.p.m.custom.gender"][value="niños"]`).check();
  await expect(page.locator('.lemoon-filter-pill')).toHaveCount(1);
  await expect(page).toHaveURL(/filter\.p\.m\.custom\.gender=/);
  if (testInfo.project.name === 'mobile') {
    await expect(page.locator('[data-view-results]')).toHaveText('Ver 1 lente');
    await page.locator('[data-view-results]').click();
    await expect(page.locator('.mobile-facets__inner')).toBeHidden();
    await expect(page.locator('[data-applied-filter-count]')).toHaveText('1');
  }
  await expect(page.locator(cardItems)).toHaveCount(1);
  await page.locator('.lemoon-filter-reset a').click();
  await expect(page.locator('.lemoon-filter-pill')).toHaveCount(0);
  await expect(page).toHaveURL(/sort_by=price-ascending/);
  await page.goBack();
  await expect(page.locator('.lemoon-filter-pill')).toHaveCount(1);
  await expect(page.locator(cardItems)).toHaveCount(1);
});

test('price sliders step by 1000, stay inside their container and update the filter', async ({ page }, testInfo) => {
  if (testInfo.project.name === 'mobile') await page.locator('.mobile-facets__open-wrapper').click();
  const form = testInfo.project.name === 'mobile' ? '#FacetFiltersFormMobile' : '#FacetFiltersForm';
  const slider = page.locator(`${form} price-range[data-price-slider]`);
  const upper = slider.locator('[data-price-handle="max"]');
  await expect(upper).toHaveAttribute('step', '1000');
  await expect(slider).not.toContainText('El precio más alto');
  const bounds = await slider.boundingBox();
  const handle = await upper.boundingBox();
  expect(handle.x).toBeGreaterThanOrEqual(bounds.x);
  expect(handle.x + handle.width).toBeLessThanOrEqual(bounds.x + bounds.width + 1);
  const initial = Number(await upper.inputValue());
  await upper.focus();
  await page.keyboard.press('ArrowLeft');
  await expect(upper).toHaveValue(String(initial - 1000));
  await expect(page).toHaveURL(/filter\.v\.price\.lte=/);
  await expect(page.locator('.lemoon-filter-pill')).toHaveCount(1);
});

test('toolbar stays below the header; grid and sidebar retain their controls', async ({ page }, testInfo) => {
  const toolbar = page.locator('.lemoon-plp-toolbar');
  await page.evaluate(() => scrollTo(0, 650));
  await expect(toolbar).toHaveCSS('position', 'sticky');
  await expect.poll(async () => toolbar.evaluate((el) => Math.abs(el.getBoundingClientRect().top - parseFloat(getComputedStyle(el).top)))).toBeLessThanOrEqual(1);
  expect(await toolbar.evaluate((el) => Number(getComputedStyle(el).zIndex))).toBeLessThan(await page.locator('.section-header').evaluate((el) => Number(getComputedStyle(el).zIndex)));
  if (testInfo.project.name === 'mobile') {
    const toggle = page.locator('[data-grid-toggle]');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(toggle).toBeFocused();
    await expect(page.locator('.lemoon-plp')).toHaveAttribute('data-columns', '1');
    await expect.poll(async () => toolbar.evaluate((el) => parseFloat(getComputedStyle(el).top))).toBeCloseTo(await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) - 2), 0);
    await expect(page.locator('[data-mobile-results]')).toContainText(/Mostrando \d+ resultados/);
    await page.reload();
    await expect(page.locator('.lemoon-plp')).toHaveAttribute('data-columns', '1');
  } else {
    const toggle = page.locator('[data-filter-toggle]');
    const sidebar = page.locator('#main-collection-filters');
    await expect(toggle).toBeVisible();
    await expect(sidebar).toHaveCSS('position', 'sticky');
    await expect(page.locator('#FacetFiltersForm details').first()).toHaveJSProperty('open', true);
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(sidebar).toHaveJSProperty('inert', true);
    await toggle.click();
    await expect(sidebar).toHaveJSProperty('inert', false);
    await expect(page.locator('[data-lemoon-nav-open]:visible')).toHaveCount(0);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(await page.evaluate(() => innerWidth));
});

test('mobile drawer accordions, clear and view results preserve live filtering', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile');
  await page.locator('.mobile-facets__open-wrapper').click();
  const drawer = page.locator('.mobile-facets__inner');
  expect((await drawer.boundingBox()).width).toBeLessThanOrEqual(320);
  await expect(drawer.locator('.mobile-facets__header')).toContainText('Filtrar');
  await expect(drawer.locator('.mobile-facets__count')).toHaveCount(0);
  const groups = drawer.locator('[data-facet-accordion]');
  for (const group of await groups.all()) await expect(group).toHaveJSProperty('open', true);
  const first = groups.first();
  await first.locator('summary').click();
  await expect(first).toHaveJSProperty('open', false);
  await first.locator('summary').click();
  await expect(first).toHaveJSProperty('open', true);
  await drawer.locator('input[name="filter.p.m.custom.gender"][value="niños"]').check();
  await expect(drawer.locator('[data-view-results]')).toHaveText('Ver 1 lente');
  await first.locator('summary').click();
  await expect(first).toHaveJSProperty('open', false);
  await first.locator('summary').click();
  await expect(first).toHaveJSProperty('open', true);
  await drawer.locator('.mobile-facets__clear-wrapper a').click();
  await expect(page.locator('.lemoon-filter-pill')).toHaveCount(0);
  await drawer.locator('[data-view-results]').click();
  await expect(drawer).toBeHidden();
  await expect(page.locator('[data-applied-filter-count]')).toBeHidden();
});
