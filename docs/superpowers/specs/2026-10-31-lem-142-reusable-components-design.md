# LEM-142 — Biblioteca ejecutable de componentes y recetas

Estado: diseño e implementación aprobados por Miguel el 31-10-2026 («apruebo la implementacion de LEM 142»). La aclaración sustituye el alcance exclusivamente documental del PR40. Implementación en curso según el [plan de ejecución](../plans/2026-10-31-lem-142-reusable-components.md); el código final requiere su propia revisión antes del merge.

## Resultado esperado

Un agente que crea una sección debe encontrar piezas existentes, conocer sus entradas y renderizarlas sin copiar markup ni volver a decidir estilos. LEM-142 entrega snippets reutilizables consumidos por el tema, recetas de composición, documentación de descubrimiento y pruebas. El inventario respalda esa entrega y se mantiene con ella.

La fuente visual continúa en `/DESIGN.md`. Se preservan tipografía, colores, variantes existentes, contenido, edición en Shopify y comportamiento comercial. La biblioteca organiza y consolida el código actual; no introduce un sistema visual alternativo.

## Organización y descubrimiento

- `snippets/`: ubicación ejecutable nativa. Las extracciones nuevas usan el prefijo `lemoon-ui-`; los snippets canónicos actuales conservan su nombre. Shopify no admite carpetas anidadas arbitrarias en la estructura del tema.
- `docs/components/README.md`: entrada para agentes, índice por necesidad y estado real de cada pieza: reutilizable, composición de sección o extracción pendiente. Los estados evitan presentar una sección completa como un átomo disponible.
- `docs/components/recipes/`: recetas por familia con enlaces al código real, parámetros, variantes y estados soportados, dependencias CSS/JS, ejemplo Liquid y condiciones de uso.
- `AGENTS.md`: instrucción de consultar el catálogo al crear o modificar una sección; reutilizar antes de crear y documentar toda incorporación en el mismo PR.
- `docs/design/component-inventory.{md,json}`: fuentes, consumidores y cobertura actualizados. La guía `component-library.md` enlaza la entrada operativa sin duplicar contratos.

Los ejemplos son llamadas a los snippets reales. No se mantiene una copia ejecutable de cada componente dentro de las recetas ni se añade compilación para sincronizar dos árboles.

## Unidades de reutilización

### Fundaciones y controles

Extraer los patrones compartidos de acciones, títulos/encabezados, campos con label/ayuda/error y mensajes de estado. Los controles distinguen navegación de acción, conservan los tipos nativos y reciben sus datos explícitamente. Las variantes proceden de las clases y tokens existentes; cada variante pública debe tener un consumidor real o una demostración identificada.

Los contratos documentan texto escapado, contenido HTML confiable suministrado por el consumidor, identificadores, clases locales, asociaciones de formulario y atributos accesibles admitidos. Los IDs los genera el consumidor con el contexto de sección/formulario. No se añade una entrada genérica de atributos HTML procedentes de contenido externo.

Los campos conservan `id`, `name`, valor, tipo, validación nativa y relaciones de ayuda/error. La sección mantiene el formulario Shopify y sus errores/respuesta reales; el snippet presenta esos datos. Cualquier corrección de contorno/foco exigida por DESIGN se identifica y prueba expresamente.

Reutilizar iconos, spinner, precio, swatches y tarjetas que ya tienen una implementación canónica. La ficha explica cómo usarlos y qué dependencias necesita el consumidor; crear un wrapper únicamente para renombrarlos no constituye consolidación.

La primera extracción contiene seis contratos concretos:

| Snippet nuevo | Entradas y frontera | Consumidor real |
| --- | --- | --- |
| `lemoon-ui-action` | `label`, `element` (`a`/`button`), `href`, `type`, `variant` (`primary`/`secondary`/`tertiary`), `style_family` (`base`/`local`), `class`, ID/formulario y atributos ARIA explícitos; disabled/loading cuando apliquen | CTA de guía, submit de contacto y enlace de ayuda FAQ; galería con variantes base |
| `lemoon-ui-field` | `kind` (`input`/`textarea`), `id`, `name`, `label`, `type`, `value`, validación/atributos nativos, ayuda/error con IDs y clases; familia contact/base conserva orden del label | Cuatro controles de contacto y galería |
| `lemoon-ui-select` | `id`, `name`, `options_html` capturado en el consumidor, clases/wrapper, label externo, atributos nativos/ARIA y caret existente | Ordenación vertical de búsqueda y galería; opciones y política de ordenación permanecen en el consumidor |
| `lemoon-ui-heading` | `text`, `level` restringido a 1–6, `id`, `class`; tamaño/color continúan en CSS | Guía, contacto, FAQ y galería |
| `lemoon-ui-message` | `tag` restringido a `p`/`div`, texto o HTML confiable, `id`, `class` y role/live/foco explícitos; sin rol de anuncio automático | Ramas de respuesta nativa de contacto; estados sintéticos de galería sin anuncios simultáneos |
| `lemoon-ui-faq-item` | `id`, pregunta, nivel semántico, `answer_html`, clases, `open`, atributos del bloque e indicador existente | Fallback y bloques personalizados del FAQ agrupado; galería |

