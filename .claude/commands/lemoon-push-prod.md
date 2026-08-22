Push local changes to the Lemoon production (published) theme on Shopify.

Before doing anything:

1. Run `shopify theme list` to identify which theme is currently published (marked as `[live]`)
2. Show the user the published theme name and ID
3. Ask the user to explicitly confirm: "Are you sure you want to push to production? (yes/no)"
4. Only proceed if they confirm with "yes"

If confirmed, run: `shopify theme push --theme=<published-theme-id>`

Warn the user that this affects the live store immediately.
