# Lemoon — especificación de implementación visual

Esta guía fija las reglas de implementación del storefront a partir de los tokens y componentes existentes del tema. Reutilizar esas reglas al mantener páginas o construir secciones de la misma familia. Cada excepción local se aplica únicamente a su componente. [Brand guidelines](brand-guidelines.md) define el uso de marca; [design-plan](design-plan.md) organiza las superficies; [section-inventory](section-inventory.md) localiza las secciones y [remaining-pages-plan](remaining-pages-plan.md) conserva las dependencias de entrega.

## 1. Fuentes y precedencia

La base normativa de esta especificación es la implementación existente: [tokens](../../assets/lemoon-tokens.css), [componentes](../../assets/lemoon-components.css), [base Dawn](../../assets/base.css), [layout](../../layout/theme.liquid) y las fuentes locales enlazadas por componente. Aplicar en este orden:

1. La instrucción explícita del ticket de la superficie define su alcance y referencia visual.
2. Para una familia existente, reutilizar su sección, snippet y reglas locales completas, incluidas sus media queries; tienen precedencia sobre los valores genéricos de esta guía.
3. Para componentes sin excepción local, usar los roles semánticos y valores base de las secciones 2–5. No crear aliases paralelos `--color-primary` ni sustituir tokens por valores de un plan antiguo.
4. Las referencias Figma sirven para la composición del componente correspondiente. No importar propuestas alternativas o tamaños de frame a todas las páginas.

### Referencias visuales por componente

Archivo: [Lemoon Ecommerce](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce). El registro de fuentes de LEM-141 identifica estas referencias inspeccionadas previamente; su alcance se conserva aquí para localizar el diseño:

| Referencia | Uso |
| --- | --- |
| [Cover `9:6`](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=9-6) | Navy, blanco y lemon; Urbanist 72/300 pertenece a la portada, no al H1 global |
| [Foundations `9:10`](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=9-10) | Índice de paleta `9:13`, tipografía `9:60` y espaciado/radios `9:86`; valores operativos en tokens CSS |
| [Components `9:5`](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=9-5) | Índice de familias y variantes |
| [Input `13:10`](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=13-10) | Default/Focus/Error/Disabled e icono None/Leading/Trailing; referencia visual de campos |
| [Product Card `34:39`](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=34-39) | Composición y estados Default/Hover/New/Sale; implementar dimensiones fluidas según el grid real |
| [Button `11:32`](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=11-32), [Accordion `33:13`](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=33-13), [Modal `33:14`](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=33-14) | Familias identificadas en el índice; clases y comportamiento concretos en sección 5 |
| [Header Light `75:641`](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=75-641), [mobile `57:74`](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=57-74) | Header claro existente; reutilizar su sección |
| [Flujo de cristales `412:979`](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=412-979) | Referencia indicada por el usuario y registrada en [plan de páginas](remaining-pages-plan.md); sustituye el esquema histórico de cinco pasos |

