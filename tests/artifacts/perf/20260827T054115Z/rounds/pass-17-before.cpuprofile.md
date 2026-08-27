# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 1.95s | 2452 | 500us | 154 |

**Top 10:** `step` 13.2%, `sampleGaussian2D` 8.2%, `sort` 8.1%, `step` 7.1%, `atan2` 5.3%, `step` 4.9%, `step` 4.0%, `step` 2.9%, `repair` 2.6%, `step` 2.6%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 13.2% | 258.2ms | 13.3% | 260.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:531` |
| 8.2% | 161.2ms | 10.0% | 196.5ms | `sampleGaussian2D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 8.1% | 158.5ms | 9.1% | 179.3ms | `sort` | `[native code]` |
| 7.1% | 140.5ms | 18.7% | 366.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:468` |
| 5.3% | 104.9ms | 5.3% | 104.9ms | `atan2` | `[native code]` |
| 4.9% | 97.2ms | 7.0% | 137.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:473` |
| 4.0% | 78.5ms | 4.0% | 78.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:479` |
| 2.9% | 57.7ms | 3.0% | 58.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:477` |
| 2.6% | 52.5ms | 3.7% | 73.7ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 2.6% | 52.4ms | 2.7% | 53.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:478` |
| 1.9% | 38.6ms | 2.8% | 55.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:475` |
| 1.7% | 35.0ms | 4.7% | 93.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:459` |
| 1.6% | 33.0ms | 1.8% | 36.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:501` |
| 1.5% | 30.8ms | 1.5% | 30.8ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:436` |
| 1.5% | 30.8ms | 1.5% | 30.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:500` |
| 1.5% | 29.5ms | 1.7% | 33.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:517` |
| 1.3% | 26.7ms | 1.4% | 27.5ms | `every` | `[native code]` |
| 1.3% | 25.4ms | 1.3% | 25.4ms | `sampleGaussian2D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:169` |
| 1.2% | 25.0ms | 2.3% | 45.2ms | `eigen2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:107` |
| 1.2% | 24.1ms | 2.5% | 50.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:474` |
| 1.0% | 21.0ms | 1.0% | 21.0ms | `compose` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:121` |
| 1.0% | 20.7ms | 1.0% | 20.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:488` |
| 1.0% | 20.1ms | 1.2% | 24.3ms | `sampleGaussian` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 0.9% | 19.1ms | 0.9% | 19.1ms | `push` | `[native code]` |
| 0.8% | 16.1ms | 3.6% | 70.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:472` |
| 0.8% | 16.0ms | 0.8% | 16.0ms | `eigen2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:126` |
| 0.7% | 14.8ms | 0.7% | 14.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:36` |
| 0.7% | 14.3ms | 0.7% | 15.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:467` |
| 0.7% | 14.2ms | 1.8% | 36.7ms | `eval` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 0.6% | 13.2ms | 0.6% | 13.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:530` |
| 0.6% | 12.4ms | 3.6% | 70.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:471` |
| 0.6% | 11.9ms | 0.6% | 11.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:569` |
| 0.5% | 11.3ms | 0.6% | 13.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:573` |
| 0.4% | 9.3ms | 2.0% | 41.0ms | `map` | `[native code]` |
| 0.4% | 8.7ms | 100.0% | 1.95s | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.4% | 8.7ms | 0.4% | 8.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:534` |
| 0.4% | 8.6ms | 0.4% | 8.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:505` |
| 0.4% | 8.5ms | 0.5% | 11.6ms | `forEach` | `[native code]` |
| 0.4% | 8.2ms | 0.4% | 9.1ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:439` |
| 0.4% | 8.1ms | 0.4% | 8.1ms | `reconstructSymmetric2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 0.4% | 8.0ms | 0.4% | 8.0ms | `eigen2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:125` |
| 0.4% | 7.9ms | 2.1% | 42.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:557` |
| 0.4% | 7.9ms | 0.4% | 7.9ms | `reconstructSymmetric2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:139` |
| 0.4% | 7.9ms | 0.4% | 9.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:521` |
| 0.3% | 7.7ms | 0.3% | 7.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:564` |
| 0.3% | 7.1ms | 0.3% | 7.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:460` |
| 0.3% | 7.1ms | 1.6% | 32.3ms | `eigen2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:94` |
| 0.3% | 7.0ms | 0.9% | 18.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:489` |
| 0.3% | 6.2ms | 0.3% | 6.2ms | `eigen2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:115` |
| 0.3% | 6.1ms | 0.3% | 6.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:563` |
| 0.3% | 6.0ms | 0.5% | 10.0ms | `from` | `[native code]` |
| 0.2% | 5.7ms | 0.2% | 5.7ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:437` |
| 0.2% | 5.4ms | 0.2% | 5.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:464` |
| 0.2% | 4.7ms | 0.2% | 4.7ms | `eigen2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 0.2% | 4.6ms | 0.2% | 4.6ms | `CMAESOptimizer` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 0.2% | 4.6ms | 0.2% | 4.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:567` |
| 0.2% | 4.5ms | 1.1% | 22.2ms | `anonymous` | `[native code]` |
| 0.2% | 4.5ms | 0.6% | 12.5ms | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:36` |
| 0.2% | 4.5ms | 0.2% | 5.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:512` |
| 0.2% | 4.4ms | 0.2% | 4.4ms | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 0.2% | 4.0ms | 1.3% | 25.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:562` |
| 0.1% | 3.7ms | 0.1% | 3.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:523` |
| 0.1% | 3.7ms | 0.1% | 3.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:519` |
| 0.1% | 3.6ms | 0.1% | 3.6ms | `sampleGaussian2D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:164` |
| 0.1% | 3.6ms | 0.1% | 3.6ms | `eigen2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:130` |
| 0.1% | 3.5ms | 3.6% | 71.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:551` |
| 0.1% | 3.3ms | 0.1% | 3.3ms | `hypot` | `[native code]` |
| 0.1% | 3.2ms | 9.3% | 182.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:488` |
| 0.1% | 3.2ms | 0.1% | 3.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:571` |
| 0.1% | 3.0ms | 0.3% | 6.4ms | `eigen2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:99` |
| 0.1% | 3.0ms | 0.1% | 3.0ms | `sqrt` | `[native code]` |
| 0.1% | 2.9ms | 1.2% | 25.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:560` |
| 0.1% | 2.7ms | 0.1% | 2.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:461` |
| 0.1% | 2.6ms | 0.1% | 2.6ms | `safeObjectiveValue` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:322` |
| 0.1% | 2.5ms | 0.1% | 2.5ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:438` |
| 0.1% | 2.3ms | 0.1% | 2.3ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:443` |
| 0.1% | 2.3ms | 0.1% | 2.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:494` |
| 0.1% | 2.3ms | 0.1% | 2.3ms | `fill` | `[native code]` |
| 0.1% | 2.3ms | 0.1% | 2.3ms | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 0.1% | 2.2ms | 0.2% | 4.6ms | `reduce` | `[native code]` |
| 0.1% | 2.2ms | 0.1% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:514` |
| 0.1% | 2.1ms | 0.5% | 11.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:560` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `eval` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:218` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:402` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:430` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `exp` | `[native code]` |
| 0.0% | 1.5ms | 0.2% | 3.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:553` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:63` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:405` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `CMAESOptimizer` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:364` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `min` | `[native code]` |
| 0.0% | 1.4ms | 0.1% | 2.9ms | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:67` |
| 0.0% | 1.3ms | 0.1% | 2.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:518` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `sampleGaussian` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:161` |
| 0.0% | 903us | 0.0% | 903us | `(unknown)` | `[native code]` |
| 0.0% | 893us | 0.0% | 893us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:416` |
| 0.0% | 891us | 0.0% | 891us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 0.0% | 887us | 0.0% | 887us | `WritableState` | `internal:streams/writable` |
| 0.0% | 881us | 0.0% | 881us | `bound call` | `[native code]` |
| 0.0% | 873us | 0.0% | 873us | `filter` | `[native code]` |
| 0.0% | 855us | 0.0% | 855us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:404` |
| 0.0% | 845us | 0.1% | 3.1ms | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:316` |
| 0.0% | 840us | 0.0% | 840us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:550` |
| 0.0% | 818us | 0.2% | 3.9ms | `CMAESOptimizer` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:371` |
| 0.0% | 803us | 0.0% | 803us | `reconstructSymmetric2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:138` |
| 0.0% | 758us | 0.0% | 758us | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 0.0% | 742us | 0.0% | 742us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:490` |
| 0.0% | 737us | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:554` |
| 0.0% | 696us | 0.0% | 696us | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:153` |
| 0.0% | 687us | 0.0% | 687us | `safeObjectiveValue` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:325` |
| 0.0% | 684us | 0.0% | 684us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:22` |
| 0.0% | 680us | 0.0% | 680us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:565` |
| 0.0% | 676us | 0.3% | 7.4ms | `CMAESOptimizer` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:397` |
| 0.0% | 659us | 0.0% | 659us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:417` |
| 0.0% | 657us | 0.0% | 1.3ms | `CMAESOptimizer` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:417` |
| 0.0% | 639us | 0.0% | 639us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:455` |
| 0.0% | 638us | 0.0% | 638us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:537` |
| 0.0% | 625us | 0.0% | 625us | `eval` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:232` |
| 0.0% | 622us | 0.3% | 6.8ms | `createIdentityMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:26` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 100.0% | 1.95s | 0.4% | 8.7ms | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 18.7% | 366.2ms | 7.1% | 140.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:468` |
| 13.3% | 260.3ms | 13.2% | 258.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:531` |
| 10.0% | 196.5ms | 8.2% | 161.2ms | `sampleGaussian2D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 9.3% | 182.6ms | 0.1% | 3.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:488` |
| 9.1% | 179.3ms | 8.1% | 158.5ms | `sort` | `[native code]` |
| 7.0% | 137.8ms | 4.9% | 97.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:473` |
| 5.3% | 104.9ms | 5.3% | 104.9ms | `atan2` | `[native code]` |
| 4.7% | 93.4ms | 1.7% | 35.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:459` |
| 4.0% | 78.5ms | 4.0% | 78.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:479` |
| 3.7% | 73.7ms | 2.6% | 52.5ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 3.6% | 71.5ms | 0.1% | 3.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:551` |
| 3.6% | 70.9ms | 0.6% | 12.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:471` |
| 3.6% | 70.3ms | 0.8% | 16.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:472` |
| 3.0% | 58.6ms | 2.9% | 57.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:477` |
| 2.8% | 55.1ms | 1.9% | 38.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:475` |
| 2.7% | 53.3ms | 2.6% | 52.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:478` |
| 2.5% | 50.4ms | 1.2% | 24.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:474` |
| 2.3% | 45.2ms | 1.2% | 25.0ms | `eigen2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:107` |
| 2.1% | 42.3ms | 0.4% | 7.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:557` |
| 2.0% | 41.0ms | 0.4% | 9.3ms | `map` | `[native code]` |
| 1.8% | 36.7ms | 0.7% | 14.2ms | `eval` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 1.8% | 36.0ms | 1.6% | 33.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:501` |
| 1.7% | 33.3ms | 1.5% | 29.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:517` |
| 1.6% | 32.3ms | 0.3% | 7.1ms | `eigen2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:94` |
| 1.5% | 30.8ms | 1.5% | 30.8ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:436` |
| 1.5% | 30.8ms | 1.5% | 30.8ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:500` |
| 1.4% | 27.5ms | 1.3% | 26.7ms | `every` | `[native code]` |
| 1.3% | 25.7ms | 0.2% | 4.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:562` |
| 1.3% | 25.4ms | 1.3% | 25.4ms | `sampleGaussian2D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:169` |
| 1.2% | 25.2ms | 0.1% | 2.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:560` |
| 1.2% | 24.3ms | 1.0% | 20.1ms | `sampleGaussian` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 1.1% | 22.2ms | 0.2% | 4.5ms | `anonymous` | `[native code]` |
| 1.0% | 21.0ms | 1.0% | 21.0ms | `compose` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:121` |
| 1.0% | 20.7ms | 1.0% | 20.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:488` |
| 0.9% | 19.1ms | 0.9% | 19.1ms | `push` | `[native code]` |
| 0.9% | 18.6ms | 0.3% | 7.0ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:489` |
| 0.8% | 16.0ms | 0.8% | 16.0ms | `eigen2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:126` |
| 0.7% | 15.2ms | 0.7% | 14.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:467` |
| 0.7% | 14.8ms | 0.7% | 14.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:36` |
| 0.6% | 13.2ms | 0.6% | 13.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:530` |
| 0.6% | 13.0ms | 0.5% | 11.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:573` |
| 0.6% | 12.5ms | 0.2% | 4.5ms | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:36` |
| 0.6% | 11.9ms | 0.6% | 11.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:569` |
| 0.5% | 11.6ms | 0.4% | 8.5ms | `forEach` | `[native code]` |
| 0.5% | 11.2ms | 0.1% | 2.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:560` |
| 0.5% | 11.1ms | 0.0% | 0us | `eigen2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:128` |
| 0.5% | 10.0ms | 0.3% | 6.0ms | `from` | `[native code]` |
| 0.5% | 9.9ms | 0.0% | 0us | `eigen2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:127` |
| 0.4% | 9.3ms | 0.4% | 7.9ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:521` |
| 0.4% | 9.1ms | 0.4% | 8.2ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:439` |
| 0.4% | 8.7ms | 0.4% | 8.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:534` |
| 0.4% | 8.6ms | 0.4% | 8.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:505` |
| 0.4% | 8.1ms | 0.4% | 8.1ms | `reconstructSymmetric2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 0.4% | 8.0ms | 0.4% | 8.0ms | `eigen2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:125` |
| 0.4% | 7.9ms | 0.4% | 7.9ms | `reconstructSymmetric2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:139` |
| 0.3% | 7.7ms | 0.3% | 7.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:564` |
| 0.3% | 7.4ms | 0.0% | 676us | `CMAESOptimizer` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:397` |
| 0.3% | 7.1ms | 0.3% | 7.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:460` |
| 0.3% | 6.8ms | 0.0% | 622us | `createIdentityMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:26` |
| 0.3% | 6.4ms | 0.1% | 3.0ms | `eigen2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:99` |
| 0.3% | 6.3ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.3% | 6.2ms | 0.3% | 6.2ms | `eigen2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:115` |
| 0.3% | 6.1ms | 0.3% | 6.1ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:563` |
| 0.2% | 5.7ms | 0.2% | 5.7ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:437` |
| 0.2% | 5.4ms | 0.2% | 5.4ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:464` |
| 0.2% | 5.3ms | 0.2% | 4.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:512` |
| 0.2% | 4.7ms | 0.2% | 4.7ms | `eigen2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 0.2% | 4.6ms | 0.2% | 4.6ms | `CMAESOptimizer` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 0.2% | 4.6ms | 0.1% | 2.2ms | `reduce` | `[native code]` |
| 0.2% | 4.6ms | 0.2% | 4.6ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:567` |
| 0.2% | 4.4ms | 0.2% | 4.4ms | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 0.2% | 3.9ms | 0.0% | 818us | `CMAESOptimizer` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:371` |
| 0.2% | 3.9ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:553` |
| 0.1% | 3.8ms | 0.0% | 0us | `CMAESOptimizer` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:402` |
| 0.1% | 3.7ms | 0.1% | 3.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:523` |
| 0.1% | 3.7ms | 0.1% | 3.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:519` |
| 0.1% | 3.6ms | 0.1% | 3.6ms | `sampleGaussian2D` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:164` |
| 0.1% | 3.6ms | 0.1% | 3.6ms | `eigen2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:130` |
| 0.1% | 3.3ms | 0.1% | 3.3ms | `hypot` | `[native code]` |
| 0.1% | 3.2ms | 0.1% | 3.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:571` |
| 0.1% | 3.1ms | 0.0% | 845us | `requireFiniteVector` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:316` |
| 0.1% | 3.0ms | 0.1% | 3.0ms | `sqrt` | `[native code]` |
| 0.1% | 2.9ms | 0.0% | 1.4ms | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:67` |
| 0.1% | 2.7ms | 0.1% | 2.7ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:461` |
| 0.1% | 2.6ms | 0.1% | 2.6ms | `safeObjectiveValue` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:322` |
| 0.1% | 2.5ms | 0.1% | 2.5ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:438` |
| 0.1% | 2.4ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.1% | 2.4ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.1% | 2.3ms | 0.1% | 2.3ms | `repair` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:443` |
| 0.1% | 2.3ms | 0.1% | 2.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:494` |
| 0.1% | 2.3ms | 0.1% | 2.3ms | `fill` | `[native code]` |
| 0.1% | 2.3ms | 0.0% | 0us | `CMAESOptimizer` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:405` |
| 0.1% | 2.3ms | 0.1% | 2.3ms | `cloneMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 0.1% | 2.2ms | 0.1% | 2.2ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:514` |
| 0.1% | 2.1ms | 0.0% | 1.3ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:518` |
| 0.0% | 1.6ms | 0.0% | 0us | `CMAESOptimizer` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:416` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `eval` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:218` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:402` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:430` |
| 0.0% | 1.5ms | 0.0% | 0us | `CMAESOptimizer` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:428` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `exp` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `vecDot` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:63` |
| 0.0% | 1.5ms | 0.0% | 0us | `CMAESOptimizer` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:399` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:405` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `CMAESOptimizer` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:364` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `min` | `[native code]` |
| 0.0% | 1.4ms | 0.0% | 0us | `CMAESOptimizer` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:406` |
| 0.0% | 1.4ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 1.4ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 1.4ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 1.4ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 1.3ms | 0.0% | 737us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:554` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `sampleGaussian` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:161` |
| 0.0% | 1.3ms | 0.0% | 657us | `CMAESOptimizer` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:417` |
| 0.0% | 903us | 0.0% | 903us | `(unknown)` | `[native code]` |
| 0.0% | 893us | 0.0% | 893us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:416` |
| 0.0% | 891us | 0.0% | 891us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 0.0% | 887us | 0.0% | 0us | `Writable` | `internal:streams/writable:181` |
| 0.0% | 887us | 0.0% | 887us | `WritableState` | `internal:streams/writable` |
| 0.0% | 887us | 0.0% | 0us | `WriteStream` | `internal:fs/streams:259` |
| 0.0% | 881us | 0.0% | 0us | `internal:primordials` | `internal:primordials:73` |
| 0.0% | 881us | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 881us | 0.0% | 881us | `bound call` | `[native code]` |
| 0.0% | 881us | 0.0% | 0us | `makeSafe` | `internal:primordials:31` |
| 0.0% | 881us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 881us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 873us | 0.0% | 0us | `CMAESOptimizer` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:403` |
| 0.0% | 873us | 0.0% | 873us | `filter` | `[native code]` |
| 0.0% | 855us | 0.0% | 0us | `CMAESOptimizer` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:404` |
| 0.0% | 855us | 0.0% | 855us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:404` |
| 0.0% | 840us | 0.0% | 840us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:550` |
| 0.0% | 819us | 0.0% | 0us | `CMAESOptimizer` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:411` |
| 0.0% | 803us | 0.0% | 803us | `reconstructSymmetric2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:138` |
| 0.0% | 790us | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 790us | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 790us | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 766us | 0.0% | 0us | `reconstructSymmetric2x2` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:137` |
| 0.0% | 758us | 0.0% | 758us | `vecNorm` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 0.0% | 742us | 0.0% | 742us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:490` |
| 0.0% | 696us | 0.0% | 696us | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:153` |
| 0.0% | 696us | 0.0% | 0us | `sampleGaussian` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:160` |
| 0.0% | 687us | 0.0% | 687us | `safeObjectiveValue` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:325` |
| 0.0% | 684us | 0.0% | 684us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:22` |
| 0.0% | 680us | 0.0% | 680us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:565` |
| 0.0% | 659us | 0.0% | 659us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:417` |
| 0.0% | 656us | 0.0% | 0us | `internal:promisify` | `internal:promisify:53` |
| 0.0% | 656us | 0.0% | 0us | `node:fs` | `node:fs:299` |
| 0.0% | 639us | 0.0% | 0us | `internal:streams/operators` | `internal:streams/operators:2` |
| 0.0% | 639us | 0.0% | 639us | `adaptationPoint` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:455` |
| 0.0% | 639us | 0.0% | 0us | `internal:streams/end-of-stream` | `internal:streams/end-of-stream:17` |
| 0.0% | 638us | 0.0% | 638us | `step` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:537` |
| 0.0% | 625us | 0.0% | 625us | `eval` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:232` |

## Function Details

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:531` | Self: 13.2% (258.2ms) | Total: 13.3% (260.3ms) | Samples: 326

