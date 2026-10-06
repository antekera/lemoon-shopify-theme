export function shouldPredict(term) {
  return term.trim().length >= 3;
}

export function selectSuggestions(products, random = Math.random) {
  const unique = [...new Map(products.map((product) => [product.id, product])).values()];
  for (let index = unique.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [unique[index], unique[other]] = [unique[other], unique[index]];
  }
  return unique.slice(0, 3);
}

export function upsertRecentlyViewed(products, product, limit = 20) {
  if (!product?.id || !product?.url || !product?.title) return products.slice(0, limit);
  const id = String(product.id);
  return [product, ...products.filter((item) => String(item?.id) !== id)].slice(0, limit);
}

export function getRecentlyViewed(products, limit = 3) {
  if (!Array.isArray(products)) return [];
  return products.filter((item) => item?.id && item?.title && item?.url).slice(0, limit);
}

export function buildSearchUrl(route, term) {
  const query = term.trim();
  return query ? `${route}?${new URLSearchParams({ q: query, type: 'product' })}` : route;
}

export function buildPredictiveUrl(route, term) {
  const endpoint = route.endsWith('.json') ? route : `${route}.json`;
  return `${endpoint}?${new URLSearchParams({ q: term.trim(), 'resources[type]': 'product', 'resources[limit]': '5' })}`;
}

export function createRequestGate() {
  let revision = 0;
  return {
    next: () => ++revision,
    invalidate: () => { revision += 1; },
    isCurrent: (token) => token === revision,
  };
}
