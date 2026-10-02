import { expect, test, type Page } from "@playwright/test";

// Runs once (desktop-chromium project) because each describe sets its own viewport and touch emulation.
test.beforeEach(({}, info) => { test.skip(info.project.name !== "desktop-chromium", "viewport is set per describe"); });

const phones: Array<[number, number]> = [[320, 568], [360, 800], [375, 812], [390, 844], [412, 915], [430, 932], [768, 1024]];

async function open(page: Page) {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.waitForTimeout(250);
}

for (const [width, height] of phones) {
  test.describe(`homepage at ${width}x${height} (touch)`, () => {
    test.use({ viewport: { width, height }, hasTouch: true, isMobile: true });

    test("fits the viewport with no clipped hero content", async ({ page }) => {
      await open(page);
      const r = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const escaped: string[] = [];
        for (const el of document.body.querySelectorAll("*")) {
          const cs = getComputedStyle(el);
          if (cs.display === "none" || cs.visibility === "hidden" || cs.position === "fixed") continue;
          const b = el.getBoundingClientRect();
          if (b.width && b.right > vw + 1) escaped.push(`${el.tagName}.${(el as HTMLElement).className}`);
        }
        const rect = (s: string) => document.querySelector(s)!.getBoundingClientRect();
        return {
          vw, scrollW: document.documentElement.scrollWidth, bodyScrollW: document.body.scrollWidth, escaped,
          hello: rect(".hello"), h1: rect("#name"), intro: rect(".intro"),
        };
      });
      expect(r.scrollW).toBeLessThanOrEqual(r.vw);
      expect(r.bodyScrollW).toBeLessThanOrEqual(r.vw);
      expect(r.escaped).toEqual([]);
      expect(r.hello.left).toBeGreaterThanOrEqual(0);
      expect(r.hello.right).toBeLessThanOrEqual(r.vw);
      expect(r.h1.right).toBeLessThanOrEqual(r.vw);
      expect(r.intro.right).toBeLessThanOrEqual(r.vw);
      // The pill text is fully rendered, not truncated.
      expect(await page.locator(".hello").evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    });

    test("hero stays compact and the portrait is a static badge below the actions", async ({ page }) => {
      await open(page);
      const m = await page.evaluate(() => {
        const top = (s: string) => document.querySelector(s)!.getBoundingClientRect();
        const wrap = document.querySelector<HTMLElement>("#portraitWrap")!;
        const cs = getComputedStyle(wrap);
        return {
          links: top(".hero-links"), intro: top(".intro"), portrait: top("#portraitWrap"), hero: top("#home"), work: top("#work"),
          position: cs.position, touchAction: cs.touchAction, pointerEvents: cs.pointerEvents,
          lanyard: getComputedStyle(document.querySelector("#badgeLanyard")!).display,
          hint: getComputedStyle(document.querySelector(".badge-hint")!).display,
          cardTransform: getComputedStyle(document.querySelector("#badgeCard")!).transform,
        };
      });
      expect(m.position).toBe("relative");
      expect(m.portrait.top).toBeGreaterThanOrEqual(m.links.bottom);   // below the CTAs
      expect(m.portrait.top).toBeGreaterThanOrEqual(m.intro.bottom);   // never behind the copy
      expect(m.portrait.height).toBeLessThanOrEqual(420);              // no giant vertical region
      expect(m.hero.height).toBeLessThanOrEqual(1250);
      expect(m.work.top - (m.portrait.top + m.portrait.height)).toBeLessThan(160); // no empty gap before Selected Work
      expect(m.lanyard).toBe("none");
      expect(m.hint).toBe("none");
      expect(m.pointerEvents).toBe("none");
      expect(["auto", "manipulation"]).toContain(m.touchAction);
      expect(m.cardTransform === "none" || m.cardTransform === "matrix(1, 0, 0, 1, 0, 0)").toBe(true);
    });

    test("touch-dragging over the badge scrolls the page exactly like over plain text", async ({ page }) => {
      await open(page);
      await page.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; });
      const cdp = await page.context().newCDPSession(page);
      const drag = async (selector: string) => {
        await page.evaluate(() => scrollTo(0, 0));
        await page.evaluate((s) => document.querySelector(s)!.scrollIntoView({ block: "center" }), selector);
        await page.waitForTimeout(250);
        const box = (await page.locator(selector).boundingBox())!;
        const x = box.x + box.width / 2, y = box.y + box.height / 2;
        const hit = await page.evaluate(([px, py]) => !!document.elementFromPoint(px, py)?.closest("#portraitWrap"), [x, y]);
        const start = await page.evaluate(() => scrollY);
        await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
        for (let i = 1; i <= 12; i++) { await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: y - (240 * i) / 12 }] }); await page.waitForTimeout(16); }
        await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
        await page.waitForTimeout(500);
        return { hit, moved: (await page.evaluate(() => scrollY)) - start };
      };
      const control = await drag(".intro");
      const badge = await drag("#badgeCard");
      expect(control.moved).toBeGreaterThan(150);          // the gesture itself works in this browser
      expect(badge.hit).toBe(false);                      // badge is never the touch target
      expect(badge.moved).toBeGreaterThan(150);
      expect(Math.abs(badge.moved - control.moved)).toBeLessThanOrEqual(20);
    });

    test("primary actions are 44px targets, unobstructed and correct", async ({ page }) => {
      await open(page);
      const targets: Array<[string, string | RegExp]> = [
        ['.hero-links a[href="/Muhammad_Abdullah_Resume.pdf"]', "/Muhammad_Abdullah_Resume.pdf"],
        ['.hero-links a[aria-label="LinkedIn"]', /linkedin\.com\/in\/muhammad-abdullah-builder/],
        ['.hero-links a[aria-label="GitHub profile"]', /github\.com\/velz-cmd/],
        ['.hero-links a[aria-label="Email Muhammad Abdullah"]', /^mailto:mabdullah\.built@gmail\.com/],
        ["#menuButton", ""],
      ];
      for (const [sel, href] of targets) {
        const loc = page.locator(sel);
        await loc.scrollIntoViewIfNeeded();
        await expect(loc).toBeVisible();
        const b = (await loc.boundingBox())!;
        expect(b.height, `${sel} height`).toBeGreaterThanOrEqual(44);
        expect(b.width, `${sel} width`).toBeGreaterThanOrEqual(44);
        expect(b.x + b.width, `${sel} right edge`).toBeLessThanOrEqual(width);
        if (href) await expect(loc).toHaveAttribute("href", href);
        const covered = await loc.evaluate((el) => {
          const r = el.getBoundingClientRect(); const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
          return !(hit && (hit === el || el.contains(hit)));
        });
        expect(covered, `${sel} is covered`).toBe(false);
      }
    });

    test("header is an opaque bar and anchor targets clear it", async ({ page }) => {
      await open(page);
      await page.evaluate(() => window.scrollTo(0, 500));
      const h = await page.evaluate(() => {
        const t = document.querySelector(".topbar")!; const cs = getComputedStyle(t); const b = t.getBoundingClientRect();
        return { bg: cs.backgroundColor, bf: cs.backdropFilter || (cs as unknown as Record<string, string>).webkitBackdropFilter, height: b.height, left: b.left, right: b.right, vw: innerWidth, sp: getComputedStyle(document.documentElement).scrollPaddingTop };
      });
      expect(h.bf).toContain("blur");
      expect(h.bg).not.toBe("rgba(0, 0, 0, 0)");
      expect(h.height).toBeLessThanOrEqual(72);
      expect(h.left).toBe(0); expect(Math.round(h.right)).toBe(h.vw);
      await page.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; });
      await page.evaluate(() => { location.hash = "#work"; });
      await page.waitForTimeout(300);
      const headingTop = await page.locator("#workTitle").evaluate(el => el.getBoundingClientRect().top);
      expect(headingTop).toBeGreaterThanOrEqual(h.height);
    });

    test("menu works by touch and keyboard and stays on screen", async ({ page }) => {
      await open(page);
      const button = page.locator("#menuButton"), menu = page.locator("#siteMenu");
      await button.tap();
      await expect(menu).toBeVisible();
      await expect(button).toHaveAttribute("aria-expanded", "true");
      const b = (await menu.boundingBox())!;
      expect(b.x).toBeGreaterThanOrEqual(0); expect(b.x + b.width).toBeLessThanOrEqual(width); expect(b.y + b.height).toBeLessThanOrEqual(height);
      for (const link of await menu.locator("a").all()) expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      await button.tap();
      await expect(menu).toBeHidden();
      await button.tap(); await expect(menu).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(menu).toBeHidden();
      await expect(button).toBeFocused();
      await button.tap(); await page.locator("#siteMenu a[href='#work']").tap();
      await expect(menu).toBeHidden();
    });

    test("Selected Work rows fit, wrap and keep usable controls", async ({ page }) => {
      await open(page);
      const rows = page.locator(".work-row");
      expect(await rows.count()).toBe(4);
      for (let i = 0; i < 4; i++) {
        const row = rows.nth(i);
        await row.scrollIntoViewIfNeeded();
        const rb = (await row.boundingBox())!;
        expect(rb.x + rb.width).toBeLessThanOrEqual(width + 1);
        for (const sel of [".project-preview-trigger", ".row-actions a"]) {
          for (const el of await row.locator(sel).all()) {
            const b = (await el.boundingBox())!;
            expect(b.height).toBeGreaterThanOrEqual(44);
            expect(b.x + b.width).toBeLessThanOrEqual(width);
            expect(b.x).toBeGreaterThanOrEqual(0);
          }
        }
        for (const el of await row.locator(".row-right span").all()) {
          const b = (await el.boundingBox())!; expect(b.x + b.width).toBeLessThanOrEqual(width);
        }
        const links = await row.locator(".row-actions a").evaluateAll(a => a.map(x => [x.getAttribute("href"), x.getAttribute("target")]));
        expect(links).toHaveLength(2);
        for (const [href, target] of links) { expect(href).toMatch(/^https:\/\//); expect(target).toBe("_blank"); }
      }
      await rows.first().locator(".project-preview-trigger").tap();
      await expect(page.locator("#projectDialog")).toBeVisible();
      await page.locator("#dialogClose").tap();
      await expect(page.locator("#projectDialog")).toBeHidden();
    });
  });
}

