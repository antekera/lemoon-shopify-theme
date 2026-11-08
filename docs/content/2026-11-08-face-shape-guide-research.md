# Guía de rostro — fuentes de las recomendaciones

Investigación del 8 de noviembre de 2026 para LEM-103. Se conserva el respaldo de las recomendaciones integradas; los textos editables vigentes están en la sección y en `locales/es.json`/`en.default.json`, sin un borrador duplicado.

La forma del rostro es una referencia opcional de estilo. Estas fuentes comerciales no establecen una correspondencia clínica ni una regla universal. No se infieren edad, género, atractivo, medidas ni compatibilidad óptica. Talla, puente, patillas y cristales se revisan por separado.

## Revalidación de los seis pares — 8 de noviembre de 2026

| Rostro | Formas integradas | Respaldo |
| --- | --- | --- |
| Ovalado | Rectangular + redondo | I1 permite muchas formas; I2 incluye ambas. |
| Redondo | Rectangular + geométrico | C2/I2 mencionan ambas; I1 respalda rectangular. |
| Cuadrado | Redondo + ovalado | C1/C2/C3/I1/I2 coinciden en opciones curvas. |
| Corazón | Ovalado + aviador | C2/I1 nombran ambas; I2 las incluye en su desarrollo. |
| Diamante | Ovalado + ojo de gato | C2/I1/I2 incluyen ambas. |
| Alargado | Aviador + redondo | I3 incluye ambas; I5/F1 respaldan aviador. Comparar altura real en fotos y medidas. |

Alargado sustituyó el ejemplo rectangular bajo porque las referencias priorizan altura/amplitud. No se prohíben rectangulares ni se garantiza altura por elegir aviador. Los filtros son por **forma del armazón**, nunca por forma de rostro o ajuste asegurado.

## Fuentes primarias consultadas

| ID | Fuente exacta y fecha editorial visible | Evidencia pertinente, parafraseada |
| --- | --- | --- |
| C1 | [Rotter & Krauss — anteojos según el rostro](https://www.ryk.cl/anteojos-forma-rostro.html), sin fecha visible | Recomienda formas angulares para Redondo, redondas/ovaladas para Cuadrado y aviador para Corazón. Permite explorar muchas formas en Ovalado y termina relativizando las reglas. Su consejo sobre grosor superior en Corazón difiere del de otras tiendas. |
| C2 | [Mr. Visión — lentes según la forma del rostro](https://mrvision.cl/blogs/medidas-de-un-lente/lentes-segun-forma-del-rostro), sin fecha visible | Enumera rectangulares y geométricos para Redondo; redondos/ovalados para Cuadrado; ovalados/aviador para Corazón; ovalados/ojo de gato para Diamante. En Rectangular/Alargado prioriza formatos grandes y con altura. El subtítulo de la lista de Diamante está mal rotulado como Rectangular: se tomó el contexto del bloque, sin copiar ese error. |
| C3 | [Buhu — cómo elegir lentes según la forma de cara](https://www.buhu.cl/blogs/guias-y-consejos/como-elegir-lentes-segun-forma-de-cara), 2025-09-05 | Respalda rectangulares para Redondo, redondos/ovalados para Cuadrado, aviador/redondos para Corazón y redondos/cuadrados grandes para Oblongo. Sus prohibiciones de estilos no se trasladan a Lemoon. |
| I1 | [Warby Parker — Decoding Face Shapes](https://www.warbyparker.com/learn/decoding-face-shapes-finding-your-eyewear-match), actualización 2026-04-03 | Respalda rectangulares en Redondo, redondos/ovalados en Cuadrado, ovalados/aviador de base curva en Corazón y ovalados/ojo de gato en Diamante. Presenta Ovalado como abierto a muchos estilos. |
| I2 | [Eyebuydirect — frames and face shapes](https://www.eyebuydirect.com/guides/frames-and-face-shapes), sin fecha visible | Su tabla y desarrollo respaldan los cinco primeros pares. Para rostro rectangular recomienda monturas grandes, redondas o altas. Algunas listas finales no repiten exactamente los estilos del desarrollo; se cruzó el texto completo, sin tratar una lista como regla única. |
| I3 | [Zenni — glasses for face shape](https://www.zennioptical.com/glasses-for-face-shape), sin fecha visible, y [colección Oblong](https://www.zennioptical.com/b/glasses-for-oblong-face) | La guía distingue Oblong de Oval. La colección pide altura y amplitud visual y, en los productos devueltos —no solo en el listado de filtros—, incluye redondos y aviador. La colección Oval también se abrió: admite muchas formas. Las primeras solicitudes a Oblong/otras colecciones tuvieron timeout; Oblong se obtuvo después con URL terminada en `/`, que redirigió a la canónica. |
| I4 | [FramesDirect — face shape guide](https://www.framesdirect.com/knowledge-center/face-shape-guide), actualización 2026-10-12 | En Alargado recomienda aros altos y menciona rectangulares con detalles. Esto respalda un rectangular condicionado a proporción, no cualquier diseño bajo. También recuerda que las guías no son estrictas. |
| I5 | [BrightEyes — best sunglasses for oblong face](https://www.brighteyes.com.au/blog/best-sunglasses-for-oblong-face/), 2026-09-26 | Recomienda de forma explícita aviador con silueta de lágrima para Alargado, junto con opciones grandes/cuadradas. Es una guía de solares: respalda la elección de silueta, sin demostrar compatibilidad óptica o clínica. |
| F1 | [Maui Jim — Castles Product Bulletin](https://images.mauijim.com/product-bulletins/CastlesProductBulletin.pdf), catálogo FW24, ©2024 | Ficha primaria del fabricante: clasifica Castles como aviador/lágrima y lo asocia a Corazón, Oblongo y Ovalado. Es respaldo de un ejemplo concreto; no demuestra que todos los aviadores tengan las mismas proporciones ni prestaciones. No se trasladan sus afirmaciones técnicas a Lemoon. |

## Límites y mantenimiento

Las lecturas son fechadas: no se afirma disponibilidad actual de productos ni validación clínica. La revisión editorial independiente aprobó las sugerencias; el PDF Maui Jim no pudo reabrirse durante esa revisión y no se le atribuye verificación independiente. Los desacuerdos de estilo se mantienen explícitos.

Las seis combinaciones se comprobaron en el preview Shopify con datos que incluyen muestras. La evidencia utilizada por las pruebas está en [el fixture de catálogo](../../tests/fixtures/face-guide-catalogue-links.json); sus conteos no son copy ni stock garantizado. El recorrido alojado, la asignación CMS y la publicación se verifican aparte en la [guía de activación y QA](../qa/lem-103/README.md).
