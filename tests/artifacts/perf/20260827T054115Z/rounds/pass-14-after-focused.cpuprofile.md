# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 1.81s | 4539 | 250us | 32 |

**Top 10:** `after` 97.9%, `fill` 0.8%, `(module)` 0.5%, `anonymous` 0.2%, `from` 0.0%, `makeBitMapDescriptor` 0.0%, `(anonymous)` 0.0%, `internal:stream/promises` 0.0%, `makeSafe` 0.0%, `WritableState` 0.0%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 97.9% | 1.77s | 98.8% | 1.79s | `after` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:4` |
| 0.8% | 16.1ms | 0.8% | 16.1ms | `fill` | `[native code]` |
| 0.5% | 10.6ms | 99.8% | 1.80s | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:5` |
| 0.2% | 4.9ms | 1.7% | 31.8ms | `anonymous` | `[native code]` |
| 0.0% | 1.3ms | 0.2% | 4.0ms | `from` | `[native code]` |
| 0.0% | 953us | 0.0% | 953us | `makeBitMapDescriptor` | `internal:streams/writable:17` |
| 0.0% | 702us | 0.0% | 702us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:2` |
| 0.0% | 418us | 0.0% | 418us | `internal:stream/promises` | `internal:stream/promises:19` |
| 0.0% | 417us | 0.0% | 417us | `makeSafe` | `internal:primordials` |
| 0.0% | 378us | 0.0% | 378us | `WritableState` | `internal:streams/writable` |
| 0.0% | 363us | 0.0% | 363us | `internal:shared` | `internal:shared:56` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 99.8% | 1.80s | 0.5% | 10.6ms | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:5` |
| 98.8% | 1.79s | 97.9% | 1.77s | `after` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:4` |
| 1.7% | 31.8ms | 0.2% | 4.9ms | `anonymous` | `[native code]` |
| 0.8% | 16.1ms | 0.8% | 16.1ms | `fill` | `[native code]` |
| 0.4% | 7.4ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.2% | 4.0ms | 0.0% | 1.3ms | `from` | `[native code]` |
| 0.1% | 3.2ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.1% | 3.2ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.1% | 3.2ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.1% | 2.8ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.1% | 2.6ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.1% | 2.3ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.1% | 2.1ms | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.1% | 2.1ms | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.1% | 2.1ms | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.1% | 2.0ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:2` |
| 0.0% | 1.1ms | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 1.1ms | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 953us | 0.0% | 953us | `makeBitMapDescriptor` | `internal:streams/writable:17` |
| 0.0% | 953us | 0.0% | 0us | `internal:streams/writable` | `internal:streams/writable:33` |
| 0.0% | 702us | 0.0% | 702us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:2` |
| 0.0% | 419us | 0.0% | 0us | `node:fs` | `node:fs:299` |
| 0.0% | 419us | 0.0% | 0us | `internal:promisify` | `internal:promisify:53` |
| 0.0% | 418us | 0.0% | 418us | `internal:stream/promises` | `internal:stream/promises:19` |
| 0.0% | 417us | 0.0% | 417us | `makeSafe` | `internal:primordials` |
| 0.0% | 417us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 417us | 0.0% | 0us | `internal:primordials` | `internal:primordials:73` |
| 0.0% | 378us | 0.0% | 378us | `WritableState` | `internal:streams/writable` |
| 0.0% | 378us | 0.0% | 0us | `Writable` | `internal:streams/writable:181` |
| 0.0% | 378us | 0.0% | 0us | `WriteStream` | `internal:fs/streams:259` |
| 0.0% | 363us | 0.0% | 363us | `internal:shared` | `internal:shared:56` |
| 0.0% | 341us | 0.0% | 0us | `internal:streams/readable` | `internal:streams/readable:2` |

## Function Details

### `after`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:4` | Self: 97.9% (1.77s) | Total: 98.8% (1.79s) | Samples: 4449

**Called by:**
- `(module)` (4490)

**Calls:**
- `fill` (41)

### `fill`
`[native code]` | Self: 0.8% (16.1ms) | Total: 0.8% (16.1ms) | Samples: 41

