# Panel móvil de búsqueda y página Buscar mi estilo

## Estado

Diseño conversacional aprobado; revisión actualizada tras los comentarios del PR. Esta especificación cubre el panel de búsqueda móvil y la creación de una página de destino para un test de estilo futuro. El test de recomendación no forma parte de esta entrega.

## Objetivo

Al tocar la lupa del header en mobile, abrir una experiencia de búsqueda de pantalla completa que ayude a descubrir productos, resuelva accesos frecuentes y destaque tendencias. El menú hamburguesa conserva su comportamiento actual. Desktop conserva su búsqueda actual.

## Experiencia del panel

### Apertura y cierre

- El disparador es el ícono de búsqueda mobile. El botón hamburguesa no abre este panel.
- El panel ocupa todo el ancho mobile y casi todo el alto del viewport, comenzando debajo del header para dejarlo visible. Aparece mediante un fade suave, sin desplazamiento vertical.
- Un overlay oscurece el contenido desde el borde inferior del header hasta el pie; el header permanece visible por encima del overlay.
- El panel tiene `overflow-y: auto` para permitir desplazamiento interno si su contenido supera el alto disponible.
- Al abrir, se bloquea el scroll del documento y el cursor queda enfocado en el campo de búsqueda.
- El chevrón izquierdo, Escape y un toque sobre el overlay cierran el panel.
- Al cerrar, se restaura el scroll del documento y el foco vuelve al botón de búsqueda.
- La animación respeta `prefers-reduced-motion`.

### Búsqueda y productos sugeridos

- La barra superior contiene, de izquierda a derecha, el botón con chevrón para volver, el campo de búsqueda y un botón de búsqueda amarillo con el ícono de lupa.
- El campo tiene bordes redondeados, fondo gris claro y borde navy cuando recibe foco. Al abrir el panel, recibe el foco automáticamente.
- Antes de escribir, se muestran cinco productos aleatorios publicados en la colección general de la tienda. La selección se vuelve a mezclar cada vez que se abre el panel. Se muestran hasta cinco si la colección tiene menos productos publicados. Si un producto no tiene imagen, se utiliza el placeholder del tema.
- La búsqueda predictiva comienza al ingresar tres caracteres. Antes de alcanzar ese mínimo no se hacen consultas y se mantienen las sugerencias aleatorias.
- Desde tres caracteres, las sugerencias aleatorias se sustituyen por hasta cinco resultados de producto de la búsqueda predictiva de Shopify. Cada resultado muestra imagen y título y enlaza al producto. Las consultas se agrupan con un debounce corto para evitar solicitudes por cada tecla.
- El botón amarillo envía la consulta actual a la página de búsqueda estándar. Con texto, «Mostrar todos los resultados de búsqueda» ofrece la misma ruta completa. Con el campo vacío, ambos controles llevan a la página de búsqueda y muestran todos los productos en su grilla normal, con paginación.
- Si no hay coincidencias, se informa el estado vacío y se conserva la opción de ver todos los resultados de búsqueda.
- Los errores de la consulta no bloquean el panel; se conserva el término y se ofrece el envío a la página de búsqueda estándar.

## Contenido del panel

### Información

- Se muestra el título «Información» y tres enlaces con ícono a la izquierda: «Envíos y retornos», «Preguntas frecuentes» y «Buscar mi estilo».
- El destino de cada enlace se configura con un selector de página de Shopify en la sección Header del editor de temas.
- Las páginas de envíos y FAQ ya existen en Shopify. Si hace falta ajustar el destino exacto, se seleccionan las páginas existentes desde el editor.

### Tendencias

- Se muestra el título «Tendencias».
- El primer contenido es un banner con imagen y destino configurables en el editor de temas.
- Después del banner aparece un carrusel de cuatro productos seleccionables desde el editor de temas. Como selección temporal inicial se usarán Lemoon Arica (`lemoon-arica`), Lemoon Biobio (`lemoon-biobio`), Lemoon Wabi (`lemoon-wabi`) y Lemoon Colca (`lemoon-colca`); el comerciante podrá sustituirlos en Shopify.
- El carrusel presenta una tarjeta por avance. Cada tarjeta simplificada muestra la imagen y el título, y enlaza al producto.
- El cliente puede avanzar con swipe o con botones de flecha. Los puntos indican la tarjeta activa y también permiten ir a una tarjeta concreta.

## Página Buscar mi estilo

- Crear una página publicada de Shopify con título «Buscar mi estilo», handle `buscar-mi-estilo` y plantilla estándar `page`.
- La página queda como destino válido del enlace. Se crea con título y plantilla, pero sin contenido de cuerpo; el contenido de la página queda para una etapa posterior.
- El futuro test de forma del rostro y recomendación de estilos requiere una especificación aparte de preguntas, lógica y resultados.
- La página existente con plantilla `configurador-de-lentes` es un flujo distinto y no se reutiliza.

## Configuración en Shopify

La sección Header agrega los ajustes necesarios para:

- Seleccionar las tres páginas de Información.
- Elegir la imagen y URL del banner de Tendencias.
- Seleccionar los cuatro productos de Tendencias.