test.describe("desktop is unchanged", () => {
  test.use({ viewport: { width: 1440, height: 900 }, hasTouch: false, isMobile: false });

  test("keeps the interactive lanyard composition above the fold", async ({ page }) => {
    await open(page);
    const d = await page.evaluate(() => {
      const wrap = document.querySelector<HTMLElement>("#portraitWrap")!;
      const b = wrap.getBoundingClientRect(); const hero = document.querySelector("#home")!.getBoundingClientRect();
      return { lanyard: getComputedStyle(document.querySelector("#badgeLanyard")!).display, hint: getComputedStyle(document.querySelector(".badge-hint")!).display,
        pe: getComputedStyle(wrap).pointerEvents, w: Math.round(b.width), h: Math.round(b.height), heroH: Math.round(hero.height), topbar: getComputedStyle(document.querySelector(".topbar")!).left };
    });
    expect(d.lanyard).not.toBe("none"); expect(d.hint).not.toBe("none"); expect(d.pe).not.toBe("none");
    expect([d.w, d.h, d.heroH]).toEqual([270, 590, 900]);
    expect(d.topbar).toBe("22px");
    // Pointer-driven tilt still works on desktop.
    const box = (await page.locator("#badgeCard").boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.2, { steps: 6 });
    await page.waitForTimeout(400);
    expect(await page.locator("#badgeCard").evaluate(el => (el as HTMLElement).style.transform)).toContain("rotate");
  });
});
