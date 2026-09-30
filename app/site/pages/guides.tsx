import type { ReactNode } from "react";
import { guideSources, guides, projects, services, type Guide } from "../content";
import { guideSchema, hubHeadings, hubSchema } from "../schema";
import { Author, ContextCta, Crumbs, Schema } from "../chrome";
import { Diagram, type DiagramSpec } from "../ui/Diagram";
import { Checklist, DecisionTree, EngagementStrip, Funnel, Link, Matrix, ProofStrip, RelatedRail, ScopeBoard, Sequence, slugify } from "../ui/Blocks";
import Scorecard from "../ui/Scorecard";
import * as G from "../data/guides";
import CodeBlock from "../ui/CodeBlock";
import GuideToc from "../ui/GuideToc";
import { proofItems } from "./services";
import { proofWhy } from "../data/services";
import {
  idempotencySql, signatureCode, webhookChecklist, webhookFailureScenarios, webhookMistakes, webhookOutage, webhookSequence, webhookSources,
} from "../data/webhook";

export const sectionId = slugify;
const longDate = (iso: string) => iso === "2026-09-27" ? "September 27, 2026" : "September 24, 2026";

type ShellProps = {
  guide: Guide; kind: string; toc: { id: string; label: string }[]; words: string[]; children: ReactNode;
  cta: { eyebrow: string; heading: string; text: string; label?: string }; minRead?: number; feature?: ReactNode;
};

/** Article frame shared by every guide: byline, sticky TOC with progress, body, proof, related reading, author, contextual CTA. */
export function GuideShell({ guide, kind, toc, words, children, cta, minRead = 4, feature }: ShellProps) {
  const published = guide.published || "2026-09-24";
  const service = services.find(item => item.slug === guide.service)!;
  const related = guides.filter(item => item.slug !== guide.slug && (item.service === guide.service || item.category === guide.category)).slice(0, 3);
  const proof = proofItems(guide.proof, slug => proofWhy[guide.service]?.[slug] ?? projects.find(p => p.slug === slug)!.description);
  const readingTime = Math.max(minRead, Math.round([guide.intro, ...guide.sections.map(([, text]) => text), ...words].join(" ").split(/\s+/).length / 200));
  const articleId = `${guide.slug}-article`;
  return <>
    <Schema data={guideSchema(guide)} />
    <Crumbs items={[{ name: "Home", href: "/" }, { name: "Guides", href: "/guides/" }, { name: guide.title }]} />
    <article id={articleId}>
      <header className="pg-hero pg-hero--guide">
        <div className="pg-hero__copy">
          <p className="ab-eyebrow">{guide.category} / {kind}</p>
          <h1>{guide.title}<span className="pg-hero__dot">.</span></h1>
          <div className="pg-hero__lede"><p>{guide.description}</p></div>
          <p className="pg-hero__meta">By Muhammad Abdullah · Published {longDate(published)} · Updated September 27, 2026 · {readingTime} min read</p>
        </div>
      </header>
      {feature && <div className="band band--grid guide-feature"><div className="band__inner">{feature}</div></div>}
      <div className="article">
        <GuideToc items={toc} articleId={articleId} />
        <div className="article__body">
          <p className="article__lede">{guide.intro}</p>
          {children}
          <section id="see-the-approach-in-working-products">
            <h2>See the approach in working products</h2>
            <ProofStrip items={proof} />
          </section>
          <RelatedRail title="Continue this topic" items={[
            { href: `/services/${service.slug}/`, kicker: "Service", label: service.name },
            ...related.map(item => ({ href: `/guides/${item.slug}/`, kicker: item.category, label: item.title })),
          ]} />
          <Author />
        </div>
      </div>
    </article>
    <ContextCta service={service.slug} eyebrow={cta.eyebrow} heading={cta.heading} text={cta.text} label={cta.label} />
  </>;
}

