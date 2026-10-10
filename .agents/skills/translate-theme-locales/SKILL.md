---
name: translate-theme-locales
description: Translate missing Shopify locale keys into clear, natural Chilean Spanish for Lemoon while preserving JSON structure and existing translations.
---

# Translate Lemoon theme locales

Use the `chilean-spanish-translator` agent when available. Read `docs/design/brand-guidelines.md`, `locales/en.json`, and `locales/es.json` first. Compare nested keys and identify English keys missing from Spanish; do not overwrite existing Spanish values unless the user explicitly requests their revision.

Write in confident, approachable, clear Chilean Spanish. Use **tú**, inclusive language where natural, direct imperative CTAs, warm descriptions, reassuring errors, and specific positive confirmations. Prefer Chilean wording such as **carro** and **celular**; avoid Spain Spanish, overly formal phrasing, and marketing fluff. Preserve brand names, product names, and technical terms such as Liquid and Shopify.

Edit only missing keys in `locales/es.json`, placing them in the matching nested structure from `locales/en.json`. Preserve unrelated values and JSON organization. Validate both locale files as JSON. Report the number of keys translated and explain ambiguous strings or interpretation choices.
