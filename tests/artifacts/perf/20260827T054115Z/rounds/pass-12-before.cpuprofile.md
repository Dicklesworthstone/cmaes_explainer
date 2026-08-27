# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 9.47s | 14637 | 500us | 173 |

**Top 10:** `jacobiEigenSymmetric` 39.2%, `step` 18.9%, `transformFromEigenCoordinates` 5.1%, `step` 3.9%, `reconstructSymmetric` 3.8%, `whitenWithEigensystem` 3.3%, `whitenWithEigensystem` 2.6%, `map` 2.0%, `step` 1.8%, `step` 1.7%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 39.2% | 3.71s | 40.9% | 3.87s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 18.9% | 1.79s | 18.9% | 1.79s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:646` |
| 5.1% | 484.3ms | 5.2% | 499.7ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 3.9% | 371.8ms | 4.3% | 409.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 3.8% | 368.9ms | 4.3% | 412.7ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` |
| 3.3% | 316.2ms | 3.3% | 321.1ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 2.6% | 255.3ms | 2.8% | 266.3ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` |
| 2.0% | 193.1ms | 4.5% | 432.9ms | `map` | `[native code]` |
| 1.8% | 174.7ms | 1.8% | 174.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:684` |
| 1.7% | 162.5ms | 1.7% | 162.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` |
| 1.7% | 161.3ms | 1.7% | 161.3ms | `hypot` | `[native code]` |
| 1.5% | 148.5ms | 1.5% | 148.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:655` |
| 1.4% | 141.9ms | 1.4% | 141.9ms | `fill` | `[native code]` |
| 1.3% | 130.9ms | 2.1% | 206.8ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.1% | 111.7ms | 1.1% | 111.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.8% | 80.8ms | 0.8% | 80.8ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` |
| 0.8% | 79.7ms | 0.8% | 79.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.5% | 56.0ms | 0.5% | 56.0ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:545` |
| 0.4% | 41.8ms | 1.2% | 120.5ms | `from` | `[native code]` |
| 0.4% | 40.8ms | 0.4% | 40.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 0.4% | 39.0ms | 0.7% | 75.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.4% | 38.7ms | 1.3% | 128.3ms | `some` | `[native code]` |
| 0.4% | 38.0ms | 0.4% | 44.8ms | `sort` | `[native code]` |
| 0.3% | 36.7ms | 1.6% | 154.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` |
| 0.3% | 34.5ms | 0.3% | 34.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 0.3% | 32.1ms | 0.3% | 32.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.3% | 30.6ms | 0.3% | 30.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.3% | 30.6ms | 0.6% | 65.0ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.2% | 26.9ms | 0.2% | 26.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.2% | 23.6ms | 0.2% | 23.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` |
| 0.2% | 20.7ms | 0.2% | 20.7ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.2% | 19.1ms | 0.2% | 19.1ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:303` |
| 0.1% | 17.9ms | 0.2% | 20.0ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:523` |
| 0.1% | 14.9ms | 0.1% | 14.9ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.1% | 12.0ms | 0.1% | 12.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:600` |
| 0.1% | 10.3ms | 0.1% | 10.3ms | `push` | `[native code]` |
| 0.1% | 10.1ms | 0.1% | 10.1ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.1% | 9.5ms | 0.2% | 23.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:631` |
| 0.0% | 9.3ms | 0.9% | 90.2ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:533` |
| 0.0% | 7.7ms | 0.0% | 7.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` |
| 0.0% | 7.5ms | 0.0% | 7.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` |
| 0.0% | 5.9ms | 0.1% | 15.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.0% | 5.7ms | 0.0% | 8.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` |
| 0.0% | 5.5ms | 0.0% | 5.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 5.4ms | 0.7% | 70.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:564` |
| 0.0% | 5.2ms | 0.0% | 5.2ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:253` |
| 0.0% | 5.0ms | 2.5% | 238.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` |
| 0.0% | 4.7ms | 0.0% | 4.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` |
| 0.0% | 4.6ms | 0.2% | 22.2ms | `anonymous` | `[native code]` |
| 0.0% | 4.5ms | 0.0% | 4.5ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:53` |
| 0.0% | 4.5ms | 0.2% | 19.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.0% | 4.2ms | 0.0% | 4.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:704` |
| 0.0% | 4.2ms | 0.0% | 4.2ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 4.1ms | 0.0% | 4.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` |
| 0.0% | 4.0ms | 0.0% | 4.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:688` |
| 0.0% | 3.8ms | 0.0% | 3.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:609` |
| 0.0% | 3.7ms | 0.0% | 3.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` |
| 0.0% | 3.4ms | 0.0% | 4.1ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:524` |
| 0.0% | 3.3ms | 0.0% | 3.3ms | `abs` | `[native code]` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:707` |
| 0.0% | 2.7ms | 0.0% | 2.7ms | `reduce` | `[native code]` |
| 0.0% | 2.6ms | 0.0% | 2.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` |
| 0.0% | 2.5ms | 0.0% | 2.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 0.0% | 2.5ms | 0.0% | 2.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:708` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:690` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` |
| 0.0% | 2.2ms | 1.8% | 174.1ms | `forEach` | `[native code]` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `every` | `[native code]` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 1.8ms | 0.0% | 4.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:555` |
| 0.0% | 1.7ms | 0.6% | 64.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.0% | 1.6ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 0.0% | 1.4ms | 5.3% | 507.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.3ms | 0.7% | 67.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:274` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:652` |
| 0.0% | 1.2ms | 0.0% | 3.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:714` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:612` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `max` | `[native code]` |
| 0.0% | 1.2ms | 0.3% | 32.7ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.2ms | 0.6% | 62.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:621` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` |
| 0.0% | 1.1ms | 0.1% | 9.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:608` |
| 0.0% | 1.1ms | 0.0% | 3.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` |
| 0.0% | 1.1ms | 0.1% | 14.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:675` |
| 0.0% | 1.0ms | 0.4% | 47.1ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:537` |
| 0.0% | 781us | 0.0% | 781us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:26` |
| 0.0% | 766us | 0.0% | 766us | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:235` |
| 0.0% | 760us | 0.0% | 760us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.0% | 744us | 0.0% | 744us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` |
| 0.0% | 736us | 0.1% | 10.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` |
| 0.0% | 725us | 0.1% | 10.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` |
| 0.0% | 723us | 0.0% | 723us | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 722us | 1.0% | 101.4ms | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.0% | 700us | 0.0% | 700us | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:525` |
| 0.0% | 685us | 0.0% | 685us | `sqrt` | `[native code]` |
| 0.0% | 668us | 0.0% | 668us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` |
| 0.0% | 659us | 4.3% | 414.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:663` |
| 0.0% | 657us | 0.0% | 657us | `writeFast` | `internal:fs/streams` |
| 0.0% | 654us | 0.0% | 654us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:172` |
| 0.0% | 652us | 0.0% | 4.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` |
| 0.0% | 651us | 0.0% | 651us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:554` |
| 0.0% | 651us | 0.0% | 651us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` |
| 0.0% | 649us | 0.0% | 649us | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 645us | 0.7% | 66.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:620` |
| 0.0% | 645us | 0.0% | 8.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` |
| 0.0% | 640us | 0.0% | 640us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:667` |
| 0.0% | 624us | 0.0% | 624us | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 623us | 0.0% | 623us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:640` |
| 0.0% | 621us | 0.0% | 621us | `slice` | `[native code]` |
| 0.0% | 616us | 0.0% | 616us | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:269` |
| 0.0% | 580us | 0.0% | 580us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` |
| 0.0% | 579us | 0.3% | 34.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.0% | 577us | 44.2% | 4.18s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` |
| 0.0% | 574us | 0.0% | 574us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 557us | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:692` |
| 0.0% | 548us | 0.7% | 67.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 0.0% | 546us | 0.0% | 546us | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:264` |
| 0.0% | 539us | 0.0% | 539us | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:237` |
| 0.0% | 538us | 0.0% | 4.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:581` |
| 0.0% | 535us | 0.0% | 535us | `copyProps` | `internal:primordials` |
| 0.0% | 526us | 0.0% | 526us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:152` |
| 0.0% | 519us | 0.9% | 85.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 99.4% | 9.41s | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 93.3% | 8.83s | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` |
| 44.2% | 4.18s | 0.0% | 577us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` |
| 40.9% | 3.87s | 39.2% | 3.71s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 18.9% | 1.79s | 18.9% | 1.79s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:646` |
| 6.6% | 625.5ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` |
| 5.3% | 509.4ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:626` |
| 5.3% | 507.6ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` |
| 5.2% | 499.7ms | 5.1% | 484.3ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 4.5% | 432.9ms | 2.0% | 193.1ms | `map` | `[native code]` |
| 4.3% | 414.7ms | 0.0% | 659us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:663` |
| 4.3% | 412.7ms | 3.8% | 368.9ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` |
| 4.3% | 409.1ms | 3.9% | 371.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 3.3% | 321.1ms | 3.3% | 316.2ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 2.8% | 266.3ms | 2.6% | 255.3ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` |
| 2.5% | 238.1ms | 0.0% | 5.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` |
| 2.1% | 206.8ms | 1.3% | 130.9ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.8% | 174.7ms | 1.8% | 174.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:684` |
| 1.8% | 174.1ms | 0.0% | 2.2ms | `forEach` | `[native code]` |
| 1.7% | 169.9ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |
| 1.7% | 162.5ms | 1.7% | 162.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` |
| 1.7% | 161.3ms | 1.7% | 161.3ms | `hypot` | `[native code]` |
| 1.6% | 154.2ms | 0.3% | 36.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` |
| 1.5% | 148.5ms | 1.5% | 148.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:655` |
| 1.4% | 141.9ms | 1.4% | 141.9ms | `fill` | `[native code]` |
| 1.4% | 132.9ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:672` |
| 1.3% | 128.3ms | 0.4% | 38.7ms | `some` | `[native code]` |
| 1.2% | 120.5ms | 0.4% | 41.8ms | `from` | `[native code]` |
| 1.1% | 111.7ms | 1.1% | 111.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.0% | 101.4ms | 0.0% | 722us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.9% | 90.2ms | 0.0% | 9.3ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:533` |
| 0.9% | 85.3ms | 0.0% | 519us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.8% | 80.8ms | 0.8% | 80.8ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` |
| 0.8% | 79.7ms | 0.8% | 79.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.7% | 75.1ms | 0.4% | 39.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.7% | 70.6ms | 0.0% | 5.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:564` |
| 0.7% | 67.5ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.7% | 67.2ms | 0.0% | 548us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 0.7% | 66.6ms | 0.0% | 645us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:620` |
| 0.6% | 65.0ms | 0.3% | 30.6ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.6% | 64.6ms | 0.0% | 0us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.6% | 64.6ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 0.6% | 64.0ms | 0.0% | 1.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.6% | 62.4ms | 0.0% | 1.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:621` |
| 0.5% | 56.0ms | 0.5% | 56.0ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:545` |
| 0.4% | 47.1ms | 0.0% | 1.0ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:537` |
| 0.4% | 44.8ms | 0.4% | 38.0ms | `sort` | `[native code]` |
| 0.4% | 42.2ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` |
| 0.4% | 40.8ms | 0.4% | 40.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 0.3% | 34.8ms | 0.0% | 579us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.3% | 34.5ms | 0.3% | 34.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 0.3% | 32.7ms | 0.0% | 1.2ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.3% | 32.1ms | 0.3% | 32.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.3% | 31.7ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:702` |
| 0.3% | 30.6ms | 0.3% | 30.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.3% | 28.5ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` |
| 0.2% | 26.9ms | 0.2% | 26.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.2% | 23.6ms | 0.2% | 23.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` |
| 0.2% | 23.5ms | 0.1% | 9.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:631` |
| 0.2% | 22.2ms | 0.0% | 4.6ms | `anonymous` | `[native code]` |
| 0.2% | 20.7ms | 0.2% | 20.7ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.2% | 20.0ms | 0.1% | 17.9ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:523` |
| 0.2% | 19.7ms | 0.0% | 4.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.2% | 19.1ms | 0.2% | 19.1ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:303` |
| 0.1% | 15.7ms | 0.0% | 5.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.1% | 14.9ms | 0.0% | 1.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:675` |
| 0.1% | 14.9ms | 0.1% | 14.9ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.1% | 12.0ms | 0.1% | 12.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:600` |
| 0.1% | 10.4ms | 0.0% | 725us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` |
| 0.1% | 10.3ms | 0.1% | 10.3ms | `push` | `[native code]` |
| 0.1% | 10.3ms | 0.0% | 736us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` |
| 0.1% | 10.1ms | 0.1% | 10.1ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.1% | 9.9ms | 0.0% | 1.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:608` |
| 0.0% | 8.6ms | 0.0% | 645us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` |
| 0.0% | 8.2ms | 0.0% | 5.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` |
| 0.0% | 7.7ms | 0.0% | 7.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` |
| 0.0% | 7.5ms | 0.0% | 7.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` |
| 0.0% | 6.7ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` |
| 0.0% | 5.8ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.0% | 5.7ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:694` |
| 0.0% | 5.5ms | 0.0% | 5.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 5.2ms | 0.0% | 5.2ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:253` |
| 0.0% | 5.2ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.0% | 4.7ms | 0.0% | 538us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:581` |
| 0.0% | 4.7ms | 0.0% | 652us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` |
| 0.0% | 4.7ms | 0.0% | 4.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` |
| 0.0% | 4.6ms | 0.0% | 4.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:688` |
| 0.0% | 4.5ms | 0.0% | 1.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 0.0% | 4.5ms | 0.0% | 4.5ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:53` |
| 0.0% | 4.2ms | 0.0% | 4.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:704` |
| 0.0% | 4.2ms | 0.0% | 4.2ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 4.1ms | 0.0% | 3.4ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:524` |
| 0.0% | 4.1ms | 0.0% | 4.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` |
| 0.0% | 3.8ms | 0.0% | 3.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:609` |
| 0.0% | 3.8ms | 0.0% | 1.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` |
| 0.0% | 3.7ms | 0.0% | 3.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` |
| 0.0% | 3.3ms | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:714` |
| 0.0% | 3.3ms | 0.0% | 3.3ms | `abs` | `[native code]` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:707` |
| 0.0% | 3.0ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` |
| 0.0% | 2.7ms | 0.0% | 2.7ms | `reduce` | `[native code]` |
| 0.0% | 2.6ms | 0.0% | 2.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` |
| 0.0% | 2.5ms | 0.0% | 2.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 0.0% | 2.5ms | 0.0% | 2.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:708` |
| 0.0% | 2.4ms | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:468` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:690` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` |
| 0.0% | 2.3ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 2.2ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 0.0% | 2.0ms | 0.0% | 0us | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:372` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `every` | `[native code]` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:555` |
| 0.0% | 1.7ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 1.7ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 1.7ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 1.7ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 1.7ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.3ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:274` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:652` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:612` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `max` | `[native code]` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.2ms | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 1.2ms | 0.0% | 557us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:692` |
| 0.0% | 1.2ms | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` |
| 0.0% | 1.1ms | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 1.1ms | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 1.1ms | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 781us | 0.0% | 781us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:26` |
| 0.0% | 766us | 0.0% | 766us | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:235` |
| 0.0% | 760us | 0.0% | 760us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.0% | 744us | 0.0% | 744us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` |
| 0.0% | 733us | 0.0% | 0us | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:40` |
| 0.0% | 723us | 0.0% | 723us | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 723us | 0.0% | 0us | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:58` |
| 0.0% | 723us | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:305` |
| 0.0% | 703us | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:590` |
| 0.0% | 700us | 0.0% | 700us | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:525` |
| 0.0% | 685us | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:307` |
| 0.0% | 685us | 0.0% | 685us | `sqrt` | `[native code]` |
| 0.0% | 668us | 0.0% | 668us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` |
| 0.0% | 661us | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:93` |
| 0.0% | 657us | 0.0% | 657us | `writeFast` | `internal:fs/streams` |
| 0.0% | 654us | 0.0% | 654us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:172` |
| 0.0% | 651us | 0.0% | 651us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:554` |
| 0.0% | 651us | 0.0% | 651us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` |
| 0.0% | 649us | 0.0% | 649us | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 640us | 0.0% | 640us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:667` |
| 0.0% | 624us | 0.0% | 624us | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 623us | 0.0% | 0us | `internal:streams/operators` | `internal:streams/operators:2` |
| 0.0% | 623us | 0.0% | 623us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:640` |
| 0.0% | 621us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:467` |
| 0.0% | 621us | 0.0% | 621us | `slice` | `[native code]` |
| 0.0% | 616us | 0.0% | 616us | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:269` |
| 0.0% | 580us | 0.0% | 580us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` |
| 0.0% | 577us | 0.0% | 0us | `node:fs` | `node:fs:299` |
| 0.0% | 574us | 0.0% | 574us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 546us | 0.0% | 546us | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:264` |
| 0.0% | 539us | 0.0% | 539us | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:237` |
| 0.0% | 535us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 535us | 0.0% | 0us | `makeSafe` | `internal:primordials:50` |
| 0.0% | 535us | 0.0% | 0us | `internal:primordials` | `internal:primordials:73` |
| 0.0% | 535us | 0.0% | 535us | `copyProps` | `internal:primordials` |
| 0.0% | 526us | 0.0% | 526us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:152` |

