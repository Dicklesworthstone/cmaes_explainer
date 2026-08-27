# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 9.61s | 14836 | 500us | 177 |

**Top 10:** `jacobiEigenSymmetric` 40.3%, `step` 18.9%, `transformFromEigenCoordinates` 4.5%, `reconstructSymmetric` 3.8%, `step` 3.5%, `whitenWithEigensystem` 2.8%, `whitenWithEigensystem` 2.7%, `map` 1.9%, `step` 1.8%, `step` 1.8%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 40.3% | 3.87s | 41.9% | 4.03s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 18.9% | 1.81s | 18.9% | 1.81s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:649` |
| 4.5% | 441.7ms | 4.6% | 448.7ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 3.8% | 369.3ms | 4.2% | 410.9ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` |
| 3.5% | 341.2ms | 4.0% | 388.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:642` |
| 2.8% | 277.4ms | 2.9% | 283.7ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` |
| 2.7% | 260.4ms | 2.8% | 270.9ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 1.9% | 189.3ms | 4.5% | 441.7ms | `map` | `[native code]` |
| 1.8% | 182.0ms | 1.8% | 182.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:687` |
| 1.8% | 176.3ms | 1.8% | 176.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` |
| 1.6% | 155.2ms | 1.6% | 155.2ms | `hypot` | `[native code]` |
| 1.6% | 154.1ms | 2.3% | 228.1ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.5% | 145.6ms | 1.5% | 145.6ms | `fill` | `[native code]` |
| 1.2% | 124.4ms | 1.2% | 124.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` |
| 1.1% | 107.6ms | 1.1% | 107.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 1.0% | 96.1ms | 1.0% | 96.1ms | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:372` |
| 0.7% | 75.1ms | 0.9% | 95.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.6% | 62.9ms | 0.6% | 62.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.6% | 59.5ms | 0.6% | 59.5ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:545` |
| 0.4% | 42.4ms | 0.5% | 52.3ms | `sort` | `[native code]` |
| 0.4% | 41.9ms | 0.7% | 70.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.4% | 38.8ms | 0.4% | 38.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.3% | 38.0ms | 1.2% | 121.1ms | `some` | `[native code]` |
| 0.3% | 36.6ms | 1.2% | 118.4ms | `from` | `[native code]` |
| 0.3% | 34.7ms | 0.3% | 34.7ms | `Float64Array` | `[native code]` |
| 0.3% | 29.8ms | 0.3% | 30.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` |
| 0.2% | 28.2ms | 1.4% | 142.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` |
| 0.2% | 23.5ms | 0.6% | 60.8ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.2% | 22.4ms | 0.2% | 24.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` |
| 0.2% | 21.3ms | 0.2% | 21.3ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.1% | 18.5ms | 0.1% | 18.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.1% | 17.8ms | 0.1% | 17.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:650` |
| 0.1% | 17.8ms | 0.1% | 17.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 0.1% | 16.8ms | 0.1% | 16.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:618` |
| 0.1% | 16.2ms | 0.1% | 16.2ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.1% | 14.6ms | 0.1% | 14.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.1% | 13.6ms | 0.1% | 13.6ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:303` |
| 0.1% | 12.7ms | 0.1% | 12.7ms | `push` | `[native code]` |
| 0.1% | 10.7ms | 0.1% | 10.7ms | `abs` | `[native code]` |
| 0.0% | 9.4ms | 0.1% | 10.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:600` |
| 0.0% | 8.5ms | 0.0% | 8.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 7.9ms | 0.0% | 8.5ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:533` |
| 0.0% | 7.3ms | 0.0% | 7.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:710` |
| 0.0% | 6.7ms | 0.3% | 29.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.0% | 4.7ms | 0.0% | 4.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` |
| 0.0% | 4.7ms | 1.0% | 100.8ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:523` |
| 0.0% | 4.6ms | 2.6% | 259.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` |
| 0.0% | 4.4ms | 0.2% | 21.7ms | `anonymous` | `[native code]` |
| 0.0% | 4.1ms | 0.0% | 4.1ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.9ms | 0.8% | 76.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.0% | 3.9ms | 0.0% | 5.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:682` |
| 0.0% | 3.8ms | 0.0% | 7.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:634` |
| 0.0% | 3.8ms | 0.5% | 54.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:624` |
| 0.0% | 3.7ms | 0.0% | 3.7ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.6ms | 0.0% | 4.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:706` |
| 0.0% | 3.4ms | 0.0% | 3.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:635` |
| 0.0% | 3.3ms | 0.0% | 3.3ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.2ms | 0.0% | 3.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` |
| 0.0% | 3.1ms | 0.0% | 5.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:691` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:274` |
| 0.0% | 2.7ms | 0.0% | 2.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:707` |
| 0.0% | 2.6ms | 0.1% | 18.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.0% | 2.6ms | 0.0% | 2.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 2.5ms | 0.6% | 64.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:564` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:646` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:525` |
| 0.0% | 2.4ms | 0.3% | 34.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.0% | 2.4ms | 1.6% | 161.9ms | `forEach` | `[native code]` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:626` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `sqrt` | `[native code]` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:614` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:252` |
| 0.0% | 2.0ms | 4.7% | 456.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` |
| 0.0% | 2.0ms | 0.0% | 8.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:554` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:21` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `reduce` | `[native code]` |
| 0.0% | 1.7ms | 0.6% | 61.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.0% | 1.4ms | 0.4% | 43.2ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.0% | 1.4ms | 0.7% | 69.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:269` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `filter` | `[native code]` |
| 0.0% | 1.2ms | 0.9% | 89.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:309` |
| 0.0% | 1.2ms | 0.0% | 2.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` |
| 0.0% | 776us | 0.6% | 61.9ms | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.0% | 753us | 0.0% | 753us | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 743us | 0.0% | 743us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:85` |
| 0.0% | 741us | 0.0% | 741us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:460` |
| 0.0% | 738us | 1.3% | 128.5ms | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.0% | 738us | 0.0% | 738us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:422` |
| 0.0% | 731us | 0.0% | 731us | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:502` |
| 0.0% | 725us | 0.0% | 725us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:469` |
| 0.0% | 725us | 0.0% | 6.5ms | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.0% | 719us | 0.0% | 719us | `WritableState` | `internal:streams/writable` |
| 0.0% | 715us | 0.0% | 715us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:437` |
| 0.0% | 709us | 0.0% | 709us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 705us | 0.0% | 705us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 687us | 0.0% | 687us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:478` |
| 0.0% | 687us | 0.0% | 687us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` |
| 0.0% | 685us | 0.0% | 685us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:88` |
| 0.0% | 682us | 0.0% | 682us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:166` |
| 0.0% | 671us | 0.0% | 671us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 667us | 0.1% | 15.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 0.0% | 658us | 0.0% | 658us | `internal:primordials` | `internal:primordials:73` |
| 0.0% | 650us | 0.0% | 650us | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:524` |
| 0.0% | 649us | 0.0% | 649us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:159` |
| 0.0% | 647us | 0.0% | 647us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:519` |
| 0.0% | 636us | 0.0% | 636us | `isFinite` | `[native code]` |
| 0.0% | 632us | 0.0% | 632us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:669` |
| 0.0% | 631us | 1.5% | 145.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:675` |
| 0.0% | 623us | 0.5% | 52.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:705` |
| 0.0% | 621us | 0.0% | 621us | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` |
| 0.0% | 616us | 0.0% | 616us | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:40` |
| 0.0% | 613us | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` |
| 0.0% | 608us | 0.0% | 608us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` |
| 0.0% | 596us | 0.0% | 596us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` |
| 0.0% | 586us | 0.0% | 586us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:26` |
| 0.0% | 582us | 0.0% | 582us | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 573us | 0.0% | 573us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:479` |
| 0.0% | 560us | 0.0% | 560us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` |
| 0.0% | 560us | 0.0% | 560us | `max` | `[native code]` |
| 0.0% | 554us | 1.6% | 160.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:677` |
| 0.0% | 548us | 0.0% | 8.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` |
| 0.0% | 546us | 0.0% | 546us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:655` |
| 0.0% | 529us | 45.2% | 4.34s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` |
| 0.0% | 524us | 0.0% | 524us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 99.4% | 9.55s | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 93.3% | 8.96s | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` |
| 45.2% | 4.34s | 0.0% | 529us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` |
| 41.9% | 4.03s | 40.3% | 3.87s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 18.9% | 1.81s | 18.9% | 1.81s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:649` |
| 6.5% | 633.8ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` |
| 4.9% | 473.4ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:629` |
| 4.7% | 456.9ms | 0.0% | 2.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` |
| 4.6% | 448.7ms | 4.5% | 441.7ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 4.5% | 441.7ms | 1.9% | 189.3ms | `map` | `[native code]` |
| 4.2% | 411.7ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 4.2% | 410.9ms | 3.8% | 369.3ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` |
| 4.0% | 388.9ms | 3.5% | 341.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:642` |
| 2.9% | 283.7ms | 2.8% | 277.4ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` |
| 2.8% | 270.9ms | 2.7% | 260.4ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 2.6% | 259.1ms | 0.0% | 4.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` |
| 2.3% | 228.1ms | 1.6% | 154.1ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.8% | 182.0ms | 1.8% | 182.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:687` |
| 1.8% | 176.3ms | 1.8% | 176.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` |
| 1.6% | 161.9ms | 0.0% | 2.4ms | `forEach` | `[native code]` |
| 1.6% | 160.0ms | 0.0% | 554us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:677` |
| 1.6% | 155.2ms | 1.6% | 155.2ms | `hypot` | `[native code]` |
| 1.5% | 145.6ms | 1.5% | 145.6ms | `fill` | `[native code]` |
| 1.5% | 145.2ms | 0.0% | 631us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:675` |
| 1.4% | 142.6ms | 0.2% | 28.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` |
| 1.3% | 128.5ms | 0.0% | 738us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 1.2% | 124.4ms | 1.2% | 124.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` |
| 1.2% | 121.1ms | 0.3% | 38.0ms | `some` | `[native code]` |
| 1.2% | 118.4ms | 0.3% | 36.6ms | `from` | `[native code]` |
| 1.1% | 107.6ms | 1.1% | 107.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 1.0% | 100.8ms | 0.0% | 4.7ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:523` |
| 1.0% | 96.1ms | 1.0% | 96.1ms | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:372` |
| 0.9% | 95.3ms | 0.7% | 75.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.9% | 89.1ms | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.8% | 76.9ms | 0.0% | 3.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.7% | 70.3ms | 0.4% | 41.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.7% | 69.0ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 0.6% | 64.0ms | 0.0% | 2.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:564` |
| 0.6% | 62.9ms | 0.6% | 62.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.6% | 61.9ms | 0.0% | 776us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.6% | 61.9ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 0.6% | 61.6ms | 0.0% | 1.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.6% | 60.8ms | 0.2% | 23.5ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.6% | 59.5ms | 0.6% | 59.5ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:545` |
| 0.6% | 59.0ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` |
| 0.5% | 54.8ms | 0.0% | 3.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:624` |
| 0.5% | 52.3ms | 0.4% | 42.4ms | `sort` | `[native code]` |
| 0.5% | 52.1ms | 0.0% | 623us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:705` |
| 0.5% | 52.0ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:537` |
| 0.4% | 43.2ms | 0.0% | 1.4ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.4% | 42.6ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` |
| 0.4% | 38.8ms | 0.4% | 38.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.3% | 34.7ms | 0.3% | 34.7ms | `Float64Array` | `[native code]` |
| 0.3% | 34.5ms | 0.0% | 2.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.3% | 31.6ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` |
| 0.3% | 30.4ms | 0.3% | 29.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` |
| 0.3% | 29.6ms | 0.0% | 6.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.2% | 24.2ms | 0.2% | 22.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` |
| 0.2% | 21.7ms | 0.0% | 4.4ms | `anonymous` | `[native code]` |
| 0.2% | 21.3ms | 0.2% | 21.3ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.1% | 18.5ms | 0.1% | 18.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.1% | 18.2ms | 0.0% | 2.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.1% | 17.8ms | 0.1% | 17.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:650` |
| 0.1% | 17.8ms | 0.1% | 17.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 0.1% | 16.9ms | 0.0% | 0us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:678` |
| 0.1% | 16.8ms | 0.1% | 16.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:618` |
| 0.1% | 16.2ms | 0.1% | 16.2ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.1% | 15.1ms | 0.0% | 667us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 0.1% | 14.6ms | 0.1% | 14.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.1% | 13.6ms | 0.1% | 13.6ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:303` |
| 0.1% | 12.7ms | 0.1% | 12.7ms | `push` | `[native code]` |
| 0.1% | 12.0ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` |
| 0.1% | 10.7ms | 0.1% | 10.7ms | `abs` | `[native code]` |
| 0.1% | 10.1ms | 0.0% | 9.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:600` |
| 0.0% | 8.5ms | 0.0% | 7.9ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:533` |
| 0.0% | 8.5ms | 0.0% | 8.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 8.4ms | 0.0% | 2.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` |
| 0.0% | 8.2ms | 0.0% | 548us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` |
| 0.0% | 7.6ms | 0.0% | 3.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:634` |
| 0.0% | 7.4ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:696` |
| 0.0% | 7.3ms | 0.0% | 7.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:710` |
| 0.0% | 6.5ms | 0.0% | 725us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.0% | 6.1ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` |
| 0.0% | 5.8ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.0% | 5.8ms | 0.0% | 3.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:682` |
| 0.0% | 5.1ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:691` |
| 0.0% | 5.0ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` |
| 0.0% | 4.7ms | 0.0% | 4.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` |
| 0.0% | 4.2ms | 0.0% | 3.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:706` |
| 0.0% | 4.1ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 4.1ms | 0.0% | 4.1ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.9ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:590` |
| 0.0% | 3.7ms | 0.0% | 3.7ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.4ms | 0.0% | 3.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:635` |
| 0.0% | 3.3ms | 0.0% | 3.3ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.2ms | 0.0% | 3.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:274` |
| 0.0% | 3.1ms | 0.0% | 613us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` |
| 0.0% | 2.7ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 2.7ms | 0.0% | 2.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:707` |
| 0.0% | 2.6ms | 0.0% | 2.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 2.5ms | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:646` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:525` |
| 0.0% | 2.4ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:581` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:626` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `sqrt` | `[native code]` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:614` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:252` |
| 0.0% | 2.0ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:554` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:21` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `reduce` | `[native code]` |
| 0.0% | 1.7ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 1.7ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 1.7ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 1.7ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:269` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `filter` | `[native code]` |
| 0.0% | 1.2ms | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:466` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:309` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` |
| 0.0% | 1.1ms | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 1.1ms | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 1.1ms | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 753us | 0.0% | 753us | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 743us | 0.0% | 743us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:85` |
| 0.0% | 741us | 0.0% | 741us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:460` |
| 0.0% | 738us | 0.0% | 738us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:422` |
| 0.0% | 731us | 0.0% | 731us | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:502` |
| 0.0% | 725us | 0.0% | 725us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:469` |
| 0.0% | 719us | 0.0% | 0us | `Writable` | `internal:streams/writable:181` |
| 0.0% | 719us | 0.0% | 719us | `WritableState` | `internal:streams/writable` |
| 0.0% | 719us | 0.0% | 0us | `WriteStream` | `internal:fs/streams:259` |
| 0.0% | 715us | 0.0% | 715us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:437` |
| 0.0% | 709us | 0.0% | 709us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 705us | 0.0% | 705us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 694us | 0.0% | 0us | `createIdentityMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:31` |
| 0.0% | 694us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:453` |
| 0.0% | 687us | 0.0% | 687us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` |
| 0.0% | 687us | 0.0% | 687us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:478` |
| 0.0% | 685us | 0.0% | 685us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:88` |
| 0.0% | 682us | 0.0% | 682us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:166` |
| 0.0% | 671us | 0.0% | 671us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 660us | 0.0% | 0us | `node:fs` | `node:fs:299` |
| 0.0% | 658us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 658us | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 658us | 0.0% | 658us | `internal:primordials` | `internal:primordials:73` |
| 0.0% | 658us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 650us | 0.0% | 650us | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:524` |
| 0.0% | 649us | 0.0% | 649us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:159` |
| 0.0% | 647us | 0.0% | 647us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:519` |
| 0.0% | 636us | 0.0% | 636us | `isFinite` | `[native code]` |
| 0.0% | 636us | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` |
| 0.0% | 635us | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:310` |
| 0.0% | 632us | 0.0% | 632us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:669` |
| 0.0% | 621us | 0.0% | 621us | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` |
| 0.0% | 616us | 0.0% | 616us | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:40` |
| 0.0% | 608us | 0.0% | 608us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` |
| 0.0% | 596us | 0.0% | 596us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` |
| 0.0% | 586us | 0.0% | 586us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:26` |
| 0.0% | 582us | 0.0% | 582us | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 582us | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:305` |
| 0.0% | 573us | 0.0% | 573us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:479` |
| 0.0% | 560us | 0.0% | 560us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` |
| 0.0% | 560us | 0.0% | 560us | `max` | `[native code]` |
| 0.0% | 546us | 0.0% | 546us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:655` |
| 0.0% | 539us | 0.0% | 0us | `internal:streams/readable` | `internal:streams/readable:14` |
| 0.0% | 528us | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:615` |
| 0.0% | 524us | 0.0% | 524us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |

