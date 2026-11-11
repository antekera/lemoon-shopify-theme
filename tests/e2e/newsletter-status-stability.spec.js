import { test, expect } from '@playwright/test';

for (const variant of ['newsletter', 'newsletter-blog']) {
  for (const width of [320, 390, 1280]) {
    for (const state of ['success', 'challenge', 'pending']) {
      test(`${variant} ${state} keeps footer geometry at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.route(`**/tests/fixtures/component-adoption.html?scenario=${variant}`, async route => {
          const response = await route.fetch();
          const html = (await response.text()).replace("document.addEventListener('submit',event=>{event.preventDefault();document.body.dataset.fixtureSubmit='prevented'});", '');
          await route.fulfill({ contentType: 'text/html', body: html });
        });
        let posts = 0, release;
        const hold = new Promise(resolve => { release = resolve; });
        await page.route('**/contact*', async route => {
          posts++;
          if (state === 'pending') await hold;
          if (state === 'challenge') return route.fulfill({ status: 200, contentType: 'text/html', body: '<title>Challenge</title><p>Verificación requerida</p>' });
          const response = await page.request.get(`/tests/fixtures/component-adoption.html?scenario=${variant}-success`);
          return route.fulfill({ status: 200, contentType: 'text/html', body: await response.text() }).catch(() => {});
        });
        await page.goto(`/tests/fixtures/component-adoption.html?scenario=${variant}`);
        const form = page.locator('.lemoon-newsletter form');
        const input = form.locator('input[type=email]');
        const submit = form.getByRole('button', { name: /suscribirme/i });
        const footer = page.locator('.lemoon-footer');
        await input.fill('newsletter@example.test');
        if (variant === 'newsletter-blog') await form.getByRole('checkbox').check();
        await submit.focus();
        const before = await footer.evaluate(node => node.getBoundingClientRect().top + scrollY);
        await submit.click();
        const status = form.locator('.lemoon-newsletter__status');
        if (state === 'success') await expect(status).toContainText(variant === 'newsletter' ? 'Gracias <&"' : 'Gracias por suscribirte');
        else if (state === 'challenge') await expect(status).toContainText('No pudimos confirmar');
        else await expect(status).toContainText('La confirmación está tardando', { timeout: 8000 });
        await expect(status).toHaveCSS('font-size', '12px');
        expect(await footer.evaluate(node => node.getBoundingClientRect().top + scrollY)).toBe(before);
        await input.focus();
        expect(await footer.evaluate(node => node.getBoundingClientRect().top + scrollY)).toBe(before);
        await submit.focus();
        expect(await footer.evaluate(node => node.getBoundingClientRect().top + scrollY)).toBe(before);
        expect(posts).toBe(1);
        if (state === 'pending') { release(); await expect(status).not.toContainText('La confirmación está tardando'); }
      });
    }
  }
}

for (const variant of ['newsletter', 'newsletter-blog']) {
  for (const width of [320, 390, 1280]) {
    for (const forced of [false, true]) {
      test(`${variant} focus via click and keyboard keeps boxes fixed at ${width}px, forced colors ${forced}`, async ({ page, browserName }) => {
        await page.setViewportSize({ width, height: 900 });
        if (forced) await page.emulateMedia({ forcedColors: 'active' });
        await page.goto(`/tests/fixtures/component-adoption.html?scenario=${variant}`);
        const input = page.locator('.lemoon-newsletter input[type=email]');
        const heading = page.locator('.lemoon-newsletter h2');
        const footer = page.locator('.lemoon-footer');
        const geometry = async () => ({ input: await input.boundingBox(), footerTop: await footer.evaluate(el => el.getBoundingClientRect().top + scrollY) });
        const initial = await geometry();
        const border = await input.evaluate(el => getComputedStyle(el).borderTopColor);
        await input.click();
        await expect(input).toBeFocused();
        await expect(input).toHaveCSS('border-top-width', '1px');
        await expect(input).toHaveCSS('outline-style', 'solid');
        await expect(input).toHaveCSS('outline-width', '3px');
        if (!forced) {
          await expect(input).toHaveCSS('border-top-color', 'rgb(11, 31, 58)');
          await expect(input).toHaveCSS('outline-color', 'rgb(49, 102, 83)');
          expect(border).toBe('rgb(11, 31, 58)');
        }
        expect(await geometry()).toEqual(initial);
        await heading.click();
        await page.keyboard.press(browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab');
        await expect(input).toBeFocused();
        expect(await geometry()).toEqual(initial);
      });
    }
  }
}
