# Panel móvil de búsqueda — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar el panel de búsqueda mobile aprobado, sus ajustes configurables en Shopify, una grilla de búsqueda vacía con todos los productos y la página publicada «Buscar mi estilo».

**Architecture:** El header conservará el botón y flujo actuales de hamburguesa y búsqueda desktop. Un snippet, una hoja CSS y un archivo JS propios implementarán el panel mobile: sugerencias iniciales aleatorias, búsqueda predictiva, enlaces de información y carrusel de tendencias. `main-search.liquid` añadirá una rama paginada para consultas vacías y Shopify Admin recibirá la nueva página sin cuerpo.

**Tech Stack:** Shopify Liquid, JSON de secciones Shopify, CSS, JavaScript del tema, Shopify Predictive Search, Shopify Admin GraphQL.

**Spec:** `docs/superpowers/specs/2026-10-03-mobile-search-panel-design.md`

## Global Constraints

- Mantener intacto el comportamiento de `snippets/lemoon-mobile-nav.liquid` y del modal de búsqueda desktop.
- El panel se abre solamente desde la lupa mobile; la hamburguesa conserva su flujo actual.
- Mantener un único ajuste `link_list` en `sections/header.liquid` y el límite actual de bloques.
- Usar ajustes existentes de tema para las tres páginas, el banner y los cuatro productos; no codificar destinos de contenido en el markup.
- No implementar el test de estilo ni el contenido de «Buscar mi estilo» en esta entrega.
- Las sugerencias iniciales se limitan a productos publicados expuestos por `collections.all`; al abrir, JavaScript mezcla la lista y muestra hasta cinco.
- Las predicciones comienzan con tres caracteres y muestran hasta cinco productos. Con cero, uno o dos caracteres se conservan las sugerencias iniciales.
- Una búsqueda vacía debe llevar a `/search` y mostrar productos de `collections.all` con paginación.
- No añadir ni ejecutar pruebas automatizadas. Antes de cerrar, ejecutar el validador Liquid/tema requerido por la skill Shopify.
- La plantilla estándar de la nueva página Shopify tendrá el título «Buscar mi estilo», handle `buscar-mi-estilo`, estado publicado y cuerpo vacío.

## Review Focus

- El disparador mobile debe ser exclusivamente la lupa, sin sustituir ni interceptar la hamburguesa o el modal desktop. Revisar en tareas 1 y 2.
- El overlay y el panel deben comenzar bajo el header visible, dejarlo por encima, bloquear/restaurar el scroll y no exceder el viewport. Revisar en tarea 2.
- Las respuestas predictivas antiguas no deben reemplazar resultados de un término más nuevo ni actualizar el panel cerrado; respetar el umbral de tres caracteres. Revisar en tarea 3.
- `/search` sin término debe renderizar todos los productos mediante la grilla de tarjetas normal y paginación, mientras las consultas escritas conservan el comportamiento actual. Revisar en tarea 4.
- El schema debe seguir siendo válido, conservar el único `link_list`, y cada ajuste de página/producto debe aceptar una selección vacía; revisar en tareas 1, 5 y 6.

---

## File Map

- `sections/header.liquid` — añadir disparador de búsqueda mobile, incluir el panel, cargar CSS/JS y declarar ajustes de contenido sin un `link_list` adicional.
- `sections/header-group.json` — asignar páginas y valores iniciales de los productos de tendencias.
- `snippets/lemoon-mobile-search.liquid` — diálogo, barra de búsqueda, sugerencias, estados vacíos/errores, información y tendencias.
- `assets/lemoon-mobile-search.css` — layout mobile, overlay, foco, estados, accesibilidad de movimiento y tarjetas.
- `assets/lemoon-mobile-search.js` — apertura/cierre/foco, mezcla de sugerencias, búsqueda predictiva y carrusel.
- `sections/main-search.liquid` — rama de consulta vacía con la grilla habitual de producto y paginación.
- `snippets/lemoon-icon.liquid` — añadir iconos consistentes de envíos, ayuda y estilo si aún no existen.
- `locales/es.json`, `locales/en.default.json` — textos accesibles y estados de la nueva interfaz.
- Shopify Admin — crear/publicar la página vacía «Buscar mi estilo» si no existe ya con ese handle.

