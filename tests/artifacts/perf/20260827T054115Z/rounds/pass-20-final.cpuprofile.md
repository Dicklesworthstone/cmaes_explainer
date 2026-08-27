# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 8.36s | 10840 | 500us | 156 |

**Top 10:** `jacobiEigenSymmetric` 37.6%, `step` 21.7%, `transformFromEigenCoordinates` 5.2%, `step` 4.1%, `mahalanobisSquaredWithEigensystem` 3.4%, `reconstructSymmetric` 2.7%, `step` 2.3%, `step` 2.2%, `map` 2.1%, `step` 1.7%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 37.6% | 3.14s | 39.3% | 3.28s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` |
| 21.7% | 1.81s | 21.7% | 1.81s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` |
| 5.2% | 439.4ms | 5.3% | 449.8ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 4.1% | 349.3ms | 4.5% | 384.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:688` |
| 3.4% | 289.4ms | 3.5% | 294.1ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:308` |
| 2.7% | 229.9ms | 3.3% | 283.2ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:253` |
| 2.3% | 199.4ms | 2.3% | 199.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:708` |
| 2.2% | 184.4ms | 2.2% | 184.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:733` |
| 2.1% | 176.0ms | 4.7% | 396.4ms | `map` | `[native code]` |
| 1.7% | 146.8ms | 1.7% | 146.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:705` |
| 1.7% | 143.7ms | 1.7% | 143.7ms | `hypot` | `[native code]` |
| 1.7% | 142.9ms | 1.7% | 142.9ms | `fill` | `[native code]` |
| 1.5% | 132.5ms | 2.5% | 212.9ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.3% | 113.5ms | 1.3% | 113.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.1% | 92.8ms | 1.1% | 92.8ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.7% | 60.8ms | 0.8% | 73.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.5% | 47.5ms | 0.5% | 47.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.5% | 47.4ms | 1.5% | 127.2ms | `from` | `[native code]` |
| 0.5% | 44.8ms | 1.5% | 126.7ms | `some` | `[native code]` |
| 0.5% | 44.7ms | 0.9% | 81.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` |
| 0.4% | 37.0ms | 0.4% | 37.0ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` |
| 0.4% | 34.4ms | 0.4% | 34.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.3% | 30.2ms | 0.4% | 34.1ms | `sort` | `[native code]` |
| 0.3% | 29.9ms | 0.3% | 29.9ms | `Float64Array` | `[native code]` |
| 0.3% | 26.7ms | 0.3% | 29.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 0.3% | 26.0ms | 1.5% | 129.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:725` |
| 0.2% | 23.8ms | 0.2% | 23.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` |
| 0.2% | 22.7ms | 0.2% | 22.7ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:294` |
| 0.2% | 20.4ms | 0.6% | 57.7ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.2% | 20.2ms | 0.2% | 24.9ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:287` |
| 0.2% | 18.3ms | 0.2% | 18.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` |
| 0.2% | 17.0ms | 0.2% | 17.0ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.1% | 14.3ms | 0.1% | 14.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` |
| 0.1% | 13.8ms | 0.1% | 13.8ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:350` |
| 0.1% | 10.5ms | 0.1% | 10.5ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.1% | 9.6ms | 0.1% | 12.0ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 0.1% | 8.9ms | 0.1% | 9.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` |
| 0.1% | 8.7ms | 0.1% | 8.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:696` |
| 0.0% | 7.0ms | 0.0% | 7.0ms | `push` | `[native code]` |
| 0.0% | 6.4ms | 0.7% | 64.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 0.0% | 5.1ms | 0.0% | 7.4ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.0% | 4.8ms | 0.2% | 21.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:627` |
| 0.0% | 4.8ms | 0.2% | 20.6ms | `anonymous` | `[native code]` |
| 0.0% | 4.5ms | 0.0% | 4.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:681` |
| 0.0% | 3.9ms | 2.8% | 239.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` |
| 0.0% | 3.8ms | 0.7% | 63.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:609` |
| 0.0% | 3.8ms | 0.0% | 4.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` |
| 0.0% | 3.6ms | 0.0% | 3.6ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:572` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:206` |
| 0.0% | 2.9ms | 0.1% | 9.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:209` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:312` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:602` |
| 0.0% | 2.2ms | 3.4% | 287.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:712` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:739` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:737` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:752` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.7ms | 0.1% | 8.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:746` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.0% | 1.7ms | 0.0% | 2.4ms | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:419` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `integerArgument` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:13` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:26` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `abs` | `[native code]` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:753` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` |
| 0.0% | 1.6ms | 3.5% | 298.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:701` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:762` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.4ms | 5.5% | 461.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:608` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:757` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:663` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:21` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:692` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:722` |
| 0.0% | 895us | 0.0% | 895us | `max` | `[native code]` |
| 0.0% | 885us | 0.0% | 1.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:661` |
| 0.0% | 879us | 0.0% | 879us | `sqrt` | `[native code]` |
| 0.0% | 876us | 0.0% | 876us | `filter` | `[native code]` |
| 0.0% | 874us | 0.0% | 874us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:728` |
| 0.0% | 874us | 0.0% | 874us | `createSafeIterator` | `internal:primordials:3` |
| 0.0% | 872us | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:741` |
| 0.0% | 862us | 0.0% | 862us | `slice` | `[native code]` |
| 0.0% | 857us | 0.0% | 857us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:627` |
| 0.0% | 850us | 0.0% | 850us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:603` |
| 0.0% | 849us | 1.7% | 146.5ms | `forEach` | `[native code]` |
| 0.0% | 840us | 0.0% | 840us | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 828us | 0.0% | 828us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:351` |
| 0.0% | 813us | 0.8% | 72.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:671` |
| 0.0% | 807us | 0.0% | 807us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:650` |
| 0.0% | 807us | 0.7% | 65.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` |
| 0.0% | 804us | 0.0% | 804us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` |
| 0.0% | 788us | 0.0% | 1.6ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:353` |
| 0.0% | 773us | 0.0% | 773us | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` |
| 0.0% | 773us | 0.0% | 773us | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 768us | 0.0% | 768us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` |
| 0.0% | 763us | 99.4% | 8.31s | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 0.0% | 728us | 0.0% | 728us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:633` |
| 0.0% | 719us | 0.0% | 719us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` |
| 0.0% | 697us | 0.0% | 697us | `every` | `[native code]` |
| 0.0% | 696us | 0.0% | 6.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:743` |
| 0.0% | 689us | 1.7% | 145.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:723` |
| 0.0% | 681us | 0.1% | 16.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` |
| 0.0% | 674us | 0.0% | 674us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:471` |
| 0.0% | 673us | 0.0% | 673us | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:571` |
| 0.0% | 652us | 0.5% | 48.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:653` |
| 0.0% | 641us | 0.0% | 641us | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:578` |
| 0.0% | 616us | 0.4% | 40.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:751` |
| 0.0% | 614us | 0.0% | 614us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:763` |
| 0.0% | 532us | 0.0% | 532us | `now` | `[native code]` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 99.4% | 8.31s | 0.0% | 763us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 93.3% | 7.80s | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` |
| 42.6% | 3.56s | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` |
| 39.3% | 3.28s | 37.6% | 3.14s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` |
| 21.7% | 1.81s | 21.7% | 1.81s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` |
| 6.5% | 547.6ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` |
| 5.5% | 461.8ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:608` |
| 5.3% | 449.8ms | 5.2% | 439.4ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 4.7% | 396.4ms | 2.1% | 176.0ms | `map` | `[native code]` |
| 4.5% | 384.2ms | 4.1% | 349.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:688` |
| 3.5% | 298.2ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` |
| 3.5% | 294.1ms | 3.4% | 289.4ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:308` |
| 3.4% | 287.0ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:712` |
| 3.3% | 283.2ms | 2.7% | 229.9ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:253` |
| 2.8% | 239.4ms | 0.0% | 3.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` |
| 2.5% | 212.9ms | 1.5% | 132.5ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 2.3% | 199.4ms | 2.3% | 199.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:708` |
| 2.2% | 184.4ms | 2.2% | 184.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:733` |
| 1.7% | 146.8ms | 1.7% | 146.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:705` |
| 1.7% | 146.5ms | 0.0% | 849us | `forEach` | `[native code]` |
| 1.7% | 145.6ms | 0.0% | 689us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:723` |
| 1.7% | 143.7ms | 1.7% | 143.7ms | `hypot` | `[native code]` |
| 1.7% | 142.9ms | 1.7% | 142.9ms | `fill` | `[native code]` |
| 1.5% | 129.0ms | 0.3% | 26.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:725` |
| 1.5% | 127.2ms | 0.5% | 47.4ms | `from` | `[native code]` |
| 1.5% | 126.7ms | 0.5% | 44.8ms | `some` | `[native code]` |
| 1.3% | 113.5ms | 1.3% | 113.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.1% | 92.8ms | 1.1% | 92.8ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.9% | 81.5ms | 0.5% | 44.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` |
| 0.9% | 79.1ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` |
| 0.8% | 74.5ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:721` |
| 0.8% | 73.6ms | 0.7% | 60.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.8% | 72.7ms | 0.0% | 813us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:671` |
| 0.7% | 66.7ms | 0.0% | 0us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.7% | 65.5ms | 0.0% | 807us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` |
| 0.7% | 64.1ms | 0.0% | 6.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 0.7% | 63.4ms | 0.0% | 3.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:609` |
| 0.7% | 63.3ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 0.7% | 63.3ms | 0.0% | 0us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.7% | 62.4ms | 0.0% | 0us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.6% | 57.7ms | 0.2% | 20.4ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.5% | 48.3ms | 0.0% | 652us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:653` |
| 0.5% | 47.5ms | 0.5% | 47.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.4% | 40.5ms | 0.0% | 616us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:751` |
| 0.4% | 37.4ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:584` |
| 0.4% | 37.0ms | 0.4% | 37.0ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` |
| 0.4% | 35.5ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` |
| 0.4% | 34.4ms | 0.4% | 34.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.4% | 34.1ms | 0.3% | 30.2ms | `sort` | `[native code]` |
| 0.3% | 29.9ms | 0.3% | 29.9ms | `Float64Array` | `[native code]` |
| 0.3% | 29.0ms | 0.3% | 26.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 0.2% | 24.9ms | 0.2% | 20.2ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:287` |
| 0.2% | 24.3ms | 0.0% | 0us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.2% | 23.8ms | 0.2% | 23.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` |
| 0.2% | 23.3ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:205` |
| 0.2% | 22.7ms | 0.2% | 22.7ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:294` |
| 0.2% | 21.6ms | 0.0% | 4.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:627` |
| 0.2% | 20.6ms | 0.0% | 4.8ms | `anonymous` | `[native code]` |
| 0.2% | 18.3ms | 0.2% | 18.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` |
| 0.2% | 17.0ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 0.2% | 17.0ms | 0.2% | 17.0ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.1% | 16.6ms | 0.0% | 681us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` |
| 0.1% | 14.3ms | 0.1% | 14.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` |
| 0.1% | 13.8ms | 0.1% | 13.8ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:350` |
| 0.1% | 12.0ms | 0.1% | 9.6ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 0.1% | 10.5ms | 0.1% | 10.5ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.1% | 9.7ms | 0.1% | 8.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` |
| 0.1% | 9.6ms | 0.0% | 2.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:209` |
| 0.1% | 8.7ms | 0.1% | 8.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:696` |
| 0.1% | 8.6ms | 0.0% | 1.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:746` |
| 0.0% | 8.1ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:742` |
| 0.0% | 7.4ms | 0.0% | 5.1ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.0% | 7.2ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:722` |
| 0.0% | 7.0ms | 0.0% | 7.0ms | `push` | `[native code]` |
| 0.0% | 6.3ms | 0.0% | 696us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:743` |
| 0.0% | 5.7ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.0% | 5.7ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.0% | 4.6ms | 0.0% | 3.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` |
| 0.0% | 4.5ms | 0.0% | 4.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:681` |
| 0.0% | 3.8ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:208` |
| 0.0% | 3.6ms | 0.0% | 3.6ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:572` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:206` |
| 0.0% | 2.9ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:637` |
| 0.0% | 2.6ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:211` |
| 0.0% | 2.5ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` |
| 0.0% | 2.4ms | 0.0% | 1.7ms | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:419` |
| 0.0% | 2.4ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:312` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:602` |
| 0.0% | 2.2ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:739` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:737` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:752` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.7ms | 0.0% | 885us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:661` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.0% | 1.7ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:24` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `integerArgument` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:13` |
| 0.0% | 1.7ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:26` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `abs` | `[native code]` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:753` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` |
| 0.0% | 1.6ms | 0.0% | 872us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:741` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:701` |
| 0.0% | 1.6ms | 0.0% | 788us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:353` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:762` |
| 0.0% | 1.5ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:628` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.4ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 1.4ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 1.4ms | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 1.4ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 1.4ms | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:757` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:663` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:21` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:692` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:722` |
| 0.0% | 895us | 0.0% | 895us | `max` | `[native code]` |
| 0.0% | 879us | 0.0% | 879us | `sqrt` | `[native code]` |
| 0.0% | 876us | 0.0% | 876us | `filter` | `[native code]` |
| 0.0% | 876us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:513` |
| 0.0% | 874us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 874us | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 874us | 0.0% | 874us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:728` |
| 0.0% | 874us | 0.0% | 874us | `createSafeIterator` | `internal:primordials:3` |
| 0.0% | 874us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 874us | 0.0% | 0us | `internal:primordials` | `internal:primordials:51` |
| 0.0% | 862us | 0.0% | 862us | `slice` | `[native code]` |
| 0.0% | 862us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:528` |
| 0.0% | 857us | 0.0% | 857us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:627` |
| 0.0% | 850us | 0.0% | 850us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:603` |
| 0.0% | 840us | 0.0% | 840us | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 828us | 0.0% | 828us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:351` |
| 0.0% | 807us | 0.0% | 807us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:650` |
| 0.0% | 804us | 0.0% | 804us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` |
| 0.0% | 773us | 0.0% | 773us | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` |
| 0.0% | 773us | 0.0% | 773us | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 768us | 0.0% | 768us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` |
| 0.0% | 728us | 0.0% | 728us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:633` |
| 0.0% | 719us | 0.0% | 719us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` |
| 0.0% | 700us | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 697us | 0.0% | 697us | `every` | `[native code]` |
| 0.0% | 674us | 0.0% | 674us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:471` |
| 0.0% | 673us | 0.0% | 673us | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:571` |
| 0.0% | 641us | 0.0% | 641us | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:578` |
| 0.0% | 614us | 0.0% | 614us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:763` |
| 0.0% | 532us | 0.0% | 532us | `now` | `[native code]` |
| 0.0% | 532us | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:88` |

