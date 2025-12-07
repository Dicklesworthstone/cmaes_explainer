#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const dir = path.join(__dirname, '..', '.next', 'static', 'chunks');
if (!fs.existsSync(dir)) {
  console.warn('[patch_r3f_events] .next/static/chunks not found; skipping');
  process.exit(0);
}

let patched = 0;
for (const file of glob.sync('*.js', { cwd: dir })) {
  const full = path.join(dir, file);
  let txt = fs.readFileSync(full, 'utf8');
  if (!txt.includes('DOM_EVENTS')) continue;
  const before = txt;

  // Guard connect(target) to bail if target is falsy or lacks addEventListener
  txt = txt.replace(/connect:\s*(\w+)\s*=>\s*\{\s*const\s*\{\s*set,\s*events\s*\}\s*=\s*store\.getState\(\);/g,
    'connect:$1=>{ if(!$1||typeof $1.addEventListener!=="function") return; const { set, events } = store.getState();');

  if (txt !== before) {
    fs.writeFileSync(full, txt);
    patched++;
  }
}
console.log(`[patch_r3f_events] patched ${patched} chunk(s)`);
