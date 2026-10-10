---
name: theme-commit
description: Validate, commit, and push Lemoon Shopify theme changes on the current feature branch when the user invokes the commit workflow.
---

# Commit Lemoon theme changes

1. Inspect `git status --short --branch` and `git branch --show-current`. Stop on `main` or if the requested change is not clear.
2. Run `shopify theme check --fail-level error`. If it reports errors, show them and stop before staging or committing.
3. Review the diff and choose only files that belong to the requested change. Never stage `.env`, credentials, `config/settings_data.json`, generated output, or unrelated user changes. Do not use blanket `git add .`.
4. Follow `.claude/rules/git-conventions.md` for the `<type>: <short description>` commit format. If the user explicitly asked to commit, report the proposed message and proceed; ask only if scope or meaning is ambiguous.
5. Stage the selected paths explicitly and create the commit on the current feature branch, then push that branch to `origin`, matching this workflow's explicit invocation. If the user specifically requests a local-only commit or excludes the push, follow that narrower scope.
6. Report the commit SHA, message, changed paths, and push result. State that Theme Check ran and include its actual result.
