# Datos disponibles para el modal de medidas

Consulta de solo lectura: 07-11-2026, tienda conectada `pzsrt4-1u.myshopify.com` (Lemoon). Se recorrieron las dos páginas de productos: **60 registros** (58 ACTIVE, 1 UNLISTED, 1 DRAFT). Se completaron las paginaciones de definiciones PRODUCT, PRODUCTVARIANT, metaobject definitions y entradas de los tipos relevantes. No se modificaron datos, definiciones ni temas.

## Conclusión para el diseño

Las medidas físicas proceden de **metafields del producto**, no de un metaobject de tallas. El esquema ya admite las cinco medidas del diagrama, pero solo Dalton Prototipo tiene valores numéricos cargados. Los recursos didácticos compartidos (código de patilla, regla, explicación) no necesitan inventar datos por producto ni convertir el diccionario del quiz en una guía de calce.

## Carga actual de productos

Los denominadores son los 60 productos completos, incluidos accesorios, muestras y gift card; no representan 60 armazones comerciales. Tener un campo cargado no acredita verificación física ni aprobación del producto para venta.

| Información | Fuente real | Tipo | Con valor | Uso en el modal |
| --- | --- | --- | --- | --- |
| Ancho total, ancho de cristal, puente, alto de cristal, patilla | `custom.frame_dimensions` | JSON | **1/60** | Fuente de las cotas y valores mm; solo claves numéricas positivas conocidas. |
| Talla física declarada | `custom.frame_size` | Texto con opciones | **46/60** | Etiqueta de talla, no fuente para completar medidas ausentes. |
| Clasificación de ancho físico | `custom.frame_width` | Texto con opciones | **31/60** | Estrecho / estándar / ancho. No es un valor numérico en mm. |
| Peso | `custom.frame_weight` | Decimal | **1/60** | Característica secundaria en gramos. |
| Forma | `custom.frame_shape` | Texto con opciones | **48/60** | Característica del marco; no determina sus dimensiones. |
| Material | `custom.frame_material` | Texto con opciones | **48/60** | Característica declarada; no permite deducir peso o calce. |
| Rostros compatibles | `custom.face_shapes_compatible` | Texto de una línea, no lista | **31/60** | Orientación declarada; no prueba talla ni ajuste físico. |
| Afinidades de estilo | `custom.style_traits` | Lista de referencias a metaobjects | **5/60** | Color/acabado/patrón/transparencia/uso/presencia; no medidas. Los cinco productos referenciados tienen `style_quiz_demo=true`. |

La definición JSON actual pide medidas verificadas y no deducir ancho total. No impone validaciones de estructura JSON; el consumidor del modal filtra claves conocidas y números positivos.

### Único producto con medidas numéricas

`lemoon-dalton-prototipo`, ID `15409107763368`, UNLISTED, plantilla `optica`:

| Clave dentro de `frame_dimensions` | Valor configurado |
| --- | --- |
| `frame_width` | 140 mm |
| `lens_width` | 54 mm |
| `bridge` | 17 mm |
| `lens_height` | 42 mm |
| `temple` | 145 mm |

Peso: 22.5 g. Son datos cargados del prototipo; esta auditoría no comprueba el armazón físicamente. **Ningún producto ACTIVE tiene `frame_dimensions` cargado en esta lectura.**

### Dos nombres que no deben confundirse

- `custom.frame_width`: clasificación textual (estrecho, estándar, ancho).
- `custom.frame_dimensions.value.frame_width`: ancho numérico en mm.

La talla tiene tres opciones actuales: `pequeño (49-16-142)`, `mediano (54-17-145)`, `grande (58-18-145)`. No convertirlas en una tabla universal ni rellenar las cinco medidas desde ellas. `scripts/seed-products.ts` contiene una tabla de dimensiones de muestra por talla; no es evidencia de medidas reales y no debe alimentar producción.

## Metaobjects existentes

Solo se encontraron estos tres tipos; no existe una definición dedicada a guía de tallas, tipos de puente, plaquetas o reglas de calce.

| Tipo | Entradas | Campos / estado | Pertinencia |
| --- | --- | --- | --- |
| `lemoon_style_trait` | **21** | `group`, `code`, `label`, `description`, `image`. **0/21** entradas tienen imagen. Acceso Storefront PUBLIC_READ. | Diccionario del quiz. `compact`, `medium`, `oversize` describen presencia visual; no talla física. Las descripciones orientan a quien clasifica catálogo, no certifican el SKU. No usar el campo imagen para alojar instrucciones de medidas ajenas al atributo. |
| `tipo_de_lente` | **8** | Solo campo `nombre`: Monofocal, Bifocal, Progresivo, Sin graduación, Filtro de luz azul, Fotocromático, Ocupacional y Deportivo. PUBLIC_READ. | Opciones de lentes; no contiene medidas, ilustraciones, descripciones de ajuste ni imágenes. `custom.lens_compatible` es una lista de referencias a este tipo y se conserva. |
| `shopify--knowledge-base-fact` | **7** | Hechos/sugerencias generales de Shopify; acceso Storefront NONE. | No es una fuente estructurada de dimensiones por SKU ni un modelo de guía para este modal. No se auditaron sus valores como contenido de talla. |