## Function Details

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` | Self: 39.2% (3.71s) | Total: 40.9% (3.87s) | Samples: 5739

**Called by:**
- `step` (5989)

**Calls:**
- `hypot` (250)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:646` | Self: 18.9% (1.79s) | Total: 18.9% (1.79s) | Samples: 2801

**Called by:**
- `runTrial` (2785)
- `runTrial` (16)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` | Self: 5.1% (484.3ms) | Total: 5.2% (499.7ms) | Samples: 736

**Called by:**
- `step` (761)

**Calls:**
- `createZeroVector` (19)
- `fill` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` | Self: 3.9% (371.8ms) | Total: 4.3% (409.1ms) | Samples: 583

**Called by:**
- `runTrial` (638)
- `runTrial` (1)

**Calls:**
- `createZeroMatrix` (48)
- `from` (8)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` | Self: 3.8% (368.9ms) | Total: 4.3% (412.7ms) | Samples: 573

**Called by:**
- `step` (640)

**Calls:**
- `from` (65)
- `createZeroMatrix` (1)
- `createZeroMatrix` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` | Self: 3.3% (316.2ms) | Total: 3.3% (321.1ms) | Samples: 488

**Called by:**
- `step` (427)
- `step` (69)

**Calls:**
- `createZeroVector` (5)
- `fill` (3)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` | Self: 2.6% (255.3ms) | Total: 2.8% (266.3ms) | Samples: 391

**Called by:**
- `step` (343)
- `step` (62)

**Calls:**
- `createZeroVector` (8)
- `fill` (6)

### `map`
`[native code]` | Self: 2.0% (193.1ms) | Total: 4.5% (432.9ms) | Samples: 299

**Called by:**
- `cloneMatrix` (148)
- `step` (105)
- `step` (102)
- `step` (101)
- `(anonymous)` (97)
- `(anonymous)` (21)
- `step` (15)
- `step` (15)
- `step` (14)
- `jacobiEigenSymmetric` (13)
- `jacobiEigenSymmetric` (13)
- `step` (6)
- `step` (4)
- `alignProjectionBasis` (2)
- `alignProjectionBasis` (2)
- `jacobiEigenSymmetric` (2)
- `map` (1)
- `CMAESOptimizerND` (1)

**Calls:**
- `(anonymous)` (130)
- `(anonymous)` (115)
- `(anonymous)` (99)
- `(anonymous)` (6)
- `(anonymous)` (6)
- `abs` (5)
- `map` (1)
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:684` | Self: 1.8% (174.7ms) | Total: 1.8% (174.7ms) | Samples: 273

