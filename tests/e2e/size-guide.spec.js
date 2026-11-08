import { test, expect } from '@playwright/test';
import { doubleRenderedText, clippedSvgLabels } from '../helpers/text-resize.mjs';

const openerFor = page => page.getByRole('button', { name: 'Guía de medidas', exact: true });
const dialogFor = page => page.getByRole('dialog', { name: 'Guía de medidas' });
const closeFor = dialog => dialog.getByRole('button', { name: 'Cerrar guía de medidas', exact: true });
async function openGuide(page, shell, scenario = 'complete') {
  await page.goto(`/tests/fixtures/size-guide.html?shell=${shell}&scenario=${scenario}`);
  await openerFor(page).click();
  await expect(dialogFor(page)).toBeVisible();
  return dialogFor(page);
}
async function expectNoOverflow(page, dialog, width) {
  expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
}

for (const shell of ['standard', 'eyewear']) {
  for (const [width, height] of [[390, 844], [820, 1180], [1440, 900]]) {
    test(`${shell}: ${width}px generic measurement reference, keyboard and close`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height });
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      const dialog = await openGuide(page, shell);
      await expect(closeFor(dialog)).toBeFocused();
      await expect(dialog.getByRole('tab')).toHaveCount(0);
      await expect(dialog.getByRole('tabpanel')).toHaveCount(0);
      await expect(dialog.getByRole('heading', { level: 2 })).toHaveCount(1);
      await expect(dialog.locator('h3').first()).toContainText('Medidas');
      await expect(dialog.locator('[data-mm], [data-units], .lemoon-size-guide__specs')).toHaveCount(0);
      for (const productText of ['Armazón sintético', '140 mm', '42 mm', 'Acetato', 'Ovalado, corazón']) await expect(dialog).not.toContainText(productText);
      await expect(dialog.locator('.lemoon-measurement-definitions > div')).toHaveCount(5);
      await expect(dialog.locator('.lemoon-size-comparison')).toContainText('Ejemplo educativo.');
      await expect(page.locator('[data-inline-measurements] [data-mm="140"]')).toHaveText('140 mm');
      await closeFor(dialog).focus();
      for (const key of ['Tab', 'Shift+Tab']) for (let step = 0; step < 9; step++) {
        await page.keyboard.press(key);
        expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
      }
      await expect.poll(() => dialog.evaluate(el => Math.round(el.getBoundingClientRect().right))).toBe(width);
      expect((await dialog.boundingBox()).width).toBeLessThanOrEqual(480);
      await expectNoOverflow(page, dialog, width);
      const closeBounds = await closeFor(dialog).boundingBox();
      expect(closeBounds.width).toBeGreaterThanOrEqual(44); expect(closeBounds.height).toBeGreaterThanOrEqual(44);
      const drawings = dialog.locator('.lemoon-measurement-diagram svg');
      expect(await drawings.count()).toBe(2);
      const first = await drawings.nth(0).boundingBox(), second = await drawings.nth(1).boundingBox();
      expect(second.y).toBeGreaterThanOrEqual(first.y + first.height);
      const duplicateIds = await page.locator('[id]').evaluateAll(elements => elements.map(el => el.id).filter((id, index, values) => values.indexOf(id) !== index));
      expect(duplicateIds).toEqual([]);
      await dialog.evaluate(el => { el.scrollTop = 0; });
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: testInfo.outputPath(`${shell}-${width}.png`) });
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden(); await expect(openerFor(page)).toBeFocused();
      await expect(page).toHaveURL(new RegExp(`shell=${shell}&scenario=complete$`));
      await openerFor(page).click(); await closeFor(dialog).click();
      await expect(dialog).toBeHidden(); await expect(openerFor(page)).toBeFocused();
      expect(errors).toEqual([]);
    });
  }

  test(`${shell}: product information keeps real mm values and identifies only tagged demo measurements`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const scenario of ['complete', 'demo']) {
      await page.goto(`/tests/fixtures/size-guide.html?shell=${shell}&scenario=${scenario}`);
      const inline = page.locator('[data-inline-measurements]');
      await expect(inline.getByRole('tab')).toHaveCount(3);
      await expect(inline.locator('[data-mm]')).toHaveCount(5);
      for (const value of [140, 52, 18, 42, 145]) await expect(inline.locator(`[data-mm="${value}"]`)).toHaveText(`${value} mm`);
      await expect(inline.locator('svg, figure, [data-units]')).toHaveCount(0);
      const notice = inline.locator('.lemoon-size-guide__demo-notice');
      await expect(notice).toHaveCount(scenario === 'demo' ? 1 : 0);
      if (scenario === 'demo') await expect(notice).toContainText('Medidas de prueba para revisar esta página.');
      await page.evaluate(() => document.fonts.ready);
      await inline.screenshot({ path: testInfo.outputPath(`${shell}-${scenario}-product-measurements.png`) });
      await openerFor(page).click();
      await expect(dialogFor(page).locator('[data-mm], .lemoon-size-guide__demo-notice')).toHaveCount(0);
    }
  });

  test(`${shell}: generic reference is independent of partial, missing, invalid or contextual product data`, async ({ page }) => {
    const baseline = await (await openGuide(page, shell)).innerHTML();
    for (const scenario of ['partial', 'missing', 'empty-object', 'invalid', 'unknown', 'size-only', 'secondary-empty', 'long-title']) {
      const dialog = await openGuide(page, shell, scenario);
      expect(await dialog.innerHTML()).toBe(baseline);
      const inline = page.locator('[data-inline-measurements]');
      if (scenario === 'partial') {
        await expect(inline.locator('[data-mm]')).toHaveCount(2);
        await expect(inline.locator('[data-mm="52"]')).toHaveText('52 mm'); await expect(inline.locator('[data-mm="145"]')).toHaveText('145 mm');
        await expect(inline).toContainText('Se muestran las medidas disponibles de este armazón.');
      } else if (!['secondary-empty', 'long-title'].includes(scenario)) {
        await expect(inline.locator('[data-mm]')).toHaveCount(0);
        await expect(inline).toContainText('Las medidas de este armazón aún no están disponibles.');
      }
      await expect(dialog.locator('[data-mm], [data-units]')).toHaveCount(0);
      await expect(dialog.locator('.lemoon-size-comparison')).toContainText('Ejemplo educativo.');
      await expect(dialog.getByRole('tab')).toHaveCount(0);
    }
  });

  test(`${shell}: long CMS body stays outside modal and close remains visible during inner scroll`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 600 });
    const dialog = await openGuide(page, shell, 'long');
    await expect(dialog).not.toContainText('Contenido sintético extenso');
    await expect(page.locator('[data-inline-measurements]')).not.toContainText('Contenido sintético extenso');
    const documentTop = await page.evaluate(() => window.scrollY);
    await expect.poll(() => dialog.evaluate(el => el.scrollHeight > el.clientHeight)).toBe(true);
    await dialog.evaluate(el => { el.scrollTop = el.scrollHeight; });
    await expect(closeFor(dialog)).toBeInViewport();
    await expectNoOverflow(page, dialog, 390);
    expect(await page.evaluate(() => window.scrollY)).toBe(documentTop);
    await closeFor(dialog).click(); await expect(dialog).toBeHidden();
  });

  test(`${shell}: inline tabs retain arrows, Home, End and visible panel focus`, async ({ page }) => {
    await page.goto(`/tests/fixtures/size-guide.html?shell=${shell}`);
    const inline = page.locator('[data-inline-measurements]');
    const tabs = inline.getByRole('tab'); await expect(tabs).toHaveCount(3);
    await tabs.nth(0).press('ArrowRight'); await expect(tabs.nth(1)).toBeFocused();
    await expect(inline.getByRole('tabpanel', { name: 'Características' })).toContainText('Acetato');
    await tabs.nth(1).press('End'); await expect(tabs.nth(2)).toBeFocused();
    await expect(inline.getByRole('tabpanel', { name: 'Talla y rostro' })).toContainText('Ovalado, corazón');
    await tabs.nth(2).press('ArrowRight'); await expect(tabs.nth(0)).toBeFocused();
    await tabs.nth(0).press('End'); await tabs.nth(2).press('Home'); await expect(tabs.nth(0)).toBeFocused();
    await tabs.nth(0).press('Tab'); await expect(inline.getByRole('tabpanel', { name: 'Medidas' })).toBeFocused();
  });

  test(`${shell}: 320px with every rendered text and control doubled to 200%`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const dialog = await openGuide(page, shell, 'long-title');
    await page.evaluate(() => document.fonts.ready);
    const sizes = await doubleRenderedText(dialog);
    expect(sizes.length).toBeGreaterThan(30);
    for (const size of sizes) expect(size.after, `${size.tag} ${size.className}: ${size.text}`).toBeCloseTo(size.before * 2, 3);
    expect(sizes.find(size => size.tag === 'H2').after).toBe(48);
    expect(sizes.some(size => size.className === 'lemoon-size-guide__note')).toBe(true);
    await testInfo.attach('all-text-sizes.json', { body: JSON.stringify(sizes, null, 2), contentType: 'application/json' });
    await expectNoOverflow(page, dialog, 320);
    const clippedLabels = await clippedSvgLabels(dialog);
    await expect(closeFor(dialog)).toBeInViewport();
    await closeFor(dialog).focus();
    for (const key of ['Tab', 'Shift+Tab']) for (let index = 0; index < 7; index++) {
      await page.keyboard.press(key);
      expect(await dialog.evaluate(element => element.contains(document.activeElement))).toBe(true);
    }
    await dialog.evaluate(element => { element.scrollTop = 0; });
    await page.screenshot({ path: testInfo.outputPath(`${shell}-320-alltext200.png`) });
    await dialog.evaluate(element => { element.scrollTop = element.scrollHeight; });
    await expect(closeFor(dialog)).toBeInViewport();
    await expectNoOverflow(page, dialog, 320);
    await page.screenshot({ path: testInfo.outputPath(`${shell}-320-alltext200-bottom.png`) });
    await page.keyboard.press('Escape'); await expect(dialog).toBeHidden(); await expect(openerFor(page)).toBeFocused();
    await openerFor(page).click(); await closeFor(dialog).click();
    await expect(dialog).toBeHidden(); await expect(openerFor(page)).toBeFocused();
    expect(clippedLabels).toEqual([]);
  });

  test(`${shell}: 320px reference reflow, 200% text and ignored long product name`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const dialog = await openGuide(page, shell, 'long-title');
    await page.addStyleTag({ content: 'html { font-size: 125% !important; }' });
    await expectNoOverflow(page, dialog, 320);
    await expect(closeFor(dialog)).toBeInViewport();
    await dialog.evaluate(el => { el.scrollTop = el.scrollHeight; });
    await expect(closeFor(dialog)).toBeInViewport();
    await page.screenshot({ path: testInfo.outputPath(`${shell}-320-text200.png`) });
    await page.keyboard.press('Escape'); await expect(dialog).toBeHidden(); await expect(openerFor(page)).toBeFocused();
  });
}

test('the selected full-guide link navigates from the modal to the canonical local guide', async ({ page, request }) => {
  const dialog = await openGuide(page, 'standard', 'long');
  const guide = dialog.getByRole('link', { name: 'Cómo medir tus lentes', exact: true });
  await expect(guide).toHaveAttribute('href', '/pages/como-medir-tus-lentes');
  const [response] = await Promise.all([
    page.waitForResponse(response => new URL(response.url()).pathname === '/pages/como-medir-tus-lentes'),
    guide.click(),
  ]);
  expect(response.status()).toBe(200);
  await expect(page).toHaveURL(/\/pages\/como-medir-tus-lentes$/);
  await expect(page.getByRole('heading', { name: 'Cómo medir tus lentes', level: 1, exact: true })).toBeVisible();
  await expect(page.locator('.lemoon-guide__steps > li')).toHaveCount(3);
  await expect(page.locator('dialog')).toHaveCount(0);
  const localized = await request.get('/en/pages/como-medir-tus-lentes');
  expect(localized.status()).toBe(200);
  expect(await localized.text()).toContain('href="/en/pages/contact"');
});
