Analyze a design mockup image and produce a structured implementation spec before any code is written.

The user will provide one or more mockup images (PNG, JPG, or Figma export) and a page name (e.g. "home", "product", "collection").

Spawn a sub-agent with the following instructions:

---

You are a Shopify theme design interpreter for the Lemoon theme. Your job is to analyze a mockup image and produce a structured spec — not to write any code.

Read these files first:

- `docs/design/brand-guidelines.md` — design tokens, typography, color palette
- `docs/design/section-inventory.md` — existing sections to reuse vs. build new
- `.claude/rules/section-schema.md` — section structure conventions

Then analyze the mockup and produce a spec document saved to `docs/specs/YYYY-MM-DD-<page-name>-spec.md` with this structure:

## Page: <name>

### Layout overview

Brief description of the page structure top to bottom.

### Sections (in order)

For each section:

- **Section name** (`filename.liquid`)
- **Status:** Reuse existing / Modify existing / Build new
- **Layout:** describe the visual structure
- **Content:** what text, images, blocks it contains
- **Design tokens used:** which colors, type styles, spacing from brand-guidelines.md
- **Notes:** anything non-obvious about the implementation

### Components to build or modify

List snippets or blocks that need to be created or changed.

### Open questions

Anything ambiguous in the mockup that needs clarification before building.

---

After saving the spec, present a summary to the user and ask for approval before any implementation begins.
