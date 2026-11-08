# Cómo medir tus lentes — contenido desarrollado

Fecha: 08-11-2026. LEM-105; base de trabajo `45bafbaae0187755c91042f401b18acbb19b489e`.

Estado: **propuesta completa para integración local y revisión humana; no publicada**. Mantiene el diseño de tres pasos, ocho campos editoriales y cinco definiciones ya existentes. El contenido visible no contiene comentarios de investigación, marcas de pendientes ni datos comerciales de muestra.

## Texto visible propuesto (es-CL)

# Cómo medir tus lentes

Parte con unos lentes que te resulten cómodos y una regla marcada en milímetros. Revisa el código de la patilla, toma las medidas que falten y compáralas con las del armazón que estás mirando.

## 1. Lee el código de la patilla

<p>Abre las patillas y busca una serie de números en su cara interior. La patilla, también llamada varilla, es la pieza que llega hasta detrás de la oreja. En algunos armazones, tres números indican el ancho del cristal, el puente y el largo de la patilla, en ese orden y en milímetros.</p>

## 2. Mide el armazón en milímetros

<p>Trabaja sobre tus lentes reales y anota cada medida con su nombre. Mira el frente de forma recta y mantén la regla alineada con el tramo que vas a medir; evita tomar la lectura en diagonal.</p><p>En este esquema, el ancho total va de un extremo exterior del frente al otro. No es lo mismo que medir entre bisagras. Comprueba que las cifras que compares usen los mismos extremos y no calcules el ancho total sumando los dos cristales y el puente: los bordes del armazón también ocupan espacio.</p><p>Las letras A–E te ayudan a ubicar cada parte. Los dibujos no están a escala: usa la regla sobre tus lentes, no sobre la pantalla.</p>

**A · Ancho total**

Mide en línea horizontal desde un extremo exterior del frente hasta el otro, incluyendo los bordes del armazón. Esta es la referencia A del esquema; anótala como ancho total, separada del ancho de un cristal.

**B · Ancho del cristal**

Mide un solo cristal de lado a lado, por su parte más ancha y con la regla horizontal. No incluyas el aro que lo rodea ni el espacio del puente.

**C · Puente**

Mide el espacio más corto entre los bordes interiores de ambos cristales, en la zona del puente. No midas sobre la nariz ni confundas esa distancia con el ancho exterior de la pieza del armazón.

**D · Alto del cristal**

Mide un cristal de arriba abajo, en su parte más alta y con la regla vertical. Deja fuera el aro: esta medida describe el cristal, no la altura de todo el frente.

**E · Largo de patilla**

Sigue la patilla desde la bisagra hasta el extremo, incluida la curva hacia la oreja. Una cinta flexible marcada en milímetros puede ayudarte a seguir ese recorrido. No dobles ni endereces la patilla para medirla.

## 3. Compara las medidas en la página del producto

<p>En la ficha del armazón que te interesa, busca «Características del producto» y abre la pestaña «Medidas». Ten a mano lo que anotaste y compara una medida a la vez, siempre en la misma unidad.</p><ul><li>Revisa el mismo nombre y los mismos extremos de medición: ancho del cristal con ancho del cristal, ancho total con ancho total.</li><li>Usa solo las cifras disponibles del modelo. Si falta una, no la deduzcas desde la foto, el dibujo o una etiqueta de talla.</li><li>Una talla escrita, como pequeño o mediano, no reemplaza las medidas en milímetros ni permite completar las que faltan.</li></ul><p>Si las medidas no coinciden exactamente con las de tus lentes favoritos, revisa qué parte cambia y cuántos milímetros de diferencia hay. Un frente más ancho ocupa más espacio de lado a lado en tu rostro; un cristal más alto cambia la proporción vertical. Las medidas y la forma del puente y las patillas influyen en cómo se apoya y se sostiene el armazón. Una diferencia pequeña no descarta por sí sola un modelo: compara cada medida y observa las formas en las fotos del producto. Si tienes dudas, consulta indicando el modelo y la medida.</p>

## ¿Te falta una medida?

<p>Si una inscripción no se lee, falta un dato en la ficha o no tienes unos lentes para comparar, consulta antes de elegir. Indica el modelo y la medida que necesitas aclarar.</p>

## Bloque compartido que se conserva

Después del primer paso, mantener el dibujo aprobado y el ejemplo `52 □ 18–145`, rotulado como educativo. Mantener la nota «Ejemplo educativo. No representa las medidas de un producto específico.», sus tres filas de significado y el cierre «¿No ves el código?…». No insertar estos textos de nuevo en el cuerpo editable. Las acciones finales siguen siendo **Ver catálogo** y **Consultar una medida**.

## Mapa exacto de integración

Intro y definiciones son texto plano. Los cuerpos `_html` admiten el HTML listado; no envolverlos en un párrafo adicional. Las cinco definiciones usan las claves actuales y son instrucciones de referencia del esquema, no certificaciones de datos físicos de un SKU.

### es

