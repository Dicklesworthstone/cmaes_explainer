# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 10.34s | 13447 | 500us | 169 |

**Top 10:** `jacobiEigenSymmetric` 35.9%, `step` 27.0%, `step` 4.1%, `transformFromEigenCoordinates` 3.8%, `reconstructSymmetric` 3.5%, `step` 2.9%, `whitenAdaptationPointWithEigensystem` 2.2%, `step` 1.7%, `fill` 1.5%, `hypot` 1.5%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 35.9% | 3.71s | 37.5% | 3.88s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 27.0% | 2.79s | 27.0% | 2.79s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:668` |
| 4.1% | 432.8ms | 4.1% | 432.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |
| 3.8% | 398.9ms | 4.0% | 416.4ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 3.5% | 371.2ms | 4.0% | 417.4ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` |
| 2.9% | 303.4ms | 2.9% | 303.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` |
| 2.2% | 235.3ms | 2.3% | 240.6ms | `whitenAdaptationPointWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:288` |
| 1.7% | 180.8ms | 1.7% | 180.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:690` |
| 1.5% | 161.5ms | 1.5% | 161.5ms | `fill` | `[native code]` |
| 1.5% | 160.6ms | 1.5% | 160.6ms | `hypot` | `[native code]` |
| 1.4% | 145.2ms | 1.4% | 150.0ms | `whitenAdaptationPointWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:297` |
| 1.2% | 133.8ms | 1.2% | 133.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 1.2% | 128.4ms | 1.2% | 128.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:687` |
| 1.2% | 127.1ms | 2.5% | 266.5ms | `map` | `[native code]` |
| 1.1% | 117.4ms | 1.8% | 194.1ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.6% | 70.0ms | 0.6% | 70.0ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.6% | 65.1ms | 0.9% | 95.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.5% | 53.1ms | 0.5% | 53.1ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 0.4% | 46.3ms | 0.4% | 48.4ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:548` |
| 0.4% | 45.4ms | 0.4% | 45.4ms | `Float64Array` | `[native code]` |
| 0.3% | 39.8ms | 0.4% | 51.3ms | `sort` | `[native code]` |
| 0.3% | 38.4ms | 1.2% | 129.5ms | `some` | `[native code]` |
| 0.3% | 37.3ms | 1.1% | 117.5ms | `from` | `[native code]` |
| 0.3% | 34.8ms | 0.3% | 34.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.3% | 34.4ms | 0.6% | 67.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.3% | 32.8ms | 0.3% | 32.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.2% | 30.6ms | 1.4% | 149.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:707` |
| 0.2% | 29.8ms | 0.2% | 29.8ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 0.2% | 24.5ms | 0.2% | 25.9ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` |
| 0.2% | 24.4ms | 0.2% | 24.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` |
| 0.2% | 22.3ms | 0.2% | 22.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.1% | 20.4ms | 0.6% | 70.0ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.1% | 20.0ms | 0.1% | 20.0ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.1% | 17.2ms | 0.1% | 17.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` |
| 0.1% | 16.8ms | 0.1% | 16.8ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:328` |
| 0.1% | 16.6ms | 0.1% | 16.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` |
| 0.1% | 11.4ms | 0.1% | 11.4ms | `push` | `[native code]` |
| 0.1% | 10.7ms | 0.1% | 10.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:678` |
| 0.0% | 9.8ms | 0.0% | 9.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` |
| 0.0% | 8.2ms | 0.1% | 16.8ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:558` |
| 0.0% | 7.7ms | 0.0% | 7.7ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:555` |
| 0.0% | 7.1ms | 0.0% | 7.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:734` |
| 0.0% | 6.9ms | 0.0% | 6.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:625` |
| 0.0% | 6.2ms | 2.1% | 227.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:585` |
| 0.0% | 6.0ms | 0.0% | 6.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 5.5ms | 0.0% | 5.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:721` |
| 0.0% | 5.4ms | 0.0% | 5.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 0.0% | 4.1ms | 0.0% | 5.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:658` |
| 0.0% | 3.9ms | 0.1% | 19.8ms | `anonymous` | `[native code]` |
| 0.0% | 3.9ms | 0.0% | 3.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:584` |
| 0.0% | 3.9ms | 0.0% | 3.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:738` |
| 0.0% | 3.8ms | 0.1% | 11.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:728` |
| 0.0% | 3.7ms | 0.0% | 9.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.0% | 3.6ms | 0.4% | 50.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.0% | 3.4ms | 0.0% | 3.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` |
| 0.0% | 3.4ms | 0.0% | 3.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.2ms | 0.0% | 3.2ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.2ms | 0.3% | 34.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.0% | 3.2ms | 0.0% | 3.2ms | `whitenAdaptationPointWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:287` |
| 0.0% | 3.0ms | 0.0% | 3.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:719` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:479` |
| 0.0% | 3.0ms | 1.6% | 169.5ms | `forEach` | `[native code]` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:735` |
| 0.0% | 2.8ms | 0.7% | 72.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:589` |
| 0.0% | 2.5ms | 0.0% | 2.5ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `abs` | `[native code]` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:648` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:397` |
| 0.0% | 2.0ms | 0.4% | 47.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:588` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:744` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:591` |
| 0.0% | 1.7ms | 1.4% | 145.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:409` |
| 0.0% | 1.5ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:710` |
| 0.0% | 1.5ms | 0.6% | 65.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:550` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.5ms | 0.0% | 4.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:745` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:252` |
| 0.0% | 1.4ms | 0.2% | 23.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 0.0% | 1.3ms | 0.0% | 2.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:641` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `reduce` | `[native code]` |
| 0.0% | 1.1ms | 4.0% | 421.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` |
| 0.0% | 905us | 0.0% | 905us | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 896us | 0.0% | 896us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:704` |
| 0.0% | 896us | 99.4% | 10.29s | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 0.0% | 887us | 0.0% | 887us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:253` |
| 0.0% | 876us | 0.0% | 876us | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 870us | 0.0% | 870us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:699` |
| 0.0% | 869us | 0.0% | 869us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 0.0% | 864us | 0.0% | 864us | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 854us | 0.0% | 854us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:119` |
| 0.0% | 843us | 0.0% | 843us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` |
| 0.0% | 837us | 0.0% | 837us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 0.0% | 819us | 0.0% | 819us | `whitenAdaptationPointWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 810us | 0.0% | 810us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:581` |
| 0.0% | 798us | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:723` |
| 0.0% | 798us | 0.0% | 798us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:499` |
| 0.0% | 790us | 0.0% | 790us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` |
| 0.0% | 781us | 0.0% | 781us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` |
| 0.0% | 749us | 0.0% | 8.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:725` |
| 0.0% | 736us | 0.0% | 736us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 714us | 0.0% | 714us | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:21` |
| 0.0% | 711us | 0.0% | 711us | `node:fs` | `node:fs:291` |
| 0.0% | 710us | 0.0% | 710us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:739` |
| 0.0% | 705us | 0.4% | 51.2ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 0.0% | 696us | 0.0% | 696us | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 695us | 0.0% | 695us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` |
| 0.0% | 695us | 0.0% | 695us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:640` |
| 0.0% | 691us | 0.3% | 33.6ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.0% | 685us | 0.0% | 685us | `WriteStream` | `internal:fs/streams` |
| 0.0% | 672us | 0.0% | 672us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 652us | 0.0% | 652us | `max` | `[native code]` |
| 0.0% | 642us | 0.0% | 642us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:485` |
| 0.0% | 636us | 0.0% | 636us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:150` |
| 0.0% | 632us | 0.0% | 632us | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 632us | 0.0% | 632us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:579` |
| 0.0% | 630us | 0.0% | 630us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:451` |
| 0.0% | 626us | 0.0% | 626us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:683` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 99.4% | 10.29s | 0.0% | 896us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 93.3% | 9.66s | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` |
| 40.4% | 4.18s | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` |
| 37.5% | 3.88s | 35.9% | 3.71s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 27.0% | 2.79s | 27.0% | 2.79s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:668` |
| 6.5% | 677.2ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` |
| 4.1% | 432.8ms | 4.1% | 432.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |
| 4.0% | 421.5ms | 0.0% | 1.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` |
| 4.0% | 417.4ms | 3.5% | 371.2ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` |
| 4.0% | 417.4ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:694` |
| 4.0% | 416.4ms | 3.8% | 398.9ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 3.8% | 394.6ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:651` |
| 2.9% | 303.4ms | 2.9% | 303.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` |
| 2.5% | 266.5ms | 1.2% | 127.1ms | `map` | `[native code]` |
| 2.3% | 240.6ms | 2.2% | 235.3ms | `whitenAdaptationPointWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:288` |
| 2.1% | 227.1ms | 0.0% | 6.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:585` |
| 1.8% | 194.1ms | 1.1% | 117.4ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.7% | 180.8ms | 1.7% | 180.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:690` |
| 1.6% | 169.5ms | 0.0% | 3.0ms | `forEach` | `[native code]` |
| 1.6% | 167.9ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:705` |
| 1.5% | 161.5ms | 1.5% | 161.5ms | `fill` | `[native code]` |
| 1.5% | 160.6ms | 1.5% | 160.6ms | `hypot` | `[native code]` |
| 1.4% | 150.0ms | 1.4% | 145.2ms | `whitenAdaptationPointWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:297` |
| 1.4% | 149.1ms | 0.2% | 30.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:707` |
| 1.4% | 145.9ms | 0.0% | 1.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` |
| 1.2% | 133.8ms | 1.2% | 133.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 1.2% | 129.5ms | 0.3% | 38.4ms | `some` | `[native code]` |
| 1.2% | 128.4ms | 1.2% | 128.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:687` |
| 1.1% | 122.3ms | 0.0% | 0us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 1.1% | 117.5ms | 0.3% | 37.3ms | `from` | `[native code]` |
| 0.9% | 95.1ms | 0.6% | 65.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.7% | 72.9ms | 0.0% | 2.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:589` |
| 0.6% | 70.0ms | 0.6% | 70.0ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.6% | 70.0ms | 0.1% | 20.4ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.6% | 67.8ms | 0.3% | 34.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.6% | 65.5ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 0.6% | 65.5ms | 0.0% | 1.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.6% | 65.5ms | 0.0% | 0us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.5% | 57.3ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:631` |
| 0.5% | 53.1ms | 0.5% | 53.1ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 0.4% | 51.3ms | 0.3% | 39.8ms | `sort` | `[native code]` |
| 0.4% | 51.2ms | 0.0% | 705us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 0.4% | 50.7ms | 0.0% | 3.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.4% | 48.4ms | 0.4% | 46.3ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:548` |
| 0.4% | 47.7ms | 0.0% | 2.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:588` |
| 0.4% | 45.4ms | 0.4% | 45.4ms | `Float64Array` | `[native code]` |
| 0.4% | 44.9ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:733` |
| 0.3% | 39.9ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:574` |
| 0.3% | 39.7ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` |
| 0.3% | 38.0ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 0.3% | 34.8ms | 0.3% | 34.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.3% | 34.7ms | 0.0% | 3.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.3% | 33.6ms | 0.0% | 691us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.3% | 32.8ms | 0.3% | 32.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.2% | 29.8ms | 0.2% | 29.8ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 0.2% | 25.9ms | 0.2% | 24.5ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` |
| 0.2% | 24.4ms | 0.2% | 24.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` |
| 0.2% | 23.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 0.2% | 22.3ms | 0.2% | 22.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.1% | 20.0ms | 0.1% | 20.0ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.1% | 19.8ms | 0.0% | 3.9ms | `anonymous` | `[native code]` |
| 0.1% | 17.2ms | 0.1% | 17.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` |
| 0.1% | 16.8ms | 0.1% | 16.8ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:328` |
| 0.1% | 16.8ms | 0.0% | 8.2ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:558` |
| 0.1% | 16.6ms | 0.1% | 16.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` |
| 0.1% | 15.4ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 0.1% | 13.1ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` |
| 0.1% | 11.4ms | 0.1% | 11.4ms | `push` | `[native code]` |
| 0.1% | 11.4ms | 0.0% | 3.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:728` |
| 0.1% | 10.7ms | 0.1% | 10.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:678` |
| 0.1% | 10.7ms | 0.0% | 0us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:706` |
| 0.0% | 9.8ms | 0.0% | 9.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` |
| 0.0% | 9.6ms | 0.0% | 3.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.0% | 8.6ms | 0.0% | 749us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:725` |
| 0.0% | 8.4ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` |
| 0.0% | 7.7ms | 0.0% | 7.7ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:555` |
| 0.0% | 7.1ms | 0.0% | 7.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:734` |
| 0.0% | 6.9ms | 0.0% | 6.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:625` |
| 0.0% | 6.0ms | 0.0% | 6.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 5.5ms | 0.0% | 5.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:721` |
| 0.0% | 5.4ms | 0.0% | 5.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 0.0% | 5.4ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:704` |
| 0.0% | 5.3ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.0% | 5.3ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.0% | 5.3ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` |
| 0.0% | 5.0ms | 0.0% | 4.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:658` |
| 0.0% | 4.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:745` |
| 0.0% | 4.0ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 3.9ms | 0.0% | 3.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:584` |
| 0.0% | 3.9ms | 0.0% | 3.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:738` |
| 0.0% | 3.7ms | 0.0% | 3.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:719` |
| 0.0% | 3.6ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:615` |
| 0.0% | 3.4ms | 0.0% | 3.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` |
| 0.0% | 3.4ms | 0.0% | 3.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.2ms | 0.0% | 3.2ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.2ms | 0.0% | 3.2ms | `whitenAdaptationPointWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:287` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:479` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:735` |
| 0.0% | 2.5ms | 0.0% | 2.5ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` |
| 0.0% | 2.4ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 0.0% | 2.2ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:710` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `abs` | `[native code]` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:648` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:397` |
| 0.0% | 2.0ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:641` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:744` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:591` |
| 0.0% | 1.6ms | 0.0% | 798us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:723` |
| 0.0% | 1.6ms | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:478` |
| 0.0% | 1.6ms | 0.0% | 0us | `createIdentityMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:31` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 1.6ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 1.6ms | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:447` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:409` |
| 0.0% | 1.5ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:550` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.5ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 1.5ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 1.5ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 1.5ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:252` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `reduce` | `[native code]` |
| 0.0% | 905us | 0.0% | 905us | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 896us | 0.0% | 896us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:704` |
| 0.0% | 887us | 0.0% | 887us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:253` |
| 0.0% | 876us | 0.0% | 876us | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 870us | 0.0% | 870us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:699` |
| 0.0% | 869us | 0.0% | 869us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 0.0% | 864us | 0.0% | 864us | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 856us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 856us | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 856us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 854us | 0.0% | 854us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:119` |
| 0.0% | 843us | 0.0% | 843us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` |
| 0.0% | 837us | 0.0% | 837us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 0.0% | 819us | 0.0% | 819us | `whitenAdaptationPointWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 810us | 0.0% | 810us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:581` |
| 0.0% | 805us | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 805us | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 805us | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 798us | 0.0% | 798us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:499` |
| 0.0% | 795us | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:334` |
| 0.0% | 790us | 0.0% | 790us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` |
| 0.0% | 781us | 0.0% | 781us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` |
| 0.0% | 740us | 0.0% | 0us | `internal:streams/operators` | `internal:streams/operators:2` |
| 0.0% | 740us | 0.0% | 0us | `internal:streams/end-of-stream` | `internal:streams/end-of-stream:17` |
| 0.0% | 736us | 0.0% | 736us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 714us | 0.0% | 714us | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:21` |
| 0.0% | 711us | 0.0% | 711us | `node:fs` | `node:fs:291` |
| 0.0% | 710us | 0.0% | 710us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:739` |
| 0.0% | 696us | 0.0% | 696us | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 696us | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:330` |
| 0.0% | 695us | 0.0% | 695us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:640` |
| 0.0% | 695us | 0.0% | 695us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` |
| 0.0% | 693us | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:95` |
| 0.0% | 685us | 0.0% | 685us | `WriteStream` | `internal:fs/streams` |
| 0.0% | 672us | 0.0% | 672us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 652us | 0.0% | 652us | `max` | `[native code]` |
| 0.0% | 642us | 0.0% | 642us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:485` |
| 0.0% | 636us | 0.0% | 636us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:150` |
| 0.0% | 632us | 0.0% | 632us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:579` |
| 0.0% | 632us | 0.0% | 632us | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 630us | 0.0% | 630us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:451` |
| 0.0% | 626us | 0.0% | 626us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:683` |

## Function Details

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` | Self: 35.9% (3.71s) | Total: 37.5% (3.88s) | Samples: 4839

