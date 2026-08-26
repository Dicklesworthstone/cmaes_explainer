// Loop inventory: record every setInterval/rAF registration + canvas census.
import { chromium } from "playwright";
import fs from "fs";

const BASE = process.env.BASE_URL || "http://localhost:3312";

const run = async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => {
    window.__loops = { intervals: [], timeouts: [], rafPerSec: 0, rafCount: 0 };
    const oSetInterval = window.setInterval.bind(window);
    window.setInterval = function (fn, delay, ...rest) {
      const stack = (new Error().stack || "").split("\n").slice(2, 5).join(" | ").slice(0, 300);
      window.__loops.intervals.push({ delay, stack });
      return oSetInterval(fn, delay, ...rest);
    };
    const oRAF = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = function (cb) {
      window.__loops.rafCount++;
      return oRAF((t) => { window.__loops.rafCount++; return cb(t); });
    };
    setInterval(() => { window.__loops.rafPerSec = window.__loops.rafCount; window.__loops.rafCount = 0; }, 1000);
  });

  const page = await ctx.newPage();
  const failed = [];
  page.on("response", (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url().slice(-80)}`); });
  await page.goto(BASE, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(4000);

  const inv = await page.evaluate(() => {
    const canvases = [...document.querySelectorAll("canvas")].map((c) => {
      const r = c.getBoundingClientRect();
      const inView = r.top < window.innerHeight && r.bottom > 0;
      const webgl = !!c.getContext && (() => { try { return !!c.getContext("webgl2") || !!c.getContext("webgl"); } catch { return "?"; } })();
      return {
        w: c.width, h: c.height, inView, webglProbe: webgl,
        cls: (c.className || "").toString().slice(0, 60),
      };
    });
    return {
      intervals: window.__loops.intervals,
      rafPerSec: window.__loops.rafPerSec,
      canvasCount: canvases.length,
      canvases: canvases,
    };
  });

  fs.mkdirSync("tmp/perf", { recursive: true });
  fs.writeFileSync("tmp/perf/loops.json", JSON.stringify({ inv, failed }, null, 2));
  console.log("rafPerSec:", inv.rafPerSec);
  console.log("intervals:", JSON.stringify(inv.intervals, null, 1).slice(0, 3000));
  console.log("canvases:", inv.canvasCount, "failed:", failed);
  await browser.close();
};

run().catch((e) => { console.error(e); process.exit(1); });
