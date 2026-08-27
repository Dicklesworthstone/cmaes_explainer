# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 8.49s | 11046 | 500us | 168 |

**Top 10:** `jacobiEigenSymmetric` 36.4%, `step` 21.6%, `transformFromEigenCoordinates` 4.9%, `reconstructSymmetric` 4.5%, `step` 3.9%, `mahalanobisSquaredWithEigensystem` 3.5%, `step` 2.3%, `map` 2.0%, `step` 2.0%, `hypot` 1.8%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 36.4% | 3.09s | 38.3% | 3.25s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` |
| 21.6% | 1.83s | 21.6% | 1.83s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` |
| 4.9% | 419.7ms | 5.1% | 439.5ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 4.5% | 385.0ms | 5.0% | 425.7ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:253` |
| 3.9% | 336.4ms | 4.4% | 380.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:688` |
| 3.5% | 303.7ms | 3.6% | 309.8ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:308` |
| 2.3% | 198.0ms | 2.3% | 198.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:733` |
| 2.0% | 177.2ms | 4.2% | 363.3ms | `map` | `[native code]` |
| 2.0% | 176.5ms | 2.0% | 176.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:708` |
| 1.8% | 161.2ms | 1.8% | 161.2ms | `hypot` | `[native code]` |
| 1.7% | 147.5ms | 1.7% | 147.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:705` |
| 1.6% | 136.4ms | 2.2% | 194.1ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.5% | 127.8ms | 1.5% | 127.8ms | `fill` | `[native code]` |
| 0.8% | 72.7ms | 0.8% | 72.7ms | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:419` |
| 0.8% | 71.4ms | 1.0% | 89.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.8% | 70.5ms | 0.8% | 70.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.5% | 46.8ms | 0.5% | 46.8ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` |
| 0.4% | 40.9ms | 0.4% | 40.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.4% | 40.7ms | 0.4% | 41.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 0.4% | 37.7ms | 0.7% | 62.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` |
| 0.4% | 36.7ms | 0.4% | 41.6ms | `sort` | `[native code]` |
| 0.4% | 35.1ms | 1.3% | 113.4ms | `from` | `[native code]` |
| 0.4% | 34.2ms | 0.8% | 69.2ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.3% | 33.3ms | 0.3% | 33.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.3% | 32.9ms | 1.2% | 109.5ms | `some` | `[native code]` |
| 0.3% | 32.2ms | 1.6% | 139.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:725` |
| 0.3% | 31.4ms | 0.3% | 31.4ms | `Float64Array` | `[native code]` |
| 0.3% | 26.4ms | 0.3% | 26.4ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.2% | 20.0ms | 0.2% | 22.1ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:287` |
| 0.2% | 19.9ms | 0.2% | 19.9ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.2% | 18.6ms | 0.2% | 18.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` |
| 0.1% | 16.9ms | 0.1% | 16.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` |
| 0.1% | 16.9ms | 0.1% | 16.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` |
| 0.1% | 16.8ms | 0.1% | 16.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:609` |
| 0.1% | 16.3ms | 0.1% | 16.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` |
| 0.1% | 16.0ms | 0.2% | 18.6ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:294` |
| 0.1% | 11.8ms | 0.1% | 11.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:696` |
| 0.1% | 11.1ms | 0.1% | 11.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` |
| 0.1% | 10.3ms | 0.9% | 83.1ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 0.1% | 10.1ms | 0.1% | 10.1ms | `push` | `[native code]` |
| 0.0% | 7.5ms | 0.9% | 77.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 0.0% | 7.4ms | 0.0% | 7.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:681` |
| 0.0% | 7.4ms | 0.1% | 9.7ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.0% | 5.9ms | 0.0% | 5.9ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:350` |
| 0.0% | 5.3ms | 0.0% | 5.3ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 4.5ms | 0.2% | 20.6ms | `anonymous` | `[native code]` |
| 0.0% | 4.4ms | 0.0% | 4.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:692` |
| 0.0% | 3.8ms | 0.0% | 3.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:739` |
| 0.0% | 3.6ms | 5.3% | 451.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:608` |
| 0.0% | 3.6ms | 0.0% | 3.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` |
| 0.0% | 3.5ms | 0.0% | 3.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:206` |
| 0.0% | 3.5ms | 0.0% | 3.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` |
| 0.0% | 3.3ms | 0.0% | 3.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:737` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:633` |
| 0.0% | 3.0ms | 0.1% | 12.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:209` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `abs` | `[native code]` |
| 0.0% | 2.8ms | 1.8% | 159.6ms | `forEach` | `[native code]` |
| 0.0% | 2.7ms | 0.0% | 2.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:741` |
| 0.0% | 2.7ms | 2.5% | 213.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` |
| 0.0% | 2.5ms | 0.0% | 2.5ms | `reduce` | `[native code]` |
| 0.0% | 2.5ms | 0.1% | 14.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:627` |
| 0.0% | 2.5ms | 0.0% | 2.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:661` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:21` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:752` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:757` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:572` |
| 0.0% | 2.1ms | 0.0% | 4.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:746` |
| 0.0% | 2.1ms | 3.7% | 314.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:274` |
| 0.0% | 1.7ms | 1.8% | 156.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:723` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:701` |
| 0.0% | 1.6ms | 0.7% | 60.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:671` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:756` |
| 0.0% | 1.6ms | 0.0% | 4.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:763` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:753` |
| 0.0% | 1.5ms | 0.0% | 4.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:728` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:762` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:627` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 1.3ms | 0.8% | 74.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` |
| 0.0% | 908us | 0.0% | 908us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:149` |
| 0.0% | 900us | 0.1% | 14.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 0.0% | 892us | 0.0% | 892us | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:318` |
| 0.0% | 878us | 0.0% | 878us | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:319` |
| 0.0% | 867us | 0.0% | 5.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:628` |
| 0.0% | 864us | 0.0% | 864us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 858us | 0.0% | 858us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:49` |
| 0.0% | 844us | 0.0% | 844us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:90` |
| 0.0% | 834us | 0.0% | 834us | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 819us | 0.0% | 819us | `safeObjectiveValue` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 809us | 0.8% | 71.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:609` |
| 0.0% | 798us | 0.0% | 798us | `min` | `[native code]` |
| 0.0% | 792us | 0.0% | 792us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:716` |
| 0.0% | 786us | 0.0% | 786us | `WriteStream` | `internal:fs/streams:198` |
| 0.0% | 778us | 0.0% | 778us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:601` |
| 0.0% | 773us | 0.0% | 773us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:170` |
| 0.0% | 772us | 0.0% | 772us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` |
| 0.0% | 768us | 0.0% | 768us | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 761us | 0.0% | 761us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:271` |
| 0.0% | 732us | 0.0% | 732us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:689` |
| 0.0% | 728us | 0.0% | 728us | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:335` |
| 0.0% | 726us | 0.0% | 726us | `slice` | `[native code]` |
| 0.0% | 703us | 0.0% | 703us | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:312` |
| 0.0% | 700us | 0.0% | 700us | `(unknown)` | `[native code]` |
| 0.0% | 697us | 0.0% | 697us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:480` |
| 0.0% | 696us | 0.6% | 53.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.0% | 692us | 0.0% | 692us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 681us | 0.1% | 14.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` |
| 0.0% | 677us | 0.0% | 677us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:641` |
| 0.0% | 675us | 5.0% | 426.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:712` |
| 0.0% | 656us | 0.0% | 656us | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 653us | 0.0% | 653us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` |
| 0.0% | 652us | 0.0% | 5.9ms | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.0% | 647us | 0.0% | 647us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 634us | 0.0% | 634us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:571` |
| 0.0% | 627us | 0.0% | 627us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:50` |
| 0.0% | 618us | 0.0% | 618us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 99.4% | 8.44s | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 92.9% | 7.89s | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` |
| 41.6% | 3.53s | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` |
| 38.3% | 3.25s | 36.4% | 3.09s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` |
| 21.6% | 1.83s | 21.6% | 1.83s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` |
| 7.0% | 596.0ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` |
| 5.3% | 451.1ms | 0.0% | 3.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:608` |
| 5.1% | 439.5ms | 4.9% | 419.7ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 5.0% | 426.3ms | 0.0% | 675us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:712` |
| 5.0% | 425.7ms | 4.5% | 385.0ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:253` |
| 4.4% | 380.6ms | 3.9% | 336.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:688` |
| 4.2% | 363.3ms | 2.0% | 177.2ms | `map` | `[native code]` |
| 3.7% | 314.4ms | 0.0% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` |
| 3.6% | 309.8ms | 3.5% | 303.7ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:308` |
| 2.5% | 213.3ms | 0.0% | 2.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` |
| 2.3% | 198.0ms | 2.3% | 198.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:733` |
| 2.2% | 194.1ms | 1.6% | 136.4ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 2.0% | 176.5ms | 2.0% | 176.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:708` |
| 1.8% | 161.2ms | 1.8% | 161.2ms | `hypot` | `[native code]` |
| 1.8% | 159.6ms | 0.0% | 2.8ms | `forEach` | `[native code]` |
| 1.8% | 156.9ms | 0.0% | 1.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:723` |
| 1.7% | 147.5ms | 1.7% | 147.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:705` |
| 1.6% | 139.5ms | 0.3% | 32.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:725` |
| 1.5% | 127.8ms | 1.5% | 127.8ms | `fill` | `[native code]` |
| 1.3% | 113.4ms | 0.4% | 35.1ms | `from` | `[native code]` |
| 1.2% | 109.5ms | 0.3% | 32.9ms | `some` | `[native code]` |
| 1.0% | 89.1ms | 0.8% | 71.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.9% | 83.1ms | 0.1% | 10.3ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 0.9% | 79.5ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:721` |
| 0.9% | 77.7ms | 0.0% | 7.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 0.8% | 74.9ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` |
| 0.8% | 72.7ms | 0.8% | 72.7ms | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:419` |
| 0.8% | 71.9ms | 0.0% | 809us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:609` |
| 0.8% | 70.5ms | 0.8% | 70.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.8% | 69.2ms | 0.4% | 34.2ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.7% | 62.4ms | 0.4% | 37.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` |
| 0.7% | 62.4ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` |
| 0.7% | 60.0ms | 0.0% | 1.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:671` |
| 0.6% | 55.2ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 0.6% | 54.4ms | 0.0% | 0us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.6% | 54.3ms | 0.0% | 0us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.6% | 53.7ms | 0.0% | 696us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.5% | 46.8ms | 0.5% | 46.8ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` |
| 0.4% | 41.6ms | 0.4% | 36.7ms | `sort` | `[native code]` |
| 0.4% | 41.5ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:653` |
| 0.4% | 41.3ms | 0.4% | 40.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 0.4% | 40.9ms | 0.4% | 40.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.4% | 37.9ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` |
| 0.4% | 37.3ms | 0.0% | 0us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.3% | 33.3ms | 0.3% | 33.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.3% | 32.0ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:584` |
| 0.3% | 31.4ms | 0.3% | 31.4ms | `Float64Array` | `[native code]` |
| 0.3% | 31.0ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:205` |
| 0.3% | 26.8ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:751` |
| 0.3% | 26.4ms | 0.3% | 26.4ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.2% | 22.1ms | 0.2% | 20.0ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:287` |
| 0.2% | 20.6ms | 0.0% | 4.5ms | `anonymous` | `[native code]` |
| 0.2% | 19.9ms | 0.2% | 19.9ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.2% | 18.6ms | 0.2% | 18.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` |
| 0.2% | 18.6ms | 0.1% | 16.0ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:294` |
| 0.1% | 16.9ms | 0.1% | 16.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` |
| 0.1% | 16.9ms | 0.1% | 16.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` |
| 0.1% | 16.8ms | 0.1% | 16.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:609` |
| 0.1% | 16.3ms | 0.1% | 16.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` |
| 0.1% | 14.7ms | 0.0% | 2.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:627` |
| 0.1% | 14.7ms | 0.0% | 681us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` |
| 0.1% | 14.6ms | 0.0% | 900us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 0.1% | 12.3ms | 0.0% | 3.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:209` |
| 0.1% | 11.8ms | 0.1% | 11.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:696` |
| 0.1% | 11.1ms | 0.1% | 11.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` |
| 0.1% | 10.1ms | 0.1% | 10.1ms | `push` | `[native code]` |
| 0.1% | 9.7ms | 0.0% | 7.4ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.1% | 9.6ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:742` |
| 0.0% | 7.4ms | 0.0% | 7.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:681` |
| 0.0% | 7.1ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:208` |
| 0.0% | 5.9ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:743` |
| 0.0% | 5.9ms | 0.0% | 5.9ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:350` |
| 0.0% | 5.9ms | 0.0% | 652us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.0% | 5.9ms | 0.0% | 867us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:628` |
| 0.0% | 5.3ms | 0.0% | 5.3ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 5.2ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.0% | 4.6ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:763` |
| 0.0% | 4.4ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` |
| 0.0% | 4.4ms | 0.0% | 4.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:692` |
| 0.0% | 4.3ms | 0.0% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:746` |
| 0.0% | 4.1ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:728` |
| 0.0% | 3.8ms | 0.0% | 3.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:739` |
| 0.0% | 3.6ms | 0.0% | 3.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` |
| 0.0% | 3.5ms | 0.0% | 3.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:206` |
| 0.0% | 3.5ms | 0.0% | 3.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` |
| 0.0% | 3.3ms | 0.0% | 3.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:737` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:633` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `abs` | `[native code]` |
| 0.0% | 3.0ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 2.7ms | 0.0% | 2.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:741` |
| 0.0% | 2.5ms | 0.0% | 2.5ms | `reduce` | `[native code]` |
| 0.0% | 2.5ms | 0.0% | 2.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:661` |
| 0.0% | 2.3ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:21` |
| 0.0% | 2.3ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:637` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:752` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:757` |
| 0.0% | 2.2ms | 0.0% | 0us | `createIdentityMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:31` |
| 0.0% | 2.2ms | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:500` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:572` |
| 0.0% | 1.9ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:722` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:274` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.7ms | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:352` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:701` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:756` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:753` |
| 0.0% | 1.5ms | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:353` |
| 0.0% | 1.4ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 1.4ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 1.4ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 1.4ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:762` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:627` |
| 0.0% | 1.4ms | 0.0% | 0us | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:571` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 908us | 0.0% | 908us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:149` |
| 0.0% | 894us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 894us | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 894us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 892us | 0.0% | 892us | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:318` |
| 0.0% | 878us | 0.0% | 878us | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:319` |
| 0.0% | 873us | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:211` |
| 0.0% | 864us | 0.0% | 864us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 858us | 0.0% | 858us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:49` |
| 0.0% | 844us | 0.0% | 844us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:90` |
| 0.0% | 834us | 0.0% | 834us | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 819us | 0.0% | 819us | `safeObjectiveValue` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 798us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:538` |
| 0.0% | 798us | 0.0% | 798us | `min` | `[native code]` |
| 0.0% | 792us | 0.0% | 792us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:716` |
| 0.0% | 786us | 0.0% | 786us | `WriteStream` | `internal:fs/streams:198` |
| 0.0% | 778us | 0.0% | 778us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:601` |
| 0.0% | 773us | 0.0% | 773us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:170` |
| 0.0% | 772us | 0.0% | 772us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` |
| 0.0% | 768us | 0.0% | 768us | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 761us | 0.0% | 761us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:271` |
| 0.0% | 758us | 0.0% | 0us | `internal:fs/glob` | `internal:fs/glob:2` |
| 0.0% | 750us | 0.0% | 0us | `internal:streams/operators` | `internal:streams/operators:2` |
| 0.0% | 735us | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 735us | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 735us | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 732us | 0.0% | 732us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:689` |
| 0.0% | 728us | 0.0% | 728us | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:335` |
| 0.0% | 726us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:514` |
| 0.0% | 726us | 0.0% | 726us | `slice` | `[native code]` |
| 0.0% | 703us | 0.0% | 703us | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:312` |
| 0.0% | 700us | 0.0% | 700us | `(unknown)` | `[native code]` |
| 0.0% | 697us | 0.0% | 697us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:480` |
| 0.0% | 692us | 0.0% | 692us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 677us | 0.0% | 677us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:641` |
| 0.0% | 656us | 0.0% | 656us | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 653us | 0.0% | 653us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` |
| 0.0% | 647us | 0.0% | 647us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 634us | 0.0% | 634us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:571` |
| 0.0% | 627us | 0.0% | 627us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:50` |
| 0.0% | 618us | 0.0% | 618us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |

