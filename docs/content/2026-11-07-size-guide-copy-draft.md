# Copy propuesto — modal PDP y guía de medidas

Fecha: 07-11-2026. Preparación de LEM-129 y LEM-105. **Borrador para revisión de Miguel e integración posterior; no aprobado ni publicado.** Zeelool es la referencia principal de composición, con redacción e ilustraciones originales de Lemoon.

Los bloques entre comillas son copy visible propuesto. Las condiciones de integración y las notas de fuentes no forman parte del texto público. El responsable de implementación asignará los campos editables conforme al spec; este archivo no modifica locales, secciones, datos ni páginas de Shopify.

## Vocabulario compartido

Usar **armazón**, **cristal**, **puente** y **patilla** en ambas superficies. En la página se explica una sola vez que patilla también se llama varilla. Mostrar milímetros como `mm` y pulgadas como `in`; los nombres de unidades permanecen completos en el control.

### Definiciones breves de las cinco medidas

| Medida / clave del dato | Label visible | Ayuda breve propuesta |
| --- | --- | --- |
| `frame_width` | Ancho total | De un extremo exterior del frente del armazón al otro. |
| `lens_width` | Ancho del cristal | Ancho horizontal de un cristal en su parte más ancha. |
| `bridge` | Puente | Distancia más corta entre los dos cristales, en la zona del puente. |
| `lens_height` | Alto del cristal | Altura vertical de un cristal en su parte más alta. |
| `temple` | Largo de patilla | Desde la bisagra hasta el extremo de la patilla, siguiendo su recorrido. |

**Condición del contrato, no copy público:** la primera definición fija una convención exterior para la propuesta. Antes de integrar/publicar, confirmar que los valores de `frame_dimensions.frame_width` usan esos mismos extremos. No renombrar como ancho total una medición entre bisagras. Si no se acredita la convención de un producto, no mostrar ese valor como si estuviera verificado.

## 1. Modal de la PDP

### M1 — Encabezado y contexto

- Título: **«Guía de medidas»**.
- Contexto bajo el título: nombre real del producto, sin añadir claims.
- Botón de cierre, label accesible: **«Cerrar guía de medidas»**.

### M2 — Medidas del producto

Título de bloque:

> Medidas de este armazón

Texto breve:

> Compáralas con unos lentes que te resulten cómodos. Revisa la misma medida en ambos armazones.

Usar los cinco labels compartidos junto a sus valores reales disponibles. No inventar cifras, no calcular el ancho total desde otras medidas y no convertir la talla textual en medidas.

Pie del esquema:

> Esquema de referencia, sin escala.

Control de unidades, label persistente:

> Unidad de medida

Opciones: **«Milímetros»** / **«Pulgadas»**. Si se elige un botón de alternancia en vez del selector, usar **«Ver en pulgadas»** / **«Ver en milímetros»**, con estado y unidad resultante legibles. La decisión de control pertenece al spec; no presentar ambos a la vez.

### M3 — Cómo leer el código

Título de bloque:

> Compara con tus lentes

Texto:

> Mira la cara interior de una patilla. Si encuentras tres números, pueden indicar el ancho del cristal, el puente y el largo de la patilla, en ese orden y en milímetros.

Código educativo, siempre separado de las medidas del producto:

> Ejemplo: 52 □ 18–145

Tres filas, destacando un segmento por fila y manteniendo el nombre en texto:

| Segmento destacado | Label visible | Explicación visible |
| --- | --- | --- |
| **52** □ 18–145 | Ancho del cristal | 52 mm de ancho para un cristal. |
| 52 □ **18**–145 | Puente | 18 mm de separación entre los cristales. |
| 52 □ 18–**145** | Largo de patilla | 145 mm desde la bisagra hasta el extremo de la patilla. |

Nota inmediata bajo el ejemplo:

> Ejemplo educativo. No representa las medidas de un producto específico.

Texto complementario:

> ¿No ves el código? Usa una regla en milímetros para comparar tu armazón. El ancho de un cristal y el ancho total son medidas distintas.

### M4 — Límite de la comparación

> Las medidas ayudan a comparar. La forma del puente y de las patillas también influye en cómo se sienten dos armazones.

No añadir una garantía de calce, una equivalencia S/M/L ni una recomendación automática por forma del rostro.

### M5 — Enlaces secundarios

