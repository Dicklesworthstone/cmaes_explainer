# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 11.28s | 17489 | 500us | 177 |

**Top 10:** `step` 24.6%, `jacobiEigenSymmetric` 18.3%, `jacobiEigenSymmetric` 18.3%, `step` 6.0%, `step` 5.3%, `transformFromEigenCoordinates` 4.2%, `whitenWithEigensystem` 2.9%, `whitenWithEigensystem` 2.2%, `reconstructSymmetric` 2.1%, `map` 1.7%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 24.6% | 2.77s | 24.6% | 2.77s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:633` |
| 18.3% | 2.07s | 19.1% | 2.15s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` |
| 18.3% | 2.06s | 19.1% | 2.15s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:139` |
| 6.0% | 686.9ms | 6.4% | 730.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:629` |
| 5.3% | 598.3ms | 5.3% | 598.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 4.2% | 480.8ms | 4.3% | 492.8ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:247` |
| 2.9% | 335.7ms | 3.0% | 343.6ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:269` |
| 2.2% | 252.0ms | 2.3% | 260.0ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:262` |
| 2.1% | 241.5ms | 2.5% | 286.6ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:228` |
| 1.7% | 199.6ms | 4.0% | 457.9ms | `map` | `[native code]` |
| 1.5% | 177.9ms | 1.5% | 177.9ms | `hypot` | `[native code]` |
| 1.3% | 156.9ms | 1.3% | 156.9ms | `fill` | `[native code]` |
| 1.2% | 145.7ms | 1.9% | 220.9ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.2% | 135.4ms | 1.2% | 135.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.7% | 83.5ms | 0.7% | 83.5ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:527` |
| 0.7% | 80.0ms | 0.7% | 80.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` |
| 0.5% | 64.0ms | 0.7% | 80.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` |
| 0.4% | 45.7ms | 0.4% | 45.7ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:542` |
| 0.3% | 42.6ms | 1.1% | 132.3ms | `from` | `[native code]` |
| 0.3% | 40.4ms | 1.0% | 124.0ms | `some` | `[native code]` |
| 0.3% | 39.8ms | 0.3% | 39.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` |
| 0.3% | 36.5ms | 0.4% | 46.7ms | `sort` | `[native code]` |
| 0.3% | 34.3ms | 0.3% | 34.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:641` |
| 0.3% | 34.3ms | 0.3% | 34.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:589` |
| 0.2% | 31.6ms | 1.3% | 148.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:658` |
| 0.2% | 31.4ms | 0.2% | 31.4ms | `Float64Array` | `[native code]` |
| 0.2% | 30.8ms | 0.6% | 69.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.2% | 28.9ms | 0.2% | 28.9ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.2% | 23.5ms | 0.2% | 23.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.2% | 22.9ms | 0.2% | 22.9ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:20` |
| 0.1% | 20.1ms | 0.6% | 69.7ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.1% | 14.5ms | 0.1% | 14.5ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:300` |
| 0.1% | 13.0ms | 0.1% | 14.4ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:520` |
| 0.1% | 12.0ms | 0.1% | 12.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:637` |
| 0.1% | 11.7ms | 0.7% | 81.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` |
| 0.0% | 8.7ms | 0.0% | 8.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:181` |
| 0.0% | 8.5ms | 0.0% | 8.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:622` |
| 0.0% | 8.1ms | 0.0% | 8.1ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 0.0% | 7.3ms | 2.6% | 294.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` |
| 0.0% | 7.0ms | 0.0% | 7.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:686` |
| 0.0% | 6.3ms | 0.0% | 6.3ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 6.1ms | 0.0% | 6.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.0% | 5.6ms | 0.0% | 6.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` |
| 0.0% | 5.1ms | 0.1% | 21.7ms | `anonymous` | `[native code]` |
| 0.0% | 5.0ms | 2.2% | 248.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:557` |
| 0.0% | 5.0ms | 0.1% | 11.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:621` |
| 0.0% | 4.8ms | 0.1% | 16.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 4.8ms | 0.6% | 70.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` |
| 0.0% | 4.8ms | 0.0% | 4.8ms | `abs` | `[native code]` |
| 0.0% | 4.5ms | 0.0% | 4.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:631` |
| 0.0% | 4.5ms | 0.0% | 5.9ms | `exp` | `[native code]` |
| 0.0% | 4.1ms | 0.0% | 4.1ms | `push` | `[native code]` |
| 0.0% | 3.8ms | 0.0% | 3.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:689` |
| 0.0% | 3.7ms | 4.4% | 506.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:558` |
| 0.0% | 3.2ms | 0.0% | 3.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:567` |
| 0.0% | 3.2ms | 0.0% | 3.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` |
| 0.0% | 3.2ms | 0.0% | 4.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:601` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:690` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:551` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:522` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:266` |
| 0.0% | 2.7ms | 0.0% | 2.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.7ms | 0.0% | 2.7ms | `max` | `[native code]` |
| 0.0% | 2.5ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |
| 0.0% | 2.0ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:661` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:553` |
| 0.0% | 1.9ms | 0.0% | 2.4ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:521` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:552` |
| 0.0% | 1.8ms | 0.1% | 21.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` |
| 0.0% | 1.8ms | 0.1% | 14.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:657` |
| 0.0% | 1.8ms | 1.4% | 163.8ms | `forEach` | `[native code]` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:672` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `integerArgument` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:14` |
| 0.0% | 1.6ms | 1.4% | 163.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:656` |
| 0.0% | 1.5ms | 0.7% | 85.0ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:88` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.2ms | 0.0% | 1.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:650` |
| 0.0% | 1.2ms | 0.5% | 56.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:685` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:696` |
| 0.0% | 1.2ms | 0.2% | 31.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:180` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:304` |
| 0.0% | 1.1ms | 0.0% | 7.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `reduce` | `[native code]` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:271` |
| 0.0% | 1.0ms | 0.0% | 1.0ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 753us | 0.6% | 78.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` |
| 0.0% | 747us | 0.0% | 747us | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:499` |
| 0.0% | 744us | 0.0% | 744us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:307` |
| 0.0% | 739us | 0.0% | 739us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` |
| 0.0% | 734us | 0.5% | 61.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 0.0% | 728us | 0.0% | 728us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:590` |
| 0.0% | 726us | 0.0% | 726us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` |
| 0.0% | 726us | 0.0% | 726us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:446` |
| 0.0% | 725us | 0.0% | 725us | `every` | `[native code]` |
| 0.0% | 703us | 0.0% | 1.4ms | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:369` |
| 0.0% | 698us | 4.5% | 508.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` |
| 0.0% | 696us | 0.0% | 8.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` |
| 0.0% | 692us | 0.0% | 692us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:127` |
| 0.0% | 686us | 0.0% | 686us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.0% | 673us | 0.0% | 673us | `min` | `[native code]` |
| 0.0% | 668us | 0.0% | 1.9ms | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` |
| 0.0% | 666us | 0.0% | 666us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:649` |
| 0.0% | 656us | 1.1% | 133.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` |
| 0.0% | 656us | 0.0% | 656us | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 652us | 0.5% | 61.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` |
| 0.0% | 645us | 0.0% | 645us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 640us | 0.0% | 4.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.0% | 635us | 0.0% | 635us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 633us | 0.0% | 633us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:85` |
| 0.0% | 603us | 0.0% | 603us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 0.0% | 593us | 0.0% | 593us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 584us | 0.0% | 3.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.0% | 574us | 0.0% | 574us | `isServerConfig` | `bun:main` |
| 0.0% | 570us | 0.0% | 570us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:144` |
| 0.0% | 561us | 0.0% | 561us | `node:events` | `node:events:378` |
| 0.0% | 559us | 0.0% | 559us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:169` |
| 0.0% | 551us | 0.0% | 551us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:165` |
| 0.0% | 548us | 0.0% | 548us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 546us | 0.0% | 546us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 542us | 0.0% | 542us | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 520us | 0.0% | 6.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:648` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 99.4% | 11.21s | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 93.3% | 10.53s | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` |
| 40.8% | 4.60s | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:644` |
| 24.6% | 2.77s | 24.6% | 2.77s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:633` |
| 19.1% | 2.15s | 18.3% | 2.06s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:139` |
| 19.1% | 2.15s | 18.3% | 2.07s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` |
| 6.5% | 734.4ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` |
| 6.4% | 730.6ms | 6.0% | 686.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:629` |
| 5.3% | 598.3ms | 5.3% | 598.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 4.5% | 508.6ms | 0.0% | 698us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` |
| 4.4% | 506.7ms | 0.0% | 3.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:558` |
| 4.3% | 492.8ms | 4.2% | 480.8ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:247` |
| 4.0% | 457.9ms | 1.7% | 199.6ms | `map` | `[native code]` |
| 3.0% | 343.6ms | 2.9% | 335.7ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:269` |
| 2.6% | 294.0ms | 0.0% | 7.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` |
| 2.5% | 286.6ms | 2.1% | 241.5ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:228` |
| 2.3% | 260.0ms | 2.2% | 252.0ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:262` |
| 2.2% | 248.8ms | 0.0% | 5.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:557` |
| 1.9% | 220.9ms | 1.2% | 145.7ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.5% | 177.9ms | 1.5% | 177.9ms | `hypot` | `[native code]` |
| 1.4% | 163.8ms | 0.0% | 1.8ms | `forEach` | `[native code]` |
| 1.4% | 163.6ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:656` |
| 1.3% | 156.9ms | 1.3% | 156.9ms | `fill` | `[native code]` |
| 1.3% | 148.0ms | 0.2% | 31.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:658` |
| 1.2% | 135.4ms | 1.2% | 135.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.1% | 133.7ms | 0.0% | 656us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` |
| 1.1% | 132.3ms | 0.3% | 42.6ms | `from` | `[native code]` |
| 1.1% | 124.2ms | 0.0% | 0us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` |
| 1.0% | 124.0ms | 0.3% | 40.4ms | `some` | `[native code]` |
| 0.8% | 101.0ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:596` |
| 0.7% | 85.0ms | 0.0% | 1.5ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` |
| 0.7% | 83.5ms | 0.7% | 83.5ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:527` |
| 0.7% | 81.4ms | 0.1% | 11.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` |
| 0.7% | 80.5ms | 0.5% | 64.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` |
| 0.7% | 80.0ms | 0.7% | 80.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` |
| 0.6% | 78.4ms | 0.0% | 753us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` |
| 0.6% | 70.6ms | 0.0% | 4.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` |
| 0.6% | 69.7ms | 0.2% | 30.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.6% | 69.7ms | 0.1% | 20.1ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.5% | 62.0ms | 0.0% | 0us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 0.5% | 62.0ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:106` |
| 0.5% | 61.8ms | 0.0% | 652us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` |
| 0.5% | 61.3ms | 0.0% | 734us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 0.5% | 59.1ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:534` |
| 0.5% | 56.4ms | 0.0% | 1.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 0.4% | 53.9ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` |
| 0.4% | 49.2ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:684` |
| 0.4% | 46.7ms | 0.3% | 36.5ms | `sort` | `[native code]` |
| 0.4% | 45.7ms | 0.4% | 45.7ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:542` |
| 0.3% | 39.8ms | 0.3% | 39.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` |
| 0.3% | 34.9ms | 0.3% | 34.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:589` |
| 0.3% | 34.3ms | 0.3% | 34.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:641` |
| 0.2% | 32.9ms | 0.0% | 0us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` |
| 0.2% | 31.6ms | 0.0% | 1.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:180` |
| 0.2% | 31.4ms | 0.2% | 31.4ms | `Float64Array` | `[native code]` |
| 0.2% | 28.9ms | 0.2% | 28.9ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.2% | 27.1ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:546` |
| 0.2% | 23.5ms | 0.2% | 23.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.2% | 22.9ms | 0.2% | 22.9ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:20` |
| 0.1% | 21.7ms | 0.0% | 5.1ms | `anonymous` | `[native code]` |
| 0.1% | 21.2ms | 0.0% | 1.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` |
| 0.1% | 16.7ms | 0.0% | 4.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.1% | 14.9ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 0.1% | 14.6ms | 0.0% | 1.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:657` |
| 0.1% | 14.5ms | 0.1% | 14.5ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:300` |
| 0.1% | 14.4ms | 0.1% | 13.0ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:520` |
| 0.1% | 12.0ms | 0.1% | 12.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:637` |
| 0.1% | 11.4ms | 0.0% | 5.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:621` |
| 0.0% | 9.5ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:675` |
| 0.0% | 8.8ms | 0.0% | 696us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` |
| 0.0% | 8.7ms | 0.0% | 8.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:181` |
| 0.0% | 8.5ms | 0.0% | 8.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:622` |
| 0.0% | 8.1ms | 0.0% | 8.1ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 0.0% | 8.0ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` |
| 0.0% | 7.9ms | 0.0% | 1.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` |
| 0.0% | 7.0ms | 0.0% | 7.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:686` |
| 0.0% | 6.6ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` |
| 0.0% | 6.4ms | 0.0% | 520us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:648` |
| 0.0% | 6.3ms | 0.0% | 6.3ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 6.3ms | 0.0% | 5.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` |
| 0.0% | 6.1ms | 0.0% | 6.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.0% | 5.9ms | 0.0% | 4.5ms | `exp` | `[native code]` |
| 0.0% | 5.6ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.0% | 5.6ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.0% | 5.6ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:655` |
| 0.0% | 5.1ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 4.9ms | 0.0% | 640us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.0% | 4.8ms | 0.0% | 4.8ms | `abs` | `[native code]` |
| 0.0% | 4.6ms | 0.0% | 3.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:601` |
| 0.0% | 4.5ms | 0.0% | 4.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:631` |
| 0.0% | 4.1ms | 0.0% | 4.1ms | `push` | `[native code]` |
| 0.0% | 3.9ms | 0.0% | 584us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.0% | 3.8ms | 0.0% | 3.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:689` |
| 0.0% | 3.8ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.0% | 3.2ms | 0.0% | 3.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:567` |
| 0.0% | 3.2ms | 0.0% | 3.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:690` |
| 0.0% | 3.1ms | 0.0% | 2.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:661` |
| 0.0% | 3.1ms | 0.0% | 2.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:551` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:522` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:266` |
| 0.0% | 2.7ms | 0.0% | 2.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.7ms | 0.0% | 2.7ms | `max` | `[native code]` |
| 0.0% | 2.5ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 2.4ms | 0.0% | 1.9ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:521` |
| 0.0% | 2.1ms | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:302` |
| 0.0% | 2.0ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 2.0ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 2.0ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:553` |
| 0.0% | 1.9ms | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:650` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:552` |
| 0.0% | 1.9ms | 0.0% | 668us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` |
| 0.0% | 1.8ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:578` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` |
| 0.0% | 1.7ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:672` |
| 0.0% | 1.7ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:24` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `integerArgument` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:14` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:88` |
| 0.0% | 1.4ms | 0.0% | 703us | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:369` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.2ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:685` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:696` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:304` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `reduce` | `[native code]` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:271` |
| 0.0% | 1.0ms | 0.0% | 1.0ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 752us | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 752us | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 752us | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 747us | 0.0% | 747us | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:499` |
| 0.0% | 744us | 0.0% | 744us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:307` |
| 0.0% | 739us | 0.0% | 739us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` |
| 0.0% | 728us | 0.0% | 728us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:590` |
| 0.0% | 726us | 0.0% | 726us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` |
| 0.0% | 726us | 0.0% | 0us | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:278` |
| 0.0% | 726us | 0.0% | 726us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:446` |
| 0.0% | 725us | 0.0% | 725us | `every` | `[native code]` |
| 0.0% | 720us | 0.0% | 0us | `internal:stream` | `internal:stream:47` |
| 0.0% | 692us | 0.0% | 692us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:127` |
| 0.0% | 688us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:450` |
| 0.0% | 688us | 0.0% | 0us | `createIdentityMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:29` |
| 0.0% | 686us | 0.0% | 686us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.0% | 673us | 0.0% | 673us | `min` | `[native code]` |
| 0.0% | 666us | 0.0% | 666us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:649` |
| 0.0% | 656us | 0.0% | 656us | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 645us | 0.0% | 645us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 639us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 639us | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 639us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 635us | 0.0% | 635us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 633us | 0.0% | 633us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:85` |
| 0.0% | 603us | 0.0% | 603us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 0.0% | 593us | 0.0% | 593us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 574us | 0.0% | 574us | `isServerConfig` | `bun:main` |
| 0.0% | 574us | 0.0% | 0us | `(module)` | `bun:main:14` |
| 0.0% | 570us | 0.0% | 570us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:144` |
| 0.0% | 561us | 0.0% | 561us | `node:events` | `node:events:378` |
| 0.0% | 559us | 0.0% | 559us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:169` |
| 0.0% | 557us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:419` |
| 0.0% | 551us | 0.0% | 551us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:165` |
| 0.0% | 548us | 0.0% | 548us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 546us | 0.0% | 546us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 542us | 0.0% | 542us | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 534us | 0.0% | 0us | `internal:streams/operators` | `internal:streams/operators:2` |
| 0.0% | 482us | 0.0% | 0us | `node:fs` | `node:fs:299` |
| 0.0% | 482us | 0.0% | 0us | `internal:promisify` | `internal:promisify:53` |

## Function Details

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:633` | Self: 24.6% (2.77s) | Total: 24.6% (2.77s) | Samples: 4337