/** One of the guide's own content sections: preserved heading + paragraph, then page-specific visuals. */
export function GuideSection({ entry, children }: { entry: [string, string]; children?: ReactNode }) {
  return <section id={sectionId(entry[0])}><h2>{entry[0]}</h2><p>{entry[1]}</p>{children}</section>;
}
export function ExtraSection({ title, children }: { title: string; children: ReactNode }) {
  return <section id={sectionId(title)}><h2>{title}</h2>{children}</section>;
}
export const tocFor = (guide: Guide, extras: string[]) => [...guide.sections.map(([heading]) => heading), ...extras].map(label => ({ id: sectionId(label), label }));

/* ---------------- Reliable webhook integration ---------------- */

const webhookLifecycle: DiagramSpec = {
  eyebrow: "Event lifecycle", title: "Every event has a visible state", height: 440,
  caption: "Success, failure, and recovery paths all end in a recorded state — nothing disappears.",
  nodes: [
    { id: "received", label: "received", detail: "Recorded under a unique event ID", kind: "store", x: 10, y: 50, w: 180, h: 100 },
    { id: "processing", label: "processing", detail: "Claimed by one worker", kind: "step", x: 270, y: 50, w: 180, h: 100 },
    { id: "processed", label: "processed", detail: "Change applied in the same transaction", kind: "outcome", x: 530, y: 50, w: 180, h: 100 },
    { id: "failed", label: "failed", detail: "Error and attempt count stored", kind: "fail", x: 530, y: 290, w: 180, h: 100 },
    { id: "retry", label: "retry scheduled", detail: "Exponential backoff with jitter", kind: "queue", x: 270, y: 290, w: 160, h: 100 },
    { id: "dead", label: "dead_letter", detail: "After the maximum attempts", kind: "fail", x: 790, y: 290, w: 190, h: 100 },
    { id: "replay", label: "operator replay", detail: "One event or a batch, after the fix", kind: "human", x: 790, y: 50, w: 190, h: 100 },
  ],
  edges: [
    { from: "received", to: "processing" }, { from: "processing", to: "processed" },
    { from: "processing", to: "failed", kind: "fail", label: "error", fromSide: "bottom", fromShift: 45, toSide: "left" },
    { from: "failed", to: "retry", kind: "retry" },
    { from: "retry", to: "processing", kind: "retry", label: "attempt + 1", fromSide: "top", fromShift: -35, toSide: "bottom", toShift: -45 },
    { from: "retry", to: "dead", kind: "fail", route: "below", depth: 28, label: "max attempts" },
    { from: "dead", to: "replay", kind: "human", label: "after fix" },
    { from: "replay", to: "processing", kind: "human", route: "above", depth: 30, label: "replay" },
  ],
  legend: [{ kind: "flow", label: "Success path" }, { kind: "retry", label: "Retry path" }, { kind: "fail", label: "Failure" }, { kind: "human", label: "Operator recovery" }],
};

function OrderSwap() {
  return <figure className="swap" aria-label="Events sent in one order and received in the other">
    <div><p className="ab-eyebrow">Sent by the provider</p><ol><li><code>subscription.created</code></li><li><code>subscription.updated → active</code></li></ol></div>
    <span className="swap__x" aria-hidden="true">⤨</span>
    <div><p className="ab-eyebrow swap__warn">Received by you</p><ol><li><code>subscription.updated → active</code></li><li><code>subscription.created</code></li></ol></div>
    <figcaption>Delivered in the opposite order. Compare the object’s version or <code>updated</code> time with what you stored: ignore older events, and fetch the object from the provider API when it does not exist locally yet.</figcaption>
  </figure>;
}

