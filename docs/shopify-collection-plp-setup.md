# Configuración de la PLP en Shopify

## Enlaces por forma

El home y el menú de Ópticos/Sol enlazan a la colección principal con un único filtro de forma. Por ejemplo: `/collections/opticos?filter.p.m.custom.frame_shape=ojo+de+gato`.
No combinar ese parámetro con la ruta de etiqueta `/collections/opticos/ojo-de-gato`, porque ambos filtros se aplican a la vez. Los enlaces antiguos de las nueve formas se normalizan al abrir la PLP, conservando otros filtros y el orden.

La plantilla de colección lee contenido desde metafields para que cada colección tenga su propio banner opcional y texto SEO.

## Metafields de colección

Campos de colección en **Configuración → Datos personalizados → Colecciones**:

| Nombre | Namespace y clave | Tipo | Uso |
| --- | --- | --- | --- |
| Banner PLP | `custom.plp_promo_banner` | Archivo, solo imágenes | Mobile: bajo el header. Desktop: primero en la columna principal, antes del título, la descripción y el toolbar. |
| Texto SEO PLP | `custom.plp_seo_copy` | Texto enriquecido | Descripción breve al final de la grilla y paginación. |

Completa `Descripción` en cada colección para el texto corto que aparece bajo el título. Los dos metafields pueden quedar vacíos.

**Banner PLP** ya está creado y fijado en Shopify. En **Productos → Colecciones → [colección] → Metafields → Banner PLP**, selecciona o sube una imagen. Elimina el valor para ocultar el banner en esa colección. Solo se renderiza la imagen seleccionada, sin títulos, textos, botones ni imagen de respaldo del tema. Las 12 categorías actuales tienen asignada una imagen de muestra editable.

La opción **Mostrar contenido de muestra** de la grilla solo controla la introducción y el texto SEO de prueba; no controla el banner.

## Filtros

Los siete filtros solicitados ya están habilitados en **Search & Discovery → Filtros**, además de Disponibilidad. La PLP los organiza como Género, Precio, Forma, Color, Receta, Material y Talla; los filtros adicionales aparecen después.

Antes de crear nuevos campos, revisa los metafields y opciones de variante que ya tengan productos. Los filtros solo tendrán valores útiles cuando los productos de cada colección tengan esos atributos completados. El filtro de precio usa el rango nativo de Shopify.

Campos utilizados por el catálogo de prueba:

| Filtro | Fuente existente |
| --- | --- |
| Precio | Precio nativo de Shopify |
| Forma | `custom.frame_shape` |
| Color | Opción de variante `Color` |
| Material | `custom.frame_material` |
| Talla | `custom.frame_size` |
| Receta | `custom.prescription_type`, lista de texto: Monofocal, Bifocal, Progresiva, Ocupacional o Sin receta |
| Género | `custom.gender` |

Se reutilizaron los campos existentes y se creó únicamente el campo Receta, separado de las compatibilidades y tratamientos de cristal. Se completaron los atributos de las monturas de muestra y se añadió mariposa a las formas permitidas. Las monturas solares de muestra utilizan Sin receta.

Los 13 productos de muestra de navegación que tenían precio cero recibieron precios de prueba entre $14.900 y $69.900 CLP. Los demás precios se conservaron. Las 10 monturas de ese grupo también recibieron una opción Color en su variante existente. Estos valores son contenido de prueba y deben reemplazarse por datos comerciales reales antes del lanzamiento.

Shopify solo muestra valores presentes en los productos de cada colección; por eso algunas categorías tendrán menos filtros u opciones.

## Navegación y proporciones

La barra de categorías utiliza los bloques existentes del menú: Lentes ópticos, Lentes de sol, Cristales y Accesorios. Su fondo es claro y el texto azul oscuro, con subrayado para la categoría activa. Se redujeron los tamaños del título de colección, las tarjetas, la barra de anuncios y las opciones del menú lateral para mantener una jerarquía más equilibrada.

## Orden y cantidad

El selector usa **Relevancia** (`most-relevant`) cuando Shopify lo ofrece, con el orden manual como alternativa para colecciones que no lo tengan. También permite fecha de creación descendente, más vendidos y precio ascendente/descendente. Conserva un orden predeterminado distinto si la colección lo utiliza. El conteo de lentes y el botón `(N) Aplicar` se actualizan con la respuesta facetada de Shopify.

La vista móvil permite alternar entre una y dos tarjetas por fila y recuerda la preferencia en el navegador. Desktop muestra un máximo de tres columnas con filtros en el lateral; tablet adapta la grilla a dos columnas. La paginación nativa muestra 15 productos por página de forma predeterminada, editable en el editor del tema en la sección de grilla de productos (de 5 a 50, en pasos de 5), y conserva los filtros y el orden en sus enlaces.

En mobile, los filtros se despliegan como acordeones dentro del mismo drawer. Se pueden abrir varias secciones a la vez; el pie mantiene los botones de limpiar y aplicar con el conteo actualizado.

El layout de colecciones utiliza un ancho máximo de 2.200 px, con márgenes de 32 px en desktop y filtros laterales de 236 px. Desde 1.700 px, la grilla pasa a cuatro columnas; antes conserva las tres columnas del editor. Forma muestra siluetas de monturas y Color muestra muestras cromáticas (priorizando las imágenes o colores nativos cuando existen), junto a checkboxes accesibles.

El header desktop utiliza una sola fila de 72 px: logo de 112 px a la izquierda, las cuatro categorías a continuación y búsqueda/carrito/cuenta a la derecha. La búsqueda enfoca el input al abrirse. El hero de inicio tiene un máximo de 680 px en desktop y resta el alto de la barra de beneficios del espacio disponible para mantenerla visible en la primera pantalla.

## Navegación de colección

Desktop organiza la colección en una barra lateral de 264 px y una columna principal con banner, título, descripción, toolbar, filtros aplicados y productos. Ocultar/Mostrar filtros anima la barra lateral y amplía el catálogo. El breadcrumb compartido aparece sobre Filtros y en la PDP.

Los filtros aplicados se muestran como pills azules bajo el toolbar, con eliminación individual y Reset. El selector de orden usa un panel propio conectado al formulario nativo de Shopify, con soporte para teclado. Los textos secundarios usan el gris `#51575e`.
