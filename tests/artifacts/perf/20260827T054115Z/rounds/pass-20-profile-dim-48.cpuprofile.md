# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 9.29s | 12033 | 500us | 147 |

**Top 10:** `jacobiEigenSymmetric` 59.7%, `step` 9.1%, `reconstructSymmetric` 4.6%, `transformFromEigenCoordinates` 4.3%, `mahalanobisSquaredWithEigensystem` 3.4%, `step` 2.5%, `hypot` 1.8%, `step` 1.8%, `step` 1.6%, `step` 1.3%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 59.7% | 5.54s | 61.5% | 5.72s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` |
| 9.1% | 849.4ms | 9.1% | 849.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` |
| 4.6% | 432.3ms | 5.0% | 464.8ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:253` |
| 4.3% | 403.6ms | 4.3% | 408.7ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 3.4% | 323.8ms | 3.5% | 326.4ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:308` |
| 2.5% | 234.0ms | 2.5% | 234.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:701` |
| 1.8% | 175.0ms | 1.8% | 175.0ms | `hypot` | `[native code]` |
| 1.8% | 170.6ms | 1.8% | 170.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:733` |
| 1.6% | 149.6ms | 1.6% | 149.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:708` |
| 1.3% | 124.3ms | 1.3% | 124.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:705` |
| 0.8% | 75.9ms | 1.8% | 168.5ms | `map` | `[native code]` |
| 0.7% | 70.7ms | 1.1% | 102.4ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.7% | 66.5ms | 0.7% | 66.5ms | `fill` | `[native code]` |
| 0.6% | 62.4ms | 0.6% | 62.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.6% | 56.5ms | 0.7% | 65.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.4% | 45.2ms | 0.7% | 68.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` |
| 0.4% | 42.2ms | 0.9% | 88.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.4% | 41.1ms | 0.4% | 41.1ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` |
| 0.3% | 32.4ms | 0.3% | 32.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.3% | 28.6ms | 0.3% | 28.6ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` |
| 0.3% | 28.3ms | 0.3% | 28.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.2% | 26.7ms | 0.5% | 54.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:688` |
| 0.2% | 26.6ms | 0.2% | 26.6ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:294` |
| 0.2% | 22.5ms | 0.2% | 24.1ms | `sort` | `[native code]` |
| 0.2% | 22.0ms | 0.2% | 22.0ms | `Float64Array` | `[native code]` |
| 0.2% | 21.5ms | 0.9% | 85.0ms | `from` | `[native code]` |
| 0.2% | 20.6ms | 0.2% | 20.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` |
| 0.2% | 20.2ms | 0.2% | 21.1ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:287` |
| 0.2% | 19.6ms | 0.7% | 69.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:725` |
| 0.2% | 18.6ms | 0.4% | 37.6ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.1% | 12.9ms | 0.1% | 12.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 0.1% | 9.7ms | 0.1% | 9.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` |
| 0.0% | 7.5ms | 0.0% | 7.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` |
| 0.0% | 5.6ms | 0.0% | 5.6ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.0% | 4.7ms | 0.0% | 4.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 4.6ms | 1.0% | 92.9ms | `some` | `[native code]` |
| 0.0% | 4.5ms | 0.0% | 4.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:681` |
| 0.0% | 3.8ms | 0.0% | 3.8ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.7ms | 0.0% | 3.7ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:350` |
| 0.0% | 3.6ms | 0.2% | 18.9ms | `anonymous` | `[native code]` |
| 0.0% | 3.6ms | 0.0% | 4.3ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:696` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `push` | `[native code]` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` |
| 0.0% | 2.8ms | 0.4% | 40.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:737` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:275` |
| 0.0% | 1.6ms | 0.0% | 2.2ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:354` |
| 0.0% | 1.6ms | 0.4% | 43.4ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:757` |
| 0.0% | 1.5ms | 0.0% | 2.3ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:571` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` |
| 0.0% | 892us | 0.0% | 892us | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 891us | 0.0% | 891us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:487` |
| 0.0% | 886us | 0.0% | 886us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:357` |
| 0.0% | 878us | 0.0% | 878us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` |
| 0.0% | 876us | 0.0% | 876us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` |
| 0.0% | 874us | 0.0% | 874us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:206` |
| 0.0% | 874us | 0.0% | 874us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:637` |
| 0.0% | 871us | 0.0% | 871us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` |
| 0.0% | 865us | 0.0% | 865us | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:290` |
| 0.0% | 861us | 0.0% | 861us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:271` |
| 0.0% | 857us | 0.0% | 857us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 857us | 0.0% | 857us | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 850us | 0.0% | 850us | `reduce` | `[native code]` |
| 0.0% | 842us | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:728` |
| 0.0% | 835us | 0.2% | 23.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:609` |
| 0.0% | 830us | 0.0% | 830us | `defineCustomPromisifyArgs` | `internal:promisify` |
| 0.0% | 811us | 0.0% | 811us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` |
| 0.0% | 809us | 0.2% | 20.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:205` |
| 0.0% | 808us | 0.2% | 24.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` |
| 0.0% | 795us | 0.0% | 795us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:762` |
| 0.0% | 794us | 0.0% | 794us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:756` |
| 0.0% | 780us | 0.3% | 32.5ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:584` |
| 0.0% | 776us | 0.0% | 776us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 770us | 5.0% | 467.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:712` |
| 0.0% | 759us | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:743` |
| 0.0% | 756us | 0.0% | 756us | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 750us | 0.0% | 750us | `every` | `[native code]` |
| 0.0% | 748us | 64.0% | 5.94s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` |
| 0.0% | 733us | 0.0% | 733us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:194` |
| 0.0% | 730us | 0.5% | 46.8ms | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.0% | 727us | 0.0% | 727us | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:575` |
| 0.0% | 723us | 0.0% | 6.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:722` |
| 0.0% | 722us | 0.0% | 722us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:627` |
| 0.0% | 717us | 0.0% | 717us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:663` |
| 0.0% | 717us | 0.0% | 717us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 710us | 0.0% | 710us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.0% | 703us | 0.0% | 703us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:752` |
| 0.0% | 700us | 0.0% | 3.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:746` |
| 0.0% | 694us | 0.0% | 2.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:209` |
| 0.0% | 692us | 0.0% | 692us | `abs` | `[native code]` |
| 0.0% | 690us | 0.0% | 690us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:188` |
| 0.0% | 681us | 0.0% | 681us | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:257` |
| 0.0% | 679us | 0.9% | 86.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:723` |
| 0.0% | 678us | 0.0% | 678us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:716` |
| 0.0% | 673us | 0.0% | 673us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:602` |
| 0.0% | 656us | 4.4% | 412.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:608` |
| 0.0% | 650us | 3.5% | 327.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` |
| 0.0% | 644us | 0.0% | 644us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:601` |
| 0.0% | 639us | 0.0% | 639us | `setPrototypeDirectOrThrow` | `[native code]` |
| 0.0% | 633us | 0.0% | 633us | `writeFast` | `internal:fs/streams` |
| 0.0% | 562us | 0.0% | 562us | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 99.5% | 9.24s | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 85.3% | 7.92s | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` |
| 64.0% | 5.94s | 0.0% | 748us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` |
| 61.5% | 5.72s | 59.7% | 5.54s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` |
| 14.6% | 1.35s | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` |
| 9.1% | 849.4ms | 9.1% | 849.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` |
| 5.0% | 467.2ms | 0.0% | 770us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:712` |
| 5.0% | 464.8ms | 4.6% | 432.3ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:253` |
| 4.4% | 412.6ms | 0.0% | 656us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:608` |
| 4.3% | 408.7ms | 4.3% | 403.6ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 3.5% | 327.0ms | 0.0% | 650us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` |
| 3.5% | 326.4ms | 3.4% | 323.8ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:308` |
| 2.5% | 234.0ms | 2.5% | 234.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:701` |
| 1.8% | 175.0ms | 1.8% | 175.0ms | `hypot` | `[native code]` |
| 1.8% | 170.6ms | 1.8% | 170.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:733` |
| 1.8% | 168.5ms | 0.8% | 75.9ms | `map` | `[native code]` |
| 1.6% | 149.6ms | 1.6% | 149.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:708` |
| 1.3% | 124.3ms | 1.3% | 124.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:705` |
| 1.2% | 117.9ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` |
| 1.1% | 102.4ms | 0.7% | 70.7ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.0% | 92.9ms | 0.0% | 4.6ms | `some` | `[native code]` |
| 0.9% | 88.2ms | 0.4% | 42.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.9% | 86.5ms | 0.0% | 679us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:723` |
| 0.9% | 85.8ms | 0.0% | 0us | `forEach` | `[native code]` |
| 0.9% | 85.0ms | 0.2% | 21.5ms | `from` | `[native code]` |
| 0.7% | 69.0ms | 0.2% | 19.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:725` |
| 0.7% | 68.3ms | 0.4% | 45.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` |
| 0.7% | 66.5ms | 0.7% | 66.5ms | `fill` | `[native code]` |
| 0.7% | 65.0ms | 0.6% | 56.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.6% | 62.4ms | 0.6% | 62.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.6% | 61.1ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:721` |
| 0.5% | 54.6ms | 0.2% | 26.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:688` |
| 0.5% | 49.2ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:653` |
| 0.5% | 46.8ms | 0.0% | 730us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.5% | 46.8ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 0.4% | 43.4ms | 0.0% | 1.6ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.4% | 41.1ms | 0.4% | 41.1ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` |
| 0.4% | 40.5ms | 0.0% | 2.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 0.4% | 39.4ms | 0.0% | 0us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.4% | 37.6ms | 0.2% | 18.6ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.3% | 36.8ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` |
| 0.3% | 32.5ms | 0.0% | 780us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:584` |
| 0.3% | 32.4ms | 0.3% | 32.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.3% | 32.4ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:751` |
| 0.3% | 28.6ms | 0.3% | 28.6ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` |
| 0.3% | 28.3ms | 0.3% | 28.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.2% | 26.6ms | 0.2% | 26.6ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:294` |
| 0.2% | 26.1ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` |
| 0.2% | 24.1ms | 0.2% | 22.5ms | `sort` | `[native code]` |
| 0.2% | 24.0ms | 0.0% | 808us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` |
| 0.2% | 23.5ms | 0.0% | 835us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:609` |
| 0.2% | 22.0ms | 0.2% | 22.0ms | `Float64Array` | `[native code]` |
| 0.2% | 21.1ms | 0.2% | 20.2ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:287` |
| 0.2% | 20.8ms | 0.0% | 809us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:205` |
| 0.2% | 20.6ms | 0.2% | 20.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` |
| 0.2% | 18.9ms | 0.0% | 3.6ms | `anonymous` | `[native code]` |
| 0.1% | 13.5ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 0.1% | 12.9ms | 0.1% | 12.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 0.1% | 9.7ms | 0.1% | 9.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` |
| 0.1% | 9.3ms | 0.0% | 0us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:671` |
| 0.0% | 7.5ms | 0.0% | 7.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` |
| 0.0% | 6.3ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:627` |
| 0.0% | 6.2ms | 0.0% | 0us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` |
| 0.0% | 6.1ms | 0.0% | 723us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:722` |
| 0.0% | 5.7ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.0% | 5.6ms | 0.0% | 5.6ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.0% | 5.1ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.0% | 4.7ms | 0.0% | 4.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 4.5ms | 0.0% | 4.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:681` |
| 0.0% | 4.4ms | 0.0% | 0us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.0% | 4.3ms | 0.0% | 3.6ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 0.0% | 3.9ms | 0.0% | 700us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:746` |
| 0.0% | 3.8ms | 0.0% | 3.8ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.7ms | 0.0% | 3.7ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:350` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:696` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `push` | `[native code]` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` |
| 0.0% | 2.9ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:742` |
| 0.0% | 2.7ms | 0.0% | 694us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:209` |
| 0.0% | 2.3ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:211` |
| 0.0% | 2.3ms | 0.0% | 759us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:743` |
| 0.0% | 2.3ms | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:352` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.3ms | 0.0% | 1.5ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:571` |
| 0.0% | 2.3ms | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:356` |
| 0.0% | 2.2ms | 0.0% | 1.6ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:354` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:737` |
| 0.0% | 1.8ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 1.8ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 1.6ms | 0.0% | 842us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:728` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:275` |
| 0.0% | 1.6ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 1.6ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 1.6ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 1.6ms | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 1.6ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:757` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` |
| 0.0% | 892us | 0.0% | 892us | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 891us | 0.0% | 891us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:487` |
| 0.0% | 891us | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` |
| 0.0% | 886us | 0.0% | 886us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:357` |
| 0.0% | 878us | 0.0% | 878us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` |
| 0.0% | 876us | 0.0% | 876us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` |
| 0.0% | 876us | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 876us | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 874us | 0.0% | 874us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:637` |
| 0.0% | 874us | 0.0% | 874us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:206` |
| 0.0% | 871us | 0.0% | 871us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` |
| 0.0% | 865us | 0.0% | 865us | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:290` |
| 0.0% | 861us | 0.0% | 861us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:271` |
| 0.0% | 857us | 0.0% | 857us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 857us | 0.0% | 857us | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 857us | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:353` |
| 0.0% | 850us | 0.0% | 850us | `reduce` | `[native code]` |
| 0.0% | 849us | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:208` |
| 0.0% | 830us | 0.0% | 0us | `node:fs` | `node:fs:305` |
| 0.0% | 830us | 0.0% | 830us | `defineCustomPromisifyArgs` | `internal:promisify` |
| 0.0% | 811us | 0.0% | 811us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` |
| 0.0% | 795us | 0.0% | 795us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:762` |
| 0.0% | 794us | 0.0% | 794us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:756` |
| 0.0% | 776us | 0.0% | 776us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 756us | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:741` |
| 0.0% | 756us | 0.0% | 756us | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 750us | 0.0% | 0us | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:419` |
| 0.0% | 750us | 0.0% | 750us | `every` | `[native code]` |
| 0.0% | 733us | 0.0% | 733us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:194` |
| 0.0% | 727us | 0.0% | 727us | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:575` |
| 0.0% | 722us | 0.0% | 722us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:627` |
| 0.0% | 717us | 0.0% | 717us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 717us | 0.0% | 717us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:663` |
| 0.0% | 710us | 0.0% | 710us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.0% | 703us | 0.0% | 703us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:752` |
| 0.0% | 692us | 0.0% | 692us | `abs` | `[native code]` |
| 0.0% | 690us | 0.0% | 690us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:188` |
| 0.0% | 681us | 0.0% | 681us | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:257` |
| 0.0% | 678us | 0.0% | 678us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:716` |
| 0.0% | 673us | 0.0% | 673us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:602` |
| 0.0% | 644us | 0.0% | 644us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:601` |
| 0.0% | 639us | 0.0% | 0us | `internal:primordials` | `internal:primordials:73` |
| 0.0% | 639us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 639us | 0.0% | 639us | `setPrototypeDirectOrThrow` | `[native code]` |
| 0.0% | 639us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 639us | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 633us | 0.0% | 633us | `writeFast` | `internal:fs/streams` |
| 0.0% | 562us | 0.0% | 562us | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |

## Function Details

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` | Self: 59.7% (5.54s) | Total: 61.5% (5.72s) | Samples: 7212

**Called by:**
- `step` (7435)

**Calls:**
- `hypot` (223)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` | Self: 9.1% (849.4ms) | Total: 9.1% (849.4ms) | Samples: 1107

**Called by:**
- `runTrial` (1104)
- `runTrial` (3)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:253` | Self: 4.6% (432.3ms) | Total: 5.0% (464.8ms) | Samples: 552

**Called by:**
- `step` (589)

**Calls:**
- `from` (37)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` | Self: 4.3% (403.6ms) | Total: 4.3% (408.7ms) | Samples: 511

**Called by:**
- `step` (518)

**Calls:**
- `fill` (4)
- `createZeroVector` (3)

### `mahalanobisSquaredWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:308` | Self: 3.4% (323.8ms) | Total: 3.5% (326.4ms) | Samples: 422

**Called by:**
- `step` (425)

**Calls:**
- `createZeroVector` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:701` | Self: 2.5% (234.0ms) | Total: 2.5% (234.0ms) | Samples: 302

**Called by:**
- `runTrial` (300)
- `runTrial` (2)

### `hypot`
`[native code]` | Self: 1.8% (175.0ms) | Total: 1.8% (175.0ms) | Samples: 223

**Called by:**
- `jacobiEigenSymmetric` (223)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:733` | Self: 1.8% (170.6ms) | Total: 1.8% (170.6ms) | Samples: 222

