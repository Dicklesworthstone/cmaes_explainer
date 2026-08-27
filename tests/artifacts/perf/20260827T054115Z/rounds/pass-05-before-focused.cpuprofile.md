# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 4.33s | 13094 | 250us | 52 |

**Top 10:** `jacobiEigenSymmetric` 44.5%, `jacobiEigenSymmetric` 43.1%, `hypot` 3.9%, `jacobiEigenSymmetric` 1.2%, `jacobiEigenSymmetric` 1.2%, `jacobiEigenSymmetric` 1.0%, `some` 1.0%, `jacobiEigenSymmetric` 0.9%, `jacobiEigenSymmetric` 0.8%, `(anonymous)` 0.5%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 44.5% | 1.92s | 46.5% | 2.01s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` |
| 43.1% | 1.86s | 45.0% | 1.94s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:139` |
| 3.9% | 170.2ms | 3.9% | 170.2ms | `hypot` | `[native code]` |
| 1.2% | 55.3ms | 1.2% | 55.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 1.2% | 54.5ms | 1.8% | 79.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 1.0% | 44.2ms | 1.0% | 44.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` |
| 1.0% | 43.3ms | 3.1% | 137.5ms | `some` | `[native code]` |
| 0.9% | 38.9ms | 0.9% | 38.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:163` |
| 0.8% | 36.6ms | 0.8% | 36.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 0.5% | 23.7ms | 0.5% | 23.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.5% | 23.0ms | 0.5% | 23.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.2% | 8.8ms | 0.7% | 34.0ms | `from` | `[native code]` |
| 0.1% | 6.8ms | 0.1% | 7.6ms | `sort` | `[native code]` |
| 0.1% | 5.5ms | 0.4% | 18.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:180` |
| 0.1% | 4.4ms | 0.4% | 19.6ms | `anonymous` | `[native code]` |
| 0.0% | 3.7ms | 1.6% | 69.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 0.0% | 3.0ms | 0.1% | 4.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 2.7ms | 0.0% | 2.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:144` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `map` | `[native code]` |
| 0.0% | 933us | 0.0% | 933us | `max` | `[native code]` |
| 0.0% | 718us | 0.0% | 718us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:181` |
| 0.0% | 643us | 100.0% | 4.32s | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 600us | 1.6% | 70.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:106` |
| 0.0% | 375us | 0.0% | 375us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 372us | 0.0% | 372us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:165` |
| 0.0% | 368us | 0.0% | 368us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:180` |
| 0.0% | 359us | 0.0% | 359us | `WriteStream` | `internal:fs/streams:198` |
| 0.0% | 346us | 0.0% | 346us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` |
| 0.0% | 309us | 0.0% | 309us | `write` | `[native code]` |
| 0.0% | 278us | 0.0% | 278us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:114` |
| 0.0% | 277us | 0.0% | 277us | `hideFromStack` | `internal:shared` |
| 0.0% | 265us | 0.0% | 265us | `createSafeIterator` | `internal:primordials:3` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 100.0% | 4.32s | 0.0% | 643us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 46.5% | 2.01s | 44.5% | 1.92s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` |
| 45.0% | 1.94s | 43.1% | 1.86s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:139` |
| 3.9% | 170.2ms | 3.9% | 170.2ms | `hypot` | `[native code]` |
| 3.1% | 137.5ms | 1.0% | 43.3ms | `some` | `[native code]` |
| 1.8% | 79.6ms | 1.2% | 54.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 1.6% | 70.7ms | 0.0% | 600us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:106` |
| 1.6% | 70.1ms | 0.0% | 0us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 1.6% | 69.8ms | 0.0% | 3.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 1.2% | 55.3ms | 1.2% | 55.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 1.0% | 44.2ms | 1.0% | 44.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` |
| 0.9% | 38.9ms | 0.9% | 38.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:163` |
| 0.8% | 36.6ms | 0.8% | 36.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 0.7% | 34.0ms | 0.2% | 8.8ms | `from` | `[native code]` |
| 0.5% | 23.7ms | 0.5% | 23.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.5% | 23.0ms | 0.5% | 23.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.4% | 19.6ms | 0.1% | 4.4ms | `anonymous` | `[native code]` |
| 0.4% | 18.9ms | 0.1% | 5.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:180` |
| 0.1% | 7.6ms | 0.1% | 6.8ms | `sort` | `[native code]` |
| 0.1% | 5.3ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.1% | 4.3ms | 0.0% | 3.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 2.7ms | 0.0% | 2.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:144` |
| 0.0% | 2.2ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 2.0ms | 0.0% | 2.0ms | `map` | `[native code]` |
| 0.0% | 1.9ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 1.9ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 1.6ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 1.6ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 1.6ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 1.3ms | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 1.0ms | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 1.0ms | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 965us | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 933us | 0.0% | 933us | `max` | `[native code]` |
| 0.0% | 911us | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 718us | 0.0% | 718us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:181` |
| 0.0% | 662us | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.0% | 634us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 375us | 0.0% | 375us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 372us | 0.0% | 372us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:165` |
| 0.0% | 368us | 0.0% | 368us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:180` |
| 0.0% | 359us | 0.0% | 359us | `WriteStream` | `internal:fs/streams:198` |
| 0.0% | 350us | 0.0% | 0us | `node:fs` | `node:fs:299` |
| 0.0% | 346us | 0.0% | 346us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` |
| 0.0% | 309us | 0.0% | 309us | `write` | `[native code]` |
| 0.0% | 309us | 0.0% | 0us | `writeFast` | `internal:fs/streams:359` |
| 0.0% | 278us | 0.0% | 278us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:114` |
| 0.0% | 277us | 0.0% | 0us | `internal:validators` | `internal:validators:67` |
| 0.0% | 277us | 0.0% | 277us | `hideFromStack` | `internal:shared` |
| 0.0% | 265us | 0.0% | 265us | `createSafeIterator` | `internal:primordials:3` |
| 0.0% | 265us | 0.0% | 0us | `internal:primordials` | `internal:primordials:51` |
| 0.0% | 265us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |

