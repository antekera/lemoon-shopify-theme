# Operar el catálogo de «Encuentra tu estilo»

El quiz lee Shopify. Para que un nuevo producto participe se clasifica, se habilita y se incorpora a la colección configurada en la sección; no necesita un bloque manual ni un cambio de JavaScript. Este documento cubre el modelo de la primera etapa de LEM-11. Los datos de prueba no certifican las características de los productos finales.

## Campos y vocabulario

| Dato | Ubicación | Tipo / uso |
| --- | --- | --- |
| Forma | Producto → `custom.frame_shape` | Campo existente de texto controlado. Las diez opciones existentes se conservan. El quiz representa ocho; browline y mariposa no se recodifican como otras formas |
| Material | Producto → `custom.frame_material` | Campo existente. Acetato, metal, titanio, TR-90, madera o mixto, según datos de proveedor |
| Afinidades | Producto y variante → `custom.style_traits` | Lista de referencias a entradas de `lemoon_style_trait` |
| Habilitación | Producto → `custom.style_quiz_ready` | Booleano. Activar después de revisar clasificación, imágenes y variantes |
| Demostración | Producto → `custom.style_quiz_demo` | Booleano. Activado para escenarios sintéticos; genera aviso visible en el quiz |
| Ancho físico | Producto → `custom.frame_width` | Estrecho/estándar/ancho; ajuste físico independiente de presencia visual |
| Talla física | Producto → `custom.frame_size` | Opciones existentes conservadas; no interpretar oversize como talla |
| Medidas | Producto → `custom.frame_dimensions` | JSON con medidas verificadas en mm; fijado en la ficha de producto |
| Peso | Producto → `custom.frame_weight` | Decimal en gramos; fijado en la ficha y vacío si no hay dato confirmado |

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

## Dónde configurarlo en Shopify

