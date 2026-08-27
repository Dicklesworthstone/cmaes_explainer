# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 3.07s | 7792 | 250us | 31 |

**Top 10:** `kernel` 91.6%, `fill` 5.5%, `map` 2.2%, `run` 0.2%, `anonymous` 0.1%, `(anonymous)` 0.0%, `(anonymous)` 0.0%, `forEach` 0.0%, `(module)` 0.0%, `node:fs/promises` 0.0%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 91.6% | 2.81s | 99.5% | 3.05s | `kernel` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 5.5% | 171.0ms | 5.5% | 171.0ms | `fill` | `[native code]` |
| 2.2% | 69.1ms | 2.2% | 69.5ms | `map` | `[native code]` |
| 0.2% | 8.0ms | 99.7% | 3.06s | `run` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.1% | 4.2ms | 0.6% | 20.6ms | `anonymous` | `[native code]` |
| 0.0% | 804us | 0.0% | 804us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 704us | 0.0% | 704us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]` |
| 0.0% | 413us | 0.0% | 413us | `forEach` | `[native code]` |
| 0.0% | 410us | 100.0% | 3.06s | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 403us | 0.0% | 403us | `node:fs/promises` | `node:fs/promises:8` |
| 0.0% | 396us | 0.0% | 396us | `writer` | `[native code]` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 100.0% | 3.06s | 0.0% | 410us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 99.7% | 3.06s | 0.2% | 8.0ms | `run` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 99.5% | 3.05s | 91.6% | 2.81s | `kernel` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 5.5% | 171.0ms | 5.5% | 171.0ms | `fill` | `[native code]` |
| 2.2% | 69.5ms | 2.2% | 69.1ms | `map` | `[native code]` |
| 0.6% | 20.6ms | 0.1% | 4.2ms | `anonymous` | `[native code]` |
| 0.1% | 5.4ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.0% | 2.6ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 1.9ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.0% | 1.9ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 1.5ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 1.5ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 1.5ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 1.5ms | 0.0% | 0us | `from` | `[native code]` |
| 0.0% | 1.1ms | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 1.1ms | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 1.1ms | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 805us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 805us | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 804us | 0.0% | 804us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 704us | 0.0% | 704us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]` |
| 0.0% | 413us | 0.0% | 0us | `bound call` | `[native code]` |
| 0.0% | 413us | 0.0% | 413us | `forEach` | `[native code]` |
| 0.0% | 413us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 413us | 0.0% | 0us | `internal:primordials` | `internal:primordials:80` |
| 0.0% | 413us | 0.0% | 0us | `makeSafe` | `internal:primordials:31` |
| 0.0% | 409us | 0.0% | 0us | `internal:streams/operators` | `internal:streams/operators:2` |
| 0.0% | 409us | 0.0% | 0us | `internal:streams/end-of-stream` | `internal:streams/end-of-stream:17` |
| 0.0% | 403us | 0.0% | 403us | `node:fs/promises` | `node:fs/promises:8` |
| 0.0% | 396us | 0.0% | 396us | `writer` | `[native code]` |
| 0.0% | 396us | 0.0% | 0us | `WriteStream` | `internal:fs/streams:251` |

## Function Details

### `kernel`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 91.6% (2.81s) | Total: 99.5% (3.05s) | Samples: 7144

**Called by:**
- `run` (7754)

**Calls:**
- `fill` (435)
- `map` (175)

### `fill`
`[native code]` | Self: 5.5% (171.0ms) | Total: 5.5% (171.0ms) | Samples: 435

**Called by:**
- `kernel` (435)

### `map`
`[native code]` | Self: 2.2% (69.1ms) | Total: 2.2% (69.5ms) | Samples: 174

**Called by:**
- `kernel` (175)

**Calls:**
- `(anonymous)` (1)

### `run`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 0.2% (8.0ms) | Total: 99.7% (3.06s) | Samples: 21

**Called by:**
- `(module)` (7775)

**Calls:**
- `kernel` (7754)

### `anonymous`
`[native code]` | Self: 0.1% (4.2ms) | Total: 0.6% (20.6ms) | Samples: 11

