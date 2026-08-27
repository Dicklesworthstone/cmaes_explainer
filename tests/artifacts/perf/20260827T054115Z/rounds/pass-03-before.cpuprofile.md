# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 9.81s | 15134 | 500us | 172 |

**Top 10:** `jacobiEigenSymmetric` 21.5%, `jacobiEigenSymmetric` 21.4%, `step` 17.7%, `transformFromEigenCoordinates` 4.9%, `step` 3.3%, `whitenWithEigensystem` 3.2%, `reconstructSymmetric` 2.6%, `whitenWithEigensystem` 2.4%, `map` 2.0%, `hypot` 2.0%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 21.5% | 2.11s | 22.4% | 2.20s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:139` |
| 21.4% | 2.10s | 22.5% | 2.21s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` |
| 17.7% | 1.74s | 17.7% | 1.74s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:636` |
| 4.9% | 484.0ms | 5.0% | 496.3ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:247` |
| 3.3% | 330.4ms | 3.7% | 371.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:629` |
| 3.2% | 316.5ms | 3.2% | 323.5ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:269` |
| 2.6% | 261.3ms | 3.0% | 303.6ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:228` |
| 2.4% | 242.2ms | 2.5% | 246.6ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:262` |
| 2.0% | 204.3ms | 4.4% | 438.6ms | `map` | `[native code]` |
| 2.0% | 196.6ms | 2.0% | 196.6ms | `hypot` | `[native code]` |
| 1.8% | 185.2ms | 1.8% | 185.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |
| 1.7% | 175.9ms | 1.7% | 175.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:649` |
| 1.4% | 141.9ms | 1.4% | 141.9ms | `fill` | `[native code]` |
| 1.4% | 139.8ms | 2.0% | 204.1ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.2% | 124.8ms | 1.2% | 124.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` |
| 1.1% | 110.3ms | 1.1% | 110.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.7% | 75.9ms | 0.7% | 75.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` |
| 0.7% | 74.9ms | 0.7% | 74.9ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:527` |
| 0.7% | 72.4ms | 0.7% | 72.4ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:542` |
| 0.6% | 59.6ms | 0.7% | 78.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` |
| 0.4% | 45.7ms | 1.2% | 119.8ms | `some` | `[native code]` |
| 0.4% | 41.8ms | 0.4% | 41.8ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.4% | 41.4ms | 0.7% | 78.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.4% | 40.3ms | 1.2% | 121.5ms | `from` | `[native code]` |
| 0.3% | 38.8ms | 0.4% | 46.4ms | `sort` | `[native code]` |
| 0.3% | 34.7ms | 0.3% | 34.7ms | `Float64Array` | `[native code]` |
| 0.3% | 33.9ms | 0.7% | 74.9ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.3% | 31.3ms | 0.3% | 31.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` |
| 0.3% | 31.2ms | 0.3% | 32.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:589` |
| 0.3% | 29.9ms | 0.3% | 29.9ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:300` |
| 0.2% | 26.6ms | 1.3% | 131.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 0.2% | 22.3ms | 0.2% | 22.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.1% | 15.9ms | 0.1% | 15.9ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:20` |
| 0.1% | 12.5ms | 0.1% | 12.5ms | `push` | `[native code]` |
| 0.1% | 11.9ms | 0.1% | 11.9ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 0.1% | 10.5ms | 0.1% | 11.2ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:520` |
| 0.0% | 8.8ms | 0.0% | 8.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:622` |
| 0.0% | 8.6ms | 0.8% | 84.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` |
| 0.0% | 8.3ms | 0.0% | 8.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:637` |
| 0.0% | 6.8ms | 2.5% | 252.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:557` |
| 0.0% | 6.5ms | 0.0% | 6.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:181` |
| 0.0% | 5.4ms | 0.1% | 11.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:663` |
| 0.0% | 5.2ms | 0.8% | 83.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` |
| 0.0% | 4.8ms | 0.1% | 14.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 4.8ms | 0.0% | 4.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:698` |
| 0.0% | 4.7ms | 0.0% | 4.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:680` |
| 0.0% | 4.6ms | 0.0% | 4.6ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:266` |
| 0.0% | 4.1ms | 0.0% | 7.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:621` |
| 0.0% | 4.1ms | 0.2% | 22.8ms | `anonymous` | `[native code]` |
| 0.0% | 3.8ms | 0.0% | 3.8ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.7ms | 0.0% | 4.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:678` |
| 0.0% | 3.3ms | 0.5% | 55.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `reduce` | `[native code]` |
| 0.0% | 2.6ms | 0.0% | 2.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:633` |
| 0.0% | 2.6ms | 0.0% | 3.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:601` |
| 0.0% | 2.6ms | 0.0% | 2.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:246` |
| 0.0% | 2.0ms | 5.2% | 513.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:558` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:694` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:642` |
| 0.0% | 1.9ms | 0.0% | 2.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:656` |
| 0.0% | 1.9ms | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:682` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:165` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.8ms | 0.7% | 77.3ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` |
| 0.0% | 1.7ms | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:597` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 0.0% | 1.4ms | 3.1% | 305.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:653` |
| 0.0% | 1.3ms | 0.2% | 23.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:567` |
| 0.0% | 1.3ms | 1.6% | 160.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` |
| 0.0% | 1.3ms | 0.0% | 4.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:704` |
| 0.0% | 1.2ms | 0.2% | 28.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:180` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:603` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:583` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `abs` | `[native code]` |
| 0.0% | 1.2ms | 1.5% | 154.9ms | `forEach` | `[native code]` |
| 0.0% | 1.1ms | 0.2% | 21.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` |
| 0.0% | 1.1ms | 0.0% | 3.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:687` |
| 0.0% | 1.0ms | 0.0% | 1.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` |
| 0.0% | 1.0ms | 0.0% | 1.0ms | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 813us | 0.5% | 58.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 0.0% | 782us | 0.0% | 782us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:516` |
| 0.0% | 767us | 0.0% | 767us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:149` |
| 0.0% | 754us | 0.0% | 754us | `internal:primordials` | `internal:primordials:2` |
| 0.0% | 748us | 0.0% | 748us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 737us | 0.0% | 737us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:599` |
| 0.0% | 730us | 0.0% | 730us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` |
| 0.0% | 721us | 0.0% | 721us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:658` |
| 0.0% | 712us | 0.0% | 712us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:444` |
| 0.0% | 700us | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.0% | 699us | 0.0% | 699us | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 690us | 0.0% | 690us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:553` |
| 0.0% | 687us | 0.0% | 687us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 686us | 0.0% | 686us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.0% | 680us | 0.0% | 680us | `sqrt` | `[native code]` |
| 0.0% | 680us | 0.0% | 680us | `safeObjectiveValue` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:378` |
| 0.0% | 675us | 1.5% | 153.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:664` |
| 0.0% | 658us | 0.0% | 658us | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:370` |
| 0.0% | 656us | 0.0% | 7.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.0% | 641us | 0.0% | 641us | `open` | `internal:fs/streams` |
| 0.0% | 631us | 0.0% | 631us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:24` |
| 0.0% | 629us | 0.0% | 5.9ms | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` |
| 0.0% | 626us | 0.0% | 8.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` |
| 0.0% | 595us | 0.0% | 595us | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 585us | 0.0% | 585us | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 583us | 0.0% | 583us | `filter` | `[native code]` |
| 0.0% | 580us | 0.0% | 580us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 579us | 0.0% | 2.6ms | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:465` |
| 0.0% | 575us | 5.1% | 502.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` |
| 0.0% | 559us | 0.0% | 2.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:669` |
| 0.0% | 552us | 0.0% | 552us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:381` |
| 0.0% | 540us | 0.0% | 540us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:85` |
| 0.0% | 529us | 0.0% | 529us | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:271` |
| 0.0% | 527us | 0.0% | 527us | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 527us | 0.0% | 527us | `@lazy` | `[native code]` |
| 0.0% | 518us | 0.0% | 518us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:551` |
| 0.0% | 514us | 0.0% | 514us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:641` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 99.4% | 9.75s | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 93.2% | 9.14s | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` |
| 48.0% | 4.70s | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:652` |
| 22.5% | 2.21s | 21.4% | 2.10s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` |
| 22.4% | 2.20s | 21.5% | 2.11s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:139` |
| 17.7% | 1.74s | 17.7% | 1.74s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:636` |
| 6.6% | 656.9ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` |
| 5.2% | 513.4ms | 0.0% | 2.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:558` |
| 5.1% | 502.5ms | 0.0% | 575us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` |
| 5.0% | 496.3ms | 4.9% | 484.0ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:247` |
| 4.4% | 438.6ms | 2.0% | 204.3ms | `map` | `[native code]` |
| 3.7% | 371.1ms | 3.3% | 330.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:629` |
| 3.2% | 323.5ms | 3.2% | 316.5ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:269` |
| 3.1% | 305.0ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:653` |
| 3.0% | 303.6ms | 2.6% | 261.3ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:228` |
| 2.5% | 252.9ms | 0.0% | 6.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:557` |
| 2.5% | 246.6ms | 2.4% | 242.2ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:262` |
| 2.0% | 204.1ms | 1.4% | 139.8ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 2.0% | 196.6ms | 2.0% | 196.6ms | `hypot` | `[native code]` |
| 1.8% | 185.2ms | 1.8% | 185.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |
| 1.7% | 175.9ms | 1.7% | 175.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:649` |
| 1.6% | 160.6ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` |
| 1.5% | 154.9ms | 0.0% | 1.2ms | `forEach` | `[native code]` |
| 1.5% | 153.1ms | 0.0% | 675us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:664` |
| 1.4% | 141.9ms | 1.4% | 141.9ms | `fill` | `[native code]` |
| 1.3% | 131.9ms | 0.2% | 26.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 1.2% | 124.8ms | 1.2% | 124.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` |
| 1.2% | 121.5ms | 0.4% | 40.3ms | `from` | `[native code]` |
| 1.2% | 119.8ms | 0.4% | 45.7ms | `some` | `[native code]` |
| 1.1% | 110.3ms | 1.1% | 110.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.1% | 109.0ms | 0.0% | 0us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` |
| 0.8% | 84.2ms | 0.0% | 8.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` |
| 0.8% | 83.0ms | 0.0% | 5.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` |
| 0.7% | 78.4ms | 0.4% | 41.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.7% | 78.0ms | 0.6% | 59.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` |
| 0.7% | 77.3ms | 0.0% | 1.8ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` |
| 0.7% | 75.9ms | 0.7% | 75.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` |
| 0.7% | 74.9ms | 0.3% | 33.9ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.7% | 74.9ms | 0.7% | 74.9ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:527` |
| 0.7% | 74.0ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:596` |
| 0.7% | 72.4ms | 0.7% | 72.4ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:542` |
| 0.6% | 66.3ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` |
| 0.6% | 60.5ms | 0.0% | 0us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 0.6% | 60.5ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:106` |
| 0.5% | 58.3ms | 0.0% | 813us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 0.5% | 56.6ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` |
| 0.5% | 55.3ms | 0.0% | 3.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 0.5% | 50.8ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:534` |
| 0.4% | 46.4ms | 0.3% | 38.8ms | `sort` | `[native code]` |
| 0.4% | 41.8ms | 0.4% | 41.8ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.4% | 41.7ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` |
| 0.3% | 35.3ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:546` |
| 0.3% | 34.7ms | 0.3% | 34.7ms | `Float64Array` | `[native code]` |
| 0.3% | 32.6ms | 0.3% | 31.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:589` |
| 0.3% | 31.4ms | 0.0% | 0us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` |
| 0.3% | 31.3ms | 0.3% | 31.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` |
| 0.3% | 29.9ms | 0.3% | 29.9ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:300` |
| 0.3% | 29.6ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:692` |
| 0.2% | 28.5ms | 0.0% | 1.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:180` |
| 0.2% | 23.8ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` |
| 0.2% | 22.8ms | 0.0% | 4.1ms | `anonymous` | `[native code]` |
| 0.2% | 22.3ms | 0.2% | 22.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.2% | 21.1ms | 0.0% | 1.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` |
| 0.1% | 16.4ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:684` |
| 0.1% | 16.3ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 0.1% | 15.9ms | 0.1% | 15.9ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:20` |
| 0.1% | 14.0ms | 0.0% | 4.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.1% | 12.5ms | 0.1% | 12.5ms | `push` | `[native code]` |
| 0.1% | 11.9ms | 0.1% | 11.9ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 0.1% | 11.6ms | 0.0% | 5.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:663` |
| 0.1% | 11.2ms | 0.1% | 10.5ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:520` |
| 0.0% | 9.1ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:683` |
| 0.0% | 8.9ms | 0.0% | 626us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` |
| 0.0% | 8.8ms | 0.0% | 8.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:622` |
| 0.0% | 8.3ms | 0.0% | 8.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:637` |
| 0.0% | 7.9ms | 0.0% | 4.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:621` |
| 0.0% | 7.4ms | 0.0% | 656us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.0% | 6.5ms | 0.0% | 6.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:181` |
| 0.0% | 6.0ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` |
| 0.0% | 6.0ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.0% | 5.9ms | 0.0% | 629us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` |
| 0.0% | 5.4ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.0% | 4.8ms | 0.0% | 4.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:698` |
| 0.0% | 4.7ms | 0.0% | 4.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:680` |
| 0.0% | 4.6ms | 0.0% | 4.6ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:266` |
| 0.0% | 4.3ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.0% | 4.3ms | 0.0% | 3.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:678` |
| 0.0% | 4.2ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:704` |
| 0.0% | 3.8ms | 0.0% | 2.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:601` |
| 0.0% | 3.8ms | 0.0% | 3.8ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.7ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 3.5ms | 0.0% | 1.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:687` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `reduce` | `[native code]` |
| 0.0% | 2.7ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 2.6ms | 0.0% | 2.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:633` |
| 0.0% | 2.6ms | 0.0% | 579us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:465` |
| 0.0% | 2.6ms | 0.0% | 1.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:656` |
| 0.0% | 2.6ms | 0.0% | 559us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:669` |
| 0.0% | 2.6ms | 0.0% | 2.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.0% | 2.4ms | 0.0% | 1.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:597` |
| 0.0% | 2.4ms | 0.0% | 1.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:682` |
| 0.0% | 2.4ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:578` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:246` |
| 0.0% | 2.1ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 2.1ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 2.1ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 2.1ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 1.9ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:694` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:642` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:165` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.8ms | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:303` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` |
| 0.0% | 1.4ms | 0.0% | 700us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 0.0% | 1.3ms | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 1.3ms | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 1.3ms | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:567` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:603` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:583` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `abs` | `[native code]` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` |
| 0.0% | 1.0ms | 0.0% | 1.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` |
| 0.0% | 1.0ms | 0.0% | 1.0ms | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 782us | 0.0% | 782us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:516` |
| 0.0% | 767us | 0.0% | 767us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:149` |
| 0.0% | 754us | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 754us | 0.0% | 754us | `internal:primordials` | `internal:primordials:2` |
| 0.0% | 754us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 754us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 748us | 0.0% | 748us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 745us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:464` |
| 0.0% | 740us | 0.0% | 0us | `exp` | `[native code]` |
| 0.0% | 737us | 0.0% | 737us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:599` |
| 0.0% | 730us | 0.0% | 730us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` |
| 0.0% | 721us | 0.0% | 721us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:658` |
| 0.0% | 712us | 0.0% | 712us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:444` |
| 0.0% | 699us | 0.0% | 699us | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 690us | 0.0% | 690us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:553` |
| 0.0% | 687us | 0.0% | 687us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 686us | 0.0% | 686us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.0% | 680us | 0.0% | 680us | `sqrt` | `[native code]` |
| 0.0% | 680us | 0.0% | 680us | `safeObjectiveValue` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:378` |
| 0.0% | 680us | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:304` |
| 0.0% | 658us | 0.0% | 658us | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:370` |
| 0.0% | 641us | 0.0% | 0us | `writeFast` | `internal:fs/streams:367` |
| 0.0% | 641us | 0.0% | 641us | `open` | `internal:fs/streams` |
| 0.0% | 631us | 0.0% | 631us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:24` |
| 0.0% | 595us | 0.0% | 595us | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 585us | 0.0% | 585us | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 583us | 0.0% | 583us | `filter` | `[native code]` |
| 0.0% | 583us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:463` |
| 0.0% | 580us | 0.0% | 580us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 552us | 0.0% | 552us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:381` |
| 0.0% | 552us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:419` |
| 0.0% | 540us | 0.0% | 540us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:85` |
| 0.0% | 529us | 0.0% | 529us | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:271` |
| 0.0% | 527us | 0.0% | 527us | `@lazy` | `[native code]` |
| 0.0% | 527us | 0.0% | 0us | `internal:fs/binding` | `internal:fs/binding:3` |
| 0.0% | 527us | 0.0% | 527us | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 518us | 0.0% | 518us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:551` |
| 0.0% | 514us | 0.0% | 514us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:641` |
| 0.0% | 455us | 0.0% | 0us | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:521` |