## Function Details

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` | Self: 44.5% (1.92s) | Total: 46.5% (2.01s) | Samples: 5849

**Called by:**
- `(module)` (6121)

**Calls:**
- `hypot` (272)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:139` | Self: 43.1% (1.86s) | Total: 45.0% (1.94s) | Samples: 5634

**Called by:**
- `(module)` (5882)

**Calls:**
- `hypot` (248)

### `hypot`
`[native code]` | Self: 3.9% (170.2ms) | Total: 3.9% (170.2ms) | Samples: 520

**Called by:**
- `jacobiEigenSymmetric` (272)
- `jacobiEigenSymmetric` (248)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` | Self: 1.2% (55.3ms) | Total: 1.2% (55.3ms) | Samples: 168

**Called by:**
- `(module)` (168)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 1.2% (54.5ms) | Total: 1.8% (79.6ms) | Samples: 160

**Called by:**
- `(module)` (236)

**Calls:**
- `from` (76)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` | Self: 1.0% (44.2ms) | Total: 1.0% (44.2ms) | Samples: 133

**Called by:**
- `(module)` (133)

### `some`
`[native code]` | Self: 1.0% (43.3ms) | Total: 3.1% (137.5ms) | Samples: 132

**Called by:**
- `validateSquareFiniteMatrix` (212)
- `(anonymous)` (200)
- `some` (4)

**Calls:**
- `(anonymous)` (211)
- `(anonymous)` (69)
- `some` (4)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:163` | Self: 0.9% (38.9ms) | Total: 0.9% (38.9ms) | Samples: 120

**Called by:**
- `(module)` (120)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` | Self: 0.8% (36.6ms) | Total: 0.8% (36.6ms) | Samples: 111

**Called by:**
- `(module)` (111)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.5% (23.7ms) | Total: 0.5% (23.7ms) | Samples: 72

