# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 9.73s | 12475 | 500us | 156 |

**Top 10:** `jacobiEigenSymmetric` 40.7%, `step` 19.1%, `transformFromEigenCoordinates` 4.4%, `step` 3.3%, `reconstructSymmetric` 2.9%, `whitenWithEigensystem` 2.7%, `whitenWithEigensystem` 2.6%, `map` 2.3%, `step` 1.8%, `step` 1.8%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 40.7% | 3.96s | 42.5% | 4.13s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 19.1% | 1.86s | 19.1% | 1.86s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:649` |
| 4.4% | 435.9ms | 4.6% | 453.0ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 3.3% | 325.8ms | 3.7% | 366.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:642` |
| 2.9% | 282.6ms | 3.4% | 335.6ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` |
| 2.7% | 262.7ms | 2.7% | 266.9ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` |
| 2.6% | 253.8ms | 2.6% | 257.1ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 2.3% | 229.7ms | 4.6% | 453.1ms | `map` | `[native code]` |
| 1.8% | 184.0ms | 1.8% | 184.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` |
| 1.8% | 176.8ms | 1.8% | 176.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:687` |
| 1.7% | 174.9ms | 1.7% | 174.9ms | `hypot` | `[native code]` |
| 1.6% | 158.9ms | 1.6% | 158.9ms | `fill` | `[native code]` |
| 1.5% | 148.0ms | 1.5% | 148.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` |
| 1.4% | 145.0ms | 2.3% | 225.9ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.1% | 111.7ms | 1.1% | 111.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.7% | 76.0ms | 0.7% | 76.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.7% | 70.4ms | 0.7% | 70.4ms | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:372` |
| 0.6% | 63.8ms | 0.9% | 88.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.5% | 56.1ms | 0.5% | 56.1ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:545` |
| 0.5% | 54.7ms | 0.6% | 64.7ms | `sort` | `[native code]` |
| 0.4% | 46.4ms | 1.7% | 166.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` |
| 0.4% | 44.3ms | 0.4% | 44.3ms | `Float64Array` | `[native code]` |
| 0.4% | 43.8ms | 1.3% | 135.3ms | `from` | `[native code]` |
| 0.4% | 41.4ms | 1.4% | 144.0ms | `some` | `[native code]` |
| 0.3% | 38.7ms | 0.8% | 78.4ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.3% | 38.4ms | 0.3% | 38.4ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.3% | 37.4ms | 0.7% | 73.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.3% | 37.4ms | 0.3% | 37.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.2% | 23.6ms | 0.2% | 23.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.2% | 21.0ms | 0.2% | 21.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` |
| 0.2% | 19.5ms | 0.2% | 19.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` |
| 0.1% | 16.9ms | 0.1% | 16.9ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:303` |
| 0.1% | 16.5ms | 0.1% | 16.5ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.1% | 16.2ms | 0.8% | 86.7ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:523` |
| 0.1% | 16.2ms | 0.1% | 16.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:618` |
| 0.1% | 15.1ms | 0.1% | 15.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:600` |
| 0.0% | 9.1ms | 0.0% | 9.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:650` |
| 0.0% | 9.1ms | 0.0% | 9.1ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 8.5ms | 0.0% | 8.5ms | `push` | `[native code]` |
| 0.0% | 8.5ms | 0.0% | 8.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 7.2ms | 0.0% | 7.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` |
| 0.0% | 7.1ms | 0.0% | 7.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` |
| 0.0% | 6.0ms | 0.0% | 6.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:635` |
| 0.0% | 5.8ms | 46.0% | 4.47s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` |
| 0.0% | 5.6ms | 0.8% | 83.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:564` |
| 0.0% | 5.5ms | 0.0% | 5.5ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 5.4ms | 0.1% | 12.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.0% | 5.1ms | 0.0% | 6.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:634` |
| 0.0% | 5.1ms | 0.8% | 81.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 0.0% | 4.8ms | 2.0% | 201.0ms | `forEach` | `[native code]` |
| 0.0% | 4.8ms | 0.0% | 5.4ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:533` |
| 0.0% | 4.6ms | 0.0% | 4.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` |
| 0.0% | 4.6ms | 0.0% | 4.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:626` |
| 0.0% | 4.5ms | 0.1% | 19.3ms | `anonymous` | `[native code]` |
| 0.0% | 4.4ms | 0.0% | 4.4ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:525` |
| 0.0% | 4.2ms | 0.0% | 4.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:166` |
| 0.0% | 4.2ms | 0.0% | 4.2ms | `reduce` | `[native code]` |
| 0.0% | 3.9ms | 2.6% | 256.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` |
| 0.0% | 3.9ms | 0.3% | 29.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:678` |
| 0.0% | 3.7ms | 0.0% | 3.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` |
| 0.0% | 3.5ms | 0.6% | 66.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:624` |
| 0.0% | 3.2ms | 0.0% | 3.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` |
| 0.0% | 3.1ms | 0.0% | 4.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:706` |
| 0.0% | 3.0ms | 0.0% | 5.6ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:524` |
| 0.0% | 2.8ms | 0.7% | 72.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:691` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:554` |
| 0.0% | 2.3ms | 0.4% | 39.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:705` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:716` |
| 0.0% | 2.2ms | 0.2% | 23.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:646` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:710` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` |
| 0.0% | 1.7ms | 0.0% | 8.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `integerArgument` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:14` |
| 0.0% | 1.6ms | 0.1% | 14.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:696` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `max` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 5.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:682` |
| 0.0% | 1.5ms | 0.8% | 79.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.0% | 1.4ms | 4.7% | 463.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:655` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:269` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:707` |
| 0.0% | 918us | 0.0% | 918us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 912us | 0.0% | 912us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:555` |
| 0.0% | 905us | 3.4% | 336.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 0.0% | 898us | 0.0% | 898us | `filter` | `[native code]` |
| 0.0% | 863us | 2.0% | 196.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:677` |
| 0.0% | 846us | 0.0% | 846us | `isFinite` | `[native code]` |
| 0.0% | 846us | 0.0% | 846us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 838us | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` |
| 0.0% | 834us | 0.0% | 834us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:474` |
| 0.0% | 822us | 0.0% | 822us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:445` |
| 0.0% | 801us | 0.0% | 6.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` |
| 0.0% | 781us | 0.0% | 781us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` |
| 0.0% | 773us | 0.0% | 773us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 0.0% | 754us | 0.0% | 754us | `abs` | `[native code]` |
| 0.0% | 727us | 1.4% | 140.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:675` |
| 0.0% | 726us | 0.0% | 726us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:169` |
| 0.0% | 723us | 0.0% | 723us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 717us | 0.5% | 51.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.0% | 664us | 0.0% | 664us | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:274` |
| 0.0% | 648us | 0.0% | 648us | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 648us | 0.7% | 74.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.0% | 644us | 0.0% | 644us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` |
| 0.0% | 643us | 0.0% | 643us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:440` |
| 0.0% | 641us | 0.0% | 641us | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:40` |
| 0.0% | 629us | 0.0% | 629us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:310` |
| 0.0% | 625us | 0.0% | 625us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:90` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 99.4% | 9.67s | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 93.5% | 9.10s | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` |
| 46.0% | 4.47s | 0.0% | 5.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` |
| 42.5% | 4.13s | 40.7% | 3.96s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 19.1% | 1.86s | 19.1% | 1.86s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:649` |
| 6.3% | 617.9ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` |
| 4.7% | 463.6ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` |
| 4.6% | 453.5ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:629` |
| 4.6% | 453.1ms | 2.3% | 229.7ms | `map` | `[native code]` |
| 4.6% | 453.0ms | 4.4% | 435.9ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 3.7% | 366.3ms | 3.3% | 325.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:642` |
| 3.4% | 336.5ms | 0.0% | 905us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 3.4% | 335.6ms | 2.9% | 282.6ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` |
| 2.7% | 266.9ms | 2.7% | 262.7ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` |
| 2.6% | 257.1ms | 2.6% | 253.8ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 2.6% | 256.9ms | 0.0% | 3.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` |
| 2.3% | 225.9ms | 1.4% | 145.0ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 2.0% | 201.0ms | 0.0% | 4.8ms | `forEach` | `[native code]` |
| 2.0% | 196.3ms | 0.0% | 863us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:677` |
| 1.8% | 184.0ms | 1.8% | 184.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` |
| 1.8% | 176.8ms | 1.8% | 176.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:687` |
| 1.7% | 174.9ms | 1.7% | 174.9ms | `hypot` | `[native code]` |
| 1.7% | 166.2ms | 0.4% | 46.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` |
| 1.6% | 158.9ms | 1.6% | 158.9ms | `fill` | `[native code]` |
| 1.5% | 148.0ms | 1.5% | 148.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` |
| 1.4% | 144.0ms | 0.4% | 41.4ms | `some` | `[native code]` |
| 1.4% | 140.9ms | 0.0% | 727us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:675` |
| 1.3% | 135.3ms | 0.4% | 43.8ms | `from` | `[native code]` |
| 1.1% | 113.9ms | 0.0% | 0us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 1.1% | 111.7ms | 1.1% | 111.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.9% | 88.0ms | 0.6% | 63.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.8% | 86.7ms | 0.1% | 16.2ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:523` |
| 0.8% | 83.8ms | 0.0% | 5.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:564` |
| 0.8% | 81.6ms | 0.0% | 5.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 0.8% | 79.6ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.8% | 78.4ms | 0.3% | 38.7ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.7% | 76.0ms | 0.7% | 76.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.7% | 74.5ms | 0.0% | 648us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.7% | 73.5ms | 0.3% | 37.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.7% | 72.7ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 0.7% | 72.0ms | 0.0% | 0us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.7% | 72.0ms | 0.0% | 2.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.7% | 70.4ms | 0.7% | 70.4ms | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:372` |
| 0.6% | 66.1ms | 0.0% | 3.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:624` |
| 0.6% | 66.0ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` |
| 0.6% | 64.7ms | 0.5% | 54.7ms | `sort` | `[native code]` |
| 0.5% | 56.1ms | 0.5% | 56.1ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:545` |
| 0.5% | 51.1ms | 0.0% | 717us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.4% | 45.9ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:537` |
| 0.4% | 44.6ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` |
| 0.4% | 44.3ms | 0.4% | 44.3ms | `Float64Array` | `[native code]` |
| 0.4% | 39.8ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:705` |
| 0.3% | 38.4ms | 0.3% | 38.4ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.3% | 37.4ms | 0.3% | 37.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.3% | 37.2ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` |
| 0.3% | 30.2ms | 0.0% | 0us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.3% | 29.8ms | 0.0% | 3.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:678` |
| 0.2% | 23.9ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.2% | 23.6ms | 0.2% | 23.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.2% | 21.0ms | 0.2% | 21.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` |
| 0.2% | 20.2ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 0.2% | 19.5ms | 0.2% | 19.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` |
| 0.1% | 19.3ms | 0.0% | 4.5ms | `anonymous` | `[native code]` |
| 0.1% | 16.9ms | 0.1% | 16.9ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:303` |
| 0.1% | 16.5ms | 0.1% | 16.5ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.1% | 16.2ms | 0.1% | 16.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:618` |
| 0.1% | 15.1ms | 0.1% | 15.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:600` |
| 0.1% | 14.1ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:696` |
| 0.1% | 12.2ms | 0.0% | 5.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.0% | 9.1ms | 0.0% | 9.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:650` |
| 0.0% | 9.1ms | 0.0% | 9.1ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 8.5ms | 0.0% | 8.5ms | `push` | `[native code]` |
| 0.0% | 8.5ms | 0.0% | 8.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 8.4ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` |
| 0.0% | 8.2ms | 0.0% | 1.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` |
| 0.0% | 7.2ms | 0.0% | 7.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` |
| 0.0% | 7.1ms | 0.0% | 7.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` |
| 0.0% | 6.9ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 6.5ms | 0.0% | 5.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:634` |
| 0.0% | 6.3ms | 0.0% | 801us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` |
| 0.0% | 6.0ms | 0.0% | 6.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:635` |
| 0.0% | 5.7ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:682` |
| 0.0% | 5.6ms | 0.0% | 3.0ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:524` |
| 0.0% | 5.5ms | 0.0% | 5.5ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 5.4ms | 0.0% | 4.8ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:533` |
| 0.0% | 5.1ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.0% | 5.1ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.0% | 4.9ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:581` |
| 0.0% | 4.6ms | 0.0% | 4.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` |
| 0.0% | 4.6ms | 0.0% | 4.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:626` |
| 0.0% | 4.4ms | 0.0% | 4.4ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:525` |
| 0.0% | 4.2ms | 0.0% | 4.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:166` |
| 0.0% | 4.2ms | 0.0% | 4.2ms | `reduce` | `[native code]` |
| 0.0% | 4.0ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` |
| 0.0% | 3.8ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` |
| 0.0% | 3.7ms | 0.0% | 3.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` |
| 0.0% | 3.2ms | 0.0% | 3.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` |
| 0.0% | 3.1ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:706` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:691` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:554` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:716` |
| 0.0% | 2.2ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` |
| 0.0% | 2.2ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 2.2ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:646` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:710` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.7ms | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:305` |
| 0.0% | 1.6ms | 0.0% | 838us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` |
| 0.0% | 1.6ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:24` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `integerArgument` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:14` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `max` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 1.5ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 1.5ms | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 1.5ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:655` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:269` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:707` |
| 0.0% | 918us | 0.0% | 918us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 912us | 0.0% | 912us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:555` |
| 0.0% | 898us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:466` |
| 0.0% | 898us | 0.0% | 898us | `filter` | `[native code]` |
| 0.0% | 889us | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 889us | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 846us | 0.0% | 846us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 846us | 0.0% | 846us | `isFinite` | `[native code]` |
| 0.0% | 834us | 0.0% | 834us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:474` |
| 0.0% | 822us | 0.0% | 822us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:445` |
| 0.0% | 781us | 0.0% | 781us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` |
| 0.0% | 773us | 0.0% | 773us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 0.0% | 754us | 0.0% | 754us | `abs` | `[native code]` |
| 0.0% | 726us | 0.0% | 726us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:169` |
| 0.0% | 723us | 0.0% | 723us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 713us | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:590` |
| 0.0% | 664us | 0.0% | 664us | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:274` |
| 0.0% | 648us | 0.0% | 648us | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 644us | 0.0% | 644us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` |
| 0.0% | 643us | 0.0% | 643us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:440` |
| 0.0% | 641us | 0.0% | 641us | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:40` |
| 0.0% | 635us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:422` |
| 0.0% | 629us | 0.0% | 629us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:310` |
| 0.0% | 625us | 0.0% | 625us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:90` |
| 0.0% | 621us | 0.0% | 0us | `internal:primordials` | `internal:primordials:73` |
| 0.0% | 621us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 621us | 0.0% | 0us | `bound call` | `[native code]` |
| 0.0% | 621us | 0.0% | 0us | `makeSafe` | `internal:primordials:31` |
| 0.0% | 621us | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 621us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |

