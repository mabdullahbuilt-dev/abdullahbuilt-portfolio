import type { CSSProperties, ReactNode } from "react";
import SequenceReveal from "./SequenceReveal";

/*
 * Schematic diagrams. Authored on a 1000-unit wide canvas; the server computes every connector,
 * arrowhead and label position, so the SVG and the HTML nodes scale together with no client JS.
 * Below the desktop container width the same HTML reflows into a vertical spine (see site.css).
 */

export type NodeKind = "step" | "actor" | "store" | "queue" | "gate" | "external" | "outcome" | "sidecar" | "fail" | "human";
export type EdgeKind = "flow" | "async" | "retry" | "fail" | "human" | "muted";
type Side = "left" | "right" | "top" | "bottom";
export type DNode = { id: string; label: string; detail?: string; kind?: NodeKind; x: number; y: number; w?: number; h?: number; note?: string };
export type DEdge = { from: string; to: string; kind?: EdgeKind; label?: string; route?: "auto" | "below" | "above"; fromSide?: Side; toSide?: Side; depth?: number; quiet?: boolean; fromShift?: number; toShift?: number };
export type DZone = { label: string; x: number; y: number; w: number; h: number; tone?: "neutral" | "provider" | "system" | "guard" | "human" | "model" | "operator" };
export type DiagramSpec = {
  eyebrow: string; title?: string; caption: ReactNode; height: number;
  nodes: DNode[]; edges: DEdge[]; zones?: DZone[];
  legend?: { kind: EdgeKind | "boundary" | "human-node" | "store"; label: string }[];
};

const W = 1000;
const STEP = 260; // ms per route edge
type Pt = { x: number; y: number };
const box = (n: DNode) => ({ x: n.x, y: n.y, w: n.w ?? 150, h: n.h ?? 86 });
function anchor(n: DNode, side: Side, shift = 0): Pt {
  const b = box(n);
  return side === "left" ? { x: b.x, y: b.y + b.h / 2 + shift } : side === "right" ? { x: b.x + b.w, y: b.y + b.h / 2 + shift } : side === "top" ? { x: b.x + b.w / 2 + shift, y: b.y } : { x: b.x + b.w / 2 + shift, y: b.y + b.h };
}
const f = (v: number) => Math.round(v * 10) / 10;

type Geometry = { d: string; label: Pt; end: Pt; angle: number; length: number };
function bezierLength(p0: Pt, p1: Pt, p2: Pt, p3: Pt) {
  let len = 0, prev = p0;
  for (let i = 1; i <= 24; i++) {
    const t = i / 24, u = 1 - t;
    const pt = { x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x, y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y };
    len += Math.hypot(pt.x - prev.x, pt.y - prev.y); prev = pt;
  }
  return len;
}

