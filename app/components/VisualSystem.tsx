/* eslint-disable @next/next/no-img-element -- screenshots are pre-sized WebP assets with fixed dimensions */
import NextLink from "next/link";
import type { CSSProperties, ReactNode } from "react";
import SequenceReveal from "./SequenceReveal";
import SpotlightCard from "./SpotlightCard";
import "./visual.css";

const vars = (values: Record<string, string | number>) => values as CSSProperties;
const pad = (value: number) => String(value).padStart(2, "0");

/* ---------- Hero ---------- */

export function PageHero({ eyebrow, title, lede, meta, actions, aside, asideVariant = "panel", compact = false }: { eyebrow: string; title: string; lede: string; meta?: ReactNode; actions?: ReactNode; aside?: ReactNode; asideVariant?: "panel" | "spec"; compact?: boolean }) {
  return <section className={`ab-hero${aside ? " ab-hero--split" : ""}${compact ? " ab-hero--compact" : ""}`}>
    <p className="ab-eyebrow">{eyebrow}</p>
    <h1>{title}<span>.</span></h1>
    <div className="ab-hero__body">
      <div className="ab-hero__copy">
        <p className="ab-hero__lede">{lede}</p>
        {meta && <p className="ab-hero__meta">{meta}</p>}
        {actions && <div className="ab-hero__actions">{actions}</div>}
      </div>
      {aside && <aside className={`ab-hero__aside ab-hero__aside--${asideVariant}`}>{aside}</aside>}
    </div>
  </section>;
}

export function SectionHead({ eyebrow, title, intro, id }: { eyebrow: string; title: string; intro?: ReactNode; id?: string }) {
  return <div className="ab-section-head">
    <p className="ab-eyebrow">{eyebrow}</p>
    <h2 id={id}>{title}</h2>
    {intro && <p>{intro}</p>}
  </div>;
}

/* ---------- System schematic: trust boundaries, request path, return loop ---------- */

export type SchTone = "product" | "provider" | "model" | "guard" | "human" | "system" | "operator";
export type SchNode = { label: string; detail: string; note?: { tone: "fail" | "info"; text: string } };
export type Schematic = {
  eyebrow: string; title: string; caption: string;
  zones: { label: string; tone: SchTone; nodes: SchNode[] }[];
  loop?: { from: number; to: number; label: string; detail: string };
  legend: { kind: "request" | "loop" | "human" | "fail" | "boundary"; label: string }[];
};

export function SystemSchematic({ id, data }: { id: string; data: Schematic }) {
  const flat = data.zones.flatMap(zone => zone.nodes);
  const total = flat.length;
  const centre = (index: number) => ((index + 0.5) / total) * 100;
  const starts = data.zones.map((_, index) => data.zones.slice(0, index).reduce((sum, zone) => sum + zone.nodes.length, 0));
  return <figure className="ab-sch" aria-labelledby={`${id}-title`}>
    <SequenceReveal>
      <div className="ab-sch__head"><p className="ab-eyebrow">{data.eyebrow}</p><h2 id={`${id}-title`}>{data.title}</h2></div>
      <div className="ab-sch__track" style={vars({ "--nodes": total })}>
        {data.zones.map((zone, zoneIndex) => {
          const start = starts[zoneIndex];
          return <section key={zone.label} className={`ab-sch__zone ab-sch__zone--${zone.tone}`} style={vars({ "--span": zone.nodes.length })} aria-label={`${zone.label} boundary`}>
            <p className="ab-sch__zone-label"><span aria-hidden="true">{zone.tone === "human" ? "◆" : zone.tone === "provider" ? "◇" : "▢"}</span>{zone.label}</p>
            <ol className="ab-sch__nodes" start={start + 1}>
              {zone.nodes.map((node, nodeIndex) => {
                const index = start + nodeIndex;
                const exit = nodeIndex === zone.nodes.length - 1 && zoneIndex < data.zones.length - 1;
                const last = index === total - 1;
                return <li key={node.label} className={`ab-sch__node${exit ? " ab-sch__node--exit" : ""}${last ? " ab-sch__node--last" : ""}`} style={vars({ "--i": index })}>
                  <span className="ab-sch__index">{pad(index + 1)}</span>
                  <strong>{node.label}</strong>
                  <span className="ab-sch__detail">{node.detail}</span>
                  {node.note && <span className={`ab-sch__note ab-sch__note--${node.note.tone}`}>{node.note.text}</span>}
                </li>;
              })}
            </ol>
          </section>;
        })}
        {data.loop && <div className="ab-sch__loop" aria-hidden="true" style={vars({ "--from": `${centre(data.loop.from)}%`, "--to": `${centre(data.loop.to)}%`, "--i": total })}>
          <span className="ab-sch__loop-u" /><span className="ab-sch__loop-head">▲</span>
        </div>}
      </div>
      {data.loop && <p className="ab-sch__loop-text"><span aria-hidden="true">↺</span><strong>{data.loop.label}</strong>{data.loop.detail} <em>Returns from {pad(data.loop.from + 1)} {flat[data.loop.from].label} to {pad(data.loop.to + 1)} {flat[data.loop.to].label}.</em></p>}
      <ul className="ab-legend" aria-label="Diagram legend">{data.legend.map(item => <li key={item.kind} className={`ab-legend__${item.kind}`}><span aria-hidden="true" />{item.label}</li>)}</ul>
      <figcaption>{data.caption}</figcaption>
    </SequenceReveal>
  </figure>;
}

