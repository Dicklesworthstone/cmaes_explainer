# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 2.52s | 3144 | 500us | 174 |

**Top 10:** `jacobiEigenSymmetric` 15.4%, `step` 14.6%, `map` 7.7%, `sampleGaussianVectorND` 5.2%, `requireFiniteVector` 3.8%, `mahalanobisSquaredWithEigensystem` 3.6%, `step` 3.5%, `transformFromEigenCoordinates` 3.4%, `step` 2.2%, `(anonymous)` 2.2%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 15.4% | 389.2ms | 16.6% | 418.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` |
| 14.6% | 368.4ms | 15.8% | 398.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:688` |
| 7.7% | 194.3ms | 14.1% | 355.6ms | `map` | `[native code]` |
| 5.2% | 131.5ms | 5.2% | 131.5ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 3.8% | 97.7ms | 3.8% | 97.7ms | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:419` |
| 3.6% | 90.7ms | 4.1% | 103.8ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:308` |
| 3.5% | 89.9ms | 3.5% | 89.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:733` |
| 3.4% | 86.4ms | 4.1% | 105.6ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 2.2% | 57.6ms | 2.2% | 57.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:708` |
| 2.2% | 57.6ms | 2.2% | 57.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 2.0% | 51.7ms | 2.0% | 51.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:705` |
| 1.9% | 50.2ms | 3.2% | 82.9ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:253` |
| 1.6% | 40.5ms | 1.9% | 49.2ms | `sort` | `[native code]` |
| 1.4% | 36.3ms | 1.4% | 36.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 1.3% | 34.7ms | 6.1% | 156.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:725` |
| 1.3% | 33.1ms | 3.2% | 80.8ms | `from` | `[native code]` |
| 1.3% | 33.0ms | 1.3% | 33.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 1.3% | 32.8ms | 1.3% | 32.8ms | `fill` | `[native code]` |
| 1.1% | 29.6ms | 1.1% | 29.6ms | `hypot` | `[native code]` |
| 1.0% | 25.5ms | 1.0% | 25.5ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.0% | 25.4ms | 1.0% | 25.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.9% | 24.9ms | 2.7% | 70.1ms | `some` | `[native code]` |
| 0.9% | 24.4ms | 0.9% | 24.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 0.8% | 20.6ms | 0.8% | 20.6ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:350` |
| 0.8% | 20.4ms | 0.8% | 20.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` |
| 0.7% | 19.6ms | 0.7% | 19.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` |
| 0.7% | 18.6ms | 0.7% | 18.6ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` |
| 0.6% | 16.9ms | 0.6% | 17.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` |
| 0.6% | 16.8ms | 0.6% | 16.8ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.6% | 15.8ms | 0.6% | 15.8ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.6% | 15.4ms | 0.6% | 15.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` |
| 0.5% | 14.4ms | 0.6% | 15.9ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:287` |
| 0.5% | 14.2ms | 0.5% | 14.2ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` |
| 0.5% | 14.1ms | 0.6% | 15.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:737` |
| 0.5% | 13.1ms | 4.6% | 117.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` |
| 0.5% | 13.1ms | 1.1% | 29.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 0.4% | 12.4ms | 1.2% | 30.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` |
| 0.4% | 12.0ms | 0.4% | 12.0ms | `push` | `[native code]` |
| 0.4% | 11.2ms | 0.4% | 11.2ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.3% | 10.0ms | 0.3% | 10.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:739` |
| 0.3% | 9.9ms | 0.3% | 9.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:756` |
| 0.3% | 9.1ms | 7.0% | 177.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` |
| 0.3% | 8.2ms | 0.3% | 9.0ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:294` |
| 0.3% | 8.1ms | 4.1% | 105.0ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 0.3% | 7.9ms | 0.3% | 7.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` |
| 0.2% | 7.4ms | 0.2% | 7.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:753` |
| 0.2% | 7.4ms | 0.2% | 7.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:757` |
| 0.2% | 7.0ms | 0.2% | 7.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:681` |
| 0.2% | 7.0ms | 0.3% | 8.6ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.2% | 6.9ms | 0.3% | 7.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` |
| 0.2% | 6.7ms | 1.5% | 39.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:627` |
| 0.2% | 6.2ms | 0.2% | 6.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:752` |
| 0.2% | 6.0ms | 0.2% | 6.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` |
| 0.2% | 5.8ms | 2.7% | 70.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:609` |
| 0.2% | 5.5ms | 0.6% | 16.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:746` |
| 0.2% | 5.4ms | 0.2% | 5.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 0.2% | 5.1ms | 0.2% | 5.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` |
| 0.2% | 5.0ms | 0.2% | 5.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:206` |
| 0.1% | 4.9ms | 2.3% | 60.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:671` |
| 0.1% | 4.7ms | 0.4% | 12.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:722` |
| 0.1% | 4.6ms | 0.1% | 4.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:496` |
| 0.1% | 4.5ms | 6.9% | 174.7ms | `forEach` | `[native code]` |
| 0.1% | 4.3ms | 0.1% | 4.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.1% | 4.2ms | 0.4% | 10.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:209` |
| 0.1% | 3.6ms | 0.6% | 17.2ms | `anonymous` | `[native code]` |
| 0.1% | 3.5ms | 0.1% | 3.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:627` |
| 0.1% | 3.4ms | 0.1% | 4.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:763` |
| 0.1% | 3.4ms | 1.1% | 29.6ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.1% | 3.3ms | 0.1% | 3.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:696` |
| 0.1% | 3.3ms | 0.1% | 3.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` |
| 0.1% | 3.2ms | 0.1% | 4.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:661` |
| 0.1% | 3.0ms | 0.1% | 3.0ms | `abs` | `[native code]` |
| 0.1% | 3.0ms | 0.1% | 3.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.1% | 2.6ms | 0.1% | 2.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:603` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:215` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:762` |
| 0.0% | 2.3ms | 3.4% | 86.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:712` |
| 0.0% | 2.2ms | 0.1% | 2.9ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:571` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.0% | 1.9ms | 0.8% | 22.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:205` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.5ms | 1.2% | 30.9ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:584` |
| 0.0% | 1.5ms | 4.6% | 118.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:608` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:663` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:21` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `sqrt` | `[native code]` |
| 0.0% | 1.4ms | 0.1% | 2.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:741` |
| 0.0% | 1.3ms | 0.0% | 2.1ms | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:469` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:572` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:602` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 922us | 0.0% | 922us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:641` |
| 0.0% | 888us | 0.0% | 888us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:480` |
| 0.0% | 878us | 0.0% | 878us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:129` |
| 0.0% | 871us | 0.0% | 871us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:716` |
| 0.0% | 869us | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:728` |
| 0.0% | 854us | 0.0% | 854us | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` |
| 0.0% | 840us | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` |
| 0.0% | 840us | 1.0% | 25.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:653` |
| 0.0% | 837us | 0.0% | 837us | `now` | `[native code]` |
| 0.0% | 836us | 0.0% | 836us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` |
| 0.0% | 827us | 0.0% | 827us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:667` |
| 0.0% | 819us | 0.0% | 819us | `max` | `[native code]` |
| 0.0% | 812us | 0.4% | 10.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:211` |
| 0.0% | 809us | 0.0% | 809us | `min` | `[native code]` |
| 0.0% | 807us | 0.0% | 807us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:633` |
| 0.0% | 800us | 0.0% | 800us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:692` |
| 0.0% | 796us | 0.4% | 11.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:743` |
| 0.0% | 796us | 0.0% | 796us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` |
| 0.0% | 795us | 0.0% | 795us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` |
| 0.0% | 782us | 0.0% | 782us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 774us | 2.6% | 67.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` |
| 0.0% | 768us | 0.0% | 768us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:511` |
| 0.0% | 767us | 0.0% | 767us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |
| 0.0% | 758us | 0.0% | 758us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:431` |
| 0.0% | 757us | 0.0% | 757us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:149` |
| 0.0% | 755us | 0.0% | 755us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 747us | 1.3% | 35.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.0% | 732us | 0.0% | 732us | `reduce` | `[native code]` |
| 0.0% | 727us | 0.0% | 727us | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:575` |
| 0.0% | 717us | 0.0% | 717us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:213` |
| 0.0% | 711us | 0.4% | 12.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` |
| 0.0% | 710us | 0.0% | 710us | `WriteStream` | `internal:fs/streams` |
| 0.0% | 707us | 0.0% | 707us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:357` |
| 0.0% | 704us | 0.0% | 704us | `createIdentityMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:31` |
| 0.0% | 693us | 0.0% | 693us | `freeze` | `[native code]` |
| 0.0% | 690us | 0.0% | 690us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:514` |
| 0.0% | 673us | 0.4% | 12.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:742` |
| 0.0% | 635us | 0.2% | 7.4ms | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` |
| 0.0% | 625us | 0.0% | 625us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:86` |
| 0.0% | 621us | 0.0% | 621us | `internal:streams/operators` | `internal:streams/operators:194` |
| 0.0% | 570us | 0.0% | 570us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:689` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 99.0% | 2.49s | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 96.2% | 2.42s | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` |
| 22.8% | 574.8ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` |
| 16.6% | 418.8ms | 15.4% | 389.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` |
| 15.8% | 398.5ms | 14.6% | 368.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:688` |
| 14.1% | 355.6ms | 7.7% | 194.3ms | `map` | `[native code]` |
| 7.0% | 177.1ms | 0.3% | 9.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` |
| 6.9% | 174.7ms | 0.1% | 4.5ms | `forEach` | `[native code]` |
| 6.6% | 168.4ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:723` |
| 6.1% | 156.1ms | 1.3% | 34.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:725` |
| 5.2% | 131.5ms | 5.2% | 131.5ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 4.6% | 118.4ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:608` |
| 4.6% | 117.0ms | 0.5% | 13.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` |
| 4.1% | 105.6ms | 3.4% | 86.4ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 4.1% | 105.0ms | 0.3% | 8.1ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 4.1% | 103.8ms | 3.6% | 90.7ms | `mahalanobisSquaredWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:308` |
| 3.8% | 97.7ms | 3.8% | 97.7ms | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:419` |
| 3.5% | 89.9ms | 3.5% | 89.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:733` |
| 3.4% | 87.2ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` |
| 3.4% | 86.9ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:712` |
| 3.2% | 82.9ms | 1.9% | 50.2ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:253` |
| 3.2% | 80.8ms | 1.3% | 33.1ms | `from` | `[native code]` |
| 2.8% | 71.5ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` |
| 2.7% | 70.1ms | 0.9% | 24.9ms | `some` | `[native code]` |
| 2.7% | 70.0ms | 0.2% | 5.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:609` |
| 2.6% | 67.9ms | 0.0% | 774us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` |
| 2.3% | 60.2ms | 0.1% | 4.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:671` |
| 2.2% | 57.6ms | 2.2% | 57.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:708` |
| 2.2% | 57.6ms | 2.2% | 57.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 2.0% | 51.7ms | 2.0% | 51.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:705` |
| 1.9% | 49.5ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:721` |
| 1.9% | 49.2ms | 1.6% | 40.5ms | `sort` | `[native code]` |
| 1.6% | 42.6ms | 0.0% | 0us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 1.5% | 39.3ms | 0.2% | 6.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:627` |
| 1.4% | 36.3ms | 1.4% | 36.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 1.3% | 35.1ms | 0.0% | 0us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 1.3% | 35.1ms | 0.0% | 747us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 1.3% | 35.1ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 1.3% | 33.0ms | 1.3% | 33.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 1.3% | 32.8ms | 1.3% | 32.8ms | `fill` | `[native code]` |
| 1.2% | 30.9ms | 0.0% | 1.5ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:584` |
| 1.2% | 30.5ms | 0.4% | 12.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` |
| 1.1% | 29.9ms | 0.5% | 13.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 1.1% | 29.6ms | 0.1% | 3.4ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 1.1% | 29.6ms | 1.1% | 29.6ms | `hypot` | `[native code]` |
| 1.0% | 25.7ms | 0.0% | 840us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:653` |
| 1.0% | 25.5ms | 1.0% | 25.5ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.0% | 25.4ms | 1.0% | 25.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.9% | 24.4ms | 0.9% | 24.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 0.8% | 22.0ms | 0.0% | 1.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:205` |
| 0.8% | 20.6ms | 0.8% | 20.6ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:350` |
| 0.8% | 20.4ms | 0.8% | 20.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` |
| 0.7% | 19.6ms | 0.7% | 19.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` |
| 0.7% | 18.6ms | 0.7% | 18.6ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` |
| 0.6% | 17.6ms | 0.6% | 16.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` |
| 0.6% | 17.5ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:751` |
| 0.6% | 17.2ms | 0.1% | 3.6ms | `anonymous` | `[native code]` |
| 0.6% | 16.8ms | 0.6% | 16.8ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.6% | 16.3ms | 0.2% | 5.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:746` |
| 0.6% | 15.9ms | 0.5% | 14.4ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:287` |
| 0.6% | 15.8ms | 0.6% | 15.8ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.6% | 15.7ms | 0.5% | 14.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:737` |
| 0.6% | 15.4ms | 0.6% | 15.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` |
| 0.5% | 14.2ms | 0.5% | 14.2ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` |
| 0.4% | 12.4ms | 0.0% | 673us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:742` |
| 0.4% | 12.2ms | 0.0% | 711us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` |
| 0.4% | 12.0ms | 0.4% | 12.0ms | `push` | `[native code]` |
| 0.4% | 12.0ms | 0.1% | 4.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:722` |
| 0.4% | 11.2ms | 0.4% | 11.2ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.4% | 11.1ms | 0.0% | 796us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:743` |
| 0.4% | 10.4ms | 0.1% | 4.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:209` |
| 0.4% | 10.4ms | 0.0% | 812us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:211` |
| 0.4% | 10.3ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` |
| 0.3% | 10.0ms | 0.3% | 10.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:739` |
| 0.3% | 9.9ms | 0.3% | 9.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:756` |
| 0.3% | 9.0ms | 0.3% | 8.2ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:294` |
| 0.3% | 8.6ms | 0.2% | 7.0ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.3% | 7.9ms | 0.3% | 7.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` |
| 0.3% | 7.8ms | 0.2% | 6.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` |
| 0.2% | 7.4ms | 0.2% | 7.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:753` |
| 0.2% | 7.4ms | 0.0% | 635us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` |
| 0.2% | 7.4ms | 0.2% | 7.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:757` |
| 0.2% | 7.0ms | 0.2% | 7.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:681` |
| 0.2% | 6.2ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:628` |
| 0.2% | 6.2ms | 0.2% | 6.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:752` |
| 0.2% | 6.0ms | 0.2% | 6.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` |
| 0.2% | 5.6ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.2% | 5.6ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.2% | 5.4ms | 0.2% | 5.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 0.2% | 5.1ms | 0.2% | 5.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` |
| 0.2% | 5.0ms | 0.2% | 5.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:206` |
| 0.1% | 5.0ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:208` |
| 0.1% | 4.6ms | 0.0% | 0us | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:328` |
| 0.1% | 4.6ms | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:352` |
| 0.1% | 4.6ms | 0.1% | 4.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:496` |
| 0.1% | 4.3ms | 0.1% | 4.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.1% | 4.1ms | 0.1% | 3.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:763` |
| 0.1% | 4.0ms | 0.1% | 3.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:661` |
| 0.1% | 3.5ms | 0.1% | 3.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:627` |
| 0.1% | 3.3ms | 0.1% | 3.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:696` |
| 0.1% | 3.3ms | 0.1% | 3.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` |
| 0.1% | 3.0ms | 0.1% | 3.0ms | `abs` | `[native code]` |
| 0.1% | 3.0ms | 0.1% | 3.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.1% | 2.9ms | 0.0% | 2.2ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:571` |
| 0.1% | 2.7ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:741` |
| 0.1% | 2.6ms | 0.1% | 2.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:603` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:215` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:762` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.0% | 2.1ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:637` |
| 0.0% | 2.1ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 2.1ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 2.1ms | 0.0% | 1.3ms | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:469` |
| 0.0% | 2.0ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.6ms | 0.0% | 840us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` |
| 0.0% | 1.6ms | 0.0% | 869us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:728` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:663` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:21` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `sqrt` | `[native code]` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:572` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:602` |
| 0.0% | 1.3ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 1.3ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 1.3ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 922us | 0.0% | 922us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:641` |
| 0.0% | 888us | 0.0% | 888us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:480` |
| 0.0% | 878us | 0.0% | 878us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:129` |
| 0.0% | 871us | 0.0% | 871us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:716` |
| 0.0% | 854us | 0.0% | 854us | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` |
| 0.0% | 844us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:541` |
| 0.0% | 837us | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:88` |
| 0.0% | 837us | 0.0% | 837us | `now` | `[native code]` |
| 0.0% | 836us | 0.0% | 836us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` |
| 0.0% | 827us | 0.0% | 827us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:667` |
| 0.0% | 819us | 0.0% | 819us | `max` | `[native code]` |
| 0.0% | 809us | 0.0% | 809us | `min` | `[native code]` |
| 0.0% | 807us | 0.0% | 807us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:633` |
| 0.0% | 800us | 0.0% | 800us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:692` |
| 0.0% | 796us | 0.0% | 796us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` |
| 0.0% | 795us | 0.0% | 795us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` |
| 0.0% | 789us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:474` |
| 0.0% | 782us | 0.0% | 782us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 768us | 0.0% | 768us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:511` |
| 0.0% | 768us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:509` |
| 0.0% | 767us | 0.0% | 767us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |
| 0.0% | 758us | 0.0% | 758us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:431` |
| 0.0% | 757us | 0.0% | 757us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:149` |
| 0.0% | 755us | 0.0% | 755us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 732us | 0.0% | 732us | `reduce` | `[native code]` |
| 0.0% | 727us | 0.0% | 727us | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:575` |
| 0.0% | 717us | 0.0% | 717us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:213` |
| 0.0% | 710us | 0.0% | 710us | `WriteStream` | `internal:fs/streams` |
| 0.0% | 707us | 0.0% | 707us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:357` |
| 0.0% | 704us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:503` |
| 0.0% | 704us | 0.0% | 704us | `createIdentityMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:31` |
| 0.0% | 693us | 0.0% | 693us | `freeze` | `[native code]` |
| 0.0% | 693us | 0.0% | 0us | `createSafeIterator` | `internal:primordials:14` |
| 0.0% | 693us | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 693us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 693us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 693us | 0.0% | 0us | `internal:primordials` | `internal:primordials:51` |
| 0.0% | 690us | 0.0% | 690us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:514` |
| 0.0% | 689us | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 689us | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 689us | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 625us | 0.0% | 625us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:86` |
| 0.0% | 621us | 0.0% | 621us | `internal:streams/operators` | `internal:streams/operators:194` |
| 0.0% | 570us | 0.0% | 570us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:689` |

## Function Details

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` | Self: 15.4% (389.2ms) | Total: 16.6% (418.8ms) | Samples: 491

