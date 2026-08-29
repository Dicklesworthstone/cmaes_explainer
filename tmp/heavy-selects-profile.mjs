import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, args: ['--disable-background-timer-throttling', '--disable-renderer-backgrounding'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3200/', { waitUntil: 'networkidle', timeout: 60000 });
await page.evaluate(() => document.getElementById('internals')?.scrollIntoView({ behavior: 'instant' }));
await page.waitForTimeout(4000);

// what options exist per select?
const selects = page.locator('#internals select');
const n = await selects.count();
const meta = [];
for (let i = 0; i < n; i++) {
  const s = selects.nth(i);
  const label = await s.getAttribute('aria-label');
  const opts = await s.locator('option').evaluateAll((os) => os.map((o) => ({ v: o.value, t: o.textContent })));
  meta.push({ i, label, opts });
}
console.log(JSON.stringify(meta, null, 1));

// profile the FULL sweep-like sequence: change every select to a different option
const client = await page.context().newCDPSession(page);
await client.send('Profiler.enable');
await client.send('Profiler.setSamplingInterval', { interval: 200 });
await client.send('Profiler.start');
const t0 = Date.now();
for (let i = 0; i < n; i++) {
  const s = selects.nth(i);
  const before = await s.inputValue();
  const opts = (await s.locator('option').evaluateAll((os) => os.map((o) => o.value))).filter((v) => v !== before);
  if (!opts.length) continue;
  const pick = opts[opts.length - 1]; // heaviest-looking choice (largest value)
  await s.selectOption(pick);
  await page.waitForTimeout(1500);
}
const wall = Date.now() - t0;
await page.waitForTimeout(3000);
const { profile } = await client.send('Profiler.stop');
await client.send('Profiler.disable');

const byId = new Map(profile.nodes.map((x) => [x.id, x]));
const self = new Map();
let total = 0;
for (let i = 0; i < profile.samples.length; i++) {
  const dt = profile.timeDeltas[i] || 0;
  if (dt <= 0) continue;
  const node = byId.get(profile.samples[i]);
  if (!node) continue;
  total += dt;
  const cf = node.callFrame;
  const key = `${cf.functionName || '(anon)'} @ ${(cf.url || 'internal').replace(/^.*\/_next/, '_next').slice(0, 60)}:${cf.lineNumber}`;
  self.set(key, (self.get(key) || 0) + dt);
}
const top = [...self.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12)
  .map(([k, v]) => ({ ms: Math.round(v / 1000), key: k }));
console.log(JSON.stringify({ wallMs: wall, profiledProgramMs: Math.round((total - (self.get('(idle) @ :-1') || 0)) / 1000), top }, null, 1));
await browser.close();
