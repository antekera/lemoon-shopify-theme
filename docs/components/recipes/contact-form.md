# Contacto nativo: campos y respuesta

Familias: LM-CONTACT, LM-FIELD, LM-FEEDBACK, LM-ACTION. Volver al [catálogo](../README.md).

## Dueño y contratos

[lemoon-contact-page](../../../sections/lemoon-contact-page.liquid) conserva `{% form 'contact' %}`, `form`, `customer`, precedencia de valores, errores y respuesta. [field](../../../snippets/lemoon-ui-field.liquid), [message](../../../snippets/lemoon-ui-message.liquid), [heading](../../../snippets/lemoon-ui-heading.liquid) y [action](../../../snippets/lemoon-ui-action.liquid) presentan esos datos. El contacto Dawn de [contact-form](../../../sections/contact-form.liquid) sigue siendo otro consumidor legacy; no fue migrado automáticamente.

| Pieza | Entradas a elegir en el consumidor |
| --- | --- |
| field | `kind` input/default o textarea; `id`, `name`, `label`, `type`, `value`, `rows`; `required`, `disabled`, `readonly`, `autocomplete`, `autocorrect`, `autocapitalize`, `aria_required`, `spellcheck`, `placeholder`, `inputmode`, `form_id` |
| Feedback de field | `invalid`, `describedby`, `hint`, `hint_id`, `error`, `error_id`; clases `wrapper_class`, `control_class`, `label_class`, `hint_class`, `error_class` |
| Familia de field | `style_family: 'contact'` conserva label antes del control; base conserva orden flotante Dawn, con placeholder adecuado al diseño del consumidor |
| message | `tag` p/default, div o h3 para status headings existentes; `text` escapado o `content_html` capturado; `id`, `class`, `role`, `live`, `tabindex`, `autofocus`, `hidden` explícitos |
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

## Newsletter del footer y comentarios de artículo

[footer](../../../sections/footer.liquid) mantiene `{% form 'customer' %}`, tags newsletter, email, name commit, IDs de sección y ramas independientes de error/éxito. El field usa `unwrapped: true`, `label_before: true`, label `visually-hidden` y control `lemoon-newsletter__input`. El formulario conserva el grid y añade `lemoon-ui-field` al padre para reutilizar contorno/foco existentes sin un div nuevo. `autocorrect: 'off'`, autocomplete email, autocapitalize off y `aria_required: true` se pasan explícitos. Error usa role alert; éxito conserva tabindex -1 sin inventar role/live/autofocus. Sus strings pasan sin preescape a message.

[main-article](../../../sections/main-article.liquid) mantiene `{% form 'new_comment', article %}`, nombres `comment[author]`, `comment[email]`, `comment[body]`, required/aria-required, valores retornados, rows 5 y autocomplete original. `label_suffix_html` es sólo el capture confiable del asterisco decorativo; `feedback_html` es el capture confiable del small con icono y error de autor/email, dentro del wrapper original. El error body sigue fuera de su field como antes. Escapar datos externos dentro de capturas; nunca pasar texto del cliente como HTML. Los slots no modifican hint/error existentes ni sus asociaciones automáticas.

Message con `tag: 'h3'` conserva heading, icono capturado, tabindex -1 y autofocus dentro del div alert/status original; la sección conserva lista de errores y moderación. Action con `element: 'input', type: 'submit'` conserva el submit input original y usa `label` como value escapado, sin hijos ni cierre input. Sólo esa combinación selecciona input; a/button y defaults de otros consumidores no cambian. No añadir spinner/icon a ese input nativo.

`label_before` y `unwrapped` requieren booleano true; `aria_required` preserva false y se omite si no se pasa. Ningún parámetro acepta un bag de atributos arbitrarios. [second-wave.test.js](../../../tests/unit/second-wave.test.js) cubre compatibilidad y [second-wave.spec.js](../../../tests/e2e/second-wave.spec.js) compara DOM previo, validación nativa/FormData sin POST, foco/forced-colors y reflujo. Los tags Shopify y estados de respuesta son adaptadores deterministas; comentarios publicados, captcha y suscripción real siguen sin comprobarse en Shopify.
