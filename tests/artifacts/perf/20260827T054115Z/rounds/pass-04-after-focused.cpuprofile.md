# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 3.82s | 11526 | 250us | 68 |

**Top 10:** `jacobiEigenSymmetric` 54.0%, `jacobiEigenSymmetric` 31.8%, `hypot` 4.2%, `jacobiEigenSymmetric` 1.3%, `jacobiEigenSymmetric` 1.2%, `some` 1.2%, `jacobiEigenSymmetric` 1.0%, `jacobiEigenSymmetric` 1.0%, `(anonymous)` 0.7%, `(anonymous)` 0.7%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 54.0% | 2.06s | 56.6% | 2.16s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 31.8% | 1.21s | 33.4% | 1.27s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:144` |
| 4.2% | 161.3ms | 4.2% | 161.3ms | `hypot` | `[native code]` |
| 1.3% | 50.7ms | 1.3% | 50.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` |
| 1.2% | 48.2ms | 2.0% | 78.1ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:192` |
| 1.2% | 46.5ms | 4.0% | 153.1ms | `some` | `[native code]` |
| 1.0% | 40.4ms | 1.0% | 40.8ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 1.0% | 39.7ms | 1.0% | 39.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 0.7% | 28.7ms | 0.7% | 28.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.7% | 27.6ms | 0.7% | 27.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:192` |
| 0.5% | 20.7ms | 0.5% | 20.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:114` |
| 0.4% | 17.7ms | 0.4% | 17.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` |
| 0.4% | 17.5ms | 1.2% | 46.4ms | `from` | `[native code]` |
| 0.1% | 6.2ms | 0.7% | 27.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:185` |
| 0.1% | 4.8ms | 0.1% | 7.0ms | `sort` | `[native code]` |
| 0.1% | 4.0ms | 0.1% | 6.5ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` |
| 0.0% | 3.7ms | 0.6% | 25.0ms | `anonymous` | `[native code]` |
| 0.0% | 2.5ms | 0.0% | 2.8ms | `map` | `[native code]` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:149` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `max` | `[native code]` |
| 0.0% | 1.7ms | 100.0% | 3.81s | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 1.7ms | 2.0% | 77.0ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:195` |
| 0.0% | 693us | 0.0% | 1.6ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:191` |
| 0.0% | 668us | 0.0% | 668us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:152` |
| 0.0% | 593us | 0.0% | 593us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 385us | 0.0% | 385us | `internal:streams/destroy` | `internal:streams/destroy:16` |
| 0.0% | 382us | 0.0% | 382us | `@lazy` | `[native code]` |
| 0.0% | 368us | 0.0% | 368us | `Float64Array` | `[native code]` |
| 0.0% | 356us | 0.0% | 356us | `getOwnPropertyDescriptor` | `[native code]` |
| 0.0% | 356us | 0.0% | 356us | `asyncWrap` | `node:fs/promises` |
| 0.0% | 351us | 0.0% | 351us | `(anonymous)` | `internal:primordials` |
| 0.0% | 349us | 0.0% | 349us | `internal:primordials` | `internal:primordials:2` |
| 0.0% | 348us | 0.0% | 348us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:191` |
| 0.0% | 344us | 0.0% | 344us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:122` |
| 0.0% | 332us | 0.0% | 332us | `WriteStream` | `internal:fs/streams` |
| 0.0% | 313us | 0.0% | 313us | `WritableState` | `internal:streams/writable:135` |
| 0.0% | 301us | 0.0% | 301us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:193` |
| 0.0% | 292us | 0.0% | 292us | `internal:streams/readable` | `internal:streams/readable:14` |
| 0.0% | 291us | 0.0% | 291us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:174` |
| 0.0% | 291us | 0.0% | 291us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:170` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 100.0% | 3.81s | 0.0% | 1.7ms | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 56.6% | 2.16s | 54.0% | 2.06s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` |
| 33.4% | 1.27s | 31.8% | 1.21s | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:144` |
| 4.2% | 161.3ms | 4.2% | 161.3ms | `hypot` | `[native code]` |
| 4.0% | 153.1ms | 1.2% | 46.5ms | `some` | `[native code]` |
| 2.0% | 78.1ms | 1.2% | 48.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:192` |
| 2.0% | 77.0ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:106` |
| 2.0% | 77.0ms | 0.0% | 1.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 2.0% | 77.0ms | 0.0% | 0us | `validateSquareFiniteMatrix` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` |
| 1.3% | 50.7ms | 1.3% | 50.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` |
| 1.2% | 46.4ms | 0.4% | 17.5ms | `from` | `[native code]` |
| 1.0% | 40.8ms | 1.0% | 40.4ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` |
| 1.0% | 39.7ms | 1.0% | 39.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` |
| 0.7% | 28.7ms | 0.7% | 28.7ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.7% | 27.6ms | 0.7% | 27.6ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:192` |
| 0.7% | 27.6ms | 0.1% | 6.2ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:185` |
| 0.6% | 25.0ms | 0.0% | 3.7ms | `anonymous` | `[native code]` |
| 0.5% | 20.7ms | 0.5% | 20.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:114` |
| 0.4% | 17.7ms | 0.4% | 17.7ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` |
| 0.1% | 7.0ms | 0.1% | 4.8ms | `sort` | `[native code]` |
| 0.1% | 6.8ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.1% | 6.5ms | 0.1% | 4.0ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` |
| 0.0% | 3.0ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 2.8ms | 0.0% | 2.5ms | `map` | `[native code]` |
| 0.0% | 2.5ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 2.4ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 2.2ms | 0.0% | 2.2ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` |
| 0.0% | 2.2ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 2.2ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 2.2ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 1.9ms | 0.0% | 1.9ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:149` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `max` | `[native code]` |
| 0.0% | 1.6ms | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 1.6ms | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 1.6ms | 0.0% | 693us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:191` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:195` |
| 0.0% | 1.0ms | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 1.0ms | 0.0% | 0us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:188` |
| 0.0% | 911us | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 700us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 700us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 668us | 0.0% | 668us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:152` |
| 0.0% | 593us | 0.0% | 593us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 385us | 0.0% | 385us | `internal:streams/destroy` | `internal:streams/destroy:16` |
| 0.0% | 382us | 0.0% | 0us | `internal:fs/binding` | `internal:fs/binding:3` |
| 0.0% | 382us | 0.0% | 382us | `@lazy` | `[native code]` |
| 0.0% | 368us | 0.0% | 368us | `Float64Array` | `[native code]` |
| 0.0% | 356us | 0.0% | 356us | `asyncWrap` | `node:fs/promises` |
| 0.0% | 356us | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:137` |
| 0.0% | 356us | 0.0% | 356us | `getOwnPropertyDescriptor` | `[native code]` |
| 0.0% | 356us | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:52` |
| 0.0% | 351us | 0.0% | 351us | `(anonymous)` | `internal:primordials` |
| 0.0% | 351us | 0.0% | 0us | `forEach` | `[native code]` |
| 0.0% | 351us | 0.0% | 0us | `makeSafe` | `internal:primordials:50` |
| 0.0% | 351us | 0.0% | 0us | `bound call` | `[native code]` |
| 0.0% | 351us | 0.0% | 0us | `internal:primordials` | `internal:primordials:73` |
| 0.0% | 351us | 0.0% | 0us | `copyProps` | `internal:primordials:23` |
| 0.0% | 349us | 0.0% | 349us | `internal:primordials` | `internal:primordials:2` |
| 0.0% | 348us | 0.0% | 348us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:191` |
| 0.0% | 344us | 0.0% | 344us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:122` |
| 0.0% | 332us | 0.0% | 332us | `WriteStream` | `internal:fs/streams` |
| 0.0% | 313us | 0.0% | 0us | `WriteStream` | `internal:fs/streams:259` |
| 0.0% | 313us | 0.0% | 313us | `WritableState` | `internal:streams/writable:135` |
| 0.0% | 313us | 0.0% | 0us | `Writable` | `internal:streams/writable:181` |
| 0.0% | 301us | 0.0% | 301us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:193` |
| 0.0% | 292us | 0.0% | 292us | `internal:streams/readable` | `internal:streams/readable:14` |
| 0.0% | 291us | 0.0% | 291us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:174` |
| 0.0% | 291us | 0.0% | 291us | `jacobiEigenSymmetric` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:170` |

## Function Details

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:145` | Self: 54.0% (2.06s) | Total: 56.6% (2.16s) | Samples: 6271

