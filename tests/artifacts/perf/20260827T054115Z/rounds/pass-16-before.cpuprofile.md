# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 9.14s | 11870 | 500us | 157 |

**Top 10:** `jacobiEigenSymmetric` 41.9%, `step` 19.0%, `transformFromEigenCoordinates` 4.5%, `reconstructSymmetric` 4.2%, `step` 3.5%, `mahalanobisSquaredWithEigensystem` 3.1%, `step` 2.1%, `map` 2.1%, `step` 2.0%, `step` 1.6%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 41.9% | 3.83s | 43.5% | 3.97s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 19.0% | 1.73s | 19.0% | 1.73s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` |
| 4.5% | 419.5ms | 4.7% | 430.9ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 4.2% | 392.8ms | 4.6% | 427.3ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` |
| 3.5% | 326.4ms | 4.0% | 366.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 3.1% | 291.9ms | 3.2% | 296.8ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:286` |
| 2.1% | 199.5ms | 2.1% | 199.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` |
| 2.1% | 193.3ms | 4.3% | 400.0ms | `map` | `[native code]` |
| 2.0% | 188.9ms | 2.0% | 188.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:686` |
| 1.6% | 149.0ms | 1.6% | 149.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:683` |
| 1.5% | 143.5ms | 1.5% | 143.5ms | `hypot` | `[native code]` |
| 1.5% | 142.3ms | 1.5% | 142.3ms | `fill` | `[native code]` |
| 1.1% | 109.0ms | 1.9% | 181.8ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.7% | 71.8ms | 0.7% | 71.8ms | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:397` |
| 0.7% | 67.2ms | 0.8% | 77.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.6% | 63.5ms | 0.6% | 63.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.6% | 58.6ms | 0.6% | 58.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.5% | 52.8ms | 1.5% | 144.2ms | `some` | `[native code]` |
| 0.5% | 46.3ms | 1.3% | 121.2ms | `from` | `[native code]` |
| 0.5% | 45.8ms | 0.5% | 53.9ms | `sort` | `[native code]` |
| 0.4% | 42.4ms | 0.4% | 42.4ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 0.4% | 39.4ms | 1.3% | 125.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` |
| 0.3% | 31.3ms | 0.8% | 73.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.3% | 30.6ms | 0.3% | 30.6ms | `Float64Array` | `[native code]` |
| 0.3% | 29.0ms | 0.3% | 29.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.3% | 28.8ms | 0.7% | 68.6ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.2% | 27.3ms | 0.2% | 27.3ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.2% | 27.0ms | 0.3% | 28.4ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` |
| 0.2% | 26.8ms | 0.3% | 27.6ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 0.2% | 24.3ms | 0.2% | 24.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.2% | 23.4ms | 0.2% | 23.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` |
| 0.2% | 20.1ms | 0.2% | 20.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.1% | 17.7ms | 0.1% | 17.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` |
| 0.1% | 16.0ms | 0.1% | 16.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` |
| 0.1% | 12.6ms | 0.1% | 12.6ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:328` |
| 0.1% | 12.1ms | 0.1% | 12.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:588` |
| 0.1% | 11.6ms | 0.1% | 11.6ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.1% | 11.5ms | 0.1% | 11.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:625` |
| 0.1% | 10.0ms | 0.1% | 10.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |
| 0.0% | 7.0ms | 0.8% | 77.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:589` |
| 0.0% | 6.8ms | 0.0% | 6.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` |
| 0.0% | 6.8ms | 0.0% | 6.8ms | `push` | `[native code]` |
| 0.0% | 6.7ms | 0.0% | 6.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 6.3ms | 0.0% | 6.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:584` |
| 0.0% | 5.8ms | 0.1% | 10.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.0% | 5.5ms | 0.0% | 5.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:591` |
| 0.0% | 5.1ms | 0.0% | 5.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:730` |
| 0.0% | 4.5ms | 0.2% | 22.3ms | `anonymous` | `[native code]` |
| 0.0% | 4.4ms | 0.0% | 4.4ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 4.3ms | 0.0% | 4.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:735` |
| 0.0% | 3.8ms | 2.2% | 204.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:585` |
| 0.0% | 3.8ms | 0.8% | 75.6ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:548` |
| 0.0% | 3.4ms | 0.0% | 3.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` |
| 0.0% | 3.1ms | 3.3% | 303.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:719` |
| 0.0% | 3.0ms | 0.8% | 76.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.0% | 3.0ms | 0.2% | 23.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 0.0% | 2.9ms | 0.7% | 72.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.0% | 2.6ms | 0.0% | 4.8ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:558` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:290` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:555` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.0ms | 0.7% | 65.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:649` |
| 0.0% | 2.0ms | 0.7% | 68.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:588` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.7ms | 1.6% | 147.4ms | `forEach` | `[native code]` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:651` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `abs` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.5ms | 4.7% | 429.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:690` |
| 0.0% | 1.5ms | 4.7% | 436.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` |
| 0.0% | 1.5ms | 0.2% | 20.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:702` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:641` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `reduce` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:740` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:734` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:550` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` |
| 0.0% | 904us | 0.0% | 904us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 890us | 0.0% | 890us | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:237` |
| 0.0% | 868us | 0.0% | 1.6ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:40` |
| 0.0% | 865us | 0.0% | 865us | `WriteStream` | `internal:fs/streams` |
| 0.0% | 862us | 0.0% | 862us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` |
| 0.0% | 857us | 0.0% | 4.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` |
| 0.0% | 853us | 0.0% | 853us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:54` |
| 0.0% | 830us | 0.0% | 830us | `isFinite` | `[native code]` |
| 0.0% | 816us | 0.0% | 2.4ms | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:478` |
| 0.0% | 804us | 0.0% | 804us | `makeSafe` | `internal:primordials:29` |
| 0.0% | 798us | 0.0% | 798us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:731` |
| 0.0% | 791us | 0.6% | 58.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:631` |
| 0.0% | 772us | 0.0% | 772us | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:285` |
| 0.0% | 769us | 0.0% | 769us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:334` |
| 0.0% | 762us | 0.4% | 37.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.0% | 748us | 0.0% | 748us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:492` |
| 0.0% | 719us | 0.0% | 719us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 682us | 0.0% | 682us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:451` |
| 0.0% | 649us | 0.0% | 649us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` |
| 0.0% | 644us | 0.0% | 644us | `every` | `[native code]` |
| 0.0% | 643us | 1.6% | 146.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:701` |
| 0.0% | 637us | 0.0% | 637us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:89` |
| 0.0% | 634us | 0.0% | 634us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:579` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 99.4% | 9.08s | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 93.3% | 8.52s | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` |
| 46.8% | 4.27s | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:689` |
| 43.5% | 3.97s | 41.9% | 3.83s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 19.0% | 1.73s | 19.0% | 1.73s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` |
| 6.6% | 604.0ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` |
| 4.7% | 436.9ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` |
| 4.7% | 430.9ms | 4.5% | 419.5ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 4.7% | 429.7ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:690` |
| 4.6% | 427.3ms | 4.2% | 392.8ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` |
| 4.3% | 400.0ms | 2.1% | 193.3ms | `map` | `[native code]` |
| 4.0% | 366.1ms | 3.5% | 326.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 3.3% | 303.1ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` |
| 3.2% | 296.8ms | 3.1% | 291.9ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:286` |
| 2.2% | 204.9ms | 0.0% | 3.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:585` |
| 2.1% | 199.5ms | 2.1% | 199.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` |
| 2.0% | 188.9ms | 2.0% | 188.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:686` |
| 1.9% | 181.8ms | 1.1% | 109.0ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.6% | 149.0ms | 1.6% | 149.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:683` |
| 1.6% | 147.4ms | 0.0% | 1.7ms | `forEach` | `[native code]` |
| 1.6% | 146.3ms | 0.0% | 643us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:701` |
| 1.5% | 144.2ms | 0.5% | 52.8ms | `some` | `[native code]` |
| 1.5% | 143.5ms | 1.5% | 143.5ms | `hypot` | `[native code]` |
| 1.5% | 142.3ms | 1.5% | 142.3ms | `fill` | `[native code]` |
| 1.3% | 125.0ms | 0.4% | 39.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` |
| 1.3% | 121.2ms | 0.5% | 46.3ms | `from` | `[native code]` |
| 0.9% | 84.2ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:699` |
| 0.8% | 77.9ms | 0.7% | 67.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.8% | 77.3ms | 0.0% | 7.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:589` |
| 0.8% | 76.7ms | 0.0% | 0us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.8% | 76.5ms | 0.0% | 3.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.8% | 75.6ms | 0.0% | 3.8ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:548` |
| 0.8% | 73.5ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 0.8% | 73.5ms | 0.0% | 0us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.8% | 73.1ms | 0.3% | 31.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.7% | 72.4ms | 0.0% | 2.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.7% | 71.8ms | 0.7% | 71.8ms | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:397` |
| 0.7% | 68.8ms | 0.0% | 2.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:588` |
| 0.7% | 68.6ms | 0.3% | 28.8ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.7% | 67.2ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:648` |
| 0.7% | 65.3ms | 0.0% | 2.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:649` |
| 0.6% | 63.5ms | 0.6% | 63.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.6% | 58.6ms | 0.6% | 58.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.6% | 58.4ms | 0.0% | 791us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:631` |
| 0.5% | 53.9ms | 0.5% | 45.8ms | `sort` | `[native code]` |
| 0.4% | 43.0ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:729` |
| 0.4% | 42.4ms | 0.4% | 42.4ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 0.4% | 40.8ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 0.4% | 37.6ms | 0.0% | 762us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.3% | 35.6ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` |
| 0.3% | 31.9ms | 0.0% | 0us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.3% | 30.6ms | 0.3% | 30.6ms | `Float64Array` | `[native code]` |
| 0.3% | 29.0ms | 0.3% | 29.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.3% | 28.4ms | 0.2% | 27.0ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` |
| 0.3% | 27.6ms | 0.2% | 26.8ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 0.2% | 27.3ms | 0.2% | 27.3ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.2% | 24.3ms | 0.2% | 24.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.2% | 23.4ms | 0.2% | 23.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` |
| 0.2% | 23.1ms | 0.0% | 3.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 0.2% | 22.3ms | 0.0% | 4.5ms | `anonymous` | `[native code]` |
| 0.2% | 20.6ms | 0.0% | 1.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:702` |
| 0.2% | 20.1ms | 0.2% | 20.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.2% | 19.8ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 0.1% | 17.7ms | 0.1% | 17.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` |
| 0.1% | 16.0ms | 0.1% | 16.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` |
| 0.1% | 13.3ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:721` |
| 0.1% | 12.6ms | 0.1% | 12.6ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:328` |
| 0.1% | 12.2ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:720` |
| 0.1% | 12.1ms | 0.1% | 12.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:588` |
| 0.1% | 11.6ms | 0.1% | 11.6ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.1% | 11.5ms | 0.1% | 11.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:625` |
| 0.1% | 10.5ms | 0.0% | 5.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.1% | 10.0ms | 0.1% | 10.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |
| 0.0% | 8.3ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` |
| 0.0% | 6.8ms | 0.0% | 6.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` |
| 0.0% | 6.8ms | 0.0% | 6.8ms | `push` | `[native code]` |
| 0.0% | 6.7ms | 0.0% | 6.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 6.3ms | 0.0% | 6.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:584` |
| 0.0% | 6.2ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.0% | 6.2ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.0% | 6.1ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 5.5ms | 0.0% | 5.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:591` |
| 0.0% | 5.2ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` |
| 0.0% | 5.1ms | 0.0% | 5.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:730` |
| 0.0% | 4.8ms | 0.0% | 857us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` |
| 0.0% | 4.8ms | 0.0% | 2.6ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:558` |
| 0.0% | 4.4ms | 0.0% | 4.4ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 4.3ms | 0.0% | 4.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:735` |
| 0.0% | 3.4ms | 0.0% | 3.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:719` |
| 0.0% | 2.4ms | 0.0% | 816us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:478` |
| 0.0% | 2.3ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 2.3ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:290` |
| 0.0% | 2.3ms | 0.0% | 0us | `createIdentityMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:31` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` |
| 0.0% | 2.2ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:555` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.7ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` |
| 0.0% | 1.7ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:50` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:651` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `abs` | `[native code]` |
| 0.0% | 1.6ms | 0.0% | 868us | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:40` |
| 0.0% | 1.6ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 1.6ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 1.6ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 1.6ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:641` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 0.0% | 1.5ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:706` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `reduce` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:740` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:734` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:550` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` |
| 0.0% | 910us | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:741` |
| 0.0% | 904us | 0.0% | 904us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 890us | 0.0% | 890us | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:237` |
| 0.0% | 865us | 0.0% | 865us | `WriteStream` | `internal:fs/streams` |
| 0.0% | 862us | 0.0% | 862us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` |
| 0.0% | 853us | 0.0% | 853us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:54` |
| 0.0% | 847us | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 847us | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 847us | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 830us | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:694` |
| 0.0% | 830us | 0.0% | 830us | `isFinite` | `[native code]` |
| 0.0% | 817us | 0.0% | 0us | `internal:streams/end-of-stream` | `internal:streams/end-of-stream:17` |
| 0.0% | 817us | 0.0% | 0us | `internal:streams/operators` | `internal:streams/operators:2` |
| 0.0% | 804us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 804us | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 804us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 804us | 0.0% | 0us | `internal:primordials` | `internal:primordials:73` |
| 0.0% | 804us | 0.0% | 804us | `makeSafe` | `internal:primordials:29` |
| 0.0% | 798us | 0.0% | 798us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:731` |
| 0.0% | 772us | 0.0% | 772us | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:285` |
| 0.0% | 769us | 0.0% | 769us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:334` |
| 0.0% | 748us | 0.0% | 748us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:492` |
| 0.0% | 736us | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:615` |
| 0.0% | 719us | 0.0% | 719us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 682us | 0.0% | 682us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:451` |
| 0.0% | 666us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:481` |
| 0.0% | 649us | 0.0% | 649us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` |
| 0.0% | 644us | 0.0% | 644us | `every` | `[native code]` |
| 0.0% | 644us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:465` |
| 0.0% | 637us | 0.0% | 637us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:89` |
| 0.0% | 634us | 0.0% | 634us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:579` |
| 0.0% | 626us | 0.0% | 0us | `node:fs` | `node:fs:299` |

