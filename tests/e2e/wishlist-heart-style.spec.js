import { test, expect } from '@playwright/test';

const navy = 'rgb(11, 31, 58)';
const white = 'rgb(255, 255, 255)';
const yellow = 'rgb(247, 230, 0)';

for (const [surface, wrapper] of [
  ['PDP', 'lemoon-product-heading__wishlist'],
  ['product card', 'Vtl-CollectionCardWidget'],
]) {
  test(`${surface} Vitals heart reflects hover and changing provider selection`, async ({ page }) => {
    await page.goto('/tests/fixtures/mobile-search.html');
    await page.setContent(`<!doctype html><html><head>
      <link rel="stylesheet" href="/assets/lemoon-tokens.css">
      <link rel="stylesheet" href="/assets/lemoon-components.css">
      </head><body><div class="${wrapper}">
      <button class="Vtl-WishlistButton__WishlistIconButton" aria-label="Añadir a la lista de deseos">
      <svg viewBox="0 0 512 512" style="--vtl-heart-outline: 1"><path d="M10 10h200v200z"></path><path d="M20 20h200v200z" style="opacity: 0; fill: red"></path></svg>
      </button></div><div id="outside" style="height:100px"></div></body></html>`);
    const button = page.getByRole('button', { name: 'Añadir a la lista de deseos' });
    const svg = button.locator('svg');
    const heart = svg.locator('path').last();
    await expect(heart).toHaveCSS('fill', white);
    await expect(heart).toHaveCSS('stroke', navy);
    await expect(heart).toHaveCSS('opacity', '1');
    await expect(svg).toHaveCSS('overflow', 'visible');
    await expect(heart).toHaveCSS('stroke-width', '40px');
    await expect(heart).toHaveCSS('paint-order', 'fill');
    await button.hover();
    await expect(heart).toHaveCSS('fill', white);
    await expect(heart).toHaveCSS('stroke', yellow);
    // Simulate only Vitals' DOM update; no click or app data mutation.
    await svg.evaluate(el => { el.style.setProperty('--vtl-heart-outline', '0'); el.style.setProperty('--vtl-heart-solid', '1'); });
    await expect(heart).toHaveCSS('fill', yellow);
    await expect(heart).toHaveCSS('stroke', yellow);
    await page.locator('#outside').hover();
    await expect(heart).toHaveCSS('fill', yellow);
    await expect(heart).toHaveCSS('stroke', yellow);
    await svg.evaluate(el => { el.style.removeProperty('--vtl-heart-solid'); el.style.setProperty('--vtl-heart-outline', '1'); });
    await expect(heart).toHaveCSS('fill', white);
    await expect(heart).toHaveCSS('stroke', navy);
    await expect(button).toHaveAttribute('aria-label', 'Añadir a la lista de deseos');
  });
}
