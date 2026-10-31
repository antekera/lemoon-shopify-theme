'use strict';
const fs = require('node:fs');
const path = require('node:path');
const {hash} = require('./core.cjs');
const fixtureDir = path.join(__dirname, 'fixtures');
const manifest = JSON.parse(fs.readFileSync(path.join(fixtureDir, 'manifest.json')));
function mismatch(field, expected, actual, product) {
  const error = Error(`Synthetic fixture mismatch: ${field}`);
  error.diagnostic = {field, ...(product ? {product} : {}), expected, actual:actual === undefined ? null : actual};
  throw error;
}
function equal(field, expected, actual, product) {
  if (JSON.stringify(expected) !== JSON.stringify(actual)) mismatch(field,expected,actual,product);
}
function verifyFixture(data, c) {
  const m = manifest, col = data.collectionByHandle;
  equal('config.product',m.products[0].handle,c.product);
  equal('config.collection',m.collection.handle,c.collection);
  if (!col) mismatch('collection','present',null);
  for (const key of ['handle','title','sortOrder']) equal(`collection.${key}`,m.collection[key],col[key]);
  equal('products.count',m.products.length,data.products.nodes.length);
  equal('collection.productHandles',[...m.collection.productHandles].sort(),col.products.nodes.map(n => n.handle).sort());
  const images = [];
  for (const expected of m.products) {
    const handle = expected.handle, p = data.products.nodes.find(p => p.handle === handle);
    if (!p) mismatch('product','present',null,handle);
    for (const key of ['title','vendor','productType']) equal(`product.${key}`,expected[key],p[key],handle);
    equal('product.status','ACTIVE',p.status,handle);
    equal('product.tags',expected.tags,[...p.tags].sort(),handle);
    if (!p.onlineStoreUrl) mismatch('product.onlineStoreUrl','published Online Store URL',p.onlineStoreUrl,handle);
    for (const [key, value] of Object.entries(expected.metafields)) {
      const actual = key === 'custom.lens_compatible' ? p.lens : p.fixture;
      if (!actual) mismatch(key,value,null,handle);
      for (const part of ['type','value']) equal(`${key}.${part}`,value[part],actual[part],handle);
    }
    const options = p.options.map(o => ({name:o.name,values:o.values}));
    equal('product.options',expected.options,options,handle);
    for (const [index,v] of p.variants.nodes.entries()) {
      const actual = {inventoryPolicy:v.inventoryPolicy,tracked:v.inventoryItem?.tracked,requiresShipping:v.inventoryItem?.requiresShipping,taxable:v.taxable,compareAtPrice:v.compareAtPrice};
      for (const [key,value] of Object.entries({inventoryPolicy:'CONTINUE',tracked:false,requiresShipping:true,taxable:false,compareAtPrice:null})) equal(`variants[${index}].${key}`,value,actual[key],handle);
    }
    const variants = p.variants.nodes.map(v => ({title:v.title,price:String(Number(v.price)),sku:v.sku})).sort((a,b) => a.sku.localeCompare(b.sku));
    equal('product.variants',expected.variants.map(v => ({...v,price:String(Number(v.price))})).sort((a,b) => a.sku.localeCompare(b.sku)),variants,handle);
    equal('images.count',1,p.images.nodes.length,handle);
    const image = p.images.nodes[0];
    for (const [key,value] of Object.entries({width:expected.image.width,height:expected.image.height,altText:expected.image.alt})) equal(`image.${key}`,value,image[key],handle);
    equal('localImage.sha256',expected.image.sha256,hash(fs.readFileSync(path.join(fixtureDir,expected.image.file))),handle);
    images.push({url:image.url,pixelSha256:expected.image.pixelSha256,width:expected.image.width,height:expected.image.height});
  }
  equal('localSettings.sha256',m.settingsSha256,hash(fs.readFileSync(path.join(fixtureDir,'settings.json'))));
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
  for (const [key,value] of Object.entries({id:`gid://shopify/Shop/${manifest.shopId}`,myshopifyDomain:c.store,currencyCode:'CLP'})) equal(`shop.${key}`,value,data.shop[key]);
  for (const image of verifyFixture(data,c)) {
    const url = new URL(image.url);
    if (url.protocol !== 'https:' || url.hostname !== 'cdn.shopify.com') mismatch('image.origin','https://cdn.shopify.com',url.origin);
    url.search = '';
    const response = await fetchImage(url, {signal:AbortSignal.timeout(60000),redirect:'error'});
    if (!response.ok) mismatch('image.httpStatus',200,response.status);
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
