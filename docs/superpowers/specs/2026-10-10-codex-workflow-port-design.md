# Port of Lemoon Claude workflows to Codex

**Date:** 2026-10-10
**Status:** Approved and implemented on PR #22
**Scope:** Add Codex-native repository guidance and reusable workflows while preserving the existing Claude Code setup.

## Problem

The repository has a useful set of Claude Code instructions in `CLAUDE.md` and `.claude/`, but Codex does not use those files as its native instruction, skill, or agent entry points. As a result, Codex may miss Lemoon's Shopify theme conventions, review workflows, and safeguards when working in this repository.

## Approved direction

Add native Codex equivalents on the existing PR #22 branch, keeping this work separate from the PDP unit-test PR. Keep all current Claude files working and unchanged in this migration. Do not copy Claude's local permission configuration into Codex configuration.

The repository will use these Codex entry points:

- Root `AGENTS.md` for concise instructions that apply to all Codex work in the repository.
- `.agents/skills/<skill-name>/SKILL.md` for the 14 reusable Lemoon workflows listed below.
- `.codex/agents/<agent-name>.toml` for six specialized roles used by workflows that currently delegate review or interpretation work.
- Existing project documents under `docs/` as the detailed source references for brand, Liquid, schema, Git, and theme-publishing conventions.

Skills should be explicitly invocable with `$<skill-name>` and discoverable in Codex's enabled-skill selector (including the `/` picker in the desktop app). The migration does not promise Claude's exact custom `/lemoon-…` command syntax; skill names and descriptions will be optimized for Codex's selector and invocation model.

Codex-specific configuration is additive. Claude Code continues to use `CLAUDE.md`, `.claude/commands/`, and `.claude/rules/` as before.

## Workflow mapping

Each existing command receives one Codex skill with equivalent intent and platform-appropriate instructions. The skill names below omit the existing `lemoon-` prefix to keep invocations concise; names can be adjusted during implementation if Codex discovery or naming conflicts require it.

| Existing Claude command | Proposed Codex skill | Delegated Codex agent |
| --- | --- | --- |
| `lemoon-code-reviewer` | `theme-code-review` | `theme-code-reviewer` |
| `lemoon-commit` | `theme-commit` | — |
| `lemoon-design-interpreter` | `design-interpreter` | `design-interpreter` |
| `lemoon-new-section` | `new-theme-section` | — |
| `lemoon-open-pr` | `open-theme-pr` | — |
| `lemoon-push-dev` | `push-theme-dev` | — |
| `lemoon-push-prod` | `push-theme-production` | — |
| `lemoon-scaffold-block` | `scaffold-theme-snippet` | — |
| `lemoon-section-builder` | `build-theme-section` | `section-builder` |
| `lemoon-start-feature` | `start-theme-feature` | — |
| `lemoon-theme-reviewer` | `theme-conventions-review` | `theme-conventions-reviewer` |
| `lemoon-theme-status` | `theme-status` | — |
| `lemoon-token-sync` | `audit-design-tokens` | `design-token-auditor` |
| `lemoon-translator` | `translate-theme-locales` | `chilean-spanish-translator` |

The six agent definitions preserve the specialized role prompts currently embedded in the delegated Claude commands. Agents report findings or produce their assigned artifact; they do not expand their scope to unrelated files or independently publish changes.

## Shared repository guidance

`AGENTS.md` will be concise and cover the rules Codex must see before any workflow runs:

- Identify the project as a Shopify Liquid theme based on Dawn.
- Read relevant brand, Liquid, section-schema, Git, and publishing guidance before making changes.
- Use feature branches and PRs; never commit or push directly to `main`.
- Keep user-facing theme text localized in `locales/en.default.json` and `locales/es.json`.
- Use Shopify-safe Liquid/snippet conventions and preserve theme-editor schema requirements.
- Protect production publishing: inspect the currently published theme, require explicit user confirmation immediately before a production push, and add Shopify CLI's `--allow-live` flag only after that confirmation for Codex's non-interactive shell.
- Never stage credentials, `.env`, or `config/settings_data.json`.
- Run the applicable validation, including Shopify Theme Check, before declaring theme changes ready.

Detailed rule content remains in the current `.claude/rules/` documents during this first migration. Codex skills and agents will be instructed to consult those shared-in-practice references, alongside applicable design docs, rather than duplicating long checklists in `AGENTS.md`. This avoids an oversized root instruction file. Whether to move these rule documents into platform-neutral `docs/agent-guides/` is explicitly deferred; it is not required to make the Codex workflows usable.

