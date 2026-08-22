Scaffold a new Shopify theme section for the Lemoon theme.

The user will provide a section name (e.g. "testimonials-grid" or "hero-banner").

Steps:

1. Convert the name to kebab-case for the filename (e.g. `sections/testimonials-grid.liquid`)
2. Read 1-2 existing sections from `sections/` for reference on patterns used in this theme
3. Create the new section file in `sections/` with:
   - A semantic HTML structure using `<div class="section-{{ section.id }}">` as the wrapper
   - Inline padding style using `section.settings.padding_top` and `section.settings.padding_bottom`
   - `{{ block.shopify_attributes }}` on each block's root element
   - A `{% schema %}` block at the bottom following the conventions in `.claude/rules/section-schema.md`
   - Standard padding settings (padding_top, padding_bottom range inputs)
   - A `presets` entry so it appears in the theme editor "Add section" menu
4. Add the required translation keys to `locales/en.json` and `locales/es.json` under `sections.<section-name>`
5. Tell the user to add the section to a template JSON if they want it to appear on a specific page

Follow all conventions in `.claude/rules/liquid-conventions.md` and `.claude/rules/section-schema.md`.
