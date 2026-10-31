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

Esta receta documenta código canónico y extracciones acotadas de presentación. Las secciones conservan formularios, controladores y decisiones comerciales. Las pruebas de los seis snippets UI no validan tarjeta, checkout, datos de stock, imágenes de Shopify ni integración de receta. La integración de una nueva lista requiere sus pruebas y contexto real; los estados sintéticos de la [galería](catalogue-states.md) no aportan esa aceptación.


## Impuestos y envío del carrito

[lemoon-cart-tax-note](../../../snippets/lemoon-cart-tax-note.liquid) recibe `cart` y `shipping_policy`; conserva el small tax-note y las ocho combinaciones nativas de duties/taxes/política con sus traducciones HTML. Se reutiliza en main-cart-footer, cart-drawer y quick-order-list. No calcula totales ni envía checkout.

```liquid
{% render 'lemoon-cart-tax-note', cart: cart, shipping_policy: shop.shipping_policy %}
```

## Precio unitario por volumen

[lemoon-product-unit-price](../../../snippets/lemoon-product-unit-price.liquid) presenta el price-per-item de main-product y featured-product. Recibe `variant`, `section_id`, `current_quantity`, `price_breaks` y `base_price` ya formateado. El dueño conserva `product.quantity_price_breaks_configured?`, la ordenación nativa de breaks, el cálculo de cantidad desde cart/min/increment y `variant_price` cuando alimenta el data-text de la tabla posterior. No mover esas asignaciones a render: las variables internas del snippet no vuelven al dueño.

```liquid
{% render 'lemoon-product-unit-price', variant: product.selected_or_first_available_variant, section_id: section.id, current_quantity: current_qty_for_volume_pricing, price_breaks: volume_pricing_array, base_price: variant_price %}
```

Mantener product-info.js/price-per-item.js, `Price-Per-Item-<section>`, data-section-id/data-variant-id, controles Quantity y tabla Volume en su contexto existente. El snippet conserva selección por tramo y compare-at; no sustituye price.liquid ni unit-price.liquid de unidad de medida.

## Respuestas de carrusel y controles Dawn

[lemoon-carousel-results](../../../snippets/lemoon-carousel-results.liquid) recibe `products`, `next_url`, `section_id` y `show_quick_add`. Los dos templates collection.carousel conservan layout none y paginate por 10. La lista compartida conserva productos disponibles con precio positivo y card-product con estilos omitidos, pues el dueño ya carga dependencias. El template normal usa namespace carousel y quick-add false; accesorios usa accessory-carousel y true. Conservar ambos endpoints: lemoon-featured-products.js usa sus respuestas y data-next-page.

```liquid
{% render 'lemoon-carousel-results', products: collection.products, next_url: paginate.next.url, section_id: 'accessory-carousel', show_quick_add: true %}
```

[lemoon-dawn-slider-controls](../../../snippets/lemoon-dawn-slider-controls.liquid) recibe `total` y `class` opcional; lo usan collection-list, featured-blog y multicolumn dentro de slider-component. Cada dueño conserva condiciones de visibilidad/conteos y carga global.js/component-slider.css. Los nombres previous/next y las clases slider-counter son hooks del controlador Dawn; no intercambiarlo con lemoon-carousel-controls, que utiliza data-lemoon-carousel-* y otro controlador.

```liquid
{% render 'lemoon-dawn-slider-controls', total: section.blocks.size, class: 'large-up-hide' %}
```

[consumer-contract.test.js](../../../tests/unit/consumer-contract.test.js) y [consumer-contract.spec.js](../../../tests/e2e/consumer-contract.spec.js) comparan referencias previas de los consumidores y ejercitan estados de precio, impuestos, ordenación y slider en fixtures locales. El límite card-product de las respuestas de carrusel se modela para comprobar parámetros; esas pruebas no acreditan quick-add real, precios/moneda efectivos, Section Rendering de Shopify ni procesamiento de carrito.
