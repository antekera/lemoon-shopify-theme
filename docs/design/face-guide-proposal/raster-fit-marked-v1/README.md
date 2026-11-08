# Ilustraciones de ajuste — raster editorial con zonas señaladas

08-11-2026 · LEM-103. El usuario aprobó la dirección de grafito y acuarela digital de [la lámina base](../raster-fit-editorial-v1.png): «Sí. Se ve muy bien»; pidió señalar las áreas que deben observarse. Se conservaron rasgos adultos, anatomía continua y el acabado editorial; las marcas lemon señalan zonas de observación, sin cotas ni garantías de ajuste.

## Archivos y zona destacada

| Pieza | Master de procedencia | Prompt final | Marca |
| --- | --- | --- | --- |
| Puente | [PNG](bridge-master.png) | [Prompt](bridge.prompt.md) | Apoyo del puente en la parte superior de la nariz, sin cubrir los ojos |
| Pómulos | [PNG](cheek-master.png) | [Prompt](cheek.prompt.md) | Separación bajo el borde exterior del lente cercano, sobre el pómulo |
| Patillas | [PNG](temple-master.png) | [Prompt](temple.prompt.md) | Paso y curva de la patilla por la parte superior/posterior de la oreja |

Las tres se crearon con la herramienta integrada **image_gen**, editando la lámina aprobada como referencia; no se usó la API/CLI de generación. Los masters PNG originales se copiaron aquí y permanecen también en la salida original del generador. No hay texto incrustado: los títulos y explicaciones siguen en HTML localizado.

Los exports que consume el tema son `assets/lemoon-fit-{bridge,cheek,temple}-editorial-v1-{350,700,1400}.webp`. Se codificaron con `cwebp -q 84 -m 6 -resize <ancho> 0`: cambio técnico de formato/tamaño, sin retoque del contenido. Los de700px miden700×438; se conservan proporción y composición mediante `contain` dentro del panel8:5. Los nueve exports suman246.180bytes; la serie700 suma50.316bytes. [Bytes y hashes](asset-manifest.json).

## Integración y límites

La sección `lemoon-face-guide` utiliza estas tres imágenes como fallback de ajuste, con `srcset`350/700/1400, dimensiones reservadas, carga diferida y alt vacío. Los tres `image_picker` existentes del editor conservan prioridad. El HTML contiene el consejo completo; el color de la marca no es la única forma de identificar la zona, pues cada figura tiene su título y explicación.

El SVG anterior se conserva como referencia de la iteración previa y no se renderiza por defecto en la sección de ajuste. Las seis ilustraciones de formas de rostro y las siluetas canónicas de monturas del quiz permanecen con su contrato anterior.

No son fotografías de una persona real ni de productos de Lemoon; no representan un SKU, prestaciones clínicas o medidas reales. Se inspeccionaron las tres imágenes generadas y sus puntos de énfasis. La aceptación del estilo y la integración local no acreditan publicación Shopify ni prueba de calce de catálogo.
