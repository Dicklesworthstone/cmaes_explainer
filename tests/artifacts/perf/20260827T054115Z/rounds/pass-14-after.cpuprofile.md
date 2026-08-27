# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 9.08s | 11773 | 500us | 154 |

**Top 10:** `jacobiEigenSymmetric` 41.4%, `step` 20.0%, `transformFromEigenCoordinates` 4.5%, `step` 3.7%, `mahalanobisSquaredWithEigensystem` 3.2%, `reconstructSymmetric` 2.9%, `map` 2.1%, `step` 2.1%, `step` 1.6%, `fill` 1.6%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 41.4% | 3.76s | 42.9% | 3.89s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 20.0% | 1.81s | 20.0% | 1.81s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` |
| 4.5% | 415.1ms | 4.7% | 427.8ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 3.7% | 340.5ms | 4.2% | 387.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 3.2% | 294.1ms | 3.3% | 300.9ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:286` |
| 2.9% | 269.8ms | 3.4% | 313.8ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` |
| 2.1% | 196.0ms | 4.6% | 421.9ms | `map` | `[native code]` |
| 2.1% | 194.2ms | 2.1% | 194.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:686` |
| 1.6% | 151.6ms | 1.6% | 151.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` |
| 1.6% | 145.5ms | 1.6% | 145.5ms | `fill` | `[native code]` |
| 1.5% | 140.5ms | 1.5% | 140.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:683` |
| 1.4% | 131.9ms | 2.2% | 201.1ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.4% | 130.4ms | 1.4% | 130.4ms | `hypot` | `[native code]` |
| 1.2% | 113.2ms | 1.2% | 113.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.9% | 82.6ms | 1.1% | 105.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.9% | 82.3ms | 0.9% | 82.3ms | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:397` |
| 0.7% | 65.7ms | 0.7% | 65.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.6% | 56.5ms | 0.6% | 56.5ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 0.5% | 49.0ms | 1.5% | 136.7ms | `from` | `[native code]` |
| 0.4% | 43.7ms | 1.3% | 122.0ms | `some` | `[native code]` |
| 0.4% | 42.4ms | 0.9% | 82.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.4% | 40.2ms | 0.5% | 47.8ms | `sort` | `[native code]` |
| 0.4% | 40.0ms | 0.4% | 40.0ms | `Float64Array` | `[native code]` |
| 0.4% | 37.9ms | 0.4% | 37.9ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.4% | 36.8ms | 0.4% | 36.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.3% | 29.3ms | 1.6% | 153.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` |
| 0.2% | 23.9ms | 0.2% | 23.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` |
| 0.2% | 23.5ms | 0.2% | 24.4ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` |
| 0.2% | 23.1ms | 0.6% | 63.2ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.2% | 23.1ms | 0.2% | 23.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` |
| 0.2% | 22.6ms | 0.2% | 22.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.1% | 17.5ms | 0.2% | 20.7ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 0.1% | 17.4ms | 0.1% | 17.4ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.1% | 15.1ms | 0.1% | 15.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` |
| 0.1% | 13.4ms | 0.1% | 13.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:625` |
| 0.1% | 10.9ms | 1.0% | 93.3ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:548` |
| 0.0% | 9.0ms | 0.0% | 9.0ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 7.3ms | 0.0% | 7.3ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:328` |
| 0.0% | 7.1ms | 0.0% | 7.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:735` |
| 0.0% | 7.1ms | 0.0% | 7.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |
| 0.0% | 6.6ms | 0.0% | 6.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 6.3ms | 0.0% | 6.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` |
| 0.0% | 5.8ms | 0.0% | 8.1ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:558` |
| 0.0% | 5.7ms | 2.3% | 217.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:585` |
| 0.0% | 5.2ms | 0.7% | 68.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:589` |
| 0.0% | 4.7ms | 0.0% | 4.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:730` |
| 0.0% | 4.6ms | 0.1% | 10.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.0% | 4.4ms | 0.2% | 24.1ms | `anonymous` | `[native code]` |
| 0.0% | 4.1ms | 0.0% | 4.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:651` |
| 0.0% | 3.9ms | 3.3% | 305.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` |
| 0.0% | 3.9ms | 0.0% | 3.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` |
| 0.0% | 3.6ms | 0.0% | 3.6ms | `abs` | `[native code]` |
| 0.0% | 3.2ms | 0.0% | 3.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` |
| 0.0% | 3.1ms | 0.2% | 19.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:591` |
| 0.0% | 2.9ms | 0.0% | 2.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:734` |
| 0.0% | 2.9ms | 0.0% | 2.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` |
| 0.0% | 2.9ms | 0.7% | 68.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.0% | 2.3ms | 0.0% | 3.2ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` |
| 0.0% | 2.3ms | 0.4% | 39.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:555` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `push` | `[native code]` |
| 0.0% | 2.2ms | 4.8% | 439.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.0% | 2.1ms | 0.1% | 16.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:550` |
| 0.0% | 2.1ms | 1.9% | 173.2ms | `forEach` | `[native code]` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:731` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:581` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:21` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.4ms | 3.4% | 315.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:690` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:740` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `isFinite` | `[native code]` |
| 0.0% | 1.3ms | 0.6% | 61.9ms | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` |
| 0.0% | 1.2ms | 0.1% | 17.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:702` |
| 0.0% | 942us | 0.0% | 942us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` |
| 0.0% | 929us | 0.0% | 929us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:619` |
| 0.0% | 903us | 0.0% | 903us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` |
| 0.0% | 891us | 0.0% | 891us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 881us | 0.0% | 881us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:465` |
| 0.0% | 875us | 0.0% | 875us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:152` |
| 0.0% | 867us | 0.8% | 77.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:588` |
| 0.0% | 862us | 0.0% | 862us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 0.0% | 858us | 0.0% | 858us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 0.0% | 854us | 0.0% | 854us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:719` |
| 0.0% | 844us | 0.5% | 46.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:631` |
| 0.0% | 821us | 0.0% | 821us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:667` |
| 0.0% | 816us | 0.0% | 816us | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 801us | 0.0% | 801us | `internal:primordials` | `internal:primordials:2` |
| 0.0% | 795us | 0.0% | 795us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:584` |
| 0.0% | 785us | 0.0% | 785us | `max` | `[native code]` |
| 0.0% | 777us | 0.0% | 777us | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:290` |
| 0.0% | 774us | 0.0% | 774us | `@lazy` | `[native code]` |
| 0.0% | 760us | 0.0% | 3.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` |
| 0.0% | 760us | 0.0% | 760us | `slice` | `[native code]` |
| 0.0% | 750us | 0.0% | 750us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:334` |
| 0.0% | 739us | 0.0% | 739us | `WriteStream` | `internal:fs/streams` |
| 0.0% | 732us | 0.0% | 732us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:252` |
| 0.0% | 715us | 0.0% | 7.4ms | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.0% | 715us | 0.5% | 45.9ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 0.0% | 709us | 0.0% | 1.5ms | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:478` |
| 0.0% | 687us | 0.0% | 687us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.0% | 669us | 0.0% | 3.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.0% | 656us | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:741` |
| 0.0% | 656us | 0.0% | 656us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:457` |
| 0.0% | 645us | 0.0% | 645us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 636us | 0.0% | 636us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:579` |
| 0.0% | 588us | 0.0% | 588us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:706` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 99.3% | 9.02s | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 93.2% | 8.47s | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` |
| 46.5% | 4.22s | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:689` |
| 42.9% | 3.89s | 41.4% | 3.76s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 20.0% | 1.81s | 20.0% | 1.81s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` |
| 6.6% | 605.6ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` |
| 4.8% | 439.8ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` |
| 4.7% | 427.8ms | 4.5% | 415.1ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 4.6% | 421.9ms | 2.1% | 196.0ms | `map` | `[native code]` |
| 4.2% | 387.7ms | 3.7% | 340.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 3.4% | 315.3ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:690` |
| 3.4% | 313.8ms | 2.9% | 269.8ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` |
| 3.3% | 305.6ms | 0.0% | 3.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` |
| 3.3% | 300.9ms | 3.2% | 294.1ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:286` |
| 2.3% | 217.3ms | 0.0% | 5.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:585` |
| 2.2% | 201.1ms | 1.4% | 131.9ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 2.1% | 194.2ms | 2.1% | 194.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:686` |
| 1.9% | 173.2ms | 0.0% | 2.1ms | `forEach` | `[native code]` |
| 1.8% | 170.3ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:701` |
| 1.6% | 153.4ms | 0.3% | 29.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` |
| 1.6% | 151.6ms | 1.6% | 151.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` |
| 1.6% | 145.5ms | 1.6% | 145.5ms | `fill` | `[native code]` |
| 1.5% | 140.5ms | 1.5% | 140.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:683` |
| 1.5% | 136.7ms | 0.5% | 49.0ms | `from` | `[native code]` |
| 1.4% | 130.4ms | 1.4% | 130.4ms | `hypot` | `[native code]` |
| 1.3% | 123.4ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:699` |
| 1.3% | 122.0ms | 0.4% | 43.7ms | `some` | `[native code]` |
| 1.2% | 113.2ms | 1.2% | 113.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.1% | 105.5ms | 0.9% | 82.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 1.0% | 93.5ms | 0.0% | 0us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 1.0% | 93.3ms | 0.1% | 10.9ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:548` |
| 0.9% | 82.3ms | 0.9% | 82.3ms | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:397` |
| 0.9% | 82.0ms | 0.4% | 42.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.8% | 77.4ms | 0.0% | 867us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:588` |
| 0.7% | 68.9ms | 0.0% | 2.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.7% | 68.5ms | 0.0% | 5.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:589` |
| 0.7% | 65.7ms | 0.7% | 65.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.6% | 63.2ms | 0.2% | 23.1ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.6% | 62.6ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:648` |
| 0.6% | 61.9ms | 0.0% | 1.3ms | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.6% | 61.9ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 0.6% | 60.6ms | 0.0% | 0us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.6% | 59.7ms | 0.0% | 0us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:649` |
| 0.6% | 56.5ms | 0.6% | 56.5ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 0.5% | 47.8ms | 0.4% | 40.2ms | `sort` | `[native code]` |
| 0.5% | 47.2ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` |
| 0.5% | 46.0ms | 0.0% | 844us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:631` |
| 0.5% | 45.9ms | 0.0% | 715us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 0.4% | 40.0ms | 0.4% | 40.0ms | `Float64Array` | `[native code]` |
| 0.4% | 39.3ms | 0.0% | 2.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.4% | 38.5ms | 0.0% | 0us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.4% | 38.2ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:729` |
| 0.4% | 37.9ms | 0.4% | 37.9ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.4% | 36.8ms | 0.4% | 36.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.2% | 24.4ms | 0.2% | 23.5ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` |
| 0.2% | 24.1ms | 0.0% | 4.4ms | `anonymous` | `[native code]` |
| 0.2% | 23.9ms | 0.2% | 23.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` |
| 0.2% | 23.1ms | 0.2% | 23.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` |
| 0.2% | 22.6ms | 0.2% | 22.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.2% | 20.7ms | 0.1% | 17.5ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 0.2% | 19.6ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 0.2% | 19.4ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:574` |
| 0.1% | 17.5ms | 0.0% | 1.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:702` |
| 0.1% | 17.4ms | 0.1% | 17.4ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.1% | 17.1ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 0.1% | 16.1ms | 0.0% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` |
| 0.1% | 15.1ms | 0.1% | 15.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` |
| 0.1% | 13.4ms | 0.1% | 13.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:625` |
| 0.1% | 13.0ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:721` |
| 0.1% | 10.3ms | 0.0% | 4.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.0% | 9.0ms | 0.0% | 9.0ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 8.1ms | 0.0% | 5.8ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:558` |
| 0.0% | 7.7ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` |
| 0.0% | 7.6ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:720` |
| 0.0% | 7.4ms | 0.0% | 715us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.0% | 7.3ms | 0.0% | 7.3ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:328` |
| 0.0% | 7.2ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 7.1ms | 0.0% | 7.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:735` |
| 0.0% | 7.1ms | 0.0% | 7.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |
| 0.0% | 6.7ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.0% | 6.6ms | 0.0% | 6.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 6.3ms | 0.0% | 6.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` |
| 0.0% | 4.7ms | 0.0% | 4.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:730` |
| 0.0% | 4.1ms | 0.0% | 4.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:651` |
| 0.0% | 3.9ms | 0.0% | 3.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` |
| 0.0% | 3.8ms | 0.0% | 760us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` |
| 0.0% | 3.8ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` |
| 0.0% | 3.7ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:615` |
| 0.0% | 3.6ms | 0.0% | 3.6ms | `abs` | `[native code]` |
| 0.0% | 3.5ms | 0.0% | 669us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.0% | 3.2ms | 0.0% | 3.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.2ms | 0.0% | 2.3ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` |
| 0.0% | 3.0ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:591` |
| 0.0% | 2.9ms | 0.0% | 2.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:734` |
| 0.0% | 2.9ms | 0.0% | 2.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:555` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `push` | `[native code]` |
| 0.0% | 2.2ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 2.2ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 2.2ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 2.2ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 2.2ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:550` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:731` |
| 0.0% | 1.5ms | 0.0% | 709us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:478` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:581` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:21` |
| 0.0% | 1.4ms | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 1.4ms | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.4ms | 0.0% | 656us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:741` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:740` |
| 0.0% | 1.3ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:694` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `isFinite` | `[native code]` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` |
| 0.0% | 942us | 0.0% | 942us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` |
| 0.0% | 929us | 0.0% | 929us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:619` |
| 0.0% | 903us | 0.0% | 903us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` |
| 0.0% | 891us | 0.0% | 891us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 881us | 0.0% | 881us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:465` |
| 0.0% | 875us | 0.0% | 875us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:152` |
| 0.0% | 862us | 0.0% | 862us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 0.0% | 858us | 0.0% | 858us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 0.0% | 854us | 0.0% | 854us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:719` |
| 0.0% | 848us | 0.0% | 0us | `createIdentityMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:31` |
| 0.0% | 821us | 0.0% | 821us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:667` |
| 0.0% | 816us | 0.0% | 816us | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 816us | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:331` |
| 0.0% | 801us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 801us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 801us | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 801us | 0.0% | 801us | `internal:primordials` | `internal:primordials:2` |
| 0.0% | 795us | 0.0% | 795us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:584` |
| 0.0% | 785us | 0.0% | 785us | `max` | `[native code]` |
| 0.0% | 777us | 0.0% | 777us | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:290` |
| 0.0% | 774us | 0.0% | 0us | `internal:fs/binding` | `internal:fs/binding:3` |
| 0.0% | 774us | 0.0% | 774us | `@lazy` | `[native code]` |
| 0.0% | 760us | 0.0% | 760us | `slice` | `[native code]` |
| 0.0% | 760us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:492` |
| 0.0% | 750us | 0.0% | 750us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:334` |
| 0.0% | 739us | 0.0% | 739us | `WriteStream` | `internal:fs/streams` |
| 0.0% | 732us | 0.0% | 732us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:252` |
| 0.0% | 687us | 0.0% | 687us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.0% | 668us | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 656us | 0.0% | 656us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:457` |
| 0.0% | 645us | 0.0% | 645us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 636us | 0.0% | 636us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:579` |
| 0.0% | 588us | 0.0% | 588us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:706` |

