import { expect, test } from 'vitest';
import syncPromotions from '../../scripts/shopify-flow/pdp-promotions.js';

const discount = (overrides = {}) => ({
  title: 'Oferta desde Shopify', status: 'ACTIVE', startsAt: '2026-01-01T00:00:00Z', endsAt: null,
  customerGets: { items: { collections: { nodes: [{ id: 'gid://shopify/Collection/123' }] } } },
  ...overrides,
});

test('inactive or deleted discounts clear the tags, and unsupported eligibility fails closed', () => {
  const input = { getDiscountData: [
    { id: 'expired', discount: discount({ status: 'EXPIRED' }) },
    { id: 'scheduled', discount: discount({ status: 'SCHEDULED' }) },
    { id: 'unsupported', discount: discount({ customerGets: { items: { allItems: true } } }) },
  ] };
  expect(JSON.parse(syncPromotions(input).promotionsJson)).toEqual([]);
  expect(JSON.parse(syncPromotions({ getDiscountData: [] }).promotionsJson)).toEqual([]);
});

test('uses Shopify labels and collection eligibility, preserving first-purchase conditions', () => {
  const result = JSON.parse(syncPromotions({ getDiscountData: [{
    id: 'native-discount', discount: discount({ context: { segments: [{ query: 'number_of_orders = 0' }] } }),
  }] }).promotionsJson);
  expect(result[0]).toMatchObject({ title: 'Oferta desde Shopify', collection_ids: ['123'], first_purchase_only: true });
});

test('accepts the Flow union and list representation without treating mixed segments as first-purchase-only', () => {
  const native = discount({
    customerGets: { items: { DiscountCollections: { collections: [{ id: 'gid://shopify/Collection/456' }] } } },
    context: { DiscountCustomerSegments: { segments: [{ query: 'number_of_orders = 0' }, { query: 'number_of_orders > 1' }] } },
  });
  const result = JSON.parse(syncPromotions({ getDiscountData: [{
    id: 'flow-discount', discount: { __typename: 'DiscountAutomaticBasic', DiscountAutomaticBasic: native },
  }] }).promotionsJson);
  expect(result[0]).toMatchObject({ collection_ids: ['456'], first_purchase_only: false });
});
