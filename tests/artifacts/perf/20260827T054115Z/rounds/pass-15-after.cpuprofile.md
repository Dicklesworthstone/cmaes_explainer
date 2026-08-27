# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 9.15s | 11858 | 500us | 159 |

**Top 10:** `jacobiEigenSymmetric` 41.5%, `step` 20.0%, `transformFromEigenCoordinates` 4.7%, `step` 3.9%, `reconstructSymmetric` 3.9%, `mahalanobisSquaredWithEigensystem` 3.5%, `step` 2.1%, `map` 2.0%, `step` 1.7%, `hypot` 1.6%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 41.5% | 3.80s | 43.2% | 3.95s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 20.0% | 1.83s | 20.0% | 1.83s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` |
| 4.7% | 438.7ms | 4.9% | 449.6ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 3.9% | 359.9ms | 4.3% | 401.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 3.9% | 357.5ms | 4.3% | 401.1ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` |
| 3.5% | 327.4ms | 3.6% | 335.7ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:286` |
| 2.1% | 194.7ms | 2.1% | 194.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` |
| 2.0% | 191.6ms | 4.0% | 371.4ms | `map` | `[native code]` |
| 1.7% | 161.0ms | 1.7% | 161.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:686` |
| 1.6% | 153.3ms | 1.6% | 153.3ms | `hypot` | `[native code]` |
| 1.4% | 133.5ms | 1.4% | 133.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:683` |
| 1.4% | 133.4ms | 1.4% | 133.4ms | `fill` | `[native code]` |
| 1.4% | 131.2ms | 2.2% | 201.8ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.0% | 98.5ms | 1.0% | 98.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.0% | 92.6ms | 1.0% | 92.6ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.6% | 60.3ms | 0.9% | 83.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.5% | 50.4ms | 0.5% | 50.4ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 0.5% | 48.0ms | 1.1% | 109.0ms | `from` | `[native code]` |
| 0.5% | 46.6ms | 0.5% | 46.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.4% | 44.3ms | 0.7% | 66.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.4% | 42.1ms | 0.5% | 50.1ms | `sort` | `[native code]` |
| 0.4% | 37.7ms | 1.0% | 99.3ms | `some` | `[native code]` |
| 0.3% | 35.2ms | 0.3% | 35.2ms | `Float64Array` | `[native code]` |
| 0.3% | 28.3ms | 1.3% | 125.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` |
| 0.2% | 24.7ms | 0.2% | 24.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.2% | 23.0ms | 0.5% | 53.9ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.2% | 21.4ms | 0.2% | 22.2ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 0.2% | 20.1ms | 0.2% | 21.6ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` |
| 0.1% | 16.7ms | 0.1% | 17.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` |
| 0.1% | 16.3ms | 0.1% | 16.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` |
| 0.1% | 13.9ms | 0.1% | 13.9ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.1% | 13.0ms | 0.1% | 13.8ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:548` |
| 0.1% | 12.6ms | 0.1% | 12.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:625` |
| 0.1% | 12.5ms | 0.1% | 12.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.1% | 12.3ms | 0.1% | 12.3ms | `push` | `[native code]` |
| 0.1% | 11.9ms | 0.1% | 11.9ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:328` |
| 0.0% | 7.4ms | 0.0% | 8.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` |
| 0.0% | 7.2ms | 0.0% | 7.2ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 5.7ms | 0.0% | 5.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |
| 0.0% | 5.4ms | 0.6% | 59.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:589` |
| 0.0% | 4.9ms | 0.0% | 5.6ms | `reduce` | `[native code]` |
| 0.0% | 4.7ms | 0.0% | 4.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 4.5ms | 0.1% | 13.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.0% | 4.5ms | 0.8% | 75.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.0% | 4.0ms | 0.0% | 4.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:734` |
| 0.0% | 3.9ms | 1.5% | 143.4ms | `forEach` | `[native code]` |
| 0.0% | 3.5ms | 0.1% | 16.6ms | `anonymous` | `[native code]` |
| 0.0% | 3.2ms | 0.0% | 3.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 0.0% | 3.1ms | 3.7% | 342.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:730` |
| 0.0% | 3.0ms | 2.5% | 237.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:585` |
| 0.0% | 2.9ms | 0.0% | 3.6ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:558` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` |
| 0.0% | 2.5ms | 0.0% | 2.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` |
| 0.0% | 2.3ms | 0.0% | 3.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:651` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:735` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:290` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:550` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:731` |
| 0.0% | 1.6ms | 5.0% | 460.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.5ms | 0.6% | 56.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:649` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:237` |
| 0.0% | 1.5ms | 0.3% | 33.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `max` | `[native code]` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `min` | `[native code]` |
| 0.0% | 1.2ms | 4.4% | 404.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:690` |
| 0.0% | 922us | 0.0% | 922us | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:297` |
| 0.0% | 911us | 0.0% | 911us | `sqrt` | `[native code]` |
| 0.0% | 892us | 0.1% | 13.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:702` |
| 0.0% | 891us | 0.0% | 891us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` |
| 0.0% | 886us | 0.0% | 886us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 886us | 0.0% | 886us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` |
| 0.0% | 880us | 0.0% | 880us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` |
| 0.0% | 879us | 0.0% | 879us | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:21` |
| 0.0% | 850us | 0.0% | 1.6ms | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:447` |
| 0.0% | 849us | 0.4% | 45.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:631` |
| 0.0% | 848us | 0.0% | 848us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:619` |
| 0.0% | 847us | 0.0% | 847us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 836us | 0.0% | 5.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:706` |
| 0.0% | 829us | 0.0% | 829us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:591` |
| 0.0% | 826us | 0.4% | 39.9ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 0.0% | 823us | 0.3% | 30.7ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.0% | 812us | 0.0% | 812us | `WriteStream` | `internal:fs/streams:251` |
| 0.0% | 811us | 0.0% | 811us | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:397` |
| 0.0% | 796us | 0.0% | 796us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:193` |
| 0.0% | 795us | 0.3% | 29.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:729` |
| 0.0% | 763us | 0.0% | 763us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:485` |
| 0.0% | 753us | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:615` |
| 0.0% | 749us | 0.0% | 749us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:253` |
| 0.0% | 744us | 0.0% | 2.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` |
| 0.0% | 743us | 0.0% | 743us | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:555` |
| 0.0% | 737us | 0.0% | 737us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` |
| 0.0% | 731us | 0.0% | 731us | `defineProperty` | `[native code]` |
| 0.0% | 729us | 0.5% | 48.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.0% | 728us | 0.0% | 728us | `slice` | `[native code]` |
| 0.0% | 723us | 0.0% | 723us | `abs` | `[native code]` |
| 0.0% | 714us | 0.0% | 3.7ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` |
| 0.0% | 709us | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:719` |
| 0.0% | 705us | 0.0% | 705us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:449` |
| 0.0% | 694us | 0.0% | 694us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:706` |
| 0.0% | 691us | 0.0% | 691us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` |
| 0.0% | 686us | 0.8% | 78.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:588` |
| 0.0% | 669us | 0.0% | 669us | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 667us | 0.0% | 667us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` |
| 0.0% | 653us | 0.0% | 653us | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 646us | 0.0% | 646us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:252` |
| 0.0% | 632us | 0.0% | 632us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 625us | 0.0% | 625us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.0% | 618us | 0.0% | 5.7ms | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.0% | 617us | 0.0% | 617us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` |
| 0.0% | 492us | 0.0% | 492us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:330` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 99.5% | 9.10s | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 93.3% | 8.53s | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` |
| 46.1% | 4.22s | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:689` |
| 43.2% | 3.95s | 41.5% | 3.80s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 20.0% | 1.83s | 20.0% | 1.83s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` |
| 6.6% | 604.2ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` |
| 5.0% | 460.6ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` |
| 4.9% | 449.6ms | 4.7% | 438.7ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 4.4% | 404.0ms | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:690` |
| 4.3% | 401.9ms | 3.9% | 359.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 4.3% | 401.1ms | 3.9% | 357.5ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` |
| 4.0% | 371.4ms | 2.0% | 191.6ms | `map` | `[native code]` |
| 3.7% | 342.0ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` |
| 3.6% | 335.7ms | 3.5% | 327.4ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:286` |
| 2.5% | 237.6ms | 0.0% | 3.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:585` |
| 2.2% | 201.8ms | 1.4% | 131.2ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 2.1% | 194.7ms | 2.1% | 194.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` |
| 1.7% | 161.0ms | 1.7% | 161.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:686` |
| 1.6% | 153.3ms | 1.6% | 153.3ms | `hypot` | `[native code]` |
| 1.5% | 143.4ms | 0.0% | 3.9ms | `forEach` | `[native code]` |
| 1.5% | 139.5ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:701` |
| 1.4% | 133.5ms | 1.4% | 133.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:683` |
| 1.4% | 133.4ms | 1.4% | 133.4ms | `fill` | `[native code]` |
| 1.3% | 125.6ms | 0.3% | 28.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` |
| 1.1% | 109.0ms | 0.5% | 48.0ms | `from` | `[native code]` |
| 1.0% | 99.3ms | 0.4% | 37.7ms | `some` | `[native code]` |
| 1.0% | 98.5ms | 1.0% | 98.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.0% | 92.6ms | 1.0% | 92.6ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.9% | 90.9ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:699` |
| 0.9% | 83.2ms | 0.6% | 60.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.8% | 78.6ms | 0.0% | 686us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:588` |
| 0.8% | 75.7ms | 0.0% | 4.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.7% | 66.2ms | 0.4% | 44.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.6% | 62.3ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:648` |
| 0.6% | 61.1ms | 0.0% | 0us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.6% | 59.3ms | 0.0% | 5.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:589` |
| 0.6% | 56.1ms | 0.0% | 1.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:649` |
| 0.5% | 53.9ms | 0.2% | 23.0ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.5% | 50.4ms | 0.5% | 50.4ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 0.5% | 50.1ms | 0.4% | 42.1ms | `sort` | `[native code]` |
| 0.5% | 48.5ms | 0.0% | 0us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.5% | 48.5ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 0.5% | 48.5ms | 0.0% | 729us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.5% | 46.6ms | 0.5% | 46.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.4% | 45.3ms | 0.0% | 849us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:631` |
| 0.4% | 39.9ms | 0.0% | 826us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 0.3% | 35.2ms | 0.3% | 35.2ms | `Float64Array` | `[native code]` |
| 0.3% | 33.3ms | 0.0% | 1.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.3% | 31.6ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` |
| 0.3% | 30.7ms | 0.0% | 823us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.3% | 29.9ms | 0.0% | 795us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:729` |
| 0.2% | 24.7ms | 0.2% | 24.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.2% | 22.7ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 0.2% | 22.2ms | 0.2% | 21.4ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 0.2% | 21.6ms | 0.2% | 20.1ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` |
| 0.1% | 17.6ms | 0.1% | 16.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` |
| 0.1% | 16.6ms | 0.0% | 3.5ms | `anonymous` | `[native code]` |
| 0.1% | 16.3ms | 0.1% | 16.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` |
| 0.1% | 13.9ms | 0.1% | 13.9ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.1% | 13.8ms | 0.1% | 13.0ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:548` |
| 0.1% | 13.6ms | 0.0% | 4.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.1% | 13.0ms | 0.0% | 892us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:702` |
| 0.1% | 12.6ms | 0.1% | 12.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:625` |
| 0.1% | 12.5ms | 0.1% | 12.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.1% | 12.3ms | 0.1% | 12.3ms | `push` | `[native code]` |
| 0.1% | 12.2ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 0.1% | 11.9ms | 0.1% | 11.9ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:328` |
| 0.1% | 10.7ms | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:331` |
| 0.1% | 9.5ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:720` |
| 0.0% | 9.1ms | 0.0% | 0us | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:314` |
| 0.0% | 8.7ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:721` |
| 0.0% | 8.4ms | 0.0% | 7.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` |
| 0.0% | 7.9ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` |
| 0.0% | 7.2ms | 0.0% | 7.2ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 5.7ms | 0.0% | 618us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.0% | 5.7ms | 0.0% | 5.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |
| 0.0% | 5.7ms | 0.0% | 836us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:706` |
| 0.0% | 5.6ms | 0.0% | 4.9ms | `reduce` | `[native code]` |
| 0.0% | 5.1ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.0% | 4.7ms | 0.0% | 4.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 4.5ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` |
| 0.0% | 4.5ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` |
| 0.0% | 4.0ms | 0.0% | 4.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:734` |
| 0.0% | 3.9ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.0% | 3.8ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 0.0% | 3.7ms | 0.0% | 714us | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` |
| 0.0% | 3.6ms | 0.0% | 2.9ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:558` |
| 0.0% | 3.2ms | 0.0% | 3.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:730` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` |
| 0.0% | 2.5ms | 0.0% | 2.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:651` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:735` |
| 0.0% | 2.2ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:741` |
| 0.0% | 2.1ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:290` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.0ms | 0.0% | 744us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` |
| 0.0% | 2.0ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:550` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:731` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.6ms | 0.0% | 850us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:447` |
| 0.0% | 1.6ms | 0.0% | 753us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:615` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:237` |
| 0.0% | 1.5ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `max` | `[native code]` |
| 0.0% | 1.4ms | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:492` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` |
| 0.0% | 1.3ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 1.3ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 1.3ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 1.3ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 1.3ms | 0.0% | 709us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:719` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.3ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `min` | `[native code]` |
| 0.0% | 922us | 0.0% | 922us | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:297` |
| 0.0% | 911us | 0.0% | 911us | `sqrt` | `[native code]` |
| 0.0% | 891us | 0.0% | 891us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` |
| 0.0% | 886us | 0.0% | 886us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` |
| 0.0% | 886us | 0.0% | 886us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 880us | 0.0% | 880us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` |
| 0.0% | 879us | 0.0% | 879us | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:21` |
| 0.0% | 848us | 0.0% | 848us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:619` |
| 0.0% | 847us | 0.0% | 847us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 829us | 0.0% | 829us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:591` |
| 0.0% | 812us | 0.0% | 812us | `WriteStream` | `internal:fs/streams:251` |
| 0.0% | 811us | 0.0% | 811us | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:397` |
| 0.0% | 804us | 0.0% | 0us | `node:fs` | `node:fs:299` |
| 0.0% | 796us | 0.0% | 796us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:193` |
| 0.0% | 763us | 0.0% | 763us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:485` |
| 0.0% | 749us | 0.0% | 749us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:253` |
| 0.0% | 743us | 0.0% | 743us | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:555` |
| 0.0% | 737us | 0.0% | 737us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` |
| 0.0% | 731us | 0.0% | 731us | `defineProperty` | `[native code]` |
| 0.0% | 731us | 0.0% | 0us | `internal:streams/operators` | `internal:streams/operators:213` |
| 0.0% | 728us | 0.0% | 728us | `slice` | `[native code]` |
| 0.0% | 723us | 0.0% | 723us | `abs` | `[native code]` |
| 0.0% | 705us | 0.0% | 705us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:449` |
| 0.0% | 694us | 0.0% | 694us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:706` |
| 0.0% | 691us | 0.0% | 691us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` |
| 0.0% | 669us | 0.0% | 669us | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 667us | 0.0% | 667us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` |
| 0.0% | 656us | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 656us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 656us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 653us | 0.0% | 653us | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 649us | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 649us | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 649us | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 646us | 0.0% | 646us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:252` |
| 0.0% | 642us | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:581` |
| 0.0% | 632us | 0.0% | 632us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 625us | 0.0% | 625us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.0% | 617us | 0.0% | 617us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` |
| 0.0% | 492us | 0.0% | 492us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:330` |

## Function Details

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` | Self: 41.5% (3.80s) | Total: 43.2% (3.95s) | Samples: 4954