## Function Details

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:139` | Self: 21.5% (2.11s) | Total: 22.4% (2.20s) | Samples: 3249

**Called by:**
- `step` (3386)

**Calls:**
- `hypot` (137)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` | Self: 21.4% (2.10s) | Total: 22.5% (2.21s) | Samples: 3264

**Called by:**
- `step` (3429)

**Calls:**
- `hypot` (165)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:636` | Self: 17.7% (1.74s) | Total: 17.7% (1.74s) | Samples: 2696

**Called by:**
- `runTrial` (2688)
- `runTrial` (8)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:247` | Self: 4.9% (484.0ms) | Total: 5.0% (496.3ms) | Samples: 737

**Called by:**
- `step` (757)

**Calls:**
- `createZeroVector` (15)
- `fill` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:629` | Self: 3.3% (330.4ms) | Total: 3.7% (371.1ms) | Samples: 510

**Called by:**
- `runTrial` (574)
- `runTrial` (1)

**Calls:**
- `createZeroMatrix` (51)
- `from` (10)
- `createZeroMatrix` (3)
- `createZeroMatrix` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:269` | Self: 3.2% (316.5ms) | Total: 3.2% (323.5ms) | Samples: 496

**Called by:**
- `step` (443)
- `step` (64)

**Calls:**
- `fill` (6)
- `createZeroVector` (5)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:228` | Self: 2.6% (261.3ms) | Total: 3.0% (303.6ms) | Samples: 406

**Called by:**
- `step` (472)

**Calls:**
- `from` (66)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:262` | Self: 2.4% (242.2ms) | Total: 2.5% (246.6ms) | Samples: 370

