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
