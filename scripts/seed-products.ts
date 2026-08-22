#!/usr/bin/env bun
/**
 * seed-products.ts
 * Creates 30 test products in the Lemoon Shopify store with random metafield values.
 *
 * Usage (with permanent app token):
 *   SHOPIFY_TOKEN=shpat_xxx bun run scripts/seed-products.ts
 *
 * Usage (with Shopify CLI identity token):
 *   SHOPIFY_TOKEN=$(cat ...) bun run scripts/seed-products.ts --use-bearer
 */

const STORE = 'lemoon-8277.myshopify.com';
const API_VERSION = '2025-04';
const API_URL = `https://${STORE}/admin/api/${API_VERSION}/graphql.json`;

// Exact values accepted by Shopify metafield definitions (lowercase, as configured in admin)
const FRAME_SHAPES = [
  'redondo',
  'cuadrado',
  'rectangular',
  'aviador',
  'geométrico',
  'ovalado',
  'browline',
  'pantóstico',
  'ojo de gato',
];
const FRAME_MATERIALS = ['acetato', 'metal', 'titanio', 'TR-90', 'madera', 'mixto'];
const FRAME_SIZES = ['pequeño (49-16-142)', 'mediano (54-17-145)', 'grande (58-18-145)'];
const FRAME_WIDTHS = ['estrecho', 'estándar', 'ancho'];
const FACE_SHAPES = ['ovalado', 'redondo', 'cuadrado', 'corazón', 'triángulo', 'diamante'];

const MODEL_NAMES = [
  'Artico',
  'Bora',
  'Cairo',
  'Dorado',
  'Estero',
  'Faro',
  'Genova',
  'Hana',
  'Inca',
  'Jade',
  'Kali',
  'Lima',
  'Maipo',
  'Nilo',
  'Oslo',
  'Pamir',
  'Quebec',
  'Rima',
  'Sahara',
  'Toba',
  'Uyuni',
  'Vela',
  'Wabi',
  'Xara',
  'Yuma',
  'Zara',
  'Arica',
  'Biobio',
  'Colca',
  'Dama',
];

const DESCRIPTIONS = [
  (shape: string, material: string) =>
    `<p>Armazón de diseño ${shape} fabricado en ${material} de alta calidad. Combina estilo contemporáneo con comodidad para el uso diario.</p>`,
  (shape: string, material: string) =>
    `<p>Modelo ${shape} en ${material} premium. Estructura liviana y resistente, ideal para quienes buscan elegancia sin sacrificar comodidad.</p>`,
  (shape: string, material: string) =>
    `<p>Armazón ${shape} con acabados premium en ${material}. Diseño moderno que se adapta a distintos estilos de vida.</p>`,
  (shape: string, material: string) =>
    `<p>Colección Lemoon — armazón ${shape} en ${material} de primera calidad. Ajuste perfecto y máxima durabilidad para uso prolongado.</p>`,
];

const PRICES_CLP = [29900, 39900, 49900, 59900, 69900, 79900, 89900, 99900, 119900, 139900];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function api(token: string, useBearer: boolean, query: string, variables?: Record<string, unknown>) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(useBearer ? { Authorization: `Bearer ${token}` } : { 'X-Shopify-Access-Token': token }),
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { data?: unknown; errors?: { message: string }[] };
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join(', '));
  return json.data;
}

async function fetchLensTypeGids(token: string, useBearer: boolean): Promise<string[]> {
  const data = (await api(
    token,
    useBearer,
    `{
    metaobjects(type: "tipo_de_lente", first: 30) {
      nodes { id }
    }
  }`,
  )) as { metaobjects: { nodes: { id: string }[] } };
  return data.metaobjects.nodes.map((n) => n.id);
}

const CREATE_PRODUCT = `
  mutation productCreate($product: ProductCreateInput!) {
    productCreate(product: $product) {
      product { id title handle }
      userErrors { field message }
    }
  }
`;