**Called by:**
- `step` (5150)

**Calls:**
- `hypot` (196)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` | Self: 20.0% (1.83s) | Total: 20.0% (1.83s) | Samples: 2369

**Called by:**
- `runTrial` (2359)
- `runTrial` (10)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` | Self: 4.7% (438.7ms) | Total: 4.9% (449.6ms) | Samples: 562

**Called by:**
- `step` (576)

**Calls:**
- `createZeroVector` (10)
- `fill` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` | Self: 3.9% (359.9ms) | Total: 4.3% (401.9ms) | Samples: 471

**Called by:**
- `runTrial` (527)

**Calls:**
- `createZeroMatrix` (41)
- `from` (12)
- `createZeroMatrix` (3)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` | Self: 3.9% (357.5ms) | Total: 4.3% (401.1ms) | Samples: 466

**Called by:**
- `step` (518)

**Calls:**
- `from` (52)

### `mahalanobisSquaredWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:286` | Self: 3.5% (327.4ms) | Total: 3.6% (335.7ms) | Samples: 424

**Called by:**
- `step` (435)

**Calls:**
- `createZeroVector` (7)
- `fill` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` | Self: 2.1% (194.7ms) | Total: 2.1% (194.7ms) | Samples: 253

**Called by:**
- `runTrial` (252)
- `runTrial` (1)

### `map`
`[native code]` | Self: 2.0% (191.6ms) | Total: 4.0% (371.4ms) | Samples: 243

**Called by:**
- `step` (95)
- `step` (94)
- `step` (82)
- `cloneMatrix` (80)
- `(anonymous)` (72)
- `(anonymous)` (15)
- `jacobiEigenSymmetric` (12)
- `step` (10)
- `step` (6)
- `step` (6)
- `jacobiEigenSymmetric` (3)
- `alignProjectionBasis` (3)
- `jacobiEigenSymmetric` (2)

**Calls:**
- `(anonymous)` (98)
- `(anonymous)` (74)
- `(anonymous)` (62)
- `abs` (1)
- `(anonymous)` (1)
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:686` | Self: 1.7% (161.0ms) | Total: 1.7% (161.0ms) | Samples: 210