Las direcciones alternativas y páginas de propuestas de Figma se mantienen como exploraciones; no sustituyen estas familias. La biblioteca editable y sus variantes pertenecen a [LEM-132](https://linear.app/antekera/issue/LEM-132); la identidad extendida y sus aplicaciones pertenecen a [LEM-80](https://linear.app/antekera/issue/LEM-80). Esta guía proporciona la selección operativa de componentes del tema para trabajar sin esperar una biblioteca nueva.

## 2. Color y cascada

Usar los siguientes tokens semánticos de [lemoon-tokens.css](../../assets/lemoon-tokens.css):

| Rol / token | Valor | Regla de selección |
| --- | --- | --- |
| `--lemoon-surface-page` / `--lemoon-text-inverse` | `#FFFFFF` | Fondo de página / texto sobre navy |
| `--lemoon-surface-warm` / `--lemoon-border-warm` | `#F7F4EE` | Panel cálido / contorno base de campos |
| `--lemoon-surface-warm-hover` | `#E8E2D8` | Hover de la superficie cálida |
| `--lemoon-surface-inverse`, `--lemoon-text-brand`, `--lemoon-border-strong`, `--lemoon-action-primary` | `#0B1F3A` | Superficie inversa, texto de marca, foco y acción principal |
| `--lemoon-action-primary-hover` | `#1A3560` | Hover de acción navy |
| `--lemoon-action-accent` / `--lemoon-action-accent-hover` | `#F7E600` / `#E6D600` | Acento y hover; combinar con texto navy o carbon |
| `--lemoon-text-primary` | `#1A1A1A` | Texto principal |
| `--lemoon-text-secondary` | `#51575E` | Ayudas, labels y metadatos |
| `--lemoon-border-default` / `--lemoon-surface-disabled` | `#E0DDD8` | Separadores / superficie deshabilitada |
| `--lemoon-status-success` | `#2D8C4E` | Confirmación acompañada de texto |
| `--lemoon-status-error`, `--lemoon-text-error`, `--lemoon-border-error` | `#C0392B` | Error acompañado de mensaje y estado semántico |
| `--lemoon-surface-tertiary-green` / `--lemoon-surface-green-deep` | `#DFE9DE` / `#316653` | Mantener en los componentes que ya los usan, como `.lemoon-about__inner` y la etiqueta `--best-seller`; no convertirlos en fondo general |

Blanco/carbon es la combinación base; beige distingue paneles y navy las acciones principales. Lemon es acento localizado. Conservar los tratamientos de cada sección existente. Los aliases `--lemoon-action-primary-alt:#0E1A29` y `--lemoon-action-accent-alt:#FFDD00` están reservados a exploraciones; no seleccionarlos para componentes nuevos de esta base.

[theme.liquid](../../layout/theme.liquid) genera primero variables Dawn desde settings y luego carga fuentes, tokens, base y componentes, en ese orden. Los estilos de sección se aplican después según su selector. Por eso un color scheme del editor no recolorea todos los controles Lemoon. [settings_schema.json](../../config/settings_schema.json) define opciones y defaults, no los valores activos de una tienda; los font pickers `assistant_n4` quedan sobreescritos por las familias de los tokens.

## 3. Tipografía

Familia heading: `--lemoon-font-heading`, **Urbanist**, sans-serif. Familia body: `--lemoon-font-body`, **Hanken Grotesk**, sans-serif. El [layout](../../layout/theme.liquid) carga Urbanist 300/400/500/600/700 y Hanken 400/500/600/700. Aplicar los roles de [tokens](../../assets/lemoon-tokens.css) mediante las clases de [componentes](../../assets/lemoon-components.css):

| Rol | Familia / peso | Tamaño ≥750 → <750 | Interlínea | Tracking |
| --- | --- | --- | --- | --- |
| Display `.h0` | Urbanist 300 | 5.6rem → 4rem | 1.142857 | −0.5px |
| H1 / `.h1` | Urbanist 600 | 4rem → 3.2rem | 1.2 | −0.3px |
| H2 / `.h2` | Urbanist 600 | 2.8rem → 2rem | 1.285714 | −0.3px |
| H3 / `.h3` | Urbanist 500 | 2rem → 1.8rem | 1.4 | 0 |
| Body | Hanken 400 | 1.6rem | 1.5 | 0 |
| Body small | Hanken 400 | 1.4rem | 1.428571 | 0 |
| Caption | Hanken 400 | 1.2rem | 1.333333 | 0 |
| Label | Hanken 400 | 1.3rem | 1.4 | 0 |
| CTA | Urbanist 600 | 1.4rem | 1.428571 | 0.3px, uppercase |

Los rem equivalen nominalmente a 10px en la escala base del tema; el root depende de `body_scale`. Preservar rem y escalado del usuario. Elegir H1–H3 por jerarquía semántica y `.h0` por presentación. No aplicar tracking global `−0.03em`. Las excepciones de tarjeta, PLP y shell legal se mantienen en sus selectores, sin alterar estos roles.

## 4. Espaciado, contenedores y responsive

Fuente: [tokens](../../assets/lemoon-tokens.css) y [componentes](../../assets/lemoon-components.css).

| Familia | Valor y aplicación |
| --- | --- |
| `--lemoon-space-{1,2,3,4,5,6,8,10,12,16,20}` | 0.4, 0.8, 1.2, 1.6, 2, 2.4, 3.2, 4, 4.8, 6.4, 8rem |
| Padding de sección base | `--lemoon-section-padding`: 6.4rem ≥750; 4rem <750 |
| Padding de tarjeta base | `--lemoon-card-padding`: 2rem; la tarjeta de producto tiene reglas propias |
| Gap base desktop/móvil | `--lemoon-grid-gap-desktop/mobile`: 2.4/1.6rem; usar solo donde no haya grid local |
| Capas | dropdown 100; sticky 200; overlay 300; modal 400; toast 500 |
| Movimiento | fast 150ms ease; base 250ms ease; slow 400ms ease |

Cuando una sección exponga `padding_top/bottom`, usar su fórmula responsive y los valores del template. El default de schema 36px no reemplaza el padding de todas las páginas.

| Contenedor / intervalo | Regla |
| --- | --- |
| `.page-width`, `.page-width-desktop` | Máximo 2000px por `--lemoon-max-width`; conservar centrado heredado de Dawn |
| <750px | Gutters 16px; escala móvil; composición apilada cuando lo declare la sección |
| 750–989px | Gutters 24px; composición intermedia propia de la sección |
| ≥990px | Composición desktop; gutters 24px hasta 1279px |
| ≥1280px | Gutters 42px; es cambio de gutter, no de navegación |
| Header | Máximo local 2200px en [header.liquid](../../sections/header.liquid); alturas nominales 72px desktop y 56px móvil según tokens/CSS del header |
| PLP | Grid local en [lemoon-collection-plp.css](../../assets/lemoon-collection-plp.css): columnas desktop según `--plp-desktop-columns` (fallback 3), dos entre 750–989; móvil según `--plp-mobile-columns` (fallback 2). Gap desktop ≥990: 22px horizontal/30px vertical; móvil: 12/24px |
| Sidebar PLP | Selector final ≥990: 264px + gap 28px; 750–989: 220px + gap 24px; oculto por estado `--no-filters`; drawer de filtros usa máximo local 320px bajo 990 |
| Shell legal | Columnas locales 66rem/24rem y gap 6.4rem; una columna y gap 3.2rem bajo 750; ver sección 8 |

El alias Dawn `--page-width:128rem` existe, pero `.page-width` usa el máximo Lemoon de 2000px. No imponer un grid global de 12/4 columnas ni convertir el máximo de header, sidebar o lectura en máximo global.

Mantener orden de lectura al apilar, títulos largos y mensajes de error completos. Evitar overflow horizontal de página; la media y las columnas deben poder contraerse. Verificar los dos lados de 750/990 y de 1280 cuando cambien gutters; usar móvil 390px y el ancho desktop de la referencia para revisar composición. No fijar la página a las dimensiones de un frame.

## 5. Componentes y estados

### Acciones y formularios

Reutilizar [base.css](../../assets/base.css), [lemoon-components.css](../../assets/lemoon-components.css) y los formularios nativos de la superficie.

| Componente | Selección y medidas | Estados |
| --- | --- | --- |
| Acción principal `.button` | Navy/blanco; min-height 48px; padding horizontal 2rem; radio `--lemoon-radius-button` = 9999px; rol CTA | Hover navy muted. Preservar disabled, `.loading`, spinner y bloqueo de envíos duplicados del formulario |
| Acción secundaria `.button--secondary` | Blanco/texto navy; mismas medidas base | Hover navy/blanco |
| Acción terciaria `.button--tertiary` | Transparente/texto navy, min-height 48px, padding 2rem | Hover texto navy muted; para menor jerarquía |
| Acento / destructiva | Reutilizar la clase específica ya presente en la superficie | Las variantes de Figma no crean clases globales `button--accent` o `button--destructive`; no inventar ese mapeo |
| Input/select | `.field__input`, `.select__select`: altura mínima y altura 48px; radio 4px; blanco/carbon; borde warm 1px | Foco navy 2px. Error: mensaje asociado y `aria-invalid`, color error del token. Disabled nativo y ayuda legible |
| Textarea | Misma familia visual de input; altura auto | Preservar label, ayuda y validación |
| Search | Radio de búsqueda 24px y tamaño base 40px donde lo use el componente de búsqueda | Mantener resultados, sin resultados y recuperación; no aplicar ese radio a campos generales |
| Checkbox/radio | Control nativo; tamaño base 16px y token radio control 3px donde lo use su CSS; conservar círculo del radio | Etiqueta clicable y estado checked/disabled real; no sustituir por un dibujo sin semántica |

En campos con icono usar el tamaño 24px de la referencia Input y reservar espacio para que no se superponga con texto. Mantener labels persistentes. No usar el borde warm como única señal de identificación del campo: comprobar label, forma y contraste del control completo conforme a sección 6.

### Tarjetas, etiquetas y navegación

| Familia / fuente | Regla de implementación |
| --- | --- |
| [Product card](../../snippets/card-product.liquid), [CSS](../../assets/lemoon-components.css), [JS](../../assets/lemoon-product-card.js) | Reutilizar el snippet. Outer card transparente y radio 0; media warm con radio 12px, proporción 100/96 y max-height 280px ≥990. Imagen completa `object-fit:contain`. Mantener la frontal hasta que cargue la secundaria; sin secundaria, conservar frontal |
| Texto de tarjeta | Base: nombre Hanken 13px/16px, precio Urbanist 600 18px/22px; precio anterior Hanken 14px/18px. PLP sobrescribe nombre a 15px ≥990, 14px entre 750–989 y 13px móvil; precio regular 17px ≥750 y 16px móvil. No aplicar H3 global al nombre |
| Etiquetas de producto | `.lemoon-product-card__label` usa radio full; new navy/blanco, flash-sale lemon/navy, sold-out gris/blanco, best-seller según su clase. Datos de disponibilidad, descuento y tags reales determinan su presencia |
| Badges genéricos | Editorial `--badge-corner-radius`: 0; compacto `--lemoon-radius-sm`: 4px; chips `--lemoon-radius-lg`: 20px. No sustituir con estos radios las etiquetas de producto que ya tienen regla local |
| Swatches | Reutilizar [swatch-input](../../snippets/swatch-input.liquid) o swatches del snippet de tarjeta; mantener tamaño local, círculo, nombre y estado seleccionado accesible. No imponer los 20px del frame a todas las superficies |
| [Header](../../sections/header.liquid), [CSS](../../assets/lemoon-header.css), [JS](../../assets/lemoon-header-nav.js) | Conservar variante clara, logo oficial, navegación y acciones; `aria-current` para destino actual. Menú usable por teclado y apertura explícita en móvil, además de hover desktop |
| [Announcement](../../sections/announcement-bar.liquid) y [footer](../../sections/footer.liquid) / [CSS](../../assets/section-lemoon-footer.css) | Reutilizar los componentes y sus grupos; contenido desde settings y enlaces reales. No activar una propuesta alternativa por su fecha |
| [FAQ](../../sections/lemoon-faq-page.liquid) | Reutilizar details/summary, abierto/cerrado, foco y teclado; permitir expansión del contenido sin altura rígida |
| [Drawer](../../snippets/cart-drawer.liquid), [global.js](../../assets/global.js), [PDP tools](../../assets/lemoon-pdp-tools.js) | Reutilizar apertura/cierre, Escape, contención/restauración de foco y scroll. Radio modal base 16px donde no haya override local. Los 420×760/720×520 de Figma no son dimensiones obligatorias del viewport |
| [Filtros](../../snippets/facets.liquid), [precio](../../snippets/price.liquid), [búsqueda](../../sections/main-search.liquid), [carrito](../../sections/main-cart-items.liquid) | Conservar datos nativos, estado aplicado/no aplicado, vacío, loading, error recuperable y éxito. Anunciar cambios asíncronos y mantener recuperación tras fallo |

Los radios se eligen por familia. La regla final de `lemoon-components.css` aplica radio button con `!important` a `button`, `.button`, `[role=button]`, `.pagination__item` y `.mobile-facets__open`: prevalece sobre radios locales normales, incluido el 24px declarado antes en acciones del configurador. Mantener esta regla al reutilizar las acciones; las superficies de tarjeta, campos y paneles conservan sus propios radios.

## 6. Accesibilidad y comportamiento responsive

- Mantener skip link, landmarks y un H1 de página con títulos ordenados. Enlaces navegan; botones ejecutan acciones; iconos interactivos tienen nombre accesible.
- Mantener foco visible de [base.css](../../assets/base.css) y anillos locales. Para el shell legal: navy 2px y offset 4px. Evitar que sticky headers o contenedores lo oculten.
- Asociar labels, ayudas y errores; expresar errores con texto y estado semántico. Mantener `required`, `disabled`, `aria-expanded`, selección y estado actual sincronizados.
- Objetivo de contraste [WCAG 2.1 AA](https://www.w3.org/TR/WCAG21/): texto normal 4.5:1; grande 3:1; indicadores necesarios de controles 3:1. Evaluar colores computados, opacity y fondo real. No declarar cumplimiento por reutilizar un token o captura.
- Objetivo interno de interacción: 44px según `--lemoon-size-touch`; ampliar el área clicable alrededor de iconos/swatch pequeños sin agrandar necesariamente su dibujo. Verificar los controles locales de búsqueda y filtros, que pueden tener medidas visuales menores.
- Ofrecer operación por teclado y alternativa a hover/arrastre; preservar Escape y retorno de foco en diálogos. Respetar zoom, reflow, forced-colors y `prefers-reduced-motion`; desactivar movimiento no esencial cuando se solicita reducción.
- Imágenes ausentes, cadenas largas, estados vacío/error y carga no deben ocultar la acción principal ni causar desborde. Mantener feedback de operaciones y contenido recuperable tras fallos.

## 7. Marca, imágenes y superficies

Usar el [activo oficial lemoon-logo-refined-navy.svg](../../assets/lemoon-logo-refined-navy.svg) sin redibujar letras ni recolorear. Su fill es `#0E1A28` y su viewBox 824.267×193.523. El header lo declara 120×28; conservar la proporción del activo. Ese tamaño es de header, no mínimo oficial. La definición de variantes, mínimos y clearspace corresponde a identidad extendida en LEM-80; LEM-132 mantiene su aplicación en biblioteca. No reconstruir una segunda “o” amarilla sobre el SVG.

Fotografía de producto: blanco/gris muy claro, frontal/lateral/perspectiva y armazón completo. Lifestyle: luz natural, entornos limpios, personas diversas y composición editorial. Diagramas: medidas legibles en mm. Conservar el tratamiento contain de producto y el crop/punto focal editorial de cada sección. Usar imágenes responsive con dimensiones que eviten saltos y lazy loading bajo el primer pliegue. Texto esencial en HTML y alt según función. Los placeholders no son fotografía final ni autorización de publicación.

Contenido: es-CL, frases claras, CTAs que describen la acción y moneda CLP. Reutilizar locales existentes. La voz final pertenece a [LEM-55](https://linear.app/antekera/issue/LEM-55). No convertir slogans, precios, reseñas, garantías o plazos de muestra en hechos del negocio.

| Superficie | Regla |
| --- | --- |
| Storefront Liquid | Reutilizar tokens, snippets y secciones de esta guía. [LEM-86](https://linear.app/antekera/issue/LEM-86) organiza rutas/asignaciones; configurador y receta conservan sus contratos propios |
| CMS / políticas | Reutilizar [shell legal](../../sections/lemoon-legal-page.liquid); para políticas nativas, conservar `request.page_type == 'policy'` en [layout](../../layout/theme.liquid) y [CSS nativo](../../assets/lemoon-native-policies.css). Preservar contenido y destinos nativos, sin duplicar políticas |
| Checkout / confirmación / cuentas nuevas | Usar el editor nativo de checkout/cuentas y sus opciones disponibles para logo, color y tipografía; no portar header ni estructura Liquid. El plan de páginas conserva la adaptación tipográfica nativa registrada. Verificar capacidad en el ticket de esa superficie antes de añadir extensiones. Fuentes: [checkout](https://help.shopify.com/en/manual/checkout-settings/customize-checkout-configurations/checkout-style), [cuentas](https://help.shopify.com/en/manual/customers/customer-accounts/customize-customer-accounts) |
| Back office | Compartir nombre Lemoon y activo oficial existente; los colores/familias aquí documentados describen el storefront. Respetar patrones del admin y AGENTS/guía de `antekera/lemoon-next-backoffice`; no imponer a sus controles el CSS ni anchos de esta guía |

## 8. Ejemplo de aplicación: términos

Para mantener la página de términos, partir de [page.terminos-y-condiciones.json](../../templates/page.terminos-y-condiciones.json) y reutilizar [lemoon-legal-page.liquid](../../sections/lemoon-legal-page.liquid):

1. Conservar `kind:terms` y el padding de template 64px superior/inferior. La fórmula local `×0.625` produce 40px bajo 750px.
2. Mantener H1 Urbanist 300, 4.6rem desktop/3.4rem móvil, leading 1.15, tracking −0.5px y color brand. Es excepción local; no sustituirlo por H1 base 4/3.2rem.
3. Mantener layout `minmax(0,66rem) minmax(0,24rem)` con gap 6.4rem; bajo 750 usar una columna y gap 3.2rem. El cuerpo usa Hanken 1.8rem/1.75 y máximo 66rem. El índice cálido usa radio 12px. Ninguna de estas medidas cambia el ancho global.
4. Conservar enlaces de navegación con `aria-current`, altura mínima 4.4rem y foco navy 2px/offset 4px; preservar destinos de políticas nativas y el contenido CMS cuando `demo_data` esté desactivado.
5. El template contiene `demo_data:true`: el ticket de contenido [LEM-119](https://linear.app/antekera/issue/LEM-119) debe resolver el texto definitivo antes de publicar. Aplicar esta guía no cambia ese setting ni convierte el texto de muestra en términos comerciales.
6. Revisar lectura, teclado, zoom, enlaces y desbordes a 390px y desktop, incluidos ambos lados de 750px. Verificar asignación CMS en la entrega de la página.
