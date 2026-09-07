/* @ts-self-types="./fs_cmaes_viz_wasm.d.ts" */

/**
 * Stateful schema-2 browser session. Construction never throws; inspect
 * `receipt()` for admission or a typed refusal packet.
 */
export class CmaesVizSession {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CmaesVizSessionFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_cmaesvizsession_free(ptr, 0);
    }
    /**
     * Return one complete row-major candidate population.
     * @returns {Float64Array}
     */
    ask() {
        const ret = wasm.cmaesvizsession_ask(this.__wbg_ptr);
        var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v1;
    }
    /**
     * Create a session from one packed configuration.
     * @param {Float64Array} config
     */
    constructor(config) {
        const ptr0 = passArrayF64ToWasm0(config, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.cmaesvizsession_new(ptr0, len0);
        this.__wbg_ptr = ret;
        CmaesVizSessionFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Return admission and the current compact snapshot.
     * @returns {Float64Array}
     */
    receipt() {
        const ret = wasm.cmaesvizsession_receipt(this.__wbg_ptr);
        var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v1;
    }
    /**
     * Tell one packed objective payload and return the updated snapshot.
     * @param {Float64Array} objectives
     * @returns {Float64Array}
     */
    tell(objectives) {
        const ptr0 = passArrayF64ToWasm0(objectives, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.cmaesvizsession_tell(this.__wbg_ptr, ptr0, len0);
        var v2 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v2;
    }
}
if (Symbol.dispose) CmaesVizSession.prototype[Symbol.dispose] = CmaesVizSession.prototype.free;

/**
 * Browser-side residual training against the real walking owner.
 *
 * The same LM-CMA search the native example runs, advanced one rollout per
 * `pump` so a tab stays responsive and the run can be stopped at any
 * point. The transformer is small enough that this needs no GPU and no
 * backprop — which is just as well, since there is nothing to
 * backpropagate through a contact solver.
 */
export class G1TransformerTrainerSession {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        G1TransformerTrainerSessionFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_g1transformertrainersession_free(ptr, 0);
    }
    /**
     * The best policy head found so far.
     * @returns {Float64Array}
     */
    best_head() {
        const ret = wasm.g1transformertrainersession_best_head(this.__wbg_ptr);
        var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v1;
    }
    /**
     * The best policy so far in the FSGT layout, ready to download.
     * @returns {Uint8Array}
     */
    export_weights() {
        const ret = wasm.g1transformertrainersession_export_weights(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * `challenge`: 0 flat, 1 terrain-with-push, anything else averages both.
     * @param {number} challenge
     * @param {number} duration_s
     * @param {number} sigma
     * @param {number} seed
     */
    constructor(challenge, duration_s, sigma, seed) {
        const ret = wasm.g1transformertrainersession_new(challenge, duration_s, sigma, seed);
        this.__wbg_ptr = ret;
        G1TransformerTrainerSessionFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Current progress without advancing the search.
     * @returns {Float64Array}
     */
    progress() {
        const ret = wasm.g1transformertrainersession_progress(this.__wbg_ptr);
        var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v1;
    }
    /**
     * Advance the search by exactly one rollout and return a progress
     * packet.
     * @returns {Float64Array}
     */
    pump() {
        const ret = wasm.g1transformertrainersession_pump(this.__wbg_ptr);
        var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v1;
    }
    /**
     * Resume from a head saved earlier. Returns the objective it scored
     * here; `f64::MAX` means the width was wrong or it did not complete.
     * It is adopted only if it beats this machine's tuned controller.
     * @param {Float64Array} head
     * @returns {number}
     */
    seed_head(head) {
        const ptr0 = passArrayF64ToWasm0(head, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.g1transformertrainersession_seed_head(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * A packed G1 trace of the best policy (`use_best`) or of the tuned
     * controller it started from, for playback on the existing stage.
     * @param {boolean} use_best
     * @returns {Float64Array}
     */
    trace_packet(use_best) {
        const ret = wasm.g1transformertrainersession_trace_packet(this.__wbg_ptr, use_best);
        var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v1;
    }
}
if (Symbol.dispose) G1TransformerTrainerSession.prototype[Symbol.dispose] = G1TransformerTrainerSession.prototype.free;

/**
 * Stateful browser evaluator for the owner-composed G1 walking problem.
 * Construction never throws; inspect `receipt()` for admission or a typed
 * refusal packet.
 */
export class G1WalkingVizEvaluator {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        G1WalkingVizEvaluatorFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_g1walkingvizevaluator_free(ptr, 0);
    }
    /**
     * Evaluate one 5,040-D policy without retaining link poses.
     * @param {Float64Array} parameters
     * @returns {Float64Array}
     */
    evaluate(parameters) {
        const ptr0 = passArrayF64ToWasm0(parameters, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.g1walkingvizevaluator_evaluate(this.__wbg_ptr, ptr0, len0);
        var v2 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v2;
    }
    /**
     * Evaluate a flat complete population in one boundary call.
     * @param {Float64Array} parameters
     * @returns {Float64Array}
     */
    evaluate_population(parameters) {
        const ptr0 = passArrayF64ToWasm0(parameters, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.g1walkingvizevaluator_evaluate_population(this.__wbg_ptr, ptr0, len0);
        var v2 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v2;
    }
    /**
     * Create an evaluator from one packed experiment configuration.
     * @param {Float64Array} config
     */
    constructor(config) {
        const ptr0 = passArrayF64ToWasm0(config, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.g1walkingvizevaluator_new(ptr0, len0);
        this.__wbg_ptr = ret;
        G1WalkingVizEvaluatorFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Return admitted controls and exact render-layout dimensions.
     * @returns {Float64Array}
     */
    receipt() {
        const ret = wasm.g1walkingvizevaluator_receipt(this.__wbg_ptr);
        var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v1;
    }
    /**
     * Return the disclosed sparse 5,040-D stabilizing curriculum mean.
     * @returns {Float64Array}
     */
    stabilizing_policy_mean() {
        const ret = wasm.g1walkingvizevaluator_stabilizing_policy_mean(this.__wbg_ptr);
        var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v1;
    }
    /**
     * Evaluate one policy and return decimated owner-derived link poses.
     * @param {Float64Array} parameters
     * @returns {Float64Array}
     */
    trace(parameters) {
        const ptr0 = passArrayF64ToWasm0(parameters, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.g1walkingvizevaluator_trace(this.__wbg_ptr, ptr0, len0);
        var v2 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v2;
    }
    /**
     * Return the disclosed sparse 5,040-D walking curriculum mean.
     * @returns {Float64Array}
     */
    walking_curriculum_mean() {
        const ret = wasm.g1walkingvizevaluator_walking_curriculum_mean(this.__wbg_ptr);
        var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v1;
    }
}
if (Symbol.dispose) G1WalkingVizEvaluator.prototype[Symbol.dispose] = G1WalkingVizEvaluator.prototype.free;

/**
 * Stateful browser evaluator for the owner-composed household-arm problem.
 * Construction never throws; inspect `receipt()` for admission or a typed
 * refusal packet.
 */
export class HouseholdManipulationVizEvaluator {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        HouseholdManipulationVizEvaluatorFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_householdmanipulationvizevaluator_free(ptr, 0);
    }
    /**
     * Return the disclosed source-feasible 128-D curriculum mean.
     * @returns {Float64Array}
     */
    curriculum_policy_mean() {
        const ret = wasm.householdmanipulationvizevaluator_curriculum_policy_mean(this.__wbg_ptr);
        var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v1;
    }
    /**
     * Evaluate one 128-D policy without retaining object/link poses.
     * @param {Float64Array} parameters
     * @returns {Float64Array}
     */
    evaluate(parameters) {
        const ptr0 = passArrayF64ToWasm0(parameters, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.householdmanipulationvizevaluator_evaluate(this.__wbg_ptr, ptr0, len0);
        var v2 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v2;
    }
    /**
     * Evaluate a flat complete population in one boundary call.
     * @param {Float64Array} parameters
     * @returns {Float64Array}
     */
    evaluate_population(parameters) {
        const ptr0 = passArrayF64ToWasm0(parameters, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.householdmanipulationvizevaluator_evaluate_population(this.__wbg_ptr, ptr0, len0);
        var v2 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v2;
    }
    /**
     * Create an evaluator from one packed experiment configuration.
     * @param {Float64Array} config
     */
    constructor(config) {
        const ptr0 = passArrayF64ToWasm0(config, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.householdmanipulationvizevaluator_new(ptr0, len0);
        this.__wbg_ptr = ret;
        HouseholdManipulationVizEvaluatorFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Return admitted controls, scene data, and render-layout dimensions.
     * @returns {Float64Array}
     */
    receipt() {
        const ret = wasm.householdmanipulationvizevaluator_receipt(this.__wbg_ptr);
        var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v1;
    }
    /**
     * Evaluate one policy and return decimated owner-derived poses.
     * @param {Float64Array} parameters
     * @returns {Float64Array}
     */
    trace(parameters) {
        const ptr0 = passArrayF64ToWasm0(parameters, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.householdmanipulationvizevaluator_trace(this.__wbg_ptr, ptr0, len0);
        var v2 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v2;
    }
}
if (Symbol.dispose) HouseholdManipulationVizEvaluator.prototype[Symbol.dispose] = HouseholdManipulationVizEvaluator.prototype.free;

/**
 * Kernel identity probe after module instantiation.
 * @returns {string}
 */
export function cmaes_viz_kernel_version() {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.cmaes_viz_kernel_version();
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

/**
 * Source identity supplied by the clean, versioned artifact build.
 * @returns {string}
 */
export function cmaes_viz_source_revision() {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.cmaes_viz_source_revision();
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}
function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg___wbindgen_throw_bb96b2010945f0bc: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbindgen_init_externref_table: function() {
            const table = wasm.__wbindgen_externrefs;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
        },
    };
    return {
        __proto__: null,
        "./fs_cmaes_viz_wasm_bg.js": import0,
    };
}

const CmaesVizSessionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_cmaesvizsession_free(ptr, 1));
const G1TransformerTrainerSessionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_g1transformertrainersession_free(ptr, 1));
const G1WalkingVizEvaluatorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_g1walkingvizevaluator_free(ptr, 1));
const HouseholdManipulationVizEvaluatorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_householdmanipulationvizevaluator_free(ptr, 1));

function getArrayF64FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat64ArrayMemory0().subarray(ptr / 8, ptr / 8 + len);
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedFloat64ArrayMemory0 = null;
function getFloat64ArrayMemory0() {
    if (cachedFloat64ArrayMemory0 === null || cachedFloat64ArrayMemory0.byteLength === 0) {
        cachedFloat64ArrayMemory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    return decodeText(ptr >>> 0, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function passArrayF64ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 8, 8) >>> 0;
    getFloat64ArrayMemory0().set(arg, ptr / 8);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;

let wasmModule, wasmInstance, wasm;
function __wbg_finalize_init(instance, module) {
    wasmInstance = instance;
    wasm = instance.exports;
    wasmModule = module;
    cachedFloat64ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (!module.ok) {
            throw new Error(`failed to fetch Wasm: ${module.status} ${module.statusText} fetching '${module.url}'`);
        }

        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('fs_cmaes_viz_wasm_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