## Function Details

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` | Self: 41.4% (3.76s) | Total: 42.9% (3.89s) | Samples: 4903

**Called by:**
- `step` (5073)

**Calls:**
- `hypot` (170)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` | Self: 20.0% (1.81s) | Total: 20.0% (1.81s) | Samples: 2352

**Called by:**
- `runTrial` (2342)
- `runTrial` (10)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` | Self: 4.5% (415.1ms) | Total: 4.7% (427.8ms) | Samples: 542

**Called by:**
- `step` (559)

**Calls:**
- `createZeroVector` (12)
- `fill` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` | Self: 3.7% (340.5ms) | Total: 4.2% (387.7ms) | Samples: 441

**Called by:**
- `runTrial` (497)
- `runTrial` (3)

**Calls:**
- `createZeroMatrix` (46)
- `from` (12)
- `createZeroMatrix` (1)

### `mahalanobisSquaredWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:286` | Self: 3.2% (294.1ms) | Total: 3.3% (300.9ms) | Samples: 373

**Called by:**
- `step` (382)

**Calls:**
- `createZeroVector` (8)
- `fill` (1)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` | Self: 2.9% (269.8ms) | Total: 3.4% (313.8ms) | Samples: 351

**Called by:**
- `step` (407)

**Calls:**
- `from` (56)

### `map`
`[native code]` | Self: 2.1% (196.0ms) | Total: 4.6% (421.9ms) | Samples: 243

**Called by:**
- `cloneMatrix` (122)
- `step` (94)
- `step` (87)
- `step` (79)
- `(anonymous)` (75)
- `(anonymous)` (22)
- `step` (10)
- `step` (10)
- `step` (9)
- `jacobiEigenSymmetric` (9)
- `jacobiEigenSymmetric` (7)
- `jacobiEigenSymmetric` (4)
- `alignProjectionBasis` (2)
- `map` (1)
- `alignProjectionBasis` (1)

**Calls:**
- `(anonymous)` (120)
- `(anonymous)` (86)
- `(anonymous)` (75)
- `abs` (5)
- `(anonymous)` (1)
- `map` (1)
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:686` | Self: 2.1% (194.2ms) | Total: 2.1% (194.2ms) | Samples: 250

