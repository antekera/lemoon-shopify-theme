---
name: start-theme-feature
description: Create a correctly named Lemoon feature branch from the latest main when asked to start work on a feature, fix, style, refactor, or tooling change.
---

# Start a Lemoon feature branch

1. Run `git status --short --branch`. If there are staged, unstaged, or untracked changes, stop without switching branches, stashing, or overwriting them; report the affected paths.
2. Infer the prefix from the requested work: `feat/` for features, `fix/` for bug fixes, `style/` for visual-only work, `refactor/` for behavior-preserving restructuring, and `chore/` for tooling or docs.
3. Convert the short description to lowercase kebab-case. Check whether the resulting branch already exists; do not reset or reuse an existing branch without asking.
4. Run `git switch main`, `git pull --ff-only origin main`, and create the new branch with `git switch -c <prefix>/<description>`.
5. Report the created branch. Do not make unrelated changes, push, or open a PR unless requested.
