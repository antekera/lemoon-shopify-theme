# LEM-50 — Investigación de estrategia SKU

**Registro histórico de la investigación inicial.** Las alternativas y la
preferencia provisional de este documento preceden a la decisión posterior de
usar bloques numéricos sin guiones. Consultar la [guía actual de SKU](sku-strategy.md)
para el formato NNNNFFCCMMTT, el diccionario propuesto, la entrega del back office
y las condiciones que siguen pendientes. La inspección de código citada abajo
corresponde al SHA histórico indicado, no al estado actual del PR.

Fecha: 09-11-2026. Estado: investigación y propuesta para revisión; formato sin aprobar ni implementar. Alcance: capacidades Shopify, referencias internacionales y encaje con Product Studio. No asigna SKU reales ni completa la carga de los primeros 50 productos.

## Recomendación

Integrar la gestión del SKU al mismo flujo de alta del back office, pero asignarlo mediante reglas deterministas, fuera de la generación editorial de Gemini. El prompt recibe identificadores como contexto inmutable; propone nombres y descripciones. Shopify conserva la autoridad comercial, conforme a [ADR-001](../architecture/adr-001-shopify-commerce.md).

LEM-50 propone `[MARCA]-[MODELO]-[COLOR]-[TALLA]` y pide sobrevivir a cambios de marca/proveedor/categoría. Ese formato obliga a elegir entre conservar un código que deja de describir el artículo o renumerar. Conviene separar identidad estable y atributos descriptivos.

## Qué aporta Shopify

| Capacidad verificada                                                                                                                                                                                                                                    | Aplicación a Lemoon                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SKU por variante, edición individual, editor masivo y CSV. Recomendación de códigos breves, por ejemplo hasta 16 caracteres; no es un máximo técnico demostrado. [S1]                                                                                   | Definir una convención y probarla en los consumidores reales.                                                                                                         |
| Advertencia de SKU duplicado que se puede ignorar; sensibilidad a mayúsculas. [S1]                                                                                                                                                                      | Validar unicidad en el flujo de escritura; la advertencia no la garantiza.                                                                                            |
| Mismo SKU de una variante en distintas ubicaciones, con cantidades separadas. [S1]                                                                                                                                                                      | No incluir bodega, canal ni sucursal en el código.                                                                                                                    |
| `ProductVariant.id`, opciones, inventario, medios y campos personalizados. `InventoryItem` expone `sku` y `duplicateSkuCount`. [S2–S3]                                                                                                                  | Vincular por IDs Shopify y usar SKU como referencia operativa legible. Auditar duplicados sin elegir arbitrariamente una coincidencia.                                |
| `inventoryItemUpdate` permite cambiar SKU; requiere `write_inventory` y permiso del usuario. `productVariantsBulkUpdate` permite actualizar variantes por producto y requiere `write_products`; recibe `inventoryItem` y devuelve `userErrors`. [S4–S6] | Reutilizar la integración existente tras verificar versión y scopes. Revisar errores y releer el resultado. No solicitar permisos adicionales por esta investigación. |
| Opciones de variantes y metafields de categoría vinculados a opciones. [S7]                                                                                                                                                                             | Mantener color/talla como datos estructurados reutilizables. No meter todo el catálogo técnico en el SKU.                                                             |
| CSV admite SKU y metafields de producto; los metafields de variante requieren otra vía, como el editor masivo. Importaciones con opciones incompletas o cambiadas pueden eliminar opciones o reemplazar IDs. [S8]                                       | El SKU no es una clave universal de upsert CSV. Conservar exportación base, handle y opciones; ensayar ida y vuelta en entorno autorizado.                            |
| Códigos de barras separados del SKU; algunos canales requieren GTIN. La documentación actual contempla hasta 20 códigos por producto/variante. [S9]                                                                                                     | Conservar identificadores reales del fabricante. Verificar si la versión API y el conector existentes soportan múltiples códigos antes de diseñar su mapeo.           |

