# LEM-134 · Propuesta de PDP para revisión humana

**Estado: propuesta completa de diseño, pendiente de revisión independiente y aprobación de Miguel.** Autoría sobre `origin/main` `0cada135da9534cd91b29b50cf0db9a64184e962`, rama `chore/lem-134-pdp-design`, 06-11-2026. Este documento es la especificación local de LEM-134; [DESIGN.md](../../DESIGN.md) sigue siendo el único contrato visual canónico. Ninguna decisión nueva de este documento modifica ese contrato antes de su aprobación. No se publica ni implementa el storefront.

Abrir [propuesta editable](pdp-proposal/index.html), [desktop](pdp-proposal/renders/main-1440.png), [tablet](pdp-proposal/renders/main-820.png), [móvil](pdp-proposal/renders/main-390.png) y [guía de revisión](pdp-proposal/README.md). HTML/CSS/JS son fuente local de presentación; todos los controles demuestran estados sin operaciones comerciales. Las anotaciones visibles pertenecen al artefacto de revisión y se excluyen de producción.

## 1. Propósito, fuentes y precedencia

Facilitar evaluar el modelo y la variante elegida: ver el producto completo, comparar atributos, entender el importe y continuar con una acción coherente con el catálogo. Mantener el contorno editorial limpio de Lemoon, sin otra dirección de marca, quiz, popularidad, probador ni guía de Home.

Fuentes realmente abiertas en esta autoría; sus hashes y tamaños están en [manifest](pdp-proposal/manifest.json):

- Base `0cada135`: AGENTS y reglas Liquid/schema/Git/workflow; DESIGN; brand-guidelines, brand-guidance y brief aprobado LEM-82; planes design-plan/remaining-pages-plan (LEM-86), section-inventory y component-inventory; componentes README/receta product-card-grid; ADR-002 actual aprobado en LEM-31. El contrato aprobado se verifica aquí en el ADR del checkout, no por volver a asumir el resumen histórico frame-only.
- Implementación: templates `product.json` y `product.optica.json`; `main-product` y `lemoon-eyewear-product`; CSS `lemoon-eyewear-product`, `lemoon-pdp-layout`, `lemoon-components`, `lemoon-tokens`; JS `lemoon-eyewear-product`; snippets de heading, imagen, medidas, precio y compra; locales es actuales. Es inspección de fuente, no render Shopify actual.
- Intake de raíz `/tmp/lem-next-pdp-intake.{md,json}`, run `6998e487dcec`: aceptación y comentarios completos de 134/23/129/46/31/93/52/86/141. Catálogo `/tmp/lem-next-design-intake.json`, run `579ab8e5a3f9`, generado `2026-11-06T05:14:18.597Z`: 60 productos, 116 variantes y 13 colecciones. Excerpt de tres productos en `references/catalog-excerpts.json`; no se refrescó disponibilidad pública. `onlineStoreUrl` vacío no prueba que el producto tenga una oferta pública activa.
- Figma real leído mediante `get_design_context` y `get_screenshot`, archivo `9EgE1vntKfwoQIQTzBUBNg`, nodos [desktop 62:346](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=62-346) y [mobile 63:448](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=63-448); alternativas 269:821 / 270:742 también abiertas e inspeccionadas. Contextos textuales y capturas guardados en `references/figma-*`, con hashes. No se obtuvo versión inmutable del archivo: hash de snapshot no equivale a ID de versión. No se creó sesión, frame ni archivo Figma por la restricción expresa de no escrituras.
- LEM-23 `eaf530f0d936fb572e074e40d75f37b2fc56e6dd`: `docs/specs/2026-11-05-lem-23-configurador-spec.md`, sección A, y `docs/design/lem-23-proposal/README.md`/manifest. [Siete composiciones propuestas 460:583](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=460-583), consultadas aquí por sus documentos locales a revisión fija; no se afirma nueva inspección de esos siete frames en Figma ni aprobación de ellos.
- LEM-129 PR64 `ba95b03f6b827e4e387be921408f9ed622c91101`: `docs/lem-129-size-guide-review.md`, snippets `lemoon-product-size-guide` y `lemoon-size-guide-content`. Se cita implementación propuesta separada; no se copia, importa ni valida en Shopify.

