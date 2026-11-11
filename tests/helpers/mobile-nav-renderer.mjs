import { readFileSync } from 'node:fs';
import { createComponentEngine } from './component-library-renderer.mjs';

const raw = readFileSync('sections/header-group.json', 'utf8');
const header = JSON.parse(raw.slice(raw.indexOf('{'))).sections.header;
const blocks = header.block_order.map(id => ({ id, ...header.blocks[id], settings: { ...header.blocks[id].settings } })).filter(block => !block.disabled);
for (const block of blocks) {
  if (block.id === process.argv[2]) block.settings.show_in_mobile_menu = true;
  // Shopify resolves collection setting handles to collection objects.
  if (block.settings.catalog_collection) block.settings.catalog_collection = { products_count: 1, all_tags: ['mujer', 'hombre', 'mas-vendidos', 'nueva-coleccion'] };
}
const engine = createComponentEngine();
const navigation = engine.renderFileSync('lemoon-mobile-nav', {
  section: { id: 'fixture-header', settings: { ...header.settings, ...(process.argv[3] ? { mobile_search_show_wishlist: process.argv[3] === 'on' } : {}) }, blocks }, request: { page_type: 'product' },
  shop: { customer_accounts_enabled: process.argv[4] !== 'disabled' }, customer: process.argv[4] === 'signed-in' ? { id: 123 } : null, routes: { account_login_url: '/account/login', account_register_url: '/account/register', account_url: '/account', account_profile_url: '/account' },
});
const shell = readFileSync('tests/fixtures/mobile-menu.html', 'utf8');
const html = shell.replace('</head>', '<link rel="stylesheet" href="/assets/lemoon-components.css"></head>').replace(/<div class="lemoon-mobile-nav__overlay"[\s\S]*?(?=<main>)/, navigation);
if (html === shell) throw new Error('Could not replace static drawer fixture');
process.stdout.write(html);