## Function Details

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` | Self: 40.3% (3.87s) | Total: 41.9% (4.03s) | Samples: 5990

**Called by:**
- `step` (6229)

**Calls:**
- `hypot` (239)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:649` | Self: 18.9% (1.81s) | Total: 18.9% (1.81s) | Samples: 2824

**Called by:**
- `runTrial` (2813)
- `runTrial` (11)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` | Self: 4.5% (441.7ms) | Total: 4.6% (448.7ms) | Samples: 674

**Called by:**
- `step` (685)

**Calls:**
- `createZeroVector` (7)
- `fill` (4)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` | Self: 3.8% (369.3ms) | Total: 4.2% (410.9ms) | Samples: 575

**Called by:**
- `step` (637)

**Calls:**
- `from` (59)
- `createZeroMatrix` (2)
- `createZeroMatrix` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:642` | Self: 3.5% (341.2ms) | Total: 4.0% (388.9ms) | Samples: 529

**Called by:**
- `runTrial` (603)
- `runTrial` (1)

**Calls:**
- `createZeroMatrix` (64)
- `from` (10)
- `createZeroMatrix` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` | Self: 2.8% (277.4ms) | Total: 2.9% (283.7ms) | Samples: 431

**Called by:**
- `step` (371)
- `step` (68)

