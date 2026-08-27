# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 1.43s | 1804 | 500us | 133 |

**Top 10:** `step` 18.0%, `sampleGaussian2D` 9.5%, `sort` 9.2%, `repair` 7.9%, `atan2` 6.1%, `step` 4.2%, `step` 2.8%, `step` 2.5%, `step` 2.3%, `step` 1.9%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 18.0% | 257.9ms | 18.2% | 260.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:533` |
| 9.5% | 135.9ms | 11.4% | 163.6ms | `sampleGaussian2D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 9.2% | 132.2ms | 10.7% | 154.1ms | `sort` | `[native code]` |
| 7.9% | 113.5ms | 8.8% | 126.4ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 6.1% | 88.4ms | 6.1% | 88.4ms | `atan2` | `[native code]` |
| 4.2% | 61.0ms | 6.6% | 94.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:475` |
| 2.8% | 40.5ms | 2.8% | 40.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:480` |
| 2.5% | 36.5ms | 2.5% | 36.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:479` |
| 2.3% | 33.8ms | 15.0% | 215.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:468` |
| 1.9% | 27.9ms | 1.9% | 27.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:467` |
| 1.5% | 22.5ms | 1.5% | 22.5ms | `compose` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:121` |
| 1.5% | 21.9ms | 3.3% | 48.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:459` |
| 1.5% | 21.9ms | 1.5% | 21.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:490` |
| 1.3% | 19.9ms | 2.5% | 37.1ms | `eigen2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:107` |
| 1.1% | 16.8ms | 1.1% | 16.8ms | `sampleGaussian2D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:169` |
| 1.1% | 16.5ms | 1.3% | 19.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:503` |
| 1.1% | 16.3ms | 1.5% | 22.5ms | `sampleGaussian` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 1.1% | 16.1ms | 1.2% | 17.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:519` |
| 1.0% | 15.3ms | 1.5% | 22.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:477` |
| 1.0% | 14.7ms | 1.0% | 14.7ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:443` |
| 1.0% | 14.3ms | 1.0% | 15.2ms | `forEach` | `[native code]` |
| 0.8% | 12.1ms | 0.8% | 12.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:573` |
| 0.8% | 12.1ms | 1.9% | 28.4ms | `map` | `[native code]` |
| 0.8% | 11.7ms | 0.8% | 11.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:571` |
| 0.8% | 11.4ms | 0.8% | 11.4ms | `every` | `[native code]` |
| 0.7% | 10.9ms | 0.7% | 10.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:532` |
| 0.6% | 9.2ms | 0.6% | 9.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:36` |
| 0.6% | 9.1ms | 100.0% | 1.42s | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.6% | 9.0ms | 0.6% | 9.0ms | `push` | `[native code]` |
| 0.6% | 8.8ms | 0.7% | 10.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:575` |
| 0.5% | 8.1ms | 0.5% | 8.1ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:437` |
| 0.5% | 7.7ms | 0.5% | 7.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:536` |
| 0.5% | 7.7ms | 2.1% | 31.2ms | `eval` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 0.5% | 7.6ms | 0.5% | 7.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:507` |
| 0.5% | 7.1ms | 6.3% | 90.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:473` |
| 0.4% | 6.9ms | 5.3% | 76.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:474` |
| 0.4% | 6.5ms | 0.4% | 6.5ms | `reconstructSymmetric2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 0.4% | 6.1ms | 2.6% | 38.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:559` |
| 0.3% | 5.4ms | 0.3% | 5.4ms | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 0.3% | 5.3ms | 0.3% | 5.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:569` |
| 0.3% | 5.3ms | 0.3% | 5.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:565` |
| 0.3% | 5.2ms | 0.3% | 5.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:523` |
| 0.3% | 5.2ms | 1.1% | 17.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:564` |
| 0.3% | 5.0ms | 0.3% | 5.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:525` |
| 0.3% | 4.8ms | 0.3% | 4.8ms | `eigen2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:126` |
| 0.3% | 4.7ms | 0.3% | 4.7ms | `reconstructSymmetric2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:139` |
| 0.3% | 4.7ms | 2.0% | 29.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:476` |
| 0.3% | 4.5ms | 0.3% | 5.4ms | `from` | `[native code]` |
| 0.2% | 4.2ms | 0.2% | 4.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:460` |
| 0.2% | 4.1ms | 0.3% | 4.8ms | `reconstructSymmetric2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:137` |
| 0.2% | 3.9ms | 0.2% | 3.9ms | `eigen2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:115` |
| 0.2% | 3.8ms | 0.2% | 3.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:516` |
| 0.2% | 3.8ms | 1.4% | 20.2ms | `anonymous` | `[native code]` |
| 0.2% | 3.7ms | 1.5% | 21.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:562` |
| 0.2% | 3.5ms | 11.0% | 157.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:490` |
| 0.2% | 3.3ms | 1.3% | 18.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:491` |
| 0.2% | 3.1ms | 0.2% | 3.1ms | `hypot` | `[native code]` |
| 0.2% | 3.0ms | 0.2% | 3.0ms | `eigen2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 0.2% | 3.0ms | 3.5% | 51.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:553` |
| 0.2% | 2.9ms | 0.2% | 2.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:566` |
| 0.2% | 2.9ms | 0.2% | 2.9ms | `eigen2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:130` |
| 0.1% | 2.6ms | 0.1% | 2.6ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:439` |
| 0.1% | 2.5ms | 0.2% | 3.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:556` |
| 0.1% | 2.3ms | 0.2% | 3.2ms | `CMAESOptimizer` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 0.1% | 2.2ms | 0.2% | 3.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:514` |
| 0.1% | 2.2ms | 0.6% | 9.0ms | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:36` |
| 0.1% | 2.2ms | 0.1% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:464` |
| 0.1% | 2.2ms | 0.1% | 2.2ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:438` |
| 0.1% | 2.2ms | 0.1% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:502` |
| 0.1% | 1.7ms | 0.2% | 3.4ms | `CMAESOptimizer` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:402` |
| 0.1% | 1.6ms | 0.1% | 1.6ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:436` |
| 0.1% | 1.6ms | 0.7% | 10.9ms | `eigen2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:94` |
| 0.1% | 1.6ms | 0.2% | 4.0ms | `reduce` | `[native code]` |
| 0.1% | 1.5ms | 0.1% | 1.5ms | `safeObjectiveValue` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 0.1% | 1.5ms | 0.1% | 1.5ms | `compose` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 0.1% | 1.5ms | 0.1% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:521` |
| 0.1% | 1.4ms | 0.2% | 4.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:562` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:442` |
| 0.0% | 1.4ms | 0.1% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:555` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:461` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `sampleGaussian` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:161` |
| 0.0% | 907us | 0.0% | 907us | `sqrt` | `[native code]` |
| 0.0% | 902us | 0.0% | 902us | `sampleGaussian2D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:166` |
| 0.0% | 893us | 0.0% | 893us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:416` |
| 0.0% | 869us | 0.0% | 869us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:432` |
| 0.0% | 863us | 0.0% | 863us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:496` |
| 0.0% | 860us | 0.0% | 860us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:22` |
| 0.0% | 860us | 0.0% | 860us | `eval` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:218` |
| 0.0% | 854us | 0.0% | 854us | `eigen2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:125` |
| 0.0% | 850us | 0.1% | 1.5ms | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:67` |
| 0.0% | 825us | 0.0% | 825us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 796us | 0.0% | 796us | `createSafeIterator` | `internal:primordials:3` |
| 0.0% | 746us | 0.0% | 746us | `CMAESOptimizer` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:364` |
| 0.0% | 740us | 0.0% | 740us | `min` | `[native code]` |
| 0.0% | 739us | 0.0% | 739us | `internal:streams/destroy` | `internal:streams/destroy:16` |
| 0.0% | 721us | 0.0% | 721us | `max` | `[native code]` |
| 0.0% | 699us | 0.0% | 699us | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:145` |
| 0.0% | 691us | 0.0% | 691us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 0.0% | 686us | 0.0% | 686us | `CMAESOptimizer` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:384` |
| 0.0% | 672us | 0.0% | 672us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:430` |
| 0.0% | 669us | 0.0% | 669us | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:63` |
| 0.0% | 658us | 0.0% | 658us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 0.0% | 653us | 0.0% | 653us | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:153` |
| 0.0% | 643us | 0.0% | 643us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:404` |
| 0.0% | 618us | 0.0% | 618us | `find` | `[native code]` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 100.0% | 1.42s | 0.6% | 9.1ms | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 18.2% | 260.2ms | 18.0% | 257.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:533` |
| 15.0% | 215.2ms | 2.3% | 33.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:468` |
| 11.4% | 163.6ms | 9.5% | 135.9ms | `sampleGaussian2D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 11.0% | 157.6ms | 0.2% | 3.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:490` |
| 10.7% | 154.1ms | 9.2% | 132.2ms | `sort` | `[native code]` |
| 8.8% | 126.4ms | 7.9% | 113.5ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 6.6% | 94.6ms | 4.2% | 61.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:475` |
| 6.3% | 90.6ms | 0.5% | 7.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:473` |
| 6.1% | 88.4ms | 6.1% | 88.4ms | `atan2` | `[native code]` |
| 5.3% | 76.0ms | 0.4% | 6.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:474` |
| 3.5% | 51.4ms | 0.2% | 3.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:553` |
| 3.3% | 48.0ms | 1.5% | 21.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:459` |
| 2.8% | 40.5ms | 2.8% | 40.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:480` |
| 2.6% | 38.1ms | 0.4% | 6.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:559` |
| 2.5% | 37.1ms | 1.3% | 19.9ms | `eigen2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:107` |
| 2.5% | 36.5ms | 2.5% | 36.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:479` |
| 2.1% | 31.2ms | 0.5% | 7.7ms | `eval` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 2.0% | 29.9ms | 0.3% | 4.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:476` |
| 1.9% | 28.4ms | 0.8% | 12.1ms | `map` | `[native code]` |
| 1.9% | 27.9ms | 1.9% | 27.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:467` |
| 1.5% | 22.8ms | 1.0% | 15.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:477` |
| 1.5% | 22.5ms | 1.5% | 22.5ms | `compose` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:121` |
| 1.5% | 22.5ms | 1.1% | 16.3ms | `sampleGaussian` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 1.5% | 21.9ms | 1.5% | 21.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:490` |
| 1.5% | 21.5ms | 0.2% | 3.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:562` |
| 1.4% | 20.2ms | 0.2% | 3.8ms | `anonymous` | `[native code]` |
| 1.3% | 19.6ms | 1.1% | 16.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:503` |
| 1.3% | 18.6ms | 0.2% | 3.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:491` |
| 1.2% | 17.7ms | 1.1% | 16.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:519` |
| 1.1% | 17.1ms | 0.3% | 5.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:564` |
| 1.1% | 16.8ms | 1.1% | 16.8ms | `sampleGaussian2D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:169` |
| 1.1% | 15.9ms | 0.0% | 0us | `eigen2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:128` |
| 1.0% | 15.2ms | 1.0% | 14.3ms | `forEach` | `[native code]` |
| 1.0% | 14.7ms | 1.0% | 14.7ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:443` |
| 0.8% | 12.1ms | 0.8% | 12.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:573` |
| 0.8% | 11.7ms | 0.8% | 11.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:571` |
| 0.8% | 11.4ms | 0.8% | 11.4ms | `every` | `[native code]` |
| 0.7% | 10.9ms | 0.7% | 10.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:532` |
| 0.7% | 10.9ms | 0.1% | 1.6ms | `eigen2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:94` |
| 0.7% | 10.4ms | 0.6% | 8.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:575` |
| 0.6% | 9.2ms | 0.6% | 9.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:36` |
| 0.6% | 9.0ms | 0.6% | 9.0ms | `push` | `[native code]` |
| 0.6% | 9.0ms | 0.1% | 2.2ms | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:36` |
| 0.5% | 8.1ms | 0.0% | 0us | `eigen2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:127` |
| 0.5% | 8.1ms | 0.5% | 8.1ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:437` |
| 0.5% | 7.7ms | 0.5% | 7.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:536` |
| 0.5% | 7.6ms | 0.5% | 7.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:507` |
| 0.4% | 6.5ms | 0.4% | 6.5ms | `reconstructSymmetric2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 0.3% | 5.4ms | 0.3% | 5.4ms | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 0.3% | 5.4ms | 0.3% | 4.5ms | `from` | `[native code]` |
| 0.3% | 5.3ms | 0.3% | 5.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:569` |
| 0.3% | 5.3ms | 0.3% | 5.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:565` |
| 0.3% | 5.3ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.3% | 5.2ms | 0.3% | 5.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:523` |
| 0.3% | 5.0ms | 0.3% | 5.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:525` |
| 0.3% | 4.8ms | 0.2% | 4.1ms | `reconstructSymmetric2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:137` |
| 0.3% | 4.8ms | 0.3% | 4.8ms | `eigen2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:126` |
| 0.3% | 4.7ms | 0.3% | 4.7ms | `reconstructSymmetric2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:139` |
| 0.2% | 4.2ms | 0.2% | 4.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:460` |
| 0.2% | 4.1ms | 0.1% | 1.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:562` |
| 0.2% | 4.0ms | 0.1% | 1.6ms | `reduce` | `[native code]` |
| 0.2% | 3.9ms | 0.2% | 3.9ms | `eigen2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:115` |
| 0.2% | 3.8ms | 0.2% | 3.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:516` |
| 0.2% | 3.6ms | 0.0% | 0us | `createIdentityMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:26` |
| 0.2% | 3.6ms | 0.0% | 0us | `CMAESOptimizer` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:397` |
| 0.2% | 3.4ms | 0.1% | 1.7ms | `CMAESOptimizer` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:402` |
| 0.2% | 3.2ms | 0.1% | 2.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:556` |
| 0.2% | 3.2ms | 0.1% | 2.3ms | `CMAESOptimizer` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 0.2% | 3.1ms | 0.1% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:514` |
| 0.2% | 3.1ms | 0.2% | 3.1ms | `hypot` | `[native code]` |
| 0.2% | 3.1ms | 0.0% | 0us | `eigen2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:99` |
| 0.2% | 3.0ms | 0.2% | 3.0ms | `eigen2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 0.2% | 2.9ms | 0.2% | 2.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:566` |
| 0.2% | 2.9ms | 0.2% | 2.9ms | `eigen2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:130` |
| 0.1% | 2.6ms | 0.1% | 2.6ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:439` |
| 0.1% | 2.5ms | 0.0% | 0us | `CMAESOptimizer` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:416` |
| 0.1% | 2.3ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.1% | 2.2ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.1% | 2.2ms | 0.1% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:521` |
| 0.1% | 2.2ms | 0.1% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:464` |
| 0.1% | 2.2ms | 0.1% | 2.2ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:438` |
| 0.1% | 2.2ms | 0.1% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:502` |
| 0.1% | 2.2ms | 0.0% | 0us | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:316` |
| 0.1% | 2.2ms | 0.0% | 0us | `CMAESOptimizer` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:371` |
| 0.1% | 2.1ms | 0.0% | 1.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:555` |
| 0.1% | 1.6ms | 0.1% | 1.6ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:436` |
| 0.1% | 1.6ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.1% | 1.5ms | 0.1% | 1.5ms | `safeObjectiveValue` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 0.1% | 1.5ms | 0.1% | 1.5ms | `compose` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 0.1% | 1.5ms | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.1% | 1.5ms | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.1% | 1.5ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.1% | 1.5ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.1% | 1.5ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.1% | 1.5ms | 0.0% | 850us | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:67` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:442` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:461` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `sampleGaussian` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:161` |
| 0.0% | 908us | 0.0% | 0us | `CMAESOptimizer` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:405` |
| 0.0% | 907us | 0.0% | 907us | `sqrt` | `[native code]` |
| 0.0% | 902us | 0.0% | 902us | `sampleGaussian2D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:166` |
| 0.0% | 893us | 0.0% | 893us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:416` |
| 0.0% | 869us | 0.0% | 0us | `CMAESOptimizer` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:432` |
| 0.0% | 869us | 0.0% | 869us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:432` |
| 0.0% | 863us | 0.0% | 863us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:496` |
| 0.0% | 860us | 0.0% | 860us | `eval` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:218` |
| 0.0% | 860us | 0.0% | 860us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:22` |
| 0.0% | 854us | 0.0% | 854us | `eigen2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:125` |
| 0.0% | 825us | 0.0% | 825us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 800us | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 796us | 0.0% | 0us | `internal:primordials` | `internal:primordials:51` |
| 0.0% | 796us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 796us | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 796us | 0.0% | 796us | `createSafeIterator` | `internal:primordials:3` |
| 0.0% | 796us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 746us | 0.0% | 746us | `CMAESOptimizer` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:364` |
| 0.0% | 740us | 0.0% | 740us | `min` | `[native code]` |
| 0.0% | 739us | 0.0% | 739us | `internal:streams/destroy` | `internal:streams/destroy:16` |
| 0.0% | 721us | 0.0% | 721us | `max` | `[native code]` |
| 0.0% | 699us | 0.0% | 0us | `sampleGaussian` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:159` |
| 0.0% | 699us | 0.0% | 699us | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:145` |
| 0.0% | 691us | 0.0% | 691us | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 0.0% | 686us | 0.0% | 686us | `CMAESOptimizer` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:384` |
| 0.0% | 672us | 0.0% | 672us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:430` |
| 0.0% | 672us | 0.0% | 0us | `CMAESOptimizer` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:428` |
| 0.0% | 669us | 0.0% | 669us | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:63` |
| 0.0% | 658us | 0.0% | 658us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 0.0% | 653us | 0.0% | 0us | `sampleGaussian` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:160` |
| 0.0% | 653us | 0.0% | 653us | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:153` |
| 0.0% | 643us | 0.0% | 0us | `CMAESOptimizer` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:404` |
| 0.0% | 643us | 0.0% | 643us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:404` |
| 0.0% | 618us | 0.0% | 618us | `find` | `[native code]` |

