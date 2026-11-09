import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const route = '/tests/fixtures/face-guide.html';
const param = 'filter.p.m.custom.frame_shape';
const families = ['Ovalado', 'Redondo', 'Cuadrado', 'Corazón', 'Diamante', 'Alargado'];
const readback = JSON.parse(readFileSync('tests/fixtures/face-guide-catalogue-links.json'));
const family = (page, index) => page.getByRole('article', { name: families[index], exact: true });

for (const width of [390, 820, 1440]) {
  test(`all families, image fallbacks and fit diagrams remain readable at ${width}px without JavaScript`, async ({ browser, baseURL }, testInfo) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width, height: 900 } });
    const page = await context.newPage();
    try {
      await page.goto(new URL(route, baseURL).href);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Elegir lentes según tu rostro');
      await expect(page.getByRole('article')).toHaveCount(6);
      await expect(page.getByRole('tab')).toHaveCount(0);
      for (const thumbnail of await page.getByRole('navigation').locator('img').all()) {
        await thumbnail.scrollIntoViewIfNeeded();
        await expect.poll(() => thumbnail.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
        expect(await thumbnail.evaluate(img => img.currentSrc)).toMatch(/-editorial-v3-(180|360)\.webp$/);
        expect(await thumbnail.evaluate(img => img.naturalWidth)).toBeLessThanOrEqual(360);
      }
      for (const [index, name] of families.entries()) {
        const article = family(page, index);
        await expect(article.getByRole('heading', { name, exact: true })).toBeVisible();
        await expect(article.getByRole('listitem')).toHaveCount(2);
        await article.scrollIntoViewIfNeeded();
        const image = article.locator('img');
        await expect(image).toHaveAttribute('loading', 'lazy');
        await expect(image).toHaveAttribute('width', /^[1-9]\d*$/);
        await expect(image).toHaveAttribute('height', /^[1-9]\d*$/);
        await expect.poll(() => image.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
        const geometry = await image.evaluate(img => ({ reservedRatio: Number(img.getAttribute('width')) / Number(img.getAttribute('height')), decodedRatio: img.naturalWidth / img.naturalHeight, width: img.getBoundingClientRect().width, decodedWidth: img.naturalWidth, source: img.currentSrc, dpr: devicePixelRatio }));
        expect(geometry.reservedRatio).toBe(1);
        expect(geometry.decodedRatio).toBe(1);
        expect(geometry.source).toMatch(/-editorial-v3-(360|640|960)\.webp$/);
        expect(geometry.decodedWidth).toBeGreaterThanOrEqual(geometry.width * geometry.dpr * 0.8);
        expect(geometry.decodedWidth).toBeLessThanOrEqual(Math.max(360, geometry.width * geometry.dpr * 2));
        const cta = article.locator('.lemoon-face-guide__cta');
        await expect(cta).toBeVisible();
        expect((await cta.boundingBox()).height).toBeGreaterThanOrEqual(44);
        const cues = article.locator('li');
        expect(await cues.first().evaluate(node => parseFloat(getComputedStyle(node).fontSize))).toBeGreaterThanOrEqual(16);
      }
      await expect(page.locator('.lemoon-face-guide__fit-hint')).toHaveCount(3);
      for (const [index, kind] of ['bridge', 'cheek', 'temple'].entries()) {
        const art = page.locator('.lemoon-face-guide__fit-art').nth(index);
        const reserved = await art.boundingBox();
        expect(reserved.height).toBeGreaterThan(0);
        expect(reserved.width / reserved.height).toBeCloseTo(8 / 5, 2);
        await expect(art.locator('svg')).toHaveCount(0);
        const image = art.locator('img');
        await expect(image).toHaveAttribute('loading', 'lazy');
        await expect(image).toHaveAttribute('alt', '');
        await expect(image).toHaveAttribute('width', '700');
        await expect(image).toHaveAttribute('height', '438');
        const candidates = (await image.getAttribute('srcset')).split(',').map(candidate => candidate.trim().split(/\s+/));
        expect(candidates.map(([, descriptor]) => descriptor)).toEqual(['350w', '700w', '1400w']);
        await image.scrollIntoViewIfNeeded();
        await expect.poll(() => image.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
        const decoded = await image.evaluate(img => ({ source: img.currentSrc, width: img.naturalWidth, height: img.naturalHeight, fit: getComputedStyle(img).objectFit }));
        expect(decoded.source).toMatch(new RegExp(`lemoon-fit-${kind}-editorial-v1-(350|700|1400)\\.webp$`));
        // srcset natural sizes are density-corrected integer CSS pixels. Allow
        // their rounding, while raw candidate decoding below checks asset ratio.
        expect(Math.abs(decoded.width - decoded.height * 8 / 5)).toBeLessThanOrEqual(2);
        expect(decoded.fit).toBe('contain');
        const loaded = await art.boundingBox();
        expect(loaded.width).toBeCloseTo(reserved.width, 1);
        expect(loaded.height).toBeCloseTo(reserved.height, 1);
        if (width === 390) {
          // Decode every responsive candidate once in Chromium, including the
          // 1400px variant that a DPR1 viewport may not select on its own.
          for (const [url, descriptor] of candidates) {
            const dimensions = await page.evaluate(async source => {
              const candidate = new Image();
              candidate.src = source;
              await candidate.decode();
              return { width: candidate.naturalWidth, height: candidate.naturalHeight };
            }, url);
            expect(dimensions.width).toBe(Number.parseInt(descriptor, 10));
            expect(dimensions.width / dimensions.height).toBeCloseTo(8 / 5, 2);
          }
        }
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.screenshot({ path: testInfo.outputPath(`guide-${width}.png`), fullPage: true });
    } finally { await context.close(); }
  });
}

for (const [index, evidence] of readback.entries()) {
  test(`${families[index]} exits the guide for the native PLP URL with both selections`, async ({ page }) => {
    // Navigation target is a deterministic acknowledgement, not a Shopify PLP.
    // The actual native PLP readback is separately dated in face-guide-catalogue-links.json.
    await page.route('**/collections/all?*', request => request.fulfill({ contentType: 'text/html; charset=utf-8', body: '<!doctype html><html lang="es"><meta charset="utf-8"><title>Fixture destination</title><h1>Destino de catálogo del fixture</h1></html>' }));
    await page.goto(route);
    await family(page, index).locator('.lemoon-face-guide__cta').click();
    await expect(page.getByRole('heading', { name: 'Destino de catálogo del fixture' })).toBeVisible();
    const url = new URL(page.url());
    expect(url.pathname).toBe('/collections/all');
    expect([...url.searchParams]).toEqual(evidence.shapes.map(value => [param, value]));
    await expect(page.getByRole('article')).toHaveCount(0);
  });
}

test('keyboard reaches every visual index link in order and activates the family CTA with visible focus', async ({ page, browserName }) => {
  const tabKey = browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab';
  await page.goto(route);
  const index = page.getByRole('navigation', { name: 'Mira el contorno, explora las formas' });
  for (const name of families) {
    await page.keyboard.press(tabKey);
    await expect(index.getByRole('link', { name, exact: true })).toBeFocused();
  }
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#FaceFamily-face-fixture-long$/);
  const article = family(page, 5);
  await expect(article.locator('[data-face-frame-picker]')).toBeVisible();
  // Traverse the new preview controls using native keyboard order before its CTA.
  await page.keyboard.press(tabKey);
  await expect(article.getByRole('button', { name: 'Ver sin armazón', exact: true })).toBeFocused();
  const cta = family(page, 5).locator('.lemoon-face-guide__cta');
  for (let step = 0; step < 12 && !await cta.evaluate(node => node === document.activeElement); step++) await page.keyboard.press(tabKey);
  await expect(cta).toBeFocused();
  await expect(cta).toHaveCSS('outline-style', 'solid');
  await expect(cta).toHaveCSS('outline-width', '2px');
  await page.route('**/collections/all?*', request => request.fulfill({ contentType: 'text/html; charset=utf-8', body: '<h1>Destino del fixture</h1>' }));
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/collections\/all\?/);
  expect(new URL(page.url()).searchParams.getAll(param)).toEqual(['aviador', 'redondo']);
});