**Calls:**
- `createZeroVector` (6)
- `fill` (2)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` | Self: 2.7% (260.4ms) | Total: 2.8% (270.9ms) | Samples: 405

**Called by:**
- `step` (354)
- `step` (67)

**Calls:**
- `fill` (8)
- `createZeroVector` (8)

### `map`
`[native code]` | Self: 1.9% (189.3ms) | Total: 4.5% (441.7ms) | Samples: 294

**Called by:**
- `cloneMatrix` (193)
- `step` (109)
- `step` (105)
- `step` (92)
- `(anonymous)` (79)
- `(anonymous)` (27)
- `jacobiEigenSymmetric` (16)
- `step` (11)
- `step` (10)
- `jacobiEigenSymmetric` (8)
- `step` (7)
- `jacobiEigenSymmetric` (7)
- `alignProjectionBasis` (3)
- `alignProjectionBasis` (1)
- `map` (1)

**Calls:**
- `(anonymous)` (162)
- `(anonymous)` (85)
- `(anonymous)` (64)
- `(anonymous)` (28)
- `(anonymous)` (23)
- `abs` (9)
- `repair` (1)
- `repair` (1)
- `map` (1)
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:687` | Self: 1.8% (182.0ms) | Total: 1.8% (182.0ms) | Samples: 284