## Function Details

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:533` | Self: 18.0% (257.9ms) | Total: 18.2% (260.2ms) | Samples: 328

**Called by:**
- `(module)` (331)

**Calls:**
- `adaptationPoint` (3)

### `sampleGaussian2D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` | Self: 9.5% (135.9ms) | Total: 11.4% (163.6ms) | Samples: 171

**Called by:**
- `step` (208)

**Calls:**
- `atan2` (37)

### `sort`
`[native code]` | Self: 9.2% (132.2ms) | Total: 10.7% (154.1ms) | Samples: 168

**Called by:**
- `step` (195)

**Calls:**
- `(anonymous)` (27)

### `repair`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` | Self: 7.9% (113.5ms) | Total: 8.8% (126.4ms) | Samples: 139

**Called by:**
- `step` (88)
- `step` (68)

**Calls:**
- `atan2` (17)

### `atan2`
`[native code]` | Self: 6.1% (88.4ms) | Total: 6.1% (88.4ms) | Samples: 114

**Called by:**
- `sampleGaussian2D` (37)
- `eval` (31)
- `eigen2x2` (21)
- `repair` (17)
- `sampleGaussian` (7)
- `reconstructSymmetric2x2` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:475` | Self: 4.2% (61.0ms) | Total: 6.6% (94.6ms) | Samples: 78

**Called by:**
- `(module)` (123)

**Calls:**
- `eval` (42)
- `safeObjectiveValue` (2)
- `eval` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:480` | Self: 2.8% (40.5ms) | Total: 2.8% (40.5ms) | Samples: 52

