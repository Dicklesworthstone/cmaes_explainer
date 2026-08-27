# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 9.88s | 15323 | 500us | 165 |

**Top 10:** `jacobiEigenSymmetric` 21.6%, `jacobiEigenSymmetric` 20.6%, `step` 18.3%, `transformFromEigenCoordinates` 4.8%, `step` 3.6%, `whitenWithEigensystem` 3.2%, `reconstructSymmetric` 2.8%, `whitenWithEigensystem` 2.4%, `map` 2.1%, `step` 1.9%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 21.6% | 2.13s | 22.4% | 2.21s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` |
| 20.6% | 2.03s | 21.6% | 2.13s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:139` |
| 18.3% | 1.81s | 18.3% | 1.81s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:636` |
| 4.8% | 477.7ms | 4.9% | 492.1ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:247` |
| 3.6% | 357.7ms | 4.1% | 406.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:629` |
| 3.2% | 322.9ms | 3.3% | 328.0ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:269` |
| 2.8% | 277.9ms | 3.2% | 317.2ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:228` |
| 2.4% | 243.6ms | 2.5% | 248.6ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:262` |
| 2.1% | 209.2ms | 4.5% | 450.9ms | `map` | `[native code]` |
| 1.9% | 195.6ms | 1.9% | 195.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |
| 1.9% | 194.3ms | 1.9% | 194.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:649` |
| 1.8% | 179.7ms | 1.8% | 179.7ms | `hypot` | `[native code]` |
| 1.5% | 149.4ms | 2.1% | 217.1ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.3% | 136.9ms | 1.3% | 136.9ms | `fill` | `[native code]` |
| 1.2% | 122.8ms | 1.2% | 122.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.1% | 114.8ms | 1.1% | 114.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` |
| 0.8% | 87.7ms | 0.8% | 87.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` |
| 0.7% | 69.2ms | 0.7% | 69.2ms | `every` | `[native code]` |
| 0.6% | 67.6ms | 0.9% | 89.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` |
| 0.5% | 49.6ms | 0.5% | 49.6ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:542` |
| 0.4% | 42.8ms | 1.2% | 122.4ms | `from` | `[native code]` |
| 0.4% | 42.4ms | 1.3% | 137.2ms | `some` | `[native code]` |
| 0.4% | 41.0ms | 1.4% | 146.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 0.3% | 36.6ms | 0.3% | 36.6ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.3% | 36.4ms | 0.3% | 36.4ms | `Float64Array` | `[native code]` |
| 0.3% | 35.7ms | 0.3% | 35.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:589` |
| 0.3% | 35.5ms | 0.3% | 35.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` |
| 0.3% | 33.1ms | 0.4% | 43.5ms | `sort` | `[native code]` |
| 0.3% | 32.5ms | 0.6% | 66.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.2% | 29.1ms | 0.6% | 64.2ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.1% | 19.1ms | 0.1% | 19.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.1% | 18.2ms | 0.1% | 18.2ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:300` |
| 0.1% | 17.3ms | 0.1% | 17.3ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:20` |
| 0.1% | 12.8ms | 0.1% | 12.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:637` |
| 0.0% | 9.4ms | 0.0% | 9.4ms | `push` | `[native code]` |
| 0.0% | 8.6ms | 0.0% | 8.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:633` |
| 0.0% | 8.2ms | 0.0% | 8.2ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 7.7ms | 0.7% | 75.6ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:520` |
| 0.0% | 7.5ms | 0.0% | 7.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:181` |
| 0.0% | 6.4ms | 0.0% | 6.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.0% | 5.8ms | 0.0% | 5.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:678` |
| 0.0% | 5.7ms | 0.8% | 85.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` |
| 0.0% | 5.6ms | 0.0% | 6.9ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` |
| 0.0% | 5.2ms | 0.3% | 34.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:180` |
| 0.0% | 5.1ms | 0.7% | 69.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` |
| 0.0% | 4.7ms | 0.0% | 4.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:622` |
| 0.0% | 4.6ms | 0.2% | 20.6ms | `anonymous` | `[native code]` |
| 0.0% | 4.5ms | 0.0% | 4.5ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 0.0% | 4.0ms | 1.7% | 176.5ms | `forEach` | `[native code]` |
| 0.0% | 4.0ms | 0.0% | 7.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:704` |
| 0.0% | 3.9ms | 0.0% | 9.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 3.8ms | 0.1% | 13.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:621` |
| 0.0% | 3.8ms | 0.0% | 3.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:694` |
| 0.0% | 3.3ms | 2.4% | 246.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:557` |
| 0.0% | 3.2ms | 0.0% | 3.2ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.2ms | 0.0% | 3.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:682` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:602` |
| 0.0% | 2.7ms | 0.0% | 2.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` |
| 0.0% | 2.7ms | 0.0% | 3.7ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:521` |
| 0.0% | 2.5ms | 0.0% | 2.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:680` |
| 0.0% | 2.4ms | 0.2% | 20.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` |
| 0.0% | 2.4ms | 0.5% | 53.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 0.0% | 2.4ms | 5.0% | 501.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:558` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.2ms | 0.0% | 3.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:601` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:165` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:567` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:51` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:698` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `reduce` | `[native code]` |
| 0.0% | 1.8ms | 0.4% | 45.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:692` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:642` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:591` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `max` | `[native code]` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.3ms | 0.6% | 68.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:648` |
| 0.0% | 1.3ms | 0.0% | 7.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:527` |
| 0.0% | 1.3ms | 0.0% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:669` |
| 0.0% | 1.3ms | 3.2% | 319.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:653` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:522` |
| 0.0% | 1.2ms | 0.0% | 7.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:687` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:246` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:656` |
| 0.0% | 1.1ms | 0.1% | 11.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:663` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:583` |
| 0.0% | 765us | 0.0% | 765us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` |
| 0.0% | 758us | 0.0% | 758us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:463` |
| 0.0% | 755us | 0.4% | 39.7ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` |
| 0.0% | 747us | 1.2% | 123.5ms | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` |
| 0.0% | 744us | 0.0% | 744us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` |
| 0.0% | 731us | 0.0% | 731us | `@lazy` | `[native code]` |
| 0.0% | 712us | 0.0% | 2.0ms | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:424` |
| 0.0% | 694us | 0.0% | 694us | `abs` | `[native code]` |
| 0.0% | 684us | 0.0% | 684us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 681us | 0.0% | 1.4ms | `filter` | `[native code]` |
| 0.0% | 671us | 0.0% | 671us | `write` | `[native code]` |
| 0.0% | 668us | 0.0% | 4.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.0% | 655us | 0.0% | 655us | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:271` |
| 0.0% | 655us | 0.0% | 655us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:553` |
| 0.0% | 641us | 0.0% | 641us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` |
| 0.0% | 638us | 0.0% | 638us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` |
| 0.0% | 637us | 0.0% | 637us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:88` |
| 0.0% | 630us | 0.0% | 630us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` |
| 0.0% | 613us | 0.2% | 24.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` |
| 0.0% | 598us | 0.0% | 598us | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:266` |
| 0.0% | 588us | 0.0% | 588us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` |
| 0.0% | 580us | 0.0% | 580us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:552` |
| 0.0% | 568us | 0.0% | 568us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:492` |
| 0.0% | 560us | 0.0% | 2.4ms | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:419` |
| 0.0% | 556us | 0.7% | 69.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:106` |
| 0.0% | 555us | 0.6% | 60.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` |
| 0.0% | 543us | 0.0% | 543us | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:232` |
| 0.0% | 539us | 0.0% | 539us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:423` |
| 0.0% | 539us | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:603` |
| 0.0% | 537us | 0.0% | 537us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:630` |
| 0.0% | 530us | 0.0% | 530us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:381` |
| 0.0% | 519us | 0.7% | 77.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:596` |
| 0.0% | 518us | 47.0% | 4.64s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:652` |
| 0.0% | 509us | 0.0% | 509us | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 99.4% | 9.82s | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 93.2% | 9.21s | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` |
| 47.0% | 4.64s | 0.0% | 518us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:652` |
| 22.4% | 2.21s | 21.6% | 2.13s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` |
| 21.6% | 2.13s | 20.6% | 2.03s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:139` |
| 18.3% | 1.81s | 18.3% | 1.81s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:636` |
| 6.6% | 656.9ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` |
| 5.0% | 503.9ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` |
| 5.0% | 501.7ms | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:558` |
| 4.9% | 492.1ms | 4.8% | 477.7ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:247` |
| 4.5% | 450.9ms | 2.1% | 209.2ms | `map` | `[native code]` |
| 4.1% | 406.0ms | 3.6% | 357.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:629` |
| 3.3% | 328.0ms | 3.2% | 322.9ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:269` |
| 3.2% | 319.6ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:653` |
| 3.2% | 317.2ms | 2.8% | 277.9ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:228` |
| 2.5% | 248.6ms | 2.4% | 243.6ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:262` |
| 2.4% | 246.4ms | 0.0% | 3.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:557` |
| 2.1% | 217.1ms | 1.5% | 149.4ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.9% | 195.6ms | 1.9% | 195.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |
| 1.9% | 194.3ms | 1.9% | 194.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:649` |
| 1.8% | 179.7ms | 1.8% | 179.7ms | `hypot` | `[native code]` |
| 1.7% | 176.5ms | 0.0% | 4.0ms | `forEach` | `[native code]` |
| 1.7% | 171.3ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:664` |
| 1.4% | 146.3ms | 0.4% | 41.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 1.4% | 141.3ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` |
| 1.3% | 137.2ms | 0.4% | 42.4ms | `some` | `[native code]` |
| 1.3% | 136.9ms | 1.3% | 136.9ms | `fill` | `[native code]` |
| 1.2% | 123.5ms | 0.0% | 747us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` |
| 1.2% | 122.8ms | 1.2% | 122.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.2% | 122.4ms | 0.4% | 42.8ms | `from` | `[native code]` |
| 1.1% | 114.8ms | 1.1% | 114.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` |
| 0.9% | 89.2ms | 0.6% | 67.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` |
| 0.8% | 87.7ms | 0.8% | 87.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` |
| 0.8% | 85.2ms | 0.0% | 5.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` |
| 0.7% | 77.8ms | 0.0% | 519us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:596` |
| 0.7% | 75.6ms | 0.0% | 7.7ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:520` |
| 0.7% | 69.4ms | 0.0% | 5.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` |
| 0.7% | 69.3ms | 0.0% | 556us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:106` |
| 0.7% | 69.2ms | 0.7% | 69.2ms | `every` | `[native code]` |
| 0.7% | 69.2ms | 0.0% | 0us | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:369` |
| 0.6% | 68.7ms | 0.0% | 0us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 0.6% | 68.0ms | 0.0% | 1.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 0.6% | 66.7ms | 0.3% | 32.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.6% | 64.2ms | 0.2% | 29.1ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.6% | 60.0ms | 0.0% | 555us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` |
| 0.5% | 55.6ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` |
| 0.5% | 53.2ms | 0.0% | 2.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` |
| 0.5% | 49.6ms | 0.5% | 49.6ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:542` |
| 0.4% | 46.7ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:534` |
| 0.4% | 45.3ms | 0.0% | 1.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:692` |
| 0.4% | 43.5ms | 0.3% | 33.1ms | `sort` | `[native code]` |
| 0.4% | 42.8ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:546` |
| 0.4% | 39.9ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` |
| 0.4% | 39.7ms | 0.0% | 755us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` |
| 0.3% | 36.6ms | 0.3% | 36.6ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.3% | 36.4ms | 0.3% | 36.4ms | `Float64Array` | `[native code]` |
| 0.3% | 35.7ms | 0.3% | 35.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:589` |
| 0.3% | 35.5ms | 0.3% | 35.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` |
| 0.3% | 34.1ms | 0.0% | 5.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:180` |
| 0.2% | 24.9ms | 0.0% | 613us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` |
| 0.2% | 20.8ms | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` |
| 0.2% | 20.6ms | 0.0% | 4.6ms | `anonymous` | `[native code]` |
| 0.1% | 19.1ms | 0.1% | 19.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.1% | 18.2ms | 0.1% | 18.2ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:300` |
| 0.1% | 17.3ms | 0.1% | 17.3ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:20` |
| 0.1% | 14.8ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 0.1% | 13.3ms | 0.0% | 3.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:621` |
| 0.1% | 12.8ms | 0.1% | 12.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:637` |
| 0.1% | 11.3ms | 0.0% | 1.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:663` |
| 0.1% | 10.8ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:683` |
| 0.0% | 9.8ms | 0.0% | 3.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 9.4ms | 0.0% | 9.4ms | `push` | `[native code]` |
| 0.0% | 8.6ms | 0.0% | 8.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:633` |
| 0.0% | 8.2ms | 0.0% | 8.2ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 8.2ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:684` |
| 0.0% | 7.9ms | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:687` |
| 0.0% | 7.8ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` |
| 0.0% | 7.5ms | 0.0% | 7.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:181` |
| 0.0% | 7.1ms | 0.0% | 4.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:704` |
| 0.0% | 7.0ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` |
| 0.0% | 6.9ms | 0.0% | 5.6ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` |
| 0.0% | 6.5ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` |
| 0.0% | 6.4ms | 0.0% | 6.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.0% | 6.0ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.0% | 5.8ms | 0.0% | 5.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:678` |
| 0.0% | 5.3ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.0% | 5.1ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:578` |
| 0.0% | 4.7ms | 0.0% | 4.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:622` |
| 0.0% | 4.5ms | 0.0% | 4.5ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 0.0% | 4.4ms | 0.0% | 668us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.0% | 4.3ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` |
| 0.0% | 3.8ms | 0.0% | 3.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:694` |
| 0.0% | 3.7ms | 0.0% | 2.7ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:521` |
| 0.0% | 3.3ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` |
| 0.0% | 3.2ms | 0.0% | 3.2ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.2ms | 0.0% | 3.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:682` |
| 0.0% | 3.1ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:669` |
| 0.0% | 3.0ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:601` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:602` |
| 0.0% | 2.7ms | 0.0% | 2.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` |
| 0.0% | 2.7ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 2.5ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 2.5ms | 0.0% | 2.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:680` |
| 0.0% | 2.4ms | 0.0% | 560us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:419` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.1ms | 0.0% | 2.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:165` |
| 0.0% | 2.1ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 2.1ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 2.1ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 2.1ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 2.0ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 2.0ms | 0.0% | 712us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:424` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:567` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:51` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:698` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `reduce` | `[native code]` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:642` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:591` |
| 0.0% | 1.4ms | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:463` |
| 0.0% | 1.4ms | 0.0% | 681us | `filter` | `[native code]` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `max` | `[native code]` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.3ms | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:302` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:648` |
| 0.0% | 1.3ms | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 1.3ms | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:527` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:522` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:246` |
| 0.0% | 1.2ms | 0.0% | 539us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:603` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:656` |
| 0.0% | 1.1ms | 0.0% | 1.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:583` |
| 0.0% | 765us | 0.0% | 765us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` |
| 0.0% | 762us | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 758us | 0.0% | 758us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:463` |
| 0.0% | 754us | 0.0% | 0us | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:56` |
| 0.0% | 744us | 0.0% | 744us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` |
| 0.0% | 731us | 0.0% | 0us | `internal:fs/binding` | `internal:fs/binding:3` |
| 0.0% | 731us | 0.0% | 731us | `@lazy` | `[native code]` |
| 0.0% | 694us | 0.0% | 694us | `abs` | `[native code]` |
| 0.0% | 684us | 0.0% | 684us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 671us | 0.0% | 0us | `writeFast` | `internal:fs/streams:359` |
| 0.0% | 671us | 0.0% | 671us | `write` | `[native code]` |
| 0.0% | 655us | 0.0% | 655us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:553` |
| 0.0% | 655us | 0.0% | 655us | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:271` |
| 0.0% | 654us | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 641us | 0.0% | 641us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` |
| 0.0% | 638us | 0.0% | 638us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` |
| 0.0% | 637us | 0.0% | 637us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:88` |
| 0.0% | 630us | 0.0% | 630us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` |
| 0.0% | 598us | 0.0% | 598us | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:266` |
| 0.0% | 588us | 0.0% | 588us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` |
| 0.0% | 580us | 0.0% | 580us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:552` |
| 0.0% | 568us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:491` |
| 0.0% | 568us | 0.0% | 568us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:492` |
| 0.0% | 543us | 0.0% | 543us | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:232` |
| 0.0% | 539us | 0.0% | 539us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:423` |
| 0.0% | 537us | 0.0% | 537us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:630` |
| 0.0% | 530us | 0.0% | 530us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:381` |
| 0.0% | 509us | 0.0% | 509us | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |

## Function Details

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` | Self: 21.6% (2.13s) | Total: 22.4% (2.21s) | Samples: 3304