**Called by:**
- `step` (328)
- `step` (49)

**Calls:**
- `createZeroVector` (5)
- `fill` (2)

### `map`
`[native code]` | Self: 2.0% (204.3ms) | Total: 4.4% (438.6ms) | Samples: 313

**Called by:**
- `cloneMatrix` (170)
- `step` (121)
- `step` (103)
- `step` (88)
- `(anonymous)` (81)
- `(anonymous)` (31)
- `jacobiEigenSymmetric` (14)
- `step` (12)
- `step` (10)
- `step` (9)
- `step` (9)
- `step` (7)
- `jacobiEigenSymmetric` (7)
- `jacobiEigenSymmetric` (6)
- `step` (4)
- `map` (3)
- `alignProjectionBasis` (1)
- `alignProjectionBasis` (1)
- `CMAESOptimizerND` (1)

**Calls:**
- `(anonymous)` (150)
- `(anonymous)` (118)
- `(anonymous)` (86)
- `(anonymous)` (3)
- `map` (3)
- `abs` (2)
- `(anonymous)` (1)
- `(anonymous)` (1)
- `(anonymous)` (1)

### `hypot`
`[native code]` | Self: 2.0% (196.6ms) | Total: 2.0% (196.6ms) | Samples: 302

**Called by:**
- `jacobiEigenSymmetric` (165)
- `jacobiEigenSymmetric` (137)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` | Self: 1.8% (185.2ms) | Total: 1.8% (185.2ms) | Samples: 289

**Called by:**
- `runTrial` (289)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:649` | Self: 1.7% (175.9ms) | Total: 1.7% (175.9ms) | Samples: 274

