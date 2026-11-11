import { test, expect } from '@playwright/test';

const fixtureURL = '/tests/fixtures/component-adoption.html?scenario=newsletter';

// Remove the shared fixture's blanket submit preventer, while retaining the
// real section and scripts. Every customer POST is intercepted locally.
async function installFixture(page) {
  await page.route('**/tests/fixtures/component-adoption.html?scenario=newsletter', async route => {
    const response = await route.fetch();
    const html = (await response.text()).replace(
      "document.addEventListener('submit',event=>{event.preventDefault();document.body.dataset.fixtureSubmit='prevented'});", ''
    );
    return route.fulfill({ status: 200, contentType: 'text/html', body: html });
  });
}

test('newsletter retains a native customer submission when JavaScript is disabled', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
  const page = await context.newPage();
  let submitted;
  await page.route('**/contact*', async route => {
    const request = route.request();
    submitted = { method: request.method(), data: request.postData() };
    await route.fulfill({ status: 200, contentType: 'text/html', body: '<html><body>Fixture response</body></html>' });
  });
  await installFixture(page);
  await page.goto(fixtureURL);
  const form = page.locator('.lemoon-newsletter form');
  await form.locator('input[type=email]').fill('newsletter@example.test');
  await form.getByRole('button', { name: /suscribirme/i }).click();
  await expect(page.getByText('Fixture response')).toBeVisible();
  expect(submitted.method).toBe('POST');
  const payload = new URLSearchParams(submitted.data);
  expect(payload.get('form_type')).toBe('customer');
  expect(payload.get('contact[email]')).toBe('newsletter@example.test');
  expect(payload.get('contact[tags]')).toBe('newsletter');
  await context.close();
});