Precedencia: alcance 134 → DESIGN/familia local y requisitos accesibles → ADR y datos verificados → composición Figma. Los valores de muestra de Figma (89.990, 127 reseñas, IVA, envío gratis, devolución 30 días, garantía) no son evidencia comercial. Las alternativas añaden titular editorial, cuotas y ajuste de por vida: no adoptados. Tipografía y logo reconstruidos de Figma no sustituyen Urbanist/Hanken ni el SVG oficial. 133/135 no aportan decisiones ni runtime a esta propuesta.

## 2. Base existente y conciliación

| Superficie | Existente comprobado | Propuesta para 134 |
|---|---|---|
| Estándar | `product.json` compone main-product, disclosures, relacionados y accesorios. Galería Dawn, price, variantes y buy-buttons; sin quantity_selector en el template base | Conservar familia y operación nativa de accesorios. No añadir cantidad obligatoria si el consumidor no la presenta |
| Óptica | product.optica → lemoon-eyewear-product. Primera opción visible, opciones de lentes posteriores ocultas; heading, precio, talla, guía, configuración y galería propia | Expresar marco/variante, precio base y entrada clara al recorrido 23; no duplicar receta en PDP |
| H1 | Global components propone 4rem/600, pero `lemoon-pdp-layout.css` cargado después sobrescribe heading a 2.4rem/500 y <750 a 2.2rem. Estándar tiene equivalente | Conservar 24/22px nominales, peso 500, Urbanist, line-height 1.2; no copiar 40/32 de Figma ni tamaños PLP |
| Precio | Óptica 20px con strong 500; estándar 20px/500. Compare-at 14px condicionado | Mantener tamaño/familia. No activar promoción de muestra; cambiar precio y estado como una unidad anunciada |
| Layout | Grid 1.85fr/1fr, gap40; tablet 1.4fr/1fr gap24; <750 apila. Rail final54 superpuesto y padding80/40; stage clamp480/43vw/680 y tablet420 | Conservar proporciones y anchos fluidos; secuenciar información y estados sin alturas fijas de texto |
| Media | product.media y current_variant.featured_media; fallback product.featured_media. Thumbnails actuales usan cover y mix-blend, stage contain/crop helper | Proponer contain también en miniaturas y retirar blend/crop que altere fidelidad cuando no se pueda comprobar que conserva el producto completo |
| Guía | Herramientas compartidas y diálogo existentes; 129 modifica contenido/control de foco | Situar entrada junto a talla/medidas, sin reconstruir contenido/modal de 129 |
| Figma base | Producto dominante, panel de información, acciones y acordeones; escritorio con miniaturas abajo | Mantener jerarquía, reutilizando rail lateral actual y familia local; no reproducción píxel a píxel de datos ficticios |

La base final además recolorea acción óptica a lemon/16px/400 y mueve identidad/precio antes de galería móvil mediante lemoon-pdp-tools. La galería final es relativa con rail superpuesto de54px y padding80/40; esta propuesta conserva la familia y reserva espacio para rail en vez de superponerlo, elección local de composición para revisión.

La revisión inline reúne responsabilidades de interpretación y comparación de tokens. No constituye revisión independiente de su propia autoría; raíz aporta esa revisión. Permisos sin aislamiento técnico.

## 3. Anatomía y presentación editorial

Orden desktop: galería → ruta breve → marca si está informada → H1 product.title → forma/material si existen → precio y alcance → color/talla → atributos útiles → compatibilidad → estado → acción → ayuda de receta cuando aplica → condiciones verificadas → descripción/medidas/opciones en disclosures. En móvil el resumen de identidad/precio precede a la galería, como hace lemoon-pdp-tools; sigue selección/atributos/acción. Marca/modelo no se inventan desde el handle; si el título ya incluye marca no repetirla como un segundo H1. SKU opcional discreto, omitido cuando falta. Evitar separadores huérfanos al faltar un campo.

