# Lemoon — Plan de Diseño

> Este documento es la fuente de verdad para el diseño del e-commerce. Se consulta al inicio de cada sesión para retomar contexto. Actualizar el estado de cada ítem a medida que avanza el trabajo.

---

## 1. Referencia e identidad visual

### Inspiración principal

**Warby Parker** (warbyparker.com) — e-commerce de óptica direct-to-consumer. Rasgos a replicar:

- Layout limpio, mucho espacio en blanco
- Tipografía sans-serif moderna con jerarquía clara
- Fotografía de producto con fondo blanco o contexto lifestyle minimalista
- Flujo de configuración de lentes paso a paso, muy claro
- Uso inteligente del color para CTAs sin saturar la interfaz

### Paleta de colores

| Token                    | Nombre        | Valor sugerido | Uso                                           |
| ------------------------ | ------------- | -------------- | --------------------------------------------- |
| `--color-primary`        | Navy Night    | `#0D1B3E`      | Headers, CTAs principales, texto destacado    |
| `--color-primary-light`  | Navy Muted    | `#1E3A6E`      | Hover states, bordes activos                  |
| `--color-secondary`      | Lemon Cítrico | `#D4E44B`      | Acento, badges, highlights, hover en nav      |
| `--color-secondary-dark` | Lemon Deep    | `#E6D600`      | Hover del acento                              |
| `--color-surface-warm`   | Beige Claro   | `#F7F4EE`      | Fondos de secciones alternas, tarjetas suaves |
| `--color-background`     | Blanco        | `#FFFFFF`      | Fondo general de página                       |
| `--color-text`           | Carbon        | `#1A1A1A`      | Cuerpo de texto                               |
| `--color-text-muted`     | Gris Medio    | `#6B6B6B`      | Labels, captions, texto secundario            |
| `--color-border`         | Gris Línea    | `#E0DDD8`      | Separadores, bordes de inputs                 |
| `--color-success`        | Verde         | `#2D8C4E`      | Confirmaciones, disponibilidad                |
| `--color-error`          | Rojo          | `#C0392B`      | Errores de formulario                         |
| `--color-primary-alt`    | Navy Alt      | `#0E1A29`      | Variante experimental para pruebas de diseño   |
| `--color-secondary-alt`  | Lemon Alt     | `#FFDD00`      | Variante experimental para pruebas de diseño   |

> Variantes a explorar: sección hero con fondo navy + texto en lemon, secciones de contenido alternas en beige, CTAs en navy con texto blanco. Los tokens `primary-alt` y `secondary-alt` se reservan para pruebas controladas y no sustituyen la paleta aprobada.

### Tipografía

Tipografía dual: **Urbanist** (Google Fonts) para display, headings, CTAs y wordmark; **Source Sans 3** (Google Fonts) para cuerpo, labels y captions, por su legibilidad humanista en UI.

| Rol             | Familia  | Peso | Notas                                 |
| --------------- | -------- | ---- | ------------------------------------- |
| Display / Hero  | Urbanist | 300  | Headlines grandes y ligeros           |
| Heading H1–H2   | Urbanist | 600  | Títulos de página y sección           |
| Heading H3      | Urbanist | 500  | Subtítulos y tarjetas                 |
| Body            | Source Sans 3 | 400  | Cuerpo de texto y descripciones       |
| CTA / Button    | Urbanist | 600  | Uppercase, subtle letter-spacing (0.02em) |
| Caption / Label | Source Sans 3 | 400  | Tamaño reducido, texto secundario     |

### Espaciado y grid

- Base unit: 4px
- Grid: 12 columnas, gutter 24px (desktop) / 16px (mobile)
- Max content width: 1280px
- Section padding default: 64px top/bottom (desktop), 40px (mobile)
- Breakpoints (heredados de Dawn): mobile <750px, tablet 750–989px, desktop ≥990px

---

## 2. Páginas — Estado del diseño

> Estado: `[ ]` pendiente · `[~]` en progreso · `[x]` aprobado

### 2.1 Home (index)

**Secciones en orden vertical — alineadas con LEM-86:**