**Called by:**
- `(module)` (329)

**Calls:**
- `adaptationPoint` (2)
- `adaptationPoint` (1)

### `sampleGaussian2D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` | Self: 8.2% (161.2ms) | Total: 10.0% (196.5ms) | Samples: 208

**Called by:**
- `step` (253)

**Calls:**
- `atan2` (45)

### `sort`
`[native code]` | Self: 8.1% (158.5ms) | Total: 9.1% (179.3ms) | Samples: 201

**Called by:**
- `step` (228)

**Calls:**
- `(anonymous)` (27)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:468` | Self: 7.1% (140.5ms) | Total: 18.7% (366.2ms) | Samples: 181

**Called by:**
- `(module)` (470)

**Calls:**
- `sampleGaussian2D` (253)
- `sampleGaussian2D` (32)
- `sampleGaussian2D` (4)

### `atan2`
`[native code]` | Self: 5.3% (104.9ms) | Total: 5.3% (104.9ms) | Samples: 132

**Called by:**
- `sampleGaussian2D` (45)
- `eval` (27)
- `repair` (27)
- `eigen2x2` (25)
- `sampleGaussian` (5)
- `repair` (1)
- `reconstructSymmetric2x2` (1)
- `every` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:473` | Self: 4.9% (97.2ms) | Total: 7.0% (137.8ms) | Samples: 124

