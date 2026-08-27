# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 10.27s | 13140 | 500us | 182 |

**Top 10:** `jacobiEigenSymmetric` 40.9%, `step` 19.5%, `transformFromEigenCoordinates` 4.3%, `step` 3.3%, `mahalanobisSquaredWithEigensystem` 3.0%, `map` 2.6%, `reconstructSymmetric` 2.5%, `step` 2.1%, `step` 1.9%, `fill` 1.6%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 40.9% | 4.20s | 42.5% | 4.37s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 19.5% | 2.01s | 19.5% | 2.01s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` |
| 4.3% | 443.3ms | 4.4% | 459.3ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 3.3% | 345.0ms | 3.9% | 402.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 3.0% | 314.3ms | 3.1% | 318.8ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:286` |
| 2.6% | 274.2ms | 5.2% | 540.9ms | `map` | `[native code]` |
| 2.5% | 256.7ms | 2.9% | 302.9ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` |
| 2.1% | 223.3ms | 2.1% | 223.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` |
| 1.9% | 198.7ms | 1.9% | 198.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:686` |
| 1.6% | 167.0ms | 1.6% | 167.0ms | `fill` | `[native code]` |
| 1.5% | 163.7ms | 1.5% | 163.7ms | `hypot` | `[native code]` |
| 1.4% | 149.1ms | 2.4% | 246.4ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.3% | 142.8ms | 1.3% | 142.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:683` |
| 1.2% | 129.0ms | 1.2% | 129.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.0% | 105.4ms | 1.0% | 105.4ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.8% | 87.0ms | 0.8% | 87.0ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 0.8% | 82.2ms | 0.8% | 82.2ms | `Float64Array` | `[native code]` |
| 0.7% | 73.9ms | 1.0% | 109.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.7% | 73.6ms | 0.7% | 73.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.6% | 68.3ms | 1.5% | 158.7ms | `from` | `[native code]` |
| 0.5% | 51.9ms | 1.6% | 165.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` |
| 0.4% | 46.2ms | 0.5% | 55.4ms | `sort` | `[native code]` |
| 0.4% | 44.6ms | 0.9% | 95.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.3% | 38.9ms | 0.3% | 38.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.3% | 37.2ms | 1.2% | 124.4ms | `some` | `[native code]` |
| 0.3% | 36.2ms | 0.7% | 76.1ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.3% | 32.6ms | 0.3% | 32.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.2% | 30.1ms | 0.3% | 30.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` |
| 0.2% | 23.5ms | 0.2% | 25.9ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` |
| 0.2% | 22.7ms | 0.2% | 22.7ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:328` |
| 0.2% | 20.7ms | 0.2% | 21.5ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 0.1% | 20.3ms | 0.1% | 20.3ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.1% | 16.5ms | 0.1% | 17.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` |
| 0.1% | 16.2ms | 0.1% | 16.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` |
| 0.1% | 14.8ms | 0.1% | 16.3ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:548` |
| 0.1% | 14.4ms | 0.1% | 14.4ms | `push` | `[native code]` |
| 0.1% | 13.8ms | 0.1% | 13.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:625` |
| 0.1% | 13.0ms | 0.1% | 13.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` |
| 0.1% | 12.4ms | 0.1% | 14.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` |
| 0.1% | 11.7ms | 0.8% | 87.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:589` |
| 0.1% | 10.5ms | 0.1% | 10.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |
| 0.0% | 9.7ms | 0.0% | 9.7ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:558` |
| 0.0% | 9.5ms | 0.0% | 9.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` |
| 0.0% | 8.3ms | 0.0% | 8.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 8.1ms | 0.0% | 8.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:591` |
| 0.0% | 7.3ms | 0.2% | 21.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.0% | 6.6ms | 0.0% | 6.6ms | `abs` | `[native code]` |
| 0.0% | 6.2ms | 2.8% | 291.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:585` |
| 0.0% | 5.8ms | 0.6% | 65.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.0% | 5.8ms | 0.2% | 29.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 0.0% | 5.3ms | 0.0% | 5.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:731` |
| 0.0% | 5.1ms | 0.8% | 89.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.0% | 5.1ms | 0.0% | 5.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:735` |
| 0.0% | 4.6ms | 0.0% | 4.6ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 4.5ms | 0.2% | 27.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:702` |
| 0.0% | 4.3ms | 3.2% | 328.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` |
| 0.0% | 4.0ms | 0.2% | 24.0ms | `anonymous` | `[native code]` |
| 0.0% | 4.0ms | 0.0% | 7.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:741` |
| 0.0% | 3.4ms | 0.0% | 3.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.1ms | 0.5% | 52.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:631` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.1ms | 0.0% | 3.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:719` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:285` |
| 0.0% | 2.9ms | 0.0% | 2.9ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` |
| 0.0% | 2.9ms | 0.0% | 2.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:740` |
| 0.0% | 2.9ms | 1.9% | 196.0ms | `forEach` | `[native code]` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `reduce` | `[native code]` |
| 0.0% | 2.6ms | 3.0% | 308.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:690` |
| 0.0% | 2.6ms | 0.0% | 2.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `isFinite` | `[native code]` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:734` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.2ms | 0.0% | 7.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:584` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:397` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:651` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `exp` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:641` |
| 0.0% | 1.5ms | 0.0% | 4.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:706` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:588` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `max` | `[native code]` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:409` |
| 0.0% | 1.2ms | 99.4% | 10.21s | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 0.0% | 1.2ms | 0.4% | 43.3ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:550` |
| 0.0% | 989us | 1.5% | 158.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:699` |
| 0.0% | 924us | 0.0% | 924us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` |
| 0.0% | 908us | 0.7% | 74.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:649` |
| 0.0% | 902us | 0.3% | 39.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.0% | 899us | 0.0% | 899us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 0.0% | 896us | 0.0% | 896us | `(unknown)` | `[native code]` |
| 0.0% | 894us | 0.0% | 7.2ms | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.0% | 887us | 0.0% | 887us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` |
| 0.0% | 873us | 0.0% | 873us | `node:fs` | `node:fs:291` |
| 0.0% | 865us | 0.0% | 865us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:335` |
| 0.0% | 859us | 0.0% | 3.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:694` |
| 0.0% | 851us | 0.0% | 851us | `WriteStream` | `internal:fs/streams` |
| 0.0% | 847us | 0.0% | 847us | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 838us | 4.5% | 466.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` |
| 0.0% | 836us | 0.0% | 836us | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:289` |
| 0.0% | 836us | 0.0% | 836us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:152` |
| 0.0% | 830us | 0.0% | 830us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 811us | 0.0% | 811us | `sqrt` | `[native code]` |
| 0.0% | 808us | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:581` |
| 0.0% | 806us | 0.0% | 806us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:544` |
| 0.0% | 805us | 0.0% | 805us | `slice` | `[native code]` |
| 0.0% | 785us | 0.0% | 785us | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:21` |
| 0.0% | 785us | 0.0% | 785us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:193` |
| 0.0% | 782us | 0.0% | 782us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:252` |
| 0.0% | 779us | 0.0% | 779us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 0.0% | 771us | 0.0% | 771us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:504` |
| 0.0% | 762us | 0.0% | 762us | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:290` |
| 0.0% | 759us | 0.0% | 759us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` |
| 0.0% | 757us | 0.6% | 67.8ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 0.0% | 748us | 0.0% | 2.0ms | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:447` |
| 0.0% | 738us | 0.0% | 738us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:451` |
| 0.0% | 738us | 0.0% | 738us | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:297` |
| 0.0% | 737us | 0.9% | 94.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:588` |
| 0.0% | 733us | 0.4% | 47.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 0.0% | 732us | 0.0% | 732us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:579` |
| 0.0% | 719us | 0.0% | 9.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:720` |
| 0.0% | 707us | 0.0% | 4.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:615` |
| 0.0% | 686us | 0.7% | 80.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:648` |
| 0.0% | 680us | 0.0% | 4.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.0% | 676us | 0.0% | 676us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:685` |
| 0.0% | 672us | 0.0% | 672us | `log` | `[native code]` |
| 0.0% | 663us | 0.0% | 663us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:628` |
| 0.0% | 651us | 0.0% | 651us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:640` |
| 0.0% | 635us | 0.0% | 635us | `filter` | `[native code]` |
| 0.0% | 626us | 0.0% | 626us | `(anonymous)` | `internal:primordials:34` |
| 0.0% | 570us | 0.0% | 570us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 99.4% | 10.21s | 0.0% | 1.2ms | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 93.5% | 9.60s | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` |
| 46.5% | 4.77s | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:689` |
| 42.5% | 4.37s | 40.9% | 4.20s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 19.5% | 2.01s | 19.5% | 2.01s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` |
| 6.3% | 653.0ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` |
| 5.2% | 540.9ms | 2.6% | 274.2ms | `map` | `[native code]` |
| 4.5% | 466.5ms | 0.0% | 838us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` |
| 4.4% | 459.3ms | 4.3% | 443.3ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 3.9% | 402.3ms | 3.3% | 345.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 3.2% | 328.6ms | 0.0% | 4.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` |
| 3.1% | 318.8ms | 3.0% | 314.3ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:286` |
| 3.0% | 308.8ms | 0.0% | 2.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:690` |
| 2.9% | 302.9ms | 2.5% | 256.7ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` |
| 2.8% | 291.6ms | 0.0% | 6.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:585` |
| 2.4% | 246.4ms | 1.4% | 149.1ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 2.1% | 223.3ms | 2.1% | 223.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` |
| 1.9% | 198.7ms | 1.9% | 198.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:686` |
| 1.9% | 196.0ms | 0.0% | 2.9ms | `forEach` | `[native code]` |
| 1.8% | 191.6ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:701` |
| 1.6% | 167.0ms | 1.6% | 167.0ms | `fill` | `[native code]` |
| 1.6% | 165.4ms | 0.5% | 51.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` |
| 1.5% | 163.7ms | 1.5% | 163.7ms | `hypot` | `[native code]` |
| 1.5% | 158.7ms | 0.6% | 68.3ms | `from` | `[native code]` |
| 1.5% | 158.2ms | 0.0% | 989us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:699` |
| 1.3% | 142.8ms | 1.3% | 142.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:683` |
| 1.2% | 129.0ms | 1.2% | 129.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.2% | 124.4ms | 0.3% | 37.2ms | `some` | `[native code]` |
| 1.0% | 112.7ms | 0.0% | 0us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 1.0% | 109.5ms | 0.7% | 73.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 1.0% | 105.4ms | 1.0% | 105.4ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.9% | 95.6ms | 0.4% | 44.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.9% | 94.5ms | 0.0% | 737us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:588` |
| 0.8% | 89.2ms | 0.0% | 5.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.8% | 87.8ms | 0.1% | 11.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:589` |
| 0.8% | 87.0ms | 0.8% | 87.0ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 0.8% | 82.2ms | 0.8% | 82.2ms | `Float64Array` | `[native code]` |
| 0.7% | 80.0ms | 0.0% | 686us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:648` |
| 0.7% | 76.1ms | 0.3% | 36.2ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.7% | 74.5ms | 0.0% | 908us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:649` |
| 0.7% | 73.6ms | 0.7% | 73.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.6% | 67.8ms | 0.0% | 757us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 0.6% | 65.1ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 0.6% | 65.1ms | 0.0% | 0us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.6% | 65.1ms | 0.0% | 5.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.5% | 60.0ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:729` |
| 0.5% | 55.4ms | 0.4% | 46.2ms | `sort` | `[native code]` |
| 0.5% | 52.1ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:631` |
| 0.4% | 47.3ms | 0.0% | 733us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 0.4% | 43.3ms | 0.0% | 1.2ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.3% | 39.7ms | 0.0% | 902us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.3% | 38.9ms | 0.3% | 38.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.3% | 38.3ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` |
| 0.3% | 32.6ms | 0.3% | 32.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.3% | 30.9ms | 0.2% | 30.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` |
| 0.2% | 29.9ms | 0.0% | 5.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 0.2% | 27.7ms | 0.0% | 4.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:702` |
| 0.2% | 25.9ms | 0.2% | 23.5ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` |
| 0.2% | 24.0ms | 0.0% | 4.0ms | `anonymous` | `[native code]` |
| 0.2% | 22.7ms | 0.2% | 22.7ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:328` |
| 0.2% | 21.7ms | 0.0% | 7.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.2% | 21.5ms | 0.2% | 20.7ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 0.1% | 20.3ms | 0.1% | 20.3ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.1% | 17.5ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.1% | 17.3ms | 0.1% | 16.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` |
| 0.1% | 16.3ms | 0.1% | 14.8ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:548` |
| 0.1% | 16.2ms | 0.1% | 16.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` |
| 0.1% | 15.2ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` |
| 0.1% | 14.5ms | 0.1% | 12.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` |
| 0.1% | 14.4ms | 0.1% | 14.4ms | `push` | `[native code]` |
| 0.1% | 13.8ms | 0.1% | 13.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:625` |
| 0.1% | 13.2ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:721` |
| 0.1% | 13.0ms | 0.1% | 13.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` |
| 0.1% | 10.5ms | 0.1% | 10.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |
| 0.1% | 10.4ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` |
| 0.0% | 9.7ms | 0.0% | 9.7ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:558` |
| 0.0% | 9.6ms | 0.0% | 719us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:720` |
| 0.0% | 9.5ms | 0.0% | 9.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` |
| 0.0% | 8.3ms | 0.0% | 8.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 8.1ms | 0.0% | 8.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:591` |
| 0.0% | 7.2ms | 0.0% | 894us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.0% | 7.1ms | 0.0% | 4.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:741` |
| 0.0% | 7.0ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` |
| 0.0% | 6.6ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` |
| 0.0% | 6.6ms | 0.0% | 6.6ms | `abs` | `[native code]` |
| 0.0% | 6.3ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.0% | 5.3ms | 0.0% | 5.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:731` |
| 0.0% | 5.1ms | 0.0% | 5.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:735` |
| 0.0% | 4.6ms | 0.0% | 4.6ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 4.6ms | 0.0% | 707us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:615` |
| 0.0% | 4.5ms | 0.0% | 680us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.0% | 4.3ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:706` |
| 0.0% | 3.9ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:719` |
| 0.0% | 3.6ms | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:334` |
| 0.0% | 3.4ms | 0.0% | 3.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.2ms | 0.0% | 859us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:694` |
| 0.0% | 3.1ms | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:519` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:285` |
| 0.0% | 2.9ms | 0.0% | 2.9ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` |
| 0.0% | 2.9ms | 0.0% | 2.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:740` |
| 0.0% | 2.9ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `reduce` | `[native code]` |
| 0.0% | 2.6ms | 0.0% | 2.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `isFinite` | `[native code]` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:734` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:584` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:397` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.0ms | 0.0% | 748us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:447` |
| 0.0% | 2.0ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 1.7ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 1.7ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 1.7ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 1.7ms | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 1.7ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:651` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `exp` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:641` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` |
| 0.0% | 1.4ms | 0.0% | 808us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:581` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:588` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `max` | `[native code]` |
| 0.0% | 1.3ms | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 1.3ms | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 1.3ms | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:409` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:550` |
| 0.0% | 924us | 0.0% | 924us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` |
| 0.0% | 899us | 0.0% | 899us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 0.0% | 896us | 0.0% | 896us | `(unknown)` | `[native code]` |
| 0.0% | 890us | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:332` |
| 0.0% | 887us | 0.0% | 887us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` |
| 0.0% | 873us | 0.0% | 873us | `node:fs` | `node:fs:291` |
| 0.0% | 865us | 0.0% | 865us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:335` |
| 0.0% | 853us | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 853us | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 853us | 0.0% | 0us | `internal:streams/readable` | `internal:streams/readable:2` |
| 0.0% | 851us | 0.0% | 851us | `WriteStream` | `internal:fs/streams` |
| 0.0% | 847us | 0.0% | 847us | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 840us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:487` |
| 0.0% | 836us | 0.0% | 836us | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:289` |
| 0.0% | 836us | 0.0% | 836us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:152` |
| 0.0% | 830us | 0.0% | 830us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 811us | 0.0% | 811us | `sqrt` | `[native code]` |
| 0.0% | 806us | 0.0% | 806us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:544` |
| 0.0% | 805us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:492` |
| 0.0% | 805us | 0.0% | 805us | `slice` | `[native code]` |
| 0.0% | 785us | 0.0% | 785us | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:21` |
| 0.0% | 785us | 0.0% | 785us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:193` |
| 0.0% | 782us | 0.0% | 782us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:252` |
| 0.0% | 779us | 0.0% | 779us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 0.0% | 771us | 0.0% | 771us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:504` |
| 0.0% | 762us | 0.0% | 762us | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:290` |
| 0.0% | 759us | 0.0% | 759us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` |
| 0.0% | 738us | 0.0% | 738us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:451` |
| 0.0% | 738us | 0.0% | 738us | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:297` |
| 0.0% | 732us | 0.0% | 732us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:579` |
| 0.0% | 696us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:452` |
| 0.0% | 676us | 0.0% | 676us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:685` |
| 0.0% | 672us | 0.0% | 672us | `log` | `[native code]` |
| 0.0% | 672us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:457` |
| 0.0% | 663us | 0.0% | 663us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:628` |
| 0.0% | 651us | 0.0% | 651us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:640` |
| 0.0% | 635us | 0.0% | 635us | `filter` | `[native code]` |
| 0.0% | 635us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:491` |
| 0.0% | 626us | 0.0% | 0us | `makeSafe` | `internal:primordials:31` |
| 0.0% | 626us | 0.0% | 0us | `internal:primordials` | `internal:primordials:73` |
| 0.0% | 626us | 0.0% | 626us | `(anonymous)` | `internal:primordials:34` |
| 0.0% | 626us | 0.0% | 0us | `bound call` | `[native code]` |
| 0.0% | 570us | 0.0% | 570us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` |

## Function Details

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` | Self: 40.9% (4.20s) | Total: 42.5% (4.37s) | Samples: 5390

