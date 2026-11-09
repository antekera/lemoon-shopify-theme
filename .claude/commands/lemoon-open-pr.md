Push the current feature branch and open a pull request to develop on GitHub.

Steps:

1. Run `git status` — if there are uncommitted changes, stop and tell the user to commit them first.
2. Run `git branch --show-current` to get the current branch name. If it's `main` or `develop`, stop and tell the user this command must be run from a feature branch.
3. Run `git log origin/develop..HEAD --oneline` to list the commits that will be in the PR.
4. Run `git push -u origin <branch-name>` to push the branch.
5. Infer a PR title from the branch name and commits (follow the commit message format: `feat: ...`, `fix: ...`, etc.).
6. Write a PR body with:
   - **Summary:** bullet points of what changed
   - **Sections affected:** list of `.liquid` files modified
   - **Test plan:** checklist — verify on dev theme preview, check mobile, check theme editor
   - Footer: `🤖 Generated with Claude Code`
7. Run `gh pr create --base develop --draft --title "<title>" --body "<body>"` while human validation is pending. Return the PR URL, concrete preview/artifact, reviewed revision and validation results.

Wait for explicit human validation under [human review before develop](../rules/git-conventions.md#human-review-before-develop) before enabling auto-merge or merging to `develop`. After that approved integration, reviewed releases to `main` and successful main CI deployment retain standing authorization.