**Called by:**
- `runTrial` (4319)
- `runTrial` (18)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` | Self: 18.3% (2.07s) | Total: 19.1% (2.15s) | Samples: 3199

**Called by:**
- `step` (3334)

**Calls:**
- `hypot` (135)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:139` | Self: 18.3% (2.06s) | Total: 19.1% (2.15s) | Samples: 3225

**Called by:**
- `step` (3367)

**Calls:**
- `hypot` (142)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:629` | Self: 6.0% (686.9ms) | Total: 6.4% (730.6ms) | Samples: 1072

**Called by:**
- `runTrial` (1135)
- `runTrial` (4)

**Calls:**
- `createZeroMatrix` (49)
- `from` (17)
- `createZeroMatrix` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` | Self: 5.3% (598.3ms) | Total: 5.3% (598.3ms) | Samples: 923

**Called by:**
- `runTrial` (916)
- `runTrial` (7)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:247` | Self: 4.2% (480.8ms) | Total: 4.3% (492.8ms) | Samples: 738

**Called by:**
- `step` (755)

**Calls:**
- `createZeroVector` (10)
- `fill` (7)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:269` | Self: 2.9% (335.7ms) | Total: 3.0% (343.6ms) | Samples: 522

**Called by:**
- `step` (454)
- `step` (80)