El primer render óptico usa Artico, producto `9581567869096`, variantes Azul `55898368049320` y Carey `67608895619240`: forma cuadrado, material acetato, talla textual `mediano (54-17-145)`, importe observado `1199` CLP. Se representa `$1.199 CLP`, sin multiplicar/dividir por 100; esto no aprueba ese precio para venta. No se muestran su compare-at ni tags flash-sale como campañas aprobadas. Accesorio de demostración: `Muestra · Estuche rígido para lentes`, importe `9900`, `$9.900 CLP`; lectura directa, sin nota de solo marco. IDs y variantes exactos en excerpt.

El estado cambio de precio usa exclusivamente importes observados de Dalton Prototipo UNLISTED: `39900` Solo armazón y `59900` Monofocal/Estándar 1.50. Son precios de variantes completas del prototipo, no cargos genéricos ni oferta final. No se infiere que Artico tenga esa configuración. La vista sol usa espacio sin SKU/importe, con compra bloqueada hasta datos válidos; no se fabrica un producto de sol.

La descripción editorial final proviene del producto y su dueño, no de texto aspiracional añadido aquí. Se omiten reviews/badges/ahorro/try-on sin fuente válida. Recomendaciones y accesorios posteriores mantienen secciones existentes: no inventar productos sugeridos ni duplicar un carrusel en este artefacto.

### Medidas visuales

| Elemento | Medida/rol seleccionado |
|---|---|
| Página | Blanco `surface-page`; texto carbon `text-primary`, ayudas `text-secondary`; navy `text-brand` |
| Galería/panel de atributos | Warm `surface-warm`; stage actual sin radio; panel radio16 local; sin fondo lemon extenso |
| H1 | Urbanist 2.4rem / 500 / 1.2; <750 2.2rem; tracking -.4px local heredado |
| Precio | Hanken 20px / 500; alcance y procedencia12px; saltos de línea para importes largos, sin truncar |
| Body/ayudas | Hanken16px/1.5 base; controles/opciones13–14px; secundarios12–13px. No tercera fuente |
| Acción | Familia óptica final lemon, texto navy, pill canónico (`--lemoon-radius-button`,9999px por regla final !important en components) y mínimo52px; Urbanist16/400, sentence case, .04em heredado. Regla final en lemoon-pdp-layout prevalece sobre la anterior navy/uppercase. Accesorio conserva acción nativa navy/48px |
| Color/talla | Labels persistentes; elección con texto, no solo color. Pills mín48/radio24 ópticas; estándar actual40 se propone44 como mínimo accesible al modificar |
| Separación | Precio16; grupos24; label-opción12; tallas padding16; atributos padding20/gap20; columnas40 desktop24 tablet; bloques32/40/64 según familia |
| Foco/bordes | Navy continuo2px + offset4 en demo, mínimo2 donde receta local lo pida. Borde navy1px en controles modificados; borde input #6685AD para número/select. No gris tenue como única delineación |
| Capas | No nueva barra de compra sticky en esta propuesta; conservar dueño existente si se integra. La regla final de galería en base es position:relative ≥990; propuesta sin sticky para conservarla. Diálogo nativo mantiene capa superior |

Se enlazan tokens canónicos directamente sin copiarlos ni crear aliases. Las medidas locales heredadas no se presentan como nueva escala global. El uso de texto en pills de color, borde más perceptible, contain en thumbnails, agrupación breve de atributos y CTA único de entrada son propuestas para Miguel, no contrato aprobado previamente.

## 4. Galería y fidelidad del producto

