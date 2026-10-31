# Inventario técnico de componentes existentes — Lemoon

Este inventario localiza la UI del tema, sus implementaciones reutilizables y las oportunidades pendientes. El [catálogo operativo y las recetas](../components/README.md) muestran cómo usar las implementaciones canónicas; las familias que siguen siendo composiciones locales se identifican como tales. La guía de selección aprobada permanece en [component-library](component-library.md); el contrato visual sigue en [DESIGN.md](../../DESIGN.md), con [brand-guidelines](brand-guidelines.md) para uso de marca. No cambia identidad, fuentes, tokens, diseño ni comportamiento. LEM-80 fue cerrado por el usuario para identidad/fuentes actuales; variantes opcionales posteriores no reabren esa decisión.

<a id="evidence"></a>
## Evidencia y alcance

Base histórica del inventario inicial: `93f80a257924520020f0d960f89488c86f104a35`, rama `chore/lem-142-component-inventory`, 31-10-2026. Continúa LEM-132/PR #37 incorporado en esa base. El [JSON de cobertura](component-inventory.json) es el índice de rutas, IDs estables, método de inspección y consumidores estáticos; este documento contiene su interpretación técnica y las propuestas. [section-inventory](section-inventory.md) y [page-inventory](page-inventory.md) conservan el mapa de secciones y recorridos.

- **Actual:** snapshot de la implementación entregada en este PR, con seis snippets `lemoon-ui-*`, cuatro snippets de composición compartida y consumidores migrados. `7e437dc3b693a00aaa13c111c4df9e479b3d8af2` identifica la base previa a esta implementación, no su revisión entregada. El delta de fuentes nuevas se conserva en `snapshot.new_source_paths` del JSON como adiciones del PR, no como rutas sin seguimiento. Contratos y referencias actuales en JSON; estado por familia y recetas en el catálogo.
- **Histórico:** la enumeración inicial en `93f80a2` tenía 501 rutas, 470 mapped y 31 excluded. La lectura estructural por familia sigue siendo referencia de fuentes locales; las actualizaciones ejecutables que aparecen abajo sustituyen los candidatos de extracción ya implementados.
- **Pendiente:** otras oportunidades de consolidación, revisión final de estos metadatos y aceptación humana de la implementación. Los estados del catálogo no implican que las 44 familias se hayan reescrito.
- **Límites:** fuente/contratos estáticos y pruebas de fixtures no prueban CMS/asignación activa, valores efectivos, publicación, envío Shopify, APIs/stock/pagos, integración back office, WCAG ni aprobación visual. No se consultó Figma en esta actualización.

La cobertura actual enumera las 511 rutas de `git ls-files sections snippets layout templates blocks assets config locales`, incluidos los diez snippets añadidos por este PR; no quedan rutas explícitas fuera del índice Git. Docs, tests, herramientas y dependencias externas quedan fuera del universo de implementación. Cada ruta aparece una vez mapped o excluded; `direct_static_consumers` se recalcula con referencias literales entre fuentes actuales, sin inferir dependencia transitiva/dinámica ni uso efectivo. La síntesis por familia combina escaneo estructural con lectura dirigida; no afirma revisión manual de cada línea.

| Universo actual descubierto | Cantidad |
| --- | ---: |
| Secciones Liquid / grupos JSON | 68 / 2 |
| Snippets / layouts Liquid | 91 / 2 |
| Templates JSON / Liquid | 35 / 3 |
| Assets CSS / JS / SVG | 81 / 53 / 93 |
| Assets binarios PNG / JPG / GIF | 19 / 10 / 1 |
| Config schema / settings privados excluidos | 1 / 1 |
| Locales JSON (texto y schema) | 51 |
| **Total fuentes / mapped / excluded** | **511 / 480 / 31** |
| Familias estables | 44 |

El núcleo actual es de **332 fuentes**: 197 contenedores (secciones, grupos, snippets, layouts, templates), 134 assets CSS/JS y 1 schema global. Con 93 SVG y 51 locales se obtienen 476 mapped. Las exclusiones conservan 30 imágenes binarias y `config/settings_data.json`, **cuyo contenido no se lee**. Enumerar su ruta no implica acceso a sus valores. SVG/locales son cobertura textual, no revisión visual/editorial completa.

Hay **61 secciones con schema y 7 fragmentos sin schema**. Veintisiete secciones declaran **81 bloques: 73 declaraciones locales y 8 slots `@app`**; son declaraciones, no instancias ni tipos globales únicos. Los ocho sitios `{% render block %}` corresponden a apps. No hay archivos `blocks/`, ni infraestructura observada de theme blocks reutilizables mediante `content_for 'blocks'`. Los snippets composicionales y los bloques locales de sección no acreditan soporte de Shopify theme blocks. La matriz de secciones lista cada tipo; sus settings y opciones permanecen en el schema del archivo canónico enlazado, incluidas opciones no instanciadas en templates actuales.

<a id="reading"></a>
## Lectura y contratos compartidos

`classification` distingue **atom** (control/representación pequeña) y **compound** (agrupación o composición); `behavior` distingue **interactive** y **presentational**. Es una clasificación de inventario, no una afirmación de que ya exista un snippet por familia. Los IDs `LM-*` se mantienen aunque un futuro ticket renombre un archivo; no se crea un átomo por selector CSS. Una misma fuente puede servir varias familias.

Cada ficha identifica API actual, variantes, CSS/excepciones, siete estados, responsive, accesibilidad, JS y unidad de reutilización. “No aplica” significa que el estado no corresponde al elemento, no que se haya probado. Hover/focus de un control hijo no convierten en control su tarjeta o badge. “Según consumidor” conserva el contrato local: no promete que todas las instancias implementen cada estado.