/* ---------- Sequence diagram with lifelines (engineering articles) ---------- */

export type SequenceMessage = { from: number; to: number; label: string; detail?: string; tone?: "request" | "response" | "fail" | "operator" };

export function SequenceDiagram({ id, title, eyebrow, actors, messages, caption }: { id: string; title: string; eyebrow: string; actors: string[]; messages: SequenceMessage[]; caption: string }) {
  return <figure className="ab-seqd" aria-labelledby={`${id}-title`}>
    <SequenceReveal>
      <div className="ab-sch__head"><p className="ab-eyebrow">{eyebrow}</p><h2 id={`${id}-title`}>{title}</h2></div>
      <div className="ab-seqd__grid" style={vars({ "--actors": actors.length })}>
        <ul className="ab-seqd__actors" aria-label="Participants">{actors.map(actor => <li key={actor}>{actor}</li>)}</ul>
        <ol className="ab-seqd__messages">
          {messages.map((message, index) => {
            const left = Math.min(message.from, message.to), right = Math.max(message.from, message.to);
            const self = message.from === message.to;
            return <li key={message.label} className={`ab-seqd__msg ab-seqd__msg--${message.tone ?? "request"}${self ? " ab-seqd__msg--self" : ""}${message.to < message.from ? " ab-seqd__msg--back" : ""}`} style={vars({ "--i": index, "--start": left + 1, "--end": self ? left + 2 : right + 2 })}>
              <span className="ab-seqd__route"><b>{pad(index + 1)}</b>{actors[message.from]}{self ? "" : ` → ${actors[message.to]}`}</span>
              <span className="ab-seqd__arrow" aria-hidden="true" />
              <span className="ab-seqd__label">{message.label}{message.detail && <small>{message.detail}</small>}</span>
            </li>;
          })}
        </ol>
      </div>
      <figcaption>{caption}</figcaption>
    </SequenceReveal>
  </figure>;
}

/* ---------- Branching state flow (success / failure / recovery lanes) ---------- */

export function BranchFlow({ lanes, note }: { lanes: { label: string; tone: "ok" | "fail" | "operator"; steps: { label: string; detail: string }[]; returnsTo?: string }[]; note?: ReactNode }) {
  return <SequenceReveal className="ab-branch">
    {lanes.map((lane, laneIndex) => <div key={lane.label} className={`ab-branch__lane ab-branch__lane--${lane.tone}`} style={vars({ "--i": laneIndex * 3 })}>
      <p className="ab-branch__label">{lane.label}</p>
      <ol>{lane.steps.map((step, index) => <li key={step.label} style={vars({ "--i": laneIndex * 3 + index })}><strong>{step.label}</strong><span>{step.detail}</span></li>)}</ol>
      {lane.returnsTo && <p className="ab-branch__return"><span aria-hidden="true">↺</span> back to <strong>{lane.returnsTo}</strong></p>}
    </div>)}
    {note && <div className="ab-branch__note">{note}</div>}
  </SequenceReveal>;
}

/* ---------- Out-of-order delivery timeline ---------- */