**Called by:**
- `(module)` (52)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:479` | Self: 2.5% (36.5ms) | Total: 2.5% (36.5ms) | Samples: 47

**Called by:**
- `(module)` (47)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:468` | Self: 2.3% (33.8ms) | Total: 15.0% (215.2ms) | Samples: 44

**Called by:**
- `(module)` (275)

**Calls:**
- `sampleGaussian2D` (208)
- `sampleGaussian2D` (22)
- `sampleGaussian2D` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:467` | Self: 1.9% (27.9ms) | Total: 1.9% (27.9ms) | Samples: 36

**Called by:**
- `(module)` (36)

### `compose`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:121` | Self: 1.5% (22.5ms) | Total: 1.5% (22.5ms) | Samples: 25

**Called by:**
- `eigen2x2` (14)
- `eigen2x2` (11)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:459` | Self: 1.5% (21.9ms) | Total: 3.3% (48.0ms) | Samples: 29

**Called by:**
- `(module)` (61)

**Calls:**
- `eigen2x2` (9)
- `eigen2x2` (5)
- `eigen2x2` (4)
- `eigen2x2` (4)
- `eigen2x2` (3)
- `eigen2x2` (3)
- `eigen2x2` (2)
- `eigen2x2` (1)
- `eigen2x2` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:490` | Self: 1.5% (21.9ms) | Total: 1.5% (21.9ms) | Samples: 27

