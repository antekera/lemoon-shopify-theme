---
name: audit-design-tokens
description: Compare Lemoon's documented design tokens with base CSS and Shopify theme settings, then report evidenced mismatches without editing files.
---

# Audit Lemoon design tokens

Use the `design-token-auditor` agent when available. Read `docs/design/brand-guidelines.md` as the source of truth, then inspect `assets/base.css` and `config/settings_schema.json`.

Check:

- **Colors:** each documented color has a CSS custom property; identify contradictory/duplicate hardcoded hex values in base CSS; compare theme color-scheme settings with the palette.
- **Typography:** `--font-heading-family` uses `'Urbanist', sans-serif` and `--font-body-family` uses `'Hanken Grotesk', sans-serif`; CSS weights follow 300, 400, 500, 600; no undocumented font families are introduced.
- **Spacing:** section padding defaults match 64px desktop / 40px mobile; spacing respects the 4px base unit.
- **Grid:** maximum content width matches 1280px.

Return a table with **Token | Expected | Found | Status**. Cite each mismatch with file and line evidence. End with **In sync** or a prioritized list of updates needed. Do not edit files.
