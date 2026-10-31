# Tarjeta de producto y composición de catálogo

Familias: LM-PRODUCT-CARD, LM-PRICE, LM-SWATCH, LM-LABEL, LM-PRODUCT-LIST y contratos comerciales relacionados. Volver al [catálogo](../README.md).

## Reutilizar el código canónico

[card-product](../../../snippets/card-product.liquid) ya es reutilizable; **no existe ni hace falta un wrapper `lemoon-ui-card`**. Consumidores: [lemoon-featured-products](../../../sections/lemoon-featured-products.liquid), [main-collection-product-grid](../../../sections/main-collection-product-grid.liquid), [main-search-results](../../../snippets/main-search-results.liquid). El grid, paginación y vacío pertenecen a esas superficies, no a la tarjeta. La tarjeta comercial de la galería independiente no es este snippet.

| API existente | Uso |
| --- | --- |
| `card_product`, `section_id` | Product Liquid real e identidad de sección; conservar IDs de enlaces/formularios |
| `media_aspect_ratio`, `image_shape` | Respetar la geometría y overrides de la superficie, no imponer proporción global |
| `show_secondary_image`, `lazy_load` | Media secundaria y carga diferida; false explícito permite imagen prioritaria donde el dueño lo decida |
| `show_vendor`, `show_rating`, `extend_height`, `horizontal_class` | Opcionales según el contrato actual de card-product |
| `skip_styles` | En un loop, sólo después de que la primera tarjeta haya cargado dependencias; false en primer render |
| `show_quick_add`, `placeholder_image` | Quick add requiere contexto y JS propios; placeholder es demostración, no producto real |

Consultar siempre el encabezado y uso real del snippet: también lee settings/request globales y compone precio, labels y swatches. No es una API pura ni prueba de un Product Drop que un objeto de fixture local tenga campos parecidos.

## Ejemplo dentro de una sección con colección real

El contenedor/grid y el caso vacío son del dueño existente; este loop muestra únicamente los renders y la carga única de estilos:

```liquid
{%- for item in collection.products -%}
  {%- assign skip_card_styles = false -%}
  {%- unless forloop.first -%}
    {%- assign skip_card_styles = true -%}
  {%- endunless -%}
  {% render 'card-product', card_product: item, section_id: section.id, show_secondary_image: true, show_vendor: false, show_rating: false, lazy_load: true, skip_styles: skip_card_styles, show_quick_add: false %}
{%- endfor -%}
```

Para precio independiente:

```liquid
{% render 'price', product: product, use_variant: true, show_badges: false %}
```

[price](../../../snippets/price.liquid) compone [lemoon-money](../../../snippets/lemoon-money.liquid) y precios de producto/variante; disponibilidad, descuento y moneda no se inventan en el consumidor. [swatch-input](../../../snippets/swatch-input.liquid) requiere `id`, `name`, valor de opción/SwatchDrop, `product_form_id`, `checked` y estado; preservar el selector de variantes y su contrato de escaping existente. Su `additional_props` legacy no autoriza contenido externo libre ni amplía los contratos nuevos UI. [lemoon-product-card-labels](../../../snippets/lemoon-product-card-labels.liquid) deriva etiquetas de datos reales. Iconos/spinner y [lemoon-carousel-controls](../../../snippets/lemoon-carousel-controls.liquid) siguen siendo sus implementaciones canónicas.

## Dependencias y fronteras comerciales

El layout mantiene tokens → [base](../../../assets/base.css) → [componentes](../../../assets/lemoon-components.css). El dueño de lista carga [component-card.css](../../../assets/component-card.css); card-product incluye precio/rating según opciones y [lemoon-product-card.js](../../../assets/lemoon-product-card.js) salvo `skip_styles`. Con quick add, usar el consumidor real con [quick-add.css](../../../assets/quick-add.css), [quick-add.js](../../../assets/quick-add.js), [product-form.js](../../../assets/product-form.js) y sus dependencias; no activar el flag aislado en una demo.

PLP conserva [lemoon-collection-plp.css](../../../assets/lemoon-collection-plp.css), columnas y responsive locales. PDP/media/tabs conservan `product-media-gallery`, `lemoon-size-guide-content` y [lemoon-pdp-tools.js](../../../assets/lemoon-pdp-tools.js). `quantity-input` y `lemoon-price-slider` tienen límites y dueños distintos. Opciones de variante no son un radio genérico pendiente de inventar.

[buy-buttons](../../../snippets/buy-buttons.liquid), frame-only/select-lenses, configurador/receta, carrito, volumen, pickup y gift card permanecen en sus contratos nativos. `lemoon-ui-action` no los sustituye: formularios, variantes, precios, stock, consentimiento y elegibilidad quedan en el dueño. No concluir desuso por falta de un consumidor estático.

## Estados, accesibilidad y evidencia

Probar frontal/secundaria ausente, imagen pendiente, producto sin media, título largo, precio normal/oferta, agotado y variantes. Mantener nombre accesible, foco de enlaces/acciones, alt, región de precio y estado seleccionado accesible del swatch. Error/loading/disabled de compra pertenecen al formulario y controlador; la tarjeta sola no demuestra recuperación de una operación.

Esta receta documenta contratos existentes **sin migración comercial por LEM-142**. Las pruebas de los seis snippets UI no validan tarjeta, checkout, datos de stock, imágenes de Shopify ni integración de receta. La integración de una nueva lista requiere sus pruebas y contexto real; los estados sintéticos de la [galería](catalogue-states.md) no aportan esa aceptación.
