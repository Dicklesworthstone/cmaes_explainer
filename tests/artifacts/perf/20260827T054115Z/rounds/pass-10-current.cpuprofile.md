# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 9.27s | 12012 | 500us | 161 |

**Top 10:** `jacobiEigenSymmetric` 39.9%, `step` 19.0%, `transformFromEigenCoordinates` 4.8%, `step` 4.0%, `whitenWithEigensystem` 3.3%, `whitenWithEigensystem` 2.6%, `reconstructSymmetric` 2.6%, `map` 2.1%, `step` 2.0%, `hypot` 1.7%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 39.9% | 3.70s | 41.6% | 3.86s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 19.0% | 1.76s | 19.0% | 1.76s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 4.8% | 453.7ms | 5.0% | 470.6ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 4.0% | 372.7ms | 4.5% | 423.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` |
| 3.3% | 314.2ms | 3.5% | 327.1ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 2.6% | 245.4ms | 2.7% | 252.4ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` |
| 2.6% | 244.0ms | 3.1% | 289.7ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` |
| 2.1% | 203.7ms | 4.8% | 453.6ms | `map` | `[native code]` |
| 2.0% | 190.5ms | 2.0% | 190.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:677` |
| 1.7% | 159.5ms | 1.7% | 159.5ms | `hypot` | `[native code]` |
| 1.7% | 159.3ms | 1.7% | 159.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:652` |
| 1.5% | 142.1ms | 1.5% | 142.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:648` |
| 1.5% | 140.8ms | 1.5% | 140.8ms | `fill` | `[native code]` |
| 1.3% | 122.8ms | 2.0% | 187.2ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.2% | 120.1ms | 1.2% | 120.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.9% | 85.0ms | 0.9% | 85.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.6% | 62.5ms | 0.6% | 62.5ms | `every` | `[native code]` |
| 0.6% | 61.0ms | 0.9% | 85.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.5% | 51.9ms | 0.5% | 51.9ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:545` |
| 0.5% | 51.2ms | 1.5% | 147.4ms | `some` | `[native code]` |
| 0.5% | 47.9ms | 0.6% | 57.6ms | `sort` | `[native code]` |
| 0.5% | 47.8ms | 0.7% | 73.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.4% | 43.3ms | 0.4% | 43.3ms | `Float64Array` | `[native code]` |
| 0.4% | 43.0ms | 1.3% | 123.3ms | `from` | `[native code]` |
| 0.4% | 37.1ms | 0.4% | 37.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.3% | 33.1ms | 0.3% | 33.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` |
| 0.3% | 31.4ms | 0.7% | 69.2ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.2% | 27.2ms | 0.2% | 27.2ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.2% | 27.2ms | 0.2% | 27.2ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.2% | 24.0ms | 1.2% | 116.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:669` |
| 0.2% | 21.7ms | 0.2% | 21.7ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:303` |
| 0.1% | 15.6ms | 0.1% | 15.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.1% | 13.9ms | 0.1% | 13.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:625` |
| 0.1% | 10.8ms | 0.1% | 10.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:640` |
| 0.1% | 10.3ms | 0.7% | 69.4ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:523` |
| 0.0% | 8.1ms | 0.0% | 8.1ms | `push` | `[native code]` |
| 0.0% | 8.1ms | 0.0% | 8.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 7.8ms | 0.0% | 7.8ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 7.3ms | 0.0% | 7.3ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:253` |
| 0.0% | 6.1ms | 0.0% | 6.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:636` |
| 0.0% | 5.8ms | 0.0% | 5.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:696` |
| 0.0% | 5.3ms | 0.1% | 18.5ms | `anonymous` | `[native code]` |
| 0.0% | 5.2ms | 0.1% | 16.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:624` |
| 0.0% | 5.2ms | 2.4% | 226.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` |
| 0.0% | 4.5ms | 0.8% | 74.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:564` |
| 0.0% | 4.1ms | 0.0% | 4.1ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 4.1ms | 0.0% | 4.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 4.0ms | 0.0% | 5.5ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:533` |
| 0.0% | 4.0ms | 0.0% | 4.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:681` |
| 0.0% | 4.0ms | 0.0% | 4.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` |
| 0.0% | 3.8ms | 0.0% | 3.8ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:53` |
| 0.0% | 3.6ms | 0.0% | 3.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` |
| 0.0% | 3.5ms | 0.0% | 3.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` |
| 0.0% | 3.2ms | 0.0% | 3.2ms | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` |
| 0.0% | 2.9ms | 0.0% | 2.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:701` |
| 0.0% | 2.6ms | 0.0% | 2.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` |
| 0.0% | 2.5ms | 0.6% | 60.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:614` |
| 0.0% | 2.5ms | 0.0% | 2.5ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:525` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:252` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.3ms | 1.4% | 135.2ms | `forEach` | `[native code]` |
| 0.0% | 2.3ms | 0.7% | 73.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `abs` | `[native code]` |
| 0.0% | 2.2ms | 0.2% | 24.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:683` |
| 0.0% | 1.7ms | 5.2% | 482.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:274` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:672` |
| 0.0% | 1.5ms | 0.0% | 8.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:601` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 0.0% | 1.4ms | 0.0% | 8.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:690` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` |
| 0.0% | 1.4ms | 0.4% | 39.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:555` |
| 0.0% | 1.2ms | 0.7% | 70.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 0.0% | 889us | 0.0% | 889us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` |
| 0.0% | 880us | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:590` |
| 0.0% | 878us | 0.0% | 878us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:660` |
| 0.0% | 860us | 0.0% | 860us | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 843us | 0.0% | 843us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:309` |
| 0.0% | 842us | 0.0% | 842us | `sqrt` | `[native code]` |
| 0.0% | 840us | 0.0% | 840us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 0.0% | 833us | 0.0% | 1.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 0.0% | 827us | 0.4% | 42.2ms | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.0% | 822us | 0.0% | 6.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.0% | 822us | 0.0% | 822us | `max` | `[native code]` |
| 0.0% | 817us | 0.0% | 817us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 813us | 0.0% | 2.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:685` |
| 0.0% | 794us | 0.0% | 2.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:581` |
| 0.0% | 769us | 0.0% | 769us | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 761us | 0.0% | 761us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.0% | 761us | 0.0% | 761us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` |
| 0.0% | 759us | 0.0% | 759us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:706` |
| 0.0% | 758us | 1.4% | 130.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` |
| 0.0% | 746us | 0.0% | 746us | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |
| 0.0% | 727us | 0.0% | 727us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:384` |
| 0.0% | 710us | 0.7% | 71.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:599` |
| 0.0% | 679us | 0.0% | 8.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` |
| 0.0% | 677us | 0.0% | 677us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:554` |
| 0.0% | 662us | 0.0% | 662us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` |
| 0.0% | 656us | 0.0% | 656us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:26` |
| 0.0% | 648us | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:707` |
| 0.0% | 631us | 0.0% | 631us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` |
| 0.0% | 630us | 0.0% | 630us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` |
| 0.0% | 630us | 0.0% | 630us | `isFinite` | `[native code]` |
| 0.0% | 624us | 0.0% | 2.2ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:524` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 99.4% | 9.21s | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` |
| 93.2% | 8.64s | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` |
| 45.0% | 4.17s | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:655` |
| 41.6% | 3.86s | 39.9% | 3.70s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 19.0% | 1.76s | 19.0% | 1.76s | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` |
| 6.6% | 618.6ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` |
| 5.5% | 514.8ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:619` |
| 5.2% | 482.9ms | 0.0% | 1.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` |
| 5.0% | 470.6ms | 4.8% | 453.7ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` |
| 4.8% | 453.6ms | 2.1% | 203.7ms | `map` | `[native code]` |
| 4.5% | 423.2ms | 4.0% | 372.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` |
| 3.5% | 327.1ms | 3.3% | 314.2ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` |
| 3.1% | 289.7ms | 2.6% | 244.0ms | `reconstructSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` |
| 3.1% | 289.7ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:656` |
| 2.7% | 252.4ms | 2.6% | 245.4ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` |
| 2.4% | 226.5ms | 0.0% | 5.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` |
| 2.0% | 190.5ms | 2.0% | 190.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:677` |
| 2.0% | 187.2ms | 1.3% | 122.8ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.7% | 159.5ms | 1.7% | 159.5ms | `hypot` | `[native code]` |
| 1.7% | 159.3ms | 1.7% | 159.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:652` |
| 1.5% | 147.4ms | 0.5% | 51.2ms | `some` | `[native code]` |
| 1.5% | 142.1ms | 1.5% | 142.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:648` |
| 1.5% | 140.8ms | 1.5% | 140.8ms | `fill` | `[native code]` |
| 1.4% | 135.2ms | 0.0% | 2.3ms | `forEach` | `[native code]` |
| 1.4% | 133.0ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:667` |
| 1.4% | 130.5ms | 0.0% | 758us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` |
| 1.3% | 123.3ms | 0.4% | 43.0ms | `from` | `[native code]` |
| 1.2% | 120.1ms | 1.2% | 120.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.2% | 116.1ms | 0.2% | 24.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:669` |
| 1.1% | 106.1ms | 0.0% | 0us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.9% | 85.2ms | 0.6% | 61.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.9% | 85.0ms | 0.9% | 85.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` |
| 0.8% | 74.6ms | 0.0% | 4.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:564` |
| 0.8% | 74.3ms | 0.0% | 0us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.8% | 74.3ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 0.7% | 73.7ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.7% | 73.3ms | 0.5% | 47.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.7% | 73.0ms | 0.0% | 2.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.7% | 72.4ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` |
| 0.7% | 71.1ms | 0.0% | 710us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:599` |
| 0.7% | 70.2ms | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 0.7% | 69.4ms | 0.1% | 10.3ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:523` |
| 0.7% | 69.2ms | 0.3% | 31.4ms | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
| 0.6% | 62.5ms | 0.6% | 62.5ms | `every` | `[native code]` |
| 0.6% | 61.6ms | 0.0% | 0us | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:372` |
| 0.6% | 60.3ms | 0.0% | 2.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:614` |
| 0.6% | 57.6ms | 0.5% | 47.9ms | `sort` | `[native code]` |
| 0.5% | 51.9ms | 0.5% | 51.9ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:545` |
| 0.4% | 43.3ms | 0.4% | 43.3ms | `Float64Array` | `[native code]` |
| 0.4% | 42.2ms | 0.0% | 827us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.4% | 41.7ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` |
| 0.4% | 40.0ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` |
| 0.4% | 39.4ms | 0.0% | 1.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.4% | 37.9ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:537` |
| 0.4% | 37.5ms | 0.0% | 0us | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` |
| 0.4% | 37.1ms | 0.4% | 37.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` |
| 0.3% | 33.9ms | 0.3% | 33.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` |
| 0.2% | 27.2ms | 0.2% | 27.2ms | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` |
| 0.2% | 27.2ms | 0.2% | 27.2ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.2% | 24.2ms | 0.0% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.2% | 21.7ms | 0.2% | 21.7ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:303` |
| 0.2% | 19.1ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 0.1% | 18.5ms | 0.0% | 5.3ms | `anonymous` | `[native code]` |
| 0.1% | 16.9ms | 0.0% | 5.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:624` |
| 0.1% | 16.0ms | 0.0% | 0us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:668` |
| 0.1% | 15.6ms | 0.1% | 15.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.1% | 13.9ms | 0.1% | 13.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:625` |
| 0.1% | 11.0ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:686` |
| 0.1% | 10.8ms | 0.1% | 10.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:640` |
| 0.0% | 8.7ms | 0.0% | 679us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` |
| 0.0% | 8.4ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:601` |
| 0.0% | 8.1ms | 0.0% | 8.1ms | `push` | `[native code]` |
| 0.0% | 8.1ms | 0.0% | 8.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 8.1ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:690` |
| 0.0% | 7.8ms | 0.0% | 7.8ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 7.3ms | 0.0% | 7.3ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:253` |
| 0.0% | 7.0ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:609` |
| 0.0% | 6.7ms | 0.0% | 822us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.0% | 6.1ms | 0.0% | 6.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:636` |
| 0.0% | 5.8ms | 0.0% | 5.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:696` |
| 0.0% | 5.5ms | 0.0% | 0us | `runTrial` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` |
| 0.0% | 5.5ms | 0.0% | 4.0ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:533` |
| 0.0% | 5.4ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` |
| 0.0% | 5.3ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.0% | 5.3ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` |
| 0.0% | 4.6ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 4.1ms | 0.0% | 4.1ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 4.1ms | 0.0% | 4.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 4.0ms | 0.0% | 4.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:681` |
| 0.0% | 4.0ms | 0.0% | 4.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` |
| 0.0% | 3.8ms | 0.0% | 3.8ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:53` |
| 0.0% | 3.7ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:687` |
| 0.0% | 3.6ms | 0.0% | 3.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` |
| 0.0% | 3.6ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` |
| 0.0% | 3.5ms | 0.0% | 3.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` |
| 0.0% | 3.2ms | 0.0% | 0us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:604` |
| 0.0% | 3.2ms | 0.0% | 3.2ms | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.1ms | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:305` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 3.0ms | 0.0% | 3.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` |
| 0.0% | 2.9ms | 0.0% | 794us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:581` |
| 0.0% | 2.9ms | 0.0% | 2.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:701` |
| 0.0% | 2.6ms | 0.0% | 2.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` |
| 0.0% | 2.5ms | 0.0% | 2.5ms | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:525` |
| 0.0% | 2.5ms | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:427` |
| 0.0% | 2.4ms | 0.0% | 813us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:685` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:252` |
| 0.0% | 2.3ms | 0.0% | 2.3ms | `alignProjectionBasis` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 2.2ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 2.2ms | 0.0% | 624us | `projectTo3D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:524` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `abs` | `[native code]` |
| 0.0% | 2.2ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:683` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.6ms | 0.0% | 833us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` |
| 0.0% | 1.6ms | 0.0% | 880us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:590` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `whitenWithEigensystem` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:274` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:672` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` |
| 0.0% | 1.5ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 1.4ms | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 1.4ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 1.4ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 1.4ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `coordinate` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:555` |
| 0.0% | 1.2ms | 0.0% | 648us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:707` |
| 0.0% | 889us | 0.0% | 889us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` |
| 0.0% | 878us | 0.0% | 878us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:660` |
| 0.0% | 860us | 0.0% | 860us | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 847us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:462` |
| 0.0% | 843us | 0.0% | 843us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:309` |
| 0.0% | 842us | 0.0% | 842us | `sqrt` | `[native code]` |
| 0.0% | 840us | 0.0% | 840us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` |
| 0.0% | 838us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:440` |
| 0.0% | 822us | 0.0% | 822us | `max` | `[native code]` |
| 0.0% | 819us | 0.0% | 0us | `ellipsoidObjective` | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:40` |
| 0.0% | 817us | 0.0% | 817us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 791us | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 791us | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 770us | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:307` |
| 0.0% | 769us | 0.0% | 769us | `createZeroVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 761us | 0.0% | 761us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` |
| 0.0% | 761us | 0.0% | 761us | `transformFromEigenCoordinates` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` |
| 0.0% | 759us | 0.0% | 759us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:706` |
| 0.0% | 746us | 0.0% | 746us | `variancePercent` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` |
| 0.0% | 727us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:422` |
| 0.0% | 727us | 0.0% | 727us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:384` |
| 0.0% | 677us | 0.0% | 677us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:554` |
| 0.0% | 662us | 0.0% | 662us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` |
| 0.0% | 656us | 0.0% | 656us | `createZeroMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:26` |
| 0.0% | 647us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 647us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 647us | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 631us | 0.0% | 631us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` |
| 0.0% | 630us | 0.0% | 630us | `isFinite` | `[native code]` |
| 0.0% | 630us | 0.0% | 630us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` |
| 0.0% | 630us | 0.0% | 0us | `CMAESOptimizerND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:430` |

