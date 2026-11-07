# LEM-129 — Referencias internacionales para el modal de medidas

Consulta: **07-11-2026**. Revisión focal de Warby Parker, Zenni, EyeBuyDirect y Clearly del corpus de referencias existente, ampliada con la **PDP Zeelool favorita señalada expresamente por el usuario**. Esa preferencia es una referencia de diseño, no aprobación para implementar o copiar. GlassesUSA se añade como **suplemento mencionado en el ticket LEM-81**, no como ficha del corpus Google Doc. No es una revisión completa de las nueve referencias internacionales del documento. Este archivo reúne observaciones y una propuesta de selección; no aprueba el diseño ni modifica el modal.

## Método y límites

Se abrieron las fuentes oficiales indicadas abajo y se leyeron sus cuerpos. Para los recursos gráficos señalados como **inspeccionados**, se descargó la imagen o PDF del dominio oficial y se abrió visualmente. El intento inicial de este investigador con `iab` devolvió `The browser access host is unavailable`; las primeras cinco revisiones no certifican interacción de PDP. Para Zeelool, el coordinador sí inspeccionó posteriormente el modal en Chrome y cambió unidades; esa evidencia se atribuye separadamente. No se afirma QA móvil, teclado ni foco de los competidores.

Las imágenes de terceros son evidencia de investigación. No se incorporan al tema ni se propone copiar sus fotos, identidad o textos. Los rangos y reglas de talla pertenecen a cada tienda y no deben trasladarse a Lemoon sin definición propia.

## Fuentes e inventario observado

