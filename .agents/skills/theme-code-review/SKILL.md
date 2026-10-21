---
name: theme-code-review
description: Review Shopify theme code and Lemoon page copy or research for code quality, source accuracy, and unsupported claims before opening a PR.
---

# General Shopify theme code review

Use the `theme-code-reviewer` agent when available. Review current branch changes against the merge base with `origin/main` (or the explicitly requested base). Keep this review focused on general Shopify quality; use `$theme-conventions-review` for Lemoon-specific conventions.

Inspect changed `.liquid`, `.css`, and `.js` files. Check Shopify pagination and bounded loops, Liquid logic/whitespace, asset helpers, image sizing/preload, lazy loading, render blocking, scoped CSS, accessibility labels/alt/action semantics/focus/contrast, duplicated logic, snippet size, descriptive names, dead comments, magic values, escaping user input, and unsafe `javascript:` URLs.

For page-copy changes, also review Markdown/HTML drafts and research notes under `docs/content/`, including copy-only tickets. Follow the agent's declared copy-review scope: independently check cited sources, current official legal sources when relevant, business facts, original phrasing, and clearly labeled unknowns/demo data. Report unavailable sources or confirmations as limitations; distinguish draft review from publication approval.

Return findings first, ordered by severity and grouped by file, with precise line references and evidence. Then provide a per-file checklist with ✅/❌ and brief explanations, followed by an explicit verdict: **Approved**, **Approve with minor notes**, or **Changes requested**, and prioritized required fixes. If no findings, say so explicitly. Do not edit files.
