# LEM-142 Reusable Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking. Preserve the selected Orca supervision method.

**Goal:** Deliver six reusable Liquid snippets consumed by real sections, plus recipes and agent discovery, keeping the inventory current.

**Architecture:** Extract presentation from existing sections into flat `snippets/lemoon-ui-*.liquid`; native forms, data routing and commerce remain in their current owners. Reuse existing domain snippets. The catalogue and recipes call actual implementations rather than copy markup or CSS.

**Tech Stack:** Shopify Liquid/Dawn, existing CSS and locale files, LiquidJS 10.30.0, Vitest 5.0.3 and Playwright 1.63.0; no new dependencies.

**Spec:** [Approved technical proposal](../specs/2026-10-31-lem-142-reusable-components-design.md). Miguel explicitly approved implementation after reviewing this proposal. This plan operationalizes that scope using the already selected Orca method.

## Global Constraints

- DESIGN.md remains visual authority; preserve existing fonts, colors, local classes/geometry, native forms, schema/settings/presets, locales and hooks.
- New snippets are `lemoon-ui-action`, `lemoon-ui-field`, `lemoon-ui-select`, `lemoon-ui-heading`, `lemoon-ui-message`, `lemoon-ui-faq-item`; inputs are explicit and documented with LiquidDoc.
- No arbitrary HTML attribute bags or tag names. Plain strings/attributes escape once; `_html` inputs and `editor_attributes` are trusted template captures only. Preserve false booleans and omitted ARIA attributes.
- Six extractions plus existing canonical pieces; no requirement to rewrite all 44 families. Every family stays discoverable and honestly classified.
- Continuous 1px `--lemoon-border-strong` control boundary and 2px navy focus offset at least 2px are the already-approved accessibility correction, narrowly scoped to migrated controls; preserve local radii and sizes.
- Keep price/stock/variant/payment/recipe/consent logic outside presentation atoms. No Shopify publication, network POST, purchases, customer data or unrelated admin work.
- Coordinator owns commits/PR/Linear. Workers own only assigned files, preserve concurrent edits and report exact validation. Human review of delivered code is still required before merge.

## Review Focus

- False/absent booleans: spellcheck=false, aria-expanded=false and disabled=false remain distinguishable from omitted attributes (Task 1 tests).
- Hostile/plain text versus trusted markup: quotes, angle brackets, newlines and captured FAQ/default_errors preserve escaping without double escaping (Tasks 1–2 tests).
- Multiple instances and focus: IDs/label/help/error references stay unique, native details avoids accidental global.js Details-* behavior, and focus remains visible (Tasks 1–2/browser tests).
- Local CSS and Shopify ownership: adding .button must not restyle local CTAs; field floating-label order and contact native POST/error branches remain intact (Tasks 1–2/browser tests).
- Select integration: selected options, SortBy/sort_by, form event bubbling and search terms survive migration; collection sort policy stays untouched (Task 2 tests).

---

### Task 1: Extract six presentation contracts with behavioral coverage

**Ownership/files:** Runtime implementer owns six `snippets/lemoon-ui-*.liquid` and narrowly scoped shared styles in `assets/lemoon-components.css`. Test engineer owns `tests/helpers/component-library-renderer.mjs`, `tests/unit/component-library.test.js` and fixtures needed to render real files. Existing spinner/icon snippets are read-only canonical sources.

**Interfaces:** Runtime produces the six render APIs in the spec table, using research `/tmp/LEM-142-code-extraction-research.md` for optional native inputs. Test helper exports `renderComponent(name, params)` and `renderComponentSection(name, options)` returning HTML from real Liquid with strict translation lookup; native form/Shopify-only filters are explicitly modeled fixtures. No production HTML rebuilt in tests.

- [x] Capture baseline source and run existing guide/contact/FAQ unit tests before structural changes; retain output/evidence outside committed code.
- [x] Write and run initially failing render tests for action semantics (a/button/default type/submit/form/variant/local classes), disabled links without href, loading spinner and omitted/false ARIA.
- [x] Write and run initially failing tests for field/textarea escaping, required/optional phone/false spellcheck, composed help+error IDs; select native option markup/selection; heading allowlist; message trusted markup/plain text; FAQ open/editor attrs/richtext.
- [x] Implement minimal six snippets with LiquidDoc. Native class/attribute contracts and allowlists are visible; only documented trusted slots render raw markup. Reuse loading-spinner and lemoon-icon where appropriate.
- [x] Run `npx vitest run tests/unit/component-library.test.js`; expected all contract cases pass. Record initial red and final green evidence.
- [x] Coordinator commits only this boundary after its scoped review and Theme Check; runtime/tests workers never commit overlapping work.

### Task 2: Migrate real consumers and catalogue, preserve behavior

**Ownership/files:** Runtime implementer owns `sections/lemoon-guide-page.liquid`, `sections/lemoon-contact-page.liquid`, `sections/lemoon-faq-page.liquid`, `sections/lemoon-design-system.liquid`, `snippets/main-search-results.liquid`, and `assets/lemoon-design-system.css` only where its migrated examples need correction. Locale additions are limited to genuinely new catalogue labels in existing storefront locale files. Test engineer owns `tests/unit/contact-page.test.js`, `guide-page.test.js`, `faq-page.test.js`, the new component suite, `tests/e2e/component-library.spec.js` and component-library routes in `tests/e2e/fixture-server.mjs`.

