import { expect, test } from '@playwright/test';

const fixture = '/tests/fixtures/mobile-menu.html';
const menu = '[data-lemoon-nav]';
const trigger = '[data-lemoon-nav-open]:visible';

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(fixture);
});

test('opens below the header and closes with Escape while restoring focus and scroll', async ({ page }) => {
  const menuButton = page.locator(trigger);
  const menuPanel = page.locator(menu);
  await menuButton.click();

  await expect(menuPanel).toBeVisible();
  await expect(page.locator('[data-lemoon-nav-root]')).toBeVisible();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  await expect(menuButton).toHaveAttribute('aria-label', 'Cerrar menú');
  await expect(page.locator('[data-lemoon-nav-overlay]')).toHaveCSS('opacity', '1');

  const headerRow = await page.locator('.lemoon-header__mobile-inner').boundingBox();
  const drawer = await menuPanel.boundingBox();
  expect(drawer.y).toBeCloseTo(headerRow.y + headerRow.height, 0);
  expect(drawer.width).toBeCloseTo(390 * 0.95, 0);
  await expect(page.locator('.lemoon-header__quick-nav')).toBeHidden();
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');

  await page.keyboard.press('Escape');
  await expect(menuPanel).toBeHidden();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await expect(menuButton).toBeFocused();
  await expect(page.locator('body')).toHaveCSS('overflow', 'visible');
});

test('opens a category second level and returns with the menu control', async ({ page }) => {
  const menuButton = page.locator(trigger);
  await menuButton.click();
  await page.locator('[data-lemoon-nav-target="opticos"]').click();

  await expect(page.locator('[data-lemoon-nav-root]')).toBeHidden();
  await expect(page.locator('[data-lemoon-nav-panel="opticos"]')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Ver todo' })).toHaveAttribute('href', '/collections/opticos');
  await expect(menuButton).toHaveAttribute('aria-label', 'Volver atrás');

  await menuButton.click();
  await expect(page.locator('[data-lemoon-nav-panel="opticos"]')).toBeHidden();
  await expect(page.locator('[data-lemoon-nav-root]')).toBeVisible();
  await expect(menuButton).toHaveAttribute('aria-label', 'Cerrar menú');
});

test('keeps direct links out of the second-level interaction', async ({ page }) => {
  await page.locator(trigger).click();
  const bestSellers = page.getByRole('link', { name: 'Más vendidos' });
  await expect(bestSellers).toHaveAttribute('href', '/collections/mejor-vendidos');
  await expect(page.locator('[data-lemoon-nav-target="vendidos"]')).toHaveCount(0);
});

test('limits the desktop drawer to 300 pixels', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.locator(trigger).click();
  const drawer = await page.locator(menu).boundingBox();
  expect(drawer.width).toBe(300);
});

test('keeps utility-link hover transparent and underlines the text', async ({ page }) => {
  await page.locator(trigger).click();
  const utilityLink = page.getByRole('link', { name: 'Envíos y retornos' });
  await utilityLink.hover();
  await expect(utilityLink).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(utilityLink).toHaveCSS('text-decoration-line', 'underline');
});

test('reinitializes after the header section reloads in the theme editor', async ({ page }) => {
  await page.evaluate(() => {
    const header = document.querySelector('.lemoon-header');
    const overlay = document.querySelector('[data-lemoon-nav-overlay]');
    const drawer = document.querySelector('[data-lemoon-nav]');
    const sectionMarkup = [header.outerHTML, overlay.outerHTML, drawer.outerHTML];

    document.dispatchEvent(new CustomEvent('shopify:section:unload', {
      detail: { sectionId: 'fixture-header' },
    }));
    header.remove();

    const replacement = document.createElement('section');
    replacement.id = 'shopify-section-fixture-header';
    replacement.innerHTML = sectionMarkup.join('');
    document.body.append(replacement);
    replacement.dispatchEvent(new CustomEvent('shopify:section:load', { bubbles: true }));
  });

  await expect(page.locator('[data-lemoon-nav]')).toHaveCount(1);
  await expect(page.locator(menu)).toHaveCSS('visibility', 'hidden');
  const newMenuButton = page.locator(trigger).first();
  await newMenuButton.click();
  await expect(page.locator(menu)).toHaveClass(/is-open/);
  await expect(page.locator(menu)).toHaveAttribute('aria-hidden', 'false');
  await expect(newMenuButton).toHaveAttribute('aria-expanded', 'true');
});
