# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 6.37s | 5011 | 1.0ms | 164 |

**Top 10:** `step` 27.8%, `jacobiEigenSymmetric` 8.5%, `jacobiEigenSymmetric` 8.3%, `compose` 7.8%, `map` 5.9%, `step` 5.6%, `(anonymous)` 4.0%, `sampleGaussianVectorND` 3.3%, `step` 2.7%, `assertSameLength` 2.4%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 27.8% | 1.77s | 28.4% | 1.81s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:579` |
| 8.5% | 547.3ms | 9.2% | 590.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:139` |
| 8.3% | 532.8ms | 9.0% | 573.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` |
| 7.8% | 502.0ms | 9.2% | 588.0ms | `compose` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` |
| 5.9% | 378.8ms | 15.3% | 980.5ms | `map` | `[native code]` |
| 5.6% | 361.4ms | 5.6% | 361.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:615` |
| 4.0% | 257.5ms | 4.0% | 257.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 3.3% | 215.4ms | 3.4% | 221.3ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 2.7% | 177.4ms | 2.7% | 177.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:583` |
| 2.4% | 154.4ms | 2.4% | 154.4ms | `assertSameLength` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:43` |
| 1.9% | 122.1ms | 4.3% | 277.4ms | `some` | `[native code]` |
| 1.7% | 110.8ms | 2.4% | 155.1ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:228` |
| 1.3% | 83.6ms | 1.3% | 83.6ms | `hypot` | `[native code]` |
| 1.0% | 67.0ms | 1.0% | 67.0ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:51` |
| 0.9% | 62.6ms | 0.9% | 62.6ms | `fill` | `[native code]` |
| 0.9% | 59.4ms | 2.9% | 186.7ms | `from` | `[native code]` |
| 0.9% | 57.7ms | 0.9% | 57.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` |
| 0.8% | 55.0ms | 0.9% | 61.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:542` |
| 0.8% | 51.8ms | 0.8% | 51.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:591` |
| 0.7% | 50.2ms | 0.7% | 50.2ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.7% | 47.3ms | 0.7% | 47.3ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:496` |
| 0.6% | 43.8ms | 0.6% | 43.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` |
| 0.6% | 43.8ms | 0.6% | 43.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 0.6% | 43.8ms | 0.8% | 55.0ms | `sort` | `[native code]` |
| 0.6% | 38.7ms | 2.2% | 145.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` |
| 0.5% | 33.5ms | 0.5% | 33.5ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.4% | 27.8ms | 1.1% | 74.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 0.3% | 24.5ms | 0.6% | 42.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.3% | 24.0ms | 1.0% | 64.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:203` |
| 0.3% | 19.5ms | 4.0% | 260.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:512` |
| 0.2% | 17.5ms | 1.0% | 67.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:516` |
| 0.2% | 16.1ms | 0.2% | 16.1ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:264` |
| 0.2% | 12.7ms | 0.2% | 12.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:572` |
| 0.1% | 12.3ms | 0.2% | 13.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:518` |
| 0.1% | 11.4ms | 0.1% | 11.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` |
| 0.1% | 11.2ms | 0.3% | 24.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.1% | 10.4ms | 0.1% | 10.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.1% | 10.0ms | 0.1% | 10.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 0.1% | 9.3ms | 0.1% | 9.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:60` |
| 0.1% | 9.0ms | 0.1% | 9.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 0.1% | 8.2ms | 0.1% | 9.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:619` |
| 0.1% | 8.0ms | 0.1% | 8.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:567` |
| 0.1% | 8.0ms | 0.1% | 8.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.1% | 7.6ms | 0.1% | 7.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:532` |
| 0.1% | 7.6ms | 0.1% | 11.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:571` |
| 0.1% | 7.4ms | 0.1% | 7.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:581` |
| 0.1% | 6.4ms | 0.1% | 6.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:635` |
| 0.1% | 6.4ms | 2.6% | 169.1ms | `forEach` | `[native code]` |
| 0.1% | 6.4ms | 10.3% | 657.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:506` |
| 0.0% | 6.1ms | 0.0% | 6.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:634` |
| 0.0% | 5.9ms | 0.0% | 5.9ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:474` |
| 0.0% | 5.8ms | 0.0% | 5.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:204` |
| 0.0% | 5.7ms | 0.0% | 5.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:621` |
| 0.0% | 5.7ms | 0.3% | 21.0ms | `anonymous` | `[native code]` |
| 0.0% | 5.6ms | 3.5% | 227.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:63` |
| 0.0% | 5.4ms | 0.0% | 5.4ms | `matVecMult` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 5.4ms | 1.0% | 66.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:565` |
| 0.0% | 5.2ms | 5.2% | 336.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:513` |
| 0.0% | 5.0ms | 0.0% | 5.0ms | `reduce` | `[native code]` |
| 0.0% | 5.0ms | 0.2% | 14.4ms | `matVecMult` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:60` |
| 0.0% | 4.9ms | 0.0% | 4.9ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 4.9ms | 0.2% | 18.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.0% | 4.8ms | 0.6% | 40.1ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` |
| 0.0% | 4.6ms | 1.6% | 102.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:514` |
| 0.0% | 4.4ms | 0.0% | 5.5ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:484` |
| 0.0% | 4.1ms | 0.0% | 4.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:165` |
| 0.0% | 4.0ms | 0.0% | 4.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:600` |
| 0.0% | 3.9ms | 0.2% | 13.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:628` |
| 0.0% | 3.8ms | 0.1% | 8.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` |
| 0.0% | 3.6ms | 0.0% | 6.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:555` |
| 0.0% | 3.6ms | 0.0% | 3.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:638` |
| 0.0% | 3.5ms | 0.0% | 3.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:631` |
| 0.0% | 3.4ms | 0.0% | 3.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:181` |
| 0.0% | 3.4ms | 0.0% | 3.4ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.3ms | 0.0% | 3.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:507` |
| 0.0% | 3.2ms | 0.0% | 3.2ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:476` |
| 0.0% | 2.9ms | 0.0% | 2.9ms | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.8ms | 1.2% | 82.6ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:475` |
| 0.0% | 2.8ms | 1.0% | 69.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:515` |
| 0.0% | 2.7ms | 0.0% | 2.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` |
| 0.0% | 2.7ms | 0.2% | 16.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:624` |
| 0.0% | 2.6ms | 0.6% | 39.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:532` |
| 0.0% | 2.6ms | 0.0% | 2.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:644` |
| 0.0% | 2.5ms | 0.0% | 2.5ms | `abs` | `[native code]` |
| 0.0% | 2.5ms | 0.0% | 2.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:514` |
| 0.0% | 2.5ms | 0.0% | 2.5ms | `max` | `[native code]` |
| 0.0% | 2.5ms | 0.0% | 2.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` |
| 0.0% | 2.5ms | 2.4% | 157.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `push` | `[native code]` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:522` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:508` |
| 0.0% | 2.4ms | 0.0% | 3.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:414` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:505` |
| 0.0% | 1.4ms | 21.8% | 1.39s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:594` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:88` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `sqrt` | `[native code]` |
| 0.0% | 1.4ms | 0.1% | 7.2ms | `computeCovariancePowers` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:204` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.4ms | 0.0% | 2.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:551` |
| 0.0% | 1.4ms | 7.8% | 499.8ms | `matVecMult` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:63` |
| 0.0% | 1.4ms | 0.6% | 38.7ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:488` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:268` |
| 0.0% | 1.3ms | 0.0% | 2.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` |
| 0.0% | 1.3ms | 2.6% | 167.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:557` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:545` |
| 0.0% | 1.3ms | 1.7% | 112.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:604` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `computeCovariancePowers` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:199` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:515` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `compose` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:218` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:544` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `computeCovariancePowers` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.1ms | 0.2% | 14.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:552` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:271` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.1ms | 0.7% | 49.7ms | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:169` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:133` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:167` |
| 0.0% | 1.0ms | 0.1% | 6.4ms | `computeCovariancePowers` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:210` |
| 0.0% | 1.0ms | 0.3% | 23.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:180` |
| 0.0% | 1.0ms | 0.0% | 1.0ms | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:423` |
| 0.0% | 1.0ms | 0.0% | 1.0ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:481` |
| 0.0% | 1.0ms | 0.1% | 7.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 99.7% | 6.35s | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 93.8% | 5.98s | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:86` |
| 28.4% | 1.81s | 27.8% | 1.77s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:579` |
| 21.8% | 1.39s | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:594` |
| 15.3% | 980.5ms | 5.9% | 378.8ms | `map` | `[native code]` |
| 10.3% | 657.9ms | 0.1% | 6.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:506` |
| 9.2% | 590.1ms | 8.5% | 547.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:139` |
| 9.2% | 588.0ms | 7.8% | 502.0ms | `compose` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` |
| 9.1% | 583.3ms | 0.0% | 0us | `computeCovariancePowers` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:223` |
| 9.0% | 573.6ms | 8.3% | 532.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` |
| 7.8% | 499.8ms | 0.0% | 1.4ms | `matVecMult` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:63` |
| 5.6% | 361.4ms | 5.6% | 361.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:615` |
| 5.2% | 336.6ms | 0.0% | 5.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:513` |
| 5.1% | 328.4ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` |
| 4.3% | 277.4ms | 1.9% | 122.1ms | `some` | `[native code]` |
| 4.0% | 260.8ms | 0.3% | 19.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:512` |
| 4.0% | 257.5ms | 4.0% | 257.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 3.5% | 227.1ms | 0.0% | 5.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:63` |
| 3.4% | 221.3ms | 3.3% | 215.4ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 2.9% | 186.7ms | 0.9% | 59.4ms | `from` | `[native code]` |
| 2.7% | 177.4ms | 2.7% | 177.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:583` |
| 2.6% | 169.1ms | 0.1% | 6.4ms | `forEach` | `[native code]` |
| 2.6% | 167.8ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 2.4% | 157.6ms | 0.0% | 2.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` |
| 2.4% | 155.2ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 2.4% | 155.1ms | 1.7% | 110.8ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:228` |
| 2.4% | 154.4ms | 2.4% | 154.4ms | `assertSameLength` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:43` |
| 2.4% | 154.4ms | 0.0% | 0us | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:49` |
| 2.2% | 145.4ms | 0.6% | 38.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` |
| 1.7% | 112.6ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:604` |
| 1.6% | 102.5ms | 0.0% | 4.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:514` |
| 1.3% | 85.6ms | 0.0% | 0us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` |
| 1.3% | 83.6ms | 1.3% | 83.6ms | `hypot` | `[native code]` |
| 1.2% | 82.6ms | 0.0% | 2.8ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:475` |
| 1.1% | 74.1ms | 0.4% | 27.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 1.0% | 69.7ms | 0.0% | 2.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:515` |
| 1.0% | 67.9ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:564` |
| 1.0% | 67.7ms | 0.2% | 17.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:516` |
| 1.0% | 67.0ms | 1.0% | 67.0ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:51` |
| 1.0% | 66.9ms | 0.0% | 5.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:565` |
| 1.0% | 64.8ms | 0.3% | 24.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:203` |
| 0.9% | 62.6ms | 0.9% | 62.6ms | `fill` | `[native code]` |
| 0.9% | 61.0ms | 0.8% | 55.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:542` |
| 0.9% | 58.2ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:93` |
| 0.9% | 57.7ms | 0.9% | 57.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` |
| 0.8% | 55.0ms | 0.6% | 43.8ms | `sort` | `[native code]` |
| 0.8% | 51.8ms | 0.8% | 51.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:591` |
| 0.8% | 51.2ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:106` |
| 0.7% | 50.2ms | 0.7% | 50.2ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.7% | 49.7ms | 0.0% | 1.1ms | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 0.7% | 47.3ms | 0.7% | 47.3ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:496` |
| 0.7% | 46.8ms | 0.0% | 0us | `computeCovariancePowers` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:203` |
| 0.6% | 43.8ms | 0.6% | 43.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` |
| 0.6% | 43.8ms | 0.6% | 43.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 0.6% | 42.3ms | 0.3% | 24.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.6% | 40.1ms | 0.0% | 4.8ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` |
| 0.6% | 39.9ms | 0.0% | 2.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:532` |
| 0.6% | 38.7ms | 0.0% | 1.4ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:488` |
| 0.5% | 37.0ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:550` |
| 0.5% | 33.5ms | 0.5% | 33.5ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.4% | 29.6ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:633` |
| 0.3% | 25.2ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:500` |
| 0.3% | 24.9ms | 0.1% | 11.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.3% | 23.0ms | 0.0% | 1.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:180` |
| 0.3% | 21.0ms | 0.0% | 5.7ms | `anonymous` | `[native code]` |
| 0.2% | 18.4ms | 0.0% | 4.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.2% | 16.6ms | 0.0% | 2.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:624` |
| 0.2% | 16.1ms | 0.2% | 16.1ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:264` |
| 0.2% | 14.7ms | 0.0% | 1.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:552` |
| 0.2% | 14.4ms | 0.0% | 5.0ms | `matVecMult` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:60` |
| 0.2% | 14.1ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` |
| 0.2% | 13.6ms | 0.1% | 12.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:518` |
| 0.2% | 13.3ms | 0.0% | 3.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:628` |
| 0.2% | 12.7ms | 0.2% | 12.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:572` |
| 0.1% | 11.4ms | 0.1% | 11.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` |
| 0.1% | 11.1ms | 0.1% | 7.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:571` |
| 0.1% | 10.4ms | 0.1% | 10.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.1% | 10.1ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:625` |
| 0.1% | 10.0ms | 0.1% | 10.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 0.1% | 9.6ms | 0.1% | 8.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:619` |
| 0.1% | 9.6ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` |
| 0.1% | 9.3ms | 0.1% | 9.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:60` |
| 0.1% | 9.1ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.1% | 9.0ms | 0.1% | 9.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 0.1% | 8.9ms | 0.0% | 3.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` |
| 0.1% | 8.0ms | 0.1% | 8.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:567` |
| 0.1% | 8.0ms | 0.1% | 8.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.1% | 7.9ms | 0.0% | 1.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` |
| 0.1% | 7.6ms | 0.1% | 7.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:532` |
| 0.1% | 7.4ms | 0.1% | 7.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:581` |
| 0.1% | 7.2ms | 0.0% | 1.4ms | `computeCovariancePowers` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:204` |
| 0.1% | 6.4ms | 0.1% | 6.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:635` |
| 0.1% | 6.4ms | 0.0% | 1.0ms | `computeCovariancePowers` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:210` |
| 0.0% | 6.1ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 6.1ms | 0.0% | 6.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:634` |
| 0.0% | 6.0ms | 0.0% | 3.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:555` |
| 0.0% | 5.9ms | 0.0% | 5.9ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:474` |
| 0.0% | 5.8ms | 0.0% | 5.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:204` |
| 0.0% | 5.7ms | 0.0% | 5.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:621` |
| 0.0% | 5.7ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:96` |
| 0.0% | 5.7ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.0% | 5.5ms | 0.0% | 4.4ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:484` |
| 0.0% | 5.4ms | 0.0% | 5.4ms | `matVecMult` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 5.1ms | 0.0% | 0us | `computeCovariancePowers` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:209` |
| 0.0% | 5.0ms | 0.0% | 5.0ms | `reduce` | `[native code]` |
| 0.0% | 4.9ms | 0.0% | 4.9ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 4.1ms | 0.0% | 4.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:165` |
| 0.0% | 4.0ms | 0.0% | 4.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:600` |
| 0.0% | 3.6ms | 0.0% | 3.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:638` |
| 0.0% | 3.6ms | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` |
| 0.0% | 3.5ms | 0.0% | 3.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:631` |
| 0.0% | 3.4ms | 0.0% | 3.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:181` |
| 0.0% | 3.4ms | 0.0% | 3.4ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.3ms | 0.0% | 3.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:507` |
| 0.0% | 3.3ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` |
| 0.0% | 3.2ms | 0.0% | 3.2ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:476` |
| 0.0% | 2.9ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:551` |
| 0.0% | 2.9ms | 0.0% | 2.9ms | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.7ms | 0.0% | 2.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` |
| 0.0% | 2.6ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` |
| 0.0% | 2.6ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:533` |
| 0.0% | 2.6ms | 0.0% | 2.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:644` |
| 0.0% | 2.5ms | 0.0% | 2.5ms | `abs` | `[native code]` |
| 0.0% | 2.5ms | 0.0% | 2.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:514` |
| 0.0% | 2.5ms | 0.0% | 2.5ms | `max` | `[native code]` |
| 0.0% | 2.5ms | 0.0% | 2.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `push` | `[native code]` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:522` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:508` |
| 0.0% | 2.2ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 2.2ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:414` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:505` |
| 0.0% | 2.1ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 2.1ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 2.1ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 2.1ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:88` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `sqrt` | `[native code]` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:268` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:557` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:545` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `computeCovariancePowers` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:199` |
| 0.0% | 1.2ms | 0.0% | 0us | `exp` | `[native code]` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:515` |
| 0.0% | 1.2ms | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:266` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `compose` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:218` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:544` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `computeCovariancePowers` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:271` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.1ms | 0.0% | 0us | `internal:streams/operators` | `internal:streams/operators:2` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:169` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:133` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:167` |
| 0.0% | 1.0ms | 0.0% | 1.0ms | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:423` |
| 0.0% | 1.0ms | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 1.0ms | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 1.0ms | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 1.0ms | 0.0% | 1.0ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:481` |

