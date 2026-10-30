# Inventario gráfico y configuración — LEM-97

Paquete operativo para el sitemap de [LEM-86](page-inventory.md). Los IDs permiten reutilizar una pieza en varias superficies sin producir una imagen por ruta. **Existente** significa archivo o recurso implementado en el repositorio; no acredita carga en Shopify, derechos de publicación, asignación CMS ni disponibilidad pública. **Faltante** identifica una entrega que se debe producir o conseguir. **Opcional** no bloquea una superficie que ya funciona sin imagen propia.

[DESIGN.md](../../DESIGN.md) es la fuente canónica de color, tipografía y presentación; [brand-guidelines](brand-guidelines.md) define su uso. Este inventario no elige ni reabre colores, tipografías, estilo, variantes de marca ni prompts. Las ampliaciones de identidad pertenecen a LEM-79/80.

## Reglas de entrega

- Las dimensiones marcadas **requisito de entrega** se fijan para el contenedor existente, no mínimos de Shopify ni nuevas decisiones de marca. Las dimensiones de archivo y reglas CSS se identifican como tales.
- Conservar originales editables y autorización de uso junto a cada export. La carpeta compartida oficial y los originales de fotografías no están identificados en el repositorio: LEM-78 debe establecer el destino y registrar su enlace por ID antes de entregar. No asumir que un archivo del tema es el original editable.
- Los archivos existentes tienen su fuente y export local en `assets/`; los nuevos nombres de esta matriz son nombres de entrega, no archivos ya creados. Para selectores de imagen, cargar desde el editor o Contenido → Archivos y seleccionar la pieza en el ajuste indicado. Productos, colecciones y artículos se cargan en su recurso nativo.
- Alt: describir brevemente contenido y función en es-CL, sin SEO repetitivo ni afirmaciones médicas/comerciales. Producto: modelo, color y vista reales según LEM-71; enlace de categoría: nombre del destino. Decoración junto a texto equivalente: `alt=""`; iconos de controles conservan el nombre accesible del control. No incrustar instrucciones esenciales en una foto.
- Revisar el recorte con el contenido HTML superpuesto. Solo el hero tiene selectores separados desktop/móvil; los demás selectores usan una imagen responsive común. Una variante adicional no puede cargarse en un ajuste móvil inexistente.

## Catálogo de piezas reutilizables

Cada fila define estado, export, alt y destino. Las matrices de superficies y colecciones completan dónde se reutiliza.

