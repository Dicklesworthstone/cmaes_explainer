# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 9.51s | 12319 | 500us | 170 |

**Top 10:** `jacobiEigenSymmetric` 39.7%, `step` 19.2%, `transformFromEigenCoordinates` 4.7%, `step` 3.8%, `reconstructSymmetric` 3.8%, `whitenWithEigensystem` 3.3%, `map` 2.4%, `whitenWithEigensystem` 2.2%, `step` 2.0%, `step` 1.8%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 39.7% | 3.78s | 41.3% | 3.93s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 19.2% | 1.82s | 19.2% | 1.82s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 4.7% | 451.3ms | 4.8% | 463.3ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 3.8% | 370.5ms | 4.4% | 422.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` |
| 3.8% | 361.6ms | 4.3% | 415.8ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` |
| 3.3% | 314.6ms | 3.3% | 321.2ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 2.4% | 232.9ms | 4.8% | 457.0ms | `map` | `[native code]` |
| 2.2% | 213.6ms | 2.3% | 221.0ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` |
| 2.0% | 196.7ms | 2.0% | 196.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:677` |
| 1.8% | 177.7ms | 1.8% | 177.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:652` |
| 1.7% | 169.6ms | 1.7% | 169.6ms | `fill` | `[native code]` |
| 1.5% | 149.6ms | 1.5% | 149.6ms | `hypot` | `[native code]` |
| 1.5% | 143.2ms | 1.5% | 143.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:648` |
| 1.2% | 119.2ms | 2.1% | 200.6ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.9% | 88.4ms | 0.9% | 88.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.8% | 81.8ms | 0.8% | 81.8ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` |
| 0.8% | 79.9ms | 0.8% | 79.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.6% | 63.1ms | 0.9% | 85.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.5% | 49.3ms | 0.5% | 49.3ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:545` |
| 0.4% | 46.2ms | 1.4% | 141.2ms | `from` | `[native code]` |
| 0.4% | 46.1ms | 0.4% | 46.1ms | `Float64Array` | `[native code]` |
| 0.4% | 41.7ms | 0.7% | 73.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.4% | 39.3ms | 1.0% | 104.3ms | `some` | `[native code]` |
| 0.3% | 36.0ms | 0.3% | 36.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.3% | 35.3ms | 0.4% | 44.4ms | `sort` | `[native code]` |
| 0.3% | 34.6ms | 0.3% | 34.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` |
| 0.2% | 27.4ms | 0.2% | 27.4ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.2% | 26.9ms | 0.2% | 26.9ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:303` |
| 0.2% | 25.6ms | 0.6% | 65.0ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.2% | 23.0ms | 1.5% | 144.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:669` |
| 0.2% | 19.2ms | 0.2% | 19.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.2% | 19.1ms | 0.2% | 20.7ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:523` |
| 0.1% | 18.3ms | 0.1% | 18.3ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.1% | 15.0ms | 0.1% | 15.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:640` |
| 0.0% | 8.4ms | 0.0% | 8.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 7.7ms | 0.0% | 7.7ms | `push` | `[native code]` |
| 0.0% | 7.0ms | 0.0% | 7.0ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:253` |
| 0.0% | 6.9ms | 0.0% | 6.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:625` |
| 0.0% | 6.7ms | 0.9% | 90.2ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:533` |
| 0.0% | 6.2ms | 0.0% | 6.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:707` |
| 0.0% | 5.7ms | 0.0% | 5.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` |
| 0.0% | 4.7ms | 0.0% | 4.7ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 4.5ms | 0.3% | 29.0ms | `anonymous` | `[native code]` |
| 0.0% | 4.5ms | 0.0% | 4.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:636` |
| 0.0% | 4.5ms | 0.7% | 70.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:564` |
| 0.0% | 4.4ms | 0.0% | 4.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 0.0% | 4.3ms | 0.0% | 4.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:701` |
| 0.0% | 4.2ms | 0.0% | 6.7ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:524` |
| 0.0% | 4.0ms | 0.0% | 4.0ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.9ms | 0.0% | 3.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` |
| 0.0% | 3.5ms | 0.0% | 3.5ms | `abs` | `[native code]` |
| 0.0% | 3.4ms | 0.0% | 3.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:696` |
| 0.0% | 3.3ms | 0.0% | 3.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.0% | 3.0ms | 0.0% | 6.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:624` |
| 0.0% | 2.9ms | 0.1% | 18.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.0% | 2.7ms | 1.7% | 166.2ms | `forEach` | `[native code]` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` |
| 0.0% | 2.4ms | 0.8% | 82.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.0% | 2.3ms | 0.9% | 89.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 0.0% | 2.3ms | 0.0% | 3.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:604` |
| 0.0% | 2.2ms | 2.5% | 238.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` |
| 0.0% | 2.1ms | 0.0% | 2.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:672` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:683` |
| 0.0% | 1.7ms | 0.1% | 10.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:609` |
| 0.0% | 1.6ms | 0.0% | 4.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:590` |
| 0.0% | 1.5ms | 0.2% | 19.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:668` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `every` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:685` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:40` |
| 0.0% | 1.4ms | 0.1% | 10.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.0% | 1.3ms | 0.5% | 55.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:614` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `max` | `[native code]` |
| 0.0% | 1.3ms | 0.3% | 33.3ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:537` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:554` |
| 0.0% | 911us | 0.0% | 911us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` |
| 0.0% | 905us | 0.0% | 905us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:191` |
| 0.0% | 888us | 0.0% | 7.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 0.0% | 867us | 0.0% | 867us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:427` |
| 0.0% | 861us | 0.0% | 8.2ms | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.0% | 850us | 0.9% | 90.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:599` |
| 0.0% | 840us | 0.0% | 840us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` |
| 0.0% | 822us | 0.5% | 51.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.0% | 822us | 0.0% | 822us | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 815us | 0.0% | 815us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:252` |
| 0.0% | 809us | 0.0% | 809us | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:233` |
| 0.0% | 806us | 0.0% | 806us | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:528` |
| 0.0% | 805us | 0.0% | 805us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:193` |
| 0.0% | 804us | 0.0% | 804us | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 772us | 0.0% | 772us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 0.0% | 772us | 0.0% | 772us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:422` |
| 0.0% | 756us | 0.0% | 756us | `internal:streams/destroy` | `internal:streams/destroy:16` |
| 0.0% | 742us | 0.0% | 742us | `createSafeIterator` | `internal:primordials:3` |
| 0.0% | 735us | 0.0% | 735us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:483` |
| 0.0% | 733us | 0.0% | 733us | `now` | `[native code]` |
| 0.0% | 731us | 0.0% | 731us | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:280` |
| 0.0% | 729us | 0.0% | 729us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:172` |
| 0.0% | 728us | 0.0% | 728us | `exp` | `[native code]` |
| 0.0% | 720us | 0.0% | 6.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` |
| 0.0% | 715us | 0.0% | 715us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` |
| 0.0% | 711us | 0.0% | 711us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:681` |
| 0.0% | 701us | 0.0% | 701us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 700us | 0.0% | 700us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:26` |
| 0.0% | 692us | 0.0% | 692us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 690us | 0.0% | 690us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:479` |
| 0.0% | 688us | 0.0% | 688us | `@lazy` | `[native code]` |
| 0.0% | 681us | 0.0% | 681us | `file` | `[native code]` |
| 0.0% | 679us | 0.0% | 679us | `filter` | `[native code]` |
| 0.0% | 676us | 4.9% | 472.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` |
| 0.0% | 658us | 0.0% | 658us | `reduce` | `[native code]` |
| 0.0% | 650us | 0.0% | 650us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 637us | 0.0% | 637us | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:525` |
| 0.0% | 636us | 4.3% | 417.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:656` |
| 0.0% | 636us | 0.0% | 636us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:150` |
| 0.0% | 627us | 0.0% | 627us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:426` |
| 0.0% | 626us | 0.0% | 626us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 99.3% | 9.45s | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 93.2% | 8.86s | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` |
| 44.4% | 4.22s | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:655` |
| 41.3% | 3.93s | 39.7% | 3.78s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 19.2% | 1.82s | 19.2% | 1.82s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 6.6% | 637.0ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` |
| 4.9% | 472.6ms | 0.0% | 676us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` |
| 4.8% | 463.3ms | 4.7% | 451.3ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 4.8% | 457.3ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:619` |
| 4.8% | 457.0ms | 2.4% | 232.9ms | `map` | `[native code]` |
| 4.4% | 422.1ms | 3.8% | 370.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` |
| 4.3% | 417.2ms | 0.0% | 636us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:656` |
| 4.3% | 415.8ms | 3.8% | 361.6ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` |
| 3.3% | 321.2ms | 3.3% | 314.6ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 2.5% | 238.2ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` |
| 2.3% | 221.0ms | 2.2% | 213.6ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` |
| 2.1% | 200.6ms | 1.2% | 119.2ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 2.0% | 196.7ms | 2.0% | 196.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:677` |
| 1.8% | 177.7ms | 1.8% | 177.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:652` |
| 1.7% | 169.6ms | 1.7% | 169.6ms | `fill` | `[native code]` |
| 1.7% | 166.2ms | 0.0% | 2.7ms | `forEach` | `[native code]` |
| 1.7% | 164.1ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:667` |
| 1.5% | 149.6ms | 1.5% | 149.6ms | `hypot` | `[native code]` |
| 1.5% | 144.5ms | 0.2% | 23.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:669` |
| 1.5% | 143.2ms | 1.5% | 143.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:648` |
| 1.4% | 141.2ms | 0.4% | 46.2ms | `from` | `[native code]` |
| 1.2% | 119.2ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` |
| 1.0% | 104.3ms | 0.4% | 39.3ms | `some` | `[native code]` |
| 1.0% | 102.2ms | 0.0% | 0us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.9% | 90.6ms | 0.0% | 850us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:599` |
| 0.9% | 90.2ms | 0.0% | 6.7ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:533` |
| 0.9% | 89.1ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 0.9% | 88.4ms | 0.9% | 88.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.9% | 85.9ms | 0.6% | 63.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.8% | 82.7ms | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.8% | 81.8ms | 0.8% | 81.8ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` |
| 0.8% | 79.9ms | 0.8% | 79.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.7% | 73.2ms | 0.4% | 41.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.7% | 70.9ms | 0.0% | 4.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:564` |
| 0.6% | 65.0ms | 0.2% | 25.6ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.6% | 57.4ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` |
| 0.5% | 55.5ms | 0.0% | 1.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:614` |
| 0.5% | 51.3ms | 0.0% | 822us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.5% | 51.3ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 0.5% | 51.3ms | 0.0% | 0us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.5% | 49.3ms | 0.5% | 49.3ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:545` |
| 0.4% | 46.1ms | 0.4% | 46.1ms | `Float64Array` | `[native code]` |
| 0.4% | 44.4ms | 0.3% | 35.3ms | `sort` | `[native code]` |
| 0.4% | 44.1ms | 0.0% | 0us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.4% | 41.5ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` |
| 0.4% | 41.3ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` |
| 0.3% | 36.0ms | 0.3% | 36.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.3% | 35.9ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` |
| 0.3% | 34.6ms | 0.3% | 34.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` |
| 0.3% | 33.3ms | 0.0% | 1.3ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:537` |
| 0.3% | 32.4ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.3% | 29.0ms | 0.0% | 4.5ms | `anonymous` | `[native code]` |
| 0.2% | 27.4ms | 0.2% | 27.4ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.2% | 26.9ms | 0.2% | 26.9ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:303` |
| 0.2% | 23.2ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 0.2% | 20.7ms | 0.2% | 19.1ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:523` |
| 0.2% | 19.8ms | 0.0% | 1.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:668` |
| 0.2% | 19.2ms | 0.2% | 19.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.1% | 18.8ms | 0.0% | 2.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.1% | 18.3ms | 0.1% | 18.3ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.1% | 15.0ms | 0.1% | 15.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:640` |
| 0.1% | 12.3ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:686` |
| 0.1% | 11.9ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:687` |
| 0.1% | 10.8ms | 0.0% | 1.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:609` |
| 0.1% | 10.2ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:601` |
| 0.1% | 10.2ms | 0.0% | 1.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.0% | 8.4ms | 0.0% | 8.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 8.2ms | 0.0% | 861us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.0% | 7.7ms | 0.0% | 7.7ms | `push` | `[native code]` |
| 0.0% | 7.4ms | 0.0% | 888us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 0.0% | 7.4ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.0% | 7.2ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` |
| 0.0% | 7.0ms | 0.0% | 7.0ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:253` |
| 0.0% | 6.9ms | 0.0% | 6.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:625` |
| 0.0% | 6.7ms | 0.0% | 4.2ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:524` |
| 0.0% | 6.2ms | 0.0% | 3.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:624` |
| 0.0% | 6.2ms | 0.0% | 6.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:707` |
| 0.0% | 6.1ms | 0.0% | 720us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` |
| 0.0% | 5.7ms | 0.0% | 5.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` |
| 0.0% | 5.5ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:690` |
| 0.0% | 4.7ms | 0.0% | 4.7ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 4.5ms | 0.0% | 4.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:636` |
| 0.0% | 4.4ms | 0.0% | 4.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 0.0% | 4.3ms | 0.0% | 4.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:701` |
| 0.0% | 4.1ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:590` |
| 0.0% | 4.0ms | 0.0% | 4.0ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.9ms | 0.0% | 3.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` |
| 0.0% | 3.5ms | 0.0% | 3.5ms | `abs` | `[native code]` |
| 0.0% | 3.5ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 3.4ms | 0.0% | 3.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:696` |
| 0.0% | 3.3ms | 0.0% | 3.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.0% | 3.3ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` |
| 0.0% | 3.1ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 3.1ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 3.0ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:604` |
| 0.0% | 2.8ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 2.8ms | 0.0% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:672` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` |
| 0.0% | 2.2ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 2.2ms | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 2.2ms | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 2.2ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 2.2ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` |
| 0.0% | 2.1ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:581` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:683` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `every` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 0us | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:372` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:685` |
| 0.0% | 1.5ms | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:40` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `max` | `[native code]` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:554` |
| 0.0% | 911us | 0.0% | 911us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` |
| 0.0% | 905us | 0.0% | 905us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:191` |
| 0.0% | 867us | 0.0% | 867us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:427` |
| 0.0% | 840us | 0.0% | 840us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` |
| 0.0% | 822us | 0.0% | 822us | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 815us | 0.0% | 815us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:252` |
| 0.0% | 809us | 0.0% | 809us | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:233` |
| 0.0% | 806us | 0.0% | 806us | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:528` |
| 0.0% | 805us | 0.0% | 805us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:193` |
| 0.0% | 804us | 0.0% | 804us | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 772us | 0.0% | 772us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:422` |
| 0.0% | 772us | 0.0% | 772us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 0.0% | 770us | 0.0% | 0us | `createIdentityMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:31` |
| 0.0% | 770us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:453` |
| 0.0% | 756us | 0.0% | 756us | `internal:streams/destroy` | `internal:streams/destroy:16` |
| 0.0% | 742us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 742us | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 742us | 0.0% | 0us | `internal:primordials` | `internal:primordials:51` |
| 0.0% | 742us | 0.0% | 742us | `createSafeIterator` | `internal:primordials:3` |
| 0.0% | 742us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 735us | 0.0% | 735us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:483` |
| 0.0% | 733us | 0.0% | 733us | `now` | `[native code]` |
| 0.0% | 733us | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:88` |
| 0.0% | 732us | 0.0% | 0us | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:58` |
| 0.0% | 731us | 0.0% | 731us | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:280` |
| 0.0% | 731us | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:305` |
| 0.0% | 729us | 0.0% | 729us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:172` |
| 0.0% | 728us | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` |
| 0.0% | 728us | 0.0% | 728us | `exp` | `[native code]` |
| 0.0% | 715us | 0.0% | 715us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` |
| 0.0% | 711us | 0.0% | 711us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:681` |
| 0.0% | 701us | 0.0% | 701us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 700us | 0.0% | 700us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:26` |
| 0.0% | 692us | 0.0% | 692us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 690us | 0.0% | 690us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:479` |
| 0.0% | 688us | 0.0% | 0us | `internal:fs/binding` | `internal:fs/binding:3` |
| 0.0% | 688us | 0.0% | 688us | `@lazy` | `[native code]` |
| 0.0% | 681us | 0.0% | 681us | `file` | `[native code]` |
| 0.0% | 681us | 0.0% | 0us | `WriteStream` | `internal:fs/streams:251` |
| 0.0% | 679us | 0.0% | 679us | `filter` | `[native code]` |
| 0.0% | 679us | 0.0% | 0us | `internal:streams/readable` | `internal:streams/readable:14` |
| 0.0% | 679us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:466` |
| 0.0% | 658us | 0.0% | 658us | `reduce` | `[native code]` |
| 0.0% | 650us | 0.0% | 650us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 637us | 0.0% | 637us | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:525` |
| 0.0% | 636us | 0.0% | 636us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:150` |
| 0.0% | 627us | 0.0% | 627us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:426` |
| 0.0% | 626us | 0.0% | 626us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |

## Function Details

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` | Self: 39.7% (3.78s) | Total: 41.3% (3.93s) | Samples: 4898

