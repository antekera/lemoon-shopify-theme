# Revisión de páginas — 10 de octubre de 2026

Rama `feat/remaining-storefront-pages`. Los enlaces locales requieren el servidor
Shopify theme dev de esta sesión en el puerto 9292. Los tickets permanecen
In Progress para revisión. Los enlaces con `view=` muestran el template nuevo;
no significan que ya se asignó permanentemente a la página CMS.

| Página | Preview |
| --- | --- |
| Seleccionar lentes — flujo refinado | [Configurador](http://127.0.0.1:9292/products/lemoon-dalton-prototipo?view=configurador) |
| Producto con entrada al flujo | [PDP prototipo](http://127.0.0.1:9292/products/lemoon-dalton-prototipo) |
| Carrito | [Carrito](http://127.0.0.1:9292/cart) |
| Buscar | [Resultados reales](http://127.0.0.1:9292/search?q=Colca&type=product) |
| Catálogo | [Todos](http://127.0.0.1:9292/collections/all), [Ópticos](http://127.0.0.1:9292/collections/opticos), [Sol](http://127.0.0.1:9292/collections/lentes-de-sol) |
| Cristales | [Catálogo y orientación](http://127.0.0.1:9292/collections/cristales) |
| Contacto | [Formulario](http://127.0.0.1:9292/pages/contact) |
| Preguntas frecuentes | [FAQ](http://127.0.0.1:9292/pages/preguntas-frecuentes?view=preguntas-frecuentes) |
| Nosotros | [Identidad y valores](http://127.0.0.1:9292/pages/nosotros?view=nosotros) |
| Medidas | [Guía](http://127.0.0.1:9292/pages/como-medir-tus-lentes?view=guia-medidas) |
| Rostro | [Guía](http://127.0.0.1:9292/pages/elegir-lentes-segun-tu-rostro?view=guia-rostro) |
| Pedido | [Guía](http://127.0.0.1:9292/pages/como-hacer-tu-pedido?view=guia-pedido) |
| Probador | [Guía](http://127.0.0.1:9292/pages/como-usar-probador-virtual?view=guia-probador) |
| Receta | [Guía](http://127.0.0.1:9292/pages/como-enviar-prescripcion?view=guia-prescripcion) |
| Journal | [Listado](http://127.0.0.1:9292/blogs/news) |
| Primer artículo | [Borrador en Admin](https://admin.shopify.com/store/lemoon-8277/content/articles/634930987176) |
| Operativos | [Servicios](http://127.0.0.1:9292/pages/operativos-oftalmologicos?view=operativos-oftalmologicos) |
| Isapres y Fonasa | [Información](http://127.0.0.1:9292/pages/isapres-y-fonasa?view=isapres-y-fonasa) |
| Envíos | [Presentación de política](http://127.0.0.1:9292/pages/envios-y-entregas?view=envios-y-entregas) |
| Devoluciones | [Presentación de política](http://127.0.0.1:9292/pages/po?view=politica-de-devoluciones) |
| Garantías | [Presentación de política](http://127.0.0.1:9292/pages/garantias?view=garantias) |
| Términos | [Presentación de política](http://127.0.0.1:9292/pages/terminos-y-condiciones?view=terminos-y-condiciones) |
| Privacidad de prueba | [Borrador editable](http://127.0.0.1:9292/pages/contact?view=privacidad) |
| Privacidad publicada | [Política nativa existente](http://127.0.0.1:9292/policies/privacy-policy) |
| Lanzamiento | [Password y newsletter](http://127.0.0.1:9292/password) |
| 404 | [Recuperación](http://127.0.0.1:9292/pages/lemoon-revision-ruta-inexistente) |
| Checkout y cuentas | [Perfil borrador de branding](https://admin.shopify.com/store/lemoon-8277/settings/checkout/editor/profiles/7112229032?page=checkout&context=branding) |

La última suite de código registrada pasó 175 pruebas unitarias y 127 e2e de
componentes. Theme Check inspeccionó 252 archivos, sin errores ni advertencias. Los resultados siguientes describen corridas
anteriores; el registro al final incluye las comprobaciones más recientes.
Una corrida anterior de colecciones y configurador pasó 42 casos storefront en
escritorio, tablet y móvil. La primera corrida tuvo 41 aprobados y un error
temporal de token de Shopify en el ordenamiento móvil; la repetición completa
pasó sin cambiar ese comportamiento ni relajar la prueba.
La validación anterior registró 153 casos storefront aprobados entre corridas y
repeticiones. Los
casos storefront incluyen los tres tamaños de pantalla. El artículo se probó
con preview privado; para repetirlo se requiere ARTICLE_PREVIEW_URL vigente.
Las pruebas de receta y adjunto usan datos sintéticos. No se realizó compra,
envío de los formularios de contacto o suscripción en esas suites. El acceso real
de cliente se verificó posteriormente, como consta al final de este registro.

El usuario autorizó datos comerciales de prueba para continuar, con razón social
**Servioptic SpA**. Contacto, Nosotros, Servicios y cinco políticas cuentan con
contenido de muestra editable y un aviso visible; los valores están en
[Datos comerciales de prueba](../content/commercial-test-data.json).
La opción de sección «Mostrar datos comerciales de prueba» permite volver al
contenido CMS y canales configurados al desactivarla. Las tarifas y plazos son
contenido de revisión: no configuran la operación de checkout.

Antes de publicar deben reemplazarse RUT, domicilio, correo, tarifas, condiciones,
proveedores y conservación por información confirmada.
[Notas de políticas](../content/policies-review-notes.md).
También faltan asignar templates CMS, publicar el artículo revisado y el perfil
de checkout. El menú compartido ya muestra Mis pedidos y Mi perfil; el branding
está en borrador. Gift cards tiene vista nativa, compra con producto en borrador y
correos preparados; emisión, entrega y canje siguen pendientes en LEM-9. La
recepción de contacto, los pagos y el detalle de pedidos reales necesitan
comprobación operativa.

Cristales conserva la colección nativa y sus productos de muestra, y añade una
guía de transparentes, fotocromáticos y sol debajo del catálogo. El enlace al
configurador identifica el producto Prototipo. Los enlaces directos a variantes
con Lentes también abren el flujo refinado; opciones como Color/Tamaño no activan
esa redirección. Código y convenciones revisados y aprobados.

LEM-95 y el padre LEM-44 están In Progress. El banner nativo quedó guardado
con Chile y las 31 regiones recomendadas que ya estaban seleccionadas (32 en
total), fondo blanco y botones/texto Navy; el editor normaliza ese color a
`#0b203c`. Evidencia: `/tmp/lemoon-cookie-banner-saved.png`.

El footer ahora permite abrir un diálogo accesible con categorías de
personalización, analítica y marketing, aceptar/rechazar con botones equivalentes
y guardar una elección granular. Usa exclusivamente Customer Privacy de Shopify;
no crea almacenamiento propio ni modifica `sale_of_data`. Las 142 pruebas
unitarias pasaron y Theme Check revisó 242 archivos sin errores después del ajuste
final de scope CSS. El CSS nuevo se delimitó por instancia y la reapertura se
bloqueó mientras existe un guardado pendiente.

La API real informó región Chile y permisos opcionales desactivados sin elección
previa. La suite de consentimiento en storefront no pasó: algunas respuestas de
la vista previa mostraron la página de contraseña y los intentos de guardado no
cerraron el diálogo. Se interrumpió después de 8 fallos y un caso interrumpido;
3 casos no se ejecutaron. Esa corrida local no valida persistencia ni retiro; la comprobación HTTPS
posterior se registra a continuación. LEM-95 sigue pendiente de verificar píxeles.


Continuación HTTPS: el preview autenticado del tema de desarrollo mostró el
banner nativo. Se comprobó por UI el rechazo inicial, aceptar todas y recargar
(tres categorías marcadas), guardar solo analítica y recargar (una categoría
marcada), rechazar todas y recargar (ninguna categoría opcional marcada). Escape
restaura foco al control del footer, también en viewport móvil 390 × 844.
Evidencia: `/tmp/lemoon-cookie-granular-https.png`,
`/tmp/lemoon-cookie-rejected-https.png`, `/tmp/lemoon-cookie-mobile-https.png`.

El diagnóstico directo del API en HTTP local devolvió `Failed to fetch`: el
servicio nativo intenta POST HTTPS al dominio de la página, mientras theme dev
sirve HTTP. No se alteró el API para evitar ese límite. Se corrigió una condición
real adicional: cualquier `error` del callback se rechaza aunque una elección
anterior ya coincida; la regresión falló antes y pasó después. La comprobación
manual HTTPS no convierte la suite automatizada fallida en una suite aprobada,
ni demuestra el bloqueo de todos los píxeles de terceros.

El borrador de privacidad de prueba añade categorías, finalidades y cómo cambiar
preferencias desde el footer. No reemplaza la política nativa publicada.


La política nativa `/policies/privacy-policy` ahora tiene shell editorial de
Lemoon, ancho de lectura de 66rem, jerarquía Urbanist, contacto y acceso al mismo
diálogo de preferencias. Conserva íntegro `content_for_layout` y el cuerpo
publicado. Los estilos solo se cargan en `request.page_type == 'policy'`.
La ayuda normaliza la ruta de contacto y el control recibe `aria-controls` del
footer antes de mostrarse. El API usa el opener correspondiente para restaurar
foco.

Verificación actual: 142 unitarias y 96 componentes pasan; Theme Check242 sin
incidencias; ambas revisiones aprobadas. El test ampliado de política falló antes
por no existir el acceso en el contenido principal. Después, desktop/mobile
pasaron en la primera corrida y tablet en la segunda. La segunda corrida tuvo
fallos en desktop/mobile porque Shopify devolvió la página de contraseña;
no se afirma una corrida completa verde. En Chrome HTTPS se comprobaron apertura,
Escape y retorno de foco en desktop, tablet820px y mobile390px. Sin overflow en
820px/390px. Capturas: `/tmp/lemoon-native-policy-desktop.png` y
`/tmp/lemoon-native-policy-mobile.png`.

LEM-23 quedó In Progress para reflejar el frontend refinado ya implementado.
Sus prerrequisitos de catálogo/laboratorio siguen pendientes.

LEM-11 quedó In Progress y ahora tiene sección y plantilla alternativa en
`/pages/buscar-mi-estilo?view=buscar-mi-estilo`. Cuatro preguntas, curaduría
editable de cinco productos reales, ranking hasta tres opciones, presupuesto
estricto, variante disponible más económica, orden DOM accesible, foco y
validación por paso, reinicio y alternativa sin JavaScript. Ocho pruebas de
ranking y URL pasan. Referencias y alcance en `style-quiz-spec.md`; no se
encontraron pantallas de quiz en el outline Figma consultado.

El render inicial mostró que el selector de colección no expone sus filtros
en la página. El módulo comprueba el control de precio en el HTML del catálogo
del mismo origen, con timeout de cuatro segundos; si falta, conserva un enlace
general sin anunciar filtrado. Revisiones general y de convenciones aprobadas.
La columna mobile fue ajustada según la especificación.

Validación fresca: 150 unitarias/31 archivos, 96 componentes y Theme Check244
pasan. Storefront quiz: 3 pasan (sin JavaScript en tres viewports), 6 fallan
únicamente al navegar al producto o PLP, que devuelve `/password` en localhost.
En los seis casos se completaron antes las aserciones del quiz, foco, orden,
presupuesto y URL; eso no convierte la corrida completa en verde. Fallos
preservados en `/tmp/lemoon-style-quiz-product-auth-failure.md` y
`/tmp/lemoon-style-quiz-catalogue-auth-failure.md`.

Chrome HTTPS confirmó el recorrido, reinicio, tres productos, PLP con filtro
visible «Precio: $0 – $20.000» y PDP Estero con Azul seleccionado y precio$699.
Sin overflow a390px/820px; capturas desktop/resultados/mobile/tablet en
`/tmp/lemoon-style-quiz-*.png`. Las fotografías y precios actuales del catálogo
son de prueba; no representan fotografías distintas de los modelos finales.
La plantilla no fue asignada globalmente al CMS publicado. M9 y POST-MVP
permanecen sin cambios.

Diagnóstico posterior del preview local: la consulta nativa `bannerQuery` a
`/api/unstable/graphql.json` devuelve400 con JSON «Online Store channel is
locked» y un Set-Cookie `_shopify_essential`. El código del proxy CLI instalado
actualiza `session.sessionCookies` desde esa respuesta. La siguiente navegación
al PLP devuelve302 y termina en `/password`. Dos comparaciones aisladas
confirmaron el disparador: sin JavaScript, PDP200; con JavaScript, PDP/password.
Bloqueando exclusivamente `bannerQuery` en un diagnóstico temporal, el PLP
filtrado permanece200; permitiéndolo, acaba en/password. No se bloqueó el banner
en el tema ni se alteraron las suites para presentarlas como aprobadas.

La documentación de Shopify CLI confirma la opción `--store-password` y su
variable `SHOPIFY_FLAG_STORE_PASSWORD`. El entorno local solo tiene definida
la variable de tienda; se solicitó al usuario configurar la contraseña existente
localmente sin enviarla por chat. El servidor actual sigue vivo y no se reinició.
Se preparó `remaining-pages-preview.md` con enlaces explícitos de revisión de
todas las páginas y pendientes de las superficies nativas.


### Vista nativa de tarjeta regalo — LEM-9

[Revisar la tarjeta sintética en el editor](https://admin.shopify.com/store/lemoon-8277/themes/188783886504/editor?previewPath=%2Fgift_cards%2F123456%2Fpreview).
El ticket permanece In Progress. Se conservan saldo/código reales del objeto
nativo, QR de Shopify, vencimiento, estados desactivada/vencida/saldo cero,
Apple Wallet cuando existe y un enlace a la tienda. Copia sin espacios de
formato, fallo visible con alternativa manual, reintentos y prevención de doble
escritura. Impresión conserva saldo y código; sin JavaScript se ocultan acciones
que requieren script.

La prueba roja inicial reprodujo el fallo existente con portapapeles ausente.
Cuatro unitarias verifican ausencia, éxito, permisos denegados/reintento y copia
pendiente. Siete e2e de componente usan HTML capturado de la tarjeta sintética
nativa (320/390/820/1440px, copia, error, CSS de impresión y sin JavaScript).
Seis e2e storefront verifican la plantilla renderizada, QR, copia, impresión
visible y alternativa sin JavaScript en escritorio/tablet/móvil: todas pasan.
La ruta nativa de muestra pasó aunque otras navegaciones locales conservaron
el fallo de autenticación registrado anteriormente; no se extrapola este verde
al catálogo ni a todo el sitio.

Última corrida `npm test`: **154 unitarias en 32 archivos y 103 e2e de componentes**.
`shopify theme check --fail-level error`: **244 archivos sin incidencias**.
Validación adicional de la skill shopify-liquid: cinco archivos válidos.
Revisiones general **Approved** y de convenciones **Ready to push**.
Chrome HTTPS confirma render, QR, copia y ausencia de overflow a390px.
Capturas: `/tmp/lemoon-gift-card-desktop.png` y `/tmp/lemoon-gift-card-mobile.png`.

La muestra del editor no tiene pass_url ni vencimiento: la rama de Apple Wallet
y los estados de saldo no disponible fueron revisados en código, pero requieren
prueba operativa posterior. No se emitieron tarjetas ni se activó su venta.
Faltan la página de compra, denominaciones, monto libre, correo y redención de
saldo del alcance completo de LEM-9. Ninguna publicación de producción.


### Compra de tarjeta regalo — LEM-9, revisión pendiente

[Revisar el producto en el editor](https://admin.shopify.com/store/lemoon-8277/themes/188783886504/editor?previewPath=%2Fproducts%2Ftarjeta-de-regalo-lemoon%3Fview%3Dgift-card). Producto nativo creado como
borrador: `15417003245736`, handle `tarjeta-de-regalo-lemoon`, tres variantes
reales de $30.000, $60.000 y $100.000 CLP. No se publicó ni emitió saldo.
La plantilla `product.gift-card` usa el producto actual; `page.gift-card` incluye
un selector y muestra un estado honesto de indisponibilidad si no puede resolverlo.
No se asignó la plantilla al producto ni se modificó producción.

Formulario con radio de variantes, destinatario opcional, email obligatorio al
activar el envío a otra persona y propiedades nativas. El borrador mantiene el
submit deshabilitado. Sin JavaScript conserva el formulario nativo y sus montos;
oculta el resumen que no puede actualizarse. Los montos libres requieren consulta,
porque Shopify no permite un precio arbitrario en la compra nativa de tarjetas.
La entrega se comunica después del procesamiento de la compra.

Ocho pruebas unitarias incluyen rechazo, HTML inesperado, IDs/cantidad/endpoints
inválidos y confirmación de la cantidad acumulada de una línea preexistente.
Nueve e2e de componente cubren 320/390/820/1440px, destinatario, éxito simulado,
rechazo, doble envío y fallback sin JS. El fixture procede de la vista nativa
y restaura los valores ocultos que la exportación de DOM omite. Solo esas pruebas
aisladas habilitan el botón del borrador y simulan el carrito. Chrome confirma
render real, selección de monto, destinatario y compra bloqueada. Esto no demuestra
un pago, emisión de correo ni redención real.

Última suite: **162 unitarias / 33 archivos y 112 e2e de componentes pasan**.
Theme Check: **247 archivos sin incidencias**. Revisiones: **Approved** y
**Ready to push**. Capturas `/tmp/lemoon-gift-purchase-desktop.png`,
`/tmp/lemoon-gift-purchase-mobile.png`, `/tmp/lemoon-gift-product-draft.png`.
LEM-9 permanece In Progress; faltan correo y comprobaciones operativas de emisión
y redención. Autenticación storefront general continúa pendiente según diagnóstico
previo.


### Correos de tarjeta regalo — LEM-9, revisión pendiente

Nueva tarjeta de regalo y Recibo de tarjeta de regalo preparados en
`notifications/es/`, con asuntos y cuerpos independientes. Se inspeccionaron
ambos originales activos y se renderizaron los cambios en **Previsualizar plantilla
con contenido**, sin Guardar ni Enviar prueba. Los correos de toda la tienda no se
modificaron. Las vistas previas nativas están abiertas para revisión; los archivos
locales son el entregable persistente. [Aplicación](../../notifications/README.md).

Diseño de tablas con CSS inline, azul Lemoon, fondo cálido, importe destacado,
código seleccionable y CTA nativa. Fuentes seguras para correo, sin scripts ni
fuentes remotas. Usa nombre/logo/email configurados, sin identidad de ejemplo en
producción. Escape de destinatario/remitente/mensaje; respeta remitente alternativo,
vencimiento, Wallet y fecha programada del recibo. No se prometen beneficios
presenciales ni nuevas condiciones.

LiquidJS10.30.0 fijado como dependencia de desarrollo renderiza los mismos
archivos con datos sintéticos. Nueve unitarias verifican compra propia, destinatario,
HTML escapado, fallback, vencimiento/Wallet, logo, RTL y recibos inmediatos/programados.
Siete e2e de componente verifican 320/390/820/1440px, contenido, enlaces, mensajes
inseguros tratados como texto, programación y funcionamiento sin JS. Shopify
confirma en sus previews $100/código sintético y el recibo para Bobby; la muestra
CLP es aislada y no se presenta como dinero emitido.

Revisión general Approved. Suite fresca: **171 unitarias en 34 archivos y 119 e2e
de componentes pasan**. Theme Check: **251 archivos, cero errores y dos warnings**
de UndefinedObject para locale_direction en notificaciones; variable presente
en los originales nativos y renderizada por Shopify. Validadores stateless de
ambos cuerpos pasan con esa misma advertencia. git diff --check limpio.

Capturas `/tmp/lemoon-gift-email-native-preview.png` y
`/tmp/lemoon-gift-receipt-native-preview.png`. Quedan aplicación tras revisión,
render en clientes reales, recepción de correo, emisión y redención; no se enviaron
correos, no se emitió crédito y no hubo publicación de producción.


### Integración de plantilla genérica — revisión pendiente

Se retiraron únicamente las tres secciones stock de `templates/page.json`
(image-with-text, rich-text y multicolumn) que mostraban títulos/columnas de
ejemplo. Conserva la sección main-page y padding28 existentes. El título del
CMS continúa escapado y el contenido HTML nativo se conserva. Si está vacío,
muestra un mensaje EN/ES de preparación. Tipografía y color Lemoon, texto adaptable
y foco visible en enlaces, con CSS nuevo delimitado por section.id. El asset CSS
previo se mantuvo intacto. Las plantillas específicas de cada página no cambian.

Tres pruebas unitarias renderizan el Liquid actual: sin scaffold, conservación
de HTML/enlaces con escape del título y estados vacíos EN/ES. Se observó fallo
inicial en scaffold/estado vacío y verde después de corregir. Seis e2e de
componente: 320/390/820/1440px, contenido vacío y navegación por teclado sin JS.
El renderer conserva el wrapper de sección que Shopify añade automáticamente.

Chrome inspeccionó el preview nativo /pages/nosotros sin view: Página predeterminada,
un H1 Nosotros y mensaje de preparación por cuerpo CMS vacío. En móvil, ancho y
scrollWidth375px. Esto confirma el fallback; la sección específica de Nosotros
preparada anteriormente continúa en su template alternativo. No se asignaron
templates ni cambiaron contenidos publicados del CMS. Capturas:
`/tmp/lemoon-default-page-desktop.png`, `/tmp/lemoon-default-page-mobile.png`.

Suite fresca: **174 unitarias / 35 archivos y 125 e2e de componentes pasan**.
Theme Check: **251 archivos, cero errores y dos warnings de notificaciones**
ya documentados. Validación adicional de la skill: main-page/page.json y ambos
locales válidos. Revisión general Approved y convenciones Ready to push tras
mover el CSS nuevo al bloque de estilo con section.id. git diff --check limpio.
La asignación de templates y la autenticación/operación general siguen pendientes;
LEM-108 permanece In Progress y no se publicó producción.

### Auditoría de asignación y navegación

Shopify Admin API devolvió 18 páginas publicadas, con `hasNextPage=false`.
Contacto ya usa la plantilla `contact`; 14 páginas del alcance aún necesitan
asignación de su plantilla específica. Se guardó el estado actual junto con
IDs, propuestas, tickets y enlaces en
`docs/content/page-template-assignments.json`. El archivo registra
`applied=false`: no se cambiaron datos del CMS. `templateSuffix=page` no tiene
archivo alternativo `page.page.json` en esta rama; la inspección nativa previa
confirmó la plantilla predeterminada para Nosotros.

No existe página CMS `privacidad` ni página de compra de tarjetas en el inventario.
Se conservan las revisiones de la política nativa, plantilla de privacidad de
muestra y producto nativo de tarjeta en borrador como superficies distintas.
Las páginas antiguas Sol/Cristales no reemplazan las colecciones de navegación.
La consulta de Linear confirmó In Progress para todos los tickets de páginas
trabajadas, sin modificaciones de estado adicionales.

Se verificó que los procesos locales 15512/15517 siguen vivos y se repitió
únicamente el test `budget link uses the actual collection price parameter and
preserves its cap` en desktop. Las aserciones del quiz y enlace pasan, pero tras
abrir el catálogo la URL real vuelve a `/password`; el caso falla en la línea73.
Un caso ejecutado/un fallo. No se reinició el servidor ni se alteró el banner.
La variable local SHOPIFY_FLAG_STORE_PASSWORD sigue ausente. Se solicitó al
usuario configurarla localmente, sin enviar ni registrar la contraseña.

### Retorno del configurador y acceso público a cuentas

La revisión de integración encontró un ciclo al volver desde una variante con
lentes: el enlace regresaba al PDP con esa variante y el PDP redirigía de nuevo
al configurador. Ambos enlaces ahora añaden `lens_flow=return`; el PDP conserva
la variante, entra en vista de armazón y oculta/deshabilita la receta. Al reabrir
el configurador, elimina el marcador. No se elige una variante o color diferente.

La regresión de componentes renderiza el anchor real de
`sections/lens-configurator.liquid` y utiliza el controller real del PDP. Antes
del cambio, el retorno por teclado volvió a `view=configurador` y falló; después
pasó. Se amplió también el test storefront de deep link; su ejecución general
continúa pendiente de resolver la autenticación local. La unitaria de limpieza
del marcador falló antes y pasó después. Revisión general: Approved.

Shopify confirmó en el editor el retorno al PDP con la variante
`67616399425704`, receta oculta y botón de configuración visible. Reabrir conservó
la variante, cargó `view=configurador` y eliminó `lens_flow`. No se agregó al
carrito. Captura: `/tmp/lemoon-lens-return-native.png`.

Validación fresca: **175 unitarias en 35 archivos y 126 e2e de componentes**.
Los casos relacionados de PDP/configurador pasaron 22 unitarias y 13 componentes
antes de la suite completa. Theme Check: **252 archivos, cero errores y dos
warnings de notificaciones** previamente documentados.

`tests/storefront/native-accounts.spec.js` verifica la entrada pública real de
cuenta.lemoon.cl: email obligatorio/formato válido, autocomplete, consentimiento
de marketing opcional y no preseleccionado, enlace al home y ausencia de overflow.
Comprueba además la política nativa con contenido real, foco inicial en cerrar,
Escape y retorno de foco. No solicita códigos, suscripciones ni crea clientes.
**Seis casos pasan** en desktop/tablet/mobile. La primera corrida tuvo tres fallos
por exigir la URL literal del home: Shopify añade `?country=CL`; la prueba final
verifica el origen HTTPS y la ruta del home. Se repitieron los seis casos.

Esto prueba el acceso público con la configuración publicada; no aplica ni valida
el branding de borrador en una cuenta autenticada. Perfil, direcciones, pedidos,
checkout real y emisión/redención de tarjetas siguen pendientes. Los tickets
permanecen In Progress y el objetivo completo no se considera terminado.

### Contraseña configurada y pruebas por HTTPS — 10 de octubre

Se cargó SHOPIFY_FLAG_STORE_PASSWORD desde el .env local ignorado por Git y se
reinició la sesión de desarrollo existente del tema 188783886504. La contraseña
se validó en una sesión Chromium aislada contra https://lemoon.cl: login HTTP200,
quiz accesible y navegación al catálogo correcta. La API nativa de privacidad
respondió HTTP200. El proxy local mantiene el fallo de autenticación al navegar.

La configuración de Playwright admite la vista previa HTTPS con autenticación
fuera de las trazas, comprobación del ID del tema y cookies temporales fuera del
repositorio, con permisos 0600 y limpieza al terminar. Los contextos sin JavaScript
reutilizan esa misma sesión de prueba.

Comando para repetir cuando Shopify permita el acceso:

```sh
STOREFRONT_URL=https://lemoon.cl STOREFRONT_PREVIEW_THEME_ID=188783886504 npm run test:e2e:storefront -- tests/storefront/style-quiz.spec.js tests/storefront/cookie-preferences.spec.js
```

Corrida focalizada HTTPS: un caso pasó (presupuesto del quiz y catálogo), un caso
falló (deep link de lentes: respuesta HTML del endpoint de producto). La consulta
de diagnóstico posterior recibió HTTP429 en los endpoints de producto y HTTP401
en cart/clear.js. La suite de quiz y cookies no llegó a ejecutar casos porque
Shopify rechazó el acceso en el setup. Se detuvieron los reintentos; estos casos
no se consideran validados. No se aplicaron cambios de CMS ni publicación.
Se comprobó la sintaxis de los cuatro archivos de infraestructura modificados.

### Verificación por navegador y lanzamiento — continuación del 10 de octubre

El formulario nativo de contraseña responde HTTP302 y abre el home. Se sustituyó
el POST directo del setup por ese formulario, fuera de trazas y capturas; los
errores también redactan la contraseña. La sesión temporal verifica que el tema
renderizado sea 188783886504 y se elimina al terminar.

Corrida HTTPS desktop de cookies y quiz: **siete casos pasaron**. Se comprobaron
visitante limpio de Chile, ausencia de permisos opcionales, aceptar/rechazar,
persistencia al recargar, retiro inmediato, respuestas del quiz, presupuesto y
navegación sin JavaScript. No se bloquearon ni simularon APIs de privacidad.

Se corrigió la asociación del label del campo de contraseña con Password.
La prueba de lanzamiento ahora utiliza un contexto invitado y verifica nombre
accesible, tipo password y autocomplete. **Tres casos storefront pasaron** en
escritorio/tablet/móvil; no se enviaron credenciales ni newsletter en estos casos.
**Tres unitarias de lanzamiento pasaron**. Theme Check inspeccionó **252 archivos,
cero errores y dos warnings** de locale_direction en notificaciones.

Los endpoints de productos/carrito se consultan ahora mediante fetch dentro de
la sesión real del navegador, sin cambiar headers de identificación ni resolver
desafíos. La corrida focalizada confirmó **dos casos pasados**: carrito vacío y
actualización/eliminación con propiedades y totales. Otros dos fallaron, siete
no se ejecutaron. Las trazas muestran HTTP429 con cf-mitigated: challenge; se
informa como verificación de navegador requerida. Antes de este ajuste la corrida
amplia tuvo un caso pasado, tres fallidos y 58 sin ejecutar.

La corrida de páginas de contenido posterior no ejecutó casos: el acceso inicial
al preview también respondió HTTP429. Se detuvieron las pruebas HTTPS; no se
considera aprobado el conjunto del sitio ni el retorno de lentes. No se resolvió
automáticamente ningún desafío de Cloudflare. Sintaxis y git diff --check pasan.
No se publicaron templates, artículos, checkout ni productos. LEM-95 y LEM-126
siguen In Progress según lectura fresca de Linear.

### Retorno de lentes validado en navegador visible — 10 de octubre

Se consultaron los criterios actuales de LEM-9, LEM-23 y LEM-120: los tres siguen
In Progress. El catálogo de laboratorio y la validación operativa de pagos,
cuentas y tarjetas siguen siendo requisitos distintos de la revisión visual.

La ventana aislada de Chromium visible abrió /password con HTTP200 sin desafío.
El setup ahora respeta la opción headless de Playwright, por lo que --headed se
aplica también a la autenticación. No se cambian identificadores del navegador ni
se automatiza resolución de desafíos.

**Un caso HTTPS desktop pasó**: el deep link a una variante de lentes abre el
configurador refinado, conserva selectedId, vuelve al PDP con la misma variante,
oculta la receta, reabre sin lens_flow y deja el carrito vacío. Es la prueba de
regresión completa del retorno sobre las plantillas y controladores reales.

La corrida amplia posterior, con navegador visible, tuvo un caso aprobado,
tres fallidos y 58 sin ejecutar: Cloudflare exigió verificación en productos y
carrito. La corrida de páginas de contenido no inició casos porque el acceso
inicial al preview respondió HTTP429. Se detuvieron los reintentos. No se
consideran validados los casos ni los viewports pendientes.

Se solicitó al usuario una cuenta de cliente de prueba con correo accesible para
validar perfil, direcciones y pedidos. No se solicitaron códigos de acceso ni se
crearon clientes. La sintaxis del setup y git diff --check pasan. Los archivos de
sesión temporal fueron eliminados. No se publicó contenido ni checkout.

### Verificación manual requerida — 10 de octubre

La comprobación en Chromium visible recibió HTTP429, cf-mitigated: challenge y
el título «Un momento…». Se dejó una sesión aislada abierta, esperando que el
usuario complete esa verificación. No se automatiza ninguna interacción con el
desafío. La sesión no toma cookies del Chrome personal del usuario.

El setup puede reutilizar el estado temporal de esa sesión de prueba; conserva
la comprobación del tema 188783886504, permisos 0600 y limpieza posterior. La
cuenta de cliente de prueba solicitada también sigue pendiente de respuesta.
Node --check de ambos helpers y git diff --check pasan; .env sigue ignorado.
No se ejecutaron más suites contra el acceso bloqueado ni se publicaron cambios.

### Sesión de verificación lista y nueva corrida — 10 de octubre

El proceso de la ventana aislada terminó con «Temporary isolated test session
ready». La suite reutilizó ese estado temporal y confirmó dos casos de carrito
vacío y modificación/eliminación con propiedades y totales. El tercer caso falló
por HTTP429 con desafío de Cloudflare en /products/lemoon-colca.js; la limpieza
posterior también recibió desafío en /cart/clear.js. Con max-failures=1, 59 casos
no se ejecutaron. No se considera aprobada la corrida completa.

No se automatizó ningún desafío ni se reutilizaron cookies del Chrome personal.
El estado temporal se eliminó al terminar la suite. No se ejecutaron nuevos
reintentos ni se publicó contenido.

### Cuenta de cliente autenticada — 10 de octubre

El acceso nativo por correo y código funcionó en cuenta.lemoon.cl, con la cuenta
de prueba autorizada por el usuario. La sesión permanece en Chrome; no se
exportaron credenciales ni cookies a los tests automatizados.

Se revisaron perfil y pedidos a 1440×900, 820×1180 y 390×844: seis comprobaciones
nativas sin desbordamiento horizontal, con encabezados y estados vacíos correctos.
El consentimiento de marketing permanece desactivado. Los formularios de perfil
y dirección habilitan guardar al completar campos válidos; cancelar descarta los
datos sintéticos y devuelve el foco al control de apertura. En móvil, Escape
cierra el formulario de dirección tras la transición de la interfaz.

No se guardaron nombres ni direcciones. La cuenta no tiene pedidos: el detalle
de pedido, la persistencia de cambios y el aislamiento entre clientes siguen
pendientes. «Comprar ahora» apunta a /collections/frontpage; su destino no se
validó. La recomendación de pedidos muestra «Lente óptico de prueba», pendiente
de revisión de contenido. Estas comprobaciones usan la apariencia publicada de
la cuenta nativa y no validan la publicación del borrador de checkout. No se
realizaron compras ni se publicó contenido.

### Compra como invitado y nueva revisión de guías — 10 de octubre

Se confirmó en Admin que «Requerir que los clientes inicien sesión en su cuenta
antes del pago» está desmarcado y que los enlaces de cuenta están activos. Las
dos opciones ya estaban guardadas; no se cambiaron esos ajustes. La guía de
pedido y la respuesta de cuenta de FAQ ahora explican, en ES/EN, que comprar como
invitado no requiere iniciar sesión y que la cuenta sirve para pedidos, perfil y
direcciones. El render real de ambos textos se verificó en 1440×900, 820×1180 y
390×844, sin overflow. La ventana se restauró después de la comprobación.

La corrida de las cinco guías pasó diez casos de escritorio/tablet. Medidas en
móvil falló al hacer clic en el CTA: el banner de cookies y la barra nativa de
preview interceptaban el puntero; cuatro casos quedaron sin ejecutar. Tres
ajustes de interacción no dieron una corrida consistente entre viewports y se
retiraron. No se atribuye este fallo a Cloudflare ni se declara verde la suite.
El diagnóstico de esa infraestructura sigue pendiente; no se aplicaron clicks
forzados ni cambios a la tienda para ocultar controles.

Después de la aclaración de contenido, pasaron nueve unitarias de guías/FAQ y el
caso HTTPS desktop de la guía de pedido. Theme Check: 252 archivos, cero errores
y las dos advertencias conocidas de notificaciones. git diff --check y la
sintaxis del test pasan. Linear confirmó LEM-103 a LEM-107 y LEM-116 en In Progress.
Las asignaciones CMS y la publicación siguen pendientes de revisión.

### Guías y soporte: corrida HTTPS completa — 10 de octubre

La preparación de páginas ahora usa la opción oficial pb=0, documentada en
[Shopify](https://shopify.dev/docs/storefronts/themes/best-practices/performance/testing-for-performance),
y comprueba window.Shopify.theme.id contra 188783886504 antes de interactuar.
Rechaza los permisos opcionales mediante el diálogo real del footer y espera
su cierre. No presupone que el banner regional esté presente. Las pruebas
dedicadas de consentimiento mantienen sus sesiones limpias y no usan este helper.
El caso de medidas pasó primero en los tres viewports.

**51 casos HTTPS pasaron en una corrida completa**: contacto (6), cinco guías
(15), FAQ (3), Nosotros (3), servicios (6), cuatro políticas (12), privacidad
nativa (3) y lanzamiento (3), en escritorio, tablet y móvil. Se verificaron
enlaces, teclado, foco, campos y validación de formularios, consentimiento de
newsletter y ausencia de overflow. No se enviaron consultas ni suscripciones.
La prueba móvil de guías pendiente en el registro anterior queda resuelta.

La nueva corrida de carrito/contenido pasó dos casos de carrito y se detuvo
por desafío HTTP429 en /products/lemoon-colca.js; la limpieza también recibió
desafío. 45 casos no se ejecutaron. Una corrida separada de datos comerciales y
Journal no inició casos porque el acceso inicial al preview respondió HTTP429.
No se considera validada esa corrida ni se reintentó el endpoint bloqueado.

El artículo 634930987176 sigue Oculto. Su botón de preview en Admin abrió una
vista privada que no mostraba la presentación nueva; no se contó como prueba
del tema de desarrollo. El editor de 188783886504 sí mostró el artículo oculto
con template editorial, autor Lemoon, 3 min de lectura, siete h2 y rutas de
guía/catálogo/blog. Se comprobó ausencia de overflow a 1348px y en el modo móvil
nativo de 375px. Se restauró el modo escritorio. Es evidencia nativa del editor,
no una nueva corrida CLI del artículo. No se guardan claves privadas de preview
en el repositorio ni se exportan sesiones del Chrome personal.

El helper también prepara carrito, datos de prueba y el estado vacío de Journal;
la validación completa de estos sigue pendiente por el desafío externo. Sintaxis
de los archivos tocados y git diff --check pasan. El servidor theme dev sigue
activo en la misma sesión. Linear confirmó LEM-98, LEM-109, LEM-110, LEM-117 y
LEM-118 en In Progress. No se publicaron temas, artículos ni checkout.
### Cuenta sin pedidos: colección del borrador — 10 de octubre

En el perfil de checkout y cuentas 7112229032, «Lemoon · Figma · revisión
octubre 2026», se reemplazó la colección «Home page» por «Ópticos» y se guardó
el borrador. El editor mantuvo el indicador Borrador y Guardar volvió a quedar
deshabilitado. No se pulsó Publicar.

La vista previa nativa de «Sin pedidos» mostró ocho recomendaciones y el enlace
«Comprar ahora» a `/collections/opticos`. Se comprobó ausencia de overflow en
el iframe a 1048 y 375 px; el editor quedó nuevamente en escritorio. Esto prueba
el borrador simulado, no una publicación ni un pedido real. Los nombres de las
recomendaciones siguen mostrando «Lente óptico de prueba» y requieren revisión
del catálogo; no se renombraron productos de la tienda.

La sesión local de Shopify CLI 4988 sigue viva. La nueva ejecución unitaria
pasó 175 pruebas en 35 archivos. Theme Check inspeccionó 252 archivos: cero
errores y dos advertencias conocidas sobre `locale_direction` en notificaciones.

La corrida completa de componentes `npm run test:e2e` pasó los 126 casos
en 20,3 segundos. Esta suite usa fixtures locales; no sustituye los recorridos
HTTPS pendientes del carrito ni la validación de pedidos reales.

### Cuenta: detalle y navegación de ayuda — 10 de octubre

LEM-125 sigue In Progress, confirmado mediante lectura fresca de Linear. Se
creó el menú «Lemoon · Cuentas y ayuda · revisión» y se seleccionó/guardó en el
perfil borrador 7112229032. Conserva los destinos nativos de Mis pedidos y Mi
perfil, y añade Ayuda con tu pedido (`/pages/contact`), Cambios y devoluciones
(`/pages/po`) y Garantías (`/pages/garantias`). Tras recargar la cuenta autenticada
publicada, su menú conservó solamente Mis pedidos y Mi perfil: el menú nuevo
permanece asociado al borrador. No se pulsó Publicar.

La superficie nativa Estado del pedido mostró un pedido simulado con dos
artículos, subtotal/total de $23.800, envío gratis, $11.900 pagados y $11.900
pendientes. Incluye dirección, contacto, método de envío y una entrega parcial:
un artículo entregado y otro confirmado. No son un pedido, crédito ni pago reales.
La vista previa no desbordó horizontalmente a 1048 px ni 375 px. El intento de
ajustar el viewport externo no modificó el ancho de escritorio del iframe:
no se cuenta como prueba de tablet. Se restauró la ventana y el editor quedó
en escritorio.

En móvil, Enter abrió la navegación de cinco enlaces y movió el foco a Cerrar;
Escape la cerró y devolvió el foco al botón Abrir navegación principal. Enter
abrió el progreso de entrega con tres eventos en español y foco en Cerrar.
El enlace de ayuda activado con Enter cambió la URL simulada con su destino
onlineStoreURL; el editor no navegó al formulario real, por lo que no se atribuye
a esta interacción una prueba completa del recorrido de posventa.

Una comprobación separada de los destinos canónicos en el navegador abrió el
formulario de Contacto; `/pages/po` conserva «Esta página está en preparación»
y `/pages/garantias` conserva texto anterior con un correo mal escrito. Las
plantillas nuevas de estas últimas páginas están preparadas y verificadas con
`view=`, pero su asignación CMS sigue pendiente en
`docs/content/page-template-assignments.json`. El menú utiliza rutas estables
para el resultado final; esas asignaciones y la revisión del contenido son
requisitos previos a publicar el nuevo perfil de cuentas.

Quedan pendientes para LEM-125 la prueba de tablet, el recorrido con un pedido
real y la verificación de aislamiento entre dos clientes. La lista simulada
del editor no respondió a Enter en sus botones de pedido; se accedió al detalle
desde el selector nativo Estado del pedido. No se presenta la simulación como
prueba de autorización o de navegación real entre pedidos.

### Revisión completa de código y recarga del configurador — 10 de octubre

Las revisiones independientes `theme-code-review` y `theme-conventions-review`
cubrieron los archivos de tema modificados y los nuevos sin seguimiento, contra
el merge base de origin/main. La revisión general encontró un fallo reproducible:
el configurador no se inicializaba cuando el editor reemplazaba la sección.
La revisión de convenciones no encontró problemas nuevos.

Se añadió primero una prueba de regresión a
`tests/e2e/lens-configurator.spec.js`: reemplaza la sección por HTML original,
emite `shopify:section:load` y exige que reaparezcan sus opciones. Falló antes
de editar producción porque los paneles seguían ocultos. El controlador ahora
inicializa las raíces nuevas al recibir ese evento, con un WeakSet que evita
duplicar listeners o reiniciar selecciones de una raíz ya inicializada. La misma
prueba comprueba selecciones conservadas y un solo avance al repetir el evento.
La revisión general volvió a inspeccionar la corrección y emitió Approved sin
hallazgos pendientes; convenciones emitió Ready to push desde su propio alcance.
Estos veredictos no equivalen a publicación ni completan dependencias operativas.

El editor real del tema 188783886504 confirmó la recarga: cambiar temporalmente
el relleno superior de 64 a 68 px actualizó el DOM renderizado y mantuvo tres
opciones, paneles y acciones visibles. Sol sin receta avanzó a Cristales con
el foco en su encabezado. Se revirtió a 64 px mediante Undo; Guardar quedó
deshabilitado. No se guardó ese ajuste ni se envió una receta o carrito. La vista
restaurada no desbordó a 1048 px ni en móvil nativo de 375 px; quedó en escritorio.

Verificación posterior completa: `npm test` pasó 175 unitarias en 35 archivos y
127 e2e de componentes (21,0 s). Theme Check inspeccionó 252 archivos: cero
errores y dos advertencias conocidas de `locale_direction` en notificaciones.
`node --check assets/lens-configurator.js` y `git diff --check` pasaron. Shopify
CLI 4988 confirmó la sincronización del asset en el tema de desarrollo y sigue
vivo. LEM-23 permanece In Progress, confirmado con lectura fresca de Linear.


### Preparación de revisión y gate de CI — 10 de octubre

El gate `shopify theme check --fail-level warning` falló con dos advertencias
`UndefinedObject` por `locale_direction`. Esa variable existe en el contexto
nativo de notificaciones, pero no es un objeto global del tema. Cada cuerpo de
correo ahora anota únicamente esa línea mediante la excepción documentada
`theme-check-disable-next-line UndefinedObject`; no se relajó la configuración
ni el workflow de CI. Las pruebas de render mantienen el correo RTL y el código LTR.

Se retiró el parámetro privado `oseid` del action de la fixture de compra de
tarjeta de regalo; ahora usa `/cart/add`. La búsqueda de correo privado, códigos
previos, tokens de preview y prefijos de credenciales no encontró coincidencias
en los archivos candidatos de esta entrega. No se incorporan `.env`,
`config/settings_data.json`, resultados generados ni estados de autenticación.

Verificación nueva: `npm test` pasó 175 unitarias en 35 archivos y 127 e2e de
componentes (20,3 s). También pasó el comando exacto de CI:
`npx --yes @shopify/cli@4.8.5 theme check --fail-level warning`, con 252 archivos
sin infracciones. `git diff --check` pasó. Estas pruebas locales no sustituyen
los pedidos, pagos, recepción de formularios ni el resto de los casos HTTPS pendientes.

La descripción del PR está preparada en `remaining-pages-pr.md`. Crear el PR
activa el workflow existente de Lighthouse, que sube un tema de desarrollo
transitorio a Shopify y lo elimina al terminar. No se crea el PR hasta que el
usuario autorice ese push de CI, conforme a AGENTS.md. No hay publicación de
producción, asignaciones CMS, artículo publicado ni notificaciones aplicadas.
