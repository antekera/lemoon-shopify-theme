# FAQ agrupado y respuestas con markup

Familias: LM-DISCLOSURE, LM-TYPE, LM-ACTION. Volver al [catálogo](../README.md).

## Fuente y frontera

[lemoon-faq-page](../../../sections/lemoon-faq-page.liquid) conserva grupos, conteo, navegación y routing. [faq-item](../../../snippets/lemoon-ui-faq-item.liquid) presenta un `details/summary`: `id`, `question`, `question_level`, `answer_html`, `class`, `answer_class`, `open`, `editor_attributes`, `indicator`. El título usa [heading](../../../snippets/lemoon-ui-heading.liquid); la ayuda usa [action](../../../snippets/lemoon-ui-action.liquid). [lemoon-faq](../../../sections/lemoon-faq.liquid) reutiliza heading/faq-item; disclosures PDP y collapsible-content conservan sus contratos independientes.

La API admite heading 1–6 por `question_level`; en esta composición se usa 3 bajo grupos H2. Omitirlo deja texto directo en summary. `indicator: 'page-svg'` conserva el plus/minus existente; omitido/none no añade SVG. `open: true` abre details; false/omitido lo deja cerrado. No hay variantes loading/error/disabled de FAQ.

## Ejemplo de bloque personalizado

Dentro del loop y grupo de la sección, después de comprobar que pregunta y respuesta no están vacías:

```liquid
{%- capture faq_id -%}FaqBlock-{{ section.id }}-{{ block.id }}{%- endcapture -%}
{%- capture faq_answer_html -%}
  {{ block.settings.answer }}
  {%- if block.settings.link != blank and block.settings.link_label != blank -%}
    <a href="{{ block.settings.link | escape }}">{{ block.settings.link_label | escape }}</a>
  {%- endif -%}
{%- endcapture -%}
{% render 'lemoon-ui-faq-item', id: faq_id, question: block.settings.question, question_level: 3, answer_html: faq_answer_html, class: 'lemoon-faq-page__question', answer_class: 'lemoon-faq-page__answer rte', editor_attributes: block.shopify_attributes, indicator: 'page-svg' %}
```

`answer_html` es la respuesta completa capturada; el richtext del editor conserva párrafos y enlaces, sin envolverlo en otro p. `question` se pasa sin preescape, pues el snippet lo escapa. `editor_attributes` sólo acepta `block.shopify_attributes` confiable y queda en la raíz details; no es un bag libre de atributos.

Para fallback, la sección captura p con `question_answer_key | t` y enlace con ruta y etiqueta localizadas; usa `FaqQuestion-<section>-<group>-<question>` y clase de respuesta sin `rte`. Los grupos sin preguntas personalizadas completas conservan **11 preguntas fallback en total** (3/2/3/3); un bloque incompleto no suprime fallback. Un grupo con bloques completos usa esos bloques. Mantener grupos y destinos en el dueño, no dentro del snippet.

## Dependencias y comprobación

CSS scoped del consumidor conserva summary, indicadores, espaciado y `[open]`; el layout carga [base](../../../assets/base.css) y [componentes](../../../assets/lemoon-components.css). Operación nativa details por teclado, sin controlador nuevo. Evitar IDs `Details-*`: [global.js](../../../assets/global.js) aplica comportamiento adicional a ese prefijo, que los IDs `FaqQuestion-*`/`FaqBlock-*` no solicitan.

Comprobar abierto/cerrado, Enter/Space, foco visible, enlace interno y contenido largo sin altura fija ni overflow; conservar H1/H2/H3 y anclas de grupo únicas entre instancias. El estado expandido es nativo, sin `aria-expanded` manual. [faq-page.test.js](../../../tests/unit/faq-page.test.js) y [component-library.test.js](../../../tests/unit/component-library.test.js) cubren fallback, custom y contratos renderizados locales. No prueban editor Shopify, asignación activa de template ni aceptación del contenido comercial.

## FAQ legacy

[page.preguntas-frecuentes](../../../templates/page.preguntas-frecuentes.json) conserva `lemoon-faq` como dueño. Su H1 usa heading y mantiene fallback de page.title. Cada bloque captura el richtext completo y pasa `question`, `answer_html`, `answer_class: 'lemoon-faq__answer rte'`, `editor_attributes: block.shopify_attributes` y `open: forloop.first` a faq-item. Omite id, question_level e indicator para conservar summary de texto directo, sin SVG, y la primera pregunta abierta. No se introducen grupos ni fallback del FAQ agrupado en esta sección. CSS sigue en lemoon-legal-pages.css. [Prueba de DOM y teclado](../../../tests/e2e/component-adoption.spec.js) conserva editor attrs y enlaces richtext en fixtures locales; no acredita selección real del editor.