**Called by:**
- `step` (3429)

**Calls:**
- `hypot` (125)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:139` | Self: 20.6% (2.03s) | Total: 21.6% (2.13s) | Samples: 3172

**Called by:**
- `step` (3327)

**Calls:**
- `hypot` (155)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:636` | Self: 18.3% (1.81s) | Total: 18.3% (1.81s) | Samples: 2786

**Called by:**
- `runTrial` (2777)
- `runTrial` (9)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:247` | Self: 4.8% (477.7ms) | Total: 4.9% (492.1ms) | Samples: 752

**Called by:**
- `step` (774)

**Calls:**
- `createZeroVector` (12)
- `fill` (10)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:629` | Self: 3.6% (357.7ms) | Total: 4.1% (406.0ms) | Samples: 563

**Called by:**
- `runTrial` (637)
- `runTrial` (3)

**Calls:**
- `createZeroMatrix` (63)
- `from` (10)
- `createZeroMatrix` (4)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:269` | Self: 3.2% (322.9ms) | Total: 3.3% (328.0ms) | Samples: 507

**Called by:**
- `step` (445)
- `step` (70)

**Calls:**
- `createZeroVector` (7)
- `fill` (1)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:228` | Self: 2.8% (277.9ms) | Total: 3.2% (317.2ms) | Samples: 429

