# Galería de componentes y estados sintéticos

Familias: LM-GALLERY, LM-FEEDBACK y piezas UI nuevas; overlays, navegación, privacidad y quiz conservan sus dueños. Volver al [catálogo](../README.md).

## Fuente y alcance

[lemoon-design-system](../../../sections/lemoon-design-system.liquid), consumido por [page.sistema-de-diseno.json](../../../templates/page.sistema-de-diseno.json), conserva la galería local y [lemoon-design-system.css](../../../assets/lemoon-design-system.css). Sus ejemplos migrados llaman a los seis snippets UI reales, además de icono/spinner existentes. La sección sigue siendo una composición, no una librería que se renderiza dentro de otra página.

| Pieza canónica | Estado que puede mostrar sin operación real |
| --- | --- |
| [action](../../../snippets/lemoon-ui-action.liquid) | Base primary/secondary/tertiary, disabled y loading sintético; el dueño maneja operaciones reales |
| [field](../../../snippets/lemoon-ui-field.liquid) | Base input/textarea, ayuda/error/disabled; sin formulario ni POST |
| [select](../../../snippets/lemoon-ui-select.liquid) | Label visible persistente, opciones sintéticas con value y selected; no política comercial |
| [heading](../../../snippets/lemoon-ui-heading.liquid) | H2 y IDs semánticos; presentación sigue en CSS |
| [message](../../../snippets/lemoon-ui-message.liquid) | Texto o captura confiable; sin autofocus ni alert/live simultáneos para demos |
| [faq-item](../../../snippets/lemoon-ui-faq-item.liquid) | Details abierto/cerrado; pregunta/respuesta localizada de demostración |

## Componer una muestra inerte

Este fragmento usa claves existentes de contacto para ejercitar la presentación, sin un formulario activo, datos de cliente ni envío. No sustituye los ejemplos concretos del consumidor:

```liquid
{%- assign demo_label = 'sections.lemoon_contact_page.send' | t -%}
{%- assign demo_success = 'sections.lemoon_contact_page.success' | t -%}
{%- capture demo_message_id -%}ComponentDemo-{{ section.id }}-success{%- endcapture -%}
{% render 'lemoon-ui-action', label: demo_label, type: 'button', variant: 'secondary', disabled: true %}
{% render 'lemoon-ui-action', label: demo_label, type: 'button', loading: true %}
{% render 'lemoon-ui-message', text: demo_success, id: demo_message_id, class: 'lemoon-contact__status lemoon-contact__status--success' %}
```

La clase local requiere los estilos de su superficie si se usa fuera de ella. La galería real mantiene sus clases de demo y localización; este ejemplo no crea estilos globales. `loading` en action impide activación y reutiliza loading-spinner por defecto (`show_spinner: false` lo omite); mostrarlo no simula una respuesta de red. Un mensaje sin `role`/`live` no anuncia al cargar. Para pruebas de respuesta real usar la rama nativa de [contacto](contact-form.md).

Escapar strings una vez en snippets; `content_html`, `answer_html` y `options_html` sólo son capturas confiables con datos internos ya escapados donde corresponda. IDs únicos por sección e instancia, sin duplicar labels ni referenciar ayuda ausente. Booleanos false se pasan como booleanos, no strings.

## Demos legacy y familias sin migrar

La tipografía de muestra, acción accent local, radio/badges y tarjeta/trust independientes que permanezcan son **legacy/demo**. No establecen variantes globales, APIs reutilizables, precios, garantías, plazos ni aprobación visual. Su permanencia no les confiere cumplimiento WCAG. [DESIGN](../../../DESIGN.md) y las fuentes comerciales canónicas prevalecen. LEM-142 no elimina contenido ajeno por ausencia de renders estáticos.

Overlays deben partir de su modal/drawer real con [global.js](../../../assets/global.js) y dueño de foco; no hay un modal genérico extraído. Header/mobile-nav y privacidad conservan controladores existentes; la galería no abre sesiones, persiste consentimiento ni llama API. Quiz, password, hero, editorial, footer y utilidades usan sus propias secciones y contextos, como registra el índice de familias.

## Dependencias y accesibilidad

Orden storefront: tokens → [base.css](../../../assets/base.css) → [lemoon-components.css](../../../assets/lemoon-components.css) → CSS de galería/superficie. Los campos/select migrados usan delimitación continua de 1px con `--lemoon-border-strong` y foco navy de 2px con offset ≥2px, según DESIGN. Revisar pseudo-elementos, fondo real, estado error/disabled, forced-colors y recortes; no extrapolar esa corrección a todos los controles legacy.

