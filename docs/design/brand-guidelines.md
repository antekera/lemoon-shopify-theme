# Lemoon — Brand Guidelines v1

Guía práctica para aplicar la identidad visual confirmada en website, redes sociales, email, anuncios y documentos. La composición es editorial y limpia: producto protagonista, espacio generoso y jerarquía clara para acompañar la elección.

[DESIGN.md](../../DESIGN.md) es el único contrato visual del storefront: contiene colores, tipografía, espaciado, componentes, estados, responsive y accesibilidad. Esta guía explica su uso de marca y la selección de archivos; no crea otro sistema de tokens. Las instrucciones para agentes están en [brand-guidance](../agents/brand-guidance.md).

## Alcance de esta versión

Esta versión reúne el contrato visual de LEM-141, los archivos seleccionados de LEM-97 y la identidad actual aceptada al cerrar LEM-80. El logo y las fuentes están seleccionados. Propósito, posicionamiento, voz final y entregas por canal mantienen los responsables indicados al final de la guía. La revisión de esta consolidación corresponde a LEM-79.

Propósito, misión, posicionamiento y promesa de marca se resuelven en LEM-82. La dirección visual anterior orienta la presentación, pero no sustituye esas definiciones estratégicas.

## Logo y símbolos

El [wordmark oficial navy](../../assets/lemoon-logo-refined-navy.svg) es el logo completo. Conservar proporción, trazados y fill original `#0E1A28`, incluido cuando se exporte a un formato compatible con otra superficie. No reconstruirlo con una fuente ni recolorear letras. Los 120×28 del header son una aplicación local, no un mínimo oficial. LEM-80 está cerrado con la identidad actual aceptada. Las variantes adicionales, el área de seguridad y los tamaños mínimos podrán formalizarse después si una aplicación concreta los necesita; no son bloqueantes de la identidad actual.

| Uso | Archivo y tratamiento |
| --- | --- |
| Header del sitio | Wordmark SVG oficial, sin cambios. El símbolo de avatar no lo reemplaza |
| Favicon | [32px](../../assets/lemoon-favicon-32-v1.png); exports [16px](../../assets/lemoon-favicon-16-v1.png) y [48px](../../assets/lemoon-favicon-48-v1.png) para destinos que los requieran |
| Apple touch | [180px](../../assets/lemoon-apple-touch-icon-180-v1.png), entregado; integración pendiente en su superficie |
| Avatar social | [400px](../../assets/lemoon-avatar-social-400-v1.png) y [1024px](../../assets/lemoon-avatar-social-1024-v1.png). Usar el export que admita el canal y comprobar el recorte circular |
| Imagen compartida general | [OG 1200×630](../../assets/lemoon-og-default-v1.jpg), respaldo general; cada recurso puede tener imagen propia |

Favicon, Apple y avatar usan la inicial **l navy con hoja amarilla sólida**, sobre fondo cálido opaco. Conservar el archivo completo y su margen; no quitar el fondo ni convertirlo en una nueva variante del logo completo. El OG conserva el wordmark completo dentro de su composición. Son exports raster aprobados para esos usos: no acreditan trazados idénticos al SVG ni colores exactos píxel a píxel.

## Color y tipografía