**Called by:**
- `runTrial` (249)
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` | Self: 1.6% (151.6ms) | Total: 1.6% (151.6ms) | Samples: 196

**Called by:**
- `runTrial` (195)
- `runTrial` (1)

### `fill`
`[native code]` | Self: 1.6% (145.5ms) | Total: 1.6% (145.5ms) | Samples: 186

**Called by:**
- `sampleGaussianVectorND` (87)
- `ellipsoidObjective` (52)
- `from` (36)
- `transformFromEigenCoordinates` (5)
- `whitenWithEigensystem` (3)
- `mahalanobisSquaredWithEigensystem` (1)
- `whitenWithEigensystem` (1)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:683` | Self: 1.5% (140.5ms) | Total: 1.5% (140.5ms) | Samples: 185

**Called by:**
- `runTrial` (185)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.4% (131.9ms) | Total: 2.2% (201.1ms) | Samples: 173

**Called by:**
- `step` (260)

**Calls:**
- `fill` (87)

### `hypot`
`[native code]` | Self: 1.4% (130.4ms) | Total: 1.4% (130.4ms) | Samples: 170

**Called by:**
- `jacobiEigenSymmetric` (170)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.2% (113.2ms) | Total: 1.2% (113.2ms) | Samples: 144

**Called by:**
- `map` (120)
- `some` (23)
- `forEach` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` | Self: 0.9% (82.6ms) | Total: 1.1% (105.5ms) | Samples: 108

**Called by:**
- `step` (138)

**Calls:**
- `Float64Array` (30)

### `requireFiniteVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:397` | Self: 0.9% (82.3ms) | Total: 0.9% (82.3ms) | Samples: 102

**Called by:**
- `projectTo3D` (102)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 0.7% (65.7ms) | Total: 0.7% (65.7ms) | Samples: 86

**Called by:**
- `map` (86)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` | Self: 0.6% (56.5ms) | Total: 0.6% (56.5ms) | Samples: 75

