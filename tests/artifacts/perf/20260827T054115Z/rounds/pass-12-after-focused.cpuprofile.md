# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 947.1ms | 2853 | 250us | 33 |

**Top 10:** `run` 86.0%, `fill` 9.1%, `run` 3.4%, `anonymous` 0.5%, `kernel` 0.3%, `kernel` 0.2%, `filter` 0.0%, `bind` 0.0%, `WritableState` 0.0%, `(module)` 0.0%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 86.0% | 813.9ms | 95.7% | 906.0ms | `run` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 9.1% | 86.1ms | 9.1% | 86.1ms | `fill` | `[native code]` |
| 3.4% | 32.6ms | 3.4% | 32.6ms | `run` | `/Users/jemanuel/projects/cmaes_explainer/[eval]` |
| 0.5% | 5.3ms | 2.3% | 21.8ms | `anonymous` | `[native code]` |
| 0.3% | 3.6ms | 0.3% | 3.6ms | `kernel` | `/Users/jemanuel/projects/cmaes_explainer/[eval]` |
| 0.2% | 2.3ms | 0.2% | 2.3ms | `kernel` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 781us | 0.0% | 781us | `filter` | `[native code]` |
| 0.0% | 383us | 0.0% | 383us | `bind` | `[native code]` |
| 0.0% | 341us | 0.0% | 341us | `WritableState` | `internal:streams/writable` |
| 0.0% | 318us | 100.0% | 946.1ms | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 294us | 0.0% | 294us | `internal:streams/destroy` | `internal:streams/destroy:16` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 100.0% | 946.1ms | 0.0% | 318us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 95.7% | 906.0ms | 86.0% | 813.9ms | `run` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 9.1% | 86.1ms | 9.1% | 86.1ms | `fill` | `[native code]` |
| 3.4% | 32.6ms | 3.4% | 32.6ms | `run` | `/Users/jemanuel/projects/cmaes_explainer/[eval]` |
| 2.3% | 21.8ms | 0.5% | 5.3ms | `anonymous` | `[native code]` |
| 0.6% | 6.3ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.3% | 3.6ms | 0.3% | 3.6ms | `kernel` | `/Users/jemanuel/projects/cmaes_explainer/[eval]` |
| 0.2% | 2.6ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.2% | 2.3ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.2% | 2.3ms | 0.2% | 2.3ms | `kernel` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.2% | 2.3ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.2% | 2.0ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.2% | 2.0ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.1% | 1.3ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.1% | 1.0ms | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.1% | 1.0ms | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 781us | 0.0% | 781us | `filter` | `[native code]` |
| 0.0% | 747us | 0.0% | 0us | `internal:stream` | `internal:stream:47` |
| 0.0% | 747us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 610us | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 610us | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 383us | 0.0% | 383us | `bind` | `[native code]` |
| 0.0% | 383us | 0.0% | 0us | `bound call` | `[native code]` |
| 0.0% | 383us | 0.0% | 0us | `makeSafe` | `internal:primordials:31` |
| 0.0% | 383us | 0.0% | 0us | `internal:primordials` | `internal:primordials:73` |
| 0.0% | 383us | 0.0% | 0us | `forEach` | `[native code]` |
| 0.0% | 383us | 0.0% | 0us | `(anonymous)` | `internal:primordials:38` |
| 0.0% | 341us | 0.0% | 0us | `WriteStream` | `internal:fs/streams:259` |
| 0.0% | 341us | 0.0% | 0us | `Writable` | `internal:streams/writable:181` |
| 0.0% | 341us | 0.0% | 341us | `WritableState` | `internal:streams/writable` |
| 0.0% | 333us | 0.0% | 0us | `node:fs` | `node:fs:299` |
| 0.0% | 316us | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 294us | 0.0% | 294us | `internal:streams/destroy` | `internal:streams/destroy:16` |

## Function Details

### `run`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 86.0% (813.9ms) | Total: 95.7% (906.0ms) | Samples: 2452

**Called by:**
- `(module)` (2733)

**Calls:**
- `fill` (262)
- `kernel` (11)
- `kernel` (8)

### `fill`
`[native code]` | Self: 9.1% (86.1ms) | Total: 9.1% (86.1ms) | Samples: 262

**Called by:**
- `run` (262)

### `run`
`/Users/jemanuel/projects/cmaes_explainer/[eval]` | Self: 3.4% (32.6ms) | Total: 3.4% (32.6ms) | Samples: 100

**Called by:**
- `(module)` (100)

### `anonymous`
`[native code]` | Self: 0.5% (5.3ms) | Total: 2.3% (21.8ms) | Samples: 15

**Called by:**
- `(anonymous)` (11)
- `node:fs` (8)
- `node:fs/promises` (7)
- `get WriteStream` (6)
- `internal:fs/streams` (5)
- `node:stream` (5)
- `internal:stream` (4)
- `node:events` (3)
- `internal:validators` (3)
- `internal:streams/pipeline` (2)
- `internal:shared` (2)
- `internal:streams/compose` (2)
- `node:fs` (1)
- `internal:stream` (1)
- `internal:streams/duplex` (1)