**Called by:**
- `step` (5094)

**Calls:**
- `hypot` (196)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` | Self: 19.2% (1.82s) | Total: 19.2% (1.82s) | Samples: 2379

**Called by:**
- `runTrial` (2369)
- `runTrial` (10)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` | Self: 4.7% (451.3ms) | Total: 4.8% (463.3ms) | Samples: 584

**Called by:**
- `step` (598)

**Calls:**
- `createZeroVector` (10)
- `fill` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` | Self: 3.8% (370.5ms) | Total: 4.4% (422.1ms) | Samples: 486

**Called by:**
- `runTrial` (542)
- `runTrial` (1)

**Calls:**
- `createZeroMatrix` (47)
- `from` (10)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` | Self: 3.8% (361.6ms) | Total: 4.3% (415.8ms) | Samples: 467

**Called by:**
- `step` (536)

**Calls:**
- `from` (68)
- `createZeroMatrix` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` | Self: 3.3% (314.6ms) | Total: 3.3% (321.2ms) | Samples: 413

**Called by:**
- `step` (354)
- `step` (68)

**Calls:**
- `createZeroVector` (5)
- `fill` (4)

### `map`
`[native code]` | Self: 2.4% (232.9ms) | Total: 4.8% (457.0ms) | Samples: 295

**Called by:**
- `cloneMatrix` (131)
- `step` (108)
- `step` (105)
- `step` (77)
- `(anonymous)` (73)
- `(anonymous)` (24)
- `step` (12)
- `step` (9)
- `jacobiEigenSymmetric` (9)
- `step` (8)
- `step` (8)
- `step` (7)
- `step` (6)
- `jacobiEigenSymmetric` (4)
- `jacobiEigenSymmetric` (4)
- `map` (3)
- `alignProjectionBasis` (1)

**Calls:**
- `(anonymous)` (101)
- `(anonymous)` (99)
- `(anonymous)` (75)
- `(anonymous)` (6)
- `(anonymous)` (5)
- `abs` (4)
- `map` (3)
- `(anonymous)` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` | Self: 2.2% (213.6ms) | Total: 2.3% (221.0ms) | Samples: 282

