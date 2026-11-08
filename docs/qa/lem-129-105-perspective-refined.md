# LEM-129 / LEM-105 — corrección de perspectiva Donnalyn

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
