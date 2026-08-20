# Lemoon — Design Prompts for AI Image Generation

> Use these prompts in Midjourney, DALL-E, Adobe Firefly, Figma AI, or any AI design tool.
> Always include the **Brand DNA block** first, then add the specific **module prompt**.
> For Midjourney append `--ar 16:9 --style raw` (desktop) or `--ar 390:844 --style raw` (mobile).

---

## BRAND DNA BLOCK

> Paste this before every module prompt.

```
E-commerce UI design for "Lemoon" — a Chilean direct-to-consumer optical eyewear brand.

Visual DNA:
- Primary inspiration: Warby Parker (clean, editorial, American DTC premium) crossed with Ace & Tate (European cinematic, austere, considered).
- Not a budget brand. Not ultra-luxury. Accessible-premium: quality eyewear at fair prices, delivered with personality.

Color system (exact values):
- Navy Night #0B1F3A — primary: headers, nav, CTA buttons, strong text moments
- Navy Muted #1A3560 — hover states, secondary elements
- Lemon Cítrico #F7E600 — accent only: badges, hover indicators, one CTA variant; never as a large fill
- Beige Claro #F7F4EE — alternating section backgrounds, soft surfaces
- White #FFFFFF — default page background
- Carbon #1A1A1A — body text
- Mid Grey #6B6B6B — labels, captions, secondary text
- Line Grey #E0DDD8 — borders, dividers, input strokes

Typography:
- Font: Urbanist (geometric sans-serif, Google Fonts)
- Display/Hero headlines: Urbanist weight 300, very large (56–72px), slightly negative letter-spacing (-0.5px)
- Section headings: Urbanist weight 600, 28–40px, letter-spacing -0.3px
- Body text: Urbanist weight 400, 16px, normal letter-spacing
- CTAs/Buttons: Urbanist weight 600, 14px, uppercase, letter-spacing 0.08em
- The negative letter-spacing on headings is a key sophistication signal — headlines feel compressed and contemporary, not traditional.

Layout principles:
- Maximum content width: 1280px centered
- Generous whitespace — sections breathe, no visual clutter
- 12-column grid, 24px gutters on desktop
- Clean card components: no heavy shadows, only subtle 1px borders in Line Grey (#E0DDD8)
- Images and photography do the emotional heavy lifting; the UI stays restrained

Brand personality adjectives: confident, approachable, editorial, clean, modern-Latin

Photography style: high-quality lifestyle and product shots, natural light, clean environments, diverse Latin American models
```

---

## 1. GLOBAL COMPONENTS

### 1A. ANNOUNCEMENT BAR

```
[BRAND DNA BLOCK]

Design a slim announcement bar (40px tall) for the very top of the page.
Full-width, background color Navy Night #0B1F3A.
Content: centered white text "Envío gratis a todo Chile en pedidos sobre $70.000" in Urbanist 13px weight 400.
Left side: a small left arrow icon "←" in Lemon #F7E600 for cycling previous message.
Right side: a small right arrow icon "→" in Lemon #F7E600 for next message + an "×" close icon in white, far right.
The bar is dismissible. Ultra-minimal, no decoration. Just a confident dark strip with white text.
```

---

### 1B. HEADER — DESKTOP

```
[BRAND DNA BLOCK]

Design the main site header for desktop (1440px wide viewport, header height 72px).
Background: pure white #FFFFFF with a very subtle 1px bottom border in Line Grey #E0DDD8.

Layout left to right:
- LEFT (25% width): Logo wordmark "lemoon" in Urbanist weight 700, 22px, Navy Night #0B1F3A, all-lowercase. Clean horizontal wordmark, no icon.
- CENTER (50% width): Horizontal navigation links — "Armazones", "Sol", "Progresivos", "Marcas", "Sobre nosotros". Urbanist 15px weight 500, Carbon #1A1A1A. On hover: a 2px Lemon #F7E600 underline appears under the link — not color change, just the yellow underline accent. Generous spacing between links (32px).
- RIGHT (25% width): Three icons right-aligned — magnifying glass (search), person (account), shopping bag (cart) — thin 1.5px stroke line icons in Carbon #1A1A1A. Cart icon has a small circular badge in Navy #0B1F3A with white number "2" inside. A "WhatsApp" text link in small Urbanist 13px with a WhatsApp icon in Mid Grey, before the icons.

The header sits directly below the announcement bar. Together they form a two-tier top element.
Desktop UI mockup, photorealistic, high fidelity.
```

---

### 1C. HEADER — MOBILE

```
[BRAND DNA BLOCK]

Design the mobile header for a 390px wide iPhone screen.
Header height: 56px. Background: white #FFFFFF. Bottom border: 1px Line Grey.

Layout:
- LEFT: Hamburger menu icon (three horizontal lines, 1.5px stroke, Carbon #1A1A1A), 24×24px touch target.
- CENTER: Logo "lemoon" wordmark in Urbanist weight 700, 20px, Navy Night #0B1F3A, centered.
- RIGHT: Search icon (magnifying glass) + shopping bag icon with badge, both 24px, Carbon, with 20px gap between them.

Below the header, show the mobile navigation DRAWER open state (from left edge, 85% screen width, white background, full height):
- Top: large "lemoon" logo + close X button
- Navigation items stacked vertically with 20px padding each: "Armazones", "Sol", "Progresivos", "Marcas", "Sobre nosotros" — Urbanist 18px weight 500, Carbon. Each item has a right-pointing chevron "›".
- Divider Line Grey after the main nav
- Secondary links smaller: "Mi cuenta", "Mis pedidos", "WhatsApp"
- Bottom of drawer: social icons (Instagram, TikTok) in a row

Overlay: the rest of the screen behind the drawer is darkened with 50% opacity black.
Mobile UI mockup, iPhone 14 Pro frame, photorealistic.
```

---

### 1D. MEGA MENU — DESKTOP (Armazones hover)