## Function Details

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` | Self: 41.9% (3.83s) | Total: 43.5% (3.97s) | Samples: 4970

**Called by:**
- `step` (5157)

**Calls:**
- `hypot` (187)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` | Self: 19.0% (1.73s) | Total: 19.0% (1.73s) | Samples: 2270

**Called by:**
- `runTrial` (2262)
- `runTrial` (8)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` | Self: 4.5% (419.5ms) | Total: 4.7% (430.9ms) | Samples: 556

**Called by:**
- `step` (571)

**Calls:**
- `createZeroVector` (9)
- `fill` (6)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` | Self: 4.2% (392.8ms) | Total: 4.6% (427.3ms) | Samples: 503

**Called by:**
- `step` (546)

**Calls:**
- `from` (43)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` | Self: 3.5% (326.4ms) | Total: 4.0% (366.1ms) | Samples: 427

**Called by:**
- `runTrial` (477)
- `runTrial` (2)

**Calls:**
- `createZeroMatrix` (39)
- `from` (11)
- `createZeroMatrix` (2)

### `mahalanobisSquaredWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:286` | Self: 3.1% (291.9ms) | Total: 3.2% (296.8ms) | Samples: 385

**Called by:**
- `step` (391)

**Calls:**
- `fill` (3)
- `createZeroVector` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` | Self: 2.1% (199.5ms) | Total: 2.1% (199.5ms) | Samples: 262