**Interfaces:** Consumers call Task 1 APIs with unescaped text and explicit data/classes/IDs. Contact keeps native `{% form 'contact' %}`, response conditions and value precedence; error/default_errors output is a trusted capture. FAQ caller keeps grouping/custom/fallback routing and captures whole answers; details root gets block attributes. Search retains SortBy/sort_by, surrounding facet form, current options and aria-describedby. Catalogue uses actual snippets and synthetic inert state data.

- [x] Add baseline/integration assertions for guide destinations/headings, four contact names/values/required semantics and native response states, FAQ 11-default/custom/incomplete-block fallback with unique IDs, search sort native values and event propagation.
- [x] Replace duplicated markup with renders while retaining schemas/settings/locales, local CSS owners, native context and dynamic hooks. No commercial adapters, legacy FAQ or collection-sort migration.
- [x] Apply the scoped DESIGN field/select border and focus correction, including Dawn pseudo-element behavior and persistent gallery select label. Do not add colors or a new visual variant.
- [x] Replace brittle source-only behavioral assertions with real rendered-output checks; retain separate schema/template/locale checks. Do not weaken an existing test merely to make extraction pass.
- [x] Serve real rendered snippets and migrated sections through fixture routes with production CSS order. Browser cases cover keyboard link/button activation, native required/email validation without POST, details open/closed, select FormData/event behavior, visible focus, forced colors, long strings and no overflow at 390/749/750/989/990/desktop widths.
- [x] Run `npx vitest run tests/unit/component-library.test.js tests/unit/contact-page.test.js tests/unit/guide-page.test.js tests/unit/faq-page.test.js` and `npx playwright test tests/e2e/component-library.spec.js`; expected all pass. Compare representative baseline DOM/contracts and disclose the accessibility delta.
- [x] Coordinator reviews/commits the integrated boundary. Browser fixtures prove local behavior, not Shopify contact delivery or editor configuration.

### Task 3: Recipes, discovery and live inventory

**Ownership/files:** Documentation implementer owns `docs/components/README.md`, six files in `docs/components/recipes/` (`guide-help.md`, `contact-form.md`, `faq-group.md`, `search-sort.md`, `product-card-grid.md`, `catalogue-states.md`), `docs/design/component-inventory.md`, `docs/design/component-inventory.json`, a small discovery link in `docs/design/component-library.md`, and authoring pointers in `AGENTS.md`, `.agents/skills/build-theme-section/SKILL.md`, `new-theme-section/SKILL.md`, `scaffold-theme-snippet/SKILL.md`, `.codex/agents/theme-developer.toml`, `.codex/agents/section-builder.toml`. Do not modify workflow permissions or lifecycle. Coordinator owns spec/plan status and final integration.

**Interfaces:** Recipe APIs match the actual six snippets after implementation; index maps all 44 stable family IDs to canonical code/source, implementation status, consumers and recipe. Keep commercial components at existing source paths. Inventory coverage describes current source revision with reconciled mapped/excluded paths; private settings content remains unread.

- [x] Draft discovery and recipes from spec and existing canonicals while runtime implementation proceeds; mark pending implementation until APIs can be checked.
- [x] Reconcile recipes against final LiquidDoc and real consumers; examples render actual names with valid native prerequisites, escaping and localized labels. No duplicated CSS or invented commercial facts.
- [x] Update inventory MD/JSON for six new snippets, their references/consumers and changed implementation status; retain stable IDs and known exclusions. Clearly separate historical baseline from implemented state and remaining extraction opportunities.
- [x] Add concise authoring pointers: consult catalogue before creating markup; reuse current canonical implementation and document new/modified/removed components in the same PR. Preserve original DESIGN and native-schema guidance.
- [x] Verify JSON syntax, unique/matched family IDs, exact coverage/current source paths, local links/anchors and example parameter names; compare source coverage with actual git tracked plus explicitly staged new UI files, not a stale HEAD.
- [x] Coordinator commits the documentation with the implementation once real examples and coverage agree; no prose-only completion claim.

### Task 4: Independent delivery review and handoff

**Ownership/files:** Fresh reviewers are read-only by responsibility, not permission-isolated. Coordinator owns fixes allocation, validation evidence, commits/push and PR40/LEM142 status.

**Interfaces:** Review package includes approved spec, this plan, exact diff/head, test outputs, coverage proof, fixture screenshots and explicit Shopify/runtime gaps.

- [x] Run `shopify theme check --fail-level error`, all Vitest tests, affected Playwright suites and workflow validator after authoring pointers. Use existing dependencies; record commands/results and tested SHA.
- [x] Independent code/conventions and visual/accessibility review verifies six APIs, real consumers, native behavior, CSS boundaries, catalogue honesty and recipes/inventory consistency. Resolve load-bearing findings and rerun affected checks.
- [ ] Update spec/plan completion evidence and PR40 description around actual final implementation; push only feature branch and inspect current hosted CI. Restore ready-for-review only after applicable checks and independent reviews are ready.
- [ ] Move LEM142 to In Review with PR, SHA, fixtures/preview evidence and remaining environment limitations. Implementation approval is not approval of the final code revision or authorization for merge/publication.
