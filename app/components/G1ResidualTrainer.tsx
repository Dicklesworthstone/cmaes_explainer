"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import type {
  G1TransformerChallenge,
  G1TransformerProgress,
} from "../lib/frankensimCmaes";
import type {
  TrainingWorkerRequest,
  TrainingWorkerResponse,
} from "../workers/g1TransformerTrainingWorker";

/**
 * Train the transformer's residual head in this browser, against the real
 * walking owner.
 *
 * Everything else on this page reports a search that already happened. This
 * one runs it: the same LM-CMA over the same 960-parameter output layer, on
 * the same articulated-body physics and the same objective the flagship
 * minimises, in a worker on this machine. The model is 64-wide and two layers
 * deep, which is why a laptop is enough and why the answer to "don't you need
 * a GPU" is no. There is also nothing to backpropagate through a contact
 * solver, so gradients were never the missing piece.
 *
 * The head starts at zero. On a residual policy that IS the tuned controller,
 * so the baseline shown is this policy before the search moved it, and the gap
 * between the two rows is a real improvement over what the site already ships
 * rather than a comparison between two differently-tuned things.
 */

/** Points kept for the curve; a long run would otherwise grow without bound. */
const MAX_CURVE_POINTS = 240;

interface CurvePoint {
  evaluations: number;
  objective: number;
}

function spawnTrainingWorker(
  onMessage: (msg: TrainingWorkerResponse) => void,
): Worker {
  const worker = new Worker(
    new URL("../workers/g1TransformerTrainingWorker.ts", import.meta.url),
  );
  worker.onmessage = (e: MessageEvent<TrainingWorkerResponse>) =>
    onMessage(e.data);
  worker.onerror = (e) =>
    onMessage({ type: "error", error: e.message || "worker error" });
  return worker;
}

/** Improvement on an objective where lower is better. */
function gainPercent(baseline: number, best: number): number {
  if (!Number.isFinite(baseline) || baseline === 0) return 0;
  return (100 * (baseline - best)) / Math.abs(baseline);
}

function LearningCurve({ points }: { points: CurvePoint[] }) {
  if (points.length < 2) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-500">
        The curve appears once the search has closed a generation.
      </div>
    );
  }
  const width = 640;
  const height = 128;
  const objectives = points.map((p) => p.objective);
  const min = Math.min(...objectives);
  const max = Math.max(...objectives);
  const span = max - min || 1;
  const firstEval = points[0].evaluations;
  const lastEval = points[points.length - 1].evaluations;
  const evalSpan = lastEval - firstEval || 1;
  // Inset vertically: at full height a run that sits at its best or worst
  // value draws its stroke half outside the viewBox and reads as a clipped
  // edge rather than a plateau.
  const pad = 6;
  const plot = height - pad * 2;
  const path = points
    .map((point, index) => {
      const x = ((point.evaluations - firstEval) / evalSpan) * width;
      // Lower objective is better, so a falling value must rise on screen.
      const y = pad + plot - ((point.objective - min) / span) * plot;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-32 w-full rounded-lg border border-slate-800 bg-slate-950/60"
      role="img"
      aria-label={`Best objective improving from ${max.toFixed(1)} to ${min.toFixed(1)} over ${lastEval} rollouts`}
      preserveAspectRatio="none"
    >
      <path d={path} fill="none" stroke="#34d399" strokeWidth="2" />
    </svg>
  );
}

