# Lemoon — guía canónica de implementación visual

**Estado: consolidación documental para revisión de Miguel; no aprobación de diseño.**
Ticket: [LEM-141](https://linear.app/antekera/issue/LEM-141). Corte de fuentes: 29-10-2026, hora de Santiago (30-10 UTC). Código inspeccionado: `22a9856806a37c2cf965fd4dd9eaf867e107b482`, repositorio `antekera/lemoon-shopify-theme`.

Esta es la ubicación canónica de la guía operativa. Describe lo implementado, conserva la procedencia de las intenciones y separa conflictos pendientes. No crea tokens nuevos, cambia el tema ni aprueba marca, contenido comercial o páginas. Una discrepancia bloquea la aceptación de la superficie afectada, no todo el trabajo visual existente.

## 1. Cómo usar las fuentes

1. Mandan las instrucciones vigentes de Miguel y las decisiones explícitas del ticket de la superficie. Registrar enlace, fecha y alcance de cada aprobación; no inferirla del nombre del frame, de un check histórico o de un PR integrado.
2. Para saber qué está implementado, leer la cascada real del tema en el SHA de trabajo. El código acredita implementación, no aprobación visual ni publicación.
3. Para la intención visual, consultar el nodo específico de Figma y su decisión asociada. Un frame posterior, una página llamada “propuesta” o el texto “approved” dentro del archivo no acreditan aceptación de Miguel.
4. Este documento reconcilia esas fuentes. [Brand guidelines](brand-guidelines.md) conserva contexto de marca; [design-plan](design-plan.md), [section-inventory](section-inventory.md) y [remaining-pages-plan](remaining-pages-plan.md) conservan planificación e historia. Sus valores o estados antiguos no sobrescriben esta reconciliación.

Leyenda: **implementado** = lectura de código; **observado en Figma** = alcance indicado abajo; **histórico/propuesto** = intención sin aprobación vigente demostrada; **pendiente** = pregunta sin resolver. Ninguna categoría equivale por sí sola a validación de storefront.

### Registro de fuentes verificadas

| Fuente | Lectura realizada y límite |
| --- | --- |
| [LEM-141](https://linear.app/antekera/issue/LEM-141) y sus comentarios | Descripción completa y comentario de inicio de tanda leídos live; In Progress. Revisión final de Miguel pendiente. |
| [Figma: archivo](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce) | Páginas enumeradas por herramienta: Cover `0:1`, Foundations `9:4`, Components `9:5`, Page 4 `73:641`, Flujo de compra de cristales `111:583`, Page 6 `325:1081`, Footer — propuesta 2026 `329:583`, Product Card — propuesta 2026 `379:583`. Page 4, Page 6 y propuesta de footer no se inspeccionaron internamente. No se consultó historial de versiones ni aprobación de cada nodo. |
| [Portada `9:6`](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=9-6) | Contexto, captura y variables: inverse `#0B1F3A`, texto blanco, acento `#F7E600`; Urbanist 72/300 en portada. Es una portada, no escala universal de página. |
| [Foundations `9:10`](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=9-10) | Metadatos: paleta `9:13`, tipografía `9:60`, espaciado/radios `9:86`; barras de 4–80px. Contexto/captura adicionales rechazados por cuota Figma; no se afirma comparación visual completa ni verificación de todos los valores de variables. |
| [Components `9:5`](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=9-5) | Metadatos de componentes y variantes, detallados en sección 5. Contexto/captura de Input `13:10` y Product Card `34:39` sí recibidos y revisados. Contexto de Button `11:32` rechazado por cuota. |
| [Tokens CSS](../../assets/lemoon-tokens.css), [componentes CSS](../../assets/lemoon-components.css), [base Dawn](../../assets/base.css), [layout](../../layout/theme.liquid) | Inspección de declaraciones y orden de carga; no estilos computados de navegador. CSS de cada sección puede sobrescribir la base. |
| [Schema de settings](../../config/settings_schema.json) | Opciones/defaults leídos: esquemas de color, font pickers, logo/ancho. Un default no es un valor activo. No se usó `settings_data.json` como evidencia de producción. |
| [Logo oficial existente](../../assets/lemoon-logo-refined-navy.svg) y [header](../../sections/header.liquid) | Referencia y dimensiones inspeccionadas; header usa el SVG refinado. No se redibuja ni recolorea. |
| Documentos existentes | Leídos como contexto histórico, incluidos estados de entregas anteriores; no se repitieron esas pruebas ni se confirmó publicación. |

La consulta de bibliotecas Figma mostró kits comunitarios añadidos, sin demostrar que sean la biblioteca Lemoon aprobada. [LEM-132](https://linear.app/antekera/issue/LEM-132/ux-biblioteca-compartida-de-componentes-y-estados), leído live en Todo, es responsable de completar biblioteca, variantes y fuentes editables; no crear aquí un segundo sistema.

## 2. Tokens y cascada implementados

Usar los tokens semánticos existentes `--lemoon-*`; los nombres históricos `--color-primary`/`secondary` del plan son etiquetas documentales, no una API CSS equivalente garantizada. No usar primitivas en componentes nuevos si ya existe alias semántico.

En [theme.liquid](../../layout/theme.liquid) los settings generan estilos inline de Dawn (incluidos `--color-foreground`, `--color-background`, botones y fuentes). Luego se cargan Google Fonts, `lemoon-tokens.css`, `base.css`, `lemoon-components.css`, y estilos específicos según superficie. Los tokens sobrescriben familias Dawn; los componentes fijan colores/layout de marca. Una sección con mayor especificidad o estilos inline puede ganar. No asumir que editar un color scheme cambia todos los controles de Lemoon.

### Colores: inventario CSS, no nueva paleta aprobada

Todos los valores de esta tabla proceden de [lemoon-tokens.css](../../assets/lemoon-tokens.css). La corroboración Figma completa permanece limitada según sección 1.

| Rol / token semántico | Valor implementado | Aplicación existente o intención conservada |
| --- | --- | --- |
| `--lemoon-surface-page` / `--lemoon-text-inverse` | `#FFFFFF` | Superficie clara / texto sobre navy |
| `--lemoon-surface-warm` / `--lemoon-border-warm` | `#F7F4EE` | Paneles cálidos / contorno de campos; revisar contraste de controles |
| `--lemoon-surface-warm-hover` | `#E8E2D8` | Hover de superficie cálida |
| `--lemoon-surface-inverse`, `--lemoon-text-brand`, `--lemoon-border-strong`, `--lemoon-action-primary` | `#0B1F3A` | Navy, acción principal y foco |
| `--lemoon-action-primary-hover` | `#1A3560` | Hover navy |
| `--lemoon-action-accent` / `--lemoon-action-accent-hover` | `#F7E600` / `#E6D600` | Acento y hover; usar texto oscuro, no blanco sobre lemon |
| `--lemoon-text-primary` | `#1A1A1A` | Cuerpo de texto |
| `--lemoon-text-secondary` | `#51575E` | Ayudas y metadatos; difiere del gris histórico |
| `--lemoon-border-default` / `--lemoon-surface-disabled` | `#E0DDD8` | Separadores / superficie deshabilitada |
| `--lemoon-status-success` | `#2D8C4E` | Confirmación; acompañar de texto/estado semántico |
| `--lemoon-status-error`, `--lemoon-text-error`, `--lemoon-border-error` | `#C0392B` | Errores; no comunicar solo por color |
| `--lemoon-surface-tertiary-green` / `--lemoon-surface-green-deep` | `#DFE9DE` / `#316653` | Existen en CSS; uso de marca global pendiente de ratificación |
| `--lemoon-action-primary-alt` / `--lemoon-action-accent-alt` | `#0E1A29` / `#FFDD00` | Alternativas experimentales, no reemplazos autorizados |

La intención histórica combina blanco/carbon/navy, paneles beige y acento lemon acotado. Conservar la composición de la página existente; una nueva combinación o ampliación de uso de verdes requiere decisión, no copiar por su sola presencia en CSS.

### Tipografía implementada

Familias: `--lemoon-font-heading`: **Urbanist**, sans-serif; `--lemoon-font-body`: **Hanken Grotesk**, sans-serif. Pesos disponibles 300/400/500/600/700 para Urbanist y 400/500/600/700 para Hanken, según import en layout. Los defaults `assistant_n4` del schema no describen la familia efectiva tras overrides.

Valores de roles en [tokens](../../assets/lemoon-tokens.css), aplicados por [componentes](../../assets/lemoon-components.css). Tamaños nominales en px con la base de 10px indicada en el archivo; respetar escalado/zoom del usuario y verificar el valor computado si cambia `body_scale`.

| Rol | Familia / peso | Desktop → móvil <750 | Interlínea (factor) | Tracking |
| --- | --- | --- | --- | --- |
| Display `.h0` | Urbanist 300 | 56 → 40 | 1.142857 | −0.5px |
| H1 | Urbanist 600 | 40 → 32 | 1.2 | −0.3px |
| H2 | Urbanist 600 | 28 → 20 | 1.285714 | −0.3px |
| H3 | Urbanist 500 | 20 → 18 | 1.4 | 0 |
| Body | Hanken 400 | 16 → 16 | 1.5 | 0 |
| Body small | Hanken 400 | 14 → 14 | 1.428571 | 0 |
| Caption | Hanken 400 | 12 → 12 | 1.333333 | 0 |
| Label | Hanken 400 | 13 → 13 | 1.4 | 0 |
| CTA | Urbanist 600 | 14 → 14 | 1.428571 | 0.3px; uppercase por CSS |

La escala de tamaños disponible incluye 11/12/13/14/15/16/18/20/28/40/56/72. No asignar H1 a un elemento solo por tamaño: mantener jerarquía semántica. Secciones editoriales tienen overrides propios; no aplicar globalmente el antiguo `-0.03em` del plan. El ejemplo legal de sección 8 explica uno de esos overrides.

## 3. Espaciado, radios, capas y movimiento

Fuente: [tokens](../../assets/lemoon-tokens.css); barras de espaciado corroboradas por metadatos [Figma `9:86`](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=9-86).

| Familia | Valores existentes |
| --- | --- |
| `--lemoon-space-{1,2,3,4,5,6,8,10,12,16,20}` | 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80px nominales |
| Sección / tarjeta / gap | `--lemoon-section-padding`: 64 desktop, 40 móvil; `--lemoon-card-padding`: 20; `--lemoon-grid-gap-desktop/mobile`: 24/16 |
| Radios | none 0; control 3; sm 4; md 12; lg 20; search 24; modal 16px; full 9999px; button → full |
| Tamaños | control 48px; touch 44px; search 40px; checkbox 16px |
| Capas | dropdown 100; sticky 200; overlay 300; modal 400; toast 500 |
| Movimiento | fast 150ms ease; base 250ms ease; slow 400ms ease |

No confundir un círculo visual de 16/20/24px con su área interactiva. El token touch de 44px es la referencia interna; no todos los controles existentes la cumplen automáticamente. El search de 40px necesita comprobar el área real de interacción.

La sección puede tomar padding de settings en vez del alias global; preservar su cálculo responsive. El schema convencional usa 0–100px, paso 4 y default 36, que no impone 36 a todas las plantillas. Respetar `prefers-reduced-motion`: hay cobertura parcial en base y componentes (por ejemplo el contador del carrito); no está demostrada cobertura universal de todas las animaciones o scroll suave.

## 4. Breakpoints, grid y responsive

| Intervalo | Regla de implementación |
| --- | --- |
| <750px | Overrides móviles de tipografía/tokens a `max-width:749px`; composición apilada según sección; header nominal 56px |
| 750–989px | Tramo intermedio; no asumir que es desktop reducido. Revisar sidebar, wrap y número de columnas de la sección |
| ≥990px | Composición desktop donde lo declare la sección; header nominal 72px |
| ≥1280px | `lemoon-components.css` cambia `--lemoon-gutter-desktop` de 24 a 42px; no es un nuevo breakpoint universal de navegación |

[base.css](../../assets/base.css) contiene `.page-width` y utilidades grid Dawn; [componentes](../../assets/lemoon-components.css) redefine `.page-width` con `--lemoon-max-width:2000px`, gutters 16px móvil y 24/42px desktop. El override `--page-width:128rem` en tokens sigue existiendo, pero no limita esa regla más reciente. El header fija un máximo propio de 2200px en [su sección](../../sections/header.liquid). **1280px / 12 columnas / 4 columnas móvil es intención histórica, no grid global efectivo confirmado.** Resolver D3 antes de imponer un ancho nuevo.

La PLP usa grid propio y opciones de columnas: consultar [lemoon-collection-plp.css](../../assets/lemoon-collection-plp.css) y [main-collection-product-grid](../../sections/main-collection-product-grid.liquid), incluidas reglas posteriores que sobrescriben las primeras. Ejemplo: móvil declara gap horizontal 12px y vertical 24px, distintos del alias 16px. No homogeneizar una página existente desde una tabla genérica.

Para cada implementación: conservar orden de lectura y funciones al apilar; no fijar anchos/altos de frame como viewport obligatorio; permitir títulos extensos, zoom y estados de error; evitar overflow horizontal de página. Comparar al menos móvil 390 y desktop del frame elegido, además de ambos lados de 750/990 y 1280 si afecta al contenedor. Son comprobaciones a realizar en el ticket de página, no resultados de esta entrega documental.

## 5. Componentes reales y estados

Los enlaces Figma de esta tabla se verificaron por metadatos; **Input y Product Card además por contexto y captura**. La matriz orienta reutilización y pendientes; no certifica biblioteca terminada. Completar variantes en [LEM-132](https://linear.app/antekera/issue/LEM-132/ux-biblioteca-compartida-de-componentes-y-estados).

| Componente / referencia | Implementación a reutilizar | Estados y límites |
| --- | --- | --- |
| [Button `11:32`](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=11-32) | `.button`, `--secondary`, `--tertiary` en [componentes](../../assets/lemoon-components.css) y [base](../../assets/base.css) | Figma enumera Primary/Secondary/Accent/Ghost/Destructive, Default/Hover/Disabled. Tema: navy→navy muted, secundaria blanca→navy, terciaria transparente. No asumir mapeo de destructive/accent a una clase global. Loading, foco, pressed y disabled necesitan cobertura por superficie. |
| [Input `13:10`](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=13-10), [Select `13:23`](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=13-23) | `.field__input`, `.select__select`, `.text-area`; componentes + validación nativa de cada formulario | Input observado: Default/Focus/Error/Disabled × icono None/Leading/Trailing, altura 48px, radio 4px, iconos 24px, borde cálido normal y navy/error 2px. No sustituye labels ni validación. Disabled/errores HTML requieren semántica y mensaje, no solo apariencia Figma. |
| [Checkbox `13:30`](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=13-30), [Radio `13:37`](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=13-37) | Controles nativos usados por filtros/formularios; [facets](../../snippets/facets.liquid) | Metadatos: Checked/Unchecked. Foco, disabled y error no quedan especificados por esas dos variantes; área táctil y etiqueta necesitan QA. |
| [Product Card `34:39`](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=34-39) | [card-product](../../snippets/card-product.liquid), [CSS](../../assets/lemoon-components.css), [JS](../../assets/lemoon-product-card.js) | Figma: Default/Hover/New/Sale × 4 colores, tile 400×430 y media 400×300, radio 12. Código tiene overrides de proporción y texto: no fijar ese tile para todos los grids. Sin imagen secundaria cargada conserva la frontal. Agotado/descuento deben depender del producto real. |
| [Badge `9:130`](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=9-130) / chips / swatches | [componentes](../../assets/lemoon-components.css), [swatch-input](../../snippets/swatch-input.liquid) | Figma enumera New/Sale/Best seller/Sold out. Tokens: editorial 0, compacto 4, chip 20, círculo full. Un badge no acredita novedad, descuento ni popularidad. Selección necesita nombre y estado accesible; revisar overrides locales. |
| [Accordion `33:13`](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=33-13) | `<details>/<summary>` en [FAQ](../../sections/lemoon-faq-page.liquid) | Collapsed/Expanded en metadatos; preservar teclado y contenido legible abierto, objetivo táctil y foco. |
| [Modal `33:14`](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=33-14), [Cart Drawer `65:656`](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=65-656), [Size Guide `66:642`](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=66-642) | [cart-drawer](../../snippets/cart-drawer.liquid), [global.js](../../assets/global.js), [PDP tools](../../assets/lemoon-pdp-tools.js) | Modal figura con altura 1px en metadatos: no es spec visual completa. Drawer 420×760, tallas 720×520 son frames de referencia. Apertura/cierre, Escape, foco contenido/restaurado, scroll y viewport requieren validación real. |
| [Header Light Current `75:641`](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=75-641), [Hover `75:662`](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=75-662), [Mobile `57:74`](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=57-74) | [header](../../sections/header.liquid), [CSS](../../assets/lemoon-header.css), [nav JS](../../assets/lemoon-header-nav.js) | Otras variantes Navy/Beige existen; no activarlas automáticamente. Current por `aria-current`, acceso teclado además de hover; comprobar menú abierto y búsqueda sin resultados. |
| [Announcement `50:63`](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=50-63), [Footer desktop `58:80`](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=58-80), [mobile `65:643`](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=65-643) | [announcement](../../sections/announcement-bar.liquid), [footer](../../sections/footer.liquid), [footer CSS](../../assets/section-lemoon-footer.css) | Referencias históricas; existe una propuesta footer 2026 sin inspección visual aquí. No tomar promociones de Figma como beneficios reales. |
| Filtros / mensajes / precio | [facets](../../snippets/facets.liquid), [price](../../snippets/price.liquid), [search](../../sections/main-search.liquid), [carrito](../../sections/main-cart-items.liquid) | Cubrir aplicado/no aplicado, vacío, sin resultados, loading, error recuperable, agotado y éxito según función. Preservar estado al actualizar y anunciar cambios relevantes; no prometer estados por existir un spinner. |

## 6. Foco y accesibilidad

Reglas de aceptación para trabajo posterior, sin declaración de conformidad de la tienda:

- Mantener foco visible en enlaces, botones, campos, swatches, menús y diálogos. [base.css](../../assets/base.css) define outline y fallback `.focused`; [componentes](../../assets/lemoon-components.css) añade anillos navy en campos/swatches; [shell legal](../../sections/lemoon-legal-page.liquid) usa outline navy 2px y offset 4px. Comprobar visibilidad sobre cada fondo y que sticky headers no lo oculten.
- Mantener skip link, landmarks, H1 de página y orden lógico de títulos. El estilo display no reemplaza semántica. Enlaces navegan y botones ejecutan acciones; iconos solos necesitan nombre accesible, decorativos se ocultan a lectores.
- Labels persistentes, ayudas y errores asociados al campo; errores expresados por texto e identificación semántica, no solo rojo. Mantener required/disabled y estados expandidos/seleccionados acordes con la función real.
- Revisar contraste con colores **computados**, incluidos opacity/hover, imágenes y modo forced-colors. Como objetivo de QA WCAG 2.1 AA: texto normal 4.5:1, texto grande 3:1 y controles/indicadores necesarios 3:1. El borde beige en blanco es un riesgo pendiente D6; su presencia en Figma no exime revisión. [Referencia normativa W3C](https://www.w3.org/TR/WCAG21/).
- Operación completa por teclado, alternativa a hover y arrastre, áreas táctiles acordes con el token interno 44px. Respetar zoom/reflow, reducción de movimiento y ausencia de imagen/JS según función. No esconder información necesaria en tooltips o hover.
- Probar mensajes de éxito/error y actualizaciones asíncronas con anuncios adecuados; mantener contenido y recuperación tras fallo. Capturas estáticas no prueban estas condiciones.

## 7. Imágenes, marca y presentación editorial

Reutilizar [logo refinado](../../assets/lemoon-logo-refined-navy.svg) como activo, no como texto Urbanist reconstruido. El header lo declara 120×28; el SVG tiene viewBox 824.267×193.523. Mantener proporción. El archivo contiene fill `#0E1A28`, distinto del navy semántico y del tratamiento de la segunda “o” descrito antiguamente; no recolorear para resolverlo. Clearspace, mínimo oficial, favicon y variantes inversas siguen pendientes (D5).

Dirección de imágenes heredada de brand guidelines: producto sobre blanco/gris muy claro con frontal/lateral/perspectiva; lifestyle con luz natural, personas diversas y composición editorial; diagramas de medidas legibles con cotas en mm. Es orientación existente, no aprobación/licencia de cada activo. Los archivos `demo`/`placeholder` y las cajas vacías de Figma no son fotografía final ni prueba de disponibilidad.

Preservar el tratamiento de media de cada sección (producto completo frente a crop editorial); verificar punto focal desktop/móvil. Usar imágenes responsive y dimensiones que eviten saltos; carga diferida bajo el primer pliegue según reglas del repositorio. Texto esencial debe estar en HTML; alt según función y contenido real, sin duplicar adornos. No convertir precios, reseñas, promociones, plazos, direcciones o slogans de muestra en datos del negocio.

Para CMS/políticas: cuerpo legible y ancho acotado, párrafos cortos, títulos jerárquicos, listas y enlaces descriptivos; conservar contenido nativo y separación entre contenido comercial y legal. El shell no demuestra que el texto esté aprobado. La guía editorial final pertenece a [LEM-55](https://linear.app/antekera/issue/LEM-55/marca-mensajes-finales-y-guia-editorial-es-cl-para-agentes), leído en Todo; depende de decisiones estratégicas de LEM-82. Hasta su entrega, reutilizar es-CL existente y cadenas locales, sin crear slogan/misión ni reemplazar hechos pendientes con tono comercial. Cada página mantiene su propia entrega de copy y revisión.

### Límites por superficie

| Superficie | Qué reutilizar / qué debe verificarse |
| --- | --- |
| Storefront Liquid | Tokens/componentes existentes, templates y estilos locales. Rutas/asignación/publicación se verifican en [LEM-86](https://linear.app/antekera/issue/LEM-86), no se deducen del archivo. Configurador/receta mantienen tickets y contratos propios; no se reducen a WhatsApp por un plan viejo. |
| Página CMS y políticas nativas | [lemoon-legal-page](../../sections/lemoon-legal-page.liquid) y shell `request.page_type == 'policy'` en [layout](../../layout/theme.liquid), con [CSS nativo](../../assets/lemoon-native-policies.css). Preservar contenido y destinos nativos; no crear duplicados por diseño. |
| Checkout, confirmación/estado y cuentas nuevas/nativas | El tema Liquid no controla la estructura de estas superficies nativas; esta limitación no se generaliza a cuentas clásicas. Logo, colores y fuentes disponibles se gestionan en editor de checkout/cuentas; no prometer Urbanist exacta ni portar el header Liquid. Branding avanzado por API requiere Plus; extensiones y targets dependen de capacidad/plan real. Verificar configuración de cuentas habilitada y capacidades en su ticket antes de especificar controles o rutas. [Checkout oficial](https://help.shopify.com/en/manual/checkout-settings/customize-checkout-configurations/checkout-style), [cuentas oficiales](https://help.shopify.com/en/manual/customers/customer-accounts/customize-customer-accounts). |
| Back office | Compartir únicamente identidad Lemoon, referencia al logo oficial existente y los colores/familias como evidencia del storefront, sin imponer su uso a todos los controles. No hay aprobación transversal de tokens de app acreditada aquí. Respetar patrones nativos del admin y AGENTS/guía de `antekera/lemoon-next-backoffice`; cualquier mapeo concreto se revisa allí tras verificar remote. No se inspeccionó/renderizó la app en este ticket. |

La lectura live de información básica de tienda confirmó `lemoon.cl`, CLP y plan Basic; no se inspeccionaron clientes, pedidos ni recetas. El despacho del coordinador identifica `Shop/76333711528` y alias `pzsrt4-1u.myshopify.com`, distinto de `lemoon-8277.myshopify.com` en la regla histórica de workflow. La identidad numérica/alias procede de ese despacho, no de la consulta básica; registrar discrepancia sin reconfigurar conexión. No inferir tema publicado ni branding activo de ese dato.

## 8. Ejemplo aplicable sin decisiones nuevas: términos existentes

**Ejercicio documental sobre archivos; no rediseño, preview ni aprobación de términos.**

1. Localizar [template `page.terminos-y-condiciones.json`](../../templates/page.terminos-y-condiciones.json): usa `lemoon-legal-page`, padding 64/64 y `demo_data:true` en este SHA. La presencia del template no demuestra URL/asignación pública. Confirmar destino en LEM-86 y contenido en LEM-119 antes de aceptar/publicar.
2. Reutilizar [sección existente](../../sections/lemoon-legal-page.liquid), sin otra shell. Ya aplica page/warm, texto brand/primary/secondary y heading/body con tokens. Su H1 específico es Urbanist 300, 46px desktop/34px móvil, leading 1.15; conservarlo como override local, no sustituir por el H1 genérico 40/32 sin decisión.
3. Su layout es `minmax(0,66rem) minmax(0,24rem)` con gap 64px; bajo 750 pasa a una columna con gap 32px. Cuerpo 18px/1.75 y máximo 66rem. Padding móvil calcula `64 × 0.625 = 40px`. Estos valores están en el archivo y no exigen elegir una nueva medida.
4. Mantener navegación con `aria-label`, `aria-current`, enlaces de al menos 44px y foco navy 2px/offset 4px. Preservar contenido CMS cuando el modo demo esté desactivado; no cambiar ese modo ni editar copy desde LEM-141. El modo demo actual impide usar el ejemplo como prueba de texto legal final.
5. En el ticket de página, comprobar contenido real, enlaces de políticas/contacto, lectura móvil/desktop, zoom, teclado y desbordes de la columna. Si hay conflicto con D3 o copy pendiente, registrar evidencia y pedir decisión concreta; conservar el resto de la implementación.

Resultado del ejercicio: se puede identificar sección, tokens, medidas y estados sin inventar diseño; siguen pendientes la validación renderizada, la asignación CMS y el contenido definitivo. No se certifica la página completa.

## 9. Discrepancias y preguntas para Miguel

Ninguna fila se resuelve eligiendo silenciosamente un valor. “Conservar” indica continuidad de implementación existente, no ratificación de marca. Añadir aquí el enlace de decisión y actualizar la fuente afectada cuando Miguel responda.

| ID / evidencia | Diferencia y efecto | Pregunta concreta / tratamiento provisional |
| --- | --- | --- |
| D1 — [plan histórico](design-plan.md) §1 vs [tokens](../../assets/lemoon-tokens.css), portada Figma `9:6` | Plan: navy `#0D1B3E`, hover `#1E3A6E`, lemon `#D4E44B`; CSS: `#0B1F3A`, `#1A3560`, `#F7E600`. Portada corrobora navy/lemon CSS, no todos los contextos. | ¿Ratificas el conjunto semántico CSS como base y retiras los tres valores históricos? Conservar páginas existentes; no recolorear. |
| D2 — brand guidelines previas vs CSS y [Input `13:10`](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=13-10) | Guía decía inputs/botones 24px; plan dice 4px; CSS usa botones full, campos 4 y search 24; Input observado usa 4. Modal 16 en tokens vs 32 en plan. | ¿Confirmas esos radios por familia y modal 16, o qué componente debe cambiar? No extender un radio global nuevo. |
| D3 — plan/guía históricos vs cascada | Máximo 1280/12 columnas vs `.page-width` 2000 y header 2200; gaps locales difieren de 24/16. | ¿Se conservan máximos actuales por superficie o cuáles deben volver a 1280? Entregar una decisión por superficie antes de modificar layout. |
| D4 — CSS vs texto generado por contexto Input | CSS Hanken/secondary `#51575E`; guías previas secondary `#6B6B6B`. El contexto Figma devuelve alias `--lemoon-font-family-body` con fallback `Source Sans 3` y gris `#6B6B6B`, distintos de nombres CSS. No se verificó toda la colección de variables. | ¿Hanken y gris CSS quedan ratificados, y quién sincroniza alias/valores Figma en LEM-132? No instalar otra familia por un fallback generado. |
| D5 — logo oficial existente vs descripción histórica de wordmark | SVG refinado fill `#0E1A28`; descripción previa segunda “o” lemon y letras navy/white. Estudios `321:583` son variantes nuevas, no reemplazo demostrado. | ¿La regla de acento aplica solo al fallback tipográfico? Confirmar variantes inversas, mínimo y clearspace. Reutilizar activo oficial sin recolor. |
| D6 — campos beige/blanco en CSS y Figma Input | Borde cálido de muy bajo contraste; la captura no demuestra identificación accesible en todas las variantes. | ¿Qué tratamiento de borde accesible debe especificar LEM-132 tras medir el componente completo? No seleccionar otro color aquí; verificar foco/label y contraste antes de aceptación. |
| D7 — múltiples direcciones y tarjetas | Originales 60/62/63, Direction 02 `268:584`, Product Card 2026 `379:584`; código card difiere del tile original observado. | ¿Qué nodo/version es la referencia aceptada por superficie y cuáles son exploraciones? Conservar implementación existente y no convertir el nombre “propuesta” en aprobación. |
| D8 — historial de planes vs alcance vigente | Plan difiere configurador/cuentas a Fase 2 y llama configurador “no existe”; inventario ya contiene implementación. LEM-141/132/55 separan guía/biblioteca/editorial. | La documentación histórica queda contextualizada, no reactiva fases ni difiere receta. Cualquier conflicto de alcance se resuelve en ticket vigente y política MVP, no mediante este documento. |
| D9 — marca compartida y verdes | Verdes tertiary/deep existen en CSS, sin decisión transversal de back office verificada. | ¿Qué elementos se ratifican para app y qué usos de verdes? No portar estilos de storefront al admin mientras falte esa decisión. |

## 10. Evidencia de entrega y aceptación pendiente

El autor comprobó archivos, referencias relativas, consistencia y alcance del diff documental. En su entrega inicial no ejecutó Vitest, Playwright, preview ni `shopify theme check`. El cambio es exclusivamente documental: no cambia Liquid/CSS/JS/schema/locales ni comportamiento del tema. No se cambió Shopify, Figma, Linear, configuración ni datos de clientes.

Posteriormente, el tester ejecutó `shopify theme check --fail-level error` sobre el snapshot documental registrado en su reporte local `/tmp/lemoon-pilot-validation.md`: 252 archivos inspeccionados, 0 infracciones y salida 0. El log local es `/tmp/lemoon-141-theme-check.log`; estas rutas son evidencia del entorno de trabajo, no enlaces públicos del repositorio. El reporte identifica HEAD/base y hashes de los documentos probados. La corrección documental posterior refresca enlaces, diff y hashes en el reporte local `/tmp/LEM-141-fixes.md`, sin atribuir al tester una ejecución sobre estos nuevos bytes ni repetir Theme Check. Este resultado no acredita aprobación visual, comprobación de versiones Figma, integración ni publicación.

Context7 se intentó primero para restricciones Shopify y devolvió cuota mensual agotada; se consultó ayuda oficial enlazada en sección 7. La cuota Figma impidió completar contexto/capturas de Foundations y Button. No se reclama auditoría integral de variables ni equivalencia visual entre todos los frames y el tema.

La revisión independiente de fuentes/convenciones del snapshot previo quedó registrada en el reporte local `/tmp/LEM-141-review.md`, con dos notas P3 atendidas en esta corrección por el autor; no constituye revisión independiente de los bytes corregidos ni aprobación de marca. Para aceptar LEM-141 siguen pendientes la revisión y decisiones de Miguel (D1–D7/D9 según alcance), incluida la ratificación del CSS como base documental, completar las comprobaciones Figma limitadas y el PR documental a cargo del coordinador. Ninguna respuesta ni aprobación de versiones Figma se presume. Este documento es el artefacto revisable; no marca el ticket Done/In Review ni autoriza merge o publicación.
