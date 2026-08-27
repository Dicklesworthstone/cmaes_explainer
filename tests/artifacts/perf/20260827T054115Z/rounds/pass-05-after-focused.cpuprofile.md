# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 3.62s | 10972 | 250us | 59 |

**Top 10:** `jacobiEigenSymmetric` 32.1%, `jacobiEigenSymmetric` 31.7%, `jacobiEigenSymmetric` 29.7%, `jacobiEigenSymmetric` 1.2%, `some` 1.1%, `jacobiEigenSymmetric` 1.1%, `(anonymous)` 1.0%, `(anonymous)` 0.5%, `from` 0.2%, `sort` 0.2%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 32.1% | 1.16s | 32.1% | 1.16s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` |
| 31.7% | 1.14s | 31.7% | 1.14s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 29.7% | 1.07s | 29.7% | 1.07s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:109` |
| 1.2% | 45.1ms | 1.8% | 66.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 1.1% | 40.9ms | 4.4% | 162.1ms | `some` | `[native code]` |
| 1.1% | 40.4ms | 1.1% | 40.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` |
| 1.0% | 39.4ms | 1.0% | 39.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.5% | 18.5ms | 0.5% | 18.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.2% | 10.3ms | 0.8% | 30.2ms | `from` | `[native code]` |
| 0.2% | 8.1ms | 0.3% | 11.8ms | `sort` | `[native code]` |
| 0.1% | 5.0ms | 0.6% | 21.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.1% | 4.6ms | 0.5% | 21.1ms | `anonymous` | `[native code]` |
| 0.1% | 3.9ms | 0.1% | 3.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:166` |
| 0.1% | 3.6ms | 0.1% | 3.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 2.6ms | 0.0% | 3.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.0% | 1.0ms | 2.2% | 80.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:90` |
| 0.0% | 928us | 0.0% | 928us | `max` | `[native code]` |
| 0.0% | 748us | 0.0% | 748us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:150` |
| 0.0% | 673us | 0.0% | 673us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 643us | 100.0% | 3.62s | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 639us | 0.0% | 639us | `map` | `[native code]` |
| 0.0% | 383us | 0.0% | 383us | `isFinite` | `[native code]` |
| 0.0% | 367us | 0.0% | 680us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` |
| 0.0% | 363us | 0.0% | 363us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:191` |
| 0.0% | 347us | 0.0% | 347us | `forEach` | `[native code]` |
| 0.0% | 344us | 0.0% | 344us | `WritableState` | `internal:streams/writable` |
| 0.0% | 343us | 0.0% | 343us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 342us | 0.0% | 342us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:118` |
| 0.0% | 315us | 0.0% | 315us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` |
| 0.0% | 308us | 0.0% | 308us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:161` |
| 0.0% | 303us | 0.0% | 303us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.0% | 284us | 0.0% | 284us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:115` |
| 0.0% | 276us | 0.0% | 276us | `setName` | `node:fs:710` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 100.0% | 3.62s | 0.0% | 643us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 32.1% | 1.16s | 32.1% | 1.16s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` |
| 31.7% | 1.14s | 31.7% | 1.14s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` |
| 29.7% | 1.07s | 29.7% | 1.07s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:109` |
| 4.4% | 162.1ms | 1.1% | 40.9ms | `some` | `[native code]` |
| 2.2% | 81.4ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:107` |
| 2.2% | 81.4ms | 0.0% | 0us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:90` |
| 2.2% | 80.7ms | 0.0% | 1.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:90` |
| 1.8% | 66.9ms | 1.2% | 45.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 1.1% | 40.4ms | 1.1% | 40.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` |
| 1.0% | 39.4ms | 1.0% | 39.4ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.8% | 30.2ms | 0.2% | 10.3ms | `from` | `[native code]` |
| 0.6% | 21.8ms | 0.1% | 5.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.5% | 21.1ms | 0.1% | 4.6ms | `anonymous` | `[native code]` |
| 0.5% | 18.5ms | 0.5% | 18.5ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` |
| 0.3% | 11.8ms | 0.2% | 8.1ms | `sort` | `[native code]` |
| 0.1% | 5.6ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.1% | 3.9ms | 0.1% | 3.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:166` |
| 0.1% | 3.6ms | 0.1% | 3.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` |
| 0.0% | 3.5ms | 0.0% | 2.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` |
| 0.0% | 2.7ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 2.0ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 1.8ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 1.8ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 1.8ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 1.2ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 972us | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 972us | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 928us | 0.0% | 928us | `max` | `[native code]` |
| 0.0% | 748us | 0.0% | 748us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:150` |
| 0.0% | 706us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 706us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 706us | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 680us | 0.0% | 367us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` |
| 0.0% | 673us | 0.0% | 673us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 639us | 0.0% | 639us | `map` | `[native code]` |
| 0.0% | 616us | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 383us | 0.0% | 383us | `isFinite` | `[native code]` |
| 0.0% | 363us | 0.0% | 363us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:191` |
| 0.0% | 347us | 0.0% | 0us | `internal:primordials` | `internal:primordials:80` |
| 0.0% | 347us | 0.0% | 0us | `bound call` | `[native code]` |
| 0.0% | 347us | 0.0% | 347us | `forEach` | `[native code]` |
| 0.0% | 347us | 0.0% | 0us | `makeSafe` | `internal:primordials:31` |
| 0.0% | 345us | 0.0% | 0us | `internal:fs/glob` | `internal:fs/glob:2` |
| 0.0% | 344us | 0.0% | 0us | `Writable` | `internal:streams/writable:181` |
| 0.0% | 344us | 0.0% | 0us | `WriteStream` | `internal:fs/streams:259` |
| 0.0% | 344us | 0.0% | 344us | `WritableState` | `internal:streams/writable` |
| 0.0% | 343us | 0.0% | 343us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 343us | 0.0% | 0us | `internal:stream` | `internal:stream:47` |
| 0.0% | 342us | 0.0% | 342us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:118` |
| 0.0% | 326us | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 315us | 0.0% | 315us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` |
| 0.0% | 308us | 0.0% | 308us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:161` |
| 0.0% | 307us | 0.0% | 0us | `internal:streams/end-of-stream` | `internal:streams/end-of-stream:17` |
| 0.0% | 307us | 0.0% | 0us | `internal:streams/operators` | `internal:streams/operators:2` |
| 0.0% | 303us | 0.0% | 303us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` |
| 0.0% | 284us | 0.0% | 284us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:115` |
| 0.0% | 276us | 0.0% | 276us | `setName` | `node:fs:710` |
| 0.0% | 276us | 0.0% | 0us | `node:fs` | `node:fs:750` |

## Function Details

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` | Self: 32.1% (1.16s) | Total: 32.1% (1.16s) | Samples: 3512

