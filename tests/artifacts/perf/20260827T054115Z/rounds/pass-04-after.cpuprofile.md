# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 9.88s | 15315 | 500us | 165 |

**Top 10:** `jacobiEigenSymmetric` 21.5%, `jacobiEigenSymmetric` 20.3%, `step` 17.7%, `transformFromEigenCoordinates` 4.5%, `reconstructSymmetric` 4.0%, `whitenWithEigensystem` 3.5%, `step` 3.3%, `whitenWithEigensystem` 2.3%, `hypot` 2.1%, `map` 2.0%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 21.5% | 2.13s | 22.6% | 2.24s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:144` |
| 20.3% | 2.01s | 21.3% | 2.11s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 17.7% | 1.75s | 17.7% | 1.75s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:641` |
| 4.5% | 453.3ms | 4.7% | 470.6ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:252` |
| 4.0% | 397.6ms | 4.4% | 440.4ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:233` |
| 3.5% | 347.3ms | 3.5% | 351.0ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:274` |
| 3.3% | 330.0ms | 3.8% | 380.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:634` |
| 2.3% | 228.0ms | 2.3% | 233.3ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:267` |
| 2.1% | 208.6ms | 2.1% | 208.6ms | `hypot` | `[native code]` |
| 2.0% | 205.8ms | 4.3% | 434.8ms | `map` | `[native code]` |
| 1.8% | 184.5ms | 1.8% | 184.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` |
| 1.7% | 172.4ms | 1.7% | 172.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` |
| 1.5% | 157.4ms | 1.5% | 157.4ms | `fill` | `[native code]` |
| 1.2% | 125.6ms | 2.0% | 206.8ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.1% | 116.1ms | 1.1% | 116.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:650` |
| 0.9% | 94.3ms | 0.9% | 94.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.9% | 93.5ms | 0.9% | 93.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` |
| 0.8% | 84.3ms | 0.8% | 84.3ms | `every` | `[native code]` |
| 0.7% | 73.9ms | 0.9% | 90.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` |
| 0.5% | 52.9ms | 0.5% | 52.9ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:547` |
| 0.5% | 50.4ms | 1.2% | 126.2ms | `from` | `[native code]` |
| 0.4% | 47.2ms | 0.8% | 79.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:192` |
| 0.4% | 44.9ms | 1.3% | 134.9ms | `some` | `[native code]` |
| 0.3% | 37.7ms | 0.3% | 37.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` |
| 0.3% | 37.1ms | 1.4% | 146.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:671` |
| 0.3% | 35.5ms | 0.4% | 44.0ms | `sort` | `[native code]` |
| 0.3% | 34.8ms | 0.3% | 34.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:594` |
| 0.2% | 28.1ms | 0.2% | 28.7ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:305` |
| 0.2% | 27.7ms | 0.7% | 73.3ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.2% | 26.5ms | 0.2% | 26.5ms | `Float64Array` | `[native code]` |
| 0.2% | 20.7ms | 0.2% | 20.7ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.1% | 17.6ms | 0.1% | 17.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:192` |
| 0.1% | 17.2ms | 0.1% | 17.2ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:20` |
| 0.1% | 11.5ms | 0.1% | 11.5ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:254` |
| 0.1% | 11.4ms | 0.1% | 11.4ms | `push` | `[native code]` |
| 0.0% | 9.8ms | 0.8% | 83.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` |
| 0.0% | 9.6ms | 0.0% | 9.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:642` |
| 0.0% | 9.1ms | 0.0% | 9.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:627` |
| 0.0% | 8.0ms | 0.9% | 93.0ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:525` |
| 0.0% | 7.5ms | 0.0% | 7.5ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:255` |
| 0.0% | 6.7ms | 99.4% | 9.83s | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 0.0% | 6.1ms | 0.0% | 6.8ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:535` |
| 0.0% | 5.9ms | 0.0% | 5.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:685` |
| 0.0% | 5.7ms | 0.0% | 5.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 5.6ms | 2.5% | 253.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 0.0% | 5.3ms | 0.0% | 5.3ms | `abs` | `[native code]` |
| 0.0% | 5.2ms | 0.1% | 10.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:626` |
| 0.0% | 5.2ms | 0.0% | 5.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:661` |
| 0.0% | 5.1ms | 0.0% | 5.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 5.0ms | 0.7% | 76.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:565` |
| 0.0% | 4.9ms | 0.0% | 4.9ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 4.5ms | 0.0% | 7.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:600` |
| 0.0% | 4.4ms | 0.0% | 4.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:568` |
| 0.0% | 3.9ms | 0.2% | 21.7ms | `anonymous` | `[native code]` |
| 0.0% | 3.7ms | 0.1% | 15.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` |
| 0.0% | 3.5ms | 0.8% | 82.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:564` |
| 0.0% | 3.3ms | 0.0% | 3.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:683` |
| 0.0% | 3.2ms | 0.0% | 3.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:698` |
| 0.0% | 3.2ms | 0.0% | 3.2ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.2ms | 0.0% | 3.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:699` |
| 0.0% | 3.0ms | 0.5% | 57.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` |
| 0.0% | 2.9ms | 0.0% | 2.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:708` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:618` |
| 0.0% | 2.6ms | 0.0% | 2.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:582` |
| 0.0% | 2.0ms | 0.2% | 21.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:582` |
| 0.0% | 1.9ms | 0.0% | 3.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` |
| 0.0% | 1.9ms | 0.0% | 6.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:692` |
| 0.0% | 1.9ms | 0.0% | 2.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:687` |
| 0.0% | 1.8ms | 4.4% | 442.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:658` |
| 0.0% | 1.8ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:638` |
| 0.0% | 1.7ms | 4.9% | 492.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.0% | 1.6ms | 0.0% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:709` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `reduce` | `[native code]` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:702` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:158` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:170` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:572` |
| 0.0% | 1.1ms | 0.6% | 66.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 754us | 0.0% | 754us | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:271` |
| 0.0% | 753us | 0.0% | 753us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:191` |
| 0.0% | 741us | 0.0% | 6.3ms | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.0% | 727us | 0.0% | 727us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:557` |
| 0.0% | 722us | 0.4% | 44.0ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` |
| 0.0% | 712us | 0.0% | 712us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 710us | 0.0% | 710us | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:51` |
| 0.0% | 696us | 0.0% | 696us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:485` |
| 0.0% | 692us | 0.0% | 692us | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 690us | 0.0% | 690us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` |
| 0.0% | 689us | 0.0% | 5.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:603` |
| 0.0% | 678us | 1.5% | 155.8ms | `forEach` | `[native code]` |
| 0.0% | 669us | 0.0% | 669us | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 650us | 0.0% | 650us | `filter` | `[native code]` |
| 0.0% | 644us | 0.0% | 5.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:188` |
| 0.0% | 639us | 0.0% | 639us | `max` | `[native code]` |
| 0.0% | 626us | 0.0% | 626us | `createSafeIterator` | `internal:primordials:3` |
| 0.0% | 618us | 0.0% | 618us | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 617us | 0.2% | 28.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:185` |
| 0.0% | 616us | 0.0% | 616us | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 610us | 0.6% | 67.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:106` |
| 0.0% | 609us | 0.0% | 609us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:471` |
| 0.0% | 604us | 0.0% | 604us | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 592us | 0.0% | 5.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 0.0% | 575us | 0.0% | 575us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:461` |
| 0.0% | 572us | 0.0% | 572us | `node:path` | `node:path:23` |
| 0.0% | 567us | 0.0% | 8.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` |
| 0.0% | 564us | 0.0% | 564us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:50` |
| 0.0% | 558us | 1.5% | 155.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:669` |
| 0.0% | 557us | 0.0% | 557us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 553us | 0.0% | 553us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:251` |
| 0.0% | 532us | 0.0% | 532us | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:527` |
| 0.0% | 528us | 0.0% | 528us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:152` |
| 0.0% | 524us | 0.0% | 2.6ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:526` |
| 0.0% | 519us | 0.0% | 519us | `write` | `[native code]` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 99.4% | 9.83s | 0.0% | 6.7ms | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 93.3% | 9.22s | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` |
| 47.1% | 4.65s | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:657` |
| 22.6% | 2.24s | 21.5% | 2.13s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:144` |
| 21.3% | 2.11s | 20.3% | 2.01s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 17.7% | 1.75s | 17.7% | 1.75s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:641` |
| 6.6% | 655.1ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` |
| 5.0% | 503.3ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:621` |
| 4.9% | 492.0ms | 0.0% | 1.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 4.7% | 470.6ms | 4.5% | 453.3ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:252` |
| 4.4% | 442.3ms | 0.0% | 1.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:658` |
| 4.4% | 440.4ms | 4.0% | 397.6ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:233` |
| 4.3% | 434.8ms | 2.0% | 205.8ms | `map` | `[native code]` |
| 3.8% | 380.1ms | 3.3% | 330.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:634` |
| 3.5% | 351.0ms | 3.5% | 347.3ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:274` |
| 2.5% | 253.2ms | 0.0% | 5.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 2.3% | 233.3ms | 2.3% | 228.0ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:267` |
| 2.1% | 208.6ms | 2.1% | 208.6ms | `hypot` | `[native code]` |
| 2.0% | 206.8ms | 1.2% | 125.6ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.8% | 184.5ms | 1.8% | 184.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` |
| 1.7% | 172.4ms | 1.7% | 172.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` |
| 1.5% | 157.4ms | 1.5% | 157.4ms | `fill` | `[native code]` |
| 1.5% | 155.8ms | 0.0% | 678us | `forEach` | `[native code]` |
| 1.5% | 155.7ms | 0.0% | 558us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:669` |
| 1.4% | 146.6ms | 0.3% | 37.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:671` |
| 1.3% | 136.5ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:667` |
| 1.3% | 134.9ms | 0.4% | 44.9ms | `some` | `[native code]` |
| 1.2% | 126.2ms | 0.5% | 50.4ms | `from` | `[native code]` |
| 1.1% | 116.1ms | 1.1% | 116.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:650` |
| 1.1% | 109.3ms | 0.0% | 0us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` |
| 0.9% | 94.3ms | 0.9% | 94.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.9% | 93.5ms | 0.9% | 93.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` |
| 0.9% | 93.0ms | 0.0% | 8.0ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:525` |
| 0.9% | 90.3ms | 0.7% | 73.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` |
| 0.8% | 85.0ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:601` |
| 0.8% | 84.3ms | 0.8% | 84.3ms | `every` | `[native code]` |
| 0.8% | 84.3ms | 0.0% | 0us | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:374` |
| 0.8% | 83.1ms | 0.0% | 9.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` |
| 0.8% | 82.6ms | 0.0% | 3.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:564` |
| 0.8% | 79.8ms | 0.4% | 47.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:192` |
| 0.7% | 76.5ms | 0.0% | 5.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:565` |
| 0.7% | 73.3ms | 0.2% | 27.7ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.6% | 67.2ms | 0.0% | 610us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:106` |
| 0.6% | 66.6ms | 0.0% | 1.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 0.6% | 66.6ms | 0.0% | 0us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 0.6% | 60.6ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:615` |
| 0.5% | 57.5ms | 0.0% | 3.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` |
| 0.5% | 53.7ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:539` |
| 0.5% | 52.9ms | 0.5% | 52.9ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:547` |
| 0.4% | 44.0ms | 0.0% | 722us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` |
| 0.4% | 44.0ms | 0.3% | 35.5ms | `sort` | `[native code]` |
| 0.4% | 41.4ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` |
| 0.3% | 37.7ms | 0.3% | 37.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` |
| 0.3% | 37.3ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` |
| 0.3% | 34.8ms | 0.3% | 34.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:594` |
| 0.2% | 28.7ms | 0.2% | 28.1ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:305` |
| 0.2% | 28.2ms | 0.0% | 617us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:185` |
| 0.2% | 26.9ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:551` |
| 0.2% | 26.5ms | 0.2% | 26.5ms | `Float64Array` | `[native code]` |
| 0.2% | 21.7ms | 0.0% | 3.9ms | `anonymous` | `[native code]` |
| 0.2% | 21.1ms | 0.0% | 2.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:582` |
| 0.2% | 20.7ms | 0.2% | 20.7ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.1% | 17.6ms | 0.1% | 17.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:192` |
| 0.1% | 17.2ms | 0.1% | 17.2ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:20` |
| 0.1% | 15.0ms | 0.0% | 3.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` |
| 0.1% | 11.5ms | 0.1% | 11.5ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:254` |
| 0.1% | 11.4ms | 0.1% | 11.4ms | `push` | `[native code]` |
| 0.1% | 10.2ms | 0.0% | 5.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:626` |
| 0.1% | 10.0ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 0.0% | 9.6ms | 0.0% | 9.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:642` |
| 0.0% | 9.1ms | 0.0% | 9.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:627` |
| 0.0% | 9.0ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:689` |
| 0.0% | 8.5ms | 0.0% | 567us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` |
| 0.0% | 7.7ms | 0.0% | 4.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:600` |
| 0.0% | 7.5ms | 0.0% | 7.5ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:255` |
| 0.0% | 6.8ms | 0.0% | 6.1ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:535` |
| 0.0% | 6.3ms | 0.0% | 741us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.0% | 6.3ms | 0.0% | 1.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:692` |
| 0.0% | 6.0ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:668` |
| 0.0% | 5.9ms | 0.0% | 5.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:685` |
| 0.0% | 5.7ms | 0.0% | 5.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 5.4ms | 0.0% | 592us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 0.0% | 5.3ms | 0.0% | 5.3ms | `abs` | `[native code]` |
| 0.0% | 5.2ms | 0.0% | 644us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:188` |
| 0.0% | 5.2ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:688` |
| 0.0% | 5.2ms | 0.0% | 5.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:661` |
| 0.0% | 5.1ms | 0.0% | 5.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 5.1ms | 0.0% | 689us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:603` |
| 0.0% | 5.1ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.0% | 4.9ms | 0.0% | 4.9ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 4.4ms | 0.0% | 4.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:568` |
| 0.0% | 4.3ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:191` |
| 0.0% | 3.9ms | 0.0% | 3.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:683` |
| 0.0% | 3.4ms | 0.0% | 1.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |
| 0.0% | 3.2ms | 0.0% | 3.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:698` |
| 0.0% | 3.2ms | 0.0% | 3.2ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.2ms | 0.0% | 3.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:699` |
| 0.0% | 3.1ms | 0.0% | 1.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.0% | 3.0ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 2.9ms | 0.0% | 2.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:708` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:618` |
| 0.0% | 2.7ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` |
| 0.0% | 2.6ms | 0.0% | 2.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:582` |
| 0.0% | 2.6ms | 0.0% | 524us | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:526` |
| 0.0% | 2.6ms | 0.0% | 1.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:687` |
| 0.0% | 2.5ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` |
| 0.0% | 2.4ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 2.1ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:709` |
| 0.0% | 2.0ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 2.0ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 2.0ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:638` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `reduce` | `[native code]` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:702` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:158` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.3ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:170` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:572` |
| 0.0% | 1.1ms | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:308` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 754us | 0.0% | 754us | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:271` |
| 0.0% | 753us | 0.0% | 753us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:191` |
| 0.0% | 750us | 0.0% | 0us | `internal:stream` | `internal:stream:46` |
| 0.0% | 727us | 0.0% | 727us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:557` |
| 0.0% | 712us | 0.0% | 712us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 711us | 0.0% | 0us | `internal:streams/operators` | `internal:streams/operators:2` |
| 0.0% | 710us | 0.0% | 0us | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:56` |
| 0.0% | 710us | 0.0% | 710us | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:51` |
| 0.0% | 696us | 0.0% | 696us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:485` |
| 0.0% | 692us | 0.0% | 692us | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 690us | 0.0% | 690us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` |
| 0.0% | 678us | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:583` |
| 0.0% | 669us | 0.0% | 669us | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 650us | 0.0% | 650us | `filter` | `[native code]` |
| 0.0% | 650us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:468` |
| 0.0% | 639us | 0.0% | 639us | `max` | `[native code]` |
| 0.0% | 639us | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:608` |
| 0.0% | 626us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 626us | 0.0% | 0us | `internal:primordials` | `internal:primordials:51` |
| 0.0% | 626us | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 626us | 0.0% | 626us | `createSafeIterator` | `internal:primordials:3` |
| 0.0% | 626us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 618us | 0.0% | 618us | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 616us | 0.0% | 616us | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 609us | 0.0% | 609us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:471` |
| 0.0% | 604us | 0.0% | 604us | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 603us | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 603us | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 603us | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 575us | 0.0% | 575us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:461` |
| 0.0% | 572us | 0.0% | 572us | `node:path` | `node:path:23` |
| 0.0% | 572us | 0.0% | 0us | `internal:fs/glob` | `internal:fs/glob:2` |
| 0.0% | 564us | 0.0% | 564us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:50` |
| 0.0% | 557us | 0.0% | 557us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 553us | 0.0% | 553us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:251` |
| 0.0% | 532us | 0.0% | 532us | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:527` |
| 0.0% | 528us | 0.0% | 528us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:152` |
| 0.0% | 519us | 0.0% | 519us | `write` | `[native code]` |
| 0.0% | 519us | 0.0% | 0us | `writeFast` | `internal:fs/streams:359` |

## Function Details

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:144` | Self: 21.5% (2.13s) | Total: 22.6% (2.24s) | Samples: 3301