**Called by:**
- `step` (529)

**Calls:**
- `hypot` (38)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:688` | Self: 14.6% (368.4ms) | Total: 15.8% (398.5ms) | Samples: 460

**Called by:**
- `runTrial` (489)
- `runTrial` (3)

**Calls:**
- `createZeroMatrix` (29)
- `from` (2)
- `createZeroMatrix` (1)

### `map`
`[native code]` | Self: 7.7% (194.3ms) | Total: 14.1% (355.6ms) | Samples: 242

**Called by:**
- `step` (88)
- `step` (87)
- `step` (82)
- `(anonymous)` (72)
- `cloneMatrix` (53)
- `(anonymous)` (16)
- `step` (13)
- `jacobiEigenSymmetric` (11)
- `step` (10)
- `jacobiEigenSymmetric` (7)
- `jacobiEigenSymmetric` (6)
- `alignProjectionBasis` (5)
- `CMAESOptimizerND` (1)

**Calls:**
- `(anonymous)` (79)
- `(anonymous)` (61)
- `(anonymous)` (45)
- `repair` (19)
- `abs` (4)
- `(anonymous)` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 5.2% (131.5ms) | Total: 5.2% (131.5ms) | Samples: 166

**Called by:**
- `step` (166)

### `requireFiniteVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:419` | Self: 3.8% (97.7ms) | Total: 3.8% (97.7ms) | Samples: 118

**Called by:**
- `projectTo3D` (117)
- `CMAESOptimizerND` (1)

### `mahalanobisSquaredWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:308` | Self: 3.6% (90.7ms) | Total: 4.1% (103.8ms) | Samples: 113

**Called by:**
- `step` (128)

**Calls:**
- `createZeroVector` (8)
- `fill` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:733` | Self: 3.5% (89.9ms) | Total: 3.5% (89.9ms) | Samples: 115