## Function Details

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` | Self: 39.9% (3.70s) | Total: 41.6% (3.86s) | Samples: 4805

**Called by:**
- `step` (5014)

**Calls:**
- `hypot` (209)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:639` | Self: 19.0% (1.76s) | Total: 19.0% (1.76s) | Samples: 2298

**Called by:**
- `runTrial` (2292)
- `runTrial` (6)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:250` | Self: 4.8% (453.7ms) | Total: 5.0% (470.6ms) | Samples: 589

**Called by:**
- `step` (611)

**Calls:**
- `createZeroVector` (15)
- `fill` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:632` | Self: 4.0% (372.7ms) | Total: 4.5% (423.2ms) | Samples: 488

**Called by:**
- `runTrial` (547)
- `runTrial` (5)

**Calls:**
- `createZeroMatrix` (52)
- `from` (11)
- `createZeroMatrix` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:272` | Self: 3.3% (314.2ms) | Total: 3.5% (327.1ms) | Samples: 402

**Called by:**
- `step` (363)
- `step` (50)

**Calls:**
- `createZeroVector` (10)
- `fill` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:265` | Self: 2.6% (245.4ms) | Total: 2.7% (252.4ms) | Samples: 316

**Called by:**
- `step` (283)
- `step` (42)

**Calls:**
- `createZeroVector` (5)
- `fill` (4)

