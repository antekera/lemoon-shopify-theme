import { expect, test } from '@playwright/test';

for (const [label, selector] of [
  ['filter chip', '#ProductGridContainer .lemoon-filter-pill'],
  ['clear all', '[data-clear-filters][href]'],
]) {
  test(`${label} publishes removal after the facet anchor starts its request`, async ({ page }) => {
    await page.goto('/tests/fixtures/shared-drawers.html?kind=facets-plp');
    await page.evaluate(async () => {
      const { initializePlpAnalytics } = await import('/assets/lemoon-plp-analytics.js');
      const root = document.querySelector('.lemoon-plp');
      root.dataset.collectionHandle = 'opticos';
      window.plpEvents = [];
      window.Shopify = { analytics: { publish: (name, payload) => window.plpEvents.push({ name, payload }) } };
      const controller = initializePlpAnalytics(root, {
        privacyLoader: () => Promise.resolve({ analyticsProcessingAllowed: () => true }),
      });
      await controller.ready;
    });

    await page.locator(selector).first().evaluate((anchor) => anchor.click());
    await expect.poll(() => page.evaluate(() => window.plpEvents)).toEqual([{
      name: 'lemoon:plp_filter_change',
      payload: {
        collection_handle: 'opticos',
        filter_param: 'filter.p.m.custom.frame_shape',
        filter_value: 'rectangular',
        action: 'remove',
      },
    }]);
  });
}