**Called by:**
- `runTrial` (273)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` | Self: 1.7% (162.5ms) | Total: 1.7% (162.5ms) | Samples: 253

**Called by:**
- `runTrial` (253)

### `hypot`
`[native code]` | Self: 1.7% (161.3ms) | Total: 1.7% (161.3ms) | Samples: 250

**Called by:**
- `jacobiEigenSymmetric` (250)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:655` | Self: 1.5% (148.5ms) | Total: 1.5% (148.5ms) | Samples: 224

**Called by:**
- `runTrial` (223)
- `runTrial` (1)

### `fill`
`[native code]` | Self: 1.4% (141.9ms) | Total: 1.4% (141.9ms) | Samples: 215

**Called by:**
- `sampleGaussianVectorND` (116)
- `ellipsoidObjective` (53)
- `from` (30)
- `whitenWithEigensystem` (6)
- `transformFromEigenCoordinates` (6)
- `whitenWithEigensystem` (3)
- `ellipsoidObjective` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.3% (130.9ms) | Total: 2.1% (206.8ms) | Samples: 203

**Called by:**
- `step` (319)

**Calls:**
- `fill` (116)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.1% (111.7ms) | Total: 1.1% (111.7ms) | Samples: 171

**Called by:**
- `map` (130)
- `some` (38)
- `forEach` (3)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` | Self: 0.8% (80.8ms) | Total: 0.8% (80.8ms) | Samples: 126

**Called by:**
- `projectTo3D` (126)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 0.8% (79.7ms) | Total: 0.8% (79.7ms) | Samples: 115

**Called by:**
- `map` (115)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:545` | Self: 0.5% (56.0ms) | Total: 0.5% (56.0ms) | Samples: 86

