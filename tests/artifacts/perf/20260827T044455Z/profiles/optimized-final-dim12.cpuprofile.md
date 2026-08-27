# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 7.97s | 4873 | 1.0ms | 168 |

**Top 10:** `step` 27.7%, `jacobiEigenSymmetric` 8.8%, `jacobiEigenSymmetric` 8.3%, `step` 5.7%, `map` 5.5%, `transformFromEigenCoordinates` 3.3%, `step` 3.3%, `sampleGaussianVectorND` 3.1%, `whitenWithEigensystem` 2.7%, `whitenWithEigensystem` 2.6%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 27.7% | 2.21s | 28.5% | 2.27s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:618` |
| 8.8% | 702.6ms | 9.3% | 746.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` |
| 8.3% | 665.7ms | 8.9% | 713.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:139` |
| 5.7% | 462.3ms | 5.7% | 462.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:655` |
| 5.5% | 443.3ms | 10.0% | 798.4ms | `map` | `[native code]` |
| 3.3% | 265.9ms | 3.7% | 300.5ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:247` |
| 3.3% | 264.6ms | 3.3% | 264.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:622` |
| 3.1% | 250.2ms | 3.1% | 250.2ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 2.7% | 222.7ms | 2.9% | 237.1ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:269` |
| 2.6% | 211.5ms | 2.8% | 230.1ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:262` |
| 2.0% | 165.4ms | 2.0% | 165.4ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.8% | 147.2ms | 1.8% | 147.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.4% | 117.3ms | 2.6% | 208.1ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:228` |
| 1.3% | 104.9ms | 1.3% | 104.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` |
| 1.2% | 102.3ms | 1.2% | 102.3ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:532` |
| 1.1% | 92.1ms | 1.1% | 92.1ms | `hypot` | `[native code]` |
| 1.0% | 86.2ms | 1.0% | 86.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 1.0% | 85.5ms | 1.0% | 85.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:630` |
| 1.0% | 80.1ms | 1.0% | 80.1ms | `fill` | `[native code]` |
| 0.9% | 78.9ms | 1.1% | 89.6ms | `sort` | `[native code]` |
| 0.9% | 74.7ms | 2.7% | 219.6ms | `from` | `[native code]` |
| 0.9% | 72.9ms | 0.9% | 77.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` |
| 0.8% | 64.6ms | 0.8% | 64.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` |
| 0.7% | 56.0ms | 2.7% | 218.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` |
| 0.6% | 48.5ms | 0.6% | 48.5ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.5% | 41.6ms | 1.7% | 138.1ms | `some` | `[native code]` |
| 0.5% | 40.5ms | 0.5% | 40.5ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:20` |
| 0.4% | 39.7ms | 1.1% | 91.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.4% | 33.0ms | 0.4% | 33.0ms | `push` | `[native code]` |
| 0.3% | 28.4ms | 0.3% | 28.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.3% | 26.2ms | 0.9% | 74.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:551` |
| 0.3% | 24.4ms | 3.9% | 316.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:547` |
| 0.2% | 21.7ms | 0.2% | 21.7ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.2% | 21.5ms | 0.2% | 21.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 0.2% | 21.5ms | 0.2% | 21.5ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:300` |
| 0.2% | 20.9ms | 0.2% | 20.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:678` |
| 0.2% | 18.6ms | 0.2% | 18.6ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:499` |
| 0.2% | 18.5ms | 0.2% | 18.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` |
| 0.2% | 18.1ms | 0.2% | 18.1ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:510` |
| 0.2% | 17.6ms | 0.5% | 44.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.2% | 16.8ms | 0.2% | 16.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |
| 0.2% | 16.5ms | 0.2% | 16.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:620` |
| 0.2% | 15.9ms | 0.2% | 15.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` |
| 0.1% | 15.9ms | 0.1% | 15.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 0.1% | 15.7ms | 0.1% | 15.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:602` |
| 0.1% | 14.3ms | 0.2% | 23.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:668` |
| 0.1% | 14.0ms | 0.4% | 34.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` |
| 0.1% | 13.7ms | 0.1% | 13.7ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.1% | 13.5ms | 0.8% | 68.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:567` |
| 0.1% | 13.5ms | 0.1% | 13.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.1% | 13.4ms | 0.2% | 20.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:650` |
| 0.1% | 13.4ms | 0.2% | 16.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:553` |
| 0.1% | 13.0ms | 0.1% | 13.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:661` |
| 0.1% | 12.2ms | 0.1% | 12.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` |
| 0.1% | 11.7ms | 0.1% | 11.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:557` |
| 0.1% | 11.7ms | 0.1% | 11.7ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.1% | 11.5ms | 0.3% | 25.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:685` |
| 0.1% | 9.5ms | 1.6% | 130.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` |
| 0.1% | 9.0ms | 0.1% | 9.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:144` |
| 0.1% | 8.3ms | 0.1% | 8.3ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:51` |
| 0.1% | 8.1ms | 0.1% | 8.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:684` |
| 0.1% | 8.0ms | 0.1% | 8.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:550` |
| 0.0% | 7.9ms | 0.1% | 12.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:590` |
| 0.0% | 7.6ms | 0.0% | 7.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:567` |
| 0.0% | 7.5ms | 0.0% | 7.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` |
| 0.0% | 7.4ms | 0.1% | 12.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:663` |
| 0.0% | 7.3ms | 0.1% | 8.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:637` |
| 0.0% | 7.2ms | 0.0% | 7.2ms | `reduce` | `[native code]` |
| 0.0% | 7.0ms | 0.0% | 7.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:546` |
| 0.0% | 7.0ms | 0.0% | 7.0ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:520` |
| 0.0% | 6.1ms | 0.0% | 6.1ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:512` |
| 0.0% | 6.0ms | 0.0% | 6.0ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:511` |
| 0.0% | 5.7ms | 0.0% | 5.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:541` |
| 0.0% | 5.3ms | 2.7% | 216.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:634` |
| 0.0% | 5.2ms | 0.0% | 5.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 5.0ms | 0.0% | 5.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:675` |
| 0.0% | 4.8ms | 0.0% | 4.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:591` |
| 0.0% | 4.7ms | 0.0% | 4.7ms | `abs` | `[native code]` |
| 0.0% | 4.7ms | 0.2% | 23.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:644` |
| 0.0% | 4.7ms | 0.4% | 37.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:646` |
| 0.0% | 4.7ms | 0.0% | 4.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` |
| 0.0% | 4.6ms | 0.0% | 4.6ms | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 4.5ms | 3.2% | 259.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` |
| 0.0% | 4.5ms | 0.0% | 4.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:543` |
| 0.0% | 4.2ms | 0.3% | 27.3ms | `anonymous` | `[native code]` |
| 0.0% | 3.3ms | 0.6% | 52.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:180` |
| 0.0% | 3.3ms | 0.0% | 3.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:542` |
| 0.0% | 3.2ms | 0.8% | 70.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:626` |
| 0.0% | 3.0ms | 23.7% | 1.89s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:633` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:181` |
| 0.0% | 3.0ms | 0.2% | 22.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.0% | 2.9ms | 0.0% | 2.9ms | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.1ms | 1.1% | 92.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:600` |
| 0.0% | 1.9ms | 0.7% | 62.1ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:524` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `@lazy` | `[native code]` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `sqrt` | `[native code]` |
| 0.0% | 1.8ms | 2.1% | 168.1ms | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:461` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:369` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:246` |
| 0.0% | 1.7ms | 3.2% | 258.2ms | `forEach` | `[native code]` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `WriteStream` | `internal:fs/streams` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `max` | `[native code]` |
| 0.0% | 1.6ms | 0.0% | 4.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:568` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `ownKeys` | `[native code]` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.6ms | 0.7% | 59.5ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` |
| 0.0% | 1.5ms | 1.1% | 89.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:585` |
| 0.0% | 1.5ms | 0.9% | 72.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:106` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.5ms | 0.0% | 3.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` |
| 0.0% | 1.5ms | 0.2% | 20.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:584` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` |
| 0.0% | 1.4ms | 1.7% | 142.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:550` |
| 0.0% | 1.4ms | 5.0% | 402.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:285` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:573` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:465` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:638` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.3ms | 3.9% | 318.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:548` |
| 0.0% | 1.2ms | 2.7% | 218.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:24` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:594` |
| 0.0% | 1.0ms | 0.2% | 20.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 99.5% | 7.94s | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 93.8% | 7.48s | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:86` |
| 28.5% | 2.27s | 27.7% | 2.21s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:618` |
| 23.7% | 1.89s | 0.0% | 3.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:633` |
| 10.0% | 798.4ms | 5.5% | 443.3ms | `map` | `[native code]` |
| 9.3% | 746.7ms | 8.8% | 702.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` |
| 8.9% | 713.7ms | 8.3% | 665.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:139` |
| 5.7% | 462.3ms | 5.7% | 462.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:655` |
| 5.1% | 414.3ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` |
| 5.0% | 402.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 3.9% | 318.4ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:548` |
| 3.9% | 316.5ms | 0.3% | 24.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:547` |
| 3.7% | 300.5ms | 3.3% | 265.9ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:247` |
| 3.3% | 264.6ms | 3.3% | 264.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:622` |
| 3.2% | 259.7ms | 0.0% | 4.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` |
| 3.2% | 258.2ms | 0.0% | 1.7ms | `forEach` | `[native code]` |
| 3.1% | 250.2ms | 3.1% | 250.2ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 2.9% | 237.1ms | 2.7% | 222.7ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:269` |
| 2.8% | 230.1ms | 2.6% | 211.5ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:262` |
| 2.7% | 219.6ms | 0.9% | 74.7ms | `from` | `[native code]` |
| 2.7% | 218.6ms | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` |
| 2.7% | 218.1ms | 0.7% | 56.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` |
| 2.7% | 216.7ms | 0.0% | 5.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:634` |
| 2.6% | 208.1ms | 1.4% | 117.3ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:228` |
| 2.1% | 168.1ms | 0.0% | 1.8ms | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` |
| 2.0% | 165.4ms | 2.0% | 165.4ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.8% | 147.2ms | 1.8% | 147.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.7% | 142.2ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:550` |
| 1.7% | 138.1ms | 0.5% | 41.6ms | `some` | `[native code]` |
| 1.6% | 130.2ms | 0.1% | 9.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` |
| 1.3% | 104.9ms | 1.3% | 104.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` |
| 1.2% | 102.3ms | 1.2% | 102.3ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:532` |
| 1.2% | 99.7ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:599` |
| 1.1% | 92.4ms | 0.0% | 2.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:600` |
| 1.1% | 92.1ms | 1.1% | 92.1ms | `hypot` | `[native code]` |
| 1.1% | 91.9ms | 0.4% | 39.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 1.1% | 89.6ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:585` |
| 1.1% | 89.6ms | 0.9% | 78.9ms | `sort` | `[native code]` |
| 1.0% | 86.2ms | 1.0% | 86.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 1.0% | 85.5ms | 1.0% | 85.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:630` |
| 1.0% | 80.1ms | 1.0% | 80.1ms | `fill` | `[native code]` |
| 0.9% | 77.5ms | 0.9% | 72.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` |
| 0.9% | 74.8ms | 0.3% | 26.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:551` |
| 0.9% | 72.2ms | 0.0% | 1.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:106` |
| 0.8% | 70.7ms | 0.0% | 3.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 0.8% | 70.7ms | 0.0% | 0us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 0.8% | 69.1ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:93` |
| 0.8% | 68.6ms | 0.1% | 13.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:567` |
| 0.8% | 64.6ms | 0.8% | 64.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` |
| 0.7% | 62.1ms | 0.0% | 1.9ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:524` |
| 0.7% | 60.5ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` |
| 0.7% | 59.5ms | 0.0% | 1.6ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` |
| 0.6% | 52.8ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:536` |
| 0.6% | 52.2ms | 0.0% | 3.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:180` |
| 0.6% | 48.5ms | 0.6% | 48.5ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.5% | 44.7ms | 0.2% | 17.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.5% | 40.5ms | 0.5% | 40.5ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:20` |
| 0.4% | 37.0ms | 0.0% | 4.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:646` |
| 0.4% | 34.6ms | 0.1% | 14.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` |
| 0.4% | 33.0ms | 0.4% | 33.0ms | `push` | `[native code]` |
| 0.3% | 28.4ms | 0.3% | 28.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.3% | 27.3ms | 0.0% | 4.2ms | `anonymous` | `[native code]` |
| 0.3% | 25.3ms | 0.1% | 11.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:685` |
| 0.2% | 23.3ms | 0.0% | 4.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:644` |
| 0.2% | 23.1ms | 0.1% | 14.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:668` |
| 0.2% | 22.4ms | 0.0% | 3.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.2% | 21.7ms | 0.2% | 21.7ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.2% | 21.6ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:664` |
| 0.2% | 21.5ms | 0.2% | 21.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 0.2% | 21.5ms | 0.2% | 21.5ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:300` |
| 0.2% | 20.9ms | 0.2% | 20.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:678` |
| 0.2% | 20.7ms | 0.1% | 13.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:650` |
| 0.2% | 20.2ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:584` |
| 0.2% | 20.1ms | 0.0% | 1.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` |
| 0.2% | 19.3ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` |
| 0.2% | 18.6ms | 0.2% | 18.6ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:499` |
| 0.2% | 18.5ms | 0.2% | 18.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` |
| 0.2% | 18.1ms | 0.2% | 18.1ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:510` |
| 0.2% | 17.9ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.2% | 17.3ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` |
| 0.2% | 16.8ms | 0.2% | 16.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |
| 0.2% | 16.6ms | 0.1% | 13.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:553` |
| 0.2% | 16.5ms | 0.2% | 16.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:620` |
| 0.2% | 16.2ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.2% | 15.9ms | 0.2% | 15.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` |
| 0.1% | 15.9ms | 0.1% | 15.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 0.1% | 15.7ms | 0.1% | 15.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:602` |
| 0.1% | 13.7ms | 0.1% | 13.7ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.1% | 13.5ms | 0.1% | 13.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.1% | 13.0ms | 0.1% | 13.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:661` |
| 0.1% | 12.3ms | 0.0% | 7.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:590` |
| 0.1% | 12.2ms | 0.1% | 12.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` |
| 0.1% | 12.1ms | 0.0% | 7.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:663` |
| 0.1% | 11.7ms | 0.1% | 11.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:557` |
| 0.1% | 11.7ms | 0.1% | 11.7ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.1% | 9.3ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.1% | 9.3ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:96` |
| 0.1% | 9.0ms | 0.1% | 9.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:144` |
| 0.1% | 8.9ms | 0.0% | 7.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:637` |
| 0.1% | 8.3ms | 0.1% | 8.3ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:51` |
| 0.1% | 8.1ms | 0.1% | 8.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:684` |
| 0.1% | 8.0ms | 0.1% | 8.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:550` |
| 0.0% | 7.6ms | 0.0% | 7.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:567` |
| 0.0% | 7.5ms | 0.0% | 7.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` |
| 0.0% | 7.2ms | 0.0% | 7.2ms | `reduce` | `[native code]` |
| 0.0% | 7.0ms | 0.0% | 7.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:546` |
| 0.0% | 7.0ms | 0.0% | 7.0ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:520` |
| 0.0% | 6.1ms | 0.0% | 6.1ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:512` |
| 0.0% | 6.0ms | 0.0% | 6.0ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:511` |
| 0.0% | 5.7ms | 0.0% | 5.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:541` |
| 0.0% | 5.2ms | 0.0% | 5.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 5.0ms | 0.0% | 5.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:675` |
| 0.0% | 4.8ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` |
| 0.0% | 4.8ms | 0.0% | 4.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:591` |
| 0.0% | 4.7ms | 0.0% | 4.7ms | `abs` | `[native code]` |
| 0.0% | 4.7ms | 0.0% | 4.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` |
| 0.0% | 4.6ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:568` |
| 0.0% | 4.6ms | 0.0% | 4.6ms | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 4.5ms | 0.0% | 4.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:543` |
| 0.0% | 3.4ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 3.4ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 3.3ms | 0.0% | 3.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:542` |
| 0.0% | 3.3ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:626` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:181` |
| 0.0% | 2.9ms | 0.0% | 2.9ms | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.9ms | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:303` |
| 0.0% | 1.8ms | 0.0% | 0us | `internal:fs/binding` | `internal:fs/binding:3` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `@lazy` | `[native code]` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `sqrt` | `[native code]` |
| 0.0% | 1.7ms | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:459` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:461` |
| 0.0% | 1.7ms | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:424` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:369` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:246` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `WriteStream` | `internal:fs/streams` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `max` | `[native code]` |
| 0.0% | 1.6ms | 0.0% | 0us | `makeSafe` | `internal:primordials:31` |
| 0.0% | 1.6ms | 0.0% | 0us | `internal:primordials` | `internal:primordials:80` |
| 0.0% | 1.6ms | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `ownKeys` | `[native code]` |
| 0.0% | 1.6ms | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 1.6ms | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.5ms | 0.0% | 0us | `internal:promisify` | `internal:promisify:53` |
| 0.0% | 1.5ms | 0.0% | 0us | `node:fs` | `node:fs:299` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.5ms | 0.0% | 0us | `exp` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 0us | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:56` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:285` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:573` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:465` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:638` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.3ms | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:302` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:24` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:594` |
| 0.0% | 925us | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 925us | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 925us | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 925us | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 925us | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 925us | 0.0% | 0us | `get WriteStream` | `node:fs:667` |

## Function Details

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:618` | Self: 27.7% (2.21s) | Total: 28.5% (2.27s) | Samples: 1369

