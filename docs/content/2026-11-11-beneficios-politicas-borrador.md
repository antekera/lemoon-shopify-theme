# Beneficios comerciales: texto para integrar en políticas

Estado: beneficios integrados en las políticas nativas de envío y reembolso en Shopify el 11-11-2026. Este documento conserva el texto preparado y no sincroniza las políticas. La página de garantías del tema sigue pendiente de integración y publicación. Los beneficios no reducen los derechos legales existentes.

## Política de reembolso

### Cambios y devoluciones sin costo

Puedes solicitar un cambio o devolución sin costo antes de que transcurran **30 días desde que se generó tu orden de compra**. Comunícanos tu solicitud para coordinar el retorno y la solución correspondiente.

Este beneficio comercial es adicional a tus derechos legales. No reduce el plazo ni las condiciones de la garantía legal o del derecho a retracto cuando correspondan.

### Garantías adicionales para tus lentes

Tus lentes cuentan con una **garantía comercial de 365 días desde la generación de la orden de compra** por defectos de fabricación del armazón y los cristales. Después de los primeros seis meses y durante la vigencia restante de esta garantía, puedes elegir reparación o cambio. Esta opción no limita tus derechos legales: si corresponde garantía legal, durante los seis meses desde que recibes el producto puedes elegir reparación gratuita, cambio o devolución de lo pagado.

Si tus cristales se rayan dentro de los **90 días desde la generación de la orden de compra**, los cambiaremos sin costo, incluido el envío de ida y vuelta. Si han pasado más de 90 días, contáctanos para ayudarte.

Estas garantías comerciales se suman a tus derechos legales y no los limitan. En particular, la garantía legal por fallas cubiertas contempla seis meses desde la recepción y te permite elegir la solución que corresponda conforme a la ley.

## Política de envío

El envío es gratis a todo Chile en compras desde **$70.000 después de descuentos**. Para pedidos bajo ese monto, el costo se informa antes de finalizar la compra.

Plazo estimado de entrega: **5 a 10 días hábiles**. El plazo comienza cuando se confirma el pago y, si el pedido requiere receta, cuando contamos con ella completa. Si la receta necesita corrección, comienza cuando recibimos y aceptamos la corrección.

## Sincronización

El metacampo de tienda `custom.free_shipping_threshold` guarda el umbral usado por el tema. La tarifa de envío y el cuerpo HTML de la política nativa de Shopify son configuraciones separadas: cambiar el metacampo no las actualiza automáticamente. La tarifa vigente y el texto deben reconciliarse hasta que exista una sincronización verificada. El cuerpo de la política nativa también se muestra en checkout y no procesa Liquid.

El metacampo `custom.plazo_entrega_receta` y la política nativa de envío se actualizaron a `5 a 10 días hábiles`. La política mantiene una copia estática: el metacampo no modifica esa copia ni las estimaciones configuradas en checkout.
