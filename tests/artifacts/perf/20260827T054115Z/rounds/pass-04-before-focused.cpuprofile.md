# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 3.87s | 11723 | 250us | 61 |

**Top 10:** `jacobiEigenSymmetric` 54.0%, `jacobiEigenSymmetric` 33.0%, `hypot` 3.7%, `jacobiEigenSymmetric` 1.2%, `jacobiEigenSymmetric` 1.1%, `jacobiEigenSymmetric` 1.1%, `some` 1.0%, `jacobiEigenSymmetric` 1.0%, `(anonymous)` 0.8%, `jacobiEigenSymmetric` 0.5%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 54.0% | 2.09s | 56.3% | 2.18s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` |
| 33.0% | 1.27s | 34.4% | 1.33s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:139` |
| 3.7% | 145.7ms | 3.7% | 145.7ms | `hypot` | `[native code]` |
| 1.2% | 46.4ms | 1.2% | 46.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 1.1% | 44.4ms | 1.7% | 66.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 1.1% | 42.7ms | 1.1% | 42.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` |
| 1.0% | 41.7ms | 3.9% | 151.7ms | `some` | `[native code]` |
| 1.0% | 41.0ms | 1.0% | 41.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 0.8% | 32.5ms | 0.8% | 32.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.5% | 22.3ms | 0.5% | 22.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:114` |
| 0.5% | 22.0ms | 0.5% | 22.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.4% | 16.4ms | 0.4% | 16.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:163` |
| 0.2% | 9.1ms | 0.8% | 32.8ms | `from` | `[native code]` |
| 0.2% | 8.9ms | 0.5% | 22.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:180` |
| 0.1% | 5.0ms | 0.5% | 22.6ms | `anonymous` | `[native code]` |
| 0.1% | 3.8ms | 0.1% | 5.7ms | `sort` | `[native code]` |
| 0.0% | 2.5ms | 1.9% | 76.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 0.0% | 2.2ms | 0.1% | 3.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:144` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:181` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.0% | 1.1ms | 0.0% | 1.5ms | `map` | `[native code]` |
| 0.0% | 1.0ms | 0.0% | 1.0ms | `max` | `[native code]` |
| 0.0% | 1.0ms | 0.0% | 1.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` |
| 0.0% | 894us | 100.0% | 3.87s | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 677us | 0.0% | 677us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 648us | 0.0% | 648us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:88` |
| 0.0% | 392us | 0.0% | 392us | `hideFromStack` | `internal:shared` |
| 0.0% | 365us | 0.0% | 365us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 352us | 0.0% | 352us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:165` |
| 0.0% | 341us | 0.0% | 341us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 340us | 2.0% | 77.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:106` |
| 0.0% | 318us | 0.0% | 318us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:180` |
| 0.0% | 310us | 0.0% | 310us | `WriteStream` | `internal:fs/streams` |
| 0.0% | 305us | 0.0% | 305us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 284us | 0.0% | 284us | `@lazy` | `[native code]` |
| 0.0% | 282us | 0.0% | 282us | `EventEmitter` | `node:events` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 100.0% | 3.87s | 0.0% | 894us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 56.3% | 2.18s | 54.0% | 2.09s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` |
| 34.4% | 1.33s | 33.0% | 1.27s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:139` |
| 3.9% | 151.7ms | 1.0% | 41.7ms | `some` | `[native code]` |
| 3.7% | 145.7ms | 3.7% | 145.7ms | `hypot` | `[native code]` |
| 2.0% | 77.8ms | 0.0% | 340us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:106` |
| 1.9% | 76.8ms | 0.0% | 0us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 1.9% | 76.2ms | 0.0% | 2.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 1.7% | 66.4ms | 1.1% | 44.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 1.2% | 46.4ms | 1.2% | 46.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 1.1% | 42.7ms | 1.1% | 42.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` |
| 1.0% | 41.0ms | 1.0% | 41.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 0.8% | 32.8ms | 0.2% | 9.1ms | `from` | `[native code]` |
| 0.8% | 32.5ms | 0.8% | 32.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.5% | 22.6ms | 0.1% | 5.0ms | `anonymous` | `[native code]` |
| 0.5% | 22.4ms | 0.2% | 8.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:180` |
| 0.5% | 22.3ms | 0.5% | 22.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:114` |
| 0.5% | 22.0ms | 0.5% | 22.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.4% | 16.4ms | 0.4% | 16.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:163` |
| 0.1% | 6.3ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.1% | 5.7ms | 0.1% | 3.8ms | `sort` | `[native code]` |
| 0.1% | 3.8ms | 0.0% | 2.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 2.8ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 2.5ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 2.1ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:144` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:181` |
| 0.0% | 1.8ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 1.8ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 1.8ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 1.5ms | 0.0% | 1.1ms | `map` | `[native code]` |
| 0.0% | 1.4ms | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.0% | 1.0ms | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 1.0ms | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 1.0ms | 0.0% | 1.0ms | `max` | `[native code]` |
| 0.0% | 1.0ms | 0.0% | 1.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` |
| 0.0% | 747us | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 677us | 0.0% | 677us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 660us | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 648us | 0.0% | 648us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:88` |
| 0.0% | 392us | 0.0% | 0us | `internal:validators` | `internal:validators:67` |
| 0.0% | 392us | 0.0% | 392us | `hideFromStack` | `internal:shared` |
| 0.0% | 378us | 0.0% | 0us | `internal:streams/readable` | `internal:streams/readable:14` |
| 0.0% | 365us | 0.0% | 365us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 363us | 0.0% | 0us | `internal:streams/operators` | `internal:streams/operators:2` |
| 0.0% | 355us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 355us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 352us | 0.0% | 352us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:165` |
| 0.0% | 341us | 0.0% | 341us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 318us | 0.0% | 318us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:180` |
| 0.0% | 310us | 0.0% | 310us | `WriteStream` | `internal:fs/streams` |
| 0.0% | 305us | 0.0% | 305us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 284us | 0.0% | 284us | `@lazy` | `[native code]` |
| 0.0% | 284us | 0.0% | 0us | `internal:fs/binding` | `internal:fs/binding:3` |
| 0.0% | 283us | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.0% | 282us | 0.0% | 0us | `Stream` | `internal:streams/legacy:4` |
| 0.0% | 282us | 0.0% | 0us | `WriteStream` | `internal:fs/streams:259` |
| 0.0% | 282us | 0.0% | 0us | `Writable` | `internal:streams/writable:196` |
| 0.0% | 282us | 0.0% | 282us | `EventEmitter` | `node:events` |
| 0.0% | 281us | 0.0% | 0us | `internal:fs/glob` | `internal:fs/glob:2` |