function buildProductInput(modelName: string, lensGids: string[]) {
  const shape = pick(FRAME_SHAPES);
  const material = pick(FRAME_MATERIALS);
  const size = pick(FRAME_SIZES);
  const width = pick(FRAME_WIDTHS);
  const faceShape = pick(FACE_SHAPES);
  const price = pick(PRICES_CLP);
  const hasDiscount = Math.random() > 0.55;
  const compareAtPrice = hasDiscount ? Math.round(price * (1.15 + Math.random() * 0.2)) : undefined;

  // Pick 1–3 random lens types if GIDs are available
  const selectedLensGids =
    lensGids.length > 0
      ? [...lensGids].sort(() => Math.random() - 0.5).slice(0, 1 + Math.floor(Math.random() * 3))
      : [];

  const metafields = [
    { namespace: 'custom', key: 'frame_shape', value: shape, type: 'single_line_text_field' },
    { namespace: 'custom', key: 'frame_material', value: material, type: 'single_line_text_field' },
    { namespace: 'custom', key: 'frame_size', value: size, type: 'single_line_text_field' },
    { namespace: 'custom', key: 'frame_width', value: width, type: 'single_line_text_field' },
    { namespace: 'custom', key: 'face_shapes_compatible', value: faceShape, type: 'single_line_text_field' },
    ...(selectedLensGids.length > 0
      ? [
          {
            namespace: 'custom',
            key: 'lens_compatible',
            value: JSON.stringify(selectedLensGids),
            type: 'list.metaobject_reference',
          },
        ]
      : []),
  ];

  return {
    title: `Lemoon ${modelName}`,
    descriptionHtml: pick(DESCRIPTIONS)(shape, material),
    productType: 'Armazón óptico',
    vendor: 'Lemoon',
    status: 'ACTIVE',
    tags: [shape, material, faceShape, 'óptico', 'armazón'],
    metafields,
    variants: [
      {
        price: price.toFixed(2),
        ...(compareAtPrice ? { compareAtPrice: compareAtPrice.toFixed(2) } : {}),
      },
    ],
  };
}

async function main() {
  const useBearer = process.argv.includes('--use-bearer');
  const token = process.env.SHOPIFY_TOKEN ?? '';

  if (!token) {
    console.error('Error: SHOPIFY_TOKEN env var is required');
    process.exit(1);
  }

  console.log('Lemoon Product Seeder');
  console.log(`Store: ${STORE}`);
  console.log(`Auth: ${useBearer ? 'Bearer (CLI identity token)' : 'X-Shopify-Access-Token'}\n`);

  // Try to fetch lens type GIDs (requires read_metaobjects scope)
  let lensGids: string[] = [];
  process.stdout.write('Fetching lens type metaobjects... ');
  try {
    lensGids = await fetchLensTypeGids(token, useBearer);
    console.log(`found ${lensGids.length}`);
  } catch {
    console.log('skipped (insufficient scope — lens_compatible will be omitted)');
  }

  let created = 0;
  let failed = 0;

  for (let i = 0; i < MODEL_NAMES.length; i++) {
    const modelName = MODEL_NAMES[i];
    const product = buildProductInput(modelName, lensGids);

    try {
      const result = (await api(token, useBearer, CREATE_PRODUCT, { product })) as {
        productCreate: {
          product: { id: string; title: string; handle: string } | null;
          userErrors: { field: string[]; message: string }[];
        };
      };

      const { product: p, userErrors } = result.productCreate;

      if (userErrors.length > 0) {
        const msg = userErrors.map((e) => `${e.field.join('.')}: ${e.message}`).join(' | ');
        console.error(`  x [${i + 1}/30] Lemoon ${modelName}: ${msg}`);
        failed++;
      } else if (p) {
        console.log(`  + [${i + 1}/30] ${p.title} (${p.handle})`);
        created++;
      }
    } catch (err) {
      console.error(`  x [${i + 1}/30] Lemoon ${modelName}: ${(err as Error).message}`);
      failed++;
    }

    if (i < MODEL_NAMES.length - 1) await Bun.sleep(250);
  }

  console.log(`\nDone: ${created} created, ${failed} failed`);
}

main().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