**Called by:**
- `(module)` (6570)

**Calls:**
- `hypot` (299)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:144` | Self: 31.8% (1.21s) | Total: 33.4% (1.27s) | Samples: 3661

**Called by:**
- `(module)` (3855)

**Calls:**
- `hypot` (194)

### `hypot`
`[native code]` | Self: 4.2% (161.3ms) | Total: 4.2% (161.3ms) | Samples: 493

**Called by:**
- `jacobiEigenSymmetric` (299)
- `jacobiEigenSymmetric` (194)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:111` | Self: 1.3% (50.7ms) | Total: 1.3% (50.7ms) | Samples: 154

**Called by:**
- `(module)` (154)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:192` | Self: 1.2% (48.2ms) | Total: 2.0% (78.1ms) | Samples: 147

**Called by:**
- `(module)` (231)

**Calls:**
- `from` (83)
- `max` (1)

### `some`
`[native code]` | Self: 1.2% (46.5ms) | Total: 4.0% (153.1ms) | Samples: 143

**Called by:**
- `validateSquareFiniteMatrix` (238)
- `(anonymous)` (233)
- `some` (2)

**Calls:**
- `(anonymous)` (238)
- `(anonymous)` (90)
- `some` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:110` | Self: 1.0% (40.4ms) | Total: 1.0% (40.8ms) | Samples: 125

