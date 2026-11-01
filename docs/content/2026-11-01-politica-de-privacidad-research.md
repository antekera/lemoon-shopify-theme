# LEM-118 — Investigación de privacidad

## Estado de entrega — 01-11-2026

La revisión R4 fue aprobada expresamente por el titular y cargada en la política nativa de Shopify. Se comprobó el contenido guardado mediante API y en el preview local. Posteriormente, por instrucción del titular, se sustituyeron los tres tokens de identidad por **[RAZÓN SOCIAL POR COMPLETAR]**, **[RUT POR COMPLETAR]** y **[DOMICILIO LEGAL POR COMPLETAR]**, y se mostró **Fecha de entrada en vigor: 1 de noviembre de 2026** bajo el título, sin repetirla al final. Lectura posterior: `ShopPolicy/40676294824`, `updatedAt: 2026-11-01T17:59:37Z`; no quedaron variables Liquid en su cuerpo.

El borrador adjunto conserva esta última versión como referencia de contenido, con enlaces de navegación públicos. Los apartados R1–R4 siguientes conservan la trazabilidad histórica: sus declaraciones de «no publicado», tokens o fecha pendiente quedan sustituidas por este estado de entrega. No significan que el resto de políticas haya sido publicado ni que los flujos de recetas, VR, pagos o analítica hayan sido certificados.

