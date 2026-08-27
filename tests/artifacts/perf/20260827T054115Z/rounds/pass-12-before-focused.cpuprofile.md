# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 2.50s | 7493 | 250us | 28 |

**Top 10:** `map` 86.3%, `kernel` 11.9%, `run` 1.3%, `anonymous` 0.1%, `(anonymous)` 0.0%, `reduce` 0.0%, `(module)` 0.0%, `internal:fs/glob` 0.0%, `forEach` 0.0%, `get WriteStream` 0.0%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 86.3% | 2.16s | 86.3% | 2.16s | `map` | `[native code]` |
| 11.9% | 299.0ms | 98.3% | 2.46s | `kernel` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 1.3% | 34.2ms | 99.7% | 2.49s | `run` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.1% | 4.7ms | 0.8% | 20.9ms | `anonymous` | `[native code]` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 929us | 0.0% | 929us | `reduce` | `[native code]` |
| 0.0% | 575us | 100.0% | 2.50s | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 347us | 0.0% | 347us | `internal:fs/glob` | `internal:fs/glob:657` |
| 0.0% | 332us | 0.0% | 332us | `forEach` | `[native code]` |
| 0.0% | 291us | 0.0% | 2.2ms | `get WriteStream` | `node:fs:667` |
| 0.0% | 268us | 0.0% | 268us | `WritableState` | `internal:streams/writable` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 100.0% | 2.50s | 0.0% | 575us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 99.7% | 2.49s | 1.3% | 34.2ms | `run` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 98.3% | 2.46s | 11.9% | 299.0ms | `kernel` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 86.3% | 2.16s | 86.3% | 2.16s | `map` | `[native code]` |
| 0.8% | 20.9ms | 0.1% | 4.7ms | `anonymous` | `[native code]` |
| 0.2% | 5.9ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.1% | 2.7ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.0% | 2.4ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 2.2ms | 0.0% | 291us | `get WriteStream` | `node:fs:667` |
| 0.0% | 1.6ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 1.6ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 1.6ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 1.3ms | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 958us | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 958us | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 929us | 0.0% | 929us | `reduce` | `[native code]` |
| 0.0% | 925us | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 638us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 638us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 347us | 0.0% | 347us | `internal:fs/glob` | `internal:fs/glob:657` |
| 0.0% | 332us | 0.0% | 0us | `bound call` | `[native code]` |
| 0.0% | 332us | 0.0% | 0us | `internal:primordials` | `internal:primordials:80` |
| 0.0% | 332us | 0.0% | 332us | `forEach` | `[native code]` |
| 0.0% | 332us | 0.0% | 0us | `makeSafe` | `internal:primordials:31` |
| 0.0% | 268us | 0.0% | 0us | `WriteStream` | `internal:fs/streams:259` |
| 0.0% | 268us | 0.0% | 268us | `WritableState` | `internal:streams/writable` |
| 0.0% | 268us | 0.0% | 0us | `Writable` | `internal:streams/writable:181` |

## Function Details

### `map`
`[native code]` | Self: 86.3% (2.16s) | Total: 86.3% (2.16s) | Samples: 6473

**Called by:**
- `kernel` (6477)

**Calls:**
- `(anonymous)` (4)

### `kernel`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 11.9% (299.0ms) | Total: 98.3% (2.46s) | Samples: 892

**Called by:**
- `run` (7369)

**Calls:**
- `map` (6477)

### `run`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 1.3% (34.2ms) | Total: 99.7% (2.49s) | Samples: 103

**Called by:**
- `(module)` (7472)

**Calls:**
- `kernel` (7369)

### `anonymous`
`[native code]` | Self: 0.1% (4.7ms) | Total: 0.8% (20.9ms) | Samples: 14