**Called by:**
- `step` (3473)

**Calls:**
- `hypot` (172)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` | Self: 20.3% (2.01s) | Total: 21.3% (2.11s) | Samples: 3144

**Called by:**
- `step` (3300)

**Calls:**
- `hypot` (156)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:641` | Self: 17.7% (1.75s) | Total: 17.7% (1.75s) | Samples: 2697

**Called by:**
- `runTrial` (2684)
- `runTrial` (13)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:252` | Self: 4.5% (453.3ms) | Total: 4.7% (470.6ms) | Samples: 696

**Called by:**
- `step` (722)

**Calls:**
- `createZeroVector` (20)
- `fill` (6)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:233` | Self: 4.0% (397.6ms) | Total: 4.4% (440.4ms) | Samples: 617

**Called by:**
- `step` (684)

**Calls:**
- `from` (67)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:274` | Self: 3.5% (347.3ms) | Total: 3.5% (351.0ms) | Samples: 544

**Called by:**
- `step` (476)
- `step` (74)

**Calls:**
- `fill` (3)
- `createZeroVector` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:634` | Self: 3.3% (330.0ms) | Total: 3.8% (380.1ms) | Samples: 517

**Called by:**
- `runTrial` (595)
- `runTrial` (1)

**Calls:**
- `createZeroMatrix` (69)
- `from` (8)
- `createZeroMatrix` (2)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:267` | Self: 2.3% (228.0ms) | Total: 2.3% (233.3ms) | Samples: 356

**Called by:**
- `step` (307)
- `step` (57)

**Calls:**
- `fill` (6)
- `createZeroVector` (2)

### `hypot`
`[native code]` | Self: 2.1% (208.6ms) | Total: 2.1% (208.6ms) | Samples: 328

**Called by:**
- `jacobiEigenSymmetric` (172)
- `jacobiEigenSymmetric` (156)

### `map`
`[native code]` | Self: 2.0% (205.8ms) | Total: 4.3% (434.8ms) | Samples: 315

**Called by:**
- `cloneMatrix` (169)
- `step` (122)
- `step` (107)
- `step` (96)
- `(anonymous)` (86)
- `jacobiEigenSymmetric` (16)
- `(anonymous)` (13)
- `step` (9)
- `step` (8)
- `step` (7)
- `step` (7)
- `step` (7)
- `jacobiEigenSymmetric` (7)
- `jacobiEigenSymmetric` (6)
- `step` (5)
- `alignProjectionBasis` (3)
- `alignProjectionBasis` (2)
- `map` (1)

**Calls:**
- `(anonymous)` (145)
- `(anonymous)` (111)
- `(anonymous)` (91)
- `abs` (7)
- `(anonymous)` (1)
- `map` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` | Self: 1.8% (184.5ms) | Total: 1.8% (184.5ms) | Samples: 293

