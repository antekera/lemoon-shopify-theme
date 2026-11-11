# Lemoon — especificación de implementación visual

Esta guía fija las reglas de implementación del storefront a partir de los tokens y componentes existentes del tema. Reutilizar esas reglas al mantener páginas o construir secciones de la misma familia. Cada excepción local se aplica únicamente a su componente. [Brand guidelines](docs/design/brand-guidelines.md) define el uso de marca; [design-plan](docs/design/design-plan.md) organiza las superficies; [section-inventory](docs/design/section-inventory.md) localiza las secciones y [remaining-pages-plan](docs/design/remaining-pages-plan.md) conserva las dependencias de entrega.

## Intención visual

**Lemoon presenta óptica con una composición editorial limpia: producto protagonista, espacio generoso y una jerarquía clara que acompaña la elección.** Esta tesis resume la dirección existente de marca y las familias del tema.

La experiencia debe sentirse cercana y fácil de recorrer. Las fotografías permiten examinar el armazón completo; los títulos orientan y el cuerpo facilita comparar información de producto, ayuda y condiciones. La composición editorial aporta identidad sin competir con el catálogo ni con las acciones de compra.

Para decisiones de expresión visual o redacción, consultar el [brief estratégico LEM-82](docs/design/brand-strategy.md), aprobado por Miguel el 01-11-2026: facilidad de compra, precio accesible y personalidad cercana, atrevida y práctica; eslogan «Se te ven bien». Aplicar esa dirección con las reglas visuales de este documento, sin introducir nuevos tokens, fuentes o componentes por inferencia.

### Decisiones y motivos

- **Blanco/carbon y paneles beige:** separar lectura y agrupaciones de contenido con una base tranquila que deje protagonismo al producto.
- **Navy en acciones y foco:** dar continuidad visual a la navegación y a los controles que guían el recorrido. Lemon destaca momentos puntuales sin competir con la acción principal.
- **Urbanist y Instrument Sans:** distinguir títulos/acciones del texto de lectura con las dos familias existentes; mantener sus roles facilita reconocer la jerarquía entre páginas.
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

> **Fuente de cuerpo aprobada el 07-11-2026:** el usuario eligió Instrument Sans como sustitución definitiva para `--lemoon-font-body` y sus consumidores. Se cargan pesos 400/500/600/700 con `display=swap`; Urbanist, logo, tamaños, pesos, interlíneas y espaciados se conservan. Esta decisión actualiza las referencias tipográficas anteriores de esta guía; la publicación Shopify mantiene su autorización independiente.

Familia heading: `--lemoon-font-heading`, **Urbanist**, sans-serif. Familia body: `--lemoon-font-body`, **Instrument Sans**, sans-serif. El [layout](layout/theme.liquid) carga Urbanist 300/400/500/600/700 y Instrument Sans 400/500/600/700. Aplicar los roles de [tokens](assets/lemoon-tokens.css) mediante las clases de [componentes](assets/lemoon-components.css):

El foco de teclado usa en todo el sitio un contorno gris `--lemoon-focus-ring` de 2px con separación de 2px, adaptado al contorno de cada control. Los campos de texto, textarea y select conservan el color de su borde y aumentan su grosor en 1px al enfocar; en colores forzados usan Highlight. Excepción solicitada para newsletter: borde navy reforzado hacia dentro al enfocar, sin contorno exterior ni cambio de geometría; reserva espacio para dos líneas de feedback de 12px. Los selectores visuales de radio trasladan el foco a su etiqueta y el zoom de imagen a su superficie; el estado de selección sigue siendo independiente. En colores forzados se usa el color de texto del sistema. Esta decisión del 10-11-2026 sustituye los colores de foco particulares descritos anteriormente.

En la PDP, el corazón de favorito guardado se rellena con el azul de marca. Al activarlo muestra una breve expansión del icono y un aro que desaparece; no se anima al restaurar el estado ni al quitarlo, y respeta movimiento reducido.

Los botones de acción usan mayúsculas e Instrument Sans medium de 13px. Las acciones de compra de la PDP usan este tratamiento y forma de píldora: amarillo con texto azul de marca para seleccionar lentes y agregar al carrito, tanto en armazones como en accesorios. Los estados deshabilitados conservan su diferenciación.

Debajo de las opciones de color, la PDP presenta «Talla:» y el valor disponible a la izquierda; el valor usa 12px y peso medium. A la derecha permanece el acceso a la guía de medidas con el icono de regla existente. Si no hay talla, solo se muestra el acceso a la guía.

En móvil la galería ocupa el ancho completo del viewport y deja ver 10px de la siguiente imagen cuando existe. El menú móvil abre desde la izquierda, sin fila de cierre duplicada; el control del encabezado permite volver y cerrar. El primer nivel conserva mayúsculas y minúsculas naturales y la zona inferior cambia según la sesión del cliente. El corazón de la tarjeta aparece en la esquina superior derecha y comparte la animación breve del favorito; al guardar se reproduce una nota corta. El texto de compra permanece centrado durante la carga y el indicador aparece a su derecha. Las medidas conocidas pueden acompañar sus letras en el diagrama, sin completar valores ausentes.