**Called by:**
- `(module)` (176)

**Calls:**
- `eval` (44)
- `safeObjectiveValue` (4)
- `eval` (2)
- `eval` (1)
- `safeObjectiveValue` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:479` | Self: 4.0% (78.5ms) | Total: 4.0% (78.5ms) | Samples: 99

**Called by:**
- `(module)` (99)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:477` | Self: 2.9% (57.7ms) | Total: 3.0% (58.6ms) | Samples: 70

**Called by:**
- `(module)` (71)

**Calls:**
- `eval` (1)

### `repair`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` | Self: 2.6% (52.5ms) | Total: 3.7% (73.7ms) | Samples: 66

**Called by:**
- `step` (53)
- `step` (40)

**Calls:**
- `atan2` (27)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:478` | Self: 2.6% (52.4ms) | Total: 2.7% (53.3ms) | Samples: 68

**Called by:**
- `(module)` (69)

**Calls:**
- `eval` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:475` | Self: 1.9% (38.6ms) | Total: 2.8% (55.1ms) | Samples: 49

**Called by:**
- `(module)` (72)

**Calls:**
- `push` (23)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:459` | Self: 1.7% (35.0ms) | Total: 4.7% (93.4ms) | Samples: 40

**Called by:**
- `(module)` (97)

**Calls:**
- `eigen2x2` (18)
- `eigen2x2` (7)
- `eigen2x2` (7)
- `eigen2x2` (6)
- `eigen2x2` (5)
- `eigen2x2` (5)
- `eigen2x2` (3)
- `eigen2x2` (3)
- `eigen2x2` (2)
- `eigen2x2` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:501` | Self: 1.6% (33.0ms) | Total: 1.8% (36.0ms) | Samples: 43