**Called by:**
- `step` (5591)

**Calls:**
- `hypot` (201)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` | Self: 19.5% (2.01s) | Total: 19.5% (2.01s) | Samples: 2595

**Called by:**
- `runTrial` (2583)
- `runTrial` (12)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` | Self: 4.3% (443.3ms) | Total: 4.4% (459.3ms) | Samples: 569

**Called by:**
- `step` (589)

**Calls:**
- `createZeroVector` (17)
- `fill` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` | Self: 3.3% (345.0ms) | Total: 3.9% (402.3ms) | Samples: 451

**Called by:**
- `runTrial` (521)
- `runTrial` (1)

**Calls:**
- `createZeroMatrix` (57)
- `from` (11)
- `createZeroMatrix` (3)

### `mahalanobisSquaredWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:286` | Self: 3.0% (314.3ms) | Total: 3.1% (318.8ms) | Samples: 410

**Called by:**
- `step` (416)

**Calls:**
- `fill` (3)
- `createZeroVector` (3)

### `map`
`[native code]` | Self: 2.6% (274.2ms) | Total: 5.2% (540.9ms) | Samples: 343

**Called by:**
- `cloneMatrix` (148)
- `step` (117)
- `step` (111)
- `step` (102)
- `(anonymous)` (95)
- `(anonymous)` (31)
- `jacobiEigenSymmetric` (17)
- `jacobiEigenSymmetric` (16)
- `step` (14)
- `step` (11)
- `jacobiEigenSymmetric` (8)
- `step` (7)
- `alignProjectionBasis` (3)
- `CMAESOptimizerND` (2)
- `map` (1)

**Calls:**
- `(anonymous)` (135)
- `(anonymous)` (96)
- `(anonymous)` (94)
- `abs` (7)
- `(anonymous)` (2)
- `(anonymous)` (2)
- `(anonymous)` (2)
- `fill` (1)
- `map` (1)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` | Self: 2.5% (256.7ms) | Total: 2.9% (302.9ms) | Samples: 332