**Fuente requerida al implementar:** `product.media` y `variant.featured_media`, por ID; cuando no hay asociación de variante usar featured del producto solo con contexto verdadero. No cambiar silenciosamente a otra variante para conseguir una foto. El snapshot de catálogo no trae media ni asociaciones: los tres espacios numerados son anotaciones de geometría, no tres ángulos existentes. No se usa fotografía genérica de categoría, ni se generan imágenes/ángulos. La fuente editable sigue siendo útil con estos espacios explícitamente no vinculados.

- Principal contain, producto entero y proporción natural; no stretch ni crop editorial. Fondo warm si no altera color; comprobar transparencia y fidelidad frente al original antes de blend. Lifestyle solo si realmente pertenece a ese producto y está rotulado como contexto.
- Imagen principal prioritaria; secundarias lazy; reservar geometría para evitar saltos. Alt específico del producto/variante y vista cuando consta; nunca inventar “lateral” de un archivo desconocido. Thumbnail con nombre “Ver imagen N” y aria-pressed. Estado seleccionado combina contorno y señal textual.
- ≥990 rail lateral con scroll propio, foco visible y botones 54px. La base final oculta rail bajo990 y usa swipe/conteo; se propone alternativa horizontal de miniaturas accesibles debajo; no convertir el scroll de la galería en overflow de página. Mostrar conteo verdadero solo si hay media real. Conteo de la demo dice “Espacio N de 3 · anotación”.
- Desktop zoom abre diálogo nativo con imagen real a resolución disponible, cierre44, Escape, foco contenido/restaurado al botón. No interpolar detalle ni afirmar zoom real en esta demo sin foto. Mobile admite swipe horizontal, pero anteriores/siguientes/miniaturas y teclado ofrecen alternativa; gesto vertical mantiene scroll de página. Swipe no debe abrir zoom al terminar: verificar al integrar sobre media real.
- Selección por miniatura con Enter/Espacio; flechas/Home/End en rail como mejora propuesta. Conteo polite sin mover foco. Movimiento opcional opacidad250ms según token, desactivado con reduced-motion; demo no necesita animación.

| Estado | Lo que ve/hace el usuario en diseño final |
|---|---|
| Carga | Espacio reservado, “Cargando imagen”; no spinner infinito sin recuperación. Información/selección disponible; no bloquear toda la PDP |
| Error principal | “No pudimos cargar esta imagen”, reintento local y otras miniaturas válidas; no zoom del archivo roto |
| Media única | Una principal, ocultar rail y swipe/conteo redundante; demo single conserva etiqueta para auditar |
| Sin media | “Imagen no disponible”; sin controles inútiles, sin placeholder que parezca SKU real |
| Secundaria ausente | No crear espacio clickable vacío; contar únicamente media existente |
| Parcial | Mantener media válidas, mensaje localizado para la que falla, contexto variante visible |
| Video/3D real | Mantener controles nativos, poster verdadero y nombre/tipo; no autoplay ni convertirlos en fotos generadas; no simulados aquí |

## 5. Datos, atributos y compatibilidad

| Campo observado | Tipo/situación | Presentación y límites |
|---|---|---|
| frame_shape / frame_material / frame_size / frame_width | single_line_text_field | Forma, material, talla, ancho descriptivo; texto escapado, sin traducciones comerciales inventadas. “ancho” no es un número |
| Color | selectedOptions / options | Solo valores/combos reales. No deducirlo de foto o tag; texto de color siempre accesible |
| frame_dimensions | json | Aceptar únicamente objeto con números positivos y unidades según contrato verificado. Keys frame_width/lens_width/bridge/lens_height/temple; 129 los interpreta en mm. En Dalton snapshot140/54/17/42/145, son configurados, no medición física |
| frame_size | Texto `mediano (54-17-145)` | No parsear ni inferir mm ni altura de lente desde esa cadena. Si no hay dimensions válido: “Medidas no disponibles para este producto” |
| frame_weight | number_decimal | g solo conforme contrato de campo; omitir inválido/ausente. No inferir peso por material |
| face_shapes_compatible | Valores observados string, expectativa histórica list | Conflicto explícito LEM-93; no migrar/normalizar ni generar recomendaciones por truthiness. Ocultar recomendación de rostro si interpretación no está confirmada |
| lens_compatible | list.metaobject_reference en Artico y catálogo; ADR lo define como admisión de receta | No `if value => Sí`. Falta conciliación semántica del tipo/valores con LEM-93/23. Principal: “Compatibilidad con receta por confirmar” |
| lens_type_options | Ausente en muestra relevante | No inventar tratamientos disponibles. Ocho nombres de metaobjetos no prueban precio, variantId, asociación o posibilidad de cobro |
| prescription_type | list.single_line_text_field observado | No sustituye asociaciones comerciales ni garantía clínica para toda graduación |