**Called by:**
- `(module)` (47)

**Calls:**
- `adaptationPoint` (4)

### `repair`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:436` | Self: 1.5% (30.8ms) | Total: 1.5% (30.8ms) | Samples: 36

**Called by:**
- `step` (19)
- `step` (17)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:500` | Self: 1.5% (30.8ms) | Total: 1.5% (30.8ms) | Samples: 30

**Called by:**
- `(module)` (30)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:517` | Self: 1.5% (29.5ms) | Total: 1.7% (33.3ms) | Samples: 38

**Called by:**
- `(module)` (43)

**Calls:**
- `vecNorm` (4)
- `vecNorm` (1)

### `every`
`[native code]` | Self: 1.3% (26.7ms) | Total: 1.4% (27.5ms) | Samples: 26

**Called by:**
- `eigen2x2` (24)
- `requireFiniteVector` (3)

**Calls:**
- `atan2` (1)

### `sampleGaussian2D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:169` | Self: 1.3% (25.4ms) | Total: 1.3% (25.4ms) | Samples: 32

**Called by:**
- `step` (32)

### `eigen2x2`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:107` | Self: 1.2% (25.0ms) | Total: 2.3% (45.2ms) | Samples: 31

**Called by:**
- `step` (26)
- `step` (18)
- `step` (12)

