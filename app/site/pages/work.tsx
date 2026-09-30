import { projectMedia, projects, services, updatedLong, type Project } from "../content";
import { hubHeadings, hubSchema, projectSchema } from "../schema";
import { ContextCta, Crumbs, Schema } from "../chrome";
import { Diagram } from "../ui/Diagram";
import { AnnotatedShot, Checklist, Hero, Ledger, Matrix, ProofPanel, RelatedRail, Section } from "../ui/Blocks";
import { capabilityColumns, capabilityRows, caseVisuals } from "../data/work";
import { proofItems } from "./services";

const hostOf = (url: string) => new URL(url).host;

export function CaseStudy({ project }: { project: Project }) {
  const media = projectMedia[project.slug], visual = caseVisuals[project.slug];
  const index = projects.findIndex(p => p.slug === project.slug), next = projects[(index + 1) % projects.length];
  let n = 0; const idx = () => String(++n).padStart(2, "0");
  return <>
    <Schema data={projectSchema(project)} />
    <Crumbs items={[{ name: "Home", href: "/" }, { name: "Work", href: "/work/" }, { name: project.name }]} />
    <Hero variant="case" eyebrow={`Case study / ${project.subtitle}`} title={project.name} lede={<p>{project.description}</p>}
      actions={<><a className="seo-button" href={project.live}>View live project <span>↗</span></a><a className="seo-text-link" href={project.code}>Inspect source ↗</a></>}
      aside={<dl className="facts">{visual.facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>} />
    <div className="band band--deep"><div className="band__inner">
      <AnnotatedShot eager shot={{ src: media.image, width: media.width, height: media.height, alt: media.alt, host: hostOf(project.live) }} notes={visual.notes} caption="Product interface from the working public build." />
    </div></div>
    <p className="seo-byline case-byline">Product and engineering work by Muhammad Abdullah · Updated {updatedLong}</p>
    <Section index={idx()} label="Context" title="Problem and constraints">
      <div className="prose"><p>{project.context}</p><p>The product needed to make a technically dense workflow understandable without hiding the states a user must evaluate. The public build and source repository are linked above; no private client metrics are claimed.</p></div>
    </Section>
    <Section index={idx()} label="Role" title="Role and scope" intro={<p>Product structure, interaction design, full-stack implementation, integration flow, and deployment were treated as one connected release. The goal was a demonstrable working system rather than a static concept.</p>}>
      <ol className="roles">{visual.role.map(item => <li key={item.label}><span>{item.label}</span><strong>{item.text}</strong></li>)}</ol>
    </Section>
    <Section index={idx()} label="Build" title="What was built" intro={<p>{project.built}</p>}>
      <Checklist columns items={media.capabilities} />
    </Section>
    <Section index={idx()} label={visual.map.eyebrow} title="Architecture and workflow" layout="band" intro={<p>{project.architecture}</p>}>
      <Diagram id={`${project.slug}-map`} spec={visual.map} variant="band" />
    </Section>
    <Section index={idx()} label="Decisions" title="Selected technical decisions">
      <Ledger items={project.decisions.map((decision, i) => ({ title: decision, text: visual.why[i] }))} />
    </Section>
    <Section index={idx()} label="Evidence" title="Testing and public evidence" intro="Everything here can be checked without taking my word for it.">
      <ul className="evidence">
        {media.validation.map(item => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}
      </ul>
      <p className="evidence__links"><a className="x-link" href={project.live}>Open the live build ↗</a><a className="x-link" href={project.code}>Read the source ↗</a></p>
    </Section>
    <RelatedRail title="Relevant services" items={media.services.map(slug => { const s = services.find(x => x.slug === slug)!; return { href: `/services/${slug}/`, kicker: "Service", label: s.name }; })} />
    <RelatedRail title="Next case study" items={[{ href: `/work/${next.slug}/`, kicker: next.subtitle, label: next.name, text: next.description }]} />
    <ContextCta service={media.services[0]} />
  </>;
}

export function WorkHub() {
  const items = proofItems(projects.map(p => p.slug), () => "").map(item => ({ ...item, relevance: undefined, tags: projectMedia[item.slug].capabilities.slice(0, 3) }));
  return <>
    <Schema data={hubSchema("work")} />
    <Crumbs items={[{ name: "Home", href: "/" }, { name: "Work" }]} />
    <Hero variant="hub" eyebrow="Work" title={hubHeadings.work} lede={<p>These case studies demonstrate full-stack product delivery, integrations, workflows, automation, market and data systems, payments, and production engineering.</p>} />
    <Section index="01" label="Capability map" title="What each build demonstrates" layout="wide" intro="Short, checkable claims — each one visible in the live build or its source.">
      <Matrix id="work-capabilities" variant="compare" columns={capabilityColumns} rows={projects.map(p => ({ head: p.name, cells: capabilityRows[p.slug] }))} caption="A dash means the project makes no claim in that area." />
    </Section>
    <Section index="02" label="Case studies" title="Four public builds" layout="wide">
      <div>{items.map((item, i) => <ProofPanel key={item.slug} item={item} reverse={i % 2 === 1} heading="h2" />)}</div>
    </Section>
    <ContextCta source="work" />
  </>;
}
