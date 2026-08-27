# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 3.03s | 3795 | 500us | 92 |

**Top 10:** `(anonymous)` 35.8%, `(anonymous)` 11.5%, `(anonymous)` 6.5%, `from` 5.8%, `sort` 5.6%, `slice` 5.2%, `(anonymous)` 2.8%, `(anonymous)` 2.5%, `(anonymous)` 2.5%, `(anonymous)` 2.1%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 35.8% | 1.08s | 35.8% | 1.08s | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:334` |
| 11.5% | 348.3ms | 11.5% | 348.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:333` |
| 6.5% | 199.4ms | 6.5% | 199.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:343` |
| 5.8% | 177.8ms | 12.5% | 380.0ms | `from` | `[native code]` |
| 5.6% | 171.1ms | 8.2% | 250.2ms | `sort` | `[native code]` |
| 5.2% | 158.3ms | 5.2% | 158.3ms | `slice` | `[native code]` |
| 2.8% | 85.4ms | 5.3% | 162.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:329` |
| 2.5% | 78.3ms | 2.5% | 78.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:297` |
| 2.5% | 76.2ms | 2.5% | 76.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts` |
| 2.1% | 66.0ms | 3.5% | 108.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:336` |
| 2.0% | 62.7ms | 2.0% | 62.7ms | `.wasm-function[10]` | `[native code]` |
| 1.5% | 47.0ms | 2.2% | 67.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:414` |
| 1.4% | 42.6ms | 1.4% | 42.6ms | `push` | `[native code]` |
| 1.2% | 38.4ms | 2.0% | 60.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:302` |
| 1.1% | 35.0ms | 98.2% | 2.97s | `map` | `[native code]` |
| 0.8% | 26.3ms | 3.4% | 105.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:328` |
| 0.8% | 24.9ms | 0.8% | 24.9ms | `projectDirection` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:264` |
| 0.6% | 20.6ms | 1.6% | 50.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:325` |
| 0.6% | 20.3ms | 3.9% | 118.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:377` |
| 0.6% | 19.9ms | 0.6% | 19.9ms | `projectPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:248` |
| 0.6% | 19.6ms | 0.7% | 23.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:367` |
| 0.6% | 19.4ms | 0.6% | 19.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:303` |
| 0.6% | 19.3ms | 7.9% | 239.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:376` |
| 0.6% | 19.1ms | 0.6% | 20.0ms | `.wasm-function[84]` | `[native code]` |
| 0.5% | 17.0ms | 0.9% | 27.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:399` |
| 0.5% | 16.3ms | 0.5% | 16.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:406` |
| 0.3% | 10.2ms | 0.3% | 10.2ms | `reverse` | `[native code]` |
| 0.3% | 9.7ms | 0.3% | 12.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:357` |
| 0.2% | 8.6ms | 10.4% | 316.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:296` |
| 0.2% | 7.7ms | 0.2% | 7.7ms | `filter` | `[native code]` |
| 0.2% | 7.1ms | 0.2% | 7.1ms | `col` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:362` |
| 0.2% | 7.0ms | 0.2% | 7.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:345` |
| 0.2% | 6.4ms | 0.2% | 6.4ms | `projectPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts` |
| 0.1% | 4.4ms | 0.1% | 4.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:401` |
| 0.1% | 4.2ms | 0.3% | 11.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:305` |
| 0.1% | 3.9ms | 2.8% | 87.5ms | `(unknown)` | `[native code]` |
| 0.1% | 3.6ms | 0.1% | 3.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:331` |
| 0.1% | 3.6ms | 0.5% | 17.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:353` |
| 0.1% | 3.2ms | 0.1% | 3.2ms | `projectDirection` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts` |
| 0.1% | 3.1ms | 0.4% | 13.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:317` |
| 0.1% | 3.1ms | 0.1% | 5.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:312` |
| 0.1% | 3.0ms | 0.4% | 12.3ms | `anonymous` | `[native code]` |
| 0.1% | 3.0ms | 0.1% | 3.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:301` |
| 0.1% | 3.0ms | 0.1% | 3.0ms | `sqrt` | `[native code]` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:292` |
| 0.0% | 2.9ms | 0.7% | 22.3ms | `forEach` | `[native code]` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `col` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `projectPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:247` |
| 0.0% | 2.2ms | 99.8% | 3.02s | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:327` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `reduce` | `[native code]` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `decode` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `projectDirection` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:263` |
| 0.0% | 1.4ms | 0.0% | 2.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:356` |
| 0.0% | 901us | 0.0% | 901us | `parse` | `[native code]` |
| 0.0% | 888us | 0.0% | 888us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:380` |
| 0.0% | 883us | 0.0% | 883us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:407` |
| 0.0% | 872us | 0.0% | 872us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:342` |
| 0.0% | 857us | 0.0% | 857us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:337` |
| 0.0% | 854us | 0.0% | 854us | `.wasm-function[15]` | `[native code]` |
| 0.0% | 833us | 0.6% | 20.8ms | `.wasm-function[32]` | `[native code]` |
| 0.0% | 798us | 0.0% | 798us | `wasmRunToNdStates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:281` |
| 0.0% | 778us | 0.0% | 778us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:344` |
| 0.0% | 750us | 0.0% | 750us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:355` |
| 0.0% | 738us | 0.0% | 738us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:338` |
| 0.0% | 737us | 0.5% | 15.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:373` |
| 0.0% | 737us | 0.0% | 1.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:398` |
| 0.0% | 734us | 0.0% | 734us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:379` |
| 0.0% | 731us | 0.0% | 1.4ms | `readFileSync` | `[native code]` |
| 0.0% | 725us | 0.0% | 725us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:299` |
| 0.0% | 702us | 0.0% | 702us | `@lazy` | `[native code]` |
| 0.0% | 653us | 0.0% | 2.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:365` |
| 0.0% | 650us | 0.0% | 650us | `projectPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:245` |
| 0.0% | 526us | 0.5% | 15.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:372` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 99.8% | 3.02s | 0.0% | 2.2ms | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 98.2% | 2.97s | 1.1% | 35.0ms | `map` | `[native code]` |
| 35.8% | 1.08s | 35.8% | 1.08s | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:334` |
| 12.5% | 380.0ms | 5.8% | 177.8ms | `from` | `[native code]` |
| 11.5% | 348.3ms | 11.5% | 348.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:333` |
| 10.4% | 316.0ms | 0.2% | 8.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:296` |
| 8.2% | 250.2ms | 5.6% | 171.1ms | `sort` | `[native code]` |
| 7.9% | 239.9ms | 0.6% | 19.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:376` |
| 6.5% | 199.4ms | 6.5% | 199.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:343` |
| 5.3% | 162.3ms | 2.8% | 85.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:329` |
| 5.2% | 158.3ms | 5.2% | 158.3ms | `slice` | `[native code]` |
| 3.9% | 118.6ms | 0.6% | 20.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:377` |
| 3.5% | 108.6ms | 2.1% | 66.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:336` |
| 3.4% | 105.2ms | 0.8% | 26.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:328` |
| 2.8% | 87.5ms | 0.0% | 0us | `cmaes_viz_run` | `/Users/jemanuel/projects/cmaes_explainer/public/wasm/fs-cmaes/fs_cmaes_viz_wasm.js:48` |
| 2.8% | 87.5ms | 0.1% | 3.9ms | `(unknown)` | `[native code]` |
| 2.7% | 83.5ms | 0.0% | 0us | `.wasm-function[83]` | `[native code]` |
| 2.5% | 78.3ms | 2.5% | 78.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:297` |
| 2.5% | 76.2ms | 2.5% | 76.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts` |
| 2.2% | 67.7ms | 1.5% | 47.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:414` |
| 2.0% | 62.7ms | 2.0% | 62.7ms | `.wasm-function[10]` | `[native code]` |
| 2.0% | 60.7ms | 1.2% | 38.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:302` |
| 1.8% | 55.5ms | 0.0% | 0us | `.wasm-function[5]` | `[native code]` |
| 1.6% | 50.0ms | 0.6% | 20.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:325` |
| 1.4% | 42.6ms | 1.4% | 42.6ms | `push` | `[native code]` |
| 0.9% | 27.3ms | 0.5% | 17.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:399` |
| 0.8% | 24.9ms | 0.8% | 24.9ms | `projectDirection` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:264` |
| 0.7% | 23.0ms | 0.6% | 19.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:367` |
| 0.7% | 22.3ms | 0.0% | 2.9ms | `forEach` | `[native code]` |
| 0.6% | 20.8ms | 0.0% | 833us | `.wasm-function[32]` | `[native code]` |
| 0.6% | 20.0ms | 0.6% | 19.1ms | `.wasm-function[84]` | `[native code]` |
| 0.6% | 20.0ms | 0.0% | 0us | `.wasm-function[28]` | `[native code]` |
| 0.6% | 20.0ms | 0.0% | 0us | `.wasm-function[49]` | `[native code]` |
| 0.6% | 19.9ms | 0.6% | 19.9ms | `projectPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:248` |
| 0.6% | 19.4ms | 0.6% | 19.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:303` |
| 0.5% | 17.8ms | 0.1% | 3.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:353` |
| 0.5% | 16.3ms | 0.5% | 16.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:406` |
| 0.5% | 15.8ms | 0.0% | 737us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:373` |
| 0.5% | 15.2ms | 0.0% | 526us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:372` |
| 0.4% | 13.2ms | 0.1% | 3.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:317` |
| 0.4% | 12.3ms | 0.1% | 3.0ms | `anonymous` | `[native code]` |
| 0.3% | 12.0ms | 0.3% | 9.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:357` |
| 0.3% | 11.9ms | 0.1% | 4.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:305` |
| 0.3% | 10.2ms | 0.3% | 10.2ms | `reverse` | `[native code]` |
| 0.2% | 7.7ms | 0.2% | 7.7ms | `filter` | `[native code]` |
| 0.2% | 7.1ms | 0.2% | 7.1ms | `col` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:362` |
| 0.2% | 7.0ms | 0.2% | 7.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:345` |
| 0.2% | 6.4ms | 0.2% | 6.4ms | `projectPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts` |
| 0.1% | 5.2ms | 0.1% | 3.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:312` |
| 0.1% | 4.4ms | 0.1% | 4.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:401` |
| 0.1% | 3.9ms | 0.0% | 0us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:366` |
| 0.1% | 3.7ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.1% | 3.7ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.1% | 3.6ms | 0.1% | 3.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:331` |
| 0.1% | 3.2ms | 0.1% | 3.2ms | `projectDirection` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts` |
| 0.1% | 3.0ms | 0.1% | 3.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:301` |
| 0.1% | 3.0ms | 0.1% | 3.0ms | `sqrt` | `[native code]` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:292` |
| 0.0% | 2.8ms | 0.0% | 653us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:365` |
| 0.0% | 2.3ms | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 2.3ms | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `col` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `projectPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:247` |
| 0.0% | 2.2ms | 0.0% | 1.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:356` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:327` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `reduce` | `[native code]` |
| 0.0% | 1.6ms | 0.0% | 0us | `wasmRunToNdStates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:279` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `decode` | `[native code]` |
| 0.0% | 1.6ms | 0.0% | 0us | `cmaes_viz_run` | `/Users/jemanuel/projects/cmaes_explainer/public/wasm/fs-cmaes/fs_cmaes_viz_wasm.js:51` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `projectDirection` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:263` |
| 0.0% | 1.4ms | 0.0% | 731us | `readFileSync` | `[native code]` |
| 0.0% | 1.2ms | 0.0% | 737us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:398` |
| 0.0% | 901us | 0.0% | 901us | `parse` | `[native code]` |
| 0.0% | 888us | 0.0% | 888us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:380` |
| 0.0% | 883us | 0.0% | 883us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:407` |
| 0.0% | 872us | 0.0% | 872us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:342` |
| 0.0% | 857us | 0.0% | 857us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:337` |
| 0.0% | 854us | 0.0% | 0us | `.wasm-function[29]` | `[native code]` |
| 0.0% | 854us | 0.0% | 0us | `.wasm-function[26]` | `[native code]` |
| 0.0% | 854us | 0.0% | 854us | `.wasm-function[15]` | `[native code]` |
| 0.0% | 854us | 0.0% | 0us | `.wasm-function[78]` | `[native code]` |
| 0.0% | 854us | 0.0% | 0us | `.wasm-function[36]` | `[native code]` |
| 0.0% | 854us | 0.0% | 0us | `.wasm-function[62]` | `[native code]` |
| 0.0% | 798us | 0.0% | 798us | `wasmRunToNdStates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:281` |
| 0.0% | 778us | 0.0% | 778us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:344` |
| 0.0% | 750us | 0.0% | 750us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:355` |
| 0.0% | 738us | 0.0% | 738us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:338` |
| 0.0% | 734us | 0.0% | 734us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:379` |
| 0.0% | 725us | 0.0% | 725us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:299` |
| 0.0% | 702us | 0.0% | 702us | `@lazy` | `[native code]` |
| 0.0% | 702us | 0.0% | 0us | `internal:fs/binding` | `internal:fs/binding:3` |
| 0.0% | 650us | 0.0% | 650us | `projectPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:245` |

## Function Details

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:334` | Self: 35.8% (1.08s) | Total: 35.8% (1.08s) | Samples: 1406

