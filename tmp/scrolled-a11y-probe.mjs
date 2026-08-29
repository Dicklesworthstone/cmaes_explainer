import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, args: ['--disable-background-timer-throttling'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3200/', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(2000);

const SECTIONS = ['what-is-cmaes', 'no-gradients', 'wing-walkthrough', 'engines', 'live-demo', 'internals', 'g1-walking', 'technical-addendum'];
const all = [];
for (const id of SECTIONS) {
  await page.evaluate((sid) => document.getElementById(sid)?.scrollIntoView({ behavior: 'instant', block: 'start' }), id);
  await new Promise((r) => setTimeout(r, 1300)); // let reveals finish
  const found = await page.evaluate((sid) => {
    const sec = document.getElementById(sid);
    if (!sec) return [];
    const out = [];
    for (const el of sec.querySelectorAll('button, a[href]')) {
      if (el.offsetParent === null) continue;
      const named = (el.innerText || '').trim() || el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.getAttribute('title');
      if (named) continue;
      out.push({
        tag: el.tagName,
        text: (el.textContent || '').trim().slice(0, 40),
        cls: (el.className || '').toString().slice(0, 60),
        html: el.outerHTML.replace(/\s+/g, ' ').slice(0, 120),
      });
    }
    return out;
  }, id);
  found.forEach((f) => all.push({ sec: id, ...f }));
}
console.log(JSON.stringify(all, null, 1));

// longtask attribution: InternalsLab landscape reconfigure (prime suspect for the 3.2s block)
await page.evaluate(() => document.getElementById('internals')?.scrollIntoView({ behavior: 'instant' }));
await new Promise((r) => setTimeout(r, 2000));
await page.evaluate(() => {
  window.__lt = [];
  new PerformanceObserver((l) => window.__lt.push(...l.getEntries().map((e) => Math.round(e.duration))))
    .observe({ entryTypes: ['longtask'] });
});
const sel = page.locator('#internals select').first();
const before = await sel.inputValue();
const opts = (await sel.locator('option').evaluateAll((os) => os.map((o) => o.value))).filter((v) => v !== before);
await sel.selectOption(opts[0]);
await new Promise((r) => setTimeout(r, 4000));
const lt = await page.evaluate(() => window.__lt);
console.log(JSON.stringify({ internalsLandscapeSwitch: { tasks: lt.length, totalMs: lt.reduce((a, b) => a + b, 0), maxMs: Math.max(0, ...lt) } }, null, 1));
await browser.close();
