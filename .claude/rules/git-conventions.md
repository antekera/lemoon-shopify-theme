---
description: Git commit and branch conventions for the Lemoon theme repo
---

# Git Conventions

## Branch workflow — REQUIRED

**Never commit or push directly to `main`.** All changes go through a feature branch and a PR.

```
main  ←  PR  ←  feat/section-name
                  fix/description
                  style/description
                  chore/description
```

### Standard flow

```bash
# 1. Create a feature branch
git checkout -b feat/trust-bar

# 2. Make changes, commit as you go
git add sections/trust-bar.liquid locales/en.json locales/es.json
git commit -m "feat: add trust-bar section with 4 configurable signals"

# 3. Push branch and open PR
git push -u origin feat/trust-bar
gh pr create --title "feat: trust-bar section" --body "..."

# 4. Merge PR on GitHub after review
# 5. Publish theme from Shopify admin
```

Use `/lemoon-start-feature <name>` to create a branch automatically.
Use `/lemoon-open-pr` to push the branch and open the PR.

## Post-merge cleanup

A confirmed PR merge authorizes cleanup of that PR's sessions, worktrees, and branches. Complete cleanup before the final delivery report; record any exception explicitly.

1. Verify the PR is `MERGED` in GitHub and record its repository, reviewed head, merge commit, branch, and exact Orca workspace selectors. For squash merges, use the PR head as evidence; Git ancestry into `main` alone is insufficient.
2. Inspect each workspace's tracked and untracked changes, local/remote heads, open PRs, and active ownership. Remove only heads covered by the merged PR. Preserve reused branches, later commits, dirty workspaces, and other tasks' sessions; report what remains and why. Preserve the main checkout and active development services.
3. Save the handoff, validation and cleanup evidence in Git's common directory before removing task workspaces. Settle supervised Dispatches through Orca; unresolved liveness requires recovery, not forced termination.
4. From a surviving checkout, close the merged task's Orca sessions with the installed CLI, then remove its worktrees through `orca worktree rm` using exact selectors. Use `git worktree remove` only for a checkout confirmed absent from Orca. Never force-remove a dirty workspace.
5. Remove any remaining covered local branches and the merged remote branch. Recheck the exact ref before deletion; pin remote deletion to its observed SHA so concurrent work is preserved. A closed but unmerged PR does not authorize deletion under this rule.
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
