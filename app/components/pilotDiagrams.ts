import type { Diagram } from "./VisualSystem";

// Pages on the new visual system. Remove this gate when the pilot is rolled out.
export const visualPilotServices = new Set(["ai-application-development", "api-integration-development"]);
export const visualPilotGuides = new Set(["reliable-webhook-integration"]);

export const sectionId = (heading: string) => heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const serviceDiagrams: Record<string, Diagram> = {
  "ai-application-development": {
    eyebrow: "System map",
    title: "A controlled AI application workflow",
    caption: "Models handle bounded reasoning while permissions, tools, evaluation, and irreversible actions remain explicit.",
    stages: [
      { label: "Context", detail: "Structured input and retrieval", notes: ["Scoped retrieval", "Structured product state"] },
      { label: "Model", detail: "Bounded reasoning or generation", notes: ["Structured outputs", "Validation"] },
      { label: "Tools", detail: "Scoped actions and permissions", notes: ["Explicit tool contracts", "Approval points"] },
      { label: "Review", detail: "Validation, fallback, observation", notes: ["Human review", "Non-AI fallback"] },
    ],
    loop: { label: "Feedback", detail: "Reviewed outcomes and failure cases feed the test set before the next release." },
    rail: { label: "Guardrails", items: ["Permissions", "Human authorization for irreversible actions", "Evaluation", "Observability", "Cost controls"] },
  },
  "api-integration-development": {
    eyebrow: "System map",
    title: "A recoverable API and webhook flow",
    caption: "The integration stays inspectable when an external system is slow, duplicated, reordered, or unavailable.",
    stages: [
      { label: "Receive", detail: "Authenticate and validate contract", notes: ["Signature or token check", "Schema validation"] },
      { label: "Protect", detail: "Idempotency, limits, ordering", notes: ["Idempotency key", "Rate limits"] },
      { label: "Process", detail: "Transform and update owned state", notes: ["One source of truth", "Explicit state transitions"] },
      { label: "Recover", detail: "Retry, log, reconcile, replay", notes: ["Bounded retries", "Reconciliation"] },
    ],
    loop: { label: "Recovery path", detail: "Failed events return through retry, a visible failure state, and operator replay instead of disappearing." },
    rail: { label: "Visible throughout", items: ["Clear error states", "Audit-friendly records", "Logging", "Documented contracts and limits"] },
  },
};

export const guideDiagrams: Record<string, { diagram: Diagram; sectionTags: Record<string, string> }> = {
  "reliable-webhook-integration": {
    diagram: {
      eyebrow: "Event lifecycle",
      title: "What happens to one webhook event",
      caption: "Each stage links to its section below. Delivery order and one-time execution are never assumed unless the provider guarantees them.",
      stages: [
        { label: "Verify and acknowledge", detail: "Check the signature against the raw body, then return success quickly.", failure: "Invalid or stale request → reject it before any side effect." },
        { label: "Make processing idempotent", detail: "Key effects on the provider event ID or a stable business key.", failure: "Duplicate delivery → recognised, no second charge or notification." },
        { label: "Expect delay and reordering", detail: "Model transitions explicitly; fetch current state when needed.", failure: "Out-of-order event → read current provider state before changing records." },
        { label: "Build an operator recovery path", detail: "Record attempts, errors, and the next action for every event.", failure: "Repeated failure → dead-letter state, alert, and replay." },
      ].map(stage => ({ ...stage, href: `#${sectionId(stage.label)}` })),
    },
    sectionTags: {
      "Verify and acknowledge": "Forged requests · provider timeouts",
      "Make processing idempotent": "Duplicate charges · repeated notifications",
      "Expect delay and reordering": "Stale writes · impossible state transitions",
      "Build an operator recovery path": "Silent data loss · manual reconciliation",
    },
  },
};
