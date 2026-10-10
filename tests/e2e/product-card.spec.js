import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { test, expect } from '@playwright/test';

const cardScript = resolve(process.cwd(), 'assets/lemoon-product-card.js');
const cardStyles = resolve(process.cwd(), 'assets/lemoon-components.css');

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

async function swipeLeft(page, bounds) {
  const session = await page.context().newCDPSession(page);
  const x = bounds.x + bounds.width - 30;
  const y = bounds.y + bounds.height / 2;
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x - 70, y }] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x - 140, y }] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await session.detach();
}

async function openCard(page, { offscreen = false, swipeEnabled = true, portrait = false } = {}) {
  await page.goto('/tests/fixtures/mobile-search.html');
  await page.route('https://cdn.example/**', (route) => route.fulfill({
    contentType: 'image/svg+xml',
    body: portrait ? '<svg xmlns="http://www.w3.org/2000/svg" width="960" height="1280"><rect width="960" height="1280" fill="white"/><rect x="50" y="440" width="860" height="400" fill="#172B4D"/></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="#172B4D"/></svg>',
  }));
  await page.setContent(`
    <style>
      .product-card-wrapper { margin-top: ${offscreen ? '1200px' : '0'} !important; }
      .card__media { position: relative; width: 320px; height: 320px; }
      .media { position: relative; width: 100%; height: 100%; }
      .card__inner { position: relative; transform: perspective(1000px); }
      .card__media img { width: 100%; height: 100%; }
      .lemoon-product-card__image-link { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
    </style>
    <product-component>
      <div class="product-card-wrapper" data-product-id="42" ${swipeEnabled ? 'data-enable-gallery-swipe' : ''}>
        <div class="card__inner">
          <div class="card__media">
            <div class="media media--hover-effect">
              <img draggable="false" src="https://cdn.example/front.jpg" alt="Amber front">
              <img draggable="false" data-lazy-src="https://cdn.example/diagonal.jpg" data-lazy-srcset="https://cdn.example/diagonal-360.jpg 360w, https://cdn.example/diagonal.jpg 720w" alt="Diagonal" loading="lazy">
            </div>
            <a class="lemoon-product-card__image-link" href="/products/demo"></a>
          </div>
        </div>
        <div class="card__content">
          <div class="card__information">
            <h3 class="card__heading"><a href="/products/demo">Demo glasses</a></h3>
            <span class="lemoon-product-card__try-on" role="img" aria-label="AR Try On soon"></span>
            <div class="card-information">
              <div class="price price--on-sale">
                <div class="price__regular"><span class="price-item--regular">$89.990</span></div>
                <div class="price__sale"><span><s class="price-item--regular">$119.990</s></span><span class="price-item--sale">$89.990</span></div>
              </div>
              <div class="lemoon-product-card__swatches">
                <button class="lemoon-product-card__swatch is-selected" type="button" aria-pressed="true" data-color-key="amber" data-primary-src="https://cdn.example/front.jpg" data-primary-alt="Amber front" data-secondary-src="https://cdn.example/diagonal.jpg" data-secondary-alt="Amber diagonal" data-variant-url="/products/demo?variant=101" data-price="$89.990" data-compare-price="$119.990"></button>
                <button class="lemoon-product-card__swatch" type="button" aria-pressed="false" data-color-key="black" data-primary-src="https://cdn.example/black-front.jpg" data-primary-alt="Black front" data-secondary-src="https://cdn.example/black-diagonal.jpg" data-secondary-alt="Black diagonal" data-variant-url="/products/demo?variant=202" data-price="$79.990" data-compare-price=""></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </product-component>
  `);
  await page.addStyleTag({ path: cardStyles });
  await page.addScriptTag({ path: cardScript });
}

test('portrait product photos use the card width and stay vertically centered', async ({ page }) => {
  await openCard(page, { portrait: true });
  const image = page.locator('.card__media .media img').first();
  await expect.poll(() => image.evaluate(el => el.naturalWidth)).toBe(960);
  const media = await page.locator('.card__media .media').boundingBox();
  const photo = await image.boundingBox();
  expect(photo.width).toBeCloseTo(media.width, 0);
  expect(photo.width / photo.height).toBeCloseTo(960 / 1280, 2);
  expect(photo.y + photo.height / 2).toBeCloseTo(media.y + media.height / 2, 0);
  await expect(image).toHaveCSS('mix-blend-mode', 'multiply');
});

