# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 8.99s | 11664 | 500us | 160 |

**Top 10:** `jacobiEigenSymmetric` 41.5%, `step` 20.3%, `transformFromEigenCoordinates` 4.5%, `step` 3.5%, `mahalanobisSquaredWithEigensystem` 3.3%, `reconstructSymmetric` 2.8%, `map` 2.2%, `step` 2.0%, `step` 1.8%, `hypot` 1.6%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 41.5% | 3.73s | 43.2% | 3.88s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 20.3% | 1.83s | 20.3% | 1.83s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:688` |
| 4.5% | 410.4ms | 4.6% | 422.5ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 3.5% | 323.0ms | 4.0% | 362.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:681` |
| 3.3% | 298.2ms | 3.4% | 305.7ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:286` |
| 2.8% | 254.6ms | 3.3% | 300.7ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` |
| 2.2% | 201.0ms | 4.6% | 416.6ms | `map` | `[native code]` |
| 2.0% | 185.1ms | 2.0% | 185.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:726` |
| 1.8% | 169.7ms | 1.8% | 169.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:701` |
| 1.6% | 151.1ms | 1.6% | 151.1ms | `hypot` | `[native code]` |
| 1.6% | 149.4ms | 1.6% | 149.4ms | `fill` | `[native code]` |
| 1.3% | 122.4ms | 2.2% | 200.5ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.3% | 121.8ms | 1.3% | 121.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:698` |
| 1.2% | 114.7ms | 1.2% | 114.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.8% | 79.5ms | 0.8% | 79.5ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.8% | 78.6ms | 1.0% | 96.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.6% | 54.6ms | 0.6% | 54.6ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:585` |
| 0.5% | 48.7ms | 1.4% | 126.4ms | `some` | `[native code]` |
| 0.5% | 48.5ms | 0.5% | 48.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.5% | 45.6ms | 0.8% | 76.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.4% | 44.5ms | 1.3% | 120.9ms | `from` | `[native code]` |
| 0.4% | 39.0ms | 0.5% | 48.1ms | `sort` | `[native code]` |
| 0.3% | 33.7ms | 1.3% | 124.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:718` |
| 0.3% | 33.6ms | 0.3% | 33.6ms | `Float64Array` | `[native code]` |
| 0.3% | 29.2ms | 0.3% | 29.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.3% | 28.5ms | 0.3% | 29.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` |
| 0.2% | 25.1ms | 0.2% | 25.9ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` |
| 0.2% | 24.6ms | 0.7% | 63.3ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.2% | 22.4ms | 0.2% | 22.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.2% | 21.1ms | 0.2% | 22.0ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 0.2% | 18.4ms | 0.2% | 18.4ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:328` |
| 0.2% | 18.3ms | 0.2% | 18.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` |
| 0.1% | 15.3ms | 0.1% | 15.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:658` |
| 0.1% | 14.1ms | 0.1% | 14.1ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.1% | 12.8ms | 0.1% | 12.8ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:548` |
| 0.1% | 11.9ms | 0.1% | 11.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:640` |
| 0.1% | 11.7ms | 0.1% | 11.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:689` |
| 0.1% | 10.9ms | 0.8% | 74.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:604` |
| 0.0% | 8.7ms | 0.0% | 8.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |
| 0.0% | 8.2ms | 0.0% | 8.2ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 7.6ms | 0.0% | 7.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 5.6ms | 0.0% | 5.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:750` |
| 0.0% | 5.2ms | 0.0% | 5.2ms | `push` | `[native code]` |
| 0.0% | 4.9ms | 0.2% | 20.8ms | `anonymous` | `[native code]` |
| 0.0% | 4.7ms | 3.4% | 311.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:669` |
| 0.0% | 4.1ms | 0.0% | 4.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:732` |
| 0.0% | 4.0ms | 0.0% | 4.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:599` |
| 0.0% | 4.0ms | 0.0% | 4.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:749` |
| 0.0% | 3.8ms | 0.0% | 4.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:621` |
| 0.0% | 3.6ms | 0.0% | 3.6ms | `reduce` | `[native code]` |
| 0.0% | 3.1ms | 0.2% | 20.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:620` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.0% | 2.9ms | 0.0% | 2.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` |
| 0.0% | 2.8ms | 0.0% | 4.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:756` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:685` |
| 0.0% | 2.7ms | 0.0% | 2.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 0.0% | 2.7ms | 2.5% | 226.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:600` |
| 0.0% | 2.5ms | 0.0% | 2.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:573` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:746` |
| 0.0% | 2.3ms | 0.0% | 2.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:734` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `abs` | `[native code]` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 1.5ms | 0.1% | 9.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.5ms | 0.8% | 74.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:602` |
| 0.0% | 1.5ms | 0.7% | 63.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` |
| 0.0% | 1.5ms | 0.4% | 38.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.0% | 1.5ms | 1.5% | 142.0ms | `forEach` | `[native code]` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:638` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:620` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:745` |
| 0.0% | 928us | 0.0% | 928us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:330` |
| 0.0% | 917us | 0.0% | 917us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:709` |
| 0.0% | 913us | 0.0% | 913us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:488` |
| 0.0% | 901us | 0.0% | 901us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:172` |
| 0.0% | 855us | 0.0% | 4.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:721` |
| 0.0% | 842us | 0.0% | 842us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:594` |
| 0.0% | 838us | 3.3% | 302.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:705` |
| 0.0% | 830us | 0.0% | 6.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:739` |
| 0.0% | 829us | 0.3% | 29.4ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.0% | 814us | 0.0% | 4.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:736` |
| 0.0% | 804us | 0.0% | 804us | `createIdentityMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:31` |
| 0.0% | 792us | 0.0% | 792us | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 786us | 0.0% | 786us | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 774us | 0.0% | 774us | `exp` | `[native code]` |
| 0.0% | 754us | 0.0% | 754us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 752us | 0.5% | 50.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:646` |
| 0.0% | 752us | 0.0% | 752us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:152` |
| 0.0% | 752us | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:708` |
| 0.0% | 745us | 0.0% | 745us | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:274` |
| 0.0% | 741us | 99.5% | 8.94s | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 0.0% | 733us | 0.0% | 733us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:252` |
| 0.0% | 724us | 0.7% | 63.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 0.0% | 707us | 1.1% | 105.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:714` |
| 0.0% | 702us | 0.0% | 702us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:164` |
| 0.0% | 699us | 0.0% | 699us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.0% | 699us | 0.1% | 16.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` |
| 0.0% | 674us | 0.0% | 674us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:755` |
| 0.0% | 664us | 0.0% | 664us | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 660us | 0.0% | 660us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:544` |
| 0.0% | 651us | 0.0% | 651us | `max` | `[native code]` |
| 0.0% | 650us | 0.0% | 650us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` |
| 0.0% | 648us | 0.0% | 2.1ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` |
| 0.0% | 644us | 0.8% | 75.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:603` |
| 0.0% | 643us | 0.0% | 643us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 641us | 0.0% | 641us | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:567` |
| 0.0% | 641us | 0.0% | 641us | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 640us | 0.0% | 640us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:694` |
| 0.0% | 638us | 0.0% | 638us | `getHighWaterMark` | `internal:streams/state:24` |
| 0.0% | 637us | 0.0% | 637us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:193` |
| 0.0% | 632us | 0.0% | 632us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:656` |
| 0.0% | 629us | 0.0% | 629us | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:285` |
| 0.0% | 617us | 0.0% | 617us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:710` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 99.5% | 8.94s | 0.0% | 741us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 93.2% | 8.38s | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` |
| 46.7% | 4.20s | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:704` |
| 43.2% | 3.88s | 41.5% | 3.73s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 20.3% | 1.83s | 20.3% | 1.83s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:688` |
| 6.6% | 596.8ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` |
| 4.7% | 431.4ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:601` |
| 4.6% | 422.5ms | 4.5% | 410.4ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 4.6% | 416.6ms | 2.2% | 201.0ms | `map` | `[native code]` |
| 4.0% | 362.0ms | 3.5% | 323.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:681` |
| 3.4% | 311.0ms | 0.0% | 4.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:669` |
| 3.4% | 305.7ms | 3.3% | 298.2ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:286` |
| 3.3% | 302.3ms | 0.0% | 838us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:705` |
| 3.3% | 300.7ms | 2.8% | 254.6ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` |
| 2.5% | 226.4ms | 0.0% | 2.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:600` |
| 2.2% | 200.5ms | 1.3% | 122.4ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 2.0% | 185.1ms | 2.0% | 185.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:726` |
| 1.8% | 169.7ms | 1.8% | 169.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:701` |
| 1.6% | 151.1ms | 1.6% | 151.1ms | `hypot` | `[native code]` |
| 1.6% | 149.4ms | 1.6% | 149.4ms | `fill` | `[native code]` |
| 1.5% | 142.0ms | 0.0% | 1.5ms | `forEach` | `[native code]` |
| 1.5% | 141.1ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:716` |
| 1.4% | 126.4ms | 0.5% | 48.7ms | `some` | `[native code]` |
| 1.3% | 124.7ms | 0.3% | 33.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:718` |
| 1.3% | 121.8ms | 1.3% | 121.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:698` |
| 1.3% | 120.9ms | 0.4% | 44.5ms | `from` | `[native code]` |
| 1.2% | 114.7ms | 1.2% | 114.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.1% | 105.0ms | 0.0% | 707us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:714` |
| 1.0% | 96.8ms | 0.8% | 78.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.9% | 89.0ms | 0.0% | 0us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.8% | 79.5ms | 0.8% | 79.5ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.8% | 76.8ms | 0.5% | 45.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.8% | 75.3ms | 0.0% | 644us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:603` |
| 0.8% | 74.2ms | 0.1% | 10.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:604` |
| 0.8% | 74.2ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:602` |
| 0.7% | 67.0ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:663` |
| 0.7% | 63.9ms | 0.0% | 724us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 0.7% | 63.3ms | 0.2% | 24.6ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.7% | 63.2ms | 0.0% | 1.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.7% | 63.2ms | 0.0% | 0us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.6% | 60.8ms | 0.0% | 0us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:664` |
| 0.6% | 54.6ms | 0.6% | 54.6ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:585` |
| 0.5% | 50.2ms | 0.0% | 752us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:646` |
| 0.5% | 49.0ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` |
| 0.5% | 48.5ms | 0.5% | 48.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.5% | 48.1ms | 0.4% | 39.0ms | `sort` | `[native code]` |
| 0.4% | 43.7ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:744` |
| 0.4% | 38.4ms | 0.0% | 1.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.3% | 33.6ms | 0.3% | 33.6ms | `Float64Array` | `[native code]` |
| 0.3% | 31.8ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` |
| 0.3% | 29.4ms | 0.0% | 829us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.3% | 29.2ms | 0.3% | 29.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.3% | 29.2ms | 0.3% | 28.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` |
| 0.2% | 25.9ms | 0.2% | 25.1ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` |
| 0.2% | 22.4ms | 0.2% | 22.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.2% | 22.0ms | 0.2% | 21.1ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 0.2% | 20.8ms | 0.0% | 4.9ms | `anonymous` | `[native code]` |
| 0.2% | 20.0ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:620` |
| 0.2% | 18.4ms | 0.2% | 18.4ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:328` |
| 0.2% | 18.3ms | 0.2% | 18.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` |
| 0.1% | 16.4ms | 0.0% | 699us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` |
| 0.1% | 15.5ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 0.1% | 15.3ms | 0.1% | 15.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:658` |
| 0.1% | 14.1ms | 0.1% | 14.1ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.1% | 12.8ms | 0.1% | 12.8ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:548` |
| 0.1% | 11.9ms | 0.1% | 11.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:640` |
| 0.1% | 11.7ms | 0.1% | 11.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:689` |
| 0.1% | 9.9ms | 0.0% | 1.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.1% | 9.4ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` |
| 0.0% | 8.7ms | 0.0% | 8.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |
| 0.0% | 8.2ms | 0.0% | 8.2ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 7.6ms | 0.0% | 7.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 6.4ms | 0.0% | 830us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:739` |
| 0.0% | 6.3ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 5.6ms | 0.0% | 5.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:750` |
| 0.0% | 5.5ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.0% | 5.5ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.0% | 5.4ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` |
| 0.0% | 5.2ms | 0.0% | 5.2ms | `push` | `[native code]` |
| 0.0% | 4.7ms | 0.0% | 814us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:736` |
| 0.0% | 4.7ms | 0.0% | 3.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:621` |
| 0.0% | 4.4ms | 0.0% | 855us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:721` |
| 0.0% | 4.4ms | 0.0% | 2.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:756` |
| 0.0% | 4.2ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:735` |
| 0.0% | 4.1ms | 0.0% | 4.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:732` |
| 0.0% | 4.0ms | 0.0% | 4.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:599` |
| 0.0% | 4.0ms | 0.0% | 4.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:749` |
| 0.0% | 3.6ms | 0.0% | 3.6ms | `reduce` | `[native code]` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.0% | 2.9ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:734` |
| 0.0% | 2.9ms | 0.0% | 2.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:685` |
| 0.0% | 2.7ms | 0.0% | 2.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 0.0% | 2.5ms | 0.0% | 2.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:573` |
| 0.0% | 2.4ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:746` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `abs` | `[native code]` |
| 0.0% | 2.1ms | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:493` |
| 0.0% | 2.1ms | 0.0% | 648us | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` |
| 0.0% | 1.6ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 1.6ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 1.6ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 1.6ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 1.6ms | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 1.5ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` |
| 0.0% | 1.5ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` |
| 0.0% | 1.5ms | 0.0% | 752us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:708` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:638` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:620` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:745` |
| 0.0% | 928us | 0.0% | 928us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:330` |
| 0.0% | 917us | 0.0% | 917us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:709` |
| 0.0% | 913us | 0.0% | 913us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:488` |
| 0.0% | 901us | 0.0% | 901us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:172` |
| 0.0% | 892us | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:93` |
| 0.0% | 883us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 883us | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 883us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 874us | 0.0% | 0us | `node:fs` | `node:fs:299` |
| 0.0% | 868us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:480` |
| 0.0% | 865us | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 865us | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 842us | 0.0% | 842us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:594` |
| 0.0% | 804us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:478` |
| 0.0% | 804us | 0.0% | 804us | `createIdentityMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:31` |
| 0.0% | 792us | 0.0% | 792us | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 786us | 0.0% | 786us | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 774us | 0.0% | 774us | `exp` | `[native code]` |
| 0.0% | 754us | 0.0% | 754us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 752us | 0.0% | 752us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:152` |
| 0.0% | 745us | 0.0% | 745us | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:274` |
| 0.0% | 733us | 0.0% | 733us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:252` |
| 0.0% | 702us | 0.0% | 702us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:164` |
| 0.0% | 699us | 0.0% | 699us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.0% | 674us | 0.0% | 674us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:755` |
| 0.0% | 664us | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:730` |
| 0.0% | 664us | 0.0% | 664us | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 660us | 0.0% | 660us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:544` |
| 0.0% | 651us | 0.0% | 651us | `max` | `[native code]` |
| 0.0% | 650us | 0.0% | 650us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` |
| 0.0% | 648us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:487` |
| 0.0% | 643us | 0.0% | 643us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 641us | 0.0% | 641us | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:567` |
| 0.0% | 641us | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:630` |
| 0.0% | 641us | 0.0% | 641us | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 640us | 0.0% | 640us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:694` |
| 0.0% | 638us | 0.0% | 0us | `WriteStream` | `internal:fs/streams:259` |
| 0.0% | 638us | 0.0% | 638us | `getHighWaterMark` | `internal:streams/state:24` |
| 0.0% | 638us | 0.0% | 0us | `Writable` | `internal:streams/writable:181` |
| 0.0% | 638us | 0.0% | 0us | `WritableState` | `internal:streams/writable:139` |
| 0.0% | 637us | 0.0% | 637us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:193` |
| 0.0% | 632us | 0.0% | 632us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:656` |
| 0.0% | 629us | 0.0% | 629us | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:285` |
| 0.0% | 617us | 0.0% | 617us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:710` |

