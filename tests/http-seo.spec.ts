import { expect, test } from "@playwright/test";

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

const serviceSlugs = [
  "custom-software-development", "saas-development", "web-application-development",
  "api-integration-development", "business-automation", "mvp-product-development",
  "ai-application-development", "product-rescue",
];

for (const route of routes) {
  test(`${route} returns complete indexable HTML`, async ({ request }) => {
    const response = await request.get(route);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain('<link rel="canonical" href="https://abdullahbuilt.top');
    expect((html.match(/<h1\b/g) || []).length).toBe(1);
    expect(html).toContain('type="application/ld+json"');
    expect(html).not.toMatch(/name="robots"[^>]+noindex/i);
    expect(html).not.toMatch(/<link[^>]+rel="canonical"[^>]+vercel\.app/i);
    expect(html).not.toMatch(/<meta[^>]+property="og:url"[^>]+vercel\.app/i);
  });
}

for (const slug of serviceSlugs) {
  test(`${slug} has a contextual contact path`, async ({ request }) => {
    const response = await request.get(`/services/${slug}/`);
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain(`/contact/?service=${slug}`);
  });
}

test("discovery files and contact fallback work", async ({ request }) => {
  for (const route of ["/robots.txt", "/sitemap.xml", "/feed.xml", "/llms.txt", "/llms-full.txt", "/.well-known/ai.txt", "/ai/summary.json", "/ai/service.json", "/ai/faq.json"]) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(200);
    expect((await response.body()).byteLength, route).toBeGreaterThan(20);
  }
  const response = await request.post("/api/contact/", { data: { name: "QA Tester", email: "qa@example.com", message: "Test inquiry", service: "ai-application-development" } });
  expect(response.status()).toBe(201);
  expect(await response.json()).toEqual({ received: true, emailed: false });
});

test("every route ships parseable JSON-LD with apex-only @id and url values", async ({ request }) => {
  for (const route of routes) {
    const html = await (await request.get(route)).text();
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => match[1]);
    expect(blocks.length, route).toBeGreaterThan(0);
    for (const block of blocks) {
      const data = JSON.parse(block);
      const ids = JSON.stringify(data).match(/"(?:@id|url|item)":"[^"]+"/g) || [];
      for (const id of ids) if (!/mailto:|github\.com|linkedin\.com|facebook\.com|useresolve\.stream|meridianarc\.stream|repodiet\.uk|circle-arc-net\.vercel\.app/.test(id)) expect(id, route).toMatch(/https:\/\/abdullahbuilt\.top\//);
    }
  }
});

test("sitemap lists exactly the 27 canonical routes", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  const locs = [...xml.matchAll(/<loc>https:\/\/abdullahbuilt\.top([^<]*)<\/loc>/g)].map(match => match[1]).sort();
  expect(locs).toEqual([...routes].sort());
});

test("titles carry the AbdullahBuilt brand consistently", async ({ request }) => {
  for (const route of routes) {
    const title = ((await (await request.get(route)).text()).match(/<title>([^<]*)<\/title>/) || [])[1] || "";
    if (route === "/") expect(title).toMatch(/^AbdullahBuilt \| Muhammad Abdullah/);
    else expect(title, route).toMatch(/\| AbdullahBuilt$/);
    expect(title, route).not.toContain("Abdullah Built");
  }
});

test("entity graph links Muhammad Abdullah to the AbdullahBuilt brand", async ({ request }) => {
  const html = await (await request.get("/")).text();
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)![1])["@graph"];
  const person = graph.find((node: { "@type": string }) => node["@type"] === "Person");
  const brand = graph.find((node: { "@type": string }) => node["@type"] === "ProfessionalService");
  expect(person.brand["@id"]).toBe("https://abdullahbuilt.top/#business");
  expect(brand.name).toBe("AbdullahBuilt");
  expect(brand.founder["@id"]).toBe("https://abdullahbuilt.top/#person");
});

test("vercel.app aliases are noindex while the canonical host stays indexable", async ({ request }) => {
  const alias = await request.get("/services/", { headers: { host: "abdullahbuilt-portfolio.vercel.app" } });
  expect(alias.headers()["x-robots-tag"] || "").toContain("noindex");
  const canonical = await request.get("/services/", { headers: { host: "abdullahbuilt.top" } });
  expect(canonical.headers()["x-robots-tag"] || "").not.toContain("noindex");
});