**Called by:**
- `step` (86)

### `from`
`[native code]` | Self: 0.4% (41.8ms) | Total: 1.2% (120.5ms) | Samples: 66

**Called by:**
- `reconstructSymmetric` (65)
- `jacobiEigenSymmetric` (56)
- `createZeroMatrix` (47)
- `jacobiEigenSymmetric` (8)
- `step` (8)

**Calls:**
- `(anonymous)` (47)
- `(anonymous)` (41)
- `fill` (30)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` | Self: 0.4% (40.8ms) | Total: 0.4% (40.8ms) | Samples: 64

**Called by:**
- `step` (64)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.4% (39.0ms) | Total: 0.7% (75.1ms) | Samples: 60

**Called by:**
- `step` (116)

**Calls:**
- `from` (56)

### `some`
`[native code]` | Self: 0.4% (38.7ms) | Total: 1.3% (128.3ms) | Samples: 59

**Called by:**
- `validateSquareFiniteMatrix` (98)
- `(anonymous)` (95)
- `projectTo3D` (1)
- `some` (1)

**Calls:**
- `(anonymous)` (97)
- `(anonymous)` (38)
- `some` (1)

### `sort`
`[native code]` | Self: 0.4% (38.0ms) | Total: 0.4% (44.8ms) | Samples: 59

**Called by:**
- `jacobiEigenSymmetric` (46)
- `step` (23)
- `(module)` (1)

**Calls:**
- `(anonymous)` (9)
- `(anonymous)` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:676` | Self: 0.3% (36.7ms) | Total: 1.6% (154.2ms) | Samples: 58

**Called by:**
- `forEach` (239)

**Calls:**
- `projectTo3D` (140)
- `projectTo3D` (29)
- `projectTo3D` (6)
- `projectTo3D` (5)
- `projectTo3D` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` | Self: 0.3% (34.5ms) | Total: 0.3% (34.5ms) | Samples: 54

**Called by:**
- `step` (54)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.3% (32.1ms) | Total: 0.3% (32.1ms) | Samples: 47

**Called by:**
- `from` (47)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` | Self: 0.3% (30.6ms) | Total: 0.3% (30.6ms) | Samples: 48