**Called by:**
- `runTrial` (260)
- `runTrial` (2)

### `map`
`[native code]` | Self: 2.1% (193.3ms) | Total: 4.3% (400.0ms) | Samples: 241

**Called by:**
- `step` (96)
- `cloneMatrix` (96)
- `step` (86)
- `step` (83)
- `(anonymous)` (81)
- `(anonymous)` (25)
- `step` (11)
- `jacobiEigenSymmetric` (8)
- `step` (7)
- `jacobiEigenSymmetric` (6)
- `step` (5)
- `jacobiEigenSymmetric` (3)
- `alignProjectionBasis` (2)
- `map` (1)

**Calls:**
- `(anonymous)` (84)
- `(anonymous)` (77)
- `(anonymous)` (60)
- `(anonymous)` (26)
- `(anonymous)` (16)
- `(anonymous)` (3)
- `abs` (2)
- `map` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:686` | Self: 2.0% (188.9ms) | Total: 2.0% (188.9ms) | Samples: 249

**Called by:**
- `runTrial` (249)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:683` | Self: 1.6% (149.0ms) | Total: 1.6% (149.0ms) | Samples: 193

**Called by:**
- `runTrial` (192)
- `runTrial` (1)

### `hypot`
`[native code]` | Self: 1.5% (143.5ms) | Total: 1.5% (143.5ms) | Samples: 187

