# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 9.87s | 15256 | 500us | 167 |

**Top 10:** `jacobiEigenSymmetricOwned` 21.1%, `jacobiEigenSymmetricOwned` 20.7%, `step` 16.4%, `transformFromEigenCoordinates` 4.8%, `step` 3.6%, `whitenWithEigensystem` 3.1%, `reconstructSymmetric` 2.8%, `step` 2.8%, `whitenWithEigensystem` 2.6%, `map` 2.0%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 21.1% | 2.08s | 21.9% | 2.16s | `jacobiEigenSymmetricOwned` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:114` |
| 20.7% | 2.04s | 21.9% | 2.16s | `jacobiEigenSymmetricOwned` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:115` |
| 16.4% | 1.62s | 16.4% | 1.62s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` |
| 4.8% | 474.9ms | 4.9% | 489.9ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:257` |
| 3.6% | 356.3ms | 3.8% | 380.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:664` |
| 3.1% | 309.9ms | 3.2% | 315.7ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:279` |
| 2.8% | 280.9ms | 3.3% | 333.6ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:238` |
| 2.8% | 279.4ms | 2.8% | 279.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:646` |
| 2.6% | 258.9ms | 2.7% | 270.5ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 2.0% | 205.4ms | 4.3% | 432.3ms | `map` | `[native code]` |
| 2.0% | 200.7ms | 2.0% | 200.7ms | `hypot` | `[native code]` |
| 1.8% | 187.1ms | 1.8% | 187.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` |
| 1.7% | 174.4ms | 1.7% | 174.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:663` |
| 1.3% | 130.7ms | 1.3% | 130.7ms | `fill` | `[native code]` |
| 1.2% | 127.4ms | 1.9% | 193.4ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.0% | 108.2ms | 1.0% | 108.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:655` |
| 1.0% | 102.1ms | 1.2% | 119.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:660` |
| 0.9% | 94.2ms | 0.9% | 94.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.8% | 84.5ms | 0.8% | 84.5ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.8% | 81.0ms | 0.8% | 81.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` |
| 0.4% | 44.7ms | 0.5% | 49.3ms | `sort` | `[native code]` |
| 0.4% | 41.0ms | 0.4% | 41.0ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:552` |
| 0.3% | 39.4ms | 0.8% | 80.1ms | `jacobiEigenSymmetricOwned` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:162` |
| 0.3% | 36.9ms | 0.3% | 38.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:599` |
| 0.3% | 36.7ms | 1.3% | 130.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:687` |
| 0.3% | 33.8ms | 0.7% | 75.3ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.3% | 30.0ms | 0.3% | 30.0ms | `Float64Array` | `[native code]` |
| 0.2% | 29.5ms | 0.9% | 97.7ms | `from` | `[native code]` |
| 0.2% | 27.9ms | 0.2% | 27.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` |
| 0.2% | 27.4ms | 0.2% | 27.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:162` |
| 0.2% | 24.4ms | 0.2% | 24.4ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:20` |
| 0.2% | 22.2ms | 0.2% | 22.2ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:310` |
| 0.1% | 17.4ms | 0.1% | 17.4ms | `max` | `[native code]` |
| 0.1% | 17.3ms | 0.1% | 17.3ms | `isFinite` | `[native code]` |
| 0.1% | 10.5ms | 0.1% | 10.5ms | `push` | `[native code]` |
| 0.1% | 10.4ms | 0.8% | 86.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:571` |
| 0.0% | 9.6ms | 0.0% | 9.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` |
| 0.0% | 9.3ms | 0.0% | 9.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:699` |
| 0.0% | 8.3ms | 0.0% | 8.3ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 7.9ms | 0.0% | 7.9ms | `abs` | `[native code]` |
| 0.0% | 7.8ms | 0.0% | 7.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` |
| 0.0% | 7.5ms | 0.0% | 8.6ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` |
| 0.0% | 7.2ms | 0.0% | 7.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:657` |
| 0.0% | 7.1ms | 0.0% | 7.7ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:540` |
| 0.0% | 6.3ms | 0.0% | 6.3ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:260` |
| 0.0% | 5.8ms | 0.0% | 5.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` |
| 0.0% | 5.8ms | 2.3% | 235.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:567` |
| 0.0% | 5.7ms | 0.0% | 5.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` |
| 0.0% | 5.0ms | 0.0% | 7.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:631` |
| 0.0% | 4.2ms | 0.1% | 19.0ms | `anonymous` | `[native code]` |
| 0.0% | 3.9ms | 0.0% | 3.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:156` |
| 0.0% | 3.9ms | 0.0% | 3.9ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:532` |
| 0.0% | 3.9ms | 0.0% | 3.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:573` |
| 0.0% | 3.5ms | 0.0% | 3.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:718` |
| 0.0% | 3.4ms | 0.2% | 20.6ms | `jacobiEigenSymmetricOwned` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:94` |
| 0.0% | 3.3ms | 0.0% | 3.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:719` |
| 0.0% | 3.1ms | 0.0% | 7.6ms | `jacobiEigenSymmetricOwned` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:159` |
| 0.0% | 2.9ms | 0.9% | 92.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:569` |
| 0.0% | 2.6ms | 0.0% | 3.2ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:531` |
| 0.0% | 2.5ms | 0.0% | 2.5ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.5ms | 0.0% | 2.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:714` |
| 0.0% | 2.4ms | 0.0% | 3.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:725` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `reduce` | `[native code]` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:677` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:569` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:259` |
| 0.0% | 1.9ms | 0.0% | 9.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:708` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:701` |
| 0.0% | 1.9ms | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:653` |
| 0.0% | 1.3ms | 0.7% | 71.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 0.0% | 1.3ms | 0.3% | 31.7ms | `jacobiEigenSymmetricOwned` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:155` |
| 0.0% | 1.3ms | 0.1% | 17.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:686` |
| 0.0% | 1.3ms | 0.1% | 14.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` |
| 0.0% | 1.2ms | 0.0% | 7.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:608` |
| 0.0% | 1.1ms | 0.2% | 22.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `integerArgument` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:14` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `every` | `[native code]` |
| 0.0% | 777us | 0.5% | 52.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:620` |
| 0.0% | 761us | 0.0% | 761us | `jacobiEigenSymmetricOwned` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` |
| 0.0% | 745us | 0.0% | 745us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` |
| 0.0% | 725us | 0.0% | 725us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:312` |
| 0.0% | 720us | 0.0% | 720us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:678` |
| 0.0% | 703us | 0.0% | 703us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 703us | 0.0% | 703us | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 703us | 0.0% | 703us | `sqrt` | `[native code]` |
| 0.0% | 702us | 0.8% | 87.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.0% | 701us | 0.1% | 10.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:705` |
| 0.0% | 695us | 0.0% | 695us | `internal:streams/destroy` | `internal:streams/destroy:16` |
| 0.0% | 690us | 0.0% | 690us | `min` | `[native code]` |
| 0.0% | 688us | 0.4% | 45.2ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:544` |
| 0.0% | 687us | 0.0% | 687us | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:509` |
| 0.0% | 683us | 0.0% | 683us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:391` |
| 0.0% | 668us | 0.0% | 668us | `filter` | `[native code]` |
| 0.0% | 648us | 0.0% | 648us | `jacobiEigenSymmetricOwned` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:116` |
| 0.0% | 645us | 1.1% | 108.7ms | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` |
| 0.0% | 631us | 0.0% | 3.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:690` |
| 0.0% | 623us | 99.4% | 9.81s | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 0.0% | 615us | 0.0% | 615us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` |
| 0.0% | 606us | 0.0% | 606us | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:537` |
| 0.0% | 606us | 0.0% | 606us | `safeObjectiveValue` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:385` |
| 0.0% | 603us | 5.0% | 500.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:568` |
| 0.0% | 582us | 0.0% | 582us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.0% | 571us | 0.0% | 571us | `some` | `[native code]` |
| 0.0% | 567us | 0.0% | 567us | `WriteStream` | `internal:fs/streams` |
| 0.0% | 556us | 0.0% | 556us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.0% | 545us | 1.5% | 149.0ms | `forEach` | `[native code]` |
| 0.0% | 532us | 0.0% | 532us | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:242` |
| 0.0% | 525us | 0.0% | 525us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` |
| 0.0% | 523us | 0.0% | 1.9ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:314` |
| 0.0% | 519us | 0.0% | 519us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 0.0% | 418us | 3.3% | 334.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 99.4% | 9.81s | 0.0% | 623us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 93.4% | 9.22s | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` |
| 45.4% | 4.48s | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:667` |
| 21.9% | 2.16s | 21.1% | 2.08s | `jacobiEigenSymmetricOwned` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:114` |
| 21.9% | 2.16s | 20.7% | 2.04s | `jacobiEigenSymmetricOwned` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:115` |
| 16.4% | 1.62s | 16.4% | 1.62s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` |
| 6.4% | 635.1ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` |
| 5.1% | 507.4ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:626` |
| 5.0% | 500.8ms | 0.0% | 603us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:568` |
| 4.9% | 489.9ms | 4.8% | 474.9ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:257` |
| 4.3% | 432.3ms | 2.0% | 205.4ms | `map` | `[native code]` |
| 3.8% | 380.0ms | 3.6% | 356.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:664` |
| 3.3% | 334.5ms | 0.0% | 418us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |
| 3.3% | 333.6ms | 2.8% | 280.9ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:238` |
| 3.2% | 315.7ms | 3.1% | 309.9ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:279` |
| 2.8% | 279.4ms | 2.8% | 279.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:646` |
| 2.7% | 270.5ms | 2.6% | 258.9ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 2.3% | 235.2ms | 0.0% | 5.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:567` |
| 2.0% | 200.7ms | 2.0% | 200.7ms | `hypot` | `[native code]` |
| 1.9% | 193.4ms | 1.2% | 127.4ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.8% | 187.1ms | 1.8% | 187.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` |
| 1.7% | 174.4ms | 1.7% | 174.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:663` |
| 1.5% | 149.0ms | 0.0% | 545us | `forEach` | `[native code]` |
| 1.5% | 148.4ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:685` |
| 1.3% | 130.7ms | 0.3% | 36.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:687` |
| 1.3% | 130.7ms | 1.3% | 130.7ms | `fill` | `[native code]` |
| 1.2% | 119.4ms | 1.0% | 102.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:660` |
| 1.2% | 119.2ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:683` |
| 1.1% | 108.7ms | 0.0% | 645us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` |
| 1.0% | 108.2ms | 1.0% | 108.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:655` |
| 0.9% | 97.7ms | 0.2% | 29.5ms | `from` | `[native code]` |
| 0.9% | 94.2ms | 0.9% | 94.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.9% | 92.1ms | 0.0% | 2.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:569` |
| 0.8% | 87.8ms | 0.0% | 702us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.8% | 86.3ms | 0.1% | 10.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:571` |
| 0.8% | 84.5ms | 0.8% | 84.5ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.8% | 81.0ms | 0.8% | 81.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` |
| 0.8% | 80.1ms | 0.3% | 39.4ms | `jacobiEigenSymmetricOwned` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:162` |
| 0.7% | 75.3ms | 0.3% | 33.8ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.7% | 71.0ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 0.5% | 52.2ms | 0.0% | 777us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:620` |
| 0.5% | 49.3ms | 0.4% | 44.7ms | `sort` | `[native code]` |
| 0.4% | 48.8ms | 0.0% | 0us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:621` |
| 0.4% | 45.2ms | 0.0% | 688us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:544` |
| 0.4% | 43.0ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` |
| 0.4% | 41.0ms | 0.4% | 41.0ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:552` |
| 0.3% | 38.4ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:713` |
| 0.3% | 38.3ms | 0.3% | 36.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:599` |
| 0.3% | 32.2ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` |
| 0.3% | 31.7ms | 0.0% | 1.3ms | `jacobiEigenSymmetricOwned` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:155` |
| 0.3% | 30.0ms | 0.3% | 30.0ms | `Float64Array` | `[native code]` |
| 0.2% | 27.9ms | 0.2% | 27.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` |
| 0.2% | 27.4ms | 0.2% | 27.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:162` |
| 0.2% | 24.4ms | 0.2% | 24.4ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:20` |
| 0.2% | 22.7ms | 0.0% | 1.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.2% | 22.2ms | 0.2% | 22.2ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:310` |
| 0.2% | 20.6ms | 0.0% | 3.4ms | `jacobiEigenSymmetricOwned` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:94` |
| 0.1% | 19.0ms | 0.0% | 4.2ms | `anonymous` | `[native code]` |
| 0.1% | 17.7ms | 0.0% | 1.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:686` |
| 0.1% | 17.4ms | 0.1% | 17.4ms | `max` | `[native code]` |
| 0.1% | 17.3ms | 0.1% | 17.3ms | `isFinite` | `[native code]` |
| 0.1% | 14.1ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 0.1% | 10.5ms | 0.0% | 701us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:705` |
| 0.1% | 10.5ms | 0.1% | 10.5ms | `push` | `[native code]` |
| 0.0% | 9.6ms | 0.0% | 9.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` |
| 0.0% | 9.5ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:684` |
| 0.0% | 9.3ms | 0.0% | 9.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:699` |
| 0.0% | 9.2ms | 0.0% | 1.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:708` |
| 0.0% | 8.6ms | 0.0% | 7.5ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` |
| 0.0% | 8.3ms | 0.0% | 8.3ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 7.9ms | 0.0% | 7.9ms | `abs` | `[native code]` |
| 0.0% | 7.8ms | 0.0% | 7.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` |
| 0.0% | 7.7ms | 0.0% | 7.1ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:540` |
| 0.0% | 7.6ms | 0.0% | 3.1ms | `jacobiEigenSymmetricOwned` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:159` |
| 0.0% | 7.5ms | 0.0% | 5.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:631` |
| 0.0% | 7.5ms | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:608` |
| 0.0% | 7.2ms | 0.0% | 7.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:657` |
| 0.0% | 6.3ms | 0.0% | 6.3ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:260` |
| 0.0% | 5.8ms | 0.0% | 5.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` |
| 0.0% | 5.7ms | 0.0% | 5.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` |
| 0.0% | 5.5ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.0% | 5.5ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.0% | 4.5ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 0.0% | 4.4ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` |
| 0.0% | 4.3ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:704` |
| 0.0% | 3.9ms | 0.0% | 3.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:156` |
| 0.0% | 3.9ms | 0.0% | 3.9ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:532` |
| 0.0% | 3.9ms | 0.0% | 3.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:573` |
| 0.0% | 3.7ms | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:725` |
| 0.0% | 3.5ms | 0.0% | 3.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:718` |
| 0.0% | 3.3ms | 0.0% | 3.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` |
| 0.0% | 3.2ms | 0.0% | 0us | `jacobiEigenSymmetricOwned` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:158` |
| 0.0% | 3.2ms | 0.0% | 2.6ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:531` |
| 0.0% | 3.2ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:719` |
| 0.0% | 3.0ms | 0.0% | 631us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:690` |
| 0.0% | 2.5ms | 0.0% | 2.5ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.5ms | 0.0% | 2.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` |
| 0.0% | 2.5ms | 0.0% | 0us | `jacobiEigenSymmetricOwned` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:161` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:714` |
| 0.0% | 2.4ms | 0.0% | 1.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `reduce` | `[native code]` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.3ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 2.3ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:677` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:569` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:259` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:701` |
| 0.0% | 1.9ms | 0.0% | 523us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:314` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.8ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 1.8ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:597` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:653` |
| 0.0% | 1.2ms | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 1.2ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 1.2ms | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 1.2ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 1.2ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.2ms | 0.0% | 0us | `createIdentityMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:29` |
| 0.0% | 1.2ms | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:460` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` |
| 0.0% | 1.1ms | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:429` |
| 0.0% | 1.1ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:24` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `integerArgument` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:14` |
| 0.0% | 1.1ms | 0.0% | 0us | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:379` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `every` | `[native code]` |
| 0.0% | 761us | 0.0% | 761us | `jacobiEigenSymmetricOwned` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` |
| 0.0% | 745us | 0.0% | 745us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` |
| 0.0% | 732us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:475` |
| 0.0% | 730us | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:316` |
| 0.0% | 725us | 0.0% | 725us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:312` |
| 0.0% | 720us | 0.0% | 720us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:678` |
| 0.0% | 703us | 0.0% | 703us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 703us | 0.0% | 703us | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 703us | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` |
| 0.0% | 703us | 0.0% | 703us | `sqrt` | `[native code]` |
| 0.0% | 695us | 0.0% | 695us | `internal:streams/destroy` | `internal:streams/destroy:16` |
| 0.0% | 690us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:498` |
| 0.0% | 690us | 0.0% | 690us | `min` | `[native code]` |
| 0.0% | 687us | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:317` |
| 0.0% | 687us | 0.0% | 687us | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:509` |
| 0.0% | 683us | 0.0% | 683us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:391` |
| 0.0% | 668us | 0.0% | 668us | `filter` | `[native code]` |
| 0.0% | 668us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:473` |
| 0.0% | 648us | 0.0% | 648us | `jacobiEigenSymmetricOwned` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:116` |
| 0.0% | 615us | 0.0% | 615us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` |
| 0.0% | 606us | 0.0% | 606us | `safeObjectiveValue` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:385` |
| 0.0% | 606us | 0.0% | 606us | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:537` |
| 0.0% | 597us | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:313` |
| 0.0% | 595us | 0.0% | 0us | `internal:streams/readable` | `internal:streams/readable:14` |
| 0.0% | 595us | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 582us | 0.0% | 582us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.0% | 581us | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 581us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 581us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 571us | 0.0% | 571us | `some` | `[native code]` |
| 0.0% | 567us | 0.0% | 567us | `WriteStream` | `internal:fs/streams` |
| 0.0% | 556us | 0.0% | 556us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.0% | 545us | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:588` |
| 0.0% | 532us | 0.0% | 532us | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:242` |
| 0.0% | 525us | 0.0% | 525us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` |
| 0.0% | 519us | 0.0% | 519us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 0.0% | 514us | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:93` |

## Function Details

### `jacobiEigenSymmetricOwned`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:114` | Self: 21.1% (2.08s) | Total: 21.9% (2.16s) | Samples: 3233