**Calls:**
- `atan2` (25)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:474` | Self: 1.2% (24.1ms) | Total: 2.5% (50.4ms) | Samples: 30

**Called by:**
- `(module)` (63)

**Calls:**
- `sampleGaussian` (30)
- `sampleGaussian` (2)
- `sampleGaussian` (1)

### `compose`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:121` | Self: 1.0% (21.0ms) | Total: 1.0% (21.0ms) | Samples: 25

**Called by:**
- `eigen2x2` (15)
- `eigen2x2` (10)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:488` | Self: 1.0% (20.7ms) | Total: 1.0% (20.7ms) | Samples: 27

**Called by:**
- `sort` (27)

### `sampleGaussian`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` | Self: 1.0% (20.1ms) | Total: 1.2% (24.3ms) | Samples: 25

**Called by:**
- `step` (30)

**Calls:**
- `atan2` (5)

### `push`
`[native code]` | Self: 0.9% (19.1ms) | Total: 0.9% (19.1ms) | Samples: 26

**Called by:**
- `step` (23)
- `step` (2)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:472` | Self: 0.8% (16.1ms) | Total: 3.6% (70.3ms) | Samples: 20

**Called by:**
- `(module)` (84)

**Calls:**
- `repair` (40)
- `repair` (19)
- `repair` (3)
- `repair` (2)

### `eigen2x2`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:126` | Self: 0.8% (16.0ms) | Total: 0.8% (16.0ms) | Samples: 15

**Called by:**
- `step` (6)
- `step` (5)
- `step` (4)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:36` | Self: 0.7% (14.8ms) | Total: 0.7% (14.8ms) | Samples: 20

**Called by:**
- `map` (20)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:467` | Self: 0.7% (14.3ms) | Total: 0.7% (15.2ms) | Samples: 19

**Called by:**
- `(module)` (20)

**Calls:**
- `push` (1)

### `eval`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` | Self: 0.7% (14.2ms) | Total: 1.8% (36.7ms) | Samples: 18

**Called by:**
- `step` (44)
- `step` (1)
- `step` (1)

**Calls:**
- `atan2` (27)
- `(unknown)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:530` | Self: 0.6% (13.2ms) | Total: 0.6% (13.2ms) | Samples: 17

**Called by:**
- `(module)` (17)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:471` | Self: 0.6% (12.4ms) | Total: 3.6% (70.9ms) | Samples: 16

**Called by:**
- `(module)` (92)

**Calls:**
- `repair` (53)
- `repair` (17)
- `repair` (6)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:569` | Self: 0.6% (11.9ms) | Total: 0.6% (11.9ms) | Samples: 16

**Called by:**
- `(module)` (16)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:573` | Self: 0.5% (11.3ms) | Total: 0.6% (13.0ms) | Samples: 15

**Called by:**
- `(module)` (17)

**Calls:**
- `push` (2)

### `map`
`[native code]` | Self: 0.4% (9.3ms) | Total: 2.0% (41.0ms) | Samples: 12

**Called by:**
- `step` (29)
- `cloneMatrix` (11)
- `step` (9)
- `CMAESOptimizer` (3)
- `CMAESOptimizer` (2)

**Calls:**
- `(anonymous)` (20)
- `(anonymous)` (15)
- `repair` (3)
- `(anonymous)` (2)
- `(anonymous)` (2)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 0.4% (8.7ms) | Total: 100.0% (1.95s) | Samples: 11

**Calls:**
- `step` (470)
- `step` (329)
- `step` (232)
- `step` (176)
- `step` (99)
- `step` (97)
- `step` (92)
- `step` (91)
- `step` (84)
- `step` (72)
- `step` (71)
- `step` (69)
- `step` (63)
- `step` (53)
- `step` (47)
- `step` (43)
- `step` (34)
- `step` (33)
- `step` (30)
- `step` (24)
- `step` (20)
- `step` (17)
- `step` (17)
- `step` (16)
- `step` (12)
- `step` (12)
- `step` (11)
- `step` (10)
- `CMAESOptimizer` (10)
- `step` (9)
- `step` (8)
- `(anonymous)` (8)
- `step` (7)
- `step` (7)
- `step` (6)
- `CMAESOptimizer` (5)
- `step` (5)
- `step` (5)
- `step` (4)
- `step` (4)
- `step` (4)
- `CMAESOptimizer` (4)
- `CMAESOptimizer` (3)
- `step` (3)
- `step` (3)
- `CMAESOptimizer` (2)
- `CMAESOptimizer` (2)
- `step` (2)
- `CMAESOptimizer` (2)
- `CMAESOptimizer` (2)
- `CMAESOptimizer` (2)
- `step` (2)
- `CMAESOptimizer` (1)
- `CMAESOptimizer` (1)
- `CMAESOptimizer` (1)
- `step` (1)
- `step` (1)
- `CMAESOptimizer` (1)
- `CMAESOptimizer` (1)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:534` | Self: 0.4% (8.7ms) | Total: 0.4% (8.7ms) | Samples: 12

**Called by:**
- `(module)` (12)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:505` | Self: 0.4% (8.6ms) | Total: 0.4% (8.6ms) | Samples: 11

**Called by:**
- `(module)` (11)

### `forEach`
`[native code]` | Self: 0.4% (8.5ms) | Total: 0.5% (11.6ms) | Samples: 11

**Called by:**
- `step` (15)

**Calls:**
- `(anonymous)` (3)
- `(anonymous)` (1)

### `repair`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:439` | Self: 0.4% (8.2ms) | Total: 0.4% (9.1ms) | Samples: 11

**Called by:**
- `(anonymous)` (12)

**Calls:**
- `atan2` (1)

### `reconstructSymmetric2x2`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` | Self: 0.4% (8.1ms) | Total: 0.4% (8.1ms) | Samples: 10

**Called by:**
- `step` (10)

### `eigen2x2`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:125` | Self: 0.4% (8.0ms) | Total: 0.4% (8.0ms) | Samples: 10

