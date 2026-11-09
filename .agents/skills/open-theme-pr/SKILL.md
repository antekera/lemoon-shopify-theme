---
name: open-theme-pr
description: Push the current Lemoon feature branch and create a pull request to develop when asked to open or submit a theme PR.
---

# Open a Lemoon theme pull request

1. Inspect `git status --short --branch` and `git branch --show-current`. Stop if there are uncommitted changes or the current branch is `main` or `develop`.
2. Confirm an open PR does not already exist for this branch. If one exists, report it instead of creating a duplicate.
3. Run `git log origin/develop..HEAD --oneline` and `git diff --stat origin/develop...HEAD` to understand the commits and actual scope.
4. Push the current branch with `git push -u origin <branch-name>`.
5. Create a feature PR with `gh pr create --base develop`. Release PRs are created separately with head `develop` and base `main`. Use `.github/PULL_REQUEST_TEMPLATE.md` when available; describe the problem, behavior, files/scope, and only validation that actually ran. Mark visual tests as not applicable when there is no UI impact. Never say the Shopify theme was published unless that separately happened.
6. Return the PR URL and summarize the commits and validation. Report that successful main CI deploys production automatically under the standing authorization; a develop merge is integration only. Once checks and independent technical review pass, the coordinator may merge without another permission question.