**Called by:**
- `runTrial` (1404)
- `runTrial` (3)

**Calls:**
- `createZeroMatrix` (34)
- `from` (2)
- `createZeroMatrix` (1)
- `createZeroMatrix` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` | Self: 8.8% (702.6ms) | Total: 9.3% (746.7ms) | Samples: 438

**Called by:**
- `step` (466)

**Calls:**
- `hypot` (28)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:139` | Self: 8.3% (665.7ms) | Total: 8.9% (713.7ms) | Samples: 406

**Called by:**
- `step` (437)

**Calls:**
- `hypot` (31)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:655` | Self: 5.7% (462.3ms) | Total: 5.7% (462.3ms) | Samples: 278

**Called by:**
- `runTrial` (278)

### `map`
`[native code]` | Self: 5.5% (443.3ms) | Total: 10.0% (798.4ms) | Samples: 269

**Called by:**
- `cloneMatrix` (102)
- `step` (87)
- `step` (71)
- `step` (64)
- `(anonymous)` (59)
- `(anonymous)` (20)
- `jacobiEigenSymmetric` (16)
- `step` (12)
- `step` (12)
- `jacobiEigenSymmetric` (11)
- `jacobiEigenSymmetric` (11)
- `step` (10)
- `step` (8)
- `step` (6)
- `alignProjectionBasis` (2)
- `step` (2)

**Calls:**
- `(anonymous)` (77)
- `(anonymous)` (64)
- `(anonymous)` (60)
- `repair` (12)
- `(anonymous)` (5)
- `abs` (3)
- `(anonymous)` (3)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:247` | Self: 3.3% (265.9ms) | Total: 3.7% (300.5ms) | Samples: 163