```
[BRAND DNA BLOCK]

Design a mega menu dropdown that appears when hovering "Armazones" in the desktop nav.
The mega menu drops down below the header, full-width (1280px centered), white background, subtle box-shadow (0 8px 32px rgba(0,0,0,0.08)), border-radius 0 0 8px 8px.

Internal layout — 4 columns:

Column 1 "Por género":
- Heading "Por género" in Urbanist 11px uppercase weight 600, Mid Grey, with 16px margin bottom
- Links: "Hombre", "Mujer", "Unisex" — 15px weight 400, Carbon, 32px line height
- A small Lemon #F7E600 2px left border accent on the hovered link

Column 2 "Por forma":
- Heading "Por forma" same style
- Links with small inline SVG frame shape silhouette icons (16px): "Rectangulares ▭", "Redondos ○", "Cat-Eye ◁", "Aviador ◇", "Oversized □"

Column 3 "Por material":
- "Acetato", "Metal", "Titanio", "TR-90 flexible"

Column 4 "Destacados" — editorial card:
- A small 200×140px lifestyle image placeholder [AI IMAGE: person wearing bold navy glasses, editorial style]
- Below: label "Nueva colección" in Lemon background pill, text Carbon
- Title "Metálicos 2026" in Urbanist 16px weight 600
- CTA link "Ver colección →" in Navy with underline

Bottom strip of mega menu: horizontal scrollable row of frame shape pills: "Todos • Rectangulares • Redondos • Cat-Eye • Aviador • Oversized" — pill shape, 1px border #E0DDD8, 8px border-radius, Urbanist 13px.

The mega menu appears on top of the hero. Behind it the page content is visible but slightly blurred.
```

---

### 1E. FOOTER — DESKTOP

```
[BRAND DNA BLOCK]

Design the site footer, desktop layout, full-width.

Top section (background Navy Night #0B1F3A, 280px tall):
4 columns at 1280px max-width:

Column 1 (logo + description):
- "lemoon" wordmark in white, Urbanist 700, 24px
- Tagline below: "Lentes para la vida real." in Urbanist 300 white, 15px, 24px margin-top
- Social icons below (Instagram, TikTok, WhatsApp) — thin line icons, white, 20px, 24px gap between them

Column 2 "Tienda":
- Heading "Tienda" Urbanist 11px uppercase weight 600, Lemon #F7E600, 16px margin-bottom
- Links: "Armazones", "Sol", "Progresivos", "Marcas", "Novedades", "Ofertas" — Urbanist 14px weight 400, white with 50% opacity, 28px line-height. Hover: full white.

Column 3 "Ayuda":
- Heading "Ayuda" same style as above
- Links: "Guía de talla", "Cómo funciona", "Envíos y devoluciones", "Garantía", "Contacto", "FAQ"

Column 4 "Newsletter":
- Heading "Mantente al día" Urbanist 600 18px white
- Subtext 13px white 60%: "Novedades, ofertas y guías de estilo."
- Email input: dark field (#1A3560 background, white text, 1px Line Grey border, 8px border-radius, placeholder "Tu correo electrónico")
- Below: pill button "Suscribirse" — Lemon #F7E600 background, Carbon text, Urbanist 600 13px uppercase

Bottom strip (background #060E1F even darker, 56px tall):
- Left: "© 2026 Lemoon. Todos los derechos reservados." Urbanist 12px white 50%
- Center: "Política de privacidad · Términos y condiciones" — links, same size, white 50%
- Right: payment method icons in a row — Webpay Plus, Visa, Mastercard, Transferencia — white/greyscale versions, 24px tall

The footer feels sophisticated and confident, not heavy or corporate.
```

---

### 1F. FOOTER — MOBILE

```
[BRAND DNA BLOCK]

Design the mobile footer (390px wide) with Navy Night #0B1F3A background.

Stacked layout:
1. Logo "lemoon" centered, white, 22px
2. Tagline "Lentes para la vida real." centered, white 60%, 14px
3. Social icons row centered: Instagram, TikTok, WhatsApp — white, 22px each, 24px gap
4. Divider line 1px white 15%
5. Accordion nav sections — each a tappable row with label + "+" icon, expands to show links:
   - "Tienda" → links list
   - "Ayuda" → links list
6. Newsletter section: full-width email input (dark field) + "Suscribirse" button in Lemon
7. Bottom: payment icons row centered, copyright text centered below

All tap targets minimum 44px tall. Clean, minimal, no wasted space.
Mobile UI mockup.
```

---

### 1G. CART DRAWER

```
[BRAND DNA BLOCK]

Design a cart sidebar drawer (slide-in from right) on a desktop product page.
Drawer width: 420px. Background: white. Left edge: 1px border Line Grey.

Header:
- "Tu carrito (2)" — Urbanist 18px weight 600, Carbon, left-aligned
- "×" close icon right-aligned, Carbon, 24px

Product items list (2 items shown):
Item 1:
- 80×80px product thumbnail (eyeglasses on white bg, rounded corners 4px)
- Right of thumbnail: product name "Dalton — Tortoise" Urbanist 15px weight 500
- Below name: "Sin graduar · Solo armazón" in Mid Grey 13px
- Price "$89.990" right-aligned, Navy weight 600
- Quantity stepper: "−  1  +" in a subtle bordered row, 32px tall
- "Eliminar" link in small Mid Grey text, 12px

Item 2 (with lens config):
- Same thumbnail style
- Name + "Progresivo · Índice 1.67 · Antirreflejo" in Lemon #F7E600 chip below name (small pill, 11px)
- Price "$184.990"

Divider line between items.

Bottom panel (sticky):
- "Subtotal" row: left label, right amount Urbanist 600
- Free shipping progress bar: thin bar, Lemon fill, "Te faltan $15.000 para envío gratis" below in 12px Mid Grey
- Primary CTA button full-width: Navy #0B1F3A fill, white text "Ir al checkout →", Urbanist 600 14px uppercase, 48px tall, 6px border-radius
- Secondary link below center-aligned: "← Seguir comprando" in Navy, 14px, underline

The drawer overlaps the page content with a dark 40% opacity overlay behind it.
Desktop UI, photorealistic high-fidelity mockup.
```

---

## 2. HOMEPAGE SECTIONS

### 2A. HERO — DESKTOP