**Called by:**
- `sort` (27)

### `eigen2x2`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:107` | Self: 1.3% (19.9ms) | Total: 2.5% (37.1ms) | Samples: 26

**Called by:**
- `step` (20)
- `step` (18)
- `step` (9)

**Calls:**
- `atan2` (21)

### `sampleGaussian2D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:169` | Self: 1.1% (16.8ms) | Total: 1.1% (16.8ms) | Samples: 22

**Called by:**
- `step` (22)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:503` | Self: 1.1% (16.5ms) | Total: 1.3% (19.6ms) | Samples: 21

**Called by:**
- `(module)` (25)

**Calls:**
- `adaptationPoint` (4)

### `sampleGaussian`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` | Self: 1.1% (16.3ms) | Total: 1.5% (22.5ms) | Samples: 21

**Called by:**
- `step` (28)

**Calls:**
- `atan2` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:519` | Self: 1.1% (16.1ms) | Total: 1.2% (17.7ms) | Samples: 21

**Called by:**
- `(module)` (23)

**Calls:**
- `vecNorm` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:477` | Self: 1.0% (15.3ms) | Total: 1.5% (22.8ms) | Samples: 20

**Called by:**
- `(module)` (28)

**Calls:**
- `push` (8)

### `repair`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:443` | Self: 1.0% (14.7ms) | Total: 1.0% (14.7ms) | Samples: 4