**Called by:**
- `runTrial` (210)

### `hypot`
`[native code]` | Self: 1.6% (153.3ms) | Total: 1.6% (153.3ms) | Samples: 196

**Called by:**
- `jacobiEigenSymmetric` (196)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:683` | Self: 1.4% (133.5ms) | Total: 1.4% (133.5ms) | Samples: 172

**Called by:**
- `runTrial` (172)

### `fill`
`[native code]` | Self: 1.4% (133.4ms) | Total: 1.4% (133.4ms) | Samples: 177

**Called by:**
- `sampleGaussianVectorND` (93)
- `ellipsoidObjective` (41)
- `from` (32)
- `mahalanobisSquaredWithEigensystem` (4)
- `transformFromEigenCoordinates` (4)
- `whitenWithEigensystem` (2)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.4% (131.2ms) | Total: 2.2% (201.8ms) | Samples: 166

**Called by:**
- `step` (259)

**Calls:**
- `fill` (93)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.0% (98.5ms) | Total: 1.0% (98.5ms) | Samples: 118

**Called by:**
- `map` (98)
- `some` (17)
- `forEach` (1)
- `CMAESOptimizerND` (1)
- `nextHalfOpenUnit` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.0% (92.6ms) | Total: 1.0% (92.6ms) | Samples: 120

**Called by:**
- `(anonymous)` (97)
- `step` (12)
- `step` (11)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` | Self: 0.6% (60.3ms) | Total: 0.9% (83.2ms) | Samples: 78