```
[BRAND DNA BLOCK]

Design the homepage hero section, desktop, 1440px wide, full viewport height (100vh minus the 112px header stack).

Layout: split — LEFT 45% text, RIGHT 55% photography.

LEFT PANEL (white background, content vertically centered, 80px left padding):
- Small eyebrow text above headline: "Nueva colección 2026" — Urbanist 11px weight 600 uppercase, Lemon #F7E600, letter-spacing 0.1em
- Main headline (2 lines): "Lentes que te definen." — Urbanist weight 300 (ultra-light), 68px, Navy Night #0B1F3A, letter-spacing -0.5px, line-height 1.1. The large and light weight creates elegant editorial impact.
- Subheadline below: "Armazones de calidad con envío a todo Chile." — Urbanist 400, 18px, Mid Grey #6B6B6B, margin-top 20px
- CTA row below (margin-top 40px):
  * Primary button "Ver colección →" — Navy #0B1F3A fill, white Urbanist 600 14px uppercase, letter-spacing 0.08em, 48px tall, 24px horizontal padding, 24px border-radius
  * Secondary button "Guía de estilo" — outline style, 1px Navy border, Navy text, same size, 20px left margin
- Small trust line below buttons (margin-top 24px): "✓ Envío gratis sobre $70.000  ·  ✓ Devolución en 30 días" — Urbanist 13px weight 400, Mid Grey

RIGHT PANEL: Full-bleed lifestyle photography placeholder — [AI IMAGE: Latin American woman, 25-35 years old, wearing bold rectangular acetate glasses in tortoise brown, smiling naturally, standing in a well-lit minimal interior with white walls and warm afternoon light, editorial quality, shot from mid-torso up]. Image fills the entire right panel with no padding, touches top and bottom edges.

The split is crisp — no diagonal, no overlap. Left is the brand voice; right is the brand vision.
Desktop UI mockup, photorealistic.
```

---

### 2B. HERO — MOBILE

```
[BRAND DNA BLOCK]

Design the mobile hero section (390px wide, 580px tall).

Stacked layout (image top, text bottom):

TOP (60% of height): full-bleed lifestyle photo — [AI IMAGE: close-up of a person wearing oversized round glasses in solid olive green, natural outdoor light, editorial portrait, warm Latin American skin tone, soft background bokeh]. Image fills edge to edge, no padding.

BOTTOM (40% of height, white background, 24px padding all sides):
- Eyebrow: "Nueva colección" — Urbanist 11px uppercase weight 600, Lemon #F7E600
- Headline: "Lentes que te definen." — Urbanist 300, 36px, Navy, letter-spacing -0.3px, line-height 1.1
- CTA button full-width: "Ver colección →" — Navy fill, white text, Urbanist 600 13px uppercase, 48px tall, 24px border-radius, margin-top 20px
- Below button: "Envío gratis sobre $70.000" — 12px Mid Grey centered

The image-over-text stack is clean and fast to load. No complex overlays. The text panel feels grounded and safe on mobile.
```

---

### 2C. TRUST BAR (below hero)

```
[BRAND DNA BLOCK]

Design a horizontal trust signals strip, full-width, immediately below the hero.
Background: Beige Claro #F7F4EE. Height: 72px desktop / 56px mobile.
Content: 4 equally spaced items, each with a thin-line icon (20px, Navy #0B1F3A) + text below.

Item 1: Package icon — "Envío a todo Chile"
Item 2: Return arrow icon — "30 días de devolución"
Item 3: Shield icon — "Garantía de calidad"
Item 4: WhatsApp icon — "Atención personalizada"

Each item: icon centered above text. Text: Urbanist 13px weight 500, Carbon #1A1A1A.
Vertical dividers (1px Line Grey) between items on desktop.
On mobile: 2×2 grid (two rows of two).

Simple, scannable, no color gimmicks. This is a reassurance layer, not a promotional one.
```

---

### 2D. FEATURED COLLECTIONS GRID

```
[BRAND DNA BLOCK]

Design a "Explora por estilo" section on white background.
Section heading left-aligned: "Explora por estilo" — Urbanist 600, 36px, Navy, letter-spacing -0.3px.
Subheading below: "Encuentra el armazón que va contigo." — Urbanist 400, 16px, Mid Grey.

Below heading: 4-tile grid (desktop: 4 columns equal width; mobile: 2×2).

Each tile is a tall card (aspect ratio 3:4, like a portrait card) with:
- Full-bleed lifestyle image filling the card [placeholder label inside the image area]
- Bottom overlay gradient: transparent → 60% Navy #0B1F3A at bottom
- Bottom text (over gradient): collection name "Hombre" / "Mujer" / "Unisex" / "Sol" — Urbanist 600 20px white
- Below collection name: "→ Ver todos" — Urbanist 400 14px white 70%

The 4 image placeholders:
- Tile 1 "Hombre": [AI IMAGE: Latin man, 30s, wearing sharp rectangular metal frames, confident expression, minimal studio background]
- Tile 2 "Mujer": [AI IMAGE: Latin woman, 20s, wearing oversized cat-eye acetate frames, editorial fashion portrait]
- Tile 3 "Unisex": [AI IMAGE: two friends wearing matching round frames, casual outdoor setting]
- Tile 4 "Sol": [AI IMAGE: person wearing polarized aviator sunglasses, bright outdoor sunlight, candid lifestyle]

Cards have 8px border-radius, no gap between tiles on mobile (full bleed collection grid effect).
Section has 80px top/bottom padding.
Desktop UI mockup.
```

---

### 2E. HOW IT WORKS

```
[BRAND DNA BLOCK]

Design a "Cómo funciona" section on Beige Claro #F7F4EE background.
Section padding: 80px top/bottom.
Center-aligned section heading: "Tan fácil como 1, 2, 3." — Urbanist 300, 48px, Navy, letter-spacing -0.4px.

Below: 3-column layout (desktop). Each column:
- Large step number "01" / "02" / "03" — Urbanist 300, 64px, Lemon #F7E600. The large number is a decorative anchor, not the focus.
- Below number: thin-line icon (32px, Navy) — Step 1: glasses frame icon, Step 2: settings/sliders icon, Step 3: delivery box icon
- Below icon: Step title — Urbanist 600, 20px, Navy. "Elige tu armazón" / "Configura tus lentes" / "Recíbelos en casa"
- Below title: description — Urbanist 400, 15px, Mid Grey, line-height 1.6. Max 2 lines.
  Step 1: "Navega nuestra colección y encuentra el estilo que va contigo."
  Step 2: "Elige tipo de lente, material y tratamiento. O déjalo sin graduar."
  Step 3: "Despachamos a todo Chile. Llegan en 5–7 días hábiles."

A subtle vertical dotted line (1px dashed, Line Grey) connects the three columns between steps.
Mobile: steps stack vertically with a horizontal dotted line replaced by a vertical connector on the left.
```

---

### 2F. LIFESTYLE MOOD CATEGORIES

