/* eslint-disable @next/next/no-img-element -- screenshots are pre-sized WebP assets with fixed dimensions */
import NextLink from "next/link";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import SequenceReveal from "./SequenceReveal";
import SpotlightCard from "./SpotlightCard";

export const Link = (props: ComponentProps<typeof NextLink>) => <NextLink prefetch={false} {...props} />;
const vars = (values: Record<string, string | number>) => values as CSSProperties;
export const pad = (n: number) => String(n).padStart(2, "0");
export const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/* ================= Page scaffolding ================= */

export function Hero({ variant, eyebrow, title, lede, actions, aside, meta, children }: { variant: "service" | "hub" | "case" | "guide" | "entity" | "contact"; eyebrow: string; title: ReactNode; lede: ReactNode; actions?: ReactNode; aside?: ReactNode; meta?: ReactNode; children?: ReactNode }) {
  return <header className={`pg-hero pg-hero--${variant}`}>
    <div className="pg-hero__copy">
      <p className="ab-eyebrow">{eyebrow}</p>
      <h1>{title}<span className="pg-hero__dot">.</span></h1>
      <div className="pg-hero__lede">{lede}</div>
      {meta && <div className="pg-hero__meta">{meta}</div>}
      {actions && <div className="pg-hero__actions">{actions}</div>}
    </div>
    {aside && <div className="pg-hero__aside">{aside}</div>}
    {children}
  </header>;
}

/** Editorial section: sticky index rail on the left, content on the right. No enclosing box. */
export function Section({ index, label, title, intro, children, id, layout = "rail", tone }: { index?: string; label: string; title: ReactNode; intro?: ReactNode; children?: ReactNode; id?: string; layout?: "rail" | "wide" | "band" | "center"; tone?: "fail" | "human" | "ok" }) {
  return <section id={id} className={`sec sec--${layout}${tone ? ` sec--${tone}` : ""}`}>
    <div className="sec__rail"><span className="sec__index">{index}</span><span className="sec__label">{label}</span></div>
    <div className="sec__body">
      <h2 className="sec__title">{title}</h2>
      {intro && <div className="sec__intro">{typeof intro === "string" ? <p>{intro}</p> : intro}</div>}
      {children}
    </div>
  </section>;
}

/** Full-bleed band for large visuals. */
export function Band({ children, tone = "grid", id }: { children: ReactNode; tone?: "grid" | "deep" | "warm" | "plain"; id?: string }) {
  return <div id={id} className={`band band--${tone}`}><div className="band__inner">{children}</div></div>;
}

export function Statement({ children, cite }: { children: ReactNode; cite?: ReactNode }) {
  return <blockquote className="statement"><p>{children}</p>{cite && <footer>{cite}</footer>}</blockquote>;
}

/* ================= Lists ================= */

/** Open numbered ledger rows with hairlines. */
export function Ledger({ items, variant = "rows", start = 1 }: { items: { title?: ReactNode; text: ReactNode; meta?: ReactNode }[]; variant?: "rows" | "columns" | "compact"; start?: number }) {
  return <ol className={`ledger ledger--${variant}`} start={start}>
    {items.map((item, index) => <li key={index}><span className="ledger__n">{pad(index + start)}</span><div>{item.title && <strong>{item.title}</strong>}<p>{item.text}</p>{item.meta && <span className="ledger__meta">{item.meta}</span>}</div></li>)}
  </ol>;
}

export function Checklist({ items, tone = "check", columns = false }: { items: ReactNode[]; tone?: "check" | "warn" | "cross"; columns?: boolean }) {
  return <ul className={`checklist checklist--${tone}${columns ? " checklist--columns" : ""}`}>{items.map((item, index) => <li key={index}>{item}</li>)}</ul>;
}

export function Signals({ items }: { items: string[] }) {
  return <ul className="signals">{items.map((item, index) => <li key={item}><span aria-hidden="true">{pad(index + 1)}</span>{item}</li>)}</ul>;
}

/* ================= Matrices ================= */

