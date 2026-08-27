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

export interface CmaesVizGeneration {
  g: number;
  mean: number[];
  sigma: number;
  eigvals: number[];
  eigvecs: number[];
  cond: number;
  best_f: number;
  evals: number;
  proj_mean: [number, number, number];
  proj_eigvals: [number, number, number];
  proj_eigvecs: [number, number, number, number, number, number, number, number, number];
  sx: number[];
  sz: number[];
  sf: number[];
  se: number[];
  p_sigma: number[];
  p_c: number[];
}

export interface CmaesVizRun {
  kernel: string;
  dim: number;
  landscape: number;
  stop_reason: string;
  best_f: number;
  best_x: number[];
  total_evals: number;
  generations: CmaesVizGeneration[];
  pca_basis: number[];
  pca_center: number[];
  pca_pool_eigvals: number[];
}

// ---------------------------------------------------------------------------
// Loader (Blob-URL + webpackIgnore; single-flight, memoized).
// ---------------------------------------------------------------------------

type WasmModule = {
  cmaes_viz_run?: (...args: unknown[]) => string;
  cmaes_viz_kernel_version?: () => string;
};

let fsCmaesModule: WasmModule | null = null;
let loadAttempted = false;
let loadPromise: Promise<CmaesKernelStatus> | null = null;

/**
 * Fail closed until a kernel version has passed the same reference audit as
 * the TypeScript engine. Versions 0.2.0 and 0.2.1 remain rejected for their
 * broken h-sigma/damping and mixed pre/post-update snapshot semantics. Version
 * 0.3.0 matches the audited Hansen couplings, RNG consumption, latent
 * reflection adaptation, and coherent post-update snapshot contract.
 */
const AUDITED_CMAES_KERNEL_VERSIONS = new Set(["fs-cmaes-viz-wasm 0.3.0"]);

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
    const raw = mod.cmaes_viz_run(
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
    const parsed = JSON.parse(raw) as { ok?: CmaesVizRun; refusal?: { code: string; message: string } };
    if (parsed.ok) return parsed.ok;
    console.warn("[fs-cmaes] kernel refusal:", parsed.refusal?.code, parsed.refusal?.message);
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
function projectPoint(point: number[], basis: number[], center: number[], n: number): [number, number, number] {
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
function projectDirection(vec: number[], basis: number[], n: number): [number, number, number] {
  const out: [number, number, number] = [0, 0, 0];
  for (let r = 0; r < 3; r++) {
    let acc = 0;
    for (let i = 0; i < n; i++) acc += basis[r * n + i] * vec[i];
    out[r] = acc;
  }
  return out;
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
  const poolSum = pool.reduce((a, b) => a + Math.max(b, 0), 0) || 1;
  // Top-3 pooled eigenvalues (largest last in the ascending spectrum).
  const top3 = [pool[pool.length - 1] ?? 0, pool[pool.length - 2] ?? 0, pool[pool.length - 3] ?? 0];
  const varianceExplained: [number, number, number] = [
    (100 * Math.max(top3[0], 0)) / poolSum,
    (100 * Math.max(top3[1], 0)) / poolSum,
    (100 * Math.max(top3[2], 0)) / poolSum,
  ];

  let runningBestObservedFitness = Infinity;
  let runningBestX = run.generations[0]?.mean.slice() ?? run.best_x.slice();

  return run.generations.map((gen, generationIndex) => {
    const lambda = gen.se.length;
    // Audited kernels store population streams in rank order. Derive ranks
    // defensively from displayed fitnesses anyway so this pure adapter also
    // handles synthetic fixtures and rejects no otherwise-renderable stream.
    const sortedIndices = Array.from({ length: lambda }, (_, i) => i).sort((a, b) => {
      const fa = Number.isFinite(gen.sf[a]) ? gen.sf[a] : Infinity;
      const fb = Number.isFinite(gen.sf[b]) ? gen.sf[b] : Infinity;
      return fa - fb || a - b;
    });
    const ranks = new Array<number>(lambda);
    sortedIndices.forEach((sampleIndex, rank) => {
      ranks[sampleIndex] = rank;
    });
    const selectedCount = gen.se.filter((value) => value === 1).length;
    const eliteCount = selectedCount > 0 && selectedCount < lambda ? selectedCount : Math.floor(lambda / 2);

    const generationBestIndex = sortedIndices[0];
    const generationBestFitness = gen.sf[generationBestIndex];
    if (Number.isFinite(generationBestFitness) && generationBestFitness < runningBestObservedFitness) {
      runningBestObservedFitness = generationBestFitness;
      runningBestX = gen.sx.slice(generationBestIndex * n, (generationBestIndex + 1) * n);
    }
    // Defensive spectrum sanitizing at the adapter boundary. The loader
    // admits only audited kernels, while this exported pure mapper is also
    // exercised directly with synthetic snapshots.
    const eigenvalues = gen.eigvals.map((v) => Math.max(v, 0));
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
      const x = gen.sx.slice(s * n, (s + 1) * n);
      const z = gen.sz.slice(s * n, (s + 1) * n);
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
    const projectedEigenvalues = gen.proj_eigvals.map((value) => Math.max(value, 0));
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
      mean: gen.mean,
      sigma: gen.sigma,
      covariance,
      pSigma: gen.p_sigma,
      pC: gen.p_c,
      samples,
      bestFitness: gen.best_f,
      // The stream does not include the coordinate associated with its
      // historical true-best fitness, so intermediate frames use the best
      // observed sample available by that point. The run envelope does carry
      // the exact true-best coordinate, and it is valid once the final frame
      // has been reached.
      bestX: generationIndex === run.generations.length - 1 ? run.best_x.slice() : runningBestX.slice(),
      eigenvalues: [...eigenvalues].reverse(),
      conditionNumber,
      evalCount: gen.evals,
      phaseSpace3D: {
        projectedMean: gen.proj_mean,
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
