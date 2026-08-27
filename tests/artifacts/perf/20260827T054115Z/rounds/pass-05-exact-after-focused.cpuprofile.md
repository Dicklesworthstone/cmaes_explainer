# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 4.10s | 12420 | 250us | 52 |

**Top 10:** `jacobiEigenSymmetric` 88.4%, `hypot` 3.2%, `jacobiEigenSymmetric` 1.2%, `jacobiEigenSymmetric` 1.2%, `some` 1.1%, `jacobiEigenSymmetric` 1.0%, `jacobiEigenSymmetric` 0.8%, `jacobiEigenSymmetric` 0.6%, `(anonymous)` 0.5%, `(anonymous)` 0.4%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 88.4% | 3.62s | 91.6% | 3.75s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 3.2% | 131.5ms | 3.2% | 131.5ms | `hypot` | `[native code]` |
| 1.2% | 51.6ms | 1.7% | 72.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:193` |
| 1.2% | 51.0ms | 1.2% | 51.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 1.1% | 45.3ms | 3.3% | 136.2ms | `some` | `[native code]` |
| 1.0% | 43.4ms | 1.0% | 43.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 0.8% | 34.5ms | 0.8% | 34.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 0.6% | 24.7ms | 0.6% | 24.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:169` |
| 0.5% | 22.1ms | 0.5% | 22.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.4% | 17.7ms | 0.4% | 17.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:193` |
| 0.3% | 15.9ms | 0.3% | 15.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:150` |
| 0.1% | 5.1ms | 0.1% | 7.5ms | `sort` | `[native code]` |
| 0.1% | 5.0ms | 0.3% | 14.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.1% | 4.8ms | 0.5% | 21.5ms | `anonymous` | `[native code]` |
| 0.1% | 4.1ms | 0.6% | 27.1ms | `from` | `[native code]` |
| 0.0% | 2.5ms | 0.1% | 4.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.0% | 2.3ms | 1.6% | 68.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `max` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `map` | `[native code]` |
| 0.0% | 1.0ms | 0.0% | 1.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:129` |
| 0.0% | 729us | 0.0% | 729us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 653us | 1.7% | 69.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 0.0% | 384us | 100.0% | 4.10s | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 380us | 0.0% | 380us | `Float64Array` | `[native code]` |
| 0.0% | 377us | 0.0% | 377us | `writeFast` | `internal:fs/streams` |
| 0.0% | 372us | 0.0% | 372us | `node:fs/promises` | `node:fs/promises:200` |
| 0.0% | 346us | 0.0% | 346us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:196` |
| 0.0% | 327us | 0.0% | 327us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` |
| 0.0% | 284us | 0.0% | 284us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 283us | 0.0% | 283us | `Map` | `[native code]` |
| 0.0% | 265us | 0.0% | 265us | `hideFromStack` | `internal:shared` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 100.0% | 4.10s | 0.0% | 384us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 91.6% | 3.75s | 88.4% | 3.62s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 3.3% | 136.2ms | 1.1% | 45.3ms | `some` | `[native code]` |
| 3.2% | 131.5ms | 3.2% | 131.5ms | `hypot` | `[native code]` |
| 1.7% | 72.2ms | 1.2% | 51.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:193` |
| 1.7% | 69.7ms | 0.0% | 653us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 1.6% | 69.1ms | 0.0% | 0us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 1.6% | 68.4ms | 0.0% | 2.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 1.2% | 51.0ms | 1.2% | 51.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 1.0% | 43.8ms | 1.0% | 43.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 0.8% | 34.5ms | 0.8% | 34.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 0.6% | 27.1ms | 0.1% | 4.1ms | `from` | `[native code]` |
| 0.6% | 24.7ms | 0.6% | 24.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:169` |
| 0.5% | 22.1ms | 0.5% | 22.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.5% | 21.5ms | 0.1% | 4.8ms | `anonymous` | `[native code]` |
| 0.4% | 17.7ms | 0.4% | 17.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:193` |
| 0.3% | 15.9ms | 0.3% | 15.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:150` |
| 0.3% | 14.2ms | 0.1% | 5.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.1% | 7.5ms | 0.1% | 5.1ms | `sort` | `[native code]` |
| 0.1% | 5.7ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.1% | 4.8ms | 0.0% | 2.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.0% | 2.8ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 2.4ms | 0.0% | 2.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.0% | 2.3ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 1.9ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 1.9ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]` |
| 0.0% | 1.8ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `max` | `[native code]` |
| 0.0% | 1.6ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `map` | `[native code]` |
| 0.0% | 1.3ms | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 1.0ms | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 1.0ms | 0.0% | 1.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:129` |
| 0.0% | 917us | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 854us | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` |
| 0.0% | 729us | 0.0% | 729us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |
| 0.0% | 702us | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 652us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 652us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 380us | 0.0% | 380us | `Float64Array` | `[native code]` |
| 0.0% | 377us | 0.0% | 377us | `writeFast` | `internal:fs/streams` |
| 0.0% | 372us | 0.0% | 372us | `node:fs/promises` | `node:fs/promises:200` |
| 0.0% | 346us | 0.0% | 346us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:196` |
| 0.0% | 327us | 0.0% | 327us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` |
| 0.0% | 292us | 0.0% | 0us | `internal:stream` | `internal:stream:48` |
| 0.0% | 284us | 0.0% | 284us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 283us | 0.0% | 0us | `makeSafe` | `internal:primordials:30` |
| 0.0% | 283us | 0.0% | 283us | `Map` | `[native code]` |
| 0.0% | 283us | 0.0% | 0us | `internal:primordials` | `internal:primordials:73` |
| 0.0% | 265us | 0.0% | 0us | `internal:validators` | `internal:validators:67` |
| 0.0% | 265us | 0.0% | 265us | `hideFromStack` | `internal:shared` |