```json
{
  "sections.lemoon_guide.measurements.title": "Cómo medir tus lentes",
  "sections.lemoon_guide.measurements.intro": "Parte con unos lentes que te resulten cómodos y una regla marcada en milímetros. Revisa el código de la patilla, toma las medidas que falten y compáralas con las del armazón que estás mirando.",
  "sections.lemoon_guide.measurements.step_1_title": "1. Lee el código de la patilla",
  "sections.lemoon_guide.measurements.step_1_body_html": "<p>Abre las patillas y busca una serie de números en su cara interior. La patilla, también llamada varilla, es la pieza que llega hasta detrás de la oreja. En algunos armazones, tres números indican el ancho del cristal, el puente y el largo de la patilla, en ese orden y en milímetros.</p>",
  "sections.lemoon_guide.measurements.step_2_title": "2. Mide el armazón en milímetros",
  "sections.lemoon_guide.measurements.step_2_body_html": "<p>Trabaja sobre tus lentes reales y anota cada medida con su nombre. Mira el frente de forma recta y mantén la regla alineada con el tramo que vas a medir; evita tomar la lectura en diagonal.</p><p>En este esquema, el ancho total va de un extremo exterior del frente al otro. No es lo mismo que medir entre bisagras. Comprueba que las cifras que compares usen los mismos extremos y no calcules el ancho total sumando los dos cristales y el puente: los bordes del armazón también ocupan espacio.</p><p>Las letras A–E te ayudan a ubicar cada parte. Los dibujos no están a escala: usa la regla sobre tus lentes, no sobre la pantalla.</p>",
  "lemoon_size_guide.definitions.frame_width": "Mide en línea horizontal desde un extremo exterior del frente hasta el otro, incluyendo los bordes del armazón. Esta es la referencia A del esquema; anótala como ancho total, separada del ancho de un cristal.",
  "lemoon_size_guide.definitions.lens_width": "Mide un solo cristal de lado a lado, por su parte más ancha y con la regla horizontal. No incluyas el aro que lo rodea ni el espacio del puente.",
  "lemoon_size_guide.definitions.bridge": "Mide el espacio más corto entre los bordes interiores de ambos cristales, en la zona del puente. No midas sobre la nariz ni confundas esa distancia con el ancho exterior de la pieza del armazón.",
  "lemoon_size_guide.definitions.lens_height": "Mide un cristal de arriba abajo, en su parte más alta y con la regla vertical. Deja fuera el aro: esta medida describe el cristal, no la altura de todo el frente.",
  "lemoon_size_guide.definitions.temple": "Sigue la patilla desde la bisagra hasta el extremo, incluida la curva hacia la oreja. Una cinta flexible marcada en milímetros puede ayudarte a seguir ese recorrido. No dobles ni endereces la patilla para medirla.",
  "sections.lemoon_guide.measurements.step_3_title": "3. Compara las medidas en la página del producto",
  "sections.lemoon_guide.measurements.step_3_body_html": "<p>En la ficha del armazón que te interesa, busca «Características del producto» y abre la pestaña «Medidas». Ten a mano lo que anotaste y compara una medida a la vez, siempre en la misma unidad.</p><ul><li>Revisa el mismo nombre y los mismos extremos de medición: ancho del cristal con ancho del cristal, ancho total con ancho total.</li><li>Usa solo las cifras disponibles del modelo. Si falta una, no la deduzcas desde la foto, el dibujo o una etiqueta de talla.</li><li>Una talla escrita, como pequeño o mediano, no reemplaza las medidas en milímetros ni permite completar las que faltan.</li></ul><p>Si las medidas no coinciden exactamente con las de tus lentes favoritos, revisa qué parte cambia y cuántos milímetros de diferencia hay. Un frente más ancho ocupa más espacio de lado a lado en tu rostro; un cristal más alto cambia la proporción vertical. Las medidas y la forma del puente y las patillas influyen en cómo se apoya y se sostiene el armazón. Una diferencia pequeña no descarta por sí sola un modelo: compara cada medida y observa las formas en las fotos del producto. Si tienes dudas, consulta indicando el modelo y la medida.</p>",
  "sections.lemoon_guide.measurements.help_title": "¿Te falta una medida?",
  "sections.lemoon_guide.measurements.help_body_html": "<p>Si una inscripción no se lee, falta un dato en la ficha o no tienes unos lentes para comparar, consulta antes de elegir. Indica el modelo y la medida que necesitas aclarar.</p>"
}
```

### en.default

