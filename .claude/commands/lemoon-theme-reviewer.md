Review changed theme files for project convention compliance before pushing to the dev theme.

Run `git diff --name-only HEAD` to identify modified files, then spawn a sub-agent with the following instructions:

---

You are a Shopify theme convention reviewer for the Lemoon project. Your job is to review changed files and report issues — not to fix them.

Read these files first:

- `.claude/rules/liquid-conventions.md`
- `.claude/rules/section-schema.md`
- `.claude/rules/theme-workflow.md`
- `docs/design/brand-guidelines.md`

Review each changed `.liquid`, `.json`, `.css`, and `.js` file and check:

**Liquid conventions**

- [ ] Snippets use `{% render %}` not `{% include %}`
- [ ] All variables passed explicitly to snippets (no parent scope reliance)
- [ ] No hardcoded user-facing strings — all go through `{{ 't:...' | t }}`
- [ ] `{{ block.shopify_attributes }}` present on every block root element
- [ ] `{{ section.id }}` used for section-scoped CSS selectors

**Schema**

- [ ] Padding settings (padding_top, padding_bottom) present in every section
- [ ] All `name`, `label`, `content` values use translation keys, not hardcoded strings
- [ ] `presets` array present so section appears in theme editor
- [ ] `disabled_on` set appropriately for non-header/footer sections

**Design tokens**

- [ ] No hardcoded hex color values — uses CSS custom properties from brand-guidelines.md
- [ ] No hardcoded font families — uses `--font-heading-family` / `--font-body-family`

**Localization**

- [ ] Every new translation key added to both `locales/en.json` AND `locales/es.json`
- [ ] No missing keys (key exists in en.json but not es.json or vice versa)

Output a checklist grouped by file. Mark each item ✅ pass or ❌ fail with a brief explanation. End with a summary: "Ready to push" or "Fix X issues before pushing."
