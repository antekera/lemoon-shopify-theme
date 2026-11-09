# Guía de rostro — procedencia y mantenimiento de imágenes

LEM-103 · 8 de noviembre de 2026. Ilustraciones originales generadas con `image_gen` integrado. El usuario aprobó los seis contornos y el acabado editorial de grafito/acuarela para ajuste, y pidió señalar sus zonas. Son personas ficticias y ayudas educativas, sin representar SKU, medidas ni garantías de calce.

## Archivos que consume el tema

- Rostros activos: `assets/lemoon-face-{oval,round,square,heart,diamond,long}-editorial-v3-{180,360,640,960}.webp`; índice180/360, módulos360/640/960, srcset y contain1:1. Los originalesv1 se conservan como fuente histórica, sin ser el fallback actual.
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

## Prueba local de rostro ovalado con cabello · 09-11-2026

Propuesta solicitada, pendiente de revisión visual antes de replicar. El retrato ovalado predeterminado y su miniatura usan `assets/lemoon-face-oval-editorial-v3-{180,360,640,960}.webp`. Imagen generada con `image_gen` integrado en modo edición, con las ilustraciones de ajuste frontal y pómulos como referencias de grafito/acuarela, textura de papel y ropa gris. Conserva fondo transparente, cuello continuo, vista frontal y contorno despejado, con cabello retirado del rostro. No representa una persona real ni un SKU. El `image_picker` conserva prioridad y evita activar la superposición si se cambia la imagen. PNG original preservado fuera del tema y derivados WebP q84/m6 sin retoque semántico. La iteración v2 y sus derivados se archivaron fuera del tema al sustituirlos por v3.

Prompt de la primera iteración v2 (histórica):

> Edit the provided Lemoon educational oval-face illustration. This is a premium adult eyewear ecommerce educational portrait, not children's art. Keep the EXACT square composition and face registration: perfectly front-facing, same eye positions and scale, same neutral expression, same visible ears, oval chin, neck and shoulders, ivory skin with subtle pencil/watercolor shading and dark navy thin facial lines. Add natural softly textured dark brown hair, swept back off the face with a subtle side part, small natural wisps near the temples, fuller hair behind the ears. Keep the entire oval facial contour easy to trace; hair must not cover eyebrows, cheeks or jaw. Humanize the eyes and skin gently, more mature and warm but retain the restrained editorial illustration character, no photorealism. Show no glasses, no jewelry, no text, no numbers, no arrows. Transparent background, retain same shoulder crop. Preserve face coordinates closely because a separate glasses graphic will be layered across the eyes in HTML. Do not add a border, frame or shadow outside the illustration. Deliver one high quality transparent raster portrait.

Prompt de la corrección v3:

> Edit target is image 1 (the front-facing oval face portrait with hair). Images 2 and 3 are STYLE REFERENCES ONLY: match their sophisticated adult graphite-pencil/digital-watercolor editorial illustration finish, paper grain, muted natural skin, subtle imperfections and softly drawn facial features. Convert the polished smooth fashion/beauty illustration of image 1 to that warm hand-drawn editorial style. Preserve an unmistakably oval face, direct straight-on perfectly symmetrical pose, level eyes, hair swept away from the cheeks and jaw, connected head/neck/shoulders. Make the person feel human and natural, not doll-like, no large anime eyes, no heavy cosmetic makeup, no plastic smoothing, no bold dark outline along the skin. Hair should have fine sketched strands and gently fade at edges; add a quiet gray crew-neck top with textured shading like the references. Keep the face and eyes centered exactly on the square canvas: eye midpoints aligned horizontally, nose bridge and chin on x=50% of canvas. Leave margin around hair and shoulders. Keep a square composition with approximately the same head size and vertical eye position as image1, no turning or tilting. IMPORTANT no eyewear or glasses whatsoever; the website adds those separately. No highlights, yellow rings, arrows, text or UI. Preserve a genuinely transparent background, with feathered graphite/watercolor shoulder edges. Deliver one premium educational raster portrait, easy to visually compare face contour and eyewear.

Las monturas superpuestas clonan el SVG canónico `lemoon-quiz-visual`; no forman parte del raster. Su escala es ilustrativa y se calibró para este retrato, sin equivalencias en milímetros ni inferencia de ajuste. En esa primera prueba, los cinco rostros restantes conservaban las imágenes originales; la ampliación solicitada abajo sustituye ese alcance histórico.

## Ampliación a los seis rostros · 09-11-2026

El usuario solicitó extender el estilo y la funcionalidad revisados del ovalado a los otros cinco rostros. Se generó una edición por rostro con image_gen integrado, usando el v1 de esa familia como referencia del contorno, el ovaladoeditorialv3 como referencia de acabado y la ayuda de puente como referencia adicional de técnica. Todas son personas ficticias en grafito/acuarela, cabello retirado del contorno, rostro frontal, cuello continuo y prenda gris. No se alteraron las ilustraciones de ajuste ni los SVG de monturas. Veinte derivados responsive nuevos, sin borrar los v1. El conjunto local requiere revisión visual; no acredita publicación ni calce real.

Prompt común de ampliación (sustituir tipo y rasgos por la tabla):

> Create one standalone square transparent educational portrait by editing reference image1, the <type> face diagram. Reference1 defines the face SHAPE to preserve, not its mannequin-like rendering. Reference2 is the user-approved oval portrait: use its same mature graphite-pencil and digital-watercolor finish, muted natural skin, humane eyes, soft paper texture in brushwork, dark brown swept-back hair, gray crew-neck top and feathered shoulders. Reference3 is an additional approved STYLE reference of the same technique. <shape-specific cues>. Show an adult fictitious person perfectly straight-on, level eyes and neutral warm expression, with natural small imperfections, no doll/anime effect, no heavy makeup, no bold navy contour. Hair stays behind the cheekbones, jaw and forehead edges so the face outline is easy to understand. Keep the head/nose/chin center on x50% of the square canvas and the line between pupil centers near y40% of the canvas. Keep enough margin around all hair and shoulders; centered continuous neck and gray shirt shoulders, no cut neck. Scale the head comparably to reference2, adjusting the width/length only as the requested face type requires. IMPORTANT no glasses or eyewear; those are layered by the website. No yellow markings, text, arrows, panels, UI, borders or logos. Genuinely transparent background with softly feathered graphite/watercolor edges. One premium adult editorial illustration, square composition.

| Tipo | Rasgos específicos pedidos |
| --- | --- |
| round | Soft circular contour, full cheeks, width/length close, rounded jaw/chin; visibly rounder and shorter than oval. |
| square | Forehead/cheek/jaw similar width, angular jaw corners and broad flat chin; no tapered lower face. |
| heart | Broad upper forehead/temples and cheek area narrowing to a delicate pointed chin; forehead visible. |
| diamond | Cheekbones broadest; narrower forehead/temples and angular chin/jaw, natural diamond contour. |
| long | Distinctly longer than wide, straight narrow sides, long midface and gently rounded chin; distinguish from oval. |

La altura/anchura real del arte generado varía entre familias; las posiciones finales de superposición se calibran por separado en CSS, no por la solicitud aproximada del prompt. Conservar las cuatro resoluciones por familia y revisar a tamaño móvil. La serie usa el mismo q84/m6 y conversión sin retoque semántico del raster.
