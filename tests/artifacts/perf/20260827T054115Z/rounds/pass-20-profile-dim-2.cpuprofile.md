# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 1.95s | 2498 | 500us | 176 |

**Top 10:** `map` 12.6%, `step` 9.2%, `sampleGaussianVectorND` 4.6%, `sort` 3.4%, `fill` 3.1%, `coordinate` 2.9%, `(anonymous)` 2.0%, `step` 2.0%, `step` 1.7%, `createZeroVector` 1.7%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 12.6% | 247.0ms | 19.5% | 383.0ms | `map` | `[native code]` |
| 9.2% | 180.3ms | 11.3% | 222.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:688` |
| 4.6% | 90.6ms | 4.6% | 90.6ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 3.4% | 67.7ms | 3.9% | 76.4ms | `sort` | `[native code]` |
| 3.1% | 62.4ms | 3.1% | 62.4ms | `fill` | `[native code]` |
| 2.9% | 57.2ms | 2.9% | 57.2ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` |
| 2.0% | 40.7ms | 2.0% | 40.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 2.0% | 39.5ms | 3.3% | 65.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 1.7% | 35.0ms | 1.7% | 35.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:733` |
| 1.7% | 33.4ms | 1.7% | 33.4ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 1.5% | 29.4ms | 3.1% | 61.1ms | `from` | `[native code]` |
| 1.4% | 29.1ms | 1.4% | 29.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:681` |
| 1.4% | 28.9ms | 6.3% | 123.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:725` |
| 1.4% | 27.8ms | 1.6% | 32.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:737` |
| 1.3% | 26.8ms | 1.3% | 26.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` |
| 1.3% | 25.8ms | 1.3% | 25.8ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:350` |
| 1.3% | 25.5ms | 2.0% | 39.2ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:308` |
| 1.2% | 25.0ms | 3.2% | 62.9ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 1.2% | 24.5ms | 1.2% | 24.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` |
| 1.2% | 24.1ms | 7.3% | 144.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` |
| 1.2% | 23.7ms | 1.2% | 23.7ms | `push` | `[native code]` |
| 1.1% | 23.0ms | 1.1% | 23.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 1.1% | 22.9ms | 2.6% | 51.2ms | `some` | `[native code]` |
| 1.0% | 21.3ms | 1.0% | 21.3ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 1.0% | 21.2ms | 1.1% | 22.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` |
| 1.0% | 20.3ms | 1.0% | 20.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:708` |
| 1.0% | 20.3ms | 1.0% | 20.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` |
| 0.9% | 19.1ms | 1.0% | 19.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 0.9% | 18.9ms | 0.9% | 18.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 0.9% | 18.8ms | 0.9% | 18.8ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.9% | 18.6ms | 1.2% | 25.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:763` |
| 0.9% | 18.5ms | 1.0% | 20.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:661` |
| 0.8% | 17.4ms | 0.8% | 17.4ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.8% | 16.1ms | 0.8% | 16.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:756` |
| 0.8% | 15.8ms | 1.5% | 30.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` |
| 0.8% | 15.8ms | 1.1% | 23.2ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 0.7% | 15.4ms | 3.8% | 75.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:609` |
| 0.7% | 15.4ms | 0.7% | 15.4ms | `max` | `[native code]` |
| 0.7% | 14.7ms | 3.7% | 73.4ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.7% | 14.2ms | 0.7% | 14.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.7% | 13.8ms | 0.8% | 17.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:741` |
| 0.6% | 13.5ms | 2.8% | 55.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` |
| 0.6% | 13.0ms | 0.6% | 13.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` |
| 0.6% | 12.8ms | 0.6% | 12.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:762` |
| 0.6% | 12.7ms | 1.7% | 35.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:209` |
| 0.6% | 12.5ms | 0.6% | 12.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:757` |
| 0.6% | 12.4ms | 0.6% | 12.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:739` |
| 0.6% | 12.1ms | 3.6% | 71.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` |
| 0.6% | 11.9ms | 0.6% | 11.9ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` |
| 0.5% | 11.6ms | 0.5% | 11.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:752` |
| 0.5% | 11.4ms | 2.9% | 58.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:627` |
| 0.5% | 10.8ms | 0.5% | 10.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.5% | 10.6ms | 0.5% | 10.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:753` |
| 0.5% | 10.3ms | 0.5% | 10.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:602` |
| 0.5% | 9.8ms | 0.5% | 9.8ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.5% | 9.8ms | 3.0% | 60.4ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.4% | 9.5ms | 0.6% | 11.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` |
| 0.4% | 9.5ms | 0.4% | 9.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:705` |
| 0.4% | 9.1ms | 7.9% | 155.3ms | `forEach` | `[native code]` |
| 0.4% | 9.0ms | 0.4% | 9.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:601` |
| 0.4% | 8.7ms | 0.4% | 8.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` |
| 0.4% | 8.7ms | 0.5% | 11.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:728` |
| 0.3% | 7.7ms | 1.1% | 22.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:637` |
| 0.3% | 6.7ms | 0.3% | 6.7ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` |
| 0.3% | 6.4ms | 3.2% | 63.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:671` |
| 0.3% | 6.3ms | 0.3% | 7.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:663` |
| 0.3% | 6.2ms | 0.3% | 6.2ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.3% | 6.0ms | 0.3% | 6.0ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:572` |
| 0.3% | 5.9ms | 0.3% | 6.8ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:571` |
| 0.3% | 5.9ms | 0.3% | 5.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:627` |
| 0.3% | 5.9ms | 0.3% | 5.9ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.3% | 5.8ms | 0.7% | 14.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:746` |
| 0.2% | 5.4ms | 0.4% | 7.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` |
| 0.2% | 5.1ms | 1.8% | 36.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:653` |
| 0.2% | 4.8ms | 1.2% | 23.8ms | `anonymous` | `[native code]` |
| 0.2% | 4.6ms | 1.8% | 36.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:205` |
| 0.2% | 4.6ms | 0.2% | 4.6ms | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.2% | 4.6ms | 0.2% | 4.6ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.2% | 4.4ms | 0.2% | 4.4ms | `safeObjectiveValue` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.2% | 4.2ms | 0.5% | 11.3ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:294` |
| 0.2% | 3.9ms | 1.7% | 34.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:712` |
| 0.1% | 3.9ms | 1.0% | 20.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:722` |
| 0.1% | 3.8ms | 0.2% | 4.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` |
| 0.1% | 3.7ms | 0.7% | 13.7ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:287` |
| 0.1% | 3.6ms | 4.2% | 84.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:608` |
| 0.1% | 3.6ms | 0.3% | 6.5ms | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:419` |
| 0.1% | 3.5ms | 0.1% | 3.5ms | `abs` | `[native code]` |
| 0.1% | 3.5ms | 1.1% | 21.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:751` |
| 0.1% | 3.3ms | 0.1% | 3.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:603` |
| 0.1% | 3.3ms | 0.1% | 3.3ms | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.1% | 3.2ms | 0.1% | 3.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.1% | 3.0ms | 0.1% | 3.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.1% | 2.9ms | 0.1% | 2.9ms | `every` | `[native code]` |
| 0.1% | 2.8ms | 0.1% | 2.8ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:21` |
| 0.1% | 2.8ms | 0.1% | 2.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:206` |
| 0.1% | 2.6ms | 0.1% | 2.6ms | `isFinite` | `[native code]` |
| 0.1% | 2.4ms | 0.1% | 2.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` |
| 0.1% | 2.4ms | 0.1% | 2.4ms | `reduce` | `[native code]` |
| 0.1% | 2.3ms | 7.6% | 148.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:723` |
| 0.1% | 2.3ms | 0.1% | 2.3ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:307` |
| 0.1% | 2.3ms | 0.1% | 2.3ms | `hypot` | `[native code]` |
| 0.1% | 2.3ms | 4.0% | 79.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` |
| 0.1% | 2.3ms | 2.4% | 48.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:721` |
| 0.1% | 2.2ms | 9.2% | 180.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` |
| 0.1% | 2.1ms | 0.1% | 2.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:213` |
| 0.1% | 2.0ms | 1.1% | 22.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `slice` | `[native code]` |
| 0.0% | 1.6ms | 0.2% | 4.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:716` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `min` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `sqrt` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.0% | 1.5ms | 1.4% | 28.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:26` |
| 0.0% | 1.4ms | 0.1% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.4ms | 0.8% | 16.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:742` |
| 0.0% | 1.4ms | 1.3% | 26.5ms | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.0% | 908us | 0.0% | 908us | `call` | `[native code]` |
| 0.0% | 897us | 0.0% | 897us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:85` |
| 0.0% | 876us | 0.0% | 876us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` |
| 0.0% | 867us | 0.0% | 867us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` |
| 0.0% | 866us | 0.0% | 866us | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 841us | 0.9% | 19.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:743` |
| 0.0% | 833us | 0.0% | 833us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:479` |
| 0.0% | 825us | 0.0% | 825us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:208` |
| 0.0% | 823us | 0.0% | 823us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 791us | 0.5% | 11.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:208` |
| 0.0% | 788us | 0.0% | 788us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:749` |
| 0.0% | 770us | 1.8% | 36.9ms | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.0% | 753us | 0.0% | 753us | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 734us | 0.0% | 734us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:469` |
| 0.0% | 719us | 0.0% | 719us | `exp` | `[native code]` |
| 0.0% | 717us | 0.0% | 717us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` |
| 0.0% | 714us | 0.0% | 714us | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:335` |
| 0.0% | 703us | 0.0% | 703us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:506` |
| 0.0% | 695us | 0.0% | 695us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.0% | 678us | 0.0% | 678us | `@lazy` | `[native code]` |
| 0.0% | 675us | 1.2% | 23.8ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:584` |
| 0.0% | 672us | 0.0% | 672us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:511` |
| 0.0% | 668us | 0.0% | 668us | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:578` |
| 0.0% | 665us | 0.0% | 665us | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:286` |
| 0.0% | 663us | 0.0% | 663us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:707` |
| 0.0% | 656us | 0.0% | 656us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 0.0% | 616us | 0.0% | 616us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:215` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 98.7% | 1.92s | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 98.4% | 1.92s | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` |
| 19.5% | 383.0ms | 12.6% | 247.0ms | `map` | `[native code]` |
| 11.3% | 222.4ms | 9.2% | 180.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:688` |
| 9.2% | 180.1ms | 0.1% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` |
| 7.9% | 155.3ms | 0.4% | 9.1ms | `forEach` | `[native code]` |
| 7.6% | 148.7ms | 0.1% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:723` |
| 7.3% | 144.3ms | 1.2% | 24.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` |
| 6.3% | 123.5ms | 1.4% | 28.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:725` |
| 4.6% | 90.6ms | 4.6% | 90.6ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 4.2% | 84.0ms | 0.1% | 3.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:608` |
| 4.0% | 79.9ms | 0.1% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` |
| 3.9% | 76.4ms | 3.4% | 67.7ms | `sort` | `[native code]` |
| 3.8% | 75.4ms | 0.7% | 15.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:609` |
| 3.7% | 73.4ms | 0.7% | 14.7ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 3.6% | 71.7ms | 0.6% | 12.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` |
| 3.3% | 65.4ms | 2.0% | 39.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 3.2% | 63.3ms | 0.3% | 6.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:671` |
| 3.2% | 62.9ms | 1.2% | 25.0ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 3.1% | 62.4ms | 3.1% | 62.4ms | `fill` | `[native code]` |
| 3.1% | 61.1ms | 1.5% | 29.4ms | `from` | `[native code]` |
| 3.0% | 60.4ms | 0.5% | 9.8ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 2.9% | 58.2ms | 0.5% | 11.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:627` |
| 2.9% | 57.2ms | 2.9% | 57.2ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` |
| 2.8% | 55.2ms | 0.6% | 13.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` |
| 2.6% | 51.2ms | 1.1% | 22.9ms | `some` | `[native code]` |
| 2.4% | 48.7ms | 0.1% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:721` |
| 2.0% | 40.7ms | 2.0% | 40.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 2.0% | 39.2ms | 1.3% | 25.5ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:308` |
| 1.8% | 36.9ms | 0.0% | 770us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 1.8% | 36.8ms | 0.2% | 5.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:653` |
| 1.8% | 36.4ms | 0.2% | 4.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:205` |
| 1.7% | 35.0ms | 0.6% | 12.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:209` |
| 1.7% | 35.0ms | 1.7% | 35.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:733` |
| 1.7% | 34.6ms | 0.2% | 3.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:712` |
| 1.7% | 33.4ms | 1.7% | 33.4ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 1.6% | 32.4ms | 1.4% | 27.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:737` |
| 1.5% | 30.8ms | 0.8% | 15.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` |
| 1.4% | 29.1ms | 1.4% | 29.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:681` |
| 1.4% | 28.1ms | 0.0% | 1.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 1.3% | 26.8ms | 1.3% | 26.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` |
| 1.3% | 26.5ms | 0.0% | 1.4ms | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 1.3% | 25.9ms | 0.0% | 0us | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:253` |
| 1.3% | 25.8ms | 1.3% | 25.8ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:350` |
| 1.2% | 25.3ms | 0.9% | 18.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:763` |
| 1.2% | 25.1ms | 0.0% | 0us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 1.2% | 24.5ms | 1.2% | 24.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` |
| 1.2% | 23.8ms | 0.2% | 4.8ms | `anonymous` | `[native code]` |
| 1.2% | 23.8ms | 0.0% | 675us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:584` |
| 1.2% | 23.7ms | 1.2% | 23.7ms | `push` | `[native code]` |
| 1.1% | 23.2ms | 0.8% | 15.8ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 1.1% | 23.0ms | 1.1% | 23.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 1.1% | 22.7ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` |
| 1.1% | 22.6ms | 0.1% | 2.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` |
| 1.1% | 22.1ms | 0.3% | 7.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:637` |
| 1.1% | 22.0ms | 1.0% | 21.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` |
| 1.1% | 21.8ms | 0.1% | 3.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:751` |
| 1.0% | 21.3ms | 1.0% | 21.3ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 1.0% | 20.7ms | 0.1% | 3.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:722` |
| 1.0% | 20.3ms | 1.0% | 20.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:708` |
| 1.0% | 20.3ms | 1.0% | 20.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` |
| 1.0% | 20.2ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:211` |
| 1.0% | 20.1ms | 0.9% | 18.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:661` |
| 1.0% | 19.8ms | 0.9% | 19.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 0.9% | 19.3ms | 0.0% | 841us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:743` |
| 0.9% | 18.9ms | 0.9% | 18.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 0.9% | 18.8ms | 0.9% | 18.8ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.8% | 17.4ms | 0.8% | 17.4ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.8% | 17.1ms | 0.7% | 13.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:741` |
| 0.8% | 16.8ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:742` |
| 0.8% | 16.1ms | 0.8% | 16.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:756` |
| 0.7% | 15.4ms | 0.7% | 15.4ms | `max` | `[native code]` |
| 0.7% | 14.9ms | 0.3% | 5.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:746` |
| 0.7% | 14.2ms | 0.7% | 14.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.7% | 13.7ms | 0.1% | 3.7ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:287` |
| 0.6% | 13.0ms | 0.6% | 13.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` |
| 0.6% | 12.8ms | 0.6% | 12.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:762` |
| 0.6% | 12.5ms | 0.6% | 12.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:757` |
| 0.6% | 12.4ms | 0.6% | 12.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:739` |
| 0.6% | 11.9ms | 0.4% | 9.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` |
| 0.6% | 11.9ms | 0.6% | 11.9ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` |
| 0.6% | 11.8ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` |
| 0.5% | 11.6ms | 0.5% | 11.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:752` |
| 0.5% | 11.3ms | 0.2% | 4.2ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:294` |
| 0.5% | 11.3ms | 0.0% | 791us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:208` |
| 0.5% | 11.1ms | 0.4% | 8.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:728` |
| 0.5% | 10.8ms | 0.5% | 10.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.5% | 10.6ms | 0.5% | 10.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:753` |
| 0.5% | 10.3ms | 0.5% | 10.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:602` |
| 0.5% | 9.8ms | 0.5% | 9.8ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.4% | 9.5ms | 0.4% | 9.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:705` |
| 0.4% | 9.0ms | 0.4% | 9.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:601` |
| 0.4% | 8.9ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:628` |
| 0.4% | 8.7ms | 0.4% | 8.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` |
| 0.4% | 7.9ms | 0.2% | 5.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` |
| 0.3% | 7.1ms | 0.3% | 6.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:663` |
| 0.3% | 7.0ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` |
| 0.3% | 6.8ms | 0.3% | 5.9ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:571` |
| 0.3% | 6.7ms | 0.3% | 6.7ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` |
| 0.3% | 6.5ms | 0.1% | 3.6ms | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:419` |
| 0.3% | 6.4ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.3% | 6.4ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.3% | 6.2ms | 0.3% | 6.2ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.3% | 6.0ms | 0.3% | 6.0ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:572` |
| 0.3% | 5.9ms | 0.3% | 5.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:627` |
| 0.3% | 5.9ms | 0.3% | 5.9ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.2% | 4.6ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` |
| 0.2% | 4.6ms | 0.2% | 4.6ms | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.2% | 4.6ms | 0.2% | 4.6ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.2% | 4.5ms | 0.1% | 3.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` |
| 0.2% | 4.4ms | 0.2% | 4.4ms | `safeObjectiveValue` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.2% | 4.3ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:716` |
| 0.1% | 3.5ms | 0.1% | 3.5ms | `abs` | `[native code]` |
| 0.1% | 3.3ms | 0.1% | 3.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:603` |
| 0.1% | 3.3ms | 0.1% | 3.3ms | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.1% | 3.2ms | 0.1% | 3.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.1% | 3.1ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.1% | 3.0ms | 0.1% | 3.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.1% | 2.9ms | 0.1% | 2.9ms | `every` | `[native code]` |
| 0.1% | 2.8ms | 0.1% | 2.8ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:21` |
| 0.1% | 2.8ms | 0.1% | 2.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:206` |
| 0.1% | 2.6ms | 0.1% | 2.6ms | `isFinite` | `[native code]` |
| 0.1% | 2.4ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.1% | 2.4ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.1% | 2.4ms | 0.1% | 2.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` |
| 0.1% | 2.4ms | 0.1% | 2.4ms | `reduce` | `[native code]` |
| 0.1% | 2.3ms | 0.1% | 2.3ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:307` |
| 0.1% | 2.3ms | 0.1% | 2.3ms | `hypot` | `[native code]` |
| 0.1% | 2.1ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` |
| 0.1% | 2.1ms | 0.1% | 2.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:213` |
| 0.0% | 1.7ms | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:514` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `slice` | `[native code]` |
| 0.0% | 1.6ms | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 1.6ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 1.6ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 1.6ms | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 1.6ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `min` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `sqrt` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:26` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 908us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 908us | 0.0% | 0us | `internal:primordials` | `internal:primordials:51` |
| 0.0% | 908us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 908us | 0.0% | 0us | `bound call` | `[native code]` |
| 0.0% | 908us | 0.0% | 908us | `call` | `[native code]` |
| 0.0% | 908us | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 897us | 0.0% | 897us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:85` |
| 0.0% | 876us | 0.0% | 876us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` |
| 0.0% | 867us | 0.0% | 867us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` |
| 0.0% | 866us | 0.0% | 866us | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 833us | 0.0% | 833us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:479` |
| 0.0% | 825us | 0.0% | 825us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:208` |
| 0.0% | 823us | 0.0% | 823us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 788us | 0.0% | 788us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:749` |
| 0.0% | 776us | 0.0% | 0us | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:38` |
| 0.0% | 759us | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 753us | 0.0% | 753us | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 734us | 0.0% | 734us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:469` |
| 0.0% | 719us | 0.0% | 719us | `exp` | `[native code]` |
| 0.0% | 717us | 0.0% | 717us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` |
| 0.0% | 714us | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:356` |
| 0.0% | 714us | 0.0% | 714us | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:335` |
| 0.0% | 703us | 0.0% | 703us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:506` |
| 0.0% | 695us | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:50` |
| 0.0% | 695us | 0.0% | 695us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.0% | 678us | 0.0% | 0us | `internal:fs/binding` | `internal:fs/binding:3` |
| 0.0% | 678us | 0.0% | 678us | `@lazy` | `[native code]` |
| 0.0% | 672us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:509` |
| 0.0% | 672us | 0.0% | 672us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:511` |
| 0.0% | 668us | 0.0% | 668us | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:578` |
| 0.0% | 665us | 0.0% | 665us | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:286` |
| 0.0% | 663us | 0.0% | 663us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:707` |
| 0.0% | 656us | 0.0% | 656us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 0.0% | 616us | 0.0% | 616us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:215` |

## Function Details

### `map`
`[native code]` | Self: 12.6% (247.0ms) | Total: 19.5% (383.0ms) | Samples: 306

**Called by:**
- `step` (100)
- `step` (77)
- `(anonymous)` (73)
- `step` (71)
- `cloneMatrix` (46)
- `jacobiEigenSymmetric` (26)
- `(anonymous)` (26)
- `step` (19)
- `jacobiEigenSymmetric` (14)
- `jacobiEigenSymmetric` (14)
- `step` (11)
- `step` (4)
- `alignProjectionBasis` (2)

**Calls:**
- `(anonymous)` (82)
- `(anonymous)` (50)
- `(anonymous)` (29)
- `repair` (9)
- `abs` (5)
- `(anonymous)` (1)
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:688` | Self: 9.2% (180.3ms) | Total: 11.3% (222.4ms) | Samples: 234