export function WebhookGuide({ guide }: { guide: Guide }) {
  const [verify, idempotent, reorder, recovery] = guide.sections;
  const extras = ["Handle provider outages", "Failure scenarios", "Implementation checklist", "Common webhook mistakes", "Primary references"];
  return <GuideShell guide={guide} kind="Engineering guide" minRead={6} toc={tocFor(guide, extras)}
    words={[...webhookOutage, ...webhookChecklist, ...webhookMistakes, signatureCode, idempotencySql]}
    cta={{ eyebrow: "WEBHOOK REVIEW", heading: "Need a webhook integration built or reviewed?", text: "Share the provider, what is failing or missing, and how events reach your system today. I’ll help map the verification, idempotency, and recovery path.", label: "Start an API integration development inquiry" }}>
    <div className="article__wide">
      <Sequence id="webhook-sequence" actors={webhookSequence.actors} messages={webhookSequence.messages} caption="Solid: request path. Dashed: responses and async hand-offs. Red: rejection and retry. Violet: operator action." />
    </div>
    <GuideSection entry={verify}>
      <CodeBlock filename="app/api/webhooks/route.ts" language="TypeScript" code={signatureCode} />
      <p className="footnote">Header names and the exact signed string differ by provider. Where the provider ships an SDK helper — for example Stripe’s <code>constructEvent</code> — use it instead of hand-rolled verification.</p>
    </GuideSection>
    <GuideSection entry={idempotent}>
      <CodeBlock filename="webhook_events.sql" language="PostgreSQL" code={idempotencySql} />
      <p className="footnote">Apply the business change and mark the row <code>processed</code> in the same transaction, or make the downstream write idempotent too; otherwise a crash between the two can still double-apply.</p>
    </GuideSection>
    <GuideSection entry={reorder}><OrderSwap /></GuideSection>
    <GuideSection entry={recovery}>
      <div className="article__wide"><Diagram id="webhook-lifecycle" spec={webhookLifecycle} /></div>
      <h3>Retry and backoff</h3>
      <EngagementStrip steps={[["Attempt 1", "On delivery"], ["Attempt 2", "After about 1 minute"], ["Attempt 3", "After about 5 minutes"], ["Attempt 4", "After about 30 minutes"], ["Attempt 5", "After about 2 hours, then dead-letter"]].map(([label, text]) => ({ label, text }))} />
      <p className="footnote">An example schedule, not a rule — add jitter, and tune the numbers to the provider’s own retry window.</p>
    </GuideSection>
    <ExtraSection title="Handle provider outages">{webhookOutage.map(text => <p key={text}>{text}</p>)}</ExtraSection>
    <ExtraSection title="Failure scenarios"><Matrix id="webhook-scenarios" variant="failure" columns={webhookFailureScenarios.columns} rows={webhookFailureScenarios.rows} caption="Each scenario maps to a control in the checklist below." /></ExtraSection>
    <ExtraSection title="Implementation checklist"><Checklist items={webhookChecklist} /></ExtraSection>
    <ExtraSection title="Common webhook mistakes"><Checklist tone="cross" items={webhookMistakes} /></ExtraSection>
    <ExtraSection title="Primary references"><p>Provider behavior changes; check these before relying on a specific number.</p><ul className="refs">{webhookSources.map(source => <li key={source.href}><a href={source.href}>{source.label} ↗</a></li>)}</ul></ExtraSection>
  </GuideShell>;
}


/* ---------------- Shared tail for buyer guides ---------------- */

function Tail({ guide, checklist, mistakes }: { guide: Guide; checklist: string[]; mistakes: string[] }) {
  const sources = guideSources[guide.slug] || [];
  return <>
    <ExtraSection title="Decision checklist"><Checklist items={checklist} /></ExtraSection>
    <ExtraSection title="Common mistakes"><Checklist tone="cross" items={mistakes} /></ExtraSection>
    {sources.length > 0 && <ExtraSection title="Primary references"><p>These official resources support the implementation details and should be checked again when provider behavior changes.</p><ul className="refs">{sources.map(source => <li key={source.href}><a href={source.href}>{source.label} ↗</a></li>)}</ul></ExtraSection>}
  </>;
}
const tailToc = (guide: Guide) => ["Decision checklist", "Common mistakes", ...((guideSources[guide.slug] || []).length ? ["Primary references"] : [])];
const cta = (heading: string, text: string) => ({ eyebrow: "PROJECT INQUIRY", heading, text });