### `reconstructSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:231` | Self: 2.6% (244.0ms) | Total: 3.1% (289.7ms) | Samples: 323

**Called by:**
- `step` (383)

**Calls:**
- `from` (59)
- `createZeroMatrix` (1)

### `map`
`[native code]` | Self: 2.1% (203.7ms) | Total: 4.8% (453.6ms) | Samples: 256

**Called by:**
- `cloneMatrix` (140)
- `step` (96)
- `step` (90)
- `step` (81)
- `(anonymous)` (73)
- `(anonymous)` (21)
- `step` (11)
- `step` (9)
- `step` (9)
- `step` (8)
- `step` (8)
- `step` (7)
- `jacobiEigenSymmetric` (7)
- `jacobiEigenSymmetric` (6)
- `jacobiEigenSymmetric` (5)
- `alignProjectionBasis` (2)
- `map` (2)
- `alignProjectionBasis` (2)

**Calls:**
- `(anonymous)` (125)
- `(anonymous)` (111)
- `(anonymous)` (76)
- `abs` (3)
- `map` (2)
- `(anonymous)` (2)
- `(anonymous)` (1)
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:677` | Self: 2.0% (190.5ms) | Total: 2.0% (190.5ms) | Samples: 249

**Called by:**
- `runTrial` (249)

### `hypot`
`[native code]` | Self: 1.7% (159.5ms) | Total: 1.7% (159.5ms) | Samples: 209

**Called by:**
- `jacobiEigenSymmetric` (209)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:652` | Self: 1.7% (159.3ms) | Total: 1.7% (159.3ms) | Samples: 209