**Called by:**
- `step` (389)

**Calls:**
- `from` (56)
- `createZeroMatrix` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` | Self: 2.1% (223.3ms) | Total: 2.1% (223.3ms) | Samples: 294

**Called by:**
- `runTrial` (293)
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:686` | Self: 1.9% (198.7ms) | Total: 1.9% (198.7ms) | Samples: 254

**Called by:**
- `runTrial` (251)
- `runTrial` (3)

### `fill`
`[native code]` | Self: 1.6% (167.0ms) | Total: 1.6% (167.0ms) | Samples: 209

**Called by:**
- `sampleGaussianVectorND` (121)
- `ellipsoidObjective` (53)
- `from` (24)
- `mahalanobisSquaredWithEigensystem` (3)
- `transformFromEigenCoordinates` (3)
- `whitenWithEigensystem` (1)
- `whitenWithEigensystem` (1)
- `sampleGaussianVectorND` (1)
- `map` (1)
- `sampleGaussianVectorND` (1)

### `hypot`
`[native code]` | Self: 1.5% (163.7ms) | Total: 1.5% (163.7ms) | Samples: 201

**Called by:**
- `jacobiEigenSymmetric` (201)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.4% (149.1ms) | Total: 2.4% (246.4ms) | Samples: 191

**Called by:**
- `step` (312)

