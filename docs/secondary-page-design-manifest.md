# Secondary page design manifest

Branch `claude/peaceful-lamport-2858a7`. Homepage (`/`) is locked and unchanged. All 26 secondary pages are rebuilt on the v3 system in `app/site/`.

## Status — 27 routes

QA columns: **SEO** = title, description, canonical, hreflang, JSON-LD, H1 and internal links identical to `main` (SSR snapshot diff, JS disabled). **Tests** = Playwright desktop + mobile suite. **Audit** = `scripts/interaction-audit.mjs` (1440 / 820 / 390, keyboard). **Visual** = screenshots reviewed at the listed widths. **Owner** = owner / Claude in Chrome review.

| # | Route | Type | Signature visual | SEO | Tests | Audit | Visual | Owner |
|---|---|---|---|---|---|---|---|---|
| 1 | `/` | Homepage (locked) | — unchanged | ✓ | ✓ | n/a | n/a | — |
| 2 | `/services/` | Hub | Problem → service routing map | ✓ | ✓ | ✓ | 1440 · 820 · 390 | pending |
| 3 | `/services/custom-software-development/` | Service | Before/after + fan-in/fan-out workflow map | ✓ | ✓ | ✓ | 1440 | pending |
| 4 | `/services/saas-development/` | Service | Account → tenant → billing → operations map | ✓ | ✓ | ✓ | 1440 | pending |
| 5 | `/services/web-application-development/` | Service | Layer architecture + UI state map | ✓ | ✓ | ✓ | 1440 | pending |
| 6 | `/services/api-integration-development/` | Service | Integration boundary map + 8-row failure matrix | ✓ | ✓ | ✓ | 1440 · 1024 | pending |
| 7 | `/services/business-automation/` | Service | Before/after + human-control flow + suitability matrix | ✓ | ✓ | ✓ | 1440 | pending |
| 8 | `/services/mvp-product-development/` | Service | Learning-loop ring + prototype/MVP/production + Now/Later/Never | ✓ | ✓ | ✓ | 1440 | pending |
| 9 | `/services/ai-application-development/` | Service | Controlled agent path with operations sidecar | ✓ | ✓ | ✓ | 1440 · 390 | pending |
| 10 | `/services/product-rescue/` | Service | Rescue pipeline + triage funnel + risk grid | ✓ | ✓ | ✓ | 1440 | pending |
| 11 | `/work/` | Hub | Capability map across four builds | ✓ | ✓ | ✓ | 1440 | pending |
| 12 | `/work/resolve/` | Case study | Annotated screenshot + evidence-to-settlement map | ✓ | ✓ | ✓ | 1440 · 390 | pending |
| 13 | `/work/meridian/` | Case study | Annotated screenshot + replay loop map | ✓ | ✓ | ✓ | 1440 · 1024 | pending |
| 14 | `/work/repodiet/` | Case study | Annotated screenshot + contract/verify pipeline | ✓ | ✓ | ✓ | 1440 | pending |
| 15 | `/work/agora-forge/` | Case study | Annotated screenshot + route/CCTP/settlement map | ✓ | ✓ | ✓ | 1440 | pending |
| 16 | `/guides/` | Hub | Topic clusters with related services | ✓ | ✓ | ✓ | 1440 | pending |
| 17 | `/guides/hire-saas-developer/` | Guide | Working evaluation scorecard | ✓ | ✓ | ✓ | 1440 · 820 | pending |
| 18 | `/guides/hire-web-app-developer/` | Guide | Competency matrix | ✓ | ✓ | ✓ | 1440 | pending |
| 19 | `/guides/startup-mvp-development/` | Guide | Hypothesis funnel + Now/Next/Later | ✓ | ✓ | ✓ | 1440 | pending |
| 20 | `/guides/custom-software-vs-saas/` | Guide | Build/buy decision tree | ✓ | ✓ | ✓ | 1440 | pending |
| 21 | `/guides/saas-mvp-development-cost/` | Guide | Cost-driver matrix (LOW/MEDIUM/HIGH, no prices) | ✓ | ✓ | ✓ | 1440 | pending |
| 22 | `/guides/api-integration-planning/` | Guide | Contract map + source-of-truth table + readiness checklist | ✓ | ✓ | ✓ | 1440 | pending |
| 23 | `/guides/rescue-ai-built-web-app/` | Guide | Symptom → cause → test → response | ✓ | ✓ | ✓ | 1440 | pending |
| 24 | `/guides/ai-feature-vs-automation/` | Guide | Decision tree + seven-factor matrix | ✓ | ✓ | ✓ | 1440 · 390 | pending |
| 25 | `/guides/reliable-webhook-integration/` | Guide | Sequence diagram, code, lifecycle, backoff | ✓ | ✓ | ✓ | 1440 · 390 | pending |
| 26 | `/about/` | Entity | Principles, capability map, proof, real profiles | ✓ | ✓ | ✓ | 1440 | pending |
| 27 | `/contact/` | Conversion | Quiet form, contextual preselect, next steps | ✓ | ✓ | ✓ | 1440 · 390 | pending |

