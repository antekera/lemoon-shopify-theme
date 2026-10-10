# Codex Theme Authoring Workflows Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port Lemoon's four design and Liquid authoring workflows and their two specialist roles to Codex-native skills and agents.

**Architecture:** Four repo-level skills will keep task triggers and procedures in `.agents/skills`; two project-scoped agents will hold the specialized design interpreter and section builder prompts. Both will consult the existing project conventions rather than replacing Claude files.

**Tech Stack:** Markdown, Agent Skills `SKILL.md`, Codex custom-agent TOML, Shopify Liquid and JSON section schemas.

**Spec:** `docs/superpowers/specs/2026-10-10-codex-workflow-port-design.md`

## Global Constraints

- Keep all existing Claude files unchanged.
- Use `.agents/skills/<skill-name>/SKILL.md` and `.codex/agents/<agent-name>.toml`.
- Skills use unique `name` and trigger-focused `description` frontmatter and support `$<skill-name>` invocation.
- Section and snippet authoring follows `.claude/rules/liquid-conventions.md` and `.claude/rules/section-schema.md`.
- Design interpretation produces a dated spec and pauses for user approval before implementation.
- No authoring skill or agent publishes changes to Shopify.

## Review Focus

- A new section includes valid theme-editor schema, padding settings, translations, and a preset; verify its skill directs each requirement.
- A reusable snippet receives all inputs explicitly and does not depend on parent Liquid scope; verify the scaffold workflow requires this.
- Design interpretation must save a spec and pause, while section building may write only after approval; validate this separation in skill/agent instructions.
- Custom-agent TOML must have supported required fields and the right sandbox scope; parse all TOML and ensure the builder is workspace-write while interpreter is workspace-write only for spec output.
- Skill files must remain discoverable and selectable in Codex while `.claude` sources remain unchanged.

---

## File Map

- `.agents/skills/design-interpreter/SKILL.md` — mockup-to-spec workflow.
- `.agents/skills/new-theme-section/SKILL.md` — scaffold a new Liquid section.
- `.agents/skills/scaffold-theme-snippet/SKILL.md` — create a reusable snippet.
- `.agents/skills/build-theme-section/SKILL.md` — implement an approved section specification.
- `.codex/agents/design-interpreter.toml` — specialized design analysis instructions.
- `.codex/agents/section-builder.toml` — scoped Shopify section implementation instructions.

## Tasks

### Task 1: Port design interpretation

**Files:** Create `.agents/skills/design-interpreter/SKILL.md` and `.codex/agents/design-interpreter.toml`.

- [ ] Give the skill unique valid frontmatter and trigger it for user-provided mockups or page design references.
- [ ] Preserve the existing design output sections: layout, ordered sections, components, tokens, and open questions.
- [ ] Require reading brand guidelines, section inventory, and schema guidance where available; record missing references as a limitation rather than inventing them.
- [ ] Save the artifact to `docs/specs/YYYY-MM-DD-<page-name>-spec.md` and ask for approval before implementation.
- [ ] Define agent `name`, `description`, and `developer_instructions` in TOML; give it bounded instructions and workspace-write access only to produce the requested spec.
- [ ] Compare the skill and agent with `.claude/commands/lemoon-design-interpreter.md` and parse the TOML with Python `tomllib`.
- [ ] Commit as `feat: add Codex design interpreter workflow`.

### Task 2: Port section and snippet scaffolding

**Files:** Create `.agents/skills/new-theme-section/SKILL.md` and `.agents/skills/scaffold-theme-snippet/SKILL.md`.

- [ ] Give each skill unique frontmatter and explicit trigger descriptions.
- [ ] Preserve the section workflow: inspect 1–2 similar sections, use a semantic wrapper, apply section padding, add block Shopify attributes, schema, preset, and translations.
- [ ] Preserve the snippet workflow: inspect similar snippets, use semantic markup, accept explicit parameters, and report a complete `{% render %}` call.
- [ ] Require confirming branch is not `main` before creating a section and keep changes scoped to the requested artifact.
- [ ] Compare each skill against its source Claude command and both Liquid/schema rule documents; check frontmatter fields and file references.
- [ ] Commit as `feat: add Codex section scaffolding skills`.

### Task 3: Port approved section building

**Files:** Create `.agents/skills/build-theme-section/SKILL.md` and `.codex/agents/section-builder.toml`.

- [ ] Require a spec or clear user description and confirm the current branch is not `main` before modifying files.
- [ ] Preserve the existing steps for similar-section inspection, Liquid implementation, localization, inventory update, and schema conventions.
- [ ] Bound implementation to the requested section and necessary translations/inventory; prohibit Shopify push or unrelated section edits.
- [ ] Define the custom agent with required TOML fields and workspace-write scope; instruct it to follow only the approved spec and report files/tests.
- [ ] Compare the result against `.claude/commands/lemoon-section-builder.md` and referenced rule files; parse the TOML.
- [ ] Commit as `feat: add Codex section builder workflow`.

### Task 4: Validate selector and role boundaries

**Files:** All files created in Tasks 1–3.

- [ ] Validate exactly four skill directories, unique matching names, non-empty descriptions, and valid skill Markdown frontmatter.
- [ ] Parse both agent files with `python3` `tomllib` and assert `name`, `description`, and `developer_instructions` are present.
- [ ] Confirm `$design-interpreter` is discoverable in Codex and that invoking it requests or analyzes a design and produces a spec; reload Codex once if automatic discovery has not refreshed, and do not start implementation during this check.
- [ ] Confirm `.claude/` is unchanged, no storefront runtime files changed, and no skill can publish to Shopify.
- [ ] Run `git diff --check` and inspect all changed files against this plan and its Review Focus.
