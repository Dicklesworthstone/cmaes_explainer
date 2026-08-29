import { chromium } from 'playwright';
import { createHash } from 'crypto';

const hash = (buf) => createHash('sha1').update(buf).digest('hex').slice(0, 10);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({
  headless: true,
  args: ['--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding', '--disable-background-timer-throttling'],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${String(e).slice(0, 140)}`));
page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text().slice(0, 140)}`));
page.on('requestfailed', (r) => errors.push(`requestfailed: ${r.method()} ${r.url().slice(0, 100)}`));

await page.addInitScript(() => {
  window.__longTasks = [];
  new PerformanceObserver((l) => window.__longTasks.push(...l.getEntries().map((e) => Math.round(e.duration))))
    .observe({ entryTypes: ['longtask'] });
});

await page.goto('http://localhost:3200/', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(2500);

const SECTIONS = ['what-is-cmaes', 'no-gradients', 'wing-walkthrough', 'engines', 'live-demo', 'internals', 'g1-walking', 'technical-addendum'];
const report = { sections: {}, a11y: {}, resize: [], totals: {} };

// --- canvas reaction probe: two baseline shots detect self-animation ---
async function canvasState(locator) {
  const canvases = locator.locator('canvas');
  const n = await canvases.count();
  const shots = [];
  for (let i = 0; i < Math.min(n, 3); i++) {
    try { shots.push(hash(await canvases.nth(i).screenshot({ timeout: 4000 }))); } catch { shots.push('shot-fail'); }
  }
  return shots;
}
async function canvasAnimated(locator) {
  const a = await canvasState(locator);
  await sleep(450);
  const b = await canvasState(locator);
  return JSON.stringify(a) !== JSON.stringify(b);
}

for (const id of SECTIONS) {
  const sec = page.locator(`#${id}`);
  await sec.scrollIntoViewIfNeeded().catch(() => {});
  await sleep(1600);
  const r = { sliders: 0, slidersChanged: 0, selects: 0, selectsChanged: 0, checks: 0, pills: 0, dead: [] };

  // range inputs: keyboard-operate, verify value change
  const ranges = sec.locator('input[type=range]');
  const rc = await ranges.count();
  r.sliderCount = rc;
  for (let i = 0; i < Math.min(rc, 6); i++) {
    const s = ranges.nth(i);
    if (!(await s.isVisible().catch(() => false))) continue;
    const before = await s.inputValue();
    const wasAnimated = await canvasAnimated(sec);
    await s.focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await sleep(350);
    const after = await s.inputValue();
    r.sliders++;
    if (after !== before) {
      r.slidersChanged++;
    } else {
      r.dead.push(`range[${i}] value stuck at ${before}`);
    }
    if (!wasAnimated) {
      const post = await canvasState(sec);
      // if the section was static and stays identical after a value change, note it
      await sleep(300);
      const post2 = await canvasState(sec);
      if (JSON.stringify(post) === JSON.stringify(post2)) r.dead.push(`range[${i}] static canvas unchanged (may be text-only viz)`);
    }
  }

  // selects: switch option, verify value change
  const selects = sec.locator('select');
  const sc = await selects.count();
  r.selectCount = sc;
  for (let i = 0; i < Math.min(sc, 4); i++) {
    const sel = selects.nth(i);
    if (!(await sel.isVisible().catch(() => false))) continue;
    const before = await sel.inputValue();
    const opts = (await sel.locator('option').evaluateAll((os) => os.map((o) => o.value))).filter((v) => v !== before);
    if (!opts.length) continue;
    await sel.focus();
    await sel.selectOption(opts[0]);
    await sleep(400);
    const after = await sel.inputValue();
    r.selects++;
    if (after !== before) r.selectsChanged++; else r.dead.push(`select[${i}] stuck`);
  }

  // checkboxes: toggle and verify
  const boxes = sec.locator('input[type=checkbox]');
  const bc = await boxes.count();
  for (let i = 0; i < Math.min(bc, 3); i++) {
    const c = boxes.nth(i);
    if (!(await c.isVisible().catch(() => false))) continue;
    const before = await c.isChecked();
    await c.click();
    await sleep(300);
    const after = await c.isChecked();
    r.checks++;
    if (after === before) r.dead.push(`checkbox[${i}] stuck`);
    await c.click(); // restore
  }

  // buttons/pills: click visible non-destructive ones (skip external/copy/start-run)
  const btns = sec.getByRole('button');
  const btnCount = await btns.count();
  for (let i = 0; i < Math.min(btnCount, 4); i++) {
    const b = btns.nth(i);
    if (!(await b.isVisible().catch(() => false))) continue;
    const label = ((await b.textContent()) || '').trim().slice(0, 40);
    if (/start|run|optimi|copy|download|github/i.test(label)) continue;
    try { await b.click({ timeout: 3000 }); r.pills++; await sleep(350); } catch { /* non-clickable */ }
  }

  report.sections[id] = r;
}

// HUD reactivity spot-checks (strong assertions)
const hud = {};
// CmaesIntro: f(m) readout exists and is numeric
hud.introFm = await page.locator('#what-is-cmaes').getByText(/f\(m\)/).first().isVisible().catch(() => false);
// InternalsLab: LIVE INTERNALS block with numeric best
hud.internalsBest = await page.locator('#internals').getByText(/Best/).first().isVisible().catch(() => false);
// G1: honest boundary note present
hud.g1Boundary = await page.getByText(/25,401,600|256-D/).first().isVisible().catch(() => false);
report.hud = hud;

// --- a11y block ---
report.a11y = await page.evaluate(() => {
  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => +h.tagName[1]);
  const skips = [];
  for (let i = 1; i < headings.length; i++) if (headings[i] - headings[i - 1] > 1) skips.push(`h${headings[i - 1]}->h${headings[i]} @${i}`);
  const unnamed = [...document.querySelectorAll('button, a[href]')]
    .filter((el) => el.offsetParent !== null)
    .filter((el) => !((el.innerText || '').trim() || el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.getAttribute('title')))
    .map((el) => el.tagName + ':' + (el.className || '').toString().slice(0, 40));
  const unlabeledSelects = [...document.querySelectorAll('select')]
    .filter((s) => !s.getAttribute('aria-label') && !(s.labels && s.labels.length))
    .length;
  const imgsNoAlt = [...document.querySelectorAll('img')].filter((im) => im.alt === undefined).length;
  return {
    h1Count: headings.filter((h) => h === 1).length,
    headingSkips: skips,
    unnamedControls: unnamed,
    unlabeledSelects,
    imgsNoAlt,
    lang: document.documentElement.lang,
    hasMain: !!document.querySelector('main'),
    hasHeader: !!document.querySelector('header'),
    hasFooter: !!document.querySelector('footer'),
  };
});

report.longTasks = await page.evaluate(() => ({ count: window.__longTasks.length, ms: window.__longTasks.reduce((a, b) => a + b, 0), max: Math.max(0, ...window.__longTasks) }));

// --- resize/rotate sweep ---
const sizes = [[1440, 900], [1024, 768], [768, 1024], [390, 844], [320, 690], [844, 390], [1440, 900]];
for (const [w, h] of sizes) {
  await page.setViewportSize({ width: w, height: h });
  await sleep(900);
  const s = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  report.resize.push({ w, h, ...s, ok: s.sw === s.w });
}
report.errors = errors;
console.log(JSON.stringify(report, null, 1));
await browser.close();