**Called by:**
- `runTrial` (291)
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` | Self: 1.7% (172.4ms) | Total: 1.7% (172.4ms) | Samples: 272

**Called by:**
- `runTrial` (271)
- `runTrial` (1)

### `fill`
`[native code]` | Self: 1.5% (157.4ms) | Total: 1.5% (157.4ms) | Samples: 251

**Called by:**
- `sampleGaussianVectorND` (128)
- `ellipsoidObjective` (73)
- `from` (33)
- `transformFromEigenCoordinates` (6)
- `whitenWithEigensystem` (6)
- `whitenWithEigensystem` (3)
- `step` (1)
- `sampleGaussianVectorND` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.2% (125.6ms) | Total: 2.0% (206.8ms) | Samples: 196

**Called by:**
- `step` (324)

**Calls:**
- `fill` (128)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:650` | Self: 1.1% (116.1ms) | Total: 1.1% (116.1ms) | Samples: 180

**Called by:**
- `runTrial` (179)
- `runTrial` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.9% (94.3ms) | Total: 0.9% (94.3ms) | Samples: 148

**Called by:**
- `map` (111)
- `some` (36)
- `from` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` | Self: 0.9% (93.5ms) | Total: 0.9% (93.5ms) | Samples: 145

**Called by:**
- `map` (145)

### `every`
`[native code]` | Self: 0.8% (84.3ms) | Total: 0.8% (84.3ms) | Samples: 131

**Called by:**
- `requireFiniteVector` (131)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` | Self: 0.7% (73.9ms) | Total: 0.9% (90.3ms) | Samples: 115

