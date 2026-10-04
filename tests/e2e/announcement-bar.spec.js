import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 800 } });

test('shows desktop controls and pauses announcement autoplay for reduced motion', async ({ page }) => {
  await page.goto('/tests/fixtures/announcement-bar.html');
  await expect(page.locator('.slider-button--prev')).toBeHidden();
  await expect(page.locator('.slider-button--next')).toBeHidden();

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.slider-button--prev')).toBeVisible();
  await expect(page.locator('.slider-button--next')).toBeVisible();
  const previous = page.locator('.slider-button--prev');
  await expect(previous).toHaveCSS('border-top-width', '1px');
  await expect(previous).toHaveCSS('border-radius', '50%');
  expect((await previous.boundingBox()).width).toBe(48);
  const arrow = await previous.locator('.icon').boundingBox();
  expect(arrow.width).toBeGreaterThanOrEqual(28);
  expect(arrow.height).toBeGreaterThanOrEqual(18);
  await expect(page.locator('#Slider-fixture')).toHaveAttribute('aria-live', 'polite');

  await page.locator('.slider-button--next').click();
  await expect(page.locator('#Slide-fixture-2')).toHaveAttribute('aria-hidden', 'false');
});
