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

No se cargaron datos de prueba, asignaciones CMS ni temas en esta entrega. Instalación/recepción real GA4, asignaciones nativas y publicación requieren su entrega autorizada y QA correspondiente. El PR permanece en borrador para revisión humana final. Revisiones independientes de código y convenciones operan con responsabilidad de solo lectura, sin aislamiento técnico de permisos.

## Verificación

Node24.19.0 y ShopifyCLI4.8.5 fijados. Las suites de fixtures no equivalen a storefront nativo. El bloque siguiente registra la corrida integrada final; evidencia detallada y capturas históricas archivadas fuera del árbol Git. Los borradores y planes sustituidos se retiraron para conservar solo contratos y evidencia vigente.

Corrida integrada del 08-11-2026 sobre `41fb392360b32f614e2edb512e2fe6cf7e628f55` más el árbol local entregado. Las huellas de los 20 archivos runtime modificados se mantuvieron iguales durante las comprobaciones.

| Suite | Resultado | Cobertura |
| --- | --- | --- |
| Unitarias completas | 525/525 PASS, 52 archivos | Liquid, datos, componentes, helpers y analítica |
| Modal PDP | 58/58 PASS | Chromium/WebKit; ambos shells, 320–1440px, 200% de texto, datos ausentes/parciales/demo, acordeón, foco, reapertura y navegación |
| Drawers compartidos | 44/44 PASS | Chromium; genérico, navegación, carrito vacío/con contenido, filtros, retiro y PDP; responsive, teclado y movimiento reducido |
| Movimiento de salida | 24/24 PASS | Chromium/WebKit; X, Escape, backdrop, solicitudes repetidas, frames visibles, escritorio y movimiento reducido |
| Página y analítica | 21/21 PASS | Chromium; 10 casos de página y 11 de consentimiento/eventos, ES/EN y ausencia segura de SDK |

Total E2E: **147/147 PASS**, sin fallos ni casos omitidos. No se añadieron pruebas ni se modificó el runtime para esta corrida. Los contratos de acordeón y movimiento conservan las expectativas funcionales; no se incrementaron reintentos.

Comandos resumidos, con `node` resuelto al binario 24.19.0 fijado y el mismo PATH para los servidores fixture:

```sh
node node_modules/vitest/vitest.mjs run --reporter=json --outputFile=/tmp/lem129-pr64-final-unit-20261108.json
SIZE_GUIDE_PORT=4197 node node_modules/@playwright/test/cli.js test --config tests/e2e/size-guide.config.js --output /tmp/lem129-pr64-final-modal-20261108
SHARED_DRAWER_PORT=4198 node node_modules/@playwright/test/cli.js test --config tests/e2e/shared-drawers.config.js --output /tmp/lem129-pr64-final-shared-drawers-20261108
DRAWER_MOTION_PORT=4199 node node_modules/@playwright/test/cli.js test --config tests/e2e/drawer-motion.config.js --output /tmp/lem129-pr64-final-drawer-motion-20261108
SIZE_GUIDE_PORT=4201 node node_modules/@playwright/test/cli.js test --config tests/e2e/measurement-guide-analytics.config.js --output /tmp/lem129-pr64-final-page-analytics-20261108
```

Manifiesto final con resultados, estados de los runners y 35 huellas de código/pruebas: `/tmp/lem129-pr64-final-validation-20261108.json`. Capturas/frames están en los directorios `--output` anteriores. Los puertos fixture 4197/4198/4199/4201 quedaron cerrados; el preview 9452 se conservó. La recepción real en GA4 y la cobertura nativa Shopify permanecen fuera de estas pruebas de fixtures.

Theme Check final:367 archivos,0 observaciones al umbral error. Inventario reconciliado tras indexar el CSS compartido:561 fuentes indexadas,498 mapped,63 excluded,0 adiciones pendientes de indexar. Se archivaron fuera de Git60 documentos/capturas sustituidos (49 antes indexados),6.3MB, sin referencias internas rotas; permanecen contratos, aprobación humana de la página y este informe final. La limpieza no elimina el historial de commits.
