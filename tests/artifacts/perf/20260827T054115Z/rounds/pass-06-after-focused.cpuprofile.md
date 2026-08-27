# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 4.22s | 12747 | 250us | 52 |

**Top 10:** `jacobiEigenSymmetric` 87.3%, `hypot` 3.6%, `some` 1.3%, `jacobiEigenSymmetric` 1.2%, `jacobiEigenSymmetric` 1.0%, `jacobiEigenSymmetric` 0.8%, `jacobiEigenSymmetric` 0.8%, `(anonymous)` 0.6%, `jacobiEigenSymmetric` 0.5%, `(anonymous)` 0.5%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 87.3% | 3.68s | 90.9% | 3.84s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 3.6% | 152.9ms | 3.6% | 152.9ms | `hypot` | `[native code]` |
| 1.3% | 55.1ms | 3.9% | 168.4ms | `some` | `[native code]` |
| 1.2% | 54.4ms | 1.8% | 80.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 1.0% | 44.3ms | 1.0% | 44.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 0.8% | 37.0ms | 0.8% | 37.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.8% | 34.4ms | 0.8% | 34.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 0.6% | 26.9ms | 0.6% | 26.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.5% | 24.5ms | 0.5% | 24.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:166` |
| 0.5% | 21.4ms | 0.5% | 21.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.3% | 16.6ms | 0.3% | 16.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:150` |
| 0.3% | 14.2ms | 0.6% | 25.5ms | `sort` | `[native code]` |
| 0.2% | 11.2ms | 0.2% | 11.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.2% | 9.3ms | 0.8% | 36.2ms | `from` | `[native code]` |
| 0.1% | 5.6ms | 0.1% | 8.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.1% | 5.3ms | 0.8% | 34.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.1% | 5.0ms | 2.0% | 86.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 0.0% | 4.1ms | 0.4% | 19.4ms | `anonymous` | `[native code]` |
| 0.0% | 2.1ms | 100.0% | 4.22s | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 1.8ms | 0.0% | 2.1ms | `map` | `[native code]` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]` |
| 0.0% | 695us | 2.0% | 87.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 0.0% | 669us | 0.0% | 669us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:193` |
| 0.0% | 553us | 0.0% | 553us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` |
| 0.0% | 386us | 0.0% | 386us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 354us | 0.1% | 5.4ms | `(anonymous)` | `[native code]` |
| 0.0% | 353us | 0.0% | 353us | `defineProperty` | `[native code]` |
| 0.0% | 284us | 0.0% | 284us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:116` |
| 0.0% | 284us | 0.0% | 1.4ms | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 279us | 0.0% | 279us | `abs` | `[native code]` |
| 0.0% | 278us | 0.0% | 278us | `copyObject` | `internal:fs/streams:32` |
| 0.0% | 267us | 0.0% | 267us | `max` | `[native code]` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 100.0% | 4.22s | 0.0% | 2.1ms | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 90.9% | 3.84s | 87.3% | 3.68s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 3.9% | 168.4ms | 1.3% | 55.1ms | `some` | `[native code]` |
| 3.6% | 152.9ms | 3.6% | 152.9ms | `hypot` | `[native code]` |
| 2.0% | 87.0ms | 0.0% | 695us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 2.0% | 86.3ms | 0.0% | 0us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 2.0% | 86.0ms | 0.1% | 5.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` |
| 1.8% | 80.2ms | 1.2% | 54.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 1.0% | 44.3ms | 1.0% | 44.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 0.8% | 37.0ms | 0.8% | 37.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` |
| 0.8% | 36.2ms | 0.2% | 9.3ms | `from` | `[native code]` |
| 0.8% | 34.6ms | 0.1% | 5.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.8% | 34.4ms | 0.8% | 34.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 0.6% | 26.9ms | 0.6% | 26.9ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.6% | 25.5ms | 0.3% | 14.2ms | `sort` | `[native code]` |
| 0.5% | 24.5ms | 0.5% | 24.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:166` |
| 0.5% | 21.4ms | 0.5% | 21.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.4% | 19.4ms | 0.0% | 4.1ms | `anonymous` | `[native code]` |
| 0.3% | 16.6ms | 0.3% | 16.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:150` |
| 0.2% | 11.2ms | 0.2% | 11.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.1% | 8.2ms | 0.1% | 5.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.1% | 5.4ms | 0.0% | 354us | `(anonymous)` | `[native code]` |
| 0.0% | 2.6ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 2.1ms | 0.0% | 1.8ms | `map` | `[native code]` |
| 0.0% | 2.0ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 1.8ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 1.8ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 1.8ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 1.8ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]` |
| 0.0% | 1.4ms | 0.0% | 284us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 901us | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 844us | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 844us | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 669us | 0.0% | 669us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:193` |
| 0.0% | 666us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 666us | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 627us | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` |
| 0.0% | 553us | 0.0% | 553us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` |
| 0.0% | 386us | 0.0% | 386us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 353us | 0.0% | 0us | `bound call` | `[native code]` |
| 0.0% | 353us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 353us | 0.0% | 0us | `(anonymous)` | `internal:primordials:45` |
| 0.0% | 353us | 0.0% | 353us | `defineProperty` | `[native code]` |
| 0.0% | 353us | 0.0% | 0us | `internal:primordials` | `internal:primordials:73` |
| 0.0% | 353us | 0.0% | 0us | `makeSafe` | `internal:primordials:31` |
| 0.0% | 353us | 0.0% | 0us | `forEach` | `[native code]` |
| 0.0% | 284us | 0.0% | 284us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:116` |
| 0.0% | 279us | 0.0% | 279us | `abs` | `[native code]` |
| 0.0% | 278us | 0.0% | 278us | `copyObject` | `internal:fs/streams:32` |
| 0.0% | 278us | 0.0% | 0us | `WriteStream` | `internal:fs/streams:201` |
| 0.0% | 267us | 0.0% | 267us | `max` | `[native code]` |

## Function Details

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` | Self: 87.3% (3.68s) | Total: 90.9% (3.84s) | Samples: 11164

