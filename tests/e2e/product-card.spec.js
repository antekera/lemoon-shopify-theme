import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { test, expect } from '@playwright/test';

const cardScript = resolve(process.cwd(), 'assets/lemoon-product-card.js');
const cardStyles = resolve(process.cwd(), 'assets/lemoon-components.css');

async function openCard(page, { offscreen = false } = {}) {
  await page.goto('/tests/fixtures/mobile-search.html');
  await page.setContent(`
    <style>
      .product-card-wrapper { margin-top: ${offscreen ? '1200px' : '0'} !important; }
      .card__media { position: relative; width: 320px; height: 320px; }
      .media { position: relative; width: 100%; height: 100%; }
      .card__inner { position: relative; transform: perspective(1000px); }
      .card__media img { width: 100%; height: 100%; pointer-events: none; }
      .lemoon-product-card__image-link { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
    </style>
    <product-component>
      <div class="product-card-wrapper" data-product-id="42">
        <div class="card__inner">
          <div class="card__media">
            <div class="media media--hover-effect">
              <img src="https://cdn.example/front.jpg" alt="Front">
              <img data-lazy-src="https://cdn.example/diagonal.jpg" data-lazy-srcset="https://cdn.example/diagonal-360.jpg 360w, https://cdn.example/diagonal.jpg 720w" alt="Diagonal" loading="lazy">
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

test('loads the second photo near the viewport and toggles back to the first on the next swipe', async ({ page }) => {
  await openCard(page, { offscreen: true });
  const card = page.locator('.product-card-wrapper');
  const second = page.locator('.card__media .media img').nth(1);
  await expect(second).not.toHaveAttribute('src', /.+/);
  await expect(second).toHaveAttribute('data-lazy-src', 'https://cdn.example/diagonal.jpg');
  await card.scrollIntoViewIfNeeded();
  await expect(second).toHaveAttribute('src', 'https://cdn.example/diagonal.jpg');

  const swipeLeft = async () => {
    const bounds = await page.locator('.card__media .media').boundingBox();
    await page.mouse.move(bounds.x + bounds.width - 30, bounds.y + bounds.height / 2);
    await page.mouse.down();
    await page.mouse.move(bounds.x + 35, bounds.y + bounds.height / 2, { steps: 4 });
    await page.mouse.up();
  };
  await swipeLeft();
  await expect(page.locator('.card__media .media img').first()).toHaveAttribute('alt', 'Amber diagonal');
  await swipeLeft();
  await expect(page.locator('.card__media .media img').first()).toHaveAttribute('alt', 'Amber front');
  await expect(page.locator('.card__media .media img')).toHaveCount(2);
  await expect(page).toHaveURL(/mobile-search\.html$/);
});

test('loads the selected variant second photo on demand', async ({ page }) => {
  await openCard(page);
  await page.locator('.lemoon-product-card__swatch').nth(1).click();
  const media = page.locator('.card__media .media');
  const bounds = await media.boundingBox();
  await page.mouse.move(bounds.x + bounds.width - 30, bounds.y + bounds.height / 2);
  await page.mouse.down();
  await page.mouse.move(bounds.x + 35, bounds.y + bounds.height / 2, { steps: 4 });
  await page.mouse.up();
  await expect(page.locator('.card__media .media img').first()).toHaveAttribute('alt', 'Black diagonal');
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