**Called by:**
- `step` (5)
- `step` (3)
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:557` | Self: 0.4% (7.9ms) | Total: 2.1% (42.3ms) | Samples: 10

**Called by:**
- `(module)` (53)

**Calls:**
- `eigen2x2` (13)
- `eigen2x2` (12)
- `eigen2x2` (4)
- `eigen2x2` (3)
- `eigen2x2` (3)
- `eigen2x2` (2)
- `eigen2x2` (2)
- `eigen2x2` (2)
- `eigen2x2` (2)

### `reconstructSymmetric2x2`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:139` | Self: 0.4% (7.9ms) | Total: 0.4% (7.9ms) | Samples: 11

**Called by:**
- `step` (11)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:521` | Self: 0.4% (7.9ms) | Total: 0.4% (9.3ms) | Samples: 10

**Called by:**
- `(module)` (12)

**Calls:**
- `sqrt` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:564` | Self: 0.3% (7.7ms) | Total: 0.3% (7.7ms) | Samples: 10

**Called by:**
- `(module)` (10)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:460` | Self: 0.3% (7.1ms) | Total: 0.3% (7.1ms) | Samples: 9

**Called by:**
- `(module)` (9)

### `eigen2x2`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:94` | Self: 0.3% (7.1ms) | Total: 1.6% (32.3ms) | Samples: 8

**Called by:**
- `step` (13)
- `step` (12)
- `step` (7)

**Calls:**
- `every` (24)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:489` | Self: 0.3% (7.0ms) | Total: 0.9% (18.6ms) | Samples: 9

**Called by:**
- `(module)` (24)

**Calls:**
- `forEach` (15)

### `eigen2x2`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:115` | Self: 0.3% (6.2ms) | Total: 0.3% (6.2ms) | Samples: 8

**Called by:**
- `step` (4)
- `step` (3)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:563` | Self: 0.3% (6.1ms) | Total: 0.3% (6.1ms) | Samples: 8

**Called by:**
- `(module)` (8)

### `from`
`[native code]` | Self: 0.3% (6.0ms) | Total: 0.5% (10.0ms) | Samples: 7

**Called by:**
- `createIdentityMatrix` (8)
- `CMAESOptimizer` (4)

**Calls:**
- `(anonymous)` (2)
- `fill` (1)
- `(anonymous)` (1)
- `(anonymous)` (1)

### `repair`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:437` | Self: 0.2% (5.7ms) | Total: 0.2% (5.7ms) | Samples: 8

**Called by:**
- `step` (6)
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:464` | Self: 0.2% (5.4ms) | Total: 0.2% (5.4ms) | Samples: 7

**Called by:**
- `(module)` (7)

### `eigen2x2`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` | Self: 0.2% (4.7ms) | Total: 0.2% (4.7ms) | Samples: 6

**Called by:**
- `step` (2)
- `step` (2)
- `step` (2)

### `CMAESOptimizer`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` | Self: 0.2% (4.6ms) | Total: 0.2% (4.6ms) | Samples: 1

**Called by:**
- `(module)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:567` | Self: 0.2% (4.6ms) | Total: 0.2% (4.6ms) | Samples: 6

**Called by:**
- `(module)` (6)

### `anonymous`
`[native code]` | Self: 0.2% (4.5ms) | Total: 1.1% (22.2ms) | Samples: 6

**Called by:**
- `(anonymous)` (5)
- `node:fs/promises` (3)
- `node:fs` (3)
- `internal:fs/streams` (2)
- `get WriteStream` (2)
- `internal:stream` (2)
- `node:stream` (2)
- `node:events` (1)
- `internal:validators` (1)
- `node:fs` (1)
- `internal:promisify` (1)
- `internal:streams/end-of-stream` (1)
- `internal:shared` (1)
- `internal:streams/operators` (1)
- `internal:streams/compose` (1)
- `internal:streams/duplex` (1)
- `internal:streams/pipeline` (1)

**Calls:**
- `node:fs/promises` (3)
- `node:fs` (3)
- `internal:fs/streams` (2)
- `internal:stream` (2)
- `node:stream` (2)
- `node:events` (1)
- `internal:validators` (1)
- `node:fs` (1)
- `internal:streams/pipeline` (1)
- `internal:promisify` (1)
- `internal:streams/end-of-stream` (1)
- `internal:shared` (1)
- `internal:primordials` (1)
- `internal:streams/operators` (1)
- `internal:streams/duplex` (1)
- `internal:streams/compose` (1)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:36` | Self: 0.2% (4.5ms) | Total: 0.6% (12.5ms) | Samples: 6

**Called by:**
- `step` (17)

**Calls:**
- `map` (11)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:512` | Self: 0.2% (4.5ms) | Total: 0.2% (5.3ms) | Samples: 6

**Called by:**
- `(module)` (7)

**Calls:**
- `sqrt` (1)

### `adaptationPoint`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` | Self: 0.2% (4.4ms) | Total: 0.2% (4.4ms) | Samples: 6

**Called by:**
- `step` (4)
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:562` | Self: 0.2% (4.0ms) | Total: 1.3% (25.7ms) | Samples: 5

**Called by:**
- `(module)` (34)

**Calls:**
- `cloneMatrix` (17)
- `map` (9)
- `cloneMatrix` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:523` | Self: 0.1% (3.7ms) | Total: 0.1% (3.7ms) | Samples: 5

**Called by:**
- `(module)` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:519` | Self: 0.1% (3.7ms) | Total: 0.1% (3.7ms) | Samples: 5

**Called by:**
- `(module)` (5)

### `sampleGaussian2D`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:164` | Self: 0.1% (3.6ms) | Total: 0.1% (3.6ms) | Samples: 4

**Called by:**
- `step` (4)

### `eigen2x2`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:130` | Self: 0.1% (3.6ms) | Total: 0.1% (3.6ms) | Samples: 5

**Called by:**
- `step` (5)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:551` | Self: 0.1% (3.5ms) | Total: 3.6% (71.5ms) | Samples: 4

**Called by:**
- `(module)` (91)

**Calls:**
- `eigen2x2` (26)
- `eigen2x2` (12)
- `reconstructSymmetric2x2` (11)
- `reconstructSymmetric2x2` (10)
- `eigen2x2` (5)
- `eigen2x2` (5)
- `eigen2x2` (5)
- `eigen2x2` (4)
- `eigen2x2` (3)
- `eigen2x2` (3)
- `eigen2x2` (2)
- `reconstructSymmetric2x2` (1)

### `hypot`
`[native code]` | Self: 0.1% (3.3ms) | Total: 0.1% (3.3ms) | Samples: 4

**Called by:**
- `eigen2x2` (4)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:488` | Self: 0.1% (3.2ms) | Total: 9.3% (182.6ms) | Samples: 4

