/**
 * FrankenSim CMA-ES kernel (fs-cmaes-viz-wasm) — WASM loader + adapter.
 *
 * Loads the committed, versioned wasm-pack bundle under /wasm/fs-cmaes/v041/
 * via the Blob-URL
 * trick (dodging Turbopack's mangling of wasm-bindgen `--target web` glue —
 * the same sanctioned pattern as frankensimPhysics.ts), capability-probes the
 * exports, and degrades honestly: `source: "wasm" | "ts-fallback" | "unloaded"`.
 *
 * The adapter maps the kernel's per-generation snapshot stream onto the
 * CMAESGenerationStateND shape consumed by CMAESPhaseSpaceViewer, so the
 * viewer renders identically whether the kernel was WASM or the TS fallback.
 */

export type CmaesKernelSource = "wasm" | "ts-fallback" | "unloaded";

export interface CmaesKernelStatus {
  source: CmaesKernelSource;
  kernelVersion: string | null;
  error: string | null;
}

export interface CmaesVizParams {
  dim: number;
  x0: number[];
  sigma0: number;
  lambda: number;
  active: boolean;
  seed: number;
  generations: number;
  /** 0 sphere · 1 rosenbrock · 2 discus (kernel id "cigar") · 3 rastrigin · 4 elli */
  landscape: number;
  noise: number;
  boundsEnabled: boolean;
  boundMin: number;
  boundMax: number;
  /** NaN disables the early-stop target. */
  fTarget: number;
}

/**
 * The complete-trajectory compatibility audit compares both engines through
 * this useful optimization horizon. Continuing far below it makes eigensolver
 * roundoff choose different but numerically equivalent sample directions.
 */
export const CMAES_VISUALIZATION_F_TARGET = 1e-8;

/** Exact TypeScript mirror of the visualization kernel's landscape registry. */
export function evaluateCmaesVisualizationLandscape(landscape: number, x: number[]): number {
  switch (landscape) {
    case 0:
      return x.reduce((sum, value) => sum + value * value, 0);
    case 1: {
      let sum = 0;
      for (let index = 0; index < x.length - 1; index++) {
        sum += 100 * (x[index + 1] - x[index] * x[index]) ** 2 + (1 - x[index]) ** 2;
      }
      return sum;
    }
    case 2: {
      let sum = 1e6 * x[0] * x[0];
      for (let index = 1; index < x.length; index++) sum += x[index] * x[index];
      return sum;
    }
    case 3:
      return 10 * x.length + x.reduce(
        (sum, value) => sum + value * value - 10 * Math.cos(2 * Math.PI * value),
        0
      );
    case 4:
      return x.reduce(
        (sum, value, index) => sum + 10 ** ((6 * index) / Math.max(1, x.length - 1)) * value * value,
        0
      );
    default:
      return NaN;
  }
}

type NumericVector = number[] | Float64Array;
const PACKED_RUN_MARKER: unique symbol = Symbol("packedCmaesRun");

export interface CmaesVizGeneration {
  g: number;
  mean: NumericVector;
  sigma: number;
  eigvals: NumericVector;
  eigvecs: NumericVector;
  cond: number;
  best_f: number;
  evals: number;
  proj_mean: NumericVector;
  proj_eigvals: NumericVector;
  proj_eigvecs: NumericVector;
  sx: NumericVector;
  sz: NumericVector;
  sf: NumericVector;
  se: NumericVector;
  p_sigma: NumericVector;
  p_c: NumericVector;
}

export interface CmaesVizRun {
  kernel: string;
  dim: number;
  landscape: number;
  stop_reason: string;
  best_f: number;
  best_x: NumericVector;
  total_evals: number;
  generations: CmaesVizGeneration[];
  pca_basis: NumericVector;
  pca_center: NumericVector;
  pca_pool_eigvals: NumericVector;
  [PACKED_RUN_MARKER]?: true;
}

// ---------------------------------------------------------------------------
// Loader (Blob-URL + webpackIgnore; single-flight, memoized).
// ---------------------------------------------------------------------------

type WasmModule = {
  cmaes_viz_run?: (...args: unknown[]) => Float64Array;
  cmaes_viz_kernel_version?: () => string;
};

let fsCmaesModule: WasmModule | null = null;
let loadAttempted = false;
let loadPromise: Promise<CmaesKernelStatus> | null = null;

/**
 * Fail closed until a kernel version has passed the same reference audit as
 * the TypeScript engine. Versions 0.2.0 and 0.2.1 remain rejected for their
 * broken h-sigma/damping and mixed pre/post-update snapshot semantics. Version
 * 0.4.0 fixes those update defects and replaces its JSON boundary with a
 * packed numeric ABI, but its symmetric covariance-root sampling diverges
 * from the TypeScript reference after generation one. Version 0.4.1 restores
 * the canonical B·D·z sample transform and consistent eigenpair order. It is
 * admitted only after complete-trajectory parity across the full visualization
 * landscape/option matrix through CMAES_VISUALIZATION_F_TARGET.
 */
const AUDITED_CMAES_KERNEL_VERSION = "fs-cmaes-viz-wasm 0.4.1";
const AUDITED_CMAES_KERNEL_VERSIONS = new Set<string>([AUDITED_CMAES_KERNEL_VERSION]);

export function isCompatibleCmaesKernelVersion(version: string | null): boolean {
  return version !== null && AUDITED_CMAES_KERNEL_VERSIONS.has(version);
}

async function loadWasmModule(jsPath: string, wasmPath: string): Promise<WasmModule> {
  if (
    typeof fetch !== "function" ||
    typeof Blob !== "function" ||
    typeof URL.createObjectURL !== "function" ||
    typeof globalThis.location?.href !== "string"
  ) {
    throw new Error("WASM loader requires a browser or Web Worker context");
  }
  // Window fetch accepts root-relative paths, but WorkerGlobalScope fetch does
  // not consistently resolve them. Resolve both assets against the realm's
  // actual origin before crossing either boundary.
  // Next.js may bootstrap a module worker from a blob: URL. A root-relative
  // URL cannot be resolved against that href, but blob origins retain the
  // page's HTTP(S) origin.
  const runtimeOrigin = new URL(globalThis.location.href).origin;
  if (runtimeOrigin === "null") throw new Error("WASM loader cannot resolve the runtime origin");
  const runtimeBase = `${runtimeOrigin}/`;
  const jsUrl = new URL(jsPath, runtimeBase).href;
  const wasmUrl = new URL(wasmPath, runtimeBase).href;
  const jsText = await fetch(jsUrl, { signal: AbortSignal.timeout(10_000) }).then((r) => {
    if (!r.ok) throw new Error(`fetch ${jsUrl}: ${r.status}`);
    return r.text();
  });
  const blobUrl = URL.createObjectURL(new Blob([jsText], { type: "text/javascript" }));
  try {
    // Dynamic import is REQUIRED here: the specifier is a runtime-created
    // Blob URL wrapping fetched wasm-bindgen glue. A static import cannot
    // express a runtime URL, and webpackIgnore stops Turbopack from mangling
    // the glue (the sanctioned frankensim loader pattern).
    const mod = (await import(/* webpackIgnore: true */ blobUrl)) as {
      default?: (opts: { module_or_path: string }) => Promise<unknown>;
    } & WasmModule;
    if (typeof mod.default === "function") {
      await mod.default({ module_or_path: wasmUrl });
    }
    return mod;
  } finally {
    URL.revokeObjectURL(blobUrl); // no blob leaks
  }
}

/**
 * Instantiate the kernel. Safe to call repeatedly; the load is single-flight
 * and memoized. Any failure resolves with source "ts-fallback" (never throws).
 */