**Called by:**
- `step` (3362)

**Calls:**
- `hypot` (129)

### `jacobiEigenSymmetricOwned`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:115` | Self: 20.7% (2.04s) | Total: 21.9% (2.16s) | Samples: 3157

**Called by:**
- `step` (3340)

**Calls:**
- `hypot` (183)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` | Self: 16.4% (1.62s) | Total: 16.4% (1.62s) | Samples: 2529

**Called by:**
- `runTrial` (2516)
- `runTrial` (13)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:257` | Self: 4.8% (474.9ms) | Total: 4.9% (489.9ms) | Samples: 735

**Called by:**
- `step` (757)

**Calls:**
- `createZeroVector` (13)
- `fill` (9)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:664` | Self: 3.6% (356.3ms) | Total: 3.8% (380.0ms) | Samples: 550

**Called by:**
- `runTrial` (580)
- `runTrial` (2)

**Calls:**
- `max` (21)
- `abs` (11)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:279` | Self: 3.1% (309.9ms) | Total: 3.2% (315.7ms) | Samples: 486

**Called by:**
- `step` (413)
- `step` (82)

**Calls:**
- `createZeroVector` (8)
- `fill` (1)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:238` | Self: 2.8% (280.9ms) | Total: 3.3% (333.6ms) | Samples: 439

**Called by:**
- `step` (520)

**Calls:**
- `from` (81)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:646` | Self: 2.8% (279.4ms) | Total: 2.8% (279.4ms) | Samples: 432

