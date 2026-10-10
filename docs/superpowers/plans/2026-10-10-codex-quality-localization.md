# Codex Review and Localization Workflows Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the four remaining review, token-audit, and Chilean Spanish localization workflows to Codex skills with four narrowly scoped agents.

**Architecture:** Skills in `.agents/skills` define triggers, inputs, output format, and when to delegate. TOML agents contain the specialist prompts and are read-only for reviews/audits; the translator gets workspace-write access limited by its prompt to missing Spanish locale values.

**Tech Stack:** Markdown, Agent Skills `SKILL.md`, Codex custom-agent TOML, Shopify Liquid/CSS/JSON, English and Chilean Spanish locale JSON.

**Spec:** `docs/superpowers/specs/2026-10-10-codex-workflow-port-design.md`

## Global Constraints

- Keep existing Claude instructions unchanged.
- Use `.agents/skills/<skill-name>/SKILL.md` and `.codex/agents/<agent-name>.toml`.
- Explicitly invocable skill names use `$<skill-name>` and appear in Codex's skill selector.
- Review and audit agents report evidence and do not change files.
- The translator may edit only requested missing keys in `locales/es.json`; it must preserve existing structure and voice.
- Do not publish to Shopify or modify local/permission settings.

## Review Focus

- Code and convention reviews must stay distinct: the first checks general Shopify quality and security, the second checks Lemoon-specific conventions; verify their criteria don't collapse into one checklist.
- Reviewer agents must be read-only and group findings by path with evidence and severity; verify TOML sandbox and output instructions.
- Token audit must compare brand guidance against actual CSS/theme settings and report mismatches without editing.
- Translation may only add missing keys from the English source and must preserve valid JSON and Chilean Spanish voice; check no existing key is rewritten by the workflow.
- All skill metadata and TOML files must parse, remain uniquely named, and leave Claude sources untouched.

---

## File Map

- `.agents/skills/theme-code-review/SKILL.md` and `.codex/agents/theme-code-reviewer.toml` — general Shopify quality review.
- `.agents/skills/theme-conventions-review/SKILL.md` and `.codex/agents/theme-conventions-reviewer.toml` — Lemoon-specific conventions review.
- `.agents/skills/audit-design-tokens/SKILL.md` and `.codex/agents/design-token-auditor.toml` — compare token documentation and implementation.
- `.agents/skills/translate-theme-locales/SKILL.md` and `.codex/agents/chilean-spanish-translator.toml` — translate missing locale keys.
- `scripts/test_codex_workflows.py` — shared standard-library validation for skill metadata and agent TOML.

## Tasks

### Task 1: Port the two review workflows

**Files:** Create the `theme-code-review` and `theme-conventions-review` skills and their two agent TOML files.

- [ ] Run `python3 scripts/test_codex_workflows.py reviews`; expect failure because the review skills and agents are absent.
- [ ] Give both skills unique frontmatter with clear triggers and distinguish the general Shopify review from the project-specific review.
- [ ] Preserve each source checklist and required output format; review changed files against the branch base, and cite file/line evidence for findings.
- [ ] Define each agent with required `name`, `description`, and `developer_instructions`; set `sandbox_mode = "read-only"` and prohibit edits.
- [ ] Require findings before summary, ordered by severity, grouped by file, with an explicit verdict.
- [ ] Compare against source Claude command text and parse the TOML files.
- [ ] Run `python3 scripts/test_codex_workflows.py reviews`; expect PASS.
- [ ] Commit as `feat: add Codex theme review workflows`.

### Task 2: Port the token audit workflow

**Files:** Create `.agents/skills/audit-design-tokens/SKILL.md` and `.codex/agents/design-token-auditor.toml`.

- [ ] Run `python3 scripts/test_codex_workflows.py tokens`; expect failure because this skill and agent are absent.
- [ ] Give the skill unique metadata and trigger it for checking design token consistency.
- [ ] Preserve source references to `docs/design/brand-guidelines.md`, `assets/base.css`, and `config/settings_schema.json`.
- [ ] Preserve checks for color, typography, spacing, and grid values and report expected/found/status with file locations.
- [ ] Make the agent read-only, require evidence for every mismatch, and prohibit code modifications.
- [ ] Compare the new content with `.claude/commands/lemoon-token-sync.md`; parse the agent TOML.
- [ ] Run `python3 scripts/test_codex_workflows.py tokens`; expect PASS.
- [ ] Commit as `feat: add Codex design token audit`.

### Task 3: Port Chilean Spanish localization

**Files:** Create `.agents/skills/translate-theme-locales/SKILL.md` and `.codex/agents/chilean-spanish-translator.toml`.

- [ ] Run `python3 scripts/test_codex_workflows.py translator`; expect failure because this skill and agent are absent.
- [ ] Give the skill valid metadata and trigger it for missing or requested locale translations.
- [ ] Preserve the Chilean voice rules, prohibited regional terms, and instructions to inspect existing locale context.
- [ ] Limit edits to missing `locales/es.json` keys sourced from `locales/en.json`; preserve product/brand names and JSON nesting.
- [ ] Define the agent with required TOML metadata and workspace-write scope; prohibit edits outside the locale file and prohibit retranslation of existing keys unless explicitly requested.
- [ ] Compare the skill and agent against `.claude/commands/lemoon-translator.md`; validate both locale JSON files parse after a representative check or fixture-based test.
- [ ] Run `python3 scripts/test_codex_workflows.py translator`; expect PASS.
- [ ] Commit as `feat: add Codex Chilean Spanish translation workflow`.

### Task 4: Validate skills, agent scope, and source compatibility

**Files:** All files created in Tasks 1–3.

- [ ] Run `python3 scripts/test_codex_workflows.py quality`; expect PASS for the review, token, and translator skills and agents.
- [ ] Assert the four reviewer/auditor agents have `sandbox_mode = "read-only"`; confirm only the translator receives workspace-write scope.
- [ ] Confirm `$theme-code-review`, `$theme-conventions-review`, `$audit-design-tokens`, and `$translate-theme-locales` are discoverable in Codex's skill selector; reload Codex once if automatic discovery has not refreshed.
- [ ] Check that no translation or reviewer action ran during metadata/discovery validation; workflows are merely available for use.
- [ ] Verify `.claude/` is unchanged, no sensitive/local files are present, and `git diff --check` passes.