export type Level = "low" | "medium" | "high";
export type MatrixCell = string | { level: Level; text?: string };
export function Matrix({ id, columns, rows, caption, variant = "compare", spectrum }: { id: string; columns: string[]; rows: { head: string; cells: MatrixCell[]; tone?: "fail" | "warn" | "ok"; note?: string }[]; caption?: ReactNode; variant?: "compare" | "failure" | "levels"; spectrum?: [string, string] }) {
  return <SequenceReveal className={`matrix matrix--${variant}`}>
    {spectrum && <div className="matrix__spectrum" aria-hidden="true"><span>{spectrum[0]}</span><i /><span>{spectrum[1]}</span></div>}
    <div className="matrix__scroll">
      <table aria-describedby={caption ? `${id}-caption` : undefined}>
        <thead><tr>{columns.map((column, index) => <th key={index} scope="col">{column}</th>)}</tr></thead>
        <tbody>{rows.map((row, rowIndex) => <tr key={row.head} className={row.tone ? `row--${row.tone}` : undefined} style={vars({ "--i": rowIndex })}>
          <th scope="row"><span className="matrix__dot" aria-hidden="true" />{row.head}{row.note && <small>{row.note}</small>}</th>
          {row.cells.map((cell, cellIndex) => <td key={cellIndex} data-label={columns[cellIndex + 1]}>{typeof cell === "string" ? cell : <><span className={`level level--${cell.level}`}><i aria-hidden="true" />{cell.level}</span>{cell.text && <span className="level__text">{cell.text}</span>}</>}</td>)}
        </tr>)}</tbody>
      </table>
    </div>
    {caption && <p className="matrix__caption" id={`${id}-caption`}>{caption}</p>}
  </SequenceReveal>;
}

/* ================= Decision tree (radio + :has, no JS required) ================= */

export type TreeNode = { question: string; hint?: string; options: { label: string; next?: TreeNode; result?: { title: string; text: string; href?: string; linkLabel?: string; tone?: "ok" | "warn" | "human" } }[] };
function TreeLevel({ node, name, depth }: { node: TreeNode; name: string; depth: number }) {
  return <fieldset className="tree__q" style={vars({ "--depth": depth })}>
    <legend><span className="tree__n">Q{depth + 1}</span>{node.question}</legend>
    {node.hint && <p className="tree__hint">{node.hint}</p>}
    <ul className="tree__options">
      {node.options.map((option, index) => {
        const id = `${name}-${index}`;
        return <li key={option.label} className="tree__branch">
          <input type="radio" name={name} id={id} className="tree__radio" />
          <label htmlFor={id} className="tree__option">{option.label}</label>
          <div className="tree__then">
            {option.next && <TreeLevel node={option.next} name={`${name}-${index}`} depth={depth + 1} />}
            {option.result && <div className={`tree__result tree__result--${option.result.tone ?? "ok"}`}>
              <span className="ab-eyebrow">Recommendation</span>
              <strong>{option.result.title}</strong>
              <p>{option.result.text}</p>
              {option.result.href && <Link href={option.result.href} className="tree__link">{option.result.linkLabel ?? "Read more"} →</Link>}
            </div>}
          </div>
        </li>;
      })}
    </ul>
  </fieldset>;
}
export function DecisionTree({ id, root, title, caption }: { id: string; root: TreeNode; title: string; caption?: ReactNode }) {
  const name = id;
  return <form className="tree" id={id} aria-label={title}>
    <div className="tree__bar"><p className="tree__instructions">Choose answers to narrow the path. Before you choose, every branch is shown.</p><button type="reset" className="tree__reset">Show all paths</button></div>
    <TreeLevel node={root} name={name} depth={0} />
    {caption && <p className="tree__caption">{caption}</p>}
  </form>;
}

/* ================= Before / after ================= */

export function BeforeAfter({ before, after, caption }: { before: { title: string; steps: { label: string; pain: string }[] }; after: { title: string; steps: { label: string; detail: string; kind?: "gate" | "record" | "step" }[] }; caption?: ReactNode }) {
  return <SequenceReveal className="ba">
    <div className="ba__before">
      <p className="ba__tag">Before</p>
      <h3>{before.title}</h3>
      <ol>{before.steps.map((step, index) => <li key={step.label} style={vars({ "--i": index, "--r": `${(index % 3) - 1}deg` })}><strong>{step.label}</strong><span>{step.pain}</span></li>)}</ol>
    </div>
    <div className="ba__arrow" aria-hidden="true"><span>→</span></div>
    <div className="ba__after">
      <p className="ba__tag">After</p>
      <h3>{after.title}</h3>
      <ol>{after.steps.map((step, index) => <li key={step.label} className={`ba__step--${step.kind ?? "step"}`} style={vars({ "--i": index })}><strong>{step.label}</strong><span>{step.detail}</span></li>)}</ol>
    </div>
    {caption && <p className="ba__caption">{caption}</p>}
  </SequenceReveal>;
}

/* ================= Lifecycle ring ================= */