## Function Details

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:579` | Self: 27.8% (1.77s) | Total: 28.4% (1.81s) | Samples: 1401

**Called by:**
- `runTrial` (1430)
- `runTrial` (2)

**Calls:**
- `createZeroMatrix` (28)
- `from` (2)
- `createZeroMatrix` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:139` | Self: 8.5% (547.3ms) | Total: 9.2% (590.1ms) | Samples: 425

**Called by:**
- `step` (458)

**Calls:**
- `hypot` (33)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` | Self: 8.3% (532.8ms) | Total: 9.0% (573.6ms) | Samples: 417

**Called by:**
- `step` (450)

**Calls:**
- `hypot` (33)

### `compose`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` | Self: 7.8% (502.0ms) | Total: 9.2% (588.0ms) | Samples: 385

**Called by:**
- `computeCovariancePowers` (448)
- `sampleGaussianVectorND` (5)

**Calls:**
- `from` (66)
- `createZeroMatrix` (2)

### `map`
`[native code]` | Self: 5.9% (378.8ms) | Total: 15.3% (980.5ms) | Samples: 302

**Called by:**
- `matVecMult` (392)
- `step` (77)
- `cloneMatrix` (67)
- `step` (54)
- `step` (53)
- `(anonymous)` (49)
- `step` (11)
- `step` (11)
- `(anonymous)` (11)
- `jacobiEigenSymmetric` (9)
- `jacobiEigenSymmetric` (7)
- `step` (7)
- `step` (6)
- `jacobiEigenSymmetric` (5)
- `computeCovariancePowers` (4)
- `computeCovariancePowers` (4)
- `step` (3)
- `step` (2)
- `alignProjectionBasis` (1)

