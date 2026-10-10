// Shopify Flow "Run code" action. Labels and eligibility come from Shopify discounts.
export default function main({ getDiscountData = [] }) {
  const promotions = [];
  for (const node of getDiscountData) {
    const raw = node.discount;
    const discount = raw?.[raw.__typename] ?? raw;
    if (!discount || discount.status !== 'ACTIVE' || !discount.title) continue;
    const items = discount.customerGets?.items;
    const selection = items?.DiscountCollections ?? items;
    const collections = selection?.collections?.nodes ?? selection?.collections;
    if (!Array.isArray(collections) || collections.length === 0) continue;
    const context = discount.context?.DiscountCustomerSegments ?? discount.context;
    const segments = context?.segments ?? [];
    promotions.push({
      id: node.id,
      title: discount.title,
      status: discount.status,
      starts_at: discount.startsAt,
      ends_at: discount.endsAt,
      collection_ids: collections.map(collection => collection.id.split('/').pop()),
      first_purchase_only: segments.length > 0 && segments.every(segment => /^number_of_orders\s*=\s*0$/.test(segment.query.trim())),
    });
  }
  return { promotionsJson: JSON.stringify(promotions) };
}