**Called by:**
- `runTrial` (209)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:648` | Self: 1.5% (142.1ms) | Total: 1.5% (142.1ms) | Samples: 183

**Called by:**
- `runTrial` (183)

### `fill`
`[native code]` | Self: 1.5% (140.8ms) | Total: 1.5% (140.8ms) | Samples: 184

**Called by:**
- `sampleGaussianVectorND` (84)
- `ellipsoidObjective` (50)
- `from` (36)
- `transformFromEigenCoordinates` (7)
- `whitenWithEigensystem` (4)
- `ellipsoidObjective` (1)
- `whitenWithEigensystem` (1)
- `sampleGaussianVectorND` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.3% (122.8ms) | Total: 2.0% (187.2ms) | Samples: 160

**Called by:**
- `step` (244)

**Calls:**
- `fill` (84)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.2% (120.1ms) | Total: 1.2% (120.1ms) | Samples: 155

**Called by:**
- `map` (125)
- `some` (30)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 0.9% (85.0ms) | Total: 0.9% (85.0ms) | Samples: 111

**Called by:**
- `map` (111)

### `every`
`[native code]` | Self: 0.6% (62.5ms) | Total: 0.6% (62.5ms) | Samples: 82

**Called by:**
- `requireFiniteVector` (81)
- `CMAESOptimizerND` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` | Self: 0.6% (61.0ms) | Total: 0.9% (85.2ms) | Samples: 81

**Called by:**
- `step` (105)

**Calls:**
- `Float64Array` (24)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:545` | Self: 0.5% (51.9ms) | Total: 0.5% (51.9ms) | Samples: 68

**Called by:**
- `step` (68)

### `some`
`[native code]` | Self: 0.5% (51.2ms) | Total: 1.5% (147.4ms) | Samples: 68

**Called by:**
- `validateSquareFiniteMatrix` (99)
- `(anonymous)` (94)
- `projectTo3D` (2)
- `some` (1)

**Calls:**
- `(anonymous)` (97)
- `(anonymous)` (30)
- `some` (1)

### `sort`
`[native code]` | Self: 0.5% (47.9ms) | Total: 0.6% (57.6ms) | Samples: 63

**Called by:**
- `jacobiEigenSymmetric` (47)
- `step` (29)

**Calls:**
- `(anonymous)` (11)
- `(anonymous)` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.5% (47.8ms) | Total: 0.7% (73.3ms) | Samples: 61

**Called by:**
- `step` (95)

**Calls:**
- `from` (34)

### `Float64Array`
`[native code]` | Self: 0.4% (43.3ms) | Total: 0.4% (43.3ms) | Samples: 49

**Called by:**
- `jacobiEigenSymmetric` (25)
- `jacobiEigenSymmetric` (24)

### `from`
`[native code]` | Self: 0.4% (43.0ms) | Total: 1.3% (123.3ms) | Samples: 57

**Called by:**
- `reconstructSymmetric` (59)
- `createZeroMatrix` (52)
- `jacobiEigenSymmetric` (34)
- `step` (11)
- `jacobiEigenSymmetric` (3)
- `CMAESOptimizerND` (1)

**Calls:**
- `(anonymous)` (46)
- `fill` (36)
- `(anonymous)` (21)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.4% (37.1ms) | Total: 0.4% (37.1ms) | Samples: 46

**Called by:**
- `from` (46)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:592` | Self: 0.3% (33.1ms) | Total: 0.3% (33.9ms) | Samples: 42

**Called by:**
- `runTrial` (43)

