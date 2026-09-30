// Interaction audit: every interactive element on the given pages, with action, target and
// desktop / mobile / keyboard checks. Usage:
//   node scripts/interaction-audit.mjs --base-url http://127.0.0.1:3100 [--out docs/ui/interaction-audit.md]
// Set CHROMIUM_PATH to use a preinstalled Chromium.
import { writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const args = Object.fromEntries(process.argv.slice(2).map((value, index, all) => value.startsWith("--") ? [value.slice(2), all[index + 1]] : null).filter(Boolean));
const baseUrl = String(args["base-url"] || "http://127.0.0.1:3100").replace(/\/$/, "");
const out = args.out || "docs/ui/interaction-audit.md";
const pages = String(args.pages || "/services/ai-application-development/,/services/api-integration-development/,/guides/reliable-webhook-integration/").split(",");
const SELECTOR = 'a[href], button, summary, input:not([type=hidden]), select, textarea, [tabindex]:not([tabindex="-1"])';

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const statusCache = new Map();
async function internalStatus(request, path) {
  if (!statusCache.has(path)) {
    const response = await request.get(`${baseUrl}${path}`, { maxRedirects: 0 });
    statusCache.set(path, response.status());
  }
  return statusCache.get(path);
}

async function inspect(viewport, path) {
  const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(`${baseUrl}${path}`, { waitUntil: "networkidle" });
  const handles = await page.locator(SELECTOR).elementHandles();
  const results = [];
  for (const [index, handle] of handles.entries()) {
    const info = await handle.evaluate((node, i) => {
      const label = (node.getAttribute("aria-label") || node.innerText || node.getAttribute("alt") || node.getAttribute("title") || "").replace(/\s+/g, " ").trim();
      const region = node.closest("header") ? "header" : node.closest("footer") ? "footer" : node.closest(".seo-crumbs") ? "breadcrumb" : "main";
      return { i, tag: node.tagName.toLowerCase(), label: label.slice(0, 70), href: node.getAttribute("href"), type: node.getAttribute("type"), region, tabIndex: node.tabIndex, className: String(node.className || "") };
    }, index);
    await page.evaluate(() => (document.activeElement instanceof HTMLElement) && document.activeElement.blur());
    await handle.scrollIntoViewIfNeeded().catch(() => {});
    const hit = await handle.evaluate(node => {
      if (node.closest(".seo-skip") || node.classList.contains("seo-skip")) return "skip-link (visible on focus)";
      const rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height) return "hidden";
      const x = Math.min(Math.max(rect.left + rect.width / 2, 1), innerWidth - 1), y = Math.min(Math.max(rect.top + Math.min(rect.height / 2, 20), 1), innerHeight - 1);
      const top = document.elementFromPoint(x, y);
      return top && (top === node || node.contains(top) || top.contains(node)) ? "pass" : `covered by ${top?.tagName.toLowerCase()}.${top?.className}`;
    });
    const keyboard = await handle.evaluate(node => { node.focus({ preventScroll: true }); return document.activeElement === node && node.tabIndex >= 0; });
    results.push({ ...info, hit, keyboard });
  }
  // Behaviour checks that need interaction.
  const behaviour = {};
  for (const [index, handle] of handles.entries()) {
    const tag = await handle.evaluate(node => node.tagName.toLowerCase());
    if (tag === "summary") {
      const before = await handle.evaluate(node => node.parentElement.open);
      await handle.click();
      const after = await handle.evaluate(node => node.parentElement.open);
      await handle.click();
      behaviour[index] = before !== after ? "toggles details" : "DID NOT TOGGLE";
    }
  }
  await context.close();
  return { results, behaviour };
}

