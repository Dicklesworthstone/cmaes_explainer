# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 8.44s | 10958 | 500us | 159 |

**Top 10:** `jacobiEigenSymmetric` 36.1%, `step` 21.4%, `transformFromEigenCoordinates` 5.1%, `reconstructSymmetric` 4.4%, `step` 3.9%, `mahalanobisSquaredWithEigensystem` 3.4%, `step` 2.4%, `map` 2.3%, `step` 2.2%, `hypot` 1.9%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 36.1% | 3.04s | 38.0% | 3.20s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:148` |
| 21.4% | 1.80s | 21.4% | 1.80s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:696` |
| 5.1% | 432.5ms | 5.2% | 443.5ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:273` |
| 4.4% | 378.6ms | 4.8% | 411.9ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:254` |
| 3.9% | 334.5ms | 4.4% | 375.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:689` |
| 3.4% | 293.5ms | 3.5% | 300.5ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:309` |
| 2.4% | 206.0ms | 2.4% | 206.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:734` |
| 2.3% | 202.0ms | 4.7% | 397.8ms | `map` | `[native code]` |
| 2.2% | 192.1ms | 2.2% | 192.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:709` |
| 1.9% | 161.6ms | 1.9% | 161.6ms | `hypot` | `[native code]` |
| 1.7% | 148.2ms | 1.7% | 148.2ms | `fill` | `[native code]` |
| 1.6% | 143.3ms | 2.6% | 224.0ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.6% | 140.2ms | 1.6% | 140.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:706` |
| 0.8% | 71.3ms | 0.8% | 72.1ms | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:420` |
| 0.7% | 67.2ms | 0.9% | 79.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.7% | 59.5ms | 0.8% | 69.5ms | `sort` | `[native code]` |
| 0.6% | 58.0ms | 0.6% | 58.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.5% | 50.3ms | 0.5% | 50.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.5% | 42.2ms | 1.3% | 117.1ms | `some` | `[native code]` |
| 0.4% | 39.1ms | 0.7% | 61.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:213` |
| 0.4% | 36.6ms | 0.4% | 36.6ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:593` |
| 0.4% | 36.6ms | 1.2% | 103.5ms | `from` | `[native code]` |
| 0.3% | 30.4ms | 0.3% | 30.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.3% | 29.7ms | 0.3% | 29.7ms | `Float64Array` | `[native code]` |
| 0.3% | 25.9ms | 0.3% | 26.6ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:288` |
| 0.3% | 25.7ms | 0.7% | 63.9ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.3% | 25.3ms | 0.3% | 25.3ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.2% | 25.0ms | 0.2% | 25.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:640` |
| 0.2% | 20.0ms | 0.2% | 21.5ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:295` |
| 0.2% | 19.7ms | 0.2% | 19.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` |
| 0.2% | 19.0ms | 1.2% | 109.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:726` |
| 0.2% | 18.7ms | 0.2% | 18.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:655` |
| 0.2% | 18.7ms | 0.2% | 18.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 0.1% | 16.1ms | 0.1% | 16.1ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.1% | 14.9ms | 0.1% | 14.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` |
| 0.1% | 14.2ms | 0.1% | 14.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:213` |
| 0.1% | 12.4ms | 0.1% | 12.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 0.1% | 10.3ms | 0.1% | 10.3ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:351` |
| 0.1% | 9.9ms | 0.1% | 9.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:207` |
| 0.1% | 9.7ms | 2.9% | 252.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:608` |
| 0.1% | 8.6ms | 0.1% | 8.6ms | `push` | `[native code]` |
| 0.0% | 7.7ms | 0.0% | 7.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:648` |
| 0.0% | 7.4ms | 3.6% | 311.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:677` |
| 0.0% | 7.0ms | 0.8% | 71.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:612` |
| 0.0% | 6.2ms | 0.0% | 6.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:682` |
| 0.0% | 4.9ms | 0.0% | 4.9ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 4.7ms | 0.0% | 6.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:738` |
| 0.0% | 3.6ms | 0.2% | 18.7ms | `anonymous` | `[native code]` |
| 0.0% | 3.3ms | 0.3% | 27.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:628` |
| 0.0% | 3.2ms | 0.0% | 3.9ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:581` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:753` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:758` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `reduce` | `[native code]` |
| 0.0% | 2.9ms | 0.0% | 2.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:618` |
| 0.0% | 2.9ms | 0.0% | 2.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:614` |
| 0.0% | 2.5ms | 0.8% | 74.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:754` |
| 0.0% | 2.2ms | 5.3% | 451.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:609` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `createIdentityMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:740` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:757` |
| 0.0% | 2.1ms | 0.9% | 80.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` |
| 0.0% | 1.7ms | 0.8% | 73.9ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:571` |
| 0.0% | 1.6ms | 0.0% | 3.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:729` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:432` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:195` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:763` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:154` |
| 0.0% | 1.4ms | 0.0% | 6.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:210` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.3ms | 0.6% | 54.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:206` |
| 0.0% | 1.3ms | 1.6% | 137.0ms | `forEach` | `[native code]` |
| 0.0% | 882us | 0.0% | 4.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:638` |
| 0.0% | 868us | 0.0% | 868us | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:308` |
| 0.0% | 862us | 0.0% | 862us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:664` |
| 0.0% | 857us | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:742` |
| 0.0% | 852us | 0.0% | 852us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:603` |
| 0.0% | 851us | 0.0% | 851us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:723` |
| 0.0% | 845us | 0.7% | 62.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:672` |
| 0.0% | 842us | 0.4% | 37.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:752` |
| 0.0% | 832us | 0.0% | 832us | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:320` |
| 0.0% | 828us | 0.0% | 2.3ms | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:470` |
| 0.0% | 820us | 4.8% | 412.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:713` |
| 0.0% | 813us | 0.0% | 813us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:214` |
| 0.0% | 806us | 0.0% | 806us | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:572` |
| 0.0% | 800us | 0.0% | 800us | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:312` |
| 0.0% | 799us | 0.0% | 799us | `every` | `[native code]` |
| 0.0% | 794us | 0.0% | 794us | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 791us | 0.0% | 791us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` |
| 0.0% | 789us | 0.2% | 18.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 0.0% | 781us | 0.0% | 5.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:744` |
| 0.0% | 778us | 0.7% | 59.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 0.0% | 772us | 0.0% | 772us | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:550` |
| 0.0% | 769us | 0.0% | 769us | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:573` |
| 0.0% | 761us | 0.0% | 761us | `node:fs` | `node:fs:618` |
| 0.0% | 748us | 0.0% | 748us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:50` |
| 0.0% | 713us | 0.0% | 713us | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 711us | 0.0% | 711us | `Writable` | `internal:streams/writable` |
| 0.0% | 707us | 0.0% | 3.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:747` |
| 0.0% | 707us | 0.3% | 25.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:725` |
| 0.0% | 706us | 0.0% | 706us | `max` | `[native code]` |
| 0.0% | 699us | 0.0% | 699us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:602` |
| 0.0% | 698us | 0.0% | 698us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` |
| 0.0% | 693us | 1.6% | 136.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` |
| 0.0% | 689us | 0.0% | 689us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:275` |
| 0.0% | 682us | 0.0% | 682us | `setPrototypeDirectOrThrow` | `[native code]` |
| 0.0% | 682us | 0.0% | 682us | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:313` |
| 0.0% | 662us | 0.0% | 662us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:642` |
| 0.0% | 662us | 0.0% | 662us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 649us | 0.0% | 649us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:646` |
| 0.0% | 632us | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:764` |
| 0.0% | 627us | 0.0% | 627us | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 622us | 0.0% | 622us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:136` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 99.4% | 8.38s | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 93.3% | 7.87s | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` |
| 41.4% | 3.49s | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:712` |
| 38.0% | 3.20s | 36.1% | 3.04s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:148` |
| 21.4% | 1.80s | 21.4% | 1.80s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:696` |
| 6.6% | 559.4ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` |
| 5.3% | 451.4ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:609` |
| 5.2% | 443.5ms | 5.1% | 432.5ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:273` |
| 4.8% | 412.7ms | 0.0% | 820us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:713` |
| 4.8% | 411.9ms | 4.4% | 378.6ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:254` |
| 4.7% | 397.8ms | 2.3% | 202.0ms | `map` | `[native code]` |
| 4.4% | 375.5ms | 3.9% | 334.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:689` |
| 3.6% | 311.1ms | 0.0% | 7.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:677` |
| 3.5% | 300.5ms | 3.4% | 293.5ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:309` |
| 2.9% | 252.0ms | 0.1% | 9.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:608` |
| 2.6% | 224.0ms | 1.6% | 143.3ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 2.4% | 206.0ms | 2.4% | 206.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:734` |
| 2.2% | 192.1ms | 2.2% | 192.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:709` |
| 1.9% | 161.6ms | 1.9% | 161.6ms | `hypot` | `[native code]` |
| 1.7% | 148.2ms | 1.7% | 148.2ms | `fill` | `[native code]` |
| 1.6% | 140.2ms | 1.6% | 140.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:706` |
| 1.6% | 137.0ms | 0.0% | 1.3ms | `forEach` | `[native code]` |
| 1.6% | 136.2ms | 0.0% | 693us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` |
| 1.3% | 117.1ms | 0.5% | 42.2ms | `some` | `[native code]` |
| 1.2% | 109.3ms | 0.2% | 19.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:726` |
| 1.2% | 103.5ms | 0.4% | 36.6ms | `from` | `[native code]` |
| 0.9% | 80.1ms | 0.0% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` |
| 0.9% | 79.5ms | 0.7% | 67.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.8% | 74.5ms | 0.0% | 2.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 0.8% | 73.9ms | 0.0% | 1.7ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:571` |
| 0.8% | 72.1ms | 0.8% | 71.3ms | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:420` |
| 0.8% | 71.8ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:722` |
| 0.8% | 71.0ms | 0.0% | 7.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:612` |
| 0.8% | 69.5ms | 0.7% | 59.5ms | `sort` | `[native code]` |
| 0.7% | 66.1ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:671` |
| 0.7% | 64.1ms | 0.0% | 0us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.7% | 63.9ms | 0.3% | 25.7ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.7% | 62.9ms | 0.0% | 845us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:672` |
| 0.7% | 61.0ms | 0.4% | 39.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:213` |
| 0.7% | 59.7ms | 0.0% | 778us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 0.6% | 58.9ms | 0.0% | 0us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.6% | 58.2ms | 0.0% | 0us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.6% | 58.0ms | 0.6% | 58.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.6% | 54.1ms | 0.0% | 1.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:206` |
| 0.5% | 50.3ms | 0.5% | 50.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.5% | 48.1ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` |
| 0.4% | 37.6ms | 0.0% | 842us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:752` |
| 0.4% | 36.6ms | 0.4% | 36.6ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:593` |
| 0.4% | 35.2ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:585` |
| 0.4% | 35.0ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` |
| 0.3% | 30.4ms | 0.3% | 30.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.3% | 30.1ms | 0.0% | 0us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.3% | 29.7ms | 0.3% | 29.7ms | `Float64Array` | `[native code]` |
| 0.3% | 27.3ms | 0.0% | 3.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:628` |
| 0.3% | 26.6ms | 0.3% | 25.9ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:288` |
| 0.3% | 25.5ms | 0.0% | 707us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:725` |
| 0.3% | 25.3ms | 0.3% | 25.3ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.2% | 25.0ms | 0.2% | 25.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:640` |
| 0.2% | 21.5ms | 0.2% | 20.0ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:295` |
| 0.2% | 19.7ms | 0.2% | 19.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` |
| 0.2% | 18.7ms | 0.2% | 18.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:655` |
| 0.2% | 18.7ms | 0.0% | 3.6ms | `anonymous` | `[native code]` |
| 0.2% | 18.7ms | 0.2% | 18.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 0.2% | 18.2ms | 0.0% | 789us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 0.1% | 16.1ms | 0.1% | 16.1ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.1% | 14.9ms | 0.1% | 14.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` |
| 0.1% | 14.2ms | 0.1% | 14.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:213` |
| 0.1% | 12.4ms | 0.1% | 12.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 0.1% | 10.3ms | 0.1% | 10.3ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:351` |
| 0.1% | 9.9ms | 0.1% | 9.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:207` |
| 0.1% | 9.5ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:743` |
| 0.1% | 8.6ms | 0.1% | 8.6ms | `push` | `[native code]` |
| 0.0% | 7.8ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` |
| 0.0% | 7.8ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:723` |
| 0.0% | 7.7ms | 0.0% | 7.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:648` |
| 0.0% | 6.6ms | 0.0% | 1.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:210` |
| 0.0% | 6.2ms | 0.0% | 6.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:682` |
| 0.0% | 6.1ms | 0.0% | 4.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:738` |
| 0.0% | 5.8ms | 0.0% | 781us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:744` |
| 0.0% | 5.7ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.0% | 5.7ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.0% | 4.9ms | 0.0% | 4.9ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 4.0ms | 0.0% | 882us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:638` |
| 0.0% | 3.9ms | 0.0% | 3.2ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:581` |
| 0.0% | 3.8ms | 0.0% | 707us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:747` |
| 0.0% | 3.6ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` |
| 0.0% | 3.2ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:729` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:753` |
| 0.0% | 3.1ms | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:501` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:758` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `reduce` | `[native code]` |
| 0.0% | 2.9ms | 0.0% | 2.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:618` |
| 0.0% | 2.9ms | 0.0% | 2.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:614` |
| 0.0% | 2.3ms | 0.0% | 828us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:470` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:754` |
| 0.0% | 2.2ms | 0.0% | 632us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:764` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `createIdentityMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:740` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:757` |
| 0.0% | 1.9ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 1.9ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 1.7ms | 0.0% | 0us | `createIdentityMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:31` |
| 0.0% | 1.6ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:209` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:432` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:195` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:763` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:154` |
| 0.0% | 1.4ms | 0.0% | 857us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:742` |
| 0.0% | 1.4ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:629` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.3ms | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 1.3ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 1.3ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 1.3ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 1.3ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 868us | 0.0% | 868us | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:308` |
| 0.0% | 862us | 0.0% | 862us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:664` |
| 0.0% | 855us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:504` |
| 0.0% | 852us | 0.0% | 852us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:603` |
| 0.0% | 851us | 0.0% | 851us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:723` |
| 0.0% | 832us | 0.0% | 832us | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:320` |
| 0.0% | 824us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:546` |
| 0.0% | 813us | 0.0% | 813us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:214` |
| 0.0% | 806us | 0.0% | 806us | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:572` |
| 0.0% | 800us | 0.0% | 800us | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:312` |
| 0.0% | 799us | 0.0% | 799us | `every` | `[native code]` |
| 0.0% | 794us | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:354` |
| 0.0% | 794us | 0.0% | 794us | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 791us | 0.0% | 791us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` |
| 0.0% | 772us | 0.0% | 772us | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:550` |
| 0.0% | 769us | 0.0% | 769us | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:573` |
| 0.0% | 761us | 0.0% | 761us | `node:fs` | `node:fs:618` |
| 0.0% | 748us | 0.0% | 748us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:50` |
| 0.0% | 713us | 0.0% | 713us | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 711us | 0.0% | 711us | `Writable` | `internal:streams/writable` |
| 0.0% | 711us | 0.0% | 0us | `WriteStream` | `internal:fs/streams:259` |
| 0.0% | 706us | 0.0% | 706us | `max` | `[native code]` |
| 0.0% | 699us | 0.0% | 699us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:602` |
| 0.0% | 698us | 0.0% | 698us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` |
| 0.0% | 694us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` |
| 0.0% | 691us | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 691us | 0.0% | 0us | `internal:streams/readable` | `internal:streams/readable:14` |
| 0.0% | 691us | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 689us | 0.0% | 689us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:275` |
| 0.0% | 682us | 0.0% | 682us | `setPrototypeDirectOrThrow` | `[native code]` |
| 0.0% | 682us | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 682us | 0.0% | 682us | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:313` |
| 0.0% | 682us | 0.0% | 0us | `internal:primordials` | `internal:primordials:73` |
| 0.0% | 682us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 682us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 662us | 0.0% | 662us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 662us | 0.0% | 662us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:642` |
| 0.0% | 649us | 0.0% | 649us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:646` |
| 0.0% | 627us | 0.0% | 627us | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 622us | 0.0% | 622us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:136` |

## Function Details

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:148` | Self: 36.1% (3.04s) | Total: 38.0% (3.20s) | Samples: 3933