## Function Details

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` | Self: 36.4% (3.09s) | Total: 38.3% (3.25s) | Samples: 4040

**Called by:**
- `step` (4252)

**Calls:**
- `hypot` (212)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` | Self: 21.6% (1.83s) | Total: 21.6% (1.83s) | Samples: 2396

**Called by:**
- `runTrial` (2388)
- `runTrial` (8)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` | Self: 4.9% (419.7ms) | Total: 5.1% (439.5ms) | Samples: 554

**Called by:**
- `step` (579)

**Calls:**
- `createZeroVector` (15)
- `fill` (10)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:253` | Self: 4.5% (385.0ms) | Total: 5.0% (425.7ms) | Samples: 497

**Called by:**
- `step` (550)

**Calls:**
- `from` (53)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:688` | Self: 3.9% (336.4ms) | Total: 4.4% (380.6ms) | Samples: 437

**Called by:**
- `runTrial` (483)
- `runTrial` (1)

**Calls:**
- `createZeroMatrix` (38)
- `from` (9)

### `mahalanobisSquaredWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:308` | Self: 3.5% (303.7ms) | Total: 3.6% (309.8ms) | Samples: 389

**Called by:**
- `step` (397)

**Calls:**
- `createZeroVector` (5)
- `fill` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:733` | Self: 2.3% (198.0ms) | Total: 2.3% (198.0ms) | Samples: 260

