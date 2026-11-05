# LEM-11 Style Quiz Implementation Plan

> **For agentic workers:** Use executing-plans for coordination and assigned repository roles for scoped implementation/testing. Steps use checkbox syntax.

**Goal:** Deliver the approved five-axis quiz with Shopify-owned style attributes and a full ranked group of canonical product cards.

**Architecture:** Liquid emits bounded, curated collection candidates from Shopify product and variant attributes. A pure JS ranker normalizes attributes, scores matched axes, chooses one best variant per product and exposes the complete group. The existing card supports an optional recommended variant without changing other consumers. One shared merchant-owned metaobject type stores reusable traits; existing shape/material fields remain unchanged.

**Tech Stack:** Shopify Liquid, native JavaScript/CSS, Vitest, Playwright. No new dependencies.

**Spec:** `docs/design/2026-11-05-style-quiz-strategy.md`, `docs/design/2026-11-05-style-quiz-catalog-audit.md`, `docs/design/style-quiz-prototype/README.md` and approved Figma.

## Global Constraints

- No budget/gender/face-shape ranking; shape is frame shape. Five question stages; finish/pattern/material/transparency independent.
- Shopify owns product, variant, price, availability and attributes. Never merge attributes across variants to fabricate a match.
- `custom.style_traits`: list.metaobject_reference on product and variant → `lemoon_style_trait`, fields `group`, `code`, `label`, optional `description` and `image`. Groups: color, finish, pattern, transparency, use, presence. Variant groups override corresponding product groups. Existing `custom.frame_shape` / `custom.frame_material` provide shape/material.
- Product `custom.style_quiz_ready` boolean gates eligibility; `custom.style_quiz_demo` boolean identifies synthetic test assignments. Do not alter existing compatibility, price, inventory, status or images.
- Curated collection supports up to 50 products, up to 20 variants each; report this bound to operators. Configured collection supplies future classified products without code edits. Further scaling is explicit, not silently advertised as whole-catalog ranking.
- Locale prefix `sections.lemoon_style_quiz_v2`. Preserve old translations for compatibility but remove budget UI/runtime.
- First-stage visual implementation uses existing Lemoon tokens/type/icons and replaceable SVG/editorial media. No Shopify theme push/publication authorized.

## Review Focus

- Same product with multiple variants: highest-affinity available variant wins; image/price/link/selected swatch agree.
- Missing or malformed attributes: do not score them; no false claims or fabricated fallback coincidences.
- Skipped questions: all skipped yields identified editorial results; skip one stage clears that stage's previous choices.
- More than three matching products: complete group remains accessible and ordered after edits/show-more, without duplicates.
- Demo assignments on active seed products: explicit demonstration notice; operator guide separates synthetic scenarios from verified final data.

### Task 1: Catalog schema, entries and seed assignments (coordinator)

**Files:** `docs/catalog/style-quiz.md`, `scripts/style-quiz-catalog-plan.json`, delivery evidence under ignored task ledger.
**Interface:** Product/variant metafields described above; seed only the five audited handles and their current variants after a fresh snapshot.

- [x] Inspect current definitions and product values; record IDs/digests and current state.
- [x] Create missing merchant-owned definitions and reusable trait entries, then assign to explicit demo IDs with compare-and-set where supported.
- [x] Retrieve values and verify referential integrity; preserve unknown commercial facts and mark demo cases.
- [x] Write operator guide and reusable assignment plan for future real products; record provenance and undo constraints.

### Task 2: Quiz implementation (theme-developer)

**Files:** `sections/lemoon-style-quiz.liquid`, `assets/lemoon-style-quiz.js`, new quiz CSS and quiz-only snippets, `templates/page.buscar-mi-estilo.json`.
**Interfaces:** Export `rankProducts(candidates, answers)` and `initializeQuiz(root)`. Candidate `{id,variantId,price,available,attributes:{shape:[],color:[],finish:[],pattern:[],material:[],transparency:[],use:[],presence:[]}}`. Answers use these same keys with arrays. Rank returns copied candidates enriched with `score`, `matched` axis keys, `editorial`; one candidate per product, stable ties, no 3-result cap. Missing/negative/nonfinite price and unavailable are ineligible. Each matching axis gives one point regardless of repeated/multiple values; canonical aliases map Spanish existing shape/material values to option codes. Any positive score qualifies. No answers → eligible editorial candidates.

- [x] Implement ranker against behavioral tests and read JSON candidates safely.
- [x] Build intro, five stages, detail subgroups, optional measures help, progress/back/skip/restart, editable preference summary, reasons and complete ranked group/show-more.
- [x] Serialize Shopify candidates and render canonical cards with optional `recommended_variant` assigned by coordinator. Hide unselected variants with JS; no-JS editorial fallback uses one available variant per product.
- [x] Migrate template to collection-driven ready products; remove budget and per-block faux attributes.
- [x] Run targeted tests and Theme Check; render local fixtures for mobile/desktop. Report Shopify-render coverage separately.

### Task 3: Canonical variant-aware product card (coordinator)

**Files:** `snippets/card-product.liquid`, minimal related price changes if necessary, `docs/components/recipes/product-card-grid.md`.
**Interface:** Optional `recommended_variant`, validated to belong to `card_product`; absent preserves existing behavior. Recommended variant drives initial media, links, price, swatch state. Quiz quick-add remains false.

- [x] Add meaningful render regression coverage using real snippet with declared fixture objects.
- [x] Implement the optional contract and run existing product-card/unit tests.

### Task 4: Copy/localization (lemoon-copywriter)

**Files:** only `locales/es.json`, `locales/en.default.json`, and matching schema locales if new keys necessary.
**Interface:** `sections.lemoon_style_quiz_v2` labels/copy shared with developer; preserve approved five-axis copy and truthful demo/no-results/editorial messages.

- [x] Supply all interface, stage, option, summary and reason labels; explicitly separate style and physical fit.
- [x] Check JSON/localization coverage and unsupported claims; independent review at final delivery.

### Task 5: Acceptance testing and delivery evidence (theme-test-engineer/coordinator)

**Files:** `tests/unit/style-quiz.test.js`, new quiz fixture/e2e and render tests, `tests/storefront/style-quiz.spec.js`, inventory docs.

- [x] Demonstrate updated ranking tests fail against old budget implementation before production changes; cover all Review Focus cases.
- [x] Exercise intro→result, multiselect, skip clearing, back/edit, show-more, reasons, demo label, no-JS, responsive/keyboard and absent media states.
- [x] Run relevant unit/e2e suites, Theme Check and diff checks; preserve local-vs-Shopify evidence boundaries.
- [x] Independent code/conventions review and fixes complete; inventory and local handoff prepared.
- [ ] Shopify storefront QA and human review remain pending; no merge, ticket completion or publication without their respective review/authorization.

## Execution record

2026-11-05: User explicitly authorized implementation of the presented plan. Continue without another approval round. Existing worktree reused; feature branch `feat/lem-11-style-quiz` fast-forwarded from 43709a87 to local main 5f3aaaef, preserving all research artifacts. Coordinator owns catalog/shared-card/docs; assigned implementer, writer and test engineer own disjoint files. Do not commit other agents' unfinished files or modify main.
