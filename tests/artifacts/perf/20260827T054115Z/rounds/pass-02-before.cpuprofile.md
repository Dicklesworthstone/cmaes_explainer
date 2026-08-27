# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 9.88s | 12849 | 500us | 160 |

**Top 10:** `jacobiEigenSymmetric` 21.5%, `jacobiEigenSymmetric` 20.9%, `step` 18.1%, `transformFromEigenCoordinates` 4.9%, `reconstructSymmetric` 3.9%, `step` 3.6%, `whitenWithEigensystem` 2.6%, `map` 2.2%, `whitenWithEigensystem` 2.2%, `step` 1.9%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 21.5% | 2.12s | 22.3% | 2.21s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:139` |
| 20.9% | 2.06s | 21.8% | 2.15s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` |
| 18.1% | 1.79s | 18.1% | 1.79s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:636` |
| 4.9% | 487.5ms | 5.0% | 496.4ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:247` |
| 3.9% | 386.8ms | 4.3% | 430.5ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:228` |
| 3.6% | 358.6ms | 4.1% | 414.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:629` |
| 2.6% | 263.2ms | 2.7% | 270.9ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:269` |
| 2.2% | 227.1ms | 4.8% | 474.2ms | `map` | `[native code]` |
| 2.2% | 221.3ms | 2.2% | 224.7ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:262` |
| 1.9% | 194.5ms | 1.9% | 194.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |
| 1.8% | 178.6ms | 1.8% | 178.6ms | `hypot` | `[native code]` |
| 1.6% | 164.6ms | 1.6% | 164.6ms | `fill` | `[native code]` |
| 1.4% | 145.4ms | 1.4% | 145.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:649` |
| 1.4% | 141.5ms | 1.4% | 141.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` |
| 1.2% | 125.2ms | 2.1% | 215.3ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.0% | 103.8ms | 1.0% | 103.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.9% | 89.3ms | 0.9% | 89.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` |
| 0.7% | 76.8ms | 0.7% | 76.8ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:527` |
| 0.6% | 64.4ms | 0.8% | 85.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` |
| 0.4% | 48.4ms | 0.4% | 48.4ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:542` |
| 0.4% | 43.6ms | 1.3% | 138.0ms | `from` | `[native code]` |
| 0.4% | 39.7ms | 0.7% | 77.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.3% | 39.3ms | 1.1% | 114.4ms | `some` | `[native code]` |
| 0.3% | 37.2ms | 0.3% | 37.2ms | `Float64Array` | `[native code]` |
| 0.3% | 37.1ms | 0.3% | 37.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` |
| 0.3% | 32.4ms | 0.3% | 38.2ms | `sort` | `[native code]` |
| 0.3% | 32.3ms | 1.3% | 135.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 0.3% | 30.8ms | 0.3% | 30.8ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:300` |
| 0.3% | 30.5ms | 0.3% | 31.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:589` |
| 0.2% | 28.3ms | 0.6% | 63.4ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.2% | 26.1ms | 0.2% | 26.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.2% | 21.5ms | 0.2% | 21.5ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.1% | 14.6ms | 0.1% | 14.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:637` |
| 0.1% | 13.0ms | 0.1% | 13.0ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:20` |
| 0.1% | 10.8ms | 0.1% | 10.8ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:520` |
| 0.0% | 7.4ms | 0.0% | 7.4ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 6.9ms | 0.7% | 70.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` |
| 0.0% | 6.9ms | 0.0% | 6.9ms | `push` | `[native code]` |
| 0.0% | 5.6ms | 0.0% | 5.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.0% | 5.3ms | 0.0% | 5.3ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 5.2ms | 0.0% | 5.2ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 0.0% | 5.1ms | 0.0% | 5.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:181` |
| 0.0% | 4.7ms | 0.2% | 24.9ms | `anonymous` | `[native code]` |
| 0.0% | 4.7ms | 0.0% | 4.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` |
| 0.0% | 4.7ms | 0.0% | 4.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:694` |
| 0.0% | 4.6ms | 0.0% | 4.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` |
| 0.0% | 4.4ms | 0.0% | 4.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:680` |
| 0.0% | 4.3ms | 0.0% | 4.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:622` |
| 0.0% | 3.7ms | 0.1% | 11.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:621` |
| 0.0% | 3.7ms | 0.0% | 4.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:678` |
| 0.0% | 3.3ms | 0.7% | 72.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` |
| 0.0% | 3.2ms | 0.8% | 80.1ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:698` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:553` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:521` |
| 0.0% | 2.9ms | 4.3% | 433.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:653` |
| 0.0% | 2.9ms | 1.7% | 168.0ms | `forEach` | `[native code]` |
| 0.0% | 2.9ms | 2.5% | 255.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:557` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `abs` | `[native code]` |
| 0.0% | 2.7ms | 47.2% | 4.66s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:652` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:551` |
| 0.0% | 2.3ms | 0.1% | 14.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.2ms | 0.3% | 38.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:692` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:165` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:633` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:88` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` |
| 0.0% | 1.5ms | 0.7% | 73.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:596` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:522` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:552` |
| 0.0% | 1.5ms | 0.2% | 20.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` |
| 0.0% | 1.5ms | 0.0% | 2.3ms | `reduce` | `[native code]` |
| 0.0% | 1.4ms | 0.0% | 2.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:704` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:246` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:642` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.2ms | 0.6% | 68.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 0.0% | 913us | 0.0% | 913us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:436` |
| 0.0% | 904us | 0.0% | 904us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` |
| 0.0% | 888us | 0.0% | 888us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:567` |
| 0.0% | 878us | 0.0% | 878us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:470` |
| 0.0% | 876us | 0.0% | 876us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:95` |
| 0.0% | 872us | 0.0% | 872us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 867us | 0.0% | 867us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:602` |
| 0.0% | 866us | 1.3% | 129.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` |
| 0.0% | 864us | 0.0% | 864us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:163` |
| 0.0% | 842us | 0.0% | 842us | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 825us | 0.0% | 4.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:663` |
| 0.0% | 822us | 0.0% | 7.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` |
| 0.0% | 813us | 1.0% | 107.8ms | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` |
| 0.0% | 800us | 0.0% | 800us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` |
| 0.0% | 742us | 0.4% | 44.0ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` |
| 0.0% | 741us | 0.0% | 741us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 0.0% | 734us | 0.0% | 734us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:656` |
| 0.0% | 716us | 5.1% | 506.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:558` |
| 0.0% | 714us | 0.0% | 714us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 699us | 0.0% | 699us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` |
| 0.0% | 699us | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:603` |
| 0.0% | 684us | 0.0% | 684us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:682` |
| 0.0% | 680us | 0.0% | 680us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` |
| 0.0% | 675us | 99.4% | 9.82s | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 0.0% | 667us | 0.5% | 57.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 0.0% | 666us | 0.6% | 59.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:106` |
| 0.0% | 663us | 0.0% | 663us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:658` |
| 0.0% | 658us | 0.0% | 658us | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:266` |
| 0.0% | 656us | 0.0% | 656us | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 655us | 0.2% | 29.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` |
| 0.0% | 645us | 0.0% | 645us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:583` |
| 0.0% | 642us | 0.0% | 3.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:578` |
| 0.0% | 641us | 0.0% | 641us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:657` |
| 0.0% | 634us | 0.0% | 634us | `max` | `[native code]` |
| 0.0% | 624us | 0.0% | 624us | `createSafeIterator` | `internal:primordials:3` |
| 0.0% | 620us | 0.0% | 620us | `internal:streams/destroy` | `internal:streams/destroy:16` |
| 0.0% | 618us | 0.0% | 618us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 99.4% | 9.82s | 0.0% | 675us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 93.3% | 9.22s | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` |
| 47.2% | 4.66s | 0.0% | 2.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:652` |
| 22.3% | 2.21s | 21.5% | 2.12s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:139` |
| 21.8% | 2.15s | 20.9% | 2.06s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` |
| 18.1% | 1.79s | 18.1% | 1.79s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:636` |
| 6.5% | 649.5ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` |
| 5.1% | 506.3ms | 0.0% | 716us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:558` |
| 5.0% | 496.4ms | 4.9% | 487.5ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:247` |
| 4.8% | 474.2ms | 2.2% | 227.1ms | `map` | `[native code]` |
| 4.3% | 433.4ms | 0.0% | 2.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:653` |
| 4.3% | 430.5ms | 3.9% | 386.8ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:228` |
| 4.3% | 430.1ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` |
| 4.1% | 414.2ms | 3.6% | 358.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:629` |
| 2.7% | 270.9ms | 2.6% | 263.2ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:269` |
| 2.5% | 255.2ms | 0.0% | 2.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:557` |
| 2.2% | 224.7ms | 2.2% | 221.3ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:262` |
| 2.1% | 215.3ms | 1.2% | 125.2ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.9% | 194.5ms | 1.9% | 194.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |
| 1.8% | 178.6ms | 1.8% | 178.6ms | `hypot` | `[native code]` |
| 1.7% | 168.0ms | 0.0% | 2.9ms | `forEach` | `[native code]` |
| 1.6% | 165.4ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:664` |
| 1.6% | 164.6ms | 1.6% | 164.6ms | `fill` | `[native code]` |
| 1.4% | 145.4ms | 1.4% | 145.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:649` |
| 1.4% | 141.5ms | 1.4% | 141.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` |
| 1.3% | 138.0ms | 0.4% | 43.6ms | `from` | `[native code]` |
| 1.3% | 135.5ms | 0.3% | 32.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 1.3% | 129.5ms | 0.0% | 866us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` |
| 1.1% | 114.4ms | 0.3% | 39.3ms | `some` | `[native code]` |
| 1.0% | 107.8ms | 0.0% | 813us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` |
| 1.0% | 103.8ms | 1.0% | 103.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.9% | 89.3ms | 0.9% | 89.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` |
| 0.8% | 85.2ms | 0.6% | 64.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` |
| 0.8% | 80.1ms | 0.0% | 3.2ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` |
| 0.7% | 77.0ms | 0.4% | 39.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.7% | 76.8ms | 0.7% | 76.8ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:527` |
| 0.7% | 75.1ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` |
| 0.7% | 73.1ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:596` |
| 0.7% | 72.6ms | 0.0% | 3.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` |
| 0.7% | 70.4ms | 0.0% | 6.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` |
| 0.6% | 68.4ms | 0.0% | 1.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 0.6% | 63.9ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` |
| 0.6% | 63.4ms | 0.2% | 28.3ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.6% | 59.8ms | 0.0% | 666us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:106` |
| 0.5% | 57.5ms | 0.0% | 667us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 0.5% | 57.5ms | 0.0% | 0us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 0.4% | 48.4ms | 0.4% | 48.4ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:542` |
| 0.4% | 47.0ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:534` |
| 0.4% | 44.0ms | 0.0% | 742us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` |
| 0.4% | 42.8ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` |
| 0.3% | 38.7ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:692` |
| 0.3% | 38.2ms | 0.3% | 32.4ms | `sort` | `[native code]` |
| 0.3% | 37.2ms | 0.3% | 37.2ms | `Float64Array` | `[native code]` |
| 0.3% | 37.1ms | 0.3% | 37.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` |
| 0.3% | 32.4ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:546` |
| 0.3% | 31.2ms | 0.3% | 30.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:589` |
| 0.3% | 30.8ms | 0.3% | 30.8ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:300` |
| 0.2% | 29.5ms | 0.0% | 655us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` |
| 0.2% | 26.1ms | 0.2% | 26.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.2% | 24.9ms | 0.0% | 4.7ms | `anonymous` | `[native code]` |
| 0.2% | 21.5ms | 0.2% | 21.5ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.2% | 21.3ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:180` |
| 0.2% | 20.6ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` |
| 0.1% | 16.5ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 0.1% | 14.6ms | 0.1% | 14.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:637` |
| 0.1% | 14.0ms | 0.0% | 2.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.1% | 13.0ms | 0.1% | 13.0ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:20` |
| 0.1% | 11.2ms | 0.0% | 3.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:621` |
| 0.1% | 10.8ms | 0.1% | 10.8ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:520` |
| 0.0% | 8.5ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:683` |
| 0.0% | 8.0ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.0% | 7.6ms | 0.0% | 822us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` |
| 0.0% | 7.5ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:687` |
| 0.0% | 7.4ms | 0.0% | 7.4ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 6.9ms | 0.0% | 6.9ms | `push` | `[native code]` |
| 0.0% | 6.1ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` |
| 0.0% | 6.0ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.0% | 6.0ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.0% | 5.6ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 5.6ms | 0.0% | 5.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.0% | 5.3ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:684` |
| 0.0% | 5.3ms | 0.0% | 5.3ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 5.2ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.0% | 5.2ms | 0.0% | 5.2ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 0.0% | 5.1ms | 0.0% | 5.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:181` |
| 0.0% | 5.1ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` |
| 0.0% | 4.7ms | 0.0% | 4.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` |
| 0.0% | 4.7ms | 0.0% | 4.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:694` |
| 0.0% | 4.6ms | 0.0% | 4.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` |
| 0.0% | 4.5ms | 0.0% | 3.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:678` |
| 0.0% | 4.4ms | 0.0% | 4.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:680` |
| 0.0% | 4.3ms | 0.0% | 4.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:622` |
| 0.0% | 4.0ms | 0.0% | 825us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:663` |
| 0.0% | 3.2ms | 0.0% | 642us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:578` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:698` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:553` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:521` |
| 0.0% | 2.9ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 2.9ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 2.8ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:704` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `abs` | `[native code]` |
| 0.0% | 2.7ms | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:419` |
| 0.0% | 2.3ms | 0.0% | 1.5ms | `reduce` | `[native code]` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:551` |
| 0.0% | 2.2ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 2.2ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 2.2ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 2.2ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:165` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:633` |
| 0.0% | 1.6ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:601` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:88` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:522` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:552` |
| 0.0% | 1.5ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:669` |
| 0.0% | 1.4ms | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 1.4ms | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 1.4ms | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:246` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:642` |
| 0.0% | 1.3ms | 0.0% | 699us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:603` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.3ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.0% | 913us | 0.0% | 913us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:436` |
| 0.0% | 904us | 0.0% | 904us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` |
| 0.0% | 888us | 0.0% | 888us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:567` |
| 0.0% | 878us | 0.0% | 878us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:470` |
| 0.0% | 876us | 0.0% | 876us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:95` |
| 0.0% | 876us | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:95` |
| 0.0% | 872us | 0.0% | 872us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 867us | 0.0% | 867us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:602` |
| 0.0% | 864us | 0.0% | 864us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:163` |
| 0.0% | 842us | 0.0% | 842us | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 833us | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 800us | 0.0% | 800us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` |
| 0.0% | 741us | 0.0% | 741us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 0.0% | 734us | 0.0% | 734us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:656` |
| 0.0% | 714us | 0.0% | 714us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 699us | 0.0% | 699us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` |
| 0.0% | 684us | 0.0% | 684us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:682` |
| 0.0% | 680us | 0.0% | 680us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` |
| 0.0% | 663us | 0.0% | 663us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:658` |
| 0.0% | 658us | 0.0% | 658us | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:266` |
| 0.0% | 656us | 0.0% | 656us | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 645us | 0.0% | 645us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:583` |
| 0.0% | 641us | 0.0% | 641us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:657` |
| 0.0% | 634us | 0.0% | 634us | `max` | `[native code]` |
| 0.0% | 629us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:491` |
| 0.0% | 624us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 624us | 0.0% | 624us | `createSafeIterator` | `internal:primordials:3` |
| 0.0% | 624us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 624us | 0.0% | 0us | `internal:primordials` | `internal:primordials:51` |
| 0.0% | 620us | 0.0% | 620us | `internal:streams/destroy` | `internal:streams/destroy:16` |
| 0.0% | 618us | 0.0% | 618us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 570us | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:306` |

## Function Details

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:139` | Self: 21.5% (2.12s) | Total: 22.3% (2.21s) | Samples: 2784