**Called by:**
- `step` (4144)

**Calls:**
- `hypot` (211)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:696` | Self: 21.4% (1.80s) | Total: 21.4% (1.80s) | Samples: 2353

**Called by:**
- `runTrial` (2345)
- `runTrial` (8)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:273` | Self: 5.1% (432.5ms) | Total: 5.2% (443.5ms) | Samples: 562

**Called by:**
- `step` (575)

**Calls:**
- `createZeroVector` (9)
- `fill` (4)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:254` | Self: 4.4% (378.6ms) | Total: 4.8% (411.9ms) | Samples: 494

**Called by:**
- `step` (537)

**Calls:**
- `from` (43)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:689` | Self: 3.9% (334.5ms) | Total: 4.4% (375.5ms) | Samples: 441

**Called by:**
- `runTrial` (492)

**Calls:**
- `createZeroMatrix` (35)
- `from` (14)
- `createZeroMatrix` (2)

### `mahalanobisSquaredWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:309` | Self: 3.4% (293.5ms) | Total: 3.5% (300.5ms) | Samples: 384

**Called by:**
- `step` (393)

**Calls:**
- `createZeroVector` (6)
- `fill` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:734` | Self: 2.4% (206.0ms) | Total: 2.4% (206.0ms) | Samples: 271

**Called by:**
- `runTrial` (271)

### `map`
`[native code]` | Self: 2.3% (202.0ms) | Total: 4.7% (397.8ms) | Samples: 262

**Called by:**
- `step` (104)
- `step` (93)
- `cloneMatrix` (85)
- `step` (85)
- `(anonymous)` (80)
- `(anonymous)` (32)
- `step` (10)
- `step` (7)
- `jacobiEigenSymmetric` (6)
- `jacobiEigenSymmetric` (5)
- `step` (4)
- `alignProjectionBasis` (3)
- `map` (2)
- `jacobiEigenSymmetric` (2)

**Calls:**
- `(anonymous)` (81)
- `(anonymous)` (66)
- `(anonymous)` (54)
- `(anonymous)` (26)
- `(anonymous)` (25)
- `map` (2)
- `(anonymous)` (1)
- `repair` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:709` | Self: 2.2% (192.1ms) | Total: 2.2% (192.1ms) | Samples: 250

