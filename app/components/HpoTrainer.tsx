"use client";

import { useCallback, useRef, useState } from "react";
import {
  CmaesHyperparameterOptimizer,
  defaultGenotypeFromSpecs,
  G1_TRAINING_HYPERPARAMETERS,
  type HpoCandidateDecoded,
  type HpoParameterSpec,
  type HpoSweepResult,
} from "../lib/cmaesHyperparameterLoop";
import { Section } from "./Section";

const RUN_BATCH_SIZES = [1, 5, 20] as const;

function formatParam(value: number, spec: HpoParameterSpec): string {
  if (spec.isLogScale) {
    return value.toExponential(2);
  }
  return value.toFixed(3);
}

export function HpoBestParameters({ best }: { best?: HpoCandidateDecoded }) {
  const bestByName: Record<string, number> = best
    ? {
        muon_learning_rate: best.muonLearningRate,
        muon_momentum: best.muonMomentum,
        ppo_entropy_coef: best.ppoEntropyCoef,
        weight_progress: best.weightProgress,
        weight_upright: best.weightUpright,
        weight_energy: best.weightEnergy,
        gae_lambda: best.gaeLambda,
        value_loss_coef: best.valueLossCoef,
      }
    : {};
  return (
    <ul className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-1.5 font-mono text-sm text-slate-200">
      {G1_TRAINING_HYPERPARAMETERS.map((spec) => {
        const value = bestByName[spec.name];
        return (
          <li key={spec.name} className="contents" data-testid="hpo-best-param">
            <span className="break-all text-slate-400">{spec.name}</span>
            <span className="text-right text-slate-100">
              {value === undefined ? "-" : formatParam(value, spec)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function HpoTrainer() {
  const [result, setResult] = useState<HpoSweepResult | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [running, setRunning] = useState(false);
  const [lastDelta, setLastDelta] = useState<number | null>(null);
  const [batch, setBatch] = useState<(typeof RUN_BATCH_SIZES)[number]>(1);
  const [warmStart, setWarmStart] = useState(false);
  const [mirrored, setMirrored] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const optimizerRef = useRef<CmaesHyperparameterOptimizer | null>(null);
  // Ref (not state) so React 19 strict mode running the updater twice
  // does NOT trigger a duplicate setLastDelta side-effect.
  const lastBestRef = useRef<number | null>(null);

  const ensureOptimizer = useCallback((): CmaesHyperparameterOptimizer => {
    if (optimizerRef.current === null) {
      optimizerRef.current = new CmaesHyperparameterOptimizer(
        G1_TRAINING_HYPERPARAMETERS,
        0x47315040,
        {
          warmStartGenotype: warmStart
            ? defaultGenotypeFromSpecs(G1_TRAINING_HYPERPARAMETERS)
            : undefined,
          warmStartSigma: 0.2,
          mirroredSampling: mirrored,
        },
      );
    }
    return optimizerRef.current;
  }, [warmStart, mirrored]);

  const runBatch = useCallback(
    async (gens: number) => {
      if (running) return;
      setRunning(true);
      setCopyStatus("");
      try {
        const optimizer = ensureOptimizer();
        for (let g = 0; g < gens; g += 1) {
          await new Promise<void>((resolve) => setTimeout(resolve, 0));
          const r = optimizer.stepGeneration();
          const prevBest = lastBestRef.current;
          const delta = prevBest === null ? null : r.bestFitness - prevBest;
          lastBestRef.current = r.bestFitness;
          setResult(r);
          setLastDelta(delta);
          setHistory((prev) => [...prev, r.bestFitness]);
        }
      } finally {
        setRunning(false);
      }
    },
    [running, ensureOptimizer],
  );

  const reset = useCallback(() => {
    optimizerRef.current = null;
    lastBestRef.current = null;
    setResult(null);
    setHistory([]);
    setLastDelta(null);
    setCopyStatus("");
  }, []);

  const copyHistory = async () => {
    const payload = {
      schema: "cmaes-explainer.hpo-history/v1",
      exportedAt: new Date().toISOString(),
      seed: "0x47315040",
      environment: "G1StepwiseEnv kinematic stand-in",
      maximumStepsPerRollout: 120,
      warmStart,
      mirrored,
      generations: history.length,
      result,
      csv: [
        "generation,best_fitness",
        ...history.map((v, i) => `${i + 1},${v.toExponential(6)}`),
      ].join("\n"),
    };
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      setCopyStatus("History copied.");
    } catch {
      setCopyStatus("Copy failed. Allow clipboard access and try again.");
    }
  };

  return (
    <Section
      id="hpo-trainer"
      title="Exploring hyperparameter search with CMA-ES"
    >
      <div className="space-y-4">
        <p className="max-w-3xl text-sm leading-7 text-slate-400">
          This eight-dimensional CMA-ES search evaluates a kinematic stand-in
          for G1 motion. Learning rate, momentum and entropy currently control
          action amplitude, smoothing and noise; the three reward weights, GAE
          lambda and value-loss coefficient do not yet affect evaluation. No PPO
          or Muon training runs here. Each generation evaluates eight
          candidates, or sixteen with mirrored sampling, for up to 120 steps per
          rollout.
        </p>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wider text-slate-500">
                Generation
              </div>
              <div className="font-mono text-2xl text-slate-100">
                {result === null ? 0 : result.generation}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wider text-slate-500">
                Best fitness (min)
              </div>
              <div className="font-mono text-2xl text-slate-100">
                {result === null ? "-" : result.bestFitness.toFixed(3)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wider text-slate-500">
                Last delta
              </div>
              <div
                className={`font-mono text-2xl ${
                  lastDelta === null
                    ? "text-slate-500"
                    : lastDelta < 0
                      ? "text-emerald-300"
                      : lastDelta > 0
                        ? "text-rose-300"
                        : "text-slate-300"
                }`}
              >
                {lastDelta === null ? "-" : lastDelta.toFixed(3)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wider text-slate-500">
                Inner rollouts
              </div>
              <div className="font-mono text-2xl text-slate-100">
                {result === null ? 0 : result.evaluationsCount}
              </div>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void runBatch(batch)}
              disabled={running}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-emerald-500/60 bg-emerald-500/15 px-4 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {running
                ? "Running..."
                : `Run ${batch} generation${batch === 1 ? "" : "s"}`}
            </button>
            <label className="flex min-h-11 items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/40 px-3 text-xs text-slate-400">
              <span>Batch</span>
              <select
                value={batch}
                onChange={(e) => {
                  const next = Number(
                    e.target.value,
                  ) as (typeof RUN_BATCH_SIZES)[number];
                  setBatch(next);
                }}
                disabled={running}
                className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100"
              >
                {RUN_BATCH_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={reset}
              disabled={running}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/60 px-4 text-sm text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reset
            </button>
            <label className="flex min-h-11 items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/40 px-3 text-xs text-slate-400">
              <input
                type="checkbox"
                checked={warmStart}
                onChange={(e) => {
                  setWarmStart(e.target.checked);
                  reset();
                }}
                disabled={running}
                className="h-4 w-4 accent-emerald-400"
              />
              <span>
                WS warm start{" "}
                <span className="text-slate-500">
                  (start the mean at the hand-tuned defaults)
                </span>
              </span>
            </label>
            <label className="flex min-h-11 items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/40 px-3 text-xs text-slate-400">
              <input
                type="checkbox"
                checked={mirrored}
                onChange={(e) => {
                  setMirrored(e.target.checked);
                  reset();
                }}
                disabled={running}
                className="h-4 w-4 accent-cyan-400"
              />
              <span>
                Mirrored sampling{" "}
                <span className="text-slate-500">
                  (antithetic pairs, separate scores, 2× rollouts)
                </span>
              </span>
            </label>
            <span className="ml-auto text-xs text-slate-500">
              {warmStart
                ? "Warm start: ON (defaults prior)."
                : "Warm start: off (cold origin)."}{" "}
              Seed: 0x47315040.
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="text-xs uppercase tracking-wider text-slate-500">
              Best hyperparameters so far
            </div>
            <HpoBestParameters best={result?.bestHyperparameters} />
            <p className="mt-3 text-xs text-slate-500">
              These are the best evaluated candidate&apos;s parameters, not the
              current search mean. The cold start uses the centre of each range
              (in log space where specified); warm start uses the defaults.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs uppercase tracking-wider text-slate-500">
                Fitness history (lower is better)
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-slate-500">
                  {history.length} point{history.length === 1 ? "" : "s"}
                </div>
                <button
                  type="button"
                  disabled={history.length === 0 || running}
                  onClick={() => void copyHistory()}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Copy history
                </button>
              </div>
            </div>
            <p role="status" className="mt-2 text-xs text-slate-400">
              {copyStatus}
            </p>
            <FitnessSparkline values={history} />
            <p className="mt-3 text-xs text-slate-500">
              The outer loop adapts the full CMA-ES covariance, with antithetic
              sampling available. The fitness is the negation of mean
              inner-rollout reward, so a lower number means the policy under
              those hyperparameters gathered more total reward.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

function FitnessSparkline({ values }: { values: number[] }) {
  if (values.length === 0) {
    return (
      <div className="mt-3 flex h-24 items-center justify-center rounded border border-dashed border-slate-800 text-xs text-slate-500">
        Run a generation to see the trajectory.
      </div>
    );
  }
  const width = 480;
  const height = 96;
  const padX = 6;
  const padY = 8;
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = Math.max(maxVal - minVal, 1e-6);
  const xStep =
    values.length === 1 ? 0 : (width - 2 * padX) / (values.length - 1);
  const points = values
    .map((v, i) => {
      const x = padX + i * xStep;
      const y = padY + (1 - (v - minVal) / range) * (height - 2 * padY);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="mt-3 h-24 w-full"
      role="img"
      aria-label="fitness history sparkline"
    >
      <line
        x1={padX}
        y1={height - padY}
        x2={width - padX}
        y2={height - padY}
        stroke="currentColor"
        strokeOpacity="0.18"
      />
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        points={points}
        className="text-emerald-300"
      />
    </svg>
  );
}
