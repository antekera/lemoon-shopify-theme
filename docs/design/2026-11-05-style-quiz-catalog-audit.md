# LEM-11 · Auditoría inicial de atributos del catálogo

Lectura de Shopify realizada el 5 de noviembre de 2026 sobre la tienda conectada `lemoon.cl`. Alcance: todas las definiciones visibles de producto/variante y de metaobjetos, más los cinco handles de la plantilla actual del quiz: `lemoon-estero`, `lemoon-jade`, `lemoon-genova`, `lemoon-faro`, `lemoon-artico`. No se escribieron datos.

## Resultado comprobado

Se devolvieron 16 definiciones de metacampos de producto, 11 de variante y dos definiciones de metaobjetos; las tres listas terminaron con `hasNextPage: false`. Las definiciones de variante visibles son de Google Shopping. Los metaobjetos son `tipo_de_lente` y `shopify--knowledge-base-fact`; no se encontraron definiciones de atributos de estilo por metaobjetos.

Los cinco productos iniciales existen y están ACTIVE. Cada uno tiene dos variantes, Azul y Carey, con opción Color. La lectura devolvió diez variantes sin metacampos asignados y sin páginas adicionales. Los cinco productos tienen metacampos de forma, material, tamaño y ancho, y categoría estándar sin asignar. La existencia de valores en Shopify no certifica la fidelidad física de los productos de prueba.

| Eje | Datos comprobados | Trabajo incluido en LEM-11 |
| --- | --- | --- |
| Forma | `custom.frame_shape`, texto con opciones controladas; asignado en los cinco productos | Reutilizar; definir mapeos explícitos entre preguntas y taxonomía. Pantóstico, ovalado y cuadrado no se reclasifican silenciosamente para encajar en las cinco ilustraciones |
| Material | `custom.frame_material`, texto con opciones controladas; asignado en los cinco | Reutilizar; resolver atributos por variante solo cuando cambien entre versiones |
| Color | Opción Color con Azul/Carey; no definición específica de familia cromática en el inventario | Mantener las opciones comerciales; asociar familia cromática a la variante sin deducirla del patrón |
| Acabado | No se encontró definición específica | Definir y cargar mate/brillante u otros valores sustentados por catálogo |
| Patrón | Carey aparece como valor de Color; no definición específica de patrón | Clasificar patrón de forma independiente y verificar las imágenes de la variante |
| Transparencia | No se encontró definición específica | Incorporar el atributo si se ofrecen opciones de transparencia; no derivarlo de tonos claros |
| Contexto de uso | No se encontró definición específica | Definir afinidades editoriales controladas, con multivalor cuando corresponda |
| Proporción visual | No se encontró definición específica | Incorporar compacto/intermedio/oversize con criterio de clasificación independiente de talla física |
| Ancho físico | `custom.frame_width`, opciones estrecho/estándar/ancho | Conservar; revisar el criterio y no usarlo como proporción visual |
| Tamaño/medidas | `custom.frame_size`, etiquetas que mezclan talla y números; existe definición JSON `custom.frame_dimensions` | Conservar consumidores existentes. Verificar y poblar dimensiones estructuradas; no certificar medidas ni ancho total interpretando una etiqueta de prueba |

`custom.frame_dimensions` está definido, pero no apareció entre los valores de los cinco productos. No se hallaron valores de acabado, patrón, uso o proporción visual en sus metacampos. Los nombres propuestos para nuevos campos no quedan fijados por esta auditoría; se resuelven tras el inventario de consumidores y la categoría estándar pertinente.

## Modelo operativo propuesto

- **Metacampo:** asignación de un atributo a un producto o variante.
- **Metaobjeto:** entrada estructurada reutilizable, útil para valores compartidos con label, ilustración/muestra y descripción. Un metacampo de referencia enlaza esa entrada al producto o variante.
- Reutilizar primero campos existentes compatibles y atributos estándar de categoría. Crear las definiciones faltantes, después sus entradas/valores y asignaciones, y finalmente verificar su lectura.
- Forma o material compartidos pueden permanecer a nivel producto. Color, patrón, acabado o medidas que cambian entre variantes requieren asignación específica y reglas de herencia explícitas; no unir los atributos de todas las variantes y atribuirlos a una sola.
- No convertir los campos de texto existentes a referencias como efecto lateral del quiz. Una migración requiere mapa de valores, revisión de consumidores, snapshot previo, preservación y comprobación posterior.
- El catálogo es administrable desde Shopify y reutilizable por el tema; no se introduce una app propietaria para poder registrar estos atributos.

Las [referencias oficiales de Shopify](https://help.shopify.com/en/manual/custom-data/metaobjects/referencing-metaobjects) describen el enlace mediante metacampos de referencia. Los [metacampos de categoría](https://help.shopify.com/en/manual/custom-data/metafields/category-metafields) ofrecen atributos estándar. Shopify también documenta [filtros a nivel de variante](https://help.shopify.com/en/manual/online-store/storefront-search/search-and-discovery-filters), pertinentes cuando la selección debe conservar una variante concreta. Documentación consultada mediante Context7.

## Preparación de los productos de prueba y entrega

La preparación forma parte de la primera etapa del quiz: diccionario, definiciones faltantes, entradas controladas, asignaciones a los productos/variantes iniciales y verificación de lectura. Conservar una matriz de cobertura de los cinco ejes; si una combinación no existe, verificar o incorporar un caso de prueba apropiado sin inventar características de un producto final.

Entregar también la guía de alta del catálogo final, la plantilla o procedimiento de carga que realmente soporte los tipos elegidos, y un control de campos faltantes. Debe permitir añadir un producto desde Shopify y comprobar que entra al grupo de resultados sin editar bloques de recomendación ni código del tema.

Para datos sintéticos de pruebas, conservar su procedencia y separación de los atributos comerciales verificados. Los productos consultados están activos; ser denominados de prueba no los aísla del storefront. Antes de escribir, revisar consumidores, capturar los valores previos y delimitar los cambios a los IDs incluidos en el plan. No cambiar precio, stock, publicación, compatibilidad de lentes ni otros atributos ajenos como consecuencia de clasificar estilo.

La integración usa `card-product.liquid` y sigue la [receta canónica](../components/recipes/product-card-grid.md). El grupo completo conserva afinidad y preferencias al ampliar resultados; la tarjeta debe mostrar imagen, precio, disponibilidad y enlace de la misma variante. La lectura del snippet actual muestra dependencias de producto y swatches: el soporte de una variante inicial recomendada requiere revisión explícita y regresión de sus otros consumidores.

## Límites

No es una auditoría de todos los productos, imágenes, categorías posibles ni atributos sin definición fuera de los cinco productos. No se verificaron físicamente materiales o medidas. No se crearon definiciones, metaobjetos, valores ni asignaciones. Las futuras escrituras deberán tomar una nueva lectura para preservar cambios concurrentes; esta auditoría es un inventario fechado, no un respaldo de restauración completo.
