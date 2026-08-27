# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 9.92s | 13028 | 500us | 168 |

**Top 10:** `jacobiEigenSymmetric` 21.2%, `jacobiEigenSymmetric` 21.1%, `step` 19.4%, `transformFromEigenCoordinates` 4.8%, `whitenWithEigensystem` 3.3%, `step` 2.9%, `reconstructSymmetric` 2.5%, `whitenWithEigensystem` 2.5%, `map` 1.9%, `step` 1.9%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 21.2% | 2.10s | 22.2% | 2.20s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:139` |
| 21.1% | 2.09s | 22.0% | 2.18s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` |
| 19.4% | 1.93s | 19.4% | 1.93s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:642` |
| 4.8% | 484.4ms | 4.9% | 493.7ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:247` |
| 3.3% | 332.6ms | 3.4% | 337.9ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:269` |
| 2.9% | 292.3ms | 2.9% | 292.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:631` |
| 2.5% | 252.5ms | 2.9% | 292.4ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:228` |
| 2.5% | 251.2ms | 2.5% | 257.6ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:262` |
| 1.9% | 196.8ms | 4.4% | 446.1ms | `map` | `[native code]` |
| 1.9% | 193.7ms | 1.9% | 193.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:651` |
| 1.9% | 192.7ms | 1.9% | 192.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:678` |
| 1.9% | 188.6ms | 1.9% | 188.6ms | `hypot` | `[native code]` |
| 1.3% | 136.5ms | 2.0% | 203.5ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.2% | 126.4ms | 1.2% | 126.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.2% | 122.0ms | 1.2% | 122.0ms | `fill` | `[native code]` |
| 1.0% | 106.0ms | 1.0% | 106.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` |
| 0.8% | 80.0ms | 0.8% | 80.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` |
| 0.7% | 74.6ms | 0.9% | 95.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` |
| 0.7% | 70.4ms | 0.7% | 70.4ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:527` |
| 0.6% | 67.1ms | 0.6% | 67.1ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:542` |
| 0.5% | 50.2ms | 0.6% | 60.4ms | `sort` | `[native code]` |
| 0.4% | 40.6ms | 0.8% | 84.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.3% | 39.0ms | 0.3% | 39.0ms | `Float64Array` | `[native code]` |
| 0.3% | 35.3ms | 0.3% | 35.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:589` |
| 0.3% | 34.2ms | 1.3% | 138.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` |
| 0.3% | 34.1ms | 0.3% | 34.1ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.3% | 32.0ms | 1.1% | 113.4ms | `some` | `[native code]` |
| 0.3% | 30.2ms | 0.3% | 30.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.2% | 29.4ms | 0.8% | 88.1ms | `from` | `[native code]` |
| 0.2% | 26.4ms | 0.6% | 62.3ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.1% | 17.2ms | 0.1% | 17.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` |
| 0.1% | 17.2ms | 0.1% | 17.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` |
| 0.1% | 13.0ms | 0.1% | 13.0ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:20` |
| 0.0% | 8.3ms | 0.0% | 9.1ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:520` |
| 0.0% | 8.1ms | 0.0% | 8.1ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:300` |
| 0.0% | 7.4ms | 2.2% | 228.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:557` |
| 0.0% | 6.6ms | 0.0% | 6.6ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 0.0% | 6.4ms | 0.0% | 6.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:633` |
| 0.0% | 6.1ms | 0.0% | 6.1ms | `push` | `[native code]` |
| 0.0% | 6.1ms | 0.0% | 8.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:682` |
| 0.0% | 5.9ms | 0.0% | 5.9ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 5.6ms | 0.0% | 5.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:181` |
| 0.0% | 5.4ms | 0.0% | 5.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:698` |
| 0.0% | 5.3ms | 0.0% | 5.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:622` |
| 0.0% | 5.3ms | 0.0% | 5.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:701` |
| 0.0% | 5.1ms | 0.0% | 5.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` |
| 0.0% | 5.1ms | 0.0% | 5.1ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 5.0ms | 0.0% | 5.0ms | `abs` | `[native code]` |
| 0.0% | 4.9ms | 0.6% | 68.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` |
| 0.0% | 4.6ms | 0.0% | 4.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:551` |
| 0.0% | 4.6ms | 0.0% | 4.6ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:51` |
| 0.0% | 4.5ms | 0.0% | 4.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` |
| 0.0% | 3.8ms | 0.0% | 5.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:578` |
| 0.0% | 3.8ms | 0.1% | 13.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:621` |
| 0.0% | 3.7ms | 0.0% | 3.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:702` |
| 0.0% | 3.7ms | 0.0% | 3.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 0.0% | 3.7ms | 0.5% | 57.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` |
| 0.0% | 3.6ms | 0.7% | 74.1ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` |
| 0.0% | 3.5ms | 0.1% | 16.3ms | `anonymous` | `[native code]` |
| 0.0% | 3.2ms | 0.1% | 13.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:522` |
| 0.0% | 2.4ms | 0.5% | 58.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.2ms | 0.0% | 3.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `reduce` | `[native code]` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:707` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:521` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:165` |
| 0.0% | 2.1ms | 1.6% | 165.9ms | `forEach` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:266` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.5ms | 0.2% | 24.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` |
| 0.0% | 1.5ms | 99.4% | 9.86s | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `max` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` |
| 0.0% | 1.4ms | 0.5% | 57.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 0.0% | 1.4ms | 0.0% | 3.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `sqrt` | `[native code]` |
| 0.0% | 1.4ms | 0.0% | 7.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:691` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:599` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:602` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:660` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:684` |
| 0.0% | 1.2ms | 0.0% | 4.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:601` |
| 0.0% | 1.1ms | 0.2% | 26.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:669` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` |
| 0.0% | 920us | 0.0% | 920us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:686` |
| 0.0% | 912us | 0.0% | 912us | `defineCustomPromisify` | `internal:promisify` |
| 0.0% | 896us | 0.0% | 896us | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:19` |
| 0.0% | 879us | 5.2% | 525.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` |
| 0.0% | 875us | 0.0% | 875us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` |
| 0.0% | 864us | 0.0% | 864us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:476` |
| 0.0% | 858us | 0.0% | 858us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` |
| 0.0% | 845us | 0.0% | 845us | `filter` | `[native code]` |
| 0.0% | 842us | 0.0% | 842us | `file` | `[native code]` |
| 0.0% | 834us | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:597` |
| 0.0% | 814us | 0.0% | 814us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 805us | 0.0% | 805us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.0% | 804us | 0.5% | 50.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:696` |
| 0.0% | 780us | 0.0% | 780us | `every` | `[native code]` |
| 0.0% | 775us | 0.0% | 775us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 775us | 0.4% | 41.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:180` |
| 0.0% | 774us | 0.7% | 78.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:596` |
| 0.0% | 770us | 47.5% | 4.71s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:656` |
| 0.0% | 757us | 0.0% | 757us | `createIdentityMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:29` |
| 0.0% | 754us | 0.0% | 754us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:381` |
| 0.0% | 752us | 0.7% | 71.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` |
| 0.0% | 747us | 0.1% | 10.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:687` |
| 0.0% | 747us | 0.4% | 49.2ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:534` |
| 0.0% | 725us | 0.0% | 725us | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:287` |
| 0.0% | 724us | 0.0% | 724us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:567` |
| 0.0% | 721us | 0.0% | 721us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:434` |
| 0.0% | 685us | 0.0% | 685us | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:40` |
| 0.0% | 667us | 0.0% | 667us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` |
| 0.0% | 662us | 5.0% | 501.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:558` |
| 0.0% | 632us | 0.0% | 632us | `internal:streams/end-of-stream` | `internal:streams/end-of-stream:6` |
| 0.0% | 631us | 0.0% | 631us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:629` |
| 0.0% | 618us | 2.9% | 293.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:657` |
| 0.0% | 614us | 1.6% | 164.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:668` |
| 0.0% | 612us | 0.0% | 612us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:591` |
| 0.0% | 538us | 0.0% | 538us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:552` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 99.4% | 9.86s | 0.0% | 1.5ms | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 93.2% | 9.25s | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` |
| 47.5% | 4.71s | 0.0% | 770us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:656` |
| 22.2% | 2.20s | 21.2% | 2.10s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:139` |
| 22.0% | 2.18s | 21.1% | 2.09s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` |
| 19.4% | 1.93s | 19.4% | 1.93s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:642` |
| 6.7% | 665.6ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` |
| 5.2% | 525.8ms | 0.0% | 879us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` |
| 5.0% | 501.8ms | 0.0% | 662us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:558` |
| 4.9% | 493.7ms | 4.8% | 484.4ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:247` |
| 4.4% | 446.1ms | 1.9% | 196.8ms | `map` | `[native code]` |
| 3.4% | 337.9ms | 3.3% | 332.6ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:269` |
| 2.9% | 293.0ms | 0.0% | 618us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:657` |
| 2.9% | 292.4ms | 2.5% | 252.5ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:228` |
| 2.9% | 292.3ms | 2.9% | 292.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:631` |
| 2.5% | 257.6ms | 2.5% | 251.2ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:262` |
| 2.2% | 228.0ms | 0.0% | 7.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:557` |
| 2.0% | 203.5ms | 1.3% | 136.5ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.9% | 193.7ms | 1.9% | 193.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:651` |
| 1.9% | 192.7ms | 1.9% | 192.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:678` |
| 1.9% | 188.6ms | 1.9% | 188.6ms | `hypot` | `[native code]` |
| 1.6% | 165.9ms | 0.0% | 2.1ms | `forEach` | `[native code]` |
| 1.6% | 164.4ms | 0.0% | 614us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:668` |
| 1.4% | 147.1ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 1.3% | 138.2ms | 0.3% | 34.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` |
| 1.2% | 126.4ms | 1.2% | 126.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.2% | 122.0ms | 1.2% | 122.0ms | `fill` | `[native code]` |
| 1.2% | 119.6ms | 0.0% | 0us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` |
| 1.1% | 113.4ms | 0.3% | 32.0ms | `some` | `[native code]` |
| 1.0% | 106.0ms | 1.0% | 106.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` |
| 0.9% | 95.9ms | 0.7% | 74.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` |
| 0.8% | 88.1ms | 0.2% | 29.4ms | `from` | `[native code]` |
| 0.8% | 84.9ms | 0.4% | 40.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.8% | 80.0ms | 0.8% | 80.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` |
| 0.7% | 78.2ms | 0.0% | 774us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:596` |
| 0.7% | 74.1ms | 0.0% | 3.6ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` |
| 0.7% | 71.7ms | 0.0% | 752us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` |
| 0.7% | 70.4ms | 0.7% | 70.4ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:527` |
| 0.6% | 68.0ms | 0.0% | 4.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` |
| 0.6% | 67.1ms | 0.6% | 67.1ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:542` |
| 0.6% | 62.3ms | 0.2% | 26.4ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.6% | 61.6ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` |
| 0.6% | 60.4ms | 0.5% | 50.2ms | `sort` | `[native code]` |
| 0.5% | 58.7ms | 0.0% | 2.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 0.5% | 57.9ms | 0.0% | 3.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` |
| 0.5% | 57.4ms | 0.0% | 1.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 0.5% | 57.4ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:106` |
| 0.5% | 57.4ms | 0.0% | 0us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 0.5% | 50.5ms | 0.0% | 804us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:696` |
| 0.4% | 49.2ms | 0.0% | 747us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:534` |
| 0.4% | 44.5ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` |
| 0.4% | 41.8ms | 0.0% | 775us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:180` |
| 0.3% | 39.0ms | 0.3% | 39.0ms | `Float64Array` | `[native code]` |
| 0.3% | 35.3ms | 0.3% | 35.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:589` |
| 0.3% | 34.1ms | 0.3% | 34.1ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.3% | 30.7ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:546` |
| 0.3% | 30.2ms | 0.3% | 30.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.2% | 26.0ms | 0.0% | 1.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:669` |
| 0.2% | 24.9ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` |
| 0.1% | 17.8ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 0.1% | 17.2ms | 0.1% | 17.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` |
| 0.1% | 17.2ms | 0.1% | 17.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` |
| 0.1% | 16.3ms | 0.0% | 3.5ms | `anonymous` | `[native code]` |
| 0.1% | 13.7ms | 0.0% | 3.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:621` |
| 0.1% | 13.2ms | 0.0% | 3.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.1% | 13.0ms | 0.1% | 13.0ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:20` |
| 0.1% | 10.2ms | 0.0% | 747us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:687` |
| 0.0% | 9.1ms | 0.0% | 8.3ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:520` |
| 0.0% | 8.8ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:688` |
| 0.0% | 8.3ms | 0.0% | 6.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:682` |
| 0.0% | 8.1ms | 0.0% | 8.1ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:300` |
| 0.0% | 7.7ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 7.7ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:691` |
| 0.0% | 7.6ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.0% | 6.8ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:667` |
| 0.0% | 6.6ms | 0.0% | 6.6ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 0.0% | 6.4ms | 0.0% | 6.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:633` |
| 0.0% | 6.1ms | 0.0% | 6.1ms | `push` | `[native code]` |
| 0.0% | 5.9ms | 0.0% | 3.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:578` |
| 0.0% | 5.9ms | 0.0% | 5.9ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 5.9ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.0% | 5.9ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.0% | 5.6ms | 0.0% | 5.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:181` |
| 0.0% | 5.4ms | 0.0% | 5.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:698` |
| 0.0% | 5.3ms | 0.0% | 5.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:622` |
| 0.0% | 5.3ms | 0.0% | 5.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:701` |
| 0.0% | 5.1ms | 0.0% | 5.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` |
| 0.0% | 5.1ms | 0.0% | 5.1ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 5.0ms | 0.0% | 5.0ms | `abs` | `[native code]` |
| 0.0% | 4.7ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` |
| 0.0% | 4.6ms | 0.0% | 4.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:551` |
| 0.0% | 4.6ms | 0.0% | 4.6ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:51` |
| 0.0% | 4.5ms | 0.0% | 4.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` |
| 0.0% | 4.5ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` |
| 0.0% | 4.4ms | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:601` |
| 0.0% | 3.7ms | 0.0% | 3.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:702` |
| 0.0% | 3.7ms | 0.0% | 3.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 0.0% | 3.6ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` |
| 0.0% | 3.3ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.0% | 3.2ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:522` |
| 0.0% | 2.7ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `radius` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.2ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `reduce` | `[native code]` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:707` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:521` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:165` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:266` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.5ms | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:302` |
| 0.0% | 1.5ms | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:419` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.5ms | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:303` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `max` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` |
| 0.0% | 1.4ms | 0.0% | 834us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:597` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `sqrt` | `[native code]` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:599` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:602` |
| 0.0% | 1.4ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:660` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:684` |
| 0.0% | 1.3ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 1.3ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 1.3ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 1.3ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` |
| 0.0% | 920us | 0.0% | 920us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:686` |
| 0.0% | 912us | 0.0% | 912us | `defineCustomPromisify` | `internal:promisify` |
| 0.0% | 912us | 0.0% | 0us | `internal:promisify` | `internal:promisify:55` |
| 0.0% | 912us | 0.0% | 0us | `node:fs` | `node:fs:299` |
| 0.0% | 896us | 0.0% | 896us | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:19` |
| 0.0% | 896us | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.0% | 875us | 0.0% | 875us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` |
| 0.0% | 864us | 0.0% | 864us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:476` |
| 0.0% | 858us | 0.0% | 858us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` |
| 0.0% | 845us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:463` |
| 0.0% | 845us | 0.0% | 845us | `filter` | `[native code]` |
| 0.0% | 842us | 0.0% | 842us | `file` | `[native code]` |
| 0.0% | 842us | 0.0% | 0us | `WriteStream` | `internal:fs/streams:251` |
| 0.0% | 828us | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:132` |
| 0.0% | 814us | 0.0% | 814us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 808us | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 0.0% | 805us | 0.0% | 805us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.0% | 780us | 0.0% | 0us | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:369` |
| 0.0% | 780us | 0.0% | 780us | `every` | `[native code]` |
| 0.0% | 775us | 0.0% | 775us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 770us | 0.0% | 0us | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:56` |
| 0.0% | 757us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:453` |
| 0.0% | 757us | 0.0% | 757us | `createIdentityMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:29` |
| 0.0% | 754us | 0.0% | 754us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:381` |
| 0.0% | 725us | 0.0% | 725us | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:287` |
| 0.0% | 725us | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:306` |
| 0.0% | 724us | 0.0% | 724us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:567` |
| 0.0% | 721us | 0.0% | 721us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:434` |
| 0.0% | 692us | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 692us | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 692us | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 685us | 0.0% | 685us | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:40` |
| 0.0% | 667us | 0.0% | 667us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` |
| 0.0% | 632us | 0.0% | 0us | `internal:streams/operators` | `internal:streams/operators:2` |
| 0.0% | 632us | 0.0% | 632us | `internal:streams/end-of-stream` | `internal:streams/end-of-stream:6` |
| 0.0% | 631us | 0.0% | 631us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:629` |
| 0.0% | 612us | 0.0% | 612us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:591` |
| 0.0% | 538us | 0.0% | 538us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:552` |

## Function Details

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:139` | Self: 21.2% (2.10s) | Total: 22.2% (2.20s) | Samples: 2784