## Tasks

### Task 1: Configuración Shopify y recursos compartidos

**Files:** `sections/header.liquid`, `sections/header-group.json`, `snippets/lemoon-icon.liquid`, `locales/es.json`, `locales/en.default.json`

- [ ] Revisar el schema y la configuración actual antes de editar; conservar el ajuste `link_list` existente y el límite de bloques.
- [ ] Añadir ajustes de página para Envíos y retornos, Preguntas frecuentes y Buscar mi estilo; ajustes de imagen/URL de banner y cuatro selectores de producto para Tendencias.
- [ ] Añadir a `header-group.json` los valores temporales de los cuatro productos por handle: `lemoon-arica`, `lemoon-biobio`, `lemoon-wabi` y `lemoon-colca`. Dejar destinos de página sin asignar hasta que se confirme el handle exacto de la página nueva.
- [ ] Añadir los tres iconos solicitados reutilizando el trazo y el sistema actual de `lemoon-icon`; no duplicar iconos ya disponibles.
- [ ] Añadir las claves de traducción para etiqueta/modal, búsqueda, estados de carga/sin resultados/error, información y tendencias en español e inglés.
- [ ] Revisar que el JSON del schema, las locales y `header-group.json` sean válidos; confirmar que sigue existiendo una sola opción `link_list`.

**Commit:** `feat: add mobile search theme settings`

### Task 2: Estructura y presentación del panel mobile

**Files:** `sections/header.liquid`, `snippets/lemoon-mobile-search.liquid`, `assets/lemoon-mobile-search.css`

- [ ] Cambiar solo el render del disparador mobile de búsqueda por un botón accesible con `data-lemoon-search-open`; mantener la búsqueda desktop existente y el render de la hamburguesa.
- [ ] Incluir el nuevo snippet del panel fuera del drawer de navegación actual.
- [ ] Crear un diálogo modal con chevrón de cierre, formulario, campo gris claro redondeado con borde navy en foco y botón amarillo con lupa.
- [ ] Renderizar una lista inicial de hasta 50 productos publicados disponibles en `collections.all` como datos seguros para el componente; cada producto incluye id, URL, título e imagen o placeholder.
- [ ] Renderizar las secciones «Información» y «Tendencias» usando los ajustes Shopify. Los enlaces de información llevan icono; el banner y cada tarjeta llevan a su destino configurado.
- [ ] Crear tarjetas compactas de tendencia, controles anterior/siguiente y puntos accesibles; mostrar una tarjeta a la vez.
- [ ] Aplicar el overlay desde el borde inferior del header visible. Medir la geometría real del header mobile al abrir y al cambiar viewport para que panel y overlay ocupen el alto disponible debajo de este.
- [ ] Añadir scroll vertical interno, `aria` semántica, estados de foco y transición de fade; desactivar transición con `prefers-reduced-motion`.
- [ ] Revisar visualmente el ancho mobile, el header fijo visible, contenido largo con scroll y el corte al breakpoint desktop.

**Commit:** `feat: add mobile search panel markup and styles`

### Task 3: Interacción, predictivo y carrusel

**Files:** `assets/lemoon-mobile-search.js`, `snippets/lemoon-mobile-search.liquid`