**Called by:**
- `runTrial` (259)
- `runTrial` (1)

### `map`
`[native code]` | Self: 2.0% (177.2ms) | Total: 4.2% (363.3ms) | Samples: 232

**Called by:**
- `step` (97)
- `step` (92)
- `step` (83)
- `(anonymous)` (78)
- `cloneMatrix` (71)
- `(anonymous)` (19)
- `jacobiEigenSymmetric` (12)
- `jacobiEigenSymmetric` (8)
- `step` (5)
- `step` (3)
- `map` (3)
- `step` (3)
- `jacobiEigenSymmetric` (1)
- `step` (1)
- `alignProjectionBasis` (1)

**Calls:**
- `(anonymous)` (80)
- `(anonymous)` (59)
- `(anonymous)` (54)
- `(anonymous)` (22)
- `(anonymous)` (22)
- `abs` (4)
- `map` (3)
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:708` | Self: 2.0% (176.5ms) | Total: 2.0% (176.5ms) | Samples: 234

**Called by:**
- `runTrial` (231)
- `runTrial` (3)

### `hypot`
`[native code]` | Self: 1.8% (161.2ms) | Total: 1.8% (161.2ms) | Samples: 212

**Called by:**
- `jacobiEigenSymmetric` (212)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:705` | Self: 1.7% (147.5ms) | Total: 1.7% (147.5ms) | Samples: 193

