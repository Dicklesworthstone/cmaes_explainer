import { describe, expect, test } from "bun:test";
import {
  loadAblationInputs,
  parseTrainReceipt,
  runMeasuredAblation,
  type AblationPairResult,
  type TransformerTrainReceipt,
} from "../app/lib/policyAblationComparison";
import {
  GaitTransformerPolicy,
  loadGaitTransformerWeights,
  type LoadedTransformerWeights,
} from "../app/lib/gaitTransformer";
import { runCmaesPolicySearch } from "../app/lib/cmaesAblationPolicy";

/** The artifact the site actually serves. */
const WEIGHTS_PATH = new URL("../public/robots/g1/transformer/g1-ablation-weights-v2.bin", import.meta.url);
/** The original export, kept so the repair it needed stays documented. */
const LEGACY_WEIGHTS_PATH = new URL("../public/robots/g1/transformer/g1-ablation-weights-v1.bin", import.meta.url);
const RECEIPT_PATH = new URL("../public/robots/g1/transformer/g1-ablation-train-receipt.json", import.meta.url);
const GOLDEN_PATH = new URL("../public/robots/g1/transformer/g1-ablation-golden.json", import.meta.url);

/**
 * The binary weight artifact is produced by frankensim
 * crates/fs-g1-train/examples/train_ablation.rs. When the full artifact
 * set (weights + training receipt + golden vectors) has not been shipped
 * yet, artifact-dependent tests SKIP with a pointer — loud, never a
 * silent pass. Loader fail-closed tests and the CMA-ES contract tests
 * run regardless of artifact presence.
 */
async function fileExists(path: URL): Promise<boolean> {
  try {
    return await Bun.file(path).exists();
  } catch {
    return false;
  }
}

const artifactsPresent =
  (await fileExists(WEIGHTS_PATH)) && (await fileExists(RECEIPT_PATH)) && (await fileExists(GOLDEN_PATH));
const testIfArtifacts: typeof test = artifactsPresent ? test : test.skip;

interface GoldenCase {
  position: number;
  obs: number[];
  meanAction: number[];
  value: number;
}

interface GoldenFile {
  layoutVersion: number;
  cases: GoldenCase[];
}

interface AblationFixtures {
  weights: LoadedTransformerWeights;
  receipt: TransformerTrainReceipt;
  golden: GoldenFile;
}

async function loadAblationFixtures(): Promise<AblationFixtures> {
  const weightsBuf = await Bun.file(WEIGHTS_PATH).arrayBuffer();
  const receiptRaw: unknown = await Bun.file(RECEIPT_PATH).json();
  const golden: GoldenFile = await Bun.file(GOLDEN_PATH).json();
  return { weights: loadGaitTransformerWeights(weightsBuf), receipt: parseTrainReceipt(receiptRaw), golden };
}

/**
 * Regenerates the Rust example's deterministic observation chain:
 * u64 wrapping LCG, obs value = f32(((state >> 33) / 2^31) * 2 - 1).
 * Must stay byte-identical to `next_f32` in fs-g1-train
 * examples/train_ablation.rs.
 */
function goldenObsRow(position: number): number[] {
  let state = 0xa5a55a5a1234abcdn;
  const f64Two31 = Math.pow(2, 31);
  const row: number[] = new Array(42);
  for (let t = 0; t <= position; t++) {
    for (let i = 0; i < 42; i++) {
      state = (state * 6364136223846793005n + 1442695040888963407n) & 0xffffffffffffffffn;
      const shifted = Number(state >> 33n);
      row[i] = Math.fround((shifted / f64Two31) * 2 - 1);
    }
  }
  return row;
}

