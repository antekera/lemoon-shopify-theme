---
description: Git integration, release authorization and post-merge cleanup for Lemoon
---

# Git conventions

## Branches and authorization

```text
feature/fix/style/chore branch → preview + human validation → PR merge to develop → release PR → main → CI → production
```

`develop` is the default integration branch; start new work from `origin/develop`. `main` is the production release branch. Both accept PRs with five required checks; direct pushes, force pushes and deletion are protected. Develop requires an up-to-date head (`strict=true`). Main uses `strict=false` so recurring merge-commit releases do not require rewriting develop; the coordinator still refreshes the release head/base and checks before merging.

**Standing authorization:** after human-validated integration into `develop`, the coordinator may promote a coherent reviewed batch to `main`; successful main CI deploys production without another routine confirmation. Miguel's instruction of 09-11-2026 replaces the earlier autonomous feature-merge permission with the following gate. Passing CI, independent technical review and resolution of blocking feedback remain required.

### Human review before develop

1. Prepare the scoped change and show the designated human reviewer a concrete preview or artifact of the completed result, with its revision and validation evidence. Branches, commits and PRs may be prepared before approval; prefer a draft PR while review is pending.
2. Wait for the reviewer's explicit approval of that result before merging any feature PR into `develop` or enabling auto-merge. Record the approval's message/link, scope and reviewed revision in the PR or owning ticket. A request to change wording or behavior authorizes preparing the correction; it does not approve an unseen result. Silence, elapsed time, technical/Codex approval, an old Done ticket or the former broad merge authorization do not satisfy this gate.
3. Material changes to the reviewed result require a new preview and renewed approval. Keep the change available for review until approval arrives; then refresh checks, independent review and blocking feedback for the merge revision.

- Feature PRs target `develop`, normally with squash merge. Only after the human gate and technical checks pass, use `gh pr merge --auto --squash --match-head-commit <reviewed-sha>`; verify actual MERGED state before reporting integration.
- Releases are PRs with head `develop` and base `main`, using a **merge commit** to preserve ancestry. The coordinator can create and merge a release when the batch is ready, without a permission question. Do not automatically release every individual feature merge or merge unrelated draft work.
- `main` pushes run CI and automatically call the production deployment workflow after every required job succeeds. A failed check or deployment is a blocker to report/fix, not a new authorization prompt.
- Keep `develop` after release. Main contains only release merge commits, so the next release retains develop ancestry without resets or force pushes. If an exceptional main-only change exists, reconcile it through a PR before subsequent feature work.
- Pre-merge validation and human ticket acceptance are separate. Keep a ticket in Review until its owner accepts the delivered result and its real acceptance evidence is satisfied. Pre-merge approval or a merge alone does not prove deployment, CMS activation or completed ticket acceptance.

## Branch and commit naming

Use `feat/`, `fix/`, `style/`, `refactor/` or `chore/` for scoped branches and `<type>: <short description>` for commits. Never commit or push feature work directly to `main` or `develop`. Stage explicit task paths; keep `.env`, credentials and `config/settings_data.json` out of Git. Protect concurrent dirty work.

## Delivery commands

Start from fetched `origin/develop`; commit the authorized scope, push its feature branch and create the PR with `gh pr create --base develop --draft` while human validation is pending. Present its preview and follow [human review before develop](#human-review-before-develop) before enabling auto-merge or merging. A release PR uses `gh pr create --base main --head develop`. Do not use an admin bypass to evade a failed check or branch protection.

## Post-merge cleanup

A confirmed PR merge authorizes cleanup of that PR's sessions, worktrees, and branches. Complete cleanup before the final delivery report; record any exception explicitly.

1. Verify the PR is `MERGED` in GitHub and record its repository, reviewed head, merge commit, branch, and exact Orca workspace selectors. For squash merges, use the PR head as evidence; Git ancestry into `main` alone is insufficient.
2. Inspect each workspace's tracked and untracked changes, local/remote heads, open PRs, and active ownership. Remove only heads covered by the merged PR. Preserve reused branches, later commits, dirty workspaces, and other tasks' sessions; report what remains and why. Preserve the main checkout and active development services.
3. Save the handoff, validation and cleanup evidence in Git's common directory before removing task workspaces. Settle supervised Dispatches through Orca; unresolved liveness requires recovery, not forced termination.
4. From a surviving checkout, close the merged task's Orca sessions with the installed CLI, then remove its worktrees through `orca worktree rm` using exact selectors. Use `git worktree remove` only for a checkout confirmed absent from Orca. Never force-remove a dirty workspace.
5. Keep the persistent `main` and `develop` branches. Remove any remaining covered feature/release local branches and their merged remote branches. Recheck the exact ref before deletion; pin remote deletion to its observed SHA so concurrent work is preserved. A closed but unmerged PR does not authorize deletion under this rule.
6. Verify the sessions, workspace registrations, directories, and branches are gone. Fetch/prune stale tracking refs and fast-forward a clean `main` from `origin/main`. Record removed resources and preserved exceptions in the checkpoint and final report. A removal error remains pending cleanup, not success.

This is a required delivery step, not a background monitor. If the coordinator is running inside a workspace to remove, hand control to a surviving checkout before closing it.

## Branch naming

| Prefix      | When to use                         | Example                         |
| ----------- | ----------------------------------- | ------------------------------- |
| `feat/`     | New section, block, or feature      | `feat/how-it-works`             |
| `fix/`      | Bug fix                             | `fix/mobile-padding-hero`       |
| `style/`    | Visual/CSS change only              | `style/button-border-radius`    |
| `refactor/` | Restructure without behavior change | `refactor/card-product-snippet` |
| `chore/`    | Config, tooling, docs               | `chore/update-claude-rules`     |

## Commit message format

```
<type>: <short description>

<optional body — why, not what>
```

Examples:

```
feat: add trust-bar section with configurable signals
style: update hero banner typography to match brand guidelines
fix: correct padding on mobile for featured-collection
chore: update .claude commands and rules
```

## What to commit

- All `.liquid`, `.json`, `.css`, `.js` files
- `config/settings_schema.json` — theme editor schema changes
- `locales/*.json` — translation string changes
- `.claude/` — rules, commands, settings
- `docs/` — design docs

## What NOT to commit

- `config/settings_data.json` — live theme editor values (in .gitignore)
- `.env` — store credentials (in .gitignore)
- Any generated or compiled output
