// Reliable webhook integration guide: code, sequences, and checklists.
import type { SeqMessage } from "../ui/Blocks";

export const webhookSequence: { actors: string[]; messages: SeqMessage[] } = {
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