export function initFrankenSimCmaes(): Promise<CmaesKernelStatus> {
  if (loadAttempted && loadPromise) return loadPromise;
  loadAttempted = true;
  loadPromise = (async (): Promise<CmaesKernelStatus> => {
    try {
      const mod = await loadWasmModule(
        "/wasm/fs-cmaes/v041/fs_cmaes_viz_wasm.js",
        "/wasm/fs-cmaes/v041/fs_cmaes_viz_wasm_bg.wasm"
      );
      if (typeof mod.cmaes_viz_run !== "function") {
        return { source: "ts-fallback", kernelVersion: null, error: "missing export cmaes_viz_run" };
      }
      const version = typeof mod.cmaes_viz_kernel_version === "function" ? mod.cmaes_viz_kernel_version() : null;
      if (!isCompatibleCmaesKernelVersion(version)) {
        return {
          source: "ts-fallback",
          kernelVersion: version,
          error: `unsupported CMA-ES kernel ${version ?? "unknown"}; version is not in the audited compatibility set`
        };
      }
      fsCmaesModule = mod;
      return { source: "wasm", kernelVersion: version, error: null };
    } catch (err) {
      return { source: "ts-fallback", kernelVersion: null, error: err instanceof Error ? err.message : String(err) };
    }
  })();
  return loadPromise;
}

export function kernelSourceNow(): CmaesKernelSource {
  return fsCmaesModule ? "wasm" : loadAttempted ? "ts-fallback" : "unloaded";
}

export interface CmaesVizRefusal {
  code: string;
  message: string;
  ranked_repairs: string[];
}

export type DecodedCmaesPacket = { ok: CmaesVizRun } | { refusal: CmaesVizRefusal };

const PACKET_MAGIC = 0x434d4131;
const PACKET_SCHEMA_VERSION = 1;
const PACKET_STATUS_OK = 0;
const PACKET_STATUS_REFUSAL = 1;
const PACKET_HEADER_WORDS = 12;
const REFUSAL_PACKET_WORDS = 5;

const PACKET_REFUSALS = new Map<number, CmaesVizRefusal>([
  [1, { code: "dim-out-of-range", message: "dim is outside the visualization domain 2..=6", ranked_repairs: ["set dim within 2..=6"] }],
  [2, { code: "x0-non-finite", message: "initial mean contains a NaN or infinite coordinate", ranked_repairs: ["replace non-finite x0 coordinates with finite values"] }],
  [3, { code: "sigma0-non-positive", message: "initial sigma must be finite and > 0", ranked_repairs: ["set sigma0 to a positive finite step size"] }],
  [4, { code: "lambda-out-of-range", message: "lambda is outside the visualization domain 4..=48", ranked_repairs: ["set lambda within 4..=48"] }],
  [5, { code: "generations-out-of-range", message: "generations is outside the visualization domain 1..=200", ranked_repairs: ["set generations within 1..=200"] }],
  [6, { code: "landscape-unknown", message: "landscape id has no registered function", ranked_repairs: ["use ids 0..=4 (sphere, rosenbrock, cigar, rastrigin, elli)"] }],
  [7, { code: "noise-invalid", message: "noise must be finite and >= 0", ranked_repairs: ["set noise to 0 for noiseless evaluation"] }],
  [8, { code: "bounds-inverted", message: "bounds require finite bound_min < bound_max", ranked_repairs: ["disable bounds or provide bound_min < bound_max"] }],
  [9, { code: "f-target-invalid", message: "f_target must be finite or NaN (disabled)", ranked_repairs: ["pass NaN to disable the early-stop target"] }],
  [10, { code: "eigen-decomposition-failed", message: "covariance repair produced non-finite eigenvalues", ranked_repairs: ["disable the active update", "reduce sigma0"] }],
  [11, { code: "non-finite-objective", message: "landscape produced a non-finite value", ranked_repairs: ["reduce sigma0", "enable bounds repair"] }],
]);

function packetInteger(packet: Float64Array, index: number, label: string, minimum: number, maximum: number): number {
  const value = packet[index];
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) {
    throw new Error(`malformed CMA-ES packet: ${label}`);
  }
  return value;
}

function generationPacketWords(dim: number, lambda: number): number {
  return 20 + 4 * dim + dim * dim + 2 * lambda * dim + 2 * lambda;
}

/** Decode and structurally validate the schema-1 packed numeric ABI. */
export function decodeCmaesPacket(packet: Float64Array): DecodedCmaesPacket {
  if (!(packet instanceof Float64Array) || packet.length < 4) {
    throw new Error("malformed CMA-ES packet: expected Float64Array header");
  }
  if (packet[0] !== PACKET_MAGIC) throw new Error("malformed CMA-ES packet: magic");
  if (packet[1] !== PACKET_SCHEMA_VERSION) throw new Error("malformed CMA-ES packet: schema");
  const status = packetInteger(packet, 2, "status", PACKET_STATUS_OK, PACKET_STATUS_REFUSAL);
  const declaredWords = packetInteger(packet, 3, "total_words", 4, Number.MAX_SAFE_INTEGER);
  if (declaredWords !== packet.length) throw new Error("malformed CMA-ES packet: total_words");

  if (status === PACKET_STATUS_REFUSAL) {
    if (packet.length !== REFUSAL_PACKET_WORDS) throw new Error("malformed CMA-ES packet: refusal length");
    const refusalId = packetInteger(packet, 4, "refusal code", 1, 11);
    const refusal = PACKET_REFUSALS.get(refusalId);
    if (!refusal) throw new Error("malformed CMA-ES packet: unknown refusal code");
    return { refusal: { ...refusal, ranked_repairs: refusal.ranked_repairs.slice() } };
  }

  if (packet.length < PACKET_HEADER_WORDS) throw new Error("malformed CMA-ES packet: success header");
  const dim = packetInteger(packet, 4, "dim", 2, 6);
  const landscape = packetInteger(packet, 5, "landscape", 0, 4);
  const stopReasonId = packetInteger(packet, 6, "stop_reason", 0, 1);
  const bestFitness = packet[7];
  if (!Number.isFinite(bestFitness)) throw new Error("malformed CMA-ES packet: best_f");
  const totalEvaluations = packetInteger(packet, 8, "total_evals", 0, Number.MAX_SAFE_INTEGER);
  const generationCount = packetInteger(packet, 9, "generation_count", 1, 200);
  const lambda = packetInteger(packet, 10, "lambda", 4, 48);
  const generationStride = packetInteger(packet, 11, "generation_stride", 1, Number.MAX_SAFE_INTEGER);
  const expectedStride = generationPacketWords(dim, lambda);
  if (generationStride !== expectedStride) throw new Error("malformed CMA-ES packet: generation_stride");
  const expectedWords = PACKET_HEADER_WORDS + 6 * dim + generationCount * generationStride;
  if (packet.length !== expectedWords) throw new Error("malformed CMA-ES packet: payload shape");
  if (totalEvaluations !== generationCount * lambda) throw new Error("malformed CMA-ES packet: total_evals mismatch");

  let cursor = PACKET_HEADER_WORDS;
  const take = (count: number, label: string): Float64Array => {
    const end = cursor + count;
    if (end > packet.length) throw new Error(`malformed CMA-ES packet: truncated ${label}`);
    const view = packet.subarray(cursor, end);
    for (let index = 0; index < view.length; index++) {
      const value = view[index];
      if (!Number.isFinite(value)) {
        throw new Error(`malformed CMA-ES packet: non-finite ${label}`);
      }
    }
    cursor = end;
    return view;
  };
  const nextInteger = (label: string, minimum: number, maximum: number): number => {
    const value = packetInteger(packet, cursor, label, minimum, maximum);
    cursor += 1;
    return value;
  };
  const nextFinite = (label: string): number => {
    const value = packet[cursor];
    cursor += 1;
    if (!Number.isFinite(value)) throw new Error(`malformed CMA-ES packet: ${label}`);
    return value;
  };

  const bestX = take(dim, "best_x");
  const pcaBasis = take(3 * dim, "pca_basis");
  const pcaCenter = take(dim, "pca_center");
  const pcaPoolEigenvalues = take(dim, "pca_pool_eigvals");
  const generationRows: CmaesVizGeneration[] = [];

  for (let generationIndex = 0; generationIndex < generationCount; generationIndex++) {
    const recordStart = cursor;
    const g = nextInteger("generation", 1, generationCount);
    if (g !== generationIndex + 1) throw new Error("malformed CMA-ES packet: generation sequence");
    const sigma = nextFinite("sigma");
    if (sigma <= 0) throw new Error("malformed CMA-ES packet: non-positive sigma");
    const cond = nextFinite("condition number");
    if (cond < 1) throw new Error("malformed CMA-ES packet: condition number");
    const generationBest = nextFinite("generation best_f");
    const evals = nextInteger("generation evals", lambda, totalEvaluations);
    if (evals !== g * lambda) throw new Error("malformed CMA-ES packet: generation eval mismatch");
    const mean = take(dim, "mean");
    const eigvals = take(dim, "eigvals");
    for (let index = 0; index < eigvals.length; index++) {
      if (eigvals[index] <= 0 || (index > 0 && eigvals[index] < eigvals[index - 1])) {
        throw new Error("malformed CMA-ES packet: eigvals");
      }
    }
    const eigvecs = take(dim * dim, "eigvecs");
    const projMean = take(3, "proj_mean");
    const projEigenvalues = take(3, "proj_eigvals");
    const projEigenvectors = take(9, "proj_eigvecs");
    const sx = take(lambda * dim, "sx");
    const sz = take(lambda * dim, "sz");
    const sf = take(lambda, "sf");
    for (let index = 1; index < sf.length; index++) {
      if (sf[index] < sf[index - 1]) throw new Error("malformed CMA-ES packet: unranked sf");
    }
    const se = take(lambda, "se");
    let sawNonElite = false;
    let eliteCount = 0;
    for (const elite of se) {
      if (elite !== 0 && elite !== 1) throw new Error("malformed CMA-ES packet: se");
      if (elite === 0) sawNonElite = true;
      else {
        if (sawNonElite) throw new Error("malformed CMA-ES packet: non-prefix elites");
        eliteCount += 1;
      }
    }
    if (eliteCount < 1 || eliteCount >= lambda) throw new Error("malformed CMA-ES packet: elite count");
    const pSigma = take(dim, "p_sigma");
    const pC = take(dim, "p_c");
    if (cursor - recordStart !== generationStride) throw new Error("malformed CMA-ES packet: generation width");

    generationRows.push({
      g,
      mean,
      sigma,
      eigvals,
      eigvecs,
      cond,
      best_f: generationBest,
      evals,
      proj_mean: projMean,
      proj_eigvals: projEigenvalues,
      proj_eigvecs: projEigenvectors,
      sx,
      sz,
      sf,
      se,
      p_sigma: pSigma,
      p_c: pC,
    });
  }
  if (cursor !== packet.length) throw new Error("malformed CMA-ES packet: trailing words");

  return {
    ok: {
      kernel: AUDITED_CMAES_KERNEL_VERSION,
      dim,
      landscape,
      stop_reason: stopReasonId === 0 ? "generations-exhausted" : "target-reached",
      best_f: bestFitness,
      best_x: bestX,
      total_evals: totalEvaluations,
      generations: generationRows,
      pca_basis: pcaBasis,
      pca_center: pcaCenter,
      pca_pool_eigvals: pcaPoolEigenvalues,
      [PACKED_RUN_MARKER]: true,
    }
  };
}

