import type { ReactNode } from "react";
import { guides, projectMedia, projects, serviceCopy, serviceFaqs, serviceFit, serviceProof, services, type Service } from "../content";
import { hubHeadings, hubSchema, serviceSchema } from "../schema";
import { ContextCta, Crumbs, HeroActions, REMOTE, Schema } from "../chrome";
import { Diagram, type DiagramSpec } from "../ui/Diagram";
import {
  BeforeAfter, Checklist, EngagementStrip, Faq, Funnel, Hero, Ledger, Lifecycle, Link, Matrix, ProofPanel, RelatedRail, RiskGrid,
  RoutingMap, ScopeBoard, Section, Signals, StackTable, type ProofItem,
} from "../ui/Blocks";
import {
  aiComparison, aiMap, aiRisks, apiMap, automationBeforeAfter, automationMap, automationSuitability, customBeforeAfter, customMap, customWhen,
  mvpBoard, mvpCycle, mvpVersus, proofWhy, rescueFunnel, rescueMap, rescueRisks, saasMap, saasScope, serviceStack, webMap, webStateLedger, webStates,
} from "../data/services";
import { apiContract, apiFailureModes, apiPatterns } from "../data/api";

const hostOf = (url: string) => new URL(url).host;
export function proofItems(slugs: string[], why: (slug: string) => string): ProofItem[] {
  return slugs.map(slug => {
    const project = projects.find(x => x.slug === slug)!, media = projectMedia[slug];
    return { slug, name: project.name, subtitle: project.subtitle, summary: project.description, relevance: why(slug), image: media.image, width: media.width, height: media.height, alt: media.alt, host: hostOf(project.live), tags: media.capabilities.slice(0, 3), live: project.live, code: project.code };
  });
}

const counter = () => { let n = 0; return () => String(++n).padStart(2, "0"); };
const processLabels: Record<string, string[]> = {
  "custom-software-development": ["Map", "Build", "Hand over"],
  "saas-development": ["Define", "Connect", "Ship"],
  "web-application-development": ["Model", "Build", "Validate"],
  "api-integration-development": ["Map", "Build", "Prove"],
  "business-automation": ["Observe", "Automate", "Measure"],
  "mvp-product-development": ["Hypothesis", "Build", "Learn"],
  "ai-application-development": ["Define", "Connect", "Evaluate"],
  "product-rescue": ["Reproduce", "Stabilize", "Verify"],
};

/** Band section that carries one of the pre-redesign workflow-map headings as its h2. */
function MapSection({ id, index, spec, intro }: { id: string; index: string; label?: string; spec: DiagramSpec; intro?: ReactNode }) {
  return <Section index={index} label={spec.eyebrow} title={spec.title} layout="band" intro={intro}>
    <Diagram id={id} spec={{ ...spec, title: undefined }} variant="band" />
  </Section>;
}

function BestFit({ items, spec = false }: { items: string[]; spec?: boolean }) {
  return <><p className="ab-eyebrow">Engagement fit</p><h2>Best fit for</h2>{spec ? <ul className="spec">{items.map(item => <li key={item}>{item}</li>)}</ul> : <ul>{items.map(item => <li key={item}>{item}</li>)}</ul>}</>;
}

