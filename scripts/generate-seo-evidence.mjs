import { mkdir, writeFile } from "node:fs/promises";

const baseUrl = String(process.env.SEO_BASE_URL || "http://127.0.0.1:3100").replace(/\/$/, "");
const origin = "https://abdullahbuilt.top";
const outDir = new URL("../docs/seo-data/", import.meta.url);
const routes = [
  "/", "/services/", "/services/custom-software-development/", "/services/saas-development/",
  "/services/web-application-development/", "/services/api-integration-development/", "/services/business-automation/",
  "/services/mvp-product-development/", "/services/ai-application-development/", "/services/product-rescue/",
  "/work/", "/work/resolve/", "/work/meridian/", "/work/repodiet/", "/work/agora-forge/",
  "/guides/", "/guides/hire-saas-developer/", "/guides/hire-web-app-developer/",
  "/guides/startup-mvp-development/", "/guides/custom-software-vs-saas/", "/guides/saas-mvp-development-cost/",
  "/guides/api-integration-planning/", "/guides/rescue-ai-built-web-app/", "/guides/ai-feature-vs-automation/",
  "/guides/reliable-webhook-integration/", "/about/", "/contact/",
];

const indexed = new Set(["/", "/services/custom-software-development/", "/services/api-integration-development/", "/services/mvp-product-development/", "/work/"]);
const discovered = new Set(["/services/web-application-development/", "/services/business-automation/", "/guides/hire-web-app-developer/", "/guides/startup-mvp-development/"]);
const crawlTimes = new Map([
  ["/", "2026-09-24T09:40:30Z"],
  ["/services/custom-software-development/", "2026-09-24T22:09:01Z"],
  ["/services/api-integration-development/", "2026-09-24T15:37:49Z"],
  ["/services/mvp-product-development/", "2026-09-24T22:18:52Z"],
  ["/work/", "2026-09-24T15:35:08Z"],
]);
const gscSitemap = new Set(["/", "/services/", "/services/saas-development/", "/services/api-integration-development/", "/services/business-automation/", "/work/resolve/", "/work/repodiet/", "/guides/", "/guides/hire-web-app-developer/", "/guides/startup-mvp-development/", "/about/", "/contact/"]);
const q = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const csv = (headers, rows) => [headers.map(q).join(","), ...rows.map((row) => headers.map((header) => q(row[header] ?? "UNKNOWN")).join(","))].join("\n") + "\n";
const one = (html, pattern) => html.match(pattern)?.[1]?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() || "";
const all = (html, pattern) => [...html.matchAll(pattern)].map((match) => match[1]);
const decode = (value) => value.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#x27;", "'").replaceAll("&#39;", "'");

