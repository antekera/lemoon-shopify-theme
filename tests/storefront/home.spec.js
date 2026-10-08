import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('lemoon-hero')).toBeVisible();
});

test('hero slides, dots and category action work together', async ({ page }) => {
  const hero = page.locator('lemoon-hero');
  const dots = hero.locator('[data-hero-index]');
  await expect(dots.first()).toHaveAttribute('aria-current', 'true');
  await hero.locator('[data-hero-next]').click();
  await expect(dots.nth(1)).toHaveAttribute('aria-current', 'true');
  await hero.locator('[data-hero-previous]').click();
  await expect(dots.first()).toHaveAttribute('aria-current', 'true');
  const action = hero.locator('.lemoon-hero__slide:not([aria-hidden]) .lemoon-hero__button').first();
  const destination = await action.getAttribute('href');
  await action.click();
  await expect(page).toHaveURL(new RegExp(destination.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  await expect(page.locator('.lemoon-plp-intro h1')).toBeVisible();
});

test('both hero buttons darken on hover without changing to white', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'Hover belongs to pointer devices.');
  for (const variant of ['primary', 'secondary']) {
    const button = page.locator(`.lemoon-hero__slide:not([aria-hidden]) .lemoon-hero__button--${variant}`);
    await page.mouse.move(0, 0);
    const before = await button.evaluate((el) => getComputedStyle(el).backgroundColor);
    await button.hover();
    const expected = variant === 'primary' ? 'rgb(223, 207, 0)' : 'rgb(230, 230, 230)';
    await expect(button).toHaveCSS('background-color', expected);
    expect(expected).not.toBe(before);
  }
});

test('hero controls select immediately and slide to the latest target', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.reload();
  const hero = page.locator('lemoon-hero');
  const startingPosition = await hero.evaluate((element) => {
    clearInterval(element.autoplayTimer);
    element.querySelector('[data-hero-index="2"]').click();
    return element.track.scrollLeft / element.track.clientWidth;
  });
  expect(startingPosition).toBeLessThan(2);
  await expect.poll(() => hero.evaluate((element) => element.track.scrollLeft / element.track.clientWidth)).toBeGreaterThan(0);
  const positions = await hero.evaluate((hero) => {
    clearInterval(hero.autoplayTimer);
    hero.goTo(1);
    const expected = [2, 0, 2, 1];
    const controls = [
      '[data-hero-index="2"]',
      '[data-hero-next]',
      '[data-hero-previous]',
      '[data-hero-index="1"]',
    ];
    return controls.map((selector, index) => {
      hero.querySelector(selector).click();
      return { expected: expected[index], actual: hero.currentIndex };
    });
  });
  for (const { actual, expected } of positions) expect(actual).toBeCloseTo(expected, 2);
  await expect.poll(() => hero.evaluate((element) => Math.abs(element.track.scrollLeft / element.track.clientWidth - 1))).toBeLessThan(0.01);
});

test('shape links open the native collection filter and can be cleared', async ({ page }) => {
  const shape = page.locator('.lemoon-shapes__item').first();
  const destination = await shape.getAttribute('href');
  await shape.click();
  await expect(page).toHaveURL(new RegExp(destination.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  await expect(page.locator('.lemoon-filter-pill')).toHaveCount(1);
  await page.locator('.lemoon-filter-reset a').click();
  await expect(page.locator('.lemoon-filter-pill')).toHaveCount(0);
  await expect(page).not.toHaveURL(/filter\.p\.m\.custom\.frame_shape=/);
});

test('home sections align to the carousel and expose all three steps', async ({ page }) => {
  const about = page.locator('.lemoon-about__inner');
  const carousel = page.locator('.lemoon-featured-products__track').first();
  await about.scrollIntoViewIfNeeded();
  const aboutBox = await about.boundingBox();
  const carouselBox = await carousel.boundingBox();
  const carouselContent = await page.locator('.lemoon-featured-products__heading').first().boundingBox();
  expect(Math.abs(aboutBox.x - carouselContent.x)).toBeLessThanOrEqual(1);
  expect(Math.abs(aboutBox.width - carouselContent.width)).toBeLessThanOrEqual(1);
  await expect(page.locator('.lemoon-shapes__heading h2')).toHaveText('Elige tu estilo');
  await expect(page.locator('.lemoon-mood-grid__heading')).toHaveText('Categorías');
  await expect(page.locator('.lemoon-how-it-works__step')).toHaveCount(3);
  await expect(page.locator('.lemoon-how-it-works__visual svg')).toHaveCount(3);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(await page.evaluate(() => innerWidth));
});

test('home header divider follows scrolling and returns to its initial state', async ({ page }) => {
  const header = page.locator('.lemoon-header-wrapper--home');
  await page.evaluate(() => scrollTo(0, 0));
  await expect(header).not.toHaveClass(/lemoon-header-wrapper--scrolled/);
  await page.evaluate(() => scrollTo(0, 300));
  await expect(header).toHaveClass(/lemoon-header-wrapper--scrolled/);
  await page.evaluate(() => scrollTo(0, 0));
  await expect(header).not.toHaveClass(/lemoon-header-wrapper--scrolled/);
});