**Called by:**
- `step` (244)
- `step` (48)

**Calls:**
- `createZeroVector` (6)
- `fill` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:677` | Self: 2.0% (196.7ms) | Total: 2.0% (196.7ms) | Samples: 244

**Called by:**
- `runTrial` (244)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:652` | Self: 1.8% (177.7ms) | Total: 1.8% (177.7ms) | Samples: 234

**Called by:**
- `runTrial` (234)

### `fill`
`[native code]` | Self: 1.7% (169.6ms) | Total: 1.7% (169.6ms) | Samples: 213

**Called by:**
- `sampleGaussianVectorND` (106)
- `ellipsoidObjective` (52)
- `from` (43)
- `whitenWithEigensystem` (4)
- `whitenWithEigensystem` (4)
- `transformFromEigenCoordinates` (4)

### `hypot`
`[native code]` | Self: 1.5% (149.6ms) | Total: 1.5% (149.6ms) | Samples: 196

**Called by:**
- `jacobiEigenSymmetric` (196)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:648` | Self: 1.5% (143.2ms) | Total: 1.5% (143.2ms) | Samples: 185

**Called by:**
- `runTrial` (184)
- `runTrial` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.2% (119.2ms) | Total: 2.1% (200.6ms) | Samples: 156

**Called by:**
- `step` (262)

**Calls:**
- `fill` (106)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.9% (88.4ms) | Total: 0.9% (88.4ms) | Samples: 117

**Called by:**
- `map` (99)
- `some` (18)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` | Self: 0.8% (81.8ms) | Total: 0.8% (81.8ms) | Samples: 107