**Called by:**
- `runTrial` (431)
- `runTrial` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` | Self: 2.6% (258.9ms) | Total: 2.7% (270.5ms) | Samples: 397

**Called by:**
- `step` (360)
- `step` (55)

**Calls:**
- `createZeroVector` (15)
- `fill` (3)

### `map`
`[native code]` | Self: 2.0% (205.4ms) | Total: 4.3% (432.3ms) | Samples: 318

**Called by:**
- `cloneMatrix` (167)
- `step` (138)
- `step` (107)
- `step` (80)
- `(anonymous)` (76)
- `(anonymous)` (25)
- `step` (15)
- `step` (12)
- `step` (10)
- `step` (7)
- `jacobiEigenSymmetricOwned` (7)
- `step` (5)
- `step` (5)
- `jacobiEigenSymmetricOwned` (5)
- `jacobiEigenSymmetricOwned` (4)
- `alignProjectionBasis` (3)
- `alignProjectionBasis` (2)
- `CMAESOptimizerND` (1)

**Calls:**
- `(anonymous)` (144)
- `(anonymous)` (124)
- `(anonymous)` (76)
- `(anonymous)` (3)
- `abs` (2)
- `repair` (1)
- `repair` (1)

### `hypot`
`[native code]` | Self: 2.0% (200.7ms) | Total: 2.0% (200.7ms) | Samples: 312

**Called by:**
- `jacobiEigenSymmetricOwned` (183)
- `jacobiEigenSymmetricOwned` (129)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` | Self: 1.8% (187.1ms) | Total: 1.8% (187.1ms) | Samples: 290