Tres ramas explícitas: **admisión confirmada** (si contrato validado, “Admite receta” con opciones comprobadas aparte); **no admite confirmada** (no descarta automáticamente tinte/filtro azul sin receta); **indeterminada** (no prometer receta ni abrir una compra de opciones no verificadas). Vistas compatible/incompatible son condicionales simuladas, rotuladas; no describen Artico actual. Nunca mostrar “Sí” por existencia de referencia. El configurador puede explicar ausencia de opciones; comprar solo marco disponible sigue permitido. No modificar catálogo para hacer encajar el layout.

## 6. Variantes, stock, precio y acción

Color/talla son fieldsets con legend, radios nativos y labels clicables; no pasar foco al precio al seleccionar. Actualizar nombre de opción, foto asociada si existe, importe y disponibilidad conjuntamente; anunciar una vez en región polite/atomic. Estado inválido o error tiene texto junto a controles y referencia aria-describedby. No ocultar una opción agotada si ayuda a comprender el catálogo; marcar “Agotado”, deshabilitar compra y permitir elegir otra. Combinación inexistente no es stock cero.

| Estado | Precio/stock | Acción y recuperación |
|---|---|---|
| Seleccionada válida | Importe de variante + alcance marco o accesorio; disponibilidad según dato real | CTA específico del contexto; mostrar transición sin cargar receta en PDP |
| Agotada | Conservar importe verificado si existe, “Sin stock para esta variante” | Agotado disabled; otras opciones accesibles; sin lista de espera/promesa de reposición nueva |
| Inexistente | Precio no disponible, no0 | Selecciona combinación; no reemplazo automático |
| Actualizando | Último contexto retenido e indicado como pendiente; busy en grupo | Deshabilitar operación mientras respuesta pendiente; no deshabilitar navegación/guía |
| Error | Conservar elecciones, indicar que precio/stock no pudo actualizarse | Reintentar; éxito real debe revalidar, no avanzar por temporizador |
| Sin precio/datos | “Precio no disponible”; ocultar compare-at/promoción | Compra deshabilitada. No convertir null en gratis |
| Cambio importe | Nuevo precio y explicación de variante/configuración que cambió | Reconfirmar selección antes de compra; no aplicar cargos invisibles |
| Nombre/opción larga | Texto envuelve; precio y CTAs permanecen legibles | Sin ellipsis de datos esenciales; texto de botón multilineal si necesario |
| Cantidad | Solo donde el consumidor la soporte; límites reales min/max/increment | Validar reglas Shopify, no asumir max; conservar/reconciliar al entrar/volver |

La vista quantity ilustra ese requisito, no agrega quantity_selector al template estándar. Demo min1/step1 es solamente control de revisión; no fija reglas del inventario. El precio unitario y cantidad no forman total final de opciones hasta contrato comercial válido.

Impuestos: hoy fuente óptica consulta cart.taxes_included. Esta propuesta no verificó valor actual de settings/políticas; omite IVA incluido, cuotas, envío gratis, garantía, plazos y devoluciones voluntarias. Implementación puede enlazar `shop.shipping_policy.url` y otras políticas nativas existentes, con texto localizado, únicamente si existen; ausencia no genera href ficticio. No se exige abrir un checkout para validar esta propuesta.