**Called by:**
- `runTrial` (250)

### `hypot`
`[native code]` | Self: 1.9% (161.6ms) | Total: 1.9% (161.6ms) | Samples: 211

**Called by:**
- `jacobiEigenSymmetric` (211)

### `fill`
`[native code]` | Self: 1.7% (148.2ms) | Total: 1.7% (148.2ms) | Samples: 191

**Called by:**
- `sampleGaussianVectorND` (106)
- `ellipsoidObjective` (49)
- `from` (28)
- `transformFromEigenCoordinates` (4)
- `mahalanobisSquaredWithEigensystem` (3)
- `step` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.6% (143.3ms) | Total: 2.6% (224.0ms) | Samples: 189

**Called by:**
- `step` (295)

**Calls:**
- `fill` (106)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:706` | Self: 1.6% (140.2ms) | Total: 1.6% (140.2ms) | Samples: 187

**Called by:**
- `runTrial` (187)

### `requireFiniteVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:420` | Self: 0.8% (71.3ms) | Total: 0.8% (72.1ms) | Samples: 96

**Called by:**
- `projectTo3D` (97)

**Calls:**
- `every` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` | Self: 0.7% (67.2ms) | Total: 0.9% (79.5ms) | Samples: 89

**Called by:**
- `step` (105)

