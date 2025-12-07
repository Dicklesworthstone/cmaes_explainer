import { chromium } from 'playwright';
import { spawn, type ChildProcess } from 'child_process';

async function run() {
  const PORT = process.env.PORT || '3001';
  console.log(`Starting production server on ${PORT}...`);
  const server = spawn('bun', ['start', '-p', PORT], { stdio: 'pipe', shell: true });
  
  let serverReady = false;
  server.stdout.on('data', (data) => {
    const str = data.toString();
    console.log(`[Server]: ${str.trim()}`);
    if (str.includes('Ready') || str.includes('started server')) {
      serverReady = true;
    }
  });
  
  server.stderr.on('data', (data) => console.error(`[Server Error]: ${data}`));

  // Wait for server
  console.log(`Waiting for server port ${PORT}...`);
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://localhost:${PORT}`);
      if (res.ok) break;
    } catch (e) {}
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log("Launching browser...");
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log(`[Browser ${msg.type().toUpperCase()}]: ${msg.text()}`);
      // Print location if available
      const loc = msg.location();
      if (loc.url) console.log(`    at ${loc.url}:${loc.lineNumber}:${loc.columnNumber}`);
    }
  });

  page.on('pageerror', err => {
    console.log(`[Browser CRASH]: ${err.message}`);
    console.log(err.stack);
  });

  try {
  const url = `http://localhost:${PORT}`;
  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle' });
    console.log("Navigation complete. Waiting 5s for delayed errors...");
    await page.waitForTimeout(5000);
  } catch (e) {
    console.error("Test failed:", e);
  } finally {
    await browser.close();
    server.kill();
    process.exit(0);
  }
}

run();