La documentación y las APIs aportan almacenamiento, edición, consulta y diagnóstico. La política de nomenclatura y el control de asignación siguen siendo responsabilidad de Lemoon. No se verificó una función nativa que implemente la política propuesta. No se justifica instalar una app generadora antes de identificar una necesidad concreta. Disponibilidad de POS, etiquetas, canales, apps y costos de la tienda no auditada.

## Identificadores y características que deben separarse

| Dato                                  | Regla propuesta                                                                                                                              |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Nombre editorial público              | Editable y localizable; no determina el SKU.                                                                                                 |
| Marca, modelo y referencia fabricante | Preservar el original y su evidencia. Nombrar un artículo no lo convierte en marca propia.                                                   |
| SKU Lemoon                            | Identidad de la variante vendible; conservar al renombrar o regenerar textos.                                                                |
| Código proveedor                      | Conservar aparte, asociado al proveedor; admitir que distintos proveedores referencien el mismo artículo.                                    |
| GTIN/EAN/UPC                          | Identificador externo verificado; no derivarlo del SKU ni inventarlo con IA. GS1 distingue las variaciones comerciales de talla/color. [S10] |
| IDs Shopify                           | Referencias técnicas por tienda: producto, variante e inventario. No regenerarlos por cambios editoriales.                                   |
| Atributos variante                    | Color/patrón/acabado, talla y medidas verificadas, y diferencias físicas/comerciales relevantes.                                             |
| Atributos producto                    | Tipo, forma, material y otros hechos comunes; comprobar cuándo una variante los contradice.                                                  |

No inferir talla a partir de una fotografía. En monturas, distinguir ancho de lente, puente, patilla, ancho total y ajuste: un único número no representa todo eso.

## Referencias internacionales: observación e inferencia