**Called by:**
- `step` (5044)

**Calls:**
- `hypot` (205)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:668` | Self: 27.0% (2.79s) | Total: 27.0% (2.79s) | Samples: 3626

**Called by:**
- `runTrial` (3615)
- `runTrial` (12)

**Calls:**
- `adaptationPoint` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` | Self: 4.1% (432.8ms) | Total: 4.1% (432.8ms) | Samples: 566

**Called by:**
- `runTrial` (566)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` | Self: 3.8% (398.9ms) | Total: 4.0% (416.4ms) | Samples: 530

**Called by:**
- `step` (549)

**Calls:**
- `createZeroVector` (14)
- `fill` (5)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` | Self: 3.5% (371.2ms) | Total: 4.0% (417.4ms) | Samples: 490

**Called by:**
- `step` (546)

**Calls:**
- `from` (55)
- `createZeroMatrix` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:715` | Self: 2.9% (303.4ms) | Total: 2.9% (303.4ms) | Samples: 394

**Called by:**
- `runTrial` (392)
- `runTrial` (2)

### `whitenAdaptationPointWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:288` | Self: 2.2% (235.3ms) | Total: 2.3% (240.6ms) | Samples: 302

**Called by:**
- `step` (309)

**Calls:**
- `createZeroVector` (5)
- `fill` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:690` | Self: 1.7% (180.8ms) | Total: 1.7% (180.8ms) | Samples: 237

