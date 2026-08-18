---
description: Git commit and branch conventions for the Lemoon theme repo
---

# Git Conventions

## Commit message format

```
<type>: <short description>

<optional body — why, not what>
```

Types:

- `feat` — new section, block, or feature
- `fix` — bug fix
- `style` — CSS/visual change with no logic change
- `refactor` — restructuring with no behavior change
- `chore` — config, tooling, dependency updates
- `docs` — documentation only

Examples:

```
feat: add testimonials-grid section with block support
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

- `config/settings_data.json` — contains live theme editor values (already in .gitignore)
- `.env` — contains store credentials (already in .gitignore)
- Any generated or compiled output

## Branch strategy (future)

When collaborating:

- `main` — stable, reflects what's on the production theme
- `dev/<feature-name>` — feature branches, merged via PR
- Always push to dev theme first before merging to main