**Called by:**
- `step` (3)
- `step` (1)

### `forEach`
`[native code]` | Self: 1.0% (14.3ms) | Total: 1.0% (15.2ms) | Samples: 18

**Called by:**
- `step` (19)

**Calls:**
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:573` | Self: 0.8% (12.1ms) | Total: 0.8% (12.1ms) | Samples: 16

**Called by:**
- `(module)` (16)

### `map`
`[native code]` | Self: 0.8% (12.1ms) | Total: 1.9% (28.4ms) | Samples: 16

**Called by:**
- `step` (24)
- `cloneMatrix` (8)
- `step` (3)
- `CMAESOptimizer` (1)
- `CMAESOptimizer` (1)

**Calls:**
- `(anonymous)` (11)
- `(anonymous)` (6)
- `repair` (3)
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:571` | Self: 0.8% (11.7ms) | Total: 0.8% (11.7ms) | Samples: 15

**Called by:**
- `(module)` (15)

### `every`
`[native code]` | Self: 0.8% (11.4ms) | Total: 0.8% (11.4ms) | Samples: 15

**Called by:**
- `eigen2x2` (12)
- `requireFiniteVector` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:532` | Self: 0.7% (10.9ms) | Total: 0.7% (10.9ms) | Samples: 15

**Called by:**
- `(module)` (15)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:36` | Self: 0.6% (9.2ms) | Total: 0.6% (9.2ms) | Samples: 11

**Called by:**
- `map` (11)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 0.6% (9.1ms) | Total: 100.0% (1.42s) | Samples: 11

**Calls:**
- `step` (331)
- `step` (275)
- `step` (200)
- `step` (123)
- `step` (103)
- `step` (89)
- `step` (62)
- `step` (61)
- `step` (52)
- `step` (48)
- `step` (47)
- `step` (38)
- `step` (36)
- `step` (29)
- `step` (28)
- `step` (25)
- `step` (23)
- `step` (23)
- `step` (22)
- `step` (16)
- `step` (15)
- `step` (15)
- `step` (14)
- `step` (11)
- `step` (10)
- `step` (7)
- `(anonymous)` (7)
- `step` (7)
- `step` (7)
- `step` (6)
- `step` (6)
- `CMAESOptimizer` (5)
- `step` (5)
- `CMAESOptimizer` (4)
- `step` (4)
- `CMAESOptimizer` (4)
- `step` (4)
- `CMAESOptimizer` (3)
- `step` (3)
- `CMAESOptimizer` (3)
- `step` (3)
- `step` (3)
- `step` (3)
- `step` (3)
- `step` (2)
- `CMAESOptimizer` (1)
- `step` (1)
- `CMAESOptimizer` (1)
- `CMAESOptimizer` (1)
- `CMAESOptimizer` (1)
- `CMAESOptimizer` (1)
- `CMAESOptimizer` (1)
- `find` (1)

### `push`
`[native code]` | Self: 0.6% (9.0ms) | Total: 0.6% (9.0ms) | Samples: 10

**Called by:**
- `step` (8)
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:575` | Self: 0.6% (8.8ms) | Total: 0.7% (10.4ms) | Samples: 12

**Called by:**
- `(module)` (14)

**Calls:**
- `push` (2)

### `repair`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:437` | Self: 0.5% (8.1ms) | Total: 0.5% (8.1ms) | Samples: 9

**Called by:**
- `step` (5)
- `step` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:536` | Self: 0.5% (7.7ms) | Total: 0.5% (7.7ms) | Samples: 10

**Called by:**
- `(module)` (10)

### `eval`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` | Self: 0.5% (7.7ms) | Total: 2.1% (31.2ms) | Samples: 11

**Called by:**
- `step` (42)

**Calls:**
- `atan2` (31)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:507` | Self: 0.5% (7.6ms) | Total: 0.5% (7.6ms) | Samples: 11

**Called by:**
- `(module)` (11)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:473` | Self: 0.5% (7.1ms) | Total: 6.3% (90.6ms) | Samples: 10

**Called by:**
- `(module)` (103)

**Calls:**
- `repair` (88)
- `repair` (4)
- `repair` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:474` | Self: 0.4% (6.9ms) | Total: 5.3% (76.0ms) | Samples: 9

**Called by:**
- `(module)` (89)

**Calls:**
- `repair` (68)
- `repair` (5)
- `repair` (3)
- `repair` (2)
- `repair` (2)

### `reconstructSymmetric2x2`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` | Self: 0.4% (6.5ms) | Total: 0.4% (6.5ms) | Samples: 8

