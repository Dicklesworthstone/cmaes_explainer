/**
 * FrankenSim heatmap kernel (fs-heatmap-wasm) — WASM loader + typed surface.
 *
 * Seven components rasterize a 2D objective landscape into a background
 * canvas with the same template: pixel → (x, y) → v = field(x, y) →
 * normalization → linear ramp → RGBA. The JS loops burn 500k–1M
 * transcendental evaluations on the main thread at mount and on every
 * landscape/strategy switch. The kernel hosts the field registry and fills
 * the identical pixels in a few milliseconds; this module loads it (Blob-URL
 * pattern, single-flight), exposes `buildHeatmapCanvas`, and keeps ONE
 * generic JS implementation of the template as the fallback — the same spec
 * drives both engines, so they cannot drift apart per component.
 *
 * Field ids, normalization modes, and ramp semantics are shared vocabulary
 * with the crate (frankensim/crates/fs-heatmap-wasm); the crate's tests plus
 * the site's parity script (scratchpad test-heatmap-parity.mjs) prove the
 * two implementations agree pixel-for-pixel within 1/255 per channel.
 */

export type HeatmapFieldId =
  | "rosenbrock100"
  | "rastrigin"
  | "ackley"
  | "cigar-y1000"
  | "himmelblau"
  | "step-ridge"
  | "rosenbrock10"
  | "rot-cigar80"
  | "cigar-x100"
  | "sphere"
  | "banana-canyon"
  | "bowl-ripple"
  | "box-quad-clamp"
  | "box-quad-reflect"
  | "box-quad-logit";

export type HeatmapNormMode = "log10p1" | "tanh" | "linear" | "sqrt" | "log10eps";

export interface HeatmapSpec {
  field: HeatmapFieldId;
  width: number;
  height: number;
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
  norm: { mode: HeatmapNormMode; k: number };
  ramp: { r0: number; rk: number; g0: number; gk: number; b0: number; bk: number };
  /** The component's original field, used only by the JS fallback path. */
  fallbackField: (x: number, y: number) => number;
}

export type HeatmapKernelSource = "wasm" | "ts-fallback" | "unloaded";

export interface HeatmapKernelStatus {
  source: HeatmapKernelSource;
  kernelVersion: string | null;
  error: string | null;
}

type WasmModule = {
  heatmap_render?: (
    field: string,
    width: number,
    height: number,
    xmin: number,
    xmax: number,
    ymin: number,
    ymax: number,
    normMode: string,
    normK: number,
    r0: number,
    rk: number,
    g0: number,
    gk: number,
    b0: number,
    bk: number
  ) => string;
  heatmap_rgba_ptr?: () => number;
  heatmap_rgba_len?: () => number;
  heatmap_version?: () => string;
};

let heatmapModule: WasmModule | null = null;
let heatmapMemory: WebAssembly.Memory | null = null;
let loadPromise: Promise<HeatmapKernelStatus> | null = null;