**Calls:**
- `createZeroVector` (11)
- `fill` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:262` | Self: 2.2% (252.0ms) | Total: 2.3% (260.0ms) | Samples: 392

**Called by:**
- `step` (330)
- `step` (74)

**Calls:**
- `createZeroVector` (10)
- `fill` (2)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:228` | Self: 2.1% (241.5ms) | Total: 2.5% (286.6ms) | Samples: 370

**Called by:**
- `step` (439)

**Calls:**
- `from` (69)

### `map`
`[native code]` | Self: 1.7% (199.6ms) | Total: 4.0% (457.9ms) | Samples: 311

**Called by:**
- `cloneMatrix` (193)
- `step` (119)
- `step` (103)
- `step` (95)
- `(anonymous)` (86)
- `(anonymous)` (20)
- `jacobiEigenSymmetric` (14)
- `step` (11)
- `step` (10)
- `step` (10)
- `step` (9)
- `step` (9)
- `jacobiEigenSymmetric` (8)
- `jacobiEigenSymmetric` (7)
- `step` (6)
- `alignProjectionBasis` (4)
- `alignProjectionBasis` (3)
- `map` (1)

**Calls:**
- `(anonymous)` (171)
- `(anonymous)` (125)
- `(anonymous)` (88)
- `abs` (7)
- `(anonymous)` (1)
- `(anonymous)` (1)
- `(anonymous)` (1)
- `map` (1)
- `repair` (1)
- `(anonymous)` (1)