**Called by:**
- `runTrial` (222)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:708` | Self: 1.6% (149.6ms) | Total: 1.6% (149.6ms) | Samples: 194

**Called by:**
- `runTrial` (194)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:705` | Self: 1.3% (124.3ms) | Total: 1.3% (124.3ms) | Samples: 158

**Called by:**
- `runTrial` (157)
- `runTrial` (1)

### `map`
`[native code]` | Self: 0.8% (75.9ms) | Total: 1.8% (168.5ms) | Samples: 98

**Called by:**
- `cloneMatrix` (52)
- `step` (34)
- `step` (31)
- `step` (29)
- `step` (24)
- `(anonymous)` (12)
- `(anonymous)` (8)
- `step` (7)
- `alignProjectionBasis` (7)
- `map` (4)
- `step` (4)
- `jacobiEigenSymmetric` (3)
- `jacobiEigenSymmetric` (3)
- `jacobiEigenSymmetric` (1)

**Calls:**
- `(anonymous)` (81)
- `(anonymous)` (23)
- `(anonymous)` (12)
- `map` (4)
- `abs` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.7% (70.7ms) | Total: 1.1% (102.4ms) | Samples: 91

**Called by:**
- `step` (132)

**Calls:**
- `fill` (41)

### `fill`
`[native code]` | Self: 0.7% (66.5ms) | Total: 0.7% (66.5ms) | Samples: 87

