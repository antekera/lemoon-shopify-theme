import { expect, test } from '@playwright/test';

test('favourite feedback plays only on an explicit save, not on load or removal', async ({ page }) => {
  await page.goto('/tests/fixtures/mobile-search.html');
  await page.setContent(`<!doctype html><html><body>
    <div data-product-favourite-slot data-product-id="123"><div class="Vtl-WishlistIcon__ProductPageWrapper Vtl-WishlistIcon__ProductPageWrapper--Id-123"><div class="Vtl-WishlistButton__WishlistIconButton" role="button" tabindex="0" aria-label="Añadir a la lista de deseos">Producto</div></div></div>
    <div class="Vtl-CollectionCardWidget"><div class="Vtl-WishlistButton__WishlistIconButton" role="button" tabindex="0" aria-label="Añadir a la lista de deseos"><span>Corazón</span></div></div>
  </body></html>`);
  await page.evaluate(() => {
    window.testSounds = 0;
    class TestAudioContext {
      constructor() { this.state = 'running'; this.currentTime = 0; this.destination = {}; }
      createGain() { return { gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {} }; }
      createOscillator() { return { frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect(gain) { return gain; }, start() { window.testSounds += 1; }, stop() {} }; }
    }
    window.AudioContext = TestAudioContext;
    document.querySelectorAll('.Vtl-WishlistButton__WishlistIconButton').forEach(button => button.addEventListener('click', event => {
      const el = event.currentTarget;
      el.setAttribute('aria-label', el.getAttribute('aria-label').startsWith('Añadir') ? 'Añadido a la lista de deseos' : 'Añadir a la lista de deseos');
    }));
  });
  await page.addScriptTag({ url: '/assets/lemoon-favourite-feedback.js' });
  expect(await page.evaluate(() => window.testSounds)).toBe(0);
  const favourite = page.locator('[data-product-favourite-slot]').getByRole('button');
  await favourite.click();
  expect(await page.evaluate(() => window.testSounds)).toBe(1);
  await favourite.click();
  expect(await page.evaluate(() => window.testSounds)).toBe(1);
  const card = page.locator('.Vtl-CollectionCardWidget').getByRole('button');
  await card.click();
  expect(await page.evaluate(() => window.testSounds)).toBe(2);
  await expect(card).toHaveClass(/lemoon-favourite-animating/);
  await card.click();
  expect(await page.evaluate(() => window.testSounds)).toBe(2);
});