test('loads the second photo near the viewport and toggles back to the first on the next swipe', async ({ page }) => {
  await openCard(page, { offscreen: true });
  await page.addStyleTag({ content: '.card__content { position: absolute; inset: 0 auto auto 0; width: 320px; height: 320px; z-index: 2; }' });
  const card = page.locator('.product-card-wrapper');
  await expect(page.locator('.card__media .media img').first()).toHaveCSS('object-fit', 'contain');
  await expect(page.locator('.card__media .media img').first()).toHaveCSS('mix-blend-mode', 'multiply');
  const second = page.locator('.card__media .media img').nth(1);
  await expect(second).not.toHaveAttribute('src', /.+/);
  await expect(second).toHaveAttribute('data-lazy-src', 'https://cdn.example/diagonal.jpg');
  await card.scrollIntoViewIfNeeded();
  await expect(second).toHaveAttribute('src', 'https://cdn.example/diagonal.jpg');

  await swipeLeft(page, await page.locator('.card__media .media').boundingBox());
  const media = page.locator('.card__media .media');
  const incoming = media.locator('.lemoon-product-card__slide-layer');
  await expect(incoming).toHaveCSS('transition-property', 'opacity');
  await expect(incoming).toHaveCSS('transition-duration', '0.5s');
  await expect(incoming).toHaveCSS('object-fit', 'contain');
  await expect(incoming).toHaveCSS('mix-blend-mode', 'multiply');
  const incomingElement = await incoming.elementHandle();
  await expect(page.locator('.card__media .media img').first()).toHaveAttribute('alt', 'Amber diagonal');
  expect(await incomingElement.evaluate((element) => element === document.querySelector('.card__media .media img:first-child'))).toBe(true);
  await expect(media.locator('.lemoon-product-card__slide-layer')).toHaveCount(0);
  await swipeLeft(page, await media.boundingBox());
  await expect(page.locator('.card__media .media img').first()).toHaveAttribute('alt', 'Amber front');
  await expect(page.locator('.card__media .media img')).toHaveCount(2);
  await expect(page).toHaveURL(/mobile-search\.html$/);
});

test('loads the selected variant second photo on demand', async ({ page }) => {
  await openCard(page);
  await page.locator('.lemoon-product-card__swatch').nth(1).click();
  const media = page.locator('.card__media .media');
  const bounds = await media.boundingBox();
  await swipeLeft(page, bounds);
  await expect(page.locator('.card__media .media img').first()).toHaveAttribute('alt', 'Black diagonal');
});

test('does not enable image swiping in product carousels', async ({ page }) => {
  await openCard(page, { swipeEnabled: false });
  const image = page.locator('.card__media .media img').first();
  await expect(image).toHaveAttribute('alt', 'Amber front');
  const bounds = await page.locator('.card__media .media').boundingBox();
  await page.locator('.product-card-wrapper').dispatchEvent('pointerdown', {
    pointerId: 1, pointerType: 'touch', button: 0,
    clientX: bounds.x + bounds.width - 30, clientY: bounds.y + bounds.height / 2,
  });
  await page.locator('.product-card-wrapper').dispatchEvent('pointerup', {
    pointerId: 1, pointerType: 'touch', button: 0,
    clientX: bounds.x + 35, clientY: bounds.y + bounds.height / 2,
  });
  await expect(image).toHaveAttribute('alt', 'Amber front');
  await expect(page).toHaveURL(/mobile-search\.html$/);
});

test('selecting a color updates the gallery, selected state, price and product variant URL', async ({ page }) => {
  await openCard(page);
  await page.locator('.lemoon-product-card__swatch').nth(1).click();

  await expect(page.locator('.lemoon-product-card__swatch').nth(1)).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.card__media .media img').first()).toHaveAttribute('alt', 'Black front');
  await expect(page.locator('.price__regular .price-item--regular')).toHaveText('$79.990');
  await expect(page.locator('.price')).not.toHaveClass(/price--on-sale/);
  await expect(page.locator('.card__heading a')).toHaveAttribute('href', '/products/demo?variant=202');
});

test('clicking non-control content in the card opens its product page', async ({ page }) => {
  await page.route('**/products/demo**', (route) => route.fulfill({ status: 200, contentType: 'text/html', body: 'Product page' }));
  await openCard(page);
  await page.locator('.price').click();

  await expect(page).toHaveURL(/\/products\/demo\?variant=101$/);
  await expect(page.locator('body')).toHaveText('Product page');
});
