# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 1.89s | 4818 | 250us | 45 |

**Top 10:** `sampleGaussianVectorND` 98.4%, `run` 0.3%, `anonymous` 0.2%, `sampleGaussianVectorND` 0.1%, `sampleGaussianVectorND` 0.1%, `nextOpenUnit` 0.1%, `nextOpenUnit` 0.0%, `nextHalfOpenUnit` 0.0%, `sampleGaussianVectorND` 0.0%, `nextOpenUnit` 0.0%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 98.4% | 1.86s | 98.4% | 1.86s | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:303` |
| 0.3% | 7.2ms | 99.6% | 1.89s | `run` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.2% | 4.2ms | 1.0% | 19.2ms | `anonymous` | `[native code]` |
| 0.1% | 3.1ms | 0.1% | 3.1ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:304` |
| 0.1% | 2.7ms | 0.1% | 2.7ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:312` |
| 0.1% | 1.9ms | 0.1% | 1.9ms | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:282` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:290` |
| 0.0% | 1.2ms | 0.0% | 1.6ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:309` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:280` |
| 0.0% | 897us | 0.0% | 897us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:307` |
| 0.0% | 780us | 0.0% | 780us | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:288` |
| 0.0% | 704us | 0.0% | 704us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:310` |
| 0.0% | 459us | 0.0% | 459us | `forEach` | `[native code]` |
| 0.0% | 412us | 0.0% | 412us | `asyncWrap` | `node:fs/promises` |
| 0.0% | 408us | 0.1% | 2.6ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:306` |
| 0.0% | 407us | 0.0% | 407us | `getStreamOptions` | `internal:fs/streams` |
| 0.0% | 389us | 0.0% | 389us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 379us | 0.0% | 379us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 346us | 0.0% | 346us | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 100.0% | 1.89s | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 99.6% | 1.89s | 0.3% | 7.2ms | `run` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 98.4% | 1.86s | 98.4% | 1.86s | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:303` |
| 1.0% | 19.2ms | 0.2% | 4.2ms | `anonymous` | `[native code]` |
| 0.2% | 5.4ms | 0.0% | 0us | `(anonymous)` | `[native code]` |
| 0.2% | 5.0ms | 0.0% | 0us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:305` |
| 0.1% | 3.1ms | 0.1% | 3.1ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:304` |
| 0.1% | 2.7ms | 0.1% | 2.7ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:312` |
| 0.1% | 2.6ms | 0.0% | 408us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:306` |
| 0.1% | 2.4ms | 0.0% | 0us | `node:fs` | `node:fs:2` |
| 0.1% | 1.9ms | 0.0% | 0us | `get WriteStream` | `node:fs:667` |
| 0.1% | 1.9ms | 0.1% | 1.9ms | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:282` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 1.6ms | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:2` |
| 0.0% | 1.6ms | 0.0% | 1.2ms | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:309` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:290` |
| 0.0% | 1.4ms | 0.0% | 0us | `internal:fs/streams` | `internal:fs/streams:2` |
| 0.0% | 1.4ms | 0.0% | 0us | `node:stream` | `node:stream:2` |
| 0.0% | 1.4ms | 0.0% | 0us | `internal:stream` | `internal:stream:2` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `nextOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:280` |
| 0.0% | 1.0ms | 0.0% | 0us | `internal:streams/pipeline` | `internal:streams/pipeline:2` |
| 0.0% | 1.0ms | 0.0% | 0us | `internal:streams/compose` | `internal:streams/compose:2` |
| 0.0% | 906us | 0.0% | 0us | `node:events` | `node:events:10` |
| 0.0% | 897us | 0.0% | 897us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:307` |
| 0.0% | 780us | 0.0% | 780us | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:288` |
| 0.0% | 734us | 0.0% | 0us | `internal:streams/duplex` | `internal:streams/duplex:2` |
| 0.0% | 704us | 0.0% | 704us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:310` |
| 0.0% | 459us | 0.0% | 0us | `bound call` | `[native code]` |
| 0.0% | 459us | 0.0% | 0us | `internal:primordials` | `internal:primordials:73` |
| 0.0% | 459us | 0.0% | 0us | `internal:validators` | `internal:validators:2` |
| 0.0% | 459us | 0.0% | 459us | `forEach` | `[native code]` |
| 0.0% | 459us | 0.0% | 0us | `makeSafe` | `internal:primordials:31` |
| 0.0% | 459us | 0.0% | 0us | `internal:shared` | `internal:shared:2` |
| 0.0% | 412us | 0.0% | 0us | `node:fs/promises` | `node:fs/promises:137` |
| 0.0% | 412us | 0.0% | 412us | `asyncWrap` | `node:fs/promises` |
| 0.0% | 407us | 0.0% | 0us | `WriteStream` | `internal:fs/streams:201` |
| 0.0% | 407us | 0.0% | 407us | `getStreamOptions` | `internal:fs/streams` |
| 0.0% | 398us | 0.0% | 0us | `internal:streams/operators` | `internal:streams/operators:2` |
| 0.0% | 398us | 0.0% | 0us | `internal:streams/end-of-stream` | `internal:streams/end-of-stream:17` |
| 0.0% | 389us | 0.0% | 389us | `sampleGaussianVectorND` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 379us | 0.0% | 0us | `sort` | `[native code]` |
| 0.0% | 379us | 0.0% | 379us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]:1` |
| 0.0% | 346us | 0.0% | 346us | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.0% | 0us | 0.0% | 0us | `nextHalfOpenUnit` | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:289` |
| 0.0% | 0us | 0.0% | 0us | `(anonymous)` | `/Users/jemanuel/projects/cmaes_explainer/[eval]` |

## Function Details

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:303` | Self: 98.4% (1.86s) | Total: 98.4% (1.86s) | Samples: 4738