**Called by:**
- `runTrial` (273)
- `runTrial` (1)

### `fill`
`[native code]` | Self: 1.4% (141.9ms) | Total: 1.4% (141.9ms) | Samples: 218

**Called by:**
- `sampleGaussianVectorND` (96)
- `ellipsoidObjective` (63)
- `from` (44)
- `whitenWithEigensystem` (6)
- `transformFromEigenCoordinates` (5)
- `whitenWithEigensystem` (2)
- `step` (1)
- `sampleGaussianVectorND` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.4% (139.8ms) | Total: 2.0% (204.1ms) | Samples: 221

**Called by:**
- `step` (317)

**Calls:**
- `fill` (96)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` | Self: 1.2% (124.8ms) | Total: 1.2% (124.8ms) | Samples: 194

**Called by:**
- `runTrial` (193)
- `runTrial` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.1% (110.3ms) | Total: 1.1% (110.3ms) | Samples: 173

**Called by:**
- `map` (150)
- `some` (23)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` | Self: 0.7% (75.9ms) | Total: 0.7% (75.9ms) | Samples: 118

**Called by:**
- `map` (118)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:527` | Self: 0.7% (74.9ms) | Total: 0.7% (74.9ms) | Samples: 116

**Called by:**
- `projectTo3D` (116)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:542` | Self: 0.7% (72.4ms) | Total: 0.7% (72.4ms) | Samples: 111

**Called by:**
- `step` (111)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` | Self: 0.6% (59.6ms) | Total: 0.7% (78.0ms) | Samples: 94

**Called by:**
- `step` (123)

**Calls:**
- `Float64Array` (29)

### `some`
`[native code]` | Self: 0.4% (45.7ms) | Total: 1.2% (119.8ms) | Samples: 71

**Called by:**
- `validateSquareFiniteMatrix` (94)
- `(anonymous)` (90)
- `some` (2)
- `projectTo3D` (1)

**Calls:**
- `(anonymous)` (91)
- `(anonymous)` (23)
- `some` (2)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.4% (41.8ms) | Total: 0.4% (41.8ms) | Samples: 65

**Called by:**
- `(anonymous)` (28)
- `step` (22)
- `step` (15)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.4% (41.4ms) | Total: 0.7% (78.4ms) | Samples: 64

**Called by:**
- `step` (121)

**Calls:**
- `from` (57)

### `from`
`[native code]` | Self: 0.4% (40.3ms) | Total: 1.2% (121.5ms) | Samples: 64

**Called by:**
- `reconstructSymmetric` (66)
- `jacobiEigenSymmetric` (57)
- `createZeroMatrix` (51)
- `step` (10)
- `jacobiEigenSymmetric` (5)
- `exp` (1)

**Calls:**
- `(anonymous)` (48)
- `fill` (44)
- `(anonymous)` (34)

### `sort`
`[native code]` | Self: 0.3% (38.8ms) | Total: 0.4% (46.4ms) | Samples: 58

**Called by:**
- `jacobiEigenSymmetric` (38)
- `step` (33)

**Calls:**
- `(anonymous)` (11)
- `(anonymous)` (2)

### `Float64Array`
`[native code]` | Self: 0.3% (34.7ms) | Total: 0.3% (34.7ms) | Samples: 53

**Called by:**
- `jacobiEigenSymmetric` (29)
- `jacobiEigenSymmetric` (24)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` | Self: 0.3% (33.9ms) | Total: 0.7% (74.9ms) | Samples: 48

