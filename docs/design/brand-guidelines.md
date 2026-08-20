# Lemoon Brand Guidelines

> Claude reads this file when making any visual or styling decisions. Update as the design system is finalized.

## Visual reference

Primary inspiration: **Warby Parker** — clean, generous whitespace, confident typography, approachable premium feel. Direct-to-consumer optical brand with a modern editorial aesthetic.

## Colors

| Token                    | Name          | Value     | Usage                                            |
| ------------------------ | ------------- | --------- | ------------------------------------------------ |
| `--color-primary`        | Navy Night    | `#0B1F3A` | CTAs, headers, active nav, primary buttons       |
| `--color-primary-light`  | Navy Muted    | `#1A3560` | Hover states, secondary nav, borders active      |
| `--color-secondary`      | Lemon Cítrico | `#F7E600` | Accent badges, highlights, nav hover indicator   |
| `--color-secondary-dark` | Lemon Deep    | `#D4C700` | Hover state of accent elements                   |
| `--color-surface-warm`   | Beige Claro   | `#F7F4EE` | Alternating section backgrounds, soft card fills |
| `--color-background`     | White         | `#FFFFFF` | Default page background                          |
| `--color-text`           | Carbon        | `#1A1A1A` | Body copy, headings                              |
| `--color-text-muted`     | Mid Grey      | `#6B6B6B` | Labels, captions, secondary text                 |
| `--color-border`         | Line Grey     | `#E0DDD8` | Input borders, dividers, card strokes            |
| `--color-success`        | Green         | `#2D8C4E` | Confirmations, in-stock indicators               |
| `--color-error`          | Red           | `#C0392B` | Form errors, out-of-stock                        |

In the theme, colors are set via `config/settings_data.json` and accessed via CSS custom properties like `--color-base-text`, `--color-base-background-1`, etc.

### Palette combinations in use

- **Hero sections:** Navy background (`#0B1F3A`) + white text + Lemon CTA button
- **Default sections:** White background + Carbon text + Navy CTAs
- **Alternating sections:** Beige background (`#F7F4EE`) + Carbon text + Navy CTAs
- **Accent moments:** Lemon (`#F7E600`) used sparingly as underline, badge, or hover indicator — never as a large background

## Typography

Primary font: **Urbanist** (Google Fonts) — geometric sans-serif, clean and spacious, closest match to Warby Parker's aesthetic. Used for everything: headings, body, CTAs, logo wordmark.

| Role         | Family   | Weight | Size (desktop) | Notes                                 |
| ------------ | -------- | ------ | -------------- | ------------------------------------- |
| Display      | Urbanist | 300    | 56–72px        | Hero headlines, large impact text     |
| Heading H1   | Urbanist | 600    | 40–48px        | Page titles                           |
| Heading H2   | Urbanist | 600    | 28–36px        | Section titles                        |
| Heading H3   | Urbanist | 500    | 20–24px        | Card titles, subsections              |
| Body         | Urbanist | 400    | 16px           | Body copy, descriptions               |
| Body small   | Urbanist | 400    | 14px           | Labels, specs, metadata               |
| Caption      | Urbanist | 400    | 12px           | Image captions, fine print            |
| CTA / Button | Urbanist | 600    | 14–16px        | Uppercase, 0.05–0.08em letter-spacing |

Google Fonts import:

```html
<link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
```

CSS custom properties: `--font-heading-family`, `--font-body-family` (both set to `'Urbanist', sans-serif`)

## Border radius

| Element                              | Radius | Rationale                                          |
| ------------------------------------ | ------ | -------------------------------------------------- |
| Buttons (primary, secondary, accent) | `24px` | Pill-like, warm, approachable — Warby Parker style |
| Inputs, selects, textareas           | `24px` | Consistent with buttons, friendly feel             |
| Product cards                        | `8px`  | Subtle softness, not pill-shaped                   |
| Modals / drawers                     | `16px` | Soft container, not clinical                       |
| Badges — "NUEVO", "EDICIÓN LIMITADA" | `0px`  | Sharp-cornered intentionally — editorial signal    |
| Badges — discount, sale              | `4px`  | Slightly softer than editorial, still compact      |
| Chips / lens config tags             | `20px` | Pill shape — readable inline                       |
| Swatches (color circles)             | `50%`  | Full circle                                        |
| Thumbnails / product images          | `8px`  | Matches card radius                                |
| Tooltips, toasts                     | `8px`  | Compact UI feedback                                |

**Design intent:** Rounded inputs and buttons communicate approachable, warm, human-scale design — aligned with Warby Parker's DTC personality. Square corners are reserved for editorial badges only (Ace & Tate influence), creating deliberate contrast.

## Spacing

- Base unit: 4px
- Section padding: 64px top/bottom (desktop) · 40px (mobile)
- Component gap (grid): 24px (desktop) · 16px (mobile)
- Card internal padding: 16–24px
- Dawn's schema default padding (range slider): 0–100px, default 36px

## Grid

- Max content width: 1280px
- Columns: 12 (desktop) · 4 (mobile)
- Gutter: 24px (desktop) · 16px (mobile)
- Breakpoints (Dawn):
  - Mobile: < 750px
  - Tablet: 750px – 989px
  - Desktop: ≥ 990px

## Imagery

- **Product photos:** White or very light grey background, front/side/perspective shots
- **Lifestyle photos:** Natural light, clean environments, diverse models, editorial quality
- **Informational graphics:** Size guide diagram with dimension callouts per armazón
- **Icons:** Thin line icons (1.5–2px stroke), consistent style throughout
- **Banners:** Full-width, high-contrast text overlay — avoid text over busy image areas

## Tone & voice

- **Confident but approachable** — not clinical, not luxury-stuffy
- **Clear and direct** — CTAs say exactly what happens ("Configurar lentes", not "Siguiente")
- **Inclusive** — lentes para todas las personas, no solo un nicho
- Language: Spanish (es-CL). Currency: CLP.

## Logo

TBD — file location, usage rules, minimum size, clearspace.

- Likely: horizontal lockup (wordmark only) for header
- Favicon: isolated mark or initial
- Min size: TBD