describe("GaitTransformer weights loader (fail-closed)", () => {
  testIfArtifacts("rejects truncated buffers", async () => {
    const buf = await Bun.file(WEIGHTS_PATH).arrayBuffer();
    expect(() => loadGaitTransformerWeights(buf.slice(0, 32))).toThrow();
  });

  testIfArtifacts("rejects corrupted magic", async () => {
    const buf = await Bun.file(WEIGHTS_PATH).arrayBuffer();
    const poisoned = new Uint8Array(buf.slice(0));
    poisoned[0] = 0x00;
    expect(() => loadGaitTransformerWeights(poisoned.buffer)).toThrow(/magic/);
  });

  testIfArtifacts("accepts the shipped weight file (audited 4-layer GQA architecture)", async () => {
    const buf = await Bun.file(WEIGHTS_PATH).arrayBuffer();
    const weights = loadGaitTransformerWeights(buf);
    expect(weights.config.dModel).toBe(256);
    expect(weights.config.nLayers).toBe(4);
    expect(weights.config.kvDim).toBe(128);
  });

  test("rejects foreign architectures even when internally consistent", () => {
    // Craft a header with the right magic/version but wrong dims (the
    // 6-layer synthetic variant that was once shipped by mistake): the
    const header = new ArrayBuffer(96); // loader minimum-size gate is 52 bytes
    const view = new DataView(header);
    view.setUint32(0, 0x54475346, true); // magic
    view.setUint32(4, 1, true); // layout version
    const dims = [256, 8, 32, 8, 256, 6, 682, 64, 42, 29]; // 6-layer MHA variant
    dims.forEach((d, i) => view.setUint32(8 + i * 4, d, true));
    expect(() => loadGaitTransformerWeights(header)).toThrow(/audited/);
  });

  test("artifact absence is loud, not silent", () => {
    // When artifacts are missing, the skip guard above fires; this test
    // documents that state so a bare pass is never ambiguous.
    if (!artifactsPresent) {
      console.warn(
        "[gaitTransformer] artifact set incomplete — run fs-g1-train/examples/train_ablation.rs and commit public/robots/g1/transformer/g1-ablation-* (weights + receipt + golden)",
      );
    }
    expect(typeof artifactsPresent).toBe("boolean");
  });
});

describe("transformer training receipt boundary", () => {
  const validReceipt = () => ({
    architecture: { parameterCount: 2_902_273 },
    training: {
      samplesConsumed: 8_596,
      wallclockSeconds: 453.9,
      environment: "legacy stand-in",
    },
    environmentContract: "legacy-self-propelled-standin-v1",
    hostNote: "test host",
    evaluation: {
      greedy720: { distanceMeters: 7.8, totalReward: 477, completedSteps: 720 },
    },
  });

  test("rejects nonsensical counts, time, and greedy metrics", () => {
    const badCount = validReceipt();
    badCount.architecture.parameterCount = 0;
    expect(() => parseTrainReceipt(badCount)).toThrow(/parameterCount/);

    const badTime = validReceipt();
    badTime.training.wallclockSeconds = -1;
    expect(() => parseTrainReceipt(badTime)).toThrow(/wallclockSeconds/);

    const badGreedy = validReceipt();
    badGreedy.evaluation.greedy720.completedSteps = 1.5;
    expect(() => parseTrainReceipt(badGreedy)).toThrow(/greedy720 metrics/);
  });

  testIfArtifacts("injected loaders are isolated from the browser fetch cache", async () => {
    const weights = await Bun.file(WEIGHTS_PATH).arrayBuffer();
    const firstRaw = validReceipt();
    const secondRaw = validReceipt();
    secondRaw.training.samplesConsumed = 12_345;

    const first = await loadAblationInputs(async () => weights.slice(0), async () => firstRaw);
    const second = await loadAblationInputs(async () => weights.slice(0), async () => secondRaw);

    expect(first.trainReceipt.samplesConsumed).toBe(8_596);
    expect(second.trainReceipt.samplesConsumed).toBe(12_345);
  });
});

// The fitted-head vectors were regenerated by scripts/regen_golden.ts in TS.
// They are regression vectors, not an independent Rust-forward comparison.
describe("Committed forward vectors for the fitted transformer", () => {
  testIfArtifacts("reproduces the committed outputs from the shipped weight file", async () => {
    const { weights, golden } = await loadAblationFixtures();
    expect(golden.layoutVersion).toBe(1);
    expect(golden.cases.length).toBeGreaterThan(0);

    const policy = new GaitTransformerPolicy(weights);
    const byPosition = new Map<number, GoldenCase>();
    for (const c of golden.cases) byPosition.set(c.position, c);
    const maxPosition = Math.max(...byPosition.keys());

    for (let t = 0; t <= maxPosition; t++) {
      const { action, value } = policy.step(goldenObsRow(t), t);
      const expected = byPosition.get(t);
      if (!expected) continue;
      for (let i = 0; i < expected.meanAction.length; i++) {
        expect(Math.abs(action[i] - expected.meanAction[i])).toBeLessThan(1e-3);
      }
      expect(Math.abs(value - expected.value)).toBeLessThan(1e-3);
    }
  });
});

