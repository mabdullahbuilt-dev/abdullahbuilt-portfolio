// Page-specific visuals and supporting copy for the service pages.
// Flow titles and captions are the pre-redesign workflow-map headings; they stay as the diagram headings.
import type { DiagramSpec, DNode } from "../ui/Diagram";

const node = (id: string, label: string, detail: string, kind: DNode["kind"], x: number, y: number, w = 190, h = 100, note?: string): DNode => ({ id, label, detail, kind, x, y, w, h, note });

/* ---------------- Custom software ---------------- */
export const customMap: DiagramSpec = {
  eyebrow: "Workflow map", title: "From operating problem to owned software", height: 420,
  caption: "A useful custom system starts with the decision and data boundary, not a feature list.",
  zones: [{ label: "Working system", x: 628, y: 12, w: 194, h: 396, tone: "system" }],
  nodes: [
    node("sheet", "Spreadsheet", "Shared state nobody owns", "external", 10, 50, 150, 84),
    node("inbox", "Inbox thread", "Approvals buried in replies", "external", 10, 168, 150, 84),
    node("handoff", "Manual handoff", "The next step lives in one person’s memory", "external", 10, 286, 150, 90),
    node("workflow", "Workflow", "Users, decisions, records, exceptions", "step", 222, 150, 160, 120),
    node("boundary", "Product boundary", "Critical path and acceptance conditions", "gate", 432, 150, 160, 120),
    node("ui", "Interface", "Screens people act from", "step", 640, 42, 170, 76),
    node("logic", "Application logic", "Rules, roles, state", "step", 640, 132, 170, 76),
    node("data", "Data", "Owned, validated records", "store", 640, 222, 170, 76),
    node("integrations", "Integrations", "Payments, identity, notifications", "step", 640, 312, 170, 84),
    node("owned", "Ownership", "Tests, deployment, documentation, handoff", "outcome", 850, 150, 145, 120),
  ],
  edges: [
    { from: "sheet", to: "workflow", kind: "muted", quiet: true }, { from: "inbox", to: "workflow", kind: "muted", quiet: true }, { from: "handoff", to: "workflow", kind: "muted" },
    { from: "workflow", to: "boundary" },
    { from: "boundary", to: "ui", quiet: true }, { from: "boundary", to: "logic", quiet: true }, { from: "boundary", to: "data", quiet: true }, { from: "boundary", to: "integrations", quiet: true },
    { from: "ui", to: "owned", quiet: true }, { from: "logic", to: "owned", quiet: true }, { from: "data", to: "owned", quiet: true }, { from: "integrations", to: "owned" },
  ],
  legend: [{ kind: "muted", label: "Today’s scattered inputs" }, { kind: "flow", label: "Owned workflow" }, { kind: "boundary", label: "System boundary" }],
};

export const customBeforeAfter = {
  before: { title: "The workflow today", steps: [
    { label: "Spreadsheet", pain: "Several people edit the same state with no validation." },
    { label: "Inbox approvals", pain: "Decisions are made in replies and are hard to find later." },
    { label: "Copy-paste", pain: "Records are re-typed between tools, so they drift." },
    { label: "Memory", pain: "Someone has to remember the next step and the exceptions." },
  ] },
  after: { title: "One owned workflow", steps: [
    { label: "Structured intake", detail: "A form or integration creates a validated record.", kind: "record" as const },
    { label: "Rules and routing", detail: "The application moves the record to the right person or system." },
    { label: "Decision point", detail: "A person reviews, approves, or overrides — with context on screen.", kind: "gate" as const },
    { label: "Recorded outcome", detail: "Result, evidence, and next action stay attached to the record.", kind: "record" as const },
  ] },
};

export const customWhen = {
  columns: ["", "Keep the SaaS tool", "Build custom"],
  rows: [
    { head: "Workflow fit", cells: ["The tool supports how decisions are actually made", "Workarounds create repeated manual handoffs"] },
    { head: "Data", cells: ["Records fit the vendor’s model", "Records, history, or permissions are specific to the business"] },
    { head: "Integration", cells: ["Supported connectors are enough", "Systems need custom rules or synchronization"] },
    { head: "Change", cells: ["The process is stable and standard", "The workflow is a differentiator that will keep changing"] },
  ],
};

