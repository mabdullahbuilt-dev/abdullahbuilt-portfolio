/* eslint-disable @next/next/no-img-element -- author portrait is a fixed-size asset */
import NextLink from "next/link";
import type { ReactNode } from "react";
import CodeBlock from "./CodeBlock";
import StickySectionNav from "./StickySectionNav";
import {
  CapabilityGrid, CaseStudyCard, DataTable, FaqList, OrderTimeline, PageHero, ProofLedger, SectionHead, SequenceDiagram,
  StepFlow, SystemSchematic, TechnicalCallout, TechStack, BranchFlow, type ProofItem,
} from "./VisualSystem";
import {
  aiComparison, aiRisks, aiSchematic, aiStack, aiTimeline, apiContract, apiFailureModes, apiPatterns, apiSchematic, apiStack, apiTimeline,
  idempotencySql, sectionId, signatureCode, webhookChecklist, webhookFailureScenarios, webhookMistakes, webhookOutage, webhookSequence, webhookSources,
} from "./pilotContent";

const BOOKING = "https://cal.com/muhammad-abdullah-built/idea-to-product";
const Link = (props: React.ComponentProps<typeof NextLink>) => <NextLink prefetch={false} {...props} />;

type ServiceProps = {
  service: { slug: string; name: string; title: string; description: string; deliverables: string[] };
  copy: { ctaShort: string; faqHeading: string };
  fit: { bestFor: string[]; outcomes: string[] };
  faqs: { q: string; a: string }[];
  proof: (ProofItem & { systems: string[] })[];
  relatedGuides: { slug: string; title: string }[];
  relatedServices: { slug: string; name: string }[];
  frame: { schema: ReactNode; crumbs: ReactNode; cta: ReactNode };
};

function HeroActions({ slug, label }: { slug: string; label: string }) {
  return <><Link className="seo-button" href={`/contact/?service=${slug}`} data-event="service_cta_click" data-service={slug}>{label} <span>→</span></Link><a className="seo-text-link" href={BOOKING} data-event="book_call_click">Book a 15-minute fit call ↗</a></>;
}

function RelatedLinks({ guides, services, guideHeading }: { guides: { slug: string; title: string }[]; services: { slug: string; name: string }[]; guideHeading: string }) {
  return <section className="ab-related">
    {guides.length > 0 && <div><h2>{guideHeading}</h2><ul>{guides.map(guide => <li key={guide.slug}><Link href={`/guides/${guide.slug}/`}>{guide.title}<span aria-hidden="true">↗</span></Link></li>)}</ul></div>}
    <div><h2>Related services</h2><ul>{services.map(item => <li key={item.slug}><Link href={`/services/${item.slug}/`}>{item.name}<span aria-hidden="true">↗</span></Link></li>)}</ul></div>
  </section>;
}

const REMOTE = "Remote delivery is structured for clients in the United States, United Kingdom, Canada, and other international markets: written scope, asynchronous progress, scheduled overlap, repository ownership, acceptance criteria, and a deployment handoff are made explicit.";

/* ---------------- AI: controlled AI inside a real product ---------------- */