**Called by:**
- `jacobiEigenSymmetric` (187)

### `fill`
`[native code]` | Self: 1.5% (142.3ms) | Total: 1.5% (142.3ms) | Samples: 186

**Called by:**
- `sampleGaussianVectorND` (94)
- `ellipsoidObjective` (53)
- `from` (28)
- `transformFromEigenCoordinates` (6)
- `mahalanobisSquaredWithEigensystem` (3)
- `ellipsoidObjective` (1)
- `whitenWithEigensystem` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.1% (109.0ms) | Total: 1.9% (181.8ms) | Samples: 139

**Called by:**
- `step` (233)

**Calls:**
- `fill` (94)

### `requireFiniteVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:397` | Self: 0.7% (71.8ms) | Total: 0.7% (71.8ms) | Samples: 93

**Called by:**
- `projectTo3D` (93)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` | Self: 0.7% (67.2ms) | Total: 0.8% (77.9ms) | Samples: 89

**Called by:**
- `step` (103)

**Calls:**
- `Float64Array` (14)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.6% (63.5ms) | Total: 0.6% (63.5ms) | Samples: 82

**Called by:**
- `map` (60)
- `some` (22)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 0.6% (58.6ms) | Total: 0.6% (58.6ms) | Samples: 77

**Called by:**
- `map` (77)

### `some`
`[native code]` | Self: 0.5% (52.8ms) | Total: 1.5% (144.2ms) | Samples: 65

**Called by:**
- `validateSquareFiniteMatrix` (91)
- `(anonymous)` (85)
- `some` (2)

**Calls:**
- `(anonymous)` (89)
- `(anonymous)` (22)
- `some` (2)

### `from`
`[native code]` | Self: 0.5% (46.3ms) | Total: 1.3% (121.2ms) | Samples: 58

**Called by:**
- `jacobiEigenSymmetric` (51)
- `reconstructSymmetric` (43)
- `createZeroMatrix` (42)
- `step` (11)
- `jacobiEigenSymmetric` (4)
- `runTrial` (1)

**Calls:**
- `(anonymous)` (34)
- `(anonymous)` (32)
- `fill` (28)

### `sort`
`[native code]` | Self: 0.5% (45.8ms) | Total: 0.5% (53.9ms) | Samples: 58

**Called by:**
- `jacobiEigenSymmetric` (45)
- `step` (24)

**Calls:**
- `(anonymous)` (9)
- `(anonymous)` (2)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` | Self: 0.4% (42.4ms) | Total: 0.4% (42.4ms) | Samples: 57

**Called by:**
- `step` (57)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` | Self: 0.4% (39.4ms) | Total: 1.3% (125.0ms) | Samples: 52

**Called by:**
- `forEach` (163)

**Calls:**
- `projectTo3D` (97)
- `projectTo3D` (6)
- `projectTo3D` (4)
- `projectTo3D` (2)
- `projectTo3D` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.3% (31.3ms) | Total: 0.8% (73.1ms) | Samples: 41

**Called by:**
- `step` (92)

**Calls:**
- `from` (51)

### `Float64Array`
`[native code]` | Self: 0.3% (30.6ms) | Total: 0.3% (30.6ms) | Samples: 39

**Called by:**
- `jacobiEigenSymmetric` (25)
- `jacobiEigenSymmetric` (14)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.3% (29.0ms) | Total: 0.3% (29.0ms) | Samples: 34

**Called by:**
- `from` (34)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` | Self: 0.3% (28.8ms) | Total: 0.7% (68.6ms) | Samples: 37