/* ---------------- SaaS ---------------- */
export const saasMap: DiagramSpec = {
  eyebrow: "Account → tenant → billing → operations", title: "The first complete SaaS release", height: 520,
  caption: "Accounts and screens only become a product when the customer and operator workflows connect.",
  zones: [
    { label: "Customer workflow", x: 196, y: 24, w: 800, h: 176, tone: "system" },
    { label: "Operator workflow", x: 196, y: 300, w: 800, h: 176, tone: "operator" },
  ],
  nodes: [
    node("customer", "Customer", "Arrives with one job to get done", "actor", 10, 70, 150, 90),
    node("activation", "Sign-up & activation", "The first session reaches the core outcome", "step", 212, 64, 180, 110),
    node("tenant", "Account model", "Organization, members, invitations", "store", 412, 64, 180, 110),
    node("roles", "Roles & permissions", "Enforced on the server, per record", "gate", 612, 64, 180, 110),
    node("job", "Customer job", "The workflow the product is sold for", "outcome", 812, 64, 176, 110),
    node("records", "Product records", "Owned data, history, exports, deletion", "store", 812, 344, 176, 110),
    node("admin", "Admin & support", "Operational views and safe support access", "human", 612, 344, 180, 110),
    node("billing", "Billing-adjacent states", "Plan, trial, limits — only where release needs them", "step", 412, 344, 180, 110),
    node("loop", "Release loop", "Deploy, observe, prioritize", "sidecar", 212, 344, 180, 110),
  ],
  edges: [
    { from: "customer", to: "activation" }, { from: "activation", to: "tenant" }, { from: "tenant", to: "roles" }, { from: "roles", to: "job" },
    { from: "job", to: "records", label: "writes" },
    { from: "admin", to: "records", kind: "human" },
    { from: "tenant", to: "billing", kind: "async", label: "plan state" },
    { from: "roles", to: "admin", kind: "muted", label: "same rules", quiet: true },
    { from: "records", to: "loop", kind: "async", route: "below", depth: 36, label: "usage evidence" },
    { from: "loop", to: "activation", kind: "async", label: "next scope" },
  ],
  legend: [{ kind: "flow", label: "Customer path" }, { kind: "async", label: "State and feedback" }, { kind: "human", label: "Operator action" }],
};

export const saasScope = {
  columns: ["", "First release", "After real usage shows the need"],
  rows: [
    { head: "Accounts", cells: ["Sign-up, sign-in, one organization per customer", "Multiple workspaces, SSO, advanced invitations"] },
    { head: "Roles", cells: ["The two or three roles the core job requires", "Custom roles and fine-grained permission editors"] },
    { head: "Billing", cells: ["Only the plan or trial states that gate the core job", "Usage metering, proration, invoicing edge cases"] },
    { head: "Admin", cells: ["Support lookup, account status, safe corrections", "Full back-office tooling and bulk operations"] },
    { head: "Analytics", cells: ["Activation and core-job events", "Dashboards for every screen"] },
  ],
};

/* ---------------- Web application ---------------- */
export const webMap: DiagramSpec = {
  eyebrow: "Architecture", title: "A web application is one connected workflow", height: 400,
  caption: "Responsive interface, application rules, data, and failure states are designed together.",
  zones: [{ label: "Quality — across every layer", x: 196, y: 262, w: 800, h: 124, tone: "guard" }],
  nodes: [
    node("user", "User", "Desktop, tablet, or phone", "actor", 10, 70, 150, 90),
    node("interface", "Interface", "Accessible responsive user flow", "step", 212, 50, 180, 130),
    node("logic", "Application logic", "Validation, permissions, state", "gate", 412, 50, 180, 130),
    node("data", "Data and APIs", "Records and external services", "store", 612, 50, 180, 130),
    node("services", "External services", "Payments, identity, market data, email", "external", 812, 50, 176, 130),
    node("perf", "Performance", "Fast first load, responsive interactions", "sidecar", 212, 290, 180, 84),
    node("tests", "Testing", "Critical path and failure states", "sidecar", 412, 290, 180, 84),
    node("deploy", "Deployment", "Preview, release, rollback", "sidecar", 612, 290, 180, 84),
  ],
  edges: [
    { from: "user", to: "interface" }, { from: "interface", to: "logic" }, { from: "logic", to: "data" }, { from: "data", to: "services", kind: "async" },
    { from: "interface", to: "perf", kind: "muted", quiet: true }, { from: "logic", to: "tests", kind: "muted", quiet: true }, { from: "data", to: "deploy", kind: "muted", quiet: true },
  ],
  legend: [{ kind: "flow", label: "Request path" }, { kind: "async", label: "External call" }, { kind: "muted", label: "Verified by" }],
};