```
[BRAND DNA BLOCK]

Design an editorial "Encuentra tu estilo" section on white background.
This section uses lifestyle mood categories (inspired by Zeelool's "Urban Chic", "Quiet Luxury" approach) — not product categories, but style tribe identities.

Section heading left-aligned: "Encuentra tu estilo." — Urbanist 300, 48px, Navy, letter-spacing -0.4px.
Subheading: "Todos los armazones, una actitud." — Urbanist 400, 16px, Mid Grey.

Below: horizontal scrollable row of 5 large editorial cards (each 280×380px, portrait orientation, no gap between them — edge-to-edge cinematic feel):

Card 1 "Minimalista": [AI IMAGE: person in clean white shirt, wearing minimal thin-frame rectangular glasses, neutral background, Scandinavian-minimalist editorial vibe]
- Bottom text overlay: "Minimalista" — Urbanist 300 28px white, letter-spacing -0.2px
- Pill tag: "Metal · Titanio" — small, 1px white border, white text, 11px Urbanist

Card 2 "Ejecutivo": [AI IMAGE: person in tailored navy suit jacket, wearing bold square acetate frames in dark brown tortoise, confident corporate portrait]
- "Ejecutivo"

Card 3 "Retro": [AI IMAGE: person with vintage aesthetic, wearing round keyhole-bridge frames, warm film photography look, 70s inspiration]
- "Retro"

Card 4 "Casual": [AI IMAGE: person outdoors in casual weekend wear, wearing oversized transparent frames, relaxed and friendly energy]
- "Casual"

Card 5 "Sol & Lifestyle": [AI IMAGE: person at the beach or urban outdoors, large sunglasses, movement and energy]
- "Sol & Lifestyle"

Each card: full bleed image, gradient overlay at bottom (0% → 70% Navy). The cards are tall and immersive. On hover (desktop): a subtle "Ver looks →" pill appears center-bottom of the card.
Section has 80px top/bottom padding.
```

---

### 2G. FEATURED PRODUCTS CAROUSEL

```
[BRAND DNA BLOCK]

Design a "Más vendidos" section on white background.
Section heading: "Más vendidos" — Urbanist 600, 36px, Navy, left-aligned.
Right of heading: "Ver todos →" link in Navy 14px, right-aligned, same row.

Below: horizontal carousel of 4 product cards visible (with partial 5th peeking at right edge).

Each product card (aspect ratio: portrait, ~280×380px):
- TOP: product image (square or slightly portrait) — eyeglasses flat-lay on white/off-white background, front-view, centered. Image takes 65% of card height. Background: very light grey #F7F4EE.
- BOTTOM section (white, 16px padding):
  - Frame name: "Dalton" — Urbanist 500, 15px, Carbon
  - Color descriptor: "Tortoise Brown" — Urbanist 400, 13px, Mid Grey
  - Color swatch dots row: 3–4 small circles (10px diameter), each the actual color. Selected swatch has a 2px outer ring in Navy.
  - Price row: "$89.990" — Urbanist 600, 16px, Navy. If on sale: strikethrough grey original price + bold Navy sale price.
  - "Edición limitada" badge (if applicable): small sharp-cornered rectangle, 1px Navy border, Navy text "NUEVO", white fill — editorial, no color fill, Ace & Tate style.

Card has no shadow, just a 1px Line Grey border on all sides. No border-radius or very subtle (4px).
Bottom-right of product image: persistent small pill "Probar →" with a face/glasses icon — always visible (not hover-only), 12px Urbanist, Light Grey background, Carbon text.
Top-left of card: heart/wishlist icon (outline), 20px, Mid Grey.

Carousel navigation: two minimal arrow buttons (left/right) as thin-stroked circles outside the carousel track.
```

---

### 2H. SOCIAL PROOF / TRUSTPILOT STRIP

```
[BRAND DNA BLOCK]

Design a social proof strip on Navy Night #0B1F3A background, full-width, 96px tall.
Content: single centered row with 3 items separated by 1px white 20% dividers.

Left item: "★★★★★" in Lemon #F7E600 (five stars, 16px) + below: "4.8 de 5 · 840 reseñas" — Urbanist 400, 13px, white 70%

Center item: Large statement — "Más de 3.000 clientes en Chile" — Urbanist 600, 20px, white. Below: "nos eligen cada mes." — Urbanist 300, 16px, white 60%

Right item: Press logos or certification icons — "Pago seguro" (lock icon) + "Webpay Plus" logo in white + "SSL" badge — or alternatively 3 short press mentions in white italic text ("'Lo mejor en óptica online'" — Medium, 2025)

This strip breaks the page visually as a dark confidence band. Short and impactful.
```

---

### 2I. EMAIL SIGNUP BANNER

```
[BRAND DNA BLOCK]

Design a newsletter signup section, full-width.
Background: split — LEFT half Beige Claro #F7F4EE, RIGHT half white. Or alternatively, a subtle full-bleed background image [AI IMAGE: close-up flat-lay of stylish eyeglasses on a warm beige linen surface, editorial product shot, top-down view] with a light overlay.

Content centered at 1280px max-width:
- Heading: "¿Primero en enterarte?" — Urbanist 300, 42px, Navy, letter-spacing -0.4px
- Subheading: "Suscríbete y recibe antes que nadie las nuevas colecciones, guías de estilo y ofertas exclusivas." — Urbanist 400, 16px, Mid Grey, max-width 480px, centered
- Email input + button row:
  * Input: 320px wide, 48px tall, Urbanist 400 16px, placeholder "Tu correo electrónico", 1px Line Grey border, 24px border-radius, white background
  * Button immediately right: "Suscribirse" — Navy fill, white Urbanist 600 14px uppercase, 48px tall, 24px border-radius, no gap between input and button (they look like one connected unit)
- Fine print below: "Sin spam. Puedes darte de baja cuando quieras." — Urbanist 400, 12px, Mid Grey, centered

Section padding: 80px top/bottom. Elegant, editorial, not a typical newsletter CTA.
```

---

## 3. COLLECTION / CATALOG PAGE

### 3A. COLLECTION PAGE — DESKTOP