**Called by:**
- `step` (105)

**Calls:**
- `Float64Array` (27)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` | Self: 0.5% (50.4ms) | Total: 0.5% (50.4ms) | Samples: 65

**Called by:**
- `step` (65)

### `from`
`[native code]` | Self: 0.5% (48.0ms) | Total: 1.1% (109.0ms) | Samples: 59

**Called by:**
- `reconstructSymmetric` (52)
- `createZeroMatrix` (40)
- `jacobiEigenSymmetric` (28)
- `step` (12)
- `jacobiEigenSymmetric` (6)

**Calls:**
- `fill` (32)
- `(anonymous)` (31)
- `(anonymous)` (16)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 0.5% (46.6ms) | Total: 0.5% (46.6ms) | Samples: 62

**Called by:**
- `map` (62)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.4% (44.3ms) | Total: 0.7% (66.2ms) | Samples: 58

**Called by:**
- `step` (86)

**Calls:**
- `from` (28)

### `sort`
`[native code]` | Self: 0.4% (42.1ms) | Total: 0.5% (50.1ms) | Samples: 56

**Called by:**
- `jacobiEigenSymmetric` (37)
- `step` (29)

**Calls:**
- `(anonymous)` (6)
- `(anonymous)` (4)

### `some`
`[native code]` | Self: 0.4% (37.7ms) | Total: 1.0% (99.3ms) | Samples: 50

**Called by:**
- `validateSquareFiniteMatrix` (64)
- `(anonymous)` (63)
- `projectTo3D` (4)

**Calls:**
- `(anonymous)` (64)
- `(anonymous)` (17)

### `Float64Array`
`[native code]` | Self: 0.3% (35.2ms) | Total: 0.3% (35.2ms) | Samples: 43

**Called by:**
- `jacobiEigenSymmetric` (27)
- `jacobiEigenSymmetric` (16)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` | Self: 0.3% (28.3ms) | Total: 1.3% (125.6ms) | Samples: 38

