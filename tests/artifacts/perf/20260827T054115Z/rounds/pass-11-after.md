# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 9.37s | 12172 | 500us | 173 |

**Top 10:** `jacobiEigenSymmetric` 39.5%, `step` 19.0%, `transformFromEigenCoordinates` 4.8%, `step` 3.9%, `reconstructSymmetric` 3.8%, `whitenWithEigensystem` 3.3%, `whitenWithEigensystem` 2.5%, `map` 2.4%, `step` 2.0%, `step` 1.9%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 39.5% | 3.70s | 41.3% | 3.87s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 19.0% | 1.78s | 19.0% | 1.78s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:646` |
| 4.8% | 452.5ms | 4.9% | 463.3ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 3.9% | 368.8ms | 4.3% | 408.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 3.8% | 358.9ms | 4.2% | 397.6ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` |
| 3.3% | 315.1ms | 3.4% | 321.0ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 2.5% | 236.9ms | 2.6% | 243.7ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` |
| 2.4% | 233.9ms | 5.1% | 485.5ms | `map` | `[native code]` |
| 2.0% | 188.1ms | 2.0% | 188.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:684` |
| 1.9% | 178.7ms | 1.9% | 178.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` |
| 1.8% | 169.0ms | 1.8% | 169.0ms | `hypot` | `[native code]` |
| 1.4% | 135.6ms | 1.4% | 135.6ms | `fill` | `[native code]` |
| 1.4% | 134.4ms | 2.1% | 201.1ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.3% | 126.8ms | 1.3% | 126.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:655` |
| 0.9% | 92.5ms | 0.9% | 92.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.6% | 63.6ms | 0.6% | 63.6ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` |
| 0.6% | 56.6ms | 0.6% | 56.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.5% | 48.0ms | 1.3% | 127.4ms | `some` | `[native code]` |
| 0.4% | 41.9ms | 0.4% | 45.2ms | `sort` | `[native code]` |
| 0.4% | 40.2ms | 0.4% | 40.2ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:545` |
| 0.4% | 38.6ms | 0.4% | 38.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 0.4% | 38.2ms | 1.1% | 103.6ms | `from` | `[native code]` |
| 0.3% | 34.4ms | 0.3% | 34.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.3% | 33.8ms | 0.5% | 55.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.3% | 33.0ms | 0.3% | 33.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.3% | 32.5ms | 0.3% | 33.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` |
| 0.3% | 30.0ms | 0.3% | 30.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 0.2% | 27.7ms | 0.2% | 27.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 0.2% | 24.3ms | 0.6% | 64.7ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.2% | 22.8ms | 1.2% | 119.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` |
| 0.2% | 21.9ms | 0.2% | 21.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.2% | 21.7ms | 0.2% | 21.7ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.2% | 19.8ms | 0.2% | 20.5ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:523` |
| 0.1% | 16.2ms | 0.1% | 16.2ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.1% | 11.5ms | 0.8% | 77.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:564` |
| 0.1% | 11.2ms | 0.1% | 11.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.1% | 11.0ms | 0.1% | 11.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` |
| 0.1% | 10.6ms | 0.1% | 10.6ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 9.2ms | 0.0% | 9.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` |
| 0.0% | 8.2ms | 1.1% | 106.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 0.0% | 8.0ms | 0.6% | 64.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:621` |
| 0.0% | 7.3ms | 0.0% | 7.3ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:253` |
| 0.0% | 6.9ms | 0.0% | 6.9ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:303` |
| 0.0% | 6.2ms | 0.7% | 69.9ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:533` |
| 0.0% | 6.2ms | 0.0% | 6.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:600` |
| 0.0% | 6.1ms | 0.0% | 6.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` |
| 0.0% | 6.1ms | 0.0% | 6.1ms | `push` | `[native code]` |
| 0.0% | 5.0ms | 0.0% | 5.0ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:53` |
| 0.0% | 4.8ms | 0.0% | 6.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 0.0% | 4.8ms | 0.2% | 23.2ms | `anonymous` | `[native code]` |
| 0.0% | 4.7ms | 0.0% | 4.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` |
| 0.0% | 4.6ms | 0.0% | 4.6ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 4.6ms | 0.0% | 4.6ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 4.0ms | 0.2% | 23.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.0% | 3.7ms | 0.0% | 3.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:704` |
| 0.0% | 3.5ms | 0.0% | 3.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` |
| 0.0% | 3.3ms | 2.3% | 221.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` |
| 0.0% | 3.3ms | 0.0% | 4.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:688` |
| 0.0% | 3.2ms | 0.0% | 3.2ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:525` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `every` | `[native code]` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.4ms | 0.0% | 3.9ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:524` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `abs` | `[native code]` |
| 0.0% | 2.3ms | 0.0% | 8.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 2.2ms | 0.0% | 2.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:692` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:554` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:274` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.5ms | 0.8% | 82.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:264` |
| 0.0% | 1.5ms | 0.1% | 10.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:269` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `reduce` | `[native code]` |
| 0.0% | 1.3ms | 0.0% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:668` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` |
| 0.0% | 925us | 0.0% | 925us | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:40` |
| 0.0% | 915us | 0.0% | 915us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.0% | 913us | 0.0% | 913us | `filter` | `[native code]` |
| 0.0% | 911us | 0.0% | 911us | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:235` |
| 0.0% | 899us | 0.0% | 899us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:252` |
| 0.0% | 892us | 0.0% | 892us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:479` |
| 0.0% | 880us | 0.0% | 880us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 853us | 0.0% | 853us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:116` |
| 0.0% | 850us | 4.2% | 400.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:663` |
| 0.0% | 848us | 0.0% | 1.6ms | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:50` |
| 0.0% | 830us | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` |
| 0.0% | 823us | 0.0% | 8.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` |
| 0.0% | 821us | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:590` |
| 0.0% | 816us | 0.0% | 816us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` |
| 0.0% | 784us | 0.2% | 26.4ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.0% | 779us | 0.0% | 6.2ms | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.0% | 777us | 0.0% | 777us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 772us | 0.0% | 772us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:464` |
| 0.0% | 769us | 0.0% | 769us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:708` |
| 0.0% | 769us | 0.0% | 769us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` |
| 0.0% | 768us | 0.0% | 768us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:50` |
| 0.0% | 766us | 0.0% | 766us | `max` | `[native code]` |
| 0.0% | 758us | 0.0% | 758us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:166` |
| 0.0% | 752us | 0.0% | 752us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` |
| 0.0% | 740us | 0.1% | 15.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:631` |
| 0.0% | 720us | 0.0% | 720us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.0% | 702us | 0.0% | 2.3ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:305` |
| 0.0% | 700us | 0.0% | 700us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:713` |
| 0.0% | 687us | 0.0% | 687us | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 686us | 0.0% | 686us | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 683us | 1.5% | 142.4ms | `forEach` | `[native code]` |
| 0.0% | 675us | 0.3% | 33.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.0% | 670us | 0.0% | 670us | `createSafeIterator` | `internal:primordials:3` |
| 0.0% | 661us | 0.0% | 661us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:707` |
| 0.0% | 658us | 0.0% | 658us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:309` |
| 0.0% | 652us | 0.0% | 652us | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 645us | 0.0% | 645us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:690` |
| 0.0% | 642us | 0.0% | 642us | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 639us | 0.6% | 62.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.0% | 627us | 0.0% | 627us | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 624us | 0.0% | 624us | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:289` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 99.3% | 9.31s | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 93.2% | 8.73s | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` |
| 44.3% | 4.15s | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` |
| 41.3% | 3.87s | 39.5% | 3.70s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 19.0% | 1.78s | 19.0% | 1.78s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:646` |
| 6.6% | 624.8ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` |
| 5.4% | 506.0ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:626` |
| 5.1% | 485.5ms | 2.4% | 233.9ms | `map` | `[native code]` |
| 5.0% | 475.1ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` |
| 4.9% | 463.3ms | 4.8% | 452.5ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 4.3% | 408.5ms | 3.9% | 368.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 4.2% | 400.0ms | 0.0% | 850us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:663` |
| 4.2% | 397.6ms | 3.8% | 358.9ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` |
| 3.4% | 321.0ms | 3.3% | 315.1ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 2.6% | 243.7ms | 2.5% | 236.9ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` |
| 2.3% | 221.1ms | 0.0% | 3.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` |
| 2.1% | 201.1ms | 1.4% | 134.4ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 2.0% | 188.1ms | 2.0% | 188.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:684` |
| 1.9% | 178.7ms | 1.9% | 178.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` |
| 1.8% | 169.0ms | 1.8% | 169.0ms | `hypot` | `[native code]` |
| 1.5% | 142.4ms | 0.0% | 683us | `forEach` | `[native code]` |
| 1.5% | 140.9ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |
| 1.4% | 135.6ms | 1.4% | 135.6ms | `fill` | `[native code]` |
| 1.3% | 127.4ms | 0.5% | 48.0ms | `some` | `[native code]` |
| 1.3% | 126.8ms | 1.3% | 126.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:655` |
| 1.3% | 123.0ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:672` |
| 1.2% | 119.4ms | 0.2% | 22.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` |
| 1.2% | 116.7ms | 0.0% | 0us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 1.1% | 106.0ms | 0.0% | 8.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 1.1% | 103.6ms | 0.4% | 38.2ms | `from` | `[native code]` |
| 0.9% | 92.5ms | 0.9% | 92.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.8% | 82.7ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.8% | 77.1ms | 0.1% | 11.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:564` |
| 0.7% | 69.9ms | 0.0% | 6.2ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:533` |
| 0.7% | 68.1ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.6% | 64.9ms | 0.0% | 8.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:621` |
| 0.6% | 64.7ms | 0.2% | 24.3ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.6% | 63.6ms | 0.6% | 63.6ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` |
| 0.6% | 63.2ms | 0.0% | 0us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.6% | 63.2ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 0.6% | 62.4ms | 0.0% | 639us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.6% | 61.3ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:620` |
| 0.6% | 56.6ms | 0.6% | 56.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.5% | 55.9ms | 0.3% | 33.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.4% | 45.2ms | 0.4% | 41.9ms | `sort` | `[native code]` |
| 0.4% | 43.7ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:537` |
| 0.4% | 43.6ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` |
| 0.4% | 41.1ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:702` |
| 0.4% | 40.2ms | 0.4% | 40.2ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:545` |
| 0.4% | 38.6ms | 0.4% | 38.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 0.3% | 37.3ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` |
| 0.3% | 34.4ms | 0.3% | 34.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.3% | 33.5ms | 0.0% | 675us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.3% | 33.2ms | 0.3% | 32.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` |
| 0.3% | 33.0ms | 0.3% | 33.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.3% | 30.0ms | 0.3% | 30.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 0.2% | 27.7ms | 0.2% | 27.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 0.2% | 26.4ms | 0.0% | 784us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.2% | 23.4ms | 0.0% | 4.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.2% | 23.2ms | 0.0% | 4.8ms | `anonymous` | `[native code]` |
| 0.2% | 21.9ms | 0.2% | 21.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.2% | 21.7ms | 0.2% | 21.7ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.2% | 21.5ms | 0.0% | 0us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:675` |
| 0.2% | 20.5ms | 0.2% | 19.8ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:523` |
| 0.1% | 16.2ms | 0.1% | 16.2ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.1% | 15.5ms | 0.0% | 740us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:631` |
| 0.1% | 12.5ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:694` |
| 0.1% | 11.2ms | 0.1% | 11.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.1% | 11.0ms | 0.1% | 11.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` |
| 0.1% | 10.6ms | 0.1% | 10.6ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.1% | 10.4ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` |
| 0.1% | 10.1ms | 0.0% | 1.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.0% | 9.2ms | 0.0% | 9.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` |
| 0.0% | 8.5ms | 0.0% | 823us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` |
| 0.0% | 8.5ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` |
| 0.0% | 7.7ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:608` |
| 0.0% | 7.3ms | 0.0% | 7.3ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:253` |
| 0.0% | 6.9ms | 0.0% | 6.9ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:303` |
| 0.0% | 6.3ms | 0.0% | 4.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 0.0% | 6.2ms | 0.0% | 779us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.0% | 6.2ms | 0.0% | 6.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:600` |
| 0.0% | 6.1ms | 0.0% | 6.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` |
| 0.0% | 6.1ms | 0.0% | 6.1ms | `push` | `[native code]` |
| 0.0% | 5.8ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` |
| 0.0% | 5.4ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.0% | 5.0ms | 0.0% | 5.0ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:53` |
| 0.0% | 4.7ms | 0.0% | 4.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` |
| 0.0% | 4.7ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` |
| 0.0% | 4.6ms | 0.0% | 4.6ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 4.6ms | 0.0% | 4.6ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 4.5ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` |
| 0.0% | 4.0ms | 0.0% | 3.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:688` |
| 0.0% | 3.9ms | 0.0% | 2.4ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:524` |
| 0.0% | 3.7ms | 0.0% | 3.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:704` |
| 0.0% | 3.5ms | 0.0% | 3.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` |
| 0.0% | 3.2ms | 0.0% | 3.2ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:525` |
| 0.0% | 2.9ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:692` |
| 0.0% | 2.8ms | 0.0% | 0us | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:372` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `every` | `[native code]` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `abs` | `[native code]` |
| 0.0% | 2.4ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 2.4ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 2.4ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 2.3ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 2.3ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 2.3ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 2.3ms | 0.0% | 702us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:305` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 2.3ms | 0.0% | 821us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:590` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:554` |
| 0.0% | 2.2ms | 0.0% | 830us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 2.1ms | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:427` |
| 0.0% | 2.1ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:668` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:274` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.6ms | 0.0% | 848us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:50` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:264` |
| 0.0% | 1.5ms | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 1.5ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 1.5ms | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:269` |
| 0.0% | 1.4ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:581` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `reduce` | `[native code]` |
| 0.0% | 1.2ms | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:306` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` |
| 0.0% | 925us | 0.0% | 925us | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:40` |
| 0.0% | 915us | 0.0% | 915us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.0% | 913us | 0.0% | 913us | `filter` | `[native code]` |
| 0.0% | 913us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:466` |
| 0.0% | 911us | 0.0% | 911us | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:235` |
| 0.0% | 899us | 0.0% | 899us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:252` |
| 0.0% | 894us | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 892us | 0.0% | 892us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:479` |
| 0.0% | 880us | 0.0% | 880us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 856us | 0.0% | 0us | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:58` |
| 0.0% | 853us | 0.0% | 853us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:116` |
| 0.0% | 838us | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:714` |
| 0.0% | 816us | 0.0% | 816us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` |
| 0.0% | 777us | 0.0% | 777us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 772us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:462` |
| 0.0% | 772us | 0.0% | 772us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:464` |
| 0.0% | 769us | 0.0% | 769us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:708` |
| 0.0% | 769us | 0.0% | 769us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` |
| 0.0% | 768us | 0.0% | 768us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:50` |
| 0.0% | 766us | 0.0% | 766us | `max` | `[native code]` |
| 0.0% | 758us | 0.0% | 758us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:166` |
| 0.0% | 752us | 0.0% | 752us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` |
| 0.0% | 720us | 0.0% | 720us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.0% | 700us | 0.0% | 700us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:713` |
| 0.0% | 687us | 0.0% | 687us | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 686us | 0.0% | 686us | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 670us | 0.0% | 0us | `internal:primordials` | `internal:primordials:51` |
| 0.0% | 670us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 670us | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 670us | 0.0% | 670us | `createSafeIterator` | `internal:primordials:3` |
| 0.0% | 670us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 661us | 0.0% | 661us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:707` |
| 0.0% | 658us | 0.0% | 658us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:309` |
| 0.0% | 652us | 0.0% | 652us | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 645us | 0.0% | 645us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:690` |
| 0.0% | 642us | 0.0% | 642us | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 635us | 0.0% | 0us | `internal:streams/destroy` | `internal:streams/destroy:2` |
| 0.0% | 627us | 0.0% | 627us | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 624us | 0.0% | 624us | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:289` |