**Called by:**
- `runTrial` (115)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` | Self: 3.4% (86.4ms) | Total: 4.1% (105.6ms) | Samples: 111

**Called by:**
- `step` (136)

**Calls:**
- `fill` (14)
- `createZeroVector` (10)
- `createZeroVector` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:708` | Self: 2.2% (57.6ms) | Total: 2.2% (57.6ms) | Samples: 73

**Called by:**
- `runTrial` (73)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 2.2% (57.6ms) | Total: 2.2% (57.6ms) | Samples: 75

**Called by:**
- `map` (61)
- `some` (13)
- `forEach` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:705` | Self: 2.0% (51.7ms) | Total: 2.0% (51.7ms) | Samples: 52

**Called by:**
- `runTrial` (52)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:253` | Self: 1.9% (50.2ms) | Total: 3.2% (82.9ms) | Samples: 65

**Called by:**
- `step` (105)

**Calls:**
- `from` (38)
- `createZeroMatrix` (2)

### `sort`
`[native code]` | Self: 1.6% (40.5ms) | Total: 1.9% (49.2ms) | Samples: 53

**Called by:**
- `step` (43)
- `jacobiEigenSymmetric` (22)

**Calls:**
- `(anonymous)` (7)
- `(anonymous)` (5)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 1.4% (36.3ms) | Total: 1.4% (36.3ms) | Samples: 45

