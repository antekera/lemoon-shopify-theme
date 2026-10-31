import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const scenarios = ['newsletter', 'newsletter-error', 'newsletter-success', 'article', 'article-error', 'article-success', 'article-moderated-success', 'legacy-faq', ...['shipping','returns','terms','privacy','warranty'].map(kind => `legal-${kind}`)];
const fixture = scenario => `/tests/fixtures/second-wave.html?scenario=${scenario}`;

for (const scenario of scenarios) {
  test(`${scenario}: rendered semantic contract`, async ({ page }) => {
    const response = await page.goto(fixture(scenario));
    expect(response.status()).toBe(200);
    // Compare real parsed DOM, not Liquid source or duplicated legacy markup.
    // Ignore only presentation marker classes and whitespace; retain local classes,
    // order, native attributes, feedback nesting, headings and richtext semantics.
    const contract = await page.locator(scenario.startsWith('newsletter') ? '.lemoon-newsletter' : scenario.startsWith('article') ? '#comments' : scenario === 'legacy-faq' ? '.lemoon-faq' : '.lemoon-legal-page').evaluate(root => {
      function walk(node) {
        if (node.nodeType === Node.TEXT_NODE) return node.textContent.replace(/\s+/g, ' ').trim() || null;
        if (node.nodeType !== Node.ELEMENT_NODE || ['STYLE','SCRIPT'].includes(node.tagName)) return null;
        // Action's label span is presentational; preserve all text and nested icons.
        if (node.tagName === 'SPAN' && node.attributes.length === 0) return [...node.childNodes].map(walk).flat().filter(Boolean);
        const attrs = Object.fromEntries([...node.attributes].filter(a => a.name !== 'class').map(a => [a.name,a.value]).sort(([a],[b]) => a.localeCompare(b)));
        const classes = [...node.classList].filter(c => !c.startsWith('lemoon-ui-')).sort();
        if (classes.length) attrs.class = classes.join(' ');
        return { tag: node.tagName.toLowerCase(), attrs, children: [...node.childNodes].map(walk).flat().filter(Boolean) };
      }
      return walk(root);
    });
    expect(contract).toEqual(JSON.parse(readFileSync(`tests/fixtures/second-wave-baseline/${scenario}.json`)));
  });
}

for (const scenario of ['newsletter','article']) {
  test(`${scenario}: native validation and FormData without a POST`, async ({ page }) => {
    const posts = [];
    page.on('request', request => { if (request.method() === 'POST') posts.push(request.url()); });
    await page.goto(fixture(scenario));
    const form = page.locator('form');
    const submit = form.locator('[type=submit]');
    await submit.click();
    expect(await form.evaluate(node => node.checkValidity())).toBe(false);
    if (scenario === 'article') { await form.locator('[name="comment[author]"]').fill('Fixture'); await form.locator('textarea').fill('Mensaje'); }
    const email = form.locator('[type=email]');
    await email.fill('invalid');
    await submit.click();
    expect(await email.evaluate(node => node.validity.typeMismatch)).toBe(true);
    await email.fill('fixture@example.test');
    await submit.click();
    await expect(page.locator('body')).toHaveAttribute('data-fixture-submit','prevented');
    const values = await form.evaluate(node => Object.fromEntries(new FormData(node)));
    expect(values).toMatchObject(scenario === 'newsletter' ? { form_type:'customer', 'contact[tags]':'newsletter', 'contact[email]':'fixture@example.test' } : { form_type:'new_comment', 'comment[author]':'Fixture', 'comment[email]':'fixture@example.test', 'comment[body]':'Mensaje' });
    expect(posts).toEqual([]);
  });
}

test('legacy FAQ preserves first-open/editor attributes, keyboard toggles and richtext links', async ({ page }) => {
  await page.goto(fixture('legacy-faq'));
  const first = page.locator('details').first(), second = page.locator('details').nth(1);
  await expect(first).toHaveAttribute('open','');
  await expect(first).toHaveAttribute('data-shopify-editor-block','q1');
  await expect(second).not.toHaveAttribute('open');
  await first.locator('summary').focus();
  await page.keyboard.press('Space');
  await expect(first).not.toHaveAttribute('open');
  await page.keyboard.press('Enter');
  await expect(first.getByRole('link')).toBeVisible();
});

for (const scenario of ['newsletter','article']) {
  test(`${scenario}: migrated controls use the approved boundary and separate keyboard focus`, async ({ page }) => {
    await page.goto(fixture(scenario));
    const control = page.locator('form [type=email]');
    for (const edge of ['top','right','bottom','left']) {
      await expect(control).toHaveCSS(`border-${edge}-width`, '1px');
      await expect(control).toHaveCSS(`border-${edge}-color`, 'rgb(11, 31, 58)');
    }
    await control.focus();
    await expect(control).toHaveCSS('outline-color','rgb(11, 31, 58)');
    await expect(control).toHaveCSS('outline-width','2px');
    expect(await control.evaluate(node => parseFloat(getComputedStyle(node).outlineOffset))).toBeGreaterThanOrEqual(2);
    await page.emulateMedia({ forcedColors: 'active' });
    await expect(control).toHaveCSS('border-top-style','solid');
    await expect(control).toHaveCSS('outline-style','solid');
  });
}

for (const width of [390,749,750,989,990,1440]) {
  test(`second wave sections reflow at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const scenario of ['newsletter-error','article-error','legacy-faq','legal-terms']) {
      await page.goto(fixture(scenario));
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      if (width === 390 || width === 1440) await page.screenshot({ path: testInfo.outputPath(`${scenario}-${width}.png`), fullPage: true });
    }
  });
}


test('legacy FAQ long editor content remains readable after native expansion', async ({ page }) => {
  for (const width of [390,750,1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(fixture('legacy-faq-long'));
    const details = page.locator('details').nth(1);
    await details.locator('summary').click();
    await expect(details.getByRole('link')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  }
});

test('comment response autofocus and error destinations retain their native focus behavior', async ({ page }) => {
  for (const scenario of ['article-error','article-success']) {
    await page.goto(fixture(scenario));
    await expect(page.locator('h3[autofocus]')).toBeFocused();
  }
  await page.goto(fixture('article-error'));
  await page.locator('.form-status-list a[href$="-email"]').click();
  await expect(page.locator('[name="comment[email]"]')).toBeFocused();
});