for (const scenario of ['missing-filter', 'missing-value']) {
  test(`${scenario} gives the affected family a complete-catalogue exit with no partial selection promise`, async ({ page, baseURL }) => {
    await page.goto(`${route}?scenario=${scenario}`);
    const article = family(page, 1);
    const cta = article.getByRole('link', { name: 'Ver catálogo', exact: true });
    await expect(cta).toHaveAttribute('href', '/collections/all');
    await expect(article.getByText('Puedes explorar el catálogo completo', { exact: false })).toBeVisible();
    await expect(article.getByRole('link', { name: 'Geométricos', exact: true })).toHaveCount(0);
    await page.route('**/collections/all', request => request.fulfill({ contentType: 'text/html; charset=utf-8', body: '<h1>Catálogo del fixture</h1>' }));
    await cta.click();
    await expect(page).toHaveURL(new URL('/collections/all', baseURL).href);
  });
}

test('merchant overrides render as inert text and a replaceable image without hiding the other families', async ({ page }) => {
  await page.goto(`${route}?scenario=merchant`);
  await expect(page.getByRole('article')).toHaveCount(6);
  const article = page.getByRole('article').first();
  await expect(article.getByRole('heading')).toHaveText('Mi contorno <img src=x onerror="alert(1)">');
  await expect(article.getByRole('listitem').first()).toHaveText('Primera pista de la tienda <script>window.injected=true</script>');
  await expect(article.getByText('Una explicación propia de la tienda.', { exact: true })).toBeVisible();
  await article.scrollIntoViewIfNeeded();
  const image = article.locator('img');
  await expect(image).toHaveAttribute('src', /lemoon-category-opticos-generic-v1\.jpg/);
  await expect.poll(() => image.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
  await expect(article.locator('script, img[src="x"]')).toHaveCount(0);
  expect(await page.evaluate(() => window.injected)).toBeUndefined();
});

test('localized links retain the language prefix for catalogue, measurements and quiz', async ({ page }) => {
  await page.goto(`${route}?scenario=localized`);
  for (const article of await page.getByRole('article').all()) await expect(article.locator('.lemoon-face-guide__cta')).toHaveAttribute('href', /^\/en\/collections\/all\?/);
  await expect(page.getByRole('link', { name: 'See how to measure my glasses' })).toHaveAttribute('href', '/en/pages/como-medir-tus-lentes');
  await expect(page.getByRole('link', { name: 'Discover your style' }).first()).toHaveAttribute('href', '/en/pages/descubre-tu-estilo');
});

async function mockGuideAnalytics(page, allowed = true) {
  const events = [];
  await page.exposeFunction('recordGuideAnalytics', (name, data) => { events.push({ name, data }); });
  await page.addInitScript(initialAllowed => {
    window.guideAnalyticsAllowed = initialAllowed;
    window.Shopify = {
      customerPrivacy: { analyticsProcessingAllowed: () => window.guideAnalyticsAllowed },
      analytics: { publish: (name, data) => window.recordGuideAnalytics(name, data) },
    };
  }, allowed);
  return events;
}

test('all 15 enhanced guide links publish only controlled action metadata while keeping native navigation', async ({ page }) => {
  // Shopify publishing is mocked; this does not claim that GA4 receives events.
  const events = await mockGuideAnalytics(page);
  await page.route('**/collections/all**', request => request.fulfill({ contentType: 'text/html', body: '<h1>Fixture catalogue destination</h1>' }));
  await page.route('**/pages/**', request => request.fulfill({ contentType: 'text/html', body: '<h1>Fixture page destination</h1>' }));
  const groups = [
    ['.lemoon-face-guide__index-link', 6, 'face_index', 'index'],
    ['article .lemoon-face-guide__cta', 6, 'family_catalogue', 'family'],
    ['.lemoon-face-guide__fit [data-face-guide-action="measure"] a', 1, 'measure', 'fit'],
    ['.lemoon-face-guide__help .lemoon-face-guide__cta', 1, 'catalogue', 'closing'],
    ['.lemoon-face-guide__help .lemoon-face-guide__text-link', 1, 'quiz', 'closing'],
  ];
  for (const [selector, count, action, position] of groups) {
    for (let index = 0; index < count; index++) {
      await page.goto(route);
      await expect(family(page, 0).locator('[data-face-frame-picker]')).toBeVisible();
      if (action === 'family_catalogue') {
        await family(page, index).scrollIntoViewIfNeeded();
        await expect(family(page, index).locator('[data-face-frame-picker]')).toBeVisible();
      }
      const anchor = page.locator(selector).nth(index);
      const destination = await anchor.getAttribute('href');
      const expectedURL = new URL(destination, page.url()).href;
      const before = events.length;
      // The canonical action's nested label must publish exactly one event.
      const child = action === 'frame_shape' ? anchor.locator('svg').first() : anchor.locator('span').last();
      await (await child.count() ? child : anchor).click();
      await expect.poll(() => events.length).toBe(before + 1);
      expect(events.at(-1)).toMatchObject({ name: 'lemoon:face_guide_click', data: { guide_id: 'face_shape', action, link_position: position } });
      await expect(page).toHaveURL(expectedURL);
      expect(Object.keys(events.at(-1).data).sort()).toEqual(expect.arrayContaining(['action', 'destination', 'guide_id', 'link_position']));
      for (const key of Object.keys(events.at(-1).data)) expect(['guide_id', 'action', 'link_position', 'destination', 'face_family', 'frame_shape', 'selected_shapes']).toContain(key);
      expect(JSON.stringify(events.at(-1).data)).not.toMatch(/https?:|@|\/collections|\/pages|Fixture|Ver armazones/);
    }
  }
  expect(events).toHaveLength(15);
  expect(events.filter(({ data }) => data.action === 'family_catalogue').at(-1).data).toMatchObject({ face_family: 'long', selected_shapes: ['aviator', 'round'] });
});

test('consent is checked for each keyboard click and editor reload does not duplicate tracking or replay denied clicks', async ({ page }) => {
  const events = await mockGuideAnalytics(page, false);
  await page.goto(route);
  const first = page.getByRole('navigation').getByRole('link').first();
  await first.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#FaceFamily-face-fixture-oval$/);
  expect(events).toHaveLength(0);
  await page.evaluate(async () => {
    const tracker = await import('/assets/lemoon-face-guide.js');
    tracker.initializeFaceGuideTracking(window);
    tracker.initializeFaceGuideTracking(window);
    document.dispatchEvent(new CustomEvent('shopify:section:load', { bubbles: true }));
    window.guideAnalyticsAllowed = true;
    document.dispatchEvent(new CustomEvent('visitorConsentCollected'));
  });
  expect(events).toHaveLength(0);
  await first.focus();
  await page.keyboard.press('Enter');
  await expect.poll(() => events.length).toBe(1);
  await page.evaluate(() => { window.guideAnalyticsAllowed = false; });
  await first.focus();
  await page.keyboard.press('Enter');
  expect(events).toHaveLength(1);
});
