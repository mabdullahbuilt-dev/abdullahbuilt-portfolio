import { chromium } from "@playwright/test";
const [,, out, width, ...paths] = process.argv;
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const p = await b.newPage({ viewport: { width: +width, height: 900 }, reducedMotion: "reduce" });
const errs = []; p.on("console", m => m.type() === "error" && errs.push(m.text())); p.on("pageerror", e => errs.push(String(e)));
for (const path of paths) {
  await p.goto("http://127.0.0.1:3100" + path, { waitUntil: "networkidle" });
  const name = path.replace(/\//g, "_").replace(/^_|_$/g, "") || "home";
  await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); });
  await p.waitForLoadState("networkidle");
  const h = await p.evaluate(() => document.documentElement.scrollHeight);
  const clip = await p.evaluate(() => { const bad=[]; const W=document.documentElement.clientWidth; document.querySelectorAll("main *").forEach(el=>{ if(el.closest("pre,.matrix__scroll,.shot")) return; const r=el.getBoundingClientRect(); if(r.width>0&&(r.right>W+1||r.left<-1)) bad.push(el.className||el.tagName);}); return [...new Set(bad)].slice(0,8); });
  // overflow inside canvas nodes (text cut off)
  const cut = await p.evaluate(() => [...document.querySelectorAll(".dg__node")].filter(n => getComputedStyle(n).position==="absolute" && n.scrollHeight > n.clientHeight + 1).map(n => n.querySelector("strong")?.textContent));
  for (let y = 0, i = 0; y < h; y += 2400, i++) await p.screenshot({ path: `${out}/${name}-${width}-${i}.png`, clip: { x: 0, y, width: +width, height: Math.min(2400, h - y) }, fullPage: true });
  console.log(path, "h", h, "clip", JSON.stringify(clip), "cut", JSON.stringify(cut));
}
console.log("errors", errs);
await b.close();