## Function Details

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` | Self: 41.5% (3.73s) | Total: 43.2% (3.88s) | Samples: 4843

**Called by:**
- `step` (5037)

**Calls:**
- `hypot` (194)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:688` | Self: 20.3% (1.83s) | Total: 20.3% (1.83s) | Samples: 2385

**Called by:**
- `runTrial` (2376)
- `runTrial` (9)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` | Self: 4.5% (410.4ms) | Total: 4.6% (422.5ms) | Samples: 532

**Called by:**
- `step` (548)

**Calls:**
- `createZeroVector` (10)
- `fill` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:681` | Self: 3.5% (323.0ms) | Total: 4.0% (362.0ms) | Samples: 422

**Called by:**
- `runTrial` (472)
- `runTrial` (1)

**Calls:**
- `createZeroMatrix` (38)
- `from` (11)
- `createZeroMatrix` (2)

### `mahalanobisSquaredWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:286` | Self: 3.3% (298.2ms) | Total: 3.4% (305.7ms) | Samples: 389

**Called by:**
- `step` (398)

**Calls:**
- `createZeroVector` (6)
- `fill` (3)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` | Self: 2.8% (254.6ms) | Total: 3.3% (300.7ms) | Samples: 331

**Called by:**
- `step` (391)

**Calls:**
- `from` (59)
- `createZeroMatrix` (1)

### `map`
`[native code]` | Self: 2.2% (201.0ms) | Total: 4.6% (416.6ms) | Samples: 259

**Called by:**
- `cloneMatrix` (112)
- `step` (97)
- `step` (94)
- `step` (88)
- `(anonymous)` (80)
- `(anonymous)` (21)
- `step` (13)
- `jacobiEigenSymmetric` (10)
- `jacobiEigenSymmetric` (8)
- `step` (7)
- `step` (4)
- `jacobiEigenSymmetric` (2)
- `alignProjectionBasis` (1)
- `CMAESOptimizerND` (1)

**Calls:**
- `(anonymous)` (131)
- `(anonymous)` (80)
- `(anonymous)` (60)
- `(anonymous)` (4)
- `abs` (3)
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:726` | Self: 2.0% (185.1ms) | Total: 2.0% (185.1ms) | Samples: 237