## Function Details

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` | Self: 37.6% (3.14s) | Total: 39.3% (3.28s) | Samples: 4086

**Called by:**
- `step` (4276)

**Calls:**
- `hypot` (190)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` | Self: 21.7% (1.81s) | Total: 21.7% (1.81s) | Samples: 2340

**Called by:**
- `runTrial` (2327)
- `runTrial` (13)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` | Self: 5.2% (439.4ms) | Total: 5.3% (449.8ms) | Samples: 567

**Called by:**
- `step` (581)

**Calls:**
- `createZeroVector` (11)
- `fill` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:688` | Self: 4.1% (349.3ms) | Total: 4.5% (384.2ms) | Samples: 459

**Called by:**
- `runTrial` (504)

**Calls:**
- `createZeroMatrix` (32)
- `from` (10)
- `createZeroMatrix` (2)
- `createZeroMatrix` (1)

### `mahalanobisSquaredWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:308` | Self: 3.4% (289.4ms) | Total: 3.5% (294.1ms) | Samples: 380

**Called by:**
- `step` (386)

**Calls:**
- `createZeroVector` (5)
- `fill` (1)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:253` | Self: 2.7% (229.9ms) | Total: 3.3% (283.2ms) | Samples: 301

**Called by:**
- `step` (369)

**Calls:**
- `from` (67)
- `createZeroMatrix` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:708` | Self: 2.3% (199.4ms) | Total: 2.3% (199.4ms) | Samples: 255