**Called by:**
- `step` (2893)

**Calls:**
- `hypot` (109)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` | Self: 20.9% (2.06s) | Total: 21.8% (2.15s) | Samples: 2673

**Called by:**
- `step` (2798)

**Calls:**
- `hypot` (125)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:636` | Self: 18.1% (1.79s) | Total: 18.1% (1.79s) | Samples: 2349

**Called by:**
- `runTrial` (2347)
- `runTrial` (2)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:247` | Self: 4.9% (487.5ms) | Total: 5.0% (496.4ms) | Samples: 638

**Called by:**
- `step` (650)

**Calls:**
- `createZeroVector` (7)
- `fill` (5)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:228` | Self: 3.9% (386.8ms) | Total: 4.3% (430.5ms) | Samples: 502

**Called by:**
- `step` (561)

**Calls:**
- `from` (58)
- `createZeroMatrix` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:629` | Self: 3.6% (358.6ms) | Total: 4.1% (414.2ms) | Samples: 473

**Called by:**
- `runTrial` (538)
- `runTrial` (5)

**Calls:**
- `createZeroMatrix` (56)
- `from` (14)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:269` | Self: 2.6% (263.2ms) | Total: 2.7% (270.9ms) | Samples: 340

**Called by:**
- `step` (300)
- `step` (50)

