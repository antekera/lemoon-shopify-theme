---
name: theme-status
description: Show read-only Git and Shopify theme status, including live and development themes, local changes, and recent commits.
---

# Show Lemoon theme status

Run these read-only commands:

1. `shopify theme list` — identify the currently published theme and development theme from the actual output.
2. `git status --short --branch` — show the current branch and local changes.
3. `git log --oneline -5` — show the five most recent commits.

Summarize what is changed locally and whether it has been pushed to Shopify. Do not push, pull, switch branches, stage, or modify files as part of this status check.