- [ ] Al abrir desde la lupa, activar el diálogo, medir el header, bloquear scroll del documento y enfocar el campo tras el fade inicial.
- [ ] Mezclar la lista inicial en cada apertura y mostrar hasta cinco tarjetas; al tener entre uno y dos caracteres, conservar esa lista sin consultar el endpoint.
- [ ] Desde tres caracteres, esperar un debounce corto y solicitar a Shopify hasta cinco recursos `product`; representar imagen/título/enlace en el markup mobile propio.
- [ ] Cancelar o invalidar solicitudes anteriores y evitar que una respuesta tardía cambie una consulta más nueva o un panel ya cerrado.
- [ ] Anunciar carga, resultados y estado sin coincidencias; en caso de fallo conservar el término y dejar disponible el envío al resultado completo.
- [ ] Hacer que el botón amarillo y «Mostrar todos los resultados de búsqueda» envíen el término actual a `/search`; con campo vacío, enviar `/search` sin parámetro de consulta.
- [ ] Implementar swipe, flechas y puntos del carrusel manteniendo el índice activo actualizado; desactivar cada flecha al llegar al extremo correspondiente.
- [ ] Cerrar mediante chevrón, Escape y toque fuera; restaurar scroll y devolver el foco a la lupa. Ignorar Escape cuando el panel ya esté cerrado.
- [ ] Revisar teclado, foco visible, toque, resize y preferencia de movimiento reducido.

**Commit:** `feat: add mobile search interactions`

### Task 4: Página de búsqueda sin término

**Files:** `sections/main-search.liquid`

- [ ] Revisar el markup y clases existentes de título, grid, `card-product` y paginación.
- [ ] Añadir una condición para que un término vacío use `collections.all.products`, muestre el título y la grilla habitual de productos y permita paginación.
- [ ] Mantener sin cambios funcionales el resultado tipado con término: productos, artículos y páginas continúan con el render actual.
- [ ] Conservar los estados de búsqueda existentes, y asegurar que el formulario del panel vacío produzca la ruta `/search`.
- [ ] Revisar en el código los casos de catálogo vacío y de última página de paginación sin depender de `object_type` para productos provenientes de una colección.

**Commit:** `feat: show all products for empty search`

### Task 5: Destino Shopify «Buscar mi estilo»

**External resource:** Shopify Admin Page; `sections/header-group.json` y editor de tema.

- [ ] Consultar páginas existentes y crear solo si no existe ya una página con handle `buscar-mi-estilo`.
- [ ] Crear la página con título «Buscar mi estilo», estado publicado, cuerpo vacío y plantilla estándar `page`.
- [ ] Releer el recurso creado y confirmar handle, estado, título y cuerpo; conservar el contenido vacío.
- [ ] Asignar esta página al ajuste correspondiente del header. Seleccionar las páginas existentes de envíos y FAQ solo después de comprobar sus handles actuales en Admin.
- [ ] Confirmar que los cuatro productos temporales existen y guardarlos en los selectores de tendencias; si Shopify no permite un handle de producto como valor inicial de schema, elegirlos desde el editor de tema y persistir su GID en la configuración.

**Commit:** `chore: configure mobile search destinations`

### Task 6: Revisión final y entrega

**Files:** todos los archivos de tema indicados arriba.

- [ ] Ejecutar la validación obligatoria Shopify Liquid/esquema para todos los archivos de tema modificados y corregir diagnósticos.
- [ ] Revisar el diff completo contra la especificación y cubrir cada punto de Review Focus leyendo el markup, estilos, JS y configuración resultantes.
- [ ] Confirmar que no se agregaron ni ejecutaron pruebas automatizadas.
- [ ] Revisar `git diff --check`, estado del árbol y commits resultantes.
- [ ] Actualizar el PR draft existente #9 con los commits y resumen de los cambios; no crear un PR duplicado.

**Commit final:** `feat: implement mobile search discovery panel`

## Implementation Notes

- Seguir el resultado de las herramientas y documentación oficial Shopify sobre búsqueda predictiva y el schema del tema al implementar; no asumir que el marcado del snippet predictivo de desktop sirve directamente para el panel.
- La API Admin debe confirmar primero que no existe una página con el handle deseado y, al crearla, comprobar el resultado devuelto antes de configurar el selector de página.
- Actualmente Shopify reporta inventario cero y no entrega imagen destacada para los 30 productos activos consultados. Mantener placeholders en la UI cuando no haya imagen; los cuatro productos iniciales son una selección temporal revisable por el comerciante.
- El muestreo inicial está limitado a los primeros productos publicados que `collections.all` expone en Liquid; una tienda con más productos que el límite Liquid podría requerir ampliar el origen.