**Called by:**
- `map` (45)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:725` | Self: 1.3% (34.7ms) | Total: 6.1% (156.1ms) | Samples: 42

**Called by:**
- `forEach` (188)

**Calls:**
- `projectTo3D` (124)
- `projectTo3D` (9)
- `projectTo3D` (8)
- `projectTo3D` (3)
- `projectTo3D` (2)

### `from`
`[native code]` | Self: 1.3% (33.1ms) | Total: 3.2% (80.8ms) | Samples: 42

**Called by:**
- `reconstructSymmetric` (38)
- `createZeroMatrix` (27)
- `jacobiEigenSymmetric` (22)
- `jacobiEigenSymmetric` (5)
- `step` (2)
- `CMAESOptimizerND` (1)

**Calls:**
- `(anonymous)` (25)
- `fill` (17)
- `(anonymous)` (10)
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` | Self: 1.3% (33.0ms) | Total: 1.3% (33.0ms) | Samples: 42

**Called by:**
- `runTrial` (42)

### `fill`
`[native code]` | Self: 1.3% (32.8ms) | Total: 1.3% (32.8ms) | Samples: 42

**Called by:**
- `from` (17)
- `transformFromEigenCoordinates` (14)
- `mahalanobisSquaredWithEigensystem` (7)
- `whitenWithEigensystem` (2)
- `step` (1)
- `whitenWithEigensystem` (1)

### `hypot`
`[native code]` | Self: 1.1% (29.6ms) | Total: 1.1% (29.6ms) | Samples: 38

**Called by:**
- `jacobiEigenSymmetric` (38)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.0% (25.5ms) | Total: 1.0% (25.5ms) | Samples: 33