**Called by:**
- `(module)` (11632)

**Calls:**
- `hypot` (468)

### `hypot`
`[native code]` | Self: 3.6% (152.9ms) | Total: 3.6% (152.9ms) | Samples: 468

**Called by:**
- `jacobiEigenSymmetric` (468)

### `some`
`[native code]` | Self: 1.3% (55.1ms) | Total: 3.9% (168.4ms) | Samples: 167

**Called by:**
- `validateSquareFiniteMatrix` (258)
- `(anonymous)` (247)
- `some` (3)

**Calls:**
- `(anonymous)` (257)
- `(anonymous)` (81)
- `some` (3)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 1.2% (54.4ms) | Total: 1.8% (80.2ms) | Samples: 134

**Called by:**
- `(module)` (211)

**Calls:**
- `from` (77)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` | Self: 1.0% (44.3ms) | Total: 1.0% (44.3ms) | Samples: 133

**Called by:**
- `(module)` (133)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:113` | Self: 0.8% (37.0ms) | Total: 0.8% (37.0ms) | Samples: 113

**Called by:**
- `(module)` (113)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` | Self: 0.8% (34.4ms) | Total: 0.8% (34.4ms) | Samples: 108

**Called by:**
- `(module)` (108)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.6% (26.9ms) | Total: 0.6% (26.9ms) | Samples: 83

**Called by:**
- `some` (81)
- `from` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:166` | Self: 0.5% (24.5ms) | Total: 0.5% (24.5ms) | Samples: 73

**Called by:**
- `(module)` (73)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.5% (21.4ms) | Total: 0.5% (21.4ms) | Samples: 64

**Called by:**
- `from` (64)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:150` | Self: 0.3% (16.6ms) | Total: 0.3% (16.6ms) | Samples: 52

**Called by:**
- `(module)` (52)

### `sort`
`[native code]` | Self: 0.3% (14.2ms) | Total: 0.6% (25.5ms) | Samples: 40

**Called by:**
- `jacobiEigenSymmetric` (74)
- `jacobiEigenSymmetric` (1)

**Calls:**
- `(anonymous)` (35)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` | Self: 0.2% (11.2ms) | Total: 0.2% (11.2ms) | Samples: 35