function route(from: DNode, to: DNode, edge: DEdge): Geometry {
  const a = box(from), b = box(to);
  const loop = edge.route === "below" || edge.route === "above";
  if (loop) {
    const below = edge.route === "below", depth = edge.depth ?? 34;
    const s = anchor(from, below ? "bottom" : "top", edge.fromShift), e = anchor(to, below ? "bottom" : "top", edge.toShift);
    const y = below ? Math.max(a.y + a.h, b.y + b.h) + depth : Math.min(a.y, b.y) - depth;
    const r = 10, dir = e.x < s.x ? -1 : 1, v = below ? 1 : -1;
    const d = `M${f(s.x)} ${f(s.y)} V${f(y - v * r)} Q${f(s.x)} ${f(y)} ${f(s.x + dir * r)} ${f(y)} H${f(e.x - dir * r)} Q${f(e.x)} ${f(y)} ${f(e.x)} ${f(y - v * r)} V${f(e.y)}`;
    return { d, label: { x: (s.x + e.x) / 2, y }, end: e, angle: below ? -90 : 90, length: Math.abs(y - s.y) + Math.abs(e.x - s.x) + Math.abs(y - e.y) };
  }
  let fs: Side = edge.fromSide ?? "right", ts: Side = edge.toSide ?? "left";
  if (!edge.fromSide && !edge.toSide) {
    if (b.x >= a.x + a.w - 4) { fs = "right"; ts = "left"; }
    else if (b.y >= a.y + a.h) { fs = "bottom"; ts = "top"; }
    else if (b.y + b.h <= a.y) { fs = "top"; ts = "bottom"; }
    else { fs = "left"; ts = "right"; }
  }
  const s = anchor(from, fs, edge.fromShift), e = anchor(to, ts, edge.toShift);
  const horizontal = fs === "left" || fs === "right";
  const endHorizontal = ts === "left" || ts === "right";
  if ((horizontal && Math.abs(s.y - e.y) < 1) || (!horizontal && Math.abs(s.x - e.x) < 1)) {
    const angle = Math.atan2(e.y - s.y, e.x - s.x) * 180 / Math.PI;
    return { d: `M${f(s.x)} ${f(s.y)} L${f(e.x)} ${f(e.y)}`, label: { x: (s.x + e.x) / 2, y: (s.y + e.y) / 2 }, end: e, angle, length: Math.hypot(e.x - s.x, e.y - s.y) };
  }
  const k = horizontal ? Math.max(28, Math.abs(e.x - s.x) / 2) : Math.max(28, Math.abs(e.y - s.y) / 2);
  const out = (p: Pt, side: Side, dist: number) => side === "right" ? { x: p.x + dist, y: p.y } : side === "left" ? { x: p.x - dist, y: p.y } : side === "bottom" ? { x: p.x, y: p.y + dist } : { x: p.x, y: p.y - dist };
  const c1 = out(s, fs, k), c2 = out(e, ts, endHorizontal === horizontal ? k : Math.max(28, horizontal ? Math.abs(e.y - s.y) / 2 : Math.abs(e.x - s.x) / 2));
  const angle = ts === "left" ? 0 : ts === "right" ? 180 : ts === "top" ? 90 : -90;
  const mid = { x: 0.125 * s.x + 0.375 * c1.x + 0.375 * c2.x + 0.125 * e.x, y: 0.125 * s.y + 0.375 * c1.y + 0.375 * c2.y + 0.125 * e.y };
  return { d: `M${f(s.x)} ${f(s.y)} C${f(c1.x)} ${f(c1.y)} ${f(c2.x)} ${f(c2.y)} ${f(e.x)} ${f(e.y)}`, label: mid, end: e, angle, length: bezierLength(s, c1, c2, e) };
}

const vars = (values: Record<string, string | number>) => values as CSSProperties;
const pad = (n: number) => String(n).padStart(2, "0");
const solid = new Set<EdgeKind>(["flow", "fail", "human"]);
const edgeVerb: Record<EdgeKind, string> = { flow: "→", async: "⇢", retry: "↺", fail: "✕", human: "◆", muted: "→" };