**Calls:**
- `fill` (121)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:683` | Self: 1.3% (142.8ms) | Total: 1.3% (142.8ms) | Samples: 190

**Called by:**
- `runTrial` (189)
- `runTrial` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.2% (129.0ms) | Total: 1.2% (129.0ms) | Samples: 163

**Called by:**
- `map` (135)
- `some` (27)
- `from` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.0% (105.4ms) | Total: 1.0% (105.4ms) | Samples: 131

**Called by:**
- `(anonymous)` (106)
- `step` (13)
- `step` (12)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` | Self: 0.8% (87.0ms) | Total: 0.8% (87.0ms) | Samples: 103

**Called by:**
- `step` (103)

### `Float64Array`
`[native code]` | Self: 0.8% (82.2ms) | Total: 0.8% (82.2ms) | Samples: 98

**Called by:**
- `jacobiEigenSymmetric` (53)
- `jacobiEigenSymmetric` (45)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` | Self: 0.7% (73.9ms) | Total: 1.0% (109.5ms) | Samples: 96

**Called by:**
- `step` (141)

**Calls:**
- `Float64Array` (45)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 0.7% (73.6ms) | Total: 0.7% (73.6ms) | Samples: 94

**Called by:**
- `map` (94)

### `from`
`[native code]` | Self: 0.6% (68.3ms) | Total: 1.5% (158.7ms) | Samples: 84

**Called by:**
- `jacobiEigenSymmetric` (64)
- `reconstructSymmetric` (56)
- `createZeroMatrix` (56)
- `step` (11)
- `jacobiEigenSymmetric` (10)
- `CMAESOptimizerND` (1)

**Calls:**
- `(anonymous)` (49)
- `(anonymous)` (40)
- `fill` (24)
- `(anonymous)` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` | Self: 0.5% (51.9ms) | Total: 1.6% (165.4ms) | Samples: 64

**Called by:**
- `forEach` (205)

**Calls:**
- `projectTo3D` (106)
- `projectTo3D` (17)
- `projectTo3D` (12)
- `projectTo3D` (4)
- `projectTo3D` (2)

### `sort`
`[native code]` | Self: 0.4% (46.2ms) | Total: 0.5% (55.4ms) | Samples: 58

**Called by:**
- `jacobiEigenSymmetric` (40)
- `step` (30)

**Calls:**
- `(anonymous)` (11)
- `(anonymous)` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.4% (44.6ms) | Total: 0.9% (95.6ms) | Samples: 59

**Called by:**
- `step` (124)

**Calls:**
- `from` (64)
- `max` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.3% (38.9ms) | Total: 0.3% (38.9ms) | Samples: 49

**Called by:**
- `from` (49)

### `some`
`[native code]` | Self: 0.3% (37.2ms) | Total: 1.2% (124.4ms) | Samples: 48

**Called by:**
- `validateSquareFiniteMatrix` (78)
- `(anonymous)` (75)