- **«Cómo medir tus lentes»** → mostrar solo cuando `/pages/como-medir-tus-lentes` sea un destino válido/publicado con la plantilla y el contenido correctos.
- **«Consultar una medida»** → mostrar solo cuando el destino de ayuda confirmado sea accesible. Reutilizar el destino de contacto validado; no inventar teléfono, WhatsApp, horarios o tiempos de respuesta.

### M6 — Ausencia de datos

Si no existe ninguna medida numérica válida:

> Las medidas de este armazón aún no están disponibles.

Conservar el bloque didáctico M3, identificado como ejemplo, y la ayuda condicionada de M5. No mostrar un selector de unidades sin medidas ni poner valores educativos en las cotas de producto.

Si hay medidas parciales:

> Se muestran las medidas disponibles de este armazón.

Mostrar esta nota solo cuando el producto tenga al menos una de las cinco medidas y falte otra. Las cotas ausentes se omiten; no se completan con ceros, guiones que parezcan cifras ni medidas de un modelo distinto.

## 2. Página `/pages/como-medir-tus-lentes`

### P1 — Título, intro y metadata

H1:

> Cómo medir tus lentes

Introducción:

> Parte con unos lentes que te resulten cómodos. Aprende a leer el código de la patilla y a comparar sus medidas con las del armazón que estás mirando.

Título SEO propuesto:

> Cómo medir tus lentes: guía de medidas | Lemoon

Descripción SEO propuesta:

> Aprende a leer el código de la patilla y a comparar ancho, puente, alto y largo con las medidas de cada armazón Lemoon.

### P2 — Esquema y medidas

H2:

> Conoce las medidas del armazón

Texto:

> Las medidas se expresan en milímetros. Un mismo armazón puede tener datos de ancho total, ancho y alto del cristal, puente y largo de patilla. Cada uno describe una parte distinta.

Reutilizar las cinco definiciones compartidas y un esquema frontal/lateral sin valores de producto. No seleccionar un SKU como ejemplo implícito.

Pie:

> Esquema educativo, sin escala. No representa un producto específico.

### P3 — Paso 1: código de patilla

H2:

> 1. Revisa la patilla

Texto:

> Busca los números impresos en la cara interior de una patilla, también llamada varilla. En algunos armazones aparecen tres medidas: ancho del cristal, puente y largo de patilla. Otros números o letras pueden identificar el modelo o el color.

Usar el mismo ejemplo y las mismas tres filas de M3. Usar la misma nota del ejemplo compartida con el modal:

> Ejemplo educativo. No representa las medidas de un producto específico.

### P4 — Paso 2: comparación con regla

H2:

> 2. Compara las mismas medidas

Texto:

> Si no encuentras el código, usa una regla en milímetros para tomar una referencia. Mira el armazón de frente para comparar su ancho y el de cada cristal. Mide el ancho total de un extremo exterior del frente al otro: no es la distancia entre las bisagras.

Texto de apoyo al lateral:

> Para el largo de la patilla, considera el recorrido desde la bisagra hasta el extremo, incluida la parte que se curva hacia la oreja. No la dobles ni la endereces para medirla.

Nota:

> No calcules el ancho total sumando dos cristales y el puente: el borde y los extremos del marco también ocupan espacio.

La ilustración original de comparación con regla debe usar los mismos extremos que el texto. No sugerir que medir un objeto en la pantalla permite obtener sus dimensiones reales.

### P5 — Paso 3: ficha del producto y comodidad

H2:

> 3. Revisa la guía del modelo

Texto:

> En la ficha del armazón, abre «Guía de medidas» y compara cada dato con el de tus lentes. Usa las medidas que estén disponibles para ese modelo. Una talla escrita, como pequeño o mediano, no reemplaza las cifras en milímetros.

Texto de cierre:

> Dos armazones con medidas parecidas pueden sentirse distintos por la forma del puente y de las patillas. Toma la comparación como una referencia y, si te falta un dato, consulta antes de elegir.

### P6 — Ayuda y regreso al catálogo

H2:

> ¿Te falta una medida?

Texto:

> Revisa la ficha del modelo. Si falta el dato que necesitas para compararlo, puedes consultarlo antes de elegir.

CTA de ayuda: **«Consultar una medida»**, sujeto a destino de contacto validado.

CTA de catálogo: **«Ver catálogo»**, usando la ruta del catálogo validada. No enlazar a un producto arbitrario ni prometer una recomendación personalizada inexistente.

