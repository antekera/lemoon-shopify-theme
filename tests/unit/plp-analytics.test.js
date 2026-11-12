import { expect, test, vi } from 'vitest';
import { initializePlpAnalytics } from '../../assets/lemoon-plp-analytics.js';

function harness({ allowed = true, editor = false, sdk = true, loader } = {}) {
  const document = new EventTarget();
  const root = new EventTarget();
  const publish = vi.fn(() => Promise.resolve(true));
  const privacy = { analyticsProcessingAllowed: vi.fn(() => allowed) };
  const environment = {
    document,
    Shopify: { designMode: editor, ...(sdk ? { analytics: { publish } } : {}) },
  };
  let filters = [];
  let sort = 'manual';
  let requestId = 0;
  let userIntent = false;
  Object.assign(root, {
    ownerDocument: document,
    dataset: { collectionHandle: 'anteojos-de-sol' },
    contains: () => true,
    querySelectorAll: (selector) => selector === '[data-plp-active-option]'
      ? filters.map(([filterParam, filterValue]) => ({ dataset: { filterParam, filterValue } })) : [],
    querySelector: (selector) => selector === '#SortBy' ? { value: sort } : null,
  });
  const privacyLoader = vi.fn(loader || (() => Promise.resolve(privacy)));
  const initialize = () => initializePlpAnalytics(root, { environment, privacyLoader });
  const controller = initialize();
  const input = (name = 'filter.v.option.color') => {
    const event = new Event('input');
    Object.defineProperty(event, 'target', { value: { matches: (selector) => {
      const selectors = selector.split(',').map((part) => part.trim());
      return (name.startsWith('filter.') && selectors.includes('[name^="filter."]'))
        || (name === 'sort_by' && selectors.includes('#SortBy'))
        || (name === 'price_handle' && selectors.includes('[data-price-handle]'));
    } } });
    root.dispatchEvent(event);
    userIntent = true;
  };
  const click = (isRemove = true) => {
    const event = new Event('click', { cancelable: true });
    Object.defineProperty(event, 'target', { value: { closest: () => isRemove ? {} : null } });
    root.dispatchEvent(event);
    if (isRemove) userIntent = true;
    return event;
  };
  const dispatch = (name, detail) => {
    const event = new Event(name);
    Object.defineProperty(event, 'detail', { value: detail });
    document.dispatchEvent(event);
  };
  const start = ({ userInitiated = userIntent } = {}) => {
    const id = ++requestId;
    dispatch('lemoon:facets-start', { requestId: id, userInitiated });
    userIntent = false;
    return id;
  };
  const finish = (id, { active = filters, sorted = sort } = {}) => {
    filters = active;
    sort = sorted;
    dispatch('lemoon:facets-updated', { requestId: id });
  };
  const update = (state = {}) => finish(start(), state);
  const set = ({ active = filters, sorted = sort } = {}) => { filters = active; sort = sorted; };
  return { root, document, environment, publish, privacy, privacyLoader, controller, initialize, input, click, start, finish, update, set };
}

test('publishes only confirmed filter additions and removals, once per changed option', async () => {
  const h = harness(); await h.controller.ready;
  h.update();
  h.input();
  expect(h.publish).not.toHaveBeenCalled();
  h.update({ active: [['filter.v.option.color', 'Negro'], ['filter.v.option.color', 'Azul']] });
  expect(h.publish.mock.calls).toEqual([
    ['lemoon:plp_filter_change', { collection_handle: 'anteojos-de-sol', filter_param: 'filter.v.option.color', filter_value: 'Negro', action: 'add' }],
    ['lemoon:plp_filter_change', { collection_handle: 'anteojos-de-sol', filter_param: 'filter.v.option.color', filter_value: 'Azul', action: 'add' }],
  ]);
  h.update();
  h.click();
  h.update({ active: [['filter.v.option.color', 'Azul']] });
  expect(h.publish.mock.calls.at(-1)).toEqual(['lemoon:plp_filter_change', { collection_handle: 'anteojos-de-sol', filter_param: 'filter.v.option.color', filter_value: 'Negro', action: 'remove' }]);
  expect(h.publish).toHaveBeenCalledTimes(3);
  h.controller.destroy();
});