| Referencia oficial | Evidencia comprobada | Elementos gráficos y componentes |
| --- | --- | --- |
| **Warby Parker** — [Glasses measurements](https://www.warbyparker.com/learn/eyeglasses-measurements) | Artículo leído. | Jerarquía de secciones para cristal, puente, patilla, ancho total y alto; instrucciones para medir con regla y comparación con lentes actuales. Distingue los tres números inscritos de las dimensiones adicionales. |
| **Warby Parker** — [Frame fit guide, PDF](https://e.warbyparker.com/pdf/frame-fit-guide.pdf), páginas 2, 3 y 6 | PDF descargado y páginas renderizadas e inspeccionadas. Es un documento oficial disponible, no prueba de UI actual de PDP. | Cinco fotos frontales apiladas por anchura; foto de marco con zoom circular del código y líneas explicativas; captura de ejemplo con entrada «View measurements»; cuatro rostros dibujados con notas de calce. |
| **Zenni** — [DIY frame measurement guide](https://www.zennioptical.com/measure-eyeglass-frame-size-how-to) | Cuerpo leído; gráfico de patilla descargado e inspeccionado. | Serie de gráficos por dimensión, flechas de cota, breve instrucción bajo cada medida; vista lateral de patilla con línea quebrada que sigue sus dos tramos y referencia visual al tornillo. También enlaza herramientas PD y probador. |
| **Zenni** — [Frame sizing](https://www.zennioptical.com/help/frames-fitting/frame-sizing) y [Size tools & measurements](https://www.zennioptical.com/help/frames-fitting/size-tools-measurements) | Cuerpos leídos. No se operaron las herramientas descritas. | Código de tres números, listas de tallas para adultos/niños y explicación del filtro «Find My Size». La clasificación publicada utiliza ancho del cristal con ajustes; no es una escala universal. |
| **EyeBuyDirect** — [Frame measurements](https://www.eyebuydirect.com/guides/frame-measurements) | Cuerpo leído; imagen principal descargada e inspeccionada. | Foto de marco a 45°, acercamiento circular de la inscripción interior, números grandes y conectores punteados a cristal/puente/patilla. El artículo separa imágenes por medida y consejos; incluye ancho total y alto además del trío inscrito. |
| **Clearly** — [Glasses measurements and size chart](https://www.clearly.ca/thelook/glasses-measurements) | Cuerpo leído; foto de patilla descargada e inspeccionada. | Índice con enlaces internos, pasos numerados, tablas de tallas y sección de puente. La foto muestra la cara interior de la patilla y tres llamadas circulares que traducen sus números a nombres de medidas. Explicita que las medidas orientan y que el calce no es exacto. |
| **GlassesUSA** — [How to choose frame size](https://www.glassesusa.com/blog/how-to-choose-frame-size) | Artículo leído; imágenes no inspeccionadas. El enlace interno a `https://www.glassesusa.com/how-to-choose-frame-size` respondió 404. | Índice de contenidos, explicación del código, checklist de calce, enlace a video y FAQ. El artículo declara que sus imágenes fueron generadas con IA: no tratarlas como esquema mecánico validado ni evidencia de un SKU. |

### Recursos gráficos abiertos visualmente

- [Zenni — patilla lateral y cota en dos tramos](https://static.zennioptical.com/marketing/information/infographic/frame_infographic/How-to-measure-your-frame-3card-4-xs.png).
- [EyeBuyDirect — marco, zoom de inscripción y conectores](https://img.ebdcdn.com/image/upload/static/images/discover/tips/frame-measurements-size-new.jpg?q=85).
- [Clearly — interior de patilla y llamadas de medidas](https://www.clearly.ca/thelook/wp-content/uploads/2018/02/french-blog2-2.jpg).
- [Warby Parker — PDF oficial](https://e.warbyparker.com/pdf/frame-fit-guide.pdf): páginas 2 (anchos), 3 (código) y 6 (calce).

Copias de inspección fuera del repositorio: `/tmp/lem129-international-research/`. Su disponibilidad local puede ser temporal. Los enlaces anteriores son las fuentes reproducibles; no hay permiso de reutilización comercial inferido por descargarlas.

## Ampliación: Zeelool, referencia favorita del usuario

Fuente: [PDP Grover ZJGT078897-02](https://www.zeelool.com/goods-detail/ZJGT078897-02), abierta el 07-11-2026. La extracción independiente confirma talla Medium, código 52–20–145, ancho 130, alto 38.5 y peso 20.3 g. El coordinador abrió «Size Chart» en Chrome: diálogo centrado de una columna, encabezado/cierre X, fondo superpuesto y tres bloques continuos, sin pestañas. Inventario observado:

| Bloque | Gráficos y componentes observados |
| --- | --- |
| Clasificación | Tabla de cuatro anchos; en el modal: Narrow ≤128, Medium 128–132, Wide 132–136 y Extra Wide >136 mm. |
| Dimensiones del producto | Dibujos lineales frontal/lateral, flechas punteadas y cinco valores del SKU; control «Show in inches». El coordinador comprobó la conversión a 5.12/2.05/0.79/1.52/5.71 in; la tabla y el código permanecieron en mm. |
| Comparación con lentes propios | Tres filas con iconos pequeños, código repetido y número pertinente resaltado en violeta, más etiquetas; fotografía oblicua con rectángulo punteado sobre la inscripción interior. |

La apertura y conversión se atribuyen a la observación de escritorio del coordinador, no al extractor: abrió la URL anterior, pulsó «Size Chart» e inspeccionó la captura de CUA titulada «Inspeccionar composición gráfica del modal Zeelool» el 07-11-2026. Esa captura se mostró en la conversación; no se afirma un archivo de imagen guardado. No se certificaron cierre/Escape, foco ni móvil.

### Activos oficiales inspeccionados independientemente

- [Plantilla frontal](https://s3.zeelool.com/zeelool-next/goods-detail/glass_front_1.png) y [lateral](https://s3.zeelool.com/zeelool-next/goods-detail/glass_backend_1.png): dibujos genéricos, flechas y espacios vacíos para superponer cifras. No son fotos del SKU ni contienen por sí solos sus medidas. La frontal incluye tornillos como referencia de los extremos.
- [Foto de inscripción interior](https://s3.zeelool.com/admin/shop/home/0d3cca84e574d09e251820a366dde0bc.png): marco a 45° y encuadre punteado de la zona numérica; recurso de la [guía de ajuste](https://www.zeelool.com/fitguide), que también separa código, categorías y herramientas adicionales.
- [Guía de medidas](https://www.zeelool.com/guide-tips/frame-size): define ancho de bisagra a bisagra, instrucción breve por dimensión y tabla 125–128/129–132/133–136/137–140 mm. Sus intervalos escritos difieren de los límites visibles en el modal: registrar esa diferencia, no combinar ni adoptar ambos como contrato Lemoon. Se inspeccionaron sus [gráfico de ancho](https://s3.zeelool.com/zeelool-next/static-page/guide-tips/size01.jpg) y [gráfico de patilla](https://s3.zeelool.com/zeelool-next/static-page/guide-tips/size05.jpg).

Copias locales: `/tmp/lem129-international-research/zeelool/{front,back,code}.png` y `guide-{width,temple}.jpg`.

### Dependencias para adaptar el patrón, no sus datos

- Cinco medidas reales, unidad y convención física homogénea para colocar cifras junto a cotas. El dibujo genérico facilita reutilización sin inventar fotografía de producto.
- Una tabla S/M/L requiere categorías y límites propios del catálogo; la favorita no autoriza importar sus umbrales.
- El código ilustrativo debe rotularse como ejemplo si no reproduce una inscripción comprobada del producto. Resaltar un número por fila permite explicar su significado sin tooltip.
- Una conversión de unidades debe cambiar solo presentación y conservar mm como dato base; clasificaciones/código pueden mantener unidad explícita para no aparentar otra escala.
- Datos externos como Bridge Fit, Rim, Spring Hinge, Adjustable Nosepads o rangos RX/PD de la PDP no forman parte necesaria de esta guía. No inferirlos para Lemoon ni añadirlos sin datos y contrato propios.
- El patrón de tres bloques continuos es candidato preferente para la siguiente propuesta del modal, dado el favorito indicado; requiere revisión propia antes de cambiar el comportamiento existente.

## Selección propuesta para un modal de PDP Lemoon

Esta sección es **recomendación**, no descripción de funciones observadas en Lemoon ni decisión aprobada.

| Elemento | Prioridad para el modal | Adaptación propuesta |
| --- | --- | --- |
| Esquema frontal con cotas de ancho total, cristal, puente y alto | **Usar** | Un dibujo propio, legible, sin escala, con correspondencia directa entre cota, nombre y valor real del producto. La descomposición por dimensión aparece en las guías; evitar una lámina densa con todo el texto incrustado. |
| Vista lateral de patilla con cota que sigue su quiebre | **Usar** | Inspirarse en la claridad de Zenni; mostrar que la longitud incluye la parte que se curva hacia la oreja. No dibujar una cota recta ambigua que parezca medir una proyección. |
| Lista compacta de medidas del producto en mm | **Usar** | Mantener nombres y cifras como texto HTML, junto al esquema. Los valores del ejemplo educativo nunca sustituyen medidas ausentes del SKU. |
| Ejemplo de inscripción interior con tres llamadas | **Usar** | Ilustración propia tipo `52 □ 18–145`, rotulada inequívocamente como ejemplo educativo. Bajo ella: cristal, puente y patilla; ejemplo separado de las medidas reales del producto. Patrón común de los cuatro referentes con imagen inspeccionada. |
| Instrucción para comparar con lentes cómodos actuales | **Usar** | Dos o tres pasos cortos: localizar inscripción, identificar cada número, comparar con la ficha. Si no hay inscripción, orientar a medir con una regla en mm. |
| Ayuda breve por dimensión | **Usar** | Una frase visible asociada a cada cota; no depender exclusivamente de tooltip/hover. |
| Rostros ilustrados con comprobaciones de comodidad | **Opcional** | Dos o tres ilustraciones propias, secundarias a las medidas. La lámina Warby confirma el recurso gráfico, no una regla universal ni una promesa de calce. Evitar recomendaciones clínicas o de compatibilidad. |
| Tabla XS–XL y comparación de cinco anchos | **No usar por ahora** | Las marcas clasifican con criterios distintos. Solo incorporarla con umbrales Lemoon documentados y correspondencia real con catálogo; no mezclar tablas externas. |
| Índice editorial largo, varias tablas y FAQ extensa | **Fuera del modal** | El artículo Clearly y el PDF Warby son formatos de lectura larga. Condensar el modal y ofrecer una guía completa propia cuando su destino esté validado; LEM-105 es entregable separado. |
| Video demostrativo | **Opcional posterior** | Puede complementar una guía larga; no debe ser necesario para entender la medida ni añadir carga inicial al modal. No copiar el video externo. |
| PD, escaneo facial, calculadora y probador virtual | **Fuera de este alcance** | Aparecen como herramientas o enlaces en las referencias, pero resolverlos no es necesario para explicar las dimensiones del marco. No mezclar tamaño del armazón con captura de receta ni inferir calce universal. |
| Conversión mm/in | **Conservar si aporta** | Zeelool fue observado por el coordinador cambiando las cinco cotas; tabla/código mantuvieron mm. Unidad siempre explícita y conversión local, sin alterar datos base. |
| Pestañas y acordeones | **Decidir por legibilidad** | No se certificaron estos controles en las primeras referencias. El modal favorito Zeelool usa tres bloques continuos sin tabs; esa organización es ahora candidata preferente, no una implementación aprobada. |

## Composición mínima recomendada

1. Identidad del producto y encabezado «Guía de medidas».
2. **Medidas de este marco:** frontal + lateral, leyenda y cifras reales en mm, con estado claro para datos faltantes.
3. **Compara con tus lentes:** inscripción interior ilustrada y tres pasos cortos.
4. Ayuda secundaria de calce o enlace a la guía completa, solo si aporta y el destino existe.

La investigación inicial podía reutilizar la arquitectura de tabs existente para introducir recursos gráficos. Tras añadir la favorita Zeelool, se recomienda presentar una propuesta con bloques continuos —clasificación solo si tiene contrato propio, medidas del producto y comparación— para su revisión. Priorizar medidas antes que estilo/forma de rostro; el modal debe ayudar a comparar este producto y permitir volver al mismo punto de la PDP.

## Decisiones que requieren definición propia

- Unificar qué significa **ancho total**: las fuentes no usan siempre el mismo extremo (bisagra a bisagra frente a extremo exterior a extremo exterior). El SVG, nombre del metafield y dato medido de Lemoon deben describir la misma magnitud.
- No calcular ancho total mediante `2 × cristal + puente`: el borde y las piezas laterales varían. Mostrar el valor registrado o su ausencia.
- Mantener un vocabulario consistente de patilla/varilla/brazo; la ilustración debe nombrar lo que se mide.
- El código ilustrativo debe distinguirse de números reales, y las clasificaciones de talla requieren contrato del catálogo antes de convertirse en recomendación automática.

No se realizaron cambios de theme, catálogo, Linear ni publicación. La observación visual cubre recursos gráficos concretos y, para Zeelool, apertura y conversión de unidades en escritorio atribuidas al coordinador; el resto del comportamiento de modales extranjeros no está verificado.