| Rol | Familia / peso | Tamaño ≥750 → <750 | Interlínea | Tracking |
| --- | --- | --- | --- | --- |
| Display `.h0` | Urbanist 300 | 5.6rem → 4rem | 1.142857 | −0.5px |
| H1 / `.h1` | Urbanist 600 | 4rem → 3.2rem | 1.2 | −0.3px |
| H2 / `.h2` | Urbanist 600 | 2.8rem → 2rem | 1.285714 | −0.3px |
| H3 / `.h3` | Urbanist 500 | 2rem → 1.8rem | 1.4 | 0 |
| Body | Instrument Sans 400 | 1.6rem | 1.5 | 0 |
| Body small | Instrument Sans 400 | 1.4rem | 1.428571 | 0 |
| Caption | Instrument Sans 400 | 1.2rem | 1.333333 | 0 |
| Label | Instrument Sans 400 | 1.3rem | 1.4 | 0 |
| CTA / texto de botones | Instrument Sans 600 | 1.4rem | 1.428571 | 0.3px, uppercase |

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

La composición de `/pages/nosotros` fue autorizada por el usuario el 02-11-2026 como un relato continuo, tomando la estructura History de Warby Parker como referencia. Su dueño es `sections/lemoon-about-page.liquid`: un único H1 y un cuerpo richtext editable, sin subtítulos internos, tarjetas, paneles, CTAs, imagen ni placeholder. El eslogan se muestra después del cuerpo como un párrafo independiente desde el ajuste global `settings.brand_slogan`; separarlo con `--lemoon-space-8`, conservar Instrument Sans 1.8rem/1.7 y omitirlo si el valor está vacío. El cuerpo editable no duplica el eslogan. Esta decisión sustituye el hero con imagen y las tarjetas anteriores solo en esta sección; no cambia otras familias editoriales.

Mantener un ancho local máximo de 72rem y los gutters responsive existentes de `.page-width`. El H1 conserva Urbanist y su escala/peso global; el cuerpo usa Instrument Sans, `--lemoon-fs-18` y line-height 1.7, con separación `--lemoon-space-6` entre párrafos. Conservar el padding configurable de la sección (75% bajo 750px). El carrusel de productos permanece como sección independiente posterior, con su composición y controles existentes; no forma parte del relato.

### Página 404: armazón y gesto lemon

Dirección autorizada por el usuario el 07-11-2026: ilustración original de un armazón navy con un limón y hoja como acento separado del marco y de los cristales por espacio visible, sin mascota ni cambios de identidad. `sections/main-404.liquid` conserva la composición de dos columnas y su apilado bajo 750px, mensaje localizado y cuatro enlaces de recuperación: inicio, catálogo, preguntas frecuentes y contacto. Por petición del usuario se retiró el buscador local de esta sección; los enlaces muestran un único contorno de foco navy, sin box-shadow adicional. La pieza decorativa `assets/lemoon-404-frame-lemon-v2.webp` se contiene completa en el panel beige, con proporción intrínseca y ancho fluido; el número 404 sigue siendo texto HTML independiente. El conjunto visual lleva `aria-hidden="true"` y la imagen alt vacío: el H1 ya comunica el error. No añadir animación ni repetir el arte del footer. El usuario aprobó el render final de la 404 el 07-11-2026; la publicación en producción mantiene su autorización independiente.

### Guía de rostro: comparación ilustrada y catálogo

Composición aprobada el 08-11-2026 en LEM-103: `lemoon-face-guide` contiene un único H1, entrada breve, índice ilustrado con seis anclas y seis módulos visibles (Ovalado, Redondo, Cuadrado, Corazón, Diamante y Alargado). Sin pestañas ni clasificación obligatoria. Cada bloque conserva dos pistas observables, motivo breve y dos siluetas idénticas a las del paso Forma de Descubre tu estilo, renderizadas desde `lemoon-quiz-visual` (`group: shape`); sus ilustraciones frontales son originales, sin gafas ni texto rasterizado. El editor permite cambiar contorno, textos, imagen/alt, dos formas y destino. Los campos de texto vacíos usan en/es; las imágenes vacías usan los seis activos originales del tema. Ninguna silueta afirma talla, compatibilidad facial, receta ni resultado clínico.

Los retratos y miniaturas reservan proporción 1:1 con `contain`; no recortar las cabezas. Las miniaturas usan derivados WebP de 180/360px y los retratos de 360/640/960px mediante `srcset`/`sizes`, con máximos de 180px y 400px respectivamente; los maestros de 1254px no son fuentes del índice. El índice usa seis columnas desde 990px y tres bajo ese ancho. Los módulos colocan retrato y explicación próximos en dos columnas desde 750px, apilados por debajo. Después de las familias aparecen tres ilustraciones raster editoriales de ajuste aprobadas por el usuario: puente frontal, pómulos en tres cuartos y patilla de perfil. Los anillos lemon señalan las zonas de apoyo del puente, separación entre aro inferior y pómulo, y curva de la patilla junto a la oreja. El estilo y las marcas solicitadas pertenecen únicamente a estas tres ayudas: no sustituyen los seis contornos de rostro ni los SVG canónicos de monturas del quiz. Son ilustraciones educativas, no fotografías de SKU ni promesas de ajuste individual o prestaciones.