**Called by:**
- `map` (1406)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:333` | Self: 11.5% (348.3ms) | Total: 11.5% (348.3ms) | Samples: 454

**Called by:**
- `map` (454)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:343` | Self: 6.5% (199.4ms) | Total: 6.5% (199.4ms) | Samples: 259

**Called by:**
- `map` (259)

### `from`
`[native code]` | Self: 5.8% (177.8ms) | Total: 12.5% (380.0ms) | Samples: 226

**Called by:**
- `(anonymous)` (281)
- `(anonymous)` (123)
- `(anonymous)` (74)
- `from` (5)

**Calls:**
- `(anonymous)` (150)
- `(anonymous)` (96)
- `from` (5)
- `(anonymous)` (4)
- `(anonymous)` (1)
- `(anonymous)` (1)

### `sort`
`[native code]` | Self: 5.6% (171.1ms) | Total: 8.2% (250.2ms) | Samples: 223

**Called by:**
- `(anonymous)` (324)

**Calls:**
- `(anonymous)` (100)
- `(anonymous)` (1)

### `slice`
`[native code]` | Self: 5.2% (158.3ms) | Total: 5.2% (158.3ms) | Samples: 203

**Called by:**
- `(anonymous)` (101)
- `(anonymous)` (98)
- `(anonymous)` (3)
- `(anonymous)` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:329` | Self: 2.8% (85.4ms) | Total: 5.3% (162.3ms) | Samples: 113

**Called by:**
- `map` (211)

**Calls:**
- `slice` (98)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:297` | Self: 2.5% (78.3ms) | Total: 2.5% (78.3ms) | Samples: 100

