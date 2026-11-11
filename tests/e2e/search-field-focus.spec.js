import { execFileSync } from 'node:child_process';
import { expect, test } from '@playwright/test';

const html = execFileSync(process.execPath, ['tests/helpers/search-renderer.mjs'], { encoding: 'utf8' });

for (const width of [390, 1280]) {
  for (const forced of [false, true]) {
    test(`search keyboard focus and shipping link at ${width}px, forced colors ${forced}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      if (forced) await page.emulateMedia({ forcedColors: 'active' });
      await page.route('**/tests/fixtures/mobile-search.html', route => route.fulfill({ contentType: 'text/html', body: html }));
      await page.goto('/tests/fixtures/mobile-search.html');
      const opener = page.locator('[data-lemoon-search-open]').filter({ visible: true });
      await opener.focus();
      await page.keyboard.press('Enter');
      const dialog = page.getByRole('dialog', { name: 'Buscar productos' });
      const input = dialog.getByRole('searchbox');
      await expect(input).toBeFocused();
      await expect(input).toHaveAttribute('name', 'q');
      await expect(input).toHaveAttribute('aria-controls', 'Lemoon-Mobile-Search-fixture-Results');
      await expect(dialog.getByRole('link', { name: 'Envíos y entregas' })).toHaveAttribute('href', '/pages/envios-y-entregas');
      const focused = await input.evaluate(node => { const c = getComputedStyle(node); const r = node.getBoundingClientRect(); return { border: parseFloat(c.borderTopWidth), color: c.borderTopColor, outline: c.outlineStyle, shadow: c.boxShadow, width: r.width, height: r.height }; });
      await page.keyboard.press('Tab');
      await expect(input).not.toBeFocused();
      const unfocused = await input.evaluate(node => { const c = getComputedStyle(node); const r = node.getBoundingClientRect(); return { border: parseFloat(c.borderTopWidth), color: c.borderTopColor, width: r.width, height: r.height }; });
      expect(focused.width).toBe(unfocused.width);
      expect(focused.height).toBe(unfocused.height);
      if (forced) expect(focused.outline).not.toBe('none');
      else {
        expect(focused.border).toBe(unfocused.border + 1);
        expect(focused.color).toBe(unfocused.color);
        expect(focused.outline).toBe('none');
        expect(focused.shadow).toBe('none');
      }
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
      await expect(opener).toBeFocused();
    });
  }
}
