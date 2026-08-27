# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 9.07s | 11728 | 500us | 173 |

**Top 10:** `jacobiEigenSymmetric` 42.0%, `step` 19.5%, `transformFromEigenCoordinates` 4.5%, `step` 3.9%, `mahalanobisSquaredWithEigensystem` 3.1%, `reconstructSymmetric` 2.8%, `step` 2.1%, `map` 2.0%, `step` 1.9%, `hypot` 1.5%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 42.0% | 3.80s | 43.5% | 3.95s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 19.5% | 1.77s | 19.5% | 1.77s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` |
| 4.5% | 415.6ms | 4.7% | 426.2ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 3.9% | 356.7ms | 4.2% | 386.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 3.1% | 287.9ms | 3.2% | 292.9ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:286` |
| 2.8% | 262.4ms | 3.4% | 309.9ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` |
| 2.1% | 191.7ms | 2.1% | 191.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` |
| 2.0% | 185.5ms | 4.7% | 429.1ms | `map` | `[native code]` |
| 1.9% | 175.2ms | 1.9% | 175.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:686` |
| 1.5% | 143.9ms | 1.5% | 143.9ms | `hypot` | `[native code]` |
| 1.5% | 143.0ms | 1.5% | 143.0ms | `fill` | `[native code]` |
| 1.4% | 135.9ms | 2.2% | 205.3ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.4% | 130.2ms | 1.4% | 130.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:683` |
| 1.2% | 116.9ms | 1.2% | 116.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.7% | 71.6ms | 0.7% | 71.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.7% | 68.7ms | 0.7% | 68.7ms | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:397` |
| 0.5% | 52.5ms | 0.8% | 74.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.5% | 47.0ms | 0.5% | 47.0ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 0.4% | 43.8ms | 1.2% | 117.4ms | `from` | `[native code]` |
| 0.4% | 41.4ms | 0.8% | 76.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.4% | 37.9ms | 1.2% | 109.6ms | `some` | `[native code]` |
| 0.4% | 37.6ms | 0.4% | 38.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` |
| 0.4% | 36.9ms | 0.4% | 45.2ms | `sort` | `[native code]` |
| 0.3% | 35.1ms | 0.3% | 35.1ms | `Float64Array` | `[native code]` |
| 0.3% | 31.1ms | 0.3% | 31.1ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.3% | 30.3ms | 1.5% | 135.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` |
| 0.3% | 29.9ms | 0.3% | 30.6ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 0.3% | 28.9ms | 0.3% | 28.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.3% | 27.2ms | 0.7% | 70.7ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.2% | 24.0ms | 0.2% | 24.8ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` |
| 0.2% | 20.6ms | 0.2% | 20.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.2% | 18.7ms | 0.2% | 18.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` |
| 0.1% | 16.6ms | 0.1% | 16.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` |
| 0.1% | 15.2ms | 0.1% | 15.2ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:328` |
| 0.1% | 13.8ms | 0.1% | 13.8ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.1% | 12.2ms | 0.1% | 12.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:625` |
| 0.1% | 12.2ms | 0.8% | 80.9ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:548` |
| 0.1% | 11.3ms | 0.9% | 83.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:589` |
| 0.0% | 8.9ms | 0.0% | 8.9ms | `push` | `[native code]` |
| 0.0% | 7.8ms | 0.1% | 9.9ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:558` |
| 0.0% | 7.3ms | 0.0% | 7.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |
| 0.0% | 6.5ms | 2.6% | 237.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:585` |
| 0.0% | 6.0ms | 0.0% | 6.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 4.7ms | 0.1% | 13.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.0% | 4.7ms | 3.3% | 300.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` |
| 0.0% | 4.6ms | 0.8% | 77.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.0% | 4.5ms | 0.0% | 4.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` |
| 0.0% | 4.5ms | 0.0% | 4.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:735` |
| 0.0% | 4.3ms | 0.2% | 18.8ms | `anonymous` | `[native code]` |
| 0.0% | 4.0ms | 0.0% | 4.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` |
| 0.0% | 3.9ms | 0.0% | 3.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:741` |
| 0.0% | 3.6ms | 0.0% | 3.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:651` |
| 0.0% | 3.3ms | 4.7% | 432.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` |
| 0.0% | 3.1ms | 1.7% | 155.7ms | `forEach` | `[native code]` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:730` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `abs` | `[native code]` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` |
| 0.0% | 2.4ms | 0.5% | 54.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.0% | 2.3ms | 0.0% | 7.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` |
| 0.0% | 2.3ms | 0.0% | 3.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:591` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `filter` | `[native code]` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 0.0% | 2.2ms | 0.4% | 39.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:579` |
| 0.0% | 2.1ms | 0.8% | 75.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:588` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:555` |
| 0.0% | 1.6ms | 0.0% | 2.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` |
| 0.0% | 1.6ms | 0.1% | 17.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:702` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:734` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:731` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:290` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:332` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:26` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `reduce` | `[native code]` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.0% | 1.0ms | 0.0% | 1.0ms | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:90` |
| 0.0% | 905us | 0.0% | 905us | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 899us | 0.0% | 899us | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:550` |
| 0.0% | 897us | 0.0% | 897us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:740` |
| 0.0% | 896us | 0.0% | 896us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:544` |
| 0.0% | 892us | 0.0% | 892us | `now` | `[native code]` |
| 0.0% | 869us | 0.0% | 869us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:584` |
| 0.0% | 865us | 0.0% | 865us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.0% | 860us | 0.0% | 860us | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 860us | 0.0% | 860us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:489` |
| 0.0% | 846us | 0.0% | 846us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:167` |
| 0.0% | 845us | 0.1% | 14.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 0.0% | 821us | 0.0% | 821us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:678` |
| 0.0% | 820us | 0.0% | 820us | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:296` |
| 0.0% | 816us | 0.0% | 816us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 808us | 0.0% | 808us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:508` |
| 0.0% | 804us | 0.0% | 1.4ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:40` |
| 0.0% | 800us | 0.0% | 800us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 791us | 0.0% | 791us | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 790us | 0.0% | 790us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:472` |
| 0.0% | 789us | 99.3% | 9.00s | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 0.0% | 784us | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:706` |
| 0.0% | 774us | 0.0% | 774us | `min` | `[native code]` |
| 0.0% | 771us | 0.1% | 11.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:720` |
| 0.0% | 763us | 0.0% | 763us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:618` |
| 0.0% | 747us | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:719` |
| 0.0% | 732us | 0.0% | 732us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` |
| 0.0% | 724us | 0.0% | 724us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:685` |
| 0.0% | 721us | 0.0% | 721us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:682` |
| 0.0% | 718us | 0.0% | 718us | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:285` |
| 0.0% | 717us | 0.0% | 2.4ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` |
| 0.0% | 711us | 0.6% | 57.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:631` |
| 0.0% | 704us | 0.0% | 704us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:520` |
| 0.0% | 701us | 0.0% | 701us | `bound call` | `[native code]` |
| 0.0% | 694us | 0.0% | 694us | `slice` | `[native code]` |
| 0.0% | 681us | 0.0% | 681us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:588` |
| 0.0% | 653us | 0.0% | 653us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:641` |
| 0.0% | 648us | 0.0% | 648us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:150` |
| 0.0% | 634us | 0.0% | 634us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 628us | 0.2% | 25.1ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.0% | 624us | 0.0% | 624us | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 618us | 0.0% | 3.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 99.3% | 9.00s | 0.0% | 789us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 93.2% | 8.45s | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` |
| 46.7% | 4.23s | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:689` |
| 43.5% | 3.95s | 42.0% | 3.80s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 19.5% | 1.77s | 19.5% | 1.77s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` |
| 6.6% | 605.6ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` |
| 4.7% | 432.4ms | 0.0% | 3.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` |
| 4.7% | 429.1ms | 2.0% | 185.5ms | `map` | `[native code]` |
| 4.7% | 426.2ms | 4.5% | 415.6ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 4.2% | 386.0ms | 3.9% | 356.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 3.4% | 310.7ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:690` |
| 3.4% | 309.9ms | 2.8% | 262.4ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` |
| 3.3% | 300.7ms | 0.0% | 4.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` |
| 3.2% | 292.9ms | 3.1% | 287.9ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:286` |
| 2.6% | 237.6ms | 0.0% | 6.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:585` |
| 2.2% | 205.3ms | 1.4% | 135.9ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 2.1% | 191.7ms | 2.1% | 191.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` |
| 1.9% | 175.2ms | 1.9% | 175.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:686` |
| 1.7% | 155.7ms | 0.0% | 3.1ms | `forEach` | `[native code]` |
| 1.6% | 152.5ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:701` |
| 1.5% | 143.9ms | 1.5% | 143.9ms | `hypot` | `[native code]` |
| 1.5% | 143.0ms | 1.5% | 143.0ms | `fill` | `[native code]` |
| 1.5% | 135.9ms | 0.3% | 30.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` |
| 1.4% | 130.2ms | 1.4% | 130.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:683` |
| 1.3% | 122.1ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:699` |
| 1.2% | 117.4ms | 0.4% | 43.8ms | `from` | `[native code]` |
| 1.2% | 116.9ms | 1.2% | 116.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.2% | 109.6ms | 0.4% | 37.9ms | `some` | `[native code]` |
| 1.1% | 101.9ms | 0.0% | 0us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.9% | 83.5ms | 0.1% | 11.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:589` |
| 0.8% | 80.9ms | 0.1% | 12.2ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:548` |
| 0.8% | 77.8ms | 0.0% | 4.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.8% | 76.0ms | 0.4% | 41.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.8% | 75.0ms | 0.0% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:588` |
| 0.8% | 74.1ms | 0.5% | 52.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.7% | 71.6ms | 0.7% | 71.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.7% | 70.7ms | 0.3% | 27.2ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.7% | 68.7ms | 0.7% | 68.7ms | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:397` |
| 0.7% | 66.3ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:648` |
| 0.7% | 65.6ms | 0.0% | 0us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:649` |
| 0.6% | 57.6ms | 0.0% | 711us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:631` |
| 0.6% | 56.2ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 0.6% | 55.1ms | 0.0% | 0us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.5% | 54.3ms | 0.0% | 2.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.5% | 47.0ms | 0.5% | 47.0ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 0.4% | 45.2ms | 0.4% | 36.9ms | `sort` | `[native code]` |
| 0.4% | 39.1ms | 0.0% | 2.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.4% | 38.5ms | 0.4% | 37.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` |
| 0.4% | 38.4ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` |
| 0.4% | 37.6ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:574` |
| 0.4% | 36.5ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 0.3% | 35.1ms | 0.3% | 35.1ms | `Float64Array` | `[native code]` |
| 0.3% | 31.1ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:729` |
| 0.3% | 31.1ms | 0.3% | 31.1ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.3% | 30.6ms | 0.3% | 29.9ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 0.3% | 28.9ms | 0.3% | 28.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.2% | 25.1ms | 0.0% | 628us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.2% | 24.8ms | 0.2% | 24.0ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` |
| 0.2% | 20.6ms | 0.2% | 20.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.2% | 18.8ms | 0.0% | 4.3ms | `anonymous` | `[native code]` |
| 0.2% | 18.7ms | 0.2% | 18.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` |
| 0.1% | 17.4ms | 0.0% | 1.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:702` |
| 0.1% | 16.6ms | 0.1% | 16.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` |
| 0.1% | 15.2ms | 0.1% | 15.2ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:328` |
| 0.1% | 14.8ms | 0.0% | 845us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 0.1% | 13.8ms | 0.1% | 13.8ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.1% | 13.8ms | 0.0% | 4.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.1% | 13.5ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 0.1% | 12.2ms | 0.1% | 12.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:625` |
| 0.1% | 11.4ms | 0.0% | 771us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:720` |
| 0.1% | 9.9ms | 0.0% | 7.8ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:558` |
| 0.1% | 9.2ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` |
| 0.1% | 9.0ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:721` |
| 0.0% | 8.9ms | 0.0% | 8.9ms | `push` | `[native code]` |
| 0.0% | 7.7ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` |
| 0.0% | 7.3ms | 0.0% | 7.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |
| 0.0% | 6.8ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` |
| 0.0% | 6.0ms | 0.0% | 6.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 5.4ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` |
| 0.0% | 5.0ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.0% | 5.0ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.0% | 4.5ms | 0.0% | 4.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` |
| 0.0% | 4.5ms | 0.0% | 4.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:735` |
| 0.0% | 4.0ms | 0.0% | 4.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` |
| 0.0% | 3.9ms | 0.0% | 3.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:741` |
| 0.0% | 3.7ms | 0.0% | 618us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.0% | 3.6ms | 0.0% | 3.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:651` |
| 0.0% | 3.3ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:615` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:730` |
| 0.0% | 3.0ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:591` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `abs` | `[native code]` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` |
| 0.0% | 2.5ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` |
| 0.0% | 2.4ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 2.4ms | 0.0% | 717us | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` |
| 0.0% | 2.3ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 2.3ms | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:491` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `filter` | `[native code]` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 0.0% | 2.2ms | 0.0% | 784us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:706` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` |
| 0.0% | 2.2ms | 0.0% | 0us | `createIdentityMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:31` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:579` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.0% | 2.1ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:555` |
| 0.0% | 1.6ms | 0.0% | 747us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:719` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:734` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:731` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:290` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:332` |
| 0.0% | 1.4ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` |
| 0.0% | 1.4ms | 0.0% | 804us | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:40` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:26` |
| 0.0% | 1.4ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 1.4ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 1.4ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 1.4ms | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 1.4ms | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `reduce` | `[native code]` |
| 0.0% | 1.4ms | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:478` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.0% | 1.0ms | 0.0% | 1.0ms | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:90` |
| 0.0% | 905us | 0.0% | 905us | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 899us | 0.0% | 899us | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:550` |
| 0.0% | 897us | 0.0% | 897us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:740` |
| 0.0% | 896us | 0.0% | 896us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:544` |
| 0.0% | 892us | 0.0% | 892us | `now` | `[native code]` |
| 0.0% | 892us | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:88` |
| 0.0% | 869us | 0.0% | 869us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:584` |
| 0.0% | 865us | 0.0% | 865us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.0% | 860us | 0.0% | 860us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:489` |
| 0.0% | 860us | 0.0% | 860us | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 860us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:487` |
| 0.0% | 846us | 0.0% | 846us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:167` |
| 0.0% | 844us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:447` |
| 0.0% | 824us | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 821us | 0.0% | 821us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:678` |
| 0.0% | 820us | 0.0% | 820us | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:296` |
| 0.0% | 816us | 0.0% | 816us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 808us | 0.0% | 808us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:508` |
| 0.0% | 800us | 0.0% | 800us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 791us | 0.0% | 791us | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 790us | 0.0% | 790us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:472` |
| 0.0% | 788us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:481` |
| 0.0% | 774us | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` |
| 0.0% | 774us | 0.0% | 774us | `min` | `[native code]` |
| 0.0% | 763us | 0.0% | 763us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:618` |
| 0.0% | 732us | 0.0% | 732us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` |
| 0.0% | 724us | 0.0% | 724us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:685` |
| 0.0% | 721us | 0.0% | 721us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:682` |
| 0.0% | 718us | 0.0% | 718us | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:285` |
| 0.0% | 704us | 0.0% | 704us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:520` |
| 0.0% | 704us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:519` |
| 0.0% | 701us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 701us | 0.0% | 701us | `bound call` | `[native code]` |
| 0.0% | 701us | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 701us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 701us | 0.0% | 0us | `internal:primordials` | `internal:primordials:51` |
| 0.0% | 694us | 0.0% | 694us | `slice` | `[native code]` |
| 0.0% | 694us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:492` |
| 0.0% | 681us | 0.0% | 681us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:588` |
| 0.0% | 653us | 0.0% | 653us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:641` |
| 0.0% | 648us | 0.0% | 648us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:150` |
| 0.0% | 634us | 0.0% | 634us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 624us | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:331` |
| 0.0% | 624us | 0.0% | 624us | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |

## Function Details

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` | Self: 42.0% (3.80s) | Total: 43.5% (3.95s) | Samples: 4918

**Called by:**
- `step` (5106)

**Calls:**
- `hypot` (188)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` | Self: 19.5% (1.77s) | Total: 19.5% (1.77s) | Samples: 2309

**Called by:**
- `runTrial` (2299)
- `runTrial` (10)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` | Self: 4.5% (415.6ms) | Total: 4.7% (426.2ms) | Samples: 541

**Called by:**
- `step` (554)

**Calls:**
- `createZeroVector` (10)
- `fill` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` | Self: 3.9% (356.7ms) | Total: 4.2% (386.0ms) | Samples: 459

**Called by:**
- `runTrial` (493)
- `runTrial` (3)

**Calls:**
- `createZeroMatrix` (29)
- `from` (6)
- `createZeroMatrix` (1)
- `createZeroMatrix` (1)

### `mahalanobisSquaredWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:286` | Self: 3.1% (287.9ms) | Total: 3.2% (292.9ms) | Samples: 370

**Called by:**
- `step` (377)

**Calls:**
- `createZeroVector` (5)
- `fill` (2)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` | Self: 2.8% (262.4ms) | Total: 3.4% (309.9ms) | Samples: 340

**Called by:**
- `step` (403)

**Calls:**
- `from` (62)
- `createZeroMatrix` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` | Self: 2.1% (191.7ms) | Total: 2.1% (191.7ms) | Samples: 243

