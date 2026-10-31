# Ordenación de búsqueda y resultados

Familias: LM-FIELD, LM-FACET, LM-SEARCH; tarjetas CMS, navegación, búsqueda móvil y journal conservan APIs propias. Volver al [catálogo](../README.md).

## Dueño y condiciones de uso

[main-search-results](../../../snippets/main-search-results.liquid), consumido por [main-search](../../../sections/main-search.liquid), usa [select](../../../snippets/lemoon-ui-select.liquid) **sólo en ordenación vertical de búsqueda**: `show_all_products == false`, sorting activado, filtro vertical y filtros no vacíos. Mantener estas condiciones y `facet-filters-form`/`FacetSortForm`; el átomo no determina qué opciones son admisibles ni cambia la política de colección.

Select recibe `id`, `name`, `options_html`, `class`, `wrapper_class`, `labelledby`, `aria_label`, `describedby`, `form_id`, `required`, `disabled`, `multiple`, `show_caret`. El wrapper default es `.select`, el control default `.select__select`; el caret existente aparece salvo `show_caret: false`. El label persistente es externo y responsabilidad del consumidor. No hay parámetro genérico de atributos ni HTML externo libre.

## Ejemplo en el formulario existente

Dentro de `FacetSortForm` y su contenedor `.facet-filters__field`:

```liquid
<h2 class="facet-filters__label caption-large text-body">
  <label for="SortBy">{{ 'products.facets.sort_by_label' | t | escape }}</label>
</h2>
{%- assign sort_by = search.sort_by | default: search.default_sort_by -%}
{%- capture sort_options_html -%}
  {%- for option in search.sort_options -%}
    <option value="{{ option.value | escape }}"{% if option.value == sort_by %} selected="selected"{% endif %}>{{ option.name | escape }}</option>
  {%- endfor -%}
{%- endcapture -%}
{% render 'lemoon-ui-select', id: 'SortBy', name: 'sort_by', options_html: sort_options_html, class: 'facet-filters__sort select__select caption-large', describedby: 'a11y-refresh-page-message' %}
```

`options_html` conserva opciones nativas y selección; se escapan value/name dentro de la captura, que el snippet emite como markup. El elemento `a11y-refresh-page-message` existe en el layout; conservarlo al integrar. Mantener hidden inputs de términos/options, contador de resultados y propagación de input/change del formulario. Un render aislado del select no reemplaza esta composición. En un nuevo dueño generar ID único y actualizar el label; no duplicar `SortBy` en la misma página.

## CSS, JS y otras superficies

El layout carga tokens, [base](../../../assets/base.css) y [componentes](../../../assets/lemoon-components.css). La sección conserva [component-facets.css](../../../assets/component-facets.css), [component-search.css](../../../assets/component-search.css), [facets.js](../../../assets/facets.js), [main-search.js](../../../assets/main-search.js) y sus dependencias declaradas. El wrapper/control migrado aplica la corrección de borde/foco de DESIGN, sin crear una nueva variante visual.

[facets](../../../snippets/facets.liquid) sigue siendo el contrato canónico de filtros; [pagination](../../../snippets/pagination.liquid) necesita un objeto paginate real. [main-search-result-card](../../../snippets/main-search-result-card.liquid), [article-card](../../../snippets/article-card.liquid) y [card-collection](../../../snippets/card-collection.liquid) no son card-product. Búsqueda móvil usa [lemoon-mobile-search](../../../snippets/lemoon-mobile-search.liquid) y su controlador; no migrarla a este select. Journal/comentarios y 404 siguen en sus secciones nativas, con sus propios estados y objetos.

## Estados y evidencia

Normal/foco/selección/disabled/multiple son nativos; loading/error/vacío y recuperación pertenecen a búsqueda/facets. Omitir booleanos deja atributos ausentes; false no se convierte en un atributo nativo activado. Verificar teclado, label, FormData `sort_by`, selected, eventos que llegan al formulario, términos conservados y estado de resultados tras actualizar.

[component-library.test.js](../../../tests/unit/component-library.test.js) ejercita options/selección y el consumidor con fixtures; la cobertura de navegador local se describe en [catalogue-states](catalogue-states.md#evidencia). No equivale a respuesta real de búsqueda Shopify, historial/red de facets ni prueba de la política de sort de colección, que queda intacta.