**Called by:**
- `step` (142)

**Calls:**
- `Float64Array` (27)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:547` | Self: 0.5% (52.9ms) | Total: 0.5% (52.9ms) | Samples: 82

**Called by:**
- `step` (82)

### `from`
`[native code]` | Self: 0.5% (50.4ms) | Total: 1.2% (126.2ms) | Samples: 80

**Called by:**
- `createZeroMatrix` (68)
- `reconstructSymmetric` (67)
- `jacobiEigenSymmetric` (51)
- `step` (8)
- `jacobiEigenSymmetric` (4)

**Calls:**
- `(anonymous)` (57)
- `fill` (33)
- `(anonymous)` (27)
- `(anonymous)` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:192` | Self: 0.4% (47.2ms) | Total: 0.8% (79.8ms) | Samples: 74

**Called by:**
- `step` (125)

**Calls:**
- `from` (51)

### `some`
`[native code]` | Self: 0.4% (44.9ms) | Total: 1.3% (134.9ms) | Samples: 71

**Called by:**
- `validateSquareFiniteMatrix` (106)
- `(anonymous)` (104)
- `projectTo3D` (3)
- `some` (1)

**Calls:**
- `(anonymous)` (106)
- `(anonymous)` (36)
- `some` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` | Self: 0.3% (37.7ms) | Total: 0.3% (37.7ms) | Samples: 57

**Called by:**
- `from` (57)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:671` | Self: 0.3% (37.1ms) | Total: 1.4% (146.6ms) | Samples: 59