## Function Details

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` | Self: 54.0% (2.09s) | Total: 56.3% (2.18s) | Samples: 6340

**Called by:**
- `(module)` (6616)

**Calls:**
- `hypot` (276)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:139` | Self: 33.0% (1.27s) | Total: 34.4% (1.33s) | Samples: 3875

**Called by:**
- `(module)` (4041)

**Calls:**
- `hypot` (166)

### `hypot`
`[native code]` | Self: 3.7% (145.7ms) | Total: 3.7% (145.7ms) | Samples: 442

**Called by:**
- `jacobiEigenSymmetric` (276)
- `jacobiEigenSymmetric` (166)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` | Self: 1.2% (46.4ms) | Total: 1.2% (46.4ms) | Samples: 142

**Called by:**
- `(module)` (142)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 1.1% (44.4ms) | Total: 1.7% (66.4ms) | Samples: 138

**Called by:**
- `(module)` (206)

**Calls:**
- `from` (68)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` | Self: 1.1% (42.7ms) | Total: 1.1% (42.7ms) | Samples: 130

**Called by:**
- `(module)` (130)

### `some`
`[native code]` | Self: 1.0% (41.7ms) | Total: 3.9% (151.7ms) | Samples: 129

**Called by:**
- `validateSquareFiniteMatrix` (236)
- `(anonymous)` (226)
- `some` (4)

**Calls:**
- `(anonymous)` (234)
- `(anonymous)` (99)
- `some` (4)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` | Self: 1.0% (41.0ms) | Total: 1.0% (41.0ms) | Samples: 117

**Called by:**
- `(module)` (117)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.8% (32.5ms) | Total: 0.8% (32.5ms) | Samples: 99

**Called by:**
- `some` (99)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:114` | Self: 0.5% (22.3ms) | Total: 0.5% (22.3ms) | Samples: 67

**Called by:**
- `(module)` (67)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.5% (22.0ms) | Total: 0.5% (22.0ms) | Samples: 68

**Called by:**
- `from` (68)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:163` | Self: 0.4% (16.4ms) | Total: 0.4% (16.4ms) | Samples: 50

**Called by:**
- `(module)` (50)

### `from`
`[native code]` | Self: 0.2% (9.1ms) | Total: 0.8% (32.8ms) | Samples: 24

**Called by:**
- `jacobiEigenSymmetric` (68)
- `jacobiEigenSymmetric` (24)
- `(module)` (3)
- `from` (2)

**Calls:**
- `(anonymous)` (68)
- `from` (2)
- `(anonymous)` (2)
- `(anonymous)` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:180` | Self: 0.2% (8.9ms) | Total: 0.5% (22.4ms) | Samples: 18