**Calls:**
- `(anonymous)` (78)
- `(anonymous)` (27)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` | Self: 0.3% (36.2ms) | Total: 0.7% (76.1ms) | Samples: 46

**Called by:**
- `step` (99)

**Calls:**
- `fill` (53)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.3% (32.6ms) | Total: 0.3% (32.6ms) | Samples: 40

**Called by:**
- `from` (40)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` | Self: 0.2% (30.1ms) | Total: 0.3% (30.9ms) | Samples: 39

**Called by:**
- `runTrial` (40)

**Calls:**
- `adaptationPoint` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` | Self: 0.2% (23.5ms) | Total: 0.2% (25.9ms) | Samples: 31

**Called by:**
- `step` (34)

**Calls:**
- `createZeroVector` (2)
- `fill` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:328` | Self: 0.2% (22.7ms) | Total: 0.2% (22.7ms) | Samples: 28

**Called by:**
- `step` (28)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` | Self: 0.2% (20.7ms) | Total: 0.2% (21.5ms) | Samples: 27

**Called by:**
- `step` (28)

**Calls:**
- `fill` (1)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` | Self: 0.1% (20.3ms) | Total: 0.1% (20.3ms) | Samples: 26

**Called by:**
- `transformFromEigenCoordinates` (17)
- `step` (4)
- `mahalanobisSquaredWithEigensystem` (3)
- `whitenWithEigensystem` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` | Self: 0.1% (16.5ms) | Total: 0.1% (17.3ms) | Samples: 22

**Called by:**
- `runTrial` (23)

**Calls:**
- `sqrt` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` | Self: 0.1% (16.2ms) | Total: 0.1% (16.2ms) | Samples: 21

**Called by:**
- `runTrial` (21)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:548` | Self: 0.1% (14.8ms) | Total: 0.1% (16.3ms) | Samples: 19

**Called by:**
- `(anonymous)` (17)
- `step` (4)

**Calls:**
- `requireFiniteVector` (2)

### `push`
`[native code]` | Self: 0.1% (14.4ms) | Total: 0.1% (14.4ms) | Samples: 18

**Called by:**
- `step` (13)
- `step` (4)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:625` | Self: 0.1% (13.8ms) | Total: 0.1% (13.8ms) | Samples: 17

**Called by:**
- `runTrial` (17)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` | Self: 0.1% (13.0ms) | Total: 0.1% (13.0ms) | Samples: 16

**Called by:**
- `runTrial` (16)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` | Self: 0.1% (12.4ms) | Total: 0.1% (14.5ms) | Samples: 9

**Called by:**
- `runTrial` (12)

**Calls:**
- `radius` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:589` | Self: 0.1% (11.7ms) | Total: 0.8% (87.8ms) | Samples: 12

**Called by:**
- `runTrial` (110)
- `runTrial` (1)

**Calls:**
- `ellipsoidObjective` (99)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` | Self: 0.1% (10.5ms) | Total: 0.1% (10.5ms) | Samples: 9

**Called by:**
- `runTrial` (9)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:558` | Self: 0.0% (9.7ms) | Total: 0.0% (9.7ms) | Samples: 13

**Called by:**
- `(anonymous)` (12)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` | Self: 0.0% (9.5ms) | Total: 0.0% (9.5ms) | Samples: 11

**Called by:**
- `runTrial` (10)
- `runTrial` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` | Self: 0.0% (8.3ms) | Total: 0.0% (8.3ms) | Samples: 11

**Called by:**
- `sort` (11)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:591` | Self: 0.0% (8.1ms) | Total: 0.0% (8.1ms) | Samples: 11

**Called by:**
- `runTrial` (11)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.0% (7.3ms) | Total: 0.2% (21.7ms) | Samples: 10

**Called by:**
- `step` (28)

**Calls:**
- `map` (16)
- `abs` (1)
- `max` (1)

### `abs`
`[native code]` | Self: 0.0% (6.6ms) | Total: 0.0% (6.6ms) | Samples: 8

**Called by:**
- `map` (7)
- `jacobiEigenSymmetric` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:585` | Self: 0.0% (6.2ms) | Total: 2.8% (291.6ms) | Samples: 8

**Called by:**
- `runTrial` (360)
- `runTrial` (4)

**Calls:**
- `sampleGaussianVectorND` (312)
- `sampleGaussianVectorND` (28)
- `push` (13)
- `sampleGaussianVectorND` (1)
- `sampleGaussianVectorND` (1)
- `sampleGaussianVectorND` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (5.8ms) | Total: 0.6% (65.1ms) | Samples: 3

**Called by:**
- `some` (78)

**Calls:**
- `some` (75)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` | Self: 0.0% (5.8ms) | Total: 0.2% (29.9ms) | Samples: 7

**Called by:**
- `runTrial` (37)

**Calls:**
- `sort` (30)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:731` | Self: 0.0% (5.3ms) | Total: 0.0% (5.3ms) | Samples: 7

**Called by:**
- `runTrial` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` | Self: 0.0% (5.1ms) | Total: 0.8% (89.2ms) | Samples: 7

**Called by:**
- `runTrial` (117)
- `runTrial` (1)

**Calls:**
- `map` (111)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:735` | Self: 0.0% (5.1ms) | Total: 0.0% (5.1ms) | Samples: 7

**Called by:**
- `runTrial` (7)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (4.6ms) | Total: 0.0% (4.6ms) | Samples: 6

**Called by:**
- `step` (6)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:702` | Self: 0.0% (4.5ms) | Total: 0.2% (27.7ms) | Samples: 6

**Called by:**
- `forEach` (35)
- `map` (2)