Probar navegación y operación por teclado, label persistente, foco distinguible del borde, details nativo, strings largos y ausencia de overflow a 390/749/750/989/990/desktop. Una demo no requiere ARIA de operación comercial: anunciar sólo cambios reales y conservar recuperación en su dueño.

## Evidencia

[component-library.test.js](../../../tests/unit/component-library.test.js) renderiza los snippets y consumidores reales mediante [component-library-renderer](../../../tests/helpers/component-library-renderer.mjs); sus objetos/form/filter Shopify son fixtures declarados. Las pruebas de guía/contacto/FAQ preservan contratos de sus superficies. [component-library.spec.js](../../../tests/e2e/component-library.spec.js) es el punto de cobertura de teclado, validación nativa sin POST, details, FormData/eventos, foco y responsive **cuando se ejecuta**; su mera presencia no acredita resultados. La evidencia de ejecución y revisión pertenece al reporte de entrega de la revisión concreta.

Ninguna de estas pruebas locales acredita envío/entrega Shopify, asignaciones CMS, preview/push, datos reales de producto/receta, API/consentimiento, checkout o certificación WCAG. Conservar esas limitaciones al aceptar un nuevo consumidor.

## Muestras y estados del quiz

El dueño sigue siendo [lemoon-style-quiz](../../../sections/lemoon-style-quiz.liquid) con [CSS local](../../../assets/lemoon-style-quiz.css), [controlador](../../../assets/lemoon-style-quiz.js) y [helper puro de filtros](../../../assets/lemoon-style-quiz-filters.js). Reutilizar `lemoon-quiz-options` → `lemoon-quiz-visual` con `group`, `options`, `section_id` y `visual_id` explícitos. No hay átomo genérico de quiz. El antiguo `lemoon-quiz-candidate` permanece como legado sin render en esta sección; no añadir sus datos ni dependencias de tarjeta/precio al quiz.

