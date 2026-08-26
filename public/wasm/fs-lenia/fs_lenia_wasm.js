/* @ts-self-types="./fs_lenia_wasm.d.ts" */

/**
 * Zero the display field.
 */
export function lenia_clear() {
    wasm.lenia_clear();
}

/**
 * Fitness rollout from the frozen snapshot: `steps` Lenia steps at eval
 * resolution, scored with the site's objective
 * mean(interface - 2·|mass - 0.25|). Returns `{"ok":{"score":..}}`.
 * @param {number} mu
 * @param {number} sigma
 * @param {number} dt
 * @param {number} steps
 * @returns {string}
 */
export function lenia_eval(mu, sigma, dt, steps) {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.lenia_eval(mu, sigma, dt, steps);
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

/**
 * Allocate the simulation. size: power of two in 64..=512; eval_size
 * must divide it (the CMA-ES fitness rollouts run at this resolution);
 * rel_radius: ring kernel radius as a fraction of size (~0.052 mirrors
 * the site's 96-cell fallback). Returns `{"ok":{"size","kernelRadius"}}`.
 * @param {number} size
 * @param {number} eval_size
 * @param {number} rel_radius
 * @returns {string}
 */
export function lenia_init(size, eval_size, rel_radius) {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.lenia_init(size, eval_size, rel_radius);
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

/**
 * Colormap the current display field into the internal RGBA buffer.
 */
export function lenia_render() {
    wasm.lenia_render();
}

/**
 * @returns {number}
 */
export function lenia_rgba_len() {
    const ret = wasm.lenia_rgba_len();
    return ret >>> 0;
}

/**
 * Pointer/length of the RGBA buffer inside wasm memory. The buffer is
 * allocated once at init and never reallocated, so the pointer stays
 * valid until the next lenia_init; the page rewraps it per frame in
 * case wasm memory grows.
 * @returns {number}
 */
export function lenia_rgba_ptr() {
    const ret = wasm.lenia_rgba_ptr();
    return ret >>> 0;
}

/**
 * Additively seed a hollow gaussian ring at (cx, cy) in grid cells.
 * @param {number} cx
 * @param {number} cy
 * @param {number} radius
 * @param {number} ring_frac
 * @param {number} width
 * @param {number} intensity
 */
export function lenia_seed_ring(cx, cy, radius, ring_frac, width, intensity) {
    wasm.lenia_seed_ring(cx, cy, radius, ring_frac, width, intensity);
}

/**
 * Freeze the current display field (box-averaged to eval resolution) as
 * the seed every subsequent lenia_eval rollout starts from.
 */
export function lenia_snapshot_eval() {
    wasm.lenia_snapshot_eval();
}

/**
 * Advance the display field `steps` times. Returns the LAST step's
 * metrics: `{"ok":{"interface":..,"mass":..}}`.
 * @param {number} mu
 * @param {number} sigma
 * @param {number} dt
 * @param {number} steps
 * @returns {string}
 */
export function lenia_step(mu, sigma, dt, steps) {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.lenia_step(mu, sigma, dt, steps);
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

/**
 * Kernel identity probe (capability check after instantiation).
 * @returns {string}
 */
export function lenia_version() {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.lenia_version();
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
        "./fs_lenia_wasm_bg.js": import0,
    };
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

let wasmModule, wasmInstance, wasm;
function __wbg_finalize_init(instance, module) {
    wasmInstance = instance;
    wasm = instance.exports;
    wasmModule = module;
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
        module_or_path = new URL('fs_lenia_wasm_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