**Called by:**
- `(module)` (126)

**Calls:**
- `Float64Array` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:108` | Self: 1.0% (39.7ms) | Total: 1.0% (39.7ms) | Samples: 109

**Called by:**
- `(module)` (109)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.7% (28.7ms) | Total: 0.7% (28.7ms) | Samples: 90

**Called by:**
- `some` (90)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:192` | Self: 0.7% (27.6ms) | Total: 0.7% (27.6ms) | Samples: 77

**Called by:**
- `from` (77)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:114` | Self: 0.5% (20.7ms) | Total: 0.5% (20.7ms) | Samples: 65

**Called by:**
- `(module)` (65)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:168` | Self: 0.4% (17.7ms) | Total: 0.4% (17.7ms) | Samples: 53

**Called by:**
- `(module)` (53)

### `from`
`[native code]` | Self: 0.4% (17.5ms) | Total: 1.2% (46.4ms) | Samples: 24

**Called by:**
- `jacobiEigenSymmetric` (83)
- `jacobiEigenSymmetric` (17)
- `(module)` (3)
- `from` (2)

**Calls:**
- `(anonymous)` (77)
- `from` (2)
- `(anonymous)` (2)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:185` | Self: 0.1% (6.2ms) | Total: 0.7% (27.6ms) | Samples: 17

**Called by:**
- `(module)` (56)

**Calls:**
- `sort` (22)
- `from` (17)

### `sort`
`[native code]` | Self: 0.1% (4.8ms) | Total: 0.1% (7.0ms) | Samples: 15

**Called by:**
- `jacobiEigenSymmetric` (22)

**Calls:**
- `(anonymous)` (7)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:189` | Self: 0.1% (4.0ms) | Total: 0.1% (6.5ms) | Samples: 12

**Called by:**
- `(module)` (16)

**Calls:**
- `map` (3)
- `max` (1)

### `anonymous`
`[native code]` | Self: 0.0% (3.7ms) | Total: 0.6% (25.0ms) | Samples: 12

**Called by:**
- `(anonymous)` (11)
- `node:fs` (9)
- `get WriteStream` (8)
- `internal:fs/streams` (7)
- `internal:stream` (7)
- `node:fs/promises` (7)
- `node:stream` (7)
- `internal:streams/pipeline` (5)
- `internal:streams/compose` (5)
- `node:events` (3)
- `internal:streams/duplex` (3)
- `internal:validators` (2)
- `internal:shared` (2)

**Calls:**
- `node:fs` (9)
- `internal:fs/streams` (7)
- `internal:stream` (7)
- `node:fs/promises` (7)
- `node:stream` (7)
- `internal:streams/pipeline` (5)
- `internal:streams/compose` (5)
- `node:events` (3)
- `internal:streams/duplex` (3)
- `internal:validators` (2)
- `internal:shared` (2)
- `internal:streams/duplex` (1)
- `internal:streams/destroy` (1)
- `internal:streams/readable` (1)
- `node:fs/promises` (1)
- `internal:primordials` (1)
- `internal:primordials` (1)
- `internal:fs/binding` (1)

### `map`
`[native code]` | Self: 0.0% (2.5ms) | Total: 0.0% (2.8ms) | Samples: 8

**Called by:**
- `jacobiEigenSymmetric` (3)
- `jacobiEigenSymmetric` (3)
- `jacobiEigenSymmetric` (3)

