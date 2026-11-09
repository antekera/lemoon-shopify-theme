---
description: Shopify development and automatic production deployment workflow
---

# Theme workflow

- Store: `lemoon-8277.myshopify.com`; public domain `lemoon.cl`.
- Development theme: `189557964968`. Run `shopify theme dev` for scoped local work; explicit dev pushes still use the dev theme.
- Git integration: feature PRs → `develop`; release PRs `develop` → `main`. Follow [git conventions](git-conventions.md).

## Production

Standing authorization permits automatic publication of successful `main` CI revisions. `.github/workflows/ci.yml` calls `deploy-production.yml` after its five verification jobs succeed; no per-deploy confirmation is requested. Only the current main SHA is eligible, and concurrent uploads are serialized.

The workflow uses `SHOPIFY_CLI_THEME_TOKEN` (fallback: existing `SHOPIFY_ACCESS_TOKEN`), repository variables `SHOPIFY_PRODUCTION_STORE` and `SHOPIFY_PRODUCTION_THEME_ID`, and a production environment restricted to main without manual reviewers. Before writing, the script reads the published theme and verifies the expected store/ID. A changed target or absent credentials fails closed without installing apps or expanding scopes.

Deployment ignores `config/settings_data.json`, retains remote-only files with `--nodelete`, rejects partial-upload JSON warnings/errors even when CLI exits zero, checks the receipt identity, compares the settings hash before/after and reads back the uploaded layout. Temporary settings snapshots stay on the runner and are not uploaded as public artifacts. Template/section JSON in the reviewed release remains part of the code payload.

Manual dispatch of **Deploy Shopify production** is a read-only credential/target preflight. Retry a failed current-main CI run after fixing its actual blocker; do not replace it with a push of an unmerged local checkout. Report the workflow URL, SHA, verified live ID and readback result.

## Content and rollback

A theme deploy does not assign CMS templates, install apps, activate pixels, change catalog data or validate customer-message delivery. Preserve those acceptance tasks and authorizations. Revert a bad release through a PR to develop and a release PR to main; never reset or force-push the persistent branches.

Before pulling Shopify files locally, use a clean or temporary directory. Preserve schemas, settings and other owners' edits; do not modify generated output or node_modules.
