import { test, expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

const fixture = scenario => `/tests/fixtures/component-library.html?scenario=${scenario}`;

test('native actions respond to keyboard and disabled/loading actions cannot activate', async ({ page }) => {
  await page.goto(fixture('controls'));
  const button = page.locator('#enabled-action');
  await button.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Space');
  await expect(page.locator('body')).toHaveAttribute('data-fixture-clicks', '2');
  await expect(page.locator('#loading-action')).toBeDisabled();
  await expect(page.locator('#loading-action')).toHaveAttribute('aria-busy', 'true');
  await expect(page.locator('#disabled-link')).not.toHaveAttribute('href');
  await expect(page.locator('#disabled-link')).toHaveAttribute('tabindex', '-1');
  await page.locator('#enabled-link').focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#target$/);
});

test('contact required and email validation blocks native submission; valid fixture submit never posts', async ({ page }) => {
  const posts = [];
  page.on('request', request => { if (request.method() === 'POST') posts.push(request.url()); });
  await page.goto(fixture('contact'));
  const form = page.locator('form[data-shopify-form-fixture]');
  await expect(form).toHaveAttribute('method', 'post');
  const button = form.getByRole('button');
  await button.click();
  await expect(form.locator('input[name="contact[name]"]')).toBeFocused();
  await form.locator('input[name="contact[name]"]').fill('Fixture user');
  await form.locator('input[name="contact[email]"]').fill('not-an-email');
  await form.locator('textarea').fill('Fixture message');
  await button.click();
  expect(await form.locator('input[name="contact[email]"]').evaluate(node => node.validity.typeMismatch)).toBe(true);
  await expect(page.locator('body')).not.toHaveAttribute('data-fixture-submit');
  await form.locator('input[name="contact[email]"]').fill('fixture@example.test');
  await button.click();
  await expect(page.locator('body')).toHaveAttribute('data-fixture-submit', 'prevented');
  const values = await form.evaluate(node => Object.fromEntries(new FormData(node)));
  expect(values).toMatchObject({ 'contact[name]': 'Fixture user', 'contact[email]': 'fixture@example.test', 'contact[phone]': '', 'contact[body]': 'Fixture message', form_type: 'contact' });
  expect(posts).toEqual([]);
});

test('contact synthetic response branches expose associated errors and polite success', async ({ page }) => {
  await page.goto(fixture('contact-error'));
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.getByRole('alert')).toHaveAttribute('aria-live', 'assertive');
  const email = page.locator('input[name="contact[email]"]');
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  const id = await email.getAttribute('aria-describedby');
  await expect(page.locator(`[id="${id}"]`)).toContainText('no es válido');
  await expect(page.getByRole('alert').locator('ul li')).toContainText('no es válido');
  await page.goto(fixture('contact-success'));
  await expect(page.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('FAQ uses native Enter/Space disclosure and keeps answer links accessible', async ({ page, browserName }) => {
  await page.goto(fixture('faq'));
  await expect(page.locator('details')).toHaveCount(11);
  const details = page.locator('details').first();
  const summary = details.locator('summary');
  await expect(details).not.toHaveAttribute('open');
  await expect(details.locator('.lemoon-faq-page__answer')).toBeHidden();
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(details).toHaveAttribute('open', '');
  await expect(details.locator('.lemoon-faq-page__answer')).toBeVisible();
  await page.keyboard.press(browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab');
  await expect(details.getByRole('link')).toBeFocused();
  await summary.focus();
  await page.keyboard.press('Space');
  await expect(details).not.toHaveAttribute('open');
});

test('select changes by keyboard, contributes FormData and bubbles a real change event', async ({ page }) => {
  await page.goto(fixture('controls'));
  const select = page.getByLabel('Fixture selection');
  await select.focus();
  // Native typeahead works without relying on a platform popup implementation.
  await page.keyboard.press('t');
  await page.keyboard.press('Tab');
  await expect(select).toHaveValue('two');
  await expect(page.locator('body')).toHaveAttribute('data-fixture-changed', 'choice');
  expect(await page.locator('#fixture-controls').evaluate(form => new FormData(form).get('choice'))).toBe('two');
  await expect(page.locator('#fixture-open')).toHaveAttribute('open', '');
});

test('vertical search preserves native SortBy selection, query context and form bubbling', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(fixture('search'));
  const select = page.locator('#SortBy');
  await expect(select).toHaveAttribute('name', 'sort_by');
  await expect(select).toHaveAttribute('aria-describedby', 'a11y-refresh-page-message');
  await expect(select).toHaveValue('title-descending');
  await expect(page.locator('#Search-In-Template-component-fixture')).toHaveValue('Round "<&');
  await expect(page.locator('#FacetFiltersForm input[name="q"]')).toHaveValue('Round "<&');
  await select.selectOption('relevance');
  await expect(page.locator('body')).toHaveAttribute('data-fixture-changed', 'sort_by');
  expect(await page.locator('#FacetSortForm').evaluate(form => new FormData(form).get('sort_by'))).toBe('relevance');
});

for (const scenario of ['controls', 'contact', 'search']) {
  test(`${scenario} controls retain continuous navy boundary, distinct focus and native states`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(fixture(scenario));
    const control = page.locator(scenario === 'search' ? '#SortBy' : scenario === 'contact' ? 'input[name="contact[email]"]' : '#fixture-email');
    await expect(control).toHaveCSS('border-top-width', '1px');
    await expect(control).toHaveCSS('border-top-style', 'solid');
    for (const edge of ['top', 'right', 'bottom', 'left']) {
      await expect(control).toHaveCSS(`border-${edge}-color`, 'rgb(11, 31, 58)');
      await expect(control).toHaveCSS(`border-${edge}-width`, '1px');
    }
    await control.focus();
    await expect(control).toHaveCSS('outline-width', '2px');
    await expect(control).toHaveCSS('outline-style', 'solid');
    await expect(control).toHaveCSS('outline-color', 'rgb(11, 31, 58)');
    expect(Number.parseFloat(await control.evaluate(node => getComputedStyle(node).outlineOffset))).toBeGreaterThanOrEqual(2);
    // Dawn pseudo-elements must not duplicate or conceal the actual boundary.
    expect(await control.evaluate(node => getComputedStyle(node.parentElement, '::after').content)).toMatch(/none|normal/);
    if (scenario === 'controls') {
      await expect(page.locator('#disabled-field')).toBeDisabled();
      await expect(page.locator('#invalid-field')).toHaveAttribute('aria-describedby', 'fixture-error');
      await expect(page.locator('#invalid-field')).toHaveCSS('border-top-color', 'rgb(11, 31, 58)');
      await expect(page.locator('#fixture-error')).toHaveCSS('color', 'rgb(192, 57, 43)');
      await expect(page.locator('#disabled-field')).toHaveCSS('border-top-color', 'rgb(11, 31, 58)');
    }
  });
}

test('forced colors keeps actual control boundaries and keyboard focus visible', async ({ page }) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto(fixture('controls'));
  const input = page.locator('#fixture-email');
  await input.focus();
  await expect(input).toHaveCSS('border-top-style', 'solid');
  await expect(input).toHaveCSS('border-top-width', '1px');
  await expect(input).toHaveCSS('outline-style', 'solid');
  await expect(input).toHaveCSS('outline-width', '2px');
  expect(await input.evaluate(node => getComputedStyle(node).outlineColor)).not.toBe('rgba(0, 0, 0, 0)');
});

for (const width of [390, 749, 750, 989, 990, 1280, 1440]) {
  test(`real sections and long FAQ content reflow without horizontal overflow at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const scenario of ['guide', 'contact', 'long', 'gallery']) {
      await page.goto(fixture(scenario));
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      if (scenario === 'long') await page.locator('details').first().locator('summary').click();
      expect(await page.evaluate(() => ({ content: document.documentElement.scrollWidth, viewport: innerWidth })), scenario).toEqual({ content: width, viewport: width });
      if ((width === 390 || width === 1440) && ['guide', 'contact', 'long', 'gallery'].includes(scenario)) await page.screenshot({ path: testInfo.outputPath(`${scenario}-${width}.png`), fullPage: true });
    }
  });
}

test('contact keeps each feedback message inside its field without extra grid tracks', async ({ page }) => {
  for (const scenario of ['contact', 'contact-error']) {
    await page.goto(fixture(scenario));
    await expect(page.locator('.lemoon-contact__fields > *')).toHaveCount(4);
    for (const name of ['email', 'body']) {
      const control = page.locator(`[name="contact[${name}]"]`);
      const association = await control.getAttribute('aria-describedby');
      if (association) expect(await control.evaluate((node, id) => node.parentElement.contains(document.getElementById(id)), association)).toBe(true);
    }
  }
});

test('gallery renders shared primitives with a visible select label and inert states', async ({ page }) => {
  await page.goto(fixture('gallery'));
  const select = page.locator('.lemoon-design-system select');
  await expect(select).toHaveCount(1);
  const id = await select.getAttribute('id');
  await expect(page.locator(`label[for="${id}"]`)).toBeVisible();
  await expect(page.locator('.lemoon-design-system [autofocus], .lemoon-design-system [role="alert"], .lemoon-design-system [aria-live]')).toHaveCount(0);
  await expect(page.locator('.lemoon-design-system .lemoon-ui-control')).not.toHaveCount(0);
});

test('contact error keeps semantic error token and focus ring clear of clipping', async ({ page }, testInfo) => {
  await page.goto(fixture('contact-error'));
  const input = page.locator('input[name="contact[email]"]');
  await expect(input).toHaveCSS('border-top-color', 'rgb(192, 57, 43)');
  await expect(input).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(page.locator('.lemoon-contact__panel')).toHaveCSS('background-color', 'rgb(247, 244, 238)');
  await input.focus();
  await expect(input).toHaveCSS('outline-width', '2px');
  expect(await input.evaluate(node => {
    const rect = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    const ring = Number.parseFloat(style.outlineOffset) + Number.parseFloat(style.outlineWidth);
    for (let parent = node.parentElement; parent; parent = parent.parentElement) {
      const css = getComputedStyle(parent), bounds = parent.getBoundingClientRect();
      if (/(hidden|clip|scroll|auto)/.test(css.overflowX) && (rect.left - ring < bounds.left || rect.right + ring > bounds.right)) return false;
      if (/(hidden|clip|scroll|auto)/.test(css.overflowY) && (rect.top - ring < bounds.top || rect.bottom + ring > bounds.bottom)) return false;
    }
    return true;
  })).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('contact-error-focus.png'), fullPage: true });
});

test('gallery loading state paints a visible shared spinner and retains accessible label', async ({ page }, testInfo) => {
  await page.goto(fixture('gallery'));
  const button = page.locator('.lemoon-design-system .button.loading');
  await expect(button).toBeDisabled();
  expect((await button.getAttribute('aria-label')) || (await button.textContent()).trim()).toBeTruthy();
  const svg = button.locator(':scope > .loading__spinner > svg');
  const painted = await svg.evaluate(node => {
    const rect = node.getBoundingClientRect(), css = getComputedStyle(node), circle = node.querySelector('circle');
    return { width: rect.width, height: rect.height, display: css.display, visibility: css.visibility, opacity: css.opacity, stroke: getComputedStyle(circle).stroke, strokeWidth: getComputedStyle(circle).strokeWidth, buttonBackground: getComputedStyle(node.closest('button')).backgroundColor };
  });
  await testInfo.attach('spinner-computed.json', { body: JSON.stringify(painted, null, 2), contentType: 'application/json' });
  await writeFile(testInfo.outputPath('spinner-computed.json'), JSON.stringify(painted, null, 2));
  await button.screenshot({ path: testInfo.outputPath('gallery-loading.png'), animations: 'disabled' });
  expect(painted.width).toBeGreaterThan(8);
  expect(painted.height).toBeGreaterThan(8);
  expect(painted.stroke).not.toBe('none');
  expect(painted.stroke).not.toBe(painted.buttonBackground);
  await expect(svg).toBeVisible();
});
