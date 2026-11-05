# LEM-11 · Acabado visual del quiz

Especificación de implementación local, 05-11-2026. Base inspeccionada: `941b2e5c`, rama `feat/lem-11-style-quiz`. No modifica código, Shopify ni Figma. El contrato visual sigue siendo [DESIGN.md](../../../DESIGN.md); este documento desarrolla la dirección «editorial con momentos lúdicos» autorizada para la segunda etapa. No crea tokens ni una guía de marca paralela.

## Fuentes y nivel de evidencia

| Fuente | Uso / comprobación |
| --- | --- |
| [DESIGN.md](../../../DESIGN.md), [marca](../brand-guidelines.md), [brief LEM-82](../brand-strategy.md) | Leídos: paleta, tipos, composición, semántica comercial y accesibilidad |
| [Estrategia del quiz](../2026-11-05-style-quiz-strategy.md), [entrega funcional](implementation-stage-1.md), [inventario LM-QUIZ](../component-inventory.md#lm-quiz) | Leídos: límites funcionales y propuesta de segunda etapa |
| [Figma aprobado como outline](https://www.figma.com/design/Z6qNxx6rSmYAbA1q23yvs1), [registro del prototipo](README.md) | Referencia localizada y registro leído. **No se abrió Figma en esta revisión**; no se atribuyen medidas nuevas a sus frames |
| Capturas reales locales | Inspeccionadas con `view_image`: `/tmp/lem-11-shopify-qa-2026-11-05/390-intro.png`, `820-details.png`, `1440-intro.png` y `/tmp/lem-11-results-grid-2026-11-05/390-results.png` |
| `assets/lemoon-style-quiz.css`, `snippets/lemoon-quiz-visual.liquid`, `snippets/lemoon-quiz-options.liquid` | Inspección de selectores, muestras y estados actuales; no es nueva QA de navegador |
| [Investigación](../../content/2026-11-04-buscar-mi-estilo-research.md) | Criterios de comparación visual y descubrimiento documentados. No se volvieron a abrir competidores ni se afirma validación actual de sus sitios |

## Decisiones confirmadas que se conservan

- Mismo contenido, orden de cinco etapas, multiselección, omisión, edición, ranking, metadatos y precios reales.
- Resultados: dos columnas móviles y tablet, tres de escritorio, hasta doce iniciales y ampliación por doce; separaciones móviles **1.2rem horizontal / 2.4rem vertical**.
- Resumen editable una sola vez antes del listado y tarjetas canónicas sin texto de afinidad. No alterar `card-product`, swatches, títulos, badges, precios ni fotografías de producto.
- Urbanist 600 para H1/H2 en sus roles actuales; Hanken para lectura. No volver al Light del boceto ni introducir una tercera fuente.
- Blanco para lectura, cálido para superficies, navy para acciones y lemon solo como acento. Producto completo en catálogo; crop editorial solo en portada.
- Las imágenes genéricas no son SKU. Las ilustraciones de opciones son conceptuales y nunca acreditan material, transparencia o ajuste de una referencia vendida.

## Diagnóstico de las capturas

1. La portada ya tiene una buena foto y una jerarquía comprensible, pero la fotografía y el bloque tipográfico se sienten colocados uno al lado del otro: falta un tratamiento editorial común de superficies, bordes y ritmo.
2. Las muestras de detalles son bloques planos. «Liso» incluye una curva clara que puede leerse como veta; mate y brillante comparten el mismo gesto. La diferencia visual debe venir del atributo comparado, sin adornos que introduzcan otro patrón.
3. Las elecciones parecen celdas de formulario. Conviene dar una respuesta física breve y un estado de selección más explícito, manteniendo inputs y labels nativos.
4. En resultados móviles el resumen ocupa varias filas irregulares antes de las fotos. Puede organizarse como una recapitulación compacta sin eliminar ninguna respuesta ni control de edición.
5. El catálogo ya responde a la decisión del usuario y debe quedar visualmente estable. El refinamiento se concentra en el encabezado y el resumen, no en rediseñar sus cards.

## Dirección única: un estudio cálido para elegir

Una composición editorial limpia con fotografía existente y muestras que parecen objetos comparables apoyados en una superficie. La personalidad aparece en la escala de las muestras, el acento de selección y una respuesta breve al tocar. No se añaden stickers, ilustraciones decorativas repetidas, frases nuevas, animaciones de espera ni efectos sobre las fotografías comerciales.

Los siguientes son ajustes locales propuestos dentro de esa dirección autorizada. Antes de entregar el cambio, el implementador registra su tratamiento local definitivo en DESIGN.md e inventarios; no extiende sombras o radios a otras páginas.

### 1. Entrada

Dueño: `sections/lemoon-style-quiz.liquid` y `.lemoon-quiz__intro`, `__invitation`, `__editorial`, `__pace`, `__eyebrow`.

- Conservar DOM y orden móvil: título/texto → CTA → acceso a catálogo → foto. No poner texto encima de una foto ni cambiar el flujo por dispositivo.
- Mantener dos columnas desde 750px y una bajo 750px. Desktop: conservar la relación actual cercana a 1:1.08, gap `--lemoon-space-12` o `--lemoon-space-16` según ancho; tablet gap `--lemoon-space-6`; móvil `--lemoon-space-8` entre texto y foto.
- H1 conserva los tokens H1. Ancho óptico de texto hasta 15–16ch; párrafo hasta 42ch. No fijar saltos con `<br>` para una única resolución. Texto y CTA deben seguir funcionando a 200% de zoom.
- Foto existente `lemoon-category-opticos-generic-v1.jpg`: superficie cálida, radio `--lemoon-radius-lg` y borde interior blanco de 1px. Mantener ambas monturas dentro del crop móvil y escritorio; permitir `object-position` propio sin deformar la imagen. No usar `object-fit: cover` con una altura que corte sus extremos.
- Dar al marco editorial una segunda línea de contorno warm desplazada 0.8rem hacia arriba/derecha, mediante pseudo-elemento o SVG decorativo. Reservar ese espacio en el contenedor; no producir overflow. Un único arco/ovalo navy de opacidad muy baja puede aparecer detrás del marco, nunca sobre los lentes ni el texto. `pointer-events:none`, sin nueva semántica ni foco.
- El tratamiento cálido puede llevar una trama de puntos muy tenue hecha con gradiente CSS y color derivado de `--lemoon-text-brand`, solo en el fondo del marco. No añadir ruido a las fotos, lectura o catálogo; eliminarla en colores forzados. No se necesita bitmap ni una descarga adicional.
- Mantener CTA navy y acceso a catálogo de menor jerarquía. Hover usa `--lemoon-action-primary-hover`, no un cambio global de opacidad que lave texto e icono. Flecha en la familia `lemoon-icon`; 20px, trazo consistente.
- El eyebrow puede tener una línea lemon de 2px y 2.4rem como detalle editorial; no representar una puntuación o un progreso inexistente antes de comenzar.

### 2. Elección y detalle de materiales

Dueños: `.lemoon-quiz__navigation`, `__stage`, `__question`, `__tabs`, `__option`, `__visual`, `__selected` y `snippets/lemoon-quiz-visual.liquid`.

**Composición.** Conservar la columna editorial de pregunta junto a las opciones desde 750px y apilar bajo 750px. No hacer sticky la pregunta ni los botones en esta entrega. El contenido debe crecer con traducciones y selecciones sin alturas de viewport ni scroll interno. Número de etapa grande permanece decorativo; la información real de progreso continúa en `progress`/status.

**Pestañas.** Dar a `__tabs` una pista común cálida con padding `--lemoon-space-1`, radio full y gap `--lemoon-space-1`. Cada botón conserva al menos 44px de alto, texto 13px y su `aria-pressed`. Activo: superficie blanca y contorno navy; inactivos: fondo transparente/texto navy. No subrayar o desplazar el texto al activarse. Mantener tres opciones legibles a 320px; si hay texto largo, crecer en alto antes de desbordar.

**Tarjeta.** La etiqueta conserva su superficie y clic completos. Radio md (12px), padding `--lemoon-space-3` en móvil / `--lemoon-space-4` desde 990px, fondo blanco o warm según la muestra y un borde de superficie discreto. Reservar 3.2rem de esquina para el indicador: el check no debe tapar la zona útil de comparación. Separar arte y label con `--lemoon-space-3`. Mantener el nombre siempre visible, sin truncación.

**Indicador y estados.** Mostrar una circunferencia de selección en reposo (24px, borde `--lemoon-border-input` con contraste comprobable), no solo cuando está elegida. Seleccionado: lemon + check navy y borde navy del contenedor. Foco: outline navy 2px/offset3px independiente del hover. Hover de puntero fino: elevación máxima de 2px, sombreado local tenue y fondo warm-hover; al pulsar, volver a la base. En móvil el feedback principal es el estado marcado, no el hover. La sombra se deriva del navy con baja opacidad y nunca se aplica a productos. Con reduced-motion retirar desplazamiento/transición; con forced-colors mantener borde/check del sistema y retirar sombras/tramas.

**Familia de muestras SVG.** Conservar `viewBox="0 0 320 160"`, área segura y escala común. No añadir raster o un filtro SVG pesado. Si se usan gradientes/clipPaths, IDs únicos por sección/grupo/código/instancia; el snippet debe recibir un identificador explícito desde `lemoon-quiz-options`, no generar IDs repetidos en la página/editor. Todo el SVG es decorativo (`aria-hidden` por wrapper, sin foco); el texto HTML conserva el significado.

| Grupo / valor | Tratamiento concreto |
| --- | --- |
| Forma | Monturas frontales con grosor óptico consistente, doble borde muy sutil para volumen y puente/varillas alineados. Igual caja y centro; no convertir redondo en oval, panto en aviador ni cat-eye en mariposa |
| Color | Tres discos o pequeñas láminas solapadas de la paleta actual, con borde interior y sombra de apoyo mínima. La selección sigue siendo la familia cromática, sin sugerir que las tres muestras estén disponibles en un SKU |
| Mate | Una pieza común de armazón/lámina con luz amplia y difusa. Sin franja blanca nítida ni línea que parezca veta. Fondo neutro cálido de la muestra |
| Brillante | La misma pieza, color, tamaño y luz base que Mate; cambiar solo a un reflejo estrecho limpio y un borde luminoso. No dibujar otra forma o un color más intenso para hacerlo «mejor» |
| Liso | Misma pieza de comparación y color base uniforme. **Eliminar la curva decorativa actual** y toda mancha o veta. La geometría de la pieza puede tener volumen, pero su superficie no un patrón |
| Carey / vetas | Misma pieza y escala que Liso; manchas orgánicas redondeadas y zonas translúcidas ámbar, sin polígonos duros que parezcan mosaico/piedra. No derivar la familia de color de este dibujo |
| Transparencia | Misma pieza y mismo motivo de fondo en las tres opciones. Solo variar la visibilidad del motivo a través de ella; Opaco lo oculta, Translúcido lo difumina de manera conceptual, Transparente lo deja legible. No confundirlo con tono más claro o con un color distinto |
| Material | Conservar construcción diagramática coherente: líneas finas para metal/titanio y más cuerpo para acetato/TR-90. No representar una rigidez, resistencia o sensación térmica como comprobada. Etiqueta HTML manda si el material no puede distinguirse visualmente |
| Uso | Escenas vectoriales actuales refinadas en la misma perspectiva, espesor de línea y escala. Fondo/sombra compartidos; sin iconos de protección UV, receta o prestaciones. No cambiar la semántica de los cuatro planes |
| Presencia | Mismo rostro, escala y posición. Modificar solo el tamaño aparente de la montura; mantener ayuda física aparte. No introducir medidas o supuestos de género/edad |

Los colores descriptivos ya presentes en las muestras son parte de la ilustración de atributo, no tokens nuevos de interfaz. Mantener una misma dirección de luz arriba/izquierda. No usar una fotografía generada como prueba de mate/brillo/material de un producto real.

### 3. Resultados como catálogo

Dueños: `.lemoon-quiz__results > h2`, `__preferences`, `__preference-list`, `__preference`, `__demo`; grilla y cards se preservan.

- Título H2 con rol actual; relajar `max-width:18ch` a 28ch en escritorio y ancho disponible en móvil para evitar un bloque innecesariamente estrecho. Mantener la misma frase y la misma jerarquía semántica.
- Introducción y aviso demo conservan todo su contenido. El aviso no se oculta, colapsa ni se convierte en tooltip. Se puede usar padding `--lemoon-space-3` en móvil y `--lemoon-space-4` en escritorio; texto mínimo13px con interlineado legible y borde navy actual.
- Resumen como recapitulación editorial: una sola región antes de resultados, sin repetir criterios dentro de las tarjetas. Reducir margen/padding sobrante, no el tamaño del texto por debajo de la escala actual.
- Móvil: `__preference-list` en dos columnas `minmax(0,1fr)`, gap `--lemoon-space-2`. Cada botón usa label y valor en dos líneas con flecha de 16px a la derecha y altura mínima48px; padding 0.8rem/1.2rem y radio md. El botón Detalles puede ocupar ambas columnas: permite leer varios atributos y conserva la secuencia Forma/Color → Detalles → Uso/Tamaño. No ocultar «Sin preferencia» ni quitar la posibilidad de editar esos pasos.
- Desktop: lista flexible con wrapping; botones compactos con los mismos textos, iconos y foco. No dar una anchura fija que produzca huecos grandes; valores largos siguen envolviendo.
- Separar resumen y conteo con `--lemoon-space-5`; entre conteo y grilla `--lemoon-space-4` en móvil. El conteo sigue siendo HTML, no un badge de coincidencia o porcentaje.
- **Inmutables:** dos columnas móviles, gap12/24, tres columnas desktop, card wrapper/media/precio/swatch, orden/ranking/deduplicación y lotes12. No añadir sombra/rotación/marco editorial a las cards comerciales ni cambiar `contain` a `cover`.

## Activos y alcance de implementación

| Archivo | Cambio propuesto |
| --- | --- |
| `assets/lemoon-style-quiz.css` | Acabado local de portada, opciones, estados, tabs y resumen; reglas responsive y accesibilidad |
| `snippets/lemoon-quiz-visual.liquid` | Muestras vectoriales comparables y corrección del patrón liso; geometría/gradientes ligeros |
| `snippets/lemoon-quiz-options.liquid` | Solo identificador explícito para SVG, si se requieren defs; preservar input/label/valores |
| `sections/lemoon-style-quiz.liquid` | Solo wrappers/clases decorativas o semánticas estrictamente necesarios; no modificar schema/contenido/colección |
| `DESIGN.md` e inventarios del componente | Incorporar el tratamiento local entregado, mediante el coordinador; este documento no sustituye ese contrato |
| Pruebas de quiz existentes | Actualizar únicamente expectativas visuales/markup afectadas; conservar todas las pruebas funcionales, de datos y variante |

No hace falta una generación de imágenes para este primer pase de acabado. La fotografía editorial existente ya soporta la composición. El mayor beneficio inmediato es mejorar las muestras y su claridad. Macros reales comparables de acabado/material pueden sustituirlas más adelante cuando haya originales verificados, misma luz y escala; hoy esa fuente no está confirmada. No producir una serie de imágenes genéricas para rellenar este faltante.

## Criterios de aceptación visual y funcional

1. Capturas de entrada/detalles/resultados en390/820/1440; además revisar320 y ambos lados de750/990 si cambia un breakpoint. Sin overflow, cortes de texto, CTA cubierto ni pérdida de foco por header.
2. Portada: lentes completos en el crop editorial elegido; decoración no tapa contenido y no añade un scroll horizontal. Texto sigue HTML y el CTA se reconoce primero.
3. Detalles: Liso no parece vetado; Mate/Brillante se comparan con misma geometría/color; Carey se reconoce como patrón orgánico. Colores y transparencias no se confunden. Indicador y label visibles en todos los estados.
4. Estado seleccionado identificable por check y borde además del color. Teclado funciona en opciones, tabs, volver, continuar y edición; targets≥44px. Probar reduced-motion y forced-colors sin perder significado.
5. Resultados: una sola recapitulación antes de la grilla, cinco controles de edición presentes, fotos/precios reales intactos y2cards por fila móvil con12/24. Ningún texto de afinidad reaparece por card.
6. No duplicar IDs de SVG en página ni al recargar la sección en el editor. No crear dependencias raster, animación o JS nuevas para el acabado.
7. Repetir los E2E afectados y Theme Check; distinguir fixtures de verificación Shopify. La geometría visual se evalúa con capturas reales, no solo leyendo CSS.

## Discrepancias y límites pendientes

- El inventario de secciones tenía una descripción antigua de cuatro preguntas, presupuesto, bloques y tres resultados al iniciar esta inspección. El coordinador informó su corrección en `aa61f369`; la discrepancia queda resuelta y no debe reintroducirse.
- El README histórico de este prototipo y parte de la estrategia registran etapas previas; sus límites Figma no son el estado actual del tema. Usar la entrega de implementación y DESIGN para el contrato vigente.
- Figma no fue reabierto ni modificado aquí. No hay un frame nuevo revisado por el usuario, una prueba de nuevos crops ni una aprobación independiente de esta especificación. La revisión de implementación se debe hacer contra nuevas capturas cuando el coordinador tenga el acabado listo.
- No se auditaron todos los tokens contra su CSS: se reutilizaron los roles documentados y se comprobó la existencia de radio/movimiento/espaciado mencionados. No se presenta esto como auditoría de tokens ni certificación WCAG.
