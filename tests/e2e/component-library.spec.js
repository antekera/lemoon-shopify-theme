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

test('FAQ opens the first answer and keyboard interaction closes the previously open question across groups', async ({ page }) => {
  await page.goto(fixture('faq-custom'));
  const details = page.locator('.lemoon-faq-page__question');
  await expect(details).toHaveCount(3);
  await expect(details.nth(0)).toHaveAttribute('open', '');
  await expect(details.nth(1)).not.toHaveAttribute('open');
  await expect(details.nth(0).locator('.lemoon-faq-page__answer')).toBeVisible();
  const second = details.nth(1).locator('summary');
  await second.focus();
  await page.keyboard.press('Enter');
  await expect(details.nth(0)).not.toHaveAttribute('open');
  await expect(details.nth(1)).toHaveAttribute('open', '');
  await expect(details.nth(1).getByRole('link', { name: 'Contacto dos' })).toBeVisible();
  await details.nth(2).locator('summary').focus();
  await page.keyboard.press('Space');
  await expect(details.nth(1)).not.toHaveAttribute('open');
  await expect(details.nth(2)).toHaveAttribute('open', '');
  expect(await page.locator('.lemoon-faq-page__question[open]').count()).toBe(1);
});

test('FAQ uses responsive question type, 1.5 answer spacing and compact desktop header', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(fixture('faq-custom'));
  const fontSize = await page.locator('.lemoon-faq-page__question h3').first().evaluate(el => getComputedStyle(el).fontSize);
  const headerMargin = await page.locator('.lemoon-faq-page__header').evaluate(el => parseFloat(getComputedStyle(el).marginBottom));
  expect(fontSize).toBe('18px');
  expect(headerMargin).toBe(32);
  const answer = page.locator('.lemoon-faq-page__answer').first();
  await expect(answer).toHaveCSS('font-size', '16px');
  await expect(answer).toHaveCSS('line-height', '24px');
  for (const width of [390, 989, 990]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.locator('.lemoon-faq-page__question h3').first()).toHaveCSS('font-size', width >= 990 ? '18px' : '16px');
    await expect(answer).toHaveCSS('line-height', '24px');
  }
});

test('FAQ opens smoothly and closes without residue when browser supports the enhancement', async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(fixture('faq-custom'));
  const supported = await page.evaluate(() => CSS.supports('selector(details::details-content)') && CSS.supports('transition-behavior: allow-discrete'));
  test.skip(!supported, 'Browser uses the accessible native disclosure fallback');
  const geometry = await page.evaluate(async () => {
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const first = document.querySelector('[data-editor-block="uno"]');
    const second = document.querySelector('[data-editor-block="dos"]');
    const contentHeight = el => el.getBoundingClientRect().height - el.querySelector('summary').getBoundingClientRect().height;
    const initial = [contentHeight(first), contentHeight(second)];
    second.querySelector('summary').click();
    const frames = [];
    for (let frame = 0; frame < 30; frame++) {
      await new Promise(requestAnimationFrame);
      frames.push([contentHeight(first), contentHeight(second)]);
    }
    return { initial, frames };
  });
  const [closedHeight, openHeight] = geometry.frames.at(-1);
  expect(closedHeight).toBeLessThan(3);
  expect(openHeight).toBeGreaterThan(geometry.initial[1] + 20);
  // Current Playwright WebKit closes native details immediately despite reporting
  // support for discrete transitions. Preserve functional fallback coverage; do
  // not claim the closing animation works in that engine.
  if (browserName !== 'webkit') {
    expect(geometry.frames.some(([height]) => height > closedHeight + 2 && height < geometry.initial[0] - 2)).toBe(true);
  }
  expect(geometry.frames.some(([, height]) => height > geometry.initial[1] + 2 && height < openHeight - 2)).toBe(true);
});

test('FAQ respects reduced motion while retaining exclusive disclosure behavior', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(fixture('faq-custom'));
  const supported = await page.evaluate(() => CSS.supports('selector(details::details-content)') && CSS.supports('transition-behavior: allow-discrete'));
  const first = page.locator('[data-editor-block="uno"]');
  const second = page.locator('[data-editor-block="dos"]');
  if (supported) {
    const transition = await second.evaluate(el => getComputedStyle(el, '::details-content').transitionDuration);
    expect(transition.split(',').every(value => parseFloat(value) === 0)).toBe(true);
  }
  await second.locator('summary').click();
  await expect(first).not.toHaveAttribute('open');
  await expect(second).toHaveAttribute('open', '');
  await expect(second.locator('.lemoon-faq-page__answer')).toBeVisible();
});

test('FAQ opens the selected editor block and closes the previous one', async ({ page }) => {
  await page.goto(fixture('faq-editor'));
  const first = page.locator('[data-editor-block="uno"]');
  const selected = page.locator('[data-editor-block="tres"]');
  await expect(first).toHaveAttribute('open', '');
  await selected.evaluate(el => el.dispatchEvent(new CustomEvent('shopify:block:select', { bubbles: true })));
  await expect(selected).toHaveAttribute('open', '');
  await expect(first).not.toHaveAttribute('open');
});

for (const width of [390, 1440]) {
  test(`FAQ stays centered and readable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(fixture('faq-custom'));
    const box = await page.locator('.lemoon-faq-page').boundingBox();
    expect(box.width).toBeLessThanOrEqual(700);
    expect(Math.abs(box.x - (width - box.width) / 2)).toBeLessThanOrEqual(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

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
  test(`${scenario} controls retain a continuous boundary, inset focus and native states`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(fixture(scenario));
    const control = page.locator(scenario === 'search' ? '#SortBy' : scenario === 'contact' ? 'input[name="contact[email]"]' : '#fixture-email');
    await expect(control).toHaveCSS('border-top-width', '1px');
    await expect(control).toHaveCSS('border-top-style', 'solid');
    for (const edge of ['top', 'right', 'bottom', 'left']) {
      await expect(control).toHaveCSS(`border-${edge}-color`, 'rgb(102, 133, 173)');
      await expect(control).toHaveCSS(`border-${edge}-width`, '1px');
    }
    await control.focus();
    await expect(control).toHaveCSS('outline-width', '2px');
    await expect(control).toHaveCSS('outline-style', 'solid');
    await expect(control).toHaveCSS('outline-color', 'rgb(11, 31, 58)');
    await expect(control).toHaveCSS('outline-offset', '-2px');
    await expect(control).toHaveCSS('border-top-color', 'rgb(11, 31, 58)');
    await expect(control).toHaveCSS('box-shadow', 'none');
    // Dawn pseudo-elements must not duplicate or conceal the actual boundary.
    expect(await control.evaluate(node => getComputedStyle(node.parentElement, '::after').content)).toMatch(/none|normal/);
    if (scenario === 'controls') {
      await expect(page.locator('#disabled-field')).toBeDisabled();
      await expect(page.locator('#invalid-field')).toHaveAttribute('aria-describedby', 'fixture-error');
      await expect(page.locator('#invalid-field')).toHaveCSS('border-top-color', 'rgb(102, 133, 173)');
      await expect(page.locator('#fixture-error')).toHaveCSS('color', 'rgb(192, 57, 43)');
      await expect(page.locator('#disabled-field')).toHaveCSS('border-top-color', 'rgb(102, 133, 173)');
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
