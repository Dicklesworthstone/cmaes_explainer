# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 2.16s | 2652 | 500us | 80 |

**Top 10:** `projectPoint` 12.4%, `slice` 10.9%, `sort` 7.5%, `(anonymous)` 7.3%, `from` 7.2%, `(anonymous)` 7.1%, `(anonymous)` 5.1%, `(anonymous)` 3.6%, `(anonymous)` 3.3%, `.wasm-function[10]` 2.8%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 12.4% | 268.9ms | 12.4% | 268.9ms | `projectPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:248` |
| 10.9% | 237.0ms | 10.9% | 237.0ms | `slice` | `[native code]` |
| 7.5% | 162.2ms | 11.2% | 241.8ms | `sort` | `[native code]` |
| 7.3% | 159.4ms | 22.0% | 476.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:330` |
| 7.2% | 155.9ms | 17.1% | 369.4ms | `from` | `[native code]` |
| 7.1% | 154.5ms | 7.1% | 154.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:336` |
| 5.1% | 112.0ms | 5.1% | 112.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts` |
| 3.6% | 78.7ms | 3.6% | 78.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:297` |
| 3.3% | 71.7ms | 5.6% | 120.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:331` |
| 2.8% | 62.5ms | 2.8% | 62.5ms | `.wasm-function[10]` | `[native code]` |
| 2.8% | 60.8ms | 3.8% | 83.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:409` |
| 2.8% | 60.4ms | 2.8% | 60.4ms | `projectPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts` |
| 2.2% | 49.2ms | 2.2% | 49.2ms | `push` | `[native code]` |
| 2.0% | 44.3ms | 2.0% | 44.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:401` |
| 2.0% | 43.6ms | 6.9% | 149.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:328` |
| 1.7% | 36.7ms | 12.4% | 267.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:371` |
| 1.6% | 36.2ms | 7.1% | 155.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:329` |
| 1.4% | 31.5ms | 1.4% | 31.5ms | `projectDirection` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:264` |
| 1.4% | 30.3ms | 97.4% | 2.10s | `map` | `[native code]` |
| 0.9% | 19.9ms | 1.8% | 40.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:302` |
| 0.9% | 19.5ms | 4.4% | 96.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:372` |
| 0.9% | 19.5ms | 0.9% | 20.3ms | `.wasm-function[84]` | `[native code]` |
| 0.7% | 17.0ms | 0.9% | 20.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:362` |
| 0.7% | 15.8ms | 1.9% | 41.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:325` |
| 0.7% | 15.7ms | 0.7% | 15.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:327` |
| 0.7% | 15.6ms | 1.2% | 26.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:394` |
| 0.6% | 14.4ms | 0.6% | 14.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:338` |
| 0.6% | 13.4ms | 0.6% | 13.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:303` |
| 0.5% | 11.2ms | 0.5% | 11.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:340` |
| 0.5% | 11.1ms | 0.5% | 11.1ms | `reverse` | `[native code]` |
| 0.5% | 11.0ms | 0.5% | 11.0ms | `projectPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:245` |
| 0.4% | 9.0ms | 4.3% | 94.9ms | `(unknown)` | `[native code]` |
| 0.3% | 8.3ms | 0.3% | 8.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:301` |
| 0.3% | 7.5ms | 0.9% | 21.0ms | `forEach` | `[native code]` |
| 0.3% | 7.0ms | 0.3% | 7.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:396` |
| 0.2% | 6.2ms | 0.2% | 6.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:292` |
| 0.2% | 6.1ms | 0.6% | 14.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:348` |
| 0.2% | 6.1ms | 0.2% | 6.1ms | `filter` | `[native code]` |
| 0.2% | 6.0ms | 14.1% | 305.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:296` |
| 0.2% | 5.9ms | 0.3% | 6.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:352` |
| 0.2% | 5.2ms | 0.3% | 6.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:360` |
| 0.2% | 4.8ms | 0.2% | 4.8ms | `projectDirection` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts` |
| 0.2% | 4.7ms | 0.4% | 9.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:312` |
| 0.2% | 4.6ms | 0.2% | 4.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:351` |
| 0.1% | 3.7ms | 0.7% | 15.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:317` |
| 0.1% | 3.2ms | 0.1% | 3.2ms | `col` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:357` |
| 0.1% | 2.7ms | 0.1% | 4.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:310` |
| 0.1% | 2.2ms | 0.4% | 9.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:393` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `col` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `projectDirection` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:263` |
| 0.0% | 1.5ms | 0.9% | 21.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:367` |
| 0.0% | 1.5ms | 0.3% | 7.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:305` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:374` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `isFinite` | `[native code]` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `projectPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:247` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `parse` | `[native code]` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:350` |
| 0.0% | 887us | 0.9% | 21.2ms | `.wasm-function[32]` | `[native code]` |
| 0.0% | 887us | 0.0% | 1.5ms | `.wasm-function[15]` | `[native code]` |
| 0.0% | 886us | 0.8% | 19.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:368` |
| 0.0% | 818us | 0.0% | 818us | `reduce` | `[native code]` |
| 0.0% | 799us | 0.0% | 799us | `sqrt` | `[native code]` |
| 0.0% | 788us | 0.0% | 788us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:299` |
| 0.0% | 771us | 0.0% | 1.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:361` |
| 0.0% | 728us | 2.9% | 63.2ms | `.wasm-function[5]` | `[native code]` |
| 0.0% | 672us | 0.0% | 672us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:375` |
| 0.0% | 659us | 0.0% | 659us | `.wasm-function[2]` | `[native code]` |
| 0.0% | 634us | 100.0% | 2.15s | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 627us | 0.0% | 627us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:404` |
| 0.0% | 623us | 0.0% | 623us | `.wasm-function[39]` | `[native code]` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 100.0% | 2.15s | 0.0% | 634us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 97.4% | 2.10s | 1.4% | 30.3ms | `map` | `[native code]` |
| 22.0% | 476.0ms | 7.3% | 159.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:330` |
| 17.1% | 369.4ms | 7.2% | 155.9ms | `from` | `[native code]` |
| 14.1% | 305.0ms | 0.2% | 6.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:296` |
| 12.4% | 268.9ms | 12.4% | 268.9ms | `projectPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:248` |
| 12.4% | 267.9ms | 1.7% | 36.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:371` |
| 11.2% | 241.8ms | 7.5% | 162.2ms | `sort` | `[native code]` |
| 10.9% | 237.0ms | 10.9% | 237.0ms | `slice` | `[native code]` |
| 7.1% | 155.2ms | 1.6% | 36.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:329` |
| 7.1% | 154.5ms | 7.1% | 154.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:336` |
| 6.9% | 149.9ms | 2.0% | 43.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:328` |
| 5.6% | 120.9ms | 3.3% | 71.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:331` |
| 5.1% | 112.0ms | 5.1% | 112.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts` |
| 4.4% | 96.2ms | 0.9% | 19.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:372` |
| 4.3% | 94.9ms | 0.0% | 0us | `cmaes_viz_run` | `/Users/jemanuel/projects/cmaes_explainer/public/wasm/fs-cmaes/fs_cmaes_viz_wasm.js:48` |
| 4.3% | 94.9ms | 0.4% | 9.0ms | `(unknown)` | `[native code]` |
| 3.9% | 85.8ms | 0.0% | 0us | `.wasm-function[83]` | `[native code]` |
| 3.8% | 83.9ms | 2.8% | 60.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:409` |
| 3.6% | 78.7ms | 3.6% | 78.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:297` |
| 2.9% | 63.2ms | 0.0% | 728us | `.wasm-function[5]` | `[native code]` |
| 2.8% | 62.5ms | 2.8% | 62.5ms | `.wasm-function[10]` | `[native code]` |
| 2.8% | 60.4ms | 2.8% | 60.4ms | `projectPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts` |
| 2.2% | 49.2ms | 2.2% | 49.2ms | `push` | `[native code]` |
| 2.0% | 44.3ms | 2.0% | 44.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:401` |
| 1.9% | 41.1ms | 0.7% | 15.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:325` |
| 1.8% | 40.9ms | 0.9% | 19.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:302` |
| 1.4% | 31.5ms | 1.4% | 31.5ms | `projectDirection` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:264` |
| 1.2% | 26.7ms | 0.7% | 15.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:394` |
| 0.9% | 21.2ms | 0.0% | 887us | `.wasm-function[32]` | `[native code]` |
| 0.9% | 21.0ms | 0.0% | 0us | `.wasm-function[28]` | `[native code]` |
| 0.9% | 21.0ms | 0.0% | 1.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:367` |
| 0.9% | 21.0ms | 0.3% | 7.5ms | `forEach` | `[native code]` |
| 0.9% | 20.3ms | 0.9% | 19.5ms | `.wasm-function[84]` | `[native code]` |
| 0.9% | 20.3ms | 0.0% | 0us | `.wasm-function[49]` | `[native code]` |
| 0.9% | 20.2ms | 0.7% | 17.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:362` |
| 0.8% | 19.3ms | 0.0% | 886us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:368` |
| 0.7% | 15.7ms | 0.7% | 15.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:327` |
| 0.7% | 15.5ms | 0.1% | 3.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:317` |
| 0.6% | 14.4ms | 0.6% | 14.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:338` |
| 0.6% | 14.2ms | 0.2% | 6.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:348` |
| 0.6% | 13.4ms | 0.6% | 13.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:303` |
| 0.5% | 11.2ms | 0.5% | 11.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:340` |
| 0.5% | 11.1ms | 0.5% | 11.1ms | `reverse` | `[native code]` |
| 0.5% | 11.0ms | 0.5% | 11.0ms | `projectPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:245` |
| 0.4% | 9.4ms | 0.2% | 4.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:312` |
| 0.4% | 9.4ms | 0.1% | 2.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:393` |
| 0.3% | 8.3ms | 0.3% | 8.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:301` |
| 0.3% | 7.6ms | 0.0% | 1.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:305` |
| 0.3% | 7.0ms | 0.3% | 7.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:396` |
| 0.3% | 6.7ms | 0.2% | 5.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:360` |
| 0.3% | 6.7ms | 0.2% | 5.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:352` |
| 0.2% | 6.2ms | 0.2% | 6.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:292` |
| 0.2% | 6.1ms | 0.2% | 6.1ms | `filter` | `[native code]` |
| 0.2% | 4.8ms | 0.2% | 4.8ms | `projectDirection` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts` |
| 0.2% | 4.6ms | 0.2% | 4.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:351` |
| 0.1% | 4.2ms | 0.1% | 2.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:310` |
| 0.1% | 3.2ms | 0.1% | 3.2ms | `col` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:357` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `col` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts` |
| 0.0% | 1.5ms | 0.0% | 771us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:361` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `projectDirection` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:263` |
| 0.0% | 1.5ms | 0.0% | 887us | `.wasm-function[15]` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:374` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `isFinite` | `[native code]` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `projectPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:247` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `parse` | `[native code]` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:350` |
| 0.0% | 887us | 0.0% | 0us | `.wasm-function[26]` | `[native code]` |
| 0.0% | 887us | 0.0% | 0us | `.wasm-function[29]` | `[native code]` |
| 0.0% | 818us | 0.0% | 818us | `reduce` | `[native code]` |
| 0.0% | 818us | 0.0% | 0us | `wasmRunToNdStates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:279` |
| 0.0% | 799us | 0.0% | 799us | `sqrt` | `[native code]` |
| 0.0% | 788us | 0.0% | 788us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:299` |
| 0.0% | 672us | 0.0% | 672us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:375` |
| 0.0% | 659us | 0.0% | 0us | `.wasm-function[36]` | `[native code]` |
| 0.0% | 659us | 0.0% | 659us | `.wasm-function[2]` | `[native code]` |
| 0.0% | 627us | 0.0% | 627us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:404` |
| 0.0% | 623us | 0.0% | 0us | `.wasm-function[69]` | `[native code]` |
| 0.0% | 623us | 0.0% | 623us | `.wasm-function[39]` | `[native code]` |
| 0.0% | 623us | 0.0% | 0us | `.wasm-function[20]` | `[native code]` |

## Function Details

### `projectPoint`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:248` | Self: 12.4% (268.9ms) | Total: 12.4% (268.9ms) | Samples: 348