- `[x]` **Announcement bar** — componente compacto Navy de 32px: promo rotativa a la izquierda; Ayuda, Envíos, Instagram, TikTok y cierre a la derecha
- `[x]` **Header** — componentes desktop y mobile; versión Light implementada en Liquid. Shopify expone sólo logo, navegación y enlace de WhatsApp; el resto responde al código de diseño
- `[x]` **Hero** — desktop y mobile con placeholder editorial pendiente de fotografía final
- `[x]` **Trust bar** — señales de Envío, Devolución, Garantía y WhatsApp
- `[x]` **Featured collections** — tiles Hombre, Mujer, Unisex y Sol
- `[x]` **How it works** — 3 pasos sobre Beige
- `[x]` **Lifestyle mood grid** — tarjetas editoriales de mood
- `[x]` **Featured products carousel** — grilla de productos reutilizando Product Card
- `[x]` **Social proof strip** — banda Navy con reseñas y clientes
- `[x]` **Email signup** — bloque de captura de correo
- `[x]` **Footer** — variantes desktop y mobile

### 2.2 Catálogo / Colección (collection)

- `[x]` **Collection hero** — Navy editorial con placeholder de imagen
- `[x]` **Frame shape filter strip** — filtros de forma
- `[x]` **Filter sidebar** — acordeones desktop
- `[x]` **Sort bar** — orden y contador de resultados
- `[x]` **Product grid** — 3 columnas desktop con Product Card
- `[x]` **Pagination** — CTA “Ver más armazones”

### 2.3 Detalle de producto — PDP (product)

**La página más crítica para conversión — ver LEM-46.**

- `[ ]` **Breadcrumb** — "Inicio › Armazones › Rectangulares", Urbanist 13px Mid Grey
- `[x]` **Media gallery** — galería desktop y media PDP mobile
- `[x]` **Product info panel** — marca, nombre, reseñas, precio y colores
- `[x]` **Swatch selector** — selector visual sin nombre de color en Product Card
- `[x]` **Frame specs mini-grid** — especificaciones y talla
- `[x]` **Size guide diagram** — diálogo de medidas técnicas
- `[x]` **Buy buttons** — carrito y configuración de cristales
- `[ ]` **Prescription intent CTA** — "¿Necesitas cristales?" → WhatsApp deeplink (LEM-42)
- `[ ]` **WhatsApp help link** — "¿Tienes dudas? Consulta por WhatsApp" — Mid Grey 13px
- `[ ]` **Trust icons row** — Envío · Devolución · Garantía en línea horizontal bajo los botones
- `[ ]` **Accordion** — Descripción, Materiales, Ajuste y talla, Cuidado y limpieza
- `[ ]` **Related products** — "También te puede gustar" 4 cards

### 2.4 Configurador de lentes _(custom — no existe aún — ver LEM-86 Fase 2)_

**El flujo diferenciador del negocio. Modal desktop / página full mobile. 5 pasos.**

```
Paso 1        Paso 2         Paso 3           Paso 4       Paso 5
Uso /         Índice /       Tratamiento      Receta       Resumen
Tipo          Material       (multi-select)   (opcional)   + precio
```

- `[ ]` **Stepper** — 5 círculos numerados + etiquetas; completados muestran ✓ navy; activo navy fill
- `[ ]` **Left summary panel** — thumbnail del armazón + precio corriente actualizado en tiempo real
- `[ ]` **Paso 1** — 4 option cards 2×2: Monofocal / Progresivo / Bifocal / Sin graduar; ícono + nombre + precio delta
- `[ ]` **Paso 2** — 4 option cards: Estándar 1.50 / Delgado 1.60 / Ultra 1.67 / Premium 1.74
- `[ ]` **Paso 3** — checkboxes múltiples: Antirreflejo / Filtro azul / Fotocromático / Polarizado / Endurecido
- `[ ]` **Paso 4** — formulario OD/OI: Esfera, Cilindro, Eje, Adición + D.P.; validación de rangos; opción "enviar después"
- `[ ]` **Paso 5** — resumen completo armazón + config + precio total + "Agregar al carrito"
- `[ ]` **Compatibility alert** — aviso si la prescripción requiere índice mínimo superior al seleccionado