## 7. Entrada y regreso: LEM-23 / LEM-24

Partida `/products/{handle}` y variante seleccionada; helper real `lensConfiguratorUrl(productUrl,variantId,origin)` fija `?variant={id}&view=configurador`. No lleva cantidad. En Artico ejemplo mostrado: `/products/lemoon-artico?variant=55898368049320&view=configurador`; es referencia de ruta del snapshot, no una petición ni prueba HTTP pública.

**Propuesta de jerarquía:** un botón lemon “Continuar con este marco” para armazón con recorrido habilitado, seguido de explicación “En el configurador podrás elegir solo armazón o añadir opciones disponibles”. Evita que dos CTAs parezcan dos checkouts o que agregar implique cristales gratis. La elección explícita solo armazón permanece en etapa A acordada; no se redibuja esa pantalla. La referencia 23 permite ruta corta de solo marco tras confirmar variante/cantidad, pero su adopción en 46 requiere conciliación independiente. No se ofrece una compra de tratamientos por la sola presencia de lens_compatible. Si no se puede habilitar configuración segura, mantener compra de solo marco mediante el contrato acordado, o bloquear entrada incompleta con explicación, nunca falsear disponibilidad.

Accesorio: “Agregar al carrito”, sin entrada a receta ni nota solo marco. Estado agotado/variante inválida bloquea operación. La demo muestra un diálogo anotado con destino; nunca navega, agrega ni captura una receta.

Requisitos para integración 46/23: conservar identificadores de producto/variante, imagen real disponible, opciones y cantidad; volver a PDP sin perder elecciones independientes; reconciliar variante/cantidad con datos actuales. No se define parámetro quantity, localStorage, sesión/API ni forma de persistencia en 134. Si cambió stock: mensaje, reelegir, sin sustitución silenciosa; precio cambiado: mostrar motivo y nueva cifra antes de reconfirmar; variante eliminada: selección explícita; regresar/cancelar no crea carrito ni descarta estado sin advertir. El link “Cambiar armazón” del configurador debe devolver al producto correcto según contrato final, no a un handle fijo.

Ayuda de receta: control secundario “Cómo aportar tu receta” explica la entrada compartida LEM-24 y el aporte posterior desde perfil conforme ADR. No formulario, upload, campos OD/OI, recomendaciones médicas, captura Gemini ni persistencia paralela. Pago con receta pendiente admite el total real de opciones elegidas; esta PDP no declara recepción/admin/revisión técnica ni fabricación. Manual, lectura Gemini, corrección/confirmación y recepción pertenecen a 24/140/138/23 y conservan sus gates.

## 8. Entrada de tallas: LEM-129

Junto al label talla y cerca de medidas, botón “Guía de tallas”, target≥44, contexto de producto real y `aria-describedby` para ausencia de medidas. Abrir contenido compartido de 129, no una nueva guía. Referencia fija PR64 `ba95b03f`, snippets y documento enlazados en fuentes. Sin medidas: “Medidas no disponibles para este producto”; el usuario puede leer la guía general si existe, sin números de ejemplo. No deducir mm de frame_size ni hacer diagnóstico de rostro.

Al abrir: foco al título o control inicial definido por 129, `aria-labelledby`, Tab contenido, Shift+Tab cíclico, Escape y cierre visible, retorno al opener exacto. Cierre preserva variante/cantidad/scroll de contexto. Si LEM-105 aporta Page real configurada, ofrecer enlace fallback a ella; no crear un URL por nombre ni prometer contenido no entregado. En JS deshabilitado, conservar navegación a esa Page real cuando exista; si no existe, talla/medidas permanecen como información y no botón muerto. La demo abre exclusivamente anotación de integración y no acredita QA del modal129 ni su adopción/merge.

## 9. Responsive, accesibilidad y estados visuales

