import { loadCustomerPrivacy } from './lemoon-cookie-preferences.js';

const controllers = new WeakMap();
const FILTER_EVENT = 'lemoon:plp_filter_change';
const SORT_EVENT = 'lemoon:plp_sort_change';

function readState(root) {
  const filters = new Map();
  root.querySelectorAll('[data-plp-active-option]').forEach((option) => {
    const param = option.dataset.filterParam;
    const value = option.dataset.filterValue;
    if (!param || param.length > 128 || !/^filter\.[a-zA-Z0-9_.-]+$/.test(param)
      || !value || value.length > 128) return;
    filters.set(`${param}\u0000${value}`, { filter_param: param, filter_value: value });
  });
  const select = root.querySelector('#SortBy');
  const sort = select?.value || '';
  return { filters, sort: sort.length <= 64 ? sort : '' };
}

/** Track only user-initiated changes confirmed by a successful facets render. */
export function initializePlpAnalytics(root, {
  environment = window,
  privacyLoader = loadCustomerPrivacy,
} = {}) {
  if (!root || environment.Shopify?.designMode) return null;
  if (controllers.has(root)) return controllers.get(root);
  const doc = root.ownerDocument || environment.document;
  if (!doc) return null;

  const collectionHandle = root.dataset.collectionHandle;
  if (!collectionHandle || !/^[a-z0-9-]{1,100}$/.test(collectionHandle)) return null;

  let state = readState(root);
  let pending = false;
  let pendingRequestId = null;
  let latestRequestId = null;
  let privacy;
  let destroyed = false;
  const onInput = (event) => {
    const target = event.target;
    if (target?.matches?.('[name^="filter."], [data-price-handle], #SortBy')) pending = true;
  };
  const onClick = (event) => {
    const target = event.target?.closest?.('facet-remove a[href], [data-clear-filters][href]');
    if (target && root.contains(target)) pending = true;
  };
  const publish = (name, payload) => {
    try {
      if (destroyed || environment.Shopify?.designMode
        || privacy?.analyticsProcessingAllowed?.() !== true
        || typeof environment.Shopify?.analytics?.publish !== 'function') return;
      Promise.resolve(environment.Shopify.analytics.publish(name, payload)).catch(() => {});
    } catch { /* Analytics must never interrupt filtering or sorting. */ }
  };
  const onFacetsStart = (event) => {
    latestRequestId = event.detail?.requestId ?? null;
    pendingRequestId = event.detail?.userInitiated && pending ? latestRequestId : null;
    pending = false;
  };
  const onFacetsUpdated = (event) => {
    if (destroyed) return;
    const requestId = event.detail?.requestId ?? null;
    if (requestId !== latestRequestId) return;
    const next = readState(root);
    if (requestId !== null && requestId === pendingRequestId) {
      state.filters.forEach((filter, key) => {
        if (!next.filters.has(key)) publish(FILTER_EVENT, { collection_handle: collectionHandle, ...filter, action: 'remove' });
      });
      next.filters.forEach((filter, key) => {
        if (!state.filters.has(key)) publish(FILTER_EVENT, { collection_handle: collectionHandle, ...filter, action: 'add' });
      });
      if (next.sort && next.sort !== state.sort) {
        publish(SORT_EVENT, { collection_handle: collectionHandle, sort_value: next.sort });
      }
    }
    state = next;
    pendingRequestId = null;
  };
  const onFacetsFailed = (event) => {
    if (event.detail?.requestId === pendingRequestId) pendingRequestId = null;
  };
  root.addEventListener('input', onInput);
  root.addEventListener('click', onClick, true);
  doc.addEventListener('lemoon:facets-start', onFacetsStart);
  doc.addEventListener('lemoon:facets-updated', onFacetsUpdated);
  doc.addEventListener('lemoon:facets-failed', onFacetsFailed);
  const ready = Promise.resolve().then(() => privacyLoader(environment)).then((api) => {
    if (!destroyed) privacy = api;
  }).catch(() => {});
  const controller = {
    ready,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      root.removeEventListener('input', onInput);
      root.removeEventListener('click', onClick, true);
      doc.removeEventListener('lemoon:facets-start', onFacetsStart);
      doc.removeEventListener('lemoon:facets-updated', onFacetsUpdated);
      doc.removeEventListener('lemoon:facets-failed', onFacetsFailed);
      controllers.delete(root);
    },
  };
  controllers.set(root, controller);
  return controller;
}

if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  const initialize = () => document.querySelectorAll('.lemoon-plp').forEach((root) => initializePlpAnalytics(root));
  document.addEventListener('shopify:section:load', initialize);
  initialize();
}