**Called by:**
- `forEach` (229)

**Calls:**
- `projectTo3D` (144)
- `projectTo3D` (12)
- `projectTo3D` (10)
- `projectTo3D` (4)

### `sort`
`[native code]` | Self: 0.3% (35.5ms) | Total: 0.4% (44.0ms) | Samples: 57

**Called by:**
- `jacobiEigenSymmetric` (39)
- `step` (31)

**Calls:**
- `(anonymous)` (9)
- `(anonymous)` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:594` | Self: 0.3% (34.8ms) | Total: 0.3% (34.8ms) | Samples: 54

**Called by:**
- `runTrial` (53)
- `runTrial` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:305` | Self: 0.2% (28.1ms) | Total: 0.2% (28.7ms) | Samples: 41

**Called by:**
- `step` (42)

**Calls:**
- `fill` (1)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` | Self: 0.2% (27.7ms) | Total: 0.7% (73.3ms) | Samples: 44

**Called by:**
- `step` (117)

**Calls:**
- `fill` (73)

### `Float64Array`
`[native code]` | Self: 0.2% (26.5ms) | Total: 0.2% (26.5ms) | Samples: 41

**Called by:**
- `jacobiEigenSymmetric` (27)
- `jacobiEigenSymmetric` (14)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.2% (20.7ms) | Total: 0.2% (20.7ms) | Samples: 33

**Called by:**
- `step` (14)
- `(anonymous)` (12)
- `step` (7)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:192` | Self: 0.1% (17.6ms) | Total: 0.1% (17.6ms) | Samples: 27

**Called by:**
- `from` (27)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:20` | Self: 0.1% (17.2ms) | Total: 0.1% (17.2ms) | Samples: 26

**Called by:**
- `transformFromEigenCoordinates` (20)
- `whitenWithEigensystem` (3)
- `whitenWithEigensystem` (2)
- `step` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:254` | Self: 0.1% (11.5ms) | Total: 0.1% (11.5ms) | Samples: 6

**Called by:**
- `step` (6)

### `push`
`[native code]` | Self: 0.1% (11.4ms) | Total: 0.1% (11.4ms) | Samples: 18

**Called by:**
- `step` (17)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` | Self: 0.0% (9.8ms) | Total: 0.8% (83.1ms) | Samples: 15

**Called by:**
- `runTrial` (131)
- `runTrial` (1)

**Calls:**
- `ellipsoidObjective` (117)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:642` | Self: 0.0% (9.6ms) | Total: 0.0% (9.6ms) | Samples: 14

**Called by:**
- `runTrial` (14)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:627` | Self: 0.0% (9.1ms) | Total: 0.0% (9.1ms) | Samples: 14

**Called by:**
- `runTrial` (14)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:525` | Self: 0.0% (8.0ms) | Total: 0.9% (93.0ms) | Samples: 13

**Called by:**
- `(anonymous)` (144)
- `step` (1)

**Calls:**
- `requireFiniteVector` (131)
- `requireFiniteVector` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:255` | Self: 0.0% (7.5ms) | Total: 0.0% (7.5ms) | Samples: 12

**Called by:**
- `step` (12)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` | Self: 0.0% (6.7ms) | Total: 99.4% (9.83s) | Samples: 1

**Called by:**
- `(module)` (14240)
- `(module)` (997)

**Calls:**
- `step` (7215)
- `step` (2684)
- `step` (783)
- `step` (740)
- `step` (687)
- `step` (595)
- `step` (394)
- `step` (291)
- `step` (271)
- `step` (244)
- `step` (208)
- `step` (179)
- `step` (134)
- `step` (131)
- `step` (128)
- `step` (108)
- `step` (96)
- `step` (59)
- `step` (53)
- `step` (34)
- `step` (16)
- `step` (15)
- `step` (14)
- `step` (14)
- `step` (10)
- `step` (9)
- `step` (8)
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
- `step` (5)
- `step` (5)
- `step` (5)
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
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:535` | Self: 0.0% (6.1ms) | Total: 0.0% (6.8ms) | Samples: 9

**Called by:**
- `(anonymous)` (10)

**Calls:**
- `coordinate` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:685` | Self: 0.0% (5.9ms) | Total: 0.0% (5.9ms) | Samples: 8

**Called by:**
- `runTrial` (8)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` | Self: 0.0% (5.7ms) | Total: 0.0% (5.7ms) | Samples: 9

**Called by:**
- `sort` (9)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` | Self: 0.0% (5.6ms) | Total: 2.5% (253.2ms) | Samples: 9

**Called by:**
- `runTrial` (394)

**Calls:**
- `sampleGaussianVectorND` (324)
- `sampleGaussianVectorND` (42)
- `push` (17)
- `sampleGaussianVectorND` (2)

### `abs`
`[native code]` | Self: 0.0% (5.3ms) | Total: 0.0% (5.3ms) | Samples: 7

**Called by:**
- `map` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:626` | Self: 0.0% (5.2ms) | Total: 0.1% (10.2ms) | Samples: 8

**Called by:**
- `runTrial` (16)

**Calls:**
- `vecDot` (8)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:661` | Self: 0.0% (5.2ms) | Total: 0.0% (5.2ms) | Samples: 8

**Called by:**
- `runTrial` (8)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (5.1ms) | Total: 0.0% (5.1ms) | Samples: 6

**Called by:**
- `runTrial` (5)
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:565` | Self: 0.0% (5.0ms) | Total: 0.7% (76.5ms) | Samples: 1

**Called by:**
- `runTrial` (108)

**Calls:**
- `map` (107)

### `vecDot`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (4.9ms) | Total: 0.0% (4.9ms) | Samples: 8

**Called by:**
- `step` (8)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:600` | Self: 0.0% (4.5ms) | Total: 0.0% (7.7ms) | Samples: 2

