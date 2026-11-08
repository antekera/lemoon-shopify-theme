# LEM-129 / LEM-105 — corrección de perspectiva Donnalyn

## Ajuste vigente — esquina izquierda más cuadrada (08-11-2026)

Miguel pidió cuadrar un poco la zona de los tornillos del lente izquierdo para evitar la apariencia de ojo de gato. Se baja la punta exterior, se forma un frente corto vertical con radio suave y se alinea el par de remaches; la raíz de la patilla lejana acompaña la esquina. Ambas aberturas, lente derecho, puente y el resto de la ilustración se conservan.

Base `64d4a47b`; SHA256 vigente `d1a74f523d079f491ccb934e5e4fd31a1d0a699207b71c101b7f5d6b55d2aa17`. [Perspectiva vigente](lem-129-105-perspective-refined/after-square-corner.png).

Verificación nueva: 29/29 unitarias afectadas, 37/37 E2E Chromium y Theme Check316 sin observaciones, Node24.19.0/CLI4.8.5. Código y diseño independientes: Approved para el microdelta; responsabilidad read-only conductual sin aislamiento técnico. Logs en `/tmp/lem129-square-corner/{unit,e2e,theme-check}.log`. Sin cambios de pruebas, datos ni controladores. Las capturas/resultados de abajo son históricos; revisión humana e integración Shopify pendientes. Sin publicación ni merge.

## Revisión anterior — corrección de abertura izquierda (08-11-2026)

Miguel aclaró «Corregir el izquierdo». Se restaura el derecho y su faceta exactamente a `e2c50928`; solo se redibuja la abertura izquierda respecto de esa base. La abertura anterior se extendía demasiado hacia el lateral en la zona alta: el ajuste recupera el grosor del aro y sigue mejor el cuadrado redondeado/acortamiento de la foto. No se alteran el contorno exterior, patillas, remaches, miniiconos ni datos.

Base de trabajo `25ad2ef0`; SHA256 vigente del snippet `c41325f64c6b1e17315bd474962cff483620637e0929222f6a67f50cc8629eb8`. [Perspectiva vigente](lem-129-105-perspective-refined/after-left.png). La interpretación anterior de abajo queda sustituida, sin atribuirle aceptación humana.

Verificación nueva: 29/29 unitarias afectadas, 37/37 E2E Chromium y Theme Check316 sin observaciones, Node24.19.0/CLI4.8.5. Código y diseño independientes: Approved para el delta acotado; responsabilidad read-only conductual sin aislamiento técnico. Logs en `/tmp/lem129-left-lens/{unit,e2e,theme-check}.log`. Sin cambios en pruebas. Pendientes Shopify nativo/editor/SEO/catálogo y revisión humana; sin publicación ni merge.

## Interpretación sustituida — ajuste del derecho (08-11-2026)

Se conserva íntegro el lente izquierdo como referencia y se ajustan únicamente la abertura y una faceta interior del derecho. El derecho comparte su continuidad de curva junto al puente y en la base, manteniendo su tamaño mayor por la perspectiva. No cambian silueta exterior, patillas, remaches, miniiconos ni datos. La interpretación aplicada y el resultado quedan sujetos a la revisión de Miguel.

Base `e2c50928`; SHA256 vigente del snippet `d59813a44f60a430b1179dd1bb41e452e6976e0aed7e29271434a041202140bb`. [Perspectiva vigente](lem-129-105-perspective-refined/after-matched.png).

Verificación nueva: 29/29 unitarias afectadas, 37/37 E2E Chromium y Theme Check316 sin observaciones, Node24.19.0 y CLI4.8.5. Código y diseño independientes: Approved para el delta de dos trazados; solo lectura conductual, sin aislamiento técnico. Logs en `/tmp/lem129-perspective-matched/{unit,e2e,theme-check}.log`. Sin cambios en pruebas. Los resultados de abajo corresponden a la revisión anterior; las limitaciones nativas y de publicación siguen vigentes.

## Revisión anterior — evidencia histórica

Miguel pidió corregir la deformación de la vista en perspectiva y acercarla a [la foto del Donnalyn](https://s3.zeelool.com/admin/product/image/bdb5b03f1409dbb2f78442c86b786036.jpg), del [modelo elegido](https://www.zeelool.com/goods-detail/ZJGT372549-04). La revisión afecta únicamente al SVG grande de comparación; no cambia el frontal/lateral de cotas, miniiconos, textos, unidades, datos, CSS ni controladores.

Base: `9639efcecdad490160d576188629ded5c46bfdb5`. SHA256 del snippet validado: `b1918c9f65d23076d0633e66002af10e324b04386bd11800dc0a38890f90ac99`.

## Delta visual

La abertura cercana conserva una forma cuadrada de esquinas suaves, con borde inferior más controlado; la lejana mantiene su acortamiento propio. Se ajustaron el puente y su transición al aro, el ancho de la patilla cercana en la bisagra y las curvas de ambos terminales. Se conserva el acabado navy/superficie existente, los remaches y la marca educativa discontinua. Es una ilustración simplificada, sin reconstrucción 3D exacta ni medidas físicas inferidas desde la fotografía.

- [Antes](lem-129-105-perspective-refined/before.png).
- [Después](lem-129-105-perspective-refined/after.png).

## Verificación nueva

- **29/29 unitarias afectadas**, tres archivos: componentes, contenido de tallas y página guía.
- **37/37 E2E afectadas**, Chromium, 31.7 s: ambos shells, página, responsive, texto al 200 %, cierre/foco, navegación y datos ausentes. Sin retries ni cambios en pruebas.
- **Theme Check: 316 archivos sin observaciones**, CLI 4.8.5, umbral warning, Node 24.19.0.
- Código: revisión independiente **Approved**, sin hallazgos; IDs, semántica y contratos conservados. Diseño: **Approved** tras comparar foto, antes/después, página a 390/1440 y modal a 390; sin clipping ni overflow. Responsabilidad read-only conductual, sin aislamiento técnico.
- Convenciones comprobadas por el implementador: tokens y traducciones existentes, JSON válido e inventario descriptivo actualizado. No se atribuye una auditoría formal independiente de convenciones a esta corrección.
- `git diff --check`: PASS. Las 499 unitarias y 300 E2E globales de revisiones anteriores permanecen como evidencia histórica, sin nueva ejecución global para este ajuste de trazados.

Logs: `/tmp/lem129-perspective-refined-unit.log`, `/tmp/lem129-perspective-refined-e2e.log`, `/tmp/lem129-perspective-refined-theme-check.log`. Informes y hashes: `.superpowers/sdd/2026-11-07-size-guide-pdp-page/perspective-refined-*.md`.

## Preview y límites

- [Modal PDP](https://miguels-mac-mini.tail51dddb.ts.net:9451/tests/fixtures/size-guide.html?shell=standard&scenario=complete).
- [Página guía](https://miguels-mac-mini.tail51dddb.ts.net:9451/pages/como-medir-tus-lentes).

El servidor 4189 sirve un snapshot inmutable de esta revisión a través de Tailscale privado 9451. Las URLs apuntan al último snapshot compartido; el hash y las capturas fijan esta evidencia. Son fixtures LiquidJS/Chromium; Shopify nativo, editor, SEO, catálogo físico y revisión humana mantienen sus pendientes. LEM-129/105 continúan In Progress, PR64 en borrador. Sin publicación ni merge.
