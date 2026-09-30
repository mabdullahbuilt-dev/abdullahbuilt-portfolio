/* eslint-disable @next/next/no-img-element -- screenshots are pre-sized WebP assets with fixed dimensions */
import NextLink from "next/link";
import type { ReactNode } from "react";
import SpotlightCard from "./SpotlightCard";
import "./visual.css";

export type DiagramStage = { label: string; detail: string; notes?: string[]; failure?: string; href?: string };
export type Diagram = {
  eyebrow: string; title: string; caption: string; stages: DiagramStage[];
  rail?: { label: string; items: string[] };
  loop?: { label: string; detail: string };
};

export function PageHero({ eyebrow, title, lede, meta, actions, aside }: { eyebrow: string; title: string; lede: string; meta?: ReactNode; actions?: ReactNode; aside?: ReactNode }) {
  return <section className={`ab-hero${aside ? " ab-hero--split" : ""}`}>
    <p className="ab-eyebrow">{eyebrow}</p>
    <h1>{title}<span>.</span></h1>
    <div className="ab-hero__body">
      <div className="ab-hero__copy">
        <p className="ab-hero__lede">{lede}</p>
        {meta && <p className="ab-hero__meta">{meta}</p>}
        {actions && <div className="ab-hero__actions">{actions}</div>}
      </div>
      {aside && <aside className="ab-hero__aside">{aside}</aside>}
    </div>
  </section>;
}

// Semantic stage list; connectors and the feedback loop are decorative CSS layered on top.
export function WorkflowDiagram({ id, diagram }: { id: string; diagram: Diagram }) {
  return <figure className="ab-diagram ab-reveal" aria-labelledby={`${id}-title`}>
    <div className="ab-diagram__head"><span className="ab-eyebrow">{diagram.eyebrow}</span><h2 id={`${id}-title`}>{diagram.title}</h2></div>
    <ol className="ab-diagram__stages" style={{ ["--stage-count" as string]: diagram.stages.length }}>
      {diagram.stages.map((stage, index) => {
        const body = <><span className="ab-diagram__index">{String(index + 1).padStart(2, "0")}</span><strong>{stage.label}</strong><span className="ab-diagram__detail">{stage.detail}</span></>;
        return <li key={stage.label} className="ab-diagram__stage">
          {stage.href ? <a href={stage.href} className="ab-diagram__node">{body}</a> : <div className="ab-diagram__node">{body}</div>}
          {stage.notes && <ul className="ab-diagram__notes">{stage.notes.map(note => <li key={note}>{note}</li>)}</ul>}
          {stage.failure && <p className="ab-diagram__failure"><span>If it fails</span>{stage.failure}</p>}
        </li>;
      })}
    </ol>
    {diagram.loop && <p className="ab-diagram__loop"><span aria-hidden="true">↺</span><strong>{diagram.loop.label}</strong>{diagram.loop.detail}</p>}
    {diagram.rail && <div className="ab-diagram__rail"><strong>{diagram.rail.label}</strong><ul>{diagram.rail.items.map(item => <li key={item}>{item}</li>)}</ul></div>}
    <figcaption>{diagram.caption}</figcaption>
  </figure>;
}

export function StepFlow({ title, steps }: { title: string; steps: string[] }) {
  return <section className="ab-steps ab-reveal">
    <h2>{title}</h2>
    <ol>{steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><p>{step}</p></li>)}</ol>
  </section>;
}

export function TechnicalCallout({ label, title, children, tone = "default" }: { label: string; title?: string; children: ReactNode; tone?: "default" | "check" | "warn" }) {
  return <aside className={`ab-callout ab-callout--${tone} ab-reveal`}>
    <p className="ab-eyebrow">{label}</p>
    {title && <h2>{title}</h2>}
    {children}
  </aside>;
}

export function DeliverableGrid({ title, items }: { title: string; items: string[] }) {
  return <section className="ab-deliverables ab-reveal">
    <h2>{title}</h2>
    <ul>{items.map((item, index) => <li key={item}><SpotlightCard><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></SpotlightCard></li>)}</ul>
  </section>;
}

export function CaseStudyCard({ href, image, alt, name, summary, tags }: { href: string; image: string; alt: string; name: string; summary: string; tags: string[] }) {
  return <SpotlightCard className="ab-case">
    <NextLink prefetch={false} href={href} data-event="case_study_click">
      <img src={image} width="640" height="360" loading="lazy" decoding="async" alt={alt} />
      <span className="ab-case__body">
        <strong>{name}</strong>
        <span>{summary}</span>
        <span className="ab-case__tags">{tags.map(tag => <em key={tag}>{tag}</em>)}</span>
        <b>View {name} case study ↗</b>
      </span>
    </NextLink>
  </SpotlightCard>;
}
