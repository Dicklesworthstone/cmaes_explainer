/* tslint:disable */
/* eslint-disable */

/**
 * Kernel identity probe (capability check after instantiation).
 */
export function cmaes_viz_kernel_version(): string;

/**
 * Run the visualization kernel: scalar params in, JSON envelope out.
 * `x0_0..x0_5` are the initial mean coordinates; only the first `dim`
 * are read. `f_target` = NaN disables the early-stop target.
 */
export function cmaes_viz_run(dim: number, x0_0: number, x0_1: number, x0_2: number, x0_3: number, x0_4: number, x0_5: number, sigma0: number, lambda: number, active: boolean, seed: bigint, generations: number, landscape: number, noise: number, bounds_enabled: boolean, bound_min: number, bound_max: number, f_target: number): string;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly cmaes_viz_kernel_version: () => [number, number];
    readonly cmaes_viz_run: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: bigint, l: number, m: number, n: number, o: number, p: number, q: number, r: number) => [number, number];
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