## Function Details

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` | Self: 40.7% (3.96s) | Total: 42.5% (4.13s) | Samples: 5086

**Called by:**
- `step` (5304)

**Calls:**
- `hypot` (218)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:649` | Self: 19.1% (1.86s) | Total: 19.1% (1.86s) | Samples: 2408

**Called by:**
- `runTrial` (2394)
- `runTrial` (14)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` | Self: 4.4% (435.9ms) | Total: 4.6% (453.0ms) | Samples: 564

**Called by:**
- `step` (586)

**Calls:**
- `createZeroVector` (16)
- `fill` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:642` | Self: 3.3% (325.8ms) | Total: 3.7% (366.3ms) | Samples: 424

**Called by:**
- `runTrial` (476)

**Calls:**
- `createZeroMatrix` (39)
- `from` (12)
- `createZeroMatrix` (1)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` | Self: 2.9% (282.6ms) | Total: 3.4% (335.6ms) | Samples: 359

**Called by:**
- `step` (428)

**Calls:**
- `from` (69)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` | Self: 2.7% (262.7ms) | Total: 2.7% (266.9ms) | Samples: 325

**Called by:**
- `step` (281)
- `step` (49)

**Calls:**
- `fill` (4)
- `createZeroVector` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` | Self: 2.6% (253.8ms) | Total: 2.6% (257.1ms) | Samples: 320

**Called by:**
- `step` (272)
- `step` (52)

**Calls:**
- `createZeroVector` (3)
- `fill` (1)

### `map`
`[native code]` | Self: 2.3% (229.7ms) | Total: 4.6% (453.1ms) | Samples: 293

**Called by:**
- `cloneMatrix` (146)
- `step` (98)
- `step` (96)
- `step` (87)
- `(anonymous)` (82)
- `(anonymous)` (30)
- `step` (9)
- `jacobiEigenSymmetric` (9)
- `jacobiEigenSymmetric` (7)
- `step` (7)
- `alignProjectionBasis` (5)
- `jacobiEigenSymmetric` (4)
- `step` (3)
- `alignProjectionBasis` (1)

**Calls:**
- `(anonymous)` (104)
- `(anonymous)` (97)
- `(anonymous)` (87)
- `(anonymous)` (2)
- `abs` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` | Self: 1.8% (184.0ms) | Total: 1.8% (184.0ms) | Samples: 230