**Called by:**
- `step` (13)
- `step` (12)
- `(anonymous)` (8)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 1.0% (25.4ms) | Total: 1.0% (25.4ms) | Samples: 25

**Called by:**
- `from` (25)

### `some`
`[native code]` | Self: 0.9% (24.9ms) | Total: 2.7% (70.1ms) | Samples: 33

**Called by:**
- `validateSquareFiniteMatrix` (46)
- `(anonymous)` (45)
- `projectTo3D` (1)

**Calls:**
- `(anonymous)` (46)
- `(anonymous)` (13)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` | Self: 0.9% (24.4ms) | Total: 0.9% (24.4ms) | Samples: 30

**Called by:**
- `step` (30)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:350` | Self: 0.8% (20.6ms) | Total: 0.8% (20.6ms) | Samples: 23

**Called by:**
- `step` (23)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` | Self: 0.8% (20.4ms) | Total: 0.8% (20.4ms) | Samples: 26

**Called by:**
- `runTrial` (26)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` | Self: 0.7% (19.6ms) | Total: 0.7% (19.6ms) | Samples: 25

**Called by:**
- `runTrial` (25)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` | Self: 0.7% (18.6ms) | Total: 0.7% (18.6ms) | Samples: 23

**Called by:**
- `step` (23)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` | Self: 0.6% (16.9ms) | Total: 0.6% (17.6ms) | Samples: 22

**Called by:**
- `runTrial` (23)

**Calls:**
- `sqrt` (1)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` | Self: 0.6% (16.8ms) | Total: 0.6% (16.8ms) | Samples: 22

**Called by:**
- `step` (22)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` | Self: 0.6% (15.8ms) | Total: 0.6% (15.8ms) | Samples: 19

**Called by:**
- `transformFromEigenCoordinates` (10)
- `mahalanobisSquaredWithEigensystem` (8)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` | Self: 0.6% (15.4ms) | Total: 0.6% (15.4ms) | Samples: 18

**Called by:**
- `runTrial` (18)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:287` | Self: 0.5% (14.4ms) | Total: 0.6% (15.9ms) | Samples: 16

**Called by:**
- `step` (18)

**Calls:**
- `fill` (2)

### `repair`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` | Self: 0.5% (14.2ms) | Total: 0.5% (14.2ms) | Samples: 19

**Called by:**
- `map` (19)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:737` | Self: 0.5% (14.1ms) | Total: 0.6% (15.7ms) | Samples: 19

**Called by:**
- `runTrial` (21)

**Calls:**
- `radius` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` | Self: 0.5% (13.1ms) | Total: 4.6% (117.0ms) | Samples: 17

**Called by:**
- `runTrial` (145)

**Calls:**
- `mahalanobisSquaredWithEigensystem` (128)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` | Self: 0.5% (13.1ms) | Total: 1.1% (29.9ms) | Samples: 16

**Called by:**
- `runTrial` (38)

**Calls:**
- `ellipsoidObjective` (22)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` | Self: 0.4% (12.4ms) | Total: 1.2% (30.5ms) | Samples: 16

**Called by:**
- `step` (38)

**Calls:**
- `from` (22)

### `push`
`[native code]` | Self: 0.4% (12.0ms) | Total: 0.4% (12.0ms) | Samples: 16

**Called by:**
- `step` (14)
- `step` (1)
- `step` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.4% (11.2ms) | Total: 0.4% (11.2ms) | Samples: 14

**Called by:**
- `step` (14)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:739` | Self: 0.3% (10.0ms) | Total: 0.3% (10.0ms) | Samples: 12

**Called by:**
- `runTrial` (12)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:756` | Self: 0.3% (9.9ms) | Total: 0.3% (9.9ms) | Samples: 12

**Called by:**
- `runTrial` (12)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` | Self: 0.3% (9.1ms) | Total: 7.0% (177.1ms) | Samples: 12

**Called by:**
- `runTrial` (217)

**Calls:**
- `sampleGaussianVectorND` (166)
- `sampleGaussianVectorND` (23)
- `push` (14)
- `sampleGaussianVectorND` (1)
- `sampleGaussianVectorND` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:294` | Self: 0.3% (8.2ms) | Total: 0.3% (9.0ms) | Samples: 11

**Called by:**
- `step` (12)

**Calls:**
- `fill` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` | Self: 0.3% (8.1ms) | Total: 4.1% (105.0ms) | Samples: 9

**Called by:**
- `(anonymous)` (124)
- `step` (1)
- `step` (1)

**Calls:**
- `requireFiniteVector` (117)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:212` | Self: 0.3% (7.9ms) | Total: 0.3% (7.9ms) | Samples: 10

**Called by:**
- `from` (10)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:753` | Self: 0.2% (7.4ms) | Total: 0.2% (7.4ms) | Samples: 7

**Called by:**
- `runTrial` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:757` | Self: 0.2% (7.4ms) | Total: 0.2% (7.4ms) | Samples: 10

**Called by:**
- `runTrial` (10)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:681` | Self: 0.2% (7.0ms) | Total: 0.2% (7.0ms) | Samples: 10

**Called by:**
- `runTrial` (10)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` | Self: 0.2% (7.0ms) | Total: 0.3% (8.6ms) | Samples: 7

**Called by:**
- `(anonymous)` (9)

**Calls:**
- `coordinate` (1)
- `coordinate` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` | Self: 0.2% (6.9ms) | Total: 0.3% (7.8ms) | Samples: 9

**Called by:**
- `runTrial` (10)

**Calls:**
- `push` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:627` | Self: 0.2% (6.7ms) | Total: 1.5% (39.3ms) | Samples: 8

**Called by:**
- `runTrial` (51)

**Calls:**
- `sort` (43)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:752` | Self: 0.2% (6.2ms) | Total: 0.2% (6.2ms) | Samples: 7

**Called by:**
- `runTrial` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` | Self: 0.2% (6.0ms) | Total: 0.2% (6.0ms) | Samples: 8

