# PDP Lemoon: información de confianza y referencias chilenas

Fecha de consulta: 9 de noviembre de 2026. Investigación y copy propuesto para LEM-46/LEM-134; no modifica políticas, datos comerciales, tema ni Shopify. Las referencias competidoras describen su oferta, no acreditan la operación de Lemoon ni constituyen una validación jurídica.

## Criterio editorial

Dar confianza mediante información concreta cerca de la acción de compra y acceso a las condiciones completas: qué incluye el precio, cuándo comienza el plazo de entrega, cómo consultar una devolución y qué derechos se conservan. Mantener pocas entradas breves, legibles en móvil; ampliar en información de compra. Las cifras solo se muestran con fuente comercial verificada. Los textos técnicos y notas de investigación no pertenecen al storefront.

**No sustituir “365 días de garantía” por “30 días de garantía”.** Son conceptos diferentes. El benchmark muestra garantías legales, coberturas comerciales adicionales y períodos de cambios/adaptación con alcances distintos; no un estándar chileno de garantía de30días. Para Lemoon se propone comunicar la garantía legal y enlazar condiciones, sin inventar un beneficio voluntario.

## Referencias primarias abiertas

Las siguientes páginas se abrieron y leyeron, no solo sus resultados de búsqueda. Fecha de acceso común:09-11-2026.

