/* tslint:disable */
/* eslint-disable */

/**
 * Rasterize one landscape heatmap into the internal RGBA buffer.
 * Returns `{"ok":{"kernel","width","height"}}` or a typed refusal.
 */
export function heatmap_render(field: string, width: number, height: number, xmin: number, xmax: number, ymin: number, ymax: number, norm_mode: string, norm_k: number, r0: number, rk: number, g0: number, gk: number, b0: number, bk: number): string;

export function heatmap_rgba_len(): number;

/**
 * Pointer/length of the RGBA buffer inside wasm memory. Valid until the
 * next heatmap_render call; the page copies it into an ImageData
 * immediately (putImageData copies, so no lifetime hazard).
 */
export function heatmap_rgba_ptr(): number;

/**
 * Kernel identity probe (capability check after instantiation).
 */
export function heatmap_version(): string;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly heatmap_render: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number, p: number, q: number) => [number, number];
    readonly heatmap_rgba_len: () => number;
    readonly heatmap_rgba_ptr: () => number;
    readonly heatmap_version: () => [number, number];
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