**Called by:**
- `runTrial` (8)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:609` | Self: 0.2% (5.8ms) | Total: 2.7% (70.0ms) | Samples: 8

**Called by:**
- `runTrial` (90)

**Calls:**
- `map` (82)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:746` | Self: 0.2% (5.5ms) | Total: 0.6% (16.3ms) | Samples: 7

**Called by:**
- `runTrial` (19)
- `runTrial` (1)

**Calls:**
- `map` (13)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` | Self: 0.2% (5.4ms) | Total: 0.2% (5.4ms) | Samples: 7

**Called by:**
- `step` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` | Self: 0.2% (5.1ms) | Total: 0.2% (5.1ms) | Samples: 6

**Called by:**
- `runTrial` (6)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:206` | Self: 0.2% (5.0ms) | Total: 0.2% (5.0ms) | Samples: 7

**Called by:**
- `sort` (7)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:671` | Self: 0.1% (4.9ms) | Total: 2.3% (60.2ms) | Samples: 7

**Called by:**
- `map` (79)

**Calls:**
- `map` (72)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:722` | Self: 0.1% (4.7ms) | Total: 0.4% (12.0ms) | Samples: 5

**Called by:**
- `runTrial` (15)

**Calls:**
- `map` (10)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:496` | Self: 0.1% (4.6ms) | Total: 0.1% (4.6ms) | Samples: 1

**Called by:**
- `nextOpenUnit` (1)

### `forEach`
`[native code]` | Self: 0.1% (4.5ms) | Total: 6.9% (174.7ms) | Samples: 5

**Called by:**
- `step` (205)
- `step` (7)

**Calls:**
- `(anonymous)` (188)
- `(anonymous)` (17)
- `(anonymous)` (1)
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` | Self: 0.1% (4.3ms) | Total: 0.1% (4.3ms) | Samples: 6

**Called by:**
- `runTrial` (6)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:209` | Self: 0.1% (4.2ms) | Total: 0.4% (10.4ms) | Samples: 6

**Called by:**
- `step` (13)

**Calls:**
- `map` (6)
- `max` (1)

### `anonymous`
`[native code]` | Self: 0.1% (3.6ms) | Total: 0.6% (17.2ms) | Samples: 5

**Called by:**
- `(anonymous)` (4)
- `get WriteStream` (3)
- `node:fs/promises` (3)
- `node:fs` (3)
- `internal:fs/streams` (2)
- `internal:stream` (2)
- `node:stream` (2)
- `node:events` (1)
- `internal:validators` (1)
- `internal:streams/pipeline` (1)
- `internal:shared` (1)
- `internal:streams/compose` (1)
- `internal:streams/duplex` (1)

**Calls:**
- `node:fs/promises` (3)
- `node:fs` (3)
- `internal:fs/streams` (2)
- `internal:stream` (2)
- `node:stream` (2)
- `node:events` (1)
- `internal:validators` (1)
- `internal:streams/pipeline` (1)
- `internal:shared` (1)
- `internal:streams/compose` (1)
- `internal:streams/duplex` (1)
- `internal:streams/operators` (1)
- `internal:primordials` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:627` | Self: 0.1% (3.5ms) | Total: 0.1% (3.5ms) | Samples: 5

**Called by:**
- `sort` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:763` | Self: 0.1% (3.4ms) | Total: 0.1% (4.1ms) | Samples: 5

**Called by:**
- `runTrial` (6)

**Calls:**
- `push` (1)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.1% (3.4ms) | Total: 1.1% (29.6ms) | Samples: 4

**Called by:**
- `step` (29)
- `reconstructSymmetric` (2)

