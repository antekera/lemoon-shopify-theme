# Compra de tarjeta regalo — Lemoon

Implementación dentro del plan general aprobado de páginas restantes. LEM-9
permanece In Progress. No activar venta ni emitir tarjetas durante la revisión.

## Referencias y resultado

El outline Cover de Figma consultado no incluye una pantalla dedicada de tarjetas
regalo. Usar identidad compartida del home/PDP/PLP y la composición de Ace & Tate:
https://www.aceandtate.com/es/giftcard-variable-price. Referencia secundaria:
https://www.warbyparker.com/accessories. Copiar composición y claridad del flujo,
no textos, derechos comerciales, imágenes ni capacidades de esas tiendas.

Dos columnas desktop: superficie beige con tarjeta visual navy a la izquierda;
título «Tarjeta de regalo», explicación breve, monto y formulario a la derecha.
Mobile una columna. El monto visual debe venir del precio de la variante elegida,
no del título de la opción ni de una constante. Tarjeta ilustrativa sin códigos
reales o simulados. Usar logo SVG existente en superficie clara; no inventar sello.
Tipografía Urbanist/Hanken; tokens semánticos Lemoon; foco visible y controles44px.

## Sección y datos

`sections/lemoon-gift-card-purchase.liquid`, reutilizable en página y producto.
En template producto, usar product si product.gift_card?. En página, usar selector
`gift_card_product`; nunca aceptar un producto normal como tarjeta regalo.
Conservar como futuro destino real `/products/tarjeta-de-regalo`; alternativa
page `page.gift-card.json` para revisión y enlace desde CMS si corresponde.
El producto actual no existe; se está preparando una tarjeta nativa en borrador.
Las denominaciones del ticket son CLP30.000/60.000/100.000, variantes reales.
Shopify no admite monto libre nativo en storefront. Mostrar «¿Necesitas otro
monto? Consúltanos» con URL editable de contacto. No anunciar monto libre comprable.

## Contrato HTML y módulo JS (propiedad del agente padre)

Raíz `[data-gift-purchase]`; datasets `data-error-message` y `data-cart-url`
(ruta nativa localizada). Formulario Shopify `{% form 'product', gift_product %}`
con `data-gift-form`, sin novalidate. Cantidad hidden1. Denominaciones: radios
`name="id"` con ID real, `data-gift-variant` y `data-formatted-price` = precio con
moneda escapado. Deshabilitar variantes unavailable; elegir variante seleccionada
si está disponible, en otro caso primera disponible. `[data-gift-price]` en visual
y resumen. Formulario sin JS debe enviar el mismo ID elegido. No hidden ID adicional.

Destinatario opcional con campos nativos:
- `properties[Recipient email]` type=email, `[data-recipient-email]`.
- `properties[Recipient name]` type=text, max255.
- `properties[Message]` textarea max200.
- hidden `properties[__shopify_send_gift_card_to_recipient]` value=if_present,
  `[data-recipient-control]`, inicialmente enabled para alternativa nativa sin JS.
- `[data-recipient-fields]` fieldset con leyenda y campos; visible sin JS.
- `[data-recipient-toggle]` div inicialmente hidden con checkbox sin name,
  `[data-recipient-checkbox]`; JS muestra toggle, oculta/deshabilita campos si off,
  habilita campos + emailrequired cuando on; control true en on/disabled en off.
No programar fecha de entrega en esta versión ni prometer envío inmediato.
Mensaje explicativo: sin email de destinatario se envía al comprador; no prometer
entrega antes de que Shopify procese la compra.

Submit `[data-gift-submit]`, error `[data-gift-error]` role=alert hidden,
success no fake. JS puede POST FormData a form.action+'.js' nativo, manejar422/red,
redirigir a ruta carrito localizada solo cuando Shopify confirme ítem. Error conserva
monto/destinatario/mensaje y botón disponible para reintentar. No checkout automático.
No persistir, loggear ni enviar datos fuera del cart nativo. No pixel nuevo.

Solo mostrar formulario si existe producto nativo de regalo y variantes. Producto
sin published_at: mostrar aviso de revisión/venta no disponible y submit disabled;
radios y campos pueden usarse para revisar diseño. Mostrar disponibilidad honesta
sin formulario para producto faltante/incorrecto. No inventar IDs/precios.
Para design_mode añadir información merchant para seleccionar producto cuando falta,
no mostrar instrucciones de implementación a visitantes.

## Configuración y pruebas

Selector producto; texto intro editable y localizado, contacto URL editable;
padding estándar36/0-100paso4, preset, disabled groups header/footer, schema localizado.
Sin blocks obligatorios. Todo CSS section-scoped. Sección implementada por
section-builder. Padre crea templates, JS, unitarias/fixtures/e2e y catálogo borrador.
Pruebas: monto/ID coincide, unavailable exclusion, no producto normal, property
names y noJS fallback, destinatario validación, servidor422/red/reintento,
mobile sinoverflow, integración Shopify preview con producto DRAFT (sin compras).