**Calls:**
- `(anonymous)` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:186` | Self: 0.0% (2.2ms) | Total: 0.0% (2.2ms) | Samples: 7

**Called by:**
- `sort` (7)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:149` | Self: 0.0% (1.9ms) | Total: 0.0% (1.9ms) | Samples: 6

**Called by:**
- `(module)` (6)

### `max`
`[native code]` | Self: 0.0% (1.8ms) | Total: 0.0% (1.8ms) | Samples: 2

**Called by:**
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 0.0% (1.7ms) | Total: 100.0% (3.81s) | Samples: 5

**Calls:**
- `jacobiEigenSymmetric` (6570)
- `jacobiEigenSymmetric` (3855)
- `jacobiEigenSymmetric` (238)
- `jacobiEigenSymmetric` (231)
- `jacobiEigenSymmetric` (154)
- `jacobiEigenSymmetric` (126)
- `jacobiEigenSymmetric` (109)
- `jacobiEigenSymmetric` (65)
- `jacobiEigenSymmetric` (56)
- `jacobiEigenSymmetric` (53)
- `(anonymous)` (21)
- `jacobiEigenSymmetric` (16)
- `jacobiEigenSymmetric` (6)
- `jacobiEigenSymmetric` (5)
- `jacobiEigenSymmetric` (4)
- `from` (3)
- `jacobiEigenSymmetric` (3)
- `jacobiEigenSymmetric` (2)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)
- `jacobiEigenSymmetric` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` | Self: 0.0% (1.7ms) | Total: 2.0% (77.0ms) | Samples: 5

**Called by:**
- `some` (238)

**Calls:**
- `some` (233)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:195` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 4

**Called by:**
- `(module)` (4)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:191` | Self: 0.0% (693us) | Total: 0.0% (1.6ms) | Samples: 2

**Called by:**
- `(module)` (5)

**Calls:**
- `map` (3)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:152` | Self: 0.0% (668us) | Total: 0.0% (668us) | Samples: 2

**Called by:**
- `(module)` (2)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 0.0% (593us) | Total: 0.0% (593us) | Samples: 2

**Called by:**
- `from` (2)

### `internal:streams/destroy`
`internal:streams/destroy:16` | Self: 0.0% (385us) | Total: 0.0% (385us) | Samples: 1

**Called by:**
- `anonymous` (1)

### `@lazy`
`[native code]` | Self: 0.0% (382us) | Total: 0.0% (382us) | Samples: 1

**Called by:**
- `internal:fs/binding` (1)

### `Float64Array`
`[native code]` | Self: 0.0% (368us) | Total: 0.0% (368us) | Samples: 1

**Called by:**
- `jacobiEigenSymmetric` (1)

### `getOwnPropertyDescriptor`
`[native code]` | Self: 0.0% (356us) | Total: 0.0% (356us) | Samples: 1

**Called by:**
- `internal:streams/duplex` (1)

### `asyncWrap`
`node:fs/promises` | Self: 0.0% (356us) | Total: 0.0% (356us) | Samples: 1

**Called by:**
- `node:fs/promises` (1)

### `(anonymous)`
`internal:primordials` | Self: 0.0% (351us) | Total: 0.0% (351us) | Samples: 1

**Called by:**
- `forEach` (1)

### `internal:primordials`
`internal:primordials:2` | Self: 0.0% (349us) | Total: 0.0% (349us) | Samples: 1

**Called by:**
- `anonymous` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:191` | Self: 0.0% (348us) | Total: 0.0% (348us) | Samples: 1

**Called by:**
- `map` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:122` | Self: 0.0% (344us) | Total: 0.0% (344us) | Samples: 1

**Called by:**
- `(module)` (1)

### `WriteStream`
`internal:fs/streams` | Self: 0.0% (332us) | Total: 0.0% (332us) | Samples: 1

**Called by:**
- `(anonymous)` (1)

### `WritableState`
`internal:streams/writable:135` | Self: 0.0% (313us) | Total: 0.0% (313us) | Samples: 1

**Called by:**
- `Writable` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:193` | Self: 0.0% (301us) | Total: 0.0% (301us) | Samples: 1

**Called by:**
- `(module)` (1)

### `internal:streams/readable`
`internal:streams/readable:14` | Self: 0.0% (292us) | Total: 0.0% (292us) | Samples: 1

**Called by:**
- `anonymous` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:174` | Self: 0.0% (291us) | Total: 0.0% (291us) | Samples: 1