## Workflow behavior and safety

- Preserve the current Git branch naming and commit conventions.
- Commit and PR workflows must inspect status and branch, protect `main`, exclude secrets and generated/live theme data, and validate before committing.
- The Codex commit workflow's explicit-path allowlist includes root `AGENTS.md`, `.agents/skills/**`, and `.codex/agents/**` so future Codex workflow updates can be committed alongside the existing theme, Claude, and documentation paths.
- PR creation must summarize scope and validation, and must not claim that a Shopify theme was published.
- Development-theme publishing keeps the existing development theme target and reports the result.
- Production publishing keeps the explicit confirmation gate. Codex must not infer approval from a request to inspect, prepare, or preview a production push. The production push skill adds `--allow-live` only after confirmation, as Shopify CLI requires for live-theme pushes from a non-interactive shell.
- Start-feature must not discard or overwrite a dirty working tree.
- Theme status is read-only.
- Reviewer agents return evidence grouped by file, distinguish blocking findings from notes, and do not edit files unless the user separately asks for fixes.
- Translator workflow preserves the repository's existing Chilean Spanish voice guidance and locale structure.
- Design-interpreter workflow saves a dated spec and waits for approval before implementation, as the current command specifies.
- Section-building workflows remain bounded to the requested section/snippet and do not publish or push changes.

## Claude configuration boundary

Keep `CLAUDE.md`, `.claude/commands/`, `.claude/rules/`, and `.claude/settings.json` intact. In particular, do not translate Claude's shell allowlist or `.env` worktree symlink settings into Codex approval, sandbox, or execution settings. These settings are platform-specific and are not needed for repository guidance. Do not add credentials, tokens, or store secrets to Codex files.

## Out of scope

- Rewriting or removing the Claude Code setup.
- Porting Claude-specific permissions, hooks, or local machine settings.
- Changing Shopify theme code, storefront behavior, product data, or design tokens.
- Publishing to Shopify, pushing theme files, changing store configuration, or modifying production.
- Merging the separate PDP tests PR or including its commits in this branch.
- Automatically rewriting all existing Claude prompts to share a common source file.

## Implementation and validation outline

The implementation plan should:

1. Add and validate `AGENTS.md` against the repository's actual conventions and keep it brief enough for normal instruction discovery.
2. Create one Codex skill for each row in the mapping table, with valid skill metadata, clear triggers, bounded steps, and references to the appropriate rule/design documents.
3. Create the six agent definitions using Codex's supported repository-level agent format and preserve the intended read-only or artifact-producing scope of each role.
4. Confirm `.claude/` and `CLAUDE.md` have no migration-induced changes and confirm no credentials or local settings entered the diff.
5. Validate the file layout and metadata for all 14 skills and six agents; inspect that production push retains a confirmation gate and that commit/push skills protect `main` and sensitive files.
6. Run repository checks appropriate to instruction/configuration changes, inspect the final diff, then update PR #22. Do not create a duplicate migration PR or include PDP test commits.

The migration is documentation and agent-configuration work; it should not add theme runtime tests or modify Shopify storefront assets. A PR should be opened only after the user reviews and approves the implementation plan and the implementation passes its checks.

## Acceptance criteria

- Codex can discover project-wide guidance through root `AGENTS.md`.
- All 14 workflows have a discoverable skill and retain their current user-facing purpose.
- Skills appear in Codex's skill selector and can be explicitly invoked by their `$<skill-name>` names.
- All six specialist roles have native Codex agent definitions and are invoked only by relevant workflows.
- Safety rules for branch protection, sensitive files, production publishing, and bounded scope are explicit and testable by inspection.
- Existing Claude instructions remain available and unchanged.
- No storefront/theme runtime files or PDP test PR commits are included.
- The changes are prepared for review in PR #22, separately from PDP test PR #21.

## Questions resolved by the approved direction

- **Keep Claude support?** Yes. Claude files remain unchanged.
- **Port local permissions?** No. Keep machine-specific Claude settings out of Codex files.
- **Separate from PDP tests?** Yes. Use a dedicated branch and PR.
- **Where should workflows live?** Codex skills in `.agents/skills/`; role prompts in `.codex/agents/`; concise repository context in `AGENTS.md`.
