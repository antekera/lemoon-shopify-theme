# Materiales del quiz · estudio v1

Generadas el 06-11-2026 con `image_gen.imagegen` integrado por solicitud del usuario. Se usó la imagen óptica del primer paso como referencia de perspectiva, escala, fondo blanco y luz. Cada fotografía muestra una sola montura tradicional, completa, sin marca ni textos.

| Opción | Código | Referencia visual |
| --- | --- | --- |
| Acetato | `acetate` | Armazón completo ámbar pulido |
| Metal | `metal` | Aro fino plateado y plaquetas |
| Titanio | `titanium` | Aro fino gris satinado y plaquetas |
| TR-90 | `tr90` | Armazón completo oscuro mate |
| Madera | `wood` | Armazón con veta natural visible |
| Mixto | `mixed` | Frente superior carey y aro inferior metálico |

Son ejemplos conceptuales de apariencia y construcción. No identifican SKU Lemoon ni acreditan composición o prestaciones. El color o acabado no demuestra un material; las etiquetas y los datos de producto verificados siguen siendo necesarios.

## Archivos e integración

Los seis originales PNG1536×1024 se conservan aquí como `lemoon-quiz-material-{acetate,metal,titanium,tr90,wood,mixed}-studio-v1.png`, además de sus originales en el directorio de generación de la herramienta. [Prompts completos](prompts.json).

Doce exports JPEG de calidad85, sin recorte: `assets/lemoon-quiz-material-{acetate,metal,titanium,tr90,wood,mixed}-studio-v1-{480,960}.jpg`. Dimensiones480×320 y960×640;550.926 bytes en total. [Dimensiones, bytes y SHA256](web-exports.json).

`lemoon-quiz-options.liquid` comparte la rama de fotografías de estudio entre Categoría y Material. Retícula de dos columnas, imagen contain3:2, srcset480/960, carga diferida y alt vacío junto a la etiqueta HTML del checkbox. Sin cambios a códigos de materiales, ranking, Shopify ni Acabados.

Se comprobaron por SHA256 los275 archivos que ya existían en `assets/`: ninguno modificado ni eliminado. El snippet SVG anterior permanece idéntico. Evidencia en el directorio Git común `delivery-evidence/LEM-11-material-studio-2026-11-06`.

## Referencias de materiales

Se consultaron fuentes de fabricantes para orientar las referencias visuales, sin incorporar fotografías externas ni trasladar sus afirmaciones técnicas al quiz: [Silhouette: titanio](https://www.silhouette-group.com/en/stories/high-tech-titanium), [Vallon: materiales](https://www.vallon.com/en-us/pages/frame-materials), [catálogo Tom Tailor2026](https://www.eschenbach-catalogues.com/catalogs/2026_1_TT/pdf/complete.pdf), [Shwood: madera](https://shwoodshop.com/) y [Warby Parker: mixtos](https://www.warbyparker.com/eyeglasses/mixed-material).

## Verificación local

18/18 pruebas existentes de render/tarjeta y Theme Check:311 archivos sin ofensas. Revisión visual en1440px y390px: seis imágenes cargadas, encuadre completo, sin desborde horizontal y selección de materiales funcional. No acredita publicación ni fotografía de catálogo real.
