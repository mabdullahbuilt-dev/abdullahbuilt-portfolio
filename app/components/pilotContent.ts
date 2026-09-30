import type { Schematic, SequenceMessage } from "./VisualSystem";

// Pages on the pilot visual system. Remove a slug to return it to the standard template.
export const visualPilotServices = new Set(["ai-application-development", "api-integration-development"]);
export const visualPilotGuides = new Set(["reliable-webhook-integration"]);

export const sectionId = (heading: string) => heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/* ================= AI application development ================= */

export const aiSchematic: Schematic = {
  eyebrow: "System map",
  title: "A controlled AI application workflow",
  caption: "Models handle bounded reasoning while permissions, tools, evaluation, and irreversible actions remain explicit.",
  zones: [
    { label: "Product", tone: "product", nodes: [
      { label: "User request", detail: "Arrives with the user's account, role, and permissions" },
      { label: "Context", detail: "Retrieval and structured product state, scoped to that user" },
    ] },
    { label: "Model boundary", tone: "model", nodes: [
      { label: "Model", detail: "Bounded reasoning with structured, validated output", note: { tone: "fail", text: "Invalid or low-confidence output → non-AI fallback or review" } },
    ] },
    { label: "Tool boundary", tone: "guard", nodes: [
      { label: "Scoped tools", detail: "Explicit contracts; only the actions this task needs" },
    ] },
    { label: "Human review", tone: "human", nodes: [
      { label: "Approval", detail: "Required before irreversible or sensitive actions" },
    ] },
    { label: "Product state", tone: "system", nodes: [
      { label: "Recorded outcome", detail: "Result, evidence, and an audit trail" },
    ] },
  ],
  loop: { from: 5, to: 2, label: "Evaluation loop", detail: "Reviewed outcomes and failure cases become test cases before the next model or prompt change." },
  legend: [
    { kind: "request", label: "Request path" },
    { kind: "loop", label: "Feedback / async" },
    { kind: "human", label: "Human decision" },
    { kind: "fail", label: "Fallback" },
    { kind: "boundary", label: "Trust boundary" },
  ],
};

export const aiComparison = {
  columns: ["", "Deterministic automation", "AI-assisted workflow", "Tool-using agent"],
  rows: [
    { head: "Best for", cells: ["The same input should always produce the same action", "Interpreting or generating content inside a fixed flow", "Multi-step tasks where the next tool depends on what was found"] },
    { head: "Who decides", cells: ["Rules you wrote and tested", "The model suggests; the product or a person confirms", "The model plans within the tools it is permitted to use"] },
    { head: "Primary control", cells: ["Tests and input validation", "Structured output, evaluation, and a fallback path", "Least-privilege tools, step limits, approval points, audit log"] },
    { head: "Main risk", cells: ["Rigid when inputs vary", "Plausible but wrong output", "Wrong or excessive actions"] },
    { head: "Cost profile", cells: ["Lowest and predictable", "A model call per task", "Several model calls per task; the most variable"] },
  ],
};

export const aiRisks = {
  columns: ["Risk", "What it looks like", "Control in the product", "Where a person stays involved"],
  rows: [
    { head: "Incorrect or invented output", tone: "fail" as const, cells: ["A confident answer the data does not support", "Structured output, validation, retrieval with sources, evaluation set", "Reviews low-confidence or high-impact results"] },
    { head: "Prompt injection", tone: "fail" as const, cells: ["Retrieved or user content tries to change instructions", "Treat inputs as data, restrict tool scope, keep secrets out of context", "Approves actions triggered from untrusted content"] },
    { head: "Over-permissioned tools", tone: "warn" as const, cells: ["The agent can do more than the task needs", "Least-privilege tool contracts, allow-lists, step limits", "Authorizes irreversible actions"] },
    { head: "Sensitive data exposure", tone: "warn" as const, cells: ["Private records reach the model or the wrong user", "Per-user retrieval scope, redaction, explicit data boundaries", "Owns the data-access policy"] },
    { head: "Cost or latency spikes", tone: "warn" as const, cells: ["Loops, long contexts, or retries multiply calls", "Budgets, timeouts, caching, maximum steps", "Sets and reviews the limits"] },
    { head: "Provider outage or model change", tone: "warn" as const, cells: ["The API is down, or behavior shifts after an update", "Fallback path, pinned model versions, regression evaluation", "Decides when a new model is promoted"] },
  ],
};

