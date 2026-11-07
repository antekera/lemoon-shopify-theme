# LEM-11 · Ajustes aprobados: estado de entrega

Fecha: 06-11-2026. Base del tema `5391d588`; rama `fix/lem-11-quiz-copy-feedback`. Miguel aprobó la especificación y la implementación con «Apruebo. Procede.». Esto autoriza preparar el cambio; la entrega corregida, el merge y la publicación conservan sus verificaciones correspondientes.

## Contrato

[Especificación aprobada](../specs/2026-11-06-lem-11-descubre-tu-estilo.md) y [plan](../superpowers/plans/2026-11-06-quiz-native-filters.md). La salida es la colección nativa completa con filtros editables. No hay ranking alternativo, filtrado de tarjetas ya paginadas ni parámetros inventados como respaldo. Las preguntas omitidas no agregan restricciones.

## Shopify: acciones verificadas

- Tienda: `gid://shopify/Shop/76333711528`, dominio canónico `pzsrt4-1u.myshopify.com`, dominio público `lemoon.cl`; acceso Admin mediante alias `lemoon-8277`.
- Diccionario existente: 21 entradas de `lemoon_style_trait`, definición `37833048232`, acceso storefront público. Se conservó el diccionario, incluidas las entradas de legado.
- Se crearon y leyeron nuevamente seis definiciones `PRODUCTVARIANT`, todas `list.metaobject_reference`, acceso `PUBLIC_READ` y referencia a la definición anterior:

| Campo `custom` | ID de definición |
| --- | --- |
| `style_filter_color` | `520378515624` |
| `style_filter_finish` | `520378548392` |
| `style_filter_pattern` | `520378581160` |
| `style_filter_transparency` | `520378613928` |
| `style_filter_use` | `520378646696` |
| `style_filter_presence` | `520378679464` |

- Se prepararon 60 proyecciones en las diez variantes de los cinco productos demo identificados: Ártico, Estero, Faro, Génova y Jade. Se derivaron de la lectura actual, respetando reemplazo completo por criterio; no se copiaron las asignaciones antiguas como estado actual.
- La lectura posterior comparó los 60 valores esperados y los valores fuente de producto/variante: coincidencia completa y fuentes semánticamente intactas. Las escrituras incluyeron CAS sobre campos derivados ausentes; las tandas con guardias de fuente existente enviaron exactamente el mismo valor. Un reintento de Faro Azul protegió los derivados y se comprobó contra la fuente en la lectura final, sin afirmar atomicidad global.
- No se escribieron precios, stock, estados, compatibilidades, fotos, medidas ni peso. Esta afirmación describe el alcance de las mutaciones; no es una comparación exhaustiva de todos los campos comerciales remotos.
- Search & Discovery guardó el filtro nativo de tipo de producto con etiqueta **Tipo de lentes**, ID `77524861096`. Una lectura autenticada real de `/collections/all` confirmó `filter.p.product_type` junto a los filtros anteriores.

Los backups y lecturas sanitizadas están en el directorio Git común `delivery-evidence/lem-11-copy-feedback/`: `definitions-dictionary-before.json`, `demo-products-before-native-projections.json`, `demo-products-after-native-projections.json`, `page-menus-before.json` y lecturas de filtros. No contienen contraseña ni token. Los IDs anteriores son evidencia de esta tienda, no constantes que deban copiarse a otra.

## Bloqueo de activación nativa

Search & Discovery muestra los seis nuevos metacampos de variante en su selector. Al elegir **Color de estilo**, la aplicación devuelve «Hay un problema al cargar esta página». Los reintentos y la recuperación de la sesión también terminaron en error de la aplicación. El conector Admin presentó errores HTTP500 intermitentes; las escrituras se conciliaron mediante lecturas antes de reintentar.

La última lectura de colección expuso género, precio, forma, color de opción, receta, material, talla física y tipo de producto. **No expuso los seis filtros derivados.** Definiciones, datos y disponibilidad en el selector no acreditan que Search & Discovery los haya activado.

El quiz verifica `collections['all'].filters` antes de enviar cada criterio. Mientras falte un filtro elegido, conserva la última pregunta y sus respuestas, ofrece reintento y el enlace al catálogo; no genera una URL parcial que omita preferencias.

Pendiente en la aplicación instalada: habilitar los seis criterios, comprobar su operador OR y verificar en storefront las combinaciones entre criterios/variantes, valores activos, eliminación, sorting, conteos, vacío y paginación. No se instalaron aplicaciones ni ampliaron permisos para sortear el error.

## Página y menús: activación coordinada pendiente

