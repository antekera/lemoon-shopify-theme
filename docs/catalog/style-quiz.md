# Operar el catálogo de «Encuentra tu estilo»

El quiz lee Shopify. Para que un nuevo producto participe se clasifica, se habilita y se incorpora a la colección configurada en la sección; no necesita un bloque manual ni un cambio de JavaScript. Este documento cubre el modelo de la primera etapa de LEM-11. Los datos de prueba no certifican las características de los productos finales.

## Campos y vocabulario

| Dato | Ubicación | Tipo / uso |
| --- | --- | --- |
| Forma | Producto → `custom.frame_shape` | Campo existente de texto controlado. Redondo, cuadrado, rectangular, aviador, geométrico, ovalado, pantóstico y ojo de gato conservan significados distintos |
| Material | Producto → `custom.frame_material` | Campo existente. Acetato, metal, titanio, TR-90, madera o mixto, según datos de proveedor |
| Afinidades | Producto y variante → `custom.style_traits` | Lista de referencias a entradas de `lemoon_style_trait` |
| Habilitación | Producto → `custom.style_quiz_ready` | Booleano. Activar después de revisar clasificación, imágenes y variantes |
| Demostración | Producto → `custom.style_quiz_demo` | Booleano. Activado para escenarios sintéticos; genera aviso visible en el quiz |
| Medidas | Campos actuales `custom.frame_dimensions`, `frame_size`, `frame_width` | Se conservan; las medidas físicas no determinan automáticamente presencia oversize |

Cada entrada de **Afinidad de estilo Lemoon** contiene `group` (criterio), `code` (código estable), `label` (nombre), y opcionalmente `description` e `image`. Las definiciones son propiedad de la tienda, editables por el comerciante y legibles por el storefront; no dependen de una app instalada. La imagen del atributo es una muestra, no sustituye a la fotografía de la variante.

| Criterio `group` | Códigos admitidos por la primera versión |
| --- | --- |
| `color` | `black`, `brown`, `light`, `bold` |
| `finish` | `matte`, `glossy` |
| `pattern` | `plain`, `tortoise` |
| `transparency` | `opaque`, `translucent`, `transparent` |
| `use` | `work`, `everyday`, `going_out`, `outdoors` |
| `presence` | `compact`, `medium`, `oversize` |

Los nombres en pantalla son traducibles; conservar los códigos. Cambiar un código de una entrada compartida afecta a todos sus productos. Incorporar un código o criterio nuevo requiere coordinar preguntas, traducciones, clasificación y pruebas; incorporar un producto con los valores existentes no requiere código.

## Producto frente a variante

Poner en el producto las afinidades comunes a todas sus variantes. Poner en cada variante las características que cambian, especialmente familia de color, patrón, acabado o transparencia.

Una variante que declara un criterio reemplaza **todo ese criterio** del producto, conservando los otros. Ejemplo: producto `finish=matte`, `use=work`; variante `finish=glossy`, `color=brown`. Sus datos efectivos son brillante, café y trabajo. Nunca se suman color de una variante y acabado de otra para fabricar una coincidencia.

Una variante puede tener varias entradas de un criterio. Si no declara ese criterio, lo hereda del producto. Una lista vacía hereda todos los criterios; no funciona como «borrar la herencia». Evitar entradas contradictorias y dejar sin clasificar lo desconocido. Ausencia de dato no puntúa como coincidencia.

«Carey» es patrón: no basta para asignar café. Verificar su familia cromática por separado. El contexto de uso es una selección editorial de estilo y no atribuye filtro azul, protección solar, resistencia o prestaciones de los cristales. La apariencia oversize y el ajuste físico se revisan por vías diferentes.

## Alta de un producto final

1. Revisar ficha/proveedor, categoría, forma, material, variantes y medidas. Mantener fuente verificable para atributos técnicos. Reutilizar campos existentes y evitar valores contradictorios con opciones o fotografías.
2. Asignar las entradas de afinidad comunes al producto y las específicas a cada variante desde Shopify. Usar las entradas compartidas existentes. Crear entradas solo dentro del vocabulario que entiende la versión del quiz.
3. Asociar una fotografía adecuada a cada variante. El resultado debe conservar el mismo color, imagen, precio, disponibilidad y enlace. Verificar los cambios de swatch y la variante al abrir la PDP.
4. Revisar los casos del quiz en los que debe aparecer, y aquellos en que no corresponde afirmar afinidad. Los atributos desconocidos pueden quedar vacíos y no aportan puntos de afinidad.
5. Para datos comerciales comprobados, desactivar `style_quiz_demo`. Activar `style_quiz_ready`. Añadir el producto a la colección elegida en el editor para esta sección. Un producto debe estar disponible en el canal de tienda para que el tema lo encuentre.
6. Probar la selección, editar preferencias y ampliar resultados. Si no aparece, comprobar colección, habilitación, publicación, variantes disponibles, precio válido y atributos efectivos. No cambiar stock para hacer pasar una prueba.