Cada archivo lleva LiquidDoc con parámetros opcionales y ejemplo válido. Los parámetros booleanos preservan `false`; un enlace deshabilitado no conserva un destino activable. El modo local de acciones conserva las clases de su superficie sin añadir automáticamente `.button`. El select conserva `SortBy`, `sort_by`, mensajes accesibles y la propagación de eventos del formulario existente. La extracción no cambia el criterio de ordenación.

### Composiciones presentacionales

Componer las fundaciones en unidades pequeñas usadas por guías, ayuda, FAQ y contacto: encabezado de sección, mensaje con icono y elemento de acordeón nativo. Mantener anchos y clases locales de cada superficie, orden de headings, anchors y `block.shopify_attributes` en su elemento propietario.

La composición conserva `details/summary` y el comportamiento nativo cuando corresponde. Un único componente de sección con decenas de opciones no sustituye estas unidades pequeñas.

### Componentes interactivos y de comercio existentes

El catálogo incluye las fuentes canónicas para carousel, drawers, búsqueda, filtros, carrito, tarjetas y herramientas de producto, junto con sus controladores, datos y límites de integración. El dominio comercial conserva su dueño: el átomo no calcula precio/stock, elige variantes, envía recetas ni procesa pagos.

Esta entrega no exige reescribir las 44 familias ni dividir cada sección en un snippet nuevo. Exige que las piezas realmente reutilizables sean descubribles y que las extracciones entregadas se usen en el código. Las familias sin API reutilizable segura se identifican como composición o extracción pendiente, con su fuente actual; no se anuncian como ya consolidadas.

## Integración observable

Migrar consumidores existentes de guía, contacto, FAQ y ordenación vertical de búsqueda para usar las piezas extraídas. Adaptar la galería `lemoon-design-system` para renderizar esos mismos snippets, con fixtures claramente identificadas y sin operaciones de compra, envío de formularios ni persistencia reales.

La aceptación requiere reducción efectiva de markup repetido en consumidores reales; añadir archivos sin integrarlos no satisface el ticket. No es requisito migrar cada instancia histórica del tema en este mismo cambio, pero las instancias aún no migradas deben distinguirse de las consolidadas.

Las recetas iniciales cubren ayuda/CTA de guía, formulario nativo de contacto, grupo FAQ, ordenación de búsqueda, grid de producto con `card-product` existente y estados sintéticos de la galería. El índice mantiene descubribles las 44 familias a través de sus fuentes actuales y clasifica cuáles ofrecen snippet, composición de sección o extracción pendiente. No promete 44 APIs nuevas.

Conservar schemas, settings, presets, traducciones y contratos JS/ARIA. Las secciones mantienen la obtención de datos y los estados de la operación. La galería demuestra presentación y controles locales, no certifica integraciones comerciales.

## Mantenimiento

Todo componente nuevo se documenta en el catálogo y el inventario en el mismo PR. Cambios de API, variantes, estados o consumidores actualizan su receta e índice. Se añaden componentes a medida que las funcionalidades los requieren.

Se pueden eliminar piezas cuyo desuso esté comprobado. La comprobación incluye Liquid, templates/grupos, editor, JS dinámico, fragmentos y apps; ausencia de referencia estática no basta. Cada retirada actualiza código, recetas y cobertura, con validación pertinente. Este diseño no declara piezas actualmente sin uso.

## Verificación y entrega

1. Establecer pruebas de los contratos y comportamiento actuales antes de extraer. Repetirlas después de cada frontera de extracción.
2. Pruebas de render Liquid para semántica de enlaces/botones, variantes admitidas, atributos nativos, escaping, IDs únicos y asociación label/ayuda/error. Probar datos omitidos y estados que cambian el comportamiento.
3. Pruebas de integración de consumidores: mismos nombres/valores del formulario, destinos, traducciones, settings y atributos del editor; errores y éxito dependen de la respuesta real entregada al consumidor.
4. Pruebas en navegador sobre fixtures renderizadas: teclado, foco, acordeón, disabled/loading pertinentes, textos largos y reflow móvil/desktop. Registrar qué es fixture y qué se verificó en Shopify; no equipararlos.
5. Theme Check, pruebas pertinentes del proyecto, cobertura/referencias del inventario y revisión independiente del diff. Sin nuevos paquetes salvo necesidad demostrada.
6. PR40 se entrega nuevamente a revisión humana con SHA, checks, ejemplos y limitaciones. LEM-142 permanece In Progress hasta entonces. Merge y publicación mantienen sus autorizaciones propias.

Las dependencias de checkout, recetas, catálogo y reglas comerciales siguen en sus tickets. No se modifica el checkout original del admin ni el servicio de desarrollo existente. No se publica un tema para demostrar este refactor sin autorización.

## Fuentes

- [Inventario y matriz de extracción](../../design/component-inventory.md).
- [Biblioteca y contratos existentes](../../design/component-library.md).
- [Contrato visual](../../../DESIGN.md).
- [Arquitectura de temas Shopify](https://shopify.dev/docs/storefronts/themes/architecture#directory-structure-and-component-types).
- [Snippets y LiquidDoc](https://shopify.dev/docs/storefronts/themes/architecture/snippets).

Context7 devolvió cuota mensual agotada al resolver Shopify; las restricciones de estructura y el uso de snippets se verificaron en estas fuentes oficiales.
