# LEM-11 · Descubre tu estilo: navegación y salida a categorías

Estado: diseño propuesto para revisión antes de implementar. Rama `fix/lem-11-quiz-copy-feedback`, base `5391d588`; el commit `198c7c65` ya recupera el título acordado. Este documento no acredita cambios de Shopify ni publicación.

## Resultado solicitado

1. El enlace del footer y el nombre de la página serán **Descubre tu estilo**. La URL será `/pages/descubre-tu-estilo`; la anterior dejará de existir y devolverá 404, sin redirección.
2. El título visible seguirá siendo **Descubre tu estilo ideal.** y el subtítulo **Formas, colores y detalles que van contigo. Encuentra los tuyos.**
3. El texto del quiz tendrá tamaño de lectura regular, también en móvil.
4. Atrás y Adelante del navegador recorrerán las preguntas conservando las respuestas.
5. Detalles mostrará Acabados y, debajo, Materiales, ambos visibles mediante scroll.
6. Después de la pregunta de tamaño se abrirá **Todos los productos** (`/collections/all`) con filtros de categoría reales. No habrá una pantalla de productos dentro del quiz ni un ranking por afinidad en su lugar.

El último punto incorpora la aclaración de Miguel: los metaobjetos del quiz también deben servir como filtros de categoría. No basta con enviar parámetros que Shopify ignore ni con filtrar las tarjetas de una página ya paginada.

## Nombre, ruta y accesos

- Conservar la página Shopify existente `161787576488` y el template interno `page.buscar-mi-estilo.json`; cambiar su handle no exige duplicar página o renombrar el template.
- Cambiar título de página a `Descubre tu estilo` y handle a `descubre-tu-estilo`, sin crear una redirección desde `/pages/buscar-mi-estilo`. Desactivar la creación automática de redirección al modificar el handle.
- Verificar que no quede una página ni una redirección activa para `/pages/buscar-mi-estilo`; si existe una redirección de esa ruta, retirarla de forma acotada. La ruta anterior debe devolver HTTP 404. Esta decisión sustituye la propuesta inicial de conservar compatibilidad mediante redirección.
- Actualizar el título y destino del enlace en los menús Shopify que realmente lo contienen. La lectura actual encontró `footer-how-to`, `footer-services-review` y `footer-services-mobile-review`. Preservar el resto de cada menú y sus asociaciones de recurso.
- Conciliar accesos de header/búsqueda móvil, FAQ, documentación vigente y pruebas con la nueva URL. No reescribir evidencia histórica como si hubiese usado la nueva ruta.
- La comprobación administrativa actual confirma que la página está publicada, usa `templateSuffix: buscar-mi-estilo` y conserva el handle anterior. Estos cambios de CMS se coordinarán con la entrega del tema; se respaldarán y se leerán nuevamente para comprobarlos.

## Texto y composición

- Usar los tokens existentes: texto explicativo, etiquetas de opciones y campos a **16 px** como mínimo, peso regular 400. Acciones a 16 px conservando su peso semibold para que se reconozcan como botones; ayudas secundarias a 14 px como mínimo.
- Mantener H1/H2, colores, gutters y fotografía editorial según `DESIGN.md`; permitir reflujo natural y zoom. Conservar tres formas por fila si las etiquetas completas y los targets siguen cabiendo, sin truncarlas.
- No ampliar globalmente la tipografía de las tarjetas de catálogo ni de otras páginas.
- En Detalles, sustituir las pestañas por dos grupos con encabezados localizados: Acabados, después Materiales. Conservar inputs, valores, foco, selección e imágenes existentes; cargar las imágenes inferiores de forma diferida.
- Conservar el arreglo de estabilidad inicial de PR70: no introducir saltos al habilitar el inicio o cargar la página.

## Historial del navegador

- Mantener las seis preguntas: categoría, forma, color, detalles, uso y presencia. La pantalla de resultados embebidos deja de ser un estado del quiz.
- Reservar un estado propio y versionado en `history.state`, preservando cualquier estado ajeno. Representar intro y cada etapa en una URL de la misma página, mediante un fragmento estable por etapa.
- Usar `pushState` al avanzar y `replaceState` al actualizar respuestas de la entrada actual. Un cambio de checkbox no debe generar otra entrada de historial.
- Atrás/Adelante deben restaurar la etapa sin generar entradas adicionales ni encerrar al visitante en el quiz. Desde la intro, Atrás permite salir normalmente.
- Conservar respuestas, pasos completados, referencias de medidas y elección manual/automática de presencia; no volver a inferir tamaño al restaurar una elección manual.
- Restaurar por códigos permitidos, no por HTML ni texto traducido. Validar entradas desconocidas o corruptas y volver a un estado seguro.
- El estado se limita al historial de navegación; no se crea un perfil, backend ni persistencia permanente. Probar recarga y retorno desde categoría con y sin bfcache.

