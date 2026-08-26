/**
 * FrankenSim Lenia kernel (fs-lenia-wasm) — WASM loader + typed surface.
 *
 * Loads the committed wasm-pack bundle under /wasm/fs-lenia/ via the Blob-URL
 * trick (the sanctioned frankensim loader pattern), captures the instance's
 * WebAssembly.Memory so the page can blit the kernel's RGBA buffer with zero
 * per-pixel JS work, and degrades honestly: when the kernel is unavailable
 * the caller falls back to the site's 96² TypeScript Lenia.
 *
 * The kernel computes the exact same model as the TS fallback (ring kernel,
 * gaussian growth, toroidal wrap — verified FFT-vs-direct in the crate's
 * tests) but through a planned, cache-tuned O(N² log N) FFT, which is what
 * makes a 256²–512² field viable on phones.
 */

export type LeniaKernelSource = "wasm" | "ts-fallback" | "unloaded";

export interface LeniaKernelStatus {
  source: LeniaKernelSource;
  kernelVersion: string | null;
  error: string | null;
}

type WasmModule = {
  lenia_init?: (size: number, evalSize: number, relRadius: number) => string;
  lenia_clear?: () => void;
  lenia_seed_ring?: (cx: number, cy: number, radius: number, ringFrac: number, width: number, intensity: number) => void;
  lenia_step?: (mu: number, sigma: number, dt: number, steps: number) => string;
  lenia_render?: () => void;
  lenia_rgba_ptr?: () => number;
  lenia_rgba_len?: () => number;
  lenia_snapshot_eval?: () => void;
  lenia_eval?: (mu: number, sigma: number, dt: number, steps: number) => string;
  lenia_version?: () => string;
};

let leniaModule: WasmModule | null = null;
let leniaMemory: WebAssembly.Memory | null = null;
let loadPromise: Promise<LeniaKernelStatus> | null = null;

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
        leniaMemory = initOutput.memory;
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
export function initFrankenSimLenia(): Promise<LeniaKernelStatus> {
  if (loadPromise) return loadPromise;
  loadPromise = (async (): Promise<LeniaKernelStatus> => {
    try {
      const mod = await loadWasmModule("/wasm/fs-lenia/fs_lenia_wasm.js", "/wasm/fs-lenia/fs_lenia_wasm_bg.wasm");
      const required: (keyof WasmModule)[] = [
        "lenia_init",
        "lenia_clear",
        "lenia_seed_ring",
        "lenia_step",
        "lenia_render",
        "lenia_rgba_ptr",
        "lenia_rgba_len",
        "lenia_snapshot_eval",
        "lenia_eval"
      ];
      for (const name of required) {
        if (typeof mod[name] !== "function") {
          return { source: "ts-fallback", kernelVersion: null, error: `missing export ${name}` };
        }
      }
      if (!leniaMemory) {
        return { source: "ts-fallback", kernelVersion: null, error: "wasm memory not captured" };
      }
      leniaModule = mod;
      const version = typeof mod.lenia_version === "function" ? mod.lenia_version() : null;
      return { source: "wasm", kernelVersion: version, error: null };
    } catch (err) {
      return { source: "ts-fallback", kernelVersion: null, error: err instanceof Error ? err.message : String(err) };
    }
  })();
  return loadPromise;
}

function callJson(fn: (() => string) | undefined): { ok?: Record<string, number>; refusal?: { code: string } } | null {
  if (!fn) return null;
  try {
    return JSON.parse(fn());
  } catch {
    return null;
  }
}

/** Allocate the field. Returns true when the kernel accepted the shape. */
export function leniaInit(size: number, evalSize: number, relRadius: number): boolean {
  const mod = leniaModule;
  if (!mod?.lenia_init) return false;
  const parsed = callJson(() => mod.lenia_init!(size, evalSize, relRadius));
  if (parsed?.ok) return true;
  if (parsed?.refusal) console.warn("[fs-lenia] init refusal:", parsed.refusal.code);
  return false;
}

export function leniaClear(): void {
  leniaModule?.lenia_clear?.();
}

export function leniaSeedRing(cx: number, cy: number, radius: number, ringFrac: number, width: number, intensity: number): void {
  leniaModule?.lenia_seed_ring?.(cx, cy, radius, ringFrac, width, intensity);
}

/** Advance the field; returns the last step's metrics or null on failure. */
export function leniaStep(mu: number, sigma: number, dt: number, steps: number): { interface: number; mass: number } | null {
  const mod = leniaModule;
  if (!mod?.lenia_step) return null;
  const parsed = callJson(() => mod.lenia_step!(mu, sigma, dt, steps));
  if (parsed?.ok) return { interface: parsed.ok.interface, mass: parsed.ok.mass };
  return null;
}

/**
 * Colormap the current field inside wasm and wrap the RGBA buffer as an
 * ImageData. The view is recreated on every call because a wasm memory grow
 * would detach previous ArrayBuffer views.
 */
export function leniaImageData(): ImageData | null {
  const mod = leniaModule;
  if (!mod?.lenia_render || !mod.lenia_rgba_ptr || !mod.lenia_rgba_len || !leniaMemory) return null;
  mod.lenia_render();
  const ptr = mod.lenia_rgba_ptr();
  const len = mod.lenia_rgba_len();
  if (!ptr || !len) return null;
  const size = Math.round(Math.sqrt(len / 4));
  if (size * size * 4 !== len) return null;
  try {
    const view = new Uint8ClampedArray(leniaMemory.buffer, ptr, len);
    return new ImageData(view, size, size);
  } catch {
    return null;
  }
}

/** Freeze the current field (box-averaged) as the CMA-ES evaluation seed. */
export function leniaSnapshotEval(): void {
  leniaModule?.lenia_snapshot_eval?.();
}

/** Score (mu, sigma, dt) from the frozen seed; null on failure. */
export function leniaEval(mu: number, sigma: number, dt: number, steps: number): number | null {
  const mod = leniaModule;
  if (!mod?.lenia_eval) return null;
  const parsed = callJson(() => mod.lenia_eval!(mu, sigma, dt, steps));
  if (parsed?.ok && Number.isFinite(parsed.ok.score)) return parsed.ok.score;
  return null;
}
