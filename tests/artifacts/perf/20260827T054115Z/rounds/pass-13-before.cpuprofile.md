# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 12.87s | 15836 | 500us | 179 |

**Top 10:** `jacobiEigenSymmetric` 38.8%, `step` 18.5%, `transformFromEigenCoordinates` 4.1%, `reconstructSymmetric` 3.6%, `step` 3.2%, `whitenWithEigensystem` 2.6%, `whitenWithEigensystem` 2.4%, `map` 2.3%, `step` 1.9%, `fill` 1.5%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 38.8% | 4.99s | 40.3% | 5.19s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 18.5% | 2.38s | 18.5% | 2.38s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:649` |
| 4.1% | 539.3ms | 4.3% | 562.6ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 3.6% | 475.6ms | 4.3% | 561.2ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` |
| 3.2% | 417.2ms | 3.7% | 484.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:642` |
| 2.6% | 339.9ms | 2.7% | 348.2ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 2.4% | 308.9ms | 2.5% | 328.9ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` |
| 2.3% | 308.2ms | 5.2% | 678.7ms | `map` | `[native code]` |
| 1.9% | 253.8ms | 1.9% | 253.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:687` |
| 1.5% | 203.9ms | 1.5% | 203.9ms | `fill` | `[native code]` |
| 1.5% | 197.6ms | 1.5% | 197.6ms | `hypot` | `[native code]` |
| 1.4% | 188.8ms | 1.4% | 188.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` |
| 1.4% | 186.7ms | 2.2% | 283.4ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.3% | 170.1ms | 1.3% | 170.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` |
| 1.1% | 154.3ms | 1.1% | 154.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 1.0% | 136.9ms | 1.0% | 136.9ms | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:372` |
| 0.8% | 103.3ms | 0.8% | 103.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.7% | 100.3ms | 0.7% | 100.3ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:545` |
| 0.7% | 95.1ms | 1.0% | 133.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.6% | 80.9ms | 1.8% | 240.7ms | `some` | `[native code]` |
| 0.6% | 78.1ms | 1.7% | 230.7ms | `from` | `[native code]` |
| 0.5% | 73.5ms | 0.6% | 82.0ms | `sort` | `[native code]` |
| 0.5% | 71.5ms | 0.5% | 71.5ms | `Float64Array` | `[native code]` |
| 0.5% | 67.9ms | 0.5% | 67.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.5% | 65.1ms | 1.8% | 235.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` |
| 0.4% | 64.0ms | 1.0% | 134.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.3% | 51.3ms | 0.3% | 51.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` |
| 0.3% | 48.9ms | 0.3% | 48.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.3% | 46.0ms | 0.7% | 96.6ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.2% | 35.7ms | 0.2% | 35.7ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.2% | 30.9ms | 0.2% | 30.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` |
| 0.2% | 29.8ms | 0.2% | 29.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 0.2% | 27.7ms | 0.2% | 27.7ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.1% | 25.2ms | 0.1% | 25.2ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:303` |
| 0.1% | 24.8ms | 0.1% | 24.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:618` |
| 0.1% | 22.3ms | 0.1% | 22.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.1% | 18.0ms | 0.1% | 18.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:650` |
| 0.1% | 16.6ms | 0.1% | 16.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:716` |
| 0.1% | 16.5ms | 0.1% | 16.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:635` |
| 0.1% | 14.6ms | 0.1% | 14.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:600` |
| 0.1% | 14.0ms | 0.1% | 14.0ms | `push` | `[native code]` |
| 0.1% | 13.6ms | 0.9% | 118.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 0.1% | 13.5ms | 0.1% | 15.6ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:533` |
| 0.0% | 12.2ms | 0.1% | 13.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:634` |
| 0.0% | 11.3ms | 0.0% | 11.3ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 10.7ms | 0.1% | 24.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.0% | 10.5ms | 0.1% | 14.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` |
| 0.0% | 9.8ms | 0.8% | 106.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:564` |
| 0.0% | 9.6ms | 0.0% | 9.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` |
| 0.0% | 9.5ms | 0.5% | 71.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.0% | 9.3ms | 0.0% | 9.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:706` |
| 0.0% | 9.0ms | 0.0% | 10.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:691` |
| 0.0% | 8.1ms | 0.0% | 8.1ms | `isFinite` | `[native code]` |
| 0.0% | 7.9ms | 0.0% | 7.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` |
| 0.0% | 7.7ms | 0.0% | 7.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:646` |
| 0.0% | 7.6ms | 2.5% | 330.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` |
| 0.0% | 7.5ms | 0.0% | 7.5ms | `abs` | `[native code]` |
| 0.0% | 7.4ms | 0.0% | 7.4ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 7.2ms | 0.0% | 8.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:614` |
| 0.0% | 6.7ms | 2.0% | 257.3ms | `forEach` | `[native code]` |
| 0.0% | 6.7ms | 0.0% | 6.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:626` |
| 0.0% | 6.4ms | 0.0% | 6.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 6.3ms | 0.2% | 38.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.0% | 6.3ms | 1.1% | 143.2ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:523` |
| 0.0% | 6.0ms | 0.0% | 6.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` |
| 0.0% | 5.8ms | 0.0% | 5.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` |
| 0.0% | 5.8ms | 0.0% | 5.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:707` |
| 0.0% | 5.6ms | 0.7% | 91.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:624` |
| 0.0% | 5.4ms | 0.0% | 5.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` |
| 0.0% | 5.1ms | 0.0% | 5.1ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:525` |
| 0.0% | 5.0ms | 0.0% | 7.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:682` |
| 0.0% | 5.0ms | 0.0% | 5.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:710` |
| 0.0% | 4.9ms | 0.0% | 4.9ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 4.7ms | 44.6% | 5.74s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` |
| 0.0% | 4.7ms | 0.0% | 6.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` |
| 0.0% | 4.6ms | 0.0% | 4.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` |
| 0.0% | 4.5ms | 0.1% | 24.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` |
| 0.0% | 4.5ms | 0.0% | 4.5ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 4.4ms | 0.0% | 4.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 4.0ms | 0.2% | 37.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 0.0% | 3.5ms | 0.8% | 106.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.0% | 3.4ms | 0.0% | 3.4ms | `max` | `[native code]` |
| 0.0% | 3.4ms | 0.0% | 3.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.2ms | 4.3% | 565.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 0.0% | 3.0ms | 0.1% | 24.1ms | `anonymous` | `[native code]` |
| 0.0% | 3.0ms | 4.5% | 579.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` |
| 0.0% | 2.9ms | 0.0% | 5.4ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:524` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:671` |
| 0.0% | 2.7ms | 0.0% | 2.7ms | `integerArgument` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:17` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:655` |
| 0.0% | 2.2ms | 0.0% | 7.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:590` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `reduce` | `[native code]` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` |
| 0.0% | 2.0ms | 4.5% | 586.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:629` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.9ms | 0.0% | 7.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:581` |
| 0.0% | 1.8ms | 0.1% | 19.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:696` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` |
| 0.0% | 1.6ms | 0.0% | 2.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:669` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:264` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:274` |
| 0.0% | 1.6ms | 0.8% | 112.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:193` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:555` |
| 0.0% | 1.3ms | 0.4% | 54.4ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.0% | 1.3ms | 0.9% | 118.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:301` |
| 0.0% | 1.1ms | 1.9% | 252.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:677` |
| 0.0% | 1.0ms | 0.1% | 15.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:678` |
| 0.0% | 1.0ms | 0.0% | 8.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` |
| 0.0% | 1.0ms | 1.5% | 199.1ms | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.0% | 1.0ms | 0.7% | 97.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` |
| 0.0% | 998us | 0.0% | 10.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` |
| 0.0% | 993us | 0.0% | 993us | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 877us | 0.0% | 877us | `exp` | `[native code]` |
| 0.0% | 874us | 0.0% | 874us | `internal:streams/readable` | `internal:streams/readable:703` |
| 0.0% | 871us | 0.0% | 871us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` |
| 0.0% | 859us | 0.1% | 19.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` |
| 0.0% | 837us | 0.0% | 837us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:252` |
| 0.0% | 826us | 0.0% | 826us | `internal:primordials` | `internal:primordials:70` |
| 0.0% | 819us | 0.0% | 819us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` |
| 0.0% | 806us | 0.0% | 6.9ms | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.0% | 793us | 0.0% | 793us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:135` |
| 0.0% | 789us | 0.4% | 64.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:705` |
| 0.0% | 786us | 0.0% | 786us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:554` |
| 0.0% | 773us | 0.0% | 1.6ms | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:453` |
| 0.0% | 739us | 0.0% | 739us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:483` |
| 0.0% | 727us | 0.0% | 727us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:253` |
| 0.0% | 724us | 0.0% | 724us | `@lazy` | `[native code]` |
| 0.0% | 723us | 0.0% | 723us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:661` |
| 0.0% | 721us | 1.8% | 242.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:675` |
| 0.0% | 712us | 0.0% | 712us | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:42` |
| 0.0% | 703us | 0.0% | 703us | `now` | `[native code]` |
| 0.0% | 683us | 0.0% | 683us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` |
| 0.0% | 682us | 0.0% | 682us | `getStreamOptions` | `internal:fs/streams` |
| 0.0% | 659us | 0.0% | 659us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.0% | 657us | 0.0% | 657us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:469` |
| 0.0% | 637us | 0.0% | 1.4ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:310` |
| 0.0% | 628us | 0.0% | 628us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:426` |
| 0.0% | 610us | 0.0% | 5.6ms | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` |
| 0.0% | 603us | 0.0% | 603us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 602us | 0.0% | 602us | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 99.5% | 12.81s | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 95.0% | 12.23s | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` |
| 44.6% | 5.74s | 0.0% | 4.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` |
| 40.3% | 5.19s | 38.8% | 4.99s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 18.5% | 2.38s | 18.5% | 2.38s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:649` |
| 5.2% | 678.7ms | 2.3% | 308.2ms | `map` | `[native code]` |
| 4.8% | 626.8ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` |
| 4.5% | 586.7ms | 0.0% | 2.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:629` |
| 4.5% | 579.4ms | 0.0% | 3.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` |
| 4.3% | 565.1ms | 0.0% | 3.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 4.3% | 562.6ms | 4.1% | 539.3ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 4.3% | 561.2ms | 3.6% | 475.6ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` |
| 3.7% | 484.5ms | 3.2% | 417.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:642` |
| 2.7% | 348.2ms | 2.6% | 339.9ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 2.5% | 330.1ms | 0.0% | 7.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` |
| 2.5% | 328.9ms | 2.4% | 308.9ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` |
| 2.2% | 283.4ms | 1.4% | 186.7ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 2.0% | 257.3ms | 0.0% | 6.7ms | `forEach` | `[native code]` |
| 1.9% | 253.8ms | 1.9% | 253.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:687` |
| 1.9% | 252.4ms | 0.0% | 1.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:677` |
| 1.8% | 242.7ms | 0.0% | 721us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:675` |
| 1.8% | 240.7ms | 0.6% | 80.9ms | `some` | `[native code]` |
| 1.8% | 235.4ms | 0.5% | 65.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` |
| 1.7% | 230.7ms | 0.6% | 78.1ms | `from` | `[native code]` |
| 1.5% | 203.9ms | 1.5% | 203.9ms | `fill` | `[native code]` |
| 1.5% | 199.1ms | 0.0% | 1.0ms | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 1.5% | 197.6ms | 1.5% | 197.6ms | `hypot` | `[native code]` |
| 1.4% | 188.8ms | 1.4% | 188.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` |
| 1.3% | 170.1ms | 1.3% | 170.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` |
| 1.1% | 154.3ms | 1.1% | 154.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 1.1% | 143.2ms | 0.0% | 6.3ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:523` |
| 1.0% | 136.9ms | 1.0% | 136.9ms | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:372` |
| 1.0% | 134.7ms | 0.4% | 64.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 1.0% | 133.0ms | 0.7% | 95.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.9% | 119.7ms | 0.0% | 0us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.9% | 119.7ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 0.9% | 118.3ms | 0.0% | 1.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.9% | 118.3ms | 0.1% | 13.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 0.8% | 112.0ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.8% | 106.9ms | 0.0% | 3.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.8% | 106.4ms | 0.0% | 9.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:564` |
| 0.8% | 103.3ms | 0.8% | 103.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.7% | 100.3ms | 0.7% | 100.3ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:545` |
| 0.7% | 97.4ms | 0.0% | 1.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` |
| 0.7% | 96.6ms | 0.3% | 46.0ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.7% | 91.2ms | 0.0% | 5.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:624` |
| 0.6% | 82.7ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:537` |
| 0.6% | 82.0ms | 0.5% | 73.5ms | `sort` | `[native code]` |
| 0.5% | 71.5ms | 0.5% | 71.5ms | `Float64Array` | `[native code]` |
| 0.5% | 71.2ms | 0.0% | 9.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.5% | 67.9ms | 0.5% | 67.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.4% | 64.2ms | 0.0% | 789us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:705` |
| 0.4% | 55.9ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` |
| 0.4% | 54.4ms | 0.0% | 1.3ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.3% | 51.3ms | 0.3% | 51.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` |
| 0.3% | 48.9ms | 0.3% | 48.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.3% | 41.4ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` |
| 0.2% | 38.5ms | 0.0% | 6.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.2% | 37.7ms | 0.0% | 4.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 0.2% | 35.7ms | 0.2% | 35.7ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.2% | 30.9ms | 0.2% | 30.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` |
| 0.2% | 29.8ms | 0.2% | 29.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 0.2% | 27.7ms | 0.2% | 27.7ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.1% | 25.2ms | 0.1% | 25.2ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:303` |
| 0.1% | 24.9ms | 0.0% | 4.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` |
| 0.1% | 24.8ms | 0.1% | 24.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:618` |
| 0.1% | 24.1ms | 0.0% | 3.0ms | `anonymous` | `[native code]` |
| 0.1% | 24.1ms | 0.0% | 10.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.1% | 22.3ms | 0.1% | 22.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.1% | 19.8ms | 0.0% | 859us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` |
| 0.1% | 19.1ms | 0.0% | 1.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:696` |
| 0.1% | 18.0ms | 0.1% | 18.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:650` |
| 0.1% | 16.6ms | 0.1% | 16.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:716` |
| 0.1% | 16.5ms | 0.1% | 16.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:635` |
| 0.1% | 15.6ms | 0.1% | 13.5ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:533` |
| 0.1% | 15.0ms | 0.0% | 1.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:678` |
| 0.1% | 14.6ms | 0.1% | 14.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:600` |
| 0.1% | 14.0ms | 0.0% | 10.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` |
| 0.1% | 14.0ms | 0.1% | 14.0ms | `push` | `[native code]` |
| 0.1% | 13.1ms | 0.0% | 12.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:634` |
| 0.0% | 11.3ms | 0.0% | 11.3ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 10.6ms | 0.0% | 998us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` |
| 0.0% | 10.5ms | 0.0% | 9.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:691` |
| 0.0% | 9.6ms | 0.0% | 9.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` |
| 0.0% | 9.3ms | 0.0% | 9.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:706` |
| 0.0% | 9.2ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 8.4ms | 0.0% | 1.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` |
| 0.0% | 8.1ms | 0.0% | 8.1ms | `isFinite` | `[native code]` |
| 0.0% | 8.1ms | 0.0% | 7.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:614` |
| 0.0% | 8.0ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` |
| 0.0% | 7.9ms | 0.0% | 1.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:581` |
| 0.0% | 7.9ms | 0.0% | 7.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` |
| 0.0% | 7.7ms | 0.0% | 7.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:646` |
| 0.0% | 7.5ms | 0.0% | 7.5ms | `abs` | `[native code]` |
| 0.0% | 7.4ms | 0.0% | 7.4ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 7.3ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:590` |
| 0.0% | 7.2ms | 0.0% | 5.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:682` |
| 0.0% | 6.9ms | 0.0% | 806us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.0% | 6.7ms | 0.0% | 4.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` |
| 0.0% | 6.7ms | 0.0% | 6.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:626` |
| 0.0% | 6.7ms | 0.0% | 6.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` |
| 0.0% | 6.4ms | 0.0% | 6.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 6.1ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.0% | 5.8ms | 0.0% | 5.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` |
| 0.0% | 5.8ms | 0.0% | 5.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:707` |
| 0.0% | 5.6ms | 0.0% | 610us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` |
| 0.0% | 5.4ms | 0.0% | 2.9ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:524` |
| 0.0% | 5.4ms | 0.0% | 5.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` |
| 0.0% | 5.1ms | 0.0% | 5.1ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:525` |
| 0.0% | 5.0ms | 0.0% | 5.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:710` |
| 0.0% | 4.9ms | 0.0% | 4.9ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 4.6ms | 0.0% | 4.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` |
| 0.0% | 4.5ms | 0.0% | 4.5ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 4.4ms | 0.0% | 4.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.7ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 3.4ms | 0.0% | 3.4ms | `max` | `[native code]` |
| 0.0% | 3.4ms | 0.0% | 3.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:671` |
| 0.0% | 2.8ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 2.7ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:24` |
| 0.0% | 2.7ms | 0.0% | 2.7ms | `integerArgument` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:17` |
| 0.0% | 2.5ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:669` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:655` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `reduce` | `[native code]` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` |
| 0.0% | 1.7ms | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 1.7ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 1.7ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 1.7ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 1.7ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:264` |
| 0.0% | 1.6ms | 0.0% | 0us | `createIdentityMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:31` |
| 0.0% | 1.6ms | 0.0% | 773us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:453` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:274` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:193` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 0.0% | 1.4ms | 0.0% | 637us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:310` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:555` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:301` |
| 0.0% | 993us | 0.0% | 993us | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 877us | 0.0% | 877us | `exp` | `[native code]` |
| 0.0% | 874us | 0.0% | 874us | `internal:streams/readable` | `internal:streams/readable:703` |
| 0.0% | 874us | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 874us | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 871us | 0.0% | 871us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` |
| 0.0% | 837us | 0.0% | 837us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:252` |
| 0.0% | 826us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 826us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 826us | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 826us | 0.0% | 826us | `internal:primordials` | `internal:primordials:70` |
| 0.0% | 819us | 0.0% | 819us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` |
| 0.0% | 793us | 0.0% | 793us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:135` |
| 0.0% | 790us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:456` |
| 0.0% | 786us | 0.0% | 786us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:554` |
| 0.0% | 782us | 0.0% | 0us | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:290` |
| 0.0% | 739us | 0.0% | 739us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:483` |
| 0.0% | 727us | 0.0% | 727us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:253` |
| 0.0% | 724us | 0.0% | 0us | `internal:fs/glob` | `internal:fs/glob:2` |
| 0.0% | 724us | 0.0% | 724us | `@lazy` | `[native code]` |
| 0.0% | 724us | 0.0% | 0us | `node:path` | `node:path:2` |
| 0.0% | 723us | 0.0% | 723us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:661` |
| 0.0% | 712us | 0.0% | 712us | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:42` |
| 0.0% | 703us | 0.0% | 703us | `now` | `[native code]` |
| 0.0% | 703us | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:88` |
| 0.0% | 683us | 0.0% | 683us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` |
| 0.0% | 682us | 0.0% | 0us | `WriteStream` | `internal:fs/streams:201` |
| 0.0% | 682us | 0.0% | 682us | `getStreamOptions` | `internal:fs/streams` |
| 0.0% | 659us | 0.0% | 659us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.0% | 657us | 0.0% | 657us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:469` |
| 0.0% | 649us | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:309` |
| 0.0% | 628us | 0.0% | 628us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:426` |
| 0.0% | 603us | 0.0% | 603us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 602us | 0.0% | 602us | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 569us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:462` |

## Function Details

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` | Self: 38.8% (4.99s) | Total: 40.3% (5.19s) | Samples: 6190