**Called by:**
- `sampleGaussianVectorND` (41)
- `ellipsoidObjective` (25)
- `from` (13)
- `transformFromEigenCoordinates` (4)
- `sampleGaussianVectorND` (3)
- `sampleGaussianVectorND` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 0.6% (62.4ms) | Total: 0.6% (62.4ms) | Samples: 81

**Called by:**
- `map` (81)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` | Self: 0.6% (56.5ms) | Total: 0.7% (65.0ms) | Samples: 73

**Called by:**
- `step` (84)

**Calls:**
- `Float64Array` (11)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` | Self: 0.4% (45.2ms) | Total: 0.7% (68.3ms) | Samples: 59

**Called by:**
- `step` (89)

**Calls:**
- `from` (30)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.4% (42.2ms) | Total: 0.9% (88.2ms) | Samples: 57

**Called by:**
- `some` (119)

**Calls:**
- `some` (62)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` | Self: 0.4% (41.1ms) | Total: 0.4% (41.1ms) | Samples: 55

**Called by:**
- `projectTo3D` (55)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.3% (32.4ms) | Total: 0.3% (32.4ms) | Samples: 29

**Called by:**
- `map` (23)
- `forEach` (5)
- `from` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` | Self: 0.3% (28.6ms) | Total: 0.3% (28.6ms) | Samples: 38

**Called by:**
- `step` (38)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.3% (28.3ms) | Total: 0.3% (28.3ms) | Samples: 36

**Called by:**
- `from` (36)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:688` | Self: 0.2% (26.7ms) | Total: 0.5% (54.6ms) | Samples: 35

**Called by:**
- `runTrial` (71)

**Calls:**
- `from` (29)
- `createZeroMatrix` (6)
- `createZeroMatrix` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:294` | Self: 0.2% (26.6ms) | Total: 0.2% (26.6ms) | Samples: 36