**Called by:**
- `runTrial` (283)
- `runTrial` (1)

**Calls:**
- `createZeroMatrix` (40)
- `createZeroMatrix` (8)
- `createZeroMatrix` (2)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 4.6% (90.6ms) | Total: 4.6% (90.6ms) | Samples: 114

**Called by:**
- `step` (114)

### `sort`
`[native code]` | Self: 3.4% (67.7ms) | Total: 3.9% (76.4ms) | Samples: 89

**Called by:**
- `step` (62)
- `jacobiEigenSymmetric` (39)

**Calls:**
- `(anonymous)` (8)
- `(anonymous)` (4)

### `fill`
`[native code]` | Self: 3.1% (62.4ms) | Total: 3.1% (62.4ms) | Samples: 80

**Called by:**
- `from` (22)
- `transformFromEigenCoordinates` (21)
- `mahalanobisSquaredWithEigensystem` (12)
- `whitenWithEigensystem` (10)
- `step` (9)
- `whitenWithEigensystem` (6)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` | Self: 2.9% (57.2ms) | Total: 2.9% (57.2ms) | Samples: 72

**Called by:**
- `projectTo3D` (72)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 2.0% (40.7ms) | Total: 2.0% (40.7ms) | Samples: 54

**Called by:**
- `map` (50)
- `some` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` | Self: 2.0% (39.5ms) | Total: 3.3% (65.4ms) | Samples: 49