**Called by:**
- `step` (8)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:559` | Self: 0.4% (6.1ms) | Total: 2.6% (38.1ms) | Samples: 8

**Called by:**
- `(module)` (48)

**Calls:**
- `eigen2x2` (18)
- `eigen2x2` (7)
- `eigen2x2` (5)
- `eigen2x2` (4)
- `eigen2x2` (3)
- `eigen2x2` (1)
- `eigen2x2` (1)
- `eigen2x2` (1)

### `adaptationPoint`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` | Self: 0.3% (5.4ms) | Total: 0.3% (5.4ms) | Samples: 7

**Called by:**
- `step` (4)
- `step` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:569` | Self: 0.3% (5.3ms) | Total: 0.3% (5.3ms) | Samples: 7

**Called by:**
- `(module)` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:565` | Self: 0.3% (5.3ms) | Total: 0.3% (5.3ms) | Samples: 7

**Called by:**
- `(module)` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:523` | Self: 0.3% (5.2ms) | Total: 0.3% (5.2ms) | Samples: 7

**Called by:**
- `(module)` (7)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:564` | Self: 0.3% (5.2ms) | Total: 1.1% (17.1ms) | Samples: 7

**Called by:**
- `(module)` (22)

**Calls:**
- `cloneMatrix` (11)
- `map` (3)
- `cloneMatrix` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:525` | Self: 0.3% (5.0ms) | Total: 0.3% (5.0ms) | Samples: 6

**Called by:**
- `(module)` (6)

### `eigen2x2`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:126` | Self: 0.3% (4.8ms) | Total: 0.3% (4.8ms) | Samples: 6

**Called by:**
- `step` (3)
- `step` (2)
- `step` (1)

### `reconstructSymmetric2x2`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:139` | Self: 0.3% (4.7ms) | Total: 0.3% (4.7ms) | Samples: 6

**Called by:**
- `step` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:476` | Self: 0.3% (4.7ms) | Total: 2.0% (29.9ms) | Samples: 6

**Called by:**
- `(module)` (38)

**Calls:**
- `sampleGaussian` (28)
- `sampleGaussian` (2)
- `sampleGaussian` (1)
- `sampleGaussian` (1)

### `from`
`[native code]` | Self: 0.3% (4.5ms) | Total: 0.3% (5.4ms) | Samples: 6

**Called by:**
- `createIdentityMatrix` (5)
- `CMAESOptimizer` (2)

**Calls:**
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:460` | Self: 0.2% (4.2ms) | Total: 0.2% (4.2ms) | Samples: 6

**Called by:**
- `(module)` (6)

### `reconstructSymmetric2x2`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:137` | Self: 0.2% (4.1ms) | Total: 0.3% (4.8ms) | Samples: 5

**Called by:**
- `step` (5)
- `step` (1)

**Calls:**
- `atan2` (1)

### `eigen2x2`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:115` | Self: 0.2% (3.9ms) | Total: 0.2% (3.9ms) | Samples: 5

**Called by:**
- `step` (3)
- `step` (1)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:516` | Self: 0.2% (3.8ms) | Total: 0.2% (3.8ms) | Samples: 5

**Called by:**
- `(module)` (5)

### `anonymous`
`[native code]` | Self: 0.2% (3.8ms) | Total: 1.4% (20.2ms) | Samples: 5

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
- `internal:streams/destroy` (1)
- `internal:shared` (1)
- `internal:streams/duplex` (1)
- `internal:primordials` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:562` | Self: 0.2% (3.7ms) | Total: 1.5% (21.5ms) | Samples: 5

**Called by:**
- `(module)` (29)

**Calls:**
- `map` (24)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:490` | Self: 0.2% (3.5ms) | Total: 11.0% (157.6ms) | Samples: 5

**Called by:**
- `(module)` (200)

**Calls:**
- `sort` (195)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:491` | Self: 0.2% (3.3ms) | Total: 1.3% (18.6ms) | Samples: 4

**Called by:**
- `(module)` (23)

**Calls:**
- `forEach` (19)

### `hypot`
`[native code]` | Self: 0.2% (3.1ms) | Total: 0.2% (3.1ms) | Samples: 3

**Called by:**
- `eigen2x2` (3)

### `eigen2x2`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` | Self: 0.2% (3.0ms) | Total: 0.2% (3.0ms) | Samples: 4

**Called by:**
- `step` (3)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:553` | Self: 0.2% (3.0ms) | Total: 3.5% (51.4ms) | Samples: 4

**Called by:**
- `(module)` (62)

**Calls:**
- `eigen2x2` (20)
- `reconstructSymmetric2x2` (8)
- `eigen2x2` (6)
- `reconstructSymmetric2x2` (6)
- `reconstructSymmetric2x2` (5)
- `eigen2x2` (4)
- `eigen2x2` (3)
- `eigen2x2` (3)
- `eigen2x2` (1)
- `eigen2x2` (1)
- `eigen2x2` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:566` | Self: 0.2% (2.9ms) | Total: 0.2% (2.9ms) | Samples: 3

**Called by:**
- `(module)` (3)

### `eigen2x2`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:130` | Self: 0.2% (2.9ms) | Total: 0.2% (2.9ms) | Samples: 4

**Called by:**
- `step` (4)

### `repair`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:439` | Self: 0.1% (2.6ms) | Total: 0.1% (2.6ms) | Samples: 4

