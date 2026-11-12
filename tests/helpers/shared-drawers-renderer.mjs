import { readFileSync } from 'node:fs';
import { createComponentEngine } from './component-library-renderer.mjs';
import { themeFontLinks } from './theme-fonts.mjs';
const read = path => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const styles = files => files.map(file => `<link rel="stylesheet" href="/assets/${file}">`).join('');
const scripts = (files, defer = false) => files.map(file => `<script src="/assets/${file}"${defer ? ' defer' : ''}></script>`).join('');
const baseFiles = ['lemoon-tokens.css', 'base.css', 'lemoon-components.css', 'component-lemoon-drawer.css'];
const globals = { settings: { cart_color_scheme: 'scheme-1', show_cart_note: false, predictive_search_enabled: false } };
const context = { settings: globals.settings, routes: { root_url: '/', cart_url: '/cart', all_products_collection_url: '/collections/all', account_login_url: '/account/login', account_register_url: '/account/register', search_url: '/search' }, shop: { name: 'Lemoon · fixture', customer_accounts_enabled: false, shipping_policy: { body: '', url: '/policies/shipping' } }, request: { page_type: 'product', path: '/tests/fixtures/shared-drawers.html' } };
function engine() {
  const liquid = createComponentEngine({ globals });
  // Deterministic display adapters only. No cart mutation or commerce events are exercised.
  for (const filter of ['money', 'money_with_currency', 'money_without_currency']) liquid.registerFilter(filter, value => `${Number(value || 0)} CLP`);
  liquid.registerFilter('standard_event_data', () => '{}');
  liquid.registerFilter('item_count_for_variant', (cart, id) => (cart.items || []).filter(item => item.variant.id === id).reduce((count, item) => count + item.quantity, 0));
  liquid.registerFilter('placeholder_svg_tag', () => '<svg aria-hidden="true" width="1" height="1"></svg>');
  liquid.registerFilter('metafield_tag', () => '');
  liquid.registerFilter('format_address', address => `<p>${address.address1}, ${address.city}</p>`);
  return liquid;
}
function shell(kind, body, ownerStyles = [], ownerScripts = [], setup = '') {
  return `<!doctype html><html class="js" lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Shared drawers · local fixture</title>${themeFontLinks}${styles(baseFiles)}${styles(ownerStyles)}<style>:root{--font-body-family:var(--lemoon-font-body);--font-heading-family:var(--lemoon-font-heading);--font-body-scale:1;--font-heading-scale:1;--font-body-weight:400;--font-heading-weight:600;--color-background:255,255,255;--color-foreground:11,31,58;--color-shadow:11,31,58;--color-button:11,31,58;--color-button-text:255,255,255;--duration-default:300ms;--duration-short:150ms;--duration-long:500ms;--drawer-border-width:0px;--drawer-border-opacity:0;--drawer-shadow-opacity:0}html{box-sizing:border-box;font-size:62.5%}*,*::before,*::after{box-sizing:inherit}body{margin:0;font-size:1.6rem}main{padding:24px;min-height:180vh}#UnderlayAction{position:fixed;top:0;left:0;width:100%;height:32px;z-index:0;padding:0}.fixture-notice{padding:40px 24px 0}.fixture-controls{display:flex;gap:16px;flex-wrap:wrap}.fixture-long-copy p{margin:16px 0}dialog.lemoon-drawer h2{padding-right:56px}.fixture-generic-close{position:sticky;top:0;float:right;min-width:44px;min-height:44px}</style></head><body data-drawer-fixture="${kind}"><button id="UnderlayAction" type="button">Control subyacente</button><p class="fixture-notice">Fixture local con contenido sintético. Solo apertura/cierre; sin compras ni datos Shopify.</p>${body}${scripts(['constants.js', 'pubsub.js', 'global.js'])}${setup}${scripts(ownerScripts, true)}<script>window.fixtureUnderlayClicks=0;document.getElementById('UnderlayAction').addEventListener('click',()=>window.fixtureUnderlayClicks++);document.addEventListener('submit',event=>event.preventDefault());</script></body></html>`;
}
function genericFixture() {
  const body = `<main><button id="OpenGeneric" type="button">Abrir drawer genérico</button><dialog class="lemoon-drawer" aria-labelledby="GenericTitle"><button class="fixture-generic-close" type="button" id="CloseGeneric" aria-label="Cerrar drawer genérico">×</button><h2 id="GenericTitle">Drawer genérico</h2><div class="fixture-long-copy">${Array.from({ length: 18 }, (_, index) => `<p>Contenido de referencia ${index + 1} para comprobar lectura, reflow y scroll interno.</p>`).join('')}</div><a href="#generic-end">Ayuda del drawer</a></dialog></main>`;
  const setup = `<script>const generic=document.querySelector('dialog.lemoon-drawer');const opener=document.getElementById('OpenGeneric');opener.addEventListener('click',()=>{generic.showModal();trapFocus(generic,document.getElementById('CloseGeneric'));});document.getElementById('CloseGeneric').addEventListener('click',()=>generic.close());generic.addEventListener('close',()=>removeTrapFocus(opener));</script>`;
  return shell('generic', body, [], [], setup);
}
function navFixture() {
  const liquid = engine();
  const blocks = [
    { type: 'drawer_primary', settings: { title: 'Lentes ópticos', link: '/collections/opticos', slot: 'opticos', has_submenu: true, icon: 'none' } },
    { type: 'drawer_primary', settings: { title: 'Catálogo', link: '/collections/all', slot: 'catalogue', has_submenu: false, icon: 'none' } },
    ...Array.from({ length: 12 }, (_, index) => ({ type: 'drawer_subitem', settings: { title: `Opción de referencia ${index + 1}`, link: `/collections/opticos?fixture=${index + 1}`, parent: 'opticos', group: 'featured', icon: 'none' } })),
    { type: 'drawer_utility', settings: { title: 'Ayuda', link: '/pages/contact', icon: 'none' } },
  ];
  const section = { id: 'shared-nav', blocks, settings: { utility_heading: 'Ayuda', view_all_label: 'Ver todo', shape_heading: 'Forma', color_heading: 'Color' } };
  // Render the actual header markup; Shopify's section javascript tag belongs to the native sticky-header runtime, outside this drawer fixture.
  const source = read('sections/header.liquid').split('{% javascript %}')[0];
  const body = liquid.parseAndRenderSync(source, { ...context, section, cart: { item_count: 0 } }) + '<main><button type="button">Control posterior</button></main>';
  return shell('nav', body, ['lemoon-header.css']);
}
function cartFixture(empty) {
  const liquid = engine();
  const items = Array.from({ length: 8 }, (_, index) => ({ index, id: index + 1, key: `fixture-${index}`, title: `Armazón de prueba ${index + 1}`, url: '#cart-item', image: null, quantity: 1, original_price: 10000, final_price: 10000, original_line_price: 10000, final_line_price: 10000, line_level_discount_allocations: [], options_with_values: [], properties: [], product: { title: `Armazón de prueba ${index + 1}`, has_only_default_variant: true }, variant: { id: index + 1, price: 10000, quantity_rule: { min: 1, increment: 1, max: null }, quantity_price_breaks: [] } }));
  const cart = Object.assign(empty ? [] : {}, { items: empty ? [] : items, item_count: empty ? 0 : items.length, total_price: empty ? 0 : 80000, cart_level_discount_applications: [], taxes_included: false, duties_included: false });
  const body = `<main><a id="cart-icon-bubble" href="/cart">Abrir carrito</a><button type="button">Control posterior</button></main>` + liquid.parseAndRenderSync(read('snippets/cart-drawer.liquid'), { ...context, cart });
  // Shopify StandardEvents is an external SDK. Its fixture adapter only supplies the inherited lifecycle; real CartItems and CartDrawer files remain unchanged.
  const setup = `<script>window.StandardEvents={createViewEventElement:(Base=HTMLElement)=>class extends Base{connectedCallback(){}dispatchViewEvent(){}}};window.routes={cart_url:'/cart',cart_change_url:'/cart/change',cart_update_url:'/cart/update'};window.cartStrings={};window.quickOrderListStrings={};</script>`;
  return shell(empty ? 'cart-empty' : 'cart', body, ['component-cart.css', 'component-cart-items.css', 'component-cart-drawer.css'], ['cart-drawer.js'], setup);
}
function facetsFixture(plp = false) {
  const liquid = engine();
  const hiddenParams = ['filter.v.m.custom.style_filter_presence', 'filter.v.m.custom.style_filter_use', 'filter.v.m.custom.style_filter_transparency', 'filter.v.m.custom.style_filter_pattern', 'filter.v.m.custom.style_filter_color', 'filter.p.product_type', 'filter.p.m.custom.prescription_type'];
  const filterParams = ['filter.p.m.custom.frame_shape', ...Array.from({ length: 6 }, (_, index) => `filter.p.m.custom.fixture_${index + 1}`), ...(plp ? hiddenParams : [])];
  const filters = filterParams.map((param_name, index) => {
    const values = ['Rectangular', 'Redondo', 'Ovalado'].map((label, value) => ({ label: `${label} ${index + 1}`, value: label.toLowerCase(), param_name, active: value === 0 && index === 0, count: 5, url_to_remove: '/collections/all', url_to_add: '/collections/all' }));
    return { type: 'list', label: index ? `Filtro de referencia ${index + 1}` : 'Forma', param_name, operator: 'OR', values, active_values: values.filter(value => value.active), url_to_remove: '/collections/all' };
  });
  const results = { id: 1, handle: 'fixture', url: '/collections/all', filters, products_count: 10, all_products_count: 10, sort_by: 'manual', sort_options: [{ value: 'manual', name: 'Destacados' }, { value: 'title-ascending', name: 'Nombre' }] };
  const content = liquid.renderFileSync('facets', { ...context, results, enable_filtering: true, enable_sorting: false, filter_type: 'drawer', lemoon_plp: true, section: { id: 'shared-facets' }, template: { name: 'collection' } });
  // MenuDrawer drives this fixture. Facets AJAX/search is intentionally outside the open/close and preserved FormData coverage.
  return shell(plp ? 'facets-plp' : 'facets', `<main${plp ? ' class="lemoon-plp"' : ''}>${content}</main>`, ['component-facets.css', 'lemoon-collection-plp.css'], plp ? ['facets.js'] : []);
}
function pickupFixture() {
  const liquid = engine();
  const source = read('sections/pickup-availability.liquid').match(/<pickup-availability-drawer\b[\s\S]*?<\/pickup-availability-drawer>/)[0];
  const locations = Array.from({ length: 8 }, (_, index) => ({ available: true, pick_up_time: 'Horario de prueba', location: { name: `Punto de prueba ${index + 1}`, address: { address1: `Dirección de prueba ${index + 1}`, city: 'Ciudad de prueba', phone: '' } } }));
  const drawer = liquid.parseAndRenderSync(source, { product_variant: { product: { title: 'Retiro · fixture', has_only_default_variant: true } }, pick_up_availabilities: locations });
  const body = `<main><button id="ShowPickupAvailabilityDrawer" type="button">Abrir retiro</button></main>${drawer}`;
  return shell('pickup', body, ['component-pickup-availability.css'], ['pickup-availability.js'], '<script>document.getElementById("ShowPickupAvailabilityDrawer").addEventListener("click",event=>document.querySelector("pickup-availability-drawer").show(event.currentTarget));</script>');
}
export function renderSharedDrawerFixture(kind = 'generic') {
  if (kind === 'generic') return genericFixture();
  if (kind === 'nav') return navFixture();
  if (kind === 'cart' || kind === 'cart-empty') return cartFixture(kind === 'cart-empty');
  if (kind === 'facets') return facetsFixture();
  if (kind === 'facets-plp') return facetsFixture(true);
  if (kind === 'pickup') return pickupFixture();
  throw new Error(`Unknown shared drawer kind: ${kind}`);
}
