# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 4.54s | 13698 | 250us | 52 |

**Top 10:** `jacobiEigenSymmetric` 87.8%, `hypot` 3.4%, `some` 1.3%, `jacobiEigenSymmetric` 1.2%, `jacobiEigenSymmetric` 1.0%, `jacobiEigenSymmetric` 0.8%, `jacobiEigenSymmetric` 0.8%, `(anonymous)` 0.6%, `(anonymous)` 0.5%, `jacobiEigenSymmetric` 0.5%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 87.8% | 3.99s | 91.3% | 4.14s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 3.4% | 157.9ms | 3.4% | 157.9ms | `hypot` | `[native code]` |
| 1.3% | 62.7ms | 4.0% | 184.1ms | `some` | `[native code]` |
| 1.2% | 55.9ms | 1.8% | 83.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:193` |
| 1.0% | 45.5ms | 1.0% | 45.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 0.8% | 38.2ms | 0.8% | 38.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.8% | 38.0ms | 0.8% | 38.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 0.6% | 28.9ms | 0.6% | 28.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.5% | 26.2ms | 0.5% | 26.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:193` |
| 0.5% | 24.3ms | 0.5% | 24.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:169` |
| 0.3% | 15.3ms | 0.6% | 27.9ms | `sort` | `[native code]` |
| 0.3% | 15.0ms | 0.3% | 15.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:150` |
| 0.2% | 12.6ms | 0.2% | 12.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.1% | 7.8ms | 0.8% | 37.7ms | `from` | `[native code]` |
| 0.0% | 4.4ms | 0.4% | 19.8ms | `anonymous` | `[native code]` |
| 0.0% | 3.0ms | 0.0% | 4.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.0% | 2.8ms | 0.8% | 36.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 2.3ms | 2.0% | 92.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.0% | 1.9ms | 100.0% | 4.54s | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 1.4ms | 0.0% | 1.7ms | `map` | `[native code]` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:129` |
| 0.0% | 766us | 0.0% | 766us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 638us | 0.0% | 638us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:119` |
| 0.0% | 625us | 0.0% | 625us | `max` | `[native code]` |
| 0.0% | 374us | 0.0% | 374us | `defineProperty` | `[native code]` |
| 0.0% | 373us | 0.0% | 373us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:171` |
| 0.0% | 366us | 0.0% | 366us | `WriteStream` | `internal:fs/streams` |
| 0.0% | 340us | 0.0% | 340us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:196` |
| 0.0% | 334us | 2.0% | 93.3ms | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.0% | 325us | 0.0% | 325us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:192` |
| 0.0% | 300us | 0.0% | 300us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:154` |
| 0.0% | 271us | 2.0% | 93.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 0.0% | 270us | 0.0% | 270us | `makeSafe` | `internal:primordials` |
| 0.0% | 270us | 0.0% | 270us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 100.0% | 4.54s | 0.0% | 1.9ms | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 91.3% | 4.14s | 87.8% | 3.99s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 4.0% | 184.1ms | 1.3% | 62.7ms | `some` | `[native code]` |
| 3.4% | 157.9ms | 3.4% | 157.9ms | `hypot` | `[native code]` |
| 2.0% | 93.6ms | 0.0% | 271us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 2.0% | 93.3ms | 0.0% | 334us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 2.0% | 92.5ms | 0.0% | 2.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 1.8% | 83.8ms | 1.2% | 55.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:193` |
| 1.0% | 45.5ms | 1.0% | 45.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 0.8% | 38.3ms | 0.8% | 38.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 0.8% | 38.2ms | 0.8% | 38.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.8% | 37.7ms | 0.1% | 7.8ms | `from` | `[native code]` |
| 0.8% | 36.5ms | 0.0% | 2.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.6% | 28.9ms | 0.6% | 28.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.6% | 27.9ms | 0.3% | 15.3ms | `sort` | `[native code]` |
| 0.5% | 26.2ms | 0.5% | 26.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:193` |
| 0.5% | 24.3ms | 0.5% | 24.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:169` |
| 0.4% | 19.8ms | 0.0% | 4.4ms | `anonymous` | `[native code]` |
| 0.3% | 15.0ms | 0.3% | 15.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:150` |
| 0.2% | 12.6ms | 0.2% | 12.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.1% | 5.4ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.0% | 4.4ms | 0.0% | 3.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.0% | 2.8ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 1.8ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 1.7ms | 0.0% | 1.4ms | `map` | `[native code]` |
| 0.0% | 1.6ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 1.6ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 1.6ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 1.6ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 1.3ms | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:129` |
| 0.0% | 1.0ms | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 1.0ms | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 832us | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 766us | 0.0% | 766us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 689us | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:192` |
| 0.0% | 638us | 0.0% | 638us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:119` |
| 0.0% | 625us | 0.0% | 625us | `max` | `[native code]` |
| 0.0% | 559us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 374us | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:141` |
| 0.0% | 374us | 0.0% | 374us | `defineProperty` | `[native code]` |
| 0.0% | 374us | 0.0% | 0us | `asyncWrap` | `node:fs/promises:249` |
| 0.0% | 373us | 0.0% | 373us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:171` |
| 0.0% | 366us | 0.0% | 366us | `WriteStream` | `internal:fs/streams` |
| 0.0% | 340us | 0.0% | 340us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:196` |
| 0.0% | 338us | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` |
| 0.0% | 325us | 0.0% | 325us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:192` |
| 0.0% | 300us | 0.0% | 300us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:154` |
| 0.0% | 270us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 270us | 0.0% | 270us | `makeSafe` | `internal:primordials` |
| 0.0% | 270us | 0.0% | 0us | `internal:primordials` | `internal:primordials:73` |
| 0.0% | 270us | 0.0% | 270us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` |

