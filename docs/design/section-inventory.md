# Section Inventory

Living list of all sections in the theme — purpose, status, and template placement.
Update whenever a section is added, removed, or moved.

---

## Core sections (from Dawn base)

| Section file                          | Purpose                              | Used in templates   | Status    |
| ------------------------------------- | ------------------------------------ | ------------------- | --------- |
| `announcement-bar.liquid`             | Top-of-page announcement strip       | header group        | ✅ exists |
| `header.liquid`                       | Site header, nav, cart icon          | header group        | ✅ exists |
| `footer.liquid`                       | Site footer                          | footer group        | ✅ exists |
| `featured-collection.liquid`          | Product grid from a collection       | index               | ✅ exists |
| `featured-product.liquid`             | Single product spotlight             | index               | ✅ exists |
| `image-banner.liquid`                 | Full-width image with text overlay   | index               | ✅ exists |
| `collage.liquid`                      | Mixed media collage                  | index               | ✅ exists |
| `multicolumn.liquid`                  | Multi-column text/icon layout        | index               | ✅ exists |
| `rich-text.liquid`                    | Centered text block                  | index               | ✅ exists |
| `slideshow.liquid`                    | Image slideshow/carousel             | index               | ✅ exists |
| `video.liquid`                        | Embedded or native video             | index               | ✅ exists |
| `email-signup-banner.liquid`          | Newsletter signup CTA                | index               | ✅ exists |
| `collection-list.liquid`              | Grid of collection cards             | index               | ✅ exists |
| `contact-form.liquid`                 | Contact form                         | contact template    | ✅ exists |
| `main-article.liquid`                 | Blog post content                    | article template    | ✅ exists |
| `main-blog.liquid`                    | Blog post listing                    | blog template       | ✅ exists |
| `main-cart-footer.liquid`             | Cart totals and checkout CTA         | cart template       | ✅ exists |
| `main-cart-items.liquid`              | Cart line items                      | cart template       | ✅ exists |
| `main-collection-banner.liquid`       | Collection hero banner               | collection template | ✅ exists |
| `main-collection-product-grid.liquid` | Collection product grid with filters | collection template | ✅ exists |
| `main-page.liquid`                    | Generic CMS page content             | page template       | ✅ exists |
| `main-password-footer.liquid`         | Password page footer                 | password template   | ✅ exists |
| `main-product.liquid`                 | Product detail page (PDP)            | product template    | ✅ exists |
| `main-search.liquid`                  | Search results                       | search template     | ✅ exists |
| `collapsible-content.liquid`          | Accordion / FAQ                      | any                 | ✅ exists |

---

## Custom Lemoon sections — planned

Discovered from competitor research (Warby Parker, Ace & Tate, Zeelool, Clearly, Zenni).
Priority: `MVP` · `POST-MVP`.

| Section file (to create)          | Purpose                                                                | Priority | Status |
| --------------------------------- | ---------------------------------------------------------------------- | -------- | ------ |
| `trust-bar.liquid`                | Horizontal strip: 4–5 trust signals (shipping, returns, warranty, WA)  | MVP      | `[ ]`  |
| `how-it-works.liquid`             | 3-step process: elige → configura → recibe                             | MVP      | `[ ]`  |
| `lifestyle-mood-grid.liquid`      | Editorial style tribe tiles: "Minimalista", "Ejecutivo", "Retro", etc. | MVP      | `[ ]`  |
| `frame-shape-filter-strip.liquid` | Horizontal scrollable pills: frame shapes + quick filters              | MVP      | `[ ]`  |
| `social-proof-strip.liquid`       | Dark band with star rating, review count, and customer milestone       | MVP      | `[ ]`  |
| `lens-configurator.liquid`        | Multi-step lens configuration flow (5 steps, custom JS)                | MVP      | `[ ]`  |
| `whatsapp-float.liquid`           | Fixed floating WhatsApp CTA button, bottom-right corner                | MVP      | `[ ]`  |
| `prescription-intent-cta.liquid`  | PDP inline CTA: "¿Necesitas cristales?" → WhatsApp deeplink            | MVP      | `[ ]`  |
| `size-guide-diagram.liquid`       | Inline armazón dimension diagram with measurement callouts             | MVP      | `[ ]`  |
| `cart-upsell-row.liquid`          | Accessory upsell strip at the bottom of cart (estuche, paños)          | MVP      | `[ ]`  |
| `style-quiz-entry.liquid`         | CTA section launching the style quiz / frame recommender               | POST-MVP | `[ ]`  |
| `ugc-instagram-grid.liquid`       | Instagram / UGC photo grid (customer lifestyle photos)                 | POST-MVP | `[ ]`  |
| `loyalty-banner.liquid`           | Lemoon Rewards / loyalty program highlight strip                       | POST-MVP | `[ ]`  |
| `virtual-tryon-entry.liquid`      | Section or PDP component launching virtual try-on (AR)                 | POST-MVP | `[ ]`  |
| `video-lookbook.liquid`           | Full-width editorial video section (brand film or lookbook)            | POST-MVP | `[ ]`  |
| `comparison-table.liquid`         | Lens type or frame comparison table                                    | POST-MVP | `[ ]`  |
| `press-logos-strip.liquid`        | "Como aparecimos en" — media/press logos strip                         | POST-MVP | `[ ]`  |
| `countdown-timer-bar.liquid`      | Countdown to sale end or launch date (replaces announcement bar)       | POST-MVP | `[ ]`  |

---

## Section design patterns from competitors

Key patterns observed (prioritized for implementation):

### From Warby Parker

- Trust bar immediately below hero — 4 short phrases on dark strip, no icons needed
- "Try On" persistent button on every product card (not hover-only)
- Mega menu with editorial content card (lifestyle image + collection CTA) in last column
- Virtual try-on as nav-level feature ("Style quiz" also in nav)

### From Ace & Tate

- Transparent nav overlaid on hero — becomes white on scroll
- No announcement bar in main nav — promo info lives in a micro utility bar
- Full-screen (100vw × 100vh) immersive hero — no text overlay, image communicates mood
- Sharp-cornered editorial "NUEVO" badge (0px border-radius, 1px border, no fill color)
- Negative letter-spacing on all headings (−0.5 to −0.6px)

### From Zeelool

- Lifestyle mood categories as navigation: "Urban Chic", "Diva", "Quiet Luxury", "Business Casual"
- Multiple pill-shaped CTA buttons on hero for user self-segmentation by intent
- Frame shape filter strip below hero as a secondary horizontal nav

### From Clearly

- "Price includes lenses" framing on product cards — removes sticker shock
- Persistent thin promo sub-bar below main nav (separate from announcement bar)
- Trustpilot rating in both header utility bar AND footer (repeated trust signal)
- Loyalty club visible in the main nav as a link item

### From Zenni

- Search bar as primary UI affordance (centered, large, with AI assistant built in)
- Trust strip above footer: icon+text horizontal bar (5–6 guarantees at a glance)
- "Frames" micro-tag (small dark pill) bottom-right of every banner/campaign image
- Delivery ETA on product cards ("Llega el lunes 25") — reduces purchase anxiety