**Called by:**
- `step` (90)

**Calls:**
- `fill` (53)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.2% (27.3ms) | Total: 0.2% (27.3ms) | Samples: 35

**Called by:**
- `step` (16)
- `step` (15)
- `(anonymous)` (4)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` | Self: 0.2% (27.0ms) | Total: 0.3% (28.4ms) | Samples: 35

**Called by:**
- `step` (37)

**Calls:**
- `createZeroVector` (2)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` | Self: 0.2% (26.8ms) | Total: 0.3% (27.6ms) | Samples: 34

**Called by:**
- `step` (35)

**Calls:**
- `fill` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.2% (24.3ms) | Total: 0.2% (24.3ms) | Samples: 32

**Called by:**
- `from` (32)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` | Self: 0.2% (23.4ms) | Total: 0.2% (23.4ms) | Samples: 30

**Called by:**
- `runTrial` (30)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` | Self: 0.2% (20.1ms) | Total: 0.2% (20.1ms) | Samples: 26

**Called by:**
- `map` (26)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` | Self: 0.1% (17.7ms) | Total: 0.1% (17.7ms) | Samples: 23

**Called by:**
- `runTrial` (23)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` | Self: 0.1% (16.0ms) | Total: 0.1% (16.0ms) | Samples: 22

**Called by:**
- `runTrial` (22)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:328` | Self: 0.1% (12.6ms) | Total: 0.1% (12.6ms) | Samples: 16

**Called by:**
- `step` (16)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:588` | Self: 0.1% (12.1ms) | Total: 0.1% (12.1ms) | Samples: 16

**Called by:**
- `map` (16)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` | Self: 0.1% (11.6ms) | Total: 0.1% (11.6ms) | Samples: 15

**Called by:**
- `transformFromEigenCoordinates` (9)
- `mahalanobisSquaredWithEigensystem` (3)
- `whitenWithEigensystem` (2)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:625` | Self: 0.1% (11.5ms) | Total: 0.1% (11.5ms) | Samples: 15

**Called by:**
- `runTrial` (15)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` | Self: 0.1% (10.0ms) | Total: 0.1% (10.0ms) | Samples: 13

**Called by:**
- `runTrial` (13)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:589` | Self: 0.0% (7.0ms) | Total: 0.8% (77.3ms) | Samples: 9

**Called by:**
- `runTrial` (100)
- `runTrial` (1)

**Calls:**
- `ellipsoidObjective` (90)
- `ellipsoidObjective` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` | Self: 0.0% (6.8ms) | Total: 0.0% (6.8ms) | Samples: 9

**Called by:**
- `runTrial` (9)

### `push`
`[native code]` | Self: 0.0% (6.8ms) | Total: 0.0% (6.8ms) | Samples: 9

**Called by:**
- `step` (8)
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` | Self: 0.0% (6.7ms) | Total: 0.0% (6.7ms) | Samples: 9

**Called by:**
- `sort` (9)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:584` | Self: 0.0% (6.3ms) | Total: 0.0% (6.3ms) | Samples: 8

**Called by:**
- `runTrial` (8)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.0% (5.8ms) | Total: 0.1% (10.5ms) | Samples: 7

**Called by:**
- `step` (13)

**Calls:**
- `map` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:591` | Self: 0.0% (5.5ms) | Total: 0.0% (5.5ms) | Samples: 7

**Called by:**
- `runTrial` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:730` | Self: 0.0% (5.1ms) | Total: 0.0% (5.1ms) | Samples: 7

**Called by:**
- `runTrial` (7)

### `anonymous`
`[native code]` | Self: 0.0% (4.5ms) | Total: 0.2% (22.3ms) | Samples: 6

**Called by:**
- `(anonymous)` (5)
- `node:fs/promises` (3)
- `node:fs` (3)
- `internal:fs/streams` (2)
- `get WriteStream` (2)
- `internal:stream` (2)
- `node:stream` (2)
- `node:events` (1)
- `internal:validators` (1)
- `node:fs` (1)
- `internal:streams/pipeline` (1)
- `internal:streams/end-of-stream` (1)
- `internal:shared` (1)
- `internal:streams/operators` (1)
- `internal:streams/compose` (1)
- `internal:streams/duplex` (1)

**Calls:**
- `node:fs/promises` (3)
- `node:fs` (3)
- `internal:fs/streams` (2)
- `internal:stream` (2)
- `node:stream` (2)
- `node:events` (1)
- `internal:validators` (1)
- `node:fs` (1)
- `internal:streams/pipeline` (1)
- `internal:streams/end-of-stream` (1)
- `internal:shared` (1)
- `internal:primordials` (1)
- `internal:streams/operators` (1)
- `internal:streams/duplex` (1)
- `internal:streams/compose` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (4.4ms) | Total: 0.0% (4.4ms) | Samples: 6

**Called by:**
- `step` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:735` | Self: 0.0% (4.3ms) | Total: 0.0% (4.3ms) | Samples: 6