**Called by:**
- `runTrial` (235)
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:701` | Self: 1.8% (169.7ms) | Total: 1.8% (169.7ms) | Samples: 223

**Called by:**
- `runTrial` (222)
- `runTrial` (1)

### `hypot`
`[native code]` | Self: 1.6% (151.1ms) | Total: 1.6% (151.1ms) | Samples: 194

**Called by:**
- `jacobiEigenSymmetric` (194)

### `fill`
`[native code]` | Self: 1.6% (149.4ms) | Total: 1.6% (149.4ms) | Samples: 193

**Called by:**
- `sampleGaussianVectorND` (101)
- `ellipsoidObjective` (50)
- `from` (31)
- `transformFromEigenCoordinates` (6)
- `mahalanobisSquaredWithEigensystem` (3)
- `CMAESOptimizerND` (1)
- `step` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.3% (122.4ms) | Total: 2.2% (200.5ms) | Samples: 160

**Called by:**
- `step` (261)

**Calls:**
- `fill` (101)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:698` | Self: 1.3% (121.8ms) | Total: 1.3% (121.8ms) | Samples: 159

**Called by:**
- `runTrial` (159)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.2% (114.7ms) | Total: 1.2% (114.7ms) | Samples: 150

**Called by:**
- `map` (131)
- `some` (18)
- `from` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.8% (79.5ms) | Total: 0.8% (79.5ms) | Samples: 106

