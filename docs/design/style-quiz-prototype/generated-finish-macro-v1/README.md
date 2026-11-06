# Acabados · fotografías macro v1

Generadas el 06-11-2026 con la herramienta integrada `image_gen.imagegen`, por solicitud del usuario de hacer Acabados más realista y cercano a la presentación de Color.

Dos acercamientos fotográficos conceptuales al borde de un armazón carbón: Mate con superficie difusa y microtextura, Brillante con superficie pulida y reflejo de softbox. Mismo tono para que la diferencia principal sea el acabado. No son fotografías de SKU ni acreditan composición o prestaciones.

## Archivos

- Originales1254×1254: [Mate](lemoon-quiz-finish-matte-macro-v1.png) y [Brillante](lemoon-quiz-finish-glossy-macro-v1.png). Los originales de la herramienta también se conservan.
- [Prompts completos y archivos de origen](prompts.json).
- Cuatro JPEG calidad85: `assets/lemoon-quiz-finish-{matte,glossy}-macro-v1-{128,256}.jpg`, proporción1:1 sin recorte,29.140 bytes en total. [Manifiesto con dimensiones, bytes y SHA256](web-exports.json).

## Integración

Rama `finish` de `lemoon-quiz-options.liquid`, miniatura64×64 con srcset128/256 y sizes64px, dimensiones explícitas, carga diferida y alt vacío. Tarjetas horizontales compactas de mínimo96px, dos columnas, etiqueta HTML y check visible al seleccionar, como Color. Se conservan los códigos `matte`/`glossy`, checkbox, foco, ranking y materiales.

Los287 archivos existentes en assets/ se verificaron por SHA256:286 siguen idénticos y ninguno fue eliminado. Solo cambia intencionalmente lemoon-style-quiz.css para la presentación compacta; todos los archivos de imágenes anteriores se conservan intactos. El snippet SVG anterior permanece idéntico. Evidencia de preservación en el directorio Git común `delivery-evidence/LEM-11-finish-macro-2026-11-06`.

Verificación local:18/18 pruebas existentes de render/tarjeta, Theme Check sin ofensas y revisión visual en1440px y390px. Ambas imágenes cargan y las opciones se seleccionan sin desborde. Sin publicación en Shopify.
