'use strict';
const fs = require('node:fs');

function checkRoute(expected, actual, status, themeId, expectedId) {
  const want = new URL(expected), got = new URL(actual);
  if (status !== 200 || got.origin !== want.origin || got.pathname !== want.pathname || String(themeId) !== String(expectedId)) {
    throw Error('Storefront readiness failed: expected route, HTTP 200 and temporary Shopify.theme.id are required');
  }
}
async function authenticate(browser, context) {
  const page = await browser.newPage();
  let expectedId = context.id;
  page.setDefaultNavigationTimeout(60000);
  // Never execute candidate password-page JavaScript while credentials are present.
  await page.setJavaScriptEnabled(false);
  const origin = new URL(context.urls[0]).origin;
  // Covers every method/resource/redirect, including native submitter GET overrides.
  // This guard exists only on this dedicated authentication page.
  const guard = request => new URL(request.url()).origin === origin ? request.continue() : request.abort();
  await page.setRequestInterception(true);
  page.on('request', guard);
  try {
    // Visit preview first; if password protection redirects, submit the real form.
    await page.goto(context.urls[0], {waitUntil: 'domcontentloaded'});
    if (new URL(page.url()).origin !== origin) throw Error('Authentication origin mismatch; refusing password submission');
    if (new URL(page.url()).pathname === '/password') {
      if (!context.password) throw Error('Storefront password required');
      await page.waitForSelector('form[action*="password"] input[type="password"]');
      const action = await page.$eval('form[action*="password"]', form => form.action);
      const target = new URL(action);
      if (target.origin !== origin || target.pathname !== '/password') throw Error('Password form action mismatch; refusing submission');
      await page.type('form[action*="password"] input[type="password"]', context.password);
      await Promise.all([
        page.waitForNavigation({waitUntil: 'domcontentloaded'}),
        page.keyboard.press('Enter'),
      ]);
      // An aborted submitter override can resolve navigation without authenticating.
      // Keep the guard until the trusted password page has actually been left.
      const after = new URL(page.url());
      if (after.origin !== origin || after.pathname === '/password' || await page.$('form[action*="password"] input[type="password"]')) {
        throw Error('Password authentication did not leave the trusted password page');
      }
    }
    page.off('request', guard);
    await page.setRequestInterception(false);
    await page.setJavaScriptEnabled(true);
    // Revisit all preview URLs after password submission; never score a password/404/live page.
    for (const url of context.urls) {
      const response = await page.goto(url, {waitUntil: 'domcontentloaded'});
      const theme = await page.evaluate(() => window.Shopify && window.Shopify.theme);
      if (context.mode === 'commercial') {
        if (!theme || theme.role !== 'main' || !/^\d+$/.test(String(theme.id))) throw Error('Commercial audit requires the current published theme');
        expectedId = expectedId || theme.id;
      }
      if (context.mode === 'lab' && theme?.role !== 'unpublished') throw Error('Lab audit requires the temporary unpublished theme');
      checkRoute(url, page.url(), response && response.status(), theme && theme.id, expectedId);
      if (await page.$('form[action*="password"] input[type="password"]')) throw Error('Password form remains after authentication');
    }
  } finally { await page.close(); }
}
module.exports = async browser => authenticate(browser, JSON.parse(fs.readFileSync(process.env.LHCI_AUTH_CONTEXT, 'utf8')));
module.exports.authenticate = authenticate;
module.exports.checkRoute = checkRoute;