**Called by:**
- `step` (75)

### `from`
`[native code]` | Self: 0.5% (49.0ms) | Total: 1.5% (136.7ms) | Samples: 63

**Called by:**
- `reconstructSymmetric` (56)
- `jacobiEigenSymmetric` (52)
- `createZeroMatrix` (47)
- `step` (12)
- `jacobiEigenSymmetric` (7)

**Calls:**
- `(anonymous)` (45)
- `fill` (36)
- `(anonymous)` (30)

### `some`
`[native code]` | Self: 0.4% (43.7ms) | Total: 1.3% (122.0ms) | Samples: 57

**Called by:**
- `validateSquareFiniteMatrix` (79)
- `(anonymous)` (79)
- `projectTo3D` (1)

**Calls:**
- `(anonymous)` (79)
- `(anonymous)` (23)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.4% (42.4ms) | Total: 0.9% (82.0ms) | Samples: 54

**Called by:**
- `step` (106)

**Calls:**
- `from` (52)

### `sort`
`[native code]` | Self: 0.4% (40.2ms) | Total: 0.5% (47.8ms) | Samples: 51

**Called by:**
- `jacobiEigenSymmetric` (40)
- `step` (21)

**Calls:**
- `(anonymous)` (9)
- `(anonymous)` (1)