**Called by:**
- `runTrial` (192)
- `runTrial` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.6% (136.4ms) | Total: 2.2% (194.1ms) | Samples: 177

**Called by:**
- `step` (252)

**Calls:**
- `fill` (75)

### `fill`
`[native code]` | Self: 1.5% (127.8ms) | Total: 1.5% (127.8ms) | Samples: 167

**Called by:**
- `sampleGaussianVectorND` (75)
- `ellipsoidObjective` (46)
- `from` (32)
- `transformFromEigenCoordinates` (10)
- `mahalanobisSquaredWithEigensystem` (3)
- `whitenWithEigensystem` (1)

### `requireFiniteVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:419` | Self: 0.8% (72.7ms) | Total: 0.8% (72.7ms) | Samples: 94

**Called by:**
- `projectTo3D` (94)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` | Self: 0.8% (71.4ms) | Total: 1.0% (89.1ms) | Samples: 92

**Called by:**
- `step` (116)

**Calls:**
- `Float64Array` (24)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.8% (70.5ms) | Total: 0.8% (70.5ms) | Samples: 90

**Called by:**
- `map` (59)
- `some` (28)
- `from` (3)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` | Self: 0.5% (46.8ms) | Total: 0.5% (46.8ms) | Samples: 60

**Called by:**
- `step` (60)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 0.4% (40.9ms) | Total: 0.4% (40.9ms) | Samples: 54

**Called by:**
- `map` (54)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` | Self: 0.4% (40.7ms) | Total: 0.4% (41.3ms) | Samples: 53

**Called by:**
- `runTrial` (52)
- `runTrial` (2)

**Calls:**
- `adaptationPoint` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` | Self: 0.4% (37.7ms) | Total: 0.7% (62.4ms) | Samples: 49

**Called by:**
- `step` (82)

**Calls:**
- `from` (33)

### `sort`
`[native code]` | Self: 0.4% (36.7ms) | Total: 0.4% (41.6ms) | Samples: 45

**Called by:**
- `jacobiEigenSymmetric` (36)
- `step` (16)

**Calls:**
- `(anonymous)` (5)
- `(anonymous)` (2)

### `from`
`[native code]` | Self: 0.4% (35.1ms) | Total: 1.3% (113.4ms) | Samples: 39

**Called by:**
- `reconstructSymmetric` (53)
- `createZeroMatrix` (38)
- `jacobiEigenSymmetric` (33)
- `step` (9)
- `jacobiEigenSymmetric` (2)
- `createIdentityMatrix` (1)