**Called by:**
- `(anonymous)` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:556` | Self: 0.1% (2.5ms) | Total: 0.2% (3.2ms) | Samples: 3

**Called by:**
- `(module)` (4)

**Calls:**
- `min` (1)

### `CMAESOptimizer`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` | Self: 0.1% (2.3ms) | Total: 0.2% (3.2ms) | Samples: 3

**Called by:**
- `(module)` (4)

**Calls:**
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:514` | Self: 0.1% (2.2ms) | Total: 0.2% (3.1ms) | Samples: 3

**Called by:**
- `(module)` (4)

**Calls:**
- `sqrt` (1)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:36` | Self: 0.1% (2.2ms) | Total: 0.6% (9.0ms) | Samples: 3

**Called by:**
- `step` (11)

**Calls:**
- `map` (8)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:464` | Self: 0.1% (2.2ms) | Total: 0.1% (2.2ms) | Samples: 3

**Called by:**
- `(module)` (3)

### `repair`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:438` | Self: 0.1% (2.2ms) | Total: 0.1% (2.2ms) | Samples: 3

**Called by:**
- `map` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:502` | Self: 0.1% (2.2ms) | Total: 0.1% (2.2ms) | Samples: 3

**Called by:**
- `(module)` (3)

### `CMAESOptimizer`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:402` | Self: 0.1% (1.7ms) | Total: 0.2% (3.4ms) | Samples: 2

**Called by:**
- `(module)` (4)

**Calls:**
- `from` (2)

### `repair`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:436` | Self: 0.1% (1.6ms) | Total: 0.1% (1.6ms) | Samples: 2

**Called by:**
- `step` (2)

### `eigen2x2`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:94` | Self: 0.1% (1.6ms) | Total: 0.7% (10.9ms) | Samples: 2

**Called by:**
- `step` (7)
- `step` (4)
- `step` (3)

**Calls:**
- `every` (12)

### `reduce`
`[native code]` | Self: 0.1% (1.6ms) | Total: 0.2% (4.0ms) | Samples: 2

**Called by:**
- `CMAESOptimizer` (3)
- `CMAESOptimizer` (1)
- `CMAESOptimizer` (1)

**Calls:**
- `(anonymous)` (1)
- `(anonymous)` (1)
- `(anonymous)` (1)

### `safeObjectiveValue`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` | Self: 0.1% (1.5ms) | Total: 0.1% (1.5ms) | Samples: 2

**Called by:**
- `step` (2)

### `compose`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` | Self: 0.1% (1.5ms) | Total: 0.1% (1.5ms) | Samples: 2

**Called by:**
- `eigen2x2` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:521` | Self: 0.1% (1.5ms) | Total: 0.1% (2.2ms) | Samples: 2

**Called by:**
- `(module)` (3)

**Calls:**
- `max` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:562` | Self: 0.1% (1.4ms) | Total: 0.2% (4.1ms) | Samples: 2

**Called by:**
- `map` (6)

**Calls:**
- `repair` (4)

### `repair`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:442` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:555` | Self: 0.0% (1.4ms) | Total: 0.1% (2.1ms) | Samples: 2

**Called by:**
- `(module)` (3)

**Calls:**
- `reconstructSymmetric2x2` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:461` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `(module)` (2)

### `sampleGaussian`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:161` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `step` (2)

### `sqrt`
`[native code]` | Self: 0.0% (907us) | Total: 0.0% (907us) | Samples: 1

**Called by:**
- `step` (1)

### `sampleGaussian2D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:166` | Self: 0.0% (902us) | Total: 0.0% (902us) | Samples: 1

**Called by:**
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:416` | Self: 0.0% (893us) | Total: 0.0% (893us) | Samples: 1

**Called by:**
- `reduce` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:432` | Self: 0.0% (869us) | Total: 0.0% (869us) | Samples: 1

**Called by:**
- `reduce` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:496` | Self: 0.0% (863us) | Total: 0.0% (863us) | Samples: 1

**Called by:**
- `forEach` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:22` | Self: 0.0% (860us) | Total: 0.0% (860us) | Samples: 1

**Called by:**
- `from` (1)

### `eval`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:218` | Self: 0.0% (860us) | Total: 0.0% (860us) | Samples: 1

**Called by:**
- `step` (1)

### `eigen2x2`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:125` | Self: 0.0% (854us) | Total: 0.0% (854us) | Samples: 1

**Called by:**
- `step` (1)

### `vecNorm`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:67` | Self: 0.0% (850us) | Total: 0.1% (1.5ms) | Samples: 1

**Called by:**
- `step` (2)

**Calls:**
- `vecDot` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 0.0% (825us) | Total: 0.0% (825us) | Samples: 1

**Called by:**
- `CMAESOptimizer` (1)

### `createSafeIterator`
`internal:primordials:3` | Self: 0.0% (796us) | Total: 0.0% (796us) | Samples: 1

**Called by:**
- `internal:primordials` (1)

### `CMAESOptimizer`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:364` | Self: 0.0% (746us) | Total: 0.0% (746us) | Samples: 1

**Called by:**
- `(module)` (1)

### `min`
`[native code]` | Self: 0.0% (740us) | Total: 0.0% (740us) | Samples: 1

**Called by:**
- `step` (1)

### `internal:streams/destroy`
`internal:streams/destroy:16` | Self: 0.0% (739us) | Total: 0.0% (739us) | Samples: 1

