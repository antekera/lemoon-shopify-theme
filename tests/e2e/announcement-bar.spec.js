import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 800 } });

test('shows desktop controls and pauses announcement autoplay for reduced motion', async ({ page }) => {
  await page.goto('/tests/fixtures/announcement-bar.html');
  await expect(page.locator('.slider-button--prev')).toBeHidden();
  await expect(page.locator('.slider-button--next')).toBeHidden();

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.slider-button--prev')).toBeVisible();
  await expect(page.locator('.slider-button--next')).toBeVisible();
  await expect(page.locator('#Slider-fixture')).toHaveAttribute('aria-live', 'polite');
});