**Called by:**
- `(anonymous)` (95)
- `step` (6)
- `step` (5)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` | Self: 0.8% (78.6ms) | Total: 1.0% (96.8ms) | Samples: 102

**Called by:**
- `step` (125)

**Calls:**
- `Float64Array` (23)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:585` | Self: 0.6% (54.6ms) | Total: 0.6% (54.6ms) | Samples: 70

**Called by:**
- `step` (70)

### `some`
`[native code]` | Self: 0.5% (48.7ms) | Total: 1.4% (126.4ms) | Samples: 63

**Called by:**
- `validateSquareFiniteMatrix` (82)
- `(anonymous)` (80)
- `projectTo3D` (2)

**Calls:**
- `(anonymous)` (82)
- `(anonymous)` (18)
- `(anonymous)` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 0.5% (48.5ms) | Total: 0.5% (48.5ms) | Samples: 60

**Called by:**
- `map` (60)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.5% (45.6ms) | Total: 0.8% (76.8ms) | Samples: 61

**Called by:**
- `step` (101)

**Calls:**
- `from` (40)

### `from`
`[native code]` | Self: 0.4% (44.5ms) | Total: 1.3% (120.9ms) | Samples: 59

**Called by:**
- `reconstructSymmetric` (59)
- `jacobiEigenSymmetric` (40)
- `createZeroMatrix` (38)
- `step` (11)
- `jacobiEigenSymmetric` (9)
- `CMAESOptimizerND` (1)

