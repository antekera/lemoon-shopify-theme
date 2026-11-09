---
name: push-theme-production
description: Verify or recover the automatic Shopify production deployment of a checked main revision under standing authorization.
---

# Verify automatic Lemoon production deployment

Prepare/open a release PR only on an [explicit user release request](../../../.claude/rules/git-conventions.md#release-only-on-explicit-request); it may group multiple commits accumulated in develop. Feature approval or «sigamos» alone is not a release request. Standing authorization covers reviewed merging within that requested release and automatic deployment after main CI, without a separate deploy confirmation. Production is deployed by `.github/workflows/deploy-production.yml`, called after successful CI on `main`; it is not a push of arbitrary local changes.

1. Check `git status --short` and the intended release SHA. Preserve a dirty working tree; commit feature changes through develop instead of publishing them locally.
2. Inspect the release PR, its checked main SHA and CI/deployment jobs. Report any failed checks, stale revision, credential or target mismatch.
3. The workflow runs `shopify theme list`, verifies the published ID against the repository variable, preserves merchant settings and performs readback. Verify its actual logs/result; do not infer publication from a merge alone.
4. After fixing an actual blocker, retry the affected current-main CI run without a new permission request. Manual dispatch of the deploy workflow only runs read-only preflight.
5. Report the run URL, deployed SHA, live theme ID and verification result. Keep Shopify content/catalog changes and human ticket acceptance separate.