**Called by:**
- `projectTo3D` (107)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 0.8% (79.9ms) | Total: 0.8% (79.9ms) | Samples: 101

**Called by:**
- `map` (101)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` | Self: 0.6% (63.1ms) | Total: 0.9% (85.9ms) | Samples: 83

**Called by:**
- `step` (109)

**Calls:**
- `Float64Array` (26)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:545` | Self: 0.5% (49.3ms) | Total: 0.5% (49.3ms) | Samples: 64

**Called by:**
- `step` (64)

### `from`
`[native code]` | Self: 0.4% (46.2ms) | Total: 1.4% (141.2ms) | Samples: 60

**Called by:**
- `reconstructSymmetric` (68)
- `createZeroMatrix` (47)
- `jacobiEigenSymmetric` (41)
- `step` (10)
- `jacobiEigenSymmetric` (5)
- `createIdentityMatrix` (1)

**Calls:**
- `(anonymous)` (44)
- `fill` (43)
- `(anonymous)` (25)

### `Float64Array`
`[native code]` | Self: 0.4% (46.1ms) | Total: 0.4% (46.1ms) | Samples: 56

**Called by:**
- `jacobiEigenSymmetric` (30)
- `jacobiEigenSymmetric` (26)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.4% (41.7ms) | Total: 0.7% (73.2ms) | Samples: 54

**Called by:**
- `step` (95)

**Calls:**
- `from` (41)

### `some`
`[native code]` | Self: 0.4% (39.3ms) | Total: 1.0% (104.3ms) | Samples: 52

**Called by:**
- `validateSquareFiniteMatrix` (68)
- `(anonymous)` (67)
- `projectTo3D` (3)

**Calls:**
- `(anonymous)` (68)
- `(anonymous)` (18)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.3% (36.0ms) | Total: 0.3% (36.0ms) | Samples: 44

**Called by:**
- `from` (44)

### `sort`
`[native code]` | Self: 0.3% (35.3ms) | Total: 0.4% (44.4ms) | Samples: 47

**Called by:**
- `jacobiEigenSymmetric` (38)
- `step` (21)

**Calls:**
- `(anonymous)` (11)
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` | Self: 0.3% (34.6ms) | Total: 0.3% (34.6ms) | Samples: 46

**Called by:**
- `runTrial` (46)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.2% (27.4ms) | Total: 0.2% (27.4ms) | Samples: 35

**Called by:**
- `step` (14)
- `step` (12)
- `(anonymous)` (9)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:303` | Self: 0.2% (26.9ms) | Total: 0.2% (26.9ms) | Samples: 35

