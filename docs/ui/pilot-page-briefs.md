# Pilot page briefs — Revision 2

Shared design system ≠ identical page composition. Each pilot has its own dominant visual, section order, proof treatment and conversion logic. Metadata, canonicals, JSON-LD and URLs are unchanged from `main`.

## /services/ai-application-development/

1. **Primary search intent:** AI application development services (commercial, hire/evaluate).
2. **User question:** "How do I add AI to my product without building an unreliable demo?"
3. **Conversion goal:** `/contact/?service=ai-application-development`, secondary: Cal.com fit call.
4. **Unique dominant visual:** Controlled-agent schematic — user/product → context → model boundary → tool boundary → human-review boundary → recorded outcome, with a dashed evaluation loop and a fallback annotation.
5. **Comparison/data structure:** Deterministic automation vs AI-assisted workflow vs tool-using agent (spectrum matrix); AI risk → control matrix.
6. **Proof asset:** RepoDiet (agent output verified before PR) and RESOLVE (model-assisted features around deterministic settlement) with clean viewport screenshots.
7. **Motion purpose:** Schematic nodes activate in request order, then the evaluation loop draws — shows that feedback returns after the outcome, not before.
8. **CTA:** "Discuss an AI application" (hero) → "Start an AI application development inquiry" (closing).
9. **Related internal links:** AI feature vs automation guide, Business automation, API integration, SaaS development, RepoDiet, RESOLVE.
10. **Mobile transformation:** Schematic becomes a vertical spine grouped by boundary; matrices become labelled row cards.

## /services/api-integration-development/

1. **Primary search intent:** API integration services / webhook integration developer (commercial).
2. **User question:** "Will this integration fail silently, and who fixes it when a provider misbehaves?"
3. **Conversion goal:** `/contact/?service=api-integration-development`, secondary: Cal.com fit call.
4. **Unique dominant visual:** FAILURE-MODE MATRIX — eight concrete failure modes with symptom, detection, response and recovery. Preceded by an integration-boundary schematic (provider → edge → your system → operator) with a bounded-retry loop.
5. **Comparison/data structure:** Webhook vs polling vs event queue; integration contract checklist.
6. **Proof asset:** Integration ledger — RESOLVE and Agora Forge rows listing the real systems each connects (from their public builds).
7. **Motion purpose:** Matrix rows reveal in sequence; boundary schematic shows the retry path returning before the dead-letter operator step.
8. **CTA:** "Discuss an API integration" → "Start an API integration development inquiry".
9. **Related internal links:** API integration planning guide, Reliable webhook integration guide, Custom software, Business automation, Web application, RESOLVE, Agora Forge.
10. **Mobile transformation:** Failure matrix rows become stacked cards with labelled fields; schematic becomes a spine.

## /guides/reliable-webhook-integration/

1. **Primary search intent:** How to build reliable webhooks (retries, idempotency, signature verification) — informational/technical.
2. **User question:** "What exactly do I implement so webhooks survive duplicates, delays, reordering and outages?"
3. **Conversion goal:** Soft — related API integration service and a guide-specific inquiry (`?service=api-integration-development`).
4. **Unique dominant visual:** Sequence diagram with lifelines (Provider, Endpoint, Database, Worker, Operator) — an engineering artifact, not a service schematic.
5. **Comparison/data structure:** Failure-scenario table; retry → dead-letter → replay state flow; out-of-order event timeline.
6. **Proof asset:** Code: raw-body signature verification (TypeScript) and Postgres idempotency (SQL) with working copy buttons; primary references (Stripe, GitHub, PostgreSQL docs).
7. **Motion purpose:** Sequence messages appear in delivery order; none elsewhere (article reading comfort).
8. **CTA:** "Need a webhook integration reviewed?" → `/contact/?service=api-integration-development`.
9. **Related internal links:** API integration development, API integration planning guide, RESOLVE, Agora Forge, author page.
10. **Mobile transformation:** Table of contents first; sequence diagram becomes a numbered message list; code blocks scroll horizontally inside their frame only.

## Open owner inputs

- `[OWNER INPUT NEEDED]` A real example of a webhook or integration failure you diagnosed (provider, symptom, fix) would strengthen both the API page and the guide.
- `[OWNER INPUT NEEDED]` Confirm which model providers / AI tooling you have shipped with, so the AI stack list can name them instead of staying generic.
- `[OWNER INPUT NEEDED]` Homepage hover previews still use the original screenshots that include browser chrome and a signed-in username; replacing them touches the locked homepage.
