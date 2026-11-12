import { test, expect } from '@playwright/test';
import { doubleRenderedText } from '../helpers/text-resize.mjs';
const sizes = [[390, 844], [749, 900], [750, 900], [820, 1180], [1440, 1000]];
const mobileKinds = ['generic', 'nav', 'cart', 'facets', 'pickup', 'pdp'];
async function openSurface(page, kind) {
  await page.goto(kind === 'pdp' ? '/tests/fixtures/size-guide.html?shell=standard&scenario=complete' : `/tests/fixtures/shared-drawers.html?kind=${kind}`);
  await page.evaluate(() => document.fonts.ready);
  let opener, panel;
  if (kind === 'generic') { opener = page.locator('#OpenGeneric'); panel = page.locator('dialog.lemoon-drawer'); }
  if (kind === 'nav') { opener = page.locator('[data-lemoon-nav-open]:visible'); panel = page.locator('[data-lemoon-nav]'); }
  if (kind.startsWith('cart')) { opener = page.locator('#cart-icon-bubble'); panel = page.locator('.drawer__inner'); }
  if (kind === 'facets') { opener = page.locator('menu-drawer > details > summary'); panel = page.locator('.mobile-facets__inner'); }
  if (kind === 'pickup') { opener = page.locator('#ShowPickupAvailabilityDrawer'); panel = page.locator('pickup-availability-drawer'); }
  if (kind === 'pdp') { opener = page.getByRole('button', { name: 'Guía de medidas', exact: true }); panel = page.getByRole('dialog', { name: 'Guía de medidas', includeHidden: true }); }
  await opener.click();
  if (kind.startsWith('cart')) await expect.poll(() => panel.evaluate(element => element === document.activeElement || element.contains(document.activeElement))).toBe(true);
  return { panel, opener };
}
async function expectClosed(page, kind, panel) {
  if (kind === 'nav') await expect(panel).toHaveAttribute('aria-hidden', 'true');
  else if (kind.startsWith('cart')) await expect(page.locator('cart-drawer')).not.toHaveClass(/\bactive\b/);
  else if (kind === 'facets') await expect(page.locator('menu-drawer > details')).not.toHaveAttribute('open');
  else if (kind === 'pickup') await expect(panel).not.toHaveAttribute('open');
  else await expect(panel).not.toHaveAttribute('open');
}
async function geometry(panel, width, height, kind) {
  if (kind === 'nav') {
    await expect.poll(() => panel.evaluate(element => Math.round(element.getBoundingClientRect().x))).toBe(0);
    const box = await panel.boundingBox();
    const top = await panel.evaluate(element => parseFloat(element.style.getPropertyValue('--lemoon-nav-top')));
    expect(box.y).toBeCloseTo(top, 0);
    expect(box.width).toBeCloseTo(Math.min(width * .9, 380), 0);
    expect(Math.round(box.y + box.height)).toBe(height);
    await expect(panel).toHaveCSS('border-top-left-radius', '0px');
    await expect(panel).toHaveCSS('border-top-right-radius', '0px');
  } else if (width <= 749) {
    await expect.poll(() => panel.evaluate(element => Math.round(element.getBoundingClientRect().bottom))).toBe(height);
    const box = await panel.boundingBox();
    expect(Math.round(box.x)).toBe(0); expect(Math.round(box.width)).toBe(width); expect(box.y).toBeGreaterThanOrEqual(32);
    expect(Math.round(box.y)).toBe(32);
    await expect(panel).toHaveCSS('border-top-left-radius', '16px');
    await expect(panel).toHaveCSS('border-top-right-radius', '16px');
  } else if (kind !== 'generic') {
    await expect.poll(() => panel.evaluate(element => Math.round(element.getBoundingClientRect().right))).toBe(width);
    await expect.poll(() => panel.evaluate(element => Math.round(element.getBoundingClientRect().bottom))).toBe(height);
    const box = await panel.boundingBox(); expect(Math.round(box.y)).toBe(0);
    expect(Math.round(box.width)).toBe(kind === 'pdp' ? 480 : kind.startsWith('cart') ? 400 : 375);
  }
  expect(await panel.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
}
function closeControl(page, kind, panel) {
  if (kind === 'generic') return page.locator('#CloseGeneric');
  if (kind === 'nav') return page.locator('[data-lemoon-nav-open]:visible');
  if (kind.startsWith('cart')) return panel.locator('.drawer__close:visible');
  if (kind === 'facets') return page.locator('.mobile-facets__close');
  if (kind === 'pickup') return panel.locator('.pickup-availability-drawer-button');
  return panel.getByRole('button', { name: 'Cerrar guía de medidas', exact: true });
}
for (const kind of ['generic', 'cart', 'facets', 'pickup', 'pdp']) for (const [width, height] of sizes) {
  test(`${kind}: ${width}px shared mobile geometry and preserved desktop owner, Escape and return`, async ({ page }, testInfo) => {
    const errors = [], mutations = []; page.on('pageerror', error => errors.push(error.message)); page.on('request', request => { if (!['GET', 'HEAD'].includes(request.method())) mutations.push(request.url()); });
    await page.setViewportSize({ width, height }); const { panel, opener } = await openSurface(page, kind);
    await geometry(panel, width, height, kind);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    if (kind === 'generic') await expect(panel).not.toHaveClass(/lemoon-size-drawer/);
    await expect(closeControl(page, kind, panel)).toBeInViewport();
    if (kind === 'facets') {
      const form = page.locator('#FacetFiltersFormMobile'); const before = await form.evaluate(element => [...new FormData(element)]);
      const scroll = panel.locator('.mobile-facets__main'); await scroll.evaluate(element => element.scrollTop = element.scrollHeight);
      await expect(panel.locator('.mobile-facets__footer')).toBeInViewport();
      expect(await form.evaluate(element => [...new FormData(element)])).toEqual(before);
    }
    if (kind === 'cart') {
      await expect(panel.locator('.cart-item')).toHaveCount(8);
      await expect(panel.locator('.drawer__footer')).toBeInViewport();
    }
    if (width === 390 && ['generic', 'cart', 'facets'].includes(kind)) await page.screenshot({ path: testInfo.outputPath(`${kind}-390.png`) });
    await page.keyboard.press('Escape'); await expectClosed(page, kind, panel); await expect(opener).toBeFocused();
    expect(errors).toEqual([]); expect(mutations).toEqual([]);
  });
}
test('PLP hides seven facet groups, retains URL filters and aligns the mobile close control', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/tests/fixtures/shared-drawers.html?kind=facets-plp&filter.v.m.custom.style_filter_presence=compact');
  const drawer = page.locator('menu-drawer');
  await expect(drawer.locator('[data-facet-accordion]')).toHaveCount(7);
  await drawer.locator('details.mobile-facets__disclosure > summary').click();
  const panel = drawer.locator('.mobile-facets__inner');
  await expect.poll(() => panel.evaluate(element => Math.round(element.getBoundingClientRect().top))).toBe(32);
  const heading = await panel.locator('.mobile-facets__heading:visible').boundingBox();
  const close = await drawer.locator('.mobile-facets__close').boundingBox();
  expect(Math.abs((heading.y + heading.height / 2) - (close.y + close.height / 2))).toBeLessThanOrEqual(2);
  await expect(drawer.locator('.mobile-facets__close')).toBeInViewport();
  const params = await page.locator('#FacetFiltersFormMobile').evaluate(form => new URLSearchParams(form.closest('facet-filters-form').createSearchParams(form)).getAll('filter.v.m.custom.style_filter_presence'));
  expect(params).toEqual(['compact']);
  await drawer.locator('.mobile-facets__close').click();
  await expect(drawer.locator('details.mobile-facets__disclosure')).not.toHaveAttribute('open');
});
for (const width of [390, 749]) {
  test(`nav: ${width}px native header toolbar, back, close, overlay and focus`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 844 }); const { panel, opener } = await openSurface(page, 'nav');
    await geometry(panel, width, 844, 'nav'); const close = closeControl(page, 'nav', panel);
    await expect(close).toBeInViewport();
    await expect(panel.locator('[data-lemoon-nav-close], [data-lemoon-nav-back]')).toHaveCount(0);
    const firstCategory = panel.locator('[data-lemoon-nav-target]').first();
    await expect(firstCategory).toBeFocused();
    await firstCategory.click();
    await expect(close).toHaveAttribute('data-nav-state', 'sub');
    await expect(panel.locator('[data-lemoon-nav-panel]:visible a').first()).toBeFocused();
    for (const key of ['Tab', 'Shift+Tab']) for (let step = 0; step < 18; step++) { await page.keyboard.press(key); expect(await panel.evaluate(element => element.contains(document.activeElement) || document.activeElement.matches('[data-lemoon-nav-open]'))).toBe(true); }
    await close.click(); await expect(panel.locator('[data-lemoon-nav-root]')).toBeVisible();
    await expect(close).toHaveAttribute('data-nav-state', 'root');
    await expect(panel.locator('.is-leaving')).toHaveCount(0);
    await page.screenshot({ path: testInfo.outputPath(`nav-${width}.png`) });
    await close.click(); await expectClosed(page, 'nav', panel); await expect(opener).toBeFocused();
    await opener.click(); await page.mouse.click(width - 8, (await panel.boundingBox()).y + 20); await expectClosed(page, 'nav', panel); await expect(opener).toBeFocused();
    await opener.click(); await page.keyboard.press('Escape'); await expectClosed(page, 'nav', panel); await expect(opener).toBeFocused();
  });
}
for (const width of [390, 749]) {
  test(`nav: ${width}px opening and every close slide horizontally from the left`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 844 });
    const { panel, opener } = await openSurface(page, 'nav');
    await geometry(panel, width, 844, 'nav');
    const top = (await panel.boundingBox()).y;
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
    async function record(action) {
      await panel.evaluate(element => {
        window.navMotionFrames = new Promise(resolve => {
          const start = performance.now(), frames = [];
          function tick() {
            const box = element.getBoundingClientRect(), style = getComputedStyle(element);
            frames.push({ elapsed: performance.now() - start, x: box.x, y: box.y, width: box.width, visibility: style.visibility });
            if (performance.now() - start < 500) requestAnimationFrame(tick);
            else resolve(frames);
          }
          requestAnimationFrame(tick);
        });
      });
      await action();
      return page.evaluate(() => window.navMotionFrames);
    }
    for (const action of ['button', 'Escape', 'backdrop']) {
      const opening = await record(() => opener.click());
      await geometry(panel, width, 844, 'nav');
      const closing = await record(() => action === 'button' ? closeControl(page, 'nav', panel).click() :
        action === 'Escape' ? page.keyboard.press('Escape') : page.mouse.click(width - 8, top + 20));
      await testInfo.attach(`${action}-frames.json`, { body: JSON.stringify({ opening, closing }), contentType: 'application/json' });
      for (const [frames, direction] of [[opening, 1], [closing, -1]]) {
        const moving = frames.filter(frame => frame.visibility === 'visible' && frame.x < -2 && frame.x > -frame.width + 2);
        expect(moving.length).toBeGreaterThanOrEqual(3);
        for (let index = 0; index < moving.length; index++) {
          expect(moving[index].y).toBeCloseTo(top, 0);
          if (index) expect((moving[index].x - moving[index - 1].x) * direction).toBeGreaterThan(0);
        }
      }
      expect(opening.at(-1).x).toBeCloseTo(0, 0);
      expect(closing.at(-1).x).toBeLessThanOrEqual(-closing.at(-1).width);
      await expect(panel).toBeHidden();
      await expect(opener).toBeFocused();
    }
  });
}
test('nav: actual mobile-only opener closes safely when resizing to desktop', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); const { panel } = await openSurface(page, 'nav');
  await page.setViewportSize({ width: 750, height: 900 }); await expectClosed(page, 'nav', panel);
  await expect(panel).toHaveAttribute('inert', ''); expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
  expect(await page.locator('.lemoon-header').evaluate(element => element.contains(document.activeElement))).toBe(true);
  for (const width of [820, 1440]) { await page.setViewportSize({ width, height: 1000 }); await expect(page.locator('[data-lemoon-nav-open]')).toBeHidden(); }
});
for (const [width, height] of [[390, 844], [1440, 1000]]) test(`empty cart: ${width}px native empty close and return`, async ({ page }) => {
  await page.setViewportSize({ width, height }); const { panel, opener } = await openSurface(page, 'cart-empty');
  await geometry(panel, width, height, 'cart-empty'); await expect(page.locator('cart-drawer')).toHaveClass(/is-empty/);
  await expect(panel.locator('.drawer__inner-empty')).toBeVisible(); await expect(closeControl(page, 'cart-empty', panel)).toBeInViewport();
  await closeControl(page, 'cart-empty', panel).click(); await expectClosed(page, 'cart-empty', panel); await expect(opener).toBeFocused();
});
test('pickup: top backdrop prevents click-through and is removed on close and disconnect', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); const { panel, opener } = await openSurface(page, 'pickup');
  await geometry(panel, 390, 844, 'pickup'); await expect(page.locator('.lemoon-drawer-backdrop')).toHaveCount(1);
  await page.mouse.click(195, 16); await expectClosed(page, 'pickup', panel); await expect(opener).toBeFocused();
  expect(await page.evaluate(() => window.fixtureUnderlayClicks)).toBe(0); await expect(page.locator('.lemoon-drawer-backdrop')).toHaveCount(0);
  await opener.click(); await expect(page.locator('.lemoon-drawer-backdrop')).toHaveCount(1); await panel.evaluate(element => element.remove());
  await expect(page.locator('.lemoon-drawer-backdrop')).toHaveCount(0);
});
for (const kind of mobileKinds) test(`${kind}: 320px doubled text stays readable with usable close`, async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 }); await page.emulateMedia({ reducedMotion: 'reduce' }); const { panel } = await openSurface(page, kind);
  const text = await doubleRenderedText(panel); expect(text.length).toBeGreaterThan(2); for (const size of text) expect(size.after).toBeCloseTo(size.before * 2, 3);
  await geometry(panel, 320, 844, kind); await expect(closeControl(page, kind, panel)).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});