**Called by:**
- `step` (2915)

**Calls:**
- `hypot` (131)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` | Self: 21.1% (2.09s) | Total: 22.0% (2.18s) | Samples: 2765

**Called by:**
- `step` (2884)

**Calls:**
- `hypot` (119)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:642` | Self: 19.4% (1.93s) | Total: 19.4% (1.93s) | Samples: 2539

**Called by:**
- `runTrial` (2529)
- `runTrial` (10)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:247` | Self: 4.8% (484.4ms) | Total: 4.9% (493.7ms) | Samples: 640

**Called by:**
- `step` (652)

**Calls:**
- `fill` (6)
- `createZeroVector` (6)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:269` | Self: 3.3% (332.6ms) | Total: 3.4% (337.9ms) | Samples: 431

**Called by:**
- `step` (376)
- `step` (63)

**Calls:**
- `createZeroVector` (6)
- `fill` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:631` | Self: 2.9% (292.3ms) | Total: 2.9% (292.3ms) | Samples: 380

**Called by:**
- `runTrial` (378)
- `runTrial` (2)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:228` | Self: 2.5% (252.5ms) | Total: 2.9% (292.4ms) | Samples: 330

**Called by:**
- `step` (383)

**Calls:**
- `from` (53)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:262` | Self: 2.5% (251.2ms) | Total: 2.5% (257.6ms) | Samples: 331

**Called by:**
- `step` (300)
- `step` (38)

**Calls:**
- `createZeroVector` (5)
- `fill` (2)

### `map`
`[native code]` | Self: 1.9% (196.8ms) | Total: 4.4% (446.1ms) | Samples: 260

**Called by:**
- `cloneMatrix` (160)
- `step` (94)
- `step` (84)
- `(anonymous)` (77)
- `step` (72)
- `(anonymous)` (33)
- `jacobiEigenSymmetric` (12)
- `step` (10)
- `step` (9)
- `step` (8)
- `step` (8)
- `step` (6)
- `jacobiEigenSymmetric` (6)
- `jacobiEigenSymmetric` (4)
- `step` (4)
- `alignProjectionBasis` (2)
- `alignProjectionBasis` (2)
- `map` (2)

**Calls:**
- `(anonymous)` (132)
- `(anonymous)` (107)
- `(anonymous)` (80)
- `abs` (6)
- `(anonymous)` (2)
- `(anonymous)` (2)
- `map` (2)
- `(anonymous)` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:651` | Self: 1.9% (193.7ms) | Total: 1.9% (193.7ms) | Samples: 247