**Called by:**
- `runTrial` (77)
- `runTrial` (1)

**Calls:**
- `ellipsoidObjective` (26)
- `safeObjectiveValue` (2)
- `ellipsoidObjective` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:733` | Self: 1.7% (35.0ms) | Total: 1.7% (35.0ms) | Samples: 45

**Called by:**
- `runTrial` (45)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` | Self: 1.7% (33.4ms) | Total: 1.7% (33.4ms) | Samples: 39

**Called by:**
- `transformFromEigenCoordinates` (22)
- `mahalanobisSquaredWithEigensystem` (6)
- `whitenWithEigensystem` (4)
- `step` (4)
- `whitenWithEigensystem` (3)

### `from`
`[native code]` | Self: 1.5% (29.4ms) | Total: 3.1% (61.1ms) | Samples: 37

**Called by:**
- `createZeroMatrix` (65)
- `jacobiEigenSymmetric` (9)
- `jacobiEigenSymmetric` (3)
- `runTrial` (1)
- `CMAESOptimizerND` (1)

**Calls:**
- `fill` (22)
- `(anonymous)` (15)
- `(anonymous)` (3)
- `(anonymous)` (1)
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:681` | Self: 1.4% (29.1ms) | Total: 1.4% (29.1ms) | Samples: 37

**Called by:**
- `runTrial` (36)
- `runTrial` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:725` | Self: 1.4% (28.9ms) | Total: 6.3% (123.5ms) | Samples: 38