async function loadWasmModule(jsPath: string, wasmPath: string): Promise<WasmModule> {
  if (typeof window === "undefined") throw new Error("SSR context");
  const jsText = await fetch(jsPath, { signal: AbortSignal.timeout(10_000) }).then((r) => {
    if (!r.ok) throw new Error(`fetch ${jsPath}: ${r.status}`);
    return r.text();
  });
  const blobUrl = URL.createObjectURL(new Blob([jsText], { type: "text/javascript" }));
  try {
    // Dynamic import is REQUIRED here: the specifier is a runtime-created
    // Blob URL wrapping fetched wasm-bindgen glue, and webpackIgnore stops
    // Turbopack from mangling the glue (the sanctioned frankensim pattern).
    const mod = (await import(/* webpackIgnore: true */ blobUrl)) as {
      default?: (opts: { module_or_path: string }) => Promise<{ memory?: WebAssembly.Memory }>;
    } & WasmModule;
    if (typeof mod.default === "function") {
      const initOutput = await mod.default({ module_or_path: wasmPath });
      if (initOutput && initOutput.memory instanceof WebAssembly.Memory) {
        heatmapMemory = initOutput.memory;
      }
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
export function initFrankenSimHeatmap(): Promise<HeatmapKernelStatus> {
  if (loadPromise) return loadPromise;
  loadPromise = (async (): Promise<HeatmapKernelStatus> => {
    try {
      const mod = await loadWasmModule("/wasm/fs-heatmap/fs_heatmap_wasm.js", "/wasm/fs-heatmap/fs_heatmap_wasm_bg.wasm");
      const required: (keyof WasmModule)[] = ["heatmap_render", "heatmap_rgba_ptr", "heatmap_rgba_len"];
      for (const name of required) {
        if (typeof mod[name] !== "function") {
          return { source: "ts-fallback", kernelVersion: null, error: `missing export ${name}` };
        }
      }
      if (!heatmapMemory) {
        return { source: "ts-fallback", kernelVersion: null, error: "wasm memory not captured" };
      }
      heatmapModule = mod;
      const version = typeof mod.heatmap_version === "function" ? mod.heatmap_version() : null;
      return { source: "wasm", kernelVersion: version, error: null };
    } catch (err) {
      return { source: "ts-fallback", kernelVersion: null, error: err instanceof Error ? err.message : String(err) };
    }
  })();
  return loadPromise;
}

function applyNormJs(mode: HeatmapNormMode, v: number, k: number): number {
  switch (mode) {
    case "log10p1":
      return Math.max(0, Math.min(1, Math.log10(1 + v) / k));
    case "tanh":
      return Math.tanh(v / k);
    case "linear":
      return Math.max(0, Math.min(1, v / k));
    case "sqrt":
      return Math.max(0, Math.min(1, Math.sqrt(v) / k));
    case "log10eps":
      return Math.max(0, Math.min(1, Math.log10(Math.max(1e-4, v + 1e-4)) / k));
  }
}

/**
 * The original per-pixel JS template (shared by all seven components before
 * the kernel existed), kept as the engine-of-last-resort. Exported so the
 * parity script can diff it against the kernel byte-for-byte.
 */
export function renderHeatmapJs(spec: HeatmapSpec): ImageData | null {
  if (typeof document === "undefined") return null;
  const { width: W, height: H, xmin, xmax, ymin, ymax, norm, ramp, fallbackField } = spec;
  const img = new ImageData(W, H);
  const buf32 = new Uint32Array(img.data.buffer);
  const xScale = (xmax - xmin) / W;
  const yScale = (ymax - ymin) / H;
  for (let py = 0; py < H; py++) {
    const y = ymax - py * yScale;
    const rowOffset = py * W;
    for (let px = 0; px < W; px++) {
      const x = xmin + px * xScale;
      const n = applyNormJs(norm.mode, fallbackField(x, y), norm.k);
      const r = (ramp.r0 + ramp.rk * n) | 0;
      const g = (ramp.g0 + ramp.gk * (1 - n)) | 0;
      const b = (ramp.b0 + ramp.bk * (1 - n)) | 0;
      buf32[rowOffset + px] = (255 << 24) | (b << 16) | (g << 8) | r;
    }
  }
  return img;
}

/** Kernel-side render; null when the kernel is unavailable or refuses. */
function renderHeatmapWasm(spec: HeatmapSpec): ImageData | null {
  const mod = heatmapModule;
  if (!mod?.heatmap_render || !mod.heatmap_rgba_ptr || !mod.heatmap_rgba_len || !heatmapMemory) return null;
  try {
    const envelope = JSON.parse(
      mod.heatmap_render(
        spec.field,
        spec.width,
        spec.height,
        spec.xmin,
        spec.xmax,
        spec.ymin,
        spec.ymax,
        spec.norm.mode,
        spec.norm.k,
        spec.ramp.r0,
        spec.ramp.rk,
        spec.ramp.g0,
        spec.ramp.gk,
        spec.ramp.b0,
        spec.ramp.bk
      )
    ) as { ok?: { width: number; height: number }; refusal?: { code: string } };
    if (!envelope.ok) {
      if (envelope.refusal) console.warn("[fs-heatmap] refusal:", envelope.refusal.code);
      return null;
    }
    const ptr = mod.heatmap_rgba_ptr();
    const len = mod.heatmap_rgba_len();
    if (!ptr || len !== spec.width * spec.height * 4) return null;
    // Copy out of wasm memory: the buffer is reused by the next render call,
    // and ImageData wants a buffer it can own.
    const view = new Uint8ClampedArray(heatmapMemory.buffer, ptr, len);
    return new ImageData(new Uint8ClampedArray(view), spec.width, spec.height);
  } catch (err) {
    console.warn("[fs-heatmap] render failed:", err);
    return null;
  }
}

/**
 * Build one landscape heatmap as an offscreen canvas: kernel-side when the
 * WASM module is live (a few ms), otherwise the JS template deferred to a
 * macrotask so a slow fallback raster never blocks the mounting paint.
 * Resolves null only in SSR or when 2D contexts are unavailable.
 */
export async function buildHeatmapCanvas(spec: HeatmapSpec): Promise<HTMLCanvasElement | null> {
  if (typeof document === "undefined") return null;
  const status = await initFrankenSimHeatmap();
  let img: ImageData | null = null;
  if (status.source === "wasm") {
    img = renderHeatmapWasm(spec);
  }
  if (!img) {
    await new Promise((resolve) => setTimeout(resolve, 16));
    img = renderHeatmapJs(spec);
  }
  if (!img) return null;
  const canvas = document.createElement("canvas");
  canvas.width = spec.width;
  canvas.height = spec.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.putImageData(img, 0, 0);
  return canvas;
}

/** Whether the WASM kernel ended up driving heatmaps (for provenance UI). */
export function heatmapKernelLive(): boolean {
  return heatmapModule !== null;
}