**Called by:**
- `after` (41)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:5` | Self: 0.5% (10.6ms) | Total: 99.8% (1.80s) | Samples: 28

**Calls:**
- `after` (4490)
- `(anonymous)` (18)

### `anonymous`
`[native code]` | Self: 0.2% (4.9ms) | Total: 1.7% (31.8ms) | Samples: 13

**Called by:**
- `(anonymous)` (10)
- `internal:fs/streams` (7)
- `get WriteStream` (7)
- `node:stream` (7)
- `node:fs` (7)
- `internal:stream` (6)
- `node:fs/promises` (6)
- `internal:streams/compose` (4)
- `internal:streams/duplex` (4)
- `internal:streams/pipeline` (4)
- `node:events` (3)
- `internal:validators` (3)
- `node:fs` (1)
- `internal:streams/readable` (1)
- `internal:promisify` (1)
- `internal:shared` (1)

**Calls:**
- `internal:fs/streams` (7)
- `node:stream` (7)
- `node:fs` (7)
- `internal:stream` (6)
- `node:fs/promises` (6)
- `internal:streams/pipeline` (4)
- `internal:streams/duplex` (4)
- `internal:streams/compose` (4)
- `node:events` (3)
- `internal:validators` (3)
- `node:fs` (1)
- `internal:stream/promises` (1)
- `internal:streams/readable` (1)
- `internal:promisify` (1)
- `internal:shared` (1)
- `internal:primordials` (1)
- `internal:shared` (1)
- `internal:streams/writable` (1)

### `from`
`[native code]` | Self: 0.0% (1.3ms) | Total: 0.2% (4.0ms) | Samples: 1

**Called by:**
- `from` (3)
- `(module)` (3)

**Calls:**
- `from` (3)
- `(anonymous)` (2)

### `makeBitMapDescriptor`
`internal:streams/writable:17` | Self: 0.0% (953us) | Total: 0.0% (953us) | Samples: 1

**Called by:**
- `internal:streams/writable` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:2` | Self: 0.0% (702us) | Total: 0.0% (702us) | Samples: 2

**Called by:**
- `from` (2)

### `internal:stream/promises`
`internal:stream/promises:19` | Self: 0.0% (418us) | Total: 0.0% (418us) | Samples: 1

**Called by:**
- `anonymous` (1)

### `makeSafe`
`internal:primordials` | Self: 0.0% (417us) | Total: 0.0% (417us) | Samples: 1

**Called by:**
- `internal:primordials` (1)

### `WritableState`
`internal:streams/writable` | Self: 0.0% (378us) | Total: 0.0% (378us) | Samples: 1

**Called by:**
- `Writable` (1)

### `internal:shared`
`internal:shared:56` | Self: 0.0% (363us) | Total: 0.0% (363us) | Samples: 1

**Called by:**
- `anonymous` (1)

### `node:fs`
`node:fs:299` | Self: 0.0% (0us) | Total: 0.0% (419us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.1% (2.3ms) | Samples: 0

**Called by:**
- `anonymous` (6)

**Calls:**
- `anonymous` (6)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.1% (3.2ms) | Samples: 0

**Called by:**
- `anonymous` (7)

**Calls:**
- `anonymous` (7)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.1% (2.1ms) | Samples: 0

**Called by:**
- `anonymous` (4)

**Calls:**
- `anonymous` (4)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.1% (2.6ms) | Samples: 0

**Called by:**
- `anonymous` (7)

**Calls:**
- `anonymous` (7)

### `internal:streams/readable`
`internal:streams/readable:2` | Self: 0.0% (0us) | Total: 0.0% (341us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.1% (2.1ms) | Samples: 0

**Called by:**
- `anonymous` (4)

**Calls:**
- `anonymous` (4)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (1.1ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (1.1ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.4% (7.4ms) | Samples: 0

**Called by:**
- `(module)` (18)

**Calls:**
- `anonymous` (10)
- `get WriteStream` (7)
- `WriteStream` (1)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.1% (2.8ms) | Samples: 0

**Called by:**
- `anonymous` (6)

**Calls:**
- `anonymous` (6)

### `Writable`
`internal:streams/writable:181` | Self: 0.0% (0us) | Total: 0.0% (378us) | Samples: 0

**Called by:**
- `WriteStream` (1)

**Calls:**
- `WritableState` (1)

### `internal:promisify`
`internal:promisify:53` | Self: 0.0% (0us) | Total: 0.0% (419us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (417us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:primordials`
`internal:primordials:73` | Self: 0.0% (0us) | Total: 0.0% (417us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `makeSafe` (1)

### `internal:streams/writable`
`internal:streams/writable:33` | Self: 0.0% (0us) | Total: 0.0% (953us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `makeBitMapDescriptor` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:2` | Self: 0.0% (0us) | Total: 0.1% (2.0ms) | Samples: 0

**Calls:**
- `from` (3)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.1% (3.2ms) | Samples: 0

**Called by:**
- `(anonymous)` (7)

**Calls:**
- `anonymous` (7)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.1% (2.1ms) | Samples: 0

**Called by:**
- `anonymous` (4)

**Calls:**
- `anonymous` (4)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.1% (3.2ms) | Samples: 0

**Called by:**
- `anonymous` (7)

**Calls:**
- `anonymous` (7)

### `WriteStream`
`internal:fs/streams:259` | Self: 0.0% (0us) | Total: 0.0% (378us) | Samples: 0

**Called by:**
- `(anonymous)` (1)

**Calls:**
- `Writable` (1)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 98.6% | 1.78s | `/Users/jemanuel/projects/cmaes_explainer/[eval]` |
| 1.2% | 22.4ms | `[native code]` |
| 0.0% | 1.3ms | `internal:streams/writable` |
| 0.0% | 418us | `internal:stream/promises` |
| 0.0% | 417us | `internal:primordials` |
| 0.0% | 363us | `internal:shared` |