**Called by:**
- `step` (491)

**Calls:**
- `from` (62)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:262` | Self: 2.4% (243.6ms) | Total: 2.5% (248.6ms) | Samples: 378

**Called by:**
- `step` (335)
- `step` (51)

**Calls:**
- `createZeroVector` (5)
- `fill` (3)

### `map`
`[native code]` | Self: 2.1% (209.2ms) | Total: 4.5% (450.9ms) | Samples: 325

**Called by:**
- `cloneMatrix` (189)
- `step` (123)
- `step` (92)
- `step` (87)
- `(anonymous)` (79)
- `(anonymous)` (36)
- `step` (17)
- `step` (12)
- `step` (11)
- `step` (10)
- `step` (10)
- `jacobiEigenSymmetric` (8)
- `step` (7)
- `jacobiEigenSymmetric` (6)
- `map` (4)
- `jacobiEigenSymmetric` (4)
- `alignProjectionBasis` (1)
- `alignProjectionBasis` (1)
- `CMAESOptimizerND` (1)

**Calls:**
- `(anonymous)` (150)
- `(anonymous)` (132)
- `(anonymous)` (83)
- `map` (4)
- `abs` (1)
- `(anonymous)` (1)
- `(anonymous)` (1)
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` | Self: 1.9% (195.6ms) | Total: 1.9% (195.6ms) | Samples: 307