**Called by:**
- `step` (35)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` | Self: 0.2% (25.6ms) | Total: 0.6% (65.0ms) | Samples: 34

**Called by:**
- `step` (86)

**Calls:**
- `fill` (52)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:669` | Self: 0.2% (23.0ms) | Total: 1.5% (144.5ms) | Samples: 30

**Called by:**
- `forEach` (189)

**Calls:**
- `projectTo3D` (116)
- `projectTo3D` (24)
- `projectTo3D` (9)
- `projectTo3D` (9)
- `projectTo3D` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.2% (19.2ms) | Total: 0.2% (19.2ms) | Samples: 25

**Called by:**
- `from` (25)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:523` | Self: 0.2% (19.1ms) | Total: 0.2% (20.7ms) | Samples: 25

**Called by:**
- `(anonymous)` (24)
- `step` (3)

**Calls:**
- `requireFiniteVector` (2)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` | Self: 0.1% (18.3ms) | Total: 0.1% (18.3ms) | Samples: 23

**Called by:**
- `transformFromEigenCoordinates` (10)
- `whitenWithEigensystem` (6)
- `whitenWithEigensystem` (5)
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:640` | Self: 0.1% (15.0ms) | Total: 0.1% (15.0ms) | Samples: 18

**Called by:**
- `runTrial` (18)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` | Self: 0.0% (8.4ms) | Total: 0.0% (8.4ms) | Samples: 11

**Called by:**
- `sort` (11)

### `push`
`[native code]` | Self: 0.0% (7.7ms) | Total: 0.0% (7.7ms) | Samples: 10

**Called by:**
- `step` (10)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:253` | Self: 0.0% (7.0ms) | Total: 0.0% (7.0ms) | Samples: 9

**Called by:**
- `step` (9)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:625` | Self: 0.0% (6.9ms) | Total: 0.0% (6.9ms) | Samples: 9

