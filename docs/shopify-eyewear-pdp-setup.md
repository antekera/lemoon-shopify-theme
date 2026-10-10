# Ficha óptica Lemoon

Referencia funcional: https://www.zeelool.com/goods-detail/ZJGT078897-02. Diseño adaptado a los tokens, tipografías y componentes de Lemoon.

## Producto cargado

- Nombre: **Lemoon Dalton · Prototipo**.
- ID: `gid://shopify/Product/15409107763368`.
- Handle: `lemoon-dalton-prototipo`.
- Plantilla: `product.optica`.
- Estado Shopify: **UNLISTED**, publicado exclusivamente en Tienda online; accesible por enlace para pruebas.
- Dos colores, cinco fotografías propias de demostración y veinte variantes.
- Precios y medidas ilustrativos, identificados como prototipo en la descripción.
- Inventario no rastreado para permitir las pruebas; definir inventario real antes de ofrecer un producto comercial.

Vista previa local: http://127.0.0.1:9292/products/lemoon-dalton-prototipo

## Jerarquía y flujo de compra

La PDP de Durand de Warby Parker se usó como referencia para reducir el peso del título y precio y separar la configuración de lentes: https://www.warbyparker.com/eyeglasses/durand/whiskey-tortoise.

El título mide 28 px en escritorio y 26 px en pantallas pequeñas; el precio, 20 px con peso 500. La vista inicial muestra color, talla y dos acciones: **Comprar solo armazón** y **Agregar lentes**. Agregar lentes abre el paso posterior dentro de la ficha, sin añadir nada al carrito. Allí aparecen los paquetes, índice, receta y resumen, con una única acción de agregar al carrito y navegación de regreso. Volver al armazón restablece la variante sin lentes y deshabilita los datos de receta para evitar enviarlos en la compra directa. Un enlace a una variante con lentes abre directamente ese paso.

## Modelo nativo de Shopify

La plantilla espera estas opciones, en este orden:

| Opción | Valores del prototipo |
| --- | --- |
| Color | Carey, Azul |
| Lentes | Solo armazón, Monofocal, Monofocal + filtro azul, Monofocal fotocromático, Progresivo, Solar sin receta |
| Índice | Estándar 1.50, Delgado 1.67 |

Solo armazón y Solar sin receta usan el índice estándar. Sus combinaciones con 1.67 no existen. Las opciones imposibles se deshabilitan y la selección solar o de armazón restablece el índice.

Los precios se leen de las variantes y se cobran mediante su ID nativo. No hay adicionales calculados solo en JavaScript. Base: $39.900; monofocal: $59.900; filtro azul: $69.900; fotocromático: $84.900; progresivo: $119.900; solar: $59.900. Índice 1.67 agrega $25.000 a los paquetes compatibles. Para editar precios, usar las variantes del producto en Shopify.

Los tratamientos se venden como paquetes de variante para respetar las tres opciones del producto y mantener el precio validado por Shopify. Nuevos paquetes requieren nuevas variantes reales.

## Metafields

Se reutilizan las definiciones existentes del namespace compartido `custom`. Las nuevas definiciones se crearon antes de escribir sus valores mediante `metafieldsSet`, y se verificaron leyendo el producto.

| Campo | Tipo / uso |
| --- | --- |
| `custom.frame_shape` | Texto: pantóstico |
| `custom.frame_material` | Texto: acetato |
| `custom.frame_size` | Texto: mediano (54-17-145) |
| `custom.frame_width` | Texto: estándar |
| `custom.gender` | Texto: unisex |
| `custom.face_shapes_compatible` | Texto: ovalado |
| `custom.prescription_type` | Lista de texto: Monofocal, Progresiva, Sin receta |
| `custom.frame_dimensions` | Nuevo JSON, medidas en mm |
| `custom.frame_weight` | Nuevo decimal, peso en g |
| `custom.try_on_url` | Nueva URL opcional, proveedor de probador virtual |

```json
{"frame_width":140,"lens_width":54,"bridge":17,"lens_height":42,"temple":145}
```

La guía de medidas abre el drawer de la ficha con tres pestañas: **Medidas**, **Características** y **Talla y rostro**. Las medidas leen el JSON por producto, muestran ancho total, ancho del cristal, puente, alto del cristal y largo de varillas, y permiten convertir milímetros a pulgadas. Características reutiliza forma, material, peso y público; Talla y rostro combina talla, ajuste y formas compatibles para dar una referencia de calce. Los productos sin un valor muestran que ese dato no está disponible.

