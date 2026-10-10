import { test, expect } from '@playwright/test';
import { storefrontRequest } from '../helpers/storefront-request.mjs';
import { openStorefrontPage } from '../helpers/storefront-page.mjs';

const productPath = process.env.STOREFRONT_CART_PRODUCT || '/products/lemoon-colca';

async function addLine(page, properties = {}) {
  const response = await storefrontRequest(page).get(`${productPath}.js`);
  expect(response.ok()).toBeTruthy();
  const product = await response.json();
  const variant = product.variants.find((item) => item.available);
  expect(variant, 'a real available variant is required').toBeTruthy();
  const added = await storefrontRequest(page).post('/cart/add.js', { data: { items: [{ id: variant.id, quantity: 1, properties }] } });
  expect(added.ok()).toBeTruthy();
  return product;
}

test.beforeEach(async ({ page }) => {
  expect((await storefrontRequest(page).post('/cart/clear.js')).ok()).toBeTruthy();
});

test.afterEach(async ({ page }) => { await storefrontRequest(page).post('/cart/clear.js'); });

test('empty cart has one heading, a catalogue route and no sample accessories', async ({ page }) => {
  await openStorefrontPage(page, '/cart');
  await expect(page.locator('#MainContent h1:visible')).toHaveCount(1);
  await expect(page.locator('.cart__warnings a.button')).toHaveAttribute('href', '/collections/all');
  await expect(page.locator('.lemoon-cart-upsell')).toHaveCount(0);
  await expect(page.locator('#checkout')).toBeHidden();
});

test('quantity updates preserve properties, totals and accessible removal', async ({ page }, testInfo) => {
  const product = await addLine(page, { Uso: 'Monofocal', _private: 'do-not-display' });
  await openStorefrontPage(page, '/cart');
  await expect(page.locator('.cart-item__name')).toHaveText(product.title);
  await expect(page.locator('.cart-item__details')).toContainText('Monofocal');
  await expect(page.locator('.cart-item__details')).not.toContainText('do-not-display');
  await expect(page.locator('[data-cart-count]')).toHaveText('1 producto');
  const quantity = page.locator('.quantity__input');
  await quantity.fill('2');
  await quantity.press('Tab');
  await expect(page.locator('[data-cart-count]')).toHaveText('2 productos');
  const cart = await (await storefrontRequest(page).get('/cart.js')).json();
  expect(cart.items[0].properties.Uso).toBe('Monofocal');
  expect(cart.item_count).toBe(2);
  const quantities = await page.locator('.quantity__input').evaluateAll((inputs) => inputs.map((input) => Number(input.value)));
  expect(quantities).toEqual(cart.items.map((item) => item.quantity));
  const summary = page.locator('.lemoon-cart-summary');
  const summaryBox = await summary.boundingBox();
  const itemsBox = await page.locator('cart-items').boundingBox();
  if (testInfo.project.name === 'desktop') expect(summaryBox.x).toBeGreaterThan(itemsBox.x + itemsBox.width);
  else expect(summaryBox.y).toBeGreaterThan(itemsBox.y);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await expect(page.locator('#checkout')).toHaveAttribute('form', 'cart');
  await expect(page.locator('#checkout')).toHaveAttribute('name', 'checkout');
  const formattedTotal = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(cart.total_price / 100);
  await expect(summary.locator('.totals__total-value')).toHaveText(formattedTotal);
  // Shopify's automatic discount can split one quantity into separate lines.
  // Remove each real line and wait for the server count after each mutation.
  for (let count = cart.item_count; count > 0;) {
    const quantity = Number(await page.locator('.quantity__input').first().inputValue());
    await page.locator('.cart-item cart-remove-button a').first().click();
    count -= quantity;
    if (count > 0) await expect(page.locator('[data-cart-count]')).toHaveText(`${count} ${count === 1 ? 'producto' : 'productos'}`);
    else await expect(page.locator('.cart__warnings')).toBeVisible();
  }
  await expect(page.locator('.cart__warnings')).toBeVisible();
  await expect(page.locator('.cart__warnings a.button')).toBeFocused();
});

test('server rejection restores quantity and announces an actionable error', async ({ page }) => {
  await addLine(page);
  await openStorefrontPage(page, '/cart');
  await page.route('**/cart/change*', (route) => route.fulfill({ status: 422, contentType: 'application/json', body: JSON.stringify({ errors: 'No hay más unidades disponibles.' }) }));
  const quantity = page.locator('.quantity__input');
  await quantity.fill('2');
  await quantity.press('Tab');
  await expect(quantity).toHaveValue('1');
  await expect(page.locator('.cart-item__error-text')).toContainText('No hay más unidades disponibles.');
  await expect(quantity).toBeFocused();
});

test('customer properties remain text and cannot become executable upload links', async ({ page }) => {
  await addLine(page, { Nota: '<b>Mi armazón</b>', Archivo: 'javascript:void(0)//uploads/file.pdf' });
  await openStorefrontPage(page, '/cart');
  const details = page.locator('.cart-item__details');
  await expect(details).toContainText('<b>Mi armazón</b>');
  await expect(details).toContainText('javascript:void(0)//uploads/file.pdf');
  await expect(details.locator('b')).toHaveCount(0);
  await expect(details.locator('a[href^="javascript:"]')).toHaveCount(0);
});

test('PDP frame-only purchase reaches the real cart with the selected variant', async ({ page }) => {
  await openStorefrontPage(page, productPath);
  const product = await (await storefrontRequest(page).get(`${productPath}.js`)).json();
  const add = page.locator('[data-frame-only-add]:visible, .product-form__submit:visible').first();
  await expect(add).toBeEnabled();
  const selectedVariant = await add.evaluate((button) => button.closest('form')?.querySelector('[name="id"]')?.value);
  await add.click();
  await expect.poll(async () => (await (await storefrontRequest(page).get('/cart.js')).json()).item_count).toBe(1);
  const cart = await (await storefrontRequest(page).get('/cart.js')).json();
  if (selectedVariant) expect(String(cart.items[0].variant_id)).toBe(selectedVariant);
  await openStorefrontPage(page, '/cart');
  await expect(page.locator('.cart-item__name')).toContainText(product.title);
  await expect(page.locator('[data-cart-count]')).toHaveText('1 producto');
  await expect(page.locator('#checkout')).toBeEnabled();
});