function HireSaas({ guide }: { guide: Guide }) {
  const [job, boundary, evidence, release] = guide.sections;
  return <GuideShell guide={guide} kind="Buyer guide" toc={tocFor(guide, ["SaaS developer scorecard", ...tailToc(guide)])} words={[...G.saasScorecard.map(c => c.question + c.evidence), ...G.saasHireChecklist]}
    cta={cta("Evaluating a SaaS build?", "Share the customer job, what exists today, and the release you need. I’ll walk through the scorecard with your project in mind.")}>
    <GuideSection entry={job} /><GuideSection entry={boundary} /><GuideSection entry={evidence} /><GuideSection entry={release} />
    <ExtraSection title="SaaS developer scorecard"><p>Rate each area as you talk to candidates. Ratings stay in your browser; nothing is sent anywhere.</p><div className="article__wide"><Scorecard criteria={G.saasScorecard} /></div></ExtraSection>
    <Tail guide={guide} checklist={G.saasHireChecklist} mistakes={G.saasHireMistakes} />
  </GuideShell>;
}

function HireWebApp({ guide }: { guide: Guide }) {
  const [flow, stack, integration, handoff] = guide.sections;
  return <GuideShell guide={guide} kind="Buyer guide" toc={tocFor(guide, ["Competency matrix", ...tailToc(guide)])} words={G.webCompetency.rows.flatMap(r => r.cells)}
    cta={cta("Hiring for a web application?", "Share the user flow, the systems it touches, and what must work at launch.")}>
    <GuideSection entry={flow} /><GuideSection entry={stack} /><GuideSection entry={integration} /><GuideSection entry={handoff} />
    <ExtraSection title="Competency matrix"><p>What to ask for in an interview, and what a strong or weak answer looks like.</p><Matrix id="web-competency" variant="compare" columns={G.webCompetency.columns} rows={G.webCompetency.rows} /></ExtraSection>
    <Tail guide={guide} checklist={G.webHireChecklist} mistakes={G.webHireMistakes} />
  </GuideShell>;
}

function StartupMvp({ guide }: { guide: Guide }) {
  const [hypothesis, workflow, data, demo] = guide.sections;
  return <GuideShell guide={guide} kind="Planning guide" toc={tocFor(guide, ["Now, next, later", ...tailToc(guide)])} words={G.mvpNowNextLater.flatMap(c => c.items)}
    cta={cta("Planning a first release?", "Share the hypothesis, the first audience, and the workflow you want to test.")}>
    <GuideSection entry={hypothesis}><Funnel stages={G.mvpHypothesis} caption="Each layer narrows the release; the last one is what you will actually measure." /></GuideSection>
    <GuideSection entry={workflow} /><GuideSection entry={data} /><GuideSection entry={demo} />
    <ExtraSection title="Now, next, later"><ScopeBoard columns={G.mvpNowNextLater} /></ExtraSection>
    <Tail guide={guide} checklist={G.mvpGuideChecklist} mistakes={G.mvpGuideMistakes} />
  </GuideShell>;
}

function BuildOrBuy({ guide }: { guide: Guide }) {
  const [fit, cost, commodity, reversible] = guide.sections;
  return <GuideShell guide={guide} kind="Decision guide" toc={tocFor(guide, ["Build-or-buy decision matrix", ...tailToc(guide)])} words={G.buildBuyChecklist}
    feature={<DecisionTree id="build-buy" title="Build, buy, or both?" root={G.buildBuyTree} caption="A starting filter — confirm the choice against the actual workflow and constraints." />}
    cta={cta("Deciding whether to build?", "Share the workflow, the tools you use today, and where the workarounds hurt.")}>
    <GuideSection entry={fit} /><GuideSection entry={cost} /><GuideSection entry={commodity} /><GuideSection entry={reversible} />
    <ExtraSection title="Build-or-buy decision matrix"><Matrix id="build-buy-matrix" variant="compare" columns={G.buildBuyMatrix.columns} rows={G.buildBuyMatrix.rows} caption="Use this as a starting filter, then confirm the choice against the actual workflow and constraints." /></ExtraSection>
    <Tail guide={guide} checklist={G.buildBuyChecklist} mistakes={G.buildBuyMistakes} />
  </GuideShell>;
}