Las definiciones PRODUCTVARIANT incluyen afinidades y proyecciones de estilo; no se encontró una definición de dimensiones o peso por variante. Esta lectura de definiciones no acredita ausencia de cualquier metafield sin definición en cada variante. Si cambia la talla dentro de un producto, el contrato actual por producto requiere revisión antes de atribuir las mismas medidas a todas sus variantes.

## Qué está preparado para futuras cargas

Lectura del checkout de back office `antekera/lemoon-next-backoffice`, HEAD `859ba02379a3d9f11febac9136cd28c5c762d650`, sin modificar su archivo local pendiente `apps/web/next-env.d.ts`:

- `apps/web/components/studio-style-metadata.tsx`: formulario con las cinco medidas y peso, todos opcionales.
- `packages/domain/src/style-metadata.ts`: modelo parcial de dimensiones; requiere al menos una medida conocida si se entrega el objeto. Distingue metadatos pendientes/aprobados y exige evidencia para aprobación. Solo fusiona las medidas de cristal/puente/patilla procedentes de atributos ya aprobados.
- `services/api/src/services/studio-shopify-sync.ts`: revisa que existan `frame_dimensions` JSON y `frame_weight` decimal cuando se van a sincronizar; exige revisión final y metadatos aprobados.
- `services/api/src/ai/gemini-studio-vision-provider.ts`: permite sugerir medidas únicamente desde una inscripción legible, no desde escala visual; una sugerencia no equivale a aprobación.

Esto demuestra **soporte en código para carga posterior**, no que el flujo esté desplegado, que se haya completado una sincronización real ni que exista una fecha comprometida de carga. Las dimensiones continuarían llegando al mismo metafield, sin necesitar un metaobject de talla nuevo.

## Traducción al inventario gráfico propuesto

| Elemento del modal | Fuente disponible | Decisión de datos |
| --- | --- | --- |
| Frontal/lateral con valores reales | `frame_dimensions` | Mostrar solo cotas con dato confirmado; fallback cuando falte. Alinear la convención del ancho exterior frente a bisagra-bisagra. |
| Etiqueta talla y clasificación de ancho | `frame_size`, `frame_width` | Datos independientes; no generar rangos S/M/L por inferencia. |
| Forma, material y peso | Metafields correspondientes | Mostrar cuando estén confirmados para el producto; omitir lo ausente. |
| Zoom didáctico del código de patilla | No hay metaobject/imagen de guía cargado | Crear un gráfico compartido original; números claramente de ejemplo, separados de los valores SKU. |
| Comparación con regla | No hay recurso de guía cargado en metaobjects | Crear un gráfico didáctico compartido y texto revisado; no fotografía o medición ficticia del producto. |
| Puente alto/bajo, plaquetas ajustables | Sin campos específicos encontrados | No presentar como atributo del SKU hasta definir y cargar su fuente verificable. |
| Gráfico de rostros/calce | `face_shapes_compatible` es solo una etiqueta; estilo tiene imágenes vacías | No usar como recomendación física automática. Un gráfico genérico de comodidad sería editorial, separado del dato de producto. |

El contenido compartido actual del tema tiene instrucciones por traducción y los settings `lemoon_size_guide_page` / `lemoon_size_guide_placeholder`; no los lee de metaobjects. Se inspeccionó el consumidor local, no los valores configurados de esos settings en todos los temas Shopify.

## Fuentes y discrepancias

- Admin GraphQL conectado: `metafieldDefinitions(ownerType: PRODUCT/PRODUCTVARIANT)`, `metaobjectDefinitions`, `metaobjects(type: lemoon_style_trait/tipo_de_lente)` y `products`, con paginación completa en las conexiones consultadas.
- Consumidores locales: `snippets/lemoon-size-guide-content.liquid`, `snippets/lemoon-frame-dimensions.liquid` y `docs/shopify-eyewear-pdp-setup.md`.
- [LEM-93](https://linear.app/antekera/issue/LEM-93): su alcance vigente exige verificar lo existente y no recrear campos. Varias tablas históricas discrepan de Shopify: compatibilidad booleana frente a lista real; rostros como lista frente a texto real; tallas usadas para derivar medidas. La sección operativa más reciente del ticket conserva los contratos reales. No se aplicaron las instrucciones históricas como migración.
- [Definiciones de metafields](https://shopify.dev/docs/api/admin-graphql/2026-01/queries/metafieldDefinitions) y [definiciones de metaobjects](https://shopify.dev/docs/api/admin-graphql/2026-01/queries/metaobjectDefinitions), consultadas vía Context7 para las lecturas.

No se ejecutaron escrituras Shopify ni pruebas de sincronización, ni se cambiaron contratos, UI, publicaciones o estados de tickets.