export function AiServicePage({ service, copy, fit, faqs, proof, relatedGuides, relatedServices, frame }: ServiceProps) {
  return <>{frame.schema}{frame.crumbs}
    <PageHero eyebrow={`Service / ${service.name}`} title={service.title} lede={service.description}
      actions={<HeroActions slug={service.slug} label={copy.ctaShort} />}
      aside={<><p className="ab-eyebrow">Engagement fit</p><h2>Best fit for</h2><ul>{fit.bestFor.map(item => <li key={item}>{item}</li>)}</ul></>} />
    <SystemSchematic id="ai-system" data={aiSchematic} />
    <CapabilityGrid eyebrow="Capabilities" title="What can be built" items={service.deliverables} />
    <section className="ab-block">
      <SectionHead eyebrow="Choose the right level of autonomy" title="Automation, AI-assisted workflow, or agent?" intro={<>Most products need less autonomy than a demo suggests. Pick the least autonomous option that does the job — the <Link href="/guides/ai-feature-vs-automation/">AI feature vs automation guide</Link> walks through the decision.</>} />
      <DataTable id="ai-compare" variant="compare" spectrum={["More deterministic", "More autonomous"]} columns={aiComparison.columns} rows={aiComparison.rows} caption="Start from the left; move right only when the task genuinely needs it." />
    </section>
    <section className="ab-block">
      <SectionHead eyebrow="Failure and control" title="What can go wrong, and what controls it" intro="Every AI feature has failure modes. The product design decides whether they stay contained." />
      <DataTable id="ai-risks" variant="failure" columns={aiRisks.columns} rows={aiRisks.rows} caption="Controls are designed before release and verified with the evaluation set." />
    </section>
    <StepFlow eyebrow="Delivery" title="From scope to a working release" steps={aiTimeline}
      after={<TechnicalCallout label="Handoff" title="What you should have at handoff" tone="check"><ul>{fit.outcomes.map(item => <li key={item}>{item}</li>)}</ul></TechnicalCallout>} />
    <section className="ab-block">
      <SectionHead eyebrow="Proof" title="Relevant work" intro="Two public builds where model output is kept inside explicit product control." />
      <div className="ab-case-grid">{proof.map(item => <CaseStudyCard key={item.slug} item={item} />)}</div>
    </section>
    <TechStack eyebrow="Technical approach" title="The AI stack, chosen per workflow" groups={aiStack} note={<p className="ab-stack__note">{REMOTE}</p>} />
    <RelatedLinks guides={relatedGuides} services={relatedServices} guideHeading="Guides for this decision" />
    <FaqList heading={copy.faqHeading} items={faqs} />
    {frame.cta}
  </>;
}

/* ---------------- API: integrations that fail visibly and recover predictably ---------------- */

export function ApiServicePage({ service, copy, fit, faqs, proof, relatedGuides, relatedServices, frame }: ServiceProps) {
  return <>{frame.schema}{frame.crumbs}
    <PageHero eyebrow={`Service / ${service.name}`} title={service.title} lede={service.description}
      actions={<HeroActions slug={service.slug} label={copy.ctaShort} />} asideVariant="spec"
      aside={<><p className="ab-eyebrow">integration.fit</p><h2>Best fit for</h2><ul>{fit.bestFor.map(item => <li key={item}>{item}</li>)}</ul></>} />
    <SystemSchematic id="api-boundary" data={apiSchematic} />
    <section className="ab-block ab-block--feature">
      <SectionHead eyebrow="Failure-mode matrix" title="How each failure is detected and recovered" intro="An integration is only as good as its worst day. These are the failure modes planned for before launch, not discovered after it." />
      <DataTable id="api-failures" variant="failure" columns={apiFailureModes.columns} rows={apiFailureModes.rows} caption="Red: data can be lost or corrupted without handling. Amber: degraded or delayed. Green: safe by design once idempotency is in place." />
    </section>
    <section className="ab-block">
      <SectionHead eyebrow="Sync patterns" title="Webhook, polling, or event queue?" intro={<>Many integrations combine them — webhooks for speed, polling or reconciliation for completeness. The <Link href="/guides/api-integration-planning/">API integration planning guide</Link> covers the decision in detail.</>} />
      <DataTable id="api-patterns" variant="compare" columns={apiPatterns.columns} rows={apiPatterns.rows} caption="Choose per provider and per record type; the source of truth decides which pattern wins a conflict." />
    </section>
    <CapabilityGrid eyebrow="Capabilities" title="What can be built" items={service.deliverables} variant="ledger" />
    <TechnicalCallout label="Before the first line of code" title="Integration contract checklist" tone="check"><ul className="ab-columns">{apiContract.map(item => <li key={item}>{item}</li>)}</ul></TechnicalCallout>
    <StepFlow eyebrow="Delivery" title="From scope to a working release" steps={apiTimeline}
      after={<div className="ab-handoff"><h3>What you should have at handoff</h3><ul>{fit.outcomes.map(item => <li key={item}>{item}</li>)}</ul></div>} />
    <section className="ab-block">
      <SectionHead eyebrow="Proof" title="Relevant work" intro="Integration ledger from two public builds — the systems each one connects." />
      <ProofLedger items={proof} columns={["Project", "Connected systems", "Why it is relevant"]} />
    </section>
    <TechStack eyebrow="Technical approach" title="The integration stack" groups={apiStack} note={<p className="ab-stack__note">{REMOTE}</p>} />
    <RelatedLinks guides={relatedGuides} services={relatedServices} guideHeading="Integration guides" />
    <FaqList heading={copy.faqHeading} items={faqs} />
    {frame.cta}
  </>;
}

