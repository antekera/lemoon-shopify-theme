import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

test('slides the footer accordion open and closed on mobile', async ({ page }) => {
  await page.goto('/tests/fixtures/footer-accordion.html');

  const menu = page.locator('.lemoon-footer__menu').first();
  const summary = menu.locator('summary');
  const content = menu.locator('.lemoon-footer__menu-content');

  await expect(menu).not.toHaveAttribute('open', '');
  await summary.click();
  await expect(menu).toHaveAttribute('open', '');
  const opening = await content.evaluate((element) => {
    const animation = element.getAnimations()[0];
    return animation && {
      state: animation.playState,
      frames: animation.effect.getKeyframes().map((frame) => frame.height),
    };
  });
  expect(opening?.state).toBe('running');
  expect(opening?.frames[0]).toBe('0px');
  expect(Number.parseFloat(opening?.frames[1])).toBeGreaterThan(0);

  await summary.click();
  const closing = await content.evaluate((element) => {
    const animation = element.getAnimations()[0];
    return animation && animation.effect.getKeyframes().map((frame) => frame.height);
  });
  expect(Number.parseFloat(closing?.[0])).toBeGreaterThan(0);
  expect(closing?.[1]).toBe('0px');
  await expect(menu).not.toHaveAttribute('open', '');
});

test('shows four open footer link columns on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/tests/fixtures/footer-accordion.html');

  const menus = page.locator('.lemoon-footer__menu');
  const columnCount = await page.locator('.lemoon-footer__menus').evaluate((element) =>
    getComputedStyle(element).gridTemplateColumns.split(' ').length
  );

  expect(columnCount).toBe(4);
  await expect(menus).toHaveCount(4);
  for (const menu of await menus.all()) {
    await expect(menu).toHaveAttribute('open', '');
    await expect(menu.locator('.lemoon-footer__menu-content a').first()).toBeVisible();
    await menu.locator('summary').click();
    await expect(menu).toHaveAttribute('open', '');
  }
});