**Calls:**
- `map` (31)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` | Self: 0.0% (4.3ms) | Total: 3.2% (328.6ms) | Samples: 6

**Called by:**
- `runTrial` (427)
- `runTrial` (2)

**Calls:**
- `mahalanobisSquaredWithEigensystem` (416)
- `mahalanobisSquaredWithEigensystem` (4)
- `mahalanobisSquaredWithEigensystem` (1)
- `mahalanobisSquaredWithEigensystem` (1)
- `mahalanobisSquaredWithEigensystem` (1)

### `anonymous`
`[native code]` | Self: 0.0% (4.0ms) | Total: 0.2% (24.0ms) | Samples: 5

**Called by:**
- `(anonymous)` (5)
- `node:fs` (4)
- `node:fs/promises` (3)
- `internal:fs/streams` (2)
- `node:events` (2)
- `internal:validators` (2)
- `get WriteStream` (2)
- `internal:stream` (2)
- `internal:shared` (2)
- `internal:streams/compose` (2)
- `node:stream` (2)
- `internal:streams/readable` (1)
- `internal:streams/pipeline` (1)
- `internal:streams/duplex` (1)

**Calls:**
- `node:fs` (4)
- `node:fs/promises` (3)
- `internal:fs/streams` (2)
- `node:events` (2)
- `internal:validators` (2)
- `internal:stream` (2)
- `internal:shared` (2)
- `internal:streams/compose` (2)
- `node:stream` (2)
- `internal:streams/pipeline` (1)
- `internal:streams/readable` (1)
- `node:fs` (1)
- `internal:primordials` (1)
- `internal:streams/duplex` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:741` | Self: 0.0% (4.0ms) | Total: 0.0% (7.1ms) | Samples: 5

**Called by:**
- `runTrial` (9)

