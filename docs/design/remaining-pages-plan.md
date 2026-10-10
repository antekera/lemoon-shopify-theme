# Páginas pendientes de Lemoon

Fecha de revisión: 2026-10-10. Rama: `feat/remaining-storefront-pages`.

## Alcance y evidencia

Objetivo: completar las páginas restantes con la identidad del home, PDP y PLP,
contenido real, diseño responsive, accesibilidad y pruebas unitarias y e2e por
página. Los tickets permanecen en **In Progress** hasta revisión del usuario.
Este inventario distingue implementación local, validación y dependencias pendientes.

Fuentes consultadas directamente:

- Proyecto Linear [Lemoon](https://linear.app/antekera/project/lemoon-b8064784d380).
- [Figma Lemoon Ecommerce](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce).
- LEM-86: sitemap y outline de compra, soporte y cuentas.
- LEM-31: el MVP vende armazones; óptica, recetas y probador tienen dependencias posteriores.
- `docs/design/brand-guidelines.md`: Urbanist, Hanken Grotesk, navy, lemon y beige.

Figma contiene `Cart / Desktop` (64:586), y la extensión editorial (273:583):
blog desktop (274:583), artículo (274:649), búsqueda (274:674), referencia de
checkout nativo (274:732), confirmación (274:783), y sus versiones mobile
(275:583, 275:634, 275:665, 275:706, 275:742 respectivamente).

Los ejemplos de nombres, precios, tarifas y dirección de esos frames no son
datos comerciales confirmados. Deben sustituirse por objetos reales de Shopify.
Las promesas comerciales del tema requieren confirmar condiciones antes de
redactar políticas definitivas.

### Referencia de selección de lentes indicada por el usuario

Usar la página **Flujo de compra de cristales** (`111:583`) y el frame
[Propuesta refinada — pasos, receta con IA y compatibilidad](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=412-979)
(`412:979`), identificado por las cajas claras de los pasos. Verificados su
contenido y captura visual tras la aclaración del usuario. Los frames del Cover
de cinco pasos y el frame «Versión anterior — flujo de 6 pasos» no definen el
recorrido vigente de selección.

Secuencia de hasta siete etapas, con PDP contado como primera etapa:

1. Modalidad: solo armazón, ópticos o sol.
2. Uso / graduación: monofocal, bifocal, progresiva, sin receta y lectura.
   Monofocal distingue lejos y cerca. Lectura depende del catálogo confirmado.
3. Añadir y revisar receta: ingreso manual o documento; extracción con IA
   propuesta en el diseño y revisión/corrección del cliente en el mismo formulario.
4. Elegir cristal: transparente, fotocromático o teñido con selección de color.
5. Elegir grosor compatible, independiente del tipo de visión.
6. Extras compatibles: antirreflejo y filtro azul como decisiones independientes.
7. Revisar configuración y precio, y agregar al carrito.

Saltos explícitos del esquema: solo armazón va del PDP al carrito; sin receta
omite carga; sol sin receta va al color del cristal según catálogo; teñidos
omiten extras; grosor con una única opción se preselecciona y omite su pantalla.
El antirreflejo incluido no se cobra de nuevo. Después de elegir color, mostrar
grosor solo si corresponde y existe una combinación teñida compatible.

El propio frame marca como propuestas o datos pendientes: receta guardada,
receta enviada después, disponibilidad de lectura, reglas de receta alta,
paquete base, precios y combinaciones. La aclaración identifica la referencia;
no demuestra que esas capacidades o datos comerciales estén implementados.

## Inventario de entrega

| Ticket | Página | Base actual / dependencia | Estado de implementación en esta rama |
| --- | --- | --- | --- |
| LEM-98 | Carrito | `cart.json`, main-cart-items/footer, upsell | Implementado localmente; pruebas y revisiones aprobadas; In Progress |
| LEM-45 | Búsqueda | `search.json`; frame desktop/mobile | Implementado; 12 pruebas storefront y revisiones aprobadas; In Progress |
| LEM-101 | Categorías | PLP existente /collections/all; LEM-101 prohíbe directorio duplicado | Auditada; pruebas storefront aprobadas; In Progress |
| LEM-99 | Lentes ópticos | PLP existente y colección nativa verificada | Pruebas storefront aprobadas; In Progress |
| LEM-100 | Lentes de sol | PLP existente y colección nativa verificada | Pruebas storefront aprobadas; In Progress |
| LEM-103 | Elegir lentes según rostro | Contenido y template de guía | Implementado; 15 casos storefront entre las cinco guías pasan; asignación CMS pendiente; In Progress |
| LEM-104 | Cómo usar el probador | Comprobar capacidad real de try-on | Implementado; 15 casos storefront entre las cinco guías pasan; asignación CMS pendiente; In Progress |
| LEM-105 | Cómo medir tus lentes | Guía con diagrama de medidas | Implementado; 15 casos storefront entre las cinco guías pasan; asignación CMS pendiente; In Progress |
| LEM-106 | Cómo enviar prescripción | Canal confirmado y privacidad de recetas | Implementado; 15 casos storefront entre las cinco guías pasan; asignación CMS pendiente; In Progress |
| LEM-107 | Cómo hacer tu pedido | Flujo real PDP → carrito → checkout | Implementado; 15 casos storefront entre las cinco guías pasan; asignación CMS pendiente; In Progress |
| LEM-108 | Quiénes somos | Template page.nosotros; historia verificada opcional | Implementado y revisado; pruebas live aprobadas; In Progress |
| LEM-109 | Blog listado | `blog.json`, `blog.editorial.json`; frames | Implementado; newsletter y vacío pasan en tres viewports; In Progress |
| LEM-110 | Artículo | `article.json`, `article.editorial.json`; primer post real | Borrador real creado; plantilla y revisión aprobadas; preview privado validado; In Progress |
| LEM-111 | Operativos oftalmológicos | Template alternativo; consulta de disponibilidad | Implementado y revisado; datos operativos pendientes; In Progress |
| LEM-112 | Isapres y Fonasa | Template alternativo; información condicional por plan | Implementado y revisado; convenios no confirmados; In Progress |
| LEM-113 | Reembolsos | Plantilla editorial sobre /pages/po; handle definitivo pendiente | Shell implementado; condiciones definitivas pendientes; In Progress |
| LEM-114 | Envíos y devoluciones | Plantilla editorial; tarifas y plazos pendientes | Shell implementado; condiciones definitivas pendientes; In Progress |
| LEM-115 | Garantías | Template page.garantias; cobertura y exclusiones pendientes | Shell implementado; condiciones definitivas pendientes; In Progress |
| LEM-116 | Preguntas frecuentes | 11 preguntas agrupadas y bloques editables | Implementado y revisado; pruebas live aprobadas; In Progress |
| LEM-117 | Contacto | `page.contact.json`; verificar recepción | Implementado; 6 pruebas storefront pasan; canales/recepción pendientes; In Progress |
| LEM-118 | Privacidad | Política nativa existente; finalidades y canales por confirmar | Layout editorial y acceso a preferencias implementados; UI HTTPS validada en tres viewports; texto definitivo pendiente; In Progress |
| LEM-119 | Términos | Plantilla editorial; identificación del negocio pendiente | Shell implementado; texto definitivo pendiente; In Progress |
| LEM-120 | Checkout | Basic; branding nativo | Borrador guardado y revisado desktop/mobile; no publicado; In Progress |
| LEM-121 | Confirmación y estado | Superficie nativa con branding de borrador | Preview simulado inspeccionado; compra real pendiente; In Progress |
| LEM-122 | Acceso a cuenta | NEW_CUSTOMER_ACCOUNTS, cuenta.lemoon.cl | Acceso real por correo/código verificado; cuenta opcional y compra como invitado confirmadas; In Progress |
| LEM-123 | Perfil y direcciones | Cuentas nuevas nativas, branding compartido | Formularios y cancelación revisados con sesión real en tres tamaños; persistencia pendiente; In Progress |
| LEM-124 | Mis pedidos | Cuentas nuevas nativas, branding compartido | Estado vacío revisado con sesión real en tres tamaños; aislamiento entre clientes pendiente; In Progress |
| LEM-125 | Detalle del pedido | Estado nativo del pedido, branding compartido | Menú de ayuda guardado en borrador; detalle simulado y teclado móvil verificados; tablet, pedido real y aislamiento pendientes; In Progress |
| LEM-126 | 404 | `404.json`; respuesta HTTP real | Implementado localmente; pruebas y revisiones aprobadas; In Progress |
| LEM-11 | Encuentra tu lente ideal | Quiz en `/pages/buscar-mi-estilo`, catálogo real, M9 | Implementado y revisado; 8 unitarias; recorrido y destinos HTTPS verificados; e2e local 3 pasan/6 fallan al destino por contraseña; In Progress; asignación CMS pendiente |
| LEM-23 | Configurador de cristales | Flujo refinado aprobado; catálogo/laboratorio posteriores | Frontend y pruebas implementados; In Progress; prerrequisitos operativos pendientes |
| LEM-102 | Cristales | Colección nativa y flujo de selección | Guía editorial integrada bajo el catálogo; configurador refinado y enlace de variante; catálogo definitivo pendiente; In Progress |
| Sin ticket por página localizado | Password / lanzamiento | Lanzamiento editorial con consentimiento y autenticación nativa | Implementado y revisado; pruebas live aprobadas |
| LEM-9 | Gift cards | Vista nativa, página de compra y correo; M9 | Vista nativa, compra con tres denominaciones en borrador y dos correos preparados; In Progress; validación operativa pendiente; ninguna tarjeta emitida |

LEM-94 (enlaces de footer) y LEM-95 (privacidad y consentimiento) deben verificarse
junto con las políticas. LEM-44 agrupa carrito y checkout. Las capacidades de
recetas, cristales y try-on siguen formando parte de la revisión del inventario;
su disponibilidad no debe darse por implementada a partir de un diseño.

## Propuesta inicial: carrito

Conservar las actualizaciones y formularios de Dawn. Desktop: productos a la
izquierda y resumen a la derecha. Mobile: una columna con CTA claro. Mostrar
variante, propiedades pertinentes, cantidad, eliminar, descuentos y total real.
Conservar el cálculo de impuestos y envío de Shopify. Mostrar únicamente
accesorios reales configurados; eliminar precios ficticios de la experiencia.
Resolver estados vacío, stock insuficiente y error de actualización con foco y
mensajes accesibles. Plan aprobado por el usuario; carrito implementado localmente y validado.

## Validación por página

Cada entrega necesita pruebas unitarias de su lógica y datos pertinentes,
pruebas e2e del recorrido principal y sus estados de error/vacío, y revisión
visual desktop, tablet y mobile. Las fixtures locales no prueban publicación,
entrega de formularios, HTTP 404, autenticación o pago real: esos criterios
requieren evidencia del storefront o Shopify.

Ejecutar `shopify theme check --fail-level error` y las pruebas relevantes antes
de declarar una entrega validada. Registrar resultados y límites concretos por
página. Nunca declarar completada la totalidad por pasar una suite parcial.

## Información pendiente

- Confirmar email, WhatsApp, horario, devolución gratuita de 30 días y garantía
  de 365 días, incluyendo condiciones.
- Confirmar tarifas/plazos, identificación legal e historia del negocio antes
  de publicar contenido definitivo.
- Plan, cuentas y configuración nativa inspeccionados; faltan publicación y pruebas reales de acceso/pago.
- Aprobación del plan recibida; continuar implementación por página.
- Toda publicación en Shopify requiere autorización de publicación; producción
  exige inspeccionar el ID vigente y confirmación inmediatamente antes del push.

## Documentación actual de checkout

Context7 consultado el 2026-10-10, biblioteca
`/websites/help_shopify_en_manual`. La documentación oficial confirma
[personalización estándar desde Basic](https://help.shopify.com/en/manual/checkout-settings/customize-checkout-configurations)
y [extensiones en información, envío y pago reservadas a Plus](https://help.shopify.com/en/manual/checkout-settings/customize-checkout-configurations/checkout-apps).
Las cuentas nuevas usan el branding del editor de checkout y cuentas, según la
[guía de migración de cuentas](https://help.shopify.com/en/manual/customers/customer-accounts/upgrade).
La auditoría posterior verificó Basic, cuentas nuevas y el perfil borrador de
branding; la configuración publicada permanece anterior.

## Auditoría de la tienda y preview local

Consulta directa a Shopify el 2026-10-10: tienda `lemoon.cl`, plan **Basic**, CLP,
correo configurado **ayuda@lemoon.cl**. Este dato contradice el enlace renderizado
del footer (`mailto:hola@lemoon.cl`); confirmar el canal público antes de editarlo.
Plan y configuración verificados; el nuevo branding se guardó como borrador.

Observaciones iniciales del preview local `http://127.0.0.1:9292`, antes de la
implementación. El estado vigente se detalla en Evidencia de entregas locales:

- `/cart` responde HTTP 200. La base Dawn preserva propiedades de línea y
  identificadores de variante/línea. `cart-upsell-row` permite títulos y precios
  ficticios sin producto configurado; corregirlo dentro de la entrega del carrito.
- Las rutas de soporte listadas en el footer responden HTTP 200, incluida
  `/pages/po`. Su existencia no demuestra contenido definitivo ni aprobación.
- `/pages/nosotros` contiene texto de ejemplo: «Título de sección», «Comparte
  información sobre tu marca». Requiere reemplazo completo de esos bloques.
- `/pages/contact` mantiene el título inglés «Contact» y solo formulario; no
  muestra canales u horarios confirmados en su contenido principal.
- `/blogs/news` solo muestra «News» en el contenido principal. Todavía falta
  verificar otros blogs; esta ruta no contiene artículos visibles en el preview.
- Las guías de medidas, pedido y rostro tienen texto inicial. La guía de pedido
  menciona cristales/receta condicionalmente: comprobar el recorrido real antes
  de presentar esos pasos como disponibles.
- `/lemoon-audit-missing-page-20261010` devuelve HTTP 404 y «Página no encontrada».
  La semántica HTTP de base está verificada; faltan diseño, búsqueda y pruebas.
- `/account` redirige al home local. Esta observación **no determina** el modelo
  de cuentas ni prueba autenticación; inspeccionar configuración en Shopify.
- No se enviaron formularios, pagos ni cambios de checkout en esta auditoría.

Estas observaciones provienen de solicitudes de lectura y parsing del contenido
principal, no de una revisión visual ni de pruebas e2e de interacción.

## Evidencia de entregas locales

Validación de código más reciente: 175 pruebas unitarias en 35 archivos y 127
pruebas e2e de componentes. Una corrida storefront anterior registró 42 casos de
colecciones y configurador aprobados; no demuestra el estado autenticado actual. La validación anterior registró 153 casos storefront aprobados
entre corridas y repeticiones, con escritorio, tablet y móvil.
Theme Check más reciente inspeccionó 252 archivos, cero errores y dos warnings
por la variable nativa locale_direction de notificaciones. Código y convenciones revisados y aprobados. Los casos storefront
usan variantes, precios, carrito y rutas reales de Shopify; la receta manual y
el PDF adjunto usan exclusivamente datos sintéticos. No prueban un cobro,
autenticación de cliente ni recepción de formularios. El artículo requiere una
URL de preview privado vigente en ARTICLE_PREVIEW_URL para repetir su prueba.

Las cinco guías, Nosotros y Servicios se revisan mediante templates alternativos;
la asignación permanente de esos templates a páginas CMS sigue pendiente.
Las políticas tienen presentación y contenido CMS preservado, pero faltan los
datos comerciales necesarios para redactar condiciones definitivas. Privacidad
conserva /policies/privacy-policy. El catálogo conserva /collections/all y la
PLP aprobada, según LEM-101.

Auditoría Admin: 18 páginas publicadas, blog News (handle news) y ningún artículo
público. Algunas páginas tienen bodySummary vacío; las guías conservan contenido
inicial. Operativos contiene el correo mal escrito hola@lemon.cl en su cuerpo
CMS; la plantilla nueva no lo presenta. La cuenta usa NEW_CUSTOMER_ACCOUNTS,
cuenta.lemoon.cl y acceso opcional antes del checkout.

Checkout: guardado y reapertura verificados para el perfil borrador 7112229032,
**Lemoon · Figma · revisión octubre 2026**. Logo refinado PNG de 120px, header
blanco, acento navy y resumen #F7F4EE; títulos Urbanist y cuerpo Source Sans Pro
(Hanken Grotesk no está disponible en el editor nativo). Desktop y móvil
inspeccionados. Acceso, confirmación, pedidos, perfil y estado del pedido
inspeccionados con datos simulados del editor. No se pulsó Publicar ni se
realizó compra o autenticación. El preview indica pagos deshabilitados.

Menú nativo de cuenta: Orders/Profile cambiados a Mis pedidos/Mi perfil,
preservando IDs, recursos y URLs; userErrors vacío y preview verificado. Este
cambio sí quedó aplicado al menú compartido; el branding continúa en borrador.
No se modificaron datos de clientes ni sus preferencias de marketing.

Primer artículo propio: **Cómo elegir un armazón que se sienta tuyo**, borrador
634930987176, isPublished=false, template editorial, tags Estilo/Guías.
[Fuente editable HTML](../content/como-elegir-un-armazon-que-se-sienta-tuyo.html).
[Revisión en Admin](https://admin.shopify.com/store/lemoon-8277/content/articles/634930987176).
No contiene historia comercial, precios ni garantías inventadas. Su publicación
sigue pendiente de revisión.

El servidor local theme dev sincronizó las secciones y templates. No se ejecutó
theme push ni se publicó el checkout. Gift cards corresponde a M9 después del
lanzamiento según LEM-9; no se emitieron ni activaron tarjetas.

[Índice de previews y pendientes](remaining-pages-review.md).

## Continuación con datos comerciales de prueba

El usuario autorizó completar los borradores con datos de prueba y corrigió el
nombre a Servioptic SpA. Nueve páginas incorporan contenido editable, un aviso
visible y la opción demo_data para regresar al contenido CMS cuando se desactive.
Los datos no modifican configuraciones operativas. Ver
[datos de prueba](../content/commercial-test-data.json) y
[notas de políticas](../content/policies-review-notes.md). La revisión de contenido
y recorridos puede continuar; la sustitución por datos confirmados se requiere
antes de publicación.


Privacidad y consentimiento: acceso permanente y diálogo accesible implementados
mediante Customer Privacy nativo. Banner configurado para Chile más las 31
regiones recomendadas previas. UI HTTPS real verificada: aceptación, rechazo,
elección granular y persistencia tras recargar; Escape/foco y mobile390px.
La suite automatizada local no pasa por errores del preview/autenticación y
porque la API exige HTTPS al guardar. El diagnóstico y capturas están en el
índice de revisión. Falta validar permisos y píxeles en navegador limpio HTTPS.
El borrador de prueba incluye categorías y finalidad; la política nativa aún
requiere contenido aprobado antes de sustituir el texto publicado.


### Tarjeta de regalo nativa — 10 de octubre de 2026

La auditoría completa de Linear confirmó que LEM-9 también cubre
`templates/gift_card.liquid`. Se pasó a In Progress y se personalizó la vista
nativa con la identidad aprobada: saldo, código seleccionable, copia con
mensajes de éxito/error, QR real de Shopify, vencimiento y estados diferenciados,
Apple Wallet condicional e impresión. La tarjeta usada para revisar es la muestra
sintética del editor `/gift_cards/123456/preview`; no se emitió crédito.

El alcance completo de LEM-9 sigue pendiente: página de compra, denominaciones
CLP 30.000/60.000/100.000, viabilidad de monto libre, correo de entrega y canje
operativo. Su ubicación en M9 no excluye esas tareas del inventario solicitado.
La vista no configura productos de regalo ni activa su venta.

Validación actual: 154 unitarias, 103 e2e de componentes, seis e2e de tarjeta
renderizada por Shopify en tres viewports y Theme Check 244 sin incidencias.
Revisiones general y de convenciones aprobadas. El resultado nativo no acredita
emisión, entrega de correo, Apple Wallet real ni redención de saldo.

Compra LEM-9 preparada con producto nativo en borrador, variantes CLP y destinatario
opcional. Ver revisión detallada en remaining-pages-review.md. Sin publicación,
emisión ni transacción; correo/redención y autenticación general siguen pendientes.

Correos LEM-9 preparados en notifications/es: entrega y recibo al comprador,
con programación/recipiente conservados. Previews nativos sin guardar y nueve
unitarias/siete componentes pasan. Ver registro de revisión actualizado.

Integración de páginas: retirada la muestra de tres bloques stock de page.json.
main-page preserva título/contenido CMS, aplica marca por section.id y estado vacío
EN/ES. Preview nativo /pages/nosotros confirma ausencia de ejemplos y de desborde
a375px; no se cambió su asignación de template ni se publicó contenido CMS.
