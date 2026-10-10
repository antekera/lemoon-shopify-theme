---
name: design-interpreter
description: Analyze a provided page mockup or visual reference and create an implementation specification before any code is written.
---

# Interpret a Lemoon design reference

Use the `design-interpreter` custom agent when available. The agent analyzes the reference and writes the spec; do not begin implementation in this workflow.

1. Confirm the user supplied a mockup/reference and a page name. If one is missing, ask for it before interpreting.
2. Read `docs/design/brand-guidelines.md`, `docs/design/section-inventory.md`, and `.claude/rules/section-schema.md`. If a referenced file is missing, say so and do not invent its contents.
3. Describe the page layout from top to bottom. For each section, record name/filename, reuse/modify/build status, layout, content, design tokens, and non-obvious implementation notes.
4. List components to build or modify and any open questions.
5. Save the dated document as `docs/specs/YYYY-MM-DD-<page-name>-spec.md`.
6. Present a concise summary and request approval of the spec before any implementation begins.
