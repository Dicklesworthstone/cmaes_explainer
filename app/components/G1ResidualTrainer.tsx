"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type {
  G1TraceReceipt,
  G1TransformerChallenge,
  G1TransformerProgress,
} from "../lib/frankensimCmaes";
import {
  decodeResidualFragment,
  encodeResidualFragment,
  residualFragmentFromHash,
  residualShareUrl,
  type SharedResidual,
} from "../lib/g1PolicyShare";
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

/**
 * Where a run in progress is kept between visits.
 *
 * Only the 960-parameter head is stored: the trunk is deterministic in the
 * kernel's fixed seed, so the head is the entire learned part. At four bytes a
 * parameter that is under 4 KB, well inside any storage quota, and it means an
 * accidental refresh costs nothing.
 */
const SAVED_RUN_KEY = "cmaes.g1-residual-run.v1";

interface SavedRun {
  challenge: G1TransformerChallenge;
  head: number[];
  objective: number;
  baselineObjective: number;
  evaluations: number;
  savedAt: number;
}

/** One checkpoint per condition: trying terrain must not destroy a flat run. */
type SavedRuns = Partial<Record<G1TransformerChallenge, SavedRun>>;

const EMPTY_SAVED_RUNS: SavedRuns = {};

function isSavedRun(value: unknown): value is SavedRun {
  if (!value || typeof value !== "object") return false;
  const run = value as Partial<SavedRun>;
  return (
    Array.isArray(run.head) &&
    run.head.length > 0 &&
    run.head.every((entry) => Number.isFinite(entry)) &&
    typeof run.objective === "number" &&
    typeof run.baselineObjective === "number" &&
    typeof run.evaluations === "number" &&
    typeof run.savedAt === "number"
  );
}

function parseSavedRuns(raw: string | null): SavedRuns {
  if (!raw) return EMPTY_SAVED_RUNS;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return EMPTY_SAVED_RUNS;
    const runs: SavedRuns = {};
    for (const condition of ["flat", "terrain", "both"] as const) {
      const candidate = (parsed as Record<string, unknown>)[condition];
      if (isSavedRun(candidate)) runs[condition] = candidate;
    }
    return runs;
  } catch {
    // A save written by an older build, or hand-edited. Ignoring it loses a
    // checkpoint; trusting it would seed the search with nonsense.
    return EMPTY_SAVED_RUNS;
  }
}

/** Fired after a checkpoint so a subscriber in this tab re-reads it. */
const SAVED_RUN_EVENT = "cmaes:g1-residual-run";

function writeSavedRun(run: SavedRun): void {
  try {
    const existing = parseSavedRuns(
      window.localStorage.getItem(SAVED_RUN_KEY),
    );
    window.localStorage.setItem(
      SAVED_RUN_KEY,
      JSON.stringify({ ...existing, [run.challenge]: run }),
    );
    window.dispatchEvent(new Event(SAVED_RUN_EVENT));
  } catch {
    // Quota or a private window. Losing the save is survivable; breaking the
    // training loop over it is not.
  }
}

// The snapshot must be referentially stable or React re-renders forever, so
// the parsed value is cached against the raw string it came from.
let cachedRaw: string | null = null;
let cachedRuns: SavedRuns = EMPTY_SAVED_RUNS;

function savedRunsSnapshot(): SavedRuns {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(SAVED_RUN_KEY);
  } catch {
    raw = null;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedRuns = parseSavedRuns(raw);
  }
  return cachedRuns;
}