**Called by:**
- `runTrial` (7)

**Calls:**
- `map` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:568` | Self: 0.0% (4.4ms) | Total: 0.0% (4.4ms) | Samples: 7

**Called by:**
- `runTrial` (7)

### `anonymous`
`[native code]` | Self: 0.0% (3.9ms) | Total: 0.2% (21.7ms) | Samples: 6

**Called by:**
- `(anonymous)` (5)
- `node:fs` (5)
- `node:fs/promises` (4)
- `internal:fs/streams` (3)
- `get WriteStream` (3)
- `node:stream` (3)
- `internal:stream` (2)
- `node:events` (1)
- `internal:validators` (1)
- `internal:fs/glob` (1)
- `internal:streams/pipeline` (1)
- `internal:shared` (1)
- `internal:streams/operators` (1)
- `internal:streams/compose` (1)
- `internal:streams/duplex` (1)
- `internal:stream` (1)

**Calls:**
- `node:fs` (5)
- `node:fs/promises` (4)
- `internal:fs/streams` (3)
- `node:stream` (3)
- `internal:stream` (2)
- `node:events` (1)
- `internal:validators` (1)
- `internal:fs/glob` (1)
- `internal:streams/pipeline` (1)
- `internal:shared` (1)
- `internal:streams/operators` (1)
- `internal:streams/compose` (1)
- `internal:streams/duplex` (1)
- `internal:primordials` (1)
- `node:path` (1)
- `internal:stream` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` | Self: 0.0% (3.7ms) | Total: 0.1% (15.0ms) | Samples: 7

**Called by:**
- `step` (23)

**Calls:**
- `map` (16)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:564` | Self: 0.0% (3.5ms) | Total: 0.8% (82.6ms) | Samples: 6

**Called by:**
- `runTrial` (128)

**Calls:**
- `map` (122)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:683` | Self: 0.0% (3.3ms) | Total: 0.0% (3.9ms) | Samples: 5

**Called by:**
- `runTrial` (6)