```
[BRAND DNA BLOCK]

Design the eyeglasses collection page (PLP), desktop, 1440px.

TOP: Collection hero banner (280px tall, full-width):
- Background: Navy Night #0B1F3A
- Left-aligned text (80px left margin, vertically centered):
  * Eyebrow: "128 armazones" — Urbanist 11px uppercase, Lemon #F7E600
  * Heading: "Armazones" — Urbanist 300, 56px, white, letter-spacing -0.5px
  * Description: "Diseños que se adaptan a tu estilo y a tu receta." — Urbanist 400, 16px, white 60%
- Right: partial lifestyle image — [AI IMAGE: editorial product flat-lay, multiple glasses frames arranged aesthetically on white marble surface] — image bleeds from center to right edge, with a gradient fade from Navy on left to image on right

FRAME SHAPE FILTER STRIP (48px tall, white background, border-bottom 1px Line Grey):
- Horizontally scrollable row of shape pills: "Todos • Rectangulares ▭ • Redondos ○ • Cat-Eye ◁ • Aviador ◇ • Cuadrados □ • Oversized" — each pill: Urbanist 13px, 1px Line Grey border, 20px horizontal padding, 36px tall, 20px border-radius. Selected pill: Navy fill, white text.

MAIN CONTENT AREA (below hero + filter strip):
- LEFT SIDEBAR (240px wide): filter panel
  * "Filtrar" heading Urbanist 600 16px Carbon
  * Filter groups as accordions (+ to expand): "Género" · "Forma" · "Material" · "Color" · "Precio"
  * Each filter option: checkbox + label, Urbanist 14px Carbon, 36px tall tap target
  * Selected filters appear as removable chips above the sidebar

- RIGHT CONTENT (flexible width, 32px left margin):
  * Sort bar: "Ordenar por: Relevancia ▾" right-aligned, Urbanist 14px
  * 3-column product grid, 24px gap between cards
  * 12 product cards visible (4 rows × 3 columns)
  * At bottom: "Ver más armazones →" button centered, outline style Navy

Desktop UI, photorealistic.
```

---

## 4. PRODUCT DETAIL PAGE (PDP)

### 4A. PDP — DESKTOP (above the fold)

```
[BRAND DNA BLOCK]

Design the product detail page for a specific eyeglasses frame, desktop, 1440px.

TOP: breadcrumb — "Inicio › Armazones › Rectangulares" — Urbanist 13px, Mid Grey, with "›" separators. 16px below the header.

MAIN LAYOUT (two columns, 60/40 split):

LEFT — MEDIA GALLERY (60%):
- Main image: large square (680×680px), light grey background #F7F4EE, eyeglasses centered flat-lay — [AI IMAGE: high-quality studio shot of rectangular acetate frames in tortoise brown, front view, centered on light grey background, professional product photography]
- Below main image: row of 4 thumbnail images (each 120×120px, 12px gap):
  * Thumbnail 1: front view (selected — 2px Navy border)
  * Thumbnail 2: side/profile view
  * Thumbnail 3: 45° angle view
  * Thumbnail 4: person wearing them [AI IMAGE: person wearing the glasses lifestyle shot]
- Bottom-right of main image: "🔍" zoom icon pill button — small, white background, Carbon text, Urbanist 12px "Zoom"

RIGHT — PRODUCT INFO (40%, 48px left padding):
- Brand label: "Lemoon" — Urbanist 11px uppercase weight 600, Mid Grey, letter-spacing 0.1em
- Product name H1: "Dalton" — Urbanist 600, 36px, Navy, letter-spacing -0.3px, margin-top 4px
- Star rating row: "★★★★★ 4.8 (127 reseñas)" — stars in Lemon, text in Mid Grey 13px
- Price block (margin-top 20px):
  * "$89.990" — Urbanist 700, 32px, Navy
  * "Solo armazón · IVA incluido" — Urbanist 400, 13px, Mid Grey, same row
- Color selector (margin-top 24px):
  * Label: "Color: Tortoise Brown" — Urbanist 500, 14px, Carbon
  * Swatch row: 4 circle swatches (24px diameter), 12px gap. Selected: 2px Navy outer ring. Colors: tortoise, black, transparent, olive.
- Frame specifications (margin-top 20px, subtle divider above):
  * Small grid of specs: "Forma: Rectangular · Material: Acetato · Lente: 52mm · Puente: 18mm · Varilla: 145mm" — displayed as a 3-column micro-grid, Urbanist 13px, Mid Grey labels / Carbon values.
  * "Guía de talla ›" link in Navy 13px below specs, with a ruler icon
- CTA block (margin-top 28px):
  * Primary button full-width: "Agregar al carrito" — Navy fill, white Urbanist 600 15px uppercase, 52px tall, 24px border-radius
  * Secondary button full-width below (8px gap): "Configurar con cristales →" — Lemon #F7E600 fill, Carbon Urbanist 600 15px uppercase, 52px tall, 24px border-radius. This is the configurator entry point.
  * Below buttons: "💬 ¿Necesitas ayuda? Consulta por WhatsApp" — Mid Grey 13px with WhatsApp icon, centered
- Trust icons row (margin-top 24px): "🚚 Envío en 5–7 días · ↩ 30 días devolución · ✓ Garantía 1 año" — icons 14px Carbon, text Urbanist 13px Mid Grey, separated by · dots.

Desktop UI, photorealistic, full detail.
```

---

### 4B. PDP — SIZE GUIDE DIAGRAM

```
[BRAND DNA BLOCK]

Design an eyeglasses size guide diagram component that appears in an accordion or modal on the product page.

Content: Clean technical illustration of eyeglasses (front view) with dimension arrows.

The illustration style: minimal thin-line art (1.5px stroke), glasses in Carbon #1A1A1A, dimension arrows in Navy #0B1F3A, measurement labels in Urbanist 12px Mid Grey.

Dimensions shown with two-headed arrows and labels:
- Total frame width: ← 140mm → (arrow spans full width of frame)
- Lens width: ← 52mm → (arrow spans one lens)
- Bridge width: ← 18mm → (arrow spans the nose bridge)
- Temple arm length: 145mm → (shown on the side, arrow going right from hinge)

Below the diagram: a sizing guide in 3 columns:
- "S / Angosto" · "M / Estándar" · "L / Ancho"
- Each with the frame width range in mm (e.g., "< 130mm · 130–142mm · > 142mm")

Background: white. Component padding: 24px. Very clean, utilitarian, trustworthy.
A subtle caption below: "Encuentra tu talla midiendo tus armazones actuales de punta a punta."
```

---

### 4C. PDP — MOBILE