### 2.5 Carrito (cart)

- `[ ]` **Line items** — thumbnail, nombre, config lentes en chip Lemon, cantidad stepper, precio, eliminar
- `[ ]` **Order summary sidebar** — subtotal, envío, promo code input, total con IVA, CTA checkout
- `[ ]` **Free shipping progress bar** — barra Lemon indicando cuánto falta para envío gratis
- `[ ]` **Cart upsell row** — "Completa tu pedido": 3 accesorios (estuche, paño, cordón) fondo Beige
- `[ ]` **"Seguir comprando" link** — secundario bajo los items

### 2.6 Checkout (nativo Shopify — solo branding)

- `[ ]` Logo Lemoon en header del checkout
- `[ ]` Colores Navy + Lemon aplicados via Checkout Extensibility
- `[ ]` Urbanist como fuente del checkout
- `[ ]` Order confirmation page — número de pedido, resumen, próximos pasos, CTA "Seguir comprando"

### 2.7 Cuenta de cliente _(ver LEM-86 Fase 2)_

- `[ ]` **Login / Registro** — formulario simple, Urbanist, botón Navy
- `[ ]` **Mis pedidos** — lista con estado, fecha, monto, link "Ver detalle"
- `[ ]` **Perfil** — nombre, email, teléfono, dirección guardada

### 2.8 Páginas de soporte y contenido

- `[ ]` **Sobre nosotros** — historia, propósito, equipo; sección con foto + texto editorial
- `[ ]` **Contacto** — formulario + WhatsApp + horarios de atención
- `[ ]` **Envíos y devoluciones** — política en formato fácil de escanear (íconos + texto corto)
- `[ ]` **Blog listing** — grid de artículos con card imagen + categoría + título + fecha
- `[ ]` **Artículo de blog** — plantilla: header imagen, contenido tipografía editorial, related articles
- `[ ]` **404** — mensaje amigable + links a homepage y colecciones principales
- `[ ]` **Password / Coming soon** — página de lanzamiento con email capture

---

## 3. Componentes — Estado del diseño

### Globales

| Componente              | Descripción                                                              | Estado |
| ----------------------- | ------------------------------------------------------------------------ | ------ |
| Header — desktop        | Componente 1440×72px: logo izq, nav centro, WhatsApp y búsqueda/cuenta/carrito der. La versión Light está implementada en Liquid; el editor expone sólo logo, menú y enlace de WhatsApp. Wordmark fallback, colores, espaciado, iconos y sticky viven en código. La segunda “o” usa Lemon `#F7E600`; hover y current se señalan con subrayado Lemon de 2px. | `[x]`  |
| Header — mobile         | Hamburger izq, logo centro, búsqueda+cart der; drawer nav                | `[x]`  |
| Mega menu               | Dropdown full-width: columnas por género/forma/material + card editorial | `[x]`  |
| Announcement bar        | Componente 1440×32px Navy: promo editable izquierda; Ayuda, Envíos, Instagram, TikTok y cierre blanco a la derecha | `[x]`  |
| Footer — desktop        | 4 columnas sobre Navy; links, newsletter, RRSS, métodos de pago          | `[x]`  |
| Footer — mobile         | Acordeones colapsables + newsletter + íconos sociales                    | `[x]`  |
| Cart drawer             | Panel 420px desde derecha; items + resumen + barra envío gratis          | `[x]`  |
| Cart notification toast | Toast flotante al agregar producto                                       | `[ ]`  |
| Predictive search       | Dropdown con resultados + imágenes en tiempo real                        | `[ ]`  |
| WhatsApp float button   | Botón fijo bottom-right, visible en todas las páginas                    | `[ ]`  |

### Secciones homepage nuevas