**Called by:**
- `runTrial` (237)

### `fill`
`[native code]` | Self: 1.5% (161.5ms) | Total: 1.5% (161.5ms) | Samples: 211

**Called by:**
- `sampleGaussianVectorND` (101)
- `ellipsoidObjective` (64)
- `from` (30)
- `transformFromEigenCoordinates` (5)
- `whitenAdaptationPointWithEigensystem` (4)
- `whitenAdaptationPointWithEigensystem` (2)
- `whitenWithEigensystem` (2)
- `step` (2)
- `sampleGaussianVectorND` (1)

### `hypot`
`[native code]` | Self: 1.5% (160.6ms) | Total: 1.5% (160.6ms) | Samples: 205

**Called by:**
- `jacobiEigenSymmetric` (205)

### `whitenAdaptationPointWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:297` | Self: 1.4% (145.2ms) | Total: 1.4% (150.0ms) | Samples: 191

**Called by:**
- `step` (197)

**Calls:**
- `fill` (4)
- `createZeroVector` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 1.2% (133.8ms) | Total: 1.2% (133.8ms) | Samples: 167

**Called by:**
- `map` (167)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:687` | Self: 1.2% (128.4ms) | Total: 1.2% (128.4ms) | Samples: 169

**Called by:**
- `runTrial` (169)

### `map`
`[native code]` | Self: 1.2% (127.1ms) | Total: 2.5% (266.5ms) | Samples: 165

**Called by:**
- `cloneMatrix` (151)
- `step` (61)
- `step` (60)
- `(anonymous)` (14)
- `step` (10)
- `step` (8)
- `alignProjectionBasis` (8)
- `jacobiEigenSymmetric` (7)
- `jacobiEigenSymmetric` (7)
- `step` (7)
- `jacobiEigenSymmetric` (5)
- `alignProjectionBasis` (1)

**Calls:**
- `(anonymous)` (167)
- `abs` (3)
- `(anonymous)` (2)
- `(anonymous)` (1)
- `(anonymous)` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.1% (117.4ms) | Total: 1.8% (194.1ms) | Samples: 155

**Called by:**
- `step` (256)

**Calls:**
- `fill` (101)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.6% (70.0ms) | Total: 0.6% (70.0ms) | Samples: 91

**Called by:**
- `(anonymous)` (66)
- `step` (15)
- `step` (10)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` | Self: 0.6% (65.1ms) | Total: 0.9% (95.1ms) | Samples: 85