export const webStates: DiagramSpec = {
  eyebrow: "UI state map", title: "Every screen has more states than the happy path", height: 470,
  caption: "Each state gets designed copy, a next action, and a test — not a spinner and a hope.",
  nodes: [
    node("loading", "Loading", "Skeleton that matches the final layout", "step", 10, 40, 170, 100),
    node("empty", "Empty", "Explains why and offers the first action", "step", 250, 40, 170, 100),
    node("success", "Success", "Shows the result and what changed", "outcome", 490, 40, 170, 100),
    node("validation", "Validation", "Inline, specific, keeps the user’s input", "gate", 730, 40, 170, 100),
    node("error", "Error", "Says what failed, keeps the data safe", "fail", 490, 290, 170, 100),
    node("recovery", "Recovery", "Retry, restore, or contact — never a dead end", "human", 250, 290, 170, 100),
  ],
  edges: [
    { from: "loading", to: "empty", label: "no data" },
    { from: "empty", to: "success", label: "first action" },
    { from: "success", to: "validation", label: "edit" },
    { from: "validation", to: "success", kind: "retry", route: "above", depth: 26, label: "fixed" },
    { from: "success", to: "error", kind: "fail", label: "request fails" },
    { from: "error", to: "recovery", kind: "fail" },
    { from: "recovery", to: "loading", kind: "retry", label: "retry" },
  ],
  legend: [{ kind: "flow", label: "Expected path" }, { kind: "retry", label: "Return path" }, { kind: "fail", label: "Failure path" }],
};

export const webStateLedger = [
  { title: "Loading", text: "Reserve the final layout so nothing jumps; say what is loading when it takes more than a moment." },
  { title: "Empty", text: "A new account and a filter with no matches are different states with different next actions." },
  { title: "Validation", text: "Validate on the server as well as the client, show the message beside the field, and never clear what the user typed." },
  { title: "Permission", text: "Hide actions the user cannot take and enforce the same rule on the server — hiding a button is not authorization." },
  { title: "Error", text: "Separate “try again” failures from “this needs support” failures, and keep the user’s work safe in both." },
  { title: "Recovery", text: "Every failure ends in an action: retry, restore a draft, or reach a person with the context attached." },
];