**Called by:**
- `runTrial` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:585` | Self: 0.0% (3.8ms) | Total: 2.2% (204.9ms) | Samples: 5

**Called by:**
- `runTrial` (261)
- `runTrial` (2)

**Calls:**
- `sampleGaussianVectorND` (233)
- `sampleGaussianVectorND` (16)
- `push` (8)
- `sampleGaussianVectorND` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:548` | Self: 0.0% (3.8ms) | Total: 0.8% (75.6ms) | Samples: 5

**Called by:**
- `(anonymous)` (97)
- `step` (1)

**Calls:**
- `requireFiniteVector` (93)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` | Self: 0.0% (3.4ms) | Total: 0.0% (3.4ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` | Self: 0.0% (3.1ms) | Total: 3.3% (303.1ms) | Samples: 4

**Called by:**
- `runTrial` (397)
- `runTrial` (2)

**Calls:**
- `mahalanobisSquaredWithEigensystem` (391)
- `mahalanobisSquaredWithEigensystem` (3)
- `mahalanobisSquaredWithEigensystem` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:719` | Self: 0.0% (3.1ms) | Total: 0.0% (3.1ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` | Self: 0.0% (3.0ms) | Total: 0.8% (76.5ms) | Samples: 4

**Called by:**
- `runTrial` (100)

**Calls:**
- `map` (96)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` | Self: 0.0% (3.0ms) | Total: 0.2% (23.1ms) | Samples: 4

**Called by:**
- `runTrial` (28)

**Calls:**
- `sort` (24)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (2.9ms) | Total: 0.7% (72.4ms) | Samples: 4

**Called by:**
- `some` (89)

**Calls:**
- `some` (85)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:558` | Self: 0.0% (2.6ms) | Total: 0.0% (4.8ms) | Samples: 4

**Called by:**
- `(anonymous)` (6)
- `step` (1)

**Calls:**
- `coordinate` (3)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 3

**Called by:**
- `step` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `mahalanobisSquaredWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:290` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 3

**Called by:**
- `step` (3)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 3

**Called by:**
- `map` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:555` | Self: 0.0% (2.1ms) | Total: 0.0% (2.1ms) | Samples: 3

**Called by:**
- `projectTo3D` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (2.1ms) | Total: 0.0% (2.1ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:649` | Self: 0.0% (2.0ms) | Total: 0.7% (65.3ms) | Samples: 3

**Called by:**
- `map` (84)

**Calls:**
- `map` (81)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:588` | Self: 0.0% (2.0ms) | Total: 0.7% (68.8ms) | Samples: 3

**Called by:**
- `runTrial` (85)
- `runTrial` (1)

**Calls:**
- `map` (83)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` | Self: 0.0% (1.8ms) | Total: 0.0% (1.8ms) | Samples: 2

**Called by:**
- `(anonymous)` (2)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.7ms) | Total: 0.0% (1.7ms) | Samples: 2

**Called by:**
- `step` (2)

### `forEach`
`[native code]` | Self: 0.0% (1.7ms) | Total: 1.6% (147.4ms) | Samples: 2

**Called by:**
- `step` (190)
- `step` (2)