/**
 * Run the kernel batch. Returns null when the module is missing or the
 * envelope is a refusal — callers must fall through to the TS engine for
 * that call (per-call fallback, not just load-time).
 */
export function runCmaesViz(params: CmaesVizParams): CmaesVizRun | null {
  const mod = fsCmaesModule;
  if (!mod || typeof mod.cmaes_viz_run !== "function") return null;
  const x = [params.x0[0] ?? 0, params.x0[1] ?? 0, params.x0[2] ?? 0, params.x0[3] ?? 0, params.x0[4] ?? 0, params.x0[5] ?? 0];
  try {
    const packet = mod.cmaes_viz_run(
      params.dim,
      x[0], x[1], x[2], x[3], x[4], x[5],
      params.sigma0,
      params.lambda,
      params.active,
      // The wasm-bindgen glue declares seed as u64 (bigint); passing a plain
      // number throws a TypeError and would silently fall back to TS.
      BigInt(Math.trunc(params.seed) >>> 0),
      params.generations,
      params.landscape,
      params.noise,
      params.boundsEnabled,
      params.boundMin,
      params.boundMax,
      params.fTarget
    );
    const decoded = decodeCmaesPacket(packet);
    if ("ok" in decoded) return decoded.ok;
    console.warn("[fs-cmaes] kernel refusal:", decoded.refusal.code, decoded.refusal.message);
    return null;
  } catch (err) {
    console.warn("[fs-cmaes] kernel call failed:", err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Adapter: kernel snapshots → CMAESGenerationStateND (viewer-compatible).
// ---------------------------------------------------------------------------

type CandidateSampleND = {
  id: number;
  rawX: number[];
  x: number[];
  z: number[];
  projected3D: [number, number, number];
  fitness: number;
  trueFitness: number;
  rank: number;
  isElite: boolean;
};

type PhaseSpace3DProjection = {
  projectedMean: [number, number, number];
  ellipsoidRadii: [number, number, number];
  principalAxes3D: [[number, number, number], [number, number, number], [number, number, number]];
  eigenvalues: number[];
  conditionNumber: number;
  varianceExplainedPercent: [number, number, number];
  evolutionPath3D: [number, number, number];
  evolutionPathSigma3D: [number, number, number];
};

export type CMAESGenerationStateND = {
  generation: number;
  mean: number[];
  sigma: number;
  covariance: number[][];
  pSigma: number[];
  pC: number[];
  samples: CandidateSampleND[];
  bestFitness: number;
  bestX: number[];
  eigenvalues: number[];
  conditionNumber: number;
  evalCount: number;
  phaseSpace3D: PhaseSpace3DProjection;
  variancePerDim: number[];
};

/**
 * Project one n-D point through the kernel's PCA frame.
 * proj[r] = Σ basis[r·n+i]·(x[i] − center[i]).
 */
function projectPoint(point: ArrayLike<number>, basis: ArrayLike<number>, center: ArrayLike<number>, n: number): [number, number, number] {
  const out: [number, number, number] = [0, 0, 0];
  for (let r = 0; r < 3; r++) {
    let acc = 0;
    for (let i = 0; i < n; i++) acc += basis[r * n + i] * (point[i] - center[i]);
    out[r] = acc;
  }
  return out;
}

/**
 * Project an n-D DIRECTION vector (a displacement such as p_c or p_sigma)
 * through the PCA basis. Directions must not have the center subtracted:
 * that would add a constant −B·center offset, so a zero path would render
 * as a nonzero arrow.
 */
function projectDirection(vec: ArrayLike<number>, basis: ArrayLike<number>, n: number): [number, number, number] {
  const out: [number, number, number] = [0, 0, 0];
  for (let r = 0; r < 3; r++) {
    let acc = 0;
    for (let i = 0; i < n; i++) acc += basis[r * n + i] * vec[i];
    out[r] = acc;
  }
  return out;
}

function copyNumericVector(values: NumericVector): number[] {
  const copy = new Array<number>(values.length);
  for (let index = 0; index < values.length; index++) copy[index] = values[index];
  return copy;
}

function copyNumericSlice(values: NumericVector, start: number, end: number): number[] {
  const copy = new Array<number>(end - start);
  for (let index = start; index < end; index++) copy[index - start] = values[index];
  return copy;
}

/**
 * Map a kernel run onto the viewer's state list. The kernel emits ascending
 * eigenvalues; the viewer expects ellipsoidRadii/principalAxes ordered
 * largest-first, so the projection triples are reversed here.
 */
export function wasmRunToNdStates(run: CmaesVizRun): CMAESGenerationStateND[] {
  const n = run.dim;
  const basis = run.pca_basis;
  const center = run.pca_center;
  const pool = run.pca_pool_eigvals;
  const populationAlreadyRanked = run[PACKED_RUN_MARKER] === true;
  let poolSum = 0;
  for (let index = 0; index < pool.length; index++) poolSum += Math.max(pool[index], 0);
  poolSum ||= 1;
  // Top-3 pooled eigenvalues (largest last in the ascending spectrum).
  const top3 = [pool[pool.length - 1] ?? 0, pool[pool.length - 2] ?? 0, pool[pool.length - 3] ?? 0];
  const varianceExplained: [number, number, number] = [
    (100 * Math.max(top3[0], 0)) / poolSum,
    (100 * Math.max(top3[1], 0)) / poolSum,
    (100 * Math.max(top3[2], 0)) / poolSum,
  ];

  let runningBestObservedFitness = Infinity;
  let runningBestX = copyNumericVector(run.generations[0]?.mean ?? run.best_x);

  return run.generations.map((gen, generationIndex) => {
    const lambda = gen.se.length;
    // Audited kernels store population streams in rank order. Derive ranks
    // defensively from displayed fitnesses anyway so this pure adapter also
    // handles synthetic fixtures and rejects no otherwise-renderable stream.
    const sortedIndices = Array.from({ length: lambda }, (_, i) => i);
    if (!populationAlreadyRanked) {
      sortedIndices.sort((a, b) => {
        const fa = Number.isFinite(gen.sf[a]) ? gen.sf[a] : Infinity;
        const fb = Number.isFinite(gen.sf[b]) ? gen.sf[b] : Infinity;
        return fa - fb || a - b;
      });
    }
    const ranks = new Array<number>(lambda);
    sortedIndices.forEach((sampleIndex, rank) => {
      ranks[sampleIndex] = rank;
    });
    let selectedCount = 0;
    for (let index = 0; index < gen.se.length; index++) selectedCount += Number(gen.se[index] === 1);
    const eliteCount = selectedCount > 0 && selectedCount < lambda ? selectedCount : Math.floor(lambda / 2);

    const generationBestIndex = sortedIndices[0];
    const generationBestFitness = gen.sf[generationBestIndex];
    if (Number.isFinite(generationBestFitness) && generationBestFitness < runningBestObservedFitness) {
      runningBestObservedFitness = generationBestFitness;
      runningBestX = copyNumericSlice(gen.sx, generationBestIndex * n, (generationBestIndex + 1) * n);
    }
    // Defensive spectrum sanitizing at the adapter boundary. The loader
    // admits only audited kernels, while this exported pure mapper is also
    // exercised directly with synthetic snapshots.
    const eigenvalues = Array.from(gen.eigvals, (value) => Math.max(value, 0));
    const evMin = eigenvalues[0];
    const evMax = eigenvalues[eigenvalues.length - 1];
    const conditionNumber = evMin > 0 ? evMax / evMin : Infinity;
    // The viewer pins the mean/ellipsoid at its origin, so samples must be
    // projected relative to the CURRENT mean (like the TS engine's x − mean),
    // not the run-level pooled PCA center; otherwise the cloud drifts off the
    // ellipsoid as the search moves away from the pooled center.
    const projMean = projectPoint(gen.mean, basis, center, n);
    const samples: CandidateSampleND[] = [];
    for (let s = 0; s < lambda; s++) {
      const x = copyNumericSlice(gen.sx, s * n, (s + 1) * n);
      const z = copyNumericSlice(gen.sz, s * n, (s + 1) * n);
      const p = projectPoint(x, basis, center, n);
      samples.push({
        id: s,
        rawX: x,
        x,
        z,
        projected3D: [p[0] - projMean[0], p[1] - projMean[1], p[2] - projMean[2]],
        fitness: gen.sf[s],
        trueFitness: gen.sf[s],
        rank: ranks[s],
        isElite: ranks[s] < eliteCount,
      });
    }

    // 3×3 marginal: radii/axes largest-first from ascending proj_eigvals.
    // proj_eigvals are eigenvalues of C's projected marginal (sigma excluded,
    // like gen.eigvals), so the 1-sigma radii are sigma * sqrt(eigenvalue) —
    // the same contract cmaesEngineND documents.
    const projectedEigenvalues = Array.from(gen.proj_eigvals, (value) => Math.max(value, 0));
    const radii: [number, number, number] = [
      gen.sigma * Math.sqrt(projectedEigenvalues[2]),
      gen.sigma * Math.sqrt(projectedEigenvalues[1]),
      gen.sigma * Math.sqrt(projectedEigenvalues[0]),
    ];
    const col = (j: number): [number, number, number] => [
      gen.proj_eigvecs[j],
      gen.proj_eigvecs[3 + j],
      gen.proj_eigvecs[6 + j],
    ];
    const principalAxes3D: [[number, number, number], [number, number, number], [number, number, number]] = [
      col(2),
      col(1),
      col(0),
    ];
    const projCond = projectedEigenvalues[0] > 0
      ? projectedEigenvalues[2] / projectedEigenvalues[0]
      : Infinity;
    const evolutionPath3D = projectDirection(gen.p_c, basis, n);
    const evolutionPathSigma3D = projectDirection(gen.p_sigma, basis, n);

    // Full covariance for HUD/telemetry consumers (V·Λ·Vᵀ).
    const covariance: number[][] = Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, k) => {
        let acc = 0;
        for (let j = 0; j < n; j++) acc += eigenvalues[j] * gen.eigvecs[i * n + j] * gen.eigvecs[k * n + j];
        return acc;
      })
    );

    return {
      generation: gen.g,
      mean: copyNumericVector(gen.mean),
      sigma: gen.sigma,
      covariance,
      pSigma: copyNumericVector(gen.p_sigma),
      pC: copyNumericVector(gen.p_c),
      samples,
      bestFitness: gen.best_f,
      // The stream does not include the coordinate associated with its
      // historical true-best fitness, so intermediate frames use the best
      // observed sample available by that point. The run envelope does carry
      // the exact true-best coordinate, and it is valid once the final frame
      // has been reached.
      bestX: generationIndex === run.generations.length - 1 ? copyNumericVector(run.best_x) : runningBestX.slice(),
      eigenvalues: [...eigenvalues].reverse(),
      conditionNumber,
      evalCount: gen.evals,
      phaseSpace3D: {
        projectedMean: [gen.proj_mean[0], gen.proj_mean[1], gen.proj_mean[2]],
        ellipsoidRadii: radii,
        principalAxes3D,
        eigenvalues: [projectedEigenvalues[2], projectedEigenvalues[1], projectedEigenvalues[0]],
        conditionNumber: projCond,
        varianceExplainedPercent: varianceExplained,
        evolutionPath3D,
        evolutionPathSigma3D,
      },
      // Per-coordinate sampling variance of N(m, sigma^2 C) is sigma^2 * C_ii
      // (eigenvalues would be variance per principal axis, a different thing).
      variancePerDim: covariance.map((row, i) => gen.sigma * gen.sigma * Math.max(row[i], 0)),
    };
  });
}

