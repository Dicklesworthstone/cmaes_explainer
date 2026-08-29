import { chromium, devices } from 'playwright';

// Discriminator: does the SECTION render at all under iphone emulation when
// captured as the live VIEWPORT (no captureBeyondViewport)? Flats were only
// ever full-ELEMENT captures (1170 x 5000-10000px).
const browser = await chromium.launch({
  headless: true,
  args: [
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
    '--disable-background-timer-throttling',
  ],
});
const ctx = await browser.newContext({ ...devices['iPhone 13'], userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e}`));
page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text()}`));
await page.goto('http://localhost:3200/', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(2000);

for (const id of ['wing-walkthrough', 'engines', 'internals', 'technical-addendum']) {
  await page.evaluate((sid) => document.getElementById(sid).scrollIntoView({ behavior: 'instant', block: 'start' }), id);
  await page.waitForTimeout(3200);
  await page.screenshot({ path: `tmp/viewport-probe-${id}.png` }); // viewport-only capture
}
console.log(JSON.stringify({ errors }, null, 1));
await browser.close();
