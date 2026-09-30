// Page-specific guide visuals, checklists, and mistakes. No prices, no invented statistics.
import type { DiagramSpec } from "../ui/Diagram";
import type { TreeNode } from "../ui/Blocks";

/* ---------------- Hire a SaaS developer ---------------- */
export const saasScorecard = [
  { id: "job", area: "Customer job", question: "Can they describe your first user’s job and the smallest complete path to it?", evidence: "A written summary of the user, the core outcome, and what they would leave out.", redFlag: "They start with a feature list or a framework choice." },
  { id: "boundary", area: "Product boundary", question: "Do they cover accounts, roles, authorization, and operator access — not only screens?", evidence: "How permissions are enforced on the server, and who can see which records.", redFlag: "Authorization means hiding buttons in the interface." },
  { id: "failure", area: "Failure states", question: "Can they show how a failure appears to a user and to an administrator?", evidence: "A walkthrough of an error, empty, or permission state in a real product.", redFlag: "Only happy-path demos." },
  { id: "evidence", area: "Evidence", question: "Can you inspect live work and source, not just screenshots?", evidence: "Live builds, public or shared repositories, and a difficult state explained.", redFlag: "Confidence without anything you can open." },
  { id: "ownership", area: "Ownership", question: "Will you own the repository, hosting, data, and key accounts from day one?", evidence: "A written ownership list and handoff steps.", redFlag: "Code or accounts stay in the developer’s name." },
  { id: "release", area: "First release", question: "Is the first release scoped to one important job with acceptance conditions?", evidence: "Acceptance conditions for the critical path and an explicit “later” list.", redFlag: "Broad settings, secondary roles, and dashboards in the first scope." },
];
export const saasHireChecklist = ["Write the first user, their job, and what changes after success.", "Ask for a walkthrough of a permission or failure state in a live product.", "Agree on repository, hosting, data, and account ownership before work starts.", "Define acceptance conditions for the critical path.", "Keep a written “later” list for everything outside the first release."];
export const saasHireMistakes = ["Hiring on framework keywords instead of product reasoning.", "Reviewing screens without asking about accounts, roles, and records.", "Accepting a demo that never shows an error or empty state.", "Leaving deployment and handoff until the end."];

/* ---------------- Hire a web app developer ---------------- */
export const webCompetency = {
  columns: ["Competency", "Ask them to show", "Strong signal", "Red flag"],
  rows: [
    { head: "User flow and states", cells: ["A flow with its loading, empty, validation, and error states", "Every state has copy and a next action", "Only the happy path is designed"] },
    { head: "Frontend", cells: ["A responsive screen on phone and desktop", "Layout and focus order hold up at every size", "Desktop-only mockups"] },
    { head: "Backend and authorization", cells: ["Where a permission is enforced", "Checked on the server for every request", "“The button is hidden for other roles”"] },
    { head: "Data", cells: ["How records are validated and owned", "Constraints and validation in more than one layer", "Anything the client sends is trusted"] },
    { head: "Integrations", cells: ["What happens when an API call fails", "Retries, idempotency, visible failure state", "“The API is reliable”"] },
    { head: "Testing", cells: ["How the critical path is verified", "Automated checks against a real browser build", "Manual clicking before release"] },
    { head: "Deployment and handoff", cells: ["How a release and a rollback happen", "Documented steps and environment variables", "Only they know how to deploy"] },
  ],
};
export const webHireChecklist = ["Describe the user flow including loading, empty, permission, validation, and error states.", "Ask where authorization is enforced, not only how it looks.", "Agree on inputs, outputs, failure behavior, and ownership for every integration.", "Confirm you control the repository, hosting, data service, and key integrations.", "Write acceptance conditions for the working flow."];
export const webHireMistakes = ["Buying a page count instead of a working flow.", "Treating a hidden button as a permission.", "Accepting a happy-path integration demo as complete.", "Handing over without documented environment variables and release steps."];