**Called by:**
- `(module)` (232)

**Calls:**
- `sort` (228)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:571` | Self: 0.1% (3.2ms) | Total: 0.1% (3.2ms) | Samples: 4

**Called by:**
- `(module)` (4)

### `eigen2x2`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:99` | Self: 0.1% (3.0ms) | Total: 0.3% (6.4ms) | Samples: 4

**Called by:**
- `step` (3)
- `step` (3)
- `step` (2)

**Calls:**
- `hypot` (4)

### `sqrt`
`[native code]` | Self: 0.1% (3.0ms) | Total: 0.1% (3.0ms) | Samples: 4

**Called by:**
- `step` (2)
- `step` (1)
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:560` | Self: 0.1% (2.9ms) | Total: 1.2% (25.2ms) | Samples: 4

**Called by:**
- `(module)` (33)

**Calls:**
- `map` (29)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:461` | Self: 0.1% (2.7ms) | Total: 0.1% (2.7ms) | Samples: 4

**Called by:**
- `(module)` (4)

### `safeObjectiveValue`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:322` | Self: 0.1% (2.6ms) | Total: 0.1% (2.6ms) | Samples: 4

**Called by:**
- `step` (4)

### `repair`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:438` | Self: 0.1% (2.5ms) | Total: 0.1% (2.5ms) | Samples: 3

**Called by:**
- `map` (3)

### `repair`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:443` | Self: 0.1% (2.3ms) | Total: 0.1% (2.3ms) | Samples: 3

**Called by:**
- `step` (3)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:494` | Self: 0.1% (2.3ms) | Total: 0.1% (2.3ms) | Samples: 3

**Called by:**
- `forEach` (3)

### `fill`
`[native code]` | Self: 0.1% (2.3ms) | Total: 0.1% (2.3ms) | Samples: 2

**Called by:**
- `from` (1)
- `CMAESOptimizer` (1)

### `cloneMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` | Self: 0.1% (2.3ms) | Total: 0.1% (2.3ms) | Samples: 3

**Called by:**
- `step` (3)

### `reduce`
`[native code]` | Self: 0.1% (2.2ms) | Total: 0.2% (4.6ms) | Samples: 3

**Called by:**
- `CMAESOptimizer` (2)
- `CMAESOptimizer` (2)
- `CMAESOptimizer` (1)
- `CMAESOptimizer` (1)

**Calls:**
- `(anonymous)` (1)
- `(anonymous)` (1)
- `(anonymous)` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:514` | Self: 0.1% (2.2ms) | Total: 0.1% (2.2ms) | Samples: 3

**Called by:**
- `(module)` (3)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:560` | Self: 0.1% (2.1ms) | Total: 0.5% (11.2ms) | Samples: 3

**Called by:**
- `map` (15)

**Calls:**
- `repair` (12)

### `eval`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:218` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 2

**Called by:**
- `step` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:402` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 2

**Called by:**
- `from` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:430` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `map` (2)

### `exp`
`[native code]` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `step` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:553` | Self: 0.0% (1.5ms) | Total: 0.2% (3.9ms) | Samples: 1

**Called by:**
- `(module)` (4)

**Calls:**
- `exp` (2)
- `reconstructSymmetric2x2` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `(module)` (2)

### `vecDot`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:63` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 2

**Called by:**
- `vecNorm` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:405` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `map` (2)

### `CMAESOptimizer`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:364` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `(module)` (2)

### `min`
`[native code]` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 2

**Called by:**
- `CMAESOptimizer` (1)
- `step` (1)

### `vecNorm`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:67` | Self: 0.0% (1.4ms) | Total: 0.1% (2.9ms) | Samples: 2

**Called by:**
- `step` (4)

**Calls:**
- `vecDot` (2)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:518` | Self: 0.0% (1.3ms) | Total: 0.1% (2.1ms) | Samples: 2

**Called by:**
- `(module)` (3)

**Calls:**
- `sqrt` (1)

### `sampleGaussian`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:161` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 2

**Called by:**
- `step` (2)

### `(unknown)`
`[native code]` | Self: 0.0% (903us) | Total: 0.0% (903us) | Samples: 1

**Called by:**
- `eval` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:416` | Self: 0.0% (893us) | Total: 0.0% (893us) | Samples: 1

**Called by:**
- `reduce` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` | Self: 0.0% (891us) | Total: 0.0% (891us) | Samples: 1

**Called by:**
- `from` (1)

### `WritableState`
`internal:streams/writable` | Self: 0.0% (887us) | Total: 0.0% (887us) | Samples: 1

**Called by:**
- `Writable` (1)

### `bound call`
`[native code]` | Self: 0.0% (881us) | Total: 0.0% (881us) | Samples: 1

**Called by:**
- `makeSafe` (1)

### `filter`
`[native code]` | Self: 0.0% (873us) | Total: 0.0% (873us) | Samples: 1

**Called by:**
- `CMAESOptimizer` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:404` | Self: 0.0% (855us) | Total: 0.0% (855us) | Samples: 1

**Called by:**
- `reduce` (1)

### `requireFiniteVector`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:316` | Self: 0.0% (845us) | Total: 0.1% (3.1ms) | Samples: 1

**Called by:**
- `CMAESOptimizer` (4)

**Calls:**
- `every` (3)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:550` | Self: 0.0% (840us) | Total: 0.0% (840us) | Samples: 1

**Called by:**
- `(module)` (1)

### `CMAESOptimizer`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:371` | Self: 0.0% (818us) | Total: 0.2% (3.9ms) | Samples: 1

**Called by:**
- `(module)` (5)

**Calls:**
- `requireFiniteVector` (4)

### `reconstructSymmetric2x2`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:138` | Self: 0.0% (803us) | Total: 0.0% (803us) | Samples: 1

**Called by:**
- `step` (1)

### `vecNorm`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` | Self: 0.0% (758us) | Total: 0.0% (758us) | Samples: 1

