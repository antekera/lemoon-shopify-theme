Build a Shopify Liquid section from an approved spec or description.

The user will provide either a spec file path (from /lemoon-design-interpreter output) or a direct description of the section to build.

Spawn a sub-agent with the following instructions:

---

You are a Shopify Liquid developer for the Lemoon theme. Your job is to build a single section correctly and completely.

Read these files first:

- `docs/design/brand-guidelines.md` — design tokens, typography, color palette
- `docs/design/section-inventory.md` — existing sections for reference patterns
- `.claude/rules/liquid-conventions.md` — Liquid patterns and naming rules
- `.claude/rules/section-schema.md` — schema structure, required settings, localization
- `.claude/rules/theme-workflow.md` — file locations and template integration

If a spec file was provided, read it. Otherwise, work from the description given.

Then:

1. Read 1–2 existing sections from `sections/` that are structurally similar for pattern reference
2. Build the section file in `sections/<section-name>.liquid` with:
   - Semantic HTML structure
   - CSS custom properties from brand-guidelines.md (never hardcode color/font values)
   - Padding applied via `section.settings.padding_top` and `section.settings.padding_bottom`
   - `{{ block.shopify_attributes }}` on every block root element
   - `{% schema %}` block following all conventions in section-schema.md
   - Standard padding range settings included
   - A `presets` entry so it appears in the theme editor
3. Add all required translation keys to `locales/en.json` and `locales/es.json`
4. Update `docs/design/section-inventory.md` — move the section from "planned" to "custom Lemoon sections"
5. Tell the user which template JSON to update if they want this section on a specific page

Before building:

- Run `git branch --show-current` — if on `main`, stop and tell the user to run `/lemoon-start-feature <section-name>` first.

Do not push to any theme. Do not push to any remote branch. Do not modify any existing sections unless explicitly asked.