**Called by:**
- `runTrial` (230)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:687` | Self: 1.8% (176.8ms) | Total: 1.8% (176.8ms) | Samples: 230

**Called by:**
- `runTrial` (229)
- `runTrial` (1)

### `hypot`
`[native code]` | Self: 1.7% (174.9ms) | Total: 1.7% (174.9ms) | Samples: 218

**Called by:**
- `jacobiEigenSymmetric` (218)

### `fill`
`[native code]` | Self: 1.6% (158.9ms) | Total: 1.6% (158.9ms) | Samples: 203

**Called by:**
- `sampleGaussianVectorND` (103)
- `ellipsoidObjective` (52)
- `from` (37)
- `transformFromEigenCoordinates` (6)
- `whitenWithEigensystem` (4)
- `whitenWithEigensystem` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` | Self: 1.5% (148.0ms) | Total: 1.5% (148.0ms) | Samples: 194

**Called by:**
- `runTrial` (194)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.4% (145.0ms) | Total: 2.3% (225.9ms) | Samples: 190

**Called by:**
- `step` (293)

**Calls:**
- `fill` (103)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.1% (111.7ms) | Total: 1.1% (111.7ms) | Samples: 143

**Called by:**
- `map` (104)
- `some` (36)
- `from` (1)
- `forEach` (1)
- `CMAESOptimizerND` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 0.7% (76.0ms) | Total: 0.7% (76.0ms) | Samples: 97

