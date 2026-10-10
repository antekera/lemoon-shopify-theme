import { test, expect } from '@playwright/test';
for (const width of [320,390,820,1440]) {
  test(`delivery email at ${width}px preserves code, balance and card link`,async({page})=>{
    await page.setViewportSize({width,height:1000});
    await page.goto('/tests/fixtures/gift-card-email.html?scenario=recipient');
    await expect(page.getByRole('heading',{name:'Tu tarjeta de regalo',exact:true})).toBeVisible();
    await expect(page.getByText('$60.000 CLP',{exact:true})).toBeVisible();
    await expect(page.getByText('A1B2 3C4D 5E6F 7G8H',{exact:true})).toBeVisible();
    await expect(page.getByText('Hola Sofi, recibiste una tarjeta de regalo de Camila.')).toBeVisible();
    await expect(page.getByRole('link',{name:'Abrir mi tarjeta',exact:true})).toHaveAttribute('href','https://example.test/gift-card/sample');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  });
}
test('personal message is plain text and cannot create a malicious image',async({page})=>{
  await page.setViewportSize({width:320,height:1000});
  await page.goto('/tests/fixtures/gift-card-email.html?scenario=unsafe-message');
  await expect(page.getByText('<img src=x onerror=alert(1)>'.repeat(7),{exact:true})).toBeVisible();
  await expect(page.locator('img')).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('buyer receipt distinguishes scheduled delivery from completed delivery',async({page})=>{
  await page.goto('/tests/fixtures/gift-card-receipt.html?scenario=scheduled');
  await expect(page.getByText('Tu tarjeta de regalo está programada para Sofi el 25/12/2026.')).toBeVisible();
  await expect(page.getByRole('link',{name:'Ver la tarjeta de regalo'})).toHaveAttribute('href','https://example.test/gift-card/sample');
  await page.goto('/tests/fixtures/gift-card-receipt.html?scenario=recipient');
  await expect(page.getByText('Tu tarjeta de regalo se envió a Sofi.')).toBeVisible();
});
test('delivery does not require scripts or remote font loading',async({browser,baseURL})=>{
  const context=await browser.newContext({baseURL,javaScriptEnabled:false});
  try {
    const page=await context.newPage();await page.goto('/tests/fixtures/gift-card-email.html');
    await expect(page.getByRole('link',{name:'Abrir mi tarjeta'})).toBeVisible();
    await expect(page.getByText('A1B2 3C4D 5E6F 7G8H',{exact:true})).toBeVisible();
    await expect(page.locator('script,link[rel=stylesheet]')).toHaveCount(0);
  } finally {await context.close();}
});