export const aiTimeline = [
  { label: "Define", text: "Define the task, evidence, permissions, and human decision points" },
  { label: "Connect", text: "Connect models to controlled tools and structured product state" },
  { label: "Evaluate", text: "Evaluate useful and failure cases before monitored release" },
];

export const aiStack = [
  { label: "Model layer", items: ["Model provider APIs with structured output", "Prompt and tool definitions kept in version control"] },
  { label: "Data & context", items: ["Retrieval over Postgres / Supabase records", "Per-user scoping before anything reaches the model"] },
  { label: "Tools & control", items: ["Explicit tool contracts with least privilege", "Approval steps for irreversible actions"] },
  { label: "Quality & operations", items: ["Evaluation sets built from real cases", "Logging, tracing, cost limits, and a non-AI fallback"] },
];

export const aiProofRelevance: Record<string, string> = {
  repodiet: "Agent-generated changes pass through a scoped contract and independent verification before a review-ready pull request exists.",
  resolve: "Model-assisted features sit around deterministic funding and settlement logic; the irreversible steps stay explicit.",
};

/* ================= API integration development ================= */

export const apiSchematic: Schematic = {
  eyebrow: "Integration boundary",
  title: "A recoverable API and webhook flow",
  caption: "The integration stays inspectable when an external system is slow, duplicated, reordered, or unavailable.",
  zones: [
    { label: "Provider", tone: "provider", nodes: [
      { label: "External event", detail: "Webhook or API response from a system you do not control" },
    ] },
    { label: "Edge", tone: "guard", nodes: [
      { label: "Verify", detail: "Signature, auth, and schema checked on the raw request", note: { tone: "fail", text: "Invalid → 4xx, no side effects" } },
      { label: "Acknowledge", detail: "Fast 2xx; slow work leaves the request path" },
    ] },
    { label: "Your system", tone: "system", nodes: [
      { label: "Idempotency gate", detail: "Event ID or business key recorded before any side effect", note: { tone: "info", text: "Duplicate → acknowledged, skipped" } },
      { label: "Process", detail: "Transform and update the one source of truth" },
    ] },
    { label: "Operator", tone: "operator", nodes: [
      { label: "Dead-letter & replay", detail: "Failures stay visible with context, then replay" },
    ] },
  ],
  loop: { from: 4, to: 3, label: "Bounded retry", detail: "Failed processing retries with backoff before it reaches the dead-letter state." },
  legend: [
    { kind: "request", label: "Delivery path" },
    { kind: "loop", label: "Retry / async" },
    { kind: "fail", label: "Rejected or skipped" },
    { kind: "boundary", label: "Ownership boundary" },
  ],
};

export const apiFailureModes = {
  columns: ["Failure mode", "Symptom", "Detection", "Response", "Recovery"],
  rows: [
    { head: "Provider timeout or 5xx", tone: "fail" as const, cells: ["Calls hang or fail intermittently", "Request timeouts, error-rate alert", "Retry with exponential backoff and jitter, bounded attempts", "Dead-letter, then replay once the provider recovers"] },
    { head: "Rate limited (429)", tone: "warn" as const, cells: ["Bursts of requests rejected", "429 status and Retry-After header", "Honor Retry-After; queue and smooth the request rate", "Resume from the last checkpoint"] },
    { head: "Duplicate delivery", tone: "ok" as const, cells: ["The same event arrives twice", "Event ID already recorded", "Acknowledge and skip side effects", "None needed — processing is idempotent"] },
    { head: "Out-of-order events", tone: "warn" as const, cells: ["An update arrives before the create", "Version or timestamp older than stored state", "Fetch current state from the provider before writing", "Scheduled reconciliation"] },
    { head: "Invalid signature or auth", tone: "fail" as const, cells: ["Forged, stale, or rotated-secret requests", "Signature or token check fails", "Reject with 4xx before any side effect", "Rotate secrets; alert on spikes"] },
    { head: "Contract or schema change", tone: "fail" as const, cells: ["Fields missing, renamed, or retyped", "Schema validation failure", "Send to dead-letter instead of guessing", "Update the mapping, replay stored events"] },
    { head: "Partial failure mid-sync", tone: "warn" as const, cells: ["Some records written, others not", "Job status and per-record results", "Transactional writes or resumable checkpoints", "Resume from checkpoint, then reconcile"] },
    { head: "Provider outage", tone: "fail" as const, cells: ["Nothing arrives at all", "Last-event-age alert", "Keep the product usable; mark dependent data as stale", "Backfill by listing provider state after recovery"] },
  ],
};