**Called by:**
- `map` (97)

### `requireFiniteVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:372` | Self: 0.7% (70.4ms) | Total: 0.7% (70.4ms) | Samples: 92

**Called by:**
- `projectTo3D` (92)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` | Self: 0.6% (63.8ms) | Total: 0.9% (88.0ms) | Samples: 82

**Called by:**
- `step` (114)

**Calls:**
- `Float64Array` (32)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:545` | Self: 0.5% (56.1ms) | Total: 0.5% (56.1ms) | Samples: 72

**Called by:**
- `step` (72)

### `sort`
`[native code]` | Self: 0.5% (54.7ms) | Total: 0.6% (64.7ms) | Samples: 67

**Called by:**
- `jacobiEigenSymmetric` (52)
- `step` (28)

**Calls:**
- `(anonymous)` (11)
- `(anonymous)` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` | Self: 0.4% (46.4ms) | Total: 1.7% (166.2ms) | Samples: 60

**Called by:**
- `forEach` (215)

**Calls:**
- `projectTo3D` (113)
- `projectTo3D` (25)
- `projectTo3D` (7)
- `projectTo3D` (7)
- `projectTo3D` (3)

### `Float64Array`
`[native code]` | Self: 0.4% (44.3ms) | Total: 0.4% (44.3ms) | Samples: 56

**Called by:**
- `jacobiEigenSymmetric` (32)
- `jacobiEigenSymmetric` (24)

### `from`
`[native code]` | Self: 0.4% (43.8ms) | Total: 1.3% (135.3ms) | Samples: 59

**Called by:**
- `reconstructSymmetric` (69)
- `jacobiEigenSymmetric` (46)
- `createZeroMatrix` (39)
- `step` (12)
- `jacobiEigenSymmetric` (9)

**Calls:**
- `(anonymous)` (49)
- `fill` (37)
- `(anonymous)` (29)
- `(anonymous)` (1)

### `some`
`[native code]` | Self: 0.4% (41.4ms) | Total: 1.4% (144.0ms) | Samples: 52

**Called by:**
- `validateSquareFiniteMatrix` (88)
- `(anonymous)` (85)
- `projectTo3D` (3)

**Calls:**
- `(anonymous)` (88)
- `(anonymous)` (36)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` | Self: 0.3% (38.7ms) | Total: 0.8% (78.4ms) | Samples: 49