**Calls:**
- `(anonymous)` (39)
- `fill` (31)
- `(anonymous)` (28)
- `(anonymous)` (1)

### `sort`
`[native code]` | Self: 0.4% (39.0ms) | Total: 0.5% (48.1ms) | Samples: 49

**Called by:**
- `jacobiEigenSymmetric` (39)
- `step` (21)
- `(module)` (1)

**Calls:**
- `(anonymous)` (10)
- `(anonymous)` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:718` | Self: 0.3% (33.7ms) | Total: 1.3% (124.7ms) | Samples: 45

**Called by:**
- `forEach` (166)

**Calls:**
- `projectTo3D` (95)
- `projectTo3D` (17)
- `projectTo3D` (3)
- `projectTo3D` (3)
- `projectTo3D` (2)
- `projectTo3D` (1)

### `Float64Array`
`[native code]` | Self: 0.3% (33.6ms) | Total: 0.3% (33.6ms) | Samples: 44

**Called by:**
- `jacobiEigenSymmetric` (23)
- `jacobiEigenSymmetric` (21)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.3% (29.2ms) | Total: 0.3% (29.2ms) | Samples: 39

**Called by:**
- `from` (39)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` | Self: 0.3% (28.5ms) | Total: 0.3% (29.2ms) | Samples: 37

**Called by:**
- `runTrial` (38)

**Calls:**
- `adaptationPoint` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` | Self: 0.2% (25.1ms) | Total: 0.2% (25.9ms) | Samples: 33

**Called by:**
- `step` (34)

**Calls:**
- `createZeroVector` (1)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` | Self: 0.2% (24.6ms) | Total: 0.7% (63.3ms) | Samples: 33

**Called by:**
- `step` (83)

**Calls:**
- `fill` (50)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.2% (22.4ms) | Total: 0.2% (22.4ms) | Samples: 28

**Called by:**
- `from` (28)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` | Self: 0.2% (21.1ms) | Total: 0.2% (22.0ms) | Samples: 28

**Called by:**
- `step` (29)

**Calls:**
- `createZeroVector` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:328` | Self: 0.2% (18.4ms) | Total: 0.2% (18.4ms) | Samples: 24

**Called by:**
- `step` (24)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` | Self: 0.2% (18.3ms) | Total: 0.2% (18.3ms) | Samples: 24

**Called by:**
- `runTrial` (24)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:658` | Self: 0.1% (15.3ms) | Total: 0.1% (15.3ms) | Samples: 20

**Called by:**
- `runTrial` (20)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` | Self: 0.1% (14.1ms) | Total: 0.1% (14.1ms) | Samples: 18

**Called by:**
- `transformFromEigenCoordinates` (10)
- `mahalanobisSquaredWithEigensystem` (6)
- `whitenWithEigensystem` (1)
- `whitenWithEigensystem` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:548` | Self: 0.1% (12.8ms) | Total: 0.1% (12.8ms) | Samples: 17

**Called by:**
- `(anonymous)` (17)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:640` | Self: 0.1% (11.9ms) | Total: 0.1% (11.9ms) | Samples: 16

**Called by:**
- `runTrial` (16)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:689` | Self: 0.1% (11.7ms) | Total: 0.1% (11.7ms) | Samples: 14

**Called by:**
- `runTrial` (14)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:604` | Self: 0.1% (10.9ms) | Total: 0.8% (74.2ms) | Samples: 12

**Called by:**
- `runTrial` (95)

**Calls:**
- `ellipsoidObjective` (83)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` | Self: 0.0% (8.7ms) | Total: 0.0% (8.7ms) | Samples: 7

**Called by:**
- `runTrial` (7)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (8.2ms) | Total: 0.0% (8.2ms) | Samples: 10

**Called by:**
- `step` (10)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` | Self: 0.0% (7.6ms) | Total: 0.0% (7.6ms) | Samples: 10

**Called by:**
- `sort` (10)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:750` | Self: 0.0% (5.6ms) | Total: 0.0% (5.6ms) | Samples: 7

**Called by:**
- `runTrial` (7)

### `push`
`[native code]` | Self: 0.0% (5.2ms) | Total: 0.0% (5.2ms) | Samples: 7

**Called by:**
- `step` (5)
- `step` (2)

### `anonymous`
`[native code]` | Self: 0.0% (4.9ms) | Total: 0.2% (20.8ms) | Samples: 6

**Called by:**
- `(anonymous)` (4)
- `node:fs` (3)
- `internal:fs/streams` (2)
- `get WriteStream` (2)
- `internal:stream` (2)
- `internal:streams/compose` (2)
- `node:fs/promises` (2)
- `node:stream` (2)
- `node:events` (1)
- `internal:validators` (1)
- `node:fs` (1)
- `internal:streams/pipeline` (1)
- `internal:shared` (1)
- `internal:streams/duplex` (1)

