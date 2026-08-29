import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, args: ['--disable-background-timer-throttling'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3200/', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(2000);

const unnamed = await page.evaluate(() => {
  const out = [];
  for (const el of document.querySelectorAll('button, a[href]')) {
    if (el.offsetParent === null) continue; // visible only
    const named = (el.innerText || '').trim() || el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.getAttribute('title');
    if (named) continue;
    const sec = el.closest('section, footer, header, nav');
    const secId = sec?.id || sec?.tagName.toLowerCase() || 'unknown';
    const parentText = (el.parentElement?.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60);
    const html = el.outerHTML.replace(/\s+/g, ' ').slice(0, 150);
    out.push({ sec: secId, tag: el.tagName, cls: (el.className || '').toString().slice(0, 50), parentText, html });
  }
  return out;
});
console.log(JSON.stringify(unnamed, null, 1));
await browser.close();
