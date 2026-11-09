# Analítica de la guía de medidas

Implementación local del08-11-2026 para `/pages/como-medir-tus-lentes` y su versión `/en/`. El usuario pidió eventos Google para esta página. No se instrumentan la PDP ni las otras cuatro guías.

## Recorrido de datos

La sección carga `assets/lemoon-measurement-guide-analytics.js` únicamente en measurements y fuera del editor. Publica eventos custom con `Shopify.analytics.publish`. El receptor preparado es `scripts/shopify-pixels/lemoon-measurement-guide-ga4.js`: código para **un píxel personalizado de Customer Events**, fuera de los assets del tema y sin instalación o conexión automática.

La inspección de solo lectura del HTML actual de lemoon.cl identificó `G-QD3MYEBH5F` en la configuración del píxel Google y ningún script gtag global del tema. Ese dato público no acredita acceso a GA4, permisos administrativos, ingesta o configuración de informes. Los eventos arbitrarios del tema necesitan un suscriptor que traduzca sus parámetros: no se declara que Google & YouTube ya los reenvíe.

| Evento Shopify | Evento GA4 | Cuándo se publica |
| --- | --- | --- |
| `lemoon:size_guide_view` | `size_guide_view` | Una vez por documento cuando se expone el título o un título de paso; cubre entrada directa a una ancla. |
| `lemoon:size_guide_step_view` | `size_guide_step_view` | Una vez por paso1–3 al estar visible al menos50% de su heading. Es exposición, no lectura completa o tiempo de permanencia. |
| `lemoon:size_guide_step_click` | `size_guide_step_click` | Activación por puntero o teclado de un enlace del índice. |
| `lemoon:size_guide_catalog_click` | `size_guide_catalog_click` | Activación de «Ver catálogo» al final de la guía. |

Payload del tema: `guide_type: measurements`, `guide_language: es|en`; `step_number: 1|2|3` solo en los dos eventos de paso y `link_destination: catalogue` en catálogo. No envía medidas, identidad de cliente, receta, producto, texto CMS, títulos, query strings ni valores de formularios. El índice conserva su navegación y el catálogo su destino; no se añade preventDefault, espera o callback de red.

La observación se renueva al cambiar visibilidad o volver desde BFCache, conservando los contadores del documento. El scroll suave puede exponer títulos intermedios: también cuentan si cumplen el umbral; no equivale a que la persona haya leído esos pasos.

## Consentimiento y datos acotados

El publisher reutiliza `loadCustomerPrivacy` existente y exige `analyticsProcessingAllowed() === true`, documento visible y API de publicación disponible. Ausencia, rechazo o revocación bloquean envíos sin romper la página. Los clics bloqueados no se guardan ni se reproducen después; tras un permiso se observan solo los headings actualmente visibles. No se modifica la configuración del banner, regiones o preferencias guardadas.

El receptor comprueba además el estado nativo inicial y los cambios de Customer Privacy, el ID del evento y el payload. Acepta solo HTTPS en `lemoon.cl`/`www.lemoon.cl`, los dos paths de esta guía y el idioma correspondiente. Rechaza `preview_theme_id`, localhost, Tailscale y myshopify. La deduplicación usa IDs nativos en memoria con un límite256 y no usa almacenamiento persistente propio. El SDK de Google puede usar cookies analíticas permitidas.

La carga del SDK de Google es diferida hasta el primer evento válido permitido. Usa el stream observado, `send_to` explícito y `send_page_view: false`; no se envía manualmente ningún page_view, compra o evento de carrito. El config **y** cada evento reciben path canónico sin query/fragmento, referrer vacío y título fijo. Los permisos de publicidad quedan denegados en este receptor. El reenvío explícito se dirige solo al G-ID observado; este receptor no configura targets Ads. El comportamiento real del SDK y la propiedad se verifica antes de activarlo.

Esto no demuestra que el SDK de Google genere únicamente esos cuatro nombres: puede generar eventos automáticos de sesión/engagement. Tampoco demuestra identidad/session stitching entre sandboxes. La convivencia con el canal Google, atribución y ausencia de duplicados automáticos requieren validación real antes de activar; no se alteró la propiedad ni su enhanced measurement.

## Activación posterior a la revisión y publicación autorizada

Esta entrega es **local**: ni el tema ni el píxel se publicaron. Mantener la instrucción del usuario de no desplegar a producción antes de merge y de requerir autorización específica de publicación.

1. Verificar que el canal Google sigue apuntando al stream correcto; el ID observado aquí es una evidencia fechada.
2. Tras aprobación/merge y autorización de la entrega, instalar **una sola** instancia del código preparado en Customer Events como custom pixel, con permiso de Analytics requerido. No pegarlo en el tema ni instalar otro snippet global de GA/GTM.
3. Usar Shopify Pixel Helper para verificar los cuatro custom events y sus parámetros, con permiso permitido/denegado/revocado. La depuración de tags de Google tiene limitaciones dentro del sandbox; no tomar su ausencia como prueba de fallo o éxito.
4. Verificar recepción en GA4 DebugView/Realtime y el conteo de page_view y eventos automáticos junto al canal existente. Confirmar atribución/sesión y no declarar una conversión a partir de este código. Si hay duplicados de SDK/sesión, mantener desconectado el receptor y resolver la integración antes de uso comercial.
5. Para informes agregados con los parámetros propios, registrar las dimensiones de evento necesarias en la propiedad (guide_type, guide_language, step_number y link_destination). No se configuraron dimensiones, key events, audiencias o Ads en esta tarea.

## Fuentes oficiales consultadas

- [Shopify: publicar y suscribir custom events](https://shopify.dev/docs/api/web-pixels-api/emitting-data).
- [Shopify: Customer Privacy API](https://shopify.dev/docs/api/customer-privacy) y [privacidad dentro del píxel](https://shopify.dev/docs/api/web-pixels-api/pixel-privacy).
- [Shopify: código de un custom pixel y ejemplo GA](https://help.shopify.com/en/manual/promoting-marketing/pixels/custom-pixels/code).
- [Google: custom events](https://developers.google.com/analytics/devguides/collection/ga4/events) y [control de pageviews](https://developers.google.com/analytics/devguides/collection/ga4/views).

Se consultó Context7 primero y documentación primaria para las superficies que no resolvió su corpus. El validador incluido en la skill Shopify no pudo iniciarse por falta de `@shopify/theme-check-common`; no se modificaron dependencias. La validación del tema se realiza con ShopifyCLI4.8.5/Node24.19.0, junto con tests locales de publisher/receptor. Los resultados y límites se registran en la evidencia QA de esta entrega.