**Calls:**
- `node:fs` (3)
- `internal:fs/streams` (2)
- `internal:stream` (2)
- `internal:streams/compose` (2)
- `node:fs/promises` (2)
- `node:stream` (2)
- `node:events` (1)
- `internal:streams/pipeline` (1)
- `node:fs` (1)
- `internal:validators` (1)
- `internal:shared` (1)
- `internal:streams/duplex` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:669` | Self: 0.0% (4.7ms) | Total: 3.4% (311.0ms) | Samples: 6

**Called by:**
- `runTrial` (405)

**Calls:**
- `mahalanobisSquaredWithEigensystem` (398)
- `mahalanobisSquaredWithEigensystem` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:732` | Self: 0.0% (4.1ms) | Total: 0.0% (4.1ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:599` | Self: 0.0% (4.0ms) | Total: 0.0% (4.0ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:749` | Self: 0.0% (4.0ms) | Total: 0.0% (4.0ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:621` | Self: 0.0% (3.8ms) | Total: 0.0% (4.7ms) | Samples: 1

**Called by:**
- `runTrial` (2)

**Calls:**
- `forEach` (1)

### `reduce`
`[native code]` | Self: 0.0% (3.6ms) | Total: 0.0% (3.6ms) | Samples: 5

**Called by:**
- `step` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:620` | Self: 0.0% (3.1ms) | Total: 0.2% (20.0ms) | Samples: 4

**Called by:**
- `runTrial` (25)

**Calls:**
- `sort` (21)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` | Self: 0.0% (3.0ms) | Total: 0.0% (3.0ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` | Self: 0.0% (2.9ms) | Total: 0.0% (2.9ms) | Samples: 4

**Called by:**
- `map` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:756` | Self: 0.0% (2.8ms) | Total: 0.0% (4.4ms) | Samples: 4

**Called by:**
- `runTrial` (6)

**Calls:**
- `push` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:685` | Self: 0.0% (2.8ms) | Total: 0.0% (2.8ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` | Self: 0.0% (2.7ms) | Total: 0.0% (2.7ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:600` | Self: 0.0% (2.7ms) | Total: 2.5% (226.4ms) | Samples: 4

**Called by:**
- `runTrial` (293)
- `runTrial` (2)

**Calls:**
- `sampleGaussianVectorND` (261)
- `sampleGaussianVectorND` (24)
- `push` (5)
- `sampleGaussianVectorND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` | Self: 0.0% (2.5ms) | Total: 0.0% (2.5ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:573` | Self: 0.0% (2.4ms) | Total: 0.0% (2.4ms) | Samples: 3

**Called by:**
- `(anonymous)` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:746` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:734` | Self: 0.0% (2.3ms) | Total: 0.0% (2.9ms) | Samples: 3

**Called by:**
- `runTrial` (4)

**Calls:**
- `variancePercent` (1)

### `abs`
`[native code]` | Self: 0.0% (2.2ms) | Total: 0.0% (2.2ms) | Samples: 3

**Called by:**
- `map` (3)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 2

**Called by:**
- `step` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.0% (1.5ms) | Total: 0.1% (9.9ms) | Samples: 2

**Called by:**
- `step` (13)

**Calls:**
- `map` (10)
- `max` (1)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:602` | Self: 0.0% (1.5ms) | Total: 0.8% (74.2ms) | Samples: 2

**Called by:**
- `runTrial` (96)

**Calls:**
- `map` (94)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (1.5ms) | Total: 0.7% (63.2ms) | Samples: 2

**Called by:**
- `some` (82)

**Calls:**
- `some` (80)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` | Self: 0.0% (1.5ms) | Total: 0.4% (38.4ms) | Samples: 2

**Called by:**
- `step` (50)

**Calls:**
- `sort` (39)
- `from` (9)

### `forEach`
`[native code]` | Self: 0.0% (1.5ms) | Total: 1.5% (142.0ms) | Samples: 2

**Called by:**
- `step` (188)
- `step` (1)

**Calls:**
- `(anonymous)` (166)
- `(anonymous)` (21)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `(anonymous)` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:638` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:620` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `sort` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:745` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:330` | Self: 0.0% (928us) | Total: 0.0% (928us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:709` | Self: 0.0% (917us) | Total: 0.0% (917us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:488` | Self: 0.0% (913us) | Total: 0.0% (913us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:172` | Self: 0.0% (901us) | Total: 0.0% (901us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:721` | Self: 0.0% (855us) | Total: 0.0% (4.4ms) | Samples: 1

**Called by:**
- `runTrial` (6)

**Calls:**
- `reduce` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:594` | Self: 0.0% (842us) | Total: 0.0% (842us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:705` | Self: 0.0% (838us) | Total: 3.3% (302.3ms) | Samples: 1

**Called by:**
- `runTrial` (393)

**Calls:**
- `reconstructSymmetric` (391)
- `reconstructSymmetric` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:739` | Self: 0.0% (830us) | Total: 0.0% (6.4ms) | Samples: 1

**Called by:**
- `runTrial` (8)

**Calls:**
- `map` (7)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.0% (829us) | Total: 0.3% (29.4ms) | Samples: 1

**Called by:**
- `step` (38)
- `reconstructSymmetric` (1)

**Calls:**
- `from` (38)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:736` | Self: 0.0% (814us) | Total: 0.0% (4.7ms) | Samples: 1

**Called by:**
- `runTrial` (6)

**Calls:**
- `projectTo3D` (5)

### `createIdentityMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:31` | Self: 0.0% (804us) | Total: 0.0% (804us) | Samples: 1

**Called by:**
- `CMAESOptimizerND` (1)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (792us) | Total: 0.0% (792us) | Samples: 1

**Called by:**
- `step` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (786us) | Total: 0.0% (786us) | Samples: 1

**Called by:**
- `step` (1)

### `exp`
`[native code]` | Self: 0.0% (774us) | Total: 0.0% (774us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (754us) | Total: 0.0% (754us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:646` | Self: 0.0% (752us) | Total: 0.5% (50.2ms) | Samples: 1

**Called by:**
- `runTrial` (65)
- `runTrial` (1)

**Calls:**
- `whitenWithEigensystem` (34)
- `whitenWithEigensystem` (29)
- `whitenWithEigensystem` (1)
- `whitenWithEigensystem` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:152` | Self: 0.0% (752us) | Total: 0.0% (752us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:708` | Self: 0.0% (752us) | Total: 0.0% (1.5ms) | Samples: 1

**Called by:**
- `runTrial` (2)

**Calls:**
- `exp` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:274` | Self: 0.0% (745us) | Total: 0.0% (745us) | Samples: 1

**Called by:**
- `step` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` | Self: 0.0% (741us) | Total: 99.5% (8.94s) | Samples: 1

**Called by:**
- `(module)` (10849)
- `(module)` (758)

**Calls:**
- `step` (5424)
- `step` (2376)
- `step` (557)
- `step` (472)
- `step` (405)
- `step` (393)
- `step` (293)
- `step` (235)
- `step` (222)
- `step` (188)
- `step` (159)
- `step` (136)
- `step` (98)
- `step` (96)
- `step` (95)
- `step` (87)
- `step` (65)
- `step` (53)
- `step` (38)
- `step` (25)
- `step` (24)
- `step` (20)
- `step` (16)
- `step` (14)
- `step` (13)
- `step` (8)
- `step` (7)
- `step` (7)
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

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:252` | Self: 0.0% (733us) | Total: 0.0% (733us) | Samples: 1

**Called by:**
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` | Self: 0.0% (724us) | Total: 0.7% (63.9ms) | Samples: 1

**Called by:**
- `step` (83)

**Calls:**
- `validateSquareFiniteMatrix` (82)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:714` | Self: 0.0% (707us) | Total: 1.1% (105.0ms) | Samples: 1

**Called by:**
- `runTrial` (136)

**Calls:**
- `alignProjectionBasis` (70)
- `alignProjectionBasis` (64)
- `alignProjectionBasis` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:164` | Self: 0.0% (702us) | Total: 0.0% (702us) | Samples: 1

**Called by:**
- `step` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` | Self: 0.0% (699us) | Total: 0.0% (699us) | Samples: 1

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` | Self: 0.0% (699us) | Total: 0.1% (16.4ms) | Samples: 1

**Called by:**
- `forEach` (21)
- `map` (1)

**Calls:**
- `map` (21)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:755` | Self: 0.0% (674us) | Total: 0.0% (674us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `radius`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (664us) | Total: 0.0% (664us) | Samples: 1

**Called by:**
- `step` (1)

### `adaptationPoint`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:544` | Self: 0.0% (660us) | Total: 0.0% (660us) | Samples: 1

**Called by:**
- `step` (1)

### `max`
`[native code]` | Self: 0.0% (651us) | Total: 0.0% (651us) | Samples: 1

**Called by:**
- `jacobiEigenSymmetric` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` | Self: 0.0% (650us) | Total: 0.0% (650us) | Samples: 1

**Called by:**
- `some` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` | Self: 0.0% (648us) | Total: 0.0% (2.1ms) | Samples: 1

**Called by:**
- `(anonymous)` (3)

**Calls:**
- `some` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:603` | Self: 0.0% (644us) | Total: 0.8% (75.3ms) | Samples: 1

**Called by:**
- `runTrial` (98)

**Calls:**
- `map` (97)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (643us) | Total: 0.0% (643us) | Samples: 1

**Called by:**
- `step` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:567` | Self: 0.0% (641us) | Total: 0.0% (641us) | Samples: 1

**Called by:**
- `(anonymous)` (1)

### `variancePercent`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (641us) | Total: 0.0% (641us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:694` | Self: 0.0% (640us) | Total: 0.0% (640us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `getHighWaterMark`
`internal:streams/state:24` | Self: 0.0% (638us) | Total: 0.0% (638us) | Samples: 1

**Called by:**
- `WritableState` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:193` | Self: 0.0% (637us) | Total: 0.0% (637us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:656` | Self: 0.0% (632us) | Total: 0.0% (632us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `mahalanobisSquaredWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:285` | Self: 0.0% (629us) | Total: 0.0% (629us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:710` | Self: 0.0% (617us) | Total: 0.0% (617us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` | Self: 0.0% (0us) | Total: 0.1% (15.5ms) | Samples: 0

**Called by:**
- `step` (21)

**Calls:**
- `Float64Array` (21)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:716` | Self: 0.0% (0us) | Total: 1.5% (141.1ms) | Samples: 0

**Called by:**
- `runTrial` (188)

**Calls:**
- `forEach` (188)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (883us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `Writable`
`internal:streams/writable:181` | Self: 0.0% (0us) | Total: 0.0% (638us) | Samples: 0

**Called by:**
- `WriteStream` (1)

**Calls:**
- `WritableState` (1)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (883us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:478` | Self: 0.0% (0us) | Total: 0.0% (804us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `createIdentityMatrix` (1)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (0us) | Total: 0.7% (63.2ms) | Samples: 0

**Called by:**
- `jacobiEigenSymmetric` (82)

**Calls:**
- `some` (82)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (883us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (2.4ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` | Self: 0.0% (0us) | Total: 6.6% (596.8ms) | Samples: 0

**Calls:**
- `runTrial` (758)
- `runTrial` (6)
- `runTrial` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` | Self: 0.0% (0us) | Total: 0.5% (49.0ms) | Samples: 0

**Called by:**
- `step` (64)

**Calls:**
- `cloneMatrix` (63)
- `map` (1)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` | Self: 0.0% (0us) | Total: 0.0% (5.5ms) | Samples: 0

**Calls:**
- `(anonymous)` (7)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `step` (2)

**Calls:**
- `map` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:704` | Self: 0.0% (0us) | Total: 46.7% (4.20s) | Samples: 0

**Called by:**
- `runTrial` (5424)
- `runTrial` (24)

**Calls:**
- `jacobiEigenSymmetric` (5037)
- `jacobiEigenSymmetric` (125)
- `jacobiEigenSymmetric` (101)
- `jacobiEigenSymmetric` (83)
- `jacobiEigenSymmetric` (50)
- `jacobiEigenSymmetric` (21)
- `jacobiEigenSymmetric` (13)
- `jacobiEigenSymmetric` (8)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:480` | Self: 0.0% (0us) | Total: 0.0% (868us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `fill` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:730` | Self: 0.0% (0us) | Total: 0.0% (664us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `radius` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:487` | Self: 0.0% (0us) | Total: 0.0% (648us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `from` (1)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` | Self: 0.0% (0us) | Total: 0.0% (5.4ms) | Samples: 0

**Called by:**
- `(module)` (4)
- `(module)` (1)

**Calls:**
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` | Self: 0.0% (0us) | Total: 0.0% (6.3ms) | Samples: 0

**Called by:**
- `step` (8)

**Calls:**
- `map` (8)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` | Self: 0.0% (0us) | Total: 0.1% (9.4ms) | Samples: 0

**Called by:**
- `runTrial` (13)

**Calls:**
- `map` (13)

### `WriteStream`
`internal:fs/streams:259` | Self: 0.0% (0us) | Total: 0.0% (638us) | Samples: 0

**Called by:**
- `(anonymous)` (1)

**Calls:**
- `Writable` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:735` | Self: 0.0% (0us) | Total: 0.0% (4.2ms) | Samples: 0

**Called by:**
- `runTrial` (6)

**Calls:**
- `projectTo3D` (6)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:93` | Self: 0.0% (0us) | Total: 0.0% (892us) | Samples: 0

**Calls:**
- `sort` (1)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (5.5ms) | Samples: 0

**Called by:**
- `(module)` (7)

**Calls:**
- `anonymous` (4)
- `get WriteStream` (2)
- `WriteStream` (1)

### `node:fs`
`node:fs:299` | Self: 0.0% (0us) | Total: 0.0% (874us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:744` | Self: 0.0% (0us) | Total: 0.4% (43.7ms) | Samples: 0

**Called by:**
- `runTrial` (53)

**Calls:**
- `cloneMatrix` (49)
- `map` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:601` | Self: 0.0% (0us) | Total: 4.7% (431.4ms) | Samples: 0

**Called by:**
- `runTrial` (557)
- `runTrial` (2)

**Calls:**
- `transformFromEigenCoordinates` (548)
- `transformFromEigenCoordinates` (10)
- `transformFromEigenCoordinates` (1)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `(anonymous)` (2)

**Calls:**
- `anonymous` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:663` | Self: 0.0% (0us) | Total: 0.7% (67.0ms) | Samples: 0

**Called by:**
- `runTrial` (87)
- `runTrial` (1)

**Calls:**
- `map` (88)

### `WritableState`
`internal:streams/writable:139` | Self: 0.0% (0us) | Total: 0.0% (638us) | Samples: 0

**Called by:**
- `Writable` (1)

**Calls:**
- `getHighWaterMark` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:493` | Self: 0.0% (0us) | Total: 0.0% (2.1ms) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `map` (1)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (865us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 0.0% (0us) | Total: 0.9% (89.0ms) | Samples: 0

**Called by:**
- `alignProjectionBasis` (63)
- `step` (49)

**Calls:**
- `map` (112)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` | Self: 0.0% (0us) | Total: 0.3% (31.8ms) | Samples: 0

**Called by:**
- `(module)` (37)
- `(module)` (6)

**Calls:**
- `step` (24)
- `step` (9)
- `step` (2)
- `step` (2)
- `step` (2)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:630` | Self: 0.0% (0us) | Total: 0.0% (641us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `fill` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` | Self: 0.0% (0us) | Total: 93.2% (8.38s) | Samples: 0

**Calls:**
- `runTrial` (10849)
- `runTrial` (37)
- `runTrial` (4)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:664` | Self: 0.0% (0us) | Total: 0.6% (60.8ms) | Samples: 0

**Called by:**
- `map` (80)

**Calls:**
- `map` (80)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (865us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 92.0% | 8.27s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 7.6% | 686.5ms | `[native code]` |
| 0.2% | 26.0ms | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.0% | 638us | `internal:streams/state` |