**Called by:**
- `runTrial` (247)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:678` | Self: 1.9% (192.7ms) | Total: 1.9% (192.7ms) | Samples: 250

**Called by:**
- `runTrial` (249)
- `runTrial` (1)

### `hypot`
`[native code]` | Self: 1.9% (188.6ms) | Total: 1.9% (188.6ms) | Samples: 250

**Called by:**
- `jacobiEigenSymmetric` (131)
- `jacobiEigenSymmetric` (119)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.3% (136.5ms) | Total: 2.0% (203.5ms) | Samples: 172

**Called by:**
- `step` (260)

**Calls:**
- `fill` (88)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.2% (126.4ms) | Total: 1.2% (126.4ms) | Samples: 165

**Called by:**
- `map` (132)
- `some` (31)
- `forEach` (1)
- `CMAESOptimizerND` (1)

### `fill`
`[native code]` | Self: 1.2% (122.0ms) | Total: 1.2% (122.0ms) | Samples: 160

**Called by:**
- `sampleGaussianVectorND` (88)
- `ellipsoidObjective` (47)
- `from` (15)
- `transformFromEigenCoordinates` (6)
- `whitenWithEigensystem` (2)
- `whitenWithEigensystem` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:647` | Self: 1.0% (106.0ms) | Total: 1.0% (106.0ms) | Samples: 141