**Called by:**
- `runTrial` (289)
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:663` | Self: 1.7% (174.4ms) | Total: 1.7% (174.4ms) | Samples: 271

**Called by:**
- `runTrial` (268)
- `runTrial` (3)

### `fill`
`[native code]` | Self: 1.3% (130.7ms) | Total: 1.3% (130.7ms) | Samples: 198

**Called by:**
- `sampleGaussianVectorND` (98)
- `ellipsoidObjective` (64)
- `from` (18)
- `transformFromEigenCoordinates` (9)
- `whitenWithEigensystem` (3)
- `step` (2)
- `sampleGaussianVectorND` (1)
- `whitenWithEigensystem` (1)
- `sampleGaussianVectorND` (1)
- `sampleGaussianVectorND` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.2% (127.4ms) | Total: 1.9% (193.4ms) | Samples: 199

**Called by:**
- `step` (297)

**Calls:**
- `fill` (98)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:655` | Self: 1.0% (108.2ms) | Total: 1.0% (108.2ms) | Samples: 168

**Called by:**
- `runTrial` (167)
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:660` | Self: 1.0% (102.1ms) | Total: 1.2% (119.4ms) | Samples: 157

**Called by:**
- `runTrial` (183)
- `runTrial` (1)

**Calls:**
- `isFinite` (27)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.9% (94.2ms) | Total: 0.9% (94.2ms) | Samples: 147

**Called by:**
- `map` (144)
- `from` (2)
- `CMAESOptimizerND` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.8% (84.5ms) | Total: 0.8% (84.5ms) | Samples: 133

**Called by:**
- `(anonymous)` (112)
- `step` (14)
- `step` (7)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` | Self: 0.8% (81.0ms) | Total: 0.8% (81.0ms) | Samples: 124

**Called by:**
- `map` (124)

### `sort`
`[native code]` | Self: 0.4% (44.7ms) | Total: 0.5% (49.3ms) | Samples: 66

**Called by:**
- `jacobiEigenSymmetricOwned` (40)
- `step` (32)
- `(module)` (1)

**Calls:**
- `(anonymous)` (6)
- `(anonymous)` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:552` | Self: 0.4% (41.0ms) | Total: 0.4% (41.0ms) | Samples: 64

**Called by:**
- `step` (64)

### `jacobiEigenSymmetricOwned`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:162` | Self: 0.3% (39.4ms) | Total: 0.8% (80.1ms) | Samples: 59

**Called by:**
- `step` (122)

**Calls:**
- `from` (63)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:599` | Self: 0.3% (36.9ms) | Total: 0.3% (38.3ms) | Samples: 58

**Called by:**
- `runTrial` (59)
- `runTrial` (1)

**Calls:**
- `adaptationPoint` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:687` | Self: 0.3% (36.7ms) | Total: 1.3% (130.7ms) | Samples: 58

**Called by:**
- `forEach` (205)