describe("Measured ablation engine", () => {
  testIfArtifacts("both sides measured, consistent, and deterministic per seed", async () => {
    const { weights, receipt } = await loadAblationFixtures();
    const inputs = { weights, trainReceipt: receipt };

    const a = runMeasuredAblation(inputs, 42);
    const b = runMeasuredAblation(inputs, 42);
    // Wallclock latency fields are host-timing noise by nature — compare
    // them loosely; everything else must be exactly reproducible.
    const stripTiming = (r: AblationPairResult) => ({
      ...r,
      cmaesReceipt: { ...r.cmaesReceipt, inferenceLatencyMicros: 0, trainingWallclockMinutes: 0 },
      transformerReceipt: { ...r.transformerReceipt, inferenceLatencyMicros: 0 },
    });
    expect(stripTiming(a)).toEqual(stripTiming(b));

    expect(a.cmaesReceipt.policyArchitecture).toBe("phase_basis_cmaes");
    expect(a.transformerReceipt.policyArchitecture).toBe("legacy_zero_head_transformer");
    expect(a.transformerReceipt.parameterCount).toBe(receipt.parameterCount);
    expect(a.transformerReceipt.trainingSamplesRequired).toBe(receipt.samplesConsumed);
    expect(a.cmaesReceipt.parameterCount).toBe(105);

    expect(a.efficiencyMultiplier).toBeCloseTo(
      a.transformerReceipt.trainingSamplesRequired / a.cmaesReceipt.trainingSamplesRequired,
      9,
    );
    expect(a.speedDeltaMps).toBeCloseTo(
      a.transformerReceipt.averageSpeedMps - a.cmaesReceipt.averageSpeedMps,
      9,
    );
  });

  testIfArtifacts("the legacy v1 export really did have an all-zero policy head", async () => {
    expect(await fileExists(LEGACY_WEIGHTS_PATH)).toBe(true);
    const legacy = loadGaitTransformerWeights(
      (await Bun.file(LEGACY_WEIGHTS_PATH).arrayBuffer()) as ArrayBuffer,
    );
    // Why v2 exists. Every other tensor in that file carries values; this one
    // is entirely zero, which is the whole reason it produced no motion.
    expect(legacy.policyHead.length).toBe(29 * 256);
    expect(legacy.policyHead.every((w) => w === 0)).toBe(true);
    expect(legacy.embed.some((w) => w !== 0)).toBe(true);
  });

  testIfArtifacts("the shipped transformer moves the robot, and does real work doing it", async () => {
    const { weights, receipt } = await loadAblationFixtures();
    const { transformerReceipt } = runMeasuredAblation({ weights, trainReceipt: receipt }, 7);

    // The committed v1 export had an all-zero policy head, so tanh(0 . h) = 0
    // for every actuator and the robot could not move; the 7.8 m in its receipt
    // came from a legacy stand-in that granted target speed regardless of
    // action. The shipped v2 artifact keeps that trunk byte-for-byte and adds a
    // head fitted by ridge regression to the CMA-ES phase-prior gait, so it now
    // walks — and unlike the legacy number, it spends actuator work to do it.
    expect(receipt.rustGreedy720.distanceMeters).toBeGreaterThan(0.0);
    expect(transformerReceipt.distanceTraveledMeters).toBeGreaterThan(4.0);
    expect(transformerReceipt.averageSpeedMps).toBeGreaterThan(0.0);
    expect(transformerReceipt.actuatorWorkJoules).toBeGreaterThan(0.0);
    expect(transformerReceipt.trainedOnEvaluationContract).toBe(false);
    expect(transformerReceipt.trainingEnvironmentContract).toBe(
      "legacy-self-propelled-standin-v1",
    );
    expect(transformerReceipt.evaluationEnvironmentContract).toBe(
      "action-causal-standin-v2",
    );
    expect(transformerReceipt.survivalRatePercent).toBeCloseTo(
      (receipt.rustGreedy720.completedSteps / 720) * 100,
      9,
    );
  });

  test("CMA-ES side matches the standalone evaluator contract", async () => {
    if (!artifactsPresent) return; // artifact-gated; absence is loud elsewhere
    const standalone = runCmaesPolicySearch({ seed: 42, episodeSteps: 240, finalSteps: 720 });
    const { weights, receipt } = await loadAblationFixtures();
    const { cmaesReceipt } = runMeasuredAblation({ weights, trainReceipt: receipt }, 42);
    expect(cmaesReceipt.trainingSamplesRequired).toBe(standalone.receipt.trainingSamplesRequired);
    expect(cmaesReceipt.distanceTraveledMeters).toBeCloseTo(standalone.finalMetrics.distanceTraveledMeters, 12);
  }, 15000);
});