**Calls:**
- `(anonymous)` (200)
- `(anonymous)` (177)
- `(anonymous)` (53)
- `(anonymous)` (35)
- `abs` (2)
- `(anonymous)` (2)
- `(anonymous)` (1)
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:615` | Self: 5.6% (361.4ms) | Total: 5.6% (361.4ms) | Samples: 286

**Called by:**
- `runTrial` (285)
- `runTrial` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 4.0% (257.5ms) | Total: 4.0% (257.5ms) | Samples: 201

**Called by:**
- `map` (200)
- `some` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 3.3% (215.4ms) | Total: 3.4% (221.3ms) | Samples: 172

**Called by:**
- `step` (177)

**Calls:**
- `compose` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:583` | Self: 2.7% (177.4ms) | Total: 2.7% (177.4ms) | Samples: 142

**Called by:**
- `runTrial` (142)

### `assertSameLength`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:43` | Self: 2.4% (154.4ms) | Total: 2.4% (154.4ms) | Samples: 119

**Called by:**
- `vecDot` (119)

### `some`
`[native code]` | Self: 1.9% (122.1ms) | Total: 4.3% (277.4ms) | Samples: 98

**Called by:**
- `projectTo3D` (64)
- `validateSquareFiniteMatrix` (39)
- `(anonymous)` (37)
- `computeCovariancePowers` (37)
- `(anonymous)` (32)
- `matVecMult` (7)
- `computeCovariancePowers` (5)