Los productos de prueba creados con `scripts/seed-products.ts` reciben medidas ilustrativas coherentes con su talla y un peso de ejemplo. Reemplázalos por las medidas verificadas del fabricante antes de publicarlos como productos comerciales. La presentación toma como referencia la tabla de especificaciones de [ZEELOOL](https://www.zeelool.com/goods-detail/ZOX078897-01) y el resumen de características de [Ace & Tate](https://www.aceandtate.com/es/jude-medium-americano), adaptados al drawer y al diseño Lemoon.

Galería y colores usan medios y fotos de variantes de Shopify.

## Receta y carrito

La receta se puede subir como PDF o imagen, ingresar manualmente o dejar pendiente de envío. Los datos se guardan como propiedades nativas del artículo: Receta, Archivo de receta, OD/OI Esfera, Cilindro, Eje, Adición y Distancia pupilar (mm).

La subida acepta PDF, JPG y PNG hasta 10 MB. Usa el formulario nativo multipart de Shopify y redirige al carrito, donde aparece el enlace al archivo almacenado por Shopify. Los modos manual y pendiente usan Ajax. Los archivos de receta contienen datos personales: su acceso y conservación deben formar parte de la operación de la tienda.

- Esfera de ambos ojos y D.P. obligatorias en modo manual.
- Graduaciones en incrementos de 0.25; esfera -20 a +10; cilindro -6 a +6.
- Cilindro distinto de cero requiere eje entre 0 y 180.
- Progresivos requieren adición de ambos ojos, entre 0.25 y 4.
- D.P. total entre 40 y 80, incrementos de 0.5.
- En modo pendiente, solar o solo armazón, se deshabilitan los campos que no corresponden para que no se envíen datos antiguos.
- Estos límites validan el formato de entrada; la receta y el ajuste deben revisarse antes de fabricación. No se determina compatibilidad clínica automáticamente.
- En el flujo Ajax, un error de stock o conexión aparece en la ficha y permite volver a intentar. La subida de archivos usa la respuesta del formulario nativo de Shopify.
- Se usa el drawer/notificación de Dawn cuando está disponible; en el tema actual se redirige al carrito nativo.

Las pruebas reales con datos sintéticos confirmaron en el carrito la variante monofocal de $59.900, OD -1.25, OI 0 y D.P. 62, y en una segunda prueba el enlace al PDF de demostración adjuntado mediante Shopify. Se retiraron ambos artículos de prueba. No se creó ningún pedido ni se procesó un pago.

## Contenido editable y límites

En el editor del tema, la plantilla óptica permite editar los beneficios, explicaciones de paquetes, página de ayuda y agregar bloques de apps para reseñas. Los relacionados usan la colección Ópticos a través de la sección existente de Lemoon.

- Las reseñas requieren una app y datos propios; no se inventaron valoraciones. Se soportan `reviews.rating` y `reviews.rating_count`.
- Envíos y devoluciones usan las políticas reales de la tienda. No se copiaron promociones, financiación o garantías de Zeelool.
- Favoritos se guardan solamente en el dispositivo, no en la cuenta del cliente.
- El probador AR requiere un proveedor externo y su URL. El enlace se muestra solo al configurar `custom.try_on_url`; el prototipo no tiene AR conectado.
- La operación de recibir una receta pendiente y revisar las recetas adjuntas o ingresadas corresponde al equipo de la tienda.

## Verificación

- Validador Shopify: ocho archivos correctos, sin advertencias en los archivos nuevos.
- Theme Check: cero errores; advertencias previas del tema.
- Pruebas de la ficha: cuatro unitarias y seis de navegador pasan, incluyendo dos acciones iniciales, paso posterior sin mutación del carrito, regreso al armazón, precio/ID, receta incompleta, propiedades enviadas, archivo adjunto mediante formulario multipart, errores de carrito, conversión de medidas y ancho móvil.
- Suite general unitaria: 40 pasan, una falla previa en `tests/unit/product-card.test.js`: `keeps sale prices single, shows unit prices, and outlines selected dark swatches`.
- Suite general navegador antes de agregar la prueba de archivos: 54 pasan, cinco fallan en funcionalidades existentes:
  - `mobile-menu.spec.js:12`: opens below the header and closes with Escape while restoring focus and scroll.
  - `mobile-search.spec.js:326`: carousel supports arrows, dots and horizontal swipe without wrapping.
  - `product-card.spec.js:57`: loads the second photo near the viewport and toggles back to the first on the next swipe.
  - `product-card.spec.js:89`: loads the selected variant second photo on demand.
  - `product-card.spec.js:101`: does not enable image swiping in product carousels.

Los archivos de menú, búsqueda y tarjetas ya tenían cambios locales antes de este trabajo; sus fallos no se corrigieron como parte de la ficha óptica.

## Publicación

La ficha se sincroniza con el tema de desarrollo existente. La tienda remota sigue protegida por contraseña. El tema público no se ha publicado desde este trabajo. Para llevarla al tema público, revisar y subir la sección, snippets, assets, plantilla y las claves `lemoon_pdp` de los locales, conservando los demás cambios en curso.
