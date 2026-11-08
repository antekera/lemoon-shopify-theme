import { test, expect } from '@playwright/test';
import { doubleRenderedText, clippedSvgLabels } from '../helpers/text-resize.mjs';

for (const [width, height] of [[390, 844], [820, 1180], [1440, 900]]) {
  test(`guide page: ${width}px three steps, original diagrams and localized destinations`, async ({ page }, testInfo) => {
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width, height });
    await page.goto('/tests/fixtures/size-guide-page.html');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Cómo medir tus lentes');
    await expect(page.locator('.lemoon-guide__steps > li')).toHaveCount(3);
    await expect(page.locator('.lemoon-guide__hero figure')).toHaveCount(0);
    await expect(page.locator('.lemoon-size-comparison')).toContainText('Ejemplo educativo. No representa las medidas de un producto específico.');
    await expect(page.locator('.lemoon-size-comparison h2')).toHaveCount(0);
    await expect(page.locator('.lemoon-measurement-diagram')).toHaveCount(1);
    await expect(page.locator('[data-mm], [data-units], dialog')).toHaveCount(0);
    const links = page.locator('.lemoon-guide__nav a'); await expect(links).toHaveCount(3);
    for (let step = 0; step < 3; step++) {
      await links.nth(step).focus(); await page.keyboard.press('Enter');
      const id = `Guide-measurement-page-fixture-${step + 1}`;
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expect(page.locator(`#${id}`)).toBeInViewport();
    }
    await expect(page.getByRole('link', { name: 'Ver catálogo', exact: true })).toHaveAttribute('href', '/collections/all');
    await expect(page.locator('.lemoon-guide__links a[href="/pages/contact"]')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    const ids = await page.locator('[id]').evaluateAll(elements => elements.map(el => el.id));
    expect(new Set(ids).size).toBe(ids.length);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: testInfo.outputPath(`guide-page-${width}.png`), fullPage: true });
    expect(errors).toEqual([]);
  });
}

test('guide page: editor overrides, empty richtext fallback and locale root', async ({ page }) => {
  await page.goto('/tests/fixtures/size-guide-page.html?scenario=editor&locale=en');
  for (const text of ['Introducción editable de prueba.', 'Cuerpo editorial de prueba.', 'Una indicación editable.', 'Ayuda editorial de prueba.']) await expect(page.getByText(text, { exact: true })).toBeVisible();
  await expect(page.locator('.lemoon-guide__steps h2').first()).toHaveText('Primero: revisa la patilla');
  await expect(page.locator('.lemoon-guide__nav a').first()).toHaveText('Primero: revisa la patilla');
  await expect(page.getByRole('link', { name: 'Ver catálogo', exact: true })).toHaveAttribute('href', '/en/collections/all');
  await expect(page.locator('.lemoon-guide__links a[href="/en/pages/contact"]')).toHaveCount(1);
  await page.goto('/tests/fixtures/size-guide-page.html?scenario=blank');
  expect((await page.locator('.lemoon-guide__intro').innerText()).trim().length).toBeGreaterThan(20);
  expect((await page.locator('.lemoon-guide__step').first().innerText()).trim().length).toBeGreaterThan(80);
  expect((await page.locator('.lemoon-guide__help').innerText()).trim().length).toBeGreaterThan(80);
  await expect(page.locator('p p')).toHaveCount(0);
});

for (const width of [749, 750, 989, 990]) {
  test(`guide page: ${width}px breakpoint has no horizontal overflow`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 }); await page.goto('/tests/fixtures/size-guide-page.html');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await expect(page.locator('.lemoon-guide__nav')).toHaveCSS('position', width < 990 ? 'static' : 'sticky');
  });
}

test('guide page: 320px reflow and 200% text accommodate a long CMS title', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 844 }); await page.goto('/tests/fixtures/size-guide-page.html?scenario=long');
  await page.addStyleTag({ content: 'html { font-size: 125% !important; }' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  for (const selector of ['.lemoon-guide__title', '.lemoon-size-comparison', '.lemoon-measurement-diagram']) expect(await page.locator(selector).evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('guide-page-320-text200.png'), fullPage: true });
});


test('guide page: 320px with every rendered text and control doubled to 200%', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/tests/fixtures/size-guide-page.html?scenario=long');
  await page.evaluate(() => document.fonts.ready);
  const guide = page.locator('[data-guide-kind="measurements"]');
  const sizes = await doubleRenderedText(guide);
  expect(sizes.length).toBeGreaterThan(35);
  for (const size of sizes) expect(size.after, `${size.tag} ${size.className}: ${size.text}`).toBeCloseTo(size.before * 2, 3);
  expect(sizes.find(size => size.tag === 'H1').after).toBe(68);
  await testInfo.attach('all-text-sizes.json', { body: JSON.stringify(sizes, null, 2), contentType: 'application/json' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  const clippedLabels = await clippedSvgLabels(guide);
  for (const selector of ['.lemoon-guide__title', '.lemoon-size-comparison', '.lemoon-measurement-diagram', '.lemoon-guide__help']) expect(await page.locator(selector).evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  const links = page.locator('.lemoon-guide__nav a');
  for (let index = 0; index < 3; index++) {
    await links.nth(index).focus(); await page.keyboard.press('Enter');
    await expect(page.locator(`#Guide-measurement-page-fixture-${index + 1}`)).toBeInViewport();
  }
  await page.screenshot({ path: testInfo.outputPath('guide-page-320-alltext200.png'), fullPage: true });
  expect(clippedLabels).toEqual([]);
});