**Called by:**
- `(module)` (3512)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:112` | Self: 31.7% (1.14s) | Total: 31.7% (1.14s) | Samples: 3489

**Called by:**
- `(module)` (3489)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:109` | Self: 29.7% (1.07s) | Total: 29.7% (1.07s) | Samples: 3291

**Called by:**
- `(module)` (3292)

**Calls:**
- `isFinite` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 1.2% (45.1ms) | Total: 1.8% (66.9ms) | Samples: 139

**Called by:**
- `(module)` (206)

**Calls:**
- `from` (67)

### `some`
`[native code]` | Self: 1.1% (40.9ms) | Total: 4.4% (162.1ms) | Samples: 126

**Called by:**
- `validateSquareFiniteMatrix` (227)
- `(anonymous)` (222)
- `some` (3)

**Calls:**
- `(anonymous)` (225)
- `(anonymous)` (98)
- `some` (3)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:147` | Self: 1.1% (40.4ms) | Total: 1.1% (40.4ms) | Samples: 123

**Called by:**
- `(module)` (123)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 1.0% (39.4ms) | Total: 1.0% (39.4ms) | Samples: 98

**Called by:**
- `some` (98)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:190` | Self: 0.5% (18.5ms) | Total: 0.5% (18.5ms) | Samples: 56

**Called by:**
- `from` (56)

### `from`
`[native code]` | Self: 0.2% (10.3ms) | Total: 0.8% (30.2ms) | Samples: 27

**Called by:**
- `jacobiEigenSymmetric` (67)
- `jacobiEigenSymmetric` (15)
- `(module)` (3)
- `from` (2)

**Calls:**
- `(anonymous)` (56)
- `from` (2)
- `(anonymous)` (1)
- `(anonymous)` (1)

### `sort`
`[native code]` | Self: 0.2% (8.1ms) | Total: 0.3% (11.8ms) | Samples: 24