**Called by:**
- `step` (183)

**Calls:**
- `createZeroVector` (11)
- `fill` (9)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:622` | Self: 3.3% (264.6ms) | Total: 3.3% (264.6ms) | Samples: 163

**Called by:**
- `runTrial` (163)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 3.1% (250.2ms) | Total: 3.1% (250.2ms) | Samples: 142

**Called by:**
- `step` (142)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:269` | Self: 2.7% (222.7ms) | Total: 2.9% (237.1ms) | Samples: 140

**Called by:**
- `step` (126)
- `step` (23)

**Calls:**
- `createZeroVector` (7)
- `fill` (2)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:262` | Self: 2.6% (211.5ms) | Total: 2.8% (230.1ms) | Samples: 128

**Called by:**
- `step` (116)
- `step` (24)

**Calls:**
- `createZeroVector` (7)
- `fill` (5)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 2.0% (165.4ms) | Total: 2.0% (165.4ms) | Samples: 106

**Called by:**
- `(anonymous)` (85)
- `step` (12)
- `step` (9)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.8% (147.2ms) | Total: 1.8% (147.2ms) | Samples: 92

**Called by:**
- `map` (77)
- `some` (15)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:228` | Self: 1.4% (117.3ms) | Total: 2.6% (208.1ms) | Samples: 73

