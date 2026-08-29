import { buildCmaFamilyConfig, decodeCmaFamilyAsk, decodeCmaFamilySnapshot, decodeG1Admission, decodeG1Evaluation, decodeG1Population } from "../app/lib/frankensimCmaes.ts";

const OWNER_CMA_MAGIC = 0x434d4132;

const wasm = await import("../public/wasm/fs-cmaes/v068/fs_cmaes_viz_wasm.js");
const wasmBytes = await Bun.file("../public/wasm/fs-cmaes/v068/fs_cmaes_viz_wasm_bg.wasm").arrayBuffer();
await wasm.default({ module_or_path: wasmBytes });

const evaluator = new wasm.G1WalkingVizEvaluator(
  new Float64Array([0x47315737, 7, 0, 11, 1/480, 1.5, 0.65, 1.55, 12, 2, 1])
);

const curriculum = evaluator.walking_curriculum_mean();
const seeds = [0x47315050n, 0x47315051n, 0x47315052n];
const population = 16;
const generations = 16;
for (const seed of seeds) {
  const session = new wasm.CmaesVizSession(
    buildCmaFamilyConfig({
      family: "separable",
      mean: curriculum,
      sigma: 0.0005,
      maxEvaluations: population * generations,
      population,
      seed,
    })
  );
  let bestPoint = curriculum;
  let bestObj = Infinity;
  try {
    for (let gen = 0; gen < generations; gen++) {
      const ask = decodeCmaFamilyAsk(session.ask());
      if (!("ok" in ask)) continue;
      const objs = decodeG1Population(evaluator.evaluate_population(ask.ok.candidates));
      if (!("ok" in objs)) continue;
      const tell = Float64Array.from([OWNER_CMA_MAGIC, 2, 3, 6 + population, ask.ok.generation, population, ...objs.ok]);
      const snap = decodeCmaFamilySnapshot(session.tell(tell), 4);
      if (!("ok" in snap)) continue;
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
    console.log("seed " + seed + ": steps=" + e.completedSteps + " term=" + e.terminationReason + " dist=" + e.distanceMeters.toFixed(3) + " obj=" + e.objective.toFixed(1) + " speed=" + (e.distanceMeters/1.5).toFixed(3) + " m/s maxTilt=" + e.maximumTiltSine.toFixed(3));
  }
}
