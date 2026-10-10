import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/fixtures/eyewear-product.html');
  await expect(page.locator('[data-add]')).toBeEnabled();
});

test('selects native variant prices and resets the index for solar and frame-only', async ({ page }) => {
  await page.getByRole('button', { name: 'Seleccionar lentes y comprar', exact: true }).click();
  await page.getByLabel('Monofocal', { exact: true }).check();
  await page.getByLabel('Delgado 1.67', { exact: true }).check();
  await expect(page.locator('[data-price]')).toHaveText('$84.900');
  await expect(page.locator('[data-heading-sku]')).toHaveText('LM-DALTON-DEMO-122');
  await expect(page.locator('[name="id"]').first()).toHaveValue('67616399458472');
  await page.getByLabel('Solar sin receta', { exact: true }).check();
  await expect(page.locator('[data-price]')).toHaveText('$59.900');
  await expect(page.locator('[data-heading-sku]')).toHaveText('LM-DALTON-DEMO-161');
  await expect(page.locator('[data-prescription]')).toBeHidden();
  await expect(page.locator('[data-option-group="2"]')).toBeHidden();
  await page.getByRole('button', { name: '← Volver al armazón', exact: true }).click();
  await expect(page.locator('[data-price]')).toHaveText('$39.900');
});

test('submits the chosen variant and recipe to Shopify and recovers from a rejected cart request', async ({ page }) => {
  const bodies = [];
  await page.route('**/cart/add.js', async (route) => {
    bodies.push(route.request().postData());
    await route.fulfill({ status: 422, contentType: 'application/json', body: JSON.stringify({ status: 422, description: 'No hay stock para esta configuración.' }) });
  });
  await page.getByRole('button', { name: 'Seleccionar lentes y comprar', exact: true }).click();
  await page.getByLabel('Monofocal', { exact: true }).check();
  await page.getByLabel('Ingresar receta ahora', { exact: true }).check();
  await page.locator('[data-add]').click();
  await expect(page.locator('[data-error]')).toContainText('Revisa tu receta');
  expect(bodies).toHaveLength(0);
  await page.locator('[data-rx="od_sph"]').fill('-1.25');
  await page.locator('[data-rx="oi_sph"]').fill('0');
  await page.locator('[data-rx="pd"]').fill('62');
  await page.locator('[data-add]').click();
  await expect(page.locator('[data-error]')).toHaveText('No hay stock para esta configuración.');
  await expect(page.locator('[data-add]')).toBeEnabled();
  expect(bodies[0]).toContain('67616399425704');
  expect(bodies[0]).toContain('properties[OD Esfera]');
  expect(bodies[0]).toContain('-1.25');
  expect(bodies[0]).not.toContain('properties[OD Adición]');
  await page.getByLabel('Enviaré mi receta después', { exact: true }).check();
  await page.locator('[data-add]').click();
  await expect.poll(() => bodies.length).toBe(2);
  expect(bodies[1]).toContain('Enviaré mi receta después');
  expect(bodies[1]).not.toContain('properties[OD Esfera]');
});

test('opens the product size guide with measurements, frame details and fit tabs', async ({ page }) => {
  const opener = page.getByRole('button', { name: 'Guía de medidas' });
  await opener.click();
  const dialog = page.getByRole('dialog', { name: 'Guía de medidas' });
  await expect(dialog).toHaveClass(/lemoon-size-drawer/);
  await expect.poll(() => dialog.evaluate((element) => Math.round(element.getBoundingClientRect().right))).toBe(page.viewportSize().width);
  const measurements = dialog.getByRole('tabpanel', { name: 'Medidas' });
  await expect(measurements).toContainText('140 mm');
  await expect(measurements).toContainText('145 mm');
  await measurements.getByLabel('Unidad').selectOption('in');
  await expect(measurements).toContainText('5.51 in');
  const tabs = dialog.getByRole('tab');
  await tabs.nth(0).press('ArrowRight');
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(dialog.getByRole('tabpanel', { name: 'Características' })).toContainText('Acetato');
  await tabs.nth(1).press('ArrowRight');
  await expect(tabs.nth(2)).toBeFocused();
  await expect(dialog.getByRole('tabpanel', { name: 'Talla y rostro' })).toContainText('Ovalado, corazón');
  await dialog.getByRole('button', { name: 'Cerrar' }).click();
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test('uploads a recipe through the native product form and requires an attachment', async ({ page }) => {
  let body;
  await page.route('**/cart/add', async (route) => {
    body = route.request().postData();
    await route.fulfill({ contentType: 'text/html', body: '<h1>Receta recibida</h1>' });
  });
  await page.getByRole('button', { name: 'Seleccionar lentes y comprar', exact: true }).click();
  await page.getByLabel('Monofocal', { exact: true }).check();
  await page.getByRole('radio', { name: 'Subir receta (PDF o imagen)', exact: true }).check();
  await page.locator('[data-add]').click();
  await expect(page.locator('[data-error]')).toContainText('Selecciona un archivo');
  await page.locator('[data-recipe-file]').setInputFiles({ name: 'receta-prototipo.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4\nDATOS SINTETICOS DE PRUEBA\n%%EOF') });
  await page.locator('[data-add]').click();
  await expect(page.getByRole('heading', { name: 'Receta recibida' })).toBeVisible();
  expect(body).toContain('67616399425704');
  expect(body).toContain('properties[Archivo de receta]');
  expect(body).toContain('receta-prototipo.pdf');
  expect(body).not.toContain('properties[OD Esfera]');
});

test('mobile fits the viewport and changes gallery views', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.lemoon-pdp__stage').evaluate(el => el.scrollTo({ left: el.clientWidth, behavior: 'instant' }));
  await expect(page.locator('[data-gallery-current]')).toHaveText('2');
  await expect(page.locator('lemoon-thumbnail-rail')).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});


