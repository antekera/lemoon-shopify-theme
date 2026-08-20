# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## What this is

A Shopify theme for Lemoon, built on top of Dawn (Shopify's reference theme). Uses Liquid templates, JSON section schemas, CSS, and JavaScript. Deployed to Shopify via the Shopify CLI.

## Commands

```bash
# Start local dev server with hot reload (store read from .env)
shopify theme dev

# Start dev server with explicit store
shopify theme dev --store=lemoon-8277.myshopify.com

# Push all local changes to the active theme in Shopify
shopify theme push

# Push a specific file only
shopify theme push --only templates/product.json

# Pull latest theme from Shopify (overwrites local)
shopify theme pull

# List all themes in the store
shopify theme list

# Check Shopify CLI version
shopify version
```

## Project structure

```
layout/         # theme.liquid (global shell), password.liquid
templates/      # Page-type templates as JSON (product, collection, index, cart…)
sections/       # Reusable sections — each has a Liquid template + schema block
snippets/       # Small reusable Liquid partials (included via {% render %})
assets/         # JS, CSS, images, fonts
config/
  settings_schema.json   # Theme editor schema (defines customization options)
  settings_data.json     # Current saved values from the theme editor
locales/        # Translation strings (es.json, en.json, etc.)
```

## Shopify Liquid conventions

- Templates are JSON files that declare which sections appear on each page
- Sections live in `sections/` and include a `{% schema %}` block at the bottom
- Snippets are included with `{% render 'snippet-name' %}` (no variable leaking)
- Global settings are accessed via `{{ settings.variable_name }}`
- Section settings via `{{ section.settings.variable_name }}`
- Block settings via `{{ block.settings.variable_name }}`

## Development workflow

1. Run `shopify theme dev` — changes sync automatically to the preview URL
2. Edit `.liquid`, `.json`, `.css`, or `.js` files locally
3. Verify changes in the browser preview
4. Commit to git, then `shopify theme push` to persist to the store

## Environment

Copy `.env.example` to `.env` (gitignored) and set:

```
SHOPIFY_FLAG_STORE=lemoon-8277.myshopify.com
```

## Store

- Development store: `lemoon-8277.myshopify.com`
- Theme is based on Dawn — Shopify's reference theme
- Currency: CLP — Chile

## Design system

When making any visual or styling decisions, read these files first:

- `docs/design/brand-guidelines.md` — colors, typography, spacing tokens
- `docs/design/design-plan.md` — page inventory, component checklist, and implementation notes
- `docs/design/design-prompt.md` — AI image generation prompts per page/section
