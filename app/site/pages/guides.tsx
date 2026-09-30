import type { ReactNode } from "react";
import { guides, projects, services, type Guide } from "../content";
import { guideSchema } from "../schema";
import { Author, ContextCta, Crumbs, Schema } from "../chrome";
import { Diagram, type DiagramSpec } from "../ui/Diagram";
import { Checklist, EngagementStrip, Matrix, ProofStrip, RelatedRail, Sequence, slugify } from "../ui/Blocks";
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
  cta: { eyebrow: string; heading: string; text: string; label?: string }; minRead?: number;
};

/** Article frame shared by every guide: byline, sticky TOC with progress, body, proof, related reading, author, contextual CTA. */
export function GuideShell({ guide, kind, toc, words, children, cta, minRead = 4 }: ShellProps) {
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