| ID · pieza / propósito | Estado y fuente / nombre de entrega | Export y comportamiento responsive | Alt y destino exacto |
| --- | --- | --- | --- |
| G01 · logo oficial | Existente: [lemoon-logo-refined-navy.svg](../../assets/lemoon-logo-refined-navy.svg). No sustituir por `lemoon-logo.svg` | SVG, viewBox 824.267×193.523; conservar trazado, fill y proporción. Header declara 120×28 desktop y móvil; no es mínimo de marca | `Lemoon` en header; logo decorativo de tarjeta mantiene alt vacío. Referencia directa en código; ver configuración global |
| G02 · favicon oficial | **Faltante**: producir con LEM-78 a partir de identidad autorizada; `lemoon-favicon-32.png`, `lemoon-favicon-16.png`. No inventar un isotipo aquí | PNG cuadrado 32×32 y 16×16; revisar legibilidad a tamaño real. El tema pide 32×32 en todos sus consumidores | Metadato: no tiene alt renderizado. Editor → Configuración del tema → Logo → `favicon`: seleccionar el de 32. El de 16 es export del paquete, sin slot separado |
| G03 · OG global | **Faltante** como pieza identificada en repo: `lemoon-og-default.jpg`; producir en LEM-78 | JPG 1200×630 (requisito de entrega de LEM-78); misma versión móvil, sin texto esencial dependiente del crop | Descripción en registro de entrega; el snippet no emite `og:image:alt`. Tienda online → Preferencias → imagen para compartir en redes; no existe `social_image` en schema |
| G04 · ilustración footer | Existente: [footer-abstract-transparent.png](../../assets/footer-abstract-transparent.png) | PNG transparente 2172×724, 3:1. Desktop ancho completo/alto auto; ≤989 usa alto 26rem y cover; móvil usa recorte centrado inferior. Reutilizar una pieza | Si solo decora, dejar vacío `footer_art_alt`; si aporta información, describirla. Footer → `footer_art` opcional, `footer_art_alt`; vacío usa archivo local |
| G05 · iconos compartidos | Existentes: `assets/icon-*.svg`, `lemoon-icon-{email,message,whatsapp}.svg`, SVG inline de confianza/pasos | SVG a tamaño del componente; contacto footer 20×20, confianza móvil 24×24. No export raster ni set móvil nuevo | Decorativos con alt vacío/aria-hidden; acción con label. Referencias en Liquid; no cargarlos en Archivos. Selectores `icon` de cada bloque cuando existan |
| H01 · hero responsive, tres slides locales | Existentes: `lemoon-hero-slide-2-{desktop,mobile}.jpg`, `lemoon-hero-youth-{desktop,mobile}.jpg`; el tercer slide cae en `lemoon-hero-{desktop,mobile}-placeholder.jpg`. Conseguir pareja final para reemplazar esos placeholders: `lemoon-hero-principal-{desktop,mobile}.jpg` | Archivos desktop 1672×941 (placeholder 1672×940), móviles 941×1672. Mantener pareja horizontal/vertical; requisito para nueva entrega: 2400×1350 y 1500×2667 JPG. CSS cover centrado, alto máximo 680px ≥990 y 760px debajo; no ratio fijo de contenedor. Cambio de fuente <750 | Alt desktop = alt del archivo o nombre de tienda; mobile hereda ese alt si falta el suyo; placeholder usa traducción. Home → `lemoon-hero` → bloque `slide`: `desktop_image`, `mobile_image`; alternativa local `desktop_asset`, `mobile_asset` (nombres de archivo del tema, no URLs de Archivos) |
| H02-O / H02-S / H02-A · tiles ópticos, sol, accesorios | Existentes: `lemoon-style-minimalista.png`, `lemoon-style-sol.png`, `lemoon-category-accessories.png`, 1122×1402 cada uno. Fuente/export local; verificar derechos y pertinencia antes de reutilizar | Contenedor final 5:4, cover, tres columnas desktop y una móvil; primera imagen posicionada center 20%. Si se reemplazan: JPG 1500×1200, requisito de entrega, sujeto visible en ambos anchos; un archivo por familia | Alt actual = `heading` del bloque, mantener nombre del destino. Home → `lifestyle-mood-grid` → bloque `mood.image`; fallback depende del orden del bloque |
| H03 · prueba social y newsletter | Sin asset propio requerido: confianza, pasos y formulario usan HTML/SVG existentes. `social-proof-strip` sin referencia JSON directa | No export. No crear sellos de certificación, retratos de clientes ni logos de prensa sin contenido real y ticket propio | G05 para iconos; footer para newsletter. No hay selector de imagen de newsletter en footer |
| C01-{familia} · promoción de colección | Opcional; conseguir imagen solo si se usará la promoción. No hay banner final versionado. `lemoon-coleccion-{familia}-promo.jpg`; reutilizar la sesión de H02, con export propio cuando el encuadre lo requiera | Imagen ancho auto responsive hasta 2400px; CSS ancho 100%, alto auto, max-height 460px desktop y cover; móvil sin max-height. No ratio fijo ni picker móvil. Requisito de entrega: 2400px ancho, proporción elegida según composición real y crop comprobado | Alt del archivo, fallback título colección. Admin → Productos → Colecciones → colección → metafield `custom.plp_promo_banner` (referencia de imagen); no selector `image` en `main-collection-banner` |
| C02 · formas de armazón / filtros | Existente: [lemoon-frame-shape](../../snippets/lemoon-frame-shape.liquid), nueve formas en Home; filtros reutilizan SVG/datos | SVG inline viewBox 48×28, escalable; círculo Home hasta 90px, dibujo 64%. Sin export por colección ni móvil | SVG decorativo junto al nombre de forma. Home → `lemoon-shop-by-shape` → bloque `shape.shape`; PLP desde datos/filtros reales, no una biblioteca raster nueva |
| N01 · banner de búsqueda móvil | Existente fallback `lemoon-hero-editorial.png`; alternativa opcional `lemoon-busqueda-editorial.jpg`, reutilizar sesión H01/H02 | Render ancho 100%, alto auto; variantes CDN 320/480/750/1000. Requisito de entrega JPG 1200×800, sin fuente desktop separada | Alt de archivo; si vacío se usa traducción. Header → `mobile_search_banner_image`; destino `mobile_search_banner_url` |
| N02 · muestras de color navegación | Opcional, solo si un subítem usa imagen: `lemoon-swatch-{color-real}.png`; no hay set final identificado | PNG cuadrado 80×80 como requisito de entrega para círculo 20px/18px móvil; cover. Preferir color configurado cuando baste | Decoración junto al nombre visible. Header → bloque `drawer_subitem.swatch_image`; no confundir con swatches de variantes/productos |
| P01-{producto}-{vista} · fotografías catálogo | Conseguir/validar en LEM-71 por producto y variante. Los `lemoon-product-demo-{amber,back,diagonal,side}.png` y `lemoon-product-fallback.png` son demostraciones/fallback, no catálogo final | Frente, lateral, 45°, detalle, patilla; persona/lifestyle y escala cuando corresponda. Resolución, fondo, luz, color, compresión, proporción y nombre definitivo los fija LEM-71. Consumidores actuales contain: tarjeta 100/96 con max-height 280px ≥990; quiz 4:3; configurador 4:3 desktop y 2:1 móvil. No cortar el armazón para rellenar | Alt según modelo/color/vista reales. Admin → Productos → producto → Multimedia y asociación a variante; la misma media alimenta PLP, búsqueda, recomendaciones, carrito y quiz. No duplicar exports por ruta |
| P02 · diagrama de medidas | Existente: [lemoon-frame-dimensions](../../snippets/lemoon-frame-dimensions.liquid), compartido PDP/modal. No crear `custom.size_guide_image` | SVG inline 420×150, escalable; datos en texto mm con selector de unidad en modal. Sin archivo de imagen nuevo | Nombre accesible localizado del diagrama y cotas en HTML. Producto → metafield JSON `custom.frame_dimensions`: `frame_width`, `lens_width`, `bridge`, `lens_height`, `temple`; instrucciones opcionales en `lemoon_size_guide_page` / `lemoon_size_guide_placeholder` |
| A01 · Nosotros | Opcional: conseguir foto real autorizada `lemoon-nosotros.jpg`; hoy puede usar composición abstracta CSS | JPG 1500×1200 como requisito de entrega; contenedor 1.25 (5:4), cover; CDN hasta 1200; una fuente responsive, sin picker móvil | Alt del archivo describe escena real. Página Nosotros → sección `lemoon-about-page.image`. Home `lemoon-about` es texto y no consume esa imagen |
| A02-{servicio} · servicio | Opcional: `lemoon-operativos.jpg` / `lemoon-orientacion-prevision.jpg` solo con material real pertinente; SVG inline ya resuelve la visual sin foto | Requisito de entrega JPG hasta 720px ancho, proporción del original; CSS width 100%/height auto, sin crop fijo; tamaños 240/480/720 y una fuente móvil | Alt del archivo, sin atribuir cobertura/prestaciones por la imagen. Página → `lemoon-service-page.image` para cada instancia; no producir logos de Isapres/Fonasa como decoración |
| A03 · guías de ayuda | Existente: SVG inline genérico en `lemoon-guide-page`, viewBox 320×160. No requiere imagen nueva | Escalable, sin export móvil. Videos/capturas instructivas futuros requieren contenido y un punto de integración en su ticket; no existe picker de video en esta sección | SVG aria-hidden con explicación HTML. Selección de contenido por `guide_kind`, sin ajuste de imagen |
| E01-{articulo} · portada editorial | Conseguir imagen con derechos para cada artículo que la necesite: `lemoon-articulo-{slug}.jpg`; no hay portada final acreditada por un template | Requisito de entrega JPG 2200px ancho; preservar encuadre para feature del blog 1.9:1 cover y artículo con ratio adaptativo/alto del bloque. Una fuente responsive hasta 3000px en artículo; no duplicar miniaturas | Alt de imagen de artículo, descriptivo de la escena. Admin → Contenido → Entradas del blog → artículo → imagen destacada. Editor blog `show_image`, `image_height`; artículo bloque `featured_image.image_height`, sin picker propio |
| A04 · prelanzamiento | Opcional: reutilizar editorial autorizada H01/H02 con export `lemoon-prelanzamiento.jpg`; SVG inline actual evita una entrega obligatoria | JPG 960px ancho como requisito de entrega; alto auto, contenedor con padding y min-height 400/320/220px según ancho; una fuente, CDN 480/960 | Alt del archivo. Contraseña → `lemoon-launch-page.image`; no cargar en `legacy_banner` deshabilitado |
| A05 · gift card | Existente: tarjeta de compra compuesta en HTML/CSS con G01; emitida usa G01, QR nativo y recurso de Apple Wallet de Shopify. No diseño nuevo requerido | Compra: ratio CSS 1.6, ancho máximo 400px; logo 120px. Emitida no usa un ajuste de imagen propio de esta sección. Sin export móvil | Conservar labels y texto de importe/código; no ponerlos en imagen. Ver `lemoon-gift-card-purchase` y `templates/gift_card.liquid`; media del producto, si se requiere para catálogo, se administra en producto con LEM-9 |
| X01 · adaptaciones logo para nativos/email | Faltan exports identificados: derivar G01 sin redibujar, `lemoon-logo-email.png`, `lemoon-logo-nativo.png`; LEM-78 produce | PNG transparente, conservar proporción; requisito de entrega: ancho 824px (alto proporcional ~194), verificar tamaño visual en editor nativo. Sin pareja móvil | Nombre de marca cuando el editor lo permita. Checkout/cuentas: configuración nativa; email: Notificaciones. No usar `settings.logo` como prueba de esos destinos |
| X02 · paquete fuera del tema | Faltantes en paquete LEM-78: `lemoon-apple-touch-icon.png`, `lemoon-avatar-social.png`, `lemoon-avatar-whatsapp.png`, `lemoon-cover-{plataforma}.jpg`, `lemoon-email-header.jpg` | Apple 180×180; avatar social 1:1 mínimo 400×400 y WhatsApp 1:1. Covers y header email: dimensionar según canal/plantilla real antes de exportar; este tema no define sus contenedores | Avatar: nombre marca en canal; header email según función. Sin slot Apple touch ni covers sociales en tema. Cargar avatar/cover en plataforma correspondiente; header email exige plantilla definida en LEM-139. No crear dimensiones de plataformas por suposición |

