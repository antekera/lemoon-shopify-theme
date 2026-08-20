Push the current feature branch and open a pull request to main on GitHub.

Steps:

1. Run `git status` — if there are uncommitted changes, stop and tell the user to commit them first.
2. Run `git branch --show-current` to get the current branch name. If it's `main`, stop and tell the user this command must be run from a feature branch.
3. Run `git log main..HEAD --oneline` to list the commits that will be in the PR.
4. Run `git push -u origin <branch-name>` to push the branch.
5. Infer a PR title from the branch name and commits (follow the commit message format: `feat: ...`, `fix: ...`, etc.).
6. Write a PR body with:
   - **Summary:** bullet points of what changed
   - **Sections affected:** list of `.liquid` files modified
   - **Test plan:** checklist — verify on dev theme preview, check mobile, check theme editor
   - Footer: `🤖 Generated with Claude Code`
7. Run `gh pr create --title "<title>" --body "<body>"` and return the PR URL to the user.

Remind the user: after the PR is merged, publish the updated theme from the Shopify admin — do not push directly to the production theme.
