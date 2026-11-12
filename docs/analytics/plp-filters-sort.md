# Eventos de filtros y ordenación de PLP

La sección de colección carga `assets/lemoon-plp-analytics.js`. El módulo observa la selección de filtros y ordenación, y publica un evento personalizado de Shopify únicamente cuando `facets.js` termina de renderizar la misma solicitud AJAX iniciada por esa interacción y el estado aplicado ha cambiado. Cada solicitud tiene un identificador; las respuestas antiguas se descartan antes de alterar la PLP. El estado confirmado se lee de los valores activos de `collection.filters` renderizados por `lemoon-active-filters.liquid`; una URL o un clic sin actualización exitosa no basta para registrar el cambio.

| Evento Shopify | Cuándo | `customData` |
| --- | --- | --- |
| `lemoon:plp_filter_change` | Cada opción agregada o quitada, incluida la limpieza de todos los filtros | `collection_handle`, `filter_param`, `filter_value`, `action` (`add` o `remove`) |
| `lemoon:plp_sort_change` | Cambia la opción de `sort_by` tras actualizar la PLP | `collection_handle`, `sort_value` |

Los parámetros son nombres nativos de Shopify, por ejemplo `filter.p.m.custom.frame_shape` o `filter.v.price.gte`; el valor de precio es el valor nativo en centavos. Los valores provienen del estado aplicado y se limitan en longitud. No se envían URL, etiquetas visibles, datos de visitante ni consultas de búsqueda. La carga inicial, la navegación del historial sin interacción, una respuesta fallida y una actualización sin diferencias no generan estos eventos. Se mantiene el `CollectionUpdateEvent` estándar de Shopify emitido por `facets.js`; estos eventos aportan el detalle por opción.

La publicación exige `Shopify.customerPrivacy.analyticsProcessingAllowed() === true` al momento de cada evento. Si falta permiso o API, el evento se descarta; no se almacena ni se reproduce después. En el editor del tema se desactiva. Los fallos de publicación no afectan filtros ni navegación.

Estos son eventos del tema para [Shopify Customer Events](https://shopify.dev/docs/api/web-pixels-api/emitting-data). Un píxel personalizado debe suscribirse a los nombres anteriores para enviarlos a GA4 u otro destino; publicar desde el tema no acredita recepción en esa plataforma. La instalación/configuración del píxel y la comprobación de recepción real quedan como pasos operativos separados.