**Called by:**
- `(anonymous)` (325)
- `(anonymous)` (23)

### `slice`
`[native code]` | Self: 10.9% (237.0ms) | Total: 10.9% (237.0ms) | Samples: 299

**Called by:**
- `(anonymous)` (150)
- `(anonymous)` (134)
- `(anonymous)` (9)
- `(anonymous)` (6)

### `sort`
`[native code]` | Self: 7.5% (162.2ms) | Total: 11.2% (241.8ms) | Samples: 208

**Called by:**
- `(anonymous)` (311)

**Calls:**
- `(anonymous)` (102)
- `(anonymous)` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:330` | Self: 7.3% (159.4ms) | Total: 22.0% (476.0ms) | Samples: 206

**Called by:**
- `map` (616)

**Calls:**
- `projectPoint` (325)
- `projectPoint` (70)
- `projectPoint` (13)
- `projectPoint` (2)

### `from`
`[native code]` | Self: 7.2% (155.9ms) | Total: 17.1% (369.4ms) | Samples: 199

**Called by:**
- `(anonymous)` (290)
- `(anonymous)` (97)
- `(anonymous)` (75)
- `from` (6)

**Calls:**
- `(anonymous)` (138)
- `(anonymous)` (122)
- `from` (6)
- `(anonymous)` (2)
- `(anonymous)` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:336` | Self: 7.1% (154.5ms) | Total: 7.1% (154.5ms) | Samples: 202