Los cuatro selectores de producto de Tendencias quedan inicialmente configurados con Lemoon Arica (`lemoon-arica`), Lemoon Biobio (`lemoon-biobio`), Lemoon Wabi (`lemoon-wabi`) y Lemoon Colca (`lemoon-colca`) como selección temporal, editable desde el tema de Shopify. Si falta una foto de producto, se utiliza el placeholder del tema.

Los cinco productos que aparecen al abrir son aleatorios desde los productos publicados en la colección general y no necesitan selección manual. La búsqueda predictiva usa el endpoint de Shopify existente.

## Arquitectura propuesta

- Mantener `snippets/lemoon-mobile-nav.liquid` y su comportamiento asociados a la hamburguesa.
- Crear un snippet propio para el panel de búsqueda mobile, incluido desde `sections/header.liquid`.
- Cambiar únicamente el disparador de búsqueda mobile para abrir el panel nuevo. El modal de búsqueda desktop conserva su implementación actual.
- Actualizar `sections/main-search.liquid` para que una visita a `/search` sin consulta muestre la colección general en la grilla estándar, con paginación. La búsqueda desde el panel enviará una consulta vacía cuando corresponda.
- Añadir CSS del panel en un archivo de componente y JavaScript dedicado para estado abierto, foco, bloqueo de scroll, resultados predictivos y carrusel.
- Consultar el endpoint predictivo de Shopify solicitando recursos de tipo producto y un máximo de cinco resultados; el componente del panel representa su respuesta con su propio marcado mobile y no modifica la presentación de desktop.
- Añadir a `snippets/lemoon-icon.liquid` los íconos de camión, pregunta y estilo que no estén disponibles, con el trazo consistente de la librería actual.
- Añadir las traducciones necesarias en `locales/es.json` y `locales/en.default.json`.
- Mantener la configuración del header dentro del límite de bloques y sin añadir un segundo ajuste `link_list`.

## Accesibilidad y adaptación

- Usar un diálogo modal semántico con nombre accesible, estado abierto/cerrado y foco visible.
- Mantener el uso por teclado, anunciar estados de carga, resultados y ausencia de coincidencias.
- Evitar que el foco salga del panel mientras esté abierto; devolverlo a la lupa al cerrar.
- Mantener áreas táctiles suficientes para cerrar, buscar y controlar el carrusel.
- Probar los tamaños mobile y desktop con los breakpoints existentes; el panel solo aparece en mobile.

## Criterios de aceptación

1. Tocar la lupa mobile abre el panel con un fade suave; tocar la hamburguesa conserva el menú actual.
2. El panel enfoca la búsqueda y muestra cinco productos aleatorios antes de escribir.
3. Entre uno y dos caracteres no se solicitan predicciones; al tercer carácter aparecen hasta cinco resultados predictivos de producto.
4. La búsqueda completa con texto abre los resultados estándar con la consulta escrita. La búsqueda vacía abre `/search` y muestra todos los productos con paginación.
5. El input muestra fondo gris claro, bordes redondeados y borde navy al tener foco.
6. Los tres enlaces de Información se pueden configurar desde el editor y abren las páginas seleccionadas.
7. La página Shopify «Buscar mi estilo» existe como destino independiente, con cuerpo vacío y sin test todavía.
8. El banner y los cuatro productos de Tendencias se configuran desde Shopify; el carrusel permite swipe, flechas y selección por puntos.
9. El panel queda debajo del header, cubre el ancho mobile y permite scroll interno.
10. Cerrar con el chevrón, Escape o el overlay restaura el scroll y el foco.
11. La búsqueda y el layout actuales de desktop siguen funcionando.

## Verificación prevista

- Revisar las rutas de las páginas configuradas en Shopify y que la nueva página esté publicada.
- Ejecutar la validación obligatoria de sintaxis Liquid y esquema de Shopify para todos los archivos de tema modificados.
- No se añadirán ni ejecutarán pruebas automatizadas como parte de esta entrega.

## Riesgos y límites

- Shopify Liquid limita a 50 los productos que expone una consulta normal de una colección. La selección aleatoria se hace en el navegador sobre los productos online publicados que el tema renderiza; si el catálogo supera ese conjunto, habrá que ampliar el origen del muestreo. El catálogo consultado contiene 30 productos activos.
- Shopify Admin reporta inventario cero y no devuelve imagen destacada para los 30 productos activos. Los cuatro modelos elegidos son temporales; hasta que tengan imágenes, el carrusel mostrará el placeholder del tema.
- Los selectores de página del editor requieren que la página «Buscar mi estilo» exista antes de asignarla.
- La página nueva tendrá título y plantilla desde su creación, pero su contenido y la implementación del test requieren decisiones posteriores.

## Referencias técnicas

- [Shopify: implementar búsqueda predictiva en un tema](https://shopify.dev/docs/storefronts/themes/navigation-search/search/predictive-search)
- [Shopify: búsqueda en la tienda](https://shopify.dev/docs/storefronts/themes/navigation-search/search)
- [Shopify: paginar productos de una colección](https://shopify.dev/docs/storefronts/themes/architecture/templates/collection)
