# Operar el catálogo de «Descubre tu estilo»

Contrato vigente aprobado el 06-11-2026: el quiz reúne seis preferencias opcionales y termina en `/collections/all` con filtros nativos. Shopify resuelve el conjunto completo, el conteo y la paginación; no se cargan productos completos ni se puntúa afinidad en el navegador. [Especificación aprobada](../specs/2026-11-06-lem-11-descubre-tu-estilo.md), [composición visual](../../DESIGN.md#quiz-de-estilo-navegación-a-catálogo) y [receta](../components/recipes/catalogue-states.md).

La ruta pública prevista es `/pages/descubre-tu-estilo`; `/pages/buscar-mi-estilo` debe devolver 404 sin redirección. El template interno `page.buscar-mi-estilo.json` conserva su nombre. Cambiar archivos locales no acredita el handle CMS, su asignación ni el comportamiento HTTP remoto.

## Campos y vocabulario

| Dato | Ubicación | Tipo / uso |
| --- | --- | --- |
| Forma | Producto → `custom.frame_shape` | Campo existente de texto controlado. Las diez opciones existentes se conservan. El quiz representa ocho; browline y mariposa no se recodifican como otras formas |
| Material | Producto → `custom.frame_material` | Campo existente. Acetato, metal, titanio, TR-90, madera o mixto, según datos de proveedor |
| Afinidades | Producto y variante → `custom.style_traits` | Lista de referencias a entradas de `lemoon_style_trait` |
| Revisión editorial heredada | Producto → `custom.style_quiz_ready` | Booleano conservado. Ya no determina inclusión en la colección nativa |
| Demostración | Producto → `custom.style_quiz_demo` | Booleano. Marca interna de escenarios sintéticos; el aviso visible del quiz se retiró por solicitud del usuario |
| Ancho físico | Producto → `custom.frame_width` | Estrecho/estándar/ancho; ajuste físico independiente de presencia visual |
| Talla física | Producto → `custom.frame_size` | Opciones existentes conservadas; no interpretar oversize como talla |
| Medidas | Producto → `custom.frame_dimensions` | JSON con medidas verificadas en mm; fijado en la ficha de producto |
| Peso | Producto → `custom.frame_weight` | Decimal en gramos; fijado en la ficha y vacío si no hay dato confirmado |

Cada entrada de **Afinidad de estilo Lemoon** contiene `group` (criterio), `code` (código estable), `label` (nombre), y opcionalmente `description` e `image`. Las definiciones son propiedad de la tienda, editables por el comerciante y legibles por el storefront; no dependen de una app instalada. La imagen del atributo es una muestra, no sustituye a la fotografía de la variante.

| Criterio `group` | Códigos admitidos |
| --- | --- |
| `color` | `black`, `bold`, `neutral`, `two_tone`, `silver`; compatibilidad conservada con `brown`, `light` |
| `finish` | `matte`, `glossy` |
| `pattern` | `plain`, `tortoise` |
| `transparency` | `opaque`, `translucent`, `transparent` |
| `use` | `work`, `everyday`, `going_out`, `outdoors` |
| `presence` | `compact`, `medium`, `oversize` |

Los nombres en pantalla son traducibles; conservar los códigos. Cambiar un código de una entrada compartida afecta a todos sus productos. Incorporar un código o criterio nuevo requiere coordinar preguntas, traducciones, clasificación y pruebas; incorporar un producto con los valores existentes no requiere código.

La selección Tonos neutros requiere las tres entradas `neutral`, `brown` y `light`; si alguna falta o es ambigua, el quiz conserva las respuestas y no envía una búsqueda parcial.

## Producto frente a variante y proyección nativa

`custom.style_traits` en producto/variante y el diccionario existente siguen siendo las fuentes. Una variante que declara un grupo reemplaza todo ese grupo del producto; los demás se heredan. Una lista de variante vacía hereda todo, sin significar borrado de la herencia. Ejemplo: producto `finish=matte,use=work`; variante `finish=glossy,color=brown` → brillante/café/trabajo. No combinar el color de una variante con el acabado de otra ni inferir metadatos de las imágenes.

Los seis índices derivados por variante son listas de referencias al mismo `lemoon_style_trait`, separadas por grupo:

| Grupo | Campo PRODUCTVARIANT | Parámetro nativo |
| --- | --- | --- |
| Color | `custom.style_filter_color` | `filter.v.m.custom.style_filter_color` |
| Acabado | `custom.style_filter_finish` | `filter.v.m.custom.style_filter_finish` |
| Patrón | `custom.style_filter_pattern` | `filter.v.m.custom.style_filter_pattern` |
| Transparencia | `custom.style_filter_transparency` | `filter.v.m.custom.style_filter_transparency` |
| Uso | `custom.style_filter_use` | `filter.v.m.custom.style_filter_use` |
| Presencia | `custom.style_filter_presence` | `filter.v.m.custom.style_filter_presence` |

Derivar cada lista del grupo efectivo tras herencia. Resolver GIDs por `group/code` en el diccionario de esta tienda, comprobar grupo y unicidad; no copiar IDs de otro entorno ni crear un segundo diccionario. Un grupo desconocido queda sin clasificación, sin atributos inventados. Los campos derivados no reemplazan `custom.style_traits` ni autorizan cambios comerciales. Un único filtro que mezcle todos los grupos no expresa el contrato AND entre criterios.

Forma y material siguen en producto, mediante `filter.p.m.custom.frame_shape` / `filter.p.m.custom.frame_material`. Valores controlados: redondo, cuadrado, rectangular, aviador, geométrico, ovalado, browline, pantóstico, ojo de gato y mariposa; material acetato, metal, titanio, `TR-90`, madera y mixto. La UI representa ocho formas: no recodificar browline/mariposa como otra. Conservar tildes y `TR-90`, sin usar las etiquetas traducidas como valor técnico. Presencia visual no se convierte en `custom.frame_size`, ancho físico ni garantía de calce.

## Tipos, colores y preguntas

Categoría usa los valores reales de `shop.types` en `filter.p.product_type`. Se normalizan solo para reconocerlos (strip, minúsculas y ó→o): `optico/opticos/optical` → optical; `solar/solares/lentes de sol/sunglasses` → sun. La verificación de coordinación confirmó además `Muestra solar` como tipo de demostración solar: se reconoce exactamente y se emite ese valor real. `Muestra de navegación` y Accesorio quedan sin clasificación; no inferir categoría por título/foto. Sin selección no se restringe el tipo. Para solares se oculta/limpia Trabajo/estudio y `outdoors` conserva código con etiqueta Paseos y viajes.

Color presenta Colores, Tonos neutros, Negros, Carey, Bicolor, Transparentes y Plateados. Tonos neutros reúne las referencias existentes `color/neutral`, `color/brown` y `color/light`; Carey es `pattern/tortoise`, Transparentes `transparency/transparent` y Plateados `color/silver`, sin inferencia por material. Bicolor pertenece a una misma variante. Detalles muestra Acabados y después Materiales en vertical, sin pestañas. `plain`, `opaque`, `translucent` conservan referencias históricas, sin ofrecerse en preguntas. El diccionario comunicado sigue en 21 entradas; no todas las entradas equivalen a opciones visibles.

## URL y estados del quiz

`buildQuizCollectionURL(answers, config)` en `assets/lemoon-style-quiz-filters.js` produce una URL relativa de colección. OR entre valores del mismo criterio y AND entre criterios distintos; preguntas omitidas no restringen. Sin coincidencias debe mostrarse el vacío real de la colección, sin ampliar preferencias silenciosamente. La PLP conserva chips/filtros editables, eliminación, sorting, contador y paginación. Sus tarjetas canónicas mantienen media/precio/enlace de su variante según el contrato de la PLP; la coincidencia de variantes combinadas requiere QA Shopify real.

Liquid exporta únicamente colección, tipos reales, diccionario `{id,group,code}` y parámetros expuestos por `collections['all'].filters`. El diccionario se pagina por 250 y marca `dictionaryComplete=false` si queda otra página; no se admite una configuración truncada. Cada criterio seleccionado debe tener mapeo válido y aparecer en `availableFilters`. Si falta referencia, es ambigua o el filtro no está expuesto, se muestra `loading_error`, conservando respuestas y acceso al catálogo; no se emite una URL parcialmente filtrada.

Hay intro y seis preguntas, sin etapa de resultados embebidos. Cada entrada de `history.state.lemoonStyleQuiz` versión 1 guarda su snapshot exacto: ruta/etapa, códigos permitidos, posición/trayecto, pasos completados, referencias de medidas, acordeón y modo de presencia manual/automático. Avanzar añade entrada; seleccionar reemplaza la actual; Atrás/Adelante restauran sin push. Volver usa entrada propia previa o replace como respaldo. Recarga/retorno desde colección conserva ese snapshot, sin bfcache obligatorio ni perfil permanente. Las ediciones posteriores de filtros en colección no reescriben el cuestionario anterior. Los valores desconocidos/corruptos vuelven a intro segura y se preserva el estado ajeno.

Las medidas opcionales lens_width/bridge/temple usan la heurística editorial `2*lente+puente` (<118 compacto,118–128 intermedio,>128 oversize), tras validar lente30–80, puente10–35, patilla100–180mm. No indican ancho total/calce ni modifican medidas del producto. Solo editar campos recalcula; restaurar no sustituye una elección manual. Referencias guardadas únicamente en historial, sin envío al servidor ni asociación al pedido.

## Operación y sincronización

1. Revisar ficha/proveedor, tipo, forma/material, variantes, fotos y medidas con fuentes verificables. Mantener desconocidos vacíos; no inferir composición, disponibilidad o protección de una imagen.
2. Asignar afinidades comunes al producto y overrides de grupo a variantes reales. Reutilizar entradas existentes, preservar IDs y vincular cada fotografía a su variante.
3. Derivar y verificar las seis listas efectivas por variante. Escribir con compare-and-set/`compareDigest` y readback; igualdad permite omitir, diferencia concurrente exige conciliación. La derivación debe refrescarse también cuando se editen las fuentes en Shopify después de la precarga.
4. Habilitar cada criterio compatible en Search & Discovery y comprobar su aparición real en `collection.filters`; una definición creada o PUBLIC_READ no acredita exposición. Verificar OR por valores/AND por criterios y combinación de variantes reales antes de declarar preparado el catálogo.
5. Probar filtros activos/editables, eliminación, orden, vacío y coincidencias más allá de la primera página de `/collections/all`. Contrastar herencia y overrides, foto/precio/enlace de la variante y actualización después de editar una fuente. No alterar stock/precio/publicación para hacer pasar pruebas.

Shopify sigue siendo la fuente comercial. `style_quiz_ready` y `style_quiz_demo` se conservan como metadatos editoriales/históricos; desactivar ready ya no retira un producto de la colección nativa. La inclusión y disponibilidad pertenecen a Shopify y sus canales/colecciones; no despublicar ni alterar comercio como efecto del quiz. El antiguo `lemoon-quiz-candidate` permanece en repositorio sin consumidor en la sección actual; desaparecen los límites de enumeración 50 productos/20 variantes y la ampliación local por 12.

La precarga de Product Studio debe reutilizar esta derivación y los límites de concurrencia de la integración existente. Las ediciones posteriores en Admin requieren sincronización por sus mecanismos vigentes o una ampliación acordada: calcular solo al crear deja índices obsoletos. El desarrollador trabaja en un checkout aislado basado en [PR #9 del back office](https://github.com/antekera/lemoon-next-backoffice/pull/9); implementación local, token/scopes, despliegue y operación real son evidencias separadas. No registrar otro backend, autenticación ni diccionario. Seguimiento: [LEM-11](https://linear.app/antekera/issue/LEM-11), [LEM-70](https://linear.app/antekera/issue/LEM-70), [LEM-64](https://linear.app/antekera/issue/LEM-64), [LEM-93](https://linear.app/antekera/issue/LEM-93) y [LEM-145](https://linear.app/antekera/issue/LEM-145).

Antes de corregir datos, respaldar valores e IDs y preservar cambios posteriores al snapshot. Limitar escrituras al alcance autorizado, leer de vuelta y comprobar tipos/referencias/acceso. No eliminar entradas compartidas ni cambiar tipo/claves de campos existentes sin revisar consumidores. Las marcas de demostración y fotografías sintéticas no acreditan atributos finales. Nunca enviar credenciales de Admin al tema/navegador.

La URL de salida envía cada valor en un parámetro repetido, como los formularios nativos de filtros. No concatenar referencias GID antes de pasarlas a URLSearchParams: codificar la coma como `%2C` dejó esa selección sin reconocer en esta tienda. La coma literal sí funcionó; se adopta el parámetro repetido del formulario nativo.

## Estado de preparación al 06-11-2026

Snapshot administrativo comunicado por coordinación durante esta entrega, separado de QA local y de las evidencias históricas:

- Creadas seis definiciones PRODUCTVARIANT `custom.style_filter_{color,finish,pattern,transparency,use,presence}`, listas de referencias con PUBLIC_READ hacia `MetaobjectDefinition/37833048232`. Diccionario existente de21 entradas conservado.
- Readback posterior verificado de 60/60 listas derivadas en las 10 variantes de los cinco productos demo; los valores fuente de producto/variante se compararon y permanecen idénticos. Evidencia de coordinación en el directorio Git común: `delivery-evidence/lem-11-copy-feedback/demo-products-after-native-projections.json`. Los errores 500 intermitentes previos no se usan como prueba de una escritura; este readback acota la preparación al grupo demo, sin acreditar todo el catálogo ni sincronización posterior.
- «Tipo de lentes» y los seis campos derivados aparecen en la lectura real de `/collections/all`. Tras errores intermitentes de Search & Discovery se recuperó la sesión y se guardaron con OR; cada campo muestra únicamente sus valores asignados. La matriz de colección publicada pasó48comprobaciones, sin errores de runtime: combinaciones, contradicciones entre variantes, chips, eliminación, ordenación y paginación. La serialización usa parámetros repetidos del formulario nativo, comprobados con referencias reales; no se concatena el separador antes de URLSearchParams. [Evidencia y límites](../qa/lem-11-feedback-readiness.md).
- Página y menús CMS permanecen intactos para activación coordinada. La consulta paginada de redirects encontró cero coincidencias exactas para la ruta anterior; esa ausencia no acredita todavía el 404 HTTP tras cambiar el handle. Ruta nueva y 404 sin redirección siguen pendientes de actualización/verificación coordinada.
- Derivación y sync incorporados a PR9 en859ba02;206pruebas y revisión/QA independientes aprobadas, CIverde. No desplegado: faltan scopes/flags efectivos, capacidad máxima y mecanismo comprobado ante cualquier edición directa de metacampos.

Queda verificar el recorrido del quiz nuevo una vez entregado al tema, las rutas CMS, el catálogo comercial completo y las actualizaciones posteriores con la app desplegada. La QA nativa de esta etapa cubre la colección publicada y los cinco escenarios demo; no acredita el despliegue del quiz ni del back office.

## Evidencia histórica de la etapa con ranking

Los apartados siguientes conservan registros previos. Describen el recomendador antiguo y sus cambios administrativos de 05/06-11-2026; no acreditan la preparación nativa actual, la colección completa ni el despliegue de esta entrega. Sus conteos y resultados QA se mantienen como evidencia fechada.

## Escenarios de prueba iniciales

El [manifiesto de preparación](../../scripts/style-quiz-catalog-plan.json) registra el vocabulario, los cinco handles/IDs, sus diez variantes LM-DEMO y las asignaciones sintéticas. Se conservaron los valores previos de forma/material y todos los metacampos ajenos.

Las familias de color, acabado, patrón, uso, transparencia y proporción de ese manifiesto son **escenarios de demostración**, no certificaciones del inventario real. Los cinco productos llevan `style_quiz_demo=true`. Las fotografías actuales de prueba pueden repetirse y no acreditan el patrón/color/material del producto final. No se reutilizan esas asignaciones como hechos al incorporar productos comerciales.

Preparación verificada el 05-11-2026: una definición de metaobjeto, 18 entradas de diccionario, cuatro definiciones de metacampos (tres en producto y una en variante), 25 valores asignados a los cinco productos/diez variantes. La lectura posterior confirmó referencias resueltas, habilitación y bandera de demostración. Las escrituras fueron solo metacampos nuevos, sin cambios de precio, inventario, publicación ni compatibilidades. Los metacampos preexistentes y estados consultados se compararon y conservaron. Evidencia antes/después en el ledger ignorado de la implementación; contiene datos de catálogo, no credenciales.

## Ajuste administrativo verificado

Se revisaron las definiciones existentes antes de escribir. Se actualizaron diez definiciones de metacampos con ayudas en español, se aclararon los nombres de ancho/talla física y se fijaron medidas/peso. No se crearon campos duplicados ni se cambiaron claves, tipos, opciones físicas, referencias o permisos.

En `lemoon_style_trait` se añadieron ayudas a sus cinco campos, una lista controlada de 18 códigos y restricción de imagen para la muestra. Se completó la descripción de clasificación de las 18 entradas existentes mediante actualizaciones parciales; IDs, handles, criterio, código, nombre e imagen se conservaron. El [manifiesto de configuración](../../scripts/style-quiz-admin-config.json) registra el ajuste; no es un script que deba ejecutarse a ciegas.

La lectura posterior comprobó que los cinco productos y diez variantes conservan todos los valores consultados (metacampos, precios, inventario, estados y fecha de publicación). Las diez variantes tienen cobertura efectiva de ocho criterios con datos de demostración. No se cambiaron categorías, compatibilidades, publicación, precios, inventario ni fotografías. Las dos pruebas storefront de selección de variante, escritorio/móvil, aprobaron después del ajuste (34,5 s; código del tema `7ca27245`). No se subieron archivos de tema.

La lectura de las diez definiciones actualizadas devolvió `ALL_VALID`. La restricción de archivos usa la [validación oficial de tipos de archivo de Shopify](https://shopify.dev/docs/apps/build/metafields/list-of-validation-options#file-type-options). Los snapshots antes/después y la matriz de cobertura se conservan en el ledger ignorado `catalog-admin-before.json` / `catalog-admin-after.json`; evidencia del smoke en `/tmp/lem-11-catalog-admin-2026-11-05/storefront-pattern.log`.

### Actualización histórica de colores (06-11-2026)

El plan [de actualización del diccionario](../../scripts/style-quiz-color-plan.json) agrega solo tres códigos/entradas y conserva las referencias existentes. No reclasifica productos ni cambia variantes. Actualización remota verificada: diccionario de18 a21 entradas, tres nuevas (`color-neutral`, `color-two-tone`, `color-silver`); los18 IDs anteriores se conservaron y solo se cambiaron nombre/descripción de `color-black`, sin referencias al verificarlo. Se conservaron los códigos brown/light y todos los campos ajenos. Sin escrituras de productos/variantes ni subida del tema. Evidencia antes/después en el directorio Git común de entrega LEM-11-colors-2026-11-06; los fixtures `?scenario=colors` verifican el recorrido con datos sintéticos.

### Actualización histórica de etiquetas de Detalles (06-11-2026)

Shopify mantiene las21 entradas y sus IDs. `pattern-plain`, `transparency-opaque` y `transparency-translucent` todavía tienen referencias: se marcan **Legado** en nombre/descripción, sin borrarlas ni reclasificar productos. Los códigos siguen admitidos por compatibilidad histórica; `activeCodesByGroup` documenta lo que se ofrece actualmente. Las descripciones de definición y campos explican esta diferencia. No son reglas de validación cruzada de Shopify.

Plan concreto: [style-quiz-details-plan.json](../../scripts/style-quiz-details-plan.json). Ajustar etiquetas/descripciones no cambia `group`, `code`, imágenes, tipos ni asociaciones de productos/variantes.

Actualización remota verificada:21 entradas antes/después, mismos IDs, códigos, criterios y validaciones. Solo se actualizaron las etiquetas/descripciones planificadas y las ayudas de definición/campos; sin eliminación ni escrituras de productos/variantes. Respaldo y readback en el directorio Git común de entrega `LEM-11-details-2026-11-06`. La nueva UI sigue local; no se subió el tema a Shopify.
