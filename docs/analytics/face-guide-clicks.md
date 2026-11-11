# LEM-103 — Clics de la guía de rostro en GA4

08-11-2026. Instrumentación local preparada; receptor y dimensiones **pendientes de activación y QA remoto**. No se cambió la configuración de Shopify ni de Google Analytics. La publicación del tema conserva su autorización independiente.

## Qué se registra

La sección publica `lemoon:face_guide_click` mediante Shopify Customer Events. El receptor [face-guide-ga4-pixel.js](face-guide-ga4-pixel.js) lo transforma en el evento GA4 `face_guide_click`.

| Elemento | `action` | `link_position` | Contexto |
| --- | --- | --- | --- |
| Seis entradas del índice | `face_index` | `index` | Familia de destino |
| Doce tarjetas de formas: SVG y nombre en un enlace | `frame_shape` | `family` | Familia y forma individual |
| Seis enlaces «Ver armazones» | `family_catalogue` | `family` | Familia y dos formas; cada comparación añade una tercera si se explora una alternativa |
| Enlace a medidas | `measure` | `fit` | Guía de medidas |
| Botón de catálogo del banner | `catalogue` | `closing` | Catálogo |
| Enlace al quiz del banner | `quiz` | `closing` | Quiz |

El payload solo admite identificadores controlados: `guide_id`, `action`, `link_position`, `destination`, `face_family`, `frame_shape`, `selected_shapes`. Las familias son `oval`, `round`, `square`, `heart`, `diamond`, `long`; las formas son `round`, `rectangular`, `geometric`, `oval`, `aviator`, `cat-eye`. El receptor convierte el array de una a seis formas distintas a una cadena, por ejemplo `aviator|round`, para utilizarlo como dimensión GA4. Un fallback no afirma haber aplicado formas; un destino del editor se identifica como `custom`.

No se copian textos arbitrarios, URLs, querystrings, correos, identificadores de clientes, fotografías ni datos de receta. La familia representa el módulo pulsado, sin inferir un diagnóstico o medir el rostro de la persona.

El tema comprueba `Shopify.customerPrivacy.analyticsProcessingAllowed()` en cada clic. Si está denegado o no disponible, no publica; no guarda ni reproduce clics anteriores. La navegación sigue siendo nativa y no espera a Analytics. El receptor vuelve a comprobar el permiso del sandbox y atiende revocaciones mediante `api.customerPrivacy.subscribe`, el acceso documentado para Custom Pixels. Si falta esa API o falla la suscripción, se cierra la emisión; el estado inicial por sí solo no permite ignorar cambios posteriores.

## Integración observada y decisión

La lectura del preview Shopify existente el08-11-2026 muestra GA4 `G-QD3MYEBH5F` en el app pixel de Google & YouTube. No hay `window.gtag`/`dataLayer` del tema verificados como transporte para estos eventos. Un evento Customer Events propio **no demuestra** que el app pixel lo traduzca automáticamente a GA4.

Por eso se entrega un receptor específico para el sandbox de Customer Events. Solo reenvía el evento propio; escucha `page_viewed` de Shopify para preparar el SDK en esta página antes de un clic que pueda abandonarla, sin reenviar esa vista. En otras páginas no lo precarga. No se añade Google SDK al tema ni se repiten `page_view`, compras o eventos de comercio. El tag del receptor usa `send_page_view: false`, desactiva señales/publicidad y dirige el evento al stream observado. La identidad/sesión entre ambos pixels y la recepción real en GA4 requieren QA: las pruebas locales no prueban atribución compartida ni medición remota.

## Activación después de aprobación

1. Confirmar en Google & YouTube y GA4 que el stream correcto sigue siendo `G-QD3MYEBH5F`. El ID es público; no se necesita una API secret ni credenciales dentro del código.
2. Revisar los pixels existentes en **Shopify → Configuración → Eventos de clientes**. Si ya existe un receptor de `lemoon:face_guide_click`, actualizar ese receptor en vez de duplicarlo.
3. Preparar un pixel personalizado llamado **Lemoon — guía de rostro GA4** con el contenido JavaScript exacto del archivo adjunto. No pegar etiquetas `<script>` ni cargar este archivo desde Liquid.
4. Configurarlo para exigir el permiso **Analytics**; no seleccionar «sin consentimiento requerido» para eludir la configuración regional. Guardarlo para revisión; conectarlo solo al activar la versión aprobada de la guía.
5. En **GA4 → Administrar → Visualización de datos → Definiciones personalizadas**, registrar dimensiones de alcance **Evento** para los siete parámetros indicados arriba. Comprobar previamente si ya existen para evitar duplicados. No marcar el clic como conversión por defecto.
6. Usar Pixel Helper y un entorno de revisión con el módulo real del tema. Con consentimiento permitido, comprobar una sola publicación por clic y la transformación a `face_guide_click`; con Analytics denegado o revocado, comprobar ausencia de nuevos envíos. Verificar también teclado, clic sobre SVG, abrir en nueva pestaña y cambio entre secciones en el editor.
7. Comprobar `face_guide_click` en **Tiempo real / DebugView** y sus parámetros. DebugView necesita configuración de depuración en la sesión de QA; el código entregado no marca todas las visitas como debug. Confirmar que los eventos de comercio y pageviews nativos no se dupliquen.
8. Publicar el tema y conectar el receptor bajo la autorización correspondiente; registrar revisión, hashes, stream, capturas de recepción y consentimiento. Desconectar el receptor revierte esta integración sin tocar el canal nativo de Google.

Para analizarlo: crear una exploración filtrada por `event_name = face_guide_click`, con filas **Acción → Familia → Forma(s)**, columnas **Posición** y métrica **Número de eventos**. Las dimensiones nuevas pueden tardar hasta48horas en aparecer en informes. Contar clics no equivale a contar personas ni compras.

## Fuentes técnicas actuales

- [Shopify — emisión y suscripción de eventos propios](https://shopify.dev/docs/api/web-pixels-api/emitting-data).
- [Shopify — Customer Privacy API](https://shopify.dev/docs/api/customer-privacy).
- [Shopify — permisos dentro del sandbox de pixels](https://shopify.dev/docs/api/web-pixels-api/standard-api/customerprivacy).
- [Shopify — crear código para un pixel personalizado](https://help.shopify.com/en/manual/promoting-marketing/pixels/custom-pixels/code).
- [Google — eventos y parámetros GA4](https://developers.google.com/analytics/devguides/collection/ga4/event-parameters).

Context7 devolvió documentación oficial de GA4. La consulta de Shopify Themes no cubrió Customer Events/Privacy; se consultaron directamente las páginas oficiales anteriores.

Prueba local09-11-2026: cada enlace de salida de familia actualiza `selected_shapes` con la misma selección2–6 que su URL; las dos sugeridas permanecen seleccionadas. El receptor de referencia admite entre uno y seis valores distintos; su actualización en Customer Events y la recepción GA4 requieren validación operativa separada. Los controles locales de comparación no añaden eventos de salida ni instalan un pixel.