**Called by:**
- `runTrial` (284)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` | Self: 1.8% (176.3ms) | Total: 1.8% (176.3ms) | Samples: 272

**Called by:**
- `runTrial` (271)
- `runTrial` (1)

### `hypot`
`[native code]` | Self: 1.6% (155.2ms) | Total: 1.6% (155.2ms) | Samples: 239

**Called by:**
- `jacobiEigenSymmetric` (239)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.6% (154.1ms) | Total: 2.3% (228.1ms) | Samples: 241

**Called by:**
- `step` (350)

**Calls:**
- `fill` (109)

### `fill`
`[native code]` | Self: 1.5% (145.6ms) | Total: 1.5% (145.6ms) | Samples: 222

**Called by:**
- `sampleGaussianVectorND` (109)
- `ellipsoidObjective` (58)
- `from` (39)
- `whitenWithEigensystem` (8)
- `transformFromEigenCoordinates` (4)
- `whitenWithEigensystem` (2)
- `step` (1)
- `sampleGaussianVectorND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` | Self: 1.2% (124.4ms) | Total: 1.2% (124.4ms) | Samples: 193

**Called by:**
- `runTrial` (192)
- `runTrial` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 1.1% (107.6ms) | Total: 1.1% (107.6ms) | Samples: 162

**Called by:**
- `map` (162)

### `requireFiniteVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:372` | Self: 1.0% (96.1ms) | Total: 1.0% (96.1ms) | Samples: 144

**Called by:**
- `projectTo3D` (144)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` | Self: 0.7% (75.1ms) | Total: 0.9% (95.3ms) | Samples: 118

**Called by:**
- `step` (149)

**Calls:**
- `Float64Array` (31)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.6% (62.9ms) | Total: 0.6% (62.9ms) | Samples: 97

**Called by:**
- `map` (64)
- `some` (33)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:545` | Self: 0.6% (59.5ms) | Total: 0.6% (59.5ms) | Samples: 92

**Called by:**
- `step` (92)

### `sort`
`[native code]` | Self: 0.4% (42.4ms) | Total: 0.5% (52.3ms) | Samples: 68

**Called by:**
- `jacobiEigenSymmetric` (47)
- `step` (36)

**Calls:**
- `(anonymous)` (13)
- `(anonymous)` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.4% (41.9ms) | Total: 0.7% (70.3ms) | Samples: 65

**Called by:**
- `step` (108)

**Calls:**
- `from` (43)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.4% (38.8ms) | Total: 0.4% (38.8ms) | Samples: 57

**Called by:**
- `from` (57)

### `some`
`[native code]` | Self: 0.3% (38.0ms) | Total: 1.2% (121.1ms) | Samples: 61

**Called by:**
- `validateSquareFiniteMatrix` (97)
- `(anonymous)` (95)

**Calls:**
- `(anonymous)` (98)
- `(anonymous)` (33)

### `from`
`[native code]` | Self: 0.3% (36.6ms) | Total: 1.2% (118.4ms) | Samples: 57

**Called by:**
- `createZeroMatrix` (65)
- `reconstructSymmetric` (59)
- `jacobiEigenSymmetric` (43)
- `step` (10)
- `jacobiEigenSymmetric` (4)

**Calls:**
- `(anonymous)` (57)
- `fill` (39)
- `(anonymous)` (28)

### `Float64Array`
`[native code]` | Self: 0.3% (34.7ms) | Total: 0.3% (34.7ms) | Samples: 53

**Called by:**
- `jacobiEigenSymmetric` (31)
- `jacobiEigenSymmetric` (22)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` | Self: 0.3% (29.8ms) | Total: 0.3% (30.4ms) | Samples: 48

**Called by:**
- `runTrial` (49)

**Calls:**
- `adaptationPoint` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` | Self: 0.2% (28.2ms) | Total: 1.4% (142.6ms) | Samples: 43

**Called by:**
- `forEach` (216)

**Calls:**
- `projectTo3D` (151)
- `projectTo3D` (12)
- `projectTo3D` (5)
- `projectTo3D` (4)
- `projectTo3D` (1)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` | Self: 0.2% (23.5ms) | Total: 0.6% (60.8ms) | Samples: 37

