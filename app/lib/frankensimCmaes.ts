import type { HouseholdKernelObstacle } from "./houseMultiObstacleKernel";

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
export function evaluateCmaesVisualizationLandscape(
  landscape: number,
  x: number[],
): number {
  switch (landscape) {
    case 0:
      return x.reduce((sum, value) => sum + value * value, 0);
    case 1: {
      let sum = 0;
      for (let index = 0; index < x.length - 1; index++) {
        sum +=
          100 * (x[index + 1] - x[index] * x[index]) ** 2 + (1 - x[index]) ** 2;
      }
      return sum;
    }
    case 2: {
      let sum = 1e6 * x[0] * x[0];
      for (let index = 1; index < x.length; index++) sum += x[index] * x[index];
      return sum;
    }
    case 3:
      return (
        10 * x.length +
        x.reduce(
          (sum, value) =>
            sum + value * value - 10 * Math.cos(2 * Math.PI * value),
          0,
        )
      );
    case 4:
      return x.reduce(
        (sum, value, index) =>
          sum + 10 ** ((6 * index) / Math.max(1, x.length - 1)) * value * value,
        0,
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
const AUDITED_CMAES_KERNEL_VERSIONS = new Set<string>([
  AUDITED_CMAES_KERNEL_VERSION,
]);

export function isCompatibleCmaesKernelVersion(
  version: string | null,
): boolean {
  return version !== null && AUDITED_CMAES_KERNEL_VERSIONS.has(version);
}

async function loadWasmModule(
  jsPath: string,
  wasmPath: string,
): Promise<WasmModule> {
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
  const runtimeLocation = new URL(globalThis.location.href);
  const isLocalFileRealm = runtimeLocation.protocol === "file:";
  if (runtimeLocation.origin === "null" && !isLocalFileRealm) {
    throw new Error("WASM loader cannot resolve the runtime origin");
  }
  // Bun's Worker test realm has no HTTP origin. Resolve its root-relative
  // public assets from the file URL installed by the Bun test-worker wrapper.
  // Keeping import.meta.url out of this client module is intentional:
  // Turbopack treats any new URL(..., import.meta.url) expression as an asset
  // import, including this test-only file-realm branch.
  const runtimeBase = isLocalFileRealm
    ? runtimeLocation.href
    : `${runtimeLocation.origin}/`;
  const resolveAssetUrl = (assetPath: string) =>
    new URL(
      isLocalFileRealm ? assetPath.replace(/^\/+/, "") : assetPath,
      runtimeBase,
    ).href;
  const jsUrl = resolveAssetUrl(jsPath);
  const wasmUrl = resolveAssetUrl(wasmPath);
  const jsText = await fetch(jsUrl, {
    signal: AbortSignal.timeout(10_000),
  }).then((r) => {
    if (!r.ok) throw new Error(`fetch ${jsUrl}: ${r.status}`);
    return r.text();
  });
  const blobUrl = URL.createObjectURL(
    new Blob([jsText], { type: "text/javascript" }),
  );
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
        "/wasm/fs-cmaes/v041/fs_cmaes_viz_wasm_bg.wasm",
      );
      if (typeof mod.cmaes_viz_run !== "function") {
        return {
          source: "ts-fallback",
          kernelVersion: null,
          error: "missing export cmaes_viz_run",
        };
      }
      const version =
        typeof mod.cmaes_viz_kernel_version === "function"
          ? mod.cmaes_viz_kernel_version()
          : null;
      if (!isCompatibleCmaesKernelVersion(version)) {
        return {
          source: "ts-fallback",
          kernelVersion: version,
          error: `unsupported CMA-ES kernel ${version ?? "unknown"}; version is not in the audited compatibility set`,
        };
      }
      fsCmaesModule = mod;
      return { source: "wasm", kernelVersion: version, error: null };
    } catch (err) {
      return {
        source: "ts-fallback",
        kernelVersion: null,
        error: err instanceof Error ? err.message : String(err),
      };
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

export type DecodedCmaesPacket =
  { ok: CmaesVizRun } | { refusal: CmaesVizRefusal };

const PACKET_MAGIC = 0x434d4131;
const PACKET_SCHEMA_VERSION = 1;
const PACKET_STATUS_OK = 0;
const PACKET_STATUS_REFUSAL = 1;
const PACKET_HEADER_WORDS = 12;
const REFUSAL_PACKET_WORDS = 5;

const PACKET_REFUSALS = new Map<number, CmaesVizRefusal>([
  [
    1,
    {
      code: "dim-out-of-range",
      message: "dim is outside the visualization domain 2..=6",
      ranked_repairs: ["set dim within 2..=6"],
    },
  ],
  [
    2,
    {
      code: "x0-non-finite",
      message: "initial mean contains a NaN or infinite coordinate",
      ranked_repairs: ["replace non-finite x0 coordinates with finite values"],
    },
  ],
  [
    3,
    {
      code: "sigma0-non-positive",
      message: "initial sigma must be finite and > 0",
      ranked_repairs: ["set sigma0 to a positive finite step size"],
    },
  ],
  [
    4,
    {
      code: "lambda-out-of-range",
      message: "lambda is outside the visualization domain 4..=48",
      ranked_repairs: ["set lambda within 4..=48"],
    },
  ],
  [
    5,
    {
      code: "generations-out-of-range",
      message: "generations is outside the visualization domain 1..=200",
      ranked_repairs: ["set generations within 1..=200"],
    },
  ],
  [
    6,
    {
      code: "landscape-unknown",
      message: "landscape id has no registered function",
      ranked_repairs: [
        "use ids 0..=4 (sphere, rosenbrock, cigar, rastrigin, elli)",
      ],
    },
  ],
  [
    7,
    {
      code: "noise-invalid",
      message: "noise must be finite and >= 0",
      ranked_repairs: ["set noise to 0 for noiseless evaluation"],
    },
  ],
  [
    8,
    {
      code: "bounds-inverted",
      message: "bounds require finite bound_min < bound_max",
      ranked_repairs: ["disable bounds or provide bound_min < bound_max"],
    },
  ],
  [
    9,
    {
      code: "f-target-invalid",
      message: "f_target must be finite or NaN (disabled)",
      ranked_repairs: ["pass NaN to disable the early-stop target"],
    },
  ],
  [
    10,
    {
      code: "eigen-decomposition-failed",
      message: "covariance repair produced non-finite eigenvalues",
      ranked_repairs: ["disable the active update", "reduce sigma0"],
    },
  ],
  [
    11,
    {
      code: "non-finite-objective",
      message: "landscape produced a non-finite value",
      ranked_repairs: ["reduce sigma0", "enable bounds repair"],
    },
  ],
]);

function packetInteger(
  packet: Float64Array,
  index: number,
  label: string,
  minimum: number,
  maximum: number,
): number {
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
  if (packet[0] !== PACKET_MAGIC)
    throw new Error("malformed CMA-ES packet: magic");
  if (packet[1] !== PACKET_SCHEMA_VERSION)
    throw new Error("malformed CMA-ES packet: schema");
  const status = packetInteger(
    packet,
    2,
    "status",
    PACKET_STATUS_OK,
    PACKET_STATUS_REFUSAL,
  );
  const declaredWords = packetInteger(
    packet,
    3,
    "total_words",
    4,
    Number.MAX_SAFE_INTEGER,
  );
  if (declaredWords !== packet.length)
    throw new Error("malformed CMA-ES packet: total_words");

  if (status === PACKET_STATUS_REFUSAL) {
    if (packet.length !== REFUSAL_PACKET_WORDS)
      throw new Error("malformed CMA-ES packet: refusal length");
    const refusalId = packetInteger(packet, 4, "refusal code", 1, 11);
    const refusal = PACKET_REFUSALS.get(refusalId);
    if (!refusal)
      throw new Error("malformed CMA-ES packet: unknown refusal code");
    return {
      refusal: { ...refusal, ranked_repairs: refusal.ranked_repairs.slice() },
    };
  }

  if (packet.length < PACKET_HEADER_WORDS)
    throw new Error("malformed CMA-ES packet: success header");
  const dim = packetInteger(packet, 4, "dim", 2, 6);
  const landscape = packetInteger(packet, 5, "landscape", 0, 4);
  const stopReasonId = packetInteger(packet, 6, "stop_reason", 0, 1);
  const bestFitness = packet[7];
  if (!Number.isFinite(bestFitness))
    throw new Error("malformed CMA-ES packet: best_f");
  const totalEvaluations = packetInteger(
    packet,
    8,
    "total_evals",
    0,
    Number.MAX_SAFE_INTEGER,
  );
  const generationCount = packetInteger(packet, 9, "generation_count", 1, 200);
  const lambda = packetInteger(packet, 10, "lambda", 4, 48);
  const generationStride = packetInteger(
    packet,
    11,
    "generation_stride",
    1,
    Number.MAX_SAFE_INTEGER,
  );
  const expectedStride = generationPacketWords(dim, lambda);
  if (generationStride !== expectedStride)
    throw new Error("malformed CMA-ES packet: generation_stride");
  const expectedWords =
    PACKET_HEADER_WORDS + 6 * dim + generationCount * generationStride;
  if (packet.length !== expectedWords)
    throw new Error("malformed CMA-ES packet: payload shape");
  if (totalEvaluations !== generationCount * lambda)
    throw new Error("malformed CMA-ES packet: total_evals mismatch");

  let cursor = PACKET_HEADER_WORDS;
  const take = (count: number, label: string): Float64Array => {
    const end = cursor + count;
    if (end > packet.length)
      throw new Error(`malformed CMA-ES packet: truncated ${label}`);
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
  const nextInteger = (
    label: string,
    minimum: number,
    maximum: number,
  ): number => {
    const value = packetInteger(packet, cursor, label, minimum, maximum);
    cursor += 1;
    return value;
  };
  const nextFinite = (label: string): number => {
    const value = packet[cursor];
    cursor += 1;
    if (!Number.isFinite(value))
      throw new Error(`malformed CMA-ES packet: ${label}`);
    return value;
  };

  const bestX = take(dim, "best_x");
  const pcaBasis = take(3 * dim, "pca_basis");
  const pcaCenter = take(dim, "pca_center");
  const pcaPoolEigenvalues = take(dim, "pca_pool_eigvals");
  const generationRows: CmaesVizGeneration[] = [];

  for (
    let generationIndex = 0;
    generationIndex < generationCount;
    generationIndex++
  ) {
    const recordStart = cursor;
    const g = nextInteger("generation", 1, generationCount);
    if (g !== generationIndex + 1)
      throw new Error("malformed CMA-ES packet: generation sequence");
    const sigma = nextFinite("sigma");
    if (sigma <= 0)
      throw new Error("malformed CMA-ES packet: non-positive sigma");
    const cond = nextFinite("condition number");
    if (cond < 1) throw new Error("malformed CMA-ES packet: condition number");
    const generationBest = nextFinite("generation best_f");
    const evals = nextInteger("generation evals", lambda, totalEvaluations);
    if (evals !== g * lambda)
      throw new Error("malformed CMA-ES packet: generation eval mismatch");
    const mean = take(dim, "mean");
    const eigvals = take(dim, "eigvals");
    for (let index = 0; index < eigvals.length; index++) {
      if (
        eigvals[index] <= 0 ||
        (index > 0 && eigvals[index] < eigvals[index - 1])
      ) {
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
      if (sf[index] < sf[index - 1])
        throw new Error("malformed CMA-ES packet: unranked sf");
    }
    const se = take(lambda, "se");
    let sawNonElite = false;
    let eliteCount = 0;
    for (const elite of se) {
      if (elite !== 0 && elite !== 1)
        throw new Error("malformed CMA-ES packet: se");
      if (elite === 0) sawNonElite = true;
      else {
        if (sawNonElite)
          throw new Error("malformed CMA-ES packet: non-prefix elites");
        eliteCount += 1;
      }
    }
    if (eliteCount < 1 || eliteCount >= lambda)
      throw new Error("malformed CMA-ES packet: elite count");
    const pSigma = take(dim, "p_sigma");
    const pC = take(dim, "p_c");
    if (cursor - recordStart !== generationStride)
      throw new Error("malformed CMA-ES packet: generation width");

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
  if (cursor !== packet.length)
    throw new Error("malformed CMA-ES packet: trailing words");

  return {
    ok: {
      kernel: AUDITED_CMAES_KERNEL_VERSION,
      dim,
      landscape,
      stop_reason:
        stopReasonId === 0 ? "generations-exhausted" : "target-reached",
      best_f: bestFitness,
      best_x: bestX,
      total_evals: totalEvaluations,
      generations: generationRows,
      pca_basis: pcaBasis,
      pca_center: pcaCenter,
      pca_pool_eigvals: pcaPoolEigenvalues,
      [PACKED_RUN_MARKER]: true,
    },
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
  const x = [
    params.x0[0] ?? 0,
    params.x0[1] ?? 0,
    params.x0[2] ?? 0,
    params.x0[3] ?? 0,
    params.x0[4] ?? 0,
    params.x0[5] ?? 0,
  ];
  try {
    const packet = mod.cmaes_viz_run(
      params.dim,
      x[0],
      x[1],
      x[2],
      x[3],
      x[4],
      x[5],
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
      params.fTarget,
    );
    const decoded = decodeCmaesPacket(packet);
    if ("ok" in decoded) return decoded.ok;
    console.warn(
      "[fs-cmaes] kernel refusal:",
      decoded.refusal.code,
      decoded.refusal.message,
    );
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
  principalAxes3D: [
    [number, number, number],
    [number, number, number],
    [number, number, number],
  ];
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
function projectPoint(
  point: ArrayLike<number>,
  basis: ArrayLike<number>,
  center: ArrayLike<number>,
  n: number,
): [number, number, number] {
  const out: [number, number, number] = [0, 0, 0];
  for (let r = 0; r < 3; r++) {
    let acc = 0;
    for (let i = 0; i < n; i++)
      acc += basis[r * n + i] * (point[i] - center[i]);
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
function projectDirection(
  vec: ArrayLike<number>,
  basis: ArrayLike<number>,
  n: number,
): [number, number, number] {
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
  for (let index = 0; index < values.length; index++)
    copy[index] = values[index];
  return copy;
}

function copyNumericSlice(
  values: NumericVector,
  start: number,
  end: number,
): number[] {
  const copy = new Array<number>(end - start);
  for (let index = start; index < end; index++)
    copy[index - start] = values[index];
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
  for (let index = 0; index < pool.length; index++)
    poolSum += Math.max(pool[index], 0);
  poolSum ||= 1;
  // Top-3 pooled eigenvalues (largest last in the ascending spectrum).
  const top3 = [
    pool[pool.length - 1] ?? 0,
    pool[pool.length - 2] ?? 0,
    pool[pool.length - 3] ?? 0,
  ];
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
    for (let index = 0; index < gen.se.length; index++)
      selectedCount += Number(gen.se[index] === 1);
    const eliteCount =
      selectedCount > 0 && selectedCount < lambda
        ? selectedCount
        : Math.floor(lambda / 2);

    const generationBestIndex = sortedIndices[0];
    const generationBestFitness = gen.sf[generationBestIndex];
    if (
      Number.isFinite(generationBestFitness) &&
      generationBestFitness < runningBestObservedFitness
    ) {
      runningBestObservedFitness = generationBestFitness;
      runningBestX = copyNumericSlice(
        gen.sx,
        generationBestIndex * n,
        (generationBestIndex + 1) * n,
      );
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
        projected3D: [
          p[0] - projMean[0],
          p[1] - projMean[1],
          p[2] - projMean[2],
        ],
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
    const projectedEigenvalues = Array.from(gen.proj_eigvals, (value) =>
      Math.max(value, 0),
    );
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
    const principalAxes3D: [
      [number, number, number],
      [number, number, number],
      [number, number, number],
    ] = [col(2), col(1), col(0)];
    const projCond =
      projectedEigenvalues[0] > 0
        ? projectedEigenvalues[2] / projectedEigenvalues[0]
        : Infinity;
    const evolutionPath3D = projectDirection(gen.p_c, basis, n);
    const evolutionPathSigma3D = projectDirection(gen.p_sigma, basis, n);

    // Full covariance for HUD/telemetry consumers (V·Λ·Vᵀ).
    const covariance: number[][] = Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, k) => {
        let acc = 0;
        for (let j = 0; j < n; j++)
          acc +=
            eigenvalues[j] * gen.eigvecs[i * n + j] * gen.eigvecs[k * n + j];
        return acc;
      }),
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
      bestX:
        generationIndex === run.generations.length - 1
          ? copyNumericVector(run.best_x)
          : runningBestX.slice(),
      eigenvalues: [...eigenvalues].reverse(),
      conditionNumber,
      evalCount: gen.evals,
      phaseSpace3D: {
        projectedMean: [gen.proj_mean[0], gen.proj_mean[1], gen.proj_mean[2]],
        ellipsoidRadii: radii,
        principalAxes3D,
        eigenvalues: [
          projectedEigenvalues[2],
          projectedEigenvalues[1],
          projectedEigenvalues[0],
        ],
        conditionNumber: projCond,
        varianceExplainedPercent: varianceExplained,
        evolutionPath3D,
        evolutionPathSigma3D,
      },
      // Per-coordinate sampling variance of N(m, sigma^2 C) is sigma^2 * C_ii
      // (eigenvalues would be variance per principal axis, a different thing).
      variancePerDim: covariance.map(
        (row, i) => gen.sigma * gen.sigma * Math.max(row[i], 0),
      ),
    };
  });
}

// ---------------------------------------------------------------------------
// Owner CMA-family + robotics boundary (CMA schema 2 / G1 schema 7 / arm schema 2).
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

const G1_MAGIC = 0x47315737;
// Schema 8 (owner 0.6.15): the walking config carries a variable-length
// roster of keep-out boxes, and the receipt reports the deepest body
// penetration the owner's obstacle guard measured.
const G1_SCHEMA = 8;
const G1_CONFIG_FIXED_WORDS = 12;
const G1_OBSTACLE_WORDS = 8;
export const G1_MAX_OBSTACLES = 64;
const G1_KIND_CONFIG = 0;
const G1_KIND_ADMISSION = 1;
const G1_KIND_EVALUATION = 2;
const G1_KIND_TRACE = 3;
const G1_KIND_POPULATION = 4;
const G1_POLICY_DIMENSION = 5_040;
const G1_LINK_COUNT = 30;
const G1_POSE_WORDS = 7;
const G1_TRACE_SAMPLE_WORDS = 213;

const ARM_MAGIC = 0x41524d31;
// Schema 3 (owner 0.6.14): the config packet carries an object-mass
// override, Coulomb friction coefficients, and a variable-length roster of
// extra obstacle boxes; the admission echoes the effective friction and the
// extra-obstacle count in three trailing words.
const ARM_SCHEMA = 3;
const ARM_CONFIG_FIXED_WORDS = 12;
const ARM_OBSTACLE_WORDS = 7;
export const ARM_MAX_EXTRA_OBSTACLES = 32;
const ARM_KIND_CONFIG = 0;
const ARM_KIND_ADMISSION = 1;
const ARM_KIND_EVALUATION = 2;
const ARM_KIND_TRACE = 3;
const ARM_KIND_POPULATION = 4;
const ARM_POLICY_DIMENSION = 128;
const ARM_JOINT_COUNT = 7;
const ARM_POLICY_KNOTS = 16;
const ARM_LINK_COUNT = 8;
const ARM_POSE_WORDS = 7;
const ARM_TRACE_SAMPLE_WORDS = 67;
const ARM_ADMISSION_WORDS = 40;
const ARM_RECEIPT_WORDS = 22;

export const FRANKENSIM_OWNER_KERNEL_VERSION = "fs-cmaes-viz-wasm 0.6.18";

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
  "query-owner",
] as const;

const ARM_REFUSAL_NAMES = [
  "unknown",
  "malformed-packet",
  "schema-mismatch",
  "invalid-config",
  "parameter-count",
  "non-finite-parameter",
  "robot-owner",
  "geometry-owner",
  "contact-owner",
  "friction-owner",
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
  samplingOrder:
    "linear" | "memory-linear" | "memory-quadratic" | "quadratic" | "cubic";
  updateOrder:
    "linear" | "memory-linear" | "memory-quadratic" | "quadratic" | "cubic";
  persistentScalars: number;
  pendingGenerationScalars: number;
  updateWorkspaceScalars: number;
  denseMatrixEntries: number;
  memoryCapacity: number;
  best: null | {
    objective: number;
    generation: number;
    candidate: number;
    point: Float64Array;
  };
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
  stabilizing_policy_mean: () => Float64Array;
  walking_curriculum_mean: () => Float64Array;
  evaluate: (policy: Float64Array) => Float64Array;
  evaluate_population: (policies: Float64Array) => Float64Array;
  trace: (policy: Float64Array) => Float64Array;
  free?: () => void;
};

type RawManipulationEvaluator = {
  receipt: () => Float64Array;
  curriculum_policy_mean: () => Float64Array;
  evaluate: (policy: Float64Array) => Float64Array;
  evaluate_population: (policies: Float64Array) => Float64Array;
  trace: (policy: Float64Array) => Float64Array;
  free?: () => void;
};

type OwnerWasmModule = WasmModule & {
  CmaesVizSession?: new (config: Float64Array) => RawCmaSession;
  G1WalkingVizEvaluator?: new (config: Float64Array) => RawG1Evaluator;
  HouseholdManipulationVizEvaluator?: new (
    config: Float64Array,
  ) => RawManipulationEvaluator;
};

let ownerModule: OwnerWasmModule | null = null;
let ownerLoadPromise: Promise<OwnerKernelStatus> | null = null;

/** Load and probe the CMA-2 / G1-7 / household-arm-2 owner package once per realm. */
export function initFrankenSimOwnerKernel(): Promise<OwnerKernelStatus> {
  if (ownerLoadPromise) return ownerLoadPromise;
  ownerLoadPromise = (async (): Promise<OwnerKernelStatus> => {
    try {
      const loaded = (await loadWasmModule(
      "/wasm/fs-cmaes/v0618/fs_cmaes_viz_wasm.js",
      "/wasm/fs-cmaes/v0618/fs_cmaes_viz_wasm_bg.wasm",
      )) as OwnerWasmModule;
      const version =
        typeof loaded.cmaes_viz_kernel_version === "function"
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
        typeof loaded.G1WalkingVizEvaluator !== "function" ||
        typeof loaded.HouseholdManipulationVizEvaluator !== "function"
      ) {
        return {
          source: "unavailable",
          kernelVersion: version,
          error: "owner package is missing a CMA, G1, or household-arm export",
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
  maximum = Number.MAX_SAFE_INTEGER,
): number {
  if (index >= packet.length)
    throw new Error(`malformed packed packet: missing ${label}`);
  const value = packet[index];
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) {
    throw new Error(`malformed packed packet: ${label}`);
  }
  return value;
}

function finitePacketNumber(
  packet: Float64Array,
  index: number,
  label: string,
): number {
  if (index >= packet.length || !Number.isFinite(packet[index])) {
    throw new Error(`malformed packed packet: ${label}`);
  }
  return packet[index];
}

function finitePacketView(
  packet: Float64Array,
  start: number,
  count: number,
  label: string,
): Float64Array {
  const end = start + count;
  if (!Number.isSafeInteger(end) || end > packet.length) {
    throw new Error(`malformed packed packet: truncated ${label}`);
  }
  const values = packet.subarray(start, end);
  for (let index = 0; index < values.length; index++) {
    if (!Number.isFinite(values[index]))
      throw new Error(`malformed packed packet: ${label}`);
  }
  return values;
}

function decodeCommonOutput(
  packet: Float64Array,
  magic: number,
  schema: number,
  expectedKind: number,
  refusalNames: readonly string[],
): { payloadStart: 5 } | { refusal: PackedOwnerRefusal } {
  if (!(packet instanceof Float64Array) || packet.length < 5) {
    throw new Error("malformed packed packet: expected Float64Array header");
  }
  if (packet[0] !== magic) throw new Error("malformed packed packet: magic");
  if (packet[1] !== schema) throw new Error("malformed packed packet: schema");
  const status = exactPacketInteger(packet, 2, "status", 0, 1);
  const kind = exactPacketInteger(packet, 3, "kind", 0, 4);
  if (kind !== expectedKind)
    throw new Error("malformed packed packet: unexpected kind");
  const totalWords = exactPacketInteger(packet, 4, "total words", 5);
  if (totalWords !== packet.length)
    throw new Error("malformed packed packet: total words");
  if (status === 0) return { payloadStart: 5 };
  if (packet.length !== 7)
    throw new Error("malformed packed packet: refusal length");
  const code = exactPacketInteger(
    packet,
    5,
    "refusal code",
    1,
    refusalNames.length - 1,
  );
  const rawDetail = packet[6];
  const detail = Number.isNaN(rawDetail)
    ? null
    : exactPacketInteger(packet, 6, "refusal detail");
  return { refusal: { code, name: refusalNames[code] ?? "unknown", detail } };
}

function decodeCmaOutputHeader(
  packet: Float64Array,
  expectedKind: number,
): { payloadStart: 5 } | { refusal: PackedOwnerRefusal } {
  return decodeCommonOutput(
    packet,
    OWNER_CMA_MAGIC,
    OWNER_CMA_SCHEMA,
    expectedKind,
    CMA_REFUSAL_NAMES,
  );
}

const COMPLEXITY_NAMES = [
  "linear",
  "memory-linear",
  "quadratic",
  "cubic",
  "memory-quadratic",
] as const;

/** Strictly decode an admission or post-tell snapshot without inventing diagnostics. */
export function decodeCmaFamilySnapshot(
  packet: Float64Array,
  expectedKind:
    typeof OWNER_CMA_KIND_ADMISSION | typeof OWNER_CMA_KIND_SNAPSHOT,
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
  if (sigma <= 0)
    throw new Error("malformed packed packet: non-positive sigma");
  const population = exactPacketInteger(packet, 10, "population", 4);
  const parents = exactPacketInteger(packet, 11, "parents", 1, population - 1);
  const maxGenerations = exactPacketInteger(packet, 12, "max generations", 1);
  const admittedEvaluations = exactPacketInteger(
    packet,
    13,
    "admitted evaluations",
    population,
  );
  if (
    admittedEvaluations !== maxGenerations * population ||
    evaluations !== generation * population ||
    generation > maxGenerations
  ) {
    throw new Error("malformed packed packet: budget receipt");
  }
  const streamSemantics = exactPacketInteger(
    packet,
    14,
    "stream semantics",
    1,
    0xffff_ffff,
  );
  const streamKernel = exactPacketInteger(
    packet,
    15,
    "stream kernel",
    1,
    0xffff_ffff,
  );
  const normalLow = exactPacketInteger(
    packet,
    16,
    "normal blocks low",
    0,
    0xffff_ffff,
  );
  const normalHigh = exactPacketInteger(
    packet,
    17,
    "normal blocks high",
    0,
    0xffff_ffff,
  );
  const samplingOrderId = exactPacketInteger(
    packet,
    18,
    "sampling order",
    0,
    4,
  );
  const updateOrderId = exactPacketInteger(packet, 19, "update order", 0, 4);
  const persistentScalars = exactPacketInteger(
    packet,
    20,
    "persistent scalars",
  );
  const pendingGenerationScalars = exactPacketInteger(
    packet,
    21,
    "pending scalars",
  );
  const updateWorkspaceScalars = exactPacketInteger(
    packet,
    22,
    "workspace scalars",
  );
  const denseMatrixEntries = exactPacketInteger(packet, 23, "dense entries");
  const memoryCapacity = exactPacketInteger(packet, 24, "memory capacity");
  const hasBest = exactPacketInteger(packet, 25, "has best", 0, 1) === 1;
  const shapeKind = exactPacketInteger(packet, 29, "shape kind", 0, 2);
  const shapeWords = exactPacketInteger(packet, 30, "shape words");
  const expectedWords = OWNER_CMA_SNAPSHOT_WORDS + 2 * dimension + shapeWords;
  if (packet.length !== expectedWords)
    throw new Error("malformed packed packet: snapshot shape");
  const expectedSamplingOrder =
    family === "full" ? 2 : family === "separable" ? 0 : 1;
  const expectedUpdateOrder =
    family === "full"
      ? 3
      : family === "separable"
        ? 0
        : family === "lm-cma"
          ? 4
          : 1;
  if (
    samplingOrderId !== expectedSamplingOrder ||
    updateOrderId !== expectedUpdateOrder
  ) {
    throw new Error("malformed packed packet: family complexity");
  }
  if (
    // The full owner retains both C and its cached eigensystem/root, hence two
    // dense n-by-n stores. Other families truthfully report no dense matrix.
    (family === "full" &&
      (denseMatrixEntries !== 2 * dimension * dimension ||
        memoryCapacity !== 0)) ||
    (family === "separable" &&
      (denseMatrixEntries !== 0 || memoryCapacity !== 0)) ||
    ((family === "lm-cma" || family === "lm-ma") &&
      (denseMatrixEntries !== 0 || memoryCapacity === 0))
  ) {
    throw new Error("malformed packed packet: family storage");
  }

  const mean = finitePacketView(
    packet,
    OWNER_CMA_SNAPSHOT_WORDS,
    dimension,
    "mean",
  );
  const bestPointStart = OWNER_CMA_SNAPSHOT_WORDS + dimension;
  let best: CmaFamilySnapshot["best"] = null;
  if (hasBest) {
    best = {
      objective: finitePacketNumber(packet, 26, "best objective"),
      generation: exactPacketInteger(
        packet,
        27,
        "best generation",
        0,
        generation,
      ),
      candidate: exactPacketInteger(
        packet,
        28,
        "best candidate",
        0,
        population - 1,
      ),
      point: finitePacketView(packet, bestPointStart, dimension, "best point"),
    };
  } else {
    if (
      !Number.isNaN(packet[26]) ||
      !Number.isNaN(packet[27]) ||
      !Number.isNaN(packet[28])
    ) {
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
    const negativeWeightCount = exactPacketInteger(
      packet,
      shapeStart,
      "negative weights",
    );
    const minimumEigenvalue = finitePacketNumber(
      packet,
      shapeStart + 1,
      "minimum eigenvalue",
    );
    const maximumEigenvalue = finitePacketNumber(
      packet,
      shapeStart + 2,
      "maximum eigenvalue",
    );
    if (minimumEigenvalue <= 0 || maximumEigenvalue < minimumEigenvalue) {
      throw new Error("malformed packed packet: full spectrum");
    }
    const covarianceDiagonal = finitePacketView(
      packet,
      shapeStart + 3,
      dimension,
      "covariance diagonal",
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
    const variances = finitePacketView(
      packet,
      shapeStart + 1,
      dimension,
      "variances",
    );
    if (variances.some((value) => value <= 0)) {
      throw new Error("malformed packed packet: diagonal variances");
    }
    shape = {
      kind: "diagonal",
      negativeWeightCount: exactPacketInteger(
        packet,
        shapeStart,
        "negative weights",
      ),
      variances,
    };
  } else {
    if ((family !== "lm-cma" && family !== "lm-ma") || shapeWords < 2) {
      throw new Error("malformed packed packet: limited-memory shape");
    }
    const storedVectors = exactPacketInteger(
      packet,
      shapeStart,
      "stored vectors",
      0,
      memoryCapacity,
    );
    const capacity = exactPacketInteger(
      packet,
      shapeStart + 1,
      "shape capacity",
      1,
    );
    if (capacity !== memoryCapacity || shapeWords !== storedVectors + 2) {
      throw new Error("malformed packed packet: limited-memory payload");
    }
    const directionNorms = finitePacketView(
      packet,
      shapeStart + 2,
      storedVectors,
      "direction norms",
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
export function decodeCmaFamilyAsk(
  packet: Float64Array,
): PackedResult<CmaFamilyAsk> {
  const header = decodeCmaOutputHeader(packet, OWNER_CMA_KIND_ASK);
  if ("refusal" in header) return header;
  if (packet.length < 9) throw new Error("malformed packed packet: ask header");
  const generation = exactPacketInteger(packet, 5, "generation");
  const evaluationsBefore = exactPacketInteger(packet, 6, "evaluations before");
  const dimension = exactPacketInteger(packet, 7, "dimension", 1, 100_000);
  const population = exactPacketInteger(packet, 8, "population", 4, 64_000);
  const candidateWords = dimension * population;
  if (
    !Number.isSafeInteger(candidateWords) ||
    packet.length !== 9 + candidateWords
  ) {
    throw new Error("malformed packed packet: ask shape");
  }
  const candidates = finitePacketView(packet, 9, candidateWords, "candidates");
  return {
    ok: { generation, evaluationsBefore, dimension, population, candidates },
  };
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
  for (let index = 0; index < dimension; index++)
    packet[12 + index] = config.mean[index];
  return packet;
}

function buildTellPacket(
  generation: number,
  objectives: ArrayLike<number>,
): Float64Array {
  const packet = new Float64Array(6 + objectives.length);
  packet.set([
    OWNER_CMA_MAGIC,
    OWNER_CMA_SCHEMA,
    OWNER_CMA_KIND_TELL,
    packet.length,
    generation,
    objectives.length,
  ]);
  for (let index = 0; index < objectives.length; index++)
    packet[6 + index] = objectives[index];
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

  tell(
    generation: number,
    objectives: ArrayLike<number>,
  ): PackedResult<CmaFamilySnapshot> {
    return decodeCmaFamilySnapshot(
      this.raw.tell(buildTellPacket(generation, objectives)),
      OWNER_CMA_KIND_SNAPSHOT,
    );
  }

  free(): void {
    this.raw.free?.();
  }
}

export async function createFrankenSimCmaFamilySession(
  config: CmaFamilyConfig,
): Promise<PackedResult<FrankenSimCmaFamilySession>> {
  const status = await initFrankenSimOwnerKernel();
  const Session = ownerModule?.CmaesVizSession;
  if (status.source !== "wasm" || !Session) {
    throw new Error(
      status.error ?? "Frankensim owner CMA kernel is unavailable",
    );
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
  task: G1Task;
  challenge: G1Challenge;
  stepSeconds: number;
  durationSeconds: number;
  targetSpeed: number;
  gaitFrequency: number;
  traceStride: number;
  /**
   * Solid keep-out boxes the body may not pass through, in the owner frame
   * relative to the robot's start. At most G1_MAX_OBSTACLES.
   */
  obstacles?: readonly HouseholdKernelObstacle[];
}

export type G1Task = "balance" | "stepping" | "walking";
export type G1Challenge = "flat" | "terrain-and-push";

const G1_TASK_IDS: Record<G1Task, number> = {
  balance: 0,
  stepping: 1,
  walking: 2,
};

const G1_TASK_NAMES = ["balance", "stepping", "walking"] as const;
const G1_CHALLENGE_IDS: Record<G1Challenge, number> = {
  flat: 0,
  "terrain-and-push": 1,
};
const G1_CHALLENGE_NAMES = ["flat", "terrain-and-push"] as const;

export const DEFAULT_G1_WALKING_CONFIG: G1WalkingConfig = {
  task: "walking",
  challenge: "terrain-and-push",
  stepSeconds: 1 / 480,
  durationSeconds: 1.5,
  targetSpeed: 0.65,
  gaitFrequency: 1.55,
  traceStride: 12,
};

export interface G1Admission {
  policyDimension: 5_040;
  linkCount: 30;
  poseWords: 7;
  traceSampleWords: 213;
  config: G1WalkingConfig;
  terrainAmplitudeMeters: number;
  terrainWavenumberRadiansPerMeter: number;
  pushStartSeconds: number;
  pushEndSeconds: number;
  pushPeakForceNewtons: number;
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
  backwardDistanceMeters: number;
  lateralErrorIntegral: number;
  headingErrorIntegral: number;
  contactScheduleMismatchIntegral: number;
  swingClearanceErrorIntegral: number;
  singleSupportSeconds: number;
  doubleSupportSeconds: number;
  flightSeconds: number;
  pushImpulseNewtonSeconds: number;
  recoveryTimeSeconds: number;
  minimumBaseHeightMeters: number;
  maximumTiltSine: number;
  maximumAbsoluteTerrainHeightMeters: number;
  completedSteps: number;
  terminationReason: G1TerminationReason;
  /** Deepest body-sphere penetration the owner's obstacle guard measured [m]. */
  maximumBodyPenetrationMeters: number;
}

export type G1TerminationReason =
  | "horizon"
  | "base height"
  | "base tilt"
  | "contact indentation"
  | "contact speed"
  | "contact model"
  | "joint position limit"
  // Schema 8: the body-vs-obstacle guard fired on a declared keep-out box.
  | "body obstacle";

const G1_TERMINATION_REASONS: readonly G1TerminationReason[] = [
  "horizon",
  "base height",
  "base tilt",
  "contact indentation",
  "contact speed",
  "contact model",
  "joint position limit",
  "body obstacle",
];

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

/**
 * Schema-8 walking config packet:
 *   [0..3]  magic, schema, kind, wordCount = 12 + 7n
 *   [4..10] stepSeconds, durationSeconds, targetSpeed, gaitFrequency,
 *           traceStride, task, challenge
 *   [11]    n = keep-out box count (0..64)
 *   then n x [cx, cy, cz, hx, hy, hz, yaw] in the owner frame (z up),
 *   expressed RELATIVE TO THE ROBOT'S START, because the owner always
 *   begins its rollout at the origin while the browser seats the rendered
 *   robot elsewhere in the house.
 */
export function buildG1Config(config: G1WalkingConfig): Float64Array {
  const obstacles = config.obstacles ?? [];
  if (obstacles.length > G1_MAX_OBSTACLES) {
    throw new Error(
      `G1 config: ${obstacles.length} obstacles exceeds the owner cap of ${G1_MAX_OBSTACLES}`,
    );
  }
  const words = new Float64Array(
    G1_CONFIG_FIXED_WORDS + G1_OBSTACLE_WORDS * obstacles.length,
  );
  words.set([
    G1_MAGIC,
    G1_SCHEMA,
    G1_KIND_CONFIG,
    words.length,
    config.stepSeconds,
    config.durationSeconds,
    config.targetSpeed,
    config.gaitFrequency,
    config.traceStride,
    G1_TASK_IDS[config.task],
    G1_CHALLENGE_IDS[config.challenge],
    obstacles.length,
  ]);
  obstacles.forEach((obstacle, index) => {
    const base = G1_CONFIG_FIXED_WORDS + G1_OBSTACLE_WORDS * index;
    const { centerMeters: c, halfExtentsMeters: h, yawRad } = obstacle;
    if (
      !c.every(Number.isFinite) ||
      !h.every(Number.isFinite) ||
      !Number.isFinite(yawRad) ||
      h.some((value) => value <= 0)
    ) {
      throw new Error(
        `G1 config: obstacle ${index} (${obstacle.name}) is outside the owner envelope`,
      );
    }
    words.set(
      [c[0], c[1], c[2], h[0], h[1], h[2], yawRad, obstacle.role === "support" ? 1 : 0],
      base,
    );
  });
  return words;
}

function decodeG1Header(
  packet: Float64Array,
  expectedKind: number,
): { payloadStart: 5 } | { refusal: PackedOwnerRefusal } {
  return decodeCommonOutput(
    packet,
    G1_MAGIC,
    G1_SCHEMA,
    expectedKind,
    G1_REFUSAL_NAMES,
  );
}

export function decodeG1Admission(
  packet: Float64Array,
): PackedResult<G1Admission> {
  const header = decodeG1Header(packet, G1_KIND_ADMISSION);
  if ("refusal" in header) return header;
  if (packet.length !== 21)
    throw new Error("malformed G1 packet: admission length");
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
  const taskId = exactPacketInteger(
    packet,
    14,
    "task",
    0,
    G1_TASK_NAMES.length - 1,
  );
  const task = G1_TASK_NAMES[taskId];
  if (!task) throw new Error("malformed G1 packet: task");
  const challengeId = exactPacketInteger(
    packet,
    15,
    "challenge",
    0,
    G1_CHALLENGE_NAMES.length - 1,
  );
  const challenge = G1_CHALLENGE_NAMES[challengeId];
  if (!challenge) throw new Error("malformed G1 packet: challenge");
  const terrainAmplitudeMeters = finitePacketNumber(
    packet,
    16,
    "terrain amplitude",
  );
  const terrainWavenumberRadiansPerMeter = finitePacketNumber(
    packet,
    17,
    "terrain wavenumber",
  );
  const pushStartSeconds = finitePacketNumber(packet, 18, "push start");
  const pushEndSeconds = finitePacketNumber(packet, 19, "push end");
  const pushPeakForceNewtons = finitePacketNumber(
    packet,
    20,
    "push peak force",
  );
  if (
    stepSeconds < 1 / 480 ||
    stepSeconds > 1 / 30 ||
    durationSeconds < stepSeconds ||
    durationSeconds > 4 ||
    targetSpeed < 0 ||
    targetSpeed > 2 ||
    gaitFrequency < 0.25 ||
    gaitFrequency > 4 ||
    Math.round(durationSeconds / stepSeconds) > 10_000 ||
    terrainAmplitudeMeters < 0 ||
    terrainWavenumberRadiansPerMeter <= 0 ||
    pushStartSeconds < 0 ||
    pushEndSeconds <= pushStartSeconds ||
    pushEndSeconds > durationSeconds ||
    pushPeakForceNewtons < 0
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
        task,
        challenge,
        stepSeconds,
        durationSeconds,
        targetSpeed,
        gaitFrequency,
        traceStride,
      },
      terrainAmplitudeMeters,
      terrainWavenumberRadiansPerMeter,
      pushStartSeconds,
      pushEndSeconds,
      pushPeakForceNewtons,
    },
  };
}

function decodeG1ReceiptPayload(packet: Float64Array): G1ObjectiveReceipt {
  if (packet.length < 28)
    throw new Error("malformed G1 packet: objective receipt");
  const terminationId = exactPacketInteger(
    packet,
    27,
    "termination reason",
    0,
    G1_TERMINATION_REASONS.length - 1,
  );
  const terminationReason = G1_TERMINATION_REASONS[terminationId];
  if (!terminationReason)
    throw new Error("malformed G1 packet: termination reason");
  const receipt = {
    objective: finitePacketNumber(packet, 5, "objective"),
    distanceMeters: finitePacketNumber(packet, 6, "distance"),
    speedErrorIntegral: finitePacketNumber(packet, 7, "speed error"),
    actuatorWorkJoules: finitePacketNumber(packet, 8, "actuator work"),
    slipIntegral: finitePacketNumber(packet, 9, "slip"),
    postureIntegral: finitePacketNumber(packet, 10, "posture"),
    jointLimitIntegral: finitePacketNumber(packet, 11, "joint limit"),
    impactIntegral: finitePacketNumber(packet, 12, "impact"),
    backwardDistanceMeters: finitePacketNumber(packet, 13, "backward distance"),
    lateralErrorIntegral: finitePacketNumber(packet, 14, "lateral error"),
    headingErrorIntegral: finitePacketNumber(packet, 15, "heading error"),
    contactScheduleMismatchIntegral: finitePacketNumber(
      packet,
      16,
      "contact schedule mismatch",
    ),
    swingClearanceErrorIntegral: finitePacketNumber(
      packet,
      17,
      "swing clearance error",
    ),
    singleSupportSeconds: finitePacketNumber(packet, 18, "single support"),
    doubleSupportSeconds: finitePacketNumber(packet, 19, "double support"),
    flightSeconds: finitePacketNumber(packet, 20, "flight"),
    pushImpulseNewtonSeconds: finitePacketNumber(packet, 21, "push impulse"),
    recoveryTimeSeconds: finitePacketNumber(packet, 22, "recovery time"),
    minimumBaseHeightMeters: finitePacketNumber(
      packet,
      23,
      "minimum base height",
    ),
    maximumTiltSine: finitePacketNumber(packet, 24, "maximum tilt sine"),
    maximumAbsoluteTerrainHeightMeters: finitePacketNumber(
      packet,
      25,
      "maximum terrain height",
    ),
    completedSteps: exactPacketInteger(
      packet,
      26,
      "completed steps",
      0,
      10_000,
    ),
    terminationReason,
    // Schema 8: the deepest body-sphere penetration the owner's obstacle
    // guard measured over the rollout. Zero when no boxes were declared.
    maximumBodyPenetrationMeters: finitePacketNumber(
      packet,
      28,
      "maximum body penetration",
    ),
  };
  if (
    receipt.speedErrorIntegral < 0 ||
    receipt.actuatorWorkJoules < 0 ||
    receipt.slipIntegral < 0 ||
    receipt.postureIntegral < 0 ||
    receipt.jointLimitIntegral < 0 ||
    receipt.impactIntegral < 0 ||
    receipt.backwardDistanceMeters < 0 ||
    receipt.lateralErrorIntegral < 0 ||
    receipt.headingErrorIntegral < 0 ||
    receipt.contactScheduleMismatchIntegral < 0 ||
    receipt.swingClearanceErrorIntegral < 0 ||
    receipt.singleSupportSeconds < 0 ||
    receipt.doubleSupportSeconds < 0 ||
    receipt.flightSeconds < 0 ||
    receipt.pushImpulseNewtonSeconds < 0 ||
    receipt.recoveryTimeSeconds < 0 ||
    receipt.minimumBaseHeightMeters < 0 ||
    receipt.maximumTiltSine < 0 ||
    receipt.maximumTiltSine > 1 ||
    receipt.maximumAbsoluteTerrainHeightMeters < 0 ||
    receipt.maximumBodyPenetrationMeters < 0
  ) {
    throw new Error("malformed G1 packet: negative integral");
  }
  return receipt;
}

export function decodeG1Evaluation(
  packet: Float64Array,
): PackedResult<G1ObjectiveReceipt> {
  const header = decodeG1Header(packet, G1_KIND_EVALUATION);
  if ("refusal" in header) return header;
  // Schema 8: 5 header words + 24 receipt words (the last is the obstacle
  // guard's deepest measured body penetration).
  if (packet.length !== 29)
    throw new Error("malformed G1 packet: evaluation length");
  return { ok: decodeG1ReceiptPayload(packet) };
}

export function decodeG1Population(
  packet: Float64Array,
): PackedResult<Float64Array> {
  const header = decodeG1Header(packet, G1_KIND_POPULATION);
  if ("refusal" in header) return header;
  if (packet.length < 7)
    throw new Error("malformed G1 packet: population length");
  const population = exactPacketInteger(packet, 5, "population", 1, 64);
  if (packet.length !== 6 + population)
    throw new Error("malformed G1 packet: population shape");
  return {
    ok: finitePacketView(packet, 6, population, "population objectives"),
  };
}

export function decodeG1Trace(
  packet: Float64Array,
): PackedResult<G1TraceReceipt> {
  const header = decodeG1Header(packet, G1_KIND_TRACE);
  if ("refusal" in header) return header;
  const receipt = decodeG1ReceiptPayload(packet);
  const sampleCount = exactPacketInteger(packet, 29, "trace sample count");
  if (packet.length !== 30 + sampleCount * G1_TRACE_SAMPLE_WORDS) {
    throw new Error("malformed G1 packet: trace shape");
  }
  const samples: G1TraceSample[] = [];
  let cursor = 30;
  let previousTime = -Infinity;
  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex++) {
    const timeSeconds = finitePacketNumber(packet, cursor, "trace time");
    if (timeSeconds < previousTime)
      throw new Error("malformed G1 packet: trace time order");
    previousTime = timeSeconds;
    const leftContact =
      exactPacketInteger(packet, cursor + 1, "left contact", 0, 1) === 1;
    const rightContact =
      exactPacketInteger(packet, cursor + 2, "right contact", 0, 1) === 1;
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

  stabilizingPolicyMean(): Float64Array {
    const mean = this.raw.stabilizing_policy_mean();
    if (
      mean.length !== this.admission.policyDimension ||
      mean.some((value) => !Number.isFinite(value))
    ) {
      throw new Error("malformed G1 stabilizing policy mean");
    }
    return mean;
  }

  walkingCurriculumMean(): Float64Array {
    const mean = this.raw.walking_curriculum_mean();
    if (
      mean.length !== this.admission.policyDimension ||
      mean.some((value) => !Number.isFinite(value))
    ) {
      throw new Error("malformed G1 walking curriculum mean");
    }
    return mean;
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
  config: G1WalkingConfig = DEFAULT_G1_WALKING_CONFIG,
): Promise<PackedResult<FrankenSimG1WalkingEvaluator>> {
  const status = await initFrankenSimOwnerKernel();
  const Evaluator = ownerModule?.G1WalkingVizEvaluator;
  if (status.source !== "wasm" || !Evaluator) {
    throw new Error(
      status.error ?? "Frankensim G1 owner kernel is unavailable",
    );
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

export type HouseholdManipulationTask =
  "kitchen-mug" | "living-room-remote" | "backyard-trowel";

export interface HouseholdManipulationConfig {
  task: HouseholdManipulationTask;
  stepSeconds: number;
  durationSeconds: number;
  traceStride: number;
  /** Optional owner inputs (schema 3). Omitted or 0 means "use the task preset". */
  objectMassKilograms?: number;
  staticFrictionMu?: number;
  kineticFrictionMu?: number;
  /** Extra link-vs-box hard constraints in the owner frame, at most ARM_MAX_EXTRA_OBSTACLES. */
  obstacles?: readonly HouseholdKernelObstacle[];
}

const ARM_TASK_IDS: Record<HouseholdManipulationTask, number> = {
  "kitchen-mug": 0,
  "living-room-remote": 1,
  "backyard-trowel": 2,
};

const ARM_TASK_NAMES = [
  "kitchen-mug",
  "living-room-remote",
  "backyard-trowel",
] as const satisfies readonly HouseholdManipulationTask[];

/**
 * Schema-2's owner-composed collision margin. Keep this compatibility guard
 * until the FrankenSim v3 placement contract is the only shipped artifact.
 */
export const HOUSEHOLD_PLACEMENT_CLEARANCE_METERS = 0.045;

export const DEFAULT_HOUSEHOLD_MANIPULATION_CONFIG: HouseholdManipulationConfig =
  {
    task: "kitchen-mug",
    stepSeconds: 1 / 90,
    durationSeconds: 6,
    traceStride: 3,
  };

export interface HouseholdManipulationScene {
  objectMassKilograms: number;
  objectDimensionsMeters: [number, number, number];
  graspHalfWidthMeters: number;
  initialObjectPositionMeters: [number, number, number];
  goalObjectPositionMeters: [number, number, number];
  supportHeightMeters: number;
  obstacleCenterMeters: [number, number, number];
  obstacleHalfExtentsMeters: [number, number, number];
  /** Effective Coulomb coefficients the owner ran with (schema 3). */
  staticFrictionMu: number;
  kineticFrictionMu: number;
  /** Extra obstacle boxes the owner accepted from the config packet. */
  extraObstacleCount: number;
}

export interface HouseholdManipulationAdmission {
  policyDimension: 128;
  jointCount: 7;
  policyKnots: 16;
  linkCount: 8;
  poseWords: 7;
  traceSampleWords: 67;
  minimumGripperWidthMeters: number;
  openGripperWidthMeters: number;
  placementToleranceMeters: number;
  liftTargetMeters: number;
  config: HouseholdManipulationConfig;
  scene: HouseholdManipulationScene;
}

export interface HouseholdManipulationObjectiveReceipt {
  objective: number;
  finalObjectErrorMeters: number;
  minimumReachErrorMeters: number;
  maximumLiftMeters: number;
  actuatorWorkJoules: number;
  collisionRiskIntegral: number;
  minimumCertifiedClearanceMeters: number;
  possibleCollisionTimeSeconds: number;
  collisionQueryIterations: number;
  controlLimitIntegral: number;
  firstGraspTimeSeconds: number;
  graspDurationSeconds: number;
  peakGripForceNewtons: number;
  everGrasped: boolean;
  releasedAfterTransport: boolean;
  /** Placement bit reported by the version-gated owner kernel. */
  ownerReportedPlaced: boolean;
  /** Collision-safe verdict recomputed at the browser boundary as a fail-closed check. */
  placed: boolean;
  completedSteps: number;
}

export interface HouseholdRobotPose {
  position: [number, number, number];
  /** World-from-body quaternion in owner order w,x,y,z. */
  quaternionWxyz: [number, number, number, number];
}

export interface HouseholdManipulationTraceSample {
  timeSeconds: number;
  gripperWidthMeters: number;
  gripNormalForceNewtons: number;
  grasped: boolean;
  objectPose: HouseholdRobotPose;
  /** Source catalog order: iiwa_link_0 through iiwa_link_7. */
  linkPoses: HouseholdRobotPose[];
}

export interface HouseholdManipulationTraceReceipt extends HouseholdManipulationObjectiveReceipt {
  samples: HouseholdManipulationTraceSample[];
}

/**
 * Schema-3 config packet:
 *   [0..3]  magic, schema, kind, wordCount = 12 + 7n
 *   [4..7]  stepSeconds, durationSeconds, traceStride, task
 *   [8]     object mass override (0 = task preset)
 *   [9,10]  static / kinetic Coulomb mu (0 = owner defaults 0.82 / 0.68)
 *   [11]    n = extra obstacle count (0..32)
 *   then n × [cx, cy, cz, hx, hy, hz, yaw] in the owner frame (z-up, yaw about +Z)
 * The browser validates the same envelope the owner refuses on, so a bad
 * roster fails here with a readable message instead of an owner refusal code.
 */
export function buildHouseholdManipulationConfig(
  config: HouseholdManipulationConfig,
): Float64Array {
  const obstacles = config.obstacles ?? [];
  if (obstacles.length > ARM_MAX_EXTRA_OBSTACLES) {
    throw new Error(
      `household-arm config: ${obstacles.length} obstacles exceeds the owner cap of ${ARM_MAX_EXTRA_OBSTACLES}`,
    );
  }
  const mass = config.objectMassKilograms ?? 0;
  const staticMu = config.staticFrictionMu ?? 0;
  const kineticMu = config.kineticFrictionMu ?? 0;
  if (!Number.isFinite(mass) || mass < 0 || (mass !== 0 && (mass < 0.02 || mass > 20))) {
    throw new Error("household-arm config: object mass override must be 0 or within [0.02, 20] kg");
  }
  for (const [label, mu] of [
    ["static", staticMu],
    ["kinetic", kineticMu],
  ] as const) {
    if (!Number.isFinite(mu) || mu < 0 || (mu !== 0 && (mu <= 0.05 || mu > 2.5))) {
      throw new Error(`household-arm config: ${label} friction must be 0 or within (0.05, 2.5]`);
    }
  }
  const effectiveStatic = staticMu === 0 ? 0.82 : staticMu;
  const effectiveKinetic = kineticMu === 0 ? 0.68 : kineticMu;
  if (effectiveKinetic > effectiveStatic) {
    throw new Error("household-arm config: kinetic friction must not exceed static friction");
  }
  const words = new Float64Array(ARM_CONFIG_FIXED_WORDS + ARM_OBSTACLE_WORDS * obstacles.length);
  words.set([
    ARM_MAGIC,
    ARM_SCHEMA,
    ARM_KIND_CONFIG,
    words.length,
    config.stepSeconds,
    config.durationSeconds,
    config.traceStride,
    ARM_TASK_IDS[config.task],
    mass,
    staticMu,
    kineticMu,
    obstacles.length,
  ]);
  obstacles.forEach((obstacle, index) => {
    const base = ARM_CONFIG_FIXED_WORDS + ARM_OBSTACLE_WORDS * index;
    const { centerMeters: c, halfExtentsMeters: h, yawRad } = obstacle;
    if (
      !c.every(Number.isFinite) ||
      !h.every(Number.isFinite) ||
      !Number.isFinite(yawRad) ||
      c.some((value) => Math.abs(value) > 10) ||
      h.some((value) => value <= 0.001 || value > 5)
    ) {
      throw new Error(`household-arm config: obstacle ${index} (${obstacle.name}) is outside the owner envelope`);
    }
    words.set([c[0], c[1], c[2], h[0], h[1], h[2], yawRad], base);
  });
  return words;
}

function decodeArmHeader(
  packet: Float64Array,
  expectedKind: number,
): { payloadStart: 5 } | { refusal: PackedOwnerRefusal } {
  return decodeCommonOutput(
    packet,
    ARM_MAGIC,
    ARM_SCHEMA,
    expectedKind,
    ARM_REFUSAL_NAMES,
  );
}

function packetVector3(
  packet: Float64Array,
  start: number,
  label: string,
): [number, number, number] {
  const values = finitePacketView(packet, start, 3, label);
  return [values[0], values[1], values[2]];
}

function decodeHouseholdPose(
  packet: Float64Array,
  start: number,
  label: string,
): HouseholdRobotPose {
  const pose = finitePacketView(packet, start, ARM_POSE_WORDS, label);
  const quaternionNorm = Math.hypot(pose[3], pose[4], pose[5], pose[6]);
  if (Math.abs(quaternionNorm - 1) > 1e-6) {
    throw new Error(`malformed household-arm packet: ${label} quaternion`);
  }
  return {
    position: [pose[0], pose[1], pose[2]],
    quaternionWxyz: [pose[3], pose[4], pose[5], pose[6]],
  };
}

export function decodeHouseholdManipulationAdmission(
  packet: Float64Array,
): PackedResult<HouseholdManipulationAdmission> {
  const header = decodeArmHeader(packet, ARM_KIND_ADMISSION);
  if ("refusal" in header) return header;
  if (packet.length !== ARM_ADMISSION_WORDS) {
    throw new Error("malformed household-arm packet: admission length");
  }
  const policyDimension = exactPacketInteger(packet, 5, "policy dimension");
  const jointCount = exactPacketInteger(packet, 6, "joint count");
  const policyKnots = exactPacketInteger(packet, 7, "policy knots");
  const linkCount = exactPacketInteger(packet, 8, "link count");
  const poseWords = exactPacketInteger(packet, 9, "pose words");
  const traceSampleWords = exactPacketInteger(packet, 10, "trace sample words");
  if (
    policyDimension !== ARM_POLICY_DIMENSION ||
    jointCount !== ARM_JOINT_COUNT ||
    policyKnots !== ARM_POLICY_KNOTS ||
    linkCount !== ARM_LINK_COUNT ||
    poseWords !== ARM_POSE_WORDS ||
    traceSampleWords !== ARM_TRACE_SAMPLE_WORDS
  ) {
    throw new Error("malformed household-arm packet: owner layout mismatch");
  }
  const stepSeconds = finitePacketNumber(packet, 11, "step seconds");
  const durationSeconds = finitePacketNumber(packet, 12, "duration seconds");
  const traceStride = exactPacketInteger(packet, 13, "trace stride", 1, 1_000);
  const taskId = exactPacketInteger(
    packet,
    14,
    "task",
    0,
    ARM_TASK_NAMES.length - 1,
  );
  const task = ARM_TASK_NAMES[taskId];
  if (!task) throw new Error("malformed household-arm packet: task");
  const minimumGripperWidthMeters = finitePacketNumber(
    packet,
    15,
    "minimum gripper width",
  );
  const openGripperWidthMeters = finitePacketNumber(
    packet,
    16,
    "open gripper width",
  );
  const placementToleranceMeters = finitePacketNumber(
    packet,
    17,
    "placement tolerance",
  );
  const liftTargetMeters = finitePacketNumber(packet, 18, "lift target");
  const objectMassKilograms = finitePacketNumber(packet, 19, "object mass");
  const objectDimensionsMeters = packetVector3(packet, 20, "object dimensions");
  const graspHalfWidthMeters = finitePacketNumber(
    packet,
    23,
    "grasp half width",
  );
  const initialObjectPositionMeters = packetVector3(
    packet,
    24,
    "initial object position",
  );
  const goalObjectPositionMeters = packetVector3(
    packet,
    27,
    "goal object position",
  );
  const supportHeightMeters = finitePacketNumber(packet, 30, "support height");
  const obstacleCenterMeters = packetVector3(packet, 31, "obstacle center");
  const obstacleHalfExtentsMeters = packetVector3(
    packet,
    34,
    "obstacle half extents",
  );
  const staticFrictionMu = finitePacketNumber(packet, 37, "static friction");
  const kineticFrictionMu = finitePacketNumber(packet, 38, "kinetic friction");
  const extraObstacleCount = exactPacketInteger(
    packet,
    39,
    "extra obstacle count",
    0,
    ARM_MAX_EXTRA_OBSTACLES,
  );
  if (
    staticFrictionMu <= 0 ||
    kineticFrictionMu <= 0 ||
    kineticFrictionMu > staticFrictionMu ||
    stepSeconds < 1 / 240 ||
    stepSeconds > 1 / 45 ||
    durationSeconds < 3 ||
    durationSeconds > 6 ||
    Math.round(durationSeconds / stepSeconds) > 1_440 ||
    minimumGripperWidthMeters <= 0 ||
    openGripperWidthMeters <= minimumGripperWidthMeters ||
    placementToleranceMeters <= 0 ||
    liftTargetMeters <= 0 ||
    objectMassKilograms <= 0 ||
    objectDimensionsMeters.some((value) => value <= 0) ||
    graspHalfWidthMeters <= 0 ||
    supportHeightMeters <= 0 ||
    obstacleHalfExtentsMeters.some((value) => value <= 0)
  ) {
    throw new Error(
      "malformed household-arm packet: admitted controls or scene",
    );
  }
  return {
    ok: {
      policyDimension: ARM_POLICY_DIMENSION,
      jointCount: ARM_JOINT_COUNT,
      policyKnots: ARM_POLICY_KNOTS,
      linkCount: ARM_LINK_COUNT,
      poseWords: ARM_POSE_WORDS,
      traceSampleWords: ARM_TRACE_SAMPLE_WORDS,
      minimumGripperWidthMeters,
      openGripperWidthMeters,
      placementToleranceMeters,
      liftTargetMeters,
      config: { task, stepSeconds, durationSeconds, traceStride },
      scene: {
        objectMassKilograms,
        objectDimensionsMeters,
        graspHalfWidthMeters,
        initialObjectPositionMeters,
        goalObjectPositionMeters,
        supportHeightMeters,
        obstacleCenterMeters,
        obstacleHalfExtentsMeters,
        staticFrictionMu,
        kineticFrictionMu,
        extraObstacleCount,
      },
    },
  };
}

function decodeHouseholdReceiptPayload(
  packet: Float64Array,
): HouseholdManipulationObjectiveReceipt {
  if (packet.length < ARM_RECEIPT_WORDS) {
    throw new Error("malformed household-arm packet: objective receipt");
  }
  const ownerReportedPlaced =
    exactPacketInteger(packet, 20, "placed", 0, 1) === 1;
  const receipt: HouseholdManipulationObjectiveReceipt = {
    objective: finitePacketNumber(packet, 5, "objective"),
    finalObjectErrorMeters: finitePacketNumber(packet, 6, "final object error"),
    minimumReachErrorMeters: finitePacketNumber(
      packet,
      7,
      "minimum reach error",
    ),
    maximumLiftMeters: finitePacketNumber(packet, 8, "maximum lift"),
    actuatorWorkJoules: finitePacketNumber(packet, 9, "actuator work"),
    collisionRiskIntegral: finitePacketNumber(
      packet,
      10,
      "collision risk integral",
    ),
    minimumCertifiedClearanceMeters: finitePacketNumber(
      packet,
      11,
      "minimum certified clearance",
    ),
    possibleCollisionTimeSeconds: finitePacketNumber(
      packet,
      12,
      "possible collision time",
    ),
    collisionQueryIterations: exactPacketInteger(
      packet,
      13,
      "collision query iterations",
    ),
    controlLimitIntegral: finitePacketNumber(
      packet,
      14,
      "control limit integral",
    ),
    firstGraspTimeSeconds: finitePacketNumber(packet, 15, "first grasp time"),
    graspDurationSeconds: finitePacketNumber(packet, 16, "grasp duration"),
    peakGripForceNewtons: finitePacketNumber(packet, 17, "peak grip force"),
    everGrasped: exactPacketInteger(packet, 18, "ever grasped", 0, 1) === 1,
    releasedAfterTransport:
      exactPacketInteger(packet, 19, "released", 0, 1) === 1,
    ownerReportedPlaced,
    placed: false,
    completedSteps: exactPacketInteger(packet, 21, "completed steps", 1, 1_440),
  };
  receipt.placed =
    ownerReportedPlaced &&
    receipt.collisionRiskIntegral === 0 &&
    receipt.minimumCertifiedClearanceMeters >=
      HOUSEHOLD_PLACEMENT_CLEARANCE_METERS &&
    receipt.possibleCollisionTimeSeconds === 0;
  if (
    receipt.finalObjectErrorMeters < 0 ||
    receipt.minimumReachErrorMeters < 0 ||
    receipt.maximumLiftMeters < 0 ||
    receipt.actuatorWorkJoules < 0 ||
    receipt.collisionRiskIntegral < 0 ||
    receipt.minimumCertifiedClearanceMeters < 0 ||
    receipt.possibleCollisionTimeSeconds < 0 ||
    receipt.controlLimitIntegral < 0 ||
    receipt.firstGraspTimeSeconds < 0 ||
    receipt.graspDurationSeconds < 0 ||
    receipt.peakGripForceNewtons < 0 ||
    (ownerReportedPlaced &&
      (!receipt.everGrasped || !receipt.releasedAfterTransport))
  ) {
    throw new Error("malformed household-arm packet: objective invariants");
  }
  return receipt;
}

export function decodeHouseholdManipulationEvaluation(
  packet: Float64Array,
): PackedResult<HouseholdManipulationObjectiveReceipt> {
  const header = decodeArmHeader(packet, ARM_KIND_EVALUATION);
  if ("refusal" in header) return header;
  if (packet.length !== ARM_RECEIPT_WORDS) {
    throw new Error("malformed household-arm packet: evaluation length");
  }
  return { ok: decodeHouseholdReceiptPayload(packet) };
}

export function decodeHouseholdManipulationPopulation(
  packet: Float64Array,
): PackedResult<Float64Array> {
  const header = decodeArmHeader(packet, ARM_KIND_POPULATION);
  if ("refusal" in header) return header;
  if (packet.length < 7)
    throw new Error("malformed household-arm packet: population length");
  const population = exactPacketInteger(packet, 5, "population", 1, 64);
  if (packet.length !== 6 + population) {
    throw new Error("malformed household-arm packet: population shape");
  }
  return {
    ok: finitePacketView(packet, 6, population, "population objectives"),
  };
}

export function decodeHouseholdManipulationTrace(
  packet: Float64Array,
): PackedResult<HouseholdManipulationTraceReceipt> {
  const header = decodeArmHeader(packet, ARM_KIND_TRACE);
  if ("refusal" in header) return header;
  const receipt = decodeHouseholdReceiptPayload(packet);
  const sampleCount = exactPacketInteger(
    packet,
    ARM_RECEIPT_WORDS,
    "trace sample count",
    1,
  );
  if (
    packet.length !==
    ARM_RECEIPT_WORDS + 1 + sampleCount * ARM_TRACE_SAMPLE_WORDS
  ) {
    throw new Error("malformed household-arm packet: trace shape");
  }
  const samples: HouseholdManipulationTraceSample[] = [];
  let cursor = ARM_RECEIPT_WORDS + 1;
  let previousTime = -Infinity;
  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex++) {
    const timeSeconds = finitePacketNumber(packet, cursor, "trace time");
    if (timeSeconds < previousTime) {
      throw new Error("malformed household-arm packet: trace time order");
    }
    previousTime = timeSeconds;
    const gripperWidthMeters = finitePacketNumber(
      packet,
      cursor + 1,
      "gripper width",
    );
    const gripNormalForceNewtons = finitePacketNumber(
      packet,
      cursor + 2,
      "grip force",
    );
    const grasped =
      exactPacketInteger(packet, cursor + 3, "grasped", 0, 1) === 1;
    if (gripperWidthMeters <= 0 || gripNormalForceNewtons < 0) {
      throw new Error("malformed household-arm packet: gripper state");
    }
    cursor += 4;
    const objectPose = decodeHouseholdPose(packet, cursor, "object pose");
    cursor += ARM_POSE_WORDS;
    const linkPoses: HouseholdRobotPose[] = [];
    for (let link = 0; link < ARM_LINK_COUNT; link++) {
      linkPoses.push(decodeHouseholdPose(packet, cursor, "link pose"));
      cursor += ARM_POSE_WORDS;
    }
    samples.push({
      timeSeconds,
      gripperWidthMeters,
      gripNormalForceNewtons,
      grasped,
      objectPose,
      linkPoses,
    });
  }
  return { ok: { ...receipt, samples } };
}

export class FrankenSimHouseholdManipulationEvaluator {
  private readonly raw: RawManipulationEvaluator;
  readonly admission: HouseholdManipulationAdmission;

  constructor(
    raw: RawManipulationEvaluator,
    admission: HouseholdManipulationAdmission,
  ) {
    this.raw = raw;
    this.admission = admission;
  }

  curriculumPolicyMean(): Float64Array {
    const mean = this.raw.curriculum_policy_mean();
    if (
      mean.length !== this.admission.policyDimension ||
      mean.some((value) => !Number.isFinite(value))
    ) {
      throw new Error("malformed household-arm curriculum policy mean");
    }
    return mean;
  }

  evaluate(
    policy: Float64Array,
  ): PackedResult<HouseholdManipulationObjectiveReceipt> {
    return decodeHouseholdManipulationEvaluation(this.raw.evaluate(policy));
  }

  evaluatePopulation(policies: Float64Array): PackedResult<Float64Array> {
    return decodeHouseholdManipulationPopulation(
      this.raw.evaluate_population(policies),
    );
  }

  trace(policy: Float64Array): PackedResult<HouseholdManipulationTraceReceipt> {
    return decodeHouseholdManipulationTrace(this.raw.trace(policy));
  }

  free(): void {
    this.raw.free?.();
  }
}

export async function createFrankenSimHouseholdManipulationEvaluator(
  config: HouseholdManipulationConfig = DEFAULT_HOUSEHOLD_MANIPULATION_CONFIG,
): Promise<PackedResult<FrankenSimHouseholdManipulationEvaluator>> {
  const status = await initFrankenSimOwnerKernel();
  const Evaluator = ownerModule?.HouseholdManipulationVizEvaluator;
  if (status.source !== "wasm" || !Evaluator) {
    throw new Error(
      status.error ?? "Frankensim household-arm owner kernel is unavailable",
    );
  }
  const raw = new Evaluator(buildHouseholdManipulationConfig(config));
  let decoded: PackedResult<HouseholdManipulationAdmission>;
  try {
    decoded = decodeHouseholdManipulationAdmission(raw.receipt());
  } catch (error) {
    raw.free?.();
    throw error;
  }
  if ("refusal" in decoded) {
    raw.free?.();
    return decoded;
  }
  return { ok: new FrankenSimHouseholdManipulationEvaluator(raw, decoded.ok) };
}
