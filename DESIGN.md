# Lemoon — especificación de implementación visual

Esta guía fija las reglas de implementación del storefront a partir de los tokens y componentes existentes del tema. Reutilizar esas reglas al mantener páginas o construir secciones de la misma familia. Cada excepción local se aplica únicamente a su componente. [Brand guidelines](docs/design/brand-guidelines.md) define el uso de marca; [design-plan](docs/design/design-plan.md) organiza las superficies; [section-inventory](docs/design/section-inventory.md) localiza las secciones y [remaining-pages-plan](docs/design/remaining-pages-plan.md) conserva las dependencias de entrega.

## Intención visual

**Lemoon presenta óptica con una composición editorial limpia: producto protagonista, espacio generoso y una jerarquía clara que acompaña la elección.** Esta tesis resume la dirección existente de marca y las familias del tema.

La experiencia debe sentirse cercana y fácil de recorrer. Las fotografías permiten examinar el armazón completo; los títulos orientan y el cuerpo facilita comparar información de producto, ayuda y condiciones. La composición editorial aporta identidad sin competir con el catálogo ni con las acciones de compra.

Para decisiones de expresión visual o redacción, consultar el [brief estratégico LEM-82](docs/design/brand-strategy.md), aprobado por Miguel el 01-11-2026: facilidad de compra, precio accesible y personalidad cercana, atrevida y práctica; eslogan «Se te ven bien». Aplicar esa dirección con las reglas visuales de este documento, sin introducir nuevos tokens, fuentes o componentes por inferencia.

### Decisiones y motivos

- **Blanco/carbon y paneles beige:** separar lectura y agrupaciones de contenido con una base tranquila que deje protagonismo al producto.
- **Navy en acciones y foco:** dar continuidad visual a la navegación y a los controles que guían el recorrido. Lemon destaca momentos puntuales sin competir con la acción principal.
- **Urbanist y Hanken Grotesk:** distinguir títulos/acciones del texto de lectura con las dos familias existentes; mantener sus roles facilita reconocer la jerarquía entre páginas.
- **Producto completo y crop editorial:** mostrar el armazón con `contain` permite examinar su forma; las imágenes lifestyle pueden usar recorte y punto focal para comunicar contexto.
- **Medidas por familia:** una tarjeta de catálogo y una página legal resuelven tareas distintas; conservar sus proporciones y anchos locales mantiene legibilidad y consistencia sin uniformarlos.

## 1. Fuentes y precedencia

La base normativa de esta especificación es la implementación existente: [tokens](assets/lemoon-tokens.css), [componentes](assets/lemoon-components.css), [base Dawn](assets/base.css), [layout](layout/theme.liquid) y las fuentes locales enlazadas por componente. Aplicar en este orden:

1. La instrucción explícita del ticket de la superficie define su alcance y referencia visual.
2. Para una familia existente, reutilizar su sección, snippet y reglas locales completas, incluidas sus media queries; tienen precedencia sobre los valores genéricos de esta guía. Los requisitos de accesibilidad de las secciones 5–6 prevalecen sobre copiar un defecto local: aplicar la receta accesible a controles nuevos o modificados.
3. Para componentes sin excepción local, usar los roles semánticos y valores base de las secciones 2–5. No crear aliases paralelos `--color-primary` ni sustituir tokens por valores de un plan antiguo.
4. Las referencias Figma sirven para la composición del componente correspondiente. No importar propuestas alternativas o tamaños de frame a todas las páginas.

### Reglas de uso

| Usar | Evitar |
| --- | --- |
| Tokens semánticos de esta guía y las dos familias tipográficas del tema | Colores sueltos, aliases paralelos o una tercera familia en storefront |
| La familia existente del componente y su excepción local documentada | Extender el radio, ancho o tamaño de un componente a todas las superficies |
| Navy para acciones principales y lemon para acentos localizados | Fondos extensos lemon o variantes Figma alternativas sin una instrucción de superficie |
| Producto completo en media de catálogo; punto focal responsive en imágenes editoriales | Recortar el armazón para llenar la tarjeta o esconder texto esencial en una imagen |
| Estados perceptibles, labels persistentes y acciones accesibles por teclado | Depender solo de color, hover o movimiento para comunicar una función |
| Datos reales y contenido comercial confirmado en el ticket propietario | Convertir precios, reseñas, garantías o plazos de muestra en hechos del negocio |

Las medidas, excepciones y criterios de aceptación se detallan en las secciones siguientes; esta tabla orienta su selección al crear o modificar una superficie.

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
| [Flujo de cristales `412:979`](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=412-979) | Referencia indicada por el usuario y registrada en [plan de páginas](docs/design/remaining-pages-plan.md); sustituye el esquema histórico de cinco pasos |

