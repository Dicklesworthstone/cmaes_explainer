import { chromium } from 'playwright';
import { createHash } from 'crypto';
const hash = (b) => createHash('sha1').update(b).digest('hex').slice(0, 10);

const browser = await chromium.launch({ headless: true, args: ['--disable-background-timer-throttling', '--disable-renderer-backgrounding'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e}`));
page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text().slice(0, 120)}`));
await page.goto('http://localhost:3200/', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(2000);
const out = {};

// --- 1. canvas keyboard, done right: click sets+pauses, static baseline, full-canvas hash ---
await page.evaluate(() => document.getElementById('live-demo')?.scrollIntoView({ behavior: 'instant' }));
await page.waitForTimeout(1500);
const canvas = page.locator('#live-demo canvas').first();
const box = await canvas.boundingBox();
await page.mouse.click(box.x + box.width * 0.35, box.y + box.height * 0.6); // set start + pause
await page.waitForTimeout(700);
const fullHash = () => canvas.evaluate((el) => {
  const c = document.createElement('canvas');
  c.width = el.width; c.height = el.height;
  c.getContext('2d').drawImage(el, 0, 0);
  return c.toDataURL('image/png').length + ':' + c.toDataURL('image/png').slice(-64);
});
const b0 = await fullHash();
await page.waitForTimeout(600);
const b1 = await fullHash();
out.staticBaseline = b0 === b1;
await canvas.focus();
for (let i = 0; i < 3; i++) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(200); }
await page.waitForTimeout(500);
const a0 = await fullHash();
out.arrowChangedCanvas = a0 !== b0;
out.detail = { b0: b0.slice(0, 20), a0: a0.slice(0, 20) };

// --- 2. wing canvases: enumerate at two viewports ---
async function wingCanvases() {
  return page.evaluate(() => [...document.querySelectorAll('#wing-walkthrough canvas')].map((c) => ({
    store: `${c.width}x${c.height}`,
    css: `${Math.round(c.getBoundingClientRect().width)}x${Math.round(c.getBoundingClientRect().height)}`,
  })));
}
await page.evaluate(() => document.getElementById('wing-walkthrough')?.scrollIntoView({ behavior: 'instant' }));
await page.waitForTimeout(3000);
out.wing1440 = await wingCanvases();
await page.setViewportSize({ width: 700, height: 900 });
await page.waitForTimeout(1800);
out.wing700 = await wingCanvases();
await page.setViewportSize({ width: 1440, height: 900 });
out.errors = errors;
console.log(JSON.stringify(out, null, 1));
await browser.close();
