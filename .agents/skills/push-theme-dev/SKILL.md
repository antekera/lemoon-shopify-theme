---
name: push-theme-dev
description: Publish the requested local Lemoon theme changes to the development Shopify theme when the user explicitly asks for a dev push.
---

# Push Lemoon to the development theme

1. Confirm the user explicitly requested a Shopify dev-theme push. Inspect `git status --short --branch` and list the changed paths.
2. Run `shopify theme push --theme=155925381288`. Do not substitute the live theme ID or run `shopify theme push` without an explicit target.
3. Report whether the command succeeded, which local files were changed, and where the user can verify the development preview. If the command fails, report its actual error and do not imply that the push succeeded.

This workflow targets only development theme `155925381288`; it never publishes to production.
