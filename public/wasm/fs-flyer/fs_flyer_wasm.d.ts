/* tslint:disable */
/* eslint-disable */

/**
 * CG2 attitude step with a body-frame torque [N·m].
 */
export function flyer_aero_step(ixx: number, iyy: number, izz: number, qw: number, qx: number, qy: number, qz: number, wx: number, wy: number, wz: number, tx: number, ty: number, tz: number, dt_s: number, steps: number): string;

/**
 * Pinned-input BEMT bit probe (guzez.7.2.1 lane bisection).
 */
export function flyer_bemt_probe(): string;

/**
 * Pinned force-buildup bit probe (E6.2 lane bisection).
 */
export function flyer_buildup_probe(): string;

/**
 * Spread probe (E6.2 lane bisection).
 */
export function flyer_buildup_spread(): string;

/**
 * Determinism probe (E6.2 six-lane diagnostics; doc-hidden class):
 * bit patterns of the det:: kernel + fma on this platform.
 */
export function flyer_det_probe(): string;

/**
 * The chained lifecycle digest envelope.
 */
export function flyer_engine_digest(): string;

/**
 * Initialize the Wright Flyer lifecycle engine (E5.1). Replaces
 * any prior run in this worker. mode: 0=fixed, 1=historical
 * (member selects the registered pilot), 2=human. Returns the
 * init envelope (run_intent_id, tick0_digest, trim) or a typed
 * refusal envelope.
 */
export function flyer_engine_init(seed: bigint, rho_kg_m3: number, headwind_mps: number, mode: number, member: number, rail_length_m: number, max_ticks: bigint, assist: boolean, catapult: boolean): string;

/**
 * One 120 Hz engine step. `has_input` gates whether (lever, warp)
 * is a ControlInput (Human mode requires it every tick).
 */
export function flyer_engine_step(has_input: boolean, lever_force_n: number, warp_cmd_rad: number): string;

/**
 * E7.1-ii field-lease self-test: ring -> lease -> §5.5 sample ->
 * bounded JSON (or a typed refusal envelope).
 */
export function flyer_field_selftest(): string;

/**
 * Trajectory content digest (hex) or the refusal envelope.
 */
export function flyer_hello_digest(ixx: number, iyy: number, izz: number, qw: number, qx: number, qy: number, qz: number, wx: number, wy: number, wz: number, dt_s: number, steps: number): string;

/**
 * Deterministic free rigid-body spin; returns the typed JSON envelope.
 */
export function flyer_hello_spin(ixx: number, iyy: number, izz: number, qw: number, qx: number, qy: number, qz: number, wx: number, wy: number, wz: number, dt_s: number, steps: number): string;

/**
 * The startup determinism self-test (per-lane golden; the app
 * shows the failure badge on a refusal envelope).
 */
export function flyer_selftest(): string;

/**
 * Trim iterate bit-trace (guzez.7.2.1 lane bisection).
 */
export function flyer_trim_trace(): string;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly flyer_aero_step: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number) => [number, number];
    readonly flyer_bemt_probe: () => [number, number];
    readonly flyer_buildup_probe: () => [number, number];
    readonly flyer_buildup_spread: () => [number, number];
    readonly flyer_det_probe: () => [number, number];
    readonly flyer_engine_digest: () => [number, number];
    readonly flyer_engine_init: (a: bigint, b: number, c: number, d: number, e: number, f: number, g: bigint, h: number, i: number) => [number, number];
    readonly flyer_engine_step: (a: number, b: number, c: number) => [number, number];
    readonly flyer_field_selftest: () => [number, number];
    readonly flyer_hello_digest: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number) => [number, number];
    readonly flyer_hello_spin: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number) => [number, number];
    readonly flyer_selftest: () => [number, number];
    readonly flyer_trim_trace: () => [number, number];
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
