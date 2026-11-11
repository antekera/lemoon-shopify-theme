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

test('mobile announcement controls stay inside a 320px viewport and remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/tests/fixtures/announcement-bar.html');
  await page.addStyleTag({ content: 'html { font-size: 62.5%; } body { margin: 0; }' });
  await page.evaluate(() => {
    const bar = document.querySelector('.lemoon-announcement-bar');
    const wrapper = document.createElement('div');
    wrapper.className = 'utility-bar__grid page-width';
    wrapper.append(bar.querySelector('slideshow-component'));
    bar.append(wrapper);
  });
  const previous = page.getByRole('button', { name: 'Previous announcement' });
  const next = page.getByRole('button', { name: 'Next announcement' });
  await expect(previous).toBeVisible();
  await expect(next).toBeVisible();
  const first = await previous.boundingBox();
  const last = await next.boundingBox();
  expect(first.x).toBeGreaterThanOrEqual(0);
  expect(last.x + last.width).toBeLessThanOrEqual(320);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await next.click();
  await expect(page.locator('#Slide-fixture-2')).toHaveAttribute('aria-hidden', 'false');
});