**Called by:**
- `step` (48)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` | Self: 0.3% (30.6ms) | Total: 0.6% (65.0ms) | Samples: 48

**Called by:**
- `step` (100)
- `step` (1)

**Calls:**
- `fill` (53)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.2% (26.9ms) | Total: 0.2% (26.9ms) | Samples: 41

**Called by:**
- `from` (41)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` | Self: 0.2% (23.6ms) | Total: 0.2% (23.6ms) | Samples: 38

**Called by:**
- `runTrial` (36)
- `runTrial` (2)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` | Self: 0.2% (20.7ms) | Total: 0.2% (20.7ms) | Samples: 33

**Called by:**
- `transformFromEigenCoordinates` (19)
- `whitenWithEigensystem` (8)
- `whitenWithEigensystem` (5)
- `step` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:303` | Self: 0.2% (19.1ms) | Total: 0.2% (19.1ms) | Samples: 31

**Called by:**
- `step` (31)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:523` | Self: 0.1% (17.9ms) | Total: 0.2% (20.0ms) | Samples: 28

**Called by:**
- `(anonymous)` (29)
- `step` (1)
- `step` (1)

**Calls:**
- `requireFiniteVector` (3)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.1% (14.9ms) | Total: 0.1% (14.9ms) | Samples: 23

**Called by:**
- `step` (9)
- `step` (8)
- `(anonymous)` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:600` | Self: 0.1% (12.0ms) | Total: 0.1% (12.0ms) | Samples: 19

**Called by:**
- `runTrial` (19)

### `push`
`[native code]` | Self: 0.1% (10.3ms) | Total: 0.1% (10.3ms) | Samples: 13

**Called by:**
- `step` (9)
- `step` (3)
- `step` (1)

### `vecDot`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.1% (10.1ms) | Total: 0.1% (10.1ms) | Samples: 16

**Called by:**
- `step` (15)
- `vecNorm` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:631` | Self: 0.1% (9.5ms) | Total: 0.2% (23.5ms) | Samples: 15

**Called by:**
- `runTrial` (36)
- `runTrial` (1)

**Calls:**
- `vecDot` (15)
- `vecDot` (7)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:533` | Self: 0.0% (9.3ms) | Total: 0.9% (90.2ms) | Samples: 14

**Called by:**
- `(anonymous)` (140)

**Calls:**
- `coordinate` (126)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` | Self: 0.0% (7.7ms) | Total: 0.0% (7.7ms) | Samples: 10

**Called by:**
- `runTrial` (10)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` | Self: 0.0% (7.5ms) | Total: 0.0% (7.5ms) | Samples: 12

**Called by:**
- `runTrial` (12)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.0% (5.9ms) | Total: 0.1% (15.7ms) | Samples: 9

**Called by:**
- `step` (24)

**Calls:**
- `map` (13)
- `max` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` | Self: 0.0% (5.7ms) | Total: 0.0% (8.2ms) | Samples: 9

**Called by:**
- `runTrial` (10)

**Calls:**
- `push` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` | Self: 0.0% (5.5ms) | Total: 0.0% (5.5ms) | Samples: 9

**Called by:**
- `sort` (9)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:564` | Self: 0.0% (5.4ms) | Total: 0.7% (70.6ms) | Samples: 9

**Called by:**
- `runTrial` (109)
- `runTrial` (1)

**Calls:**
- `ellipsoidObjective` (100)
- `ellipsoidObjective` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:253` | Self: 0.0% (5.2ms) | Total: 0.0% (5.2ms) | Samples: 8

**Called by:**
- `step` (8)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` | Self: 0.0% (5.0ms) | Total: 2.5% (238.1ms) | Samples: 8

**Called by:**
- `runTrial` (368)
- `runTrial` (1)

**Calls:**
- `sampleGaussianVectorND` (319)
- `sampleGaussianVectorND` (31)
- `push` (9)
- `sampleGaussianVectorND` (1)
- `sampleGaussianVectorND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` | Self: 0.0% (4.7ms) | Total: 0.0% (4.7ms) | Samples: 7

**Called by:**
- `runTrial` (7)

### `anonymous`
`[native code]` | Self: 0.0% (4.6ms) | Total: 0.2% (22.2ms) | Samples: 8

**Called by:**
- `(anonymous)` (6)
- `node:fs` (4)
- `internal:fs/streams` (3)
- `get WriteStream` (3)
- `internal:stream` (3)
- `node:fs/promises` (3)
- `node:stream` (3)
- `node:events` (2)
- `internal:validators` (2)
- `internal:streams/pipeline` (2)
- `internal:streams/compose` (2)
- `internal:streams/duplex` (2)
- `node:fs` (1)
- `internal:shared` (1)
- `internal:streams/operators` (1)

**Calls:**
- `node:fs` (4)
- `internal:fs/streams` (3)
- `internal:stream` (3)
- `node:fs/promises` (3)
- `node:stream` (3)
- `node:events` (2)
- `internal:validators` (2)
- `internal:streams/pipeline` (2)
- `internal:streams/duplex` (2)
- `internal:streams/compose` (2)
- `node:fs` (1)
- `internal:shared` (1)
- `internal:primordials` (1)
- `internal:streams/operators` (1)

### `vecDot`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:53` | Self: 0.0% (4.5ms) | Total: 0.0% (4.5ms) | Samples: 7

**Called by:**
- `step` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` | Self: 0.0% (4.5ms) | Total: 0.2% (19.7ms) | Samples: 7

**Called by:**
- `runTrial` (30)

**Calls:**
- `sort` (23)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:704` | Self: 0.0% (4.2ms) | Total: 0.0% (4.2ms) | Samples: 6

