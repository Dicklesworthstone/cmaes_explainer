import { buildCmaFamilyConfig, decodeCmaFamilyAsk, decodeCmaFamilySnapshot, decodeG1Evaluation, decodeG1Population } from "../app/lib/frankensimCmaes.ts";

const OWNER_CMA_MAGIC = 0x434d4132;

const wasm = await import("../public/wasm/fs-cmaes/v069/fs_cmaes_viz_wasm.js");
const wasmBytes = await Bun.file("../public/wasm/fs-cmaes/v069/fs_cmaes_viz_wasm_bg.wasm").arrayBuffer();
await wasm.default({ module_or_path: wasmBytes });

const evaluator = new wasm.G1WalkingVizEvaluator(
  new Float64Array([0x47315737, 7, 0, 11, 1/480, 1.5, 0.65, 1.55, 12, 2, 1])
);

const curriculum = evaluator.walking_curriculum_mean();

// Test curriculum * 0.8 with CMA-ES, with many generations
const scaled = new Float64Array(5040);
for (let i = 0; i < 5040; i++) scaled[i] = curriculum[i] * 0.8;
const scaledEval = decodeG1Evaluation(evaluator.evaluate(scaled));
console.log("scaled-0.8 baseline:", scaledEval.ok.completedSteps, "steps", scaledEval.ok.terminationReason);

// Now run CMA on top of scaled
const family = "lm-cma";
const sigma = 0.005;
const population = 16;
const generations = 100;

for (const seed of [0x47315050n, 0x47315051n, 0x47315052n]) {
  const session = new wasm.CmaesVizSession(
    buildCmaFamilyConfig({
      family,
      mean: scaled,
      sigma,
      maxEvaluations: population * generations,
      population,
      memory: 12,
      seed,
    })
  );
  let bestPoint = scaled;
  let bestObj = Infinity;
  try {
    for (let gen = 0; gen < generations; gen++) {
      const ask = decodeCmaFamilyAsk(session.ask());
      if (!("ok" in ask)) break;
      const objs = decodeG1Population(evaluator.evaluate_population(ask.ok.candidates));
      if (!("ok" in objs)) break;
      const tell = Float64Array.from([OWNER_CMA_MAGIC, 2, 3, 6 + population, ask.ok.generation, population, ...objs.ok]);
      const snap = decodeCmaFamilySnapshot(session.tell(tell), 4);
      if (!("ok" in snap)) break;
      if (snap.ok.best && snap.ok.best.objective < bestObj) {
        bestObj = snap.ok.best.objective;
        bestPoint = snap.ok.best.point.slice();
      }
    }
  } finally {
    session.free();
  }
  const e = decodeG1Evaluation(evaluator.evaluate(bestPoint));
  if ("ok" in e) {
    const r = e.ok;
    console.log(`seed ${seed.toString(16)}: steps=${r.completedSteps} term=${r.terminationReason} dist=${r.distanceMeters.toFixed(3)} speed=${(r.distanceMeters/1.5).toFixed(3)} obj=${r.objective.toFixed(1)}`);
  }
}
