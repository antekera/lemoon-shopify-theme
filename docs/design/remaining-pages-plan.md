# Lemoon — plan de superficies y dependencias

Aplicar [DESIGN.md](../../DESIGN.md) a las familias existentes, [design-plan](design-plan.md) para arquitectura y [section-inventory](section-inventory.md) para archivos/templates. Este plan conserva dependencias funcionales y de contenido por página; estados de revisión, resultados de pruebas y publicación se registran en el ticket y PR propietarios.

## Referencias de página

La planificación de octubre de 2026 registró [Figma Lemoon Ecommerce](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce), Cart desktop `64:586` y extensión editorial `273:583`: blog `274:583`, artículo `274:649`, búsqueda `274:674`, checkout nativo `274:732`, confirmación `274:783`; mobile `275:583`, `275:634`, `275:665`, `275:706`, `275:742`. Reutilizar la familia existente de cada superficie, sin trasladar nombres, precios, tarifas o direcciones de muestra a datos comerciales.

### Referencia de selección de lentes indicada por el usuario

Usar la página **Flujo de compra de cristales** (`111:583`) y el frame
[Propuesta refinada — pasos, receta con IA y compatibilidad](https://www.figma.com/design/9EgE1vntKfwoQIQTzBUBNg/Lemoon-Ecommerce?node-id=412-979)
(`412:979`), identificado por las cajas claras de los pasos. La entrega histórica registró su
contenido y captura tras la aclaración del usuario. Los frames del Cover
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

## Mapa de entregas

| Ticket / superficie | Base técnica | Dependencia de entrega |
| --- | --- | --- |
| LEM-98 Carrito | `cart.json`, main-cart-items/footer, cart-upsell-row | Variantes, propiedades, totales y recuperación con datos reales |
| LEM-45 Búsqueda | `search.json`, main-search, predictive-search | Resultados, filtros, vacío y recuperación |
| LEM-101 Categorías | PLP y `/collections/all` | Conservar colección; evitar directorio duplicado |
| LEM-99 Ópticos / LEM-100 Sol | Colecciones nativas + PLP | Productos y destinos reales |
| LEM-103–107 Guías de rostro, probador, medidas, prescripción y pedido | lemoon-guide-page y templates alternativos | Asignación CMS, contenido y capacidad real de probador/recetas; LEM-106 debe resolver el canal confirmado de recepción y la privacidad de las recetas antes de publicar su guía |
| LEM-108 Nosotros | page.nosotros, lemoon-about-page | Historia y hechos de negocio verificables |
| LEM-109 Blog / LEM-110 Artículo | blog/article y variantes editorial | Artículo real, tags, paginación, newsletter y asignación editorial |
| LEM-111 Operativos / LEM-112 Isapres y Fonasa | lemoon-service-page | Disponibilidad operativa y convenios confirmados |
| LEM-113 Reembolsos | Shell editorial; `/pages/politicas` (alias `/pages/po`) | Condiciones por confirmar |
| LEM-114 Envíos/devoluciones / LEM-115 Garantías | lemoon-legal-page | Tarifas, plazos, cobertura y exclusiones reales |
| LEM-116 FAQ | lemoon-faq-page | Respuestas y condiciones consistentes con políticas |
| LEM-117 Contacto | page.contact, lemoon-contact-page | Canal público y recepción efectiva del formulario |
| LEM-118 Privacidad | Política nativa + shell y diálogo de preferencias | Finalidades, canales, permisos y píxeles en HTTPS |
| LEM-119 Términos | lemoon-legal-page | Identificación legal y condiciones definitivas |
| LEM-120 Checkout / LEM-121 Confirmación y estado | Editor nativo de branding | Capacidad real, publicación y recorrido de compra |
| LEM-122 Acceso / LEM-123 Perfil/direcciones / LEM-124 Pedidos / LEM-125 Detalle | Cuentas nuevas nativas | Sesión real, persistencia, direcciones, pedidos e aislamiento entre clientes |
| LEM-126 404 | 404.json, main-404 | Respuesta HTTP de no encontrado y acciones de recuperación |
| LEM-11 Encuentra tu lente ideal | page.buscar-mi-estilo, lemoon-style-quiz | Curaduría/catálogo real y asignación CMS |
| LEM-23 Configurador / LEM-102 Cristales | lens-configurator, lemoon-crystal-guide | Catálogo, combinaciones, laboratorio y contrato de receta |
| LEM-9 Gift cards | gift_card.liquid, lemoon-gift-card-purchase, notifications/es | Catálogo, denominaciones, evaluación de viabilidad de monto libre a cargo de LEM-9, emisión, correo y canje operativo |
| Lanzamiento/password | password.json, lemoon-launch-page | Newsletter y autenticación nativa |

Verificar enlaces del footer (LEM-94) y consentimiento (LEM-95) junto con políticas; LEM-44 agrupa carrito/checkout. LEM-86 mantiene el mapa de rutas y asignaciones. El alcance vigente de configurador, receta y cuentas no se difiere por la antigua mención a Fase 2/LEM-31.

## Reglas de entrega por superficie

Mantener contenido CMS y destinos de política nativos. Los templates alternativos de guías, nosotros y servicios necesitan asignación en CMS. Las políticas deben sustituir los datos de muestra por hechos confirmados antes de publicación. La opción `demo_data` conserva el retorno al CMS al desactivarse; no modifica la configuración operativa del negocio. Fuentes de trabajo: [datos comerciales de prueba](../content/commercial-test-data.json) y [notas de políticas](../content/policies-review-notes.md).

El branding nativo usa las opciones disponibles del editor, sin forzar el CSS del storefront. La entrega histórica de checkout registró logo refinado PNG de 120px, header blanco, acento navy, resumen beige `#F7F4EE`, títulos Urbanist y cuerpo Source Sans Pro como adaptación nativa a la ausencia de Hanken Grotesk en ese editor. Esta es una aplicación local; no cambia la familia body del tema. Conservar el borrador nativo hasta la decisión de publicación de su ticket.

No introducir correos, WhatsApp, horarios, devolución de 30 días ni garantía de 365 días como hechos sin confirmación. La auditoría histórica detectó discrepancia entre `ayuda@lemoon.cl` configurado y `hola@lemoon.cl` del footer; el ticket de contacto debe fijar el canal público. El artículo borrador y las tarjetas de regalo requieren sus propias decisiones de publicación; la existencia de plantilla no activa venta ni emite crédito.

Para evaluar una página, comprobar el recorrido principal, vacío/error, teclado y composición móvil/desktop. Las fixtures no demuestran autenticación, entrega de formulario, pago o aislamiento de clientes. Esos criterios se resuelven en el entorno de la superficie y quedan en su handoff. [Índice histórico de previews y pendientes](remaining-pages-review.md).

## Historia de ejecución

La tanda de octubre de 2026 implementó shells editoriales, carrito, búsqueda, 404, guías, quiz y gift cards; registró revisiones locales y de storefront con límites por página. Checkout se preparó como borrador de branding y el primer artículo como borrador editorial. Esos registros pertenecen al historial y a los tickets de entrega; no alteran las reglas visuales de DESIGN.md ni acreditan publicación actual.