**Called by:**
- `step` (111)

**Calls:**
- `fill` (63)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` | Self: 0.3% (31.3ms) | Total: 0.3% (31.3ms) | Samples: 48

**Called by:**
- `from` (48)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:589` | Self: 0.3% (31.2ms) | Total: 0.3% (32.6ms) | Samples: 48

**Called by:**
- `runTrial` (50)

**Calls:**
- `adaptationPoint` (1)
- `adaptationPoint` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:300` | Self: 0.3% (29.9ms) | Total: 0.3% (29.9ms) | Samples: 47

**Called by:**
- `step` (47)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` | Self: 0.2% (26.6ms) | Total: 1.3% (131.9ms) | Samples: 42

**Called by:**
- `forEach` (206)

**Calls:**
- `projectTo3D` (120)
- `projectTo3D` (28)
- `projectTo3D` (15)
- `projectTo3D` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.2% (22.3ms) | Total: 0.2% (22.3ms) | Samples: 34

**Called by:**
- `from` (34)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:20` | Self: 0.1% (15.9ms) | Total: 0.1% (15.9ms) | Samples: 25

**Called by:**
- `transformFromEigenCoordinates` (15)
- `whitenWithEigensystem` (5)
- `whitenWithEigensystem` (5)

### `push`
`[native code]` | Self: 0.1% (12.5ms) | Total: 0.1% (12.5ms) | Samples: 20

**Called by:**
- `step` (15)
- `step` (5)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` | Self: 0.1% (11.9ms) | Total: 0.1% (11.9ms) | Samples: 19

**Called by:**
- `step` (19)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:520` | Self: 0.1% (10.5ms) | Total: 0.1% (11.2ms) | Samples: 16

**Called by:**
- `(anonymous)` (15)
- `step` (2)

**Calls:**
- `requireFiniteVector` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:622` | Self: 0.0% (8.8ms) | Total: 0.0% (8.8ms) | Samples: 14

**Called by:**
- `runTrial` (14)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` | Self: 0.0% (8.6ms) | Total: 0.8% (84.2ms) | Samples: 14

**Called by:**
- `runTrial` (125)
- `runTrial` (1)

**Calls:**
- `ellipsoidObjective` (111)
- `safeObjectiveValue` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:637` | Self: 0.0% (8.3ms) | Total: 0.0% (8.3ms) | Samples: 9

**Called by:**
- `runTrial` (9)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:557` | Self: 0.0% (6.8ms) | Total: 2.5% (252.9ms) | Samples: 10

**Called by:**
- `runTrial` (389)
- `runTrial` (4)

**Calls:**
- `sampleGaussianVectorND` (317)
- `sampleGaussianVectorND` (47)
- `push` (15)
- `sampleGaussianVectorND` (3)
- `sampleGaussianVectorND` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:181` | Self: 0.0% (6.5ms) | Total: 0.0% (6.5ms) | Samples: 11

**Called by:**
- `sort` (11)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:663` | Self: 0.0% (5.4ms) | Total: 0.1% (11.6ms) | Samples: 3

**Called by:**
- `runTrial` (12)

**Calls:**
- `map` (9)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` | Self: 0.0% (5.2ms) | Total: 0.8% (83.0ms) | Samples: 7

**Called by:**
- `runTrial` (128)

**Calls:**
- `map` (121)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` | Self: 0.0% (4.8ms) | Total: 0.1% (14.0ms) | Samples: 7

**Called by:**
- `step` (21)

**Calls:**
- `map` (14)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:698` | Self: 0.0% (4.8ms) | Total: 0.0% (4.8ms) | Samples: 6

**Called by:**
- `runTrial` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:680` | Self: 0.0% (4.7ms) | Total: 0.0% (4.7ms) | Samples: 7

**Called by:**
- `runTrial` (7)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:266` | Self: 0.0% (4.6ms) | Total: 0.0% (4.6ms) | Samples: 6

**Called by:**
- `step` (5)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:621` | Self: 0.0% (4.1ms) | Total: 0.0% (7.9ms) | Samples: 7

**Called by:**
- `runTrial` (13)

**Calls:**
- `vecDot` (6)

### `anonymous`
`[native code]` | Self: 0.0% (4.1ms) | Total: 0.2% (22.8ms) | Samples: 6

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
- `internal:shared` (1)
- `internal:primordials` (1)
- `internal:fs/binding` (1)

### `vecDot`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (3.8ms) | Total: 0.0% (3.8ms) | Samples: 6

**Called by:**
- `step` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:678` | Self: 0.0% (3.7ms) | Total: 0.0% (4.3ms) | Samples: 6

**Called by:**
- `runTrial` (7)

**Calls:**
- `radius` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` | Self: 0.0% (3.3ms) | Total: 0.5% (55.3ms) | Samples: 5

**Called by:**
- `map` (86)

**Calls:**
- `map` (81)

### `reduce`
`[native code]` | Self: 0.0% (2.8ms) | Total: 0.0% (2.8ms) | Samples: 4

**Called by:**
- `step` (3)
- `CMAESOptimizerND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:633` | Self: 0.0% (2.6ms) | Total: 0.0% (2.6ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:601` | Self: 0.0% (2.6ms) | Total: 0.0% (3.8ms) | Samples: 4

**Called by:**
- `runTrial` (6)