**Called by:**
- `sort` (100)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts` | Self: 2.5% (76.2ms) | Total: 2.5% (76.2ms) | Samples: 98

**Called by:**
- `from` (96)
- `map` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:336` | Self: 2.1% (66.0ms) | Total: 3.5% (108.6ms) | Samples: 86

**Called by:**
- `map` (138)

**Calls:**
- `push` (52)

### `.wasm-function[10]`
`[native code]` | Self: 2.0% (62.7ms) | Total: 2.0% (62.7ms) | Samples: 6

**Called by:**
- `.wasm-function[5]` (4)
- `.wasm-function[83]` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:414` | Self: 1.5% (47.0ms) | Total: 2.2% (67.7ms) | Samples: 61

**Called by:**
- `map` (88)

**Calls:**
- `map` (27)

### `push`
`[native code]` | Self: 1.4% (42.6ms) | Total: 1.4% (42.6ms) | Samples: 52

**Called by:**
- `(anonymous)` (52)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:302` | Self: 1.2% (38.4ms) | Total: 2.0% (60.7ms) | Samples: 50

**Called by:**
- `map` (79)

**Calls:**
- `forEach` (29)

### `map`
`[native code]` | Self: 1.1% (35.0ms) | Total: 98.2% (2.97s) | Samples: 45

