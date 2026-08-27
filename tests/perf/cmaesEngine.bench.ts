import { CMAESOptimizerND, type VectorND } from "../../app/lib/cmaesEngineND";

interface BenchmarkOptions {
  dim: number;
  generations: number;
  trials: number;
  warmupTrials: number;
  seed: number;
  golden: boolean;
}

function integerArgument(name: string, fallback: number): number {
  const prefix = `--${name}=`;
  const raw = process.argv.find((argument) => argument.startsWith(prefix))?.slice(prefix.length);
  if (raw === undefined) return fallback;
  const parsed = Number(raw);
  if (!Number.isSafeInteger(parsed) || parsed < 0) {
    throw new RangeError(`${name} must be a non-negative safe integer.`);
  }
  return parsed;
}

const options: BenchmarkOptions = {
  dim: integerArgument("dim", 12),
  generations: integerArgument("generations", 250),
  trials: integerArgument("trials", 20),
  warmupTrials: integerArgument("warmup", 3),
  seed: integerArgument("seed", 1729),
  golden: process.argv.includes("--golden")
};

if (options.dim < 1 || options.generations < 1 || options.trials < 1) {
  throw new RangeError("dim, generations, and trials must all be positive.");
}

function ellipsoidObjective(point: VectorND): number {
  let total = 0;
  const denominator = Math.max(1, point.length - 1);
  for (let index = 0; index < point.length; index++) {
    const scale = 10 ** (3 * index / denominator);
    const centered = point[index] - 0.37;
    total += scale * centered * centered;
  }
  return total;
}

function runTrial(seed: number) {
  const optimizer = new CMAESOptimizerND(ellipsoidObjective, {
    dim: options.dim,
    initialMean: Array.from({ length: options.dim }, (_, index) => 0.15 + 0.7 * index / Math.max(1, options.dim - 1)),
    initialSigma: 0.23,
    repairStrategy: "none",
    seed
  });

  let state = optimizer.step();
  for (let generation = 1; generation < options.generations; generation++) state = optimizer.step();
  return state;
}

if (options.golden) {
  const state = runTrial(options.seed);
  process.stdout.write(`${JSON.stringify({
    engine: "CMAESOptimizerND",
    scenario: "anisotropic-ellipsoid-unbounded",
    dim: options.dim,
    generations: options.generations,
    seed: options.seed,
    generation: state.generation,
    evalCount: state.evalCount,
    bestFitness: state.bestFitness,
    bestX: state.bestX,
    mean: state.mean,
    sigma: state.sigma,
    covariance: state.covariance,
    eigenvalues: state.eigenvalues,
    conditionNumber: state.conditionNumber
  }, null, 2)}\n`);
} else {
  for (let trial = 0; trial < options.warmupTrials; trial++) runTrial(options.seed + trial);

  const durationsMs: number[] = [];
  let checksum = 0;
  let totalEvaluations = 0;
  for (let trial = 0; trial < options.trials; trial++) {
    const started = performance.now();
    const state = runTrial(options.seed + 10_000 + trial);
    durationsMs.push(performance.now() - started);
    totalEvaluations += state.evalCount;
    checksum += state.bestFitness + state.sigma + state.conditionNumber;
  }

  const sorted = [...durationsMs].sort((left, right) => left - right);
  const percentile = (fraction: number): number => sorted[Math.min(sorted.length - 1, Math.ceil(fraction * sorted.length) - 1)];
  const totalDurationSeconds = durationsMs.reduce((sum, duration) => sum + duration, 0) / 1_000;

  process.stdout.write(`${JSON.stringify({
    engine: "CMAESOptimizerND",
    scenario: "anisotropic-ellipsoid-unbounded",
    dim: options.dim,
    generationsPerTrial: options.generations,
    trials: options.trials,
    warmupTrials: options.warmupTrials,
    populationSize: 4 + Math.floor(3 * Math.log(options.dim)),
    durationsMs,
    p50Ms: percentile(0.5),
    p95Ms: percentile(0.95),
    p99Ms: percentile(0.99),
    totalEvaluations,
    evaluationsPerSecond: totalEvaluations / totalDurationSeconds,
    checksum
  }, null, 2)}\n`);
}