const projectLive: Record<string, string> = {
  resolve: "https://www.useresolve.stream",
  meridian: "https://meridianarc.stream",
  repodiet: "https://repodiet.uk",
  "agora-forge": "https://circle-arc-net.vercel.app/",
};
const staleProjectHosts = /resolve-task\.vercel\.app|resolve-self\.vercel\.app|trader-arc\.vercel\.app|skillswap-skillswap7\.vercel\.app|skillswap-virid-kappa\.vercel\.app/;
const profiles = {
  linkedin: "https://www.linkedin.com/in/muhammad-abdullah-builder",
  facebook: "https://www.facebook.com/mabdullah.built/",
  github: "https://github.com/velz-cmd",
};

test("case studies link to the owner-confirmed project domains and state the role", async ({ request }) => {
  for (const [slug, live] of Object.entries(projectLive)) {
    const html = await (await request.get(`/work/${slug}/`)).text();
    const hrefs = [...html.matchAll(/<a[^>]*href="([^"]+)"[^>]*>(?:View live project|Open the live build)/g)].map(match => match[1]);
    expect(hrefs.length, slug).toBeGreaterThanOrEqual(2);
    for (const href of hrefs) expect(href, slug).toBe(live);
    expect(html, slug).toContain("Full-stack engineer");
    const graph = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.stringify(JSON.parse(match[1]))).join("");
    expect(graph, slug).toContain(`"url":"${live}"`);
  }
});

test("no public page or machine file points at a stale project deployment", async ({ request }) => {
  for (const path of [...routes, "/main.js", "/llms.txt", "/llms-full.txt", "/.well-known/ai.txt", "/ai/summary.json", "/ai/service.json", "/ai/faq.json"]) {
    expect(await (await request.get(path)).text(), path).not.toMatch(staleProjectHosts);
  }
  const home = await (await request.get("/")).text();
  for (const live of Object.values(projectLive)) expect(home).toContain(`href="${live}"`);
  const script = await (await request.get("/main.js")).text();
  for (const live of Object.values(projectLive)) expect(script).toContain(`live:'${live}'`);
});

test("Person entity uses the owner-confirmed public profiles", async ({ request }) => {
  const html = await (await request.get("/")).text();
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)![1])["@graph"];
  const person = graph.find((node: { "@type": string }) => node["@type"] === "Person");
  expect(person.sameAs).toEqual([profiles.linkedin, profiles.github, profiles.facebook]);
  expect(person.jobTitle).toBe("Full-Stack Engineer");
  const about = await (await request.get("/about/")).text();
  for (const url of Object.values(profiles)) expect(about).toContain(`href="${url}"`);
  const summary = await (await request.get("/ai/summary.json")).json();
  expect(summary.sameAs).toEqual([profiles.linkedin, profiles.github, profiles.facebook]);
  expect(summary.projects.map((project: { url: string }) => project.url)).toEqual(Object.values(projectLive));
});

test("feed lists every guide on the canonical host", async ({ request }) => {
  const xml = await (await request.get("/feed.xml")).text();
  const links = [...xml.matchAll(/<link>https:\/\/abdullahbuilt\.top(\/guides\/[^<]+)<\/link>/g)].map(match => match[1]).sort();
  expect(links).toEqual(routes.filter(route => route.startsWith("/guides/") && route !== "/guides/").sort());
});

const machineFiles = ["/sitemap.xml", "/robots.txt", "/feed.xml", "/llms.txt", "/llms-full.txt", "/.well-known/ai.txt", "/ai/summary.json", "/ai/service.json", "/ai/faq.json"];
const visibleText = (html: string) => html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