### `hypot`
`[native code]` | Self: 1.5% (177.9ms) | Total: 1.5% (177.9ms) | Samples: 277

**Called by:**
- `jacobiEigenSymmetric` (142)
- `jacobiEigenSymmetric` (135)

### `fill`
`[native code]` | Self: 1.3% (156.9ms) | Total: 1.3% (156.9ms) | Samples: 236

**Called by:**
- `sampleGaussianVectorND` (112)
- `ellipsoidObjective` (73)
- `from` (41)
- `transformFromEigenCoordinates` (7)
- `whitenWithEigensystem` (2)
- `whitenWithEigensystem` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.2% (145.7ms) | Total: 1.9% (220.9ms) | Samples: 226

**Called by:**
- `step` (338)

**Calls:**
- `fill` (112)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.2% (135.4ms) | Total: 1.2% (135.4ms) | Samples: 207

**Called by:**
- `map` (171)
- `some` (34)
- `from` (1)
- `CMAESOptimizerND` (1)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:527` | Self: 0.7% (83.5ms) | Total: 0.7% (83.5ms) | Samples: 130

**Called by:**
- `projectTo3D` (130)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` | Self: 0.7% (80.0ms) | Total: 0.7% (80.0ms) | Samples: 125

**Called by:**
- `map` (125)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` | Self: 0.5% (64.0ms) | Total: 0.7% (80.5ms) | Samples: 101

**Called by:**
- `step` (126)

**Calls:**
- `Float64Array` (25)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:542` | Self: 0.4% (45.7ms) | Total: 0.4% (45.7ms) | Samples: 70

**Called by:**
- `step` (70)

### `from`
`[native code]` | Self: 0.3% (42.6ms) | Total: 1.1% (132.3ms) | Samples: 65

**Called by:**
- `reconstructSymmetric` (69)
- `jacobiEigenSymmetric` (60)
- `createZeroMatrix` (50)
- `step` (17)
- `jacobiEigenSymmetric` (5)
- `exp` (2)

**Calls:**
- `(anonymous)` (60)
- `fill` (41)
- `(anonymous)` (36)
- `(anonymous)` (1)

### `some`
`[native code]` | Self: 0.3% (40.4ms) | Total: 1.0% (124.0ms) | Samples: 64

**Called by:**
- `validateSquareFiniteMatrix` (98)
- `(anonymous)` (96)
- `some` (1)
- `projectTo3D` (1)

**Calls:**
- `(anonymous)` (97)
- `(anonymous)` (34)
- `some` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` | Self: 0.3% (39.8ms) | Total: 0.3% (39.8ms) | Samples: 60

**Called by:**
- `from` (60)

### `sort`
`[native code]` | Self: 0.3% (36.5ms) | Total: 0.4% (46.7ms) | Samples: 57

**Called by:**
- `jacobiEigenSymmetric` (43)
- `step` (30)

**Calls:**
- `(anonymous)` (14)
- `(anonymous)` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:641` | Self: 0.3% (34.3ms) | Total: 0.3% (34.3ms) | Samples: 53

**Called by:**
- `runTrial` (53)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:589` | Self: 0.3% (34.3ms) | Total: 0.3% (34.9ms) | Samples: 53

**Called by:**
- `runTrial` (53)
- `runTrial` (1)

**Calls:**
- `adaptationPoint` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:658` | Self: 0.2% (31.6ms) | Total: 1.3% (148.0ms) | Samples: 49

**Called by:**
- `forEach` (231)

**Calls:**
- `projectTo3D` (132)
- `projectTo3D` (22)
- `projectTo3D` (22)
- `projectTo3D` (3)
- `projectTo3D` (3)

### `Float64Array`
`[native code]` | Self: 0.2% (31.4ms) | Total: 0.2% (31.4ms) | Samples: 47

**Called by:**
- `jacobiEigenSymmetric` (25)
- `jacobiEigenSymmetric` (22)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.2% (30.8ms) | Total: 0.6% (69.7ms) | Samples: 48

**Called by:**
- `step` (108)

**Calls:**
- `from` (60)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.2% (28.9ms) | Total: 0.2% (28.9ms) | Samples: 47