**Called by:**
- `step` (6428)

**Calls:**
- `hypot` (238)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:649` | Self: 18.5% (2.38s) | Total: 18.5% (2.38s) | Samples: 2959

**Called by:**
- `runTrial` (2945)
- `runTrial` (14)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` | Self: 4.1% (539.3ms) | Total: 4.3% (562.6ms) | Samples: 672

**Called by:**
- `step` (700)

**Calls:**
- `createZeroVector` (16)
- `fill` (12)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` | Self: 3.6% (475.6ms) | Total: 4.3% (561.2ms) | Samples: 582

**Called by:**
- `step` (683)

**Calls:**
- `from` (100)
- `createZeroMatrix` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:642` | Self: 3.2% (417.2ms) | Total: 3.7% (484.5ms) | Samples: 520

**Called by:**
- `runTrial` (597)
- `runTrial` (3)

**Calls:**
- `createZeroMatrix` (60)
- `from` (15)
- `createZeroMatrix` (5)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` | Self: 2.6% (339.9ms) | Total: 2.7% (348.2ms) | Samples: 402

**Called by:**
- `step` (351)
- `step` (62)

**Calls:**
- `createZeroVector` (8)
- `fill` (3)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` | Self: 2.4% (308.9ms) | Total: 2.5% (328.9ms) | Samples: 378