**Calls:**
- `push` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (3.4ms) | Total: 0.0% (3.4ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:631` | Self: 0.0% (3.1ms) | Total: 0.5% (52.1ms) | Samples: 4

**Called by:**
- `runTrial` (68)

**Calls:**
- `whitenWithEigensystem` (34)
- `whitenWithEigensystem` (28)
- `whitenWithEigensystem` (2)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (3.1ms) | Total: 0.0% (3.1ms) | Samples: 4

**Called by:**
- `step` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:719` | Self: 0.0% (3.1ms) | Total: 0.0% (3.9ms) | Samples: 4

**Called by:**
- `runTrial` (5)

**Calls:**
- `variancePercent` (1)

### `mahalanobisSquaredWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:285` | Self: 0.0% (3.1ms) | Total: 0.0% (3.1ms) | Samples: 4

**Called by:**
- `step` (4)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` | Self: 0.0% (2.9ms) | Total: 0.0% (2.9ms) | Samples: 4

**Called by:**
- `(anonymous)` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:740` | Self: 0.0% (2.9ms) | Total: 0.0% (2.9ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `forEach`
`[native code]` | Self: 0.0% (2.9ms) | Total: 1.9% (196.0ms) | Samples: 4

**Called by:**
- `step` (240)
- `step` (5)
- `bound call` (1)

**Calls:**
- `(anonymous)` (205)
- `(anonymous)` (35)
- `(anonymous)` (1)
- `(anonymous)` (1)

### `reduce`
`[native code]` | Self: 0.0% (2.8ms) | Total: 0.0% (2.8ms) | Samples: 4

**Called by:**
- `step` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:690` | Self: 0.0% (2.6ms) | Total: 3.0% (308.8ms) | Samples: 3

**Called by:**
- `runTrial` (394)
- `runTrial` (2)

**Calls:**
- `reconstructSymmetric` (389)
- `reconstructSymmetric` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` | Self: 0.0% (2.6ms) | Total: 0.0% (2.6ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `isFinite`
`[native code]` | Self: 0.0% (2.4ms) | Total: 0.0% (2.4ms) | Samples: 3

**Called by:**
- `step` (3)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (2.4ms) | Total: 0.0% (2.4ms) | Samples: 3

**Called by:**
- `step` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:734` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (2.2ms) | Total: 0.0% (2.2ms) | Samples: 3

**Called by:**
- `step` (3)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (2.2ms) | Total: 0.0% (2.2ms) | Samples: 3

**Called by:**
- `step` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` | Self: 0.0% (2.2ms) | Total: 0.0% (7.0ms) | Samples: 3

**Called by:**
- `runTrial` (10)

**Calls:**
- `map` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:584` | Self: 0.0% (2.2ms) | Total: 0.0% (2.2ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `requireFiniteVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:397` | Self: 0.0% (2.1ms) | Total: 0.0% (2.1ms) | Samples: 3

**Called by:**
- `projectTo3D` (2)
- `CMAESOptimizerND` (1)

### `radius`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (2.1ms) | Total: 0.0% (2.1ms) | Samples: 3

**Called by:**
- `step` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:651` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `exp`
`[native code]` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:641` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:706` | Self: 0.0% (1.5ms) | Total: 0.0% (4.3ms) | Samples: 2

**Called by:**
- `runTrial` (6)

**Calls:**
- `reduce` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `map` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:588` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `map` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `step` (2)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `step` (2)

### `max`
`[native code]` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:409` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `CMAESOptimizerND` (2)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` | Self: 0.0% (1.2ms) | Total: 99.4% (10.21s) | Samples: 2

**Called by:**
- `(module)` (12254)
- `(module)` (813)

**Calls:**
- `step` (6084)
- `step` (2583)
- `step` (595)
- `step` (521)
- `step` (427)
- `step` (394)
- `step` (360)
- `step` (293)
- `step` (251)
- `step` (239)
- `step` (195)
- `step` (189)
- `step` (118)
- `step` (117)
- `step` (110)
- `step` (102)
- `step` (77)
- `step` (68)
- `step` (40)
- `step` (37)
- `step` (23)
- `step` (21)
- `step` (18)
- `step` (17)
- `step` (16)
- `step` (14)
- `step` (13)
- `step` (12)
- `step` (11)
- `step` (10)
- `step` (10)
- `step` (9)
- `step` (9)
- `step` (7)
- `step` (7)
- `step` (6)
- `step` (6)
- `step` (6)
- `step` (5)
- `step` (4)
- `step` (4)
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
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.0% (1.2ms) | Total: 0.4% (43.3ms) | Samples: 2

**Called by:**
- `step` (57)
- `reconstructSymmetric` (1)

**Calls:**
- `from` (56)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:550` | Self: 0.0% (1.1ms) | Total: 0.0% (1.1ms) | Samples: 2

**Called by:**
- `(anonymous)` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:699` | Self: 0.0% (989us) | Total: 1.5% (158.2ms) | Samples: 1

**Called by:**
- `runTrial` (195)

**Calls:**
- `alignProjectionBasis` (103)
- `alignProjectionBasis` (88)
- `alignProjectionBasis` (3)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` | Self: 0.0% (924us) | Total: 0.0% (924us) | Samples: 1

**Called by:**
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:649` | Self: 0.0% (908us) | Total: 0.7% (74.5ms) | Samples: 1

**Called by:**
- `map` (96)

**Calls:**
- `map` (95)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` | Self: 0.0% (902us) | Total: 0.3% (39.7ms) | Samples: 1

**Called by:**
- `step` (51)

**Calls:**
- `sort` (40)
- `from` (10)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` | Self: 0.0% (899us) | Total: 0.0% (899us) | Samples: 1

**Called by:**
- `forEach` (1)

### `(unknown)`
`[native code]` | Self: 0.0% (896us) | Total: 0.0% (896us) | Samples: 1

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` | Self: 0.0% (894us) | Total: 0.0% (7.2ms) | Samples: 1

**Calls:**
- `(anonymous)` (8)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` | Self: 0.0% (887us) | Total: 0.0% (887us) | Samples: 1

**Called by:**
- `step` (1)

### `node:fs`
`node:fs:291` | Self: 0.0% (873us) | Total: 0.0% (873us) | Samples: 1

**Called by:**
- `anonymous` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:335` | Self: 0.0% (865us) | Total: 0.0% (865us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:694` | Self: 0.0% (859us) | Total: 0.0% (3.2ms) | Samples: 1

**Called by:**
- `runTrial` (4)

**Calls:**
- `isFinite` (3)

### `WriteStream`
`internal:fs/streams` | Self: 0.0% (851us) | Total: 0.0% (851us) | Samples: 1

**Called by:**
- `(anonymous)` (1)

### `variancePercent`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (847us) | Total: 0.0% (847us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` | Self: 0.0% (838us) | Total: 4.5% (466.5ms) | Samples: 1

**Called by:**
- `runTrial` (595)
- `runTrial` (3)

**Calls:**
- `transformFromEigenCoordinates` (589)
- `transformFromEigenCoordinates` (6)
- `transformFromEigenCoordinates` (1)
- `transformFromEigenCoordinates` (1)

### `mahalanobisSquaredWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:289` | Self: 0.0% (836us) | Total: 0.0% (836us) | Samples: 1

**Called by:**
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:152` | Self: 0.0% (836us) | Total: 0.0% (836us) | Samples: 1

**Called by:**
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` | Self: 0.0% (830us) | Total: 0.0% (830us) | Samples: 1

**Called by:**
- `step` (1)

### `sqrt`
`[native code]` | Self: 0.0% (811us) | Total: 0.0% (811us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:581` | Self: 0.0% (808us) | Total: 0.0% (1.4ms) | Samples: 1

**Called by:**
- `runTrial` (2)

**Calls:**
- `push` (1)

### `adaptationPoint`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:544` | Self: 0.0% (806us) | Total: 0.0% (806us) | Samples: 1

**Called by:**
- `step` (1)

### `slice`
`[native code]` | Self: 0.0% (805us) | Total: 0.0% (805us) | Samples: 1

**Called by:**
- `CMAESOptimizerND` (1)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:21` | Self: 0.0% (785us) | Total: 0.0% (785us) | Samples: 1

**Called by:**
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:193` | Self: 0.0% (785us) | Total: 0.0% (785us) | Samples: 1

**Called by:**
- `step` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:252` | Self: 0.0% (782us) | Total: 0.0% (782us) | Samples: 1

**Called by:**
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` | Self: 0.0% (779us) | Total: 0.0% (779us) | Samples: 1

**Called by:**
- `sort` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:504` | Self: 0.0% (771us) | Total: 0.0% (771us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `mahalanobisSquaredWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:290` | Self: 0.0% (762us) | Total: 0.0% (762us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` | Self: 0.0% (759us) | Total: 0.0% (759us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` | Self: 0.0% (757us) | Total: 0.6% (67.8ms) | Samples: 1

**Called by:**
- `step` (88)

**Calls:**
- `cloneMatrix` (84)
- `map` (3)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:447` | Self: 0.0% (748us) | Total: 0.0% (2.0ms) | Samples: 1

**Called by:**
- `runTrial` (3)

**Calls:**
- `(anonymous)` (2)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:451` | Self: 0.0% (738us) | Total: 0.0% (738us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `mahalanobisSquaredWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:297` | Self: 0.0% (738us) | Total: 0.0% (738us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:588` | Self: 0.0% (737us) | Total: 0.9% (94.5ms) | Samples: 1

**Called by:**
- `runTrial` (118)

**Calls:**
- `map` (117)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` | Self: 0.0% (733us) | Total: 0.4% (47.3ms) | Samples: 1

**Called by:**
- `step` (54)

**Calls:**
- `Float64Array` (53)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:579` | Self: 0.0% (732us) | Total: 0.0% (732us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:720` | Self: 0.0% (719us) | Total: 0.0% (9.6ms) | Samples: 1

**Called by:**
- `runTrial` (13)

**Calls:**
- `projectTo3D` (12)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:615` | Self: 0.0% (707us) | Total: 0.0% (4.6ms) | Samples: 1

**Called by:**
- `runTrial` (6)

**Calls:**
- `createZeroVector` (4)
- `createZeroVector` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:648` | Self: 0.0% (686us) | Total: 0.7% (80.0ms) | Samples: 1

**Called by:**
- `runTrial` (102)
- `runTrial` (1)

**Calls:**
- `map` (102)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` | Self: 0.0% (680us) | Total: 0.0% (4.5ms) | Samples: 1

**Called by:**
- `runTrial` (6)

**Calls:**
- `forEach` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:685` | Self: 0.0% (676us) | Total: 0.0% (676us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `log`
`[native code]` | Self: 0.0% (672us) | Total: 0.0% (672us) | Samples: 1

**Called by:**
- `CMAESOptimizerND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:628` | Self: 0.0% (663us) | Total: 0.0% (663us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:640` | Self: 0.0% (651us) | Total: 0.0% (651us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `filter`
`[native code]` | Self: 0.0% (635us) | Total: 0.0% (635us) | Samples: 1

**Called by:**
- `CMAESOptimizerND` (1)

### `(anonymous)`
`internal:primordials:34` | Self: 0.0% (626us) | Total: 0.0% (626us) | Samples: 1

**Called by:**
- `forEach` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` | Self: 0.0% (570us) | Total: 0.0% (570us) | Samples: 1

**Called by:**
- `step` (1)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.7ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (853us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:729` | Self: 0.0% (0us) | Total: 0.5% (60.0ms) | Samples: 0

**Called by:**
- `runTrial` (77)

**Calls:**
- `cloneMatrix` (64)
- `map` (11)
- `cloneMatrix` (2)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (1.7ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (0us) | Total: 0.6% (65.1ms) | Samples: 0

**Called by:**
- `jacobiEigenSymmetric` (78)

**Calls:**
- `some` (78)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (1.3ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.7ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:334` | Self: 0.0% (0us) | Total: 0.0% (3.6ms) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `fill` (1)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (1.7ms) | Samples: 0

**Called by:**
- `(anonymous)` (2)

**Calls:**
- `anonymous` (2)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (1.3ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` | Self: 0.0% (0us) | Total: 6.3% (653.0ms) | Samples: 0

**Calls:**
- `runTrial` (813)
- `runTrial` (5)
- `runTrial` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` | Self: 0.0% (0us) | Total: 0.1% (17.5ms) | Samples: 0

**Called by:**
- `step` (17)

**Calls:**
- `map` (17)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (853us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` | Self: 0.0% (0us) | Total: 0.1% (15.2ms) | Samples: 0

**Called by:**
- `runTrial` (14)

**Calls:**
- `map` (14)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (2.9ms) | Samples: 0

**Called by:**
- `anonymous` (4)

**Calls:**
- `anonymous` (4)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:332` | Self: 0.0% (0us) | Total: 0.0% (890us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `fill` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` | Self: 0.0% (0us) | Total: 0.6% (65.1ms) | Samples: 0

**Called by:**
- `step` (78)

**Calls:**
- `validateSquareFiniteMatrix` (78)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (6.3ms) | Samples: 0

**Called by:**
- `(module)` (8)

**Calls:**
- `anonymous` (5)
- `get WriteStream` (2)
- `WriteStream` (1)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (1.3ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `internal:streams/readable`
`internal:streams/readable:2` | Self: 0.0% (0us) | Total: 0.0% (853us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:701` | Self: 0.0% (0us) | Total: 1.8% (191.6ms) | Samples: 0

**Called by:**
- `runTrial` (239)
- `runTrial` (1)

**Calls:**
- `forEach` (240)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (2.0ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 0.0% (0us) | Total: 1.0% (112.7ms) | Samples: 0

**Called by:**
- `alignProjectionBasis` (84)
- `step` (64)

**Calls:**
- `map` (148)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:457` | Self: 0.0% (0us) | Total: 0.0% (672us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `log` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:689` | Self: 0.0% (0us) | Total: 46.5% (4.77s) | Samples: 0

**Called by:**
- `runTrial` (6084)
- `runTrial` (16)

**Calls:**
- `jacobiEigenSymmetric` (5591)
- `jacobiEigenSymmetric` (141)
- `jacobiEigenSymmetric` (124)
- `jacobiEigenSymmetric` (78)
- `jacobiEigenSymmetric` (54)
- `jacobiEigenSymmetric` (51)
- `jacobiEigenSymmetric` (28)
- `jacobiEigenSymmetric` (17)
- `jacobiEigenSymmetric` (8)
- `jacobiEigenSymmetric` (3)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:487` | Self: 0.0% (0us) | Total: 0.0% (840us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `from` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:452` | Self: 0.0% (0us) | Total: 0.0% (696us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `requireFiniteVector` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:721` | Self: 0.0% (0us) | Total: 0.1% (13.2ms) | Samples: 0

**Called by:**
- `runTrial` (18)

**Calls:**
- `projectTo3D` (13)
- `projectTo3D` (4)
- `projectTo3D` (1)

### `internal:primordials`
`internal:primordials:73` | Self: 0.0% (0us) | Total: 0.0% (626us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `makeSafe` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` | Self: 0.0% (0us) | Total: 0.0% (6.6ms) | Samples: 0

**Called by:**
- `step` (8)

**Calls:**
- `map` (8)

### `makeSafe`
`internal:primordials:31` | Self: 0.0% (0us) | Total: 0.0% (626us) | Samples: 0

**Called by:**
- `internal:primordials` (1)

**Calls:**
- `bound call` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:519` | Self: 0.0% (0us) | Total: 0.0% (3.1ms) | Samples: 0

**Called by:**
- `runTrial` (2)

**Calls:**
- `map` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `runTrial` (2)

**Calls:**
- `exp` (2)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` | Self: 0.0% (0us) | Total: 0.3% (38.3ms) | Samples: 0

**Called by:**
- `(module)` (46)
- `(module)` (5)

**Calls:**
- `step` (16)
- `step` (12)
- `step` (4)
- `step` (3)
- `step` (3)
- `step` (2)
- `step` (2)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` | Self: 0.0% (0us) | Total: 0.1% (10.4ms) | Samples: 0

**Called by:**
- `(module)` (10)
- `(module)` (2)

**Calls:**
- `CMAESOptimizerND` (3)
- `CMAESOptimizerND` (2)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` | Self: 0.0% (0us) | Total: 93.5% (9.60s) | Samples: 0

**Calls:**
- `runTrial` (12254)
- `runTrial` (46)
- `runTrial` (10)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:492` | Self: 0.0% (0us) | Total: 0.0% (805us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `slice` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:491` | Self: 0.0% (0us) | Total: 0.0% (635us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `filter` (1)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (1.7ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `bound call`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (626us) | Samples: 0

**Called by:**
- `makeSafe` (1)

**Calls:**
- `forEach` (1)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 91.0% | 9.34s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 8.5% | 879.3ms | `[native code]` |
| 0.3% | 38.4ms | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.0% | 873us | `node:fs` |
| 0.0% | 851us | `internal:fs/streams` |
| 0.0% | 626us | `internal:primordials` |
