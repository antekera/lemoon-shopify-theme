# LEM-103 — Propuesta visual de guía por rostro

Fecha: 08-11-2026. **Estructura y estilo de ilustración aprobados por Miguel el 08-11-2026; implementación local terminada y revisada, sin publicación Shopify.** Rama `feat/lem-103-face-shape-guide`, base `5bcb463bdd655720724b1df7c5c5be728e8d7100`.

**Dirección raster aprobada:** Miguel aprobó la [lámina editorial v1](raster-fit-editorial-v1.png) con «Sí. Se ve muy bien» y pidió señalar las zonas de ajuste. Se generaron tres piezas individuales con marcas lemon para Puente, Pómulos y Patillas; están integradas en la vista local como WebP responsivos. [Masters, prompts y procedencia](raster-fit-marked-v1/README.md). La lámina base y su [prompt](raster-fit-editorial-v1.prompt.md) se conservan como referencia. Son ilustraciones de una persona ficticia, sin afirmar stock, SKU ni ajuste de productos. La integración mantiene títulos/leyendas editables, selección de imágenes del editor y salidas PLP; publicación Shopify sigue pendiente.

## Resultado buscado

Que una persona reconozca contornos aproximados, compare formas de armazón y llegue al catálogo sin tener que leer un artículo largo. Las ilustraciones y los ejemplos guían; el gusto y el ajuste siguen siendo decisiones propias. Sin clasificación por género/edad, diagnóstico, foto del usuario, detección automática ni reglas de exclusión.

## Material para revisar

- [Lámina de seis formas, v2](face-shapes-contact-sheet-v2.png): concepto original generado con IA, usando como referencia de acabado la guía de medidas observada en la tienda. No son personas reales ni fotografías de productos. La segunda versión distingue mejor el ancho de pómulos en Diamante. Los nombres y las monturas de esta lámina sirven para revisión; en la implementación, los textos esenciales irán en HTML editable, fuera del raster.
- [Texto propuesto](../../content/2026-11-08-face-shape-guide-draft.md): seis familias de 45–53 palabras, cada una con dos pistas, opciones de armazón y razón breve; versión pendiente de aprobación editorial.
- [Investigación](../../content/2026-11-08-face-shape-guide-research.md): R&K, Mr. Visión, Buhu, Warby Parker, Eyebuydirect y Zenni; diferencia fuentes abiertas, imágenes inspeccionadas y límites de acceso.
- [Lectura real de destinos filtrados](catalogue-links-readback.json): seis combinaciones comprobadas en el navegador local autenticado. Son resultados del catálogo actual, que incluye muestras; no certifican inventario comercial definitivo.

## Composición aprobada

1. **Entrada breve.** H1 existente «Elegir lentes según tu rostro» y explicación corta. Sin un hero grande que retrase la comparación.
2. **Índice visual de seis contornos.** Ovalado, Redondo, Cuadrado, Corazón, Diamante y Alargado. Los nombres enlazan a sus módulos mediante anclas. No exige seleccionar una forma para continuar.
3. **Seis módulos visibles al hacer scroll.** Una ilustración frontal, dos pistas observables y dos monturas primarias, con su nombre y motivo breve. Las alternativas del borrador pueden quedar en una frase secundaria. Se conserva la misma escala ilustrativa entre familias. Comparaciones sin «bien/mal» ni antes/después de corrección.
4. **Ajuste, explicado con imágenes.** Tres dibujos principales para puente, contacto con pómulos y patillas. Cejas y posición de ojos como detalles breves opcionales, sin enseñar centrado óptico. Enlace a «Cómo medir tus lentes».
5. **Un único banner final de ayuda.** «¿No reconoces tu forma?» conserva el consejo para rasgos mixtos y las salidas al catálogo y al quiz. Sustituye la segunda invitación «Sigue por las formas que te gustan»; usa el verde terciario existente, sin repetir otro banner entre familias y ajuste.
6. **Catálogo filtrado y siguiente paso.** Las monturas o el botón «Ver armazones» navegan a la colección nativa con formas reales; la PLP conserva filtros, tarjetas, chips y paginación. Por solicitud posterior de Miguel se retira el enlace «Ver formas» de cada familia; el índice inicial conserva sus seis anclas. No se inserta un segundo listado ni un recomendador nuevo.

En escritorio, módulo con ilustración y explicación próximas; en móvil, cada módulo completo se apila y se lee sin desplazamiento horizontal. Todas las familias permanecen accesibles al hacer scroll, sin pestañas que oculten contenido. Texto principal al menos 16px; ayudas secundarias al menos 14px. Urbanist/Instrument Sans, navy/gris sobre cálido, espaciado y radios de la familia guía según [DESIGN.md](../../../DESIGN.md). Targets mínimos 44px, foco visible, orden lógico y alternativa sin JavaScript. La composición fue aprobada por Miguel; registrar la integración acotada en el contrato visual.

## Conexión al catálogo comprobada

Inspección 08-11-2026 en `https://miguels-mac-mini.tail51dddb.ts.net:9452/collections/all`: el formulario nativo expone `filter.p.m.custom.frame_shape`, con valores controlados en español. No se observó un filtro de forma de rostro. Se enlaza por **forma del armazón**, sin equipararla a talla ni garantizar compatibilidad facial o receta.

