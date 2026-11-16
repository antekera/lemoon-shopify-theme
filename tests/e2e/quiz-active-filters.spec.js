import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';

const color = 'filter.v.m.custom.style_filter_color';
const transparency = 'filter.v.m.custom.style_filter_transparency';
const ref = id => `gid://shopify/Metaobject/${id}`;
const fixture = options => execFileSync(process.execPath, ['tests/helpers/quiz-active-filters-renderer.mjs', JSON.stringify(options)], { encoding: 'utf8' });
async function open(page, entries, options = {}) {
  const params = new URLSearchParams(entries);
  await page.goto(`/tests/fixtures/mobile-search.html?${params}`);
  await page.setContent(fixture(options));
  await page.addScriptTag({ url: '/assets/lemoon-collection-plp.js' });
}
const pills = page => page.locator('#ProductGridContainer .lemoon-filter-pill');

for (const [choice, field, ids, labels] of [
  ['neutral', color, [101, 102, 103], ['Color: Cafés', 'Color: Claros', 'Color: Neutros']],
  ['bold', color, [106], ['Color: Colores']],
  ['black', color, [104], ['Color: Negros']],
  ['two_tone', color, [107], ['Color: Bicolor']],
  ['silver', color, [108], ['Color: Plateados']],
  ['tortoise', 'filter.v.m.custom.style_filter_pattern', [109], ['Patrón: Carey']],
  ['transparent', transparency, [105], ['Transparencia: Transparentes']],
]) {
  test(`unindexed ${choice} shows every exact selected value with removable chips`, async ({ page }) => {
    await open(page, [...ids.map(id => [field, ref(id)]), ['sort_by', 'price-ascending']]);
    await expect(pills(page)).toHaveCount(ids.length);
    for (let index = 0; index < ids.length; index++) {
      const chip = page.locator(`.lemoon-filter-pill[data-filter-value="${ref(ids[index])}"]`);
      await expect(chip.locator('span').first()).toHaveText(labels[index]);
      const destination = new URL(await chip.getAttribute('href'), 'https://fixture.test');
      expect(destination.searchParams.getAll(field)).toEqual(ids.filter(id => id !== ids[index]).map(ref));
      expect(destination.searchParams.get('sort_by')).toBe('price-ascending');
    }
    await expect(page.locator('#ProductCount')).toHaveAttribute('data-product-count', '0');
  });
}

test('unindexed selected dictionary values stay removable without dropping other colors or sort', async ({ page }) => {
  await open(page, [[color, ref(101)], [color, ref(102)], [color, ref(103)], [color, ref(104)], ['sort_by', 'price-ascending'], ['page', '3']], { brown: true, unsafeLabel: true });
  await expect(pills(page)).toHaveCount(4);
  await expect(page.locator('[data-applied-filter-count]')).toHaveText('4');
  await expect(page.locator('[data-clear-filters]')).toHaveAttribute('href', /sort_by=price-ascending/);
  for (const id of [101, 102, 103, 104]) {
    const chip = page.locator(`.lemoon-filter-pill[data-filter-value="${ref(id)}"]`);
    const destination = new URL(await chip.getAttribute('href'), 'http://fixture.test');
    expect(destination.searchParams.getAll(color).sort()).toEqual([101, 102, 103, 104].filter(value => value !== id).map(ref).sort());
    expect(destination.searchParams.get('sort_by')).toBe('price-ascending');
    expect(destination.searchParams.has('page')).toBe(false);
  }
  await expect(page.locator('.lemoon-filter-pill img')).toHaveCount(0);
  expect(await page.evaluate(() => window.injected)).toBeUndefined();
});

test('a sole unindexed color reveals its chip and clear action while keeping zero-result content', async ({ page }) => {
  await open(page, [[color, ref(104)]]);
  await expect(pills(page)).toHaveCount(1);
  await expect(page.locator('.lemoon-applied-filters')).toBeVisible();
  await expect(page.locator('[data-plp-has-active-filters]')).toHaveAttribute('data-plp-has-active-filters', 'true');
  await expect(page.locator('[data-clear-filters]')).not.toHaveAttribute('aria-disabled', 'true');
  await expect(page.locator('[data-plp-active-option]')).toHaveCount(1);
  await expect(page.locator('#ProductCount')).toHaveAttribute('data-product-count', '0');
  await expect(page.locator('.collection--empty')).toHaveText('No products');
});

test('only exact dictionary group and ID pairs get supplemental chips', async ({ page }) => {
  await open(page, [[color, ref(105)], [transparency, ref(104)], [color, ref(999)], [transparency, ref(105)], [transparency, ref(105)]]);
  await expect(pills(page)).toHaveCount(1);
  await expect(pills(page)).toContainText('Transparencia: Transparentes');
});

test('new facet responses and history never retain stale supplemental chips or counts', async ({ page }) => {
  await open(page, [[color, ref(104)]]);
  await expect(pills(page)).toHaveCount(1);
  await page.evaluate(() => {
    history.replaceState({}, '', '/collections/all?sort_by=title-ascending');
    document.dispatchEvent(new CustomEvent('lemoon:facets-updated', { detail: { requestId: 2 } }));
  });
  await expect(pills(page)).toHaveCount(0);
  await expect(page.locator('[data-applied-filter-count]')).toBeHidden();
  await expect(page.locator('[data-clear-filters]')).toHaveAttribute('aria-disabled', 'true');
  await expect(page.locator('[data-plp-active-option]')).toHaveCount(0);
});