**Called by:**
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:490` | Self: 0.0% (742us) | Total: 0.0% (742us) | Samples: 1

**Called by:**
- `forEach` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:554` | Self: 0.0% (737us) | Total: 0.0% (1.3ms) | Samples: 1

**Called by:**
- `(module)` (2)

**Calls:**
- `min` (1)

### `nextHalfOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:153` | Self: 0.0% (696us) | Total: 0.0% (696us) | Samples: 1

**Called by:**
- `sampleGaussian` (1)

### `safeObjectiveValue`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:325` | Self: 0.0% (687us) | Total: 0.0% (687us) | Samples: 1

**Called by:**
- `step` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:22` | Self: 0.0% (684us) | Total: 0.0% (684us) | Samples: 1

**Called by:**
- `from` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:565` | Self: 0.0% (680us) | Total: 0.0% (680us) | Samples: 1

**Called by:**
- `(module)` (1)

### `CMAESOptimizer`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:397` | Self: 0.0% (676us) | Total: 0.3% (7.4ms) | Samples: 1

**Called by:**
- `(module)` (10)

**Calls:**
- `createIdentityMatrix` (9)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:417` | Self: 0.0% (659us) | Total: 0.0% (659us) | Samples: 1

**Called by:**
- `reduce` (1)

### `CMAESOptimizer`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:417` | Self: 0.0% (657us) | Total: 0.0% (1.3ms) | Samples: 1

**Called by:**
- `(module)` (2)

**Calls:**
- `reduce` (1)

### `adaptationPoint`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:455` | Self: 0.0% (639us) | Total: 0.0% (639us) | Samples: 1

**Called by:**
- `step` (1)

### `step`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:537` | Self: 0.0% (638us) | Total: 0.0% (638us) | Samples: 1

**Called by:**
- `(module)` (1)

### `eval`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:232` | Self: 0.0% (625us) | Total: 0.0% (625us) | Samples: 1

**Called by:**
- `step` (1)

### `createIdentityMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:26` | Self: 0.0% (622us) | Total: 0.3% (6.8ms) | Samples: 1

**Called by:**
- `CMAESOptimizer` (9)

**Calls:**
- `from` (8)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (881us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `CMAESOptimizer`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:411` | Self: 0.0% (0us) | Total: 0.0% (819us) | Samples: 0

**Called by:**
- `(module)` (1)

**Calls:**
- `min` (1)

### `CMAESOptimizer`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:416` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `(module)` (2)

**Calls:**
- `reduce` (2)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (881us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `reconstructSymmetric2x2`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:137` | Self: 0.0% (0us) | Total: 0.0% (766us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `atan2` (1)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (790us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `CMAESOptimizer`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:405` | Self: 0.0% (0us) | Total: 0.1% (2.3ms) | Samples: 0

**Called by:**
- `(module)` (3)

**Calls:**
- `map` (3)

### `internal:streams/end-of-stream`
`internal:streams/end-of-stream:17` | Self: 0.0% (0us) | Total: 0.0% (639us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (881us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `Writable`
`internal:streams/writable:181` | Self: 0.0% (0us) | Total: 0.0% (887us) | Samples: 0

**Called by:**
- `WriteStream` (1)

**Calls:**
- `WritableState` (1)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.1% (2.4ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `eigen2x2`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:127` | Self: 0.0% (0us) | Total: 0.5% (9.9ms) | Samples: 0

**Called by:**
- `step` (5)
- `step` (3)
- `step` (2)

**Calls:**
- `compose` (10)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `CMAESOptimizer`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:406` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `(module)` (2)

**Calls:**
- `reduce` (2)

### `WriteStream`
`internal:fs/streams:259` | Self: 0.0% (0us) | Total: 0.0% (887us) | Samples: 0

**Called by:**
- `(anonymous)` (1)

**Calls:**
- `Writable` (1)

### `CMAESOptimizer`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:399` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `(module)` (1)

**Calls:**
- `fill` (1)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (790us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `CMAESOptimizer`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:428` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `(module)` (2)

**Calls:**
- `map` (2)

### `node:fs`
`node:fs:299` | Self: 0.0% (0us) | Total: 0.0% (656us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `CMAESOptimizer`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:402` | Self: 0.0% (0us) | Total: 0.1% (3.8ms) | Samples: 0

**Called by:**
- `(module)` (4)

**Calls:**
- `from` (4)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.1% (2.4ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `CMAESOptimizer`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:403` | Self: 0.0% (0us) | Total: 0.0% (873us) | Samples: 0

**Called by:**
- `(module)` (1)

**Calls:**
- `filter` (1)

### `internal:streams/operators`
`internal:streams/operators:2` | Self: 0.0% (0us) | Total: 0.0% (639us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `sampleGaussian`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:160` | Self: 0.0% (0us) | Total: 0.0% (696us) | Samples: 0

**Called by:**
- `step` (1)

**Calls:**
- `nextHalfOpenUnit` (1)

### `internal:primordials`
`internal:primordials:73` | Self: 0.0% (0us) | Total: 0.0% (881us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `makeSafe` (1)

### `internal:promisify`
`internal:promisify:53` | Self: 0.0% (0us) | Total: 0.0% (656us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `(anonymous)` (2)

**Calls:**
- `anonymous` (2)

### `CMAESOptimizer`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:404` | Self: 0.0% (0us) | Total: 0.0% (855us) | Samples: 0

**Called by:**
- `(module)` (1)

**Calls:**
- `reduce` (1)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.3% (6.3ms) | Samples: 0

**Called by:**
- `(module)` (8)

**Calls:**
- `anonymous` (5)
- `get WriteStream` (2)
- `WriteStream` (1)

### `makeSafe`
`internal:primordials:31` | Self: 0.0% (0us) | Total: 0.0% (881us) | Samples: 0

**Called by:**
- `internal:primordials` (1)

**Calls:**
- `bound call` (1)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (790us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `eigen2x2`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts:128` | Self: 0.0% (0us) | Total: 0.5% (11.1ms) | Samples: 0

**Called by:**
- `step` (7)
- `step` (5)
- `step` (3)

**Calls:**
- `compose` (15)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 81.3% | 1.59s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngine.ts` |
| 18.1% | 354.5ms | `[native code]` |
| 0.4% | 8.7ms | `/Users/jemanuel/projects/cmaes_explainer/[eval]` |
| 0.0% | 887us | `internal:streams/writable` |