**Calls:**
- `(anonymous)` (59)
- `(anonymous)` (51)
- `(anonymous)` (7)
- `(anonymous)` (5)
- `(anonymous)` (1)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:228` | Self: 1.7% (110.8ms) | Total: 2.4% (155.1ms) | Samples: 88

**Called by:**
- `step` (123)

**Calls:**
- `from` (33)
- `createZeroMatrix` (2)

### `hypot`
`[native code]` | Self: 1.3% (83.6ms) | Total: 1.3% (83.6ms) | Samples: 66

**Called by:**
- `jacobiEigenSymmetric` (33)
- `jacobiEigenSymmetric` (33)

### `vecDot`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:51` | Self: 1.0% (67.0ms) | Total: 1.0% (67.0ms) | Samples: 54

**Called by:**
- `(anonymous)` (54)

### `fill`
`[native code]` | Self: 0.9% (62.6ms) | Total: 0.9% (62.6ms) | Samples: 49

**Called by:**
- `from` (48)
- `step` (1)

### `from`
`[native code]` | Self: 0.9% (59.4ms) | Total: 2.9% (186.7ms) | Samples: 47

**Called by:**
- `compose` (66)
- `reconstructSymmetric` (33)
- `createZeroMatrix` (28)
- `jacobiEigenSymmetric` (15)
- `jacobiEigenSymmetric` (3)
- `step` (2)
- `exp` (1)

**Calls:**
- `fill` (48)
- `(anonymous)` (46)
- `(anonymous)` (7)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` | Self: 0.9% (57.7ms) | Total: 0.9% (57.7ms) | Samples: 46

**Called by:**
- `from` (46)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:542` | Self: 0.8% (55.0ms) | Total: 0.9% (61.0ms) | Samples: 43

**Called by:**
- `runTrial` (48)

**Calls:**
- `createZeroVector` (4)
- `fill` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:591` | Self: 0.8% (51.8ms) | Total: 0.8% (51.8ms) | Samples: 38

**Called by:**
- `runTrial` (38)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` | Self: 0.7% (50.2ms) | Total: 0.7% (50.2ms) | Samples: 41

**Called by:**
- `step` (41)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:496` | Self: 0.7% (47.3ms) | Total: 0.7% (47.3ms) | Samples: 38

**Called by:**
- `step` (38)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` | Self: 0.6% (43.8ms) | Total: 0.6% (43.8ms) | Samples: 35

**Called by:**
- `map` (35)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` | Self: 0.6% (43.8ms) | Total: 0.6% (43.8ms) | Samples: 35

**Called by:**
- `step` (35)

### `sort`
`[native code]` | Self: 0.6% (43.8ms) | Total: 0.8% (55.0ms) | Samples: 32

**Called by:**
- `step` (27)
- `jacobiEigenSymmetric` (14)

**Calls:**
- `(anonymous)` (6)
- `(anonymous)` (3)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` | Self: 0.6% (38.7ms) | Total: 2.2% (145.4ms) | Samples: 31

