import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/fixtures/eyewear-product.html');
  await expect(page.locator('[data-add]')).toBeEnabled();
});

test('selects native variant prices and resets the index for solar and frame-only', async ({ page }) => {
  await page.getByRole('button', { name: 'Agregar lentes →', exact: true }).click();
  await page.getByLabel('Monofocal', { exact: true }).check();
  await page.getByLabel('Delgado 1.67', { exact: true }).check();
  await expect(page.locator('[data-price]')).toHaveText('$84.900');
  await expect(page.locator('[name="id"]').first()).toHaveValue('67616399458472');
  await page.getByLabel('Solar sin receta', { exact: true }).check();
  await expect(page.locator('[data-price]')).toHaveText('$59.900');
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
  await page.getByRole('button', { name: 'Agregar lentes →', exact: true }).click();
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

test('opens the size dialog, converts units and restores focus', async ({ page }) => {
  const opener = page.getByRole('button', { name: 'Guía de medidas ↗' });
  await opener.click();
  const dialog = page.getByRole('dialog', { name: 'Guía de medidas' });
  await dialog.locator('[data-units]').selectOption('in');
  await expect(dialog.locator('[data-mm="140"]')).toHaveText('5.51 in');
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
  await page.getByRole('button', { name: 'Agregar lentes →', exact: true }).click();
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
  await page.getByRole('button', { name: 'Ver imagen 2', exact: true }).click();
  await expect(page.locator('[data-media-panel]:visible')).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});


test('keeps two purchase actions and moves lenses to the next step without adding to cart', async ({ page }) => {
  let requests = 0;
  await page.route('**/cart/add.js', async (route) => {
    requests += 1;
    await route.fulfill({ status: 422, contentType: 'application/json', body: JSON.stringify({ description: 'Prueba de compra' }) });
  });
  await expect(page.getByRole('button', { name: 'Comprar solo armazón', exact: true })).toBeVisible();
  await expect(page.locator('form[data-purchase] > button:visible')).toHaveCount(2);
  await expect(page.locator('[data-lens-panel]')).toBeHidden();
  await expect(page.locator('[data-flow-heading]')).toBeHidden();
  await expect(page.locator('h1')).toHaveCSS('font-size', '28px');
  await expect(page.locator('[data-price]')).toHaveCSS('font-size', '20px');
  await page.getByRole('button', { name: 'Agregar lentes →', exact: true }).click();
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
  await page.getByRole('button', { name: 'Comprar solo armazón', exact: true }).click();
  await expect(page.locator('[data-error]')).toHaveText('Prueba de compra');
  expect(requests).toBe(1);
});