**Called by:**
- `step` (341)
- `step` (59)

**Calls:**
- `createZeroVector` (13)
- `fill` (9)

### `map`
`[native code]` | Self: 2.3% (308.2ms) | Total: 5.2% (678.7ms) | Samples: 382

**Called by:**
- `cloneMatrix` (233)
- `step` (139)
- `step` (135)
- `step` (120)
- `(anonymous)` (107)
- `step` (25)
- `step` (21)
- `(anonymous)` (18)
- `jacobiEigenSymmetric` (14)
- `jacobiEigenSymmetric` (13)
- `jacobiEigenSymmetric` (9)
- `step` (4)

**Calls:**
- `(anonymous)` (186)
- `(anonymous)` (114)
- `(anonymous)` (77)
- `(anonymous)` (36)
- `(anonymous)` (30)
- `abs` (9)
- `(anonymous)` (3)
- `fill` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:687` | Self: 1.9% (253.8ms) | Total: 1.9% (253.8ms) | Samples: 318

**Called by:**
- `runTrial` (316)
- `runTrial` (2)

### `fill`
`[native code]` | Self: 1.5% (203.9ms) | Total: 1.5% (203.9ms) | Samples: 253

**Called by:**
- `sampleGaussianVectorND` (119)
- `ellipsoidObjective` (63)
- `from` (42)
- `transformFromEigenCoordinates` (12)
- `whitenWithEigensystem` (9)
- `whitenWithEigensystem` (3)
- `step` (3)
- `sampleGaussianVectorND` (1)
- `map` (1)

### `hypot`
`[native code]` | Self: 1.5% (197.6ms) | Total: 1.5% (197.6ms) | Samples: 238

**Called by:**
- `jacobiEigenSymmetric` (238)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` | Self: 1.4% (188.8ms) | Total: 1.4% (188.8ms) | Samples: 233

