// scripts/check-large-js.mjs
//
// Lightweight bundle-size guard for CI (added in the W2 six-lens
// follow-up). Catches the same class of bug that caused the
// homepage-desktop frame-starvation: a future commit accidentally
// bundles a heavy dep or a sibling lands a 2MB chunk without
// route-splitting.
//
// Two checks:
//   1. Absolute threshold: any chunk > absLimit bytes is a FAIL
//      (defaults to 1.1 MB; we know the G1+arm scenes legitimately
//      run ~900 KB because Three.js + R3F + our physics is bundled
//      together).
//   2. Relative growth: any chunk in the baseline that grew by
//      more than 15% since the baseline is a FAIL. This is the
//      real bang-for-buck — catches "the existing 882KB chunk jumped
//      to 1.5MB" which the absolute threshold alone would miss if
//      the absolute is set high enough to pass current state.
//
// The baseline is read from scripts/check-large-js.baseline.json
// (a map of chunk-name → bytes). If the file is missing, check 1
// only. The baseline file is committed at the same path.
//
// Usage: bun run scripts/check-large-js.mjs
// Exit 0 OK, 1 any-chunk-over-budget, 2 read error.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const ABSOLUTE_LIMIT_BYTES = 1_100_000; // 1.1 MB
const RELATIVE_GROWTH_RATIO = 1.15;     // 15% growth vs baseline = FAIL
const CHUNKS_DIR = ".next/static/chunks";
const BASELINE_FILE = "scripts/check-large-js.baseline.json";

function readBaseline() {
  if (!existsSync(BASELINE_FILE)) return {};
  try {
    return JSON.parse(readFileSync(BASELINE_FILE, "utf-8"));
  } catch (err) {
    console.error(`[check-large-js] could not read ${BASELINE_FILE}:`, err.message);
    return {};
  }
}

function listChunks() {
  let files;
  try {
    files = readdirSync(CHUNKS_DIR);
  } catch (err) {
    console.error(`[check-large-js] could not list ${CHUNKS_DIR}:`, err.message);
    process.exit(2);
  }
  return files
    .filter((f) => f.endsWith(".js"))
    .map((f) => {
      let sz;
      try {
        sz = statSync(join(CHUNKS_DIR, f)).size;
      } catch (err) {
        return null;
      }
      return { file: f, sizeBytes: sz };
    })
    .filter(Boolean);
}

const baseline = readBaseline();
const chunks = listChunks();
const offenders = [];

for (const { file, sizeBytes } of chunks) {
  if (sizeBytes > ABSOLUTE_LIMIT_BYTES) {
    offenders.push({
      file,
      reason: `absolute ${(sizeBytes / 1024).toFixed(1)} KB > limit ${(ABSOLUTE_LIMIT_BYTES / 1024).toFixed(0)} KB`,
    });
    continue;
  }
  if (baseline[file] != null) {
    const base = baseline[file];
    if (sizeBytes > base * RELATIVE_GROWTH_RATIO) {
      offenders.push({
        file,
        reason: `growth ${(sizeBytes / 1024).toFixed(1)} KB > ${(base * RELATIVE_GROWTH_RATIO / 1024).toFixed(0)} KB (baseline ${(base / 1024).toFixed(1)} KB × ${RELATIVE_GROWTH_RATIO})`,
      });
    }
  }
}

if (offenders.length > 0) {
  console.error(`[check-large-js] FAIL: ${offenders.length} chunk(s) over budget`);
  for (const o of offenders) {
    console.error(`  ${o.file}: ${o.reason}`);
  }
  process.exit(1);
}

console.log(
  `[check-large-js] OK: ${chunks.length} chunks, max ${(
    Math.max(...chunks.map((c) => c.sizeBytes)) / 1024
  ).toFixed(1)} KB, all within absolute limit and (if baseline present) within 15% of baseline`,
);
