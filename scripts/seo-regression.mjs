const args = Object.fromEntries(process.argv.slice(2).map((value, index, all) => value.startsWith("--") ? [value.slice(2), all[index + 1]?.startsWith("--") ? true : all[index + 1]] : null).filter(Boolean));
const baseUrl = String(args["base-url"] || "http://127.0.0.1:3000").replace(/\/$/, "");
const canonicalOrigin = String(args["canonical-origin"] || "https://abdullahbuilt.top").replace(/\/$/, "");
const failures = [];
const pages = [];

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
  if (!title || title.length < 20 || title.length > 70) fail(path, `title length ${title.length}`);
  if (!description || description.length < 80 || description.length > 180) fail(path, `meta description length ${description.length}`);
  const expectedCanonical = path === "/" ? [canonicalOrigin, `${canonicalOrigin}/`] : [`${canonicalOrigin}${path}`];
  if (!expectedCanonical.includes(canonical)) fail(path, `canonical mismatch: ${canonical || "missing"}`);
  if (h1Count !== 1) fail(path, `expected one H1, found ${h1Count}`);
  if (noindex) fail(path, "unexpected noindex");
  if (!jsonLd.length) fail(path, "missing JSON-LD");
  jsonLd.forEach((value, index) => { try { JSON.parse(value.replaceAll("&quot;", '"').replaceAll("&amp;", "&")); } catch { fail(path, `invalid JSON-LD block ${index + 1}`); } });
  pages.push({ path, status: response.status, title, descriptionLength: description.length, h1Count, jsonLdBlocks: jsonLd.length });
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