**Called by:**
- `runTrial` (140)
- `runTrial` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` | Self: 0.8% (80.0ms) | Total: 0.8% (80.0ms) | Samples: 107

**Called by:**
- `map` (107)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` | Self: 0.7% (74.6ms) | Total: 0.9% (95.9ms) | Samples: 99

**Called by:**
- `step` (127)

**Calls:**
- `Float64Array` (28)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:527` | Self: 0.7% (70.4ms) | Total: 0.7% (70.4ms) | Samples: 93

**Called by:**
- `projectTo3D` (93)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:542` | Self: 0.6% (67.1ms) | Total: 0.6% (67.1ms) | Samples: 87

**Called by:**
- `step` (87)

### `sort`
`[native code]` | Self: 0.5% (50.2ms) | Total: 0.6% (60.4ms) | Samples: 65

**Called by:**
- `jacobiEigenSymmetric` (49)
- `step` (30)

**Calls:**
- `(anonymous)` (8)
- `(anonymous)` (6)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.4% (40.6ms) | Total: 0.8% (84.9ms) | Samples: 54

**Called by:**
- `step` (112)

**Calls:**
- `from` (58)

### `Float64Array`
`[native code]` | Self: 0.3% (39.0ms) | Total: 0.3% (39.0ms) | Samples: 45

**Called by:**
- `jacobiEigenSymmetric` (28)
- `jacobiEigenSymmetric` (17)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:589` | Self: 0.3% (35.3ms) | Total: 0.3% (35.3ms) | Samples: 46

**Called by:**
- `runTrial` (46)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:670` | Self: 0.3% (34.2ms) | Total: 1.3% (138.2ms) | Samples: 36

**Called by:**
- `forEach` (176)

**Calls:**
- `projectTo3D` (98)
- `projectTo3D` (25)
- `projectTo3D` (13)
- `projectTo3D` (3)
- `projectTo3D` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.3% (34.1ms) | Total: 0.3% (34.1ms) | Samples: 46

**Called by:**
- `(anonymous)` (25)
- `step` (11)
- `step` (10)