/* ---------------- API integration ---------------- */
export const apiMap: DiagramSpec = {
  eyebrow: "Integration boundary", title: "A recoverable API and webhook flow", height: 690,
  caption: "The integration stays inspectable when an external system is slow, duplicated, reordered, or unavailable.",
  zones: [
    { label: "Provider", x: 4, y: 30, w: 192, h: 170, tone: "provider" },
    { label: "Edge", x: 204, y: 30, w: 392, h: 440, tone: "guard" },
    { label: "Your system", x: 604, y: 30, w: 392, h: 646, tone: "system" },
    { label: "Operations", x: 4, y: 530, w: 592, h: 146, tone: "operator" },
  ],
  nodes: [
    node("provider", "External event", "Webhook or API response you do not control", "external", 14, 70, 172, 110),
    node("verify", "Verify", "Signature, auth, and schema on the raw request", "gate", 214, 70, 172, 110),
    node("reject", "Reject", "4xx before any side effect", "fail", 214, 330, 172, 100),
    node("ack", "Acknowledge", "Fast 2xx; slow work leaves the request path", "step", 414, 70, 172, 110),
    node("idem", "Idempotency gate", "Event ID recorded before any side effect", "gate", 614, 70, 172, 110, "Duplicate → acknowledged, skipped"),
    node("queue", "Queue", "Durable hand-off to background work", "queue", 814, 70, 172, 110),
    node("process", "Process", "Transform and update owned state", "step", 814, 330, 172, 100),
    node("truth", "Source of truth", "One owner per shared record", "store", 814, 560, 172, 100),
    node("retry", "Retry with backoff", "Bounded attempts, jitter, Retry-After", "step", 614, 330, 172, 100),
    node("dead", "Dead-letter", "Error and payload metadata kept", "fail", 614, 560, 172, 100),
    node("replay", "Operator replay", "Re-enters the same idempotent path", "human", 414, 560, 172, 100),
    node("reconcile", "Reconciliation", "Scheduled listing of provider state", "sidecar", 14, 560, 172, 100),
  ],
  edges: [
    { from: "provider", to: "verify" },
    { from: "verify", to: "reject", kind: "fail", label: "invalid" },
    { from: "verify", to: "ack" }, { from: "ack", to: "idem" }, { from: "idem", to: "queue" },
    { from: "queue", to: "process" }, { from: "process", to: "truth", label: "commit" },
    { from: "process", to: "retry", kind: "retry" },
    { from: "retry", to: "queue", kind: "retry", label: "backoff", fromSide: "top", toSide: "bottom", toShift: -45 },
    { from: "retry", to: "dead", kind: "fail", label: "max attempts" },
    { from: "dead", to: "replay", kind: "human" },
    { from: "reconcile", to: "replay", kind: "async", label: "missed events", quiet: true },
  ],
  legend: [{ kind: "flow", label: "Delivery path" }, { kind: "retry", label: "Retry" }, { kind: "fail", label: "Rejected / dead-letter" }, { kind: "human", label: "Operator action" }, { kind: "boundary", label: "Ownership boundary" }],
};

/* ---------------- Business automation ---------------- */
export const automationMap: DiagramSpec = {
  eyebrow: "Control flow", title: "Automation with visible human control", height: 470,
  caption: "Repetitive steps can move automatically while approvals and exceptions remain explicit.",
  zones: [{ label: "Human control", x: 596, y: 240, w: 400, h: 216, tone: "human" }],
  nodes: [
    node("trigger", "Trigger", "Event, form, schedule, API", "external", 10, 60, 170, 110),
    node("rules", "Rules", "Validation and routing", "gate", 220, 60, 170, 110),
    node("auto", "Automated steps", "Lookups, updates, notifications", "step", 430, 60, 170, 110),
    node("record", "Record", "Outcome, evidence, next action", "store", 820, 60, 170, 110),
    node("exception", "Exception queue", "Anything the rules cannot place", "fail", 220, 300, 170, 110),
    node("decision", "Human decision", "Review, approve, override", "human", 612, 300, 180, 110),
    node("audit", "Activity trail", "Who decided what, and why", "sidecar", 820, 300, 170, 110),
  ],
  edges: [
    { from: "trigger", to: "rules" }, { from: "rules", to: "auto", label: "clear case" },
    { from: "auto", to: "decision", label: "needs approval", fromSide: "bottom", toSide: "top" },
    { from: "decision", to: "record", kind: "human", label: "approved", fromSide: "top", toSide: "bottom" },
    { from: "auto", to: "record", kind: "async", route: "above", depth: 30, label: "routine, low-risk" },
    { from: "rules", to: "exception", kind: "fail", label: "unclear" },
    { from: "exception", to: "decision", kind: "fail", label: "assigned" },
    { from: "record", to: "audit", kind: "muted", quiet: true },
  ],
  legend: [{ kind: "flow", label: "Automated path" }, { kind: "human", label: "Human decision" }, { kind: "fail", label: "Exception path" }, { kind: "async", label: "No approval needed" }],
};

