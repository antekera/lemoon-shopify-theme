# LEM-119 — Investigación y consolidación de términos y condiciones

Revisión documental: **1 de noviembre de 2026**. Candidato completo para revisión humana; quedan datos materiales señalados. No constituye certificación jurídica, integración, publicación ni comprobación de la operación de la tienda.

## 1. Encargo, base y alcance

El usuario solicita la redacción completa, con referencias extranjeras adaptadas al contexto chileno, manteniendo formato, estructura y diseño de privacidad; pide continuar aun con dependencias y reunirlas al final. Se trabajó sobre la rama nueva `feat/lem-119-terminos-consolidados`, base `3f72c3762d600e984bde2a3bbcc70a6b8d39013a`. Solo se crean este documento y el [texto candidato](2026-11-01-terminos-y-condiciones-draft.md).

Se reutiliza íntegramente la cobertura del R3 anterior, conservado en el workspace hermano `lem-119-terms-copy/docs/content/2026-10-31-terminos-y-condiciones-draft.md` y su investigación. La entrega del comentario `2aee27d5-1495-426c-aa4b-502cda864784` de [LEM-119](https://linear.app/antekera/issue/LEM-119/shopify-terminos-y-condiciones) registra ese texto y sus decisiones. La revisión de aquel borrador no aprueba por sí sola esta revisión.

Se leyeron AGENTS.md, las cuatro reglas compartidas de `.claude/rules/`, `.codex/agents/lemoon-copywriter.toml`, `docs/design/brand-guidelines.md`, `docs/agents/brand-guidance.md`, `docs/content/policies-review-notes.md`, `commercial-test-data.json`, el borrador y la investigación de privacidad, el inventario de páginas y sus asignaciones. Las reglas visuales y los componentes quedan intactos.

## 2. Referentes extranjeros abiertos y leídos

Acceso: **01-11-2026**. Warby Parker y Ace & Tate están registrados como referentes principales en `docs/design/design-prompt.md`; `docs/design/section-inventory.md` añade Zenni, Clearly y Zeelool. Se priorizan los dos principales; no se atribuye lectura nueva a los otros tres.

| Referencia exacta | Contenido leído y aporte editorial | Adaptación y límites |
| --- | --- | --- |
| [Warby Parker — Terms of Use](https://www.warbyparker.com/terms-of-use) | Alcance, títulos numerados, selección del armazón, receta, datos de entrega, pago y remisiones a ayuda. Ofrece un recorrido por la compra comprensible junto al contenido jurídico. | Se conserva el recorrido producto → receta → pedido → pago → entrega → atención. No se importan su arbitraje obligatorio, edades, ley estadounidense, plazos, conservación de recetas ni consentimiento por uso. |
| [Ace & Tate — Terms & Conditions, GB](https://www.aceandtate.com/gb/legal/terms-and-conditions) | Pedidos, confirmación, receta, precios/pagos y separación de condiciones de promociones; la página identifica edición septiembre de 2026. | Sirve para separar etapas y componentes de la oferta. No se importan límites de edad o antigüedad de recetas, exoneraciones, cargos, impuestos extranjeros, envío gratis ni beneficios propios. La aceptación/captura de Lemoon requiere su propia definición. |

Las rutas inicialmente intentadas de Ace & Tate `/gb/terms-and-conditions` y `/gb/terms-conditions` resultaron inaccesibles; la búsqueda permitió localizar y abrir la ruta oficial `/gb/legal/terms-and-conditions` con cuerpo sustantivo. No se usaron PDFs antiguos como si fueran la versión vigente.

## 3. Adaptación mediante tiendas chilenas

Tres tiendas con venta online de lentes y contenido sustantivo abierto el **01-11-2026**. Son referencias de temas y claridad; sus prácticas no son autoridad jurídica ni reglas de Lemoon. La investigación previa también cubría RYK y Ben & Frank Chile; no se reclama una nueva lectura de esos sitios en esta revisión.

| Tienda y URL exacta | Cobertura útil | Decisión para Lemoon |
| --- | --- | --- |
| [GMO — Términos y condiciones](https://gmo.cl/pages/terminos-y-condiciones) | Generalidades, identidad, comunicaciones, libertad de navegación, aceptación y compra. | Presentar vendedor, contacto y formación del contrato de manera diferenciada; explicar que navegar no obliga a comprar. No copiar identidad, validaciones, métodos de pago o promesas. |
| [Schilling — Términos y condiciones](https://www.schilling.cl/terminos-y-condiciones) | Identidad/representante, contacto, receta y privacidad, cuenta, pasos de compra, total y entrega. | Distinguir datos de receta, cuenta y pedido, y detallar qué revisar antes de pagar. No importar contraseñas propias, atención presencial, consentimiento general, ni aplicación automática de normativa clínica. Su texto contiene formulaciones diferentes sobre aceptación por uso y navegación libre: no trasladarlas. |
| [OPV — Institucional, garantías y retracto](https://opv.cl/pages/institucional) | Índice de políticas, distinción entre garantías propias y legales, triple opción, retracto y lentes graduados. | Separar derechos sobre productos y servicios, y personalización frente a producto estándar. No importar beneficios voluntarios, evaluación previa obligatoria ni exclusiones generales. La página muestra referencias históricas de tres meses en una parte y otras reglas en otra: se aplica la fuente oficial, no el plazo del competidor. |

No se copian frases, contactos, identidades, cantidades, condiciones comerciales ni procedimientos de esos sitios. La redacción sigue siendo original y específica para el catálogo confirmado de Lemoon.

## 4. Fuentes oficiales y corte normativo

Consultadas nuevamente el **01-11-2026**. Se abrió y leyó el cuerpo normativo de BCN. Las normas acreditan derechos y deberes, no el cumplimiento real de los flujos de Lemoon. Se distingue la garantía del producto del régimen de servicios y se evita reducirlos a una única regla.

| Fuente oficial | Vigencia y lectura relevante | Uso en el candidato |
| --- | --- | --- |
| [BCN — DFL 3, texto refundido de Ley 19.496](https://www.bcn.cl/leychile/navegar?i=1160403) | Publicado 31-05-2021; texto consolidado leído con modificaciones de Ley 21.398. Arts. 3, 3 bis, 4, 12, 12 A, 16, 20, 21, 28 B, 30 y 41. | Derechos irrenunciables, información/consentimiento, confirmación íntegra, respeto del contrato, retracto y garantía, comunicaciones y servicios. |
| [BCN — Decreto 6, Reglamento de Comercio Electrónico](https://www.bcn.cl/leychile/navegar?idNorma=1165504) | Publicado 23-09-2021; vigente desde 24-03-2022. Arts. 6–7, 9–15 y 18. | Identificación y representante del vendedor, canal de entrada/salida, características, costo total, stock y plazo de entrega antes de contratar. |
| [BCN — Decreto 52, exclusiones del retracto](https://www.bcn.cl/leychile/navegar?idNorma=1206144) | Publicado 27-08-2024; vigente al corte. Arts. 3–6. | Personalización realmente realizada según instrucciones, preservación de garantía, servicios y aviso de inicio; exclusiones destacadas junto al precio/características. |
| [BCN — Ley 21.719](https://www.bcn.cl/leychile/navegar?idNorma=1209272) | Publicada 13-12-2024; art. primero transitorio difiere las modificaciones al 01-12-2026. | Revisar nuevamente privacidad y los tratamientos antes de una publicación que alcance esa fecha. No presentar el régimen futuro como vigente el 01-11-2026. |

### Comprobación expresa de cifras y condiciones sensibles

- Retracto: art. 3 bis y Decreto 52 respaldan 10 días desde recepción para bienes; extensión a 90 por falta de confirmación escrita en los supuestos legales; restitución sin retener gastos antes de 45 días desde comunicación. Para servicios: desde contratación y antes del inicio; devolución limitada a cantidades que no correspondan a servicios ya prestados.
- Garantía: arts. 20–21 respaldan la elección entre reparación, cambio y devolución en los casos legales de productos nuevos, seis meses desde recepción y reglas de suspensión. No se exige reparación previa ni embalaje como condición general de garantía.
- **Artículo 41:** el cuerpo vigente abierto dice **30 días hábiles**, no 90, desde término del servicio o entrega del bien reparado. Se mantiene el número de R3 y la consecuencia ordenada por tribunal: nueva prestación sin costo o, en su defecto, devolución. No es una garantía voluntaria ni una elección automática idéntica a la del producto.
- Exclusiones: Decreto 52 art. 4 N° 3 incluye anteojos elaborados/intervenidos conforme a instrucciones, salvo incumplimiento de estas. No excluye cualquier armazón por pertenecer al rubro óptico. El art. 6 exige advertencia previa destacada que utilice «derecho a retracto»; no basta esconderla en estos términos.

### Limitaciones de acceso a SERNAC

Se buscaron sus recursos oficiales y se intentó abrir [comercio electrónico](https://www.sernac.cl/portal/604/w3-propertyvalue-20982.html), [garantía legal](https://www.sernac.cl/portal/604/w3-propertyvalue-8062.html), la [ruta de Protección](https://www.sernac.cl/portal/618/w3-propertyvalue-8062.html), [explicación de la garantía](https://www.sernac.gob.cl/portal/617/w3-article-57424.html) y [fiscalización del comercio electrónico](https://www.sernac.gob.cl/portal/604/w3-article-89178.html). El navegador de investigación devolvió timeout, también en dominios alternativos. Los resultados de búsqueda coincidían en seis meses/triple opción y retracto de diez días; no se presentan como lectura del cuerpo. La base normativa utilizada es el texto sustantivo de BCN abierto. El intento adicional de la noticia de Gob.cl devolvió 403. La revisión independiente puede comprobar esos recursos por otra vía.

## 5. Hechos de Lemoon y procedencia

| Hecho o decisión | Evidencia utilizada | Límite |
| --- | --- | --- |
| Oferta: armazones, lentes de sol, accesorios, cristales graduados y montaje con receta. | Decisión del responsable registrada en LEM-119 y R3. | No acredita SKU, precio, componentes incluidos, stock, graduaciones o capacidad de fabricación. |
| Contacto público `hola@lemoon.cl`; comunicaciones necesarias de pedidos por correo indicado al comprar. | Decisiones de LEM-119, R3 y política de privacidad conservada en esta base. | Configuración de correo no demuestra entrega real ni confirmación contractual íntegra. |
| Solo derechos legales; no beneficios voluntarios nuevos. | Decisión expresa del responsable registrada en LEM-119. | No importar 30 días de satisfacción, 365 de garantía, envío gratis, tarifas o SLAs de muestras. No elimina compromisos previos válidamente adquiridos. |
| Receta informativa, imagen/documento o ingreso manual; lectura IA opcional con revisión/confirmación expresa. | Definiciones confirmadas incorporadas al R3 y a privacidad. | No diagnostica ni valida clínicamente; requiere información y autorización aplicable. Proveedor y operación real pendientes de comprobar. |
| VR orientativa, procesamiento temporal exclusivamente local cuando se habilite. | Definición confirmada del responsable reflejada en privacidad. | Requisito operativo; no prueba de despliegue o ausencia técnica de transmisión. |
| Pagos externos; equipo/backoffice no recibe números completos, CVV o credenciales. | Definición confirmada reflejada en R3 y privacidad. | Se conservan referencias mínimas, importes y estados según existan; no se declara ausencia de todo dato de pago ni se exonera a Lemoon. |
| Identidad todavía pendiente. | Último R3 usa marcadores legibles; la investigación de privacidad registra igual decisión. | Los campos creados y el RUT ficticio `00.000.000-0` no verifican identidad. No se repone una razón social histórica contra los marcadores actuales. |

Se intentó abrir [la página pública de términos](https://lemoon.cl/pages/terminos-y-condiciones); el navegador respondió error de acceso. No se comprobó su contenido, checkout, footer, stock ni políticas publicadas en vivo. El antecedente de publicación de privacidad procede del documento del proyecto, sin una nueva verificación de Admin en este trabajo.

`policies-review-notes.md` es histórico y contiene un escenario demo autorizado anteriormente. Sus datos no son condiciones actuales. `commercial-test-data.json` tampoco prueba operación, identidad, tiempos, tarifas ni retención.

## 6. Formato, enlaces y metadatos de integración

Se mantiene el patrón del borrador de privacidad: título único, fecha de entrada en vigor inmediatamente debajo, introducción breve, 16 apartados numerados, párrafos de lectura continua y enlaces con nombre significativo. Los 16 temas jurídicos conservan el desarrollo de R3. No se altera diseño, plantilla, renderer, CSS, locales ni configuración.

Los enlaces ya no apuntan a archivos Markdown ajenos ausentes de esta rama. Se usan destinos registrados en el repositorio, **sin atribuirles comprobación pública actual**:

| Enlace del candidato | Evidencia local y validación pendiente |
| --- | --- |
| `/pages/politica-de-privacidad` | `templates/page.politica-de-privacidad.json` y `sections/footer.liquid`: wrapper de privacidad que reutiliza la política nativa. El footer lo usa solo si está publicado y tiene ese template; en otro caso utiliza `shop.privacy_policy.url`. Verificar asignación, publicación y coincidencia con `/policies/privacy-policy`. |
| `/pages/envios-y-entregas` | `docs/design/page-inventory.md` y `docs/content/page-template-assignments.json`, LEM-114. Verificar contenido definitivo y respuesta pública. |
| `/pages/politicas` | Mismo inventario y asignaciones, LEM-113, template `page.politica-de-devoluciones.json`. Verificar título, política propietaria y evitar duplicado/conflicto con política nativa de reembolso. |
| `/pages/garantias` | Mismo inventario y asignaciones, LEM-115. Verificar contenido definitivo y respuesta pública. |

Ruta del encargo: `/pages/terminos-y-condiciones`. Título SEO propuesto: **Términos y condiciones | Lemoon**. Descripción propuesta: **Conoce las condiciones de compra en Lemoon, los derechos de retracto y garantía legal y cómo contactarnos por tu pedido.** La integración debe evitar repetir el H1 si lo muestra la sección.

## 7. Hallazgos y datos necesarios para cerrar la versión publicable

Los siguientes puntos no detuvieron la redacción. Permanecen en LEM-119 o en sus superficies propietarias; no se crean tickets duplicados ni se presume que el checklist sustituya decisiones comerciales.

1. **Identidad:** razón social exacta, RUT tributario real, domicilio legal completo y representante legal. Los cuatro marcadores del texto deben completarse con datos aprobados y coherentes con tienda/privacidad. LEM-143 concentra su preparación para go live.
2. **Formación del contrato:** acción exacta para enviar la orden, aceptación frente a acuse, autorización frente a captura/cargo, y contenido/medio de confirmación íntegra. Sustituir el marcador de sección 7 tras contrastar checkout y notificaciones reales; no inventar un momento contractual desde el flujo de otro vendedor.
3. **Vigencia:** fecha de entrada en vigor aprobada para esta revisión. La fecha del borrador o la de privacidad no autoriza asignar vigencia automáticamente a términos.
4. **Oferta real por configuración:** componentes e inclusiones por SKU; medidas, cristales, tratamientos y montaje; datos necesarios de receta, revisión autorizada, corrección y disparador de elaboración. Documentar qué ocurre si la receta se entrega después del pago, sin alterar unilateralmente el contrato.
5. **Medios de pago:** proveedores y modalidades efectivamente habilitados, cuotas/costos si existen; manejo de rechazo, duplicidad, reversa y reembolso, con evidencia del flujo. El candidato no promete una pasarela ni cuotas determinadas.
6. **Despacho:** cobertura, modalidades, costos, disponibilidad y plazos reales, distinguiendo preparación/elaboración y transporte, inicio de cómputo y días hábiles/corridos. Cerrar en LEM-114 y reflejar condiciones previas al pago.
7. **Retorno y reembolsos:** dirección real de devoluciones y si coincide con domicilio legal; procedimiento, logística y costos por causa; medios y ejecución de devolución de dinero. Cerrar en LEM-113/LEM-114 y el proceso LEM-49, sin condicionar la comunicación del retracto a una autorización.
8. **Excepciones concretas:** decidir y revisar jurídicamente cuáles productos se confeccionan conforme a especificaciones; si se comunica alguna exclusión, implementar el aviso de Decreto 52 junto a precio/características, con accesibilidad. No basta la sección 11 ni se excluye todo el catálogo óptico.
9. **Garantías y servicios:** pasos reales y antecedentes que permitan acreditar compra; constancia escrita del plazo de responsabilidad del trabajo; compatibilidad de producto y montaje. Cerrar en LEM-115 sin imponer reparación obligatoria, foto o caja como requisitos generales.
10. **Privacidad operativa:** comprobar proveedores de receta/IA, autorización y confirmación de valores, acceso, conservación y eliminación; arquitectura local de VR, pagos, comunicaciones y consentimiento. Conservar coherencia con privacidad; texto aprobado no es evidencia técnica. Revisar Ley 21.719 si se publica desde el 01-12-2026.
11. **Coherencia entre superficies:** retirar o corregir muestras/promesas comerciales contradictorias donde aparezcan antes de go live, preservando derechos de compras previas. Verificar fichas, carrito, checkout, emails, footer y otras políticas contra las decisiones aprobadas.
12. **Integración y aceptación:** cargar texto editable sin marcadores pendientes, resolver H1/metadata y enlaces, comprobar escritorio/móvil/tablet, teclado y lectura. Revisión editorial independiente de esta edición, revisión jurídica chilena de aplicación concreta y aprobación humana del resultado final antes de publicación. Esta fase documental no demuestra esos controles.

## 8. Cambios respecto del R3 recuperado y comprobación documental

Se conservan los 16 apartados desarrollados. Se coloca la vigencia bajo el título como en privacidad, se elimina la fecha repetida al pie, se reemplazan enlaces `.md` por las rutas registradas y se simplifica «equipo y backoffice» a «equipo» para evitar detalles internos en la página. Se mantienen los marcadores materiales y los derechos legales, incluido **30 días hábiles** del art. 41 comprobado en BCN.

Las referencias extranjeras ahora quedan abiertas, comparadas y registradas expresamente junto con tres tiendas chilenas. No se modifica el original del workspace hermano ni se trasladan sus aprobaciones a esta edición. La revisión y los hashes finales corresponden a la entrega del coordinador. No se ejecutan pruebas de tema para estos dos Markdown; no hay cambios de código, commit, push ni publicación por este autor.


## Revisión de vigencia y canales de reclamo — 4 de noviembre de 2026

Se eliminó de la sección 16 la repetición del correo, SERNAC y tribunales: el contacto del vendedor ya figura en la sección 2 y los canales para consultas y reclamos también están descritos en la Política de reembolso. El Decreto 6/2021 exige informar un soporte de contacto y poner los términos a disposición antes de contratar; no exige duplicar esos canales en un apartado numerado separado. Se conserva una regla de vigencia que aplica cambios a compras posteriores a su publicación, respeta para cada compra las condiciones informadas y aceptadas al contratar y no limita derechos legales. Fuentes vigentes consultadas: [DFL 3, texto refundido de la Ley 19.496](https://www.bcn.cl/leychile/navegar?idNorma=1160403), arts. 12 y 12 A; [Decreto 6/2021, Reglamento de Comercio Electrónico](https://www.bcn.cl/leychile/navegar?idNorma=1165504), arts. 15 y 16.