**Called by:**
- `jacobiEigenSymmetric` (35)

**Calls:**
- `(anonymous)` (11)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` | Self: 0.1% (5.0ms) | Total: 0.6% (21.8ms) | Samples: 16

**Called by:**
- `(module)` (66)

**Calls:**
- `sort` (35)
- `from` (15)

### `anonymous`
`[native code]` | Self: 0.1% (4.6ms) | Total: 0.5% (21.1ms) | Samples: 14

**Called by:**
- `(anonymous)` (10)
- `node:fs` (8)
- `internal:fs/streams` (6)
- `get WriteStream` (6)
- `node:fs/promises` (6)
- `node:stream` (6)
- `internal:stream` (4)
- `internal:streams/pipeline` (3)
- `internal:streams/compose` (3)
- `node:events` (2)
- `internal:validators` (2)
- `internal:shared` (2)
- `internal:streams/duplex` (2)
- `internal:fs/glob` (1)
- `internal:streams/end-of-stream` (1)
- `internal:streams/operators` (1)
- `internal:stream` (1)

**Calls:**
- `node:fs` (8)
- `internal:fs/streams` (6)
- `node:fs/promises` (6)
- `node:stream` (6)
- `internal:stream` (4)
- `internal:streams/pipeline` (3)
- `internal:streams/compose` (3)
- `node:events` (2)
- `internal:validators` (2)
- `internal:shared` (2)
- `internal:streams/duplex` (2)
- `internal:fs/glob` (1)
- `internal:streams/end-of-stream` (1)
- `internal:primordials` (1)
- `internal:streams/operators` (1)
- `node:fs` (1)
- `internal:stream` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:166` | Self: 0.1% (3.9ms) | Total: 0.1% (3.9ms) | Samples: 12

**Called by:**
- `(module)` (12)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:184` | Self: 0.1% (3.6ms) | Total: 0.1% (3.6ms) | Samples: 11

**Called by:**
- `sort` (11)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:187` | Self: 0.0% (2.6ms) | Total: 0.0% (3.5ms) | Samples: 8

**Called by:**
- `(module)` (11)

**Calls:**
- `max` (3)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:90` | Self: 0.0% (1.0ms) | Total: 2.2% (80.7ms) | Samples: 3

**Called by:**
- `some` (225)

**Calls:**
- `some` (222)

### `max`
`[native code]` | Self: 0.0% (928us) | Total: 0.0% (928us) | Samples: 3

**Called by:**
- `jacobiEigenSymmetric` (3)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:150` | Self: 0.0% (748us) | Total: 0.0% (748us) | Samples: 2

**Called by:**
- `(module)` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (673us) | Total: 0.0% (673us) | Samples: 2

**Called by:**
- `(module)` (2)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 0.0% (643us) | Total: 100.0% (3.62s) | Samples: 2

**Calls:**
- `jacobiEigenSymmetric` (3512)
- `jacobiEigenSymmetric` (3489)
- `jacobiEigenSymmetric` (3292)
- `jacobiEigenSymmetric` (227)
- `jacobiEigenSymmetric` (206)
- `jacobiEigenSymmetric` (123)
- `jacobiEigenSymmetric` (66)
- `(anonymous)` (17)
- `jacobiEigenSymmetric` (12)
- `jacobiEigenSymmetric` (11)
- `from` (3)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)

### `map`
`[native code]` | Self: 0.0% (639us) | Total: 0.0% (639us) | Samples: 2

**Called by:**
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)

### `isFinite`
`[native code]` | Self: 0.0% (383us) | Total: 0.0% (383us) | Samples: 1

**Called by:**
- `jacobiEigenSymmetric` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` | Self: 0.0% (367us) | Total: 0.0% (680us) | Samples: 1

**Called by:**
- `(module)` (2)

**Calls:**
- `map` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:191` | Self: 0.0% (363us) | Total: 0.0% (363us) | Samples: 1

**Called by:**
- `(module)` (1)

### `forEach`
`[native code]` | Self: 0.0% (347us) | Total: 0.0% (347us) | Samples: 1

**Called by:**
- `bound call` (1)

### `WritableState`
`internal:streams/writable` | Self: 0.0% (344us) | Total: 0.0% (344us) | Samples: 1

**Called by:**
- `Writable` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 0.0% (343us) | Total: 0.0% (343us) | Samples: 1

