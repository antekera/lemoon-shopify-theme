import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';

function fixture(shell) {
  return execFileSync(process.execPath, ['--input-type=module', '-e', `
    import { renderStandardPdpHeroFixture, renderEyewearSsrFixture } from './tests/helpers/pdp-information-renderer.mjs';
    process.stdout.write(${shell === 'standard' ? 'renderStandardPdpHeroFixture()' : 'renderEyewearSsrFixture()'});
  `], { encoding: 'utf8' });
}

function standardWithBlocks(blocks, mediaCount = 2) {
  return execFileSync(process.execPath, ['--input-type=module', '-e', `
    import { renderStandardPdpHeroFixture } from './tests/helpers/pdp-information-renderer.mjs';
    process.stdout.write(renderStandardPdpHeroFixture(${mediaCount}, ${JSON.stringify(blocks)}));
  `], { encoding: 'utf8' });
}

for (const shell of ['standard', 'eyewear']) {
  for (const width of [390, 750, 990, 1440]) {
    test(`${shell} SSR has one heading, price and favourite slot at ${width}px without JS`, async ({ browser, baseURL }) => {
      const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width, height: 900 } });
      const page = await context.newPage();
      await page.route('**/tests/fixtures/ssr-probe.html', route => route.fulfill({ contentType: 'text/html; charset=utf-8', body: fixture(shell) }));
      await page.goto(`${baseURL}/tests/fixtures/ssr-probe.html`);
      const summary = page.locator('.lemoon-product-summary');
      const gallery = page.locator(shell === 'standard' ? '.product__media-wrapper' : '.lemoon-pdp__gallery');
      await expect(summary).toBeVisible();
      await expect(summary.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(summary.locator('[data-product-favourite-slot]')).toHaveCount(1);
      await expect(summary.locator(shell === 'standard' ? '[id^="price-"]' : '[data-price]')).toHaveCount(1);
      const summaryBox = await summary.boundingBox();
      const galleryBox = await gallery.boundingBox();
      if (width < 750) expect(summaryBox.y + summaryBox.height).toBeLessThanOrEqual(galleryBox.y + 1);
      else expect(summaryBox.x).toBeGreaterThan(galleryBox.x);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await context.close();
    });
  }
}

test('optical variant changes update the single server-rendered price and preserve focus', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const body = fixture('eyewear').replace(/(<script type="application\/json" data-variants>)([\s\S]*?)(<\/script>)/, (_, start, json, end) => {
    const variants = JSON.parse(json);
    const blue = variants.find(variant => variant.id === 67616399720616);
    if (!blue) throw new Error('Blue fixture variant missing');
    blue.price = 4500000;
    blue.formattedPrice = '$45.000';
    return start + JSON.stringify(variants) + end;
  });
  await page.route('**/tests/fixtures/ssr-probe.html', route => route.fulfill({ contentType: 'text/html; charset=utf-8', body }));
  await page.goto('/tests/fixtures/ssr-probe.html');
  const price = page.locator('.lemoon-product-summary [data-price]');
  await expect(price).toHaveText('$39.900');
  const azul = page.getByLabel('Azul', { exact: true });
  await azul.focus();
  await page.keyboard.press('Space');
  await expect(page.locator('[name="id"]').first()).toHaveValue('67616399720616');
  await expect(price).toHaveCount(1);
  await expect(price).toHaveText('$45.000');
  await expect(azul).toBeFocused();
});