/** Hero, page-specific middle, then the shared delivery / proof / approach / related / FAQ / CTA tail. */
function ServiceFrame({ service, aside, children, next, deliverablesInline = false }: { service: Service; aside: ReactNode; children: ReactNode; next: () => string; deliverablesInline?: boolean }) {
  const fit = serviceFit[service.slug], copy = serviceCopy[service.slug], labels = processLabels[service.slug];
  const proof = proofItems(serviceProof[service.slug], slug => proofWhy[service.slug][slug]);
  const relatedGuides = guides.filter(guide => guide.service === service.slug).slice(0, 3);
  return <>
    <Schema data={serviceSchema(service)} />
    <Crumbs items={[{ name: "Home", href: "/" }, { name: "Services", href: "/services/" }, { name: service.name }]} />
    <Hero variant="service" eyebrow={`Service / ${service.name}`} title={service.title} lede={<p>{service.description}</p>} actions={<HeroActions slug={service.slug} label={copy.ctaShort} />} aside={aside} />
    {children}
    {!deliverablesInline && <Section index={next()} label="Capabilities" title="What can be built"><Ledger variant="columns" items={service.deliverables.map(text => ({ text }))} /></Section>}
    <Section index={next()} label="Delivery" title="From scope to a working release">
      <EngagementStrip steps={fit.process.map((text, i) => ({ label: labels[i], text }))} note={<><h3>What you should have at handoff</h3><ul>{fit.outcomes.map(item => <li key={item}>{item}</li>)}</ul></>} />
    </Section>
    <Section index={next()} label="Proof" title="Relevant work" intro="Public builds with live products and source you can inspect. No private client metrics are claimed.">
      <div>{proof.map((item, i) => <ProofPanel key={item.slug} item={item} reverse={i % 2 === 1} />)}</div>
    </Section>
    <Section index={next()} label="Stack" title="Technical approach">
      <StackTable rows={serviceStack[service.slug]} />
      <div className="stk-note"><p>Projects commonly use TypeScript, Next.js, React, SQL-backed models, Supabase, Postgres, Prisma, REST APIs, webhooks, GitHub, and Vercel. The stack follows the workflow, security boundary, and maintenance need—not a generic checklist.</p><p>{REMOTE}</p></div>
    </Section>
    {relatedGuides.length > 0 && <RelatedRail title="Guides for this decision" items={relatedGuides.map(guide => ({ href: `/guides/${guide.slug}/`, kicker: guide.category, label: guide.title }))} />}
    <RelatedRail title="Related services" items={service.related.map(slug => { const item = services.find(x => x.slug === slug)!; return { href: `/services/${slug}/`, kicker: "Service", label: item.name }; })} />
    <Faq index={next()} heading={copy.faqHeading} items={serviceFaqs[service.slug]} />
    <ContextCta service={service.slug} />
  </>;
}

/* ---------------- Individual service compositions ---------------- */

function CustomSoftware({ service }: { service: Service }) {
  const next = counter();
  return <ServiceFrame service={service} next={next} aside={<BestFit items={serviceFit[service.slug].bestFor} />}>
    <Section index={next()} label="The problem" title="When the workflow has outgrown its tools" intro="Custom software earns its place when an important workflow is carried by spreadsheets, inboxes, and memory.">
      <BeforeAfter before={customBeforeAfter.before} after={customBeforeAfter.after} caption="The goal is not more software; it is one place where the workflow’s state, decisions, and history live." />
    </Section>
    <MapSection id="custom-map" index={next()} label="Workflow map" spec={customMap} />
    <Section index={next()} label="Build or buy" title="Keep the tool, or build the workflow?" intro={<>Buy the commodity layer; build what makes the workflow distinct. The <Link href="/guides/custom-software-vs-saas/">custom software vs SaaS guide</Link> covers lifetime cost and reversible first steps.</>}>
      <Matrix id="custom-when" variant="compare" columns={customWhen.columns} rows={customWhen.rows} caption="A hybrid is common: SaaS for authentication, payments, and email; custom for the workflow and data model." />
    </Section>
  </ServiceFrame>;
}

function Saas({ service }: { service: Service }) {
  const next = counter();
  return <ServiceFrame service={service} next={next} aside={<BestFit items={serviceFit[service.slug].bestFor} />}>
    <MapSection id="saas-map" index={next()} label="Product map" spec={saasMap} />
    <Section index={next()} label="Signals" title="Signs you are ready for a SaaS build"><Signals items={service.signals} /></Section>
    <Section index={next()} label="Scope" title="What the first release needs — and what can wait" intro={<>Scope follows the customer job, not a feature list. See <Link href="/guides/saas-mvp-development-cost/">what actually changes SaaS MVP scope</Link>.</>}>
      <Matrix id="saas-scope" variant="compare" columns={saasScope.columns} rows={saasScope.rows} caption="Each “later” item is added when real usage shows the need, not before." />
    </Section>
  </ServiceFrame>;
}

