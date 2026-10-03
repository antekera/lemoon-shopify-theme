# Panel móvil de búsqueda y página Buscar mi estilo

## Estado

Diseño conversacional aprobado. Esta especificación cubre el panel de búsqueda móvil y la creación de una página de destino para un test de estilo futuro. El test de recomendación no forma parte de esta entrega.

## Objetivo

Al tocar la lupa del header en mobile, abrir una experiencia de búsqueda de pantalla completa que ayude a descubrir productos, resuelva accesos frecuentes y destaque tendencias. El menú hamburguesa conserva su comportamiento actual. Desktop conserva su búsqueda actual.

## Experiencia del panel

### Apertura y cierre

- El disparador es el ícono de búsqueda mobile. El botón hamburguesa no abre este panel.
- El panel ocupa el viewport mobile y aparece mediante un fade suave, sin desplazamiento vertical.
- Un overlay oscurece el contenido detrás del panel.
- Al abrir, se bloquea el scroll del documento y el cursor queda enfocado en el campo de búsqueda.
- El chevrón izquierdo, Escape y un toque sobre el overlay cierran el panel.
- Al cerrar, se restaura el scroll del documento y el foco vuelve al botón de búsqueda.
- La animación respeta `prefers-reduced-motion`.

### Búsqueda y productos sugeridos

- La barra superior contiene, de izquierda a derecha, el botón con chevrón para volver, el campo de búsqueda y un botón de búsqueda amarillo con el ícono de lupa.
- Antes de escribir, se muestran cinco productos aleatorios de los productos disponibles en la colección general de la tienda. La selección se vuelve a mezclar cada vez que se abre el panel. Se omiten productos sin imagen y no disponibles; si quedan menos de cinco, se muestran los que haya.
- Mientras se escribe, los productos aleatorios se sustituyen por hasta cinco resultados de producto de la búsqueda predictiva de Shopify. Cada resultado muestra imagen y título y enlaza al producto. Las consultas se agrupan con un debounce corto para evitar solicitudes por cada tecla.
- El botón amarillo envía la consulta actual a la página de búsqueda estándar. Cuando existe una consulta, «Mostrar todos los resultados de búsqueda» ofrece la misma ruta completa.
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
- Después del banner aparece un carrusel de cuatro productos seleccionables desde el editor de temas.
- El carrusel presenta una tarjeta por avance. Cada tarjeta simplificada muestra la imagen y el título, y enlaza al producto.
- El cliente puede avanzar con swipe o con botones de flecha. Los puntos indican la tarjeta activa y también permiten ir a una tarjeta concreta.

## Página Buscar mi estilo

- Crear una página publicada de Shopify con título «Buscar mi estilo», handle `buscar-mi-estilo` y plantilla estándar `page`.
- La página queda como destino válido del enlace y muestra su título. Su contenido queda editable en Shopify y sin preguntas, puntajes ni recomendaciones en esta entrega.
- El futuro test de forma del rostro y recomendación de estilos requiere una especificación aparte de preguntas, lógica y resultados.
- La página existente con plantilla `configurador-de-lentes` es un flujo distinto y no se reutiliza.

## Configuración en Shopify

La sección Header agrega los ajustes necesarios para:

- Seleccionar las tres páginas de Información.
- Elegir la imagen y URL del banner de Tendencias.
- Seleccionar los cuatro productos de Tendencias.

Los cinco productos que aparecen al abrir son aleatorios desde el catálogo disponible de la tienda y no necesitan selección manual. La búsqueda predictiva usa el endpoint de Shopify existente.

## Arquitectura propuesta

- Mantener `snippets/lemoon-mobile-nav.liquid` y su comportamiento asociados a la hamburguesa.
- Crear un snippet propio para el panel de búsqueda mobile, incluido desde `sections/header.liquid`.
- Cambiar únicamente el disparador de búsqueda mobile para abrir el panel nuevo. El modal de búsqueda desktop conserva su implementación actual.
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
3. Al escribir, aparecen hasta cinco resultados predictivos de producto y la búsqueda completa abre los resultados estándar con la consulta escrita.
4. Los tres enlaces de Información se pueden configurar desde el editor y abren las páginas seleccionadas.
5. La página Shopify «Buscar mi estilo» existe como destino independiente y no ejecuta un test todavía.
6. El banner y los cuatro productos de Tendencias se configuran desde Shopify; el carrusel permite swipe, flechas y selección por puntos.
7. Cerrar con el chevrón, Escape o el overlay restaura el scroll y el foco.
8. La búsqueda y el layout actuales de desktop siguen funcionando.

## Verificación prevista

- Validar los archivos Liquid y el esquema de la sección con el validador Shopify del skill `shopify-liquid`.
- Revisar las rutas de las páginas configuradas en Shopify y que la nueva página esté publicada.
- Ejecutar la validación obligatoria de sintaxis Liquid y esquema de Shopify para todos los archivos de tema modificados.
- No se añadirán ni ejecutarán pruebas automatizadas como parte de esta entrega.

## Riesgos y límites

- Shopify Liquid limita a 50 los productos que expone una consulta normal de una colección. La selección aleatoria se hace en el navegador sobre los productos online disponibles que el tema renderiza; si el catálogo supera ese conjunto, habrá que ampliar el origen del muestreo. El catálogo de Admin consultado durante el diseño contiene 30 productos.
- Los selectores de página del editor requieren que la página «Buscar mi estilo» exista antes de asignarla.
- La página nueva tendrá título y plantilla desde su creación, pero la implementación del test requiere una futura decisión de contenido y reglas de recomendación.

## Referencias técnicas

- [Shopify: implementar búsqueda predictiva en un tema](https://shopify.dev/docs/storefronts/themes/navigation-search/search/predictive-search)
- [Shopify: paginar productos de una colección](https://shopify.dev/docs/storefronts/themes/architecture/templates/collection)
