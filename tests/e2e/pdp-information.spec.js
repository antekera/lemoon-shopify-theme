import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';

// Use Node's native ESM loader for Liquid fixtures, matching other rendered tests.
const renderFixture = (shell, scenario = 'complete') => execFileSync(process.execPath, ['--input-type=module', '-e', `
  import { renderPdpInformationFixture } from './tests/helpers/pdp-information-renderer.mjs';
  process.stdout.write(renderPdpInformationFixture(${JSON.stringify(shell)}, ${JSON.stringify(scenario)}));
`], { encoding: 'utf8' });

const renderHeroFixture = (sharedGallery = false, mediaCount = 2) => execFileSync(process.execPath, ['--input-type=module', '-e', `
  import { renderStandardPdpHeroFixture, renderDefaultGalleryRevealFixture } from './tests/helpers/pdp-information-renderer.mjs';
  process.stdout.write(${sharedGallery ? 'renderDefaultGalleryRevealFixture' : 'renderStandardPdpHeroFixture'}(${mediaCount}));
`], { encoding: 'utf8' });

const heroGeometry = page => page.evaluate(() => {
  const top = selector => document.querySelector(selector).getBoundingClientRect().top;
  return {
    root: top('.lemoon-standard-pdp'), row: top('.lemoon-standard-pdp .product'),
    gallery: top('media-gallery'), summary: top('.lemoon-product-summary'), information: top('.product__info-wrapper'),
  };
});

async function openHeroFixture(page, width, sharedGallery = false, mediaCount = 2) {
  await page.setViewportSize({ width, height: 900 });
  await page.route('**/tests/fixtures/pdp-hero.html', route => route.fulfill({
    status: 200, contentType: 'text/html', body: renderHeroFixture(sharedGallery, mediaCount),
  }));
  await page.goto('/tests/fixtures/pdp-hero.html');
}

test('standard desktop retains its configured spacing and right-panel reveal', async ({ page }) => {
  await openHeroFixture(page, 1440);
  const information = page.locator('.product__info-wrapper');
  await expect(information).toHaveClass(/animate--slide-in/);
  await expect(information).toHaveCSS('animation-name', 'slideIn');
  await information.evaluate(el => el.classList.remove('scroll-trigger', 'animate--slide-in', 'scroll-trigger--offscreen'));
  await page.locator('.lemoon-product-summary').evaluate(el => el.classList.remove('scroll-trigger', 'animate--slide-in', 'scroll-trigger--offscreen'));
  const geometry = await heroGeometry(page);
  expect(geometry.row - geometry.root).toBeCloseTo(24, 0);
  expect(geometry.gallery - geometry.root).toBeCloseTo(0, 0);
  expect(geometry.summary - geometry.root).toBeCloseTo(24, 0);
  expect(geometry.information).toBeGreaterThanOrEqual(geometry.summary);
});

