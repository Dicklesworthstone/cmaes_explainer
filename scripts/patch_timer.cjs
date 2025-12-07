#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const dir = path.join(__dirname, '..', '.next', 'static', 'chunks');
if (!fs.existsSync(dir)) {
  console.warn('[patch_timer] .next/static/chunks not found; skipping');
  process.exit(0);
}
let patchedFiles = 0;
for (const file of glob.sync('*.js', { cwd: dir })) {
  const full = path.join(dir, file);
  let txt = fs.readFileSync(full, 'utf8');
  if (!txt.includes('visibilitychange')) continue;
 const before = txt;
  // Hard override Timer.connect blocks (identified by `_pageVisibilityHandler`) to a safe no-op.
  txt = txt.replace(
    /connect\((\w+)\)\{[^}]*?_pageVisibilityHandler[^}]*?\}disconnect/g,
    'connect($1){return;}disconnect'
  );

  if (txt !== before) {
    fs.writeFileSync(full, txt);
    patchedFiles++;
  }
}
console.log(`[patch_timer] patched ${patchedFiles} chunk(s)`);
