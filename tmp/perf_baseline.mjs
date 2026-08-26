// Baseline stutter profiler: samples frame deltas + long tasks per section.
import { chromium } from "playwright";
import fs from "fs";

const BASE = process.env.BASE_URL || "http://localhost:3312";
const OUT = "tmp/perf";

const run = async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  const consoleErrs = [];
  page.on("console", (m) => { if (m.type() === "error") consoleErrs.push(m.text().slice(0, 200)); });
  page.on("pageerror", (e) => consoleErrs.push("pageerror: " + String(e).slice(0, 200)));

  await page.goto(BASE, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(2500);

  const sections = ["main", "what-is-cmaes", "no-gradients", "wing-walkthrough", "engines", "live-demo", "internals", "technical-addendum"];
  const results = {};

  for (const sec of sections) {
    const probe = await page.evaluate(async (secId) => {
      const el = document.getElementById(secId);
      if (secId !== "main" && !el) return { missing: true };
      if (el) el.scrollIntoView({ block: "start" });
      await new Promise((r) => setTimeout(r, 400));
      // Sample rAF deltas for ~3s.
      const deltas = [];
      let longTasks = 0;
      const obs = new PerformanceObserver((list) => { longTasks += list.getEntries().length; });
      obs.observe({ entryTypes: ["longtask"] });
      await new Promise((resolve) => {
        let last = performance.now();
        const start = last;
        function frame(t) {
          deltas.push(t - last);
          last = t;
          if (t - start < 3000) requestAnimationFrame(frame);
          else resolve();
        }
        requestAnimationFrame(frame);
      });
      obs.disconnect();
      deltas.sort((a, b) => a - b);
      const n = deltas.length;
      const fps = 1000 / (deltas.reduce((a, b) => a + b, 0) / n);
      return {
        missing: false,
        fps: Math.round(fps * 10) / 10,
        p95: Math.round(deltas[Math.floor(n * 0.95)] * 10) / 10,
        worst: Math.round(deltas[n - 1] * 10) / 10,
        longTasks,
        canvases: document.querySelectorAll("canvas").length,
      };
    }, sec);
    results[sec] = probe;
  }

  // Scroll-stutter pass: programmatic scroll top->bottom, measure jank.
  const scroll = await page.evaluate(async () => {
    const deltas = [];
    let last = performance.now();
    let y = 0;
    const step = () => {
      y += 600;
      window.scrollTo(0, y);
      const now = performance.now();
      deltas.push(now - last);
      last = now;
      if (y < document.body.scrollHeight - window.innerHeight) setTimeout(step, 50);
    };
    step();
    await new Promise((r) => setTimeout(r, 8000));
    deltas.sort((a, b) => a - b);
    const n = deltas.length;
    return { samples: n, p50: deltas[Math.floor(n * 0.5)], p95: deltas[Math.floor(n * 0.95)], worst: Math.round(deltas[n - 1]) };
  });

  results._scrollPass = scroll;
  results._consoleErrors = consoleErrs.slice(0, 10);
  fs.writeFileSync(`${OUT}/baseline.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
};

run().catch((e) => { console.error(e); process.exit(1); });