**Called by:**
- `forEach` (158)

**Calls:**
- `projectTo3D` (88)
- `projectTo3D` (20)
- `projectTo3D` (7)
- `projectTo3D` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:737` | Self: 1.4% (27.8ms) | Total: 1.6% (32.4ms) | Samples: 36

**Called by:**
- `runTrial` (41)
- `runTrial` (1)

**Calls:**
- `radius` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` | Self: 1.3% (26.8ms) | Total: 1.3% (26.8ms) | Samples: 34

**Called by:**
- `runTrial` (34)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:350` | Self: 1.3% (25.8ms) | Total: 1.3% (25.8ms) | Samples: 33

**Called by:**
- `step` (33)

### `mahalanobisSquaredWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:308` | Self: 1.3% (25.5ms) | Total: 2.0% (39.2ms) | Samples: 34

**Called by:**
- `step` (52)

**Calls:**
- `fill` (12)
- `createZeroVector` (6)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` | Self: 1.2% (25.0ms) | Total: 3.2% (62.9ms) | Samples: 33

**Called by:**
- `step` (76)

**Calls:**
- `createZeroVector` (22)
- `fill` (21)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` | Self: 1.2% (24.5ms) | Total: 1.2% (24.5ms) | Samples: 28

**Called by:**
- `runTrial` (28)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` | Self: 1.2% (24.1ms) | Total: 7.3% (144.3ms) | Samples: 31

**Called by:**
- `runTrial` (183)

**Calls:**
- `sampleGaussianVectorND` (114)
- `sampleGaussianVectorND` (33)
- `push` (4)
- `sampleGaussianVectorND` (1)

### `push`
`[native code]` | Self: 1.2% (23.7ms) | Total: 1.2% (23.7ms) | Samples: 30

**Called by:**
- `step` (19)
- `step` (7)
- `step` (4)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 1.1% (23.0ms) | Total: 1.1% (23.0ms) | Samples: 29

