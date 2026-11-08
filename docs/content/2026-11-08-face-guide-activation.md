# LEM-103 — Activación pendiente en Shopify

La implementación local está lista para revisión. No se ha subido el tema ni cambiado la página CMS. Conservar `/pages/elegir-lentes-segun-tu-rostro` y los enlaces existentes.

Una vez aprobada la implementación y autorizada la subida a un tema de revisión:

1. Leer y respaldar la página existente por su handle, la plantilla asignada y sus metadatos; comprobar que no haya cambios concurrentes.
2. Subir los archivos revisados al tema autorizado. No utilizar el tema publicado por inferencia.
3. Revisar los seis bloques y sus campos en el editor; sustituir una imagen/texto/destino y verificar el render, conservando los valores finales aprobados. Los textos se administran desde la sección y sus bloques; el contenido CMS previo no se borra automáticamente.
4. Asignar el sufijo `guia-rostro` a esa página, sin cambiar el handle, solo cuando el tema que debe servirla disponga de la nueva plantilla. La asignación de página puede afectar otros temas: no realizarla anticipadamente sobre una plantilla incompatible.
5. Aplicar los metadatos propuestos, previa revisión del valor existente:
   - Título de página: **Elegir lentes según tu rostro**.
   - Título SEO: **Lentes según tu rostro: guía visual | Lemoon**.
   - Descripción SEO: **Explora seis formas de rostro y distintas siluetas de armazón. Compara curvas, ángulos y proporciones, y revisa el ajuste para elegir a tu manera.**
6. Validar el render Shopify móvil/escritorio, edición de bloques, teclado, imágenes, metadata y footer. Abrir las seis salidas a PLP con sus filtros, editar/quitar chips y comprobar resultados/estado vacío con datos reales.
7. Registrar la evidencia final en la planilla de QA del ticket y solicitar revisión humana de esa revisión. Publicación y deploy mantienen su autorización independiente.

El preview local usa el mismo Liquid mediante un renderer de pruebas y un shell visual del storefront. Los GET de PLP se sirven desde el preview Shopify existente. Esa vista sirve para revisar la implementación, pero no demuestra los pasos anteriores.

## Medición de clics

El tema publica `lemoon:face_guide_click` respetando el permiso de Analytics. La recepción en GA4 requiere activar el receptor de Customer Events y sus dimensiones: [contrato, código y pasos](../analytics/face-guide-clicks.md). No se ha conectado el receptor ni modificado GA4. Incorporar Pixel Helper/DebugView y la prueba de consentimiento/revocación al QA remoto; un evento del tema o una prueba con stub no acreditan recepción en Google.