**Called by:**
- `step` (124)

**Calls:**
- `from` (50)
- `createZeroMatrix` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` | Self: 1.3% (104.9ms) | Total: 1.3% (104.9ms) | Samples: 64

**Called by:**
- `map` (64)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:532` | Self: 1.2% (102.3ms) | Total: 1.2% (102.3ms) | Samples: 60

**Called by:**
- `step` (60)

### `hypot`
`[native code]` | Self: 1.1% (92.1ms) | Total: 1.1% (92.1ms) | Samples: 59

**Called by:**
- `jacobiEigenSymmetric` (31)
- `jacobiEigenSymmetric` (28)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` | Self: 1.0% (86.2ms) | Total: 1.0% (86.2ms) | Samples: 53

**Called by:**
- `step` (53)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:630` | Self: 1.0% (85.5ms) | Total: 1.0% (85.5ms) | Samples: 33

**Called by:**
- `runTrial` (33)

### `fill`
`[native code]` | Self: 1.0% (80.1ms) | Total: 1.0% (80.1ms) | Samples: 50

**Called by:**
- `from` (32)
- `transformFromEigenCoordinates` (9)
- `whitenWithEigensystem` (5)
- `whitenWithEigensystem` (2)
- `step` (2)

### `sort`
`[native code]` | Self: 0.9% (78.9ms) | Total: 1.1% (89.6ms) | Samples: 51

**Called by:**
- `step` (36)
- `jacobiEigenSymmetric` (22)

**Calls:**
- `(anonymous)` (5)
- `(anonymous)` (2)

### `from`
`[native code]` | Self: 0.9% (74.7ms) | Total: 2.7% (219.6ms) | Samples: 42

**Called by:**
- `reconstructSymmetric` (50)
- `createZeroMatrix` (34)
- `jacobiEigenSymmetric` (26)
- `jacobiEigenSymmetric` (9)
- `step` (2)
- `CMAESOptimizerND` (1)
- `exp` (1)

**Calls:**
- `(anonymous)` (32)
- `fill` (32)
- `(anonymous)` (16)
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` | Self: 0.9% (72.9ms) | Total: 0.9% (77.5ms) | Samples: 47

**Called by:**
- `runTrial` (50)

**Calls:**
- `fill` (2)
- `createZeroVector` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` | Self: 0.8% (64.6ms) | Total: 0.8% (64.6ms) | Samples: 32

**Called by:**
- `from` (32)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` | Self: 0.7% (56.0ms) | Total: 2.7% (218.1ms) | Samples: 35

**Called by:**
- `forEach` (140)

**Calls:**
- `projectTo3D` (85)
- `projectTo3D` (12)
- `projectTo3D` (3)
- `projectTo3D` (3)
- `projectTo3D` (2)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` | Self: 0.6% (48.5ms) | Total: 0.6% (48.5ms) | Samples: 30

