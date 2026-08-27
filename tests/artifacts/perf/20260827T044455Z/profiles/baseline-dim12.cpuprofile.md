# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 10.80s | 8342 | 1.0ms | 188 |

**Top 10:** `step` 18.7%, `jacobiEigenSymmetric` 16.7%, `jacobiEigenSymmetric` 16.1%, `reconstructSymmetric` 4.9%, `map` 4.5%, `(anonymous)` 3.6%, `step` 3.4%, `compose` 3.1%, `sampleGaussianVectorND` 2.7%, `hypot` 2.4%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 18.7% | 2.02s | 19.3% | 2.08s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:575` |
| 16.7% | 1.81s | 18.0% | 1.94s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` |
| 16.1% | 1.74s | 17.2% | 1.86s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:139` |
| 4.9% | 532.7ms | 5.8% | 626.4ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:228` |
| 4.5% | 492.9ms | 11.0% | 1.19s | `map` | `[native code]` |
| 3.6% | 393.4ms | 3.6% | 393.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 3.4% | 377.0ms | 3.4% | 377.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` |
| 3.1% | 337.5ms | 4.1% | 452.1ms | `compose` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` |
| 2.7% | 297.3ms | 2.9% | 316.7ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 2.4% | 260.0ms | 2.4% | 260.0ms | `hypot` | `[native code]` |
| 2.3% | 251.3ms | 2.3% | 251.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:579` |
| 1.7% | 188.2ms | 4.3% | 464.8ms | `some` | `[native code]` |
| 1.5% | 165.3ms | 1.5% | 165.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 1.4% | 153.5ms | 3.5% | 386.2ms | `from` | `[native code]` |
| 1.1% | 129.3ms | 1.1% | 129.3ms | `assertSameLength` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:43` |
| 0.9% | 102.4ms | 0.9% | 102.4ms | `fill` | `[native code]` |
| 0.9% | 97.7ms | 1.0% | 109.9ms | `sort` | `[native code]` |
| 0.7% | 80.8ms | 1.6% | 182.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.7% | 78.8ms | 0.7% | 78.8ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.7% | 78.8ms | 0.7% | 78.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` |
| 0.6% | 72.1ms | 0.6% | 72.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` |
| 0.5% | 62.0ms | 0.5% | 62.0ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:491` |
| 0.5% | 55.1ms | 0.5% | 55.1ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.4% | 53.5ms | 0.4% | 53.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.4% | 49.9ms | 1.1% | 128.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:512` |
| 0.4% | 45.9ms | 0.4% | 48.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:538` |
| 0.4% | 44.0ms | 0.4% | 44.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.3% | 35.5ms | 1.8% | 198.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:602` |
| 0.3% | 33.5ms | 0.3% | 33.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` |
| 0.2% | 30.2ms | 0.2% | 30.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 0.2% | 28.9ms | 3.4% | 372.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:508` |
| 0.2% | 27.0ms | 0.5% | 57.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:203` |
| 0.2% | 25.7ms | 1.4% | 158.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 0.2% | 23.6ms | 0.5% | 57.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.2% | 23.2ms | 1.0% | 108.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` |
| 0.2% | 22.9ms | 0.2% | 22.9ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:458` |
| 0.1% | 21.3ms | 0.2% | 31.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:567` |
| 0.1% | 20.1ms | 0.2% | 26.8ms | `matVecMult` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:60` |
| 0.1% | 18.5ms | 2.2% | 242.5ms | `forEach` | `[native code]` |
| 0.1% | 18.4ms | 0.1% | 20.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:614` |
| 0.1% | 17.9ms | 0.1% | 17.9ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:264` |
| 0.1% | 16.7ms | 0.1% | 18.1ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:469` |
| 0.1% | 15.9ms | 0.1% | 15.9ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:479` |
| 0.1% | 15.2ms | 0.6% | 66.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:528` |
| 0.1% | 14.8ms | 0.1% | 14.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.1% | 12.7ms | 0.1% | 12.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` |
| 0.1% | 12.3ms | 0.1% | 12.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:514` |
| 0.1% | 12.0ms | 0.1% | 14.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:640` |
| 0.1% | 11.7ms | 0.1% | 11.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:634` |
| 0.1% | 11.4ms | 0.1% | 11.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:633` |
| 0.0% | 10.0ms | 0.9% | 97.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:180` |
| 0.0% | 9.6ms | 0.0% | 9.6ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 9.5ms | 0.0% | 9.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:511` |
| 0.0% | 9.3ms | 0.0% | 9.3ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 9.2ms | 0.0% | 9.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` |
| 0.0% | 8.6ms | 0.1% | 14.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 0.0% | 8.6ms | 0.0% | 8.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 0.0% | 8.5ms | 0.0% | 8.5ms | `sqrt` | `[native code]` |
| 0.0% | 8.0ms | 0.0% | 8.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:552` |
| 0.0% | 7.8ms | 0.1% | 18.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` |
| 0.0% | 7.5ms | 1.1% | 121.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:510` |
| 0.0% | 7.4ms | 0.0% | 7.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:507` |
| 0.0% | 7.3ms | 0.0% | 7.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:181` |
| 0.0% | 6.7ms | 0.0% | 6.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:60` |
| 0.0% | 6.6ms | 0.0% | 6.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:568` |
| 0.0% | 6.2ms | 0.0% | 6.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:518` |
| 0.0% | 6.2ms | 0.2% | 25.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:601` |
| 0.0% | 6.2ms | 0.0% | 9.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:551` |
| 0.0% | 5.6ms | 0.0% | 8.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:593` |
| 0.0% | 5.6ms | 0.0% | 5.6ms | `reduce` | `[native code]` |
| 0.0% | 5.1ms | 0.1% | 19.9ms | `anonymous` | `[native code]` |
| 0.0% | 5.1ms | 3.1% | 343.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:509` |
| 0.0% | 5.1ms | 1.0% | 114.8ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:470` |
| 0.0% | 5.1ms | 0.0% | 9.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:529` |
| 0.0% | 5.1ms | 0.0% | 5.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 5.0ms | 0.0% | 5.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:630` |
| 0.0% | 4.9ms | 0.0% | 4.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:626` |
| 0.0% | 4.8ms | 0.0% | 4.8ms | `abs` | `[native code]` |
| 0.0% | 4.7ms | 0.0% | 4.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:528` |
| 0.0% | 4.1ms | 14.6% | 1.58s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:500` |
| 0.0% | 4.0ms | 2.2% | 241.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:600` |
| 0.0% | 4.0ms | 4.0% | 436.7ms | `computeCovariancePowers` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:223` |
| 0.0% | 3.9ms | 0.1% | 15.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:548` |
| 0.0% | 3.9ms | 0.0% | 3.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:553` |
| 0.0% | 3.9ms | 1.3% | 150.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:106` |
| 0.0% | 3.8ms | 0.0% | 3.8ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:471` |
| 0.0% | 3.8ms | 14.8% | 1.59s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:590` |
| 0.0% | 3.8ms | 0.4% | 46.0ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` |
| 0.0% | 3.7ms | 0.0% | 3.7ms | `matVecMult` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.7ms | 0.0% | 3.7ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.7ms | 0.0% | 3.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:629` |
| 0.0% | 3.7ms | 0.0% | 3.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 3.6ms | 1.3% | 146.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:511` |
| 0.0% | 3.6ms | 0.0% | 3.6ms | `push` | `[native code]` |
| 0.0% | 3.4ms | 4.3% | 471.9ms | `matVecMult` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:63` |
| 0.0% | 3.4ms | 3.0% | 328.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:591` |
| 0.0% | 3.3ms | 0.0% | 3.3ms | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.7ms | 0.0% | 2.7ms | `max` | `[native code]` |
| 0.0% | 2.7ms | 0.0% | 2.7ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.6ms | 0.0% | 2.6ms | `isFinite` | `[native code]` |
| 0.0% | 2.5ms | 0.3% | 33.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:546` |
| 0.0% | 2.5ms | 0.0% | 2.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:541` |
| 0.0% | 2.5ms | 2.8% | 310.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:501` |
| 0.0% | 2.5ms | 0.0% | 2.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.0% | 2.4ms | 0.9% | 102.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.1ms | 0.0% | 3.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:618` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:165` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:234` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:547` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:270` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:210` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` |
| 0.0% | 1.4ms | 0.0% | 2.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:504` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:271` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `computeCovariancePowers` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:199` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `write` | `[native code]` |
| 0.0% | 1.3ms | 4.6% | 496.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:502` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.3ms | 0.2% | 24.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:620` |
| 0.0% | 1.3ms | 13.1% | 1.41s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:169` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:188` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:241` |
| 0.0% | 1.2ms | 1.4% | 155.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:599` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:163` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:534` |
| 0.0% | 1.1ms | 0.4% | 47.7ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:483` |
| 0.0% | 1.1ms | 0.3% | 39.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:628` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:540` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:88` |
| 0.0% | 1.0ms | 0.0% | 1.0ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:232` |
| 0.0% | 1.0ms | 0.0% | 1.0ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:24` |
| 0.0% | 1.0ms | 0.0% | 1.0ms | `filter` | `[native code]` |
| 0.0% | 1.0ms | 0.0% | 1.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:424` |
| 0.0% | 921us | 0.0% | 921us | `now` | `[native code]` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 99.7% | 10.77s | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 93.9% | 10.14s | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:86` |
| 19.3% | 2.08s | 18.7% | 2.02s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:575` |
| 18.0% | 1.94s | 16.7% | 1.81s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` |
| 17.2% | 1.86s | 16.1% | 1.74s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:139` |
| 14.8% | 1.59s | 0.0% | 3.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:590` |
| 14.6% | 1.58s | 0.0% | 4.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:500` |
| 13.1% | 1.41s | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` |
| 11.0% | 1.19s | 4.5% | 492.9ms | `map` | `[native code]` |
| 5.8% | 626.4ms | 4.9% | 532.7ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:228` |
| 5.2% | 564.2ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` |
| 4.6% | 496.9ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:502` |
| 4.3% | 471.9ms | 0.0% | 3.4ms | `matVecMult` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:63` |
| 4.3% | 464.8ms | 1.7% | 188.2ms | `some` | `[native code]` |
| 4.1% | 452.1ms | 3.1% | 337.5ms | `compose` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` |
| 4.0% | 436.7ms | 0.0% | 4.0ms | `computeCovariancePowers` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:223` |
| 3.6% | 393.4ms | 3.6% | 393.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 3.5% | 386.2ms | 1.4% | 153.5ms | `from` | `[native code]` |
| 3.4% | 377.0ms | 3.4% | 377.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` |
| 3.4% | 372.7ms | 0.2% | 28.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:508` |
| 3.1% | 343.0ms | 0.0% | 5.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:509` |
| 3.0% | 328.6ms | 0.0% | 3.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:591` |
| 2.9% | 316.7ms | 2.7% | 297.3ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 2.8% | 310.1ms | 0.0% | 2.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:501` |
| 2.4% | 260.0ms | 2.4% | 260.0ms | `hypot` | `[native code]` |
| 2.3% | 251.3ms | 2.3% | 251.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:579` |
| 2.2% | 242.5ms | 0.1% | 18.5ms | `forEach` | `[native code]` |
| 2.2% | 241.9ms | 0.0% | 4.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:600` |
| 1.8% | 198.9ms | 0.3% | 35.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:602` |
| 1.6% | 182.1ms | 0.7% | 80.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 1.5% | 165.3ms | 1.5% | 165.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 1.4% | 158.7ms | 0.2% | 25.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 1.4% | 155.2ms | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:599` |
| 1.3% | 150.0ms | 0.0% | 3.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:106` |
| 1.3% | 146.3ms | 0.0% | 3.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:511` |
| 1.3% | 144.9ms | 0.0% | 0us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 1.2% | 133.7ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` |
| 1.1% | 129.3ms | 0.0% | 0us | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:49` |
| 1.1% | 129.3ms | 1.1% | 129.3ms | `assertSameLength` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:43` |
| 1.1% | 128.8ms | 0.4% | 49.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:512` |
| 1.1% | 126.9ms | 0.0% | 0us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:63` |
| 1.1% | 121.1ms | 0.0% | 7.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:510` |
| 1.0% | 116.0ms | 0.0% | 0us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` |
| 1.0% | 114.8ms | 0.0% | 5.1ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:470` |
| 1.0% | 109.9ms | 0.9% | 97.7ms | `sort` | `[native code]` |
| 1.0% | 108.2ms | 0.2% | 23.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` |
| 0.9% | 102.4ms | 0.9% | 102.4ms | `fill` | `[native code]` |
| 0.9% | 102.0ms | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` |
| 0.9% | 97.6ms | 0.0% | 10.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:180` |
| 0.7% | 85.4ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:93` |
| 0.7% | 78.8ms | 0.7% | 78.8ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.7% | 78.8ms | 0.7% | 78.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` |
| 0.6% | 72.1ms | 0.6% | 72.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` |
| 0.6% | 66.3ms | 0.1% | 15.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:528` |
| 0.5% | 62.0ms | 0.5% | 62.0ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:491` |
| 0.5% | 57.1ms | 0.2% | 23.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.5% | 57.0ms | 0.2% | 27.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:203` |
| 0.5% | 55.1ms | 0.5% | 55.1ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.4% | 53.5ms | 0.4% | 53.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.4% | 48.6ms | 0.4% | 45.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:538` |
| 0.4% | 47.7ms | 0.0% | 1.1ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:483` |
| 0.4% | 46.0ms | 0.0% | 3.8ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` |
| 0.4% | 44.0ms | 0.4% | 44.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.3% | 41.3ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:495` |
| 0.3% | 39.4ms | 0.0% | 1.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:628` |
| 0.3% | 33.5ms | 0.3% | 33.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` |
| 0.3% | 33.4ms | 0.0% | 2.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:546` |
| 0.3% | 32.8ms | 0.0% | 0us | `computeCovariancePowers` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:203` |
| 0.2% | 31.0ms | 0.1% | 21.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:567` |
| 0.2% | 30.2ms | 0.2% | 30.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 0.2% | 26.8ms | 0.1% | 20.1ms | `matVecMult` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:60` |
| 0.2% | 25.1ms | 0.0% | 6.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:601` |
| 0.2% | 24.7ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:620` |
| 0.2% | 24.5ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.2% | 23.1ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.2% | 22.9ms | 0.2% | 22.9ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:458` |
| 0.1% | 21.0ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:619` |
| 0.1% | 20.8ms | 0.1% | 18.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:614` |
| 0.1% | 19.9ms | 0.0% | 5.1ms | `anonymous` | `[native code]` |
| 0.1% | 18.4ms | 0.0% | 7.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` |
| 0.1% | 18.1ms | 0.1% | 16.7ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:469` |
| 0.1% | 17.9ms | 0.1% | 17.9ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:264` |
| 0.1% | 17.3ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` |
| 0.1% | 16.1ms | 0.0% | 0us | `computeCovariancePowers` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:209` |
| 0.1% | 15.9ms | 0.1% | 15.9ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:479` |
| 0.1% | 15.0ms | 0.0% | 3.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:548` |
| 0.1% | 14.8ms | 0.1% | 14.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.1% | 14.7ms | 0.1% | 12.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:640` |
| 0.1% | 14.2ms | 0.0% | 8.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 0.1% | 13.1ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` |
| 0.1% | 12.7ms | 0.1% | 12.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` |
| 0.1% | 12.3ms | 0.1% | 12.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:514` |
| 0.1% | 11.7ms | 0.1% | 11.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:634` |
| 0.1% | 11.4ms | 0.1% | 11.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:633` |
| 0.0% | 9.9ms | 0.0% | 6.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:551` |
| 0.0% | 9.8ms | 0.0% | 5.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:529` |
| 0.0% | 9.6ms | 0.0% | 9.6ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 9.5ms | 0.0% | 9.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:511` |
| 0.0% | 9.3ms | 0.0% | 9.3ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 9.2ms | 0.0% | 9.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` |
| 0.0% | 8.6ms | 0.0% | 8.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 0.0% | 8.5ms | 0.0% | 8.5ms | `sqrt` | `[native code]` |
| 0.0% | 8.0ms | 0.0% | 8.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:552` |
| 0.0% | 8.0ms | 0.0% | 5.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:593` |
| 0.0% | 7.4ms | 0.0% | 7.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:507` |
| 0.0% | 7.3ms | 0.0% | 7.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:181` |
| 0.0% | 6.7ms | 0.0% | 6.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:60` |
| 0.0% | 6.6ms | 0.0% | 6.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:568` |
| 0.0% | 6.5ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:96` |
| 0.0% | 6.2ms | 0.0% | 6.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:518` |
| 0.0% | 5.7ms | 0.0% | 0us | `computeCovariancePowers` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:204` |
| 0.0% | 5.6ms | 0.0% | 5.6ms | `reduce` | `[native code]` |
| 0.0% | 5.5ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:545` |
| 0.0% | 5.1ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.0% | 5.1ms | 0.0% | 5.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 5.0ms | 0.0% | 5.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:630` |
| 0.0% | 4.9ms | 0.0% | 0us | `computeCovariancePowers` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:210` |
| 0.0% | 4.9ms | 0.0% | 4.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:626` |
| 0.0% | 4.8ms | 0.0% | 4.8ms | `abs` | `[native code]` |
| 0.0% | 4.7ms | 0.0% | 4.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:528` |
| 0.0% | 4.2ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` |
| 0.0% | 3.9ms | 0.0% | 3.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:553` |
| 0.0% | 3.8ms | 0.0% | 3.8ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:471` |
| 0.0% | 3.7ms | 0.0% | 3.7ms | `matVecMult` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.7ms | 0.0% | 3.7ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.7ms | 0.0% | 3.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:629` |
| 0.0% | 3.7ms | 0.0% | 3.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 3.6ms | 0.0% | 3.6ms | `push` | `[native code]` |
| 0.0% | 3.5ms | 0.0% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:618` |
| 0.0% | 3.3ms | 0.0% | 3.3ms | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.1ms | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:424` |
| 0.0% | 3.0ms | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:266` |
| 0.0% | 3.0ms | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:267` |
| 0.0% | 2.9ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 2.9ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.7ms | 0.0% | 2.7ms | `max` | `[native code]` |
| 0.0% | 2.7ms | 0.0% | 2.7ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.6ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:594` |
| 0.0% | 2.6ms | 0.0% | 2.6ms | `isFinite` | `[native code]` |
| 0.0% | 2.5ms | 0.0% | 2.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:541` |
| 0.0% | 2.5ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:504` |
| 0.0% | 2.5ms | 0.0% | 2.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.0% | 2.4ms | 0.0% | 0us | `exp` | `[native code]` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.3ms | 0.0% | 0us | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:56` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:165` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:234` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:547` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:270` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:210` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:271` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `computeCovariancePowers` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:199` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `write` | `[native code]` |
| 0.0% | 1.3ms | 0.0% | 0us | `writeFast` | `internal:fs/streams:359` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:169` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:188` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:241` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:163` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:534` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:540` |
| 0.0% | 1.1ms | 0.0% | 0us | `node:fs` | `node:fs:299` |
| 0.0% | 1.1ms | 0.0% | 0us | `internal:promisify` | `internal:promisify:53` |
| 0.0% | 1.1ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 1.1ms | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 1.1ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 1.1ms | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 1.1ms | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 1.1ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 1.1ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:88` |
| 0.0% | 1.0ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:503` |
| 0.0% | 1.0ms | 0.0% | 1.0ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:232` |
| 0.0% | 1.0ms | 0.0% | 1.0ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:24` |
| 0.0% | 1.0ms | 0.0% | 1.0ms | `filter` | `[native code]` |
| 0.0% | 1.0ms | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:422` |
| 0.0% | 1.0ms | 0.0% | 1.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:424` |
| 0.0% | 921us | 0.0% | 921us | `now` | `[native code]` |
| 0.0% | 921us | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:85` |

## Function Details

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:575` | Self: 18.7% (2.02s) | Total: 19.3% (2.08s) | Samples: 1570