## Configuración global y límites de integración

| Punto | Implementación local y acción operativa |
| --- | --- |
| Logo del header | [header.liquid](../../sections/header.liquid) referencia G01 directamente dos veces, en enlaces desktop y móvil. `settings.logo` y `logo_width` no cambian esas imágenes. Mantener ese archivo; LEM-131 es dueño de navegación/announcement y cualquier ajuste de implementación |
| Logo configurable | [settings_schema.json](../../config/settings_schema.json) ofrece `logo`, `logo_width` y `favicon` en el grupo Logo. Solo `main-password-header` consume `settings.logo`: si está vacío usa G01; ancho proporcional calculado desde `logo_width` si está seleccionado. `layout/password.liquid` incluye ese header. Para configurarlo, seleccionar export derivado fiel de G01 y verificar ese consumidor, sin esperar cambios en header normal ni gift card |
| Imagen de marca | `brand_image` y `brand_image_width` están declarados, pero no tienen consumidor Liquid encontrado. No sirven como OG, logo header o imagen footer en esta implementación; no cargar una pieza suponiendo que aparecerá |
| Favicon | [theme.liquid](../../layout/theme.liquid), [password.liquid](../../layout/password.liquid) y [gift_card.liquid](../../templates/gift_card.liquid) emiten `rel=icon` PNG 32×32 solo con `settings.favicon`. Los valores locales actuales y presets no seleccionan favicon ni logo. Sin favicon configurado no hay fallback oficial emitido; un icono genérico del navegador o Shopify no demuestra que exista el arte Lemoon. El estado del Admin no se inspeccionó |
| OG | [meta-tags.liquid](../../snippets/meta-tags.liquid) usa `page_image`, sin imagen hard-coded ni selector social propio. G03 es respaldo en Preferencias; producto/colección/artículo pueden aportar imagen de recurso. Cargar `collection.image` en Admin puede resolver compartido/tarjetas Dawn, pero **no** el banner PLP local, que usa `custom.plp_promo_banner`. Verificar HTML resultante por tipo de página después de configurar |
| Iconos/announcement/footer | Announcement es texto/enlaces e iconografía existente, sin imagen propia. Footer consume G04/G05, menús, enlaces sociales e iconos de pago disponibles; no requiere fabricar logos de medios de pago ni una imagen newsletter. LEM-131 implementa/revisa navegación; este documento solo mapea recursos |
| Superficies nativas | Checkout, confirmación/estado y cuentas nuevas en `cuenta.lemoon.cl` usan editor de checkout y cuentas, no templates `customers/*` legacy ni header Liquid. Configuración → Pantalla de pago → configuración → Personalizar → logo: reutilizar X01/G01 según formato admitido. Revisar acceso y perfil en editor nativo correspondiente; no diseñar backgrounds ni extensiones aquí |
| Correos | Configuración → Notificaciones → Notificaciones para clientes → Personalizar plantilla de correo → logo X01. LEM-139 verifica también emisor y render final. `lemoon-email-header.jpg` no tiene ajuste de cabecera universal en el tema: integrar solo en plantilla definida por su dueño |