**Called by:**
- `runTrial` (255)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:733` | Self: 2.2% (184.4ms) | Total: 2.2% (184.4ms) | Samples: 240

**Called by:**
- `runTrial` (239)
- `runTrial` (1)

### `map`
`[native code]` | Self: 2.1% (176.0ms) | Total: 4.7% (396.4ms) | Samples: 229

**Called by:**
- `step` (95)
- `(anonymous)` (86)
- `cloneMatrix` (86)
- `step` (84)
- `step` (79)
- `(anonymous)` (20)
- `step` (10)
- `step` (10)
- `step` (9)
- `jacobiEigenSymmetric` (7)
- `jacobiEigenSymmetric` (5)
- `jacobiEigenSymmetric` (3)
- `alignProjectionBasis` (3)
- `map` (2)

**Calls:**
- `(anonymous)` (116)
- `(anonymous)` (87)
- `(anonymous)` (59)
- `abs` (2)
- `(anonymous)` (2)
- `map` (2)
- `repair` (1)
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:705` | Self: 1.7% (146.8ms) | Total: 1.7% (146.8ms) | Samples: 194

**Called by:**
- `runTrial` (193)
- `runTrial` (1)

### `hypot`
`[native code]` | Self: 1.7% (143.7ms) | Total: 1.7% (143.7ms) | Samples: 190