**Called by:**
- `(module)` (3769)
- `(anonymous)` (27)
- `(anonymous)` (18)
- `(anonymous)` (13)

**Calls:**
- `(anonymous)` (1406)
- `(anonymous)` (454)
- `(anonymous)` (405)
- `(anonymous)` (306)
- `(anonymous)` (259)
- `(anonymous)` (211)
- `(anonymous)` (138)
- `(anonymous)` (135)
- `(anonymous)` (88)
- `(anonymous)` (79)
- `(anonymous)` (63)
- `(anonymous)` (35)
- `(anonymous)` (24)
- `(anonymous)` (23)
- `(anonymous)` (20)
- `(anonymous)` (20)
- `(anonymous)` (19)
- `(anonymous)` (17)
- `(anonymous)` (15)
- `(anonymous)` (9)
- `(anonymous)` (7)
- `(anonymous)` (6)
- `(anonymous)` (6)
- `(anonymous)` (5)
- `(anonymous)` (5)
- `(anonymous)` (4)
- `(anonymous)` (4)
- `(anonymous)` (4)
- `(anonymous)` (3)
- `(anonymous)` (2)
- `(anonymous)` (2)
- `(anonymous)` (2)
- `(anonymous)` (1)
- `(anonymous)` (1)
- `(anonymous)` (1)
- `(anonymous)` (1)
- `(anonymous)` (1)
- `(anonymous)` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:328` | Self: 0.8% (26.3ms) | Total: 3.4% (105.2ms) | Samples: 34

**Called by:**
- `map` (135)

**Calls:**
- `slice` (101)

### `projectDirection`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:264` | Self: 0.8% (24.9ms) | Total: 0.8% (24.9ms) | Samples: 32