**Calls:**
- `adaptationPoint` (1)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` | Self: 0.3% (31.4ms) | Total: 0.7% (69.2ms) | Samples: 38

**Called by:**
- `step` (88)

**Calls:**
- `fill` (50)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:22` | Self: 0.2% (27.2ms) | Total: 0.2% (27.2ms) | Samples: 30

**Called by:**
- `transformFromEigenCoordinates` (15)
- `whitenWithEigensystem` (10)
- `whitenWithEigensystem` (5)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.2% (27.2ms) | Total: 0.2% (27.2ms) | Samples: 36

**Called by:**
- `(anonymous)` (20)
- `step` (13)
- `step` (3)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:669` | Self: 0.2% (24.0ms) | Total: 1.2% (116.1ms) | Samples: 31

**Called by:**
- `forEach` (152)

**Calls:**
- `projectTo3D` (89)
- `projectTo3D` (20)
- `projectTo3D` (7)
- `projectTo3D` (3)
- `projectTo3D` (2)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:303` | Self: 0.2% (21.7ms) | Total: 0.2% (21.7ms) | Samples: 29

**Called by:**
- `step` (29)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.1% (15.6ms) | Total: 0.1% (15.6ms) | Samples: 21

**Called by:**
- `from` (21)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:625` | Self: 0.1% (13.9ms) | Total: 0.1% (13.9ms) | Samples: 17

**Called by:**
- `runTrial` (17)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:640` | Self: 0.1% (10.8ms) | Total: 0.1% (10.8ms) | Samples: 13

**Called by:**
- `runTrial` (12)
- `runTrial` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:523` | Self: 0.1% (10.3ms) | Total: 0.7% (69.4ms) | Samples: 13

**Called by:**
- `(anonymous)` (89)
- `step` (1)
- `step` (1)

**Calls:**
- `requireFiniteVector` (78)

### `push`
`[native code]` | Self: 0.0% (8.1ms) | Total: 0.0% (8.1ms) | Samples: 11

**Called by:**
- `step` (10)
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` | Self: 0.0% (8.1ms) | Total: 0.0% (8.1ms) | Samples: 11

**Called by:**
- `sort` (11)

### `vecDot`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (7.8ms) | Total: 0.0% (7.8ms) | Samples: 10

**Called by:**
- `step` (10)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:253` | Self: 0.0% (7.3ms) | Total: 0.0% (7.3ms) | Samples: 10

**Called by:**
- `step` (10)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:636` | Self: 0.0% (6.1ms) | Total: 0.0% (6.1ms) | Samples: 8

**Called by:**
- `runTrial` (8)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:696` | Self: 0.0% (5.8ms) | Total: 0.0% (5.8ms) | Samples: 8

**Called by:**
- `runTrial` (8)

### `anonymous`
`[native code]` | Self: 0.0% (5.3ms) | Total: 0.1% (18.5ms) | Samples: 7

**Called by:**
- `(anonymous)` (4)
- `get WriteStream` (3)
- `node:fs` (3)
- `internal:fs/streams` (2)
- `internal:stream` (2)
- `internal:streams/compose` (2)
- `node:fs/promises` (2)
- `node:stream` (2)
- `node:events` (1)
- `internal:validators` (1)
- `internal:streams/pipeline` (1)
- `internal:shared` (1)
- `internal:streams/duplex` (1)

**Calls:**
- `node:fs` (3)
- `internal:fs/streams` (2)
- `node:fs/promises` (2)
- `internal:streams/compose` (2)
- `node:stream` (2)
- `internal:stream` (2)
- `internal:shared` (1)
- `node:events` (1)
- `internal:validators` (1)
- `internal:streams/pipeline` (1)
- `internal:streams/duplex` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:624` | Self: 0.0% (5.2ms) | Total: 0.1% (16.9ms) | Samples: 7

**Called by:**
- `runTrial` (22)

**Calls:**
- `vecDot` (10)
- `vecDot` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:560` | Self: 0.0% (5.2ms) | Total: 2.4% (226.5ms) | Samples: 7

**Called by:**
- `runTrial` (294)
- `runTrial` (2)

**Calls:**
- `sampleGaussianVectorND` (244)
- `sampleGaussianVectorND` (29)
- `push` (10)
- `sampleGaussianVectorND` (4)
- `sampleGaussianVectorND` (1)
- `sampleGaussianVectorND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:564` | Self: 0.0% (4.5ms) | Total: 0.8% (74.6ms) | Samples: 6

**Called by:**
- `runTrial` (95)

**Calls:**
- `ellipsoidObjective` (88)
- `ellipsoidObjective` (1)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (4.1ms) | Total: 0.0% (4.1ms) | Samples: 6

**Called by:**
- `step` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (4.1ms) | Total: 0.0% (4.1ms) | Samples: 3

**Called by:**
- `runTrial` (2)
- `runTrial` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:533` | Self: 0.0% (4.0ms) | Total: 0.0% (5.5ms) | Samples: 5

**Called by:**
- `(anonymous)` (7)

