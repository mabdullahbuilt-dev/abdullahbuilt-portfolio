/* eslint-disable @next/next/no-img-element -- portrait is a fixed-size asset */
import { projects } from "../content";
import { aboutSchema } from "../schema";
import { ContextCta, Crumbs, Schema } from "../chrome";
import { Link, ProofStrip, Section } from "../ui/Blocks";
import { proofItems } from "./services";

const capabilities = [
  { area: "Product and UX", items: ["User flows", "First-release scope", "Interface design"], href: "/services/mvp-product-development/", service: "MVP product development" },
  { area: "Frontend", items: ["React", "Next.js", "Responsive, accessible UI"], href: "/services/web-application-development/", service: "Web application development" },
  { area: "Backend and data", items: ["TypeScript", "Postgres, Supabase, Prisma", "Authentication and roles"], href: "/services/saas-development/", service: "SaaS development" },
  { area: "Integrations", items: ["REST APIs", "Webhooks", "Payments and USDC"], href: "/services/api-integration-development/", service: "API integration development" },
  { area: "Automation and AI", items: ["GitHub automation", "Agent workflows", "Review and approval steps"], href: "/services/ai-application-development/", service: "AI application development" },
  { area: "Delivery", items: ["Testing", "Vercel deployment", "Documentation and handoff"], href: "/services/product-rescue/", service: "Product rescue" },
];
const principles = [
  { title: "Map the flow first", text: "Who the user is, what they need to do, and what changes after success." },
  { title: "Decide the first release", text: "What belongs in it, and what deliberately waits for evidence." },
  { title: "Connect real data", text: "The interface talks to real records and services, not placeholders." },
  { title: "Test, ship, hand over", text: "Verified behavior, a deployed release, and a codebase the client owns." },
];
const profiles = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/muhammad-abdullah-builder/", text: "Background and experience" },
  { label: "GitHub", href: "https://github.com/velz-cmd", text: "Public repositories" },
  { label: "Résumé", href: "/Muhammad_Abdullah_Resume.pdf", text: "PDF" },
  { label: "Email", href: "mailto:mabdullah.built@gmail.com", text: "mabdullah.built@gmail.com" },
];

export function AboutPage() {
  const proof = proofItems(projects.map(p => p.slug), () => "").map(item => ({ ...item, relevance: undefined }));
  return <>
    <Schema data={aboutSchema()} />
    <Crumbs items={[{ name: "Home", href: "/" }, { name: "About" }]} />
    <header className="pg-hero pg-hero--entity">
      <div className="pg-hero__copy">
        <p className="ab-eyebrow">About</p>
        <h1>A product partner for the part where ideas become real<span className="pg-hero__dot">.</span></h1>
        <div className="pg-hero__lede"><p>I’m Muhammad Abdullah, an independent product builder, full-stack engineer, and hackathon winner based in Faisalabad, working remotely with clients worldwide.</p></div>
      </div>
      <div className="pg-hero__aside"><figure className="portrait"><img src="/assets/abdullah.png" width="320" height="320" alt="Muhammad Abdullah" fetchPriority="high" /><figcaption>Faisalabad · remote worldwide</figcaption></figure></div>
    </header>
    <Section index="01" label="Approach" title="From brief to working system" intro={<><p>I map the user flow, decide what belongs in the first release, connect the interface to real data and services, then test and ship.</p><p>The same approach has taken me through market strategy tools, GitHub automation, contribution funding, AI workflows, and cross-chain USDC products.</p></>}>
      <ol className="principles">{principles.map((p, i) => <li key={p.title}><span>{String(i + 1).padStart(2, "0")}</span><strong>{p.title}</strong><p>{p.text}</p></li>)}</ol>
    </Section>
    <Section index="02" label="Capabilities" title="Capability map" layout="wide" intro="One person across the product boundary — each area links to the service where it matters most.">
      <ul className="capmap">{capabilities.map(c => <li key={c.area}><p className="capmap__area">{c.area}</p><ul>{c.items.map(item => <li key={item}>{item}</li>)}</ul><Link href={c.href} className="capmap__link">{c.service} →</Link></li>)}</ul>
    </Section>
    <Section index="03" label="Clients" title="What clients can bring" intro={<><p>An early idea, a prototype that needs to become reliable, a manual workflow that should become software, or a defined feature in an existing application.</p><p><a className="x-link" href="/Muhammad_Abdullah_Resume.pdf">Read my résumé ↗</a></p></>} />
    <Section index="04" label="Remote" title="How remote work is structured" intro={<p>Engagements use a written product boundary, shared repository, explicit acceptance conditions, asynchronous progress updates, and planned meeting overlap. Clients retain control of code, hosting, data services, and key integration accounts.</p>} />
    <Section index="05" label="Proof" title="Evidence you can inspect" layout="wide">
      <ProofStrip items={proof} />
      <nav className="profiles" aria-label="Profiles and further reading">
        <Link href="/work/">View software case studies ↗</Link><Link href="/guides/">Read product development guides ↗</Link><Link href="/services/">Explore development services ↗</Link>
      </nav>
      <ul className="profile-list">{profiles.map(p => <li key={p.label}><a href={p.href}><span>{p.label}</span><strong>{p.text}</strong></a></li>)}</ul>
    </Section>
    <ContextCta source="about" />
  </>;
}
