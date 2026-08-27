# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 2.51s | 6363 | 250us | 34 |

**Top 10:** `kernel` 92.5%, `fill` 6.8%, `run` 0.2%, `anonymous` 0.1%, `(module)` 0.0%, `(anonymous)` 0.0%, `(module)` 0.0%, `@lazy` 0.0%, `(anonymous)` 0.0%, `WriteStream` 0.0%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 92.5% | 2.32s | 99.3% | 2.49s | `kernel` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 6.8% | 172.0ms | 6.8% | 172.0ms | `fill` | `[native code]` |
| 0.2% | 5.6ms | 99.5% | 2.50s | `run` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.1% | 4.5ms | 1.2% | 32.2ms | `anonymous` | `[native code]` |
| 0.0% | 1.2ms | 99.9% | 2.51s | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 901us | 0.3% | 8.5ms | `(anonymous)` | `[native code]` |
| 0.0% | 774us | 0.0% | 774us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]` |
| 0.0% | 431us | 0.0% | 431us | `@lazy` | `[native code]` |
| 0.0% | 420us | 0.0% | 420us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 385us | 0.0% | 385us | `WriteStream` | `internal:fs/streams:198` |
| 0.0% | 372us | 0.0% | 372us | `internal:primordials` | `internal:primordials:2` |
| 0.0% | 371us | 0.0% | 371us | `internal:streams/destroy` | `internal:streams/destroy:16` |
| 0.0% | 354us | 0.0% | 354us | `internal:primordials` | `internal:primordials:80` |
| 0.0% | 314us | 0.0% | 314us | `defineProperty` | `[native code]` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 99.9% | 2.51s | 0.0% | 1.2ms | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 99.5% | 2.50s | 0.2% | 5.6ms | `run` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 99.3% | 2.49s | 92.5% | 2.32s | `kernel` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 6.8% | 172.0ms | 6.8% | 172.0ms | `fill` | `[native code]` |
| 1.2% | 32.2ms | 0.1% | 4.5ms | `anonymous` | `[native code]` |
| 0.3% | 8.5ms | 0.0% | 901us | `(anonymous)` | `[native code]` |
| 0.1% | 3.4ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.1% | 3.4ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.1% | 3.3ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.1% | 3.0ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.1% | 2.7ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 2.3ms | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 2.3ms | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 2.3ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 1.6ms | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 1.1ms | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 901us | 0.0% | 0us | `internal:streams/legacy` | `internal:streams/legacy:6` |
| 0.0% | 840us | 0.0% | 0us | `from` | `[native code]` |
| 0.0% | 774us | 0.0% | 774us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]` |
| 0.0% | 726us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 726us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 431us | 0.0% | 431us | `@lazy` | `[native code]` |
| 0.0% | 431us | 0.0% | 0us | `internal:fs/binding` | `internal:fs/binding:3` |
| 0.0% | 420us | 0.0% | 420us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 385us | 0.0% | 385us | `WriteStream` | `internal:fs/streams:198` |
| 0.0% | 372us | 0.0% | 372us | `internal:primordials` | `internal:primordials:2` |
| 0.0% | 371us | 0.0% | 371us | `internal:streams/destroy` | `internal:streams/destroy:16` |
| 0.0% | 354us | 0.0% | 354us | `internal:primordials` | `internal:primordials:80` |
| 0.0% | 348us | 0.0% | 0us | `internal:streams/end-of-stream` | `internal:streams/end-of-stream:17` |
| 0.0% | 348us | 0.0% | 0us | `internal:streams/operators` | `internal:streams/operators:2` |
| 0.0% | 346us | 0.0% | 0us | `internal:stream` | `internal:stream:46` |
| 0.0% | 314us | 0.0% | 0us | `asyncWrap` | `node:fs/promises:249` |
| 0.0% | 314us | 0.0% | 314us | `defineProperty` | `[native code]` |
| 0.0% | 314us | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:164` |

## Function Details

### `kernel`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 92.5% (2.32s) | Total: 99.3% (2.49s) | Samples: 5888

**Called by:**
- `run` (6324)

**Calls:**
- `fill` (436)

### `fill`
`[native code]` | Self: 6.8% (172.0ms) | Total: 6.8% (172.0ms) | Samples: 436

**Called by:**
- `kernel` (436)

### `run`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 0.2% (5.6ms) | Total: 99.5% (2.50s) | Samples: 15

**Called by:**
- `(module)` (6339)

**Calls:**
- `kernel` (6324)

### `anonymous`
`[native code]` | Self: 0.1% (4.5ms) | Total: 1.2% (32.2ms) | Samples: 12

**Called by:**
- `(anonymous)` (10)
- `node:fs` (9)
- `internal:fs/streams` (8)
- `get WriteStream` (8)
- `node:stream` (7)
- `internal:stream` (6)
- `node:fs/promises` (6)
- `internal:streams/pipeline` (5)
- `internal:streams/compose` (5)
- `node:events` (3)
- `internal:streams/duplex` (3)
- `internal:validators` (2)
- `internal:shared` (2)
- `internal:streams/end-of-stream` (1)
- `internal:streams/operators` (1)
- `internal:stream` (1)

**Calls:**
- `node:fs` (9)
- `internal:fs/streams` (8)
- `node:stream` (7)
- `internal:stream` (6)
- `node:fs/promises` (6)
- `internal:streams/pipeline` (5)
- `internal:streams/compose` (5)
- `node:events` (3)
- `internal:streams/duplex` (3)
- `internal:validators` (2)
- `internal:shared` (2)
- `internal:stream` (1)
- `internal:streams/destroy` (1)
- `internal:streams/end-of-stream` (1)
- `internal:primordials` (1)
- `internal:primordials` (1)
- `node:fs/promises` (1)
- `internal:streams/operators` (1)
- `internal:fs/binding` (1)
- `internal:streams/legacy` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 0.0% (1.2ms) | Total: 99.9% (2.51s) | Samples: 3

**Calls:**
- `run` (6339)
- `(anonymous)` (19)
- `from` (1)

### `(anonymous)`
`[native code]` | Self: 0.0% (901us) | Total: 0.3% (8.5ms) | Samples: 1

**Called by:**
- `(module)` (19)
- `internal:streams/legacy` (1)

**Calls:**
- `anonymous` (10)
- `get WriteStream` (8)
- `WriteStream` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]` | Self: 0.0% (774us) | Total: 0.0% (774us) | Samples: 1

