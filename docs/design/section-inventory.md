# Lemoon — inventario técnico de secciones

Usar [DESIGN.md](DESIGN.md) para valores, responsive, selección de componentes y estados; [design-plan](design-plan.md) organiza las superficies y [remaining-pages-plan](remaining-pages-plan.md) sus dependencias. Este inventario localiza archivos y referencias de template; la asignación CMS se resuelve por página.

## Base Dawn y componentes de página

Referencias declaradas en JSON, incluidas instancias deshabilitadas; no indican asignación CMS ni visibilidad pública.

| Sección existente | Función | Referencias de template/grupo |
| --- | --- | --- |
| [announcement-bar.liquid](../../sections/announcement-bar.liquid) | Top-of-page announcement strip | `sections/header-group.json` |
| [header.liquid](../../sections/header.liquid) | Site header, nav, cart icon | `sections/header-group.json` |
| [footer.liquid](../../sections/footer.liquid) | Site footer | `sections/footer-group.json` |
| [featured-collection.liquid](../../sections/featured-collection.liquid) | Product grid from a collection | `templates/index.json` |
| [featured-product.liquid](../../sections/featured-product.liquid) | Single product spotlight | `templates/index.json` |
| [image-banner.liquid](../../sections/image-banner.liquid) | Full-width image with text overlay | Sin referencia directa |
| [collage.liquid](../../sections/collage.liquid) | Mixed media collage | `templates/index.json` |
| [multicolumn.liquid](../../sections/multicolumn.liquid) | Multi-column text/icon layout | `templates/index.json` |
| [rich-text.liquid](../../sections/rich-text.liquid) | Centered text block | `templates/index.json` |
| [slideshow.liquid](../../sections/slideshow.liquid) | Image slideshow/carousel | Sin referencia directa |
| [video.liquid](../../sections/video.liquid) | Embedded or native video | `templates/index.json` |
| [email-signup-banner.liquid](../../sections/email-signup-banner.liquid) | Newsletter signup CTA | `templates/password.json` |
| [collection-list.liquid](../../sections/collection-list.liquid) | Grid of collection cards | `templates/index.json` |
| [contact-form.liquid](../../sections/contact-form.liquid) | Contact form | Sin referencia directa |
| [main-article.liquid](../../sections/main-article.liquid) | Blog post content | `templates/article.editorial.json`, `templates/article.json` |
| [main-blog.liquid](../../sections/main-blog.liquid) | Blog post listing | `templates/blog.editorial.json`, `templates/blog.json` |
| [main-cart-footer.liquid](../../sections/main-cart-footer.liquid) | Cart totals and checkout CTA | `templates/cart.json` |
| [main-cart-items.liquid](../../sections/main-cart-items.liquid) | Cart line items | `templates/cart.json` |
| [main-collection-banner.liquid](../../sections/main-collection-banner.liquid) | Collection hero banner | `templates/collection.json` |
| [main-collection-product-grid.liquid](../../sections/main-collection-product-grid.liquid) | Collection product grid with filters | `templates/collection.json` |
| [main-page.liquid](../../sections/main-page.liquid) | Generic CMS page content | `templates/page.json` |
| [main-password-footer.liquid](../../sections/main-password-footer.liquid) | Password page footer | Sin referencia directa |
| [main-product.liquid](../../sections/main-product.liquid) | Product detail page (PDP) | `templates/product.json` |
| [main-search.liquid](../../sections/main-search.liquid) | Editorial catalogue search with native predictive search, real paginated results/facets and recovery suggestions | `templates/search.json` |
| [collapsible-content.liquid](../../sections/collapsible-content.liquid) | Accordion / FAQ | Sin referencia directa |

## Secciones Lemoon y referencias de template

Estas referencias proceden de los archivos del repositorio. Un template puede instanciar una sección dentro de otra o mediante un grupo; la ausencia de referencia directa no indica que deba crearse un archivo nuevo.