**Called by:**
- `forEach` (117)

**Calls:**
- `projectTo3D` (65)
- `projectTo3D` (13)
- `projectTo3D` (4)
- `projectTo3D` (3)
- `projectTo3D` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.5% (33.5ms) | Total: 0.5% (33.5ms) | Samples: 27

**Called by:**
- `(anonymous)` (13)
- `step` (8)
- `step` (6)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` | Self: 0.4% (27.8ms) | Total: 1.1% (74.1ms) | Samples: 22

**Called by:**
- `some` (59)

**Calls:**
- `some` (37)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.3% (24.5ms) | Total: 0.6% (42.3ms) | Samples: 20

**Called by:**
- `step` (35)

**Calls:**
- `from` (15)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:203` | Self: 0.3% (24.0ms) | Total: 1.0% (64.8ms) | Samples: 19

**Called by:**
- `some` (51)

**Calls:**
- `some` (32)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:512` | Self: 0.3% (19.5ms) | Total: 4.0% (260.8ms) | Samples: 16

**Called by:**
- `runTrial` (209)

**Calls:**
- `sampleGaussianVectorND` (177)
- `sampleGaussianVectorND` (13)
- `sampleGaussianVectorND` (1)
- `sampleGaussianVectorND` (1)
- `sampleGaussianVectorND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:516` | Self: 0.2% (17.5ms) | Total: 1.0% (67.7ms) | Samples: 14

**Called by:**
- `runTrial` (55)

**Calls:**
- `ellipsoidObjective` (41)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:264` | Self: 0.2% (16.1ms) | Total: 0.2% (16.1ms) | Samples: 13

**Called by:**
- `step` (13)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:572` | Self: 0.2% (12.7ms) | Total: 0.2% (12.7ms) | Samples: 10

**Called by:**
- `runTrial` (10)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:518` | Self: 0.1% (12.3ms) | Total: 0.2% (13.6ms) | Samples: 9

**Called by:**
- `runTrial` (10)

**Calls:**
- `push` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` | Self: 0.1% (11.4ms) | Total: 0.1% (11.4ms) | Samples: 9

**Called by:**
- `step` (9)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` | Self: 0.1% (11.2ms) | Total: 0.3% (24.9ms) | Samples: 9

**Called by:**
- `step` (20)

**Calls:**
- `map` (9)
- `max` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` | Self: 0.1% (10.4ms) | Total: 0.1% (10.4ms) | Samples: 8

**Called by:**
- `runTrial` (8)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` | Self: 0.1% (10.0ms) | Total: 0.1% (10.0ms) | Samples: 8

**Called by:**
- `runTrial` (8)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:60` | Self: 0.1% (9.3ms) | Total: 0.1% (9.3ms) | Samples: 7

**Called by:**
- `some` (7)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` | Self: 0.1% (9.0ms) | Total: 0.1% (9.0ms) | Samples: 5

**Called by:**
- `step` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:619` | Self: 0.1% (8.2ms) | Total: 0.1% (9.6ms) | Samples: 7

**Called by:**
- `runTrial` (8)

**Calls:**
- `radius` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:567` | Self: 0.1% (8.0ms) | Total: 0.1% (8.0ms) | Samples: 7

**Called by:**
- `runTrial` (7)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.1% (8.0ms) | Total: 0.1% (8.0ms) | Samples: 7

**Called by:**
- `from` (7)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:532` | Self: 0.1% (7.6ms) | Total: 0.1% (7.6ms) | Samples: 6

**Called by:**
- `sort` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:571` | Self: 0.1% (7.6ms) | Total: 0.1% (11.1ms) | Samples: 6

**Called by:**
- `runTrial` (9)

