# Promociones del PDP

## Estado de configuración

Los dos descuentos automáticos están activos en Shopify. El tema lee los tags del metafield de tienda `lemoon.pdp_promotions`, inicializado con los datos reales de los descuentos.

**Pendiente:** crear, validar en el editor y activar el workflow de Shopify Flow. La sincronización inicial está realizada; los cambios posteriores en Descuentos todavía no se propagan automáticamente al metafield. No tratar esta configuración como terminada hasta activar y probar el workflow.

## Descuentos configurados

- [50% en tu segundo marco](https://admin.shopify.com/store/lemoon-8277/discounts/6229463007400): compra un marco y recibe 50% en otro, una aplicación por pedido. Shopify descuenta el marco de menor precio.
- [10% en tu primera compra](https://admin.shopify.com/store/lemoon-8277/discounts/6229463072936): clientes del segmento existente `number_of_orders = 0`.

Ambos se aplican a las colecciones Ópticos y Lentes de sol, excluyen cristales y accesorios y no se combinan con otros descuentos. Shopify evalúa la elegibilidad al comprar; mostrar el tag no garantiza que el visitante cumpla la condición de primera compra. Para clientes identificados con compras anteriores, el tema oculta ese tag.

## Workflow nativo pendiente

1. Crear un workflow con **Scheduled time**, recurrente cada 10 minutos (o la frecuencia admitida por la tienda).
2. Agregar **Get discount data**, máximo 100 resultados, con consulta avanzada `method:automatic AND (id:6229463007400 OR id:6229463072936)`. No filtrar solo activos: el código descarta descuentos inactivos y siempre escribe el resultado, incluso si queda vacío.
3. Agregar **Run code**: copiar el Input de `scripts/shopify-flow/pdp-promotions-input.graphql`, el Output de `pdp-promotions-output.graphql` y el Code de `pdp-promotions.js`. Validar el Input contra el editor de Flow, cuyo esquema es distinto del Admin API.
4. Agregar **Update shop metafield**: namespace `lemoon`, key `pdp_promotions`, tipo JSON, valor `{{ runCode.promotionsJson }}`. Seleccionar la variable del paso Run code si el editor le asigna un nombre diferente.
5. Ejecutar el workflow y comprobar ambos tags en un producto elegible. Desactivar un descuento, ejecutar de nuevo, verificar que desaparece solo su tag y volver a activarlo. Eliminar ambos resultados debe escribir `[]`, no omitir la actualización.
6. Activar el workflow. Informar al usuario de la latencia del intervalo elegido.

El tema también verifica fechas de inicio/fin y colecciones elegibles en el servidor. Los títulos proceden de Shopify, sin porcentajes ni textos comerciales hardcodeados en Liquid. El metafield es público y contiene exclusivamente información promocional.

## Documentación

- [Get discount data](https://help.shopify.com/en/manual/shopify-flow/reference/actions/get-discount-data)
- [Run code](https://help.shopify.com/en/manual/shopify-flow/reference/actions/run-code)
- [Update shop metafield](https://help.shopify.com/en/manual/shopify-flow/reference/actions/update-shop-metafield)