Latest verification (local production build): lint + typecheck clean · Playwright 382/382 · HTTP/SEO 72/72 · SEO regression 27/27 · interaction audit 821 elements, 0 failures · SSR diff vs `main`: 0 metadata / JSON-LD / H1 / link differences.

## System

- **Architecture.** `app/site/content.ts` (data), `schema.ts` (JSON-LD builders matching `main` byte-for-byte), `chrome.tsx` (header, footer, crumbs, contextual CTA), `pages/*` (one composition per route), `data/*` (page-specific visuals), `ui/*` (primitives). `app/[...slug]/page.tsx` only resolves the route and metadata.
- **Layouts.** Editorial sections with a sticky index rail, full-bleed bands for large visuals, hairline ledgers and open tables instead of bordered cards.
- **Diagram engine** (`ui/Diagram.tsx`). Authored on a 1000-unit canvas; connectors, arrowheads, and label positions are computed on the server. At container widths of 880px and above it renders the canvas; below that the same HTML becomes a numbered vertical spine with zone headings and route notes (e.g. "↺ back to 06 Queue"). Every label is real HTML text.
- **Motion.** Diagrams draw their path, then nodes activate in order; tables, funnels, and strips stagger in. Motion runs only when a block starts below the fold, JS is on, and there is no reduced-motion preference. Without JS or with reduced motion, everything shows in its final state.
- **Interactions.** Decision trees are radio buttons plus `:has()`: every branch shows until you choose; "Show all paths" is a native reset. Scorecard ratings stay in the browser. Code copy uses a clipboard fallback. The TOC tracks the active section and reading progress, and collapses to a sticky bar on mobile. The routing map lights paths on hover/focus and links to real services. No GSAP, Motion, Three, or WebGL; SpotlightCard adapted from React Bits (free, restyled).

## Page briefs

Format: TYPE · INTENT · USER QUESTION · BUYER · CONVERSION | UNIQUE VISUAL · MAIN DIAGRAM · COMPARISON · PROOF | MOTION · CTA · MOBILE | SEO KEPT · INTERACTIONS.