La página existente `161787576488` sigue publicada con título `Encuentra tu lente ideal`, handle `buscar-mi-estilo` y plantilla interna `buscar-mi-estilo`. La nueva rama prepara los accesos a `/pages/descubre-tu-estilo`; no se cambió el CMS mientras la entrega del tema y sus filtros siguen pendientes.

En la activación, actualizar esa misma página a título `Descubre tu estilo`, handle `descubre-tu-estilo`, conservando plantilla y publicación y usando `redirectNewHandle:false`. Actualizar solo el enlace correspondiente en `footer-how-to`, `footer-services-review` y `footer-services-mobile-review`, preservando los demás elementos y la asociación PAGE. El backup contiene los tres árboles originales. La consulta paginada de redirects para la ruta antigua devolvió cero entradas; repetirla antes y después. La aceptación exige nueva ruta natural funcional y antigua HTTP404 sin redirección.

Esta coordinación no autoriza un push al tema publicado. Las pruebas del CMS posteriores a la activación y la publicación del código deben quedar registradas por separado.

## Back office y límites de integración

Delta aislado en `feat/lem-11-native-style-filters`, base PR9 `48ca70e`, repositorio `antekera/lemoon-next-backoffice`. Amplía vocabulario y prepara publicación/refresh de seis campos efectivos por variante. Se preserva el checkout propietario, incluido su `apps/web/next-env.d.ts` modificado.

La derivación debe consumir fuentes Shopify frescas y resolver el diccionario de la tienda. La fuente ausente no se crea artificialmente para obtener una guardia: esa condición requiere relectura y convergencia acotada, no ofrece una transacción global. Un fallo o fuente incompleta debe impedir marcar el producto como listo.

La reconciliación autenticada y los eventos existentes de producto son superficies de código; no prueban scopes, flags efectivos ni despliegue. La emisión de un evento por cualquier edición directa de metacampos requiere evidencia nativa adicional. No se inventan topics `metafields/create`, `metafields/update` o `metafields/delete`, ausentes de la referencia utilizada. La garantía automática de actualización posterior conserva este gap operativo hasta verificar un mecanismo real.

## Verificación local y revisión

Validación final de las fuentes locales:

- `npm run test:unit`: **459/459**, después de reproducir y corregir tres casos de referencia neutral ausente (prueba roja conservada).
- `npm run test:e2e -- tests/e2e/style-quiz.spec.js --reporter=list`: **25/25 Chromium** en la revisión final.
- `npm run test:e2e:cross-browser -- tests/e2e/style-quiz.spec.js --reporter=list`: **50/50 Firefox/WebKit** en la revisión final.
- La suite Chromium completa anterior pasó **271/271** sobre los mismos controladores/layout; dos casos de historial agregados después se ejecutaron también por separado. No se etiqueta esa ejecución anterior como una nueva suite completa.
- Theme Check: **cero infracciones** (última ejecución: 334 archivos inspeccionados); diff-check limpio.
- Revisión independiente de código **Approved**, P2 de neutral completo cerrado; revisión de convenciones **Ready to push**, sin hallazgos. Responsabilidad de solo lectura sin aislamiento técnico.

Hashes SHA-256 de runtime revisados: controlador `8925653b3d90314878c3e970f4ee515130608099a6ec0f2a55f0229e986f204e`; helper `b40af8d34cad99502ceec8ba9c4ab6781d12e288cacee0242e26e96f00465dd6`; CSS `d46bca540b660db96c724b4177b86165a55e113a7dbe78dc17be0b97305d7ca2`; sección `8ac661da4e791b0c6f865209b0d64537d8497f8bee4ebe45b5c562f4125d8991`.

El retorno reconstruido se prueba con un ID de documento distinto; no se demostró bfcache real. Zoom se comprueba mediante reflow equivalente a 720px CSS, sin controlar zoom del navegador. La prueba de primera pintura fija fuentes externas para aislar la carga del módulo: no mide LCP ni estabilidad de carga de fuentes. Las doce pruebas storefront están preparadas pero no ejecutadas porque aún falta la configuración y entrega remota.

 Fixtures LiquidJS y navegador comprueban el comportamiento del código, no la indexación Shopify ni la entrega de webhooks. La plantilla de producto nativa selecciona la variante relevante en colecciones filtradas; el contrato de entrada de la tarjeta se prueba con fixtures y su comprobación real sigue pendiente.

Referencias primarias: [filtros nativos y semántica](https://shopify.dev/docs/storefronts/themes/navigation-search/filtering/storefront-filtering), [variante relevante de producto](https://shopify.dev/docs/api/liquid/objects/product#product-selected_or_first_available_variant), [topics de webhook](https://shopify.dev/docs/api/admin-graphql/2026-01/enums/WebhookSubscriptionTopic).
