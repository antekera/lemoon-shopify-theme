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

  await page.locator('.slider-button--next').click();
  await expect(page.locator('#Slide-fixture-2')).toHaveAttribute('aria-hidden', 'false');
});

test('uses a shorter announcement bar on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/tests/fixtures/announcement-bar.html');
  await page.addStyleTag({ content: 'html { font-size: 62.5%; }' });

  await expect(page.locator('.announcement-bar__message').first()).toHaveCSS('min-height', '32px');
  await expect.poll(() => page.locator('.lemoon-announcement-bar').evaluate((bar) => Math.round(bar.getBoundingClientRect().height))).toBe(32);
});