**Called by:**
- `runTrial` (231)
- `runTrial` (2)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.4% (186.7ms) | Total: 2.2% (283.4ms) | Samples: 230

**Called by:**
- `step` (349)

**Calls:**
- `fill` (119)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` | Self: 1.3% (170.1ms) | Total: 1.3% (170.1ms) | Samples: 212

**Called by:**
- `runTrial` (211)
- `runTrial` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 1.1% (154.3ms) | Total: 1.1% (154.3ms) | Samples: 186

**Called by:**
- `map` (186)

### `requireFiniteVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:372` | Self: 1.0% (136.9ms) | Total: 1.0% (136.9ms) | Samples: 171

**Called by:**
- `projectTo3D` (171)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.8% (103.3ms) | Total: 0.8% (103.3ms) | Samples: 128

**Called by:**
- `map` (77)
- `some` (50)
- `from` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:545` | Self: 0.7% (100.3ms) | Total: 0.7% (100.3ms) | Samples: 118

**Called by:**
- `step` (118)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` | Self: 0.7% (95.1ms) | Total: 1.0% (133.0ms) | Samples: 122

**Called by:**
- `step` (166)

**Calls:**
- `Float64Array` (44)

### `some`
`[native code]` | Self: 0.6% (80.9ms) | Total: 1.8% (240.7ms) | Samples: 98

**Called by:**
- `validateSquareFiniteMatrix` (147)
- `(anonymous)` (143)
- `projectTo3D` (3)
- `some` (2)

**Calls:**
- `(anonymous)` (145)
- `(anonymous)` (50)
- `some` (2)

### `from`
`[native code]` | Self: 0.6% (78.1ms) | Total: 1.7% (230.7ms) | Samples: 93

**Called by:**
- `reconstructSymmetric` (100)
- `jacobiEigenSymmetric` (85)
- `createZeroMatrix` (62)
- `step` (15)
- `jacobiEigenSymmetric` (14)
- `CMAESOptimizerND` (1)

**Calls:**
- `(anonymous)` (79)
- `(anonymous)` (61)
- `fill` (42)
- `(anonymous)` (1)
- `(anonymous)` (1)

### `sort`
`[native code]` | Self: 0.5% (73.5ms) | Total: 0.6% (82.0ms) | Samples: 86

**Called by:**
- `jacobiEigenSymmetric` (61)
- `step` (37)

**Calls:**
- `(anonymous)` (9)
- `(anonymous)` (3)

### `Float64Array`
`[native code]` | Self: 0.5% (71.5ms) | Total: 0.5% (71.5ms) | Samples: 83

**Called by:**
- `jacobiEigenSymmetric` (44)
- `jacobiEigenSymmetric` (39)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.5% (67.9ms) | Total: 0.5% (67.9ms) | Samples: 79

**Called by:**
- `from` (79)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` | Self: 0.5% (65.1ms) | Total: 1.8% (235.4ms) | Samples: 76

**Called by:**
- `forEach` (289)

