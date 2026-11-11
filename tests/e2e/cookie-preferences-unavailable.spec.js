import { test, expect } from '@playwright/test';

test('unavailable privacy permissions show an error instead of an inaccurate preferences dialog', async ({ page }) => {
  await page.goto('/tests/fixtures/mobile-search.html');
  await page.setContent(`
    <footer data-lemoon-footer>
      <div data-cookie-preferences-control>
        <button data-cookie-preferences aria-controls="cookies">Preferencias de cookies</button>
        <span data-cookie-preferences-status data-unavailable="No disponibles" role="status"></span>
      </div>
    </footer>
    <dialog id="cookies" data-cookie-dialog>
      <input type="checkbox" data-cookie-purpose="analytics">
      <span data-cookie-error></span>
    </dialog>
  `);
  await page.evaluate(() => {
    document.documentElement.removeAttribute('data-lemoon-cookie-preferences-ready');
    window.Shopify = {customerPrivacy: {
      currentVisitorConsent: () => ({}),
      setTrackingConsent: () => { throw new Error('Unexpected consent write'); },
      analyticsProcessingAllowed: () => { throw new Error('Service unavailable'); },
      marketingAllowed: () => true,
      preferencesProcessingAllowed: () => true,
    }};
  });
  await page.addScriptTag({ type: 'module', url: '/assets/lemoon-cookie-preferences.js' });
  await page.getByRole('button', {name: 'Preferencias de cookies'}).click();
  await expect(page.getByRole('status')).toHaveText('No disponibles');
  await expect(page.locator('[data-cookie-dialog]')).not.toBeVisible();
});