**Called by:**
- `runTrial` (1614)

**Calls:**
- `createZeroMatrix` (35)
- `createZeroMatrix` (7)
- `from` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` | Self: 16.7% (1.81s) | Total: 18.0% (1.94s) | Samples: 1397

**Called by:**
- `step` (525)
- `step` (510)
- `step` (473)

**Calls:**
- `hypot` (111)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:139` | Self: 16.1% (1.74s) | Total: 17.2% (1.86s) | Samples: 1351

**Called by:**
- `step` (512)
- `step` (468)
- `step` (464)

**Calls:**
- `hypot` (93)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:228` | Self: 4.9% (532.7ms) | Total: 5.8% (626.4ms) | Samples: 416

**Called by:**
- `step` (248)
- `step` (238)

**Calls:**
- `from` (70)

### `map`
`[native code]` | Self: 4.5% (492.9ms) | Total: 11.0% (1.19s) | Samples: 382

**Called by:**
- `matVecMult` (360)
- `step` (111)
- `cloneMatrix` (90)
- `step` (89)
- `step` (77)
- `(anonymous)` (65)
- `jacobiEigenSymmetric` (25)
- `jacobiEigenSymmetric` (20)
- `jacobiEigenSymmetric` (18)
- `(anonymous)` (14)
- `step` (13)
- `computeCovariancePowers` (12)
- `step` (9)
- `step` (7)
- `step` (5)
- `computeCovariancePowers` (4)
- `CMAESOptimizerND` (3)
- `step` (3)
- `alignProjectionBasis` (1)
- `alignProjectionBasis` (1)

**Calls:**
- `(anonymous)` (266)
- `(anonymous)` (96)
- `(anonymous)` (84)
- `(anonymous)` (55)
- `repair` (18)
- `(anonymous)` (8)
- `sqrt` (7)
- `(anonymous)` (3)
- `abs` (3)
- `(anonymous)` (2)
- `(anonymous)` (1)
- `(anonymous)` (1)
- `(anonymous)` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 3.6% (393.4ms) | Total: 3.6% (393.4ms) | Samples: 303

**Called by:**
- `map` (266)
- `some` (37)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` | Self: 3.4% (377.0ms) | Total: 3.4% (377.0ms) | Samples: 292

