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
  test(`${route} renders without browser failures`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    page.on("pageerror", error => errors.push(error.message));
    const response = await page.goto(route, { waitUntil: "networkidle" });
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await page.waitForTimeout(100);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    expect(await page.locator('a:not([href]),a[href=""],a[href^="javascript:"]').count()).toBe(0);
    expect(await page.evaluate(() => [...document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')].filter(anchor => !document.querySelector(anchor.hash)).map(anchor => anchor.getAttribute("href")))).toEqual([]);
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

for (const slug of serviceSlugs) {
  test(`${slug} CTA preserves the promised service`, async ({ page }) => {
    await page.goto(`/services/${slug}/`);
    const contextual = page.locator(`a[href="/contact/?service=${slug}"]`);
    await expect(contextual.first()).toBeVisible();
    await contextual.first().click();
    await expect(page).toHaveURL(new RegExp(`/contact/\\?service=${slug}`));
    await expect(page.locator('select[name="service"]')).toHaveValue(slug);
  });
}

test("all rendered controls have a real destination or handler", async ({ page }) => {
  for (const route of routes) {
    await page.goto(route);
    expect(await page.locator('a:not([href]),a[href=""],a[href^="javascript:"]').count(), route).toBe(0);
    expect(await page.evaluate(() => [...document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')].filter(anchor => !document.querySelector(anchor.hash)).length), route).toBe(0);
    const buttons = page.locator("button");
    for (let index = 0; index < await buttons.count(); index += 1) {
      const button = buttons.nth(index);
      const type = (await button.getAttribute("type")) || "submit";
      expect(["button", "submit", "reset"]).toContain(type);
    }
  }
});

test("homepage interaction targets are usable", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#menuButton")).toBeVisible();
  await page.locator("#menuButton").click();
  await expect(page.locator("#siteMenu")).toBeVisible();
  expect(await page.locator('a[href="https://cal.com/muhammad-abdullah-built/idea-to-product"]').count()).toBeGreaterThanOrEqual(2);
});

const visualPilotRoutes = ["/services/ai-application-development/", "/services/api-integration-development/", "/guides/reliable-webhook-integration/"];

test("visual pilots keep diagram meaning in server-rendered HTML", async ({ request }) => {
  const ai = await (await request.get("/services/ai-application-development/")).text();
  const api = await (await request.get("/services/api-integration-development/")).text();
  const guide = await (await request.get("/guides/reliable-webhook-integration/")).text();
  expect((ai.match(/class="ab-sch__node[ "]/g) || []).length).toBe(6);
  expect(ai).toContain("Human review boundary");
  expect((api.match(/class="ab-sch__node[ "]/g) || []).length).toBe(6);
  expect((api.match(/<tr class="ab-row--/g) || []).length).toBe(8);
  expect((guide.match(/class="ab-seqd__msg/g) || []).length).toBe(9);
  expect(guide).toContain("timingSafeEqual");
  expect(guide).toContain("on conflict (provider, event_id) do nothing");
  for (const html of [ai, api, guide]) expect(html).not.toMatch(/data-seq="pending"/);
});

for (const route of visualPilotRoutes) {
  test(`${route} is fully visible with reduced motion`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(150);
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
    expect(await page.locator("[data-seq]").count()).toBe(0);
  });

  test(`${route} clips no content outside the viewport`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });
    const offenders = await page.evaluate(() => {
      const width = document.documentElement.clientWidth;
      const scrollers = [...document.querySelectorAll("pre, .ab-table__scroll, .seo-table-wrap")];
      return [...document.querySelectorAll("main *")].filter(node => {
        if (scrollers.some(scroller => scroller !== node && scroller.contains(node))) return false;
        const rect = node.getBoundingClientRect();
        return rect.width > 0 && rect.right > width + 1;
      }).slice(0, 5).map(node => `${node.tagName}.${node.className}`);
    });
    expect(offenders).toEqual([]);
  });

  test(`${route} has no lower-cased service names in headings or controls`, async ({ page }) => {
    await page.goto(route);
    const text = await page.locator("h1, h2, h3, a, button, summary").allInnerTexts();
    const joined = text.join("\n");
    expect(joined).not.toMatch(/\b(ai|api|saas)\b/);
    expect(joined).not.toMatch(/\ba (AI|API)\b/);
  });

  test(`${route} external links are real and screenshots are clean`, async ({ page }) => {
    await page.goto(route);
    const hrefs = await page.locator('a[href^="http"]').evaluateAll(links => links.map(link => link.getAttribute("href")!));
    for (const href of hrefs) {
      const url = new URL(href);
      expect(url.protocol, href).toBe("https:");
      expect(url.hostname, href).not.toMatch(/localhost|127\.0\.0\.1|abdullahbuilt-portfolio/);
    }
    const sources = await page.locator("main img").evaluateAll(images => images.map(image => image.getAttribute("src")!));
    for (const src of sources.filter(value => /resolve|meridian|repodiet|agora/.test(value))) expect(src).toMatch(/-viewport\.webp$/);
  });
}

test("pilot content is visible without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/services/api-integration-development/");
  const opacities = await page.locator(".ab-sch__node, .ab-table tbody tr").evaluateAll(nodes => nodes.map(node => getComputedStyle(node).opacity));
  expect(opacities.length).toBeGreaterThan(10);
  expect(opacities.every(value => value === "1")).toBe(true);
  await context.close();
});

test("guide table of contents jumps to every section and tracks position", async ({ page }) => {
  await page.goto("/guides/reliable-webhook-integration/");
  const links = page.locator(".ab-section-nav a");
  const count = await links.count();
  expect(count).toBe(9);
  for (let index = 0; index < count; index += 1) {
    const hash = (await links.nth(index).getAttribute("href"))!;
    await expect(page.locator(hash)).toHaveCount(1);
  }
  await links.nth(2).click();
  await expect(page).toHaveURL(/#expect-delay-and-reordering$/);
  // The site uses smooth scrolling; wait for the section to arrive at the top.
  await expect.poll(() => page.locator("#expect-delay-and-reordering").evaluate(node => Math.round(node.getBoundingClientRect().top)), { timeout: 4000 }).toBeLessThan(80);
  await expect(page.locator('.ab-section-nav a[aria-current="location"]')).toHaveAttribute("href", "#expect-delay-and-reordering");
});

test("FAQ items open and close with mouse and keyboard", async ({ page }) => {
  await page.goto("/services/ai-application-development/");
  const item = page.locator(".ab-faq details").first();
  await item.locator("summary").click();
  await expect(item).toHaveAttribute("open", "");
  await item.locator("summary").click();
  await expect(item).not.toHaveAttribute("open", "");
  await item.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(item).toHaveAttribute("open", "");
});

test("code copy buttons copy the snippet and confirm", async ({ page, context, browserName }) => {
  test.skip(browserName !== "chromium");
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/guides/reliable-webhook-integration/");
  const button = page.locator(".ab-code__copy").first();
  await button.click();
  await expect(button).toHaveText("Copied ✓");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain("timingSafeEqual");
  await expect(page.locator(".ab-code__status").first()).toHaveText("Code copied to clipboard");
});

test("primary navigation keeps all five sections reachable and marks the current one", async ({ page }) => {
  await page.goto("/services/api-integration-development/");
  const nav = page.locator(".seo-header nav a");
  await expect(nav).toHaveCount(5);
  for (const link of await nav.all()) await expect(link).toBeVisible();
  await expect(page.locator('.seo-header nav a[aria-current="page"]')).toHaveText("Services");
  await nav.filter({ hasText: "Guides" }).click();
  await expect(page).toHaveURL(/\/guides\/$/);
});

test("every service page closes with a correctly worded contextual CTA", async ({ page }) => {
  for (const slug of serviceSlugs) {
    await page.goto(`/services/${slug}/`);
    const closing = page.locator(`.seo-cta a[href="/contact/?service=${slug}"]`);
    await expect(closing).toHaveCount(1);
    const label = await closing.innerText();
    expect(label).toMatch(/^Start an? /);
    expect(label).not.toMatch(/\ba (ai|api|mvp|[aeiou])/i);
    expect(label).not.toMatch(/\b(ai|api|saas|mvp)\b/);
  }
});