**Calls:**
- `projectTo3D` (180)
- `projectTo3D` (17)
- `projectTo3D` (7)
- `projectTo3D` (6)
- `projectTo3D` (3)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.4% (64.0ms) | Total: 1.0% (134.7ms) | Samples: 79

**Called by:**
- `step` (164)

**Calls:**
- `from` (85)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` | Self: 0.3% (51.3ms) | Total: 0.3% (51.3ms) | Samples: 63

**Called by:**
- `runTrial` (63)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.3% (48.9ms) | Total: 0.3% (48.9ms) | Samples: 61

**Called by:**
- `from` (61)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` | Self: 0.3% (46.0ms) | Total: 0.7% (96.6ms) | Samples: 52

**Called by:**
- `step` (114)
- `step` (1)

**Calls:**
- `fill` (63)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` | Self: 0.2% (35.7ms) | Total: 0.2% (35.7ms) | Samples: 41

**Called by:**
- `transformFromEigenCoordinates` (16)
- `whitenWithEigensystem` (13)
- `whitenWithEigensystem` (8)
- `step` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` | Self: 0.2% (30.9ms) | Total: 0.2% (30.9ms) | Samples: 34

**Called by:**
- `runTrial` (34)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` | Self: 0.2% (29.8ms) | Total: 0.2% (29.8ms) | Samples: 36

**Called by:**
- `map` (36)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.2% (27.7ms) | Total: 0.2% (27.7ms) | Samples: 34

**Called by:**
- `step` (19)
- `step` (12)
- `(anonymous)` (3)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:303` | Self: 0.1% (25.2ms) | Total: 0.1% (25.2ms) | Samples: 19

**Called by:**
- `step` (19)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:618` | Self: 0.1% (24.8ms) | Total: 0.1% (24.8ms) | Samples: 30

**Called by:**
- `runTrial` (30)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` | Self: 0.1% (22.3ms) | Total: 0.1% (22.3ms) | Samples: 30

**Called by:**
- `map` (30)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:650` | Self: 0.1% (18.0ms) | Total: 0.1% (18.0ms) | Samples: 20

**Called by:**
- `runTrial` (20)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:716` | Self: 0.1% (16.6ms) | Total: 0.1% (16.6ms) | Samples: 17

**Called by:**
- `runTrial` (17)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:635` | Self: 0.1% (16.5ms) | Total: 0.1% (16.5ms) | Samples: 19

**Called by:**
- `runTrial` (19)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:600` | Self: 0.1% (14.6ms) | Total: 0.1% (14.6ms) | Samples: 20

**Called by:**
- `runTrial` (20)

### `push`
`[native code]` | Self: 0.1% (14.0ms) | Total: 0.1% (14.0ms) | Samples: 19

**Called by:**
- `step` (14)
- `step` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` | Self: 0.1% (13.6ms) | Total: 0.9% (118.3ms) | Samples: 14

**Called by:**
- `runTrial` (149)

**Calls:**
- `map` (135)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:533` | Self: 0.1% (13.5ms) | Total: 0.1% (15.6ms) | Samples: 18

**Called by:**
- `(anonymous)` (17)
- `step` (3)
- `step` (1)

**Calls:**
- `coordinate` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:634` | Self: 0.0% (12.2ms) | Total: 0.1% (13.1ms) | Samples: 13

**Called by:**
- `runTrial` (14)

**Calls:**
- `vecDot` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (11.3ms) | Total: 0.0% (11.3ms) | Samples: 16

**Called by:**
- `step` (16)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.0% (10.7ms) | Total: 0.1% (24.1ms) | Samples: 13

**Called by:**
- `step` (30)

**Calls:**
- `map` (14)
- `max` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` | Self: 0.0% (10.5ms) | Total: 0.1% (14.0ms) | Samples: 11

**Called by:**
- `runTrial` (16)

**Calls:**
- `push` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:564` | Self: 0.0% (9.8ms) | Total: 0.8% (106.4ms) | Samples: 13

**Called by:**
- `runTrial` (127)
- `runTrial` (1)

**Calls:**
- `ellipsoidObjective` (114)
- `ellipsoidObjective` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` | Self: 0.0% (9.6ms) | Total: 0.0% (9.6ms) | Samples: 12

**Called by:**
- `runTrial` (12)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` | Self: 0.0% (9.5ms) | Total: 0.5% (71.2ms) | Samples: 10

**Called by:**
- `step` (85)

**Calls:**
- `sort` (61)
- `from` (14)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:706` | Self: 0.0% (9.3ms) | Total: 0.0% (9.3ms) | Samples: 11

**Called by:**
- `runTrial` (11)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:691` | Self: 0.0% (9.0ms) | Total: 0.0% (10.5ms) | Samples: 9

**Called by:**
- `runTrial` (11)

**Calls:**
- `radius` (2)

### `isFinite`
`[native code]` | Self: 0.0% (8.1ms) | Total: 0.0% (8.1ms) | Samples: 8

**Called by:**
- `step` (7)
- `nextHalfOpenUnit` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` | Self: 0.0% (7.9ms) | Total: 0.0% (7.9ms) | Samples: 10

**Called by:**
- `runTrial` (10)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:646` | Self: 0.0% (7.7ms) | Total: 0.0% (7.7ms) | Samples: 10

**Called by:**
- `runTrial` (10)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` | Self: 0.0% (7.6ms) | Total: 2.5% (330.1ms) | Samples: 9

**Called by:**
- `runTrial` (394)
- `runTrial` (2)

**Calls:**
- `sampleGaussianVectorND` (349)
- `sampleGaussianVectorND` (19)
- `push` (14)
- `sampleGaussianVectorND` (2)
- `sampleGaussianVectorND` (2)
- `sampleGaussianVectorND` (1)

### `abs`
`[native code]` | Self: 0.0% (7.5ms) | Total: 0.0% (7.5ms) | Samples: 9

**Called by:**
- `map` (9)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (7.4ms) | Total: 0.0% (7.4ms) | Samples: 8

**Called by:**
- `step` (4)
- `step` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:614` | Self: 0.0% (7.2ms) | Total: 0.0% (8.1ms) | Samples: 7

**Called by:**
- `runTrial` (8)

**Calls:**
- `max` (1)

### `forEach`
`[native code]` | Self: 0.0% (6.7ms) | Total: 2.0% (257.3ms) | Samples: 9

**Called by:**
- `step` (309)
- `step` (8)

**Calls:**
- `(anonymous)` (289)
- `(anonymous)` (19)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:626` | Self: 0.0% (6.7ms) | Total: 0.0% (6.7ms) | Samples: 8