```
[BRAND DNA BLOCK]

Design the product detail page on mobile (390px wide).

Top: swipeable image carousel, full-width, square aspect ratio, light grey background. Below image: dot indicators (3 dots, active in Navy).

Below image: product info stacked:
- "Lemoon" brand label — 11px uppercase Mid Grey
- "Dalton" — Urbanist 600 28px Navy, letter-spacing -0.3px
- Stars + reviews count — 13px
- "$89.990" — Urbanist 700 28px Navy
- "Solo armazón · IVA incluido" — 13px Mid Grey
- Color swatches (24px circles, 12px gap)
- Specs in 2-column mini-grid (3 rows): Shape, Material, Width, Bridge, Temple

STICKY BOTTOM BAR (fixed at bottom, 80px tall, white background, shadow above):
- Left: "$89.990" Urbanist 700 22px Navy
- Right: "Agregar al carrito" Navy button (full-width or right 60%) Urbanist 600 14px uppercase, 48px tall

Below sticky bar (scrollable content): Secondary "Configurar con cristales →" button in Lemon, then WhatsApp CTA, then accordion accordions (Descripción, Materiales, Envíos).

Bottom: Related products horizontal scroll.
Mobile UI, iPhone 14 Pro frame, photorealistic.
```

---

## 5. LENS CONFIGURATOR

### 5A. CONFIGURATOR — STEP 1 (Tipo de lente)

```
[BRAND DNA BLOCK]

Design Step 1 of the lens configurator — a full-page modal overlay on desktop (or full page on mobile).

DESKTOP LAYOUT (modal, 900px wide, centered, white background, 32px border-radius):

LEFT PANEL (300px, sticky):
- Product thumbnail 200×200px (the selected eyeglasses frame)
- Frame name "Dalton — Tortoise Brown" below, Urbanist 500 16px Carbon
- Running price total: "Solo armazón: $89.990" → will update as options are selected
- Grey divider
- "Resumen de tu configuración:" — Urbanist 600 13px Carbon
- Empty config list (will populate): "Tipo de lente: —" etc. in 13px Mid Grey

CENTER CONTENT (flex remaining width, 40px padding):
- Progress stepper at top: 5 numbered circles in a horizontal row connected by a line. Step 1 circle: filled Navy, white "1". Steps 2–5: empty circles with Line Grey border, number in Mid Grey. Labels below each circle: "Uso", "Material", "Tratamiento", "Receta", "Resumen" — Urbanist 11px.
- Heading: "¿Para qué usarás tus lentes?" — Urbanist 600, 28px, Navy, letter-spacing -0.3px, margin-top 32px
- Subheading: "Selecciona el tipo de uso principal." — Urbanist 400, 15px, Mid Grey

Option cards — 2×2 grid:
Each card (200×160px, 8px border-radius, 1px Line Grey border):
- Top: thin-line icon 32px (Navy) — sun icon / book icon / landscape icon / sparkle icon
- Card name: "Monofocal" / "Progresivo" / "Bifocal" / "Sin graduar" — Urbanist 600, 16px, Carbon
- Description: 1 line, 12px Mid Grey
- Price indicator: "Desde $29.990" / "Desde $89.990" / "Desde $49.990" / "Incluido" — Urbanist 500, 13px, Navy

Selected card state: 2px Navy border all sides, very subtle Navy tint background (#F0F3FA). Unselected: 1px Line Grey, white background.

BOTTOM ACTION BAR:
- Left: "← Volver" ghost button
- Right: "Continuar →" Navy button, 48px tall, Urbanist 600 14px uppercase — disabled (grey) until selection made, active (Navy) once selected.
```

---

### 5B. CONFIGURATOR — STEP 4 (Receta / Prescription)

```
[BRAND DNA BLOCK]

Design Step 4 of the lens configurator — the prescription entry form. Desktop modal, same layout as Step 1 (left panel summary + center content).

Progress stepper: Step 4 active, steps 1–3 showing checkmarks (✓) in Navy, step 4 filled Navy.

Heading: "Ingresa tu receta." — Urbanist 600, 28px, Navy, letter-spacing -0.3px
Subheading: "Encuéntrala en tu receta médica." — Urbanist 400, 15px, Mid Grey. Link: "¿Dónde encuentro mi receta? ›" in Navy 13px with underline.

FORM LAYOUT — two columns side by side:
Column 1 "Ojo Derecho (OD)":
- Column heading: "Ojo Derecho — OD" Urbanist 600 14px Navy
- 4 input fields stacked:
  * "Esfera" — input with placeholder "+0.00" or "-0.00"
  * "Cilindro" — placeholder "-0.00"
  * "Eje" — placeholder "0°" (0–180)
  * "Adición" — placeholder "+0.00" (only if Progresivo)
- Each field: label above (Urbanist 11px uppercase weight 600, Mid Grey), input 48px tall, full-width column, 1px Line Grey border, 24px border-radius, Urbanist 400 16px Carbon value

Column 2 "Ojo Izquierdo (OI)": mirror of column 1

Below both columns: "D.P. — Distancia Pupilar" single input spanning full width, with a small "ⓘ" info tooltip icon next to the label in Lemon.

Divider below.

Secondary option: "No tengo mi receta ahora" link — Urbanist 400 14px Mid Grey, underlined. Below it: small note "Puedes enviarla después de tu compra." in 12px Mid Grey.

Error state example: Esfera field shows red border (#C0392B) + small error message below "Valor fuera de rango. Debe ser entre -20.00 y +12.00." in Urbanist 12px red.

Bottom: "← Paso anterior" ghost button left + "Continuar →" Navy button right.
```

---

## 6. CART PAGE

### 6A. CART PAGE — DESKTOP

```
[BRAND DNA BLOCK]

Design the cart page (not the drawer — the full cart page), desktop, 1440px.

Heading: "Tu carrito" — Urbanist 600, 40px, Navy, left-aligned, 80px from top.

TWO-COLUMN LAYOUT (1280px max-width):

LEFT — Cart items (65% width):
2 line items, each in a horizontal row with subtle 1px bottom border:

Item 1 (frame only):
- Product image thumbnail 96×96px (eyeglasses on grey bg, 8px border-radius)
- Product info column: "Dalton" Urbanist 600 16px Carbon + "Tortoise Brown" 13px Mid Grey + "Sin graduar · Solo armazón" 12px Mid Grey in Lemon chip (small pill)
- Quantity stepper: "−  1  +" horizontally, each control 36×36px, border 1px Line Grey, Urbanist 500 16px
- Price: "$89.990" Urbanist 600 16px Navy, right-aligned
- "Eliminar" link below price, 12px Mid Grey, underline on hover

Item 2 (with lens config):
- Same structure
- Config summary pill: "Progresivo · 1.67 · Antirreflejo + Filtro azul" — small Lemon chip
- Price: "$184.990"

Below items row: "← Seguir comprando" link in Navy 14px, left-aligned.

RIGHT — Order summary (35% width, sticky, 24px padding, 1px Line Grey border, 8px border-radius):
- "Resumen del pedido" heading Urbanist 600 18px Carbon
- Row: "Subtotal" · "$274.990" — both Urbanist 400 15px Carbon
- Row: "Envío" · "Calculado al checkout" — both 14px Mid Grey
- Row: "Código de descuento" — input 40px tall + "Aplicar" button, Line Grey border
- Divider
- Total row: "Total (IVA incluido)" Urbanist 600 18px Carbon · "$274.990" Urbanist 700 24px Navy
- Primary CTA: "Ir al checkout →" full-width, Navy fill, white Urbanist 600 15px uppercase, 52px tall, 24px border-radius
- Trust icons row below: "🔒 Pago seguro · 🚚 Envío estimado 5–7 días" — 12px Mid Grey centered

UPSELL ROW below cart items (Beige #F7F4EE background strip, full-width, 80px padding):
- "Completa tu pedido" — Urbanist 600 20px Navy
- 3 accessory product cards in a row (estuche, paño limpieza, cordón): small product cards, image + name + price + "Agregar" outline button
```