## Resultados: contrato de categoría

- Al pulsar el CTA final, guardar el estado del último paso y navegar a `/collections/all` con los filtros elegidos. Las preguntas omitidas no añaden restricciones.
- La selección se convierte en filtros nativos: **OR entre valores del mismo criterio y AND entre criterios distintos**, igual que al usar manualmente el panel de categorías. Se elimina la puntuación por afinidad y no se amplían coincidencias silenciosamente.
- Conservar filtros editables, chips activos, eliminación de filtros, ordenación, contador y paginación propios de la PLP. Los conteos y el conjunto completo proceden de Shopify, sin el límite de enumeración de 50 productos/20 variantes del recomendador anterior.
- No añadir presupuesto, género o diagnóstico facial al quiz. El precio puede seguir disponible en la categoría como filtro voluntario existente.
- Cero resultados debe mostrar el estado vacío real y la posibilidad de quitar filtros. No sustituirlo por recomendaciones sin avisar.
- Volver desde la categoría debe recuperar la última pregunta y sus respuestas. Los cambios manuales posteriores en filtros pertenecen a la categoría y no reescriben automáticamente el cuestionario anterior.

### Lo que existe y lo que falta

La lectura de `/collections/all` en el tema publicado `155307737256` encontró filtros de género, precio, forma, color de variante, tipo de receta, material y talla física. No expuso los criterios de afinidad del quiz. La PLP ya consume `collection.filters` y pagina `collection.products`.

`custom.style_traits` mezcla seis criterios en una única lista de referencias a `lemoon_style_trait`. Activarlo como un único filtro no permite expresar correctamente, por ejemplo, `(negro OR plateado) AND (mate OR brillante)`. Además, una variante puede reemplazar un criterio del producto; no debe mezclarse el color de una variante con el acabado de otra.

Por eso se propone conservar los metaobjetos actuales como vocabulario y fuente, y separar sus criterios al preparar el índice nativo de filtros:

| Preferencia | Fuente actual | Filtro propuesto |
| --- | --- | --- |
| Ópticos/solares | Tipo de producto reconocido por el quiz | Tipo de producto nativo, con todos los valores reales reconocidos de cada categoría |
| Forma | `custom.frame_shape` del producto | Filtro nativo existente; resolver valores reales, incluidas tildes |
| Material | `custom.frame_material` del producto | Filtro nativo existente; conservar valores como `TR-90` |
| Familia de color | Grupo `color` efectivo | Variante: `custom.style_filter_color` |
| Acabado | Grupo `finish` efectivo | Variante: `custom.style_filter_finish` |
| Patrón, incluido Carey | Grupo `pattern` efectivo | Variante: `custom.style_filter_pattern` |
| Transparencia | Grupo `transparency` efectivo | Variante: `custom.style_filter_transparency` |
| Uso | Grupo `use` efectivo | Variante: `custom.style_filter_use` |
| Presencia visual | Grupo `presence` efectivo | Variante: `custom.style_filter_presence` |

Los seis campos nuevos serían listas de referencias a las entradas existentes de `lemoon_style_trait`, separadas por criterio, con nombres legibles en Search & Discovery. Son datos derivados para filtrar; no constituyen otro diccionario ni sustituyen los datos fuente. Antes de crearlos se comprobarán las definiciones existentes para reutilizar las compatibles y evitar duplicados.

No mapear familias de color a un color concreto de variante por aproximación. Carey y Transparentes conservan sus criterios propios. No mapear presencia compacta/intermedia/oversize a `custom.frame_size`: esta última representa talla física y es otro dato.

### Preparación y mantenimiento del catálogo

