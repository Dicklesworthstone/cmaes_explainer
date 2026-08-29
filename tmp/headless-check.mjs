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
await page.goto('http://localhost:3200/', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(2500);

const state = () =>
  page.evaluate(() => {
    const els = [...document.querySelectorAll('div')].filter((d) => (d.getAttribute('class') || '').includes('z-[70]'));
    return els.map((el) => ({ display: getComputedStyle(el).display, opacity: getComputedStyle(el).opacity }));
  });

const y = () => page.evaluate(() => Math.round(window.scrollY));

// j scroll test
await page.keyboard.press('j');
await page.waitForTimeout(1500);
const afterJ = await y();

// ? toggle open
await page.keyboard.press('?');
await page.waitForTimeout(700);
const afterQ1 = await state();

// ? toggle close
await page.keyboard.press('?');
await page.waitForTimeout(700);
const afterQ2 = await state();

// reopen + Esc close
await page.keyboard.press('?');
await page.waitForTimeout(700);
const afterQ3 = await state();
await page.keyboard.press('Escape');
await page.waitForTimeout(700);
const afterEsc = await state();

console.log(
  JSON.stringify(
    { scrollYAfterJ: afterJ, afterQ1, afterQ2: { count: afterQ2.length, states: afterQ2 }, afterQ3: { count: afterQ3.length }, afterEsc: { count: afterEsc.length, states: afterEsc } },
    null,
    1
  )
);
await browser.close();