### `Float64Array`
`[native code]` | Self: 0.4% (40.0ms) | Total: 0.4% (40.0ms) | Samples: 52

**Called by:**
- `jacobiEigenSymmetric` (30)
- `jacobiEigenSymmetric` (22)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.4% (37.9ms) | Total: 0.4% (37.9ms) | Samples: 49

**Called by:**
- `(anonymous)` (24)
- `step` (15)
- `step` (10)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.4% (36.8ms) | Total: 0.4% (36.8ms) | Samples: 45

**Called by:**
- `from` (45)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` | Self: 0.3% (29.3ms) | Total: 1.6% (153.4ms) | Samples: 38

**Called by:**
- `forEach` (194)

**Calls:**
- `projectTo3D` (116)
- `projectTo3D` (24)
- `projectTo3D` (9)
- `projectTo3D` (4)
- `projectTo3D` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` | Self: 0.2% (23.9ms) | Total: 0.2% (23.9ms) | Samples: 31

**Called by:**
- `runTrial` (30)
- `runTrial` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` | Self: 0.2% (23.5ms) | Total: 0.2% (24.4ms) | Samples: 32

**Called by:**
- `step` (33)

**Calls:**
- `fill` (1)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` | Self: 0.2% (23.1ms) | Total: 0.6% (63.2ms) | Samples: 31

**Called by:**
- `step` (83)

**Calls:**
- `fill` (52)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` | Self: 0.2% (23.1ms) | Total: 0.2% (23.1ms) | Samples: 30

**Called by:**
- `runTrial` (30)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.2% (22.6ms) | Total: 0.2% (22.6ms) | Samples: 30

**Called by:**
- `from` (30)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` | Self: 0.1% (17.5ms) | Total: 0.2% (20.7ms) | Samples: 23

**Called by:**
- `step` (27)

**Calls:**
- `fill` (3)
- `createZeroVector` (1)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` | Self: 0.1% (17.4ms) | Total: 0.1% (17.4ms) | Samples: 23

**Called by:**
- `transformFromEigenCoordinates` (12)
- `mahalanobisSquaredWithEigensystem` (8)
- `step` (2)
- `whitenWithEigensystem` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` | Self: 0.1% (15.1ms) | Total: 0.1% (15.1ms) | Samples: 21

**Called by:**
- `runTrial` (21)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:625` | Self: 0.1% (13.4ms) | Total: 0.1% (13.4ms) | Samples: 17

**Called by:**
- `runTrial` (17)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:548` | Self: 0.1% (10.9ms) | Total: 1.0% (93.3ms) | Samples: 14

**Called by:**
- `(anonymous)` (116)

**Calls:**
- `requireFiniteVector` (102)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (9.0ms) | Total: 0.0% (9.0ms) | Samples: 12

**Called by:**
- `step` (12)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:328` | Self: 0.0% (7.3ms) | Total: 0.0% (7.3ms) | Samples: 10

**Called by:**
- `step` (10)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:735` | Self: 0.0% (7.1ms) | Total: 0.0% (7.1ms) | Samples: 9

**Called by:**
- `runTrial` (9)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` | Self: 0.0% (7.1ms) | Total: 0.0% (7.1ms) | Samples: 9

**Called by:**
- `runTrial` (9)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` | Self: 0.0% (6.6ms) | Total: 0.0% (6.6ms) | Samples: 9

**Called by:**
- `sort` (9)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` | Self: 0.0% (6.3ms) | Total: 0.0% (6.3ms) | Samples: 9

**Called by:**
- `runTrial` (9)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:558` | Self: 0.0% (5.8ms) | Total: 0.0% (8.1ms) | Samples: 8

**Called by:**
- `(anonymous)` (9)
- `step` (2)

**Calls:**
- `coordinate` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:585` | Self: 0.0% (5.7ms) | Total: 2.3% (217.3ms) | Samples: 7

**Called by:**
- `runTrial` (277)
- `runTrial` (4)

**Calls:**
- `sampleGaussianVectorND` (260)
- `sampleGaussianVectorND` (10)
- `push` (2)
- `sampleGaussianVectorND` (1)
- `sampleGaussianVectorND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:589` | Self: 0.0% (5.2ms) | Total: 0.7% (68.5ms) | Samples: 7

**Called by:**
- `runTrial` (90)

**Calls:**
- `ellipsoidObjective` (83)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:730` | Self: 0.0% (4.7ms) | Total: 0.0% (4.7ms) | Samples: 6

**Called by:**
- `runTrial` (6)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.0% (4.6ms) | Total: 0.1% (10.3ms) | Samples: 6

**Called by:**
- `step` (14)

**Calls:**
- `map` (7)
- `max` (1)

### `anonymous`
`[native code]` | Self: 0.0% (4.4ms) | Total: 0.2% (24.1ms) | Samples: 6

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
- `node:events` (1)
- `internal:validators` (1)
- `internal:shared` (1)
- `internal:streams/duplex` (1)