**Called by:**
- `step` (30)

### `some`
`[native code]` | Self: 0.5% (41.6ms) | Total: 1.7% (138.1ms) | Samples: 25

**Called by:**
- `validateSquareFiniteMatrix` (42)
- `(anonymous)` (40)

**Calls:**
- `(anonymous)` (42)
- `(anonymous)` (15)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:20` | Self: 0.5% (40.5ms) | Total: 0.5% (40.5ms) | Samples: 25

**Called by:**
- `transformFromEigenCoordinates` (11)
- `whitenWithEigensystem` (7)
- `whitenWithEigensystem` (7)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.4% (39.7ms) | Total: 1.1% (91.9ms) | Samples: 25

**Called by:**
- `step` (51)

**Calls:**
- `from` (26)

### `push`
`[native code]` | Self: 0.4% (33.0ms) | Total: 0.4% (33.0ms) | Samples: 21

**Called by:**
- `step` (10)
- `step` (9)
- `step` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.3% (28.4ms) | Total: 0.3% (28.4ms) | Samples: 16

**Called by:**
- `from` (16)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:551` | Self: 0.3% (26.2ms) | Total: 0.9% (74.8ms) | Samples: 17

**Called by:**
- `runTrial` (47)

**Calls:**
- `ellipsoidObjective` (30)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:547` | Self: 0.3% (24.4ms) | Total: 3.9% (316.5ms) | Samples: 15

**Called by:**
- `runTrial` (183)

**Calls:**
- `sampleGaussianVectorND` (142)
- `sampleGaussianVectorND` (13)
- `push` (10)
- `sampleGaussianVectorND` (2)
- `sampleGaussianVectorND` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.2% (21.7ms) | Total: 0.2% (21.7ms) | Samples: 12

**Called by:**
- `step` (10)
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` | Self: 0.2% (21.5ms) | Total: 0.2% (21.5ms) | Samples: 14

**Called by:**
- `runTrial` (14)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:300` | Self: 0.2% (21.5ms) | Total: 0.2% (21.5ms) | Samples: 13

**Called by:**
- `step` (13)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:678` | Self: 0.2% (20.9ms) | Total: 0.2% (20.9ms) | Samples: 13

**Called by:**
- `runTrial` (13)

### `repair`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:499` | Self: 0.2% (18.6ms) | Total: 0.2% (18.6ms) | Samples: 12

**Called by:**
- `map` (12)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` | Self: 0.2% (18.5ms) | Total: 0.2% (18.5ms) | Samples: 12

**Called by:**
- `runTrial` (12)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:510` | Self: 0.2% (18.1ms) | Total: 0.2% (18.1ms) | Samples: 12

**Called by:**
- `(anonymous)` (12)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` | Self: 0.2% (17.6ms) | Total: 0.5% (44.7ms) | Samples: 10

**Called by:**
- `step` (27)

**Calls:**
- `map` (16)
- `max` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` | Self: 0.2% (16.8ms) | Total: 0.2% (16.8ms) | Samples: 11

**Called by:**
- `runTrial` (11)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:620` | Self: 0.2% (16.5ms) | Total: 0.2% (16.5ms) | Samples: 8

**Called by:**
- `runTrial` (8)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` | Self: 0.2% (15.9ms) | Total: 0.2% (15.9ms) | Samples: 10

**Called by:**
- `step` (10)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` | Self: 0.1% (15.9ms) | Total: 0.1% (15.9ms) | Samples: 10

**Called by:**
- `step` (10)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:602` | Self: 0.1% (15.7ms) | Total: 0.1% (15.7ms) | Samples: 10

**Called by:**
- `runTrial` (10)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:668` | Self: 0.1% (14.3ms) | Total: 0.2% (23.1ms) | Samples: 8

**Called by:**
- `runTrial` (14)

**Calls:**
- `map` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` | Self: 0.1% (14.0ms) | Total: 0.4% (34.6ms) | Samples: 10

**Called by:**
- `runTrial` (23)

**Calls:**
- `vecDot` (8)
- `vecDot` (5)

### `vecDot`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.1% (13.7ms) | Total: 0.1% (13.7ms) | Samples: 8

**Called by:**
- `step` (8)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:567` | Self: 0.1% (13.5ms) | Total: 0.8% (68.6ms) | Samples: 8

**Called by:**
- `runTrial` (44)

**Calls:**
- `sort` (36)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.1% (13.5ms) | Total: 0.1% (13.5ms) | Samples: 8

**Called by:**
- `runTrial` (8)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:650` | Self: 0.1% (13.4ms) | Total: 0.2% (20.7ms) | Samples: 9

**Called by:**
- `runTrial` (14)

**Calls:**
- `reduce` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:553` | Self: 0.1% (13.4ms) | Total: 0.2% (16.6ms) | Samples: 8

**Called by:**
- `runTrial` (10)

**Calls:**
- `push` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:661` | Self: 0.1% (13.0ms) | Total: 0.1% (13.0ms) | Samples: 8

**Called by:**
- `runTrial` (8)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` | Self: 0.1% (12.2ms) | Total: 0.1% (12.2ms) | Samples: 8

**Called by:**
- `runTrial` (7)
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:557` | Self: 0.1% (11.7ms) | Total: 0.1% (11.7ms) | Samples: 8

**Called by:**
- `runTrial` (8)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.1% (11.7ms) | Total: 0.1% (11.7ms) | Samples: 7

**Called by:**
- `step` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:685` | Self: 0.1% (11.5ms) | Total: 0.3% (25.3ms) | Samples: 8

**Called by:**
- `runTrial` (17)

**Calls:**
- `push` (9)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` | Self: 0.1% (9.5ms) | Total: 1.6% (130.2ms) | Samples: 5

**Called by:**
- `runTrial` (76)