**Called by:**
- `anonymous` (1)

### `max`
`[native code]` | Self: 0.0% (721us) | Total: 0.0% (721us) | Samples: 1

**Called by:**
- `step` (1)

### `nextOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:145` | Self: 0.0% (699us) | Total: 0.0% (699us) | Samples: 1

**Called by:**
- `sampleGaussian` (1)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` | Self: 0.0% (691us) | Total: 0.0% (691us) | Samples: 1

**Called by:**
- `step` (1)

### `CMAESOptimizer`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:384` | Self: 0.0% (686us) | Total: 0.0% (686us) | Samples: 1

**Called by:**
- `(module)` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:430` | Self: 0.0% (672us) | Total: 0.0% (672us) | Samples: 1

**Called by:**
- `map` (1)

### `vecDot`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:63` | Self: 0.0% (669us) | Total: 0.0% (669us) | Samples: 1

**Called by:**
- `vecNorm` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` | Self: 0.0% (658us) | Total: 0.0% (658us) | Samples: 1

**Called by:**
- `(module)` (1)

### `nextHalfOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:153` | Self: 0.0% (653us) | Total: 0.0% (653us) | Samples: 1

**Called by:**
- `sampleGaussian` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:404` | Self: 0.0% (643us) | Total: 0.0% (643us) | Samples: 1

**Called by:**
- `reduce` (1)

### `find`
`[native code]` | Self: 0.0% (618us) | Total: 0.0% (618us) | Samples: 1

**Called by:**
- `(module)` (1)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.3% (5.3ms) | Samples: 0

**Called by:**
- `(module)` (7)

**Calls:**
- `anonymous` (4)
- `get WriteStream` (3)

### `createIdentityMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:26` | Self: 0.0% (0us) | Total: 0.2% (3.6ms) | Samples: 0

**Called by:**
- `CMAESOptimizer` (5)

**Calls:**
- `from` (5)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (796us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `CMAESOptimizer`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:371` | Self: 0.0% (0us) | Total: 0.1% (2.2ms) | Samples: 0

**Called by:**
- `(module)` (3)

**Calls:**
- `requireFiniteVector` (3)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (796us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (800us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `eigen2x2`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:128` | Self: 0.0% (0us) | Total: 1.1% (15.9ms) | Samples: 0

**Called by:**
- `step` (6)
- `step` (5)
- `step` (5)

**Calls:**
- `compose` (14)
- `compose` (2)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (796us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `eigen2x2`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:127` | Self: 0.0% (0us) | Total: 0.5% (8.1ms) | Samples: 0

**Called by:**
- `step` (4)
- `step` (4)
- `step` (3)

**Calls:**
- `compose` (11)

### `CMAESOptimizer`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:405` | Self: 0.0% (0us) | Total: 0.0% (908us) | Samples: 0

**Called by:**
- `(module)` (1)

**Calls:**
- `map` (1)

### `requireFiniteVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:316` | Self: 0.0% (0us) | Total: 0.1% (2.2ms) | Samples: 0

**Called by:**
- `CMAESOptimizer` (3)

**Calls:**
- `every` (3)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.1% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.1% (1.5ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.1% (1.5ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `CMAESOptimizer`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:432` | Self: 0.0% (0us) | Total: 0.0% (869us) | Samples: 0

**Called by:**
- `(module)` (1)

**Calls:**
- `reduce` (1)

### `sampleGaussian`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:160` | Self: 0.0% (0us) | Total: 0.0% (653us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `nextHalfOpenUnit` (1)

### `CMAESOptimizer`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:397` | Self: 0.0% (0us) | Total: 0.2% (3.6ms) | Samples: 0

**Called by:**
- `(module)` (5)

**Calls:**
- `createIdentityMatrix` (5)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.1% (1.5ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.1% (2.2ms) | Samples: 0

**Called by:**
- `(anonymous)` (3)

**Calls:**
- `anonymous` (3)

### `CMAESOptimizer`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:428` | Self: 0.0% (0us) | Total: 0.0% (672us) | Samples: 0

**Called by:**
- `(module)` (1)

**Calls:**
- `map` (1)

### `CMAESOptimizer`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:416` | Self: 0.0% (0us) | Total: 0.1% (2.5ms) | Samples: 0

**Called by:**
- `(module)` (3)

**Calls:**
- `reduce` (3)

### `eigen2x2`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:99` | Self: 0.0% (0us) | Total: 0.2% (3.1ms) | Samples: 0

**Called by:**
- `step` (1)
- `step` (1)
- `step` (1)

**Calls:**
- `hypot` (3)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.1% (1.5ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.1% (1.5ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `CMAESOptimizer`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:404` | Self: 0.0% (0us) | Total: 0.0% (643us) | Samples: 0

**Called by:**
- `(module)` (1)

**Calls:**
- `reduce` (1)

### `sampleGaussian`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:159` | Self: 0.0% (0us) | Total: 0.0% (699us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `nextOpenUnit` (1)

### `internal:primordials`
`internal:primordials:51` | Self: 0.0% (0us) | Total: 0.0% (796us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `createSafeIterator` (1)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.1% (2.3ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 79.3% | 1.13s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 19.8% | 283.7ms | `[native code]` |
| 0.6% | 9.9ms | `/Users/jemanuel/projects/cmaes_explainer/[eval]` |
| 0.0% | 796us | `internal:primordials` |
| 0.0% | 739us | `internal:streams/destroy` |
