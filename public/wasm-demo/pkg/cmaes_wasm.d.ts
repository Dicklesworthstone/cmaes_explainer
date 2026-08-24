/* tslint:disable */
/* eslint-disable */
export function wasm_cmaes_from_state(state: any): WasmCmaes;
export function fmin(xstart: Float64Array, sigma: number, objective: Function, options?: any | null): FminResult;
export function fmin_builtin(objective_id: number, xstart: Float64Array, sigma: number, options?: any | null): FminResult;
export function fmin_restarts(xstart: Float64Array, sigma: number, objective: Function, options?: any | null): FminResult;
export class FminResult {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  stds(): Float64Array;
  xmean(): Float64Array;
  best_x(): Float64Array;
  readonly evals_best: number;
  readonly iterations: number;
  readonly evals: number;
  readonly best_f: number;
}
export class StopStatus {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  readonly tolx: boolean;
  readonly tolfun: boolean;
  readonly ftarget: boolean;
  readonly stopped: boolean;
  readonly condition: boolean;
  readonly maxfevals: boolean;
}
export class WasmCmaes {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Current covariance matrix (sigma^2 * C) flattened row-major.
   * For sep/lm engines, off-diagonal entries are zero.
   */
  cov_matrix(): Float64Array;
  stop_status(): StopStatus;
  to_json_state(): any;
  ask(): Array<any>;
  constructor(xstart: Float64Array, sigma: number, options?: any | null);
  tell(arx: Array<any>, fitvals: Float64Array): void;
  result(): FminResult;
  ask_flat(): Float64Array;
  tell_flat(fitvals: Float64Array): void;
  readonly lambda: number;
  readonly dimension: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_fminresult_free: (a: number, b: number) => void;
  readonly __wbg_stopstatus_free: (a: number, b: number) => void;
  readonly __wbg_wasmcmaes_free: (a: number, b: number) => void;
  readonly fmin: (a: any, b: number, c: any, d: number) => [number, number, number];
  readonly fmin_builtin: (a: number, b: any, c: number, d: number) => [number, number, number];
  readonly fmin_restarts: (a: any, b: number, c: any, d: number) => [number, number, number];
  readonly fminresult_best_f: (a: number) => number;
  readonly fminresult_best_x: (a: number) => any;
  readonly fminresult_evals: (a: number) => number;
  readonly fminresult_evals_best: (a: number) => number;
  readonly fminresult_iterations: (a: number) => number;
  readonly fminresult_stds: (a: number) => any;
  readonly fminresult_xmean: (a: number) => any;
  readonly stopstatus_condition: (a: number) => number;
  readonly stopstatus_ftarget: (a: number) => number;
  readonly stopstatus_maxfevals: (a: number) => number;
  readonly stopstatus_stopped: (a: number) => number;
  readonly stopstatus_tolfun: (a: number) => number;
  readonly stopstatus_tolx: (a: number) => number;
  readonly wasm_cmaes_from_state: (a: any) => [number, number, number];
  readonly wasmcmaes_ask: (a: number) => any;
  readonly wasmcmaes_ask_flat: (a: number) => any;
  readonly wasmcmaes_cov_matrix: (a: number) => any;
  readonly wasmcmaes_dimension: (a: number) => number;
  readonly wasmcmaes_lambda: (a: number) => number;
  readonly wasmcmaes_new: (a: any, b: number, c: number) => number;
  readonly wasmcmaes_result: (a: number) => number;
  readonly wasmcmaes_stop_status: (a: number) => number;
  readonly wasmcmaes_tell: (a: number, b: any, c: any) => void;
  readonly wasmcmaes_tell_flat: (a: number, b: any) => void;
  readonly wasmcmaes_to_json_state: (a: number) => [number, number, number];
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_externrefs: WebAssembly.Table;
  readonly __externref_table_dealloc: (a: number) => void;
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