**Called by:**
- `step` (95)

**Calls:**
- `fill` (58)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` | Self: 0.2% (22.4ms) | Total: 0.2% (24.2ms) | Samples: 36

**Called by:**
- `runTrial` (39)

**Calls:**
- `sqrt` (3)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.2% (21.3ms) | Total: 0.2% (21.3ms) | Samples: 32

**Called by:**
- `step` (17)
- `step` (10)
- `(anonymous)` (5)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.1% (18.5ms) | Total: 0.1% (18.5ms) | Samples: 28

**Called by:**
- `from` (28)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:650` | Self: 0.1% (17.8ms) | Total: 0.1% (17.8ms) | Samples: 25

**Called by:**
- `runTrial` (25)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` | Self: 0.1% (17.8ms) | Total: 0.1% (17.8ms) | Samples: 28

**Called by:**
- `map` (28)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:618` | Self: 0.1% (16.8ms) | Total: 0.1% (16.8ms) | Samples: 26

**Called by:**
- `runTrial` (26)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` | Self: 0.1% (16.2ms) | Total: 0.1% (16.2ms) | Samples: 22

**Called by:**
- `whitenWithEigensystem` (8)
- `transformFromEigenCoordinates` (7)
- `whitenWithEigensystem` (6)
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` | Self: 0.1% (14.6ms) | Total: 0.1% (14.6ms) | Samples: 23

**Called by:**
- `map` (23)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:303` | Self: 0.1% (13.6ms) | Total: 0.1% (13.6ms) | Samples: 21

**Called by:**
- `step` (21)

### `push`
`[native code]` | Self: 0.1% (12.7ms) | Total: 0.1% (12.7ms) | Samples: 18

**Called by:**
- `step` (14)
- `step` (4)

### `abs`
`[native code]` | Self: 0.1% (10.7ms) | Total: 0.1% (10.7ms) | Samples: 9

**Called by:**
- `map` (9)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:600` | Self: 0.0% (9.4ms) | Total: 0.1% (10.1ms) | Samples: 15

**Called by:**
- `runTrial` (16)

**Calls:**
- `adaptationPoint` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` | Self: 0.0% (8.5ms) | Total: 0.0% (8.5ms) | Samples: 13

**Called by:**
- `sort` (13)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:533` | Self: 0.0% (7.9ms) | Total: 0.0% (8.5ms) | Samples: 12

**Called by:**
- `(anonymous)` (12)
- `step` (1)

**Calls:**
- `coordinate` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:710` | Self: 0.0% (7.3ms) | Total: 0.0% (7.3ms) | Samples: 11

**Called by:**
- `runTrial` (11)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` | Self: 0.0% (6.7ms) | Total: 0.3% (29.6ms) | Samples: 6

**Called by:**
- `runTrial` (42)

**Calls:**
- `sort` (36)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` | Self: 0.0% (4.7ms) | Total: 0.0% (4.7ms) | Samples: 8

**Called by:**
- `runTrial` (8)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:523` | Self: 0.0% (4.7ms) | Total: 1.0% (100.8ms) | Samples: 8

**Called by:**
- `(anonymous)` (151)
- `step` (1)

**Calls:**
- `requireFiniteVector` (144)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` | Self: 0.0% (4.6ms) | Total: 2.6% (259.1ms) | Samples: 7

**Called by:**
- `runTrial` (394)
- `runTrial` (2)

**Calls:**
- `sampleGaussianVectorND` (350)
- `sampleGaussianVectorND` (21)
- `push` (14)
- `sampleGaussianVectorND` (2)
- `sampleGaussianVectorND` (1)
- `sampleGaussianVectorND` (1)

### `anonymous`
`[native code]` | Self: 0.0% (4.4ms) | Total: 0.2% (21.7ms) | Samples: 7

**Called by:**
- `(anonymous)` (5)
- `node:fs` (4)
- `internal:fs/streams` (3)
- `get WriteStream` (3)
- `internal:stream` (3)
- `node:fs/promises` (3)
- `node:stream` (3)
- `internal:streams/pipeline` (2)
- `internal:streams/compose` (2)
- `internal:streams/duplex` (2)
- `node:events` (1)
- `internal:validators` (1)
- `node:fs` (1)
- `internal:streams/readable` (1)
- `internal:shared` (1)

**Calls:**
- `node:fs` (4)
- `internal:fs/streams` (3)
- `internal:stream` (3)
- `node:fs/promises` (3)
- `node:stream` (3)
- `internal:streams/pipeline` (2)
- `internal:streams/compose` (2)
- `internal:streams/duplex` (2)
- `node:events` (1)
- `internal:validators` (1)
- `node:fs` (1)
- `internal:streams/readable` (1)
- `internal:shared` (1)
- `internal:primordials` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (4.1ms) | Total: 0.0% (4.1ms) | Samples: 6

**Called by:**
- `step` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` | Self: 0.0% (3.9ms) | Total: 0.8% (76.9ms) | Samples: 6

**Called by:**
- `runTrial` (113)
- `runTrial` (2)

**Calls:**
- `map` (109)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:682` | Self: 0.0% (3.9ms) | Total: 0.0% (5.8ms) | Samples: 6

**Called by:**
- `runTrial` (9)

**Calls:**
- `reduce` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:634` | Self: 0.0% (3.8ms) | Total: 0.0% (7.6ms) | Samples: 6

**Called by:**
- `runTrial` (12)

**Calls:**
- `vecDot` (6)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:624` | Self: 0.0% (3.8ms) | Total: 0.5% (54.8ms) | Samples: 6

**Called by:**
- `map` (85)

**Calls:**
- `map` (79)

### `vecDot`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (3.7ms) | Total: 0.0% (3.7ms) | Samples: 6

**Called by:**
- `step` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:706` | Self: 0.0% (3.6ms) | Total: 0.0% (4.2ms) | Samples: 6

