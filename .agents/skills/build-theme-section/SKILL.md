---
name: build-theme-section
description: Implement one approved Shopify Liquid section specification or clear section request using Lemoon conventions, localization, and theme-editor schema.
---

# Build an approved Lemoon section

Use this after a design spec is approved or when the user gives a clear section implementation request. For design analysis without approval, use `$design-interpreter` first and stop after the spec.

Delegate the implementation to the `section-builder` custom agent when available. Give it the approved spec or clear request, the relevant design and theme conventions, and the current branch context; review its reported files and validation before finishing.

1. Confirm there is an approved spec or a clear user description. Read it and the relevant project references: `docs/design/brand-guidelines.md`, `docs/design/section-inventory.md`, `.claude/rules/liquid-conventions.md`, `.claude/rules/section-schema.md`, and `.claude/rules/theme-workflow.md`. Report missing references instead of inventing their guidance.
2. Run `git branch --show-current`. If the branch is `main`, stop before editing and ask the user to switch to a feature branch.
3. Inspect 1–2 structurally similar sections and any directly relevant snippets/translations.
4. Implement only the requested section in `sections/<section-name>.liquid`: semantic markup; CSS custom properties grounded in the brand guide; section padding settings; `{{ block.shopify_attributes }}` on every block root; a valid schema with standard padding ranges and a preset; and translated user-facing/schema strings in `locales/en.default.json` and `locales/es.json`.
5. Update `docs/design/section-inventory.md` only as needed to record this section under custom Lemoon sections. Keep all edits limited to the requested section, required locales, and inventory entry. Do not edit existing sections unless explicitly requested.
6. Run appropriate validation, including JSON/schema checks and `git diff --check`. Report changed files and results, and tell the user which template JSON to update if the section should appear on a page.

Do not push to Shopify or any remote branch. Do not expand the work beyond the approved spec/request.