**Calls:**
- `vecNorm` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` | Self: 0.0% (2.6ms) | Total: 0.0% (2.6ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` | Self: 0.0% (2.4ms) | Total: 0.0% (2.4ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:246` | Self: 0.0% (2.4ms) | Total: 0.0% (2.4ms) | Samples: 4

**Called by:**
- `step` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:558` | Self: 0.0% (2.0ms) | Total: 5.2% (513.4ms) | Samples: 3

**Called by:**
- `runTrial` (781)
- `runTrial` (3)

**Calls:**
- `transformFromEigenCoordinates` (757)
- `transformFromEigenCoordinates` (19)
- `transformFromEigenCoordinates` (4)
- `transformFromEigenCoordinates` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` | Self: 0.0% (1.9ms) | Total: 0.0% (1.9ms) | Samples: 3

**Called by:**
- `map` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:694` | Self: 0.0% (1.9ms) | Total: 0.0% (1.9ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:642` | Self: 0.0% (1.9ms) | Total: 0.0% (1.9ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:656` | Self: 0.0% (1.9ms) | Total: 0.0% (2.6ms) | Samples: 3

**Called by:**
- `runTrial` (4)

**Calls:**
- `exp` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:682` | Self: 0.0% (1.9ms) | Total: 0.0% (2.4ms) | Samples: 3

**Called by:**
- `runTrial` (4)

**Calls:**
- `variancePercent` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:165` | Self: 0.0% (1.8ms) | Total: 0.0% (1.8ms) | Samples: 3

**Called by:**
- `step` (3)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.8ms) | Total: 0.0% (1.8ms) | Samples: 3

**Called by:**
- `step` (3)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` | Self: 0.0% (1.8ms) | Total: 0.7% (77.3ms) | Samples: 3

**Called by:**
- `(anonymous)` (120)

**Calls:**
- `coordinate` (116)
- `coordinate` (1)

### `nextHalfOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.8ms) | Total: 0.0% (1.8ms) | Samples: 3

**Called by:**
- `sampleGaussianVectorND` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` | Self: 0.0% (1.7ms) | Total: 0.0% (1.7ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:597` | Self: 0.0% (1.7ms) | Total: 0.0% (2.4ms) | Samples: 3

**Called by:**
- `runTrial` (4)

**Calls:**
- `sqrt` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:653` | Self: 0.0% (1.4ms) | Total: 3.1% (305.0ms) | Samples: 2

**Called by:**
- `runTrial` (474)

**Calls:**
- `reconstructSymmetric` (472)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` | Self: 0.0% (1.3ms) | Total: 0.2% (23.8ms) | Samples: 2

**Called by:**
- `runTrial` (35)

**Calls:**
- `sort` (33)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:567` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` | Self: 0.0% (1.3ms) | Total: 1.6% (160.6ms) | Samples: 2

**Called by:**
- `runTrial` (247)
- `runTrial` (1)

**Calls:**
- `alignProjectionBasis` (111)
- `alignProjectionBasis` (79)
- `alignProjectionBasis` (55)
- `alignProjectionBasis` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:704` | Self: 0.0% (1.3ms) | Total: 0.0% (4.2ms) | Samples: 2

**Called by:**
- `runTrial` (6)
- `runTrial` (1)

**Calls:**
- `push` (5)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:180` | Self: 0.0% (1.2ms) | Total: 0.2% (28.5ms) | Samples: 2

**Called by:**
- `step` (45)

**Calls:**
- `sort` (38)
- `from` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:603` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `vecNorm`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 2

**Called by:**
- `step` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:583` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 2

**Called by:**
- `forEach` (2)

### `abs`
`[native code]` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 2

**Called by:**
- `map` (2)

### `forEach`
`[native code]` | Self: 0.0% (1.2ms) | Total: 1.5% (154.9ms) | Samples: 2

**Called by:**
- `step` (238)
- `step` (4)