**Calls:**
- `fill` (5)
- `createZeroVector` (5)

### `map`
`[native code]` | Self: 2.2% (227.1ms) | Total: 4.8% (474.2ms) | Samples: 286

**Called by:**
- `cloneMatrix` (137)
- `step` (99)
- `step` (89)
- `(anonymous)` (88)
- `step` (83)
- `(anonymous)` (30)
- `jacobiEigenSymmetric` (14)
- `step` (11)
- `step` (10)
- `step` (9)
- `step` (8)
- `jacobiEigenSymmetric` (7)
- `jacobiEigenSymmetric` (7)
- `step` (5)
- `step` (4)
- `alignProjectionBasis` (3)
- `alignProjectionBasis` (1)
- `map` (1)
- `CMAESOptimizerND` (1)

**Calls:**
- `(anonymous)` (114)
- `(anonymous)` (109)
- `(anonymous)` (90)
- `abs` (4)
- `(anonymous)` (1)
- `map` (1)
- `(anonymous)` (1)
- `(anonymous)` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:262` | Self: 2.2% (221.3ms) | Total: 2.2% (224.7ms) | Samples: 287

**Called by:**
- `step` (247)
- `step` (44)

**Calls:**
- `createZeroVector` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` | Self: 1.9% (194.5ms) | Total: 1.9% (194.5ms) | Samples: 250