**Called by:**
- `map` (202)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts` | Self: 5.1% (112.0ms) | Total: 5.1% (112.0ms) | Samples: 140

**Called by:**
- `from` (138)
- `map` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:297` | Self: 3.6% (78.7ms) | Total: 3.6% (78.7ms) | Samples: 102

**Called by:**
- `sort` (102)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:331` | Self: 3.3% (71.7ms) | Total: 5.6% (120.9ms) | Samples: 82

**Called by:**
- `map` (145)

**Calls:**
- `push` (63)

### `.wasm-function[10]`
`[native code]` | Self: 2.8% (62.5ms) | Total: 2.8% (62.5ms) | Samples: 4

**Called by:**
- `.wasm-function[5]` (4)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:409` | Self: 2.8% (60.8ms) | Total: 3.8% (83.9ms) | Samples: 78

**Called by:**
- `map` (108)

**Calls:**
- `map` (30)

### `projectPoint`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts` | Self: 2.8% (60.4ms) | Total: 2.8% (60.4ms) | Samples: 77

**Called by:**
- `(anonymous)` (70)
- `(anonymous)` (7)

### `push`
`[native code]` | Self: 2.2% (49.2ms) | Total: 2.2% (49.2ms) | Samples: 63

**Called by:**
- `(anonymous)` (63)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:401` | Self: 2.0% (44.3ms) | Total: 2.0% (44.3ms) | Samples: 54

**Called by:**
- `map` (54)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:328` | Self: 2.0% (43.6ms) | Total: 6.9% (149.9ms) | Samples: 56

