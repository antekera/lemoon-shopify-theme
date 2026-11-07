# LEM-135 — Propuesta de PLP compartida

Propuesta para revisión de Miguel · 06-11-2026 · base `0cada135da9534cd91b29b50cf0db9a64184e962`. Implementación propietaria: [LEM-47](https://linear.app/antekera/issue/LEM-47). Esta entrega define una plantilla reutilizable, no aprueba categorías, oferta ni publicación. [DESIGN.md](../../DESIGN.md) sigue siendo la única fuente normativa visual; este documento especifica su aplicación y marca las decisiones nuevas pendientes antes de implementar.

## Referencia editable y lectura

Abrir [index.html](plp-proposal/index.html) directamente desde el checkout, sin servidor ni instalación. [Estados](plp-proposal/states.html) reúne nueve escenarios. Capturas: [390](plp-proposal/renders/plp-390.png), [820](plp-proposal/renders/plp-820.png), [1440](plp-proposal/renders/plp-1440.png), [drawer](plp-proposal/renders/drawer-390.png), [hoja de estados](plp-proposal/renders/states-1440.png), [bloques opcionales](plp-proposal/renders/optional-1440.png). El HTML/CSS es fuente portable editable de diseño; el JavaScript demuestra estados sin peticiones comerciales. No es implementación Liquid ni prueba de Shopify.

Objetivo: comparar productos con jerarquía tranquila y navegación comprensible; reutilizar tarjetas, sidebar y controles del tema. Frente a reconstruir literalmente las exploraciones de Figma o crear una familia nueva, se propone aplicar el catálogo actual y completar sus estados. Esta elección conserva la marca y deja los productos como protagonistas. Header/footer son referencias de posición y reutilización, no nuevos diseños.

## Fuentes revisadas y precedencia

1. AGENTS.md, reglas Liquid/schema/Git/workflow; DESIGN.md; brand-guidelines, brand-guidance y brief aprobado LEM-82. El brief fija personalidad/eslogan, no precios.
2. Plan de diseño, inventarios de páginas LEM-86 y secciones, README de componentes y recetas product-card-grid, search-sort y catalogue-states. ADR-002 vigente: precio inicial solo marco, sol también; accesorios con precio propio, oferta compatible por producto.
3. `templates/collection.json`, `sections/main-collection-product-grid.liquid`, `snippets/lemoon-plp-product-page.liquid`, `facets.liquid`, `card-product.liquid`, `price.liquid`, `lemoon-active-filters.liquid`, `pagination.liquid`; `assets/lemoon-tokens.css`, `lemoon-components.css`, `lemoon-collection-plp.css`, `component-card.css`, `lemoon-product-card.js`, `lemoon-collection-plp.js` y guía `docs/shopify-collection-plp-setup.md`. Se inspeccionó fuente, no una PLP renderizada en Shopify.
4. Intake `/tmp/lem-next-design-intake.json`, generado **2026-11-06T05:14:18.597Z**, issues completos LEM-135/47/93 y comentarios incluidos; LEM-135/93 sin comentarios en ese snapshot. Identidad observada: tienda 76333711528, pzsrt4-1u.myshopify.com, lemoon.cl, CLP. Cobertura del intake: 60 productos/116 variantes/13 colecciones/14 menús/19 definiciones de producto/8 tipo_de_lente. No se refrescó catálogo completo ni configuración privada de facets. Resumen portable de ejemplos y fuentes en el paquete; el intake completo sigue siendo evidencia del coordinador.
5. **Figma consultado realmente por MCP el 06-11-2026**, archivo [9EgE1vntKfwoQIQTzBUBNg](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce). Metadata raíz `0:1` permitió localizar pantallas reales; get_design_context con screenshot abrió [Catalog Desktop 62:146](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=62-146), [Direction 02 Desktop 269:689](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=269-689) y [Direction 02 Mobile 270:657](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=270-657). No se obtuvo versión inmutable del archivo ni aprobación de estos frames; los IDs y fecha identifican la inspección. El recibo local `plp-proposal/figma-source-receipt.json`, con hash en manifest, conserva metadata de localización; no certifica una versión remota. Primer intento del índice 9:5 devolvió “nothing selected”; no se presenta como inspección satisfactoria. No hubo escrituras en Figma.

### Conciliación explícita

| Fuente / hallazgo | Resolución de esta propuesta |
| --- | --- |
| 62:146: hero navy 280px, título 52 light, franja de formas, sidebar warm 240, media 400×300 escalada, load more | Conservar intención de sidebar + grilla; aplicar familia PLP vigente, heading local 30/28, banner opcional y paginación nativa. No introducir hero ni filtro duplicado. |
| Direction 02: banner en columna principal desktop y encima del catálogo móvil, dos columnas móvil | Reutilizar esa organización ya presente en base. No asumir aprobación de sus claims, precios, reseñas, CTA probar ni familia de tarjeta. |
| Figma muestra Source Sans, valores alternativos, wishlist, promociones, rating y probador | No adoptar: Hanken/Urbanist y datos reales del consumidor prevalecen; ninguno de esos adornos aparece en propuesta comercial. |
| Guía setup menciona 2200px, sidebar236, cuatro columnas >1700 | Antecedente divergente: DESIGN y cascada final usan página2000, sidebar264 y tres columnas configuradas. No copiar instrucciones antiguas. |
| Template15 desktop +16 móvil; fuente incluye segundo paginate en template y JS `lemoonSelectProductPage` por matchMedia749 | Hay mecanismo de intercambio en fuente; no se ha validado su paginación/URL/refresh en Shopify. Propuesta nueva: **15 por página en todos los anchos**, una URL estable y última fila móvil impar aceptada. Requiere aprobación y posterior cambio por LEM-47. |
| `available_products` filtra cada página después de paginate | Puede mostrar menos tarjetas que el conteo y confundir agotados con vacío. El diseño distingue disponibilidad y vacío; LEM-47/70 debe conciliar contador, listabilidad y paginación antes de aceptar implementación. |
| Error facetado / carga | Estados propuestos de recuperación; no afirmar que el controlador actual ya los implementa. |

## Anatomía de arriba hacia abajo

| Bloque / dueño existente | Uso y contrato de contenido |
| --- | --- |
| Header/footer / grupos existentes | Reutilizar íntegros; la maqueta solo reserva posición, wordmark oficial y alturas nominales72/56. No reescribir menús, anuncios, beneficios ni footer. |
| Breadcrumb / `lemoon-breadcrumb` | Nav con nombre accesible. Inicio enlaza `/`; categoría actual texto `aria-current=page`. Desktop sobre Filtros; móvil sobre H1. Una ruta lógica accesible; ocultar duplicado con display:none según ancho. Para categorías hijas usar padre confirmado por LEM-47, no deducir rutas anidadas. |
| Banner / metafield colección | Imagen opcional, desktop primera en columna principal; móvil bajo header y antes del breadcrumb/heading. Ausencia/fallo: omitir bloque sin placeholder comercial. En el artefacto `?banner=1` es únicamente anatomía editorial identificada. |
| Introducción / colección | Un H1 `collection.title`, descripción richtext editable solo cuando exista y esté habilitada. Sin eyebrow/eslogan ni texto demo automático. No duplicar H1 de main-collection-banner. |
| Toolbar | Mostrar/ocultar filtros ≥750; conteo de resultados; orden; móvil filtros + cambio1/2 columnas. Conteo móvil puede ocupar otra línea. Omitir control filtros cuando results.filters esté vacío; grid ocupa ancho disponible. |
| Filtros aplicados | Bajo toolbar, chips navy con nombre de grupo/valor y quitar; limpiar selección secundaria. Envuelven, sin scroll horizontal obligatorio. |
| Catálogo | Lista semántica de tarjetas; no carrusel ni scroll horizontal. Densidad configurada3 desktop/2 tablet/2 móvil, móvil1 como preferencia explícita existente. |
| Paginación | Números, actual, anterior/siguiente y rango real. No load more. Desaparece si ≤1 página o vacío. |
| Texto posterior | SEO richtext solo si dato aprobado existe. Sin dato no renderizar título/separador/espacio. No inventar `custom.plp_seo_copy`. |

## Medidas y estilo reutilizado

Todos los colores se leen de `lemoon-tokens.css`, enlazado desde el artefacto. No se agrega sistema de tokens. Blanco `surface-page`; warm `surface-warm #F7F4EE`; navy `text-brand/action-primary #0B1F3A`; carbon `text-primary #1A1A1A`; ayudas `text-secondary #51575E`; borde de campos `border-input #6685AD`; error `status-error #C0392B`; lemon `action-accent #F7E600` limitado al actual de paginación. Botón primary navy/blanco; hover token primary-hover. No verde decorativo ni tercera familia.

| Familia | ≥990 | 750–989 | <750 |
| --- | --- | --- | --- |
| Página | máximo2000, gutters24 hasta1279 y42 desde1280 | gutters24 | introducción16, grid12 por excepción PLP |
| Sidebar + gap | 264 +28px | 220 +24px | oculto; drawer máximo320px |
| Grilla |3 columnas; gap22×30px|2 columnas; gap20×32px|2 columnas; gap12×24px|
| H1 |Urbanist600,30/36px, tracking−.025em|igual|28/33.6px|
| Descripción |Hanken400,14/21.7px|igual|igual|
| Título de tarjeta |Hanken400,15/21px|14/19.6px|13/18.2px|
| Precio tarjeta |Urbanist600,17/22.1px|igual|16/20.8px|
| Media |warm,radio12,100:96, cap280px|100:96 sin cap|100:96 sin cap|
| Exterior tarjeta |transparente, borde0, radio0|igual|igual|

La regla final PLP de título usa line-height1.4 y prevalece sobre16px base de card; precio1.3 prevalece sobre22px base. No usar H3 global ni tamaño home18. La semántica H3 de tarjetas no determina su tamaño. Información8px desde media; gap4.5px entre filas. Fuente preferente del producto puede ser1:1; el contenedor sigue100:96 y la imagen `object-fit:contain`. Mantener armazón completo, sin zoom/crop. Si el cap280 limita la altura desktop, conservar contain dentro del área resultante.

La primera referencia mide el contrato local, no un frame fijo. 320px conserva2 columnas; textos/precios envuelven y swatches saltan de línea. 750 activa sidebar220 y2 columnas;990 activa sidebar264 y3. Verificar749/750 y989/990. 1280 solo cambia gutter. En820 el toolbar se distribuye en dos filas para que el selector no invada conteo/filtros (adaptación propuesta de accesibilidad, no evidencia de comportamiento actual). Ocultar filtros retira sidebar del árbol accesible, expande grilla sin modificar consultas y mantiene foco en disparador. En pantalla baja sidebar debe poder desplazarse con foco visible; no atrapar el scroll de la página fuera del panel.

## Filtros y teclado

Contrato dinámico: recibir exclusivamente `results.filters`, orden preferido Género/Precio/Forma/Color/Receta/Material/Talla seguido de extras devueltos; omitir grupos ausentes. La maqueta enumera valores observados para revisar anatomía y usa “—” en conteos, no un payload real. Nombre visible del filtro no acredita compatibilidad médica ni presencia storefront.

| Control / estado | Interacción requerida en implementación |
| --- | --- |
| Accordion | details/summary nativo, Enter/Espacio abre/cierra; varios abiertos. Estado expandido perceptible; opciones con etiquetas reales. Conservar grupos abiertos tras refresh. |
| Checkbox | etiqueta clicable, check visible además de color, Tab/Espacio; nombre, valor y contador de facets. Deshabilitar opción con0 solo si no está activa; activa siempre removible. Ningún conteo derivado de miembros Admin. |
| Precio | rango nativo Shopify, dos inputs numéricos Desde/Hasta CLP y ajuste con slider accesible; ambos extremos se pueden editar por teclado, labels persistentes, min≤max y límites reales. Error junto al campo, aria-invalid/description; no enviar rango inválido. El artefacto demuestra máximo, el mínimo se edita numéricamente; implementación puede reutilizar dos handles canónicos sin solapamiento de foco. |
| Desktop | Selección actualiza petición tras interacción; mantener controles operables y respuesta anunciada. Enter envía formulario sin JS. Cambiar filtro restablece page, conserva sort. |
| Drawer | <750 panel máximo320px a derecha, overlay navy38%; a320 ocupa ancho. Encabezado y pie fijos dentro del panel, cuerpo scroll, safe-area inferior. Abrir enfoca Cerrar, diálogo modal nombrado, fondo inert, trampa Tab/ShiftTab. Escape/Cerrar devuelven foco a Filtros y restauran scroll. |
| Seleccionar/aplicar móvil | Selección visual inmediata y conteo actualizado solo desde respuesta; “(N) Aplicar” usa N resultados, no cantidad de checks. El artefacto usa “seleccionados” para no fingir ese conteo. Aplicar cierra y conserva selección; cerrar también conserva cambios como facets nativo, no promete rollback. |
| Quitar / limpiar | Quitar elimina un valor; limpiar elimina filtros de la colección, conserva orden y ruta. Target44px aunque pill visual sea compacto. Tras quitar foco va al siguiente chip o disparador si no quedan; anunciar conteo una sola vez. |
| Carga | aria-busy en zona resultados, estado “Actualizando productos”; conservar filtros, foco y catálogo previo, bloquear envíos duplicados y evitar respuestas antiguas. Inicial sin productos: placeholder de área, no productos inventados. |
| Error | mensaje persistente + Reintentar, conservar selección y últimos resultados válidos; error inicial puede ocupar la grilla. Reintentar misma consulta, sin reset silencioso. Live region de error única; no alert y status simultáneos. |

Animación: reutilizar duración de drawer local320ms y overlay280ms, hover150ms, media250ms. `prefers-reduced-motion` elimina desplazamientos/transiciones no esenciales, nunca espera animación para foco o uso. Artefacto sin animación esencial. No atribuir a este mockup una prueba de todos los controladores existentes.

## Orden, tarjeta y paginación

Orden: opciones **solo de `collection.sort_options`**. Reutilizar política preferred/current del dueño; no ofrecer most-relevant si no existe y no renombrar manual como relevancia verdadera. Etiqueta persistente; native select con teclado y fallback sin JS. La muestra usa orden de colección/precio como escenarios, no asegura esas opciones live. Si se mantiene menú mejorado: Escape cierra y restaura foco, flechas/Home/End navegan, Enter/Espacio selecciona; una sola selección accesible sincronizada con native select. Cambio de orden conserva filtros y vuelve a página1.

Tarjeta: reutilizar `card-product`, precio/labels/swatches y dependencias con contexto collection. H3 enlaza ficha exacta, media y nombre sin rutas inventadas; ausencia de imagen conserva nombre, precio y acceso. Alt describe producto/ángulo, no keywords. Secundaria se revela al hover/foco solo si cargó; pendiente/error/ausente conserva frontal. En touch no depender de hover; respetar swipe existente si se conserva y no bloquear desplazamiento. No duplicar información esencial solo en hover.

Swatches reales: nombre de color, selección por variante y foco, área44px con disco visual20px (propuesta accesible); no inferir RGB del nombre. Color textual funciona sin muestra nativa. Al cambiar deben sincronizar variante, media, precio, disponibilidad y URL, sin mezclar datos de otra variante. Muestras del artefacto solo cambian el estado visual: no tienen mapa media/variante y no hacen esa promesa. Lista extensa envuelve, no oculta opciones sin acción explícita. Precio completo CLP desde Shopify; “Desde” solo si rango real y consumidor lo requiere. Marcos: precio inicial solo marco, nunca cristales incluidos; accesorios sin nota solo marco. Sin ratings, falsa oferta, SKU inventado, flash-sale o novedad derivados del nombre de colección.

Producto unavailable: estado diseñado “Agotado”, acceso a detalles, sin CTA de compra; ficha puede mantener información real. La muestra de estados es anatomía sintética. El consumidor actual filtra unavailable antes de renderizar: si se conserva esa política, no mostrar tarjetas agotadas ni confundir colección con agotados con ausencia absoluta. LEM-47/70 debe decidir/conciliar listabilidad y conteos. No activar quick-add ni configurador nuevo desde esta propuesta; acciones comerciales conservan ADR-002 y dueños46/23/52.

Paginación propuesta:15 por página,3×5 desktop y2×7+1 móvil; no rellenar con producto repetido. Conteo “a–b de N” usa respuesta real y elegibles según política acordada, no15×page si se ocultaron productos. Página actual `aria-current=page`, no enlace; anterior en primera y siguiente en última omitidos o disabled semántico; ellipsis texto no accionable. Targets44px: excepción accesible propuesta sobre34/38px existentes. Una sola página elimina navegación y conserva conteo. Enlaces preservan colección, filtros repetidos y `sort_by`; solo page cambia. Al aplicar filtro/orden/quitar/limpiar, borrar page. Back/Forward restaura consulta/controles y resultados; actualizar título/anuncio sin mover foco arbitrariamente. Carga completa sin JS sigue teniendo enlaces.

Ejemplo de enlace de implementación: `/collections/opticos?filter.p.m.custom.frame_shape=cuadrado&sort_by=price-ascending&page=2`; quitar forma conserva sort y elimina page. Usar encoding de valores reales; no combinar filtro de forma con `/opticos/ojo-de-gato` legacy. Enlaces de paginación del artefacto son escenarios locales de diseño, no navegación funcional de30 productos.

## Estados de contenido y editorial

| Estado | Presentación completa |
| --- | --- |
| Poblado | Referencias principales con15 muestras internas; el pie declara escenario sintético de30, sin atribuirlo a Shopify. |
| Colección vacía | Mantener breadcrumb/H1; mensaje “Esta colección aún no tiene productos”, enlace catálogo `/collections/all`; sin paginación. Ocultar filtros sin valores. Para pantallas con0 Admin es inspiración de escenario, no certificación de0 públicos. |
| Filtros sin resultados | Mantener filtros/chips/orden, mensaje específico y Limpiar filtros; no sustituir por error. Sin paginación. |
| Loading/error | Inicial reserva área; actualización conserva resultados previos. Hoja y URLs muestran el primer caso, implementación verifica ambos. |
| Sin banner / descripción / SEO | Omitir bloque completo y margen; referencias principales muestran este caso. `?banner=1&text=1` muestra anatomía de optativos sin una campaña. |
| Media faltante | Warm con mensaje neutro, sin foto genérica asociada a SKU. Layout estable. Con frontal y sin secundaria no cambiar imagen al hover. |
| Nombre/precio/opciones largos | Texto íntegro en varias líneas, precio no cortado, swatches envuelven; stress sintético rotulado en hoja. |
| Sin filtros o solo un producto | Sin rail ni disparador innecesarios, mismo grid con celdas libres; sin duplicar productos para llenar fila. |

Texto editorial: usar richtext limpio, párrafos legibles y enlaces descriptivos; H2 después de H1, nunca headings decorativos vacíos. No crear copy por categoría aquí. Banner sin texto esencial incrustado; imagen decorativa alt vacío, imagen informativa alt específico aprobado. Crop `cover` y punto focal individual: desktop clamp160/12vw/220, tablet clamp160/20vw/190, móvil max170 con fuente/punto focal móvil cuando exista. Si el recorte elimina información necesaria, omitir hasta tener versión adecuada. Fotografías reales pertenecen a LEM-71/70/78; no usar escenas genéricas como SKU. No se generaron fotos de producto.

## Datos LEM-93 frente a lo observado

| Campo | Observado / regla segura de consumo |
| --- | --- |
| frame_shape/material/size/width/gender | single_line_text_field. Respetar valores reales: mariposa, TR-90, madera, estrecho/estándar/ancho y niños incluidos. No normalizar silenciosamente. |
| frame_size | Cadena compuesta como mediano (54-17-145); mostrar literal cuando corresponda, no extraer garantías de mm. Medidas físicas tienen contrato separado. |
| face_shapes_compatible | single_line_text_field, difiere de lista propuesta93. No dividir/coercionar ni migrar por diseño. |
| prescription_type | Lista de Monofocal/Bifocal/Progresiva/Ocupacional/Sin receta. Puede alimentar filtro devuelto, no booleano “admite receta”. |
| lens_compatible | list.metaobject_reference, no booleano. Ocho tipo_de_lente solo nombres; no precios ni variantIds cobrables. Nunca comunicar Sí/no por truthiness ni asegurar compatibilidad médica. |
| lens_type_options | No encontrado en19 definiciones/60 productos consultados. No usar el esquema propuesto como dato existente ni inventar oferta. |
| Color | Opción de variante cuando existe; mapa comercial/media debe obtenerse por variante. |
| plp_promo_banner | Valor observado en12 colecciones, frontpage ausente; muestra editable no aprobación editorial. |
| plp_seo_copy | Sin definición/valor en alcance consultado; omitir bloque hasta definición/contenido autorizado por47. |

No se verificó Search & Discovery privado ni payload `results.filters` actual. La guía setup es antecedente y no prueba de filtros disponibles en cada colección. Datos/validación/migración pertenecen a93; carga y fotografía a70/71; oferta/cargos a52/23. La contradicción semántica del ADR booleano frente a lista real queda explícita y no se resuelve en este diseño.

Rutas se reutilizan desde47, sin nuevo inventario: `/collections/all` es destino nativo especial; `/collections/opticos`, `opticos-hombre`, `opticos-mujer`, `opticos-unisex`, `opticos-ninos`, `lentes-de-sol`, `mejor-vendidos`, `lo-nuevo`, `de-lectura`, `para-pantallas`, `accesorios`. Los once handles explícitos existen en snapshot, pero pertenencia Admin no prueba publicación ni selección comercial. `cristales` y `frontpage` son históricos, no ampliaciones aprobadas. Header guardado y bloques efectivos son superficies distintas. LEM-47 conserva propósito, contenido, indexación y aprobación por categoría.

## Accesibilidad y aceptación

Contraste mínimo4.5:1 texto normal,3:1 componentes y texto grande; no color como señal única. Labels persistentes, focus visible2px navy sin recorte; campos con borde-input1px y foco continuo navy2px sin segundo anillo. Acciones44px mínimo propuestas, precio/nombres completos. HTML seleccionable con H1 único, tarjetas H3 dentro de sección nombrada; no forzar H2 si no hay título de bloque real. Zoom200% y320px deben reflow sin scroll horizontal. Controles móviles fuera de pantalla no enfocables. Header sticky no debe ocultar foco ni chips. Declaración de conformidad WCAG requiere auditoría sobre implementación, no este documento.

| Aceptación135 | Entrega verificable | Gate posterior |
| --- | --- | --- |
| Base existente |Fuentes,3 pantallas Figma realmente abiertas y tabla de diferencias|Revisión humana de conciliación|
| Heading/breadcrumb |Anatomía, medidas, HTML y renders3 anchos|Jerarquía y rutas reales de47|
| Desktop/mobile filtros |Sidebar220/264, drawer, selección, precio, clear, foco y estados|Facet payload, historial, red y conteo en Shopify|
| Orden |Opciones dinámicas y contrato teclado/enlaces|Opciones reales por colección|
| Tarjeta |Contrato15/14/13 y17/16, media100:96/cap280; variantes y ausencias|Medios por variante, disponibilidad y oferta reales|
| Paginación |15 uniforme propuesto, controles y preservación de query|Aprobación política, QA última página/resize/filter/Back|
| Vacío/sin coincidencias |Hoja9 estados y referencias completas empty/zero/loading/error|Distinguir elegibles/publicados/agotados|
| Categorías47/atributos93 |Rutas enlazadas al dueño y contradicciones registradas|No aprobación de categorías ni migración implícita|
| Referencia editable |HTML/CSS/JS local, fonts/licencias, renders, manifest/evidencia|Revisión independiente por raíz|
| Aprobación Miguel |Paquete íntegro para revisar; sin aprobación registrada|Raíz registra aprobación de revisión exacta antes de adoptar/merge/cerrar|

## Decisiones nuevas propuestas a Miguel

- Conservar composición actual en lugar de adoptar hero/familia alternativa de Figma; no introducir nueva dirección de marca.
- Unificar15 productos por página en todos los anchos para conservar interpretación estable de URL; aceptar última fila móvil impar.
- Elevar targets de paginación/chips/swatch a44px sin cambiar proporción de media ni tipografía de tarjeta; toolbar tablet envuelve para evitar colisiones.
- Adoptar estados específicos de vacío/zero/error y reintento con selección conservada. La visibilidad de agotados/conteo requiere decisión conjunta47/70 y evidencia real antes de implementación.

El documento está completo como propuesta revisable. Pendientes de adopción: aprobación de Miguel y revisión independiente proporcionada por raíz; contenido/medios por categoría y variante, política de agotados/conteo y atributos93 por sus dueños. Implementación47, QA storefront/HTTP/accesibilidad, publicación y aceptación categoría por categoría mantienen gates separados. No se modificó DESIGN, inventarios ni código del tema, y no se adoptó PR66/LEM-133.