**Called by:**
- `runTrial` (242)
- `runTrial` (1)

### `map`
`[native code]` | Self: 2.0% (185.5ms) | Total: 4.7% (429.1ms) | Samples: 242

**Called by:**
- `cloneMatrix` (127)
- `step` (96)
- `step` (96)
- `step` (88)
- `(anonymous)` (87)
- `(anonymous)` (20)
- `jacobiEigenSymmetric` (12)
- `step` (9)
- `jacobiEigenSymmetric` (7)
- `step` (7)
- `jacobiEigenSymmetric` (3)
- `alignProjectionBasis` (2)
- `step` (1)
- `alignProjectionBasis` (1)
- `CMAESOptimizerND` (1)

**Calls:**
- `(anonymous)` (132)
- `(anonymous)` (87)
- `(anonymous)` (87)
- `abs` (4)
- `(anonymous)` (2)
- `(anonymous)` (1)
- `(anonymous)` (1)
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:686` | Self: 1.9% (175.2ms) | Total: 1.9% (175.2ms) | Samples: 227

**Called by:**
- `runTrial` (225)
- `runTrial` (2)

### `hypot`
`[native code]` | Self: 1.5% (143.9ms) | Total: 1.5% (143.9ms) | Samples: 188

**Called by:**
- `jacobiEigenSymmetric` (188)

### `fill`
`[native code]` | Self: 1.5% (143.0ms) | Total: 1.5% (143.0ms) | Samples: 180

**Called by:**
- `sampleGaussianVectorND` (86)
- `ellipsoidObjective` (56)
- `from` (30)
- `transformFromEigenCoordinates` (3)
- `mahalanobisSquaredWithEigensystem` (2)
- `step` (2)
- `ellipsoidObjective` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.4% (135.9ms) | Total: 2.2% (205.3ms) | Samples: 179

**Called by:**
- `step` (265)

**Calls:**
- `fill` (86)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:683` | Self: 1.4% (130.2ms) | Total: 1.4% (130.2ms) | Samples: 167