export function Lifecycle({ id, stages, center, caption }: { id: string; stages: { label: string; detail: string }[]; center: { title: string; text: string }; caption?: ReactNode }) {
  const n = stages.length, r = 190, cx = 250, cy = 250;
  const point = (i: number) => { const a = (-90 + (360 / n) * i) * Math.PI / 180; return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }; };
  const arcs = stages.map((_, i) => { const a = point(i), b = point((i + 1) % n); return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} A${r} ${r} 0 0 1 ${b.x.toFixed(1)} ${b.y.toFixed(1)}`; });
  return <SequenceReveal className="cycle">
    <div className="cycle__ring">
      <svg viewBox="0 0 500 500" aria-hidden="true" focusable="false">
        <circle cx={cx} cy={cy} r={r} className="cycle__track" />
        {arcs.map((d, i) => <path key={i} d={d} pathLength={1} className="cycle__arc" style={vars({ "--i": i })} />)}
      </svg>
      <div className="cycle__center"><strong>{center.title}</strong><span>{center.text}</span></div>
      <ol className="cycle__stages" aria-label={`${id} stages`}>
        {stages.map((stage, i) => { const p = point(i); return <li key={stage.label} style={vars({ "--x": `${(p.x / 500) * 100}%`, "--y": `${(p.y / 500) * 100}%`, "--i": i })}><span className="cycle__n">{pad(i + 1)}</span><strong>{stage.label}</strong><span className="cycle__detail">{stage.detail}</span></li>; })}
      </ol>
    </div>
    {caption && <p className="cycle__caption">{caption}</p>}
  </SequenceReveal>;
}

/* ================= Funnel ================= */

export function Funnel({ stages, caption }: { stages: { label: string; detail: string; out?: string }[]; caption?: ReactNode }) {
  return <SequenceReveal className="funnel">
    <ol>{stages.map((stage, index) => <li key={stage.label} style={vars({ "--i": index, "--n": stages.length })}>
      <div className="funnel__band"><span className="funnel__n">{pad(index + 1)}</span><strong>{stage.label}</strong><span>{stage.detail}</span></div>
      {stage.out && <p className="funnel__out"><span aria-hidden="true">↳</span>{stage.out}</p>}
    </li>)}</ol>
    {caption && <p className="funnel__caption">{caption}</p>}
  </SequenceReveal>;
}

/* ================= Risk grid (qualitative placement) ================= */

export function RiskGrid({ items, caption }: { items: { label: string; likelihood: 1 | 2 | 3; impact: 1 | 2 | 3; control: string }[]; caption?: ReactNode }) {
  const levels = ["Low", "Medium", "High"];
  return <div className="risk">
    <div className="risk__grid" role="img" aria-label="Risk grid: impact on the vertical axis, likelihood on the horizontal axis. Each risk is listed with its control below.">
      <span className="risk__axis risk__axis--y" aria-hidden="true">Impact →</span>
      <span className="risk__axis risk__axis--x" aria-hidden="true">Likelihood →</span>
      {[3, 2, 1].map(impact => [1, 2, 3].map(likelihood => <div key={`${impact}-${likelihood}`} className={`risk__cell risk__cell--${impact + likelihood}`} aria-hidden="true">
        {items.filter(item => item.impact === impact && item.likelihood === likelihood).map(item => <span key={item.label} className="risk__chip">{item.label}</span>)}
      </div>))}
      <div className="risk__ticks risk__ticks--x" aria-hidden="true">{levels.map(level => <span key={level}>{level}</span>)}</div>
    </div>
    <ol className="risk__list">{items.map(item => <li key={item.label}><strong>{item.label}</strong><span className="risk__rating">Impact {levels[item.impact - 1].toLowerCase()} · likelihood {levels[item.likelihood - 1].toLowerCase()}</span><p>{item.control}</p></li>)}</ol>
    {caption && <p className="risk__caption">{caption}</p>}
  </div>;
}

/* ================= Screenshots & proof ================= */

export function ScreenshotFrame({ src, width, height, alt, host, eager = false }: { src: string; width: number; height: number; alt: string; host: string; eager?: boolean }) {
  return <span className="shot">
    <span className="shot__bar" aria-hidden="true"><i /><i /><i /><span>{host}</span></span>
    <img src={src} width={width} height={height} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" fetchPriority={eager ? "high" : undefined} />
  </span>;
}

export function AnnotatedShot({ shot, notes, eager, caption }: { caption?: ReactNode; shot: { src: string; width: number; height: number; alt: string; host: string }; notes: { x: number; y: number; title: string; text: string }[]; eager?: boolean }) {
  return <figure className="annot">
    <div className="annot__stage">
      <ScreenshotFrame {...shot} eager={eager} />
      <ol className="annot__pins" aria-hidden="true">{notes.map((note, index) => <li key={note.title} style={vars({ "--x": `${note.x}%`, "--y": `${note.y}%` })} data-pin={index + 1}>{index + 1}</li>)}</ol>
    </div>
    <figcaption>{caption && <p className="annot__caption">{caption}</p>}<ol className="annot__notes">{notes.map((note, index) => <li key={note.title} data-pin={index + 1}><span className="annot__n">{index + 1}</span><div><strong>{note.title}</strong><p>{note.text}</p></div></li>)}</ol></figcaption>
  </figure>;
}

export type ProofItem = { slug: string; name: string; subtitle: string; summary: string; relevance?: string; image: string; width: number; height: number; alt: string; host: string; tags: string[]; live: string; code: string };

export function ProofPanel({ item, reverse = false, heading = "h3" }: { item: ProofItem; reverse?: boolean; heading?: "h2" | "h3" }) {
  const H = heading;
  return <article className={`proof${reverse ? " proof--reverse" : ""}`}>
    <Link href={`/work/${item.slug}/`} className="proof__media" data-event="case_study_click" aria-label={`${item.name} case study`}><ScreenshotFrame src={item.image} width={item.width} height={item.height} alt={item.alt} host={item.host} /></Link>
    <div className="proof__body">
      <p className="ab-eyebrow">{item.subtitle}</p>
      <H className="proof__title">{item.name}</H>
      <p>{item.summary}</p>
      {item.relevance && <p className="proof__why"><span>Why it is relevant</span>{item.relevance}</p>}
      <ul className="tags">{item.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
      <div className="proof__actions"><Link href={`/work/${item.slug}/`} data-event="case_study_click">View {item.name} case study ↗</Link><a href={item.live}>Live ↗</a><a href={item.code}>GitHub ↗</a></div>
    </div>
  </article>;
}

export function ProofStrip({ items }: { items: ProofItem[] }) {
  return <div className="proof-strip">{items.map(item => <SpotlightCard key={item.slug} className="proof-strip__card">
    <Link href={`/work/${item.slug}/`} data-event="case_study_click">
      <ScreenshotFrame src={item.image} width={item.width} height={item.height} alt={item.alt} host={item.host} />
      <span className="proof-strip__body"><strong>{item.name}</strong><span>{item.relevance ?? item.summary}</span><b>View {item.name} case study →</b></span>
    </Link>
  </SpotlightCard>)}</div>;
}

/* ================= Routing map (hub): hover/focus lights the path, links navigate ================= */

export function RoutingMap({ id, problems, services }: { id: string; problems: { id: string; label: string; detail: string; to: string[] }[]; services: { id: string; label: string; href: string; group: string }[] }) {
  const rowH = 64, pH = problems.length * rowH, sH = services.length * rowH, H = Math.max(pH, sH);
  const py = (i: number) => (H - pH) / 2 + i * rowH + rowH / 2, sy = (i: number) => (H - sH) / 2 + i * rowH + rowH / 2;
  const edges = problems.flatMap((problem, pi) => problem.to.map(target => { const si = services.findIndex(s => s.id === target); return { from: problem.id, to: target, d: `M0 ${py(pi)} C 150 ${py(pi)} 150 ${sy(si)} 300 ${sy(si)}` }; }));
  const rules = problems.map(problem => `#${id}:has([data-p="${problem.id}"]:is(:hover,:focus-visible)) .route__edge[data-from="${problem.id}"]{stroke:var(--accent);stroke-opacity:1;stroke-width:2}#${id}:has([data-p="${problem.id}"]:is(:hover,:focus-visible)) :is(${problem.to.map(t => `[data-s="${t}"]`).join(",")}){border-color:var(--accent);color:var(--text);background:rgba(121,223,239,.06)}`).join("");
  return <div className="route" id={id} style={vars({ "--route-h": H })}>
    <style>{rules}</style>
    <ul className="route__problems">{problems.map(problem => <li key={problem.id}><a href={`#${id}-${problem.to[0]}`} data-p={problem.id} className="route__problem"><strong>{problem.label}</strong><span>{problem.detail}</span><span className="route__to">→ {problem.to.map(t => services.find(s => s.id === t)!.label).join(" or ")}</span></a></li>)}</ul>
    <svg className="route__svg" viewBox={`0 0 300 ${H}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">{edges.map((edge, index) => <path key={index} className="route__edge" data-from={edge.from} d={edge.d} vectorEffect="non-scaling-stroke" />)}</svg>
    <ul className="route__services">{services.map(service => <li key={service.id} id={`${id}-${service.id}`}><Link href={service.href} data-s={service.id} className="route__service"><span className="route__group">{service.group}</span><strong>{service.label}</strong><span aria-hidden="true">→</span></Link></li>)}</ul>
  </div>;
}

/* ================= Misc ================= */

export function StackTable({ rows }: { rows: { layer: string; items: string[]; why: string }[] }) {
  return <dl className="stk">{rows.map(row => <div key={row.layer}><dt>{row.layer}</dt><dd><ul>{row.items.map(item => <li key={item}>{item}</li>)}</ul><p>{row.why}</p></dd></div>)}</dl>;
}

export function EngagementStrip({ steps, note }: { steps: { label: string; text: string }[]; note?: ReactNode }) {
  return <SequenceReveal className="strip">
    <ol>{steps.map((step, index) => <li key={step.text} style={vars({ "--i": index })}><span className="strip__n">{pad(index + 1)}</span><strong>{step.label}</strong><p>{step.text}</p></li>)}</ol>
    {note && <div className="strip__note">{note}</div>}
  </SequenceReveal>;
}

export function Faq({ heading, items, index = "", label = "Questions" }: { heading: string; items: { q: string; a: string }[]; index?: string; label?: string }) {
  return <Section index={index} label={label} title={heading}>
    <div className="faq">{items.map(item => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>
  </Section>;
}

export function RelatedRail({ title, items }: { title: string; items: { href: string; kicker: string; label: string; text?: string }[] }) {
  return <nav className="rail" aria-label={title}>
    <h2 className="rail__title">{title}</h2>
    <ul>{items.map(item => <li key={item.href}><Link href={item.href}><span className="rail__kicker">{item.kicker}</span><strong>{item.label}</strong>{item.text && <span className="rail__text">{item.text}</span>}<span className="rail__go" aria-hidden="true">→</span></Link></li>)}</ul>
  </nav>;
}

export function Callout({ label, children, tone = "info" }: { label: string; children: ReactNode; tone?: "info" | "warn" | "human" }) {
  return <aside className={`callout callout--${tone}`}><p className="ab-eyebrow">{label}</p>{children}</aside>;
}

/* ================= Sequence diagram: lifelines as grid columns, one message per row ================= */

export type SeqMessage = { from: number; to: number; label: string; detail?: string; tone?: "request" | "response" | "fail" | "operator" };
export function Sequence({ id, actors, messages, caption }: { id: string; actors: string[]; messages: SeqMessage[]; caption?: ReactNode }) {
  const n = actors.length;
  return <figure className="seq" id={id} aria-label={`Sequence: ${actors.join(", ")}`} style={vars({ "--n": n })}>
    <SequenceReveal className="seq__frame">
      <ol className="seq__actors" aria-hidden="true">{actors.map(actor => <li key={actor}>{actor}</li>)}</ol>
      <div className="seq__lifelines" aria-hidden="true">{actors.map(actor => <i key={actor} />)}</div>
      <ol className="seq__msgs">
        {messages.map((message, index) => {
          const a = Math.min(message.from, message.to), b = Math.max(message.from, message.to), span = b - a + 1;
          const self = message.from === message.to, dir = self ? "self" : message.to > message.from ? "right" : "left";
          return <li key={index} className={`seq__msg seq__msg--${dir} seq__msg--${message.tone ?? "request"}`} style={{ gridColumn: `${a + 1} / ${b + 2}`, gridRow: index + 2, ...vars({ "--i": index, "--inset": `${50 / span}%` }) }}>
            <span className="seq__route">{pad(index + 1)} · {actors[message.from]} → {actors[message.to]}</span>
            <strong>{message.label}</strong>
            {message.detail && <span className="seq__detail">{message.detail}</span>}
            <span className="seq__arrow" aria-hidden="true" />
          </li>;
        })}
      </ol>
    </SequenceReveal>
    {caption && <figcaption className="seq__caption">{caption}</figcaption>}
  </figure>;
}

/* ================= Now / Later / Never board ================= */

export function ScopeBoard({ columns }: { columns: { label: string; tone: "ok" | "warn" | "fail"; note: string; items: string[] }[] }) {
  return <div className="board">{columns.map(column => <div key={column.label} className={`board__col board__col--${column.tone}`}>
    <h3>{column.label}</h3><p>{column.note}</p>
    <ul>{column.items.map(item => <li key={item}>{item}</li>)}</ul>
  </div>)}</div>;
}