**Called by:**
- `map` (190)

**Calls:**
- `slice` (134)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:371` | Self: 1.7% (36.7ms) | Total: 12.4% (267.9ms) | Samples: 46

**Called by:**
- `map` (336)

**Calls:**
- `from` (290)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:329` | Self: 1.6% (36.2ms) | Total: 7.1% (155.2ms) | Samples: 48

**Called by:**
- `map` (198)

**Calls:**
- `slice` (150)

### `projectDirection`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:264` | Self: 1.4% (31.5ms) | Total: 1.4% (31.5ms) | Samples: 41

**Called by:**
- `(anonymous)` (21)
- `(anonymous)` (20)

### `map`
`[native code]` | Self: 1.4% (30.3ms) | Total: 97.4% (2.10s) | Samples: 38

**Called by:**
- `(module)` (2633)
- `(anonymous)` (30)
- `(anonymous)` (15)
- `(anonymous)` (10)

**Calls:**
- `(anonymous)` (616)
- `(anonymous)` (394)
- `(anonymous)` (336)
- `(anonymous)` (202)
- `(anonymous)` (198)
- `(anonymous)` (190)
- `(anonymous)` (145)
- `(anonymous)` (108)
- `(anonymous)` (54)
- `(anonymous)` (54)
- `(anonymous)` (51)
- `(anonymous)` (35)
- `(anonymous)` (28)
- `(anonymous)` (26)
- `(anonymous)` (24)
- `(anonymous)` (20)
- `(anonymous)` (20)
- `(anonymous)` (19)
- `(anonymous)` (18)
- `(anonymous)` (14)
- `(anonymous)` (12)
- `(anonymous)` (12)
- `(anonymous)` (11)
- `(anonymous)` (10)
- `(anonymous)` (9)
- `(anonymous)` (9)
- `(anonymous)` (8)
- `(anonymous)` (8)
- `(anonymous)` (6)
- `(anonymous)` (6)
- `(anonymous)` (2)
- `(anonymous)` (2)
- `(anonymous)` (2)
- `(anonymous)` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:302` | Self: 0.9% (19.9ms) | Total: 1.8% (40.9ms) | Samples: 26

**Called by:**
- `map` (54)

**Calls:**
- `forEach` (28)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:372` | Self: 0.9% (19.5ms) | Total: 4.4% (96.2ms) | Samples: 25

