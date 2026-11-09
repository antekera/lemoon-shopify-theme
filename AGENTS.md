# Lemoon theme — Codex instructions

This repository is a Shopify Liquid theme based on Dawn. It uses Liquid sections and snippets, JSON templates and schemas, CSS, JavaScript, and Shopify CLI.

## Before changing files

- Check the current branch and working tree. Never commit or push directly to `main` or `develop`; do not discard or overwrite existing local changes.
- Read the applicable project rules in `.claude/rules/`: `liquid-conventions.md`, `section-schema.md`, `git-conventions.md`, and `theme-workflow.md`. These are shared repository conventions; preserve the Claude workflows themselves.
- Before creating or changing layouts, components, or styling, read root `DESIGN.md` for the visual contract, `docs/design/brand-guidelines.md` for brand usage, and the relevant design plan or section inventory. Keep `DESIGN.md` as the single source of visual decisions; update it when an authorized design change alters that contract.
- Before creating or modifying section or snippet markup, read `docs/components/README.md` and its matching recipe; reuse the canonical implementation with its CSS/JS. Document new, modified or removed components in `docs/design/component-inventory.md` and `.json` in the same PR, following the inventory maintenance rule.
- For brand identity, image selection, channel assets, or brand-content reviews, follow [brand guidance](docs/agents/brand-guidance.md).
- Before changing catalog offers, product purchase actions, lens configuration, prices, cart/order data, or prescription flows, read [the approved LEM-31 purchase decision](docs/architecture/adr-002-eyewear-purchase.md). Use it as the product contract; verify implementation and Shopify data separately.
- Keep edits scoped to the requested work. Do not modify `node_modules/` or Shopify-generated output.

## Current documentation (Context7-first)

For library, framework, SDK, API, CLI, or cloud-service syntax, configuration, migration, setup, or tool-specific debugging, fetch current documentation through Context7 even when the tool is familiar. Start with `resolve-library-id` using the library name and full question unless an exact `/org/project` ID was supplied. Select the most relevant authoritative match, use a version-specific ID when requested, and call `query-docs` with that ID and the full question. Base guidance on the returned documentation. If Context7 is unavailable or lacks the needed documentation, disclose that and consult current official documentation. General programming, business logic debugging, refactoring, and code review alone do not require documentation lookup.

## Theme conventions

- Use `{% render %}` and pass snippet inputs explicitly. Localize user-facing text through the existing locale files.
- Preserve valid Shopify section schemas, theme-editor settings, presets, and `block.shopify_attributes` where applicable.
- Keep `.env`, credentials, and `config/settings_data.json` out of commits. Never expose store secrets in instructions, logs, or generated files.
- Run `shopify theme check --fail-level error` and relevant project tests before reporting theme changes as validated.

## Git and Shopify safety