**Called by:**
- `(anonymous)` (18)
- `(anonymous)` (14)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:325` | Self: 0.6% (20.6ms) | Total: 1.6% (50.0ms) | Samples: 27

**Called by:**
- `map` (63)

**Calls:**
- `projectPoint` (24)
- `projectPoint` (8)
- `projectPoint` (3)
- `projectPoint` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:377` | Self: 0.6% (20.3ms) | Total: 3.9% (118.6ms) | Samples: 27

**Called by:**
- `from` (150)

**Calls:**
- `from` (123)

### `projectPoint`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:248` | Self: 0.6% (19.9ms) | Total: 0.6% (19.9ms) | Samples: 24

**Called by:**
- `(anonymous)` (24)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:367` | Self: 0.6% (19.6ms) | Total: 0.7% (23.0ms) | Samples: 20

**Called by:**
- `map` (24)

**Calls:**
- `col` (4)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:303` | Self: 0.6% (19.4ms) | Total: 0.6% (19.4ms) | Samples: 25

**Called by:**
- `forEach` (25)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:376` | Self: 0.6% (19.3ms) | Total: 7.9% (239.9ms) | Samples: 25

**Called by:**
- `map` (306)

**Calls:**
- `from` (281)

### `.wasm-function[84]`
`[native code]` | Self: 0.6% (19.1ms) | Total: 0.6% (20.0ms) | Samples: 2

**Called by:**
- `.wasm-function[28]` (3)

**Calls:**
- `.wasm-function[26]` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:399` | Self: 0.5% (17.0ms) | Total: 0.9% (27.3ms) | Samples: 22

**Called by:**
- `map` (35)

