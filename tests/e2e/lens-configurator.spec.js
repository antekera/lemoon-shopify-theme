import { expect, test } from '@playwright/test';
// Synthetic catalogue fixture tests the real flow controller. Root separately verifies Shopify-rendered Liquid.
const next = (page) => page.locator('[data-configurator-next]').click();
async function mono(page) {
  await page.goto('/tests/fixtures/lens-configurator.html');
  await page.getByRole('radio', { name: 'Monofocal', exact: true }).check();
  await page.getByRole('radio', { name: 'Para ver de lejos', exact: true }).check();
  await next(page);
}
async function prescription(page) {
  await page.locator('[data-rx="od_sph"]').fill('-1.25');
  await page.locator('[data-rx="oi_sph"]').fill('0');
  await page.locator('[data-rx="pd"]').fill('62');
  await next(page);
}

test('theme-editor section replacement restores the flow without resetting an initialized section', async ({ page }) => {
  const response = await page.request.get('/tests/fixtures/lens-configurator.html');
  const markup = await response.text();
  await page.goto('/tests/fixtures/lens-configurator.html');
  await expect(page.getByRole('radio', { name: 'Monofocal', exact: true })).toBeVisible();
  await page.locator('[data-lens-flow]').evaluate((root, html) => {
    const replacement = document.createElement('section');
    replacement.id = 'shopify-section-fixture-lenses';
    const parsed = new DOMParser().parseFromString(html, 'text/html');
    replacement.append(document.importNode(parsed.querySelector('[data-lens-flow]'), true));
    root.dispatchEvent(new CustomEvent('shopify:section:unload', { bubbles: true }));
    root.replaceWith(replacement);
    replacement.dispatchEvent(new CustomEvent('shopify:section:load', { bubbles: true, detail: { sectionId: 'fixture-lenses' } }));
  }, markup);
  await expect(page.locator('[data-flow-panels]')).toBeVisible();
  await expect(page.locator('[data-choices="use"] input')).toHaveCount(3);
  await page.getByRole('radio', { name: 'Monofocal', exact: true }).check();
  await page.getByRole('radio', { name: 'Para ver de lejos', exact: true }).check();
  await page.locator('#shopify-section-fixture-lenses').evaluate(section => {
    section.dispatchEvent(new CustomEvent('shopify:section:load', { bubbles: true, detail: { sectionId: 'fixture-lenses' } }));
  });
  await expect(page.getByRole('radio', { name: 'Monofocal', exact: true })).toBeChecked();
  await expect(page.getByRole('radio', { name: 'Para ver de lejos', exact: true })).toBeChecked();
  await next(page);
  await expect(page.locator('[data-step="prescription"]')).toBeVisible();
  await expect(page.locator('[data-flow-error]')).toBeHidden();
});

test('manual recipe validates before progressing and an exact index price reaches the cart request', async ({ page }) => {
  const requests = [];
  await page.route('**/cart/add.js', async (route) => { requests.push(route.request().postData()); await route.fulfill({ status: 422, json: { description: 'Prueba sin compra' } }); });
  await mono(page);
  await next(page);
  await expect(page.locator('[data-flow-error]')).toBeVisible();
  await expect(page.locator('[data-rx="od_sph"]')).toBeFocused();
  await prescription(page);
  await page.getByRole('radio', { name: 'Transparentes', exact: true }).check();
  await next(page);
  await page.getByRole('radio', { name: 'Delgado 1.67', exact: true }).check();
  await next(page);
  await expect(page.locator('[data-step="review"]')).toBeVisible();
  await expect(page.locator('[data-flow-price]')).toHaveText('$84.900');
  await expect(page.locator('[name="id"]')).toHaveValue('3');
  await next(page);
  expect(requests).toHaveLength(1);
  expect(requests[0]).toContain('name="properties[OD Esfera]"');
  expect(requests[0]).toContain('-1.25');
  expect(requests[0]).not.toContain('properties[OD Adición]');
});

test('solar invalidates old prescription and skips recipe, single thickness and unavailable extras', async ({ page }) => {
  await mono(page); await prescription(page);
  await page.locator('[data-configurator-back]').click();
  await page.locator('[data-configurator-back]').click();
  await page.getByRole('radio', { name: 'Sol sin receta', exact: true }).check();
  await next(page);
  await expect(page.locator('[data-step="crystal"]')).toBeVisible();
  await page.getByRole('radio', { name: 'Cristales de sol', exact: true }).check();
  await next(page);
  await expect(page.locator('[data-step="review"]')).toBeVisible();
  await expect(page.locator('[name="id"]')).toHaveValue('7');
  const fields = await page.locator('[data-rx]').evaluateAll((inputs) => inputs.map(({ disabled, value }) => ({ disabled, value })));
  expect(fields.every(({disabled,value}) => disabled && value === '')).toBe(true);
  await expect(page.locator('[data-recipe-property]')).toBeDisabled();
});

test('upload uses native multipart with a synthetic file and no manual prescription properties', async ({ page }) => {
  let body;
  await page.route('**/cart/add', async (route) => { body = route.request().postData(); await route.fulfill({ contentType: 'text/html', body: '<p>Synthetic upload captured</p>' }); });
  await mono(page);
  await page.getByRole('radio', { name: 'Subir receta (PDF o imagen)', exact: true }).check();
  await page.locator('[data-recipe-file]').setInputFiles({ name: 'synthetic.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4\nSYNTHETIC\n%%EOF') });
  await next(page);
  await page.getByRole('radio', { name: 'Fotocromáticos', exact: true }).check();
  await next(page);
  await expect(page.locator('[data-step="review"]')).toBeVisible();
  await next(page);
  await expect(page).toHaveURL(/\/cart\/add$/);
  expect(body).toContain('synthetic.pdf');
  expect(body).toContain('properties[Archivo de receta]');
  expect(body).not.toContain('properties[OD Esfera]');
});