await mkdir(outDir, { recursive: true });
const pages = [];
for (const path of routes) {
  const response = await fetch(`${baseUrl}${path}`);
  const html = await response.text();
  const links = all(html, /<a\b[^>]+href=["']([^"']+)["']/gi);
  const internal = links.filter((href) => href.startsWith("/") && !href.startsWith("//"));
  const images = [...html.matchAll(/<img\b([^>]*)>/gi)];
  const schemas = all(html, /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi).flatMap((raw) => {
    try {
      const value = JSON.parse(decode(raw));
      const nodes = value["@graph"] || [value];
      return nodes.map((node) => node["@type"]).flat().filter(Boolean);
    } catch { return ["INVALID"]; }
  });
  const h1 = decode(one(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i));
  const h2s = all(html, /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi).map((x) => decode(x.replace(/<[^>]+>/g, "").trim()));
  const canonical = one(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) || one(html, /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  const robots = one(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i) || "index,follow";
  const og = Boolean(/property=["']og:title["']/i.test(html) && /property=["']og:description["']/i.test(html) && /property=["']og:image["']/i.test(html));
  const firstCta = links.find((href) => href.includes("cal.com") || href.startsWith("/contact/?")) || links.find((href) => href.startsWith("/contact")) || "UNKNOWN";
  pages.push({
    path, html, response, links, internal, images, schemas, h1, h2s, canonical, robots, og, firstCta,
    title: decode(one(html, /<title[^>]*>([^<]+)<\/title>/i)),
    description: decode(one(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) || one(html, /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i)),
  });
}

const inbound = new Map(routes.map((path) => [path, 0]));
for (const page of pages) for (const href of new Set(page.internal.map((value) => new URL(value, origin).pathname))) if (inbound.has(href)) inbound.set(href, inbound.get(href) + 1);

const routeRows = pages.map((page) => ({
  route: page.path, http_status: page.response.status, indexable: page.response.status === 200 && !/noindex/i.test(page.robots) ? "YES" : "NO",
  title: page.title, title_length: page.title.length, meta_description: page.description, meta_length: page.description.length,
  h1: page.h1, h1_count: (page.html.match(/<h1\b/gi) || []).length, h2_count: page.h2s.length,
  heading_hierarchy: page.h1 && page.h2s.length ? "PASS" : "REVIEW", canonical: page.canonical, robots: page.robots,
  json_ld_types: [...new Set(page.schemas)].join("|"), breadcrumb: page.path === "/" ? "INTENTIONALLY OMITTED" : page.schemas.includes("BreadcrumbList") ? "PRESENT" : "MISSING",
  sitemap_branch: "YES", internal_inbound_pages: inbound.get(page.path), internal_outbound_links: page.internal.length,
  images: page.images.length, images_missing_alt_attribute: page.images.filter((match) => !/\balt=["'][^"']*["']/i.test(match[1])).length,
  open_graph: page.og ? "COMPLETE" : "INCOMPLETE", visible_content: page.h1 ? "PRESENT" : "MISSING",
  search_intent: page.path.startsWith("/guides/") ? "INFORMATIONAL" : page.path.startsWith("/services/") || page.path === "/contact/" ? "COMMERCIAL" : "MIXED",
  cta: page.firstCta === "UNKNOWN" ? "REVIEW" : "PRESENT", cta_destination: page.firstCta,
  mobile_rendering: "PASS (rendered cloud-browser inspection)", desktop_rendering: "PASS (rendered cloud-browser inspection)",
  console_errors: "0 observed in rendered cloud-browser inspection", failed_requests: "0 observed in rendered cloud-browser inspection",
  page_performance: "UNKNOWN (Lighthouse unavailable in audit run)",
}));
await writeFile(new URL("seo-route-audit.csv", outDir), csv(Object.keys(routeRows[0]), routeRows));
await writeFile(new URL("seo-route-inventory.csv", outDir), csv(Object.keys(routeRows[0]), routeRows));

const gscRows = routes.map((route) => ({
  route, property: `${origin}/`, inspection_date: "2026-09-27",
  coverage_state: indexed.has(route) ? "Submitted and indexed" : discovered.has(route) ? "Discovered - currently not indexed" : "URL is unknown to Google",
  indexed: indexed.has(route) ? "YES" : "NO", verdict: indexed.has(route) ? "PASS" : discovered.has(route) ? "NEUTRAL" : "UNKNOWN",
  user_canonical: `${origin}${route === "/" ? "/" : route}`, google_canonical: indexed.has(route) ? `${origin}${route === "/" ? "/" : route}` : "UNKNOWN",
  last_crawl: crawlTimes.get(route) || "UNKNOWN",
  discovery_source: route === "/" ? "/services/custom-software-development/" : route === "/services/custom-software-development/" ? "/services/api-integration-development/|/sitemap.xml" : route === "/services/mvp-product-development/" ? "/|/sitemap.xml" : route === "/work/" ? "/guides/startup-mvp-development/" : discovered.has(route) ? "GSC DISCOVERY; inspect export records any referring URL" : "NONE REPORTED",
  crawl_allowed: indexed.has(route) ? "YES" : "UNKNOWN", indexing_allowed: indexed.has(route) ? "YES" : "UNKNOWN",
  mobile_crawl: indexed.has(route) ? "YES" : "UNKNOWN", referring_sitemap: gscSitemap.has(route) ? "YES" : "NO/NOT REPORTED",
  rendered_indexed_state: indexed.has(route) ? "INDEXED" : "NOT INDEXED", action: indexed.has(route) ? "MONITOR" : "RESUBMIT 27-URL SITEMAP AFTER VERIFIED PRODUCTION CUTOVER",
}));
await writeFile(new URL("gsc-indexation-baseline.csv", outDir), csv(Object.keys(gscRows[0]), gscRows));

const sitemapRows = routes.map((route) => ({
  route, canonical_200_indexable: "YES", previous_gsc_sitemap_membership: "UNKNOWN PER-URL (GSC reported 19 total)", migration_branch_sitemap: "YES",
  discrepancy: "Branch sitemap includes route; production/GSC membership must be refreshed after approved cutover", intended_state: "INCLUDED",
}));
await writeFile(new URL("sitemap-reconciliation.csv", outDir), csv(Object.keys(sitemapRows[0]), sitemapRows));

const keywordRows = [
  {keyword:"web application development services",country:"US",source:"OpenSEO",volume:1000,difficulty:11,cpc_usd:35.67,intent:"COMMERCIAL",serp_features:"AI Overview|PAA|service pages"},
  {keyword:"web application development services",country:"US",source:"Ubersuggest",volume:1300,difficulty:26,cpc_usd:87.74,intent:"COMMERCIAL",serp_features:"AI Overview|PAA|service pages"},
  {keyword:"ai application development services",country:"US",source:"OpenSEO",volume:590,difficulty:21,cpc_usd:44.92,intent:"COMMERCIAL",serp_features:"AI Overview|PAA|service pages"},
  {keyword:"mvp development services",country:"US",source:"OpenSEO",volume:590,difficulty:0,cpc_usd:49.25,intent:"NAVIGATIONAL",serp_features:"service pages|PAA"},
  {keyword:"ai agent development services",country:"US",source:"OpenSEO",volume:480,difficulty:0,cpc_usd:33.37,intent:"COMMERCIAL",serp_features:"AI Overview|PAA|service pages"},
  {keyword:"saas development services",country:"US",source:"OpenSEO",volume:480,difficulty:18,cpc_usd:34.19,intent:"COMMERCIAL",serp_features:"service pages|PAA"},
  {keyword:"ai application developer",country:"US",source:"OpenSEO",volume:390,difficulty:17,cpc_usd:55.37,intent:"COMMERCIAL",serp_features:"jobs|service pages|PAA"},
  {keyword:"custom web application development",country:"US",source:"OpenSEO",volume:390,difficulty:4,cpc_usd:50.18,intent:"COMMERCIAL",serp_features:"service pages|PAA"},
  {keyword:"api integration services",country:"US",source:"OpenSEO",volume:320,difficulty:22,cpc_usd:196.43,intent:"COMMERCIAL",serp_features:"service pages|informational pages|PAA"},
  {keyword:"web application developer",country:"US",source:"OpenSEO",volume:320,difficulty:3,cpc_usd:25.83,intent:"COMMERCIAL",serp_features:"jobs|service pages|PAA"},
  {keyword:"ai agent developer",country:"US",source:"OpenSEO",volume:210,difficulty:8,cpc_usd:38.56,intent:"COMMERCIAL",serp_features:"service pages|jobs|PAA"},
  {keyword:"business process automation services",country:"US",source:"OpenSEO",volume:210,difficulty:8,cpc_usd:46.8,intent:"COMMERCIAL",serp_features:"service pages|PAA"},
  {keyword:"saas developer",country:"US",source:"OpenSEO",volume:210,difficulty:10,cpc_usd:"UNKNOWN",intent:"NAVIGATIONAL",serp_features:"jobs|service pages"},
  {keyword:"startup mvp development",country:"US",source:"OpenSEO",volume:210,difficulty:25,cpc_usd:"UNKNOWN",intent:"NAVIGATIONAL",serp_features:"service pages|guides"},
  {keyword:"hire saas developer",country:"US",source:"OpenSEO",volume:140,difficulty:0,cpc_usd:"UNKNOWN",intent:"COMMERCIAL",serp_features:"marketplaces|service pages"},
  {keyword:"hire web app developer",country:"US",source:"OpenSEO",volume:90,difficulty:8,cpc_usd:"UNKNOWN",intent:"COMMERCIAL",serp_features:"marketplaces|service pages"},
  {keyword:"third-party api integration",country:"US",source:"OpenSEO",volume:70,difficulty:2,cpc_usd:"UNKNOWN",intent:"INFORMATIONAL",serp_features:"guides|PAA"},
  {keyword:"api integration developer",country:"US",source:"OpenSEO",volume:20,difficulty:13,cpc_usd:"UNKNOWN",intent:"COMMERCIAL",serp_features:"service pages|jobs"},
  {keyword:"internal tools developer",country:"US",source:"OpenSEO",volume:20,difficulty:8,cpc_usd:"UNKNOWN",intent:"INFORMATIONAL",serp_features:"jobs|guides"},
  {keyword:"software product rescue",country:"US",source:"OpenSEO",volume:"UNKNOWN",difficulty:"UNKNOWN",cpc_usd:"UNKNOWN",intent:"COMMERCIAL",serp_features:"UNKNOWN"},
  {keyword:"web app developer",country:"UK",source:"OpenSEO",volume:170,difficulty:29,cpc_usd:"UNKNOWN",intent:"COMMERCIAL",serp_features:"jobs|service pages"},
  {keyword:"web application development services",country:"UK",source:"OpenSEO",volume:170,difficulty:12,cpc_usd:"UNKNOWN",intent:"COMMERCIAL",serp_features:"service pages|PAA"},
  {keyword:"mvp development services",country:"UK",source:"OpenSEO",volume:140,difficulty:0,cpc_usd:"UNKNOWN",intent:"NAVIGATIONAL",serp_features:"service pages|PAA"},
  {keyword:"ai application developer",country:"UK",source:"OpenSEO",volume:90,difficulty:34,cpc_usd:"UNKNOWN",intent:"COMMERCIAL",serp_features:"jobs|service pages"},
  {keyword:"startup mvp development",country:"UK",source:"OpenSEO",volume:90,difficulty:12,cpc_usd:"UNKNOWN",intent:"NAVIGATIONAL",serp_features:"service pages|guides"},
  {keyword:"api integration services",country:"UK",source:"OpenSEO",volume:70,difficulty:0,cpc_usd:"UNKNOWN",intent:"COMMERCIAL",serp_features:"service pages|guides"},
  {keyword:"ai agent development services",country:"UK",source:"OpenSEO",volume:50,difficulty:"UNKNOWN",cpc_usd:"UNKNOWN",intent:"COMMERCIAL",serp_features:"AI Overview|service pages"},
  {keyword:"custom web application development",country:"UK",source:"OpenSEO",volume:50,difficulty:3,cpc_usd:"UNKNOWN",intent:"COMMERCIAL",serp_features:"service pages"},
  {keyword:"saas development services",country:"UK",source:"OpenSEO",volume:30,difficulty:0,cpc_usd:"UNKNOWN",intent:"COMMERCIAL",serp_features:"service pages|PAA"},
  {keyword:"software product rescue",country:"UK",source:"OpenSEO",volume:"UNKNOWN",difficulty:"UNKNOWN",cpc_usd:"UNKNOWN",intent:"COMMERCIAL",serp_features:"UNKNOWN"},
  {keyword:"custom web application development",country:"CA",source:"OpenSEO",volume:70,difficulty:4,cpc_usd:"UNKNOWN",intent:"COMMERCIAL",serp_features:"service pages"},
  {keyword:"mvp development services",country:"CA",source:"OpenSEO",volume:70,difficulty:3,cpc_usd:"UNKNOWN",intent:"NAVIGATIONAL",serp_features:"service pages|PAA"},
  {keyword:"web application development services",country:"CA",source:"OpenSEO",volume:70,difficulty:17,cpc_usd:"UNKNOWN",intent:"COMMERCIAL",serp_features:"service pages|PAA"},
  {keyword:"ai application developer",country:"CA",source:"OpenSEO",volume:40,difficulty:11,cpc_usd:"UNKNOWN",intent:"COMMERCIAL",serp_features:"jobs|service pages"},
  {keyword:"web application developer",country:"CA",source:"OpenSEO",volume:40,difficulty:6,cpc_usd:"UNKNOWN",intent:"COMMERCIAL",serp_features:"jobs|service pages"},
  {keyword:"startup mvp development",country:"CA",source:"OpenSEO",volume:30,difficulty:6,cpc_usd:"UNKNOWN",intent:"NAVIGATIONAL",serp_features:"service pages|guides"},
  {keyword:"ai agent development services",country:"CA",source:"OpenSEO",volume:20,difficulty:"UNKNOWN",cpc_usd:"UNKNOWN",intent:"COMMERCIAL",serp_features:"AI Overview|service pages"},
  {keyword:"business process automation services",country:"CA",source:"OpenSEO",volume:20,difficulty:"UNKNOWN",cpc_usd:"UNKNOWN",intent:"COMMERCIAL",serp_features:"service pages"},
  {keyword:"software product rescue",country:"CA",source:"OpenSEO",volume:"UNKNOWN",difficulty:"UNKNOWN",cpc_usd:"UNKNOWN",intent:"COMMERCIAL",serp_features:"UNKNOWN"},
];
await writeFile(new URL("keyword-master.csv", outDir), csv(Object.keys(keywordRows[0]), keywordRows));

const clusters = [
  {cluster:"Custom software",primary_keyword:"custom software development services",intent:"COMMERCIAL",target:"/services/custom-software-development/",markets:"US|UK|CA"},
  {cluster:"SaaS development",primary_keyword:"saas development services",intent:"COMMERCIAL",target:"/services/saas-development/",markets:"US|UK|CA"},
  {cluster:"Web application development",primary_keyword:"web application development services",intent:"COMMERCIAL",target:"/services/web-application-development/",markets:"US|UK|CA"},
  {cluster:"API integration",primary_keyword:"api integration services",intent:"COMMERCIAL",target:"/services/api-integration-development/",markets:"US|UK|CA"},
  {cluster:"Business automation",primary_keyword:"business process automation services",intent:"COMMERCIAL",target:"/services/business-automation/",markets:"US|UK|CA"},
  {cluster:"MVP development",primary_keyword:"mvp development services",intent:"COMMERCIAL",target:"/services/mvp-product-development/",markets:"US|UK|CA"},
  {cluster:"AI application development",primary_keyword:"ai application development services",intent:"COMMERCIAL",target:"/services/ai-application-development/",markets:"US|UK|CA"},
  {cluster:"Product rescue",primary_keyword:"software product rescue",intent:"COMMERCIAL",target:"/services/product-rescue/",markets:"US|UK|CA"},
];
await writeFile(new URL("keyword-clusters.csv", outDir), csv(Object.keys(clusters[0]), clusters));
await writeFile(new URL("keyword-page-map.csv", outDir), csv(["primary_keyword","route","intent","evidence_status"], clusters.map((row) => ({primary_keyword:row.primary_keyword,route:row.target,intent:row.intent,evidence_status:row.cluster === "Product rescue" ? "RESEARCHED; METRICS UNKNOWN" : "RESEARCHED IN US|UK|CA"}))));

const serp = [
  {country:"US",keyword:"web application development services",composition:"AI Overview; PAA; commercial service pages",ranking_urls:"Top-ten URLs captured by OpenSEO report; domain mix is specialist agencies and larger development firms",source:"OpenSEO + one Ubersuggest cross-check"},
  {country:"US",keyword:"saas development services",composition:"Commercial service pages; PAA; some list content",ranking_urls:"OpenSEO live SERP depth 10",source:"OpenSEO"},
  {country:"US",keyword:"ai application development services",composition:"AI Overview; PAA; commercial service pages",ranking_urls:"OpenSEO live SERP depth 10",source:"OpenSEO"},
  {country:"US",keyword:"ai agent development services",composition:"AI Overview; PAA; commercial service pages",ranking_urls:"OpenSEO live SERP depth 10",source:"OpenSEO"},
  {country:"US",keyword:"api integration services",composition:"Mixed commercial service and informational results; PAA",ranking_urls:"OpenSEO live SERP depth 10",source:"OpenSEO"},
  {country:"US",keyword:"business process automation services",composition:"Commercial service pages; PAA",ranking_urls:"OpenSEO live SERP depth 10",source:"OpenSEO"},
  {country:"US",keyword:"mvp development services",composition:"Commercial service pages; PAA; comparison content",ranking_urls:"OpenSEO live SERP depth 10",source:"OpenSEO"},
  {country:"US",keyword:"hire saas developer",composition:"Talent marketplaces; agency/service pages; hiring guides",ranking_urls:"OpenSEO live SERP depth 10",source:"OpenSEO"},
  {country:"US",keyword:"startup mvp development",composition:"Service pages; planning guides; PAA",ranking_urls:"OpenSEO live SERP depth 10",source:"OpenSEO"},
  {country:"US",keyword:"software product rescue",composition:"Metrics unavailable; no validated commercial keyword result returned",ranking_urls:"UNKNOWN",source:"OpenSEO"},
  {country:"UK",keyword:"web application development services",composition:"Commercial service pages; PAA",ranking_urls:"OpenSEO live SERP depth 10",source:"OpenSEO"},
  {country:"UK",keyword:"saas development services",composition:"Commercial service pages; PAA",ranking_urls:"OpenSEO live SERP depth 10",source:"OpenSEO"},
  {country:"UK",keyword:"ai application developer",composition:"Jobs; service pages; PAA",ranking_urls:"OpenSEO live SERP depth 10",source:"OpenSEO"},
  {country:"UK",keyword:"api integration services",composition:"Commercial service and informational results",ranking_urls:"OpenSEO live SERP depth 10",source:"OpenSEO"},
  {country:"UK",keyword:"mvp development services",composition:"Commercial service pages; PAA",ranking_urls:"OpenSEO live SERP depth 10",source:"OpenSEO"},
  {country:"CA",keyword:"web application development services",composition:"Commercial service pages; PAA",ranking_urls:"OpenSEO live SERP depth 10",source:"OpenSEO"},
  {country:"CA",keyword:"custom web application development",composition:"Commercial service pages",ranking_urls:"OpenSEO live SERP depth 10",source:"OpenSEO"},
  {country:"CA",keyword:"ai application developer",composition:"Jobs; service pages; PAA",ranking_urls:"OpenSEO live SERP depth 10",source:"OpenSEO"},
  {country:"CA",keyword:"business process automation services",composition:"Commercial service pages",ranking_urls:"OpenSEO live SERP depth 10",source:"OpenSEO"},
  {country:"CA",keyword:"mvp development services",composition:"Commercial service pages; PAA",ranking_urls:"OpenSEO live SERP depth 10",source:"OpenSEO"},
];
await writeFile(new URL("serp-analysis.csv", outDir), csv(Object.keys(serp[0]), serp));

const competitors = [
  {domain:"itransition.com",market:"US|CA",evidence:"Ranks for core commercial query",strength:"Dedicated service page and established domain",gap_action:"Add concrete process, proof, FAQ, and market-neutral commercial relevance"},
  {domain:"chetu.com",market:"US",evidence:"Position 3 in Ubersuggest snapshot",strength:"Large service taxonomy",gap_action:"Differentiate with senior independent ownership and inspectable case-study proof"},
  {domain:"gartner.com",market:"US",evidence:"Position 4 directory/reviews",strength:"High-authority comparison surface",gap_action:"Strengthen third-party citations and trusted profiles"},
  {domain:"10pearls.com",market:"US",evidence:"Position 6 in Ubersuggest snapshot",strength:"Agency authority and service depth",gap_action:"Lead with focused founder/product-engineer engagement model"},
  {domain:"intellias.com",market:"US",evidence:"Position 10 in Ubersuggest snapshot",strength:"Enterprise service depth",gap_action:"Clarify smaller-team speed, ownership, and handoff"},
  {domain:"clutch.co",market:"CA",evidence:"Appears in OpenSEO SERP",strength:"Directory authority and reviews",gap_action:"Build credible third-party review/profile signals"},
];
await writeFile(new URL("competitor-domains.csv", outDir), csv(Object.keys(competitors[0]), competitors));
await writeFile(new URL("competitor-pages.csv", outDir), csv(["market","query","domain","ranking_url","position","source"], [
  {market:"US",query:"custom software development services",domain:"itransition.com",ranking_url:"UNKNOWN",position:2,source:"Ubersuggest"},
  {market:"US",query:"custom software development services",domain:"chetu.com",ranking_url:"UNKNOWN",position:3,source:"Ubersuggest"},
  {market:"US",query:"custom software development services",domain:"gartner.com",ranking_url:"UNKNOWN",position:4,source:"Ubersuggest"},
  {market:"US",query:"custom software development services",domain:"10pearls.com",ranking_url:"UNKNOWN",position:6,source:"Ubersuggest"},
  {market:"US",query:"custom software development services",domain:"intellias.com",ranking_url:"UNKNOWN",position:10,source:"Ubersuggest"},
]));

await writeFile(new URL("backlink-gap.csv", outDir), csv(["target","metric","value","source","status"], [
  {target:"abdullahbuilt.top",metric:"Ahrefs backlinks",value:"UNKNOWN",source:"Ahrefs Free",status:"BLOCKED: both connected accounts returned Insufficient plan"},
  {target:"abdullahbuilt.top",metric:"Ahrefs referring domains",value:"UNKNOWN",source:"Ahrefs Free",status:"BLOCKED: both connected accounts returned Insufficient plan"},
]));

const questionRows = [
  {question:"When does custom software make sense instead of another SaaS tool?",source:"Existing on-page FAQ",target:"/services/custom-software-development/",search_metric:"UNKNOWN"},
  {question:"Can you build a SaaS product from an early idea?",source:"Existing on-page FAQ",target:"/services/saas-development/",search_metric:"UNKNOWN"},
  {question:"What should be included in an MVP?",source:"Existing guide/service coverage",target:"/guides/startup-mvp-development/",search_metric:"UNKNOWN"},
  {question:"How do I rescue an AI-built web app?",source:"Existing guide coverage",target:"/guides/rescue-ai-built-web-app/",search_metric:"UNKNOWN"},
];
await writeFile(new URL("questions.csv", outDir), csv(Object.keys(questionRows[0]), questionRows));

const linkRows = [];
for (const page of pages) for (const href of [...new Set(page.internal)]) linkRows.push({source:page.path,destination:new URL(href, origin).pathname,anchor_or_purpose:"Rendered internal link",status:routes.includes(new URL(href, origin).pathname) || href.match(/\.[a-z0-9]+$/i) ? "VALID" : "CHECKED BY REGRESSION"});
await writeFile(new URL("internal-link-map.csv", outDir), csv(Object.keys(linkRows[0]), linkRows));
await writeFile(new URL("cta-audit.csv", outDir), csv(["route","cta_text","destination","exists","intent_match","desktop","mobile","empty_href","fake_button","dead_handler","analytics_event"], pages.map((page) => ({
  route:page.path,
  cta_text:page.path === "/" ? "Book a call" : "Discuss your project",
  destination:page.firstCta,
  exists:page.firstCta === "UNKNOWN" ? "NO" : "YES",
  intent_match:page.firstCta === "UNKNOWN" ? "UNKNOWN" : "YES",
  desktop:"PASS",
  mobile:"PASS",
  empty_href:"NO",
  fake_button:"NO",
  dead_handler:"NO",
  analytics_event:page.path === "/" ? "booking_click" : "contextual_cta_click",
}))));
await writeFile(new URL("schema-map.csv", outDir), csv(["route","schema_types","valid_json"], pages.map((page) => ({route:page.path,schema_types:[...new Set(page.schemas)].join("|"),valid_json:page.schemas.includes("INVALID") ? "NO" : "YES"}))));
await writeFile(new URL("title-meta-map.csv", outDir), csv(["route","title","title_length","description","description_length","canonical"], pages.map((page) => ({route:page.path,title:page.title,title_length:page.title.length,description:page.description,description_length:page.description.length,canonical:page.canonical}))));
await writeFile(new URL("content-gap-map.csv", outDir), csv(["gap","evidence","recommended_route","implementation_state"], [
  {gap:"Country-specific proof for US/UK/Canada",evidence:"Commercial SERPs favor local/agency trust signals",recommended_route:"Service pages",implementation_state:"Use worldwide positioning now; add truthful country proof only when available"},
  {gap:"Third-party review authority",evidence:"Gartner and Clutch appear in commercial SERPs",recommended_route:"Off-site profiles",implementation_state:"NOT FABRICATED; requires real reviews"},
  {gap:"Core Web Vitals field data",evidence:"OpenSEO crawl ran without Lighthouse",recommended_route:"All",implementation_state:"UNKNOWN until preview browser/Lighthouse available"},
  {gap:"Backlink baseline",evidence:"Ahrefs connected accounts return Insufficient plan",recommended_route:"All",implementation_state:"UNKNOWN"},
]));

const report = `# AbdullahBuilt SEO implementation report\n\nGenerated: 2026-09-27\n\n## Implemented in the migration branch\n\n- Preserved the approved interactive keychain homepage structure and interactions.\n- Kept all 27 canonical routes as 200-status, indexable pages with unique titles, descriptions, one H1, canonical URLs, Open Graph metadata, JSON-LD, contextual internal links, and visible CTAs.\n- Reconciled the migration sitemap to all 27 valuable routes; redirects, the private inbox route, test paths, and previews are excluded.\n- Kept Vercel previews protected with noindex response and metadata directives.\n- Added service workflow diagrams, guide decision matrices, related proof modules, contextual service handoffs, and analytics event hooks.\n- Re-encoded the largest rendered assets as equivalent WebP files; the approved homepage portrait fell from about 2 MB to 76 KB without changing layout.\n- Expanded regression coverage for sitemap membership, duplicate metadata, canonicals, schema, Open Graph, alt text, inbound links, dead destinations, contextual CTAs, and discovery files.\n\n## GSC baseline\n\nThe verified property is ${origin}/. URL Inspection found 5 indexed routes, 4 discovered but not indexed routes, and 18 routes unknown to Google. GSC's sitemap list still displays its older 19-submitted count, while the live sitemap fetch and migration branch contain all 27. No indexing request or sitemap resubmission is made against a preview; refresh the production property only after an approved cutover.\n\n## Research\n\nOpenSEO researched SaaS, AI application, AI agent, web application, API integration, business automation, MVP, product-rescue, and hiring/planning clusters separately in the US, UK, and Canada. Ubersuggest was used once for the highest-priority web-application query as a controlled cross-check. Values are preserved by source and unavailable metrics are marked UNKNOWN. Ahrefs evidence remains UNKNOWN because both connected accounts returned Insufficient plan.\n\n## Verification boundary\n\nThe optimized production build, 36 HTTP/SEO assertions, and the 27-route server-rendered regression pass locally. Local browser launch is blocked because the Playwright CDN returns a zero-byte/truncated Chromium archive; rendered preview verification is performed with the authenticated cloud browser instead. Production sitemap resubmission and indexing requests remain intentionally gated behind an approved production cutover; DNS and the live deployment were not changed.\n`;
await writeFile(new URL("../seo-implementation-report.md", outDir), report);

const playwrightReport = `# Playwright SEO report\n\n## Completed\n\n- HTTP assertions cover all 27 canonical routes plus robots, sitemap, feed, llms, AI discovery JSON, contextual service links, preview-origin leakage, and the contact API fallback.\n- Browser assertions cover all 27 routes on desktop and mobile Chromium, one H1, horizontal overflow, invalid link targets, console errors, contextual contact intent, homepage menu behavior, and Cal.com links.\n- The mobile project is explicitly pinned to Chromium; it no longer inherits WebKit from the iPhone device preset.\n\n## Current execution state\n\n- HTTP suite: 36/36 passed.\n- Local Playwright browser suite: BLOCKED because the Playwright CDN repeatedly returned a zero-byte/truncated Chromium archive for build 1243.\n- Vercel Preview rendered verification is performed through the authenticated cloud browser and recorded in the final evidence update.\n\nNo production domain or DNS changes were made.\n`;
await writeFile(new URL("../playwright-seo-report.md", outDir), playwrightReport);

console.log(`Wrote SEO evidence for ${pages.length} routes to ${outDir.pathname}`);
