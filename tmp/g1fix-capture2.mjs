import { chromium } from 'playwright';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({ headless: true, args: ['--disable-background-timer-throttling', '--disable-renderer-backgrounding'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${String(e).slice(0, 120)}`));
page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text().slice(0, 120)}`));
await page.goto('http://localhost:3200/', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(3000);

// pre-grow the whole page once: walk to bottom slowly so all mount-gates open
for (let y = 0; y < 22000; y += 1400) {
  await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y);
  await sleep(350);
}
await sleep(1500);

async function goTo(id, settle = 2500) {
  await page.evaluate((sid) => document.getElementById(sid)?.scrollIntoView({ behavior: 'instant', block: 'start' }), id);
  await sleep(600);
  await page.evaluate((sid) => document.getElementById(sid)?.scrollIntoView({ behavior: 'instant', block: 'start' }), id); // re-anchor after shifts
  await sleep(settle);
}

// G1 default
await goTo('g1-walking');
await page.screenshot({ path: 'tmp/g1fix/default2.png' });
const measure = await page.evaluate(() => {
  const card = document.querySelector('#g1-walking .glass-card');
  const canvas = document.querySelector('#g1-walking canvas');
  return {
    card: card ? Math.round(card.getBoundingClientRect().height) : null,
    canvas: canvas ? { css: `${Math.round(canvas.getBoundingClientRect().width)}x${Math.round(canvas.getBoundingClientRect().height)}`, store: `${canvas.width}x${canvas.height}` } : null,
  };
});
console.log('G1_MEASURE', JSON.stringify(measure));

// start optimization
const btn = page.locator('#g1-walking button', { hasText: /optimi/i }).first();
if (await btn.count()) {
  await btn.click({ timeout: 5000 }).catch((e) => console.log('click-fail', String(e).slice(0, 80)));
  await sleep(15000);
  await page.evaluate(() => document.getElementById('g1-walking')?.scrollIntoView({ behavior: 'instant', block: 'start' }));
  await sleep(800);
  await page.screenshot({ path: 'tmp/g1fix/midrun2.png' });
}

// scenes with double-scroll settle
for (const [name, target] of [['wing', 'wing-walkthrough'], ['internals', 'internals'], ['addendum', 'technical-addendum'], ['no-gradients', 'no-gradients']]) {
  await goTo(target);
  await page.screenshot({ path: `tmp/g1fix/s2-${name}.png` });
}
console.log('ERRORS', JSON.stringify(errors));
await browser.close();