**Called by:**
- `forEach` (164)

**Calls:**
- `projectTo3D` (97)
- `projectTo3D` (18)
- `projectTo3D` (5)
- `projectTo3D` (4)
- `projectTo3D` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.2% (24.7ms) | Total: 0.2% (24.7ms) | Samples: 31

**Called by:**
- `from` (31)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` | Self: 0.2% (23.0ms) | Total: 0.5% (53.9ms) | Samples: 31

**Called by:**
- `step` (72)

**Calls:**
- `fill` (41)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` | Self: 0.2% (21.4ms) | Total: 0.2% (22.2ms) | Samples: 27

**Called by:**
- `step` (28)

**Calls:**
- `createZeroVector` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` | Self: 0.2% (20.1ms) | Total: 0.2% (21.6ms) | Samples: 27

**Called by:**
- `step` (29)

**Calls:**
- `fill` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` | Self: 0.1% (16.7ms) | Total: 0.1% (17.6ms) | Samples: 23

**Called by:**
- `runTrial` (24)

**Calls:**
- `adaptationPoint` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` | Self: 0.1% (16.3ms) | Total: 0.1% (16.3ms) | Samples: 22

**Called by:**
- `runTrial` (22)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` | Self: 0.1% (13.9ms) | Total: 0.1% (13.9ms) | Samples: 18

**Called by:**
- `transformFromEigenCoordinates` (10)
- `mahalanobisSquaredWithEigensystem` (7)
- `whitenWithEigensystem` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:548` | Self: 0.1% (13.0ms) | Total: 0.1% (13.8ms) | Samples: 17

**Called by:**
- `(anonymous)` (18)

**Calls:**
- `requireFiniteVector` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:625` | Self: 0.1% (12.6ms) | Total: 0.1% (12.6ms) | Samples: 17

**Called by:**
- `runTrial` (17)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.1% (12.5ms) | Total: 0.1% (12.5ms) | Samples: 16

**Called by:**
- `from` (16)

### `push`
`[native code]` | Self: 0.1% (12.3ms) | Total: 0.1% (12.3ms) | Samples: 16

**Called by:**
- `step` (12)
- `step` (3)
- `step` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:328` | Self: 0.1% (11.9ms) | Total: 0.1% (11.9ms) | Samples: 16

**Called by:**
- `step` (16)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` | Self: 0.0% (7.4ms) | Total: 0.0% (8.4ms) | Samples: 10

**Called by:**
- `runTrial` (11)

**Calls:**
- `sqrt` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (7.2ms) | Total: 0.0% (7.2ms) | Samples: 10

**Called by:**
- `step` (10)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` | Self: 0.0% (5.7ms) | Total: 0.0% (5.7ms) | Samples: 7

**Called by:**
- `runTrial` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:589` | Self: 0.0% (5.4ms) | Total: 0.6% (59.3ms) | Samples: 6

**Called by:**
- `runTrial` (78)

**Calls:**
- `ellipsoidObjective` (72)

### `reduce`
`[native code]` | Self: 0.0% (4.9ms) | Total: 0.0% (5.6ms) | Samples: 6

**Called by:**
- `step` (6)
- `CMAESOptimizerND` (1)

**Calls:**
- `(anonymous)` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` | Self: 0.0% (4.7ms) | Total: 0.0% (4.7ms) | Samples: 6

**Called by:**
- `sort` (6)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.0% (4.5ms) | Total: 0.1% (13.6ms) | Samples: 6

**Called by:**
- `step` (18)

**Calls:**
- `map` (12)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` | Self: 0.0% (4.5ms) | Total: 0.8% (75.7ms) | Samples: 6

**Called by:**
- `runTrial` (100)

**Calls:**
- `map` (94)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:734` | Self: 0.0% (4.0ms) | Total: 0.0% (4.0ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `forEach`
`[native code]` | Self: 0.0% (3.9ms) | Total: 1.5% (143.4ms) | Samples: 5

**Called by:**
- `step` (181)
- `step` (5)

**Calls:**
- `(anonymous)` (164)
- `(anonymous)` (16)
- `(anonymous)` (1)

### `anonymous`
`[native code]` | Self: 0.0% (3.5ms) | Total: 0.1% (16.6ms) | Samples: 5

**Called by:**
- `(anonymous)` (4)
- `node:fs` (3)
- `internal:fs/streams` (2)
- `get WriteStream` (2)
- `internal:stream` (2)
- `node:fs/promises` (2)
- `node:stream` (2)
- `node:events` (1)
- `internal:validators` (1)
- `node:fs` (1)
- `internal:streams/pipeline` (1)
- `internal:shared` (1)
- `internal:streams/compose` (1)
- `internal:streams/duplex` (1)

**Calls:**
- `node:fs` (3)
- `internal:fs/streams` (2)
- `internal:stream` (2)
- `node:fs/promises` (2)
- `node:stream` (2)
- `node:events` (1)
- `internal:streams/pipeline` (1)
- `node:fs` (1)
- `internal:validators` (1)
- `internal:streams/operators` (1)
- `internal:shared` (1)
- `internal:streams/compose` (1)
- `internal:streams/duplex` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` | Self: 0.0% (3.2ms) | Total: 0.0% (3.2ms) | Samples: 4

