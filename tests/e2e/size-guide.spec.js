import { test, expect } from '@playwright/test';
import { doubleRenderedText, clippedSvgLabels } from '../helpers/text-resize.mjs';

const openerFor = page => page.getByRole('button', { name: 'Guía de medidas', exact: true });
const dialogFor = page => page.getByRole('dialog', { name: 'Guía de medidas' });
const closeFor = dialog => dialog.getByRole('button', { name: 'Cerrar guía de medidas', exact: true });
const completeValues = ['A: 140 mm', 'B: 52 mm', 'C: 18 mm', 'D: 42 mm', 'E: 145 mm'];
const unavailableValues = ['A: —', 'B: —', 'C: —', 'D: —', 'E: —'];
const referencesFor = dialog => dialog.locator('.lemoon-measurement-diagram__values');
async function expectReferenceValues(dialog, values) {
  const references = referencesFor(dialog);
  await expect(references.locator(':scope > div')).toHaveCount(5);
  await expect(references.locator('dt')).toHaveText(['Ancho total', 'Ancho del cristal', 'Puente', 'Alto del cristal', 'Largo de patilla']);
  await expect(references.locator('dd')).toHaveText(values);
  for (const term of await references.locator('dt').all()) await expect(term).toBeVisible();
}
async function pressKey(page, key) {
  // macOS Safari's Option-Tab includes links regardless of the user's Tab preference.
  // https://support.apple.com/en-gb/guide/safari/cpsh003/mac
  const includeLinks = process.platform === 'darwin' && page.context().browser()?.browserType().name() === 'webkit';
  await page.keyboard.press(includeLinks && key.includes('Tab') ? `Alt+${key}` : key);
}
async function comparisonPosition(dialog, nextFrame = false) {
  return dialog.evaluate((element, waitFrame) => {
    const measure = () => {
      const summary = element.querySelector('details.lemoon-size-guide__comparison > summary');
      const panel = element.getBoundingClientRect();
      const heading = summary.getBoundingClientRect();
      const close = element.querySelector('[data-size-close], [data-close-dialog]').getBoundingClientRect();
      const title = summary.querySelector(':scope > span').getBoundingClientRect();
      const caret = summary.querySelector('svg').getBoundingClientRect();
      const overlaps = box => box.left < close.right && box.right > close.left && box.top < close.bottom && box.bottom > close.top;
      // The full-width heading reads below the close control, using the panel's CSS offset.
      const readingTop = parseFloat(getComputedStyle(element).scrollPaddingTop);
      return { offset: heading.top - panel.top - readingTop, readingTop, summaryTop: heading.top, closeTop: close.top - panel.top, titleOverlapsClose: overlaps(title), caretOverlapsClose: overlaps(caret), documentTop: window.scrollY, focused: document.activeElement === summary };
    };
    return waitFrame ? new Promise(resolve => requestAnimationFrame(() => resolve(measure()))) : measure();
  }, nextFrame);
}
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
async function expectPlacement(dialog, width, height) {
  await expect.poll(() => dialog.evaluate(element => Math.round(element.getBoundingClientRect().right))).toBe(width);
  await expect.poll(() => dialog.evaluate(element => Math.round(element.getBoundingClientRect().bottom))).toBe(height);
  const bounds = await dialog.boundingBox();
  if (width < 750) {
    expect(bounds.y).toBeGreaterThanOrEqual(32);
    expect(Math.round(bounds.width)).toBe(width);
    await expect(dialog).toHaveCSS('border-top-left-radius', '16px');
    await expect(dialog).toHaveCSS('border-top-right-radius', '16px');
  } else {
    expect(Math.round(bounds.y)).toBe(0);
    expect(Math.round(bounds.width)).toBe(480);
  }
  expect(Math.round(bounds.x + bounds.width)).toBe(width);
  expect(await dialog.evaluate(element => getComputedStyle(element, '::backdrop').backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');
}

for (const shell of ['standard', 'eyewear']) {
  for (const [width, height] of [[390, 844], [749, 900], [750, 900], [820, 1180], [1440, 900]]) {
    test(`${shell}: ${width}px product measurements, disclosure keyboard and responsive modal`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height });
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      const dialog = await openGuide(page, shell);
      await expectPlacement(dialog, width, height);
      await page.evaluate(() => document.fonts.ready);
      await expect(closeFor(dialog)).toBeFocused();
      await expect(dialog.getByRole('tab')).toHaveCount(0);
      await expect(dialog.getByRole('tabpanel')).toHaveCount(0);
      await expect(dialog.getByRole('heading', { level: 2 })).toHaveCount(1);
      await expect(dialog.getByRole('heading', { level: 2 })).toHaveCSS('font-size', '20px');
      await expect(closeFor(dialog)).toHaveCSS('font-size', '32px');
      const titleBox = await dialog.getByRole('heading', { level: 2 }).boundingBox();
      const dialogBox = await dialog.boundingBox();
      expect(titleBox.y - dialogBox.y).toBeLessThan(40);
      const values = dialog.locator('.lemoon-measurement-diagram text tspan');
      await expect(values).toHaveCount(5);
      for (const value of await values.all()) {
        await expect(value).toHaveCSS('font-size', '12px');
        expect(await value.evaluate(node => parseFloat(getComputedStyle(node.parentElement).fontSize))).toBeGreaterThan(12);
      }
      await expect(dialog.locator('details.lemoon-size-guide__comparison > summary')).toHaveCSS('font-size', '16px');
      const badge = page.locator('.lemoon-pdp__size-row strong').first();
      await expect(badge).toHaveCSS('border-top-width', '0px');
      expect(parseFloat(await badge.evaluate(node => getComputedStyle(node).borderRadius))).toBeGreaterThanOrEqual(100);
      await expect(dialog.locator('h3').first()).toContainText('Medidas');
      await expect(dialog.locator('[data-mm], [data-units], .lemoon-size-guide__specs')).toHaveCount(0);
      for (const productText of ['Armazón sintético', 'Acetato', 'Ovalado, corazón']) await expect(dialog).not.toContainText(productText);
      await expectReferenceValues(dialog, completeValues);
      await expect(dialog.locator('.lemoon-measurement-definitions')).toHaveCount(0);
      await expect(dialog).not.toContainText('Mide en línea horizontal');
      await expect(dialog).not.toContainText('Mide un solo cristal');
      const comparison = dialog.locator('details.lemoon-size-guide__comparison');
      const guideLink = comparison.locator('a');
      const helpText = comparison.getByText('¿Tienes más dudas?', { exact: true });
      await expect(guideLink).toHaveAttribute('href', '/pages/como-medir-tus-lentes');
      await expect(guideLink).toHaveText('Cómo medir tus lentes');
      const summary = comparison.locator('summary');
      await expect(comparison).not.toHaveAttribute('open');
      await expect(comparison.locator('.lemoon-size-comparison')).toBeHidden();
      await expect(summary.locator('svg')).toHaveAttribute('aria-hidden', 'true');
      await expect(guideLink).toBeHidden(); await expect(helpText).toBeHidden();
      await closeFor(dialog).focus(); await pressKey(page, 'Tab'); await expect(summary).toBeFocused();
      await pressKey(page, 'Tab'); await expect(closeFor(dialog)).toBeFocused();
      await pressKey(page, 'Shift+Tab'); await expect(summary).toBeFocused();
      const documentTop = await page.evaluate(() => window.scrollY);
      await pressKey(page, 'Enter'); await expect(comparison).toHaveAttribute('open');
      await expect.poll(async () => Math.abs((await comparisonPosition(dialog)).offset)).toBeLessThanOrEqual(1);
      const normalPosition = await comparisonPosition(dialog);
      expect(normalPosition.readingTop).toBe(64);
      expect(normalPosition.closeTop).toBeCloseTo(8, 0);
      expect(normalPosition.focused).toBe(true);
      expect(normalPosition.documentTop).toBe(documentTop);
      expect(normalPosition.titleOverlapsClose).toBe(false);
      expect(normalPosition.caretOverlapsClose).toBe(false);
      await expect(closeFor(dialog)).toBeInViewport();
      await expect(comparison.locator('.lemoon-size-comparison')).toBeVisible();
      await expect(comparison.locator('.lemoon-size-comparison__inscription')).toBeVisible();
      await expect(comparison.locator('figcaption')).toContainText('Ejemplo educativo.');
      await expect(comparison.locator('.lemoon-size-comparison__rows')).toHaveCount(0);
      await expect(guideLink).toBeVisible(); await expect(helpText).toBeVisible();
      await pressKey(page, 'Tab'); await expect(guideLink).toBeFocused();
      await pressKey(page, 'Tab'); await expect(closeFor(dialog)).toBeFocused();
      await pressKey(page, 'Shift+Tab'); await expect(guideLink).toBeFocused();
      await pressKey(page, 'Shift+Tab'); await expect(summary).toBeFocused();
      await pressKey(page, 'Space'); await expect(comparison).not.toHaveAttribute('open');
      await expect(guideLink).toBeHidden(); await expect(helpText).toBeHidden();
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await comparison.evaluate(element => {
        window.reducedComparisonOpened = new Promise(resolve => {
          const opened = () => {
            if (!element.open) return;
            element.removeEventListener('toggle', opened);
            resolve();
          };
          element.addEventListener('toggle', opened);
        });
      });
      await pressKey(page, 'Enter'); await expect(comparison).toHaveAttribute('open');
      await page.evaluate(() => window.reducedComparisonOpened);
      const reducedPosition = await comparisonPosition(dialog, true);
      expect(Math.abs(reducedPosition.offset)).toBeLessThanOrEqual(1);
      expect(reducedPosition.readingTop).toBe(64);
      expect(reducedPosition.closeTop).toBeCloseTo(8, 0);
      expect(reducedPosition.focused).toBe(true);
      expect(reducedPosition.documentTop).toBe(documentTop);
      expect(reducedPosition.titleOverlapsClose).toBe(false);
      expect(reducedPosition.caretOverlapsClose).toBe(false);
      await expect(closeFor(dialog)).toBeInViewport();
      await testInfo.attach('comparison-position.json', { body: JSON.stringify({ normalPosition, reducedPosition, width, shell }, null, 2), contentType: 'application/json' });
      await pressKey(page, 'Space'); await expect(comparison).not.toHaveAttribute('open');
      await expect(guideLink).toBeHidden();

      await expect(page.locator('[data-inline-measurements] [data-mm="140"]')).toHaveText('140 mm');
      await closeFor(dialog).focus();
      for (const key of ['Tab', 'Shift+Tab']) for (let step = 0; step < 9; step++) {
        await pressKey(page, key);
        expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
      }
      await expectPlacement(dialog, width, height);
      await expectNoOverflow(page, dialog, width);
      const closeBounds = await closeFor(dialog).boundingBox();
      expect(closeBounds.width).toBeGreaterThanOrEqual(44); expect(closeBounds.height).toBeGreaterThanOrEqual(44);
      const drawings = dialog.locator('.lemoon-measurement-diagram svg');
      expect(await drawings.count()).toBe(2);
      const first = await drawings.nth(0).boundingBox(), second = await drawings.nth(1).boundingBox();
      expect(second.y).toBeGreaterThanOrEqual(first.y + first.height);
      const referenceBounds = await referencesFor(dialog).boundingBox();
      expect(referenceBounds.y).toBeGreaterThanOrEqual(second.y + second.height);
      expect(await dialog.locator('details').evaluate((element, top) => element.getBoundingClientRect().top >= top, referenceBounds.y + referenceBounds.height)).toBe(true);
      const duplicateIds = await page.locator('[id]').evaluateAll(elements => elements.map(el => el.id).filter((id, index, values) => values.indexOf(id) !== index));
      expect(duplicateIds).toEqual([]);
      await dialog.evaluate(el => { el.scrollTop = 0; });
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: testInfo.outputPath(`${shell}-${width}.png`) });
      await pressKey(page, 'Escape');
      await expect(dialog).toBeHidden(); await expect(openerFor(page)).toBeFocused();
      await expect(page).toHaveURL(new RegExp(`shell=${shell}&scenario=complete$`));
      await openerFor(page).click(); await closeFor(dialog).click();
      await expect(dialog).toBeHidden(); await expect(openerFor(page)).toBeFocused();
      expect(errors).toEqual([]);
    });
  }

  for (const [width, height, closeAction] of [[390, 844, 'X'], [820, 1180, 'Escape'], [1440, 900, 'backdrop']]) {
    test(`${shell}: ${width}px ${closeAction} reopens size guide at top after inner scrolling`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height });
      const dialog = await openGuide(page, shell);
      await expectPlacement(dialog, width, height);
      await dialog.locator('summary').press('Enter');
      const comparison = page.locator('dialog.lemoon-size-drawer details.lemoon-size-guide__comparison');
      await expect(comparison).toHaveAttribute('open');
      await dialog.evaluate(element => { element.scrollTop = element.scrollHeight; });
      await expect.poll(() => dialog.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
      const beforeClose = await dialog.evaluate(element => element.scrollTop);
      if (closeAction === 'X') await closeFor(dialog).click();
      else if (closeAction === 'Escape') await pressKey(page, 'Escape');
      else {
        const bounds = await dialog.boundingBox();
        await page.mouse.click(bounds.x - 8, bounds.y + bounds.height / 2);
      }
      await expect(dialog).toBeHidden();
      await expect(comparison).not.toHaveAttribute('open');
      await expect(openerFor(page)).toBeFocused();
      await openerFor(page).click();
      await expect(dialog).toBeVisible();
      await expect(comparison).not.toHaveAttribute('open');
      const afterOpen = await dialog.evaluate(element => element.scrollTop);
      await testInfo.attach('reopen-scroll.json', { body: JSON.stringify({ beforeClose, afterOpen, closeAction, width, shell }, null, 2), contentType: 'application/json' });
      await expect.poll(() => dialog.evaluate(element => element.scrollTop)).toBe(0);
      await expect(closeFor(dialog)).toBeFocused();
      await expect(dialog.getByRole('heading', { level: 2 })).toBeInViewport();
      await expect(dialog.locator('h3').first()).toBeInViewport();
      await expectNoOverflow(page, dialog, width);
      if (shell === 'standard' && width === 390 && page.context().browser()?.browserType().name() === 'chromium') {
        // Reopen synchronously from native close while its discrete CSS exit is pending.
        await expectPlacement(dialog, width, height);
        await comparison.locator('summary').press('Enter');
        await expect(comparison).toHaveAttribute('open');
        await dialog.evaluate(element => {
          element.addEventListener('close', () => {
            const pending = element.getAnimations();
            window.formerSizeGuideExitCount = pending.length;
            window.formerSizeGuideExitFinished = Promise.allSettled(pending.map(animation => animation.finished));
            document.querySelector('[data-size-open]').click();
          }, { once: true });
          element.close();
        });
        await expect(dialog).toBeVisible();
        await expect.poll(() => page.evaluate(() => window.formerSizeGuideExitCount ?? 0)).toBeGreaterThan(0);
        await expect(comparison).not.toHaveAttribute('open');
        await expect.poll(() => dialog.evaluate(element => element.scrollTop)).toBe(0);
        await expectPlacement(dialog, width, height);
        await comparison.locator('summary').press('Enter');
        await expect(comparison).toHaveAttribute('open');
        await page.evaluate(() => window.formerSizeGuideExitFinished.then(() => new Promise(resolve => requestAnimationFrame(resolve))));
        await expect(comparison).toHaveAttribute('open');
      }
    });
  }

  test(`${shell}: product information keeps real mm values and identifies only tagged demo measurements`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const scenario of ['complete', 'demo']) {
      await page.goto(`/tests/fixtures/size-guide.html?shell=${shell}&scenario=${scenario}`);
      const inline = page.locator('[data-inline-measurements]');
      await expect(inline.getByRole('tab')).toHaveCount(2);
      await inline.getByRole('tab', { name: 'Medidas', exact: true }).click();
      await expect(inline.locator('[data-mm]')).toHaveCount(5);
      for (const value of [140, 52, 18, 42, 145]) await expect(inline.locator(`[data-mm="${value}"]`)).toHaveText(`${value} mm`);
      await expect(inline.locator('[data-units]')).toHaveCount(0);
      const overview = inline.locator('.lemoon-frame-information__diagram');
      await expect(overview.locator('figure')).toHaveCount(1);
      await expect(overview.locator('svg')).toHaveCount(2);
      await expect(overview).toContainText('Esquema de referencia, sin escala.');
      await expect(overview.locator('[data-mm], .lemoon-measurement-diagram__values')).toHaveCount(0);
      const notice = inline.locator('.lemoon-size-guide__demo-notice');
      await expect(notice).toHaveCount(scenario === 'demo' ? 1 : 0);
      if (scenario === 'demo') await expect(notice).toContainText('Medidas de prueba para revisar esta página.');
      await page.evaluate(() => document.fonts.ready);
      await inline.screenshot({ path: testInfo.outputPath(`${shell}-${scenario}-product-measurements.png`) });
      await openerFor(page).click();
      await expectReferenceValues(dialogFor(page), completeValues);
      await expect(dialogFor(page).locator('.lemoon-size-guide__demo-notice')).toHaveCount(scenario === 'demo' ? 1 : 0);
    }
  });

  test(`${shell}: modal uses only valid supplied values without inferring missing product dimensions`, async ({ page }) => {
    for (const scenario of ['partial', 'missing', 'empty-object', 'invalid', 'unknown', 'size-only', 'secondary-empty', 'long-title']) {
      const dialog = await openGuide(page, shell, scenario);
      const expected = scenario === 'partial' ? ['A: —', 'B: 52 mm', 'C: —', 'D: —', 'E: 145 mm'] : ['secondary-empty', 'long-title'].includes(scenario) ? completeValues : unavailableValues;
      await expectReferenceValues(dialog, expected);
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
    await dialog.locator('summary').press('Enter');
    await expect(dialog.locator('details')).toHaveAttribute('open');
    const guide = dialog.getByRole('link', { name: 'Cómo medir tus lentes', exact: true });
    await guide.focus(); await pressKey(page, 'Tab'); await expect(closeFor(dialog)).toBeFocused();
    await pressKey(page, 'Shift+Tab'); await expect(guide).toBeFocused();
    await closeFor(dialog).click(); await expect(dialog).toBeHidden();
  });

  test(`${shell}: inline tabs retain arrows, Home, End and visible panel focus`, async ({ page }) => {
    await page.goto(`/tests/fixtures/size-guide.html?shell=${shell}`);
    const inline = page.locator('[data-inline-measurements]');
    const tabs = inline.getByRole('tab'); await expect(tabs).toHaveCount(2);
    await expect(tabs.nth(0)).toHaveText('Características');
    await expect(inline.getByRole('tabpanel', { name: 'Características' })).toContainText('Acetato');
    await expect(inline.getByRole('tabpanel', { name: 'Características' })).toContainText('Ovalado, corazón');
    await expect(inline.locator('.lemoon-frame-information__diagram')).toBeHidden();
    await tabs.nth(0).press('ArrowRight'); await expect(tabs.nth(1)).toBeFocused();
    await expect(inline.getByRole('tabpanel', { name: 'Medidas' })).toBeVisible();
    await expect(inline.locator('.lemoon-frame-information__diagram')).toBeVisible();
    await tabs.nth(1).press('ArrowRight'); await expect(tabs.nth(0)).toBeFocused();
    await tabs.nth(0).press('End'); await expect(tabs.nth(1)).toBeFocused();
    await tabs.nth(1).press('Home'); await expect(tabs.nth(0)).toBeFocused();
    await tabs.nth(0).press('Tab'); await expect(inline.getByRole('tabpanel', { name: 'Características' })).toBeFocused();
  });

  test(`${shell}: 320px with every rendered text and control doubled to 200%`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const dialog = await openGuide(page, shell, 'long-title');
    await dialog.locator('summary').press('Enter');
    await page.evaluate(() => document.fonts.ready);
    const sizes = await doubleRenderedText(dialog);
    expect(sizes.length).toBeGreaterThan(20);
    for (const size of sizes) expect(size.after, `${size.tag} ${size.className}: ${size.text}`).toBeCloseTo(size.before * 2, 3);
    expect(sizes.find(size => size.tag === 'H2').after).toBe(40);
    expect(sizes.filter(size => size.className === 'lemoon-measurement-diagram__marker')).toHaveLength(5);
    expect(sizes.filter(size => size.tag === 'DD')).toHaveLength(5);
    await expectReferenceValues(dialog, completeValues);
    await testInfo.attach('all-text-sizes.json', { body: JSON.stringify(sizes, null, 2), contentType: 'application/json' });
    await expectNoOverflow(page, dialog, 320);
    await expectPlacement(dialog, 320, 844);
    const clippedLabels = await clippedSvgLabels(dialog);
    await expect(closeFor(dialog)).toBeInViewport();
    await closeFor(dialog).focus();
    for (const key of ['Tab', 'Shift+Tab']) for (let index = 0; index < 7; index++) {
      await pressKey(page, key);
      expect(await dialog.evaluate(element => element.contains(document.activeElement))).toBe(true);
    }
    await dialog.evaluate(element => { element.scrollTop = 0; });
    await page.screenshot({ path: testInfo.outputPath(`${shell}-320-alltext200.png`) });
    await dialog.evaluate(element => { element.scrollTop = element.scrollHeight; });
    await expect(closeFor(dialog)).toBeInViewport();
    await expectNoOverflow(page, dialog, 320);
    await page.screenshot({ path: testInfo.outputPath(`${shell}-320-alltext200-bottom.png`) });
    await pressKey(page, 'Escape'); await expect(dialog).toBeHidden(); await expect(openerFor(page)).toBeFocused();
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
    await expectPlacement(dialog, 320, 844);
    await expect(closeFor(dialog)).toBeInViewport();
    await dialog.evaluate(el => { el.scrollTop = el.scrollHeight; });
    await expect(closeFor(dialog)).toBeInViewport();
    await page.screenshot({ path: testInfo.outputPath(`${shell}-320-text200.png`) });
    await pressKey(page, 'Escape'); await expect(dialog).toBeHidden(); await expect(openerFor(page)).toBeFocused();
  });
}

test('the selected full-guide link navigates from the modal to the canonical local guide', async ({ page, request }) => {
  const dialog = await openGuide(page, 'standard', 'long');
  await dialog.locator('summary').press('Enter');
  await expect(dialog.locator('details')).toHaveAttribute('open');
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
  expect(await localized.text()).toContain('href="/en/collections/all"');
});
