# LEM-129 / LEM-105 — implementación y QA local

Revisión gráfica vigente: [lentes clásicos y planos](lem-129-105-classic-flat.md), código `b9611c8e`, según la indicación posterior de Miguel. Las capturas y resultados de este documento pertenecen a su revisión histórica; las URLs compartidas muestran el snapshot más reciente.

Fecha: 07-11-2026. Código validado: `1db003a42b503ea0e780fac955e8426eb82a9ebf`, integrado con `main` `5bcb463bdd655720724b1df7c5c5be728e8d7100`. Rama `feat/lem-129-size-guide-modal`; [PR64](https://github.com/antekera/lemoon-shopify-theme/pull/64), borrador. Autorización de implementación: Miguel, «Implementalo» y «Continúa la implementación». La revisión humana del entregable de cada ticket sigue pendiente.

## Resultado

El modal estándar y óptico conservan sus shells/controladores nativos y muestran bloques continuos: medidas válidas del producto, esquema frontal/lateral A–E, comparación educativa y datos secundarios disponibles. Inline conserva sus tres pestañas. El código educativo `52 □ 18–145` se identifica expresamente como ejemplo y no cambia al convertir las cifras del producto a pulgadas. El JSON solo aporta números positivos de las cinco claves conocidas; talla textual, fotos y metaobjects del quiz no generan medidas.

La página utiliza la sección y plantilla existentes, con tres pasos y ocho campos editoriales de texto. El H1 procede del título de la página; los vacíos usan fallbacks localizados. Las otras cuatro guías conservan su comportamiento. La dependencia visual vigente es Urbanist / Instrument Sans, heredada de la base integrada; gráficos originales, sin activos de Zeelool ni tabla universal de tallas.

La página seleccionada en el ajuste global solo se enlaza desde el modal cuando tiene URL, publicación y plantilla `guia-medidas`. Su cuerpo CMS no se incrusta en el diálogo. Sin destino válido, la ayuda breve permanece disponible. No se añadió entrada desde Home ni se cambiaron compras, recetas, compatibilidades o datos Shopify.

## Preview

Actualización posterior: [revisión gráfica realista](lem-129-105-realistic-svg.md), código `26ba73f6`. Los enlaces compartidos de preview muestran el último snapshot servido; las capturas y resultados de este informe siguen correspondiendo a `1db003a4`.

Servidor local en `127.0.0.1:4189`, snapshot inmutable del código validado. Proxy Tailscale privado, puerto 9451; requiere conexión a la tailnet. No utiliza Funnel.

- [Modal estándar](https://miguels-mac-mini.tail51dddb.ts.net:9451/tests/fixtures/size-guide.html?shell=standard&scenario=complete): pulsar «Guía de medidas».
- [Modal óptico](https://miguels-mac-mini.tail51dddb.ts.net:9451/tests/fixtures/size-guide.html?shell=eyewear&scenario=complete).
- [Página guía](https://miguels-mac-mini.tail51dddb.ts.net:9451/pages/como-medir-tus-lentes).
- [Recorrido modal → guía](https://miguels-mac-mini.tail51dddb.ts.net:9451/tests/fixtures/size-guide.html?shell=standard&scenario=long): setting de página sintético válido, útil para probar el enlace y excluir el cuerpo largo del modal.

Las cifras, título del armazón y contenido de fixture son sintéticos y están identificados. Los aliases de página son rutas del servidor local; no asignan ni publican páginas Shopify. Contacto y catálogo mantienen sus URLs de storefront: el servidor de fixtures no simula esas páginas.

## Pruebas sobre el código integrado

Node24.19.0, Vitest5.0.3, Playwright1.63.0 Chromium, Shopify CLI4.8.5.

| Comprobación | Resultado |
| --- | --- |
| `npm run test:unit` | 499/499, 48 archivos |
| Suite completa `tests/e2e`, config temporal con fixture 4190 y 2 workers | 300/300, cero fallos/omitidos, 1.1min |
| `theme check --fail-level warning` | 316 archivos, cero observaciones |
| Workflow validator `all` | PASS |
| Regresiones de workflow / alcance CI | 9/9 y 13/13 |
| `git diff --check` | PASS |
| Fuentes reales por tamaño/peso computado, tres superficies | Instrument Sans y Urbanist cargadas, sin solicitudes de fuente fallidas |
| Smoke HTTPS por la URL Tailscale | Modal sin tabs, Escape/foco, enlace canónico, H1, cero errores JS y sin overflow a 390 px |

Cobertura afectada: ambos shells 390/820/1440; página 390/820/1440 y 749/750/989/990; reflow 320 y texto 200%, incluidos tamaños heredados en px y letras SVG; Tab/Shift+Tab, cierre visible/Escape/foco restaurado, scroll interior, conversión localizada, inline con flechas/Home/End, datos completos/parciales/inválidos/ausentes, talla sin JSON, títulos escapados, edición/fallbacks y preservación de las otras cuatro guías. La suite global también conserva recorridos locales del resto del tema.

Se demostraron regresiones rojas antes de las correcciones: capacidades nuevas ausentes; alias canónico404; escape nativo de traducciones; filas con desborde y letra D recortada al ampliar. Los fallbacks HTML ahora usan claves `_html`; una prueba acotada reproduce el escape de `t` de Shopify sin alterar el renderer global. El margen de los SVG se amplió sin desplazar las cotas ni reducir las letras.

## Revisión independiente

Código: Approved en `1db003a4`; hallazgos de escape HTML y clipping SVG resueltos. Convenciones: Ready to push, sin hallazgos; inventario comprobado contra 558 rutas del índice,495 mapped / 63 excluded. Revisión visual/editorial final: Approved para el entregable local en `1db003a4`, con diez capturas finales e inspección del diagrama ampliado; el recorte D está resuelto, A–E completos y fuentes Instrument Sans verificadas. Sin nuevos hallazgos. Las revisiones tienen responsabilidad de solo lectura; no se estableció aislamiento técnico de capacidades.

## Evidencia

- [Modal390](lem-129-105-size-guides/standard-390.png).
- [Página1440](lem-129-105-size-guides/guide-page-1440.png).
- [Página390](lem-129-105-size-guides/guide-page-390.png).
- Paquete local completo: `/tmp/lem129-integrated-qa-1db003a4-loaz1y6v`: 17 capturas, pruebas de fuentes, manifiestos SHA256 y comprobación de cero cambios de fuentes desde la ejecución.
- Logs: `/tmp/lem129-final-unit.log`, `/tmp/lem129-final-e2e.log`, `/tmp/lem129-final-theme-check.log`, `/tmp/lem129-final-workflows.log`, `/tmp/lem129-final-workflow-validator.log`, `/tmp/lem129-final-ci-scope.log`.
- Plan, diseño, copy y auditoría de datos: [plan](../superpowers/plans/2026-11-07-size-guide-pdp-page.md), [especificación](../superpowers/specs/2026-11-07-size-guide-pdp-page-design.md), [copy](../content/2026-11-07-size-guide-copy-draft.md), [auditoría](../content/2026-11-07-size-guide-data-audit.md). Zeelool es la referencia principal de composición; no se atribuye una nueva inspección de Figma.

## Integración pendiente y estado

LEM-129 y LEM-105 permanecen In Progress; PR64 permanece borrador. La página Shopify existente estaba publicada con `templateSuffix:null` en la lectura del 07-11; no se asignó `guia-medidas`, no se guardaron ajustes/SEO y no se subió ningún tema. Faltan render nativo Shopify, guardado en editor, SEO y destino publicado correctamente configurado; la convención física del ancho total y las medidas del SKU deben confirmarse con catálogo antes de presentar cifras como verificadas.

Estas pruebas acreditan fixtures renderizados desde Liquid mediante LiquidJS y navegador Chromium, no Shopify nativo, otros navegadores, edición Admin ni catálogo físico. No se actualizaron filas de la planilla QA como si fueran comprobaciones nativas. No se hizo merge del PR, publicación ni cambio de estado a Complete. Cada ticket requiere revisión humana propia antes de esos pasos.
