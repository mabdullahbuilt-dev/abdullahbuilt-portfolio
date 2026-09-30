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
const staleProjectHosts = /resolve-task\.vercel\.app|resolve-self\.vercel\.app|trader-arc\.vercel\.app|skillswap-skillswap7\.vercel\.app/;
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