## Function Details

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` | Self: 39.5% (3.70s) | Total: 41.3% (3.87s) | Samples: 4806

**Called by:**
- `step` (5020)

**Calls:**
- `hypot` (214)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:646` | Self: 19.0% (1.78s) | Total: 19.0% (1.78s) | Samples: 2334

**Called by:**
- `runTrial` (2325)
- `runTrial` (9)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` | Self: 4.8% (452.5ms) | Total: 4.9% (463.3ms) | Samples: 588

**Called by:**
- `step` (602)

**Calls:**
- `createZeroVector` (10)
- `fill` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` | Self: 3.9% (368.8ms) | Total: 4.3% (408.5ms) | Samples: 484

**Called by:**
- `runTrial` (532)
- `runTrial` (4)

**Calls:**
- `createZeroMatrix` (34)
- `from` (12)
- `createZeroMatrix` (6)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` | Self: 3.8% (358.9ms) | Total: 4.2% (397.6ms) | Samples: 469

**Called by:**
- `step` (520)

**Calls:**
- `from` (50)
- `createZeroMatrix` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` | Self: 3.3% (315.1ms) | Total: 3.4% (321.0ms) | Samples: 410

**Called by:**
- `step` (361)
- `step` (57)

**Calls:**
- `createZeroVector` (5)
- `fill` (3)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` | Self: 2.5% (236.9ms) | Total: 2.6% (243.7ms) | Samples: 302

**Called by:**
- `step` (279)
- `step` (32)

**Calls:**
- `fill` (5)
- `createZeroVector` (4)

### `map`
`[native code]` | Self: 2.4% (233.9ms) | Total: 5.1% (485.5ms) | Samples: 296

**Called by:**
- `cloneMatrix` (150)
- `step` (122)
- `step` (107)
- `step` (81)
- `(anonymous)` (75)
- `(anonymous)` (25)
- `jacobiEigenSymmetric` (11)
- `step` (10)
- `step` (10)
- `step` (8)
- `step` (8)
- `jacobiEigenSymmetric` (6)
- `step` (4)
- `jacobiEigenSymmetric` (3)
- `map` (2)
- `alignProjectionBasis` (2)
- `alignProjectionBasis` (1)

**Calls:**
- `(anonymous)` (120)
- `(anonymous)` (86)
- `(anonymous)` (52)
- `(anonymous)` (36)
- `(anonymous)` (30)
- `abs` (3)
- `map` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:684` | Self: 2.0% (188.1ms) | Total: 2.0% (188.1ms) | Samples: 246