**Called by:**
- `runTrial` (166)
- `runTrial` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.2% (116.9ms) | Total: 1.2% (116.9ms) | Samples: 154

**Called by:**
- `map` (132)
- `some` (21)
- `CMAESOptimizerND` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 0.7% (71.6ms) | Total: 0.7% (71.6ms) | Samples: 87

**Called by:**
- `map` (87)

### `requireFiniteVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:397` | Self: 0.7% (68.7ms) | Total: 0.7% (68.7ms) | Samples: 87

**Called by:**
- `projectTo3D` (87)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` | Self: 0.5% (52.5ms) | Total: 0.8% (74.1ms) | Samples: 68

**Called by:**
- `step` (96)

**Calls:**
- `Float64Array` (28)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` | Self: 0.5% (47.0ms) | Total: 0.5% (47.0ms) | Samples: 62

**Called by:**
- `step` (62)

### `from`
`[native code]` | Self: 0.4% (43.8ms) | Total: 1.2% (117.4ms) | Samples: 58

**Called by:**
- `reconstructSymmetric` (62)
- `jacobiEigenSymmetric` (46)
- `createZeroMatrix` (31)
- `jacobiEigenSymmetric` (7)
- `step` (6)
- `CMAESOptimizerND` (1)

**Calls:**
- `(anonymous)` (37)
- `fill` (30)
- `(anonymous)` (27)
- `(anonymous)` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.4% (41.4ms) | Total: 0.8% (76.0ms) | Samples: 55

**Called by:**
- `step` (101)

**Calls:**
- `from` (46)

### `some`
`[native code]` | Self: 0.4% (37.9ms) | Total: 1.2% (109.6ms) | Samples: 49

**Called by:**
- `validateSquareFiniteMatrix` (71)
- `(anonymous)` (67)
- `projectTo3D` (2)
- `some` (1)

**Calls:**
- `(anonymous)` (70)
- `(anonymous)` (21)
- `some` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` | Self: 0.4% (37.6ms) | Total: 0.4% (38.5ms) | Samples: 49

**Called by:**
- `runTrial` (50)

**Calls:**
- `adaptationPoint` (1)

### `sort`
`[native code]` | Self: 0.4% (36.9ms) | Total: 0.4% (45.2ms) | Samples: 50

**Called by:**
- `jacobiEigenSymmetric` (42)
- `step` (19)

**Calls:**
- `(anonymous)` (8)
- `(anonymous)` (3)

### `Float64Array`
`[native code]` | Self: 0.3% (35.1ms) | Total: 0.3% (35.1ms) | Samples: 46

**Called by:**
- `jacobiEigenSymmetric` (28)
- `jacobiEigenSymmetric` (18)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.3% (31.1ms) | Total: 0.3% (31.1ms) | Samples: 41

**Called by:**
- `(anonymous)` (16)
- `step` (13)
- `step` (12)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` | Self: 0.3% (30.3ms) | Total: 1.5% (135.9ms) | Samples: 39

