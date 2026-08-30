"use client";

import { useCallback, useRef, useState } from "react";
import {
  CmaesHyperparameterOptimizer,
  G1_TRAINING_HYPERPARAMETERS,
  type HpoParameterSpec,
  type HpoSweepResult,
} from "../lib/cmaesHyperparameterLoop";
import { Section } from "./Section";

const RUN_BATCH_SIZES = [1, 5, 20] as const;

function formatParam(
  name: string,
  value: number,
  spec: HpoParameterSpec,
): string {
  if (spec.isLogScale) {
    return `${name} = ${value.toExponential(2)}`;
  }
  return `${name} = ${value.toFixed(3)}`;
}

export function HpoTrainer() {
  const [result, setResult] = useState<HpoSweepResult | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [running, setRunning] = useState(false);
  const [lastDelta, setLastDelta] = useState<number | null>(null);
  const [batch, setBatch] = useState<(typeof RUN_BATCH_SIZES)[number]>(1);
  const optimizerRef = useRef<CmaesHyperparameterOptimizer | null>(null);

  const ensureOptimizer = useCallback((): CmaesHyperparameterOptimizer => {
    if (optimizerRef.current === null) {
      optimizerRef.current = new CmaesHyperparameterOptimizer(
        G1_TRAINING_HYPERPARAMETERS,
        0x47315040,
      );
    }
    return optimizerRef.current;
  }, []);

  const runBatch = useCallback(async (gens: number) => {
    if (running) return;
    setRunning(true);
    try {
      const optimizer = ensureOptimizer();
      for (let g = 0; g < gens; g += 1) {
        await new Promise<void>((resolve) => setTimeout(resolve, 0));
        const r = optimizer.stepGeneration();
        setResult((prev) => {
          if (prev === null) {
            setLastDelta(null);
            return r;
          }
          const delta = r.bestFitness - prev.bestFitness;
          setLastDelta(delta);
          return r;
        });
        setHistory((prev) => [...prev, r.bestFitness]);
      }
    } finally {
      setRunning(false);
    }
  }, [running, ensureOptimizer]);

  const reset = useCallback(() => {
    optimizerRef.current = null;
    setResult(null);
    setHistory([]);
    setLastDelta(null);
  }, []);

  const best = result?.bestHyperparameters;
  const bestByName: Record<string, number> = best
    ? {
        muonLearningRate: best.muonLearningRate,
        muonMomentum: best.muonMomentum,
        ppoEntropyCoef: best.ppoEntropyCoef,
        weightProgress: best.weightProgress,
        weightUpright: best.weightUpright,
        weightEnergy: best.weightEnergy,
        gaeLambda: best.gaeLambda,
        valueLossCoef: best.valueLossCoef,
      }
    : {};

  return (
    <Section
      id="hpo-trainer"
      title="Training the trainer: outer CMA-ES over 8 training hyperparameters"
    >
      <div className="space-y-4">
        <p className="max-w-3xl text-sm leading-7 text-slate-400">
          The disclosed training stack has 8 hyperparameters (inner LR, Muon
          momentum, PPO entropy coefficient, four reward weights, GAE
          lambda, value loss coefficient). CMA-ES is genuinely strongest for
          small-D expensive black-box problems like outer-loop hyperparameter
          search, so the outer loop is itself a CMA-ES over this 8-D space.
          The inner rollout is the disclosed G1StepwiseEnv kinematic stub
          (a real env, not a fabricated table). Each generation is 8
          candidates times 120-step rollouts, mirrored if you ask for it.
          This is the same loop the bead cmaes-89eg ships.
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
              className="rounded-lg border border-emerald-500/60 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {running
                ? "Running..."
                : `Run ${batch} generation${batch === 1 ? "" : "s"}`}
            </button>
            <label className="flex items-center gap-2 text-xs text-slate-400">
              <span>Batch</span>
              <select
                value={batch}
                onChange={(e) => {
                  const next = Number(e.target.value) as
                    | (typeof RUN_BATCH_SIZES)[number];
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
              className="rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reset
            </button>
            <span className="ml-auto text-xs text-slate-500">
              Warm start: default prior (centered). Seed: 0x47315040.
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="text-xs uppercase tracking-wider text-slate-500">
              Best hyperparameters so far
            </div>
            <ul className="mt-3 grid grid-cols-[1fr_auto] gap-x-3 gap-y-1.5 font-mono text-sm text-slate-200">
              {G1_TRAINING_HYPERPARAMETERS.map((spec) => {
                const value = bestByName[spec.name];
                const formatted =
                  value === undefined ? "-" : formatParam(spec.name, value, spec);
                return (
                  <li
                    key={spec.name}
                    className="contents"
                    data-testid="hpo-best-param"
                  >
                    <span className="text-slate-400">{spec.name}</span>
                    <span className="text-right text-slate-100">
                      {formatted}
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-xs text-slate-500">
              Each value is decoded from the CMA-ES mean under the same
              log-scale convention the kernel uses for inner LR. The
              starting prior is the centre of each spec range.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-wider text-slate-500">
                Fitness history (lower is better)
              </div>
              <div className="text-xs text-slate-500">
                {history.length} point{history.length === 1 ? "" : "s"}
              </div>
            </div>
            <FitnessSparkline values={history} />
            <p className="mt-3 text-xs text-slate-500">
              The CMA-ES outer loop is a (1+lambda)-ES with antithetic
              mirroring available. The fitness is the negation of mean
              inner-rollout reward, so a lower number means the policy
              under those hyperparameters gathered more total reward.
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
      const y =
        padY + (1 - (v - minVal) / range) * (height - 2 * padY);
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
