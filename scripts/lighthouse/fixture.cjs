'use strict';
const fs = require('node:fs');
const path = require('node:path');
const {hash} = require('./core.cjs');
const fixtureDir = path.join(__dirname, 'fixtures');
const manifest = JSON.parse(fs.readFileSync(path.join(fixtureDir, 'manifest.json')));
function verifyFixture(data, c) {
  const m = manifest, col = data.collectionByHandle;
  if (c.product !== m.products[0].handle || c.collection !== m.collection.handle ||
      !col || col.handle !== m.collection.handle || col.title !== m.collection.title || col.sortOrder !== m.collection.sortOrder ||
      data.products.nodes.length !== m.products.length ||
      JSON.stringify(col.products.nodes.map(n => n.handle).sort()) !== JSON.stringify([...m.collection.productHandles].sort())) throw Error('Synthetic catalog fixture mismatch');
  const images = [];
  for (const expected of m.products) {
    const p = data.products.nodes.find(p => p.handle === expected.handle);
    if (!p || p.title !== expected.title || p.status !== 'ACTIVE' || p.vendor !== expected.vendor || p.productType !== expected.productType || JSON.stringify([...p.tags].sort()) !== JSON.stringify(expected.tags) || !p.onlineStoreUrl) throw Error('Synthetic product fixture mismatch');
    for (const [key, value] of Object.entries(expected.metafields)) {
      const actual = key === 'custom.lens_compatible' ? p.lens : p.fixture;
      if (!actual || actual.type !== value.type || actual.value !== value.value) throw Error('Synthetic metafield fixture mismatch');
    }
    const options = p.options.map(o => ({name:o.name,values:o.values}));
    if (JSON.stringify(options) !== JSON.stringify(expected.options)) throw Error('Synthetic options fixture mismatch');
    if (p.variants.nodes.some(v => v.inventoryPolicy !== 'CONTINUE' || v.inventoryItem?.tracked !== false || v.inventoryItem?.requiresShipping !== true || v.taxable !== false || v.compareAtPrice !== null)) throw Error('Synthetic inventory/availability contract mismatch');
    const variants = p.variants.nodes.map(v => ({title:v.title,price:String(Number(v.price)),sku:v.sku})).sort((a,b) => a.sku.localeCompare(b.sku));
    if (JSON.stringify(variants) !== JSON.stringify(expected.variants.map(v => ({...v,price:String(Number(v.price))})).sort((a,b) => a.sku.localeCompare(b.sku)))) throw Error('Synthetic variant fixture mismatch');
    if (p.images.nodes.length !== 1) throw Error('Synthetic image fixture count mismatch');
    const image = p.images.nodes[0];
    if (image.width !== expected.image.width || image.height !== expected.image.height || image.altText !== expected.image.alt) throw Error('Synthetic image metadata mismatch');
    if (hash(fs.readFileSync(path.join(fixtureDir,expected.image.file))) !== expected.image.sha256) throw Error('Local image checksum mismatch');
    images.push({url:image.url,pixelSha256:expected.image.pixelSha256,width:expected.image.width,height:expected.image.height});
  }
  if (hash(fs.readFileSync(path.join(fixtureDir,'settings.json'))) !== m.settingsSha256) throw Error('Local settings checksum mismatch');
  return images;
}
async function verifyRemoteFixture(c, graphql, fetchImage = fetch) {
  const data = await graphql(`query Fixture($collection: String!) {
    shop { id myshopifyDomain currencyCode }
    products(first: 13) { nodes { handle title status vendor productType tags onlineStoreUrl options { name values }
      lens: metafield(namespace: "custom", key: "lens_compatible") { type value }
      fixture: metafield(namespace: "custom", key: "lighthouse_fixture") { type value }
      variants(first: 3) { nodes { title price sku compareAtPrice taxable inventoryPolicy inventoryItem { tracked requiresShipping } } }
      images(first: 2) { nodes { url width height altText } }
    } }
    collectionByHandle(handle: $collection) { handle title sortOrder products(first: 13) { nodes { handle } } }
  }`, {collection:c.collection});
  if (data.shop.id !== `gid://shopify/Shop/${manifest.shopId}` || data.shop.myshopifyDomain !== c.store || data.shop.currencyCode !== 'CLP') throw Error('Lab shop identity/currency mismatch');
  for (const image of verifyFixture(data,c)) {
    const url = new URL(image.url);
    if (url.protocol !== 'https:' || url.hostname !== 'cdn.shopify.com') throw Error('Unexpected fixture image origin');
    url.search = '';
    const response = await fetchImage(url, {signal:AbortSignal.timeout(60000),redirect:'error'});
    if (!response.ok) throw Error('Synthetic image fetch failed');
    verifyImage(Buffer.from(await response.arrayBuffer()),image);
  }
}
function verifyImage(bytes, expected) {
  // Shopify may insert metadata/recompress PNGs. Decode with the locked decoder and
  // compare exact RGBA pixels; never enroll an unknown CDN hash during a gate run.
  const {PNG} = require('pngjs');
  if (bytes.length < 24 || bytes.length > 5*1024*1024 || bytes.readUInt32BE(16) !== expected.width || bytes.readUInt32BE(20) !== expected.height) throw Error('Synthetic image dimensions/size mismatch');
  const decoded = PNG.sync.read(bytes,{checkCRC:true});
  if (decoded.width !== expected.width || decoded.height !== expected.height || hash(decoded.data) !== expected.pixelSha256) throw Error('Synthetic image pixels mismatch');
}
module.exports = {manifest, verifyFixture, verifyRemoteFixture, verifyImage, fixtureDir};