test('clear all emits a removal for every confirmed option and keeps unrelated sort unchanged', async () => {
  const h = harness(); await h.controller.ready;
  h.input(); h.update({ active: [['filter.v.option.color', 'Negro'], ['filter.v.price.gte', '10000']] });
  h.publish.mockClear();
  h.click(); h.update({ active: [] });
  expect(h.publish.mock.calls).toEqual([
    ['lemoon:plp_filter_change', { collection_handle: 'anteojos-de-sol', filter_param: 'filter.v.option.color', filter_value: 'Negro', action: 'remove' }],
    ['lemoon:plp_filter_change', { collection_handle: 'anteojos-de-sol', filter_param: 'filter.v.price.gte', filter_value: '10000', action: 'remove' }],
  ]);
  h.controller.destroy();
});

test('price slider handle without a name confirms filter intent only after AJAX render', async () => {
  const h = harness(); await h.controller.ready;
  h.input('price_handle');
  expect(h.publish).not.toHaveBeenCalled();
  h.update({ active: [['filter.v.price.gte', '10000']] });
  expect(h.publish.mock.calls).toEqual([['lemoon:plp_filter_change', {
    collection_handle: 'anteojos-de-sol', filter_param: 'filter.v.price.gte', filter_value: '10000', action: 'add',
  }]]);
  h.controller.destroy();
});

test('publishes a confirmed sort selection once; refreshes and unrelated input do not publish', async () => {
  const h = harness(); await h.controller.ready;
  h.update({ sorted: 'best-selling' }); // Browser history or initial hydration.
  expect(h.publish).not.toHaveBeenCalled();
  h.input('sort_by');
  h.update({ sorted: 'price-ascending' });
  expect(h.publish.mock.calls).toEqual([['lemoon:plp_sort_change', { collection_handle: 'anteojos-de-sol', sort_value: 'price-ascending' }]]);
  h.input('sort_by'); h.update(); h.click(false); h.update({ sorted: 'price-descending' });
  expect(h.publish).toHaveBeenCalledTimes(1);
  h.controller.destroy();
});

test('failed filter request cannot attribute later history navigation to the user', async () => {
  const h = harness(); await h.controller.ready;
  h.input();
  h.start(); // Request fails, so no facets-updated event arrives.
  h.start({ userInitiated: false });
  h.finish(2, { active: [['filter.v.option.color', 'Negro']] });
  expect(h.publish).not.toHaveBeenCalled();
  h.input(); h.update({ active: [['filter.v.option.color', 'Azul']] });
  expect(h.publish.mock.calls).toEqual([
    ['lemoon:plp_filter_change', { collection_handle: 'anteojos-de-sol', filter_param: 'filter.v.option.color', filter_value: 'Negro', action: 'remove' }],
    ['lemoon:plp_filter_change', { collection_handle: 'anteojos-de-sol', filter_param: 'filter.v.option.color', filter_value: 'Azul', action: 'add' }],
  ]);
  h.controller.destroy();
});

test('out-of-order AJAX completion cannot publish stale filter changes', async () => {
  const h = harness(); await h.controller.ready;
  h.input(); const first = h.start();
  h.input(); const latest = h.start();
  h.finish(latest, { active: [['filter.v.option.color', 'Azul']] });
  expect(h.publish.mock.calls).toEqual([['lemoon:plp_filter_change', {
    collection_handle: 'anteojos-de-sol', filter_param: 'filter.v.option.color', filter_value: 'Azul', action: 'add',
  }]]);
  h.finish(first, { active: [['filter.v.option.color', 'Negro']] });
  expect(h.publish).toHaveBeenCalledTimes(1);
  h.controller.destroy();
});

