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

El botón de inicio conserva su espacio y aspecto navy desde el primer render con JavaScript habilitado; permanece deshabilitado hasta enlazar el controlador. Un marcador síncrono local oculta los resultados editoriales durante esa carga para que tampoco desplacen el footer al inicializar. Sin JavaScript, ante descarga fallida del módulo o datos inválidos, se conserva el catálogo editorial y se oculta el inicio inoperante. No se reserva una altura rígida ni se modifica el ranking.

El quiz conserva sus dueños `lemoon-quiz-options` → `lemoon-quiz-visual`. Para las cuatro opciones de uso, `lemoon-quiz-options` muestra la serie JPEG editorial v1 con srcset 480/960, proporción 3:2, dimensiones explícitas, alt vacío y carga diferida; el texto HTML mantiene el significado y el input/label nativo conserva interacción/foco. Son escenas conceptuales, no fotos de SKU. Las demás opciones conservan SVG: el primer snippet construye `visual_id` con sección/grupo/código y lo pasa explícitamente al render; cada gradiente/clipPath usa ese prefijo. Conservar IDs únicos incluso con dos secciones en una página. Los SVG anteriores de acabado/patrón permanecen como legado y no certifican características de un SKU. La portada usa su imagen del editor cuando está configurada, o el respaldo editorial v1 con srcset 700/1400. [Originales, prompts y exports](../../design/style-quiz-prototype/generated-images-v1/README.md).

El acabado cálido, indicador circular visible en reposo, estados de puntero/selección y resumen móvil se limitan a `.lemoon-quiz`; no se trasladan a `card-product`. Los resultados mantienen dos columnas móviles y separaciones 1.2rem/2.4rem, sin texto de afinidad por tarjeta. [Contrato visual](../../../DESIGN.md) y [spec local](../../design/style-quiz-prototype/visual-finishing-spec.md).

El quiz comienza por categoría con radios ópticos/solares y permite continuar sin seleccionar. `lemoon-quiz-candidate` exporta la categoría desde `product.type`; el controlador filtra antes de puntuar afinidad y adapta los usos solares (sin Trabajo/estudio, Paseos y viajes). Seis pasos y accesos de edición; imágenes de categoría genéricas existentes, decorativas. Contrato de clasificación y límites en [guía de catálogo](../../catalog/style-quiz.md#separación-entre-ópticos-y-solares).

Navegación actual del quiz: seis círculos independientes centrados con aro para el actual, amarillos pendientes/navy completados; progressbar accesible y anuncio de etapa oculto visualmente. Volver ocupa el lugar inferior de Muéstrame variedad y conserva respuestas. Continuar sin seleccionar mantiene preguntas opcionales. Ir atrás desde resultados conserva respuestas y progreso.

Familia Forma: las ocho opciones usan outline frontal realista simplificado como icono, contorno único de 5 unidades navy sin líneas interiores, microdetalles, relleno ni sombra. Mantener SVG decorativo, label/checkbox y códigos originales. El dibujo aprobado de Aviador se conserva exacto; las siete restantes comparten escala/trazo y mantienen proporciones y puentes propios. [Referencias y criterio](../../design/style-quiz-prototype/visual-finishing-spec.md#familia-de-formas-outline-realista).

Color del quiz: siete opciones compactas con muestra plana y texto; Carey usa input pattern/tortoise y Transparentes transparency/transparent aunque se presenten dentro de Color. Mantener IDs únicos por sección/grupo/código. Sus controles aparecen solo en Color; Detalles conserva únicamente Acabados y Materiales. Reutilizar el criterio original evita sumar dos veces el mismo rasgo. No inferir plateado de material ni transparencia de color claro.

Las elecciones ópticos/solares del primer paso usan imágenes de estudio blanco generadas, una montura por imagen en perspectiva; serie category-studio-v1 con JPEG480/960, srcset/sizes, dimensiones3:2 y contain. Conservar label y radio; imagen decorativa sin alt duplicado. Los assets anteriores se preservan.

Materiales usa la misma rama de imagen de estudio que categoría: prefix `lemoon-quiz-{group}-{code}-studio-v1-`, exports480/960, dimensions960×640, srcset/sizes, carga diferida y contain. Los seis valores siguen siendo inputs material; etiqueta y selección se conservan. Imágenes de referencia generadas, no SKU ni evidencia de composición. Mantener los SVG anteriores intactos.

Acabados usa una rama fotográfica propia en `lemoon-quiz-options`: serie finish-macro-v1, JPEG128/256 con sizes64px, dimensiones128×128, alt vacío y carga diferida. Tarjetas horizontales de mínimo96px con miniatura64×64, texto al lado y check al seleccionar; no aplicar la proporción3:2 de categoría/material/uso. Mate y Brillante mantienen input finish, códigos y foco nativo.

Medidas del quiz: mantener details/summary nativo con chevron decorativo girado por [open]. Labels e IDs usan sección+medida, inputs opcionales con inputmode numeric y feedback role=status. La autoselección se ejecuta solo ante input de las medidas; no recalcular al mostrar etapa o abrir acordeón para respetar override manual. Presence usa radio único. Regla editorial y rangos documentados en DESIGN.md; no exportar las referencias al pedido ni escribir medidas de producto.

Resultados del quiz: usar dl/dt/dd para las seis preferencias, nunca botones o enlaces. Retícula3/2 con filas1fr para tamaño uniforme y valores completos. Solo data-quiz-results-back gestiona el retorno al último paso, conservando estado; no restaurar handlers de edición directa ni reinicio. Catálogo usa lemoon-quiz__button relleno con radio del tema. El aviso demo visible se retira; las banderas de datos no se tocan.

Explorar el catálogo del quiz, en entrada y resultados, siempre usa routes.all_products_collection_url (/collections/all). La colección curada configurada sigue siendo fuente de candidatos, sin determinar ese destino.