**Calls:**
- `reverse` (13)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:406` | Self: 0.5% (16.3ms) | Total: 0.5% (16.3ms) | Samples: 19

**Called by:**
- `map` (19)

### `reverse`
`[native code]` | Self: 0.3% (10.2ms) | Total: 0.3% (10.2ms) | Samples: 13

**Called by:**
- `(anonymous)` (13)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:357` | Self: 0.3% (9.7ms) | Total: 0.3% (12.0ms) | Samples: 5

**Called by:**
- `map` (6)

**Calls:**
- `sqrt` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:296` | Self: 0.2% (8.6ms) | Total: 10.4% (316.0ms) | Samples: 11

**Called by:**
- `map` (405)
- `from` (4)

**Calls:**
- `sort` (324)
- `from` (74)

### `filter`
`[native code]` | Self: 0.2% (7.7ms) | Total: 0.2% (7.7ms) | Samples: 10

**Called by:**
- `(anonymous)` (10)

### `col`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:362` | Self: 0.2% (7.1ms) | Total: 0.2% (7.1ms) | Samples: 9

**Called by:**
- `(anonymous)` (4)
- `(anonymous)` (3)
- `(anonymous)` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:345` | Self: 0.2% (7.0ms) | Total: 0.2% (7.0ms) | Samples: 9

**Called by:**
- `map` (9)

### `projectPoint`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts` | Self: 0.2% (6.4ms) | Total: 0.2% (6.4ms) | Samples: 8

**Called by:**
- `(anonymous)` (8)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:401` | Self: 0.1% (4.4ms) | Total: 0.1% (4.4ms) | Samples: 6

**Called by:**
- `map` (6)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:305` | Self: 0.1% (4.2ms) | Total: 0.3% (11.9ms) | Samples: 5

**Called by:**
- `map` (15)

**Calls:**
- `filter` (10)

### `(unknown)`
`[native code]` | Self: 0.1% (3.9ms) | Total: 2.8% (87.5ms) | Samples: 4

**Called by:**
- `cmaes_viz_run` (14)

**Calls:**
- `.wasm-function[83]` (10)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:331` | Self: 0.1% (3.6ms) | Total: 0.1% (3.6ms) | Samples: 5

**Called by:**
- `map` (5)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:353` | Self: 0.1% (3.6ms) | Total: 0.5% (17.8ms) | Samples: 5

**Called by:**
- `map` (23)

**Calls:**
- `map` (18)

### `projectDirection`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts` | Self: 0.1% (3.2ms) | Total: 0.1% (3.2ms) | Samples: 4

**Called by:**
- `(anonymous)` (3)
- `(anonymous)` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:317` | Self: 0.1% (3.1ms) | Total: 0.4% (13.2ms) | Samples: 4

**Called by:**
- `map` (17)

**Calls:**
- `map` (13)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:312` | Self: 0.1% (3.1ms) | Total: 0.1% (5.2ms) | Samples: 4

**Called by:**
- `map` (7)

**Calls:**
- `slice` (3)

### `anonymous`
`[native code]` | Self: 0.1% (3.0ms) | Total: 0.4% (12.3ms) | Samples: 2

**Called by:**
- `node:fs/promises` (3)
- `node:fs` (3)
- `node:events` (1)
- `internal:validators` (1)

**Calls:**
- `node:fs/promises` (3)
- `node:events` (1)
- `internal:validators` (1)
- `internal:fs/binding` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:301` | Self: 0.1% (3.0ms) | Total: 0.1% (3.0ms) | Samples: 4

**Called by:**
- `map` (4)

### `sqrt`
`[native code]` | Self: 0.1% (3.0ms) | Total: 0.1% (3.0ms) | Samples: 2

**Called by:**
- `(anonymous)` (1)
- `(anonymous)` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:292` | Self: 0.0% (3.0ms) | Total: 0.0% (3.0ms) | Samples: 4

**Called by:**
- `map` (4)

