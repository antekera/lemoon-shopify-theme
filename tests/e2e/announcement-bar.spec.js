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

test('keeps visible announcement ink throughout the first autoplay transition', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/tests/fixtures/announcement-bar.html');
  await page.addStyleTag({ content: 'html { font-size: 62.5%; }' });
  const firstSlide = page.locator('#Slide-fixture-1');
  const secondSlide = page.locator('#Slide-fixture-2');
  await expect(firstSlide).toHaveAttribute('aria-hidden', 'false');

  await page.evaluate(() => {
    window.announcementInkSamples = [];
    window.trackAnnouncementInk = true;
    const bar = document.querySelector('.lemoon-announcement-bar');
    const slider = document.querySelector('#Slider-fixture');
    function sample() {
      const viewport = slider.getBoundingClientRect();
      const messages = [...bar.querySelectorAll('.announcement-bar__message')].map((message) => {
        const bounds = message.getBoundingClientRect();
        const style = getComputedStyle(message);
        return {
          opacity: Number(style.opacity),
          visibility: style.visibility,
          intersection: Math.max(0, Math.min(bounds.right, viewport.right) - Math.max(bounds.left, viewport.left)),
        };
      });
      window.announcementInkSamples.push({
        height: bar.getBoundingClientRect().height,
        visibleOpacity: Math.max(0, ...messages.filter((message) => message.intersection > 1 && message.visibility === 'visible').map((message) => message.opacity)),
      });
      if (window.trackAnnouncementInk) requestAnimationFrame(sample);
    }
    requestAnimationFrame(sample);
  });

  await expect(secondSlide).toHaveAttribute('aria-hidden', 'false', { timeout: 5000 });
  await expect(secondSlide.locator('.announcement-bar__message')).toHaveCSS('opacity', '1');
  const samples = await page.evaluate(() => {
    window.trackAnnouncementInk = false;
    return window.announcementInkSamples;
  });
  await testInfo.attach('first-announcement-transition', { body: JSON.stringify(samples), contentType: 'application/json' });
  expect(samples.length).toBeGreaterThan(2);
  expect(Math.min(...samples.map((sample) => sample.visibleOpacity))).toBeGreaterThanOrEqual(0.99);
  const heights = samples.map((sample) => sample.height);
  expect(Math.max(...heights) - Math.min(...heights)).toBeLessThanOrEqual(1);
});