La guía oficial de [favicon](https://help.shopify.com/en/manual/online-store/images/add-favicon) confirma 16/32px y el selector del tema. [Compartir en redes](https://help.shopify.com/en/manual/online-store/images/showing-social-media-thumbnail-images) documenta Preferencias como respaldo; no garantiza el resultado de este tema personalizado. [Checkout/cuentas](https://help.shopify.com/en/manual/checkout-settings/customize-checkout-configurations/checkout-style) y [notificaciones](https://help.shopify.com/en/manual/fulfillment/setup/notifications/customizing-notification-template) describen sus editores separados. La disponibilidad concreta debe comprobarse en la tienda antes de cargar; no se certifica configuración nativa desde el código local.

## Matriz de cobertura del sitemap

Se conservan las 42 superficies de LEM-86; cada fila indica sus piezas propias además de G01–G05 compartidos en el shell Liquid, cuando corresponda. «Sin asset propio» significa que no debe encargarse una imagen para esa superficie.

| # · superficie | Destino / uso | Piezas y tratamiento |
| --- | --- | --- |
| 01 Home | `/` | H01 hero, H02 categorías, P01 carruseles, C02 formas, H03 confianza/pasos/newsletter. `lemoon-about` sin imagen. Secciones Dawn deshabilitadas no crean pedidos de collage, video o banners adicionales |
| 02 Catálogo | `/collections/all` | P01 + C02; C01 opcional, sin cabecera raster obligatoria |
| 03 Colecciones | 13 rutas abajo | P01/C02 compartidos; H02/C01 según familia; no 13 sesiones nuevas |
| 04 PDP | `/products/{handle}` | P01 + P02; iconos G05 y contenido real del producto |
| 05 Búsqueda | `/search` y búsqueda predictiva | P01 resultados; N01 en panel móvil; vacío resuelto por texto/SVG, sin imagen nueva |
| 06 Configuración | PDP `?variant={id}&view=configurador` | Reutiliza P01 de variante/producto; sin fotografía propia de cada paso |
| 07 Selección cristales | Dentro de configurador | Opciones HTML/datos; sin ilustraciones clínicas ni packshot nuevo obligatorio |
| 08 Receta | Configurador/perfil | Sin asset comercial propio; documentos del cliente son datos privados, no parte del paquete gráfico |
| 09 Receta en perfil | `cuenta.lemoon.cl/profile` | Sin asset propio; integración nativa/LEM-24/138 |
| 10 Carrito | `/cart` y drawer | P01 miniaturas, G05; estado vacío sin imagen nueva |
| 11 Checkout | Sesión nativa | X01/G01 en editor nativo; sin hero propio |
| 12 Confirmación/estado | Enlace nativo pedido | Reutiliza branding nativo, sin imagen propia |
| 13 Correos | Notificaciones compra/recepción | X01; X02 header solo con plantilla definida por LEM-139 |
| 14 Acceso | `cuenta.lemoon.cl` | Logo nativo X01; sin hero de cuenta requerido |
| 15 Perfil/direcciones | `cuenta.lemoon.cl/profile` | Sin asset propio; branding nativo compartido |
| 16 Mis pedidos | `cuenta.lemoon.cl/orders` | Media de producto nativa, sin imagen propia |
| 17 Detalle pedido | Destino nativo desde pedidos | Media de producto nativa, sin imagen propia |
| 18 Rostro | `/pages/elegir-lentes-segun-tu-rostro` | A03, sin set nuevo de retratos requerido por implementación |
| 19 Medidas | `/pages/como-medir-tus-lentes` | A03 para guía; P02 en PDP/modal, no confundir con foto de talla |
| 20 Probador | `/pages/como-usar-probador-virtual` | A03; sin captura de un probador no verificado |
| 21 Enviar receta | `/pages/como-enviar-prescripcion` | A03; material instructivo adicional solo en LEM-106 y sin datos personales reales |
| 22 Hacer pedido | `/pages/como-hacer-tu-pedido` | A03; no video obligatorio ni picker local |
| 23 Nosotros | `/pages/nosotros` | A01 opcional; composición CSS existente como alternativa completa |
| 24 Operativos | `/pages/operativos-oftalmologicos` | A02-operativos opcional; sin foto propia obligatoria |
| 25 Isapres/Fonasa | `/pages/isapres-y-fonasa` | A02 orientación opcional, sin sellos o logos de convenios supuestos |
| 26 FAQ | `/pages/preguntas-frecuentes` | Sin asset propio, contenido/controles HTML |
| 27 Contacto | `/pages/contact` | Sin asset propio; reutiliza iconos compartidos donde corresponda |
| 28 Envíos/devoluciones | `/pages/envios-y-entregas` | Sin asset propio; shell legal/texto |
| 29 Reembolso | `/pages/politicas` | Sin asset propio; `page.politica-de-devoluciones.json`, no inventar otro handle |
| 30 Garantías | `/pages/garantias` | Sin asset propio; no sello de garantía nuevo |
| 31 Términos | `/pages/terminos-y-condiciones` | Sin asset propio; shell legal/texto |
| 32 Privacidad/preferencias | Policy nativa; alternativa `page.privacidad.json` | Sin asset propio; mantener destino nativo registrado en sitemap |
| 33 Blog | `/blogs/news` | E01 reutilizada desde cada artículo para feature/tarjetas; sin banner adicional obligatorio |
| 34 Artículo | `/blogs/news/{slug}` | E01; imágenes en cuerpo solo si el contenido las requiere, con derechos y alt; el borrador registrado no acredita publicación |
| 35 404 | URL inexistente | Sin asset propio; texto y recuperación existentes |
| 36 Contraseña | Prelanzamiento | G01 o logo configurable; A04 opcional; formulario sin arte propio obligatorio |
| 37 Página genérica | `/pages/{handle}` | Sin asset propio obligatorio; media de contenido CMS solo si la página lo requiere |
| 38 Modal tallas | Dentro PDP | P02 compartido con PDP, sin export duplicado |
| 39 Quiz | `/pages/buscar-mi-estilo` | P01 en resultados; preguntas HTML sin imagen propia |
| 40 Gift cards | Compra / tarjeta emitida | A05, G01 y media de producto si aplica; sin nueva variante de logo |
| 41 Header/menús | Global | G01/G05, N01, N02 opcional. Announcement sin imagen propia; implementación LEM-131 |
| 42 Footer | Global | G04/G05; newsletter sin imagen nueva |

### Reutilización entre categorías

El grupo indica qué material reutilizar, no una carga CMS comprobada. C01 solo se encarga al habilitar una promoción real; `collection.image` es imagen nativa distinta del metafield de promoción. Los tiles de Home no consumen automáticamente la imagen de colección.

| Ruta | Familia / reutilización | Entrega propia |
| --- | --- | --- |
| `/collections/opticos` | H02-O; P01 y C02 | C01-opticos opcional; derivar encuadre de sesión ópticos |
| `/collections/opticos-hombre` | Sesión H02-O; P01 del segmento | Sin tile nuevo obligatorio; C01-opticos reutilizable si representa el segmento |
| `/collections/opticos-mujer` | Sesión H02-O; P01 del segmento | Igual reutilización, comprobar pertinencia del contenido |
| `/collections/opticos-unisex` | Sesión H02-O; P01 del segmento | Sin export por género obligatorio |
| `/collections/opticos-ninos` | P01 real del segmento | Sin reutilizar personas adultas como prueba de categoría infantil; C01-ninos opcional solo con material pertinente |
| `/collections/lentes-de-sol` | H02-S, P01 solar | C01-sol opcional, nueva proporción si requiere crop |
| `/collections/accesorios` | H02-A, P01 accesorios | C01-accesorios opcional |
| `/collections/mejor-vendidos` | P01 selección real | Sin banner propio requerido |
| `/collections/lo-nuevo` | P01 selección real | Sin banner propio requerido |
| `/collections/frontpage` | P01 selección real | Sin otra home ni hero propio |
| `/collections/de-lectura` | P01 productos reales | Sin imagen clínica ni banner propio requerido |
| `/collections/para-pantallas` | P01 productos reales | Sin imagen de tratamiento o beneficio supuesto |
| `/collections/cristales` | Datos/opciones reales y G05/C02 donde se rendericen | Sin imagen propia obligatoria; coordinar destino con LEM-23/47/94 |

Destinos complementarios de LEM-86: `/pages/lentes-de-sol` y `/pages/cristales` usan contenido de página, sin nuevo asset obligatorio; pueden reutilizar familias anteriores si el ticket define su función. `/pages/sistema-de-diseno` usa componentes existentes, sin pieza de campaña. El alias `/pages/pre` reutiliza FAQ sin assets duplicados. Los segmentos/tags del header no son colecciones nuevas. **Antiparras queda excluida** del paquete.

## Producción y entrega

1. **LEM-78 — producir y organizar:** establecer carpeta compartida oficial y registro por ID; producir G02, G03, X01 y paquete X02; entregar pareja final H01 principal y acreditar uso de las piezas existentes antes de publicación. Mantener masters y exports. Packaging, watermark e invoice branding quedan post-MVP.
2. **LEM-71 — fotografía:** entregar P01 por producto/variante con las vistas y el estándar que ese ticket define. Registrar el vínculo de sus guidelines; este inventario solo mapea consumidores y no crea un estándar paralelo.
3. **Tickets de página — contenido y carga:** obtener E01 por artículo; decidir el uso de A01/A02/A04 y C01 según contenido real; cargar cada pieza en el destino de la matriz. Comprobar crops/alt y HTML OG en móvil y desktop antes de publicar.
4. **LEM-79 — marca ampliada:** mantener Brand Guidelines v1 y usos fuera del storefront en coherencia con DESIGN; cualquier variante nueva sigue su proceso propio. No reaprobar aquí decisiones de LEM-141.
5. **LEM-86 / LEM-131 — mapa y navegación:** LEM-86 mantiene las 42 superficies, 13 colecciones y destinos; LEM-131 consume G01/G05/N01/N02 y resuelve implementación de header/menús/announcement sin duplicar su checklist.

Fuentes de implementación: [inventario de secciones](section-inventory.md), [Home](../../templates/index.json), [PLP](../../assets/lemoon-collection-plp.css), [hero](../../assets/lemoon-hero.css), [componentes](../../assets/lemoon-components.css) y los consumidores enlazados arriba. Esta matriz define piezas y puntos de configuración locales; la carga CMS, el render de tienda, los derechos y la publicación se verifican en las entregas responsables.