### `forEach`
`[native code]` | Self: 0.0% (2.9ms) | Total: 0.7% (22.3ms) | Samples: 4

**Called by:**
- `(anonymous)` (29)

**Calls:**
- `(anonymous)` (25)

### `col`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 3

**Called by:**
- `(anonymous)` (2)
- `(anonymous)` (1)

### `projectPoint`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:247` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 3

**Called by:**
- `(anonymous)` (3)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 0.0% (2.2ms) | Total: 99.8% (3.02s) | Samples: 3

**Calls:**
- `map` (3769)
- `cmaes_viz_run` (14)
- `wasmRunToNdStates` (2)
- `cmaes_viz_run` (1)
- `parse` (1)
- `readFileSync` (1)
- `wasmRunToNdStates` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:327` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 2

**Called by:**
- `map` (2)

### `reduce`
`[native code]` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 2

**Called by:**
- `wasmRunToNdStates` (2)

### `decode`
`[native code]` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 1

**Called by:**
- `cmaes_viz_run` (1)

### `projectDirection`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:263` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `(anonymous)` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:356` | Self: 0.0% (1.4ms) | Total: 0.0% (2.2ms) | Samples: 2

**Called by:**
- `map` (3)

**Calls:**
- `sqrt` (1)

### `parse`
`[native code]` | Self: 0.0% (901us) | Total: 0.0% (901us) | Samples: 1

**Called by:**
- `(module)` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:380` | Self: 0.0% (888us) | Total: 0.0% (888us) | Samples: 1

**Called by:**
- `from` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:407` | Self: 0.0% (883us) | Total: 0.0% (883us) | Samples: 1

**Called by:**
- `map` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:342` | Self: 0.0% (872us) | Total: 0.0% (872us) | Samples: 1

**Called by:**
- `map` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:337` | Self: 0.0% (857us) | Total: 0.0% (857us) | Samples: 1

**Called by:**
- `map` (1)

### `.wasm-function[15]`
`[native code]` | Self: 0.0% (854us) | Total: 0.0% (854us) | Samples: 1

**Called by:**
- `.wasm-function[62]` (1)

### `.wasm-function[32]`
`[native code]` | Self: 0.0% (833us) | Total: 0.6% (20.8ms) | Samples: 1

**Called by:**
- `.wasm-function[83]` (4)

**Calls:**
- `.wasm-function[49]` (3)

### `wasmRunToNdStates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:281` | Self: 0.0% (798us) | Total: 0.0% (798us) | Samples: 1

**Called by:**
- `(module)` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:344` | Self: 0.0% (778us) | Total: 0.0% (778us) | Samples: 1

**Called by:**
- `map` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:355` | Self: 0.0% (750us) | Total: 0.0% (750us) | Samples: 1

**Called by:**
- `map` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:338` | Self: 0.0% (738us) | Total: 0.0% (738us) | Samples: 1

**Called by:**
- `map` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:373` | Self: 0.0% (737us) | Total: 0.5% (15.8ms) | Samples: 1

**Called by:**
- `map` (20)

**Calls:**
- `projectDirection` (18)
- `projectDirection` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:398` | Self: 0.0% (737us) | Total: 0.0% (1.2ms) | Samples: 1

**Called by:**
- `map` (2)

**Calls:**
- `slice` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:379` | Self: 0.0% (734us) | Total: 0.0% (734us) | Samples: 1

**Called by:**
- `from` (1)

### `readFileSync`
`[native code]` | Self: 0.0% (731us) | Total: 0.0% (1.4ms) | Samples: 1

**Called by:**
- `(module)` (1)
- `readFileSync` (1)

**Calls:**
- `readFileSync` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:299` | Self: 0.0% (725us) | Total: 0.0% (725us) | Samples: 1

**Called by:**
- `sort` (1)

### `@lazy`
`[native code]` | Self: 0.0% (702us) | Total: 0.0% (702us) | Samples: 1

