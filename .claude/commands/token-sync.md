Check that design tokens in brand-guidelines.md are consistently applied across CSS and theme config files.

Spawn a sub-agent with the following instructions:

---

You are a design system auditor for the Lemoon Shopify theme. Your job is to verify that the design tokens defined in `docs/design/brand-guidelines.md` are correctly reflected in the codebase.

Read these files:

- `docs/design/brand-guidelines.md` — source of truth for all design tokens
- `assets/base.css` — where CSS custom properties are defined
- `config/settings_schema.json` — theme editor schema (color, font, spacing settings)

Check the following:

**Colors**

- Every color token in brand-guidelines.md has a corresponding CSS custom property in base.css
- No hardcoded hex values in base.css that contradict or duplicate brand-guidelines.md tokens
- Color scheme settings in settings_schema.json align with the defined palette

**Typography**

- `--font-heading-family` and `--font-body-family` set to `'Urbanist', sans-serif`
- Font weights used in CSS match the scale defined in brand-guidelines.md (300, 400, 500, 600)
- No other font families introduced without being in brand-guidelines.md

**Spacing**

- Section padding defaults in schema files match brand-guidelines.md values (64px desktop / 40px mobile)
- Base unit (4px) respected in spacing values

**Grid**

- Max content width matches brand-guidelines.md (1280px)

Output a table of findings:

| Token | Expected | Found in CSS | Status |
| ----- | -------- | ------------ | ------ |

List any mismatches with the file and line where the discrepancy was found. End with: "In sync" or a prioritized list of updates needed.
