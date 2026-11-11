import { test, expect } from '@playwright/test';
const route = '/pages/contact?view=privacidad';
const dialog = page => page.locator('[data-cookie-dialog]');
const opener = page => page.getByRole('button', { name: 'Preferencias de cookies', exact: true });
const open = async page => { await opener(page).click(); await expect(dialog(page)).toBeVisible(); };
const state = page => page.evaluate(() => {
 const api = window.Shopify.customerPrivacy;
 return {region:api.getRegion(),consent:api.currentVisitorConsent(),analytics:api.analyticsProcessingAllowed(),marketing:api.marketingAllowed(),preferences:api.preferencesProcessingAllowed()};
});
test.beforeEach(async ({ page }) => { const response=await page.goto(route); expect(response.status()).toBe(200); await expect(page).not.toHaveURL(/\/password(?:[?#]|$)/); });

test('opening and closing preferences reflects Shopify permissions without recording consent', async ({ page }) => {
 await page.evaluate(() => new Promise((resolve, reject) => {
  if (window.Shopify?.customerPrivacy) return resolve();
  window.Shopify.loadFeatures([{name:'consent-tracking-api',version:'0.1'}], error => error ? reject(error) : resolve());
 }));
 const current=await state(page);
 expect(current.region).toMatch(/^CL/);
 expect(current.consent).toMatchObject({analytics:'',marketing:'',preferences:''});
 await open(page);
 for (const purpose of ['analytics', 'marketing', 'preferences']) {
  await expect(dialog(page).locator(`[data-cookie-purpose="${purpose}"]`)).toHaveJSProperty('checked', current[purpose]);
 }
 expect((await state(page)).consent).toEqual(current.consent);
 const accept=dialog(page).getByRole('button',{name:'Aceptar todas',exact:true});
 const reject=dialog(page).getByRole('button',{name:'Rechazar todas',exact:true});
 await expect(accept).toBeVisible(); await expect(reject).toBeVisible();
 const acceptBox=await accept.boundingBox();const rejectBox=await reject.boundingBox();
 expect(Math.abs(acceptBox.width-rejectBox.width)).toBeLessThan(1);
 await page.keyboard.press('Escape');
 await expect(dialog(page)).toBeHidden();await expect(opener(page)).toBeFocused();
 expect((await state(page)).consent).toEqual(current.consent);
});
test('accept all updates Shopify permissions and persists across a page reload', async ({ page }) => {
 await open(page); await dialog(page).getByRole('button',{name:'Aceptar todas',exact:true}).click();
 await expect(dialog(page)).toBeHidden();
 expect(await state(page)).toMatchObject({consent:{analytics:'yes',marketing:'yes',preferences:'yes'},analytics:true,marketing:true,preferences:true});
 await page.reload();await open(page);
 await expect(dialog(page).locator('[data-cookie-purpose]:checked')).toHaveCount(3);
 expect(await state(page)).toMatchObject({analytics:true,marketing:true,preferences:true});
});
test('reject all blocks all optional purposes and persists across a page reload', async ({ page }) => {
 await open(page); await dialog(page).getByRole('button',{name:'Rechazar todas',exact:true}).click();
 await expect(dialog(page)).toBeHidden();
 expect(await state(page)).toMatchObject({consent:{analytics:'no',marketing:'no',preferences:'no'},analytics:false,marketing:false,preferences:false});
 await page.reload();await open(page);
 await expect(dialog(page).locator('[data-cookie-purpose]:checked')).toHaveCount(0);
 expect(await state(page)).toMatchObject({consent:{analytics:'no',marketing:'no',preferences:'no'},analytics:false,marketing:false,preferences:false});
});
test('granular choice can be withdrawn immediately through the permanent footer control', async ({ page }) => {
 await open(page); await dialog(page).locator('[data-cookie-purpose="analytics"]').check();
 await dialog(page).locator('[data-cookie-purpose="marketing"]').uncheck();
 await dialog(page).locator('[data-cookie-purpose="preferences"]').uncheck();
 await dialog(page).getByRole('button',{name:'Guardar mi elección',exact:true}).click();await expect(dialog(page)).toBeHidden();
 expect(await state(page)).toMatchObject({consent:{analytics:'yes',marketing:'no',preferences:'no'},analytics:true,marketing:false,preferences:false});
 await open(page);await expect(dialog(page).locator('[data-cookie-purpose="analytics"]')).toBeChecked();
 await dialog(page).getByRole('button',{name:'Rechazar todas',exact:true}).click();await expect(dialog(page)).toBeHidden();
 expect(await state(page)).toMatchObject({analytics:false,marketing:false,preferences:false});
 await page.reload();await open(page);await expect(dialog(page).locator('[data-cookie-purpose]:checked')).toHaveCount(0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
