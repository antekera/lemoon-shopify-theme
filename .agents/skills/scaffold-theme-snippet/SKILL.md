---
name: scaffold-theme-snippet
description: Create a reusable Shopify Liquid snippet with explicit inputs, semantic markup, and a ready-to-use render call.
---

# Scaffold a reusable Lemoon snippet

Use this when the user asks to create a reusable Liquid snippet or partial.

1. Confirm the snippet's purpose and name; use kebab-case under `snippets/`.
2. Read 1–2 similar snippets and `.claude/rules/liquid-conventions.md`.
3. Implement semantic markup and keep the snippet focused on one reusable responsibility. Add a comment at the top listing each accepted parameter and its type.
4. Pass every required value as an explicit parameter. Snippets do not inherit parent scope; do not rely on implicit variables.
5. Use translation keys for user-facing text and add required keys to `locales/en.json` and `locales/es.json`.
6. Keep edits scoped to the requested snippet and necessary locale entries. Report the files changed and a complete `{% render 'snippet-name', parameter: value %}` example with all required inputs.

Do not publish to Shopify or edit unrelated snippets.