/* ---------------- Webhook guide: technical implementation reference ---------------- */

type GuideProps = {
  guide: { slug: string; title: string; description: string; category: string; intro: string; sections: [string, string][] };
  published: string;
  proof: ProofItem[];
  relatedService: { slug: string; name: string };
  relatedGuides: { slug: string; title: string }[];
  frame: { schema: ReactNode; crumbs: ReactNode };
};

export function WebhookGuidePage({ guide, published, proof, relatedService, relatedGuides, frame }: GuideProps) {
  const [verify, idempotent, reorder, recovery] = guide.sections;
  const extra = [["Handle provider outages", "outage"], ["Failure scenarios", "scenarios"], ["Implementation checklist", "checklist"], ["Common webhook mistakes", "mistakes"], ["Primary references", "references"]] as const;
  const nav = [...guide.sections.map(([heading]) => ({ id: sectionId(heading), label: heading })), ...extra.map(([label]) => ({ id: sectionId(label), label }))];
  const words = [guide.intro, ...guide.sections.map(([, text]) => text), ...webhookOutage, ...webhookChecklist, ...webhookMistakes, signatureCode, idempotencySql].join(" ").split(/\s+/).length;
  const readingTime = Math.max(6, Math.round(words / 200));
  const section = (entry: [string, string], children?: ReactNode) => <section id={sectionId(entry[0])} className="ab-article__section"><h2>{entry[0]}</h2><p>{entry[1]}</p>{children}</section>;
  return <>{frame.schema}{frame.crumbs}<article className="ab-article">
    <PageHero compact eyebrow={`${guide.category} / Engineering guide`} title={guide.title} lede={guide.description}
      meta={`By Muhammad Abdullah · Published ${published === "2026-09-27" ? "September 27, 2026" : "September 24, 2026"} · Updated September 27, 2026 · ${readingTime} min read`} />
    <div className="ab-guide-layout"><StickySectionNav items={nav} /><div className="seo-prose ab-prose">
      <TechnicalCallout label="Core rule"><p className="seo-lede">{guide.intro}</p></TechnicalCallout>
      <SequenceDiagram id="webhook-sequence" eyebrow="Sequence" title="One webhook event, end to end" actors={webhookSequence.actors} messages={webhookSequence.messages} caption="Solid: request path. Dashed: responses and async hand-offs. Amber: rejection and retry. Violet: operator action." />
      {section(verify, <CodeBlock filename="app/api/webhooks/route.ts" language="TypeScript" code={signatureCode} />)}
      <p className="ab-footnote">Header names and the exact signed string differ by provider. Where the provider ships an SDK helper — for example Stripe’s <code>constructEvent</code> — use it instead of hand-rolled verification.</p>
      {section(idempotent, <CodeBlock filename="webhook_events.sql" language="PostgreSQL" code={idempotencySql} />)}
      <p className="ab-footnote">Apply the business change and mark the row <code>processed</code> in the same transaction, or make the downstream write idempotent too; otherwise a crash between the two can still double-apply.</p>
      {section(reorder, <OrderTimeline sent={["subscription.created", "subscription.updated → active"]} received={["subscription.updated → active", "subscription.created"]} outcome={<>Delivered in the opposite order. Compare the object’s version or <code>updated</code> time with what you stored: ignore older events, and fetch the object from the provider API when it does not exist locally yet.</>} />)}
      {section(recovery, <BranchFlow lanes={[
        { label: "Success path", tone: "ok", steps: [{ label: "received", detail: "Recorded under a unique event ID" }, { label: "processing", detail: "Claimed by one worker" }, { label: "processed", detail: "Change applied in the same transaction" }] },
        { label: "Failure path", tone: "fail", steps: [{ label: "failed", detail: "Error and attempt count stored" }, { label: "retry scheduled", detail: "Exponential backoff with jitter" }], returnsTo: "processing" },
        { label: "Recovery path", tone: "operator", steps: [{ label: "dead_letter", detail: "After the maximum attempts" }, { label: "operator replay", detail: "One event or a batch, after the fix" }], returnsTo: "processing" },
      ]} note={<>Example schedule: retry after roughly 1 min, 5 min, 30 min and 2 h, then dead-letter. Tune the numbers to the provider’s own retry window.</>} />)}
      <section id={sectionId("Handle provider outages")} className="ab-article__section"><h2>Handle provider outages</h2>{webhookOutage.map(text => <p key={text}>{text}</p>)}</section>
      <section id={sectionId("Failure scenarios")} className="ab-article__section"><h2>Failure scenarios</h2><DataTable id="webhook-scenarios" variant="failure" columns={webhookFailureScenarios.columns} rows={webhookFailureScenarios.rows} caption="Each scenario maps to a control in the checklist below." /></section>
      <section id={sectionId("Implementation checklist")}><TechnicalCallout label="Ship with" title="Implementation checklist" tone="check"><ul>{webhookChecklist.map(item => <li key={item}>{item}</li>)}</ul></TechnicalCallout></section>
      <section id={sectionId("Common webhook mistakes")}><TechnicalCallout label="Avoid" title="Common webhook mistakes" tone="warn"><ul>{webhookMistakes.map(item => <li key={item}>{item}</li>)}</ul></TechnicalCallout></section>
      <section id={sectionId("Primary references")} className="ab-article__section"><h2>Primary references</h2><p>Provider behavior changes; check these before relying on a specific number.</p><ul className="ab-refs">{webhookSources.map(source => <li key={source.href}><a href={source.href}>{source.label} ↗</a></li>)}</ul></section>
      <h2>See the approach in working products</h2>
      <div className="ab-case-grid">{proof.map(item => <CaseStudyCard key={item.slug} item={item} />)}</div>
      <div className="ab-inline-links"><Link href={`/services/${relatedService.slug}/`} data-event="guide_to_service_click">{relatedService.name} ↗</Link>{relatedGuides.map(item => <Link key={item.slug} href={`/guides/${item.slug}/`}>{item.title} ↗</Link>)}</div>
      <aside className="seo-author"><img src="/assets/abdullah.png" width="96" height="96" loading="lazy" alt="Muhammad Abdullah" /><div><strong>Written by Muhammad Abdullah</strong><p>Independent product builder and full-stack engineer working across product design, web applications, integrations, automation, AI workflows, and deployment.</p><Link href="/about/">About the author ↗</Link></div></aside>
    </div></div>
  </article>
  <section className="seo-cta ab-guide-cta"><p>WEBHOOK REVIEW</p><h2>Need a webhook integration built or reviewed?</h2><p>Share the provider, what is failing or missing, and how events reach your system today. I’ll help map the verification, idempotency, and recovery path.</p><div><Link className="seo-button" href={`/contact/?service=${relatedService.slug}`} data-event="service_cta_click" data-service={relatedService.slug}>Start an API integration development inquiry <span>→</span></Link><a className="seo-text-link" href={BOOKING} data-event="book_call_click">Book a 15-minute fit call ↗</a></div></section>
  </>;
}
