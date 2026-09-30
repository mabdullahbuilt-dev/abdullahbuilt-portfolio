import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContactPage from "../ContactPage";
import { guides, key, projects, routeList, services } from "../site/content";
import { Footer, Header } from "../site/chrome";
import { ServicePage, ServicesHub } from "../site/pages/services";
import { GuidePage, GuidesHub } from "../site/pages/guides";
import { CaseStudy, WorkHub } from "../site/pages/work";
import { AboutPage } from "../site/pages/entity";
import "../site/ui/site.css";

function metaFor(path:string): Metadata {
  const service=services.find(x=>`services/${x.slug}`===path), project=projects.find(x=>`work/${x.slug}`===path), guide=guides.find(x=>`guides/${x.slug}`===path);
  const serviceTitles:Record<string,string>={"custom-software-development":"Custom Software Development Services | AbdullahBuilt","saas-development":"SaaS Development Services | AbdullahBuilt","web-application-development":"Web Application Development Services | AbdullahBuilt","api-integration-development":"API Integration Services | AbdullahBuilt","business-automation":"Business Process Automation Services | AbdullahBuilt","mvp-product-development":"MVP Development Services for Startups | AbdullahBuilt","ai-application-development":"AI Application Development Services | AbdullahBuilt","product-rescue":"Product Rescue & Software Stabilization | AbdullahBuilt"};
  const guideTitles:Record<string,string>={"hire-saas-developer":"Hire a SaaS Developer: Practical Guide | AbdullahBuilt","hire-web-app-developer":"Hire a Web App Developer: Practical Guide | AbdullahBuilt","startup-mvp-development":"Startup MVP Development Guide | AbdullahBuilt","custom-software-vs-saas":"Custom Software vs SaaS: Build or Buy | AbdullahBuilt","saas-mvp-development-cost":"SaaS MVP Development Cost & Scope | AbdullahBuilt","api-integration-planning":"API Integration Planning Guide | AbdullahBuilt","rescue-ai-built-web-app":"Rescue an AI-Built Web App | AbdullahBuilt","ai-feature-vs-automation":"AI Feature vs Automation | AbdullahBuilt","reliable-webhook-integration":"Reliable Webhook Integration Guide | AbdullahBuilt"};
  const title = service ? serviceTitles[service.slug] : project ? `${project.name} Software Case Study | AbdullahBuilt` : guide ? guideTitles[guide.slug] : path==="services" ? "Software Development Services | AbdullahBuilt" : path==="work" ? "Software Development Case Studies | AbdullahBuilt" : path==="guides" ? "Software Product Development Guides | AbdullahBuilt" : path==="about" ? "About Muhammad Abdullah | AbdullahBuilt" : "Start a Software Project | AbdullahBuilt";
  const description = service?.description || project?.description || guide?.description || (path==="services" ? "Custom software, SaaS, web application, API integration, automation, and MVP development services for clients worldwide." : path==="work" ? "Case studies covering product engineering, developer tools, market intelligence, verified funding, and cross-chain payments." : path==="guides" ? "Practical guides for hiring software developers, scoping SaaS products, and planning a startup MVP." : path==="about" ? "Independent product builder and full-stack engineer turning complex ideas and workflows into working software." : "Share your software product, current stage, constraints, and what needs to be built.");
  const url=`/${path}/`;
  return { title, description, alternates:{canonical:url,languages:{en:url,"x-default":url}}, openGraph:{title,description,url,type:guide?"article":"website",images:[{url:"/og.png",width:1200,height:630,alt:"Muhammad Abdullah portfolio"}]}, twitter:{card:"summary_large_image",title,description,images:["/og.png"]} };
}

export function generateStaticParams(){ return routeList.map(route=>({slug:route.split("/")})); }
export async function generateMetadata({params}:{params:Promise<{slug:string[]}>}){ return metaFor(key((await params).slug)); }

export default async function SeoPage({ params, searchParams }: { params: Promise<{ slug: string[] }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const path = key((await params).slug);
  if (!routeList.includes(path)) notFound();
  const query = await searchParams;
  const requestedService = typeof query.service === "string" ? query.service : "";
  const source = typeof query.source === "string" ? query.source : "";
  const service = services.find(x => `services/${x.slug}` === path), project = projects.find(x => `work/${x.slug}` === path), guide = guides.find(x => `guides/${x.slug}` === path);
  const content = service ? <ServicePage service={service} />
    : project ? <CaseStudy project={project} />
    : guide ? <GuidePage guide={guide} />
    : path === "services" ? <ServicesHub />
    : path === "work" ? <WorkHub />
    : path === "guides" ? <GuidesHub />
    : path === "about" ? <AboutPage />
    : <ContactPage requestedService={requestedService} source={source} />;
  return <div className="seo-page"><Header path={path} /><main id="main" className="seo-main">{content}</main><Footer /></div>;
}
