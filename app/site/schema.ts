// JSON-LD builders. Output must stay identical to the pre-redesign pages (verified against the main baseline).
import { guides, origin, projectMedia, projects, serviceFaqs, services, updated, type Guide, type Project, type Service } from "./content";

const crumb = (items: [string, string][]) => ({ "@type": "BreadcrumbList", itemListElement: items.map(([name, item], index) => ({ "@type": "ListItem", position: index + 1, name, item })) });

export function serviceSchema(service: Service) {
  const url = `${origin}/services/${service.slug}/`, faqs = serviceFaqs[service.slug], contactUrl = `${origin}/contact/?service=${service.slug}`;
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "WebPage", "@id": `${url}#webpage`, url, name: service.title, description: service.description, isPartOf: { "@id": `${origin}/#website` }, about: { "@id": `${url}#service` }, dateModified: updated },
    { "@type": "Service", "@id": `${url}#service`, name: service.name, description: service.description, url, provider: { "@id": `${origin}/#business` }, areaServed: ["United States", "United Kingdom", "Canada", "Worldwide"], availableChannel: { "@type": "ServiceChannel", serviceUrl: contactUrl } },
    { "@type": "FAQPage", "@id": `${url}#faq`, mainEntity: faqs.map(x => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })) },
    crumb([["Home", `${origin}/`], ["Services", `${origin}/services/`], [service.name, url]]),
  ] };
}

export function projectSchema(project: Project) {
  const url = `${origin}/work/${project.slug}/`, media = projectMedia[project.slug];
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "WebPage", "@id": `${url}#webpage`, url, name: `${project.name} software case study`, description: project.description, isPartOf: { "@id": `${origin}/#website` }, dateModified: updated },
    { "@type": "SoftwareApplication", "@id": `${url}#software`, name: project.name, description: project.description, url: project.live, author: { "@id": `${origin}/#person` }, applicationCategory: "BusinessApplication", image: `${origin}${media.image.replace("-viewport", "")}` /* unchanged from main; the cleaner viewport crop is an SEO-workstream recommendation */, dateModified: updated },
    crumb([["Home", `${origin}/`], ["Work", `${origin}/work/`], [project.name, url]]),
  ] };
}

export function guideSchema(guide: Guide) {
  const url = `${origin}/guides/${guide.slug}/`, published = guide.published || "2026-09-24";
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "WebPage", "@id": `${url}#webpage`, url, name: guide.title, description: guide.description, isPartOf: { "@id": `${origin}/#website` }, dateModified: updated },
    { "@type": "Article", "@id": `${url}#article`, headline: guide.title, description: guide.description, url, datePublished: published, dateModified: updated, author: { "@id": `${origin}/#person` }, publisher: { "@id": `${origin}/#business` }, inLanguage: "en" },
    crumb([["Home", `${origin}/`], ["Guides", `${origin}/guides/`], [guide.title, url]]),
  ] };
}

export const hubHeadings = {
  services: "Software development services for complete product workflows",
  work: "Software products built around difficult workflows",
  guides: "Practical software product guides",
} as const;

export function hubSchema(type: keyof typeof hubHeadings) {
  const url = `${origin}/${type}/`;
  const items = type === "services" ? services.map(x => ({ href: `/services/${x.slug}/`, title: x.name })) : type === "work" ? projects.map(x => ({ href: `/work/${x.slug}/`, title: x.name })) : guides.map(x => ({ href: `/guides/${x.slug}/`, title: x.title }));
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "CollectionPage", "@id": `${url}#webpage`, url, name: hubHeadings[type], isPartOf: { "@id": `${origin}/#website` }, dateModified: updated },
    { "@type": "ItemList", itemListElement: items.map((x, i) => ({ "@type": "ListItem", position: i + 1, name: x.title, url: `${origin}${x.href}` })) },
    crumb([["Home", `${origin}/`], [type[0].toUpperCase() + type.slice(1), url]]),
  ] };
}

export function aboutSchema() {
  const url = `${origin}/about/`;
  return { "@context": "https://schema.org", "@type": "AboutPage", "@id": `${url}#webpage`, url, name: "About Muhammad Abdullah", isPartOf: { "@id": `${origin}/#website` }, about: { "@id": `${origin}/#person` }, dateModified: updated };
}

export function contactSchema() {
  const url = `${origin}/contact/`;
  return { "@context": "https://schema.org", "@type": "ContactPage", "@id": `${url}#webpage`, url, name: "Start a software project", isPartOf: { "@id": `${origin}/#website` }, about: { "@id": `${origin}/#business` }, dateModified: "2026-09-27" };
}