/* ---------------- Startup MVP development ---------------- */
export const mvpHypothesis = [
  { label: "A specific person", detail: "Narrow first audience, not “everyone”", out: "Broad audiences hide whether it works for anyone" },
  { label: "A recurring problem", detail: "Something they already spend time or money on", out: "One-off pains rarely justify a product" },
  { label: "A valuable outcome", detail: "What is different after they succeed", out: "Features without an outcome are hard to test" },
  { label: "Observable behavior", detail: "What they will do that changes your next decision", out: "" },
];
export const mvpNowNextLater = [
  { label: "Now", tone: "ok" as const, note: "Needed for the first user to finish one workflow.", items: ["Entry point and sign-in", "The one workflow that tests the hypothesis", "Real data for that workflow", "Incomplete input, empty, and failure states", "Deployment and repository you own"] },
  { label: "Next", tone: "warn" as const, note: "Chosen from observed friction after launch.", items: ["The step users struggled with most", "The integration users asked for", "A second role, if the first workflow needs it"] },
  { label: "Later", tone: "fail" as const, note: "Speculative until evidence says otherwise.", items: ["Settings and customization", "Dashboards for every metric", "Features for imagined future users"] },
];
export const mvpGuideChecklist = ["Name the person, the problem, the outcome, and the behavior you will observe.", "Give the workflow an entry point, required input, action, visible result, and recovery.", "Store only the data the first workflow needs.", "Include access, empty data, and failure states — not only the demo path.", "Decide how you will choose the next scope before you launch."];
export const mvpGuideMistakes = ["Launching to “everyone” so no signal is clear.", "Placeholder data where real data would expose the risk.", "Adding integrations that do not change the result.", "Choosing the next scope from a backlog instead of user friction."];

/* ---------------- Custom software vs SaaS ---------------- */
export const buildBuyTree: TreeNode = {
  question: "Does a mature SaaS tool support the workflow without heavy workarounds?",
  hint: "List the user, decisions, records, exceptions, and systems before answering.",
  options: [
    { label: "Yes, with modest configuration", result: { title: "Buy the tool", text: "Configure it, integrate what you must, and revisit when workarounds start creating manual handoffs.", tone: "ok" } },
    { label: "Partly — the core fits, one workflow does not", next: {
      question: "Is that workflow what makes the business distinct?",
      options: [
        { label: "Yes", result: { title: "Hybrid: buy the commodity, build the workflow", text: "Keep authentication, email, payments, and storage as services; build the differentiating workflow around them.", tone: "ok", href: "/services/custom-software-development/", linkLabel: "Custom software development" } },
        { label: "No", result: { title: "Adapt the process or extend the tool", text: "A standard workflow rarely justifies owning software. Use extensions or integrations first.", tone: "warn" } },
      ] } },
    { label: "No — workarounds drive manual handoffs", next: {
      question: "Can you test a narrow first step before committing?",
      options: [
        { label: "Yes", result: { title: "Build a reversible first step", text: "Ship one internal tool, integration, or critical path. Define the evidence that justifies expanding it — and what would send you back to a SaaS option.", tone: "ok", href: "/services/custom-software-development/", linkLabel: "Custom software development" } },
        { label: "Not yet", result: { title: "Map the workflow first", text: "Document the records, decisions, and exceptions. The answer usually becomes obvious once the workarounds are written down.", tone: "human" } },
      ] } },
  ],
};
export const buildBuyMatrix = {
  columns: ["Decision factor", "Prefer SaaS", "Prefer custom"],
  rows: [
    { head: "Workflow fit", cells: ["Standard workflow fits", "Workflow is differentiating"] },
    { head: "Time to value", cells: ["Need a mature tool now", "Can ship a narrow owned path"] },
    { head: "Integration", cells: ["Supported connectors are enough", "Data and systems need custom logic"] },
    { head: "Ownership", cells: ["Vendor limits are acceptable", "Control and extensibility matter"] },
  ],
};
export const buildBuyChecklist = ["List users, decisions, records, exceptions, and systems for the workflow.", "Compare lifetime ownership: subscriptions, integration, administration, change.", "Separate commodity layers from the differentiating workflow.", "Choose a reversible first step and the evidence that would expand it."];
export const buildBuyMistakes = ["Comparing first-year price instead of lifetime ownership.", "Building commodity layers like authentication or email from scratch.", "Forcing a differentiating workflow into a tool that distorts it.", "Committing to a full custom system with no reversible first step."];