## Function Details

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` | Self: 88.4% (3.62s) | Total: 91.6% (3.75s) | Samples: 10992

**Called by:**
- `(module)` (11400)

**Calls:**
- `hypot` (408)

### `hypot`
`[native code]` | Self: 3.2% (131.5ms) | Total: 3.2% (131.5ms) | Samples: 408

**Called by:**
- `jacobiEigenSymmetric` (408)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:193` | Self: 1.2% (51.6ms) | Total: 1.7% (72.2ms) | Samples: 160

**Called by:**
- `(module)` (224)

**Calls:**
- `from` (64)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` | Self: 1.2% (51.0ms) | Total: 1.2% (51.0ms) | Samples: 127

**Called by:**
- `(module)` (127)

### `some`
`[native code]` | Self: 1.1% (45.3ms) | Total: 3.3% (136.2ms) | Samples: 139

**Called by:**
- `validateSquareFiniteMatrix` (211)
- `(anonymous)` (202)
- `some` (3)

**Calls:**
- `(anonymous)` (209)
- `(anonymous)` (65)
- `some` (3)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` | Self: 1.0% (43.4ms) | Total: 1.0% (43.8ms) | Samples: 133

**Called by:**
- `(module)` (134)

**Calls:**
- `Float64Array` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` | Self: 0.8% (34.5ms) | Total: 0.8% (34.5ms) | Samples: 106

**Called by:**
- `(module)` (106)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:169` | Self: 0.6% (24.7ms) | Total: 0.6% (24.7ms) | Samples: 76

**Called by:**
- `(module)` (76)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.5% (22.1ms) | Total: 0.5% (22.1ms) | Samples: 67

**Called by:**
- `some` (65)
- `from` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:193` | Self: 0.4% (17.7ms) | Total: 0.4% (17.7ms) | Samples: 55

**Called by:**
- `from` (55)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:150` | Self: 0.3% (15.9ms) | Total: 0.3% (15.9ms) | Samples: 48