export const apiPatterns = {
  columns: ["", "Webhook", "Polling", "Event queue"],
  rows: [
    { head: "How updates arrive", cells: ["The provider pushes an HTTP request to you", "You request changes on a schedule", "A producer publishes to a queue or stream you consume"] },
    { head: "Freshness", cells: ["Near real time", "Bounded by the poll interval", "Near real time, buffered"] },
    { head: "You must handle", cells: ["Signatures, duplicates, ordering, fast acknowledgement", "Rate limits, pagination, change detection", "Consumer retries, dead-letter queue, per-key ordering"] },
    { head: "Typical failure", cells: ["Missed events during an outage beyond the provider's retry window", "Wasted calls and stale data between polls", "Backlog growth when consumers fall behind"] },
    { head: "Good fit", cells: ["Providers that sign and retry events", "Providers without webhooks, and reconciliation jobs", "High-volume internal events with several consumers"] },
  ],
};

export const apiContract = [
  "Authentication method, scopes, and secret rotation",
  "Rate limits, quotas, and Retry-After behavior",
  "Pagination and change-detection strategy",
  "Webhook signing scheme and replay window",
  "Idempotency keys for every write",
  "Error codes, and which ones are safe to retry",
  "API versioning and deprecation policy",
  "Sandbox environment and realistic test data",
  "The source of truth for each shared record",
  "Who is alerted, and who replays failed events",
];

export const apiTimeline = [
  { label: "Map", text: "Document contracts, authentication, limits, and failure modes" },
  { label: "Build", text: "Implement validation, retries, idempotency, and useful records" },
  { label: "Prove", text: "Test happy paths and recoverable failures with real systems" },
];

export const apiStack = [
  { label: "Endpoints", items: ["TypeScript route handlers and serverless functions", "Raw-body signature verification"] },
  { label: "State", items: ["Postgres with unique constraints for idempotency", "Explicit status columns for each event"] },
  { label: "Recovery", items: ["Background jobs or queues where the platform supports them", "Dead-letter state and replay tooling"] },
  { label: "Visibility", items: ["Structured logs with sanitized payload metadata", "Alerts on failure spikes and on silence"] },
];

export const apiProof: Record<string, { relevance: string; systems: string[] }> = {
  resolve: { relevance: "Contribution evidence, funding states, and USDC settlement are kept as explicit records rather than hidden side effects.", systems: ["Supabase / Postgres", "Prisma", "Arc", "USDC settlement"] },
  "agora-forge": { relevance: "Cross-chain routes are compared and executed with visible states between portfolio context and settlement.", systems: ["Circle CCTP", "LI.FI", "Zerion", "Covalent"] },
};

/* ================= Reliable webhook integration guide ================= */

export const webhookSequence: { actors: string[]; messages: SequenceMessage[] } = {
  actors: ["Provider", "Endpoint", "Database", "Worker", "Operator"],
  messages: [
    { from: 0, to: 1, label: "POST signed event", detail: "Raw body + signature + timestamp" },
    { from: 1, to: 1, label: "Verify signature and timestamp", detail: "Reject before any side effect", tone: "fail" },
    { from: 1, to: 2, label: "Insert event ID (unique)", detail: "Duplicate → nothing inserted" },
    { from: 1, to: 0, label: "2xx acknowledgement", detail: "Before slow work begins", tone: "response" },
    { from: 2, to: 3, label: "Claim received event", tone: "response" },
    { from: 3, to: 0, label: "Fetch current object state", detail: "When the event alone is not enough" },
    { from: 3, to: 2, label: "Apply change, mark processed", detail: "Same transaction" },
    { from: 3, to: 2, label: "On error: attempts + 1, schedule retry", detail: "Backoff with jitter, bounded", tone: "fail" },
    { from: 4, to: 3, label: "Replay from dead-letter", detail: "After the cause is fixed", tone: "operator" },
  ],
};

export const signatureCode = `import { createHmac, timingSafeEqual } from "node:crypto";

const TOLERANCE_SECONDS = 300;

export async function POST(request: Request) {
  // Verify the exact bytes that were signed — before JSON parsing.
  const rawBody = await request.text();
  const timestamp = request.headers.get("x-webhook-timestamp") ?? "";
  const signature = request.headers.get("x-webhook-signature") ?? "";

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > TOLERANCE_SECONDS) {
    return new Response("stale or missing timestamp", { status: 400 });
  }

  const expected = createHmac("sha256", process.env.WEBHOOK_SECRET!)
    .update(\`\${timestamp}.\${rawBody}\`)
    .digest("hex");
  const valid =
    expected.length === signature.length &&
    timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  if (!valid) return new Response("invalid signature", { status: 401 });

  const event = JSON.parse(rawBody);
  await recordAndEnqueue(event); // idempotent insert, then background work
  return new Response(null, { status: 204 });
}`;