**Calls:**
- `(anonymous)` (40)
- `fill` (32)
- `(anonymous)` (22)
- `(anonymous)` (3)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` | Self: 0.4% (34.2ms) | Total: 0.8% (69.2ms) | Samples: 42

**Called by:**
- `step` (88)

**Calls:**
- `fill` (46)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.3% (33.3ms) | Total: 0.3% (33.3ms) | Samples: 40

**Called by:**
- `from` (40)

### `some`
`[native code]` | Self: 0.3% (32.9ms) | Total: 1.2% (109.5ms) | Samples: 40

**Called by:**
- `validateSquareFiniteMatrix` (68)
- `(anonymous)` (66)
- `projectTo3D` (2)
- `some` (1)

**Calls:**
- `(anonymous)` (67)
- `(anonymous)` (28)
- `(anonymous)` (1)
- `some` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:725` | Self: 0.3% (32.2ms) | Total: 1.6% (139.5ms) | Samples: 39

**Called by:**
- `forEach` (177)

**Calls:**
- `projectTo3D` (107)
- `projectTo3D` (16)
- `projectTo3D` (11)
- `projectTo3D` (2)
- `projectTo3D` (2)

### `Float64Array`
`[native code]` | Self: 0.3% (31.4ms) | Total: 0.3% (31.4ms) | Samples: 42

**Called by:**
- `jacobiEigenSymmetric` (24)
- `jacobiEigenSymmetric` (18)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.3% (26.4ms) | Total: 0.3% (26.4ms) | Samples: 35

**Called by:**
- `(anonymous)` (16)
- `step` (12)
- `step` (7)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:287` | Self: 0.2% (20.0ms) | Total: 0.2% (22.1ms) | Samples: 26

**Called by:**
- `step` (29)

**Calls:**
- `createZeroVector` (2)
- `fill` (1)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` | Self: 0.2% (19.9ms) | Total: 0.2% (19.9ms) | Samples: 25

**Called by:**
- `transformFromEigenCoordinates` (15)
- `mahalanobisSquaredWithEigensystem` (5)
- `whitenWithEigensystem` (3)
- `whitenWithEigensystem` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` | Self: 0.2% (18.6ms) | Total: 0.2% (18.6ms) | Samples: 21

**Called by:**
- `runTrial` (21)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` | Self: 0.1% (16.9ms) | Total: 0.1% (16.9ms) | Samples: 22

**Called by:**
- `runTrial` (22)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` | Self: 0.1% (16.9ms) | Total: 0.1% (16.9ms) | Samples: 22

**Called by:**
- `map` (22)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:609` | Self: 0.1% (16.8ms) | Total: 0.1% (16.8ms) | Samples: 22

**Called by:**
- `map` (22)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` | Self: 0.1% (16.3ms) | Total: 0.1% (16.3ms) | Samples: 22

**Called by:**
- `from` (22)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:294` | Self: 0.1% (16.0ms) | Total: 0.2% (18.6ms) | Samples: 22

**Called by:**
- `step` (25)

**Calls:**
- `createZeroVector` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:696` | Self: 0.1% (11.8ms) | Total: 0.1% (11.8ms) | Samples: 14

**Called by:**
- `runTrial` (14)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` | Self: 0.1% (11.1ms) | Total: 0.1% (11.1ms) | Samples: 14

**Called by:**
- `runTrial` (14)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` | Self: 0.1% (10.3ms) | Total: 0.9% (83.1ms) | Samples: 13

**Called by:**
- `(anonymous)` (107)

**Calls:**
- `requireFiniteVector` (94)

### `push`
`[native code]` | Self: 0.1% (10.1ms) | Total: 0.1% (10.1ms) | Samples: 13

**Called by:**
- `step` (9)
- `step` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` | Self: 0.0% (7.5ms) | Total: 0.9% (77.7ms) | Samples: 10

**Called by:**
- `runTrial` (99)

**Calls:**
- `ellipsoidObjective` (88)
- `safeObjectiveValue` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:681` | Self: 0.0% (7.4ms) | Total: 0.0% (7.4ms) | Samples: 9

**Called by:**
- `runTrial` (9)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` | Self: 0.0% (7.4ms) | Total: 0.1% (9.7ms) | Samples: 9

**Called by:**
- `(anonymous)` (11)
- `step` (1)

**Calls:**
- `coordinate` (2)
- `coordinate` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:350` | Self: 0.0% (5.9ms) | Total: 0.0% (5.9ms) | Samples: 8

**Called by:**
- `step` (8)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (5.3ms) | Total: 0.0% (5.3ms) | Samples: 7

**Called by:**
- `step` (7)

### `anonymous`
`[native code]` | Self: 0.0% (4.5ms) | Total: 0.2% (20.6ms) | Samples: 6

**Called by:**
- `(anonymous)` (4)
- `node:fs` (4)
- `node:fs/promises` (3)
- `internal:fs/streams` (2)
- `get WriteStream` (2)
- `internal:stream` (2)
- `node:stream` (2)
- `node:events` (1)
- `internal:validators` (1)
- `internal:fs/glob` (1)
- `internal:streams/pipeline` (1)
- `internal:shared` (1)
- `internal:streams/operators` (1)
- `internal:streams/compose` (1)
- `internal:streams/duplex` (1)

**Calls:**
- `node:fs` (4)
- `node:fs/promises` (3)
- `internal:fs/streams` (2)
- `internal:stream` (2)
- `node:stream` (2)
- `internal:fs/glob` (1)
- `node:events` (1)
- `internal:validators` (1)
- `internal:streams/pipeline` (1)
- `internal:shared` (1)
- `internal:streams/operators` (1)
- `internal:streams/compose` (1)
- `internal:streams/duplex` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:692` | Self: 0.0% (4.4ms) | Total: 0.0% (4.4ms) | Samples: 6

