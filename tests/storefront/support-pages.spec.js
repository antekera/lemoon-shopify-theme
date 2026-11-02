import { test, expect } from '@playwright/test';
import { storefrontRequest } from '../helpers/storefront-request.mjs';
import { openStorefrontPage } from '../helpers/storefront-page.mjs';
const noOverflow = async (page) => expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

test('FAQ groups open and close by keyboard and link to existing guides and policies', async ({page}) => {
  await openStorefrontPage(page, '/pages/preguntas-frecuentes?view=preguntas-frecuentes');
  const faq = page.locator('.lemoon-faq-page');
  await expect(page.locator('#MainContent h1')).toHaveCount(1);
  await expect(faq.locator('details')).toHaveCount(11);
  const first = faq.locator('details').first();
  await first.locator('summary').focus(); await first.locator('summary').press('Enter');
  await expect(first).toHaveAttribute('open', '');
  await expect(first.locator('a')).toHaveAttribute('href','/pages/como-medir-tus-lentes');
  await first.locator('summary').press('Enter');
  await expect(first).not.toHaveAttribute('open','');
  for (const href of ['/pages/como-medir-tus-lentes','/pages/como-hacer-tu-pedido','/pages/como-usar-probador-virtual','/pages/como-enviar-prescripcion','/pages/envios-y-entregas','/pages/politicas','/pages/garantias']) {
    await expect(faq.locator(`a[href="${href}"]`).first()).toHaveCount(1);
    expect((await storefrontRequest(page).get(href)).status()).toBe(200);
  }
  await noOverflow(page);
});

test('Nosotros shows its copy and randomized products without newsletter or contact CTA and preserves newsletter elsewhere', async ({page}, testInfo) => {
  await openStorefrontPage(page, '/pages/nosotros?view=nosotros');
  const about = page.locator('.lemoon-about-page');
  await expect(page.locator('#MainContent h1')).toHaveCount(1);
  await expect(about.getByRole('heading', { level: 1 })).toHaveText('Ver bien. Sentirte tú.');
  for (const title of ['Experiencia en óptica, ahora online', 'El cuidado está en los detalles', 'Comprar online también puede sentirse cercano', 'Hacerlo bien es seguir mejorando']) {
    await expect(about.getByRole('heading', { name: title, exact: true })).toBeVisible();
  }
  await expect(about).toContainText('Somos un equipo de profesionales del rubro óptico con muchos años de experiencia en Chile.');
  await expect(about).toContainText('con la información y asesoría que necesitas para elegir, de forma clara y rápida.');
  await expect(about).toContainText('Tus lentes son parte de tu día a día.');
  await expect(about).toContainText('Se te ven bien');
  await expect(about).not.toContainText(/proveedor|suministra|a buen precio|Miguel|Servioptic|demostraci[oó]n|Título de sección|POR CONFIRMAR/i);
  const image = about.locator('.lemoon-about-page__visual img');
  await expect(image).toBeVisible();
  await expect(image).toHaveAttribute('src', /lemoon-nosotros-mostrador/);
  await expect(image).toHaveAttribute('alt', 'Armazones de lentes exhibidos sobre estantes de madera junto a una ventana.');
  await expect.poll(() => image.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
  await expect(about.locator('.lemoon-about-page__abstract')).toHaveCount(0);
  const catalogue = about.getByRole('link', { name: 'Conoce nuestros lentes', exact: true });
  const closingCatalogue = about.getByRole('link', { name: 'Encuentra tu próximo par', exact: true });
  await expect(about.getByRole('link', { name: 'Conversemos', exact: true })).toHaveCount(0);
  await expect(about.locator('a[href="/pages/contact"]')).toHaveCount(0);
  await expect(catalogue).toHaveAttribute('href', '/collections/all');
  await expect(closingCatalogue).toHaveAttribute('href', '/collections/all');
  await catalogue.focus();
  await expect(catalogue).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(closingCatalogue).toBeFocused();
  await expect(page.locator('.lemoon-newsletter')).toHaveCount(0);
  const carousel = page.locator('.lemoon-featured-products');
  await expect(carousel).toHaveCount(1);
  await expect(carousel).toHaveAttribute('data-randomized', 'true');
  await expect(carousel.getByRole('heading', { name: 'Encuentra tu próximo par', exact: true })).toBeVisible();
  const items = carousel.locator('.lemoon-featured-products__item');
  const itemCount = await items.count();
  expect(itemCount).toBeGreaterThan(0);
  expect(itemCount).toBeLessThanOrEqual(8);
  for (const item of await items.all()) {
    await expect(item).not.toHaveAttribute('hidden');
    await expect(item.locator('a[href*="/products/"]').first()).toHaveAttribute('href', /\/products\//);
    await expect(item).not.toContainText(/agotado|sold out/i);
  }
  await expect(carousel.locator('button[name="add"]')).toHaveCount(0);
  const track = carousel.locator('.lemoon-featured-products__track');
  const overflow = await track.evaluate(el => el.scrollWidth > el.clientWidth + 1);
  if (overflow) {
    const next = carousel.locator('[data-lemoon-carousel-next]');
    const previous = carousel.locator('[data-lemoon-carousel-prev]');
    await expect(next).toHaveAccessibleName(/\S/);
    await expect(next).toBeEnabled();
    await expect(previous).toBeDisabled();
    const initialScroll = await track.evaluate(el => el.scrollLeft);
    await next.focus();
    await expect(next).toBeFocused();
    await next.press('Enter');
    await expect.poll(() => track.evaluate(el => el.scrollLeft)).toBeGreaterThan(initialScroll);
    await expect(previous).toBeEnabled();
    await previous.focus();
    await previous.press('Enter');
    await expect.poll(() => track.evaluate(el => el.scrollLeft)).toBeLessThanOrEqual(initialScroll + 1);
  } else {
    await expect(carousel.locator('[data-lemoon-carousel-controls]')).toBeHidden();
  }
  await noOverflow(page);
  await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo({ top: 0, behavior: 'instant' }); });
  await page.screenshot({ path: testInfo.outputPath('nosotros.png'), fullPage: true });
  expect((await storefrontRequest(page).get('/collections/all')).status()).toBe(200);
  await closingCatalogue.focus();
  await closingCatalogue.press('Enter');
  await expect(page).toHaveURL(/\/collections\/all(?:\?.*)?$/);
  for (const path of ['/', '/pages/contact']) {
    await openStorefrontPage(page, path);
    await expect(page.locator('.lemoon-newsletter')).toBeVisible();
  }
});