const rows = [];
let failures = 0;
const apiContext = await browser.newContext();
const htmlCache = new Map();
for (const path of pages) {
  const desktop = await inspect({ width: 1440, height: 900 }, path);
  const mobile = await inspect({ width: 390, height: 844 }, path);
  for (const [index, item] of desktop.results.entries()) {
    const mobileItem = mobile.results[index];
    let action, target = item.href || "", expected, check = "pass";
    if (item.tag === "a" && item.href?.startsWith("#")) {
      action = "anchor"; expected = `scrolls to ${item.href}`;
      if (!htmlCache.has(path)) htmlCache.set(path, await (await apiContext.request.get(`${baseUrl}${path}`)).text());
      if (!htmlCache.get(path).includes(`id="${item.href.slice(1)}"`)) check = "MISSING TARGET";
    } else if (item.tag === "a" && item.href?.startsWith("/")) {
      action = "internal link";
      const status = await internalStatus(apiContext.request, item.href);
      expected = item.href.startsWith("/contact/?service=") ? `contact page, service "${item.href.split("=")[1]}" preselected` : `navigates (HTTP ${status})`;
      if (status !== 200) check = `HTTP ${status}`;
    } else if (item.tag === "a" && item.href?.startsWith("mailto:")) {
      action = "email"; expected = "opens mail client"; if (!/^mailto:[^@\s]+@[^@\s]+\.[a-z]+/i.test(item.href)) check = "BAD ADDRESS";
    } else if (item.tag === "a") {
      action = "external link"; expected = "opens external destination (href validated; not fetched)";
      try { const url = new URL(item.href); if (url.protocol !== "https:" || /localhost|127\.0\.0\.1|abdullahbuilt-portfolio/.test(url.hostname)) check = "BAD HOST"; } catch { check = "INVALID URL"; }
    } else if (item.tag === "summary") {
      action = "disclosure"; expected = "opens / closes answer"; target = "details"; check = desktop.behaviour[index] === "toggles details" ? "pass" : "DID NOT TOGGLE";
    } else if (item.tag === "button") {
      action = "button"; target = item.className.includes("ab-code__copy") ? "clipboard" : item.type || "submit";
      expected = item.className.includes("ab-code__copy") ? "copies code, shows Copied ✓ (e2e)" : "handler";
      if (!item.type) check = "MISSING TYPE";
    } else if (item.tag === "pre") {
      action = "scroll region"; target = "code"; expected = "keyboard-scrollable code";
    } else { action = item.tag; expected = "focusable control"; }
    const desktopHit = item.hit, mobileHit = mobileItem?.hit ?? "missing";
    const ok = check === "pass" && !/covered|hidden|missing/.test(`${desktopHit} ${mobileHit}`) && item.keyboard;
    if (!ok) failures += 1;
    rows.push({ page: path, region: item.region, element: item.tag, label: item.label || "(no text)", action, target, expected, desktop: desktopHit, mobile: mobileHit, keyboard: item.keyboard ? "pass" : "NOT FOCUSABLE", status: ok ? "PASS" : `FAIL — ${check !== "pass" ? check : !item.keyboard ? "not focusable" : `desktop: ${desktopHit}; mobile: ${mobileHit}`}` });
  }
}
await apiContext.close();
await browser.close();

const escape = value => String(value).replace(/\|/g, "\\|");
const lines = [
  "# Interaction audit — visual pilot pages",
  "",
  `Generated by \`scripts/interaction-audit.mjs\` against \`${baseUrl}\` on ${new Date().toISOString().slice(0, 10)}.`,
  "Desktop = 1440×900, mobile = 390×844. \"pass\" in a viewport column means the element is visible and not covered at its centre after scrolling into view. Keyboard = focusable with tabIndex ≥ 0. External destinations are validated by URL only (the audit environment cannot fetch third-party sites).",
  "",
  `**${rows.length} interactive elements · ${rows.length - failures} PASS · ${failures} FAIL**`,
  "",
  "| Page | Region | Element | Label | Action | Target | Expected result | Desktop | Mobile | Keyboard | Status |",
  "|---|---|---|---|---|---|---|---|---|---|---|",
  ...rows.map(row => `| ${[row.page, row.region, row.element, row.label, row.action, row.target, row.expected, row.desktop, row.mobile, row.keyboard, row.status].map(escape).join(" | ")} |`),
  "",
];
writeFileSync(out, lines.join("\n"));
console.log(JSON.stringify({ elements: rows.length, failures, out }));
if (failures) process.exitCode = 1;
