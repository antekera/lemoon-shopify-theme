import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });
const fixture = '/tests/fixtures/mobile-search.html';
const s = (name) => `[data-lemoon-search-${name}]`;
const products = (title = 'Producto predictivo') => Array.from({ length: 6 }, (_, i) => ({ id: 100 + i, title: `${title} ${i}`, url: `/products/predictive-${i}`, image: '/assets/lemoon-logo-refined-navy.svg', featured_image: { url: '/assets/lemoon-logo-refined-navy.svg', alt: title } }));
const payload = (items) => ({ resources: { results: { products: items, collections: [], pages: [], articles: [], queries: [] } } });
const open = async (page) => { await page.locator(s('open')).click(); await expect(page.locator(s('input'))).toBeFocused(); };

test.beforeEach(async ({ page }) => { await page.goto(fixture); });

// These tests exercise the mobile search assets against representative fixture markup. The fixture's header controls are inert stand-ins; Liquid rendering, the navigation drawer, and desktop search are not under test here.
test('opens from mobile search below the header with focus and internal scroll', async ({ page }) => {
  await page.evaluate(() => window.scrollTo(0, 180));
  await open(page);
  await expect(page.locator('.lemoon-mobile-search__heading')).toHaveCount(0);
  await expect(page.getByRole('dialog', { name: 'Buscar productos' })).toBeVisible();
  await expect(page.locator(s('open'))).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator(s('input'))).toHaveCSS('border-top-color', 'rgb(11, 31, 58)');
  await expect(page.locator(s('input'))).toHaveCSS('border-top-width', '1px');
  await expect(page.locator(s('input'))).toHaveCSS('outline-style', 'none');
  await expect(page.locator(s('input'))).toHaveCSS('box-shadow', 'none');
  const inputBox = await page.locator(s('input')).boundingBox();
  const submitBox = await page.locator(`${s('form')} [type=submit]`).boundingBox();
  expect(inputBox.height).toBe(submitBox.height);
  const header = await page.locator('[data-lemoon-search-header]').boundingBox();
  const panel = await page.locator(s('panel')).boundingBox();
  const initialStickyHeader = await page.locator('.lemoon-mobile-search__sticky-header').boundingBox();
  expect(panel.y).toBeCloseTo(header.y + header.height, 0);
  expect(initialStickyHeader.y).toBeCloseTo(panel.y, 0);
  expect(panel.width).toBe(390);
  await page.locator(s('panel')).evaluate((el) => { el.scrollTop = 400; });
  await expect.poll(() => page.locator(s('panel')).evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
  const headerAfterScroll = await page.locator('[data-lemoon-search-header]').boundingBox();
  expect(headerAfterScroll.y).toBeCloseTo(header.y, 0);
  await expect(page.locator('.section-header')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect.poll(async () => {
    const panel = await page.locator(s('panel')).boundingBox();
    const input = await page.locator(s('input')).boundingBox();
    return input.y - panel.y;
  }).toBeGreaterThanOrEqual(0);
  await expect.poll(async () => {
    const panel = await page.locator(s('panel')).boundingBox();
    const sticky = await page.locator('.lemoon-mobile-search__sticky-header').boundingBox();
    return sticky.y - panel.y;
  }).toBeCloseTo(0, 0);
  await expect.poll(async () => {
    const sticky = await page.locator('.lemoon-mobile-search__sticky-header').boundingBox();
    const form = await page.locator(s('form')).boundingBox();
    return sticky.y + sticky.height - form.y - form.height;
  }).toBeCloseTo(0, 0);
  await expect(page.locator('.lemoon-mobile-search__sticky-header')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await page.mouse.wheel(0, 300);
  expect(await page.evaluate(() => document.body.style.position)).toBe('fixed');
});

test('keeps the visible announcement bar above the header and search panel', async ({ page }) => {
  const announcement = await page.locator('.announcement-bar-section').boundingBox();
  await open(page);
  const header = await page.locator('.section-header').boundingBox();
  const panel = await page.locator(s('panel')).boundingBox();
  expect(header.y).toBeCloseTo(announcement.y + announcement.height, 0);
  expect(Math.abs(panel.y - header.y - header.height)).toBeLessThanOrEqual(1);
});

for (const method of ['close', 'Escape', 'overlay']) {
  test(`closes by ${method} and restores scroll and focus`, async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 140));
    await open(page);
    if (method === 'Escape') await page.keyboard.press('Escape');
    else if (method === 'overlay') {
      await expect(page.locator(s('overlay'))).toBeVisible();
      await page.touchscreen.tap(10, 835);
    }
    else await page.locator(s('close')).click();
    await expect(page.locator(s('panel'))).toBeHidden();
    await expect(page.locator(s('open'))).toBeFocused();
    await expect(page.locator(s('open'))).toHaveAttribute('aria-expanded', 'false');
    expect(await page.evaluate(() => window.scrollY)).toBe(140);
    expect(await page.evaluate(() => document.body.style.position)).toBe('');
    await page.keyboard.press('Escape');
    await expect(page.locator(s('open'))).toBeFocused();
  });
}

