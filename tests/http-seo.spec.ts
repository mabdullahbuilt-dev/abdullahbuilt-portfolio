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

for (const route of routes) {
  test(`${route} returns complete indexable HTML`, async ({ request }) => {
    const response = await request.get(route);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain('<link rel="canonical" href="https://abdullahbuilt.top');
    expect((html.match(/<h1\b/g) || []).length).toBe(1);
    expect(html).toContain('type="application/ld+json"');
    expect(html).not.toMatch(/name="robots"[^>]+noindex/i);
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