**Called by:**
- `(anonymous)` (22)
- `step` (15)
- `step` (10)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.2% (23.5ms) | Total: 0.2% (23.5ms) | Samples: 36

**Called by:**
- `from` (36)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:20` | Self: 0.2% (22.9ms) | Total: 0.2% (22.9ms) | Samples: 33

**Called by:**
- `whitenWithEigensystem` (11)
- `transformFromEigenCoordinates` (10)
- `whitenWithEigensystem` (10)
- `step` (2)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` | Self: 0.1% (20.1ms) | Total: 0.6% (69.7ms) | Samples: 32

**Called by:**
- `step` (105)

**Calls:**
- `fill` (73)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:300` | Self: 0.1% (14.5ms) | Total: 0.1% (14.5ms) | Samples: 22

**Called by:**
- `step` (22)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:520` | Self: 0.1% (13.0ms) | Total: 0.1% (14.4ms) | Samples: 21

**Called by:**
- `(anonymous)` (22)
- `step` (1)

**Calls:**
- `requireFiniteVector` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:637` | Self: 0.1% (12.0ms) | Total: 0.1% (12.0ms) | Samples: 18

**Called by:**
- `runTrial` (18)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` | Self: 0.1% (11.7ms) | Total: 0.7% (81.4ms) | Samples: 18

**Called by:**
- `runTrial` (122)
- `runTrial` (1)

**Calls:**
- `ellipsoidObjective` (105)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:181` | Self: 0.0% (8.7ms) | Total: 0.0% (8.7ms) | Samples: 14

**Called by:**
- `sort` (14)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:622` | Self: 0.0% (8.5ms) | Total: 0.0% (8.5ms) | Samples: 14

**Called by:**
- `runTrial` (14)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` | Self: 0.0% (8.1ms) | Total: 0.0% (8.1ms) | Samples: 13

**Called by:**
- `step` (13)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` | Self: 0.0% (7.3ms) | Total: 2.6% (294.0ms) | Samples: 2

**Called by:**
- `runTrial` (439)
- `runTrial` (2)

**Calls:**
- `reconstructSymmetric` (439)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:686` | Self: 0.0% (7.0ms) | Total: 0.0% (7.0ms) | Samples: 11

**Called by:**
- `runTrial` (11)

### `vecDot`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (6.3ms) | Total: 0.0% (6.3ms) | Samples: 10

**Called by:**
- `step` (10)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` | Self: 0.0% (6.1ms) | Total: 0.0% (6.1ms) | Samples: 7

**Called by:**
- `runTrial` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` | Self: 0.0% (5.6ms) | Total: 0.0% (6.3ms) | Samples: 9

**Called by:**
- `runTrial` (10)

**Calls:**
- `radius` (1)

### `anonymous`
`[native code]` | Self: 0.0% (5.1ms) | Total: 0.1% (21.7ms) | Samples: 8

**Called by:**
- `(anonymous)` (6)
- `node:fs` (4)
- `internal:fs/streams` (3)
- `get WriteStream` (3)
- `node:fs/promises` (3)
- `node:stream` (3)
- `internal:stream` (2)
- `node:events` (1)
- `internal:validators` (1)
- `node:fs` (1)
- `internal:promisify` (1)
- `internal:shared` (1)
- `internal:streams/operators` (1)
- `internal:streams/compose` (1)
- `internal:streams/duplex` (1)
- `internal:streams/pipeline` (1)
- `internal:stream` (1)

**Calls:**
- `node:fs` (4)
- `internal:fs/streams` (3)
- `node:fs/promises` (3)
- `node:stream` (3)
- `internal:stream` (2)
- `node:events` (1)
- `internal:validators` (1)
- `node:fs` (1)
- `internal:streams/pipeline` (1)
- `internal:promisify` (1)
- `internal:shared` (1)
- `internal:streams/operators` (1)
- `internal:streams/compose` (1)
- `internal:streams/duplex` (1)
- `internal:stream` (1)
- `node:events` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:557` | Self: 0.0% (5.0ms) | Total: 2.2% (248.8ms) | Samples: 8

**Called by:**
- `runTrial` (379)
- `runTrial` (2)

**Calls:**
- `sampleGaussianVectorND` (338)
- `sampleGaussianVectorND` (22)
- `push` (7)
- `sampleGaussianVectorND` (3)
- `sampleGaussianVectorND` (2)
- `sampleGaussianVectorND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:621` | Self: 0.0% (5.0ms) | Total: 0.1% (11.4ms) | Samples: 8

**Called by:**
- `runTrial` (18)

**Calls:**
- `vecDot` (10)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` | Self: 0.0% (4.8ms) | Total: 0.1% (16.7ms) | Samples: 7

**Called by:**
- `step` (25)

**Calls:**
- `map` (14)
- `max` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` | Self: 0.0% (4.8ms) | Total: 0.6% (70.6ms) | Samples: 8

**Called by:**
- `runTrial` (111)

**Calls:**
- `map` (103)

### `abs`
`[native code]` | Self: 0.0% (4.8ms) | Total: 0.0% (4.8ms) | Samples: 7

**Called by:**
- `map` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:631` | Self: 0.0% (4.5ms) | Total: 0.0% (4.5ms) | Samples: 7

**Called by:**
- `runTrial` (7)

### `exp`
`[native code]` | Self: 0.0% (4.5ms) | Total: 0.0% (5.9ms) | Samples: 1

**Called by:**
- `step` (3)

**Calls:**
- `from` (2)

### `push`
`[native code]` | Self: 0.0% (4.1ms) | Total: 0.0% (4.1ms) | Samples: 7

**Called by:**
- `step` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:689` | Self: 0.0% (3.8ms) | Total: 0.0% (3.8ms) | Samples: 6