**Called by:**
- `(module)` (60)

**Calls:**
- `from` (24)
- `sort` (18)

### `anonymous`
`[native code]` | Self: 0.1% (5.0ms) | Total: 0.5% (22.6ms) | Samples: 15

**Called by:**
- `(anonymous)` (11)
- `node:fs` (9)
- `node:fs/promises` (8)
- `get WriteStream` (6)
- `internal:fs/streams` (5)
- `internal:stream` (5)
- `node:stream` (5)
- `internal:streams/compose` (4)
- `internal:streams/pipeline` (3)
- `internal:streams/duplex` (3)
- `node:events` (2)
- `internal:validators` (1)
- `internal:fs/glob` (1)
- `internal:streams/readable` (1)
- `internal:shared` (1)
- `internal:streams/operators` (1)

**Calls:**
- `node:fs` (9)
- `node:fs/promises` (8)
- `internal:fs/streams` (5)
- `internal:stream` (5)
- `node:stream` (5)
- `internal:streams/compose` (4)
- `internal:streams/pipeline` (3)
- `internal:streams/duplex` (3)
- `node:events` (2)
- `internal:validators` (1)
- `internal:fs/glob` (1)
- `internal:streams/readable` (1)
- `internal:shared` (1)
- `internal:streams/operators` (1)
- `internal:validators` (1)
- `internal:fs/binding` (1)

### `sort`
`[native code]` | Self: 0.1% (3.8ms) | Total: 0.1% (5.7ms) | Samples: 12

**Called by:**
- `jacobiEigenSymmetric` (18)

**Calls:**
- `(anonymous)` (6)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` | Self: 0.0% (2.5ms) | Total: 1.9% (76.2ms) | Samples: 8

**Called by:**
- `some` (234)

**Calls:**
- `some` (226)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` | Self: 0.0% (2.2ms) | Total: 0.1% (3.8ms) | Samples: 7

**Called by:**
- `(module)` (12)

**Calls:**
- `max` (3)
- `map` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:144` | Self: 0.0% (1.9ms) | Total: 0.0% (1.9ms) | Samples: 6

**Called by:**
- `(module)` (6)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:181` | Self: 0.0% (1.9ms) | Total: 0.0% (1.9ms) | Samples: 6

**Called by:**
- `sort` (6)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 4

**Called by:**
- `(module)` (4)

### `map`
`[native code]` | Self: 0.0% (1.1ms) | Total: 0.0% (1.5ms) | Samples: 4

**Called by:**
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (1)

**Calls:**
- `(anonymous)` (1)

### `max`
`[native code]` | Self: 0.0% (1.0ms) | Total: 0.0% (1.0ms) | Samples: 3

**Called by:**
- `jacobiEigenSymmetric` (3)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` | Self: 0.0% (1.0ms) | Total: 0.0% (1.0ms) | Samples: 2

**Called by:**
- `(module)` (2)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 0.0% (894us) | Total: 100.0% (3.87s) | Samples: 3

**Calls:**
- `jacobiEigenSymmetric` (6616)
- `jacobiEigenSymmetric` (4041)
- `jacobiEigenSymmetric` (239)
- `jacobiEigenSymmetric` (206)
- `jacobiEigenSymmetric` (142)
- `jacobiEigenSymmetric` (130)
- `jacobiEigenSymmetric` (117)
- `jacobiEigenSymmetric` (67)
- `jacobiEigenSymmetric` (60)
- `jacobiEigenSymmetric` (50)
- `(anonymous)` (19)
- `jacobiEigenSymmetric` (12)
- `jacobiEigenSymmetric` (6)
- `jacobiEigenSymmetric` (4)
- `from` (3)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 0.0% (677us) | Total: 0.0% (677us) | Samples: 2

**Called by:**
- `from` (2)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:88` | Self: 0.0% (648us) | Total: 0.0% (648us) | Samples: 2

**Called by:**
- `jacobiEigenSymmetric` (2)

### `hideFromStack`
`internal:shared` | Self: 0.0% (392us) | Total: 0.0% (392us) | Samples: 1

**Called by:**
- `internal:validators` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` | Self: 0.0% (365us) | Total: 0.0% (365us) | Samples: 1

**Called by:**
- `map` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:165` | Self: 0.0% (352us) | Total: 0.0% (352us) | Samples: 1