La fuente inicial es la colección Ópticos. La primera versión procesa **hasta 50 productos de esa colección y 20 variantes por producto**. Mantener una colección curada dentro de ese límite; un catálogo mayor requiere una ampliación explícita de carga/ranking. El botón de más resultados amplía el grupo ya calculado y no promete buscar fuera de ese conjunto.

Este límite es de enumeración, no una garantía de rendimiento. La revisión independiente midió aproximadamente 7,27 MB de HTML sin comprimir en un fixture del caso máximo (1.000 candidatos/tarjetas), frente a unos 120 KB para cinco productos con dos variantes. Los templates posponen imágenes y activación, pero no eliminan el HTML. Medir y optimizar la carga antes de ampliar el conjunto inicial; no usar el máximo como objetivo de catálogo sin QA de rendimiento en Shopify.

## Reglas de recomendación

- Cada criterio coincidente aporta un punto, independientemente de cuántas selecciones coincidan dentro de él. Presupuesto, género y forma del rostro no puntúan.
- Se elige la variante disponible con mayor afinidad de cada producto; los empates conservan orden editorial. El grupo completo contiene productos sin duplicados.
- Con preferencias hay resultados cuando coincide al menos un criterio. El resumen editable muestra las preferencias de la búsqueda una sola vez antes del listado; no se afirma que cada producto coincida con todas ellas ni se muestran porcentajes inventados. Las tarjetas conservan su presentación de catálogo, sin texto de afinidad por producto.
- Sin preferencias se muestra una selección identificada como editorial. Si hay pocas o ninguna coincidencia, el usuario puede editar o ampliar sus preferencias; no se inventan productos o características.
- El quiz termina en la PDP. Precio inicial del marco, cristales y compatibilidades siguen [ADR-002](../architecture/adr-002-eyewear-purchase.md).

## Escenarios de prueba iniciales

El [manifiesto de preparación](../../scripts/style-quiz-catalog-plan.json) registra el vocabulario, los cinco handles/IDs, sus diez variantes LM-DEMO y las asignaciones sintéticas. Se conservaron los valores previos de forma/material y todos los metacampos ajenos.

Las familias de color, acabado, patrón, uso, transparencia y proporción de ese manifiesto son **escenarios de demostración**, no certificaciones del inventario real. Los cinco productos llevan `style_quiz_demo=true`. Las fotografías actuales de prueba pueden repetirse y no acreditan el patrón/color/material del producto final. No se reutilizan esas asignaciones como hechos al incorporar productos comerciales.

Preparación verificada el 05-11-2026: una definición de metaobjeto, 18 entradas de diccionario, cuatro definiciones de metacampos (tres en producto y una en variante), 25 valores asignados a los cinco productos/diez variantes. La lectura posterior confirmó referencias resueltas, habilitación y bandera de demostración. Las escrituras fueron solo metacampos nuevos, sin cambios de precio, inventario, publicación ni compatibilidades. Los metacampos preexistentes y estados consultados se compararon y conservaron. Evidencia antes/después en el ledger ignorado de la implementación; contiene datos de catálogo, no credenciales.

## Cambios y recuperación

Antes de modificar clasificaciones, capturar valores actuales e IDs. Preferir cambios acotados y compare-and-set para evitar sobrescribir una edición concurrente. Leer de vuelta para verificar tipos, referencias y acceso del storefront. No cambiar el tipo de campos existentes ni eliminar entradas compartidas sin revisar sus consumidores.

Para retirar un producto del recomendador, desactivar `style_quiz_ready`; no hace falta despublicarlo. Para corregir un escenario de prueba, modificar solo los IDs del manifiesto. La restauración debe revisar cambios posteriores antes de aplicar la captura previa; no borrar datos nuevos a ciegas ni eliminar el diccionario compartido si ya lo utilizan productos finales.

La carga masiva dependerá de la herramienta usada y de su soporte de listas de referencias y variantes. El manifiesto es un plan trazable, no un CSV universal ni un script con credenciales. El editor de Shopify es el procedimiento inicial para las altas comerciales. No enviar tokens de administración al tema o al navegador.

Revisión del listado LEM-11: hasta doce productos iniciales y ampliación por doce; en móvil, dos tarjetas por fila. La cantidad visible siempre queda limitada a los productos disponibles del grupo real, sin repetir variantes ni inventar coincidencias para completar una grilla.
