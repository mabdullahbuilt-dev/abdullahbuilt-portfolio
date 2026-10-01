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

const secondaryRoutes = routes.filter(route => route !== "/");

test("route manifest: all 27 canonical routes answer 200 with one h1 and a canonical link", async ({ request }) => {
  expect(routes).toHaveLength(27);
  for (const route of routes) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(200);
    const html = await response.text();
    expect((html.match(/<h1[\s>]/g) || []).length, route).toBe(1);
    expect(html, route).toContain(`<link rel="canonical" href="https://abdullahbuilt.top${route}"`);
  }
});

test("diagrams keep their meaning in server-rendered HTML", async ({ request }) => {
  const ai = await (await request.get("/services/ai-application-development/")).text();
  const api = await (await request.get("/services/api-integration-development/")).text();
  const guide = await (await request.get("/guides/reliable-webhook-integration/")).text();
  expect((ai.match(/class="dg__node dg__node--/g) || []).length).toBe(11);
  expect(ai).toContain("Human approval");
  expect((api.match(/class="dg__node dg__node--/g) || []).length).toBe(12);
  expect((api.match(/<tr class="row--/g) || []).length).toBeGreaterThanOrEqual(8);
  expect((guide.match(/class="seq__msg /g) || []).length).toBe(9);
  expect(guide).toContain("timingSafeEqual");
  expect(guide).toContain("on conflict (provider, event_id) do nothing");
  for (const route of secondaryRoutes) {
    const html = await (await request.get(route)).text();
    expect(html, route).not.toMatch(/data-seq="pending"/);
    expect(html, route).not.toMatch(/href="#"/);
  }
});

for (const route of secondaryRoutes) {
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
      const scrollers = [...document.querySelectorAll("pre, .matrix__scroll")];
      return [...document.querySelectorAll("main *")].filter(node => {
        if (node.closest(".honeypot") || scrollers.some(scroller => scroller !== node && scroller.contains(node))) return false;
        const rect = node.getBoundingClientRect();
        return rect.width > 0 && (rect.right > width + 1 || rect.left < -1);
      }).slice(0, 5).map(node => `${node.tagName}.${node.className}`);
    });
    expect(offenders).toEqual([]);
  });

  test(`${route} has no lower-cased service names in headings or controls`, async ({ page }) => {
    await page.goto(route);
    const text = await page.locator("h1, h2, h3, a, button, summary, label").allInnerTexts();
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

test("content is visible without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const route of ["/services/api-integration-development/", "/services/mvp-product-development/", "/work/resolve/"]) {
    await page.goto(route);
    const opacities = await page.locator(".dg__node, .matrix tbody tr, .cycle__stages li, .strip li").evaluateAll(nodes => nodes.map(node => getComputedStyle(node).opacity));
    expect(opacities.length, route).toBeGreaterThan(5);
    expect(opacities.every(value => value === "1"), route).toBe(true);
  }
  await context.close();
});

test("guide table of contents jumps to every section and tracks position", async ({ page }) => {
  await page.goto("/guides/reliable-webhook-integration/");
  const links = page.locator(".toc a");
  const count = await links.count();
  expect(count).toBe(9);
  for (let index = 0; index < count; index += 1) {
    const hash = (await links.nth(index).getAttribute("href"))!;
    await expect(page.locator(hash)).toHaveCount(1);
  }
  // On small screens the table of contents is a collapsed bar; open it first.
  if (!(await page.locator(".toc__details").evaluate(node => (node as HTMLDetailsElement).open))) await page.locator(".toc__summary").click();
  await links.nth(2).click();
  await expect(page).toHaveURL(/#expect-delay-and-reordering$/);
  await expect.poll(() => page.locator("#expect-delay-and-reordering").evaluate(node => Math.round(node.getBoundingClientRect().top)), { timeout: 4000 }).toBeLessThan(80);
  await expect(page.locator('.toc a[aria-current="location"]')).toHaveAttribute("href", "#expect-delay-and-reordering");
});

test("mobile table of contents collapses after choosing a section", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/guides/api-integration-planning/");
  const details = page.locator(".toc__details");
  await expect(page.locator(".toc[data-ready]")).toHaveCount(1);
  await expect(details).not.toHaveAttribute("open", "");
  await page.locator(".toc__summary").click();
  await expect(details).toHaveAttribute("open", "");
  await page.locator(".toc a").nth(1).click();
  await expect(details).not.toHaveAttribute("open", "");
  await expect(page).toHaveURL(/#design-authentication-and-permissions$/);
});

test("FAQ items open and close with mouse and keyboard", async ({ page }) => {
  await page.goto("/services/ai-application-development/");
  const item = page.locator(".faq details").first();
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

test("decision trees narrow the path, reset, and work from the keyboard", async ({ page }) => {
  await page.goto("/guides/ai-feature-vs-automation/");
  const tree = page.locator("#ai-tree");
  await expect(tree.locator(".tree__result")).toHaveCount(4);
  await expect(tree.locator(".tree__result:visible")).toHaveCount(4);
  await tree.locator(".tree__option", { hasText: "No — it needs interpretation" }).click();
  await tree.locator(".tree__option", { hasText: "Yes — multi-step tool use" }).click();
  await expect(tree.locator(".tree__result:visible")).toHaveCount(1);
  await expect(tree.locator(".tree__result:visible strong")).toHaveText("Controlled agent");
  await tree.locator(".tree__reset").click();
  await expect(tree.locator(".tree__result:visible")).toHaveCount(4);
  await tree.locator(".tree__radio").first().focus();
  await page.keyboard.press("ArrowDown");
  await expect(tree.locator(".tree__radio").nth(1)).toBeChecked();
});

test("scorecard records ratings, summarizes, and resets", async ({ page }) => {
  await page.goto("/guides/hire-saas-developer/");
  const card = page.locator(".scorecard");
  const rows = card.locator(".scorecard__row");
  const total = await rows.count();
  for (let i = 0; i < total; i += 1) await rows.nth(i).locator(".scorecard__option--strong").click();
  await rows.nth(0).locator(".scorecard__option--missing").click();
  await expect(card.locator(".scorecard__summary strong")).toHaveText("One gap — resolve it in writing before the build starts");
  await card.locator(".scorecard__reset").click();
  await expect(card.locator(".scorecard__summary strong")).toContainText(`${total} of ${total} areas not rated yet`);
});

test("services routing map links every problem to a real service", async ({ page }) => {
  await page.goto("/services/");
  const problems = page.locator(".route__problem");
  await expect(problems).toHaveCount(7);
  await problems.first().click();
  await expect(page).toHaveURL(/#service-routes-custom-software-development$/);
  await page.locator(".route__service").first().click();
  await expect(page).toHaveURL(/\/services\/custom-software-development\/$/);
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
    const closing = page.locator(`.cta a[href="/contact/?service=${slug}"]`);
    await expect(closing).toHaveCount(1);
    const label = await closing.innerText();
    expect(label).toMatch(/^Start an? /);
    expect(label).not.toMatch(/\ba (ai|api|mvp|[aeiou])/i);
    expect(label).not.toMatch(/\b(ai|api|saas|mvp)\b/);
  }
});

test("hub, entity, and guide CTAs carry their source or service into contact", async ({ page }) => {
  for (const [route, href] of [["/services/", "/contact/?source=services"], ["/work/", "/contact/?source=work"], ["/guides/", "/contact/?source=guides"], ["/about/", "/contact/?source=about"], ["/guides/api-integration-planning/", "/contact/?service=api-integration-development"], ["/work/meridian/", "/contact/?service=saas-development"]]) {
    await page.goto(route);
    await expect(page.locator(`.cta a[href="${href}"]`), route).toHaveCount(1);
  }
});


// The form must open the visitor's default mail handler through mailto:. The draft anchor's click is captured
// and cancelled in the page, so no mail application is opened and nothing is ever sent.
const captureMailto = () => {
  const w = window as unknown as { __mailto?: string };
  document.addEventListener("click", event => {
    const anchor = (event.target as Element | null)?.closest?.("a");
    if (anchor && anchor.getAttribute("href")?.startsWith("mailto:")) { w.__mailto = anchor.getAttribute("href") || ""; event.preventDefault(); }
  }, true);
};

for (const route of ["/contact/?service=ai-application-development", "/contact/", "/"]) {
  test(`${route} inquiry form builds an encoded mailto draft and never calls this site's API`, async ({ page, baseURL }) => {
    const siteOrigin = new URL(baseURL!).origin, apiCalls: string[] = [];
    page.on("request", request => { const url = new URL(request.url()); if (url.origin === siteOrigin && url.pathname.startsWith("/api/")) apiCalls.push(request.url()); });
    await page.addInitScript(captureMailto);
    await page.goto(route, { waitUntil: "networkidle" });
    await page.waitForFunction(() => !!document.querySelector("#contactForm") && document.body.innerHTML.length > 0);
    const message = "Build & verify: a workflow, 100% — with ümlauts?";
    await page.locator('input[name="name"]').fill("QA Tester");
    await page.locator('input[name="email"]').fill("qa@example.com");
    await page.locator('textarea[name="message"]').fill(message);
    const hasExtras = await page.locator('select[name="stage"]').count();
    if (hasExtras) {
      await page.locator('select[name="stage"]').selectOption("Prototype");
      await page.locator('input[name="projectUrl"]').fill("https://example.com/a?b=c&d=e");
      await page.locator('input[name="timeline"]').fill("6–8 weeks");
    }
    await page.locator('button[type="submit"]').click();
    await expect(page.locator("#formStatus")).toHaveText("Opening your email app. Review the message and press Send to finish.");
    const mailto = await page.evaluate(() => (window as unknown as { __mailto?: string }).__mailto || "");
    expect(mailto.startsWith("mailto:mabdullah.built@gmail.com?subject=")).toBe(true);
    const subject = decodeURIComponent((mailto.match(/subject=([^&]*)/) || [])[1] || "");
    const body = decodeURIComponent((mailto.match(/body=([^&]*)/) || [])[1] || "");
    expect(subject).toBe(route.includes("service=") ? "AI Application & Agent Development inquiry from QA Tester" : "Project inquiry from QA Tester");
    expect(body).toContain("Name: QA Tester");
    expect(body).toContain("Email: qa@example.com");
    expect(body).toContain(message);
    expect(body).toMatch(/Source: http/);
    if (route.includes("service=")) expect(body).toContain("Relevant service: AI Application & Agent Development");
    if (hasExtras) { expect(body).toContain("Current stage: Prototype"); expect(body).toContain("Useful link: https://example.com/a?b=c&d=e"); expect(body).toContain("Timeline: 6–8 weeks"); }
    expect(mailto).not.toMatch(/\s/);
    expect(mailto).not.toMatch(/mail\.google\.com/);
    expect(apiCalls).toEqual([]);
  });
}

test("incomplete inquiry is blocked by validation and opens no email draft", async ({ page }) => {
  await page.addInitScript(captureMailto);
  await page.goto("/contact/", { waitUntil: "networkidle" });
  await page.locator('input[name="name"]').fill("QA Tester");
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => (window as unknown as { __mailto?: string }).__mailto || "")).toBe("");
  await expect(page.locator("#formStatus")).toHaveText("");
});

// Dead-button guard: every button on every page must be a recognised, wired control.
for (const route of routes) {
  test(`${route} has no dead buttons or empty links`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });
    const problems = await page.evaluate(() => {
      const bad: string[] = [];
      for (const el of document.querySelectorAll<HTMLElement>("button,[role=button],input[type=button],input[type=submit]")) {
        const type = el.getAttribute("type"), cls = el.className.toString();
        const wired =
          (type === "submit" && !!el.closest("form")) ||
          (type === "reset" && !!el.closest("form")) ||
          (!!el.getAttribute("aria-controls") && !!document.getElementById(el.getAttribute("aria-controls")!)) ||
          (el.hasAttribute("data-open-preview") && !!document.getElementById("projectDialog")) ||
          cls.includes("dialog-close") || cls.includes("ab-code__copy");
        if (!wired) bad.push(`${el.tagName} ${cls} ${el.textContent?.trim().slice(0, 30)}`);
      }
      for (const a of document.querySelectorAll<HTMLAnchorElement>("a")) {
        const href = a.getAttribute("href");
        if (!href || href === "#" || href.startsWith("javascript:")) bad.push(`link ${a.textContent?.trim().slice(0, 30)} -> ${href}`);
      }
      return bad;
    });
    expect(problems).toEqual([]);
  });
}

test("homepage menu and project preview controls respond", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.waitForFunction(() => !!document.querySelector("#projectDialog"));
  await page.waitForTimeout(500);
  const menu = page.locator(".menu-button");
  if (await menu.isVisible()) { await menu.click(); await expect(menu).toHaveAttribute("aria-expanded", "true"); }
  await page.locator(".project-preview-trigger").first().click({ force: true });
  await expect(page.locator("#projectDialog")).toHaveAttribute("open", "");
  await expect(page.locator("#dialogLive")).toHaveAttribute("href", "https://www.useresolve.stream");
  await page.locator(".dialog-close").click();
  await expect(page.locator("#projectDialog")).not.toHaveAttribute("open", "");
});