**Called by:**
- `runTrial` (6)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (4.2ms) | Total: 0.0% (4.2ms) | Samples: 6

**Called by:**
- `step` (5)
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:617` | Self: 0.0% (4.1ms) | Total: 0.0% (4.1ms) | Samples: 6

**Called by:**
- `map` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:688` | Self: 0.0% (4.0ms) | Total: 0.0% (4.6ms) | Samples: 6

**Called by:**
- `runTrial` (7)

**Calls:**
- `radius` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:609` | Self: 0.0% (3.8ms) | Total: 0.0% (3.8ms) | Samples: 6

**Called by:**
- `map` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` | Self: 0.0% (3.7ms) | Total: 0.0% (3.7ms) | Samples: 6

**Called by:**
- `runTrial` (6)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:524` | Self: 0.0% (3.4ms) | Total: 0.0% (4.1ms) | Samples: 4

**Called by:**
- `(anonymous)` (5)

**Calls:**
- `some` (1)

### `abs`
`[native code]` | Self: 0.0% (3.3ms) | Total: 0.0% (3.3ms) | Samples: 5

**Called by:**
- `map` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:707` | Self: 0.0% (3.1ms) | Total: 0.0% (3.1ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `reduce`
`[native code]` | Self: 0.0% (2.7ms) | Total: 0.0% (2.7ms) | Samples: 4

**Called by:**
- `step` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` | Self: 0.0% (2.6ms) | Total: 0.0% (2.6ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` | Self: 0.0% (2.5ms) | Total: 0.0% (2.5ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:708` | Self: 0.0% (2.5ms) | Total: 0.0% (2.5ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:690` | Self: 0.0% (2.4ms) | Total: 0.0% (2.4ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 4

**Called by:**
- `step` (4)

### `forEach`
`[native code]` | Self: 0.0% (2.2ms) | Total: 1.8% (174.1ms) | Samples: 4

**Called by:**
- `step` (263)
- `step` (7)

**Calls:**
- `(anonymous)` (239)
- `(anonymous)` (23)
- `(anonymous)` (3)
- `(anonymous)` (1)

### `every`
`[native code]` | Self: 0.0% (2.0ms) | Total: 0.0% (2.0ms) | Samples: 3

**Called by:**
- `requireFiniteVector` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` | Self: 0.0% (2.0ms) | Total: 0.0% (2.0ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `vecNorm`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.9ms) | Total: 0.0% (1.9ms) | Samples: 3

**Called by:**
- `step` (3)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` | Self: 0.0% (1.9ms) | Total: 0.0% (1.9ms) | Samples: 3

**Called by:**
- `step` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` | Self: 0.0% (1.8ms) | Total: 0.0% (4.5ms) | Samples: 3

**Called by:**
- `runTrial` (7)

**Calls:**
- `vecNorm` (3)
- `vecNorm` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:555` | Self: 0.0% (1.8ms) | Total: 0.0% (1.8ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (1.7ms) | Total: 0.6% (64.0ms) | Samples: 2

**Called by:**
- `some` (97)

**Calls:**
- `some` (95)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` | Self: 0.0% (1.6ms) | Total: 0.0% (2.2ms) | Samples: 3

**Called by:**
- `runTrial` (4)

**Calls:**
- `ellipsoidObjective` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` | Self: 0.0% (1.4ms) | Total: 5.3% (507.6ms) | Samples: 2

**Called by:**
- `runTrial` (768)
- `runTrial` (5)

**Calls:**
- `transformFromEigenCoordinates` (761)
- `transformFromEigenCoordinates` (8)
- `transformFromEigenCoordinates` (1)
- `transformFromEigenCoordinates` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` | Self: 0.0% (1.3ms) | Total: 0.7% (67.5ms) | Samples: 2

**Called by:**
- `runTrial` (103)
- `runTrial` (1)

**Calls:**
- `map` (102)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:274` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:623` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `sort` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:652` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:714` | Self: 0.0% (1.2ms) | Total: 0.0% (3.3ms) | Samples: 2

**Called by:**
- `runTrial` (5)

**Calls:**
- `push` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:612` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `max`
`[native code]` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 2

**Called by:**
- `jacobiEigenSymmetric` (2)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.0% (1.2ms) | Total: 0.3% (32.7ms) | Samples: 2

**Called by:**
- `step` (48)
- `reconstructSymmetric` (1)

**Calls:**
- `from` (47)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 2

**Called by:**
- `step` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 2

**Called by:**
- `step` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:621` | Self: 0.0% (1.2ms) | Total: 0.6% (62.4ms) | Samples: 2

**Called by:**
- `map` (99)

**Calls:**
- `map` (97)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:607` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:608` | Self: 0.0% (1.1ms) | Total: 0.1% (9.9ms) | Samples: 2

**Called by:**
- `runTrial` (16)

**Calls:**
- `map` (14)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:679` | Self: 0.0% (1.1ms) | Total: 0.0% (3.8ms) | Samples: 2

**Called by:**
- `runTrial` (6)

**Calls:**
- `reduce` (4)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:675` | Self: 0.0% (1.1ms) | Total: 0.1% (14.9ms) | Samples: 2

**Called by:**
- `forEach` (23)

**Calls:**
- `map` (21)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:537` | Self: 0.0% (1.0ms) | Total: 0.4% (47.1ms) | Samples: 1

**Called by:**
- `step` (69)

**Calls:**
- `cloneMatrix` (66)
- `map` (2)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:26` | Self: 0.0% (781us) | Total: 0.0% (781us) | Samples: 1

**Called by:**
- `reconstructSymmetric` (1)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:235` | Self: 0.0% (766us) | Total: 0.0% (766us) | Samples: 1

**Called by:**
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` | Self: 0.0% (760us) | Total: 0.0% (760us) | Samples: 1

**Called by:**
- `map` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` | Self: 0.0% (744us) | Total: 0.0% (744us) | Samples: 1

**Called by:**
- `forEach` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` | Self: 0.0% (736us) | Total: 0.1% (10.3ms) | Samples: 1

**Called by:**
- `runTrial` (15)
- `runTrial` (1)

**Calls:**
- `map` (15)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` | Self: 0.0% (725us) | Total: 0.1% (10.4ms) | Samples: 1

**Called by:**
- `runTrial` (16)

**Calls:**
- `map` (15)

### `nextOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (723us) | Total: 0.0% (723us) | Samples: 1

**Called by:**
- `sampleGaussianVectorND` (1)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 0.0% (722us) | Total: 1.0% (101.4ms) | Samples: 1

**Called by:**
- `alignProjectionBasis` (66)
- `alignProjectionBasis` (42)
- `step` (41)

**Calls:**
- `map` (148)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:525` | Self: 0.0% (700us) | Total: 0.0% (700us) | Samples: 1

**Called by:**
- `(anonymous)` (1)

### `sqrt`
`[native code]` | Self: 0.0% (685us) | Total: 0.0% (685us) | Samples: 1

**Called by:**
- `sampleGaussianVectorND` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` | Self: 0.0% (668us) | Total: 0.0% (668us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:663` | Self: 0.0% (659us) | Total: 4.3% (414.7ms) | Samples: 1

**Called by:**
- `runTrial` (640)
- `runTrial` (3)

**Calls:**
- `reconstructSymmetric` (640)
- `reconstructSymmetric` (1)
- `reconstructSymmetric` (1)

### `writeFast`
`internal:fs/streams` | Self: 0.0% (657us) | Total: 0.0% (657us) | Samples: 1

**Called by:**
- `(module)` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:172` | Self: 0.0% (654us) | Total: 0.0% (654us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` | Self: 0.0% (652us) | Total: 0.0% (4.7ms) | Samples: 1

**Called by:**
- `runTrial` (7)

**Calls:**
- `map` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:554` | Self: 0.0% (651us) | Total: 0.0% (651us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` | Self: 0.0% (651us) | Total: 0.0% (651us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `variancePercent`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (649us) | Total: 0.0% (649us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:620` | Self: 0.0% (645us) | Total: 0.7% (66.6ms) | Samples: 1

**Called by:**
- `runTrial` (105)
- `runTrial` (1)

**Calls:**
- `map` (105)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` | Self: 0.0% (645us) | Total: 0.0% (8.6ms) | Samples: 1

**Called by:**
- `step` (14)

**Calls:**
- `map` (13)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:667` | Self: 0.0% (640us) | Total: 0.0% (640us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `radius`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (624us) | Total: 0.0% (624us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:640` | Self: 0.0% (623us) | Total: 0.0% (623us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `slice`
`[native code]` | Self: 0.0% (621us) | Total: 0.0% (621us) | Samples: 1

**Called by:**
- `CMAESOptimizerND` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:269` | Self: 0.0% (616us) | Total: 0.0% (616us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` | Self: 0.0% (580us) | Total: 0.0% (580us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` | Self: 0.0% (579us) | Total: 0.3% (34.8ms) | Samples: 1

**Called by:**
- `step` (55)

**Calls:**
- `sort` (46)
- `from` (8)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` | Self: 0.0% (577us) | Total: 44.2% (4.18s) | Samples: 1

**Called by:**
- `runTrial` (6451)
- `runTrial` (25)

**Calls:**
- `jacobiEigenSymmetric` (5989)
- `jacobiEigenSymmetric` (116)
- `jacobiEigenSymmetric` (98)
- `jacobiEigenSymmetric` (64)
- `jacobiEigenSymmetric` (55)
- `jacobiEigenSymmetric` (54)
- `jacobiEigenSymmetric` (48)
- `jacobiEigenSymmetric` (24)
- `jacobiEigenSymmetric` (14)
- `jacobiEigenSymmetric` (4)
- `jacobiEigenSymmetric` (3)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (574us) | Total: 0.0% (574us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:692` | Self: 0.0% (557us) | Total: 0.0% (1.2ms) | Samples: 1

**Called by:**
- `runTrial` (2)

**Calls:**
- `variancePercent` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` | Self: 0.0% (548us) | Total: 0.7% (67.2ms) | Samples: 1

**Called by:**
- `runTrial` (102)

**Calls:**
- `map` (101)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:264` | Self: 0.0% (546us) | Total: 0.0% (546us) | Samples: 1

**Called by:**
- `step` (1)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:237` | Self: 0.0% (539us) | Total: 0.0% (539us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:581` | Self: 0.0% (538us) | Total: 0.0% (4.7ms) | Samples: 1

**Called by:**
- `runTrial` (7)
- `runTrial` (1)

**Calls:**
- `forEach` (7)

### `copyProps`
`internal:primordials` | Self: 0.0% (535us) | Total: 0.0% (535us) | Samples: 1

**Called by:**
- `makeSafe` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:152` | Self: 0.0% (526us) | Total: 0.0% (526us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` | Self: 0.0% (519us) | Total: 0.9% (85.3ms) | Samples: 1

**Called by:**
- `runTrial` (133)

**Calls:**
- `whitenWithEigensystem` (69)
- `whitenWithEigensystem` (62)
- `whitenWithEigensystem` (1)

### `makeSafe`
`internal:primordials:50` | Self: 0.0% (0us) | Total: 0.0% (535us) | Samples: 0

**Called by:**
- `internal:primordials` (1)

**Calls:**
- `copyProps` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:702` | Self: 0.0% (0us) | Total: 0.3% (31.7ms) | Samples: 0

**Called by:**
- `runTrial` (45)

**Calls:**
- `cloneMatrix` (41)
- `map` (4)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:40` | Self: 0.0% (0us) | Total: 0.0% (733us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `fill` (1)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (1.1ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (5.2ms) | Samples: 0

**Called by:**
- `(module)` (9)

**Calls:**
- `anonymous` (6)
- `get WriteStream` (3)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` | Self: 0.0% (0us) | Total: 93.3% (8.83s) | Samples: 0

**Calls:**
- `runTrial` (13604)
- `runTrial` (59)
- `runTrial` (1)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.7ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:590` | Self: 0.0% (0us) | Total: 0.0% (703us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `createZeroVector` (1)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (1.1ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:307` | Self: 0.0% (0us) | Total: 0.0% (685us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `sqrt` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` | Self: 0.0% (0us) | Total: 99.4% (9.41s) | Samples: 0

**Called by:**
- `(module)` (13604)
- `(module)` (953)

**Calls:**
- `step` (6451)
- `step` (2785)
- `step` (777)
- `step` (768)
- `step` (640)
- `step` (638)
- `step` (368)
- `step` (273)
- `step` (261)
- `step` (253)
- `step` (223)
- `step` (199)
- `step` (133)
- `step` (109)
- `step` (105)
- `step` (103)
- `step` (102)
- `step` (45)
- `step` (36)
- `step` (36)
- `step` (30)
- `step` (19)
- `step` (16)
- `step` (16)
- `step` (15)
- `step` (12)
- `step` (10)
- `step` (10)
- `step` (10)
- `step` (9)
- `step` (7)
- `step` (7)
- `step` (7)
- `step` (7)
- `step` (7)
- `step` (6)
- `step` (6)
- `step` (6)
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

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (535us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (1.7ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `vecNorm`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:58` | Self: 0.0% (0us) | Total: 0.0% (723us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `vecDot` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` | Self: 0.0% (0us) | Total: 0.0% (6.7ms) | Samples: 0

**Called by:**
- `runTrial` (10)

**Calls:**
- `projectTo3D` (9)
- `projectTo3D` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` | Self: 0.0% (0us) | Total: 0.0% (5.8ms) | Samples: 0

**Calls:**
- `(anonymous)` (9)
- `writeFast` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` | Self: 0.0% (0us) | Total: 0.0% (1.3ms) | Samples: 0

**Called by:**
- `step` (2)

**Calls:**
- `map` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:694` | Self: 0.0% (0us) | Total: 0.0% (5.7ms) | Samples: 0

**Called by:**
- `runTrial` (9)

**Calls:**
- `projectTo3D` (8)
- `projectTo3D` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:672` | Self: 0.0% (0us) | Total: 1.4% (132.9ms) | Samples: 0

**Called by:**
- `runTrial` (199)
- `runTrial` (2)

**Calls:**
- `alignProjectionBasis` (86)
- `alignProjectionBasis` (69)
- `alignProjectionBasis` (44)
- `alignProjectionBasis` (2)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (1.2ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:467` | Self: 0.0% (0us) | Total: 0.0% (621us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `slice` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` | Self: 0.0% (0us) | Total: 0.6% (64.6ms) | Samples: 0

**Called by:**
- `step` (98)

**Calls:**
- `validateSquareFiniteMatrix` (98)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:626` | Self: 0.0% (0us) | Total: 5.3% (509.4ms) | Samples: 0

**Called by:**
- `runTrial` (777)
- `runTrial` (2)

**Calls:**
- `whitenWithEigensystem` (427)
- `whitenWithEigensystem` (343)
- `whitenWithEigensystem` (5)
- `whitenWithEigensystem` (2)
- `whitenWithEigensystem` (1)
- `whitenWithEigensystem` (1)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (1.1ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `node:fs`
`node:fs:299` | Self: 0.0% (0us) | Total: 0.0% (577us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` | Self: 0.0% (0us) | Total: 1.7% (169.9ms) | Samples: 0

**Called by:**
- `runTrial` (261)
- `runTrial` (2)

**Calls:**
- `forEach` (263)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (0us) | Total: 0.6% (64.6ms) | Samples: 0

**Called by:**
- `jacobiEigenSymmetric` (98)

**Calls:**
- `some` (98)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:468` | Self: 0.0% (0us) | Total: 0.0% (2.4ms) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `map` (1)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (1.7ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (1.7ms) | Samples: 0

**Called by:**
- `(anonymous)` (3)

**Calls:**
- `anonymous` (3)

### `internal:streams/operators`
`internal:streams/operators:2` | Self: 0.0% (0us) | Total: 0.0% (623us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:primordials`
`internal:primordials:73` | Self: 0.0% (0us) | Total: 0.0% (535us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `makeSafe` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` | Self: 0.0% (0us) | Total: 6.6% (625.5ms) | Samples: 0

**Calls:**
- `runTrial` (953)
- `runTrial` (8)
- `runTrial` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` | Self: 0.0% (0us) | Total: 0.3% (28.5ms) | Samples: 0

**Called by:**
- `step` (44)

**Calls:**
- `cloneMatrix` (42)
- `map` (2)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (2.3ms) | Samples: 0

**Called by:**
- `anonymous` (4)

**Calls:**
- `anonymous` (4)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:305` | Self: 0.0% (0us) | Total: 0.0% (723us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `nextOpenUnit` (1)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` | Self: 0.0% (0us) | Total: 0.4% (42.2ms) | Samples: 0

**Called by:**
- `(module)` (59)
- `(module)` (8)

**Calls:**
- `step` (25)
- `step` (16)
- `step` (5)
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
- `step` (1)
- `step` (1)

### `requireFiniteVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:372` | Self: 0.0% (0us) | Total: 0.0% (2.0ms) | Samples: 0

**Called by:**
- `projectTo3D` (3)

**Calls:**
- `every` (3)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:93` | Self: 0.0% (0us) | Total: 0.0% (661us) | Samples: 0

**Calls:**
- `sort` (1)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.7ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` | Self: 0.0% (0us) | Total: 0.0% (3.0ms) | Samples: 0

**Called by:**
- `(module)` (1)
- `(module)` (1)

**Calls:**
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (1.2ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 92.8% | 8.79s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 6.7% | 643.0ms | `[native code]` |
| 0.3% | 30.6ms | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.0% | 657us | `internal:fs/streams` |
| 0.0% | 535us | `internal:primordials` |