export function Diagram({ id, spec, variant = "band" }: { id: string; spec: DiagramSpec; variant?: "band" | "inline" }) {
  const byId = new Map(spec.nodes.map(node => [node.id, node]));
  const H = spec.height;
  const order = new Map(spec.nodes.map((node, index) => [node.id, index]));
  // Motion timing: flow edges draw in authored order; nodes activate when the path reaches them.
  let flowIndex = 0;
  const flowCount = spec.edges.filter(edge => (edge.kind ?? "flow") === "flow").length;
  let extraIndex = 0;
  const edges = spec.edges.map(edge => {
    const kind = edge.kind ?? "flow";
    const geometry = route(byId.get(edge.from)!, byId.get(edge.to)!, edge);
    const delay = kind === "flow" ? (flowIndex++) * STEP : flowCount * STEP + 120 + (extraIndex++) * 220;
    return { ...edge, kind, geometry, delay };
  });
  const activation = new Map<string, number>();
  for (const node of spec.nodes) {
    const incoming = edges.filter(edge => edge.to === node.id && edge.kind === "flow");
    activation.set(node.id, incoming.length ? Math.min(...incoming.map(edge => edge.delay + STEP)) : 0);
  }
  // Mobile notes: edges that are not simply "next step in reading order".
  const notes = new Map<string, string[]>();
  for (const edge of edges) {
    const sequential = edge.kind === "flow" && order.get(edge.to) === (order.get(edge.from) ?? -9) + 1;
    if (sequential || edge.quiet) continue;
    const target = byId.get(edge.to)!;
    const text = `${edgeVerb[edge.kind]} ${edge.label ? `${edge.label}: ` : ""}${edge.kind === "retry" ? "back to" : "to"} ${pad((order.get(edge.to) ?? 0) + 1)} ${target.label}`;
    notes.set(edge.from, [...(notes.get(edge.from) ?? []), text]);
  }
  const zoneOf = (node: DNode) => {
    const b = box(node), cx = b.x + b.w / 2, cy = b.y + b.h / 2;
    return spec.zones?.find(zone => cx >= zone.x && cx <= zone.x + zone.w && cy >= zone.y && cy <= zone.y + zone.h);
  };
  const zones = spec.nodes.map(zoneOf);
  const headings = zones.map((zone, index) => { const previous = zones.slice(0, index).reverse().find(Boolean); return zone && zone !== previous ? zone : undefined; });
  const labelled = spec.title ? { "aria-labelledby": `${id}-title` } : { "aria-label": spec.eyebrow };
  return <figure className={`dg dg--${variant}`} id={id} {...labelled}>
    <figcaption className="dg__head"><span className="ab-eyebrow">{spec.eyebrow}</span>{spec.title && <span className="dg__title" id={`${id}-title`}>{spec.title}</span>}</figcaption>
    <SequenceReveal className="dg__frame">
        <div className="dg__canvas" style={vars({ "--dg-h": H })}>
          <svg className="dg__svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
            {spec.zones?.map(zone => <rect key={zone.label} className={`dg__zone dg__zone--${zone.tone ?? "neutral"}`} x={zone.x} y={zone.y} width={zone.w} height={zone.h} rx="14" />)}
            {edges.map((edge, index) => <path key={index} className={`dg__edge dg__edge--${edge.kind}`} d={edge.geometry.d} pathLength={solid.has(edge.kind) ? 1 : undefined} style={vars({ "--d": `${edge.delay}ms` })} />)}
            {edges.map((edge, index) => <path key={`tip-${index}`} className={`dg__tip dg__tip--${edge.kind}`} d="M-9 -5 L1 0 L-9 5 Z" transform={`translate(${f(edge.geometry.end.x)} ${f(edge.geometry.end.y)}) rotate(${edge.geometry.angle})`} style={vars({ "--d": `${edge.delay + STEP * 0.85}ms` })} />)}
          </svg>
          {spec.zones?.map(zone => <span key={zone.label} aria-hidden="true" className={`dg__zone-label dg__zone-label--${zone.tone ?? "neutral"}`} style={vars({ "--x": zone.x + 12, "--y": zone.y + 10 })}>{zone.label}</span>)}
          {edges.filter(edge => edge.label).map((edge, index) => <span key={index} aria-hidden="true" className={`dg__edge-label dg__edge-label--${edge.kind}`} style={vars({ "--x": edge.geometry.label.x, "--y": edge.geometry.label.y, "--d": `${edge.delay + STEP / 2}ms` })}>{edge.label}</span>)}
          <ol className="dg__nodes">
            {spec.nodes.map((node, index) => {
              const b = box(node), heading = headings[index];
              return <li key={node.id} className={`dg__node dg__node--${node.kind ?? "step"}`} style={vars({ "--x": b.x, "--y": b.y, "--w": b.w, "--h": b.h, "--d": `${activation.get(node.id)}ms` })}>
                {heading && <span className={`dg__spine-zone dg__zone-label--${heading.tone ?? "neutral"}`}>{heading.label}</span>}
                <span className="dg__index">{pad(index + 1)}</span>
                <strong>{node.label}</strong>
                {node.detail && <span className="dg__detail">{node.detail}</span>}
                {node.note && <span className="dg__note">{node.note}</span>}
                {notes.get(node.id)?.map(text => <span key={text} className="dg__route-note">{text}</span>)}
              </li>;
            })}
          </ol>
        </div>
    </SequenceReveal>
    {spec.legend && <ul className="dg__legend" aria-label="Legend">{spec.legend.map(item => <li key={item.label} className={`dg__legend--${item.kind}`}><i aria-hidden="true" />{item.label}</li>)}</ul>}
    <p className="dg__caption">{spec.caption}</p>
  </figure>;
}