**Called by:**
- `runTrial` (305)
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:649` | Self: 1.9% (194.3ms) | Total: 1.9% (194.3ms) | Samples: 306

**Called by:**
- `runTrial` (306)

### `hypot`
`[native code]` | Self: 1.8% (179.7ms) | Total: 1.8% (179.7ms) | Samples: 280

**Called by:**
- `jacobiEigenSymmetric` (155)
- `jacobiEigenSymmetric` (125)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.5% (149.4ms) | Total: 2.1% (217.1ms) | Samples: 216

**Called by:**
- `step` (321)

**Calls:**
- `fill` (105)

### `fill`
`[native code]` | Self: 1.3% (136.9ms) | Total: 1.3% (136.9ms) | Samples: 214

**Called by:**
- `sampleGaussianVectorND` (105)
- `ellipsoidObjective` (55)
- `from` (40)
- `transformFromEigenCoordinates` (10)
- `whitenWithEigensystem` (3)
- `whitenWithEigensystem` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.2% (122.8ms) | Total: 1.2% (122.8ms) | Samples: 193

**Called by:**
- `map` (150)
- `some` (41)
- `CMAESOptimizerND` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` | Self: 1.1% (114.8ms) | Total: 1.1% (114.8ms) | Samples: 180

**Called by:**
- `runTrial` (179)
- `runTrial` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` | Self: 0.8% (87.7ms) | Total: 0.8% (87.7ms) | Samples: 132

**Called by:**
- `map` (132)

### `every`
`[native code]` | Self: 0.7% (69.2ms) | Total: 0.7% (69.2ms) | Samples: 109

**Called by:**
- `requireFiniteVector` (109)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` | Self: 0.6% (67.6ms) | Total: 0.9% (89.2ms) | Samples: 104

**Called by:**
- `step` (138)

**Calls:**
- `Float64Array` (34)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:542` | Self: 0.5% (49.6ms) | Total: 0.5% (49.6ms) | Samples: 77

**Called by:**
- `step` (77)

### `from`
`[native code]` | Self: 0.4% (42.8ms) | Total: 1.2% (122.4ms) | Samples: 69

**Called by:**
- `reconstructSymmetric` (62)
- `createZeroMatrix` (62)
- `jacobiEigenSymmetric` (54)
- `step` (10)
- `jacobiEigenSymmetric` (6)

**Calls:**
- `(anonymous)` (55)
- `fill` (40)
- `(anonymous)` (30)

### `some`
`[native code]` | Self: 0.4% (42.4ms) | Total: 1.3% (137.2ms) | Samples: 67

**Called by:**
- `validateSquareFiniteMatrix` (108)
- `(anonymous)` (105)
- `projectTo3D` (2)
- `some` (1)

**Calls:**
- `(anonymous)` (107)
- `(anonymous)` (41)
- `some` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` | Self: 0.4% (41.0ms) | Total: 1.4% (146.3ms) | Samples: 59

**Called by:**
- `forEach` (224)

**Calls:**
- `projectTo3D` (118)
- `projectTo3D` (29)
- `projectTo3D` (10)
- `projectTo3D` (6)
- `projectTo3D` (2)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.3% (36.6ms) | Total: 0.3% (36.6ms) | Samples: 56

**Called by:**
- `(anonymous)` (29)
- `step` (15)
- `step` (12)

### `Float64Array`
`[native code]` | Self: 0.3% (36.4ms) | Total: 0.3% (36.4ms) | Samples: 57