Para valores y recetas usar [DESIGN §2–6](../../DESIGN.md#2-color), sin copiar una segunda paleta. Base normal: tokens → Dawn `base.css` → `lemoon-components.css` → estilos de superficie; password y gift card tienen cadenas distintas. Las excepciones locales se conservan, pero accesibilidad prevalece sobre un defecto legacy: el borde warm observado de campos no acredita la receta normativa de contorno/foco. Los tokens existentes de estado/capa no crean por sí solos variantes, toasts ni componentes nuevos.

Antes de extraer preservar `{% render %}` con inputs explícitos, locales, `section.id`, `product_form_id`, hidden inputs y names, hooks/data-*, IDs/ARIA, live regions, form associations y `block.shopify_attributes`. Los settings globales/objetos Shopify que todavía se usan implícitamente se documentan como deuda de contrato, sin fingir APIs puras. **Cart/payment/product-form, resolución de variantes, receta, consentimiento y elegibilidad comercial permanecen fuera de los átomos visuales.**

### Mantenimiento del inventario

Todo componente nuevo —atómico o compuesto, interactivo o presentacional— debe documentarse en este inventario **en el mismo PR que lo incorpora**, respetando las convenciones de alcance, clasificación e IDs anteriores. Al modificar o retirar componentes, mantener consistentes sus contratos, consumidores, variantes, estados y accesibilidad con el [índice JSON](component-inventory.json), su cobertura y referencias.

Un componente cuyo desuso esté comprobado puede retirarse del código y del inventario activo mediante un cambio acotado y revisado. Antes de retirarlo, verificar consumidores reales en Liquid (`render`, secciones, layouts y templates), grupos de secciones, editor del tema, JS dinámico, API de fragmentos y apps. La ausencia de referencias estáticas o de template por sí sola no demuestra desuso; si el uso no está confirmado, conservar el componente y registrar la verificación pendiente. Tras una retirada, actualizar cobertura y referencias tanto en Markdown como en JSON para que reflejen el código resultante.

Se pueden incorporar componentes según las necesidades de cada funcionalidad; la completitud del catálogo no obliga a conservar legacy cuyo desuso esté comprobado. Esta política no declara ningún componente actual en desuso ni ejecuta eliminaciones, refactors o cambios de runtime.

<a id="families"></a>
## Índice de familias

| ID | Familia | Estructura / comportamiento |
| --- | --- | --- |
| [LM-SHELL](#lm-shell) | Shell, contenedores e integración | compound / presentational |
| [LM-TYPE](#lm-type) | Tipografía y texto enriquecido | atom / presentational |
| [LM-ACTION](#lm-action) | Botones, enlaces y acciones de icono | atom / interactive |
| [LM-ICON](#lm-icon) | Familias de iconos, formas y marcas | atom / presentational |
| [LM-FIELD](#lm-field) | Campos, textarea y select | atom / interactive |
| [LM-CHOICE](#lm-choice) | Checkbox, radio y opciones visuales | atom / interactive |
| [LM-SWATCH](#lm-swatch) | Swatches de color y selección | atom / interactive |
| [LM-RANGE](#lm-range) | Rangos y cantidades | compound / interactive |
| [LM-LABEL](#lm-label) | Badges, chips e indicadores | atom / presentational |
| [LM-PRICE](#lm-price) | Precio, moneda, totales y rating | atom / presentational |
| [LM-PRODUCT-CARD](#lm-product-card) | Tarjeta de producto | compound / interactive |
| [LM-CONTENT-CARD](#lm-content-card) | Tarjetas de colección, artículo y resultado CMS | compound / presentational |
| [LM-NAV](#lm-nav) | Breadcrumb y paginación | compound / interactive |
| [LM-FEEDBACK](#lm-feedback) | Alertas, loading y estados vacíos | compound / presentational |
| [LM-DISCLOSURE](#lm-disclosure) | Accordions, disclosures y FAQ | compound / interactive |
| [LM-OVERLAY](#lm-overlay) | Modales, drawers y popovers | compound / interactive |
| [LM-TABS](#lm-tabs) | Tabs y guía de medidas | compound / interactive |
| [LM-SLIDER](#lm-slider) | Carruseles, slideshow y controles | compound / interactive |
| [LM-MEDIA](#lm-media) | Media responsive, galerías y vídeo | compound / interactive |
| [LM-FACET](#lm-facet) | Filtros, chips activos y sorting | compound / interactive |
| [LM-SEARCH](#lm-search) | Búsqueda y predictive search | compound / interactive |
| [LM-MOBILE-SEARCH](#lm-mobile-search) | Overlay de búsqueda Lemoon | compound / interactive |
| [LM-HEADER](#lm-header) | Header, menús y localización | compound / interactive |
| [LM-MOBILE-NAV](#lm-mobile-nav) | Navegación móvil por niveles | compound / interactive |
| [LM-FOOTER](#lm-footer) | Footer, newsletter, ayuda y pagos | compound / interactive |
| [LM-PRIVACY](#lm-privacy) | Preferencias de cookies | compound / interactive |
| [LM-HERO](#lm-hero) | Hero y anuncios | compound / interactive |
| [LM-EDITORIAL](#lm-editorial) | Composiciones editoriales y home | compound / presentational |
| [LM-PRODUCT-LIST](#lm-product-list) | Listados y recomendaciones de producto | compound / interactive |
| [LM-PLP](#lm-plp) | Colección y PLP | compound / interactive |
| [LM-PDP](#lm-pdp) | PDP estándar y óptica | compound / interactive |
| [LM-PURCHASE](#lm-purchase) | Formulario de compra y destinatario | compound / interactive |
| [LM-CONFIG](#lm-config) | Configurador de lentes y receta | compound / interactive |
| [LM-CART](#lm-cart) | Carrito, drawer y notificación | compound / interactive |
| [LM-BULK](#lm-bulk) | Pedidos rápidos y volumen | compound / interactive |
| [LM-PICKUP](#lm-pickup) | Disponibilidad de retiro | compound / interactive |
| [LM-CONTACT](#lm-contact) | Contacto y grupos de formulario | compound / interactive |
| [LM-LEGAL](#lm-legal) | Páginas legales, guías y servicios | compound / presentational |
| [LM-JOURNAL](#lm-journal) | Blog, artículo, comentarios y compartir | compound / interactive |
| [LM-QUIZ](#lm-quiz) | Quiz de estilo | compound / interactive |
| [LM-GIFT](#lm-gift) | Compra y visualización de gift card | compound / interactive |
| [LM-PASSWORD](#lm-password) | Password, lanzamiento y newsletter banner | compound / interactive |
| [LM-UTILITY](#lm-utility) | 404, contenido personalizado y apps | compound / presentational |
| [LM-GALLERY](#lm-gallery) | Galería existente del sistema de diseño | compound / presentational |

## Fichas de fuente

Las fichas conservan la lectura dirigida de superficies en la base histórica, con disponibilidad y fuentes nuevas reconciliadas. Para las extracciones reutilizables, la [actualización ejecutable](#actualización-ejecutable-lem-142), LiquidDoc y recetas sustituyen los candidatos históricos; conservar el comportamiento y límites de los demás dueños.

<a id="lm-shell"></a>
### LM-SHELL · Shell, contenedores e integración

**Disponibilidad actual:** composición de sección. Entrada: [theme.liquid](../../layout/theme.liquid). Preservar el orden de assets y los grupos; no renderizar un layout dentro de otra sección. [Receta de integración](../components/recipes/guide-help.md).

**Fuentes:** [layout/theme.liquid](../../layout/theme.liquid), [layout/password.liquid](../../layout/password.liquid), [snippets/meta-tags.liquid](../../snippets/meta-tags.liquid), [assets/base.css](../../assets/base.css), [assets/lemoon-tokens.css](../../assets/lemoon-tokens.css), [assets/lemoon-components.css](../../assets/lemoon-components.css), [assets/animations.js](../../assets/animations.js), [assets/constants.js](../../assets/constants.js), [assets/pubsub.js](../../assets/pubsub.js), [assets/theme-editor.js](../../assets/theme-editor.js), [assets/standard-actions-override.js](../../assets/standard-actions-override.js), [config/settings_schema.json](../../config/settings_schema.json).

**Contrato actual.** Layout consume request.page_type, settings, content_for_header/layout y grupos header/footer; settings_schema declara opciones, no valores efectivos. Meta tags usa page_title, page_description, canonical_url y media. standard-actions-override redefine openCart/updateCart de Shopify.actions y refresca secciones con deduplicación/pubsub; conservar ese acoplamiento comercial.

**Variantes existentes.** Storefront normal; policy con shell de ayuda; cart con CSS local; password con cadena CSS distinta.

**CSS y excepciones.** Orden normal: tokens, base Dawn, componentes Lemoon, estilos por superficie. Password carga tokens y lemoon-password, NO lemoon-components. .page-width, .grid, .rte, .visually-hidden y helpers de foco no son snippets. DESIGN gobierna tipografía, gutter y motion; no duplicar paleta.

**Estados observados / aplicabilidad:** Normal: Contenido y slots; Hover: Solo hijos accionables; Foco: Skip link y helpers heredados; Seleccionado: No aplica; Loading: Carga de recursos; no spinner de shell; Error: Errores pertenecen a contenido; Disabled: No aplica.

**Responsive.** 750/990/1280 según helper; respetar cambios locales y reduced-motion. **Accesibilidad.** Conservar skip-to-content, MainContent, regiones live, orden de lectura y shopify:section:*; revisión estática no prueba accesibilidad.

**JS.** global.js, pubsub/constants, scripts condicionales de layout y editor; no asumir que todos se cargan en password. **Reutilización actual.** Layouts compartidos; CSS global con overrides y código condicional. No extraer un mega componente de página.

**Dependencias de composición:** ninguna familia adicional; consumidores estáticos en el JSON.

<a id="lm-type"></a>
### LM-TYPE · Tipografía y texto enriquecido

**Disponibilidad actual:** reutilizable. Entrada: [lemoon-ui-heading.liquid](../../snippets/lemoon-ui-heading.liquid). Heading semántico; richtext conserva su dueño y las excepciones tipográficas locales. [Receta de integración](../components/recipes/guide-help.md).

**Fuentes:** [assets/base.css](../../assets/base.css), [assets/lemoon-components.css](../../assets/lemoon-components.css), [assets/lemoon-tokens.css](../../assets/lemoon-tokens.css), [sections/rich-text.liquid](../../sections/rich-text.liquid), [sections/main-page.liquid](../../sections/main-page.liquid), [sections/page.liquid](../../sections/page.liquid), [assets/section-rich-text.css](../../assets/section-rich-text.css), [assets/section-main-page.css](../../assets/section-main-page.css), [lemoon-ui-heading](../../snippets/lemoon-ui-heading.liquid).

**Contrato de superficie.** h1–h6 y .h0–.h5 son selectores; `lemoon-ui-heading` aporta la API explícita de título. rich-text usa bloques heading/caption/text/button; main-page usa page.title/content; page usa section.settings.page y heading_size.

**Variantes existentes.** Display, headings, body, caption, label, CTA, rte; ancho narrow/full según consumidor.

**CSS y excepciones.** --lemoon-font-heading/body y --lemoon-type-*; H4/H5 conservan base Dawn. Tamaños de nombres/precios de tarjeta y legal son excepciones, no nuevos roles globales.

**Estados observados / aplicabilidad:** Normal: Texto; Hover: Enlaces dentro de rte; Foco: Solo enlaces/controles; Seleccionado: No aplica; Loading: No aplica; Error: Texto de mensaje en su familia; Disabled: No aplica.

**Responsive.** Escala móvil <750; padding de sección según schema/template. **Accesibilidad.** Nivel semántico independiente de clase visual; preservar links, listas, tablas y contenido CMS sin reinterpretar headings.

**JS.** No controlador tipográfico. **Reutilización actual.** `lemoon-ui-heading` en guía, contacto, FAQ agrupado/legacy, shell legal y galería; las clases y wrappers conservan su dueño local.

**Dependencias de composición:** [LM-SHELL](#lm-shell). Consumidores estáticos en el JSON.

<a id="lm-action"></a>
### LM-ACTION · Botones, enlaces y acciones de icono

**Disponibilidad actual:** reutilizable. Entrada: [lemoon-ui-action.liquid](../../snippets/lemoon-ui-action.liquid). Base o local; compra mantiene sus adaptadores y formulario nativo. [Receta de integración](../components/recipes/guide-help.md).

**Fuentes:** [assets/base.css](../../assets/base.css), [assets/lemoon-components.css](../../assets/lemoon-components.css), [snippets/lemoon-frame-only-button.liquid](../../snippets/lemoon-frame-only-button.liquid), [snippets/lemoon-select-lenses-button.liquid](../../snippets/lemoon-select-lenses-button.liquid), [snippets/lemoon-thumbnail-arrow.liquid](../../snippets/lemoon-thumbnail-arrow.liquid), [snippets/lemoon-carousel-controls.liquid](../../snippets/lemoon-carousel-controls.liquid), [lemoon-ui-action](../../snippets/lemoon-ui-action.liquid).

**Contrato actual.** Base CSS no tiene snippet de botón genérico. button[type=submit/button] actúa; a[href] navega. frame-only recibe context(form/eyewear), disabled, section_id, button_class; select-lenses recibe context(link/eyewear/sticky), product, disabled. Estos dos son adaptadores comerciales, no átomos genéricos. carousel-controls recibe carousel_id.

**Variantes existentes.** Filled=.button; outline/secondary=.button--secondary con base Dawn; ghost/tertiary=.button--tertiary; texto=.link/.link--text/.underlined-link y .lemoon-pdp__text-button locales; icono=botones header, thumbnail, carousel y cierres. Accent del demo es local; no clase global destructive/accent aprobada.

**CSS y excepciones.** --lemoon-action-primary/primary-hover, --lemoon-text-inverse/brand, --lemoon-radius-button, --lemoon-size-control/touch; pseudo-bordes Dawn en secondary. Tamaños quick-add, arrows, header y text-button son excepciones locales.

**Estados observados / aplicabilidad:** Normal: Label y type/href del consumidor; Hover: Primary/secondary/tertiary según CSS; iconos locales; Foco: :focus-visible/.focused Dawn y reglas locales; no anillo universal supuesto; Seleccionado: aria-pressed solo en toggle/favorito; no en todo botón; Loading: .loading + spinner y guard del formulario; Error: Mensaje del formulario; no estado error universal de botón; Disabled: disabled nativo; enlace de lentes sin href con aria-disabled y tabindex=-1.

**Responsive.** Base 48px ≥750 y 44px <750; no imponer esa caja a todos los iconos sin revisar target. **Accesibilidad.** Conservar nombre accesible, type, form, IDs, ARIA, data-*; un enlace sin href no obtiene semántica disabled por CSS.

**JS.** Ninguno para estilo base; handlers pertenecen al consumidor, nunca al átomo visual. **Reutilización actual.** `lemoon-ui-action` presenta acciones base/local en guía/contacto/FAQ/galería, newsletter footer y ayuda legal, más submit input de comentarios; los adaptadores comerciales compartidos conservan sus hooks y lógica.

**Dependencias de composición:** [LM-ICON](#lm-icon). Consumidores estáticos en el JSON.

<a id="lm-icon"></a>
### LM-ICON · Familias de iconos, formas y marcas

**Disponibilidad actual:** reutilizable. Entrada: [lemoon-icon.liquid](../../snippets/lemoon-icon.liquid). icon/size/label; geometría FAQ y marca conservan sus archivos propios. [Receta de integración](../components/recipes/catalogue-states.md).

**Fuentes:** [snippets/lemoon-icon.liquid](../../snippets/lemoon-icon.liquid), [snippets/lemoon-frame-shape.liquid](../../snippets/lemoon-frame-shape.liquid), [snippets/lemoon-purchase-step-icon.liquid](../../snippets/lemoon-purchase-step-icon.liquid), [snippets/icon-accordion.liquid](../../snippets/icon-accordion.liquid), [snippets/icon-with-text.liquid](../../snippets/icon-with-text.liquid), [snippets/social-icons.liquid](../../snippets/social-icons.liquid).

**Contrato actual.** lemoon-icon: icon,size(default24),label opcional; case interno SVG lineal, no dependencia Lucide instalada en runtime. frame-shape: shape; purchase-step-icon: icon; icon-accordion: icon; icon-with-text: block; social-icons: class y settings de redes. Nombres exactos de cases en el snippet enlazado; rutas de todos los assets en el JSON.

**Variantes existentes.** Lucide-like local; Dawn icon-*.svg inline; formas de armazón; pictogramas de compra; logos/redes/pagos locales o Shopify. No unificar trazos automáticamente.

**CSS y excepciones.** currentColor y tamaños locales; lemoon-icon stroke-width=1.5 y viewBox24. SVG de marca conserva fill/proporción; dibujos con medidas no son iconos de acción.

**Estados observados / aplicabilidad:** Normal: SVG/imagen; Hover: Depende del control padre; Foco: Depende del control padre; Seleccionado: Depende del control padre; Loading: Spinner separado; Error: Icono complementa texto; Disabled: Depende del control padre.

**Responsive.** Tamaño por prop/selector; el área clicable pertenece al control. **Accesibilidad.** lemoon-icon con label usa role=img/aria-label; sin label aria-hidden y focusable=false. Conservar texto oculto de botones Dawn.

**JS.** No necesita biblioteca JS de iconos. **Reutilización actual.** Snippets ya reutilizables, SVG assets y SVG inline duplicados; preservar familias antes de consolidar.

**Dependencias de composición:** ninguna familia adicional; consumidores estáticos en el JSON.

<a id="lm-field"></a>
### LM-FIELD · Campos, textarea y select

**Disponibilidad actual:** reutilizable. Entrada: [lemoon-ui-field.liquid](../../snippets/lemoon-ui-field.liquid). Input/textarea; lemoon-ui-select para select. Labels, IDs y error explícitos. [Receta de integración](../components/recipes/contact-form.md).

**Fuentes:** [assets/base.css](../../assets/base.css), [assets/lemoon-components.css](../../assets/lemoon-components.css), [assets/section-contact-form.css](../../assets/section-contact-form.css), [snippets/price-facet.liquid](../../snippets/price-facet.liquid), [lemoon-ui-field](../../snippets/lemoon-ui-field.liquid), [lemoon-ui-select](../../snippets/lemoon-ui-select.liquid).

**Contrato actual.** field/field__input/field__label y select/select__select son contratos de clases, con id/name/value/type/autocomplete/required del formulario. textarea usa text-area; price-facet recibe filter y id_prefix, campos numéricos relacionados con price-range. Límites de cada campo permanecen en su fuente canónica; el inventario no reescribe esas constraints.

**Variantes existentes.** Text/email/tel/number/date/file/password/search, textarea y select nativos según fuente; floating labels Dawn y labels persistentes locales no son el mismo markup.

**CSS y excepciones.** --lemoon-size-control, --lemoon-radius-sm, --lemoon-font-body, --lemoon-text-primary/secondary. Legacy .field:after warm; foco box-shadow strong. Receta normativa DESIGN §5 exige delimitación strong cuando corresponda y anillo separado. Los controles UI de contacto/búsqueda/colección/facets/galería/newsletter footer/comentarios aplican esa corrección scoped; los campos legacy restantes conservan deuda.

**Estados observados / aplicabilidad:** Normal: Valor/placeholder y label; Hover: Reglas locales de contorno; Foco: :focus-visible/:focus-within observado; deuda legacy documentada; Seleccionado: Selección nativa select; Loading: No loading universal de campo; Error: aria-invalid/describedby según formulario; no todas las instancias lo traen; Disabled: disabled nativo donde existe.

**Responsive.** 48px base, textarea auto; columnas del formulario apilan según superficie. **Accesibilidad.** Preservar label-for, hint/error IDs, inputmode, min/max/step y constraints; no copiar defecto de borde al extraer.

**JS.** Validación y serialización del formulario; no agregar JS al campo base. **Reutilización actual.** `lemoon-ui-field` y `lemoon-ui-select` cubren contacto/búsqueda/colección/facets/galería/newsletter footer/comentarios; formularios, IDs y feedback permanecen en sus dueños. Receta/gift conservan sus contratos locales.

**Dependencias de composición:** [LM-TYPE](#lm-type). Consumidores estáticos en el JSON.

<a id="lm-choice"></a>
### LM-CHOICE · Checkbox, radio y opciones visuales

**Disponibilidad actual:** extracción pendiente. Entrada: [product-variant-options.liquid](../../snippets/product-variant-options.liquid). Opciones de variante conservan sus nombres, selección y disponibilidad; no hay radio genérico extraído. [Receta de integración](../components/recipes/product-card-grid.md).

**Fuentes:** [assets/base.css](../../assets/base.css), [assets/component-product-variant-picker.css](../../assets/component-product-variant-picker.css), [assets/component-facets.css](../../assets/component-facets.css), [snippets/product-variant-options.liquid](../../snippets/product-variant-options.liquid).

**Contrato actual.** input checkbox/radio nativo con name/value/checked/disabled, label y fieldset/legend. product-variant-options recibe product, option, block, picker_type; availability y option_value.id/URL son datos del producto.

**Variantes existentes.** Checkbox de facets y consentimiento; radio pill producto; choice cards de quiz/gift/configuración; selección no equivale a stock confirmado.

**CSS y excepciones.** Base Dawn y CSS local; --lemoon-action-primary/--lemoon-border-strong donde referenciados; cajas de quiz/lentes conservan radio y padding propios.

**Estados observados / aplicabilidad:** Normal: Unchecked/unselected; Hover: Label local; Foco: Input focus-visible con label asociado; Seleccionado: :checked/.is-selected/aria-selected según superficie; Loading: Solo al actualizar producto/facets; Error: Mensaje del grupo cuando implementado; Disabled: disabled o visually-disabled distintos: no reemplazar uno por otro.

**Responsive.** Grid/wrap local, sin tamaño único para toda elección. **Accesibilidad.** Conservar radio group, legend, input habilitado aunque visualmente no disponible cuando el controlador así lo exige.

**JS.** variant-selects/product-info o formulario propietario; selección visual no calcula variante. **Reutilización actual.** Markup local repetido; factorizar envoltorio visual solo tras separar dominio de selección.

**Dependencias de composición:** [LM-FIELD](#lm-field). Consumidores estáticos en el JSON.

<a id="lm-swatch"></a>
### LM-SWATCH · Swatches de color y selección

**Disponibilidad actual:** reutilizable. Entrada: [swatch-input.liquid](../../snippets/swatch-input.liquid). SwatchDrop y formulario real; swatch visual separado de la opción interactiva. [Receta de integración](../components/recipes/product-card-grid.md).

**Fuentes:** [snippets/swatch.liquid](../../snippets/swatch.liquid), [snippets/swatch-input.liquid](../../snippets/swatch-input.liquid), [snippets/lemoon-color-swatch.liquid](../../snippets/lemoon-color-swatch.liquid), [assets/component-swatch.css](../../assets/component-swatch.css), [assets/component-swatch-input.css](../../assets/component-swatch-input.css).

**Contrato actual.** swatch: swatch,shape; swatch-input: id,type(default radio),name,value,swatch,product_form_id,checked,disabled,visually_disabled,shape,help_text,additional_props. lemoon-color-swatch: value (option value); usa swatch nativo o fallback por nombre.

**Variantes existentes.** Circular/square; imagen/color Shopify; fallback textual azul/carey/negro/dorado/plateado/transparente; tarjeta usa botones y PDP radio, no misma semántica.

**CSS y excepciones.** --swatch--background/focal-point/tamaño locales; fallback tiene literales #D9D4CB, #172B4D, #9B612F, #222222, #C6A15B, #A8ADB1, #E9E6E0: datos visuales de color, no nueva paleta de marca.

**Estados observados / aplicabilidad:** Normal: Muestra; Hover: Borde local en control; Foco: Foco input o botón del consumidor; Seleccionado: checked o .is-selected; Loading: Cambio de media de tarjeta: controlador; Error: No error propio del swatch; Disabled: disabled real/visually-disabled según API.

**Responsive.** Wrap y tamaño por tarjeta/PDP; target ampliado es futura verificación. **Accesibilidad.** Conservar label accesible y texto de color; no depender solo del fill.

**JS.** lemoon-product-card.js / variant-selects / lemoon-eyewear-product.js según consumidor. **Reutilización actual.** Swatch visual ya compartido; adaptadores de botón y radio se retienen separados.

**Dependencias de composición:** [LM-CHOICE](#lm-choice). Consumidores estáticos en el JSON.

<a id="lm-range"></a>
### LM-RANGE · Rangos y cantidades

**Disponibilidad actual:** reutilizable. Entrada: [quantity-input.liquid](../../snippets/quantity-input.liquid). Cantidad y lemoon-price-slider son contratos distintos; mantener límites y controladores del dueño. [Receta de integración](../components/recipes/product-card-grid.md).

**Fuentes:** [snippets/lemoon-price-slider.liquid](../../snippets/lemoon-price-slider.liquid), [snippets/quantity-input.liquid](../../snippets/quantity-input.liquid), [snippets/progress-bar.liquid](../../snippets/progress-bar.liquid), [assets/component-progress-bar.css](../../assets/component-progress-bar.css), [assets/quantity-popover.css](../../assets/quantity-popover.css), [assets/quantity-popover.js](../../assets/quantity-popover.js).

**Contrato actual.** Precio recibe filter,id_prefix; dos range min/max, outputs y hidden params Shopify, step=1000 y máximo redondeado. quantity-input recibe variant,variant_id,min y usa cart item_count, quantity_rule min/max/increment; progress-bar es visual sin props. No intercambiar quantity y price-range.

**Variantes existentes.** Doble rango precio; alternativa price-facet numérica; quantity con +/-; popover de reglas; progreso bulk.

**CSS y excepciones.** --price-start/end calculados; quantity y popover Dawn; estilos slider precio en CSS PLP/facets. Sin regla monetaria nueva.

**Estados observados / aplicabilidad:** Normal: Límites/valor actuales; Hover: Handles y +/- locales; Foco: Ranges e input teclado; Seleccionado: Valores sincronizados; Loading: Progreso bulk/spinner por operación; Error: Errores stock/cantidad del carrito; Disabled: Botones por límite y ranges disabled si máximo0.

**Responsive.** Precio sidebar/drawer; cantidad tabla/carrito con reglas locales. **Accesibilidad.** Conservar labels From/To, outputs, min/max/step, teclado y nombres updates[variant_id]; no requerir arrastre.

**JS.** facets.js PriceRange; global.js QuantityInput; quantity-popover.js y bulk/cart según uso. **Reutilización actual.** Snippets existentes; markup quantity también inline en PDP/carrito: no homogeneizar reglas comerciales.

**Dependencias de composición:** [LM-FIELD](#lm-field), [LM-ACTION](#lm-action). Consumidores estáticos en el JSON.

<a id="lm-label"></a>
### LM-LABEL · Badges, chips e indicadores

**Disponibilidad actual:** reutilizable. Entrada: [lemoon-product-card-labels.liquid](../../snippets/lemoon-product-card-labels.liquid). Labels derivados del producto; no convertir chips o badges de demo en flags comerciales. [Receta de integración](../components/recipes/product-card-grid.md).

**Fuentes:** [snippets/lemoon-product-card-labels.liquid](../../snippets/lemoon-product-card-labels.liquid), [snippets/lemoon-product-status.liquid](../../snippets/lemoon-product-status.liquid), [snippets/lemoon-product-promotions.liquid](../../snippets/lemoon-product-promotions.liquid), [assets/component-discounts.css](../../assets/component-discounts.css).

**Contrato actual.** Card labels: card_product,section_id; tags normalizados, máximo3 con reserva sold-out. PDP status: product.selected_or_first_available_variant. Promotions: shop.metafields.lemoon.pdp_promotions.value; filtra ACTIVE, fechas, primera compra/customer.orders_count y collection_ids; solo contrato leído, ningún registro cliente consultado.

**Variantes existentes.** new/flash-sale/best-seller/bestseller/sold-out; badge genérico; estado sale PDP por compare_at; descuentos cart. Chip removible pertenece a LM-FACET.

**CSS y excepciones.** Pill producto frente a badge Dawn; tokens primary/accent/green-deep y excepción peach local bestseller (#F3D4C4 en CSS). Promoción de tag no prueba descuento.

**Estados observados / aplicabilidad:** Normal: Texto/stock/tag; Hover: No aplica al badge informativo; Foco: No aplica; Seleccionado: No aplica; Loading: No aplica; Error: No aplica; error es feedback; Disabled: No aplica.

**Responsive.** Wrap; límite de etiquetas evita cubrir producto, no prueba visual. **Accesibilidad.** No tabindex al badge; conservar sold-out ID que card referencia y texto significativo.

**JS.** product-info/eyewear actualizan estado PDP, no promoción comercial del átomo. **Reutilización actual.** Snippets reutilizados; promoción comercial permanece aislada de badge visual.

**Dependencias de composición:** [LM-TYPE](#lm-type). Consumidores estáticos en el JSON.

<a id="lm-price"></a>
### LM-PRICE · Precio, moneda, totales y rating

**Disponibilidad actual:** reutilizable. Entrada: [price.liquid](../../snippets/price.liquid). Producto/variante y lemoon-money; no calcular precios en átomos de presentación. [Receta de integración](../components/recipes/product-card-grid.md).

**Fuentes:** [snippets/price.liquid](../../snippets/price.liquid), [snippets/lemoon-money.liquid](../../snippets/lemoon-money.liquid), [snippets/unit-price.liquid](../../snippets/unit-price.liquid), [assets/component-price.css](../../assets/component-price.css), [assets/component-totals.css](../../assets/component-totals.css), [assets/component-rating.css](../../assets/component-rating.css), [assets/component-volume-pricing.css](../../assets/component-volume-pricing.css), [assets/price-per-item.js](../../assets/price-per-item.js). [snippets/lemoon-product-unit-price.liquid](../../snippets/lemoon-product-unit-price.liquid), [snippets/lemoon-cart-tax-note.liquid](../../snippets/lemoon-cart-tax-note.liquid).

**Contrato actual.** price: product,placeholder,use_variant,show_badges,price_class,show_compare_at_price; también usa settings.currency_code_enabled. lemoon-money: amount,show_currency_code; unit-price: price,measurement,hide_accessibility_label opcional. Ratings usan metafields reviews.rating/rating_count en consumidores, no snippet rating. price-per-item calcula presentación de quantity breaks de variante.

**Variantes existentes.** Regular/sale/from/compare-at/unit-price/volume y total cart; rating estrellas/fracción; no generar precio o reseña de ejemplo como real.

**CSS y excepciones.** --lemoon-text-brand/font-heading/weight-semibold; CSS card/PLP sobrescribe precio/nombre; rating Dawn --rating-* y estrellas; no extraer fórmula de negocio a CSS.

**Estados observados / aplicabilidad:** Normal: Valor fuente; Hover: No aplica al texto; enlaces de rating según PDP; Foco: Solo si enlace de reseñas; Seleccionado: No aplica; Loading: Consumidor actualiza por variante/cart; Error: No error visual monetario universal; Disabled: No aplica al precio.

**Responsive.** Precio local de card/PLP diferente de PDP; evitar imponer H3. **Accesibilidad.** Conservar texto regular/sale oculto, s para anterior, moneda/unidad y labels de rating.

**JS.** price-per-item y actualizaciones de producto/cart; display Liquid por defecto. **Reutilización actual.** price/money/unit-price compartidos; prices inline óptica/gift/quiz/cart son duplicación parcial con dominios distintos.

**Dependencias de composición:** [LM-TYPE](#lm-type), [LM-LABEL](#lm-label). Consumidores estáticos en el JSON.

<a id="lm-product-card"></a>
### LM-PRODUCT-CARD · Tarjeta de producto

**Disponibilidad actual:** reutilizable. Entrada: [card-product.liquid](../../snippets/card-product.liquid). card_product y section_id reales; media, precio y JS juntos. [Receta de integración](../components/recipes/product-card-grid.md).

**Fuentes:** [snippets/card-product.liquid](../../snippets/card-product.liquid), [assets/component-card.css](../../assets/component-card.css), [assets/lemoon-product-card.js](../../assets/lemoon-product-card.js), [assets/quick-add.css](../../assets/quick-add.css), [assets/mask-blobs.css](../../assets/mask-blobs.css). [snippets/lemoon-carousel-results.liquid](../../snippets/lemoon-carousel-results.liquid).

**Contrato actual.** card_product,media_aspect_ratio,image_shape,show_secondary_image,show_vendor,show_rating,extend_height,lazy_load,skip_styles,section_id,show_quick_add,horizontal_class,placeholder_image; además enable_gallery_swipe y product_view_context usados en código aunque no en comentario API. Producto/variantes/media/settings son entradas de dominio.

**Variantes existentes.** Normal/placeholder; media secundaria; color swatches; quick-add; horizontal; masks heredadas. Quick-add se renderiza con show_quick_add y card_product.available; usa selected_or_first_available_variant, quantity=1 y botón disabled si variante no disponible. No hay guard requires_selling_plan en este snippet: limitación a revisar antes de ampliar.

**CSS y excepciones.** Outer transparente radio0; media warm radio local12 y ratio100/96, contain; máximo local280px ≥990. Tipografía PLP sobrescribe base. Try-on/favorito son controles de superficie, no prueba de servicio.

**Estados observados / aplicabilidad:** Normal: Producto y precio; Hover: Media secundaria solo cuando lista; Foco: Links, swatches, quick-add; Seleccionado: Swatch .is-selected actualiza links/imagen/id; Loading: Lazy media y product-form spinner; Error: Quick-add monta product-form con data-hide-errors="true" y sin wrapper de mensaje de error; product-form procesa/publica cartError y despacha el evento de error, pero el feedback inline de esta tarjeta está suprimido y esta revisión de fuentes no establece recuperación visible en la tarjeta; imagen secundaria fallida conserva frontal según controlador; Disabled: Quick-add unavailable/stock; no deshabilitar enlace al producto.

**Responsive.** Grid consumidor; swipe opcional; card local overrides 750/990. **Accesibilidad.** Preservar enlaces, title/label IDs, sold-out labels, product-component tracking, labels de color y ARIA.

**JS.** lemoon-product-card.js + product-form.js si quick-add; localStorage favoritos y pointer/swipe según código. **Reutilización actual.** Snippet canónico ya existente: reutilizarlo; no reemplazar con tarjeta demo ni extraer compra a átomo.

**Dependencias de composición:** [LM-PRICE](#lm-price), [LM-LABEL](#lm-label), [LM-SWATCH](#lm-swatch), [LM-ACTION](#lm-action), [LM-FEEDBACK](#lm-feedback). Consumidores estáticos en el JSON.

<a id="lm-content-card"></a>
### LM-CONTENT-CARD · Tarjetas de colección, artículo y resultado CMS

**Disponibilidad actual:** reutilizable. Entrada: [main-search-result-card.liquid](../../snippets/main-search-result-card.liquid). Resultado CMS, article-card y card-collection mantienen APIs diferentes. [Receta de integración](../components/recipes/search-sort.md).

**Fuentes:** [snippets/card-collection.liquid](../../snippets/card-collection.liquid), [snippets/article-card.liquid](../../snippets/article-card.liquid), [snippets/main-search-result-card.liquid](../../snippets/main-search-result-card.liquid), [assets/component-article-card.css](../../assets/component-article-card.css).

**Contrato actual.** collection: card_collection,media_aspect_ratio,columns,extend_height,wrapper_class,placeholder_image. article: blog,article,media_aspect_ratio,media_height,show_image/date/author/badge,lazy_load,image_sizes; usa además section/settings. Resultado search delega product/article o enlace page según result.object_type.

**Variantes existentes.** Colección con/sin media; artículo con fecha/autor/excerpt y badge; resultado página sin media.

**CSS y excepciones.** .card--standard/card, ratio y color schemes Dawn; excepciones editoriales locales en blog/article CSS.

**Estados observados / aplicabilidad:** Normal: Contenido y enlace; Hover: Underline/media hover; Foco: Enlace enfocable; Seleccionado: No aplica; Loading: Media lazy; Error: No feedback propio; Disabled: No aplica.

**Responsive.** Columnas/image_sizes por consumidor; no dimensión fija de frame. **Accesibilidad.** Preservar heading y relación del enlace; alt con fallback; no convertir wrapper en botón.

**JS.** No controlador propio; animaciones del shell cuando habilitadas. **Reutilización actual.** Snippets canónicos collection/article; resultado page tiene markup local retenido.

**Dependencias de composición:** [LM-TYPE](#lm-type), [LM-ICON](#lm-icon). Consumidores estáticos en el JSON.

<a id="lm-nav"></a>
### LM-NAV · Breadcrumb y paginación

**Disponibilidad actual:** reutilizable. Entrada: [pagination.liquid](../../snippets/pagination.liquid). paginate real; breadcrumb tiene contrato propio, no navegación universal. [Receta de integración](../components/recipes/search-sort.md).

**Fuentes:** [snippets/lemoon-breadcrumb.liquid](../../snippets/lemoon-breadcrumb.liquid), [snippets/pagination.liquid](../../snippets/pagination.liquid), [assets/component-pagination.css](../../assets/component-pagination.css).

**Contrato actual.** Breadcrumb consume collection,product y request.page_type; elige primera colección no-frontpage si falta contexto PDP. pagination recibe paginate,anchor; usa parts/current/previous/next.

**Variantes existentes.** Ruta home/colección/producto; página actual, links prev/next y ellipsis.

**CSS y excepciones.** .lemoon-breadcrumb en estilos PDP/PLP; .pagination y CSS Dawn, sin inventar wrapper común.

**Estados observados / aplicabilidad:** Normal: Ruta o página actual; Hover: Enlaces; Foco: Enlaces; Seleccionado: aria-current page; Loading: AJAX del consumidor, no pager por sí solo; Error: No error propio; Disabled: Partes no link y límites de paginación no son botones disabled.

**Responsive.** Wrap y espaciado local; ancho de viewport gobierna pager. **Accesibilidad.** Preservar nav aria-label, current page y anchors reales de paginación.

**JS.** Paginación nativa; facets/PLP pueden interceptar según superficie. **Reutilización actual.** Snippets reutilizados; no cambiar URLs al extraer apariencia.

**Dependencias de composición:** [LM-ACTION](#lm-action). Consumidores estáticos en el JSON.

<a id="lm-feedback"></a>
### LM-FEEDBACK · Alertas, loading y estados vacíos

**Disponibilidad actual:** reutilizable. Entrada: [lemoon-ui-message.liquid](../../snippets/lemoon-ui-message.liquid). Mensaje explícito sin anuncio automático; loading-spinner conserva su implementación. [Receta de integración](../components/recipes/contact-form.md).

**Fuentes:** [snippets/loading-spinner.liquid](../../snippets/loading-spinner.liquid), [assets/loading-spinner.svg](../../assets/loading-spinner.svg), [sections/cart-live-region-text.liquid](../../sections/cart-live-region-text.liquid), [lemoon-ui-message](../../snippets/lemoon-ui-message.liquid).

**Contrato actual.** loading-spinner: class opcional. Feedback usa form.errors/posted_successfully, cart.errors y resultados; no existe API global de toast. cart-live-region-text retorna sections.cart.new_estimated_total y cart.total_price formateado para respuesta parcial.

**Variantes existentes.** Inline error/success/status; spinner .loading__spinner; vacío search/cart/quiz/medidas; progreso bulk/quiz separado.

**CSS y excepciones.** --lemoon-status-error/success y texto local; form__message, product-form__error, cart-item__error, lemoon-contact__status; literal backgrounds locales quedan en familia, no nueva paleta.

**Estados observados / aplicabilidad:** Normal: Ausencia de feedback o mensaje informativo; Hover: Solo acciones de recuperación; Foco: Autofocus/tabindex donde fuente lo implementa; Seleccionado: No aplica; Loading: Spinner/progreso y aria-busy por consumidor; Error: role alert o error asociado según superficie; Disabled: Solo acciones; nunca deshabilitar el mensaje.

**Responsive.** No truncar errores ni tapar acciones al apilar. **Accesibilidad.** Conservar live region IDs; spinner decorativo no reemplaza texto de estado. No duplicar anuncios.

**JS.** Controlador del formulario/producto/cart; no un nuevo bus de toasts. **Reutilización actual.** Spinner compartido y `lemoon-ui-message` presentacional para contacto/galería/newsletter footer y headings de feedback de comentarios; las demás operaciones conservan su feedback con semántica propia.

**Dependencias de composición:** [LM-TYPE](#lm-type), [LM-ICON](#lm-icon). Consumidores estáticos en el JSON.

<a id="lm-disclosure"></a>
### LM-DISCLOSURE · Accordions, disclosures y FAQ

**Disponibilidad actual:** reutilizable. Entrada: [lemoon-ui-faq-item.liquid](../../snippets/lemoon-ui-faq-item.liquid). FAQ agrupado y legacy reutilizan details; otros disclosures mantienen sus dueños. [Receta de integración](../components/recipes/faq-group.md).

**Fuentes:** [sections/collapsible-content.liquid](../../sections/collapsible-content.liquid), [sections/lemoon-faq.liquid](../../sections/lemoon-faq.liquid), [sections/lemoon-faq-page.liquid](../../sections/lemoon-faq-page.liquid), [sections/disclosures.liquid](../../sections/disclosures.liquid), [snippets/product-disclosures.liquid](../../snippets/product-disclosures.liquid), [assets/component-accordion.css](../../assets/component-accordion.css), [assets/collapsible-content.css](../../assets/collapsible-content.css), [assets/component-disclosures.css](../../assets/component-disclosures.css), [assets/details-disclosure.js](../../assets/details-disclosure.js), [assets/disclosures.js](../../assets/disclosures.js), [lemoon-ui-faq-item](../../snippets/lemoon-ui-faq-item.liquid), [assets/global.js](../../assets/global.js).

**Contrato actual.** collapsible-content: bloques collapsible_row con heading/icon/row_content/page. FAQ simple question/answer; FAQ page question con group/link/link_label y grupos locales. product-disclosures: product,block,heading,heading_size,open_by_default,surface(default product_page), metafields.shopify.disclosure y display_preferences surfaces.

**Variantes existentes.** details/summary nativo; FAQ agrupada; disclosure de producto con símbolo/content metafield. Nombre collapsible_tab en schema no implica tabs ARIA.

**CSS y excepciones.** CSS accordion Dawn y FAQ/optical/legal locales; conservar radios y separators propios.

**Estados observados / aplicabilidad:** Normal: Cerrado o open por fuente; Hover: Summary; Foco: Summary nativo; Seleccionado: open del details; Loading: No propio; contenido dependiente puede cargar; Error: No error propio; Disabled: No disabled común.

**Responsive.** Contenido fluido; FAQ page layout local, sin trap/scroll lock. **Accesibilidad.** Enter/Espacio nativos; summary con nombre; block.shopify_attributes en roots apropiadas; no convertir FAQ en modal.

**JS.** details-disclosure/disclosures-content cuando usados; details FAQ opera nativamente. **Reutilización actual.** `lemoon-ui-faq-item` comparte la presentación de fallback/custom en FAQ agrupado, FAQ legacy y galería; collapsible y disclosure PDP conservan sus contratos.

**Dependencias de composición:** [LM-ICON](#lm-icon), [LM-TYPE](#lm-type). Consumidores estáticos en el JSON.

<a id="lm-overlay"></a>
### LM-OVERLAY · Modales, drawers y popovers

**Disponibilidad actual:** extracción pendiente. Entrada: [global.js](../../assets/global.js). No hay modal genérico extraído; reutilizar el shell real con Escape, trampa y retorno de foco. [Receta de integración](../components/recipes/catalogue-states.md).

**Fuentes:** [assets/global.js](../../assets/global.js), [assets/details-modal.js](../../assets/details-modal.js), [assets/component-menu-drawer.css](../../assets/component-menu-drawer.css), [assets/component-modal-video.css](../../assets/component-modal-video.css), [assets/cart-disclosure-modal.js](../../assets/cart-disclosure-modal.js), [assets/cart-disclosure-tooltip.js](../../assets/cart-disclosure-tooltip.js), [snippets/cart-disclosure-indicator.liquid](../../snippets/cart-disclosure-indicator.liquid).

**Contrato actual.** Dawn ModalOpener data-modal + ModalDialog id/open/ModalClose-*; details-modal summary/close/input; MenuDrawer details/root/nested. cart-disclosure-indicator recibe product,modal_id único por línea; no tratar disclosure de cart como summary de FAQ. Dialog nativo de medidas/privacy vive en su consumidor.

**Variantes existentes.** Modal Dawn, bulk-modal, details-modal search, drawer menú/cart, dialog HTML nativo medidas/cookies, popover quantity y tooltip cart; ciclos de vida diferentes.

**CSS y excepciones.** Z-index/motion por superficie y tokens; drawers laterales radio0 no adoptan radio modal. Dawn overflow-hidden-* y dialog ::backdrop locales.

**Estados observados / aplicabilidad:** Normal: Cerrado; Hover: Trigger/cierre; Foco: Trap/retorno implementado por controlador; verificar en navegador; Seleccionado: open/aria-expanded; Loading: Contenido puede cargar; Error: Error de contenido, no overlay universal; Disabled: Trigger según disponibilidad; cierre sigue operable.

**Responsive.** Viewport/100dvh y scroll interno según drawer; 750/990 navegación; modal tamaño local, no universal. **Accesibilidad.** Conservar role/dialog title/aria-modal real, Escape, outside click, opener y scroll lock; lectura de JS no prueba trap correcto.

**JS.** global.js, details-modal.js, cart-disclosure-modal.js/tooltip.js y controladores nativos separados. **Reutilización actual.** Primitivas JS reutilizadas; no fusionar showModal con atributo open de ModalDialog.

**Dependencias de composición:** [LM-ACTION](#lm-action), [LM-FEEDBACK](#lm-feedback). Consumidores estáticos en el JSON.

<a id="lm-tabs"></a>
### LM-TABS · Tabs y guía de medidas

**Disponibilidad actual:** reutilizable. Entrada: [lemoon-size-guide-content.liquid](../../snippets/lemoon-size-guide-content.liquid). Contenido compartido; controlador y shell PDP no son un tab genérico. [Receta de integración](../components/recipes/product-card-grid.md).

**Fuentes:** [snippets/lemoon-size-guide-content.liquid](../../snippets/lemoon-size-guide-content.liquid), [snippets/lemoon-frame-dimensions.liquid](../../snippets/lemoon-frame-dimensions.liquid), [snippets/lemoon-frame-information.liquid](../../snippets/lemoon-frame-information.liquid), [snippets/lemoon-product-size-guide.liquid](../../snippets/lemoon-product-size-guide.liquid), [assets/lemoon-pdp-tools.js](../../assets/lemoon-pdp-tools.js).

**Contrato actual.** Size content: product,instance_id(default product.id); custom.frame_dimensions/shape/material/size/width/weight/gender/face_shapes_compatible. frame-dimensions usa dimensions y dialog opcional para selector de unidades; frame-information pasa product e instance_id al contenido. size-guide drawer recibe product,section_id y crea instance_id propio. Tabs measurements/frame/fit con IDs únicos y unidades mm/in.

**Variantes existentes.** Tres tabs ARIA reales; contenido inline y drawer; datos ausentes -> mensaje localizado; no confundir con collapsible_tab.

**CSS y excepciones.** .lemoon-size-guide*, .lemoon-size-drawer en PDP CSS; drawer máximo480px/100vw radio0, scroll local, --lemoon-border-strong para tab seleccionado donde fuente lo usa.

**Estados observados / aplicabilidad:** Normal: Tab measurements inicial; Hover: Botones tabs; Foco: Roving tabindex y flechas/Home/End del JS; Seleccionado: aria-selected y hidden panel sincronizados; Loading: No spinner propio; Error: Faltan datos es vacío, no error de red; Disabled: No disabled global.

**Responsive.** Drawer 100dvh y contenido overflow; diagrama fluido y cambio de unidades local. **Accesibilidad.** Preservar tablist/tab/tabpanel, aria-controls/labelledby, instance_id en múltiples apariciones y retorno del dialog.

**JS.** lemoon-pdp-tools.js: lemoon-size-guide, lemoon-product-tools y native dialog; óptica usa controlador propio para opener. **Reutilización actual.** Contenido/diagrama ya compartidos por PDP; shell dialog duplicado óptica/estándar. Retener adaptadores hasta prueba.

**Dependencias de composición:** [LM-OVERLAY](#lm-overlay), [LM-ACTION](#lm-action), [LM-TYPE](#lm-type). Consumidores estáticos en el JSON.

<a id="lm-slider"></a>
### LM-SLIDER · Carruseles, slideshow y controles

**Disponibilidad actual:** reutilizable. Entrada: [lemoon-carousel-controls.liquid](../../snippets/lemoon-carousel-controls.liquid). carousel_id y hooks prev/next reales; slider-component conserva global.js. [Receta de integración](../components/recipes/product-card-grid.md).

**Fuentes:** [snippets/lemoon-carousel-controls.liquid](../../snippets/lemoon-carousel-controls.liquid), [snippets/lemoon-thumbnail-arrow.liquid](../../snippets/lemoon-thumbnail-arrow.liquid), [assets/component-slider.css](../../assets/component-slider.css), [assets/component-slideshow.css](../../assets/component-slideshow.css). [snippets/lemoon-dawn-slider-controls.liquid](../../snippets/lemoon-dawn-slider-controls.liquid), [snippets/lemoon-carousel-results.liquid](../../snippets/lemoon-carousel-results.liquid).

**Contrato actual.** Dawn slider-component/slideshow-component dependen IDs Slider-/Slide-, nombres previous/next y contadores; Lemoon carousel controls: carousel_id y data-lemoon-carousel-*; thumbnail-arrow direction (up/down); label se obtiene de locales. Controlador del consumidor define scroll/autoplay.

**Variantes existentes.** Scroll slider Dawn, slideshow autoplay, carrusel productos, rail thumbnails y hero; no todos comparten controlador.

**CSS y excepciones.** .slider, .slider-button, .slideshow y .lemoon-carousel-controls locales; motion y disabled según fuente.

**Estados observados / aplicabilidad:** Normal: Primera posición/contenido; Hover: Flechas; Foco: Botones y enlaces de slides; Seleccionado: Índice/contador visible según familia; Loading: Productos diferidos/media; Error: Fallo fetch del carrusel según consumidor; Disabled: Flechas en límites; controls hidden hasta inicialización.

**Responsive.** Swipe/scroll-snap y columnas locales; conservar reduced-motion y comportamiento autoplay. **Accesibilidad.** Labels prev/next, aria-controls/contador y pause donde existe; verificación teclado/motion pendiente.

**JS.** global.js SliderComponent/SlideshowComponent; hero/featured-products/pdp-tools separados. **Reutilización actual.** Controles ya en snippets; candidatos a contrato visual común con adaptadores distintos.

**Dependencias de composición:** [LM-ACTION](#lm-action), [LM-ICON](#lm-icon). Consumidores estáticos en el JSON.

<a id="lm-media"></a>
### LM-MEDIA · Media responsive, galerías y vídeo

**Disponibilidad actual:** reutilizable. Entrada: [product-media-gallery.liquid](../../snippets/product-media-gallery.liquid). Galería de producto con product/section y sus assets; video/model-viewer tienen dependencias propias. [Receta de integración](../components/recipes/product-card-grid.md).

**Fuentes:** [snippets/product-media-gallery.liquid](../../snippets/product-media-gallery.liquid), [snippets/product-media-modal.liquid](../../snippets/product-media-modal.liquid), [snippets/product-media.liquid](../../snippets/product-media.liquid), [snippets/product-thumbnail.liquid](../../snippets/product-thumbnail.liquid), [snippets/lemoon-pdp-image.liquid](../../snippets/lemoon-pdp-image.liquid), [assets/media-gallery.js](../../assets/media-gallery.js), [assets/product-modal.js](../../assets/product-modal.js), [assets/product-model.js](../../assets/product-model.js), [assets/magnify.js](../../assets/magnify.js), [assets/component-deferred-media.css](../../assets/component-deferred-media.css), [assets/component-product-model.css](../../assets/component-product-model.css), [assets/component-model-viewer-ui.css](../../assets/component-model-viewer-ui.css), [sections/video.liquid](../../sections/video.liquid), [assets/video-section.css](../../assets/video-section.css).

**Contrato actual.** product-media-gallery: product,variant_images,limit (también section/settings implícitos); media/modal/thumbnail APIs declaradas en los comentarios Accepts de sus fuentes enlazadas. lemoon-pdp-image: image,sizes,image_class,deferred,primary; anchos320..1946, eager/high para primary y template/noscript lazy diferido. video schema incluye video/video_url, cover_image, description, looping.

**Variantes existentes.** Imagen/thumb/zoom, vídeo Shopify/YouTube/Vimeo, modelo3D/XR, poster deferred; galería óptica usa paneles propios.

**CSS y excepciones.** Contain producto frente a crop editorial; media ratio/sizes y zoom locales. Asset modelo externo referenciado no descargado; no afirmar soporte comprobado.

**Estados observados / aplicabilidad:** Normal: Media/poster; Hover: Zoom cuando habilitado; Foco: Botones y skip de galería; Seleccionado: Media activa y thumbnail; Loading: Deferred-media e imágenes; Error: Fallback/ausencia media según fuente; no error universal; Disabled: Botones por límites/no media.

**Responsive.** Galería estándar layout stacked/columns/thumbnail y mobile_thumbnails; optical stage propio; conservar sizes. **Accesibilidad.** Alt y nombre de abrir, close, pauseAllMedia, XR, noscript; no convertir vídeo en imagen simple.

**JS.** media-gallery/product-modal/product-model/magnify + global deferred-media y pdp-tools; módulos externos Shopify según contexto. **Reutilización actual.** Snippets estándar compartidos; markup óptica separado. Extracción debe conservar lazy/priority/model/video y tracking.

**Dependencias de composición:** [LM-OVERLAY](#lm-overlay), [LM-SLIDER](#lm-slider), [LM-ACTION](#lm-action). Consumidores estáticos en el JSON.

<a id="lm-facet"></a>
### LM-FACET · Filtros, chips activos y sorting

**Disponibilidad actual:** reutilizable. Entrada: [facets.liquid](../../snippets/facets.liquid). results, filtros y formularios nativos; el átomo select no decide políticas de ordenación. [Receta de integración](../components/recipes/search-sort.md).

**Fuentes:** [snippets/facets.liquid](../../snippets/facets.liquid), [snippets/facets-filter-desktop.liquid](../../snippets/facets-filter-desktop.liquid), [snippets/facets-filter-mobile.liquid](../../snippets/facets-filter-mobile.liquid), [snippets/facets-active-values.liquid](../../snippets/facets-active-values.liquid), [snippets/lemoon-active-filters.liquid](../../snippets/lemoon-active-filters.liquid), [snippets/lemoon-facet-visual.liquid](../../snippets/lemoon-facet-visual.liquid), [assets/facets.js](../../assets/facets.js), [assets/component-facets.css](../../assets/component-facets.css), [assets/component-show-more.css](../../assets/component-show-more.css), [assets/show-more.js](../../assets/show-more.js).

**Contrato actual.** facets: results,enable_filtering,enable_sorting,filter_type,paginate,lemoon_plp. Grupos filter/filter_label/filter_type/lemoon_plp/presentation/visual_layout_class/filter_index (+show_more_number desktop). Chips filters/lemoon_plp; visual filter,value. Param names/URLs Shopify son fuente de verdad.

**Variantes existentes.** Horizontal/vertical/drawer; desktop/mobile; visual color/forma, checkbox y precio; sort select/custom PLP; chip facet-remove; show-more.

**CSS y excepciones.** component-facets y overrides PLP; chip border/radio local; no fijar apariencia de todos los chips como badge.

**Estados observados / aplicabilidad:** Normal: Disponible/contador; Hover: Summary/chip/checkbox; Foco: Retorno tras AJAX al input equivalente o fallback; Seleccionado: checked y active; remove usa url_to_remove; Loading: collection.loading y spinner; Error: Catch fetch sin recuperación visible garantizada: deuda funcional conservada; Disabled: count0 inactivo disabled; activo removible aunque count0.

**Responsive.** Sidebar PLP 264+28 ≥990, 220+24 intermedio; drawer máximo320 bajo990 según CSS local. **Accesibilidad.** Preservar details IDs, legend/labels, URLs, history, aria-controls y foco; no deshabilitar única salida del vacío.

**JS.** facets.js, MenuDrawer global, show-more.js; lemoon-collection-plp.js añade vista/sort. **Reutilización actual.** Snippets grupos/chips reutilizados; lemoon-active-filters es otra composición. No reimplementar motor de filtros.

**Dependencias de composición:** [LM-CHOICE](#lm-choice), [LM-RANGE](#lm-range), [LM-OVERLAY](#lm-overlay), [LM-FEEDBACK](#lm-feedback). Consumidores estáticos en el JSON.

<a id="lm-search"></a>
### LM-SEARCH · Búsqueda y predictive search

**Disponibilidad actual:** composición de sección. Entrada: [main-search.liquid](../../sections/main-search.liquid). Componer main-search-results en su contexto search, filtros y términos. [Receta de integración](../components/recipes/search-sort.md).

**Fuentes:** [sections/main-search.liquid](../../sections/main-search.liquid), [sections/predictive-search.liquid](../../sections/predictive-search.liquid), [snippets/main-search-results.liquid](../../snippets/main-search-results.liquid), [snippets/header-search.liquid](../../snippets/header-search.liquid), [assets/main-search.js](../../assets/main-search.js), [assets/search-form.js](../../assets/search-form.js), [assets/predictive-search.js](../../assets/predictive-search.js), [assets/component-search.css](../../assets/component-search.css), [assets/component-predictive-search.css](../../assets/component-predictive-search.css).

**Contrato actual.** Search page consume search.terms/results/filters/sort_by y paginate; main-search-results recibe section,paginate,show_all_products,has_results,search_url y consume contexto search. Header search usa input_id; predictive-search section retorna markup para endpoint. URLs reales routes.search_url/predictive_search_url.

**Variantes existentes.** Página resultados producto/artículo/page; predictive groups products/collections/pages/articles/queries; suggestions y vacío; header-search Dawn existe aunque header Lemoon usa overlay propio.

**CSS y excepciones.** .search, .predictive-search, .field y main-search inline; radio search local24/tamaño40 donde aplica. No aplicar radio de búsqueda a todo campo.

**Estados observados / aplicabilidad:** Normal: Términos/resultados/sugerencias; Hover: Opciones y links; Foco: Input, navegación de sugerencias y foco; Seleccionado: aria-selected/active-descendant del predictive; Loading: loading y live-region/count; Error: Catch de predictive no equivale a recuperación visible garantizada; Disabled: Reset/button según término; no disabled global.

**Responsive.** Página y overlay distintos; facets responsive heredado y grid local. **Accesibilidad.** Conservar combobox/listbox cuando presentes, expanded/owns/controls, submit GET, reset, query y labels.

**JS.** search-form -> predictive-search/main-search, facets para página; no cambiar endpoint a visual atom. **Reutilización actual.** Snippets compartidos y controlador heredado; overlay móvil LM-MOBILE-SEARCH es implementación distinta.

**Dependencias de composición:** [LM-FIELD](#lm-field), [LM-FACET](#lm-facet), [LM-PRODUCT-CARD](#lm-product-card), [LM-CONTENT-CARD](#lm-content-card), [LM-NAV](#lm-nav). Consumidores estáticos en el JSON.

<a id="lm-mobile-search"></a>
### LM-MOBILE-SEARCH · Overlay de búsqueda Lemoon

**Disponibilidad actual:** reutilizable. Entrada: [lemoon-mobile-search.liquid](../../snippets/lemoon-mobile-search.liquid). Overlay y controlador móvil propios; no reemplazarlo por el select de sorting. [Receta de integración](../components/recipes/search-sort.md).

**Fuentes:** [snippets/lemoon-mobile-search.liquid](../../snippets/lemoon-mobile-search.liquid), [assets/lemoon-mobile-search.css](../../assets/lemoon-mobile-search.css), [assets/lemoon-mobile-search.js](../../assets/lemoon-mobile-search.js), [assets/lemoon-mobile-search-logic.js](../../assets/lemoon-mobile-search-logic.js).

**Contrato actual.** Recibe section; lee mobile_search_trending_collection (fallback opticos) y settings mobile_search_*; hooks data-lemoon-search-*; helpers shouldPredict mínimo3 chars, selectSuggestions únicos máximo3, recently viewed máximo20 almacenados/3 visibles y request gate de respuestas obsoletas. No leer localStorage real durante inventario.

**Variantes existentes.** Inicial sugerencias/recientes; resultados predictivos JSON producto; sin resultados; error; template card-product para sugerencias y markup JS de resultados.

**CSS y excepciones.** CSS overlay específico y estilos de header; no sustituir por details-modal de Dawn sin adaptación.

**Estados observados / aplicabilidad:** Normal: Panel cerrado/inicial; Hover: Links/resultados; Foco: Trap/retorno gestionado JS; Seleccionado: Resultado navegable; Loading: Estado de búsqueda y request gate; Error: Mensaje local de fetch según JS; Disabled: Controles locales; submit sigue recuperación GET.

**Responsive.** Panel comparte header y adaptación por media queries de su CSS. **Accesibilidad.** Conservar IDs/nombre de diálogo, focus opener y cierre; verificar teclado, red y almacenamiento bloqueado.

**JS.** lemoon-mobile-search.js importa lógica pura; fetch JSON predictive y almacenamiento reciente. **Reutilización actual.** Snippet específico; card renderer JS duplica parte de card visual. Candidato común de display sin mezclar request/almacenamiento.

**Dependencias de composición:** [LM-SEARCH](#lm-search), [LM-OVERLAY](#lm-overlay), [LM-PRODUCT-CARD](#lm-product-card). Consumidores estáticos en el JSON.

<a id="lm-header"></a>
### LM-HEADER · Header, menús y localización

**Disponibilidad actual:** composición de sección. Entrada: [header.liquid](../../sections/header.liquid). Grupo header, navegación/localización y JS existentes; no header ficticio en galería. [Receta de integración](../components/recipes/catalogue-states.md).

**Fuentes:** [sections/header.liquid](../../sections/header.liquid), [snippets/header-drawer.liquid](../../snippets/header-drawer.liquid), [snippets/header-dropdown-menu.liquid](../../snippets/header-dropdown-menu.liquid), [snippets/header-mega-menu.liquid](../../snippets/header-mega-menu.liquid), [snippets/country-localization.liquid](../../snippets/country-localization.liquid), [snippets/language-localization.liquid](../../snippets/language-localization.liquid), [assets/lemoon-header.css](../../assets/lemoon-header.css), [assets/lemoon-header-nav.js](../../assets/lemoon-header-nav.js), [assets/component-list-menu.css](../../assets/component-list-menu.css), [assets/component-mega-menu.css](../../assets/component-mega-menu.css), [assets/component-localization-form.css](../../assets/component-localization-form.css), [assets/localization-form.js](../../assets/localization-form.js).

**Contrato actual.** Header Lemoon usa settings.menu, bloques drawer_primary/drawer_utility/drawer_subitem y @app; logo oficial inline. Menús Dawn conservados reciben menu/section/settings según las fuentes enlazadas; localization snippets localPosition y localization countries/languages, formulario nativo.

**Variantes existentes.** Header claro desktop/móvil; nav dropdown local; menús Dawn legacy dropdown/mega/drawer existen sin llamada directa desde header actual; localización condicional del layout.

**CSS y excepciones.** Máximo local2200, logo120×28, alturas72/56 desde tokens/CSS; --lemoon-* header. No son límites globales.

**Estados observados / aplicabilidad:** Normal: Menú y enlaces; Hover: Nav desktop; Foco: Teclado/expand/cierre según controlador; Seleccionado: aria-current en menús cuando existe; Loading: No loader general; Error: No error global; país búsqueda local; Disabled: Opciones localización según datos, no disabled genérico.

**Responsive.** Navegación principal990, gutters1280; no confundir breakpoint gutter con menú. **Accesibilidad.** Conservar banner/nav labels, logo alt, cart bubble ID, app editor attrs y aria-expanded; disponibilidad de snippets no prueba uso.

**JS.** lemoon-header-nav.js; Dawn details-disclosure/global; localization-form.js para país/idioma. **Reutilización actual.** Header específico; conservar legacy hasta confirmar consumidores; no borrar por ausencia de referencia directa.

**Dependencias de composición:** [LM-ACTION](#lm-action), [LM-ICON](#lm-icon), [LM-MOBILE-NAV](#lm-mobile-nav), [LM-MOBILE-SEARCH](#lm-mobile-search). Consumidores estáticos en el JSON.

<a id="lm-mobile-nav"></a>
### LM-MOBILE-NAV · Navegación móvil por niveles

**Disponibilidad actual:** reutilizable. Entrada: [lemoon-mobile-nav.liquid](../../snippets/lemoon-mobile-nav.liquid). Menús por nivel y controlador propios; preservar IDs, foco y estados. [Receta de integración](../components/recipes/catalogue-states.md).

**Fuentes:** [snippets/lemoon-mobile-nav.liquid](../../snippets/lemoon-mobile-nav.liquid), [snippets/lemoon-mobile-nav-link.liquid](../../snippets/lemoon-mobile-nav-link.liquid), [snippets/lemoon-mobile-nav-filter-group.liquid](../../snippets/lemoon-mobile-nav-filter-group.liquid), [assets/lemoon-mobile-nav.css](../../assets/lemoon-mobile-nav.css), [assets/lemoon-mobile-nav.js](../../assets/lemoon-mobile-nav.js), [assets/lemoon-mobile-nav-logic.js](../../assets/lemoon-mobile-nav-logic.js).

**Contrato actual.** Nav recibe section; link recibe block; filter-group recibe section,primary,group,heading. Oculta links si faltan título/link o catalog_collection/availability_tag no satisfacen disponibilidad editorial. Las llamadas de render canónicas conservan las firmas efectivas. Bloques incluyen slot,parent,group,catalog_collection,availability_tag,shape,swatch_color/image.

**Variantes existentes.** Cerrado/root/sub; toggle cerrado abre, sub vuelve, root cierra. Links de colección/forma/color y utilidades.

**CSS y excepciones.** CSS .lemoon-mobile-nav* y header tokens; swatches de menú son datos editoriales, no radio de variante.

**Estados observados / aplicabilidad:** Normal: Raíz visible o cerrado; Hover: Links; Foco: Foco y retorno del panel; Seleccionado: Link activo por URL; Loading: No loader propio; Error: No error propio; Disabled: No disabled genérico.

**Responsive.** Drawer móvil y overlay, niveles no se convierten en mega-menu desktop. **Accesibilidad.** Conservar data-target/panel/root, botones volver/cerrar, aria-expanded y orden de tabulación.

**JS.** lemoon-mobile-nav.js y getToggleAction del módulo logic. **Reutilización actual.** Snippets links/groups ya composicionales; no son Shopify theme blocks reutilizables.

**Dependencias de composición:** [LM-OVERLAY](#lm-overlay), [LM-ICON](#lm-icon), [LM-ACTION](#lm-action). Consumidores estáticos en el JSON.

<a id="lm-footer"></a>
### LM-FOOTER · Footer, newsletter, ayuda y pagos

**Disponibilidad actual:** composición de sección. Entrada: [footer.liquid](../../sections/footer.liquid). Grupo footer y newsletter nativa; contenido real de settings, sin garantías de demo. [Receta de integración](../components/recipes/guide-help.md).

**Fuentes:** [sections/footer.liquid](../../sections/footer.liquid), [assets/section-lemoon-footer.css](../../assets/section-lemoon-footer.css), [assets/section-lemoon-footer.js](../../assets/section-lemoon-footer.js), [assets/section-footer.css](../../assets/section-footer.css), [assets/component-list-social.css](../../assets/component-list-social.css), [assets/component-list-payment.css](../../assets/component-list-payment.css), [assets/component-newsletter.css](../../assets/component-newsletter.css), [assets/newsletter-section.css](../../assets/newsletter-section.css).

**Contrato actual.** Footer actual es Lemoon: navigation_column (heading/menu/open_mobile/mobile_only/desktop_only), legal_links(menu), @app; newsletter form customer contact[email]/tags; ayuda, whatsapp/contact y logos de pago configurables por settings. Mostrar logo no acredita pasarela habilitada.

**Variantes existentes.** Columnas desktop; details móvil; newsletter success/error; links legales/redes/ayuda; control preferencias cookies.

**CSS y excepciones.** .lemoon-footer/newsletter y arte de fondo; CSS Dawn section-footer conservado sin confundir con CSS actual. Tokens de superficie/texto y tamaños locales.

**Estados observados / aplicabilidad:** Normal: Columnas y formulario; Hover: Links/submit; Foco: Summary/links/input; Seleccionado: details open móvil; Loading: Envío nativo no spinner universal; Error: form.errors y success reales; Disabled: Controles por contexto; no disabled global.

**Responsive.** Footer JS fuerza apertura escritorio y restaura estado móvil vía matchMedia; preservar mobile_only/desktop_only. **Accesibilidad.** Conservar heading de newsletter, label oculto, error ID, block attrs, details semantics y status de preferencias.

**JS.** section-lemoon-footer.js; cookies controlador separado; newsletter POST nativo. **Reutilización actual.** Composición específica; newsletter se duplica en blog/launch/email banner y conserva contrato propio.

**Dependencias de composición:** [LM-DISCLOSURE](#lm-disclosure), [LM-FIELD](#lm-field), [LM-ACTION](#lm-action), [LM-PRIVACY](#lm-privacy), [LM-FEEDBACK](#lm-feedback). Consumidores estáticos en el JSON.

<a id="lm-privacy"></a>
### LM-PRIVACY · Preferencias de cookies

**Disponibilidad actual:** reutilizable. Entrada: [lemoon-cookie-preferences.liquid](../../snippets/lemoon-cookie-preferences.liquid). Consentimiento permanece en su controlador y API; galería sin persistencia. [Receta de integración](../components/recipes/catalogue-states.md).

**Fuentes:** [snippets/lemoon-cookie-preferences.liquid](../../snippets/lemoon-cookie-preferences.liquid), [snippets/lemoon-native-policy-help.liquid](../../snippets/lemoon-native-policy-help.liquid), [assets/lemoon-cookie-preferences.js](../../assets/lemoon-cookie-preferences.js), [assets/lemoon-native-policies.css](../../assets/lemoon-native-policies.css).

**Contrato actual.** Cookie snippet recibe section_id y privacy_url; dialog data-cookie-dialog, analytics/marketing/preferences; acciones accept/reject/save. Lee Shopify.customerPrivacy vía loadFeatures consent-tracking-api 0.1 y verifica currentVisitorConsent tras save. Policy help recibe contact_url.

**Variantes existentes.** Dialog nativo del footer y opener compartido policy; loading servicio, error disponibilidad/guardado, selección persistida.

**CSS y excepciones.** CSS footer y policy shell, sin segundo sistema de tokens ni política duplicada.

**Estados observados / aplicabilidad:** Normal: Control disponible si aria-controls válido; Hover: Botones; Foco: Dialog y retorno opener en close; Seleccionado: Checkbox nativo según API; Loading: aria-busy y guard, timeout4000ms; Error: Status opener o error dialog; no cerrar si save falla; Disabled: Acciones y checkbox durante save; cierre permanece aparte.

**Responsive.** Dialog scroll/viewport propio del footer; política shell legal en layout. **Accesibilidad.** Conservar label/control IDs y motivos; no mostrar éxito antes de confirmar respuesta API.

**JS.** lemoon-cookie-preferences.js; disponibilidad live de API no comprobada. **Reutilización actual.** Snippet único dialog y varios openers; no extraer lógica de consentimiento a checkbox visual.

**Dependencias de composición:** [LM-OVERLAY](#lm-overlay), [LM-CHOICE](#lm-choice), [LM-FEEDBACK](#lm-feedback). Consumidores estáticos en el JSON.

<a id="lm-hero"></a>
### LM-HERO · Hero y anuncios

**Disponibilidad actual:** composición de sección. Entrada: [lemoon-hero.liquid](../../sections/lemoon-hero.liquid). Sección con media/settings propios; no banner universal extraído. [Receta de integración](../components/recipes/guide-help.md).

**Fuentes:** [sections/lemoon-hero.liquid](../../sections/lemoon-hero.liquid), [sections/image-banner.liquid](../../sections/image-banner.liquid), [sections/slideshow.liquid](../../sections/slideshow.liquid), [sections/announcement-bar.liquid](../../sections/announcement-bar.liquid), [assets/lemoon-hero.css](../../assets/lemoon-hero.css), [assets/lemoon-hero.js](../../assets/lemoon-hero.js), [assets/section-image-banner.css](../../assets/section-image-banner.css), [assets/lemoon-announcement-bar.css](../../assets/lemoon-announcement-bar.css).

**Contrato actual.** Hero Lemoon: bloques slide desktop/mobile image o asset y dos CTA, autoplay_seconds. Banner Dawn heading/text/buttons, imagen/imagen2, overlay y content position; slideshow slide con heading/subheading/link/color_scheme. Announcement bloques announcement(text/link), auto_rotate/change_slides_speed y localización/social según schema.

**Variantes existentes.** Hero slide estático/múltiple autoplay; image-banner sin controlador; slideshow Dawn; strip anuncios con slider.

**CSS y excepciones.** Crop/picture, puntos focales y overlay locales; no convertir assets placeholder en referencia comercial. Tokens y literales de composición permanecen en el CSS de la fuente enlazada.

**Estados observados / aplicabilidad:** Normal: Slide y CTA; Hover: Acciones y nav; Foco: Controles/foco dentro pausa hero según JS; Seleccionado: Índice activo; Loading: Imagen y autoplay; Error: Fallback media según fuente; no feedback universal; Disabled: Flechas según cantidad/estado local.

**Responsive.** Picture móvil/desktop y reglas propias; conservar reduced-motion, visibilitychange y pausa autoplay donde implementada. **Accesibilidad.** Labels de slide/prev/next y pausa de slideshow; no afirmar autoplay accesible por lectura estática.

**JS.** lemoon-hero custom element; global slideshow y theme-editor para Dawn. **Reutilización actual.** Composiciones distintas, no un solo snippet hero; compartir solo acciones/media probados.

**Dependencias de composición:** [LM-SLIDER](#lm-slider), [LM-ACTION](#lm-action), [LM-MEDIA](#lm-media). Consumidores estáticos en el JSON.

<a id="lm-editorial"></a>
### LM-EDITORIAL · Composiciones editoriales y home

**Disponibilidad actual:** composición de sección. Entrada: [lemoon-about-page.liquid](../../sections/lemoon-about-page.liquid). Reutilizar sección/editorial existente y lemoon-shared-benefits donde corresponda; preservar demo opt-in. [Receta de integración](../components/recipes/guide-help.md).

**Fuentes:** [sections/collage.liquid](../../sections/collage.liquid), [sections/image-with-text.liquid](../../sections/image-with-text.liquid), [sections/multirow.liquid](../../sections/multirow.liquid), [sections/multicolumn.liquid](../../sections/multicolumn.liquid), [sections/lemoon-about.liquid](../../sections/lemoon-about.liquid), [sections/lemoon-about-page.liquid](../../sections/lemoon-about-page.liquid), [sections/lifestyle-mood-grid.liquid](../../sections/lifestyle-mood-grid.liquid), [sections/lemoon-shop-by-shape.liquid](../../sections/lemoon-shop-by-shape.liquid), [sections/how-it-works.liquid](../../sections/how-it-works.liquid), [sections/trust-bar.liquid](../../sections/trust-bar.liquid), [sections/social-proof-strip.liquid](../../sections/social-proof-strip.liquid), [snippets/lemoon-shared-benefits.liquid](../../snippets/lemoon-shared-benefits.liquid), [snippets/lemoon-commercial-demo.liquid](../../snippets/lemoon-commercial-demo.liquid), [assets/collage.css](../../assets/collage.css), [assets/component-image-with-text.css](../../assets/component-image-with-text.css), [assets/section-multicolumn.css](../../assets/section-multicolumn.css).

**Contrato actual.** Bloques: collage image/product/collection/video; image-with-text heading/caption/text/button; multirow row; multicolumn column; mood image/heading/link; shape label/shape/link; how-it-works step icon/detail/heading/text. About story/image/demo; trust shared-benefits context; social-proof rating/text settings. Schema y settings de cada bloque en su fuente canónica enlazada; tipos resumidos en la matriz de secciones.

**Variantes existentes.** Grids/collage/image-text/rows/columns; about home y página; mood tiles; shape navigation; steps; benefits/review strip; commercial-demo enabled/content/section_id es muestra marcada, no operación real.

**CSS y excepciones.** About panel green existente y tamaños locales; retain crop editorial/contain producto, radios y gaps por sección. No trasladar panel verde al sistema global.

**Estados observados / aplicabilidad:** Normal: Composición y contenido; Hover: Links/tile/CTA; Foco: Solo acciones; Seleccionado: No aplica; Loading: Media lazy; slider multicolumn si habilitado; Error: No feedback propio; Disabled: No aplica salvo acciones.

**Responsive.** Section schema columns/alignment/padding; collage y multirow invierten/apilan por CSS propio; no grid universal. **Accesibilidad.** Preservar headings, alt, links y block.shopify_attributes; ratings/beneficios requieren veracidad comercial fuera de inventario.

**JS.** Global sliders/deferred-media cuando invocados; mayormente Liquid/CSS inline. **Reutilización actual.** Muchas composiciones locales; extraer acciones/iconos antes de wrappers; mantener excepciones de layout.

**Dependencias de composición:** [LM-TYPE](#lm-type), [LM-ACTION](#lm-action), [LM-ICON](#lm-icon), [LM-CONTENT-CARD](#lm-content-card), [LM-MEDIA](#lm-media). Consumidores estáticos en el JSON.

<a id="lm-product-list"></a>
### LM-PRODUCT-LIST · Listados y recomendaciones de producto

**Disponibilidad actual:** composición de sección. Entrada: [lemoon-featured-products.liquid](../../sections/lemoon-featured-products.liquid). Listas/recomendaciones conservan colección, carga y vacío en su dueño. [Receta de integración](../components/recipes/product-card-grid.md).

**Fuentes:** [sections/featured-collection.liquid](../../sections/featured-collection.liquid), [sections/featured-product.liquid](../../sections/featured-product.liquid), [sections/lemoon-featured-products.liquid](../../sections/lemoon-featured-products.liquid), [sections/related-products.liquid](../../sections/related-products.liquid), [sections/collection-list.liquid](../../sections/collection-list.liquid), [sections/main-list-collections.liquid](../../sections/main-list-collections.liquid), [sections/cart-upsell-row.liquid](../../sections/cart-upsell-row.liquid), [assets/lemoon-featured-products.js](../../assets/lemoon-featured-products.js), [assets/template-collection.css](../../assets/template-collection.css), [assets/section-featured-product.css](../../assets/section-featured-product.css), [assets/section-related-products.css](../../assets/section-related-products.css), [assets/component-complementary-products.css](../../assets/component-complementary-products.css), [assets/section-collection-list.css](../../assets/section-collection-list.css).

**Contrato actual.** Colección/producto, limit/columns, sliders y presentation settings; Lemoon featured: collection_source(collection/optical/sun), initial_products/products_to_show/max_products_to_load,defer_load,randomize,show_quick_add. Recomendaciones Shopify via product-recommendations; upsell consume cart y colección/settings. Featured-product conserva bloques PDP y dominio buy-buttons.

**Variantes existentes.** Grid/slider, related/complementary/upsell, lista de colecciones, producto destacado con formulario; existencia en source no prueba recomendación live.

**CSS y excepciones.** Card común más section CSS y overrides locales; no forzar mismo grid/typography a todos.

**Estados observados / aplicabilidad:** Normal: Cards/lista; Hover: Cards y controles; Foco: Links/controles; Seleccionado: Índice carrusel/variante según bloque; Loading: Deferred fetch y skeleton/hidden según consumidor; Error: Catch o ausencia productos según fuente; no recuperación universal; Disabled: Controles en límites, quick-add según disponibilidad.

**Responsive.** Columns mobile/desktop y swipe; carrusel usa ResizeObserver/IntersectionObserver según JS. **Accesibilidad.** Preservar IDs de sección/recommendations, ARIA carousel y attrs de bloques de producto.

**JS.** lemoon-featured-products.js, global ProductRecommendations, product-form y controladores PDP donde usados. **Reutilización actual.** Composición reutiliza card; mantener carga/aleatorización/recomendación separadas de tarjeta.

**Dependencias de composición:** [LM-PRODUCT-CARD](#lm-product-card), [LM-CONTENT-CARD](#lm-content-card), [LM-SLIDER](#lm-slider), [LM-PURCHASE](#lm-purchase). Consumidores estáticos en el JSON.

<a id="lm-plp"></a>
### LM-PLP · Colección y PLP

**Disponibilidad actual:** composición de sección. Entrada: [main-collection-product-grid.liquid](../../sections/main-collection-product-grid.liquid). Grid y sidebar locales; no migrar sort de colección al piloto de búsqueda. [Receta de integración](../components/recipes/product-card-grid.md).

**Fuentes:** [sections/main-collection-banner.liquid](../../sections/main-collection-banner.liquid), [sections/main-collection-product-grid.liquid](../../sections/main-collection-product-grid.liquid), [snippets/lemoon-collection-copy.liquid](../../snippets/lemoon-collection-copy.liquid), [snippets/lemoon-collection-intro.liquid](../../snippets/lemoon-collection-intro.liquid), [snippets/lemoon-collection-promo.liquid](../../snippets/lemoon-collection-promo.liquid), [snippets/lemoon-plp-product-page.liquid](../../snippets/lemoon-plp-product-page.liquid), [assets/lemoon-collection-plp.css](../../assets/lemoon-collection-plp.css), [assets/lemoon-collection-plp.js](../../assets/lemoon-collection-plp.js), [assets/component-collection-hero.css](../../assets/component-collection-hero.css), [templates/collection.carousel.liquid](../../templates/collection.carousel.liquid), [templates/collection.carousel-accessories.liquid](../../templates/collection.carousel-accessories.liquid).

**Contrato actual.** Collection/banner copy consume collection y metacampos/settings; grid products_per_page/mobile,columns,filtering/sorting y show_demo_content; paginate collection.products y render plp-product-page. Carousel templates Liquid son endpoints de composición; no render de theme block.

**Variantes existentes.** Banner/intro/promo, sidebar/drawer filtros, grid mobile toggle, sort menu, vacío, paginación y endpoints carousel.

**CSS y excepciones.** Overrides .lemoon-plp*; columnas fallback3 desktop/2 intermedio/móvil configurable; nombre15/14/13 y precio17/16 locales; no parámetros globales nuevos.

**Estados observados / aplicabilidad:** Normal: Colección/cards/count; Hover: Sort/filter/grid toggles; Foco: Controles y retorno AJAX; Seleccionado: Grid mode y filtros; Loading: facets/loading; Error: Vacío conserva salida; error de red no recuperación garantizada; Disabled: Facets sin count; controls de carrusel por límite.

**Responsive.** 750/990 layout y1280 gutters; sidebar264/220 y drawer320 como DESIGN. **Accesibilidad.** Preservar forms/param names, ProductGridContainer/FacetFiltersForm, live counts e historial.

**JS.** facets.js + lemoon-collection-plp.js; template carousel consumido por featured-products. **Reutilización actual.** Composición específica; no extraer motor de catálogo al átomo card.

**Dependencias de composición:** [LM-FACET](#lm-facet), [LM-PRODUCT-CARD](#lm-product-card), [LM-NAV](#lm-nav), [LM-FEEDBACK](#lm-feedback). Consumidores estáticos en el JSON.

<a id="lm-pdp"></a>
### LM-PDP · PDP estándar y óptica

**Disponibilidad actual:** composición de sección. Entrada: [lemoon-eyewear-product.liquid](../../sections/lemoon-eyewear-product.liquid). Preservar variantes, sticky purchase y herramientas; heading genérico no reemplaza product-heading. [Receta de integración](../components/recipes/product-card-grid.md).

**Fuentes:** [sections/main-product.liquid](../../sections/main-product.liquid), [sections/lemoon-eyewear-product.liquid](../../sections/lemoon-eyewear-product.liquid), [snippets/lemoon-product-heading.liquid](../../snippets/lemoon-product-heading.liquid), [snippets/lemoon-product-sku.liquid](../../snippets/lemoon-product-sku.liquid), [snippets/lemoon-sticky-purchase.liquid](../../snippets/lemoon-sticky-purchase.liquid), [snippets/product-variant-picker.liquid](../../snippets/product-variant-picker.liquid), [assets/product-info.js](../../assets/product-info.js), [assets/lemoon-eyewear-product.js](../../assets/lemoon-eyewear-product.js), [assets/lemoon-pdp-layout.css](../../assets/lemoon-pdp-layout.css), [assets/lemoon-eyewear-product.css](../../assets/lemoon-eyewear-product.css), [assets/section-main-product.css](../../assets/section-main-product.css).

**Contrato actual.** Producto, variantes/media/metafields custom y reviews; bloques estándar text/title/price/sku/inventory/quantity/variant/buy/description/share/custom/disclosures/collapsible_tab/popup/rating/complementary/icon-with-text/@app; óptica lens_info/@app. product-info actualiza sección/precio/media por variante, optical usa data-variants y controlador propio. Sticky product + settings.lemoon_sticky_purchase.

**Variantes existentes.** PDP estándar Dawn adaptada y optical, mobile summary movido por JS, favourite localStorage, sticky CTA, SKU/stock/promo, información/drawer y reviews slot @app.

**CSS y excepciones.** lemoon-pdp-layout y eyewear CSS se superponen sobre Dawn; header/title/card prices mantienen excepciones. Sticky es composición comercial, no barra genérica.

**Estados observados / aplicabilidad:** Normal: Variante seleccionada y datos; Hover: Controles/media; Foco: Selección/diálogos/acciones; Seleccionado: Radio/selected variante, favorito aria-pressed; Loading: Cambio variante/cart, media diferida; Error: Error local y stock real; Disabled: Variantes/compra según available y guards.

**Responsive.** Layout desktop/móvil; mobile summary cambia DOM y gallery bleed mediante pdp-tools; no afirmar orden final desde Liquid solo. **Accesibilidad.** Conservar product-info ID, section/product IDs, JSON variant, form association, title/SKU/status hooks, editor attrs y foco.

**JS.** product-info/global variants y módulos Dawn; lemoon-eyewear-product.js con validatePrescription; pdp-tools para sticky/medidas/media. **Reutilización actual.** Snippets parciales ya compartidos; dos orquestadores comerciales siguen separados. No migrar toda PDP en un paso.

**Dependencias de composición:** [LM-MEDIA](#lm-media), [LM-PRICE](#lm-price), [LM-SWATCH](#lm-swatch), [LM-TABS](#lm-tabs), [LM-PURCHASE](#lm-purchase), [LM-LABEL](#lm-label). Consumidores estáticos en el JSON.

<a id="lm-purchase"></a>
### LM-PURCHASE · Formulario de compra y destinatario

**Disponibilidad actual:** reutilizable. Entrada: [buy-buttons.liquid](../../snippets/buy-buttons.liquid). Producto, block y product_form_id; checkout/destinatario nunca pasan al átomo action. [Receta de integración](../components/recipes/product-card-grid.md).

**Fuentes:** [snippets/buy-buttons.liquid](../../snippets/buy-buttons.liquid), [snippets/gift-card-recipient-form.liquid](../../snippets/gift-card-recipient-form.liquid), [assets/product-form.js](../../assets/product-form.js), [assets/recipient-form.js](../../assets/recipient-form.js), [assets/quick-add.js](../../assets/quick-add.js), [assets/quick-add-bulk.js](../../assets/quick-add-bulk.js).

**Contrato actual.** buy-buttons product,block,product_form_id,section_id,show_pickup_availability; variantes, inventory policy/rule y requires_selling_plan permanecen dominio. Form product id/quantity/properties y checkout dinámico. Recipient product,form,section y propiedades Shopify Recipient email/name/message/send_on/timezone según fuente. Quick-add modal/bulk conserva section rendering y eventos cart.

**Variantes existentes.** Frame-only/configure lenses; add-to-cart producto/gift; dynamic checkout; quick-add modal/bulk; destinatario opcional y errores inline.

**CSS y excepciones.** Botón usa LM-ACTION; forma y errores product-form__*, local quick-add styles. Nunca renderizar payment_button como átomo demostrativo conectado a compra real.

**Estados observados / aplicabilidad:** Normal: Formulario disponible; Hover: Botones; Foco: Foco y errors; Seleccionado: Variante/recipient checked; Loading: .loading/aria-disabled y guard de duplicados; Error: role alert y recuperación del formulario; Disabled: Stock/unavailable/quantity-rule; no CSS solo.

**Responsive.** Full-width botones y ajustes quick-add; recipient fields apilan localmente. **Accesibilidad.** Conservar product_form_id, hidden id, submit name=add, block attrs, error wrappers, localizaciones, cart sections y recipient property names.

**JS.** product-form.js POST/cart pubsub/standard-actions; recipient-form.js; quick-add y bulk con render de secciones. **Reutilización actual.** Unidad comercial reutilizada, no extraer fetch/payment/variante a botón visual; API padre gobierna envío.

**Dependencias de composición:** [LM-ACTION](#lm-action), [LM-FIELD](#lm-field), [LM-FEEDBACK](#lm-feedback), [LM-OVERLAY](#lm-overlay). Consumidores estáticos en el JSON.

<a id="lm-config"></a>
### LM-CONFIG · Configurador de lentes y receta

**Disponibilidad actual:** composición de sección. Entrada: [lens-configurator.liquid](../../sections/lens-configurator.liquid). Elegibilidad, receta y precios siguen en configurador y contrato de integración. [Receta de integración](../components/recipes/product-card-grid.md).

**Fuentes:** [sections/lens-configurator.liquid](../../sections/lens-configurator.liquid), [snippets/lemoon-prescription-fields.liquid](../../snippets/lemoon-prescription-fields.liquid), [assets/lens-configurator.js](../../assets/lens-configurator.js).

**Contrato actual.** Form multipart product usa variants/options y JSON data-lens-data; flow steps use/prescription/crystal/index/extra/review condicionados por catálogo. validatePrescription importada de optical; props OD/OI esfera(-20..10,.25), cilindro(-6..6,.25), eje(0..180), adición(.25..4), PD40..80,.5. Upload PDF/JPG/PNG y panel/inputs disabled hasta modo correcto.

**Variantes existentes.** Flujo dedicated; receta manual/upload y alternativa frame-only. Optical contiene flujo diferente con later/manual/upload; no son visualmente intercambiables ni capacidad aprobada por inventario.

**CSS y excepciones.** CSS inline .lemoon-lens-flow* y fields/choice locales; preservar indicadores de progreso y total sin declarar reglas de negocio nuevas.

**Estados observados / aplicabilidad:** Normal: Elección y resumen; Hover: Choice/acciones; Foco: Heading de paso y controls; Seleccionado: Radios y catálogo dependiente; Loading: POST y bloqueo submit; Error: Errores receta/catalogue/cart localizados; Disabled: Inputs de modo inactivo disabled; no variante válida bloquea compra.

**Responsive.** Grid receta dos ojos y paso apilan por CSS local; scroll/focus por controlador. **Accesibilidad.** Preservar names properties, enctype, accept, min/max/step, labels,hints,error live y variante resuelta; nunca leer/guardar recetas reales en catálogo.

**JS.** lens-configurator.js importa validatePrescription; resuelve variante real y POST addUrl; readiness LEM-23/24/93 no inferida. **Reutilización actual.** Formulario comercial completo; solo extraer presentación de campo/choice tras aislar resolución y serialización.

**Dependencias de composición:** [LM-CHOICE](#lm-choice), [LM-FIELD](#lm-field), [LM-RANGE](#lm-range), [LM-PURCHASE](#lm-purchase), [LM-FEEDBACK](#lm-feedback). Consumidores estáticos en el JSON.

<a id="lm-cart"></a>
### LM-CART · Carrito, drawer y notificación

**Disponibilidad actual:** composición de sección. Entrada: [main-cart-items.liquid](../../sections/main-cart-items.liquid). Carrito nativo y fragmentos/drawer; estados y anuncios pertenecen al controlador. [Receta de integración](../components/recipes/product-card-grid.md).

**Fuentes:** [sections/main-cart-items.liquid](../../sections/main-cart-items.liquid), [sections/main-cart-footer.liquid](../../sections/main-cart-footer.liquid), [sections/cart-drawer.liquid](../../sections/cart-drawer.liquid), [sections/cart-icon-bubble.liquid](../../sections/cart-icon-bubble.liquid), [sections/cart-notification-button.liquid](../../sections/cart-notification-button.liquid), [sections/cart-notification-product.liquid](../../sections/cart-notification-product.liquid), [snippets/cart-drawer.liquid](../../snippets/cart-drawer.liquid), [snippets/cart-notification.liquid](../../snippets/cart-notification.liquid), [assets/cart.js](../../assets/cart.js), [assets/cart-drawer.js](../../assets/cart-drawer.js), [assets/cart-notification.js](../../assets/cart-notification.js), [assets/lemoon-cart-page.css](../../assets/lemoon-cart-page.css), [assets/component-cart.css](../../assets/component-cart.css), [assets/component-cart-items.css](../../assets/component-cart-items.css), [assets/component-cart-drawer.css](../../assets/component-cart-drawer.css), [assets/component-cart-notification.css](../../assets/component-cart-notification.css). [snippets/lemoon-cart-tax-note.liquid](../../snippets/lemoon-cart-tax-note.liquid).

**Contrato actual.** cart.items/count/discounts/totals/note, item properties/selling_plan/quantity rules y sections AJAX; main-cart-footer bloques subtotal/buttons/@app. Drawer wrapper render cart-drawer; bubble/notification fragments son respuestas parciales. No simplificar cart item a card visual sin identidad de línea/key.

**Variantes existentes.** Página/cart-items, drawer/empty, cart-notification, line errors/loading, note, descuentos/totales y checkout. Checkout/link/payment pertenecen plataforma, no nueva UI implementada aquí.

**CSS y excepciones.** lemoon-cart-page y Dawn cart/drawer/items/discounts/totals; drawer ancho y espacio propios; no migrar commerce con cambios de tokens.

**Estados observados / aplicabilidad:** Normal: Líneas/resumen o vacío; Hover: Remove/checkout/links; Foco: Cart trap tras transitionend y retorno opener; Seleccionado: Nota/cantidad según estado; Loading: Spinners por línea, aria-disabled y live updates; Error: Stock/network mensajes según cart.js; Disabled: Acciones por guard/stock; cantidad corregible.

**Responsive.** Tabla desktop y filas móvil; drawer scroll interno/overlay y footer propio. **Accesibilidad.** Conservar IDs CartDrawer/Overlay/cart-icon-bubble, line index/key, live regions, data-index, quantity names y block attrs.

**JS.** cart.js pubsub + cart-drawer/cart-notification + cart-disclosure-*; estados de red/stock requieren prueba real futura. **Reutilización actual.** Unidades comerciales compartidas y fila repetida página/drawer; primero wrappers visuales, luego línea solo con pruebas específicas.

**Dependencias de composición:** [LM-RANGE](#lm-range), [LM-PRICE](#lm-price), [LM-PURCHASE](#lm-purchase), [LM-OVERLAY](#lm-overlay), [LM-FEEDBACK](#lm-feedback). Consumidores estáticos en el JSON.

<a id="lm-bulk"></a>
### LM-BULK · Pedidos rápidos y volumen

**Disponibilidad actual:** reutilizable. Entrada: [quick-order-list.liquid](../../snippets/quick-order-list.liquid). Pedidos rápidos/volumen con cantidades y controlador propios; revisar consumidor efectivo antes de usar. [Receta de integración](../components/recipes/product-card-grid.md).

**Fuentes:** [sections/quick-order-list.liquid](../../sections/quick-order-list.liquid), [sections/bulk-quick-order-list.liquid](../../sections/bulk-quick-order-list.liquid), [snippets/quick-order-list.liquid](../../snippets/quick-order-list.liquid), [snippets/quick-order-list-row.liquid](../../snippets/quick-order-list-row.liquid), [snippets/quick-order-product-row.liquid](../../snippets/quick-order-product-row.liquid), [assets/quick-order-list.js](../../assets/quick-order-list.js), [assets/quick-order-list.css](../../assets/quick-order-list.css).

**Contrato actual.** quick-order-list product,show_image,show_sku,is_modal; row item,sku,image,variant,show_image,show_sku,is_modal y contexto cart/quantity price breaks; bulk section paginas de colección. Firmas adicionales en las fuentes canónicas enlazadas; no equivalen a simple quantity picker.

**Variantes existentes.** Tabla variantes, filas producto bulk, modal, remove-all, cantidades/volume pricing y total/status.

**CSS y excepciones.** CSS quick-order-list/quantity-popover/progress y clases Dawn; reglas de tabla y sticky propias.

**Estados observados / aplicabilidad:** Normal: Tabla actual; Hover: Controles/links; Foco: Tabla y inputs; Seleccionado: Cantidad; Loading: Cola updates/debounce y progreso; Error: Errores por fila/globales; Disabled: Límites quantity rules y guards.

**Responsive.** Tabla overflow y columnas condicionales show_image/SKU; revisar encabezados al contraer. **Accesibilidad.** Conservar captions, th, labels, IDs variantes, live regions y botones remove-all.

**JS.** quick-order-list.js, quick-add-bulk.js, global BulkAdd, price-per-item y quantity-popover. **Reutilización actual.** Fila/list compartidas con lógica comercial densa; no priorizar como piloto visual.

**Dependencias de composición:** [LM-RANGE](#lm-range), [LM-PRICE](#lm-price), [LM-PURCHASE](#lm-purchase), [LM-FEEDBACK](#lm-feedback). Consumidores estáticos en el JSON.

<a id="lm-pickup"></a>
### LM-PICKUP · Disponibilidad de retiro

**Disponibilidad actual:** composición de sección. Entrada: [pickup-availability.liquid](../../sections/pickup-availability.liquid). Fragmento asíncrono nativo, disponibilidad y errores reales; no prometer stock con una demo. [Receta de integración](../components/recipes/product-card-grid.md).

**Fuentes:** [sections/pickup-availability.liquid](../../sections/pickup-availability.liquid), [assets/pickup-availability.js](../../assets/pickup-availability.js), [assets/component-pickup-availability.css](../../assets/component-pickup-availability.css).

**Contrato actual.** Section AJAX consume product_variant.store_availabilities, pickup_enabled/local availability; buy-buttons instancia pickup-availability con variant-id/root-url. Direcciones/location son contratos, sin consultar datos live.

**Variantes existentes.** Preview disponible/no disponible, drawer de ubicaciones y botón refresh en error.

**CSS y excepciones.** CSS pickup específico; no es badge genérico de stock.

**Estados observados / aplicabilidad:** Normal: Preview y ubicación; Hover: Open/refresh; Foco: Drawer y cierre; Seleccionado: Variante; Loading: Fetch availability; Error: Error template y refresh; Disabled: Sin variante/disponibilidad según fuente.

**Responsive.** Drawer local viewport/scroll; mantener dirección legible. **Accesibilidad.** Conservar aria/dialog, retorno opener y texto disponible/no disponible.

**JS.** pickup-availability.js con fetch sección y drawer propio. **Reutilización actual.** Unidad ya separada por servicio; no mezclar API de ubicaciones con visual atom.

**Dependencias de composición:** [LM-OVERLAY](#lm-overlay), [LM-FEEDBACK](#lm-feedback). Consumidores estáticos en el JSON.

<a id="lm-contact"></a>
### LM-CONTACT · Contacto y grupos de formulario

**Disponibilidad actual:** composición de sección. Entrada: [lemoon-contact-page.liquid](../../sections/lemoon-contact-page.liquid). Formulario Shopify conserva valores, errores y respuesta; controles presentan esos datos. [Receta de integración](../components/recipes/contact-form.md).

**Fuentes:** [sections/contact-form.liquid](../../sections/contact-form.liquid), [sections/lemoon-contact-page.liquid](../../sections/lemoon-contact-page.liquid).

**Contrato actual.** Form contact nativo; name,email,tel,body con values/form.errors/customer fallback. Lemoon page exige name/email/body, hint de body, contact_email/hours/whatsapp settings y demo_content opcional. Dawn contact es otra composición.

**Variantes existentes.** Formulario normal/error/success; panel de canales/FAQ; demo separado de datos confirmados.

**CSS y excepciones.** CSS Dawn section-contact-form y .lemoon-contact inline; labels persistentes locales, no asumir todos usan .field.

**Estados observados / aplicabilidad:** Normal: Campos y canales; Hover: Submit/links; Foco: Error/status autofocus y campos; Seleccionado: No aplica salvo controles; Loading: POST nativo sin spinner universal; Error: email aria-invalid/describedby, alert y valores conservados; Disabled: Required/constraints; no disabled universal.

**Responsive.** Columnas a una móvil y padding schema750; Media queries exactas en las fuentes enlazadas. **Accesibilidad.** Preservar label-for, IDs por sección, error email, status/live y hint; no extraer contacto como un único input.

**JS.** Formulario nativo Shopify; no nuevo controlador inventado. **Reutilización actual.** Contacto Lemoon usa field/message/action/heading; formulario Shopify y envío permanecen en la sección. Contacto Dawn conserva su variante local.

**Dependencias de composición:** [LM-ACTION](#lm-action), [LM-FEEDBACK](#lm-feedback), [LM-FIELD](#lm-field), [LM-TYPE](#lm-type). Consumidores estáticos en el JSON.

<a id="lm-legal"></a>
### LM-LEGAL · Páginas legales, guías y servicios

**Disponibilidad actual:** composición de sección. Entrada: [lemoon-guide-page.liquid](../../sections/lemoon-guide-page.liquid). Guías/servicios y shell legal tienen settings y tipografía propios; conservar políticas nativas. [Receta de integración](../components/recipes/guide-help.md).

**Fuentes:** [sections/lemoon-legal-page.liquid](../../sections/lemoon-legal-page.liquid), [sections/lemoon-guide-page.liquid](../../sections/lemoon-guide-page.liquid), [sections/lemoon-service-page.liquid](../../sections/lemoon-service-page.liquid), [sections/lemoon-crystal-guide.liquid](../../sections/lemoon-crystal-guide.liquid), [assets/lemoon-legal-pages.css](../../assets/lemoon-legal-pages.css).

**Contrato actual.** Legal kind shipping/returns/terms/privacy/warranty, intro/page.content/help links/demo; guide_kind pedido/prescripcion/probador/rostro/medidas determina claves y steps; service kind benefits/operations, verified_details/image/demo; crystal-guide configurator_product. No confirma negocio, coberturas, reembolsos ni capacidad del configurador.

**Variantes existentes.** Shell legal + aside, guías paso/ilustración/ayuda, servicio con pasos/image, guía cristales y CTA.

**CSS y excepciones.** 66rem/24rem gap6.4rem legal según DESIGN; variantes guía/service locales; .rte y colores semánticos; muestras no son políticas oficiales.

**Estados observados / aplicabilidad:** Normal: Lectura y links; Hover: Links/CTA; Foco: Solo acciones; Seleccionado: No aplica; Loading: Media lazy; Error: No feedback universal; Disabled: No aplica salvo acciones.

**Responsive.** Legal apila bajo750 gap3.2rem; guía/service conservan media queries locales. **Accesibilidad.** Headings/listas/landmarks y enlaces de ayuda; no acreditar WCAG por estructura.

**JS.** Sin controlador propio de página; policy cookie help es LM-PRIVACY. **Reutilización actual.** Composiciones con markup inline duplicado; extraer shell solo tras campos/acciones y con contenido dueño validado.

**Dependencias de composición:** [LM-TYPE](#lm-type), [LM-ACTION](#lm-action), [LM-EDITORIAL](#lm-editorial). Consumidores estáticos en el JSON.

<a id="lm-journal"></a>
### LM-JOURNAL · Blog, artículo, comentarios y compartir

**Disponibilidad actual:** composición de sección. Entrada: [main-article.liquid](../../sections/main-article.liquid). Artículo/blog y comentarios nativos; article-card/share-button ya existen. [Receta de integración](../components/recipes/search-sort.md).

**Fuentes:** [sections/main-article.liquid](../../sections/main-article.liquid), [sections/main-blog.liquid](../../sections/main-blog.liquid), [sections/featured-blog.liquid](../../sections/featured-blog.liquid), [snippets/share-button.liquid](../../snippets/share-button.liquid), [assets/share.js](../../assets/share.js), [assets/section-blog-post.css](../../assets/section-blog-post.css), [assets/section-main-blog.css](../../assets/section-main-blog.css), [assets/section-featured-blog.css](../../assets/section-featured-blog.css).

**Contrato actual.** Blog articles/paginate y show_image/date/author/newsletter; artículo bloques featured_image/title/content/share/@app, comments y form new_comment; share-button share_link,block con settings.share_label; nativo share o clipboard fallback.

**Variantes existentes.** Journal feature+list/newsletter; article editorial/default, hero/cuerpo/explore/comments/moderación; share details/copy success.

**CSS y excepciones.** Editorial typography y media crop locales, article-card reutilizado para lista; newsletter local conserva consentimiento.

**Estados observados / aplicabilidad:** Normal: Lectura/lista/formulario; Hover: Links/share; Foco: Form y details/share status; Seleccionado: No aplica; Loading: Share async si API; Error: Form errors/comment moderation y copy feedback según fuente; Disabled: No disabled global.

**Responsive.** Grid editorial y ancho lectura propios, comments/name/email a una columna según CSS. **Accesibilidad.** Conservar headings, author/date, comments IDs/pagination, labels/errors, share status y retorno.

**JS.** share.js; POST comentarios/newsletter nativos; no prueba entrega email/comentario. **Reutilización actual.** Card compartida; hero editorial, newsletter y form comment locales; candidate sólo wrappers visuales.

**Dependencias de composición:** [LM-CONTENT-CARD](#lm-content-card), [LM-NAV](#lm-nav), [LM-FIELD](#lm-field), [LM-FEEDBACK](#lm-feedback). Consumidores estáticos en el JSON.

<a id="lm-quiz"></a>
### LM-QUIZ · Quiz de estilo

**Disponibilidad actual:** composición de sección. Entrada: [lemoon-style-quiz.liquid](../../sections/lemoon-style-quiz.liquid). Flujo y estado pertenecen a su JS; no se extrae un motor de quiz. [Receta de integración](../components/recipes/catalogue-states.md).

**Fuentes:** [sections/lemoon-style-quiz.liquid](../../sections/lemoon-style-quiz.liquid), [assets/lemoon-style-quiz.js](../../assets/lemoon-style-quiz.js).

**Contrato actual.** Cuatro preguntas face/style/use/budget; frame blocks product,face,style,use; budget_low/high y catalogue. rankProducts descarta unavailable/IDs repetidos/precio inválido/fuera de tope, orden por matches con tie estable y slice0..3; sugerencias no son recomendación clínica.

**Variantes existentes.** Sin JS selección curada visible; con JS wizard con progreso/back/restart/error y máximo3 resultados; vacío mantiene catálogo.

**CSS y excepciones.** .lemoon-quiz inline, choices/cards propios; markup producto difiere card-product y no debe proclamarse átomo compartido.

**Estados observados / aplicabilidad:** Normal: Pregunta o catálogo sin JS; Hover: Choices y CTAs; Foco: Legend/results heading al avanzar; Seleccionado: Radio checked; Loading: No loader ranking local; discoverPriceParameter fetch con timeout; Error: Pregunta sin selección -> error/aria-invalid; catálogo price-param fallback; Disabled: No disabled universal; constraints del catálogo.

**Responsive.** Choices/cards apilan con CSS local; conservar orden preguntas/resultados. **Accesibilidad.** Fieldset/legend, progress/status, error ID y foco; no usar selección solo por color.

**JS.** lemoon-style-quiz.js, price-filter discover GET; sin carrito ni receta. **Reutilización actual.** Composición específica; sólo candidate choice/message/card de datos sintéticos, no algoritmo en atom.

**Dependencias de composición:** [LM-CHOICE](#lm-choice), [LM-FEEDBACK](#lm-feedback), [LM-ACTION](#lm-action). Consumidores estáticos en el JSON.

<a id="lm-gift"></a>
### LM-GIFT · Compra y visualización de gift card

**Disponibilidad actual:** composición de sección. Entrada: [lemoon-gift-card-purchase.liquid](../../sections/lemoon-gift-card-purchase.liquid). Compra y visualización emitida son superficies distintas; preservar formulario y datos nativos. [Receta de integración](../components/recipes/product-card-grid.md).

**Fuentes:** [sections/lemoon-gift-card-purchase.liquid](../../sections/lemoon-gift-card-purchase.liquid), [templates/gift_card.liquid](../../templates/gift_card.liquid), [assets/lemoon-gift-card-purchase.js](../../assets/lemoon-gift-card-purchase.js), [assets/lemoon-gift-card.js](../../assets/lemoon-gift-card.js), [assets/template-giftcard.css](../../assets/template-giftcard.css).

**Contrato actual.** Compra: gift_card_product o product con gift_card?; variantes reales de importe, cantidad1 y destinatario opcional properties Shopify. Display gift_card template usa code,balance,expires_on,enabled,qr_identifier, enlaces a shop.url y enlace opcional gift_card.pass_url para Apple Wallet; solo nombres de contrato inspeccionados, ningún código real leído.

**Variantes existentes.** Compra disponible/agotado/no configurado; recipient opcional con no-JS fallback; tarjeta emitida con copy/print/QR/Apple Wallet donde fuente permite.

**CSS y excepciones.** Purchase CSS inline distinto de template-giftcard; no unificar emitida con product-card.

**Estados observados / aplicabilidad:** Normal: Importe/estado tarjeta; Hover: Acciones; Foco: Inputs/copy/print; Seleccionado: Radio de importe; Loading: POST nativo sin JS; con JS addGiftCard AJAX valida id/quantity/endpoint/respuesta y redirige cart; Error: Email validation/errores form, POST no confirmado y no producto; Disabled: Variantes no disponibles disabled; submit según selección.

**Responsive.** Purchase columnas/apilado local; template emitida ancho/print propio. **Accesibilidad.** Conservar labels de importes, recipient props, QR alt, copy announcement; jamás poner datos emitidos en galería.

**JS.** gift-card-purchase.js intercepta submit, reportValidity, guard/button disabled, POST add.js, confirma variant_id/quantity, redirect cart o muestra error enfocable; sin JS formulario nativo. gift-card.js copy/print/QR. **Reutilización actual.** Flujo comercial aislado; ejemplos futuros puramente sintéticos no deben emitir ni comprar tarjetas.

**Dependencias de composición:** [LM-CHOICE](#lm-choice), [LM-FIELD](#lm-field), [LM-PRICE](#lm-price), [LM-FEEDBACK](#lm-feedback). Consumidores estáticos en el JSON.

<a id="lm-password"></a>
### LM-PASSWORD · Password, lanzamiento y newsletter banner

**Disponibilidad actual:** composición de sección. Entrada: [lemoon-launch-page.liquid](../../sections/lemoon-launch-page.liquid). Layout password y newsletter nativa tienen su cadena CSS y contexto propios. [Receta de integración](../components/recipes/guide-help.md).

**Fuentes:** [sections/lemoon-launch-page.liquid](../../sections/lemoon-launch-page.liquid), [sections/main-password-header.liquid](../../sections/main-password-header.liquid), [sections/main-password-footer.liquid](../../sections/main-password-footer.liquid), [sections/email-signup-banner.liquid](../../sections/email-signup-banner.liquid), [assets/lemoon-password.css](../../assets/lemoon-password.css), [assets/section-password.css](../../assets/section-password.css), [assets/section-email-signup-banner.css](../../assets/section-email-signup-banner.css), [assets/password-modal.js](../../assets/password-modal.js).

**Contrato actual.** Password header form storefront_password + errors, logo/store messages; footer enlaces admin/powered_by. Launch customer newsletter form email/required marketing consent; email-signup-banner heading/paragraph/email_form bloques y image/layout settings.

**Variantes existentes.** Password modal nativo Dawn details; launch newsletter success/error; banner email signup; no prueba tienda abierta ni envío email.

**CSS y excepciones.** Layout password NO carga global lemoon-components; CSS password/banner debe revisarse separado. Tokens comunes no implican controles idénticos.

**Estados observados / aplicabilidad:** Normal: Landing y formulario; Hover: Links/submit; Foco: Error y success enfocable, password input; Seleccionado: Consent checked; Loading: POST nativo; Error: form.errors y posted_successfully; Disabled: Required/constraints; no disabled universal.

**Responsive.** Password/launch estilos locales, banner image_height/mobile alignment. **Accesibilidad.** Preservar password form noindex/configuración layout, consentimiento y labels/IDs/errors.

**JS.** password-modal.js hereda DetailsModal; newsletter native POST. **Reutilización actual.** Newsletter repetido con layout específico; piloto no trasladar CSS global sin revisar cadena password.

**Dependencias de composición:** [LM-FIELD](#lm-field), [LM-OVERLAY](#lm-overlay), [LM-FEEDBACK](#lm-feedback). Consumidores estáticos en el JSON.

<a id="lm-utility"></a>
### LM-UTILITY · 404, contenido personalizado y apps

**Disponibilidad actual:** composición de sección. Entrada: [main-404.liquid](../../sections/main-404.liquid). 404/custom-liquid/apps conservan sus schemas y contenido; no fabricar un wrapper universal. [Receta de integración](../components/recipes/search-sort.md).

**Fuentes:** [sections/main-404.liquid](../../sections/main-404.liquid), [sections/custom-liquid.liquid](../../sections/custom-liquid.liquid), [sections/apps.liquid](../../sections/apps.liquid), [assets/customer.js](../../assets/customer.js).

**Contrato actual.** 404 título/texto/link catálogo; custom-liquid setting custom_liquid y color/padding; apps section bloques @app con include_margins; customer.js controla direcciones legacy pero no hay templates/customer en universo.

**Variantes existentes.** Fallback404, inyección editor Liquid, app slots y controlador direcciones retenido. No son catálogo de átomos ni cuenta nueva implementada.

**CSS y excepciones.** CSS global y padding section; apps/custom-liquid contenido desconocido en runtime, no inventariado como componente definido.

**Estados observados / aplicabilidad:** Normal: Contenido/slot; Hover: Acciones si hay; Foco: Acciones si hay; Seleccionado: No aplica al wrapper; Loading: App puede cargar; fuera de fuente local; Error: No error wrapper; Disabled: No aplica al wrapper.

**Responsive.** Padding750 y contenedor; app puede aportar comportamiento desconocido. **Accesibilidad.** Conservar attrs editor; accesibilidad del contenido de app/custom no inferible.

**JS.** customer.js standalone; scripts inyectados app fuera de inventario tracked. **Reutilización actual.** Wrappers existentes; no extraer ni inferir soporte cuenta/checkout desde estos archivos.

**Dependencias de composición:** [LM-SHELL](#lm-shell), [LM-ACTION](#lm-action). Consumidores estáticos en el JSON.

<a id="lm-gallery"></a>
### LM-GALLERY · Galería existente del sistema de diseño

**Disponibilidad actual:** composición de sección. Entrada: [lemoon-design-system.liquid](../../sections/lemoon-design-system.liquid). Renders extraídos + demos legacy identificadas; sin prueba comercial ni certificación WCAG. [Receta de integración](../components/recipes/catalogue-states.md).

**Fuentes:** [sections/lemoon-design-system.liquid](../../sections/lemoon-design-system.liquid), [assets/lemoon-design-system.css](../../assets/lemoon-design-system.css).

**Contrato actual.** Section sin settings/blocks; page.sistema-de-diseno la instancia. Renders reales de seis snippets UI en títulos, acciones, campos/select, mensajes y FAQ; swatches de paleta, tipografía de muestra, accent, choice/badges, product card y trust conservan markup demo propio.

**Variantes existentes.** Base primary/secondary/tertiary, disabled/loading; input/textarea/select y feedback sintéticos. Tarjeta propia lemoon-design-system__product-card y accent/success siguen siendo muestras locales, no variantes globales.

**CSS y excepciones.** Estilos independientes incluidos radios y crop cover demo que difiere contain de card-product. Literales de color/acento/success locales; no promover a tokens ni contrato.

**Estados observados / aplicabilidad:** Normal: Presentación sintética; Hover: Acciones sin operación comercial; Foco: Controles migrados con corrección scoped; Seleccionado: Select/radio nativos; Loading: Action sintético; Error: Campo/mensaje sintético sin anuncio simultáneo; Disabled: Action/campo nativos de muestra; readonly separado.

**Responsive.** Media query749 con swatches2 cols y resto apilado. **Accesibilidad.** Select migrado con label persistente, IDs de controles/FAQ contextualizados y ejemplos nuevos localizados; otros textos/IDs legacy permanecen. La fuente y las demos no certifican WCAG.

**JS.** Sin JS propio ni POST. **Reutilización actual.** Seis renders UI ejecutables junto a elementos legacy/demo conservados; revisión de estado actual en la receta de galería.

**Dependencias de composición:** [LM-ACTION](#lm-action), [LM-CHOICE](#lm-choice), [LM-DISCLOSURE](#lm-disclosure), [LM-FEEDBACK](#lm-feedback), [LM-FIELD](#lm-field), [LM-ICON](#lm-icon), [LM-TYPE](#lm-type). Consumidores estáticos en el JSON.

<a id="section-matrix"></a>
## Matriz de secciones y bloques locales

Esta matriz asigna **las 68 secciones**, incluidos los endpoints sin schema. Las 81 declaraciones se resumen debajo; IDs/tipos de settings, contratos de sección, forms/controles/metafields se consultan en cada fuente canónica enlazada. El JSON conserva la asignación y consumidores por familia; el escaneo detallado se entrega como evidencia aparte. Que una sección o un bloque no tenga referencia de template no autoriza borrarlo; puede entrar desde layout, render de sección, editor, API de fragmentos o app.

| Sección | Familia principal | Tipos de bloque locales / app |
| --- | --- | --- |
| [sections/announcement-bar.liquid](../../sections/announcement-bar.liquid) | [LM-HERO](#lm-hero) | `announcement` |
| [sections/apps.liquid](../../sections/apps.liquid) | [LM-UTILITY](#lm-utility) | `@app` |
| [sections/bulk-quick-order-list.liquid](../../sections/bulk-quick-order-list.liquid) | [LM-BULK](#lm-bulk) | Sin bloques declarados |
| [sections/cart-drawer.liquid](../../sections/cart-drawer.liquid) | [LM-CART](#lm-cart) | Fragmento sin schema |
| [sections/cart-icon-bubble.liquid](../../sections/cart-icon-bubble.liquid) | [LM-CART](#lm-cart) | Fragmento sin schema |
| [sections/cart-live-region-text.liquid](../../sections/cart-live-region-text.liquid) | [LM-FEEDBACK](#lm-feedback) | Fragmento sin schema |
| [sections/cart-notification-button.liquid](../../sections/cart-notification-button.liquid) | [LM-CART](#lm-cart) | Fragmento sin schema |
| [sections/cart-notification-product.liquid](../../sections/cart-notification-product.liquid) | [LM-CART](#lm-cart) | Fragmento sin schema |
| [sections/cart-upsell-row.liquid](../../sections/cart-upsell-row.liquid) | [LM-PRODUCT-LIST](#lm-product-list) | `product` |
| [sections/collage.liquid](../../sections/collage.liquid) | [LM-EDITORIAL](#lm-editorial) | `image`, `product`, `collection`, `video` |
| [sections/collapsible-content.liquid](../../sections/collapsible-content.liquid) | [LM-DISCLOSURE](#lm-disclosure) | `collapsible_row` |
| [sections/collection-list.liquid](../../sections/collection-list.liquid) | [LM-PRODUCT-LIST](#lm-product-list) | `featured_collection` |
| [sections/contact-form.liquid](../../sections/contact-form.liquid) | [LM-CONTACT](#lm-contact) | Sin bloques declarados |
| [sections/custom-liquid.liquid](../../sections/custom-liquid.liquid) | [LM-UTILITY](#lm-utility) | Sin bloques declarados |
| [sections/disclosures.liquid](../../sections/disclosures.liquid) | [LM-DISCLOSURE](#lm-disclosure) | Sin bloques declarados |
| [sections/email-signup-banner.liquid](../../sections/email-signup-banner.liquid) | [LM-PASSWORD](#lm-password) | `heading`, `paragraph`, `email_form` |
| [sections/featured-blog.liquid](../../sections/featured-blog.liquid) | [LM-JOURNAL](#lm-journal) | Sin bloques declarados |
| [sections/featured-collection.liquid](../../sections/featured-collection.liquid) | [LM-PRODUCT-LIST](#lm-product-list) | Sin bloques declarados |
| [sections/featured-product.liquid](../../sections/featured-product.liquid) | [LM-PRODUCT-LIST](#lm-product-list) | `@app`, `text`, `title`, `price`, `sku`, `quantity_selector`, `variant_picker`, `buy_buttons`, `share`, `custom_liquid`, `disclosures`, `rating`, `icon-with-text` |
| [sections/footer.liquid](../../sections/footer.liquid) | [LM-FOOTER](#lm-footer) | `@app`, `navigation_column`, `legal_links` |
| [sections/header.liquid](../../sections/header.liquid) | [LM-HEADER](#lm-header) | `@app`, `drawer_primary`, `drawer_utility`, `drawer_subitem` |
| [sections/how-it-works.liquid](../../sections/how-it-works.liquid) | [LM-EDITORIAL](#lm-editorial) | `step` |
| [sections/image-banner.liquid](../../sections/image-banner.liquid) | [LM-HERO](#lm-hero) | `heading`, `text`, `buttons` |
| [sections/image-with-text.liquid](../../sections/image-with-text.liquid) | [LM-EDITORIAL](#lm-editorial) | `heading`, `caption`, `text`, `button` |
| [sections/lemoon-about-page.liquid](../../sections/lemoon-about-page.liquid) | [LM-EDITORIAL](#lm-editorial) | Sin bloques declarados |
| [sections/lemoon-about.liquid](../../sections/lemoon-about.liquid) | [LM-EDITORIAL](#lm-editorial) | Sin bloques declarados |
| [sections/lemoon-contact-page.liquid](../../sections/lemoon-contact-page.liquid) | [LM-CONTACT](#lm-contact) | Sin bloques declarados |
| [sections/lemoon-crystal-guide.liquid](../../sections/lemoon-crystal-guide.liquid) | [LM-LEGAL](#lm-legal) | Sin bloques declarados |
| [sections/lemoon-design-system.liquid](../../sections/lemoon-design-system.liquid) | [LM-GALLERY](#lm-gallery) | Sin bloques declarados |
| [sections/lemoon-eyewear-product.liquid](../../sections/lemoon-eyewear-product.liquid) | [LM-PDP](#lm-pdp) | `@app`, `lens_info` |
| [sections/lemoon-faq-page.liquid](../../sections/lemoon-faq-page.liquid) | [LM-DISCLOSURE](#lm-disclosure) | `question` |
| [sections/lemoon-faq.liquid](../../sections/lemoon-faq.liquid) | [LM-DISCLOSURE](#lm-disclosure) | `question` |
| [sections/lemoon-featured-products.liquid](../../sections/lemoon-featured-products.liquid) | [LM-PRODUCT-LIST](#lm-product-list) | Sin bloques declarados |
| [sections/lemoon-gift-card-purchase.liquid](../../sections/lemoon-gift-card-purchase.liquid) | [LM-GIFT](#lm-gift) | Sin bloques declarados |
| [sections/lemoon-guide-page.liquid](../../sections/lemoon-guide-page.liquid) | [LM-LEGAL](#lm-legal) | Sin bloques declarados |
| [sections/lemoon-hero.liquid](../../sections/lemoon-hero.liquid) | [LM-HERO](#lm-hero) | `slide` |
| [sections/lemoon-launch-page.liquid](../../sections/lemoon-launch-page.liquid) | [LM-PASSWORD](#lm-password) | Sin bloques declarados |
| [sections/lemoon-legal-page.liquid](../../sections/lemoon-legal-page.liquid) | [LM-LEGAL](#lm-legal) | Sin bloques declarados |
| [sections/lemoon-service-page.liquid](../../sections/lemoon-service-page.liquid) | [LM-LEGAL](#lm-legal) | Sin bloques declarados |
| [sections/lemoon-shop-by-shape.liquid](../../sections/lemoon-shop-by-shape.liquid) | [LM-EDITORIAL](#lm-editorial) | `shape` |
| [sections/lemoon-style-quiz.liquid](../../sections/lemoon-style-quiz.liquid) | [LM-QUIZ](#lm-quiz) | `frame` |
| [sections/lens-configurator.liquid](../../sections/lens-configurator.liquid) | [LM-CONFIG](#lm-config) | Sin bloques declarados |
| [sections/lifestyle-mood-grid.liquid](../../sections/lifestyle-mood-grid.liquid) | [LM-EDITORIAL](#lm-editorial) | `mood` |
| [sections/main-404.liquid](../../sections/main-404.liquid) | [LM-UTILITY](#lm-utility) | Sin bloques declarados |
| [sections/main-article.liquid](../../sections/main-article.liquid) | [LM-JOURNAL](#lm-journal) | `@app`, `featured_image`, `title`, `content`, `share` |
| [sections/main-blog.liquid](../../sections/main-blog.liquid) | [LM-JOURNAL](#lm-journal) | Sin bloques declarados |
| [sections/main-cart-footer.liquid](../../sections/main-cart-footer.liquid) | [LM-CART](#lm-cart) | `subtotal`, `buttons`, `@app` |
| [sections/main-cart-items.liquid](../../sections/main-cart-items.liquid) | [LM-CART](#lm-cart) | Sin bloques declarados |
| [sections/main-collection-banner.liquid](../../sections/main-collection-banner.liquid) | [LM-PLP](#lm-plp) | Sin bloques declarados |
| [sections/main-collection-product-grid.liquid](../../sections/main-collection-product-grid.liquid) | [LM-PLP](#lm-plp) | Sin bloques declarados |
| [sections/main-list-collections.liquid](../../sections/main-list-collections.liquid) | [LM-PRODUCT-LIST](#lm-product-list) | Sin bloques declarados |
| [sections/main-page.liquid](../../sections/main-page.liquid) | [LM-TYPE](#lm-type) | Sin bloques declarados |
| [sections/main-password-footer.liquid](../../sections/main-password-footer.liquid) | [LM-PASSWORD](#lm-password) | Sin bloques declarados |
| [sections/main-password-header.liquid](../../sections/main-password-header.liquid) | [LM-PASSWORD](#lm-password) | Sin bloques declarados |
| [sections/main-product.liquid](../../sections/main-product.liquid) | [LM-PDP](#lm-pdp) | `@app`, `text`, `title`, `price`, `sku`, `inventory`, `quantity_selector`, `variant_picker`, `buy_buttons`, `description`, `share`, `custom_liquid`, `disclosures`, `collapsible_tab`, `popup`, `rating`, `complementary`, `icon-with-text` |
| [sections/main-search.liquid](../../sections/main-search.liquid) | [LM-SEARCH](#lm-search) | Sin bloques declarados |
| [sections/multicolumn.liquid](../../sections/multicolumn.liquid) | [LM-EDITORIAL](#lm-editorial) | `column` |
| [sections/multirow.liquid](../../sections/multirow.liquid) | [LM-EDITORIAL](#lm-editorial) | `row` |
| [sections/page.liquid](../../sections/page.liquid) | [LM-TYPE](#lm-type) | Sin bloques declarados |
| [sections/pickup-availability.liquid](../../sections/pickup-availability.liquid) | [LM-PICKUP](#lm-pickup) | Fragmento sin schema |
| [sections/predictive-search.liquid](../../sections/predictive-search.liquid) | [LM-SEARCH](#lm-search) | Fragmento sin schema |
| [sections/quick-order-list.liquid](../../sections/quick-order-list.liquid) | [LM-BULK](#lm-bulk) | Sin bloques declarados |
| [sections/related-products.liquid](../../sections/related-products.liquid) | [LM-PRODUCT-LIST](#lm-product-list) | Sin bloques declarados |
| [sections/rich-text.liquid](../../sections/rich-text.liquid) | [LM-TYPE](#lm-type) | `heading`, `caption`, `text`, `button` |
| [sections/slideshow.liquid](../../sections/slideshow.liquid) | [LM-HERO](#lm-hero) | `slide` |
| [sections/social-proof-strip.liquid](../../sections/social-proof-strip.liquid) | [LM-EDITORIAL](#lm-editorial) | Sin bloques declarados |
| [sections/trust-bar.liquid](../../sections/trust-bar.liquid) | [LM-EDITORIAL](#lm-editorial) | Sin bloques declarados |
| [sections/video.liquid](../../sections/video.liquid) | [LM-MEDIA](#lm-media) | Sin bloques declarados |

Los 35 templates JSON y dos grupos se asignan a familias a partir de los tipos de sección realmente declarados; `order`, `disabled` y tipos de bloque por instancia permanecen en esos archivos canónicos. El índice mapea también instancias deshabilitadas, sin afirmar visibilidad pública. Los tres templates Liquid son endpoints de carrusel de colección y tarjeta emitida (`layout none` en gift card). Las referencias a snippets excluyen ejemplos dentro de `{% doc %}`/`{% comment %}` para evitar falsos consumidores autorreferentes. Los imports JS y hooks incluyen módulos sin custom element; el código inline también forma parte de la evidencia. Se identifican 57 registros literales de custom elements contando assets, layout y header; no son 57 familias de diseño.

Entradas que requieren inspección especial al implementar: section rendering de cart/drawer/notification/pickup/quick-order, imports de validación de receta y lógica móvil, app injection/content_for_header, product-component/collection-component de eventos y contenido CMS/richtext. El índice literal no resuelve de forma general rutas construidas dinámicamente, código de apps o scripts externos. No hay templates de cuentas legacy en este universo: enlaces de cuenta y `customer.js` no prueban páginas Liquid de login/address implementadas; cuentas nuevas/checkout/email/confirmación son límites externos.

<a id="reuse-matrix"></a>
## Actualización ejecutable LEM-142

| Familia | Snippet canónico nuevo | Consumidores reales migrados | Contrato / límite |
| --- | --- | --- | --- |
| LM-ACTION | [lemoon-ui-action](../../snippets/lemoon-ui-action.liquid) | Guía, contacto, FAQ agrupado, galería, newsletter footer, comentarios y ayuda legal | a/button/input submit; base/local; primary/secondary/tertiary; clases locales y booleanos explícitos. Sin lógica comercial |
| LM-FIELD | [lemoon-ui-field](../../snippets/lemoon-ui-field.liquid) | Contacto, galería, newsletter footer y comentarios | input/textarea, labels, hint/error y slots confiables; orden/wrapper opt-in; contact/base. Formulario/valores en consumidor |
| LM-FIELD | [lemoon-ui-select](../../snippets/lemoon-ui-select.liquid) | Ordenación vertical de búsqueda y galería | options_html capturado, label externo persistente, SortBy/sort_by y eventos nativos conservados |
| LM-TYPE | [lemoon-ui-heading](../../snippets/lemoon-ui-heading.liquid) | Guía, contacto, FAQ agrupado/legacy, shell legal y galería; FAQ item | Nivel 1–6 allowlist; semántica separada de tamaño/color |
| LM-FEEDBACK | [lemoon-ui-message](../../snippets/lemoon-ui-message.liquid) | Respuestas de contacto/newsletter, headings de feedback de comentarios y estados sintéticos de galería | p/div/h3, texto o content_html confiable, role/live/foco opt-in |
| LM-DISCLOSURE | [lemoon-ui-faq-item](../../snippets/lemoon-ui-faq-item.liquid) | Fallback/custom del FAQ agrupado, legacy y galería | details/summary, pregunta/answer_html, editor attrs en raíz; grupos/routing permanecen en sección |

Los consumidores conservan sus formularios, contenido y schemas: newsletter customer (contact[tags]/contact[email]/commit), comentarios new_comment (author/email/body, moderación y autofocus de respuesta), cinco templates legales (CMS/políticas/demo/rutas locales) y FAQ legacy de page.preguntas-frecuentes (primer details abierto y block.shopify_attributes). [Pruebas semánticas y de navegador](../../tests/e2e/component-adoption.spec.js) comparan DOM Liquid real contra una base previa; los adaptadores de formularios/errores no prueban Shopify. No se incorpora una variante visual ni un wrapper de sección nuevo.


### Composiciones compartidas

| Snippet | Consumidores | Contrato preservado |
| --- | --- | --- |
| [lemoon-cart-tax-note](../../snippets/lemoon-cart-tax-note.liquid) | main-cart-footer, cart-drawer, quick-order-list | Ocho combinaciones duties/taxes/política; traducciones HTML y política nativa, sin totales ni checkout |
| [lemoon-product-unit-price](../../snippets/lemoon-product-unit-price.liquid) | main-product, featured-product | Price-Per-Item, variante y precio por tramo; cálculo de cantidad y variable de tabla posterior permanecen en el dueño |
| [lemoon-carousel-results](../../snippets/lemoon-carousel-results.liquid) | Dos templates collection.carousel | Lista/paginación de respuesta, elegibilidad y card-product; paginate y quick-add explícito según template |
| [lemoon-dawn-slider-controls](../../snippets/lemoon-dawn-slider-controls.liquid) | collection-list, featured-blog, multicolumn | Botones previous/next, contador y clases responsive del dueño; global.js, separado del carrusel Lemoon |

Heading/action también se reutilizan en Nosotros, servicios y guía de cristales. Social-icons conserva orden default y admite el orden explícito del footer password. Select cubre colección y las tres ramas de facets, con opciones/IDs/formulario resueltos por el dueño. APIs, dependencias y límites en las recetas de [catálogo](../components/recipes/product-card-grid.md), [búsqueda](../components/recipes/search-sort.md) y [ayuda](../components/recipes/guide-help.md). No se extraen schemas, filas cart/bulk, formularios legacy ni shells genéricos de página/modal.

Los contratos completos están en LiquidDoc y en las [seis recetas](../components/README.md#elegir-una-receta). Strings/atributos se escapan una vez al renderizar; `_html` sólo admite capturas confiables y `editor_attributes` sólo `block.shopify_attributes`. Los consumidores mantienen IDs/ARIA, locales, schemas/settings, formularios, rutas y hooks. Las familias canónicas existentes —iconos, spinner, precio, swatches, card-product, controles de carrusel y adaptadores comerciales— conservan su nombre: no se añaden wrappers para renombrarlas.

CSS mantiene su orden y dueño: tokens → base → componentes → superficie. La corrección accesible aprobada de contorno/foco se limita a controles migrados (`.lemoon-ui-control`, wrappers field/select) en [lemoon-components.css](../../assets/lemoon-components.css), con especificidad local de contacto. [global.js](../../assets/global.js) sigue siendo dependencia contextual de details: evitar el prefijo Details-* en FAQ nativo. [facets.js](../../assets/facets.js) conserva la ordenación del formulario dueño. No se introduce JS nuevo para estos átomos.

<a id="extraction"></a>
## Oportunidades pendientes

Ayuda/steps/shell editorial, radio/checkbox genérico, modal/tab shell y filas cart/bulk siguen siendo candidatos, no APIs disponibles. El panel help se compone con heading/action y CSS local; el contenido de medidas ya compartido no convierte el shell PDP en un modal genérico. FAQ legacy, newsletter del footer, comentarios y títulos/ayuda del shell legal ya reutilizan los snippets canónicos. Sort de colección y facets reutilizan select manteniendo sus opciones nativas. Filas y operaciones comerciales conservan sus implementaciones propias. Las fases propuestas en la base histórica no autorizan cambios adicionales. Una extracción futura requiere alcance, pruebas del dueño y revisión humana propios.

<a id="gallery-plan"></a>
## Galería actual y demos legacy

[lemoon-design-system](../../sections/lemoon-design-system.liquid) ahora renderiza los seis snippets nuevos y reutiliza icono/spinner por composición. Los estados sintéticos permanecen inertes: sin POST, compra, datos personales ni persistencia de consentimiento. [La receta de galería](../components/recipes/catalogue-states.md) identifica dependencias y límites.

Los elementos independientes que permanecen —tipografía de muestra, accent local, radio/badges, tarjeta y trust panel— son legacy/demo. No equivalen a card-product/swatch-input, variantes globales, garantías o precios vigentes, funcionamiento comercial ni certificación WCAG. La tarjeta comercial real conserva su snippet y contain; no se declara migrada por mostrar una tarjeta separada.

<a id="verification"></a>
## Verificación y límites de entrega

La comprobación documental reconcilia JSON, 44 IDs estables, rutas de cobertura actual, fuentes/consumidores, links/anchors y parámetros de recetas contra LiquidDoc. Los hashes y resultados de esa revisión concreta están en el reporte externo `/tmp/LEM-142-recipes-delivery.md`; no son contenido de producto. La comprobación histórica exclusivamente documental no debe interpretarse como validación del nuevo runtime.

Las pruebas de snippets/consumidores y navegador local usan archivos reales con fixtures Shopify declarados; sólo su ejecución registrada acredita esos casos locales. Theme Check, revisión independiente y resultados de integración pertenecen al reporte del coordinador. No confundirlos con envío/entrega de contacto, editor/asignación CMS, storefront Shopify, APIs/stock/pagos/receta, push/publicación, aprobación Figma/visual, certificación WCAG ni aceptación humana de la revisión entregada.