**Called by:**
- `step` (100)
- `step` (1)

**Calls:**
- `fill` (52)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.3% (38.4ms) | Total: 0.3% (38.4ms) | Samples: 49

**Called by:**
- `(anonymous)` (25)
- `step` (16)
- `step` (8)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.3% (37.4ms) | Total: 0.7% (73.5ms) | Samples: 49

**Called by:**
- `step` (95)

**Calls:**
- `from` (46)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.3% (37.4ms) | Total: 0.3% (37.4ms) | Samples: 49

**Called by:**
- `from` (49)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.2% (23.6ms) | Total: 0.2% (23.6ms) | Samples: 29

**Called by:**
- `from` (29)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` | Self: 0.2% (21.0ms) | Total: 0.2% (21.0ms) | Samples: 28

**Called by:**
- `runTrial` (28)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` | Self: 0.2% (19.5ms) | Total: 0.2% (19.5ms) | Samples: 24

**Called by:**
- `runTrial` (24)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:303` | Self: 0.1% (16.9ms) | Total: 0.1% (16.9ms) | Samples: 21

**Called by:**
- `step` (21)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` | Self: 0.1% (16.5ms) | Total: 0.1% (16.5ms) | Samples: 21

**Called by:**
- `transformFromEigenCoordinates` (16)
- `whitenWithEigensystem` (3)
- `whitenWithEigensystem` (1)
- `step` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:523` | Self: 0.1% (16.2ms) | Total: 0.8% (86.7ms) | Samples: 21

**Called by:**
- `(anonymous)` (113)

**Calls:**
- `requireFiniteVector` (92)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:618` | Self: 0.1% (16.2ms) | Total: 0.1% (16.2ms) | Samples: 21

**Called by:**
- `runTrial` (20)
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:600` | Self: 0.1% (15.1ms) | Total: 0.1% (15.1ms) | Samples: 20

**Called by:**
- `runTrial` (19)
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:650` | Self: 0.0% (9.1ms) | Total: 0.0% (9.1ms) | Samples: 10

**Called by:**
- `runTrial` (10)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (9.1ms) | Total: 0.0% (9.1ms) | Samples: 12

**Called by:**
- `step` (12)

### `push`
`[native code]` | Self: 0.0% (8.5ms) | Total: 0.0% (8.5ms) | Samples: 11

**Called by:**
- `step` (10)
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` | Self: 0.0% (8.5ms) | Total: 0.0% (8.5ms) | Samples: 11

**Called by:**
- `sort` (11)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` | Self: 0.0% (7.2ms) | Total: 0.0% (7.2ms) | Samples: 9

**Called by:**
- `runTrial` (9)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` | Self: 0.0% (7.1ms) | Total: 0.0% (7.1ms) | Samples: 9

**Called by:**
- `runTrial` (9)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:635` | Self: 0.0% (6.0ms) | Total: 0.0% (6.0ms) | Samples: 8

**Called by:**
- `runTrial` (8)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` | Self: 0.0% (5.8ms) | Total: 46.0% (4.47s) | Samples: 2

**Called by:**
- `runTrial` (5697)
- `runTrial` (28)

**Calls:**
- `jacobiEigenSymmetric` (5304)
- `jacobiEigenSymmetric` (114)
- `jacobiEigenSymmetric` (95)
- `jacobiEigenSymmetric` (89)
- `jacobiEigenSymmetric` (62)
- `jacobiEigenSymmetric` (24)
- `jacobiEigenSymmetric` (16)
- `jacobiEigenSymmetric` (9)
- `jacobiEigenSymmetric` (4)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:564` | Self: 0.0% (5.6ms) | Total: 0.8% (83.8ms) | Samples: 7

**Called by:**
- `runTrial` (108)

**Calls:**
- `ellipsoidObjective` (100)
- `ellipsoidObjective` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (5.5ms) | Total: 0.0% (5.5ms) | Samples: 7

**Called by:**
- `step` (6)
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.0% (5.4ms) | Total: 0.1% (12.2ms) | Samples: 7

**Called by:**
- `step` (16)

**Calls:**
- `map` (7)
- `max` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:634` | Self: 0.0% (5.1ms) | Total: 0.0% (6.5ms) | Samples: 7

**Called by:**
- `runTrial` (9)

**Calls:**
- `vecDot` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` | Self: 0.0% (5.1ms) | Total: 0.8% (81.6ms) | Samples: 7

**Called by:**
- `runTrial` (105)

**Calls:**
- `map` (98)

### `forEach`
`[native code]` | Self: 0.0% (4.8ms) | Total: 2.0% (201.0ms) | Samples: 6

**Called by:**
- `step` (249)
- `step` (6)
- `bound call` (1)

