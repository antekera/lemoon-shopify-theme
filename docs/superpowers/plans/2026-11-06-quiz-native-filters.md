# Descubre tu estilo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deliver the approved quiz improvements and navigate into the complete native collection with real editable filters.

**Architecture:** Keep the existing six-question section and native PLP. Replace embedded ranking/results with a small validated filter configuration and URL builder. Prepare per-axis effective variant metadata in Shopify/back office; native collection filtering owns the resulting product set, count and pagination.

**Tech Stack:** Shopify Liquid, existing CSS tokens, browser History API, JavaScript modules, Vitest/Playwright; existing TypeScript back-office publishing/sync boundaries.

**Spec:** `docs/specs/2026-11-06-lem-11-descubre-tu-estilo.md`, approved by Miguel with “Apruebo. Procede.”

## Global Constraints

- New URL `/pages/descubre-tu-estilo`; old `/pages/buscar-mi-estilo` must return 404, without redirect.
- Approved heading “Descubre tu estilo ideal.” and subtitle remain exact.
- Body/options/fields minimum 16 px, regular 400; actions 16 px semibold; secondary help minimum 14 px.
- Keep six stages, no required budget/gender/face diagnosis and no persistent customer profile.
- Native filters use OR within a criterion and AND between criteria; missing dictionary/filter configuration must not silently drop answers.
- Preserve whole-group product→variant inheritance, physical-size distinction and commercial data.
- No theme publication/deployment without its separate authorization. Preserve other worktrees, services, source metadata and the dirty back-office `next-env.d.ts`.

## Review Focus

- Corrupt/foreign history state, changes after browser Back and return without bfcache: safe restoration without trapping the browser.
- Several colors/finishes, Carey/Transparentes and missing dictionary entries: URL preserves independent axes and never creates false matching values.
- One product with contradictory variants: source inheritance/projections and card link/media/price remain coherent.
- Values changed directly in Shopify after initial ingestion: derived filtering metadata must be refreshed, not remain stale.
- Missing Search & Discovery exposure, zero results and matches beyond the first PLP page: honest failure/empty state and complete native pagination.

## Task 1 — Native-filter feasibility and contract

**Files:** existing spec; Shopify evidence in Git common delivery-evidence, not secrets.

**Interfaces:** source `lemoon_style_trait` dictionary and product/variant `custom.style_traits`; six derived variant fields `custom.style_filter_{color,finish,pattern,transparency,use,presence}` as reference lists. Shape/material remain existing product fields; category maps real product types.

- [ ] Inspect Search & Discovery and existing definitions before writing; verify supported owner/types and actual filter availability.
- [ ] Back up definitions, dictionary, five identified demo products and menus/page before any approved scoped administrative changes.
- [ ] Confirm source-group inheritance and OR-per-axis filter semantics in real Shopify. If exposure cannot support the approved contract, report the concrete blocker; never substitute page-local filtering.

## Task 2 — Quiz behavior, layout and handoff

**Files:** `sections/lemoon-style-quiz.liquid`, `assets/lemoon-style-quiz.js`, `assets/lemoon-style-quiz.css`; add `assets/lemoon-style-quiz-filters.js` only to separate the pure URL contract from browser control. Locale titles/labels and route consumers remain coordinator-owned.

**Interfaces:** `buildQuizCollectionURL(answers, config)` returns a validated same-origin collection URL or a useful configuration error. `config` contains collection URL, actual recognized product-type values and `{ id, group, code }` dictionary rows; field names follow Task 1. Do not enumerate candidate products in the quiz.

- [ ] Test native URL encoding, OR values per group, skipped answers, invalid configuration and actual metaobject IDs.
- [ ] Replace embedded results with category navigation; retain a catalogue alternative without JavaScript or on download/configuration errors.
- [ ] Implement versioned namespaced `history.state`, per-stage fragments, push on stage changes, replace on input changes and validated restoration on popstate/reload/pageshow.
- [ ] Stack Acabados then Materiales with localized headings; remove tabs, preserving selection and lazy images.
- [ ] Apply approved text sizes/weights and retain stable first paint without rigid heights.
- [ ] Run focused tests, full affected quiz suite and Theme Check; independently review the resulting diff.

## Task 3 — Back-office projection and ingestion

**Files:** use isolated branch based on PR9 `48ca70e` after confirming its current head; existing `packages/domain/src/style-metadata.ts`, Shopify style publishing/ingestion and tests located in the real workspace. Do not modify the owner's dirty checkout.

**Interfaces:** reuse `effectiveStyleTraits(common, override)` and store dictionary resolution. Add complete current vocabulary `neutral/two_tone/silver` without discarding legacy brown/light. Produce six per-axis reference lists, with explicit deletion/empty handling and concurrency protection for derived values.

- [ ] Add synthetic tests for inheritance, missing dictionary entries, per-axis references, vocabulary, stale/concurrent source edits and idempotence.
- [ ] Integrate projections into approved product/variant preload and publication; preserve source fields and Shopify edits.
- [ ] Reuse existing sync/webhook boundaries to refresh projections when source product/variant traits change in Shopify. Do not register webhooks, expand scopes or deploy as a substitute for code.
- [ ] Run relevant domain/provider/API checks; return exact remaining app/scopes/deployment gaps and an independently reviewed change for PR9 integration.

## Task 4 — Names, routes and native category presentation

**Files:** `sections/header-group.json`, `snippets/lemoon-mobile-search.liquid`, current FAQ route consumers, `locales/es.json`, `locales/en.default.json`, `snippets/facets.liquid` and connected facet snippets only as needed; `DESIGN.md`, component inventories, recipe, catalog guide and current page assignment docs.

- [ ] Update active entry links/labels to Descubre tu estilo and the new URL; preserve historical evidence.
- [ ] Present actual metaobject filter labels through existing native facets; keep native sorting, pagination, counts and filter removal.
- [ ] Prepare Shopify Page/menu updates, disable automatic old-handle redirect and remove only an existing exact old-route redirect if found.
- [ ] Verify new natural route and old HTTP404 after coordinated activation; do not call a local fixture proof of these remote changes.

## Task 5 — Acceptance, evidence and handoff

- [ ] E2E: 390/749/750/989/990/1440, zoom/keyboard, input sizes, both details groups, browser Back/Forward/new branch/reload, measures manual override and return from category.
- [ ] Native Shopify: per-axis filters exposed, combinations and actual matching variant, editable chips, zero results, matches beyond page one, new route/footer and old404. Record native limitations separately from fixtures.
- [ ] Back-office synthetic checks and current app access/deployed-sync verification remain separate evidence gates.
- [ ] Run independent code/convention reviews and required checks, then record tested revisions and remaining limitations. No automatic merge or production theme push.

## Execution and ownership

Coordinator executes administrative feasibility, routes, documentation and integration. A theme developer owns the quiz source; a test engineer owns theme tests/fixtures; a back-office developer works in an isolated checkout. Reviewers are read-only by responsibility, without claiming technical permission isolation. Each worker preserves other edits and performs no external mutations, commits or pushes unless explicitly assigned.