**Called by:**
- `(module)` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:170` | Self: 0.0% (291us) | Total: 0.0% (291us) | Samples: 1

**Called by:**
- `(module)` (1)

### `internal:fs/binding`
`internal:fs/binding:3` | Self: 0.0% (0us) | Total: 0.0% (382us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `@lazy` (1)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:106` | Self: 0.0% (0us) | Total: 2.0% (77.0ms) | Samples: 0

**Called by:**
- `(module)` (238)

**Calls:**
- `validateSquareFiniteMatrix` (238)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (1.0ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (700us) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (3.0ms) | Samples: 0

**Called by:**
- `anonymous` (9)

**Calls:**
- `anonymous` (9)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (2.2ms) | Samples: 0

**Called by:**
- `anonymous` (7)

**Calls:**
- `anonymous` (7)

### `Writable`
`internal:streams/writable:181` | Self: 0.0% (0us) | Total: 0.0% (313us) | Samples: 0

**Called by:**
- `WriteStream` (1)

**Calls:**
- `WritableState` (1)

### `copyProps`
`internal:primordials:23` | Self: 0.0% (0us) | Total: 0.0% (351us) | Samples: 0

**Called by:**
- `makeSafe` (1)

**Calls:**
- `bound call` (1)

### `bound call`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (351us) | Samples: 0

**Called by:**
- `copyProps` (1)

**Calls:**
- `forEach` (1)

### `node:fs/promises`
`node:fs/promises:137` | Self: 0.0% (0us) | Total: 0.0% (356us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `asyncWrap` (1)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (2.4ms) | Samples: 0

**Called by:**
- `anonymous` (7)

**Calls:**
- `anonymous` (7)

### `jacobiEigenSymmetric`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:188` | Self: 0.0% (0us) | Total: 0.0% (1.0ms) | Samples: 0

**Called by:**
- `(module)` (3)

**Calls:**
- `map` (3)

### `internal:streams/duplex`
`internal:streams/duplex:52` | Self: 0.0% (0us) | Total: 0.0% (356us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `getOwnPropertyDescriptor` (1)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (5)

**Calls:**
- `anonymous` (5)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (911us) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `WriteStream`
`internal:fs/streams:259` | Self: 0.0% (0us) | Total: 0.0% (313us) | Samples: 0

**Called by:**
- `(anonymous)` (1)

**Calls:**
- `Writable` (1)

### `validateSquareFiniteMatrix`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:89` | Self: 0.0% (0us) | Total: 2.0% (77.0ms) | Samples: 0

**Called by:**
- `jacobiEigenSymmetric` (238)

**Calls:**
- `some` (238)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (5)

**Calls:**
- `anonymous` (5)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.1% (6.8ms) | Samples: 0

**Called by:**
- `(module)` (21)

**Calls:**
- `anonymous` (11)
- `get WriteStream` (8)
- `WriteStream` (1)
- `WriteStream` (1)

### `makeSafe`
`internal:primordials:50` | Self: 0.0% (0us) | Total: 0.0% (351us) | Samples: 0

**Called by:**
- `internal:primordials` (1)

**Calls:**
- `copyProps` (1)

### `internal:primordials`
`internal:primordials:73` | Self: 0.0% (0us) | Total: 0.0% (351us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `makeSafe` (1)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (700us) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (2.5ms) | Samples: 0

**Called by:**
- `(anonymous)` (8)

**Calls:**
- `anonymous` (8)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (2.2ms) | Samples: 0

**Called by:**
- `anonymous` (7)

**Calls:**
- `anonymous` (7)

### `forEach`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (351us) | Samples: 0

**Called by:**
- `bound call` (1)

**Calls:**
- `(anonymous)` (1)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (2.2ms) | Samples: 0

**Called by:**
- `anonymous` (7)

**Calls:**
- `anonymous` (7)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 93.5% | 3.57s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 6.2% | 239.6ms | `[native code]` |
| 0.0% | 2.3ms | `/Users/jemanuel/projects/cmaes_explainer/[eval]` |
| 0.0% | 700us | `internal:primordials` |
| 0.0% | 385us | `internal:streams/destroy` |
| 0.0% | 356us | `node:fs/promises` |
| 0.0% | 332us | `internal:fs/streams` |
| 0.0% | 313us | `internal:streams/writable` |
| 0.0% | 292us | `internal:streams/readable` |