**Called by:**
- `(anonymous)` (8)
- `node:fs` (7)
- `get WriteStream` (5)
- `node:fs/promises` (5)
- `internal:fs/streams` (4)
- `internal:stream` (4)
- `node:stream` (4)
- `internal:streams/pipeline` (3)
- `internal:streams/compose` (3)
- `internal:streams/duplex` (3)
- `node:events` (2)
- `internal:validators` (2)
- `internal:streams/end-of-stream` (1)
- `internal:shared` (1)
- `internal:streams/operators` (1)

**Calls:**
- `node:fs` (7)
- `node:fs/promises` (5)
- `internal:fs/streams` (4)
- `internal:stream` (4)
- `node:stream` (4)
- `internal:streams/pipeline` (3)
- `internal:streams/duplex` (3)
- `internal:streams/compose` (3)
- `node:events` (2)
- `internal:validators` (2)
- `internal:streams/end-of-stream` (1)
- `internal:shared` (1)
- `internal:primordials` (1)
- `internal:streams/operators` (1)
- `node:fs/promises` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 0.0% (804us) | Total: 0.0% (804us) | Samples: 2

**Called by:**
- `map` (1)
- `from` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]` | Self: 0.0% (704us) | Total: 0.0% (704us) | Samples: 1

**Called by:**
- `from` (1)

### `forEach`
`[native code]` | Self: 0.0% (413us) | Total: 0.0% (413us) | Samples: 1

**Called by:**
- `bound call` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 0.0% (410us) | Total: 100.0% (3.06s) | Samples: 1

**Calls:**
- `run` (7775)
- `(anonymous)` (14)
- `from` (2)

### `node:fs/promises`
`node:fs/promises:8` | Self: 0.0% (403us) | Total: 0.0% (403us) | Samples: 1

**Called by:**
- `anonymous` (1)

### `writer`
`[native code]` | Self: 0.0% (396us) | Total: 0.0% (396us) | Samples: 1

**Called by:**
- `WriteStream` (1)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.0% (2.6ms) | Samples: 0

**Called by:**
- `anonymous` (7)

**Calls:**
- `anonymous` (7)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (1.9ms) | Samples: 0

**Called by:**
- `anonymous` (5)

**Calls:**
- `anonymous` (5)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `anonymous` (4)

**Calls:**
- `anonymous` (4)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (1.1ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `internal:streams/operators`
`internal:streams/operators:2` | Self: 0.0% (0us) | Total: 0.0% (409us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `bound call`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (413us) | Samples: 0

**Called by:**
- `makeSafe` (1)

**Calls:**
- `forEach` (1)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (1.1ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (805us) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.1% (5.4ms) | Samples: 0

**Called by:**
- `(module)` (14)

**Calls:**
- `anonymous` (8)
- `get WriteStream` (5)
- `WriteStream` (1)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `anonymous` (4)

**Calls:**
- `anonymous` (4)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.0% (1.9ms) | Samples: 0

**Called by:**
- `(anonymous)` (5)

**Calls:**
- `anonymous` (5)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `anonymous` (4)

**Calls:**
- `anonymous` (4)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (805us) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (413us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:primordials`
`internal:primordials:80` | Self: 0.0% (0us) | Total: 0.0% (413us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `makeSafe` (1)

### `internal:streams/end-of-stream`
`internal:streams/end-of-stream:17` | Self: 0.0% (0us) | Total: 0.0% (409us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `from`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `(module)` (2)
- `from` (1)

**Calls:**
- `from` (1)
- `(anonymous)` (1)
- `(anonymous)` (1)

### `makeSafe`
`internal:primordials:31` | Self: 0.0% (0us) | Total: 0.0% (413us) | Samples: 0

**Called by:**
- `internal:primordials` (1)

**Calls:**
- `bound call` (1)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (1.1ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `WriteStream`
`internal:fs/streams:251` | Self: 0.0% (0us) | Total: 0.0% (396us) | Samples: 0

**Called by:**
- `(anonymous)` (1)

**Calls:**
- `writer` (1)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 91.9% | 2.82s | `/Users/jemanuel/projects/cmaes_explainer/[eval]` |
| 7.9% | 245.2ms | `[native code]` |
| 0.0% | 403us | `node:fs/promises` |