---

## 7. UI COMPONENTS

### 7A. BUTTON SYSTEM

```
[BRAND DNA BLOCK]

Design a comprehensive button system for Lemoon, displayed as a component sheet on white background.

Show 5 button variants in a 2-column grid:

1. PRIMARY — "Agregar al carrito": Navy #0B1F3A fill, white text, Urbanist 600 14px uppercase, letter-spacing 0.08em, 48px tall, 20px horizontal padding, 24px border-radius. Hover: Navy Muted #1A3560. Disabled: 40% opacity.

2. SECONDARY / OUTLINE — "Ver colección": 1px Navy border, Navy text, white fill. Same size. Hover: Navy fill, white text.

3. ACCENT — "Configurar con cristales": Lemon #F7E600 fill, Carbon #1A1A1A text (not white — Lemon is light, Carbon is more readable). Hover: Lemon Deep #D4C700.

4. GHOST — "← Volver": no border, no fill. Just Navy underlined text with arrow. Minimal, for navigation CTAs.

5. DESTRUCTIVE / WARNING — "Eliminar": small, 12px, Mid Grey text only, underline. No button shape. Appears inline in cart.

Show each button in: default state, hover state (side by side), and mobile touch target (44px minimum height).
Below each: label with specs (height, font, border-radius, padding).

Flat design, clean, white background, professional component documentation style.
```

---

### 7B. PRODUCT CARD STATES

```
[BRAND DNA BLOCK]

Design a product card component in 4 states, displayed side by side:

Card dimensions: 280×380px. Eyeglasses product: "Dalton — Tortoise Brown · $89.990"

State 1 — DEFAULT: card with 1px Line Grey border, white background. Product image (eyeglasses on light grey bg, 65% of card), name + color + swatches + price below. Heart icon outline top-left. "Probar →" pill bottom-right of image.

State 2 — HOVER: same card but image shows a second lifestyle photo (person wearing glasses) fading in. "Probar →" pill becomes slightly more visible. A subtle "Vista rápida" pill appears center of image (white fill, Carbon text, Urbanist 12px, 8px border-radius, semi-transparent bg).

State 3 — WITH BADGE "NUEVO": same as default + a "NUEVO" badge top-left of image. Badge style: sharp-cornered rectangle (0px border-radius), 1px Navy border, Navy text, white fill, Urbanist 600 11px uppercase. Editorial, no color fill.

State 4 — ON SALE: badge "−20%" top-left in Lemon fill, Carbon text. Price row shows "$71.990" in Navy bold + "$89.990" strikethrough in Mid Grey next to it.

Show all 4 cards in a row at 280×380px each on white background.
```

---

### 7C. DESIGN SYSTEM — FULL COMPONENT OVERVIEW

> Este es el prompt principal para Google Stitch. Genera una pantalla tipo "component library" con todos los bloques base del sistema en un solo canvas.