test('strict native consent fails closed without replay after consent is granted', async () => {
  for (const allowed of [false, undefined, 'yes', 1]) {
    const h = harness({ allowed: false }); await h.controller.ready;
    h.privacy.analyticsProcessingAllowed.mockReturnValue(allowed);
    h.input(); h.update({ active: [['filter.v.option.color', 'Negro']] });
    expect(h.publish).not.toHaveBeenCalled();
    h.privacy.analyticsProcessingAllowed.mockReturnValue(true);
    h.update();
    expect(h.publish).not.toHaveBeenCalled();
    h.input(); h.update({ active: [['filter.v.option.color', 'Azul']] });
    expect(h.publish).toHaveBeenCalledTimes(2);
    h.controller.destroy();
  }
  const h = harness({ loader: () => Promise.reject(Error('privacy unavailable')) }); await h.controller.ready;
  h.input(); h.update({ active: [['filter.v.option.color', 'Negro']] });
  expect(h.publish).not.toHaveBeenCalled();
  h.controller.destroy();
});

test('changes before privacy is ready are discarded rather than queued', async () => {
  let releasePrivacy;
  const h = harness({ loader: () => new Promise((resolve) => { releasePrivacy = resolve; }) });
  h.input(); h.update({ active: [['filter.v.option.color', 'Negro']] });
  await Promise.resolve();
  releasePrivacy(h.privacy); await h.controller.ready;
  expect(h.publish).not.toHaveBeenCalled();
  h.update();
  expect(h.publish).not.toHaveBeenCalled();
  h.input(); h.update({ active: [['filter.v.option.color', 'Azul']] });
  expect(h.publish).toHaveBeenCalledTimes(2);
  h.controller.destroy();
});

test('ignores malformed and overlong filter metadata before publishing', async () => {
  const h = harness(); await h.controller.ready;
  h.input();
  h.update({ active: [
    ['filter.v.option.color', 'Negro'],
    ['sort_by', 'price-ascending'],
    ['filter.v.option.color', 'x'.repeat(129)],
    ['filter.v.option.color', ''],
    ['filter.v.option.color;bad', 'Azul'],
  ] });
  expect(h.publish.mock.calls).toEqual([['lemoon:plp_filter_change', {
    collection_handle: 'anteojos-de-sol', filter_param: 'filter.v.option.color', filter_value: 'Negro', action: 'add',
  }]]);
  h.controller.destroy();
});

test('missing SDK, privacy errors and rejected publishes never interrupt filter interactions', async () => {
  const h = harness({ sdk: false }); await h.controller.ready;
  h.input(); h.update({ active: [['filter.v.option.color', 'Negro']] });
  expect(h.publish).not.toHaveBeenCalled();
  h.environment.Shopify.analytics = { publish: h.publish };
  h.publish.mockImplementation(() => { throw Error('SDK error'); });
  h.click(); expect(h.click().defaultPrevented).toBe(false);
  h.update({ active: [] });
  expect(h.publish).toHaveBeenCalledTimes(1);
  h.publish.mockImplementation(() => Promise.reject(Error('SDK rejected')));
  h.input(); h.update({ active: [['filter.v.option.color', 'Azul']] });
  await Promise.resolve();
  h.privacy.analyticsProcessingAllowed.mockImplementation(() => { throw Error('privacy error'); });
  h.input(); h.update({ active: [] });
  expect(h.publish).toHaveBeenCalledTimes(2);
  h.controller.destroy();
});

test('initialization is idempotent, destruction removes handlers, and editor mode is silent', async () => {
  const h = harness(); await h.controller.ready;
  expect(h.initialize()).toBe(h.controller);
  expect(h.privacyLoader).toHaveBeenCalledTimes(1);
  h.controller.destroy();
  h.input(); h.update({ active: [['filter.v.option.color', 'Negro']] });
  expect(h.publish).not.toHaveBeenCalled();
  const next = h.initialize(); await next.ready;
  h.input(); h.update({ active: [['filter.v.option.color', 'Azul']] });
  expect(h.publish.mock.calls).toEqual([
    ['lemoon:plp_filter_change', { collection_handle: 'anteojos-de-sol', filter_param: 'filter.v.option.color', filter_value: 'Negro', action: 'remove' }],
    ['lemoon:plp_filter_change', { collection_handle: 'anteojos-de-sol', filter_param: 'filter.v.option.color', filter_value: 'Azul', action: 'add' }],
  ]);
  next.destroy();
  const editor = harness({ editor: true });
  expect(editor.controller).toBeNull();
  expect(editor.privacyLoader).not.toHaveBeenCalled();
});