**Called by:**
- `jacobiEigenSymmetric` (190)

### `fill`
`[native code]` | Self: 1.7% (142.9ms) | Total: 1.7% (142.9ms) | Samples: 189

**Called by:**
- `sampleGaussianVectorND` (106)
- `ellipsoidObjective` (49)
- `from` (28)
- `transformFromEigenCoordinates` (3)
- `mahalanobisSquaredWithEigensystem` (1)
- `whitenWithEigensystem` (1)
- `step` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.5% (132.5ms) | Total: 2.5% (212.9ms) | Samples: 170

**Called by:**
- `step` (276)

**Calls:**
- `fill` (106)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.3% (113.5ms) | Total: 1.3% (113.5ms) | Samples: 142

**Called by:**
- `map` (116)
- `some` (25)
- `from` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.1% (92.8ms) | Total: 1.1% (92.8ms) | Samples: 119

**Called by:**
- `(anonymous)` (102)
- `step` (11)
- `step` (6)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` | Self: 0.7% (60.8ms) | Total: 0.8% (73.6ms) | Samples: 79

**Called by:**
- `step` (96)

**Calls:**
- `Float64Array` (17)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 0.5% (47.5ms) | Total: 0.5% (47.5ms) | Samples: 59

**Called by:**
- `map` (59)

### `from`
`[native code]` | Self: 0.5% (47.4ms) | Total: 1.5% (127.2ms) | Samples: 62

**Called by:**
- `reconstructSymmetric` (67)
- `jacobiEigenSymmetric` (48)
- `createZeroMatrix` (32)
- `step` (10)
- `jacobiEigenSymmetric` (8)

**Calls:**
- `(anonymous)` (43)
- `(anonymous)` (31)
- `fill` (28)
- `(anonymous)` (1)

### `some`
`[native code]` | Self: 0.5% (44.8ms) | Total: 1.5% (126.7ms) | Samples: 58

**Called by:**
- `validateSquareFiniteMatrix` (83)
- `(anonymous)` (82)
- `some` (1)

**Calls:**
- `(anonymous)` (82)
- `(anonymous)` (25)
- `some` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` | Self: 0.5% (44.7ms) | Total: 0.9% (81.5ms) | Samples: 57

**Called by:**
- `step` (105)

**Calls:**
- `from` (48)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` | Self: 0.4% (37.0ms) | Total: 0.4% (37.0ms) | Samples: 49

**Called by:**
- `step` (49)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.4% (34.4ms) | Total: 0.4% (34.4ms) | Samples: 43

**Called by:**
- `from` (43)

### `sort`
`[native code]` | Self: 0.3% (30.2ms) | Total: 0.4% (34.1ms) | Samples: 41

**Called by:**
- `jacobiEigenSymmetric` (23)
- `step` (23)

**Calls:**
- `(anonymous)` (4)
- `(anonymous)` (1)

### `Float64Array`
`[native code]` | Self: 0.3% (29.9ms) | Total: 0.3% (29.9ms) | Samples: 39

**Called by:**
- `jacobiEigenSymmetric` (22)
- `jacobiEigenSymmetric` (17)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` | Self: 0.3% (26.7ms) | Total: 0.3% (29.0ms) | Samples: 36