// ---------------------------------------------------------------------------
// Owner CMA-family + G1 walking boundary (schema 2 / G1 schema 1).
//
// This deliberately coexists with the audited 0.4.1 batch visualizer above.
// That older surface provides exact low-dimensional TS/WASM trajectory parity;
// this surface exposes fs-dfo's stateful production families and the composed
// 5,040-D fs-mbd walking objective. Neither one impersonates the other.
// ---------------------------------------------------------------------------

const OWNER_CMA_MAGIC = 0x434d4132;
const OWNER_CMA_SCHEMA = 2;
const OWNER_CMA_KIND_CONFIG = 0;
const OWNER_CMA_KIND_ADMISSION = 1;
const OWNER_CMA_KIND_ASK = 2;
const OWNER_CMA_KIND_TELL = 3;
const OWNER_CMA_KIND_SNAPSHOT = 4;
const OWNER_CMA_SNAPSHOT_WORDS = 31;

const G1_MAGIC = 0x47315731;
const G1_SCHEMA = 1;
const G1_KIND_CONFIG = 0;
const G1_KIND_ADMISSION = 1;
const G1_KIND_EVALUATION = 2;
const G1_KIND_TRACE = 3;
const G1_KIND_POPULATION = 4;
const G1_POLICY_DIMENSION = 5_040;
const G1_LINK_COUNT = 16;
const G1_POSE_WORDS = 7;
const G1_TRACE_SAMPLE_WORDS = 115;

