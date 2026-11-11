import { test, expect } from '@playwright/test';

async function setup(page, { root = true, width = 390 } = {}) {
  await page.setViewportSize({ width, height: 800 });
  await page.goto('/tests/fixtures/mobile-search.html');
  await page.evaluate(() => history.replaceState({}, '', '/apps/page/wishlist'));
  await page.setContent(`<!doctype html><html lang="es"><head><link rel="stylesheet" href="/assets/lemoon-tokens.css"><link rel="stylesheet" href="/assets/lemoon-components.css"></head><body>
    <main id="MainContent">${root ? '<div class="vtl-proxy-page-wishlist"><div class="Vtl-WishlistPage__Products"></div><div class="Vtl-WishlistPage__AddAllToCart"><button>Agregar todo al carrito</button></div></div>' : ''}</main>
    <button id="unrelated">Agregar al carrito</button>
  </body></html>`);
  await page.evaluate(() => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = '/assets/lemoon-favourite-feedback.js';
    script.dataset.wishlistViewProduct = 'Ver producto';
    script.onload = resolve;
    script.onerror = reject;
    document.body.append(script);
  }));
}

async function addCard(page, href, title = 'Montura') {
  await page.locator('.Vtl-WishlistPage__Products').evaluate((list, input) => {
    const card = document.createElement('article');
    card.className = 'Vtl-WishlistProduct';
    const link = document.createElement('a');
    link.className = 'Vtl-WishlistProduct__Link';
    link.href = input.href;
    link.textContent = input.title;
    card.append(link);
    card.insertAdjacentHTML('beforeend', '<div class="Vtl-WishlistProduct__Options"><select aria-label="Talla"><option>Mediana</option></select><button class="Vtl-WishlistProduct__AddToCart">Agregar al carrito</button></div>');
    list.append(card);
  }, { href, title });
}

for (const width of [390, 1440]) {
  test(`wishlist card offers accessible PDP link and hides direct purchase at ${width}px`, async ({ page }) => {
    await setup(page, { width });
    await addCard(page, '/products/montura?variant=123');
    const card = page.locator('.Vtl-WishlistProduct');
    const link = card.getByRole('link', { name: 'Ver producto' });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', /\/products\/montura\?variant=123$/);
    await link.focus();
    await expect(link).toBeFocused();
    await expect(card.getByRole('button', { name: 'Agregar al carrito', includeHidden: true })).toBeHidden();
    await expect(page.getByRole('button', { name: 'Agregar todo al carrito', includeHidden: true })).toBeHidden();
    await expect(page.locator('#unrelated')).toBeVisible();
  });
}

test('dynamic cards and provider rerenders preserve one current link per card', async ({ page }) => {
  await setup(page);
  await addCard(page, '/products/primera');
  await addCard(page, '/es/products/segunda?variant=456', 'Segunda');
  const cards = page.locator('.Vtl-WishlistProduct');
  await expect(cards).toHaveCount(2);
  await expect(cards.nth(1).getByRole('link', { name: 'Ver producto' })).toHaveAttribute('href', /\/es\/products\/segunda\?variant=456$/);
  await cards.nth(0).locator('.Vtl-WishlistProduct__Link').evaluate(element => element.setAttribute('href', '/products/nueva?variant=789'));
  await expect(cards.nth(0).getByRole('link', { name: 'Ver producto' })).toHaveAttribute('href', /\/products\/nueva\?variant=789$/);
  await expect(cards.nth(0).getByRole('link', { name: 'Ver producto' })).toHaveCount(1);
  await cards.nth(0).evaluate(element => element.remove());
  await addCard(page, '/products/tercera', 'Tercera');
  await expect(page.locator('.Vtl-WishlistProduct').last().getByRole('link', { name: 'Ver producto' })).toBeVisible();
});

test('untrusted or missing product URLs cannot create misleading navigation', async ({ page }) => {
  await setup(page);
  await addCard(page, 'https://example.com/products/external');
  const card = page.locator('.Vtl-WishlistProduct');
  await expect(card.locator('.lemoon-wishlist-product-link')).toHaveCount(0);
  await card.locator('.Vtl-WishlistProduct__Link').evaluate(element => element.setAttribute('href', '/products/valid'));
  await expect(card.getByRole('link', { name: 'Ver producto' })).toBeVisible();
  await card.locator('.Vtl-WishlistProduct__Link').evaluate(element => element.remove());
  await expect(card.locator('.lemoon-wishlist-product-link')).toHaveCount(0);
});

test('wishlist root arriving after the theme script is initialized is adapted', async ({ page }) => {
  await setup(page, { root: false });
  await page.evaluate(() => document.querySelector('#MainContent').insertAdjacentHTML('beforeend', '<div class="vtl-proxy-page-wishlist"><div class="Vtl-WishlistPage__Products"></div></div>'));
  await addCard(page, '/products/tardia');
  await expect(page.locator('.Vtl-WishlistProduct').getByRole('link', { name: 'Ver producto' })).toBeVisible();
});

test('a replaced Vitals wrapper receives links on subsequent renders', async ({ page }) => {
  await setup(page);
  await addCard(page, '/products/primera');
  await expect(page.getByRole('link', { name: 'Ver producto' })).toBeVisible();
  await page.locator('.vtl-proxy-page-wishlist').evaluate(root => {
    root.outerHTML = '<div class="vtl-proxy-page-wishlist"><div class="Vtl-WishlistPage__Products"></div></div>';
  });
  await addCard(page, '/products/reemplazo');
  await expect(page.getByRole('link', { name: 'Ver producto' })).toHaveAttribute('href', /\/products\/reemplazo$/);
});