**Called by:**
- `from` (72)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.5% (23.0ms) | Total: 0.5% (23.0ms) | Samples: 69

**Called by:**
- `some` (69)

### `from`
`[native code]` | Self: 0.2% (8.8ms) | Total: 0.7% (34.0ms) | Samples: 23

**Called by:**
- `jacobiEigenSymmetric` (76)
- `jacobiEigenSymmetric` (18)
- `(module)` (3)
- `from` (2)

**Calls:**
- `(anonymous)` (72)
- `from` (2)
- `(anonymous)` (1)
- `(anonymous)` (1)

### `sort`
`[native code]` | Self: 0.1% (6.8ms) | Total: 0.1% (7.6ms) | Samples: 21

**Called by:**
- `jacobiEigenSymmetric` (23)

**Calls:**
- `(anonymous)` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:180` | Self: 0.1% (5.5ms) | Total: 0.4% (18.9ms) | Samples: 17

**Called by:**
- `(module)` (58)

**Calls:**
- `sort` (23)
- `from` (18)

### `anonymous`
`[native code]` | Self: 0.1% (4.4ms) | Total: 0.4% (19.6ms) | Samples: 13

**Called by:**
- `(anonymous)` (9)
- `node:fs` (7)
- `get WriteStream` (6)
- `node:fs/promises` (6)
- `internal:fs/streams` (5)
- `internal:stream` (5)
- `node:stream` (5)
- `internal:streams/compose` (4)
- `node:events` (3)
- `internal:streams/pipeline` (3)
- `internal:streams/duplex` (3)
- `internal:validators` (2)
- `node:fs` (1)
- `internal:shared` (1)

**Calls:**
- `node:fs` (7)
- `node:fs/promises` (6)
- `internal:fs/streams` (5)
- `internal:stream` (5)
- `node:stream` (5)
- `internal:streams/compose` (4)
- `node:events` (3)
- `internal:streams/pipeline` (3)
- `internal:streams/duplex` (3)
- `internal:validators` (2)
- `node:fs` (1)
- `internal:shared` (1)
- `internal:validators` (1)
- `internal:primordials` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` | Self: 0.0% (3.7ms) | Total: 1.6% (69.8ms) | Samples: 11

**Called by:**
- `some` (211)

**Calls:**
- `some` (200)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` | Self: 0.0% (3.0ms) | Total: 0.1% (4.3ms) | Samples: 9

**Called by:**
- `(module)` (13)

**Calls:**
- `max` (3)
- `map` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:144` | Self: 0.0% (2.7ms) | Total: 0.0% (2.7ms) | Samples: 8

**Called by:**
- `(module)` (8)

### `map`
`[native code]` | Self: 0.0% (2.0ms) | Total: 0.0% (2.0ms) | Samples: 6

**Called by:**
- `jacobiEigenSymmetric` (3)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (1)

### `max`
`[native code]` | Self: 0.0% (933us) | Total: 0.0% (933us) | Samples: 3

**Called by:**
- `jacobiEigenSymmetric` (3)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:181` | Self: 0.0% (718us) | Total: 0.0% (718us) | Samples: 2

**Called by:**
- `sort` (2)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 0.0% (643us) | Total: 100.0% (4.32s) | Samples: 2

**Calls:**
- `jacobiEigenSymmetric` (6121)
- `jacobiEigenSymmetric` (5882)
- `jacobiEigenSymmetric` (236)
- `jacobiEigenSymmetric` (214)
- `jacobiEigenSymmetric` (168)
- `jacobiEigenSymmetric` (133)
- `jacobiEigenSymmetric` (120)
- `jacobiEigenSymmetric` (111)
- `jacobiEigenSymmetric` (58)
- `(anonymous)` (16)
- `jacobiEigenSymmetric` (13)
- `jacobiEigenSymmetric` (8)
- `from` (3)
- `jacobiEigenSymmetric` (3)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (1)
- `writeFast` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:106` | Self: 0.0% (600us) | Total: 1.6% (70.7ms) | Samples: 2