El título es «Descubre tu estilo ideal.» y el subtítulo «Formas, colores y detalles que van contigo. Encuentra los tuyos.». Seis preguntas opcionales: categoría, forma, color, detalles, uso y presencia. Los grupos conservan labels/inputs nativos, fieldset/legend, `aria-label` localizado y títulos enfocables. Cuerpo/opciones/campos al menos 16px/400, acciones 16px semibold y ayudas al menos 14px. H1/H2 y tokens siguen [DESIGN](../../../DESIGN.md#quiz-de-estilo-navegación-a-catálogo); no extender esta escala a tarjetas ni a otras páginas.

Acabados y luego Materiales se apilan con encabezados localizados, visibles a la vez y sin pestañas. Mantener imágenes diferidas y selección/foco. Carey y Transparentes aparecen solo en Color con nombres de input `pattern`/`transparency` y valores `tortoise`/`transparent`; no duplicar criterios ni inferir plateado de material o transparencia de colores claros. Tonos neutros reúne las referencias existentes `neutral`, `brown`, `light`. La familia requiere las tres referencias válidas; si falta cualquiera, no se emite una URL parcial.

Las cuatro opciones de uso conservan [JPEG editorial v1](../../design/style-quiz-prototype/generated-images-v1/README.md) 480/960, dimensiones3:2, contain, alt vacío y lazy loading. Portada configurable o respaldo700/1400. Categorías y materiales conservan sus series de estudio480/960,960×640,3:2 sobre blanco; acabados su serie macro128/256 con sizes64px, miniatura64×64 y tarjetas horizontales de mínimo96px. Imágenes conceptuales, no SKU ni prueba de composición. SVG anteriores intactos; IDs de gradientes/clipPaths únicos por sección/grupo/código. Forma mantiene tres columnas, padding móvil 8px y etiquetas 16px sin truncado; Aviador y las otras siete geometrías conservan su fuente aprobada.

El inicio navy conserva espacio desde el primer render con JavaScript, disabled hasta enlazar el controlador. El marcador síncrono oculta el respaldo durante la carga, sin altura rígida. Sin JS, módulo fallido o JSON inválido, mostrar la alternativa `/collections/all` y ocultar el inicio inoperante. Un error al resolver filtros conserva la pregunta/respuestas y muestra `loading_error` localizado junto al catálogo.

El progreso son seis círculos centrados 12px/gap 20px, aro para el actual, pendientes amarillo/completados navy. Contador accesible sin texto visible. `history.state.lemoonStyleQuiz` versión 1 reserva snapshots por entrada: ruta, etapa, respuestas por códigos permitidos, progreso completado, posición/trayecto, medidas, modo manual/automático y apertura del acordeón. Fragmentos `#style-quiz-{etapa}`. Avanzar usa push; cambiar selección usa replace. Volver usa la entrada previa propia cuando existe y replace como respaldo sin entrada previa. Atrás/Adelante restauran el snapshot exacto sin push; la intro inicial no atrapa la salida. Recarga/retorno desde colección restauran estado y foco del título conocido. Preservar estado ajeno; datos corruptos vuelven a intro segura.

Medidas conserva details/summary nativo con chevron, labels/IDs por sección y feedback accesible. Solo editar los campos recalcula la autoselección editorial `2*lente+puente` (<118 compacto,118–128 intermedio,>128 oversize), tras validar lente30–80/puente10–35/patilla100–180. Restaurar no vuelve a inferir una elección manual. Valores incompletos no bloquean continuar; los campos se guardan únicamente en el snapshot del historial, sin perfil permanente ni envío comercial. No inferir ancho total/calce ni escribir medidas del producto.

El CTA final llama `buildQuizCollectionURL(answers, config)` y navega a `/collections/all`: OR dentro del mismo criterio, AND entre criterios; cada valor se envía en un parámetro repetido, como el formulario nativo, sin restricciones para preguntas omitidas. Configuración: `collectionUrl`, categorías con tipos reales de `shop.types`, diccionario `{id,group,code}` desde `metaobjects.lemoon_style_trait.values`, `dictionaryComplete` y `availableFilters` desde `collections['all'].filters`. Categoría → `filter.p.product_type`; forma/material → campos existentes; seis afinidades → `filter.v.m.custom.style_filter_{grupo}` con GIDs reales. Desconocidos, referencias ambiguas, diccionario truncado o filtro no expuesto fallan sin emitir URL parcial. No hay ranking, resultados embebidos ni enumeración 50/20.

La PLP conserva tarjetas canónicas, chips, sorting, contador, vacío y paginación nativos; sus consumidores y dependencias siguen en [receta de catálogo](product-card-grid.md). No sustituir ausencia de configuración por filtrado DOM. Ruta pública prevista `/pages/descubre-tu-estilo`; la anterior debe responder 404 sin redirección, aunque el template interno mantenga su nombre. Fuente local, fixtures y Theme Check no prueban CMS, exposición de filtros, proyección de datos ni despliegue. [Estado administrativo y aceptación pendiente](../../catalog/style-quiz.md#estado-de-preparación-al-06-11-2026).


## Drawer móvil por defecto

`layout/theme.liquid` carga `component-lemoon-drawer.css` una vez, después de los componentes base. Hasta749px, toda nueva composición nativa usa `class="lemoon-drawer"` sobre su `<dialog>` y recibe hoja inferior, ancho completo, radio superior16px, overlay con franja mínima32px, safe-area y scroll interno. Debe aportar título accesible, cierre visible y su controlador existente (`showModal`/`close`, Escape, foco y retorno); esta clase comparte presentación, no crea un controlador. El tamaño desktop pertenece al consumidor.

Los adaptadores incluidos cubren los paneles exteriores existentes de medidas, carrito, navegación Lemoon, filtros Dawn/PLP y retiro. No agregar la clase a paneles internos/submenús, popovers ni modales centrados. El HeaderDrawer Dawn legacy no utilizado por el header vigente mantiene pendiente su adaptación y cierre interno; no se declara cubierto. En móvil, navegación conserva Cerrar y Volver dentro del sheet; al desaparecer el opener por resize, cierra y devuelve el foco a un control visible del header. Filtros reposiciona su cierre y retiro monta un backdrop hermano que intercepta clics sin atravesar al fondo. Los datos y acciones comerciales permanecen en sus dueños.

Verificar390/749/750/820/1440 y320px/texto200%, apertura vertical, overlay visible, cierre/teclado/foco/retorno, scroll interno y movimiento reducido. Pruebas de abrir/cerrar carrito con fixtures no acreditan add-to-cart, precios, AJAX ni checkout.

Carrito: la trampa de foco se activa también si el panel tiene duración de transición0; el controlador no espera un evento que no se emite con movimiento reducido. Probar cierre y retorno de foco en ambas preferencias.

Cierre de medidas: utilizar `requestClose()` de la instancia `lemoon-size-guide`, conservando el cierre nativo como respaldo. No importar el módulo PDP desde otro controlador con una URL sin versión, porque duplicaría el bootstrap respecto al script versionado de Shopify. El panel móvil permanece opaco al bajar; en motores sin transición de overlay, la instancia retiene la modalidad hasta finalizar transform y limpia el estado temporal.