**Called by:**
- `(module)` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (341us) | Total: 0.0% (341us) | Samples: 1

**Called by:**
- `(module)` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:106` | Self: 0.0% (340us) | Total: 2.0% (77.8ms) | Samples: 1

**Called by:**
- `(module)` (239)

**Calls:**
- `validateSquareFiniteMatrix` (236)
- `validateSquareFiniteMatrix` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:180` | Self: 0.0% (318us) | Total: 0.0% (318us) | Samples: 1

**Called by:**
- `from` (1)

### `WriteStream`
`internal:fs/streams` | Self: 0.0% (310us) | Total: 0.0% (310us) | Samples: 1

**Called by:**
- `(anonymous)` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` | Self: 0.0% (305us) | Total: 0.0% (305us) | Samples: 1

**Called by:**
- `(module)` (1)

### `@lazy`
`[native code]` | Self: 0.0% (284us) | Total: 0.0% (284us) | Samples: 1

**Called by:**
- `internal:fs/binding` (1)

### `EventEmitter`
`node:events` | Self: 0.0% (282us) | Total: 0.0% (282us) | Samples: 1

**Called by:**
- `Stream` (1)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (2.5ms) | Samples: 0

**Called by:**
- `anonymous` (8)

**Calls:**
- `anonymous` (8)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (747us) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.8ms) | Samples: 0

**Called by:**
- `anonymous` (5)

**Calls:**
- `anonymous` (5)

### `internal:streams/operators`
`internal:streams/operators:2` | Self: 0.0% (0us) | Total: 0.0% (363us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.8ms) | Samples: 0

**Called by:**
- `anonymous` (5)

**Calls:**
- `anonymous` (5)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `anonymous` (4)

**Calls:**
- `anonymous` (4)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` | Self: 0.0% (0us) | Total: 0.0% (283us) | Samples: 0

**Called by:**
- `(module)` (1)

**Calls:**
- `map` (1)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` | Self: 0.0% (0us) | Total: 1.9% (76.8ms) | Samples: 0

**Called by:**
- `jacobiEigenSymmetric` (236)

**Calls:**
- `some` (236)

### `internal:streams/readable`
`internal:streams/readable:14` | Self: 0.0% (0us) | Total: 0.0% (378us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (355us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:fs/binding`
`internal:fs/binding:3` | Self: 0.0% (0us) | Total: 0.0% (284us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `@lazy` (1)

### `internal:validators`
`internal:validators:67` | Self: 0.0% (0us) | Total: 0.0% (392us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `hideFromStack` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` | Self: 0.0% (0us) | Total: 0.0% (660us) | Samples: 0

**Called by:**
- `(module)` (2)

**Calls:**
- `map` (2)

### `WriteStream`
`internal:fs/streams:259` | Self: 0.0% (0us) | Total: 0.0% (282us) | Samples: 0

**Called by:**
- `(anonymous)` (1)

**Calls:**
- `Writable` (1)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (2.1ms) | Samples: 0

**Called by:**
- `(anonymous)` (6)

**Calls:**
- `anonymous` (6)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (1.0ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.1% (6.3ms) | Samples: 0

**Called by:**
- `(module)` (19)

**Calls:**
- `anonymous` (11)
- `get WriteStream` (6)
- `WriteStream` (1)
- `WriteStream` (1)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (355us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:fs/glob`
`internal:fs/glob:2` | Self: 0.0% (0us) | Total: 0.0% (281us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `Stream`
`internal:streams/legacy:4` | Self: 0.0% (0us) | Total: 0.0% (282us) | Samples: 0

**Called by:**
- `Writable` (1)

**Calls:**
- `EventEmitter` (1)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (1.8ms) | Samples: 0

**Called by:**
- `anonymous` (5)

**Calls:**
- `anonymous` (5)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (2.8ms) | Samples: 0

**Called by:**
- `anonymous` (9)

**Calls:**
- `anonymous` (9)

### `Writable`
`internal:streams/writable:196` | Self: 0.0% (0us) | Total: 0.0% (282us) | Samples: 0

**Called by:**
- `WriteStream` (1)

**Calls:**
- `Stream` (1)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (1.0ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 94.5% | 3.65s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 5.3% | 208.1ms | `[native code]` |
| 0.0% | 1.5ms | `/Users/jemanuel/projects/cmaes_explainer/[eval]` |
| 0.0% | 392us | `internal:shared` |
| 0.0% | 310us | `internal:fs/streams` |
| 0.0% | 282us | `node:events` |