**Called by:**
- `runTrial` (292)

### `compose`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` | Self: 3.1% (337.5ms) | Total: 4.1% (452.1ms) | Samples: 266

**Called by:**
- `computeCovariancePowers` (339)
- `sampleGaussianVectorND` (15)

**Calls:**
- `from` (85)
- `createZeroMatrix` (2)
- `createZeroMatrix` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 2.7% (297.3ms) | Total: 2.9% (316.7ms) | Samples: 232

**Called by:**
- `step` (247)

**Calls:**
- `compose` (15)

### `hypot`
`[native code]` | Self: 2.4% (260.0ms) | Total: 2.4% (260.0ms) | Samples: 204

**Called by:**
- `jacobiEigenSymmetric` (111)
- `jacobiEigenSymmetric` (93)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:579` | Self: 2.3% (251.3ms) | Total: 2.3% (251.3ms) | Samples: 184

**Called by:**
- `runTrial` (184)

### `some`
`[native code]` | Self: 1.7% (188.2ms) | Total: 4.3% (464.8ms) | Samples: 143

**Called by:**
- `validateSquareFiniteMatrix` (109)
- `(anonymous)` (102)
- `projectTo3D` (85)
- `computeCovariancePowers` (26)
- `(anonymous)` (22)
- `matVecMult` (5)
- `computeCovariancePowers` (3)
- `some` (1)

**Calls:**
- `(anonymous)` (122)
- `(anonymous)` (45)
- `(anonymous)` (37)
- `(anonymous)` (5)
- `some` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` | Self: 1.5% (165.3ms) | Total: 1.5% (165.3ms) | Samples: 131