**Called by:**
- `map` (29)

### `some`
`[native code]` | Self: 1.1% (22.9ms) | Total: 2.6% (51.2ms) | Samples: 30

**Called by:**
- `validateSquareFiniteMatrix` (33)
- `(anonymous)` (33)
- `projectTo3D` (1)

**Calls:**
- `(anonymous)` (33)
- `(anonymous)` (4)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` | Self: 1.0% (21.3ms) | Total: 1.0% (21.3ms) | Samples: 27

**Called by:**
- `step` (26)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` | Self: 1.0% (21.2ms) | Total: 1.1% (22.0ms) | Samples: 26

**Called by:**
- `runTrial` (27)

**Calls:**
- `adaptationPoint` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:708` | Self: 1.0% (20.3ms) | Total: 1.0% (20.3ms) | Samples: 26

**Called by:**
- `runTrial` (26)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` | Self: 1.0% (20.3ms) | Total: 1.0% (20.3ms) | Samples: 27

**Called by:**
- `runTrial` (27)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` | Self: 0.9% (19.1ms) | Total: 1.0% (19.8ms) | Samples: 25

**Called by:**
- `runTrial` (26)

**Calls:**
- `adaptationPoint` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` | Self: 0.9% (18.9ms) | Total: 0.9% (18.9ms) | Samples: 22

**Called by:**
- `step` (22)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.9% (18.8ms) | Total: 0.9% (18.8ms) | Samples: 25

**Called by:**
- `step` (14)
- `step` (11)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:763` | Self: 0.9% (18.6ms) | Total: 1.2% (25.3ms) | Samples: 25

**Called by:**
- `runTrial` (32)

**Calls:**
- `push` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:661` | Self: 0.9% (18.5ms) | Total: 1.0% (20.1ms) | Samples: 25

**Called by:**
- `runTrial` (27)

**Calls:**
- `sqrt` (1)
- `max` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.8% (17.4ms) | Total: 0.8% (17.4ms) | Samples: 22

**Called by:**
- `step` (22)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:756` | Self: 0.8% (16.1ms) | Total: 0.8% (16.1ms) | Samples: 20

**Called by:**
- `runTrial` (20)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` | Self: 0.8% (15.8ms) | Total: 1.5% (30.8ms) | Samples: 21

**Called by:**
- `runTrial` (41)

**Calls:**
- `push` (19)
- `ellipsoidObjective` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` | Self: 0.8% (15.8ms) | Total: 1.1% (23.2ms) | Samples: 19

**Called by:**
- `(anonymous)` (20)
- `step` (5)
- `step` (4)

**Calls:**
- `requireFiniteVector` (9)
- `requireFiniteVector` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:609` | Self: 0.7% (15.4ms) | Total: 3.8% (75.4ms) | Samples: 20

**Called by:**
- `runTrial` (91)

**Calls:**
- `map` (71)

### `max`
`[native code]` | Self: 0.7% (15.4ms) | Total: 0.7% (15.4ms) | Samples: 19

**Called by:**
- `jacobiEigenSymmetric` (14)
- `step` (1)
- `step` (1)
- `step` (1)
- `ellipsoidObjective` (1)
- `step` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` | Self: 0.7% (14.7ms) | Total: 3.7% (73.4ms) | Samples: 20

**Called by:**
- `(anonymous)` (88)
- `step` (3)
- `step` (3)

**Calls:**
- `coordinate` (72)
- `coordinate` (1)
- `coordinate` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` | Self: 0.7% (14.2ms) | Total: 0.7% (14.2ms) | Samples: 19

**Called by:**
- `runTrial` (19)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:741` | Self: 0.7% (13.8ms) | Total: 0.8% (17.1ms) | Samples: 18

**Called by:**
- `runTrial` (22)

**Calls:**
- `variancePercent` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` | Self: 0.6% (13.5ms) | Total: 2.8% (55.2ms) | Samples: 18

**Called by:**
- `runTrial` (72)
- `runTrial` (1)

**Calls:**
- `mahalanobisSquaredWithEigensystem` (52)
- `mahalanobisSquaredWithEigensystem` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` | Self: 0.6% (13.0ms) | Total: 0.6% (13.0ms) | Samples: 18

**Called by:**
- `runTrial` (18)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:762` | Self: 0.6% (12.8ms) | Total: 0.6% (12.8ms) | Samples: 17

**Called by:**
- `runTrial` (17)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:209` | Self: 0.6% (12.7ms) | Total: 1.7% (35.0ms) | Samples: 17

**Called by:**
- `step` (45)

**Calls:**
- `map` (14)
- `max` (14)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:757` | Self: 0.6% (12.5ms) | Total: 0.6% (12.5ms) | Samples: 17

**Called by:**
- `runTrial` (17)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:739` | Self: 0.6% (12.4ms) | Total: 0.6% (12.4ms) | Samples: 15

**Called by:**
- `runTrial` (15)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` | Self: 0.6% (12.1ms) | Total: 3.6% (71.7ms) | Samples: 17

**Called by:**
- `runTrial` (94)

**Calls:**
- `map` (77)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` | Self: 0.6% (11.9ms) | Total: 0.6% (11.9ms) | Samples: 15

**Called by:**
- `step` (15)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:752` | Self: 0.5% (11.6ms) | Total: 0.5% (11.6ms) | Samples: 16

**Called by:**
- `runTrial` (15)
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:627` | Self: 0.5% (11.4ms) | Total: 2.9% (58.2ms) | Samples: 14

**Called by:**
- `runTrial` (75)
- `runTrial` (1)

**Calls:**
- `sort` (62)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.5% (10.8ms) | Total: 0.5% (10.8ms) | Samples: 15

**Called by:**
- `from` (15)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:753` | Self: 0.5% (10.6ms) | Total: 0.5% (10.6ms) | Samples: 14

**Called by:**
- `runTrial` (14)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:602` | Self: 0.5% (10.3ms) | Total: 0.5% (10.3ms) | Samples: 13

**Called by:**
- `runTrial` (13)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.5% (9.8ms) | Total: 0.5% (9.8ms) | Samples: 13

**Called by:**
- `step` (13)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.5% (9.8ms) | Total: 3.0% (60.4ms) | Samples: 8

**Called by:**
- `step` (40)
- `reconstructSymmetric` (33)

**Calls:**
- `from` (65)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` | Self: 0.4% (9.5ms) | Total: 0.6% (11.9ms) | Samples: 13

**Called by:**
- `step` (16)

