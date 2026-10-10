# Codex Core Workflows Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Codex load Lemoon's repository-wide conventions and expose its six Git and Shopify operations as explicit Codex skills.

**Architecture:** A short root `AGENTS.md` will direct Codex to existing project guidance and state high-priority safety rules. Six `.agents/skills/*/SKILL.md` files will encode bounded workflows with Codex skill metadata and platform-appropriate invocation.

**Tech Stack:** Markdown, Codex `AGENTS.md` instructions, Agent Skills `SKILL.md` format, Git, Shopify CLI.

**Spec:** `docs/superpowers/specs/2026-10-10-codex-workflow-port-design.md`

## Global Constraints

- Keep `CLAUDE.md`, `.claude/commands/`, `.claude/rules/`, and `.claude/settings.json` unchanged.
- Store shared project instructions in a concise root `AGENTS.md` and repo skills in `.agents/skills/<skill-name>/SKILL.md`.
- Keep the existing Git branch naming and commit conventions; never commit or push directly to `main`.
- Never stage `.env`, credentials, or `config/settings_data.json`.
- A production theme push requires explicit confirmation immediately before the push.
- Explicit skill use must work through `$<skill-name>`; enabled skills should be available through Codex's skill selector.
- Do not change storefront or Shopify runtime files.

## Review Focus

- A dirty worktree must never be discarded by `start-theme-feature`; test with staged, unstaged, and untracked changes.
- Commit/PR flows must stop on `main`, exclude sensitive files, and run their stated checks; test a `main` branch and a fixture with `.env` listed as modified.
- Production publishing must stop before running Shopify CLI until explicit confirmation; inspect the prompt and execution sequence.
- Development publishing must target only the existing dev theme ID `155925381288`; confirm no live theme ID is used.
- `theme-status` must remain read-only and skills must have valid names/descriptions so Codex can discover and invoke them.

---

## File Map

- `AGENTS.md` — concise project identity, required references, Git rules, Shopify safety, and validation.
- `.agents/skills/theme-commit/SKILL.md` — validate and commit current branch safely.
- `.agents/skills/open-theme-pr/SKILL.md` — push and open a PR to `main`.
- `.agents/skills/push-theme-dev/SKILL.md` — publish to the dev theme only.
- `.agents/skills/push-theme-production/SKILL.md` — inspect the live theme and require direct confirmation before publishing.
- `.agents/skills/start-theme-feature/SKILL.md` — create an appropriately named branch without losing work.
- `.agents/skills/theme-status/SKILL.md` — read-only local Git and Shopify theme status.
- `scripts/test_codex_workflows.py` — standard-library validator for skill frontmatter, agent TOML, and required safety wording, grouped so each implementation task can be checked independently.

## Tasks

### Task 1: Add concise repository instructions

**Files:** Create `AGENTS.md` and `scripts/test_codex_workflows.py`.

- [ ] Write the validator for the `core` group; require concise repo identity and assertions for main-branch protection, sensitive-file exclusions, production confirmation, and Theme Check.
- [ ] Run `python3 scripts/test_codex_workflows.py core`; expect failure because `AGENTS.md` and the validator's required guidance are absent.
- [ ] Read the current `CLAUDE.md`, `.claude/rules/*.md`, and relevant design references before writing the Codex instructions.
- [ ] Write project identity and point Codex to the existing Liquid, section-schema, Git, theme-workflow, and design guidance; do not copy their full checklists.
- [ ] State branch protection, sensitive-file exclusions, localization, Shopify Theme Check, and explicit production-push confirmation.
- [ ] Keep the file concise and free of Claude-only settings, secrets, credentials, or machine-specific paths.
- [ ] Run `python3 scripts/test_codex_workflows.py core`; expect PASS with all required guidance present.
- [ ] Verify every referenced path exists and inspect that the file says never to commit/push directly to `main`.
- [ ] Commit as `docs: add Codex repository guidance`.

### Task 2: Add Git workflow skills

**Files:** Create `theme-commit`, `open-theme-pr`, `start-theme-feature`, and `theme-status` skill directories and `SKILL.md` files.

- [ ] Run `python3 scripts/test_codex_workflows.py git`; expect failure because the four Git skills are absent.
- [ ] Give each `SKILL.md` valid YAML frontmatter with a unique `name` matching its directory and a concise trigger-focused `description`.
- [ ] Preserve the source workflow: check branch and worktree state, follow commit conventions, stage only intended files, and run Theme Check before committing.
- [ ] Make PR creation report changed scope and real validation; preserve the repository PR template and never imply that a Shopify theme was published.
- [ ] Make feature start refuse a dirty worktree and use existing branch prefixes; make status inspection read-only.
- [ ] Check each skill's contents against its corresponding `.claude/commands/lemoon-*.md` and `.claude/rules/git-conventions.md`.
- [ ] Run `python3 scripts/test_codex_workflows.py git`; expect PASS.
- [ ] Commit as `feat: add Codex Git workflow skills`.

### Task 3: Add Shopify publishing skills

**Files:** Create `push-theme-dev` and `push-theme-production` skill directories and `SKILL.md` files.

- [ ] Run `python3 scripts/test_codex_workflows.py shopify`; expect failure because the two publishing skills are absent.
- [ ] Give both skills valid, unique frontmatter and explicit scope in their descriptions.
- [ ] Set dev publishing to theme ID `155925381288`; require reporting changed files and preview verification instructions.
- [ ] For production, run `shopify theme list`, identify the current live ID, show it to the user, and ask for explicit confirmation before the push.
- [ ] Ensure the production skill does not treat inspection, preparation, or preview requests as confirmation and warns that the live store is affected.
- [ ] Compare both workflows to `.claude/rules/theme-workflow.md` and `.claude/commands/lemoon-push-*.md`.
- [ ] Run `python3 scripts/test_codex_workflows.py shopify`; expect PASS.
- [ ] Commit as `feat: add Codex Shopify publishing skills`.

### Task 4: Validate discovery and safety

**Files:** All files created in Tasks 1–3.

- [ ] Run `python3 scripts/test_codex_workflows.py core && python3 scripts/test_codex_workflows.py git && python3 scripts/test_codex_workflows.py shopify`; expect PASS for this plan's six skills, repository guidance, and Shopify publishing safety assertions. The `all` group remains for final validation after the other plans.
- [ ] Confirm Codex sees these skills in the repository skill selector and explicitly invokes `$theme-status` from a no-change status request; reload Codex once if automatic skill discovery has not refreshed.
- [ ] Review safety scenarios in Review Focus; ensure production push is blocked pending confirmation and dev push targets only its fixed dev theme.
- [ ] Run `git diff --check`; verify no `.claude/` files or Shopify runtime files changed and no sensitive/local files are staged.
- [ ] Review the diff and confirm all changes remain on `chore/codex-workflow-port` for PR #22.