**Called by:**
- `sort` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` | Self: 0.0% (3.1ms) | Total: 3.7% (342.0ms) | Samples: 4

**Called by:**
- `runTrial` (442)
- `runTrial` (1)

**Calls:**
- `mahalanobisSquaredWithEigensystem` (435)
- `mahalanobisSquaredWithEigensystem` (3)
- `mahalanobisSquaredWithEigensystem` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:730` | Self: 0.0% (3.1ms) | Total: 0.0% (3.1ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:585` | Self: 0.0% (3.0ms) | Total: 2.5% (237.6ms) | Samples: 4

**Called by:**
- `runTrial` (294)
- `runTrial` (1)

**Calls:**
- `sampleGaussianVectorND` (259)
- `sampleGaussianVectorND` (16)
- `push` (12)
- `sampleGaussianVectorND` (3)
- `sampleGaussianVectorND` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:558` | Self: 0.0% (2.9ms) | Total: 0.0% (3.6ms) | Samples: 4

**Called by:**
- `(anonymous)` (5)

**Calls:**
- `coordinate` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` | Self: 0.0% (2.8ms) | Total: 0.0% (2.8ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` | Self: 0.0% (2.5ms) | Total: 0.0% (2.5ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` | Self: 0.0% (2.3ms) | Total: 0.0% (3.8ms) | Samples: 3

**Called by:**
- `runTrial` (5)

**Calls:**
- `max` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:651` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:735` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `mahalanobisSquaredWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:290` | Self: 0.0% (2.1ms) | Total: 0.0% (2.1ms) | Samples: 3

**Called by:**
- `step` (3)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (2.0ms) | Total: 0.0% (2.0ms) | Samples: 3

**Called by:**
- `step` (3)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:550` | Self: 0.0% (1.7ms) | Total: 0.0% (1.7ms) | Samples: 2

**Called by:**
- `(anonymous)` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:731` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` | Self: 0.0% (1.6ms) | Total: 5.0% (460.6ms) | Samples: 2

**Called by:**
- `runTrial` (588)
- `runTrial` (3)

**Calls:**
- `transformFromEigenCoordinates` (576)
- `transformFromEigenCoordinates` (10)
- `transformFromEigenCoordinates` (1)
- `transformFromEigenCoordinates` (1)
- `transformFromEigenCoordinates` (1)

### `nextHalfOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 2

**Called by:**
- `sampleGaussianVectorND` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:649` | Self: 0.0% (1.5ms) | Total: 0.6% (56.1ms) | Samples: 2

**Called by:**
- `map` (74)

**Calls:**
- `map` (72)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:237` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `step` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` | Self: 0.0% (1.5ms) | Total: 0.3% (33.3ms) | Samples: 2

**Called by:**
- `step` (45)

**Calls:**
- `sort` (37)
- `from` (6)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `step` (2)

### `max`
`[native code]` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `min`
`[native code]` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:690` | Self: 0.0% (1.2ms) | Total: 4.4% (404.0ms) | Samples: 2

**Called by:**
- `runTrial` (519)
- `runTrial` (3)

**Calls:**
- `reconstructSymmetric` (518)
- `reconstructSymmetric` (2)

### `mahalanobisSquaredWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:297` | Self: 0.0% (922us) | Total: 0.0% (922us) | Samples: 1

**Called by:**
- `step` (1)

### `sqrt`
`[native code]` | Self: 0.0% (911us) | Total: 0.0% (911us) | Samples: 1

**Called by:**
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:702` | Self: 0.0% (892us) | Total: 0.1% (13.0ms) | Samples: 1

**Called by:**
- `forEach` (16)

**Calls:**
- `map` (15)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` | Self: 0.0% (891us) | Total: 0.0% (891us) | Samples: 1

**Called by:**
- `map` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (886us) | Total: 0.0% (886us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` | Self: 0.0% (886us) | Total: 0.0% (886us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` | Self: 0.0% (880us) | Total: 0.0% (880us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:21` | Self: 0.0% (879us) | Total: 0.0% (879us) | Samples: 1

**Called by:**
- `step` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:447` | Self: 0.0% (850us) | Total: 0.0% (1.6ms) | Samples: 1

**Called by:**
- `runTrial` (2)

**Calls:**
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:631` | Self: 0.0% (849us) | Total: 0.4% (45.3ms) | Samples: 1

**Called by:**
- `runTrial` (59)

**Calls:**
- `whitenWithEigensystem` (29)
- `whitenWithEigensystem` (28)
- `whitenWithEigensystem` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:619` | Self: 0.0% (848us) | Total: 0.0% (848us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `adaptationPoint`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (847us) | Total: 0.0% (847us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:706` | Self: 0.0% (836us) | Total: 0.0% (5.7ms) | Samples: 1

**Called by:**
- `runTrial` (7)

**Calls:**
- `reduce` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:591` | Self: 0.0% (829us) | Total: 0.0% (829us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` | Self: 0.0% (826us) | Total: 0.4% (39.9ms) | Samples: 1

**Called by:**
- `step` (52)

**Calls:**
- `cloneMatrix` (48)
- `map` (3)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.0% (823us) | Total: 0.3% (30.7ms) | Samples: 1

**Called by:**
- `step` (41)

**Calls:**
- `from` (40)

### `WriteStream`
`internal:fs/streams:251` | Self: 0.0% (812us) | Total: 0.0% (812us) | Samples: 1

**Called by:**
- `(anonymous)` (1)

### `requireFiniteVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:397` | Self: 0.0% (811us) | Total: 0.0% (811us) | Samples: 1

**Called by:**
- `projectTo3D` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:193` | Self: 0.0% (796us) | Total: 0.0% (796us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:729` | Self: 0.0% (795us) | Total: 0.3% (29.9ms) | Samples: 1

**Called by:**
- `runTrial` (39)

**Calls:**
- `cloneMatrix` (32)
- `map` (6)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:485` | Self: 0.0% (763us) | Total: 0.0% (763us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:615` | Self: 0.0% (753us) | Total: 0.0% (1.6ms) | Samples: 1

**Called by:**
- `runTrial` (2)

**Calls:**
- `createZeroVector` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:253` | Self: 0.0% (749us) | Total: 0.0% (749us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` | Self: 0.0% (744us) | Total: 0.0% (2.0ms) | Samples: 1

**Called by:**
- `runTrial` (3)

**Calls:**
- `min` (2)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:555` | Self: 0.0% (743us) | Total: 0.0% (743us) | Samples: 1

**Called by:**
- `projectTo3D` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` | Self: 0.0% (737us) | Total: 0.0% (737us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `defineProperty`
`[native code]` | Self: 0.0% (731us) | Total: 0.0% (731us) | Samples: 1

**Called by:**
- `internal:streams/operators` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (729us) | Total: 0.5% (48.5ms) | Samples: 1

**Called by:**
- `some` (64)

**Calls:**
- `some` (63)

### `slice`
`[native code]` | Self: 0.0% (728us) | Total: 0.0% (728us) | Samples: 1

**Called by:**
- `CMAESOptimizerND` (1)

### `abs`
`[native code]` | Self: 0.0% (723us) | Total: 0.0% (723us) | Samples: 1

**Called by:**
- `map` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` | Self: 0.0% (714us) | Total: 0.0% (3.7ms) | Samples: 1

**Called by:**
- `(anonymous)` (4)
- `step` (1)

**Calls:**
- `some` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:719` | Self: 0.0% (709us) | Total: 0.0% (1.3ms) | Samples: 1

**Called by:**
- `runTrial` (2)

**Calls:**
- `variancePercent` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:449` | Self: 0.0% (705us) | Total: 0.0% (705us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:706` | Self: 0.0% (694us) | Total: 0.0% (694us) | Samples: 1

**Called by:**
- `reduce` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` | Self: 0.0% (691us) | Total: 0.0% (691us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:588` | Self: 0.0% (686us) | Total: 0.8% (78.6ms) | Samples: 1

**Called by:**
- `runTrial` (96)

**Calls:**
- `map` (95)

### `variancePercent`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (669us) | Total: 0.0% (669us) | Samples: 1

**Called by:**
- `step` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` | Self: 0.0% (667us) | Total: 0.0% (667us) | Samples: 1

**Called by:**
- `step` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (653us) | Total: 0.0% (653us) | Samples: 1

**Called by:**
- `step` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:252` | Self: 0.0% (646us) | Total: 0.0% (646us) | Samples: 1

**Called by:**
- `step` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (632us) | Total: 0.0% (632us) | Samples: 1

**Called by:**
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` | Self: 0.0% (625us) | Total: 0.0% (625us) | Samples: 1

**Called by:**
- `map` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` | Self: 0.0% (618us) | Total: 0.0% (5.7ms) | Samples: 1

**Calls:**
- `(anonymous)` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` | Self: 0.0% (617us) | Total: 0.0% (617us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:330` | Self: 0.0% (492us) | Total: 0.0% (492us) | Samples: 1

**Called by:**
- `step` (1)

### `internal:streams/operators`
`internal:streams/operators:213` | Self: 0.0% (0us) | Total: 0.0% (731us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `defineProperty` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` | Self: 0.0% (0us) | Total: 0.2% (22.7ms) | Samples: 0

**Called by:**
- `runTrial` (29)

**Calls:**
- `sort` (29)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:331` | Self: 0.0% (0us) | Total: 0.1% (10.7ms) | Samples: 0

**Called by:**
- `step` (3)

**Calls:**
- `nextHalfOpenUnit` (2)
- `nextHalfOpenUnit` (1)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.3ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (656us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` | Self: 0.0% (0us) | Total: 0.0% (7.9ms) | Samples: 0

**Called by:**
- `runTrial` (10)

**Calls:**
- `map` (10)

### `nextHalfOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:314` | Self: 0.0% (0us) | Total: 0.0% (9.1ms) | Samples: 0

**Called by:**
- `sampleGaussianVectorND` (1)

**Calls:**
- `(anonymous)` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` | Self: 0.0% (0us) | Total: 0.0% (4.5ms) | Samples: 0

**Called by:**
- `(module)` (5)
- `(module)` (1)

**Calls:**
- `CMAESOptimizerND` (2)
- `CMAESOptimizerND` (2)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (1.3ms) | Samples: 0

**Called by:**
- `(anonymous)` (2)

**Calls:**
- `anonymous` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:741` | Self: 0.0% (0us) | Total: 0.0% (2.2ms) | Samples: 0

**Called by:**
- `runTrial` (3)

**Calls:**
- `push` (3)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (1.3ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (649us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` | Self: 0.0% (0us) | Total: 0.0% (4.5ms) | Samples: 0

**Called by:**
- `runTrial` (6)

**Calls:**
- `map` (6)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 0.0% (0us) | Total: 0.6% (61.1ms) | Samples: 0

**Called by:**
- `alignProjectionBasis` (48)
- `step` (32)

**Calls:**
- `map` (80)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:701` | Self: 0.0% (0us) | Total: 1.5% (139.5ms) | Samples: 0

**Called by:**
- `runTrial` (181)

**Calls:**
- `forEach` (181)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (5.1ms) | Samples: 0

**Called by:**
- `(module)` (7)

**Calls:**
- `anonymous` (4)
- `get WriteStream` (2)
- `WriteStream` (1)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (649us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:699` | Self: 0.0% (0us) | Total: 0.9% (90.9ms) | Samples: 0

**Called by:**
- `runTrial` (118)

**Calls:**
- `alignProjectionBasis` (65)
- `alignProjectionBasis` (52)
- `alignProjectionBasis` (1)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (1.3ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` | Self: 0.0% (0us) | Total: 99.5% (9.10s) | Samples: 0

**Called by:**
- `(module)` (11036)
- `(module)` (768)

**Calls:**
- `step` (5475)
- `step` (2359)
- `step` (588)
- `step` (527)
- `step` (519)
- `step` (442)
- `step` (294)
- `step` (252)
- `step` (210)
- `step` (181)
- `step` (172)
- `step` (118)
- `step` (100)
- `step` (96)
- `step` (82)
- `step` (78)
- `step` (59)
- `step` (39)
- `step` (29)
- `step` (24)
- `step` (22)
- `step` (17)
- `step` (13)
- `step` (11)
- `step` (11)
- `step` (10)
- `step` (7)
- `step` (7)
- `step` (6)
- `step` (5)
- `step` (5)
- `step` (5)
- `step` (4)
- `step` (4)
- `step` (3)
- `step` (3)
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

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:689` | Self: 0.0% (0us) | Total: 46.1% (4.22s) | Samples: 0

**Called by:**
- `runTrial` (5475)
- `runTrial` (20)

**Calls:**
- `jacobiEigenSymmetric` (5150)
- `jacobiEigenSymmetric` (105)
- `jacobiEigenSymmetric` (86)
- `jacobiEigenSymmetric` (64)
- `jacobiEigenSymmetric` (45)
- `jacobiEigenSymmetric` (18)
- `jacobiEigenSymmetric` (16)
- `jacobiEigenSymmetric` (3)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `step` (2)

**Calls:**
- `map` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` | Self: 0.0% (0us) | Total: 0.0% (2.0ms) | Samples: 0

**Called by:**
- `step` (3)

**Calls:**
- `map` (3)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.3ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` | Self: 0.0% (0us) | Total: 0.5% (48.5ms) | Samples: 0

**Called by:**
- `step` (64)

**Calls:**
- `validateSquareFiniteMatrix` (64)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (0us) | Total: 0.5% (48.5ms) | Samples: 0

**Called by:**
- `jacobiEigenSymmetric` (64)

**Calls:**
- `some` (64)

### `node:fs`
`node:fs:299` | Self: 0.0% (0us) | Total: 0.0% (804us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` | Self: 0.0% (0us) | Total: 0.0% (3.9ms) | Samples: 0

**Called by:**
- `runTrial` (5)

**Calls:**
- `forEach` (5)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (649us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (656us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:721` | Self: 0.0% (0us) | Total: 0.0% (8.7ms) | Samples: 0

**Called by:**
- `runTrial` (11)

**Calls:**
- `projectTo3D` (11)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` | Self: 0.0% (0us) | Total: 6.6% (604.2ms) | Samples: 0

**Calls:**
- `runTrial` (768)
- `runTrial` (5)
- `runTrial` (1)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (656us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (2.1ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:648` | Self: 0.0% (0us) | Total: 0.6% (62.3ms) | Samples: 0

**Called by:**
- `runTrial` (82)

**Calls:**
- `map` (82)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` | Self: 0.0% (0us) | Total: 0.3% (31.6ms) | Samples: 0

**Called by:**
- `(module)` (34)
- `(module)` (5)

**Calls:**
- `step` (20)
- `step` (10)
- `step` (3)
- `step` (3)
- `step` (1)
- `step` (1)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:720` | Self: 0.0% (0us) | Total: 0.1% (9.5ms) | Samples: 0

**Called by:**
- `runTrial` (13)

**Calls:**
- `projectTo3D` (12)
- `projectTo3D` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:492` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `runTrial` (2)

**Calls:**
- `reduce` (1)
- `slice` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` | Self: 0.0% (0us) | Total: 0.1% (12.2ms) | Samples: 0

**Called by:**
- `step` (16)

**Calls:**
- `Float64Array` (16)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` | Self: 0.0% (0us) | Total: 93.3% (8.53s) | Samples: 0

**Calls:**
- `runTrial` (11036)
- `runTrial` (34)
- `runTrial` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:581` | Self: 0.0% (0us) | Total: 0.0% (642us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `push` (1)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 92.3% | 8.44s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 7.3% | 672.4ms | `[native code]` |
| 0.2% | 23.6ms | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.0% | 812us | `internal:fs/streams` |
