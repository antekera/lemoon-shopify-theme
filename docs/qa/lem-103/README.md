# LEM-103 — Activación y QA

Página: `/pages/elegir-lentes-segun-tu-rostro`. Plantilla: `page.guia-rostro.json`; sección: `lemoon-face-guide`. Textos, imágenes, dos formas de armazón y destinos son editables desde Shopify. Contrato visual en [DESIGN.md](../../../DESIGN.md), [fuentes](../../content/2026-11-08-face-shape-guide-research.md) y [procedencia de imágenes](../../design/face-guide-assets.md).

## Verificación nativa — 09-11-2026

- Página Shopify `161807138984`, publicada en `lemoon.cl`, tenía `templateSuffix: null` desde el 04-10-2026 y servía la plantilla genérica. El reporte del usuario autorizó corregir esta asignación: `guia-rostro`, confirmada mediante lectura Admin posterior a las 12:26:08Z. Se conservaron handle, título y cuerpo CMS.
- Tema publicado `155307737256`; la plantilla remota ya contenía la sección correcta. No se realizó ningún upload de tema para esta reparación.
- URL canónica, sin `view` ni preview: `/pages/elegir-lentes-segun-tu-rostro`. Chromium autenticado a 390/820/1440 px: HTTP200, un H1, todas las imágenes decodificadas, seis salidas con `filter.p.m.custom.frame_shape`, sin overflow ni errores JavaScript. La prueba inicial tras asignación todavía recibió contenido anterior; una lectura posterior de la URL canónica confirmó la guía completa.
- Evidencia privada: `.git/delivery-evidence/production-regressions-20261109/face-verified.json` y capturas de los tres anchos. Esta comprobación no acredita recepción GA4 ni aceptación humana final del ticket.

## Validación histórica de implementación

- 553/553 unitarias en 48 archivos y Theme Check: 318 archivos/cero observaciones, reejecutados tras la limpieza documental.
- 16/16 Chromium de la guía: salidas filtradas, fallbacks, imágenes, teclado, consentimiento y 27 eventos sin duplicados.
- QA local a320/390/749/750/820/1440: enlaces textuales centrados en móvil/izquierdos desde 750 px, targets 44px, sombra de sección, foco y colores forzados. Estrella sin contorno comprobada 390/1440.
- Revisiones independientes de contenido/código/convenciones Approved. Solo lectura por responsabilidad, sin aislamiento técnico. La revisión humana del PR sigue pendiente.
- Sin overflow de guía. El shell de announcement-bar heredado presenta 2px a 320px. Las pruebas usan LiquidJS y publisher/pixel simulados; no acreditan CMS, render alojado ni recepción GA4.

## Mantenimiento de la activación Shopify

1. Leer y respaldar la página existente, plantilla y metadatos; comprobar cambios concurrentes y conservar el handle.
2. Integrar los cambios revisados por develop → main; producción se publica mediante CI bajo la autorización permanente. Una entrega de código no acredita la asignación CMS.
3. Probar bloques/overrides de texto, imágenes y destinos en el editor, conservando el contenido final aprobado.
4. Asignar el sufijo `guia-rostro` solo cuando el tema que sirve la página contenga la nueva plantilla; la asignación CMS puede afectar otros temas. No borrar automáticamente el contenido CMS anterior.
5. Revisar/aplicar metadata: título «Elegir lentes según tu rostro»; SEO «Lentes según tu rostro: guía visual | Lemoon»; descripción «Explora seis formas de rostro y distintas siluetas de armazón. Compara curvas, ángulos y proporciones, y revisa el ajuste para elegir a tu manera.»
6. Validar móvil/escritorio, teclado, imágenes, metadata/footer y las seis salidas a PLP; editar/quitar filtros y probar el estado vacío con catálogo real. [Fixture fechado de catálogo](../../../tests/fixtures/face-guide-catalogue-links.json): no usar sus conteos como stock comercial.
7. Registrar QA real en la planilla del ticket y obtener revisión humana de la revisión entregada. La aceptación humana sigue separada del deploy automático autorizado.

## Analytics pendiente de activar

El tema emite `lemoon:face_guide_click` respetando consentimiento. Para conectar el receptor, registrar dimensiones y verificar recepción real, seguir [la guía GA4](../../analytics/face-guide-clicks.md). No duplicar pixels existentes. Código y pruebas locales no demuestran que Google reciba los clics.