| Tienda / páginas | Qué presenta | Qué sirve a Lemoon y límite |
|---|---|---|
| Rotter & Krauss: [Garantía](https://www.ryk.cl/garantia.html), [Cambios y devoluciones](https://www.ryk.cl/cambios-devoluciones.html) | Separa fallas del marco, compra online, experiencia visual y adaptación multifocal. Informa6meses por fallas;30días para nueva receta en su cobertura de experiencia visual;10días en compra online. | Organizar por motivo ayuda más que un único sello de garantía. No copiar restricciones, canales, mantención ni coberturas clínicas.30días no es la garantía general del producto. |
| Rotter & Krauss: [Tiempos de entrega](https://www.ryk.cl/tiempos-de-entrega.html) | Distingue canal, región y producto. Para ópticos monofocales online publica4días hábiles RM/5regiones; para sol48/72horas. Define corte horario y alta demanda. | Identificar el punto inicial y factores del plazo; no adoptar estas cifras ni afirmar igual rapidez. |
| GMO: [Garantías](https://gmo.cl/pages/garantias) | Distingue garantía legal de voluntarias. Presenta30días para estética, óptica y progresivos con alcances propios;2años en su cobertura de fabricación. | Separar cambio por gusto/talla, adaptación y falla. No convertir30días de estética en reducción de garantía legal ni prometer adaptación en Lemoon. |
| GMO: [Preguntas frecuentes](https://gmo.cl/pages/preguntas-frecuentes) | Explica costo de despacho al terminar la compra,10días hábiles medios para sol/armazones y seguimiento. | Mostrar enlace de condiciones junto a mensaje breve. La página contiene mensajes de pago distintos entre sí: no copiar proveedores ni promesas globales. |
| Karün Chile: [Garantía2026](https://www.anteojoskarun.cl/pages/garantia-2026) | Distingue defecto de fabricación, error interno y retracto. Publica6meses/1año con registro,10días para retracto. | Distinguir incumplimiento del vendedor de arrepentimiento del cliente; no copiar exclusiones generales de cristales o ventas de bodega como si fueran ley. |
| Karün Chile: [Detalle envíos](https://www.anteojoskarun.cl/pages/detalle-envios) | Separa con receta/filtro azul de sin receta y RM/regiones. Publica5días hábiles con receta RM y9–13en regiones; seguimiento tras despacho. | Diferenciar preparación y transporte cuando la fuente real lo permita. Envío gratis/couriers/plazos son oferta de Karün, no de Lemoon. |

La comparación usa sitios que venden anteojos online en Chile. No evalúa cumplimiento real, stock ni experiencia de posventa de terceros. Hay formulaciones legales discutibles o simplificadas en algunas páginas; sirven como referencia de estructura, no como autoridad para restringir derechos.

## Fuentes oficiales y límite de acceso

[BCN, texto refundido DFL3 de la Ley19.496](https://www.bcn.cl/leychile/navegar?idNorma=1160403), abierto09-11-2026: artículos20/21 respaldan elección por fallas cubiertas y ejercicio durante6meses desde recepción; artículo3bis fija retracto de10días en compras a distancia y contempla excepciones específicas e información previa. La disposición vigente incorpora la reforma de Ley21.398; la ampliación de garantía rige desde24-03-2022. No usar el texto histórico de Ley19.496 idNorma61438 como si reflejara por sí solo la versión vigente.

SERNAC se consultó mediante búsqueda oficial: [Garantía legal](https://www.sernac.cl/portal/604/w3-propertyvalue-8062.html), [derechos en comercio electrónico](https://www.sernac.gov.cl/portal/604/w3-propertyvalue-20982.html), y [circular sobre garantías voluntarias,27-01-2026](https://sernac.cl/portal/604/w3-article-88030.html). Los resultados oficiales indexados coinciden en6meses, retracto10días y distinción de garantías. **Abrir los cuerpos completos devolvió timeout/502; la alternativa HTTP directa devolvió403.** No se afirma lectura íntegra de esas páginas ni de la circular; la comprobación directa del texto legal se hizo en BCN.

Un cambio voluntario de30días, un retracto legal y una garantía por fallas responden a supuestos distintos. No excluir todos los productos ópticos o con receta de manera automática: comprobar la configuración concreta y el aviso previo aplicable. Este informe no prepara ni publica una nueva excepción jurídica.

## Lemoon: inventario documental comprobado

Leídos AGENTS, guía de marca, regla de fuentes legales, ADR002, `docs/content/policies-review-notes.md`, `docs/content/commercial-test-data.json`, configuración de beneficios, locales y snippets. Repositorio de implementación: `feat/lem-46-pdp-information`, base informada por coordinador `497afca4`.

| Fuente | Hallazgo | Tratamiento |
|---|---|---|
| `config/settings_schema.json`, grupo Beneficios y oferta | Defaults365días de garantía, cambios/devoluciones gratis antes de30días y envíos a todo Chile. | Un default no acredita operación. Evitar que el consumidor PDP reproduzca promesas no conciliadas con la fuente comercial actual. No editar globales o borrar datos de otras superficies desde este informe. |
| `snippets/lemoon-shared-benefits.liquid` | Consume ajustes globales de garantía, devoluciones y envío y los usa en PDP/Home. | Reutilizar información válida; el copy PDP debe proceder de políticas/datos verificados. |
| `locales/es.json`, `products.product.purchase_trust` | “Envío gratis · Devolución30días · Garantía”. | Texto sin fuente comercial vigente demostrada aquí. No mostrar como verdad por existir en locale. |
| `docs/content/commercial-test-data.json` | Estado TEST_DATA_NOT_VERIFIED:365/30días, tarifas/plazos e identidad de ejemplo. | Excluir como fuente de hechos; no usar RUT/correo/domicilio ficticios. |
| `snippets/lemoon-delivery-estimate.liquid` | Lee `shop.metafields.custom.plazo_entrega_receta`; nombre histórico, uso global. | Mostrar el valor vigente escapado y sin añadir rango propio; al integrarlo incluir condición de inicio del plazo si aparece en política. |
| Respaldo manual `docs/politicas/respaldo-2026-11-04/envios.html` |5–13días hábiles desde pago y receta completa cuando aplica; posee contactos y referencias. | Evidencia histórica, no sincronización. Coordinador contrasta Shopify vivo antes de integrar. |
| ADR002 | Precio inicial solo marco incluso sol; extras según oferta real; accesorios directos. | Explicar alcance de precio. No decir “todo incluido”, receta universal o cristales gratuitos. |

Las páginas públicas de Lemoon refund-policy, shipping-policy y /pages/garantias no fueron accesibles mediante el lector web. El coordinador efectuó la lectura Shopify viva el09-11-2026 y comunicó los resultados siguientes. Esta es evidencia recibida de su consulta, no una segunda consulta de este agente, y no certifica publicación de nuevos textos.

### Shopify vivo comprobado por el coordinador

- `shop.taxesIncluded=true`. La PDP puede indicar impuestos incluidos conforme a ese dato, sin inferir beneficios tributarios o boletas.
- `shop.metafields.custom.plazo_entrega_receta`: **5 a13días hábiles**. SHIPPING_POLICY confirma envíos a todo Chile y comienzo con pago confirmado y receta completa cuando aplica; si hay corrección, comienza al recibirla y aceptarla. El costo se informa antes de finalizar la compra.
- REFUND_POLICY confirma garantía legal6meses desde recepción, elección de reparación/cambio/devolución en los supuestos legales, retracto10días —90sin confirmación escrita— y excepción personalizada sujeta a información previa; **no ofrece30días voluntarios**.
- CONTACT_INFORMATION usa **hola@lemoon.cl**. `shop.email=ayuda@lemoon.cl` no debe sustituir ese canal de contacto por defecto.
- Los enlaces deben provenir de las políticas nativas correspondientes, evitando duplicar sus cuerpos completos en la PDP. Las diferencias con defaults365/30son demostradas; no adoptar esas cifras de muestra.

## Copy breve propuesto para integrar

Original es-CL. Aplicar claves de locales y enlaces configurados reales; estos textos no conceden coberturas voluntarias adicionales.

| Uso | Título / acción | Texto |
|---|---|---|
| Garantía junto a compra | Garantía legal de6meses | Durante los6meses desde que recibes el producto, si presenta una falla cubierta por la ley, puedes elegir reparación, cambio o devolución de lo pagado. |
| Enlace a condiciones de garantía/devolución | Ver condiciones | Usar destino nativo de reembolso o página real de garantías. No inventar un handle si falta. |
| Envío breve | Envíos y entregas | Revisa el costo, las opciones y el plazo de entrega antes de confirmar tu compra. |
| Envío con estimación confirmada | Entrega estimada:5a13días hábiles | Desde la confirmación del pago y, si corresponde, la recepción de tu receta completa. Si requiere corrección, el plazo comienza cuando la recibimos y aceptamos. El rango se debe consumir del metafield vigente, no quedar fijado en el locale. |
| Devoluciones | Cambios y devoluciones | Consulta cuándo corresponde una devolución y cómo solicitarla. |
| Medios de pago | Opciones de pago | Revisa los medios de pago disponibles al finalizar tu compra. |
| Alcance precio de marco | Precio del marco | Los cristales y tratamientos se suman según las opciones que elijas. |
| Ayuda talla | Compara las medidas | Revisa las medidas del armazón y compáralas con tus lentes. |
| Acción talla | Guía de tallas | Abrir el modal existente desde características o medidas, preservando contexto y foco. |

Para una fila compacta puede usarse solo título+enlace, dejando la explicación en información de compra. Si falta política de envío/reembolso, omitir su enlace en lugar de generar uno vacío. Mostrar un rango de entrega sin su punto de inicio puede inducir a error; mantenerlos juntos.

## Decisiones omitidas o pendientes

- No prometer30días voluntarios,365días, devolución gratuita, mantenimiento de por vida, estuche incluido, descuentos, cuotas sin interés, reviews ni envíos gratuitos por imitación.
- No cambiar derechos de compras anteriores ni tratar el benchmark como autorización para reducir un compromiso ya otorgado.
- El plazo y condiciones del comienzo ya están confirmados por la lectura Shopify del coordinador; costo/cobertura se comunican según configuración y política real. No deducir plazos desde una empresa de transporte o producto prototipo.
- Confirmar proveedor de pago antes de mostrar logos o cuotas; “pago seguro” no es una certificación acreditada por este informe.
- Si se desea ofrecer devolución comercial de30días o garantía adicional, acordar alcance/costos/excepciones y conciliar política, PDP y demás superficies antes de anunciarla.
- No añadir afirmaciones de protección UV, alivio de fatiga, resistencia, impacto ambiental o adaptación clínica sin datos del producto y soporte pertinente.

## Entrega y límites

Única escritura: este archivo. Sin cambios runtime, locales, políticas, Shopify, Linear, Figma o publicación. Investigación abierta de3tiendas, verificación legal directa en BCN, limitación explícita de acceso SERNAC/Lemoon. El coordinador integra el texto seleccionado y verifica su render; este documento es propuesta de copy/investigación, no aprobación jurídica ni evidencia de compra real.

## Seguimiento: características, medidas y talla sin duplicaciones

Consulta focal del 09-11-2026 por solicitud de simplificar los tabs de la PDP. Se abrieron y leyeron tres fichas de vendedores chilenos; se revisó su contenido HTML accesible, sin compras ni interacción con configuradores. Este seguimiento estudia organización editorial, no valida sus ofertas, medidas o afirmaciones clínicas.

| Referencia abierta | Presentación observada | Aplicación a Lemoon |
|---|---|---|
| [GMO, GN2001 Negro](https://gmo.cl/products/anteojos-opticos-gmo-gn2001-negro-8056597307345) | Separa detalles del armazón (material, forma, color y género) de tres medidas, cada una como etiqueta más valor en mm. | Mantener atributos en filas breves y separar dimensiones físicas de información de estilo. No copiar sus cifras ni opciones de cristales. |
| [Karün Chile, Orca Azul](https://www.anteojoskarun.cl/products/lentes-opticos-orca-azul) | Tiene una acción «Ver medidas» y un bloque de detalle separado. La imagen de medidas no expone cifras en el texto leído. Su descripción técnica y de uso es más extensa que la ficha breve de GMO. | Conservar una entrada reconocible a medidas y una ayuda opcional. No adoptar como objetivo su extensión ni sus afirmaciones de ajuste a múltiples rostros. No se verificaron los números dentro de su imagen. |
| [Black Optics, PM187](https://www.blackoptics.cl/productos/anteojo-pm187/) | La ficha técnica usa filas de tipo, talla, material, tres dimensiones e inclusiones. La guía amplía cómo comparar con otros anteojos y distingue su calce entre bisagras del código de tres números. | Separar datos del producto de instrucciones educativas. Sus rangos de talla responden a su propia clasificación y no se trasladan a Lemoon. |

### Diagnóstico de la fuente Lemoon

`lemoon-size-guide-content.liquid` divide la información en Medidas, Características y Talla y rostro. El tercer tab añade una introducción genérica y una nota orientativa alrededor de talla, ancho descriptivo y rostros sugeridos. `lemoon-frame-information.liquid` mantiene además un esquema educativo visible junto a todos los tabs. Esta combinación exige cambiar de tab para completar una ficha pequeña y repite la función de la ayuda de talla.

Precisión de la inspección: `lemoon-frame-dimensions.liquid` ya muestra filas A–E con etiquetas y valores en mm; no contiene las definiciones largas del locale. Las instrucciones completas pertenecen a la guía/modal. Evitar describir el problema como si la ficha de medidas actual incluyera esos cinco párrafos de definición.

### Adaptación editorial propuesta

- **Características:** una sola ficha de datos disponibles: Forma, Material, Peso, Público, Talla, Ajuste y Rostros sugeridos. Incorporar talla/ajuste/rostros a estas filas permite retirar el tab separado «Talla y rostro» sin eliminar información del catálogo. No repetir la recomendación genérica antes y después de la tabla.
- **Medidas:** conservar Ancho total, Ancho del cristal, Puente, Alto del cristal y Largo de patilla, con valores válidos en mm. Si se usa el esquema, mostrarlo aquí y relacionarlo con las mismas letras A–E; evitar un esquema fijo que parezca parte de Características.
- **Ayuda:** una acción «Guía de tallas» abre el modal existente. Las instrucciones para medir y comparar quedan dentro de esa ayuda, en vez de reiterarse en la ficha.
- **Orientación sobre rostros:** etiqueta breve «Rostros sugeridos». Solo si existe el dato puede acompañarse de «Orientación de estilo; las medidas te ayudan a comparar el ajuste». No implica comodidad, ajuste físico o adecuación clínica garantizados.
- **Receta:** si el dato es un booleano confirmado, «Admite receta», «No admite receta» o una fila breve equivalente; la lista de referencias de cristales no demuestra admisión. En situación indeterminada, «Por confirmar». La disponibilidad de tratamientos continúa en su flujo comercial, sin una explicación técnica larga en la ficha.

Las ausencias se omiten o conservan el estado breve de datos no disponibles. Mantener visibles los avisos de medidas de demostración y datos parciales; suprimir duplicaciones no autoriza a ocultar esos límites. No extraer milímetros de una talla textual como «Mediano (54-17-145)», ni clasificar S/M/L por rangos ajenos. Una descripción comercial ya existente no acredita medidas individuales ni sustituye el contrato JSON positivo de `custom.frame_dimensions`.

### Cobertura y límites de este seguimiento

Las tres fichas anteriores fueron abiertas, no solo buscadas. El lector web no pudo acceder al preview de Lemoon con `preview_theme_id=189893869736`; la comparación local proviene de los snippets y locales actuales, y la comprobación renderizada queda con el coordinador. No se utilizó Figma ni se verificaron imágenes o comportamiento responsive de los competidores. Los campos observados en la fuente no prueban que todos los productos del catálogo los tengan cargados. Este seguimiento solo añade investigación y copy propuesto a este archivo; la integración y su validación son tareas separadas del coordinador.