**Called by:**
- `sort` (35)

### `from`
`[native code]` | Self: 0.2% (9.3ms) | Total: 0.8% (36.2ms) | Samples: 29

**Called by:**
- `jacobiEigenSymmetric` (77)
- `jacobiEigenSymmetric` (17)
- `(module)` (3)
- `from` (3)

**Calls:**
- `(anonymous)` (64)
- `from` (3)
- `(anonymous)` (2)
- `(anonymous)` (1)
- `(anonymous)` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.1% (5.6ms) | Total: 0.1% (8.2ms) | Samples: 17

**Called by:**
- `(module)` (21)

**Calls:**
- `map` (2)
- `max` (1)
- `sort` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` | Self: 0.1% (5.3ms) | Total: 0.8% (34.6ms) | Samples: 16

**Called by:**
- `(module)` (107)

**Calls:**
- `sort` (74)
- `from` (17)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.1% (5.0ms) | Total: 2.0% (86.0ms) | Samples: 10

**Called by:**
- `some` (257)

**Calls:**
- `some` (247)

### `anonymous`
`[native code]` | Self: 0.0% (4.1ms) | Total: 0.4% (19.4ms) | Samples: 13

**Called by:**
- `(anonymous)` (9)
- `node:fs` (8)
- `internal:fs/streams` (6)
- `get WriteStream` (6)
- `internal:stream` (6)
- `node:fs/promises` (6)
- `node:stream` (6)
- `internal:streams/compose` (4)
- `internal:streams/pipeline` (3)
- `internal:streams/duplex` (3)
- `node:events` (2)
- `internal:validators` (2)
- `internal:shared` (1)

**Calls:**
- `node:fs` (8)
- `internal:fs/streams` (6)
- `internal:stream` (6)
- `node:fs/promises` (6)
- `node:stream` (6)
- `internal:streams/compose` (5)
- `internal:streams/pipeline` (3)
- `internal:streams/duplex` (3)
- `node:events` (2)
- `internal:validators` (2)
- `internal:shared` (1)
- `internal:primordials` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 0.0% (2.1ms) | Total: 100.0% (4.22s) | Samples: 7

**Calls:**
- `jacobiEigenSymmetric` (11632)
- `jacobiEigenSymmetric` (260)
- `jacobiEigenSymmetric` (211)
- `jacobiEigenSymmetric` (133)
- `jacobiEigenSymmetric` (113)
- `jacobiEigenSymmetric` (108)
- `jacobiEigenSymmetric` (107)
- `jacobiEigenSymmetric` (73)
- `jacobiEigenSymmetric` (52)
- `jacobiEigenSymmetric` (21)
- `(anonymous)` (17)
- `from` (3)
- `jacobiEigenSymmetric` (3)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (1)

### `map`
`[native code]` | Self: 0.0% (1.8ms) | Total: 0.0% (2.1ms) | Samples: 6

**Called by:**
- `jacobiEigenSymmetric` (3)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (2)

**Calls:**
- `abs` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]` | Self: 0.0% (1.8ms) | Total: 0.0% (1.8ms) | Samples: 1

**Called by:**
- `from` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` | Self: 0.0% (695us) | Total: 2.0% (87.0ms) | Samples: 2

**Called by:**
- `(module)` (260)

**Calls:**
- `validateSquareFiniteMatrix` (258)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:193` | Self: 0.0% (669us) | Total: 0.0% (669us) | Samples: 2