**Calls:**
- `hypot` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:705` | Self: 0.4% (9.5ms) | Total: 0.4% (9.5ms) | Samples: 13

**Called by:**
- `runTrial` (13)

### `forEach`
`[native code]` | Self: 0.4% (9.1ms) | Total: 7.9% (155.3ms) | Samples: 12

**Called by:**
- `step` (187)
- `step` (12)

**Calls:**
- `(anonymous)` (158)
- `(anonymous)` (29)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:601` | Self: 0.4% (9.0ms) | Total: 0.4% (9.0ms) | Samples: 12

**Called by:**
- `runTrial` (12)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` | Self: 0.4% (8.7ms) | Total: 0.4% (8.7ms) | Samples: 13

**Called by:**
- `runTrial` (12)
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:728` | Self: 0.4% (8.7ms) | Total: 0.5% (11.1ms) | Samples: 12

**Called by:**
- `runTrial` (15)

**Calls:**
- `reduce` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:637` | Self: 0.3% (7.7ms) | Total: 1.1% (22.1ms) | Samples: 9

**Called by:**
- `runTrial` (27)

**Calls:**
- `fill` (9)
- `createZeroVector` (4)
- `createZeroVector` (3)
- `createZeroVector` (2)

### `repair`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` | Self: 0.3% (6.7ms) | Total: 0.3% (6.7ms) | Samples: 9

**Called by:**
- `map` (9)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:671` | Self: 0.3% (6.4ms) | Total: 3.2% (63.3ms) | Samples: 9

**Called by:**
- `map` (82)

**Calls:**
- `map` (73)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:663` | Self: 0.3% (6.3ms) | Total: 0.3% (7.1ms) | Samples: 9

**Called by:**
- `runTrial` (10)

**Calls:**
- `max` (1)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.3% (6.2ms) | Total: 0.3% (6.2ms) | Samples: 8

**Called by:**
- `step` (8)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:572` | Self: 0.3% (6.0ms) | Total: 0.3% (6.0ms) | Samples: 8

**Called by:**
- `(anonymous)` (5)
- `step` (2)
- `step` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:571` | Self: 0.3% (5.9ms) | Total: 0.3% (6.8ms) | Samples: 8

**Called by:**
- `(anonymous)` (7)
- `step` (2)

**Calls:**
- `some` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:627` | Self: 0.3% (5.9ms) | Total: 0.3% (5.9ms) | Samples: 8

**Called by:**
- `sort` (8)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.3% (5.9ms) | Total: 0.3% (5.9ms) | Samples: 8

**Called by:**
- `step` (8)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:746` | Self: 0.3% (5.8ms) | Total: 0.7% (14.9ms) | Samples: 8

**Called by:**
- `runTrial` (19)

**Calls:**
- `map` (11)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` | Self: 0.2% (5.4ms) | Total: 0.4% (7.9ms) | Samples: 6

**Called by:**
- `runTrial` (9)

**Calls:**
- `min` (2)
- `max` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:653` | Self: 0.2% (5.1ms) | Total: 1.8% (36.8ms) | Samples: 6

**Called by:**
- `runTrial` (49)

**Calls:**
- `whitenWithEigensystem` (18)
- `whitenWithEigensystem` (16)
- `whitenWithEigensystem` (8)
- `whitenWithEigensystem` (1)

### `anonymous`
`[native code]` | Self: 0.2% (4.8ms) | Total: 1.2% (23.8ms) | Samples: 6

**Called by:**
- `(anonymous)` (5)
- `node:fs` (4)
- `get WriteStream` (3)
- `node:fs/promises` (3)
- `internal:fs/streams` (2)
- `internal:stream` (2)
- `internal:streams/pipeline` (2)
- `internal:streams/compose` (2)
- `node:stream` (2)
- `node:events` (1)
- `internal:validators` (1)
- `internal:shared` (1)
- `internal:streams/duplex` (1)

**Calls:**
- `node:fs` (4)
- `node:fs/promises` (3)
- `internal:fs/streams` (2)
- `internal:streams/pipeline` (2)
- `internal:stream` (2)
- `internal:streams/compose` (2)
- `node:stream` (2)
- `node:events` (1)
- `internal:validators` (1)
- `internal:shared` (1)
- `internal:streams/duplex` (1)
- `internal:primordials` (1)
- `internal:fs/binding` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:205` | Self: 0.2% (4.6ms) | Total: 1.8% (36.4ms) | Samples: 6

**Called by:**
- `step` (48)

**Calls:**
- `sort` (39)
- `from` (3)

### `radius`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.2% (4.6ms) | Total: 0.2% (4.6ms) | Samples: 6

**Called by:**
- `step` (6)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.2% (4.6ms) | Total: 0.2% (4.6ms) | Samples: 6

**Called by:**
- `step` (6)

### `safeObjectiveValue`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.2% (4.4ms) | Total: 0.2% (4.4ms) | Samples: 2

**Called by:**
- `step` (2)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:294` | Self: 0.2% (4.2ms) | Total: 0.5% (11.3ms) | Samples: 6

**Called by:**
- `step` (16)

**Calls:**
- `fill` (6)
- `createZeroVector` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:712` | Self: 0.2% (3.9ms) | Total: 1.7% (34.6ms) | Samples: 5

**Called by:**
- `runTrial` (44)

**Calls:**
- `reconstructSymmetric` (33)
- `reconstructSymmetric` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:722` | Self: 0.1% (3.9ms) | Total: 1.0% (20.7ms) | Samples: 5

**Called by:**
- `runTrial` (24)

**Calls:**
- `map` (19)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` | Self: 0.1% (3.8ms) | Total: 0.2% (4.5ms) | Samples: 5

**Called by:**
- `runTrial` (6)

**Calls:**
- `sqrt` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:287` | Self: 0.1% (3.7ms) | Total: 0.7% (13.7ms) | Samples: 5

**Called by:**
- `step` (18)

**Calls:**
- `fill` (10)
- `createZeroVector` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:608` | Self: 0.1% (3.6ms) | Total: 4.2% (84.0ms) | Samples: 5

**Called by:**
- `runTrial` (102)
- `runTrial` (1)

**Calls:**
- `transformFromEigenCoordinates` (76)
- `transformFromEigenCoordinates` (22)

### `requireFiniteVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:419` | Self: 0.1% (3.6ms) | Total: 0.3% (6.5ms) | Samples: 5

**Called by:**
- `projectTo3D` (9)

**Calls:**
- `every` (4)

### `abs`
`[native code]` | Self: 0.1% (3.5ms) | Total: 0.1% (3.5ms) | Samples: 5

**Called by:**
- `map` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:751` | Self: 0.1% (3.5ms) | Total: 1.1% (21.8ms) | Samples: 5

