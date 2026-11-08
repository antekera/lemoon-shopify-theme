# Cómo medir tus lentes — investigación de contenido

Consulta: **08-11-2026**. LEM-105; base local `45bafbaae0187755c91042f401b18acbb19b489e`. Investigación de solo lectura y redacción original para desarrollar la página existente. No modifica el tema, datos Shopify, estados, PR ni publicación.

## Brief y límites

El usuario pidió desarrollar el contenido de la página de medida de lentes. La composición existente tiene tres pasos, ocho campos editoriales y cinco definiciones A–E. El texto debe permitir leer la inscripción, tomar referencias sobre un armazón real y compararlas con las cifras disponibles de la ficha, sin clasificar automáticamente tallas ni prometer comodidad equivalente.

La guía no añade DP, receta, diagnóstico, ajuste doméstico, probador, tabla S/M/L, tolerancia universal, garantías, precio, plazo de respuesta o canal comercial nuevo. No formula afirmaciones legales: investigación de derecho no aplica a este delta educativo.

## Referencias chilenas abiertas y leídas

Se abrieron cuatro tiendas chilenas. Lens y Bonoboss aportan contenido directo de medidas; Karün aporta una respuesta sobre el acceso por producto; Ben & Frank aporta una PDP con un dato identificado y su contexto, con el límite de extracción indicado. No se afirma haber operado sus controles ni inspeccionado nuevos gráficos en navegador.

