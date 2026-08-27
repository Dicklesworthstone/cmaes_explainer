# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 2.67s | 6740 | 250us | 36 |

**Top 10:** `before` 97.9%, `fill` 1.1%, `(module)` 0.4%, `anonymous` 0.1%, `(anonymous)` 0.1%, `@lazy` 0.0%, `internal:primordials` 0.0%, `WriteStream` 0.0%, `WritableState` 0.0%, `WriteStream` 0.0%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 97.9% | 2.61s | 99.1% | 2.65s | `before` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:3` |
| 1.1% | 32.0ms | 1.1% | 32.0ms | `fill` | `[native code]` |
| 0.4% | 12.4ms | 99.8% | 2.67s | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:5` |
| 0.1% | 4.7ms | 1.0% | 28.7ms | `anonymous` | `[native code]` |
| 0.1% | 3.1ms | 0.1% | 3.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:2` |
| 0.0% | 791us | 0.0% | 791us | `@lazy` | `[native code]` |
| 0.0% | 744us | 0.0% | 744us | `internal:primordials` | `internal:primordials:2` |
| 0.0% | 450us | 0.0% | 450us | `WriteStream` | `internal:fs/streams:209` |
| 0.0% | 422us | 0.0% | 422us | `WritableState` | `internal:streams/writable` |
| 0.0% | 367us | 0.0% | 367us | `WriteStream` | `internal:fs/streams` |
| 0.0% | 350us | 0.0% | 350us | `(anonymous)` | `internal:primordials` |
| 0.0% | 328us | 0.0% | 328us | `internal:abort_listener` | `internal:abort_listener:2` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 99.8% | 2.67s | 0.4% | 12.4ms | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:5` |
| 99.1% | 2.65s | 97.9% | 2.61s | `before` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:3` |
| 1.1% | 32.0ms | 1.1% | 32.0ms | `fill` | `[native code]` |
| 1.0% | 28.7ms | 0.1% | 4.7ms | `anonymous` | `[native code]` |
| 0.3% | 8.2ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.2% | 6.2ms | 0.0% | 0us | `from` | `[native code]` |
| 0.1% | 4.1ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.1% | 3.7ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.1% | 3.1ms | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:2` |
| 0.1% | 3.1ms | 0.1% | 3.1ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:2` |
| 0.0% | 2.0ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 2.0ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 2.0ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 1.7ms | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 1.6ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 1.4ms | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 1.2ms | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 1.0ms | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 894us | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 894us | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 791us | 0.0% | 0us | `internal:fs/binding` | `internal:fs/binding:3` |
| 0.0% | 791us | 0.0% | 791us | `@lazy` | `[native code]` |
| 0.0% | 744us | 0.0% | 744us | `internal:primordials` | `internal:primordials:2` |
| 0.0% | 450us | 0.0% | 450us | `WriteStream` | `internal:fs/streams:209` |
| 0.0% | 422us | 0.0% | 422us | `WritableState` | `internal:streams/writable` |
| 0.0% | 422us | 0.0% | 0us | `Writable` | `internal:streams/writable:181` |
| 0.0% | 422us | 0.0% | 0us | `WriteStream` | `internal:fs/streams:259` |
| 0.0% | 367us | 0.0% | 367us | `WriteStream` | `internal:fs/streams` |
| 0.0% | 350us | 0.0% | 0us | `bound call` | `[native code]` |
| 0.0% | 350us | 0.0% | 0us | `internal:primordials` | `internal:primordials:73` |
| 0.0% | 350us | 0.0% | 0us | `forEach` | `[native code]` |
| 0.0% | 350us | 0.0% | 0us | `makeSafe` | `internal:primordials:31` |
| 0.0% | 350us | 0.0% | 350us | `(anonymous)` | `internal:primordials` |
| 0.0% | 343us | 0.0% | 0us | `node:fs` | `node:fs:299` |
| 0.0% | 343us | 0.0% | 0us | `internal:promisify` | `internal:promisify:53` |
| 0.0% | 328us | 0.0% | 328us | `internal:abort_listener` | `internal:abort_listener:2` |

## Function Details

### `before`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:3` | Self: 97.9% (2.61s) | Total: 99.1% (2.65s) | Samples: 6603

**Called by:**
- `(module)` (6684)

**Calls:**
- `fill` (81)

### `fill`
`[native code]` | Self: 1.1% (32.0ms) | Total: 1.1% (32.0ms) | Samples: 81

**Called by:**
- `before` (81)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:5` | Self: 0.4% (12.4ms) | Total: 99.8% (2.67s) | Samples: 31

**Calls:**
- `before` (6684)
- `(anonymous)` (21)

### `anonymous`
`[native code]` | Self: 0.1% (4.7ms) | Total: 1.0% (28.7ms) | Samples: 12

**Called by:**
- `(anonymous)` (13)
- `node:fs` (11)
- `node:fs/promises` (10)
- `internal:fs/streams` (5)
- `node:events` (5)
- `get WriteStream` (5)
- `node:stream` (5)
- `internal:validators` (4)
- `internal:stream` (4)
- `internal:shared` (3)
- `internal:streams/compose` (3)
- `internal:streams/duplex` (2)
- `internal:streams/pipeline` (2)
- `node:fs` (1)
- `internal:promisify` (1)

**Calls:**
- `node:fs` (11)
- `node:fs/promises` (10)
- `internal:fs/streams` (5)
- `node:events` (5)
- `node:stream` (5)
- `internal:validators` (4)
- `internal:stream` (4)
- `internal:shared` (3)
- `internal:streams/compose` (3)
- `internal:streams/pipeline` (2)
- `internal:primordials` (2)
- `internal:streams/duplex` (2)
- `internal:fs/binding` (2)
- `node:fs` (1)
- `internal:promisify` (1)
- `internal:abort_listener` (1)
- `internal:primordials` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:2` | Self: 0.1% (3.1ms) | Total: 0.1% (3.1ms) | Samples: 4