**Called by:**
- `runTrial` (29)

**Calls:**
- `cloneMatrix` (20)
- `map` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:603` | Self: 0.1% (3.3ms) | Total: 0.1% (3.3ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `variancePercent`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.1% (3.3ms) | Total: 0.1% (3.3ms) | Samples: 4

**Called by:**
- `step` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.1% (3.2ms) | Total: 0.1% (3.2ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.1% (3.0ms) | Total: 0.1% (3.0ms) | Samples: 4

**Called by:**
- `step` (4)

### `every`
`[native code]` | Self: 0.1% (2.9ms) | Total: 0.1% (2.9ms) | Samples: 4

**Called by:**
- `requireFiniteVector` (4)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:21` | Self: 0.1% (2.8ms) | Total: 0.1% (2.8ms) | Samples: 3

**Called by:**
- `step` (3)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:206` | Self: 0.1% (2.8ms) | Total: 0.1% (2.8ms) | Samples: 4

**Called by:**
- `sort` (4)

### `isFinite`
`[native code]` | Self: 0.1% (2.6ms) | Total: 0.1% (2.6ms) | Samples: 4

**Called by:**
- `step` (4)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` | Self: 0.1% (2.4ms) | Total: 0.1% (2.4ms) | Samples: 3

**Called by:**
- `from` (3)

### `reduce`
`[native code]` | Self: 0.1% (2.4ms) | Total: 0.1% (2.4ms) | Samples: 3

**Called by:**
- `step` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:723` | Self: 0.1% (2.3ms) | Total: 7.6% (148.7ms) | Samples: 3

**Called by:**
- `runTrial` (190)

**Calls:**
- `forEach` (187)

### `mahalanobisSquaredWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:307` | Self: 0.1% (2.3ms) | Total: 0.1% (2.3ms) | Samples: 3

**Called by:**
- `step` (3)

### `hypot`
`[native code]` | Self: 0.1% (2.3ms) | Total: 0.1% (2.3ms) | Samples: 3

**Called by:**
- `jacobiEigenSymmetric` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` | Self: 0.1% (2.3ms) | Total: 4.0% (79.9ms) | Samples: 3

**Called by:**
- `runTrial` (102)
- `runTrial` (1)

**Calls:**
- `map` (100)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:721` | Self: 0.1% (2.3ms) | Total: 2.4% (48.7ms) | Samples: 3

**Called by:**
- `runTrial` (62)

**Calls:**
- `alignProjectionBasis` (30)
- `alignProjectionBasis` (15)
- `alignProjectionBasis` (13)
- `alignProjectionBasis` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` | Self: 0.1% (2.2ms) | Total: 9.2% (180.1ms) | Samples: 3

**Called by:**
- `runTrial` (230)
- `runTrial` (2)

**Calls:**
- `jacobiEigenSymmetric` (48)
- `jacobiEigenSymmetric` (45)
- `jacobiEigenSymmetric` (37)
- `jacobiEigenSymmetric` (26)
- `jacobiEigenSymmetric` (22)
- `jacobiEigenSymmetric` (16)
- `jacobiEigenSymmetric` (15)
- `jacobiEigenSymmetric` (9)
- `jacobiEigenSymmetric` (4)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (2)
- `max` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:213` | Self: 0.1% (2.1ms) | Total: 0.1% (2.1ms) | Samples: 2

**Called by:**
- `step` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` | Self: 0.1% (2.0ms) | Total: 1.1% (22.6ms) | Samples: 3

**Called by:**
- `forEach` (29)

**Calls:**
- `map` (26)

### `slice`
`[native code]` | Self: 0.0% (1.7ms) | Total: 0.0% (1.7ms) | Samples: 2

**Called by:**
- `CMAESOptimizerND` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:716` | Self: 0.0% (1.6ms) | Total: 0.2% (4.3ms) | Samples: 2

**Called by:**
- `runTrial` (6)

**Calls:**
- `isFinite` (4)

### `min`
`[native code]` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 2

**Called by:**
- `step` (2)

### `sqrt`
`[native code]` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `step` (1)
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `step` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` | Self: 0.0% (1.5ms) | Total: 1.4% (28.1ms) | Samples: 2

**Called by:**
- `step` (37)

**Calls:**
- `validateSquareFiniteMatrix` (35)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:26` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` | Self: 0.0% (1.4ms) | Total: 0.1% (2.1ms) | Samples: 2

**Called by:**
- `runTrial` (3)

**Calls:**
- `exp` (1)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:742` | Self: 0.0% (1.4ms) | Total: 0.8% (16.8ms) | Samples: 2

**Called by:**
- `runTrial` (23)

**Calls:**
- `projectTo3D` (11)
- `projectTo3D` (5)
- `projectTo3D` (3)
- `projectTo3D` (2)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (1.4ms) | Total: 1.3% (26.5ms) | Samples: 2

**Called by:**
- `jacobiEigenSymmetric` (35)

**Calls:**
- `some` (33)

### `call`
`[native code]` | Self: 0.0% (908us) | Total: 0.0% (908us) | Samples: 1

**Called by:**
- `bound call` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:85` | Self: 0.0% (897us) | Total: 0.0% (897us) | Samples: 1

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` | Self: 0.0% (876us) | Total: 0.0% (876us) | Samples: 1

**Called by:**
- `map` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` | Self: 0.0% (867us) | Total: 0.0% (867us) | Samples: 1

**Called by:**
- `step` (1)

### `requireFiniteVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (866us) | Total: 0.0% (866us) | Samples: 1