**Called by:**
- `runTrial` (39)

**Calls:**
- `adaptationPoint` (2)
- `adaptationPoint` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:725` | Self: 0.3% (26.0ms) | Total: 1.5% (129.0ms) | Samples: 33

**Called by:**
- `forEach` (167)

**Calls:**
- `projectTo3D` (102)
- `projectTo3D` (16)
- `projectTo3D` (10)
- `projectTo3D` (5)
- `projectTo3D` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` | Self: 0.2% (23.8ms) | Total: 0.2% (23.8ms) | Samples: 31

**Called by:**
- `from` (31)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:294` | Self: 0.2% (22.7ms) | Total: 0.2% (22.7ms) | Samples: 30

**Called by:**
- `step` (30)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` | Self: 0.2% (20.4ms) | Total: 0.6% (57.7ms) | Samples: 27

**Called by:**
- `step` (76)

**Calls:**
- `fill` (49)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:287` | Self: 0.2% (20.2ms) | Total: 0.2% (24.9ms) | Samples: 26

**Called by:**
- `step` (32)

**Calls:**
- `createZeroVector` (5)
- `fill` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` | Self: 0.2% (18.3ms) | Total: 0.2% (18.3ms) | Samples: 24

**Called by:**
- `runTrial` (23)
- `runTrial` (1)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` | Self: 0.2% (17.0ms) | Total: 0.2% (17.0ms) | Samples: 22

**Called by:**
- `transformFromEigenCoordinates` (11)
- `mahalanobisSquaredWithEigensystem` (5)
- `whitenWithEigensystem` (5)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` | Self: 0.1% (14.3ms) | Total: 0.1% (14.3ms) | Samples: 19

**Called by:**
- `runTrial` (19)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:350` | Self: 0.1% (13.8ms) | Total: 0.1% (13.8ms) | Samples: 18

**Called by:**
- `step` (18)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.1% (10.5ms) | Total: 0.1% (10.5ms) | Samples: 14

**Called by:**
- `step` (14)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` | Self: 0.1% (9.6ms) | Total: 0.1% (12.0ms) | Samples: 13

**Called by:**
- `(anonymous)` (16)

**Calls:**
- `requireFiniteVector` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` | Self: 0.1% (8.9ms) | Total: 0.1% (9.7ms) | Samples: 11

**Called by:**
- `runTrial` (12)

**Calls:**
- `adaptationPoint` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:696` | Self: 0.1% (8.7ms) | Total: 0.1% (8.7ms) | Samples: 12

**Called by:**
- `runTrial` (12)

### `push`
`[native code]` | Self: 0.0% (7.0ms) | Total: 0.0% (7.0ms) | Samples: 10

**Called by:**
- `step` (9)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` | Self: 0.0% (6.4ms) | Total: 0.7% (64.1ms) | Samples: 9

**Called by:**
- `runTrial` (85)

**Calls:**
- `ellipsoidObjective` (76)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` | Self: 0.0% (5.1ms) | Total: 0.0% (7.4ms) | Samples: 7

**Called by:**
- `(anonymous)` (10)

**Calls:**
- `coordinate` (2)
- `coordinate` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:627` | Self: 0.0% (4.8ms) | Total: 0.2% (21.6ms) | Samples: 6

**Called by:**
- `runTrial` (29)

**Calls:**
- `sort` (23)

### `anonymous`
`[native code]` | Self: 0.0% (4.8ms) | Total: 0.2% (20.6ms) | Samples: 6

**Called by:**
- `(anonymous)` (4)
- `get WriteStream` (3)
- `node:fs` (3)
- `internal:fs/streams` (2)
- `internal:stream` (2)
- `internal:streams/pipeline` (2)
- `internal:streams/compose` (2)
- `node:fs/promises` (2)
- `node:stream` (2)
- `node:events` (1)
- `internal:validators` (1)
- `internal:shared` (1)
- `internal:streams/duplex` (1)

**Calls:**
- `node:fs` (3)
- `internal:fs/streams` (2)
- `internal:streams/pipeline` (2)
- `internal:stream` (2)
- `internal:streams/compose` (2)
- `node:fs/promises` (2)
- `node:stream` (2)
- `node:events` (1)
- `internal:validators` (1)
- `internal:shared` (1)
- `internal:streams/duplex` (1)
- `internal:primordials` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:681` | Self: 0.0% (4.5ms) | Total: 0.0% (4.5ms) | Samples: 6