for (const width of [320, 390]) test(`mobile gallery at ${width}px fills the viewport and previews 10px of the next image`, async ({ page }) => {
  await openHeroFixture(page, width);
  const list = page.locator('.lemoon-standard-pdp .product__media-list');
  const slides = list.locator('.product__media-item');
  await expect(slides).toHaveCount(2);
  const first = await slides.nth(0).boundingBox();
  const second = await slides.nth(1).boundingBox();
  const viewport = await list.boundingBox();
  expect(viewport.x).toBeCloseTo(0, 0);
  expect(viewport.x + viewport.width).toBeCloseTo(width, 0);
  expect(viewport.x + viewport.width - second.x).toBeCloseTo(10, 0);
  expect(first.x).toBeCloseTo(viewport.x, 0);
  await list.evaluate(el => { el.scrollLeft = el.scrollWidth; });
  await expect.poll(() => list.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
});


for (const width of [320, 390]) test(`single mobile gallery image fills ${width}px without a phantom slide`, async ({ page }) => {
  await openHeroFixture(page, width, false, 1);
  const list = page.locator('.lemoon-standard-pdp .product__media-list');
  const slides = list.locator('.product__media-item');
  await expect(slides).toHaveCount(1);
  const viewport = await list.boundingBox();
  const slide = await slides.first().boundingBox();
  expect(viewport.x).toBeCloseTo(0, 0);
  expect(viewport.width).toBeCloseTo(width, 0);
  expect(slide.x).toBeCloseTo(0, 0);
  expect(slide.width).toBeCloseTo(width, 0);
  expect(await list.evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
});

test('mobile gallery responds to a touch swipe', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, viewport: { width: 390, height: 900 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await openHeroFixture(page, 390);
  const list = page.locator('.lemoon-standard-pdp .product__media-list');
  await expect(list).toBeVisible();
  await expect(list.locator('.product__media-item')).toHaveCount(2);
  await list.scrollIntoViewIfNeeded();
  await expect.poll(() => list.evaluate(el => el.scrollWidth - el.clientWidth)).toBeGreaterThan(0);
  // The real gallery fades in on load. Start the touch only when those finite
  // entry animations have completed, so the gesture targets the settled slide.
  await list.evaluate(async el => {
    const animations = el.getAnimations({ subtree: true }).filter(animation => animation.effect?.getComputedTiming().iterations !== Infinity);
    await Promise.all(animations.map(animation => animation.finished.catch(() => {})));
  });
  const box = await list.boundingBox();
  const start = { x: box.x + box.width * .8, y: box.y + box.height * .5 };
  expect(await page.evaluate(({ x, y }) => {
    const list = document.querySelector('.lemoon-standard-pdp .product__media-list');
    return list.contains(document.elementFromPoint(x, y));
  }, start)).toBe(true);
  const cdp = await context.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...start, id: 1 }] });
  for (let step = 1; step <= 8; step++) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: start.x - box.width * .7 * step / 8, y: start.y, id: 1 }] });
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect.poll(() => list.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await context.close();
});

