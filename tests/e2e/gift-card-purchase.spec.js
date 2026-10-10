import { test, expect } from '@playwright/test';
const route = '/tests/fixtures/gift-card-purchase.html';
// The fixture is captured from Shopify's draft preview. Only isolated cart tests
// enable its button to exercise the behavior of a subsequently published product.
async function publishedFixture(page) {
  await page.goto(route);
  await expect(page.locator('[data-recipient-toggle]')).toBeVisible();
  await page.locator('[data-gift-submit]').evaluate(button => { button.disabled = false; });
}
for (const width of [320,390,820,1440]) {
  test(`draft purchase at ${width}px updates price without enabling a purchase`, async ({page}) => {
    await page.setViewportSize({width,height:900});
    await page.goto(route);
    await page.getByRole('radio',{name:'$60.000',exact:true}).check();
    await expect(page.locator('[data-gift-price]')).toHaveText(['$60.000','$60.000']);
    await expect(page.locator('[data-gift-submit]')).toBeDisabled();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  });
}
test('recipient choice enables required email and removes all properties when unchecked',async({page})=>{
  await page.goto(route);
  const fields=page.locator('[data-recipient-fields]');
  await expect(fields).toBeHidden();
  await page.getByRole('checkbox',{name:'Enviar a otra persona'}).check();
  await expect(fields).toBeVisible();
  await expect(page.locator('[data-recipient-email]')).toHaveAttribute('required','');
  await page.getByLabel('Correo del destinatario').fill('regalo@example.test');
  await page.getByRole('checkbox',{name:'Enviar a otra persona'}).uncheck();
  expect(await page.locator('[data-gift-form]').evaluate(f=>[...new FormData(f).keys()].some(k=>k.startsWith('properties[')))).toBe(false);
});
test('confirmed native addition sends real variant and recipient properties then opens cart',async({page})=>{
  let posted='';
  await page.route('**/cart/add.js',async r=>{posted=r.request().postData(); await r.fulfill({json:{variant_id:67638654959784,quantity:1}});});
  await page.route('**/cart',r=>r.fulfill({contentType:'text/html',body:'<h1>Carrito de prueba</h1>'}));
  await publishedFixture(page);
  await page.getByRole('radio',{name:'$60.000',exact:true}).check();
  await page.getByRole('checkbox',{name:'Enviar a otra persona'}).check();
  await page.getByLabel('Correo del destinatario').fill('regalo@example.test');
  await page.getByLabel('Nombre del destinatario (opcional)').fill('Persona de prueba');
  await page.getByRole('button',{name:'Agregar al carrito'}).click();
  await expect(page).toHaveURL(/\/cart$/);
  expect(posted).toContain('67638654959784');
  expect(posted).toContain('properties[Recipient email]');
  expect(posted).toContain('regalo@example.test');
  expect(posted).toContain('properties[__shopify_send_gift_card_to_recipient]');
});
test('rejection keeps values, restores retry and prevents a cart redirect',async({page})=>{
  await page.route('**/cart/add.js',r=>r.fulfill({status:422,json:{status:422,description:'Unavailable'}}));
  await publishedFixture(page);
  await page.getByRole('radio',{name:'$100.000',exact:true}).check();
  await page.getByRole('button',{name:'Agregar al carrito'}).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.getByRole('alert')).toBeFocused();
  await expect(page.getByRole('button',{name:'Agregar al carrito'})).toBeEnabled();
  await expect(page.getByRole('radio',{name:'$100.000',exact:true})).toBeChecked();
  await expect(page).toHaveURL(new RegExp('gift-card-purchase.html$'));
});
test('pending submission rejects duplicate clicks',async({page})=>{
  let count=0,release;
  const ready=new Promise(resolve=>{release=resolve;});
  await page.route('**/cart/add.js',async r=>{count++; await ready; await r.fulfill({status:422,json:{status:422}});});
  await publishedFixture(page);
  await page.getByRole('button',{name:'Agregar al carrito'}).click();
  await expect(page.locator('[data-gift-submit]')).toBeDisabled();
  await page.locator('[data-gift-form]').evaluate(f=>f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
  release();
  await expect(page.locator('[data-gift-submit]')).toBeEnabled();
  expect(count).toBe(1);
});
test('without JavaScript recipient fallback is visible and the draft cannot submit',async({browser,baseURL})=>{
  const context=await browser.newContext({baseURL,javaScriptEnabled:false});
  try {
    const page=await context.newPage(); await page.goto(route);
    await expect(page.locator('[data-recipient-fields]')).toBeVisible();
    await expect(page.locator('[data-recipient-control]')).toHaveValue('if_present');
    await expect(page.locator('[data-gift-submit]')).toBeDisabled();
    await expect(page.locator('[data-recipient-toggle]')).toBeHidden();
  } finally {await context.close();}
});