**Calls:**
- `(anonymous)` (163)
- `(anonymous)` (27)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` | Self: 0.0% (1.7ms) | Total: 0.0% (1.7ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:651` | Self: 0.0% (1.7ms) | Total: 0.0% (1.7ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `abs`
`[native code]` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 2

**Called by:**
- `map` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:690` | Self: 0.0% (1.5ms) | Total: 4.7% (429.7ms) | Samples: 2

**Called by:**
- `runTrial` (545)
- `runTrial` (4)

**Calls:**
- `reconstructSymmetric` (546)
- `reconstructSymmetric` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` | Self: 0.0% (1.5ms) | Total: 4.7% (436.9ms) | Samples: 2

**Called by:**
- `runTrial` (576)
- `runTrial` (3)

**Calls:**
- `transformFromEigenCoordinates` (571)
- `transformFromEigenCoordinates` (6)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:702` | Self: 0.0% (1.5ms) | Total: 0.2% (20.6ms) | Samples: 2

**Called by:**
- `forEach` (27)

**Calls:**
- `map` (25)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:641` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `reduce`
`[native code]` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:740` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:734` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:550` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `(anonymous)` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `sort` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (904us) | Total: 0.0% (904us) | Samples: 1

**Called by:**
- `step` (1)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:237` | Self: 0.0% (890us) | Total: 0.0% (890us) | Samples: 1

**Called by:**
- `step` (1)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:40` | Self: 0.0% (868us) | Total: 0.0% (1.6ms) | Samples: 1

**Called by:**
- `step` (2)

**Calls:**
- `fill` (1)

### `WriteStream`
`internal:fs/streams` | Self: 0.0% (865us) | Total: 0.0% (865us) | Samples: 1

**Called by:**
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` | Self: 0.0% (862us) | Total: 0.0% (862us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` | Self: 0.0% (857us) | Total: 0.0% (4.8ms) | Samples: 1

**Called by:**
- `runTrial` (6)

**Calls:**
- `map` (5)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:54` | Self: 0.0% (853us) | Total: 0.0% (853us) | Samples: 1

**Called by:**
- `(module)` (1)

### `isFinite`
`[native code]` | Self: 0.0% (830us) | Total: 0.0% (830us) | Samples: 1

**Called by:**
- `step` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:478` | Self: 0.0% (816us) | Total: 0.0% (2.4ms) | Samples: 1

**Called by:**
- `runTrial` (3)

**Calls:**
- `createIdentityMatrix` (2)

### `makeSafe`
`internal:primordials:29` | Self: 0.0% (804us) | Total: 0.0% (804us) | Samples: 1

**Called by:**
- `internal:primordials` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:731` | Self: 0.0% (798us) | Total: 0.0% (798us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:631` | Self: 0.0% (791us) | Total: 0.6% (58.4ms) | Samples: 1

**Called by:**
- `runTrial` (73)
- `runTrial` (1)

**Calls:**
- `whitenWithEigensystem` (37)
- `whitenWithEigensystem` (35)
- `whitenWithEigensystem` (1)

### `mahalanobisSquaredWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:285` | Self: 0.0% (772us) | Total: 0.0% (772us) | Samples: 1

**Called by:**
- `step` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:334` | Self: 0.0% (769us) | Total: 0.0% (769us) | Samples: 1

**Called by:**
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` | Self: 0.0% (762us) | Total: 0.4% (37.6ms) | Samples: 1

**Called by:**
- `step` (50)

**Calls:**
- `sort` (45)
- `from` (4)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:492` | Self: 0.0% (748us) | Total: 0.0% (748us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (719us) | Total: 0.0% (719us) | Samples: 1

**Called by:**
- `step` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:451` | Self: 0.0% (682us) | Total: 0.0% (682us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` | Self: 0.0% (649us) | Total: 0.0% (649us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `every`
`[native code]` | Self: 0.0% (644us) | Total: 0.0% (644us) | Samples: 1

**Called by:**
- `CMAESOptimizerND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:701` | Self: 0.0% (643us) | Total: 1.6% (146.3ms) | Samples: 1

**Called by:**
- `runTrial` (191)

**Calls:**
- `forEach` (190)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:89` | Self: 0.0% (637us) | Total: 0.0% (637us) | Samples: 1

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:579` | Self: 0.0% (634us) | Total: 0.0% (634us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (847us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (0us) | Total: 0.8% (73.5ms) | Samples: 0

**Called by:**
- `jacobiEigenSymmetric` (91)

**Calls:**
- `some` (91)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (847us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (804us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` | Self: 0.0% (0us) | Total: 0.0% (1.7ms) | Samples: 0

**Called by:**
- `runTrial` (2)

**Calls:**
- `forEach` (2)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (804us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` | Self: 0.0% (0us) | Total: 0.2% (19.8ms) | Samples: 0

**Called by:**
- `step` (25)

**Calls:**
- `Float64Array` (25)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `internal:streams/end-of-stream`
`internal:streams/end-of-stream:17` | Self: 0.0% (0us) | Total: 0.0% (817us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (847us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:741` | Self: 0.0% (0us) | Total: 0.0% (910us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `push` (1)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (804us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` | Self: 0.0% (0us) | Total: 0.0% (6.2ms) | Samples: 0

**Calls:**
- `(anonymous)` (8)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:729` | Self: 0.0% (0us) | Total: 0.4% (43.0ms) | Samples: 0

**Called by:**
- `runTrial` (55)

**Calls:**
- `cloneMatrix` (48)
- `map` (7)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` | Self: 0.0% (0us) | Total: 6.6% (604.0ms) | Samples: 0

**Calls:**
- `runTrial` (781)
- `runTrial` (6)
- `runTrial` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:481` | Self: 0.0% (0us) | Total: 0.0% (666us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `createIdentityMatrix` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:50` | Self: 0.0% (0us) | Total: 0.0% (1.7ms) | Samples: 0

**Called by:**
- `(module)` (1)

**Calls:**
- `from` (1)

### `internal:streams/operators`
`internal:streams/operators:2` | Self: 0.0% (0us) | Total: 0.0% (817us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (2.3ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:699` | Self: 0.0% (0us) | Total: 0.9% (84.2ms) | Samples: 0

**Called by:**
- `runTrial` (108)

**Calls:**
- `alignProjectionBasis` (57)
- `alignProjectionBasis` (50)
- `alignProjectionBasis` (1)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (2.3ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:465` | Self: 0.0% (0us) | Total: 0.0% (644us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `every` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` | Self: 0.0% (0us) | Total: 0.0% (6.1ms) | Samples: 0

**Called by:**
- `step` (8)

**Calls:**
- `map` (8)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:694` | Self: 0.0% (0us) | Total: 0.0% (830us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `isFinite` (1)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.0% (0us) | Total: 0.3% (31.9ms) | Samples: 0

**Called by:**
- `step` (39)
- `createIdentityMatrix` (3)

**Calls:**
- `from` (42)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:648` | Self: 0.0% (0us) | Total: 0.7% (67.2ms) | Samples: 0

**Called by:**
- `runTrial` (85)
- `runTrial` (1)

**Calls:**
- `map` (86)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` | Self: 0.0% (0us) | Total: 0.8% (73.5ms) | Samples: 0

**Called by:**
- `step` (91)

**Calls:**
- `validateSquareFiniteMatrix` (91)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` | Self: 0.0% (0us) | Total: 0.0% (5.2ms) | Samples: 0

**Called by:**
- `(module)` (7)

**Calls:**
- `CMAESOptimizerND` (3)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` | Self: 0.0% (0us) | Total: 0.0% (8.3ms) | Samples: 0

**Called by:**
- `runTrial` (11)

**Calls:**
- `map` (11)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:615` | Self: 0.0% (0us) | Total: 0.0% (736us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `createZeroVector` (1)

### `node:fs`
`node:fs:299` | Self: 0.0% (0us) | Total: 0.0% (626us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` | Self: 0.0% (0us) | Total: 0.0% (2.2ms) | Samples: 0

**Called by:**
- `step` (3)

**Calls:**
- `map` (3)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `(anonymous)` (2)

**Calls:**
- `anonymous` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:689` | Self: 0.0% (0us) | Total: 46.8% (4.27s) | Samples: 0

**Called by:**
- `runTrial` (5526)
- `runTrial` (20)

**Calls:**
- `jacobiEigenSymmetric` (5157)
- `jacobiEigenSymmetric` (103)
- `jacobiEigenSymmetric` (92)
- `jacobiEigenSymmetric` (91)
- `jacobiEigenSymmetric` (50)
- `jacobiEigenSymmetric` (25)
- `jacobiEigenSymmetric` (13)
- `jacobiEigenSymmetric` (8)
- `jacobiEigenSymmetric` (3)
- `jacobiEigenSymmetric` (3)
- `jacobiEigenSymmetric` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` | Self: 0.0% (0us) | Total: 99.4% (9.08s) | Samples: 0

**Called by:**
- `(module)` (11023)
- `(module)` (781)

**Calls:**
- `step` (5526)
- `step` (2262)
- `step` (576)
- `step` (545)
- `step` (477)
- `step` (397)
- `step` (261)
- `step` (260)
- `step` (249)
- `step` (192)
- `step` (191)
- `step` (108)
- `step` (100)
- `step` (100)
- `step` (85)
- `step` (85)
- `step` (73)
- `step` (55)
- `step` (30)
- `step` (28)
- `step` (23)
- `step` (22)
- `step` (17)
- `step` (16)
- `step` (15)
- `step` (13)
- `step` (11)
- `step` (9)
- `step` (8)
- `step` (7)
- `step` (7)
- `step` (6)
- `step` (6)
- `step` (4)
- `step` (4)
- `step` (3)
- `step` (3)
- `step` (3)
- `step` (2)
- `step` (2)
- `step` (2)
- `step` (2)
- `step` (2)
- `step` (2)
- `step` (2)
- `step` (2)
- `step` (2)
- `step` (2)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:721` | Self: 0.0% (0us) | Total: 0.1% (13.3ms) | Samples: 0

**Called by:**
- `runTrial` (17)

**Calls:**
- `projectTo3D` (16)
- `projectTo3D` (1)

### `internal:primordials`
`internal:primordials:73` | Self: 0.0% (0us) | Total: 0.0% (804us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `makeSafe` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:720` | Self: 0.0% (0us) | Total: 0.1% (12.2ms) | Samples: 0

**Called by:**
- `runTrial` (16)

**Calls:**
- `projectTo3D` (15)
- `projectTo3D` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` | Self: 0.0% (0us) | Total: 93.3% (8.52s) | Samples: 0

**Calls:**
- `runTrial` (11023)
- `runTrial` (42)
- `runTrial` (7)
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:706` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `runTrial` (2)

**Calls:**
- `reduce` (2)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` | Self: 0.0% (0us) | Total: 0.3% (35.6ms) | Samples: 0

**Called by:**
- `(module)` (42)
- `(module)` (6)

**Calls:**
- `step` (20)
- `step` (8)
- `step` (4)
- `step` (3)
- `step` (2)
- `step` (2)
- `step` (2)
- `step` (2)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)

### `createIdentityMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:31` | Self: 0.0% (0us) | Total: 0.0% (2.3ms) | Samples: 0

**Called by:**
- `CMAESOptimizerND` (2)
- `CMAESOptimizerND` (1)

**Calls:**
- `createZeroMatrix` (3)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 0.0% (0us) | Total: 0.8% (76.7ms) | Samples: 0

**Called by:**
- `step` (48)
- `alignProjectionBasis` (48)

**Calls:**
- `map` (96)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (6.2ms) | Samples: 0

**Called by:**
- `(module)` (8)

**Calls:**
- `anonymous` (5)
- `get WriteStream` (2)
- `WriteStream` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` | Self: 0.0% (0us) | Total: 0.4% (40.8ms) | Samples: 0

**Called by:**
- `step` (50)

**Calls:**
- `cloneMatrix` (48)
- `map` (2)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 92.2% | 8.43s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 7.3% | 672.7ms | `[native code]` |
| 0.3% | 31.2ms | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.0% | 865us | `internal:fs/streams` |
| 0.0% | 804us | `internal:primordials` |