**Called by:**
- `runTrial` (249)
- `runTrial` (1)

### `hypot`
`[native code]` | Self: 1.8% (178.6ms) | Total: 1.8% (178.6ms) | Samples: 234

**Called by:**
- `jacobiEigenSymmetric` (125)
- `jacobiEigenSymmetric` (109)

### `fill`
`[native code]` | Self: 1.6% (164.6ms) | Total: 1.6% (164.6ms) | Samples: 217

**Called by:**
- `sampleGaussianVectorND` (119)
- `ellipsoidObjective` (46)
- `from` (41)
- `whitenWithEigensystem` (5)
- `transformFromEigenCoordinates` (5)
- `sampleGaussianVectorND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:649` | Self: 1.4% (145.4ms) | Total: 1.4% (145.4ms) | Samples: 192

**Called by:**
- `runTrial` (192)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` | Self: 1.4% (141.5ms) | Total: 1.4% (141.5ms) | Samples: 180

**Called by:**
- `runTrial` (180)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.2% (125.2ms) | Total: 2.1% (215.3ms) | Samples: 164

**Called by:**
- `step` (283)

**Calls:**
- `fill` (119)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.0% (103.8ms) | Total: 1.0% (103.8ms) | Samples: 133

**Called by:**
- `map` (109)
- `some` (23)
- `CMAESOptimizerND` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` | Self: 0.9% (89.3ms) | Total: 0.9% (89.3ms) | Samples: 114

**Called by:**
- `map` (114)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:527` | Self: 0.7% (76.8ms) | Total: 0.7% (76.8ms) | Samples: 97

**Called by:**
- `projectTo3D` (97)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` | Self: 0.6% (64.4ms) | Total: 0.8% (85.2ms) | Samples: 86

**Called by:**
- `step` (115)

**Calls:**
- `Float64Array` (29)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:542` | Self: 0.4% (48.4ms) | Total: 0.4% (48.4ms) | Samples: 60

**Called by:**
- `step` (60)

### `from`
`[native code]` | Self: 0.4% (43.6ms) | Total: 1.3% (138.0ms) | Samples: 57

**Called by:**
- `reconstructSymmetric` (58)
- `createZeroMatrix` (56)
- `jacobiEigenSymmetric` (50)
- `step` (14)
- `jacobiEigenSymmetric` (3)

**Calls:**
- `(anonymous)` (48)
- `fill` (41)
- `(anonymous)` (35)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.4% (39.7ms) | Total: 0.7% (77.0ms) | Samples: 53

**Called by:**
- `step` (103)

**Calls:**
- `from` (50)

### `some`
`[native code]` | Self: 0.3% (39.3ms) | Total: 1.1% (114.4ms) | Samples: 52

**Called by:**
- `validateSquareFiniteMatrix` (76)
- `(anonymous)` (75)

**Calls:**
- `(anonymous)` (76)
- `(anonymous)` (23)

### `Float64Array`
`[native code]` | Self: 0.3% (37.2ms) | Total: 0.3% (37.2ms) | Samples: 50

**Called by:**
- `jacobiEigenSymmetric` (29)
- `jacobiEigenSymmetric` (21)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` | Self: 0.3% (37.1ms) | Total: 0.3% (37.1ms) | Samples: 48