test('selects three distinct suggestions again on every opening', async ({ page }) => {
  await open(page);
  const first = await page.locator(`${s('results')} a`).allTextContents();
  expect(first).toHaveLength(3);
  expect(new Set(first).size).toBe(3);
  await page.locator(s('close')).click();
  await open(page);
  const second = await page.locator(`${s('results')} a`).allTextContents();
  expect(second).toHaveLength(3);
  expect(second).not.toEqual(first);
});

test('uses the product fallback image when suggestions have no image', async ({ page }) => {
  await page.route('**/search/suggest.json?**', (route) => route.fulfill({ json: payload([{ id: 999, title: 'Lemoon Zara', url: '/products/lemoon-zara', image: null }]) }));
  await open(page);
  const initialImage = page.locator(`${s('results')} img`).first();
  await expect(initialImage).toHaveAttribute('src', '/assets/lemoon-product-fallback.png');
  await expect(initialImage).toHaveJSProperty('naturalWidth', 1254);
  await expect(initialImage).toHaveCSS('object-fit', 'cover');
  await page.locator(s('input')).fill('zara');
  const predictedImage = page.locator(`${s('results')} img`).first();
  await expect(predictedImage).toHaveAttribute('src', '/assets/lemoon-product-fallback.png');
  await expect(predictedImage).toHaveJSProperty('naturalWidth', 1254);
});

test('keeps product cards free of decorative right arrows', async ({ page }) => {
  await open(page);
  await expect(page.locator(`${s('results')} .lemoon-mobile-search__product > .lemoon-icon`)).toHaveCount(0);
  await expect(page.locator(`${s('slide')} .lemoon-mobile-search__product > .lemoon-icon`)).toHaveCount(0);
});

test('underlines show-all results text without a decorative arrow', async ({ page }) => {
  await open(page);
  const showAll = page.locator(s('all'));
  const results = page.locator(s('results'));
  expect(await showAll.evaluate((link, list) => list.compareDocumentPosition(link) & Node.DOCUMENT_POSITION_FOLLOWING, await results.elementHandle())).toBeTruthy();
  await expect(showAll).toHaveCSS('text-decoration-line', 'underline');
  await expect(showAll).toHaveCSS('justify-content', 'flex-end');
  await expect(showAll.locator('.lemoon-icon')).toHaveCount(0);
});

test('places the close chevron left of the search input', async ({ page }) => {
  await open(page);
  const close = await page.locator(s('close')).boundingBox();
  const input = await page.locator(s('input')).boundingBox();
  expect(close.x + close.width).toBeLessThan(input.x);
  expect(Math.abs(close.y + close.height / 2 - input.y - input.height / 2)).toBeLessThanOrEqual(1);
});

test('preserves suggestions for one or two characters and debounces predictions from three', async ({ page }) => {
  const requests = [];
  await page.route('**/search/suggest.json?**', async (route) => { requests.push(new URL(route.request().url())); await route.fulfill({ json: payload(products()) }); });
  await open(page);
  const initial = await page.locator(s('results')).textContent();
  for (const term of ['s', 'so']) { await page.locator(s('input')).fill(term); await page.waitForTimeout(350); expect(await page.locator(s('results')).textContent()).toBe(initial); }
  expect(requests).toHaveLength(0);
  await page.locator(s('input')).fill('sol');
  await page.locator(s('input')).fill('solar');
  await expect(page.locator(`${s('results')} a`)).toHaveCount(5);
  await expect(page.locator(s('status'))).toContainText('5');
  await expect(page.locator(s('results'))).toContainText('Producto predictivo');
  expect(requests).toHaveLength(1);
  expect(requests[0].searchParams.get('q')).toBe('solar');
  expect(requests[0].searchParams.get('resources[type]')).toBe('product');
  expect(requests[0].searchParams.get('resources[limit]')).toBe('5');
  await expect(page.locator(`${s('results')} img`).first()).toHaveAttribute('src', '/assets/lemoon-logo-refined-navy.svg');
  await expect(page.locator(`${s('results')} a`).first()).toHaveAttribute('href', '/products/predictive-0');
});

