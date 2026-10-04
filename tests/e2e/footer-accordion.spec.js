import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

test('slides the footer accordion open and closed on mobile', async ({ page }) => {
  await page.goto('/tests/fixtures/footer-accordion.html');

  const menus = page.locator('.lemoon-footer__menu:visible');
  await expect(menus).toHaveCount(4);
  for (const item of await menus.all()) await expect(item).not.toHaveAttribute('open', '');

  const menu = menus.first();
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

test('restores closed mobile accordion content when resized to desktop', async ({ page }) => {
  await page.goto('/tests/fixtures/footer-accordion.html');

  const menu = page.locator('.lemoon-footer__menu:visible').first();
  const content = menu.locator('.lemoon-footer__menu-content');
  const waitForAnimation = () => content.evaluate(async (element) => {
    const animations = element.getAnimations().filter((animation) => animation.playState === 'running');
    await Promise.all(animations.map((animation) => animation.finished));
  });
  await menu.locator('summary').click();
  await waitForAnimation();
  await menu.locator('summary').click();
  await waitForAnimation();
  const animationCount = await content.evaluate((element) => element.getAnimations().length);

  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(menu).toHaveAttribute('open', '');
  await expect(content.locator('a').first()).toBeVisible();
  await expect(content).not.toHaveCSS('height', '0px');
  expect(animationCount).toBe(0);
});

test('shows four open footer link columns on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/tests/fixtures/footer-accordion.html');

  const menus = page.locator('.lemoon-footer__menu:visible');
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

test('shows the current newsletter copy and an arrow-free subscribe button', async ({ page }) => {
  await page.goto('/tests/fixtures/footer-accordion.html');

  await expect(page.locator('.lemoon-newsletter__copy h2')).toHaveText('El camino para ver bien y verte bien comienza aquí.');
  const button = page.locator('.lemoon-newsletter__button');
  await expect(button).toHaveText('SUSCRIBIRME');
  await expect(button.locator('svg, [aria-hidden="true"]')).toHaveCount(0);
});

test('keeps Síguenos and its social icons aligned and white on mobile', async ({ page }) => {
  await page.goto('/tests/fixtures/footer-accordion.html');

  const heading = page.locator('.lemoon-footer__follow h2');
  const socials = page.locator('.lemoon-footer__social');
  const headingBox = await heading.boundingBox();
  const socialsBox = await socials.boundingBox();
  const headingColor = await heading.evaluate((element) => getComputedStyle(element).color);
  const socialColor = await socials.locator('a').first().evaluate((element) => getComputedStyle(element).color);

  expect(headingBox).not.toBeNull();
  expect(socialsBox).not.toBeNull();
  expect(Math.abs((headingBox.y + headingBox.height / 2) - (socialsBox.y + socialsBox.height / 2))).toBeLessThanOrEqual(1);
  expect(headingColor).toBe('rgb(255, 255, 255)');
  expect(socialColor).toBe('rgb(255, 255, 255)');
  await expect(socials.getByRole('link', { name: 'TikTok' })).toBeVisible();
});

test('places common help links, including FAQ, in the mobile information accordion', async ({ page }) => {
  await page.goto('/tests/fixtures/footer-accordion.html');

  const info = page.locator('.lemoon-footer__menu:visible').filter({ hasText: 'Información' });
  await info.locator('summary').click();
  await expect(info.locator('a', { hasText: 'Preguntas frecuentes' })).toBeVisible();
  await expect(info.locator('a', { hasText: 'Contáctanos' })).toBeVisible();
});

test('keeps the secure payment heading white on mobile', async ({ page }) => {
  await page.goto('/tests/fixtures/footer-accordion.html');

  const paymentHeading = page.locator('.lemoon-footer__payments h2');
  await expect(paymentHeading).toHaveText('PAGA SEGURO CON');
  await expect(paymentHeading).toHaveCSS('color', 'rgb(255, 255, 255)');
});

test('links footer email contact to the configured Lemoon address', async ({ page }) => {
  await page.goto('/tests/fixtures/footer-accordion.html');

  const emailLink = page.locator('.lemoon-footer__contact[href^="mailto:"]');
  await expect(emailLink).toHaveAttribute('href', 'mailto:hola@lemoon.cl');
  await expect(emailLink).toHaveText('hola@lemoon.cl');
});

test('shows the contact form link directly above the email link', async ({ page }) => {
  await page.goto('/tests/fixtures/footer-accordion.html');

  const contacts = page.locator('.lemoon-footer__contact-list');
  const contactLink = contacts.getByRole('link', { name: 'Contáctanos', exact: true });
  const emailLink = contacts.getByRole('link', { name: 'hola@lemoon.cl' });
  await expect(contactLink).toHaveAttribute('href', '/pages/contact');
  const contactIcon = contactLink.locator('.lemoon-footer__contact-icon img');
  await expect(contactIcon).toHaveAttribute('src', '/assets/lemoon-icon-contact.svg');
  await expect(contactIcon).toBeVisible();
  await expect(contactIcon).toHaveAttribute('width', '20');
  await expect(contactIcon).toHaveAttribute('height', '20');
  expect(await contactLink.evaluate((element) => element.compareDocumentPosition(document.querySelector('.lemoon-footer__contact[href^="mailto:"]')) & Node.DOCUMENT_POSITION_FOLLOWING)).toBeTruthy();
  await expect(emailLink).toBeVisible();
});