**Called by:**
- `from` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:118` | Self: 0.0% (342us) | Total: 0.0% (342us) | Samples: 1

**Called by:**
- `(module)` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` | Self: 0.0% (315us) | Total: 0.0% (315us) | Samples: 1

**Called by:**
- `(module)` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:161` | Self: 0.0% (308us) | Total: 0.0% (308us) | Samples: 1

**Called by:**
- `(module)` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:183` | Self: 0.0% (303us) | Total: 0.0% (303us) | Samples: 1

**Called by:**
- `from` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:115` | Self: 0.0% (284us) | Total: 0.0% (284us) | Samples: 1

**Called by:**
- `(module)` (1)

### `setName`
`node:fs:710` | Self: 0.0% (276us) | Total: 0.0% (276us) | Samples: 1

**Called by:**
- `node:fs` (1)

### `internal:streams/end-of-stream`
`internal:streams/end-of-stream:17` | Self: 0.0% (0us) | Total: 0.0% (307us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (616us) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (706us) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `internal:primordials`
`internal:primordials:80` | Self: 0.0% (0us) | Total: 0.0% (347us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `makeSafe` (1)

### `Writable`
`internal:streams/writable:181` | Self: 0.0% (0us) | Total: 0.0% (344us) | Samples: 0

**Called by:**
- `WriteStream` (1)

**Calls:**
- `WritableState` (1)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.2ms) | Samples: 0

**Called by:**
- `anonymous` (4)

**Calls:**
- `anonymous` (4)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:107` | Self: 0.0% (0us) | Total: 2.2% (81.4ms) | Samples: 0

**Called by:**
- `(module)` (227)

**Calls:**
- `validateSquareFiniteMatrix` (227)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (706us) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `bound call`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (347us) | Samples: 0

**Called by:**
- `makeSafe` (1)

**Calls:**
- `forEach` (1)

### `internal:fs/glob`
`internal:fs/glob:2` | Self: 0.0% (0us) | Total: 0.0% (345us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (2.7ms) | Samples: 0

**Called by:**
- `anonymous` (8)

**Calls:**
- `anonymous` (8)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:90` | Self: 0.0% (0us) | Total: 2.2% (81.4ms) | Samples: 0

**Called by:**
- `jacobiEigenSymmetric` (227)

**Calls:**
- `some` (227)

### `internal:stream`
`internal:stream:47` | Self: 0.0% (0us) | Total: 0.0% (343us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `node:fs`
`node:fs:750` | Self: 0.0% (0us) | Total: 0.0% (276us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `setName` (1)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.8ms) | Samples: 0

**Called by:**
- `anonymous` (6)

**Calls:**
- `anonymous` (6)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (972us) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `internal:streams/operators`
`internal:streams/operators:2` | Self: 0.0% (0us) | Total: 0.0% (307us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (2.0ms) | Samples: 0

**Called by:**
- `anonymous` (6)

**Calls:**
- `anonymous` (6)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` | Self: 0.0% (0us) | Total: 0.0% (326us) | Samples: 0

**Called by:**
- `(module)` (1)

**Calls:**
- `map` (1)

### `WriteStream`
`internal:fs/streams:259` | Self: 0.0% (0us) | Total: 0.0% (344us) | Samples: 0

**Called by:**
- `(anonymous)` (1)

**Calls:**
- `Writable` (1)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (972us) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.1% (5.6ms) | Samples: 0

**Called by:**
- `(module)` (17)

**Calls:**
- `anonymous` (10)
- `get WriteStream` (6)
- `WriteStream` (1)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (1.8ms) | Samples: 0

**Called by:**
- `(anonymous)` (6)

**Calls:**
- `anonymous` (6)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (1.8ms) | Samples: 0

**Called by:**
- `anonymous` (6)

**Calls:**
- `anonymous` (6)

### `makeSafe`
`internal:primordials:31` | Self: 0.0% (0us) | Total: 0.0% (347us) | Samples: 0

**Called by:**
- `internal:primordials` (1)

**Calls:**
- `bound call` (1)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (706us) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 98.1% | 3.55s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 1.8% | 66.4ms | `[native code]` |
| 0.0% | 986us | `/Users/jemanuel/projects/cmaes_explainer/[eval]` |
| 0.0% | 344us | `internal:streams/writable` |
| 0.0% | 276us | `node:fs` |