test('shows loading and rejects late results after a newer term or closure', async ({ page }) => {
  let release;
  const held = new Promise((resolve) => { release = resolve; });
  await page.route('**/search/suggest.json?**', async (route) => {
    const term = new URL(route.request().url()).searchParams.get('q');
    if (term === 'old') await held;
    await route.fulfill({ json: payload(products(term)) }).catch(() => {});
  });
  await open(page);
  await page.locator(s('input')).fill('old');
  await expect(page.locator(s('status'))).toContainText('Buscando');
  await expect(page.locator(s('results'))).toHaveAttribute('aria-busy', 'true');
  await page.locator(s('input')).fill('new');
  await expect(page.locator(s('results'))).toContainText('new 0');
  release();
  await page.waitForTimeout(100);
  await expect(page.locator(s('results'))).not.toContainText('old 0');
});

test('invalidates a held response when the panel closes', async ({ page }) => {
  let release;
  const held = new Promise((resolve) => { release = resolve; });
  await page.route('**/search/suggest.json?**', async (route) => { await held; await route.fulfill({ json: payload(products('cerrado')) }).catch(() => {}); });
  await open(page);
  await page.locator(s('input')).fill('old');
  await expect(page.locator(s('status'))).toContainText('Buscando');
  await page.keyboard.press('Escape');
  await expect(page.locator(s('panel'))).toBeHidden();
  release();
  await page.waitForTimeout(100);
  await open(page);
  await expect(page.locator(s('results'))).not.toContainText('cerrado');
});

test('renders external product titles as text and rejects executable links', async ({ page }) => {
  await page.route('**/search/suggest.json?**', (route) => route.fulfill({ json: payload([{ ...products()[0], title: '<img src=x onerror=alert(1)>' }, { ...products()[1], url: 'javascript:alert(1)' }]) }));
  await open(page);
  await page.locator(s('input')).fill('sol');
  await expect(page.locator(`${s('results')} [data-product-title]`)).toHaveText(['<img src=x onerror=alert(1)>']);
  await expect(page.locator(`${s('results')} [onerror]`)).toHaveCount(0);
  await expect(page.locator(`${s('results')} a[href^="javascript:"]`)).toHaveCount(0);
});

for (const state of ['empty', 'error']) {
  test(`announces ${state} and keeps typed search available`, async ({ page }) => {
    await page.route('**/search/suggest.json?**', (route) => route.fulfill(state === 'empty' ? { json: payload([]) } : { status: 500, body: 'failure' }));
    await open(page);
    await page.locator(s('input')).fill('nada');
    await expect(page.locator(s('status'))).toContainText(state === 'empty' ? 'No encontramos' : 'No pudimos');
    await expect(page.locator(s('input'))).toHaveValue('nada');
    await expect(page.locator(s('all'))).toHaveAttribute('href', '/search?q=nada&type=product');
    await expect(page.locator(s('results'))).toHaveAttribute('aria-busy', 'false');
  });
}

for (const method of ['submit', 'all']) {
  for (const term of ['', 'lentes & sol']) {
    test(`${method} navigates with ${term || 'empty query'} to the localized route`, async ({ page }) => {
      await page.locator('[data-lemoon-search]').evaluate((el) => { el.dataset.searchUrl = '/es/search'; el.querySelector('form').action = '/es/search'; });
      await page.route('**/es/search?**', (route) => route.fulfill({ contentType: 'text/html', body: 'Search results' }));
      await page.route('**/es/search', (route) => route.fulfill({ contentType: 'text/html', body: 'Search results' }));
      await open(page);
      await page.locator(s('input')).fill(term);
      if (method === 'submit') await page.locator(`${s('form')} [type=submit]`).click();
      else await page.locator(s('all')).click();
      await expect(page).toHaveURL(term ? /\/es\/search\?q=lentes\+%26\+sol&type=product$/ : /\/es\/search$/);
    });
  }
}