**Called by:**
- `run` (4738)

### `run`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 0.3% (7.2ms) | Total: 99.6% (1.89s) | Samples: 19

**Called by:**
- `(module)` (4803)

**Calls:**
- `sampleGaussianVectorND` (4738)
- `sampleGaussianVectorND` (13)
- `sampleGaussianVectorND` (9)
- `sampleGaussianVectorND` (8)
- `sampleGaussianVectorND` (7)
- `sampleGaussianVectorND` (4)
- `sampleGaussianVectorND` (2)
- `sampleGaussianVectorND` (2)
- `sampleGaussianVectorND` (1)

### `anonymous`
`[native code]` | Self: 0.2% (4.2ms) | Total: 1.0% (19.2ms) | Samples: 11

**Called by:**
- `(anonymous)` (8)
- `node:fs` (6)
- `get WriteStream` (5)
- `internal:fs/streams` (4)
- `internal:stream` (4)
- `node:fs/promises` (4)
- `node:stream` (4)
- `internal:streams/pipeline` (3)
- `internal:streams/compose` (3)
- `node:events` (2)
- `internal:streams/duplex` (2)
- `internal:validators` (1)
- `internal:streams/end-of-stream` (1)
- `internal:shared` (1)
- `internal:streams/operators` (1)

**Calls:**
- `node:fs` (6)
- `internal:fs/streams` (4)
- `internal:stream` (4)
- `node:fs/promises` (4)
- `node:stream` (4)
- `internal:streams/pipeline` (3)
- `internal:streams/compose` (3)
- `node:events` (2)
- `internal:streams/duplex` (2)
- `internal:validators` (1)
- `node:fs/promises` (1)
- `internal:streams/end-of-stream` (1)
- `internal:shared` (1)
- `internal:primordials` (1)
- `internal:streams/operators` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:304` | Self: 0.1% (3.1ms) | Total: 0.1% (3.1ms) | Samples: 9

**Called by:**
- `run` (9)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:312` | Self: 0.1% (2.7ms) | Total: 0.1% (2.7ms) | Samples: 7

**Called by:**
- `run` (7)

### `nextOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:282` | Self: 0.1% (1.9ms) | Total: 0.1% (1.9ms) | Samples: 5

**Called by:**
- `sampleGaussianVectorND` (5)

### `nextOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (1.8ms) | Total: 0.0% (1.8ms) | Samples: 5

**Called by:**
- `sampleGaussianVectorND` (5)

### `nextHalfOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:290` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 4

**Called by:**
- `sampleGaussianVectorND` (3)
- `sampleGaussianVectorND` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:309` | Self: 0.0% (1.2ms) | Total: 0.0% (1.6ms) | Samples: 3

**Called by:**
- `run` (4)

**Calls:**
- `nextHalfOpenUnit` (1)

### `nextOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:280` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 3

**Called by:**
- `sampleGaussianVectorND` (3)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:307` | Self: 0.0% (897us) | Total: 0.0% (897us) | Samples: 2

**Called by:**
- `run` (2)

### `nextHalfOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:288` | Self: 0.0% (780us) | Total: 0.0% (780us) | Samples: 2

**Called by:**
- `sampleGaussianVectorND` (2)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:310` | Self: 0.0% (704us) | Total: 0.0% (704us) | Samples: 2

**Called by:**
- `run` (2)

### `forEach`
`[native code]` | Self: 0.0% (459us) | Total: 0.0% (459us) | Samples: 1

**Called by:**
- `bound call` (1)

### `asyncWrap`
`node:fs/promises` | Self: 0.0% (412us) | Total: 0.0% (412us) | Samples: 1

**Called by:**
- `node:fs/promises` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:306` | Self: 0.0% (408us) | Total: 0.1% (2.6ms) | Samples: 1

**Called by:**
- `run` (8)

**Calls:**
- `nextHalfOpenUnit` (3)
- `nextHalfOpenUnit` (2)
- `nextHalfOpenUnit` (1)
- `nextHalfOpenUnit` (1)

### `getStreamOptions`
`internal:fs/streams` | Self: 0.0% (407us) | Total: 0.0% (407us) | Samples: 1

**Called by:**
- `WriteStream` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (389us) | Total: 0.0% (389us) | Samples: 1

**Called by:**
- `run` (1)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 0.0% (379us) | Total: 0.0% (379us) | Samples: 1

**Called by:**
- `sort` (1)

