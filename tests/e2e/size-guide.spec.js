import { test, expect } from '@playwright/test';

for (const shell of ['standard', 'eyewear']) {
  for (const width of [390, 820, 1440]) {
    test(`${shell}: ${width}px keyboard, measurements, close and focus restoration`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(`/tests/fixtures/size-guide.html?shell=${shell}`);
      const opener = page.getByRole('button', { name: 'Guía de medidas', exact: true });
      await opener.click();
      const dialog = page.getByRole('dialog', { name: 'Guía de medidas' });
      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole('button', { name: 'Cerrar', exact: true })).toBeFocused();
      const measurements = dialog.getByRole('tabpanel', { name: 'Medidas' });
      await expect(measurements).toContainText('140 mm');
      await expect(measurements).toContainText('145 mm');
      await measurements.getByRole('combobox', { name: 'Unidad de medida', exact: true }).selectOption('in');
      await expect(measurements).toContainText('5.51 in');
      if (shell === 'eyewear') await expect(page.locator('[data-inline-measurements] [data-mm]').first()).toHaveText('140 mm');
      await measurements.getByRole('combobox', { name: 'Unidad de medida', exact: true }).selectOption('mm');
      await expect(measurements).toContainText('140 mm');
      const tabs = dialog.getByRole('tab');
      await tabs.nth(0).press('ArrowRight');
      await expect(tabs.nth(1)).toBeFocused();
      await expect(dialog.getByRole('tabpanel', { name: 'Características' })).toContainText('Acetato');
      await tabs.nth(1).press('End');
      await expect(tabs.nth(2)).toBeFocused();
      await expect(dialog.getByRole('tabpanel', { name: 'Talla y rostro' })).toContainText('Ovalado, corazón');
      await tabs.nth(2).press('ArrowRight');
      await expect(tabs.nth(0)).toBeFocused();
      await tabs.nth(0).press('End');
      await tabs.nth(2).press('Home');
      await expect(tabs.nth(0)).toBeFocused();
      await tabs.nth(0).press('Tab');
      await expect(measurements).toBeFocused();
      // Exercise every tab's current visible controls in both directions.
      for (let index = 0; index < 3; index++) {
        await tabs.nth(index).click();
        await tabs.nth(index).press('Tab');
        await expect(dialog.getByRole('tabpanel')).toBeFocused();
        for (const key of ['Tab', 'Shift+Tab']) for (let step = 0; step < 7; step++) {
          await page.keyboard.press(key);
          const focus = await dialog.evaluate(el => ({ contained: el.contains(document.activeElement), active: document.activeElement.outerHTML.slice(0, 160) }));
          expect(focus.contained, `tab ${index}, step ${step}, key ${key}, ${JSON.stringify(focus)}`).toBe(true);
        }
      }
      await tabs.nth(0).click();
      await expect.poll(() => dialog.evaluate(el => Math.round(el.getBoundingClientRect().right))).toBe(width);
      expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      for (const locator of [dialog.getByRole('button', { name: 'Cerrar', exact: true }), tabs.nth(0)]) {
        const bounds = await locator.boundingBox();
        expect(bounds.height).toBeGreaterThanOrEqual(44);
        expect(bounds.width).toBeGreaterThanOrEqual(44);
      }
      await page.screenshot({ path: testInfo.outputPath(`${shell}-${width}.png`) });
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
      await expect(opener).toBeFocused();
      await expect(page).toHaveURL(new RegExp(`shell=${shell}$`));
      await opener.click();
      await dialog.getByRole('button', { name: 'Cerrar', exact: true }).click();
      await expect(dialog).toBeHidden();
      await expect(opener).toBeFocused();
    });
  }
  test(`${shell}: partial and missing data never manufacture measurements`, async ({ page }) => {
    for (const scenario of ['partial', 'missing', 'empty-object', 'invalid', 'unknown']) {
      await page.goto(`/tests/fixtures/size-guide.html?shell=${shell}&scenario=${scenario}`);
      await page.getByRole('button', { name: 'Guía de medidas', exact: true }).click();
      const dialog = page.getByRole('dialog', { name: 'Guía de medidas' });
      if (scenario === 'partial') {
        await expect(dialog.locator('[data-mm]')).toHaveCount(2);
        await expect(dialog).toContainText('52 mm');
        await expect(dialog).toContainText('145 mm');
      } else {
        await expect(dialog.locator('[data-mm]')).toHaveCount(0);
        await expect(dialog.locator('[data-units]')).toHaveCount(0);
        await expect(dialog.getByRole('tabpanel', { name: 'Medidas' })).toContainText(/medidas/i);
        await dialog.getByRole('tab', { name: 'Características', exact: true }).click();
        await expect(dialog.getByRole('tabpanel', { name: 'Características' })).toContainText(/información|características/i);
        await dialog.getByRole('tab', { name: 'Talla y rostro', exact: true }).click();
        await expect(dialog.getByRole('tabpanel', { name: 'Talla y rostro' })).toContainText(/talla|calce|ajuste/i);
      }
    }
  });
  test(`${shell}: long content scrolls internally with a visible close control`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 600 });
    await page.goto(`/tests/fixtures/size-guide.html?shell=${shell}&scenario=long`);
    await page.getByRole('button', { name: 'Guía de medidas', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Guía de medidas' });
    const documentTop = await page.evaluate(() => window.scrollY);
    await expect.poll(() => dialog.evaluate(el => el.scrollHeight > el.clientHeight)).toBe(true);
    await dialog.evaluate(el => { el.scrollTop = el.scrollHeight; });
    await expect(dialog.getByRole('link', { name: 'Fin de las instrucciones' })).toBeInViewport();
    const close = dialog.getByRole('button', { name: 'Cerrar', exact: true });
    await expect(close).toBeInViewport();
    expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    expect(await page.evaluate(() => window.scrollY)).toBe(documentTop);
    await close.click();
    await expect(dialog).toBeHidden();
  });
}