test('carousel supports arrows, dots and horizontal swipe without wrapping', async ({ page }) => {
  await open(page);
  await expect(page.locator(s('previous'))).toBeDisabled();
  await page.locator(s('next')).click();
  await expect(page.locator(s('slide')).nth(1)).toHaveAttribute('aria-hidden', 'false');
  await page.locator(s('dot')).nth(4).click();
  await expect(page.locator(s('next'))).toBeDisabled();
  await expect(page.locator(s('dot')).nth(4)).toHaveAttribute('aria-current', 'true');
  await page.locator(s('carousel')).scrollIntoViewIfNeeded();
  const carouselBox = await page.locator(s('carousel')).boundingBox();
  await expect.poll(async () => {
    const box = await page.locator(s('slide')).nth(4).boundingBox();
    return Math.abs(box.x - carouselBox.x);
  }).toBeLessThanOrEqual(1);
  const box = await page.locator(s('slide')).nth(4).boundingBox();
  const session = await page.context().newCDPSession(page);
  const x = box.x + 40;
  const y = box.y + box.height / 2;
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + 70, y }] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + 140, y: y + 5 }] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await session.detach();
  await expect(page.locator(s('slide')).nth(3)).toHaveAttribute('aria-hidden', 'false');
  await page.locator(s('dot')).first().click();
  await expect(page.locator(s('previous'))).toBeDisabled();
});

test('puts the banner first and uses PLP product cards in the trends carousel', async ({ page }) => {
  await open(page);
  const slides = page.locator(s('slide'));
  await expect(slides).toHaveCount(5);
  await expect(slides.first().locator('.lemoon-mobile-search__banner')).toBeVisible();
  await expect(slides.nth(1).locator('.product-card-wrapper')).toHaveCount(1);
  await expect(slides.nth(4).locator('.product-card-wrapper')).toHaveCount(1);
  await expect(page.locator(s('dot'))).toHaveCount(5);
});

test('peeks the next carousel item and advances the PLP card with add to cart', async ({ page }) => {
  await open(page);
  const carousel = await page.locator(s('carousel')).boundingBox();
  const firstProduct = page.locator(s('slide')).nth(1);
  const firstProductBox = await firstProduct.boundingBox();
  expect(firstProductBox.x).toBeGreaterThan(carousel.x);
  expect(firstProductBox.x).toBeLessThan(carousel.x + carousel.width);
  await page.locator(s('next')).click();
  await expect(firstProduct).toHaveAttribute('aria-hidden', 'false');
  await expect.poll(async () => {
    const box = await firstProduct.boundingBox();
    return Math.abs(box.x - carousel.x);
  }).toBeLessThanOrEqual(1);
  await expect(firstProduct.locator('.quick-add__submit')).toBeVisible();
});

test('traps keyboard focus, responds to resize and hides at desktop breakpoint', async ({ page }) => {
  await open(page);
  await page.locator(s('close')).focus();
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator(s('next'))).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator(s('close'))).toBeFocused();
  await page.setViewportSize({ width: 320, height: 568 });
  await expect.poll(async () => (await page.locator(s('panel')).boundingBox()).width).toBe(320);
  await expect.poll(async () => { const box = await page.locator(s('panel')).boundingBox(); return box.y + box.height; }).toBe(544);
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(page.locator(s('panel'))).toBeHidden();
  await expect.poll(() => page.evaluate(() => document.body.style.position)).toBe('');
});

test('reduced motion keeps focus and closure functional without a fade', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  expect(await page.locator('[data-lemoon-search]').evaluate((el) => getComputedStyle(el).transitionDuration)).toBe('0s');
  await page.keyboard.press('Escape');
  await expect(page.locator(s('open'))).toBeFocused();
});

test('closed fading content cannot reclaim focus and reopening cancels the pending hide', async ({ page }) => {
  await open(page);
  await page.evaluate(() => {
    document.querySelector('[data-lemoon-search-close]').click();
    document.querySelector('[data-lemoon-search-input]').focus();
  });
  await expect(page.locator(s('open'))).toBeFocused();
  await open(page);
  await page.waitForTimeout(200);
  await expect(page.locator(s('panel'))).toBeVisible();
  await expect(page.locator(s('input'))).toBeFocused();
});
