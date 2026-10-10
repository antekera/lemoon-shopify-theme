---
name: theme-commit
description: Validate and commit local Lemoon Shopify theme changes on the current feature branch when asked to commit or save a checkpoint.
---

# Commit Lemoon theme changes

1. Inspect `git status --short --branch` and `git branch --show-current`. Stop on `main` or if the requested change is not clear.
2. Run `shopify theme check --fail-level error`. If it reports errors, show them and stop before staging or committing.
3. Review the diff and choose only files that belong to the requested change. Never stage `.env`, credentials, `config/settings_data.json`, generated output, or unrelated user changes. Do not use blanket `git add .`.
4. Follow `.claude/rules/git-conventions.md` for the `<type>: <short description>` commit format. If the user explicitly asked to commit, report the proposed message and proceed; ask only if scope or meaning is ambiguous.
5. Stage the selected paths explicitly and create the commit on the current feature branch. Do not push unless the user also asked for a push.
6. Report the commit SHA, message, and changed paths. State that Theme Check ran and include its actual result.