**Called by:**
- `step` (57)
- `step` (40)
- `step` (34)

### `from`
`[native code]` | Self: 1.4% (153.5ms) | Total: 3.5% (386.2ms) | Samples: 120

**Called by:**
- `compose` (85)
- `jacobiEigenSymmetric` (81)
- `reconstructSymmetric` (70)
- `createZeroMatrix` (34)
- `jacobiEigenSymmetric` (22)
- `exp` (2)
- `step` (2)

**Calls:**
- `fill` (74)
- `(anonymous)` (59)
- `(anonymous)` (43)

### `assertSameLength`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:43` | Self: 1.1% (129.3ms) | Total: 1.1% (129.3ms) | Samples: 98

**Called by:**
- `vecDot` (98)

### `fill`
`[native code]` | Self: 0.9% (102.4ms) | Total: 0.9% (102.4ms) | Samples: 75

**Called by:**
- `from` (74)
- `(anonymous)` (1)

### `sort`
`[native code]` | Self: 0.9% (97.7ms) | Total: 1.0% (109.9ms) | Samples: 75

**Called by:**
- `jacobiEigenSymmetric` (46)
- `step` (39)

**Calls:**
- `(anonymous)` (6)
- `(anonymous)` (4)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.7% (80.8ms) | Total: 1.6% (182.1ms) | Samples: 64

**Called by:**
- `step` (51)
- `step` (48)
- `step` (46)

**Calls:**
- `from` (81)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` | Self: 0.7% (78.8ms) | Total: 0.7% (78.8ms) | Samples: 60

**Called by:**
- `step` (60)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` | Self: 0.7% (78.8ms) | Total: 0.7% (78.8ms) | Samples: 59

**Called by:**
- `from` (59)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` | Self: 0.6% (72.1ms) | Total: 0.6% (72.1ms) | Samples: 55

**Called by:**
- `map` (55)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:491` | Self: 0.5% (62.0ms) | Total: 0.5% (62.0ms) | Samples: 50

**Called by:**
- `step` (50)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.5% (55.1ms) | Total: 0.5% (55.1ms) | Samples: 41

**Called by:**
- `(anonymous)` (16)
- `step` (15)
- `step` (10)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.4% (53.5ms) | Total: 0.4% (53.5ms) | Samples: 43

**Called by:**
- `from` (43)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:512` | Self: 0.4% (49.9ms) | Total: 1.1% (128.8ms) | Samples: 28

**Called by:**
- `runTrial` (88)

**Calls:**
- `ellipsoidObjective` (60)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:538` | Self: 0.4% (45.9ms) | Total: 0.4% (48.6ms) | Samples: 36

**Called by:**
- `runTrial` (38)

**Calls:**
- `createZeroVector` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` | Self: 0.4% (44.0ms) | Total: 0.4% (44.0ms) | Samples: 33

**Called by:**
- `runTrial` (33)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:602` | Self: 0.3% (35.5ms) | Total: 1.8% (198.9ms) | Samples: 28

**Called by:**
- `forEach` (154)

**Calls:**
- `projectTo3D` (88)
- `projectTo3D` (16)
- `projectTo3D` (11)
- `projectTo3D` (10)
- `projectTo3D` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` | Self: 0.3% (33.5ms) | Total: 0.3% (33.5ms) | Samples: 25

**Called by:**
- `step` (11)
- `step` (7)
- `step` (7)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` | Self: 0.2% (30.2ms) | Total: 0.2% (30.2ms) | Samples: 24

**Called by:**
- `step` (12)
- `step` (10)
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:508` | Self: 0.2% (28.9ms) | Total: 3.4% (372.7ms) | Samples: 23

**Called by:**
- `runTrial` (289)
- `runTrial` (1)

**Calls:**
- `sampleGaussianVectorND` (247)
- `sampleGaussianVectorND` (14)
- `sampleGaussianVectorND` (2)
- `sampleGaussianVectorND` (2)
- `sampleGaussianVectorND` (1)
- `sampleGaussianVectorND` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:203` | Self: 0.2% (27.0ms) | Total: 0.5% (57.0ms) | Samples: 22