**Called by:**
- `step` (124)

**Calls:**
- `Float64Array` (39)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` | Self: 0.5% (53.1ms) | Total: 0.5% (53.1ms) | Samples: 68

**Called by:**
- `step` (68)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:548` | Self: 0.4% (46.3ms) | Total: 0.4% (48.4ms) | Samples: 59

**Called by:**
- `(anonymous)` (61)
- `step` (1)

**Calls:**
- `requireFiniteVector` (3)

### `Float64Array`
`[native code]` | Self: 0.4% (45.4ms) | Total: 0.4% (45.4ms) | Samples: 58

**Called by:**
- `jacobiEigenSymmetric` (39)
- `jacobiEigenSymmetric` (19)

### `sort`
`[native code]` | Self: 0.3% (39.8ms) | Total: 0.4% (51.3ms) | Samples: 51

**Called by:**
- `jacobiEigenSymmetric` (38)
- `step` (28)

**Calls:**
- `(anonymous)` (8)
- `(anonymous)` (7)

### `some`
`[native code]` | Self: 0.3% (38.4ms) | Total: 1.2% (129.5ms) | Samples: 50

**Called by:**
- `validateSquareFiniteMatrix` (85)
- `(anonymous)` (83)

**Calls:**
- `(anonymous)` (85)
- `(anonymous)` (33)

### `from`
`[native code]` | Self: 0.3% (37.3ms) | Total: 1.1% (117.5ms) | Samples: 50

**Called by:**
- `reconstructSymmetric` (55)
- `createZeroMatrix` (43)
- `jacobiEigenSymmetric` (42)
- `step` (5)
- `jacobiEigenSymmetric` (3)