**Called by:**
- `(anonymous)` (10)
- `node:fs` (8)
- `node:fs/promises` (7)
- `get WriteStream` (6)
- `internal:fs/streams` (5)
- `internal:stream` (5)
- `node:stream` (5)
- `internal:streams/compose` (4)
- `node:events` (3)
- `internal:streams/pipeline` (3)
- `internal:streams/duplex` (3)
- `internal:validators` (2)
- `internal:shared` (2)

**Calls:**
- `node:fs` (8)
- `node:fs/promises` (7)
- `internal:fs/streams` (5)
- `internal:stream` (5)
- `node:stream` (5)
- `internal:streams/compose` (4)
- `node:events` (3)
- `internal:streams/pipeline` (3)
- `internal:streams/duplex` (3)
- `internal:validators` (2)
- `internal:shared` (2)
- `internal:primordials` (1)
- `internal:fs/glob` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 4

**Called by:**
- `map` (4)

### `reduce`
`[native code]` | Self: 0.0% (929us) | Total: 0.0% (929us) | Samples: 1

**Called by:**
- `(module)` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 0.0% (575us) | Total: 100.0% (2.50s) | Samples: 2

**Calls:**
- `run` (7472)
- `(anonymous)` (18)
- `reduce` (1)

### `internal:fs/glob`
`internal:fs/glob:657` | Self: 0.0% (347us) | Total: 0.0% (347us) | Samples: 1

**Called by:**
- `anonymous` (1)

### `forEach`
`[native code]` | Self: 0.0% (332us) | Total: 0.0% (332us) | Samples: 1

**Called by:**
- `bound call` (1)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (291us) | Total: 0.0% (2.2ms) | Samples: 1

**Called by:**
- `(anonymous)` (7)

**Calls:**
- `anonymous` (6)

### `WritableState`
`internal:streams/writable` | Self: 0.0% (268us) | Total: 0.0% (268us) | Samples: 1

**Called by:**
- `Writable` (1)

### `bound call`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (332us) | Samples: 0

**Called by:**
- `makeSafe` (1)

**Calls:**
- `forEach` (1)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (1.3ms) | Samples: 0

**Called by:**
- `anonymous` (4)

**Calls:**
- `anonymous` (4)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (2.4ms) | Samples: 0

**Called by:**
- `anonymous` (7)

**Calls:**
- `anonymous` (7)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (5)

**Calls:**
- `anonymous` (5)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.1% (2.7ms) | Samples: 0

**Called by:**
- `anonymous` (8)

**Calls:**
- `anonymous` (8)

### `WriteStream`
`internal:fs/streams:259` | Self: 0.0% (0us) | Total: 0.0% (268us) | Samples: 0

**Called by:**
- `(anonymous)` (1)

**Calls:**
- `Writable` (1)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (925us) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (638us) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.2% (5.9ms) | Samples: 0

**Called by:**
- `(module)` (18)

**Calls:**
- `anonymous` (10)
- `get WriteStream` (7)
- `WriteStream` (1)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (5)

**Calls:**
- `anonymous` (5)

### `Writable`
`internal:streams/writable:181` | Self: 0.0% (0us) | Total: 0.0% (268us) | Samples: 0

**Called by:**
- `WriteStream` (1)

**Calls:**
- `WritableState` (1)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (638us) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `internal:primordials`
`internal:primordials:80` | Self: 0.0% (0us) | Total: 0.0% (332us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `makeSafe` (1)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (5)

**Calls:**
- `anonymous` (5)

### `makeSafe`
`internal:primordials:31` | Self: 0.0% (0us) | Total: 0.0% (332us) | Samples: 0

**Called by:**
- `internal:primordials` (1)

**Calls:**
- `bound call` (1)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (958us) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (958us) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 86.5% | 2.16s | `[native code]` |
| 13.3% | 335.2ms | `/Users/jemanuel/projects/cmaes_explainer/[eval]` |
| 0.0% | 347us | `internal:fs/glob` |
| 0.0% | 291us | `node:fs` |
| 0.0% | 268us | `internal:streams/writable` |