### `some`
`[native code]` | Self: 0.3% (32.0ms) | Total: 1.1% (113.4ms) | Samples: 43

**Called by:**
- `validateSquareFiniteMatrix` (76)
- `(anonymous)` (74)

**Calls:**
- `(anonymous)` (76)
- `(anonymous)` (31)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.3% (30.2ms) | Total: 0.3% (30.2ms) | Samples: 40

**Called by:**
- `from` (40)

### `from`
`[native code]` | Self: 0.2% (29.4ms) | Total: 0.8% (88.1ms) | Samples: 40

**Called by:**
- `jacobiEigenSymmetric` (58)
- `reconstructSymmetric` (53)
- `jacobiEigenSymmetric` (6)

**Calls:**
- `(anonymous)` (40)
- `(anonymous)` (22)
- `fill` (15)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` | Self: 0.2% (26.4ms) | Total: 0.6% (62.3ms) | Samples: 35

**Called by:**
- `step` (82)

**Calls:**
- `fill` (47)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` | Self: 0.1% (17.2ms) | Total: 0.1% (17.2ms) | Samples: 22

**Called by:**
- `from` (22)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:643` | Self: 0.1% (17.2ms) | Total: 0.1% (17.2ms) | Samples: 20

**Called by:**
- `runTrial` (20)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:20` | Self: 0.1% (13.0ms) | Total: 0.1% (13.0ms) | Samples: 17

**Called by:**
- `transformFromEigenCoordinates` (6)
- `whitenWithEigensystem` (6)
- `whitenWithEigensystem` (5)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:520` | Self: 0.0% (8.3ms) | Total: 0.0% (9.1ms) | Samples: 13

**Called by:**
- `(anonymous)` (13)
- `step` (1)

**Calls:**
- `requireFiniteVector` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:300` | Self: 0.0% (8.1ms) | Total: 0.0% (8.1ms) | Samples: 11

**Called by:**
- `step` (11)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:557` | Self: 0.0% (7.4ms) | Total: 2.2% (228.0ms) | Samples: 10

**Called by:**
- `runTrial` (292)
- `runTrial` (1)

**Calls:**
- `sampleGaussianVectorND` (260)
- `sampleGaussianVectorND` (11)
- `push` (7)
- `sampleGaussianVectorND` (2)
- `sampleGaussianVectorND` (2)
- `sampleGaussianVectorND` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` | Self: 0.0% (6.6ms) | Total: 0.0% (6.6ms) | Samples: 7

**Called by:**
- `step` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:633` | Self: 0.0% (6.4ms) | Total: 0.0% (6.4ms) | Samples: 9

**Called by:**
- `runTrial` (9)

### `push`
`[native code]` | Self: 0.0% (6.1ms) | Total: 0.0% (6.1ms) | Samples: 8

**Called by:**
- `step` (7)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:682` | Self: 0.0% (6.1ms) | Total: 0.0% (8.3ms) | Samples: 8

**Called by:**
- `runTrial` (11)

**Calls:**
- `radius` (3)

### `vecDot`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (5.9ms) | Total: 0.0% (5.9ms) | Samples: 8

**Called by:**
- `step` (8)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:181` | Self: 0.0% (5.6ms) | Total: 0.0% (5.6ms) | Samples: 8

**Called by:**
- `sort` (8)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:698` | Self: 0.0% (5.4ms) | Total: 0.0% (5.4ms) | Samples: 7

**Called by:**
- `runTrial` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:622` | Self: 0.0% (5.3ms) | Total: 0.0% (5.3ms) | Samples: 7

**Called by:**
- `runTrial` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:701` | Self: 0.0% (5.3ms) | Total: 0.0% (5.3ms) | Samples: 7

**Called by:**
- `runTrial` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` | Self: 0.0% (5.1ms) | Total: 0.0% (5.1ms) | Samples: 7

**Called by:**
- `runTrial` (7)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (5.1ms) | Total: 0.0% (5.1ms) | Samples: 7

**Called by:**
- `step` (5)
- `step` (2)

### `abs`
`[native code]` | Self: 0.0% (5.0ms) | Total: 0.0% (5.0ms) | Samples: 7

**Called by:**
- `map` (6)
- `jacobiEigenSymmetric` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` | Self: 0.0% (4.9ms) | Total: 0.6% (68.0ms) | Samples: 7

**Called by:**
- `runTrial` (90)

**Calls:**
- `ellipsoidObjective` (82)
- `ellipsoidObjective` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:551` | Self: 0.0% (4.6ms) | Total: 0.0% (4.6ms) | Samples: 6

**Called by:**
- `runTrial` (6)

### `vecDot`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:51` | Self: 0.0% (4.6ms) | Total: 0.0% (4.6ms) | Samples: 6

**Called by:**
- `step` (5)
- `vecNorm` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` | Self: 0.0% (4.5ms) | Total: 0.0% (4.5ms) | Samples: 6

**Called by:**
- `sort` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:578` | Self: 0.0% (3.8ms) | Total: 0.0% (5.9ms) | Samples: 1

**Called by:**
- `runTrial` (4)