**Called by:**
- `projectTo3D` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:743` | Self: 0.0% (841us) | Total: 0.9% (19.3ms) | Samples: 1

**Called by:**
- `runTrial` (25)

**Calls:**
- `projectTo3D` (14)
- `projectTo3D` (4)
- `projectTo3D` (3)
- `projectTo3D` (2)
- `projectTo3D` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:479` | Self: 0.0% (833us) | Total: 0.0% (833us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:208` | Self: 0.0% (825us) | Total: 0.0% (825us) | Samples: 1

**Called by:**
- `map` (1)

### `adaptationPoint`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (823us) | Total: 0.0% (823us) | Samples: 1

**Called by:**
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:208` | Self: 0.0% (791us) | Total: 0.5% (11.3ms) | Samples: 1

**Called by:**
- `step` (15)

**Calls:**
- `map` (14)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:749` | Self: 0.0% (788us) | Total: 0.0% (788us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 0.0% (770us) | Total: 1.8% (36.9ms) | Samples: 1

**Called by:**
- `alignProjectionBasis` (27)
- `step` (20)

**Calls:**
- `map` (46)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (753us) | Total: 0.0% (753us) | Samples: 1

**Called by:**
- `projectTo3D` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:469` | Self: 0.0% (734us) | Total: 0.0% (734us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `exp`
`[native code]` | Self: 0.0% (719us) | Total: 0.0% (719us) | Samples: 1

**Called by:**
- `step` (1)

### `adaptationPoint`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` | Self: 0.0% (717us) | Total: 0.0% (717us) | Samples: 1

**Called by:**
- `step` (1)

### `nextHalfOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:335` | Self: 0.0% (714us) | Total: 0.0% (714us) | Samples: 1

**Called by:**
- `sampleGaussianVectorND` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:506` | Self: 0.0% (703us) | Total: 0.0% (703us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` | Self: 0.0% (695us) | Total: 0.0% (695us) | Samples: 1

**Called by:**
- `from` (1)

### `@lazy`
`[native code]` | Self: 0.0% (678us) | Total: 0.0% (678us) | Samples: 1

**Called by:**
- `internal:fs/binding` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:584` | Self: 0.0% (675us) | Total: 1.2% (23.8ms) | Samples: 1

**Called by:**
- `step` (30)

**Calls:**
- `cloneMatrix` (27)
- `map` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:511` | Self: 0.0% (672us) | Total: 0.0% (672us) | Samples: 1

**Called by:**
- `from` (1)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:578` | Self: 0.0% (668us) | Total: 0.0% (668us) | Samples: 1

**Called by:**
- `projectTo3D` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:286` | Self: 0.0% (665us) | Total: 0.0% (665us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:707` | Self: 0.0% (663us) | Total: 0.0% (663us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` | Self: 0.0% (656us) | Total: 0.0% (656us) | Samples: 1

**Called by:**
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:215` | Self: 0.0% (616us) | Total: 0.0% (616us) | Samples: 1

**Called by:**
- `step` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:509` | Self: 0.0% (0us) | Total: 0.0% (672us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `from` (1)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.1% (2.4ms) | Samples: 0

**Called by:**
- `(anonymous)` (3)

**Calls:**
- `anonymous` (3)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` | Self: 0.0% (0us) | Total: 0.2% (4.6ms) | Samples: 0

**Called by:**
- `(module)` (5)
- `(module)` (1)

**Calls:**
- `CMAESOptimizerND` (2)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:253` | Self: 0.0% (0us) | Total: 1.3% (25.9ms) | Samples: 0

**Called by:**
- `step` (33)

**Calls:**
- `createZeroMatrix` (33)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.1% (2.4ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:356` | Self: 0.0% (0us) | Total: 0.0% (714us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `nextHalfOpenUnit` (1)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` | Self: 0.0% (0us) | Total: 98.7% (1.92s) | Samples: 0

**Called by:**
- `(module)` (2446)
- `(module)` (24)

**Calls:**
- `step` (283)
- `step` (230)
- `step` (190)
- `step` (183)
- `step` (102)
- `step` (102)
- `step` (94)
- `step` (91)
- `step` (77)
- `step` (75)
- `step` (72)
- `step` (62)
- `step` (49)
- `step` (45)
- `step` (44)
- `step` (41)
- `step` (41)
- `step` (36)
- `step` (34)
- `step` (32)
- `step` (29)
- `step` (28)
- `step` (27)
- `step` (27)
- `step` (27)
- `step` (27)
- `step` (26)
- `step` (26)
- `step` (25)
- `step` (24)
- `step` (23)
- `step` (22)
- `step` (20)
- `step` (19)
- `step` (19)
- `step` (18)
- `step` (17)
- `step` (17)
- `step` (15)
- `step` (15)
- `step` (15)
- `step` (14)
- `step` (13)
- `step` (13)
- `step` (12)
- `step` (12)
- `step` (12)
- `step` (10)
- `step` (9)
- `step` (6)
- `step` (6)
- `step` (5)
- `step` (4)
- `step` (3)
- `step` (1)
- `step` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:514` | Self: 0.0% (0us) | Total: 0.0% (1.7ms) | Samples: 0

**Called by:**
- `runTrial` (2)

**Calls:**
- `slice` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (0us) | Total: 1.2% (25.1ms) | Samples: 0

**Called by:**
- `some` (33)

**Calls:**
- `some` (33)

### `internal:fs/binding`
`internal:fs/binding:3` | Self: 0.0% (0us) | Total: 0.0% (678us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `@lazy` (1)

### `bound call`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (908us) | Samples: 0

**Called by:**
- `internal:primordials` (1)

**Calls:**
- `call` (1)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.3% (6.4ms) | Samples: 0

**Called by:**
- `(module)` (8)

**Calls:**
- `anonymous` (5)
- `get WriteStream` (3)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (908us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (908us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` | Self: 0.0% (0us) | Total: 1.1% (22.7ms) | Samples: 0

**Calls:**
- `runTrial` (24)
- `runTrial` (1)
- `runTrial` (1)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.1% (3.1ms) | Samples: 0

**Called by:**
- `anonymous` (4)

**Calls:**
- `anonymous` (4)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` | Self: 0.0% (0us) | Total: 0.3% (7.0ms) | Samples: 0

**Called by:**
- `step` (9)

**Calls:**
- `from` (9)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:211` | Self: 0.0% (0us) | Total: 1.0% (20.2ms) | Samples: 0

**Called by:**
- `step` (26)

**Calls:**
- `map` (26)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (908us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (759us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:628` | Self: 0.0% (0us) | Total: 0.4% (8.9ms) | Samples: 0

**Called by:**
- `runTrial` (12)

**Calls:**
- `forEach` (12)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` | Self: 0.0% (0us) | Total: 0.3% (6.4ms) | Samples: 0

**Calls:**
- `(anonymous)` (8)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` | Self: 0.0% (0us) | Total: 0.6% (11.8ms) | Samples: 0

**Called by:**
- `(module)` (11)
- `(module)` (1)

**Calls:**
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

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:38` | Self: 0.0% (0us) | Total: 0.0% (776us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `max` (1)

### `internal:primordials`
`internal:primordials:51` | Self: 0.0% (0us) | Total: 0.0% (908us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `bound call` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` | Self: 0.0% (0us) | Total: 98.4% (1.92s) | Samples: 0

**Calls:**
- `runTrial` (2446)
- `runTrial` (11)
- `runTrial` (5)
- `runTrial` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:50` | Self: 0.0% (0us) | Total: 0.0% (695us) | Samples: 0

**Called by:**
- `(module)` (1)

**Calls:**
- `from` (1)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 73.0% | 1.42s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 25.7% | 504.0ms | `[native code]` |
| 1.1% | 22.9ms | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
