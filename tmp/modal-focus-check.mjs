import { chromium } from 'playwright';

const browser = await chromium.launch({
  headless: true,
  args: ['--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding', '--disable-background-timer-throttling'],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e}`));
page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text()}`));
await page.goto('http://localhost:3200/', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(1500);

const out = { steps: {} };

// Anchor focus on a real focusable element, then open via the global handler
await page.keyboard.press('Tab'); // skip link gets focus
out.steps.skipLinkFocused = await page.evaluate(() =>
  document.activeElement?.textContent?.includes('Skip') || document.activeElement?.getAttribute('href') === '#what-is-cmaes'
);
const anchorBefore = await page.evaluate(() => document.activeElement?.outerHTML?.slice(0, 80) ?? 'none');

await page.keyboard.press('?');
const dialog = page.locator('div[role="dialog"][aria-modal="true"]');
await dialog.waitFor({ state: 'visible', timeout: 5000 });
out.steps.modalOpens = true;
out.steps.ariaLabel = await dialog.getAttribute('aria-label');

const closeBtn = dialog.getByRole('button', { name: 'Close keyboard shortcuts' });
out.steps.initialFocusInDialog = await closeBtn.evaluate((el) => document.activeElement === el);

await page.keyboard.press('Tab');
out.steps.tabStaysInDialog = await closeBtn.evaluate((el) => document.activeElement === el);
await page.keyboard.press('Shift+Tab');
out.steps.shiftTabStaysInDialog = await closeBtn.evaluate((el) => document.activeElement === el);

await page.keyboard.press('Escape');
await page.waitForTimeout(2500);
out.steps.modalClosesOnEscape = await dialog.count() === 0;
const anchorAfter = await page.evaluate(() => document.activeElement?.outerHTML?.slice(0, 80) ?? 'none');
out.steps.focusRestored = anchorBefore === anchorAfter;
out.steps.focusAnchor = anchorAfter;

const y0 = await page.evaluate(() => window.scrollY);
await page.keyboard.press('j');
await page.waitForTimeout(5000);
const y1 = await page.evaluate(() => window.scrollY);
out.steps.jNavigates = y1 > y0 + 100;

out.consoleErrors = errors;
console.log(JSON.stringify(out, null, 1));
await browser.close();