**Called by:**
- `runTrial` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:558` | Self: 0.0% (3.7ms) | Total: 4.4% (506.7ms) | Samples: 6

**Called by:**
- `runTrial` (776)
- `runTrial` (1)

**Calls:**
- `transformFromEigenCoordinates` (755)
- `transformFromEigenCoordinates` (13)
- `transformFromEigenCoordinates` (2)
- `transformFromEigenCoordinates` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:567` | Self: 0.0% (3.2ms) | Total: 0.0% (3.2ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` | Self: 0.0% (3.2ms) | Total: 0.0% (3.2ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:601` | Self: 0.0% (3.2ms) | Total: 0.0% (4.6ms) | Samples: 5

**Called by:**
- `runTrial` (7)

**Calls:**
- `vecNorm` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:690` | Self: 0.0% (3.1ms) | Total: 0.0% (3.1ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:551` | Self: 0.0% (3.1ms) | Total: 0.0% (3.1ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:522` | Self: 0.0% (3.0ms) | Total: 0.0% (3.0ms) | Samples: 5

**Called by:**
- `(anonymous)` (3)
- `step` (2)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:266` | Self: 0.0% (2.8ms) | Total: 0.0% (2.8ms) | Samples: 4

**Called by:**
- `step` (3)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (2.7ms) | Total: 0.0% (2.7ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `max`
`[native code]` | Self: 0.0% (2.7ms) | Total: 0.0% (2.7ms) | Samples: 4

**Called by:**
- `jacobiEigenSymmetric` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` | Self: 0.0% (2.5ms) | Total: 0.0% (3.1ms) | Samples: 4

**Called by:**
- `runTrial` (5)

**Calls:**
- `variancePercent` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:661` | Self: 0.0% (2.0ms) | Total: 0.0% (3.1ms) | Samples: 3

**Called by:**
- `runTrial` (5)

**Calls:**
- `reduce` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` | Self: 0.0% (2.0ms) | Total: 0.0% (2.0ms) | Samples: 3

**Called by:**
- `step` (3)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.9ms) | Total: 0.0% (1.9ms) | Samples: 3

**Called by:**
- `step` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:553` | Self: 0.0% (1.9ms) | Total: 0.0% (1.9ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:521` | Self: 0.0% (1.9ms) | Total: 0.0% (2.4ms) | Samples: 3

**Called by:**
- `(anonymous)` (3)
- `step` (1)

**Calls:**
- `some` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:552` | Self: 0.0% (1.9ms) | Total: 0.0% (1.9ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` | Self: 0.0% (1.8ms) | Total: 0.1% (21.2ms) | Samples: 3

**Called by:**
- `runTrial` (33)

**Calls:**
- `sort` (30)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:657` | Self: 0.0% (1.8ms) | Total: 0.1% (14.6ms) | Samples: 3

**Called by:**
- `forEach` (22)
- `map` (1)

**Calls:**
- `map` (20)

### `forEach`
`[native code]` | Self: 0.0% (1.8ms) | Total: 1.4% (163.8ms) | Samples: 3

**Called by:**
- `step` (253)
- `step` (3)

**Calls:**
- `(anonymous)` (231)
- `(anonymous)` (22)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` | Self: 0.0% (1.8ms) | Total: 0.0% (1.8ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:672` | Self: 0.0% (1.7ms) | Total: 0.0% (1.7ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `integerArgument`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:14` | Self: 0.0% (1.7ms) | Total: 0.0% (1.7ms) | Samples: 1

**Called by:**
- `(module)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:656` | Self: 0.0% (1.6ms) | Total: 1.4% (163.6ms) | Samples: 3

**Called by:**
- `runTrial` (255)
- `runTrial` (1)

**Calls:**
- `forEach` (253)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` | Self: 0.0% (1.5ms) | Total: 0.7% (85.0ms) | Samples: 2

**Called by:**
- `(anonymous)` (132)

**Calls:**
- `coordinate` (130)

### `vecNorm`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `step` (2)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:88` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 1

### `nextOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `sampleGaussianVectorND` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `sort` (2)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:650` | Self: 0.0% (1.2ms) | Total: 0.0% (1.9ms) | Samples: 2

**Called by:**
- `runTrial` (3)

**Calls:**
- `min` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` | Self: 0.0% (1.2ms) | Total: 0.5% (56.4ms) | Samples: 2

**Called by:**
- `map` (88)

**Calls:**
- `map` (86)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:685` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:696` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:180` | Self: 0.0% (1.2ms) | Total: 0.2% (31.6ms) | Samples: 2

**Called by:**
- `step` (50)

**Calls:**
- `sort` (43)
- `from` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` | Self: 0.0% (1.1ms) | Total: 0.0% (1.1ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:304` | Self: 0.0% (1.1ms) | Total: 0.0% (1.1ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` | Self: 0.0% (1.1ms) | Total: 0.0% (7.9ms) | Samples: 2

**Called by:**
- `runTrial` (11)
- `runTrial` (1)

**Calls:**
- `map` (10)

### `reduce`
`[native code]` | Self: 0.0% (1.1ms) | Total: 0.0% (1.1ms) | Samples: 2

**Called by:**
- `step` (2)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:271` | Self: 0.0% (1.1ms) | Total: 0.0% (1.1ms) | Samples: 2

**Called by:**
- `step` (2)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.0ms) | Total: 0.0% (1.0ms) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` | Self: 0.0% (753us) | Total: 0.6% (78.4ms) | Samples: 1

**Called by:**
- `runTrial` (119)
- `runTrial` (1)

**Calls:**
- `map` (119)

### `repair`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:499` | Self: 0.0% (747us) | Total: 0.0% (747us) | Samples: 1

**Called by:**
- `map` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:307` | Self: 0.0% (744us) | Total: 0.0% (744us) | Samples: 1

**Called by:**
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` | Self: 0.0% (739us) | Total: 0.0% (739us) | Samples: 1

**Called by:**
- `map` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` | Self: 0.0% (734us) | Total: 0.5% (61.3ms) | Samples: 1

**Called by:**
- `some` (97)

**Calls:**
- `some` (96)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:590` | Self: 0.0% (728us) | Total: 0.0% (728us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` | Self: 0.0% (726us) | Total: 0.0% (726us) | Samples: 1

**Called by:**
- `map` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:446` | Self: 0.0% (726us) | Total: 0.0% (726us) | Samples: 1

**Called by:**
- `nextOpenUnit` (1)

### `every`
`[native code]` | Self: 0.0% (725us) | Total: 0.0% (725us) | Samples: 1

**Called by:**
- `requireFiniteVector` (1)

### `requireFiniteVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:369` | Self: 0.0% (703us) | Total: 0.0% (1.4ms) | Samples: 1

**Called by:**
- `projectTo3D` (2)

**Calls:**
- `every` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` | Self: 0.0% (698us) | Total: 4.5% (508.6ms) | Samples: 1

**Called by:**
- `runTrial` (784)
- `runTrial` (8)

**Calls:**
- `whitenWithEigensystem` (454)
- `whitenWithEigensystem` (330)
- `whitenWithEigensystem` (3)
- `whitenWithEigensystem` (2)
- `whitenWithEigensystem` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` | Self: 0.0% (696us) | Total: 0.0% (8.8ms) | Samples: 1

**Called by:**
- `runTrial` (11)

**Calls:**
- `map` (10)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:127` | Self: 0.0% (692us) | Total: 0.0% (692us) | Samples: 1

**Called by:**
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.0% (686us) | Total: 0.0% (686us) | Samples: 1

**Called by:**
- `step` (1)

### `min`
`[native code]` | Self: 0.0% (673us) | Total: 0.0% (673us) | Samples: 1

**Called by:**
- `step` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` | Self: 0.0% (668us) | Total: 0.0% (1.9ms) | Samples: 1

**Called by:**
- `(module)` (3)

**Calls:**
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:649` | Self: 0.0% (666us) | Total: 0.0% (666us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` | Self: 0.0% (656us) | Total: 1.1% (133.7ms) | Samples: 1

**Called by:**
- `runTrial` (207)

**Calls:**
- `alignProjectionBasis` (92)
- `alignProjectionBasis` (70)
- `alignProjectionBasis` (43)
- `alignProjectionBasis` (1)

### `radius`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (656us) | Total: 0.0% (656us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` | Self: 0.0% (652us) | Total: 0.5% (61.8ms) | Samples: 1

**Called by:**
- `runTrial` (96)

**Calls:**
- `map` (95)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (645us) | Total: 0.0% (645us) | Samples: 1

**Called by:**
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` | Self: 0.0% (640us) | Total: 0.0% (4.9ms) | Samples: 1

**Called by:**
- `step` (8)

**Calls:**
- `map` (7)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (635us) | Total: 0.0% (635us) | Samples: 1

**Called by:**
- `step` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:85` | Self: 0.0% (633us) | Total: 0.0% (633us) | Samples: 1

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` | Self: 0.0% (603us) | Total: 0.0% (603us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `adaptationPoint`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (593us) | Total: 0.0% (593us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` | Self: 0.0% (584us) | Total: 0.0% (3.9ms) | Samples: 1

**Called by:**
- `runTrial` (6)

**Calls:**
- `createZeroVector` (3)
- `createZeroVector` (2)

### `isServerConfig`
`bun:main` | Self: 0.0% (574us) | Total: 0.0% (574us) | Samples: 1

**Called by:**
- `(module)` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:144` | Self: 0.0% (570us) | Total: 0.0% (570us) | Samples: 1

**Called by:**
- `step` (1)

### `node:events`
`node:events:378` | Self: 0.0% (561us) | Total: 0.0% (561us) | Samples: 1

**Called by:**
- `anonymous` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:169` | Self: 0.0% (559us) | Total: 0.0% (559us) | Samples: 1

**Called by:**
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:165` | Self: 0.0% (551us) | Total: 0.0% (551us) | Samples: 1

**Called by:**
- `step` (1)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (548us) | Total: 0.0% (548us) | Samples: 1

**Called by:**
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` | Self: 0.0% (546us) | Total: 0.0% (546us) | Samples: 1

**Called by:**
- `map` (1)

### `variancePercent`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (542us) | Total: 0.0% (542us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:648` | Self: 0.0% (520us) | Total: 0.0% (6.4ms) | Samples: 1

**Called by:**
- `runTrial` (4)

**Calls:**
- `exp` (3)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (2.5ms) | Samples: 0

**Called by:**
- `anonymous` (4)

**Calls:**
- `anonymous` (4)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (2.0ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (639us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` | Self: 0.0% (0us) | Total: 0.2% (32.9ms) | Samples: 0

**Called by:**
- `step` (49)
- `createIdentityMatrix` (1)

**Calls:**
- `from` (50)

### `(module)`
`bun:main:14` | Self: 0.0% (0us) | Total: 0.0% (574us) | Samples: 0

**Calls:**
- `isServerConfig` (1)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (639us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` | Self: 0.0% (0us) | Total: 0.1% (14.9ms) | Samples: 0

**Called by:**
- `step` (22)

**Calls:**
- `Float64Array` (22)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` | Self: 0.0% (0us) | Total: 1.1% (124.2ms) | Samples: 0

**Called by:**
- `alignProjectionBasis` (89)
- `step` (65)
- `alignProjectionBasis` (39)

**Calls:**
- `map` (193)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` | Self: 0.0% (0us) | Total: 0.0% (3.8ms) | Samples: 0

**Called by:**
- `runTrial` (6)

**Calls:**
- `map` (6)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:419` | Self: 0.0% (0us) | Total: 0.0% (557us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:655` | Self: 0.0% (0us) | Total: 0.0% (5.6ms) | Samples: 0

**Called by:**
- `runTrial` (9)

**Calls:**
- `map` (9)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` | Self: 0.0% (0us) | Total: 6.5% (734.4ms) | Samples: 0

**Calls:**
- `runTrial` (1124)
- `runTrial` (8)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:675` | Self: 0.0% (0us) | Total: 0.0% (9.5ms) | Samples: 0

**Called by:**
- `runTrial` (16)

**Calls:**
- `projectTo3D` (15)
- `projectTo3D` (1)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (2.0ms) | Samples: 0

**Called by:**
- `(anonymous)` (3)

**Calls:**
- `anonymous` (3)

### `internal:promisify`
`internal:promisify:53` | Self: 0.0% (0us) | Total: 0.0% (482us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (1.7ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` | Self: 0.0% (0us) | Total: 99.4% (11.21s) | Samples: 0

**Called by:**
- `(module)` (16267)
- `(module)` (1124)

**Calls:**
- `step` (7119)
- `step` (4319)
- `step` (1135)
- `step` (916)
- `step` (784)
- `step` (776)
- `step` (439)
- `step` (379)
- `step` (255)
- `step` (207)
- `step` (155)
- `step` (122)
- `step` (119)
- `step` (111)
- `step` (96)
- `step` (75)
- `step` (53)
- `step` (53)
- `step` (33)
- `step` (18)
- `step` (18)
- `step` (16)
- `step` (14)
- `step` (13)
- `step` (11)
- `step` (11)
- `step` (11)
- `step` (11)
- `step` (10)
- `step` (9)
- `step` (7)
- `step` (7)
- `step` (7)
- `step` (6)
- `step` (6)
- `step` (6)
- `step` (5)
- `step` (5)
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
- `step` (3)
- `step` (2)
- `step` (2)
- `step` (2)
- `step` (1)
- `step` (1)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` | Self: 0.0% (0us) | Total: 0.0% (8.0ms) | Samples: 0

**Called by:**
- `runTrial` (13)

**Calls:**
- `projectTo3D` (10)
- `projectTo3D` (2)
- `projectTo3D` (1)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (752us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `nextOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:278` | Self: 0.0% (0us) | Total: 0.0% (726us) | Samples: 0

**Called by:**
- `sampleGaussianVectorND` (1)

**Calls:**
- `(anonymous)` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` | Self: 0.0% (0us) | Total: 0.0% (5.1ms) | Samples: 0

**Called by:**
- `step` (8)

**Calls:**
- `map` (8)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (639us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:302` | Self: 0.0% (0us) | Total: 0.0% (2.1ms) | Samples: 0

**Called by:**
- `step` (3)

**Calls:**
- `nextOpenUnit` (2)
- `nextOpenUnit` (1)

### `internal:stream`
`internal:stream:47` | Self: 0.0% (0us) | Total: 0.0% (720us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:546` | Self: 0.0% (0us) | Total: 0.2% (27.1ms) | Samples: 0

**Called by:**
- `step` (43)

**Calls:**
- `cloneMatrix` (39)
- `map` (4)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.2ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (752us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:106` | Self: 0.0% (0us) | Total: 0.5% (62.0ms) | Samples: 0

**Called by:**
- `step` (98)

**Calls:**
- `validateSquareFiniteMatrix` (98)

### `node:fs`
`node:fs:299` | Self: 0.0% (0us) | Total: 0.0% (482us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` | Self: 0.0% (0us) | Total: 93.3% (10.53s) | Samples: 0

**Calls:**
- `runTrial` (16267)
- `runTrial` (74)
- `runTrial` (3)

### `createIdentityMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:29` | Self: 0.0% (0us) | Total: 0.0% (688us) | Samples: 0

**Called by:**
- `CMAESOptimizerND` (1)

**Calls:**
- `createZeroMatrix` (1)

### `internal:streams/operators`
`internal:streams/operators:2` | Self: 0.0% (0us) | Total: 0.0% (534us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:644` | Self: 0.0% (0us) | Total: 40.8% (4.60s) | Samples: 0

**Called by:**
- `runTrial` (7119)
- `runTrial` (35)

**Calls:**
- `jacobiEigenSymmetric` (3367)
- `jacobiEigenSymmetric` (3334)
- `jacobiEigenSymmetric` (126)
- `jacobiEigenSymmetric` (108)
- `jacobiEigenSymmetric` (98)
- `jacobiEigenSymmetric` (50)
- `jacobiEigenSymmetric` (25)
- `jacobiEigenSymmetric` (22)
- `jacobiEigenSymmetric` (8)
- `jacobiEigenSymmetric` (8)
- `jacobiEigenSymmetric` (3)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (752us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` | Self: 0.0% (0us) | Total: 0.5% (62.0ms) | Samples: 0

**Called by:**
- `jacobiEigenSymmetric` (98)

**Calls:**
- `some` (98)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:450` | Self: 0.0% (0us) | Total: 0.0% (688us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `createIdentityMatrix` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:534` | Self: 0.0% (0us) | Total: 0.5% (59.1ms) | Samples: 0

**Called by:**
- `step` (92)

**Calls:**
- `cloneMatrix` (89)
- `map` (3)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` | Self: 0.0% (0us) | Total: 0.0% (5.6ms) | Samples: 0

**Calls:**
- `(anonymous)` (9)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (5.6ms) | Samples: 0

**Called by:**
- `(module)` (9)

**Calls:**
- `anonymous` (6)
- `get WriteStream` (3)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` | Self: 0.0% (0us) | Total: 0.4% (53.9ms) | Samples: 0

**Called by:**
- `(module)` (74)
- `(module)` (8)

**Calls:**
- `step` (35)
- `step` (18)
- `step` (8)
- `step` (7)
- `step` (4)
- `step` (2)
- `step` (2)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:24` | Self: 0.0% (0us) | Total: 0.0% (1.7ms) | Samples: 0

**Calls:**
- `integerArgument` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:578` | Self: 0.0% (0us) | Total: 0.0% (1.8ms) | Samples: 0

**Called by:**
- `runTrial` (3)

**Calls:**
- `forEach` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:684` | Self: 0.0% (0us) | Total: 0.4% (49.2ms) | Samples: 0

**Called by:**
- `runTrial` (75)

**Calls:**
- `cloneMatrix` (65)
- `map` (9)
- `cloneMatrix` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` | Self: 0.0% (0us) | Total: 0.0% (6.6ms) | Samples: 0

**Called by:**
- `runTrial` (11)

**Calls:**
- `map` (11)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (2.0ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:596` | Self: 0.0% (0us) | Total: 0.8% (101.0ms) | Samples: 0

**Called by:**
- `runTrial` (155)

**Calls:**
- `whitenWithEigensystem` (80)
- `whitenWithEigensystem` (74)
- `whitenWithEigensystem` (1)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 93.4% | 10.54s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 6.3% | 711.4ms | `[native code]` |
| 0.2% | 24.6ms | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.0% | 574us | `bun:main` |
| 0.0% | 561us | `node:events` |
