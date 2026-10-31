'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

function config(env) {
  const mode = env.AUDIT_MODE || 'lab';
  if (!['lab', 'commercial'].includes(mode)) throw Error('Invalid audit mode');
  const prefix = mode === 'lab' ? 'LIGHTHOUSE_' : 'SHOPIFY_';
  const required = ['STORE', 'PRODUCT_HANDLE', 'COLLECTION_HANDLE'];
  if (mode === 'lab') required.push('CLIENT_ID', 'CLIENT_SECRET', 'STORE_PASSWORD');
  else required.push('STOREFRONT_ORIGIN');

  for (const key of required) if (!env[prefix + key]) throw Error(`Missing ${prefix + key}; no fallback is permitted`);
  const store = env[prefix + 'STORE'];
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(store)) throw Error('Store must be a bare myshopify.com domain');
  if (mode === 'lab' && ['lemoon-8277.myshopify.com', 'pzsrt4-1u.myshopify.com', env.SHOPIFY_STORE].includes(store)) {
    throw Error('The Lighthouse lab must be separate from the commercial store');
  }
  for (const key of ['PRODUCT_HANDLE', 'COLLECTION_HANDLE']) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(env[prefix + key])) throw Error(`Invalid ${prefix + key}`);
  }
  const origin = mode === 'commercial' ? env.SHOPIFY_STOREFRONT_ORIGIN : `https://${store}`;
  if (mode === 'commercial' && origin !== 'https://lemoon.cl') throw Error('Invalid SHOPIFY_STOREFRONT_ORIGIN; expected exact trusted HTTPS origin https://lemoon.cl');
  return {mode, store, origin, product: env[prefix + 'PRODUCT_HANDLE'],
    collection: env[prefix + 'COLLECTION_HANDLE'], password: env[prefix + 'STORE_PASSWORD'] || '',
    clientId: env[prefix + 'CLIENT_ID'], clientSecret: env[prefix + 'CLIENT_SECRET'],
    token: env[prefix + 'ACCESS_TOKEN']};
}
function routes(c, id) {
  if (c.mode === 'commercial') return ['/', `/products/${c.product}`, `/collections/${c.collection}`].map(p => `${c.origin}${p}`);
  if (!/^\d+$/.test(String(id))) throw Error('Invalid temporary theme ID');
  return ['/', `/products/${c.product}`, `/collections/${c.collection}`].map(p =>
    `${c.origin}${p}?preview_theme_id=${id}&_fd=0&pb=0`);
}
function collectionConfig(c, id, chrome, authScript = './auth.cjs') {
  return {ci: {collect: {url: routes(c, id), numberOfRuns: 3,
    puppeteerScript: authScript, chromePath: chrome,
    puppeteerLaunchOptions: {executablePath: chrome, args: ['--no-sandbox', '--disable-dev-shm-usage']},
    settings: {chromeFlags: '--no-sandbox --disable-dev-shm-usage', disableStorageReset: true,
      configPath: path.join(__dirname, 'lighthouse.config.cjs'),
      onlyCategories: ['performance', 'accessibility', 'readiness']}},
  assert: {includePassedAssertions: true, assertions: {
    'categories:performance': ['error', {minScore: 0.6, aggregationMethod: 'median-run'}],
    'categories:accessibility': ['error', {minScore: 0.8, aggregationMethod: 'median-run'}]
  }}}};
}
function ownedThemes(themes, state) {
  if (!/^lemoon-lhci-[a-f0-9-]{36}$/.test(state.name)) throw Error('Invalid cleanup ownership record');
  if (state.id && themes.some(t => String(t.id) === String(state.id) && t.name !== state.name)) throw Error('Cleanup target renamed; refusing deletion');
  const matches = themes.filter(t => t.name === state.name);
  if (matches.length > 1) throw Error('Ambiguous cleanup ownership; refusing deletion');
  for (const t of matches) {
    if (!/^\d+$/.test(String(t.id)) || t.role !== 'unpublished' || (state.id && String(t.id) !== String(state.id))) {
      throw Error('Cleanup target identity/role changed; refusing deletion');
    }
  }
  return matches;
}
function rejectSymlinks(root) {
  const stat = fs.lstatSync(root);
  if (stat.isSymbolicLink()) throw Error('Symlinks are not allowed in the theme payload');
  if (stat.isDirectory()) for (const name of fs.readdirSync(root)) rejectSymlinks(path.join(root,name));
}
function stageTheme(source, target, fixture) {
  // Only Shopify theme directories. Never copy .git, scripts, dependencies or credentials.
  for (const dir of ['assets','blocks','config','layout','listings','locales','sections','snippets','templates']) {
    if (fs.existsSync(path.join(source, dir))) rejectSymlinks(path.join(source, dir));
    if (fs.existsSync(path.join(source, dir))) fs.cpSync(path.join(source, dir), path.join(target, dir), {recursive: true, filter: p => path.basename(p) !== 'settings_data.json'});
  }
  fs.mkdirSync(path.join(target, 'config'), {recursive: true});
  fs.copyFileSync(fixture, path.join(target, 'config/settings_data.json'));
  const homeFile = path.join(target, 'templates/index.json');
  const home = JSON.parse(fs.readFileSync(homeFile));
  // Preserve the real hero, all sections, counts and enabled state; map catalog only.
  for (const section of Object.values(home.sections)) {
    if (section.settings && Object.hasOwn(section.settings, 'collection')) section.settings.collection = 'lighthouse-frames';
  }
  fs.writeFileSync(homeFile, JSON.stringify(home, null, 2));
}
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
module.exports = {config, routes, collectionConfig, ownedThemes, stageTheme, rejectSymlinks, hash};
