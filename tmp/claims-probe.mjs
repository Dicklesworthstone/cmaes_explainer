import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, args: ['--disable-background-timer-throttling'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e}`));
page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text().slice(0, 120)}`));
await page.goto('http://localhost:3200/', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(2000);
const out = { steps: {} };

// --- 1. canvas keyboard claim: focus, ArrowRight x3, canvas pixels must move ---
await page.evaluate(() => document.getElementById('live-demo')?.scrollIntoView({ behavior: 'instant' }));
await page.waitForTimeout(1500);
const canvas = page.locator('#live-demo canvas[tabindex="0"], #live-demo canvas').first();
await canvas.focus();
const focused = await canvas.evaluate((el) => document.activeElement === el);
const h0 = await canvas.evaluate((el) => {
  // sample the canvas 2D buffer center region hash (contour is static; m0 marker moves)
  const c = document.createElement('canvas');
  c.width = el.width; c.height = el.height;
  const ctx = c.getContext('2d');
  ctx.drawImage(el, 0, 0);
  const d = ctx.getImageData(el.width / 2 - 40, el.height / 2 - 40, 80, 80).data;
  let acc = 0; for (let i = 0; i < d.length; i += 401) acc = (acc * 31 + d[i]) | 0;
  return acc;
});
for (let i = 0; i < 3; i++) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(120); }
const h1 = await canvas.evaluate((el) => {
  const c = document.createElement('canvas');
  c.width = el.width; c.height = el.height;
  const ctx = c.getContext('2d');
  ctx.drawImage(el, 0, 0);
  const d = ctx.getImageData(el.width / 2 - 40, el.height / 2 - 40, 80, 80).data;
  let acc = 0; for (let i = 0; i < d.length; i += 401) acc = (acc * 31 + d[i]) | 0;
  return acc;
});
out.steps.canvasFocusable = focused;
out.steps.canvasPixelsMovedOnArrows = h0 !== h1;
out.steps.hashBefore = h0; out.steps.hashAfter = h1;

// --- 2. WASM Gallery toggle: iframe appears with wasm-demo src ---
await page.getByRole('button', { name: /WASM Gallery/ }).click();
await page.waitForTimeout(2500);
const iframe = page.locator('#live-demo iframe');
out.steps.wasmIframeAppears = await iframe.count() > 0;
if (out.steps.wasmIframeAppears) out.steps.iframeSrc = await iframe.first().getAttribute('src');
// toggle back to native
await page.getByRole('button', { name: /Native Interactive Engine/ }).click();
await page.waitForTimeout(600);
out.steps.togglesBackToNative = (await page.locator('#live-demo iframe').count()) === 0;

// --- 3. backing store tracks CSS size across resize (crispness precondition) ---
await page.evaluate(() => document.getElementById('wing-walkthrough')?.scrollIntoView({ behavior: 'instant' }));
await page.waitForTimeout(2500);
const w1440 = await page.evaluate(() => {
  const c = [...document.querySelectorAll('#wing-walkthrough canvas')].find((cv) => cv.width > 300);
  return c ? { css: Math.round(c.getBoundingClientRect().width), store: c.width } : null;
});
await page.setViewportSize({ width: 700, height: 900 });
await page.waitForTimeout(1800);
const w700 = await page.evaluate(() => {
  const c = [...document.querySelectorAll('#wing-walkthrough canvas')].find((cv) => cv.width > 300);
  return c ? { css: Math.round(c.getBoundingClientRect().width), store: c.width } : null;
});
await page.setViewportSize({ width: 1440, height: 900 });
out.steps.backingStoreResize = { at1440: w1440, at700: w700, tracks: !!(w1440 && w700 && w700.css < w1440.css && w700.store < w1440.store) };

out.errors = errors;
console.log(JSON.stringify(out, null, 1));
await browser.close();
