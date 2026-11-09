Verify the automatic Shopify production deployment for the current main revision.

Follow `.claude/rules/theme-workflow.md` and `.agents/skills/push-theme-production/SKILL.md`. Standing authorization permits the main CI deployment without another confirmation. Inspect the CI/deploy run, current SHA, published theme ID and readback. Fix/retry an actual failed current-main run; preserve merchant settings and never publish an arbitrary local checkout. Manual workflow dispatch only runs a read-only preflight.