**Called by:**
- `from` (48)

### `sort`
`[native code]` | Self: 0.3% (32.4ms) | Total: 0.3% (38.2ms) | Samples: 43

**Called by:**
- `step` (26)
- `jacobiEigenSymmetric` (25)

**Calls:**
- `(anonymous)` (7)
- `(anonymous)` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` | Self: 0.3% (32.3ms) | Total: 1.3% (135.5ms) | Samples: 41

**Called by:**
- `forEach` (172)

**Calls:**
- `projectTo3D` (100)
- `projectTo3D` (13)
- `projectTo3D` (12)
- `projectTo3D` (4)
- `projectTo3D` (2)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:300` | Self: 0.3% (30.8ms) | Total: 0.3% (30.8ms) | Samples: 34

**Called by:**
- `step` (34)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:589` | Self: 0.3% (30.5ms) | Total: 0.3% (31.2ms) | Samples: 39

**Called by:**
- `runTrial` (40)

**Calls:**
- `adaptationPoint` (1)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` | Self: 0.2% (28.3ms) | Total: 0.6% (63.4ms) | Samples: 37

**Called by:**
- `step` (83)

**Calls:**
- `fill` (46)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.2% (26.1ms) | Total: 0.2% (26.1ms) | Samples: 35

**Called by:**
- `from` (35)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.2% (21.5ms) | Total: 0.2% (21.5ms) | Samples: 28

**Called by:**
- `(anonymous)` (12)
- `step` (9)
- `step` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:637` | Self: 0.1% (14.6ms) | Total: 0.1% (14.6ms) | Samples: 18

**Called by:**
- `runTrial` (17)
- `runTrial` (1)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:20` | Self: 0.1% (13.0ms) | Total: 0.1% (13.0ms) | Samples: 17

**Called by:**
- `transformFromEigenCoordinates` (7)
- `whitenWithEigensystem` (5)
- `whitenWithEigensystem` (4)
- `step` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:520` | Self: 0.1% (10.8ms) | Total: 0.1% (10.8ms) | Samples: 14

**Called by:**
- `(anonymous)` (13)
- `step` (1)

### `vecDot`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (7.4ms) | Total: 0.0% (7.4ms) | Samples: 10

**Called by:**
- `step` (10)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` | Self: 0.0% (6.9ms) | Total: 0.7% (70.4ms) | Samples: 8

**Called by:**
- `runTrial` (91)

**Calls:**
- `ellipsoidObjective` (83)

### `push`
`[native code]` | Self: 0.0% (6.9ms) | Total: 0.0% (6.9ms) | Samples: 9

**Called by:**
- `step` (7)
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` | Self: 0.0% (5.6ms) | Total: 0.0% (5.6ms) | Samples: 7

**Called by:**
- `runTrial` (6)
- `runTrial` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (5.3ms) | Total: 0.0% (5.3ms) | Samples: 7

**Called by:**
- `step` (6)
- `step` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` | Self: 0.0% (5.2ms) | Total: 0.0% (5.2ms) | Samples: 7

**Called by:**
- `step` (7)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:181` | Self: 0.0% (5.1ms) | Total: 0.0% (5.1ms) | Samples: 7

**Called by:**
- `sort` (7)

### `anonymous`
`[native code]` | Self: 0.0% (4.7ms) | Total: 0.2% (24.9ms) | Samples: 6

**Called by:**
- `(anonymous)` (5)
- `node:fs/promises` (4)
- `node:fs` (4)
- `internal:fs/streams` (3)
- `get WriteStream` (3)
- `internal:stream` (3)
- `node:stream` (3)
- `node:events` (2)
- `internal:streams/pipeline` (2)
- `internal:streams/compose` (2)
- `internal:validators` (1)
- `internal:shared` (1)
- `internal:streams/duplex` (1)

**Calls:**
- `node:fs/promises` (4)
- `node:fs` (4)
- `internal:fs/streams` (3)
- `internal:stream` (3)
- `node:stream` (3)
- `node:events` (2)
- `internal:streams/pipeline` (2)
- `internal:streams/compose` (2)
- `internal:validators` (1)
- `internal:streams/destroy` (1)
- `internal:shared` (1)
- `internal:streams/duplex` (1)
- `internal:primordials` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` | Self: 0.0% (4.7ms) | Total: 0.0% (4.7ms) | Samples: 6

**Called by:**
- `runTrial` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:694` | Self: 0.0% (4.7ms) | Total: 0.0% (4.7ms) | Samples: 6

**Called by:**
- `runTrial` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` | Self: 0.0% (4.6ms) | Total: 0.0% (4.6ms) | Samples: 6

**Called by:**
- `runTrial` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:680` | Self: 0.0% (4.4ms) | Total: 0.0% (4.4ms) | Samples: 6

**Called by:**
- `runTrial` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:622` | Self: 0.0% (4.3ms) | Total: 0.0% (4.3ms) | Samples: 6

**Called by:**
- `runTrial` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:621` | Self: 0.0% (3.7ms) | Total: 0.1% (11.2ms) | Samples: 5

**Called by:**
- `runTrial` (15)

**Calls:**
- `vecDot` (10)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:678` | Self: 0.0% (3.7ms) | Total: 0.0% (4.5ms) | Samples: 5

**Called by:**
- `runTrial` (5)
- `runTrial` (1)