**Called by:**
- `internal:fs/binding` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:365` | Self: 0.0% (653us) | Total: 0.0% (2.8ms) | Samples: 1

**Called by:**
- `map` (4)

**Calls:**
- `col` (2)
- `col` (1)

### `projectPoint`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:245` | Self: 0.0% (650us) | Total: 0.0% (650us) | Samples: 1

**Called by:**
- `(anonymous)` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:372` | Self: 0.0% (526us) | Total: 0.5% (15.2ms) | Samples: 1

**Called by:**
- `map` (20)

**Calls:**
- `projectDirection` (14)
- `projectDirection` (3)
- `projectDirection` (2)

### `wasmRunToNdStates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:279` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `(module)` (2)

**Calls:**
- `reduce` (2)

### `.wasm-function[62]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (854us) | Samples: 0

**Called by:**
- `.wasm-function[78]` (1)

**Calls:**
- `.wasm-function[15]` (1)

### `.wasm-function[5]`
`[native code]` | Self: 0.0% (0us) | Total: 1.8% (55.5ms) | Samples: 0

**Called by:**
- `.wasm-function[83]` (4)

**Calls:**
- `.wasm-function[10]` (4)

### `internal:fs/binding`
`internal:fs/binding:3` | Self: 0.0% (0us) | Total: 0.0% (702us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `@lazy` (1)

### `.wasm-function[29]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (854us) | Samples: 0

**Called by:**
- `.wasm-function[26]` (1)

**Calls:**
- `.wasm-function[78]` (1)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (2.3ms) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.1% (3.7ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (2.3ms) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `.wasm-function[49]`
`[native code]` | Self: 0.0% (0us) | Total: 0.6% (20.0ms) | Samples: 0

**Called by:**
- `.wasm-function[32]` (3)

**Calls:**
- `.wasm-function[28]` (2)
- `.wasm-function[36]` (1)

### `cmaes_viz_run`
`/Users/jemanuel/projects/cmaes_explainer/public/wasm/fs-cmaes/fs_cmaes_viz_wasm.js:51` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `(module)` (1)

**Calls:**
- `decode` (1)

### `.wasm-function[26]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (854us) | Samples: 0

**Called by:**
- `.wasm-function[84]` (1)

**Calls:**
- `.wasm-function[29]` (1)

### `.wasm-function[28]`
`[native code]` | Self: 0.0% (0us) | Total: 0.6% (20.0ms) | Samples: 0

**Called by:**
- `.wasm-function[49]` (2)
- `.wasm-function[36]` (1)

**Calls:**
- `.wasm-function[84]` (3)

### `.wasm-function[78]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (854us) | Samples: 0

**Called by:**
- `.wasm-function[29]` (1)

**Calls:**
- `.wasm-function[62]` (1)

### `.wasm-function[36]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (854us) | Samples: 0

**Called by:**
- `.wasm-function[49]` (1)

**Calls:**
- `.wasm-function[28]` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts:366` | Self: 0.0% (0us) | Total: 0.1% (3.9ms) | Samples: 0

**Called by:**
- `map` (5)

**Calls:**
- `col` (3)
- `col` (2)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.1% (3.7ms) | Samples: 0

**Calls:**
- `anonymous` (3)

### `.wasm-function[83]`
`[native code]` | Self: 0.0% (0us) | Total: 2.7% (83.5ms) | Samples: 0

**Called by:**
- `(unknown)` (10)

**Calls:**
- `.wasm-function[5]` (4)
- `.wasm-function[32]` (4)
- `.wasm-function[10]` (2)

### `cmaes_viz_run`
`/Users/jemanuel/projects/cmaes_explainer/public/wasm/fs-cmaes/fs_cmaes_viz_wasm.js:48` | Self: 0.0% (0us) | Total: 2.8% (87.5ms) | Samples: 0

**Called by:**
- `(module)` (14)

**Calls:**
- `(unknown)` (14)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 76.6% | 2.32s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts` |
| 23.2% | 705.1ms | `[native code]` |
| 0.0% | 2.2ms | `/Users/jemanuel/projects/cmaes_explainer/[eval]` |