**Called by:**
- `(module)` (214)

**Calls:**
- `validateSquareFiniteMatrix` (212)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 0.0% (375us) | Total: 0.0% (375us) | Samples: 1

**Called by:**
- `from` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:165` | Self: 0.0% (372us) | Total: 0.0% (372us) | Samples: 1

**Called by:**
- `(module)` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:180` | Self: 0.0% (368us) | Total: 0.0% (368us) | Samples: 1

**Called by:**
- `from` (1)

### `WriteStream`
`internal:fs/streams:198` | Self: 0.0% (359us) | Total: 0.0% (359us) | Samples: 1

**Called by:**
- `(anonymous)` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` | Self: 0.0% (346us) | Total: 0.0% (346us) | Samples: 1

**Called by:**
- `(module)` (1)

### `write`
`[native code]` | Self: 0.0% (309us) | Total: 0.0% (309us) | Samples: 1

**Called by:**
- `writeFast` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:114` | Self: 0.0% (278us) | Total: 0.0% (278us) | Samples: 1

**Called by:**
- `(module)` (1)

### `hideFromStack`
`internal:shared` | Self: 0.0% (277us) | Total: 0.0% (277us) | Samples: 1

**Called by:**
- `internal:validators` (1)

### `createSafeIterator`
`internal:primordials:3` | Self: 0.0% (265us) | Total: 0.0% (265us) | Samples: 1

**Called by:**
- `internal:primordials` (1)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (1.9ms) | Samples: 0

**Called by:**
- `anonymous` (6)

**Calls:**
- `anonymous` (6)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (911us) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (2.2ms) | Samples: 0

**Called by:**
- `anonymous` (7)

**Calls:**
- `anonymous` (7)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (5)

**Calls:**
- `anonymous` (5)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (634us) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `internal:validators`
`internal:validators:67` | Self: 0.0% (0us) | Total: 0.0% (277us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `hideFromStack` (1)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (1.3ms) | Samples: 0

**Called by:**
- `anonymous` (4)

**Calls:**
- `anonymous` (4)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` | Self: 0.0% (0us) | Total: 0.0% (965us) | Samples: 0

**Called by:**
- `(module)` (3)

**Calls:**
- `map` (3)

### `writeFast`
`internal:fs/streams:359` | Self: 0.0% (0us) | Total: 0.0% (309us) | Samples: 0

**Called by:**
- `(module)` (1)

**Calls:**
- `write` (1)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (1.0ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `node:fs`
`node:fs:299` | Self: 0.0% (0us) | Total: 0.0% (350us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.1% (5.3ms) | Samples: 0

**Called by:**
- `(module)` (16)

**Calls:**
- `anonymous` (9)
- `get WriteStream` (6)
- `WriteStream` (1)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` | Self: 0.0% (0us) | Total: 1.6% (70.1ms) | Samples: 0

**Called by:**
- `jacobiEigenSymmetric` (212)

**Calls:**
- `some` (212)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (1.0ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` | Self: 0.0% (0us) | Total: 0.0% (662us) | Samples: 0

**Called by:**
- `(module)` (2)

**Calls:**
- `map` (2)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (1.9ms) | Samples: 0

**Called by:**
- `(anonymous)` (6)

**Calls:**
- `anonymous` (6)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (5)

**Calls:**
- `anonymous` (5)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (5)

**Calls:**
- `anonymous` (5)

### `internal:primordials`
`internal:primordials:51` | Self: 0.0% (0us) | Total: 0.0% (265us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `createSafeIterator` (1)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (265us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 94.4% | 4.08s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 5.4% | 237.1ms | `[native code]` |
| 0.0% | 1.0ms | `/Users/jemanuel/projects/cmaes_explainer/[eval]` |
| 0.0% | 359us | `internal:fs/streams` |
| 0.0% | 277us | `internal:shared` |
| 0.0% | 265us | `internal:primordials` |
