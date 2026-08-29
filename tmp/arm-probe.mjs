import { chromium } from 'playwright';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({ headless: true, args: ['--disable-background-timer-throttling', '--disable-renderer-backgrounding'] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await ctx.newPage();
// tap worker->main messages to capture the actual decoded link poses
await page.addInitScript(() => {
  const OrigWorker = Worker;
  window.__traceDump = null;
  window.Worker = class extends OrigWorker {
    constructor(...args) {
      super(...args);
      const orig = (type, listener) => (ev) => {
        try {
          const d = ev.data;
          if (d && d.type === 'trace' && d.trace && d.trace.samples && !window.__traceDump) {
            const s = d.trace.samples[0];
            window.__traceDump = {
              origin: d.trace.origin ?? d.family,
              linkCount: s.linkPoses.length,
              links: s.linkPoses.map((l) => l.position.map((v) => +v.toFixed(3))),
              contacts: [s.leftContact, s.rightContact],
              timeSeconds: s.timeSeconds,
            };
          }
        } catch {}
        listener(ev);
      };
      const od = this.addEventListener.bind(this);
      this.addEventListener = (type, listener, ...rest) => od(type, orig(type, listener), ...rest);
    }
  };
});
const errors = [];
page.on('pageerror', (e) => errors.push(String(e).slice(0, 100)));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 100)));
await page.goto('http://localhost:3200/', { waitUntil: 'domcontentloaded', timeout: 60000 });
for (let y = 0; y < 26000; y += 1400) { await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y); await sleep(300); }
await sleep(2000);

// G1 first-sample link positions (owner frame, meters)
const dump = await page.evaluate(() => window.__traceDump);
console.log('G1_TRACE', JSON.stringify(dump));

// arm section captures
await page.evaluate(() => document.getElementById('household-arm')?.scrollIntoView({ behavior: 'instant', block: 'start' }));
await sleep(800);
await page.evaluate(() => document.getElementById('household-arm')?.scrollIntoView({ behavior: 'instant', block: 'start' }));
await sleep(3500);
await page.screenshot({ path: 'tmp/g1fix/arm-top.png' });
await page.evaluate(() => window.scrollBy({ top: 850, behavior: 'instant' }));
await sleep(3000);
await page.screenshot({ path: 'tmp/g1fix/arm-deep.png' });
const armCanvases = await page.evaluate(() => [...document.querySelectorAll('#household-arm canvas')].map((c) => ({ store: `${c.width}x${c.height}`, css: `${Math.round(c.getBoundingClientRect().width)}x${Math.round(c.getBoundingClientRect().height)}` })));
console.log('ARM_CANVASES', JSON.stringify(armCanvases));
console.log('ERRORS', JSON.stringify(errors.slice(0, 6)));
await browser.close();
