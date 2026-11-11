import { test, expect } from '@playwright/test';

async function setup(page, width = 390) {
  await page.setViewportSize({ width, height: 800 });
  await page.goto('/tests/fixtures/mobile-search.html');
  await page.setContent(`<!doctype html><html lang="es"><body>
    <main id="MainContent"><div class="lemoon-product-heading"><h1>Montura</h1><span data-product-favourite-slot data-product-id="123"></span></div>
    <div id="media"></div>
    <div class="Vtl-CollectionCardWidget"><div class="Vtl-WishlistButton__WishlistIconButton" role="button" tabindex="0" aria-label="Añadir a la lista de deseos">Tarjeta</div></div>
    </main><div data-favourite-toast role="status" aria-live="polite" hidden><a href="/apps/page/wishlist">Agregado a la lista de favoritos</a><button type="button" data-favourite-toast-close aria-label="Cerrar">×</button></div>
  </body></html>`);
  await page.evaluate(() => {
    window.testSaved = false;
    window.testFail = false;
    window.syncHearts = () => document.querySelectorAll('.Vtl-WishlistButton__WishlistIconButton').forEach(button => {
      button.setAttribute('aria-label', window.testSaved ? 'Añadido a la lista de deseos' : 'Añadir a la lista de deseos');
    });
    window.newWidget = id => {
      const wrapper = document.createElement('div');
      wrapper.className = `Vtl-WishlistIcon__ProductPageWrapper Vtl-WishlistIcon__ProductPageWrapper--Id-${id}`;
      wrapper.innerHTML = '<div role="button" tabindex="0" class="Vtl-WishlistButton__WishlistIconButton" aria-label="Añadir a la lista de deseos">Producto</div>';
      return wrapper;
    };
    document.addEventListener('click', event => {
      if (!event.target.closest('.Vtl-WishlistButton__WishlistIconButton') || window.testFail) return;
      window.testSaved = !window.testSaved;
      window.syncHearts();
    });
    document.addEventListener('keydown', event => {
      if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('.Vtl-WishlistButton__WishlistIconButton')) event.target.click();
    });
  });
  await page.addScriptTag({ url: '/assets/lemoon-favourite-feedback.js' });
}

for (const width of [390, 1440]) {
  test(`provider widget binds asynchronously to the correct product at ${width}px`, async ({ page }) => {
    await setup(page, width);
    const slot = page.locator('[data-product-favourite-slot]');
    await expect(slot).toBeEmpty();
    await page.evaluate(() => document.querySelector('#media').append(window.newWidget('999')));
    await expect(slot).toBeEmpty();
    await page.evaluate(() => document.querySelector('#media').append(window.newWidget('123')));
    const heart = slot.getByRole('button', { name: 'Añadir a la lista de deseos' });
    await expect(heart).toBeVisible();
    await expect(slot.locator('.Vtl-WishlistIcon__ProductPageWrapper--Id-123')).toHaveCount(1);
    await expect(page.locator('#media .Vtl-WishlistIcon__ProductPageWrapper--Id-999')).toHaveCount(1);
    await slot.locator('.Vtl-WishlistIcon__ProductPageWrapper').evaluate(element => element.remove());
    await page.evaluate(() => document.querySelector('#media').append(window.newWidget('123')));
    await expect(heart).toBeVisible();
  });
}

test('PDP and card share provider state and toast appears only after adding', async ({ page }) => {
  await setup(page);
  await page.evaluate(() => document.querySelector('#media').append(window.newWidget('123')));
  const slot = page.locator('[data-product-favourite-slot]');
  const pdp = slot.getByRole('button');
  const card = page.locator('.Vtl-CollectionCardWidget').getByRole('button');
  const toast = page.locator('[data-favourite-toast]');
  await expect(pdp).toBeVisible();
  await pdp.click();
  await expect(pdp).toHaveAttribute('aria-label', 'Añadido a la lista de deseos');
  await expect(card).toHaveAttribute('aria-label', 'Añadido a la lista de deseos');
  await expect(toast).toBeVisible();
  await expect(toast.getByRole('link', { name: 'Agregado a la lista de favoritos', exact: true })).toHaveAttribute('href', '/apps/page/wishlist');
  await toast.getByRole('button', { name: 'Cerrar' }).click();
  await card.click();
  await expect(pdp).toHaveAttribute('aria-label', 'Añadir a la lista de deseos');
  await expect(card).toHaveAttribute('aria-label', 'Añadir a la lista de deseos');
  await expect(toast).toBeHidden();
  await card.click();
  await expect(toast).toBeVisible();
  await expect(pdp).toHaveAttribute('aria-label', 'Añadido a la lista de deseos');
});

test('unconfirmed provider operation never claims success and keyboard works', async ({ page }) => {
  await setup(page);
  await page.evaluate(() => document.querySelector('#media').append(window.newWidget('123')));
  const pdp = page.locator('[data-product-favourite-slot]').getByRole('button');
  await expect(pdp).toBeVisible();
  await page.evaluate(() => window.testFail = true);
  await pdp.click();
  await expect(page.locator('[data-favourite-toast]')).toBeHidden();
  await expect(pdp).toHaveAttribute('aria-label', 'Añadir a la lista de deseos');
  await page.evaluate(() => window.testFail = false);
  await pdp.focus();
  await page.keyboard.press('Enter');
  await expect(pdp).toHaveAttribute('aria-label', 'Añadido a la lista de deseos');
  await expect(page.locator('[data-favourite-toast]')).toBeVisible();
  await expect(pdp).toBeFocused();
});