- Use the repository's branch prefixes and commit format. Route feature PRs to `develop` and release PRs from `develop` to `main`. Before merging to `develop` or enabling auto-merge, show the completed result and obtain explicit human validation of its reviewed revision, following [human review before develop](.claude/rules/git-conventions.md#human-review-before-develop). After that integration, standing authorization permits reviewed releases to `main` and automatic deployment without another routine confirmation.
- After every confirmed PR merge, close its Orca sessions and remove its worktrees and merged local/remote branches as part of delivery. Follow [post-merge cleanup](.claude/rules/git-conventions.md#post-merge-cleanup); preserve work added after the reviewed revision and report any cleanup blocker.
- Production deployment is automatic after successful CI on `main`, using `.github/workflows/deploy-production.yml`. This standing authorization replaces individual production-push confirmations. Development-theme pushes retain their scoped request requirements.
- The development theme is `189557964968`. CI verifies the currently published production theme against `SHOPIFY_PRODUCTION_THEME_ID`, deploys only the checked current `main` SHA, preserves `config/settings_data.json` and serializes uploads. A mismatched target, failed check or missing credential stops deployment; report the concrete blocker instead of requesting routine confirmation.
- Never pull from Shopify over uncommitted work.

## Codex skills

Repository skills live under `.agents/skills/`. Use `$<skill-name>` for explicit invocation or select an enabled skill from Codex's skill selector. Follow the skill's scope and safety rules; a skill does not authorize actions outside the user's request.

## Legal and contact data

Before changing policy content, legal identity, contact channels, return address, or delivery estimates, read [legal content sources](.claude/rules/legal-content-sources.md) and reconcile Shopify policies, theme settings, metafield consumers, and checkout.

## Page copywriting

For creating or revising Lemoon page copy, including terms, returns, shipping, privacy, FAQs, and brand pages, use the `lemoon-copywriter` agent defined in `.codex/agents/lemoon-copywriter.toml` when available. If the role is unavailable in the current session, read that file and follow its instructions directly. It researches comparable Chilean eyewear stores, verifies legal claims against current official sources, and produces original es-CL drafts with source notes and unconfirmed business details clearly marked.

## Agent routing

Definitions are in `.codex/agents/`. Select roles by responsibility:

- `theme-developer`: complete theme pages, flows, and integrations; `section-builder`: one approved section.
- `lemoon-copywriter`: research and write copy; `lemoon-copy-reviewer`: independent editorial/source review. Resolve missing business facts with the responsible product owner in the owning page ticket; deliver final integrated copy and QA before calling the page production-ready.
- `lemoon-design-lead`: consolidate approved Figma/design guidance and review visual adherence; `design-interpreter`: reference-to-spec work; `design-token-auditor`: read-only token checks.
- `theme-code-reviewer` and `theme-conventions-reviewer`: independent code and repository-convention reviews; `theme-test-engineer`: acceptance tests; `chilean-spanish-translator`: locale completion.

Back-office roles belong to `antekera/lemoon-next-backoffice`, under its `.codex/agents/`: `backoffice-developer`, `backoffice-code-reviewer`, and `backoffice-test-engineer`. Confirm the repository remote before cross-repository work. If a role is unavailable in this session, read its definition from the matching checkout and dispatch a general agent with those instructions and explicit file ownership. If independent delegation is unavailable, disclose the review gap.

## Ticket delivery and testing

For an authorized autonomous MVP queue, the coordinator must read `docs/agents/mvp-queue-policy.md`: select a frozen pilot batch of up to three ready tickets, keep at most two tickets active, and resume from recorded ownership/evidence rather than duplicating work. Use `docs/agents/orca-mvp-pilot-goal.md` as the Orca goal template. These files configure behavior; they start no ticket execution or background service. Technical delivery follows the human review gate before `develop`; reviewed releases from `develop` to `main` retain standing authorization. Human ticket acceptance and unresolved business/design/legal decisions remain separate.

### Linear ticket lifecycle

Any authorized contributor may work on tickets. The designated human reviewer is the person assigned to review the ticket or request; this role is not tied to a named individual. The coordinator owns status transitions and discovers the team's actual state names/IDs (for example, In Review and Done).

1. Move authorized work to **In Progress** when execution starts.
2. Move the ticket to **Review** when the scoped deliverable, required checks and independent reviews are ready. Add PR/artifact links, tested SHA, preview/evidence and remaining limitations.
3. **Every ticket requires human acceptance review**, including documentation and tickets without a PR. Record the designated human reviewer's explicit approval of that ticket and delivered revision before Complete. Pre-merge validation does not by itself complete a ticket. Business/design/legal decisions remain with their owner.
4. Merge PRs into `develop` only after the human review gate and current technical checks pass, with blocking feedback resolved. Promote those reviewed deliveries through a `develop` → `main` PR under standing authorization without another routine permission request. After human acceptance approval, confirm required integration, deployment and acceptance evidence before **Complete**; unresolved acceptance conditions keep the ticket in Review.
5. Changes requested return the ticket to In Progress; hand the corrected result back to Review. Material changes require renewed acceptance review. Respect narrower instructions such as no merge and preserve unrelated ticket states. `main` theme publication is already authorized through CI; app installs, catalog/content writes and other production actions retain their specific authorization requirements.

When asked to coordinate Linear tickets through delivery, use `linear-delivery-coordinator` in `.codex/agents/linear-delivery-coordinator.toml`. It routes scoped tickets to developer or writer agents, waits for implementation, delegates testing and independent reviews, opens PRs, addresses review comments, and waits for explicit human validation of the completed result before merging technically reviewed feature PRs into `develop`. Reviewed release PRs into `main` retain standing authorization after current checks pass. Human ticket acceptance remains separate from pre-merge validation; `main` deploys automatically after CI. The coordinator owns external ticket/PR updates; reviewers remain read-only. Agent definitions do not start background monitoring or authorize processing unspecified tickets.

For unit and end-to-end test work, use `theme-test-engineer` in `.codex/agents/theme-test-engineer.toml`. It creates and runs relevant Vitest and Playwright tests, distinguishes local fixtures from Shopify storefront coverage, and reports evidence and environment gaps. If a role is unavailable, read its definition and use a general agent with that scope; disclose any unavailable delegation or independent review.

## Review execution permissions

Custom agent files inherit parent-session permissions; a role-level `sandbox_mode` does not enforce read-only access. Reviewer prompts define a read-only responsibility, not a security boundary. For technically isolated review, launch the reviewer in a separately configured read-only parent session with mutating connectors unavailable, and verify effective permissions before dispatch. If the runtime cannot establish that isolation, report the limitation and do not claim permission isolation. Where enforced isolation is required, keep merge blocked until that review is available.