**Called by:**
- `forEach` (174)

**Calls:**
- `projectTo3D` (102)
- `projectTo3D` (16)
- `projectTo3D` (13)
- `projectTo3D` (3)
- `projectTo3D` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` | Self: 0.3% (29.9ms) | Total: 0.3% (30.6ms) | Samples: 39

**Called by:**
- `step` (40)

**Calls:**
- `createZeroVector` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.3% (28.9ms) | Total: 0.3% (28.9ms) | Samples: 37

**Called by:**
- `from` (37)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` | Self: 0.3% (27.2ms) | Total: 0.7% (70.7ms) | Samples: 36

**Called by:**
- `step` (92)

**Calls:**
- `fill` (56)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` | Self: 0.2% (24.0ms) | Total: 0.2% (24.8ms) | Samples: 32

**Called by:**
- `step` (33)

**Calls:**
- `createZeroVector` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.2% (20.6ms) | Total: 0.2% (20.6ms) | Samples: 27

**Called by:**
- `from` (27)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` | Self: 0.2% (18.7ms) | Total: 0.2% (18.7ms) | Samples: 25

**Called by:**
- `runTrial` (24)
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` | Self: 0.1% (16.6ms) | Total: 0.1% (16.6ms) | Samples: 21

**Called by:**
- `runTrial` (21)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:328` | Self: 0.1% (15.2ms) | Total: 0.1% (15.2ms) | Samples: 20

**Called by:**
- `step` (20)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` | Self: 0.1% (13.8ms) | Total: 0.1% (13.8ms) | Samples: 19

**Called by:**
- `transformFromEigenCoordinates` (10)
- `mahalanobisSquaredWithEigensystem` (5)
- `step` (2)
- `whitenWithEigensystem` (1)
- `whitenWithEigensystem` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:625` | Self: 0.1% (12.2ms) | Total: 0.1% (12.2ms) | Samples: 16

**Called by:**
- `runTrial` (16)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:548` | Self: 0.1% (12.2ms) | Total: 0.8% (80.9ms) | Samples: 16

**Called by:**
- `(anonymous)` (102)
- `step` (1)

**Calls:**
- `requireFiniteVector` (87)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:589` | Self: 0.1% (11.3ms) | Total: 0.9% (83.5ms) | Samples: 11

**Called by:**
- `runTrial` (104)
- `runTrial` (1)

**Calls:**
- `ellipsoidObjective` (92)
- `ellipsoidObjective` (2)

### `push`
`[native code]` | Self: 0.0% (8.9ms) | Total: 0.0% (8.9ms) | Samples: 12

**Called by:**
- `step` (11)
- `step` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:558` | Self: 0.0% (7.8ms) | Total: 0.1% (9.9ms) | Samples: 10

**Called by:**
- `(anonymous)` (13)

**Calls:**
- `coordinate` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` | Self: 0.0% (7.3ms) | Total: 0.0% (7.3ms) | Samples: 9

**Called by:**
- `runTrial` (9)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:585` | Self: 0.0% (6.5ms) | Total: 2.6% (237.6ms) | Samples: 9

**Called by:**
- `runTrial` (307)
- `runTrial` (1)

**Calls:**
- `sampleGaussianVectorND` (265)
- `sampleGaussianVectorND` (20)
- `push` (11)
- `sampleGaussianVectorND` (2)
- `sampleGaussianVectorND` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` | Self: 0.0% (6.0ms) | Total: 0.0% (6.0ms) | Samples: 8

**Called by:**
- `sort` (8)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.0% (4.7ms) | Total: 0.1% (13.8ms) | Samples: 6

**Called by:**
- `step` (18)

**Calls:**
- `map` (12)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` | Self: 0.0% (4.7ms) | Total: 3.3% (300.7ms) | Samples: 6

**Called by:**
- `runTrial` (385)
- `runTrial` (2)

**Calls:**
- `mahalanobisSquaredWithEigensystem` (377)
- `mahalanobisSquaredWithEigensystem` (2)
- `mahalanobisSquaredWithEigensystem` (1)
- `mahalanobisSquaredWithEigensystem` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` | Self: 0.0% (4.6ms) | Total: 0.8% (77.8ms) | Samples: 6

**Called by:**
- `runTrial` (101)
- `runTrial` (1)

**Calls:**
- `map` (96)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` | Self: 0.0% (4.5ms) | Total: 0.0% (4.5ms) | Samples: 6

**Called by:**
- `runTrial` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:735` | Self: 0.0% (4.5ms) | Total: 0.0% (4.5ms) | Samples: 6

**Called by:**
- `runTrial` (6)

### `anonymous`
`[native code]` | Self: 0.0% (4.3ms) | Total: 0.2% (18.8ms) | Samples: 6

**Called by:**
- `(anonymous)` (4)
- `get WriteStream` (3)
- `node:fs` (3)
- `internal:fs/streams` (2)
- `internal:stream` (2)
- `internal:streams/pipeline` (2)
- `internal:streams/compose` (2)
- `node:fs/promises` (2)
- `node:stream` (2)
- `node:events` (1)
- `internal:validators` (1)
- `internal:shared` (1)
- `internal:streams/duplex` (1)

