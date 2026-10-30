# Lemoon — uso de marca en el tema

[DESIGN.md](../../DESIGN.md) es la especificación canónica de valores, componentes y responsive. Este documento define cómo aplicar esa base a la marca sin mantener una segunda tabla de tokens.

## Identidad visual

Usar composición limpia, espacio generoso, jerarquía tipográfica clara y fotografía editorial de óptica. Warby Parker es la inspiración histórica de esa dirección; no es una plantilla que deba copiarse ni una fuente de requisitos nuevos.

El storefront usa Urbanist para títulos/acciones y Hanken Grotesk para cuerpo, labels y metadatos. La base es blanco/carbon, navy para acciones y texto de marca, beige para paneles y lemon para acentos localizados. Elegir roles, pesos, medidas y estados según [DESIGN.md](../../DESIGN.md), incluidas las excepciones locales de tarjeta, PLP y shell legal.

## Logo

Usar [lemoon-logo-refined-navy.svg](../../assets/lemoon-logo-refined-navy.svg), el activo oficial utilizado por [header.liquid](../../sections/header.liquid). Conservar proporción, trazados y fill; no reconstruirlo con Urbanist ni colorear una letra por separado. Los 120×28 del header son una aplicación local. Las variantes, mínimos y clearspace se definen en [LEM-80](https://linear.app/antekera/issue/LEM-80) y se incorporan a la biblioteca de [LEM-132](https://linear.app/antekera/issue/LEM-132).

## Imágenes y presentación

- Producto: fondo blanco o gris muy claro, vistas frontal/lateral/perspectiva y armazón completo.
- Lifestyle: luz natural, entornos limpios, personas diversas y composición editorial.
- Diagramas: cotas legibles en mm y relación clara entre medida y pieza.
- Iconos: conservar la familia lineal de la superficie; no mezclar estilos.
- Banners: mantener texto legible y punto focal en móvil; evitar texto esencial incrustado en la fotografía.

Los badges y radios se seleccionan por componente conforme a DESIGN.md: las etiquetas pill de producto y los badges editoriales genéricos son familias distintas.

## Voz y contenido

Usar es-CL, CLP, frases claras y directas, tono cercano y CTAs que expliquen la acción. Reutilizar claves de locales y contenido real del negocio. [LEM-55](https://linear.app/antekera/issue/LEM-55) es dueño de los mensajes finales y la guía editorial. Cada ticket de página resuelve sus hechos comerciales antes de publicar.

## Historia de la guía

La planificación inicial exploró colores alternativos, un grid 1280px de 12/4 columnas, radios uniformes y una segunda “o” lemon. La especificación operativa usa ahora los roles y componentes existentes enlazados en DESIGN.md; esas exploraciones no instruyen cambios sobre el tema.