**Called by:**
- `runTrial` (244)
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` | Self: 1.9% (178.7ms) | Total: 1.9% (178.7ms) | Samples: 232

**Called by:**
- `runTrial` (231)
- `runTrial` (1)

### `hypot`
`[native code]` | Self: 1.8% (169.0ms) | Total: 1.8% (169.0ms) | Samples: 214

**Called by:**
- `jacobiEigenSymmetric` (214)

### `fill`
`[native code]` | Self: 1.4% (135.6ms) | Total: 1.4% (135.6ms) | Samples: 181

**Called by:**
- `sampleGaussianVectorND` (89)
- `ellipsoidObjective` (54)
- `from` (26)
- `whitenWithEigensystem` (5)
- `transformFromEigenCoordinates` (4)
- `whitenWithEigensystem` (3)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.4% (134.4ms) | Total: 2.1% (201.1ms) | Samples: 178

**Called by:**
- `step` (267)

**Calls:**
- `fill` (89)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:655` | Self: 1.3% (126.8ms) | Total: 1.3% (126.8ms) | Samples: 164

**Called by:**
- `runTrial` (164)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 0.9% (92.5ms) | Total: 0.9% (92.5ms) | Samples: 120

**Called by:**
- `map` (120)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` | Self: 0.6% (63.6ms) | Total: 0.6% (63.6ms) | Samples: 86

**Called by:**
- `projectTo3D` (86)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.6% (56.6ms) | Total: 0.6% (56.6ms) | Samples: 72

**Called by:**
- `map` (52)
- `some` (20)

### `some`
`[native code]` | Self: 0.5% (48.0ms) | Total: 1.3% (127.4ms) | Samples: 63

**Called by:**
- `validateSquareFiniteMatrix` (82)
- `(anonymous)` (80)
- `projectTo3D` (2)
- `some` (1)

**Calls:**
- `(anonymous)` (81)
- `(anonymous)` (20)
- `some` (1)

### `sort`
`[native code]` | Self: 0.4% (41.9ms) | Total: 0.4% (45.2ms) | Samples: 53

**Called by:**
- `jacobiEigenSymmetric` (32)
- `step` (25)

**Calls:**
- `(anonymous)` (3)
- `(anonymous)` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:545` | Self: 0.4% (40.2ms) | Total: 0.4% (40.2ms) | Samples: 53

