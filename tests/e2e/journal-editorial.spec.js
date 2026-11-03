import { test, expect } from '@playwright/test';
const longTitle = 'Una mirada distinta '.repeat(9) + 'PalabraExtremadamenteLarga'.repeat(8);
async function load(page, scenario) {
  const response = await page.goto(`/tests/fixtures/journal-editorial.html?scenario=${scenario}`);
  expect(response.status()).toBe(200);
}
async function noOverflow(page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}

for (const width of [390, 749, 750, 989, 990, 1280]) {
  test(`journal layout and article media fit ${width}px`, async ({ page, browserName }) => {
    await page.setViewportSize({ width, height: 900 });
    await load(page, 'blog');
    await expect(page.getByRole('heading', { name: 'Una nueva mirada', exact: true })).toBeVisible();
    await noOverflow(page);
    expect(await page.locator('.lemoon-journal__grid').evaluate(element => getComputedStyle(element).gridTemplateColumns.split(' ').length)).toBe(width < 750 ? 1 : width < 990 ? 2 : 3);
    await page.keyboard.press(browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab');
    await expect(page.getByRole('link', { name: 'Elegir tus lentes', exact: true }).first()).toBeFocused();
    expect(await page.locator(':focus-visible').evaluate(element => getComputedStyle(element).outlineStyle)).toBe('solid');

    await page.route('https://www.youtube-nocookie.com/**', route => route.fulfill({ body: '<html><body>Video de prueba sin reproducción</body></html>', contentType: 'text/html' }));
    await load(page, 'article');
    await noOverflow(page);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(longTitle);
    const box = await page.getByTitle('Demostración de cuidado').boundingBox();
    expect(box.width / box.height).toBeCloseTo(16 / 9, 1);
    await expect(page.locator('.lemoon-article__related-story')).toHaveCount(3);
  });
}

test('category recovery, sparse content and related links expose usable destinations', async ({ page }) => {
  await load(page, 'empty-topic');
  await expect(page.getByRole('link', { name: 'Ver todas las publicaciones' })).toHaveAttribute('href', '/blogs/news');
  await load(page, 'single');
  await expect(page.getByRole('heading', { level: 2 })).toHaveCount(1);
  await expect(page.locator('.lemoon-journal__grid')).toHaveCount(0);
  await expect(page.locator('.lemoon-journal__feature a').last()).toHaveAttribute('href', '/blogs/news/articulo-1');
});

for (const width of [390, 1280]) {
  test(`featured and grid CMS images load with native dimensions at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await load(page, 'blog-images');
    const images = page.locator('.lemoon-journal img');
    await expect(images).toHaveCount(6);
    await expect(images.first()).toHaveAttribute('loading', 'eager');
    for (const image of await images.all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate(element => element.complete && element.naturalWidth > 0)).toBe(true);
      await expect(image).toHaveAttribute('width', '1402');
      await expect(image).toHaveAttribute('height', '1122');
      const natural = await image.evaluate(element => ({ width: element.naturalWidth, height: element.naturalHeight }));
      // W-descriptor candidates can change density-corrected naturalWidth.
      expect(natural.width / natural.height).toBeCloseTo(1402 / 1122, 2);
      expect(await image.getAttribute('src')).toMatch(/^\/assets\/lemoon-category-opticos-generic-v1\.jpg\?width=\d+$/);
      const box = await image.boundingBox();
      expect(box.width).toBeGreaterThan(0);
      expect(box.height).toBeGreaterThan(0);
      expect(box.width).toBeLessThanOrEqual(width);
    }
    for (const card of await page.locator('.lemoon-journal__story').all()) {
      await expect(card.locator('.card__heading a:visible')).toHaveCount(1);
      await expect(card.locator('img')).toBeVisible();
      await expect(card.locator('img')).toHaveAttribute('loading', 'lazy');
    }
    await page.screenshot({ path: test.info().outputPath(`journal-images-${width}.png`), fullPage: true });
    await noOverflow(page);
  });
}

for (const width of [390, 1280]) {
  test(`article hero remains centered when article CSS is loaded last at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route('https://www.youtube-nocookie.com/**', route => route.fulfill({ body: '<html><body>Video de prueba</body></html>', contentType: 'text/html' }));
    await load(page, 'article');
    // Stress the real section style against the late base article stylesheet
    // used by the local preview, without duplicating production markup or CSS.
    await page.evaluate(() => document.body.append(document.querySelector('link[href="/assets/section-blog-post.css"]')));
    await expect(page.locator('body > link').last()).toHaveAttribute('href', '/assets/section-blog-post.css');
    const hero = page.locator('.article-template__hero-container');
    await expect(hero).toBeVisible();
    const heroBox = await hero.boundingBox();
    expect(heroBox.width).toBeGreaterThan(0);
    expect(heroBox.height).toBeGreaterThan(0);
    expect(Math.abs(heroBox.x + heroBox.width / 2 - width / 2)).toBeLessThanOrEqual(1);
    const imageBox = await hero.locator('img').boundingBox();
    expect(Math.abs(imageBox.x + imageBox.width / 2 - width / 2)).toBeLessThanOrEqual(1);
    await noOverflow(page);
  });
}