test('standard product controller updates the unique SSR price after a variant section fetch', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.route('**/tests/fixtures/ssr-probe.html', route => route.fulfill({ contentType: 'text/html; charset=utf-8', body: fixture('standard') }));
  await page.route('**/products/synthetic-model?section_id=hero-fixture&option_values=99', route => route.fulfill({
    contentType: 'text/html; charset=utf-8',
    body: '<product-info><variant-selects><script type="application/json" data-selected-variant>{"id":99,"available":true}</script></variant-selects><div id="price-hero-fixture"><span>$45.000</span></div></product-info>',
  }));
  await page.goto('/tests/fixtures/ssr-probe.html');
  await page.evaluate(() => {
    window.PUB_SUB_EVENTS = { optionValueSelectionChange: 'option', variantChange: 'variant' };
    window.subscribe = (_, callback) => { window.fixtureOptionChange = callback; return () => {}; };
    window.publish = () => {};
    window.HTMLUpdateUtility = { viewTransition: () => {} };
    window.variantStrings = { soldOut: 'Agotado' };
    const picker = document.createElement('variant-selects');
    picker.innerHTML = '<label><input type="radio" id="variant-99" name="fixture-color">Azul</label>';
    picker.resolvePendingSelectPromise = () => {};
    document.querySelector('product-info').append(picker);
    picker.querySelector('input').addEventListener('change', event => window.fixtureOptionChange({ data: { event, target: event.target, selectedOptionValues: ['99'] } }));
  });
  await page.addScriptTag({ url: '/assets/product-info.js' });
  const price = page.locator('.lemoon-product-summary #price-hero-fixture');
  await expect(price).not.toContainText('$45.000');
  await page.getByLabel('Azul', { exact: true }).check();
  await expect(price).toHaveText('$45.000');
  await expect(page.locator('#price-hero-fixture')).toHaveCount(1);
  await expect(page).toHaveURL(/variant=99/);
});

for (const shell of ['standard', 'eyewear']) for (const width of [390, 1440]) {
  test(`${shell} initial summary and gallery do not move when PDP tools load at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const html = fixture(shell).replace('<script type="module" src="/assets/lemoon-pdp-tools.js"></script>', '');
    await page.route('**/tests/fixtures/ssr-probe.html', route => route.fulfill({ contentType: 'text/html; charset=utf-8', body: html }));
    await page.goto('/tests/fixtures/ssr-probe.html');
    const summary = page.locator('.lemoon-product-summary');
    const gallery = page.locator(shell === 'standard' ? '.product__media-wrapper' : '.lemoon-pdp__gallery');
    await expect(summary).toBeVisible();
    await summary.evaluate(async el => Promise.all(el.getAnimations({ subtree: true }).map(animation => animation.finished.catch(() => {}))));
    const before = { summary: await summary.boundingBox(), gallery: await gallery.boundingBox() };
    await page.evaluate(() => {
      window.fixtureLayoutShift = 0;
      if (PerformanceObserver.supportedEntryTypes.includes('layout-shift')) {
        new PerformanceObserver(list => {
          for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.fixtureLayoutShift += entry.value;
        }).observe({ type: 'layout-shift', buffered: false });
      }
    });
    await page.evaluate(() => import('/assets/lemoon-pdp-tools.js'));
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const after = { summary: await summary.boundingBox(), gallery: await gallery.boundingBox() };
    expect(after.summary.y).toBeCloseTo(before.summary.y, 0);
    expect(after.summary.height).toBeCloseTo(before.summary.height, 0);
    expect(after.gallery.y).toBeCloseTo(before.gallery.y, 0);
    // Vitals is asynchronous in the storefront; simulate its real wrapper
    // arriving after the PDP controller without introducing a second button.
    await page.locator('[data-product-favourite-slot]').evaluate(slot => {
      slot.innerHTML = '<div class="Vtl-WishlistIcon__ProductPageWrapper"><div class="Vtl-WishlistButton__WishlistIconButton" role="button" aria-label="Añadir a favoritos"></div></div>';
    });
    const afterFavourite = { summary: await summary.boundingBox(), gallery: await gallery.boundingBox() };
    expect(afterFavourite.summary.height).toBeCloseTo(before.summary.height, 0);
    expect(afterFavourite.gallery.y).toBeCloseTo(before.gallery.y, 0);
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    // The existing desktop gallery bleed expands horizontally when PDP tools
    // initialize. Keep it in the measured total while guarding against the
    // former large vertical summary insertion.
    expect(await page.evaluate(() => window.fixtureLayoutShift)).toBeLessThan(width >= 990 ? 0.02 : 0.001);
    await expect(page.locator('.lemoon-product-summary')).toHaveCount(1);
  });
}

for (const shell of ['standard', 'eyewear']) for (const width of [390, 1440]) {
  test(`${shell} heading actions and price stay in place while Vitals loads at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const html = fixture(shell).replace('<script type="module" src="/assets/lemoon-pdp-tools.js"></script>', '');
    await page.route('**/tests/fixtures/ssr-probe.html', route => route.fulfill({ contentType: 'text/html; charset=utf-8', body: html }));
    await page.goto('/tests/fixtures/ssr-probe.html');
    const summary = page.locator('.lemoon-product-summary');
    const price = summary.locator(shell === 'standard' ? '[id^="price-"] .price__container' : '[data-price]');
    const slot = summary.locator('[data-product-favourite-slot]');
    const share = summary.locator('[data-product-share]');
    await expect(price).toBeVisible();
    await summary.evaluate(async el => Promise.all(el.getAnimations({ subtree: true }).map(animation => animation.finished.catch(() => {}))));
    const firstPrice = await price.boundingBox();
    const initialSlot = await slot.boundingBox();
    expect(initialSlot).not.toBeNull();
    expect(initialSlot.width).toBeGreaterThanOrEqual(44);
    expect(initialSlot.height).toBeGreaterThanOrEqual(44);
    await page.evaluate(() => import('/assets/lemoon-pdp-tools.js'));
    const shareBefore = width >= 750 ? await share.boundingBox() : null;
    await slot.evaluate(node => {
      node.innerHTML = '<div class="Vtl-WishlistIcon__ProductPageWrapper"><div class="Vtl-WishlistButton__WishlistIconButton" role="button" aria-label="Añadir a favoritos"></div></div>';
    });
    const finalPrice = await price.boundingBox();
    expect(finalPrice.y).toBeCloseTo(firstPrice.y, 0);
    if (width >= 750) {
      expect(shareBefore).not.toBeNull();
      const shareAfter = await share.boundingBox();
      expect(shareAfter.x).toBeCloseTo(shareBefore.x, 0);
      expect(shareAfter.y).toBeCloseTo(shareBefore.y, 0);
    }
  });
}