**Called by:**
- `some` (45)

**Calls:**
- `some` (22)
- `fill` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` | Self: 0.2% (25.7ms) | Total: 1.4% (158.7ms) | Samples: 20

**Called by:**
- `some` (122)

**Calls:**
- `some` (102)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` | Self: 0.2% (23.6ms) | Total: 0.5% (57.1ms) | Samples: 18

**Called by:**
- `step` (18)
- `step` (14)
- `step` (13)

**Calls:**
- `map` (25)
- `abs` (1)
- `max` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` | Self: 0.2% (23.2ms) | Total: 1.0% (108.2ms) | Samples: 19

**Called by:**
- `map` (84)

**Calls:**
- `map` (65)

### `repair`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:458` | Self: 0.2% (22.9ms) | Total: 0.2% (22.9ms) | Samples: 18

**Called by:**
- `map` (18)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:567` | Self: 0.1% (21.3ms) | Total: 0.2% (31.0ms) | Samples: 16

**Called by:**
- `runTrial` (24)

**Calls:**
- `vecDot` (8)

### `matVecMult`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:60` | Self: 0.1% (20.1ms) | Total: 0.2% (26.8ms) | Samples: 16

**Called by:**
- `step` (15)
- `step` (3)
- `step` (3)

**Calls:**
- `some` (5)

### `forEach`
`[native code]` | Self: 0.1% (18.5ms) | Total: 2.2% (242.5ms) | Samples: 14

**Called by:**
- `step` (183)
- `step` (4)

**Calls:**
- `(anonymous)` (154)
- `(anonymous)` (18)
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:614` | Self: 0.1% (18.4ms) | Total: 0.1% (20.8ms) | Samples: 15

**Called by:**
- `runTrial` (17)

**Calls:**
- `radius` (2)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:264` | Self: 0.1% (17.9ms) | Total: 0.1% (17.9ms) | Samples: 14

**Called by:**
- `step` (14)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:469` | Self: 0.1% (16.7ms) | Total: 0.1% (18.1ms) | Samples: 13

**Called by:**
- `(anonymous)` (10)
- `step` (3)
- `step` (1)

**Calls:**
- `requireFiniteVector` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:479` | Self: 0.1% (15.9ms) | Total: 0.1% (15.9ms) | Samples: 12

**Called by:**
- `(anonymous)` (11)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:528` | Self: 0.1% (15.2ms) | Total: 0.6% (66.3ms) | Samples: 11

**Called by:**
- `runTrial` (50)

**Calls:**
- `sort` (39)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` | Self: 0.1% (14.8ms) | Total: 0.1% (14.8ms) | Samples: 9

**Called by:**
- `runTrial` (9)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` | Self: 0.1% (12.7ms) | Total: 0.1% (12.7ms) | Samples: 10

**Called by:**
- `runTrial` (10)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:514` | Self: 0.1% (12.3ms) | Total: 0.1% (12.3ms) | Samples: 10

**Called by:**
- `runTrial` (10)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:640` | Self: 0.1% (12.0ms) | Total: 0.1% (14.7ms) | Samples: 8

**Called by:**
- `runTrial` (10)

**Calls:**
- `push` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:634` | Self: 0.1% (11.7ms) | Total: 0.1% (11.7ms) | Samples: 9

**Called by:**
- `runTrial` (9)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:633` | Self: 0.1% (11.4ms) | Total: 0.1% (11.4ms) | Samples: 8

**Called by:**
- `runTrial` (8)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:180` | Self: 0.0% (10.0ms) | Total: 0.9% (97.6ms) | Samples: 8

**Called by:**
- `step` (32)
- `step` (25)
- `step` (19)

**Calls:**
- `sort` (46)
- `from` (22)

### `vecDot`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (9.6ms) | Total: 0.0% (9.6ms) | Samples: 8

**Called by:**
- `step` (8)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:511` | Self: 0.0% (9.5ms) | Total: 0.0% (9.5ms) | Samples: 8

**Called by:**
- `map` (8)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (9.3ms) | Total: 0.0% (9.3ms) | Samples: 7

**Called by:**
- `step` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` | Self: 0.0% (9.2ms) | Total: 0.0% (9.2ms) | Samples: 7

**Called by:**
- `runTrial` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` | Self: 0.0% (8.6ms) | Total: 0.1% (14.2ms) | Samples: 7

**Called by:**
- `runTrial` (11)

**Calls:**
- `reduce` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` | Self: 0.0% (8.6ms) | Total: 0.0% (8.6ms) | Samples: 7

**Called by:**
- `runTrial` (7)

### `sqrt`
`[native code]` | Self: 0.0% (8.5ms) | Total: 0.0% (8.5ms) | Samples: 7

**Called by:**
- `map` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:552` | Self: 0.0% (8.0ms) | Total: 0.0% (8.0ms) | Samples: 6

**Called by:**
- `runTrial` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` | Self: 0.0% (7.8ms) | Total: 0.1% (18.4ms) | Samples: 6

**Called by:**
- `runTrial` (13)

**Calls:**
- `map` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:510` | Self: 0.0% (7.5ms) | Total: 1.1% (121.1ms) | Samples: 6

**Called by:**
- `runTrial` (95)

**Calls:**
- `map` (89)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:507` | Self: 0.0% (7.4ms) | Total: 0.0% (7.4ms) | Samples: 6

**Called by:**
- `runTrial` (6)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:181` | Self: 0.0% (7.3ms) | Total: 0.0% (7.3ms) | Samples: 6

**Called by:**
- `sort` (6)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:60` | Self: 0.0% (6.7ms) | Total: 0.0% (6.7ms) | Samples: 5