test('keeps lens selection and frame-only purchase separate without adding early', async ({ page }) => {
  let requests = 0;
  await page.route('**/cart/add.js', async (route) => {
    requests += 1;
    await route.fulfill({ status: 422, contentType: 'application/json', body: JSON.stringify({ description: 'Prueba de compra' }) });
  });
  await expect(page.locator('[data-add]')).toBeHidden();
  await expect(page.locator('form[data-purchase] > button:visible')).toHaveCount(2);
  await expect(page.locator('[data-frame-only-add]')).toHaveText('Agregar solo marco');
  await expect(page.locator('[data-lens-panel]')).toBeHidden();
  await expect(page.locator('[data-flow-heading]')).toBeHidden();
  await expect(page.locator('h1')).toHaveCSS('font-size', '24px');
  await expect(page.locator('[data-price]')).toHaveCSS('font-size', '20px');
  await page.getByRole('button', { name: 'Seleccionar lentes y comprar', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Elige tus lentes' })).toBeVisible();
  await expect(page.locator('[data-flow-title]')).toBeFocused();
  await expect(page.locator('[data-lens-panel]')).toBeVisible();
  expect(requests).toBe(0);
  await page.getByLabel('Ingresar receta ahora', { exact: true }).check();
  await page.locator('[data-rx="od_sph"]').fill('-1.25');
  await page.getByRole('button', { name: '← Volver al armazón', exact: true }).click();
  await expect(page.locator('[name="id"]').first()).toHaveValue('67616399392936');
  await expect(page.locator('[data-prescription]')).toBeHidden();
  await expect(page.locator('[data-configure]')).toBeFocused();
  await page.getByRole('button', { name: 'Seleccionar lentes y comprar', exact: true }).click();
  await page.getByLabel('Enviaré mi receta después', { exact: true }).check();
  await page.locator('[data-add]').click();
  await expect(page.locator('[data-error]')).toHaveText('Prueba de compra');
  expect(requests).toBe(1);
});

test('adds only the available frame variant directly to cart', async ({ page }) => {
  let body;
  await page.route('**/cart/add.js', async (route) => {
    body = route.request().postData();
    await route.fulfill({ status: 422, contentType: 'application/json', body: JSON.stringify({ status: 422, description: 'Prueba de compra' }) });
  });
  await page.locator('[data-frame-only-add]').click();
  await expect(page.locator('[name="id"]')).toHaveValue('67616399392936');
  await expect(page.locator('[data-error]')).toHaveText('Prueba de compra');
  expect(body).toContain('67616399392936');
  expect(body).not.toContain('properties[Receta]');
});

test('opens the configured cart notification instead of navigating away after frame-only add', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addStyleTag({ path: 'assets/lemoon-header.css' });
  await page.evaluate(() => {
    window.trapFocus = () => {};
    window.removeTrapFocus = () => {};
    document.body.insertAdjacentHTML('afterbegin', `
      <sticky-header></sticky-header>
      <a id="cart-icon-bubble" href="/cart" data-cart-count-label="Carrito con [count] artículos"><span data-custom-icon>icono</span></a>
      <a id="cart-icon-bubble-mobile" href="/cart" data-cart-count-label="Carrito con [count] artículos"><span data-custom-icon>icono móvil</span></a>
      <cart-notification>
        <div id="cart-notification" class="cart-notification" role="status" aria-live="polite" aria-atomic="true" aria-hidden="true">
          <span class="cart-notification__icon" aria-hidden="true">✓</span>
          <p class="cart-notification__message"><span id="cart-notification-product" class="cart-notification-product__name"></span>&#32;<span>ha sido agregado al carrito.</span></p>
          <a class="cart-notification__checkout" href="/checkout">Hacer pedido</a>
          <button type="button" class="cart-notification__close" aria-label="Cerrar">×</button>
        </div>
      </cart-notification>
    `);
    Object.assign(document.getElementById('cart-icon-bubble-mobile').style, { position: 'fixed', top: '4px', right: '12px', width: '24px', height: '24px' });
    Object.assign(document.getElementById('cart-icon-bubble').style, { position: 'fixed', top: '4px', right: '12px', width: '24px', height: '24px', display: 'none' });
  });
  await page.addScriptTag({ path: 'assets/cart-notification.js' });
  await page.route('**/cart.js', async (route) => {
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ item_count: 1, currency: 'CLP', items: [] }) });
  });
  let releaseAdd;
  let markAddStarted;
  const addStarted = new Promise((resolve) => { markAddStarted = resolve; });
  const allowAddResponse = new Promise((resolve) => { releaseAdd = resolve; });
  await page.route('**/cart/add.js', async (route) => {
    markAddStarted();
    await allowAddResponse;
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({
      key: 'line',
      sections: {
        'cart-notification-product': '<div class="shopify-section"><div data-cart-item-key="existing"><span class="cart-notification-product__name">Muestra · Niños Redondo</span></div><div data-cart-item-key="line"><span class="cart-notification-product__name">Lemoon Dalton · Prototipo</span></div></div>',
      },
    }) });
  });
  await page.locator('[data-frame-only-add]').click();
  await addStarted;
  const addButton = page.locator('[data-frame-only-add]');
  await addButton.evaluate((button) => button.closest('.lemoon-pdp__form').classList.remove('lemoon-pdp__form'));
  await expect(addButton).toHaveAttribute('aria-busy', 'true');
  await expect(addButton.locator('.loading__spinner')).not.toHaveClass(/hidden/);
  expect(await addButton.locator('.loading__spinner .path').evaluate((path) => getComputedStyle(path).stroke)).not.toBe('rgb(255, 255, 255)');
  releaseAdd();
  await expect(page.locator('#cart-notification')).toHaveClass(/active/);
  await expect.poll(() => page.locator('#cart-notification').evaluate((element) => getComputedStyle(element).visibility)).toBe('visible');
  expect(await page.locator('cart-notification').evaluate((element) => getComputedStyle(element).zIndex)).toBe('120');
  await expect(page.locator('#cart-notification')).toHaveAttribute('role', 'status');
  await expect(page.locator('#cart-notification')).toContainText('Lemoon Dalton · Prototipo ha sido agregado al carrito.');
  await expect(page.locator('.cart-notification__checkout')).toHaveText('Hacer pedido');
  await expect(page.locator('.cart-notification__checkout')).toHaveAttribute('href', '/checkout');
  await expect(page.locator('[data-cart-notification-overlay]')).toHaveCount(0);
  await expect(page.locator('.cart-notification-product__image')).toHaveCount(0);
  const mobileToast = await page.locator('#cart-notification').boundingBox();
  const closeButton = await page.locator('.cart-notification__close').boundingBox();
  expect(mobileToast.width).toBeLessThan(370);
  expect(mobileToast.height).toBeLessThan(100);
  expect(mobileToast.x).toBeGreaterThan(0);
  expect(closeButton.x).toBeGreaterThanOrEqual(mobileToast.x);
  expect(closeButton.x + closeButton.width).toBeLessThanOrEqual(mobileToast.x + mobileToast.width);
  expect(closeButton.x + closeButton.width).toBeLessThanOrEqual(390);
  await expect(page.locator('#cart-notification')).toHaveCSS('box-shadow', /rgba/);
  await expect(page.locator('#cart-icon-bubble .lemoon-header__cart-count')).toHaveText('1');
  await expect(page.locator('#cart-icon-bubble .lemoon-header__cart-count')).toHaveClass(/is-popping/);
  await expect(page.locator('#cart-icon-bubble-mobile .lemoon-header__cart-count')).toHaveText('1');
  await expect(page.locator('#cart-icon-bubble [data-custom-icon]')).toHaveText('icono');
  await expect(page).toHaveURL(/\/tests\/fixtures\/eyewear-product\.html/);

  await page.locator('.cart-notification__close').click();
  await expect(page.locator('#cart-notification')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('#cart-notification')).toHaveCSS('visibility', 'hidden');
});