### `@lazy`
`[native code]` | Self: 0.0% (431us) | Total: 0.0% (431us) | Samples: 1

**Called by:**
- `internal:fs/binding` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 0.0% (420us) | Total: 0.0% (420us) | Samples: 1

**Called by:**
- `from` (1)

### `WriteStream`
`internal:fs/streams:198` | Self: 0.0% (385us) | Total: 0.0% (385us) | Samples: 1

**Called by:**
- `(anonymous)` (1)

### `internal:primordials`
`internal:primordials:2` | Self: 0.0% (372us) | Total: 0.0% (372us) | Samples: 1

**Called by:**
- `anonymous` (1)

### `internal:streams/destroy`
`internal:streams/destroy:16` | Self: 0.0% (371us) | Total: 0.0% (371us) | Samples: 1

**Called by:**
- `anonymous` (1)

### `internal:primordials`
`internal:primordials:80` | Self: 0.0% (354us) | Total: 0.0% (354us) | Samples: 1

**Called by:**
- `anonymous` (1)

### `defineProperty`
`[native code]` | Self: 0.0% (314us) | Total: 0.0% (314us) | Samples: 1

**Called by:**
- `asyncWrap` (1)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.1% (3.3ms) | Samples: 0

**Called by:**
- `anonymous` (9)

**Calls:**
- `anonymous` (9)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.1% (3.0ms) | Samples: 0

**Called by:**
- `anonymous` (7)

**Calls:**
- `anonymous` (7)

### `internal:streams/legacy`
`internal:streams/legacy:6` | Self: 0.0% (0us) | Total: 0.0% (901us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `(anonymous)` (1)

### `node:fs/promises`
`node:fs/promises:164` | Self: 0.0% (0us) | Total: 0.0% (314us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `asyncWrap` (1)

### `internal:stream`
`internal:stream:46` | Self: 0.0% (0us) | Total: 0.0% (346us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (2.3ms) | Samples: 0

**Called by:**
- `anonymous` (5)

**Calls:**
- `anonymous` (5)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (726us) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (2.3ms) | Samples: 0

**Called by:**
- `anonymous` (6)

**Calls:**
- `anonymous` (6)

### `asyncWrap`
`node:fs/promises:249` | Self: 0.0% (0us) | Total: 0.0% (314us) | Samples: 0

**Called by:**
- `node:fs/promises` (1)

**Calls:**
- `defineProperty` (1)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.1% (2.7ms) | Samples: 0

**Called by:**
- `anonymous` (6)

**Calls:**
- `anonymous` (6)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (2.3ms) | Samples: 0

**Called by:**
- `anonymous` (5)

**Calls:**
- `anonymous` (5)

### `internal:streams/operators`
`internal:streams/operators:2` | Self: 0.0% (0us) | Total: 0.0% (348us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.1% (3.4ms) | Samples: 0

**Called by:**
- `(anonymous)` (8)

**Calls:**
- `anonymous` (8)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (726us) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (1.1ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `internal:streams/end-of-stream`
`internal:streams/end-of-stream:17` | Self: 0.0% (0us) | Total: 0.0% (348us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.1% (3.4ms) | Samples: 0

**Called by:**
- `anonymous` (8)

**Calls:**
- `anonymous` (8)

### `from`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (840us) | Samples: 0

**Called by:**
- `(module)` (1)
- `from` (1)

**Calls:**
- `from` (1)
- `(anonymous)` (1)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `internal:fs/binding`
`internal:fs/binding:3` | Self: 0.0% (0us) | Total: 0.0% (431us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `@lazy` (1)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 92.8% | 2.33s | `/Users/jemanuel/projects/cmaes_explainer/[eval]` |
| 7.0% | 178.2ms | `[native code]` |
| 0.0% | 726us | `internal:primordials` |
| 0.0% | 385us | `internal:fs/streams` |
| 0.0% | 371us | `internal:streams/destroy` |