**Calls:**
- `vecDot` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:581` | Self: 0.1% (7.4ms) | Total: 0.1% (7.4ms) | Samples: 6

**Called by:**
- `runTrial` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:635` | Self: 0.1% (6.4ms) | Total: 0.1% (6.4ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `forEach`
`[native code]` | Self: 0.1% (6.4ms) | Total: 2.6% (169.1ms) | Samples: 5

**Called by:**
- `step` (134)
- `step` (2)

**Calls:**
- `(anonymous)` (117)
- `(anonymous)` (14)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:506` | Self: 0.1% (6.4ms) | Total: 10.3% (657.9ms) | Samples: 5

**Called by:**
- `runTrial` (507)
- `runTrial` (1)

**Calls:**
- `computeCovariancePowers` (449)
- `computeCovariancePowers` (37)
- `computeCovariancePowers` (6)
- `computeCovariancePowers` (5)
- `computeCovariancePowers` (4)
- `computeCovariancePowers` (1)
- `computeCovariancePowers` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:634` | Self: 0.0% (6.1ms) | Total: 0.0% (6.1ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:474` | Self: 0.0% (5.9ms) | Total: 0.0% (5.9ms) | Samples: 5

**Called by:**
- `(anonymous)` (4)
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:204` | Self: 0.0% (5.8ms) | Total: 0.0% (5.8ms) | Samples: 5

**Called by:**
- `some` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:621` | Self: 0.0% (5.7ms) | Total: 0.0% (5.7ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `anonymous`
`[native code]` | Self: 0.0% (5.7ms) | Total: 0.3% (21.0ms) | Samples: 5

**Called by:**
- `(anonymous)` (3)
- `internal:fs/streams` (2)
- `node:fs/promises` (2)
- `get WriteStream` (2)
- `node:stream` (2)
- `internal:stream` (2)
- `node:fs` (2)
- `internal:streams/operators` (1)
- `internal:streams/compose` (1)
- `internal:streams/duplex` (1)
- `internal:streams/pipeline` (1)

**Calls:**
- `internal:fs/streams` (2)
- `node:fs/promises` (2)
- `node:stream` (2)
- `internal:stream` (2)
- `node:fs` (2)
- `internal:streams/operators` (1)
- `internal:streams/compose` (1)
- `internal:streams/pipeline` (1)
- `internal:streams/duplex` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:63` | Self: 0.0% (5.6ms) | Total: 3.5% (227.1ms) | Samples: 4

**Called by:**
- `map` (177)

**Calls:**
- `vecDot` (119)
- `vecDot` (54)

### `matVecMult`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (5.4ms) | Total: 0.0% (5.4ms) | Samples: 4

**Called by:**
- `step` (4)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:565` | Self: 0.0% (5.4ms) | Total: 1.0% (66.9ms) | Samples: 4

**Called by:**
- `map` (53)

**Calls:**
- `map` (49)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:513` | Self: 0.0% (5.2ms) | Total: 5.2% (336.6ms) | Samples: 4

**Called by:**
- `runTrial` (261)
- `runTrial` (1)

**Calls:**
- `matVecMult` (245)
- `matVecMult` (6)
- `matVecMult` (4)
- `map` (3)

### `reduce`
`[native code]` | Self: 0.0% (5.0ms) | Total: 0.0% (5.0ms) | Samples: 4

**Called by:**
- `step` (4)

### `matVecMult`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:60` | Self: 0.0% (5.0ms) | Total: 0.2% (14.4ms) | Samples: 4

**Called by:**
- `step` (6)
- `step` (5)

**Calls:**
- `some` (7)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (4.9ms) | Total: 0.0% (4.9ms) | Samples: 4

**Called by:**
- `step` (4)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` | Self: 0.0% (4.9ms) | Total: 0.2% (18.4ms) | Samples: 4

**Called by:**
- `forEach` (14)
- `map` (1)

**Calls:**
- `map` (11)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` | Self: 0.0% (4.8ms) | Total: 0.6% (40.1ms) | Samples: 4

**Called by:**
- `step` (28)
- `compose` (2)
- `reconstructSymmetric` (2)

**Calls:**
- `from` (28)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:514` | Self: 0.0% (4.6ms) | Total: 1.6% (102.5ms) | Samples: 4

**Called by:**
- `runTrial` (81)

**Calls:**
- `map` (77)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:484` | Self: 0.0% (4.4ms) | Total: 0.0% (5.5ms) | Samples: 4

**Called by:**
- `(anonymous)` (3)
- `step` (1)
- `step` (1)

**Calls:**
- `coordinate` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:165` | Self: 0.0% (4.1ms) | Total: 0.0% (4.1ms) | Samples: 3

**Called by:**
- `step` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:600` | Self: 0.0% (4.0ms) | Total: 0.0% (4.0ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:628` | Self: 0.0% (3.9ms) | Total: 0.2% (13.3ms) | Samples: 3

**Called by:**
- `runTrial` (10)

**Calls:**
- `map` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` | Self: 0.0% (3.8ms) | Total: 0.1% (8.9ms) | Samples: 3

**Called by:**
- `runTrial` (7)

**Calls:**
- `reduce` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:555` | Self: 0.0% (3.6ms) | Total: 0.0% (6.0ms) | Samples: 3

**Called by:**
- `runTrial` (5)

**Calls:**
- `vecNorm` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:638` | Self: 0.0% (3.6ms) | Total: 0.0% (3.6ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:631` | Self: 0.0% (3.5ms) | Total: 0.0% (3.5ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:181` | Self: 0.0% (3.4ms) | Total: 0.0% (3.4ms) | Samples: 3

**Called by:**
- `sort` (3)

### `vecDot`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (3.4ms) | Total: 0.0% (3.4ms) | Samples: 3

**Called by:**
- `step` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:507` | Self: 0.0% (3.3ms) | Total: 0.0% (3.3ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:476` | Self: 0.0% (3.2ms) | Total: 0.0% (3.2ms) | Samples: 3

**Called by:**
- `(anonymous)` (1)
- `step` (1)
- `step` (1)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (2.9ms) | Total: 0.0% (2.9ms) | Samples: 2

**Called by:**
- `step` (2)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:475` | Self: 0.0% (2.8ms) | Total: 1.2% (82.6ms) | Samples: 2

**Called by:**
- `(anonymous)` (65)
- `step` (1)

**Calls:**
- `some` (64)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:515` | Self: 0.0% (2.8ms) | Total: 1.0% (69.7ms) | Samples: 2

**Called by:**
- `runTrial` (55)

**Calls:**
- `map` (53)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` | Self: 0.0% (2.7ms) | Total: 0.0% (2.7ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:624` | Self: 0.0% (2.7ms) | Total: 0.2% (16.6ms) | Samples: 2

**Called by:**
- `runTrial` (13)

**Calls:**
- `projectTo3D` (8)
- `projectTo3D` (1)
- `projectTo3D` (1)
- `projectTo3D` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:532` | Self: 0.0% (2.6ms) | Total: 0.6% (39.9ms) | Samples: 2

**Called by:**
- `runTrial` (29)

**Calls:**
- `sort` (27)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:644` | Self: 0.0% (2.6ms) | Total: 0.0% (2.6ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `abs`
`[native code]` | Self: 0.0% (2.5ms) | Total: 0.0% (2.5ms) | Samples: 2

**Called by:**
- `map` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:514` | Self: 0.0% (2.5ms) | Total: 0.0% (2.5ms) | Samples: 2

**Called by:**
- `map` (2)

### `max`
`[native code]` | Self: 0.0% (2.5ms) | Total: 0.0% (2.5ms) | Samples: 2

**Called by:**
- `jacobiEigenSymmetric` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` | Self: 0.0% (2.5ms) | Total: 0.0% (2.5ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` | Self: 0.0% (2.5ms) | Total: 2.4% (157.6ms) | Samples: 2

**Called by:**
- `runTrial` (125)

**Calls:**
- `reconstructSymmetric` (123)

### `push`
`[native code]` | Self: 0.0% (2.4ms) | Total: 0.0% (2.4ms) | Samples: 2

**Called by:**
- `step` (1)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:522` | Self: 0.0% (2.4ms) | Total: 0.0% (2.4ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `vecNorm`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (2.4ms) | Total: 0.0% (2.4ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:508` | Self: 0.0% (2.4ms) | Total: 0.0% (2.4ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` | Self: 0.0% (2.4ms) | Total: 0.0% (3.6ms) | Samples: 2

**Called by:**
- `runTrial` (3)

**Calls:**
- `push` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:414` | Self: 0.0% (2.2ms) | Total: 0.0% (2.2ms) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:505` | Self: 0.0% (2.2ms) | Total: 0.0% (2.2ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:594` | Self: 0.0% (1.4ms) | Total: 21.8% (1.39s) | Samples: 1

**Called by:**
- `runTrial` (1088)
- `runTrial` (3)

**Calls:**
- `jacobiEigenSymmetric` (458)
- `jacobiEigenSymmetric` (450)
- `jacobiEigenSymmetric` (41)
- `jacobiEigenSymmetric` (35)
- `jacobiEigenSymmetric` (35)
- `jacobiEigenSymmetric` (20)
- `jacobiEigenSymmetric` (18)
- `jacobiEigenSymmetric` (9)
- `jacobiEigenSymmetric` (7)
- `jacobiEigenSymmetric` (5)
- `jacobiEigenSymmetric` (5)
- `jacobiEigenSymmetric` (3)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:88` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 1

**Called by:**
- `jacobiEigenSymmetric` (1)

### `sqrt`
`[native code]` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 1

**Called by:**
- `step` (1)

### `computeCovariancePowers`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:204` | Self: 0.0% (1.4ms) | Total: 0.1% (7.2ms) | Samples: 1

**Called by:**
- `step` (6)

**Calls:**
- `some` (5)

### `radius`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:551` | Self: 0.0% (1.4ms) | Total: 0.0% (2.9ms) | Samples: 1

**Called by:**
- `runTrial` (2)

**Calls:**
- `sqrt` (1)

### `matVecMult`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:63` | Self: 0.0% (1.4ms) | Total: 7.8% (499.8ms) | Samples: 1

**Called by:**
- `step` (245)
- `step` (118)
- `step` (30)

**Calls:**
- `map` (392)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:488` | Self: 0.0% (1.4ms) | Total: 0.6% (38.7ms) | Samples: 1

**Called by:**
- `step` (30)

**Calls:**
- `cloneMatrix` (28)
- `map` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:268` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` | Self: 0.0% (1.3ms) | Total: 0.0% (2.6ms) | Samples: 1

**Called by:**
- `runTrial` (2)

**Calls:**
- `exp` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` | Self: 0.0% (1.3ms) | Total: 2.6% (167.8ms) | Samples: 1

**Called by:**
- `runTrial` (135)

**Calls:**
- `forEach` (134)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:557` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:545` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:604` | Self: 0.0% (1.3ms) | Total: 1.7% (112.6ms) | Samples: 1

**Called by:**
- `runTrial` (88)

**Calls:**
- `alignProjectionBasis` (38)
- `alignProjectionBasis` (30)
- `alignProjectionBasis` (19)

### `computeCovariancePowers`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:199` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 1

**Called by:**
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:515` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 1

**Called by:**
- `map` (1)

### `nextOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 1

**Called by:**
- `sampleGaussianVectorND` (1)

### `compose`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:218` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 1

**Called by:**
- `computeCovariancePowers` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:544` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 1

**Called by:**
- `runTrial` (1)

### `computeCovariancePowers`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.1ms) | Total: 0.0% (1.1ms) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:552` | Self: 0.0% (1.1ms) | Total: 0.2% (14.7ms) | Samples: 1

**Called by:**
- `runTrial` (12)

**Calls:**
- `map` (11)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:271` | Self: 0.0% (1.1ms) | Total: 0.0% (1.1ms) | Samples: 1

**Called by:**
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.1ms) | Total: 0.0% (1.1ms) | Samples: 1

**Called by:**
- `step` (1)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` | Self: 0.0% (1.1ms) | Total: 0.7% (49.7ms) | Samples: 1

**Called by:**
- `jacobiEigenSymmetric` (40)

**Calls:**
- `some` (39)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.1ms) | Total: 0.0% (1.1ms) | Samples: 1

**Called by:**
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:169` | Self: 0.0% (1.1ms) | Total: 0.0% (1.1ms) | Samples: 1

**Called by:**
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:133` | Self: 0.0% (1.1ms) | Total: 0.0% (1.1ms) | Samples: 1

**Called by:**
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:167` | Self: 0.0% (1.1ms) | Total: 0.0% (1.1ms) | Samples: 1

**Called by:**
- `step` (1)

### `computeCovariancePowers`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:210` | Self: 0.0% (1.0ms) | Total: 0.1% (6.4ms) | Samples: 1

**Called by:**
- `step` (5)

**Calls:**
- `map` (4)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:180` | Self: 0.0% (1.0ms) | Total: 0.3% (23.0ms) | Samples: 1

**Called by:**
- `step` (18)

**Calls:**
- `sort` (14)
- `from` (3)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:423` | Self: 0.0% (1.0ms) | Total: 0.0% (1.0ms) | Samples: 1

**Called by:**
- `runTrial` (1)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:481` | Self: 0.0% (1.0ms) | Total: 0.0% (1.0ms) | Samples: 1

**Called by:**
- `projectTo3D` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` | Self: 0.0% (1.0ms) | Total: 0.1% (7.9ms) | Samples: 1

**Called by:**
- `runTrial` (7)

**Calls:**
- `map` (6)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` | Self: 0.0% (0us) | Total: 99.7% (6.35s) | Samples: 0

**Called by:**
- `(module)` (4695)
- `(module)` (254)
- `(module)` (47)

**Calls:**
- `step` (1430)
- `step` (1088)
- `step` (507)
- `step` (285)
- `step` (261)
- `step` (209)
- `step` (142)
- `step` (135)
- `step` (125)
- `step` (123)
- `step` (88)
- `step` (81)
- `step` (55)
- `step` (55)
- `step` (54)
- `step` (48)
- `step` (38)
- `step` (30)
- `step` (29)
- `step` (24)
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

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` | Self: 0.0% (0us) | Total: 1.3% (85.6ms) | Samples: 0

**Called by:**
- `alignProjectionBasis` (28)
- `step` (20)
- `alignProjectionBasis` (19)

**Calls:**
- `map` (67)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (1.0ms) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `computeCovariancePowers`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:203` | Self: 0.0% (0us) | Total: 0.7% (46.8ms) | Samples: 0

**Called by:**
- `step` (37)

**Calls:**
- `some` (37)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (1.0ms) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:633` | Self: 0.0% (0us) | Total: 0.4% (29.6ms) | Samples: 0

**Called by:**
- `runTrial` (24)

**Calls:**
- `cloneMatrix` (20)
- `map` (2)
- `cloneMatrix` (2)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (2.2ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` | Self: 0.0% (0us) | Total: 0.1% (9.1ms) | Samples: 0

**Called by:**
- `step` (7)

**Calls:**
- `map` (7)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (2.1ms) | Samples: 0

**Called by:**
- `(anonymous)` (2)

**Calls:**
- `anonymous` (2)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (5.7ms) | Samples: 0

**Called by:**
- `(module)` (5)

**Calls:**
- `anonymous` (3)
- `get WriteStream` (2)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (2.2ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` | Self: 0.0% (0us) | Total: 5.1% (328.4ms) | Samples: 0

**Calls:**
- `runTrial` (254)
- `runTrial` (2)
- `runTrial` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:106` | Self: 0.0% (0us) | Total: 0.8% (51.2ms) | Samples: 0

**Called by:**
- `step` (41)

**Calls:**
- `validateSquareFiniteMatrix` (40)
- `validateSquareFiniteMatrix` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:533` | Self: 0.0% (0us) | Total: 0.0% (2.6ms) | Samples: 0

**Called by:**
- `runTrial` (2)

**Calls:**
- `forEach` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` | Self: 0.0% (0us) | Total: 0.0% (6.1ms) | Samples: 0

**Called by:**
- `step` (5)

**Calls:**
- `map` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:550` | Self: 0.0% (0us) | Total: 0.5% (37.0ms) | Samples: 0

**Called by:**
- `runTrial` (30)

**Calls:**
- `matVecMult` (30)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (2.1ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (1.0ms) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `exp`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.2ms) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `from` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` | Self: 0.0% (0us) | Total: 2.4% (155.2ms) | Samples: 0

**Called by:**
- `runTrial` (123)

**Calls:**
- `matVecMult` (118)
- `matVecMult` (5)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (2.1ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:500` | Self: 0.0% (0us) | Total: 0.3% (25.2ms) | Samples: 0

**Called by:**
- `step` (19)

**Calls:**
- `cloneMatrix` (19)

### `computeCovariancePowers`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:223` | Self: 0.0% (0us) | Total: 9.1% (583.3ms) | Samples: 0

**Called by:**
- `step` (449)

**Calls:**
- `compose` (448)
- `compose` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:86` | Self: 0.0% (0us) | Total: 93.8% (5.98s) | Samples: 0

**Calls:**
- `runTrial` (4695)
- `runTrial` (6)
- `runTrial` (1)

### `internal:streams/operators`
`internal:streams/operators:2` | Self: 0.0% (0us) | Total: 0.0% (1.1ms) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `computeCovariancePowers`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:209` | Self: 0.0% (0us) | Total: 0.0% (5.1ms) | Samples: 0

**Called by:**
- `step` (4)

**Calls:**
- `map` (4)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (2.1ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` | Self: 0.0% (0us) | Total: 0.0% (3.3ms) | Samples: 0

**Called by:**
- `(module)` (1)
- `(module)` (1)

**Calls:**
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:96` | Self: 0.0% (0us) | Total: 0.0% (5.7ms) | Samples: 0

**Calls:**
- `(anonymous)` (5)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` | Self: 0.0% (0us) | Total: 0.1% (9.6ms) | Samples: 0

**Called by:**
- `(module)` (6)
- `(module)` (2)

**Calls:**
- `step` (3)
- `step` (2)
- `step` (1)
- `step` (1)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:625` | Self: 0.0% (0us) | Total: 0.1% (10.1ms) | Samples: 0

**Called by:**
- `runTrial` (9)

**Calls:**
- `projectTo3D` (6)
- `projectTo3D` (1)
- `projectTo3D` (1)
- `projectTo3D` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:93` | Self: 0.0% (0us) | Total: 0.9% (58.2ms) | Samples: 0

**Calls:**
- `runTrial` (47)

### `vecDot`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:49` | Self: 0.0% (0us) | Total: 2.4% (154.4ms) | Samples: 0

**Called by:**
- `(anonymous)` (119)

**Calls:**
- `assertSameLength` (119)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:266` | Self: 0.0% (0us) | Total: 0.0% (1.2ms) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `nextOpenUnit` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` | Self: 0.0% (0us) | Total: 0.2% (14.1ms) | Samples: 0

**Called by:**
- `runTrial` (11)

**Calls:**
- `map` (11)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:564` | Self: 0.0% (0us) | Total: 1.0% (67.9ms) | Samples: 0

**Called by:**
- `runTrial` (54)

**Calls:**
- `map` (54)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 87.0% | 5.54s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 12.1% | 776.8ms | `[native code]` |
| 0.7% | 50.2ms | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