export const FRANKENSIM_OWNER_KERNEL_VERSION = "fs-cmaes-viz-wasm 0.5.4";

export type CmaFamily = "full" | "separable" | "lm-cma" | "lm-ma";

const CMA_FAMILY_IDS: Record<CmaFamily, number> = {
  full: 0,
  separable: 1,
  "lm-cma": 2,
  "lm-ma": 3,
};

const CMA_FAMILY_NAMES = ["full", "separable", "lm-cma", "lm-ma"] as const;

const CMA_REFUSAL_NAMES = [
  "unknown",
  "malformed-packet",
  "schema-mismatch",
  "unknown-family",
  "invalid-dimension",
  "full-dimension-limit",
  "invalid-population",
  "invalid-memory",
  "invalid-budget",
  "invalid-seed",
  "invalid-sigma",
  "non-finite-mean",
  "shape-overflow",
  "random-counter-overflow",
  "dense-work-refused",
  "browser-memory-refused",
  "ask-already-pending",
  "budget-exhausted",
  "tell-without-ask",
  "generation-mismatch",
  "objective-count-mismatch",
  "non-finite-objective",
  "owner-batch-mismatch",
  "owner-numerical-failure",
] as const;

const G1_REFUSAL_NAMES = [
  "unknown",
  "malformed-packet",
  "schema-mismatch",
  "invalid-config",
  "parameter-count",
  "non-finite-parameter",
  "robot-owner",
  "policy-owner",
  "contact-owner",
  "friction-owner",
  "time-owner",
  "geometry-owner",
  "unexpected-contact-receipt",
  "non-finite-objective",
  "population-invalid",
  "shape-overflow",
] as const;

export interface OwnerKernelStatus {
  source: "wasm" | "unavailable";
  kernelVersion: string | null;
  error: string | null;
}

export interface PackedOwnerRefusal {
  code: number;
  name: string;
  detail: number | null;
}

export interface CmaFamilyConfig {
  family: CmaFamily;
  mean: ArrayLike<number>;
  sigma: number;
  maxEvaluations: number;
  seed?: number | bigint;
  /** Zero/undefined selects Hansen's dimension-aware default. */
  population?: number;
  /** Zero/undefined selects the owner's LM default; invalid for dense/diagonal. */
  memory?: number;
}

export type CmaShapeReceipt =
  | {
      kind: "full";
      negativeWeightCount: number;
      minimumEigenvalue: number;
      maximumEigenvalue: number;
      covarianceDiagonal: Float64Array;
    }
  | {
      kind: "diagonal";
      negativeWeightCount: number;
      variances: Float64Array;
    }
  | {
      kind: "limited-memory";
      storedVectors: number;
      capacity: number;
      directionNorms: Float64Array;
    };

export interface CmaFamilySnapshot {
  family: CmaFamily;
  dimension: number;
  generation: number;
  evaluations: number;
  sigma: number;
  population: number;
  parents: number;
  maxGenerations: number;
  admittedEvaluations: number;
  streamSemantics: number;
  streamKernel: number;
  normalStreamBlocks: bigint;
  samplingOrder: "linear" | "memory-linear" | "quadratic" | "cubic";
  updateOrder: "linear" | "memory-linear" | "quadratic" | "cubic";
  persistentScalars: number;
  pendingGenerationScalars: number;
  updateWorkspaceScalars: number;
  denseMatrixEntries: number;
  memoryCapacity: number;
  best: null | { objective: number; generation: number; candidate: number; point: Float64Array };
  mean: Float64Array;
  shape: CmaShapeReceipt;
}

export interface CmaFamilyAsk {
  generation: number;
  evaluationsBefore: number;
  dimension: number;
  population: number;
  /** Row-major, candidate-major population view. */
  candidates: Float64Array;
}

export type PackedResult<T> = { ok: T } | { refusal: PackedOwnerRefusal };

type RawCmaSession = {
  receipt: () => Float64Array;
  ask: () => Float64Array;
  tell: (packet: Float64Array) => Float64Array;
  free?: () => void;
};

type RawG1Evaluator = {
  receipt: () => Float64Array;
  evaluate: (policy: Float64Array) => Float64Array;
  evaluate_population: (policies: Float64Array) => Float64Array;
  trace: (policy: Float64Array) => Float64Array;
  free?: () => void;
};

type OwnerWasmModule = WasmModule & {
  CmaesVizSession?: new (config: Float64Array) => RawCmaSession;
  G1WalkingVizEvaluator?: new (config: Float64Array) => RawG1Evaluator;
};

let ownerModule: OwnerWasmModule | null = null;
let ownerLoadPromise: Promise<OwnerKernelStatus> | null = null;

