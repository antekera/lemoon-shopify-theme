---
description: Shopify development and automatic production deployment workflow
---

# Theme workflow

- Store: `lemoon-8277.myshopify.com`; public domain `lemoon.cl`.
- Development theme: `189557964968`. Run `shopify theme dev` for scoped local work; explicit dev pushes still use the dev theme.
- Git integration: feature PRs → human validation → `develop`; release PRs `develop` → `main`. Before any feature merge or auto-merge, follow [human review before develop](git-conventions.md#human-review-before-develop).

## Production

Standing authorization permits automatic publication of successful `main` CI revisions. `.github/workflows/ci.yml` calls `deploy-production.yml` after its five verification jobs succeed; no per-deploy confirmation is requested. Only the current main SHA is eligible, and concurrent uploads are serialized.

The workflow uses `SHOPIFY_CLI_THEME_TOKEN` (fallback: existing `SHOPIFY_ACCESS_TOKEN`), repository variables `SHOPIFY_PRODUCTION_STORE` and `SHOPIFY_PRODUCTION_THEME_ID`, and a production environment restricted to main without manual reviewers. Before writing, the script reads the published theme and verifies the expected store/ID. A changed target or absent credentials fails closed without installing apps or expanding scopes.

Deployment uploads only theme files changed since the last successfully verified release, recorded in the public `assets/lemoon-deployment.json` marker (last verified SHA plus pending attempt SHAs only). It never uploads `config/settings_data.json`, never deletes remote files, and leaves unrelated deployed/editor files untouched. Each candidate is pulled before writing and must match its previous released content, one of the recorded pending attempts, or the checked target (for retries); an unknown deployed change or missing previously released file stops the whole payload before upload. JSON formatting and Shopify's generated-file notice may differ, but content must agree. The first marker is bootstrapped only in the immediate release after verified main `3264927f5e4129cca605469acbe7007e95747208`; a later missing/invalid marker or non-ancestor baseline stops deployment.

The script rejects partial-upload JSON warnings/errors even when CLI exits zero, verifies every changed file by readback, checks merchant settings before/after, and advances the verified release SHA only after those checks pass. Before any payload upload, it persists and reads back an intent that retains **all** unverified attempt SHAs (at most 50, with idempotent retries deduplicated). A later main release reconciles the union of files those attempts could upload, including files reverted to their last verified content; replacing an interrupted attempt must not hide its partially applied files. Schema 1 markers remain readable and become schema 2 on the next write.

Recovery after a failed release: retry current main, or release a reviewed correction through develop → main. Pending files still present in the target are restored to that target; source-deleted files previously present in the verified baseline retain their verified content. A pending **added** file absent from the new target stops deployment because automatic deletion is disabled: include that path with reviewed content in the recovery PR, or arrange explicit inspected remote-file reconciliation before retrying. Do not erase the marker/pending journal to bypass the conflict. A full journal or unavailable/non-ancestor attempt history also stops safely. Temporary snapshots stay on the runner and are not uploaded as public artifacts. CLI uploads are not transactional and have no compare-and-swap: a failed upload may be partial, and a concurrent editor change after the last preflight cannot be atomically excluded. Do not edit the same files while deployment is running; reconcile a reported conflict through a reviewed PR rather than forcing the upload.

Manual dispatch of **Deploy Shopify production** is a read-only credential/target preflight. Retry a failed current-main CI run after fixing its actual blocker; do not replace it with a push of an unmerged local checkout. Report the workflow URL, SHA, verified live ID and readback result.

## Content and rollback

A theme deploy does not assign CMS templates, install apps, activate pixels, change catalog data or validate customer-message delivery. Preserve those acceptance tasks and authorizations. Revert a bad release through a PR to develop and a release PR to main; never reset or force-push the persistent branches.

Before pulling Shopify files locally, use a clean or temporary directory. Preserve schemas, settings and other owners' edits; do not modify generated output or node_modules.