**Called by:**
- `from` (122)

**Calls:**
- `from` (97)

### `.wasm-function[84]`
`[native code]` | Self: 0.9% (19.5ms) | Total: 0.9% (20.3ms) | Samples: 3

**Called by:**
- `.wasm-function[28]` (4)

**Calls:**
- `.wasm-function[26]` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:362` | Self: 0.7% (17.0ms) | Total: 0.9% (20.2ms) | Samples: 22

**Called by:**
- `map` (26)

**Calls:**
- `col` (3)
- `col` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:325` | Self: 0.7% (15.8ms) | Total: 1.9% (41.1ms) | Samples: 20

**Called by:**
- `map` (51)

**Calls:**
- `projectPoint` (23)
- `projectPoint` (7)
- `projectPoint` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:327` | Self: 0.7% (15.7ms) | Total: 0.7% (15.7ms) | Samples: 20

**Called by:**
- `map` (20)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:394` | Self: 0.7% (15.6ms) | Total: 1.2% (26.7ms) | Samples: 20

**Called by:**
- `map` (35)

**Calls:**
- `reverse` (15)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:338` | Self: 0.6% (14.4ms) | Total: 0.6% (14.4ms) | Samples: 19

**Called by:**
- `map` (19)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:303` | Self: 0.6% (13.4ms) | Total: 0.6% (13.4ms) | Samples: 18

**Called by:**
- `forEach` (18)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:340` | Self: 0.5% (11.2ms) | Total: 0.5% (11.2ms) | Samples: 14

**Called by:**
- `map` (14)

### `reverse`
`[native code]` | Self: 0.5% (11.1ms) | Total: 0.5% (11.1ms) | Samples: 15

**Called by:**
- `(anonymous)` (15)

### `projectPoint`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:245` | Self: 0.5% (11.0ms) | Total: 0.5% (11.0ms) | Samples: 14

**Called by:**
- `(anonymous)` (13)
- `(anonymous)` (1)

### `(unknown)`
`[native code]` | Self: 0.4% (9.0ms) | Total: 4.3% (94.9ms) | Samples: 3

**Called by:**
- `cmaes_viz_run` (15)

**Calls:**
- `.wasm-function[83]` (12)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:301` | Self: 0.3% (8.3ms) | Total: 0.3% (8.3ms) | Samples: 11

**Called by:**
- `map` (11)

### `forEach`
`[native code]` | Self: 0.3% (7.5ms) | Total: 0.9% (21.0ms) | Samples: 10

**Called by:**
- `(anonymous)` (28)

**Calls:**
- `(anonymous)` (18)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:396` | Self: 0.3% (7.0ms) | Total: 0.3% (7.0ms) | Samples: 8

**Called by:**
- `map` (8)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:292` | Self: 0.2% (6.2ms) | Total: 0.2% (6.2ms) | Samples: 8

**Called by:**
- `map` (8)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:348` | Self: 0.2% (6.1ms) | Total: 0.6% (14.2ms) | Samples: 8