**Calls:**
- `from` (27)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:696` | Self: 0.1% (3.3ms) | Total: 0.1% (3.3ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` | Self: 0.1% (3.3ms) | Total: 0.1% (3.3ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:661` | Self: 0.1% (3.2ms) | Total: 0.1% (4.0ms) | Samples: 4

**Called by:**
- `runTrial` (5)

**Calls:**
- `sqrt` (1)

### `abs`
`[native code]` | Self: 0.1% (3.0ms) | Total: 0.1% (3.0ms) | Samples: 4

**Called by:**
- `map` (4)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` | Self: 0.1% (3.0ms) | Total: 0.1% (3.0ms) | Samples: 4

**Called by:**
- `step` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:603` | Self: 0.1% (2.6ms) | Total: 0.1% (2.6ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:215` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 3

**Called by:**
- `step` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:762` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:712` | Self: 0.0% (2.3ms) | Total: 3.4% (86.9ms) | Samples: 3

**Called by:**
- `runTrial` (110)

**Calls:**
- `reconstructSymmetric` (105)
- `reconstructSymmetric` (2)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:571` | Self: 0.0% (2.2ms) | Total: 0.1% (2.9ms) | Samples: 3

**Called by:**
- `(anonymous)` (3)
- `step` (1)

**Calls:**
- `some` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.0% (2.2ms) | Total: 0.0% (2.2ms) | Samples: 3

**Called by:**
- `step` (3)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:205` | Self: 0.0% (1.9ms) | Total: 0.8% (22.0ms) | Samples: 3

**Called by:**
- `step` (30)

**Calls:**
- `sort` (22)
- `from` (5)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` | Self: 0.0% (1.7ms) | Total: 0.0% (1.7ms) | Samples: 2

**Called by:**
- `step` (2)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.7ms) | Total: 0.0% (1.7ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `radius`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `step` (2)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:584` | Self: 0.0% (1.5ms) | Total: 1.2% (30.9ms) | Samples: 2

**Called by:**
- `step` (38)

**Calls:**
- `cloneMatrix` (31)
- `map` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:608` | Self: 0.0% (1.5ms) | Total: 4.6% (118.4ms) | Samples: 2

**Called by:**
- `runTrial` (152)

**Calls:**
- `transformFromEigenCoordinates` (136)
- `transformFromEigenCoordinates` (14)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:663` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:21` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `transformFromEigenCoordinates` (1)
- `step` (1)

### `sqrt`
`[native code]` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `step` (1)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:741` | Self: 0.0% (1.4ms) | Total: 0.1% (2.7ms) | Samples: 2

**Called by:**
- `runTrial` (4)

**Calls:**
- `variancePercent` (2)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:469` | Self: 0.0% (1.3ms) | Total: 0.0% (2.1ms) | Samples: 1

**Called by:**
- `runTrial` (2)

**Calls:**
- `(anonymous)` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:572` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `(anonymous)` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:602` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `variancePercent`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:641` | Self: 0.0% (922us) | Total: 0.0% (922us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:480` | Self: 0.0% (888us) | Total: 0.0% (888us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:129` | Self: 0.0% (878us) | Total: 0.0% (878us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:716` | Self: 0.0% (871us) | Total: 0.0% (871us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:728` | Self: 0.0% (869us) | Total: 0.0% (1.6ms) | Samples: 1

**Called by:**
- `runTrial` (2)

**Calls:**
- `reduce` (1)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` | Self: 0.0% (854us) | Total: 0.0% (854us) | Samples: 1

**Called by:**
- `projectTo3D` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:717` | Self: 0.0% (840us) | Total: 0.0% (1.6ms) | Samples: 1

**Called by:**
- `runTrial` (2)

**Calls:**
- `min` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:653` | Self: 0.0% (840us) | Total: 1.0% (25.7ms) | Samples: 1

**Called by:**
- `runTrial` (31)

**Calls:**
- `whitenWithEigensystem` (18)
- `whitenWithEigensystem` (12)

### `now`
`[native code]` | Self: 0.0% (837us) | Total: 0.0% (837us) | Samples: 1

**Called by:**
- `(module)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` | Self: 0.0% (836us) | Total: 0.0% (836us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:667` | Self: 0.0% (827us) | Total: 0.0% (827us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `max`
`[native code]` | Self: 0.0% (819us) | Total: 0.0% (819us) | Samples: 1

**Called by:**
- `jacobiEigenSymmetric` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:211` | Self: 0.0% (812us) | Total: 0.4% (10.4ms) | Samples: 1

**Called by:**
- `step` (12)

**Calls:**
- `map` (11)

### `min`
`[native code]` | Self: 0.0% (809us) | Total: 0.0% (809us) | Samples: 1

**Called by:**
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:633` | Self: 0.0% (807us) | Total: 0.0% (807us) | Samples: 1

**Called by:**
- `forEach` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:692` | Self: 0.0% (800us) | Total: 0.0% (800us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:743` | Self: 0.0% (796us) | Total: 0.4% (11.1ms) | Samples: 1

**Called by:**
- `runTrial` (14)

**Calls:**
- `projectTo3D` (12)
- `projectTo3D` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` | Self: 0.0% (796us) | Total: 0.0% (796us) | Samples: 1

**Called by:**
- `map` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` | Self: 0.0% (795us) | Total: 0.0% (795us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (782us) | Total: 0.0% (782us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` | Self: 0.0% (774us) | Total: 2.6% (67.9ms) | Samples: 1

**Called by:**
- `runTrial` (88)

**Calls:**
- `map` (87)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:511` | Self: 0.0% (768us) | Total: 0.0% (768us) | Samples: 1

**Called by:**
- `from` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` | Self: 0.0% (767us) | Total: 0.0% (767us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:431` | Self: 0.0% (758us) | Total: 0.0% (758us) | Samples: 1

**Called by:**
- `CMAESOptimizerND` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:149` | Self: 0.0% (757us) | Total: 0.0% (757us) | Samples: 1

**Called by:**
- `step` (1)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (755us) | Total: 0.0% (755us) | Samples: 1

**Called by:**
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (747us) | Total: 1.3% (35.1ms) | Samples: 1

**Called by:**
- `some` (46)

**Calls:**
- `some` (45)

### `reduce`
`[native code]` | Self: 0.0% (732us) | Total: 0.0% (732us) | Samples: 1

**Called by:**
- `step` (1)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:575` | Self: 0.0% (727us) | Total: 0.0% (727us) | Samples: 1

**Called by:**
- `projectTo3D` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:213` | Self: 0.0% (717us) | Total: 0.0% (717us) | Samples: 1

**Called by:**
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` | Self: 0.0% (711us) | Total: 0.4% (12.2ms) | Samples: 1

**Called by:**
- `forEach` (17)

**Calls:**
- `map` (16)

### `WriteStream`
`internal:fs/streams` | Self: 0.0% (710us) | Total: 0.0% (710us) | Samples: 1

**Called by:**
- `(anonymous)` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:357` | Self: 0.0% (707us) | Total: 0.0% (707us) | Samples: 1

**Called by:**
- `step` (1)

### `createIdentityMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:31` | Self: 0.0% (704us) | Total: 0.0% (704us) | Samples: 1

**Called by:**
- `CMAESOptimizerND` (1)

### `freeze`
`[native code]` | Self: 0.0% (693us) | Total: 0.0% (693us) | Samples: 1

**Called by:**
- `createSafeIterator` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:514` | Self: 0.0% (690us) | Total: 0.0% (690us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:742` | Self: 0.0% (673us) | Total: 0.4% (12.4ms) | Samples: 1

**Called by:**
- `runTrial` (15)
- `runTrial` (1)

**Calls:**
- `projectTo3D` (13)
- `projectTo3D` (1)
- `projectTo3D` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` | Self: 0.0% (635us) | Total: 0.2% (7.4ms) | Samples: 1

**Called by:**
- `(module)` (9)

**Calls:**
- `CMAESOptimizerND` (2)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:86` | Self: 0.0% (625us) | Total: 0.0% (625us) | Samples: 1

### `internal:streams/operators`
`internal:streams/operators:194` | Self: 0.0% (621us) | Total: 0.0% (621us) | Samples: 1

**Called by:**
- `anonymous` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:689` | Self: 0.0% (570us) | Total: 0.0% (570us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (689us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:primordials`
`internal:primordials:51` | Self: 0.0% (0us) | Total: 0.0% (693us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `createSafeIterator` (1)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.3ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (693us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (2.1ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (2.1ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `nextOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:328` | Self: 0.0% (0us) | Total: 0.1% (4.6ms) | Samples: 0

**Called by:**
- `sampleGaussianVectorND` (1)

**Calls:**
- `(anonymous)` (1)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (0us) | Total: 1.3% (35.1ms) | Samples: 0

**Called by:**
- `jacobiEigenSymmetric` (46)

**Calls:**
- `some` (46)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` | Self: 0.0% (0us) | Total: 3.4% (87.2ms) | Samples: 0

**Calls:**
- `runTrial` (97)
- `runTrial` (3)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (693us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` | Self: 0.0% (0us) | Total: 2.8% (71.5ms) | Samples: 0

**Called by:**
- `runTrial` (88)

**Calls:**
- `map` (88)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:711` | Self: 0.0% (0us) | Total: 22.8% (574.8ms) | Samples: 0

**Called by:**
- `runTrial` (725)
- `runTrial` (3)

**Calls:**
- `jacobiEigenSymmetric` (529)
- `jacobiEigenSymmetric` (46)
- `jacobiEigenSymmetric` (38)
- `jacobiEigenSymmetric` (30)
- `jacobiEigenSymmetric` (30)
- `jacobiEigenSymmetric` (13)
- `jacobiEigenSymmetric` (12)
- `jacobiEigenSymmetric` (7)
- `jacobiEigenSymmetric` (7)
- `jacobiEigenSymmetric` (4)
- `jacobiEigenSymmetric` (3)
- `jacobiEigenSymmetric` (3)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:751` | Self: 0.0% (0us) | Total: 0.6% (17.5ms) | Samples: 0

**Called by:**
- `runTrial` (22)

**Calls:**
- `cloneMatrix` (22)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` | Self: 0.0% (0us) | Total: 1.3% (35.1ms) | Samples: 0

**Called by:**
- `step` (46)

**Calls:**
- `validateSquareFiniteMatrix` (46)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:352` | Self: 0.0% (0us) | Total: 0.1% (4.6ms) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `nextOpenUnit` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` | Self: 0.0% (0us) | Total: 0.2% (5.6ms) | Samples: 0

**Calls:**
- `(anonymous)` (8)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:541` | Self: 0.0% (0us) | Total: 0.0% (844us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `map` (1)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (689us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.3ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:474` | Self: 0.0% (0us) | Total: 0.0% (789us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `requireFiniteVector` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:509` | Self: 0.0% (0us) | Total: 0.0% (768us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `from` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` | Self: 0.0% (0us) | Total: 99.0% (2.49s) | Samples: 0

**Called by:**
- `(module)` (3017)
- `(module)` (97)

**Calls:**
- `step` (725)
- `step` (489)
- `step` (217)
- `step` (204)
- `step` (152)
- `step` (145)
- `step` (115)
- `step` (110)
- `step` (90)
- `step` (88)
- `step` (88)
- `step` (73)
- `step` (61)
- `step` (52)
- `step` (51)
- `step` (42)
- `step` (38)
- `step` (31)
- `step` (26)
- `step` (25)
- `step` (23)
- `step` (22)
- `step` (21)
- `step` (19)
- `step` (18)
- `step` (15)
- `step` (15)
- `step` (14)
- `step` (12)
- `step` (12)
- `step` (10)
- `step` (10)
- `step` (10)
- `step` (8)
- `step` (7)
- `step` (7)
- `step` (7)
- `step` (6)
- `step` (6)
- `step` (6)
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

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:503` | Self: 0.0% (0us) | Total: 0.0% (704us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `createIdentityMatrix` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:628` | Self: 0.0% (0us) | Total: 0.2% (6.2ms) | Samples: 0

**Called by:**
- `runTrial` (7)

**Calls:**
- `forEach` (7)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (2.0ms) | Samples: 0

**Called by:**
- `(anonymous)` (3)

**Calls:**
- `anonymous` (3)

### `createSafeIterator`
`internal:primordials:14` | Self: 0.0% (0us) | Total: 0.0% (693us) | Samples: 0

**Called by:**
- `internal:primordials` (1)

**Calls:**
- `freeze` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:721` | Self: 0.0% (0us) | Total: 1.9% (49.5ms) | Samples: 0

**Called by:**
- `runTrial` (61)

**Calls:**
- `alignProjectionBasis` (38)
- `alignProjectionBasis` (23)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (689us) | Samples: 0

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

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.2% (5.6ms) | Samples: 0

**Called by:**
- `(module)` (8)

**Calls:**
- `anonymous` (4)
- `get WriteStream` (3)
- `WriteStream` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:208` | Self: 0.0% (0us) | Total: 0.1% (5.0ms) | Samples: 0

**Called by:**
- `step` (7)

**Calls:**
- `map` (7)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:88` | Self: 0.0% (0us) | Total: 0.0% (837us) | Samples: 0

**Calls:**
- `now` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` | Self: 0.0% (0us) | Total: 0.4% (10.3ms) | Samples: 0

**Called by:**
- `(module)` (8)
- `(module)` (3)

**Calls:**
- `step` (3)
- `step` (3)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 0.0% (0us) | Total: 1.6% (42.6ms) | Samples: 0

**Called by:**
- `alignProjectionBasis` (31)
- `step` (22)

**Calls:**
- `map` (53)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:723` | Self: 0.0% (0us) | Total: 6.6% (168.4ms) | Samples: 0

**Called by:**
- `runTrial` (204)
- `runTrial` (1)

**Calls:**
- `forEach` (205)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:637` | Self: 0.0% (0us) | Total: 0.0% (2.1ms) | Samples: 0

**Called by:**
- `runTrial` (3)

**Calls:**
- `fill` (1)
- `createZeroVector` (1)
- `createZeroVector` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` | Self: 0.0% (0us) | Total: 96.2% (2.42s) | Samples: 0

**Calls:**
- `runTrial` (3017)
- `runTrial` (9)
- `runTrial` (8)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (693us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 83.9% | 2.11s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 15.2% | 384.1ms | `[native code]` |
| 0.7% | 18.0ms | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.0% | 710us | `internal:fs/streams` |
| 0.0% | 621us | `internal:streams/operators` |