**Calls:**
- `projectTo3D` (112)
- `projectTo3D` (14)
- `projectTo3D` (11)
- `projectTo3D` (6)
- `projectTo3D` (4)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` | Self: 0.3% (33.8ms) | Total: 0.7% (75.3ms) | Samples: 52

**Called by:**
- `step` (116)

**Calls:**
- `fill` (64)

### `Float64Array`
`[native code]` | Self: 0.3% (30.0ms) | Total: 0.3% (30.0ms) | Samples: 44

**Called by:**
- `jacobiEigenSymmetricOwned` (25)
- `step` (19)

### `from`
`[native code]` | Self: 0.2% (29.5ms) | Total: 0.9% (97.7ms) | Samples: 46

**Called by:**
- `reconstructSymmetric` (81)
- `jacobiEigenSymmetricOwned` (63)
- `jacobiEigenSymmetricOwned` (5)
- `createIdentityMatrix` (2)

**Calls:**
- `(anonymous)` (43)
- `(anonymous)` (42)
- `fill` (18)
- `(anonymous)` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` | Self: 0.2% (27.9ms) | Total: 0.2% (27.9ms) | Samples: 42

**Called by:**
- `from` (42)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:162` | Self: 0.2% (27.4ms) | Total: 0.2% (27.4ms) | Samples: 43

**Called by:**
- `from` (43)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:20` | Self: 0.2% (24.4ms) | Total: 0.2% (24.4ms) | Samples: 37

**Called by:**
- `whitenWithEigensystem` (15)
- `transformFromEigenCoordinates` (13)
- `whitenWithEigensystem` (8)
- `step` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:310` | Self: 0.2% (22.2ms) | Total: 0.2% (22.2ms) | Samples: 35

**Called by:**
- `step` (35)

### `max`
`[native code]` | Self: 0.1% (17.4ms) | Total: 0.1% (17.4ms) | Samples: 22

**Called by:**
- `step` (21)
- `step` (1)

### `isFinite`
`[native code]` | Self: 0.1% (17.3ms) | Total: 0.1% (17.3ms) | Samples: 27

**Called by:**
- `step` (27)

### `push`
`[native code]` | Self: 0.1% (10.5ms) | Total: 0.1% (10.5ms) | Samples: 16

**Called by:**
- `step` (14)
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:571` | Self: 0.1% (10.4ms) | Total: 0.8% (86.3ms) | Samples: 16

**Called by:**
- `runTrial` (132)
- `runTrial` (1)

**Calls:**
- `ellipsoidObjective` (116)
- `safeObjectiveValue` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` | Self: 0.0% (9.6ms) | Total: 0.0% (9.6ms) | Samples: 15

**Called by:**
- `runTrial` (15)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:699` | Self: 0.0% (9.3ms) | Total: 0.0% (9.3ms) | Samples: 9

**Called by:**
- `runTrial` (9)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (8.3ms) | Total: 0.0% (8.3ms) | Samples: 9

**Called by:**
- `step` (8)
- `step` (1)

### `abs`
`[native code]` | Self: 0.0% (7.9ms) | Total: 0.0% (7.9ms) | Samples: 13

**Called by:**
- `step` (11)
- `map` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` | Self: 0.0% (7.8ms) | Total: 0.0% (7.8ms) | Samples: 11

**Called by:**
- `runTrial` (11)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` | Self: 0.0% (7.5ms) | Total: 0.0% (8.6ms) | Samples: 12

**Called by:**
- `(anonymous)` (14)

**Calls:**
- `requireFiniteVector` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:657` | Self: 0.0% (7.2ms) | Total: 0.0% (7.2ms) | Samples: 12

**Called by:**
- `runTrial` (12)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:540` | Self: 0.0% (7.1ms) | Total: 0.0% (7.7ms) | Samples: 11

**Called by:**
- `(anonymous)` (11)
- `step` (1)

**Calls:**
- `coordinate` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:260` | Self: 0.0% (6.3ms) | Total: 0.0% (6.3ms) | Samples: 10

**Called by:**
- `step` (10)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` | Self: 0.0% (5.8ms) | Total: 0.0% (5.8ms) | Samples: 8

**Called by:**
- `runTrial` (8)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:567` | Self: 0.0% (5.8ms) | Total: 2.3% (235.2ms) | Samples: 9

**Called by:**
- `runTrial` (361)
- `runTrial` (1)

**Calls:**
- `sampleGaussianVectorND` (297)
- `sampleGaussianVectorND` (35)
- `push` (14)
- `sampleGaussianVectorND` (3)
- `sampleGaussianVectorND` (1)
- `sampleGaussianVectorND` (1)
- `sampleGaussianVectorND` (1)
- `sampleGaussianVectorND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` | Self: 0.0% (5.7ms) | Total: 0.0% (5.7ms) | Samples: 9

**Called by:**
- `runTrial` (9)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:631` | Self: 0.0% (5.0ms) | Total: 0.0% (7.5ms) | Samples: 8

**Called by:**
- `runTrial` (12)

**Calls:**
- `vecDot` (4)

### `anonymous`
`[native code]` | Self: 0.0% (4.2ms) | Total: 0.1% (19.0ms) | Samples: 7

**Called by:**
- `(anonymous)` (5)
- `node:fs/promises` (4)
- `node:fs` (4)
- `get WriteStream` (3)
- `internal:fs/streams` (2)
- `internal:stream` (2)
- `internal:streams/pipeline` (2)
- `internal:streams/compose` (2)
- `node:stream` (2)
- `node:events` (1)
- `internal:validators` (1)
- `internal:streams/readable` (1)
- `internal:shared` (1)
- `internal:streams/duplex` (1)

**Calls:**
- `node:fs/promises` (4)
- `node:fs` (4)
- `internal:fs/streams` (2)
- `internal:streams/pipeline` (2)
- `internal:stream` (2)
- `internal:streams/compose` (2)
- `node:stream` (2)
- `node:events` (1)
- `internal:validators` (1)
- `internal:streams/destroy` (1)
- `internal:streams/readable` (1)
- `internal:shared` (1)
- `internal:streams/duplex` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:156` | Self: 0.0% (3.9ms) | Total: 0.0% (3.9ms) | Samples: 6

**Called by:**
- `sort` (6)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:532` | Self: 0.0% (3.9ms) | Total: 0.0% (3.9ms) | Samples: 6

