// API integration content shared by the service page and the API guides.

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