**Called by:**
- `step` (36)

### `sort`
`[native code]` | Self: 0.2% (22.5ms) | Total: 0.2% (24.1ms) | Samples: 29

**Called by:**
- `jacobiEigenSymmetric` (23)
- `step` (8)

**Calls:**
- `(anonymous)` (1)
- `(anonymous)` (1)

### `Float64Array`
`[native code]` | Self: 0.2% (22.0ms) | Total: 0.2% (22.0ms) | Samples: 27

**Called by:**
- `jacobiEigenSymmetric` (16)
- `jacobiEigenSymmetric` (11)

### `from`
`[native code]` | Self: 0.2% (21.5ms) | Total: 0.9% (85.0ms) | Samples: 28

**Called by:**
- `reconstructSymmetric` (37)
- `jacobiEigenSymmetric` (30)
- `step` (29)
- `createZeroMatrix` (6)
- `jacobiEigenSymmetric` (3)

**Calls:**
- `(anonymous)` (36)
- `(anonymous)` (27)
- `fill` (13)
- `(anonymous)` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` | Self: 0.2% (20.6ms) | Total: 0.2% (20.6ms) | Samples: 27

**Called by:**
- `from` (27)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:287` | Self: 0.2% (20.2ms) | Total: 0.2% (21.1ms) | Samples: 24

**Called by:**
- `step` (25)

**Calls:**
- `createZeroVector` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:725` | Self: 0.2% (19.6ms) | Total: 0.7% (69.0ms) | Samples: 25

**Called by:**
- `forEach` (91)

**Calls:**
- `projectTo3D` (58)
- `projectTo3D` (5)
- `projectTo3D` (3)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` | Self: 0.2% (18.6ms) | Total: 0.4% (37.6ms) | Samples: 25

**Called by:**
- `step` (50)

**Calls:**
- `fill` (25)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` | Self: 0.1% (12.9ms) | Total: 0.1% (12.9ms) | Samples: 17

**Called by:**
- `runTrial` (17)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` | Self: 0.1% (9.7ms) | Total: 0.1% (9.7ms) | Samples: 13

**Called by:**
- `runTrial` (13)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` | Self: 0.0% (7.5ms) | Total: 0.0% (7.5ms) | Samples: 10

**Called by:**
- `runTrial` (10)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` | Self: 0.0% (5.6ms) | Total: 0.0% (5.6ms) | Samples: 7

**Called by:**
- `mahalanobisSquaredWithEigensystem` (3)
- `transformFromEigenCoordinates` (3)
- `whitenWithEigensystem` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (4.7ms) | Total: 0.0% (4.7ms) | Samples: 4

**Called by:**
- `runTrial` (3)
- `runTrial` (1)

### `some`
`[native code]` | Self: 0.0% (4.6ms) | Total: 1.0% (92.9ms) | Samples: 6

**Called by:**
- `validateSquareFiniteMatrix` (62)
- `(anonymous)` (62)
- `projectTo3D` (1)

**Calls:**
- `(anonymous)` (119)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:681` | Self: 0.0% (4.5ms) | Total: 0.0% (4.5ms) | Samples: 6

**Called by:**
- `runTrial` (6)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (3.8ms) | Total: 0.0% (3.8ms) | Samples: 5

**Called by:**
- `step` (3)
- `step` (2)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:350` | Self: 0.0% (3.7ms) | Total: 0.0% (3.7ms) | Samples: 5

**Called by:**
- `step` (5)

### `anonymous`
`[native code]` | Self: 0.0% (3.6ms) | Total: 0.2% (18.9ms) | Samples: 5

**Called by:**
- `(anonymous)` (5)
- `node:fs/promises` (3)
- `node:fs` (3)
- `internal:fs/streams` (2)
- `get WriteStream` (2)
- `internal:stream` (2)
- `internal:streams/compose` (2)
- `node:stream` (2)
- `node:events` (1)
- `internal:validators` (1)
- `internal:streams/pipeline` (1)
- `internal:shared` (1)
- `internal:streams/duplex` (1)