**Called by:**
- `(anonymous)` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:573` | Self: 0.0% (3.9ms) | Total: 0.0% (3.9ms) | Samples: 6

**Called by:**
- `runTrial` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:718` | Self: 0.0% (3.5ms) | Total: 0.0% (3.5ms) | Samples: 6

**Called by:**
- `runTrial` (6)

### `jacobiEigenSymmetricOwned`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:94` | Self: 0.0% (3.4ms) | Total: 0.2% (20.6ms) | Samples: 5

**Called by:**
- `step` (30)

**Calls:**
- `Float64Array` (25)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` | Self: 0.0% (3.3ms) | Total: 0.0% (3.3ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:719` | Self: 0.0% (3.1ms) | Total: 0.0% (3.1ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `jacobiEigenSymmetricOwned`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:159` | Self: 0.0% (3.1ms) | Total: 0.0% (7.6ms) | Samples: 5

**Called by:**
- `step` (12)

**Calls:**
- `map` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:569` | Self: 0.0% (2.9ms) | Total: 0.9% (92.1ms) | Samples: 5

**Called by:**
- `runTrial` (142)
- `runTrial` (1)

**Calls:**
- `map` (138)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:531` | Self: 0.0% (2.6ms) | Total: 0.0% (3.2ms) | Samples: 3

**Called by:**
- `(anonymous)` (4)

**Calls:**
- `some` (1)

### `vecDot`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (2.5ms) | Total: 0.0% (2.5ms) | Samples: 4

**Called by:**
- `step` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` | Self: 0.0% (2.5ms) | Total: 0.0% (2.5ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:714` | Self: 0.0% (2.4ms) | Total: 0.0% (2.4ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:725` | Self: 0.0% (2.4ms) | Total: 0.0% (3.7ms) | Samples: 2

**Called by:**
- `runTrial` (4)

**Calls:**
- `push` (2)

### `reduce`
`[native code]` | Self: 0.0% (2.4ms) | Total: 0.0% (2.4ms) | Samples: 4

**Called by:**
- `step` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (2.4ms) | Total: 0.0% (2.4ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:677` | Self: 0.0% (2.0ms) | Total: 0.0% (2.0ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:569` | Self: 0.0% (2.0ms) | Total: 0.0% (2.0ms) | Samples: 3

**Called by:**
- `map` (3)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:259` | Self: 0.0% (2.0ms) | Total: 0.0% (2.0ms) | Samples: 3

**Called by:**
- `step` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:708` | Self: 0.0% (1.9ms) | Total: 0.0% (9.2ms) | Samples: 3

**Called by:**
- `runTrial` (14)
- `runTrial` (1)

**Calls:**
- `map` (12)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:701` | Self: 0.0% (1.9ms) | Total: 0.0% (1.9ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` | Self: 0.0% (1.9ms) | Total: 0.0% (2.4ms) | Samples: 3

**Called by:**
- `runTrial` (4)

**Calls:**
- `max` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.9ms) | Total: 0.0% (1.9ms) | Samples: 3

**Called by:**
- `step` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `adaptationPoint`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:653` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` | Self: 0.0% (1.3ms) | Total: 0.7% (71.0ms) | Samples: 2

**Called by:**
- `runTrial` (108)
- `runTrial` (1)

**Calls:**
- `map` (107)

### `jacobiEigenSymmetricOwned`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:155` | Self: 0.0% (1.3ms) | Total: 0.3% (31.7ms) | Samples: 2

**Called by:**
- `step` (47)

**Calls:**
- `sort` (40)
- `from` (5)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:686` | Self: 0.0% (1.3ms) | Total: 0.1% (17.7ms) | Samples: 2

**Called by:**
- `forEach` (27)

**Calls:**
- `map` (25)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` | Self: 0.0% (1.3ms) | Total: 0.1% (14.1ms) | Samples: 2

**Called by:**
- `runTrial` (20)
- `runTrial` (1)

**Calls:**
- `Float64Array` (19)

### `nextHalfOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 2

**Called by:**
- `sampleGaussianVectorND` (1)
- `sampleGaussianVectorND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:608` | Self: 0.0% (1.2ms) | Total: 0.0% (7.5ms) | Samples: 2

**Called by:**
- `runTrial` (12)

**Calls:**
- `map` (10)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` | Self: 0.0% (1.1ms) | Total: 0.2% (22.7ms) | Samples: 2

**Called by:**
- `runTrial` (34)

**Calls:**
- `sort` (32)

### `integerArgument`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:14` | Self: 0.0% (1.1ms) | Total: 0.0% (1.1ms) | Samples: 1

**Called by:**
- `(module)` (1)

### `every`
`[native code]` | Self: 0.0% (1.1ms) | Total: 0.0% (1.1ms) | Samples: 2

**Called by:**
- `requireFiniteVector` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:620` | Self: 0.0% (777us) | Total: 0.5% (52.2ms) | Samples: 1

**Called by:**
- `runTrial` (81)

**Calls:**
- `map` (80)

### `jacobiEigenSymmetricOwned`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` | Self: 0.0% (761us) | Total: 0.0% (761us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` | Self: 0.0% (745us) | Total: 0.0% (745us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:312` | Self: 0.0% (725us) | Total: 0.0% (725us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:678` | Self: 0.0% (720us) | Total: 0.0% (720us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (703us) | Total: 0.0% (703us) | Samples: 1

**Called by:**
- `step` (1)

### `repair`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (703us) | Total: 0.0% (703us) | Samples: 1

**Called by:**
- `map` (1)

### `sqrt`
`[native code]` | Self: 0.0% (703us) | Total: 0.0% (703us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` | Self: 0.0% (702us) | Total: 0.8% (87.8ms) | Samples: 1

**Called by:**
- `runTrial` (137)
- `runTrial` (2)

**Calls:**
- `whitenWithEigensystem` (82)
- `whitenWithEigensystem` (55)
- `whitenWithEigensystem` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:705` | Self: 0.0% (701us) | Total: 0.1% (10.5ms) | Samples: 1

**Called by:**
- `runTrial` (16)

**Calls:**
- `projectTo3D` (14)
- `projectTo3D` (1)

### `internal:streams/destroy`
`internal:streams/destroy:16` | Self: 0.0% (695us) | Total: 0.0% (695us) | Samples: 1

**Called by:**
- `anonymous` (1)

### `min`
`[native code]` | Self: 0.0% (690us) | Total: 0.0% (690us) | Samples: 1

**Called by:**
- `CMAESOptimizerND` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:544` | Self: 0.0% (688us) | Total: 0.4% (45.2ms) | Samples: 1

**Called by:**
- `step` (69)

**Calls:**
- `cloneMatrix` (66)
- `map` (2)

### `repair`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:509` | Self: 0.0% (687us) | Total: 0.0% (687us) | Samples: 1

**Called by:**
- `map` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:391` | Self: 0.0% (683us) | Total: 0.0% (683us) | Samples: 1

**Called by:**
- `CMAESOptimizerND` (1)

### `filter`
`[native code]` | Self: 0.0% (668us) | Total: 0.0% (668us) | Samples: 1

**Called by:**
- `CMAESOptimizerND` (1)

### `jacobiEigenSymmetricOwned`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:116` | Self: 0.0% (648us) | Total: 0.0% (648us) | Samples: 1

**Called by:**
- `step` (1)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` | Self: 0.0% (645us) | Total: 1.1% (108.7ms) | Samples: 1

**Called by:**
- `alignProjectionBasis` (66)
- `step` (57)
- `alignProjectionBasis` (45)

**Calls:**
- `map` (167)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:690` | Self: 0.0% (631us) | Total: 0.0% (3.0ms) | Samples: 1

**Called by:**
- `runTrial` (4)
- `runTrial` (1)

**Calls:**
- `reduce` (4)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` | Self: 0.0% (623us) | Total: 99.4% (9.81s) | Samples: 1

**Called by:**
- `(module)` (14214)
- `(module)` (957)

**Calls:**
- `step` (6897)
- `step` (2516)
- `step` (781)
- `step` (771)
- `step` (580)
- `step` (519)
- `step` (431)
- `step` (361)
- `step` (289)
- `step` (268)
- `step` (231)
- `step` (183)
- `step` (181)
- `step` (167)
- `step` (142)
- `step` (137)
- `step` (132)
- `step` (108)
- `step` (81)
- `step` (62)
- `step` (59)
- `step` (34)
- `step` (20)
- `step` (16)
- `step` (15)
- `step` (15)
- `step` (14)
- `step` (12)
- `step` (12)
- `step` (12)
- `step` (11)
- `step` (9)
- `step` (9)
- `step` (8)
- `step` (7)
- `step` (7)
- `step` (6)
- `step` (6)
- `step` (5)
- `step` (5)
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
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` | Self: 0.0% (615us) | Total: 0.0% (615us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:537` | Self: 0.0% (606us) | Total: 0.0% (606us) | Samples: 1

**Called by:**
- `projectTo3D` (1)

### `safeObjectiveValue`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:385` | Self: 0.0% (606us) | Total: 0.0% (606us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:568` | Self: 0.0% (603us) | Total: 5.0% (500.8ms) | Samples: 1

**Called by:**
- `runTrial` (771)
- `runTrial` (3)

**Calls:**
- `transformFromEigenCoordinates` (757)
- `transformFromEigenCoordinates` (10)
- `transformFromEigenCoordinates` (3)
- `transformFromEigenCoordinates` (3)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` | Self: 0.0% (582us) | Total: 0.0% (582us) | Samples: 1

**Called by:**
- `sort` (1)

### `some`
`[native code]` | Self: 0.0% (571us) | Total: 0.0% (571us) | Samples: 1

**Called by:**
- `projectTo3D` (1)

### `WriteStream`
`internal:fs/streams` | Self: 0.0% (567us) | Total: 0.0% (567us) | Samples: 1

**Called by:**
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` | Self: 0.0% (556us) | Total: 0.0% (556us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `forEach`
`[native code]` | Self: 0.0% (545us) | Total: 1.5% (149.0ms) | Samples: 1

**Called by:**
- `step` (232)
- `step` (1)

**Calls:**
- `(anonymous)` (205)
- `(anonymous)` (27)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:242` | Self: 0.0% (532us) | Total: 0.0% (532us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` | Self: 0.0% (525us) | Total: 0.0% (525us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:314` | Self: 0.0% (523us) | Total: 0.0% (1.9ms) | Samples: 1

**Called by:**
- `step` (3)

**Calls:**
- `fill` (1)
- `nextHalfOpenUnit` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` | Self: 0.0% (519us) | Total: 0.0% (519us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` | Self: 0.0% (418us) | Total: 3.3% (334.5ms) | Samples: 1

**Called by:**
- `runTrial` (519)
- `runTrial` (3)

**Calls:**
- `reconstructSymmetric` (520)
- `reconstructSymmetric` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` | Self: 0.0% (0us) | Total: 0.0% (5.5ms) | Samples: 0

**Calls:**
- `(anonymous)` (9)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:704` | Self: 0.0% (0us) | Total: 0.0% (4.3ms) | Samples: 0

**Called by:**
- `runTrial` (7)

**Calls:**
- `projectTo3D` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:684` | Self: 0.0% (0us) | Total: 0.0% (9.5ms) | Samples: 0

**Called by:**
- `runTrial` (15)

**Calls:**
- `map` (15)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (1.8ms) | Samples: 0

**Called by:**
- `(anonymous)` (3)

**Calls:**
- `anonymous` (3)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.2ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` | Self: 0.0% (0us) | Total: 0.0% (4.4ms) | Samples: 0

**Called by:**
- `(module)` (6)
- `(module)` (1)

**Calls:**
- `CMAESOptimizerND` (2)
- `CMAESOptimizerND` (2)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:460` | Self: 0.0% (0us) | Total: 0.0% (1.2ms) | Samples: 0

**Called by:**
- `runTrial` (2)

**Calls:**
- `createIdentityMatrix` (2)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:317` | Self: 0.0% (0us) | Total: 0.0% (687us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `fill` (1)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (581us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:streams/readable`
`internal:streams/readable:14` | Self: 0.0% (0us) | Total: 0.0% (595us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:498` | Self: 0.0% (0us) | Total: 0.0% (690us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `min` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:93` | Self: 0.0% (0us) | Total: 0.0% (514us) | Samples: 0

**Calls:**
- `sort` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` | Self: 0.0% (0us) | Total: 0.0% (4.5ms) | Samples: 0

**Called by:**
- `runTrial` (7)

**Calls:**
- `map` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:685` | Self: 0.0% (0us) | Total: 1.5% (148.4ms) | Samples: 0

**Called by:**
- `runTrial` (231)
- `runTrial` (1)

**Calls:**
- `forEach` (232)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` | Self: 0.0% (0us) | Total: 93.4% (9.22s) | Samples: 0

**Calls:**
- `runTrial` (14214)
- `runTrial` (60)
- `runTrial` (6)

### `jacobiEigenSymmetricOwned`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:161` | Self: 0.0% (0us) | Total: 0.0% (2.5ms) | Samples: 0

**Called by:**
- `step` (4)

**Calls:**
- `map` (4)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (2.3ms) | Samples: 0

**Called by:**
- `anonymous` (4)

**Calls:**
- `anonymous` (4)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (595us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (5.5ms) | Samples: 0

**Called by:**
- `(module)` (9)

**Calls:**
- `anonymous` (5)
- `get WriteStream` (3)
- `WriteStream` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:683` | Self: 0.0% (0us) | Total: 1.2% (119.2ms) | Samples: 0

**Called by:**
- `runTrial` (181)
- `runTrial` (1)

**Calls:**
- `alignProjectionBasis` (69)
- `alignProjectionBasis` (64)
- `alignProjectionBasis` (48)
- `alignProjectionBasis` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:313` | Self: 0.0% (0us) | Total: 0.0% (597us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `nextHalfOpenUnit` (1)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (581us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (1.2ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` | Self: 0.0% (0us) | Total: 0.0% (703us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `sqrt` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:621` | Self: 0.0% (0us) | Total: 0.4% (48.8ms) | Samples: 0

**Called by:**
- `map` (76)

**Calls:**
- `map` (76)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:473` | Self: 0.0% (0us) | Total: 0.0% (668us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `filter` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:475` | Self: 0.0% (0us) | Total: 0.0% (732us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `map` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:713` | Self: 0.0% (0us) | Total: 0.3% (38.4ms) | Samples: 0

**Called by:**
- `runTrial` (62)

**Calls:**
- `cloneMatrix` (57)
- `map` (5)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:429` | Self: 0.0% (0us) | Total: 0.0% (1.1ms) | Samples: 0

**Called by:**
- `runTrial` (2)

**Calls:**
- `(anonymous)` (1)
- `(anonymous)` (1)

### `createIdentityMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:29` | Self: 0.0% (0us) | Total: 0.0% (1.2ms) | Samples: 0

**Called by:**
- `CMAESOptimizerND` (2)

**Calls:**
- `from` (2)

### `requireFiniteVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:379` | Self: 0.0% (0us) | Total: 0.0% (1.1ms) | Samples: 0

**Called by:**
- `projectTo3D` (2)

**Calls:**
- `every` (2)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:316` | Self: 0.0% (0us) | Total: 0.0% (730us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `fill` (1)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.2ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:24` | Self: 0.0% (0us) | Total: 0.0% (1.1ms) | Samples: 0

**Calls:**
- `integerArgument` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:626` | Self: 0.0% (0us) | Total: 5.1% (507.4ms) | Samples: 0

**Called by:**
- `runTrial` (781)

**Calls:**
- `whitenWithEigensystem` (413)
- `whitenWithEigensystem` (360)
- `whitenWithEigensystem` (8)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (581us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` | Self: 0.0% (0us) | Total: 6.4% (635.1ms) | Samples: 0

**Calls:**
- `runTrial` (957)
- `runTrial` (7)
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:667` | Self: 0.0% (0us) | Total: 45.4% (4.48s) | Samples: 0

**Called by:**
- `runTrial` (6897)
- `runTrial` (27)

**Calls:**
- `jacobiEigenSymmetricOwned` (3362)
- `jacobiEigenSymmetricOwned` (3340)
- `jacobiEigenSymmetricOwned` (122)
- `jacobiEigenSymmetricOwned` (47)
- `jacobiEigenSymmetricOwned` (30)
- `jacobiEigenSymmetricOwned` (12)
- `jacobiEigenSymmetricOwned` (5)
- `jacobiEigenSymmetricOwned` (4)
- `jacobiEigenSymmetricOwned` (1)
- `jacobiEigenSymmetricOwned` (1)

### `jacobiEigenSymmetricOwned`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:158` | Self: 0.0% (0us) | Total: 0.0% (3.2ms) | Samples: 0

**Called by:**
- `step` (5)

**Calls:**
- `map` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:597` | Self: 0.0% (0us) | Total: 0.0% (1.8ms) | Samples: 0

**Called by:**
- `runTrial` (3)

**Calls:**
- `fill` (2)
- `createZeroVector` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` | Self: 0.0% (0us) | Total: 0.3% (32.2ms) | Samples: 0

**Called by:**
- `step` (48)

**Calls:**
- `cloneMatrix` (45)
- `map` (3)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` | Self: 0.0% (0us) | Total: 0.4% (43.0ms) | Samples: 0

**Called by:**
- `(module)` (60)
- `(module)` (7)

**Calls:**
- `step` (27)
- `step` (13)
- `step` (3)
- `step` (3)
- `step` (3)
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
- `step` (1)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (2.3ms) | Samples: 0

**Called by:**
- `anonymous` (4)

**Calls:**
- `anonymous` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` | Self: 0.0% (0us) | Total: 0.0% (3.2ms) | Samples: 0

**Called by:**
- `runTrial` (5)

**Calls:**
- `map` (5)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (1.2ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:588` | Self: 0.0% (0us) | Total: 0.0% (545us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `forEach` (1)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (1.2ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 92.4% | 9.12s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 7.1% | 705.5ms | `[native code]` |
| 0.3% | 35.6ms | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.0% | 695us | `internal:streams/destroy` |
| 0.0% | 567us | `internal:fs/streams` |
