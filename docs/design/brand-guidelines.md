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
| `--color-secondary-dark` | Lemon Deep    | `#E6D600` | Hover state of accent elements                   |
| `--color-primary-alt`    | Navy Alt      | `#0E1A29` | Experimental alternative for controlled tests    |
| `--color-secondary-alt`  | Lemon Alt     | `#FFDD00` | Experimental alternative for controlled tests    |
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

Display font: **Urbanist** (Google Fonts) — geometric, clean, and spacious; used for headings, CTAs, and the logo wordmark. Body font: **Source Sans 3** (Google Fonts) — a humanist sans with clearer long-form readability, used for body copy, labels, and captions.

| Role         | Family   | Weight | Size (desktop) | Notes                                 |
| ------------ | -------- | ------ | -------------- | ------------------------------------- |
| Display      | Urbanist | 300    | 56–72px        | Hero headlines, large impact text     |
| Heading H1   | Urbanist | 600    | 40–48px        | Page titles                           |
| Heading H2   | Urbanist | 600    | 28–36px        | Section titles                        |
| Heading H3   | Urbanist | 500    | 20–24px        | Card titles, subsections              |
| Body         | Source Sans 3 | 400    | 16px           | Body copy, descriptions               |
| Body small   | Source Sans 3 | 400    | 14px           | Labels, specs, metadata               |
| Caption      | Source Sans 3 | 400    | 12px           | Image captions, fine print            |
| CTA / Button | Urbanist | 600    | 14–16px        | Uppercase, subtle letter-spacing (0.02em) |

Google Fonts import:

```html
<link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500&family=Urbanist:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
```

CSS custom properties: `--font-heading-family: 'Urbanist', sans-serif`; `--font-body-family: 'Source Sans 3', sans-serif`.

Field outline: use `--lemoon-border-warm` (`#F7F4EE`) for default and disabled input/select outlines with a white fill. Preserve Navy for focus and red for error. Field text aligns left; Input supports `Icon=None`, `Icon=Leading`, and `Icon=Trailing` variants. Field icons use 24px sizing.

## Border radius

| Element                              | Radius | Rationale                                          |
| ------------------------------------ | ------ | -------------------------------------------------- |
| Buttons (primary, secondary, accent) | `24px` | Pill-like, warm, approachable — Warby Parker style |
| Inputs, selects, textareas           | `24px` | Consistent with buttons, friendly feel             |
| Product cards                        | `12px` | Matches the product image; soft, not pill-shaped   |
| Modals / drawers                     | `16px` | Soft container, not clinical                       |
| Badges — "NUEVO", "EDICIÓN LIMITADA" | `0px`  | Sharp-cornered intentionally — editorial signal    |
| Badges — discount, sale              | `4px`  | Slightly softer than editorial, still compact      |
| Chips / lens config tags             | `20px` | Pill shape — readable inline                       |
| Swatches (color circles)             | `50%`  | Full circle                                        |
| Thumbnails / product images          | `12px` | Matches card radius                                |
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
- Wordmark accent: the second “o” in `lemoon` is Lemon Yellow `#F7E600` in every approved header treatment. All remaining letters are Navy on light or Warm Beige surfaces and white on Navy surfaces.
- Favicon: isolated mark or initial
- Min size: TBD