1. En **Productos**, abrir el producto y llegar a **Metacampos**. Forma, material, ancho físico, talla física, afinidades, habilitación y demostración están fijados; también se fijaron medidas en mm y peso en g. [Abrir el producto Jade de prueba](https://admin.shopify.com/store/lemoon-8277/products/9581568262312).
2. En **Afinidades de estilo**, seleccionar las entradas comunes a todas sus variantes. No crear una copia del diccionario por cada producto.
3. En **Variantes**, abrir cada color y editar **Afinidades de estilo de la variante**. Elegir aquí color/patrón y cualquier otro criterio que cambie. La ayuda del campo explica la herencia y el reemplazo por criterio.
4. En **Contenido → Metaobjetos → Afinidad de estilo Lemoon**, revisar las 18 entradas y sus descripciones de clasificación. Sus códigos están restringidos al vocabulario del quiz y las muestras opcionales aceptan imágenes.
5. Revisar los atributos y fotografías antes de activar **Listo para el quiz de estilo**. Conservar **Datos de demostración del quiz** en los escenarios sintéticos. La colección configurada en la sección también debe incluir el producto.

Forma/material se asignan a nivel producto; no hay un reemplazo de esos dos campos a nivel variante en esta versión. Si cambian entre variantes, resolver esa estructura antes de dar por clasificado todo el producto. Color, acabado, patrón, transparencia, uso y presencia se asignan mediante la lista compartida de afinidades, con reemplazo por criterio en la variante.

Los códigos de criterio se conservan (`finish` = acabado, `pattern` = patrón, `use` = uso, `presence` = presencia visual). Shopify restringe los criterios y códigos por separado; revisar también que la pareja sea la de la tabla. No hay una validación cruzada automática criterio/código. Los 18 pares actuales se comprobaron al terminar la configuración.

Las muestras y descripciones del diccionario ayudan a mantener el catálogo. El quiz actual usa sus ilustraciones y traducciones del tema: cargar una muestra aquí no cambia automáticamente una pregunta ni sustituye las fotografías de las variantes.

### Cargar medidas comprobadas

`custom.frame_dimensions` conserva el tipo JSON y las claves consumidas por la guía de medidas: `frame_width` (ancho total), `lens_width` (ancho del lente), `bridge` (puente), `lens_height` (alto del lente) y `temple` (patilla). Todos los valores representan milímetros. Incluir únicamente claves con datos confirmados; no rellenar medidas desconocidas ni calcular el ancho total a partir de una medida aislada. El campo de peso usa gramos.

La configuración no convierte los ejemplos de talla existentes en medidas certificadas, ni usa estos campos para deducir compacto/intermedio/oversize. Los cinco productos de prueba siguen sin dimensiones ni peso: queda pendiente la carga con información verificada del proveedor.

## Precarga desde Product Studio del back office

El alta inicial reúne fotografías, título, textos y características en un borrador de Product Studio. El operador revisa las propuestas y sus fuentes antes de preparar el producto en Shopify. Estos metadatos forman parte de esa misma carga, no de una clasificación paralela exclusiva del tema.

- Producto: reutilizar `custom.frame_shape`, `custom.frame_material` y los campos físicos existentes. Resolver las entradas de `custom.style_traits` por criterio/código en el diccionario de la tienda.
- Variante: asociar `custom.style_traits` al ID real de su variante y conservar el reemplazo por criterio. Nunca agregar los atributos de todos los colores al producto o asociarlos por posición de una lista.
- No copiar los IDs de los productos o metaobjetos de demostración como constantes de integración. No recrear definiciones ni duplicar el diccionario en cada alta.
- Conservar los estados de revisión, evidencia y aprobación humana. Datos desconocidos permanecen ausentes y la habilitación del quiz requiere decisión explícita; no inferir talla, material o prestaciones desde una foto.
- Después de la precarga, el comerciante puede editar estos valores desde Shopify. Una repetición del proceso no debe sobrescribir una edición posterior: igualdad permite omitir la escritura; diferencia requiere conciliación; un valor ausente debe protegerse frente a una creación concurrente.
- El alta de producto nuevo y la asociación de variantes deben respetar las capacidades reales del flujo existente; no se da por implementada la creación automática de variantes por incorporar sus metadatos.

Seguimiento: [PR #9 del back office](https://github.com/antekera/lemoon-next-backoffice/pull/9), [LEM-70 — carga y producción de contenido](https://linear.app/antekera/issue/LEM-70), [LEM-64 — onboarding](https://linear.app/antekera/issue/LEM-64), [LEM-93 — contrato de datos](https://linear.app/antekera/issue/LEM-93) y [LEM-145 — compatibilidad del catálogo](https://linear.app/antekera/issue/LEM-145). El tema consume el resultado de Shopify en [LEM-11](https://linear.app/antekera/issue/LEM-11). La implementación y su evidencia se revisan en el PR; esta guía no acredita un despliegue del back office ni escrituras de productos finales.

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

## Ajuste administrativo verificado

Se revisaron las definiciones existentes antes de escribir. Se actualizaron diez definiciones de metacampos con ayudas en español, se aclararon los nombres de ancho/talla física y se fijaron medidas/peso. No se crearon campos duplicados ni se cambiaron claves, tipos, opciones físicas, referencias o permisos.

En `lemoon_style_trait` se añadieron ayudas a sus cinco campos, una lista controlada de 18 códigos y restricción de imagen para la muestra. Se completó la descripción de clasificación de las 18 entradas existentes mediante actualizaciones parciales; IDs, handles, criterio, código, nombre e imagen se conservaron. El [manifiesto de configuración](../../scripts/style-quiz-admin-config.json) registra el ajuste; no es un script que deba ejecutarse a ciegas.

La lectura posterior comprobó que los cinco productos y diez variantes conservan todos los valores consultados (metacampos, precios, inventario, estados y fecha de publicación). Las diez variantes tienen cobertura efectiva de ocho criterios con datos de demostración. No se cambiaron categorías, compatibilidades, publicación, precios, inventario ni fotografías. Las dos pruebas storefront de selección de variante, escritorio/móvil, aprobaron después del ajuste (34,5 s; código del tema `7ca27245`). No se subieron archivos de tema.

La lectura de las diez definiciones actualizadas devolvió `ALL_VALID`. La restricción de archivos usa la [validación oficial de tipos de archivo de Shopify](https://shopify.dev/docs/apps/build/metafields/list-of-validation-options#file-type-options). Los snapshots antes/después y la matriz de cobertura se conservan en el ledger ignorado `catalog-admin-before.json` / `catalog-admin-after.json`; evidencia del smoke en `/tmp/lem-11-catalog-admin-2026-11-05/storefront-pattern.log`.
