import { chromium } from 'playwright';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({ headless: true, args: ['--disable-background-timer-throttling'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.addInitScript(() => {
  window.__dumps = [];
  const OrigWorker = Worker;
  window.Worker = class extends OrigWorker {
    constructor(...args) {
      super(...args);
      this.addEventListener('message', (ev) => {
        try {
          const d = ev.data;
          if (d && d.type === 'trace' && d.trace?.samples?.length && window.__dumps.length < 2) {
            const s = d.trace.samples[Math.floor(d.trace.samples.length / 2)];
            window.__dumps.push({
              origin: d.family ?? d.trace.origin,
              links: s.linkPoses.map((l) => [+l.position[0].toFixed(3), +l.position[1].toFixed(3), +l.position[2].toFixed(3)]),
              contacts: [s.leftContact, s.rightContact],
            });
          }
        } catch {}
      });
    }
  };
});
await page.goto('http://localhost:3200/', { waitUntil: 'domcontentloaded', timeout: 60000 });
for (let y = 0; y < 26000; y += 1400) { await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y); await sleep(280); }
await sleep(2500);
const dumps = await page.evaluate(() => window.__dumps);
console.log(JSON.stringify(dumps, null, 1));
await browser.close();