**Calls:**
- `node:fs` (4)
- `internal:fs/streams` (3)
- `internal:stream` (3)
- `node:fs/promises` (3)
- `node:stream` (3)
- `internal:streams/pipeline` (2)
- `internal:streams/compose` (2)
- `node:events` (1)
- `internal:validators` (1)
- `internal:shared` (1)
- `internal:primordials` (1)
- `internal:streams/duplex` (1)
- `internal:fs/binding` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:651` | Self: 0.0% (4.1ms) | Total: 0.0% (4.1ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` | Self: 0.0% (3.9ms) | Total: 3.3% (305.6ms) | Samples: 5

**Called by:**
- `runTrial` (388)

**Calls:**
- `mahalanobisSquaredWithEigensystem` (382)
- `mahalanobisSquaredWithEigensystem` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` | Self: 0.0% (3.9ms) | Total: 0.0% (3.9ms) | Samples: 6

**Called by:**
- `runTrial` (6)

### `abs`
`[native code]` | Self: 0.0% (3.6ms) | Total: 0.0% (3.6ms) | Samples: 5

**Called by:**
- `map` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (3.2ms) | Total: 0.0% (3.2ms) | Samples: 2

**Called by:**
- `runTrial` (1)
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` | Self: 0.0% (3.1ms) | Total: 0.0% (3.1ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` | Self: 0.0% (3.1ms) | Total: 0.2% (19.6ms) | Samples: 4

**Called by:**
- `runTrial` (25)

**Calls:**
- `sort` (21)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:591` | Self: 0.0% (3.0ms) | Total: 0.0% (3.0ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:734` | Self: 0.0% (2.9ms) | Total: 0.0% (2.9ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` | Self: 0.0% (2.9ms) | Total: 0.0% (2.9ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` | Self: 0.0% (2.9ms) | Total: 0.7% (68.9ms) | Samples: 4

**Called by:**
- `runTrial` (90)
- `runTrial` (1)

**Calls:**
- `map` (87)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` | Self: 0.0% (2.3ms) | Total: 0.0% (3.2ms) | Samples: 3

**Called by:**
- `(anonymous)` (4)

**Calls:**
- `some` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` | Self: 0.0% (2.3ms) | Total: 0.4% (39.3ms) | Samples: 3

**Called by:**
- `step` (50)

**Calls:**
- `sort` (40)
- `from` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:555` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 3

**Called by:**
- `projectTo3D` (3)

### `push`
`[native code]` | Self: 0.0% (2.2ms) | Total: 0.0% (2.2ms) | Samples: 3

**Called by:**
- `step` (2)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` | Self: 0.0% (2.2ms) | Total: 4.8% (439.8ms) | Samples: 3

**Called by:**
- `runTrial` (572)
- `runTrial` (3)

**Calls:**
- `transformFromEigenCoordinates` (559)
- `transformFromEigenCoordinates` (12)
- `transformFromEigenCoordinates` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` | Self: 0.0% (2.2ms) | Total: 0.0% (2.2ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` | Self: 0.0% (2.2ms) | Total: 0.0% (2.2ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` | Self: 0.0% (2.1ms) | Total: 0.1% (16.1ms) | Samples: 3

**Called by:**
- `runTrial` (13)

**Calls:**
- `map` (10)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:550` | Self: 0.0% (2.1ms) | Total: 0.0% (2.1ms) | Samples: 3

**Called by:**
- `(anonymous)` (3)

### `forEach`
`[native code]` | Self: 0.0% (2.1ms) | Total: 1.9% (173.2ms) | Samples: 3

**Called by:**
- `step` (217)
- `step` (4)

**Calls:**
- `(anonymous)` (194)
- `(anonymous)` (23)
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:731` | Self: 0.0% (1.7ms) | Total: 0.0% (1.7ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:581` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:21` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `step` (2)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:690` | Self: 0.0% (1.4ms) | Total: 3.4% (315.3ms) | Samples: 2

**Called by:**
- `runTrial` (407)
- `runTrial` (2)

**Calls:**
- `reconstructSymmetric` (407)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:740` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `isFinite`
`[native code]` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 1

**Called by:**
- `step` (1)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (1.3ms) | Total: 0.6% (61.9ms) | Samples: 2

**Called by:**
- `jacobiEigenSymmetric` (81)

**Calls:**
- `some` (79)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `step` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:702` | Self: 0.0% (1.2ms) | Total: 0.1% (17.5ms) | Samples: 2

**Called by:**
- `forEach` (23)
- `map` (1)

**Calls:**
- `map` (22)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` | Self: 0.0% (942us) | Total: 0.0% (942us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:619` | Self: 0.0% (929us) | Total: 0.0% (929us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` | Self: 0.0% (903us) | Total: 0.0% (903us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` | Self: 0.0% (891us) | Total: 0.0% (891us) | Samples: 1

**Called by:**
- `step` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:465` | Self: 0.0% (881us) | Total: 0.0% (881us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:152` | Self: 0.0% (875us) | Total: 0.0% (875us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:588` | Self: 0.0% (867us) | Total: 0.8% (77.4ms) | Samples: 1

**Called by:**
- `runTrial` (95)

**Calls:**
- `map` (94)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` | Self: 0.0% (862us) | Total: 0.0% (862us) | Samples: 1

**Called by:**
- `sort` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` | Self: 0.0% (858us) | Total: 0.0% (858us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:719` | Self: 0.0% (854us) | Total: 0.0% (854us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:631` | Self: 0.0% (844us) | Total: 0.5% (46.0ms) | Samples: 1

**Called by:**
- `runTrial` (60)
- `runTrial` (1)

**Calls:**
- `whitenWithEigensystem` (33)
- `whitenWithEigensystem` (27)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:667` | Self: 0.0% (821us) | Total: 0.0% (821us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `nextHalfOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (816us) | Total: 0.0% (816us) | Samples: 1

**Called by:**
- `sampleGaussianVectorND` (1)

### `internal:primordials`
`internal:primordials:2` | Self: 0.0% (801us) | Total: 0.0% (801us) | Samples: 1

**Called by:**
- `anonymous` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:584` | Self: 0.0% (795us) | Total: 0.0% (795us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `max`
`[native code]` | Self: 0.0% (785us) | Total: 0.0% (785us) | Samples: 1

**Called by:**
- `jacobiEigenSymmetric` (1)

### `mahalanobisSquaredWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:290` | Self: 0.0% (777us) | Total: 0.0% (777us) | Samples: 1

**Called by:**
- `step` (1)

### `@lazy`
`[native code]` | Self: 0.0% (774us) | Total: 0.0% (774us) | Samples: 1

**Called by:**
- `internal:fs/binding` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` | Self: 0.0% (760us) | Total: 0.0% (3.8ms) | Samples: 1

**Called by:**
- `step` (5)

**Calls:**
- `map` (4)

### `slice`
`[native code]` | Self: 0.0% (760us) | Total: 0.0% (760us) | Samples: 1

**Called by:**
- `CMAESOptimizerND` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:334` | Self: 0.0% (750us) | Total: 0.0% (750us) | Samples: 1

**Called by:**
- `step` (1)

### `WriteStream`
`internal:fs/streams` | Self: 0.0% (739us) | Total: 0.0% (739us) | Samples: 1

**Called by:**
- `(anonymous)` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:252` | Self: 0.0% (732us) | Total: 0.0% (732us) | Samples: 1

**Called by:**
- `step` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` | Self: 0.0% (715us) | Total: 0.0% (7.4ms) | Samples: 1

**Calls:**
- `(anonymous)` (9)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` | Self: 0.0% (715us) | Total: 0.5% (45.9ms) | Samples: 1

**Called by:**
- `step` (60)

**Calls:**
- `cloneMatrix` (58)
- `map` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:478` | Self: 0.0% (709us) | Total: 0.0% (1.5ms) | Samples: 1

**Called by:**
- `runTrial` (2)

**Calls:**
- `createIdentityMatrix` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` | Self: 0.0% (687us) | Total: 0.0% (687us) | Samples: 1

**Called by:**
- `map` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` | Self: 0.0% (669us) | Total: 0.0% (3.5ms) | Samples: 1

**Called by:**
- `runTrial` (5)

**Calls:**
- `forEach` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:741` | Self: 0.0% (656us) | Total: 0.0% (1.4ms) | Samples: 1

**Called by:**
- `runTrial` (2)

**Calls:**
- `push` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:457` | Self: 0.0% (656us) | Total: 0.0% (656us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (645us) | Total: 0.0% (645us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:579` | Self: 0.0% (636us) | Total: 0.0% (636us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:706` | Self: 0.0% (588us) | Total: 0.0% (588us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (2.2ms) | Samples: 0

**Called by:**
- `(anonymous)` (3)

**Calls:**
- `anonymous` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:720` | Self: 0.0% (0us) | Total: 0.0% (7.6ms) | Samples: 0

**Called by:**
- `runTrial` (10)

**Calls:**
- `projectTo3D` (10)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` | Self: 0.0% (0us) | Total: 99.3% (9.02s) | Samples: 0

**Called by:**
- `(module)` (10925)
- `(module)` (774)

**Calls:**
- `step` (5474)
- `step` (2342)
- `step` (572)
- `step` (497)
- `step` (407)
- `step` (388)
- `step` (277)
- `step` (249)
- `step` (215)
- `step` (195)
- `step` (185)
- `step` (161)
- `step` (95)
- `step` (90)
- `step` (90)
- `step` (79)
- `step` (60)
- `step` (50)
- `step` (30)
- `step` (30)
- `step` (25)
- `step` (21)
- `step` (17)
- `step` (17)
- `step` (13)
- `step` (10)
- `step` (10)
- `step` (9)
- `step` (9)
- `step` (9)
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

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (668us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:331` | Self: 0.0% (0us) | Total: 0.0% (816us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `nextHalfOpenUnit` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (0us) | Total: 0.6% (60.6ms) | Samples: 0

**Called by:**
- `some` (79)

**Calls:**
- `some` (79)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (801us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (801us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` | Self: 0.0% (0us) | Total: 0.1% (17.1ms) | Samples: 0

**Called by:**
- `step` (22)

**Calls:**
- `Float64Array` (22)

### `internal:fs/binding`
`internal:fs/binding:3` | Self: 0.0% (0us) | Total: 0.0% (774us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `@lazy` (1)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:615` | Self: 0.0% (0us) | Total: 0.0% (3.7ms) | Samples: 0

**Called by:**
- `runTrial` (5)

**Calls:**
- `createZeroVector` (2)
- `createZeroVector` (2)
- `fill` (1)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (6.7ms) | Samples: 0

**Called by:**
- `(module)` (9)

**Calls:**
- `anonymous` (5)
- `get WriteStream` (3)
- `WriteStream` (1)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (801us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:701` | Self: 0.0% (0us) | Total: 1.8% (170.3ms) | Samples: 0

**Called by:**
- `runTrial` (215)
- `runTrial` (2)

**Calls:**
- `forEach` (217)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.0% (0us) | Total: 0.4% (38.5ms) | Samples: 0

**Called by:**
- `step` (46)
- `createIdentityMatrix` (1)

**Calls:**
- `from` (47)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:729` | Self: 0.0% (0us) | Total: 0.4% (38.2ms) | Samples: 0

**Called by:**
- `runTrial` (50)

**Calls:**
- `cloneMatrix` (41)
- `map` (9)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:699` | Self: 0.0% (0us) | Total: 1.3% (123.4ms) | Samples: 0

**Called by:**
- `runTrial` (161)
- `runTrial` (1)

**Calls:**
- `alignProjectionBasis` (75)
- `alignProjectionBasis` (60)
- `alignProjectionBasis` (25)
- `alignProjectionBasis` (2)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (2.2ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (2.2ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:649` | Self: 0.0% (0us) | Total: 0.6% (59.7ms) | Samples: 0

**Called by:**
- `map` (75)

**Calls:**
- `map` (75)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` | Self: 0.0% (0us) | Total: 0.0% (7.2ms) | Samples: 0

**Called by:**
- `step` (9)

**Calls:**
- `map` (9)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:694` | Self: 0.0% (0us) | Total: 0.0% (1.3ms) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `isFinite` (1)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 0.0% (0us) | Total: 1.0% (93.5ms) | Samples: 0

**Called by:**
- `alignProjectionBasis` (58)
- `step` (41)
- `alignProjectionBasis` (23)

**Calls:**
- `map` (122)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` | Self: 0.0% (0us) | Total: 0.6% (61.9ms) | Samples: 0

**Called by:**
- `step` (81)

**Calls:**
- `validateSquareFiniteMatrix` (81)

### `createIdentityMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:31` | Self: 0.0% (0us) | Total: 0.0% (848us) | Samples: 0

**Called by:**
- `CMAESOptimizerND` (1)

**Calls:**
- `createZeroMatrix` (1)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (2.2ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` | Self: 0.0% (0us) | Total: 0.0% (3.8ms) | Samples: 0

**Called by:**
- `(module)` (5)

**Calls:**
- `CMAESOptimizerND` (2)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` | Self: 0.0% (0us) | Total: 6.6% (605.6ms) | Samples: 0

**Calls:**
- `runTrial` (774)
- `runTrial` (8)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` | Self: 0.0% (0us) | Total: 93.2% (8.47s) | Samples: 0

**Calls:**
- `runTrial` (10925)
- `runTrial` (51)
- `runTrial` (5)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:574` | Self: 0.0% (0us) | Total: 0.2% (19.4ms) | Samples: 0

**Called by:**
- `step` (25)

**Calls:**
- `cloneMatrix` (23)
- `map` (2)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (3.0ms) | Samples: 0

**Called by:**
- `anonymous` (4)

**Calls:**
- `anonymous` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:721` | Self: 0.0% (0us) | Total: 0.1% (13.0ms) | Samples: 0

**Called by:**
- `runTrial` (17)

**Calls:**
- `projectTo3D` (15)
- `projectTo3D` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:648` | Self: 0.0% (0us) | Total: 0.6% (62.6ms) | Samples: 0

**Called by:**
- `runTrial` (79)

**Calls:**
- `map` (79)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` | Self: 0.0% (0us) | Total: 0.0% (7.7ms) | Samples: 0

**Called by:**
- `runTrial` (10)

**Calls:**
- `map` (10)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` | Self: 0.0% (0us) | Total: 0.5% (47.2ms) | Samples: 0

**Called by:**
- `(module)` (51)
- `(module)` (8)

**Calls:**
- `step` (28)
- `step` (10)
- `step` (4)
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

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (2.2ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:492` | Self: 0.0% (0us) | Total: 0.0% (760us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `slice` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:689` | Self: 0.0% (0us) | Total: 46.5% (4.22s) | Samples: 0

**Called by:**
- `runTrial` (5474)
- `runTrial` (28)

**Calls:**
- `jacobiEigenSymmetric` (5073)
- `jacobiEigenSymmetric` (138)
- `jacobiEigenSymmetric` (106)
- `jacobiEigenSymmetric` (81)
- `jacobiEigenSymmetric` (50)
- `jacobiEigenSymmetric` (22)
- `jacobiEigenSymmetric` (14)
- `jacobiEigenSymmetric` (9)
- `jacobiEigenSymmetric` (5)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 92.4% | 8.39s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 7.2% | 661.4ms | `[native code]` |
| 0.2% | 23.9ms | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.0% | 801us | `internal:primordials` |
| 0.0% | 739us | `internal:fs/streams` |