function MvpCost({ guide }: { guide: Guide }) {
  const [workflow, accounts, integrations, estimate] = guide.sections;
  return <GuideShell guide={guide} kind="Scope guide" toc={tocFor(guide, ["What changes SaaS MVP scope", ...tailToc(guide)])} words={G.costChecklist}
    cta={cta("Need a scope before a number?", "Share the customer journey, roles, and integrations. I’ll help turn them into observable outcomes you can estimate.")}>
    <GuideSection entry={workflow} /><GuideSection entry={accounts} /><GuideSection entry={integrations} /><GuideSection entry={estimate} />
    <ExtraSection title="What changes SaaS MVP scope"><p>Relative effect on scope, not prices. Every product lands differently on each row.</p><Matrix id="cost-drivers" variant="levels" columns={G.costDrivers.columns} rows={G.costDrivers.rows} caption="LOW / MEDIUM / HIGH show relative scope impact when the higher-complexity option is chosen." /></ExtraSection>
    <Tail guide={guide} checklist={G.costChecklist} mistakes={G.costMistakes} />
  </GuideShell>;
}

function ApiPlanning({ guide }: { guide: Guide }) {
  const [contract, auth, failures, operations] = guide.sections;
  return <GuideShell guide={guide} kind="Engineering guide" toc={tocFor(guide, ["Integration readiness checklist", ...tailToc(guide)])} words={G.apiReadiness}
    feature={<Diagram id="contract-map" spec={G.contractMap} variant="band" />}
    cta={cta("Planning an integration?", "Share the systems involved, who owns each record today, and what happens when something fails.")}>
    <GuideSection entry={contract}><Matrix id="source-of-truth" variant="compare" columns={G.sourceOfTruth.columns} rows={G.sourceOfTruth.rows} caption="An illustrative mapping — write your own before the first request is sent." /></GuideSection>
    <GuideSection entry={auth} /><GuideSection entry={failures} /><GuideSection entry={operations} />
    <ExtraSection title="Integration readiness checklist"><Checklist items={G.apiReadiness} /></ExtraSection>
    <Tail guide={guide} checklist={G.apiReadiness.slice(0, 5)} mistakes={G.apiMistakes} />
  </GuideShell>;
}

function RescueGuide({ guide }: { guide: Guide }) {
  const [freeze, evidence, boundaries, release] = guide.sections;
  return <GuideShell guide={guide} kind="Rescue guide" toc={tocFor(guide, ["Symptom, cause, test, response", ...tailToc(guide)])} words={G.symptomTable.rows.flatMap(r => r.cells)}
    feature={<><p className="ab-eyebrow">Rescue sequence</p><h2 className="tree__title">Four steps, in this order</h2><EngagementStrip steps={G.rescueSteps} /></>}
    cta={cta("Inherited a fragile app?", "Share what fails, how it is deployed today, and the one workflow that has to work.")}>
    <GuideSection entry={freeze} /><GuideSection entry={evidence} /><GuideSection entry={boundaries} /><GuideSection entry={release} />
    <ExtraSection title="Symptom, cause, test, response"><Matrix id="symptoms" variant="failure" columns={G.symptomTable.columns} rows={G.symptomTable.rows} caption="Confirm the cause with the test before changing code." /></ExtraSection>
    <Tail guide={guide} checklist={G.rescueChecklist} mistakes={G.rescueMistakes} />
  </GuideShell>;
}