**Called by:**
- `runTrial` (9)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:533` | Self: 0.0% (6.7ms) | Total: 0.9% (90.2ms) | Samples: 9

**Called by:**
- `(anonymous)` (116)
- `step` (2)

**Calls:**
- `coordinate` (107)
- `coordinate` (1)
- `coordinate` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:707` | Self: 0.0% (6.2ms) | Total: 0.0% (6.2ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` | Self: 0.0% (5.7ms) | Total: 0.0% (5.7ms) | Samples: 7

**Called by:**
- `runTrial` (7)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (4.7ms) | Total: 0.0% (4.7ms) | Samples: 6

**Called by:**
- `step` (5)
- `step` (1)

### `anonymous`
`[native code]` | Self: 0.0% (4.5ms) | Total: 0.3% (29.0ms) | Samples: 6

**Called by:**
- `(anonymous)` (5)
- `node:fs` (5)
- `get WriteStream` (4)
- `node:fs/promises` (4)
- `internal:fs/streams` (3)
- `internal:stream` (3)
- `internal:streams/pipeline` (3)
- `internal:streams/compose` (3)
- `node:stream` (3)
- `internal:streams/duplex` (2)
- `node:events` (1)
- `internal:validators` (1)
- `internal:streams/readable` (1)
- `internal:shared` (1)

**Calls:**
- `node:fs` (5)
- `node:fs/promises` (4)
- `internal:fs/streams` (3)
- `internal:streams/pipeline` (3)
- `internal:stream` (3)
- `internal:streams/compose` (3)
- `node:stream` (3)
- `internal:streams/duplex` (2)
- `node:events` (1)
- `internal:validators` (1)
- `internal:streams/destroy` (1)
- `internal:streams/readable` (1)
- `internal:shared` (1)
- `internal:primordials` (1)
- `internal:fs/binding` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:636` | Self: 0.0% (4.5ms) | Total: 0.0% (4.5ms) | Samples: 6

**Called by:**
- `runTrial` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:564` | Self: 0.0% (4.5ms) | Total: 0.7% (70.9ms) | Samples: 6

**Called by:**
- `runTrial` (94)

**Calls:**
- `ellipsoidObjective` (86)
- `ellipsoidObjective` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` | Self: 0.0% (4.4ms) | Total: 0.0% (4.4ms) | Samples: 6

**Called by:**
- `map` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:701` | Self: 0.0% (4.3ms) | Total: 0.0% (4.3ms) | Samples: 6

**Called by:**
- `runTrial` (6)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:524` | Self: 0.0% (4.2ms) | Total: 0.0% (6.7ms) | Samples: 6

**Called by:**
- `(anonymous)` (9)

**Calls:**
- `some` (3)

### `vecDot`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (4.0ms) | Total: 0.0% (4.0ms) | Samples: 5

**Called by:**
- `step` (4)
- `vecNorm` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` | Self: 0.0% (3.9ms) | Total: 0.0% (3.9ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `abs`
`[native code]` | Self: 0.0% (3.5ms) | Total: 0.0% (3.5ms) | Samples: 5

**Called by:**
- `map` (4)
- `jacobiEigenSymmetric` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:696` | Self: 0.0% (3.4ms) | Total: 0.0% (3.4ms) | Samples: 4

**Called by:**
- `runTrial` (3)
- `runTrial` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` | Self: 0.0% (3.3ms) | Total: 0.0% (3.3ms) | Samples: 5

**Called by:**
- `map` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:624` | Self: 0.0% (3.0ms) | Total: 0.0% (6.2ms) | Samples: 4

**Called by:**
- `runTrial` (8)

**Calls:**
- `vecDot` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` | Self: 0.0% (2.9ms) | Total: 0.1% (18.8ms) | Samples: 4

**Called by:**
- `runTrial` (25)

**Calls:**
- `sort` (21)

### `forEach`
`[native code]` | Self: 0.0% (2.7ms) | Total: 1.7% (166.2ms) | Samples: 4

**Called by:**
- `step` (215)
- `step` (3)

**Calls:**
- `(anonymous)` (189)
- `(anonymous)` (25)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` | Self: 0.0% (2.4ms) | Total: 0.0% (2.4ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` | Self: 0.0% (2.4ms) | Total: 0.8% (82.7ms) | Samples: 3

**Called by:**
- `runTrial` (108)

**Calls:**
- `map` (105)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` | Self: 0.0% (2.3ms) | Total: 0.9% (89.1ms) | Samples: 3

**Called by:**
- `runTrial` (111)

**Calls:**
- `map` (108)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:604` | Self: 0.0% (2.3ms) | Total: 0.0% (3.0ms) | Samples: 3

**Called by:**
- `runTrial` (4)

**Calls:**
- `vecNorm` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` | Self: 0.0% (2.2ms) | Total: 2.5% (238.2ms) | Samples: 3

**Called by:**
- `runTrial` (310)
- `runTrial` (1)

**Calls:**
- `sampleGaussianVectorND` (262)
- `sampleGaussianVectorND` (35)
- `push` (10)
- `sampleGaussianVectorND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` | Self: 0.0% (2.2ms) | Total: 0.0% (2.2ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` | Self: 0.0% (2.2ms) | Total: 0.0% (2.2ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:672` | Self: 0.0% (2.1ms) | Total: 0.0% (2.8ms) | Samples: 2

**Called by:**
- `runTrial` (3)

**Calls:**
- `reduce` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` | Self: 0.0% (2.1ms) | Total: 0.0% (2.1ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (2.1ms) | Total: 0.0% (2.1ms) | Samples: 1

**Called by:**
- `runTrial` (1)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.7ms) | Total: 0.0% (1.7ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:683` | Self: 0.0% (1.7ms) | Total: 0.0% (1.7ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:609` | Self: 0.0% (1.7ms) | Total: 0.1% (10.8ms) | Samples: 2

**Called by:**
- `runTrial` (13)
- `runTrial` (1)

**Calls:**
- `map` (12)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:590` | Self: 0.0% (1.6ms) | Total: 0.0% (4.1ms) | Samples: 2

**Called by:**
- `runTrial` (4)
- `runTrial` (1)

**Calls:**
- `createZeroVector` (2)
- `createZeroVector` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:668` | Self: 0.0% (1.5ms) | Total: 0.2% (19.8ms) | Samples: 2

**Called by:**
- `forEach` (25)
- `map` (1)

**Calls:**
- `map` (24)

### `every`
`[native code]` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `requireFiniteVector` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:685` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:40` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `step` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.0% (1.4ms) | Total: 0.1% (10.2ms) | Samples: 2

**Called by:**
- `step` (14)

**Calls:**
- `map` (9)
- `max` (2)
- `abs` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:614` | Self: 0.0% (1.3ms) | Total: 0.5% (55.5ms) | Samples: 2

**Called by:**
- `map` (75)

**Calls:**
- `map` (73)

### `max`
`[native code]` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `jacobiEigenSymmetric` (2)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:537` | Self: 0.0% (1.3ms) | Total: 0.3% (33.3ms) | Samples: 2

**Called by:**
- `step` (44)

**Calls:**
- `cloneMatrix` (42)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:554` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` | Self: 0.0% (911us) | Total: 0.0% (911us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:191` | Self: 0.0% (905us) | Total: 0.0% (905us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` | Self: 0.0% (888us) | Total: 0.0% (7.4ms) | Samples: 1

**Called by:**
- `runTrial` (10)

**Calls:**
- `map` (9)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:427` | Self: 0.0% (867us) | Total: 0.0% (867us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` | Self: 0.0% (861us) | Total: 0.0% (8.2ms) | Samples: 1

**Calls:**
- `(anonymous)` (10)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:599` | Self: 0.0% (850us) | Total: 0.9% (90.6ms) | Samples: 1

**Called by:**
- `runTrial` (117)
- `runTrial` (1)

**Calls:**
- `whitenWithEigensystem` (68)
- `whitenWithEigensystem` (48)
- `whitenWithEigensystem` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` | Self: 0.0% (840us) | Total: 0.0% (840us) | Samples: 1

**Called by:**
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (822us) | Total: 0.5% (51.3ms) | Samples: 1

**Called by:**
- `some` (68)

**Calls:**
- `some` (67)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (822us) | Total: 0.0% (822us) | Samples: 1

**Called by:**
- `step` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:252` | Self: 0.0% (815us) | Total: 0.0% (815us) | Samples: 1

**Called by:**
- `step` (1)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:233` | Self: 0.0% (809us) | Total: 0.0% (809us) | Samples: 1

**Called by:**
- `step` (1)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:528` | Self: 0.0% (806us) | Total: 0.0% (806us) | Samples: 1

**Called by:**
- `projectTo3D` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:193` | Self: 0.0% (805us) | Total: 0.0% (805us) | Samples: 1

**Called by:**
- `step` (1)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (804us) | Total: 0.0% (804us) | Samples: 1

**Called by:**
- `projectTo3D` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` | Self: 0.0% (772us) | Total: 0.0% (772us) | Samples: 1

**Called by:**
- `step` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:422` | Self: 0.0% (772us) | Total: 0.0% (772us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `internal:streams/destroy`
`internal:streams/destroy:16` | Self: 0.0% (756us) | Total: 0.0% (756us) | Samples: 1

**Called by:**
- `anonymous` (1)

### `createSafeIterator`
`internal:primordials:3` | Self: 0.0% (742us) | Total: 0.0% (742us) | Samples: 1

**Called by:**
- `internal:primordials` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:483` | Self: 0.0% (735us) | Total: 0.0% (735us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `now`
`[native code]` | Self: 0.0% (733us) | Total: 0.0% (733us) | Samples: 1

**Called by:**
- `(module)` (1)

### `nextOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:280` | Self: 0.0% (731us) | Total: 0.0% (731us) | Samples: 1

**Called by:**
- `sampleGaussianVectorND` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:172` | Self: 0.0% (729us) | Total: 0.0% (729us) | Samples: 1

**Called by:**
- `step` (1)

### `exp`
`[native code]` | Self: 0.0% (728us) | Total: 0.0% (728us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` | Self: 0.0% (720us) | Total: 0.0% (6.1ms) | Samples: 1

**Called by:**
- `runTrial` (8)

**Calls:**
- `map` (7)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` | Self: 0.0% (715us) | Total: 0.0% (715us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:681` | Self: 0.0% (711us) | Total: 0.0% (711us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (701us) | Total: 0.0% (701us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:26` | Self: 0.0% (700us) | Total: 0.0% (700us) | Samples: 1

**Called by:**
- `reconstructSymmetric` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` | Self: 0.0% (692us) | Total: 0.0% (692us) | Samples: 1

**Called by:**
- `step` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:479` | Self: 0.0% (690us) | Total: 0.0% (690us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `@lazy`
`[native code]` | Self: 0.0% (688us) | Total: 0.0% (688us) | Samples: 1

**Called by:**
- `internal:fs/binding` (1)

### `file`
`[native code]` | Self: 0.0% (681us) | Total: 0.0% (681us) | Samples: 1

**Called by:**
- `WriteStream` (1)

### `filter`
`[native code]` | Self: 0.0% (679us) | Total: 0.0% (679us) | Samples: 1

**Called by:**
- `CMAESOptimizerND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` | Self: 0.0% (676us) | Total: 4.9% (472.6ms) | Samples: 1

**Called by:**
- `runTrial` (609)
- `runTrial` (1)

**Calls:**
- `transformFromEigenCoordinates` (598)
- `transformFromEigenCoordinates` (9)
- `transformFromEigenCoordinates` (1)
- `transformFromEigenCoordinates` (1)

### `reduce`
`[native code]` | Self: 0.0% (658us) | Total: 0.0% (658us) | Samples: 1

**Called by:**
- `step` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (650us) | Total: 0.0% (650us) | Samples: 1

**Called by:**
- `step` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:525` | Self: 0.0% (637us) | Total: 0.0% (637us) | Samples: 1

**Called by:**
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:656` | Self: 0.0% (636us) | Total: 4.3% (417.2ms) | Samples: 1

**Called by:**
- `runTrial` (534)
- `runTrial` (4)

**Calls:**
- `reconstructSymmetric` (536)
- `reconstructSymmetric` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:150` | Self: 0.0% (636us) | Total: 0.0% (636us) | Samples: 1

**Called by:**
- `step` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:426` | Self: 0.0% (627us) | Total: 0.0% (627us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` | Self: 0.0% (626us) | Total: 0.0% (626us) | Samples: 1

**Called by:**
- `sort` (1)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 0.0% (0us) | Total: 1.0% (102.2ms) | Samples: 0

**Called by:**
- `step` (46)
- `alignProjectionBasis` (43)
- `alignProjectionBasis` (42)

**Calls:**
- `map` (131)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` | Self: 0.0% (0us) | Total: 0.2% (23.2ms) | Samples: 0

**Called by:**
- `step` (30)

**Calls:**
- `Float64Array` (30)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` | Self: 0.0% (0us) | Total: 0.0% (3.3ms) | Samples: 0

**Called by:**
- `step` (4)

**Calls:**
- `map` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:581` | Self: 0.0% (0us) | Total: 0.0% (2.1ms) | Samples: 0

**Called by:**
- `runTrial` (3)

**Calls:**
- `forEach` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` | Self: 0.0% (0us) | Total: 0.4% (41.3ms) | Samples: 0

**Called by:**
- `runTrial` (54)

**Calls:**
- `cloneMatrix` (46)
- `map` (6)
- `cloneMatrix` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` | Self: 0.0% (0us) | Total: 1.2% (119.2ms) | Samples: 0

**Called by:**
- `runTrial` (153)

**Calls:**
- `alignProjectionBasis` (64)
- `alignProjectionBasis` (44)
- `alignProjectionBasis` (44)
- `alignProjectionBasis` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:453` | Self: 0.0% (0us) | Total: 0.0% (770us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `createIdentityMatrix` (1)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (2.2ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` | Self: 0.0% (0us) | Total: 0.0% (7.2ms) | Samples: 0

**Called by:**
- `(module)` (6)
- `(module)` (2)

**Calls:**
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` | Self: 0.0% (0us) | Total: 0.6% (57.4ms) | Samples: 0

**Called by:**
- `runTrial` (76)
- `runTrial` (1)

**Calls:**
- `map` (77)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (742us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:466` | Self: 0.0% (0us) | Total: 0.0% (679us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `filter` (1)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (742us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:fs/binding`
`internal:fs/binding:3` | Self: 0.0% (0us) | Total: 0.0% (688us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `@lazy` (1)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (2.2ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:655` | Self: 0.0% (0us) | Total: 44.4% (4.22s) | Samples: 0

**Called by:**
- `runTrial` (5440)
- `runTrial` (28)

**Calls:**
- `jacobiEigenSymmetric` (5094)
- `jacobiEigenSymmetric` (109)
- `jacobiEigenSymmetric` (95)
- `jacobiEigenSymmetric` (68)
- `jacobiEigenSymmetric` (43)
- `jacobiEigenSymmetric` (30)
- `jacobiEigenSymmetric` (14)
- `jacobiEigenSymmetric` (4)
- `jacobiEigenSymmetric` (4)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` | Self: 0.0% (0us) | Total: 99.3% (9.45s) | Samples: 0

**Called by:**
- `(module)` (11441)
- `(module)` (804)

**Calls:**
- `step` (5440)
- `step` (2369)
- `step` (609)
- `step` (601)
- `step` (542)
- `step` (534)
- `step` (310)
- `step` (244)
- `step` (234)
- `step` (214)
- `step` (184)
- `step` (153)
- `step` (117)
- `step` (111)
- `step` (108)
- `step` (94)
- `step` (76)
- `step` (54)
- `step` (46)
- `step` (25)
- `step` (18)
- `step` (16)
- `step` (15)
- `step` (13)
- `step` (10)
- `step` (9)
- `step` (8)
- `step` (8)
- `step` (8)
- `step` (8)
- `step` (7)
- `step` (6)
- `step` (6)
- `step` (5)
- `step` (4)
- `step` (4)
- `step` (4)
- `step` (3)
- `step` (3)
- `step` (3)
- `step` (3)
- `step` (3)
- `step` (3)
- `step` (3)
- `step` (2)
- `step` (2)
- `step` (2)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (0us) | Total: 0.5% (51.3ms) | Samples: 0

**Called by:**
- `jacobiEigenSymmetric` (68)

**Calls:**
- `some` (68)

### `internal:streams/readable`
`internal:streams/readable:14` | Self: 0.0% (0us) | Total: 0.0% (679us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` | Self: 0.0% (0us) | Total: 0.3% (32.4ms) | Samples: 0

**Called by:**
- `step` (43)

**Calls:**
- `sort` (38)
- `from` (5)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.0% (0us) | Total: 0.4% (44.1ms) | Samples: 0

**Called by:**
- `step` (47)

**Calls:**
- `from` (47)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:601` | Self: 0.0% (0us) | Total: 0.1% (10.2ms) | Samples: 0

**Called by:**
- `runTrial` (8)

**Calls:**
- `map` (8)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (2.8ms) | Samples: 0

**Called by:**
- `anonymous` (4)

**Calls:**
- `anonymous` (4)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` | Self: 0.0% (0us) | Total: 0.3% (35.9ms) | Samples: 0

**Called by:**
- `step` (44)

**Calls:**
- `cloneMatrix` (43)
- `map` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` | Self: 0.0% (0us) | Total: 6.6% (637.0ms) | Samples: 0

**Calls:**
- `runTrial` (804)
- `runTrial` (6)
- `runTrial` (2)

### `vecNorm`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:58` | Self: 0.0% (0us) | Total: 0.0% (732us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `vecDot` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:667` | Self: 0.0% (0us) | Total: 1.7% (164.1ms) | Samples: 0

**Called by:**
- `runTrial` (214)
- `runTrial` (1)

**Calls:**
- `forEach` (215)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` | Self: 0.0% (0us) | Total: 0.0% (3.1ms) | Samples: 0

**Called by:**
- `step` (4)

**Calls:**
- `map` (4)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (3.1ms) | Samples: 0

**Called by:**
- `(anonymous)` (4)

**Calls:**
- `anonymous` (4)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (3.5ms) | Samples: 0

**Called by:**
- `anonymous` (5)

**Calls:**
- `anonymous` (5)

### `internal:primordials`
`internal:primordials:51` | Self: 0.0% (0us) | Total: 0.0% (742us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `createSafeIterator` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` | Self: 0.0% (0us) | Total: 0.5% (51.3ms) | Samples: 0

**Called by:**
- `step` (68)

**Calls:**
- `validateSquareFiniteMatrix` (68)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:690` | Self: 0.0% (0us) | Total: 0.0% (5.5ms) | Samples: 0

**Called by:**
- `runTrial` (8)

**Calls:**
- `map` (8)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (2.2ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` | Self: 0.0% (0us) | Total: 93.2% (8.86s) | Samples: 0

**Calls:**
- `runTrial` (11441)
- `runTrial` (48)
- `runTrial` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:619` | Self: 0.0% (0us) | Total: 4.8% (457.3ms) | Samples: 0

**Called by:**
- `runTrial` (601)
- `runTrial` (2)

**Calls:**
- `whitenWithEigensystem` (354)
- `whitenWithEigensystem` (244)
- `whitenWithEigensystem` (5)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (2.2ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (7.4ms) | Samples: 0

**Called by:**
- `(module)` (10)

**Calls:**
- `anonymous` (5)
- `get WriteStream` (4)
- `WriteStream` (1)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (2.2ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:88` | Self: 0.0% (0us) | Total: 0.0% (733us) | Samples: 0

**Calls:**
- `now` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:687` | Self: 0.0% (0us) | Total: 0.1% (11.9ms) | Samples: 0

**Called by:**
- `runTrial` (15)

**Calls:**
- `projectTo3D` (12)
- `projectTo3D` (3)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:305` | Self: 0.0% (0us) | Total: 0.0% (731us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `nextOpenUnit` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` | Self: 0.0% (0us) | Total: 0.4% (41.5ms) | Samples: 0

**Called by:**
- `(module)` (48)
- `(module)` (6)

**Calls:**
- `step` (28)
- `step` (10)
- `step` (4)
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
- `step` (1)

### `createIdentityMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:31` | Self: 0.0% (0us) | Total: 0.0% (770us) | Samples: 0

**Called by:**
- `CMAESOptimizerND` (1)

**Calls:**
- `from` (1)

### `requireFiniteVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:372` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `projectTo3D` (2)

**Calls:**
- `every` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:686` | Self: 0.0% (0us) | Total: 0.1% (12.3ms) | Samples: 0

**Called by:**
- `runTrial` (16)

**Calls:**
- `projectTo3D` (14)
- `projectTo3D` (2)

### `WriteStream`
`internal:fs/streams:251` | Self: 0.0% (0us) | Total: 0.0% (681us) | Samples: 0

**Called by:**
- `(anonymous)` (1)

**Calls:**
- `file` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` | Self: 0.0% (0us) | Total: 0.0% (728us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `exp` (1)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (742us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 91.8% | 8.74s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 7.8% | 745.0ms | `[native code]` |
| 0.2% | 27.9ms | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.0% | 756us | `internal:streams/destroy` |
| 0.0% | 742us | `internal:primordials` |