**Calls:**
- `forEach` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:621` | Self: 0.0% (3.8ms) | Total: 0.1% (13.7ms) | Samples: 5

**Called by:**
- `runTrial` (18)

**Calls:**
- `vecDot` (8)
- `vecDot` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:702` | Self: 0.0% (3.7ms) | Total: 0.0% (3.7ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` | Self: 0.0% (3.7ms) | Total: 0.0% (3.7ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` | Self: 0.0% (3.7ms) | Total: 0.5% (57.9ms) | Samples: 5

**Called by:**
- `runTrial` (77)

**Calls:**
- `map` (72)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` | Self: 0.0% (3.6ms) | Total: 0.7% (74.1ms) | Samples: 5

**Called by:**
- `(anonymous)` (98)

**Calls:**
- `coordinate` (93)

### `anonymous`
`[native code]` | Self: 0.0% (3.5ms) | Total: 0.1% (16.3ms) | Samples: 4

**Called by:**
- `(anonymous)` (4)
- `internal:fs/streams` (2)
- `get WriteStream` (2)
- `internal:stream` (2)
- `node:stream` (2)
- `node:fs` (2)
- `internal:streams/pipeline` (1)
- `node:fs` (1)
- `internal:streams/operators` (1)
- `internal:streams/compose` (1)
- `node:fs/promises` (1)
- `internal:streams/duplex` (1)

**Calls:**
- `internal:fs/streams` (2)
- `internal:stream` (2)
- `node:stream` (2)
- `node:fs` (2)
- `internal:streams/end-of-stream` (1)
- `internal:streams/pipeline` (1)
- `node:fs` (1)
- `internal:promisify` (1)
- `internal:streams/operators` (1)
- `internal:streams/compose` (1)
- `node:fs/promises` (1)
- `internal:streams/duplex` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` | Self: 0.0% (3.2ms) | Total: 0.1% (13.2ms) | Samples: 4

**Called by:**
- `step` (18)

**Calls:**
- `map` (12)
- `max` (2)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:522` | Self: 0.0% (2.8ms) | Total: 0.0% (2.8ms) | Samples: 4

**Called by:**
- `step` (2)
- `step` (1)
- `(anonymous)` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` | Self: 0.0% (2.4ms) | Total: 0.5% (58.7ms) | Samples: 3

**Called by:**
- `map` (80)

**Calls:**
- `map` (77)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (2.4ms) | Total: 0.0% (2.4ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `vecNorm`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 3

**Called by:**
- `step` (3)

### `radius`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (2.2ms) | Total: 0.0% (2.2ms) | Samples: 3

**Called by:**
- `step` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` | Self: 0.0% (2.2ms) | Total: 0.0% (3.3ms) | Samples: 3

**Called by:**
- `runTrial` (4)

**Calls:**
- `push` (1)

### `reduce`
`[native code]` | Self: 0.0% (2.2ms) | Total: 0.0% (2.2ms) | Samples: 3

**Called by:**
- `step` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:707` | Self: 0.0% (2.1ms) | Total: 0.0% (2.1ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:521` | Self: 0.0% (2.1ms) | Total: 0.0% (2.1ms) | Samples: 3

**Called by:**
- `(anonymous)` (3)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:165` | Self: 0.0% (2.1ms) | Total: 0.0% (2.1ms) | Samples: 3

**Called by:**
- `step` (3)

### `forEach`
`[native code]` | Self: 0.0% (2.1ms) | Total: 1.6% (165.9ms) | Samples: 3

**Called by:**
- `step` (210)
- `step` (3)

**Calls:**
- `(anonymous)` (176)
- `(anonymous)` (33)
- `(anonymous)` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:266` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `step` (2)

### `nextOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `sampleGaussianVectorND` (2)

### `nextHalfOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `sampleGaussianVectorND` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` | Self: 0.0% (1.5ms) | Total: 0.2% (24.9ms) | Samples: 2

**Called by:**
- `runTrial` (32)

**Calls:**
- `sort` (30)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` | Self: 0.0% (1.5ms) | Total: 99.4% (9.86s) | Samples: 2

**Called by:**
- `(module)` (12079)
- `(module)` (879)

**Calls:**
- `step` (6191)
- `step` (2529)
- `step` (682)
- `step` (659)
- `step` (383)
- `step` (378)
- `step` (292)
- `step` (249)
- `step` (247)
- `step` (210)
- `step` (194)
- `step` (140)
- `step` (104)
- `step` (95)
- `step` (90)
- `step` (82)
- `step` (77)
- `step` (67)
- `step` (46)
- `step` (32)
- `step` (20)
- `step` (18)
- `step` (13)
- `step` (12)
- `step` (11)
- `step` (10)
- `step` (10)
- `step` (9)
- `step` (9)
- `step` (7)
- `step` (7)
- `step` (7)
- `step` (7)
- `step` (6)
- `step` (6)
- `step` (6)
- `step` (5)
- `step` (5)
- `step` (5)
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

### `max`
`[native code]` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `jacobiEigenSymmetric` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` | Self: 0.0% (1.4ms) | Total: 0.5% (57.4ms) | Samples: 2

**Called by:**
- `some` (76)

**Calls:**
- `some` (74)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:673` | Self: 0.0% (1.4ms) | Total: 0.0% (3.6ms) | Samples: 2

**Called by:**
- `runTrial` (5)

**Calls:**
- `reduce` (3)

### `sqrt`
`[native code]` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `step` (1)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:691` | Self: 0.0% (1.4ms) | Total: 0.0% (7.7ms) | Samples: 2

**Called by:**
- `runTrial` (10)

**Calls:**
- `map` (8)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:599` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `map` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:602` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:660` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:684` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:601` | Self: 0.0% (1.2ms) | Total: 0.0% (4.4ms) | Samples: 2

**Called by:**
- `runTrial` (6)

**Calls:**
- `vecNorm` (3)
- `vecNorm` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:669` | Self: 0.0% (1.1ms) | Total: 0.2% (26.0ms) | Samples: 2

**Called by:**
- `forEach` (33)
- `map` (2)

**Calls:**
- `map` (33)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` | Self: 0.0% (1.1ms) | Total: 0.0% (1.1ms) | Samples: 2

**Called by:**
- `map` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:686` | Self: 0.0% (920us) | Total: 0.0% (920us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `defineCustomPromisify`
`internal:promisify` | Self: 0.0% (912us) | Total: 0.0% (912us) | Samples: 1

**Called by:**
- `internal:promisify` (1)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:19` | Self: 0.0% (896us) | Total: 0.0% (896us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` | Self: 0.0% (879us) | Total: 5.2% (525.8ms) | Samples: 1

**Called by:**
- `runTrial` (682)
- `runTrial` (2)

**Calls:**
- `whitenWithEigensystem` (376)
- `whitenWithEigensystem` (300)
- `whitenWithEigensystem` (5)
- `whitenWithEigensystem` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` | Self: 0.0% (875us) | Total: 0.0% (875us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:476` | Self: 0.0% (864us) | Total: 0.0% (864us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` | Self: 0.0% (858us) | Total: 0.0% (858us) | Samples: 1

**Called by:**
- `step` (1)

### `filter`
`[native code]` | Self: 0.0% (845us) | Total: 0.0% (845us) | Samples: 1

**Called by:**
- `CMAESOptimizerND` (1)

### `file`
`[native code]` | Self: 0.0% (842us) | Total: 0.0% (842us) | Samples: 1

**Called by:**
- `WriteStream` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:597` | Self: 0.0% (834us) | Total: 0.0% (1.4ms) | Samples: 1

**Called by:**
- `runTrial` (2)

**Calls:**
- `sqrt` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (814us) | Total: 0.0% (814us) | Samples: 1

**Called by:**
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.0% (805us) | Total: 0.0% (805us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:696` | Self: 0.0% (804us) | Total: 0.5% (50.5ms) | Samples: 1

**Called by:**
- `runTrial` (67)

**Calls:**
- `cloneMatrix` (58)
- `map` (8)

### `every`
`[native code]` | Self: 0.0% (780us) | Total: 0.0% (780us) | Samples: 1

**Called by:**
- `requireFiniteVector` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (775us) | Total: 0.0% (775us) | Samples: 1

**Called by:**
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:180` | Self: 0.0% (775us) | Total: 0.4% (41.8ms) | Samples: 1

**Called by:**
- `step` (56)

**Calls:**
- `sort` (49)
- `from` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:596` | Self: 0.0% (774us) | Total: 0.7% (78.2ms) | Samples: 1

**Called by:**
- `runTrial` (104)

**Calls:**
- `whitenWithEigensystem` (63)
- `whitenWithEigensystem` (38)
- `whitenWithEigensystem` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:656` | Self: 0.0% (770us) | Total: 47.5% (4.71s) | Samples: 1

**Called by:**
- `runTrial` (6191)
- `runTrial` (32)

**Calls:**
- `jacobiEigenSymmetric` (2915)
- `jacobiEigenSymmetric` (2884)
- `jacobiEigenSymmetric` (127)
- `jacobiEigenSymmetric` (112)
- `jacobiEigenSymmetric` (76)
- `jacobiEigenSymmetric` (56)
- `jacobiEigenSymmetric` (18)
- `jacobiEigenSymmetric` (17)
- `jacobiEigenSymmetric` (6)
- `jacobiEigenSymmetric` (4)
- `jacobiEigenSymmetric` (3)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)

### `createIdentityMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:29` | Self: 0.0% (757us) | Total: 0.0% (757us) | Samples: 1

**Called by:**
- `CMAESOptimizerND` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:381` | Self: 0.0% (754us) | Total: 0.0% (754us) | Samples: 1

**Called by:**
- `CMAESOptimizerND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` | Self: 0.0% (752us) | Total: 0.7% (71.7ms) | Samples: 1

**Called by:**
- `runTrial` (95)

**Calls:**
- `map` (94)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:687` | Self: 0.0% (747us) | Total: 0.1% (10.2ms) | Samples: 1

**Called by:**
- `runTrial` (13)
- `runTrial` (1)

**Calls:**
- `projectTo3D` (11)
- `projectTo3D` (1)
- `projectTo3D` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:534` | Self: 0.0% (747us) | Total: 0.4% (49.2ms) | Samples: 1

**Called by:**
- `step` (66)

**Calls:**
- `cloneMatrix` (63)
- `map` (2)

### `nextHalfOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:287` | Self: 0.0% (725us) | Total: 0.0% (725us) | Samples: 1

**Called by:**
- `sampleGaussianVectorND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:567` | Self: 0.0% (724us) | Total: 0.0% (724us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:434` | Self: 0.0% (721us) | Total: 0.0% (721us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:40` | Self: 0.0% (685us) | Total: 0.0% (685us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` | Self: 0.0% (667us) | Total: 0.0% (667us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:558` | Self: 0.0% (662us) | Total: 5.0% (501.8ms) | Samples: 1

**Called by:**
- `runTrial` (659)
- `runTrial` (2)

**Calls:**
- `transformFromEigenCoordinates` (652)
- `transformFromEigenCoordinates` (7)
- `transformFromEigenCoordinates` (1)

### `internal:streams/end-of-stream`
`internal:streams/end-of-stream:6` | Self: 0.0% (632us) | Total: 0.0% (632us) | Samples: 1

**Called by:**
- `anonymous` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:629` | Self: 0.0% (631us) | Total: 0.0% (631us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:657` | Self: 0.0% (618us) | Total: 2.9% (293.0ms) | Samples: 1

**Called by:**
- `runTrial` (383)
- `runTrial` (1)

**Calls:**
- `reconstructSymmetric` (383)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:668` | Self: 0.0% (614us) | Total: 1.6% (164.4ms) | Samples: 1

**Called by:**
- `runTrial` (210)
- `runTrial` (1)

**Calls:**
- `forEach` (210)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:591` | Self: 0.0% (612us) | Total: 0.0% (612us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:552` | Self: 0.0% (538us) | Total: 0.0% (538us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` | Self: 0.0% (0us) | Total: 0.1% (17.8ms) | Samples: 0

**Called by:**
- `step` (17)

**Calls:**
- `Float64Array` (17)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` | Self: 0.0% (0us) | Total: 0.0% (7.6ms) | Samples: 0

**Called by:**
- `runTrial` (10)

**Calls:**
- `map` (10)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` | Self: 0.0% (0us) | Total: 93.2% (9.25s) | Samples: 0

**Calls:**
- `runTrial` (12079)
- `runTrial` (49)
- `runTrial` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` | Self: 0.0% (0us) | Total: 0.6% (61.6ms) | Samples: 0

**Called by:**
- `runTrial` (82)
- `runTrial` (2)

**Calls:**
- `map` (84)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:453` | Self: 0.0% (0us) | Total: 0.0% (757us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `createIdentityMatrix` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:667` | Self: 0.0% (0us) | Total: 0.0% (6.8ms) | Samples: 0

**Called by:**
- `runTrial` (9)

**Calls:**
- `map` (9)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (2.2ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` | Self: 0.0% (0us) | Total: 0.0% (2.7ms) | Samples: 0

**Called by:**
- `runTrial` (4)

**Calls:**
- `map` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` | Self: 0.0% (0us) | Total: 1.4% (147.1ms) | Samples: 0

**Called by:**
- `runTrial` (194)

**Calls:**
- `alignProjectionBasis` (87)
- `alignProjectionBasis` (66)
- `alignProjectionBasis` (41)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` | Self: 0.0% (0us) | Total: 1.2% (119.6ms) | Samples: 0

**Called by:**
- `alignProjectionBasis` (63)
- `step` (58)
- `alignProjectionBasis` (39)

**Calls:**
- `map` (160)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (692us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:106` | Self: 0.0% (0us) | Total: 0.5% (57.4ms) | Samples: 0

**Called by:**
- `step` (76)

**Calls:**
- `validateSquareFiniteMatrix` (76)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` | Self: 0.0% (0us) | Total: 6.7% (665.6ms) | Samples: 0

**Calls:**
- `runTrial` (879)
- `runTrial` (8)
- `runTrial` (1)

### `requireFiniteVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:369` | Self: 0.0% (0us) | Total: 0.0% (780us) | Samples: 0

**Called by:**
- `projectTo3D` (1)

**Calls:**
- `every` (1)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (692us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` | Self: 0.0% (0us) | Total: 0.0% (5.9ms) | Samples: 0

**Calls:**
- `(anonymous)` (7)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.3ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` | Self: 0.0% (0us) | Total: 0.0% (4.5ms) | Samples: 0

**Called by:**
- `runTrial` (6)

**Calls:**
- `map` (6)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (5.9ms) | Samples: 0

**Called by:**
- `(module)` (7)

**Calls:**
- `anonymous` (4)
- `get WriteStream` (2)
- `WriteStream` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` | Self: 0.0% (0us) | Total: 0.0% (7.7ms) | Samples: 0

**Called by:**
- `step` (6)

**Calls:**
- `map` (6)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:546` | Self: 0.0% (0us) | Total: 0.3% (30.7ms) | Samples: 0

**Called by:**
- `step` (41)

**Calls:**
- `cloneMatrix` (39)
- `map` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` | Self: 0.0% (0us) | Total: 0.0% (3.2ms) | Samples: 0

**Called by:**
- `step` (4)

**Calls:**
- `map` (4)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (692us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `WriteStream`
`internal:fs/streams:251` | Self: 0.0% (0us) | Total: 0.0% (842us) | Samples: 0

**Called by:**
- `(anonymous)` (1)

**Calls:**
- `file` (1)

### `node:fs`
`node:fs:299` | Self: 0.0% (0us) | Total: 0.0% (912us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` | Self: 0.0% (0us) | Total: 0.5% (57.4ms) | Samples: 0

**Called by:**
- `jacobiEigenSymmetric` (76)

**Calls:**
- `some` (76)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (1.3ms) | Samples: 0

**Called by:**
- `(anonymous)` (2)

**Calls:**
- `anonymous` (2)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:463` | Self: 0.0% (0us) | Total: 0.0% (845us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `filter` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:306` | Self: 0.0% (0us) | Total: 0.0% (725us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `nextHalfOpenUnit` (1)

### `internal:streams/operators`
`internal:streams/operators:2` | Self: 0.0% (0us) | Total: 0.0% (632us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:promisify`
`internal:promisify:55` | Self: 0.0% (0us) | Total: 0.0% (912us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `defineCustomPromisify` (1)

### `vecNorm`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:56` | Self: 0.0% (0us) | Total: 0.0% (770us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `vecDot` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` | Self: 0.0% (0us) | Total: 0.0% (896us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `createZeroVector` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` | Self: 0.0% (0us) | Total: 0.0% (808us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `sqrt` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:303` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `step` (2)

**Calls:**
- `nextHalfOpenUnit` (2)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.3ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` | Self: 0.0% (0us) | Total: 0.0% (4.7ms) | Samples: 0

**Called by:**
- `(module)` (5)
- `(module)` (1)

**Calls:**
- `CMAESOptimizerND` (2)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (1.3ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` | Self: 0.0% (0us) | Total: 0.4% (44.5ms) | Samples: 0

**Called by:**
- `(module)` (49)
- `(module)` (8)

**Calls:**
- `step` (32)
- `step` (10)
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

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:132` | Self: 0.0% (0us) | Total: 0.0% (828us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `abs` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:302` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `step` (2)

**Calls:**
- `nextOpenUnit` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:688` | Self: 0.0% (0us) | Total: 0.0% (8.8ms) | Samples: 0

**Called by:**
- `runTrial` (12)

**Calls:**
- `projectTo3D` (10)
- `projectTo3D` (2)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:419` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `runTrial` (2)

**Calls:**
- `(anonymous)` (1)
- `(anonymous)` (1)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 92.8% | 9.20s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 6.8% | 683.0ms | `[native code]` |
| 0.2% | 28.7ms | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.0% | 912us | `internal:promisify` |
| 0.0% | 632us | `internal:streams/end-of-stream` |
