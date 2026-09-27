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
  test(`${route} renders without browser failures`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    page.on("pageerror", error => errors.push(error.message));
    const response = await page.goto(route, { waitUntil: "networkidle" });
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
    expect(await page.locator('a[href="#"],a[href=""],a[href^="javascript:"]').count()).toBe(0);
    expect(errors).toEqual([]);
  });
}

test("contextual service inquiry preserves intent", async ({ page }) => {
  await page.goto("/contact/?service=ai-application-development");
  await expect(page.locator('select[name="service"]')).toHaveValue("ai-application-development");
  await page.locator('input[name="name"]').fill("QA Tester");
  await page.locator('input[name="email"]').fill("qa@example.com");
  await page.locator('textarea[name="message"]').fill("Build and verify an AI workflow.");
  await expect(page.locator('button[type="submit"]')).toBeEnabled();
});

test("homepage interaction targets are usable", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#menuButton")).toBeVisible();
  await page.locator("#menuButton").click();
  await expect(page.locator("#siteMenu")).toBeVisible();
  await expect(page.locator('a[href="https://cal.com/muhammad-abdullah-built/idea-to-product"]')).toHaveCount(2);
});
