#!/usr/bin/env node
// G1 worker + UI: challenge toggle wiring (flat | terrain-and-push).
// Content-anchored with loud failures.
import { readFileSync, writeFileSync } from "node:fs";

const W = "app/workers/g1OptimizationWorker.ts";
let w = readFileSync(W, "utf8");

// 1. Import G1Challenge type + config override helper.
if (!w.includes("type G1Challenge,")) {
  const a = w.indexOf("  type G1TraceReceipt,");
  if (a < 0) throw new Error("import anchor not found");
  w = w.slice(0, a) + "  type G1Challenge,\n" + w.slice(a);
  console.log("import: G1Challenge added");
}
const helper = `function g1Config(challenge: G1Challenge): typeof DEFAULT_G1_WALKING_CONFIG {
  return { ...DEFAULT_G1_WALKING_CONFIG, challenge };
}
`;
if (!w.includes("function g1Config(")) {
  const a = w.indexOf("async function preview(): Promise<void> {");
  if (a < 0) throw new Error("preview anchor not found");
  w = w.slice(0, a) + helper + "\n" + w.slice(a);
  console.log("helper: g1Config added");
}

// 2. Request type: challenge on all three messages.
if (!w.includes("challenge: G1Challenge;")) {
  w = w.replace(
    /(\{ type: "(?:optimize|compare)"; )/g,
    `$1challenge: G1Challenge; `
  );
  w = w.replace(
    '  | { type: "preview"; }',
    '  | { type: "preview"; challenge: G1Challenge; }'
  );
  console.log("request type: challenge added");
}

// 3. Signature + dispatch.
w = w.replace(
  "async function preview(): Promise<void> {",
  "async function preview(challenge: G1Challenge): Promise<void> {"
);
w = w.replace(
  /async function optimize\(\n  family: Exclude<CmaFamily, "full">,\n  requestedGenerations: number,\n  requestedSeedIndex: number,\n  mode: "continue" \| "fresh" = "continue"\n\)/,
  "async function optimize(\n  family: Exclude<CmaFamily, \"full\">,\n  requestedGenerations: number,\n  requestedSeedIndex: number,\n  mode: \"continue\" | \"fresh\" = \"continue\",\n  challenge: G1Challenge = \"terrain-and-push\"\n)"
);
// compare signature
w = w.replace(
  /async function compareFamilies\(\n  requestedGenerations: number,\n  mode: "continue" \| "fresh" = "continue"\n\)/,
  "async function compareFamilies(\n  requestedGenerations: number,\n  challenge: G1Challenge = \"terrain-and-push\"\n)"
);
console.log("signatures patched");

// 4. Config override at all creation sites + pool configs.
w = w.replace(
  /createFrankenSimG1WalkingEvaluator\(DEFAULT_G1_WALKING_CONFIG\)/g,
  "createFrankenSimG1WalkingEvaluator(g1Config(challenge))"
);
w = w.replace(
  /config: DEFAULT_G1_WALKING_CONFIG,/g,
  "config: g1Config(challenge),"
);
console.log("config: sites overridden");

// 5. Run keys + continuation per challenge.
w = w.replace(
  'const runKey = `${family}:${seedIndex}`;',
  'const runKey = `${challenge}:${family}:${seedIndex}`;'
);
// Fresh challenge must not reuse runs keyed for the other challenge: when a
// preview toggles the challenge, the active-run map keys already separate it.

// 6. Dispatch passthrough.
w = w.replace(
  /preview\(\);/g,
  "preview(message.challenge);"
);
w = w.replace(
  /optimize\(request.family, request.generations, request.seedIndex, request.mode\);/g,
  "optimize(request.family, request.generations, request.seedIndex, request.mode, request.challenge);"
);
w = w.replace(
  /compareFamilies\(request.generations\);/g,
  "compareFamilies(request.generations, request.challenge);"
);
console.log("dispatch patched");

writeFileSync(W, w);
console.log("WORKER OK");

// ---- UI side ----
const U = "app/components/G1WalkingFlagship.tsx";
let u = readFileSync(U, "utf8");

if (!u.includes('type G1Challenge,')) {
  const a = u.indexOf('  type G1TraceReceipt,');
  if (a < 0) throw new Error("UI import anchor not found");
  u = u.slice(0, a) + "  type G1Challenge,\n" + u.slice(a);
  console.log("UI import added");
}
if (!u.includes("const [challenge, setChallenge]")) {
  const a = u.indexOf('  const [generations, setGenerations] = useState(16);');
  if (a < 0) throw new Error("generations state anchor not found");
  u = u.slice(0, a) + '  const [challenge, setChallenge] = useState<G1Challenge>("terrain-and-push");\n' + u.slice(a);
  console.log("UI state added");
}

// Posts carry challenge.
u = u.replace(
  /post\(\{ type: "preview" \}, "preview"\);/g,
  'post({ type: "preview", challenge }, "preview");'
);
u = u.replace(
  /\{ type: "optimize", family, generations, seedIndex, mode: "continue" \},/g,
  '{ type: "optimize", family, generations, seedIndex, mode: "continue", challenge },'
);
u = u.replace(
  /\{ type: "compare", generations: 4 \},/g,
  '{ type: "compare", generations: 4, challenge },'
);
// The compare trace chip text uses terrain wording; leave copy as-is (chips
// render the receipt challenge where present).

// Segmented toggle above the budget slider.
const sliderAnchor = '          <div className="mt-5 flex items-center justify-between text-xs text-slate-400">\n            <label htmlFor="g1-generations">';
const toggle = `          <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
            <span id="g1-challenge-label">Challenge</span>
            <div role="radiogroup" aria-labelledby="g1-challenge-label" className="flex gap-2">
              <button
                type="button"
                role="radio"
                aria-checked={challenge === "flat"}
                disabled={busy !== null || !workerAvailable}
                onClick={() => {
                  if (challenge !== "flat") {
                    setChallenge("flat");
                    setGeneration(0);
                    post({ type: "preview", challenge: "flat" }, "preview");
                  }
                }}
                className={\`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors \${challenge === "flat" ? "bg-cyan-500/30 text-cyan-100" : "bg-white/5 text-slate-400 hover:text-slate-200"}\`}
              >
                Flat ground
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={challenge === "terrain-and-push"}
                disabled={busy !== null || !workerAvailable}
                onClick={() => {
                  if (challenge !== "terrain-and-push") {
                    setChallenge("terrain-and-push");
                    setGeneration(0);
                    post({ type: "preview", challenge: "terrain-and-push" }, "preview");
                  }
                }}
                className={\`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors \${challenge === "terrain-and-push" ? "bg-cyan-500/30 text-cyan-100" : "bg-white/5 text-slate-400 hover:text-slate-200"}\`}
              >
                Terrain + push
              </button>
            </div>
          </div>
` + sliderAnchor;
const si = u.indexOf(sliderAnchor);
if (si < 0) throw new Error("UI slider anchor not found");
u = u.slice(0, si) + toggle + u.slice(si + sliderAnchor.length);
console.log("UI toggle added");

writeFileSync(U, u);
console.log("UI OK");
