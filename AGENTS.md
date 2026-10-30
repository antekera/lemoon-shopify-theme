# Lemoon theme — Codex instructions

This repository is a Shopify Liquid theme based on Dawn. It uses Liquid sections and snippets, JSON templates and schemas, CSS, JavaScript, and Shopify CLI.

## Before changing files

- Check the current branch and working tree. Never commit or push directly to `main`; do not discard or overwrite existing local changes.
- Read the applicable project rules in `.claude/rules/`: `liquid-conventions.md`, `section-schema.md`, `git-conventions.md`, and `theme-workflow.md`. These are shared repository conventions; preserve the Claude workflows themselves.
- Before creating or changing layouts, components, or styling, read root `DESIGN.md` for the visual contract, `docs/design/brand-guidelines.md` for brand usage, and the relevant design plan or section inventory. Keep `DESIGN.md` as the single source of visual decisions; update it when an authorized design change alters that contract.
- Keep edits scoped to the requested work. Do not modify `node_modules/` or Shopify-generated output.

## Current documentation (Context7-first)

For library, framework, SDK, API, CLI, or cloud-service syntax, configuration, migration, setup, or tool-specific debugging, fetch current documentation through Context7 even when the tool is familiar. Start with `resolve-library-id` using the library name and full question unless an exact `/org/project` ID was supplied. Select the most relevant authoritative match, use a version-specific ID when requested, and call `query-docs` with that ID and the full question. Base guidance on the returned documentation. If Context7 is unavailable or lacks the needed documentation, disclose that and consult current official documentation. General programming, business logic debugging, refactoring, and code review alone do not require documentation lookup.

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

## Agent routing

Definitions are in `.codex/agents/`. Select roles by responsibility:

- `theme-developer`: complete theme pages, flows, and integrations; `section-builder`: one approved section.
- `lemoon-copywriter`: research and write copy; `lemoon-copy-reviewer`: independent editorial/source review. Resolve missing business facts with Miguel in the owning page ticket; deliver final integrated copy and QA before calling the page production-ready.
- `lemoon-design-lead`: consolidate approved Figma/design guidance and review visual adherence; `design-interpreter`: reference-to-spec work; `design-token-auditor`: read-only token checks.
- `theme-code-reviewer` and `theme-conventions-reviewer`: independent code and repository-convention reviews; `theme-test-engineer`: acceptance tests; `chilean-spanish-translator`: locale completion.

Back-office roles belong to `antekera/lemoon-next-backoffice`, under its `.codex/agents/`: `backoffice-developer`, `backoffice-code-reviewer`, and `backoffice-test-engineer`. Confirm the repository remote before cross-repository work. If a role is unavailable in this session, read its definition from the matching checkout and dispatch a general agent with those instructions and explicit file ownership. If independent delegation is unavailable, disclose the review gap.

## Ticket delivery and testing

For an authorized autonomous MVP queue, the coordinator must read `docs/agents/mvp-queue-policy.md`: select a frozen pilot batch of up to three ready tickets, keep at most two tickets active, and resume from recorded ownership/evidence rather than duplicating work. Use `docs/agents/orca-mvp-pilot-goal.md` as the Orca goal template. These files configure behavior; they start no ticket execution or background service. PR-ready delivery is the default unless the invoking goal explicitly authorizes merge.

Linear status ownership: agents may move an authorized ticket to **In Progress** when work starts. When implementation and checks are ready, leave it **In Progress** and add a handoff with PR links, preview, test evidence, and remaining issues. **Only Miguel manually moves tickets to In Review or Done after his review.** A passing check, review approval, or merged PR does not authorize an agent to make either transition; preserve states Miguel has already set.

When asked to coordinate Linear tickets through delivery, use `linear-delivery-coordinator` in `.codex/agents/linear-delivery-coordinator.toml`. It routes scoped tickets to developer or writer agents, waits for implementation, delegates testing and independent reviews, opens PRs, addresses review comments, and merges to `main` after current checks and required approvals pass when the user authorized delivery through merge. The coordinator owns external ticket/PR updates; reviewers remain read-only. Agent definitions do not start background monitoring or authorize processing unspecified tickets.

For unit and end-to-end test work, use `theme-test-engineer` in `.codex/agents/theme-test-engineer.toml`. It creates and runs relevant Vitest and Playwright tests, distinguishes local fixtures from Shopify storefront coverage, and reports evidence and environment gaps. If a role is unavailable, read its definition and use a general agent with that scope; disclose any unavailable delegation or independent review.

## Review execution permissions

Custom agent files inherit parent-session permissions; a role-level `sandbox_mode` does not enforce read-only access. Reviewer prompts define a read-only responsibility, not a security boundary. For technically isolated review, launch the reviewer in a separately configured read-only parent session with mutating connectors unavailable, and verify effective permissions before dispatch. If the runtime cannot establish that isolation, report the limitation and do not claim permission isolation. Where enforced isolation is required, keep merge blocked until that review is available.