for (const kind of [...mobileKinds, 'cart-empty']) test(`${kind}: reduced-motion keeps native keyboard and close behavior`, async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.emulateMedia({ reducedMotion: 'reduce' }); const { panel, opener } = await openSurface(page, kind);
  await geometry(panel, 390, 844, kind); await expect(panel).toHaveCSS('transition-duration', '0s');
  if (kind !== 'facets') for (const key of ['Tab', 'Shift+Tab']) for (let step = 0; step < 6; step++) { await page.keyboard.press(key); expect(await panel.evaluate((element, nav) => element === document.activeElement || element.contains(document.activeElement) || (nav && document.activeElement.matches('[data-lemoon-nav-open]')), kind === 'nav')).toBe(true); }
  if (kind.startsWith('cart')) {
    const first = closeControl(page, kind, panel);
    const last = kind === 'cart-empty' ? panel.getByRole('link', { name: 'Seguir comprando' }) : panel.locator('#CartDrawer-Checkout');
    await last.focus(); await page.keyboard.press('Tab'); await expect(first).toBeFocused();
    await page.keyboard.press('Shift+Tab'); await expect(last).toBeFocused();
  }
  await page.keyboard.press('Escape'); await expectClosed(page, kind, panel); await expect(opener).toBeFocused();
});