**Calls:**
- `Float64Array` (16)

### `sort`
`[native code]` | Self: 0.7% (59.5ms) | Total: 0.8% (69.5ms) | Samples: 70

**Called by:**
- `jacobiEigenSymmetric` (53)
- `step` (30)

**Calls:**
- `(anonymous)` (13)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.6% (58.0ms) | Total: 0.6% (58.0ms) | Samples: 77

**Called by:**
- `map` (54)
- `some` (22)
- `forEach` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 0.5% (50.3ms) | Total: 0.5% (50.3ms) | Samples: 66

**Called by:**
- `map` (66)

### `some`
`[native code]` | Self: 0.5% (42.2ms) | Total: 1.3% (117.1ms) | Samples: 56

**Called by:**
- `validateSquareFiniteMatrix` (78)
- `(anonymous)` (77)

**Calls:**
- `(anonymous)` (77)
- `(anonymous)` (22)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:213` | Self: 0.4% (39.1ms) | Total: 0.7% (61.0ms) | Samples: 52

**Called by:**
- `step` (80)

**Calls:**
- `from` (28)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:593` | Self: 0.4% (36.6ms) | Total: 0.4% (36.6ms) | Samples: 46

**Called by:**
- `step` (46)

### `from`
`[native code]` | Self: 0.4% (36.6ms) | Total: 1.2% (103.5ms) | Samples: 47

**Called by:**
- `reconstructSymmetric` (43)
- `createZeroMatrix` (37)
- `jacobiEigenSymmetric` (28)
- `step` (14)
- `jacobiEigenSymmetric` (9)

