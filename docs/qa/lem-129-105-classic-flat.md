# LEM-129 / LEM-105 — lentes clásicos y planos

Código validado: `b9611c8ebb4c5bcba33ba04e9c6dff23d22e3ed2`, sobre `50c1864a`. Miguel pidió sustituir la forma marcada de la revisión anterior por unos lentes tradicionales y genéricos, con un acabado más plano y sin degradados ni sombras.

## Dibujo vigente

Armazón rectangular clásico de esquinas suaves, aro uniforme, puente sencillo y patillas discretas. Contorno navy con un único relleno plano tenue. Se retiraron todos los gradientes, reflejos, capas de bisel, sombras desplazadas y referencias de pintura. Los dos snippets usan la misma silueta en frontal, perspectiva y miniiconos; el lateral conserva una curva de patilla simple.

Las cotas A–E, títulos accesibles, ejemplo HTML, medidas del producto, unidades y controladores mantienen su contrato. Frontal: A17..383 exterior; B34..166 ancho de apertura; C166..234 separación mínima entre aperturas verticales; D84..158 altura. Son coordenadas del dibujo, no valores físicos. E sigue el recorrido de la patilla. El inventario conserva558 fuentes/495mapped/63excluded y no incorpora archivos de runtime nuevos.

- [Frontal y lateral](lem-129-105-classic-flat/front-side.png).
- [Perspectiva plana](lem-129-105-classic-flat/perspective.png).
- [Página1440](lem-129-105-classic-flat/guide-page-1440.png).

## Verificación de esta revisión

- **499/499 unitarias**,48 archivos.
- **37/37 E2E afectadas** en Chromium,33.6s: ambos shells y página,390/820/1440, reflow320, textos y letras SVG ampliados200%, cierre/foco/scroll/unidades e inline.
- **Theme Check:316 archivos sin observaciones**, Shopify CLI4.8.5, umbral warning, Node24.19.0.
- Revisiones independientes de código, convenciones y diseño: **Approved / Ready to push**, sin hallazgos. El diseñador comprobó el acabado plano, la forma genérica, las cotas y los miniiconos mediante capturas y render390.
- `git diff --check`:PASS. No cambios en CSS, JS, traducciones, configuración ni datos Shopify.

Logs: `/tmp/lem129-classic-flat-unit.log`, `/tmp/lem129-classic-flat-e2e.log`, `/tmp/lem129-classic-flat-theme-check.log`. Informes locales y hashes: `.superpowers/sdd/2026-11-07-size-guide-pdp-page/classic-flat-*.md`. Revisión de solo lectura por responsabilidad, sin aislamiento técnico de capacidades. Las pruebas de las revisiones anteriores permanecen históricas; no se atribuye una nueva ejecución de300 E2E a esta corrección.

## Preview compartida

Snapshot inmutable `b9611c8e` en servidor local4189, acceso privado por Tailscale9451:

- [Modal PDP](https://miguels-mac-mini.tail51dddb.ts.net:9451/tests/fixtures/size-guide.html?shell=standard&scenario=complete): pulsar «Guía de medidas».
- [Página guía](https://miguels-mac-mini.tail51dddb.ts.net:9451/pages/como-medir-tus-lentes).

La URL compartida muestra el último snapshot servido; las capturas y SHAs fijan la evidencia histórica de cada revisión. Se mantienen fixtures identificados, PR en borrador y ambos tickets In Progress. No se publica ningún tema ni se sustituyen los pendientes nativos de Shopify/editor/SEO/catálogo o la revisión humana.