**Calls:**
- `(anonymous)` (215)
- `(anonymous)` (33)
- `(anonymous)` (1)
- `(anonymous)` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:533` | Self: 0.0% (4.8ms) | Total: 0.0% (5.4ms) | Samples: 6

**Called by:**
- `(anonymous)` (7)

**Calls:**
- `coordinate` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` | Self: 0.0% (4.6ms) | Total: 0.0% (4.6ms) | Samples: 6

**Called by:**
- `runTrial` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:626` | Self: 0.0% (4.6ms) | Total: 0.0% (4.6ms) | Samples: 6

**Called by:**
- `runTrial` (6)

### `anonymous`
`[native code]` | Self: 0.0% (4.5ms) | Total: 0.1% (19.3ms) | Samples: 6

**Called by:**
- `(anonymous)` (4)
- `get WriteStream` (3)
- `node:fs/promises` (3)
- `node:fs` (3)
- `internal:fs/streams` (2)
- `internal:stream` (2)
- `internal:streams/compose` (2)
- `node:stream` (2)
- `node:events` (1)
- `internal:validators` (1)
- `internal:streams/pipeline` (1)
- `internal:shared` (1)
- `internal:streams/duplex` (1)

**Calls:**
- `node:fs/promises` (3)
- `node:fs` (3)
- `internal:fs/streams` (2)
- `internal:stream` (2)
- `internal:streams/compose` (2)
- `node:stream` (2)
- `node:events` (1)
- `internal:streams/pipeline` (1)
- `internal:validators` (1)
- `internal:shared` (1)
- `internal:primordials` (1)
- `internal:streams/duplex` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:525` | Self: 0.0% (4.4ms) | Total: 0.0% (4.4ms) | Samples: 6

**Called by:**
- `step` (3)
- `(anonymous)` (3)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:166` | Self: 0.0% (4.2ms) | Total: 0.0% (4.2ms) | Samples: 1

**Called by:**
- `step` (1)

### `reduce`
`[native code]` | Self: 0.0% (4.2ms) | Total: 0.0% (4.2ms) | Samples: 6

**Called by:**
- `step` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` | Self: 0.0% (3.9ms) | Total: 2.6% (256.9ms) | Samples: 5

**Called by:**
- `runTrial` (330)
- `runTrial` (2)

