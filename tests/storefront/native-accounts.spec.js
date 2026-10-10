import {test,expect} from '@playwright/test';

// These cases cover the real guest entry to Shopify's hosted customer accounts.
// They do not authenticate, send a code, create a customer, or prove private pages.
const accountUrl='https://cuenta.lemoon.cl/profile?locale=es&region_country=CL';

test.beforeEach(async ({page})=>{
  await page.goto(accountUrl);
  await expect(page.getByRole('heading',{name:'Iniciar sesión',exact:true})).toBeVisible();
});

test('native account entry requires an email and leaves marketing consent optional',async ({page})=>{
  const email=page.getByRole('textbox',{name:'Correo electrónico',exact:true});
  await expect(email).toHaveAttribute('type','email');
  await expect(email).toHaveAttribute('autocomplete','email');
  expect(await email.evaluate(el=>el.required)).toBe(true);
  expect(await email.evaluate(el=>el.validity.valueMissing)).toBe(true);
  const consent=page.getByRole('checkbox',{name:'Enviarme novedades y ofertas por correo electrónico',exact:true});
  await expect(consent).not.toBeChecked();
  expect(await consent.evaluate(el=>el.required)).toBe(false);
  await email.fill('correo-invalido');
  expect(await email.evaluate(el=>el.validity.typeMismatch)).toBe(true);
  await email.fill('synthetic@example.com');
  expect(await email.evaluate(el=>el.checkValidity())).toBe(true);
  await expect(consent).not.toBeChecked();
  const home=new URL(await page.getByRole('link',{name:'lemoon',exact:true}).getAttribute('href'));
  expect(home.origin).toBe('https://lemoon.cl');
  expect(home.pathname).toBe('/');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  // No submit action: no code or subscription is requested.
});

test('native account privacy policy opens with its real content and closes by keyboard',async ({page})=>{
  const opener=page.getByRole('button',{name:'Política de privacidad',exact:true});
  await opener.click();
  const dialog=page.getByRole('dialog',{name:'Política de privacidad',exact:true});
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading',{name:'Información personal que recopilamos o tratamos',exact:true})).toBeVisible();
  await expect(dialog.getByRole('heading',{name:'Contacto',exact:true})).toBeAttached();
  await expect(dialog.getByRole('button',{name:'Close',exact:true})).toBeFocused();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});
