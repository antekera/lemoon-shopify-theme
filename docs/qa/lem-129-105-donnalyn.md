# LEM-129 / LEM-105 — referencia Donnalyn

Revisión posterior: [corrección de perspectiva](lem-129-105-perspective-refined.md). Este informe conserva el dibujo y la validación histórica de `49e1fde5`; los enlaces compartidos muestran el último snapshot.

Código validado: `49e1fde5aab78aa0d10a7aa5ed13a078c356799e`. Miguel eligió [Zeelool Donnalyn ZJGT372549-04](https://www.zeelool.com/goods-detail/ZJGT372549-04) como nueva referencia de forma. Esta revisión sustituye la gráfica clásica plana; sus pruebas y capturas anteriores se conservan como evidencia histórica.

## Dibujo vigente

SVG originales a partir de las fotografías frontal y en tres cuartos: aperturas cuadradas más altas, esquinas inferiores amplias y redondeadas, puente sencillo, dos remaches por esquina y patillas con terminal curvo. Frontal, lateral, perspectiva y miniiconos comparten la construcción. Se conserva el tratamiento navy/superficie con volumen discreto de la versión retomada, sin trasladar estampado, logo, colores ni cifras comerciales de Zeelool.

Fotografías oficiales inspeccionadas: [frontal](https://s3.zeelool.com/admin/product/image/c520ff856cb412982ce6838c2a032dc6.jpg), [frontal alternativo](https://s3.zeelool.com/admin/product/image/045c089a598520517f40a2fa6bbef21b.jpg), [tres cuartos](https://s3.zeelool.com/admin/product/image/bdb5b03f1409dbb2f78442c86b786036.jpg) y [editorial](https://s3.zeelool.com/admin/product/image/63fe854bf194cd035b7a26bcf4763ab6.jpg). Las fotos no se incluyen en el runtime.

Las cotas A–E siguen siendo esquemáticas, sin escala. B y D coinciden con los extremos de la apertura dibujada; C utiliza proyecciones de la separación mínima horizontal entre aperturas. E sigue la curva de la patilla. Estos trazados no aportan medidas físicas al producto. Se mantienen el código educativo HTML, datos reales disponibles, unidades, títulos accesibles e IDs por instancia. No hay cambios productivos en CSS, JS, traducciones, controladores ni datos Shopify. El inventario mantiene 558 fuentes: 495 mapped / 63 excluded.

- [Frontal y lateral](lem-129-105-donnalyn/front-side.png).
- [Perspectiva con remaches redondos](lem-129-105-donnalyn/perspective.png).
- [Página 1440](lem-129-105-donnalyn/guide-page-1440.png).

## Verificación de esta revisión

- **499/499 unitarias**, 48 archivos.
- **37/37 E2E afectadas**, Chromium, 31.8 s: ambos shells y página, 390/820/1440, reflow 320, texto HTML/control/SVG al 200 %, teclado, cierre y foco, scroll, unidades, datos ausentes e inline.
- **Theme Check: 316 archivos sin observaciones**, Shopify CLI 4.8.5, umbral warning, Node 24.19.0.
- Revisiones independientes de código, convenciones y diseño aprobadas para la entrega local; fotografías y capturas actuales inspeccionadas. El diseñador verificó cotas, miniiconos y letras ampliadas sin recorte. Responsabilidad de solo lectura conductual, sin aislamiento técnico de capacidades.
- `git diff --check`: PASS. Smoke HTTPS Tailscale del snapshot: ambas rutas HTTP 200, cuatro remaches en la perspectiva, cero overflow a 390 px, Escape restaura el foco y cero errores JavaScript.

Una ejecución previa terminó en 36/37: la navegación consecutiva a anclas con texto al 200 % competía con el scroll suave al enfocar programáticamente un índice fuera de pantalla. Se preservó la traza y el caso sin cambios reprodujo 1 fallo en 3 repeticiones. La prueba ahora espera que el enlace esté visible y estable mediante `scrollIntoViewIfNeeded()` antes de enfocarlo; conserva Enter, las aserciones, los timeouts y el CSS productivo. Después pasan 5/5 repeticiones del caso y la suite afectada completa 37/37. No se añadieron reintentos ni se suprimieron aserciones.

Logs: `/tmp/lem129-donnalyn-unit-final.log`, `/tmp/lem129-donnalyn-e2e-verified.log`, `/tmp/lem129-donnalyn-theme-check-final.log`, `/tmp/lem129-donnalyn-anchor-fixed-repeat5.log`. Diagnóstico y traza roja: `/tmp/lem129-donnalyn-test-diagnosis-j6c9r55h`. Informes y hashes locales: `.superpowers/sdd/2026-11-07-size-guide-pdp-page/donnalyn-*.md`. No se atribuye una ejecución nueva de las 300 E2E globales a esta revisión gráfica.

## Preview y límites

Snapshot inmutable `49e1fde5`, servidor local 4189 y acceso privado por Tailscale 9451:

- [Modal PDP](https://miguels-mac-mini.tail51dddb.ts.net:9451/tests/fixtures/size-guide.html?shell=standard&scenario=complete): pulsar «Guía de medidas».
- [Página guía](https://miguels-mac-mini.tail51dddb.ts.net:9451/pages/como-medir-tus-lentes).

Las URLs compartidas muestran el último snapshot servido; estas capturas y el SHA fijan la evidencia de Donnalyn. Son fixtures LiquidJS identificados, con cifras sintéticas, sin certificación de Shopify nativo, editor, SEO ni medidas físicas del SKU. LEM-129/105 permanecen In Progress y PR64 en borrador: siguen pendientes la integración nativa y la revisión humana. No se publicó ningún tema ni se hizo merge.