| Fuente exacta | Contenido comprobado el 08-11-2026 | Uso editorial y exclusiones |
| --- | --- | --- |
| [Lens.cl — Guía de tallas](https://lens.cl/pages/guia-de-tallas) | Secciones de talla, ajuste y puente; medición entre centros de bisagras; código interior y sus magnitudes. | Separar magnitudes y explicar que las referencias deben usar los mismos extremos. No trasladar rangos, tolerancia, ajustes universales ni afirmaciones comerciales. |
| [Bonoboss — Valencia óptico](https://bonoboss.cl/products/valencia-optico) | Bloque de cinco dimensiones, distinción ancho total/cristal y orientación para comparar con lentes propios o inscripción. | Vincular cada número con una parte y con la ficha del modelo. No importar sus medidas, límites de catálogo, nombres, precios o condiciones. |
| [Karün Chile — Preguntas frecuentes](https://www.anteojoskarun.cl/pages/preguntas-frecuentes-1) | La respuesta sobre medidas de marcos remite a una guía específica en la página del producto. | Reforzar el paso de volver a la ficha del modelo. El texto no acredita el funcionamiento actual del diálogo ni un método físico de medición. |
| [Ben & Frank Chile — Linda óptico](https://www.benandfrank.cl/shop/product/optical/lindaoptico?variant=LNDABF-PLXX) | El extractor muestra ancho de cristal identificado en mm dentro de los atributos de producto. | Mantener nombres/unidades junto al dato del modelo. En esta extracción no apareció el contenido de una guía; no se reutilizan como evidencia actual las interacciones históricas observadas en otro producto. |

La consulta de [Óptica Nítida — Guía de tallas](https://opticanitida.cl/guia-de-tallas/) terminó en timeout. No se cuenta como página leída ni como sustento del borrador.

## Referencia extranjera principal y contraste técnico

| Fuente exacta | Evidencia actual | Qué se toma y qué se excluye |
| --- | --- | --- |
| [Zeelool — How To Measure Your Frame Size](https://www.zeelool.com/guide-tips/frame-size) | Define cinco magnitudes, incluye curva en el largo de patilla y advierte variaciones de método. Su ancho usa bisagra a bisagra. | Cobertura de cinco magnitudes y distinción de métodos. No importar categorías, tolerancias, recomendación de altura para graduación ni la convención de ancho como si coincidiera con el esquema local. |
| [Zeelool — Donnalyn ZJGT372549-04](https://www.zeelool.com/goods-detail/ZJGT372549-04) | PDP del modelo elegido por Miguel; talla/código y acceso Size Chart extraídos. | Conserva la trazabilidad de la referencia gráfica. No se abre o revalida su modal en esta investigación ni se incorporan sus cifras o características al texto Lemoon. |
| [Zeelool — Why Glasses With the Same Measurements Can Fit Differently](https://www.zeelool.com/blog/frame/same-measurements-different-glasses-fit) | Explica que los números no describen todas las curvas, apoyos y ángulos. | La comparación orienta, sin garantía de igual comodidad. No incorporar recomendaciones por anatomía, ajustes, lentes o servicios de esa tienda. |
| [Warby Parker — Glasses Measurements](https://www.warbyparker.com/learn/eyeglasses-measurements) | Artículo actualizado el 02-04-2026; identifica inscripción, ancho exterior del frente y cómo medir cada dimensión. Admite regla o cinta flexible en mm. | Sustento del ancho exterior como convención posible y de herramientas para medir el recorrido de la patilla. No importar rangos, medidas de rostro, tarjetas, receta, ofertas o servicios. |
| [Zenni — DIY Guide: How To Measure Eyeglasses Size](https://www.zennioptical.com/measure-eyeglass-frame-size-how-to) | Código de tres valores; ancho/alto del cristal, puente y patilla con curva, mediante dos tramos. | Contraste de las partes y del recorrido de patilla. No importar sus tolerancias, mínimos técnicos, ajuste perfecto ni herramientas de DP. |

No se copiaron frases, tablas o gráficos de estas fuentes. Los patrones compartidos se reescriben para el vocabulario armazón/cristal/puente/patilla de Lemoon. «Varilla» se explica como sinónimo una vez.

## Convención del ancho: discrepancia resuelta editorialmente

Lens y Zeelool expresan ancho mediante bisagras; Warby Parker describe el ancho completo entre extremos exteriores. No son cifras intercambiables. El dibujo A aceptado en Lemoon y DESIGN utilizan **extremos exteriores del frente**, por lo que el borrador lo presenta expresamente como la convención de **este esquema**, exige comparar los mismos extremos y evita presentar el método como universal.

Esta decisión editorial no verifica cómo se midió un SKU. La [auditoría local del 07-11](2026-11-07-size-guide-data-audit.md) registró un solo prototipo con números y no certificó sus extremos. No se repitió la lectura de catálogo ni se incorporan esos números al copy. La confirmación de dimensiones del catálogo sigue perteneciendo a la integración de producto antes de publicar cifras como verificadas.

## Hechos de Lemoon, elecciones editoriales y pendientes

### Comprobado en el código local

- La sección `lemoon-guide-page` conserva tres pasos y ocho campos editoriales para measurements; no necesita una FAQ o sección nueva.
- H1 usa `page.title` o el fallback localizado. Intro y definiciones se imprimen como texto plano; cuerpos de pasos y ayuda usan claves `_html` y campos richtext.
- El ejemplo compartido `52 □ 18–145` está identificado como educativo, no representa un producto y se mantiene sin reescritura. La introducción de ese componente se omite en la página para evitar repetición.
- `lemoon_size_guide.definitions.*` aporta las cinco instrucciones de la página. El padre verificará todos sus consumidores antes de integrar; no se cambia el contenido numérico de un producto.
- Se conservan acciones de catálogo y consulta existentes. El borrador no introduce correo, teléfono, WhatsApp, horarios ni promesas de respuesta.
- Los datos de `commercial-test-data.json` son de demostración y no se utilizaron.

### Elecciones de redacción

- Un material principal claro: lentes de referencia y regla en mm; la definición E permite cinta flexible para seguir la curva sin enderezar la pieza.
- Tres verbos de orientación: leer → medir → comparar. Las instrucciones A–E explican dónde ubicar la regla y qué dejar fuera.
- Las letras A–E son referencias del dibujo, no una nueva clasificación de talla.
- El paso final usa una lista breve para comparar la misma magnitud/unidad y gestionar datos ausentes. El cierre incluye a quien no tiene un armazón de referencia sin estimar medidas desde el rostro.
- No se requieren datos comerciales pendientes para completar el texto de esta preview. El borrador no contiene placeholders de negocio.

### Límites actuales de acceso y publicación

El intento de abrir [la página pública Lemoon](https://lemoon.cl/pages/como-medir-tus-lentes) terminó en error de acceso del extractor. No se acredita su contenido publicado, plantilla, SEO o enlaces actuales, y no se afirma una contradicción live que no pudo inspeccionarse. La fuente de esta entrega es el código local y las decisiones confirmadas en la sesión.

Antes de publicación siguen pendientes revisión humana del contenido integrado, asignación/guardado de plantilla en Shopify, prueba nativa de enlaces/editor/SEO y verificación del catálogo físico. Son gates de integración; no se presentan como espacios vacíos en el texto público ni como tareas ya realizadas por este documento.

## Entrega de contenido

[Propuesta es-CL y mapa es/en](2026-11-08-como-medir-tus-lentes-draft.md). Incluye mapa de claves exactas para storefront, correspondencia de los ocho defaults del editor y SEO propuesto para campos nativos. Solo se escribieron estos dos documentos de contenido; integración local, revisión independiente y preview corresponden al coordinador.
