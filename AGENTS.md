# Lemoon theme — Codex instructions

This repository is a Shopify Liquid theme based on Dawn. It uses Liquid sections and snippets, JSON templates and schemas, CSS, JavaScript, and Shopify CLI.

## Before changing files

- Check the current branch and working tree. Never commit or push directly to `main`; do not discard or overwrite existing local changes.
- Read the applicable project rules in `.claude/rules/`: `liquid-conventions.md`, `section-schema.md`, `git-conventions.md`, and `theme-workflow.md`. These are shared repository conventions; preserve the Claude workflows themselves.
- For visual work, read `docs/design/brand-guidelines.md` and the relevant design plan or section inventory.
- Keep edits scoped to the requested work. Do not modify `node_modules/` or Shopify-generated output.

## Theme conventions

- Use `{% render %}` and pass snippet inputs explicitly. Localize user-facing text through the existing locale files.
- Preserve valid Shopify section schemas, theme-editor settings, presets, and `block.shopify_attributes` where applicable.
- Keep `.env`, credentials, and `config/settings_data.json` out of commits. Never expose store secrets in instructions, logs, or generated files.
- Run `shopify theme check --fail-level error` and relevant project tests before reporting theme changes as validated.

## Git and Shopify safety

- Use the repository's branch prefixes and commit format. Route changes through a pull request to `main`.
- Do not push to Shopify as part of a code change unless the user requests it.
- The development theme is `155925381288`. The production theme is the currently published theme; inspect it with `shopify theme list`, show its ID, and get explicit user confirmation immediately before any production push. A request to inspect or prepare a push is not confirmation.
- Never pull from Shopify over uncommitted work.

## Codex skills

Repository skills live under `.agents/skills/`. Use `$<skill-name>` for explicit invocation or select an enabled skill from Codex's skill selector. Follow the skill's scope and safety rules; a skill does not authorize actions outside the user's request.

## Page copywriting

For creating or revising Lemoon page copy, including terms, returns, shipping, privacy, FAQs, and brand pages, use the `lemoon-copywriter` agent defined in `.codex/agents/lemoon-copywriter.toml` when available. If the role is unavailable in the current session, read that file and follow its instructions directly. It researches comparable Chilean eyewear stores, verifies legal claims against current official sources, and produces original es-CL drafts with source notes and unconfirmed business details clearly marked.

## Ticket delivery and testing

When asked to coordinate Linear tickets through delivery, use `linear-delivery-coordinator` in `.codex/agents/linear-delivery-coordinator.toml`. It routes scoped tickets to developer or writer agents, waits for implementation, delegates testing and independent reviews, opens PRs, addresses review comments, and merges to `main` after current checks and required approvals pass when the user authorized delivery through merge. The coordinator owns external ticket/PR updates; reviewers remain read-only. Agent definitions do not start background monitoring or authorize processing unspecified tickets.

For unit and end-to-end test work, use `theme-test-engineer` in `.codex/agents/theme-test-engineer.toml`. It creates and runs relevant Vitest and Playwright tests, distinguishes local fixtures from Shopify storefront coverage, and reports evidence and environment gaps. If a role is unavailable, read its definition and use a general agent with that scope; disclose any unavailable delegation or independent review.