**Called by:**
- `(module)` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` | Self: 0.0% (553us) | Total: 0.0% (553us) | Samples: 2

**Called by:**
- `(module)` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 0.0% (386us) | Total: 0.0% (386us) | Samples: 1

**Called by:**
- `from` (1)

### `(anonymous)`
`[native code]` | Self: 0.0% (354us) | Total: 0.1% (5.4ms) | Samples: 1

**Called by:**
- `(module)` (17)

**Calls:**
- `anonymous` (9)
- `get WriteStream` (6)
- `WriteStream` (1)

### `defineProperty`
`[native code]` | Self: 0.0% (353us) | Total: 0.0% (353us) | Samples: 1

**Called by:**
- `(anonymous)` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:116` | Self: 0.0% (284us) | Total: 0.0% (284us) | Samples: 1

**Called by:**
- `(module)` (1)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (284us) | Total: 0.0% (1.4ms) | Samples: 1

**Called by:**
- `anonymous` (5)

**Calls:**
- `anonymous` (4)

### `abs`
`[native code]` | Self: 0.0% (279us) | Total: 0.0% (279us) | Samples: 1

**Called by:**
- `map` (1)

### `copyObject`
`internal:fs/streams:32` | Self: 0.0% (278us) | Total: 0.0% (278us) | Samples: 1

**Called by:**
- `WriteStream` (1)

### `max`
`[native code]` | Self: 0.0% (267us) | Total: 0.0% (267us) | Samples: 1

**Called by:**
- `jacobiEigenSymmetric` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` | Self: 0.0% (0us) | Total: 0.0% (627us) | Samples: 0

**Called by:**
- `(module)` (2)

**Calls:**
- `map` (2)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.8ms) | Samples: 0

**Called by:**
- `anonymous` (6)

**Calls:**
- `anonymous` (6)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:91` | Self: 0.0% (0us) | Total: 2.0% (86.3ms) | Samples: 0

**Called by:**
- `jacobiEigenSymmetric` (258)

**Calls:**
- `some` (258)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (666us) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `bound call`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (353us) | Samples: 0

**Called by:**
- `makeSafe` (1)

**Calls:**
- `forEach` (1)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (666us) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `(anonymous)`
`internal:primordials:45` | Self: 0.0% (0us) | Total: 0.0% (353us) | Samples: 0

**Called by:**
- `forEach` (1)

**Calls:**
- `defineProperty` (1)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (2.0ms) | Samples: 0

**Called by:**
- `anonymous` (6)

**Calls:**
- `anonymous` (6)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (2.6ms) | Samples: 0

**Called by:**
- `anonymous` (8)

**Calls:**
- `anonymous` (8)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.8ms) | Samples: 0

**Called by:**
- `anonymous` (6)

**Calls:**
- `anonymous` (6)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` | Self: 0.0% (0us) | Total: 0.0% (901us) | Samples: 0

**Called by:**
- `(module)` (3)

**Calls:**
- `map` (3)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (353us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `WriteStream`
`internal:fs/streams:201` | Self: 0.0% (0us) | Total: 0.0% (278us) | Samples: 0

**Called by:**
- `(anonymous)` (1)

**Calls:**
- `copyObject` (1)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (844us) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (1.8ms) | Samples: 0

**Called by:**
- `(anonymous)` (6)

**Calls:**
- `anonymous` (6)

### `internal:primordials`
`internal:primordials:73` | Self: 0.0% (0us) | Total: 0.0% (353us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `makeSafe` (1)

### `forEach`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (353us) | Samples: 0

**Called by:**
- `bound call` (1)

**Calls:**
- `(anonymous)` (1)

### `makeSafe`
`internal:primordials:31` | Self: 0.0% (0us) | Total: 0.0% (353us) | Samples: 0

**Called by:**
- `internal:primordials` (1)

**Calls:**
- `bound call` (1)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (1.8ms) | Samples: 0

**Called by:**
- `anonymous` (6)

**Calls:**
- `anonymous` (6)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (844us) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 94.2% | 3.97s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 5.6% | 239.0ms | `[native code]` |
| 0.1% | 4.3ms | `/Users/jemanuel/projects/cmaes_explainer/[eval]` |
| 0.0% | 284us | `internal:streams/compose` |
| 0.0% | 278us | `internal:fs/streams` |
