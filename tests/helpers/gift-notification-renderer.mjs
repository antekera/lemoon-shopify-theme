import { readFileSync } from 'node:fs';
import { Liquid } from 'liquidjs';
const engine = new Liquid({ strictFilters: true, timezoneOffset: 0 });
// These filters model formatting for synthetic CLP fixtures. Shopify's own
// notification preview remains the authority for production money and code formatting.
engine.registerFilter('money_with_currency', cents => `$${new Intl.NumberFormat('es-CL').format(cents / 100)} CLP`);
engine.registerFilter('format_code', code => String(code).replace(/\s/g, '').match(/.{1,4}/g).join(' '));
engine.registerFilter('shopify_asset_url', path => `https://cdn.shopify.com/shopifycloud/shopify/assets/${path}`);
export const notificationContext = () => ({
  locale_direction: 'ltr',
  shop: { name: 'Lemoon', url: 'https://lemoon.cl', email: 'ayuda@example.test', email_logo_url: null, email_logo_width: 160 },
  gift_card: { initial_value: 6000000, code: 'A1B23C4D5E6F7G8H', url: 'https://example.test/gift-card/sample', expires_on: null, pass_url: null, recipient: null, customer: null, message: null },
});
export function renderNotification(name, context = notificationContext()) {
  const source = readFileSync(new URL(`../../notifications/es/${name}.liquid`, import.meta.url), 'utf8');
  return engine.parseAndRenderSync(source, context);
}