for (const shell of ['standard', 'eyewear']) {
  for (const width of [390, 820, 1440]) {
    test(`${shell} ${width}: details preserve content and reuse the existing size dialog with exact focus return`, async ({ page }, testInfo) => {
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.setViewportSize({ width, height: 900 });
      await page.route('**/tests/fixtures/pdp-information.html', route => route.fulfill({
        status: 200, contentType: 'text/html', body: renderFixture(shell),
      }));
      await page.goto('/tests/fixtures/pdp-information.html');
      if (shell === 'eyewear') {
        // These positions match the current Liquid consumer, rather than the
        // historical fixture's full description after its purchase form.
        expect(await page.locator('.lemoon-pdp-intro').evaluate(el =>
          Boolean(el.compareDocumentPosition(el.parentElement.querySelector('form')) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
        expect(await page.locator('.lemoon-frame-information').evaluate(el =>
          Boolean(el.compareDocumentPosition(document.querySelector('.lemoon-pdp__reviews')) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
        if (width < 750) {
          const geometry = await page.evaluate(() => {
            const box = selector => document.querySelector(selector).getBoundingClientRect();
            return {
              captionBottom: box('.lemoon-pdp__gallery-footer').bottom,
              introTop: box('.lemoon-pdp-intro').top,
              summaryGap: box('.lemoon-pdp__gallery').top - box('.lemoon-mobile-summary').bottom,
            };
          });
          expect(geometry.captionBottom, 'gallery caption must finish before the introduction').toBeLessThanOrEqual(geometry.introTop);
          expect(geometry.summaryGap, 'summary and photo must not overlap').toBeGreaterThanOrEqual(0);
          expect(geometry.summaryGap, 'summary-to-photo spacing must remain bounded').toBeLessThanOrEqual(64);
        }
      }
      const information = page.locator('.lemoon-frame-information');
      await expect(information.getByRole('heading', { name: 'Características del producto' })).toHaveCount(0);
      await expect(information.getByRole('button', { name: 'Cómo elegir tu talla' })).toHaveCount(0);
      const description = information.locator('.lemoon-frame-information__description');
      const tabs = information.locator('.lemoon-size-guide__tabs');
      const descriptionBox = await description.boundingBox();
      const tabsBox = await tabs.boundingBox();
      await expect(information.getByRole('tabpanel', { name: 'Características' }).locator('.lemoon-frame-information__description')).toHaveCount(1);
      expect(descriptionBox.y).toBeGreaterThanOrEqual(tabsBox.y + tabsBox.height);
      const rows = information.locator('.lemoon-size-guide__specs > div');
      const firstSpec = await rows.nth(0).boundingBox();
      const secondSpec = await rows.nth(1).boundingBox();
      if (width >= 750) expect(secondSpec.x).toBeGreaterThan(firstSpec.x);
      else expect(secondSpec.y).toBeGreaterThan(firstSpec.y);
      for (const tab of await information.getByRole('tab').all()) {
        await expect(tab).toHaveCSS('text-transform', 'none');
        expect(parseFloat(await tab.evaluate(element => getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(15);
      }
      await expect(information.locator('.lemoon-frame-information__description')).toContainText('incluye un segundo párrafo');
      await expect(page.locator('.lemoon-pdp-intro')).toContainText('Un marco de acetato para cada día.');
      const confidence = page.locator('.lemoon-pdp-confidence');
      await expect(confidence.getByRole('link', { name: '365 días de garantía para tus lentes' })).toHaveAttribute('href', '/pages/garantias');
      await expect(confidence.getByRole('link', { name: 'Cambios y devoluciones gratis antes de los 30 días' })).toHaveAttribute('href', '/policies/refund-policy');
      await expect(confidence.getByRole('link', { name: 'Envíos a todo Chile' })).toHaveAttribute('href', '/policies/shipping-policy');
      const dimensions = information.locator('[data-mm]');
      await expect(information.getByRole('tab', { name: 'Características', exact: true })).toHaveAttribute('aria-selected', 'true');
      await information.getByRole('tab', { name: 'Características', exact: true }).focus();
      await page.keyboard.press('ArrowRight');
      await expect(information.getByRole('tab', { name: 'Medidas', exact: true })).toBeFocused();
      await expect(information.getByRole('tab', { name: 'Medidas', exact: true })).toHaveAttribute('aria-selected', 'true');
      await expect(dimensions).toHaveCount(5);
      await expect(dimensions.first()).toBeVisible();
      expect(await dimensions.allTextContents()).toEqual(['140 mm', '52 mm', '18 mm', '42 mm', '145 mm']);
      const original = shell === 'eyewear' ? page.locator('[data-open-dialog="size"]') : page.locator('[data-size-open]');
      const dialog = page.locator('.lemoon-size-drawer');
      await expect(dialog).toHaveCount(1);
      await expect(information.locator('.lemoon-frame-information__heading [data-pdp-size-open]')).toHaveCount(0);
      const openers = [original];
      for (const opener of openers) {
        await opener.focus();
        await page.keyboard.press('Enter');
        await expect(dialog).toBeVisible();
        await page.keyboard.press('Tab');
        expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
        await page.keyboard.press('Escape');
        await expect(dialog).not.toBeVisible();
        await expect(opener).toBeFocused();
      }
      await information.getByRole('tab', { name: 'Características', exact: true }).click();
      await expect(information.getByRole('tabpanel', { name: 'Características', exact: true })).toContainText('Acetato');
      if (shell === 'eyewear') {
        await expect(page.locator('.lemoon-pdp__stage')).toBeVisible();
        expect(await page.locator('.lemoon-pdp__stage img').first().evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
        await expect(page.locator('[data-configure]')).toBeVisible();
        await page.locator('.lemoon-pdp__stage [data-open-dialog]').first().click();
        await expect(page.locator('dialog[open]')).toHaveAttribute('data-dialog', /zoom-/);
        await page.keyboard.press('Escape');
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
      expect(errors).toEqual([]);
      await page.evaluate(() => document.activeElement.blur());
      await page.screenshot({ path: testInfo.outputPath(`${shell}-${width}.png`), fullPage: true });
    });
  }
}

for (const width of [390, 1440]) {
  test(`accessory hides lens warranty and retains shipping and returns at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route('**/tests/fixtures/pdp-information.html', route => route.fulfill({
      status: 200, contentType: 'text/html', body: renderFixture('standard', 'accessory'),
    }));
    await page.goto('/tests/fixtures/pdp-information.html');
    const confidence = page.locator('.lemoon-pdp-confidence');
    await expect(confidence.getByRole('link', { name: '365 días de garantía para tus lentes' })).toHaveCount(0);
    await expect(confidence.getByRole('link', { name: 'Cambios y devoluciones gratis antes de los 30 días' })).toHaveAttribute('href', '/policies/refund-policy');
    await expect(confidence.getByRole('link', { name: 'Envíos a todo Chile' })).toHaveAttribute('href', '/policies/shipping-policy');
  });

  test(`product without description keeps its specifications visible and full width at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route('**/tests/fixtures/pdp-information.html', route => route.fulfill({
      status: 200, contentType: 'text/html', body: renderFixture('standard', 'no-description'),
    }));
    await page.goto('/tests/fixtures/pdp-information.html');
    const information = page.locator('.lemoon-frame-information');
    await expect(information.locator('.lemoon-frame-information__description')).toHaveCount(0);
    await expect(information.getByRole('tabpanel', { name: 'Características' })).toContainText('Acetato');
    const layout = await information.locator('.lemoon-frame-information__inner').evaluate(element => {
      const box = element.getBoundingClientRect();
      const details = element.querySelector('.lemoon-frame-information__details').getBoundingClientRect();
      const styles = getComputedStyle(element);
      return { left: box.left + parseFloat(styles.paddingLeft), right: box.right - parseFloat(styles.paddingRight), detailsLeft: details.left, detailsRight: details.right };
    });
    expect(layout.detailsLeft).toBeCloseTo(layout.left, 0);
    expect(layout.detailsRight).toBeCloseTo(layout.right, 0);
    await information.getByRole('tab', { name: 'Medidas' }).click();
    await expect(information.locator('[data-mm]').first()).toBeVisible();
  });
}

test('gallery offset regression is corrected across mobile, tablet and desktop', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.route('**/tests/fixtures/pdp-information.html', route => route.fulfill({
    status: 200, contentType: 'text/html', body: renderFixture('eyewear'),
  }));
  await page.goto('/tests/fixtures/pdp-information.html');
  await expect(page.locator('.lemoon-mobile-summary')).toBeVisible();
  // Restore only the old inherited sticky offset inside this disposable page.
  // Never revert or write the implementation owner's CSS in the shared tree.
  const baseline = await page.addStyleTag({ content: '@media(max-width:989px){.lemoon-pdp__gallery{top:100px}}' });
  const oldGeometry = await page.evaluate(() => ({
    captionBottom: document.querySelector('.lemoon-pdp__gallery-footer').getBoundingClientRect().bottom,
    introTop: document.querySelector('.lemoon-pdp-intro').getBoundingClientRect().top,
  }));
  expect(oldGeometry.captionBottom, 'the original offset reproduces the caption/introduction collision').toBeGreaterThan(oldGeometry.introTop);
  await baseline.evaluate(el => el.remove());
  const currentGeometry = await page.evaluate(() => ({
    captionBottom: document.querySelector('.lemoon-pdp__gallery-footer').getBoundingClientRect().bottom,
    introTop: document.querySelector('.lemoon-pdp-intro').getBoundingClientRect().top,
  }));
  expect(currentGeometry.captionBottom).toBeLessThanOrEqual(currentGeometry.introTop);
  for (const width of [820, 990, 1440, 1521]) {
    await page.setViewportSize({ width, height: 900 });
    const offset = await page.locator('.lemoon-pdp__gallery').evaluate(el =>
      el.getBoundingClientRect().top - el.parentElement.getBoundingClientRect().top);
    expect(offset, `${width}px gallery must begin at its grid row without the inherited 100px offset`).toBeCloseTo(0, 0);
  }
});