for (const [label, selected] of [['changed colors', [104, 108]], ['cleared colors', []]]) {
  test(`cached facet rendering uses its rendered selections for ${label}`, async ({ page }) => {
    const initial = [[color, ref(101)], [color, ref(104)], ['sort_by', 'price-ascending']];
    const target = [...selected.map(id => [color, ref(id)]), ['sort_by', 'price-ascending']];
    const initialParams = new URLSearchParams(initial).toString();
    const targetParams = new URLSearchParams(target).toString();
    const responses = {
      [initialParams]: fixture({ pipeline: true, brown: true }),
      [targetParams]: fixture({ pipeline: true }),
    };
    let requests = 0;
    await page.route(url => url.searchParams.has('section_id'), async route => {
      requests++;
      const params = new URL(route.request().url()).searchParams;
      params.delete('section_id');
      await route.fulfill({ status: 200, contentType: 'text/html', body: responses[params.toString()] });
    });
    await open(page, initial, { pipeline: true, brown: true });
    await page.evaluate(() => {
      window.debounce = fn => fn;
      customElements.define('menu-drawer', class extends HTMLElement { bindEvents() {} });
    });
    await page.addScriptTag({ url: '/assets/facets.js' });
    const render = params => page.evaluate(search => new Promise(resolve => {
      document.addEventListener('lemoon:facets-updated', resolve, { once: true });
      FacetFiltersForm.renderPage(search);
    }), params);
    await render(targetParams);
    await render(initialParams);
    expect(requests).toBe(2);
    await render(targetParams);
    expect(requests).toBe(2);
    await expect(pills(page)).toHaveCount(selected.length);
    expect(await pills(page).evaluateAll(nodes => nodes.map(node => node.dataset.filterValue).sort())).toEqual(selected.map(ref).sort());
    for (const id of selected) {
      const chip = page.locator(`.lemoon-filter-pill[data-filter-value="${ref(id)}"]`);
      const destination = new URL(await chip.getAttribute('href'), 'https://fixture.test');
      expect(destination.searchParams.getAll(color)).toEqual(selected.filter(value => value !== id).map(ref));
      expect(destination.searchParams.get('sort_by')).toBe('price-ascending');
    }
    await expect(page.locator('[data-applied-filter-count]')).toHaveText(String(selected.length));
    await expect(page.locator('[data-plp-has-active-filters]')).toHaveAttribute('data-plp-has-active-filters', String(selected.length > 0));
    expect(await page.locator('[data-clear-filters]').getAttribute('aria-disabled')).toBe(selected.length ? null : 'true');
    await page.goBack();
    await expect.poll(() => pills(page).evaluateAll(nodes => nodes.map(node => node.dataset.filterValue).sort())).toEqual([ref(101), ref(104)]);
    await page.goForward();
    await expect.poll(() => pills(page).evaluateAll(nodes => nodes.map(node => node.dataset.filterValue).sort())).toEqual(selected.map(ref).sort());
    expect(requests).toBe(2);
  });
}

test('an incomplete dictionary never invents a partial set of active chips', async ({ page }) => {
  await open(page, [[color, ref(101)], [color, ref(104)]], { brown: true, incomplete: true });
  await expect(pills(page)).toHaveCount(1);
  await expect(pills(page)).toContainText('Color: Cafés');
});

test('supplemental chips retain the native facet-remove keyboard and click handler after refresh', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await open(page, [[color, ref(101)], [color, ref(104)], ['sort_by', 'price-ascending']], { brown: true });
  await page.evaluate(() => {
    window.debounce = fn => fn;
    const form = document.createElement('facet-filters-form');
    form.innerHTML = '<form id="FacetFiltersForm"></form>';
    document.querySelector('.lemoon-plp').prepend(form);
  });
  await page.addScriptTag({ url: '/assets/facets.js' });
  await page.evaluate(() => {
    // Replace the network transport only; use the production custom element handler.
    FacetFiltersForm.renderPage = params => { window.removalParams = params; };
    document.dispatchEvent(new CustomEvent('lemoon:facets-updated', { detail: { requestId: 2 } }));
  });
  const chip = page.locator(`.lemoon-filter-pill[data-filter-value="${ref(104)}"]`);
  await expect(chip).toHaveAttribute('role', 'button');
  await chip.focus();
  await page.keyboard.press('Space');
  expect(new URLSearchParams(await page.evaluate(() => window.removalParams)).getAll(color)).toEqual([ref(101)]);
  await chip.click();
  expect(new URLSearchParams(await page.evaluate(() => window.removalParams)).get('sort_by')).toBe('price-ascending');
  expect(errors).toEqual([]);
});

test('supplemental chips keep the existing desktop and mobile wrapping', async ({ page }) => {
  await open(page, [[color, ref(101)], [color, ref(102)], [color, ref(103)], [color, ref(104)]], { brown: true });
  await page.addStyleTag({ url: '/assets/base.css' });
  await page.addStyleTag({ url: '/assets/lemoon-tokens.css' });
  await page.addStyleTag({ url: '/assets/lemoon-collection-plp.css' });
  for (const [name, width] of [['desktop', 1440], ['mobile', 390]]) {
    await page.setViewportSize({ width, height: 844 });
    await page.mouse.move(width - 1, 843);
    await expect(pills(page)).toHaveCount(4);
    await page.locator('.lemoon-applied-filters').screenshot({ path: `/tmp/lem153-active-chips-${name}.png`, animations: 'disabled' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
});