≥1280 gutters42; 990–1279 gutters24, dos columnas1.85/1 y gap40; 750–989 gutters24, dos columnas1.4/1 gap24 y galería sin sticky; <750 gutters16, una columna, resumen identidad/precio primero, luego galería y selección, H122px, gap24. Sin alto fijo en información o disclosures. Stage de la familia clamp480/43vw/680 desktop,420 tablet,min(105vw,480px) móvil. A320 nombres/controles envuelven; no horizontal de página. A820 panel estrecho mantiene etiquetas/precio legibles con wrap. Breakpoints comprobables320/390/749/750/820/989/990/1279/1280/1440.

Un H1 semántico; h2 en zonas auxiliares, details/summary nativo para información, label de cada control, radio keyboard nativo. Foco visible inmediato y sin clipping; controles mínimos44 para nuevas/modificadas superficies. No depender de color para seleccionado/error/agotado. Texto error con aria-invalid/describedby cuando aplica al control; anuncio async breve, no todo el panel en live region. Loading no declara éxito. Respeta zoom del usuario, reflow y reduced-motion; no animación necesaria para comprender selección. No barra fija adicional que tape descripción o teclado.

Contrastes calculados de colores sólidos en evidencia de render: navy/blanco, secondary/blanco, secondary/warm, borde-input/blanco y error/blanco. Se verifican límites locales, no certificación WCAG completa, lector de pantalla, Safari/Firefox, checkout ni Shopify. La fidelidad real de fotografía y zoom no puede verificarse sin media asociada.

## 10. Matriz de aceptación y decisiones pendientes

| Aceptación 134 | Entrega concreta | Estado / límite |
|---|---|---|
| Revisar base | §1–2, fuentes fijas y comparativa estándar/óptica/Figma | Completa en fuente; sin QA storefront |
| Galería y atributos | §4–5, base/partial/single/nodata y campos snapshot | Diseñados; binding/fotos reales pendiente71/93/46 |
| Variantes/stock/precio | §3/6, estados interactivos y PNG de estados | Diseñados; ofertas/asociaciones reales no aprobadas |
| Entrada23/24 sin redibujar | §7, demostración CTA/ayuda/retorno/cantidad | Diseñada; integración pertenece46/23/24 |
| Entrada129 | §8, contexto y foco en anotación | Diseñada, no adopción de otro ticket |
| Compatibilidad vs opciones | §5, indeterminada/validada/no admite condicionales | Diseñada, conflicto de tipos explícito93 |
| Desktop/mobile/sin datos/sin stock | HTML editable, principales390/820/1440, estados y bordes de breakpoint | Render local y evidencia en render-checks.json |
| Aprobación de Miguel | Paquete concreto y decisiones P1–P5 abajo | **Pendiente**, no se puede autoaprobar |

### Confirmado y reutilizado

C1: marca/Urbanist/Hanken/tokens y logo oficial; C2: familia PDP y cascada24/22px; C3: marco solo elegible y accesorios directos, precio base solo marco incluso sol; C4: receta compartida con aporte posterior y verificación separada; C5: Shopify como fuente comercial, ninguna promesa inferida desde Figma.

### Propuestas nuevas para Miguel, antes de adopción

P1: CTA único lemon “Continuar con este marco” + explicación de solo marco/opciones; conciliar con 23/46 antes de runtime. P2: texto visible de color en pills además de estado seleccionado; sin añadir colores no existentes. P3: resumen breve de atributos antes de acción, manteniendo disclosures para detalle. P4: contain también en miniaturas y media sin blend/crop no verificado, para fidelidad de producto. P5: targets≥44 y contorno perceptible en controles modificados; navegación de galería por teclado y fallback semántico ante falta de media. No nueva familia de tokens.

### Contenido, activos, owners y gates

