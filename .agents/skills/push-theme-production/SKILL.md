---
name: push-theme-production
description: Publish Lemoon theme changes to the live Shopify theme only after inspecting the currently published theme and receiving immediate explicit user confirmation.
---

# Push Lemoon to production

1. Run `shopify theme list` and identify the theme currently marked as live. Do not assume a saved theme ID is still published.
2. Show the user the live theme name and ID, explain that the push affects the live store, and ask: `¿Confirmas que publique los cambios actuales en el tema de producción <name> (ID <id>)? Responde sí o no.`
3. Wait for a clear affirmative response to that exact production-push request. A request to inspect, prepare, preview, or explain the push is not confirmation. If the user declines or the response is ambiguous, stop without running a push.
4. Only after confirmation, run `shopify theme push --theme=<currently-published-theme-id> --allow-live` using the ID just verified. Codex runs the CLI non-interactively, so `--allow-live` is required for a live-theme target. Never add this flag before receiving confirmation. Do not switch to another theme or push other files.
5. Report the command's actual result. If it fails, do not claim the live theme changed.