**Calls:**
- `map` (71)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:144` | Self: 0.1% (9.0ms) | Total: 0.1% (9.0ms) | Samples: 2

**Called by:**
- `step` (2)

### `vecDot`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:51` | Self: 0.1% (8.3ms) | Total: 0.1% (8.3ms) | Samples: 6

**Called by:**
- `step` (5)
- `vecNorm` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:684` | Self: 0.1% (8.1ms) | Total: 0.1% (8.1ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:550` | Self: 0.1% (8.0ms) | Total: 0.1% (8.0ms) | Samples: 5

**Called by:**
- `map` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:590` | Self: 0.0% (7.9ms) | Total: 0.1% (12.3ms) | Samples: 4

**Called by:**
- `runTrial` (7)

**Calls:**
- `vecNorm` (2)
- `vecNorm` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:567` | Self: 0.0% (7.6ms) | Total: 0.0% (7.6ms) | Samples: 5

**Called by:**
- `sort` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` | Self: 0.0% (7.5ms) | Total: 0.0% (7.5ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:663` | Self: 0.0% (7.4ms) | Total: 0.1% (12.1ms) | Samples: 5

**Called by:**
- `runTrial` (7)

**Calls:**
- `variancePercent` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:637` | Self: 0.0% (7.3ms) | Total: 0.1% (8.9ms) | Samples: 4

**Called by:**
- `runTrial` (5)

**Calls:**
- `exp` (1)

### `reduce`
`[native code]` | Self: 0.0% (7.2ms) | Total: 0.0% (7.2ms) | Samples: 5

**Called by:**
- `step` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:546` | Self: 0.0% (7.0ms) | Total: 0.0% (7.0ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:520` | Self: 0.0% (7.0ms) | Total: 0.0% (7.0ms) | Samples: 4

**Called by:**
- `(anonymous)` (3)
- `step` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:512` | Self: 0.0% (6.1ms) | Total: 0.0% (6.1ms) | Samples: 4

**Called by:**
- `step` (2)
- `(anonymous)` (2)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:511` | Self: 0.0% (6.0ms) | Total: 0.0% (6.0ms) | Samples: 4

**Called by:**
- `(anonymous)` (3)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:541` | Self: 0.0% (5.7ms) | Total: 0.0% (5.7ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:634` | Self: 0.0% (5.3ms) | Total: 2.7% (216.7ms) | Samples: 3

**Called by:**
- `runTrial` (129)

**Calls:**
- `reconstructSymmetric` (124)
- `reconstructSymmetric` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (5.2ms) | Total: 0.0% (5.2ms) | Samples: 3

**Called by:**
- `step` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:675` | Self: 0.0% (5.0ms) | Total: 0.0% (5.0ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:591` | Self: 0.0% (4.8ms) | Total: 0.0% (4.8ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `abs`
`[native code]` | Self: 0.0% (4.7ms) | Total: 0.0% (4.7ms) | Samples: 3

**Called by:**
- `map` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:644` | Self: 0.0% (4.7ms) | Total: 0.2% (23.3ms) | Samples: 3

**Called by:**
- `runTrial` (15)

**Calls:**
- `map` (12)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:646` | Self: 0.0% (4.7ms) | Total: 0.4% (37.0ms) | Samples: 3

**Called by:**
- `forEach` (23)

**Calls:**
- `map` (20)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` | Self: 0.0% (4.7ms) | Total: 0.0% (4.7ms) | Samples: 3

**Called by:**
- `map` (3)

### `variancePercent`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (4.6ms) | Total: 0.0% (4.6ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` | Self: 0.0% (4.5ms) | Total: 3.2% (259.7ms) | Samples: 3

**Called by:**
- `runTrial` (166)

**Calls:**
- `forEach` (163)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:543` | Self: 0.0% (4.5ms) | Total: 0.0% (4.5ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `anonymous`
`[native code]` | Self: 0.0% (4.2ms) | Total: 0.3% (27.3ms) | Samples: 3

**Called by:**
- `(anonymous)` (4)
- `node:fs/promises` (2)
- `node:fs` (2)
- `internal:fs/streams` (1)
- `node:events` (1)
- `internal:validators` (1)
- `node:fs` (1)
- `get WriteStream` (1)
- `internal:stream` (1)
- `internal:promisify` (1)
- `internal:shared` (1)
- `internal:streams/compose` (1)
- `internal:streams/pipeline` (1)
- `node:stream` (1)

**Calls:**
- `node:fs/promises` (2)
- `node:fs` (2)
- `internal:fs/streams` (1)
- `node:events` (1)
- `internal:validators` (1)
- `node:fs` (1)
- `internal:streams/pipeline` (1)
- `internal:stream` (1)
- `internal:promisify` (1)
- `internal:shared` (1)
- `internal:primordials` (1)
- `internal:streams/compose` (1)
- `node:stream` (1)
- `internal:fs/binding` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:180` | Self: 0.0% (3.3ms) | Total: 0.6% (52.2ms) | Samples: 2

**Called by:**
- `step` (33)

**Calls:**
- `sort` (22)
- `from` (9)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:542` | Self: 0.0% (3.3ms) | Total: 0.0% (3.3ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` | Self: 0.0% (3.2ms) | Total: 0.8% (70.7ms) | Samples: 2

**Called by:**
- `some` (42)

**Calls:**
- `some` (40)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (3.1ms) | Total: 0.0% (3.1ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:626` | Self: 0.0% (3.1ms) | Total: 0.0% (3.1ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:633` | Self: 0.0% (3.0ms) | Total: 23.7% (1.89s) | Samples: 2

**Called by:**
- `runTrial` (1155)
- `runTrial` (5)

**Calls:**
- `jacobiEigenSymmetric` (466)
- `jacobiEigenSymmetric` (437)
- `jacobiEigenSymmetric` (53)
- `jacobiEigenSymmetric` (51)
- `jacobiEigenSymmetric` (43)
- `jacobiEigenSymmetric` (33)
- `jacobiEigenSymmetric` (27)
- `jacobiEigenSymmetric` (11)
- `jacobiEigenSymmetric` (11)
- `jacobiEigenSymmetric` (10)
- `jacobiEigenSymmetric` (10)
- `jacobiEigenSymmetric` (3)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:181` | Self: 0.0% (3.0ms) | Total: 0.0% (3.0ms) | Samples: 2

**Called by:**
- `sort` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` | Self: 0.0% (3.0ms) | Total: 0.2% (22.4ms) | Samples: 2

**Called by:**
- `runTrial` (10)

**Calls:**
- `map` (8)

### `vecNorm`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (2.9ms) | Total: 0.0% (2.9ms) | Samples: 2

**Called by:**
- `step` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:600` | Self: 0.0% (2.1ms) | Total: 1.1% (92.4ms) | Samples: 1

**Called by:**
- `map` (60)

**Calls:**
- `map` (59)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:524` | Self: 0.0% (1.9ms) | Total: 0.7% (62.1ms) | Samples: 1

**Called by:**
- `step` (39)

**Calls:**
- `cloneMatrix` (38)

### `@lazy`
`[native code]` | Self: 0.0% (1.8ms) | Total: 0.0% (1.8ms) | Samples: 1

**Called by:**
- `internal:fs/binding` (1)

### `sqrt`
`[native code]` | Self: 0.0% (1.8ms) | Total: 0.0% (1.8ms) | Samples: 1

**Called by:**
- `step` (1)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` | Self: 0.0% (1.8ms) | Total: 2.1% (168.1ms) | Samples: 1

**Called by:**
- `alignProjectionBasis` (38)
- `step` (33)
- `alignProjectionBasis` (32)

**Calls:**
- `map` (102)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:461` | Self: 0.0% (1.7ms) | Total: 0.0% (1.7ms) | Samples: 1

**Called by:**
- `from` (1)

### `requireFiniteVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:369` | Self: 0.0% (1.7ms) | Total: 0.0% (1.7ms) | Samples: 1

**Called by:**
- `CMAESOptimizerND` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` | Self: 0.0% (1.7ms) | Total: 0.0% (1.7ms) | Samples: 1

**Called by:**
- `step` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:246` | Self: 0.0% (1.7ms) | Total: 0.0% (1.7ms) | Samples: 1

**Called by:**
- `step` (1)

### `forEach`
`[native code]` | Self: 0.0% (1.7ms) | Total: 3.2% (258.2ms) | Samples: 1

**Called by:**
- `step` (163)
- `step` (2)

**Calls:**
- `(anonymous)` (140)
- `(anonymous)` (23)
- `(anonymous)` (1)

### `WriteStream`
`internal:fs/streams` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 1

**Called by:**
- `(anonymous)` (1)

### `max`
`[native code]` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 1

**Called by:**
- `jacobiEigenSymmetric` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:568` | Self: 0.0% (1.6ms) | Total: 0.0% (4.6ms) | Samples: 1

**Called by:**
- `runTrial` (3)

**Calls:**
- `forEach` (2)

### `ownKeys`
`[native code]` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 1

**Called by:**
- `makeSafe` (1)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 1

**Called by:**
- `step` (1)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` | Self: 0.0% (1.6ms) | Total: 0.7% (59.5ms) | Samples: 1

**Called by:**
- `step` (34)
- `reconstructSymmetric` (1)

**Calls:**
- `from` (34)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:585` | Self: 0.0% (1.5ms) | Total: 1.1% (89.6ms) | Samples: 1

**Called by:**
- `runTrial` (50)

**Calls:**
- `whitenWithEigensystem` (24)
- `whitenWithEigensystem` (23)
- `whitenWithEigensystem` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:106` | Self: 0.0% (1.5ms) | Total: 0.9% (72.2ms) | Samples: 1

**Called by:**
- `step` (43)

**Calls:**
- `validateSquareFiniteMatrix` (42)

### `nextHalfOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 1

**Called by:**
- `sampleGaussianVectorND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` | Self: 0.0% (1.5ms) | Total: 0.0% (3.3ms) | Samples: 1

**Called by:**
- `runTrial` (2)

**Calls:**
- `sqrt` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:584` | Self: 0.0% (1.5ms) | Total: 0.2% (20.2ms) | Samples: 1

**Called by:**
- `runTrial` (13)

**Calls:**
- `map` (12)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 1

**Called by:**
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:550` | Self: 0.0% (1.4ms) | Total: 1.7% (142.2ms) | Samples: 1

**Called by:**
- `runTrial` (88)

**Calls:**
- `map` (87)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` | Self: 0.0% (1.4ms) | Total: 5.0% (402.4ms) | Samples: 1

**Called by:**
- `runTrial` (252)
- `runTrial` (1)

**Calls:**
- `whitenWithEigensystem` (126)
- `whitenWithEigensystem` (116)
- `whitenWithEigensystem` (10)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 1

**Called by:**
- `step` (1)

### `nextHalfOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:285` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 1

**Called by:**
- `sampleGaussianVectorND` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:573` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 1

**Called by:**
- `forEach` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:465` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:638` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 1

**Called by:**
- `runTrial` (1)

### `nextOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 1

**Called by:**
- `sampleGaussianVectorND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:548` | Self: 0.0% (1.3ms) | Total: 3.9% (318.4ms) | Samples: 1

**Called by:**
- `runTrial` (194)

**Calls:**
- `transformFromEigenCoordinates` (183)
- `transformFromEigenCoordinates` (7)
- `transformFromEigenCoordinates` (1)
- `transformFromEigenCoordinates` (1)
- `transformFromEigenCoordinates` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` | Self: 0.0% (1.2ms) | Total: 2.7% (218.6ms) | Samples: 1

**Called by:**
- `runTrial` (134)

**Calls:**
- `alignProjectionBasis` (60)
- `alignProjectionBasis` (39)
- `alignProjectionBasis` (34)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:24` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:594` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` | Self: 0.0% (1.0ms) | Total: 0.2% (20.1ms) | Samples: 1

**Called by:**
- `runTrial` (13)

**Calls:**
- `projectTo3D` (12)

### `makeSafe`
`internal:primordials:31` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `internal:primordials` (1)

**Calls:**
- `ownKeys` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` | Self: 0.0% (0us) | Total: 0.2% (19.3ms) | Samples: 0

**Called by:**
- `(module)` (9)
- `(module)` (1)

**Calls:**
- `step` (5)
- `step` (3)
- `step` (1)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` | Self: 0.0% (0us) | Total: 0.7% (60.5ms) | Samples: 0

**Called by:**
- `runTrial` (35)

**Calls:**
- `cloneMatrix` (33)
- `map` (2)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (3.4ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `internal:primordials`
`internal:primordials:80` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `makeSafe` (1)

### `exp`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `from` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:86` | Self: 0.0% (0us) | Total: 93.8% (7.48s) | Samples: 0

**Calls:**
- `runTrial` (4556)
- `runTrial` (9)
- `runTrial` (3)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` | Self: 0.0% (0us) | Total: 0.2% (17.9ms) | Samples: 0

**Called by:**
- `step` (11)

**Calls:**
- `map` (11)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (925us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (925us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` | Self: 0.0% (0us) | Total: 0.0% (4.8ms) | Samples: 0

**Called by:**
- `(module)` (3)

**Calls:**
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:302` | Self: 0.0% (0us) | Total: 0.0% (1.3ms) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `nextOpenUnit` (1)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` | Self: 0.0% (0us) | Total: 0.8% (70.7ms) | Samples: 0

**Called by:**
- `jacobiEigenSymmetric` (42)

**Calls:**
- `some` (42)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:93` | Self: 0.0% (0us) | Total: 0.8% (69.1ms) | Samples: 0

**Calls:**
- `runTrial` (44)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (925us) | Samples: 0

**Called by:**
- `(anonymous)` (1)

**Calls:**
- `anonymous` (1)

### `node:fs`
`node:fs:299` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (925us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:599` | Self: 0.0% (0us) | Total: 1.2% (99.7ms) | Samples: 0

**Called by:**
- `runTrial` (64)

**Calls:**
- `map` (64)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:96` | Self: 0.0% (0us) | Total: 0.1% (9.3ms) | Samples: 0

**Calls:**
- `(anonymous)` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` | Self: 0.0% (0us) | Total: 0.2% (17.3ms) | Samples: 0

**Called by:**
- `runTrial` (10)

**Calls:**
- `map` (10)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:536` | Self: 0.0% (0us) | Total: 0.6% (52.8ms) | Samples: 0

**Called by:**
- `step` (34)

**Calls:**
- `cloneMatrix` (32)
- `map` (2)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.1% (9.3ms) | Samples: 0

**Called by:**
- `(module)` (6)

**Calls:**
- `anonymous` (4)
- `get WriteStream` (1)
- `WriteStream` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:664` | Self: 0.0% (0us) | Total: 0.2% (21.6ms) | Samples: 0

**Called by:**
- `runTrial` (13)

**Calls:**
- `projectTo3D` (9)
- `projectTo3D` (2)
- `projectTo3D` (1)
- `projectTo3D` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:459` | Self: 0.0% (0us) | Total: 0.0% (1.7ms) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `from` (1)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (925us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:303` | Self: 0.0% (0us) | Total: 0.0% (2.9ms) | Samples: 0

**Called by:**
- `step` (2)

**Calls:**
- `nextHalfOpenUnit` (1)
- `nextHalfOpenUnit` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` | Self: 0.0% (0us) | Total: 99.5% (7.94s) | Samples: 0

**Called by:**
- `(module)` (4556)
- `(module)` (254)
- `(module)` (44)

**Calls:**
- `step` (1404)
- `step` (1155)
- `step` (278)
- `step` (252)
- `step` (194)
- `step` (183)
- `step` (166)
- `step` (163)
- `step` (134)
- `step` (129)
- `step` (88)
- `step` (76)
- `step` (64)
- `step` (50)
- `step` (50)
- `step` (47)
- `step` (44)
- `step` (35)
- `step` (33)
- `step` (23)
- `step` (17)
- `step` (15)
- `step` (14)
- `step` (14)
- `step` (14)
- `step` (13)
- `step` (13)
- `step` (13)
- `step` (13)
- `step` (12)
- `step` (11)
- `step` (10)
- `step` (10)
- `step` (10)
- `step` (10)
- `step` (8)
- `step` (8)
- `step` (8)
- `step` (8)
- `step` (7)
- `step` (7)
- `step` (7)
- `step` (5)
- `step` (5)
- `step` (5)
- `step` (5)
- `step` (4)
- `step` (3)
- `step` (3)
- `step` (3)
- `step` (3)
- `step` (2)
- `step` (2)
- `step` (2)
- `step` (1)
- `step` (1)

### `vecNorm`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:56` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `vecDot` (1)

### `internal:fs/binding`
`internal:fs/binding:3` | Self: 0.0% (0us) | Total: 0.0% (1.8ms) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `@lazy` (1)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (3.4ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` | Self: 0.0% (0us) | Total: 0.2% (16.2ms) | Samples: 0

**Called by:**
- `step` (11)

**Calls:**
- `map` (11)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (925us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:424` | Self: 0.0% (0us) | Total: 0.0% (1.7ms) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `requireFiniteVector` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` | Self: 0.0% (0us) | Total: 5.1% (414.3ms) | Samples: 0

**Calls:**
- `runTrial` (254)
- `runTrial` (1)

### `internal:promisify`
`internal:promisify:53` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 88.4% | 7.05s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 10.8% | 868.9ms | `[native code]` |
| 0.6% | 48.5ms | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.0% | 1.6ms | `internal:fs/streams` |