/* ---------------- SaaS MVP cost ---------------- */
export const costDrivers = {
  columns: ["Scope driver", "Lower complexity", "Higher complexity", "Effect on scope"],
  rows: [
    { head: "Users", tone: "warn" as const, cells: ["One user type", "Organizations and several roles", { level: "high" as const, text: "Roles touch every screen and query" }] },
    { head: "Data", tone: "warn" as const, cells: ["Simple owned records", "Imports, history, auditability", { level: "medium" as const, text: "Migrations and history add work" }] },
    { head: "Integrations", tone: "fail" as const, cells: ["One essential provider", "Payments, AI, webhooks, sync", { level: "high" as const, text: "Each adds failure paths to design" }] },
    { head: "Operations", tone: "warn" as const, cells: ["Basic support view", "Admin, monitoring, recovery", { level: "medium" as const, text: "Operator tools are a second product" }] },
    { head: "Quality bar", cells: ["Internal pilot", "Paying customers from day one", { level: "medium" as const, text: "More states, tests, and monitoring" }] },
    { head: "Uncertainty", cells: ["Problem and workflow are clear", "Key assumptions still open", { level: "high" as const, text: "Discovery before a reliable estimate" }] },
  ],
};
export const costChecklist = ["Write the smallest complete customer journey.", "Decide the account, role, and ownership model for records.", "List every integration with its failure paths.", "Break the release into observable outcomes with acceptance conditions.", "Keep speculative features out of the first estimate."];
export const costMistakes = ["Estimating from a page or screen count.", "Treating authentication as the whole account system.", "Pricing the integration demo instead of its failure handling.", "Leaving testing, deployment, and handoff out of the estimate."];