**Calls:**
- `(anonymous)` (40)
- `fill` (30)
- `(anonymous)` (27)
- `(anonymous)` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.3% (34.8ms) | Total: 0.3% (34.8ms) | Samples: 40

**Called by:**
- `from` (40)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.3% (34.4ms) | Total: 0.6% (67.8ms) | Samples: 44

**Called by:**
- `step` (86)

**Calls:**
- `from` (42)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.3% (32.8ms) | Total: 0.3% (32.8ms) | Samples: 42

**Called by:**
- `some` (33)
- `forEach` (7)
- `map` (1)
- `from` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:707` | Self: 0.2% (30.6ms) | Total: 1.4% (149.1ms) | Samples: 40

**Called by:**
- `forEach` (194)

**Calls:**
- `projectTo3D` (66)
- `projectTo3D` (61)
- `projectTo3D` (22)
- `projectTo3D` (3)
- `projectTo3D` (2)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` | Self: 0.2% (29.8ms) | Total: 0.2% (29.8ms) | Samples: 38

**Called by:**
- `step` (38)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` | Self: 0.2% (24.5ms) | Total: 0.2% (25.9ms) | Samples: 32

**Called by:**
- `step` (34)

**Calls:**
- `fill` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` | Self: 0.2% (24.4ms) | Total: 0.2% (24.4ms) | Samples: 31

**Called by:**
- `runTrial` (31)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.2% (22.3ms) | Total: 0.2% (22.3ms) | Samples: 27

**Called by:**
- `from` (27)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` | Self: 0.1% (20.4ms) | Total: 0.6% (70.0ms) | Samples: 28

**Called by:**
- `step` (92)

**Calls:**
- `fill` (64)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` | Self: 0.1% (20.0ms) | Total: 0.1% (20.0ms) | Samples: 23

**Called by:**
- `transformFromEigenCoordinates` (14)
- `whitenAdaptationPointWithEigensystem` (5)
- `step` (2)
- `whitenAdaptationPointWithEigensystem` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` | Self: 0.1% (17.2ms) | Total: 0.1% (17.2ms) | Samples: 23

**Called by:**
- `runTrial` (23)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:328` | Self: 0.1% (16.8ms) | Total: 0.1% (16.8ms) | Samples: 23

**Called by:**
- `step` (23)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` | Self: 0.1% (16.6ms) | Total: 0.1% (16.6ms) | Samples: 22

**Called by:**
- `runTrial` (22)

### `push`
`[native code]` | Self: 0.1% (11.4ms) | Total: 0.1% (11.4ms) | Samples: 15

**Called by:**
- `step` (11)
- `step` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:678` | Self: 0.1% (10.7ms) | Total: 0.1% (10.7ms) | Samples: 14

**Called by:**
- `runTrial` (14)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` | Self: 0.0% (9.8ms) | Total: 0.0% (9.8ms) | Samples: 14

**Called by:**
- `runTrial` (14)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:558` | Self: 0.0% (8.2ms) | Total: 0.1% (16.8ms) | Samples: 11

**Called by:**
- `(anonymous)` (22)

**Calls:**
- `coordinate` (10)
- `coordinate` (1)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:555` | Self: 0.0% (7.7ms) | Total: 0.0% (7.7ms) | Samples: 10

**Called by:**
- `projectTo3D` (10)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:734` | Self: 0.0% (7.1ms) | Total: 0.0% (7.1ms) | Samples: 9

**Called by:**
- `runTrial` (9)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:625` | Self: 0.0% (6.9ms) | Total: 0.0% (6.9ms) | Samples: 9

**Called by:**
- `runTrial` (9)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:585` | Self: 0.0% (6.2ms) | Total: 2.1% (227.1ms) | Samples: 8

**Called by:**
- `runTrial` (296)
- `runTrial` (4)

**Calls:**
- `sampleGaussianVectorND` (256)
- `sampleGaussianVectorND` (23)
- `push` (11)
- `sampleGaussianVectorND` (1)
- `sampleGaussianVectorND` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` | Self: 0.0% (6.0ms) | Total: 0.0% (6.0ms) | Samples: 8

**Called by:**
- `sort` (8)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:721` | Self: 0.0% (5.5ms) | Total: 0.0% (5.5ms) | Samples: 7

**Called by:**
- `runTrial` (7)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` | Self: 0.0% (5.4ms) | Total: 0.0% (5.4ms) | Samples: 7

**Called by:**
- `sort` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:658` | Self: 0.0% (4.1ms) | Total: 0.0% (5.0ms) | Samples: 6

**Called by:**
- `runTrial` (7)

**Calls:**
- `vecDot` (1)

### `anonymous`
`[native code]` | Self: 0.0% (3.9ms) | Total: 0.1% (19.8ms) | Samples: 5

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
- `internal:streams/pipeline` (1)
- `internal:streams/end-of-stream` (1)
- `internal:shared` (1)
- `internal:streams/operators` (1)
- `internal:streams/compose` (1)
- `internal:streams/duplex` (1)

