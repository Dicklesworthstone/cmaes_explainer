import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, args: ['--disable-background-timer-throttling', '--disable-renderer-backgrounding'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3200/', { waitUntil: 'networkidle', timeout: 60000 });
await page.evaluate(() => document.getElementById('internals')?.scrollIntoView({ behavior: 'instant' }));
await page.waitForTimeout(4000); // kernel init + first batch + reveal animations settle

const client = await page.context().newCDPSession(page);
await client.send('Profiler.enable');
await client.send('Profiler.setSamplingInterval', { interval: 200 }); // µs — fine-grained
await client.send('Profiler.start');

const sel = page.locator('#internals select').first();
const before = await sel.inputValue();
const opts = (await sel.locator('option').evaluateAll((os) => os.map((o) => o.value))).filter((v) => v !== before);
const t0 = Date.now();
await sel.selectOption(opts[0]);
await page.waitForTimeout(6000);
const wall = Date.now() - t0;

const { profile } = await client.send('Profiler.stop');
await client.send('Profiler.disable');

// attribute self time per function
const byId = new Map(profile.nodes.map((n) => [n.id, n]));
const self = new Map();
let total = 0;
for (let i = 0; i < profile.samples.length; i++) {
  const dt = profile.timeDeltas[i] || 0;
  if (dt <= 0) continue;
  const node = byId.get(profile.samples[i]);
  if (!node) continue;
  total += dt;
  const cf = node.callFrame;
  const url = (cf.url || '').replace(/^.*\/_next/, '_next').slice(0, 70);
  const key = `${cf.functionName || '(anon)'} @ ${url}:${cf.lineNumber}`;
  self.set(key, (self.get(key) || 0) + dt);
}
const top = [...self.entries()].sort((a, b) => b[1] - a[1]).slice(0, 18)
  .map(([k, v]) => ({ ms: Math.round(v / 1000), key: k }));
console.log(JSON.stringify({ wallMs: wall, profiledMs: Math.round(total / 1000), top }, null, 1));
await browser.close();