**Called by:**
- `step` (53)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` | Self: 0.4% (38.6ms) | Total: 0.4% (38.6ms) | Samples: 50

**Called by:**
- `step` (50)

### `from`
`[native code]` | Self: 0.4% (38.2ms) | Total: 1.1% (103.6ms) | Samples: 50

**Called by:**
- `reconstructSymmetric` (50)
- `createZeroMatrix` (34)
- `jacobiEigenSymmetric` (29)
- `step` (12)
- `jacobiEigenSymmetric` (9)
- `runTrial` (1)
- `CMAESOptimizerND` (1)

**Calls:**
- `(anonymous)` (43)
- `fill` (26)
- `(anonymous)` (15)
- `(anonymous)` (1)
- `(anonymous)` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` | Self: 0.3% (34.4ms) | Total: 0.3% (34.4ms) | Samples: 44

**Called by:**
- `step` (44)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.3% (33.8ms) | Total: 0.5% (55.9ms) | Samples: 44

**Called by:**
- `step` (73)

**Calls:**
- `from` (29)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.3% (33.0ms) | Total: 0.3% (33.0ms) | Samples: 43

**Called by:**
- `from` (43)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` | Self: 0.3% (32.5ms) | Total: 0.3% (33.2ms) | Samples: 42

**Called by:**
- `runTrial` (43)

**Calls:**
- `adaptationPoint` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` | Self: 0.3% (30.0ms) | Total: 0.3% (30.0ms) | Samples: 41

**Called by:**
- `step` (41)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` | Self: 0.2% (27.7ms) | Total: 0.2% (27.7ms) | Samples: 36

**Called by:**
- `map` (36)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` | Self: 0.2% (24.3ms) | Total: 0.6% (64.7ms) | Samples: 32

**Called by:**
- `step` (86)

**Calls:**
- `fill` (54)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` | Self: 0.2% (22.8ms) | Total: 1.2% (119.4ms) | Samples: 30

**Called by:**
- `forEach` (158)

**Calls:**
- `projectTo3D` (89)
- `projectTo3D` (26)
- `projectTo3D` (5)
- `projectTo3D` (4)
- `projectTo3D` (4)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` | Self: 0.2% (21.9ms) | Total: 0.2% (21.9ms) | Samples: 30

