# Biblioteca compartida de componentes — Lemoon

Guía para seleccionar y reutilizar componentes en los tickets de página. [DESIGN.md](../../DESIGN.md) mantiene el contrato visual; esta biblioteca localiza fuentes editables, entradas, estados y criterios de integración. La [guía de marca](brand-guidelines.md) gobierna identidad y el [inventario de páginas](page-inventory.md) identifica destinos y responsables. Las fuentes se editan en su archivo original; no se necesita copiar CSS a un playground ni crear un segundo sistema de tokens.

## Cómo usar la biblioteca

1. Localizar la superficie en el inventario y su template en el [inventario de secciones](section-inventory.md).
2. Elegir la familia de esta guía y reutilizar su Liquid, CSS y controlador juntos, conservando overrides locales y entradas explícitas de `{% render %}`.
3. Aplicar los requisitos de DESIGN.md, incluidos los de accesibilidad que prevalecen sobre defectos legacy. Una clase existente no acredita cumplimiento.
4. Conectar datos, traducciones y estados reales. El ticket de página verifica renderizado, teclado, responsive y recuperación antes de aceptar la integración.

El alcance es storefront Liquid. Checkout, confirmación y cuentas nuevas conservan sus superficies nativas y sus tickets; el back office conserva sus patrones propios. Esta biblioteca no especifica nuevos formularios Liquid para esas superficies.

## Fuentes visuales y editables

Archivo existente: [Lemoon Ecommerce](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce). Los enlaces siguientes reutilizan los nodos registrados en DESIGN.md; no crean una biblioteca alternativa.