La base es blanco y carbon para lectura, navy para acciones y texto de marca, beige para paneles y lemon para acentos localizados. Las equivalencias cromáticas y sus roles están en [Color de DESIGN.md](../../DESIGN.md#2-color). Mantener el fill propio del logo aunque difiera del navy de interfaz. Los colores alternativos de exploraciones no son opciones de campaña aprobadas.

Las fuentes seleccionadas para el storefront son **Urbanist** para títulos y acciones y **Hanken Grotesk** para cuerpo, labels y metadatos. Aplicar pesos, escala y excepciones por componente según [Tipografía de DESIGN.md](../../DESIGN.md#3-tipografía). Una tarjeta, un H1 legal y un título editorial mantienen sus reglas locales.

Para piezas editables fuera del sitio, conservar esa jerarquía con las familias disponibles en el destino. Si una herramienta o plantilla no admite las fuentes, registrar la limitación y resolver la adaptación en su ticket antes de declararla definitiva. Esta guía no fija una fuente sustituta ni una escala universal para redes o impresión.

## Composición, iconos y accesibilidad

- Mantener espacio generoso, jerarquía clara y una acción reconocible. En el sitio, reutilizar contenedores, radios y espaciado de la familia existente conforme a DESIGN.md.
- Conservar la familia lineal de iconos de la superficie. Consultar el [inventario de iconos](icon-library.md); no mezclar estilos ni usar sellos como prueba de prestaciones o convenios.
- Preservar legibilidad, foco visible, labels y mensajes de estado en interfaces. Aplicar las recetas accesibles de DESIGN.md incluso cuando un control antiguo tenga una deuda documentada.
- Mantener texto esencial como texto editable y, en el sitio, HTML. Revisar contraste sobre el fondo final; el color de marca por sí solo no acredita accesibilidad.
- Comprobar el punto focal y el texto en móvil y desktop; en redes, revisar también el recorte y las zonas ocupadas por la interfaz del canal. Cada pieza se valida en su destino.

## Fotografía e imágenes de producto

Producto: fondo blanco o gris muy claro, vistas frontal, lateral y perspectiva, con el armazón completo. Conservar `contain` en media de catálogo. La fotografía real de producto y su estándar final pertenecen a LEM-71.

Lifestyle: luz natural, entornos limpios, personas diversas y composición editorial. Las imágenes editoriales admiten recorte con un punto focal que funcione en cada ancho. Los diagramas muestran medidas legibles en mm, vinculadas a la pieza correspondiente.

Las escenas genéricas de [Ópticos](../../assets/lemoon-category-opticos-generic-v1.jpg), [Lentes de sol](../../assets/lemoon-category-sol-generic-v1.jpg) y [Accesorios](../../assets/lemoon-category-accesorios-generic-v1.jpg) representan solo las tres categorías principales. Son imágenes generadas, no fotografías de SKU ni evidencia de stock, materiales o productos disponibles. No usarlas en una ficha o anuncio como si representaran un producto específico.

El [inventario de assets](asset-inventory.md) define los archivos, destinos y necesidades por superficie; la [galería LEM-97](assets/lem-97/README.md) permite elegir los exports existentes. Mantener originales y derechos de uso; describir la función real de la imagen en el alt, dejando vacío el de imágenes puramente decorativas.

## Aplicación por canal

| Canal | Instrucción de uso | Alcance pendiente |
| --- | --- | --- |
| Website | Logo oficial en header; tokens, componentes y estados de DESIGN.md; producto real en catálogo y editorial pertinente en banners | Cada ticket verifica contenido, asignación y render de su página |
| Instagram, TikTok y Facebook | Avatares 400/1024 existentes, con revisión de crop circular; piezas editoriales coherentes con la base visual | Miguel administra y carga los perfiles. Covers y plantillas adicionales: LEM-78; no se acredita carga social desde esta guía |
| WhatsApp | Mantener identidad Lemoon y contenido verificado del canal real | Adaptación de avatar y piezas específicas si se requieren: LEM-78; no hay un nuevo export entregado aquí |
| Email | Reutilizar el logo oficial mediante export fiel compatible y contenido legible de la notificación | Export nativo/email: LEM-78; plantilla y render final: LEM-139. No hay cabecera de email universal entregada |
| Ads y promociones | Producto real si se anuncia un SKU; texto editable, contraste y recorte comprobados; condiciones verificadas por el ticket de campaña | Formatos, plantillas, oferta y nuevas piezas se resuelven en sus tickets; esta guía no entrega campañas |
| Documentos | Wordmark oficial, jerarquía de lectura y base visual confirmada; mantener texto seleccionable | Adaptaciones y plantillas finales requieren validación en su destino; no hay plantilla nueva en esta entrega |
| Packaging | Reutilizar la identidad oficial al preparar su brief | Desarrollo y artes de packaging quedan post-MVP según inventario; no se fijan materiales, tintas ni medidas de impresión |

### Checkout, cuentas y administración

Checkout, confirmación/estado y cuentas nuevas conservan sus superficies y opciones nativas. Reutilizar los activos compatibles mediante su editor; verificar allí logo, color y tipografía disponibles. El header Liquid y las fuentes CSS del storefront no se trasladan automáticamente a esas superficies.

El back office comparte el nombre y los activos oficiales de Lemoon, y mantiene sus propios patrones y guía del repositorio `antekera/lemoon-next-backoffice`. Las fuentes, controles y anchos del storefront no son requisitos para sus pantallas de administración.

### Prelanzamiento y configuración existente

La selección de imagen de contraseña solicitada por el usuario reutiliza [lemoon-hero-slide-2-desktop.jpg](../../assets/lemoon-hero-slide-2-desktop.jpg) mediante el selector nativo. Es una aplicación de una imagen existente, no una nueva dirección de marca ni una entrega gráfica de LEM-79. Su configuración y render se verifican en esa superficie.

El registro de LEM-97 documenta favicon 32 configurado en el tema activo `155307737256` y OG global en Preferencias, con HTML público de `/password` verificado por el coordinador el 2026-10-30. Ese registro histórico no certifica otras páginas, cachés sociales ni el favicon de desarrollo; este trabajo no cambia ajustes de Shopify.

## Voz y escritura

Usar es-CL, frases claras y directas, tono cercano, moneda CLP y CTAs que expliquen la acción. En el sitio, reutilizar claves de locales. Los mensajes finales y la guía editorial pertenecen a LEM-55; el propósito y posicionamiento pertenecen a LEM-82.

Cada ticket propietario confirma los hechos comerciales antes de publicar. Precios, garantías, beneficios, reseñas, plazos y convenios deben proceder de datos reales y condiciones verificadas; una maqueta o un asset no los convierte en promesas de marca.

## Ejemplos de aplicación

| Hacer | Evitar |
| --- | --- |
| Header con wordmark oficial; perfil social con avatar existente | Sustituir el header por el avatar o dibujar una letra amarilla sobre el SVG |
| Presentar una categoría con su escena genérica identificada | Usar esa escena como fotografía de un SKU en venta |
| Banner editorial con punto focal móvil y título HTML | Incrustar condiciones esenciales dentro de una fotografía |
| Documento con logo proporcional y lectura jerarquizada | Deformar el wordmark para llenar un espacio |
| Reutilizar la familia de componentes y su receta accesible | Copiar el defecto de contraste de un control antiguo |
| Publicar una promoción con condiciones confirmadas por su dueño | Convertir precios o garantías de muestra en una oferta |

## Decisiones pendientes y responsables

| Tema | Responsable y límite |
| --- | --- |
| Propósito, misión, posicionamiento y promesa | [LEM-82](https://linear.app/antekera/issue/LEM-82); esta guía no los inventa |
| Mensajes finales, voz y estilo editorial | [LEM-55](https://linear.app/antekera/issue/LEM-55); conservar las reglas básicas actuales mientras se resuelven |
| Fotografía real y estándar de producto | [LEM-71](https://linear.app/antekera/issue/LEM-71); las categorías genéricas no la sustituyen |
| Assets restantes y organización de entregas | [LEM-78](https://linear.app/antekera/issue/LEM-78); hero principal, exports nativos/email, covers y adaptación WhatsApp si aplica |
| Biblioteca editable y estados | [LEM-132](https://linear.app/antekera/issue/LEM-132); usar DESIGN.md y las familias vigentes mientras se entrega su revisión |
| Notificaciones | [LEM-139](https://linear.app/antekera/issue/LEM-139); integrar y comprobar el render de email |
| Consolidación de esta guía | [LEM-79](https://linear.app/antekera/issue/LEM-79); revisión humana de esta versión, sin dar por cerrado todo el alcance estratégico o de producción |

## Fuentes y versiones

- [DESIGN.md — LEM-141, PR #30](https://github.com/antekera/lemoon-shopify-theme/blob/187639e7/DESIGN.md): contrato visual aprobado del storefront. Sus referencias Figma se conservan como fuentes registradas allí; no fueron inspeccionadas nuevamente en esta consolidación.
- [Paquete LEM-97 — PR #34](https://github.com/antekera/lemoon-shopify-theme/tree/05682b51/docs/design/assets/lem-97): exports y decisiones gráficas existentes; el [inventario de esa versión](https://github.com/antekera/lemoon-shopify-theme/blob/05682b51/docs/design/asset-inventory.md) delimita pendientes y evidencia de configuración.
- [Plan de diseño](design-plan.md) e [inventario de secciones](section-inventory.md): localización y reutilización de superficies; los valores operativos permanecen en DESIGN.md.

Las exploraciones históricas de grid 1280px, radios uniformes, paletas alternativas o una segunda “o” lemon no instruyen cambios sobre el tema. Una futura decisión aprobada se incorpora primero a la fuente responsable y luego a sus aplicaciones.