**/services/** — Hub · navigational/commercial · "Which service fits my problem?" · founders and operators · service page → contact | Routing map (7 problems → 8 services) · grouped service index (Build / Connect / AI / Rescue) · — · — | hover path lighting · `?source=services` · map stacks with inline "→ service" links | H1, lede, all 8 cards with "Explore … ↗", ownership + remote paragraphs, ItemList · keyboard-focusable problems, anchor + link.

**Custom software** — Service · commercial · "Should this workflow be software?" · ops leads, founders · `?service=custom-software-development` | Before/after (scattered tools → owned workflow) · fan-in/fan-out map · keep SaaS vs build custom · RESOLVE, RepoDiet | path draw · CTA · spine | all service copy, FAQ, related links · FAQ.

**SaaS** — Service · commercial · "What does a first SaaS release need?" · SaaS founders · `?service=saas-development` | Two-lane customer/operator map · account→tenant→billing→ops · first release vs later · MERIDIAN, RESOLVE | draw · CTA · spine | as above · FAQ.

**Web application** — Service · commercial · "Is this a web app project and what's included?" · product teams · `?service=web-application-development` | Layer architecture with quality sidecar · UI state map (loading, empty, success, validation, error, recovery) · state ledger · MERIDIAN, Agora Forge | draw · CTA · spine | as above · FAQ.

**API integration** — Service · commercial/technical · "Will the integration hold up on its worst day?" · technical founders · `?service=api-integration-development` | Boundary map with retry, dead-letter, replay, reconciliation · 8-row failure-mode matrix · webhook/polling/queue · RESOLVE, Agora Forge | draw · CTA · spine; matrices stack as labelled rows | as above · FAQ.

**Business automation** — Service · commercial · "What should we automate, and where do people stay?" · ops leads · `?service=business-automation` | Before/after · control flow with exception queue and human decision · suitability matrix (frequency, rule clarity, cost of wrong step) · RepoDiet, RESOLVE | draw · CTA · spine | as above · FAQ.

**MVP** — Service · commercial · "How small is small enough?" · startup founders · `?service=mvp-product-development` | Learning-loop ring (6 stages) · prototype/MVP/production · Now/Later/Never · MERIDIAN, Agora Forge | arcs draw in order · CTA · ring becomes numbered list with "↺ back to 01" | as above, including the preserved loop caption · FAQ.

**AI application** — Service · commercial · "How do I add AI without losing control?" · product teams · `?service=ai-application-development` | Controlled agent path: model boundary, validation, fallback, tools, approval, operations sidecar (evals, traces, cost limits) · autonomy spectrum matrix · risk/control matrix · RepoDiet, RESOLVE | draw · CTA · spine | as above · FAQ.

**Product rescue** — Service · commercial · "Can this be saved without a rewrite?" · founders with fragile builds · `?service=product-rescue` | Symptoms→reproduce→diagnose→contain→stabilize→verify→release · triage funnel · qualitative risk grid (labelled as typical starting placement) · RepoDiet, MERIDIAN | draw · CTA · spine; grid + list | as above · FAQ.

**/work/** — Hub · navigational/proof · "What has he actually built?" · all buyers · case study → contact | Capability map (projects × areas; "—" where no claim) · four alternating exhibits · — · all four | stagger · `?source=work` | H1, lede, h2 per project, tags, "View … case study ↗ / Live ↗ / GitHub ↗", ItemList.

**Case studies (×4)** — Case study · proof · "How was it built and can I check it?" · evaluators · service CTA from `projectMedia.services[0]` | Clean viewport screenshot with 4 pins on real UI areas (no on-screen demo values quoted) · project-specific system map · decision → rationale ledger · live build + source | draw · contextual service CTA · spine; roles stack | all section headings and copy, byline, figcaption, capabilities, decisions, validation, relevant services · next-case-study link.

**/guides/** — Hub · informational · "Where do I start?" · all buyers · guide → service | Six topic clusters (Hiring, MVP and scope, Build or buy, Integrate, AI, Rescue), each with its service · — · — · — | none · `?source=guides` | H1, lede, every guide title/description/"Read the guide ↗", ItemList · cluster anchors.

**Guides (×9)** — Guide · informational → commercial · per title · evaluators and builders · related service CTA with guide-specific heading | Scorecard / competency matrix / hypothesis funnel + Now/Next/Later / decision tree / cost-driver levels / contract map + source of truth / symptom table / decision tree + factor matrix / webhook sequence + code + lifecycle · proof strip | draw/stagger · guide-specific CTA · TOC becomes collapsed sticky bar, wide visuals stack | all four section headings and paragraphs, intro, byline and dates, sources · TOC, tree, scorecard, copy.

**/about/** — Entity · navigational/trust · "Who is he and can I trust him?" · all buyers · `?source=about` | Portrait, four principles, capability map linked to services, four-build proof strip, real profiles (LinkedIn, GitHub, résumé, email) | none · CTA · single column | all original copy, AboutPage schema.

**/contact/** — Conversion · transactional · "How do I start?" · all buyers · form / email / booking | Quiet two-column layout with three next steps | none | `?service=` preselect and hero sentence, `source` hidden field, form ids used by `public/main.js` unchanged.

## Intentional content changes (for the SEO workstream)

Metadata, canonicals, JSON-LD, H1s and internal links are unchanged. These visible-text changes are deliberate:

1. **Guides:** the identical boilerplate "Decision checklist", "Common mistakes" and "Use a clear written boundary" blocks and the generic "reading map" figure are replaced with guide-specific checklists and mistakes under the same headings (the webhook guide keeps its Rev2 page-specific sections). The three original matrices are kept under their original titles.
2. **Services:** the four-step "workflow map" micro-labels (e.g. "Interface, logic, data, integrations") are replaced by richer diagram nodes; the map titles and captions are kept verbatim as section headings and captions. Proof panels keep each project's description and add a service-specific "Why it is relevant".
3. **Eyebrows** such as "SERVICE / …" and "CASE STUDY / …" are now uppercased with CSS (text content changes case only).
4. **Additions:** signals ("Signs …"), scope/comparison matrices, case-study rationale and annotations, About principles and capability map. All are drawn from the existing copy or public builds; there are no prices, metrics, testimonials or credentials.

## Owner inputs still needed

- The homepage hover previews still use the uncropped screenshots (browser chrome, username); the homepage is locked.
- JSON-LD `SoftwareApplication.image` is kept on the original screenshots to match `main`. Recommend switching it to the clean `-viewport.webp` crops in the SEO workstream.
- A real integration failure example, and the AI providers used, would strengthen the API and AI pages.
- `dateModified` should be bumped at merge. Resend environment variables are still unverified in production. No production inquiry was sent.
