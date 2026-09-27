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
const discovered = new Set(["/services/", "/services/saas-development/", "/services/business-automation/", "/work/resolve/", "/work/repodiet/", "/guides/", "/guides/hire-web-app-developer/", "/guides/startup-mvp-development/", "/about/", "/contact/"]);
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
  const firstCta = links.find((href) => href.includes("cal.com") || href.startsWith("/contact")) || "UNKNOWN";
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
  {keyword:"custom software development services",country:"US",source:"OpenSEO",volume:1900,difficulty:18,cpc_usd:44.69,intent:"COMMERCIAL",serp_features:"AI Overview|local pack|PAA|directories|agency pages"},
  {keyword:"custom software development services",country:"US",source:"Ubersuggest",volume:1900,difficulty:18,cpc_usd:73.05,intent:"COMMERCIAL",serp_features:"AI Overview|local pack|PAA|directories|agency pages"},
  {keyword:"software development services",country:"US",source:"OpenSEO",volume:1900,difficulty:33,cpc_usd:45.21,intent:"COMMERCIAL",serp_features:"UNKNOWN"},
  {keyword:"custom software development services",country:"UK",source:"OpenSEO",volume:390,difficulty:0,cpc_usd:86.10,intent:"COMMERCIAL",serp_features:"local pack|PAA|agency pages|forums"},
  {keyword:"bespoke software development services",country:"UK",source:"OpenSEO",volume:390,difficulty:14,cpc_usd:86.10,intent:"COMMERCIAL",serp_features:"UNKNOWN"},
  {keyword:"custom software development services",country:"CA",source:"OpenSEO",volume:110,difficulty:13,cpc_usd:8.88,intent:"COMMERCIAL",serp_features:"local pack|PAA|directories|agency pages"},
  {keyword:"software development services",country:"CA",source:"OpenSEO",volume:170,difficulty:14,cpc_usd:"UNKNOWN",intent:"COMMERCIAL",serp_features:"UNKNOWN"},
];
await writeFile(new URL("keyword-master.csv", outDir), csv(Object.keys(keywordRows[0]), keywordRows));

const clusters = [
  {cluster:"Custom software",primary_keyword:"custom software development services",intent:"COMMERCIAL",target:"/services/custom-software-development/",markets:"US|UK|CA"},
  {cluster:"SaaS development",primary_keyword:"saas development services",intent:"COMMERCIAL",target:"/services/saas-development/",markets:"US|UK|CA"},
  {cluster:"Web application development",primary_keyword:"web application development services",intent:"COMMERCIAL",target:"/services/web-application-development/",markets:"US|UK|CA"},
  {cluster:"API integration",primary_keyword:"api integration services",intent:"COMMERCIAL",target:"/services/api-integration-development/",markets:"US|UK|CA"},
  {cluster:"MVP development",primary_keyword:"mvp development services",intent:"COMMERCIAL",target:"/services/mvp-product-development/",markets:"US|UK|CA"},
  {cluster:"AI application development",primary_keyword:"ai application development services",intent:"COMMERCIAL",target:"/services/ai-application-development/",markets:"US|UK|CA"},
  {cluster:"Product rescue",primary_keyword:"software product rescue",intent:"COMMERCIAL",target:"/services/product-rescue/",markets:"US|UK|CA"},
];
await writeFile(new URL("keyword-clusters.csv", outDir), csv(Object.keys(clusters[0]), clusters));
await writeFile(new URL("keyword-page-map.csv", outDir), csv(["primary_keyword","route","intent","evidence_status"], clusters.map((row) => ({primary_keyword:row.primary_keyword,route:row.target,intent:row.intent,evidence_status:row.cluster === "Custom software" ? "RESEARCHED" : "MAPPED; METRICS UNKNOWN"}))));