| Familia | Fuente editable Figma | Fuente operativa |
| --- | --- | --- |
| Foundations | [9:10](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=9-10): paleta 9:13, tipografía 9:60, espaciado/radios 9:86 | [Tokens CSS](../../assets/lemoon-tokens.css), [DESIGN §2–4](../../DESIGN.md#2-color) |
| Índice de componentes | [9:5](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=9-5) | Familias y archivos de esta guía |
| Botones | [11:32](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=11-32) | [Componentes CSS](../../assets/lemoon-components.css), [base Dawn](../../assets/base.css) |
| Inputs | [13:10](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=13-10) | Formularios existentes y receta de campos de esta guía |
| Tarjetas y badges de producto | [34:39](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=34-39) | [card-product](../../snippets/card-product.liquid), [labels](../../snippets/lemoon-product-card-labels.liquid) |
| Accordion / modal | [33:13](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=33-13), [33:14](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=33-14) | [global.js](../../assets/global.js), drawers y diálogos descritos abajo |
| Header | [75:641](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=75-641), [móvil 57:74](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=57-74) | [header.liquid](../../sections/header.liquid); integración en LEM-131 |
| Configuración | [412:979](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=412-979) | [lens-configurator](../../sections/lens-configurator.liquid); flujo/datos en LEM-23/24/93 |

**Disponibilidad de referencias:** Input 13:10 se consultó el 31-10-2026 mediante contexto de diseño, que devolvió variantes Default/Focus/Error/Disabled e iconos None/Leading/Trailing. Las consultas de Button, Product Card y Modal quedaron bloqueadas por cuota de Figma; los demás nodos se conservan desde DESIGN.md sin nueva inspección. No hay nueva aprobación visual ni verificación de todas las variantes Figma. Para filtros/chips y mensajes no se identifica aquí un nodo específico confirmado: su fuente editable es el código enlazado. La inspección de fuentes no equivale a validar el storefront renderizado.

## Selección de tokens e identidad

Aplicar [DESIGN §2–5](../../DESIGN.md#2-color) y los nombres reales de [lemoon-tokens.css](../../assets/lemoon-tokens.css). Esta tabla asigna roles sin mantener otra paleta.

| Uso | Tokens / regla compartida |
| --- | --- |
| Acción, texto inverso y foco | `--lemoon-action-primary`, `--lemoon-action-primary-hover`, `--lemoon-text-inverse`, `--lemoon-border-strong` |
| Lectura, ayudas y paneles | `--lemoon-text-primary`, `--lemoon-text-secondary`, `--lemoon-surface-page`, `--lemoon-surface-warm` |
| Error y confirmación | `--lemoon-text-error`, `--lemoon-border-error`, `--lemoon-status-error`, `--lemoon-status-success`; siempre acompañados de texto |
| Disabled | `--lemoon-surface-disabled`; conservar semántica y tratamiento local, sin inferir que todos los controles consumen este token |
| Tipografía | `--lemoon-font-heading` Urbanist para títulos/acciones; `--lemoon-font-body` Hanken Grotesk para cuerpo/labels. Mantener excepciones de tarjeta/PLP |
| Ritmo y forma | `--lemoon-space-*`; `--lemoon-radius-button` para acciones, `--lemoon-radius-sm` para campo base, radio local para cada familia |
| Movimiento y capas | `--lemoon-motion-fast/base/slow`; capas y reducción de movimiento según DESIGN §4 |

Usar el [SVG oficial](../../assets/lemoon-logo-refined-navy.svg) sin alterar trazados, proporción ni fill. Los 120×28 del header son una aplicación local; mínimos, clearspace y variantes extendidas siguen en LEM-80. No incorporar colores alternativos ni convertir ejemplos comerciales en hechos. La voz final pertenece a LEM-55; reutilizar claves de [es.json](../../locales/es.json) y sus equivalentes de [en.default.json](../../locales/en.default.json).

## Botones y acciones

**Fuentes:** [lemoon-components.css](../../assets/lemoon-components.css) define `.button`, `.button--secondary`, `.button--tertiary`; [base.css](../../assets/base.css) aporta foco, disabled y loading. El consumidor de compra es [buy-buttons.liquid](../../snippets/buy-buttons.liquid), con [product-form.js](../../assets/product-form.js) y [loading-spinner](../../snippets/loading-spinner.liquid).

**Entradas:** usar enlace con `href` para navegar y botón con `type` para actuar. `buy-buttons` recibe `product`, `block`, `product_form_id`, `section_id`, `show_pickup_availability`; sus settings deciden checkout dinámico y destinatario. No usarlo como botón genérico sin su formulario. Mantener `block.shopify_attributes` y IDs únicos.

| Estado | Especificación y mapeo |
| --- | --- |
| Normal | Principal navy/blanco; secundaria blanco/navy; terciaria transparente/navy. Base: pill, padding horizontal 2rem, Urbanist CTA. Min-height 48px desde 750px y 44px bajo 750px |
| Hover | Principal usa action-primary-hover; secundaria navy/blanco; terciaria cambia texto. Solo respuesta adicional a una acción ya reconocible |
| Foco | Preservar `:focus-visible`/`.focused` de Dawn y comprobar visibilidad con el fondo computado. DESIGN exige indicador perceptible; no asumir anillo navy universal donde la base usa variables Dawn |
| Loading | `.loading`, `.loading__spinner`, `aria-disabled=true` y guard de envío de `product-form.js`; mantener nombre accesible y evitar doble envío |
| Error | Pertenece al formulario: `.product-form__error-message-wrapper[role=alert]` y `.product-form__error-message`; conservar la selección y permitir recuperación |
| Disabled / agotado | `disabled` para indisponibilidad real; texto localizado unavailable/sold_out. `aria-disabled` por sí solo requiere el bloqueo del controlador. No usar solo opacity o `.disabled` para impedir activación |

Enter/Espacio operan botones nativos; Enter activa enlaces. No convertir enlaces deshabilitados en destinos activos. El ancho full-width es una decisión del consumidor, no de todos los botones. Las variantes accent/destructive de Figma no crean clases globales nuevas. La acción quick-add tiene medidas locales y no debe generalizarse.

## Inputs, select, textarea y selección

**Fuentes:** [base.css](../../assets/base.css) y [lemoon-components.css](../../assets/lemoon-components.css): `.field`, `.field__input`, `.field__label`, `.select`, `.select__select`, `.text-area`. Ejemplo de formulario integrado: [lemoon-contact-page.liquid](../../sections/lemoon-contact-page.liquid), clases `.lemoon-contact__field`, `__hint`, `__error`. Sus campos nativos son `contact[name]`, `contact[email]`, `contact[phone]`, `contact[body]`, con `required`, autocomplete y valores conservados. Su schema controla contenido de canales y padding; no confundirlo con inputs de cliente.

| Estado | Requisito de integración |
| --- | --- |
| Normal | Campo base blanco/carbon, 48px de altura, radio 4px; textarea auto. Label persistente con `for/id`, tipo y autocomplete correctos; ayuda en `aria-describedby` |
| Foco | Anillo navy de 2px separado por offset ≥2px del contorno de reposo, sin recortes. El contacto existente usa offset 4px; revisar también los pseudo-elementos de `.field` y `.select` |
| Error | `aria-invalid=true`, mensaje con ID asociado y texto que explique cómo corregir; error token. Contacto asocia su error email a `-email-error`; no atribuir esa asociación a todos sus campos |
| Disabled | Atributo nativo `disabled` cuando corresponda, causa comprensible y ayuda legible. No confundir `readonly` con disabled ni desactivar un campo requerido sin resolver su envío |

### Reconciliación de campos legacy

**Estado existente:** `.field:after` y `.select:after` usan contorno/sombra warm en lemoon-components.css. Contacto también declara borde warm en su selector local. El nodo Input conserva borde warm en reposo y foco como borde navy de 2px; su código de referencia incluye fallback tipográfico Source Sans 3 y texto secundario distinto del tema. Esas diferencias no sustituyen Hanken ni los roles aprobados de DESIGN.md.

**Receta normativa para nuevas implementaciones o modificaciones:** cuando blanco/warm no delimite el área editable con ≥3:1, usar contorno continuo de 1px `--lemoon-border-strong`, sin opacidad reducida, más el anillo de foco de 2px con offset ≥2px. Aplicar también a textarea y búsqueda en ese caso; el label y placeholder no sustituyen el contorno. Warm/blanco ronda 1.098:1; navy/blanco 16.518:1 y navy/warm 15.047:1 según DESIGN.md. Son relaciones entre colores sólidos, no prueba de contraste renderizado.

**Deuda de implementación:** migrar estos selectores y las variantes Input al contrato accesible en los tickets que modifiquen campos (por ejemplo contacto LEM-117 y búsqueda LEM-45), verificando cascada, pseudo-elementos, fondos, error y foco. Esta entrega reconcilia la especificación y deja la migración de código/Figma pendiente; no declara conforme el legacy ni cambia sus archivos.

**Selección:** [swatch-input](../../snippets/swatch-input.liquid) recibe `id`, `type` radio/checkbox, `name`, `value`, `swatch`, `product_form_id`, `checked`, `disabled`, `visually_disabled`, `shape`, `help_text`, `additional_props`; estilos en [component-swatch-input.css](../../assets/component-swatch-input.css). `visually_disabled` conserva el input habilitado: no equivale a disabled. Conservar label y nombre de opción, checked real y foco visible. Espacio cambia checkbox; flechas recorren radios del grupo nativo. No depender del color del swatch para comunicar nombre/selección. Search conserva su radio y tamaño locales, sin extenderlos a campos generales.

## Tarjetas de producto

**Fuentes:** [card-product.liquid](../../snippets/card-product.liquid), [lemoon-components.css](../../assets/lemoon-components.css), [lemoon-product-card.js](../../assets/lemoon-product-card.js), [price.liquid](../../snippets/price.liquid). Consumidores: [lemoon-featured-products](../../sections/lemoon-featured-products.liquid), [main-collection-product-grid](../../sections/main-collection-product-grid.liquid) y [main-search](../../sections/main-search.liquid).

**Entradas:** `card_product`, `section_id`, `show_secondary_image`, `show_quick_add`, `show_vendor`, `show_rating`, `lazy_load`, `skip_styles`, `extend_height`, `media_aspect_ratio`, `image_shape`, `horizontal_class`, `placeholder_image`; además `enable_gallery_swipe` activa la mejora de gestos usada por el snippet. No dejar que `skip_styles` elimine la única carga de estilos/controlador del grid. Pasar producto real e identificador de sección; las imágenes, opciones, variantes, precios y reviews vienen de sus datos, no del frame.

| Estado | Composición / comportamiento |
| --- | --- |
| Normal | Outer transparente/radio 0; media warm/radio 12px; proporción 100/96 y max-height 280px ≥990px. Producto completo con contain. Nombre y precio conservan medidas locales de DESIGN §5 |
| Hover / media lista | Secundaria opcional; `.lemoon-product-card__secondary-ready` habilita la transición. Sin secundaria o mientras carga, conservar frontal |
| Foco | Enlace de imagen con outline interior de 2px/offset −4px; swatch y quick-add con 2px/offset 3px. Conservar enlace del título, nombres y orden de tabulación; no depender de click delegado ni swipe para navegar |
| Selección | `.lemoon-product-card__swatch.is-selected` y `aria-pressed`; controlador actualiza URL de variante, media, precio y disponibilidad desde `data-*` del botón |
| Error / fallback | Sin media usa activo fallback; sin producto existe placeholder de onboarding, que no es catálogo publicable. Quick-add lleva `data-hide-errors=true`: no ofrece aquí error inline, y el catch de red de product-form no garantiza mensaje visible. El consumidor debe resolver feedback recuperable antes de aceptar ese flujo |
| Agotado / disabled | Badge sold-out; quick-add se omite si producto no disponible y se deshabilita según variante. El enlace a PDP permanece válido: agotado no deshabilita toda la tarjeta |

El icono `.lemoon-product-card__try-on` está marcado `aria-hidden`; no acredita probador funcional. La alternativa por teclado sigue siendo el enlace real a PDP y sus capacidades verificadas.

**Responsive:** el grid controla ancho y columnas. PLP usa [lemoon-collection-plp.css](../../assets/lemoon-collection-plp.css): fallback 3 columnas ≥990, 2 entre 750–989, móvil por `--plp-mobile-columns` (fallback 2); gaps 22/30px desktop y 12/24px móvil. Sus tamaños de nombre/precio sobrescriben los base, según DESIGN.md. No fijar 320px del frame ni recortar el armazón para llenar un hueco.

## Badges y etiquetas

**Fuentes:** [lemoon-product-card-labels.liquid](../../snippets/lemoon-product-card-labels.liquid), `.lemoon-product-card__labels`/`__label--*` en [componentes CSS](../../assets/lemoon-components.css). Pasar `card_product` y `section_id` explícitos; este último construye el ID de sold-out usado por la tarjeta.

| Variante | Entrada real / presentación existente |
| --- | --- |
| New | Tags normalizados nuevo/novedad/new; `--new`, navy/blanco |
| Flash sale | Tag flash-sale; `--flash-sale`, lemon/navy. No equivale por sí solo a descuento real |
| Best seller | Tags mas-vendidos/mas-vendido/best-seller; `--best-seller`, green-deep/blanco |
| Bestseller | Tag bestseller; `--bestseller`, tratamiento peach local del CSS, distinto de best-seller; no promoverlo a token global |
| Sold out | `card_product.available == false`; `--sold-out`, gris/blanco |

El snippet evita variantes duplicadas, muestra hasta tres etiquetas y reserva un lugar para agotado (hasta dos tags más sold-out). La oferta monetaria se expresa con precios reales de `price`, no con un badge inventado. Las etiquetas de producto son pill; el badge editorial genérico usa `--badge-corner-radius:0`, compacto `--lemoon-radius-sm`, chips `--lemoon-radius-lg`. Conservar diferencias locales.

Son texto informativo: foco/error/disabled no aplican como estados interactivos. No añadir tabindex ni hover accionable. Verificar legibilidad, texto completo y que no tapen producto; una etiqueta debe acompañar el significado del color. Si se necesita una acción, usar enlace/botón de la familia correspondiente.

## Filtros y chips

**Fuentes:** [facets.liquid](../../snippets/facets.liquid), [desktop](../../snippets/facets-filter-desktop.liquid), [móvil](../../snippets/facets-filter-mobile.liquid), [chips activos](../../snippets/facets-active-values.liquid), [facets.js](../../assets/facets.js), [component-facets.css](../../assets/component-facets.css), [CSS PLP](../../assets/lemoon-collection-plp.css), [controlador PLP](../../assets/lemoon-collection-plp.js).

**Entradas:** `facets` recibe `results` (collection/search), `enable_filtering`, `enable_sorting`, `filter_type`, `paginate`, `lemoon_plp`. Cada grupo recibe `filter`, `filter_label`, `filter_type`, `lemoon_plp`, `presentation`, `visual_layout_class`, `filter_index`; desktop añade `show_more_number`. Chips reciben `filters`, `lemoon_plp`. Conservar contexto de sección e IDs/param_names nativos; no construir nombres de filtros desde etiquetas traducidas. El conjunto disponible depende de Shopify y sus datos.

| Estado | Mapeo / contrato |
| --- | --- |
| Normal / expandido | `details/summary`, `.facets__summary`, `.mobile-facets__summary`, checkbox nativo con label y contador. PLP usa `data-facet-accordion`; estado expandido y aria-controls sincronizados por MenuDrawer |
| Seleccionado / chip | `checked`, `.active`; `<facet-remove>` y `.active-facets__button` enlazan `url_to_remove`. Texto incluye filtro/valor y nombre accesible de quitar; mantener URL real |
| Foco / teclado | Tab/Shift+Tab recorren controles, Espacio cambia checkbox y Enter activa chip. Tras actualización AJAX, facets.js intenta devolver foco al input equivalente y usa fallback si desaparece |
| Loading | Spinner y `.collection.loading`, actualización de contador y URL; conservar términos/orden y navegación atrás |
| Disabled | `value.count == 0` e inactivo genera `disabled`; un valor activo con cero resultados sigue disponible para quitarlo. La clase `.disabled` de un chip no sustituye bloqueo semántico |
| Error / vacío | Cero resultados debe conservar filtros activos y retirada/restablecer. El catch de fetch en facets.js registra/rechaza error, sin recuperación visible garantizada; resolver en LEM-47/45 antes de aceptar el fallo de red |

**Precio:** [lemoon-price-slider](../../snippets/lemoon-price-slider.liquid) recibe `filter`, `id_prefix`; dos ranges nativos, labels From/To y outputs, parámetros hidden con nombres Shopify; `step=1000` y disabled cuando máximo es cero. [price-facet](../../snippets/price-facet.liquid) conserva la alternativa de campos según consumidor. Verificar ajuste por flechas y límites min/max sin exigir arrastre; no convertir esta especificación en nuevas reglas comerciales de precio.

**Responsive y cierre:** sidebar PLP final de 264px + gap 28px ≥990; entre 750–989, 220px + 24px. El drawer disponible bajo 990 tiene máximo local 320px; preservar las reglas de visibilidad de cada consumidor. `MenuDrawer` en global.js gestiona trapFocus, retorno al summary y `overflow-hidden-*`. Escape en un accordion interno primero lo cierra y devuelve foco a su summary; Escape en el nivel raíz cierra el drawer. Conservar cierre visible y scroll del contenido sin dejar la página bloqueada al salir.

## Modal, drawer y contenido expandible

Elegir una primitiva existente por superficie; no mezclar el ciclo de vida del diálogo nativo con el de `modal-dialog`.

| Familia / fuentes editables | Entradas y selectores | Contrato de interacción existente |
| --- | --- | --- |
| Modal Dawn | [global.js](../../assets/global.js): `ModalOpener`, `ModalDialog`; [product-media-modal](../../snippets/product-media-modal.liquid), [product-modal.js](../../assets/product-modal.js) | Opener con `data-modal`, botón de cierre `ModalClose-*`, contenedor con role dialog, atributo `open`. `show(opener)` atrapa foco y guarda opener; `hide()` retira trap, retorna foco, libera overflow y pausa media. Escape y click de fondo según familia |
| Búsqueda con details-modal | [details-modal.js](../../assets/details-modal.js) | `details`, `summary`, cierre `button[type=button]`, destino tabindex −1 e input. Abre hacia input; Escape/cierre/fondo retiran trap y scroll lock. Click exterior usa `close(false)` sin forzar retorno al summary: verificar destino de foco en integración |
| Carrito lateral | [cart-drawer.liquid](../../snippets/cart-drawer.liquid), [cart-drawer.js](../../assets/cart-drawer.js), [component-cart-drawer.css](../../assets/component-cart-drawer.css) | `#CartDrawer`, `#CartDrawer-Overlay`, `.drawer__inner`, `.is-empty`, trigger `#cart-icon-bubble`. Datos de cart, settings y secciones AJAX; foco tras transitionend, trap distinto para vacío; Escape/fondo/cierre retornan al elemento guardado y liberan overflow |
| Medidas PDP (dialog nativo) | [lemoon-product-size-guide](../../snippets/lemoon-product-size-guide.liquid), [contenido](../../snippets/lemoon-size-guide-content.liquid), [lemoon-pdp-tools.js](../../assets/lemoon-pdp-tools.js), [layout CSS](../../assets/lemoon-pdp-layout.css), [PDP CSS](../../assets/lemoon-eyewear-product.css) | Snippet recibe `product`, `section_id`; contenido recibe `product`, `instance_id`. `.lemoon-size-drawer`, `data-size-open/close`; showModal/close, cierre exterior y retorno al opener. Alternativa integrada óptica en [lemoon-eyewear-product](../../sections/lemoon-eyewear-product.liquid) y [su JS](../../assets/lemoon-eyewear-product.js) usa data-open-dialog/data-close-dialog |
| Accordion | [collapsible-content](../../sections/collapsible-content.liquid), [FAQ](../../sections/lemoon-faq-page.liquid) | Reutilizar details/summary y bloques del schema. Enter/Espacio alternan; contenido fluido, sin trap de foco ni scroll lock. No tratar todo accordion como modal |

**Estados:** cerrado fuera del recorrido de foco; abierto con título/nombre accesible, cierre disponible y foco dentro; loading/error/vacío corresponden al contenido (carrito o media), no a una nueva variante visual global. Disabled solo aplica al disparador/acción no disponible y debe tener razón; no deshabilitar cierre ni Escape. Conservar `aria-modal`, role y asociaciones de título donde correspondan. No añadir `aria-modal=true` a un panel que deje el fondo operable.

**Geometría:** el modal PDP base usa width min(600px, viewport −32px), max-height viewport dinámico −32px y overflow auto; zoom tiene ancho local distinto. La regla más específica `.lemoon-pdp__dialog.lemoon-size-drawer` transforma medidas en lateral hasta 480px/100vw, alto 100dvh, radio 0 y padding móvil propio. Su scroll lock está en `html:has(.lemoon-size-drawer[open])`; conservar también reduced-motion local. No aplicar el radio de modal de DESIGN a ese drawer. Mantener CSS/controlador completos de la superficie.

**Aceptación en navegador:** Tab/Shift+Tab permanecen en la superficie modal, Escape cierra la capa adecuada, el foco retorna al disparador disponible y el fondo recupera scroll. Probar contenido más alto que pantalla, teclado virtual, viewport móvil y reduced-motion, incluido el trap del carrito que depende de transitionend. Estas son condiciones de integración pendientes de comprobar en runtime, no una certificación por lectura de JS.

## Mensajes, carga y recuperación

| Caso | Fuente editable / entradas | Estados y presentación |
| --- | --- | --- |
| Contacto | [lemoon-contact-page.liquid](../../sections/lemoon-contact-page.liquid): objeto `form` nativo | `.lemoon-contact__status--success` con role status; `--error` con role alert/aria-live assertive; feedback enfocable y autofocus en retorno de formulario. Error email asociado al campo; conservar valores y corrección |
| Agregado a carrito | [buy-buttons](../../snippets/buy-buttons.liquid), [product-form.js](../../assets/product-form.js) | Error inline role alert, `.product-form__error-message`; carga con spinner; éxito mediante drawer/notificación o navegación al carrito. No mostrar éxito antes de respuesta; límite de quick-add documentado en tarjetas |
| Actualización de carrito | [cart.js](../../assets/cart.js), [cart-drawer](../../snippets/cart-drawer.liquid), [main-cart-items](../../sections/main-cart-items.liquid) | `.cart-item__error-text`, estados live del carrito, cantidad/stock real y loader por línea. Conservar cantidad corregible, producto y resumen; distinguir vacío de fallo |
| Resultados / sin resultados | [main-search](../../sections/main-search.liquid), [main-collection-product-grid](../../sections/main-collection-product-grid.liquid), [facets.js](../../assets/facets.js) | Contador y mensajes vacíos localizados; conservar búsqueda/filtros y acciones de recuperación. El mensaje vacío no debe ocultar el único control para quitar filtros |

Normal es ausencia de feedback; error explica el problema y la acción siguiente; éxito confirma la operación real. No hay una clase global de toast que deba crearse por existir una capa toast en tokens. Mensajes informativos no llevan disabled; solo sus acciones pueden tenerlo. El foco visible aplica a enlaces/botones de recuperación, no a cada párrafo. Anunciar cambios asíncronos mediante el mecanismo live de la superficie sin duplicar alertas; no mover foco por cada pulsación o por cada spinner.

Mantener texto legible, icono complementario, ayuda asociada y mensaje completo. Error y éxito no dependen solo de rojo/verde; usar cuerpo legible y borde/icono como apoyo. En móvil apilar sin cortar contenido ni tapar acciones. La biblioteca no valida las condiciones comerciales del mensaje: resolverlas en el ticket propietario.

## Entrega a tickets de página

| Consumidor | Componentes a reutilizar | Verificación propia pendiente |
| --- | --- | --- |
| LEM-48 home | Card, badges, botones y secciones existentes | Datos reales, grids/carruseles, foco y carga de media |
| LEM-47 catálogo / LEM-45 búsqueda | Card, filtros, chips, ranges, mensajes y drawer | Fuentes de filtros, selección/URL, vacío, red, foco tras AJAX, responsive |
| LEM-46 PDP / LEM-129 medidas | Botones, selección, modal/drawer y mensajes | Stock, variantes, medidas o estado sin medidas, Escape/retorno/scroll |
| LEM-98 carrito | Drawer, cantidad, errores y loading | Respuestas reales de carrito, recuperación de stock/red y foco |
| LEM-117 contacto / páginas con formularios | Campos, labels, errores y acciones | Migración del contorno legacy; envío real, validación y anuncios |
| LEM-23/24 configuración y receta | Primitivas aprobadas y estados de la función | Contratos de compatibilidad/receta, persistencia y errores propios; no inferirlos de Figma |
| LEM-131 navegación / LEM-116 FAQ | Header existente y details/summary | Teclado, expansión, cierre y adaptación móvil de su superficie |

En cada integración comprobar 390px y desktop, ambos lados de 750/990 y 1280 cuando cambie gutter; reflow/zoom, textos largos, reduced-motion y forced-colors. Los objetivos compartidos son texto normal ≥4.5:1, grande ≥3:1 e indicadores necesarios ≥3:1 conforme a DESIGN §6, con colores computados y fondos reales. El objetivo interno de área accionable es 44px: swatches/iconos pequeños pueden requerir ampliar área sin cambiar su dibujo.

La revisión de la biblioteca es documental. Quedan pendientes la validación visual de las referencias bloqueadas, la migración de deuda indicada y las pruebas de cada integración; no se infiere publicación, cumplimiento WCAG, disponibilidad de capacidades ni aceptación humana de LEM-132.