## Function Details

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` | Self: 87.8% (3.99s) | Total: 91.3% (4.14s) | Samples: 12044

**Called by:**
- `(module)` (12526)

**Calls:**
- `hypot` (482)

### `hypot`
`[native code]` | Self: 3.4% (157.9ms) | Total: 3.4% (157.9ms) | Samples: 482

**Called by:**
- `jacobiEigenSymmetric` (482)

### `some`
`[native code]` | Self: 1.3% (62.7ms) | Total: 4.0% (184.1ms) | Samples: 170

**Called by:**
- `validateSquareFiniteMatrix` (262)
- `(anonymous)` (253)
- `some` (3)

**Calls:**
- `(anonymous)` (260)
- `(anonymous)` (85)
- `some` (3)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:193` | Self: 1.2% (55.9ms) | Total: 1.8% (83.8ms) | Samples: 172

**Called by:**
- `(module)` (248)

**Calls:**
- `from` (76)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` | Self: 1.0% (45.5ms) | Total: 1.0% (45.5ms) | Samples: 140

**Called by:**
- `(module)` (140)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` | Self: 0.8% (38.2ms) | Total: 0.8% (38.2ms) | Samples: 117

**Called by:**
- `(module)` (117)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` | Self: 0.8% (38.0ms) | Total: 0.8% (38.3ms) | Samples: 116

**Called by:**
- `(module)` (117)

**Calls:**
- `(anonymous)` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.6% (28.9ms) | Total: 0.6% (28.9ms) | Samples: 88

**Called by:**
- `some` (85)
- `from` (2)
- `jacobiEigenSymmetric` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:193` | Self: 0.5% (26.2ms) | Total: 0.5% (26.2ms) | Samples: 72

**Called by:**
- `from` (72)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:169` | Self: 0.5% (24.3ms) | Total: 0.5% (24.3ms) | Samples: 76

**Called by:**
- `(module)` (76)

### `sort`
`[native code]` | Self: 0.3% (15.3ms) | Total: 0.6% (27.9ms) | Samples: 47

**Called by:**
- `jacobiEigenSymmetric` (87)

**Calls:**
- `(anonymous)` (40)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:150` | Self: 0.3% (15.0ms) | Total: 0.3% (15.0ms) | Samples: 46

**Called by:**
- `(module)` (46)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.2% (12.6ms) | Total: 0.2% (12.6ms) | Samples: 40

**Called by:**
- `sort` (40)

### `from`
`[native code]` | Self: 0.1% (7.8ms) | Total: 0.8% (37.7ms) | Samples: 19

**Called by:**
- `jacobiEigenSymmetric` (76)
- `jacobiEigenSymmetric` (17)
- `(module)` (2)
- `from` (2)

**Calls:**
- `(anonymous)` (72)
- `(anonymous)` (2)
- `from` (2)
- `(anonymous)` (2)

### `anonymous`
`[native code]` | Self: 0.0% (4.4ms) | Total: 0.4% (19.8ms) | Samples: 14

**Called by:**
- `(anonymous)` (11)
- `node:fs` (9)
- `node:fs/promises` (6)
- `internal:fs/streams` (5)
- `get WriteStream` (5)
- `internal:stream` (5)
- `node:stream` (5)
- `internal:streams/compose` (4)
- `node:events` (3)
- `internal:streams/pipeline` (3)
- `internal:streams/duplex` (3)
- `internal:validators` (2)
- `internal:shared` (1)

**Calls:**
- `node:fs` (9)
- `node:fs/promises` (6)
- `internal:fs/streams` (5)
- `internal:stream` (5)
- `node:stream` (5)
- `internal:streams/compose` (4)
- `node:events` (3)
- `internal:streams/pipeline` (3)
- `internal:streams/duplex` (3)
- `internal:validators` (2)
- `node:fs/promises` (1)
- `internal:shared` (1)
- `internal:primordials` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.0% (3.0ms) | Total: 0.0% (4.4ms) | Samples: 9

**Called by:**
- `(module)` (13)

