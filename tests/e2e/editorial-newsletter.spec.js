import { test, expect } from '@playwright/test';
const fixture = scenario => `/tests/fixtures/component-adoption.html?scenario=${scenario}`;

async function newsletterGeometry(form) {
  return form.evaluate(form => {
    const elements = {
      input: form.querySelector('input[type=email]'),
      form,
      wrapper: form.closest('.lemoon-newsletter__form-wrap'),
      card: form.closest('.lemoon-newsletter__inner'),
      consent: form.querySelector('input[type=checkbox]'),
      consentLabel: form.querySelector('.lemoon-newsletter__consent'),
    };
    return Object.fromEntries(Object.entries(elements).map(([name, element]) => {
      const { x, y, width, height } = element.getBoundingClientRect();
      return [name, { x, y, width, height }];
    }));
  });
}

async function expectSingleBorder(email, color, width = '1px', focused = false) {
  for (const edge of ['top', 'right', 'bottom', 'left']) {
    await expect(email).toHaveCSS(`border-${edge}-width`, width);
    await expect(email).toHaveCSS(`border-${edge}-style`, 'solid');
    await expect(email).toHaveCSS(`border-${edge}-color`, color);
  }
  const forcedColors = await email.evaluate(node => node.ownerDocument.defaultView.matchMedia('(forced-colors: active)').matches);
  await expect(email).toHaveCSS('outline-style', focused && forcedColors ? 'solid' : 'none');
  if (focused && !forcedColors) await expect(email).toHaveCSS('box-shadow', /inset/);
  else if (focused && forcedColors) await expect(email).toHaveCSS('box-shadow', /^(none|.*inset)$/);
  else await expect(email).toHaveCSS('box-shadow', 'none');
}

async function systemColor(page, name) {
  return page.evaluate(name => {
    const probe = document.createElement('span');
    probe.style.color = name;
    probe.style.forcedColorAdjust = 'none';
    document.body.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  }, name);
}


