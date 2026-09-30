// Case-study visuals. Annotations point at areas visible in the cleaned public-build screenshots;
// values shown inside those screenshots are the builds' own demo data and are never quoted as results.
import type { DiagramSpec, DNode } from "../ui/Diagram";

const node = (id: string, label: string, detail: string, kind: DNode["kind"], x: number, y: number, w = 180, h = 104): DNode => ({ id, label, detail, kind, x, y, w, h });

export type CaseVisual = {
  facts: { label: string; value: string }[];
  notes: { x: number; y: number; title: string; text: string }[];
  map: DiagramSpec;
  why: string[]; // rationale for each selected technical decision, same order as project.decisions
  role: { label: string; text: string }[];
};

export const caseVisuals: Record<string, CaseVisual> = {
  resolve: {
    facts: [{ label: "Type", value: "Payments and funding workflow" }, { label: "Stack", value: "Next.js · Supabase · Postgres · Prisma" }, { label: "Settlement", value: "USDC on Arc (testnet)" }, { label: "Evidence", value: "Live build · public source" }],
    notes: [
      { x: 54, y: 55, title: "Verified source activity", text: "Contributions from code, research, music, and media enter as evidence, each with its own verification state." },
      { x: 68, y: 50, title: "Evidence core", text: "Proof, identity, allocation, and policy are resolved in one place before any money is discussed." },
      { x: 82, y: 43, title: "Funding blueprint", text: "Payees, policy, and attached evidence form a reviewable plan instead of an instant payout." },
      { x: 82, y: 68, title: "Settlement stays explicit", text: "USDC authorization is shown as a preview until approval — the irreversible step is never implicit." },
    ],
    map: {
      eyebrow: "System map", height: 470, caption: "Evidence becomes a funding decision through inspectable records; settlement is a separate, approved step.",
      zones: [{ label: "Deterministic product logic", x: 206, y: 24, w: 600, h: 196, tone: "system" }, { label: "Money movement", x: 606, y: 262, w: 390, h: 196, tone: "human" }],
      nodes: [
        node("activity", "Verified activity", "Code, research, music, media, communities", "external", 10, 70),
        node("evidence", "Evidence core", "Proof, identity, allocation, policy", "gate", 220, 70),
        node("records", "Structured records", "Supabase / Postgres via Prisma", "store", 420, 70),
        node("blueprint", "Funding blueprint", "Payees, policy, attached evidence", "step", 620, 70, 180),
        node("approval", "Approval", "Receipt produced after approval", "human", 620, 300),
        node("settle", "Arc settlement", "USDC authorization", "outcome", 815, 300, 175),
        node("assist", "AI-assisted components", "Support the workflow around fixed logic", "sidecar", 220, 300),
      ],
      edges: [
        { from: "activity", to: "evidence" }, { from: "evidence", to: "records" }, { from: "records", to: "blueprint" },
        { from: "blueprint", to: "approval", label: "review" }, { from: "approval", to: "settle", kind: "human" },
        { from: "assist", to: "records", kind: "muted", quiet: true, fromSide: "top", toSide: "bottom" },
      ],
      legend: [{ kind: "flow", label: "Evidence to funding" }, { kind: "human", label: "Approved settlement" }, { kind: "muted", label: "Assists, never decides" }],
    },
    why: ["Reviewers can see why a contribution was funded and what is still pending before any payment moves.", "Contributions, allocations, and settlements need relations, history, and constraints — not loose documents.", "Model output can help interpret evidence, but eligibility and money movement follow fixed, testable rules."],
    role: [{ label: "Product", text: "Workflow from evidence to funding decision" }, { label: "Interface", text: "Evidence, blueprint, and settlement surfaces" }, { label: "Engineering", text: "Records, integrations, settlement states" }, { label: "Release", text: "Deployed public build and repository" }],
  },
  meridian: {
    facts: [{ label: "Type", value: "Market intelligence workflow" }, { label: "Stack", value: "Next.js · TypeScript" }, { label: "Core idea", value: "Explainable rules with replay" }, { label: "Evidence", value: "Live build · public source" }],
    notes: [
      { x: 47, y: 5, title: "Separate surfaces", text: "Strategy, NEXUS, and PRISM keep research, analysis, and execution in distinct places." },
      { x: 46, y: 58, title: "Deterministic skills", text: "Market data is scored by explicit skills, so a signal can be traced back to its rules." },
      { x: 46, y: 76, title: "Reproducible by design", text: "A versioned spec and a public endpoint let anyone re-run the same evaluation." },
      { x: 76, y: 5, title: "Execution is opt-in", text: "Wallet connection sits apart from research — nothing executes by default." },
    ],
    map: {
      eyebrow: "System map", height: 470, caption: "Every stage has one role; replay runs the same rules as the live desk.",
      zones: [{ label: "Research and decision preparation", x: 4, y: 24, w: 792, h: 196, tone: "system" }],
      nodes: [
        node("data", "Market data", "Live inputs, kept separate from rules", "external", 14, 70, 170),
        node("skills", "Deterministic skills", "Explicit scoring of each input", "step", 214, 70, 170),
        node("debate", "Opposing analysis", "The case against, beside the case for", "step", 414, 70, 170),
        node("constraints", "Strategy constraints", "Rules a trade must pass", "gate", 614, 70, 170),
        node("replay", "Historical replay", "Same rules, past data", "sidecar", 414, 300, 170),
        node("execution", "Optional execution", "Wallet-gated, off by default", "human", 814, 300, 176),
      ],
      edges: [
        { from: "data", to: "skills" }, { from: "skills", to: "debate" }, { from: "debate", to: "constraints" },
        { from: "constraints", to: "execution", kind: "human", label: "permitted", fromSide: "right", toSide: "top" },
        { from: "constraints", to: "replay", kind: "async", label: "test", fromSide: "bottom", toSide: "right" },
        { from: "replay", to: "skills", kind: "retry", label: "adjust rules", fromSide: "left", toSide: "bottom" },
      ],
      legend: [{ kind: "flow", label: "Decision path" }, { kind: "async", label: "Replay" }, { kind: "retry", label: "Rule revision" }, { kind: "human", label: "Opt-in execution" }],
    },
    why: ["A strategy is only trustworthy if a user can re-run it and see the same result.", "Where the same input must give the same score, rules beat prompts.", "Preparing a decision and acting on it carry different risks, so they live on different surfaces."],
    role: [{ label: "Product", text: "Research-to-decision workflow" }, { label: "Interface", text: "Strategy, analysis, and replay views" }, { label: "Engineering", text: "Skills, constraints, replay engine" }, { label: "Release", text: "Deployed public build and repository" }],
  },
  repodiet: {
    facts: [{ label: "Type", value: "Repository maintenance automation" }, { label: "Stack", value: "GitHub automation · A2MCP / A2A patterns" }, { label: "Core idea", value: "Scoped change, independent proof" }, { label: "Evidence", value: "Live build · public source" }],
    notes: [
      { x: 53, y: 58, title: "Classified findings", text: "Each finding is labelled safe, review-first, or protected before anything changes." },
      { x: 64, y: 44, title: "Five-stage pipeline", text: "Analyze, contract, execute, verify, deliver — every stage is visible." },
      { x: 78, y: 40, title: "Locked contract", text: "Scope, change budget, and protected paths such as auth and migrations are fixed up front." },
      { x: 78, y: 70, title: "Bounded execution", text: "Changes happen on an isolated branch and are checked against the budget before delivery." },
    ],
    map: {
      eyebrow: "System map", height: 460, caption: "Implementation and verification are separate steps; the reviewer receives evidence, not just a diff.",
      zones: [{ label: "Isolated branch", x: 406, y: 24, w: 388, h: 196, tone: "guard" }],
      nodes: [
        node("analyze", "Analyze", "Commit-pinned triage of the repository", "step", 14, 70, 170),
        node("contract", "Contract", "Scope, budget, protected paths", "gate", 214, 70, 170),
        node("execute", "Execute", "Bounded changes only", "step", 420, 70, 170),
        node("verify", "Verify", "Independent check of the result", "gate", 614, 70, 170),
        node("deliver", "Deliver", "Review-ready pull request", "outcome", 814, 70, 176),
        node("receipt", "Signed receipt", "Evidence trail for the reviewer", "store", 814, 300, 176),
        node("reject", "Out of contract", "Stopped, not merged", "fail", 614, 300, 170),
      ],
      edges: [
        { from: "analyze", to: "contract" }, { from: "contract", to: "execute" }, { from: "execute", to: "verify" }, { from: "verify", to: "deliver" },
        { from: "deliver", to: "receipt", label: "attached" },
        { from: "verify", to: "reject", kind: "fail", label: "fails" },
      ],
      legend: [{ kind: "flow", label: "Maintenance path" }, { kind: "fail", label: "Stopped change" }, { kind: "boundary", label: "Isolated branch" }],
    },
    why: ["Without an agreed scope, an automated cleanup can touch anything — including authentication or migrations.", "The system that made a change should not be the only one that says it worked.", "Reviewers need to see what was checked, not only a green badge."],
    role: [{ label: "Product", text: "Maintenance workflow and review experience" }, { label: "Interface", text: "Findings, pipeline, and contract views" }, { label: "Engineering", text: "GitHub automation and verification flow" }, { label: "Release", text: "Deployed public build and repository" }],
  },
  "agora-forge": {
    facts: [{ label: "Type", value: "Cross-chain execution workflow" }, { label: "Rails", value: "Circle CCTP · LI.FI · Arc" }, { label: "Data", value: "Zerion · Covalent portfolio context" }, { label: "Evidence", value: "Live build · public source" }],
    notes: [
      { x: 30, y: 10, title: "Provider status in view", text: "Each data and routing provider shows whether it is connected before a user acts." },
      { x: 8, y: 25, title: "Separate surfaces", text: "Overview, portfolio, and execution desk are distinct places with distinct jobs." },
      { x: 72, y: 55, title: "Route made legible", text: "The execution desk shows each hop — CCTP burn and mint, then a LI.FI route — instead of one opaque swap." },
      { x: 80, y: 72, title: "Quotes before commitment", text: "Route, settlement, and slippage details appear before anything is signed." },
    ],
    map: {
      eyebrow: "System map", height: 470, caption: "Portfolio context comes first; execution is a separate, explicit path with visible hops.",
      zones: [{ label: "Execution desk", x: 406, y: 24, w: 590, h: 196, tone: "system" }],
      nodes: [
        node("context", "Portfolio context", "Balances and positions from Zerion and Covalent", "store", 14, 70, 170),
        node("intent", "Execution intent", "What to move, and where", "actor", 214, 76, 170, 92),
        node("route", "Route comparison", "LI.FI paths compared in real time", "step", 420, 70, 170),
        node("cctp", "Circle CCTP", "Native USDC burn and mint", "step", 614, 70, 170),
        node("settle", "Settlement", "Across Ethereum, Base, Arbitrum, Arc", "outcome", 814, 70, 176),
        node("agent", "Agent console", "System controls on their own surface", "sidecar", 214, 300, 170),
        node("sign", "Wallet signature", "User approves each execution", "human", 614, 300, 170),
      ],
      edges: [
        { from: "context", to: "intent" }, { from: "intent", to: "route" }, { from: "route", to: "cctp" }, { from: "cctp", to: "settle" },
        { from: "cctp", to: "sign", kind: "human", label: "approve" },
        { from: "agent", to: "intent", kind: "muted", quiet: true },
      ],
      legend: [{ kind: "flow", label: "Execution path" }, { kind: "human", label: "User approval" }, { kind: "muted", label: "Agent controls" }],
    },
    why: ["A user should understand what they hold before choosing what to move.", "Cross-chain transfers have several hops; showing them makes failures and costs understandable.", "Information, operation, and system control are different jobs with different risks."],
    role: [{ label: "Product", text: "Portfolio-to-execution workflow" }, { label: "Interface", text: "Portfolio, execute, and agent-console pages" }, { label: "Engineering", text: "CCTP and LI.FI routing components" }, { label: "Release", text: "Deployed public build and repository" }],
  },
};

// Capability map for the work hub: short, verifiable phrases only; "—" where a project makes no claim.
export const capabilityColumns = ["Project", "Product workflow", "Integrations", "Payments & settlement", "Automation", "Data & evidence"];
export const capabilityRows: Record<string, string[]> = {
  resolve: ["Evidence to funding decision", "Arc, wallets", "USDC settlement", "Funding workflow", "Structured contribution records"],
  meridian: ["Research to strategy", "Market data", "Optional, wallet-gated", "—", "Historical replay"],
  repodiet: ["Repository maintenance", "GitHub", "—", "Scoped cleanup, verification", "Signed receipts"],
  "agora-forge": ["Portfolio to execution", "Circle CCTP, LI.FI, Zerion, Covalent", "Cross-chain USDC", "Agent console", "Portfolio context"],
};