**Calls:**
- `radius` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` | Self: 0.0% (3.3ms) | Total: 0.7% (72.6ms) | Samples: 4

**Called by:**
- `runTrial` (93)

**Calls:**
- `map` (89)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` | Self: 0.0% (3.2ms) | Total: 0.8% (80.1ms) | Samples: 4

**Called by:**
- `(anonymous)` (100)
- `step` (1)

**Calls:**
- `coordinate` (97)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:698` | Self: 0.0% (3.1ms) | Total: 0.0% (3.1ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` | Self: 0.0% (3.0ms) | Total: 0.0% (3.0ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:553` | Self: 0.0% (3.0ms) | Total: 0.0% (3.0ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:521` | Self: 0.0% (3.0ms) | Total: 0.0% (3.0ms) | Samples: 4

**Called by:**
- `(anonymous)` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:653` | Self: 0.0% (2.9ms) | Total: 4.3% (433.4ms) | Samples: 4

**Called by:**
- `runTrial` (565)

**Calls:**
- `reconstructSymmetric` (561)

### `forEach`
`[native code]` | Self: 0.0% (2.9ms) | Total: 1.7% (168.0ms) | Samples: 4

**Called by:**
- `step` (203)
- `step` (4)

**Calls:**
- `(anonymous)` (172)
- `(anonymous)` (30)
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:557` | Self: 0.0% (2.9ms) | Total: 2.5% (255.2ms) | Samples: 4

**Called by:**
- `runTrial` (329)

**Calls:**
- `sampleGaussianVectorND` (283)
- `sampleGaussianVectorND` (34)
- `push` (7)
- `sampleGaussianVectorND` (1)

### `abs`
`[native code]` | Self: 0.0% (2.8ms) | Total: 0.0% (2.8ms) | Samples: 4

**Called by:**
- `map` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:652` | Self: 0.0% (2.7ms) | Total: 47.2% (4.66s) | Samples: 1

**Called by:**
- `runTrial` (6047)
- `runTrial` (30)

**Calls:**
- `jacobiEigenSymmetric` (2893)
- `jacobiEigenSymmetric` (2798)
- `jacobiEigenSymmetric` (115)
- `jacobiEigenSymmetric` (103)
- `jacobiEigenSymmetric` (79)
- `jacobiEigenSymmetric` (28)
- `jacobiEigenSymmetric` (21)
- `jacobiEigenSymmetric` (17)
- `jacobiEigenSymmetric` (7)
- `jacobiEigenSymmetric` (7)
- `jacobiEigenSymmetric` (3)
- `jacobiEigenSymmetric` (3)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:551` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` | Self: 0.0% (2.3ms) | Total: 0.1% (14.0ms) | Samples: 3

**Called by:**
- `step` (17)

**Calls:**
- `map` (14)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (2.2ms) | Total: 0.0% (2.2ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:692` | Self: 0.0% (2.2ms) | Total: 0.3% (38.7ms) | Samples: 1

**Called by:**
- `runTrial` (47)

**Calls:**
- `cloneMatrix` (39)
- `map` (5)
- `cloneMatrix` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:165` | Self: 0.0% (2.1ms) | Total: 0.0% (2.1ms) | Samples: 3

**Called by:**
- `step` (3)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` | Self: 0.0% (2.0ms) | Total: 0.0% (2.0ms) | Samples: 3

**Called by:**
- `step` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:633` | Self: 0.0% (1.9ms) | Total: 0.0% (1.9ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `vecNorm`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 2

**Called by:**
- `step` (2)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:88` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 2

**Called by:**
- `jacobiEigenSymmetric` (2)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:596` | Self: 0.0% (1.5ms) | Total: 0.7% (73.1ms) | Samples: 2

**Called by:**
- `runTrial` (97)

**Calls:**
- `whitenWithEigensystem` (50)
- `whitenWithEigensystem` (44)
- `whitenWithEigensystem` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:522` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `(anonymous)` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:552` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` | Self: 0.0% (1.5ms) | Total: 0.2% (20.6ms) | Samples: 2

**Called by:**
- `runTrial` (27)
- `runTrial` (1)

**Calls:**
- `sort` (26)

### `reduce`
`[native code]` | Self: 0.0% (1.5ms) | Total: 0.0% (2.3ms) | Samples: 2

**Called by:**
- `step` (2)
- `(module)` (1)

**Calls:**
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:704` | Self: 0.0% (1.4ms) | Total: 0.0% (2.8ms) | Samples: 2

**Called by:**
- `runTrial` (4)

**Calls:**
- `push` (2)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:246` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:642` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `step` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` | Self: 0.0% (1.2ms) | Total: 0.6% (68.4ms) | Samples: 2

**Called by:**
- `map` (90)

**Calls:**
- `map` (88)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:436` | Self: 0.0% (913us) | Total: 0.0% (913us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` | Self: 0.0% (904us) | Total: 0.0% (904us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:567` | Self: 0.0% (888us) | Total: 0.0% (888us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:470` | Self: 0.0% (878us) | Total: 0.0% (878us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:95` | Self: 0.0% (876us) | Total: 0.0% (876us) | Samples: 1

**Called by:**
- `reduce` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (872us) | Total: 0.0% (872us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:602` | Self: 0.0% (867us) | Total: 0.0% (867us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` | Self: 0.0% (866us) | Total: 1.3% (129.5ms) | Samples: 1

**Called by:**
- `runTrial` (165)

**Calls:**
- `alignProjectionBasis` (60)
- `alignProjectionBasis` (60)
- `alignProjectionBasis` (43)
- `alignProjectionBasis` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:163` | Self: 0.0% (864us) | Total: 0.0% (864us) | Samples: 1

**Called by:**
- `step` (1)

### `radius`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (842us) | Total: 0.0% (842us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:663` | Self: 0.0% (825us) | Total: 0.0% (4.0ms) | Samples: 1

**Called by:**
- `runTrial` (5)

**Calls:**
- `map` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` | Self: 0.0% (822us) | Total: 0.0% (7.6ms) | Samples: 1

**Called by:**
- `runTrial` (10)

**Calls:**
- `map` (9)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` | Self: 0.0% (813us) | Total: 1.0% (107.8ms) | Samples: 1

**Called by:**
- `alignProjectionBasis` (57)
- `alignProjectionBasis` (42)
- `step` (39)

**Calls:**
- `map` (137)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` | Self: 0.0% (800us) | Total: 0.0% (800us) | Samples: 1

**Called by:**
- `map` (1)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` | Self: 0.0% (742us) | Total: 0.4% (44.0ms) | Samples: 1

**Called by:**
- `step` (56)
- `reconstructSymmetric` (1)

**Calls:**
- `from` (56)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` | Self: 0.0% (741us) | Total: 0.0% (741us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:656` | Self: 0.0% (734us) | Total: 0.0% (734us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:558` | Self: 0.0% (716us) | Total: 5.1% (506.3ms) | Samples: 1

**Called by:**
- `runTrial` (656)
- `runTrial` (7)

**Calls:**
- `transformFromEigenCoordinates` (650)
- `transformFromEigenCoordinates` (7)
- `transformFromEigenCoordinates` (2)
- `transformFromEigenCoordinates` (2)
- `transformFromEigenCoordinates` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (714us) | Total: 0.0% (714us) | Samples: 1

**Called by:**
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` | Self: 0.0% (699us) | Total: 0.0% (699us) | Samples: 1

**Called by:**
- `sort` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:603` | Self: 0.0% (699us) | Total: 0.0% (1.3ms) | Samples: 1

**Called by:**
- `runTrial` (2)

**Calls:**
- `max` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:682` | Self: 0.0% (684us) | Total: 0.0% (684us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` | Self: 0.0% (680us) | Total: 0.0% (680us) | Samples: 1

**Called by:**
- `map` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` | Self: 0.0% (675us) | Total: 99.4% (9.82s) | Samples: 1

**Called by:**
- `(module)` (11951)
- `(module)` (829)

**Calls:**
- `step` (6047)
- `step` (2347)
- `step` (656)
- `step` (565)
- `step` (550)
- `step` (538)
- `step` (329)
- `step` (249)
- `step` (202)
- `step` (192)
- `step` (180)
- `step` (165)
- `step` (99)
- `step` (97)
- `step` (93)
- `step` (91)
- `step` (82)
- `step` (47)
- `step` (40)
- `step` (27)
- `step` (17)
- `step` (15)
- `step` (11)
- `step` (10)
- `step` (10)
- `step` (10)
- `step` (8)
- `step` (7)
- `step` (6)
- `step` (6)
- `step` (6)
- `step` (6)
- `step` (6)
- `step` (6)
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
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` | Self: 0.0% (667us) | Total: 0.5% (57.5ms) | Samples: 1

**Called by:**
- `some` (76)

**Calls:**
- `some` (75)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:106` | Self: 0.0% (666us) | Total: 0.6% (59.8ms) | Samples: 1

**Called by:**
- `step` (79)

**Calls:**
- `validateSquareFiniteMatrix` (76)
- `validateSquareFiniteMatrix` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:658` | Self: 0.0% (663us) | Total: 0.0% (663us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:266` | Self: 0.0% (658us) | Total: 0.0% (658us) | Samples: 1

**Called by:**
- `step` (1)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (656us) | Total: 0.0% (656us) | Samples: 1

**Called by:**
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` | Self: 0.0% (655us) | Total: 0.2% (29.5ms) | Samples: 1

**Called by:**
- `forEach` (30)
- `map` (1)

**Calls:**
- `map` (30)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:583` | Self: 0.0% (645us) | Total: 0.0% (645us) | Samples: 1

**Called by:**
- `forEach` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:578` | Self: 0.0% (642us) | Total: 0.0% (3.2ms) | Samples: 1

**Called by:**
- `runTrial` (5)

**Calls:**
- `forEach` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:657` | Self: 0.0% (641us) | Total: 0.0% (641us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `max`
`[native code]` | Self: 0.0% (634us) | Total: 0.0% (634us) | Samples: 1

**Called by:**
- `step` (1)

### `createSafeIterator`
`internal:primordials:3` | Self: 0.0% (624us) | Total: 0.0% (624us) | Samples: 1

**Called by:**
- `internal:primordials` (1)

### `internal:streams/destroy`
`internal:streams/destroy:16` | Self: 0.0% (620us) | Total: 0.0% (620us) | Samples: 1

**Called by:**
- `anonymous` (1)

### `adaptationPoint`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (618us) | Total: 0.0% (618us) | Samples: 1

**Called by:**
- `step` (1)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (2.2ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:684` | Self: 0.0% (0us) | Total: 0.0% (5.3ms) | Samples: 0

**Called by:**
- `runTrial` (7)

**Calls:**
- `projectTo3D` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:601` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `runTrial` (2)

**Calls:**
- `vecNorm` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` | Self: 0.0% (0us) | Total: 0.1% (16.5ms) | Samples: 0

**Called by:**
- `step` (21)

**Calls:**
- `Float64Array` (21)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (2.2ms) | Samples: 0

**Called by:**
- `(anonymous)` (3)

**Calls:**
- `anonymous` (3)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:180` | Self: 0.0% (0us) | Total: 0.2% (21.3ms) | Samples: 0

**Called by:**
- `step` (28)

**Calls:**
- `sort` (25)
- `from` (3)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` | Self: 0.0% (0us) | Total: 0.0% (8.0ms) | Samples: 0

**Called by:**
- `runTrial` (10)
- `runTrial` (1)

**Calls:**
- `map` (11)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (2.9ms) | Samples: 0

**Called by:**
- `anonymous` (4)

**Calls:**
- `anonymous` (4)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (624us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` | Self: 0.0% (0us) | Total: 0.0% (5.2ms) | Samples: 0

**Called by:**
- `step` (7)

**Calls:**
- `map` (7)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:419` | Self: 0.0% (0us) | Total: 0.0% (2.7ms) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:683` | Self: 0.0% (0us) | Total: 0.0% (8.5ms) | Samples: 0

**Called by:**
- `runTrial` (11)

**Calls:**
- `projectTo3D` (9)
- `projectTo3D` (1)
- `projectTo3D` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` | Self: 0.0% (0us) | Total: 0.0% (5.6ms) | Samples: 0

**Called by:**
- `step` (7)

**Calls:**
- `map` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` | Self: 0.0% (0us) | Total: 4.3% (430.1ms) | Samples: 0

**Called by:**
- `runTrial` (550)
- `runTrial` (4)

**Calls:**
- `whitenWithEigensystem` (300)
- `whitenWithEigensystem` (247)
- `whitenWithEigensystem` (6)
- `whitenWithEigensystem` (1)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (2.2ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:546` | Self: 0.0% (0us) | Total: 0.3% (32.4ms) | Samples: 0

**Called by:**
- `step` (43)

**Calls:**
- `cloneMatrix` (42)
- `map` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:95` | Self: 0.0% (0us) | Total: 0.0% (876us) | Samples: 0

**Calls:**
- `reduce` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` | Self: 0.0% (0us) | Total: 0.7% (75.1ms) | Samples: 0

**Called by:**
- `runTrial` (99)

**Calls:**
- `map` (99)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (833us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (624us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` | Self: 0.0% (0us) | Total: 93.3% (9.22s) | Samples: 0

**Calls:**
- `runTrial` (11951)
- `runTrial` (45)
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` | Self: 0.0% (0us) | Total: 0.0% (1.3ms) | Samples: 0

**Called by:**
- `runTrial` (2)

**Calls:**
- `createZeroVector` (1)
- `createZeroVector` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` | Self: 0.0% (0us) | Total: 0.0% (5.1ms) | Samples: 0

**Called by:**
- `(module)` (3)
- `(module)` (1)

**Calls:**
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:687` | Self: 0.0% (0us) | Total: 0.0% (7.5ms) | Samples: 0

**Called by:**
- `runTrial` (10)

**Calls:**
- `map` (10)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:306` | Self: 0.0% (0us) | Total: 0.0% (570us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `fill` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` | Self: 0.0% (0us) | Total: 0.0% (6.1ms) | Samples: 0

**Called by:**
- `runTrial` (8)

**Calls:**
- `map` (8)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (6.0ms) | Samples: 0

**Called by:**
- `(module)` (8)

**Calls:**
- `anonymous` (5)
- `get WriteStream` (3)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:491` | Self: 0.0% (0us) | Total: 0.0% (629us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `map` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:664` | Self: 0.0% (0us) | Total: 1.6% (165.4ms) | Samples: 0

**Called by:**
- `runTrial` (202)
- `runTrial` (1)

**Calls:**
- `forEach` (203)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:669` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `runTrial` (2)

**Calls:**
- `reduce` (2)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` | Self: 0.0% (0us) | Total: 0.5% (57.5ms) | Samples: 0

**Called by:**
- `jacobiEigenSymmetric` (76)

**Calls:**
- `some` (76)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (2.2ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` | Self: 0.0% (0us) | Total: 0.0% (6.0ms) | Samples: 0

**Calls:**
- `(anonymous)` (8)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` | Self: 0.0% (0us) | Total: 6.5% (649.5ms) | Samples: 0

**Calls:**
- `runTrial` (829)
- `runTrial` (11)
- `runTrial` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` | Self: 0.0% (0us) | Total: 0.4% (42.8ms) | Samples: 0

**Called by:**
- `(module)` (45)
- `(module)` (11)

**Calls:**
- `step` (30)
- `step` (7)
- `step` (5)
- `step` (4)
- `step` (2)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:534` | Self: 0.0% (0us) | Total: 0.4% (47.0ms) | Samples: 0

**Called by:**
- `step` (60)

**Calls:**
- `cloneMatrix` (57)
- `map` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` | Self: 0.0% (0us) | Total: 0.6% (63.9ms) | Samples: 0

**Called by:**
- `runTrial` (82)
- `runTrial` (1)

**Calls:**
- `map` (83)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (2.9ms) | Samples: 0

**Called by:**
- `anonymous` (4)

**Calls:**
- `anonymous` (4)

### `internal:primordials`
`internal:primordials:51` | Self: 0.0% (0us) | Total: 0.0% (624us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `createSafeIterator` (1)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 92.1% | 9.10s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 7.5% | 742.6ms | `[native code]` |
| 0.3% | 29.9ms | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.0% | 624us | `internal:primordials` |
| 0.0% | 620us | `internal:streams/destroy` |