**Called by:**
- `runTrial` (7)

**Calls:**
- `cloneMatrix` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:635` | Self: 0.0% (3.4ms) | Total: 0.0% (3.4ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `repair`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (3.3ms) | Total: 0.0% (3.3ms) | Samples: 1

**Called by:**
- `map` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` | Self: 0.0% (3.2ms) | Total: 0.0% (3.2ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` | Self: 0.0% (3.1ms) | Total: 0.0% (3.1ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:691` | Self: 0.0% (3.1ms) | Total: 0.0% (5.1ms) | Samples: 5

**Called by:**
- `runTrial` (8)

**Calls:**
- `radius` (3)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:274` | Self: 0.0% (3.1ms) | Total: 0.0% (3.1ms) | Samples: 5

**Called by:**
- `step` (4)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:707` | Self: 0.0% (2.7ms) | Total: 0.0% (2.7ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.0% (2.6ms) | Total: 0.1% (18.2ms) | Samples: 4

**Called by:**
- `step` (21)

**Calls:**
- `map` (16)
- `max` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` | Self: 0.0% (2.6ms) | Total: 0.0% (2.6ms) | Samples: 4

**Called by:**
- `step` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:564` | Self: 0.0% (2.5ms) | Total: 0.6% (64.0ms) | Samples: 4

**Called by:**
- `runTrial` (100)

**Calls:**
- `ellipsoidObjective` (95)
- `ellipsoidObjective` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:646` | Self: 0.0% (2.4ms) | Total: 0.0% (2.4ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:525` | Self: 0.0% (2.4ms) | Total: 0.0% (2.4ms) | Samples: 4

**Called by:**
- `(anonymous)` (4)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` | Self: 0.0% (2.4ms) | Total: 0.3% (34.5ms) | Samples: 4

**Called by:**
- `step` (55)

**Calls:**
- `sort` (47)
- `from` (4)

### `forEach`
`[native code]` | Self: 0.0% (2.4ms) | Total: 1.6% (161.9ms) | Samples: 4

**Called by:**
- `step` (243)
- `step` (4)

**Calls:**
- `(anonymous)` (216)
- `(anonymous)` (27)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:626` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `sqrt`
`[native code]` | Self: 0.0% (2.2ms) | Total: 0.0% (2.2ms) | Samples: 4

**Called by:**
- `step` (3)
- `step` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (2.2ms) | Total: 0.0% (2.2ms) | Samples: 4

**Called by:**
- `step` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:614` | Self: 0.0% (2.1ms) | Total: 0.0% (2.1ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:252` | Self: 0.0% (2.0ms) | Total: 0.0% (2.0ms) | Samples: 3

**Called by:**
- `step` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` | Self: 0.0% (2.0ms) | Total: 4.7% (456.9ms) | Samples: 3

**Called by:**
- `runTrial` (696)
- `runTrial` (1)

**Calls:**
- `transformFromEigenCoordinates` (685)
- `transformFromEigenCoordinates` (6)
- `transformFromEigenCoordinates` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` | Self: 0.0% (2.0ms) | Total: 0.0% (8.4ms) | Samples: 3

**Called by:**
- `runTrial` (13)

**Calls:**
- `map` (10)

### `radius`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (2.0ms) | Total: 0.0% (2.0ms) | Samples: 3

**Called by:**
- `step` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:554` | Self: 0.0% (1.9ms) | Total: 0.0% (1.9ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:21` | Self: 0.0% (1.8ms) | Total: 0.0% (1.8ms) | Samples: 3

**Called by:**
- `step` (3)

### `reduce`
`[native code]` | Self: 0.0% (1.8ms) | Total: 0.0% (1.8ms) | Samples: 3

**Called by:**
- `step` (3)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (1.7ms) | Total: 0.6% (61.6ms) | Samples: 3

**Called by:**
- `some` (98)

**Calls:**
- `some` (95)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.0% (1.4ms) | Total: 0.4% (43.2ms) | Samples: 2

**Called by:**
- `step` (64)
- `reconstructSymmetric` (2)
- `createIdentityMatrix` (1)

**Calls:**
- `from` (65)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` | Self: 0.0% (1.4ms) | Total: 0.7% (69.0ms) | Samples: 2

**Called by:**
- `runTrial` (107)

**Calls:**
- `map` (105)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `step` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `sort` (2)

### `variancePercent`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `step` (2)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:269` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `step` (1)
- `step` (1)

### `filter`
`[native code]` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 2

**Called by:**
- `CMAESOptimizerND` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` | Self: 0.0% (1.2ms) | Total: 0.9% (89.1ms) | Samples: 2

**Called by:**
- `runTrial` (138)
- `runTrial` (1)

**Calls:**
- `whitenWithEigensystem` (68)
- `whitenWithEigensystem` (67)
- `whitenWithEigensystem` (1)
- `whitenWithEigensystem` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:309` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` | Self: 0.0% (1.2ms) | Total: 0.0% (2.5ms) | Samples: 2

**Called by:**
- `runTrial` (4)

**Calls:**
- `variancePercent` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` | Self: 0.0% (1.1ms) | Total: 0.0% (1.1ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (776us) | Total: 0.6% (61.9ms) | Samples: 1

**Called by:**
- `jacobiEigenSymmetric` (98)

**Calls:**
- `some` (97)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (753us) | Total: 0.0% (753us) | Samples: 1

**Called by:**
- `step` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:85` | Self: 0.0% (743us) | Total: 0.0% (743us) | Samples: 1

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:460` | Self: 0.0% (741us) | Total: 0.0% (741us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 0.0% (738us) | Total: 1.3% (128.5ms) | Samples: 1

**Called by:**
- `alignProjectionBasis` (76)
- `step` (69)
- `alignProjectionBasis` (48)
- `step` (1)

**Calls:**
- `map` (193)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:422` | Self: 0.0% (738us) | Total: 0.0% (738us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `repair`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:502` | Self: 0.0% (731us) | Total: 0.0% (731us) | Samples: 1

**Called by:**
- `map` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:469` | Self: 0.0% (725us) | Total: 0.0% (725us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` | Self: 0.0% (725us) | Total: 0.0% (6.5ms) | Samples: 1

**Calls:**
- `(anonymous)` (9)

### `WritableState`
`internal:streams/writable` | Self: 0.0% (719us) | Total: 0.0% (719us) | Samples: 1

**Called by:**
- `Writable` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:437` | Self: 0.0% (715us) | Total: 0.0% (715us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (709us) | Total: 0.0% (709us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (705us) | Total: 0.0% (705us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:478` | Self: 0.0% (687us) | Total: 0.0% (687us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` | Self: 0.0% (687us) | Total: 0.0% (687us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:88` | Self: 0.0% (685us) | Total: 0.0% (685us) | Samples: 1

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:166` | Self: 0.0% (682us) | Total: 0.0% (682us) | Samples: 1

**Called by:**
- `step` (1)

### `adaptationPoint`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (671us) | Total: 0.0% (671us) | Samples: 1

**Called by:**
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` | Self: 0.0% (667us) | Total: 0.1% (15.1ms) | Samples: 1

**Called by:**
- `step` (23)

**Calls:**
- `Float64Array` (22)

### `internal:primordials`
`internal:primordials:73` | Self: 0.0% (658us) | Total: 0.0% (658us) | Samples: 1

**Called by:**
- `anonymous` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:524` | Self: 0.0% (650us) | Total: 0.0% (650us) | Samples: 1

**Called by:**
- `(anonymous)` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:159` | Self: 0.0% (649us) | Total: 0.0% (649us) | Samples: 1

**Called by:**
- `step` (1)

### `adaptationPoint`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:519` | Self: 0.0% (647us) | Total: 0.0% (647us) | Samples: 1

**Called by:**
- `step` (1)

### `isFinite`
`[native code]` | Self: 0.0% (636us) | Total: 0.0% (636us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:669` | Self: 0.0% (632us) | Total: 0.0% (632us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:675` | Self: 0.0% (631us) | Total: 1.5% (145.2ms) | Samples: 1

**Called by:**
- `runTrial` (222)
- `runTrial` (1)

**Calls:**
- `alignProjectionBasis` (92)
- `alignProjectionBasis` (79)
- `alignProjectionBasis` (49)
- `alignProjectionBasis` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:705` | Self: 0.0% (623us) | Total: 0.5% (52.1ms) | Samples: 1

**Called by:**
- `runTrial` (75)
- `runTrial` (2)

**Calls:**
- `cloneMatrix` (69)
- `map` (7)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` | Self: 0.0% (621us) | Total: 0.0% (621us) | Samples: 1

**Called by:**
- `projectTo3D` (1)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:40` | Self: 0.0% (616us) | Total: 0.0% (616us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` | Self: 0.0% (613us) | Total: 0.0% (3.1ms) | Samples: 1

**Called by:**
- `runTrial` (5)

**Calls:**
- `push` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` | Self: 0.0% (608us) | Total: 0.0% (608us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` | Self: 0.0% (596us) | Total: 0.0% (596us) | Samples: 1

**Called by:**
- `map` (1)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:26` | Self: 0.0% (586us) | Total: 0.0% (586us) | Samples: 1

**Called by:**
- `reconstructSymmetric` (1)

### `nextOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (582us) | Total: 0.0% (582us) | Samples: 1

**Called by:**
- `sampleGaussianVectorND` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:479` | Self: 0.0% (573us) | Total: 0.0% (573us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` | Self: 0.0% (560us) | Total: 0.0% (560us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `max`
`[native code]` | Self: 0.0% (560us) | Total: 0.0% (560us) | Samples: 1

**Called by:**
- `jacobiEigenSymmetric` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:677` | Self: 0.0% (554us) | Total: 1.6% (160.0ms) | Samples: 1

**Called by:**
- `runTrial` (242)
- `runTrial` (2)

**Calls:**
- `forEach` (243)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` | Self: 0.0% (548us) | Total: 0.0% (8.2ms) | Samples: 1

**Called by:**
- `runTrial` (11)
- `runTrial` (1)

**Calls:**
- `map` (11)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:655` | Self: 0.0% (546us) | Total: 0.0% (546us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` | Self: 0.0% (529us) | Total: 45.2% (4.34s) | Samples: 1

**Called by:**
- `runTrial` (6683)
- `runTrial` (23)

**Calls:**
- `jacobiEigenSymmetric` (6229)
- `jacobiEigenSymmetric` (149)
- `jacobiEigenSymmetric` (108)
- `jacobiEigenSymmetric` (98)
- `jacobiEigenSymmetric` (55)
- `jacobiEigenSymmetric` (23)
- `jacobiEigenSymmetric` (21)
- `jacobiEigenSymmetric` (8)
- `jacobiEigenSymmetric` (7)
- `jacobiEigenSymmetric` (4)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (524us) | Total: 0.0% (524us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:629` | Self: 0.0% (0us) | Total: 4.9% (473.4ms) | Samples: 0

**Called by:**
- `runTrial` (729)
- `runTrial` (5)

**Calls:**
- `whitenWithEigensystem` (371)
- `whitenWithEigensystem` (354)
- `whitenWithEigensystem` (4)
- `whitenWithEigensystem` (4)
- `whitenWithEigensystem` (1)

### `internal:streams/readable`
`internal:streams/readable:14` | Self: 0.0% (0us) | Total: 0.0% (539us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:453` | Self: 0.0% (0us) | Total: 0.0% (694us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `createIdentityMatrix` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:678` | Self: 0.0% (0us) | Total: 0.1% (16.9ms) | Samples: 0

**Called by:**
- `forEach` (27)

**Calls:**
- `map` (27)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (658us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (1.1ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` | Self: 0.0% (0us) | Total: 99.4% (9.55s) | Samples: 0

**Called by:**
- `(module)` (13798)
- `(module)` (955)

**Calls:**
- `step` (6683)
- `step` (2813)
- `step` (729)
- `step` (696)
- `step` (632)
- `step` (603)
- `step` (394)
- `step` (284)
- `step` (271)
- `step` (242)
- `step` (222)
- `step` (192)
- `step` (138)
- `step` (113)
- `step` (107)
- `step` (100)
- `step` (91)
- `step` (75)
- `step` (49)
- `step` (42)
- `step` (39)
- `step` (26)
- `step` (25)
- `step` (18)
- `step` (16)
- `step` (13)
- `step` (12)
- `step` (11)
- `step` (11)
- `step` (11)
- `step` (9)
- `step` (8)
- `step` (8)
- `step` (7)
- `step` (5)
- `step` (5)
- `step` (5)
- `step` (5)
- `step` (5)
- `step` (4)
- `step` (4)
- `step` (4)
- `step` (4)
- `step` (3)
- `step` (3)
- `step` (3)
- `step` (3)
- `step` (2)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` | Self: 0.0% (0us) | Total: 0.1% (12.0ms) | Samples: 0

**Called by:**
- `runTrial` (18)

**Calls:**
- `projectTo3D` (17)
- `projectTo3D` (1)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (2.0ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` | Self: 0.0% (0us) | Total: 0.6% (59.0ms) | Samples: 0

**Called by:**
- `runTrial` (91)
- `runTrial` (1)

**Calls:**
- `map` (92)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:310` | Self: 0.0% (0us) | Total: 0.0% (635us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `fill` (1)

### `Writable`
`internal:streams/writable:181` | Self: 0.0% (0us) | Total: 0.0% (719us) | Samples: 0

**Called by:**
- `WriteStream` (1)

**Calls:**
- `WritableState` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` | Self: 0.0% (0us) | Total: 0.0% (4.1ms) | Samples: 0

**Called by:**
- `step` (7)

**Calls:**
- `map` (7)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.7ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (658us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `WriteStream`
`internal:fs/streams:259` | Self: 0.0% (0us) | Total: 0.0% (719us) | Samples: 0

**Called by:**
- `(anonymous)` (1)

**Calls:**
- `Writable` (1)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (1.1ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` | Self: 0.0% (0us) | Total: 0.3% (31.6ms) | Samples: 0

**Called by:**
- `step` (49)

**Calls:**
- `cloneMatrix` (48)
- `map` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:581` | Self: 0.0% (0us) | Total: 0.0% (2.4ms) | Samples: 0

**Called by:**
- `runTrial` (3)
- `runTrial` (1)

**Calls:**
- `forEach` (4)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (1.7ms) | Samples: 0

**Called by:**
- `(anonymous)` (3)

**Calls:**
- `anonymous` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:615` | Self: 0.0% (0us) | Total: 0.0% (528us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `sqrt` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` | Self: 0.0% (0us) | Total: 6.5% (633.8ms) | Samples: 0

**Calls:**
- `runTrial` (955)
- `runTrial` (8)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` | Self: 0.0% (0us) | Total: 4.2% (411.7ms) | Samples: 0

**Called by:**
- `runTrial` (632)
- `runTrial` (6)

**Calls:**
- `reconstructSymmetric` (637)
- `reconstructSymmetric` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` | Self: 0.0% (0us) | Total: 0.6% (61.9ms) | Samples: 0

**Called by:**
- `step` (98)

**Calls:**
- `validateSquareFiniteMatrix` (98)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.7ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` | Self: 0.0% (0us) | Total: 0.0% (6.1ms) | Samples: 0

**Called by:**
- `(module)` (9)

**Calls:**
- `CMAESOptimizerND` (2)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:537` | Self: 0.0% (0us) | Total: 0.5% (52.0ms) | Samples: 0

**Called by:**
- `step` (79)

**Calls:**
- `cloneMatrix` (76)
- `map` (3)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (2.7ms) | Samples: 0

**Called by:**
- `anonymous` (4)

**Calls:**
- `anonymous` (4)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:466` | Self: 0.0% (0us) | Total: 0.0% (1.2ms) | Samples: 0

**Called by:**
- `runTrial` (2)

**Calls:**
- `filter` (2)

### `node:fs`
`node:fs:299` | Self: 0.0% (0us) | Total: 0.0% (660us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (5.8ms) | Samples: 0

**Called by:**
- `(module)` (9)

**Calls:**
- `anonymous` (5)
- `get WriteStream` (3)
- `WriteStream` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:696` | Self: 0.0% (0us) | Total: 0.0% (7.4ms) | Samples: 0

**Called by:**
- `runTrial` (11)

**Calls:**
- `projectTo3D` (10)
- `projectTo3D` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:590` | Self: 0.0% (0us) | Total: 0.0% (3.9ms) | Samples: 0

**Called by:**
- `runTrial` (5)

**Calls:**
- `createZeroVector` (3)
- `fill` (1)
- `createZeroVector` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` | Self: 0.0% (0us) | Total: 0.0% (636us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `isFinite` (1)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (658us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:305` | Self: 0.0% (0us) | Total: 0.0% (582us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `nextOpenUnit` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` | Self: 0.0% (0us) | Total: 0.4% (42.6ms) | Samples: 0

**Called by:**
- `(module)` (54)
- `(module)` (8)

**Calls:**
- `step` (23)
- `step` (11)
- `step` (6)
- `step` (5)
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
- `step` (1)
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` | Self: 0.0% (0us) | Total: 0.0% (5.0ms) | Samples: 0

**Called by:**
- `step` (8)

**Calls:**
- `map` (8)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (1.1ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (1.7ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` | Self: 0.0% (0us) | Total: 93.3% (8.96s) | Samples: 0

**Calls:**
- `runTrial` (13798)
- `runTrial` (54)
- `runTrial` (9)

### `createIdentityMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:31` | Self: 0.0% (0us) | Total: 0.0% (694us) | Samples: 0

**Called by:**
- `CMAESOptimizerND` (1)

**Calls:**
- `createZeroMatrix` (1)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 92.6% | 8.90s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 7.0% | 679.3ms | `[native code]` |
| 0.2% | 26.3ms | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.0% | 719us | `internal:streams/writable` |
| 0.0% | 658us | `internal:primordials` |
