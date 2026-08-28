/* tslint:disable */
/* eslint-disable */

/**
 * Stateful schema-2 browser session. Construction never throws; inspect
 * `receipt()` for admission or a typed refusal packet.
 */
export class CmaesVizSession {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Return one complete row-major candidate population.
     */
    ask(): Float64Array;
    /**
     * Create a session from one packed configuration.
     */
    constructor(config: Float64Array);
    /**
     * Return admission and the current compact snapshot.
     */
    receipt(): Float64Array;
    /**
     * Tell one packed objective payload and return the updated snapshot.
     */
    tell(objectives: Float64Array): Float64Array;
}

/**
 * Stateful browser evaluator for the owner-composed G1 walking problem.
 * Construction never throws; inspect `receipt()` for admission or a typed
 * refusal packet.
 */
export class G1WalkingVizEvaluator {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Evaluate one 5,040-D policy without retaining link poses.
     */
    evaluate(parameters: Float64Array): Float64Array;
    /**
     * Evaluate a flat complete population in one boundary call.
     */
    evaluate_population(parameters: Float64Array): Float64Array;
    /**
     * Create an evaluator from one packed experiment configuration.
     */
    constructor(config: Float64Array);
    /**
     * Return admitted controls and exact render-layout dimensions.
     */
    receipt(): Float64Array;
    /**
     * Return the disclosed sparse 5,040-D stabilizing curriculum mean.
     */
    stabilizing_policy_mean(): Float64Array;
    /**
     * Evaluate one policy and return decimated owner-derived link poses.
     */
    trace(parameters: Float64Array): Float64Array;
    /**
     * Return the disclosed sparse 5,040-D walking curriculum mean.
     */
    walking_curriculum_mean(): Float64Array;
}

/**
 * Kernel identity probe after module instantiation.
 */
export function cmaes_viz_kernel_version(): string;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_cmaesvizsession_free: (a: number, b: number) => void;
    readonly __wbg_g1walkingvizevaluator_free: (a: number, b: number) => void;
    readonly cmaes_viz_kernel_version: () => [number, number];
    readonly cmaesvizsession_ask: (a: number) => [number, number];
    readonly cmaesvizsession_new: (a: number, b: number) => number;
    readonly cmaesvizsession_receipt: (a: number) => [number, number];
    readonly cmaesvizsession_tell: (a: number, b: number, c: number) => [number, number];
    readonly g1walkingvizevaluator_evaluate: (a: number, b: number, c: number) => [number, number];
    readonly g1walkingvizevaluator_evaluate_population: (a: number, b: number, c: number) => [number, number];
    readonly g1walkingvizevaluator_new: (a: number, b: number) => number;
    readonly g1walkingvizevaluator_receipt: (a: number) => [number, number];
    readonly g1walkingvizevaluator_stabilizing_policy_mean: (a: number) => [number, number];
    readonly g1walkingvizevaluator_trace: (a: number, b: number, c: number) => [number, number];
    readonly g1walkingvizevaluator_walking_curriculum_mean: (a: number) => [number, number];
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
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