**Calls:**
- `node:fs` (3)
- `internal:fs/streams` (2)
- `internal:stream` (2)
- `node:fs/promises` (2)
- `node:stream` (2)
- `node:events` (1)
- `internal:validators` (1)
- `internal:streams/pipeline` (1)
- `node:fs` (1)
- `internal:streams/end-of-stream` (1)
- `internal:shared` (1)
- `internal:streams/compose` (1)
- `internal:streams/operators` (1)
- `internal:streams/duplex` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:584` | Self: 0.0% (3.9ms) | Total: 0.0% (3.9ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:738` | Self: 0.0% (3.9ms) | Total: 0.0% (3.9ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:728` | Self: 0.0% (3.8ms) | Total: 0.1% (11.4ms) | Samples: 5

**Called by:**
- `runTrial` (15)

**Calls:**
- `map` (10)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.0% (3.7ms) | Total: 0.0% (9.6ms) | Samples: 5

**Called by:**
- `step` (12)

**Calls:**
- `map` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` | Self: 0.0% (3.6ms) | Total: 0.4% (50.7ms) | Samples: 5

**Called by:**
- `runTrial` (65)
- `runTrial` (1)

**Calls:**
- `map` (61)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` | Self: 0.0% (3.4ms) | Total: 0.0% (3.4ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (3.4ms) | Total: 0.0% (3.4ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (3.2ms) | Total: 0.0% (3.2ms) | Samples: 4

**Called by:**
- `step` (4)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` | Self: 0.0% (3.2ms) | Total: 0.3% (34.7ms) | Samples: 4

**Called by:**
- `step` (45)

**Calls:**
- `sort` (38)
- `from` (3)

### `whitenAdaptationPointWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:287` | Self: 0.0% (3.2ms) | Total: 0.0% (3.2ms) | Samples: 4

**Called by:**
- `step` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:719` | Self: 0.0% (3.0ms) | Total: 0.0% (3.7ms) | Samples: 4

**Called by:**
- `runTrial` (5)

**Calls:**
- `radius` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:479` | Self: 0.0% (3.0ms) | Total: 0.0% (3.0ms) | Samples: 1

**Called by:**
- `runTrial` (1)

### `forEach`
`[native code]` | Self: 0.0% (3.0ms) | Total: 1.6% (169.5ms) | Samples: 4

**Called by:**
- `step` (218)
- `step` (2)

**Calls:**
- `(anonymous)` (194)
- `(anonymous)` (14)
- `(anonymous)` (7)
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:735` | Self: 0.0% (3.0ms) | Total: 0.0% (3.0ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:589` | Self: 0.0% (2.8ms) | Total: 0.7% (72.9ms) | Samples: 4

**Called by:**
- `runTrial` (95)
- `runTrial` (1)

**Calls:**
- `ellipsoidObjective` (92)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` | Self: 0.0% (2.5ms) | Total: 0.0% (2.5ms) | Samples: 3

**Called by:**
- `(anonymous)` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` | Self: 0.0% (2.2ms) | Total: 0.0% (2.2ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `abs`
`[native code]` | Self: 0.0% (2.2ms) | Total: 0.0% (2.2ms) | Samples: 3

**Called by:**
- `map` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:648` | Self: 0.0% (2.2ms) | Total: 0.0% (2.2ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `requireFiniteVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:397` | Self: 0.0% (2.0ms) | Total: 0.0% (2.0ms) | Samples: 3

**Called by:**
- `projectTo3D` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:588` | Self: 0.0% (2.0ms) | Total: 0.4% (47.7ms) | Samples: 2

**Called by:**
- `runTrial` (62)

**Calls:**
- `map` (60)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:744` | Self: 0.0% (1.8ms) | Total: 0.0% (1.8ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:591` | Self: 0.0% (1.7ms) | Total: 0.0% (1.7ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` | Self: 0.0% (1.7ms) | Total: 1.4% (145.9ms) | Samples: 2

**Called by:**
- `runTrial` (184)
- `runTrial` (1)

**Calls:**
- `alignProjectionBasis` (68)
- `alignProjectionBasis` (65)
- `alignProjectionBasis` (50)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 2

**Called by:**
- `step` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 2

**Called by:**
- `map` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:409` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 2

**Called by:**
- `CMAESOptimizerND` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:710` | Self: 0.0% (1.5ms) | Total: 0.0% (2.2ms) | Samples: 2

**Called by:**
- `runTrial` (3)

**Calls:**
- `reduce` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (1.5ms) | Total: 0.6% (65.5ms) | Samples: 2

**Called by:**
- `some` (85)

**Calls:**
- `some` (83)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `step` (2)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:550` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `(anonymous)` (2)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:745` | Self: 0.0% (1.5ms) | Total: 0.0% (4.5ms) | Samples: 2

**Called by:**
- `runTrial` (6)

**Calls:**
- `push` (4)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:252` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` | Self: 0.0% (1.4ms) | Total: 0.2% (23.4ms) | Samples: 2

**Called by:**
- `runTrial` (30)

**Calls:**
- `sort` (28)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:641` | Self: 0.0% (1.3ms) | Total: 0.0% (2.0ms) | Samples: 2

**Called by:**
- `runTrial` (3)

**Calls:**
- `max` (1)

### `reduce`
`[native code]` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `step` (1)
- `(module)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` | Self: 0.0% (1.1ms) | Total: 4.0% (421.5ms) | Samples: 2

**Called by:**
- `runTrial` (556)

**Calls:**
- `transformFromEigenCoordinates` (549)
- `transformFromEigenCoordinates` (2)
- `transformFromEigenCoordinates` (2)
- `transformFromEigenCoordinates` (1)

### `vecDot`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (905us) | Total: 0.0% (905us) | Samples: 1

**Called by:**
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:704` | Self: 0.0% (896us) | Total: 0.0% (896us) | Samples: 1

**Called by:**
- `map` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` | Self: 0.0% (896us) | Total: 99.4% (10.29s) | Samples: 1

**Called by:**
- `(module)` (12498)
- `(module)` (880)

**Calls:**
- `step` (5407)
- `step` (3615)
- `step` (566)
- `step` (556)
- `step` (543)
- `step` (511)
- `step` (392)
- `step` (296)
- `step` (237)
- `step` (218)
- `step` (184)
- `step` (169)
- `step` (95)
- `step` (73)
- `step` (65)
- `step` (62)
- `step` (55)
- `step` (50)
- `step` (31)
- `step` (30)
- `step` (23)
- `step` (22)
- `step` (16)
- `step` (15)
- `step` (14)
- `step` (14)
- `step` (11)
- `step` (9)
- `step` (9)
- `step` (7)
- `step` (7)
- `step` (7)
- `step` (6)
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
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:253` | Self: 0.0% (887us) | Total: 0.0% (887us) | Samples: 1

**Called by:**
- `step` (1)

### `variancePercent`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (876us) | Total: 0.0% (876us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:699` | Self: 0.0% (870us) | Total: 0.0% (870us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` | Self: 0.0% (869us) | Total: 0.0% (869us) | Samples: 1

**Called by:**
- `forEach` (1)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (864us) | Total: 0.0% (864us) | Samples: 1

**Called by:**
- `projectTo3D` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:119` | Self: 0.0% (854us) | Total: 0.0% (854us) | Samples: 1

**Called by:**
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` | Self: 0.0% (843us) | Total: 0.0% (843us) | Samples: 1

**Called by:**
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` | Self: 0.0% (837us) | Total: 0.0% (837us) | Samples: 1

**Called by:**
- `step` (1)

### `whitenAdaptationPointWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (819us) | Total: 0.0% (819us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:581` | Self: 0.0% (810us) | Total: 0.0% (810us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:723` | Self: 0.0% (798us) | Total: 0.0% (1.6ms) | Samples: 1

**Called by:**
- `runTrial` (2)

**Calls:**
- `variancePercent` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:499` | Self: 0.0% (798us) | Total: 0.0% (798us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` | Self: 0.0% (790us) | Total: 0.0% (790us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:654` | Self: 0.0% (781us) | Total: 0.0% (781us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:725` | Self: 0.0% (749us) | Total: 0.0% (8.6ms) | Samples: 1

**Called by:**
- `runTrial` (11)

**Calls:**
- `projectTo3D` (10)

### `adaptationPoint`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (736us) | Total: 0.0% (736us) | Samples: 1

**Called by:**
- `step` (1)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:21` | Self: 0.0% (714us) | Total: 0.0% (714us) | Samples: 1

**Called by:**
- `step` (1)

### `node:fs`
`node:fs:291` | Self: 0.0% (711us) | Total: 0.0% (711us) | Samples: 1

**Called by:**
- `anonymous` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:739` | Self: 0.0% (710us) | Total: 0.0% (710us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` | Self: 0.0% (705us) | Total: 0.4% (51.2ms) | Samples: 1

**Called by:**
- `step` (65)

**Calls:**
- `cloneMatrix` (56)
- `map` (8)

### `nextOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (696us) | Total: 0.0% (696us) | Samples: 1

**Called by:**
- `sampleGaussianVectorND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` | Self: 0.0% (695us) | Total: 0.0% (695us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:640` | Self: 0.0% (695us) | Total: 0.0% (695us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.0% (691us) | Total: 0.3% (33.6ms) | Samples: 1

**Called by:**
- `step` (41)
- `createIdentityMatrix` (2)
- `reconstructSymmetric` (1)

**Calls:**
- `from` (43)

### `WriteStream`
`internal:fs/streams` | Self: 0.0% (685us) | Total: 0.0% (685us) | Samples: 1

**Called by:**
- `(anonymous)` (1)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (672us) | Total: 0.0% (672us) | Samples: 1

**Called by:**
- `step` (1)

### `max`
`[native code]` | Self: 0.0% (652us) | Total: 0.0% (652us) | Samples: 1

**Called by:**
- `step` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:485` | Self: 0.0% (642us) | Total: 0.0% (642us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:150` | Self: 0.0% (636us) | Total: 0.0% (636us) | Samples: 1

**Called by:**
- `step` (1)

### `radius`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (632us) | Total: 0.0% (632us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:579` | Self: 0.0% (632us) | Total: 0.0% (632us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:451` | Self: 0.0% (630us) | Total: 0.0% (630us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:683` | Self: 0.0% (626us) | Total: 0.0% (626us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `(anonymous)` (2)

**Calls:**
- `anonymous` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:733` | Self: 0.0% (0us) | Total: 0.4% (44.9ms) | Samples: 0

**Called by:**
- `runTrial` (55)

**Calls:**
- `cloneMatrix` (46)
- `map` (8)
- `cloneMatrix` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` | Self: 0.0% (0us) | Total: 0.1% (15.4ms) | Samples: 0

**Called by:**
- `step` (19)

**Calls:**
- `Float64Array` (19)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (805us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:706` | Self: 0.0% (0us) | Total: 0.1% (10.7ms) | Samples: 0

**Called by:**
- `forEach` (14)

**Calls:**
- `map` (14)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:478` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `runTrial` (2)

**Calls:**
- `createIdentityMatrix` (2)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (856us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:streams/end-of-stream`
`internal:streams/end-of-stream:17` | Self: 0.0% (0us) | Total: 0.0% (740us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (856us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:447` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `runTrial` (2)

**Calls:**
- `(anonymous)` (2)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (805us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:631` | Self: 0.0% (0us) | Total: 0.5% (57.3ms) | Samples: 0

**Called by:**
- `runTrial` (73)
- `runTrial` (1)

**Calls:**
- `whitenWithEigensystem` (38)
- `whitenWithEigensystem` (34)
- `whitenWithEigensystem` (2)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:334` | Self: 0.0% (0us) | Total: 0.0% (795us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `fill` (1)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (805us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` | Self: 0.0% (0us) | Total: 0.0% (5.3ms) | Samples: 0

**Called by:**
- `step` (7)

**Calls:**
- `map` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:615` | Self: 0.0% (0us) | Total: 0.0% (3.6ms) | Samples: 0

**Called by:**
- `runTrial` (5)

**Calls:**
- `fill` (2)
- `createZeroVector` (2)
- `createZeroVector` (1)

### `internal:streams/operators`
`internal:streams/operators:2` | Self: 0.0% (0us) | Total: 0.0% (740us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` | Self: 0.0% (0us) | Total: 0.0% (5.3ms) | Samples: 0

**Calls:**
- `(anonymous)` (7)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:330` | Self: 0.0% (0us) | Total: 0.0% (696us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `nextOpenUnit` (1)

### `createIdentityMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:31` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `CMAESOptimizerND` (2)

**Calls:**
- `createZeroMatrix` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:724` | Self: 0.0% (0us) | Total: 0.1% (13.1ms) | Samples: 0

**Called by:**
- `runTrial` (16)

**Calls:**
- `projectTo3D` (15)
- `projectTo3D` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` | Self: 0.0% (0us) | Total: 0.0% (4.0ms) | Samples: 0

**Called by:**
- `step` (5)

**Calls:**
- `map` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:694` | Self: 0.0% (0us) | Total: 4.0% (417.4ms) | Samples: 0

**Called by:**
- `runTrial` (543)
- `runTrial` (3)

**Calls:**
- `reconstructSymmetric` (546)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` | Self: 0.0% (0us) | Total: 93.3% (9.66s) | Samples: 0

**Calls:**
- `runTrial` (12498)
- `runTrial` (46)
- `runTrial` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:705` | Self: 0.0% (0us) | Total: 1.6% (167.9ms) | Samples: 0

**Called by:**
- `runTrial` (218)

**Calls:**
- `forEach` (218)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (0us) | Total: 0.6% (65.5ms) | Samples: 0

**Called by:**
- `jacobiEigenSymmetric` (85)

**Calls:**
- `some` (85)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` | Self: 0.0% (0us) | Total: 0.6% (65.5ms) | Samples: 0

**Called by:**
- `step` (85)

**Calls:**
- `validateSquareFiniteMatrix` (85)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `runTrial` (1)
- `runTrial` (1)

**Calls:**
- `forEach` (2)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` | Self: 0.0% (0us) | Total: 0.0% (8.4ms) | Samples: 0

**Called by:**
- `(module)` (7)
- `(module)` (1)

**Calls:**
- `CMAESOptimizerND` (2)
- `CMAESOptimizerND` (2)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:95` | Self: 0.0% (0us) | Total: 0.0% (693us) | Samples: 0

**Calls:**
- `reduce` (1)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (856us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:574` | Self: 0.0% (0us) | Total: 0.3% (39.9ms) | Samples: 0

**Called by:**
- `step` (50)

**Calls:**
- `cloneMatrix` (49)
- `map` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:651` | Self: 0.0% (0us) | Total: 3.8% (394.6ms) | Samples: 0

**Called by:**
- `runTrial` (511)

**Calls:**
- `whitenAdaptationPointWithEigensystem` (309)
- `whitenAdaptationPointWithEigensystem` (197)
- `whitenAdaptationPointWithEigensystem` (4)
- `whitenAdaptationPointWithEigensystem` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` | Self: 0.0% (0us) | Total: 6.5% (677.2ms) | Samples: 0

**Calls:**
- `runTrial` (880)
- `runTrial` (7)
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` | Self: 0.0% (0us) | Total: 0.3% (38.0ms) | Samples: 0

**Called by:**
- `runTrial` (50)

**Calls:**
- `createZeroMatrix` (41)
- `from` (5)
- `createZeroMatrix` (4)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (2.4ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` | Self: 0.0% (0us) | Total: 0.3% (39.7ms) | Samples: 0

**Called by:**
- `(module)` (46)
- `(module)` (7)

**Calls:**
- `step` (27)
- `step` (12)
- `step` (4)
- `step` (3)
- `step` (2)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:704` | Self: 0.0% (0us) | Total: 0.0% (5.4ms) | Samples: 0

**Called by:**
- `runTrial` (7)

**Calls:**
- `map` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` | Self: 0.0% (0us) | Total: 40.4% (4.18s) | Samples: 0

**Called by:**
- `runTrial` (5407)
- `runTrial` (27)

**Calls:**
- `jacobiEigenSymmetric` (5044)
- `jacobiEigenSymmetric` (124)
- `jacobiEigenSymmetric` (86)
- `jacobiEigenSymmetric` (85)
- `jacobiEigenSymmetric` (45)
- `jacobiEigenSymmetric` (19)
- `jacobiEigenSymmetric` (12)
- `jacobiEigenSymmetric` (7)
- `jacobiEigenSymmetric` (5)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 0.0% (0us) | Total: 1.1% (122.3ms) | Samples: 0

**Called by:**
- `alignProjectionBasis` (56)
- `alignProjectionBasis` (49)
- `step` (46)

**Calls:**
- `map` (151)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (5.3ms) | Samples: 0

**Called by:**
- `(module)` (7)

**Calls:**
- `anonymous` (4)
- `get WriteStream` (2)
- `WriteStream` (1)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 93.6% | 9.68s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 6.1% | 633.0ms | `[native code]` |
| 0.2% | 21.3ms | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.0% | 711us | `node:fs` |
| 0.0% | 685us | `internal:fs/streams` |
