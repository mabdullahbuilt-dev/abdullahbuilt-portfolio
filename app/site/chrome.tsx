/* eslint-disable @next/next/no-img-element -- author portrait is a fixed-size asset */
import type { ReactNode } from "react";
import { serviceCopy, services } from "./content";
import { Link } from "./ui/Blocks";

export const BOOKING = "https://cal.com/muhammad-abdullah-built/idea-to-product";
export const REMOTE = "Remote delivery is structured for clients in the United States, United Kingdom, Canada, and other international markets: written scope, asynchronous progress, scheduled overlap, repository ownership, acceptance criteria, and a deployment handoff are made explicit.";

export function Header({ path }: { path: string }) {
  const current = (section: string) => path === section || path.startsWith(`${section}/`) ? "page" : undefined;
  return <><a className="seo-skip" href="#main">Skip to content</a><header className="seo-header"><Link href="/" className="seo-wordmark">abdullah<span>.</span></Link><nav aria-label="Primary">{[["work", "Work"], ["services", "Services"], ["guides", "Guides"], ["about", "About"], ["contact", "Contact"]].map(([section, label]) => <Link key={section} href={`/${section}/`} aria-current={current(section)}>{label}</Link>)}</nav></header></>;
}

export function Footer() {
  return <footer className="seo-footer"><span>© 2026 Muhammad Abdullah</span><div><a href="mailto:mabdullah.built@gmail.com">Email</a><a href="https://www.linkedin.com/in/muhammad-abdullah-builder/">LinkedIn</a><a href="https://github.com/velz-cmd">GitHub</a><Link href="/contact/">Start a project</Link></div></footer>;
}

export function Crumbs({ items }: { items: { name: string; href?: string }[] }) {
  return <nav className="seo-crumbs" aria-label="Breadcrumb">{items.map((x, i) => <span key={x.name}>{x.href ? <Link href={x.href}>{x.name}</Link> : x.name}{i < items.length - 1 && " / "}</span>)}</nav>;
}

export function Schema({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function HeroActions({ slug, label }: { slug: string; label: string }) {
  return <><Link className="seo-button" href={`/contact/?service=${slug}`} data-event="service_cta_click" data-service={slug}>{label} <span>→</span></Link><a className="seo-text-link" href={BOOKING} data-event="book_call_click">Book a 15-minute fit call ↗</a></>;
}

/** Closing call to action. Service pages pass the service; hubs and entity pages pass a source. */
export function ContextCta({ service, source, eyebrow = "PROJECT INQUIRY", heading, text, label }: { service?: string; source?: string; eyebrow?: string; heading?: ReactNode; text?: ReactNode; label?: string }) {
  const selected = services.find(item => item.slug === service);
  const href = selected ? `/contact/?service=${selected.slug}` : source ? `/contact/?source=${source}` : "/contact/";
  return <section className="cta" aria-labelledby="cta-heading">
    <div className="cta__inner">
      <div>
        <p className="ab-eyebrow">{eyebrow}</p>
        <h2 id="cta-heading">{heading ?? (selected ? serviceCopy[selected.slug].ctaHeading : "Tell me what you are trying to build.")}</h2>
        <p>{text ?? "Share the goal, current state, constraints, and useful links. I’ll help identify the most useful path forward."}</p>
      </div>
      <div className="cta__actions">
        <Link className="seo-button" href={href} data-event="service_cta_click" data-service={selected?.slug || source || "general"}>{label ?? (selected ? serviceCopy[selected.slug].ctaLong : "Discuss your project")} <span>→</span></Link>
        <a className="seo-text-link" href={BOOKING} data-event="book_call_click">Book a 15-minute fit call ↗</a>
      </div>
    </div>
  </section>;
}

export function Author() {
  return <aside className="author"><img src="/assets/abdullah.png" width="96" height="96" loading="lazy" alt="Muhammad Abdullah" /><div><strong>Written by Muhammad Abdullah</strong><p>Independent product builder and full-stack engineer working across product design, web applications, integrations, automation, AI workflows, and deployment.</p><Link href="/about/" className="x-link">About the author ↗</Link></div></aside>;
}