**Calls:**
- `(anonymous)` (38)
- `fill` (28)
- `(anonymous)` (18)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.3% (30.4ms) | Total: 0.3% (30.4ms) | Samples: 38

**Called by:**
- `from` (38)

### `Float64Array`
`[native code]` | Self: 0.3% (29.7ms) | Total: 0.3% (29.7ms) | Samples: 37

**Called by:**
- `jacobiEigenSymmetric` (21)
- `jacobiEigenSymmetric` (16)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:288` | Self: 0.3% (25.9ms) | Total: 0.3% (26.6ms) | Samples: 33

**Called by:**
- `step` (34)

**Calls:**
- `createZeroVector` (1)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` | Self: 0.3% (25.7ms) | Total: 0.7% (63.9ms) | Samples: 32

**Called by:**
- `step` (81)

**Calls:**
- `fill` (49)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.3% (25.3ms) | Total: 0.3% (25.3ms) | Samples: 35

**Called by:**
- `(anonymous)` (16)
- `step` (12)
- `step` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:640` | Self: 0.2% (25.0ms) | Total: 0.2% (25.0ms) | Samples: 34

**Called by:**
- `runTrial` (34)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:295` | Self: 0.2% (20.0ms) | Total: 0.2% (21.5ms) | Samples: 26

**Called by:**
- `step` (28)

**Calls:**
- `createZeroVector` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` | Self: 0.2% (19.7ms) | Total: 0.2% (19.7ms) | Samples: 26

**Called by:**
- `map` (26)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:726` | Self: 0.2% (19.0ms) | Total: 1.2% (109.3ms) | Samples: 25

**Called by:**
- `forEach` (146)

**Calls:**
- `projectTo3D` (99)
- `projectTo3D` (16)
- `projectTo3D` (4)
- `projectTo3D` (1)
- `projectTo3D` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:655` | Self: 0.2% (18.7ms) | Total: 0.2% (18.7ms) | Samples: 24

**Called by:**
- `runTrial` (24)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` | Self: 0.2% (18.7ms) | Total: 0.2% (18.7ms) | Samples: 25

**Called by:**
- `map` (25)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` | Self: 0.1% (16.1ms) | Total: 0.1% (16.1ms) | Samples: 21

**Called by:**
- `transformFromEigenCoordinates` (9)
- `mahalanobisSquaredWithEigensystem` (6)
- `step` (3)
- `whitenWithEigensystem` (2)
- `whitenWithEigensystem` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` | Self: 0.1% (14.9ms) | Total: 0.1% (14.9ms) | Samples: 18

**Called by:**
- `runTrial` (18)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:213` | Self: 0.1% (14.2ms) | Total: 0.1% (14.2ms) | Samples: 18

**Called by:**
- `from` (18)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` | Self: 0.1% (12.4ms) | Total: 0.1% (12.4ms) | Samples: 16

**Called by:**
- `runTrial` (16)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:351` | Self: 0.1% (10.3ms) | Total: 0.1% (10.3ms) | Samples: 13

**Called by:**
- `step` (13)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:207` | Self: 0.1% (9.9ms) | Total: 0.1% (9.9ms) | Samples: 13

**Called by:**
- `sort` (13)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:608` | Self: 0.1% (9.7ms) | Total: 2.9% (252.0ms) | Samples: 12

**Called by:**
- `runTrial` (330)

**Calls:**
- `sampleGaussianVectorND` (295)
- `sampleGaussianVectorND` (13)
- `push` (9)
- `sampleGaussianVectorND` (1)

### `push`
`[native code]` | Self: 0.1% (8.6ms) | Total: 0.1% (8.6ms) | Samples: 11

**Called by:**
- `step` (9)
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:648` | Self: 0.0% (7.7ms) | Total: 0.0% (7.7ms) | Samples: 10

**Called by:**
- `runTrial` (10)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:677` | Self: 0.0% (7.4ms) | Total: 3.6% (311.1ms) | Samples: 10

**Called by:**
- `runTrial` (403)
- `runTrial` (4)

**Calls:**
- `mahalanobisSquaredWithEigensystem` (393)
- `mahalanobisSquaredWithEigensystem` (1)
- `mahalanobisSquaredWithEigensystem` (1)
- `mahalanobisSquaredWithEigensystem` (1)
- `mahalanobisSquaredWithEigensystem` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:612` | Self: 0.0% (7.0ms) | Total: 0.8% (71.0ms) | Samples: 9

**Called by:**
- `runTrial` (89)
- `runTrial` (1)

**Calls:**
- `ellipsoidObjective` (81)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:682` | Self: 0.0% (6.2ms) | Total: 0.0% (6.2ms) | Samples: 8

**Called by:**
- `runTrial` (8)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (4.9ms) | Total: 0.0% (4.9ms) | Samples: 7

**Called by:**
- `step` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:738` | Self: 0.0% (4.7ms) | Total: 0.0% (6.1ms) | Samples: 5

**Called by:**
- `runTrial` (7)

**Calls:**
- `radius` (2)

### `anonymous`
`[native code]` | Self: 0.0% (3.6ms) | Total: 0.2% (18.7ms) | Samples: 5