| Sitio oficial                                                                                                  | Observación pública                                                                                             | Enseñanza propuesta                                                                                                        |
| -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| [Warby Parker — Durand](https://www.warbyparker.com/eyeglasses/durand/whiskey-tortoise?w=wide)                 | Separa nombre, color y ancho/ajuste; publica medidas de lente, puente y patilla.                                | Conservar nombre y ficha técnica separados; definir qué significa talla en Lemoon.                                         |
| [Ray-Ban — Justin Classic](https://www.ray-ban.com/usa/sunglasses/0RB4165-JUSTIN%20CLASSIC-Black/713132587096) | El índice oficial muestra nombre y referencia `RB4165 601/8G 51-16`. Apertura directa limitada por renderizado. | Preservar referencia original completa aunque exista un nombre editorial propio. Evidencia limitada al índice oficial.     |
| [Oakley — Holbrook](https://www.oakley.com/en-us/product/W0OO9102?variant=888392279606)                        | Publica nombre, código `OO9102-E155`, color de armazón/lente y talla.                                           | Mantener identificación técnica junto a presentación comercial. El parámetro `variant` de su URL no demuestra SKU ni GTIN. |

Estos sitios permiten observar cómo se presentan productos; no revelan su política interna de SKU. La recomendación de separar identidad y texto es una inferencia de diseño para Lemoon, no un estándar universal ni evidencia de desempeño de esas marcas.

## Alternativas de estructura para la siguiente etapa

Ejemplos sintéticos, sin asignación al catálogo:

| Patrón                                                      | Ventaja                                                              | Costo o riesgo                                                                                   |
| ----------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Marca–modelo–color–talla, como LEM-50                       | Lectura técnica inmediata cuando todos los campos están disponibles. | Referencias largas, excepciones entre proveedores, atributos que cambian y accesorios sin talla. |
| `LM-00000001` — secuencia por variante, 11 caracteres       | Muy simple, estable y transversal al catálogo.                       | Necesita consulta o etiqueta descriptiva para reconocer el artículo.                             |
| `LM-000001-001` — familia interna y variante, 13 caracteres | Agrupa variantes sin depender de nombres ni atributos mutables.      | Requiere definir la familia interna y asignación persistente de ambos números.                   |

Preferencia provisional: evaluar el tercer patrón frente al segundo con el catálogo real. `LM` identifica el espacio interno de códigos, no afirma que Lemoon fabrique el producto. La familia interna no se recalcula desde el título ni desde la posición de una variante. El sufijo es un ordinal estable, no un color ni una medida. Reservar el cero y detener la asignación al agotar capacidad; no truncar ni reciclar.

Legibilidad operativa: mostrar SKU junto a nombre, color, medidas y referencia fabricante en etiquetas y pantallas. El SKU no necesita codificar todos esos datos. La elección final requiere comprobar el picking y los sistemas conectados.

Reglas candidatas: un SKU por variante vendible; nueva combinación física distinta recibe otro; cambio de precio, texto, proveedor o ubicación no renumera por sí solo; no reutilizar retirados. Si un cambio de proveedor implica un artículo distinto, revisar identidad antes de conservar código. Corregir una referencia errónea requiere historial y revisión de dependencias. La regla de no reutilización es política propuesta de Lemoon, no obligación GS1 sobre SKU internos.

## Integración con Product Studio y el prompt

Verificación local de solo lectura: checkout `antekera/lemoon-next-backoffice`, HEAD `f6e11cb`, con cambios concurrentes sin incorporar a esta tarea. En `services/api/src/ai/catalog-content-prompts.ts`, `CatalogPromptInput` selecciona datos a nivel producto; `requiredOutput` y `catalogContentResponseSchema` incluyen nombre, descripciones, SEO, alt, sugerencias y advertencias, sin campo SKU. `contentInstructions` está limitado a 30–3000 caracteres en `packages/domain/src/product-studio.ts`. Esto acredita el código inspeccionado, no el despliegue ni la ausencia de otras capacidades en todo el repositorio.

Por tanto, agregar «genera SKU» a las instrucciones editoriales no establece un contrato técnico de asignación. Coordinar con [LEM-6](https://linear.app/antekera/issue/LEM-6) el prompt y con [LEM-145](https://linear.app/antekera/issue/LEM-145) la integración. [LEM-93](https://linear.app/antekera/issue/LEM-93) conserva el modelo de atributos y [LEM-70](https://linear.app/antekera/issue/LEM-70) la carga/QA.

Flujo propuesto:

1. Importar o revisar datos fabricante/proveedor y resolver identidad producto/variante. Reutilizar SKU existentes válidos antes de aplicar un formato nuevo.
2. Mostrar identificador de trabajo para borradores sin SKU; revisar variantes y hechos. El generador editorial no necesita esperar un SKU definitivo.
3. Asignar o reservar SKU mediante servicio determinista en el paso de alta aprobado. Reintentos y dos operadores deben devolver la misma asignación para el mismo borrador/variante.
4. Generar contenido desde hechos revisados y contexto por variante; mantener SKU y referencias fuera de la salida editable por el modelo. Señalar faltantes/contradicciones internamente.
5. Aprobar y enviar exclusivamente campos autorizados a Shopify. Releer IDs y SKU; registrar versión de regla, autor, fecha, motivo y errores.

Texto orientativo para el prompt, pendiente de conciliar con LEM-6: «Los identificadores suministrados son datos operativos de solo lectura. No generes, modifiques ni deduzcas SKU, GTIN ni referencias de fabricante. Si faltan, indícalo en las advertencias internas. Genera nombres y textos desde hechos aprobados, respetando las diferencias entre variantes».

El mecanismo de reserva sirve como apoyo técnico, no como catálogo comercial paralelo. Prevalidar en Shopify, serializar las asignaciones propias, conservar claves de idempotencia y reconciliar tras escribir. Una búsqueda antes de escribir no evita por sí sola una carrera con un editor o integración externa; Shopify permite duplicados. El diseño debe acotar quién asigna y detectar conflictos, sin prometer unicidad global transaccional que no se ha demostrado.

## Monturas, cristales, tratamientos y accesorios

Aplicar [ADR-002](../architecture/adr-002-eyewear-purchase.md): marco solo, cristales/tratamientos compatibles y accesorios. No crear de antemano una variante por cada fórmula de receta ni incorporar datos del paciente al SKU. Determinar con el modelo comercial existente qué es variante, producto/componente adicional o dato de configuración de pedido. Un SKU de marco no debe pasar a significar silenciosamente un conjunto con cristales. No se ha definido aquí una nueva estructura de bundles ni cargos.

## Trabajo necesario antes de adoptar la regla

1. Inventario de solo lectura de las primeras 50 fichas y todas sus variantes: IDs, SKU, fabricante/proveedor, códigos, GTIN, opciones, medidas y estado de verificación. Medir vacíos, duplicados y referencias ya usadas en pedidos/integraciones. No se realizó una auditoría autenticada del catálogo en esta investigación.
2. Elegir el patrón y sus excepciones con ejemplos de ópticos, sol y accesorios. Resolver definición de familia/modelo y caso de mismo producto con varios proveedores. Conservar SKU existentes válidos salvo migración justificada.
3. Elaborar tabla de asignación revisable, una fila por variante. Cincuenta productos no equivalen a cincuenta SKU. Definir etiquetas, responsables y manejo de bajas/correcciones.
4. Implementar y probar en back office: unicidad de asignaciones propias, concurrencia, reintentos, conservación al regenerar contenido, rechazo de duplicados/importaciones ambiguas, cambios externos y recuperación de fallo parcial.
5. En entorno autorizado, verificar creación y readback Shopify, exportación/reimportación sin cambiar opciones/IDs, etiquetas y escaneo si se usarán, búsqueda, picking, devolución y consumidores reales. Probar artículo simple y con variantes; repetir asignación y confirmar que no duplica.
6. Registrar aceptación humana de la regla y revisión exacta. Autorizar por separado cualquier escritura real o migración. LEM-50 sigue abierto hasta satisfacer sus condiciones completas, incluidos los primeros 50 productos y evidencia operativa.

## Fuentes y límites

Context7 consultado primero: `/websites/shopify_dev_api_admin`, sobre SKU/InventoryItem y mutaciones. Se contrastó con documentación oficial actual. Las páginas `latest` cambian y no certifican la versión instalada del back office. Hay referencias antiguas dentro de Help —por ejemplo, la página SKU aún menciona 100 variantes—; esta investigación no adopta ese límite. No se ejecutaron mutations, importaciones, pruebas Gemini ni validación física de etiquetas.

- [S1 — Shopify: Using SKUs](https://help.shopify.com/en/manual/products/details/sku).
- [S2 — ProductVariant](https://shopify.dev/docs/api/admin-graphql/latest/objects/ProductVariant).
- [S3 — InventoryItem](https://shopify.dev/docs/api/admin-graphql/latest/objects/InventoryItem).
- [S4 — InventoryItemInput](https://shopify.dev/docs/api/admin-graphql/latest/input-objects/InventoryItemInput).
- [S5 — inventoryItemUpdate](https://shopify.dev/docs/api/admin-graphql/latest/mutations/inventoryItemUpdate).
- [S6 — productVariantsBulkUpdate](https://shopify.dev/docs/api/admin-graphql/latest/mutations/productVariantsBulkUpdate).
- [S7 — Variantes y opciones](https://help.shopify.com/en/manual/products/variants).
- [S8 — CSV de productos](https://help.shopify.com/en/manual/products/import-export/using-csv).
- [S9 — Barcodes](https://help.shopify.com/en/manual/products/details/barcodes).
- [S10 — GS1: GTIN por talla y color](https://support.gs1.org/support/solutions/articles/43000734083-how-many-gs1-gtins-do-i-need-when-i-have-a-product-with-many-sizes-and-colours-).

Contexto interno vigente consultado: LEM-50 completo, LEM-6 y LEM-145; ADR-001/002 y código local citado. Las referencias internacionales se investigaron en paralelo; no constituyen revisión independiente de la propuesta completa.