export const idempotencySql = `create table webhook_events (
  provider     text        not null,
  event_id     text        not null,
  event_type   text        not null,
  received_at  timestamptz not null default now(),
  status       text        not null default 'received', -- received | processed | failed | dead_letter
  attempts     int         not null default 0,
  last_error   text,
  primary key (provider, event_id)
);

-- Record the event once. A duplicate delivery inserts nothing.
insert into webhook_events (provider, event_id, event_type)
values ($1, $2, $3)
on conflict (provider, event_id) do nothing
returning event_id;
-- No row returned → already seen: acknowledge and skip side effects.`;

export const webhookFailureScenarios = {
  columns: ["Scenario", "What you see", "Handle it by"],
  rows: [
    { head: "Secret rotated", tone: "fail" as const, cells: ["A sudden spike of signature failures", "Accepting both the old and new secret during the rotation window"] },
    { head: "Handler too slow", tone: "warn" as const, cells: ["The provider marks deliveries failed and retries them", "Acknowledging first and processing asynchronously"] },
    { head: "Duplicate delivery", tone: "ok" as const, cells: ["The same event ID twice", "A unique constraint; skip side effects on conflict"] },
    { head: "Event before the object exists", tone: "warn" as const, cells: ["Lookup or foreign-key failure", "Fetching the object from the provider API, or retrying later"] },
    { head: "Poison event", tone: "fail" as const, cells: ["The same event fails on every attempt", "Bounded retries, then dead-letter with the error attached"] },
    { head: "Provider outage", tone: "fail" as const, cells: ["No events for an unusual period", "A last-event-age alert and a backfill after recovery"] },
    { head: "Bug shipped in the handler", tone: "fail" as const, cells: ["Many events failing at once", "Fixing the cause, then replaying from dead-letter"] },
  ],
};

export const webhookChecklist = [
  "Verify the signature against the raw body with a constant-time comparison",
  "Reject stale timestamps to limit replay attacks",
  "Return a 2xx quickly and move slow work to a job or queue",
  "Record the event ID under a unique constraint before side effects",
  "Make downstream writes idempotent as well",
  "Treat delivery order as unknown; compare versions or fetch current state",
  "Bound retries with exponential backoff and jitter",
  "Keep a dead-letter state with payload metadata and the last error",
  "Give an operator a way to replay one event or a batch",
  "Alert on failure spikes and on silence (last-event age)",
  "Log sanitized metadata — never secrets or full payment data",
  "Test with provider test events, duplicated deliveries, and reordered events",
];

export const webhookMistakes = [
  "Parsing and re-serializing JSON before verifying, which breaks the signature",
  "Doing slow work before responding, which causes timeouts and duplicate retries",
  "Using delivery order as business order",
  "Treating a 2xx response as proof that the work succeeded",
  "Retrying forever with no dead-letter state",
  "Having no way to replay events after fixing a bug",
  "Logging full payloads that contain personal data or secrets",
];

export const webhookOutage = [
  "When a provider is down or stops sending events, nothing arrives to fail — the risk is silence. Track the age of the last event per provider and alert when it exceeds what normal traffic allows.",
  "Retry behavior differs by provider: Stripe documents automatic retries for up to three days, while GitHub does not automatically redeliver failed deliveries. Check the current documentation for each provider you depend on.",
  "After recovery, backfill by listing recent objects or events through the provider API and passing them through the same idempotent path, so replayed and live events cannot double-apply. Keep the product usable in the meantime and mark provider-dependent data as possibly stale.",
];

export const webhookSources = [
  { label: "Stripe: Receive Stripe events in your webhook endpoint", href: "https://docs.stripe.com/webhooks" },
  { label: "GitHub: Best practices for using webhooks", href: "https://docs.github.com/en/webhooks/using-webhooks/best-practices-for-using-webhooks" },
  { label: "GitHub: Handling failed webhook deliveries", href: "https://docs.github.com/en/webhooks/using-webhooks/handling-failed-webhook-deliveries" },
  { label: "PostgreSQL: INSERT … ON CONFLICT", href: "https://www.postgresql.org/docs/current/sql-insert.html" },
];