for (const width of [390, 1280]) {
  test(`successful subscription keeps page and footer geometry stable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 700 });
    await installFixture(page);
    let posts = 0;
    await page.route('**/contact*', async route => {
      posts += 1;
      const payload = new URLSearchParams(route.request().postData());
      expect(payload.get('contact[email]')).toBe('newsletter@example.test');
      expect(payload.get('form_type')).toBe('customer');
      const response = await page.request.get('/tests/fixtures/component-adoption.html?scenario=newsletter-success');
      await route.fulfill({ status: 200, contentType: 'text/html', body: await response.text() });
    });
    await page.goto(fixtureURL);
    await page.evaluate(() => {
      document.body.insertAdjacentHTML('afterbegin', '<div style="height:1200px"></div>');
      window.documentNonce = 'same-document';
    });
    const newsletter = page.locator('.lemoon-newsletter');
    const form = newsletter.locator('form');
    const email = form.locator('input[type=email]');
    const submit = form.getByRole('button', { name: /suscribirme/i });
    await submit.scrollIntoViewIfNeeded();
    await email.fill('newsletter@example.test');
    const before = await newsletter.evaluate(element => ({ height: element.getBoundingClientRect().height, scrollY: window.scrollY }));
    await submit.click();
    await expect(form.getByText('Gracias <&"')).toBeVisible();
    const after = await newsletter.evaluate(element => ({ height: element.getBoundingClientRect().height, scrollY: window.scrollY, nonce: window.documentNonce }));
    expect(after.nonce).toBe('same-document');
    expect(after.height).toBe(before.height);
    expect(after.scrollY).toBe(before.scrollY);
    expect(posts).toBe(1);
  });
}

test('Shopify form errors do not display success or navigate away', async ({ page }) => {
  await installFixture(page);
  await page.route('**/contact*', async route => {
    const response = await page.request.get('/tests/fixtures/component-adoption.html?scenario=newsletter-error');
    await route.fulfill({ status: 200, contentType: 'text/html', body: await response.text() });
  });
  await page.goto(fixtureURL);
  const form = page.locator('.lemoon-newsletter form');
  await form.locator('input[type=email]').fill('newsletter@example.test');
  await form.getByRole('button', { name: /suscribirme/i }).click();
  await expect(form.getByRole('alert')).toBeVisible();
  await expect(form.getByText('Gracias <&"')).toHaveCount(0);
  await expect(page).toHaveURL(/scenario=newsletter/);
});

test('a challenge response is not reported as a successful subscription', async ({ page }) => {
  await installFixture(page);
  let posts = 0;
  await page.route('**/contact*', async route => {
    posts += 1;
    await route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>Challenge</title><main>Verificación requerida</main>' });
  });
  await page.goto(fixtureURL);
  const form = page.locator('.lemoon-newsletter form');
  await form.locator('input[type=email]').fill('newsletter@example.test');
  await form.getByRole('button', { name: /suscribirme/i }).click();
  await expect.poll(() => posts).toBe(1);
  await expect(form.getByText('Gracias <&"')).toHaveCount(0);
  await expect(form.getByText(/no pudimos confirmar/i)).toBeVisible();
  await expect(form).not.toHaveAttribute('target');
});

test('network failure does not report success or silently retry', async ({ page }) => {
  await installFixture(page);
  let posts = 0;
  await page.route('**/contact*', async route => {
    posts += 1;
    await route.abort('failed');
  });
  await page.goto(fixtureURL);
  const form = page.locator('.lemoon-newsletter form');
  await form.locator('input[type=email]').fill('newsletter@example.test');
  await form.getByRole('button', { name: /suscribirme/i }).click();
  await expect.poll(() => posts).toBe(1);
  await expect(form.getByText('Gracias <&"')).toHaveCount(0);
  await expect(form.getByText(/no pudimos confirmar|la confirmación está tardando/i)).toBeVisible({ timeout: 8000 });
  await expect(form.getByText('Gracias <&"')).toHaveCount(0);
  expect(posts).toBe(1);
});

test('newsletter input focus reinforces its own border and button uses the shared label style', async ({ page }) => {
  await installFixture(page);
  await page.goto(fixtureURL);
  const form = page.locator('.lemoon-newsletter form');
  const email = form.locator('input[type=email]');
  const submit = form.getByRole('button', { name: /suscribirme/i });
  await expect(submit).toHaveCSS('font-size', '13px');
  await expect(submit).toHaveCSS('font-weight', '500');
  await expect(submit).toHaveCSS('text-transform', 'uppercase');
  const before = await email.evaluate(element => {
    const css = getComputedStyle(element);
    const { width, height } = element.getBoundingClientRect();
    return { color: css.borderTopColor, border: parseFloat(css.borderTopWidth), width, height };
  });
  await email.focus();
  await expect(email).toBeFocused();
  const after = await email.evaluate(element => {
    const css = getComputedStyle(element);
    const { width, height } = element.getBoundingClientRect();
    return { color: css.borderTopColor, border: parseFloat(css.borderTopWidth), width, height, outline: css.outlineStyle };
  });
  expect(after.color).toBe(before.color);
  expect(after.border).toBe(before.border);
  expect(after.width).toBe(before.width);
  expect(after.height).toBe(before.height);
  expect(after.outline).toBe('none');
  await expect(email).toHaveCSS('box-shadow', /inset/);
});


test('a late success replaces the pending notice without another submission', async ({ page }) => {
  await installFixture(page);
  let posts = 0;
  let release;
  const hold = new Promise(resolve => { release = resolve; });
  await page.route('**/contact*', async route => {
    posts += 1;
    await hold;
    const response = await page.request.get('/tests/fixtures/component-adoption.html?scenario=newsletter-success');
    await route.fulfill({ status: 200, contentType: 'text/html', body: await response.text() });
  });
  await page.goto(fixtureURL);
  const form = page.locator('.lemoon-newsletter form');
  await form.locator('input[type=email]').fill('newsletter@example.test');
  await form.getByRole('button', { name: /suscribirme/i }).click();
  await expect(form.getByText(/la confirmación está tardando/i)).toBeVisible({ timeout: 8000 });
  await expect(form.getByText('Gracias <&"')).toHaveCount(0);
  expect(posts).toBe(1);
  release();
  await expect(form.getByText('Gracias <&"')).toBeVisible();
  await expect(form.getByText(/la confirmación está tardando/i)).toHaveCount(0);
  expect(posts).toBe(1);
});