test("trailing-slash policy: redirect target, final URL and canonical agree on every route", async ({ request }) => {
  for (const route of routes) {
    const page = await request.get(route, { maxRedirects: 0 });
    expect(page.status(), `${route} must render directly`).toBe(200);
    const canonical = ((await page.text()).match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
    expect(canonical, route).toBe(`https://abdullahbuilt.top${route}`);
    if (route === "/") continue;
    const bare = await request.get(route.slice(0, -1), { maxRedirects: 0 });
    expect(bare.status(), `${route.slice(0, -1)} must redirect once`).toBe(308);
    expect(new URL(bare.headers().location, "http://x").pathname, route).toBe(route);
  }
});

test("machine files use the canonical host and carry no stale project deployments", async ({ request }) => {
  for (const path of machineFiles) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const body = await response.text();
    expect(body, path).not.toMatch(staleProjectHosts);
    expect(body, path).not.toMatch(/abdullahbuilt-portfolio[\w-]*\.vercel\.app/);
    if (path.endsWith(".json")) expect(() => JSON.parse(body), path).not.toThrow();
  }
});

test("no unverified award claims anywhere", async ({ request }) => {
  for (const path of [...routes, ...machineFiles, "/main.js"]) {
    expect(await (await request.get(path)).text(), path).not.toMatch(/hackathon winner|won the .*hackathon|award-winning/i);
  }
});

test("case studies keep the verified evidence qualifiers", async ({ request }) => {
  const text = async (slug: string) => visibleText(await (await request.get(`/work/${slug}/`)).text());
  const agora = await text("agora-forge");
  expect(agora).not.toMatch(/\b(AI|LLM)[- ]agents?\b|autonomous(ly)? (sign|execut)/i);
  expect(agora).toMatch(/rule-based/i);
  expect(agora).toContain("Circle CCTP via Circle App Kit (testnet)");
  const repodiet = await text("repodiet");
  expect(repodiet).not.toMatch(/independent(ly)? verif|independent check/i);
  expect(repodiet).toMatch(/separate verifier role/i);
  const meridian = await text("meridian");
  expect(meridian).toContain("Co-built — Muhammad Abdullah served as full-stack engineer, with work including the Gate strategy desk and BSC testnet execution.");
  expect(meridian).not.toMatch(/\bsole (author|creator|builder|engineer)|AI trading agent/i);
  const resolve = await text("resolve");
  expect(resolve).toMatch(/disabled by a feature flag/i);
  expect(resolve).toMatch(/Arc Testnet/);
  expect(resolve).not.toMatch(/mainnet (deployment|payouts?) (is|are) (live|running|enabled)|live payouts (are )?(enabled|running)/i);
  for (const slug of ["resolve", "meridian", "repodiet", "agora-forge"]) {
    const html = await (await request.get(`/work/${slug}/`)).text();
    const graph = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
    const app = graph.flatMap(block => block["@graph"] || [block]).find((node: { "@type": string }) => node["@type"] === "SoftwareApplication");
    expect(app.contributor["@id"], slug).toBe("https://abdullahbuilt.top/#person");
    expect(app.author, slug).toBeUndefined();
  }
});

test("service proof never describes RepoDiet verification as independent", async ({ request }) => {
  for (const route of routes.filter(route => route.startsWith("/services/") || route === "/about/" || route === "/work/")) {
    expect(visibleText(await (await request.get(route)).text()), route).not.toMatch(/independent(ly)? verif/i);
  }
});

test("stale project deployments appear only in explicitly historical records", async () => {
  const { readdirSync, readFileSync, statSync } = await import("node:fs");
  const { join } = await import("node:path");
  const historical = new Set(["docs/ui/interaction-audit.md", "docs/qa/lighthouse-home.json"]);
  const skip = /^(node_modules|\.next|\.git|\.sites-runtime|test-results|playwright-report|build)$/;
  const offenders: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      if (skip.test(name)) continue;
      const path = join(dir, name), rel = path.replace(/^\.\//, "");
      if (statSync(path).isDirectory()) { walk(path); continue; }
      if (rel === "tests/http-seo.spec.ts" || historical.has(rel)) continue;
      if (staleProjectHosts.test(readFileSync(path).toString("latin1"))) offenders.push(rel);
    }
  };
  walk(".");
  expect(offenders).toEqual([]);
  for (const rel of historical) expect(readFileSync(rel, "utf8").slice(0, 400), rel).toMatch(/historical|lighthouseVersion/i);
});