/* ---------------- API integration planning ---------------- */
export const contractMap: DiagramSpec = {
  eyebrow: "Contract map", title: "What must be agreed before the first request", height: 470,
  caption: "Both sides of the boundary are written down: what crosses it, who owns it, and what happens when it fails.",
  zones: [{ label: "Your system", x: 4, y: 24, w: 392, h: 432, tone: "system" }, { label: "Provider", x: 604, y: 24, w: 392, h: 432, tone: "provider" }],
  nodes: [
    { id: "records", label: "Owned records", detail: "Source of truth per field", kind: "store", x: 20, y: 70, w: 180, h: 100 },
    { id: "auth", label: "Credentials", detail: "OAuth or keys, scopes, rotation", kind: "gate", x: 20, y: 200, w: 180, h: 100 },
    { id: "ops", label: "Operations", detail: "Alerts, replay, reconciliation owner", kind: "human", x: 20, y: 330, w: 180, h: 100 },
    { id: "contract", label: "Contract", detail: "Inputs, fields, identifiers, versions", kind: "step", x: 410, y: 70, w: 180, h: 100 },
    { id: "limits", label: "Limits", detail: "Rate limits, quotas, timeouts", kind: "step", x: 410, y: 200, w: 180, h: 100 },
    { id: "failures", label: "Failure rules", detail: "Retries, idempotency, ordering, dead-letter", kind: "fail", x: 410, y: 330, w: 180, h: 100 },
    { id: "api", label: "Provider API", detail: "Versioned endpoints and sandbox", kind: "external", x: 800, y: 70, w: 180, h: 100 },
    { id: "hooks", label: "Webhooks", detail: "Signed events, retry policy", kind: "external", x: 800, y: 200, w: 180, h: 100 },
    { id: "changes", label: "Provider changes", detail: "Deprecations and incidents", kind: "external", x: 800, y: 330, w: 180, h: 100 },
  ],
  edges: [
    { from: "records", to: "contract", kind: "async" }, { from: "contract", to: "api", kind: "async" },
    { from: "auth", to: "limits", kind: "async" }, { from: "limits", to: "hooks", kind: "async" },
    { from: "ops", to: "failures", kind: "human" }, { from: "failures", to: "changes", kind: "fail" },
  ],
  legend: [{ kind: "async", label: "Agreed contract" }, { kind: "fail", label: "Failure handling" }, { kind: "human", label: "Operational owner" }],
};
export const sourceOfTruth = {
  columns: ["Record (example)", "Owner", "Direction", "On conflict"],
  rows: [
    { head: "Customer profile", cells: ["Your application", "Push to provider", "Your value wins; provider is updated"] },
    { head: "Payment status", cells: ["Payment provider", "Pull or webhook", "Provider wins; fetch current state"] },
    { head: "Order line items", cells: ["Your application", "Push on create", "Immutable after submission"] },
    { head: "Shipping updates", cells: ["Carrier API", "Webhook + reconciliation", "Latest provider timestamp wins"] },
  ],
};
export const apiReadiness = ["Contract documented: inputs, fields, identifiers, versioning", "Source of truth decided for every shared record", "Credentials owned by the client, with rotation steps", "Rate limits and timeouts known and handled", "Idempotency keys on every write", "Retry and dead-letter behavior defined", "Webhook signatures verified", "Sandbox and production differences tested", "Logging and alerting on failures and on silence", "A named owner for incidents and provider changes"];
export const apiMistakes = ["Planning the request and not the failure.", "Two systems both believing they own a record.", "Credentials tied to one person’s account.", "No way to replay or reconcile after an outage."];

/* ---------------- Rescue an AI-built web app ---------------- */
export const symptomTable = {
  columns: ["Symptom", "Likely cause", "Test that confirms it", "Response"],
  rows: [
    { head: "Works locally, fails in production", tone: "fail" as const, cells: ["Missing environment variables or different config", "Deploy a preview with the production config", "Document every variable; one release path"] },
    { head: "Users see each other’s data", tone: "fail" as const, cells: ["Authorization only in the interface", "Request another user’s record directly", "Enforce ownership in every query"] },
    { head: "Random duplicate records", tone: "warn" as const, cells: ["Retries without idempotency", "Submit the same action twice quickly", "Unique constraints and idempotency keys"] },
    { head: "Integration silently stops", tone: "warn" as const, cells: ["Unhandled provider errors", "Replay a failed provider response in the sandbox", "Visible failure state, retries, alerts"] },
    { head: "Every fix breaks something else", tone: "warn" as const, cells: ["No tests on the critical path", "Write one failing browser check for the path", "Tests first, then narrow fixes"] },
    { head: "Nobody can deploy but one person", tone: "fail" as const, cells: ["Undocumented release steps", "Ask a second person to deploy a preview", "Written release and rollback steps"] },
  ],
};
export const rescueSteps = [
  { label: "Freeze", text: "Pause new features; name the one workflow that must work" },
  { label: "Reproduce", text: "Record inputs, environment, and expected vs actual" },
  { label: "Repair", text: "Fix boundaries: auth, data, contracts, recovery" },
  { label: "Release", text: "Acceptance checks, known limits, rollback path" },
];
export const rescueChecklist = ["Name the first user and the one result that must work.", "Reproduce each failure with exact inputs and environment.", "Separate product gaps, code defects, config problems, and integration failures.", "Fix authentication, authorization, data integrity, and recovery before polish.", "Release with acceptance checks, documented limits, and a rollback path."];
export const rescueMistakes = ["Starting with a rewrite before reproducing failures.", "Polishing the interface while data integrity is unknown.", "Letting new features continue during stabilization.", "Choosing next scope by code aesthetics instead of user friction."];