export const automationBeforeAfter = {
  before: { title: "Held together by messages", steps: [
    { label: "Request arrives", pain: "In an inbox, a chat thread, or a form nobody watches." },
    { label: "Someone copies it", pain: "Into a spreadsheet, with typos and missing fields." },
    { label: "Chasing approval", pain: "Reminders by message; the decision is not recorded." },
    { label: "Status unknown", pain: "“Where is this?” is answered by asking around." },
  ] },
  after: { title: "One inspectable workflow", steps: [
    { label: "Structured trigger", detail: "Form, event, or API creates a validated item.", kind: "record" as const },
    { label: "Automatic routing", detail: "Rules assign owners and fetch the context they need." },
    { label: "Approval with context", detail: "The reviewer sees evidence, then approves or overrides.", kind: "gate" as const },
    { label: "Visible status", detail: "Every item has an owner, a state, and a history.", kind: "record" as const },
  ] },
};

export const automationSuitability = {
  columns: ["Task", "Frequency", "Rule clarity", "Cost of a wrong step", "Start with"],
  rows: [
    { head: "Routing incoming requests", tone: "ok" as const, cells: [{ level: "high" as const }, { level: "high" as const }, { level: "low" as const }, "Full automation with an exception queue"] },
    { head: "Data sync between tools", tone: "ok" as const, cells: [{ level: "high" as const }, { level: "high" as const }, { level: "medium" as const }, "Automation with reconciliation and alerts"] },
    { head: "Approvals and sign-off", tone: "warn" as const, cells: [{ level: "medium" as const }, { level: "medium" as const }, { level: "high" as const }, "Automate the preparation; keep the decision human"] },
    { head: "Triage of ambiguous cases", tone: "warn" as const, cells: [{ level: "medium" as const }, { level: "low" as const }, { level: "medium" as const }, "Suggested routing with human confirmation"] },
    { head: "Rare, high-stakes exceptions", tone: "fail" as const, cells: [{ level: "low" as const }, { level: "low" as const }, { level: "high" as const }, "A clear manual procedure — not automation"] },
  ],
};

/* ---------------- MVP ---------------- */
export const mvpCycle = {
  center: { title: "One complete workflow", text: "Every stage serves the single journey being tested." },
  stages: [
    { label: "Hypothesis", detail: "User, problem, valuable outcome" },
    { label: "Critical path", detail: "Smallest complete journey" },
    { label: "Build", detail: "Real data boundaries, essential integrations" },
    { label: "Release", detail: "Real data and essential operations" },
    { label: "Evidence", detail: "Observed friction guides next scope" },
    { label: "Decide", detail: "Continue, change, or stop" },
  ],
};

export const mvpVersus = {
  columns: ["", "Prototype", "MVP", "Production product"],
  rows: [
    { head: "Purpose", cells: ["Show an idea", "Test one assumption with real use", "Serve customers reliably at scale"] },
    { head: "Data", cells: ["Placeholder or mocked", "Real records for the chosen workflow", "Complete model, migrations, history"] },
    { head: "Users", cells: ["Viewed in a demo", "A narrow first audience completes a task", "The full market, several roles"] },
    { head: "Failure handling", cells: ["Ignored", "Critical-path errors handled and visible", "Monitored, alerted, recoverable everywhere"] },
    { head: "Ownership", cells: ["Often a design file", "Repository, deployment, and handoff you control", "Team processes, on-call, roadmap"] },
  ],
};

export const mvpBoard = [
  { label: "Now", tone: "ok" as const, note: "Required for the first user to finish the core workflow.", items: ["Sign-in for the first audience", "The one workflow that tests the hypothesis", "Real data for that workflow", "Critical-path error states", "Deployment and repository you own"] },
  { label: "Later", tone: "warn" as const, note: "Valuable, but only after evidence says so.", items: ["Secondary roles and permissions", "Settings and customization", "Additional integrations", "Reporting dashboards"] },
  { label: "Never (for now)", tone: "fail" as const, note: "Speculation that would slow the first release.", items: ["Features for imagined future users", "Scaling work without traffic", "A second product surface"] },
];