**Calls:**
- `(anonymous)` (206)
- `(anonymous)` (32)
- `(anonymous)` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` | Self: 0.0% (1.1ms) | Total: 0.2% (21.1ms) | Samples: 2

**Called by:**
- `forEach` (32)
- `map` (1)

**Calls:**
- `map` (31)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` | Self: 0.0% (1.1ms) | Total: 0.0% (1.1ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` | Self: 0.0% (1.1ms) | Total: 0.0% (1.1ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:687` | Self: 0.0% (1.1ms) | Total: 0.0% (3.5ms) | Samples: 2

**Called by:**
- `runTrial` (6)

**Calls:**
- `map` (4)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` | Self: 0.0% (1.0ms) | Total: 0.0% (1.0ms) | Samples: 2

**Called by:**
- `sort` (2)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.0ms) | Total: 0.0% (1.0ms) | Samples: 2

**Called by:**
- `step` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` | Self: 0.0% (813us) | Total: 0.5% (58.3ms) | Samples: 1

**Called by:**
- `some` (91)

**Calls:**
- `some` (90)

### `adaptationPoint`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:516` | Self: 0.0% (782us) | Total: 0.0% (782us) | Samples: 1

**Called by:**
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:149` | Self: 0.0% (767us) | Total: 0.0% (767us) | Samples: 1

**Called by:**
- `step` (1)

### `internal:primordials`
`internal:primordials:2` | Self: 0.0% (754us) | Total: 0.0% (754us) | Samples: 1

**Called by:**
- `anonymous` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (748us) | Total: 0.0% (748us) | Samples: 1

**Called by:**
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:599` | Self: 0.0% (737us) | Total: 0.0% (737us) | Samples: 1

**Called by:**
- `map` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` | Self: 0.0% (730us) | Total: 0.0% (730us) | Samples: 1

**Called by:**
- `map` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:658` | Self: 0.0% (721us) | Total: 0.0% (721us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:444` | Self: 0.0% (712us) | Total: 0.0% (712us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` | Self: 0.0% (700us) | Total: 0.0% (1.4ms) | Samples: 1

**Called by:**
- `runTrial` (2)

**Calls:**
- `fill` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (699us) | Total: 0.0% (699us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:553` | Self: 0.0% (690us) | Total: 0.0% (690us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (687us) | Total: 0.0% (687us) | Samples: 1

**Called by:**
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.0% (686us) | Total: 0.0% (686us) | Samples: 1

**Called by:**
- `step` (1)

### `sqrt`
`[native code]` | Self: 0.0% (680us) | Total: 0.0% (680us) | Samples: 1

**Called by:**
- `step` (1)

### `safeObjectiveValue`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:378` | Self: 0.0% (680us) | Total: 0.0% (680us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:664` | Self: 0.0% (675us) | Total: 1.5% (153.1ms) | Samples: 1

**Called by:**
- `runTrial` (238)
- `runTrial` (1)

**Calls:**
- `forEach` (238)

### `requireFiniteVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:370` | Self: 0.0% (658us) | Total: 0.0% (658us) | Samples: 1

**Called by:**
- `projectTo3D` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` | Self: 0.0% (656us) | Total: 0.0% (7.4ms) | Samples: 1

**Called by:**
- `runTrial` (10)
- `runTrial` (1)

**Calls:**
- `map` (10)

### `open`
`internal:fs/streams` | Self: 0.0% (641us) | Total: 0.0% (641us) | Samples: 1

**Called by:**
- `writeFast` (1)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:24` | Self: 0.0% (631us) | Total: 0.0% (631us) | Samples: 1

**Called by:**
- `step` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` | Self: 0.0% (629us) | Total: 0.0% (5.9ms) | Samples: 1

**Called by:**
- `(module)` (5)
- `(module)` (2)

**Calls:**
- `CMAESOptimizerND` (2)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` | Self: 0.0% (626us) | Total: 0.0% (8.9ms) | Samples: 1

**Called by:**
- `runTrial` (13)

**Calls:**
- `map` (12)

### `radius`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (595us) | Total: 0.0% (595us) | Samples: 1

**Called by:**
- `step` (1)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (585us) | Total: 0.0% (585us) | Samples: 1

**Called by:**
- `projectTo3D` (1)

### `filter`
`[native code]` | Self: 0.0% (583us) | Total: 0.0% (583us) | Samples: 1

**Called by:**
- `CMAESOptimizerND` (1)

### `adaptationPoint`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (580us) | Total: 0.0% (580us) | Samples: 1

**Called by:**
- `step` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:465` | Self: 0.0% (579us) | Total: 0.0% (2.6ms) | Samples: 1

**Called by:**
- `runTrial` (2)

**Calls:**
- `map` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` | Self: 0.0% (575us) | Total: 5.1% (502.5ms) | Samples: 1

**Called by:**
- `runTrial` (773)
- `runTrial` (5)

**Calls:**
- `whitenWithEigensystem` (443)
- `whitenWithEigensystem` (328)
- `whitenWithEigensystem` (5)
- `whitenWithEigensystem` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:669` | Self: 0.0% (559us) | Total: 0.0% (2.6ms) | Samples: 1

**Called by:**
- `runTrial` (4)

**Calls:**
- `reduce` (3)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:381` | Self: 0.0% (552us) | Total: 0.0% (552us) | Samples: 1

**Called by:**
- `CMAESOptimizerND` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:85` | Self: 0.0% (540us) | Total: 0.0% (540us) | Samples: 1

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:271` | Self: 0.0% (529us) | Total: 0.0% (529us) | Samples: 1

**Called by:**
- `step` (1)

### `variancePercent`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (527us) | Total: 0.0% (527us) | Samples: 1

**Called by:**
- `step` (1)

### `@lazy`
`[native code]` | Self: 0.0% (527us) | Total: 0.0% (527us) | Samples: 1

**Called by:**
- `internal:fs/binding` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:551` | Self: 0.0% (518us) | Total: 0.0% (518us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:641` | Self: 0.0% (514us) | Total: 0.0% (514us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (2.7ms) | Samples: 0

**Called by:**
- `anonymous` (4)

**Calls:**
- `anonymous` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:692` | Self: 0.0% (0us) | Total: 0.3% (29.6ms) | Samples: 0

**Called by:**
- `runTrial` (47)

**Calls:**
- `cloneMatrix` (38)
- `map` (7)
- `cloneMatrix` (2)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` | Self: 0.0% (0us) | Total: 0.3% (31.4ms) | Samples: 0

**Called by:**
- `step` (51)

**Calls:**
- `from` (51)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` | Self: 0.0% (0us) | Total: 1.1% (109.0ms) | Samples: 0

**Called by:**
- `alignProjectionBasis` (78)
- `alignProjectionBasis` (54)
- `step` (38)

**Calls:**
- `map` (170)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` | Self: 0.0% (0us) | Total: 0.1% (16.3ms) | Samples: 0

**Called by:**
- `step` (24)

**Calls:**
- `Float64Array` (24)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:596` | Self: 0.0% (0us) | Total: 0.7% (74.0ms) | Samples: 0

**Called by:**
- `runTrial` (115)

**Calls:**
- `whitenWithEigensystem` (64)
- `whitenWithEigensystem` (49)
- `whitenWithEigensystem` (1)
- `whitenWithEigensystem` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:419` | Self: 0.0% (0us) | Total: 0.0% (552us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `(anonymous)` (1)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (754us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` | Self: 0.0% (0us) | Total: 0.0% (4.3ms) | Samples: 0

**Called by:**
- `step` (7)

**Calls:**
- `map` (7)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` | Self: 0.0% (0us) | Total: 93.2% (9.14s) | Samples: 0

**Calls:**
- `runTrial` (14063)
- `runTrial` (58)
- `runTrial` (5)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:106` | Self: 0.0% (0us) | Total: 0.6% (60.5ms) | Samples: 0

**Called by:**
- `step` (94)

**Calls:**
- `validateSquareFiniteMatrix` (94)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (2.1ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (1.3ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (1.9ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (754us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` | Self: 0.0% (0us) | Total: 0.0% (6.0ms) | Samples: 0

**Called by:**
- `runTrial` (9)

**Calls:**
- `map` (9)

### `internal:fs/binding`
`internal:fs/binding:3` | Self: 0.0% (0us) | Total: 0.0% (527us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `@lazy` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` | Self: 0.0% (0us) | Total: 6.6% (656.9ms) | Samples: 0

**Calls:**
- `runTrial` (990)
- `runTrial` (6)
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:683` | Self: 0.0% (0us) | Total: 0.0% (9.1ms) | Samples: 0

**Called by:**
- `runTrial` (15)

**Calls:**
- `projectTo3D` (15)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` | Self: 0.0% (0us) | Total: 0.0% (3.7ms) | Samples: 0

**Called by:**
- `step` (6)

**Calls:**
- `map` (6)

### `exp`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (740us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `from` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:546` | Self: 0.0% (0us) | Total: 0.3% (35.3ms) | Samples: 0

**Called by:**
- `step` (55)

**Calls:**
- `cloneMatrix` (54)
- `map` (1)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (5.4ms) | Samples: 0

**Called by:**
- `(module)` (8)

**Calls:**
- `anonymous` (5)
- `get WriteStream` (3)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` | Self: 0.0% (0us) | Total: 0.6% (60.5ms) | Samples: 0

**Called by:**
- `jacobiEigenSymmetric` (94)

**Calls:**
- `some` (94)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (1.3ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `writeFast`
`internal:fs/streams:367` | Self: 0.0% (0us) | Total: 0.0% (641us) | Samples: 0

**Called by:**
- `(module)` (1)

**Calls:**
- `open` (1)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (1.3ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` | Self: 0.0% (0us) | Total: 0.6% (66.3ms) | Samples: 0

**Called by:**
- `runTrial` (102)
- `runTrial` (1)

**Calls:**
- `map` (103)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` | Self: 0.0% (0us) | Total: 0.0% (6.0ms) | Samples: 0

**Calls:**
- `(anonymous)` (8)
- `writeFast` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:304` | Self: 0.0% (0us) | Total: 0.0% (680us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `fill` (1)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (2.1ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` | Self: 0.0% (0us) | Total: 0.5% (56.6ms) | Samples: 0

**Called by:**
- `runTrial` (87)
- `runTrial` (1)

**Calls:**
- `map` (88)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:578` | Self: 0.0% (0us) | Total: 0.0% (2.4ms) | Samples: 0

**Called by:**
- `runTrial` (4)

**Calls:**
- `forEach` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:684` | Self: 0.0% (0us) | Total: 0.1% (16.4ms) | Samples: 0

**Called by:**
- `runTrial` (24)

**Calls:**
- `projectTo3D` (22)
- `projectTo3D` (2)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:521` | Self: 0.0% (0us) | Total: 0.0% (455us) | Samples: 0

**Called by:**
- `(anonymous)` (1)

**Calls:**
- `some` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:303` | Self: 0.0% (0us) | Total: 0.0% (1.8ms) | Samples: 0

**Called by:**
- `step` (3)

**Calls:**
- `nextHalfOpenUnit` (3)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:534` | Self: 0.0% (0us) | Total: 0.5% (50.8ms) | Samples: 0

**Called by:**
- `step` (79)

**Calls:**
- `cloneMatrix` (78)
- `map` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` | Self: 0.0% (0us) | Total: 99.4% (9.75s) | Samples: 0

**Called by:**
- `(module)` (14063)
- `(module)` (990)

**Calls:**
- `step` (7229)
- `step` (2688)
- `step` (781)
- `step` (773)
- `step` (574)
- `step` (474)
- `step` (389)
- `step` (289)
- `step` (273)
- `step` (247)
- `step` (238)
- `step` (193)
- `step` (128)
- `step` (125)
- `step` (115)
- `step` (102)
- `step` (87)
- `step` (50)
- `step` (47)
- `step` (35)
- `step` (24)
- `step` (15)
- `step` (14)
- `step` (13)
- `step` (13)
- `step` (12)
- `step` (10)
- `step` (9)
- `step` (9)
- `step` (7)
- `step` (7)
- `step` (6)
- `step` (6)
- `step` (6)
- `step` (6)
- `step` (4)
- `step` (4)
- `step` (4)
- `step` (4)
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
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:463` | Self: 0.0% (0us) | Total: 0.0% (583us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `filter` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:464` | Self: 0.0% (0us) | Total: 0.0% (745us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `reduce` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` | Self: 0.0% (0us) | Total: 0.4% (41.7ms) | Samples: 0

**Called by:**
- `(module)` (58)
- `(module)` (6)

**Calls:**
- `step` (34)
- `step` (8)
- `step` (5)
- `step` (4)
- `step` (3)
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

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (2.1ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (2.1ms) | Samples: 0

**Called by:**
- `(anonymous)` (3)

**Calls:**
- `anonymous` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:652` | Self: 0.0% (0us) | Total: 48.0% (4.70s) | Samples: 0

**Called by:**
- `runTrial` (7229)
- `runTrial` (34)

**Calls:**
- `jacobiEigenSymmetric` (3429)
- `jacobiEigenSymmetric` (3386)
- `jacobiEigenSymmetric` (123)
- `jacobiEigenSymmetric` (121)
- `jacobiEigenSymmetric` (94)
- `jacobiEigenSymmetric` (45)
- `jacobiEigenSymmetric` (24)
- `jacobiEigenSymmetric` (21)
- `jacobiEigenSymmetric` (7)
- `jacobiEigenSymmetric` (6)
- `jacobiEigenSymmetric` (3)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (754us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 92.2% | 9.04s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 7.4% | 726.3ms | `[native code]` |
| 0.3% | 35.1ms | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.0% | 754us | `internal:primordials` |
| 0.0% | 641us | `internal:fs/streams` |
