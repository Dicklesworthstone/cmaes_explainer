// GPU-backed probe: real GPU path, long-task attribution, per-section first-visibility cost.
import { chromium } from "playwright";
import fs from "fs";

const BASE = process.env.BASE_URL || "http://localhost:3312";

const run = async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"],
  });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(3000);

  const sections = ["main", "what-is-cmaes", "no-gradients", "wing-walkthrough", "engines", "live-demo", "internals", "technical-addendum"];
  const results = {};
  for (const sec of sections) {
    const r = await page.evaluate(async (secId) => {
      const el = document.getElementById(secId);
      if (secId !== "main" && !el) return { missing: true };
      if (el) el.scrollIntoView({ block: "start" });
      const tasks = [];
      const obs = new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          tasks.push({ dur: Math.round(e.duration), name: (e.attribution?.[0]?.containerName || e.attribution?.[0]?.containerSrc || "?").slice(0, 60) });
        }
      });
      obs.observe({ entryTypes: ["longtask"] });
      const deltas = [];
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
      return {
        fps: Math.round((1000 / (deltas.reduce((a, b) => a + b, 0) / n)) * 10) / 10,
        worst: Math.round(deltas[n - 1]),
        longTasks: tasks.sort((a, b) => b.dur - a.dur).slice(0, 3),
      };
    }, sec);
    results[sec] = r;
    await page.waitForTimeout(400);
  }
  fs.mkdirSync("tmp/perf", { recursive: true });
  fs.writeFileSync("tmp/perf/gpu.json", JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 1));
  await browser.close();
};

run().catch((e) => { console.error(e); process.exit(1); });