function subscribeSavedRun(onChange: () => void): () => void {
  window.addEventListener(SAVED_RUN_EVENT, onChange);
  // Another tab training the same policy also updates the save.
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(SAVED_RUN_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

interface CurvePoint {
  evaluations: number;
  objective: number;
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
      // Plot objective on a conventional vertical axis: improvement falls.
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
      {/* The viewBox is stretched to the container width, so without this the
          stroke is scaled unevenly and reads thinner on the horizontal runs. */}
      <path
        d={path}
        fill="none"
        stroke="#34d399"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/**
 * Side view of the pelvis through one rollout: forward travel against height.
 *
 * A falling objective is an abstraction. This is the thing the number was
 * standing in for — the same rollout the receipt was computed from, with the
 * tuned controller drawn underneath so the difference is visible rather than
 * asserted. Both paths come from the owner's own trace, not from a
 * reconstruction.
 *
 * The owner frame is x-forward, z-up, so the plot reads x against z.
 */
function GaitPaths({
  trained,
  baseline,
  condition,
  stale,
}: {
  trained: G1TraceReceipt;
  baseline: G1TraceReceipt;
  condition: G1TransformerChallenge;
  stale: boolean;
}) {
  const width = 640;
  const height = 150;
  const pad = 12;

  const pelvis = (trace: G1TraceReceipt) =>
    trace.samples
      .map((sample) => sample.linkPoses[0]?.position)
      .filter((position): position is [number, number, number] =>
        Boolean(position),
      )
      .map((position) => ({ forward: position[0], up: position[2] }));

  const trainedPath = pelvis(trained);
  const basePath = pelvis(baseline);
  if (trainedPath.length < 2 || basePath.length < 2) return null;

  const all = [...trainedPath, ...basePath];
  const minX = Math.min(...all.map((p) => p.forward));
  const maxX = Math.max(...all.map((p) => p.forward));
  const minY = Math.min(...all.map((p) => p.up));
  const maxY = Math.max(...all.map((p) => p.up));
  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  const toPath = (points: { forward: number; up: number }[]) =>
    points
      .map((point, index) => {
        const x = pad + ((point.forward - minX) / spanX) * (width - pad * 2);
        const y =
          height - pad - ((point.up - minY) / spanY) * (height - pad * 2);
        return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");

  return (
    <figure className="mt-5">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-40 w-full rounded-lg border border-slate-800 bg-slate-950/60"
        role="img"
        aria-label={`Pelvis path over one rollout. Trained policy travels ${trained.distanceMeters.toFixed(3)} metres; the tuned controller travels ${baseline.distanceMeters.toFixed(3)} metres.`}
      >
        <path
          d={toPath(basePath)}
          fill="none"
          stroke="#64748b"
          strokeWidth="2"
          strokeDasharray="5 4"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={toPath(trainedPath)}
          fill="none"
          stroke="#34d399"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <figcaption className="mt-2 text-xs leading-5 text-slate-500">
        Pelvis height against forward travel through one 1.5 s rollout{" "}
        {condition === "terrain" ? "on terrain with pushes" : "on flat ground"},
        from the owner&apos;s own trace.{" "}
        <span className="text-emerald-300">Solid green</span> is the policy you
        trained ({trained.distanceMeters.toFixed(3)} m);{" "}
        <span className="text-slate-400">dashed grey</span> is the tuned
        controller it started from ({baseline.distanceMeters.toFixed(3)} m).
        Vertical scale is exaggerated to the range walked.
        {condition === "both" ? (
          <>
            {" "}
            A rollout is one condition, so this is the flat leg of the pair this
            run averages — which is why its distance differs from the averaged
            figure in the table.
          </>
        ) : null}
        {stale ? (
          <>
            {" "}
            <strong className="text-amber-300">
              The search has improved since this was drawn
            </strong>{" "}
            — show the gait again to see the current best.
          </>
        ) : null}
      </figcaption>
    </figure>
  );
}

export function G1ResidualTrainer() {
  const workerRef = useRef<Worker | null>(null);
  /** Condition the live worker was started for; see `start`. */
  const startedChallengeRef = useRef<G1TransformerChallenge | null>(null);
  // Flat by default. It is one rollout per candidate instead of two and it is
  // the easier condition, so the curve starts falling in well under a minute
  // rather than after several — and a search that visibly works is the whole
  // point of putting it on the page. The harder cross-challenge run, which is
  // what the shipped figures above are measured on, is one dropdown away and
  // the copy says which is which.
  const [challenge, setChallenge] = useState<G1TransformerChallenge>("flat");
  const [runChallenge, setRunChallenge] =
    useState<G1TransformerChallenge>("flat");
  /**
   * The condition the live run was started for, readable from the worker's
   * message handler. That handler is captured once when the worker is spawned,
   * so reading `runChallenge` inside it would pin the value at mount however
   * the dependency array is written.
   */
  const runChallengeRef = useRef<G1TransformerChallenge>("flat");
  /** Whether the live run was seeded from a link rather than a local save. */
  const seededFromLinkRef = useRef(false);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<G1TransformerProgress | null>(null);
  const [curve, setCurve] = useState<CurvePoint[]>([]);
  const [error, setError] = useState<{
    message: string;
    fatal: boolean;
  } | null>(null);
  /** The rollout the receipt was computed from, once the reader asks to see it. */
  const [gait, setGait] = useState<{
    trained: G1TraceReceipt;
    baseline: G1TraceReceipt;
    /** The condition this rollout was taken under, not the current dropdown. */
    condition: G1TransformerChallenge;
    /** The incumbent objective when it was drawn, to detect a stale plot. */
    capturedObjective: number;
  } | null>(null);
  const [gaitPending, setGaitPending] = useState(false);
  const [resumeNotice, setResumeNotice] = useState<string | null>(null);
  const [shareState, setShareState] = useState<{
    url: string;
    copied: boolean;
  } | null>(null);
  /** A policy someone sent by link, offered exactly like a local checkpoint. */
  const [sharedRun, setSharedRun] = useState<SharedResidual | null>(null);
  /**
   * A head recovered from a previous visit, offered as a resume. Read through
   * an external store rather than an effect: localStorage does not exist while
   * server-rendering, and it keeps updating as checkpoints are written.
   */
  const savedRuns = useSyncExternalStore(
    subscribeSavedRun,
    savedRunsSnapshot,
    () => EMPTY_SAVED_RUNS,
  );
  const localSave = savedRuns[challenge] ?? null;
  const sharedForCondition =
    sharedRun && sharedRun.condition === challenge ? sharedRun : null;
  const sharedAsSave: SavedRun | null = sharedForCondition
    ? {
        challenge: sharedForCondition.condition,
        head: Array.from(sharedForCondition.head),
        objective: sharedForCondition.objective,
        baselineObjective: sharedForCondition.baselineObjective,
        evaluations: sharedForCondition.evaluations,
        savedAt: 0,
      }
    : null;
  // Offer whichever policy is actually better, not whichever arrived last.
  // A visitor who followed a link came for that policy, but once they have
  // trained past it their own run must not be shouted down by the link every
  // time the page reloads — and the link stays in the address bar.
  const preferShared =
    sharedAsSave !== null &&
    (localSave === null || sharedAsSave.objective < localSave.objective);
  const savedHead: SavedRun | null = preferShared ? sharedAsSave : localSave;
  const shared = preferShared;

  const handleMessage = useCallback((message: TrainingWorkerResponse) => {
    if (message.type === "error") {
      setError({ message: message.error, fatal: message.fatal });
      setGaitPending(false);
      if (message.fatal) {
        // The owner caches initialization failures inside its worker realm.
        // A failed export keeps its live trainer; a fatal failure needs a new realm.
        workerRef.current?.terminate();
        workerRef.current = null;
        startedChallengeRef.current = null;
        setRunning(false);
      }
      return;
    }
    if (message.type === "stopped") {
      setRunning(false);
      if (message.progress) setProgress(message.progress);
      return;
    }
    if (message.type === "resumed") {
      const source = seededFromLinkRef.current
        ? "the shared policy"
        : "your saved policy";
      setResumeNotice(
        message.adopted
          ? `Loaded ${source} and continuing from it.`
          : `${seededFromLinkRef.current ? "The shared" : "The saved"} policy did not beat the tuned controller here, so this run starts fresh.`,
      );
      return;
    }
    if (message.type === "head") {
      setError(null);
      void encodeResidualFragment({
        head: message.head,
        condition: runChallengeRef.current,
        evaluations: message.progress.evaluations,
        objective: message.progress.bestObjective,
        baselineObjective: message.progress.baselineObjective,
      })
        .then(async (fragment) => {
          const url = residualShareUrl(
            window.location.origin,
            window.location.pathname,
            fragment,
          );
          try {
            await navigator.clipboard.writeText(url);
            setShareState({ url, copied: true });
          } catch {
            // Clipboard access is denied in plenty of ordinary situations;
            // showing the link is a working fallback, not a failure.
            setShareState({ url, copied: false });
          }
        })
        .catch((cause: unknown) => {
          setError({
            message:
              cause instanceof Error ? cause.message : "Could not build a link.",
            fatal: false,
          });
        });
      return;
    }
    if (message.type === "trace") {
      setError(null);
      setGait({
        trained: message.trained,
        baseline: message.baseline,
        condition: runChallengeRef.current,
        capturedObjective: message.progress.bestObjective,
      });
      setGaitPending(false);
      return;
    }
    if (message.type === "weights") {
      setError(null);
      const blob = new Blob([message.bytes as BlobPart], {
        type: "application/octet-stream",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `g1-residual-${Math.round(message.progress.evaluations)}-evals.bin`;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      // Revoking in the same tick cancels the download in some browsers: the
      // fetch of the blob URL has not started when the object is released.
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      return;
    }
    setProgress(message.progress);
    if (message.bestHead && message.bestHead.length > 0) {
      writeSavedRun({
        challenge: runChallengeRef.current,
        head: Array.from(message.bestHead),
        objective: message.progress.bestObjective,
        baselineObjective: message.progress.baselineObjective,
        evaluations: message.progress.evaluations,
        savedAt: Date.now(),
      });
    }
    if (message.progress.status === "generation") {
      setCurve((previous) => {
        const next = [
          ...previous,
          {
            evaluations: message.progress.evaluations,
            objective: message.progress.bestObjective,
          },
        ];
        // Thin uniformly instead of dropping the oldest points. A run left
        // going for hours has its entire story in the early plunge; slicing
        // the tail would eventually show nothing but a flat line.
        return next.length > MAX_CURVE_POINTS
          ? next.filter((_point, index) => index % 2 === 0)
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

  // A shared policy arrives in the hash, so it never reaches a server. Decoding
  // is async, and the result lands from the promise rather than the effect body.
  useEffect(() => {
    const fragment = residualFragmentFromHash(window.location.hash);
    if (!fragment) return;
    let live = true;
    void decodeResidualFragment(fragment)
      .then((shared) => {
        if (!live) return;
        setSharedRun(shared);
        // Select the condition it was trained for, or the offer would sit
        // behind a dropdown the visitor has no reason to touch.
        setChallenge(shared.condition);
      })
      .catch((cause: unknown) => {
        if (!live) return;
        setError({
          message:
            cause instanceof Error
              ? cause.message
              : "This shared policy link could not be read.",
          fatal: false,
        });
      });
    return () => {
      live = false;
    };
  }, []);



  const post = (request: TrainingWorkerRequest) => {
    const failWorker = (error: unknown) => {
      handleMessage({
        type: "error",
        error: error instanceof Error ? error.message : String(error),
        fatal: true,
      });
    };
    try {
      if (!workerRef.current) {
        if (request.type !== "start") return;
        const worker = new Worker(
          new URL("../workers/g1TransformerTrainingWorker.ts", import.meta.url),
        );
        workerRef.current = worker;
        worker.onmessage = (event: MessageEvent<TrainingWorkerResponse>) => {
          if (workerRef.current === worker) handleMessage(event.data);
        };
        worker.onerror = (event) => {
          event.preventDefault();
          if (workerRef.current === worker) {
            failWorker(new Error(event.message || "Training worker failed."));
          }
        };
        worker.onmessageerror = () => {
          if (workerRef.current === worker) {
            failWorker(
              new Error("The training worker response could not be read."),
            );
          }
        };
      }
      workerRef.current.postMessage(request);
    } catch (error) {
      failWorker(error);
    }
  };

  const start = () => {
    setError(null);
    setRunChallenge(challenge);
    runChallengeRef.current = challenge;
    // The worker resumes an unchanged configuration rather than rebuilding,
    // so the curve must survive a stop/start too. Only a different condition
    // starts a genuinely new search, and only then is the old curve stale.
    if (startedChallengeRef.current !== challenge) {
      setCurve([]);
      setProgress(null);
      // A gait drawn from the previous condition describes a different
      // experiment; keeping it on screen beside new numbers would be a lie.
      setGait(null);
      startedChallengeRef.current = challenge;
    }
    setRunning(true);
    // savedHead is already the checkpoint for the selected condition; a head
    // trained on flat ground is not a head for terrain, and the owner would
    // refuse it anyway.
    const resumable = savedHead;
    seededFromLinkRef.current = shared;
    setResumeNotice(null);
    setShareState(null);
    post({
      type: "start",
      challenge,
      durationSeconds: 1.5,
      sigma: 0.002,
      seed: 20260906,
      ...(resumable
        ? { initialHead: Float64Array.from(resumable.head) }
        : {}),
    });
  };

  const stop = () => post({ type: "stop" });
  const download = () => post({ type: "export" });
  const share = () => {
    setShareState(null);
    post({ type: "head" });
  };
  const showGait = () => {
    setGaitPending(true);
    post({ type: "trace" });
  };

  const gain = progress
    ? gainPercent(progress.baselineObjective, progress.bestObjective)
    : 0;
  const improved = progress
    ? progress.bestObjective < progress.baselineObjective
    : false;

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
          onClick={showGait}
          disabled={!improved || gaitPending || Boolean(error?.fatal)}
          className="rounded-md border border-emerald-500/50 px-3 py-2 text-sm text-emerald-200 hover:border-emerald-400 disabled:opacity-40"
        >
          {gaitPending ? "Rolling out…" : "Show the gait"}
        </button>
        <button
          type="button"
          onClick={share}
          disabled={!improved || Boolean(error?.fatal)}
          className="rounded-md border border-slate-600 px-3 py-2 text-sm text-slate-200 hover:border-slate-400 disabled:opacity-40"
        >
          Copy share link
        </button>
        <button
          type="button"
          onClick={download}
          disabled={!improved || Boolean(error?.fatal)}
          className="rounded-md border border-slate-600 px-3 py-2 text-sm text-slate-200 hover:border-slate-400 disabled:opacity-40"
        >
          Download policy
        </button>
      </div>

      {error ? (
        <p role="alert" className="mt-4 text-sm text-rose-300">
          {error.message}
        </p>
      ) : null}

      {resumeNotice ? (
        <p className="mt-4 text-sm text-slate-400">{resumeNotice}</p>
      ) : savedHead && !running ? (
        <p className="mt-4 text-sm text-slate-400">
          {shared ? (
            <>Someone shared a policy with you in this link</>
          ) : (
            <>
              A run from{" "}
              {new Date(savedHead.savedAt).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}{" "}
              is saved in this browser
            </>
          )}{" "}
          — {savedHead.evaluations.toLocaleString()} rollouts, reaching{" "}
          <strong className="text-emerald-300">
            {gainPercent(
              savedHead.baselineObjective,
              savedHead.objective,
            ).toFixed(1)}
            %
          </strong>{" "}
          better than the tuned controller. Starting will{" "}
          {shared ? "load and continue it" : "continue from it"}; the owner
          re-runs it here and will say so if it does not hold up.
        </p>
      ) : null}

      {shareState ? (
        <p className="mt-3 break-all text-xs text-slate-400">
          {shareState.copied
            ? "Share link copied to your clipboard: "
            : "Share link (copy it manually — the clipboard was not available): "}
          <span className="text-slate-300">{shareState.url}</span>
        </p>
      ) : null}

      <div className="mt-5">
        <LearningCurve points={curve} />
      </div>

      {gait ? (
        <GaitPaths
          trained={gait.trained}
          baseline={gait.baseline}
          condition={gait.condition}
          // Lower is better, so any drop means the plot is of an older policy.
          stale={Boolean(progress && progress.bestObjective < gait.capturedObjective)}
        />
      ) : null}

      <table className="mt-5 w-full text-left text-sm text-slate-300">
        <caption className="pb-2 text-left text-xs text-slate-400">
          Training results:{" "}
          {runChallenge === "flat"
            ? "flat ground"
            : runChallenge === "terrain"
              ? "terrain with pushes"
              : "flat ground and terrain with pushes"}
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
                {runChallenge === "flat" ? (
                  <> on flat ground, the easiest of the three conditions</>
                ) : runChallenge === "terrain" ? (
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
