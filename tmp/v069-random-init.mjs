import { buildCmaFamilyConfig, decodeCmaFamilyAsk, decodeCmaFamilySnapshot, decodeG1Evaluation, decodeG1Population } from "../app/lib/frankensimCmaes.ts";

const OWNER_CMA_MAGIC = 0x434d4132;

const wasm = await import("../public/wasm/fs-cmaes/v069/fs_cmaes_viz_wasm.js");
const wasmBytes = await Bun.file("../public/wasm/fs-cmaes/v069/fs_cmaes_viz_wasm_bg.wasm").arrayBuffer();
await wasm.default({ module_or_path: wasmBytes });

const evaluator = new wasm.G1WalkingVizEvaluator(
  new Float64Array([0x47315737, 7, 0, 11, 1/480, 1.5, 0.65, 1.55, 12, 2, 1])
);

// Try different sigma values with the curriculum starting point
const curriculum = evaluator.walking_curriculum_mean();
console.log("curriculum nonzero:", curriculum.filter(v => v !== 0).length);

for (const sigma of [0.01, 0.05, 0.1, 0.2, 0.5]) {
  const session = new wasm.CmaesVizSession(
    buildCmaFamilyConfig({
      family: "lm-cma",
      mean: curriculum,
      sigma,
      maxEvaluations: 16 * 16,
      population: 16,
      memory: 12,
      seed: 0x47315050n,
    })
  );
  let bestPoint = curriculum;
  let bestObj = Infinity;
  try {
    for (let gen = 0; gen < 16; gen++) {
      const ask = decodeCmaFamilyAsk(session.ask());
      if (!("ok" in ask)) break;
      const objs = decodeG1Population(evaluator.evaluate_population(ask.ok.candidates));
      if (!("ok" in objs)) break;
      const tell = Float64Array.from([OWNER_CMA_MAGIC, 2, 3, 6 + 16, ask.ok.generation, 16, ...objs.ok]);
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
  const eval_ = decodeG1Evaluation(evaluator.evaluate(bestPoint));
  if ("ok" in eval_) {
    const e = eval_.ok;
    console.log(`sigma=${sigma}: steps=${e.completedSteps} dist=${e.distanceMeters.toFixed(3)} speed=${(e.distanceMeters/1.5).toFixed(3)} m/s obj=${e.objective.toFixed(1)}`);
  }
}
