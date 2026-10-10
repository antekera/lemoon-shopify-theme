import { test, expect } from '@playwright/test';
import { openStorefrontPage } from '../helpers/storefront-page.mjs';
const routes = [
 ['contact', '/pages/contact', '00.000.000-0'],
 ['about', '/pages/nosotros?view=nosotros', 'Servioptic SpA'],
 ['shipping', '/pages/envios-y-entregas?view=envios-y-entregas', '$3.990'],
 ['returns', '/pages/po?view=politica-de-devoluciones', '30 días'],
 ['warranty', '/pages/garantias?view=garantias', '365 días'],
 ['terms', '/pages/terminos-y-condiciones?view=terminos-y-condiciones', '00.000.000-0'],
 ['privacy draft', '/pages/contact?view=privacidad', '90 días'],
 ['operations', '/pages/operativos-oftalmologicos?view=operativos-oftalmologicos', '20 a 40 personas'],
 ['benefits', '/pages/isapres-y-fonasa?view=isapres-y-fonasa', 'no contempla convenios directos'],
];
for (const [name, route, sample] of routes) {
 test(`${name} displays clearly identified sample business data without overflow`, async ({ page }) => {
  expect((await openStorefrontPage(page, route)).status()).toBe(200);
  const demo = page.locator('.lemoon-commercial-demo');
  await expect(demo).toHaveCount(1);
  await expect(demo.locator('.lemoon-commercial-demo__notice')).toBeVisible();
  await expect(demo).toContainText('Datos comerciales de prueba · Servioptic SpA');
  await expect(demo).toContainText(sample);
  await expect(page.locator('#MainContent h1')).toHaveCount(1);
  // The reserved example email is display copy, never an operational contact link.
  await expect(demo.locator('a[href^="mailto:"]')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
 });
}
