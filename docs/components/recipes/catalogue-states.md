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