**Calls:**
- `radius` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:698` | Self: 0.0% (3.2ms) | Total: 0.0% (3.2ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (3.2ms) | Total: 0.0% (3.2ms) | Samples: 5

**Called by:**
- `step` (3)
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:699` | Self: 0.0% (3.2ms) | Total: 0.0% (3.2ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` | Self: 0.0% (3.0ms) | Total: 0.5% (57.5ms) | Samples: 5

**Called by:**
- `map` (91)

**Calls:**
- `map` (86)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:708` | Self: 0.0% (2.9ms) | Total: 0.0% (2.9ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (2.8ms) | Total: 0.0% (2.8ms) | Samples: 3

**Called by:**
- `step` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:618` | Self: 0.0% (2.8ms) | Total: 0.0% (2.8ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:582` | Self: 0.0% (2.6ms) | Total: 0.0% (2.6ms) | Samples: 4

**Called by:**
- `sort` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:582` | Self: 0.0% (2.0ms) | Total: 0.2% (21.1ms) | Samples: 3

**Called by:**
- `runTrial` (34)

**Calls:**
- `sort` (31)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` | Self: 0.0% (1.9ms) | Total: 0.0% (3.4ms) | Samples: 3

**Called by:**
- `runTrial` (5)

**Calls:**
- `reduce` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` | Self: 0.0% (1.9ms) | Total: 0.0% (1.9ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:692` | Self: 0.0% (1.9ms) | Total: 0.0% (6.3ms) | Samples: 3

**Called by:**
- `runTrial` (10)

**Calls:**
- `map` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:687` | Self: 0.0% (1.9ms) | Total: 0.0% (2.6ms) | Samples: 3

**Called by:**
- `runTrial` (4)

**Calls:**
- `variancePercent` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:658` | Self: 0.0% (1.8ms) | Total: 4.4% (442.3ms) | Samples: 3

**Called by:**
- `runTrial` (687)

**Calls:**
- `reconstructSymmetric` (684)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` | Self: 0.0% (1.8ms) | Total: 0.0% (3.1ms) | Samples: 3

**Called by:**
- `runTrial` (5)

**Calls:**
- `vecNorm` (1)
- `vecNorm` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` | Self: 0.0% (1.8ms) | Total: 0.0% (1.8ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:638` | Self: 0.0% (1.7ms) | Total: 0.0% (1.7ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` | Self: 0.0% (1.7ms) | Total: 4.9% (492.0ms) | Samples: 3

**Called by:**
- `runTrial` (740)
- `runTrial` (4)

**Calls:**
- `transformFromEigenCoordinates` (722)
- `transformFromEigenCoordinates` (12)
- `transformFromEigenCoordinates` (6)
- `transformFromEigenCoordinates` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:709` | Self: 0.0% (1.6ms) | Total: 0.0% (2.1ms) | Samples: 3

**Called by:**
- `runTrial` (4)

**Calls:**
- `push` (1)

### `reduce`
`[native code]` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:702` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:158` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `step` (2)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 2

**Called by:**
- `step` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:170` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:572` | Self: 0.0% (1.1ms) | Total: 0.0% (1.1ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` | Self: 0.0% (1.1ms) | Total: 0.6% (66.6ms) | Samples: 2

**Called by:**
- `some` (106)

**Calls:**
- `some` (104)

### `nextHalfOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.1ms) | Total: 0.0% (1.1ms) | Samples: 2

**Called by:**
- `sampleGaussianVectorND` (2)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:271` | Self: 0.0% (754us) | Total: 0.0% (754us) | Samples: 1

**Called by:**
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:191` | Self: 0.0% (753us) | Total: 0.0% (753us) | Samples: 1

**Called by:**
- `map` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` | Self: 0.0% (741us) | Total: 0.0% (6.3ms) | Samples: 1

**Calls:**
- `(anonymous)` (8)
- `writeFast` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:557` | Self: 0.0% (727us) | Total: 0.0% (727us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` | Self: 0.0% (722us) | Total: 0.4% (44.0ms) | Samples: 1

**Called by:**
- `step` (69)

**Calls:**
- `from` (68)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (712us) | Total: 0.0% (712us) | Samples: 1

**Called by:**
- `step` (1)

### `vecDot`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:51` | Self: 0.0% (710us) | Total: 0.0% (710us) | Samples: 1

**Called by:**
- `vecNorm` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:485` | Self: 0.0% (696us) | Total: 0.0% (696us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `variancePercent`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (692us) | Total: 0.0% (692us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` | Self: 0.0% (690us) | Total: 0.0% (690us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:603` | Self: 0.0% (689us) | Total: 0.0% (5.1ms) | Samples: 1

**Called by:**
- `runTrial` (7)
- `runTrial` (1)

**Calls:**
- `map` (7)

### `forEach`
`[native code]` | Self: 0.0% (678us) | Total: 1.5% (155.8ms) | Samples: 1

**Called by:**
- `step` (243)
- `step` (1)

**Calls:**
- `(anonymous)` (229)
- `(anonymous)` (14)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (669us) | Total: 0.0% (669us) | Samples: 1

**Called by:**
- `projectTo3D` (1)

### `filter`
`[native code]` | Self: 0.0% (650us) | Total: 0.0% (650us) | Samples: 1

**Called by:**
- `CMAESOptimizerND` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:188` | Self: 0.0% (644us) | Total: 0.0% (5.2ms) | Samples: 1

**Called by:**
- `step` (8)

**Calls:**
- `map` (7)

### `max`
`[native code]` | Self: 0.0% (639us) | Total: 0.0% (639us) | Samples: 1

**Called by:**
- `step` (1)

### `createSafeIterator`
`internal:primordials:3` | Self: 0.0% (626us) | Total: 0.0% (626us) | Samples: 1

**Called by:**
- `internal:primordials` (1)

### `vecNorm`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (618us) | Total: 0.0% (618us) | Samples: 1

**Called by:**
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:185` | Self: 0.0% (617us) | Total: 0.2% (28.2ms) | Samples: 1

**Called by:**
- `step` (44)

**Calls:**
- `sort` (39)
- `from` (4)

### `requireFiniteVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (616us) | Total: 0.0% (616us) | Samples: 1

**Called by:**
- `projectTo3D` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:106` | Self: 0.0% (610us) | Total: 0.6% (67.2ms) | Samples: 1

**Called by:**
- `step` (107)

**Calls:**
- `validateSquareFiniteMatrix` (106)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:471` | Self: 0.0% (609us) | Total: 0.0% (609us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `radius`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (604us) | Total: 0.0% (604us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` | Self: 0.0% (592us) | Total: 0.0% (5.4ms) | Samples: 1

**Called by:**
- `runTrial` (8)

**Calls:**
- `map` (7)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:461` | Self: 0.0% (575us) | Total: 0.0% (575us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `node:path`
`node:path:23` | Self: 0.0% (572us) | Total: 0.0% (572us) | Samples: 1

**Called by:**
- `anonymous` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` | Self: 0.0% (567us) | Total: 0.0% (8.5ms) | Samples: 1

**Called by:**
- `forEach` (14)

**Calls:**
- `map` (13)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:50` | Self: 0.0% (564us) | Total: 0.0% (564us) | Samples: 1

**Called by:**
- `(module)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:669` | Self: 0.0% (558us) | Total: 1.5% (155.7ms) | Samples: 1

**Called by:**
- `runTrial` (244)

**Calls:**
- `forEach` (243)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (557us) | Total: 0.0% (557us) | Samples: 1

**Called by:**
- `step` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:251` | Self: 0.0% (553us) | Total: 0.0% (553us) | Samples: 1

**Called by:**
- `step` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:527` | Self: 0.0% (532us) | Total: 0.0% (532us) | Samples: 1

**Called by:**
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:152` | Self: 0.0% (528us) | Total: 0.0% (528us) | Samples: 1

**Called by:**
- `step` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:526` | Self: 0.0% (524us) | Total: 0.0% (2.6ms) | Samples: 1

**Called by:**
- `(anonymous)` (4)

**Calls:**
- `some` (3)

### `write`
`[native code]` | Self: 0.0% (519us) | Total: 0.0% (519us) | Samples: 1

**Called by:**
- `writeFast` (1)

### `internal:fs/glob`
`internal:fs/glob:2` | Self: 0.0% (0us) | Total: 0.0% (572us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:551` | Self: 0.0% (0us) | Total: 0.2% (26.9ms) | Samples: 0

**Called by:**
- `step` (41)

**Calls:**
- `cloneMatrix` (38)
- `map` (3)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (2.0ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (603us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:688` | Self: 0.0% (0us) | Total: 0.0% (5.2ms) | Samples: 0

**Called by:**
- `runTrial` (8)

**Calls:**
- `projectTo3D` (7)
- `projectTo3D` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:601` | Self: 0.0% (0us) | Total: 0.8% (85.0ms) | Samples: 0

**Called by:**
- `runTrial` (134)

**Calls:**
- `whitenWithEigensystem` (74)
- `whitenWithEigensystem` (57)
- `whitenWithEigensystem` (3)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (2.0ms) | Samples: 0

**Called by:**
- `(anonymous)` (3)

**Calls:**
- `anonymous` (3)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:539` | Self: 0.0% (0us) | Total: 0.5% (53.7ms) | Samples: 0

**Called by:**
- `step` (83)

**Calls:**
- `cloneMatrix` (81)
- `map` (2)

### `internal:primordials`
`internal:primordials:51` | Self: 0.0% (0us) | Total: 0.0% (626us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `createSafeIterator` (1)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (626us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` | Self: 0.0% (0us) | Total: 1.1% (109.3ms) | Samples: 0

**Called by:**
- `alignProjectionBasis` (81)
- `step` (50)
- `alignProjectionBasis` (38)

**Calls:**
- `map` (169)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` | Self: 0.0% (0us) | Total: 0.1% (10.0ms) | Samples: 0

**Called by:**
- `step` (14)

**Calls:**
- `Float64Array` (14)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` | Self: 0.0% (0us) | Total: 93.3% (9.22s) | Samples: 0

**Calls:**
- `runTrial` (14240)
- `runTrial` (53)
- `runTrial` (4)
- `runTrial` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` | Self: 0.0% (0us) | Total: 0.0% (2.5ms) | Samples: 0

**Called by:**
- `(module)` (4)

**Calls:**
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:668` | Self: 0.0% (0us) | Total: 0.0% (6.0ms) | Samples: 0

**Called by:**
- `runTrial` (9)

**Calls:**
- `map` (9)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (2.0ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:608` | Self: 0.0% (0us) | Total: 0.0% (639us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `max` (1)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (2.4ms) | Samples: 0

**Called by:**
- `anonymous` (4)

**Calls:**
- `anonymous` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:657` | Self: 0.0% (0us) | Total: 47.1% (4.65s) | Samples: 0

**Called by:**
- `runTrial` (7215)
- `runTrial` (33)

**Calls:**
- `jacobiEigenSymmetric` (3473)
- `jacobiEigenSymmetric` (3300)
- `jacobiEigenSymmetric` (142)
- `jacobiEigenSymmetric` (125)
- `jacobiEigenSymmetric` (107)
- `jacobiEigenSymmetric` (44)
- `jacobiEigenSymmetric` (23)
- `jacobiEigenSymmetric` (14)
- `jacobiEigenSymmetric` (8)
- `jacobiEigenSymmetric` (6)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (5.1ms) | Samples: 0

**Called by:**
- `(module)` (8)

**Calls:**
- `anonymous` (5)
- `get WriteStream` (3)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (603us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:stream`
`internal:stream:46` | Self: 0.0% (0us) | Total: 0.0% (750us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (626us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:689` | Self: 0.0% (0us) | Total: 0.0% (9.0ms) | Samples: 0

**Called by:**
- `runTrial` (15)

**Calls:**
- `projectTo3D` (14)
- `projectTo3D` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:308` | Self: 0.0% (0us) | Total: 0.0% (1.1ms) | Samples: 0

**Called by:**
- `step` (2)

**Calls:**
- `nextHalfOpenUnit` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` | Self: 0.0% (0us) | Total: 0.0% (2.7ms) | Samples: 0

**Called by:**
- `runTrial` (4)

**Calls:**
- `createZeroVector` (2)
- `fill` (1)
- `createZeroVector` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:583` | Self: 0.0% (0us) | Total: 0.0% (678us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `forEach` (1)

### `vecNorm`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:56` | Self: 0.0% (0us) | Total: 0.0% (710us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `vecDot` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:615` | Self: 0.0% (0us) | Total: 0.6% (60.6ms) | Samples: 0

**Called by:**
- `runTrial` (96)

**Calls:**
- `map` (96)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.3ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:468` | Self: 0.0% (0us) | Total: 0.0% (650us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `filter` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` | Self: 0.0% (0us) | Total: 0.3% (37.3ms) | Samples: 0

**Called by:**
- `runTrial` (59)

**Calls:**
- `cloneMatrix` (50)
- `map` (8)
- `cloneMatrix` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:191` | Self: 0.0% (0us) | Total: 0.0% (4.3ms) | Samples: 0

**Called by:**
- `step` (6)

**Calls:**
- `map` (6)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (626us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` | Self: 0.0% (0us) | Total: 6.6% (655.1ms) | Samples: 0

**Calls:**
- `runTrial` (997)
- `runTrial` (10)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:667` | Self: 0.0% (0us) | Total: 1.3% (136.5ms) | Samples: 0

**Called by:**
- `runTrial` (208)
- `runTrial` (1)

**Calls:**
- `alignProjectionBasis` (83)
- `alignProjectionBasis` (82)
- `alignProjectionBasis` (41)
- `alignProjectionBasis` (3)

### `internal:streams/operators`
`internal:streams/operators:2` | Self: 0.0% (0us) | Total: 0.0% (711us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (3.0ms) | Samples: 0

**Called by:**
- `anonymous` (5)

**Calls:**
- `anonymous` (5)

### `writeFast`
`internal:fs/streams:359` | Self: 0.0% (0us) | Total: 0.0% (519us) | Samples: 0

**Called by:**
- `(module)` (1)

**Calls:**
- `write` (1)

### `requireFiniteVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:374` | Self: 0.0% (0us) | Total: 0.8% (84.3ms) | Samples: 0

**Called by:**
- `projectTo3D` (131)

**Calls:**
- `every` (131)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` | Self: 0.0% (0us) | Total: 0.6% (66.6ms) | Samples: 0

**Called by:**
- `jacobiEigenSymmetric` (106)

**Calls:**
- `some` (106)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` | Self: 0.0% (0us) | Total: 0.4% (41.4ms) | Samples: 0

**Called by:**
- `(module)` (53)
- `(module)` (10)

**Calls:**
- `step` (33)
- `step` (13)
- `step` (4)
- `step` (3)
- `step` (2)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:621` | Self: 0.0% (0us) | Total: 5.0% (503.3ms) | Samples: 0

**Called by:**
- `runTrial` (783)
- `runTrial` (3)

**Calls:**
- `whitenWithEigensystem` (476)
- `whitenWithEigensystem` (307)
- `whitenWithEigensystem` (2)
- `whitenWithEigensystem` (1)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (603us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 91.1% | 9.00s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 8.4% | 838.4ms | `[native code]` |
| 0.3% | 35.8ms | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.0% | 626us | `internal:primordials` |
| 0.0% | 572us | `node:path` |