**Called by:**
- `map` (18)

**Calls:**
- `map` (10)

### `filter`
`[native code]` | Self: 0.2% (6.1ms) | Total: 0.2% (6.1ms) | Samples: 8

**Called by:**
- `(anonymous)` (8)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:296` | Self: 0.2% (6.0ms) | Total: 14.1% (305.0ms) | Samples: 8

**Called by:**
- `map` (394)

**Calls:**
- `sort` (311)
- `from` (75)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:352` | Self: 0.2% (5.9ms) | Total: 0.3% (6.7ms) | Samples: 8

**Called by:**
- `map` (9)

**Calls:**
- `sqrt` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:360` | Self: 0.2% (5.2ms) | Total: 0.3% (6.7ms) | Samples: 7

**Called by:**
- `map` (9)

**Calls:**
- `col` (1)
- `col` (1)

### `projectDirection`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts` | Self: 0.2% (4.8ms) | Total: 0.2% (4.8ms) | Samples: 6

**Called by:**
- `(anonymous)` (3)
- `(anonymous)` (3)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:312` | Self: 0.2% (4.7ms) | Total: 0.4% (9.4ms) | Samples: 6

**Called by:**
- `map` (12)

**Calls:**
- `slice` (6)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:351` | Self: 0.2% (4.6ms) | Total: 0.2% (4.6ms) | Samples: 6

**Called by:**
- `map` (6)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:317` | Self: 0.1% (3.7ms) | Total: 0.7% (15.5ms) | Samples: 5

**Called by:**
- `map` (20)

**Calls:**
- `map` (15)

### `col`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:357` | Self: 0.1% (3.2ms) | Total: 0.1% (3.2ms) | Samples: 4

**Called by:**
- `(anonymous)` (3)
- `(anonymous)` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:310` | Self: 0.1% (2.7ms) | Total: 0.1% (4.2ms) | Samples: 4

**Called by:**
- `map` (6)

**Calls:**
- `isFinite` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:393` | Self: 0.1% (2.2ms) | Total: 0.4% (9.4ms) | Samples: 3

**Called by:**
- `map` (12)

**Calls:**
- `slice` (9)

### `col`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts` | Self: 0.0% (2.1ms) | Total: 0.0% (2.1ms) | Samples: 3

**Called by:**
- `(anonymous)` (1)
- `(anonymous)` (1)
- `(anonymous)` (1)

### `projectDirection`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:263` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `(anonymous)` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:367` | Self: 0.0% (1.5ms) | Total: 0.9% (21.0ms) | Samples: 2

**Called by:**
- `map` (28)

**Calls:**
- `projectDirection` (21)
- `projectDirection` (3)
- `projectDirection` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:305` | Self: 0.0% (1.5ms) | Total: 0.3% (7.6ms) | Samples: 2

**Called by:**
- `map` (10)

**Calls:**
- `filter` (8)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:374` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `from` (2)

### `isFinite`
`[native code]` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `(anonymous)` (2)

### `projectPoint`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:247` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `(anonymous)` (2)

### `parse`
`[native code]` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `(module)` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:350` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `map` (2)

### `.wasm-function[32]`
`[native code]` | Self: 0.0% (887us) | Total: 0.9% (21.2ms) | Samples: 1

**Called by:**
- `.wasm-function[83]` (5)

**Calls:**
- `.wasm-function[49]` (4)

### `.wasm-function[15]`
`[native code]` | Self: 0.0% (887us) | Total: 0.0% (1.5ms) | Samples: 1

**Called by:**
- `.wasm-function[28]` (1)
- `.wasm-function[29]` (1)

**Calls:**
- `.wasm-function[2]` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:368` | Self: 0.0% (886us) | Total: 0.8% (19.3ms) | Samples: 1

**Called by:**
- `map` (24)

**Calls:**
- `projectDirection` (20)
- `projectDirection` (3)

### `reduce`
`[native code]` | Self: 0.0% (818us) | Total: 0.0% (818us) | Samples: 1

**Called by:**
- `wasmRunToNdStates` (1)

