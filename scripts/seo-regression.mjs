const args = Object.fromEntries(process.argv.slice(2).map((value, index, all) => value.startsWith("--") ? [value.slice(2), all[index + 1]?.startsWith("--") ? true : all[index + 1]] : null).filter(Boolean));
const baseUrl = String(args["base-url"] || "http://127.0.0.1:3000").replace(/\/$/, "");
const canonicalOrigin = String(args["canonical-origin"] || "https://abdullahbuilt.top").replace(/\/$/, "");
const failures = [];
const pages = [];
const expectedPaths = [
  "/", "/services/", "/services/custom-software-development/", "/services/saas-development/",
  "/services/web-application-development/", "/services/api-integration-development/", "/services/business-automation/",
  "/services/mvp-product-development/", "/services/ai-application-development/", "/services/product-rescue/",
  "/work/", "/work/resolve/", "/work/meridian/", "/work/repodiet/", "/work/agora-forge/",
  "/guides/", "/guides/hire-saas-developer/", "/guides/hire-web-app-developer/",
  "/guides/startup-mvp-development/", "/guides/custom-software-vs-saas/", "/guides/saas-mvp-development-cost/",
  "/guides/api-integration-planning/", "/guides/rescue-ai-built-web-app/", "/guides/ai-feature-vs-automation/",
  "/guides/reliable-webhook-integration/", "/about/", "/contact/",
];

const fetchText = async (path) => {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "manual", headers: { "user-agent": "AbdullahBuilt-SEO-Regression/1.0" } });
  const text = await response.text();
  return { response, text };
};

const one = (html, pattern) => html.match(pattern)?.[1]?.trim() || "";
const all = (html, pattern) => [...html.matchAll(pattern)].map((match) => match[1]);
const fail = (path, message) => failures.push({ path, message });

const sitemapResult = await fetchText("/sitemap.xml");
if (sitemapResult.response.status !== 200) throw new Error(`sitemap.xml returned ${sitemapResult.response.status}`);
const urls = all(sitemapResult.text, /<loc>([^<]+)<\/loc>/g);
if (!urls.length) throw new Error("sitemap.xml has no URLs");
const sitemapPaths = urls.map((url) => new URL(url).pathname);
if (new Set(urls).size !== urls.length) fail("/sitemap.xml", "contains duplicate URLs");
if (urls.some((url) => !url.startsWith(`${canonicalOrigin}/`))) fail("/sitemap.xml", "contains a non-canonical origin");
for (const path of expectedPaths) if (!sitemapPaths.includes(path)) fail("/sitemap.xml", `missing ${path}`);
for (const path of sitemapPaths) if (!expectedPaths.includes(path)) fail("/sitemap.xml", `unexpected ${path}`);

const titleOwners = new Map();
const descriptionOwners = new Map();
const linkedPaths = new Set();

for (const absoluteUrl of urls) {
  const expected = new URL(absoluteUrl);
  const path = expected.pathname;
  const { response, text: html } = await fetchText(path);
  if (response.status !== 200) fail(path, `HTTP ${response.status}`);
  const title = one(html, /<title[^>]*>([^<]+)<\/title>/i);
  const description = one(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) || one(html, /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
  const canonical = one(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) || one(html, /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  const h1Count = all(html, /<h1\b[^>]*>/gi).length;
  const noindex = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
  const jsonLd = all(html, /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  const ogTitle = one(html, /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) || one(html, /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
  const ogDescription = one(html, /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) || one(html, /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i);
  const ogImage = one(html, /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) || one(html, /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  const links = all(html, /<a\b[^>]+href=["']([^"']+)["']/gi);
  const images = [...html.matchAll(/<img\b([^>]*)>/gi)];
  if (!title || title.length < 20 || title.length > 70) fail(path, `title length ${title.length}`);
  if (!description || description.length < 80 || description.length > 180) fail(path, `meta description length ${description.length}`);
  const expectedCanonical = path === "/" ? [canonicalOrigin, `${canonicalOrigin}/`] : [`${canonicalOrigin}${path}`];
  if (!expectedCanonical.includes(canonical)) fail(path, `canonical mismatch: ${canonical || "missing"}`);
  if (h1Count !== 1) fail(path, `expected one H1, found ${h1Count}`);
  if (noindex) fail(path, "unexpected noindex");
  if (!jsonLd.length) fail(path, "missing JSON-LD");
  if (!ogTitle || !ogDescription || !ogImage) fail(path, "incomplete Open Graph metadata");
  if (titleOwners.has(title)) fail(path, `duplicate title also used by ${titleOwners.get(title)}`); else titleOwners.set(title, path);
  if (descriptionOwners.has(description)) fail(path, `duplicate meta description also used by ${descriptionOwners.get(description)}`); else descriptionOwners.set(description, path);
  for (const href of links) {
    if (/^(#|mailto:|tel:|javascript:)/i.test(href)) continue;
    let target;
    try { target = new URL(href, canonicalOrigin); } catch { fail(path, `invalid link ${href}`); continue; }
    if (target.origin === canonicalOrigin) linkedPaths.add(target.pathname.endsWith("/") || target.pathname.includes(".") ? target.pathname : `${target.pathname}/`);
  }
  for (const image of images) {
    if (!/\balt=["'][^"']*["']/i.test(image[1])) fail(path, "image missing alt attribute");
  }
  jsonLd.forEach((value, index) => { try { JSON.parse(value.replaceAll("&quot;", '"').replaceAll("&amp;", "&")); } catch { fail(path, `invalid JSON-LD block ${index + 1}`); } });
  pages.push({ path, status: response.status, title, descriptionLength: description.length, h1Count, jsonLdBlocks: jsonLd.length, internalLinks: links.filter(href => href.startsWith("/")).length, images: images.length });
}

for (const path of expectedPaths.filter((value) => value !== "/")) {
  if (!linkedPaths.has(path)) fail(path, "no internal inbound link found in the audited route set");
}

for (const path of [...linkedPaths].filter((value) => value !== "/inbox/" && !value.startsWith("/_next/") && !value.match(/\.[a-z0-9]+$/i))) {
  const { response } = await fetchText(path);
  if (response.status >= 400) fail(path, `internal destination returned ${response.status}`);
}

for (const path of ["/robots.txt", "/llms.txt", "/llms-full.txt", "/.well-known/ai.txt", "/ai/summary.json", "/ai/service.json", "/ai/faq.json", "/feed.xml"]) {
  const { response, text } = await fetchText(path);
  if (response.status !== 200 || !text.trim()) fail(path, `discovery resource returned ${response.status} or was empty`);
  if (path.endsWith(".json")) { try { JSON.parse(text); } catch { fail(path, "invalid JSON"); } }
}

const robots = (await fetchText("/robots.txt")).text;
for (const bot of ["OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot"]) {
  if (!robots.includes(`User-agent: ${bot}`)) fail("/robots.txt", `missing explicit ${bot} policy`);
}
if (!robots.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`)) fail("/robots.txt", "missing canonical sitemap directive");

const result = { auditedAt: new Date().toISOString(), baseUrl, canonicalOrigin, urlCount: urls.length, passed: failures.length === 0, failures, pages };
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exitCode = 1;