for (const pageType of ['blog', 'article']) {
  for (const width of [390, 1280]) {
    test(`${pageType} editorial footer newsletter is usable at ${width}px`, async ({ page, browserName }) => {
      await page.setViewportSize({ width, height: 900 });
      const posts = [];
      page.on('request', request => { if (request.method() === 'POST') posts.push(request.url()); });
      await page.goto(fixture(`newsletter-${pageType}`));
      const newsletter = page.locator('.lemoon-newsletter');
      await expect(newsletter).toHaveCount(1);
      await expect(newsletter).toHaveClass(/lemoon-newsletter--editorial/);
      await expect(newsletter.locator('.lemoon-newsletter__inner')).toHaveCSS('background-color', 'rgb(11, 31, 58)');
      await expect(newsletter.getByRole('heading', { name: 'Una idea útil cada tanto.' })).toBeVisible();
      await expect(newsletter.getByText('Lentes, estilo y claridad en tu correo.')).toBeVisible();
      const form = newsletter.locator('form');
      await expect(form).toHaveCount(1);
      const email = form.getByRole('textbox');
      const consent = form.getByRole('checkbox');
      const submit = form.getByRole('button', { name: 'Suscribirme', exact: true });
      await expect(email).toHaveAccessibleName('Correo electrónico');
      await expect(consent).toHaveAccessibleName('Acepto recibir correos de Lemoon y puedo cancelar mi suscripción cuando quiera.');
      await expect(consent).not.toBeChecked();
      await expect(consent).toHaveAttribute('required', '');
      await submit.click();
      expect(await email.evaluate(node => node.validity.valueMissing)).toBe(true);
      await email.fill('incorrecto');
      await submit.click();
      expect(await email.evaluate(node => node.validity.typeMismatch)).toBe(true);
      await email.fill('editorial@example.test');
      await submit.click();
      expect(await consent.evaluate(node => node.validity.valueMissing)).toBe(true);
      await expect(page.locator('body')).not.toHaveAttribute('data-fixture-submit');
      await consent.check();
      const beforeClick = await newsletterGeometry(form);
      const borderColor = await email.evaluate(node => getComputedStyle(node).borderTopColor);
      await expectSingleBorder(email, borderColor);
      await email.click();
      await expect(email).toBeFocused();
      await expectSingleBorder(email, borderColor, '1px', true);
      const afterClick = await newsletterGeometry(form);
      expect(afterClick).toEqual(beforeClick);
      await newsletter.getByRole('heading', { name: 'Una idea útil cada tanto.' }).click();
      await expect(email).not.toBeFocused();
      await expectSingleBorder(email, borderColor);
      const beforeTab = await newsletterGeometry(form);
      await page.keyboard.press(browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab');
      await expect(email).toBeFocused();
      await expectSingleBorder(email, borderColor, '1px', true);
      const afterTab = await newsletterGeometry(form);
      expect(afterTab).toEqual(beforeTab);
      expect(afterTab).toEqual(beforeClick);
      await test.info().attach('newsletter-focus-geometry', { body: JSON.stringify({ beforeClick, afterClick, beforeTab, afterTab }, null, 2), contentType: 'application/json' });
      await page.keyboard.press(browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab');
      await expect(submit).toBeFocused();
      await page.keyboard.press(browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab');
      await expect(consent).toBeFocused();
      await page.keyboard.press('Space');
      await expect(consent).not.toBeChecked();
      await page.keyboard.press('Space');
      await expect(consent).toBeChecked();
      await submit.click();
      await expect(page.locator('body')).toHaveAttribute('data-fixture-submit', 'prevented');
      expect(await form.evaluate(node => Object.fromEntries(new FormData(node)))).toMatchObject({ form_type: 'customer', 'contact[tags]': 'newsletter', 'contact[email]': 'editorial@example.test', 'contact[accepts_marketing]': 'true' });
      expect(posts).toEqual([]);
      for (const control of [email, consent, submit]) {
        const box = await control.boundingBox();
        expect(box.width).toBeGreaterThan(0);
        expect(box.height).toBeGreaterThan(0);
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(width);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      if (pageType === 'blog') await page.screenshot({ path: test.info().outputPath(`editorial-footer-${width}.png`), fullPage: true });
    });
  }
}

test('noneditorial newsletter stays warm and uses its configured content', async ({ page }) => {
  await page.goto(fixture('newsletter'));
  const newsletter = page.locator('.lemoon-newsletter');
  await expect(newsletter).not.toHaveClass(/lemoon-newsletter--editorial/);
  await expect(newsletter).toHaveCSS('background-color', 'rgb(247, 244, 238)');
  await expect(newsletter.getByRole('heading', { name: 'Novedades <&"' })).toBeVisible();
  await expect(newsletter.getByRole('checkbox')).toHaveCount(0);
});

test('editorial errors and success preserve native described-by destinations', async ({ page }) => {
  await page.goto(fixture('newsletter-blog-error'));
  const email = page.locator('.lemoon-newsletter input[type=email]');
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  const errorId = await email.getAttribute('aria-describedby');
  await expect(page.locator(`[id="${errorId}"]`)).toHaveAttribute('role', 'alert');
  await expect(email).toHaveValue('test@example.test');
  await page.goto(fixture('newsletter-blog-success'));
  const successId = await email.getAttribute('aria-describedby');
  await expect(page.locator(`[id="${successId}"]`)).toHaveAttribute('tabindex', '-1');
  await expect(page.locator(`[id="${successId}"]`)).toBeVisible();
});

function contrastRatio(foreground, background) {
  const luminance = color => {
    const channels = color.match(/[\d.]+/g).slice(0, 3).map(value => {
      const channel = Number(value) / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  };
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

for (const width of [390, 1280]) {
  test(`editorial text stays legible with footer base CSS last at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(fixture('newsletter-blog'));
    // The local theme preview can place the shared footer stylesheet after its
    // editorial stylesheet. Exercise that cascade, using both real CSS files.
    await page.evaluate(() => document.body.append(document.querySelector('link[href="/assets/section-lemoon-footer.css"]')));
    await expect(page.locator('body > link').last()).toHaveAttribute('href', '/assets/section-lemoon-footer.css');
    const card = page.locator('.lemoon-newsletter--editorial .lemoon-newsletter__inner');
    await expect(card).toHaveCSS('background-color', 'rgb(11, 31, 58)');
    const background = await card.evaluate(element => getComputedStyle(element).backgroundColor);
    for (const selector of ['.lemoon-newsletter__copy h2', '.lemoon-newsletter__copy p', '.lemoon-newsletter__label', '.lemoon-newsletter__consent span']) {
      const text = card.locator(selector);
      await expect(text).toBeVisible();
      await expect(text).toHaveCSS('color', 'rgb(255, 255, 255)');
      const color = await text.evaluate(element => getComputedStyle(element).color);
      expect(contrastRatio(color, background), selector).toBeGreaterThanOrEqual(4.5);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

for (const width of [390, 1280]) {
  test(`editorial input preserves form geometry with click and Tab in forced colors at ${width}px`, async ({ page, browserName }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ forcedColors: 'active' });
    await page.goto(fixture('newsletter-blog'));
    expect(await page.evaluate(() => matchMedia('(forced-colors: active)').matches)).toBe(true);
    const newsletter = page.locator('.lemoon-newsletter');
    const form = newsletter.locator('form');
    const email = form.getByRole('textbox');
    const canvasText = await systemColor(page, 'CanvasText');
    const highlight = await systemColor(page, 'Highlight');
    const beforeClick = await newsletterGeometry(form);
    await expectSingleBorder(email, canvasText);
    await email.click();
    await expect(email).toBeFocused();
    await expectSingleBorder(email, highlight, '1px', true);
    await expect(email).toHaveCSS('outline-color', highlight);
    const afterClick = await newsletterGeometry(form);
    expect(afterClick).toEqual(beforeClick);
    await newsletter.getByRole('heading', { name: 'Una idea útil cada tanto.' }).click();
    await expect(email).not.toBeFocused();
    await expectSingleBorder(email, canvasText);
    const beforeTab = await newsletterGeometry(form);
    await page.keyboard.press(browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab');
    await expect(email).toBeFocused();
    await expectSingleBorder(email, highlight, '1px', true);
    await expect(email).toHaveCSS('outline-color', highlight);
    const afterTab = await newsletterGeometry(form);
    expect(afterTab).toEqual(beforeTab);
    expect(afterTab).toEqual(beforeClick);
    await test.info().attach('newsletter-forced-colors-geometry', { body: JSON.stringify({ beforeClick, afterClick, beforeTab, afterTab }, null, 2), contentType: 'application/json' });
  });
}

for (const width of [390, 1280]) {
  for (const trigger of ['click', 'Tab']) {
    test(`simulated CAPTCHA insertion preserves first ${trigger} geometry at ${width}px`, async ({ page, browserName }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(fixture('newsletter-blog'));
      const form = page.locator('.lemoon-newsletter form');
      const email = form.getByRole('textbox');
      await expect(form.locator(':scope > .h-captcha')).toHaveCount(0);
      await form.evaluate(form => {
        // Only reproduce the observed zero-height direct grid child. This is
        // not hCaptcha integration, validation, challenge or network coverage.
        form.addEventListener('focusin', () => {
          const captcha = document.createElement('div');
          captcha.className = 'h-captcha';
          captcha.dataset.fixtureCaptcha = 'simulated';
          // Dawn hides div:empty. A hidden stand-in child preserves the
          // observed nonempty, zero-height node without emulating a vendor UI.
          const child = document.createElement('span');
          child.hidden = true;
          captcha.append(child);
          form.append(captcha);
        }, { once: true });
      });
      const before = await newsletterGeometry(form);
      const borderColor = await email.evaluate(node => getComputedStyle(node).borderTopColor);
      await expectSingleBorder(email, borderColor);
      if (trigger === 'click') await email.click();
      else await page.keyboard.press(browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab');
      await expect(email).toBeFocused();
      const captcha = form.locator(':scope > .h-captcha');
      await expect(captcha).toHaveCount(1);
      await expect(captcha).toHaveCSS('position', 'absolute');
      await expectSingleBorder(email, borderColor, '1px', true);
      const after = await newsletterGeometry(form);
      expect(after).toEqual(before);
      // Negative control: putting only the simulated child back into grid flow
      // must reproduce the extra row gap, then restoring the real CSS must fix it.
      await captcha.evaluate(element => { element.style.position = 'static'; });
      const negativeControl = await newsletterGeometry(form);
      expect(negativeControl.form.height - before.form.height).toBe(12);
      expect(negativeControl.wrapper.height - before.wrapper.height).toBe(12);
      await captcha.evaluate(element => { element.style.removeProperty('position'); });
      expect(await newsletterGeometry(form)).toEqual(before);
      await test.info().attach('simulated-captcha-first-focus-geometry', { body: JSON.stringify({ simulation: 'Zero-height direct h-captcha child; not real CAPTCHA coverage', trigger, width, before, after, negativeControl }, null, 2), contentType: 'application/json' });
    });
  }
}