test('editor blocks before, between and after title/price render once in their configured order', async ({ page }) => {
  const blocks = [
    { type: 'text', id: 'before', settings: { text: 'Texto anterior' } },
    { type: '@app', id: 'app-before', settings: { test_content: 'App anterior' } },
    { type: 'title', id: 'title', settings: {} },
    { type: 'text', id: 'between', settings: { text: 'Texto intermedio' } },
    { type: 'price', id: 'price', settings: {} },
    { type: '@app', id: 'app-after', settings: { test_content: 'App posterior' } },
  ];
  await page.route('**/tests/fixtures/ssr-probe.html', route => route.fulfill({ contentType: 'text/html; charset=utf-8', body: standardWithBlocks(blocks) }));
  await page.goto('/tests/fixtures/ssr-probe.html');
  const summary = page.locator('.lemoon-product-summary');
  const details = page.locator('.product__info-container');
  for (const label of ['Texto anterior', 'App anterior', 'Texto intermedio', 'App posterior']) await expect(page.getByText(label, { exact: true })).toHaveCount(1);
  await expect(summary).toContainText('Texto anterior');
  await expect(summary).toContainText('App anterior');
  await expect(summary).toContainText('Texto intermedio');
  await expect(details).toContainText('App posterior');
  const order = await page.evaluate(() => {
    const product = document.querySelector('.lemoon-standard-pdp .product');
    const targets = [product.querySelector('.product__text'), product.querySelector('[data-test-app="app-before"]'), product.querySelector('h1'), [...product.querySelectorAll('.product__text')][1], product.querySelector('[id^="price-"]'), product.querySelector('[data-test-app="app-after"]')];
    return targets.every((node, index) => index === 0 || Boolean(targets[index - 1].compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING));
  });
  expect(order).toBe(true);
});

test('no title or price blocks keeps other blocks once after the gallery even without media', async ({ page }) => {
  const blocks = [{ type: 'text', id: 'only', settings: { text: 'Texto sin título' } }];
  await page.route('**/tests/fixtures/ssr-probe.html', route => route.fulfill({ contentType: 'text/html; charset=utf-8', body: standardWithBlocks(blocks, 0) }));
  await page.goto('/tests/fixtures/ssr-probe.html');
  await expect(page.getByText('Texto sin título', { exact: true })).toHaveCount(1);
  await expect(page.locator('.product__info-container')).toContainText('Texto sin título');
  await expect(page.locator('.product__media-wrapper')).toHaveCount(1);
});