**Called by:**
- `(anonymous)` (5)
- `node:fs/promises` (3)
- `node:fs` (3)
- `internal:fs/streams` (2)
- `get WriteStream` (2)
- `internal:stream` (2)
- `internal:streams/compose` (2)
- `node:stream` (2)
- `node:events` (1)
- `internal:validators` (1)
- `internal:streams/pipeline` (1)
- `internal:streams/readable` (1)
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
- `node:fs` (1)
- `internal:streams/readable` (1)
- `internal:shared` (1)
- `internal:primordials` (1)
- `internal:streams/duplex` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:628` | Self: 0.0% (3.3ms) | Total: 0.3% (27.3ms) | Samples: 5

**Called by:**
- `runTrial` (35)

**Calls:**
- `sort` (30)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:581` | Self: 0.0% (3.2ms) | Total: 0.0% (3.9ms) | Samples: 4

**Called by:**
- `(anonymous)` (4)
- `step` (1)

**Calls:**
- `coordinate` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:753` | Self: 0.0% (3.1ms) | Total: 0.0% (3.1ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:758` | Self: 0.0% (3.0ms) | Total: 0.0% (3.0ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` | Self: 0.0% (3.0ms) | Total: 0.0% (3.0ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `reduce`
`[native code]` | Self: 0.0% (3.0ms) | Total: 0.0% (3.0ms) | Samples: 4

**Called by:**
- `step` (2)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:618` | Self: 0.0% (2.9ms) | Total: 0.0% (2.9ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:614` | Self: 0.0% (2.9ms) | Total: 0.0% (2.9ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` | Self: 0.0% (2.5ms) | Total: 0.8% (74.5ms) | Samples: 3

**Called by:**
- `runTrial` (96)

**Calls:**
- `map` (93)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:754` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:609` | Self: 0.0% (2.2ms) | Total: 5.3% (451.4ms) | Samples: 3

**Called by:**
- `runTrial` (583)
- `runTrial` (3)

**Calls:**
- `transformFromEigenCoordinates` (575)
- `transformFromEigenCoordinates` (7)
- `transformFromEigenCoordinates` (1)

### `createIdentityMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (2.2ms) | Total: 0.0% (2.2ms) | Samples: 1

**Called by:**
- `CMAESOptimizerND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:740` | Self: 0.0% (2.1ms) | Total: 0.0% (2.1ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` | Self: 0.0% (2.1ms) | Total: 0.0% (2.1ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:757` | Self: 0.0% (2.1ms) | Total: 0.0% (2.1ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` | Self: 0.0% (2.1ms) | Total: 0.9% (80.1ms) | Samples: 3

**Called by:**
- `runTrial` (106)
- `runTrial` (1)

**Calls:**
- `map` (104)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:571` | Self: 0.0% (1.7ms) | Total: 0.8% (73.9ms) | Samples: 2

**Called by:**
- `(anonymous)` (99)

**Calls:**
- `requireFiniteVector` (97)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:729` | Self: 0.0% (1.6ms) | Total: 0.0% (3.2ms) | Samples: 2

**Called by:**
- `runTrial` (4)

**Calls:**
- `reduce` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:432` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `CMAESOptimizerND` (2)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `step` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:195` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:763` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:154` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `step` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:210` | Self: 0.0% (1.4ms) | Total: 0.0% (6.6ms) | Samples: 2

**Called by:**
- `step` (9)

**Calls:**
- `map` (6)
- `max` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `radius`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `step` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:206` | Self: 0.0% (1.3ms) | Total: 0.6% (54.1ms) | Samples: 2

**Called by:**
- `step` (64)

**Calls:**
- `sort` (53)
- `from` (9)

### `forEach`
`[native code]` | Self: 0.0% (1.3ms) | Total: 1.6% (137.0ms) | Samples: 2

**Called by:**
- `step` (180)
- `step` (2)

**Calls:**
- `(anonymous)` (146)
- `(anonymous)` (33)
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:638` | Self: 0.0% (882us) | Total: 0.0% (4.0ms) | Samples: 1

**Called by:**
- `runTrial` (5)

**Calls:**
- `createZeroVector` (3)
- `fill` (1)

### `mahalanobisSquaredWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:308` | Self: 0.0% (868us) | Total: 0.0% (868us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:664` | Self: 0.0% (862us) | Total: 0.0% (862us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:742` | Self: 0.0% (857us) | Total: 0.0% (1.4ms) | Samples: 1

**Called by:**
- `runTrial` (2)

**Calls:**
- `variancePercent` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:603` | Self: 0.0% (852us) | Total: 0.0% (852us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:723` | Self: 0.0% (851us) | Total: 0.0% (851us) | Samples: 1

**Called by:**
- `map` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:672` | Self: 0.0% (845us) | Total: 0.7% (62.9ms) | Samples: 1

**Called by:**
- `map` (81)

**Calls:**
- `map` (80)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:752` | Self: 0.0% (842us) | Total: 0.4% (37.6ms) | Samples: 1

**Called by:**
- `runTrial` (50)

**Calls:**
- `cloneMatrix` (42)
- `map` (7)

### `mahalanobisSquaredWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:320` | Self: 0.0% (832us) | Total: 0.0% (832us) | Samples: 1

**Called by:**
- `step` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:470` | Self: 0.0% (828us) | Total: 0.0% (2.3ms) | Samples: 1

**Called by:**
- `runTrial` (3)

**Calls:**
- `(anonymous)` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:713` | Self: 0.0% (820us) | Total: 4.8% (412.7ms) | Samples: 1

**Called by:**
- `runTrial` (534)
- `runTrial` (4)

**Calls:**
- `reconstructSymmetric` (537)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:214` | Self: 0.0% (813us) | Total: 0.0% (813us) | Samples: 1

**Called by:**
- `step` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:572` | Self: 0.0% (806us) | Total: 0.0% (806us) | Samples: 1

**Called by:**
- `(anonymous)` (1)

### `mahalanobisSquaredWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:312` | Self: 0.0% (800us) | Total: 0.0% (800us) | Samples: 1

**Called by:**
- `step` (1)

### `every`
`[native code]` | Self: 0.0% (799us) | Total: 0.0% (799us) | Samples: 1

**Called by:**
- `requireFiniteVector` (1)

### `nextHalfOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (794us) | Total: 0.0% (794us) | Samples: 1

**Called by:**
- `sampleGaussianVectorND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` | Self: 0.0% (791us) | Total: 0.0% (791us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` | Self: 0.0% (789us) | Total: 0.2% (18.2ms) | Samples: 1

**Called by:**
- `step` (22)

**Calls:**
- `Float64Array` (21)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:744` | Self: 0.0% (781us) | Total: 0.0% (5.8ms) | Samples: 1

**Called by:**
- `runTrial` (8)

**Calls:**
- `projectTo3D` (7)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` | Self: 0.0% (778us) | Total: 0.7% (59.7ms) | Samples: 1

**Called by:**
- `step` (79)

**Calls:**
- `validateSquareFiniteMatrix` (78)

### `repair`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:550` | Self: 0.0% (772us) | Total: 0.0% (772us) | Samples: 1

**Called by:**
- `map` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:573` | Self: 0.0% (769us) | Total: 0.0% (769us) | Samples: 1

**Called by:**
- `(anonymous)` (1)

### `node:fs`
`node:fs:618` | Self: 0.0% (761us) | Total: 0.0% (761us) | Samples: 1

**Called by:**
- `anonymous` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:50` | Self: 0.0% (748us) | Total: 0.0% (748us) | Samples: 1

**Called by:**
- `(module)` (1)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (713us) | Total: 0.0% (713us) | Samples: 1

**Called by:**
- `projectTo3D` (1)

### `Writable`
`internal:streams/writable` | Self: 0.0% (711us) | Total: 0.0% (711us) | Samples: 1

**Called by:**
- `WriteStream` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:747` | Self: 0.0% (707us) | Total: 0.0% (3.8ms) | Samples: 1

**Called by:**
- `runTrial` (5)

**Calls:**
- `map` (4)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:725` | Self: 0.0% (707us) | Total: 0.3% (25.5ms) | Samples: 1

**Called by:**
- `forEach` (33)

**Calls:**
- `map` (32)

### `max`
`[native code]` | Self: 0.0% (706us) | Total: 0.0% (706us) | Samples: 1

**Called by:**
- `jacobiEigenSymmetric` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:602` | Self: 0.0% (699us) | Total: 0.0% (699us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` | Self: 0.0% (698us) | Total: 0.0% (698us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` | Self: 0.0% (693us) | Total: 1.6% (136.2ms) | Samples: 1

**Called by:**
- `runTrial` (180)
- `runTrial` (1)

**Calls:**
- `forEach` (180)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:275` | Self: 0.0% (689us) | Total: 0.0% (689us) | Samples: 1

**Called by:**
- `step` (1)

### `setPrototypeDirectOrThrow`
`[native code]` | Self: 0.0% (682us) | Total: 0.0% (682us) | Samples: 1

**Called by:**
- `internal:primordials` (1)

### `mahalanobisSquaredWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:313` | Self: 0.0% (682us) | Total: 0.0% (682us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:642` | Self: 0.0% (662us) | Total: 0.0% (662us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (662us) | Total: 0.0% (662us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:646` | Self: 0.0% (649us) | Total: 0.0% (649us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:764` | Self: 0.0% (632us) | Total: 0.0% (2.2ms) | Samples: 1

**Called by:**
- `runTrial` (3)

**Calls:**
- `push` (2)

### `variancePercent`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (627us) | Total: 0.0% (627us) | Samples: 1

**Called by:**
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:136` | Self: 0.0% (622us) | Total: 0.0% (622us) | Samples: 1

**Called by:**
- `step` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` | Self: 0.0% (0us) | Total: 0.0% (5.7ms) | Samples: 0

**Calls:**
- `(anonymous)` (8)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` | Self: 0.0% (0us) | Total: 0.0% (7.8ms) | Samples: 0

**Called by:**
- `(module)` (6)
- `(module)` (2)

**Calls:**
- `CMAESOptimizerND` (3)
- `CMAESOptimizerND` (2)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (682us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 0.0% (0us) | Total: 0.7% (64.1ms) | Samples: 0

**Called by:**
- `alignProjectionBasis` (43)
- `step` (42)

**Calls:**
- `map` (85)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (5.7ms) | Samples: 0

**Called by:**
- `(module)` (8)

**Calls:**
- `anonymous` (5)
- `get WriteStream` (2)
- `WriteStream` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` | Self: 0.0% (0us) | Total: 0.0% (694us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `reduce` (1)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (691us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:501` | Self: 0.0% (0us) | Total: 0.0% (3.1ms) | Samples: 0

**Called by:**
- `runTrial` (2)

**Calls:**
- `createIdentityMatrix` (1)
- `createIdentityMatrix` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:354` | Self: 0.0% (0us) | Total: 0.0% (794us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `nextHalfOpenUnit` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:743` | Self: 0.0% (0us) | Total: 0.1% (9.5ms) | Samples: 0

**Called by:**
- `runTrial` (13)

**Calls:**
- `projectTo3D` (12)
- `projectTo3D` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` | Self: 0.0% (0us) | Total: 99.4% (8.38s) | Samples: 0

**Called by:**
- `(module)` (10181)
- `(module)` (715)

**Calls:**
- `step` (4495)
- `step` (2345)
- `step` (583)
- `step` (534)
- `step` (492)
- `step` (403)
- `step` (330)
- `step` (271)
- `step` (250)
- `step` (187)
- `step` (180)
- `step` (106)
- `step` (96)
- `step` (91)
- `step` (89)
- `step` (84)
- `step` (62)
- `step` (50)
- `step` (35)
- `step` (34)
- `step` (24)
- `step` (18)
- `step` (16)
- `step` (13)
- `step` (10)
- `step` (10)
- `step` (8)
- `step` (8)
- `step` (7)
- `step` (5)
- `step` (5)
- `step` (4)
- `step` (4)
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
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` | Self: 0.0% (0us) | Total: 0.5% (48.1ms) | Samples: 0

**Called by:**
- `runTrial` (62)

**Calls:**
- `whitenWithEigensystem` (34)
- `whitenWithEigensystem` (28)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:209` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `step` (2)

**Calls:**
- `map` (2)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (1.3ms) | Samples: 0

**Called by:**
- `(anonymous)` (2)

**Calls:**
- `anonymous` (2)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:546` | Self: 0.0% (0us) | Total: 0.0% (824us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `reduce` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (0us) | Total: 0.6% (58.2ms) | Samples: 0

**Called by:**
- `some` (77)

**Calls:**
- `some` (77)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (1.9ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:712` | Self: 0.0% (0us) | Total: 41.4% (3.49s) | Samples: 0

**Called by:**
- `runTrial` (4495)
- `runTrial` (21)

**Calls:**
- `jacobiEigenSymmetric` (4144)
- `jacobiEigenSymmetric` (105)
- `jacobiEigenSymmetric` (80)
- `jacobiEigenSymmetric` (79)
- `jacobiEigenSymmetric` (64)
- `jacobiEigenSymmetric` (22)
- `jacobiEigenSymmetric` (9)
- `jacobiEigenSymmetric` (5)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)

### `internal:streams/readable`
`internal:streams/readable:14` | Self: 0.0% (0us) | Total: 0.0% (691us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (1.3ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.3ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `WriteStream`
`internal:fs/streams:259` | Self: 0.0% (0us) | Total: 0.0% (711us) | Samples: 0

**Called by:**
- `(anonymous)` (1)

**Calls:**
- `Writable` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:629` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `runTrial` (2)

**Calls:**
- `forEach` (2)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (1.3ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:504` | Self: 0.0% (0us) | Total: 0.0% (855us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `createIdentityMatrix` (1)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.3ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (691us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:585` | Self: 0.0% (0us) | Total: 0.4% (35.2ms) | Samples: 0

**Called by:**
- `step` (46)

**Calls:**
- `cloneMatrix` (43)
- `map` (3)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.0% (0us) | Total: 0.3% (30.1ms) | Samples: 0

**Called by:**
- `step` (35)
- `createIdentityMatrix` (2)

**Calls:**
- `from` (37)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (0us) | Total: 0.6% (58.9ms) | Samples: 0

**Called by:**
- `jacobiEigenSymmetric` (78)

**Calls:**
- `some` (78)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (682us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` | Self: 0.0% (0us) | Total: 6.6% (559.4ms) | Samples: 0

**Calls:**
- `runTrial` (715)
- `runTrial` (7)
- `runTrial` (2)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` | Self: 0.0% (0us) | Total: 93.3% (7.87s) | Samples: 0

**Calls:**
- `runTrial` (10181)
- `runTrial` (38)
- `runTrial` (6)
- `runTrial` (1)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (1.9ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:671` | Self: 0.0% (0us) | Total: 0.7% (66.1ms) | Samples: 0

**Called by:**
- `runTrial` (84)
- `runTrial` (1)

**Calls:**
- `map` (85)

### `internal:primordials`
`internal:primordials:73` | Self: 0.0% (0us) | Total: 0.0% (682us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `setPrototypeDirectOrThrow` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` | Self: 0.0% (0us) | Total: 0.0% (3.6ms) | Samples: 0

**Called by:**
- `step` (5)

**Calls:**
- `map` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:722` | Self: 0.0% (0us) | Total: 0.8% (71.8ms) | Samples: 0

**Called by:**
- `runTrial` (91)
- `runTrial` (1)

**Calls:**
- `alignProjectionBasis` (46)
- `alignProjectionBasis` (46)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` | Self: 0.0% (0us) | Total: 0.4% (35.0ms) | Samples: 0

**Called by:**
- `(module)` (38)
- `(module)` (7)

**Calls:**
- `step` (21)
- `step` (8)
- `step` (4)
- `step` (4)
- `step` (3)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:723` | Self: 0.0% (0us) | Total: 0.0% (7.8ms) | Samples: 0

**Called by:**
- `runTrial` (10)

**Calls:**
- `map` (10)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (682us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `createIdentityMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:31` | Self: 0.0% (0us) | Total: 0.0% (1.7ms) | Samples: 0

**Called by:**
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)

**Calls:**
- `createZeroMatrix` (2)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 91.3% | 7.71s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 8.2% | 698.8ms | `[native code]` |
| 0.3% | 26.5ms | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.0% | 761us | `node:fs` |
| 0.0% | 711us | `internal:streams/writable` |
