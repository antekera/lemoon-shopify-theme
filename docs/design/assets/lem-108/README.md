# LEM-108 — Estantería editorial

Solicitud de Miguel, 2 de noviembre de 2026: retirar el enlace «Conversemos» y usar una imagen realista de una estantería tipo tienda física con lentes.

- Generación: herramienta integrada `imagegen`, sin imágenes de referencia.
- [Original PNG](estanteria-original-v2.png), 1402×1122.
- [JPG para Shopify](lemoon-nosotros-estanteria-v2.jpg), mismas dimensiones, calidad JPEG 86; sin recorte ni ampliación.
- Files: `gid://shopify/MediaImage/46708940996776`.
- [Imagen CDN](https://cdn.shopify.com/s/files/1/0763/3371/1528/files/lemoon-nosotros-estanteria-v2.jpg?v=1793652452).
- Selector: `lemoon-about-page.image`; referencia `shopify://shop_images/lemoon-nosotros-estanteria-v2.jpg`.
- Alt: «Escena ilustrativa de armazones de lentes exhibidos en estantes de madera.».
- Destino: tema no publicado de revisión `189663019176`, sin modificación del tema publicado.

Escena generada de carácter editorial. No es una fotografía de un local, equipo o producto específico de Lemoon; no acredita existencias, materiales ni fabricación. No se rotula como tienda física propia. La imagen sigue siendo editable en el selector del tema.

## Prompt de generación inicial (v1)

Generate one extremely photorealistic editorial interior photograph for an eyewear ecommerce About Us page. Subject: a close view of a beautifully organized real-looking optical shop display shelving, no people. Composition approximately 5:4 landscape, camera level, a restrained section of three warm pale oak shelves recessed into a creamy plaster wall, with about 12 to 16 distinct eyeglass frames on small discrete clear acrylic or matte ivory stands. Actual plausible eyeglasses: intact symmetrical rims, correct two temples folded behind, bridge joins, tiny hinges, nose pads where appropriate, realistic lens transparency and subtle reflections, no floating objects, no duplicated frames or warped shapes. Mix thin dark metal, understated black acetate and translucent honey/tortoiseshell optical frames, natural variation, no visible designer branding. Refined everyday optical retail environment rather than luxury jewelry store. Soft natural daylight entering from camera left, quiet warm offwhite and pale oak with sparse dark navy accents. Crisp tactile oak grain, realistic glass refraction, credible contact shadows, gentle camera depth of field, eye-height commercial interior photography with 50mm lens, premium but approachable, restrained colors, no CGI sheen or oversaturated yellow, natural photographic imperfections. Focus attention on the central glasses on the middle shelf; product arrangement must remain coherent when cropped to 5:4 desktop or mobile. No signage, no text, no logos, no medical equipment, no stock-photo wide store facade, no storefront location cues, no factory or workshop, no claims of being a real Lemoon store. This is a generic illustrative editorial visual, not a picture of a specific SKU. Save the final image and include its local file path in the output hint so it can be added to the local Shopify theme project.


## Edición final sin plantas (v2)

Miguel solicita retirar las plantas. Se edita la imagen original con la herramienta integrada imagegen; se eliminan hojas, tallos, maceta y sombras vegetales, conservando la estantería, los lentes y la luz. La v1 queda como antecedente; la v2 se seleccionó temporalmente en el tema de revisión y después se retiró.

### Prompt final de edición

Edit the supplied photorealistic eyewear shelving photograph. Remove ALL plants, foliage, trailing vines, leaves, stems, and plant pots completely, including the plant and pot along the upper left edge and top shelf. Also remove their leafy cast shadows from the left plaster wall. Seamlessly reconstruct the plain creamy plaster wall and pale oak shelf behind the removed vegetation using the same textures and physically plausible soft natural daylight. Preserve the exact existing composition, camera framing, 5:4 landscape proportions, oak shelving geometry, every eyeglass frame with its precise shape/material/placement, transparent display stands, lighting warmth, realistic lens reflections, natural contact shadows and lower-right navy foreground detail. Do not add anything. No plants or greenery anywhere. No text, logos, signage, people or new decor. The result should look like the same real editorial photograph simply taken without any plants. Save the final edited image and include its local file path in the output hint for integration into the Shopify theme project.


## Estado actual — pendiente pre-go-live

Por decisión posterior de Miguel del 02-11-2026, ninguna de estas imágenes está seleccionada en la página. La vista previa conserva el placeholder abstracto CSS. Ambos originales y JPG se conservan como antecedentes; no son recursos finales aprobados. Seleccionar e integrar la imagen definitiva queda registrado en [LEM-143](https://linear.app/antekera/issue/LEM-143), con LEM-108 como ticket propietario, sin bloquear la revisión actual de la página.
