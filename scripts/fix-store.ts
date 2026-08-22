#!/usr/bin/env bun
/**
 * fix-store.ts
 * - Tags products for automated collections (pantallas, lectura, niños)
 * - Adds products to the Accesorios manual collection
 * - Enables inventory tracking and sets stock quantities
 *
 * Prerequisites:
 *   shopify store auth \
 *     --store=lemoon-8277.myshopify.com \
 *     --scopes=read_products,write_products,read_inventory,write_inventory,read_collections,write_collections
 *
 * Usage:
 *   bun run scripts/fix-store.ts
 */

import { $ } from 'bun';

const STORE = 'lemoon-8277.myshopify.com';
const API_VERSION = '2025-04';
const COLLECTION_ACCESORIOS_GID = 'gid://shopify/Collection/349510172840';
const LOCATION_GID = 'gid://shopify/Location/85337833640';

async function shopify(query: string, variables?: Record<string, unknown>): Promise<Record<string, unknown>> {
  const args = [
    'store',
    'execute',
    `--store=${STORE}`,
    `--version=${API_VERSION}`,
    '--allow-mutations',
    '--json',
    '--query',
    query,
  ];
  if (variables) {
    args.push('--variables', JSON.stringify(variables));
  }

  const result = await $`shopify ${args}`.quiet();
  const text = result.stdout.toString();
  const json = JSON.parse(text) as { data?: Record<string, unknown>; errors?: { message: string }[] };
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join(', '));
  return json.data ?? {};
}

async function fetchProducts() {
  const data = await shopify(`{
    products(first: 50) {
      nodes {
        id
        title
        tags
        variants(first: 50) {
          nodes {
            inventoryItem { id }
          }
        }
      }
    }
  }`);
  type Product = {
    id: string;
    title: string;
    tags: string[];
    variants: { nodes: { inventoryItem: { id: string } }[] };
  };
  return (data.products as { nodes: Product[] }).nodes;
}

async function addTags(productId: string, tags: string[]) {
  const data = await shopify(
    `mutation($id: ID!, $tags: [String!]!) {
      tagsAdd(id: $id, tags: $tags) {
        node { id }
        userErrors { message }
      }
    }`,
    { id: productId, tags },
  );
  const errors = (data.tagsAdd as { userErrors: { message: string }[] }).userErrors;
  if (errors.length > 0) throw new Error(errors.map((e) => e.message).join(', '));
}

async function addToCollection(productIds: string[]) {
  const data = await shopify(
    `mutation($id: ID!, $productIds: [ID!]!) {
      collectionAddProducts(id: $id, productIds: $productIds) {
        collection { title productsCount { count } }
        userErrors { message }
      }
    }`,
    { id: COLLECTION_ACCESORIOS_GID, productIds },
  );
  return (data.collectionAddProducts as { collection: { title: string; productsCount: { count: number } } }).collection;
}

async function enableTracking(inventoryItemId: string) {
  const data = await shopify(
    `mutation($id: ID!, $input: InventoryItemInput!) {
      inventoryItemUpdate(id: $id, input: $input) {
        inventoryItem { id tracked }
        userErrors { message }
      }
    }`,
    { id: inventoryItemId, input: { tracked: true } },
  );
  const errors = (data.inventoryItemUpdate as { userErrors: { message: string }[] }).userErrors;
  if (errors.length > 0) throw new Error(errors.map((e) => e.message).join(', '));
}

async function setInventory(setQuantities: { inventoryItemId: string; locationId: string; quantity: number }[]) {
  const data = await shopify(
    `mutation($input: InventorySetOnHandQuantitiesInput!) {
      inventorySetOnHandQuantities(input: $input) {
        inventoryAdjustmentGroup { id }
        userErrors { message }
      }
    }`,
    { input: { reason: 'correction', setQuantities } },
  );
  const errors = (data.inventorySetOnHandQuantities as { userErrors: { message: string }[] }).userErrors;
  if (errors.length > 0) throw new Error(errors.map((e) => e.message).join(', '));
}

function sleep(ms: number) {
  return Bun.sleep(ms);
}

async function main() {
  console.log('Lemoon Store Fixer');
  console.log(`Store: ${STORE}\n`);

  // Fetch products
  process.stdout.write('Obteniendo productos... ');
  let products: Awaited<ReturnType<typeof fetchProducts>>;
  try {
    products = await fetchProducts();
  } catch (err) {
    console.error('\nError: no se puede conectar. ¿Corriste shopify store auth?');
    console.error(
      `  shopify store auth --store=${STORE} --scopes=read_products,write_products,read_inventory,write_inventory,read_collections,write_collections`,
    );
    process.exit(1);
  }
  console.log(`${products.length} productos encontrados`);

  // Tag products for automated collections
  const tagGroups: [typeof products, string][] = [
    [products.slice(0, 6), 'pantallas'],
    [products.slice(6, 12), 'lectura'],
    [products.slice(12, 17), 'niños'],
  ];

  console.log('\n── Tags para colecciones automatizadas ──');
  for (const [group, tag] of tagGroups) {
    for (const p of group) {
      if (p.tags.includes(tag)) {
        console.log(`  · [${tag}] ${p.title} (ya tiene tag)`);
        continue;
      }
      process.stdout.write(`  + [${tag}] ${p.title}... `);
      await addTags(p.id, [tag]);
      console.log('ok');
      await sleep(250);
    }
  }

  // Add first 8 products to Accesorios (manual collection)
  console.log('\n── Colección Accesorios ──');
  process.stdout.write(`  Agregando ${products.slice(0, 8).length} productos... `);
  try {
    const col = await addToCollection(products.slice(0, 8).map((p) => p.id));
    console.log(`ok (${col.productsCount.count} total)`);
  } catch (err) {
    console.error(`FAILED: ${(err as Error).message}`);
  }

  // Enable inventory tracking for all products, then batch-set quantities
  console.log('\n── Inventario ──');
  const setQuantities: { inventoryItemId: string; locationId: string; quantity: number }[] = [];

  for (const p of products) {
    const invId = p.variants.nodes[0]?.inventoryItem?.id;
    if (!invId) continue;
    process.stdout.write(`  activando tracking: ${p.title}... `);
    await enableTracking(invId);
    console.log('ok');
    setQuantities.push({
      inventoryItemId: invId,
      locationId: LOCATION_GID,
      quantity: 8 + Math.floor(Math.random() * 13),
    });
    await sleep(200);
  }

  // Batch set quantities (up to 100 per call)
  console.log(`\n  Asignando cantidades para ${setQuantities.length} productos en un batch...`);
  await setInventory(setQuantities);
  console.log('  ok');

  console.log('\nListo. Las colecciones pueden tardar ~30 seg en actualizarse.');
}

main().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
