Validate the Liquid theme and commit all local changes to the current git branch on GitHub.

Follow all conventions defined in `.claude/rules/git-conventions.md`.

## Steps

### 1. Pre-flight checks

Run in parallel:

- `git status` — collect modified and untracked files
- `git branch --show-current` — if on `main`, stop and tell the user to run `/lemoon-start-feature` first
- `shopify theme check 2>&1` — validate Liquid files

If `shopify theme check` reports any **errors** (not warnings), stop and show them. Do not commit until resolved.

### 2. Propose commit message

Infer type and description from the changed files following the format in `git-conventions.md`. Show the proposed message and ask for confirmation before proceeding.

### 3. Stage and commit

Stage only files listed under "What to commit" in `git-conventions.md`. Never stage `.env` or `config/settings_data.json`.

```bash
git add sections/ snippets/ templates/ assets/ config/settings_schema.json locales/ layout/ .claude/ docs/
git commit -m "<confirmed message>"
```

### 4. Push to GitHub

```bash
git push -u origin <current-branch>
```

Report: branch name, commit SHA, files changed. Remind the user: to open a PR run `/lemoon-open-pr`, to push to Shopify dev run `/lemoon-push-dev`.
