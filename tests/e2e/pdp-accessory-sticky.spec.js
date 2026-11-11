import { expect, test } from '@playwright/test';

test('mobile accessory sticky action forwards once and mirrors the source loading state', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/tests/fixtures/mobile-search.html');
  await page.setContent(`<!doctype html><html lang="es"><head><style>html{font-size:62.5%}body{margin:0}</style></head><body>
    <product-info style="display:block; min-height:2200px">
      <button type="button" class="product-form__submit">Agregar al carrito</button>
      <lemoon-sticky-purchase class="lemoon-sticky-purchase" hidden>
        <div class="lemoon-sticky-purchase__inner"><span>Funda</span><strong data-sticky-price>$8.900</strong>
          <button type="button" data-sticky-add>Agregar al carrito</button>
        </div>
      </lemoon-sticky-purchase>
    </product-info>
  </body></html>`);
  await page.addStyleTag({ url: '/assets/lemoon-pdp-layout.css' });
  await page.addScriptTag({ url: '/assets/lemoon-pdp-tools.js', type: 'module' });
  const source = page.locator('.product-form__submit');
  const sticky = page.locator('lemoon-sticky-purchase');
  const action = sticky.getByRole('button', { name: 'Agregar al carrito' });
  await page.evaluate(() => {
    window.testSubmitCount = 0;
    document.querySelector('.product-form__submit').addEventListener('click', event => {
      window.testSubmitCount += 1;
      event.currentTarget.setAttribute('aria-disabled', 'true');
    });
  });
  await expect(sticky).toBeHidden();
  await page.evaluate(() => scrollTo(0, 600));
  await expect(sticky).toBeVisible();
  await expect(action).toBeEnabled();
  await action.click();
  await expect.poll(() => page.evaluate(() => window.testSubmitCount)).toBe(1);
  await expect(action).toBeDisabled();
  await action.evaluate(button => button.click());
  expect(await page.evaluate(() => window.testSubmitCount)).toBe(1);
  await source.evaluate(button => button.removeAttribute('aria-disabled'));
  await expect(action).toBeEnabled();
});

for (const width of [320, 390, 1440]) test(`cart loading keeps its label centered at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 844 });
  await page.goto('/tests/fixtures/mobile-search.html');
  await page.setContent(`<!doctype html><html lang="es"><head><style>html{font-size:62.5%}body{margin:0}</style></head><body>
    <div class="lemoon-standard-pdp"><button class="product-form__submit button button--full-width" type="button">
      <span>Agregar al carrito</span><div class="loading__spinner hidden"><svg class="spinner"><path class="path"></path></svg></div>
    </button></div>
  </body></html>`);
  for (const file of ['lemoon-tokens.css', 'base.css', 'lemoon-components.css', 'lemoon-pdp-layout.css']) {
    await page.addStyleTag({ url: `/assets/${file}` });
  }
  const button = page.locator('.product-form__submit');
  const label = button.locator('span');
  const before = await label.boundingBox();
  await button.evaluate(element => {
    element.classList.add('loading');
    element.setAttribute('aria-disabled', 'true');
    element.querySelector('.loading__spinner').classList.remove('hidden');
  });
  const after = await label.boundingBox();
  const spinner = await button.locator('.loading__spinner').boundingBox();
  expect(Math.abs((before.x + before.width / 2) - (after.x + after.width / 2))).toBeLessThan(1);
  expect(spinner.x).toBeGreaterThanOrEqual(after.x + after.width);
  await expect(button).toHaveCSS('background-color', 'rgb(247, 230, 0)');
  await expect(button).toHaveCSS('opacity', '1');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
});