Las direcciones alternativas y páginas de propuestas de Figma se mantienen como exploraciones; no sustituyen estas familias. La biblioteca editable y sus variantes pertenecen a [LEM-132](https://linear.app/antekera/issue/LEM-132); la identidad extendida y sus aplicaciones pertenecen a [LEM-80](https://linear.app/antekera/issue/LEM-80). Esta guía proporciona la selección operativa de componentes del tema para trabajar sin esperar una biblioteca nueva.

## 2. Color

Usar los siguientes tokens semánticos de [lemoon-tokens.css](assets/lemoon-tokens.css):

| Rol / token | Valor | Regla de selección |
| --- | --- | --- |
| `--lemoon-surface-page` / `--lemoon-text-inverse` | `#FFFFFF` | Fondo de página / texto sobre navy |
| `--lemoon-surface-warm` / `--lemoon-border-warm` | `#F7F4EE` | Panel cálido / contorno warm existente; para campos nuevos o modificados aplicar sección 5 |
| `--lemoon-surface-warm-hover` | `#E8E2D8` | Hover de la superficie cálida |
| `--lemoon-surface-inverse`, `--lemoon-text-brand`, `--lemoon-border-strong`, `--lemoon-action-primary` | `#0B1F3A` | Superficie inversa, texto de marca, contorno accesible de campos, foco y acción principal |
| `--lemoon-border-input` | `#6685AD` | Contorno azul claro de campos migrados en reposo |
| `--lemoon-action-primary-hover` | `#1A3560` | Hover de acción navy |
| `--lemoon-action-accent` / `--lemoon-action-accent-hover` | `#F7E600` / `#E6D600` | Acento y hover; combinar con texto navy o carbon |
| `--lemoon-text-primary` | `#1A1A1A` | Texto principal |
| `--lemoon-text-secondary` | `#51575E` | Ayudas, labels y metadatos |
| `--lemoon-border-default` / `--lemoon-surface-disabled` | `#E0DDD8` | Separadores / superficie deshabilitada |
| `--lemoon-status-success` | `#2D8C4E` | Confirmación acompañada de texto |
| `--lemoon-status-error`, `--lemoon-text-error`, `--lemoon-border-error` | `#C0392B` | Error acompañado de mensaje y estado semántico |
| `--lemoon-surface-tertiary-green` / `--lemoon-surface-green-deep` | `#DFE9DE` / `#316653` | Mantener en los componentes que ya los usan, como `.lemoon-about__inner` y la etiqueta `--best-seller`; no convertirlos en fondo general |

Blanco/carbon es la combinación base; beige distingue paneles y navy las acciones principales. Lemon es acento localizado. Conservar los tratamientos de cada sección existente. Los aliases `--lemoon-action-primary-alt:#0E1A29` y `--lemoon-action-accent-alt:#FFDD00` están reservados a exploraciones; no seleccionarlos para componentes nuevos de esta base.

Los roles semánticos gobiernan los controles Lemoon; un color scheme del editor no los recolorea todos. Para el orden de estilos, settings y overrides, consultar [integración de estilos](docs/design/design-plan.md#integración-de-estilos-y-settings).

## 3. Tipografía

Familia heading: `--lemoon-font-heading`, **Urbanist**, sans-serif. Familia body: `--lemoon-font-body`, **Hanken Grotesk**, sans-serif. El [layout](layout/theme.liquid) carga Urbanist 300/400/500/600/700 y Hanken 400/500/600/700. Aplicar los roles de [tokens](assets/lemoon-tokens.css) mediante las clases de [componentes](assets/lemoon-components.css):

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

Fuente: [tokens](assets/lemoon-tokens.css) y [componentes](assets/lemoon-components.css).

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
| Header | Máximo local 2200px en [header.liquid](sections/header.liquid); alturas nominales 72px desktop y 56px móvil según tokens/CSS del header |
| PLP | Grid local en [lemoon-collection-plp.css](assets/lemoon-collection-plp.css): columnas desktop según `--plp-desktop-columns` (fallback 3), dos entre 750–989; móvil según `--plp-mobile-columns` (fallback 2). Gap desktop ≥990: 22px horizontal/30px vertical; móvil: 12/24px |
| Sidebar PLP | Selector final ≥990: 264px + gap 28px; 750–989: 220px + gap 24px; oculto por estado `--no-filters`; drawer de filtros usa máximo local 320px bajo 990 |
| Shell legal | Una columna centrada de hasta 66rem, sin eyebrow ni navegación lateral; ver sección 8 |

El alias Dawn `--page-width:128rem` existe, pero `.page-width` usa el máximo Lemoon de 2000px. No imponer un grid global de 12/4 columnas ni convertir el máximo de header, sidebar o lectura en máximo global.

Mantener orden de lectura al apilar, títulos largos y mensajes de error completos. Evitar overflow horizontal de página; la media y las columnas deben poder contraerse. Verificar los dos lados de 750/990 y de 1280 cuando cambien gutters; usar móvil 390px y el ancho desktop de la referencia para revisar composición. No fijar la página a las dimensiones de un frame.

### Nosotros: relato editorial continuo

La composición de `/pages/nosotros` fue autorizada por el usuario el 02-11-2026 como un relato continuo, tomando la estructura History de Warby Parker como referencia. Su dueño es `sections/lemoon-about-page.liquid`: un único H1 y un cuerpo richtext editable, sin subtítulos internos, tarjetas, paneles, CTAs, imagen ni placeholder. El eslogan se muestra después del cuerpo como un párrafo independiente desde el ajuste global `settings.brand_slogan`; separarlo con `--lemoon-space-8`, conservar Hanken Grotesk 1.8rem/1.7 y omitirlo si el valor está vacío. El cuerpo editable no duplica el eslogan. Esta decisión sustituye el hero con imagen y las tarjetas anteriores solo en esta sección; no cambia otras familias editoriales.

Mantener un ancho local máximo de 72rem y los gutters responsive existentes de `.page-width`. El H1 conserva Urbanist y su escala/peso global; el cuerpo usa Hanken Grotesk, `--lemoon-fs-18` y line-height 1.7, con separación `--lemoon-space-6` entre párrafos. Conservar el padding configurable de la sección (75% bajo 750px). El carrusel de productos permanece como sección independiente posterior, con su composición y controles existentes; no forma parte del relato.

### Quiz de estilo: resultados de catálogo

El flujo comienza con una elección única de ópticos o solares; Continuar sin elegir permite explorar ambos. Sigue forma, color, detalles, uso y presencia: seis etapas y seis accesos de edición. La categoría limita candidatos antes del ranking, sin aportar puntos. Para solares, ocultar y limpiar Trabajo/estudio, y presentar Paseos y viajes. Las dos categorías del primer paso usan la [serie de estudio v1](docs/design/style-quiz-prototype/generated-category-studio-v1/README.md): una sola montura óptica o de sol en perspectiva sobre blanco, decorativa y sin acreditar SKU. JPEG480/960, proporción3:2 y contain. Los assets editoriales de categoría anteriores se conservan intactos. Cambiar categoría conserva las preferencias compatibles.

En todas las etapas, el rótulo de categoría se muestra solo encima del título; no se repite como heading antes de las opciones. Los grupos conservan su nombre accesible mediante aria-label, incluidos los subgrupos de Detalles. La pregunta y su descripción se presentan encima de las opciones. La descripción ocupa el 80% del ancho de contenido desde750px y el 100% por debajo, sin límite por caracteres. Las opciones conservan sus columnas internas y se centran en un máximo de96rem; no se amplía el texto sobre las tarjetas ni se usan saltos forzados.

Los números decorativos 01–06 de las preguntas usan navy (`--lemoon-text-brand`) para distinguirse del fondo; conservan tamaño, peso y ocultación móvil.

El indicador de las seis etapas se centra respecto al viewport dentro del contenedor simétrico: seis círculos de 12px separados por 20px, sin líneas conectoras; un aro navy de 2px con separación de 4px distingue el paso actual. Los círculos empiezan amarillos; cada etapa recorrida con Continuar pasa a navy y conserva ese estado al volver. Reiniciar devuelve todos a amarillo. La leyenda «Paso X de 6» se anuncia solo a lectores de pantalla, sin texto visible. Volver se ubica abajo a la izquierda y reemplaza Muéstrame variedad; Continuar permanece a la derecha. Las preguntas siguen siendo opcionales: continuar sin elegir conserva la exploración amplia.


En `sections/lemoon-style-quiz.liquid`, los resultados usan `card-product` canónica sin texto de afinidad debajo de cada tarjeta. El resumen editable de preferencias aparece una sola vez antes del listado; describe la búsqueda, sin afirmar que cada producto coincide con todos los criterios. Mantener ranking y selección de variante por afinidad.

La grilla conserva tres columnas de escritorio y dos en tablet. Bajo 750px muestra **dos columnas**, con separación horizontal de 1.2rem y vertical de 2.4rem, como la categoría móvil. Las columnas usan `minmax(0,1fr)` y cada tarjeta puede contraerse. Mostrar hasta doce productos inicialmente y ampliar por doce, siempre limitado al grupo real disponible y sin duplicar variantes de un mismo producto. Esta decisión local fue solicitada por el usuario durante la revisión de LEM-11; no modifica las tarjetas ni grids de otras superficies.

La entrada del quiz usa el título «Tu próximo par.» y el subtítulo «Formas, colores y detalles que van contigo. Encuentra los tuyos.», sin restringirlo a 16ch; permite reflujo al ampliar el texto. No muestra la instrucción de seis pasos ni «Puedes cambiar de idea». El acceso Explorar el catálogo aparece subrayado en reposo. En móvil (<750px), invitación y descripción no tienen límite de ancho; la descripción ocupa todo el ancho de contenido disponible, conservando los márgenes laterales del tema.

El botón de inicio conserva su espacio y aspecto navy desde el primer render con JavaScript habilitado; permanece deshabilitado hasta enlazar el controlador. Un marcador síncrono local oculta los resultados editoriales durante esa carga para que tampoco desplacen el footer al inicializar. Sin JavaScript, ante descarga fallida del módulo o datos inválidos, se conserva el catálogo editorial y se oculta el inicio inoperante. No se reserva una altura rígida ni se modifica el ranking.

El acabado local del quiz conserva la fotografía editorial completa (`contain`), un marco cálido de radio lg con contorno desplazado y trama de puntos tenue derivada de navy; la decoración no invade fotos ni lectura. La portada por defecto y las cuatro opciones de uso incorporan la [serie editorial generada v1](docs/design/style-quiz-prototype/generated-images-v1/README.md), autorizada por el usuario para este quiz. Son escenas conceptuales, no fotos de SKU. Usar JPEG responsive: portada 700/1400px y uso 480/960px, proporción 3:2, dimensiones explícitas y ningún recorte del armazón. Conservar la imagen configurable del editor sobre el respaldo de portada. Las opciones de uso mantienen texto HTML, imagen decorativa con alt vacío y carga diferida. Las opciones tienen indicador circular visible en reposo, borde/check navy y acento lemon al elegir, foco independiente y elevación máxima de 2px solo con puntero fino. Las pestañas comparten una pista cálida con control activo blanco. Detalles presenta solo Acabados y Materiales. Las muestras Mate/Brillante comparten geometría y escala con luz difusa/reflejo definido; Carey y Transparentes se presentan únicamente en Color. Gradientes y clipPaths usan identificadores únicos por sección/grupo/opción. Las restantes muestras siguen siendo vectoriales, sin filtros SVG pesados.

La familia Forma adopta el outline frontal realista simplificado como icono que el usuario definió con Aviador: contorno único navy de 5 unidades, remates redondeados, sin rellenos, sombras, líneas interiores ni microdetalles. Redondo casi circular; rectangular bajo y ancho; cat-eye con línea superior más recta y elevación exterior moderada; geométrico de seis facetas rectas con esquinas definidas y unión miter; cuadrado alto con base amplia; ovalado horizontal continuo; panto con hombros más planos, bowl inferior redondeado y puente keyhole. Los ocho dibujos comparten viewBox320×160, escala de montura y trazo, conservando proporciones reconocibles. Aviador mantiene exactamente sus curvas aprobadas y SVG depurado. El usuario autorizó extender el estilo a las otras siete formas; la familia queda presentada para su revisión visual en local. Las fotografías consultadas orientan proporciones, no se incorporan al tema ni acreditan SKU. [Referencias y criterio visual](docs/design/style-quiz-prototype/visual-finishing-spec.md#familia-de-formas-outline-realista).

En móvil, la recapitulación del quiz dispone seis controles en dos columnas, con Detalles a ancho completo y label/valor en líneas separadas; conserva cada respuesta y su edición, con targets de al menos 48px. El título de resultados ocupa el ancho disponible; las tarjetas comerciales y sus separaciones siguen intactas. Reduced motion retira desplazamientos y transiciones; colores forzados conserva borde/check y retira tramas/sombras. Los acabados no cambian los roles tipográficos H1/H2 ni estilos de otras páginas. [Spec y evidencia de referencia](docs/design/style-quiz-prototype/visual-finishing-spec.md).

### Movimiento e interacción

El movimiento comunica respuesta y continuidad de estado; la información necesaria permanece disponible sin animación. Reutilizar las transiciones del componente antes de añadir otra.

| Función | Regla |
| --- | --- |
| Feedback breve de hover | Usar `--lemoon-motion-fast` (150ms ease) en cambios de color de acciones; el foco debe aparecer al recibirlo, sin esperar una animación |
| Cambio de imagen de producto | Usar `--lemoon-motion-base` (250ms ease) para la transición de opacidad; conservar la frontal hasta que la secundaria esté lista |
| Apertura/cierre de menú o drawer | Conservar la duración local y sincronizar visibilidad, estado expandido y foco; no introducir una espera para poder operar |
| Movimiento lento | Reservar `--lemoon-motion-slow` (400ms ease) a componentes que ya lo usen; su existencia no pide añadir animación decorativa |
| Reducción de movimiento | Con `prefers-reduced-motion`, retirar desplazamientos y transiciones no esenciales; mantener cambio de estado, feedback y operación completos |

## 5. Componentes y estados

### Acciones y formularios

Reutilizar [base.css](assets/base.css), [lemoon-components.css](assets/lemoon-components.css) y los formularios nativos de la superficie.

| Componente | Selección y medidas | Estados |
| --- | --- | --- |
| Acción principal `.button` | Navy/blanco; min-height 48px ≥750px / 44px <750px; padding horizontal 2rem; radio `--lemoon-radius-button` = 9999px; rol CTA | Hover navy muted. Preservar disabled, `.loading`, spinner y bloqueo de envíos duplicados del formulario |
| Acción secundaria `.button--secondary` | Blanco/texto navy; mismas medidas base, incluido min-height 48px ≥750px / 44px <750px | Hover navy/blanco |
| Acción terciaria `.button--tertiary` | Transparente/texto navy, min-height 48px ≥750px / 44px <750px, padding 2rem | Hover texto navy muted; para menor jerarquía |
| Acento / destructiva | Reutilizar la clase específica ya presente en la superficie | Las variantes de Figma no crean clases globales `button--accent` o `button--destructive`; no inventar ese mapeo |
| Input/select | `.field__input`, `.select__select`: altura mínima y altura 48px; radio 4px; blanco/carbon; contorno continuo 1px `--lemoon-border-input` cuando el fondo no delimite el área editable con contraste ≥3:1 (receta debajo) | Foco navy continuo de 2px sobre el mismo borde, sin espacio ni doble línea. Error: mensaje asociado y `aria-invalid`, con borde rojo también al enfocar. Disabled nativo y ayuda legible |
| Textarea | Misma familia visual de input; altura auto | Preservar label, ayuda y validación |
| Search | Radio de búsqueda 24px y tamaño base 40px donde lo use el componente de búsqueda | Mantener resultados, sin resultados y recuperación; no aplicar ese radio a campos generales |
| Checkbox/radio | Control nativo; tamaño base 16px y token radio control 3px donde lo use su CSS; conservar círculo del radio | Etiqueta clicable y estado checked/disabled real; no sustituir por un dibujo sin semántica |

Las alturas de la familia base de botones usan `--lemoon-size-control` (48px) desde 750px y `--lemoon-size-touch` (44px) bajo 750px, conforme al override móvil de lemoon-components.css. Conservar las excepciones locales de medidas, como quick-add, dentro de su componente.

**Receta para campos nuevos o modificados:** el área editable debe quedar delimitada antes del foco. Cuando el fondo blanco del campo y su entorno blanco/warm no produzcan una delimitación con contraste ≥3:1, usar un contorno continuo de 1px con `--lemoon-border-input` (azul `#6685AD`), sin opacidad reducida. Aplicar esta regla también a textarea y búsqueda cuando compartan ese caso. El foco debe distinguirse del contorno de reposo con un borde navy continuo de 2px, sin espacio ni anillo exterior, visible y sin recortes. Conservar un label persistente asociado y ayuda vinculada mediante `aria-describedby` cuando corresponda; label, ayuda y placeholder no sustituyen la delimitación del área editable. Comprobar contraste con los colores computados y fondos adyacentes reales en reposo y foco, además de error y disabled según su función.

El borde warm de 1px sobre blanco describe el CSS existente; no es por sí solo la receta aceptable para estos campos: warm/blanco da aproximadamente 1.098:1. El token `--lemoon-border-strong` da aproximadamente 16.518:1 sobre blanco y 15.047:1 sobre warm. Son cálculos de colores sólidos, no una certificación de controles renderizados. [LEM-132](https://linear.app/antekera/issue/LEM-132) debe reconciliar los campos legacy y las variantes de biblioteca con esta receta; reutilizar CSS existente no acredita su cumplimiento ni exime a los controles nuevos o modificados de aplicarla.

En campos con icono usar el tamaño 24px de la referencia Input y reservar espacio para que no se superponga con texto.

### Tarjetas, etiquetas y navegación

| Familia / fuente | Regla de implementación |
| --- | --- |
| [Product card](snippets/card-product.liquid), [CSS](assets/lemoon-components.css), [JS](assets/lemoon-product-card.js) | Reutilizar el snippet. Outer card transparente y radio 0; media warm con radio 12px, proporción 100/96 y max-height 280px ≥990. Imagen completa `object-fit:contain`. Mantener la frontal hasta que cargue la secundaria; sin secundaria, conservar frontal |
| Texto de tarjeta | Base: nombre Hanken 13px/16px, precio Urbanist 600 18px/22px; precio anterior Hanken 14px/18px. PLP sobrescribe nombre a 15px ≥990, 14px entre 750–989 y 13px móvil; precio regular 17px ≥750 y 16px móvil. No aplicar H3 global al nombre |
| Etiquetas de producto | `.lemoon-product-card__label` usa radio full; new navy/blanco, flash-sale lemon/navy, sold-out gris/blanco, best-seller según su clase. Datos de disponibilidad, descuento y tags reales determinan su presencia |
| Badges genéricos | Editorial `--badge-corner-radius`: 0; compacto `--lemoon-radius-sm`: 4px; chips `--lemoon-radius-lg`: 20px. No sustituir con estos radios las etiquetas de producto que ya tienen regla local |
| Swatches | Reutilizar [swatch-input](snippets/swatch-input.liquid) o swatches del snippet de tarjeta; mantener tamaño local, círculo, nombre y estado seleccionado accesible. No imponer los 20px del frame a todas las superficies |
| [Header](sections/header.liquid), [CSS](assets/lemoon-header.css), [JS](assets/lemoon-header-nav.js) | Conservar variante clara, logo oficial, navegación y acciones; `aria-current` para destino actual. Menú usable por teclado y apertura explícita en móvil, además de hover desktop |
| [Announcement](sections/announcement-bar.liquid) y [footer](sections/footer.liquid) / [CSS](assets/section-lemoon-footer.css) | Reutilizar los componentes y sus grupos; contenido desde settings y enlaces reales. No activar una propuesta alternativa por su fecha |
| [FAQ](sections/lemoon-faq-page.liquid) | FAQ agrupada en una columna centrada de hasta 700px con 20px de padding horizontal, como el cuerpo del artículo; details/summary con primera pregunta abierta y una sola abierta por sección, foco y teclado nativos, sin altura rígida; pregunta de 18px en escritorio y 16px en móvil/tablet, respuesta con interlínea 1.5, separación de encabezado de 32px y transición progresiva de apertura/cierre con alternativa inmediata en navegadores sin soporte o con movimiento reducido |
| [Drawer](snippets/cart-drawer.liquid), [global.js](assets/global.js), [PDP tools](assets/lemoon-pdp-tools.js) | Reutilizar apertura/cierre, Escape, contención/restauración de foco y scroll. Radio modal base 16px donde no haya override local. Los 420×760/720×520 de Figma no son dimensiones obligatorias del viewport |
| [Filtros](snippets/facets.liquid), [precio](snippets/price.liquid), [búsqueda](sections/main-search.liquid), [carrito](sections/main-cart-items.liquid) | Conservar datos nativos, estado aplicado/no aplicado, vacío, loading, error recuperable y éxito. Anunciar cambios asíncronos y mantener recuperación tras fallo |

Los radios se eligen por familia. La regla final de `lemoon-components.css` aplica radio button con `!important` a `button`, `.button`, `[role=button]`, `.pagination__item` y `.mobile-facets__open`: prevalece sobre radios locales normales, incluido el 24px declarado antes en acciones del configurador. Mantener esta regla al reutilizar las acciones; las superficies de tarjeta, campos y paneles conservan sus propios radios.

## 6. Accesibilidad y comportamiento responsive

- Mantener skip link, landmarks y un H1 de página con títulos ordenados. Enlaces navegan; botones ejecutan acciones; iconos interactivos tienen nombre accesible.
- Mantener foco visible de [base.css](assets/base.css) y anillos locales. Para el shell legal: navy 2px y offset 4px. Evitar que sticky headers o contenedores lo oculten.
- Asociar labels, ayudas y errores; expresar errores con texto y estado semántico. Mantener `required`, `disabled`, `aria-expanded`, selección y estado actual sincronizados.
- Objetivo de contraste [WCAG 2.1 AA](https://www.w3.org/TR/WCAG21/): texto normal 4.5:1; grande 3:1; indicadores necesarios de controles 3:1. Evaluar colores computados, opacity y fondo real. No declarar cumplimiento por reutilizar un token o captura.
- Objetivo interno de interacción: 44px según `--lemoon-size-touch`; ampliar el área clicable alrededor de iconos/swatch pequeños sin agrandar necesariamente su dibujo. Verificar los controles locales de búsqueda y filtros, que pueden tener medidas visuales menores.
- Ofrecer operación por teclado y alternativa a hover/arrastre; preservar Escape y retorno de foco en diálogos. Respetar zoom, reflow, forced-colors y `prefers-reduced-motion`; desactivar movimiento no esencial cuando se solicita reducción.
- Imágenes ausentes, cadenas largas, estados vacío/error y carga no deben ocultar la acción principal ni causar desborde. Mantener feedback de operaciones y contenido recuperable tras fallos.

## 7. Marca, imágenes y superficies

Usar el [activo oficial lemoon-logo-refined-navy.svg](assets/lemoon-logo-refined-navy.svg) sin redibujar letras ni recolorear. Su fill es `#0E1A28` y su viewBox 824.267×193.523. El header lo declara 120×28; conservar la proporción del activo. Ese tamaño es de header, no mínimo oficial. La definición de variantes, mínimos y clearspace corresponde a identidad extendida en LEM-80; LEM-132 mantiene su aplicación en biblioteca. No reconstruir una segunda “o” amarilla sobre el SVG.

Fotografía de producto: blanco/gris muy claro, frontal/lateral/perspectiva y armazón completo. Lifestyle: luz natural, entornos limpios, personas diversas y composición editorial. Diagramas: medidas legibles en mm. Conservar el tratamiento contain de producto y el crop/punto focal editorial de cada sección. Usar imágenes responsive con dimensiones que eviten saltos y lazy loading bajo el primer pliegue. Texto esencial en HTML y alt según función. Los placeholders no son fotografía final ni autorización de publicación.

Contenido: es-CL, frases claras, CTAs que describen la acción y moneda CLP. Reutilizar locales existentes. La voz final pertenece a [LEM-55](https://linear.app/antekera/issue/LEM-55). No convertir slogans, precios, reseñas, garantías o plazos de muestra en hechos del negocio.

| Superficie | Regla |
| --- | --- |
| Storefront Liquid | Reutilizar tokens, snippets y secciones de esta guía. [LEM-86](https://linear.app/antekera/issue/LEM-86) organiza rutas/asignaciones; configurador y receta conservan sus contratos propios |
| CMS / políticas | Reutilizar [shell legal](sections/lemoon-legal-page.liquid); para políticas nativas, conservar `request.page_type == 'policy'` en [layout](layout/theme.liquid) y [CSS nativo](assets/lemoon-native-policies.css). Preservar contenido y destinos nativos, sin duplicar políticas |
| Checkout / confirmación / cuentas nuevas | Usar el editor nativo de checkout/cuentas y sus opciones disponibles para logo, color y tipografía; no portar header ni estructura Liquid. El plan de páginas conserva la adaptación tipográfica nativa registrada. Verificar capacidad en el ticket de esa superficie antes de añadir extensiones. Fuentes: [checkout](https://help.shopify.com/en/manual/checkout-settings/customize-checkout-configurations/checkout-style), [cuentas](https://help.shopify.com/en/manual/customers/customer-accounts/customize-customer-accounts) |
| Back office | Compartir nombre Lemoon y activo oficial existente; los colores/familias aquí documentados describen el storefront. Respetar patrones del admin y AGENTS/guía de `antekera/lemoon-next-backoffice`; no imponer a sus controles el CSS ni anchos de esta guía |

Las políticas nativas y las páginas legales CMS se presentan en una sola columna centrada de hasta 66rem, con título, contenido y ayuda alineados al mismo ancho, sin eyebrow ni navegación lateral. El cuerpo usa 1.6rem con interlineado 1.6; los subtítulos H2 y H3 usan 2.4rem y 2rem, respectivamente. Conservar el contenido propio de cada política y mostrar fechas de vigencia únicamente cuando estén definidas en su contenido aprobado; no deducirlas de la fecha de modificación de la página.

La dirección principal de privacidad es `/pages/politica-de-privacidad`, con la plantilla `page.politica-de-privacidad` y el modo `use_native_privacy` del shell legal. Ese modo muestra exclusivamente `shop.privacy_policy.body`: no copiar el texto a una segunda página CMS. El footer y el panel de cookies prefieren la página en español solo cuando existe publicada con esa plantilla; hasta entonces conservan la ruta nativa. `/policies/privacy-policy` permanece como compatibilidad de Shopify y señala a la página en español mediante canonical y Open Graph cuando está disponible; al visitar la ruta nativa, el navegador reemplaza la URL por la página española (con alternativa meta refresh sin JavaScript). La navegación usa la URL relativa localizada de la página, también en desarrollo local, y no se activa en el editor del tema. Solo se redirige si el destino existe publicado con la plantilla correcta; las demás políticas conservan su comportamiento. Esto no elimina la ruta administrada por Shopify ni representa un HTTP 301.

En listado de blog y detalle de artículo, la newsletter pertenece al footer y usa la variante editorial: una tarjeta navy contenida de hasta 128rem, radio `--lemoon-radius-lg`, padding 2.8rem, texto blanco y botón lemon pill. Título ligero de 2.8rem, dos columnas desde 750px y una en móvil; formulario con label visible y consentimiento requerido desmarcado. Reutiliza el formulario nativo y las traducciones de Journal; en el listado se mantiene `show_newsletter:false` para evitar duplicados. En las demás páginas se conserva la newsletter cálida existente. El campo de correo reserva un borde transparente de 2px que cambia a lemon al recibir foco, sin desplazar el contenido; en colores forzados usa CanvasText y Highlight.

La franja legal inferior del footer contiene Privacidad, Términos y condiciones y Preferencias de cookies; Envíos y Devoluciones no se repiten en esa franja. El copyright muestra `section.settings.company_name`, escapado, con el valor configurado en Shopify y el emoji decorativo 🇨🇱 a la derecha; su verificación final corresponde al checklist previo al go live. Enlaces, preferencias y empresa comparten la misma lista y su gap responsive; el control de cookies oculto y sin estado no debe dejar un elemento vacío que genere separación adicional.

El bloque de pagos del footer conserva visible el título configurable («Paga seguro con»), seguido de Webpay, Visa y Mastercard; al final muestra el gráfico SSL proporcionado por el usuario sobre fondo blanco. Los tres medios de pago comparten su lista con separación de 0.8rem; antes del gráfico SSL hay 24px, agrupando los logos incluso en móvil. Todos los gráficos de este bloque tienen 24px de alto, ancho proporcional y 2px de margen blanco interior, sin anchos mínimos que agranden las tarjetas. Visa y Mastercard usan `payment_type_svg_tag` de Shopify; Webpay usa el SVG oficial de Transbank Developers, sin alterar proporciones o colores. Se conservan los interruptores de cada medio: mostrar estos logos no acredita activación de pasarelas, certificación de Shopify ni garantía absoluta de seguridad.

## 8. Ejemplo de aplicación: términos

Para mantener la página de términos, partir de [page.terminos-y-condiciones.json](templates/page.terminos-y-condiciones.json) y reutilizar [lemoon-legal-page.liquid](sections/lemoon-legal-page.liquid):

1. Conservar `kind:terms` y el padding de template 64px superior/inferior. La fórmula local `×0.625` produce 40px bajo 750px.
2. Mantener H1 Urbanist 300, 4.6rem desktop/3.4rem móvil, leading 1.15, tracking −0.5px y color brand. Es excepción local; no sustituirlo por H1 base 4/3.2rem.
3. Mantener una columna centrada de hasta 66rem, sin breadcrumb ni índice lateral. El cuerpo usa Hanken 1.6rem/1.6, con H2 de 2.4rem y H3 de 2rem. Ninguna de estas medidas cambia el ancho global.
4. Conservar enlaces del contenido y ayuda con foco navy 2px/offset 4px; preservar destinos de políticas nativas y el contenido CMS cuando `demo_data` esté desactivado.
5. El template contiene `demo_data:true`: el ticket de contenido [LEM-119](https://linear.app/antekera/issue/LEM-119) debe resolver el texto definitivo antes de publicar. Aplicar esta guía no cambia ese setting ni convierte el texto de muestra en términos comerciales.
6. Revisar lectura, teclado, zoom, enlaces y desbordes a 390px y desktop, incluidos ambos lados de 750px. Verificar asignación CMS en la entrega de la página.

### Quiz: presentación compacta de colores

El paso Color usa siete opciones: Colores, Tonos neutros, Negros, Carey, Bicolor, Transparentes y Plateados, sin Dorados. Botones horizontales de al menos72px, muestra SVG plana32×32 a la izquierda y texto HTML al lado; tres columnas desde750px y dos en móvil. Sin esferas grandes, volumen, sombras de muestra ni reflejos que simulen una bola. Carey tiene manchas orgánicas, Bicolor dos mitades y Plateados una franja plana; Transparentes representa el armazón. La selección usa borde navy, superficie cálida y check en esquina, visible solo al seleccionar; foco de teclado permanece independiente.

Se reutilizan `pattern/tortoise` y `transparency/transparent` para Carey y Transparentes; se editan únicamente en Color y cada criterio puntúa una vez; Detalles conserva solo Acabados y Materiales, sin controles de patrón ni transparencia. Los códigos históricos brown/light coinciden con Tonos neutros; Plateados no se deduce de material metal. El nuevo diseño se presenta para revisión humana en local.

### Quiz: imágenes de materiales

El panel Materiales de Detalles sustituye las muestras SVG visibles por la [serie de estudio v1](docs/design/style-quiz-prototype/generated-material-studio-v1/README.md): seis imágenes generadas de una montura clásica en perspectiva sobre blanco, coherentes en encuadre y luz con el primer paso. Acetato, metal, titanio, TR-90, madera y mixto conservan etiquetas y códigos actuales. JPEG480/960, dimensiones960×640, contain3:2, alt vacío y carga diferida. Se conserva la retícula actual de dos columnas y el funcionamiento de selección. Los SVG anteriores siguen íntegros en el repositorio.

Las imágenes son referencias visuales conceptuales de superficies y construcción, no prueba de composición, peso, resistencia o compatibilidad. No se codifica un material por su color o brillo: metal/titanio y acetato/TR-90 pueden parecerse; la etiqueta y los datos verificados del producto mantienen su función. No se cambian Shopify, ranking ni la apariencia de Acabados.

### Quiz: muestras realistas de acabados

Acabados mantiene Mate y Brillante en dos tarjetas horizontales compactas como Color, con miniatura fotográfica cuadrada64×64 junto a la etiqueta. La [serie macro v1](docs/design/style-quiz-prototype/generated-finish-macro-v1/README.md) muestra el mismo tono carbón y un acercamiento al borde de un armazón: textura difusa para mate y reflejo de luz para brillante. Imágenes decorativas JPEG128/256, proporción1:1 sin recorte, alt vacío y carga diferida; altura mínima96px, foco y selección nativos. El check se muestra al seleccionar, siguiendo Color. Los SVG anteriores se conservan. Referencias generadas de acabado, no fotografía de SKU; sin cambios a atributos, materiales o ranking.

### Quiz: tres formas por fila

El paso Forma mantiene tres columnas en escritorio, tablet y móvil. En móvil las tarjetas de forma usan padding8px y etiquetas12px para conservar los nombres legibles en la retícula de tres. Sin cambios a dibujos, selección ni las columnas de otros pasos.

### Quiz: iconos de tamaño

El último paso sustituye el personaje ilustrado por una silueta frontal neutra de cabeza, cuello y hombros, sin pelo, rasgos faciales ni rellenos de piel/ropa. Contorno navy3 con opacidad0.6 y montura navy4.5 de forma suavemente rectangular. Misma silueta y posición en las tres opciones; solo escala el armazón (0.78/0.95/1.13). Se conservan etiquetas, selección y el carácter visual de compacto/intermedio/oversize; no determina talla física ni introduce rangos de medidas.

### Quiz: medidas de referencia editables

El acordeón del último paso incluye chevron navy20px que gira al abrir, tres campos opcionales en mm (ancho del lente, puente y patilla), el ejemplo50/18/140 y feedback accesible. Tres valores enteros válidos autoseleccionan una única proporción visual mediante radios; la elección manual posterior se conserva al navegar, cerrar/abrir o editar desde resultados. Editar las medidas recalcula; borrar o invalidar una medida retira la selección automática, preservando una elección manual. Volver desde resultados conserva campos, feedback y selección. Sin persistencia, envío ni cambios Shopify.

La propuesta local usa el índice nominal `2 × ancho del lente + puente`: menor118 → compacto,118–128 → intermedio, mayor128 → oversize. Es una heurística editorial de esta exploración, pendiente de revisión/calibración con catálogo, no un estándar de talla ni el ancho total del armazón. Patilla se valida y conserva como referencia, sin afectar la proporción frontal. Rangos de entrada de la propuesta: lente30–80, puente10–35, patilla100–180mm. Una referencia incompleta/inválida no bloquea continuar sin sugerencia.

### Quiz: resultados con resumen de solo lectura

Retirar el aviso visible de selección de demostración por solicitud del usuario, sin modificar flags ni datos comerciales. Resumen semántico dl con seis celdas iguales (tres columnas escritorio/dos móvil, filas1fr y mínimo80px), todas las selecciones y Sin preferencia cuando corresponda. Texto completo sin truncado ni celdas especiales; no hay botones, flechas ni navegación en el resumen. Ir atrás con flecha izquierda vuelve al último paso y conserva respuestas/medidas/progreso; las demás etapas se revisitan secuencialmente. Sustituye Volver a empezar: ya no hay reinicio. Explorar el catálogo usa botón relleno navy con radio completo del tema. Se mantienen productos, ranking y paginación. Esta corrección sustituye las referencias anteriores a resumen editable o reinicio en el quiz.
