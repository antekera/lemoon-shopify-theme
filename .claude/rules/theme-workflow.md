---
description: Development workflow rules for the Lemoon Shopify theme
---

# Theme Workflow

## Store

- Store: `lemoon-8277.myshopify.com` (custom domain: `lemoon.cl`)
- Live theme ID: `155307737256` — production, handle with care
- Dev theme ID: `155307016360` (development — for local preview, safe to push freely)

## Local development loop

1. Run `shopify theme dev` — reads store from `.env`
2. Edit `.liquid`, `.json`, `.css`, or `.js` files locally
3. Preview at `http://127.0.0.1:9292` — changes sync automatically
4. Commit to git before pushing to any Shopify theme

## Pushing changes

- **Preview local** (dev theme): `shopify theme push --theme=155307016360`
- **Production** (live theme): `shopify theme push --theme=155307737256` — always confirm before doing this

## Pulling changes

If theme editor changes were made in Shopify admin and need to come back locally:

```bash
shopify theme pull --theme=155307016360
```

Always commit before pulling to avoid losing local work.

## Template JSON files

- `templates/*.json` declare which sections appear on each page type
- To add a section to a page, edit the relevant template JSON and add the section to the `sections` object and `order` array
- After editing template JSON, verify in the theme editor that sections appear correctly

## File change scope

- CSS changes: edit `assets/base.css` for global styles, or create `assets/component-<name>.css` for component-specific styles
- JS changes: edit or create files in `assets/`, load them via `{{ 'filename.js' | asset_url | script_tag }}`
- Never modify files in `node_modules/` or Shopify's generated output
