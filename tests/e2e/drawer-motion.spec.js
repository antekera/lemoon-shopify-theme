import { test, expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

const openerFor = page => page.getByRole('button', { name: 'Guía de medidas', exact: true });
// Retain the native element after removal of [open], while the exit is still painted.
const drawerFor = page => page.locator('dialog.lemoon-size-drawer');
const closeFor = drawer => drawer.getByRole('button', { name: 'Cerrar guía de medidas', exact: true });

async function attachRecording(testInfo, name, recording) {
  const path = testInfo.outputPath(name);
  await writeFile(path, JSON.stringify(recording, null, 2));
  await testInfo.attach(name, { path, contentType: 'application/json' });
}

async function openGuide(page, shell, width = 390) {
  await page.setViewportSize({ width, height: 844 });
  // Shopify loads this module with a version query. A relative import from the
  // optical controller must not create a second module instance/bootstrap.
  await page.route('**/tests/fixtures/size-guide.html?**', async route => {
    const response = await route.fetch();
    const body = (await response.text()).replace('src="/assets/lemoon-pdp-tools.js"', 'src="/assets/lemoon-pdp-tools.js?v=fixture"');
    await route.fulfill({ response, body });
  });
  await page.goto(`/tests/fixtures/size-guide.html?shell=${shell}&scenario=complete`);
  await openerFor(page).click();
  const drawer = drawerFor(page);
  await expect(drawer).toBeVisible();
  await expect.poll(() => drawer.evaluate(element => {
    const transform = new DOMMatrixReadOnly(getComputedStyle(element).transform);
    return Math.round(Math.abs(transform.m41) + Math.abs(transform.m42));
  })).toBe(0);
  const modules = await page.evaluate(() => performance.getEntriesByType('resource')
    .map(entry => entry.name).filter(name => new URL(name).pathname === '/assets/lemoon-pdp-tools.js'));
  expect(modules).toHaveLength(1);
  expect(new URL(modules[0]).searchParams.get('v')).toBe('fixture');
  return drawer;
}

async function recordClose(page, drawer, action) {
  await drawer.evaluate(element => {
    const sample = elapsed => {
      const style = getComputedStyle(element), rect = element.getBoundingClientRect();
      const matrix = new DOMMatrixReadOnly(style.transform);
      return {
        elapsed, open: element.open, modal: element.matches(':modal'), display: style.display, overlay: style.overlay,
        opacity: Number(style.opacity), visibility: style.visibility,
        transform: style.transform, translateX: matrix.m41, translateY: matrix.m42,
        x: rect.x, y: rect.y, width: rect.width, height: rect.height,
      };
    };
    const before = sample(-1);
    const supportsOverlay = CSS.supports('overlay', 'auto');
    window.drawerExitFrames = new Promise(resolve => {
      const onRequest = () => {
        document.removeEventListener('click', onRequest, true);
        element.removeEventListener('cancel', onRequest);
        const start = performance.now(), frames = [];
        const tick = () => {
          const elapsed = performance.now() - start;
          frames.push(sample(elapsed));
          if (elapsed < 360) requestAnimationFrame(tick);
          else resolve({ before, frames, supportsOverlay });
        };
        requestAnimationFrame(tick);
      };
      // Observe the user's close request: a compatibility exit may keep [open]
      // and modality until the visible slide finishes.
      document.addEventListener('click', onRequest, true);
      element.addEventListener('cancel', onRequest);
    });
  });
  if (action === 'repeated close requests') {
    await closeFor(drawer).click();
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    await drawer.evaluate(element => element.querySelector('[data-size-close], [data-close-dialog]').click());
  } else if (action === 'close button') await closeFor(drawer).click();
  else if (action === 'Escape') await page.keyboard.press('Escape');
  else await page.mouse.click(195, 16);
  return page.evaluate(() => window.drawerExitFrames);
}

for (const shell of ['standard', 'eyewear']) {
  for (const action of ['close button', 'Escape', 'backdrop', 'repeated close requests']) {
    test(`${shell}: mobile ${action} slides visibly down until dismissal and reopens`, async ({ page }, testInfo) => {
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const drawer = await openGuide(page, shell);
      const recording = await recordClose(page, drawer, action);
      await attachRecording(testInfo, 'exit-frames.json', recording);
      const { before, frames } = recording;
      expect(before.y).toBeCloseTo(32, 0);
      // Closed attributes alone prove no motion: inspect every rendered exit frame.
      expect(frames[0].display).toBe('block');
      if (recording.supportsOverlay) expect(frames[0].overlay).toBe('auto');
      else expect(frames[0].open).toBe(true);
      expect(frames[0].y).toBeGreaterThanOrEqual(before.y);
      expect(frames[0].y).toBeLessThan(before.y + before.height / 4);
      const moving = frames.filter(frame => frame.elapsed > 0 && frame.display !== 'none' && frame.y > before.y + 2 && frame.y < 842);
      expect(moving.length).toBeGreaterThanOrEqual(4);
      for (let index = 0; index < moving.length; index++) {
        const frame = moving[index];
        if (recording.supportsOverlay) expect(frame.overlay).toBe('auto');
        else { expect(frame.open).toBe(true); expect(frame.modal).toBe(true); }
        expect(frame.visibility).toBe('visible');
        expect(frame.x).toBeCloseTo(before.x, 0);
        // Keep the panel legible during its slide rather than fading ahead of it.
        expect(frame.opacity).toBe(1);
        if (index) expect(frame.y).toBeGreaterThan(moving[index - 1].y);
      }
      expect(moving.some(frame => frame.y > 780)).toBe(true);
      expect(frames.at(-1).display).toBe('none');
      if (recording.supportsOverlay) expect(frames.at(-1).overlay).toBe('none');
      expect(frames.at(-1).open).toBe(false);
      await expect(drawer).toBeHidden();
      await expect(openerFor(page)).toBeFocused();
      await openerFor(page).click();
      await expect(drawer).toBeVisible();
      await expect(closeFor(drawer)).toBeFocused();
      await expect.poll(() => drawer.evaluate(element => Math.round(element.getBoundingClientRect().y))).toBe(32);
      await page.keyboard.press('Escape');
      await expect(drawer).toBeHidden();
      await expect(openerFor(page)).toBeFocused();
      expect(errors).toEqual([]);
    });
  }

  test(`${shell}: reduced motion closes on the first rendered frame and restores focus`, async ({ page }, testInfo) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const drawer = await openGuide(page, shell);
    const recording = await recordClose(page, drawer, 'close button');
    await attachRecording(testInfo, 'reduced-exit-frames.json', recording);
    expect(recording.frames[0].display).toBe('none');
    expect(recording.frames.every(frame => frame.display === 'none')).toBe(true);
    await expect(openerFor(page)).toBeFocused();
    await openerFor(page).click();
    await expect(drawer).toBeVisible();
    await expect(closeFor(drawer)).toBeFocused();
  });

  test(`${shell}: desktop preserves its right drawer and native exit`, async ({ page }, testInfo) => {
    const drawer = await openGuide(page, shell, 1440);
    const recording = await recordClose(page, drawer, 'Escape');
    await attachRecording(testInfo, 'desktop-exit-frames.json', recording);
    const moving = recording.frames.filter(frame => frame.display !== 'none' && frame.x > recording.before.x + 2);
    expect(recording.before.x).toBeCloseTo(960, 0);
    expect(recording.before.width).toBeCloseTo(480, 0);
    if (recording.supportsOverlay) {
      expect(moving.length).toBeGreaterThanOrEqual(4);
      expect(moving.some(frame => frame.x > 1400)).toBe(true);
      for (const frame of moving) {
        expect(frame.y).toBeCloseTo(recording.before.y, 0);
        expect(frame.translateY).toBe(0);
      }
    } else {
      // WebKit's existing desktop owner closes immediately; the mobile adapter
      // must leave this baseline behavior intact.
      expect(recording.frames.every(frame => frame.display === 'none')).toBe(true);
    }
    expect(recording.frames.at(-1).display).toBe('none');
    await expect(openerFor(page)).toBeFocused();
  });
}