function WebApp({ service }: { service: Service }) {
  const next = counter();
  return <ServiceFrame service={service} next={next} aside={<BestFit items={serviceFit[service.slug].bestFor} />}>
    <MapSection id="web-map" index={next()} label="Architecture" spec={webMap} />
    <Section index={next()} label="States" title={webStates.title!} layout="wide" intro="Most of a web application’s quality lives outside the happy path.">
      <Diagram id="web-states" spec={{ ...webStates, title: undefined }} />
      <Ledger variant="columns" items={webStateLedger.map(item => ({ title: item.title, text: item.text }))} />
    </Section>
    <Section index={next()} label="Signals" title="Signs you need a web application, not a website"><Signals items={service.signals} /></Section>
  </ServiceFrame>;
}

function ApiIntegration({ service }: { service: Service }) {
  const next = counter();
  return <ServiceFrame service={service} next={next} aside={<><p className="ab-eyebrow">integration.fit</p><h2>Best fit for</h2><ul className="spec">{serviceFit[service.slug].bestFor.map(item => <li key={item}>{item}</li>)}</ul></>}>
    <MapSection id="api-map" index={next()} label="Integration boundary" spec={apiMap} />
    <Section index={next()} label="Failure modes" title="How each failure is detected and recovered" layout="wide" tone="fail" intro="An integration is only as good as its worst day. These are the failure modes planned for before launch, not discovered after it.">
      <Matrix id="api-failures" variant="failure" columns={apiFailureModes.columns} rows={apiFailureModes.rows} caption="Red: data can be lost or corrupted without handling. Amber: degraded or delayed. Green: safe by design once idempotency is in place." />
    </Section>
    <Section index={next()} label="Sync patterns" title="Webhook, polling, or event queue?" intro={<>Many integrations combine them — webhooks for speed, polling or reconciliation for completeness. The <Link href="/guides/api-integration-planning/">API integration planning guide</Link> covers the decision in detail.</>}>
      <Matrix id="api-patterns" variant="compare" columns={apiPatterns.columns} rows={apiPatterns.rows} caption="Choose per provider and per record type; the source of truth decides which pattern wins a conflict." />
    </Section>
    <Section index={next()} label="Before code" title="Integration contract checklist" intro="Agreed in writing before the first request is sent.">
      <Checklist columns items={apiContract} />
    </Section>
  </ServiceFrame>;
}

function Automation({ service }: { service: Service }) {
  const next = counter();
  return <ServiceFrame service={service} next={next} aside={<BestFit items={serviceFit[service.slug].bestFor} />}>
    <Section index={next()} label="Before / after" title="From chasing messages to one visible workflow">
      <BeforeAfter before={automationBeforeAfter.before} after={automationBeforeAfter.after} />
    </Section>
    <MapSection id="automation-map" index={next()} label="Control flow" spec={automationMap} />
    <Section index={next()} label="Suitability" title="What to automate first" layout="wide" intro="Frequency and rule clarity make a task a good candidate; the cost of a wrong step decides how much a person stays involved.">
      <Matrix id="automation-fit" variant="levels" columns={automationSuitability.columns} rows={automationSuitability.rows} caption="Qualitative starting points, confirmed against the real workflow and its exceptions." />
    </Section>
  </ServiceFrame>;
}