**Calls:**
- `map` (2)
- `max` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` | Self: 0.0% (2.8ms) | Total: 0.8% (36.5ms) | Samples: 9

**Called by:**
- `(module)` (113)

**Calls:**
- `sort` (87)
- `from` (17)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (2.3ms) | Total: 2.0% (92.5ms) | Samples: 7

**Called by:**
- `some` (260)

**Calls:**
- `some` (253)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 0.0% (1.9ms) | Total: 100.0% (4.54s) | Samples: 6

**Calls:**
- `jacobiEigenSymmetric` (12526)
- `jacobiEigenSymmetric` (264)
- `jacobiEigenSymmetric` (248)
- `jacobiEigenSymmetric` (140)
- `jacobiEigenSymmetric` (117)
- `jacobiEigenSymmetric` (117)
- `jacobiEigenSymmetric` (113)
- `jacobiEigenSymmetric` (76)
- `jacobiEigenSymmetric` (46)
- `(anonymous)` (17)
- `jacobiEigenSymmetric` (13)
- `jacobiEigenSymmetric` (4)
- `from` (2)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)

### `map`
`[native code]` | Self: 0.0% (1.4ms) | Total: 0.0% (1.7ms) | Samples: 4

**Called by:**
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (1)

**Calls:**
- `(anonymous)` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:129` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 4

**Called by:**
- `(module)` (4)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` | Self: 0.0% (766us) | Total: 0.0% (766us) | Samples: 2

**Called by:**
- `from` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:119` | Self: 0.0% (638us) | Total: 0.0% (638us) | Samples: 2

**Called by:**
- `(module)` (2)

### `max`
`[native code]` | Self: 0.0% (625us) | Total: 0.0% (625us) | Samples: 2

**Called by:**
- `jacobiEigenSymmetric` (2)

### `defineProperty`
`[native code]` | Self: 0.0% (374us) | Total: 0.0% (374us) | Samples: 1

**Called by:**
- `asyncWrap` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:171` | Self: 0.0% (373us) | Total: 0.0% (373us) | Samples: 1

**Called by:**
- `(module)` (1)

### `WriteStream`
`internal:fs/streams` | Self: 0.0% (366us) | Total: 0.0% (366us) | Samples: 1

**Called by:**
- `(anonymous)` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:196` | Self: 0.0% (340us) | Total: 0.0% (340us) | Samples: 1

**Called by:**
- `(module)` (1)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (334us) | Total: 2.0% (93.3ms) | Samples: 1

**Called by:**
- `jacobiEigenSymmetric` (263)

**Calls:**
- `some` (262)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:192` | Self: 0.0% (325us) | Total: 0.0% (325us) | Samples: 1

**Called by:**
- `map` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:154` | Self: 0.0% (300us) | Total: 0.0% (300us) | Samples: 1

**Called by:**
- `(module)` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` | Self: 0.0% (271us) | Total: 2.0% (93.6ms) | Samples: 1

**Called by:**
- `(module)` (264)

**Calls:**
- `validateSquareFiniteMatrix` (263)

### `makeSafe`
`internal:primordials` | Self: 0.0% (270us) | Total: 0.0% (270us) | Samples: 1

**Called by:**
- `internal:primordials` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:153` | Self: 0.0% (270us) | Total: 0.0% (270us) | Samples: 1

**Called by:**
- `(module)` (1)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (832us) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:192` | Self: 0.0% (0us) | Total: 0.0% (689us) | Samples: 0

**Called by:**
- `(module)` (2)

**Calls:**
- `map` (2)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (5)

**Calls:**
- `anonymous` (5)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` | Self: 0.0% (0us) | Total: 0.0% (338us) | Samples: 0

**Called by:**
- `(module)` (1)

**Calls:**
- `map` (1)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (1.0ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `node:fs/promises`
`node:fs/promises:141` | Self: 0.0% (0us) | Total: 0.0% (374us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `asyncWrap` (1)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (1.8ms) | Samples: 0

**Called by:**
- `anonymous` (6)

**Calls:**
- `anonymous` (6)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (270us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (2.8ms) | Samples: 0

**Called by:**
- `anonymous` (9)

**Calls:**
- `anonymous` (9)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (1.0ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.1% (5.4ms) | Samples: 0

**Called by:**
- `(module)` (17)

**Calls:**
- `anonymous` (11)
- `get WriteStream` (5)
- `WriteStream` (1)

### `asyncWrap`
`node:fs/promises:249` | Self: 0.0% (0us) | Total: 0.0% (374us) | Samples: 0

**Called by:**
- `node:fs/promises` (1)

**Calls:**
- `defineProperty` (1)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (1.3ms) | Samples: 0

**Called by:**
- `anonymous` (4)

**Calls:**
- `anonymous` (4)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (5)

**Calls:**
- `anonymous` (5)

### `internal:primordials`
`internal:primordials:73` | Self: 0.0% (0us) | Total: 0.0% (270us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `makeSafe` (1)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (559us) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `(anonymous)` (5)

**Calls:**
- `anonymous` (5)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (5)

**Calls:**
- `anonymous` (5)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 94.4% | 4.29s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 5.5% | 250.8ms | `[native code]` |
| 0.0% | 1.9ms | `/Users/jemanuel/projects/cmaes_explainer/[eval]` |
| 0.0% | 366us | `internal:fs/streams` |
| 0.0% | 270us | `internal:primordials` |