| Componente          | Descripción                                                       | Estado |
| ------------------- | ----------------------------------------------------------------- | ------ |
| Trust bar           | 4 íconos + texto sobre Beige; Envío · Devolución · Garantía · WA  | `[ ]`  |
| Frame shape filter  | Pills scrollables horizontales con formas de armazón              | `[ ]`  |
| Lifestyle mood grid | 5 tarjetas editoriales portrait: Minimalista, Ejecutivo, Retro…   | `[ ]`  |
| Social proof strip  | Banda Navy: estrellas Lemon + reviews count + milestone           | `[ ]`  |
| How it works        | 3 pasos sobre Beige con número grande Lemon + ícono + descripción | `[ ]`  |

### Producto y catálogo

| Componente              | Descripción                                                                     | Estado |
| ----------------------- | ------------------------------------------------------------------------------- | ------ |
| Product card — default  | Tile de 400×430px, card e imagen con radius 12px (placeholder gris claro de 400×300px), 3 por fila: fila izquierda con nombre+precio, descripción corta sin color y 4 swatches seleccionables de 20px | `[x]`  |
| Product card — hover    | Segunda imagen fade-in + pills blancos de alto contraste para "Vista rápida" y "Probar →" | `[x]`  |
| Product card — on sale  | Badge "−20%" Lemon + precio actual y precio tachado en la misma primera fila    | `[x]`  |
| Badge "NUEVO"           | Sharp-cornered, 0px border-radius, 1px Navy border, sin fill — estilo editorial | `[ ]`  |
| Swatch                  | Todos de 20px: inactivo con outline Beige Claro; seleccionado con outline Navy de 2px, sin aumentar tamaño | `[ ]`  |
| Price                   | Normal / tachado+descuento / "incluye lentes" label                             | `[ ]`  |
| "Probar →" pill         | Persistente en imagen del card (no solo hover); face+glasses icon               | `[ ]`  |
| Media gallery           | Imagen principal + 4 thumbnails; zoom desktop; swipe mobile                     | `[ ]`  |
| Size guide diagram      | Ilustración técnica con cotas: ancho total, lente, puente, varilla              | `[ ]`  |
| Facets (filtros)        | Sidebar 240px desktop / drawer mobile; acordeones por grupo                     | `[ ]`  |
| Prescription intent CTA | "¿Necesitas cristales?" → WhatsApp deeplink (LEM-42)                            | `[ ]`  |
| Quick add modal         | Modal ligero para agregar al carro sin ir al PDP                                | `[ ]`  |

### Configurador de lentes _(custom)_

| Componente          | Descripción                                                       | Estado |
| ------------------- | ----------------------------------------------------------------- | ------ |
| Stepper             | 5 círculos numerados + etiquetas; ✓ para completados; Navy activo | `[ ]`  |
| Left summary panel  | Thumbnail armazón + precio actualizado en tiempo real             | `[ ]`  |
| Option card         | Seleccionable: ícono + nombre + descripción + precio delta        | `[ ]`  |
| Prescription form   | Inputs OD/OI: Esfera, Cilindro, Eje, Adición, D.P. con validación | `[ ]`  |
| Config summary      | Paso 5: resumen completo selección + precio total + CTA carrito   | `[ ]`  |
| Compatibility alert | Aviso si prescripción requiere índice superior al seleccionado    | `[ ]`  |

### UI genérico

