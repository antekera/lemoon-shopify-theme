# Guía de rostro — procedencia y mantenimiento de imágenes

LEM-103 · 8 de noviembre de 2026. Ilustraciones originales generadas con `image_gen` integrado. El usuario aprobó los seis contornos y el acabado editorial de grafito/acuarela para ajuste, y pidió señalar sus zonas. Son personas ficticias y ayudas educativas, sin representar SKU, medidas ni garantías de calce.

## Archivos que consume el tema

- Rostros: `assets/lemoon-face-{oval,round,square,heart,diamond,long}-v1.webp` conserva los maestros transparentes de 1254×1254. El índice usa derivados 180/360 y los módulos 360/640/960; `srcset`, proporción 1:1 y `contain`.
- Ajuste: `assets/lemoon-fit-{bridge,cheek,temple}-editorial-v1-{350,700,1400}.webp`. Tres vistas con marcas lemon: apoyo nasal, separación aro/pómulo y curva de patilla detrás de la oreja. Los de 700 px miden 700×438; `contain` en panel 8:5, carga diferida y dimensiones reservadas. Los nueve suman 246.180 bytes.
- Se conservan títulos y consejos en HTML, alt vacío si duplican la explicación y prioridad del `image_picker` del editor. Las siluetas de armazón pertenecen al snippet compartido con el quiz; no regenerarlas como parte de esta serie.

Los PNG maestros de ajuste, láminas de propuesta y capturas de iteraciones se archivaron fuera del repositorio; no se cargan en storefront. El SVG anterior permanece como referencia de código, fuera del fallback predeterminado. La codificación WebP fue una conversión técnica (`cwebp -q 84 -m 6 -resize <ancho> 0`), sin retoque semántico.

## Prompt común de las tres piezas de ajuste

Se utilizó la misma lámina editorial aprobada como referencia, manteniendo identidad y anatomía. Añadir al prompt común la vista y zona indicadas abajo:

> Edit the reference into ONE standalone raster illustration for a Lemoon eyewear fit guide. The reference image is the APPROVED art direction and person: preserve the adult person's identity, natural anatomy, short textured dark hair, charcoal/graphite pencil and digital watercolor finish, dark navy softly rectangular eyeglasses, warm ivory paper texture and muted gray clothing. Keep it an adult editorial illustration, not photography, not vector/SVG, not cartoon or cute. Output one landscape image in an 8:5 aspect ratio (approximately 1600 x 1000), with only ONE person/view, centered. Preserve the entire head, connected neck and enough shoulders with clear margin on every side. Do not crop the crown or neck. Recompose with quiet ivory whitespace around the portrait as necessary; do not stretch anatomy. No words, labels, letters, numbers, logos or UI. Preserve realistic eyes, frame perspective, hinges and continuous head-neck anatomy.
> Add exactly ONE restrained instructional highlight at the specified location: a fine open oval or partial curved callout in lemon yellow #F7E600 with a very fine navy edge for contrast. It should be a neat, small editorial mark, not a broad neon glow, not a filled patch, not a cartoon doodle. The mark must not obscure anatomy or the frame. No extra highlighting elsewhere.

| Pieza | Dirección específica |
| --- | --- |
| Puente | Vista frontal. Óvalo pequeño sobre el apoyo del puente en la nariz, bajo las cejas, sin envolver los ojos. |
| Pómulos | Vista tres cuartos hacia la izquierda, ambos ojos visibles. Marca horizontal en el espacio bajo el borde exterior del lente cercano, sobre el pómulo. |
| Patillas | Perfil hacia la izquierda y cuello continuo. Marca pequeña sobre/detrás de la oreja, donde pasa y se curva la patilla; no alrededor de toda la oreja. |

Cualquier reemplazo debe conservar cabeza, cuello y hombros completos, ojos y armazón coherentes y la misma persona entre vistas. Revisar el resultado a tamaño móvil; el marcador no puede tapar el detalle que explica. Contrato visual en [DESIGN.md](../../DESIGN.md) y receta en [guide-help](../components/recipes/guide-help.md).