/** Load and capability-probe the schema-2/G1 package exactly once per realm. */
export function initFrankenSimOwnerKernel(): Promise<OwnerKernelStatus> {
  if (ownerLoadPromise) return ownerLoadPromise;
  ownerLoadPromise = (async (): Promise<OwnerKernelStatus> => {
    try {
      const loaded = (await loadWasmModule(
        "/wasm/fs-cmaes/v054/fs_cmaes_viz_wasm.js",
        "/wasm/fs-cmaes/v054/fs_cmaes_viz_wasm_bg.wasm"
      )) as OwnerWasmModule;
      const version = typeof loaded.cmaes_viz_kernel_version === "function"
        ? loaded.cmaes_viz_kernel_version()
        : null;
      if (version !== FRANKENSIM_OWNER_KERNEL_VERSION) {
        return {
          source: "unavailable",
          kernelVersion: version,
          error: `expected ${FRANKENSIM_OWNER_KERNEL_VERSION}, received ${version ?? "no version"}`,
        };
      }
      if (
        typeof loaded.CmaesVizSession !== "function" ||
        typeof loaded.G1WalkingVizEvaluator !== "function"
      ) {
        return {
          source: "unavailable",
          kernelVersion: version,
          error: "owner package is missing the CMA session or G1 evaluator export",
        };
      }
      ownerModule = loaded;
      return { source: "wasm", kernelVersion: version, error: null };
    } catch (error) {
      return {
        source: "unavailable",
        kernelVersion: null,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  })();
  return ownerLoadPromise;
}

function exactPacketInteger(
  packet: Float64Array,
  index: number,
  label: string,
  minimum = 0,
  maximum = Number.MAX_SAFE_INTEGER
): number {
  if (index >= packet.length) throw new Error(`malformed packed packet: missing ${label}`);
  const value = packet[index];
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) {
    throw new Error(`malformed packed packet: ${label}`);
  }
  return value;
}

function finitePacketNumber(packet: Float64Array, index: number, label: string): number {
  if (index >= packet.length || !Number.isFinite(packet[index])) {
    throw new Error(`malformed packed packet: ${label}`);
  }
  return packet[index];
}

function finitePacketView(packet: Float64Array, start: number, count: number, label: string): Float64Array {
  const end = start + count;
  if (!Number.isSafeInteger(end) || end > packet.length) {
    throw new Error(`malformed packed packet: truncated ${label}`);
  }
  const values = packet.subarray(start, end);
  for (let index = 0; index < values.length; index++) {
    if (!Number.isFinite(values[index])) throw new Error(`malformed packed packet: ${label}`);
  }
  return values;
}

function decodeCommonOutput(
  packet: Float64Array,
  magic: number,
  schema: number,
  expectedKind: number,
  refusalNames: readonly string[]
): { payloadStart: 5 } | { refusal: PackedOwnerRefusal } {
  if (!(packet instanceof Float64Array) || packet.length < 5) {
    throw new Error("malformed packed packet: expected Float64Array header");
  }
  if (packet[0] !== magic) throw new Error("malformed packed packet: magic");
  if (packet[1] !== schema) throw new Error("malformed packed packet: schema");
  const status = exactPacketInteger(packet, 2, "status", 0, 1);
  const kind = exactPacketInteger(packet, 3, "kind", 0, 4);
  if (kind !== expectedKind) throw new Error("malformed packed packet: unexpected kind");
  const totalWords = exactPacketInteger(packet, 4, "total words", 5);
  if (totalWords !== packet.length) throw new Error("malformed packed packet: total words");
  if (status === 0) return { payloadStart: 5 };
  if (packet.length !== 7) throw new Error("malformed packed packet: refusal length");
  const code = exactPacketInteger(packet, 5, "refusal code", 1, refusalNames.length - 1);
  const rawDetail = packet[6];
  const detail = Number.isNaN(rawDetail)
    ? null
    : exactPacketInteger(packet, 6, "refusal detail");
  return { refusal: { code, name: refusalNames[code] ?? "unknown", detail } };
}

function decodeCmaOutputHeader(
  packet: Float64Array,
  expectedKind: number
): { payloadStart: 5 } | { refusal: PackedOwnerRefusal } {
  return decodeCommonOutput(packet, OWNER_CMA_MAGIC, OWNER_CMA_SCHEMA, expectedKind, CMA_REFUSAL_NAMES);
}

const COMPLEXITY_NAMES = ["linear", "memory-linear", "quadratic", "cubic"] as const;

/** Strictly decode an admission or post-tell snapshot without inventing diagnostics. */
export function decodeCmaFamilySnapshot(
  packet: Float64Array,
  expectedKind: typeof OWNER_CMA_KIND_ADMISSION | typeof OWNER_CMA_KIND_SNAPSHOT
): PackedResult<CmaFamilySnapshot> {
  const header = decodeCmaOutputHeader(packet, expectedKind);
  if ("refusal" in header) return header;
  if (packet.length < OWNER_CMA_SNAPSHOT_WORDS) {
    throw new Error("malformed packed packet: snapshot header");
  }
  const familyId = exactPacketInteger(packet, 5, "family", 0, 3);
  const family = CMA_FAMILY_NAMES[familyId];
  const dimension = exactPacketInteger(packet, 6, "dimension", 1, 100_000);
  const generation = exactPacketInteger(packet, 7, "generation");
  const evaluations = exactPacketInteger(packet, 8, "evaluations");
  const sigma = finitePacketNumber(packet, 9, "sigma");
  if (sigma <= 0) throw new Error("malformed packed packet: non-positive sigma");
  const population = exactPacketInteger(packet, 10, "population", 4);
  const parents = exactPacketInteger(packet, 11, "parents", 1, population - 1);
  const maxGenerations = exactPacketInteger(packet, 12, "max generations", 1);
  const admittedEvaluations = exactPacketInteger(packet, 13, "admitted evaluations", population);
  if (
    admittedEvaluations !== maxGenerations * population ||
    evaluations !== generation * population ||
    generation > maxGenerations
  ) {
    throw new Error("malformed packed packet: budget receipt");
  }
  const streamSemantics = exactPacketInteger(packet, 14, "stream semantics", 1, 0xffff_ffff);
  const streamKernel = exactPacketInteger(packet, 15, "stream kernel", 1, 0xffff_ffff);
  const normalLow = exactPacketInteger(packet, 16, "normal blocks low", 0, 0xffff_ffff);
  const normalHigh = exactPacketInteger(packet, 17, "normal blocks high", 0, 0xffff_ffff);
  const samplingOrderId = exactPacketInteger(packet, 18, "sampling order", 0, 3);
  const updateOrderId = exactPacketInteger(packet, 19, "update order", 0, 3);
  const persistentScalars = exactPacketInteger(packet, 20, "persistent scalars");
  const pendingGenerationScalars = exactPacketInteger(packet, 21, "pending scalars");
  const updateWorkspaceScalars = exactPacketInteger(packet, 22, "workspace scalars");
  const denseMatrixEntries = exactPacketInteger(packet, 23, "dense entries");
  const memoryCapacity = exactPacketInteger(packet, 24, "memory capacity");
  const hasBest = exactPacketInteger(packet, 25, "has best", 0, 1) === 1;
  const shapeKind = exactPacketInteger(packet, 29, "shape kind", 0, 2);
  const shapeWords = exactPacketInteger(packet, 30, "shape words");
  const expectedWords = OWNER_CMA_SNAPSHOT_WORDS + 2 * dimension + shapeWords;
  if (packet.length !== expectedWords) throw new Error("malformed packed packet: snapshot shape");
  const expectedSamplingOrder = family === "full" ? 2 : family === "separable" ? 0 : 1;
  const expectedUpdateOrder = family === "full" ? 3 : family === "separable" ? 0 : 1;
  if (samplingOrderId !== expectedSamplingOrder || updateOrderId !== expectedUpdateOrder) {
    throw new Error("malformed packed packet: family complexity");
  }
  if (
    // The full owner retains both C and its cached eigensystem/root, hence two
    // dense n-by-n stores. Other families truthfully report no dense matrix.
    (family === "full" && (denseMatrixEntries !== 2 * dimension * dimension || memoryCapacity !== 0)) ||
    (family === "separable" && (denseMatrixEntries !== 0 || memoryCapacity !== 0)) ||
    ((family === "lm-cma" || family === "lm-ma") && (denseMatrixEntries !== 0 || memoryCapacity === 0))
  ) {
    throw new Error("malformed packed packet: family storage");
  }

  const mean = finitePacketView(packet, OWNER_CMA_SNAPSHOT_WORDS, dimension, "mean");
  const bestPointStart = OWNER_CMA_SNAPSHOT_WORDS + dimension;
  let best: CmaFamilySnapshot["best"] = null;
  if (hasBest) {
    best = {
      objective: finitePacketNumber(packet, 26, "best objective"),
      generation: exactPacketInteger(packet, 27, "best generation", 0, generation),
      candidate: exactPacketInteger(packet, 28, "best candidate", 0, population - 1),
      point: finitePacketView(packet, bestPointStart, dimension, "best point"),
    };
  } else {
    if (!Number.isNaN(packet[26]) || !Number.isNaN(packet[27]) || !Number.isNaN(packet[28])) {
      throw new Error("malformed packed packet: absent best metadata");
    }
    for (let index = 0; index < dimension; index++) {
      if (!Number.isNaN(packet[bestPointStart + index])) {
        throw new Error("malformed packed packet: absent best point");
      }
    }
  }

  const shapeStart = bestPointStart + dimension;
  let shape: CmaShapeReceipt;
  if (shapeKind === 0) {
    if (family !== "full" || shapeWords !== dimension + 3) {
      throw new Error("malformed packed packet: full shape");
    }
    const negativeWeightCount = exactPacketInteger(packet, shapeStart, "negative weights");
    const minimumEigenvalue = finitePacketNumber(packet, shapeStart + 1, "minimum eigenvalue");
    const maximumEigenvalue = finitePacketNumber(packet, shapeStart + 2, "maximum eigenvalue");
    if (minimumEigenvalue <= 0 || maximumEigenvalue < minimumEigenvalue) {
      throw new Error("malformed packed packet: full spectrum");
    }
    const covarianceDiagonal = finitePacketView(
      packet,
      shapeStart + 3,
      dimension,
      "covariance diagonal"
    );
    if (covarianceDiagonal.some((value) => value <= 0)) {
      throw new Error("malformed packed packet: covariance diagonal");
    }
    shape = {
      kind: "full",
      negativeWeightCount,
      minimumEigenvalue,
      maximumEigenvalue,
      covarianceDiagonal,
    };
  } else if (shapeKind === 1) {
    if (family !== "separable" || shapeWords !== dimension + 1) {
      throw new Error("malformed packed packet: diagonal shape");
    }
    const variances = finitePacketView(packet, shapeStart + 1, dimension, "variances");
    if (variances.some((value) => value <= 0)) {
      throw new Error("malformed packed packet: diagonal variances");
    }
    shape = {
      kind: "diagonal",
      negativeWeightCount: exactPacketInteger(packet, shapeStart, "negative weights"),
      variances,
    };
  } else {
    if ((family !== "lm-cma" && family !== "lm-ma") || shapeWords < 2) {
      throw new Error("malformed packed packet: limited-memory shape");
    }
    const storedVectors = exactPacketInteger(packet, shapeStart, "stored vectors", 0, memoryCapacity);
    const capacity = exactPacketInteger(packet, shapeStart + 1, "shape capacity", 1);
    if (capacity !== memoryCapacity || shapeWords !== storedVectors + 2) {
      throw new Error("malformed packed packet: limited-memory payload");
    }
    const directionNorms = finitePacketView(
      packet,
      shapeStart + 2,
      storedVectors,
      "direction norms"
    );
    if (directionNorms.some((value) => value < 0)) {
      throw new Error("malformed packed packet: direction norms");
    }
    shape = {
      kind: "limited-memory",
      storedVectors,
      capacity,
      directionNorms,
    };
  }

  return {
    ok: {
      family,
      dimension,
      generation,
      evaluations,
      sigma,
      population,
      parents,
      maxGenerations,
      admittedEvaluations,
      streamSemantics,
      streamKernel,
      normalStreamBlocks: BigInt(normalLow) | (BigInt(normalHigh) << 32n),
      samplingOrder: COMPLEXITY_NAMES[samplingOrderId],
      updateOrder: COMPLEXITY_NAMES[updateOrderId],
      persistentScalars,
      pendingGenerationScalars,
      updateWorkspaceScalars,
      denseMatrixEntries,
      memoryCapacity,
      best,
      mean,
      shape,
    },
  };
}

/** Strictly decode one complete row-major owner population. */
export function decodeCmaFamilyAsk(packet: Float64Array): PackedResult<CmaFamilyAsk> {
  const header = decodeCmaOutputHeader(packet, OWNER_CMA_KIND_ASK);
  if ("refusal" in header) return header;
  if (packet.length < 9) throw new Error("malformed packed packet: ask header");
  const generation = exactPacketInteger(packet, 5, "generation");
  const evaluationsBefore = exactPacketInteger(packet, 6, "evaluations before");
  const dimension = exactPacketInteger(packet, 7, "dimension", 1, 100_000);
  const population = exactPacketInteger(packet, 8, "population", 4, 64_000);
  const candidateWords = dimension * population;
  if (!Number.isSafeInteger(candidateWords) || packet.length !== 9 + candidateWords) {
    throw new Error("malformed packed packet: ask shape");
  }
  const candidates = finitePacketView(packet, 9, candidateWords, "candidates");
  return { ok: { generation, evaluationsBefore, dimension, population, candidates } };
}

export function buildCmaFamilyConfig(config: CmaFamilyConfig): Float64Array {
  const dimension = config.mean.length;
  const seed = BigInt.asUintN(64, BigInt(config.seed ?? 0x5eed));
  const packet = new Float64Array(12 + dimension);
  packet.set([
    OWNER_CMA_MAGIC,
    OWNER_CMA_SCHEMA,
    OWNER_CMA_KIND_CONFIG,
    packet.length,
    CMA_FAMILY_IDS[config.family],
    dimension,
    config.population ?? 0,
    config.memory ?? 0,
    config.maxEvaluations,
    Number(seed & 0xffff_ffffn),
    Number(seed >> 32n),
    config.sigma,
  ]);
  for (let index = 0; index < dimension; index++) packet[12 + index] = config.mean[index];
  return packet;
}

function buildTellPacket(generation: number, objectives: ArrayLike<number>): Float64Array {
  const packet = new Float64Array(6 + objectives.length);
  packet.set([
    OWNER_CMA_MAGIC,
    OWNER_CMA_SCHEMA,
    OWNER_CMA_KIND_TELL,
    packet.length,
    generation,
    objectives.length,
  ]);
  for (let index = 0; index < objectives.length; index++) packet[6 + index] = objectives[index];
  return packet;
}

export class FrankenSimCmaFamilySession {
  private readonly raw: RawCmaSession;
  readonly admission: CmaFamilySnapshot;

  constructor(raw: RawCmaSession, admission: CmaFamilySnapshot) {
    this.raw = raw;
    this.admission = admission;
  }

  ask(): PackedResult<CmaFamilyAsk> {
    return decodeCmaFamilyAsk(this.raw.ask());
  }

  tell(generation: number, objectives: ArrayLike<number>): PackedResult<CmaFamilySnapshot> {
    return decodeCmaFamilySnapshot(
      this.raw.tell(buildTellPacket(generation, objectives)),
      OWNER_CMA_KIND_SNAPSHOT
    );
  }

  free(): void {
    this.raw.free?.();
  }
}

export async function createFrankenSimCmaFamilySession(
  config: CmaFamilyConfig
): Promise<PackedResult<FrankenSimCmaFamilySession>> {
  const status = await initFrankenSimOwnerKernel();
  const Session = ownerModule?.CmaesVizSession;
  if (status.source !== "wasm" || !Session) {
    throw new Error(status.error ?? "Frankensim owner CMA kernel is unavailable");
  }
  const raw = new Session(buildCmaFamilyConfig(config));
  let decoded: PackedResult<CmaFamilySnapshot>;
  try {
    decoded = decodeCmaFamilySnapshot(raw.receipt(), OWNER_CMA_KIND_ADMISSION);
  } catch (error) {
    raw.free?.();
    throw error;
  }
  if ("refusal" in decoded) {
    raw.free?.();
    return decoded;
  }
  return { ok: new FrankenSimCmaFamilySession(raw, decoded.ok) };
}

export interface G1WalkingConfig {
  stepSeconds: number;
  durationSeconds: number;
  targetSpeed: number;
  gaitFrequency: number;
  traceStride: number;
}

export const DEFAULT_G1_WALKING_CONFIG: G1WalkingConfig = {
  stepSeconds: 1 / 120,
  durationSeconds: 1.5,
  targetSpeed: 0.65,
  gaitFrequency: 1.55,
  traceStride: 3,
};

export interface G1Admission {
  policyDimension: 5_040;
  linkCount: 16;
  poseWords: 7;
  traceSampleWords: 115;
  config: G1WalkingConfig;
}

export interface G1ObjectiveReceipt {
  objective: number;
  distanceMeters: number;
  speedErrorIntegral: number;
  actuatorWorkJoules: number;
  slipIntegral: number;
  postureIntegral: number;
  jointLimitIntegral: number;
  impactIntegral: number;
  completedSteps: number;
  fell: boolean;
}

export interface G1LinkPose {
  position: [number, number, number];
  /** World-from-link quaternion in owner order w,x,y,z. */
  quaternionWxyz: [number, number, number, number];
}

export interface G1TraceSample {
  timeSeconds: number;
  leftContact: boolean;
  rightContact: boolean;
  linkPoses: G1LinkPose[];
}

export interface G1TraceReceipt extends G1ObjectiveReceipt {
  samples: G1TraceSample[];
}

function buildG1Config(config: G1WalkingConfig): Float64Array {
  return new Float64Array([
    G1_MAGIC,
    G1_SCHEMA,
    G1_KIND_CONFIG,
    9,
    config.stepSeconds,
    config.durationSeconds,
    config.targetSpeed,
    config.gaitFrequency,
    config.traceStride,
  ]);
}

function decodeG1Header(
  packet: Float64Array,
  expectedKind: number
): { payloadStart: 5 } | { refusal: PackedOwnerRefusal } {
  return decodeCommonOutput(packet, G1_MAGIC, G1_SCHEMA, expectedKind, G1_REFUSAL_NAMES);
}

export function decodeG1Admission(packet: Float64Array): PackedResult<G1Admission> {
  const header = decodeG1Header(packet, G1_KIND_ADMISSION);
  if ("refusal" in header) return header;
  if (packet.length !== 14) throw new Error("malformed G1 packet: admission length");
  const policyDimension = exactPacketInteger(packet, 5, "policy dimension");
  const linkCount = exactPacketInteger(packet, 6, "link count");
  const poseWords = exactPacketInteger(packet, 7, "pose words");
  const traceSampleWords = exactPacketInteger(packet, 8, "trace sample words");
  if (
    policyDimension !== G1_POLICY_DIMENSION ||
    linkCount !== G1_LINK_COUNT ||
    poseWords !== G1_POSE_WORDS ||
    traceSampleWords !== G1_TRACE_SAMPLE_WORDS
  ) {
    throw new Error("malformed G1 packet: owner layout mismatch");
  }
  const stepSeconds = finitePacketNumber(packet, 9, "step seconds");
  const durationSeconds = finitePacketNumber(packet, 10, "duration seconds");
  const targetSpeed = finitePacketNumber(packet, 11, "target speed");
  const gaitFrequency = finitePacketNumber(packet, 12, "gait frequency");
  const traceStride = exactPacketInteger(packet, 13, "trace stride", 1, 1_000);
  if (
    stepSeconds < 1 / 480 ||
    stepSeconds > 1 / 30 ||
    durationSeconds < stepSeconds ||
    durationSeconds > 4 ||
    targetSpeed < 0 ||
    targetSpeed > 2 ||
    gaitFrequency < 0.25 ||
    gaitFrequency > 4 ||
    Math.round(durationSeconds / stepSeconds) > 10_000
  ) {
    throw new Error("malformed G1 packet: admitted controls");
  }
  return {
    ok: {
      policyDimension: G1_POLICY_DIMENSION,
      linkCount: G1_LINK_COUNT,
      poseWords: G1_POSE_WORDS,
      traceSampleWords: G1_TRACE_SAMPLE_WORDS,
      config: {
        stepSeconds,
        durationSeconds,
        targetSpeed,
        gaitFrequency,
        traceStride,
      },
    },
  };
}

function decodeG1ReceiptPayload(packet: Float64Array): G1ObjectiveReceipt {
  if (packet.length < 15) throw new Error("malformed G1 packet: objective receipt");
  const fellWord = exactPacketInteger(packet, 14, "fell", 0, 1);
  const receipt = {
    objective: finitePacketNumber(packet, 5, "objective"),
    distanceMeters: finitePacketNumber(packet, 6, "distance"),
    speedErrorIntegral: finitePacketNumber(packet, 7, "speed error"),
    actuatorWorkJoules: finitePacketNumber(packet, 8, "actuator work"),
    slipIntegral: finitePacketNumber(packet, 9, "slip"),
    postureIntegral: finitePacketNumber(packet, 10, "posture"),
    jointLimitIntegral: finitePacketNumber(packet, 11, "joint limit"),
    impactIntegral: finitePacketNumber(packet, 12, "impact"),
    completedSteps: exactPacketInteger(packet, 13, "completed steps", 0, 10_000),
    fell: fellWord === 1,
  };
  if (
    receipt.speedErrorIntegral < 0 ||
    receipt.actuatorWorkJoules < 0 ||
    receipt.slipIntegral < 0 ||
    receipt.postureIntegral < 0 ||
    receipt.jointLimitIntegral < 0 ||
    receipt.impactIntegral < 0
  ) {
    throw new Error("malformed G1 packet: negative integral");
  }
  return receipt;
}

export function decodeG1Evaluation(packet: Float64Array): PackedResult<G1ObjectiveReceipt> {
  const header = decodeG1Header(packet, G1_KIND_EVALUATION);
  if ("refusal" in header) return header;
  if (packet.length !== 15) throw new Error("malformed G1 packet: evaluation length");
  return { ok: decodeG1ReceiptPayload(packet) };
}

export function decodeG1Population(packet: Float64Array): PackedResult<Float64Array> {
  const header = decodeG1Header(packet, G1_KIND_POPULATION);
  if ("refusal" in header) return header;
  if (packet.length < 7) throw new Error("malformed G1 packet: population length");
  const population = exactPacketInteger(packet, 5, "population", 1, 64);
  if (packet.length !== 6 + population) throw new Error("malformed G1 packet: population shape");
  return { ok: finitePacketView(packet, 6, population, "population objectives") };
}

export function decodeG1Trace(packet: Float64Array): PackedResult<G1TraceReceipt> {
  const header = decodeG1Header(packet, G1_KIND_TRACE);
  if ("refusal" in header) return header;
  const receipt = decodeG1ReceiptPayload(packet);
  const sampleCount = exactPacketInteger(packet, 15, "trace sample count");
  if (packet.length !== 16 + sampleCount * G1_TRACE_SAMPLE_WORDS) {
    throw new Error("malformed G1 packet: trace shape");
  }
  const samples: G1TraceSample[] = [];
  let cursor = 16;
  let previousTime = -Infinity;
  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex++) {
    const timeSeconds = finitePacketNumber(packet, cursor, "trace time");
    if (timeSeconds < previousTime) throw new Error("malformed G1 packet: trace time order");
    previousTime = timeSeconds;
    const leftContact = exactPacketInteger(packet, cursor + 1, "left contact", 0, 1) === 1;
    const rightContact = exactPacketInteger(packet, cursor + 2, "right contact", 0, 1) === 1;
    cursor += 3;
    const linkPoses: G1LinkPose[] = [];
    for (let link = 0; link < G1_LINK_COUNT; link++) {
      const pose = finitePacketView(packet, cursor, G1_POSE_WORDS, "link pose");
      const quaternionNorm = Math.hypot(pose[3], pose[4], pose[5], pose[6]);
      if (Math.abs(quaternionNorm - 1) > 1e-6) {
        throw new Error("malformed G1 packet: link quaternion");
      }
      linkPoses.push({
        position: [pose[0], pose[1], pose[2]],
        quaternionWxyz: [pose[3], pose[4], pose[5], pose[6]],
      });
      cursor += G1_POSE_WORDS;
    }
    samples.push({ timeSeconds, leftContact, rightContact, linkPoses });
  }
  return { ok: { ...receipt, samples } };
}

