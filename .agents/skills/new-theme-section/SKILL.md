---
name: new-theme-section
description: Scaffold a new Shopify Liquid section for this theme, following the existing section, schema, padding, translation, and branch conventions.
---

# Scaffold a Lemoon theme section

Use this when the user asks to create the initial structure for a new Shopify theme section. Keep the work scoped to the requested section and required translations.

1. Confirm the requested section name. Convert it to kebab-case for `sections/<name>.liquid`.
2. Check the current Git branch. Do not create a section on `main`; report the branch and stop if it is `main`.
3. Read 1–2 similar files in `sections/`, plus `.claude/rules/liquid-conventions.md` and `.claude/rules/section-schema.md`.
4. Create semantic markup with a `.section-{{ section.id }}` wrapper. Apply `padding_top` and `padding_bottom` from section settings. Add `{{ block.shopify_attributes }}` to each block's root element.
5. Add a valid `{% schema %}` with standard padding range settings, translations for every user-facing schema string in `locales/en.default.json` and `locales/es.json`, and a preset so the section appears in the theme editor.
6. Verify Liquid/schema conventions and report the files changed. Tell the user to add the section to a template JSON if they want it on a specific page.

Do not publish to Shopify or edit unrelated sections.
