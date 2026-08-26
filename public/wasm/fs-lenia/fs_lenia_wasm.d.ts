/* tslint:disable */
/* eslint-disable */

/**
 * Zero the display field.
 */
export function lenia_clear(): void;

/**
 * Fitness rollout from the frozen snapshot: `steps` Lenia steps at eval
 * resolution, scored with the site's objective
 * mean(interface - 2·|mass - 0.25|). Returns `{"ok":{"score":..}}`.
 */
export function lenia_eval(mu: number, sigma: number, dt: number, steps: number): string;

/**
 * Allocate the simulation. size: power of two in 64..=512; eval_size
 * must divide it (the CMA-ES fitness rollouts run at this resolution);
 * rel_radius: ring kernel radius as a fraction of size (~0.052 mirrors
 * the site's 96-cell fallback). Returns `{"ok":{"size","kernelRadius"}}`.
 */
export function lenia_init(size: number, eval_size: number, rel_radius: number): string;

/**
 * Colormap the current display field into the internal RGBA buffer.
 */
export function lenia_render(): void;

export function lenia_rgba_len(): number;

/**
 * Pointer/length of the RGBA buffer inside wasm memory. The buffer is
 * allocated once at init and never reallocated, so the pointer stays
 * valid until the next lenia_init; the page rewraps it per frame in
 * case wasm memory grows.
 */
export function lenia_rgba_ptr(): number;

/**
 * Additively seed a hollow gaussian ring at (cx, cy) in grid cells.
 */
export function lenia_seed_ring(cx: number, cy: number, radius: number, ring_frac: number, width: number, intensity: number): void;

/**
 * Freeze the current display field (box-averaged to eval resolution) as
 * the seed every subsequent lenia_eval rollout starts from.
 */
export function lenia_snapshot_eval(): void;

/**
 * Advance the display field `steps` times. Returns the LAST step's
 * metrics: `{"ok":{"interface":..,"mass":..}}`.
 */
export function lenia_step(mu: number, sigma: number, dt: number, steps: number): string;

/**
 * Kernel identity probe (capability check after instantiation).
 */
export function lenia_version(): string;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly lenia_clear: () => void;
    readonly lenia_eval: (a: number, b: number, c: number, d: number) => [number, number];
    readonly lenia_init: (a: number, b: number, c: number) => [number, number];
    readonly lenia_render: () => void;
    readonly lenia_rgba_len: () => number;
    readonly lenia_rgba_ptr: () => number;
    readonly lenia_seed_ring: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
    readonly lenia_snapshot_eval: () => void;
    readonly lenia_step: (a: number, b: number, c: number, d: number) => [number, number];
    readonly lenia_version: () => [number, number];
    readonly __wbindgen_externrefs: WebAssembly.Table;
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