| Componente           | Descripción                                                        | Estado |
| -------------------- | ------------------------------------------------------------------ | ------ |
| Button — primary     | Navy fill, blanco, Urbanist 600 14px uppercase, 48px, 4px radius   | `[ ]`  |
| Button — secondary   | Outline 1px Navy, Navy text, blanco fill; hover: Navy fill         | `[ ]`  |
| Button — accent      | Lemon fill, Carbon text (no blanco — mejor contraste sobre Lemon)  | `[ ]`  |
| Button — ghost       | Sin borde ni fill; solo texto Navy con subrayado; para navegación  | `[ ]`  |
| Input / Textarea     | 48px, fondo blanco y outline Beige Claro (#F7F4EE), 4px radius, contenido alineado a la izquierda; focus: 2px Navy border; variantes sin, con icono izquierdo y con icono derecho (íconos 24px) | `[ ]`  |
| Select               | Mismo estilo que input + chevron ▾ Carbon derecha y outline Beige Claro | `[ ]`  |
| Checkbox / Radio     | 16px, 3px radius; Navy fill con ✓ blanco cuando seleccionado       | `[ ]`  |
| Accordion            | Row 48px tap target, chevron animado, contenido colapsable         | `[ ]`  |
| Modal                | Overlay 50% Navy; contenido blanco, 32px border-radius             | `[ ]`  |
| Free shipping bar    | Barra progreso Lemon fill sobre Line Grey track; label dinámico    | `[ ]`  |
| Toast / Notification | Feedback acciones: Navy bg, blanco texto, 4px radius, auto-dismiss | `[ ]`  |
| Breadcrumb           | "Inicio › Sección › Página" Urbanist 13px Mid Grey con "›"         | `[ ]`  |
| Rating stars         | ★ en Lemon, count en Mid Grey 13px                                 | `[ ]`  |
| Loading spinner      | Thin circle Navy, animated                                         | `[ ]`  |
| Pagination           | Prev / números / Next; activo Navy fill                            | `[ ]`  |

---

## 4. Orden de trabajo recomendado

_Alineado con LEM-86 Fases 1–5 (Sitemap → Wireframes → Design system → Mockups → Prototipo)_

1. **Tokens y brand system** — Colores, tipografía, spacing en Figma (LEM-86 Fase 3)
2. **Componentes base** — Botones (4 variantes), inputs, badges, accordion, modal
3. **Header desktop + mobile** — Con mega menu y drawer; presentes en todas las páginas
4. **Footer desktop + mobile** — Announcement bar incluida
5. **Product card** — Bloque más repetido; definir los 4 estados (default, hover, sale, nuevo)
6. **Home** — Vitrina que valida todo el sistema visual; todas las secciones en orden
7. **Colección / Catálogo** — Hero, filter strip, sidebar, grid
8. **PDP** — La página más crítica para conversión (LEM-46)
9. **Configurador de lentes** — El flujo diferenciador del negocio
10. **Carrito** — Drawer + página completa + upsell
11. **Páginas de soporte** — Contacto, nosotros, envíos, 404
12. **Cuenta de cliente** — Login, pedidos, perfil
13. **Checkout branding** — Logo + colores via Checkout Extensibility

---

## 5. Notas de implementación

- **Configurador de lentes:** `sections/lens-configurator.liquid` con estado en JS; precios delta como line item properties o variantes de producto.
- **Prescription intent CTA:** Solo se muestra si `product.metafields.custom.prescription_intent == true` (LEM-42).
- **Size guide diagram:** Imagen por armazón en `product.metafields.custom.size_guide_image`; fallback a diagrama genérico SVG inline.
- **WhatsApp float:** Link con mensaje pre-completado que incluye nombre del producto actual (si está en PDP).
- **Trust bar y social proof strip:** Contenido editable via section schema (no hardcoded), para actualizar métricas sin código.
- **Lifestyle mood grid y frame shape filter:** Implementar como secciones con bloques editables desde el theme editor.
- **Negative letter-spacing en headings:** Aplicar `-0.03em` a todos los H1–H2 via CSS global — señal de sofisticación más impactante por esfuerzo de implementación.
- **Badge editorial (0px border-radius):** Reemplazar el badge pill estándar de Dawn por el estilo sharp-corner de Ace & Tate para "NUEVO" y "EDICIÓN LIMITADA".

---

## 6. Referencia de archivos clave

| Archivo                               | Propósito                              |
| ------------------------------------- | -------------------------------------- |
| `docs/design/brand-guidelines.md`     | Tokens de color, tipografía, espaciado |
| `docs/design/section-inventory.md`    | Inventario de secciones y su estado    |
| `docs/design/design-plan.md`          | Este documento                         |
| `assets/base.css`                     | Variables CSS globales del tema        |
| `config/settings_schema.json`         | Schema de opciones del theme editor    |
| `locales/en.json` y `locales/es.json` | Strings de traducción                  |