function Mvp({ service }: { service: Service }) {
  const next = counter();
  return <ServiceFrame service={service} next={next} aside={<BestFit items={serviceFit[service.slug].bestFor} />}>
    <Section index={next()} label="Learning loop" title="The MVP learning loop" layout="band" intro="The release is small, but the chosen workflow is complete enough to generate real evidence.">
      <Lifecycle id="mvp" stages={mvpCycle.stages} center={mvpCycle.center} caption="Each pass through the loop ends in a decision: continue, change the scope, or stop." />
    </Section>
    <Section index={next()} label="Definitions" title="Prototype, MVP, or production product?" intro={<>The difference is what the release must prove. The <Link href="/guides/startup-mvp-development/">startup MVP guide</Link> goes deeper.</>}>
      <Matrix id="mvp-versus" variant="compare" spectrum={["Show", "Serve"]} columns={mvpVersus.columns} rows={mvpVersus.rows} />
    </Section>
    <Section index={next()} label="Scope" title="Now, later, never" intro="Scope is a decision about evidence. Everything in “now” is required for the first user to finish the core workflow.">
      <ScopeBoard columns={mvpBoard} />
    </Section>
  </ServiceFrame>;
}

function Ai({ service }: { service: Service }) {
  const next = counter();
  return <ServiceFrame service={service} next={next} aside={<BestFit items={serviceFit[service.slug].bestFor} />}>
    <MapSection id="ai-map" index={next()} label="System map" spec={aiMap} />
    <Section index={next()} label="Signals" title="Signs a workflow is ready for AI"><Signals items={service.signals} /></Section>
    <Section index={next()} label="Autonomy" title="Automation, AI-assisted workflow, or agent?" intro={<>Most products need less autonomy than a demo suggests. Pick the least autonomous option that does the job — the <Link href="/guides/ai-feature-vs-automation/">AI feature vs automation guide</Link> walks through the decision.</>}>
      <Matrix id="ai-compare" variant="compare" spectrum={["More deterministic", "More autonomous"]} columns={aiComparison.columns} rows={aiComparison.rows} caption="Start from the left; move right only when the task genuinely needs it." />
    </Section>
    <Section index={next()} label="Failure and control" title="What can go wrong, and what controls it" layout="wide" tone="fail" intro="Every AI feature has failure modes. The product design decides whether they stay contained.">
      <Matrix id="ai-risks" variant="failure" columns={aiRisks.columns} rows={aiRisks.rows} caption="Controls are designed before release and verified with the evaluation set." />
    </Section>
  </ServiceFrame>;
}

function Rescue({ service }: { service: Service }) {
  const next = counter();
  return <ServiceFrame service={service} next={next} aside={<><p className="ab-eyebrow">Symptoms we start from</p><h2>Best fit for</h2><ul>{serviceFit[service.slug].bestFor.map(item => <li key={item}>{item}</li>)}</ul></>}>
    <Section index={next()} label="Signals" title="Signs the product needs a rescue" tone="fail"><Signals items={service.signals} /></Section>
    <MapSection id="rescue-map" index={next()} label="Rescue pipeline" spec={rescueMap} />
    <Section index={next()} label="Triage" title="From everything reported to what gets fixed first" intro="Most rescue backlogs are too long to act on. Triage narrows them with evidence.">
      <Funnel stages={rescueFunnel} caption="Nothing is dropped: work outside the funnel moves to the ranked recovery plan." />
    </Section>
    <Section index={next()} label="Risk" title="Where fragile products usually break" intro={<>Typical starting placement; every rescue re-ranks from reproduced evidence. The <Link href="/guides/rescue-ai-built-web-app/">AI-built app rescue guide</Link> covers the method step by step.</>}>
      <RiskGrid items={rescueRisks} />
    </Section>
  </ServiceFrame>;
}

const compositions: Record<string, (props: { service: Service }) => ReactNode> = {
  "custom-software-development": CustomSoftware, "saas-development": Saas, "web-application-development": WebApp, "api-integration-development": ApiIntegration,
  "business-automation": Automation, "mvp-product-development": Mvp, "ai-application-development": Ai, "product-rescue": Rescue,
};

export function ServicePage({ service }: { service: Service }) {
  const Page = compositions[service.slug];
  return <Page service={service} />;
}

/* ---------------- Services hub: problem → service routing ---------------- */