**Called by:**
- `jacobiEigenSymmetric` (34)
- `jacobiEigenSymmetric` (23)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:589` | Self: 0.3% (35.7ms) | Total: 0.3% (35.7ms) | Samples: 57

**Called by:**
- `runTrial` (56)
- `runTrial` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` | Self: 0.3% (35.5ms) | Total: 0.3% (35.5ms) | Samples: 55

**Called by:**
- `from` (55)

### `sort`
`[native code]` | Self: 0.3% (33.1ms) | Total: 0.4% (43.5ms) | Samples: 54

**Called by:**
- `jacobiEigenSymmetric` (41)
- `step` (29)

**Calls:**
- `(anonymous)` (12)
- `(anonymous)` (4)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.3% (32.5ms) | Total: 0.6% (66.7ms) | Samples: 51

**Called by:**
- `step` (105)

**Calls:**
- `from` (54)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` | Self: 0.2% (29.1ms) | Total: 0.6% (64.2ms) | Samples: 46

**Called by:**
- `step` (101)

**Calls:**
- `fill` (55)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.1% (19.1ms) | Total: 0.1% (19.1ms) | Samples: 30

**Called by:**
- `from` (30)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:300` | Self: 0.1% (18.2ms) | Total: 0.1% (18.2ms) | Samples: 29

**Called by:**
- `step` (29)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:20` | Self: 0.1% (17.3ms) | Total: 0.1% (17.3ms) | Samples: 27

**Called by:**
- `transformFromEigenCoordinates` (12)
- `whitenWithEigensystem` (7)
- `whitenWithEigensystem` (5)
- `step` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:637` | Self: 0.1% (12.8ms) | Total: 0.1% (12.8ms) | Samples: 18

**Called by:**
- `runTrial` (18)

### `push`
`[native code]` | Self: 0.0% (9.4ms) | Total: 0.0% (9.4ms) | Samples: 15

**Called by:**
- `step` (10)
- `step` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:633` | Self: 0.0% (8.6ms) | Total: 0.0% (8.6ms) | Samples: 14

**Called by:**
- `runTrial` (14)

### `vecDot`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (8.2ms) | Total: 0.0% (8.2ms) | Samples: 13

**Called by:**
- `step` (13)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:520` | Self: 0.0% (7.7ms) | Total: 0.7% (75.6ms) | Samples: 12

**Called by:**
- `(anonymous)` (118)
- `step` (2)

**Calls:**
- `requireFiniteVector` (108)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:181` | Self: 0.0% (7.5ms) | Total: 0.0% (7.5ms) | Samples: 12

**Called by:**
- `sort` (12)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` | Self: 0.0% (6.4ms) | Total: 0.0% (6.4ms) | Samples: 10

**Called by:**
- `runTrial` (10)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:678` | Self: 0.0% (5.8ms) | Total: 0.0% (5.8ms) | Samples: 9

**Called by:**
- `runTrial` (9)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` | Self: 0.0% (5.7ms) | Total: 0.8% (85.2ms) | Samples: 9

**Called by:**
- `runTrial` (131)
- `runTrial` (1)

**Calls:**
- `map` (123)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` | Self: 0.0% (5.6ms) | Total: 0.0% (6.9ms) | Samples: 9

**Called by:**
- `(anonymous)` (10)
- `step` (1)

**Calls:**
- `coordinate` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:180` | Self: 0.0% (5.2ms) | Total: 0.3% (34.1ms) | Samples: 8

**Called by:**
- `step` (55)

**Calls:**
- `sort` (41)
- `from` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` | Self: 0.0% (5.1ms) | Total: 0.7% (69.4ms) | Samples: 8

**Called by:**
- `runTrial` (108)
- `runTrial` (1)

**Calls:**
- `ellipsoidObjective` (101)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:622` | Self: 0.0% (4.7ms) | Total: 0.0% (4.7ms) | Samples: 7

**Called by:**
- `runTrial` (7)

### `anonymous`
`[native code]` | Self: 0.0% (4.6ms) | Total: 0.2% (20.6ms) | Samples: 7

**Called by:**
- `(anonymous)` (5)
- `node:fs` (4)
- `internal:fs/streams` (3)
- `node:fs/promises` (3)
- `get WriteStream` (3)
- `node:stream` (3)
- `internal:stream` (3)
- `internal:streams/compose` (2)
- `internal:streams/pipeline` (2)
- `node:events` (1)
- `internal:streams/duplex` (1)

**Calls:**
- `node:fs` (4)
- `internal:fs/streams` (3)
- `node:fs/promises` (3)
- `node:stream` (3)
- `internal:stream` (3)
- `internal:streams/compose` (2)
- `internal:streams/pipeline` (2)
- `node:events` (1)
- `internal:streams/duplex` (1)
- `internal:fs/binding` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` | Self: 0.0% (4.5ms) | Total: 0.0% (4.5ms) | Samples: 7

**Called by:**
- `step` (7)

### `forEach`
`[native code]` | Self: 0.0% (4.0ms) | Total: 1.7% (176.5ms) | Samples: 6

**Called by:**
- `step` (261)
- `step` (8)

**Calls:**
- `(anonymous)` (224)
- `(anonymous)` (37)
- `(anonymous)` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:704` | Self: 0.0% (4.0ms) | Total: 0.0% (7.1ms) | Samples: 2

**Called by:**
- `runTrial` (7)

**Calls:**
- `push` (5)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` | Self: 0.0% (3.9ms) | Total: 0.0% (9.8ms) | Samples: 6

**Called by:**
- `step` (15)

**Calls:**
- `map` (8)
- `max` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:621` | Self: 0.0% (3.8ms) | Total: 0.1% (13.3ms) | Samples: 6

**Called by:**
- `runTrial` (21)

**Calls:**
- `vecDot` (13)
- `vecDot` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:694` | Self: 0.0% (3.8ms) | Total: 0.0% (3.8ms) | Samples: 6

**Called by:**
- `runTrial` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:557` | Self: 0.0% (3.3ms) | Total: 2.4% (246.4ms) | Samples: 5

