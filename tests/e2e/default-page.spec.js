import { test, expect } from '@playwright/test';
for(const width of [320,390,820,1440]) {
 test(`generic CMS page at ${width}px has one title, native content and no scaffold`,async({page})=>{
  await page.setViewportSize({width,height:900});
  await page.goto('/tests/fixtures/default-page.html');
  await expect(page.getByRole('heading',{level:1})).toHaveText('Información');
  await expect(page.getByRole('heading',{name:'Servicio y atención'})).toBeVisible();
  await expect(page.getByRole('link',{name:'Contactar al equipo'})).toHaveAttribute('href','/pages/contact');
  await expect(page.locator('body')).not.toContainText('Título de sección');
  await expect(page.getByRole('heading',{level:1})).toHaveCSS('color','rgb(11, 31, 58)');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 });
}
test('empty CMS page keeps its real title and an honest localized state',async({page})=>{
 await page.goto('/tests/fixtures/default-page.html?scenario=empty');
 await expect(page.getByRole('heading',{level:1})).toHaveText('Información');
 await expect(page.getByText('Esta página está en preparación.',{exact:true})).toBeVisible();
 await expect(page.locator('a')).toHaveCount(0);
});
test('native content link is keyboard accessible without JavaScript',async({browser,baseURL})=>{
 const context=await browser.newContext({baseURL,javaScriptEnabled:false});
 try {
  const page=await context.newPage();
  await page.route('**/pages/contact',r=>r.fulfill({contentType:'text/html',body:'<h1>Contacto de muestra</h1>'}));
  await page.goto('/tests/fixtures/default-page.html');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link',{name:'Contactar al equipo'})).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/pages\/contact$/);
  await expect(page.getByRole('heading',{level:1})).toHaveText('Contacto de muestra');
 } finally {await context.close();}
});
