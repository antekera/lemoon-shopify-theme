# Guía de tallas — referencias y selección para el modal PDP

Fecha de consulta: 07-11-2026. Propuesta para decidir con Miguel; no es diseño aprobado ni modificación del modal de LEM-129.

Actualización solicitada por Miguel: incorporar [Zeelool Grover ZJGT078897-02](https://www.zeelool.com/goods-detail/ZJGT078897-02), «me gusta». Se registra como referencia preferida de composición; esto no constituye aprobación de una implementación nueva.

Datos contrastados después de esta investigación: [auditoría de Shopify y soporte de carga](2026-11-07-size-guide-data-audit.md). Las cinco medidas numéricas solo están cargadas en Dalton Prototipo; las imágenes de las 21 afinidades de estilo están vacías y no existe un metaobject específico de guía de tallas. Esta disponibilidad limita qué puede presentarse como dato de producto.

## Corpus y evidencia

Se retomó el [benchmark existente LEM-81](https://docs.google.com/document/d/1OEcTYdpm2UzMueDgMB6QGI_ubU_pDLQV1cOSGBjMdtY/edit), leído nuevamente mediante Google Drive. Sus observaciones históricas no se tratan como estado actual de las tiendas. Para esta revisión se seleccionaron referencias con guías o componentes de medidas localizables; no se pretende haber inspeccionado exhaustivamente sus 24 perfiles.

Referencias chilenas inspeccionadas en navegador Chrome: Bonoboss Valencia, Lens.cl Guía de tallas y Ben & Frank Chile Kramer. Para Karün se leyó su FAQ; su apertura real de guía no quedó comprobada. Las referencias extranjeras y su grado de evidencia se detallan en [la investigación internacional](2026-11-07-size-guide-international-research.md).

Zeelool se inspeccionó también en Chrome: apertura real de Size Chart, captura del modal y conversión de unidades. La revisión interactiva corresponde a escritorio; no se verificaron en Zeelool móvil, Escape, trap de foco ni lector de pantalla.

## Referencias chilenas: qué se observó

| Referencia | Superficie y elementos observados | Qué aporta al modal Lemoon |
| --- | --- | --- |
| [Bonoboss — Valencia](https://bonoboss.cl/products/valencia-optico) | En la PDP actual, botón de medidas que expande un acordeón inline; resumen lente/puente y ancho total, frontal con cotas y valores, lista de cinco medidas y texto para comparar con unos lentes actuales. Se abrió el control y se inspeccionó la pantalla. | Priorizar medidas del producto y una explicación breve. No copiar el acordeón: Lemoon requiere modal. El extractor web reflejaba otra variante de UI; para el tipo de apertura prevalece el navegador observado. |
| [Lens.cl — Guía de tallas](https://lens.cl/pages/guia-de-tallas) | Página completa con accesos Talla/Ajuste/Puente; dibujo interior de bisagra a bisagra, tabla por rangos, ampliación del código de patilla, tres fotografías de ajuste estrecho/regular/ancho y dibujo comparativo puente fijo/plaquetas. Imágenes inspeccionadas en pantalla. | Tomar la separación de conceptos y el zoom del código. La página completa es demasiado larga para trasladarla íntegra al modal. |
| [Ben & Frank Chile — Kramer](https://www.benandfrank.cl/shop/product/clip-on/clip-onkramer) | El enlace Guía de tallas abre un overlay con cierre; armazón en perspectiva con referencias 1/2/3, leyenda, círculos que amplían números de la patilla y tabla de tallas según ancho del cristal. Apertura y gráfico verificados visualmente. | Es la referencia chilena más directa para enseñar dentro de un modal. Se inspeccionó desde un accesorio clip-on; la guía del armazón no convierte las dimensiones del accesorio en medidas de un marco. |
| [Karün — FAQ](https://www.anteojoskarun.cl/pages/preguntas-frecuentes-1) | El texto describe una guía de tamaños accesible desde cada producto. No se verificó su diálogo actual ni sus gráficos. | Confirma el contexto por producto como referencia editorial, pero no sustenta copiar un layout ni afirmar cómo se abre actualmente. |

## Inventario para seleccionar

Referencias internacionales que sustentan los patrones gráficos (detalle y límites en el informe enlazado):

| Referencia | Gráfico o bloque comprobado | Aplicación propuesta |
| --- | --- | --- |
| [Warby Parker — medidas](https://www.warbyparker.com/learn/eyeglasses-measurements) y [PDF de ajuste](https://e.warbyparker.com/pdf/frame-fit-guide.pdf) | Artículo de dimensiones; PDF oficial con cinco anchos, ampliación de código y cuatro rostros de comprobación de ajuste. El PDF no acredita su PDP actual. | Separar medidas y comodidad; conservar las cifras reales y una ayuda corta. |
| [Zenni — medición](https://www.zennioptical.com/measure-eyeglass-frame-size-how-to) | Gráfico lateral con cota quebrada que sigue los tramos de la patilla, inspeccionado visualmente. | Mejorar la precisión didáctica de la cota lateral. |
| [EyeBuyDirect — medidas](https://www.eyebuydirect.com/guides/frame-measurements) | Imagen de armazón en perspectiva con zoom circular del código y conectores hacia las tres dimensiones, inspeccionada visualmente. | Inspiración principal para G3, con dibujo y labels originales. |
| [Clearly — medidas](https://www.clearly.ca/thelook/glasses-measurements) | Foto interior de patilla con tres llamadas circulares; artículo con pasos y tablas. | Traducir cada número a un nombre mediante llamadas visuales, sin trasladar la tabla. |
| [Zeelool — Grover / Size Chart](https://www.zeelool.com/goods-detail/ZJGT078897-02) | Modal real en una columna: tabla por ancho, Product Dimensions con frontal/lateral y cinco valores, conversión mm/in y explicación visual del código en tres filas. Apertura, captura y conversión comprobadas en Chrome. | Referencia principal de composición preferida por Miguel: dos bloques esenciales de medidas reales y comparación con lentes propios; tabla solo con un contrato propio de tallas. |

Zeelool es el modal extranjero comprobado interactivamente; en los demás referentes se verificaron artículos y recursos gráficos. GlassesUSA queda como referencia suplementaria de contenido, no como fuente de gráficos aprobados. No se adoptan tablas de tallas ni umbrales ajenos.

### Qué se incorpora de Zeelool al estudio

1. **Jerarquía continua:** título/cierre, tabla, medidas y ayuda en una sola columna; no hay pestañas dentro de Size Chart. Permite leer la explicación inmediatamente después del dato.
2. **Dibujos genéricos y datos separados:** frontal y lateral lineales, flechas punteadas y cifras superpuestas como texto. Los assets oficiales son esquemas sin medidas propias, no fotografías del SKU.
3. **Conversión discreta:** enlace Show in inches junto a Product Dimensions. Se operó: convierte las cinco cifras a pulgadas; la tabla superior y la inscripción didáctica conservan mm. No afirmar conversión global de todo el modal.
4. **Tres filas educativas:** icono de cristal/puente/patilla + código repetido `52 □ 20–145`, destacando en cada fila un segmento en violeta + nombre de la medida. Una foto de armazón en perspectiva señala dónde mirar la inscripción interior. Para Lemoon se proponen dibujos originales y vocabulario es-CL.
5. **Tabla como complemento, no sustituto:** su modal clasifica Narrow/Medium/Wide/Extra Wide por ancho. La guía editorial del mismo sitio publica rangos con extremos distintos; no se importan ni concilian automáticamente. Lemoon no tiene una regla equivalente aprobada.

Los valores 130/52/20/38.5/145 mm pertenecen a la referencia Zeelool. No se usan como ejemplos de un producto Lemoon. Los atributos externos de puente universal, plaquetas, bisagra y rangos de receta/DP tampoco se incorporan: la auditoría local no encontró campos equivalentes suficientes para esa presentación.

«Conservar» refiere a código presente en esta rama, no a publicación Shopify. «Añadir» y «condicional» son propuestas pendientes de elección.

| ID | Elemento gráfico o componente | Selección propuesta | Aplicación concreta y condición |
| --- | --- | --- | --- |
| G1 | Frontal del armazón con líneas de cota | Conservar y refinar | Ancho total, ancho/alto del cristal y puente; A–D coinciden con valores legibles fuera del dibujo. Sin escala ni representación de un SKU. |
| G2 | Vista lateral con cota de patilla | Conservar y refinar | Referencia E. Aclarar inicio/fin de medición y recorrido de la patilla; evitar que una línea horizontal ambigua parezca una medida distinta. |
| G3 | Patilla con código ampliado y tres llamadas | Añadir, prioridad alta | Enseñar a leer cristal / puente / patilla. Variante preferida tras Zeelool: tres filas con miniicono, el mismo código y un segmento destacado por fila. Dibujar una ilustración propia; cualquier número didáctico se identifica como ejemplo y se separa de las medidas del producto. |
| G4 | Diagrama con regla para comparar lentes actuales | Añadir, prioridad alta | Una instrucción breve: comparar el mismo tramo y la misma medida. No mezclar ancho total exterior con distancia interior de bisagra a bisagra. |
| G5 | Tres caras o ilustraciones de ajuste | Condicional, segunda etapa | Ayuda a entender cobertura y presión; no diagnostica talla por forma de rostro. Requiere ilustración original y texto revisado. |
| G6 | Dibujo de puente y plaquetas | Condicional | Mostrar únicamente si el catálogo identifica ese atributo. No atribuir puente alto/bajo ni ajuste universal por la apariencia de una foto. |
| G7 | Fotografías de personas con el modelo real | Fuera de esta iteración | Dependencia de fotos reales y permisos; una escena genérica no acredita tamaño ni calce del SKU. |
| C1 | Título y contexto del producto | Conservar; valorar nombre del modelo | La persona sabe qué armazón está comparando y puede regresar a la PDP sin perder su elección. |
| C2 | Lista o rejilla de medidas en mm | Conservar, prioridad principal | Mostrar solo medidas reales disponibles, con labels persistentes. No incrustar datos exclusivamente en una imagen. |
| C3 | Bloque «Cómo leer tus lentes» | Añadir, prioridad alta | Agrupar G3 y G4 sin desplegar toda la guía larga de LEM-105. |
| C4 | Pestañas o acordeones temáticos | Conservar el motor; priorizar bloques continuos | Zeelool refuerza situar medidas y ayuda en el mismo recorrido, sin otra pestaña anidada. Las tres pestañas existentes no se eliminan en esta investigación; su composición final queda por elegir. |
| C5 | Tabla S/M/L o rangos equivalentes | Posponer | Las marcas comparadas usan criterios diferentes. Requiere una regla propia aprobada y datos homogéneos; no derivar talla sumando medidas ni copiar umbrales ajenos. |
| C6 | Selector mm/pulgadas | Conservar como secundario | mm por defecto; Zeelool muestra un control discreto junto al título de medidas. Mantener label, teclado y estado claros aunque se elija una presentación más compacta. |
| C7 | Checklist corto de ajuste | Condicional, compacto | Complementa las medidas; evita garantía de calce perfecto. Su copy final necesita revisión editorial. |
| C8 | Estado sin datos o datos parciales | Conservar | Ausencias explícitas, sin cifras de demostración ni talla inventada. |
| C9 | Cierre visible, Escape, foco y scroll interno | Conservar | Reutilizar el diálogo y las pruebas existentes; no crear otro motor de modales. |
| C10 | Enlace a guía completa | Condicional | Solo si LEM-105 entrega una página válida y publicada; la orientación esencial queda en el modal. |
| C11 | Video, probador virtual, medición con cámara o tarjeta | Fuera del modal inicial | Añaden pasos, peso o dependencias; no son necesarios para consultar medidas. No activar cámara ni ofrecer una medición automática inexistente. |

## Selección recomendada para la primera versión

Conservar G1/G2 y C1/C2/C6/C8/C9; añadir G3/G4 y C3. Esto produce dos recursos nuevos: **una ilustración original del código de patilla con tres segmentos destacados** y **una ilustración original de comparación con regla**. Zeelool pasa a ser la referencia principal de composición para estos bloques; EyeBuyDirect/Clearly aportan detalle del zoom y Lens.cl la separación de magnitudes. La prioridad es explicar cómo comparar las medidas del producto con unos lentes propios, no ampliar la cantidad de pestañas. Para empezar, recomiendo mantener las pestañas actuales y colocar la ayuda breve en Medidas; no copiar la tabla Zeelool sin criterios Lemoon.

Orden de lectura propuesto dentro del shell actual:

1. Título/contexto del armazón.
2. Medidas del producto: frontal/lateral y valores en mm.
3. Ayuda breve para encontrar el código y comparar la misma medida.
4. Ajuste disponible del producto, con límites claros; sin equivalencias universales S/M/L.
5. Enlace opcional a la guía completa.

El aspecto sigue `DESIGN.md`: Urbanist/Hanken, navy, blanco y panel cálido; gráficos vectoriales propios y texto HTML. Se toman patrones de información, no imágenes, textos ni identidad de otras marcas.

## Diferencia respecto del modal ya preparado

`snippets/lemoon-frame-dimensions.liquid` ya contiene frontal/lateral A–E, lista con medidas positivas y selector de unidades. `snippets/lemoon-size-guide-content.liquid` tiene tres pestañas, instrucciones y vacíos localizados. La siguiente decisión es incorporar los dos recursos didácticos y definir si «Cómo comparar» merece pestaña o un bloque breve en Medidas. Este informe no cambia esos archivos, el contrato de datos, el catálogo ni el PR existente.

## Pendientes de decisión

- Elegir los componentes del inventario que se incorporan al modal.
- Acordar si la ayuda G3/G4 queda en Medidas o en una pestaña «Cómo comparar».
- Confirmar el significado de `frame_width` para los productos antes de enseñar una medición concreta: ancho exterior total y distancia entre bisagras no son intercambiables.
- Crear ilustraciones originales y revisar copy únicamente después de elegir la composición; los ejemplos de competidores no son recursos licenciados de Lemoon.