**Called by:**
- `runTrial` (365)
- `runTrial` (2)

**Calls:**
- `sampleGaussianVectorND` (321)
- `sampleGaussianVectorND` (29)
- `push` (10)
- `sampleGaussianVectorND` (2)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (3.2ms) | Total: 0.0% (3.2ms) | Samples: 5

**Called by:**
- `step` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:682` | Self: 0.0% (3.2ms) | Total: 0.0% (3.2ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:602` | Self: 0.0% (2.8ms) | Total: 0.0% (2.8ms) | Samples: 1

**Called by:**
- `runTrial` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` | Self: 0.0% (2.7ms) | Total: 0.0% (2.7ms) | Samples: 4

**Called by:**
- `sort` (4)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:521` | Self: 0.0% (2.7ms) | Total: 0.0% (3.7ms) | Samples: 4

**Called by:**
- `(anonymous)` (6)

**Calls:**
- `some` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:680` | Self: 0.0% (2.5ms) | Total: 0.0% (2.5ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:577` | Self: 0.0% (2.4ms) | Total: 0.2% (20.8ms) | Samples: 4

**Called by:**
- `runTrial` (32)
- `runTrial` (1)

**Calls:**
- `sort` (29)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:611` | Self: 0.0% (2.4ms) | Total: 0.5% (53.2ms) | Samples: 4

**Called by:**
- `map` (83)

**Calls:**
- `map` (79)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:558` | Self: 0.0% (2.4ms) | Total: 5.0% (501.7ms) | Samples: 4

**Called by:**
- `runTrial` (785)
- `runTrial` (4)

**Calls:**
- `transformFromEigenCoordinates` (774)
- `transformFromEigenCoordinates` (7)
- `transformFromEigenCoordinates` (2)
- `transformFromEigenCoordinates` (1)
- `transformFromEigenCoordinates` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` | Self: 0.0% (2.4ms) | Total: 0.0% (2.4ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 4

**Called by:**
- `step` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:601` | Self: 0.0% (2.2ms) | Total: 0.0% (3.0ms) | Samples: 4

**Called by:**
- `runTrial` (5)

**Calls:**
- `vecNorm` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (2.1ms) | Total: 0.0% (2.1ms) | Samples: 3