| Pendiente de implementación/producción | Responsable / condición |
|---|---|
| Fotos auténticas y asociación variante, alt, resolución zoom |71/93/46; no fabricar ángulos. Los slots actuales son suficientes para revisar composición, no para publicar catálogo |
| Normalización preservando datos: lens_compatible/face_shapes/medidas |93; resolución explícita, no migración automática134 |
| Oferta, precios base/adicionales, cargos/variantIds y stock actual |52/93/10/23; nombres de metaobjeto no suficientes |
| Aprobación UI134, conciliación etapa A, retorno/cantidad y compra |Miguel /46/23; 134 no aprueba ni cierra23 |
| Integración guía compartida y fallback Page105 real |129/105/46; no adopción implícita PR64 |
| Capacidad receta, recepción, perfil y revisión técnica |24/140/138; sin promesa de entrega o upload paralelo |
| Copy final producto/condiciones, políticas nativas y locales |Dueño producto55/46; hechos comerciales confirmados antes de integrar |
| Implementación, inventario componentes, pruebas integradas |46 futuro; actualizar inventarios y DESIGN solo con autorización pertinente, sin tocar runtime aquí |

No bloquea dibujar la entrada: contratos comerciales faltantes siguen gates explícitos de producción. No se decide un endpoint, cargo o capacidad clínica para ocultarlos. La autoría completa no satisface la fila de aprobación humana ni las pruebas de integración de otros tickets.

## 11. Evidencia local de autoría (histórica antes de correcciones de estados)

`node docs/design/pdp-proposal/render.cjs` utiliza Chromium ya instalado y URLs file. Resultado final en render-checks.json:10 anchos,28 combinaciones de estado/ancho,6 comprobaciones de teclado; sin overflow de página, un H1 por vista, cinco caras locales utilizadas/cargadas y seis incluidas (Urbanist600 no requerido en la vista principal), logo cargado, sin peticiones de runtime externas ni errores de página. Checks de cascada con archivos CSS de main confirman H122/24px peso500, precio20px/500 y botón óptico lemon16px/400/pill9999px. Esta medición CSS se realiza con shell mínimo, no sustituye Liquid/JS renderizado en Shopify.

Inspección visual directa: tres PNG principales, cuatro láminas que agrupan14 estados móviles y cuatro capturas Figma. Las capturas desktop de cada estado también están disponibles; la cobertura visual directa se concentra en principales y láminas, no se afirma inspección individual de28 capturas. Se corrigieron procedencia de precio entre familias, receta inaplicable al accesorio y falsa atribución de campos en vista sol sin SKU. No se corrieron Theme Check/Vitest por ser documentación/prototipo local; CI y revisión independiente corresponden a raíz. Ningún resultado implica publicación, carrito real, receta recibida, verificación fotográfica, AT ni conformidad WCAG completa.

### Corrección acotada de los dos P2 de revisión independiente

La evidencia posterior específica está en `pdp-proposal/state-correction-checks.json`, reproducible con `node docs/design/pdp-proposal/render-state-corrections.cjs`: contextos base/nodata/Dalton/accesorio/sol en390/1440, disclosures expandidos y recuperación parcial local. Dalton etiqueta ancho del armazón/frame_width140, ancho de lente/lens_width54, puente/bridge17, alto de lente/lens_height42 y patilla/temple145, todos en mm configurados; su helper y disclosure usan esos datos. Nodata declara descripción/material/medidas ausentes; Artico conserva ausencia de medidas individuales. No se infieren cifras desde talla ni se mezclan modelos.

En `partial`, el espacio1 parte fallido y ofrece reintento accesible fuera del botón de zoom deshabilitado; espacios2/3 son válidos como anotación y habilitan zoom. El reintento convierte espacio1 a válido en la simulación, anuncia el resultado y mantiene foco en el botón de reintento; abrir/cerrar zoom restaura el opener. Ningún espacio representa recuperación real de una foto ni hace una petición de red. Las capturas nodata/pricechange/partial y hojas1/3 se actualizan; otras capturas y la suite amplia anterior siguen como evidencia histórica, no se repiten por esta corrección. P1–P5 e interfaces comerciales no cambian.
