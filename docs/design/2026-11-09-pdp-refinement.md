# PDP — refinamiento de información y presentación · LEM-46 / LEM-134

Solicitud directa de Miguel,09-11-2026: perfeccionar la PDP existente, conservar capacidades y complementar su información; adaptar las12capturas entregadas a identidad Lemoon. Implementación en tema, sin sustituir la revisión humana del resultado ni publicar producción.

## Referencias y criterio aplicado

- Capturas1–7: Zeelool Grover; se verificó la [PDP original](https://www.zeelool.com/goods-detail/ZJGT078897-02). Selección arriba, detalles y descripción en grupos, medidas ilustradas y servicios cerca de compra. Se adopta la organización, no sus precios, garantías365días, devoluciones30días, descuentos, rangos clínicos ni afirmaciones terapéuticas.
- Capturas8–9: [Warby Parker Bronte](https://www.warbyparker.com/eyeglasses/bronte/crystal-moss), página abierta09-11-2026. Jerarquía breve, color/talla junto a guía, atributos legibles y ayuda de compra. No se traslada su paquete de cristales incluido ni política estadounidense.
- Capturas10–12: referencia proporcionada Neil Large (Ace & Tate); descripción y tabla de especificaciones con medidas desglosadas. Se utiliza solo lo visible en las capturas; no se afirma inspección web de esa ficha.
- [Investigación chilena y textos](../content/2026-11-09-pdp-trust-research.md): RYK/GMO/Karün y norma vigente. Treinta días de cambios/adaptación no equivalen a garantía legal.

## Base realmente comprobada

El checkout anterior pertenecía al PR documental68, revisión db3fc227. Se preservó íntegro y se inició rama nueva feat/lem-46-pdp-information sobre la versión publicada reciente497afca4 (el código de develop45486eed ya está incluido). El09-11 se leyeron ambas descripciones y comentarios actuales en Linear: [implementación46](https://linear.app/antekera/issue/LEM-46/shopify-theme-product-detail-page-pdp), In Progress; [diseño134](https://linear.app/antekera/issue/LEM-134/ux-wireframe-y-diseno-final-de-pdp), In Review. Esta solicitud autoriza el refinamiento actual, sin afirmar aprobación retroactiva de todo134 ni cierre de46.

Tema publicado155307737256 consultado mediante theme list y extracción solo de archivos pertinentes a un directorio temporal. Las secciones PDP, CSS/JS y snippets de características/guía coincidían byte por byte con la base. product.optica.json solo difiere por el comentario generado por Shopify; se conserva el template remoto/editor. No se extrajeron archivos sobre trabajo sin guardar. Desarrollo vigente189557964968; otros servicios9292/9293/9294/4173 pertenecen a trabajo concurrente y se preservan.

## Organización implementada

Desktop conserva las familias tipográficas actuales y el protagonismo de la galería junto al panel de elección. Móvil conserva identidad/precio antes de foto y luego selección/compra. La descripción corta deriva de contenido existente y la descripción completa sigue disponible. Características y medidas se agrupan debajo con más ancho y una entrada contextual que abre la misma guía terminada, devolviendo foco al control exacto.

Se mantienen galería/zoom/swipe, variantes/precios/disponibilidad, configurador/solo marco, SKU, promociones, reseñas/app, guía, información de cristales/cuidados, envío/reembolso y recomendaciones. No se reconstruyen compra23, receta24 o modal129; no se crean ofertas ni promesas de beneficios desde muestras. Los estados sin datos se omiten o explican en su dueño.

## Simplificación focal de tabs

La entrada contextual se unifica como «Guía de medidas», usando la misma clave que el título del modal. Se elimina la flecha↗ para no sugerir navegación a otra página y se retira la clave duplicada de copy. La función, la instancia de diálogo y el retorno de foco se conservan.

Por solicitud posterior se retiran outline y sombra del foco en los botones que abren esa guía (contextual, estándar y óptico). Se conserva una señal de teclado con subrayado3px/offset0.4em en focus-visible, sin cambiar controladores ni otros controles. La reproducción viva previa confirmó outline2px más sombra global al volver del modal; la corrección actúa solo sobre estos accesos.

Validación de foco: Theme Check326sin infracciones; preview189893869736 comprobado390/1440 en accesos óptico y contextual, con ratón y teclado. Outline-style y sombra quedan none, teclado distingue subrayado3px, Enter/Escape y cierre por botón conservan restauración de foco. Evidencia focal antes/después en /tmp/lem-46-shopify-qa/guide-focus-{before,after}.json y cuatro capturas de los accesos. El acceso estándar comparte la regla CSS, sin una nueva comprobación real de producto estándar en Shopify para este ajuste.

Por nueva indicación de Miguel se retira el enlace genérico «¿Necesitas ayuda para elegir?» que navegaba a la página de contacto y sacaba de la ficha. No se sustituye por otro destino ni un modal nuevo: Guía de tallas conserva la ayuda contextual en el modal existente. Se preservan los ajustes históricos y otros consumidores; este ajuste retira la salida visible de la PDP óptica.

Validación de esta retirada: Theme Check326archivos sin infracciones y comprobación viva del preview189893869736: el enlace ya no existe; abrir/cerrar Guía de tallas mantiene la URL de la PDP y devuelve el foco al opener. Resultado focal en /tmp/lem-46-shopify-qa/help-link-results.json. Solo se actualizó la sección óptica en el tema no publicado; producción sin cambios.

Nueva solicitud de Miguel: reducir duplicación y extensión en características, medidas, talla y rostro. La comparación de fichas chilenas GMO, Karün y Black Optics (fuentes y límites en [investigación](../content/2026-11-09-pdp-trust-research.md#seguimiento-características-medidas-y-talla-sin-duplicaciones)) respalda separar datos de instrucciones. El render previo del tema189893869736 se comprobó390/1440: tres tabs y esquema fijo; no se atribuyen definiciones largas a la tabla mm, que ya era breve.

Se pasa a dos tabs: Características incorpora talla, ajuste y rostros existentes junto con atributos; Medidas conserva las cinco cifras nativas válidas y muestra el esquema únicamente aquí. Se retiran el tab Talla y rostro y sus párrafos genéricos. Una sola acción Guía de tallas abre el mismo modal; las explicaciones educativas siguen allí. Los nombres de rostro son orientación de estilo y no garantía de calce. No se interpretan números de talla, no se cambian datos comerciales ni descripción HTML del catálogo; se conservan advertencias de prototipo, ausencia y parcialidad. El rango de talla/rostro de competidores no se adopta.

Verificación focal:38unitarias aprobadas (información PDP, medidas y componentes);13casos Chromium aprobados (seis vistas, regresión geométrica previa, datos/prototipo/parcial/vacío y teclado en ambos shells). Theme Check326archivos sin infracciones. Shopify preview189893869736 confirma dos tabs, filas Dalton intactas140/54/17/42/145mm, diagrama solo en Medidas, teclado y apertura/Tab/Escape/retorno de foco en390/820/1440, sin overflow ni erroresJS. Evidencias antes/después en /tmp/lem-46-shopify-qa/tabs-before-results.json y tabs-after-results.json; seis capturas tabs-after por ancho/tab. Inspección visual directa de ambos tabs390/1440 y revisión independiente Approved sin hallazgos abiertos en /tmp/lem-46-tabs-independent-review.md. La rama de diálogo coincide byte por byte con base497afca4; no se repite la suite amplia anterior para este delta ni se atribuye cobertura de Safari/AT/catálogo completo. El validador auxiliar empaquetado de Shopify no pudo cargar una dependencia propia; la validación real se hizo con el Shopify CLI ya instalado y las pruebas indicadas. Esta revisión es conductualmente de solo lectura, sin aislamiento técnico de permisos. Continúan pendientes aceptación humana, integración y publicación.

## Cruce de datos de PDP y back office

Repositorio backend confirmado: antekera/lemoon-next-backoffice, checkout /Users/miguel/Projects/lemoon/admin, HEAD f6e11cb769792ab1fb19e34682fe14f7a6cf3340; contiene trabajo concurrente sin commit que no se modificó. Observación de fuente local, no prueba de despliegue backend ni sincronización real de una edición.

| Elemento visible | Fuente Shopify consumida | Relación comprobada con back office | Comportamiento / límite |
|---|---|---|---|
| Título/modelo | product.title | studio-writer.updateCore/createDraft envían title | Mantener H1 único; no deducir modelo desde handle |
| Introducción corta | primer párrafo de product.description cuando existe | shortDescription existe en Studio pero writer no lo publica como campo separado | Fallback de presentación; no se inventa custom.short_description ni se afirma sync del campo corto |
| Descripción completa / incluye | product.description (Admin descriptionHtml) | descriptionText→textToSafeHtml→descriptionHtml | Conservar contenido y avisos del prototipo; inclusiones solo si el producto las declara |
| Marca / categoría | product.vendor / product.type | Catálogo Shopify existente | No inventar fabricantes ni beneficios |
| Color, SKU, precio y stock | variante/options nativas | Catálogo y variantes comerciales Shopify | Mantener actualización conjunta de variante y sus asociaciones; sin alterar importes |
| Forma/material | custom.frame_shape / frame_material | buildStudioMetafieldWrites publica ambos single_line_text_field | Escapar texto; no añadir material por fotografía |
| Talla/ancho descriptivo | custom.frame_size / frame_width | Writer publica ambos single_line_text_field | No transformar talla textual en mm físicos |
| Rostros/género | custom.face_shapes_compatible / gender | Writer admite ambos como texto simple; convierte listas aprobadas a texto | Reusar presentación actual, sin diagnóstico de ajuste |
| Medidas | custom.frame_dimensions JSON: frame_width/lens_width/bridge/lens_height/temple | No aparece entre escrituras soportadas de studio-metafields; medidas individuales internas no acreditan sync | Mostrar positivos válidos según contrato actual en mm; falta exige carga verificada de catálogo, no inferencia de IA/talla |
| Peso | custom.frame_weight number_decimal | No incluido en supported del writer actual | Solo dato existente válido, en g según contrato; no cálculo por material |
| Admisión de receta | custom.lens_compatible | Writer real conserva list.metaobject_reference; no booleano normalizado | No truthy→Sí ni confundir nombres con opciones comprables; contratos31/93/23 separados |
| Opciones de cristales | asociaciones comerciales/configuración existente | No se deducen cargos desde descripciones/metaobjetos | Mantener entrada al configurador; no universalizar compatibilidad |
| Envío | shop.custom.plazo_entrega_receta y shipping_policy | Configuración comercial de tienda, no generación de producto | Plazo dinámico más condición de inicio; vínculo a política nativa |
| Cambios y garantía | refund_policy vigente | Política de tienda | Diferenciar fallas, retracto y beneficios voluntarios |
| Medios de pago | shop.enabled_payment_types | Proveedores realmente habilitados Shopify | Iconos nativos solo si hay medios; sin cuotas ni sellos inventados |

Fuentes backend inspeccionadas: services/api/src/shopify/studio-writer.ts (createDraft/updateCore), services/api/src/shopify/studio-metafields.ts (supported/buildStudioMetafieldWrites), packages/domain/src/product-studio.ts y services/api/src/data/studio-content.ts. Completar shortDescription y escrituras de medidas exige un cambio explícito del contrato backend; este refinamiento no modifica otro repositorio ni simula que esa sincronización exista.

## Producto de referencia y datos vivos

Dalton Prototipo, producto15409107763368, handle lemoon-dalton-prototipo, plantilla optica, UNLISTED. Shopify leído09-11-2026:20variantes, descripción que declara prototipo, seis medios de demostración. Carey Solo armazón67616399392936→39900CLP; Monofocal/Estándar1.50→59900CLP. No se cambia catálogo/stock ni se aprueban esos precios para lanzamiento.

Sus campos existentes: forma pantóstico, acetato, talla mediano(54-17-145), ancho estándar, peso22.5g y frame_dimensions140/54/17/42/145mm. Son valores configurados de demostración, no medición física. No extrapolarlos a otros productos.

## Confianza y hechos comerciales

### Resumen del acordeón · 10-11-2026

Nueva solicitud de Miguel: acortar Envíos y devoluciones. El preview anterior insertaba los cuerpos completos de ambas políticas:1990palabras/12908caracteres. Se sustituye solo ese contenido por cuatro puntos: entrega estimada dinámica y comienzo/corrección/variación, cobertura/costo/seguimiento, retracto10días con extensión90si falta confirmación escrita íntegra/clara/legible y posibles excepciones personalizadas, garantía legal6meses por fallas con elección de solución. Dos enlaces conducen a las condiciones completas. La información de confianza anterior a compra no se altera.

Shopify vivo reconsultado10-11: plazo5a13días hábiles, envío actualizado04-11T20:48:58Z y reembolso04-11T20:54:46Z, sin cambios. Copy contrastado por lemoon-copywriter y artículos3bis/20/21 de [BCN](https://www.bcn.cl/leychile/navegar?idNorma=1160403), abiertos10-11. El resumen no modifica políticas ni reemplaza advertencias específicas de una configuración personalizada antes del pago. Español/inglés integrados mediante locales. Render de fuente115palabras incluidas acciones; casos sin políticas/sin estimación y exclusión de cuerpos completos comprobados con el motor de fixtures, sin crear enlaces ni plazos ausentes.

Theme Check326archivos sin infracciones. Preview189893869736 actualizado solo en sección óptica y locales es/en; comprobación viva confirma115palabras, cuatro puntos, dos URLs nativas correctas y ausencia de los cuerpos íntegros. Sin overflow ni erroresJS390/820/1440; capturas390/1440 inspeccionadas visualmente. Evidencia en /tmp/lem-46-shopify-qa/shipping-summary-{before,after}.json y shipping-summary-{390,820,1440}.png. No se ejecutaron compras ni se modificaron políticas o producción. La suite amplia previa no se repitió para esta corrección editorial.

La segunda pasada solicitada de claridad contrasta de nuevo las políticas Shopify: envío actualizado2026-11-04T20:48:58Z y reembolso2026-11-04T20:54:46Z, sin cambios respecto de la consulta inicial. El resumen ahora distingue garantía por fallas de6meses, retracto10días corridos (90sin confirmación escrita íntegra/clara/legible) y excepciones legales, cobertura nacional, plazo dinámico estimado, inicio con pago/receta completa o corrección aceptada, variación por producto/destino/transporte, costo antes de finalizar y seguimiento al despacho. Los cuerpos completos siguen siendo las políticas nativas y sus enlaces; no se modifican políticas ni se otorgan beneficios voluntarios. Revisión editorial independiente de esta precisión y contraste de artículos3bis/21 enBCN; la advertencia específica de retracto para una configuración personalizada conserva su propio contrato antes del pago.

Verificación de esta segunda pasada: Theme Check326archivos sin infracciones y11pruebas focales aprobadas. Solo locales es/en y snippet de confianza subidos al mismo preview no publicado189893869736; render vivo confirma cada cifra, condición y los enlaces nativos, sin erroresJS ni overflow390/820/1440. Capturas focales y resultado en /tmp/lem-46-shopify-qa/policy-alignment-{390,820,1440}.png y policy-alignment-results.json; inspección visual directa390/1440. La suite amplia y sus capturas anteriores siguen siendo evidencia histórica de la primera pasada; no se repitieron para este ajuste de texto.

Shopify vivo09-11-2026: taxesIncluded=true. Metacampo tienda custom.plazo_entrega_receta='5 a 13 días hábiles'. Política de envío vigente04-11: envíos todo Chile; inicio con pago confirmado y receta completa si aplica; corrección de receta inicia al recibirse/aceptarse. Costo informado antes de finalizar; no envío gratis inferido.

Reembolso nativo vigente03-11 reconoce garantía legal6meses desde recepción (reparación/cambio/devolución en fallas cubiertas) y retracto10días con excepciones legales específicas. No se copia el cuerpo completo en la zona de confianza: textos breves con enlace a fuente nativa. No se cambian políticas ni se crean30días voluntarios. Los defaults365/30 del schema no son confirmación de una política; el consumidor PDP se concilia con la fuente vigente y las demás superficies mantienen su owner.

## Criterios de verificación

- Ambos consumidores PDP, con y sin contenido; datos largos, medidas parciales/no numéricas, accesorios y sol.
- Reflow390/820/1440; foco/teclado nuevo opener y guía existente con restauración exacta; ningún modal paralelo.
- Galería/variantes/precios/acciones preservados; ninguna compra o receta real ejecutada.
- Theme Check y pruebas pertinentes; distinguir fixtures con Liquid real de preview Shopify y catálogo real.
- Publicación y aceptación final por Miguel permanecen separadas. La entrega lista lo implementado y lo considerado/pendiente.

## Preview de implementación

Se creó un tema **nuevo no publicado**, `LEM-46 PDP refinement 2026-11-09`, ID189893869736. [Abrir Dalton en preview](https://lemoon.cl/products/lemoon-dalton-prototipo?preview_theme_id=189893869736&pb=0). No reemplaza producción155307737256 ni desarrollo compartido189557964968. El staging usó los archivos actuales del tema y copia de configuración publicada en directorio temporal, sin guardar settings privados en Git. La comprobación de render Shopify y pruebas se registra al completar esta pasada.

## Resultado de validación y límites

Theme Check final:326archivos sin infracciones. Unitarias48/48; Chromium focal7/7 (seis vistas+regresión geométrica), galería/mobile8/8 tras corrección, guía29/29 acumuladas (27previas válidas y dos aserciones afectadas actualizadas/repetidas). El harness adapta escape_once al filtro oficial Shopify porque LiquidJS no reconoce todas las entidades: diferencia de motor documentada, sin cambiar la seguridad de producción. Se corrigieron fila de peso vacía, doble escape de entidades y fallback SKU cuando no hay botones de compra.

QA Shopify real sobre tema189893869736: unH1 y sin overflow390/820/1440; medidas Dalton140/54/17/42/145mm correctas; apertura/Tab/Escape de guía y retorno de foco verificados. La inspección real detectó un top100px heredado que desplazaba la galería mobile/tablet: se corrigió en su media query con top:auto. Esa pasada no detectó el desplazamiento de escritorio: la galería ya era relativa y conservaba el top heredado; se corrige específicamente el10-11, según el registro siguiente. Resultado390:24px entre resumen y galería; pie termina762.797 e introducción empieza829.297, sin solapamiento. Se inspeccionaron capturas finales de los tres anchos y zona de características. Revisión independiente final Approved, sin hallazgos abiertos.

Informes operativos locales: /tmp/lem-46-pdp-tests.md y /tmp/lem-46-pdp-independent-review.md. Capturas/mediciones Shopify en /tmp/lem-46-shopify-qa (final-results.json, top/features/dalton390/820/1440); fixtures sintéticos en /tmp/lem-46-pdp-qa. Cada fuente tiene alcance distinto: snippets con fixtures no equivalen a sección completa Shopify; el preview real aquí usa Dalton óptico, no prueba la página estándar real de todos los productos.

No se ejecutaron compras, pagos ni recepción de receta, ni QA AT/Safari/Firefox. No se alteraron productos, medidas, precios, stock, políticas o backend; no se hizo merge ni publicación del tema live. Las promociones/header/footer/recomendaciones existentes se conservaron, sin una nueva auditoría de todas sus ofertas. La rama contiene cambios locales sin commit; el tema no publicado permite revisión humana del resultado concreto. Cambios posteriores en develop de otros owners se preservan para la futura conciliación antes de integrar.

## Corrección de espacio superior de galería óptica · 10-11-2026

Captura y URLs aportadas por Miguel: Dalton muestra espacio vacío sobre la imagen y muestra-ninos-redondo se ve correctamente. Se comprobaron ambas páginas con sesión nueva en producción155307737256 y en preview189893869736; no se atribuye el defecto a caché. Los enlaces sin preview_theme_id también pueden mantener el tema no publicado por la cookie de preview: en cada evidencia se registró Shopify.theme.id.

Causa confirmada1521px: la galería Dalton usa position:relative en escritorio, pero hereda top:100px de la regla sticky antigua; grid/panel comienzan110px y galería/imagen210px. La PDP estándar usa media-gallery con offset propio30px, wrapper−54px y su imagen comienza110px. Se restablece top:auto solo en lemoon-pdp__gallery dentro del media query desktop existente. No se cambia el offset estándar, el recorte de imagen ni los estados comerciales. La regresión automatizada amplía el control del comienzo de fila a820/990/1440/1521, además del caso móvil previo.

Theme Check326archivos sin infracciones; siete Chromium focales aprobados. Solo se sube el CSS al preview no publicado189893869736; el tema live permanece sin esta corrección hasta su integración y publicación por el flujo autorizado.

QA Shopify posterior del preview: Dalton sin overflow390/820/989/990/1440/1521 y galería alineada con su fila a partir750px; móvil conserva24px entre resumen y galería y sin colisión entre pie e introducción. En1521px, galería Dalton pasa210→110px, igual al comienzo de media-gallery estándar110px; su top propio30px permanece intacto. Se inspeccionan visualmente ambas capturas desktop posteriores. Evidencias /tmp/lem-46-shopify-qa/gallery-gap-{before,live-before,after}.json y gallery-gap-after-{dalton,ninos}-{390,1521}.png. La primera medición usó cookie de preview; la comparación live-before empleó sesión nueva sin esa cookie.

Límite adyacente: la PDP estándar muestra overflow móvil390/820 en el preview; se confirmó en producción390 (scrollWidth397px para viewport390), procedente de contenido/consumidores ajenos al selector óptico. Este ajuste no lo modifica ni afirma resolverlo. La aserción inicial que esperaba la palabra CSS auto se corrigió para aceptar su valor calculado0px en posición relativa; los controles geométricos siguen exigiendo desplazamiento cero. No se atribuye esa diferencia de CSSOM a un defecto de producto.

## Comportamiento consistente de PDP estándar y óptica · 10-11-2026

Nueva solicitud de Miguel tras comparar muestra-ninos-redondo y Dalton variante67616399392936: mismo comienzo del hero y contenido inmediato, sin fade/slide de entrada. Baseline del preview189893869736: en1521px Dalton root/fila/galería/panel110px con opacity1/animation:none; estándar root110px, fila134px, galería110px por compensaciones y panel145.39px durante slideIn con opacity0.436. La clase reveal estaba tanto en información como en dos medios. Evidencia nativa pdp-consistency-before.json y dos capturas de escritorio.

Se elimina el padding superior desktop de main-product y el margen negativo que lo compensaba en la galería; ambas galerías relativas reinician top:auto. El panel principal no emite las clases de reveal y el render de la galería pasa reveal_on_scroll:false. El snippet compartido mantiene el ajuste global para consumidores que no pasan ese opt-out. Las fichas default de marcos, sol y accesorios comparten main-product; la óptica usa su sección propia. Gift card y configurador son composiciones dedicadas, sin este wrapper de hero; no se rediseñan. Se mantienen padding responsive/bottom, variantes, compra, tamaño/zoom y drawer; no se desactivan animaciones globales o de otras páginas.

Validación final: Theme Check326sin infracciones;14/14Chromium del conjunto PDP afectado y11/11unitarias. Siete casos nuevos usan wrappers/style/render de main-product reales y CSS Dawn para geometría/entrada inmediata, reproducen en memoria los antiguos24/−54/+30px y prueban que el caller compartido sin opt-out conserva reveal. La proyección de filtros de imagen LiquidJS usa assets sintéticos y no acredita fidelidad de miniaturas; el preview nativo cubre esa inspección. Informe /tmp/lem-46-pdp-consistency-tests.md. Revisión independiente Approved sin hallazgos en /tmp/lem-46-pdp-consistency-review.md; revisión por conducta de solo lectura, sin aislamiento técnico.

Shopify preview189893869736 comprobado en ambas páginas390/820/989/990/1440/1521: doce filas con información opacity1/animation:none/transform:none y cero triggers de reveal en hero. En990/1440/1521 ambos root/fila/galería/panel comienzan110px; imágenes cargadas, unH1, sin erroresJS y guía con Tab/Escape/retorno de foco correcto en ambas páginas. Cuatro capturas posteriores390/1521 inspeccionadas por el revisor, y ambas desktop por el coordinador. Evidencia /tmp/lem-46-shopify-qa/pdp-consistency-{before,after}.json y pdp-consistency-after-{dalton,ninos}-{390,1521}.png. El overflow móvil previo de Niños390/820 queda registrado y fuera del delta; no se afirma eliminarlo ni validar cada SKU/setting/Safari/AT. Solo tres archivos de tema subidos al preview no publicado; no merge ni publicación live.
