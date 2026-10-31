# Contacto nativo: campos y respuesta

Familias: LM-CONTACT, LM-FIELD, LM-FEEDBACK, LM-ACTION. Volver al [catálogo](../README.md).

## Dueño y contratos

[lemoon-contact-page](../../../sections/lemoon-contact-page.liquid) conserva `{% form 'contact' %}`, `form`, `customer`, precedencia de valores, errores y respuesta. [field](../../../snippets/lemoon-ui-field.liquid), [message](../../../snippets/lemoon-ui-message.liquid), [heading](../../../snippets/lemoon-ui-heading.liquid) y [action](../../../snippets/lemoon-ui-action.liquid) presentan esos datos. El contacto Dawn de [contact-form](../../../sections/contact-form.liquid) sigue siendo otro consumidor legacy; no fue migrado automáticamente.

| Pieza | Entradas a elegir en el consumidor |
| --- | --- |
| field | `kind` input/default o textarea; `id`, `name`, `label`, `type`, `value`, `rows`; `required`, `disabled`, `readonly`, `autocomplete`, `autocapitalize`, `spellcheck`, `placeholder`, `inputmode`, `form_id` |
| Feedback de field | `invalid`, `describedby`, `hint`, `hint_id`, `error`, `error_id`; clases `wrapper_class`, `control_class`, `label_class`, `hint_class`, `error_class` |
| Familia de field | `style_family: 'contact'` conserva label antes del control; base conserva orden flotante Dawn, con placeholder adecuado al diseño del consumidor |
| message | `tag` p/default o div; `text` escapado o `content_html` capturado; `id`, `class`, `role`, `live`, `tabindex`, `autofocus`, `hidden` explícitos |
| Submit | action con `type: 'submit'`, familia local y clase `lemoon-contact__submit`; sin loading ni envío AJAX inventado |

## Ejemplo dentro del formulario dueño

Este fragmento usa el `contact_form_id` de la sección. El ejemplo completo y las cuatro llamadas están en el consumidor; no trasladar la selección de valores al snippet.

```liquid
{%- form 'contact', id: contact_form_id, class: 'lemoon-contact__form' -%}
  {%- liquid
    assign email_id = contact_form_id | append: '-email'
    assign email_label = 'sections.lemoon_contact_page.email' | t
    assign email_value = form.email
    if email_value == nil and customer
      assign email_value = customer.email
    endif
    assign email_error_id = contact_form_id | append: '-email-error'
    assign email_invalid = nil
    assign email_error = nil
    if form.errors contains 'email'
      assign email_invalid = true
      assign email_error = form.errors.translated_fields.email | capitalize | append: ' ' | append: form.errors.messages.email
    endif
    assign send_label = 'sections.lemoon_contact_page.send' | t
  -%}
  {% render 'lemoon-ui-field', style_family: 'contact', id: email_id, name: 'contact[email]', label: email_label, type: 'email', autocomplete: 'email', autocapitalize: 'off', spellcheck: false, value: email_value, required: true, invalid: email_invalid, error: email_error, error_id: email_error_id, error_class: 'lemoon-contact__error' %}
  {% render 'lemoon-ui-action', type: 'submit', label: send_label, style_family: 'local', class: 'lemoon-contact__submit' %}
{%- endform -%}
```

La sección real incluye nombre `contact[name]` requerido/autocomplete name; correo requerido; teléfono `contact[phone]` tel/autocomplete tel **opcional**, sin patrón nuevo; mensaje `contact[body]` textarea de 6 filas requerido con hint. En textarea `value` se emite como texto interno escapado. Se conserva un string vacío retornado por `form` en vez de reemplazarlo por datos de cliente.

Las respuestas se componen dentro de ese mismo formulario, bajo sus condiciones reales:

```liquid
{%- if form.posted_successfully? -%}
  {%- assign success_text = 'sections.lemoon_contact_page.success' | t -%}
  {% render 'lemoon-ui-message', text: success_text, class: 'lemoon-contact__status lemoon-contact__status--success', role: 'status', live: 'polite', tabindex: '-1', autofocus: true %}
{%- elsif form.errors -%}
  {%- capture contact_errors_html -%}
    <p>{{ 'sections.lemoon_contact_page.error_heading' | t | escape }}</p>
    {{ form.errors | default_errors }}
  {%- endcapture -%}
  {% render 'lemoon-ui-message', tag: 'div', content_html: contact_errors_html, class: 'lemoon-contact__status lemoon-contact__status--error', role: 'alert', live: 'assertive', tabindex: '-1', autofocus: true %}
{%- endif -%}
```

`default_errors` es markup nativo confiable capturado. El resto de strings y atributos del snippet se escapan una vez; no preescapar valores del cliente. `content_html` tiene precedencia sobre `text`, incluso si se suministra vacío. Message no asigna rol/live/foco por defecto. Hint y error no vacíos con ID se agregan a `describedby`, preservando ayudas existentes. Pasar `false` booleano mantiene spellcheck/ARIA falso; omitir `invalid` mantiene el atributo ausente.

## CSS, estados y evidencia

El layout aporta tokens → [base.css](../../../assets/base.css) → [lemoon-components.css](../../../assets/lemoon-components.css). El CSS scoped de contacto mantiene geometría, labels y submit. Los controles migrados añaden delimitación continua con `--lemoon-border-strong` y foco separado según [DESIGN](../../../DESIGN.md#5-componentes-y-estados); revisar pseudo-elementos Dawn, clipping y fondos computados. Esto no certifica campos legacy.

Normal/foco/error/disabled/readonly son estados de control; el error conserva valor y recuperación. Loading pertenece al dueño si existe; contacto nativo no añade JS de loading. Validar labels persistentes, IDs únicos, ayuda/error asociados, required/email y teclado sin enviar un POST. [contact-page.test.js](../../../tests/unit/contact-page.test.js) y [component-library.test.js](../../../tests/unit/component-library.test.js) ejercitan fuentes reales con un form/errores Shopify modelado en fixtures. La prueba local no acredita envío ni entrega de correo, captcha, respuesta real de Shopify o configuración del editor.