**Calls:**
- `coordinate` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:681` | Self: 0.0% (4.0ms) | Total: 0.0% (4.0ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:566` | Self: 0.0% (4.0ms) | Total: 0.0% (4.0ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `vecDot`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:53` | Self: 0.0% (3.8ms) | Total: 0.0% (3.8ms) | Samples: 5

**Called by:**
- `step` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:616` | Self: 0.0% (3.6ms) | Total: 0.0% (3.6ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:700` | Self: 0.0% (3.5ms) | Total: 0.0% (3.5ms) | Samples: 5

**Called by:**
- `runTrial` (5)

### `vecNorm`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (3.2ms) | Total: 0.0% (3.2ms) | Samples: 3

**Called by:**
- `step` (3)

### `nextOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (3.1ms) | Total: 0.0% (3.1ms) | Samples: 4

**Called by:**
- `sampleGaussianVectorND` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:697` | Self: 0.0% (3.0ms) | Total: 0.0% (3.0ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:659` | Self: 0.0% (2.9ms) | Total: 0.0% (2.9ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:701` | Self: 0.0% (2.8ms) | Total: 0.0% (2.8ms) | Samples: 4

**Called by:**
- `runTrial` (4)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` | Self: 0.0% (2.6ms) | Total: 0.0% (2.6ms) | Samples: 3

**Called by:**
- `step` (3)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:614` | Self: 0.0% (2.5ms) | Total: 0.6% (60.3ms) | Samples: 3

**Called by:**
- `map` (76)

**Calls:**
- `map` (73)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:525` | Self: 0.0% (2.5ms) | Total: 0.0% (2.5ms) | Samples: 3

**Called by:**
- `(anonymous)` (2)
- `step` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:252` | Self: 0.0% (2.4ms) | Total: 0.0% (2.4ms) | Samples: 3

**Called by:**
- `step` (3)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (2.3ms) | Total: 0.0% (2.3ms) | Samples: 3

**Called by:**
- `step` (3)

### `forEach`
`[native code]` | Self: 0.0% (2.3ms) | Total: 1.4% (135.2ms) | Samples: 3

**Called by:**
- `step` (174)
- `step` (3)

**Calls:**
- `(anonymous)` (152)
- `(anonymous)` (21)
- `(anonymous)` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (2.3ms) | Total: 0.7% (73.0ms) | Samples: 3

**Called by:**
- `some` (97)

**Calls:**
- `some` (94)

### `abs`
`[native code]` | Self: 0.0% (2.2ms) | Total: 0.0% (2.2ms) | Samples: 3

**Called by:**
- `map` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` | Self: 0.0% (2.2ms) | Total: 0.2% (24.2ms) | Samples: 3

**Called by:**
- `runTrial` (32)

**Calls:**
- `sort` (29)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:683` | Self: 0.0% (2.0ms) | Total: 0.0% (2.0ms) | Samples: 3

**Called by:**
- `runTrial` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:561` | Self: 0.0% (1.7ms) | Total: 5.2% (482.9ms) | Samples: 2

**Called by:**
- `runTrial` (625)
- `runTrial` (2)

**Calls:**
- `transformFromEigenCoordinates` (611)
- `transformFromEigenCoordinates` (10)
- `transformFromEigenCoordinates` (3)
- `transformFromEigenCoordinates` (1)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 2

**Called by:**
- `step` (2)

### `whitenWithEigensystem`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:274` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 2

**Called by:**
- `step` (1)
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:580` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `sort` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:672` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:601` | Self: 0.0% (1.5ms) | Total: 0.0% (8.4ms) | Samples: 2

**Called by:**
- `runTrial` (11)

**Calls:**
- `map` (9)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `step` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `map` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:690` | Self: 0.0% (1.4ms) | Total: 0.0% (8.1ms) | Samples: 2

**Called by:**
- `runTrial` (10)

**Calls:**
- `map` (8)

### `coordinate`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:530` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `projectTo3D` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` | Self: 0.0% (1.4ms) | Total: 0.4% (39.4ms) | Samples: 2

**Called by:**
- `step` (52)

**Calls:**
- `sort` (47)
- `from` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:555` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 2

**Called by:**
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:562` | Self: 0.0% (1.2ms) | Total: 0.7% (70.2ms) | Samples: 2

**Called by:**
- `runTrial` (92)

**Calls:**
- `map` (90)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:559` | Self: 0.0% (889us) | Total: 0.0% (889us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:590` | Self: 0.0% (880us) | Total: 0.0% (1.6ms) | Samples: 1

**Called by:**
- `runTrial` (2)

**Calls:**
- `createZeroVector` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:660` | Self: 0.0% (878us) | Total: 0.0% (878us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `variancePercent`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (860us) | Total: 0.0% (860us) | Samples: 1

**Called by:**
- `step` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:309` | Self: 0.0% (843us) | Total: 0.0% (843us) | Samples: 1

**Called by:**
- `step` (1)

### `sqrt`
`[native code]` | Self: 0.0% (842us) | Total: 0.0% (842us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:570` | Self: 0.0% (840us) | Total: 0.0% (840us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:605` | Self: 0.0% (833us) | Total: 0.0% (1.6ms) | Samples: 1

**Called by:**
- `runTrial` (2)

**Calls:**
- `sqrt` (1)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:27` | Self: 0.0% (827us) | Total: 0.4% (42.2ms) | Samples: 1

**Called by:**
- `step` (52)
- `reconstructSymmetric` (1)

**Calls:**
- `from` (52)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.0% (822us) | Total: 0.0% (6.7ms) | Samples: 1

**Called by:**
- `step` (9)

**Calls:**
- `map` (7)
- `max` (1)

### `max`
`[native code]` | Self: 0.0% (822us) | Total: 0.0% (822us) | Samples: 1

**Called by:**
- `jacobiEigenSymmetric` (1)

### `adaptationPoint`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (817us) | Total: 0.0% (817us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:685` | Self: 0.0% (813us) | Total: 0.0% (2.4ms) | Samples: 1

**Called by:**
- `runTrial` (3)

**Calls:**
- `variancePercent` (1)
- `variancePercent` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:581` | Self: 0.0% (794us) | Total: 0.0% (2.9ms) | Samples: 1

**Called by:**
- `runTrial` (4)

**Calls:**
- `forEach` (3)

### `createZeroVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (769us) | Total: 0.0% (769us) | Samples: 1

**Called by:**
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` | Self: 0.0% (761us) | Total: 0.0% (761us) | Samples: 1

**Called by:**
- `map` (1)

### `transformFromEigenCoordinates`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:249` | Self: 0.0% (761us) | Total: 0.0% (761us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:706` | Self: 0.0% (759us) | Total: 0.0% (759us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:665` | Self: 0.0% (758us) | Total: 1.4% (130.5ms) | Samples: 1

**Called by:**
- `runTrial` (170)
- `runTrial` (2)

**Calls:**
- `alignProjectionBasis` (68)
- `alignProjectionBasis` (50)
- `alignProjectionBasis` (50)
- `alignProjectionBasis` (3)

### `variancePercent`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:674` | Self: 0.0% (746us) | Total: 0.0% (746us) | Samples: 1

**Called by:**
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:384` | Self: 0.0% (727us) | Total: 0.0% (727us) | Samples: 1

**Called by:**
- `CMAESOptimizerND` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:599` | Self: 0.0% (710us) | Total: 0.7% (71.1ms) | Samples: 1

**Called by:**
- `runTrial` (93)
- `runTrial` (1)

**Calls:**
- `whitenWithEigensystem` (50)
- `whitenWithEigensystem` (42)
- `whitenWithEigensystem` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:598` | Self: 0.0% (679us) | Total: 0.0% (8.7ms) | Samples: 1

**Called by:**
- `runTrial` (12)

**Calls:**
- `map` (11)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:554` | Self: 0.0% (677us) | Total: 0.0% (677us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:645` | Self: 0.0% (662us) | Total: 0.0% (662us) | Samples: 1

**Called by:**
- `runTrial` (1)

### `createZeroMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:26` | Self: 0.0% (656us) | Total: 0.0% (656us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:707` | Self: 0.0% (648us) | Total: 0.0% (1.2ms) | Samples: 1

**Called by:**
- `runTrial` (2)

**Calls:**
- `push` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:610` | Self: 0.0% (631us) | Total: 0.0% (631us) | Samples: 1

**Called by:**
- `map` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:586` | Self: 0.0% (630us) | Total: 0.0% (630us) | Samples: 1

**Called by:**
- `forEach` (1)

### `isFinite`
`[native code]` | Self: 0.0% (630us) | Total: 0.0% (630us) | Samples: 1

**Called by:**
- `CMAESOptimizerND` (1)

### `projectTo3D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:524` | Self: 0.0% (624us) | Total: 0.0% (2.2ms) | Samples: 1

**Called by:**
- `(anonymous)` (3)

**Calls:**
- `some` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:695` | Self: 0.0% (0us) | Total: 0.4% (41.7ms) | Samples: 0

**Called by:**
- `runTrial` (54)

**Calls:**
- `cloneMatrix` (44)
- `map` (8)
- `cloneMatrix` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:668` | Self: 0.0% (0us) | Total: 0.1% (16.0ms) | Samples: 0

**Called by:**
- `forEach` (21)

**Calls:**
- `map` (21)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:549` | Self: 0.0% (0us) | Total: 0.4% (37.5ms) | Samples: 0

**Called by:**
- `step` (50)

**Calls:**
- `cloneMatrix` (48)
- `map` (2)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:48` | Self: 0.0% (0us) | Total: 0.0% (5.5ms) | Samples: 0

**Called by:**
- `(module)` (5)
- `(module)` (2)

**Calls:**
- `CMAESOptimizerND` (3)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)
- `CMAESOptimizerND` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:97` | Self: 0.0% (0us) | Total: 0.0% (5.3ms) | Samples: 0

**Calls:**
- `(anonymous)` (7)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (647us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:307` | Self: 0.0% (0us) | Total: 0.0% (770us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `fill` (1)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (0us) | Total: 0.8% (74.3ms) | Samples: 0

**Called by:**
- `jacobiEigenSymmetric` (99)

**Calls:**
- `some` (99)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (791us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` | Self: 0.0% (0us) | Total: 0.2% (19.1ms) | Samples: 0

**Called by:**
- `step` (25)

**Calls:**
- `Float64Array` (25)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (5.3ms) | Samples: 0

**Called by:**
- `(module)` (7)

**Calls:**
- `anonymous` (4)
- `get WriteStream` (3)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:80` | Self: 0.0% (0us) | Total: 6.6% (618.6ms) | Samples: 0

**Calls:**
- `runTrial` (790)
- `runTrial` (5)
- `runTrial` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:667` | Self: 0.0% (0us) | Total: 1.4% (133.0ms) | Samples: 0

**Called by:**
- `runTrial` (174)

**Calls:**
- `forEach` (174)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:440` | Self: 0.0% (0us) | Total: 0.0% (838us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `every` (1)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (647us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:655` | Self: 0.0% (0us) | Total: 45.0% (4.17s) | Samples: 0

**Called by:**
- `runTrial` (5392)
- `runTrial` (23)

**Calls:**
- `jacobiEigenSymmetric` (5014)
- `jacobiEigenSymmetric` (105)
- `jacobiEigenSymmetric` (99)
- `jacobiEigenSymmetric` (95)
- `jacobiEigenSymmetric` (52)
- `jacobiEigenSymmetric` (25)
- `jacobiEigenSymmetric` (9)
- `jacobiEigenSymmetric` (6)
- `jacobiEigenSymmetric` (5)
- `jacobiEigenSymmetric` (3)
- `jacobiEigenSymmetric` (2)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (2.2ms) | Samples: 0

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
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:613` | Self: 0.0% (0us) | Total: 0.7% (72.4ms) | Samples: 0

**Called by:**
- `runTrial` (81)

**Calls:**
- `map` (81)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:604` | Self: 0.0% (0us) | Total: 0.0% (3.2ms) | Samples: 0

**Called by:**
- `runTrial` (3)

**Calls:**
- `vecNorm` (3)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:422` | Self: 0.0% (0us) | Total: 0.0% (727us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:666` | Self: 0.0% (0us) | Total: 0.0% (5.4ms) | Samples: 0

**Called by:**
- `runTrial` (7)

**Calls:**
- `map` (7)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:430` | Self: 0.0% (0us) | Total: 0.0% (630us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `isFinite` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:619` | Self: 0.0% (0us) | Total: 5.5% (514.8ms) | Samples: 0

**Called by:**
- `runTrial` (650)
- `runTrial` (3)

**Calls:**
- `whitenWithEigensystem` (363)
- `whitenWithEigensystem` (283)
- `whitenWithEigensystem` (6)
- `whitenWithEigensystem` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` | Self: 0.0% (0us) | Total: 0.0% (4.6ms) | Samples: 0

**Called by:**
- `step` (6)

**Calls:**
- `map` (6)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:305` | Self: 0.0% (0us) | Total: 0.0% (3.1ms) | Samples: 0

**Called by:**
- `step` (4)

**Calls:**
- `nextOpenUnit` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:656` | Self: 0.0% (0us) | Total: 3.1% (289.7ms) | Samples: 0

**Called by:**
- `runTrial` (381)
- `runTrial` (2)

**Calls:**
- `reconstructSymmetric` (383)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:57` | Self: 0.0% (0us) | Total: 99.4% (9.21s) | Samples: 0

**Called by:**
- `(module)` (11159)
- `(module)` (790)

**Calls:**
- `step` (5392)
- `step` (2292)
- `step` (650)
- `step` (625)
- `step` (547)
- `step` (381)
- `step` (294)
- `step` (249)
- `step` (209)
- `step` (183)
- `step` (174)
- `step` (170)
- `step` (95)
- `step` (95)
- `step` (93)
- `step` (92)
- `step` (81)
- `step` (54)
- `step` (43)
- `step` (32)
- `step` (22)
- `step` (17)
- `step` (14)
- `step` (12)
- `step` (12)
- `step` (11)
- `step` (10)
- `step` (9)
- `step` (8)
- `step` (8)
- `step` (7)
- `step` (5)
- `step` (5)
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
- `step` (2)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)
- `step` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` | Self: 0.0% (0us) | Total: 0.8% (74.3ms) | Samples: 0

**Called by:**
- `step` (99)

**Calls:**
- `validateSquareFiniteMatrix` (99)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (2.2ms) | Samples: 0

**Called by:**
- `(anonymous)` (3)

**Calls:**
- `anonymous` (3)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (791us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `requireFiniteVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:372` | Self: 0.0% (0us) | Total: 0.6% (61.6ms) | Samples: 0

**Called by:**
- `projectTo3D` (78)
- `CMAESOptimizerND` (3)

**Calls:**
- `every` (81)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` | Self: 0.0% (0us) | Total: 0.0% (3.6ms) | Samples: 0

**Called by:**
- `step` (5)

**Calls:**
- `map` (5)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:609` | Self: 0.0% (0us) | Total: 0.0% (7.0ms) | Samples: 0

**Called by:**
- `runTrial` (9)

**Calls:**
- `map` (9)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:427` | Self: 0.0% (0us) | Total: 0.0% (2.5ms) | Samples: 0

**Called by:**
- `runTrial` (3)

**Calls:**
- `requireFiniteVector` (3)

### `CMAESOptimizerND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:462` | Self: 0.0% (0us) | Total: 0.0% (847us) | Samples: 0

**Called by:**
- `runTrial` (1)

**Calls:**
- `from` (1)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:41` | Self: 0.0% (0us) | Total: 1.1% (106.1ms) | Samples: 0

**Called by:**
- `alignProjectionBasis` (48)
- `alignProjectionBasis` (48)
- `step` (44)

**Calls:**
- `map` (140)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:686` | Self: 0.0% (0us) | Total: 0.1% (11.0ms) | Samples: 0

**Called by:**
- `runTrial` (14)

**Calls:**
- `projectTo3D` (13)
- `projectTo3D` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:87` | Self: 0.0% (0us) | Total: 93.2% (8.64s) | Samples: 0

**Calls:**
- `runTrial` (11159)
- `runTrial` (44)
- `runTrial` (5)

### `runTrial`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:56` | Self: 0.0% (0us) | Total: 0.4% (40.0ms) | Samples: 0

**Called by:**
- `(module)` (44)
- `(module)` (5)

**Calls:**
- `step` (23)
- `step` (6)
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

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:687` | Self: 0.0% (0us) | Total: 0.0% (3.7ms) | Samples: 0

**Called by:**
- `runTrial` (5)

**Calls:**
- `projectTo3D` (3)
- `projectTo3D` (1)
- `projectTo3D` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:563` | Self: 0.0% (0us) | Total: 0.7% (73.7ms) | Samples: 0

**Called by:**
- `runTrial` (95)
- `runTrial` (1)

**Calls:**
- `map` (96)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (647us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `ellipsoidObjective`
`/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts:40` | Self: 0.0% (0us) | Total: 0.0% (819us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `fill` (1)

### `alignProjectionBasis`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:537` | Self: 0.0% (0us) | Total: 0.4% (37.9ms) | Samples: 0

**Called by:**
- `step` (50)

**Calls:**
- `cloneMatrix` (48)
- `map` (2)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 91.3% | 8.46s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 8.3% | 772.6ms | `[native code]` |
| 0.3% | 31.4ms | `/Users/jemanuel/projects/cmaes_explainer/tests/perf/cmaesEngine.bench.ts` |
