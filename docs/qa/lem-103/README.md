# LEM-103 — Activación y QA

Página: `/pages/elegir-lentes-segun-tu-rostro`. Plantilla: `page.guia-rostro.json`; sección: `lemoon-face-guide`. Textos, imágenes, dos formas de armazón y destinos son editables desde Shopify. Contrato visual en [DESIGN.md](../../../DESIGN.md), [fuentes](../../content/2026-11-08-face-shape-guide-research.md) y [procedencia de imágenes](../../design/face-guide-assets.md).

## Validación registrada

- 553/553 unitarias en 48 archivos y Theme Check: 318 archivos/cero observaciones, reejecutados tras la limpieza documental.
- 16/16 Chromium de la guía: salidas filtradas, fallbacks, imágenes, teclado, consentimiento y 27 eventos sin duplicados.
- QA local a320/390/749/750/820/1440: enlaces textuales centrados en móvil/izquierdos desde 750 px, targets 44px, sombra de sección, foco y colores forzados. Estrella sin contorno comprobada 390/1440.
- Revisiones independientes de contenido/código/convenciones Approved. Solo lectura por responsabilidad, sin aislamiento técnico. La revisión humana del PR sigue pendiente.
- Sin overflow de guía. El shell de announcement-bar heredado presenta 2px a 320px. Las pruebas usan LiquidJS y publisher/pixel simulados; no acreditan CMS, render alojado ni recepción GA4.

## Activación Shopify, después de autorización

1. Leer y respaldar la página existente, plantilla y metadatos; comprobar cambios concurrentes y conservar el handle.
2. Subir únicamente la revisión aprobada al tema autorizado. No inferir permiso para producción.
3. Probar bloques/overrides de texto, imágenes y destinos en el editor, conservando el contenido final aprobado.
4. Asignar el sufijo `guia-rostro` solo cuando el tema que sirve la página contenga la nueva plantilla; la asignación CMS puede afectar otros temas. No borrar automáticamente el contenido CMS anterior.
5. Revisar/aplicar metadata: título «Elegir lentes según tu rostro»; SEO «Lentes según tu rostro: guía visual | Lemoon»; descripción «Explora seis formas de rostro y distintas siluetas de armazón. Compara curvas, ángulos y proporciones, y revisa el ajuste para elegir a tu manera.»
6. Validar móvil/escritorio, teclado, imágenes, metadata/footer y las seis salidas a PLP; editar/quitar filtros y probar el estado vacío con catálogo real. [Fixture fechado de catálogo](../../../tests/fixtures/face-guide-catalogue-links.json): no usar sus conteos como stock comercial.
7. Registrar QA real en la planilla del ticket y obtener revisión humana de la revisión entregada. Publicación y despliegue requieren su autorización separada.

## Analytics pendiente de activar

El tema emite `lemoon:face_guide_click` respetando consentimiento. Para conectar el receptor, registrar dimensiones y verificar recepción real, seguir [la guía GA4](../../analytics/face-guide-clicks.md). No duplicar pixels existentes. Código y pruebas locales no demuestran que Google reciba los clics.