Las imágenes personalizadas `image_picker` del editor conservan prioridad. El fallback usa `lemoon-fit-{bridge,cheek,temple}-editorial-v1-{350,700,1400}.webp`, src700 con dimensiones700×438, `srcset` y `sizes` responsive, carga diferida y `contain` dentro del panel8:5 sin recorte. Los títulos y consejos completos siguen en HTML editable; las imágenes son decorativas con alt vacío. La versión anterior `snippets/lemoon-face-guide-illustration.liquid` se conserva como referencia SVG, fuera del render predeterminado, sin borrar su trabajo. Cuerpo y acciones usan al menos 1.6rem, Urbanist/Instrument Sans, tokens navy/warm, radios de guía y foco visible; targets mínimos 44px. Padding editable al 75% bajo 750px. Contenido y navegación no requieren JavaScript; la medición opcional usa el módulo descrito abajo.

Cada módulo ofrece una salida clara a la PLP nativa con las dos formas de armazón seleccionadas mediante parámetros repetidos del mismo filtro. El CTA predeterminado de las familias dice «Ver armazones» (`View frames` en inglés); se conserva su destino con ambas formas seleccionadas y el override de texto del editor. Las seis acciones de familia usan el botón filled navy con texto blanco de peso regular400, hover primario y foco navy2px: centrados bajo750px y a la izquierda desde750px mediante el wrapper local. El CTA del cierre verde conserva su fondo navy, texto blanco y peso600. El acento lemon de la entrada se concentra en un único `sparkles` decorativo de `lemoon-icon` junto al H1: forma principal rellena `--lemoon-action-accent` (#F7E600), sin contorno en la estrella principal y cruces abiertas navy de 1.1 unidades. El wrapper del título usa flex/gap12, H1 contraíble sin cambiar fuente/tamaño e icono32px desktop/28px móvil; no hay badge, fondo ni texto adicional. El SVG omite label y queda aria-hidden/focusablefalse. La aplicación es local, sin variante global; forced-colors conserva Canvas/LinkText en botones normal/hover y colores de sistema para el icono. Por petición explícita se retiró el enlace «Ver formas», sus inputs/settings y el wrapper de acciones sin consumidor. La ayuda de filtros ausentes permanece después del CTA. La navegación del índice conserva el foco de fragmento del artículo (`tabindex=-1`). Por corrección solicitada el 09-11-2026, los artículos no muestran outline, halo ni sombra al navegar por el índice, también en forced-colors. Conservan tabindex=-1 y foco de fragmento; enlaces y botones mantienen su señal de foco propia. Se validan ambos valores contra `collections['all'].filters`: si falta cualquiera, el CTA muestra catálogo completo y una ayuda explícita; no promete selección parcial. El destino personalizado del editor usa un texto neutral editable. Alargado compara ahora aviador y redondo, como alternativas editoriales de estilo; no añade ni promete selección por altura. La [revalidación de fuentes](docs/content/2026-11-08-face-shape-guide-research.md) conserva el respaldo de esta pareja. La PLP conserva sus filtros/chips editables, tarjetas y paginación. Guía de medidas y quiz existentes son salidas editables complementarias; no se crea otro recomendador. El cierre tiene un único banner «¿No reconoces tu forma?», después de ajuste, con sus textos editables y salidas a catálogo/quiz; conserva el override de destino del catálogo. Por indicación explícita del usuario el 08-11-2026, solo este banner usa `--lemoon-surface-tertiary-green` (#DFE9DE); no modifica fondos globales. Sustituye el antiguo cierre «Sigue por las formas que te gustan» y elimina sus dos campos sin consumidor. La asignación CMS y publicación se verifican aparte.

La instrumentación de esta guía usa únicamente `Shopify.analytics.publish('lemoon:face_guide_click', payload)`, cargada como módulo local de la sección. Comprueba `customerPrivacy.analyticsProcessingAllowed()` en cada clic; API ausente, permiso denegado o error omiten la emisión, sin cola ni replay. `loadFeatures` solicita `consent-tracking-api` 0.2 sin bloquear navegación. No carga una segunda etiqueta Google ni guarda datos de visitante; el pixel receptor y la activación GA4 son integración operativa separada. El payload usa solo enums de acción/posición/destino/familia editorial y códigos controlados de armazón, sin labels, URL/query ni identificadores de usuario. Sin JS, seis anclas de índice, doce ejemplos de forma, seis CTAs de familia, medidas y dos salidas del cierre mantienen navegación nativa. Con comparación activa, los doce ejemplos estáticos se ocultan y se usan36 botones de forma; permanecen15 enlaces nativos (seis anclas y nueve salidas). Cada ejemplo disponible usa un único enlace semántico para SVG y nombre, con el mismo destino y foco accesible de la familia; un valor no disponible permanece sin enlace.

**Comparación ilustrada ampliada por petición del usuario el 09-11-2026, pendiente de revisión local del conjunto:** los seis rostros predeterminados usan la misma técnica de grafito/acuarela, cabello retirado del contorno y ropa gris (`lemoon-face-{oval,round,square,heart,diamond,long}-editorial-v3-{180,360,640,960}.webp`). Cada carrusel muestra primero sus dos sugeridas y luego las demás formas nativas expuestas. La silueta canónica del quiz se superpone al retrato con coordenadas y ancho calibrados por familia; el Aviador incorpora un descenso adicional1.4% respecto de la posición de cada rostro y ancho reducido al90%. El ovalado conserva su posición base41% y centro horizontal50%, con translate(-50%,-50%). Los botones usan aria-pressed, targets44px, radio modal16px (excepción local al radio global), foco navy, borde transparente sin seleccionar y borde navy seleccionado. Ambas etiquetas «Sugerida» permanecen lemon en todos los estados; las otras formas no reciben ese acento. Chevrons locales: fondo transparente en normal, hover y disabled; icono navy22px/trazo2 y foco visible. El desplazamiento avanza por tarjeta, con topes en ambos extremos y padding lateral8px constante.

Un botón de acción con aria-controls oculta/muestra la montura para comparar. En móvil, el texto precede al retrato (máximo280px) y el carrusel sigue inmediatamente al retrato y su control; escritorio conserva dos columnas. Cada familia permite seleccionar varias formas con aria-pressed independiente. Sus dos sugeridas permanecen seleccionadas y no se desmarcan: tocarlas cambia la montura sobre el rostro. Las demás formas se pueden marcar y desmarcar. El enlace PLP utiliza exactamente las formas seleccionadas como valores OR del filtro; la superposición muestra la última marcada o una de las restantes al desmarcar. Tracking de salida: de dos a seis formas distintas. No es un probador de productos ni una medición de calce. Imagen personalizada del editor: mantiene prioridad y no activa superposición, cuya posición pertenece al retrato predeterminado. Sin JS o ante datos/imagen ausentes se conserva la pareja estática y salida nativa. La selección es transitoria, sin cámara, perfil biométrico ni persistencia entre cargas; el conjunto local no acredita publicación Shopify.

Calibración del raster v3, en porcentajes del panel: centro horizontal50% en todas las familias; altura/anchura ovalado41/46, redondo40.2/48, cuadrado39.8/47, corazón39.4/47, diamante38.4/46 y alargado35.8/44. Aviador suma1.4% a la altura base y reduce su ancho al90% del ancho calibrado; las otras formas conservan la base. Son coordenadas de presentación, sin escala física.

### Quiz de estilo: navegación a catálogo

El contrato vigente de [LEM-11](docs/specs/2026-11-06-lem-11-descubre-tu-estilo.md), aprobado el 06-11-2026, conserva seis preguntas opcionales: categoría, forma, color, detalles, uso y presencia. La entrada usa exactamente «Descubre tu estilo ideal.» y «Formas, colores y detalles que van contigo. Encuentra los tuyos.», con reflujo natural y acceso a catálogo subrayado en reposo. El destino público previsto es `/pages/descubre-tu-estilo`; `/pages/buscar-mi-estilo` debe devolver 404 sin redirección. El archivo interno `templates/page.buscar-mi-estilo.json` conserva su nombre: no acredita el handle ni la asignación CMS remota.

El rótulo de cada pregunta aparece una sola vez, encima del título; fieldset/legend y grupos con `aria-label` localizado conservan su nombre accesible. Pregunta y descripción preceden a las opciones; descripción al 80% desde 750px y 100% por debajo, opciones centradas con máximo 96rem y gutters del tema. Cuerpo, opciones y campos usan al menos 16px, peso 400; acciones 16px semibold y ayudas secundarias al menos 14px. H1/H2, fuentes, colores y espaciado conservan sus tokens. Forma mantiene tres columnas si las etiquetas completas y los targets caben, sin truncado; padding móvil 8px y etiquetas de 16px.

Detalles presenta Acabados y después Materiales en vertical, con encabezados localizados, ambos grupos visibles y sin pestañas. Se conservan selección, foco, códigos e imágenes diferidas. Carey y Transparentes se eligen solo en Color y mantienen `pattern/tortoise` y `transparency/transparent`. Para solares, Trabajo/estudio se oculta y limpia, y `outdoors` se presenta como Paseos y viajes; cambiar categoría conserva preferencias compatibles.

El indicador mantiene seis círculos de 12px separados por 20px: amarillo pendiente, navy completado y aro navy de 2px con separación de 4px para el actual. Sin numeración decorativa grande 01–06 en ningún ancho; «Paso X de 6» solo accesible. Volver queda abajo a la izquierda y Continuar a la derecha. El progreso pertenece al snapshot de la entrada restaurada; no hay reinicio ni etapa de resultados embebidos.

`lemoon-style-quiz.js` reserva `history.state.lemoonStyleQuiz`, versión 1, preservando el estado ajeno y usando fragmentos `#style-quiz-{etapa}` para intro y preguntas. Avanzar añade una entrada; cambiar inputs reemplaza la actual. Volver recorre la entrada previa conocida del quiz; un acceso restaurado sin ella reemplaza la etapa actual por la anterior. Atrás/Adelante restauran el snapshot exacto sin añadir entradas. Desde la intro inicial, Atrás permite salir normalmente. Cada snapshot valida ruta, códigos permitidos, etapa, posición/trayecto, pasos completados, medidas, apertura del acordeón y modo automático/manual de presencia. Recarga y retorno desde colección restauran ese estado y el foco del título conocido; valores corruptos vuelven a intro segura. No se crea perfil ni persistencia permanente.

El CTA final guarda el último snapshot y navega a `/collections/all` con filtros nativos: OR entre valores del mismo criterio y AND entre criterios. Preguntas omitidas no restringen. El helper `lemoon-style-quiz-filters.js` traduce forma/material a los valores Shopify reales y afinidades a GIDs del diccionario de la tienda. La configuración Liquid exporta tipos reconocidos desde `shop.types`, entradas de `metaobjects.lemoon_style_trait.values` y parámetros realmente expuestos por `collections['all'].filters`. Un criterio seleccionado sin referencia o filtro válido muestra el error localizado, conserva respuestas y ofrece catálogo; no se emite una búsqueda parcial.

La colección conserva sus tarjetas canónicas, chips/filtros editables, ordenación, contador, paginación y vacío reales. El quiz ya no enumera candidatos, puntúa afinidad, carga tarjetas/precios ni impone los antiguos límites de 50 productos/20 variantes. `lemoon-quiz-candidate` y assets visuales anteriores se conservan como legado, sin consumidor en la sección actual. No ampliar coincidencias ni sustituir el filtrado nativo por filtrado de la página visible.

El inicio conserva espacio y aspecto navy desde el primer render con JavaScript, deshabilitado hasta enlazar el controlador. El marcador síncrono oculta el bloque de respaldo durante esa carga; no hay alturas rígidas. Sin JavaScript, descarga fallida o configuración inválida, permanece la alternativa de catálogo y se oculta el inicio inoperante.

El acabado local conserva fotografía editorial completa (`contain`), marco cálido de radio lg, contorno desplazado y trama tenue navy. Portada configurable o respaldo [editorial v1](docs/design/style-quiz-prototype/generated-images-v1/README.md) 700/1400px; cuatro usos 480/960px, 3:2, dimensiones explícitas, alt vacío y carga diferida. Categorías usan la [serie de estudio v1](docs/design/style-quiz-prototype/generated-category-studio-v1/README.md), una montura óptica o solar en perspectiva sobre blanco, JPEG480/960 y `contain`. Materiales y acabados conservan sus series documentadas abajo. Son referencias conceptuales, no fotografías de SKU ni evidencia de composición. Indicador circular en reposo, check/acento lemon al seleccionar, foco independiente y elevación máxima de 2px solo con puntero fino. Reduced motion retira movimiento; forced colors conserva borde/check y retira trama/sombra.

La familia Forma conserva ocho outlines frontales realistas simplificados: contorno navy único de 5 unidades, remates redondeados, sin relleno, sombra, líneas interiores ni microdetalles. Cat-eye con parte superior menos curvada; geométrico de facetas rectas y esquinas miter; Aviador conserva exactamente su geometría aprobada. Gradientes/clipPaths usan IDs únicos por sección/grupo/opción. Presencia mantiene la silueta neutra y la misma base con montura escalada, sin inferencia de talla física. [Referencias visuales conservadas](docs/design/style-quiz-prototype/visual-finishing-spec.md).

El comportamiento local preparado no demuestra activación CMS, filtros nativos completos, proyecciones actualizadas ni despliegue del back office. El estado administrativo y los bloqueos vigentes se registran en la [guía de catálogo](docs/catalog/style-quiz.md#estado-de-preparación-al-06-11-2026); requieren QA real antes de declarar la entrega operativa.

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
| Acción de acento `lemoon-ui-action`, `variant: 'accent'` | Amarillo `--lemoon-action-accent` y texto navy `--lemoon-text-brand`, sobre la familia base `.button`; mismas medidas y radio | Hover `--lemoon-action-accent-hover`; foco visible y estados disabled/loading conservados. Variante reutilizable solicitada por Miguel el 08-11-2026 para «Ver catálogo» en la guía de medidas |
| Acción destructiva | Reutilizar la clase específica ya presente en la superficie | No hay un mapeo global autorizado para `button--destructive` |
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
| Texto de tarjeta | Base: nombre Instrument Sans 13px/16px, precio Urbanist 600 18px/22px; precio anterior Instrument Sans 14px/18px. PLP sobrescribe nombre a 15px ≥990, 14px entre 750–989 y 13px móvil; precio regular 17px ≥750 y 16px móvil. No aplicar H3 global al nombre |
| Etiquetas de producto | `.lemoon-product-card__label` usa radio full; new navy/blanco, flash-sale lemon/navy, sold-out gris/blanco, best-seller según su clase. Datos de disponibilidad, descuento y tags reales determinan su presencia |
| Badges genéricos | Editorial `--badge-corner-radius`: 0; compacto `--lemoon-radius-sm`: 4px; chips `--lemoon-radius-lg`: 20px. No sustituir con estos radios las etiquetas de producto que ya tienen regla local |
| Swatches | Reutilizar [swatch-input](snippets/swatch-input.liquid) o swatches del snippet de tarjeta; mantener tamaño local, círculo, nombre y estado seleccionado accesible. No imponer los 20px del frame a todas las superficies |
| [Header](sections/header.liquid), [CSS](assets/lemoon-header.css), [JS](assets/lemoon-header-nav.js) | Conservar variante clara, logo oficial, navegación y acciones; `aria-current` para destino actual. Menú usable por teclado y apertura explícita en móvil, además de hover desktop |
| [Announcement](sections/announcement-bar.liquid) y [footer](sections/footer.liquid) / [CSS](assets/section-lemoon-footer.css) | Reutilizar los componentes y sus grupos; contenido desde settings y enlaces reales. No activar una propuesta alternativa por su fecha |
| [FAQ](sections/lemoon-faq-page.liquid) | FAQ agrupada en una columna centrada de hasta 700px con 20px de padding horizontal, como el cuerpo del artículo; details/summary con primera pregunta abierta y una sola abierta por sección, foco y teclado nativos, sin altura rígida; pregunta de 18px en escritorio y 16px en móvil/tablet, respuesta con interlínea 1.5, separación de encabezado de 32px y transición progresiva de apertura/cierre con alternativa inmediata en navegadores sin soporte o con movimiento reducido |
| [Drawer compartido](assets/component-lemoon-drawer.css), [global.js](assets/global.js), [PDP tools](assets/lemoon-pdp-tools.js) | Por defecto móvil≤749px: panel de ancho completo que abre desde abajo, altura100dvh menos32px mínimos de overlay superior (respetando safe-area), radio superior16px y scroll interno. Se aplica a medidas, carrito, navegación Lemoon, filtros y retiro; cada shell conserva cierre/Escape/foco/scroll lock y su controlador. Desde750px conserva presentación local. No transforma submenús internos ni modales centrados. HeaderDrawer Dawn legacy no usado conserva su adaptación pendiente. |
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

Fotografía de producto: blanco/gris muy claro, frontal/lateral/perspectiva y armazón completo. Lifestyle: luz natural, entornos limpios, personas diversas y composición editorial. Diagramas: medidas legibles en mm. Conservar el tratamiento contain de producto y el crop/punto focal editorial de cada sección. En la PDP estándar, la imagen se integra al fondo cálido con multiply; en escritorio, la galería permanece bajo el encabezado durante el desplazamiento. Usar imágenes responsive con dimensiones que eviten saltos y lazy loading bajo el primer pliegue. Texto esencial en HTML y alt según función. Los placeholders no son fotografía final ni autorización de publicación.

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
3. Mantener una columna centrada de hasta 66rem, sin breadcrumb ni índice lateral. El cuerpo usa Instrument Sans 1.6rem/1.6, con H2 de 2.4rem y H3 de 2rem. Ninguna de estas medidas cambia el ancho global.
4. Conservar enlaces del contenido y ayuda con foco navy 2px/offset 4px; preservar destinos de políticas nativas y el contenido CMS cuando `demo_data` esté desactivado.
5. El template contiene `demo_data:true`: el ticket de contenido [LEM-119](https://linear.app/antekera/issue/LEM-119) debe resolver el texto definitivo antes de publicar. Aplicar esta guía no cambia ese setting ni convierte el texto de muestra en términos comerciales.
6. Revisar lectura, teclado, zoom, enlaces y desbordes a 390px y desktop, incluidos ambos lados de 750px. Verificar asignación CMS en la entrega de la página.

### Quiz: presentación compacta de colores

El paso Color usa siete opciones: Colores, Tonos neutros, Negros, Carey, Bicolor, Transparentes y Plateados, sin Dorados. Botones horizontales de al menos72px, muestra SVG plana32×32 a la izquierda y texto HTML al lado; tres columnas desde 750px y dos en móvil. Sin esferas grandes, volumen, sombras de muestra ni reflejos que simulen una bola. Carey tiene manchas orgánicas, Bicolor dos mitades y Plateados una franja plana; Transparentes representa el armazón. La selección usa borde navy, superficie cálida y check en esquina, visible solo al seleccionar; foco de teclado permanece independiente.

Se reutilizan `pattern/tortoise` y `transparency/transparent` para Carey y Transparentes; se editan únicamente en Color y cada criterio conserva su filtro independiente; Detalles conserva solo Acabados y Materiales, sin controles de patrón ni transparencia. Los códigos históricos brown/light coinciden con Tonos neutros; Plateados no se deduce de material metal. El nuevo diseño se presenta para revisión humana en local.

### Quiz: imágenes de materiales

El panel Materiales de Detalles sustituye las muestras SVG visibles por la [serie de estudio v1](docs/design/style-quiz-prototype/generated-material-studio-v1/README.md): seis imágenes generadas de una montura clásica en perspectiva sobre blanco, coherentes en encuadre y luz con el primer paso. Acetato, metal, titanio, TR-90, madera y mixto conservan etiquetas y códigos actuales. JPEG480/960, dimensiones960×640, contain3:2, alt vacío y carga diferida. Se conserva la retícula actual de dos columnas y el funcionamiento de selección. Los SVG anteriores siguen íntegros en el repositorio.

Las imágenes son referencias visuales conceptuales de superficies y construcción, no prueba de composición, peso, resistencia o compatibilidad. No se codifica un material por su color o brillo: metal/titanio y acetato/TR-90 pueden parecerse; la etiqueta y los datos verificados del producto mantienen su función. Estas imágenes no alteran atributos Shopify ni la apariencia de Acabados.

### Quiz: muestras realistas de acabados

Acabados mantiene Mate y Brillante en dos tarjetas horizontales compactas como Color, con miniatura fotográfica cuadrada64×64 junto a la etiqueta. La [serie macro v1](docs/design/style-quiz-prototype/generated-finish-macro-v1/README.md) muestra el mismo tono carbón y un acercamiento al borde de un armazón: textura difusa para mate y reflejo de luz para brillante. Imágenes decorativas JPEG128/256, proporción1:1 sin recorte, alt vacío y carga diferida; altura mínima96px, foco y selección nativos. El check se muestra al seleccionar, siguiendo Color. Los SVG anteriores se conservan. Referencias generadas de acabado, no fotografía de SKU; sin inferir atributos o materiales desde la fotografía.

### Quiz: tres formas por fila

El paso Forma mantiene tres columnas en escritorio, tablet y móvil. En móvil las tarjetas de forma usan padding8px y etiquetas 16px de peso400, con reflujo natural para conservar los nombres legibles en la retícula de tres. Sin cambios a dibujos, selección ni las columnas de otros pasos.

### Quiz: iconos de tamaño

El último paso sustituye el personaje ilustrado por una silueta frontal neutra de cabeza, cuello y hombros, sin pelo, rasgos faciales ni rellenos de piel/ropa. Contorno navy3 con opacidad0.6 y montura navy4.5 de forma suavemente rectangular. Misma silueta y posición en las tres opciones; solo escala el armazón (0.78/0.95/1.13). Se conservan etiquetas, selección y el carácter visual de compacto/intermedio/oversize; no determina talla física ni introduce rangos de medidas.

### Quiz: medidas de referencia editables

El acordeón del último paso incluye chevron navy20px que gira al abrir, tres campos opcionales en mm (ancho del lente, puente y patilla), el ejemplo50/18/140 y feedback accesible. Tres valores enteros válidos autoseleccionan una única proporción visual mediante radios; la elección manual posterior se conserva al restaurar su snapshot o cerrar/abrir el acordeón. Editar las medidas recalcula; borrar o invalidar una medida retira la selección automática, preservando una elección manual. El último snapshot conserva campos, feedback y selección al volver desde colección. Se guardan solo en el historial de navegación, sin perfil permanente, envío al servidor ni cambios Shopify.

La propuesta local usa el índice nominal `2 × ancho del lente + puente`: menor118 → compacto,118–128 → intermedio, mayor128 → oversize. Es una heurística editorial de esta exploración, pendiente de revisión/calibración con catálogo, no un estándar de talla ni el ancho total del armazón. Patilla se valida y conserva como referencia, sin afectar la proporción frontal. Rangos de entrada de la propuesta: lente30–80, puente10–35, patilla100–180mm. Una referencia incompleta/inválida no bloquea continuar sin sugerencia.

### Quiz: salida a la colección nativa

La decisión del 06-11-2026 sustituye el resumen y listado embebidos anteriores por la navegación filtrada a `/collections/all`. Las seis preguntas y sus snapshots permanecen en el quiz; resultados, tarjetas canónicas y edición de filtros pertenecen a la PLP. Los metacampos heredados de revisión y demostración se eliminaron el 10-11-2026; las evidencias históricas conservan su significado. El [contrato vigente](#quiz-de-estilo-navegación-a-catálogo) y la [guía de catálogo](docs/catalog/style-quiz.md) definen los filtros y la verificación pendiente.

### Guía de medidas: PDP y página educativa

PDP y página reutilizan los SVG originales de [frontal/lateral](snippets/lemoon-frame-measurement-diagram.liquid) y [patilla en perspectiva](snippets/lemoon-size-guide-comparison.liquid), con navy, superficie cálida e IDs únicos por instancia. La forma se inspira en [Donnalyn ZJGT372549-04](https://www.zeelool.com/goods-detail/ZJGT372549-04), referencia elegida por Miguel; no incorpora su estampado, marca ni cifras. Se conserva la abertura izquierda cuadrada y redondeada junto a los remaches, el puente continuo y la construcción aprobada. Los dibujos no están a escala ni representan un SKU Lemoon.

El modal muestra primero frontal/lateral apilados y una única lista compacta A–E con nombre y cifras reales de `custom.frame_dimensions`. Solo acepta números JSON positivos conocidos; las ausencias usan — con aviso parcial/vacío, sin completar desde talla o estilo. Los datos sintéticos etiquetados `lemoon-measurements-demo` mantienen su aviso. Material, talla, ajuste y demás características quedan en la ficha inline de Características de la PDP; no se añade entrada desde Home ni se incrusta el cuerpo CMS de la guía.

«Compara con tus lentes» es un acordeón nativo inicialmente cerrado, separado24px del dibujo. Reutiliza la imagen con inscripción e indicador de patilla, el ejemplo educativo52 □18–145 y su nota de12px, sin repetir las tres filas de explicación de la página. La ayuda «¿Tienes más dudas?» y el enlace «Cómo medir tus lentes» quedan dentro. Al abrirlo, solo el panel desplaza su título al inicio del área de lectura bajo la X:16px de inset,44px de control y12px de separación. Chevron al extremo derecho y X a16px del borde superior, sin colisiones. Movimiento reducido usa desplazamiento inmediato; el scroll no cambia el foco nativo ni el documento. Cerrar el drawer pliega el acordeón después de su salida visual; toda reapertura vuelve arriba y cerrada, incluso durante una salida pendiente. Mantener foco contenido/restaurado, Escape, cierre sticky y controles táctiles.

En escritorio se conserva el drawer derecho de480px; hasta749px usa la presentación inferior compartida con16px de radio superior y al menos32px de overlay visible. La [receta PDP](docs/components/recipes/product-card-grid.md) documenta los parámetros y controladores existentes.

La página `measurements` tiene introducción y tres pasos editables, índice de24rem desde990px y lectura de65–70ch. Los dibujos pueden usar dos columnas desde750px; instrucciones A–E y filas del código mantienen reflow, incluso con texto al200%. La inscripción pequeña SVG es decorativa; el código grande permanece en HTML y la nota educativa bajo la imagen. No duplica la advertencia sobre escala ni ofrece tolerancias universales o promesas de calce. La ayuda final conserva solo «Ver catálogo», mediante `lemoon-ui-action` con variante `accent` amarilla/navy; las otras guías conservan su composición.

Los eventos y la activación separada del receptor GA4 se describen en [el contrato de analítica](docs/analytics/measurement-guide.md). [La validación y sus límites](docs/qa/lem-129-105-validation.md) distinguen el preview local, la aprobación de la página y las operaciones posteriores de Shopify. Asignación CMS, carga de catálogo, instalación del píxel y publicación requieren su autorización correspondiente.


### Presentación compartida del drawer móvil

El 08-11-2026 Miguel pidió que la hoja inferior de medidas sea el comportamiento por defecto del componente drawer móvil. `component-lemoon-drawer.css`, cargado una vez por layout, concentra la geometría y entrada vertical; el CSS PDP conserva solo el espaciado de su contenido. Los adaptadores apuntan exclusivamente al panel exterior de los drawers vigentes: medidas, carrito, filtros Dawn/PLP y disponibilidad de retiro. La navegación Lemoon es una excepción: por petición del 09-11-2026 recupera el panel lateral bajo el header, con ancho `min(90vw, 38rem)`, apertura desde la izquierda y cierre hacia ese mismo lado. Los paneles internos de navegación/filtros conservan su movimiento horizontal. El selector `dialog.lemoon-drawer` permite nuevas composiciones nativas con la misma presentación móvil y sus controles explícitos; no incorpora otro motor de diálogo ni fija su diseño desktop.

Navegación añade Cerrar y Volver dentro del panel móvil, con foco contenido en controles visibles y nivel activo; el retorno al cerrar usa un control visible del header. Si al cruzar750px desaparecen todos los openers del menú, el panel se cierra y devuelve el foco al primer control visible, sin dejar un panel abierto sin cierre. Retiro monta un backdrop hermano durante la apertura, que intercepta clics y se elimina al cerrar/desconectar. El cierre de filtros permanece visible dentro del nuevo borde superior. Las superficies mantienen sus contratos comerciales y sus duraciones locales; movimiento reducido evita la animación del panel. HeaderDrawer Dawn está conservado como legacy sin caller del header vigente: no se declara migrado por este cambio.

El carrito conserva su controlador y la activación existente: cuando la transición del panel dura0 (incluido movimiento reducido), activa el foco contenido inmediatamente al abrir; con animación conserva el evento de finalización. La accesibilidad no depende de que se emita un `transitionend` cuando no hay movimiento.

El cierre de los drawers nativos de medidas en móvil mantiene el panel opaco durante la salida hacia abajo. Si el motor no permite conservar la capa modal con la transición CSS de overlay, el controlador existente mantiene el diálogo abierto hasta el fin de transform y después ejecuta su cierre nativo. Escape repetido no interrumpe la salida; movimiento reducido evita la espera. La implementación estándar y óptica comparten la instancia de la guía, sin importar el módulo una segunda vez.

### PDP: jerarquía de información y confianza · refinamiento 09-11-2026

La PDP estándar conserva su espaciado superior configurado y su animación de entrada del panel de información. La PDP óptica aplica el mismo espaciado de 24px en escritorio y la misma animación al panel; las galerías conservan sus reglas de posición respectivas.

Los botones que abren Guía de medidas conservan el foco y su retorno al cerrar el modal. El foco visible usa el contorno gris compartido del sitio.

La solicitud de Miguel se implementa sobre las familias actuales: galería protagonista y panel de selección en escritorio, identidad/precio antes de la foto en móvil y descripción completa debajo. Los detalles comparten el ancho y los márgenes de página. Dos pestañas separan Características (forma, material, peso, público, talla, ajuste y rostros disponibles) de Medidas (valores mm y esquema A–E solo aquí). Se omiten campos ausentes y párrafos genéricos. El acceso junto a la talla abre el modal de medidas y restaura el foco al cerrar.

El valor de la talla junto a la guía se presenta como una etiqueta redondeada con fondo gris claro `#f1f2f3`.

La información cercana a compra se concilia con políticas nativas: garantía legal y cambios/devoluciones con enlace a reembolso, plazo configurado con sus condiciones y enlace a envío, medios de pago habilitados por Shopify. No reutilizar365/30días de defaults ni claims de competidores como hechos Lemoon. No generar cifras desde talla textual, convertir referencias de compatibilidad en booleanos, ni asumir sincronización de campos cortos/medidas desde Studio. El [inventario y cruce de datos PDP](docs/design/2026-11-09-pdp-refinement.md) registra fuentes, límites y diferencias; revisión humana del resultado pendiente.

La descripción aparece dentro de la pestaña Características, cuyos atributos se distribuyen en dos columnas en desktop y una en móvil, sin título visual adicional ni acceso inferior duplicado a la guía. Las pestañas usan escritura normal y 16px.

Las acciones de texto y los enlaces de navegación del encabezado usan `--lemoon-font-body` con peso regular (400); los enlaces de navegación en desktop usan peso medium (500).

En PDP y tarjetas, el corazón de favoritos muestra borde navy y fondo transparente; al pasar el cursor cambia el borde a amarillo y, cuando está guardado, tanto el borde como el relleno son amarillos. El estado sigue siendo gestionado por Vitals.

En desktop, el título de la PDP incluye una acción de compartir a la izquierda del favorito. Abre las opciones del dispositivo cuando están disponibles; de lo contrario copia el enlace del producto o permite copiarlo manualmente.

El resumen de la PDP se entrega en el HTML inicial, antes de la galería en móvil; conserva una sola instancia de título, precio y acciones y el orden de bloques configurado en el editor. La guía de medidas aparece solo para productos identificados como armazones y usa un subrayado de foco sin contorno exterior.