## 3. Textos accesibles para los recursos compartidos

| Recurso | Texto propuesto | Condición |
| --- | --- | --- |
| Esquema frontal/lateral de producto | «Esquema de las medidas del armazón, vistas frontal y lateral, sin escala.» | La lista HTML contiene los valores reales. Si el SVG se marca decorativo por duplicación, mantener esa información disponible en el texto adyacente. |
| Ilustración de código | «Ejemplo de código de patilla: 52 corresponde al ancho del cristal, 18 al puente y 145 al largo de patilla, en milímetros.» | No repetirlo en alt y texto íntegro si produce lectura duplicada; el contenido esencial siempre permanece como HTML. |
| Comparación con regla | «Regla alineada con los extremos exteriores del frente de un armazón.» | Solo si la ilustración final muestra exactamente esa disposición. Revisar el texto accesible contra el recurso final. |

## 4. Notas de fuentes y revisión

### Investigación reutilizada

Se reutiliza la investigación del 07-11-2026 ya abierta y documentada por el coordinador, sin presentarla como una segunda inspección visual independiente de este copywriter:

| Fuente | Qué se toma | Qué no se traslada |
| --- | --- | --- |
| [Bonoboss — Valencia](https://bonoboss.cl/products/valencia-optico) | Medidas junto al producto y orientación breve de comparación. Navegador y captura documentados en el estudio. | Sus cifras, promociones, garantías, rango de anchos ni interfaz de acordeón como obligación de diseño. |
| [Lens.cl — Guía de tallas](https://lens.cl/pages/guia-de-tallas) | Separar medidas, código y ajuste. Diferenciar la medición entre bisagras de otros anchos. | Su tabla de tallas, tolerancia ±4 mm ni claims de ajuste universal. |
| [Ben & Frank Chile — Kramer](https://www.benandfrank.cl/shop/product/clip-on/clip-onkramer) | Explicación secuencial del código mediante tres referencias visuales dentro del modal. | Sus textos, tabla de tallas ni medidas del accesorio como si fueran de un armazón. |
| [Zeelool — Grover](https://www.zeelool.com/goods-detail/ZJGT078897-02) | Referencia principal elegida por Miguel: bloques continuos, esquema de medidas y tres segmentos destacados del código. Extractor oficial reabierto por este copywriter el 07-11-2026; interacción visual atribuida al estudio previo. | Tabla de rangos, valores de producto, foto, identidad, promesas de calce ni características de puente/plaquetas. |

Documentos de respaldo: [inventario de referentes](2026-11-07-size-guide-modal-research.md), [detalle internacional](2026-11-07-size-guide-international-research.md) y [auditoría de datos](2026-11-07-size-guide-data-audit.md).

### Hechos de Lemoon y límites

- La auditoría de datos registra soporte de las cinco medidas en `custom.frame_dimensions`, pero solo el prototipo Dalton tiene valores cargados en la lectura del 07-11-2026. El copy no los replica ni los convierte en un ejemplo de catálogo definitivo.
- `custom.frame_size` es texto; no se usa para inferir el ancho total ni completar las cinco cotas.
- La página y el modal actuales ya tienen orientación breve y fallback localizado. Este borrador los amplía de forma acotada; no incorpora receta, DP, escaneo facial, probador ni tratamiento clínico.
- Se intentó abrir `https://lemoon.cl/pages/como-medir-tus-lentes` el 07-11-2026; el extractor no pudo acceder. No se acredita contenido publicado actual ni asignación de plantilla. El código local usa la ruta de contacto `/pages/contact`; la implementación debe comprobar su destino antes de exponer el enlace.
- No se redactan condiciones legales/comerciales nuevas; no hay afirmaciones de precios, stock, plazos, beneficios, disponibilidad de atención o resultados médicos.

### Revisión pendiente antes de integración

1. Miguel revisa esta redacción y la composición propuesta.
2. Conciliar la convención del ancho total con la fuente del catálogo; los textos P4 y la definición compartida dependen de ello.
3. Revisar las ilustraciones originales terminadas contra sus labels, cifras educativas y textos accesibles.
4. Verificar los destinos publicados de guía, contacto y catálogo; no dejar enlaces vacíos, provisionales o con `preview_theme_id` en contenido final.
5. Integrar el copy en los campos editables acordados y las locales necesarias; completar QA de ambas superficies. Un archivo de copy no equivale a página lista para producción.