**Called by:**
- `runTrial` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:739` | Self: 0.0% (3.8ms) | Total: 0.0% (3.8ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:608` | Self: 0.0% (3.6ms) | Total: 5.3% (451.1ms) | Samples: 5

**Called by:**
- `runTrial` (591)
- `runTrial` (2)

**Calls:**
- `transformFromEigenCoordinates` (579)
- `transformFromEigenCoordinates` (7)
- `transformFromEigenCoordinates` (1)
- `transformFromEigenCoordinates` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` | Self: 0.0% (3.6ms) | Total: 0.0% (3.6ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:206` | Self: 0.0% (3.5ms) | Total: 0.0% (3.5ms) | Samples: 5

**Called by:**
- `sort` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` | Self: 0.0% (3.5ms) | Total: 0.0% (3.5ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:737` | Self: 0.0% (3.3ms) | Total: 0.0% (3.3ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:633` | Self: 0.0% (3.1ms) | Total: 0.0% (3.1ms) | Samples: 4

**Called by:**
- `forEach` (4)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:209` | Self: 0.0% (3.0ms) | Total: 0.1% (12.3ms) | Samples: 4

**Called by:**
- `step` (16)

**Calls:**
- `map` (12)

### `abs`
`[native code]` | Self: 0.0% (3.0ms) | Total: 0.0% (3.0ms) | Samples: 4

**Called by:**
- `map` (4)

### `forEach`
`[native code]` | Self: 0.0% (2.8ms) | Total: 1.8% (159.6ms) | Samples: 4

**Called by:**
- `step` (197)
- `step` (7)

**Calls:**
- `(anonymous)` (177)
- `(anonymous)` (19)
- `(anonymous)` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:741` | Self: 0.0% (2.7ms) | Total: 0.0% (2.7ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` | Self: 0.0% (2.7ms) | Total: 2.5% (213.3ms) | Samples: 4

**Called by:**
- `runTrial` (277)

**Calls:**
- `sampleGaussianVectorND` (252)
- `push` (9)
- `sampleGaussianVectorND` (8)
- `sampleGaussianVectorND` (2)
- `sampleGaussianVectorND` (2)

### `reduce`
`[native code]` | Self: 0.0% (2.5ms) | Total: 0.0% (2.5ms) | Samples: 3

**Called by:**
- `step` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:627` | Self: 0.0% (2.5ms) | Total: 0.1% (14.7ms) | Samples: 3

**Called by:**
- `runTrial` (19)

**Calls:**
- `sort` (16)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:661` | Self: 0.0% (2.5ms) | Total: 0.0% (2.5ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:21` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 3

**Called by:**
- `step` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:752` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:757` | Self: 0.0% (2.2ms) | Total: 0.0% (2.2ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:572` | Self: 0.0% (2.2ms) | Total: 0.0% (2.2ms) | Samples: 3

**Called by:**
- `(anonymous)` (2)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:746` | Self: 0.0% (2.1ms) | Total: 0.0% (4.3ms) | Samples: 3

**Called by:**
- `runTrial` (6)

**Calls:**
- `map` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` | Self: 0.0% (2.1ms) | Total: 3.7% (314.4ms) | Samples: 3

**Called by:**
- `runTrial` (401)
- `runTrial` (2)

**Calls:**
- `mahalanobisSquaredWithEigensystem` (397)
- `mahalanobisSquaredWithEigensystem` (1)
- `mahalanobisSquaredWithEigensystem` (1)
- `mahalanobisSquaredWithEigensystem` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:274` | Self: 0.0% (1.7ms) | Total: 0.0% (1.7ms) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:723` | Self: 0.0% (1.7ms) | Total: 1.8% (156.9ms) | Samples: 2

**Called by:**
- `runTrial` (200)

**Calls:**
- `forEach` (197)
- `map` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` | Self: 0.0% (1.7ms) | Total: 0.0% (1.7ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `nextOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.7ms) | Total: 0.0% (1.7ms) | Samples: 2

**Called by:**
- `sampleGaussianVectorND` (2)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 2

**Called by:**
- `projectTo3D` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:701` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:671` | Self: 0.0% (1.6ms) | Total: 0.7% (60.0ms) | Samples: 2

**Called by:**
- `map` (80)

**Calls:**
- `map` (78)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:756` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:763` | Self: 0.0% (1.6ms) | Total: 0.0% (4.6ms) | Samples: 2

**Called by:**
- `runTrial` (6)

**Calls:**
- `push` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:753` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:728` | Self: 0.0% (1.5ms) | Total: 0.0% (4.1ms) | Samples: 2

**Called by:**
- `runTrial` (5)

**Calls:**
- `reduce` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:762` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:627` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `sort` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` | Self: 0.0% (1.3ms) | Total: 0.8% (74.9ms) | Samples: 2

**Called by:**
- `runTrial` (99)

**Calls:**
- `map` (97)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:149` | Self: 0.0% (908us) | Total: 0.0% (908us) | Samples: 1

**Called by:**
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` | Self: 0.0% (900us) | Total: 0.1% (14.6ms) | Samples: 1

**Called by:**
- `step` (19)

**Calls:**
- `Float64Array` (18)

### `mahalanobisSquaredWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:318` | Self: 0.0% (892us) | Total: 0.0% (892us) | Samples: 1

**Called by:**
- `step` (1)

### `mahalanobisSquaredWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:319` | Self: 0.0% (878us) | Total: 0.0% (878us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:628` | Self: 0.0% (867us) | Total: 0.0% (5.9ms) | Samples: 1

**Called by:**
- `runTrial` (8)

**Calls:**
- `forEach` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (864us) | Total: 0.0% (864us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:49` | Self: 0.0% (858us) | Total: 0.0% (858us) | Samples: 1

**Called by:**
- `(module)` (1)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:90` | Self: 0.0% (844us) | Total: 0.0% (844us) | Samples: 1

**Called by:**
- `jacobiEigenSymmetric` (1)

### `nextHalfOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (834us) | Total: 0.0% (834us) | Samples: 1

**Called by:**
- `sampleGaussianVectorND` (1)

### `safeObjectiveValue`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (819us) | Total: 0.0% (819us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:609` | Self: 0.0% (809us) | Total: 0.8% (71.9ms) | Samples: 1

**Called by:**
- `runTrial` (92)
- `runTrial` (1)

**Calls:**
- `map` (92)

### `min`
`[native code]` | Self: 0.0% (798us) | Total: 0.0% (798us) | Samples: 1

**Called by:**
- `CMAESOptimizerND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:716` | Self: 0.0% (792us) | Total: 0.0% (792us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `WriteStream`
`internal:fs/streams:198` | Self: 0.0% (786us) | Total: 0.0% (786us) | Samples: 1

**Called by:**
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:601` | Self: 0.0% (778us) | Total: 0.0% (778us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:170` | Self: 0.0% (773us) | Total: 0.0% (773us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` | Self: 0.0% (772us) | Total: 0.0% (772us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (768us) | Total: 0.0% (768us) | Samples: 1

**Called by:**
- `step` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:271` | Self: 0.0% (761us) | Total: 0.0% (761us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:689` | Self: 0.0% (732us) | Total: 0.0% (732us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `nextHalfOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:335` | Self: 0.0% (728us) | Total: 0.0% (728us) | Samples: 1

**Called by:**
- `sampleGaussianVectorND` (1)

### `slice`
`[native code]` | Self: 0.0% (726us) | Total: 0.0% (726us) | Samples: 1

**Called by:**
- `CMAESOptimizerND` (1)

### `mahalanobisSquaredWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:312` | Self: 0.0% (703us) | Total: 0.0% (703us) | Samples: 1

**Called by:**
- `step` (1)

### `(unknown)`
`[native code]` | Self: 0.0% (700us) | Total: 0.0% (700us) | Samples: 1

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:480` | Self: 0.0% (697us) | Total: 0.0% (697us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (696us) | Total: 0.6% (53.7ms) | Samples: 1

**Called by:**
- `some` (67)

**Calls:**
- `some` (66)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (692us) | Total: 0.0% (692us) | Samples: 1

**Called by:**
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` | Self: 0.0% (681us) | Total: 0.1% (14.7ms) | Samples: 1

**Called by:**
- `forEach` (19)
- `map` (1)

**Calls:**
- `map` (19)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:641` | Self: 0.0% (677us) | Total: 0.0% (677us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:712` | Self: 0.0% (675us) | Total: 5.0% (426.3ms) | Samples: 1

**Called by:**
- `runTrial` (548)
- `runTrial` (3)

**Calls:**
- `reconstructSymmetric` (550)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (656us) | Total: 0.0% (656us) | Samples: 1

**Called by:**
- `projectTo3D` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` | Self: 0.0% (653us) | Total: 0.0% (653us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` | Self: 0.0% (652us) | Total: 0.0% (5.9ms) | Samples: 1

**Calls:**
- `(anonymous)` (7)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (647us) | Total: 0.0% (647us) | Samples: 1

**Called by:**
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:571` | Self: 0.0% (634us) | Total: 0.0% (634us) | Samples: 1

**Called by:**
- `some` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:50` | Self: 0.0% (627us) | Total: 0.0% (627us) | Samples: 1

**Called by:**
- `(module)` (1)

### `adaptationPoint`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (618us) | Total: 0.0% (618us) | Samples: 1

**Called by:**
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:211` | Self: 0.0% (0us) | Total: 0.0% (873us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `map` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:208` | Self: 0.0% (0us) | Total: 0.0% (7.1ms) | Samples: 0

**Called by:**
- `step` (8)

**Calls:**
- `map` (8)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (735us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.0% (0us) | Total: 0.4% (37.3ms) | Samples: 0

**Called by:**
- `step` (38)

**Calls:**
- `from` (38)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:514` | Self: 0.0% (0us) | Total: 0.0% (726us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `slice` (1)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (894us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (2.3ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (0us) | Total: 0.6% (54.3ms) | Samples: 0

**Called by:**
- `jacobiEigenSymmetric` (68)

**Calls:**
- `some` (68)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` | Self: 0.0% (0us) | Total: 41.6% (3.53s) | Samples: 0

**Called by:**
- `runTrial` (4583)
- `runTrial` (25)

**Calls:**
- `jacobiEigenSymmetric` (4252)
- `jacobiEigenSymmetric` (116)
- `jacobiEigenSymmetric` (82)
- `jacobiEigenSymmetric` (69)
- `jacobiEigenSymmetric` (38)
- `jacobiEigenSymmetric` (19)
- `jacobiEigenSymmetric` (16)
- `jacobiEigenSymmetric` (8)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (735us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:500` | Self: 0.0% (0us) | Total: 0.0% (2.2ms) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `createIdentityMatrix` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:751` | Self: 0.0% (0us) | Total: 0.3% (26.8ms) | Samples: 0

**Called by:**
- `runTrial` (35)

**Calls:**
- `cloneMatrix` (30)
- `map` (5)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (894us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` | Self: 0.0% (0us) | Total: 7.0% (596.0ms) | Samples: 0

**Calls:**
- `runTrial` (755)
- `runTrial` (6)
- `runTrial` (1)
- `runTrial` (1)
- `runTrial` (1)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (3.0ms) | Samples: 0

**Called by:**
- `anonymous` (4)

**Calls:**
- `anonymous` (4)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` | Self: 0.0% (0us) | Total: 99.4% (8.44s) | Samples: 0

**Called by:**
- `(module)` (10226)
- `(module)` (755)

**Calls:**
- `step` (4583)
- `step` (2388)
- `step` (591)
- `step` (548)
- `step` (483)
- `step` (401)
- `step` (277)
- `step` (259)
- `step` (231)
- `step` (200)
- `step` (192)
- `step` (103)
- `step` (99)
- `step` (99)
- `step` (92)
- `step` (83)
- `step` (54)
- `step` (52)
- `step` (35)
- `step` (22)
- `step` (21)
- `step` (19)
- `step` (14)
- `step` (14)
- `step` (13)
- `step` (9)
- `step` (8)
- `step` (8)
- `step` (6)
- `step` (6)
- `step` (6)
- `step` (5)
- `step` (5)
- `step` (5)
- `step` (4)
- `step` (4)
- `step` (4)
- `step` (3)
- `step` (3)
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
- `step` (1)
- `step` (1)
- `step` (1)

### `internal:fs/glob`
`internal:fs/glob:2` | Self: 0.0% (0us) | Total: 0.0% (758us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` | Self: 0.0% (0us) | Total: 0.6% (55.2ms) | Samples: 0

**Called by:**
- `step` (69)

**Calls:**
- `validateSquareFiniteMatrix` (68)
- `validateSquareFiniteMatrix` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:352` | Self: 0.0% (0us) | Total: 0.0% (1.7ms) | Samples: 0

**Called by:**
- `step` (2)

**Calls:**
- `nextOpenUnit` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:743` | Self: 0.0% (0us) | Total: 0.0% (5.9ms) | Samples: 0

**Called by:**
- `runTrial` (8)

**Calls:**
- `projectTo3D` (7)
- `projectTo3D` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` | Self: 0.0% (0us) | Total: 0.7% (62.4ms) | Samples: 0

**Called by:**
- `runTrial` (83)

**Calls:**
- `map` (83)

### `internal:streams/operators`
`internal:streams/operators:2` | Self: 0.0% (0us) | Total: 0.0% (750us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:353` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `step` (2)

**Calls:**
- `nextHalfOpenUnit` (1)
- `nextHalfOpenUnit` (1)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:653` | Self: 0.0% (0us) | Total: 0.4% (41.5ms) | Samples: 0

**Called by:**
- `runTrial` (54)
- `runTrial` (1)

**Calls:**
- `whitenWithEigensystem` (29)
- `whitenWithEigensystem` (25)
- `whitenWithEigensystem` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:584` | Self: 0.0% (0us) | Total: 0.3% (32.0ms) | Samples: 0

**Called by:**
- `step` (42)

**Calls:**
- `cloneMatrix` (41)
- `map` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` | Self: 0.0% (0us) | Total: 0.0% (4.4ms) | Samples: 0

**Called by:**
- `(module)` (3)
- `(module)` (1)

**Calls:**
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (5.2ms) | Samples: 0

**Called by:**
- `(module)` (7)

**Calls:**
- `anonymous` (4)
- `get WriteStream` (2)
- `WriteStream` (1)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (735us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 0.0% (0us) | Total: 0.6% (54.4ms) | Samples: 0

**Called by:**
- `alignProjectionBasis` (41)
- `step` (30)

**Calls:**
- `map` (71)

### `createIdentityMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:31` | Self: 0.0% (0us) | Total: 0.0% (2.2ms) | Samples: 0

**Called by:**
- `CMAESOptimizerND` (1)

**Calls:**
- `from` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:721` | Self: 0.0% (0us) | Total: 0.9% (79.5ms) | Samples: 0

**Called by:**
- `runTrial` (103)

**Calls:**
- `alignProjectionBasis` (60)
- `alignProjectionBasis` (42)
- `alignProjectionBasis` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:205` | Self: 0.0% (0us) | Total: 0.3% (31.0ms) | Samples: 0

**Called by:**
- `step` (38)

**Calls:**
- `sort` (36)
- `from` (2)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:571` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `(anonymous)` (2)

**Calls:**
- `some` (2)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `(anonymous)` (2)

**Calls:**
- `anonymous` (2)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:538` | Self: 0.0% (0us) | Total: 0.0% (798us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `min` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` | Self: 0.0% (0us) | Total: 0.4% (37.9ms) | Samples: 0

**Called by:**
- `(module)` (44)
- `(module)` (6)

**Calls:**
- `step` (25)
- `step` (8)
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

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:637` | Self: 0.0% (0us) | Total: 0.0% (2.3ms) | Samples: 0

**Called by:**
- `runTrial` (3)

**Calls:**
- `createZeroVector` (3)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:722` | Self: 0.0% (0us) | Total: 0.0% (1.9ms) | Samples: 0

**Called by:**
- `runTrial` (3)

**Calls:**
- `map` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:742` | Self: 0.0% (0us) | Total: 0.1% (9.6ms) | Samples: 0

**Called by:**
- `runTrial` (13)

**Calls:**
- `projectTo3D` (12)
- `projectTo3D` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` | Self: 0.0% (0us) | Total: 92.9% (7.89s) | Samples: 0

**Calls:**
- `runTrial` (10226)
- `runTrial` (44)
- `runTrial` (3)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (894us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 92.1% | 7.82s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 7.3% | 627.9ms | `[native code]` |
| 0.4% | 36.3ms | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.0% | 786us | `internal:fs/streams` |
