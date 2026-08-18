# Lemoon Brand Guidelines

> Fill this in as the design system is established. Claude reads this file when making any visual or styling decisions.

## Colors

| Token      | Value | Usage                |
| ---------- | ----- | -------------------- |
| Primary    | TBD   | CTAs, links, accents |
| Secondary  | TBD   | Supporting elements  |
| Background | TBD   | Page background      |
| Surface    | TBD   | Cards, panels        |
| Text       | TBD   | Body copy            |
| Text muted | TBD   | Labels, captions     |

In the theme, colors are set via `config/settings_data.json` and accessed with `{{ settings.colors_* }}` or via CSS custom properties like `--color-base-text`.

## Typography

| Role    | Family | Weight | Size |
| ------- | ------ | ------ | ---- |
| Heading | TBD    | TBD    | TBD  |
| Body    | TBD    | TBD    | TBD  |
| Caption | TBD    | TBD    | TBD  |

CSS custom properties: `--font-heading-family`, `--font-body-family`

## Spacing

- Base unit: TBD (Dawn default is 4px grid)
- Section padding: 36px top/bottom (default, adjustable per section)
- Component gap: TBD

## Breakpoints

Dawn's built-in breakpoints (from `assets/base.css`):

- Mobile: < 750px
- Tablet: 750px–989px
- Desktop: ≥ 990px

## Tone & voice

TBD — describe the brand personality that should come through in microcopy and placeholder text.

## Logo

TBD — file location, usage rules, minimum size.