/* ---------------- AI ---------------- */
export const aiMap: DiagramSpec = {
  eyebrow: "Controlled agent path", title: "A controlled AI application workflow", height: 630,
  caption: "Models handle bounded reasoning while permissions, tools, evaluation, and irreversible actions remain explicit.",
  zones: [
    { label: "Model boundary", x: 516, y: 20, w: 480, h: 168, tone: "model" },
    { label: "Control", x: 256, y: 262, w: 480, h: 168, tone: "guard" },
    { label: "Operations sidecar", x: 4, y: 470, w: 992, h: 156, tone: "operator" },
  ],
  nodes: [
    node("request", "User request", "Arrives with account, role, permissions", "actor", 10, 58, 190, 110),
    node("context", "Scoped context", "Retrieval and product state for this user only", "store", 270, 58, 190, 110),
    node("model", "Model call", "Bounded task, structured output", "step", 530, 58, 190, 110),
    node("validate", "Validate output", "Schema, policy, and confidence checks", "gate", 790, 58, 190, 110),
    node("fallback", "Fallback", "Invalid or low-confidence → non-AI path or review queue", "fail", 790, 300, 190, 110),
    node("tools", "Scoped tools", "Least-privilege contracts and step limits", "step", 530, 300, 190, 110),
    node("approval", "Human approval", "Before irreversible or sensitive actions", "human", 270, 300, 190, 110),
    node("outcome", "Recorded outcome", "Result, sources, and an audit trail", "outcome", 10, 300, 190, 110),
    node("evals", "Evaluation set", "Reviewed cases become regression tests", "sidecar", 10, 506, 190, 100),
    node("traces", "Traces", "Every model call and tool step logged", "sidecar", 270, 506, 190, 100),
    node("limits", "Cost & step limits", "Budgets, timeouts, maximum steps", "sidecar", 530, 506, 190, 100),
  ],
  edges: [
    { from: "request", to: "context" }, { from: "context", to: "model" }, { from: "model", to: "validate" },
    { from: "validate", to: "fallback", kind: "fail", label: "invalid" },
    { from: "validate", to: "tools", label: "valid" },
    { from: "tools", to: "approval", kind: "human" },
    { from: "approval", to: "outcome", kind: "human" },
    { from: "outcome", to: "evals", kind: "async", label: "reviewed" },
    { from: "approval", to: "traces", kind: "muted", quiet: true },
    { from: "tools", to: "limits", kind: "muted", quiet: true },
  ],
  legend: [{ kind: "flow", label: "Request path" }, { kind: "human", label: "Human decision" }, { kind: "fail", label: "Fallback" }, { kind: "async", label: "Evaluation loop" }, { kind: "boundary", label: "Trust boundary" }],
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

/* ---------------- Product rescue ---------------- */
export const rescueMap: DiagramSpec = {
  eyebrow: "Rescue pipeline", title: "Stabilize before expanding", height: 440,
  caption: "Rescue work follows evidence from the critical workflow instead of beginning with an unbounded rewrite.",
  nodes: [
    node("symptoms", "Symptoms", "Reports, errors, failed demos", "external", 10, 50, 170, 110),
    node("reproduce", "Reproduce", "Environment, input, expected result", "step", 215, 50, 170, 110),
    node("diagnose", "Diagnose", "Code, config, integration, or product gap", "step", 420, 50, 170, 110),
    node("contain", "Contain", "Stop data damage; feature-flag or roll back", "fail", 625, 50, 170, 110),
    node("stabilize", "Stabilize", "Narrow release path first", "step", 830, 50, 160, 110),
    node("verify", "Verify", "Acceptance checks on the release build", "gate", 625, 290, 170, 110),
    node("release", "Release", "Known limits, rollback path, monitoring", "outcome", 420, 290, 170, 110),
    node("backlog", "Recovery plan", "Ranked, evidence-backed next scope", "sidecar", 215, 290, 170, 110),
  ],
  edges: [
    { from: "symptoms", to: "reproduce" }, { from: "reproduce", to: "diagnose" }, { from: "diagnose", to: "contain" }, { from: "contain", to: "stabilize" },
    { from: "stabilize", to: "verify", fromSide: "left", toSide: "top" },
    { from: "verify", to: "stabilize", kind: "retry", fromSide: "right", toSide: "bottom", label: "fails check" },
    { from: "verify", to: "release", label: "passes" },
    { from: "release", to: "backlog", kind: "async" },
  ],
  legend: [{ kind: "flow", label: "Rescue sequence" }, { kind: "retry", label: "Back to stabilization" }, { kind: "async", label: "Feeds the plan" }],
};

export const rescueFunnel = [
  { label: "Everything reported", detail: "Bugs, complaints, TODOs, “it feels slow”", out: "Logged, not yet trusted" },
  { label: "Reproducible", detail: "Exact input, environment, and result recorded", out: "Unreproducible reports wait for evidence" },
  { label: "On the critical path", detail: "Blocks the one workflow that must work", out: "Off-path issues go to the recovery plan" },
  { label: "Fix now", detail: "Data, auth, integration, or release blockers", out: "" },
];

export const rescueRisks = [
  { label: "Authorization gaps", likelihood: 2 as const, impact: 3 as const, control: "Check every server route and data query against the user’s role, not only the hidden button." },
  { label: "Data integrity", likelihood: 2 as const, impact: 3 as const, control: "Constraints, migrations with a rollback, and a backup verified by restore." },
  { label: "Broken integrations", likelihood: 3 as const, impact: 2 as const, control: "Reproduce against the provider sandbox; add retries, idempotency, and visible failure states." },
  { label: "Unrepeatable deploys", likelihood: 3 as const, impact: 2 as const, control: "One documented release path with environment variables listed and a rollback." },
  { label: "Silent errors", likelihood: 3 as const, impact: 2 as const, control: "Error tracking and logs on the critical path before anything else changes." },
  { label: "Slow screens", likelihood: 2 as const, impact: 1 as const, control: "Measure first; fix the queries and payloads the critical path actually uses." },
  { label: "Visual polish", likelihood: 1 as const, impact: 1 as const, control: "Deferred until the workflow is dependable." },
];

/* ---------------- Shared per-service extras ---------------- */
export const serviceStack: Record<string, { layer: string; items: string[]; why: string }[]> = {
  "custom-software-development": [
    { layer: "Application", items: ["TypeScript", "Next.js", "React"], why: "One language across interface and server logic keeps the system easier to hand over." },
    { layer: "Data", items: ["Postgres", "Supabase", "Prisma"], why: "Relational records with constraints for workflows that need history and ownership." },
    { layer: "Integration", items: ["REST APIs", "Webhooks", "GitHub"], why: "Connected to the systems the workflow already depends on." },
    { layer: "Delivery", items: ["Vercel", "Preview deployments"], why: "Every change reviewable before release; rollback available." },
  ],
  "saas-development": [
    { layer: "Product", items: ["Next.js", "React", "TypeScript"], why: "Server-rendered pages with interactive dashboards where the workflow needs them." },
    { layer: "Accounts", items: ["Auth provider", "Role checks on the server"], why: "Identity bought, authorization designed around the product’s records." },
    { layer: "Data", items: ["Postgres", "Supabase", "Prisma"], why: "Tenant-scoped records, exports, and deletion planned from the start." },
    { layer: "Operations", items: ["Admin views", "Event tracking", "Vercel"], why: "Support and release loops are part of the first release." },
  ],
  "web-application-development": [
    { layer: "Interface", items: ["React", "Next.js", "Accessible HTML"], why: "Responsive layouts verified on phone, tablet, and desktop sizes." },
    { layer: "Logic", items: ["TypeScript", "Server actions / route handlers"], why: "Validation and permissions enforced where users cannot bypass them." },
    { layer: "Data", items: ["Postgres", "REST APIs"], why: "Real records and external services behind explicit contracts." },
    { layer: "Quality", items: ["Playwright", "Preview deployments"], why: "Critical path and failure states tested in a real browser." },
  ],
  "business-automation": [
    { layer: "Triggers", items: ["Forms", "Webhooks", "Schedules", "GitHub events"], why: "Work starts from a structured, validated input." },
    { layer: "Workflow", items: ["TypeScript", "Postgres state", "Queues"], why: "Each item has an owner, a state, and a history." },
    { layer: "People", items: ["Approval views", "Notifications"], why: "Decisions happen with context and are recorded." },
    { layer: "Visibility", items: ["Activity log", "Operational dashboard"], why: "Anyone can answer “where is this?” without asking around." },
  ],
  "mvp-product-development": [
    { layer: "Build", items: ["Next.js", "TypeScript", "Supabase"], why: "Fast to ship, and still a codebase you can keep." },
    { layer: "Essentials", items: ["Auth", "One or two key integrations"], why: "Only what the first workflow needs to be real." },
    { layer: "Learning", items: ["Product events", "Feedback capture"], why: "Evidence to choose the next scope." },
    { layer: "Ownership", items: ["Your repository", "Your hosting", "Handoff notes"], why: "Nothing locked to the builder." },
  ],
  "product-rescue": [
    { layer: "Observe", items: ["Error tracking", "Structured logs"], why: "See failures before changing code." },
    { layer: "Prove", items: ["Playwright", "Reproduction scripts"], why: "A failing check first, then the fix that turns it green." },
    { layer: "Protect", items: ["Constraints", "Migrations", "Backups"], why: "Data integrity before features." },
    { layer: "Release", items: ["Preview deployments", "Rollback path"], why: "Every release reversible and documented." },
  ],
  "ai-application-development": [
    { layer: "Model layer", items: ["Model provider APIs with structured output", "Prompt and tool definitions in version control"], why: "Behavior changes are reviewed like code." },
    { layer: "Data & context", items: ["Retrieval over Postgres / Supabase records", "Per-user scoping"], why: "Nothing reaches the model that the user could not see." },
    { layer: "Tools & control", items: ["Explicit tool contracts", "Approval steps"], why: "Least privilege; irreversible actions stay gated." },
    { layer: "Quality & operations", items: ["Evaluation sets", "Tracing", "Cost limits", "Non-AI fallback"], why: "Observable behavior the team can test and improve." },
  ],
  "api-integration-development": [
    { layer: "Endpoints", items: ["TypeScript route handlers", "Raw-body signature verification"], why: "Authenticity checked before anything is parsed or stored." },
    { layer: "State", items: ["Postgres unique constraints", "Explicit event status"], why: "Idempotency enforced by the database, not by hope." },
    { layer: "Recovery", items: ["Background jobs or queues", "Dead-letter and replay"], why: "Failures wait for a fix instead of disappearing." },
    { layer: "Visibility", items: ["Sanitized structured logs", "Alerts on spikes and on silence"], why: "Someone knows before a customer does." },
  ],
};

// Why each case study is relevant to a given service (only claims visible in the public build or source).
export const proofWhy: Record<string, Record<string, string>> = {
  "custom-software-development": { resolve: "A custom funding workflow: contribution evidence, attribution, treasury, and settlement states modeled as one inspectable system.", repodiet: "A maintenance workflow built around contracts, verification, and receipts rather than a generic tool." },
  "saas-development": { meridian: "An account-style product surface where data inputs, strategy rules, and replay work together as one workflow.", resolve: "Structured records, funding states, and settlement flow behind a single product interface." },
  "web-application-development": { meridian: "A dense, multi-stage interface — data, rules, analysis, replay — kept legible across the workflow.", "agora-forge": "Separate portfolio, execute, and agent-console surfaces with visible states between them." },
  "api-integration-development": { resolve: "Contribution evidence, funding states, and USDC settlement are kept as explicit records rather than hidden side effects.", "agora-forge": "Cross-chain routes via Circle CCTP and LI.FI are compared and executed with visible states between portfolio context and settlement." },
  "business-automation": { repodiet: "GitHub-oriented automation where scoped changes pass independent verification before a reviewer sees them.", resolve: "Verification and funding decisions stay reviewable instead of disappearing into automation." },
  "mvp-product-development": { meridian: "A complete learning workflow — data in, explainable rules, replay — instead of a single demo screen.", "agora-forge": "A focused first product: portfolio context through to one explicit execution path." },
  "ai-application-development": { repodiet: "Agent-generated changes pass through a scoped contract and independent verification before a review-ready pull request exists.", resolve: "Model-assisted features sit around deterministic funding and settlement logic; the irreversible steps stay explicit." },
  "product-rescue": { repodiet: "Built for AI-assisted codebases: triage, contract-scoped cleanup, independent verification, and review-ready evidence.", meridian: "Deterministic skills and replay make behavior reproducible — the same property rescue work depends on." },
};