for (const [handle, subject] of [['operativos-oftalmologicos','?subject=operativos'],['isapres-y-fonasa','']]) {
  test(`${handle} offers real help without a medical or reimbursement form`, async ({page}) => {
    await openStorefrontPage(page, `/pages/${handle}?view=${handle}`);
    const service = page.locator('.lemoon-service-page');
    await expect(page.locator('#MainContent h1')).toHaveCount(1);
    await expect(service.locator('ol li')).toHaveCount(3);
    const bounds = await service.boundingBox();
    const heading = await service.locator('h1').boundingBox();
    expect(heading.x - bounds.x).toBeGreaterThanOrEqual(15);
    await expect(service.locator('form')).toHaveCount(0);
    await expect(service).not.toContainText('hola@lemon.cl');
    const contact = service.locator('a[href="/pages/contact'+subject+'"]');
    await expect(contact).toBeVisible(); await contact.focus(); await expect(contact).toBeFocused();
    await noOverflow(page); await contact.press('Enter');
    expect(new URL(page.url()).pathname).toBe('/pages/contact');
  });
}

for (const [handle, view] of [['envios-y-entregas','envios-y-entregas'],['politicas','politica-de-devoluciones'],['terminos-y-condiciones','terminos-y-condiciones'],['garantias','garantias']]) {
  test(`${handle} preserves its legal title and offers contact for missing conditions`, async ({page}) => {
    expect((await openStorefrontPage(page, `/pages/${handle}?view=${view}`)).status()).toBe(200);
    const legal = page.locator('.lemoon-legal-page');
    await expect(page.locator('#MainContent h1')).toHaveCount(1);
    await expect(legal.locator('.lemoon-legal-page__content')).not.toBeEmpty();
    const contact = legal.locator('.lemoon-legal-page__help a');
    await expect(contact).toHaveAttribute('href', '/pages/contact');
    await contact.focus(); await expect(contact).toBeFocused(); await noOverflow(page);
  });
}

test('native privacy policy remains available with real policy content', async ({page}) => {
  expect((await openStorefrontPage(page, '/policies/privacy-policy')).status()).toBe(200);
  await expect(page.locator('#MainContent h1')).toHaveCount(1);
  await expect(page.locator('#MainContent')).toContainText('privacidad');
  const preferences = page.locator('#MainContent').getByRole('button', {name:'Preferencias de cookies',exact:true});
  await preferences.click();
  await expect(page.locator('[data-cookie-dialog]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(preferences).toBeFocused();
  await noOverflow(page);
});

test('launch requires explicit newsletter consent and preserves password access', async ({browser,baseURL,viewport}) => {
  // The launch page is a guest surface, even when the suite previews an authenticated storefront.
  const context = await browser.newContext({ baseURL, viewport, storageState: { cookies: [], origins: [] } });
  const page = await context.newPage();
  try {
  const previewThemeId = process.env.STOREFRONT_PREVIEW_THEME_ID;
  await page.goto(`/password${previewThemeId ? `?preview_theme_id=${previewThemeId}` : ''}`);
  const launch = page.locator('.lemoon-launch');
  await expect(launch).toBeVisible();
  const form = launch.locator('form');
  const consent = form.locator('input[type="checkbox"]');
  await expect(consent).not.toBeChecked();
  await form.locator('input[type="email"]').fill('synthetic@example.com');
  expect(await form.evaluate(form=>form.checkValidity())).toBe(false);
  await consent.check(); expect(await form.evaluate(form=>form.checkValidity())).toBe(true);
  expect(await launch.evaluate(el=>getComputedStyle(el.parentElement).backgroundColor)).toBe('rgb(255, 255, 255)');
  await expect(page.locator('password-modal summary')).toBeVisible();
  await noOverflow(page);
  await page.locator('password-modal summary').click();
  const password = page.getByLabel('Tu contraseña', { exact: true });
  await expect(password).toBeVisible();
  await expect(password).toHaveAttribute('type', 'password');
  await expect(password).toHaveAttribute('autocomplete', 'current-password');
  // No subscription or password is submitted.
  } finally { await context.close(); }
});