**Called by:**
- `map` (30)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.2% (21.7ms) | Total: 0.2% (21.7ms) | Samples: 29

**Called by:**
- `step` (13)
- `step` (12)
- `(anonymous)` (4)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:523` | Self: 0.2% (19.8ms) | Total: 0.2% (20.5ms) | Samples: 26

**Called by:**
- `(anonymous)` (26)
- `step` (1)

**Calls:**
- `requireFiniteVector` (1)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` | Self: 0.1% (16.2ms) | Total: 0.1% (16.2ms) | Samples: 21

**Called by:**
- `transformFromEigenCoordinates` (10)
- `whitenWithEigensystem` (5)
- `whitenWithEigensystem` (4)
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:564` | Self: 0.1% (11.5ms) | Total: 0.8% (77.1ms) | Samples: 15

**Called by:**
- `runTrial` (101)
- `runTrial` (1)

**Calls:**
- `ellipsoidObjective` (86)
- `ellipsoidObjective` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.1% (11.2ms) | Total: 0.1% (11.2ms) | Samples: 15

**Called by:**
- `from` (15)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` | Self: 0.1% (11.0ms) | Total: 0.1% (11.0ms) | Samples: 15

**Called by:**
- `runTrial` (15)

### `vecDot`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.1% (10.6ms) | Total: 0.1% (10.6ms) | Samples: 14

**Called by:**
- `step` (13)
- `vecNorm` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` | Self: 0.0% (9.2ms) | Total: 0.0% (9.2ms) | Samples: 11

**Called by:**
- `runTrial` (11)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` | Self: 0.0% (8.2ms) | Total: 1.1% (106.0ms) | Samples: 6

**Called by:**
- `runTrial` (128)

**Calls:**
- `map` (122)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:621` | Self: 0.0% (8.0ms) | Total: 0.6% (64.9ms) | Samples: 11

**Called by:**
- `map` (86)

**Calls:**
- `map` (75)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:253` | Self: 0.0% (7.3ms) | Total: 0.0% (7.3ms) | Samples: 9

**Called by:**
- `step` (9)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:303` | Self: 0.0% (6.9ms) | Total: 0.0% (6.9ms) | Samples: 9

**Called by:**
- `step` (9)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:533` | Self: 0.0% (6.2ms) | Total: 0.7% (69.9ms) | Samples: 8

**Called by:**
- `(anonymous)` (89)
- `step` (3)
- `step` (2)

**Calls:**
- `coordinate` (86)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:600` | Self: 0.0% (6.2ms) | Total: 0.0% (6.2ms) | Samples: 8

**Called by:**
- `runTrial` (8)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` | Self: 0.0% (6.1ms) | Total: 0.0% (6.1ms) | Samples: 8

**Called by:**
- `runTrial` (8)

### `push`
`[native code]` | Self: 0.0% (6.1ms) | Total: 0.0% (6.1ms) | Samples: 8

**Called by:**
- `step` (7)
- `step` (1)

### `vecDot`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:53` | Self: 0.0% (5.0ms) | Total: 0.0% (5.0ms) | Samples: 7

**Called by:**
- `step` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` | Self: 0.0% (4.8ms) | Total: 0.0% (6.3ms) | Samples: 6

**Called by:**
- `runTrial` (8)

**Calls:**
- `vecNorm` (1)
- `vecNorm` (1)

### `anonymous`
`[native code]` | Self: 0.0% (4.8ms) | Total: 0.2% (23.2ms) | Samples: 6

**Called by:**
- `(anonymous)` (4)
- `internal:fs/streams` (3)
- `get WriteStream` (3)
- `node:fs/promises` (3)
- `node:stream` (3)
- `node:fs` (3)
- `internal:stream` (2)
- `internal:streams/pipeline` (2)
- `internal:streams/compose` (2)
- `internal:streams/destroy` (1)
- `node:events` (1)
- `internal:validators` (1)
- `internal:shared` (1)
- `internal:streams/duplex` (1)

**Calls:**
- `internal:fs/streams` (3)
- `node:fs/promises` (3)
- `node:stream` (3)
- `node:fs` (3)
- `internal:streams/pipeline` (2)
- `internal:stream` (2)
- `internal:streams/compose` (2)
- `internal:streams/destroy` (1)
- `node:events` (1)
- `internal:validators` (1)
- `internal:shared` (1)
- `internal:streams/duplex` (1)
- `internal:primordials` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` | Self: 0.0% (4.7ms) | Total: 0.0% (4.7ms) | Samples: 6

**Called by:**
- `runTrial` (6)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (4.6ms) | Total: 0.0% (4.6ms) | Samples: 6

**Called by:**
- `step` (5)
- `step` (1)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (4.6ms) | Total: 0.0% (4.6ms) | Samples: 6