```
[BRAND DNA BLOCK]

Design a comprehensive design system component sheet for Lemoon eyewear e-commerce. Display all components organized in labeled sections on a white background, as a professional component library reference page.

---

SECTION 1 — COLOR PALETTE
Show 8 color swatches in a horizontal row, each 80×80px with rounded corners (8px), color name below in Urbanist 12px Carbon, hex value in Mid Grey 11px:
Navy Night #0B1F3A · Navy Muted #1A3560 · Lemon #F7E600 · Lemon Deep #D4C700 · Beige #F7F4EE · White #FFFFFF (with 1px border) · Carbon #1A1A1A · Mid Grey #6B6B6B · Line Grey #E0DDD8

---

SECTION 2 — TYPOGRAPHY SCALE
Show the Urbanist type scale on white background, each style on its own row:
- Display / Hero: "Lentes que te definen." — weight 300, 56px, Navy, letter-spacing -0.5px
- H1: "Armazones de calidad" — weight 600, 40px, Navy, letter-spacing -0.3px
- H2: "Más vendidos" — weight 600, 28px, Navy, letter-spacing -0.3px
- H3: "Dalton — Tortoise" — weight 500, 20px, Carbon
- Body: "Diseñados para adaptarse a tu estilo y a tu receta. Enviamos a todo Chile." — weight 400, 16px, Carbon
- Body small: "Color: Tortoise Brown · Material: Acetato" — weight 400, 14px, Mid Grey
- Caption: "IVA incluido · Despacho estimado 5–7 días hábiles" — weight 400, 12px, Mid Grey
- CTA label: "VER COLECCIÓN →" — weight 600, 14px, Navy, letter-spacing 0.08em, uppercase

---

SECTION 3 — BUTTONS (all 5 variants, shown default + hover side by side)
Row of button pairs:
1. PRIMARY: Navy #0B1F3A fill, white Urbanist 600 14px uppercase, 48px tall, 4px radius | Hover: #1A3560
2. SECONDARY: 1px Navy border, Navy text, white fill | Hover: Navy fill, white text
3. ACCENT: Lemon #F7E600 fill, Carbon text, 48px tall | Hover: #D4C700 fill
4. GHOST: Navy underlined text, no border, no fill | Hover: darker underline
5. INLINE/DESTRUCTIVE: "Eliminar" — Mid Grey 12px text only, underline, no shape

---

SECTION 4 — FORM ELEMENTS (vertical stack, left-aligned)
- Text input DEFAULT: 48px, 1px Line Grey border, 4px radius, placeholder "Tu correo electrónico" in Mid Grey
- Text input FOCUS: 2px Navy border, active text "miguel@lemoon.cl"
- Text input ERROR: 2px Red #C0392B border, error message below "Este campo es requerido."
- Select dropdown: same as input + "▾" chevron right side
- Checkbox unchecked / checked (Navy fill + white checkmark) with label
- Radio button unchecked / selected (Navy fill) with label

---

SECTION 5 — PRODUCT CARD (4 states in a row, each 220×300px)
State 1 DEFAULT: 1px Line Grey border, product image (glasses on light grey bg), name "Dalton", color "Tortoise Brown", 3 color swatches, price "$89.990". Heart icon top-left. "Probar →" pill bottom-right of image.
State 2 HOVER: lifestyle photo visible, "Vista rápida" pill center of image.
State 3 NUEVO: sharp-cornered badge "NUEVO" top-left (0px radius, 1px Navy border, white fill).
State 4 SALE: "−20%" badge in Lemon + "$71.990" bold + "$89.990" strikethrough.

---

SECTION 6 — BADGES & TAGS (horizontal row)
- "NUEVO" — sharp rectangle 0px radius, 1px Navy border, Navy text, white fill, 11px uppercase
- "−20%" — Lemon #F7E600 fill, Carbon text, 0px radius
- "MÁS VENDIDO" — Beige fill, Carbon text, 4px radius, 1px Line Grey border
- "AGOTADO" — Line Grey fill, Mid Grey text, 4px radius
- Lens config chip "Progresivo · 1.67 · Antirreflejo" — Lemon #F7E600 bg, Carbon 11px, 20px radius

---

SECTION 7 — NAVIGATION ELEMENTS
- Active nav link: "Armazones" Urbanist 500 15px Carbon + 2px Lemon #F7E600 underline below
- Breadcrumb: "Inicio › Armazones › Rectangulares" 13px Mid Grey with › separators
- Pagination: ← 1 [2] 3 4 → where active page has Navy fill, white number, 4px radius
- Search input pill: full-width input, magnifying glass icon left, 40px tall, 1px Line Grey border, 24px border-radius

---

SECTION 8 — ICONS (2-row grid, 24px each, 1.5px stroke, Carbon #1A1A1A)
Shopping bag (cart) · Magnifying glass (search) · Person (account) · Heart (wishlist) · × (close) · ← arrow · → arrow · › chevron · ✓ checkmark · Shield (guarantee) · Package (shipping) · Return arrow · WhatsApp logo · Instagram logo · Star (rating) · Ruler (size guide) · Info circle · Eye/glasses frame

All icons consistent thin-line style, same visual weight.

---

SECTION 9 — MICRO-COMPONENTS (horizontal row)
- Star rating: ★★★★★ in Lemon + "4.8 (127 reseñas)" in Mid Grey 13px
- Price display: "$89.990" Navy 600 18px + "Solo armazón" Mid Grey 13px same line
- Price with discount: "$71.990" Navy 600 18px + "$89.990" strikethrough Mid Grey 16px
- Color swatch row: 4 circles 24px, selected has 2px Navy outer ring
- Free shipping progress bar: thin track Line Grey, Lemon fill at 70%, label "Te faltan $15.000" below
- Trust icons row: 🚚 "Envío" · ↩ "Devolución" · ✓ "Garantía" — 14px icons, 13px Mid Grey text

---

Layout: organized sections with bold section labels in Urbanist 600 11px uppercase Mid Grey as headers, 32px gap between sections, 40px internal padding on a white canvas. Professional, clean, documentation-quality design system sheet.
```

---

### 7D. FORM ELEMENTS

```
[BRAND DNA BLOCK]

Design a form component set for Lemoon, displayed as a clean component sheet.

Show these elements:

1. TEXT INPUT — Default: 1px Line Grey border, 24px border-radius, 48px tall, Urbanist 400 16px Carbon text, placeholder in Mid Grey. Label above: Urbanist 500 14px Carbon.

2. TEXT INPUT — Focus state: 2px Navy border, same height. Active text.

3. TEXT INPUT — Error state: 2px Red #C0392B border, error message below input in Urbanist 12px Red "Este campo es requerido."

4. TEXT INPUT — Disabled: light grey background, Mid Grey text, no border.

5. SELECT DROPDOWN — Same styling as input, with "▾" chevron right-aligned in Carbon.

6. CHECKBOX — Unchecked: 1px Line Grey border, 16×16px, 3px border-radius. Checked: Navy fill, white checkmark. Label right of checkbox, Urbanist 400 14px Carbon.

7. RADIO BUTTON — Same radius as checkbox but round. Navy fill when selected.

8. PRICE INPUT (for prescription range) — input with unit label inside right side: "mm" or "°" in Mid Grey.

All elements on white background, clean, professional.
```

---

## QUICK REFERENCE — ULTRA-SHORT PROMPT

For fast iteration, use this compressed version:

```
Lemoon eyewear e-commerce UI, inspired by Warby Parker + Ace & Tate.
Navy #0B1F3A primary, Lemon #F7E600 accent (sparingly), Beige #F7F4EE for alternating sections, white default background.
Urbanist font — 300 weight for display, 600 for headings, 400 for body.
Negative letter-spacing (-0.3 to -0.5px) on all headings — key sophistication signal.
Clean, generous whitespace, minimal UI chrome. No gradients, no heavy shadows.
Photography and lifestyle images carry the emotion; UI stays restrained.
Approachable-premium Latin American brand, Spanish language (Chile).
[DESCRIBE THE SPECIFIC COMPONENT OR PAGE HERE]
```

---

## TIPS BY TOOL

| Tool                   | Notes                                                                                        |
| ---------------------- | -------------------------------------------------------------------------------------------- |
| **Midjourney**         | Append `--ar 16:9 --style raw --v 6.1` for desktop; `--ar 9:19.5 --style raw` for mobile     |
| **DALL-E / ChatGPT**   | Paste Brand DNA + module. Follow up with "now show me mobile version"                        |
| **Adobe Firefly**      | Use module prompt as "Generative Fill" description with reference image                      |
| **Figma AI / Galileo** | Paste module prompt as screen description; use Brand DNA as style reference                  |
| **Google Stitch**      | Use `brand-guidelines.md` as the design.md file; paste module prompts as screen descriptions |
| **Relume**             | Use module layout descriptions to generate wireframe structure, then apply Lemoon design     |