El checklist [LEM-143](https://linear.app/antekera/issue/LEM-143) permanece en Todo: antes del go live deben completarse los datos legales reales, conectar su origen central y verificar inventario de proveedores, consentimiento, conservación/borrado y los demás requisitos registrados. El ajuste del tema en este PR comparte una columna centrada, cuerpo 1.6rem/1.6 y subtítulos compactos para políticas nativas y páginas legales CMS, sin cambiar sus contenidos propios ni deducir fechas de modificación.

R1, corte legal y consultas **01-11-2026**. Quinta página de la secuencia. Borrador amplio con hechos operativos pendientes; no política lista para publicar ni declaración de cumplimiento. Lectura del rol, reglas, marca, notas previas y brief se documentó en la investigación de términos del trabajo de LEM-119, conservada en su workspace. Se contrastó además la guía canónica de marca del checkout principal indicada por el coordinador; no mostró diferencias con la guía local.

## Hechos conocidos y grado de evidencia

Usuario vía brief: catálogo completo con cristales graduados/montaje, contacto hola@lemoon.cl, solo derechos legales. Shopify es plataforma de comercio; identidad usa campos editables ya creados. Tokens **{{ razon_social }}** / **{{ rut_empresa }}** conservados; RUT inicial ficticio. Configuración Email only y remitente admin autenticado aportada por coordinador, sin comprobar entrega real. No se accedió a Admin, apps, pedidos ni recetas de personas.

Notas del 10-10 describen una política nativa automatizada con menciones de contraseñas y teléfono vacío, y un escenario sintético. Son antecedentes históricos, no inventario actual. commercial-test-data propone receta 90 días, cookies/botones y acceso limitado: es demo y no acredita flujo, proveedores, seguridad, consentimiento o borrado. El borrador no convierte esas propuestas en prácticas. No se presupone prestación clínica por vender lentes ni aplicación automática de reglas sanitarias a una operación no identificada.

## Competidores: páginas sustantivas leídas el 01-11-2026

| URL exacta | Cobertura y decisión editorial |
| --- | --- |
| [GMO, privacidad](https://gmo.cl/pages/politica-de-privacidad) | Web entregó cuerpo: categorías/finalidades, salud, destinatarios, transferencias y conservación. Se toma el mapa de temas, sin incorporar empresas, tratamientos médicos, fundamentos ni garantías de seguridad del grupo. HTTP adicional respondió 429; no se atribuye lectura a esa respuesta. |
| [RYK, privacidad](https://www.ryk.cl/politicas-privacidad.html) y [términos](https://www.ryk.cl/terminos-de-servicio.html) | Ambas muestran contenido de privacidad con recetas, navegación, comunicaciones y conservación. No trasladar consentimiento general, finalidades extensas ni retención indefinida. |
| [Ben & Frank Chile, privacidad](https://www.benandfrank.cl/politica-de-privacidad) y [términos de uso](https://www.benandfrank.cl/terminos-y-condiciones-de-uso) | Cuerpo sustantivo leído desde HTML/módulos públicos embebidos `render__ogEF9-HQrvt7.js` y `render__Aa5WM-mC3Yfp.js`, con responsable chileno. Sirve para separar finalidades, cookies y derechos. No importar consentimiento por uso ni catálogo de derechos/bases como si definiera por sí mismo la ley chilena vigente. |

La política de privacidad y los términos chilenos de Ben & Frank contienen formulaciones distintas respecto de comunicaciones/transferencias: razón para revisar coherencia entre páginas, no afirmación de su operación real. No se usaron páginas mexicanas, PROFECO, autoridad mexicana ni identidad extranjera para el texto chileno. No fue necesaria sustitución. Archivos públicos y método de extracción en evidencia común; lectura documental no es render visual ni auditoría de su cumplimiento.

## Fuentes oficiales reabiertas y vigencia

| Fuente exacta, consulta 01-11-2026 | Regla y mapeo |
| --- | --- |
| [BCN, Ley 19.628](https://www.bcn.cl/leychile/navegar?idNorma=141599) | Cuerpo del régimen previo a reforma: art. 2 g, datos sensibles/salud; art. 4, autorización legal o consentimiento informado/escrito, finalidad y comunicación, revocación sin retroactividad; arts. 6–9, cancelación/corrección/bloqueo, secreto, mandato y finalidad; art. 10, condiciones especiales de datos sensibles; art. 11, diligencia; arts. 12–13, derechos/supuestos/gratuidad; art. 16, tutela judicial tras dos días hábiles sin pronunciamiento o denegación en supuestos legales. Respaldan secciones de receta, finalidad, resguardo, retención y derechos. No se afirma «interés legítimo» o ejecución contractual como un catálogo general nuevo de bases legales ya vigente. |
| [BCN, Ley 21.719](https://www.bcn.cl/leychile/navegar?idNorma=1209272) | Publicada 13-12-2024; artículo primero transitorio mantiene regla del primer día del mes vigésimo cuarto posterior. Texto abierto con modificaciones transitorias posteriores: la fecha general se distingue de disposiciones preparatorias. No se presenta el procedimiento de la nueva Agencia, portabilidad ni nuevas reglas como marco general aplicable al 01-11. |
| [BCN, balance Ley 21.719](https://www.bcn.cl/balance-legislativo/detalle/ficha_LEY_21719_2024-12-13) | Abierto y leído: confirma publicación 13-12-2024 y entrada general 01-12-2026. Revalidar antes de publicar y al entrar en vigor; proyectos o noticias de postergación no cambian por sí solos el texto legal. |
| [BCN, Ley 19.496 refundida](https://www.bcn.cl/leychile/navegar?i=1160403) | Arts. 3, 4, 12, 16 y 28 B: información, no renuncia, respeto contractual y suspensión de comunicaciones publicitarias solicitada. Separación de correos transaccionales y promociones no autoriza usos nuevos. |
| [BCN, Decreto 6](https://www.bcn.cl/leychile/navegar?idNorma=1165504) | Vigente desde 24-03-2022; art. 7, identidad y medios de contacto. No acredita identidad tributaria, configuración del banner o inventario real. |

Las normas son fuentes primarias; las categorías de la tabla del draft son un modelo editorial condicionado a los flujos reales, no hechos verificados de todos los campos activos. Receta contiene potencialmente salud: no se presume la excepción de beneficios de salud ni consentimiento por compra. Plazo judicial de dos días hábiles no se convierte en promesa operativa de borrado completo. No se fija retención por ley con números no revisados ni se importa la propuesta sintética de 90 días.

## Desconocidos materiales consolidados

**[POR CONFIRMAR: identidad tributaria real y domicilio del responsable; inventario de campos/formularios/cuentas/checkout y visibilidad de pago; propósitos, fundamento y mecanismo de autorización real por tratamiento]**.

**[POR CONFIRMAR: canal y flujo de receta, responsables/revisores, accesos, vínculo cliente/pedido, almacenamiento, proveedores/laboratorio si existe, versiones y reutilización, retención y borrado en copias; tratamiento de datos de terceros o menores y representación aplicable]**.

**[POR CONFIRMAR: entidades y funciones reales de plataforma, pagos, correo, almacenamiento, montaje, transportes y apps; países de tratamiento/transferencias; eventuales perfiles/decisiones automatizadas]**.

**[POR CONFIRMAR: inventario cookies/tecnologías con duración, finalidades y proveedores, bloqueo previo y preferencias reales; suscripción/baja; tiempos/criterios de conservación por categoría; verificación proporcional de identidad y ejecución de derechos; medidas/incidentes reales; fecha de vigencia]**.

No se inventan certificaciones, cifrado, controles técnicos, ausencia de filtraciones o transferencias. Las reglas de no enviar códigos, separar finalidades y usar datos limitados son propuestas normativas para el candidato y deben contrastarse con la operación; no describen una auditoría realizada.

## Integración y revisión restantes

Destino requerido por brief: política nativa `/policies/privacy-policy`, sin duplicación CMS. SEO propuesto: «Política de privacidad | Lemoon»; descripción «Conoce el uso de datos de compras y recetas, las preferencias de navegación y cómo ejercer tus derechos de privacidad en Lemoon». Los enlaces internos relativos deben convertirse conforme al mapa del índice y validarse; contacto mailto confirmado.

Verificar datos con LEM-140/24 y política/cookies LEM-95, sin ejecutar esos tickets. Hay dependencia real de inventario y procesos, no se resuelve redactando una garantía genérica. Faltan revisión independiente/jurídica chilena, aprobación humana, integración editable y pruebas reales de preferencias, consentimiento, acceso y eliminación. No se ejecutaron tests de tema ni datos personales reales; corte futuro obliga a revalidar el régimen antes de integrar/publicar. Evidencia y hashes en reporte común.


## R2 — Ampliación solicitada por el usuario el 01-11-2026

Se amplía el borrador a **16 secciones numeradas**. El inicio presenta privacidad y confianza antes de identificar responsable y tratamientos; se evita el párrafo genérico de Shopify que comienza «Lemoon opera esta tienda». Se mantienen los tokens editables de identidad, los desconocidos materiales en negrita y el destino de política nativa. No se modifica tema, CMS, Shopify, tracking ni estados de tickets.

### Referentes abiertos nuevamente

| Fuente, acceso 01-11-2026 | Aprendizaje incorporado y límites |
| --- | --- |
| [OPV — Institucional, Política de privacidad](https://opv.cl/pages/institucional#politica-de-privacidad) | Se leyó el índice y contenido de privacidad, actualizado allí al 06-02-2026: introducción, origen, categorías, fines, terceros/países, conservación, seguridad, derechos y contacto. Se adopta una estructura progresiva con encabezados claros; no se copia prosa, identidad, grupo empresarial, tratamientos de salud ni legitimaciones extranjeras o futuras. Su sección de prueba virtual remite a un aviso específico: no demuestra arquitectura local en Lemoon. |
| [RYK — Política de privacidad](https://www.ryk.cl/politicas-privacidad.html) | Se leyeron categorías, finalidades, receta reservada, seguridad, derechos y cookies. Sirve para dar espacio propio a recetas y comunicaciones. No se importan consentimiento por navegar, acceso amplio, reutilización abierta de recetas, proveedores/GTD ni derechos de una reforma como si ya rigieran. |
| [GMO — Política de privacidad](https://gmo.cl/pages/politica-de-privacidad) | Se reabrieron fines, destinatarios, conservación y derechos. Se adopta la separación temática entre proveedores, finalidades y protección; no sus plazos de diez años, afiliadas, países, garantías de seguridad, bases generales ni futura Agencia como vía ya operativa. |

Las tres fuentes se abrieron con contenido sustantivo, no solo resultados de búsqueda. La política pública de Lemoon en https://lemoon.cl/policies/privacy-policy no fue accesible mediante Web en esta revisión. El usuario identifica el texto genérico visible en el preview; no se atribuye una inspección del cuerpo público a esa respuesta fallida.

### Verificación legal actualizada

- [BCN — Ley 19.628, versión previa a la reforma](https://www.bcn.cl/leychile/navegar?idNorma=141599&idVersion=2023-05-09): la URL general devolvió un aviso técnico y la consulta con fecha 01-11-2026 falló; esta versión sí entregó los arts. 2, 4 y 6–16. Definición amplia de tratamiento, sensibilidad de salud, finalidad, reserva, diligencia y derechos sustentan la cautela del borrador. La ausencia de almacenamiento en un servidor no equivale a ausencia de tratamiento cuando hay procesamiento local. La versión histórica se utiliza junto con la ley de reforma y su entrada en vigor, sin ocultar la limitación de acceso.
- [BCN — Ley 21.719](https://www.bcn.cl/leychile/navegar?idNorma=1209272), cuerpo abierto, y [balance legislativo oficial](https://www.bcn.cl/balance-legislativo/detalle/ficha_LEY_21719_2024-12-13), que confirma entrada general el **01-12-2026**. No se anticipan nuevas vías/procedimientos al corte del 01-11.
- [BCN — DFL 3, Ley del Consumidor, art. 28 B](https://www.bcn.cl/leychile/navegar?i=1160403): abierto el artículo sobre identificación, vía válida/expedita y suspensión de publicidad por correo y mensajería o llamadas. Se separan avisos necesarios de pedido y publicidad; la baja comercial no se usa como renuncia a atención ni la atención como excusa para continuar promociones.

### Decisiones del usuario y precisión de las cláusulas

1. **Receta:** usuario solicita almacenamiento seguro, informativo y sin acceso ajeno. Se redacta finalidad de referencia informativa para configuración/pedido, reserva y acceso restringido. «Nadie más tiene acceso» sería incompatible con la gestión por personal autorizado, proveedores de infraestructura y eventuales requerimientos legales. No se afirma que la receta nunca se procese ni se envíe a un proveedor. No se inventa plazo de 90 días, certificación ni revisión clínica. La exclusión de marketing/entrenamiento se formula con exigencias de autorización/fundamento, sin certificar flujos existentes.
2. **Prueba virtual:** se redacta una modalidad exclusivamente local: imagen y ajustes temporales en el dispositivo, sin recepción/almacenamiento en servidores ni comunicación a terceros. La cláusula lleva **POR CONFIRMAR ANTES DE PUBLICAR** por ausencia de verificación técnica de una función habilitada. «No procesamos datos» se sustituye por procesamiento local, no remoto. El alcance se limita a cámara/rostro; no niega navegación técnica, capturas del usuario ni toda actividad de red del sitio. No se garantiza que solo una persona pueda ver la pantalla de su dispositivo.
3. **Correo y celular:** se recogen los datos que la persona entrega, no contenido de su correo, libreta de contactos o teléfono. Se separan finalidades transaccionales y comerciales, autorizaciones por canal cuando correspondan y suspensión gratuita de promociones. Se explicita que SMS/WhatsApp no se declaran activos sin comprobación.
4. **Cookies:** usuario propone todas activas al visitar, con configuración/eliminación posterior. Se registra como **preferencia propuesta pendiente de revisión legal y técnica**, no como configuración ejecutada ni autorización por mera navegación. El borrador distingue necesarias y opcionales, consentimiento previo cuando corresponda, retiro hacia futuro y borrado por navegador; no afirma que Preferencias elimine todas las cookies o registros ya creados. Esta edición no activa herramientas ni cambia tracking.

### Hallazgos técnicos aportados por el coordinador; alcance de evidencia

El coordinador inspeccionó código, sin datos personales reales y sin acreditar despliegue:

- Tema `assets/lemoon-cookie-preferences.js`: lectura `currentVisitorConsent` y escritura `setTrackingConsent`, categorías `analytics`, `marketing`, `preferences`; botones aceptar/rechazar/guardar en el footer. No prueba activación inicial de todas ni eliminación de cookies existentes; no auditoría de scripts externos/apps.
- No se encontró implementación de prueba virtual en los assets inspeccionados del tema activo ni del worktree LEM-119. El texto de procesamiento local es una propuesta condicionada, no una certificación de runtime.
- Admin PR #9 incluye `services/api/src/ai/gemini-prescription-provider.ts` (`GeminiPrescriptionProvider.extract`, envío de `inlineData`) y worker que lee el bucket de recetas. El código de infraestructura contiene `BLOCK_ALL`, `S3_MANAGED` y hay controles `requirePermission`; no acreditan permisos efectivos, destinatarios, uso de IA ni seguridad de una instalación real. Si la extracción IA está habilitada, hay tratamiento externo que debe describirse, no ocultarse con «nadie más».

### Pendientes de aceptación de esta ampliación

La propuesta ya incluye la estructura y las cuatro áreas solicitadas. Para versión publicable faltan identidad/domicilio, inventario real y fundamento/autorización por flujo, operadores y proveedores de recetas (incluida IA si se habilita), retención/borrado, prueba técnica VR y cookies, ejecución de bajas/derechos y fecha de vigencia. Se requiere revisión independiente del delta y revisión jurídica chilena según corresponda; no se declara cumplimiento ni producción lista. No se publicaron cambios ni se hicieron pruebas con recetas o datos reales.


## R3 — Hechos confirmados y decisiones operativas del usuario, 01-11-2026

Esta sección **actualiza y sustituye los pendientes R1/R2 que el usuario resolvió**; las secciones anteriores se mantienen como historial de investigación, no como solicitudes repetidas de confirmación. Cambios limitados al borrador y esta investigación; sin código, publicación, datos reales, cambios de tracking ni llamadas a servicios de recetas.

### Hechos y alcance incorporados

| Tema | Decisión confirmada e incorporación |
| --- | --- |
| Identidad | Tres variables acordadas para alimentar desde Shopify: **{{ razon_social }}**, **{{ rut_empresa }}**, **{{ domicilio_legal }}**. Se sustituye el placeholder de domicilio por el token; no se rellenan valores reales ni se presume una integración ya implementada. El coordinador crea el seguimiento de salida a producción. |
| Compra y pagos | Se conservan datos de persona, pedido, productos y características, receta, direcciones de despacho/facturación y referencias mínimas de transacción cuando existen. Equipo/backoffice no recibe ni almacena números completos de tarjeta, CVV o credenciales de pago; los trata el proveedor de pagos. Se evita «no guardamos ningún dato de pago», que negaría referencias e importes legítimos del pedido. |
| Finalidad e infraestructura | Datos limitados a sus finalidades informadas; infraestructura externa para almacenamiento no equivale a difusión pública. Acceso autorizado, reserva y proveedores necesarios no pueden describirse como «nadie más» o «ningún tercero». Comunicación legal válida permanece como excepción. |
| Receta | La persona puede aportar imagen/documento o valores manuales durante la compra o posteriormente en perfil, según funciones habilitadas. Se almacena en servidores de Lemoon y/o de infraestructura contratada; finalidad única de referencia para preparar cristales/montaje solicitados. No historia clínica, publicidad, inferencia de salud ni entrenamiento. |
| IA de lectura | Función opcional de extracción/prellenado, con información previa de proveedor/datos/finalidad y autorización cuando corresponda. El usuario debe revisar y confirmar expresamente los valores finales antes de usarlos. No diagnóstico, validación clínica ni invención de valores ausentes. No se convierte el consentimiento general en activación automática. |
| Prueba virtual | Usuario confirma requisito de operación: cuando se habilite, procesamiento temporal exclusivamente en dispositivo; sin recepción, almacenamiento o transmisión de imagen/fotogramas/rostro por Lemoon ni comunicación a terceros. Se retira el placeholder técnico del cuerpo. La prueba de implementación sigue en la lista de aceptación de abajo y no se vuelve a preguntar al usuario lo ya decidido. |
| Derechos | Revocación escrita sin efecto retroactivo; solicitud de cierre de cuenta/eliminación con excepción de conservación legal. Cierre, baja y borrado no se presentan como equivalentes ni como borrado absoluto inmediato. |
| Analítica | Posible Google Analytics/Hotjar para patrones, dificultades e interés agregado en productos, solo si efectivamente se habilitan y se informa su uso. Finalidad distinta de compra, preferencias y consentimiento previo cuando corresponda. Excluir recetas, rostro, pagos, campos sensibles e identificadores innecesarios de analítica y grabación/reproducción de sesiones. No se afirma instalación actual ni anonimato automático. |
| Marketing | Se mantiene decisión previa: correo/celular para propósito informado, publicidad opcional y baja gratuita en cualquier momento, sin usar mensajes transaccionales para eludir suspensión. |

Se reducen los marcadores del cuerpo a **cuatro asuntos concretos**: inventario de proveedores y países/funciones; retención y borrado por categoría; inventario/categorías/configuración de cookies y analítica; fecha de vigencia. Identidad queda como las tres variables acordadas, no valores inventados. La descripción de finalidad o requisito operativo no acredita por sí sola que un flujo esté desplegado.

### Lista de aceptación técnica y de salida a producción — fuera del texto público

Seguimiento operativo creado por el coordinador: [LEM-143 — checklist de salida a producción](https://linear.app/antekera/issue/LEM-143), en Todo al crear. La validación y conexión de variables, integración y pruebas se ejecutan allí; esta revisión solo redacta las tres variables acordadas, sin implementar su renderer ni afirmar que Shopify ya las tenga configuradas. **No reabrir como preguntas de negocio los hechos ya confirmados**; comprobar su implementación con evidencia:

1. Resolver las tres variables de identidad desde la configuración acordada de Shopify, escapar su contenido y verificar que no quedan tokens literales ni valores ficticios en la política integrada.
2. Verificar campos, persistencia y acceso a tarjeta/CVV/credenciales frente al proveedor de pagos; conservar solo las referencias mínimas de transacción que realmente se reciban.
3. Probar los tres modos aportados de receta y su relación con pedido/perfil, autorización informada, acceso por rol, almacenamiento privado, destinatarios necesarios y conservación/borrado, incluidas copias. No utilizar documentos reales para pruebas iniciales.
4. Para lectura asistida, identificar proveedor real y contrato/condiciones, datos enviados, países y conservación; comprobar la autorización previa aplicable, opción manual, prellenado no definitivo y confirmación expresa de los valores por la persona. El hallazgo de código Gemini R2 no demuestra activación actual y debe reconciliarse con el servicio efectivamente desplegado.
5. Antes de habilitar VR, probar permisos de cámara, procesamiento local y trazas de red/almacenamiento: sin cargas, capturas persistentes, envío de fotogramas/rostro, telemetría facial ni acceso remoto por proveedores. Mantener la distinción entre esos datos y navegación técnica general; probar salida/revocación de cámara. Es aceptación del requisito confirmado, no pendiente de decisión editorial.
6. Inventariar scripts/apps/cookies y funciones efectivamente habilitadas. Si se habilita Google Analytics o Hotjar, comprobar consentimiento/bloqueo aplicable, minimización, enmascaramiento o exclusión efectiva de campos sensibles, recetas, rostro, pagos y datos identificatorios innecesarios; impedir su incorporación a eventos y reproducción de sesiones. No presentar nombres de herramientas como evidencia de despliegue.
7. Probar baja por cada canal habilitado, aplicación entre proveedores, ejecución de revocación/cierre/eliminación y excepciones de conservación legal; atención proporcional de representación y menores. Verificar que las operaciones necesarias no se usan para continuar publicidad.
8. Completar cuatro marcadores, revisar destinatarios y transferencias, aprobar versión/fecha, integrar enlaces públicos y revalidar el régimen legal al publicar, especialmente desde 01-12-2026. Revisión jurídica chilena y aprobación humana antes de declarar publicación definitiva.

Las fuentes oficiales y comparables de R2 siguen siendo la base de esta revisión; no se añadieron nuevas afirmaciones sobre la API, configuración o funcionamiento de Google Analytics/Hotjar, Shopify, proveedores de pagos ni SDKs. La revisión R3 es adaptación de hechos expresamente confirmados y de su alcance, no asesoría técnica sobre dichas herramientas ni auditoría de ellas.


## R4 — Proveedores como ejemplos, criterio de conservación y fecha, 01-11-2026

El usuario autoriza completar las secciones 8, 9 y 10 y fijar la fecha de esta versión al **1 de noviembre de 2026**. Esta R4 sustituye los cuatro marcadores públicos pendientes de R3 por contenido documental y criterios propuestos, sin afirmar que la configuración o eliminación estén implementadas. Se mantienen las tres variables de identidad acordadas; su conexión a Shopify sigue en LEM-143.

### Sección 8: una única tabla de servicios y ejemplos

Se utiliza una tabla de siete filas con finalidad y situación: Shopify (plataforma confirmada), AWS (infraestructura prevista en el código, sin certificar uso o región de despliegue), Transbank/Webpay o Mercado Pago (alternativas de pago), Google Analytics 4 — GA4 (medición), Microsoft Clarity o Hotjar (alternativas posibles de análisis de experiencia), Shopify Email o Klaviyo (alternativas de comunicación), y Google Ads (posible medición/publicidad). No se ofrecen como ranking, inventario instalado ni autorización de transferencia a todos. Microsoft Clarity y Hotjar comparten una fila y se describen como alternativas; no se selecciona ninguna ni se presume instalación simultánea. GA4 se identifica por su nombre actual en esa tabla.

Fuentes oficiales consultadas el 01-11-2026:

- [Shopify — privacidad](https://www.shopify.com/legal/privacy) y [marketing app data sharing](https://help.shopify.com/en/manual/promoting-marketing/analyze-marketing/app-data-sharing), abiertas con contenido. La segunda distingue eventos, datos de campañas, preferencias y herramientas compatibles, como Klaviyo y Google & YouTube. Sirve como contexto de ecosistema, no como prueba de popularidad o instalación de Lemoon.
- [AWS — Privacy Notice](https://aws.amazon.com/privacy/), [Google — privacidad](https://policies.google.com/privacy?hl=es) y [Microsoft — privacidad](https://privacy.microsoft.com/es-es/privacystatement), abiertas. Se enlazan como avisos propios; no se importan sus certificaciones, plazos o países para Lemoon ni se usan para probar un despliegue.
- [Transbank — privacidad](https://publico.transbank.cl/pol%C3%ADtica-de-privacidad) y [Mercado Pago — declaración de privacidad](https://www.mercadopago.cl/privacidad/declaracion-privacidad): URLs oficiales localizadas en búsqueda; apertura devolvió 403, por lo que no se afirma lectura de su cuerpo. Los enlaces sirven como referencias a alternativas posibles; antes de seleccionar/configurar una pasarela, revisar su aviso y tratamiento aplicables. La primera URL ensayada `www.transbank.cl/politicas-de-privacidad` falló y no se usa.
- [Hotjar — privacidad](https://www.hotjar.com/legal/policies/privacy/): abierto en esta revisión; redirige al portal oficial de confianza de Contentsquare, sin asumir por ello que todas sus opciones estén implementadas en Lemoon. El enlace identifica la referencia oficial de la alternativa posible, no una auditoría ni prueba de instalación.
- [Klaviyo — aviso de privacidad](https://www.klaviyo.com/legal/privacy/privacy-notice): URL oficial redirige al centro de privacidad con exigencia de JavaScript; no se atribuye lectura sustantiva a esa respuesta. Su papel en correo/SMS está respaldado por la documentación oficial de Shopify antes indicada. No se declara habilitado.

Antes de usar lectura de recetas, montaje o transporte se requiere identificar proveedor real; una lista de ejemplos no satisface por sí sola esa transparencia. Países, funciones y datos efectivamente compartidos deben constar en el inventario operativo que valida LEM-143. No se afirma que los avisos generales de proveedores sustituyan las obligaciones de información de Lemoon.

### Sección 9: investigación y propuesta de conservación diferenciada

Se reabrió [OPV — política, apartado 5.5](https://opv.cl/pages/institucional#politica-de-privacidad): conserva por tiempo necesario para fines y obligaciones. GMO contiene una regla de grupo de hasta diez años y duraciones diferenciadas; no se importa a una tienda distinta. La relectura previa de RYK no permitió identificar un plazo propio útil; no se inventa uno ni se afirma que la ausencia de hallazgo pruebe que no exista. Los comparables informan estructura y criterio, no una autorización legal de conservación para Lemoon.

Fuente primaria nueva: [SII — conservación de documentos tributarios electrónicos](https://www.sii.cl/preguntas_frecuentes/factura_electronica/001_003_2356.htm), abierta y leída; FAQ actualizada 25-06-2025 informa **seis años para DTE** conforme al art. 58 de la LIVS. Se aplica en la tabla exclusivamente a esos documentos. No se extiende a todo pedido, receta, perfil, registros de cámara o analítica ni se inventa un cómputo inicial que la FAQ no especifica.

Propuesta editorial y operativa incorporada:

1. Pedidos y documentos: gestión de compra y plazo legal que corresponda al tipo de antecedente; referencia específica a DTE y nada más.
2. Consultas/reclamos: resolución y necesidad legal de atención posterior, sin almacenamiento indefinido automático.
3. Cuenta: vigencia y cierre, con conservación limitada de antecedentes obligatorios o pendientes.
4. Receta: preparación, entrega y asuntos concretos de esa compra que necesiten el antecedente; agotada la necesidad, eliminación o bloqueo según supuestos legales. No reutilización indefinida ni regla de seis años por asociación al DTE.
5. Marketing: hasta retiro/baja; después solo registro mínimo para respetar supresión y acreditar atención, sin publicidad.
6. Analítica y cookies: duración por servicio y configuración realmente informada; no un plazo universal ni equivalencia entre cookie del navegador y registros del proveedor.
7. Consentimientos/derechos: registro pertinente durante el período necesario de acreditación/obligación. Respaldos sujetos a acceso y eliminación/sustitución, sin prometer automatismo ya desplegado.

Como contraste de variabilidad se abrieron [Microsoft Clarity — retención](https://learn.microsoft.com/en-us/clarity/setup-and-installation/data-retention) y [Google Analytics — conservación](https://support.google.com/analytics/answer/7667196?hl=es). Clarity indica playback de 30 días y otras categorías de nueve meses; Analytics distingue configuración de usuario/eventos de informes agregados. **No se trasladan esos valores al texto como configuración adoptada por Lemoon.** La conservación real de una herramienta depende de su habilitación y modalidad; un número único sin selección/configuración sería engañoso.

Esta tabla define un criterio propuesto de la política; **no prueba tareas de borrado, ciclos de respaldo ni atención operativa ya implementados**. [LEM-143](https://linear.app/antekera/issue/LEM-143) debe concretar responsables, eventos iniciales y finales, obligaciones por documento, alcance de eliminación/bloqueo y ejecución en copias/proveedores. Si al verificarlo surgen diferencias materiales con el criterio aprobado, corregir política o implementación antes de publicar.

### Sección 10 y fecha

Se mantiene explicación de categorías, necesarias/opcionales, consentimiento previo cuando corresponda, retiro hacia futuro y navegador para borrar cookies. El apartado de analítica remite a la tabla única de la sección 8; no repite herramientas ni presenta todas como instaladas. Se conservan exclusión de recetas/rostro/pagos/campos sensibles, minimización y control de reproducción de sesiones.

El pie dice «Última actualización y fecha de vigencia de esta versión: 1 de noviembre de 2026» por instrucción expresa del usuario. Es la fecha documental del candidato; **no acredita que haya sido publicado, que rija ya en Shopify ni que se hayan ejecutado sus controles**. Al integrar se debe reconciliar la fecha efectiva y el régimen legal, en especial la entrada general de la reforma el 01-12-2026.

### Pendiente operativo, sin nuevos placeholders públicos

Se retiraron los marcadores resueltos del cuerpo para entregar una versión legible y revisable. LEM-143 concentra inventario real de proveedores/países/tecnologías, consentimientos y preferencias, parámetros de retención y eliminación/backups, valores de identidad y conexión de tokens, revisión jurídica, integración, pruebas y aprobación/publicación. Ninguna de esas acciones se ejecuta por esta edición documental; no se declara política definitiva desplegada ni cumplimiento certificado.


**Cierre del delta R4:** queda resuelto documentalmente el antiguo punto 8 de la lista R3 («completar cuatro marcadores» y aprobar fecha). No se solicita otra fecha al usuario: confirmó el **01-11-2026**. Las verificaciones técnicas y el inventario efectivo, retención aplicada, backups y conexión de las tres variables permanecen en LEM-143; al publicar corresponde verificar coherencia de fecha y normativa, no tratar la decisión editorial como desconocida.