| Sección existente | Templates que declaran su tipo |
| --- | --- |
| [cart-upsell-row.liquid](../../sections/cart-upsell-row.liquid) | `cart.json` |
| [how-it-works.liquid](../../sections/how-it-works.liquid) | `index.json` |
| [lemoon-about-page.liquid](../../sections/lemoon-about-page.liquid) | `page.nosotros.json` |
| [lemoon-about.liquid](../../sections/lemoon-about.liquid) | `index.json` |
| [lemoon-contact-page.liquid](../../sections/lemoon-contact-page.liquid) | `page.contact.json` |
| [lemoon-crystal-guide.liquid](../../sections/lemoon-crystal-guide.liquid) | `collection.json` |
| [lemoon-design-system.liquid](../../sections/lemoon-design-system.liquid) | `page.sistema-de-diseno.json` |
| [lemoon-eyewear-product.liquid](../../sections/lemoon-eyewear-product.liquid) | `product.optica.json` |
| [lemoon-faq-page.liquid](../../sections/lemoon-faq-page.liquid) | `page.preguntas-frecuentes.json` |
| [lemoon-faq.liquid](../../sections/lemoon-faq.liquid) | `page.preguntas-frecuentes.json` |
| [lemoon-featured-products.liquid](../../sections/lemoon-featured-products.liquid) | `index.json`, `product.json`, `product.optica.json` |
| [lemoon-gift-card-purchase.liquid](../../sections/lemoon-gift-card-purchase.liquid) | `page.gift-card.json`, `product.gift-card.json` |
| [lemoon-guide-page.liquid](../../sections/lemoon-guide-page.liquid) | `page.guia-medidas.json`, `page.guia-pedido.json`, `page.guia-prescripcion.json`, `page.guia-probador.json`, `page.guia-rostro.json` |
| [lemoon-hero.liquid](../../sections/lemoon-hero.liquid) | `index.json` |
| [lemoon-launch-page.liquid](../../sections/lemoon-launch-page.liquid) | `password.json` |
| [lemoon-legal-page.liquid](../../sections/lemoon-legal-page.liquid) | `page.envios-y-entregas.json`, `page.garantias.json`, `page.politica-de-devoluciones.json`, `page.privacidad.json`, `page.terminos-y-condiciones.json` |
| [lemoon-service-page.liquid](../../sections/lemoon-service-page.liquid) | `page.isapres-y-fonasa.json`, `page.operativos-oftalmologicos.json` |
| [lemoon-shop-by-shape.liquid](../../sections/lemoon-shop-by-shape.liquid) | `index.json` |
| [lemoon-style-quiz.liquid](../../sections/lemoon-style-quiz.liquid) | `page.buscar-mi-estilo.json` |
| [lens-configurator.liquid](../../sections/lens-configurator.liquid) | `page.configurador-de-lentes.json`, `product.configurador.json` |
| [lifestyle-mood-grid.liquid](../../sections/lifestyle-mood-grid.liquid) | `index.json` |
| [social-proof-strip.liquid](../../sections/social-proof-strip.liquid) | Sin referencia directa en templates JSON; revisar secciones anidadas/grupos al integrarla |
| [trust-bar.liquid](../../sections/trust-bar.liquid) | `index.json` |

## Integración de políticas y componentes

Las políticas nativas usan el shell de `request.page_type == 'policy'` en [layout/theme.liquid](../../layout/theme.liquid), [lemoon-native-policies.css](../../assets/lemoon-native-policies.css) y [lemoon-native-policy-help](../../snippets/lemoon-native-policy-help.liquid). Las preferencias se comparten con el diálogo del footer mediante [lemoon-cookie-preferences.js](../../assets/lemoon-cookie-preferences.js), sin crear una segunda política.

La selección editorial de armazones usa [lemoon-style-quiz](../../sections/lemoon-style-quiz.liquid): cuatro preguntas, curaduría por bloques de producto, máximo tres resultados disponibles, presupuesto y selección sin JavaScript. La compra de tarjeta regalo usa [lemoon-gift-card-purchase](../../sections/lemoon-gift-card-purchase.liquid): variantes nativas y destinatario opcional con alternativa sin JavaScript. Sus dependencias operativas se mantienen en LEM-11 y LEM-9.

## Historia de exploración

El inventario inicial recogió patrones de Warby Parker, Ace & Tate, Zeelool, Clearly y Zenni: navegación editorial, mood tiles, filtros por forma, confianza y ayuda de compra. Esos referentes explican el origen de ideas, no imponen transparent nav, try-on, precios con cristales, reseñas, entrega estimada, loyalty ni beneficios nuevos. Las secciones todavía no presentes, como UGC, vídeo lookbook o prensa, requieren un ticket propio antes de implementarse. Los antiguos estados de pruebas y aprobación se consultan en el historial de sus entregas.

### Nombres propuestos sin sección independiente

Este es el backlog técnico histórico de nombres, no una orden de crearlos ni una clasificación vigente de capacidades MVP. Verificar la implementación equivalente y el ticket dueño antes de abrir una sección nueva.

| Nombre histórico | Propósito conservado / reutilización |
| --- | --- |
| `whatsapp-float.liquid` | Ayuda flotante contextual; canal y ubicación por superficie |
| `prescription-intent-cta.liquid` | Ayuda de receta en PDP; no sustituye configurador |
| `size-guide-diagram.liquid` | Diagrama de medidas; ya existe familia de snippets de medidas |
| `style-quiz-entry.liquid` | Entrada al recomendador; el quiz actual usa lemoon-style-quiz |
| `ugc-instagram-grid.liquid` | Galería lifestyle/UGC con derechos de uso |
| `loyalty-banner.liquid` | Comunicación de programa de fidelización si existe |
| `virtual-tryon-entry.liquid` | Entrada a probador real; conservar dependencia de capacidad |
| `video-lookbook.liquid` | Vídeo editorial de marca |
| `comparison-table.liquid` | Comparación de tipos de cristal/armazón |
| `press-logos-strip.liquid` | Menciones de prensa verificables |
| `countdown-timer-bar.liquid` | Cuenta regresiva de campaña real |
