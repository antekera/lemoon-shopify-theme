# Guía de medidas y drawers: validación de entrega

Rama `feat/lem-129-size-guide-modal`; PR [64](https://github.com/antekera/lemoon-shopify-theme/pull/64). Desarrollo local; no publicación Shopify ni merge.

## Entrega

La página «Cómo medir tus lentes» conserva los tres pasos editables, diagramas originales, indicación en la patilla y botón de catálogo amarillo/navy. La [aprobación explícita de la página](lem-105-page-approval.json) registra la revisión correspondiente; no aprueba el conjunto del PR ni su publicación.

En ambas PDP el modal muestra referencias A–E con números JSON positivos del producto y estados parciales/vacíos/demo honestos. El acordeón contiene la comparación educativa y el enlace a la guía, se pliega al cerrar y al reabrir, y desplaza solo el panel al desplegarse. El chevron queda a la derecha, bajo la fila de cierre; mantiene foco nativo, movimiento reducido y reapertura rápida segura. La presentación móvil de drawer se comparte con carrito, navegación, filtros y retiro, conservando sus controladores.

Contratos vigentes: [DESIGN](../../DESIGN.md), [receta PDP](../components/recipes/product-card-grid.md), [guía educativa](../components/recipes/guide-help.md) y [analítica](../analytics/measurement-guide.md). El receptor GA4 está preparado como artefacto separado; no está instalado o activado.

## Preview y límites

- [PDP Dalton local](https://miguels-mac-mini.tail51dddb.ts.net:9452/products/lemoon-dalton-prototipo?pb=0).
- [Página local](https://miguels-mac-mini.tail51dddb.ts.net:9452/pages/como-medir-tus-lentes?view=guia-medidas&pb=0).

El preview superpone LiquidJS y assets locales permitidos a snapshots HTML nativos de solo lectura. Conserva compra/header/footer, falla ante un modal ambiguo y declara `X-Lemoon-Local-Preview: liquidjs-native-shell-snapshot`; no acredita un nuevo despliegue ni QA nativa completa. Dalton usa el contexto verificado de solo lectura140/54/17/42/145mm; los fixtures usan cifras sintéticas distintas.

No se cargaron datos de prueba, asignaciones CMS ni temas en esta entrega. Instalación/recepción real GA4, asignaciones nativas y publicación requieren su entrega autorizada y QA correspondiente. El PR permanece abierto para revisión humana final. Revisiones independientes de código y convenciones operan con responsabilidad de solo lectura, sin aislamiento técnico de permisos.

## Verificación de integración con main

Se integró `main` en `3d9da9ee4f99f96943b01868907fd40eb913960f` sobre el feature `2353fef938bcf430bd3971bec9130468d7801b9f`. Se resolvieron cuatro conflictos: receta `guide-help`, inventarios MD/JSON y servidor de fixtures. Ambas guías y familias de fixtures permanecen; la limpieza del PR75 se conserva. Los cuatro locales/schema no pierden ni alteran hojas independientes de ninguno de los padres. No se añadieron comportamientos nuevos en esta resolución.

Node24.19.0 y ShopifyCLI4.8.5 fijados. Las suites de fixtures no equivalen a storefront nativo.

| Suite | Resultado | Cobertura |
| --- | --- | --- |
| Unitarias completas | 604/604 PASS,54 archivos | Liquid, datos, componentes, helpers, analítica y guías de ambas ramas |
| Modal PDP | 58/58 PASS | Chromium/WebKit; ambos shells,320–1440px, texto200%, datos, acordeón, foco y reapertura |
| Drawers compartidos | 44/44 PASS | Chromium; navegación, carrito, filtros, retiro, PDP y movimiento reducido |
| Movimiento de salida | 24/24 PASS | Chromium/WebKit; X, Escape, backdrop, solicitudes repetidas y frames visibles |
| Página y analítica | 21/21 PASS | Chromium;10 casos de página y11 de consentimiento/eventos, ES/EN |
| Guía de rostros integrada desde main | 16/16 PASS | Chromium; responsive, índices, filtros, foco, eventos y reflow |

Total E2E: **163/163 PASS**, sin fallos ni casos omitidos. No hubo cambios de fuentes durante la corrida ni nuevas pruebas o ajustes de expectativas. El servidor de fixtures mantiene ambas familias de rutas/imports y la precedencia `LEMOON_FIXTURE_PORT → PORT →4173`; se comprobaron ambos controles de puerto por separado.

Comandos resumidos, usando el binario24.19.0 y el mismo PATH para los servidores:

```sh
node node_modules/vitest/vitest.mjs run
SIZE_GUIDE_PORT=4197 node node_modules/@playwright/test/cli.js test --config tests/e2e/size-guide.config.js
SHARED_DRAWER_PORT=4198 node node_modules/@playwright/test/cli.js test --config tests/e2e/shared-drawers.config.js
DRAWER_MOTION_PORT=4199 node node_modules/@playwright/test/cli.js test --config tests/e2e/drawer-motion.config.js
SIZE_GUIDE_PORT=4201 node node_modules/@playwright/test/cli.js test --config tests/e2e/measurement-guide-analytics.config.js
LEMOON_FIXTURE_PORT=4202 node node_modules/@playwright/test/cli.js test tests/e2e/face-guide.spec.js
```

Manifiesto con resultados y57 huellas: `/tmp/lem129-pr64-merge-validation-20261108.json`; copia persistente en la evidencia de entrega fuera del árbol Git. Servidores fixture cerrados; preview9452 preservado. Theme Check:371 archivos,0 observaciones al umbral error. Inventario:604 fuentes indexadas,502 mapped,102 excluded y0 adiciones pendientes. Revisiones independientes de código/convenciones aprobadas, con responsabilidad de solo lectura conductual.

Se conservan la aprobación histórica de la página y los contratos vigentes. Los60 documentos/capturas sustituidos siguen archivados fuera de Git; esta integración no los restaura ni reescribe el historial. La recepción real en GA4, asignaciones/QA nativa y publicación Shopify quedan fuera de estas comprobaciones.
