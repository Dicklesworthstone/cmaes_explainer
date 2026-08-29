import { chromium } from 'playwright';

const browser = await chromium.launch({
  headless: true,
  args: [
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
    '--disable-background-timer-throttling',
  ],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e).slice(0, 100)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 100)); });
await page.goto('http://localhost:3200/', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(3000);

const ids = ['what-is-cmaes', 'no-gradients', 'wing-walkthrough', 'engines', 'live-demo', 'internals', 'g1-walking', 'technical-addendum'];
const results = [];
for (const id of ids) {
  await page.evaluate((sid) => document.getElementById(sid).scrollIntoView({ behavior: 'instant' }), id);
  await page.waitForTimeout(3200);
  const canvasVisible = await page.evaluate(() => {
    const cs = [...document.querySelectorAll('canvas')];
    return cs.filter((cv) => {
      const r = cv.getBoundingClientRect();
      return r.bottom > 100 && r.top < innerHeight - 100 && r.width > 250 && r.height > 150;
    }).length;
  });
  await page.screenshot({ path: `tmp/ui-audit/unthrottled-${id}.png` });
  results.push({ id, bigCanvasesInView: canvasVisible });
}
console.log(JSON.stringify({ results, consoleErrors: errors }, null, 1));
await browser.close();