**Calls:**
- `node:fs` (3)
- `internal:fs/streams` (2)
- `internal:streams/pipeline` (2)
- `internal:stream` (2)
- `internal:streams/compose` (2)
- `node:fs/promises` (2)
- `node:stream` (2)
- `node:events` (1)
- `internal:validators` (1)
- `internal:shared` (1)
- `internal:streams/duplex` (1)
- `internal:primordials` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` | Self: 0.0% (4.0ms) | Total: 0.0% (4.0ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:741` | Self: 0.0% (3.9ms) | Total: 0.0% (3.9ms) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:651` | Self: 0.0% (3.6ms) | Total: 0.0% (3.6ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` | Self: 0.0% (3.3ms) | Total: 4.7% (432.4ms) | Samples: 4

**Called by:**
- `runTrial` (559)
- `runTrial` (3)

**Calls:**
- `transformFromEigenCoordinates` (554)
- `transformFromEigenCoordinates` (4)

### `forEach`
`[native code]` | Self: 0.0% (3.1ms) | Total: 1.7% (155.7ms) | Samples: 4

**Called by:**
- `step` (195)
- `step` (4)

**Calls:**
- `(anonymous)` (174)
- `(anonymous)` (21)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:730` | Self: 0.0% (3.1ms) | Total: 0.0% (3.1ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `abs`
`[native code]` | Self: 0.0% (3.0ms) | Total: 0.0% (3.0ms) | Samples: 4

**Called by:**
- `map` (4)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (2.8ms) | Total: 0.0% (2.8ms) | Samples: 4

**Called by:**
- `step` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` | Self: 0.0% (2.8ms) | Total: 0.0% (2.8ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (2.4ms) | Total: 0.5% (54.3ms) | Samples: 3

**Called by:**
- `some` (70)

**Calls:**
- `some` (67)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` | Self: 0.0% (2.3ms) | Total: 0.0% (7.7ms) | Samples: 3

**Called by:**
- `runTrial` (10)

**Calls:**
- `map` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:591` | Self: 0.0% (2.3ms) | Total: 0.0% (3.0ms) | Samples: 3

**Called by:**
- `runTrial` (4)

**Calls:**
- `push` (1)

### `filter`
`[native code]` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 3

**Called by:**
- `CMAESOptimizerND` (3)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` | Self: 0.0% (2.2ms) | Total: 0.0% (2.2ms) | Samples: 3

**Called by:**
- `sort` (3)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` | Self: 0.0% (2.2ms) | Total: 0.4% (39.1ms) | Samples: 3

**Called by:**
- `step` (52)

**Calls:**
- `sort` (42)
- `from` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` | Self: 0.0% (2.2ms) | Total: 0.0% (2.2ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` | Self: 0.0% (2.1ms) | Total: 0.0% (2.1ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` | Self: 0.0% (2.1ms) | Total: 0.0% (2.1ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:579` | Self: 0.0% (2.1ms) | Total: 0.0% (2.1ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:588` | Self: 0.0% (2.1ms) | Total: 0.8% (75.0ms) | Samples: 3

**Called by:**
- `runTrial` (99)

**Calls:**
- `map` (96)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` | Self: 0.0% (2.1ms) | Total: 0.0% (2.1ms) | Samples: 1

**Called by:**
- `(module)` (1)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:555` | Self: 0.0% (2.0ms) | Total: 0.0% (2.0ms) | Samples: 3

**Called by:**
- `projectTo3D` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` | Self: 0.0% (1.6ms) | Total: 0.0% (2.5ms) | Samples: 2

**Called by:**
- `runTrial` (3)

**Calls:**
- `radius` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:702` | Self: 0.0% (1.6ms) | Total: 0.1% (17.4ms) | Samples: 2

**Called by:**
- `forEach` (21)
- `map` (1)

**Calls:**
- `map` (20)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:734` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:731` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `mahalanobisSquaredWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:290` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `step` (2)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:332` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `step` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:26` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `step` (1)
- `createIdentityMatrix` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `step` (2)

### `reduce`
`[native code]` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `step` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `map` (2)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:90` | Self: 0.0% (1.0ms) | Total: 0.0% (1.0ms) | Samples: 1

**Called by:**
- `jacobiEigenSymmetric` (1)

### `variancePercent`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (905us) | Total: 0.0% (905us) | Samples: 1

**Called by:**
- `step` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:550` | Self: 0.0% (899us) | Total: 0.0% (899us) | Samples: 1

**Called by:**
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:740` | Self: 0.0% (897us) | Total: 0.0% (897us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `adaptationPoint`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:544` | Self: 0.0% (896us) | Total: 0.0% (896us) | Samples: 1

**Called by:**
- `step` (1)

### `now`
`[native code]` | Self: 0.0% (892us) | Total: 0.0% (892us) | Samples: 1

**Called by:**
- `(module)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:584` | Self: 0.0% (869us) | Total: 0.0% (869us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` | Self: 0.0% (865us) | Total: 0.0% (865us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `radius`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (860us) | Total: 0.0% (860us) | Samples: 1

**Called by:**
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:489` | Self: 0.0% (860us) | Total: 0.0% (860us) | Samples: 1

**Called by:**
- `from` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:167` | Self: 0.0% (846us) | Total: 0.0% (846us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` | Self: 0.0% (845us) | Total: 0.1% (14.8ms) | Samples: 1

**Called by:**
- `runTrial` (20)

**Calls:**
- `sort` (19)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:678` | Self: 0.0% (821us) | Total: 0.0% (821us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `mahalanobisSquaredWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:296` | Self: 0.0% (820us) | Total: 0.0% (820us) | Samples: 1

**Called by:**
- `step` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (816us) | Total: 0.0% (816us) | Samples: 1

**Called by:**
- `step` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:508` | Self: 0.0% (808us) | Total: 0.0% (808us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:40` | Self: 0.0% (804us) | Total: 0.0% (1.4ms) | Samples: 1

**Called by:**
- `step` (2)

**Calls:**
- `fill` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (800us) | Total: 0.0% (800us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (791us) | Total: 0.0% (791us) | Samples: 1

**Called by:**
- `step` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:472` | Self: 0.0% (790us) | Total: 0.0% (790us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` | Self: 0.0% (789us) | Total: 99.3% (9.00s) | Samples: 1

**Called by:**
- `(module)` (10886)
- `(module)` (772)

**Calls:**
- `step` (5457)
- `step` (2299)
- `step` (559)
- `step` (493)
- `step` (402)
- `step` (385)
- `step` (307)
- `step` (242)
- `step` (225)
- `step` (195)
- `step` (166)
- `step` (158)
- `step` (104)
- `step` (101)
- `step` (99)
- `step` (88)
- `step` (76)
- `step` (50)
- `step` (36)
- `step` (24)
- `step` (21)
- `step` (20)
- `step` (16)
- `step` (15)
- `step` (12)
- `step` (10)
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

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:706` | Self: 0.0% (784us) | Total: 0.0% (2.2ms) | Samples: 1

**Called by:**
- `runTrial` (3)

**Calls:**
- `reduce` (2)

### `min`
`[native code]` | Self: 0.0% (774us) | Total: 0.0% (774us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:720` | Self: 0.0% (771us) | Total: 0.1% (11.4ms) | Samples: 1

**Called by:**
- `runTrial` (15)

**Calls:**
- `projectTo3D` (13)
- `projectTo3D` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:618` | Self: 0.0% (763us) | Total: 0.0% (763us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:719` | Self: 0.0% (747us) | Total: 0.0% (1.6ms) | Samples: 1

**Called by:**
- `runTrial` (2)

**Calls:**
- `variancePercent` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` | Self: 0.0% (732us) | Total: 0.0% (732us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:685` | Self: 0.0% (724us) | Total: 0.0% (724us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:682` | Self: 0.0% (721us) | Total: 0.0% (721us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `mahalanobisSquaredWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:285` | Self: 0.0% (718us) | Total: 0.0% (718us) | Samples: 1

**Called by:**
- `step` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` | Self: 0.0% (717us) | Total: 0.0% (2.4ms) | Samples: 1

**Called by:**
- `(anonymous)` (3)

**Calls:**
- `some` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:631` | Self: 0.0% (711us) | Total: 0.6% (57.6ms) | Samples: 1

**Called by:**
- `runTrial` (76)

**Calls:**
- `whitenWithEigensystem` (40)
- `whitenWithEigensystem` (33)
- `whitenWithEigensystem` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:520` | Self: 0.0% (704us) | Total: 0.0% (704us) | Samples: 1

**Called by:**
- `map` (1)

### `bound call`
`[native code]` | Self: 0.0% (701us) | Total: 0.0% (701us) | Samples: 1

**Called by:**
- `internal:primordials` (1)

### `slice`
`[native code]` | Self: 0.0% (694us) | Total: 0.0% (694us) | Samples: 1

**Called by:**
- `CMAESOptimizerND` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:588` | Self: 0.0% (681us) | Total: 0.0% (681us) | Samples: 1

**Called by:**
- `map` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:641` | Self: 0.0% (653us) | Total: 0.0% (653us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:150` | Self: 0.0% (648us) | Total: 0.0% (648us) | Samples: 1

**Called by:**
- `step` (1)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (634us) | Total: 0.0% (634us) | Samples: 1

**Called by:**
- `step` (1)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.0% (628us) | Total: 0.2% (25.1ms) | Samples: 1

**Called by:**
- `step` (29)
- `createIdentityMatrix` (2)
- `reconstructSymmetric` (1)

**Calls:**
- `from` (31)

### `nextHalfOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (624us) | Total: 0.0% (624us) | Samples: 1

**Called by:**
- `sampleGaussianVectorND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` | Self: 0.0% (618us) | Total: 0.0% (3.7ms) | Samples: 1

**Called by:**
- `runTrial` (5)

**Calls:**
- `forEach` (4)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` | Self: 0.0% (0us) | Total: 0.1% (13.5ms) | Samples: 0

**Called by:**
- `step` (18)

**Calls:**
- `Float64Array` (18)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:649` | Self: 0.0% (0us) | Total: 0.7% (65.6ms) | Samples: 0

**Called by:**
- `map` (87)

**Calls:**
- `map` (87)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:478` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `runTrial` (2)

**Calls:**
- `createIdentityMatrix` (2)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (701us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:331` | Self: 0.0% (0us) | Total: 0.0% (624us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `nextHalfOpenUnit` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:729` | Self: 0.0% (0us) | Total: 0.3% (31.1ms) | Samples: 0

**Called by:**
- `runTrial` (36)

**Calls:**
- `cloneMatrix` (35)
- `map` (1)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (0us) | Total: 0.6% (55.1ms) | Samples: 0

**Called by:**
- `jacobiEigenSymmetric` (71)

**Calls:**
- `some` (71)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (701us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (701us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (824us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` | Self: 0.0% (0us) | Total: 0.0% (5.0ms) | Samples: 0

**Calls:**
- `(anonymous)` (7)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` | Self: 0.0% (0us) | Total: 6.6% (605.6ms) | Samples: 0

**Calls:**
- `runTrial` (772)
- `runTrial` (4)
- `runTrial` (1)
- `runTrial` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:481` | Self: 0.0% (0us) | Total: 0.0% (788us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `createIdentityMatrix` (1)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:491` | Self: 0.0% (0us) | Total: 0.0% (2.3ms) | Samples: 0

**Called by:**
- `runTrial` (3)

**Calls:**
- `filter` (3)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (2.1ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:615` | Self: 0.0% (0us) | Total: 0.0% (3.3ms) | Samples: 0

**Called by:**
- `runTrial` (4)

**Calls:**
- `fill` (2)
- `createZeroVector` (2)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:487` | Self: 0.0% (0us) | Total: 0.0% (860us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `from` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` | Self: 0.0% (0us) | Total: 0.0% (6.8ms) | Samples: 0

**Called by:**
- `runTrial` (9)

**Calls:**
- `map` (9)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:648` | Self: 0.0% (0us) | Total: 0.7% (66.3ms) | Samples: 0

**Called by:**
- `runTrial` (88)

**Calls:**
- `map` (88)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:699` | Self: 0.0% (0us) | Total: 1.3% (122.1ms) | Samples: 0

**Called by:**
- `runTrial` (158)

**Calls:**
- `alignProjectionBasis` (62)
- `alignProjectionBasis` (48)
- `alignProjectionBasis` (47)
- `alignProjectionBasis` (1)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` | Self: 0.0% (0us) | Total: 0.1% (9.2ms) | Samples: 0

**Called by:**
- `(module)` (11)
- `(module)` (1)

**Calls:**
- `CMAESOptimizerND` (3)
- `CMAESOptimizerND` (2)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` | Self: 0.0% (0us) | Total: 0.0% (2.4ms) | Samples: 0

**Called by:**
- `step` (3)

**Calls:**
- `map` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` | Self: 0.0% (0us) | Total: 0.0% (774us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `min` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` | Self: 0.0% (0us) | Total: 0.0% (5.4ms) | Samples: 0

**Called by:**
- `step` (7)

**Calls:**
- `map` (7)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` | Self: 0.0% (0us) | Total: 0.6% (56.2ms) | Samples: 0

**Called by:**
- `step` (72)

**Calls:**
- `validateSquareFiniteMatrix` (71)
- `validateSquareFiniteMatrix` (1)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (2.3ms) | Samples: 0

**Called by:**
- `(anonymous)` (3)

**Calls:**
- `anonymous` (3)

### `internal:primordials`
`internal:primordials:51` | Self: 0.0% (0us) | Total: 0.0% (701us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `bound call` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:690` | Self: 0.0% (0us) | Total: 3.4% (310.7ms) | Samples: 0

**Called by:**
- `runTrial` (402)
- `runTrial` (2)

**Calls:**
- `reconstructSymmetric` (403)
- `reconstructSymmetric` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:689` | Self: 0.0% (0us) | Total: 46.7% (4.23s) | Samples: 0

**Called by:**
- `runTrial` (5457)
- `runTrial` (21)

**Calls:**
- `jacobiEigenSymmetric` (5106)
- `jacobiEigenSymmetric` (101)
- `jacobiEigenSymmetric` (96)
- `jacobiEigenSymmetric` (72)
- `jacobiEigenSymmetric` (52)
- `jacobiEigenSymmetric` (18)
- `jacobiEigenSymmetric` (18)
- `jacobiEigenSymmetric` (7)
- `jacobiEigenSymmetric` (3)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:447` | Self: 0.0% (0us) | Total: 0.0% (844us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `(anonymous)` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` | Self: 0.0% (0us) | Total: 93.2% (8.45s) | Samples: 0

**Calls:**
- `runTrial` (10886)
- `runTrial` (45)
- `runTrial` (11)

### `createIdentityMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:31` | Self: 0.0% (0us) | Total: 0.0% (2.2ms) | Samples: 0

**Called by:**
- `CMAESOptimizerND` (2)
- `CMAESOptimizerND` (1)

**Calls:**
- `createZeroMatrix` (2)
- `createZeroMatrix` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:574` | Self: 0.0% (0us) | Total: 0.4% (37.6ms) | Samples: 0

**Called by:**
- `step` (47)

**Calls:**
- `cloneMatrix` (46)
- `map` (1)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 0.0% (0us) | Total: 1.1% (101.9ms) | Samples: 0

**Called by:**
- `alignProjectionBasis` (46)
- `alignProjectionBasis` (46)
- `step` (35)

**Calls:**
- `map` (127)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:721` | Self: 0.0% (0us) | Total: 0.1% (9.0ms) | Samples: 0

**Called by:**
- `runTrial` (12)

**Calls:**
- `projectTo3D` (12)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:701` | Self: 0.0% (0us) | Total: 1.6% (152.5ms) | Samples: 0

**Called by:**
- `runTrial` (195)

**Calls:**
- `forEach` (195)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:519` | Self: 0.0% (0us) | Total: 0.0% (704us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `map` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:88` | Self: 0.0% (0us) | Total: 0.0% (892us) | Samples: 0

**Calls:**
- `now` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` | Self: 0.0% (0us) | Total: 0.4% (38.4ms) | Samples: 0

**Called by:**
- `(module)` (45)
- `(module)` (4)

**Calls:**
- `step` (21)
- `step` (10)
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

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (5.0ms) | Samples: 0

**Called by:**
- `(module)` (7)

**Calls:**
- `anonymous` (4)
- `get WriteStream` (3)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:492` | Self: 0.0% (0us) | Total: 0.0% (694us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `slice` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` | Self: 0.0% (0us) | Total: 0.4% (36.5ms) | Samples: 0

**Called by:**
- `step` (48)

**Calls:**
- `cloneMatrix` (46)
- `map` (2)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 92.4% | 8.38s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 7.2% | 652.8ms | `[native code]` |
| 0.3% | 30.9ms | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
