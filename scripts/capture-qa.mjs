import { chromium, devices } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const baseUrl = process.env.QA_BASE_URL || "http://127.0.0.1:3100";
const outputDir = "docs/qa/screenshots";
const pages = [
  ["homepage", "/"],
  ["services-hub", "/services/"],
  ["service-saas", "/services/saas-development/"],
  ["guides-hub", "/guides/"],
  ["guide-api-planning", "/guides/api-integration-planning/"],
  ["case-study-resolve", "/work/resolve/"],
  ["contact-saas", "/contact/?service=saas-development"],
];

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true });

for (const [profile, contextOptions] of [
  ["desktop", { viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 }],
  ["mobile", devices["iPhone 13"]],
]) {
  const context = await browser.newContext(contextOptions);
  for (const [name, path] of pages) {
    const page = await context.newPage();
    await page.goto(`${baseUrl}${path}`, { waitUntil: "networkidle" });
    await page.screenshot({
      path: `${outputDir}/${profile}-${name}.jpg`,
      type: "jpeg",
      quality: 82,
      fullPage: true,
    });
    await page.close();
  }
  await context.close();
}

await browser.close();
console.log(`Captured ${pages.length * 2} QA screenshots in ${outputDir}`);
