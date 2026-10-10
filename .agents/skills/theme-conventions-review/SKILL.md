---
name: theme-conventions-review
description: Review changed Shopify theme files against Lemoon Liquid, schema, design-token, localization, and workflow conventions before pushing to the dev theme.
---

# Lemoon theme convention review

Use the `theme-conventions-reviewer` agent when available. Review modified files in the requested change set; distinguish this from `$theme-code-review`, which checks general Shopify quality.

Read `.claude/rules/liquid-conventions.md`, `.claude/rules/section-schema.md`, `.claude/rules/theme-workflow.md`, and `docs/design/brand-guidelines.md`. Review changed `.liquid`, `.json`, `.css`, and `.js` files for `{% render %}` usage, explicit snippet parameters, translated strings, block attributes, section-scoped CSS, section padding/schema/presets/disabled groups, translated schema values, design-token colors/fonts, and matching `en`/`es` locale keys.

Return findings first, ordered by severity and grouped by file, with precise line references and evidence. Then give a per-file checklist with ✅/❌ and brief explanations, followed by an explicit **Ready to push** or **Fix X issues before pushing** verdict. State explicitly when there are no findings. Do not edit files.