**Called by:**
- `(module)` (48)

### `sort`
`[native code]` | Self: 0.1% (5.1ms) | Total: 0.1% (7.5ms) | Samples: 16

**Called by:**
- `jacobiEigenSymmetric` (24)

**Calls:**
- `(anonymous)` (8)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` | Self: 0.1% (5.0ms) | Total: 0.3% (14.2ms) | Samples: 15

**Called by:**
- `(module)` (44)

**Calls:**
- `sort` (24)
- `from` (5)

### `anonymous`
`[native code]` | Self: 0.1% (4.8ms) | Total: 0.5% (21.5ms) | Samples: 15

**Called by:**
- `(anonymous)` (11)
- `node:fs` (9)
- `get WriteStream` (7)
- `internal:fs/streams` (6)
- `node:fs/promises` (6)
- `node:stream` (6)
- `internal:stream` (5)
- `internal:streams/compose` (4)
- `node:events` (3)
- `internal:streams/pipeline` (3)
- `internal:validators` (2)
- `internal:shared` (2)
- `internal:streams/duplex` (2)
- `internal:stream` (1)

**Calls:**
- `node:fs` (9)
- `internal:fs/streams` (6)
- `node:fs/promises` (6)
- `node:stream` (6)
- `internal:stream` (5)
- `internal:streams/compose` (4)
- `node:events` (3)
- `internal:streams/pipeline` (3)
- `internal:validators` (2)
- `internal:shared` (2)
- `internal:streams/duplex` (2)
- `internal:stream` (1)
- `internal:primordials` (1)
- `node:fs/promises` (1)
- `internal:validators` (1)

### `from`
`[native code]` | Self: 0.1% (4.1ms) | Total: 0.6% (27.1ms) | Samples: 13

**Called by:**
- `jacobiEigenSymmetric` (64)
- `jacobiEigenSymmetric` (5)
- `(module)` (3)
- `from` (3)

**Calls:**
- `(anonymous)` (55)
- `from` (3)
- `(anonymous)` (2)
- `(anonymous)` (1)
- `(anonymous)` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.0% (2.5ms) | Total: 0.1% (4.8ms) | Samples: 8

**Called by:**
- `(module)` (15)

**Calls:**
- `max` (5)
- `map` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.0% (2.4ms) | Total: 0.0% (2.4ms) | Samples: 8

**Called by:**
- `sort` (8)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (2.3ms) | Total: 1.6% (68.4ms) | Samples: 7

**Called by:**
- `some` (209)

**Calls:**
- `some` (202)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]` | Self: 0.0% (1.8ms) | Total: 0.0% (1.8ms) | Samples: 1

**Called by:**
- `from` (1)

### `max`
`[native code]` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 5

**Called by:**
- `jacobiEigenSymmetric` (5)

### `map`
`[native code]` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 5

**Called by:**
- `jacobiEigenSymmetric` (3)
- `jacobiEigenSymmetric` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:129` | Self: 0.0% (1.0ms) | Total: 0.0% (1.0ms) | Samples: 3

**Called by:**
- `(module)` (3)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` | Self: 0.0% (729us) | Total: 0.0% (729us) | Samples: 2

