# LEM-11: activación CMS y regresión de referencias

Verificación del 07-11-2026, posterior al merge de [PR71](https://github.com/antekera/lemoon-shopify-theme/pull/71), head `c20800bf`, merge `a8f06333`. Complementa la [evidencia histórica de preparación](lem-11-feedback-readiness.md); no convierte sus pruebas locales en pruebas de producción.

## Activación comprobada

El tema publicado `lemoon-shopify-theme/main`, ID `155307737256`, ya mostraba el nuevo H1. Faltaba activar el CMS: la página y tres enlaces de menú conservaban el nombre y handle anteriores. Se actualizó la misma Page `161787576488` a título «Descubre tu estilo» y handle `descubre-tu-estilo`, con `redirectNewHandle:false`, conservando plantilla interna `buscar-mi-estilo` y publicación.

Se renombró exclusivamente el enlace asociado a esa Page en `footer-how-to`, `footer-services-review` y `footer-services-mobile-review`. Se cotejaron los 14 árboles de menú: IDs, orden y elementos restantes coinciden con el backup. No hay redirects administrativos para ninguna de las dos rutas.

Lectura de producción en sesiones nuevas a 390 y 1440 px:

- `/pages/descubre-tu-estilo`: HTTP200 natural, H1 «Descubre tu estilo ideal.», botón de inicio «Encontrar mi estilo» y enlaces «Descubre tu estilo».
- Los textos «Tu próximo par.» y «Encuentra tu lente ideal» no aparecen en el cuerpo del quiz; no se observó overflow horizontal.
- `/pages/buscar-mi-estilo`: HTTP404 con `maxRedirects:0`, sin cabecera Location.

No se ejecutó `theme push` ni se escribió código del tema publicado. Los backups, respuestas sanitizadas y capturas están en el directorio Git común `delivery-evidence/lem-11-copy-feedback/`.

## Regresión detectada durante el recorrido

La primera ejecución real de las doce pruebas storefront obtuvo 5 pases y 7 fallos. Tres fallos de envío tienen una causa de producto confirmada: `metaobject.system.id` en Liquid es numérico, pero el constructor de filtros exige un GID. La fixture anterior entregaba GIDs directamente y ocultaba el defecto. El envío sin preferencias sí navegaba al catálogo.

La corrección puntual antepone `gid://shopify/Metaobject/` en el JSON Liquid. La fixture reproduce ahora los IDs numéricos y una regresión renderiza la sección real y construye la URL con negro, neutrales y Carey. La prueba falla con el código previo por `Invalid quiz filter configuration: color/black`.

Los otros cuatro fallos fueron de prueba: tres peticiones a la ruta antigua añadían `preview_theme_id`, provocando el handshake302 de Shopify; una exigía visibilidad del contador desktop oculto en móvil. Se conserva la exigencia HTTP404 sin Location usando la sesión autenticada y la ruta natural. El contador se comprueba mediante su contrato de datos y la paginación existente.

Fuente primaria: [Liquid metaobject_system.id es number](https://shopify.dev/docs/api/liquid/objects/metaobject_system).

La corrección de referencias requiere su propia revisión, integración y verificación Shopify. La activación CMS no demuestra que ese envío esté corregido en producción. El despliegue y la sincronización del back office conservan su aceptación separada en PR9.

## Validación local de la corrección

- 463/463 pruebas unitarias, incluida la regresión render→referencias→URL; Theme Check nativo: 312 archivos sin infracciones.
- 25/25 pruebas Chromium del quiz contra el servidor aislado en4186. Dos URLs de prueba ahora utilizan `baseURL`, para que la suite y su contexto sin JavaScript ejerciten ese servidor en lugar de la instancia ajena en4173. No se cambian las expectativas del recorrido.
- El diccionario de21 entradas capturado de producción, pasado por la sección corregida, genera21 GIDs válidos y una URL nativa con parámetros repetidos.
- Revisiones independientes iniciales de código y convenciones: Approved / Ready to push, sin aislamiento técnico. La revisión del delta final de documentación y portabilidad se registra en el handoff.

El validador Liquid del plugin no pudo iniciarse por faltar `@shopify/theme-check-common` en su bundle; no se modificó ese bundle. La validación ejecutada es el CLI nativo Theme Check. Ninguna prueba local acredita el Liquid corregido publicado.