**Called by:**
- `from` (4)

### `@lazy`
`[native code]` | Self: 0.0% (791us) | Total: 0.0% (791us) | Samples: 2

**Called by:**
- `internal:fs/binding` (2)

### `internal:primordials`
`internal:primordials:2` | Self: 0.0% (744us) | Total: 0.0% (744us) | Samples: 2

**Called by:**
- `anonymous` (2)

### `WriteStream`
`internal:fs/streams:209` | Self: 0.0% (450us) | Total: 0.0% (450us) | Samples: 1

**Called by:**
- `(anonymous)` (1)

### `WritableState`
`internal:streams/writable` | Self: 0.0% (422us) | Total: 0.0% (422us) | Samples: 1

**Called by:**
- `Writable` (1)

### `WriteStream`
`internal:fs/streams` | Self: 0.0% (367us) | Total: 0.0% (367us) | Samples: 1

**Called by:**
- `(anonymous)` (1)

### `(anonymous)`
`internal:primordials` | Self: 0.0% (350us) | Total: 0.0% (350us) | Samples: 1

**Called by:**
- `forEach` (1)

### `internal:abort_listener`
`internal:abort_listener:2` | Self: 0.0% (328us) | Total: 0.0% (328us) | Samples: 1

**Called by:**
- `anonymous` (1)

### `from`
`[native code]` | Self: 0.0% (0us) | Total: 0.2% (6.2ms) | Samples: 0

**Called by:**
- `from` (4)
- `(module)` (4)

**Calls:**
- `from` (4)
- `(anonymous)` (4)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (1.2ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.1% (3.7ms) | Samples: 0

**Called by:**
- `anonymous` (10)

**Calls:**
- `anonymous` (10)

### `internal:promisify`
`internal:promisify:53` | Self: 0.0% (0us) | Total: 0.0% (343us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (2.0ms) | Samples: 0

**Called by:**
- `anonymous` (5)

**Calls:**
- `anonymous` (5)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.1% (4.1ms) | Samples: 0

**Called by:**
- `anonymous` (11)

**Calls:**
- `anonymous` (11)

### `WriteStream`
`internal:fs/streams:259` | Self: 0.0% (0us) | Total: 0.0% (422us) | Samples: 0

**Called by:**
- `(anonymous)` (1)

**Calls:**
- `Writable` (1)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (894us) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `anonymous` (4)

**Calls:**
- `anonymous` (4)

### `node:fs`
`node:fs:299` | Self: 0.0% (0us) | Total: 0.0% (343us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.3% (8.2ms) | Samples: 0

**Called by:**
- `(module)` (21)

**Calls:**
- `anonymous` (13)
- `get WriteStream` (5)
- `WriteStream` (1)
- `WriteStream` (1)
- `WriteStream` (1)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (4)

**Calls:**
- `anonymous` (4)

### `Writable`
`internal:streams/writable:181` | Self: 0.0% (0us) | Total: 0.0% (422us) | Samples: 0

**Called by:**
- `WriteStream` (1)

**Calls:**
- `WritableState` (1)

### `bound call`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (350us) | Samples: 0

**Called by:**
- `makeSafe` (1)

**Calls:**
- `forEach` (1)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (2.0ms) | Samples: 0

**Called by:**
- `(anonymous)` (5)

**Calls:**
- `anonymous` (5)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (2.0ms) | Samples: 0

**Called by:**
- `anonymous` (5)

**Calls:**
- `anonymous` (5)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (1.0ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `internal:primordials`
`internal:primordials:73` | Self: 0.0% (0us) | Total: 0.0% (350us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `makeSafe` (1)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (1.7ms) | Samples: 0

**Called by:**
- `anonymous` (5)

**Calls:**
- `anonymous` (5)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:2` | Self: 0.0% (0us) | Total: 0.1% (3.1ms) | Samples: 0

**Calls:**
- `from` (4)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (894us) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `makeSafe`
`internal:primordials:31` | Self: 0.0% (0us) | Total: 0.0% (350us) | Samples: 0

**Called by:**
- `internal:primordials` (1)

**Calls:**
- `bound call` (1)

### `forEach`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (350us) | Samples: 0

**Called by:**
- `bound call` (1)

**Calls:**
- `(anonymous)` (1)

### `internal:fs/binding`
`internal:fs/binding:3` | Self: 0.0% (0us) | Total: 0.0% (791us) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `@lazy` (2)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 98.4% | 2.63s | `/Users/jemanuel/projects/cmaes_explainer/[eval]` |
| 1.4% | 37.6ms | `[native code]` |
| 0.0% | 1.0ms | `internal:primordials` |
| 0.0% | 817us | `internal:fs/streams` |
| 0.0% | 422us | `internal:streams/writable` |
| 0.0% | 328us | `internal:abort_listener` |
