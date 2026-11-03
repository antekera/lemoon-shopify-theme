# LEM-113 — Investigación de reembolso y retracto

Redacción R1 y acceso a fuentes: **01-11-2026**. Borrador original amplio para revisión; faltan hechos materiales. No publicación, integración ni cierre del ticket. Se trabajó después de LEM-119 y antes de LEM-114, sin iniciar otra cola.

## Base y alcance

Leídos brief completo, rol de copywriter, reglas, marca, borrador/research anteriores, policies-review-notes y commercial-test-data. Confirmados vía brief: catálogo completo con receta/montaje, hola@lemoon.cl y solo derechos legales. Las propuestas de 30 días, etiqueta gratis, 365 días y reembolso en 5–10 días no se adoptan. Los tokens **{{ razon_social }}** y **{{ rut_empresa }}** se mantienen; el RUT de prueba no se presenta como identidad real. Se preservan compras y compromisos anteriores.

## Referencias comerciales leídas el 01-11-2026

| Fuente exacta | Cobertura útil y límite |
| --- | --- |
| [GMO, términos](https://gmo.cl/pages/terminos-y-condiciones), [retornos](https://gmo.cl/pages/cambios-y-devoluciones), [garantías](https://gmo.cl/pages/garantias) | Separar información de derechos y logística. No adoptar formulario obligatorio, aprobación del retracto, tiempos de retiro ni beneficios propios. Cuerpo sustantivo leído vía web; HTTP adicional de garantías devolvió 429. |
| [RYK, garantía](https://www.ryk.cl/garantia.html), [términos](https://www.ryk.cl/terminos-de-servicio.html) | Ayuda a distinguir causas y categorías. No copiar boleta única, atención en sucursal, plazos ni condicionamientos de beneficios. La ruta de términos sirve contenido de privacidad y no se presenta como contrato independiente. |
| [Ben & Frank Chile, términos de uso](https://www.benandfrank.cl/terminos-y-condiciones-de-uso), [devoluciones/garantías](https://www.benandfrank.cl/devoluciones-y-garantias) | Se leyó contenido público incluido en los módulos de `__NEXT_DATA__`, aunque el extractor solo entregó shell. Identidad Lentes Galileo Chile SpA y ley chilena. Se usa su cobertura de retracto/restitución para organizar, sin copiar condiciones, beneficios ni identidad. |

La procedencia y las limitaciones de Ben & Frank, incluido el intento Casimiros no usado como política actual, se detallan en [investigación de términos](2026-10-31-terminos-y-condiciones-research.md). No se usó México y no fue necesario un comercio sustituto. Estas prácticas no son autoridad jurídica ni evidencia de Lemoon.

## Fuentes primarias, vigencia y mapa de afirmaciones

Reabiertas el **01-11-2026**, no heredadas como verificadas desde octubre:

- [BCN, Ley 19.496 refundida, DFL 3](https://www.bcn.cl/leychile/navegar?i=1160403), texto consolidado con Ley 21.398: art. 3 bis respalda 10 días desde recepción de bienes o desde contratación de servicios antes del inicio de su prestación; si falta la confirmación escrita exigida por el art. 12 A, el plazo se extiende a 90 días desde recepción del bien o desde contratación del servicio, respectivamente. En servicios se mantiene la condición de no inicio y la salvedad de exclusión válida, informada antes de contratar y pagar conforme al Decreto 52, arts. 5–6. No se presume que Lemoon celebre contratos de servicio separados. El art. 3 bis también respalda comunicación por los mismos medios, deterioro imputable, elementos de embalaje/valor previamente informado, crédito relacionado y devolución sin retención antes de 45 días desde aviso. Art. 12 A respalda confirmación íntegra. Arts. 20–21: seis meses, elección y restitución por garantía. Arts. 3, 4, 12, 16: preservar derechos y no convertir incumplimientos en arrepentimiento. Texto aplicable al corte; no usar la antigua redacción de idNorma=61438.
- [BCN, Decreto 52](https://www.bcn.cl/leychile/navegar?idNorma=1206144), publicado 27-08-2024, vigente al corte tras su transitorio de seis meses (BCN registra 28-02-2025): arts. 3, 4.1 y 4.3 distinguen garantía, inspección/uso y personalización real salvo incumplimiento; art. 5, servicios y comunicación de inicio; art. 6, aviso inequívoco y destacado junto a precio/características y previo a contratar/pagar. No basta política general.
- [BCN, Decreto 6](https://www.bcn.cl/leychile/navegar?idNorma=1165504), vigente desde 24-03-2022: arts. 10–11 y 13–15 respaldan información previa, total y derechos; no fijan matriz de retorno ni tiempos operativos del comercio.
- [SERNAC, garantía](https://www.sernac.cl/portal/604/w3-article-9161.html) y [comercio electrónico](https://www.sernac.cl/portal/604/w3-propertyvalue-20982.html): aperturas con timeout; extractos indexados usados solo como contraste auxiliar. No se reproduce la frase antigua de exclusión general del retracto que aparece en algunos resúmenes; O1 y Decreto 52 mandan.

Decisión editorial: detallar por separado retracto de bienes, servicios, productos personalizados, restitución, dinero, garantía e incumplimientos. No se afirma una excepción automática para todas las compras ópticas ni que cualquier elección de variante sea personalización. Los 45 días son un máximo legal de retracto y no un SLA general de garantía. El aviso no depende de aprobación previa y el tiempo no se reinicia al revisar el retorno.

## Pendientes del negocio y revisión aplicada

**[POR CONFIRMAR: domicilio y representante en identidad canónica; RUT real; dirección y destinatario del retorno, modalidades, recepción y costos de transporte diferenciados por causa]**.

**[POR CONFIRMAR: mecanismo real de reversa/transferencia por medio de pago, comprobante y seguimiento; productos intervenidos y avisos específicos previos; si montaje es servicio separado y cómo se notifica su inicio; fecha de vigencia]**.

No se asigna transporte universal gratuito ni universalmente pagado por el cliente; se preserva restitución de sumas sin retención de gastos y condiciones cómodas de garantía. La cláusula de no pedir códigos/contraseñas es una pauta de atención del candidato, no una auditoría de soporte existente. Revisar operacionalmente antes de integrar.

## Integración y aceptación restantes

El brief ubica la superficie anterior en `/pages/po`, con URL definitiva pendiente; el inventario previo registra `/pages/politicas`. Esa discrepancia exige verificar el destino canónico y redirecciones, sin inventar un nuevo handle como hecho. Enlaces entre drafts son editoriales relativos; retarget según índice. SEO propuesto: «Política de reembolso | Lemoon»; descripción: «Revisa cómo comunicar el retracto, coordinar una devolución y conocer los reembolsos que correspondan a tu compra en Lemoon».

Faltan confirmaciones, revisión jurídica de casos ópticos/servicios, revisión independiente, aprobación humana, integración editable y QA real. Sin cambios de tema, no se ejecutó Theme Check ni pruebas de storefront. La entrega documental y hashes se registran en el reporte común; no demuestra una reversa real ni capacidad de retiro.

## Comprobación adicional de acceso — 01-11-2026

Tras los timeouts de la herramienta web se obtuvo por HTTP directo cuerpo sustantivo del [especial SERNAC de garantía](https://www.sernac.cl/portal/618/w3-propertyvalue-8062.html) y de [comercio electrónico](https://www.sernac.cl/portal/604/w3-propertyvalue-20982.html), archivados y leídos. El especial confirma embalaje no exigible para garantía y conserva frases antiguas de retracto que no se adoptan frente al texto consolidado y al Decreto 52. La nota 9161 respondió 200 con 756 bytes, sin lectura sustantiva por esa descarga.