**Called by:**
- `some` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:568` | Self: 0.0% (6.6ms) | Total: 0.0% (6.6ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:518` | Self: 0.0% (6.2ms) | Total: 0.0% (6.2ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:601` | Self: 0.0% (6.2ms) | Total: 0.2% (25.1ms) | Samples: 5

**Called by:**
- `forEach` (18)
- `map` (1)

**Calls:**
- `map` (14)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:551` | Self: 0.0% (6.2ms) | Total: 0.0% (9.9ms) | Samples: 5

**Called by:**
- `runTrial` (8)

**Calls:**
- `vecNorm` (2)
- `vecNorm` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:593` | Self: 0.0% (5.6ms) | Total: 0.0% (8.0ms) | Samples: 5

**Called by:**
- `runTrial` (7)

**Calls:**
- `exp` (2)

### `reduce`
`[native code]` | Self: 0.0% (5.6ms) | Total: 0.0% (5.6ms) | Samples: 4

**Called by:**
- `step` (4)

### `anonymous`
`[native code]` | Self: 0.0% (5.1ms) | Total: 0.1% (19.9ms) | Samples: 4

**Called by:**
- `(anonymous)` (3)
- `node:fs/promises` (2)
- `node:fs` (2)
- `internal:fs/streams` (1)
- `internal:streams/pipeline` (1)
- `node:fs` (1)
- `get WriteStream` (1)
- `internal:stream` (1)
- `internal:promisify` (1)
- `internal:streams/compose` (1)
- `internal:streams/duplex` (1)
- `node:stream` (1)

**Calls:**
- `node:fs/promises` (2)
- `node:fs` (2)
- `internal:fs/streams` (1)
- `internal:streams/compose` (1)
- `internal:streams/pipeline` (1)
- `node:fs` (1)
- `internal:streams/duplex` (1)
- `node:stream` (1)
- `internal:stream` (1)
- `internal:promisify` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:509` | Self: 0.0% (5.1ms) | Total: 3.1% (343.0ms) | Samples: 4

**Called by:**
- `runTrial` (266)

**Calls:**
- `matVecMult` (244)
- `matVecMult` (15)
- `matVecMult` (3)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:470` | Self: 0.0% (5.1ms) | Total: 1.0% (114.8ms) | Samples: 4

**Called by:**
- `(anonymous)` (88)
- `step` (1)

**Calls:**
- `some` (85)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:529` | Self: 0.0% (5.1ms) | Total: 0.0% (9.8ms) | Samples: 4

**Called by:**
- `runTrial` (8)

**Calls:**
- `forEach` (4)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (5.1ms) | Total: 0.0% (5.1ms) | Samples: 4

**Called by:**
- `step` (2)
- `step` (1)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:630` | Self: 0.0% (5.0ms) | Total: 0.0% (5.0ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:626` | Self: 0.0% (4.9ms) | Total: 0.0% (4.9ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `abs`
`[native code]` | Self: 0.0% (4.8ms) | Total: 0.0% (4.8ms) | Samples: 4

**Called by:**
- `map` (3)
- `jacobiEigenSymmetric` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:528` | Self: 0.0% (4.7ms) | Total: 0.0% (4.7ms) | Samples: 4

**Called by:**
- `sort` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:500` | Self: 0.0% (4.1ms) | Total: 14.6% (1.58s) | Samples: 3

**Called by:**
- `runTrial` (1215)
- `runTrial` (1)

**Calls:**
- `jacobiEigenSymmetric` (525)
- `jacobiEigenSymmetric` (468)
- `jacobiEigenSymmetric` (57)
- `jacobiEigenSymmetric` (48)
- `jacobiEigenSymmetric` (37)
- `jacobiEigenSymmetric` (25)
- `jacobiEigenSymmetric` (13)
- `jacobiEigenSymmetric` (12)
- `jacobiEigenSymmetric` (11)
- `jacobiEigenSymmetric` (8)
- `jacobiEigenSymmetric` (6)
- `jacobiEigenSymmetric` (1)
- `push` (1)
- `jacobiEigenSymmetric` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:600` | Self: 0.0% (4.0ms) | Total: 2.2% (241.9ms) | Samples: 3

**Called by:**
- `runTrial` (186)

**Calls:**
- `forEach` (183)

### `computeCovariancePowers`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:223` | Self: 0.0% (4.0ms) | Total: 4.0% (436.7ms) | Samples: 3

**Called by:**
- `step` (340)
- `step` (1)
- `step` (1)

**Calls:**
- `compose` (339)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:548` | Self: 0.0% (3.9ms) | Total: 0.1% (15.0ms) | Samples: 3

**Called by:**
- `runTrial` (12)

**Calls:**
- `map` (9)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:553` | Self: 0.0% (3.9ms) | Total: 0.0% (3.9ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:106` | Self: 0.0% (3.9ms) | Total: 1.3% (150.0ms) | Samples: 3

**Called by:**
- `step` (40)
- `step` (37)
- `step` (36)

**Calls:**
- `validateSquareFiniteMatrix` (109)
- `validateSquareFiniteMatrix` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:471` | Self: 0.0% (3.8ms) | Total: 0.0% (3.8ms) | Samples: 3

**Called by:**
- `step` (2)
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:590` | Self: 0.0% (3.8ms) | Total: 14.8% (1.59s) | Samples: 3

**Called by:**
- `runTrial` (1239)
- `runTrial` (3)

**Calls:**
- `jacobiEigenSymmetric` (512)
- `jacobiEigenSymmetric` (510)
- `jacobiEigenSymmetric` (51)
- `jacobiEigenSymmetric` (40)
- `jacobiEigenSymmetric` (40)
- `jacobiEigenSymmetric` (32)
- `jacobiEigenSymmetric` (18)
- `jacobiEigenSymmetric` (10)
- `jacobiEigenSymmetric` (10)
- `jacobiEigenSymmetric` (7)
- `jacobiEigenSymmetric` (5)
- `max` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` | Self: 0.0% (3.8ms) | Total: 0.4% (46.0ms) | Samples: 3

**Called by:**
- `step` (35)
- `compose` (2)

**Calls:**
- `from` (34)

### `matVecMult`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (3.7ms) | Total: 0.0% (3.7ms) | Samples: 3

**Called by:**
- `step` (3)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (3.7ms) | Total: 0.0% (3.7ms) | Samples: 3

**Called by:**
- `step` (2)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:629` | Self: 0.0% (3.7ms) | Total: 0.0% (3.7ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` | Self: 0.0% (3.7ms) | Total: 0.0% (3.7ms) | Samples: 3

**Called by:**
- `map` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:511` | Self: 0.0% (3.6ms) | Total: 1.3% (146.3ms) | Samples: 3

**Called by:**
- `runTrial` (114)

**Calls:**
- `map` (111)

### `push`
`[native code]` | Self: 0.0% (3.6ms) | Total: 0.0% (3.6ms) | Samples: 3

**Called by:**
- `step` (2)
- `step` (1)

### `matVecMult`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:63` | Self: 0.0% (3.4ms) | Total: 4.3% (471.9ms) | Samples: 3

**Called by:**
- `step` (244)
- `step` (98)
- `step` (21)

**Calls:**
- `map` (360)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:591` | Self: 0.0% (3.4ms) | Total: 3.0% (328.6ms) | Samples: 3

**Called by:**
- `runTrial` (254)

**Calls:**
- `reconstructSymmetric` (248)
- `reconstructSymmetric` (1)
- `reconstructSymmetric` (1)
- `reconstructSymmetric` (1)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (3.3ms) | Total: 0.0% (3.3ms) | Samples: 3

**Called by:**
- `step` (3)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (2.8ms) | Total: 0.0% (2.8ms) | Samples: 2

**Called by:**
- `step` (2)

### `max`
`[native code]` | Self: 0.0% (2.7ms) | Total: 0.0% (2.7ms) | Samples: 2

**Called by:**
- `jacobiEigenSymmetric` (1)
- `step` (1)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (2.7ms) | Total: 0.0% (2.7ms) | Samples: 2

**Called by:**
- `step` (2)

### `isFinite`
`[native code]` | Self: 0.0% (2.6ms) | Total: 0.0% (2.6ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:546` | Self: 0.0% (2.5ms) | Total: 0.3% (33.4ms) | Samples: 2

**Called by:**
- `runTrial` (26)

**Calls:**
- `matVecMult` (21)
- `matVecMult` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:541` | Self: 0.0% (2.5ms) | Total: 0.0% (2.5ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:501` | Self: 0.0% (2.5ms) | Total: 2.8% (310.1ms) | Samples: 2

**Called by:**
- `runTrial` (242)

**Calls:**
- `reconstructSymmetric` (238)
- `reconstructSymmetric` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` | Self: 0.0% (2.5ms) | Total: 0.0% (2.5ms) | Samples: 2

**Called by:**
- `map` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` | Self: 0.0% (2.4ms) | Total: 0.9% (102.0ms) | Samples: 2

**Called by:**
- `runTrial` (79)

**Calls:**
- `map` (77)

### `radius`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (2.4ms) | Total: 0.0% (2.4ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:618` | Self: 0.0% (2.1ms) | Total: 0.0% (3.5ms) | Samples: 2

**Called by:**
- `runTrial` (3)

**Calls:**
- `variancePercent` (1)

### `nextOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.7ms) | Total: 0.0% (1.7ms) | Samples: 1

**Called by:**
- `sampleGaussianVectorND` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:165` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 1

**Called by:**
- `step` (1)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:234` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 1

**Called by:**
- `step` (1)

### `nextHalfOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 1

**Called by:**
- `sampleGaussianVectorND` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:547` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 1

**Called by:**
- `runTrial` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:270` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 1

**Called by:**
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:210` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 1

**Called by:**
- `map` (1)

### `nextHalfOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 1

**Called by:**
- `sampleGaussianVectorND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:504` | Self: 0.0% (1.4ms) | Total: 0.0% (2.5ms) | Samples: 1

**Called by:**
- `runTrial` (2)

**Calls:**
- `computeCovariancePowers` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:271` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 1

**Called by:**
- `step` (1)

### `variancePercent`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 1

**Called by:**
- `step` (1)

### `computeCovariancePowers`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:199` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 1

**Called by:**
- `runTrial` (1)

### `write`
`[native code]` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 1

**Called by:**
- `writeFast` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:502` | Self: 0.0% (1.3ms) | Total: 4.6% (496.9ms) | Samples: 1

**Called by:**
- `runTrial` (386)
- `runTrial` (1)

**Calls:**
- `computeCovariancePowers` (340)
- `computeCovariancePowers` (26)
- `computeCovariancePowers` (12)
- `computeCovariancePowers` (4)
- `computeCovariancePowers` (3)
- `computeCovariancePowers` (1)

### `requireFiniteVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 1

**Called by:**
- `projectTo3D` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:620` | Self: 0.0% (1.3ms) | Total: 0.2% (24.7ms) | Samples: 1

**Called by:**
- `runTrial` (18)

**Calls:**
- `projectTo3D` (15)
- `projectTo3D` (1)
- `projectTo3D` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` | Self: 0.0% (1.3ms) | Total: 13.1% (1.41s) | Samples: 1

**Called by:**
- `runTrial` (1107)
- `runTrial` (2)

**Calls:**
- `jacobiEigenSymmetric` (473)
- `jacobiEigenSymmetric` (464)
- `jacobiEigenSymmetric` (46)
- `jacobiEigenSymmetric` (36)
- `jacobiEigenSymmetric` (34)
- `jacobiEigenSymmetric` (19)
- `jacobiEigenSymmetric` (14)
- `jacobiEigenSymmetric` (7)
- `jacobiEigenSymmetric` (5)
- `jacobiEigenSymmetric` (4)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)

### `vecNorm`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 1

**Called by:**
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:169` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 1

**Called by:**
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:188` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 1

**Called by:**
- `step` (1)

### `nextOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:241` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 1

**Called by:**
- `sampleGaussianVectorND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:599` | Self: 0.0% (1.2ms) | Total: 1.4% (155.2ms) | Samples: 1

**Called by:**
- `runTrial` (122)

**Calls:**
- `alignProjectionBasis` (50)
- `alignProjectionBasis` (36)
- `alignProjectionBasis` (33)
- `alignProjectionBasis` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:163` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 1

**Called by:**
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:534` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 1

**Called by:**
- `forEach` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:483` | Self: 0.0% (1.1ms) | Total: 0.4% (47.7ms) | Samples: 1

**Called by:**
- `step` (36)

**Calls:**
- `cloneMatrix` (34)
- `map` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:628` | Self: 0.0% (1.1ms) | Total: 0.3% (39.4ms) | Samples: 1

**Called by:**
- `runTrial` (31)

**Calls:**
- `cloneMatrix` (24)
- `map` (3)
- `cloneMatrix` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:540` | Self: 0.0% (1.1ms) | Total: 0.0% (1.1ms) | Samples: 1

**Called by:**
- `runTrial` (1)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:88` | Self: 0.0% (1.1ms) | Total: 0.0% (1.1ms) | Samples: 1

**Called by:**
- `jacobiEigenSymmetric` (1)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:232` | Self: 0.0% (1.0ms) | Total: 0.0% (1.0ms) | Samples: 1

**Called by:**
- `step` (1)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:24` | Self: 0.0% (1.0ms) | Total: 0.0% (1.0ms) | Samples: 1

**Called by:**
- `compose` (1)

### `filter`
`[native code]` | Self: 0.0% (1.0ms) | Total: 0.0% (1.0ms) | Samples: 1

**Called by:**
- `CMAESOptimizerND` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:424` | Self: 0.0% (1.0ms) | Total: 0.0% (1.0ms) | Samples: 1

**Called by:**
- `map` (1)

### `now`
`[native code]` | Self: 0.0% (921us) | Total: 0.0% (921us) | Samples: 1

**Called by:**
- `(module)` (1)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (1.1ms) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:266` | Self: 0.0% (0us) | Total: 0.0% (3.0ms) | Samples: 0

**Called by:**
- `step` (2)

**Calls:**
- `nextOpenUnit` (1)
- `nextOpenUnit` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` | Self: 0.0% (0us) | Total: 5.2% (564.2ms) | Samples: 0

**Calls:**
- `runTrial` (423)
- `runTrial` (3)
- `runTrial` (1)

### `vecNorm`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:56` | Self: 0.0% (0us) | Total: 0.0% (2.3ms) | Samples: 0

**Called by:**
- `step` (2)

**Calls:**
- `vecDot` (2)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:424` | Self: 0.0% (0us) | Total: 0.0% (3.1ms) | Samples: 0

**Called by:**
- `runTrial` (3)

**Calls:**
- `map` (3)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` | Self: 0.0% (0us) | Total: 1.0% (116.0ms) | Samples: 0

**Called by:**
- `alignProjectionBasis` (34)
- `alignProjectionBasis` (32)
- `step` (24)

**Calls:**
- `map` (90)

### `computeCovariancePowers`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:210` | Self: 0.0% (0us) | Total: 0.0% (4.9ms) | Samples: 0

**Called by:**
- `step` (4)

**Calls:**
- `map` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:545` | Self: 0.0% (0us) | Total: 0.0% (5.5ms) | Samples: 0

**Called by:**
- `runTrial` (5)

**Calls:**
- `map` (5)

### `computeCovariancePowers`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:203` | Self: 0.0% (0us) | Total: 0.3% (32.8ms) | Samples: 0

**Called by:**
- `step` (26)

**Calls:**
- `some` (26)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` | Self: 0.0% (0us) | Total: 0.2% (24.5ms) | Samples: 0

**Called by:**
- `step` (10)
- `step` (6)
- `step` (4)

**Calls:**
- `map` (20)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:619` | Self: 0.0% (0us) | Total: 0.1% (21.0ms) | Samples: 0

**Called by:**
- `runTrial` (16)

**Calls:**
- `projectTo3D` (10)
- `projectTo3D` (3)
- `projectTo3D` (2)
- `projectTo3D` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:63` | Self: 0.0% (0us) | Total: 1.1% (126.9ms) | Samples: 0

**Called by:**
- `map` (96)

**Calls:**
- `vecDot` (96)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` | Self: 0.0% (0us) | Total: 99.7% (10.77s) | Samples: 0

**Called by:**
- `(module)` (7835)
- `(module)` (423)
- `(module)` (66)

**Calls:**
- `step` (1614)
- `step` (1239)
- `step` (1215)
- `step` (1107)
- `step` (386)
- `step` (292)
- `step` (289)
- `step` (266)
- `step` (254)
- `step` (242)
- `step` (186)
- `step` (184)
- `step` (122)
- `step` (114)
- `step` (101)
- `step` (95)
- `step` (88)
- `step` (79)
- `step` (50)
- `step` (38)
- `step` (33)
- `step` (31)
- `step` (26)
- `step` (24)
- `step` (18)
- `step` (17)
- `step` (16)
- `step` (13)
- `step` (13)
- `step` (12)
- `step` (11)
- `step` (10)
- `step` (10)
- `step` (10)
- `step` (9)
- `step` (9)
- `step` (8)
- `step` (8)
- `step` (8)
- `step` (7)
- `step` (7)
- `step` (7)
- `step` (6)
- `step` (6)
- `step` (5)
- `step` (5)
- `step` (5)
- `step` (4)
- `step` (4)
- `step` (3)
- `step` (3)
- `step` (3)
- `step` (2)
- `step` (2)
- `step` (2)
- `step` (2)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:503` | Self: 0.0% (0us) | Total: 0.0% (1.0ms) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `computeCovariancePowers` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:422` | Self: 0.0% (0us) | Total: 0.0% (1.0ms) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `filter` (1)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (2.9ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (1.1ms) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `computeCovariancePowers`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:204` | Self: 0.0% (0us) | Total: 0.0% (5.7ms) | Samples: 0

**Called by:**
- `step` (3)

**Calls:**
- `some` (3)

### `exp`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (2.4ms) | Samples: 0

**Called by:**
- `step` (2)

**Calls:**
- `from` (2)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:85` | Self: 0.0% (0us) | Total: 0.0% (921us) | Samples: 0

**Calls:**
- `now` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` | Self: 0.0% (0us) | Total: 0.2% (23.1ms) | Samples: 0

**Called by:**
- `step` (8)
- `step` (5)
- `step` (5)

**Calls:**
- `map` (18)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:86` | Self: 0.0% (0us) | Total: 93.9% (10.14s) | Samples: 0

**Calls:**
- `runTrial` (7835)
- `runTrial` (5)
- `runTrial` (2)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:96` | Self: 0.0% (0us) | Total: 0.0% (6.5ms) | Samples: 0

**Calls:**
- `(anonymous)` (4)
- `writeFast` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:93` | Self: 0.0% (0us) | Total: 0.7% (85.4ms) | Samples: 0

**Calls:**
- `runTrial` (66)
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` | Self: 0.0% (0us) | Total: 0.1% (17.3ms) | Samples: 0

**Called by:**
- `runTrial` (13)

**Calls:**
- `map` (13)

### `node:fs`
`node:fs:299` | Self: 0.0% (0us) | Total: 0.0% (1.1ms) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:promisify`
`internal:promisify:53` | Self: 0.0% (0us) | Total: 0.0% (1.1ms) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `writeFast`
`internal:fs/streams:359` | Self: 0.0% (0us) | Total: 0.0% (1.3ms) | Samples: 0

**Called by:**
- `(module)` (1)

**Calls:**
- `write` (1)

### `computeCovariancePowers`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:209` | Self: 0.0% (0us) | Total: 0.1% (16.1ms) | Samples: 0

**Called by:**
- `step` (12)

**Calls:**
- `map` (12)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` | Self: 0.0% (0us) | Total: 1.3% (144.9ms) | Samples: 0

**Called by:**
- `jacobiEigenSymmetric` (109)

**Calls:**
- `some` (109)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (1.1ms) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (2.9ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (1.1ms) | Samples: 0

**Called by:**
- `(anonymous)` (1)

**Calls:**
- `anonymous` (1)

### `vecDot`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:49` | Self: 0.0% (0us) | Total: 1.1% (129.3ms) | Samples: 0

**Called by:**
- `(anonymous)` (96)
- `vecNorm` (2)

**Calls:**
- `assertSameLength` (98)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.1ms) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (5.1ms) | Samples: 0

**Called by:**
- `(module)` (4)

**Calls:**
- `anonymous` (3)
- `get WriteStream` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:594` | Self: 0.0% (0us) | Total: 0.0% (2.6ms) | Samples: 0

**Called by:**
- `runTrial` (2)

**Calls:**
- `isFinite` (2)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:267` | Self: 0.0% (0us) | Total: 0.0% (3.0ms) | Samples: 0

**Called by:**
- `step` (2)

**Calls:**
- `nextHalfOpenUnit` (1)
- `nextHalfOpenUnit` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` | Self: 0.0% (0us) | Total: 0.0% (4.2ms) | Samples: 0

**Called by:**
- `(module)` (2)
- `(module)` (1)
- `(module)` (1)

**Calls:**
- `CMAESOptimizerND` (3)
- `CMAESOptimizerND` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:495` | Self: 0.0% (0us) | Total: 0.3% (41.3ms) | Samples: 0

**Called by:**
- `step` (33)

**Calls:**
- `cloneMatrix` (32)
- `map` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` | Self: 0.0% (0us) | Total: 0.1% (13.1ms) | Samples: 0

**Called by:**
- `(module)` (5)
- `(module)` (3)

**Calls:**
- `step` (3)
- `step` (2)
- `step` (1)
- `step` (1)
- `step` (1)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (1.1ms) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.1ms) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` | Self: 0.0% (0us) | Total: 1.2% (133.7ms) | Samples: 0

**Called by:**
- `runTrial` (101)

**Calls:**
- `matVecMult` (98)
- `matVecMult` (3)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 86.7% | 9.36s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 12.5% | 1.35s | `[native code]` |
| 0.7% | 78.8ms | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