### `nextHalfOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` | Self: 0.0% (346us) | Total: 0.0% (346us) | Samples: 1

**Called by:**
- `sampleGaussianVectorND` (1)

### `internal:fs/streams`
`internal:fs/streams:2` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `anonymous` (4)

**Calls:**
- `anonymous` (4)

### `internal:streams/pipeline`
`internal:streams/pipeline:2` | Self: 0.0% (0us) | Total: 0.0% (1.0ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `internal:streams/compose`
`internal:streams/compose:2` | Self: 0.0% (0us) | Total: 0.0% (1.0ms) | Samples: 0

**Called by:**
- `anonymous` (3)

**Calls:**
- `anonymous` (3)

### `internal:validators`
`internal:validators:2` | Self: 0.0% (0us) | Total: 0.0% (459us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `(anonymous)`
`[native code]` | Self: 0.0% (0us) | Total: 0.2% (5.4ms) | Samples: 0

**Called by:**
- `(module)` (14)

**Calls:**
- `anonymous` (8)
- `get WriteStream` (5)
- `WriteStream` (1)

### `node:stream`
`node:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `anonymous` (4)

**Calls:**
- `anonymous` (4)

### `(anonymous)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]` | Self: 0.0% (0us) | Total: 0.0% (0us) | Samples: 1

**Called by:**
- `nextHalfOpenUnit` (1)

### `internal:streams/operators`
`internal:streams/operators:2` | Self: 0.0% (0us) | Total: 0.0% (398us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:stream`
`internal:stream:2` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `anonymous` (4)

**Calls:**
- `anonymous` (4)

### `sort`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (379us) | Samples: 0

**Called by:**
- `(module)` (1)

**Calls:**
- `(anonymous)` (1)

### `nextHalfOpenUnit`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:289` | Self: 0.0% (0us) | Total: 0.0% (0us) | Samples: 0

**Called by:**
- `sampleGaussianVectorND` (1)

**Calls:**
- `(anonymous)` (1)

### `node:fs/promises`
`node:fs/promises:2` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `anonymous` (4)

**Calls:**
- `anonymous` (4)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/[eval]:1` | Self: 0.0% (0us) | Total: 100.0% (1.89s) | Samples: 0

**Calls:**
- `run` (4803)
- `(anonymous)` (14)
- `sort` (1)

### `internal:shared`
`internal:shared:2` | Self: 0.0% (0us) | Total: 0.0% (459us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `internal:primordials`
`internal:primordials:73` | Self: 0.0% (0us) | Total: 0.0% (459us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `makeSafe` (1)

### `node:fs/promises`
`node:fs/promises:137` | Self: 0.0% (0us) | Total: 0.0% (412us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `asyncWrap` (1)

### `bound call`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (459us) | Samples: 0

**Called by:**
- `makeSafe` (1)

**Calls:**
- `forEach` (1)

### `makeSafe`
`internal:primordials:31` | Self: 0.0% (0us) | Total: 0.0% (459us) | Samples: 0

**Called by:**
- `internal:primordials` (1)

**Calls:**
- `bound call` (1)

### `internal:streams/end-of-stream`
`internal:streams/end-of-stream:17` | Self: 0.0% (0us) | Total: 0.0% (398us) | Samples: 0

**Called by:**
- `anonymous` (1)

**Calls:**
- `anonymous` (1)

### `sampleGaussianVectorND`
`/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts:305` | Self: 0.0% (0us) | Total: 0.2% (5.0ms) | Samples: 0

**Called by:**
- `run` (13)

**Calls:**
- `nextOpenUnit` (5)
- `nextOpenUnit` (5)
- `nextOpenUnit` (3)

### `internal:streams/duplex`
`internal:streams/duplex:2` | Self: 0.0% (0us) | Total: 0.0% (734us) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `WriteStream`
`internal:fs/streams:201` | Self: 0.0% (0us) | Total: 0.0% (407us) | Samples: 0

**Called by:**
- `(anonymous)` (1)

**Calls:**
- `getStreamOptions` (1)

### `get WriteStream`
`node:fs:667` | Self: 0.0% (0us) | Total: 0.1% (1.9ms) | Samples: 0

**Called by:**
- `(anonymous)` (5)

**Calls:**
- `anonymous` (5)

### `node:events`
`node:events:10` | Self: 0.0% (0us) | Total: 0.0% (906us) | Samples: 0

**Called by:**
- `anonymous` (2)

**Calls:**
- `anonymous` (2)

### `node:fs`
`node:fs:2` | Self: 0.0% (0us) | Total: 0.1% (2.4ms) | Samples: 0

**Called by:**
- `anonymous` (6)

**Calls:**
- `anonymous` (6)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 99.3% | 1.88s | `/Users/jemanuel/projects/cmaes_explainer/app/lib/cmaesEngineND.ts` |
| 0.4% | 7.6ms | `/Users/jemanuel/projects/cmaes_explainer/[eval]` |
| 0.2% | 4.6ms | `[native code]` |
| 0.0% | 412us | `node:fs/promises` |
| 0.0% | 407us | `internal:fs/streams` |