**Called by:**
- `(module)` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` | Self: 0.0% (653us) | Total: 1.7% (69.7ms) | Samples: 2

**Called by:**
- `(module)` (213)

**Calls:**
- `validateSquareFiniteMatrix` (211)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 0.0% (384us) | Total: 100.0% (4.10s) | Samples: 1

**Calls:**
- `jacobiEigenSymmetric` (11400)
- `jacobiEigenSymmetric` (224)
- `jacobiEigenSymmetric` (213)
- `jacobiEigenSymmetric` (134)
- `jacobiEigenSymmetric` (127)
- `jacobiEigenSymmetric` (106)
- `jacobiEigenSymmetric` (76)
- `jacobiEigenSymmetric` (48)
- `jacobiEigenSymmetric` (44)
- `(anonymous)` (18)
- `jacobiEigenSymmetric` (15)
- `jacobiEigenSymmetric` (3)
- `from` (3)
- `jacobiEigenSymmetric` (3)
- `jacobiEigenSymmetric` (2)
- `writeFast` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)

### `Float64Array`
`[native code]` | Self: 0.0% (380us) | Total: 0.0% (380us) | Samples: 1

**Called by:**
- `jacobiEigenSymmetric` (1)

### `writeFast`
`internal:fs/streams` | Self: 0.0% (377us) | Total: 0.0% (377us) | Samples: 1

**Called by:**
- `(module)` (1)

### `node:fs/promises`
`node:fs/promises:200` | Self: 0.0% (372us) | Total: 0.0% (372us) | Samples: 1

**Called by:**
- `anonymous` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:196` | Self: 0.0% (346us) | Total: 0.0% (346us) | Samples: 1

**Called by:**
- `(module)` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:140` | Self: 0.0% (327us) | Total: 0.0% (327us) | Samples: 1

**Called by:**
- `(module)` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 0.0% (284us) | Total: 0.0% (284us) | Samples: 1

**Called by:**
- `from` (1)

### `Map`
`[native code]` | Self: 0.0% (283us) | Total: 0.0% (283us) | Samples: 1

**Called by:**
- `makeSafe` (1)

### `hideFromStack`
`internal:shared` | Self: 0.0% (265us) | Total: 0.0% (265us) | Samples: 1

**Called by:**
- `internal:validators` (1)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (917us) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` | Self: 0.0% (0us) | Total: 0.0% (854us) | Samples: 0

**Called by:**
- `(module)` (3)

**Calls:**
- `map` (3)

### `makeSafe`
`internal:primordials:30` | Self: 0.0% (0us) | Total: 0.0% (283us) | Samples: 0

**Called by:**
- `internal:primordials` (1)

**Calls:**
- `Map` (1)

### `internal:validators`
`internal:validators:67` | Self: 0.0% (0us) | Total: 0.0% (265us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `hideFromStack` (1)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (1.8ms) | Samples: 0

**Called by:**
- `anonymous` (6)

**Calls:**
- `anonymous` (6)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (702us) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (652us) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (5)

**Calls:**
- `anonymous` (5)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (0us) | Total: 1.6% (69.1ms) | Samples: 0

**Called by:**
- `jacobiEigenSymmetric` (211)

**Calls:**
- `some` (211)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (652us) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (1.0ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `internal:stream`
`internal:stream:48` | Self: 0.0% (0us) | Total: 0.0% (292us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.1% (5.7ms) | Samples: 0

**Called by:**
- `(module)` (18)

**Calls:**
- `anonymous` (11)
- `get WriteStream` (7)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (2.8ms) | Samples: 0

**Called by:**
- `anonymous` (9)

**Calls:**
- `anonymous` (9)

### `internal:primordials`
`internal:primordials:73` | Self: 0.0% (0us) | Total: 0.0% (283us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `makeSafe` (1)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.9ms) | Samples: 0

**Called by:**
- `anonymous` (6)

**Calls:**
- `anonymous` (6)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (1.3ms) | Samples: 0

**Called by:**
- `anonymous` (4)

**Calls:**
- `anonymous` (4)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (2.3ms) | Samples: 0

**Called by:**
- `(anonymous)` (7)

**Calls:**
- `anonymous` (7)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (1.9ms) | Samples: 0

**Called by:**
- `anonymous` (6)

**Calls:**
- `anonymous` (6)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 95.1% | 3.90s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 4.7% | 194.9ms | `[native code]` |
| 0.0% | 2.5ms | `/Users/jemanuel/projects/cmaes_explainer/[eval]` |
| 0.0% | 377us | `internal:fs/streams` |
| 0.0% | 372us | `node:fs/promises` |
| 0.0% | 265us | `internal:shared` |