```json
{
  "sections.lemoon_guide.measurements.title": "How to measure your glasses",
  "sections.lemoon_guide.measurements.intro": "Start with glasses that feel comfortable and a ruler marked in millimeters. Check the temple code, take any missing measurements and compare them with the frame you are considering.",
  "sections.lemoon_guide.measurements.step_1_title": "1. Read the temple code",
  "sections.lemoon_guide.measurements.step_1_body_html": "<p>Open the temple arms and look for a series of numbers on the inside. A temple arm is the part that reaches behind your ear. On some frames, three numbers indicate lens width, bridge width and temple length, in that order and in millimeters.</p>",
  "sections.lemoon_guide.measurements.step_2_title": "2. Measure the frame in millimeters",
  "sections.lemoon_guide.measurements.step_2_body_html": "<p>Work with your actual glasses and write down each measurement with its name. Look straight at the front and align the ruler with the part you are measuring; avoid taking the reading diagonally.</p><p>In this diagram, overall width runs from one outside edge of the front to the other. It is not the same as measuring between the hinges. Check that the measurements you compare use the same endpoints, and do not calculate overall width by adding the two lenses and the bridge: the frame edges also take up space.</p><p>Letters A–E help you locate each part. The drawings are not to scale: use the ruler on your glasses, not on the screen.</p>",
  "lemoon_size_guide.definitions.frame_width": "Measure horizontally from one outside edge of the front to the other, including the frame edges. This is reference A in the diagram; record it as overall width, separately from the width of one lens.",
  "lemoon_size_guide.definitions.lens_width": "Measure one lens from side to side at its widest point, keeping the ruler horizontal. Do not include the surrounding rim or the bridge gap.",
  "lemoon_size_guide.definitions.bridge": "Measure the shortest gap between the inner edges of the two lenses at the bridge. Do not measure on your nose or confuse this distance with the outside width of the frame’s bridge piece.",
  "lemoon_size_guide.definitions.lens_height": "Measure one lens from top to bottom at its tallest point, keeping the ruler vertical. Leave out the rim: this describes the lens, not the height of the entire front.",
  "lemoon_size_guide.definitions.temple": "Follow the temple arm from the hinge to the tip, including the curve behind your ear. A flexible tape marked in millimeters can help you follow that path. Do not bend or straighten the arm to measure it.",
  "sections.lemoon_guide.measurements.step_3_title": "3. Compare measurements on the product page",
  "sections.lemoon_guide.measurements.step_3_body_html": "<p>On the product page of the frame you are considering, find “Product details” and open the “Measurements” tab. Keep your notes nearby and compare one measurement at a time, always in the same unit.</p><ul><li>Match the measurement names and endpoints: lens width with lens width, overall width with overall width.</li><li>Use only the measurements available for that model. If one is missing, do not infer it from the photo, drawing or size label.</li><li>A written size such as small or medium does not replace measurements in millimeters or fill in missing values.</li></ul><p>If the measurements do not exactly match your favorite glasses, check which part differs and by how many millimeters. A wider front takes up more space across your face; a taller lens changes the vertical proportions. The measurements and shape of the bridge and temple arms influence how the frame rests and stays in place. A small difference does not, on its own, rule out a frame: compare each measurement and look at the shapes in the product photos. If you are unsure, ask about the model and the specific measurement.</p>",
  "sections.lemoon_guide.measurements.help_title": "Missing a measurement?",
  "sections.lemoon_guide.measurements.help_body_html": "<p>If a marking is unreadable, a product measurement is missing or you do not have glasses to compare, ask before choosing. Include the model and the measurement you need clarified.</p>"
}
```

## Defaults del editor

Para cada idioma, los ocho defaults de `sections.lemoon_guide` en el locale de schema deben coincidir con estos valores:

| Clave de schema | Valor del mapa de storefront |
| --- | --- |
| `measurements_intro_default` | `<p>` + `sections.lemoon_guide.measurements.intro` + `</p>` |
| `measurements_step_1_title_default` | `sections.lemoon_guide.measurements.step_1_title` |
| `measurements_step_1_body_default` | `sections.lemoon_guide.measurements.step_1_body_html` |
| `measurements_step_2_title_default` | `sections.lemoon_guide.measurements.step_2_title` |
| `measurements_step_2_body_default` | `sections.lemoon_guide.measurements.step_2_body_html` |
| `measurements_step_3_title_default` | `sections.lemoon_guide.measurements.step_3_title` |
| `measurements_step_3_body_default` | `sections.lemoon_guide.measurements.step_3_body_html` |
| `measurements_help_body_default` | `sections.lemoon_guide.measurements.help_body_html` |

No cambiar schema, IDs, tipos ni contenido que un comerciante ya haya guardado. H1 de la superficie: conservar `page.title` y fallback «Cómo medir tus lentes». El borrador no asigna plantilla ni actualiza páginas Shopify.

## SEO propuesto (campos nativos; sin escribir en Admin)

- Título: **Cómo medir tus lentes: código y medidas | Lemoon**
- Descripción: **Aprende a leer el código de la patilla y a medir ancho, puente, alto y largo para comparar tus lentes con las medidas de cada armazón.**

## Notas de entrega, fuera del contenido público

- Aproximadamente 710 palabras visibles en español al sumar estos textos, los labels y el bloque compartido; verificar el cómputo real tras integrar el render. Se conservan los textos compartidos: no se editan las instrucciones del modal.
- Redacción original. Fuentes, límites y criterio de convención del ancho en [la investigación](2026-11-08-como-medir-tus-lentes-research.md).
- Sin hechos comerciales que necesiten un placeholder para esta preview. La asignación CMS/SEO, render nativo, verificación de medidas del catálogo y aprobación humana siguen siendo gates de publicación separados.