### `sqrt`
`[native code]` | Self: 0.0% (799us) | Total: 0.0% (799us) | Samples: 1

**Called by:**
- `(anonymous)` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:299` | Self: 0.0% (788us) | Total: 0.0% (788us) | Samples: 1

**Called by:**
- `sort` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:361` | Self: 0.0% (771us) | Total: 0.0% (1.5ms) | Samples: 1

**Called by:**
- `map` (2)

**Calls:**
- `col` (1)

### `.wasm-function[5]`
`[native code]` | Self: 0.0% (728us) | Total: 2.9% (63.2ms) | Samples: 1

**Called by:**
- `.wasm-function[83]` (5)

**Calls:**
- `.wasm-function[10]` (4)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:375` | Self: 0.0% (672us) | Total: 0.0% (672us) | Samples: 1

**Called by:**
- `from` (1)

### `.wasm-function[2]`
`[native code]` | Self: 0.0% (659us) | Total: 0.0% (659us) | Samples: 1

**Called by:**
- `.wasm-function[15]` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 0.0% (634us) | Total: 100.0% (2.15s) | Samples: 1

**Calls:**
- `map` (2633)
- `cmaes_viz_run` (15)
- `parse` (2)
- `wasmRunToNdStates` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:404` | Self: 0.0% (627us) | Total: 0.0% (627us) | Samples: 1

**Called by:**
- `map` (1)

### `.wasm-function[39]`
`[native code]` | Self: 0.0% (623us) | Total: 0.0% (623us) | Samples: 1

**Called by:**
- `.wasm-function[20]` (1)

### `.wasm-function[26]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (887us) | Samples: 0

**Called by:**
- `.wasm-function[84]` (1)

**Calls:**
- `.wasm-function[29]` (1)

### `.wasm-function[36]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (659us) | Samples: 0

**Called by:**
- `.wasm-function[83]` (1)

**Calls:**
- `.wasm-function[28]` (1)

### `.wasm-function[28]`
`[native code]` | Self: 0.0% (0us) | Total: 0.9% (21.0ms) | Samples: 0

**Called by:**
- `.wasm-function[49]` (4)
- `.wasm-function[36]` (1)

**Calls:**
- `.wasm-function[84]` (4)
- `.wasm-function[15]` (1)

### `wasmRunToNdStates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:279` | Self: 0.0% (0us) | Total: 0.0% (818us) | Samples: 0

**Called by:**
- `(module)` (1)

**Calls:**
- `reduce` (1)

### `.wasm-function[69]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (623us) | Samples: 0

**Called by:**
- `.wasm-function[83]` (1)

**Calls:**
- `.wasm-function[20]` (1)

### `.wasm-function[29]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (887us) | Samples: 0

**Called by:**
- `.wasm-function[26]` (1)

**Calls:**
- `.wasm-function[15]` (1)

### `.wasm-function[49]`
`[native code]` | Self: 0.0% (0us) | Total: 0.9% (20.3ms) | Samples: 0

**Called by:**
- `.wasm-function[32]` (4)

**Calls:**
- `.wasm-function[28]` (4)

### `.wasm-function[20]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (623us) | Samples: 0

**Called by:**
- `.wasm-function[69]` (1)

**Calls:**
- `.wasm-function[39]` (1)

### `.wasm-function[83]`
`[native code]` | Self: 0.0% (0us) | Total: 3.9% (85.8ms) | Samples: 0

**Called by:**
- `(unknown)` (12)

**Calls:**
- `.wasm-function[5]` (5)
- `.wasm-function[32]` (5)
- `.wasm-function[69]` (1)
- `.wasm-function[36]` (1)

### `cmaes_viz_run`
`/Users/jemanuel/projects/cmaes_explainer/public/wasm/fs-cmaes/fs_cmaes_viz_wasm.js:48` | Self: 0.0% (0us) | Total: 4.3% (94.9ms) | Samples: 0

**Called by:**
- `(module)` (15)

**Calls:**
- `(unknown)` (15)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 64.8% | 1.39s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts` |
| 35.1% | 758.9ms | `[native code]` |
| 0.0% | 634us | `/Users/jemanuel/projects/cmaes_explainer/[eval]` |