**Calls:**
- `node:fs` (8)
- `node:fs/promises` (7)
- `internal:fs/streams` (5)
- `node:stream` (5)
- `internal:stream` (4)
- `node:events` (3)
- `internal:validators` (3)
- `internal:streams/pipeline` (2)
- `internal:shared` (2)
- `internal:streams/compose` (2)
- `node:fs` (1)
- `internal:streams/destroy` (1)
- `internal:primordials` (1)
- `internal:streams/duplex` (1)
- `internal:stream` (1)

### `kernel`
`/Users/jemanuel/projects/cmaes_explainer/[eval]` | Self: 0.3% (3.6ms) | Total: 0.3% (3.6ms) | Samples: 11

**Called by:**
- `run` (11)

### `kernel`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 0.2% (2.3ms) | Total: 0.2% (2.3ms) | Samples: 8

**Called by:**
- `run` (8)

### `filter`
`[native code]` | Self: 0.0% (781us) | Total: 0.0% (781us) | Samples: 1

**Called by:**
- `(module)` (1)

### `bind`
`[native code]` | Self: 0.0% (383us) | Total: 0.0% (383us) | Samples: 1

**Called by:**
- `(anonymous)` (1)

### `WritableState`
`internal:streams/writable` | Self: 0.0% (341us) | Total: 0.0% (341us) | Samples: 1

**Called by:**
- `Writable` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 0.0% (318us) | Total: 100.0% (946.1ms) | Samples: 1

**Calls:**
- `run` (2733)
- `run` (100)
- `(anonymous)` (18)
- `filter` (1)

### `internal:streams/destroy`
`internal:streams/destroy:16` | Self: 0.0% (294us) | Total: 0.0% (294us) | Samples: 1

**Called by:**
- `anonymous` (1)

### `WriteStream`
`internal:fs/streams:259` | Self: 0.0% (0us) | Total: 0.0% (341us) | Samples: 0

**Called by:**
- `(anonymous)` (1)

**Calls:**
- `Writable` (1)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.2% (2.3ms) | Samples: 0

**Called by:**
- `anonymous` (7)

**Calls:**
- `anonymous` (7)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.2% (2.0ms) | Samples: 0

**Called by:**
- `anonymous` (5)

**Calls:**
- `anonymous` (5)

### `internal:stream`
`internal:stream:47` | Self: 0.0% (0us) | Total: 0.0% (747us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.2% (2.6ms) | Samples: 0

**Called by:**
- `anonymous` (8)

**Calls:**
- `anonymous` (8)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (610us) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (610us) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.1% (1.0ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `node:fs`
`node:fs:299` | Self: 0.0% (0us) | Total: 0.0% (333us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.6% (6.3ms) | Samples: 0

**Called by:**
- `(module)` (18)

**Calls:**
- `anonymous` (11)
- `get WriteStream` (6)
- `WriteStream` (1)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.1% (1.3ms) | Samples: 0

**Called by:**
- `anonymous` (4)

**Calls:**
- `anonymous` (4)

### `bound call`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (383us) | Samples: 0

**Called by:**
- `makeSafe` (1)

**Calls:**
- `forEach` (1)

### `Writable`
`internal:streams/writable:181` | Self: 0.0% (0us) | Total: 0.0% (341us) | Samples: 0

**Called by:**
- `WriteStream` (1)

**Calls:**
- `WritableState` (1)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.2% (2.3ms) | Samples: 0

**Called by:**
- `(anonymous)` (6)

**Calls:**
- `anonymous` (6)

### `(anonymous)`
`internal:primordials:38` | Self: 0.0% (0us) | Total: 0.0% (383us) | Samples: 0

**Called by:**
- `forEach` (1)

**Calls:**
- `bind` (1)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.1% (1.0ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `forEach`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (383us) | Samples: 0

**Called by:**
- `bound call` (1)

**Calls:**
- `(anonymous)` (1)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (747us) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `internal:primordials`
`internal:primordials:73` | Self: 0.0% (0us) | Total: 0.0% (383us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `makeSafe` (1)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.2% (2.0ms) | Samples: 0

**Called by:**
- `anonymous` (5)

**Calls:**
- `anonymous` (5)

### `makeSafe`
`internal:primordials:31` | Self: 0.0% (0us) | Total: 0.0% (383us) | Samples: 0

**Called by:**
- `internal:primordials` (1)

**Calls:**
- `bound call` (1)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (316us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 90.1% | 852.8ms | `/Users/jemanuel/projects/cmaes_explainer/[eval]` |
| 9.7% | 92.6ms | `[native code]` |
| 0.0% | 341us | `internal:streams/writable` |
| 0.0% | 294us | `internal:streams/destroy` |
