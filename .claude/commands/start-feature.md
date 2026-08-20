Create a new feature branch following Lemoon's git conventions.

The user will provide a description like "trust-bar section" or "fix mobile padding hero".

Steps:

1. Run `git status` to confirm the working tree is clean. If there are uncommitted changes, stop and tell the user to commit or stash them first.
2. Run `git checkout main && git pull origin main` to start from the latest main.
3. Infer the correct branch prefix from the description:
   - New section, block, or feature → `feat/`
   - Bug fix → `fix/`
   - CSS/visual only → `style/`
   - Restructure without behavior change → `refactor/`
   - Config, tooling, docs → `chore/`
4. Convert the description to kebab-case (e.g. "trust bar section" → `feat/trust-bar`)
5. Run `git checkout -b <branch-name>`
6. Confirm to the user: "Branch `<branch-name>` created. You're ready to start working."