**Calls:**
- `node:fs/promises` (3)
- `node:fs` (3)
- `internal:fs/streams` (2)
- `internal:stream` (2)
- `internal:streams/compose` (2)
- `node:stream` (2)
- `node:events` (1)
- `internal:streams/pipeline` (1)
- `internal:validators` (1)
- `internal:shared` (1)
- `internal:primordials` (1)
- `node:fs` (1)
- `internal:streams/duplex` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` | Self: 0.0% (3.6ms) | Total: 0.0% (4.3ms) | Samples: 5

**Called by:**
- `(anonymous)` (5)
- `step` (1)

**Calls:**
- `requireFiniteVector` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:696` | Self: 0.0% (3.1ms) | Total: 0.0% (3.1ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `push`
`[native code]` | Self: 0.0% (3.0ms) | Total: 0.0% (3.0ms) | Samples: 4

**Called by:**
- `step` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` | Self: 0.0% (3.0ms) | Total: 0.0% (3.0ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` | Self: 0.0% (2.8ms) | Total: 0.4% (40.5ms) | Samples: 4

**Called by:**
- `runTrial` (54)

**Calls:**
- `ellipsoidObjective` (50)

### `nextOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 3

**Called by:**
- `sampleGaussianVectorND` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:737` | Self: 0.0% (2.2ms) | Total: 0.0% (2.2ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:275` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 2

**Called by:**
- `step` (2)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:354` | Self: 0.0% (1.6ms) | Total: 0.0% (2.2ms) | Samples: 2

**Called by:**
- `step` (3)

**Calls:**
- `fill` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` | Self: 0.0% (1.6ms) | Total: 0.4% (43.4ms) | Samples: 2

**Called by:**
- `(anonymous)` (58)

**Calls:**
- `coordinate` (55)
- `coordinate` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:757` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:571` | Self: 0.0% (1.5ms) | Total: 0.0% (2.3ms) | Samples: 2

**Called by:**
- `(anonymous)` (3)

**Calls:**
- `some` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (892us) | Total: 0.0% (892us) | Samples: 1

**Called by:**
- `step` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:487` | Self: 0.0% (891us) | Total: 0.0% (891us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:357` | Self: 0.0% (886us) | Total: 0.0% (886us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` | Self: 0.0% (878us) | Total: 0.0% (878us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` | Self: 0.0% (876us) | Total: 0.0% (876us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:206` | Self: 0.0% (874us) | Total: 0.0% (874us) | Samples: 1

**Called by:**
- `sort` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:637` | Self: 0.0% (874us) | Total: 0.0% (874us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` | Self: 0.0% (871us) | Total: 0.0% (871us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:290` | Self: 0.0% (865us) | Total: 0.0% (865us) | Samples: 1

**Called by:**
- `step` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:271` | Self: 0.0% (861us) | Total: 0.0% (861us) | Samples: 1

**Called by:**
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (857us) | Total: 0.0% (857us) | Samples: 1

**Called by:**
- `step` (1)

### `nextHalfOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (857us) | Total: 0.0% (857us) | Samples: 1

**Called by:**
- `sampleGaussianVectorND` (1)

### `reduce`
`[native code]` | Self: 0.0% (850us) | Total: 0.0% (850us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:728` | Self: 0.0% (842us) | Total: 0.0% (1.6ms) | Samples: 1

**Called by:**
- `runTrial` (2)

**Calls:**
- `reduce` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:609` | Self: 0.0% (835us) | Total: 0.2% (23.5ms) | Samples: 1

**Called by:**
- `runTrial` (30)

**Calls:**
- `map` (29)

### `defineCustomPromisifyArgs`
`internal:promisify` | Self: 0.0% (830us) | Total: 0.0% (830us) | Samples: 1

**Called by:**
- `node:fs` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` | Self: 0.0% (811us) | Total: 0.0% (811us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:205` | Self: 0.0% (809us) | Total: 0.2% (20.8ms) | Samples: 1

**Called by:**
- `step` (27)

**Calls:**
- `sort` (23)
- `from` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` | Self: 0.0% (808us) | Total: 0.2% (24.0ms) | Samples: 1

**Called by:**
- `runTrial` (32)

**Calls:**
- `map` (31)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:762` | Self: 0.0% (795us) | Total: 0.0% (795us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:756` | Self: 0.0% (794us) | Total: 0.0% (794us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:584` | Self: 0.0% (780us) | Total: 0.3% (32.5ms) | Samples: 1

**Called by:**
- `step` (42)

**Calls:**
- `cloneMatrix` (34)
- `map` (7)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (776us) | Total: 0.0% (776us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:712` | Self: 0.0% (770us) | Total: 5.0% (467.2ms) | Samples: 1

**Called by:**
- `runTrial` (590)
- `runTrial` (2)

**Calls:**
- `reconstructSymmetric` (589)
- `reconstructSymmetric` (1)
- `reconstructSymmetric` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:743` | Self: 0.0% (759us) | Total: 0.0% (2.3ms) | Samples: 1

**Called by:**
- `runTrial` (3)

**Calls:**
- `projectTo3D` (2)

### `variancePercent`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (756us) | Total: 0.0% (756us) | Samples: 1

**Called by:**
- `step` (1)

### `every`
`[native code]` | Self: 0.0% (750us) | Total: 0.0% (750us) | Samples: 1

**Called by:**
- `requireFiniteVector` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` | Self: 0.0% (748us) | Total: 64.0% (5.94s) | Samples: 1

**Called by:**
- `runTrial` (7697)
- `runTrial` (32)

**Calls:**
- `jacobiEigenSymmetric` (7435)
- `jacobiEigenSymmetric` (89)
- `jacobiEigenSymmetric` (84)
- `jacobiEigenSymmetric` (63)
- `jacobiEigenSymmetric` (27)
- `jacobiEigenSymmetric` (16)
- `jacobiEigenSymmetric` (4)
- `jacobiEigenSymmetric` (3)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:194` | Self: 0.0% (733us) | Total: 0.0% (733us) | Samples: 1

**Called by:**
- `step` (1)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (730us) | Total: 0.5% (46.8ms) | Samples: 1

**Called by:**
- `jacobiEigenSymmetric` (63)

**Calls:**
- `some` (62)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:575` | Self: 0.0% (727us) | Total: 0.0% (727us) | Samples: 1

**Called by:**
- `projectTo3D` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:722` | Self: 0.0% (723us) | Total: 0.0% (6.1ms) | Samples: 1

**Called by:**
- `runTrial` (8)

**Calls:**
- `map` (7)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:627` | Self: 0.0% (722us) | Total: 0.0% (722us) | Samples: 1

**Called by:**
- `sort` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:663` | Self: 0.0% (717us) | Total: 0.0% (717us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (717us) | Total: 0.0% (717us) | Samples: 1

**Called by:**
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.0% (710us) | Total: 0.0% (710us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:752` | Self: 0.0% (703us) | Total: 0.0% (703us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:746` | Self: 0.0% (700us) | Total: 0.0% (3.9ms) | Samples: 1

**Called by:**
- `runTrial` (5)

**Calls:**
- `map` (4)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:209` | Self: 0.0% (694us) | Total: 0.0% (2.7ms) | Samples: 1

**Called by:**
- `step` (4)

**Calls:**
- `map` (3)

### `abs`
`[native code]` | Self: 0.0% (692us) | Total: 0.0% (692us) | Samples: 1

**Called by:**
- `map` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:188` | Self: 0.0% (690us) | Total: 0.0% (690us) | Samples: 1

**Called by:**
- `step` (1)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:257` | Self: 0.0% (681us) | Total: 0.0% (681us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:723` | Self: 0.0% (679us) | Total: 0.9% (86.5ms) | Samples: 1

**Called by:**
- `runTrial` (105)

**Calls:**
- `forEach` (104)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:716` | Self: 0.0% (678us) | Total: 0.0% (678us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:602` | Self: 0.0% (673us) | Total: 0.0% (673us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:608` | Self: 0.0% (656us) | Total: 4.4% (412.6ms) | Samples: 1

**Called by:**
- `runTrial` (521)
- `runTrial` (2)

**Calls:**
- `transformFromEigenCoordinates` (518)
- `transformFromEigenCoordinates` (2)
- `transformFromEigenCoordinates` (1)
- `transformFromEigenCoordinates` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` | Self: 0.0% (650us) | Total: 3.5% (327.0ms) | Samples: 1

**Called by:**
- `runTrial` (425)
- `runTrial` (1)

**Calls:**
- `mahalanobisSquaredWithEigensystem` (425)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:601` | Self: 0.0% (644us) | Total: 0.0% (644us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `setPrototypeDirectOrThrow`
`[native code]` | Self: 0.0% (639us) | Total: 0.0% (639us) | Samples: 1

**Called by:**
- `internal:primordials` (1)

### `writeFast`
`internal:fs/streams` | Self: 0.0% (633us) | Total: 0.0% (633us) | Samples: 1

**Called by:**
- `(module)` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (562us) | Total: 0.0% (562us) | Samples: 1

**Called by:**
- `step` (1)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` | Self: 0.0% (0us) | Total: 85.3% (7.92s) | Samples: 0

**Calls:**
- `runTrial` (10236)
- `runTrial` (33)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (876us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` | Self: 0.0% (0us) | Total: 0.1% (13.5ms) | Samples: 0

**Called by:**
- `step` (16)

**Calls:**
- `Float64Array` (16)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (639us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `(anonymous)` (2)

**Calls:**
- `anonymous` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:211` | Self: 0.0% (0us) | Total: 0.0% (2.3ms) | Samples: 0

**Called by:**
- `step` (3)

**Calls:**
- `map` (3)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (639us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `forEach`
`[native code]` | Self: 0.0% (0us) | Total: 0.9% (85.8ms) | Samples: 0

**Called by:**
- `step` (104)

**Calls:**
- `(anonymous)` (91)
- `(anonymous)` (8)
- `(anonymous)` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:741` | Self: 0.0% (0us) | Total: 0.0% (756us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `variancePercent` (1)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 0.0% (0us) | Total: 0.4% (39.4ms) | Samples: 0

**Called by:**
- `alignProjectionBasis` (34)
- `step` (18)

**Calls:**
- `map` (52)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` | Self: 0.0% (0us) | Total: 0.0% (891us) | Samples: 0

**Called by:**
- `(module)` (1)

**Calls:**
- `CMAESOptimizerND` (1)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (1.8ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (5.1ms) | Samples: 0

**Called by:**
- `(module)` (7)

**Calls:**
- `anonymous` (5)
- `get WriteStream` (2)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (876us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` | Self: 0.0% (0us) | Total: 1.2% (117.9ms) | Samples: 0

**Called by:**
- `runTrial` (152)

**Calls:**
- `sampleGaussianVectorND` (132)
- `sampleGaussianVectorND` (5)
- `push` (4)
- `sampleGaussianVectorND` (3)
- `sampleGaussianVectorND` (3)
- `sampleGaussianVectorND` (3)
- `sampleGaussianVectorND` (1)
- `sampleGaussianVectorND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:751` | Self: 0.0% (0us) | Total: 0.3% (32.4ms) | Samples: 0

**Called by:**
- `runTrial` (42)

**Calls:**
- `map` (24)
- `cloneMatrix` (18)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` | Self: 0.0% (0us) | Total: 99.5% (9.24s) | Samples: 0

**Called by:**
- `(module)` (10236)
- `(module)` (1742)

**Calls:**
- `step` (7697)
- `step` (1104)
- `step` (590)
- `step` (521)
- `step` (425)
- `step` (300)
- `step` (222)
- `step` (194)
- `step` (157)
- `step` (152)
- `step` (105)
- `step` (80)
- `step` (71)
- `step` (62)
- `step` (54)
- `step` (42)
- `step` (33)
- `step` (32)
- `step` (30)
- `step` (17)
- `step` (13)
- `step` (10)
- `step` (8)
- `step` (8)
- `step` (6)
- `step` (5)
- `step` (4)
- `step` (4)
- `step` (4)
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
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` | Self: 0.0% (0us) | Total: 0.0% (5.7ms) | Samples: 0

**Calls:**
- `(anonymous)` (7)
- `writeFast` (1)

### `requireFiniteVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:419` | Self: 0.0% (0us) | Total: 0.0% (750us) | Samples: 0

**Called by:**
- `projectTo3D` (1)

**Calls:**
- `every` (1)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.0% (0us) | Total: 0.0% (4.4ms) | Samples: 0

**Called by:**
- `step` (6)

**Calls:**
- `from` (6)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:352` | Self: 0.0% (0us) | Total: 0.0% (2.3ms) | Samples: 0

**Called by:**
- `step` (3)

**Calls:**
- `nextOpenUnit` (3)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` | Self: 0.0% (0us) | Total: 0.5% (46.8ms) | Samples: 0

**Called by:**
- `step` (63)

**Calls:**
- `validateSquareFiniteMatrix` (63)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:671` | Self: 0.0% (0us) | Total: 0.1% (9.3ms) | Samples: 0

**Called by:**
- `map` (12)

**Calls:**
- `map` (12)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:627` | Self: 0.0% (0us) | Total: 0.0% (6.3ms) | Samples: 0

**Called by:**
- `runTrial` (8)

**Calls:**
- `sort` (8)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (639us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (1.8ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` | Self: 0.0% (0us) | Total: 14.6% (1.35s) | Samples: 0

**Calls:**
- `runTrial` (1742)
- `runTrial` (13)
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:721` | Self: 0.0% (0us) | Total: 0.6% (61.1ms) | Samples: 0

**Called by:**
- `runTrial` (80)

**Calls:**
- `alignProjectionBasis` (42)
- `alignProjectionBasis` (38)

### `node:fs`
`node:fs:305` | Self: 0.0% (0us) | Total: 0.0% (830us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `defineCustomPromisifyArgs` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:353` | Self: 0.0% (0us) | Total: 0.0% (857us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `nextHalfOpenUnit` (1)

### `internal:primordials`
`internal:primordials:73` | Self: 0.0% (0us) | Total: 0.0% (639us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `setPrototypeDirectOrThrow` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` | Self: 0.0% (0us) | Total: 0.2% (26.1ms) | Samples: 0

**Called by:**
- `runTrial` (33)
- `runTrial` (1)

**Calls:**
- `map` (34)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` | Self: 0.0% (0us) | Total: 0.0% (6.2ms) | Samples: 0

**Called by:**
- `forEach` (8)

**Calls:**
- `map` (8)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` | Self: 0.0% (0us) | Total: 0.3% (36.8ms) | Samples: 0

**Called by:**
- `(module)` (33)
- `(module)` (13)

**Calls:**
- `step` (32)
- `step` (3)
- `step` (2)
- `step` (2)
- `step` (2)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:653` | Self: 0.0% (0us) | Total: 0.5% (49.2ms) | Samples: 0

**Called by:**
- `runTrial` (62)
- `runTrial` (1)

**Calls:**
- `whitenWithEigensystem` (36)
- `whitenWithEigensystem` (25)
- `whitenWithEigensystem` (1)
- `whitenWithEigensystem` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:742` | Self: 0.0% (0us) | Total: 0.0% (2.9ms) | Samples: 0

**Called by:**
- `runTrial` (4)

**Calls:**
- `projectTo3D` (3)
- `projectTo3D` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:208` | Self: 0.0% (0us) | Total: 0.0% (849us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `map` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:356` | Self: 0.0% (0us) | Total: 0.0% (2.3ms) | Samples: 0

**Called by:**
- `step` (3)

**Calls:**
- `fill` (3)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 95.4% | 8.87s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 4.2% | 397.9ms | `[native code]` |
| 0.2% | 18.6ms | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.0% | 830us | `internal:promisify` |
| 0.0% | 633us | `internal:fs/streams` |