/* ---------------- AI feature vs automation ---------------- */
export const aiTree: TreeNode = {
  question: "Should the same input always produce the same action?",
  hint: "Write the input, allowed actions, output, cost of error, and how correctness is judged.",
  options: [
    { label: "Yes", result: { title: "Deterministic automation", text: "Rules and tests. Faster, cheaper, and easier to verify than any model.", tone: "ok", href: "/services/business-automation/", linkLabel: "Business automation" } },
    { label: "No — it needs interpretation or generation", next: {
      question: "Does the task need several tools chosen along the way?",
      options: [
        { label: "No — one bounded step", next: {
          question: "Is the result reversible and low-impact?",
          options: [
            { label: "Yes", result: { title: "Bounded AI feature", text: "Structured output, evaluation, and a fallback path inside a fixed flow.", tone: "ok", href: "/services/ai-application-development/", linkLabel: "AI application development" } },
            { label: "No", result: { title: "AI feature with human approval", text: "The model suggests; a person or a deterministic rule confirms before anything changes.", tone: "human" } },
          ] } },
        { label: "Yes — multi-step tool use", result: { title: "Controlled agent", text: "Least-privilege tools, step and cost limits, approval before irreversible actions, and full traces.", tone: "warn", href: "/services/ai-application-development/", linkLabel: "AI application development" } },
      ] } },
  ],
};
export const aiFactors = {
  columns: ["Factor", "Deterministic automation", "AI feature", "Controlled agent"],
  rows: [
    { head: "Predictability", cells: [{ level: "high" as const, text: "Same input, same output" }, { level: "medium" as const, text: "Bounded by evaluation" }, { level: "low" as const, text: "Plans vary per run" }] },
    { head: "Handles ambiguity", cells: [{ level: "low" as const, text: "Needs clear rules" }, { level: "high" as const, text: "Interprets and generates" }, { level: "high" as const, text: "Explores as it goes" }] },
    { head: "Reversibility needed", cells: ["Any — rules are tested", "Prefer reversible results", "Irreversible steps need approval"] },
    { head: "Permissions", cells: ["Fixed by code", "Read context, write via product rules", "Least-privilege tools, allow-lists"] },
    { head: "Human approval", cells: ["Rarely", "For high-impact results", "Before sensitive actions"] },
    { head: "Cost per task", cells: [{ level: "low" as const }, { level: "medium" as const }, { level: "high" as const }] },
    { head: "Failure tolerance", cells: ["Failures are bugs", "Some wrong output is expected; fallback exists", "Wrong actions must be stoppable"] },
  ],
};
export const aiArchMatrix = {
  columns: ["Need", "Best starting point", "Control"],
  rows: [
    { head: "Same input, same action", cells: ["Deterministic automation", "Rules and tests"] },
    { head: "Interpret or generate", cells: ["Bounded AI feature", "Evaluation and fallback"] },
    { head: "Use several tools", cells: ["Controlled agent", "Permissions and approvals"] },
    { head: "Irreversible decision", cells: ["Deterministic guardrail", "Human authorization"] },
  ],
};
export const aiChecklist = ["Write the input, allowed actions, output, and cost of error.", "Keep identity, authorization, money movement, and deletion behind product rules.", "Build an evaluation set of success, edge, and failure cases before launch.", "Track usefulness, incorrect output, refusal, latency, and cost.", "Define what happens when the model or a tool is unavailable."];
export const aiMistakes = ["Using a model where a rule would do.", "Letting a model trigger irreversible actions directly.", "Treating a demo prompt as an evaluation plan.", "Hiding from users that AI was involved."];
