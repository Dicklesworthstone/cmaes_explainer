import { chromium } from 'playwright';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({ headless: true, args: ['--disable-background-timer-throttling', '--disable-renderer-backgrounding'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${String(e).slice(0, 120)}`));
page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text().slice(0, 120)}`));
await page.goto('http://localhost:3200/', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(3000);

await page.evaluate(() => document.getElementById('g1-walking')?.scrollIntoView({ behavior: 'instant' }));
await sleep(3000);
await page.screenshot({ path: 'tmp/g1fix/default.png' });

const cardStage = await page.evaluate(() => {
  const card = document.querySelector('#g1-walking .glass-card');
  const stage = document.querySelector('#g1-walking div[class*="h-\\[540px\\]"]') || document.querySelector('#g1-walking div[ref]');
  const divs = [...document.querySelectorAll('#g1-walking div')].filter((d) => d.className && String(d.className).includes('h-[540px]'));
  const st = divs[0];
  return card && st ? { card: Math.round(card.getBoundingClientRect().height), stage: Math.round(st.getBoundingClientRect().height) } : 'not-found';
});
console.log('CARD_VS_STAGE', JSON.stringify(cardStage));

const btn = page.locator('#g1-walking button', { hasText: /optimi/i }).first();
if (await btn.count()) {
  await btn.click({ timeout: 5000 }).catch((e) => console.log('click-fail', String(e).slice(0, 80)));
  await sleep(15000);
  await page.screenshot({ path: 'tmp/g1fix/midrun.png' });
}

const shots = [
  ['hero-covariance', 'top'],
  ['no-gradients', 'no-gradients'],
  ['wing', 'wing-walkthrough'],
  ['engines', 'engines'],
  ['live-demo', 'live-demo'],
  ['internals', 'internals'],
  ['addendum', 'technical-addendum'],
];
for (const [name, target] of shots) {
  if (target === 'top') await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  else await page.evaluate((sid) => document.getElementById(sid)?.scrollIntoView({ behavior: 'instant', block: 'start' }), target);
  await sleep(2600);
  await page.screenshot({ path: `tmp/g1fix/scene-${name}.png` });
}
await page.evaluate(() => window.scrollBy({ top: 900, behavior: 'instant' }));
await sleep(2600);
await page.screenshot({ path: 'tmp/g1fix/scene-wing-deep.png' });

console.log('ERRORS', JSON.stringify(errors));
await browser.close();
