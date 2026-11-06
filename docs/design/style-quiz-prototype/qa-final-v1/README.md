# Quiz y búsqueda · entrega para PR #60

Revisión del 06-11-2026. [Evidencia, hashes y dimensiones](evidence.json). Los hashes identifican exactamente los archivos de ejecución y pruebas revisados antes del commit de entrega; el HEAD anterior se conserva como contexto, no como afirmación de que incluía los cambios locales.

## Resultado implementado

Seis pasos: tipo óptico/solar, forma, color, detalles, uso y tamaño visual. La plantilla `page.buscar-mi-estilo.json` usa la sección del quiz y la colección `all`, admitiendo ópticos y solares habilitados dentro del límite inicial de 50 productos y 20 variantes. Se preservan todos los assets anteriores.

Fotos de estudio para categorías/materiales, miniaturas macro de acabados y SVG depurados para formas/tamaño. Paso Forma con tres columnas en todos los anchos; progreso centrado y vuelta secuencial. Referencia opcional de tres medidas con sugerencia editable y foco por un único borde de 2 px. Resultados con seis celdas iguales no interactivas, Ir atrás sin reiniciar, catálogo relleno redondeado y destino `/collections/all`.

La reparación de búsqueda modifica conjuntamente la sección y su snippet requerido: ambas ramas paginadas pasan `search` y `all_collection` explícitos. El snippet conserva fallback para consumidores anteriores. Se preservan filtros, ordenación, paginación y tarjetas canónicas.

## Verificación

| Comprobación ejecutada | Resultado |
| --- | --- |
| Unitarias específicas búsqueda/quiz | 17/17 |
| Todas las unitarias Vitest | 441/441 en 44 archivos |
| Chromium: quiz, biblioteca y búsqueda móvil | 86/86; 25 del quiz |
| Theme Check | Sin ofensas |
| Validador Codex `scripts/test_codex_workflows.py all` | PASS |
| `git diff --check` | Correcto |

Entorno local Node 25.9.0; `.nvmrc` fija 24.19.0 y su comprobación queda para CI. Fixtures renderizados con Liquid y objetos Shopify declarados, sin acreditar storefront, publicación, catálogo comercial, Firefox/WebKit ni calibración de medidas. La regresión aislada del snippet previo falla al recibir solo `all_collection`; el nuevo render pasa y conserva fallback. Esto no reproduce el error remoto de archivo ausente.

Revisiones independientes: código e integración aprobados; convenciones Ready to push; copy aprobado, con atribución Tom Tailor corregida. Son responsabilidades de solo lectura por instrucciones, sin aislamiento técnico de permisos.

## Activación pendiente en Shopify

La lectura del Admin confirmó la página publicada `161787576488`, handle `buscar-mi-estilo`, con `templateSuffix:null`. El tema publicado observado es `155307737256`, con una versión anterior del quiz. Este PR prepara el template y cambia la prueba storefront a la URL natural `/pages/buscar-mi-estilo`, sin `view`.

Después de la revisión humana y del proceso autorizado de publicación:

1. Confirmar el tema publicado y publicar la revisión aprobada con el template, sección, scripts, estilos, traducciones y assets completos. La publicación conserva su autorización específica; abrir este PR no publica el tema.
2. Asignar a la página existente la plantilla `buscar-mi-estilo` y verificar persistencia del sufijo. Hacerlo antes de publicar activaría la versión anterior del quiz.
3. Verificar la URL natural, ambos tipos de lentes, todos los pasos, medidas, resultados y navegación en móvil/escritorio.

No se cambió el contenido, publicación ni plantilla asignada de la página durante esta entrega.

## Incidencia de búsqueda y dependencias

El usuario reportó `Liquid error (sections/main-search line 141): Could not find asset snippets/main-search-results.liquid`. La consulta actual del tema MAIN encontró tanto `snippets/main-search-results.liquid` como `snippets/main-search-result-card.liquid`; la consulta pública devolvió HTTP 429 y el host de navegación no estuvo disponible. No se afirma resolución pública verificada.

En la entrega/publicación incluir juntos `sections/main-search.liquid`, `snippets/main-search-results.liquid`, `snippets/main-search-result-card.liquid` y las dependencias existentes de facets, tarjetas, select y paginación. No publicar solo la sección. Verificar después `/search`, una consulta con resultados, vacío y recuperación de catálogo, sin errores Liquid. El cambio del snippet lo incluye explícitamente en el delta del PR, además de comprobar su contrato de datos.

## Capturas locales

- [Entrada móvil](intro-mobile.png)
- [Colores móvil](colors-mobile.png)
- [Materiales móvil](materials-mobile.png)
- [Uso solar móvil](sun-use-mobile.png)
- [Medidas y foco simple](measure-focus-mobile.png)
- [Resumen móvil](summary-mobile.png) y [escritorio](summary-desktop.png)
- [Acciones de resultados](results-actions-mobile.png)

Las medidas orientan proporción visual mediante una heurística editorial local; no son una talla física certificada. Las imágenes generadas son referencias conceptuales. El indicador interno de datos sintéticos se conserva aunque su aviso visible se haya retirado.