**Called by:**
- `step` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` | Self: 0.0% (4.0ms) | Total: 0.2% (23.4ms) | Samples: 5

**Called by:**
- `runTrial` (30)

**Calls:**
- `sort` (25)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:704` | Self: 0.0% (3.7ms) | Total: 0.0% (3.7ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` | Self: 0.0% (3.5ms) | Total: 0.0% (3.5ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` | Self: 0.0% (3.3ms) | Total: 2.3% (221.1ms) | Samples: 5

**Called by:**
- `runTrial` (292)
- `runTrial` (2)

**Calls:**
- `sampleGaussianVectorND` (267)
- `sampleGaussianVectorND` (9)
- `push` (7)
- `sampleGaussianVectorND` (3)
- `sampleGaussianVectorND` (2)
- `sampleGaussianVectorND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:688` | Self: 0.0% (3.3ms) | Total: 0.0% (4.0ms) | Samples: 4

**Called by:**
- `runTrial` (5)

**Calls:**
- `radius` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:525` | Self: 0.0% (3.2ms) | Total: 0.0% (3.2ms) | Samples: 4

**Called by:**
- `(anonymous)` (4)

### `every`
`[native code]` | Self: 0.0% (2.8ms) | Total: 0.0% (2.8ms) | Samples: 2

**Called by:**
- `requireFiniteVector` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (2.8ms) | Total: 0.0% (2.8ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:524` | Self: 0.0% (2.4ms) | Total: 0.0% (3.9ms) | Samples: 3

**Called by:**
- `(anonymous)` (5)

**Calls:**
- `some` (2)

### `abs`
`[native code]` | Self: 0.0% (2.4ms) | Total: 0.0% (2.4ms) | Samples: 3

**Called by:**
- `map` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` | Self: 0.0% (2.3ms) | Total: 0.0% (8.5ms) | Samples: 3

**Called by:**
- `runTrial` (11)

**Calls:**
- `map` (8)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 3

**Called by:**
- `sort` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:692` | Self: 0.0% (2.2ms) | Total: 0.0% (2.9ms) | Samples: 3

**Called by:**
- `runTrial` (4)

**Calls:**
- `variancePercent` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:554` | Self: 0.0% (2.2ms) | Total: 0.0% (2.2ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` | Self: 0.0% (2.2ms) | Total: 0.0% (2.2ms) | Samples: 3

**Called by:**
- `step` (3)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (2.0ms) | Total: 0.0% (2.0ms) | Samples: 3

**Called by:**
- `step` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` | Self: 0.0% (1.7ms) | Total: 0.0% (1.7ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` | Self: 0.0% (1.7ms) | Total: 0.0% (1.7ms) | Samples: 2

**Called by:**
- `step` (2)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.7ms) | Total: 0.0% (1.7ms) | Samples: 2

**Called by:**
- `step` (2)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:274` | Self: 0.0% (1.7ms) | Total: 0.0% (1.7ms) | Samples: 2

**Called by:**
- `step` (2)

### `nextOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 2

**Called by:**
- `sampleGaussianVectorND` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` | Self: 0.0% (1.5ms) | Total: 0.8% (82.7ms) | Samples: 2

**Called by:**
- `runTrial` (109)

**Calls:**
- `map` (107)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:264` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `step` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.0% (1.5ms) | Total: 0.1% (10.1ms) | Samples: 2

**Called by:**
- `step` (13)

**Calls:**
- `map` (11)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:269` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `step` (2)

### `reduce`
`[native code]` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:668` | Self: 0.0% (1.3ms) | Total: 0.0% (2.1ms) | Samples: 2

**Called by:**
- `runTrial` (3)

**Calls:**
- `max` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:40` | Self: 0.0% (925us) | Total: 0.0% (925us) | Samples: 1

**Called by:**
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` | Self: 0.0% (915us) | Total: 0.0% (915us) | Samples: 1

**Called by:**
- `sort` (1)

### `filter`
`[native code]` | Self: 0.0% (913us) | Total: 0.0% (913us) | Samples: 1

**Called by:**
- `CMAESOptimizerND` (1)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:235` | Self: 0.0% (911us) | Total: 0.0% (911us) | Samples: 1

**Called by:**
- `step` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:252` | Self: 0.0% (899us) | Total: 0.0% (899us) | Samples: 1

