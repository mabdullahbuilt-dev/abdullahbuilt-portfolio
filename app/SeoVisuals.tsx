type Flow = { label: string; detail: string };

const serviceFlows: Record<string, { title: string; caption: string; steps: Flow[] }> = {
  "custom-software-development": { title: "From operating problem to owned software", caption: "A useful custom system starts with the decision and data boundary, not a feature list.", steps: [
    { label: "Workflow", detail: "Users, decisions, records, exceptions" },
    { label: "Product boundary", detail: "Critical path and acceptance conditions" },
    { label: "Working system", detail: "Interface, logic, data, integrations" },
    { label: "Ownership", detail: "Tests, deployment, documentation, handoff" },
  ]},
  "saas-development": { title: "The first complete SaaS release", caption: "Accounts and screens only become a product when the customer and operator workflows connect.", steps: [
    { label: "Customer job", detail: "Activation and core outcome" },
    { label: "Account model", detail: "Identity, roles, permissions" },
    { label: "Product state", detail: "Records, billing-adjacent states, admin" },
    { label: "Release loop", detail: "Deploy, observe, prioritize" },
  ]},
  "web-application-development": { title: "A web application is one connected workflow", caption: "Responsive interface, application rules, data, and failure states are designed together.", steps: [
    { label: "Interface", detail: "Accessible responsive user flow" },
    { label: "Application logic", detail: "Validation, permissions, state" },
    { label: "Data and APIs", detail: "Records and external services" },
    { label: "Quality", detail: "Performance, testing, deployment" },
  ]},
  "api-integration-development": { title: "A recoverable API and webhook flow", caption: "The integration stays inspectable when an external system is slow, duplicated, reordered, or unavailable.", steps: [
    { label: "Receive", detail: "Authenticate and validate contract" },
    { label: "Protect", detail: "Idempotency, limits, ordering" },
    { label: "Process", detail: "Transform and update owned state" },
    { label: "Recover", detail: "Retry, log, reconcile, replay" },
  ]},
  "business-automation": { title: "Automation with visible human control", caption: "Repetitive steps can move automatically while approvals and exceptions remain explicit.", steps: [
    { label: "Trigger", detail: "Event, form, schedule, API" },
    { label: "Rules", detail: "Validation and routing" },
    { label: "Human decision", detail: "Review, approve, override" },
    { label: "Record", detail: "Outcome, evidence, next action" },
  ]},
  "mvp-product-development": { title: "The MVP learning loop", caption: "The release is small, but the chosen workflow is complete enough to generate real evidence.", steps: [
    { label: "Hypothesis", detail: "User, problem, valuable outcome" },
    { label: "Critical path", detail: "Smallest complete journey" },
    { label: "Release", detail: "Real data and essential operations" },
    { label: "Evidence", detail: "Observed friction guides next scope" },
  ]},
  "ai-application-development": { title: "A controlled AI application workflow", caption: "Models handle bounded reasoning while permissions, tools, evaluation, and irreversible actions remain explicit.", steps: [
    { label: "Context", detail: "Structured input and retrieval" },
    { label: "Model", detail: "Bounded reasoning or generation" },
    { label: "Tools", detail: "Scoped actions and permissions" },
    { label: "Review", detail: "Validation, fallback, observation" },
  ]},
  "product-rescue": { title: "Stabilize before expanding", caption: "Rescue work follows evidence from the critical workflow instead of beginning with an unbounded rewrite.", steps: [
    { label: "Reproduce", detail: "Environment, input, expected result" },
    { label: "Rank risk", detail: "User and business impact" },
    { label: "Stabilize", detail: "Narrow release path first" },
    { label: "Verify", detail: "Tests, deployment, recovery plan" },
  ]},
};

const guideMatrices: Record<string, { title: string; headers: [string, string, string]; rows: [string, string, string][] }> = {
  "custom-software-vs-saas": { title: "Build-or-buy decision matrix", headers: ["Decision factor", "Prefer SaaS", "Prefer custom"], rows: [
    ["Workflow fit", "Standard workflow fits", "Workflow is differentiating"],
    ["Time to value", "Need a mature tool now", "Can ship a narrow owned path"],
    ["Integration", "Supported connectors are enough", "Data and systems need custom logic"],
    ["Ownership", "Vendor limits are acceptable", "Control and extensibility matter"],
  ]},
  "ai-feature-vs-automation": { title: "Architecture choice matrix", headers: ["Need", "Best starting point", "Control"], rows: [
    ["Same input, same action", "Deterministic automation", "Rules and tests"],
    ["Interpret or generate", "Bounded AI feature", "Evaluation and fallback"],
    ["Use several tools", "Controlled agent", "Permissions and approvals"],
    ["Irreversible decision", "Deterministic guardrail", "Human authorization"],
  ]},
  "saas-mvp-development-cost": { title: "What changes SaaS MVP scope", headers: ["Scope driver", "Lower complexity", "Higher complexity"], rows: [
    ["Users", "One user type", "Organizations and several roles"],
    ["Data", "Simple owned records", "Imports, history, auditability"],
    ["Integrations", "One essential provider", "Payments, AI, webhooks, sync"],
    ["Operations", "Basic support view", "Admin, monitoring, recovery"],
  ]},
};

export function ServiceWorkflow({ slug }: { slug: string }) {
  const flow = serviceFlows[slug];
  return <figure className="seo-flow" aria-labelledby={`flow-${slug}`}>
    <div className="seo-figure-heading"><span>WORKFLOW MAP</span><h2 id={`flow-${slug}`}>{flow.title}</h2></div>
    <div className="seo-flow-steps">{flow.steps.map((step, index) => <div className="seo-flow-step" key={step.label}>
      <small>{String(index + 1).padStart(2, "0")}</small><strong>{step.label}</strong><span>{step.detail}</span>
    </div>)}</div>
    <figcaption>{flow.caption}</figcaption>
  </figure>;
}

export function GuideVisual({ slug, headings }: { slug: string; headings: string[] }) {
  const matrix = guideMatrices[slug];
  if (matrix) return <figure className="seo-matrix" aria-labelledby={`matrix-${slug}`}>
    <div className="seo-figure-heading"><span>DECISION TOOL</span><h2 id={`matrix-${slug}`}>{matrix.title}</h2></div>
    <div className="seo-table-wrap"><table><thead><tr>{matrix.headers.map(header => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{matrix.rows.map(row => <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <th key={cell} scope="row">{cell}</th> : <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div>
    <figcaption>Use this as a starting filter, then confirm the choice against the actual workflow and constraints.</figcaption>
  </figure>;

  return <figure className="seo-guide-map" aria-labelledby={`guide-map-${slug}`}>
    <div className="seo-figure-heading"><span>READING MAP</span><h2 id={`guide-map-${slug}`}>The decision path in this guide</h2></div>
    <ol>{headings.slice(0, 4).map((heading, index) => <li key={heading}><small>{String(index + 1).padStart(2, "0")}</small><span>{heading}</span></li>)}</ol>
    <figcaption>Follow the sequence from problem definition to a verifiable implementation or hiring decision.</figcaption>
  </figure>;
}
