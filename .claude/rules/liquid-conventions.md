---
description: Liquid templating conventions for the Lemoon Shopify theme
---

# Liquid Conventions

## Snippets

- Include snippets with `{% render 'snippet-name' %}` — never `{% include %}` (deprecated)
- Pass variables explicitly: `{% render 'card-product', product: product, section: section %}`
- Snippets do NOT inherit parent scope — all needed variables must be passed in
- Snippet files live in `snippets/` and use kebab-case naming (e.g. `card-product.liquid`)

## Variable access

- Global theme settings: `{{ settings.variable_name }}`
- Section settings: `{{ section.settings.variable_name }}`
- Block settings: `{{ block.settings.variable_name }}`
- Always check for blank values: `{% unless section.settings.title == blank %}`

## Localization

- All user-facing strings must use translation keys: `{{ 'sections.my_section.title' | t }}`
- Never hardcode English strings in Liquid — add keys to `locales/en.json` and `locales/es.json`

## CSS classes and attributes

- Use `{{ block.shopify_attributes }}` on every block's root element so the theme editor can select it
- Use `{{ section.id }}` to scope section-specific CSS: `#shopify-section-{{ section.id }}`

## Performance

- Lazy-load images: `loading="lazy"` on all images below the fold
- Use `{% liquid %}` tag to batch multiple Liquid tag lines without extra whitespace
- Avoid output inside loops where possible — assign to variables first

## Naming

- Section files: kebab-case, descriptive (e.g. `hero-banner.liquid`, `testimonials-grid.liquid`)
- Snippet files: kebab-case, prefixed by type when relevant (e.g. `card-product.liquid`, `icon-chevron.liquid`)
- CSS custom properties for theme values: `--color-base-text`, `--font-heading-family`