function AiVsAutomation({ guide }: { guide: Guide }) {
  const [classify, bounded, evaluate, recovery] = guide.sections;
  return <GuideShell guide={guide} kind="Architecture guide" toc={tocFor(guide, ["Architecture choice matrix", ...tailToc(guide)])} words={G.aiChecklist}
    feature={<DecisionTree id="ai-tree" title="Automation, AI feature, or agent?" root={G.aiTree} />}
    cta={cta("Choosing between AI and automation?", "Share the task, its inputs, and what a wrong result would cost.")}>
    <GuideSection entry={classify} /><GuideSection entry={bounded}><Matrix id="ai-factors" variant="levels" columns={G.aiFactors.columns} rows={G.aiFactors.rows} /></GuideSection>
    <GuideSection entry={evaluate} /><GuideSection entry={recovery} />
    <ExtraSection title="Architecture choice matrix"><Matrix id="ai-arch" variant="compare" columns={G.aiArchMatrix.columns} rows={G.aiArchMatrix.rows} caption="Use this as a starting filter, then confirm the choice against the actual workflow and constraints." /></ExtraSection>
    <Tail guide={guide} checklist={G.aiChecklist} mistakes={G.aiMistakes} />
  </GuideShell>;
}

const guideCompositions: Record<string, (props: { guide: Guide }) => ReactNode> = {
  "hire-saas-developer": HireSaas, "hire-web-app-developer": HireWebApp, "startup-mvp-development": StartupMvp, "custom-software-vs-saas": BuildOrBuy,
  "saas-mvp-development-cost": MvpCost, "api-integration-planning": ApiPlanning, "rescue-ai-built-web-app": RescueGuide, "ai-feature-vs-automation": AiVsAutomation,
  "reliable-webhook-integration": WebhookGuide,
};
export function GuidePage({ guide }: { guide: Guide }) {
  const Page = guideCompositions[guide.slug];
  return <Page guide={guide} />;
}

/* ---------------- Guides hub: topic clusters ---------------- */

const clusters = [
  { label: "Hiring", service: "saas-development", guides: ["hire-saas-developer", "hire-web-app-developer"] },
  { label: "MVP and scope", service: "mvp-product-development", guides: ["startup-mvp-development", "saas-mvp-development-cost"] },
  { label: "Build or buy", service: "custom-software-development", guides: ["custom-software-vs-saas"] },
  { label: "Integrate", service: "api-integration-development", guides: ["api-integration-planning", "reliable-webhook-integration"] },
  { label: "AI", service: "ai-application-development", guides: ["ai-feature-vs-automation"] },
  { label: "Rescue", service: "product-rescue", guides: ["rescue-ai-built-web-app"] },
];

export function GuidesHub() {
  return <>
    <Schema data={hubSchema("guides")} />
    <Crumbs items={[{ name: "Home", href: "/" }, { name: "Guides" }]} />
    <header className="pg-hero pg-hero--hub"><div className="pg-hero__copy">
      <p className="ab-eyebrow">Guides</p>
      <h1>{hubHeadings.guides}<span className="pg-hero__dot">.</span></h1>
      <div className="pg-hero__lede"><p>Decision-focused guidance for hiring, scoping, reviewing, and shipping software products.</p></div>
      <nav className="cluster-nav" aria-label="Guide topics">{clusters.map(c => <a key={c.label} href={`#${slugify(c.label)}`}>{c.label}</a>)}</nav>
    </div></header>
    <div className="clusters">
      {clusters.map((cluster, ci) => {
        const service = services.find(s => s.slug === cluster.service)!;
        return <section key={cluster.label} id={slugify(cluster.label)} className="cluster" aria-labelledby={`${slugify(cluster.label)}-h`}>
          <div className="cluster__head"><span className="cluster__n">{String(ci + 1).padStart(2, "0")}</span><h2 id={`${slugify(cluster.label)}-h`}>{cluster.label}</h2><Link href={`/services/${service.slug}/`} className="cluster__svc">Related service: {service.name} →</Link></div>
          <ul>{cluster.guides.map(slug => { const g = guides.find(x => x.slug === slug)!; return <li key={slug}><Link href={`/guides/${slug}/`} className="cluster__guide"><small>{g.category}</small><span>{g.title}</span><p>{g.description}</p><b>Read the guide ↗</b></Link></li>; })}</ul>
        </section>;
      })}
    </div>
    <ContextCta source="guides" />
  </>;
}
