# LEM-133 · Homepage para revisión de Miguel

Propuesta de diseño v1 · 6 de noviembre de 2026. Base examinada: `0cada135da9534cd91b29b50cf0db9a64184e962`, `antekera/lemoon-shopify-theme`, rama `chore/lem-133-homepage-design`. Entrega de diseño para LEM-48; pendiente aprobación de Miguel e inspección independiente por otro autor. No acredita implementación, catálogo ni publicación.

[Fuente editable local](homepage-proposal/index.html) · [anatomía con bloques condicionales](homepage-proposal/index.html?mode=anatomy) · [estados](homepage-proposal/states.html) · [manifiesto](homepage-proposal/manifest.json) · [verificaciones](homepage-proposal/render-check.json). Abrir directamente como archivo; carpeta portable, sin servidor ni dependencias. HTML/CSS y texto son editables. Las notas grises y las bandas de revisión son anotaciones del documento, no contenido del storefront.

## Fuentes examinadas y decisión de reutilización

El contrato sigue siendo [DESIGN.md](../../DESIGN.md), con [marca](brand-guidelines.md), [brief LEM-82 aprobado](brand-strategy.md), [plan Home](design-plan.md#home), [inventario de secciones](section-inventory.md), [mapa de páginas LEM-86](page-inventory.md), [assets H01/H02/H03](asset-inventory.md) y [ADR-002](../architecture/adr-002-eyewear-purchase.md). Se inspeccionaron `templates/index.json`, secciones Home, CSS hero/componentes, receta de catálogo y guía/ayuda. Se conserva el outline del template; las instancias Dawn deshabilitadas no crean nuevos módulos.

Figma **sí se accedió en lectura** el 06-11-2026: archivo [Lemoon Ecommerce](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce), página Cover `0:1`. Se localizaron por metadatos y se abrieron capturas reales de:

| Fuente directa | Evidencia local | Reuse / gap |
| --- | --- | --- |
| [Home desktop 60:2](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=60-2), frame 1440×3740 | [PNG](homepage-proposal/references/figma-home-desktop.png) | Reutilizar secuencia editorial→elección→pasos→selección→cierre. Tiene placeholders y claims de envío/reseñas/precios no verificados. No basta como página lista. Metadata del frame aparece sin hijos, aunque captura renderiza contenido; no se infiere que esté vacío. |
| [Home mobile 63:362](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=63-362), 390×2430 | [PNG](homepage-proposal/references/figma-home-mobile.png) | Captura y design_context obtenidos. Reusar lectura vertical, acciones claras y familia tipográfica. Su composición omite módulos del desktop; esta propuesta define continuidad responsive completa. |
| [Direction 02 desktop 269:583](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=269-583), 1200×1920 | [PNG](homepage-proposal/references/figma-direction02-desktop.png) | Exploración, no aprobación. No adoptar paleta/claims de prueba virtual o nuevos estilos comerciales. |
| [Direction 02 mobile 270:583](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=270-583), 390×1750 | [PNG](homepage-proposal/references/figma-direction02-mobile.png) | Mismo límite. No convertir su precio, rating ni botón “probar” en funcionalidad. |
| Components `9:5`, Foundations `9:4` | Metadatos accedidos | Confirmada localización de familias y tokens; no revisión visual completa de biblioteca. Page 4 `73:641` y Page 6 `325:1081` devolvieron canvas sin hijos; Home se encontró en Cover, no se dedujo por parecido. |

No se obtuvo identificador de versión histórica del archivo Figma; se registra fecha de acceso y hashes de las capturas como snapshot, sin inventar aprobación del frame. No se modificó Figma ni se creó otro archivo remoto. La propuesta local **extiende los gaps** de las fuentes anteriores: datos ausentes, orden vigente, viewport intermedio, imagen editorial actual y estados. No es una segunda biblioteca de componentes.

## Dirección seleccionada y alternativas

Se propone conservar la homepage actual y pulir jerarquía/legibilidad con sus familias. Una réplica literal del Figma antiguo mantendría promesas y navegación desactualizadas; una dirección nueva descartaría el outline valorado por el usuario. Se elige la continuidad: producto/editorial primero, navegación por forma y categoría, ayuda de compra condicionada al flujo real y cierre de marca existente. No se adopta otra paleta, tipografía ni sistema de tokens.

### Contrato confirmado frente a propuesta

Confirmado: Urbanist/Hanken; blanco/carbon/navy, warm, lemon puntual; verde solo en `lemoon-about`; logo oficial intacto; slogan «Se te ven bien»; outline del template; categorías principales y nombres/destinos documentados. Confirmado como **contrato de producto**, no como operación: solo marco o cristales adicionales compatibles, precio inicial de marco incluso en sol, según ADR-002.

Propuesto para aprobación de Miguel: H1 visible con el eslogan en panel blanco sobre el hero (el hero actual solo muestra acciones); tiles con rótulo blanco opaco para asegurar contraste en cada crop en lugar del overlay degradado actual; tres pasos ajustados al ADR sin prometer despacho/servicios; texto de marca de muestra reducido al slogan mientras LEM-55 revisa el relato. Son decisiones locales de propuesta; no cambian DESIGN.md ni copy canónica. No hay nueva oferta o capacidad funcional.

## Jerarquía, contenido y condiciones

Orden relativo de las instancias activas de `index.json`, con condiciones de visibilidad explícitas:

| Orden | Bloque / dueño | Composición y contenido | Condición de habilitación |
| --- | --- | --- | --- |
| 0 | Header / announcement compartidos | Referencia a `header-group.json`, `header.liquid`, announcement. Mockup solo reserva shell 72/56px con logo oficial, sin rehacer menú. | Configuración existente y QA de LEM-131; no inventar anuncio. |
| 1 | Hero `lemoon-hero` | Primera pareja editorial slide-2; H1 propuesto «Se te ven bien»; CTAs existentes “Ver todo hombre/mujer”. Imagen dominante; acciones agrupadas abajo, rótulo con contraste estable. | Confirmar destinos con productos. Si un destino no es válido, omitir esa acción; si ninguno lo es, no mostrar CTAs sin función. |
| 2 | `trust-bar` | Omitido en vista canónica; no hueco. | Solo habilitar afirmaciones aprobadas con fuente operativa, condiciones y dueño. No heredar envío gratis/plazos/garantías de Figma o locales. |
| 3 | `lemoon_featured_products` | “Lo nuevo”: título 22px, enlace real “Ver todos”, carrusel card-product; hasta 8. En anatomía se ven 4 slots rotulados sin fotos ni montos ficticios. | Colección `lo-nuevo` y productos elegibles reales; omitido por defecto sin datos. |
| 4 | `lemoon-shop-by-shape` | “Elige tu estilo”, descripción existente, nueve formas/SVG existentes y “Ver todo”. No quiz ni trigger de guía de medidas. | Validar metafields, filtros y resultados; retirar entradas sin destino útil. |
| 5 | `lifestyle-mood-grid` | “Categorías”; ópticos / sol / accesorios; tres escenas genéricas H02, no catálogo de SKU. | Colección/destino confirmado. Pickers de Home se asignan explícitamente en LEM-48: no se heredan de `collection.image`. |
| 6 | `how-it-works` | Panel warm, tres pasos propuestos: elige armazón / elige cómo comprarlos / revisa pedido. Texto en anatomía, sin CTA a configurador futuro ni WhatsApp. | Verificar flujo real y aprobar texto antes de habilitar; omitido por defecto. |
| 7 | `lemoon_best_sellers` | “Más vendidos”, misma familia. | Colección `mejor-vendidos`, datos y criterio comercial real de selección; no es evidencia de ventas por su nombre. |
| 8 | `lemoon_reading` | “Lentes de lectura”, misma familia, sin graduaciones/precios inventados. | `de-lectura` y modalidad de oferta verificada por responsables de catálogo. |
| 9 | `lemoon-about` | Cierre verde existente de dos columnas→una; título “Tu mirada, tu estilo”; slogan aprobado. | Texto definitivo en LEM-55; retirar claims de fabricación propia/calidad universal de la copia base hasta confirmarlos. |
| 10 | Footer / newsletter compartidos | Referencia `footer-group.json`, `footer.liquid`, dueño LEM-94. En mockup solo límites y referencia, sin otra composición de footer. | Preservar implementación existente; newsletter únicamente con su configuración/estados reales, sin segundo signup. |

Prueba social `social-proof-strip`: no existe referencia JSON directa ni fuente de testimonios/reseñas verificadas en lo inspeccionado. Se omite. Para habilitar: fuente real autorizada, permiso de uso, texto/rating/recuento y cálculo trazable, owner y QA; no inventar retratos/logos de prensa. Mantener posición después de selecciones y antes del cierre solo si se aprueba. Beneficios tampoco se sustituyen por sellos de pago/SSL: un asset no verifica una prestación.

Los bloques Dawn `collection_list_1`, `featured_collection`, `image_with_text_1`, `featured_product_1`, `rich_text_1`, `multicolumn_1`, `collage_1`, `video_1`, `featured_blog_1` siguen fuera de la propuesta si están deshabilitados. No crear blog o promo por completar espacio.

## Medidas, tokens y responsive

El archivo `media/lemoon-tokens.css` es copia byte a byte de la base, solo para portabilidad del documento. Se consume con los nombres originales; al implementar se usa el archivo runtime, nunca esta copia. No editarlo como sistema alternativo. `proposal.css` solo compone este artefacto descartable.

| Aspecto | 390 / <750 | 820 / 750–989 | 1440 / ≥990 |
| --- | --- | --- | --- |
| Gutters | 16px | 24px | 42px desde 1280; antes 24 |
| Ancho máximo | Fluido | Fluido | 2000px canónico, header real 2200 |
| Espaciado | 40px sección, 16/24/32px según familia | 64px sección | 64px sección; carrusel 24px abajo |
| Hero | Source móvil; ocupa viewport menos shell/review; CTA permite wrap | Source horizontal; alto máx.760 | Horizontal; máx.680; reserva inferior existente |
| H1 propuesto | Urbanist 600 32/1.2 | 40/1.2 | 40/1.2 |
| H2 | 20/1.2857 base; carrusel 22 local, cierre 28 local | 28 base / 22 carrusel | Igual tablet |
| Body / nota | Hanken 400 16/1.5; notas 12/1.5 solo revisión | Igual | Igual |
| Carrusel | Tarjeta 60% del ancho útil, gap12; scroll interno y peek | Cuatro tarjetas fluidas, gap16 | Cuatro, gap16; hasta 8 al desplazar |
| Formas | 3 columnas, círculo80, gap14/28 | 5 columnas, círculo≤90 | 9 desde1100; 5 entre750–1099 |
| Categorías | Una columna 5:4, gap16 | Tres columnas 5:4, gap24 | Igual tablet |
| Ayuda | Pasos apilados | Tres columnas | Tres columnas |
| Cierre | Una columna, radio18, padding32/24 | Dos columnas44%/resto, radio24, padding32 | Dos columnas, padding56 |

Usar escala semántica de DESIGN, no extender excepciones locales al resto. Navy `--lemoon-text-brand/action-primary`; fondos `surface-page/warm`; accent para acción principal de hero existente. Cierre `surface-tertiary-green` exclusivamente. Botones pill 48px, móvil ≥44; headings y controles deben crecer con zoom/textos largos, sin altura fija ni truncar títulos. Tarjeta Home: reutilizar la familia base de `card-product`, con outer transparente y radio 0; contenedor media warm, radio 12px, proporción 100/96 y altura máxima 280px desde 990px (el tope puede reducir el alto efectivo respecto de la proporción). Una imagen fuente puede ser 1:1: se muestra completa con contain dentro de ese contenedor, no define su geometría. Nombre Hanken 400 13px/16px y precio Urbanist 600 18px/22px, sin overrides de PLP; nombre/variante/precio legibles; omitir rating/quick-add como en template. No precio demo: título de región “Precio del marco” y nota de cristales/tratamientos aparte para ópticos y sol; accesorios usan su precio íntegro, sin esa nota. Impuestos/moneda desde Shopify y consumidor canónico. Mantener SKU/variante sincronizados; un swatch no cambia a una foto genérica.

## Imagen, procedencia y responsables

| Pieza | Fuente reutilizada / crop | Dueño y requisito restante |
| --- | --- | --- |
| Logo | `assets/lemoon-logo-refined-navy.svg`; sin modificar trazados/fill/proporción | LEM-80/131; shell solo referencia. |
| Hero primera escena | `lemoon-hero-slide-2-{desktop,mobile}.jpg`, cover centrado, 1672×941 / 941×1672 | H01 / LEM-78; procedencia externa/licencia de la sesión original no acreditada por inventario: revisar derechos antes de publicar. Se reutiliza en propuesta interna, no se afirma foto de SKU real. |
| Hero segunda escena | `lemoon-hero-youth-{desktop,mobile}.jpg`, mismas dimensiones y política; conservadas en carpeta portable | LEM-78; usar como segundo slide solo con derechos y crop verificados. Artefacto estático muestra primera escena. No usar tercer slide placeholder como final. |
| Categorías | H02 originales 1402×1122; 5:4 cover, primera center20%; rótulo blanco opaco propuesto | LEM-97, generación original registrada en `docs/design/assets/lem-97/generation.json`; no licencia stock inferida ni SKU. LEM-48 asigna picker Home y valida crop. |
| Productos | Ninguna foto inventada; slots de anatomía sin precio/stock/ratings | LEM-71 fotografía real de producto/variante, LEM-93/52 catálogo; no usar `lemoon-product-demo-*` como real. |
| Tipografía | Urbanist y Hanken, familias existentes, bytes descargados desde Google Fonts para revisar offline | Licencias OFL incluidas en media; fuente CSS enlazada por layout actual. No tercera fuente. |
| Formas | Geometría original de `lemoon-frame-shape.liquid` reproducida en artefacto estático | Fuente runtime se reutiliza en implementación; no nueva biblioteca raster. |

Para implementación H01: fuente desktop 750/1100/1500/1800/2400w, móvil 750/1100/1500w según consumidor; `sizes=100vw`, cambio <750, primera eager/high, posteriores lazy. Requerimientos de nuevas entregas 2400×1350 /1500×2667, sin upscale de los actuales. Categorías 360/600/800/1000w, `sizes` 32vw desktop y 100vw móvil; reservar 5:4 y lazy bajo fold. Producto: imagen fuente 1:1 cuando esté disponible, con contain dentro del contenedor canónico 100/96, radio 12px y max-height 280px desde 990px; `sizes` real del carrusel y dpr≤fuente, nunca cortar armazón. El parámetro square del consumidor no sustituye el override `--ratio-percent:96% !important` de la familia base. El artefacto offline carga originales y no simula CDN/optimización Shopify.

Alt: logo “Lemoon”; editorial describir escena real sin nombre de producto; categoría decorativa `alt=""` cuando rótulo del mismo enlace ya nombra destino; producto nombre y vista coherentes con variante, no claims del alt. Sin imagen: fondo warm, texto y CTA válidos; no alt visible roto, ni sustituir por otra oferta. Reservar proporción en carga para evitar salto.

## Estados, navegación y accesibilidad

- Hero: una escena válida elimina navegación/autoplay. Varias: controles anterior/siguiente, selector con `aria-current`, nombre “Diapositiva n de N”, región etiquetada, slide inactivo inert. Área táctil≥44; no duplicar imágenes en árbol accesible. Propuesta para LEM-48: inicio manual sin autoplay; si se mantiene temporizador actual de 4s, añadir pausa visible, detener al foco/hover y al interactuar; reduced-motion desactiva autoplay y transiciones. La discrepancia P2 del binding `assets/lemoon-hero.js` queda en LEM-48, sin fix ni certificación aquí.
- Carruseles: scroll horizontal limitado al track, botones etiquetados y deshabilitados en extremos; sin scroll de página. Teclado y tabulación alcanzan cada enlace real sin trampa; no mover foco al cambiar imagen. Mostrar secundaria en hover solo si cargada; tacto mantiene frontal y navegación normal. Sin media: conservar el contenedor canónico warm 100/96, radio 12px y tope 280px desde 990px, con texto neutro; sin secundaria conservar frontal. Precio cero/agotado fuera según elegibilidad actual; si no queda ningún producto elegible, ocultar título, controles y márgenes, incluso si la colección tenía productos contados.
- Carga: solo anunciar `aria-busy`/status durante petición real; reserva estable, sin shimmer necesario. Error/vacío retira bloque opcional; categoría y navegación compartida conservan acceso al catálogo. No cajas “próximamente” en página canónica. No inventar productos para completar cuatro.
- Categoría/forma: hover cambia superficie o subraya rótulo; foco navy 3px con offset3/4 sobre blanco, sin recorte. On hero añadir base blanca para foco navy visible, sin confiar en amarillo sobre foto clara. Active no debe depender de movimiento; `aria-current` y texto describen selección cuando aplicable. Destino desconocido se omite, no enlace `#` ni disabled ambiguo. El mockup contiene URLs de fuente, **no verificadas como storefront activo**.
- Lectura: un H1, H2 por bloque, H3 productos/pasos, listas semánticas; no ordenar visualmente distinto al DOM. Implementación conserva skip-link del shell; no sticky nuevo. Contraste texto normal≥4.5:1, UI/foco≥3:1, grande≥3:1. Las propuestas de panel blanco dan fondo determinista; validar contraste computado del runtime al integrar. No declarar auditoría WCAG completa por capturas.
- Reflow: nombres y CTAs admiten varias líneas, `min-width:0`, sin clamp de texto esencial; verificar zoom200%/400%, 320px, bordes749/750,989/990,1279/1280. No forzar altura del H1 sobre crop que tape caras. Sin animación decorativa; reduced-motion mantiene estados y operación.

[Estados visuales](homepage-proposal/states.html) incluye imagen ausente, carga, nombre largo, foco/selección/deshabilitado y ausencia de datos. Son diseños de comportamiento para futura integración; no prueban llamadas Shopify ni formularios reales.

## Destinos y datos pendientes

`/collections/opticos-hombre`, `/collections/opticos-mujer`, `/collections/all`, `/collections/opticos`, `/collections/lentes-de-sol`, `/collections/accesorios` proceden del template/mapa LEM-86. Productos: `lo-nuevo`, `mejor-vendidos`, `de-lectura`; tarjetas al `product.url` real. Las nueve formas mantienen query `filter.p.m.custom.frame_shape` y valores del template. No se reorganizan categorías de LEM-47 ni se inventan accesos a quiz LEM-11, guía LEM-129 o configurador LEM-23. Verificación local de rutas documentadas no equivale a HTTP/stock/filtros en Shopify.

## Matriz de aceptación y revisión

| Criterio | Evidencia entregada | Límite / siguiente responsable |
| --- | --- | --- |
| Revisar base antes de frames; reutilizar | SHA base, fuentes y cuatro capturas Figma anteriores | Sin versión histórica Figma; Miguel decide propuesta final. |
| Diseño desktop/mobile editable completo | HTML/CSS portable, [1440](homepage-proposal/home-1440.png), [390](homepage-proposal/home-390.png) | Slots claramente rotulados, no catálogo ficticio. |
| Tablet y responsive | [820](homepage-proposal/home-820.png), tabla de reglas | QA runtime y extremos de breakpoints en LEM-48. |
| Ausencia de datos sin huecos | `?mode=empty` y PNG `empty-{390,820,1440}.png` | Estado por defecto; no prueba datos Shopify. |
| Hero/categorías/destacados/ayuda | Orden y dimensiones arriba, anatomía condicional | Fotos reales/catálogo/derechos y flujo final son dependencias de implementación. |
| Beneficios/prueba social | Omisión explícita y condiciones de habilitación | No existe evidencia suficiente inspeccionada; no se publica muestra. |
| Header/footer compartidos | Referencia a dueños existentes, shell anotado | No revisión visual del header/footer completo ni menú. |
| Assets/contenido requeridos | Tabla fuentes/owners, licencias y manifest hashes | Mensajes propuestos pendientes LEM-55/Miguel. |
| Render real 390/820/1440 | Chromium, `render-check.json`, capturas vistas por autor | Inspección del artefacto, no tienda ni producción. |
| Accesibilidad/estados | Especificación y lámina estados | No auditoría completa ni integración funcional. |
| Revisión humana | Propuesta preparada para Miguel | Pendiente por definición; autor no es reviewer independiente. |

Decisiones concretas para Miguel: (1) aprobar continuidad/orden vigente y visibilidad condicionada, (2) aprobar eslogan como H1 y rótulos de categoría opacos, (3) aprobar dirección de los tres pasos y del cierre sujeto a LEM-55, (4) aprobar inicio manual del hero o exigir pausa si conserva autoplay. No requiere decidir nuevos precios/políticas: se omiten hasta que tengan fuente. La aprobación de este diseño no autoriza publicación ni cierra automáticamente LEM-48.

## Verificación ejecutada del artefacto

Chromium mediante Playwright existente (sin instalación), navegación `file://`, DPR1 y viewport altura900: anatomía y ausencia de datos a 390/820/1440; nueve PNG de propuesta/estados además de cuatro capturas fuente Figma. En anatomía: `scrollWidth == innerWidth` en los tres anchos, cinco imágenes cargadas, ambas fuentes disponibles y un H1. En vacío: cero bloques condicionales en los tres anchos. Lámina de estados sin overflow a los tres anchos; primera tabulación con outline sólido; emulación reduced-motion activa y sin animación. Links/src locales resueltos y snapshot de tokens idéntico al original. El autor abrió visualmente los tres PNG de anatomía, los tres vacíos y estados390: caras, rótulos y textos completos en columnas propias, con peek intencional del siguiente producto en carrusel móvil.

No se ejecutó Theme Check/Vitest porque no se cambió runtime; no se instaló paquete, inició servidor ni usó puerto. Context7 consultado con resolve/query para Playwright `/microsoft/playwright/v1.63.0`; sintaxis de captura/viewport/launch según documentación oficial recuperada. La revisión independiente de marca/tokens y la revisión humana quedan al coordinador: se trabajó sin subagentes según el dispatch; no se declara aislamiento técnico de permisos ni revisión independiente realizada. No hay comprobación de storefront, variantes reales, URLs HTTP, contraste completo o interacción de un carrusel Shopify.

Corrección de tarjeta tras revisión independiente P2: la anatomía usa outer transparente/radio 0 y la familia Home, sin overrides PLP. Verificación computada de las doce tarjetas por ancho: media 214,796875×206,203125px (390), 181×173,75px (820), 327×280px (1440); radio12px y aspecto CSS100/96, con tope280px desde990px; nombre Hanken400 13/16 y precio Urbanist600 18/22 en todos. Fuente de imagen potencial1:1 y geometría de contenedor son conceptos distintos; el fallback conserva la misma media canónica. Se regeneraron solo home/states a tres anchos y sus resultados; empty y cuatro snapshots Figma permanecen intactos. PNG examinados por el autor y métricas completas guardadas en render-check.json/state-check.json; revisión independiente de la corrección y aprobación humana pendientes.