const groups: Record<string, string> = {
  "custom-software-development": "Build", "saas-development": "Build", "web-application-development": "Build", "mvp-product-development": "Build",
  "api-integration-development": "Connect", "business-automation": "Connect", "ai-application-development": "AI", "product-rescue": "Rescue",
};
const routes = [
  { id: "spreadsheet", label: "A spreadsheet or inbox runs a key workflow", detail: "Shared state, approvals, and handoffs live in messages", to: ["custom-software-development", "business-automation"] },
  { id: "product", label: "Customers need to sign in and get a job done", detail: "Accounts, roles, records, and an operator view", to: ["saas-development"] },
  { id: "dashboard", label: "A data-heavy dashboard or portal", detail: "Several states, users, permissions, or data sources", to: ["web-application-development"] },
  { id: "idea", label: "An idea needs a first real release", detail: "One complete workflow real users can try", to: ["mvp-product-development"] },
  { id: "systems", label: "Two systems must stay in sync", detail: "Webhooks, APIs, payments, or copy-paste today", to: ["api-integration-development"] },
  { id: "ai", label: "AI should help inside a real workflow", detail: "Model reasoning with tools, review, and control", to: ["ai-application-development"] },
  { id: "fragile", label: "It works in the demo, fails in real use", detail: "Unstable, inherited, or AI-built code", to: ["product-rescue"] },
];
const routeServiceOrder = ["custom-software-development", "business-automation", "saas-development", "web-application-development", "mvp-product-development", "api-integration-development", "ai-application-development", "product-rescue"];

export function ServicesHub() {
  const next = counter();
  const byGroup = ["Build", "Connect", "AI", "Rescue"].map(group => ({ group, items: services.filter(service => groups[service.slug] === group) }));
  return <>
    <Schema data={hubSchema("services")} />
    <Crumbs items={[{ name: "Home", href: "/" }, { name: "Services" }]} />
    <Hero variant="hub" eyebrow="Services" title={hubHeadings.services} lede={<p>From an early idea, existing product, broken workflow, or difficult feature to tested, deployed software with clear ownership and handoff.</p>} />
    <Section index={next()} label="Find your service" title="Start from the problem, not the service name" layout="wide" intro="Hover or focus a problem to see where it leads; select it to jump to the matching service.">
      <RoutingMap id="service-routes" problems={routes} services={routeServiceOrder.map(slug => ({ id: slug, label: services.find(s => s.slug === slug)!.name, href: `/services/${slug}/`, group: groups[slug] }))} />
    </Section>
    <Section index={next()} label="All services" title="Eight ways to get the workflow working" layout="wide">
      <div className="svc-index">{byGroup.map(({ group, items }) => <div key={group} className="svc-index__group">
        <p className="svc-index__label">{group}</p>
        <ul>{items.map(service => <li key={service.slug}><Link href={`/services/${service.slug}/`} className="svc-index__row"><span className="svc-index__name">{service.name}</span><span className="svc-index__desc">{service.description}</span><b>Explore {serviceCopy[service.slug].displayName} ↗</b></Link></li>)}</ul>
      </div>)}</div>
    </Section>
    <Section index={next()} label="Ownership" title="What I can take ownership of" intro={<p>Product scoping, UX, frontend, backend, APIs, authentication, databases, integrations, automation, testing, debugging, deployment, and a practical handoff can be planned as one connected engagement.</p>} />
    <Section index={next()} label="Engagement" title="Remote product development" intro={<p>International work uses a clear path: discovery → scope → build → review → test → deploy. Written requirements, asynchronous progress, scheduled reviews, repository ownership, and acceptance criteria keep the work visible.</p>}>
      <EngagementStrip steps={[["Discovery", "The user, the workflow, and what must be true at launch"], ["Scope", "A written boundary with acceptance conditions"], ["Build", "Working software against real data, in your repository"], ["Review", "Preview deployments you can click through"], ["Test", "Critical path and failure states verified"], ["Deploy", "Release, documentation, and handoff"]].map(([label, text]) => ({ label, text }))} />
    </Section>
    <ContextCta source="services" />
  </>;
}
