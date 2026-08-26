/* tslint:disable */
/* eslint-disable */

/**
 * Evaluate the parametric suspension-bridge model.
 * topology_id: 0 Warren · 1 Pratt · 2 Howe · 3 K-Truss · 4 Bowstring.
 * material_id: 0 A36 · 1 A992 · 2 Ti-6Al-4V · 3 CFRP.
 */
export function bridge_eval(span_m: number, sag_m: number, deck_stiffness: number, topology_id: number, material_id: number, suspender_count: number, tower_aspect: number, damping: number, truck_pos_m: number): string;

/**
 * Kernel identity probe (capability check after instantiation).
 */
export function demo_physics_kernel_version(): string;

/**
 * Evaluate the parametric wing model: scalars in, JSON envelope out.
 * family_id: 0 NACA4 · 1 NACA5 · 2 SC(2) · 3 reflexed · 4 laminar.
 */
export function wing_eval(aspect_ratio: number, sweep_deg: number, thickness_ratio: number, max_camber: number, camber_position: number, taper_ratio: number, family_id: number, rib_count: number, cruise_mach: number): string;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly bridge_eval: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => [number, number];
    readonly demo_physics_kernel_version: () => [number, number];
    readonly wing_eval: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => [number, number];
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