export function OrderTimeline({ sent, received, outcome }: { sent: string[]; received: string[]; outcome: ReactNode }) {
  return <figure className="ab-order">
    <div className="ab-order__cols">
      <div><p className="ab-eyebrow">Provider emitted</p><ol>{sent.map((item, index) => <li key={item}><b>t{index + 1}</b>{item}</li>)}</ol></div>
      <svg className="ab-order__cross" viewBox="0 0 60 100" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M0 25 L60 75" /><path d="M0 75 L60 25" /></svg>
      <div><p className="ab-eyebrow">Your endpoint received</p><ol>{received.map((item, index) => <li key={item}><b>#{index + 1}</b>{item}</li>)}</ol></div>
    </div>
    <figcaption>{outcome}</figcaption>
  </figure>;
}

/* ---------- Responsive data table (matrix on desktop, labelled cards on mobile) ---------- */

export function DataTable({ id, caption, columns, rows, variant = "matrix", spectrum }: { id: string; caption: string; columns: string[]; rows: { head: string; cells: string[]; tone?: "fail" | "warn" | "ok" }[]; variant?: "matrix" | "failure" | "compare"; spectrum?: [string, string] }) {
  return <SequenceReveal className={`ab-table ab-table--${variant}`}>
    {spectrum && <div className="ab-table__spectrum" aria-hidden="true"><span>{spectrum[0]}</span><i /><span>{spectrum[1]}</span></div>}
    <div className="ab-table__scroll">
      <table aria-describedby={`${id}-caption`}>
        <thead><tr>{columns.map(column => <th key={column} scope="col">{column}</th>)}</tr></thead>
        <tbody>{rows.map((row, index) => <tr key={row.head} className={row.tone ? `ab-row--${row.tone}` : undefined} style={vars({ "--i": index })}>
          <th scope="row"><span className="ab-table__dot" aria-hidden="true" />{row.head}</th>
          {row.cells.map((cell, cellIndex) => <td key={cellIndex} data-label={columns[cellIndex + 1]}>{cell}</td>)}
        </tr>)}</tbody>
      </table>
    </div>
    <p className="ab-table__caption" id={`${id}-caption`}>{caption}</p>
  </SequenceReveal>;
}

/* ---------- Timeline, callouts, capability blocks ---------- */

export function StepFlow({ title, eyebrow, steps, after }: { title: string; eyebrow: string; steps: { label: string; text: string }[]; after?: ReactNode }) {
  return <section className="ab-steps">
    <SequenceReveal>
      <SectionHead eyebrow={eyebrow} title={title} />
      <ol>{steps.map((step, index) => <li key={step.text} style={vars({ "--i": index })}><span>{pad(index + 1)}</span><strong>{step.label}</strong><p>{step.text}</p></li>)}</ol>
      {after}
    </SequenceReveal>
  </section>;
}

export function TechnicalCallout({ label, title, children, tone = "default", id }: { label: string; title?: string; children: ReactNode; tone?: "default" | "check" | "warn"; id?: string }) {
  return <aside className={`ab-callout ab-callout--${tone}`} id={id}>
    <p className="ab-eyebrow">{label}</p>
    {title && <h2>{title}</h2>}
    {children}
  </aside>;
}

export function CapabilityGrid({ title, eyebrow, items, variant = "cards" }: { title: string; eyebrow: string; items: string[]; variant?: "cards" | "ledger" }) {
  return <section className={`ab-capabilities ab-capabilities--${variant}`}>
    <SectionHead eyebrow={eyebrow} title={title} />
    <ul>{items.map((item, index) => <li key={item} style={vars({ "--i": index })}>{variant === "cards"
      ? <SpotlightCard><span>{pad(index + 1)}</span><p>{item}</p></SpotlightCard>
      : <><span>{pad(index + 1)}</span><p>{item}</p></>}</li>)}</ul>
  </section>;
}

export function TechStack({ title, eyebrow, groups, note }: { title: string; eyebrow: string; groups: { label: string; items: string[] }[]; note?: ReactNode }) {
  return <section className="ab-stack">
    <SectionHead eyebrow={eyebrow} title={title} />
    <dl>{groups.map(group => <div key={group.label}><dt>{group.label}</dt><dd><ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul></dd></div>)}</dl>
    {note}
  </section>;
}

export function FaqList({ heading, items }: { heading: string; items: { q: string; a: string }[] }) {
  return <section className="seo-faq ab-faq"><p>FAQ</p><h2>{heading}</h2>{items.map(item => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</section>;
}

/* ---------- Screenshots and proof ---------- */

export function ScreenshotFrame({ src, width, height, alt, host, eager = false }: { src: string; width: number; height: number; alt: string; host: string; eager?: boolean }) {
  return <span className="ab-shot">
    <span className="ab-shot__bar" aria-hidden="true"><i /><i /><i /><span>{host}</span></span>
    <img src={src} width={width} height={height} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" />
  </span>;
}

export type ProofItem = { slug: string; name: string; summary: string; relevance: string; image: string; width: number; height: number; alt: string; host: string; tags: string[]; live: string; code: string };

export function CaseStudyCard({ item }: { item: ProofItem }) {
  return <SpotlightCard className="ab-case">
    <NextLink prefetch={false} href={`/work/${item.slug}/`} data-event="case_study_click">
      <ScreenshotFrame src={item.image} width={item.width} height={item.height} alt={item.alt} host={item.host} />
      <span className="ab-case__body">
        <strong>{item.name}</strong>
        <span>{item.relevance}</span>
        <span className="ab-case__tags">{item.tags.map(tag => <em key={tag}>{tag}</em>)}</span>
        <b>View {item.name} case study ↗</b>
      </span>
    </NextLink>
  </SpotlightCard>;
}

export function ProofLedger({ items, columns }: { items: (ProofItem & { systems: string[] })[]; columns: [string, string, string] }) {
  return <div className="ab-ledger">
    <div className="ab-ledger__head" aria-hidden="true">{columns.map(column => <span key={column}>{column}</span>)}</div>
    <ul>{items.map(item => <li key={item.slug}>
      <NextLink prefetch={false} href={`/work/${item.slug}/`} className="ab-ledger__project" data-event="case_study_click">
        <ScreenshotFrame src={item.image} width={item.width} height={item.height} alt={item.alt} host={item.host} />
        <span className="ab-ledger__name"><strong>{item.name}</strong><em>View case study ↗</em></span>
      </NextLink>
      <ul className="ab-ledger__systems" aria-label={`${item.name} integrations`}>{item.systems.map(system => <li key={system}>{system}</li>)}</ul>
      <p>{item.relevance}</p>
    </li>)}</ul>
  </div>;
}