export class FrankenSimG1WalkingEvaluator {
  private readonly raw: RawG1Evaluator;
  readonly admission: G1Admission;

  constructor(raw: RawG1Evaluator, admission: G1Admission) {
    this.raw = raw;
    this.admission = admission;
  }

  evaluate(policy: Float64Array): PackedResult<G1ObjectiveReceipt> {
    return decodeG1Evaluation(this.raw.evaluate(policy));
  }

  evaluatePopulation(policies: Float64Array): PackedResult<Float64Array> {
    return decodeG1Population(this.raw.evaluate_population(policies));
  }

  trace(policy: Float64Array): PackedResult<G1TraceReceipt> {
    return decodeG1Trace(this.raw.trace(policy));
  }

  free(): void {
    this.raw.free?.();
  }
}

export async function createFrankenSimG1WalkingEvaluator(
  config: G1WalkingConfig = DEFAULT_G1_WALKING_CONFIG
): Promise<PackedResult<FrankenSimG1WalkingEvaluator>> {
  const status = await initFrankenSimOwnerKernel();
  const Evaluator = ownerModule?.G1WalkingVizEvaluator;
  if (status.source !== "wasm" || !Evaluator) {
    throw new Error(status.error ?? "Frankensim G1 owner kernel is unavailable");
  }
  const raw = new Evaluator(buildG1Config(config));
  let decoded: PackedResult<G1Admission>;
  try {
    decoded = decodeG1Admission(raw.receipt());
  } catch (error) {
    raw.free?.();
    throw error;
  }
  if ("refusal" in decoded) {
    raw.free?.();
    return decoded;
  }
  return { ok: new FrankenSimG1WalkingEvaluator(raw, decoded.ok) };
}
