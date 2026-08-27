/**
 * FrankenSim CMA-ES kernel (fs-cmaes-viz-wasm) — WASM loader + adapter.
 *
 * Loads the committed wasm-pack bundle under /wasm/fs-cmaes/ via the Blob-URL
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
 * 0.4.0 retains the audited 0.3.0 optimizer behavior and replaces only its
 * multi-megabyte JSON boundary with the schema-1 packed numeric ABI.
 */
const AUDITED_CMAES_KERNEL_VERSION = "fs-cmaes-viz-wasm 0.4.0";
const AUDITED_CMAES_KERNEL_VERSIONS = new Set([AUDITED_CMAES_KERNEL_VERSION]);

export function isCompatibleCmaesKernelVersion(version: string | null): boolean {
  return version !== null && AUDITED_CMAES_KERNEL_VERSIONS.has(version);
}

async function loadWasmModule(jsPath: string, wasmPath: string): Promise<WasmModule> {
  if (typeof window === "undefined") throw new Error("SSR context");
  const jsText = await fetch(jsPath, { signal: AbortSignal.timeout(10_000) }).then((r) => {
    if (!r.ok) throw new Error(`fetch ${jsPath}: ${r.status}`);
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
      await mod.default({ module_or_path: wasmPath });
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
      const mod = await loadWasmModule("/wasm/fs-cmaes/fs_cmaes_viz_wasm.js", "/wasm/fs-cmaes/fs_cmaes_viz_wasm_bg.wasm");
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