**Called by:**
- `runTrial` (8)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` | Self: 0.0% (6.4ms) | Total: 0.0% (6.4ms) | Samples: 9

**Called by:**
- `sort` (9)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` | Self: 0.0% (6.3ms) | Total: 0.2% (38.5ms) | Samples: 9

**Called by:**
- `runTrial` (47)

**Calls:**
- `sort` (37)
- `ellipsoidObjective` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:523` | Self: 0.0% (6.3ms) | Total: 1.1% (143.2ms) | Samples: 9

**Called by:**
- `(anonymous)` (180)

**Calls:**
- `requireFiniteVector` (171)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` | Self: 0.0% (6.0ms) | Total: 0.0% (6.7ms) | Samples: 7

**Called by:**
- `runTrial` (7)
- `runTrial` (1)

**Calls:**
- `max` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` | Self: 0.0% (5.8ms) | Total: 0.0% (5.8ms) | Samples: 7

**Called by:**
- `runTrial` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:707` | Self: 0.0% (5.8ms) | Total: 0.0% (5.8ms) | Samples: 7

**Called by:**
- `runTrial` (7)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:624` | Self: 0.0% (5.6ms) | Total: 0.7% (91.2ms) | Samples: 7

**Called by:**
- `map` (114)

**Calls:**
- `map` (107)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` | Self: 0.0% (5.4ms) | Total: 0.0% (5.4ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:525` | Self: 0.0% (5.1ms) | Total: 0.0% (5.1ms) | Samples: 6

**Called by:**
- `(anonymous)` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:682` | Self: 0.0% (5.0ms) | Total: 0.0% (7.2ms) | Samples: 6

**Called by:**
- `runTrial` (9)

**Calls:**
- `reduce` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:710` | Self: 0.0% (5.0ms) | Total: 0.0% (5.0ms) | Samples: 7

**Called by:**
- `runTrial` (7)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (4.9ms) | Total: 0.0% (4.9ms) | Samples: 5

**Called by:**
- `step` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` | Self: 0.0% (4.7ms) | Total: 44.6% (5.74s) | Samples: 5

**Called by:**
- `runTrial` (7086)
- `runTrial` (17)

**Calls:**
- `jacobiEigenSymmetric` (6428)
- `jacobiEigenSymmetric` (166)
- `jacobiEigenSymmetric` (164)
- `jacobiEigenSymmetric` (147)
- `jacobiEigenSymmetric` (85)
- `jacobiEigenSymmetric` (44)
- `jacobiEigenSymmetric` (30)
- `jacobiEigenSymmetric` (13)
- `jacobiEigenSymmetric` (9)
- `jacobiEigenSymmetric` (5)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` | Self: 0.0% (4.7ms) | Total: 0.0% (6.7ms) | Samples: 6

**Called by:**
- `runTrial` (8)

**Calls:**
- `variancePercent` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` | Self: 0.0% (4.6ms) | Total: 0.0% (4.6ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` | Self: 0.0% (4.5ms) | Total: 0.1% (24.9ms) | Samples: 6

**Called by:**
- `runTrial` (31)

**Calls:**
- `map` (25)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (4.5ms) | Total: 0.0% (4.5ms) | Samples: 5

**Called by:**
- `step` (5)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (4.4ms) | Total: 0.0% (4.4ms) | Samples: 5

**Called by:**
- `step` (5)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` | Self: 0.0% (4.0ms) | Total: 0.2% (37.7ms) | Samples: 5

**Called by:**
- `step` (44)

**Calls:**
- `Float64Array` (39)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` | Self: 0.0% (3.5ms) | Total: 0.8% (106.9ms) | Samples: 3

**Called by:**
- `runTrial` (130)

**Calls:**
- `whitenWithEigensystem` (62)
- `whitenWithEigensystem` (59)
- `whitenWithEigensystem` (4)
- `whitenWithEigensystem` (2)

### `max`
`[native code]` | Self: 0.0% (3.4ms) | Total: 0.0% (3.4ms) | Samples: 5

**Called by:**
- `jacobiEigenSymmetric` (3)
- `step` (1)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (3.4ms) | Total: 0.0% (3.4ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` | Self: 0.0% (3.2ms) | Total: 4.3% (565.1ms) | Samples: 4

**Called by:**
- `runTrial` (687)
- `runTrial` (1)

**Calls:**
- `reconstructSymmetric` (683)
- `reconstructSymmetric` (1)

### `anonymous`
`[native code]` | Self: 0.0% (3.0ms) | Total: 0.1% (24.1ms) | Samples: 4

**Called by:**
- `(anonymous)` (5)
- `node:fs` (5)
- `node:fs/promises` (4)
- `internal:fs/streams` (2)
- `get WriteStream` (2)
- `internal:stream` (2)
- `internal:streams/compose` (2)
- `node:stream` (2)
- `node:events` (1)
- `internal:validators` (1)
- `internal:fs/glob` (1)
- `internal:streams/pipeline` (1)
- `internal:shared` (1)
- `internal:streams/duplex` (1)

**Calls:**
- `node:fs` (5)
- `node:fs/promises` (4)
- `internal:fs/streams` (2)
- `internal:stream` (2)
- `internal:streams/compose` (2)
- `node:stream` (2)
- `node:events` (1)
- `internal:validators` (1)
- `internal:fs/glob` (1)
- `internal:primordials` (1)
- `internal:streams/readable` (1)
- `internal:shared` (1)
- `node:path` (1)
- `internal:streams/duplex` (1)
- `internal:streams/pipeline` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` | Self: 0.0% (3.0ms) | Total: 4.5% (579.4ms) | Samples: 4

**Called by:**
- `runTrial` (720)
- `runTrial` (3)

**Calls:**
- `transformFromEigenCoordinates` (700)
- `transformFromEigenCoordinates` (16)
- `transformFromEigenCoordinates` (1)
- `transformFromEigenCoordinates` (1)
- `transformFromEigenCoordinates` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:524` | Self: 0.0% (2.9ms) | Total: 0.0% (5.4ms) | Samples: 4

**Called by:**
- `(anonymous)` (7)

**Calls:**
- `some` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:671` | Self: 0.0% (2.8ms) | Total: 0.0% (2.8ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `integerArgument`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:17` | Self: 0.0% (2.7ms) | Total: 0.0% (2.7ms) | Samples: 1

**Called by:**
- `(module)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:655` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:590` | Self: 0.0% (2.2ms) | Total: 0.0% (7.3ms) | Samples: 3

**Called by:**
- `runTrial` (10)

**Calls:**
- `createZeroVector` (4)
- `fill` (3)

### `reduce`
`[native code]` | Self: 0.0% (2.2ms) | Total: 0.0% (2.2ms) | Samples: 3

**Called by:**
- `step` (3)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` | Self: 0.0% (2.1ms) | Total: 0.0% (2.1ms) | Samples: 3

**Called by:**
- `sort` (3)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` | Self: 0.0% (2.0ms) | Total: 0.0% (2.0ms) | Samples: 3

**Called by:**
- `projectTo3D` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:629` | Self: 0.0% (2.0ms) | Total: 4.5% (586.7ms) | Samples: 3

**Called by:**
- `runTrial` (697)
- `runTrial` (4)

**Calls:**
- `whitenWithEigensystem` (351)
- `whitenWithEigensystem` (341)
- `whitenWithEigensystem` (4)
- `whitenWithEigensystem` (2)

### `variancePercent`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (2.0ms) | Total: 0.0% (2.0ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:581` | Self: 0.0% (1.9ms) | Total: 0.0% (7.9ms) | Samples: 2

**Called by:**
- `runTrial` (10)

**Calls:**
- `forEach` (8)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:696` | Self: 0.0% (1.8ms) | Total: 0.1% (19.1ms) | Samples: 1

**Called by:**
- `runTrial` (23)

**Calls:**
- `projectTo3D` (19)
- `projectTo3D` (3)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` | Self: 0.0% (1.8ms) | Total: 0.0% (1.8ms) | Samples: 3

**Called by:**
- `map` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:669` | Self: 0.0% (1.6ms) | Total: 0.0% (2.5ms) | Samples: 2

**Called by:**
- `runTrial` (3)

**Calls:**
- `exp` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:264` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 2

**Called by:**
- `step` (2)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:274` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` | Self: 0.0% (1.6ms) | Total: 0.8% (112.0ms) | Samples: 2

**Called by:**
- `runTrial` (141)

**Calls:**
- `map` (139)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:193` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `step` (2)

### `radius`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `step` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:555` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.0% (1.3ms) | Total: 0.4% (54.4ms) | Samples: 1

**Called by:**
- `step` (60)
- `createIdentityMatrix` (2)
- `reconstructSymmetric` (1)

**Calls:**
- `from` (62)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (1.3ms) | Total: 0.9% (118.3ms) | Samples: 2

**Called by:**
- `some` (145)

**Calls:**
- `some` (143)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:301` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:677` | Self: 0.0% (1.1ms) | Total: 1.9% (252.4ms) | Samples: 1

**Called by:**
- `runTrial` (309)
- `runTrial` (1)

**Calls:**
- `forEach` (309)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:678` | Self: 0.0% (1.0ms) | Total: 0.1% (15.0ms) | Samples: 1

**Called by:**
- `forEach` (19)

**Calls:**
- `map` (18)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` | Self: 0.0% (1.0ms) | Total: 0.0% (8.4ms) | Samples: 1

**Called by:**
- `runTrial` (8)

**Calls:**
- `isFinite` (7)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 0.0% (1.0ms) | Total: 1.5% (199.1ms) | Samples: 1

**Called by:**
- `alignProjectionBasis` (99)
- `step` (72)
- `alignProjectionBasis` (63)

**Calls:**
- `map` (233)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` | Self: 0.0% (1.0ms) | Total: 0.7% (97.4ms) | Samples: 1

**Called by:**
- `runTrial` (120)
- `runTrial` (1)

**Calls:**
- `map` (120)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` | Self: 0.0% (998us) | Total: 0.0% (10.6ms) | Samples: 1

**Called by:**
- `runTrial` (14)

**Calls:**
- `projectTo3D` (12)
- `projectTo3D` (1)

### `vecDot`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (993us) | Total: 0.0% (993us) | Samples: 1

**Called by:**
- `step` (1)

### `exp`
`[native code]` | Self: 0.0% (877us) | Total: 0.0% (877us) | Samples: 1

**Called by:**
- `step` (1)

### `internal:streams/readable`
`internal:streams/readable:703` | Self: 0.0% (874us) | Total: 0.0% (874us) | Samples: 1

**Called by:**
- `anonymous` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` | Self: 0.0% (871us) | Total: 0.0% (871us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` | Self: 0.0% (859us) | Total: 0.1% (19.8ms) | Samples: 1

**Called by:**
- `runTrial` (24)

**Calls:**
- `map` (21)
- `alignProjectionBasis` (2)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:252` | Self: 0.0% (837us) | Total: 0.0% (837us) | Samples: 1

**Called by:**
- `step` (1)

### `internal:primordials`
`internal:primordials:70` | Self: 0.0% (826us) | Total: 0.0% (826us) | Samples: 1

**Called by:**
- `anonymous` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` | Self: 0.0% (819us) | Total: 0.0% (819us) | Samples: 1

**Called by:**
- `step` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` | Self: 0.0% (806us) | Total: 0.0% (6.9ms) | Samples: 1

**Calls:**
- `(anonymous)` (8)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:135` | Self: 0.0% (793us) | Total: 0.0% (793us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:705` | Self: 0.0% (789us) | Total: 0.4% (64.2ms) | Samples: 1

**Called by:**
- `runTrial` (77)

**Calls:**
- `cloneMatrix` (72)
- `map` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:554` | Self: 0.0% (786us) | Total: 0.0% (786us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:453` | Self: 0.0% (773us) | Total: 0.0% (1.6ms) | Samples: 1

**Called by:**
- `runTrial` (2)

**Calls:**
- `createIdentityMatrix` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:483` | Self: 0.0% (739us) | Total: 0.0% (739us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:253` | Self: 0.0% (727us) | Total: 0.0% (727us) | Samples: 1

**Called by:**
- `step` (1)

### `@lazy`
`[native code]` | Self: 0.0% (724us) | Total: 0.0% (724us) | Samples: 1

**Called by:**
- `node:path` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:661` | Self: 0.0% (723us) | Total: 0.0% (723us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:675` | Self: 0.0% (721us) | Total: 1.8% (242.7ms) | Samples: 1

**Called by:**
- `runTrial` (284)

**Calls:**
- `alignProjectionBasis` (118)
- `alignProjectionBasis` (99)
- `alignProjectionBasis` (61)
- `alignProjectionBasis` (5)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:42` | Self: 0.0% (712us) | Total: 0.0% (712us) | Samples: 1

**Called by:**
- `step` (1)

### `now`
`[native code]` | Self: 0.0% (703us) | Total: 0.0% (703us) | Samples: 1

**Called by:**
- `(module)` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` | Self: 0.0% (683us) | Total: 0.0% (683us) | Samples: 1

**Called by:**
- `step` (1)

### `getStreamOptions`
`internal:fs/streams` | Self: 0.0% (682us) | Total: 0.0% (682us) | Samples: 1

**Called by:**
- `WriteStream` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` | Self: 0.0% (659us) | Total: 0.0% (659us) | Samples: 1

**Called by:**
- `from` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:469` | Self: 0.0% (657us) | Total: 0.0% (657us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:310` | Self: 0.0% (637us) | Total: 0.0% (1.4ms) | Samples: 1

**Called by:**
- `step` (2)

**Calls:**
- `nextHalfOpenUnit` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:426` | Self: 0.0% (628us) | Total: 0.0% (628us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` | Self: 0.0% (610us) | Total: 0.0% (5.6ms) | Samples: 1

**Called by:**
- `(module)` (8)

**Calls:**
- `CMAESOptimizerND` (2)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` | Self: 0.0% (603us) | Total: 0.0% (603us) | Samples: 1

**Called by:**
- `step` (1)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (602us) | Total: 0.0% (602us) | Samples: 1

**Called by:**
- `step` (1)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (3.7ms) | Samples: 0

**Called by:**
- `anonymous` (5)

**Calls:**
- `anonymous` (5)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (1.7ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (2.8ms) | Samples: 0

**Called by:**
- `anonymous` (4)

**Calls:**
- `anonymous` (4)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.7ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `node:path`
`node:path:2` | Self: 0.0% (0us) | Total: 0.0% (724us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `@lazy` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` | Self: 0.0% (0us) | Total: 0.4% (55.9ms) | Samples: 0

**Called by:**
- `step` (61)
- `step` (2)

**Calls:**
- `cloneMatrix` (63)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` | Self: 0.0% (0us) | Total: 0.0% (9.2ms) | Samples: 0

**Called by:**
- `step` (13)

**Calls:**
- `map` (13)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (826us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (1.7ms) | Samples: 0

**Called by:**
- `(anonymous)` (2)

**Calls:**
- `anonymous` (2)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` | Self: 0.0% (0us) | Total: 4.8% (626.8ms) | Samples: 0

**Calls:**
- `runTrial` (812)
- `runTrial` (9)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` | Self: 0.0% (0us) | Total: 0.9% (119.7ms) | Samples: 0

**Called by:**
- `step` (147)

**Calls:**
- `validateSquareFiniteMatrix` (147)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:462` | Self: 0.0% (0us) | Total: 0.0% (569us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `from` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:309` | Self: 0.0% (0us) | Total: 0.0% (649us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `fill` (1)

### `WriteStream`
`internal:fs/streams:201` | Self: 0.0% (0us) | Total: 0.0% (682us) | Samples: 0

**Called by:**
- `(anonymous)` (1)

**Calls:**
- `getStreamOptions` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:24` | Self: 0.0% (0us) | Total: 0.0% (2.7ms) | Samples: 0

**Calls:**
- `integerArgument` (1)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (1.7ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `internal:fs/glob`
`internal:fs/glob:2` | Self: 0.0% (0us) | Total: 0.0% (724us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (0us) | Total: 0.9% (119.7ms) | Samples: 0

**Called by:**
- `jacobiEigenSymmetric` (147)

**Calls:**
- `some` (147)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (826us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` | Self: 0.0% (0us) | Total: 95.0% (12.23s) | Samples: 0

**Calls:**
- `runTrial` (14952)
- `runTrial` (44)
- `runTrial` (8)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (826us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `createIdentityMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:31` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)

**Calls:**
- `createZeroMatrix` (2)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.7ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:88` | Self: 0.0% (0us) | Total: 0.0% (703us) | Samples: 0

**Calls:**
- `now` (1)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (874us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (6.1ms) | Samples: 0

**Called by:**
- `(module)` (8)

**Calls:**
- `anonymous` (5)
- `get WriteStream` (2)
- `WriteStream` (1)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (874us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` | Self: 0.0% (0us) | Total: 0.3% (41.4ms) | Samples: 0

**Called by:**
- `(module)` (44)
- `(module)` (9)

**Calls:**
- `step` (17)
- `step` (14)
- `step` (4)
- `step` (3)
- `step` (3)
- `step` (2)
- `step` (2)
- `step` (2)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:456` | Self: 0.0% (0us) | Total: 0.0% (790us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `createIdentityMatrix` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` | Self: 0.0% (0us) | Total: 0.0% (8.0ms) | Samples: 0

**Called by:**
- `step` (9)

**Calls:**
- `map` (9)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` | Self: 0.0% (0us) | Total: 99.5% (12.81s) | Samples: 0

**Called by:**
- `(module)` (14952)
- `(module)` (812)

**Calls:**
- `step` (7086)
- `step` (2945)
- `step` (720)
- `step` (697)
- `step` (687)
- `step` (597)
- `step` (394)
- `step` (316)
- `step` (309)
- `step` (284)
- `step` (231)
- `step` (211)
- `step` (149)
- `step` (141)
- `step` (130)
- `step` (127)
- `step` (120)
- `step` (77)
- `step` (63)
- `step` (47)
- `step` (34)
- `step` (31)
- `step` (30)
- `step` (24)
- `step` (23)
- `step` (20)
- `step` (20)
- `step` (19)
- `step` (17)
- `step` (16)
- `step` (14)
- `step` (14)
- `step` (12)
- `step` (11)
- `step` (11)
- `step` (10)
- `step` (10)
- `step` (10)
- `step` (10)
- `step` (9)
- `step` (8)
- `step` (8)
- `step` (8)
- `step` (8)
- `step` (7)
- `step` (7)
- `step` (7)
- `step` (7)
- `step` (5)
- `step` (4)
- `step` (3)
- `step` (3)
- `step` (3)
- `step` (3)
- `step` (2)
- `step` (2)
- `step` (1)
- `step` (1)
- `step` (1)

### `nextHalfOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:290` | Self: 0.0% (0us) | Total: 0.0% (782us) | Samples: 0

**Called by:**
- `sampleGaussianVectorND` (1)

**Calls:**
- `isFinite` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:537` | Self: 0.0% (0us) | Total: 0.6% (82.7ms) | Samples: 0

**Called by:**
- `step` (99)

**Calls:**
- `cloneMatrix` (99)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 91.3% | 11.75s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 8.2% | 1.06s | `[native code]` |
| 0.3% | 51.0ms | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.0% | 874us | `internal:streams/readable` |
| 0.0% | 826us | `internal:primordials` |
| 0.0% | 682us | `internal:fs/streams` |
