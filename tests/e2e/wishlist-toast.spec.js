import { test, expect } from '@playwright/test';

async function setup(page, width = 390) {
  await page.setViewportSize({ width, height: 800 });
  await page.goto('/tests/fixtures/mobile-search.html');
  await page.setContent(`<!doctype html><html lang="es"><body>
    <button data-favourite aria-pressed="false">Favorito local PDP</button>
    <div class="Vtl-CollectionCardWidget"><div class="Vtl-WishlistButton__WishlistIconButton" role="button" tabindex="0" aria-label="Añadir a la lista de deseos"><span>Corazón</span></div></div>
    <div data-favourite-toast role="status" aria-live="polite" aria-atomic="true" hidden>
      <a href="/apps/page/wishlist">Agregado a la lista de favoritos</a>
      <button type="button" data-favourite-toast-close aria-label="Cerrar">×</button>
    </div>
  </body></html>`);
  await page.addScriptTag({ url: '/assets/lemoon-favourite-feedback.js' });
}

for (const width of [390, 1440]) {
  test(`confirmed card save shows an accessible wishlist link at ${width}px`, async ({ page }) => {
    await setup(page, width);
    const toast = page.locator('[data-favourite-toast]');
    const heart = page.getByRole('button', { name: 'Añadir a la lista de deseos' });
    await expect(toast).toBeHidden();
    await heart.click();
    // The app has not yet reported a successful save.
    await expect(toast).toBeHidden();
    await heart.evaluate(node => node.setAttribute('aria-label', 'Quitar de la lista de deseos'));
    await expect(toast).toBeVisible();
    await expect(toast).toHaveAttribute('role', 'status');
    await expect(toast).toHaveAttribute('aria-live', 'polite');
    await expect(toast.getByRole('link', { name: 'Agregado a la lista de favoritos', exact: true })).toHaveAttribute('href', '/apps/page/wishlist');
    await expect(toast.getByRole('link')).toHaveCount(1);
    await expect(toast).toContainText('Agregado a la lista de favoritos');
    await expect(toast.locator('span')).toHaveCount(0);
    await toast.getByRole('button', { name: 'Cerrar' }).click();
    await expect(toast).toBeHidden();
    await page.getByRole('button', { name: 'Quitar de la lista de deseos' }).click();
    await page.getByRole('button', { name: 'Quitar de la lista de deseos' }).evaluate(node => node.setAttribute('aria-label', 'Añadir a la lista de deseos'));
    await expect(toast).toBeHidden();
  });
}

test('keyboard activation waits for the app confirmation and leaves focus unchanged', async ({ page, browserName }) => {
  await setup(page);
  await page.evaluate(() => {
    const heart = document.querySelector('.Vtl-WishlistButton__WishlistIconButton');
    heart.addEventListener('keydown', event => {
      if (event.key === 'Enter') heart.setAttribute('aria-label', 'Quitar de la lista de deseos');
    });
  });
  const heart = page.getByRole('button', { name: 'Añadir a la lista de deseos' });
  await heart.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-favourite-toast]')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Quitar de la lista de deseos' })).toBeFocused();
  await page.keyboard.press(browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab');
  await expect(page.getByRole('link', { name: 'Agregado a la lista de favoritos', exact: true })).toBeFocused();
});

test('a rejected or unconfirmed save and a local PDP action never claim app-list success', async ({ page }) => {
  await setup(page);
  const toast = page.locator('[data-favourite-toast]');
  await page.getByRole('button', { name: 'Añadir a la lista de deseos' }).click();
  // App reports an error instead of changing the wishlist state.
  await page.evaluate(() => document.body.dataset.vitalsError = 'failed');
  await expect(toast).toBeHidden();
  await page.getByRole('button', { name: 'Favorito local PDP' }).click();
  await page.getByRole('button', { name: 'Favorito local PDP' }).evaluate(node => node.setAttribute('aria-pressed', 'true'));
  await expect(toast).toBeHidden();
});

test('Vitals Añadido state confirms a card save; removal does not show another toast', async ({ page }) => {
  await setup(page);
  const toast = page.locator('[data-favourite-toast]');
  const heart = page.locator('.Vtl-CollectionCardWidget .Vtl-WishlistButton__WishlistIconButton');
  await heart.click();
  await expect(toast).toBeHidden();
  await heart.evaluate(element => element.setAttribute('aria-label', 'Añadido a la lista de deseos'));
  await expect(toast).toBeVisible();
  await toast.getByRole('button', { name: 'Cerrar' }).click();
  await heart.click();
  await heart.evaluate(element => element.setAttribute('aria-label', 'Añadir a la lista de deseos'));
  await expect(toast).toBeHidden();
});
