# Lemoon — plan técnico de diseño

Implementar la base visual de [DESIGN.md](DESIGN.md). Este plan organiza páginas y dependencias; los valores de color, tipografía, radios, contenedores y estados se definen allí. [Section inventory](section-inventory.md) localiza los archivos y [remaining-pages-plan](remaining-pages-plan.md) conserva el flujo de cristales y dependencias por ticket.

## 1. Estructura de las superficies

### Home

Conservar el orden configurado en [index.json](../../templates/index.json) y los grupos de header/footer. Reutilizar announcement, header, hero editorial, trust bar, navegación por formas, cómo funciona, mood grid, productos destacados, prueba social y newsletter según los tipos existentes del template. Imágenes y señales comerciales proceden de contenido real; no publicar beneficios o reseñas del diseño como datos del negocio.

### Catálogo / colección

Reutilizar [main-collection-product-grid](../../sections/main-collection-product-grid.liquid) y su [CSS PLP](../../assets/lemoon-collection-plp.css). Mantener filtros, orden, contador, paginación y productos de Shopify. El número de columnas procede de settings y de las reglas responsive locales documentadas en DESIGN.md. No crear un directorio duplicado de categorías cuando la colección ya cubre ese destino.

### PDP

Reutilizar [main-product](../../sections/main-product.liquid) y [lemoon-eyewear-product](../../sections/lemoon-eyewear-product.liquid) según el template. Mantener galería, variantes, disponibilidad, precio real, selector de color, especificaciones, diagrama de medidas, carrito y acceso al configurador. La selección de cristales conserva su ticket y contrato de datos; un enlace a WhatsApp es ayuda, no reemplazo del flujo.

Para medidas, reutilizar [lemoon-product-size-guide](../../snippets/lemoon-product-size-guide.liquid) y [lemoon-size-guide-content](../../snippets/lemoon-size-guide-content.liquid): `custom.frame_dimensions` alimenta el diagrama, con estado sin medidas; `custom.frame_size`, forma, material y ajuste alimentan sus paneles. `custom.try_on_url` controla el enlace disponible de probador en la PDP óptica.

Galería: conservar imagen principal, miniaturas, zoom y gestos disponibles. Diagrama: identificar ancho total, lente, puente y varilla con cotas en mm. Acordeones y relacionados reutilizan sus componentes nativos. La información de devolución/garantía depende de condiciones comerciales verificadas.

### Configurador de cristales

Reutilizar [lens-configurator](../../sections/lens-configurator.liquid), [product.configurador.json](../../templates/product.configurador.json) y [page.configurador-de-lentes.json](../../templates/page.configurador-de-lentes.json). El [plan de páginas](remaining-pages-plan.md) registra la referencia refinada y los saltos del recorrido. Usar combinaciones disponibles y precios nativos; las propiedades de línea describen la selección, no sustituyen una variante cobrable.

Preservar estado, resumen de armazón/configuración, precio, selección compatible, captura/revisión de receta y recuperación de errores. La extracción de receta, reglas clínicas y catálogo requieren sus contratos funcionales; no derivarlos de una maqueta.

### Carrito

Conservar formularios y actualizaciones de Dawn: [main-cart-items](../../sections/main-cart-items.liquid), [main-cart-footer](../../sections/main-cart-footer.liquid), [cart drawer](../../snippets/cart-drawer.liquid) y [upsell](../../sections/cart-upsell-row.liquid). Desktop separa productos y resumen; móvil apila con CTA claro. Mostrar variante, propiedades pertinentes, cantidad, eliminar, descuentos y total real. Mantener cálculo de impuestos/envío de Shopify y recuperación ante stock insuficiente o error de actualización.

El upsell usa productos reales configurados; se oculta sin productos o carrito vacío; el agregado directo se ofrece solo para una variante única disponible, y el resto lleva a seleccionar opciones. No añadir barra de envío gratuito, métricas o precios ficticios por aparecer en la planificación histórica.

### Checkout, confirmación y cuentas

Mantener superficies nativas y su editor de branding; aplicar las reglas de superficie de DESIGN.md y las dependencias de LEM-120–125. No especificar formularios de cuentas clásicas para una tienda que usa cuentas nuevas ni portar el header Liquid al checkout. Conservar compra como invitado cuando esté habilitada.

### Contenido y soporte

Reutilizar shells existentes para guías, nosotros, servicios, FAQ, contacto y políticas. Preservar CMS, formularios nativos, destinos de política y consentimiento. Blog y artículo mantienen tags, paginación, contenido, comentarios y share nativos. No confundir shell disponible con contenido final o asignación CMS.

404 mantiene semántica de página no encontrada y acciones de recuperación. Password reutiliza lanzamiento y newsletter con consentimiento. Gift cards usa la superficie nativa de saldo/código/QR y compra desde variantes reales; no emitir crédito ni publicar catálogo al cambiar diseño.

## 2. Componentes compartidos

| Familia | Reutilización |
| --- | --- |
| Header, anuncio y footer | Grupos existentes; logo oficial; navegación y acciones con teclado; enlaces y promociones reales |
| Acciones y formularios | Clases y estados de DESIGN.md §5; traducciones, labels persistentes y validación nativa |
| Product card, swatches y precio | Snippets existentes; tamaños fluidos por grid, datos reales y estado accesible |
| Acordeones | Details/summary y contenido expandible sin altura fija |
| Modales, drawers y medidas | Primitivas existentes de foco, Escape y scroll; dimensiones adaptables al viewport |
| Receta/configuración | Contrato de selección y compatibilidad del ticket; precio cobrado por Shopify |
| Mensajes y carga | Estado vacío, loading, error recuperable y éxito de la función real; anuncios asíncronos |

La biblioteca de variantes editables se mantiene en [LEM-132](https://linear.app/antekera/issue/LEM-132), la identidad extendida en [LEM-80](https://linear.app/antekera/issue/LEM-80) y la voz en [LEM-55](https://linear.app/antekera/issue/LEM-55).

## 3. Secuencia técnica para una página

1. Localizar el template y tipo de sección; reutilizar la familia existente antes de crear otra.
2. Aplicar DESIGN.md y sus excepciones locales; conservar fuentes, responsive y semántica.
3. Conectar datos Shopify/CMS y traducciones; separar contenido de muestra y hechos comerciales.
4. Resolver estados de función y navegación; revisar teclado, foco, zoom, móvil y desktop.
5. Comprobar asignación CMS, rutas y capacidades nativas en el ticket propietario antes de publicación.

## 4. Historia del plan

El plan inicial ordenó tokens → componentes → header/footer → home → colección → PDP → configurador → carrito → soporte → cuentas → checkout. Conserva valor como secuencia de construcción, no como estado de aprobación. Sus checklists iniciales y el configurador de cinco pasos fueron superados por los archivos existentes y el flujo refinado registrado en el plan de páginas. Las antiguas referencias a Fase 2 no difieren el alcance vigente de receta, configurador o cuentas.

Las propuestas iniciales `custom.prescription_intent` y `custom.size_guide_image` no aparecen en los componentes actuales; no son contratos de datos vigentes. Para medidas usar los snippets/metafields descritos en PDP y para receta el contrato del configurador. El apoyo por WhatsApp conserva la idea de contexto de producto en el mensaje, sujeto al canal real configurado.

Las exploraciones de paleta, radios uniformes, grid 1280px y tracking global se reemplazan por las reglas concretas de DESIGN.md. No reintroducirlas desde el historial Git.