- La derivación por variante debe respetar la regla existente: un grupo declarado en la variante reemplaza todo ese grupo del producto; el resto se hereda. Los grupos desconocidos quedan vacíos, sin inferir atributos de fotografías.
- Resolver referencias por `group/code` en el diccionario de la tienda, nunca por IDs copiados de otro entorno. Verificar que cada referencia corresponda al criterio de su campo.
- Conciliar el vocabulario con el back office: la revisión actual de `packages/domain/src/style-metadata.ts` todavía enumera `black/brown/light/bold`, mientras el tema admite también `neutral/two_tone/silver`. No perder valores ni etiquetar productos sin datos aprobados.
- Incorporar los campos derivados a la precarga/publicación del back office y a sus pruebas, bajo el contrato de LEM-11 y los responsables de catálogo. La PR9 sigue abierta en `48ca70e`; no se modifica su trabajo concurrente ni `apps/web/next-env.d.ts`.
- Las ediciones posteriores de los datos fuente en Shopify también deben actualizar la derivación mediante la integración existente o una ampliación acordada de ella. Una proyección que solo se calcula al crear el producto quedaría obsoleta y no cumple aceptación.
- Preparar primero los productos de prueba identificados y verificar valores antes/después. Mantener intactos precio, stock, publicación, compatibilidades y valores fuente ajenos.
- Habilitar y comprobar los nuevos criterios en Search & Discovery. Definir campos en Admin no demuestra que los filtros aparezcan en `collection.filters` ni que Shopify los aplique.
- Verificar en Shopify real que los filtros combinados resuelvan la variante correcta. Si la exposición o combinación nativa no permite el contrato propuesto, conciliarlo antes de implementar una sustitución; no degradar a filtrado de la página visible.

## Alcance de código y datos

- Tema: controlador/estilos/markup del quiz; destinos de navegación; serialización de la URL de filtros; PLP/facets solo donde sea necesario para presentar los criterios reales y mantener coherencia de variante.
- El quiz dejará de cargar tarjetas y datos completos de candidatos para puntuar localmente. Usará únicamente el vocabulario y correspondencias necesarios para construir filtros válidos.
- Documentación: contrato visual, receta, inventarios Markdown/JSON, guía de catálogo, rutas vigentes y pruebas. El título «Descubre tu estilo ideal.» ya está recuperado en esta rama.
- Shopify: página y menús, comprobación de ausencia de la ruta anterior y su redirección, definiciones y configuración de filtros; asignación y derivación de atributos de prueba. Todo con respaldo y lectura posterior.
- Back office: vocabulario y derivación/publicación de los mismos campos, manteniendo la protección de ediciones concurrentes y la fuente comercial en Shopify. La preparación documental no acredita token, scopes ni despliegue de esa app.
- La publicación del tema y los despliegues conservan sus autorizaciones separadas. Esta especificación no los ejecuta.

## Pruebas de aceptación

1. Footer/header/búsqueda móvil llevan a la nueva ruta y la URL natural usa la plantilla correcta. `/pages/buscar-mi-estilo` devuelve HTTP 404, sin cabecera de redirección ni navegación automática hacia la nueva página.
2. Texto computado y targets legibles a 390/749/750/989/990/1440 px, zoom y teclado, sin overflow ni regresión del salto inicial.
3. Acabados y Materiales visibles simultáneamente y seleccionables con teclado, sin pestaña oculta.
4. Atrás/Adelante, cambios después de Atrás, recarga, retorno desde categoría y referencias de medidas conservan estado y foco sin bucles de historial.
5. URL final con todas las combinaciones de criterios, varias selecciones del mismo grupo, preguntas omitidas, Carey, Transparentes y diccionario incompleto. Los valores inexistentes no se ignoran silenciosamente.
6. Categoría nativa con filtros activos/editables, ordenación, eliminación, estado vacío y resultados situados más allá de su primera página; sin duplicados ni truncación al grupo antiguo del quiz.
7. Overrides por variante, herencia y modificación posterior en Shopify mantienen filtros, imagen, precio y enlace coherentes. Comparar la precarga del back office y la edición en Admin.
8. Distinguir fixtures de Shopify nativo. Theme Check y pruebas locales no sustituyen la configuración de filtros ni la QA de catálogo real.

## Fuentes técnicas y evidencia

- [Filtrado nativo de Shopify](https://shopify.dev/docs/storefronts/themes/navigation-search/filtering/storefront-filtering): parámetros, filtros por producto/variante, referencias a metaobjetos y lógica AND/OR.
- [Presentar filtros en el tema](https://shopify.dev/docs/storefronts/themes/navigation-search/filtering/storefront-filtering/support-storefront-filtering): `collection.filters` y valores activos.
- Lecturas actuales de página, menús y filtros de producción del 06-11-2026. No se ejecutaron escrituras administrativas durante esta investigación.
- Código: `sections/main-collection-product-grid.liquid`, `snippets/facets.liquid`, `assets/facets.js`, `snippets/lemoon-plp-product-page.liquid`, `snippets/lemoon-quiz-candidate.liquid` y `docs/catalog/style-quiz.md`.