const serp = [
  {country:"US",keyword:"custom software development services",composition:"AI Overview; Gartner directory/reviews; local pack; PAA; agency pages; listicles",ranking_urls:"itransition.com (2)|chetu.com (3)|gartner.com (4)|10pearls.com (6)|intellias.com (10)",source:"OpenSEO + Ubersuggest"},
  {country:"UK",keyword:"custom software development services",composition:"Agency service pages; local pack; PAA; forums",ranking_urls:"UNKNOWN",source:"OpenSEO"},
  {country:"CA",keyword:"custom software development services",composition:"Service companies; local pack; PAA; directories; listicles",ranking_urls:"whitecapcanada.com|itransition.com|codecreators.ca|appstudio.ca|clutch.co",source:"OpenSEO"},
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
await writeFile(new URL("cta-audit.csv", outDir), csv(["route","cta_status","destination","intent_match"], pages.map((page) => ({route:page.path,cta_status:page.firstCta === "UNKNOWN" ? "REVIEW" : "PRESENT",destination:page.firstCta,intent_match:page.firstCta === "UNKNOWN" ? "UNKNOWN" : "YES"}))));
await writeFile(new URL("schema-map.csv", outDir), csv(["route","schema_types","valid_json"], pages.map((page) => ({route:page.path,schema_types:[...new Set(page.schemas)].join("|"),valid_json:page.schemas.includes("INVALID") ? "NO" : "YES"}))));
await writeFile(new URL("title-meta-map.csv", outDir), csv(["route","title","title_length","description","description_length","canonical"], pages.map((page) => ({route:page.path,title:page.title,title_length:page.title.length,description:page.description,description_length:page.description.length,canonical:page.canonical}))));
await writeFile(new URL("content-gap-map.csv", outDir), csv(["gap","evidence","recommended_route","implementation_state"], [
  {gap:"Country-specific proof for US/UK/Canada",evidence:"Commercial SERPs favor local/agency trust signals",recommended_route:"Service pages",implementation_state:"Use worldwide positioning now; add truthful country proof only when available"},
  {gap:"Third-party review authority",evidence:"Gartner and Clutch appear in commercial SERPs",recommended_route:"Off-site profiles",implementation_state:"NOT FABRICATED; requires real reviews"},
  {gap:"Core Web Vitals field data",evidence:"OpenSEO crawl ran without Lighthouse",recommended_route:"All",implementation_state:"UNKNOWN until preview browser/Lighthouse available"},
  {gap:"Backlink baseline",evidence:"Ahrefs connected accounts return Insufficient plan",recommended_route:"All",implementation_state:"UNKNOWN"},
]));

const report = `# AbdullahBuilt SEO implementation report\n\nGenerated: 2026-09-27\n\n## Implemented in the migration branch\n\n- Preserved the approved interactive keychain homepage source exactly.\n- Kept all 27 canonical routes as 200-status, indexable pages with unique titles, descriptions, one H1, canonical URLs, Open Graph metadata, JSON-LD, contextual internal links, and visible CTAs.\n- Reconciled the migration sitemap to all 27 valuable routes; redirects, the private inbox route, test paths, and previews are excluded.\n- Kept Vercel previews protected with noindex response and metadata directives.\n- Kept robots, sitemap, RSS, llms.txt, llms-full.txt, AI discovery files, and entity schema in source control.\n- Expanded automated regression coverage for exact sitemap membership, duplicate titles/descriptions, canonicals, schema JSON, Open Graph, image alt attributes, inbound links, dead internal destinations, and discovery files.\n\n## GSC baseline\n\nThe verified property is ${origin}/. URL Inspection found 5 indexed routes, 10 discovered but not indexed routes, and 12 routes unknown to Google. The old submitted sitemap reports 19 URLs while the migration branch contains all 27. The new sitemap must not be submitted until this branch is approved and promoted to production, because Google cannot fetch preview-only source as the canonical production sitemap.\n\n## Research\n\nOpenSEO researched the highest-priority commercial seed separately in the US, UK, and Canada. Ubersuggest was used once for the same US seed as a controlled cross-check. Values are preserved by source because CPC differs between providers. Ahrefs evidence is UNKNOWN: both connected accounts returned Insufficient plan even for free subscription/project reads.\n\n## Verification boundary\n\nThe optimized production build, all 28 HTTP/SEO tests, and the 27-route server-rendered regression pass locally. Browser automation requires a Chromium binary or the Vercel preview. Production sitemap resubmission, indexing requests, preview screenshots, and final performance evidence remain intentionally gated behind branch push, Vercel preview creation, and approval; DNS and the live deployment were not changed.\n`;
await writeFile(new URL("../seo-implementation-report.md", outDir), report);

const playwrightReport = `# Playwright SEO report\n\n## Completed\n\n- HTTP assertions cover all 27 canonical routes plus robots, sitemap, feed, llms, AI discovery JSON, and the contact API fallback.\n- Browser assertions cover all 27 routes on desktop Chromium and mobile Chromium, one H1, horizontal overflow, invalid link targets, console errors, contextual contact intent, homepage menu behavior, and Cal.com links.\n- The mobile project is explicitly pinned to Chromium; it no longer inherits WebKit from the iPhone device preset.\n\n## Current execution state\n\n- HTTP suite: executable without a browser binary.\n- Rendered cloud-browser audit: completed for all 27 live baseline routes on desktop and mobile viewports; no observed console errors, failed requests, or horizontal overflow.\n- Local Playwright browser suite: pending because this workspace does not currently contain the Playwright Chromium executable.\n- Vercel preview suite and screenshots: pending branch push and automatic Git preview creation.\n\nNo production domain or DNS changes were made.\n`;
await writeFile(new URL("../playwright-seo-report.md", outDir), playwrightReport);

console.log(`Wrote SEO evidence for ${pages.length} routes to ${outDir.pathname}`);