| Familia editorial | Monturas primarias mostradas | Resultado de la combinación observada |
| --- | --- | --- |
| Ovalado | Rectangular + redondo | 13 lentes |
| Redondo | Rectangular + geométrico | 9 lentes |
| Cuadrado | Redondo + ovalado | 13 lentes |
| Corazón | Ovalado + aviador | 11 lentes |
| Diamante | Ovalado + ojo de gato | 11 lentes |
| Alargado | Aviador + redondo, tras revalidación de fuentes | 12 lentes |

Los parámetros repetidos mostraron ambas selecciones y resultados no vacíos. La nueva combinación de Alargado se comprobó el 08-11-2026 en el preview Shopify existente: ambos filtros seleccionados y12tarjetas/12lentes. Sustituye el ejemplo rectangular bajo tras [revalidar las fuentes](../../content/2026-11-08-face-shape-guide-research.md#revalidación-de-los-seis-pares--8-de-noviembre-de-2026). «Mayor altura» es una explicación visual: **no existe un filtro de altura añadido**, ni la forma garantiza altura o ajuste. La tarjeta indica que se comparen fotos y medidas. Los conteos son evidencia fechada, no texto para publicar. La lámina es conceptual, no inventario.

Las rutas `/pages/como-medir-tus-lentes` y `/pages/descubre-tu-estilo` aparecen en el footer local; la guía de medidas fue abierta y vista. Las rutas y filtros se volverán a verificar en el render integrado y en el entorno que se publique.

## Base observada e integración local

La URL solicitada mostró H1, H2 y dos párrafos, sin ilustraciones ni recomendaciones enlazadas. La plantilla local `page.guia-rostro.json` apunta hoy a la sección genérica `lemoon-guide-page` con `guide_kind: face`, tres pasos fijos y SVG de lentes compartido con otras guías. Ninguna de esas dos evidencias demuestra una guía final editable por familia.

Implementación local: sección `lemoon-face-guide` exclusiva de la página de rostro, con contenido/imagen/destino editables mediante bloques del editor Shopify, reutilizando heading/action y los contratos de guía. Conservar las otras guías y la ruta actual. Verificar la asignación CMS y cómo preservar el contenido existente antes de activarla. No importar trabajo pendiente de otros worktrees de PDP/medidas.

Se produjeron seis activos individuales sin texto incrustado, derivados responsive y tres diagramas originales de ajuste. El esquema debe permitir reemplazar imágenes, textos y enlaces, con alternativas útiles si falta una imagen o un destino. Las imágenes bajo el primer pliegue llevarán carga diferida y dimensiones reservadas. No se agregan dependencias externas para interacción.

## Evidencia y límites

- Rama de trabajo aislada, sin reutilizar ni modificar worktrees de otros tickets.
- Inspección de URL objetivo, guía de medidas y filtros mediante navegador Orca. La captura de viewport de medidas fue vista directamente; el full-screenshot repetía bandas y no se toma como prueba de un defecto del sitio.
- Navegación autenticada con contraseña existente, sin exponerla en documentos. Sin cambios de catálogo, contenido CMS, configuración remota o tema Shopify.
- Comprobados seis enlaces filtrados; esto **no es QA de la futura página**, teclado de sus controles ni revisión de su responsive.
- Implementación local verificada: Theme Check321archivos/cero observaciones; suite completa492unitarias+287Chromium antes del ajuste responsive y refresco final22unitarias+42casos Chromium/Firefox/WebKit. [Evidencia y límites](../../qa/lem-103/README.md).
- Estructura y estilo aprobados; código, convenciones y copia integrada revisados independientemente. Pendientes revisión humana de la implementación, integración remota y QA Shopify/CMS según LEM-103. El handoff no autoriza merge ni deploy.

Aprobación explícita registrada en la conversación: «apruebo, me gusta, es importante esta pagina tenga una salida para poder ir a la pagina de prodictos (plp) con estos filtros seleccionados». Se mantiene como requisito una salida clara por familia hacia PLP con las formas sugeridas seleccionadas. Esta aprobación autoriza la integración; no acredita la implementación completa ni autoriza deploy.

## Activos finales y activación

Seis ilustraciones maestras originales transparentes1254×1254, sin nombres ni monturas incrustadas, derivadas de la lámina aprobada mediante generación de imágenes. Maestros en `assets/lemoon-face-{oval,round,square,heart,diamond,long}-v1.webp`; el render usa únicamente derivados180/360 para miniaturas y360/640/960 para retratos. Se conservan trazos, proporciones y transparencia; las variantes cambian resolución para el uso web. No representan personas reales ni un SKU. El formato WebP se codificó sin pérdida sobre cada resolución; la reducción de tamaño sí implica remuestreo.

[Pasos de activación y metadatos](../../content/2026-11-08-face-guide-activation.md). [QA local y revisiones](../../qa/lem-103/README.md). Preview de revisión: `https://miguels-mac-mini.tail51dddb.ts.net:9453/pages/elegir-lentes-segun-tu-rostro`; guía local renderizada desde la rama, PLP real a través del preview existente.

Corrección solicitada por Miguel el08-11-2026: las doce monturas reutilizan exactamente el SVG canónico del paso Forma de «Descubre tu estilo». Los tres diagramas de ajuste se redibujaron como SVG con contornos navy y volumen marfil/gris próximo al acabado de los retratos. [Capturas y verificación específica](../../qa/lem-103/README.md#corrección-svg-solicitada-por-miguel--08-11-2026). Se conservan los filtros y las salidas al catálogo aprobados.