**Called by:**
- `runTrial` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` | Self: 0.0% (3.9ms) | Total: 2.8% (239.4ms) | Samples: 5

**Called by:**
- `runTrial` (304)
- `runTrial` (7)

**Calls:**
- `sampleGaussianVectorND` (276)
- `sampleGaussianVectorND` (18)
- `push` (9)
- `sampleGaussianVectorND` (2)
- `sampleGaussianVectorND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:609` | Self: 0.0% (3.8ms) | Total: 0.7% (63.4ms) | Samples: 5

**Called by:**
- `runTrial` (84)

**Calls:**
- `map` (79)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` | Self: 0.0% (3.8ms) | Total: 0.0% (4.6ms) | Samples: 4

**Called by:**
- `runTrial` (5)

**Calls:**
- `push` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:572` | Self: 0.0% (3.6ms) | Total: 0.0% (3.6ms) | Samples: 5

**Called by:**
- `(anonymous)` (5)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:206` | Self: 0.0% (3.0ms) | Total: 0.0% (3.0ms) | Samples: 4

**Called by:**
- `sort` (4)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:209` | Self: 0.0% (2.9ms) | Total: 0.1% (9.6ms) | Samples: 4

**Called by:**
- `step` (12)

**Calls:**
- `map` (7)
- `max` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` | Self: 0.0% (2.4ms) | Total: 0.0% (2.4ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `mahalanobisSquaredWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:312` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 3

**Called by:**
- `step` (3)

### `adaptationPoint`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 3

**Called by:**
- `step` (2)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:602` | Self: 0.0% (2.2ms) | Total: 0.0% (2.2ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:712` | Self: 0.0% (2.2ms) | Total: 3.4% (287.0ms) | Samples: 3

**Called by:**
- `runTrial` (371)
- `runTrial` (3)

**Calls:**
- `reconstructSymmetric` (369)
- `reconstructSymmetric` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:739` | Self: 0.0% (2.2ms) | Total: 0.0% (2.2ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:737` | Self: 0.0% (2.1ms) | Total: 0.0% (2.1ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:752` | Self: 0.0% (2.1ms) | Total: 0.0% (2.1ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` | Self: 0.0% (1.9ms) | Total: 0.0% (1.9ms) | Samples: 3

**Called by:**
- `step` (3)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.9ms) | Total: 0.0% (1.9ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:746` | Self: 0.0% (1.7ms) | Total: 0.1% (8.6ms) | Samples: 2

**Called by:**
- `runTrial` (11)

**Calls:**
- `map` (9)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.0% (1.7ms) | Total: 0.0% (1.7ms) | Samples: 2

**Called by:**
- `step` (2)

### `requireFiniteVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:419` | Self: 0.0% (1.7ms) | Total: 0.0% (2.4ms) | Samples: 2

**Called by:**
- `projectTo3D` (3)

**Calls:**
- `every` (1)

### `integerArgument`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:13` | Self: 0.0% (1.7ms) | Total: 0.0% (1.7ms) | Samples: 1

**Called by:**
- `(module)` (1)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:26` | Self: 0.0% (1.7ms) | Total: 0.0% (1.7ms) | Samples: 2

**Called by:**
- `step` (1)
- `reconstructSymmetric` (1)

### `abs`
`[native code]` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 2

**Called by:**
- `map` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:753` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 2

**Called by:**
- `projectTo3D` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` | Self: 0.0% (1.6ms) | Total: 3.5% (298.2ms) | Samples: 2

**Called by:**
- `runTrial` (390)
- `runTrial` (1)

**Calls:**
- `mahalanobisSquaredWithEigensystem` (386)
- `mahalanobisSquaredWithEigensystem` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:701` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:762` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:608` | Self: 0.0% (1.4ms) | Total: 5.5% (461.8ms) | Samples: 2

**Called by:**
- `runTrial` (595)
- `runTrial` (2)

**Calls:**
- `transformFromEigenCoordinates` (581)
- `transformFromEigenCoordinates` (14)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:757` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:663` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `runTrial` (1)
- `runTrial` (1)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:21` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:692` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:722` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 2

**Called by:**
- `map` (2)

### `max`
`[native code]` | Self: 0.0% (895us) | Total: 0.0% (895us) | Samples: 1

**Called by:**
- `jacobiEigenSymmetric` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:661` | Self: 0.0% (885us) | Total: 0.0% (1.7ms) | Samples: 1

**Called by:**
- `runTrial` (2)

**Calls:**
- `sqrt` (1)

### `sqrt`
`[native code]` | Self: 0.0% (879us) | Total: 0.0% (879us) | Samples: 1

**Called by:**
- `step` (1)

### `filter`
`[native code]` | Self: 0.0% (876us) | Total: 0.0% (876us) | Samples: 1

**Called by:**
- `CMAESOptimizerND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:728` | Self: 0.0% (874us) | Total: 0.0% (874us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `createSafeIterator`
`internal:primordials:3` | Self: 0.0% (874us) | Total: 0.0% (874us) | Samples: 1

**Called by:**
- `internal:primordials` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:741` | Self: 0.0% (872us) | Total: 0.0% (1.6ms) | Samples: 1

**Called by:**
- `runTrial` (2)

**Calls:**
- `variancePercent` (1)

### `slice`
`[native code]` | Self: 0.0% (862us) | Total: 0.0% (862us) | Samples: 1

**Called by:**
- `CMAESOptimizerND` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:627` | Self: 0.0% (857us) | Total: 0.0% (857us) | Samples: 1

**Called by:**
- `sort` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:603` | Self: 0.0% (850us) | Total: 0.0% (850us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `forEach`
`[native code]` | Self: 0.0% (849us) | Total: 1.7% (146.5ms) | Samples: 1

**Called by:**
- `step` (187)
- `step` (2)

**Calls:**
- `(anonymous)` (167)
- `(anonymous)` (20)
- `(anonymous)` (1)

### `nextHalfOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (840us) | Total: 0.0% (840us) | Samples: 1

**Called by:**
- `sampleGaussianVectorND` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:351` | Self: 0.0% (828us) | Total: 0.0% (828us) | Samples: 1

**Called by:**
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:671` | Self: 0.0% (813us) | Total: 0.8% (72.7ms) | Samples: 1

**Called by:**
- `map` (87)

**Calls:**
- `map` (86)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:650` | Self: 0.0% (807us) | Total: 0.0% (807us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` | Self: 0.0% (807us) | Total: 0.7% (65.5ms) | Samples: 1

**Called by:**
- `runTrial` (84)
- `runTrial` (1)

**Calls:**
- `map` (84)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` | Self: 0.0% (804us) | Total: 0.0% (804us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:353` | Self: 0.0% (788us) | Total: 0.0% (1.6ms) | Samples: 1

**Called by:**
- `step` (2)

**Calls:**
- `nextHalfOpenUnit` (1)

### `repair`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` | Self: 0.0% (773us) | Total: 0.0% (773us) | Samples: 1

**Called by:**
- `map` (1)

### `variancePercent`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (773us) | Total: 0.0% (773us) | Samples: 1

**Called by:**
- `step` (1)

### `adaptationPoint`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` | Self: 0.0% (768us) | Total: 0.0% (768us) | Samples: 1

**Called by:**
- `step` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` | Self: 0.0% (763us) | Total: 99.4% (8.31s) | Samples: 1

**Called by:**
- `(module)` (10084)
- `(module)` (696)

**Calls:**
- `step` (4622)
- `step` (2327)
- `step` (595)
- `step` (504)
- `step` (390)
- `step` (371)
- `step` (304)
- `step` (255)
- `step` (239)
- `step` (193)
- `step` (187)
- `step` (97)
- `step` (95)
- `step` (85)
- `step` (84)
- `step` (84)
- `step` (63)
- `step` (52)
- `step` (39)
- `step` (29)
- `step` (23)
- `step` (19)
- `step` (12)
- `step` (12)
- `step` (11)
- `step` (11)
- `step` (10)
- `step` (7)
- `step` (6)
- `step` (5)
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

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:633` | Self: 0.0% (728us) | Total: 0.0% (728us) | Samples: 1

**Called by:**
- `forEach` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` | Self: 0.0% (719us) | Total: 0.0% (719us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `every`
`[native code]` | Self: 0.0% (697us) | Total: 0.0% (697us) | Samples: 1

**Called by:**
- `requireFiniteVector` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:743` | Self: 0.0% (696us) | Total: 0.0% (6.3ms) | Samples: 1

**Called by:**
- `runTrial` (7)

**Calls:**
- `projectTo3D` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:723` | Self: 0.0% (689us) | Total: 1.7% (145.6ms) | Samples: 1

**Called by:**
- `runTrial` (187)
- `runTrial` (1)

**Calls:**
- `forEach` (187)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` | Self: 0.0% (681us) | Total: 0.1% (16.6ms) | Samples: 1

**Called by:**
- `forEach` (20)
- `map` (1)

**Calls:**
- `map` (20)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:471` | Self: 0.0% (674us) | Total: 0.0% (674us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:571` | Self: 0.0% (673us) | Total: 0.0% (673us) | Samples: 1

**Called by:**
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:653` | Self: 0.0% (652us) | Total: 0.5% (48.3ms) | Samples: 1

**Called by:**
- `runTrial` (63)

**Calls:**
- `whitenWithEigensystem` (32)
- `whitenWithEigensystem` (30)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:578` | Self: 0.0% (641us) | Total: 0.0% (641us) | Samples: 1

**Called by:**
- `projectTo3D` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:751` | Self: 0.0% (616us) | Total: 0.4% (40.5ms) | Samples: 1

**Called by:**
- `runTrial` (52)

**Calls:**
- `cloneMatrix` (41)
- `map` (10)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:763` | Self: 0.0% (614us) | Total: 0.0% (614us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `now`
`[native code]` | Self: 0.0% (532us) | Total: 0.0% (532us) | Samples: 1

**Called by:**
- `(module)` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:584` | Self: 0.0% (0us) | Total: 0.4% (37.4ms) | Samples: 0

**Called by:**
- `step` (48)

**Calls:**
- `cloneMatrix` (45)
- `map` (3)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (874us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (874us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:211` | Self: 0.0% (0us) | Total: 0.0% (2.6ms) | Samples: 0

**Called by:**
- `step` (3)

**Calls:**
- `map` (3)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (874us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:628` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `runTrial` (2)

**Calls:**
- `forEach` (2)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` | Self: 0.0% (0us) | Total: 6.5% (547.6ms) | Samples: 0

**Calls:**
- `runTrial` (696)
- `runTrial` (7)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (2.2ms) | Samples: 0

**Called by:**
- `(anonymous)` (3)

**Calls:**
- `anonymous` (3)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (700us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (2.5ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (5.7ms) | Samples: 0

**Called by:**
- `(module)` (7)

**Calls:**
- `anonymous` (4)
- `get WriteStream` (3)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (1.7ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:88` | Self: 0.0% (0us) | Total: 0.0% (532us) | Samples: 0

**Calls:**
- `now` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` | Self: 0.0% (0us) | Total: 0.2% (17.0ms) | Samples: 0

**Called by:**
- `step` (22)

**Calls:**
- `Float64Array` (22)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` | Self: 0.0% (0us) | Total: 42.6% (3.56s) | Samples: 0

**Called by:**
- `runTrial` (4622)
- `runTrial` (16)

**Calls:**
- `jacobiEigenSymmetric` (4276)
- `jacobiEigenSymmetric` (105)
- `jacobiEigenSymmetric` (96)
- `jacobiEigenSymmetric` (83)
- `jacobiEigenSymmetric` (31)
- `jacobiEigenSymmetric` (22)
- `jacobiEigenSymmetric` (12)
- `jacobiEigenSymmetric` (5)
- `jacobiEigenSymmetric` (3)
- `jacobiEigenSymmetric` (3)
- `jacobiEigenSymmetric` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` | Self: 0.0% (0us) | Total: 0.9% (79.1ms) | Samples: 0

**Called by:**
- `runTrial` (95)

**Calls:**
- `map` (95)

### `internal:primordials`
`internal:primordials:51` | Self: 0.0% (0us) | Total: 0.0% (874us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `createSafeIterator` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` | Self: 0.0% (0us) | Total: 0.7% (63.3ms) | Samples: 0

**Called by:**
- `step` (83)

**Calls:**
- `validateSquareFiniteMatrix` (83)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` | Self: 0.0% (0us) | Total: 93.3% (7.80s) | Samples: 0

**Calls:**
- `runTrial` (10084)
- `runTrial` (41)
- `runTrial` (3)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` | Self: 0.0% (0us) | Total: 0.0% (5.7ms) | Samples: 0

**Calls:**
- `(anonymous)` (7)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (0us) | Total: 0.7% (62.4ms) | Samples: 0

**Called by:**
- `some` (82)

**Calls:**
- `some` (82)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:24` | Self: 0.0% (0us) | Total: 0.0% (1.7ms) | Samples: 0

**Calls:**
- `integerArgument` (1)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 0.0% (0us) | Total: 0.7% (66.7ms) | Samples: 0

**Called by:**
- `alignProjectionBasis` (45)
- `step` (41)

**Calls:**
- `map` (86)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:528` | Self: 0.0% (0us) | Total: 0.0% (862us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `slice` (1)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (0us) | Total: 0.7% (63.3ms) | Samples: 0

**Called by:**
- `jacobiEigenSymmetric` (83)

**Calls:**
- `some` (83)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:205` | Self: 0.0% (0us) | Total: 0.2% (23.3ms) | Samples: 0

**Called by:**
- `step` (31)

**Calls:**
- `sort` (23)
- `from` (8)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:721` | Self: 0.0% (0us) | Total: 0.8% (74.5ms) | Samples: 0

**Called by:**
- `runTrial` (97)

**Calls:**
- `alignProjectionBasis` (49)
- `alignProjectionBasis` (48)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:637` | Self: 0.0% (0us) | Total: 0.0% (2.9ms) | Samples: 0

**Called by:**
- `runTrial` (4)

**Calls:**
- `createZeroVector` (2)
- `fill` (1)
- `createZeroVector` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:208` | Self: 0.0% (0us) | Total: 0.0% (3.8ms) | Samples: 0

**Called by:**
- `step` (5)

**Calls:**
- `map` (5)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.0% (0us) | Total: 0.2% (24.3ms) | Samples: 0

**Called by:**
- `step` (32)

**Calls:**
- `from` (32)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` | Self: 0.0% (0us) | Total: 0.4% (35.5ms) | Samples: 0

**Called by:**
- `(module)` (41)
- `(module)` (7)

**Calls:**
- `step` (16)
- `step` (13)
- `step` (7)
- `step` (3)
- `step` (2)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:722` | Self: 0.0% (0us) | Total: 0.0% (7.2ms) | Samples: 0

**Called by:**
- `runTrial` (10)

**Calls:**
- `map` (10)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` | Self: 0.0% (0us) | Total: 0.0% (2.4ms) | Samples: 0

**Called by:**
- `(module)` (3)

**Calls:**
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:742` | Self: 0.0% (0us) | Total: 0.0% (8.1ms) | Samples: 0

**Called by:**
- `runTrial` (11)

**Calls:**
- `projectTo3D` (11)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:513` | Self: 0.0% (0us) | Total: 0.0% (876us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `filter` (1)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 92.1% | 7.69s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 7.5% | 634.3ms | `[native code]` |
| 0.2% | 22.9ms | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.0% | 874us | `internal:primordials` |