**Calls:**
- `sampleGaussianVectorND` (293)
- `sampleGaussianVectorND` (21)
- `push` (10)
- `sampleGaussianVectorND` (2)
- `sampleGaussianVectorND` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:678` | Self: 0.0% (3.9ms) | Total: 0.3% (29.8ms) | Samples: 5

**Called by:**
- `forEach` (33)
- `map` (2)

**Calls:**
- `map` (30)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` | Self: 0.0% (3.7ms) | Total: 0.0% (3.7ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:624` | Self: 0.0% (3.5ms) | Total: 0.6% (66.1ms) | Samples: 5

**Called by:**
- `map` (87)

**Calls:**
- `map` (82)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` | Self: 0.0% (3.2ms) | Total: 0.0% (3.2ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` | Self: 0.0% (3.1ms) | Total: 0.0% (4.0ms) | Samples: 4

**Called by:**
- `runTrial` (5)

**Calls:**
- `push` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:706` | Self: 0.0% (3.0ms) | Total: 0.0% (3.0ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:524` | Self: 0.0% (3.0ms) | Total: 0.0% (5.6ms) | Samples: 4

**Called by:**
- `(anonymous)` (7)

**Calls:**
- `some` (3)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (2.8ms) | Total: 0.7% (72.0ms) | Samples: 3

**Called by:**
- `some` (88)

**Calls:**
- `some` (85)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` | Self: 0.0% (2.4ms) | Total: 0.0% (2.4ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:691` | Self: 0.0% (2.4ms) | Total: 0.0% (2.4ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:554` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:705` | Self: 0.0% (2.3ms) | Total: 0.4% (39.8ms) | Samples: 2

**Called by:**
- `runTrial` (49)

**Calls:**
- `cloneMatrix` (44)
- `map` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:716` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` | Self: 0.0% (2.2ms) | Total: 0.2% (23.9ms) | Samples: 3

**Called by:**
- `runTrial` (31)
- `runTrial` (1)

**Calls:**
- `sort` (28)
- `ellipsoidObjective` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` | Self: 0.0% (2.2ms) | Total: 0.0% (2.2ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:646` | Self: 0.0% (2.2ms) | Total: 0.0% (2.2ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:710` | Self: 0.0% (2.1ms) | Total: 0.0% (2.1ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` | Self: 0.0% (2.0ms) | Total: 0.0% (2.0ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` | Self: 0.0% (1.7ms) | Total: 0.0% (8.2ms) | Samples: 2

**Called by:**
- `runTrial` (11)

**Calls:**
- `map` (9)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` | Self: 0.0% (1.7ms) | Total: 0.0% (1.7ms) | Samples: 2

**Called by:**
- `step` (2)

### `nextOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.7ms) | Total: 0.0% (1.7ms) | Samples: 2

**Called by:**
- `sampleGaussianVectorND` (2)

### `integerArgument`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:14` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 1

**Called by:**
- `(module)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:696` | Self: 0.0% (1.6ms) | Total: 0.1% (14.1ms) | Samples: 2

**Called by:**
- `runTrial` (18)

**Calls:**
- `projectTo3D` (16)

### `max`
`[native code]` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `jacobiEigenSymmetric` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:682` | Self: 0.0% (1.5ms) | Total: 0.0% (5.7ms) | Samples: 2

**Called by:**
- `runTrial` (8)

**Calls:**
- `reduce` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` | Self: 0.0% (1.5ms) | Total: 0.8% (79.6ms) | Samples: 2

**Called by:**
- `runTrial` (104)

**Calls:**
- `whitenWithEigensystem` (52)
- `whitenWithEigensystem` (49)
- `whitenWithEigensystem` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` | Self: 0.0% (1.4ms) | Total: 4.7% (463.6ms) | Samples: 2

**Called by:**
- `runTrial` (597)
- `runTrial` (3)

**Calls:**
- `transformFromEigenCoordinates` (586)
- `transformFromEigenCoordinates` (12)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:655` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `sort` (2)

### `vecDot`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `step` (2)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:269` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:707` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (918us) | Total: 0.0% (918us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:555` | Self: 0.0% (912us) | Total: 0.0% (912us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` | Self: 0.0% (905us) | Total: 3.4% (336.5ms) | Samples: 1

**Called by:**
- `runTrial` (428)
- `runTrial` (1)

**Calls:**
- `reconstructSymmetric` (428)

### `filter`
`[native code]` | Self: 0.0% (898us) | Total: 0.0% (898us) | Samples: 1

**Called by:**
- `CMAESOptimizerND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:677` | Self: 0.0% (863us) | Total: 2.0% (196.3ms) | Samples: 1

**Called by:**
- `runTrial` (250)

**Calls:**
- `forEach` (249)

### `isFinite`
`[native code]` | Self: 0.0% (846us) | Total: 0.0% (846us) | Samples: 1

**Called by:**
- `step` (1)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (846us) | Total: 0.0% (846us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` | Self: 0.0% (838us) | Total: 0.0% (1.6ms) | Samples: 1

**Called by:**
- `runTrial` (2)

**Calls:**
- `isFinite` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:474` | Self: 0.0% (834us) | Total: 0.0% (834us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:445` | Self: 0.0% (822us) | Total: 0.0% (822us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` | Self: 0.0% (801us) | Total: 0.0% (6.3ms) | Samples: 1

**Called by:**
- `runTrial` (8)

**Calls:**
- `map` (7)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` | Self: 0.0% (781us) | Total: 0.0% (781us) | Samples: 1

**Called by:**
- `forEach` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` | Self: 0.0% (773us) | Total: 0.0% (773us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `abs`
`[native code]` | Self: 0.0% (754us) | Total: 0.0% (754us) | Samples: 1

**Called by:**
- `map` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:675` | Self: 0.0% (727us) | Total: 1.4% (140.9ms) | Samples: 1

**Called by:**
- `runTrial` (180)
- `runTrial` (2)

**Calls:**
- `alignProjectionBasis` (72)
- `alignProjectionBasis` (60)
- `alignProjectionBasis` (48)
- `alignProjectionBasis` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:169` | Self: 0.0% (726us) | Total: 0.0% (726us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (723us) | Total: 0.0% (723us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` | Self: 0.0% (717us) | Total: 0.5% (51.1ms) | Samples: 1

**Called by:**
- `step` (62)

**Calls:**
- `sort` (52)
- `from` (9)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:274` | Self: 0.0% (664us) | Total: 0.0% (664us) | Samples: 1

**Called by:**
- `step` (1)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (648us) | Total: 0.0% (648us) | Samples: 1

**Called by:**
- `projectTo3D` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` | Self: 0.0% (648us) | Total: 0.7% (74.5ms) | Samples: 1

**Called by:**
- `runTrial` (96)
- `runTrial` (1)

**Calls:**
- `map` (96)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` | Self: 0.0% (644us) | Total: 0.0% (644us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:440` | Self: 0.0% (643us) | Total: 0.0% (643us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:40` | Self: 0.0% (641us) | Total: 0.0% (641us) | Samples: 1

**Called by:**
- `step` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:310` | Self: 0.0% (629us) | Total: 0.0% (629us) | Samples: 1

**Called by:**
- `step` (1)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:90` | Self: 0.0% (625us) | Total: 0.0% (625us) | Samples: 1

**Called by:**
- `jacobiEigenSymmetric` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` | Self: 0.0% (0us) | Total: 93.5% (9.10s) | Samples: 0

**Calls:**
- `runTrial` (11624)
- `runTrial` (50)
- `runTrial` (5)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (621us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:590` | Self: 0.0% (0us) | Total: 0.0% (713us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `createZeroVector` (1)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.0% (0us) | Total: 0.3% (30.2ms) | Samples: 0

**Called by:**
- `step` (39)

**Calls:**
- `from` (39)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (0us) | Total: 0.7% (72.0ms) | Samples: 0

**Called by:**
- `jacobiEigenSymmetric` (88)

**Calls:**
- `some` (88)

### `bound call`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (621us) | Samples: 0

**Called by:**
- `makeSafe` (1)

**Calls:**
- `forEach` (1)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (889us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:629` | Self: 0.0% (0us) | Total: 4.6% (453.5ms) | Samples: 0

**Called by:**
- `runTrial` (559)
- `runTrial` (3)

**Calls:**
- `whitenWithEigensystem` (281)
- `whitenWithEigensystem` (272)
- `whitenWithEigensystem` (6)
- `whitenWithEigensystem` (2)
- `whitenWithEigensystem` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` | Self: 0.0% (0us) | Total: 0.0% (8.4ms) | Samples: 0

**Called by:**
- `runTrial` (11)

**Calls:**
- `projectTo3D` (8)
- `projectTo3D` (3)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (2.2ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` | Self: 0.0% (0us) | Total: 0.2% (20.2ms) | Samples: 0

**Called by:**
- `step` (24)

**Calls:**
- `Float64Array` (24)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` | Self: 0.0% (0us) | Total: 0.6% (66.0ms) | Samples: 0

**Called by:**
- `runTrial` (87)

**Calls:**
- `map` (87)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` | Self: 0.0% (0us) | Total: 0.0% (5.1ms) | Samples: 0

**Calls:**
- `(anonymous)` (7)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` | Self: 0.0% (0us) | Total: 0.0% (6.9ms) | Samples: 0

**Called by:**
- `step` (9)

**Calls:**
- `map` (9)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (621us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` | Self: 0.0% (0us) | Total: 6.3% (617.9ms) | Samples: 0

**Calls:**
- `runTrial` (780)
- `runTrial` (8)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` | Self: 0.0% (0us) | Total: 0.7% (72.7ms) | Samples: 0

**Called by:**
- `step` (89)

**Calls:**
- `validateSquareFiniteMatrix` (88)
- `validateSquareFiniteMatrix` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:24` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Calls:**
- `integerArgument` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` | Self: 0.0% (0us) | Total: 0.3% (37.2ms) | Samples: 0

**Called by:**
- `step` (48)

**Calls:**
- `cloneMatrix` (43)
- `map` (5)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:581` | Self: 0.0% (0us) | Total: 0.0% (4.9ms) | Samples: 0

**Called by:**
- `runTrial` (6)

**Calls:**
- `forEach` (6)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` | Self: 0.0% (0us) | Total: 0.0% (3.1ms) | Samples: 0

**Called by:**
- `step` (4)

**Calls:**
- `map` (4)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (2.2ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` | Self: 0.0% (0us) | Total: 99.4% (9.67s) | Samples: 0

**Called by:**
- `(module)` (11624)
- `(module)` (780)

**Calls:**
- `step` (5697)
- `step` (2394)
- `step` (597)
- `step` (559)
- `step` (476)
- `step` (428)
- `step` (330)
- `step` (250)
- `step` (230)
- `step` (229)
- `step` (194)
- `step` (180)
- `step` (108)
- `step` (105)
- `step` (104)
- `step` (96)
- `step` (87)
- `step` (49)
- `step` (31)
- `step` (28)
- `step` (24)
- `step` (20)
- `step` (19)
- `step` (18)
- `step` (11)
- `step` (11)
- `step` (10)
- `step` (9)
- `step` (9)
- `step` (9)
- `step` (8)
- `step` (8)
- `step` (8)
- `step` (6)
- `step` (6)
- `step` (6)
- `step` (5)
- `step` (5)
- `step` (4)
- `step` (4)
- `step` (3)
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
- `step` (1)
- `step` (1)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` | Self: 0.0% (0us) | Total: 0.0% (3.8ms) | Samples: 0

**Called by:**
- `(module)` (5)

**Calls:**
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:537` | Self: 0.0% (0us) | Total: 0.4% (45.9ms) | Samples: 0

**Called by:**
- `step` (60)

**Calls:**
- `cloneMatrix` (59)
- `map` (1)

### `internal:primordials`
`internal:primordials:73` | Self: 0.0% (0us) | Total: 0.0% (621us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `makeSafe` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:466` | Self: 0.0% (0us) | Total: 0.0% (898us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `filter` (1)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (5.1ms) | Samples: 0

**Called by:**
- `(module)` (7)

**Calls:**
- `anonymous` (4)
- `get WriteStream` (3)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:305` | Self: 0.0% (0us) | Total: 0.0% (1.7ms) | Samples: 0

**Called by:**
- `step` (2)

**Calls:**
- `nextOpenUnit` (2)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (889us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` | Self: 0.0% (0us) | Total: 0.4% (44.6ms) | Samples: 0

**Called by:**
- `(module)` (50)
- `(module)` (8)

**Calls:**
- `step` (28)
- `step` (14)
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

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 0.0% (0us) | Total: 1.1% (113.9ms) | Samples: 0

**Called by:**
- `alignProjectionBasis` (59)
- `step` (44)
- `alignProjectionBasis` (43)

**Calls:**
- `map` (146)

### `makeSafe`
`internal:primordials:31` | Self: 0.0% (0us) | Total: 0.0% (621us) | Samples: 0

**Called by:**
- `internal:primordials` (1)

**Calls:**
- `bound call` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:422` | Self: 0.0% (0us) | Total: 0.0% (635us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `(anonymous)` (1)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (2.2ms) | Samples: 0

**Called by:**
- `(anonymous)` (3)

**Calls:**
- `anonymous` (3)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (621us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 91.6% | 8.91s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 7.9% | 774.3ms | `[native code]` |
| 0.4% | 41.0ms | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