**Called by:**
- `step` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:479` | Self: 0.0% (892us) | Total: 0.0% (892us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (880us) | Total: 0.0% (880us) | Samples: 1

**Called by:**
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:116` | Self: 0.0% (853us) | Total: 0.0% (853us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:663` | Self: 0.0% (850us) | Total: 4.2% (400.0ms) | Samples: 1

**Called by:**
- `runTrial` (522)
- `runTrial` (1)

**Calls:**
- `reconstructSymmetric` (520)
- `reconstructSymmetric` (1)
- `reconstructSymmetric` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:50` | Self: 0.0% (848us) | Total: 0.0% (1.6ms) | Samples: 1

**Called by:**
- `(module)` (2)

**Calls:**
- `from` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` | Self: 0.0% (830us) | Total: 0.0% (2.2ms) | Samples: 1

**Called by:**
- `runTrial` (3)

**Calls:**
- `reduce` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` | Self: 0.0% (823us) | Total: 0.0% (8.5ms) | Samples: 1

**Called by:**
- `runTrial` (11)

**Calls:**
- `map` (10)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:590` | Self: 0.0% (821us) | Total: 0.0% (2.3ms) | Samples: 1

**Called by:**
- `runTrial` (3)

**Calls:**
- `createZeroVector` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` | Self: 0.0% (816us) | Total: 0.0% (816us) | Samples: 1

**Called by:**
- `forEach` (1)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.0% (784us) | Total: 0.2% (26.4ms) | Samples: 1

**Called by:**
- `step` (34)
- `reconstructSymmetric` (1)

**Calls:**
- `from` (34)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` | Self: 0.0% (779us) | Total: 0.0% (6.2ms) | Samples: 1

**Calls:**
- `(anonymous)` (7)

### `adaptationPoint`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (777us) | Total: 0.0% (777us) | Samples: 1

**Called by:**
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:464` | Self: 0.0% (772us) | Total: 0.0% (772us) | Samples: 1

**Called by:**
- `from` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:708` | Self: 0.0% (769us) | Total: 0.0% (769us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` | Self: 0.0% (769us) | Total: 0.0% (769us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:50` | Self: 0.0% (768us) | Total: 0.0% (768us) | Samples: 1

**Called by:**
- `from` (1)

### `max`
`[native code]` | Self: 0.0% (766us) | Total: 0.0% (766us) | Samples: 1

**Called by:**
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:166` | Self: 0.0% (758us) | Total: 0.0% (758us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` | Self: 0.0% (752us) | Total: 0.0% (752us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:631` | Self: 0.0% (740us) | Total: 0.1% (15.5ms) | Samples: 1

**Called by:**
- `runTrial` (20)
- `runTrial` (1)

**Calls:**
- `vecDot` (13)
- `vecDot` (7)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` | Self: 0.0% (720us) | Total: 0.0% (720us) | Samples: 1

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:305` | Self: 0.0% (702us) | Total: 0.0% (2.3ms) | Samples: 1

**Called by:**
- `step` (3)

**Calls:**
- `nextOpenUnit` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:713` | Self: 0.0% (700us) | Total: 0.0% (700us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `vecNorm`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (687us) | Total: 0.0% (687us) | Samples: 1

**Called by:**
- `step` (1)

### `variancePercent`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (686us) | Total: 0.0% (686us) | Samples: 1

**Called by:**
- `step` (1)

### `forEach`
`[native code]` | Self: 0.0% (683us) | Total: 1.5% (142.4ms) | Samples: 1

**Called by:**
- `step` (183)
- `step` (2)

**Calls:**
- `(anonymous)` (158)
- `(anonymous)` (25)
- `(anonymous)` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` | Self: 0.0% (675us) | Total: 0.3% (33.5ms) | Samples: 1

**Called by:**
- `step` (42)

**Calls:**
- `sort` (32)
- `from` (9)

### `createSafeIterator`
`internal:primordials:3` | Self: 0.0% (670us) | Total: 0.0% (670us) | Samples: 1

**Called by:**
- `internal:primordials` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:707` | Self: 0.0% (661us) | Total: 0.0% (661us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:309` | Self: 0.0% (658us) | Total: 0.0% (658us) | Samples: 1

**Called by:**
- `step` (1)

### `radius`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (652us) | Total: 0.0% (652us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:690` | Self: 0.0% (645us) | Total: 0.0% (645us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `nextHalfOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (642us) | Total: 0.0% (642us) | Samples: 1

**Called by:**
- `sampleGaussianVectorND` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (639us) | Total: 0.6% (62.4ms) | Samples: 1

**Called by:**
- `some` (81)

**Calls:**
- `some` (80)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (627us) | Total: 0.0% (627us) | Samples: 1

**Called by:**
- `step` (1)

### `nextHalfOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:289` | Self: 0.0% (624us) | Total: 0.0% (624us) | Samples: 1

**Called by:**
- `sampleGaussianVectorND` (1)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (894us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:608` | Self: 0.0% (0us) | Total: 0.0% (7.7ms) | Samples: 0

**Called by:**
- `runTrial` (10)

**Calls:**
- `map` (10)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` | Self: 0.0% (0us) | Total: 0.0% (4.5ms) | Samples: 0

**Called by:**
- `step` (6)

**Calls:**
- `map` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` | Self: 0.0% (0us) | Total: 0.0% (5.8ms) | Samples: 0

**Called by:**
- `runTrial` (8)

**Calls:**
- `map` (8)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:626` | Self: 0.0% (0us) | Total: 5.4% (506.0ms) | Samples: 0

**Called by:**
- `runTrial` (646)
- `runTrial` (5)

**Calls:**
- `whitenWithEigensystem` (361)
- `whitenWithEigensystem` (279)
- `whitenWithEigensystem` (5)
- `whitenWithEigensystem` (2)
- `whitenWithEigensystem` (2)
- `whitenWithEigensystem` (2)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (670us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `vecNorm`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:58` | Self: 0.0% (0us) | Total: 0.0% (856us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `vecDot` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:581` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `runTrial` (2)

**Calls:**
- `forEach` (2)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` | Self: 0.0% (0us) | Total: 99.3% (9.31s) | Samples: 0

**Called by:**
- `(module)` (11304)
- `(module)` (796)

**Calls:**
- `step` (5353)
- `step` (2325)
- `step` (646)
- `step` (617)
- `step` (532)
- `step` (522)
- `step` (292)
- `step` (244)
- `step` (231)
- `step` (182)
- `step` (164)
- `step` (159)
- `step` (128)
- `step` (109)
- `step` (101)
- `step` (90)
- `step` (80)
- `step` (53)
- `step` (43)
- `step` (30)
- `step` (20)
- `step` (17)
- `step` (15)
- `step` (14)
- `step` (11)
- `step` (11)
- `step` (11)
- `step` (10)
- `step` (8)
- `step` (8)
- `step` (8)
- `step` (8)
- `step` (6)
- `step` (5)
- `step` (5)
- `step` (5)
- `step` (4)
- `step` (4)
- `step` (3)
- `step` (3)
- `step` (3)
- `step` (3)
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
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` | Self: 0.0% (0us) | Total: 1.5% (140.9ms) | Samples: 0

**Called by:**
- `runTrial` (182)
- `runTrial` (1)

**Calls:**
- `forEach` (183)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (0us) | Total: 0.6% (63.2ms) | Samples: 0

**Called by:**
- `jacobiEigenSymmetric` (82)

**Calls:**
- `some` (82)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:427` | Self: 0.0% (0us) | Total: 0.0% (2.1ms) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `requireFiniteVector` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` | Self: 0.0% (0us) | Total: 0.7% (68.1ms) | Samples: 0

**Called by:**
- `runTrial` (90)

**Calls:**
- `whitenWithEigensystem` (57)
- `whitenWithEigensystem` (32)
- `whitenWithEigensystem` (1)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (2.4ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (2.3ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` | Self: 0.0% (0us) | Total: 0.0% (4.7ms) | Samples: 0

**Called by:**
- `(module)` (3)
- `(module)` (1)

**Calls:**
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:537` | Self: 0.0% (0us) | Total: 0.4% (43.7ms) | Samples: 0

**Called by:**
- `step` (57)

**Calls:**
- `cloneMatrix` (55)
- `map` (2)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (670us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` | Self: 0.0% (0us) | Total: 0.0% (2.4ms) | Samples: 0

**Called by:**
- `step` (3)

**Calls:**
- `map` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:694` | Self: 0.0% (0us) | Total: 0.1% (12.5ms) | Samples: 0

**Called by:**
- `runTrial` (17)

**Calls:**
- `projectTo3D` (13)
- `projectTo3D` (3)
- `projectTo3D` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:672` | Self: 0.0% (0us) | Total: 1.3% (123.0ms) | Samples: 0

**Called by:**
- `runTrial` (159)

**Calls:**
- `alignProjectionBasis` (57)
- `alignProjectionBasis` (53)
- `alignProjectionBasis` (47)
- `alignProjectionBasis` (2)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` | Self: 0.0% (0us) | Total: 6.6% (624.8ms) | Samples: 0

**Calls:**
- `runTrial` (796)
- `runTrial` (7)
- `runTrial` (2)
- `runTrial` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:466` | Self: 0.0% (0us) | Total: 0.0% (913us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `filter` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` | Self: 0.0% (0us) | Total: 0.6% (63.2ms) | Samples: 0

**Called by:**
- `step` (82)

**Calls:**
- `validateSquareFiniteMatrix` (82)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:714` | Self: 0.0% (0us) | Total: 0.0% (838us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `push` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` | Self: 0.0% (0us) | Total: 0.3% (37.3ms) | Samples: 0

**Called by:**
- `step` (47)

**Calls:**
- `cloneMatrix` (46)
- `map` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:620` | Self: 0.0% (0us) | Total: 0.6% (61.3ms) | Samples: 0

**Called by:**
- `runTrial` (80)
- `runTrial` (1)

**Calls:**
- `map` (81)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (2.4ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:306` | Self: 0.0% (0us) | Total: 0.0% (1.2ms) | Samples: 0

**Called by:**
- `step` (2)

**Calls:**
- `nextHalfOpenUnit` (1)
- `nextHalfOpenUnit` (1)

### `internal:streams/destroy`
`internal:streams/destroy:2` | Self: 0.0% (0us) | Total: 0.0% (635us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` | Self: 0.0% (0us) | Total: 44.3% (4.15s) | Samples: 0

**Called by:**
- `runTrial` (5353)
- `runTrial` (29)

**Calls:**
- `jacobiEigenSymmetric` (5020)
- `jacobiEigenSymmetric` (82)
- `jacobiEigenSymmetric` (73)
- `jacobiEigenSymmetric` (50)
- `jacobiEigenSymmetric` (44)
- `jacobiEigenSymmetric` (42)
- `jacobiEigenSymmetric` (41)
- `jacobiEigenSymmetric` (13)
- `jacobiEigenSymmetric` (6)
- `jacobiEigenSymmetric` (3)
- `jacobiEigenSymmetric` (3)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (5.4ms) | Samples: 0

**Called by:**
- `(module)` (7)

**Calls:**
- `anonymous` (4)
- `get WriteStream` (3)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (2.3ms) | Samples: 0

**Called by:**
- `(anonymous)` (3)

**Calls:**
- `anonymous` (3)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 0.0% (0us) | Total: 1.2% (116.7ms) | Samples: 0

**Called by:**
- `alignProjectionBasis` (55)
- `step` (49)
- `alignProjectionBasis` (46)

**Calls:**
- `map` (150)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` | Self: 0.0% (0us) | Total: 5.0% (475.1ms) | Samples: 0

**Called by:**
- `runTrial` (617)

**Calls:**
- `transformFromEigenCoordinates` (602)
- `transformFromEigenCoordinates` (9)
- `transformFromEigenCoordinates` (3)
- `transformFromEigenCoordinates` (2)
- `transformFromEigenCoordinates` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:675` | Self: 0.0% (0us) | Total: 0.2% (21.5ms) | Samples: 0

**Called by:**
- `forEach` (25)

**Calls:**
- `map` (25)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (2.3ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` | Self: 0.0% (0us) | Total: 0.1% (10.4ms) | Samples: 0

**Called by:**
- `runTrial` (14)

**Calls:**
- `projectTo3D` (12)
- `projectTo3D` (2)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` | Self: 0.0% (0us) | Total: 0.4% (43.6ms) | Samples: 0

**Called by:**
- `(module)` (50)
- `(module)` (7)

**Calls:**
- `step` (29)
- `step` (9)
- `step` (5)
- `step` (4)
- `step` (2)
- `step` (2)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)

### `requireFiniteVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:372` | Self: 0.0% (0us) | Total: 0.0% (2.8ms) | Samples: 0

**Called by:**
- `projectTo3D` (1)
- `CMAESOptimizerND` (1)

**Calls:**
- `every` (2)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:462` | Self: 0.0% (0us) | Total: 0.0% (772us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `from` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` | Self: 0.0% (0us) | Total: 93.2% (8.73s) | Samples: 0

**Calls:**
- `runTrial` (11304)
- `runTrial` (50)
- `runTrial` (3)

### `internal:primordials`
`internal:primordials:51` | Self: 0.0% (0us) | Total: 0.0% (670us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `createSafeIterator` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:702` | Self: 0.0% (0us) | Total: 0.4% (41.1ms) | Samples: 0

**Called by:**
- `runTrial` (53)

**Calls:**
- `cloneMatrix` (49)
- `map` (4)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (670us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 92.3% | 8.65s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 7.3% | 687.0ms | `[native code]` |
| 0.3% | 28.3ms | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.0% | 670us | `internal:primordials` |