**Called by:**
- `step` (3)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:165` | Self: 0.0% (2.1ms) | Total: 0.0% (2.1ms) | Samples: 3

**Called by:**
- `step` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` | Self: 0.0% (1.9ms) | Total: 0.0% (1.9ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:567` | Self: 0.0% (1.9ms) | Total: 0.0% (1.9ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `vecDot`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:51` | Self: 0.0% (1.9ms) | Total: 0.0% (1.9ms) | Samples: 3

**Called by:**
- `step` (2)
- `vecNorm` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:698` | Self: 0.0% (1.8ms) | Total: 0.0% (1.8ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `reduce`
`[native code]` | Self: 0.0% (1.8ms) | Total: 0.0% (1.8ms) | Samples: 3

**Called by:**
- `step` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:692` | Self: 0.0% (1.8ms) | Total: 0.4% (45.3ms) | Samples: 3

**Called by:**
- `runTrial` (70)

**Calls:**
- `cloneMatrix` (55)
- `map` (12)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:642` | Self: 0.0% (1.7ms) | Total: 0.0% (1.7ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:693` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:591` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `max`
`[native code]` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `jacobiEigenSymmetric` (1)
- `step` (1)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `step` (2)

### `nextOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `sampleGaussianVectorND` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` | Self: 0.0% (1.3ms) | Total: 0.6% (68.0ms) | Samples: 2

**Called by:**
- `some` (107)

**Calls:**
- `some` (105)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:648` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:595` | Self: 0.0% (1.3ms) | Total: 0.0% (7.8ms) | Samples: 2

**Called by:**
- `runTrial` (13)

**Calls:**
- `map` (11)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:527` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `projectTo3D` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:669` | Self: 0.0% (1.3ms) | Total: 0.0% (3.1ms) | Samples: 2

**Called by:**
- `runTrial` (5)

**Calls:**
- `reduce` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:653` | Self: 0.0% (1.3ms) | Total: 3.2% (319.6ms) | Samples: 2

**Called by:**
- `runTrial` (494)
- `runTrial` (1)

**Calls:**
- `reconstructSymmetric` (491)
- `reconstructSymmetric` (1)
- `reconstructSymmetric` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:522` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `(anonymous)` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:687` | Self: 0.0% (1.2ms) | Total: 0.0% (7.9ms) | Samples: 2

**Called by:**
- `runTrial` (12)

**Calls:**
- `map` (10)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:246` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:656` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:663` | Self: 0.0% (1.1ms) | Total: 0.1% (11.3ms) | Samples: 2

**Called by:**
- `runTrial` (19)

**Calls:**
- `map` (17)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:583` | Self: 0.0% (1.1ms) | Total: 0.0% (1.1ms) | Samples: 2

**Called by:**
- `forEach` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` | Self: 0.0% (765us) | Total: 0.0% (765us) | Samples: 1

**Called by:**
- `map` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:463` | Self: 0.0% (758us) | Total: 0.0% (758us) | Samples: 1

**Called by:**
- `filter` (1)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:25` | Self: 0.0% (755us) | Total: 0.4% (39.7ms) | Samples: 1

**Called by:**
- `step` (63)

**Calls:**
- `from` (62)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:39` | Self: 0.0% (747us) | Total: 1.2% (123.5ms) | Samples: 1

**Called by:**
- `alignProjectionBasis` (70)
- `alignProjectionBasis` (65)
- `step` (55)

**Calls:**
- `map` (189)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` | Self: 0.0% (744us) | Total: 0.0% (744us) | Samples: 1

**Called by:**
- `step` (1)

### `@lazy`
`[native code]` | Self: 0.0% (731us) | Total: 0.0% (731us) | Samples: 1

**Called by:**
- `internal:fs/binding` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:424` | Self: 0.0% (712us) | Total: 0.0% (2.0ms) | Samples: 1

**Called by:**
- `runTrial` (2)

**Calls:**
- `requireFiniteVector` (1)

### `abs`
`[native code]` | Self: 0.0% (694us) | Total: 0.0% (694us) | Samples: 1

**Called by:**
- `map` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (684us) | Total: 0.0% (684us) | Samples: 1

**Called by:**
- `step` (1)

### `filter`
`[native code]` | Self: 0.0% (681us) | Total: 0.0% (1.4ms) | Samples: 1

**Called by:**
- `CMAESOptimizerND` (2)

**Calls:**
- `(anonymous)` (1)

### `write`
`[native code]` | Self: 0.0% (671us) | Total: 0.0% (671us) | Samples: 1

**Called by:**
- `writeFast` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` | Self: 0.0% (668us) | Total: 0.0% (4.4ms) | Samples: 1

**Called by:**
- `step` (7)

**Calls:**
- `map` (6)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:271` | Self: 0.0% (655us) | Total: 0.0% (655us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:553` | Self: 0.0% (655us) | Total: 0.0% (655us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:556` | Self: 0.0% (641us) | Total: 0.0% (641us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:703` | Self: 0.0% (638us) | Total: 0.0% (638us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:88` | Self: 0.0% (637us) | Total: 0.0% (637us) | Samples: 1

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` | Self: 0.0% (630us) | Total: 0.0% (630us) | Samples: 1

**Called by:**
- `map` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` | Self: 0.0% (613us) | Total: 0.2% (24.9ms) | Samples: 1

**Called by:**
- `forEach` (37)

**Calls:**
- `map` (36)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:266` | Self: 0.0% (598us) | Total: 0.0% (598us) | Samples: 1

**Called by:**
- `step` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` | Self: 0.0% (588us) | Total: 0.0% (588us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:552` | Self: 0.0% (580us) | Total: 0.0% (580us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:492` | Self: 0.0% (568us) | Total: 0.0% (568us) | Samples: 1

**Called by:**
- `map` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:419` | Self: 0.0% (560us) | Total: 0.0% (2.4ms) | Samples: 1

**Called by:**
- `runTrial` (4)

**Calls:**
- `(anonymous)` (2)
- `(anonymous)` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:106` | Self: 0.0% (556us) | Total: 0.7% (69.3ms) | Samples: 1

**Called by:**
- `step` (109)

**Calls:**
- `validateSquareFiniteMatrix` (108)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` | Self: 0.0% (555us) | Total: 0.6% (60.0ms) | Samples: 1

**Called by:**
- `runTrial` (93)

**Calls:**
- `map` (92)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:232` | Self: 0.0% (543us) | Total: 0.0% (543us) | Samples: 1

**Called by:**
- `step` (1)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:423` | Self: 0.0% (539us) | Total: 0.0% (539us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:603` | Self: 0.0% (539us) | Total: 0.0% (1.2ms) | Samples: 1

**Called by:**
- `runTrial` (2)

**Calls:**
- `max` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:630` | Self: 0.0% (537us) | Total: 0.0% (537us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:381` | Self: 0.0% (530us) | Total: 0.0% (530us) | Samples: 1

**Called by:**
- `CMAESOptimizerND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:596` | Self: 0.0% (519us) | Total: 0.7% (77.8ms) | Samples: 1

**Called by:**
- `runTrial` (121)
- `runTrial` (1)

**Calls:**
- `whitenWithEigensystem` (70)
- `whitenWithEigensystem` (51)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:652` | Self: 0.0% (518us) | Total: 47.0% (4.64s) | Samples: 1

**Called by:**
- `runTrial` (7186)
- `runTrial` (31)

**Calls:**
- `jacobiEigenSymmetric` (3429)
- `jacobiEigenSymmetric` (3327)
- `jacobiEigenSymmetric` (138)
- `jacobiEigenSymmetric` (109)
- `jacobiEigenSymmetric` (105)
- `jacobiEigenSymmetric` (55)
- `jacobiEigenSymmetric` (23)
- `jacobiEigenSymmetric` (15)
- `jacobiEigenSymmetric` (7)
- `jacobiEigenSymmetric` (4)
- `jacobiEigenSymmetric` (3)
- `jacobiEigenSymmetric` (1)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (509us) | Total: 0.0% (509us) | Samples: 1

**Called by:**
- `step` (1)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (2.1ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:684` | Self: 0.0% (0us) | Total: 0.0% (8.2ms) | Samples: 0

**Called by:**
- `runTrial` (13)

**Calls:**
- `projectTo3D` (12)
- `projectTo3D` (1)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (2.1ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` | Self: 0.0% (0us) | Total: 0.1% (14.8ms) | Samples: 0

**Called by:**
- `step` (23)

**Calls:**
- `Float64Array` (23)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:302` | Self: 0.0% (0us) | Total: 0.0% (1.3ms) | Samples: 0

**Called by:**
- `step` (2)

**Calls:**
- `nextOpenUnit` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:606` | Self: 0.0% (0us) | Total: 0.0% (4.3ms) | Samples: 0

**Called by:**
- `runTrial` (7)

**Calls:**
- `map` (7)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (2.7ms) | Samples: 0

**Called by:**
- `anonymous` (4)

**Calls:**
- `anonymous` (4)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` | Self: 0.0% (0us) | Total: 0.0% (7.0ms) | Samples: 0

**Called by:**
- `(module)` (7)
- `(module)` (3)

**Calls:**
- `CMAESOptimizerND` (4)
- `CMAESOptimizerND` (2)
- `CMAESOptimizerND` (2)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (2.1ms) | Samples: 0

**Called by:**
- `(anonymous)` (3)

**Calls:**
- `anonymous` (3)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (2.0ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` | Self: 0.0% (0us) | Total: 0.0% (6.5ms) | Samples: 0

**Called by:**
- `runTrial` (10)

**Calls:**
- `map` (10)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:683` | Self: 0.0% (0us) | Total: 0.1% (10.8ms) | Samples: 0

**Called by:**
- `runTrial` (17)

**Calls:**
- `projectTo3D` (15)
- `projectTo3D` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` | Self: 0.0% (0us) | Total: 0.0% (2.5ms) | Samples: 0

**Called by:**
- `step` (4)

**Calls:**
- `map` (4)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` | Self: 0.0% (0us) | Total: 6.6% (656.9ms) | Samples: 0

**Calls:**
- `runTrial` (1012)
- `runTrial` (7)
- `runTrial` (3)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:546` | Self: 0.0% (0us) | Total: 0.4% (42.8ms) | Samples: 0

**Called by:**
- `step` (66)

**Calls:**
- `cloneMatrix` (65)
- `map` (1)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (762us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` | Self: 0.0% (0us) | Total: 93.2% (9.21s) | Samples: 0

**Calls:**
- `runTrial` (14229)
- `runTrial` (55)
- `runTrial` (7)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:491` | Self: 0.0% (0us) | Total: 0.0% (568us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `map` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` | Self: 0.0% (0us) | Total: 0.5% (55.6ms) | Samples: 0

**Called by:**
- `runTrial` (87)

**Calls:**
- `map` (87)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (2.1ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `internal:fs/binding`
`internal:fs/binding:3` | Self: 0.0% (0us) | Total: 0.0% (731us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `@lazy` (1)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (1.3ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:587` | Self: 0.0% (0us) | Total: 0.0% (3.3ms) | Samples: 0

**Called by:**
- `runTrial` (5)

**Calls:**
- `createZeroVector` (3)
- `createZeroVector` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:662` | Self: 0.0% (0us) | Total: 1.4% (141.3ms) | Samples: 0

**Called by:**
- `runTrial` (217)

**Calls:**
- `alignProjectionBasis` (77)
- `alignProjectionBasis` (71)
- `alignProjectionBasis` (66)
- `alignProjectionBasis` (3)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (654us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` | Self: 0.0% (0us) | Total: 0.0% (6.0ms) | Samples: 0

**Calls:**
- `(anonymous)` (8)
- `writeFast` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:664` | Self: 0.0% (0us) | Total: 1.7% (171.3ms) | Samples: 0

**Called by:**
- `runTrial` (261)

**Calls:**
- `forEach` (261)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (5.3ms) | Samples: 0

**Called by:**
- `(module)` (8)

**Calls:**
- `anonymous` (5)
- `get WriteStream` (3)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (1.3ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `requireFiniteVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:369` | Self: 0.0% (0us) | Total: 0.7% (69.2ms) | Samples: 0

**Called by:**
- `projectTo3D` (108)
- `CMAESOptimizerND` (1)

**Calls:**
- `every` (109)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` | Self: 0.0% (0us) | Total: 5.0% (503.9ms) | Samples: 0

**Called by:**
- `runTrial` (783)
- `runTrial` (4)

**Calls:**
- `whitenWithEigensystem` (445)
- `whitenWithEigensystem` (335)
- `whitenWithEigensystem` (5)
- `whitenWithEigensystem` (1)
- `whitenWithEigensystem` (1)

### `writeFast`
`internal:fs/streams:359` | Self: 0.0% (0us) | Total: 0.0% (671us) | Samples: 0

**Called by:**
- `(module)` (1)

**Calls:**
- `write` (1)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` | Self: 0.0% (0us) | Total: 0.6% (68.7ms) | Samples: 0

**Called by:**
- `jacobiEigenSymmetric` (108)

**Calls:**
- `some` (108)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` | Self: 0.0% (0us) | Total: 0.4% (39.9ms) | Samples: 0

**Called by:**
- `(module)` (55)
- `(module)` (7)

**Calls:**
- `step` (31)
- `step` (9)
- `step` (4)
- `step` (4)
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

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:463` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `runTrial` (2)

**Calls:**
- `filter` (2)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:534` | Self: 0.0% (0us) | Total: 0.4% (46.7ms) | Samples: 0

**Called by:**
- `step` (71)

**Calls:**
- `cloneMatrix` (70)
- `map` (1)

### `vecNorm`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:56` | Self: 0.0% (0us) | Total: 0.0% (754us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `vecDot` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:578` | Self: 0.0% (0us) | Total: 0.0% (5.1ms) | Samples: 0

**Called by:**
- `runTrial` (8)

**Calls:**
- `forEach` (8)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` | Self: 0.0% (0us) | Total: 99.4% (9.82s) | Samples: 0

**Called by:**
- `(module)` (14229)
- `(module)` (1012)

**Calls:**
- `step` (7186)
- `step` (2777)
- `step` (785)
- `step` (783)
- `step` (637)
- `step` (494)
- `step` (365)
- `step` (306)
- `step` (305)
- `step` (261)
- `step` (217)
- `step` (179)
- `step` (131)
- `step` (121)
- `step` (108)
- `step` (93)
- `step` (87)
- `step` (70)
- `step` (56)
- `step` (32)
- `step` (21)
- `step` (19)
- `step` (18)
- `step` (17)
- `step` (14)
- `step` (13)
- `step` (13)
- `step` (12)
- `step` (10)
- `step` (10)
- `step` (9)
- `step` (8)
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

## Files

| Self% | Self | File |
|------:|-----:|------|
| 91.8% | 9.07s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 7.8% | 774.3ms | `[native code]` |
| 0.3% | 29.8ms | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