export function G1ResidualTrainer() {
  const workerRef = useRef<Worker | null>(null);
  // Flat by default. It is one rollout per candidate instead of two and it is
  // the easier condition, so the curve starts falling in well under a minute
  // rather than after several — and a search that visibly works is the whole
  // point of putting it on the page. The harder cross-challenge run, which is
  // what the shipped figures above are measured on, is one dropdown away and
  // the copy says which is which.
  const [challenge, setChallenge] = useState<G1TransformerChallenge>("flat");
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<G1TransformerProgress | null>(null);
  const [curve, setCurve] = useState<CurvePoint[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleMessage = useCallback((message: TrainingWorkerResponse) => {
    if (message.type === "error") {
      setError(message.error);
      setRunning(false);
      return;
    }
    if (message.type === "stopped") {
      setRunning(false);
      if (message.progress) setProgress(message.progress);
      return;
    }
    if (message.type === "weights") {
      const blob = new Blob([message.bytes as BlobPart], {
        type: "application/octet-stream",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `g1-residual-${Math.round(message.progress.evaluations)}-evals.bin`;
      anchor.click();
      URL.revokeObjectURL(url);
      return;
    }
    setProgress(message.progress);
    if (message.progress.status === "generation") {
      setCurve((previous) => {
        const next = [
          ...previous,
          {
            evaluations: message.progress.evaluations,
            objective: message.progress.bestObjective,
          },
        ];
        return next.length > MAX_CURVE_POINTS
          ? next.slice(next.length - MAX_CURVE_POINTS)
          : next;
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  const post = (request: TrainingWorkerRequest) => {
    if (!workerRef.current) {
      workerRef.current = spawnTrainingWorker(handleMessage);
    }
    workerRef.current.postMessage(request);
  };

  const start = () => {
    setError(null);
    setCurve([]);
    setProgress(null);
    setRunning(true);
    post({
      type: "start",
      challenge,
      durationSeconds: 1.5,
      sigma: 0.002,
      seed: 20260906,
    });
  };

  const stop = () => post({ type: "stop" });
  const download = () => post({ type: "export" });

  const gain = progress
    ? gainPercent(progress.baselineObjective, progress.bestObjective)
    : 0;
  const improved = progress ? progress.bestObjective < progress.baselineObjective : false;

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={running ? stop : start}
          className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
        >
          {running ? "Stop training" : "Train in this browser"}
        </button>
        <label className="text-xs text-slate-400">
          <span className="mr-2 uppercase tracking-wide">Conditions</span>
          <select
            value={challenge}
            disabled={running}
            onChange={(event) =>
              setChallenge(event.target.value as G1TransformerChallenge)
            }
            className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-slate-200 disabled:opacity-50"
          >
            <option value="flat">Flat only (fastest)</option>
            <option value="both">Flat and terrain-with-push (harder)</option>
            <option value="terrain">Terrain-with-push only</option>
          </select>
        </label>
        <button
          type="button"
          onClick={download}
          disabled={!improved}
          className="rounded-md border border-slate-600 px-3 py-2 text-sm text-slate-200 hover:border-slate-400 disabled:opacity-40"
        >
          Download policy
        </button>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-rose-300">{error}</p>
      ) : null}

      <div className="mt-5">
        <LearningCurve points={curve} />
      </div>

      <table className="mt-5 w-full text-left text-sm text-slate-300">
        <caption className="sr-only">
          Live training progress against the tuned controller
        </caption>
        <thead>
          <tr className="text-xs uppercase tracking-wide text-slate-500">
            <th scope="col" className="pb-2 font-medium">
              Policy
            </th>
            <th scope="col" className="pb-2 text-right font-medium">
              Objective
            </th>
            <th scope="col" className="pb-2 text-right font-medium">
              Distance
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row" className="py-2 pr-4 font-normal">
              Tuned controller (this policy before the search)
            </th>
            <td className="py-2 text-right tabular-nums">
              {progress ? progress.baselineObjective.toFixed(2) : "—"}
            </td>
            <td className="py-2 text-right tabular-nums">
              {progress
                ? `${progress.baselineDistanceMeters.toFixed(4)} m`
                : "—"}
            </td>
          </tr>
          <tr className={improved ? "font-semibold text-emerald-300" : ""}>
            <th scope="row" className="py-2 pr-4 font-normal">
              Best transformer residual so far
            </th>
            <td className="py-2 text-right tabular-nums">
              {progress ? progress.bestObjective.toFixed(2) : "—"}
            </td>
            <td className="py-2 text-right tabular-nums">
              {progress ? `${progress.bestDistanceMeters.toFixed(4)} m` : "—"}
            </td>
          </tr>
        </tbody>
      </table>

      <p className="mt-4 text-sm leading-6 text-slate-400">
        {progress ? (
          <>
            {progress.evaluations.toLocaleString()} rollouts,{" "}
            {progress.generation.toLocaleString()} generations,{" "}
            {progress.restarts} restarts, population {progress.population}.{" "}
            {improved ? (
              <>
                The residual is{" "}
                <strong className="text-emerald-300">
                  {gain.toFixed(1)}% better
                </strong>{" "}
                than the controller it started from
                {challenge === "flat" ? (
                  <> on flat ground, the easiest of the three conditions</>
                ) : challenge === "terrain" ? (
                  <> on terrain with pushes</>
                ) : (
                  <> across both conditions</>
                )}
                .
              </>
            ) : (
              "No improvement yet — the head is still at the tuned controller."
            )}
          </>
        ) : (
          <>
            Nothing is running. Training searches the 960-parameter output layer
            with LM-CMA against the owner&apos;s own objective; each rollout is
            1.5 s of simulated walking. Leave it running and the curve keeps
            falling — the run has no fixed budget and stops when you stop it.
          </>
        )}
      </p>
    </div>
  );
}
