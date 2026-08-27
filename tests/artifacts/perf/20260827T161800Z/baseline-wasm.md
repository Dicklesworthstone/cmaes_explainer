# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 3.64s | 2414 | 1.0ms | 39 |

**Top 10:** `.wasm-function[10]` 41.2%, `.wasm-function[86]` 20.8%, `.wasm-function[30]` 7.8%, `.wasm-function[85]` 3.9%, `.wasm-function[2]` 3.7%, `.wasm-function[21]` 3.3%, `(unknown)` 3.3%, `.wasm-function[8]` 3.1%, `.wasm-function[15]` 2.7%, `.wasm-function[33]` 2.6%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 41.2% | 1.50s | 41.2% | 1.50s | `.wasm-function[10]` | `[native code]` |
| 20.8% | 762.0ms | 35.9% | 1.31s | `.wasm-function[86]` | `[native code]` |
| 7.8% | 284.6ms | 14.1% | 515.4ms | `.wasm-function[30]` | `[native code]` |
| 3.9% | 142.6ms | 95.3% | 3.47s | `.wasm-function[85]` | `[native code]` |
| 3.7% | 135.9ms | 3.7% | 135.9ms | `.wasm-function[2]` | `[native code]` |
| 3.3% | 121.6ms | 3.3% | 123.2ms | `.wasm-function[21]` | `[native code]` |
| 3.3% | 121.6ms | 98.7% | 3.60s | `(unknown)` | `[native code]` |
| 3.1% | 114.0ms | 3.1% | 114.0ms | `.wasm-function[8]` | `[native code]` |
| 2.7% | 99.4ms | 6.2% | 226.2ms | `.wasm-function[15]` | `[native code]` |
| 2.6% | 96.5ms | 42.3% | 1.54s | `.wasm-function[33]` | `[native code]` |
| 2.0% | 74.2ms | 38.2% | 1.39s | `.wasm-function[29]` | `[native code]` |
| 1.2% | 44.9ms | 1.2% | 44.9ms | `decode` | `[native code]` |
| 0.9% | 34.1ms | 8.4% | 309.6ms | `.wasm-function[5]` | `[native code]` |
| 0.7% | 26.5ms | 14.8% | 541.9ms | `.wasm-function[27]` | `[native code]` |
| 0.6% | 25.0ms | 11.9% | 434.1ms | `.wasm-function[37]` | `[native code]` |
| 0.2% | 9.3ms | 0.3% | 11.0ms | `.wasm-function[35]` | `[native code]` |
| 0.2% | 7.8ms | 0.2% | 10.7ms | `.wasm-function[6]` | `[native code]` |
| 0.1% | 7.0ms | 0.2% | 10.3ms | `.wasm-function[23]` | `[native code]` |
| 0.1% | 4.8ms | 0.1% | 4.8ms | `.wasm-function[26]` | `[native code]` |
| 0.1% | 4.7ms | 0.1% | 6.4ms | `.wasm-function[13]` | `[native code]` |
| 0.0% | 3.3ms | 0.0% | 3.3ms | `.wasm-function[41]` | `[native code]` |
| 0.0% | 3.3ms | 0.5% | 18.5ms | `.wasm-function[71]` | `[native code]` |
| 0.0% | 3.2ms | 0.5% | 19.0ms | `.wasm-function[38]` | `[native code]` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `.wasm-function[40]` | `[native code]` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `.wasm-function[65]` | `[native code]` |
| 0.0% | 2.7ms | 0.2% | 9.9ms | `.wasm-function[58]` | `[native code]` |
| 0.0% | 1.5ms | 0.1% | 5.5ms | `.wasm-function[104]` | `[native code]` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `.wasm-function[31]` | `[native code]` |
| 0.0% | 1.4ms | 0.0% | 2.9ms | `.wasm-function[3]` | `[native code]` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `.wasm-function[9]` | `[native code]` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `getUint8ArrayMemory0` | `/Users/jemanuel/projects/cmaes_explainer/public/wasm/fs-cmaes/fs_cmaes_viz_wasm.js:84` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 100.0% | 3.64s | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[stdin]:5` |
| 98.7% | 3.60s | 3.3% | 121.6ms | `(unknown)` | `[native code]` |
| 98.7% | 3.60s | 0.0% | 0us | `cmaes_viz_run` | `/Users/jemanuel/projects/cmaes_explainer/public/wasm/fs-cmaes/fs_cmaes_viz_wasm.js:48` |
| 95.3% | 3.47s | 3.9% | 142.6ms | `.wasm-function[85]` | `[native code]` |
| 42.3% | 1.54s | 2.6% | 96.5ms | `.wasm-function[33]` | `[native code]` |
| 41.2% | 1.50s | 41.2% | 1.50s | `.wasm-function[10]` | `[native code]` |
| 38.2% | 1.39s | 2.0% | 74.2ms | `.wasm-function[29]` | `[native code]` |
| 35.9% | 1.31s | 20.8% | 762.0ms | `.wasm-function[86]` | `[native code]` |
| 14.8% | 541.9ms | 0.7% | 26.5ms | `.wasm-function[27]` | `[native code]` |
| 14.1% | 515.4ms | 7.8% | 284.6ms | `.wasm-function[30]` | `[native code]` |
| 11.9% | 434.1ms | 0.6% | 25.0ms | `.wasm-function[37]` | `[native code]` |
| 8.4% | 309.6ms | 0.9% | 34.1ms | `.wasm-function[5]` | `[native code]` |
| 6.2% | 226.2ms | 2.7% | 99.4ms | `.wasm-function[15]` | `[native code]` |
| 3.7% | 135.9ms | 3.7% | 135.9ms | `.wasm-function[2]` | `[native code]` |
| 3.3% | 123.2ms | 3.3% | 121.6ms | `.wasm-function[21]` | `[native code]` |
| 3.1% | 114.0ms | 3.1% | 114.0ms | `.wasm-function[8]` | `[native code]` |
| 1.4% | 51.7ms | 0.0% | 0us | `.wasm-function[51]` | `[native code]` |
| 1.2% | 46.1ms | 0.0% | 0us | `cmaes_viz_run` | `/Users/jemanuel/projects/cmaes_explainer/public/wasm/fs-cmaes/fs_cmaes_viz_wasm.js:51` |
| 1.2% | 44.9ms | 1.2% | 44.9ms | `decode` | `[native code]` |
| 0.5% | 19.0ms | 0.0% | 3.2ms | `.wasm-function[38]` | `[native code]` |
| 0.5% | 18.5ms | 0.0% | 3.3ms | `.wasm-function[71]` | `[native code]` |
| 0.4% | 15.6ms | 0.0% | 0us | `.wasm-function[61]` | `[native code]` |
| 0.3% | 11.2ms | 0.0% | 0us | `.wasm-function[45]` | `[native code]` |
| 0.3% | 11.0ms | 0.2% | 9.3ms | `.wasm-function[35]` | `[native code]` |
| 0.2% | 10.7ms | 0.2% | 7.8ms | `.wasm-function[6]` | `[native code]` |
| 0.2% | 10.3ms | 0.1% | 7.0ms | `.wasm-function[23]` | `[native code]` |
| 0.2% | 9.9ms | 0.0% | 2.7ms | `.wasm-function[58]` | `[native code]` |
| 0.1% | 6.4ms | 0.1% | 4.7ms | `.wasm-function[13]` | `[native code]` |
| 0.1% | 5.5ms | 0.0% | 1.5ms | `.wasm-function[104]` | `[native code]` |
| 0.1% | 4.8ms | 0.1% | 4.8ms | `.wasm-function[26]` | `[native code]` |
| 0.0% | 3.3ms | 0.0% | 3.3ms | `.wasm-function[41]` | `[native code]` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `.wasm-function[40]` | `[native code]` |
| 0.0% | 2.9ms | 0.0% | 1.4ms | `.wasm-function[3]` | `[native code]` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `.wasm-function[65]` | `[native code]` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `.wasm-function[31]` | `[native code]` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `.wasm-function[9]` | `[native code]` |
| 0.0% | 1.2ms | 0.0% | 0us | `decodeText` | `/Users/jemanuel/projects/cmaes_explainer/public/wasm/fs-cmaes/fs_cmaes_viz_wasm.js:101` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `getUint8ArrayMemory0` | `/Users/jemanuel/projects/cmaes_explainer/public/wasm/fs-cmaes/fs_cmaes_viz_wasm.js:84` |
| 0.0% | 1.2ms | 0.0% | 0us | `.wasm-function[64]` | `[native code]` |

## Function Details

### `.wasm-function[10]`
`[native code]` | Self: 41.2% (1.50s) | Total: 41.2% (1.50s) | Samples: 996

**Called by:**
- `.wasm-function[85]` (539)
- `.wasm-function[37]` (272)
- `.wasm-function[5]` (185)

### `.wasm-function[86]`
`[native code]` | Self: 20.8% (762.0ms) | Total: 35.9% (1.31s) | Samples: 501

**Called by:**
- `.wasm-function[29]` (862)

**Calls:**
- `.wasm-function[27]` (357)
- `.wasm-function[26]` (3)
- `.wasm-function[9]` (1)

### `.wasm-function[30]`
`[native code]` | Self: 7.8% (284.6ms) | Total: 14.1% (515.4ms) | Samples: 186

**Called by:**
- `.wasm-function[27]` (340)

**Calls:**
- `.wasm-function[15]` (132)
- `.wasm-function[2]` (22)

### `.wasm-function[85]`
`[native code]` | Self: 3.9% (142.6ms) | Total: 95.3% (3.47s) | Samples: 97

**Called by:**
- `(unknown)` (2303)

**Calls:**
- `.wasm-function[33]` (1017)
- `.wasm-function[10]` (539)
- `.wasm-function[37]` (289)
- `.wasm-function[5]` (209)
- `.wasm-function[8]` (75)
- `.wasm-function[2]` (13)
- `.wasm-function[38]` (12)
- `.wasm-function[21]` (9)
- `.wasm-function[6]` (8)
- `.wasm-function[45]` (8)
- `.wasm-function[51]` (7)
- `.wasm-function[35]` (7)
- `.wasm-function[13]` (4)
- `.wasm-function[71]` (3)
- `.wasm-function[104]` (2)
- `.wasm-function[65]` (2)
- `.wasm-function[58]` (1)
- `.wasm-function[40]` (1)

### `.wasm-function[2]`
`[native code]` | Self: 3.7% (135.9ms) | Total: 3.7% (135.9ms) | Samples: 93

**Called by:**
- `.wasm-function[15]` (51)
- `.wasm-function[30]` (22)
- `.wasm-function[85]` (13)
- `.wasm-function[104]` (3)
- `.wasm-function[33]` (1)
- `.wasm-function[35]` (1)
- `.wasm-function[13]` (1)
- `.wasm-function[5]` (1)

### `.wasm-function[21]`
`[native code]` | Self: 3.3% (121.6ms) | Total: 3.3% (123.2ms) | Samples: 84

**Called by:**
- `.wasm-function[15]` (35)
- `.wasm-function[33]` (30)
- `.wasm-function[71]` (11)
- `.wasm-function[85]` (9)

**Calls:**
- `.wasm-function[41]` (1)

### `(unknown)`
`[native code]` | Self: 3.3% (121.6ms) | Total: 98.7% (3.60s) | Samples: 81

**Called by:**
- `cmaes_viz_run` (2384)

**Calls:**
- `.wasm-function[85]` (2303)

### `.wasm-function[8]`
`[native code]` | Self: 3.1% (114.0ms) | Total: 3.1% (114.0ms) | Samples: 75

**Called by:**
- `.wasm-function[85]` (75)

### `.wasm-function[15]`
`[native code]` | Self: 2.7% (99.4ms) | Total: 6.2% (226.2ms) | Samples: 63

**Called by:**
- `.wasm-function[30]` (132)
- `.wasm-function[61]` (10)
- `.wasm-function[58]` (5)
- `.wasm-function[23]` (2)
- `.wasm-function[64]` (1)

**Calls:**
- `.wasm-function[2]` (51)
- `.wasm-function[21]` (35)
- `.wasm-function[41]` (1)

### `.wasm-function[33]`
`[native code]` | Self: 2.6% (96.5ms) | Total: 42.3% (1.54s) | Samples: 64

**Called by:**
- `.wasm-function[85]` (1017)

**Calls:**
- `.wasm-function[29]` (877)
- `.wasm-function[21]` (30)
- `.wasm-function[51]` (27)
- `.wasm-function[61]` (10)
- `.wasm-function[58]` (6)
- `.wasm-function[71]` (2)
- `.wasm-function[2]` (1)

### `.wasm-function[29]`
`[native code]` | Self: 2.0% (74.2ms) | Total: 38.2% (1.39s) | Samples: 49

**Called by:**
- `.wasm-function[33]` (877)
- `.wasm-function[51]` (33)
- `.wasm-function[38]` (9)

**Calls:**
- `.wasm-function[86]` (862)
- `.wasm-function[23]` (7)
- `.wasm-function[64]` (1)

### `decode`
`[native code]` | Self: 1.2% (44.9ms) | Total: 1.2% (44.9ms) | Samples: 29

**Called by:**
- `cmaes_viz_run` (29)

### `.wasm-function[5]`
`[native code]` | Self: 0.9% (34.1ms) | Total: 8.4% (309.6ms) | Samples: 23

**Called by:**
- `.wasm-function[85]` (209)

**Calls:**
- `.wasm-function[10]` (185)
- `.wasm-function[2]` (1)

### `.wasm-function[27]`
`[native code]` | Self: 0.7% (26.5ms) | Total: 14.8% (541.9ms) | Samples: 17

**Called by:**
- `.wasm-function[86]` (357)

**Calls:**
- `.wasm-function[30]` (340)

### `.wasm-function[37]`
`[native code]` | Self: 0.6% (25.0ms) | Total: 11.9% (434.1ms) | Samples: 17

**Called by:**
- `.wasm-function[85]` (289)

**Calls:**
- `.wasm-function[10]` (272)

### `.wasm-function[35]`
`[native code]` | Self: 0.2% (9.3ms) | Total: 0.3% (11.0ms) | Samples: 6

**Called by:**
- `.wasm-function[85]` (7)

**Calls:**
- `.wasm-function[2]` (1)

### `.wasm-function[6]`
`[native code]` | Self: 0.2% (7.8ms) | Total: 0.2% (10.7ms) | Samples: 6

**Called by:**
- `.wasm-function[85]` (8)

**Calls:**
- `.wasm-function[3]` (2)

### `.wasm-function[23]`
`[native code]` | Self: 0.1% (7.0ms) | Total: 0.2% (10.3ms) | Samples: 5

**Called by:**
- `.wasm-function[29]` (7)

**Calls:**
- `.wasm-function[15]` (2)

### `.wasm-function[26]`
`[native code]` | Self: 0.1% (4.8ms) | Total: 0.1% (4.8ms) | Samples: 3

**Called by:**
- `.wasm-function[86]` (3)

### `.wasm-function[13]`
`[native code]` | Self: 0.1% (4.7ms) | Total: 0.1% (6.4ms) | Samples: 3

**Called by:**
- `.wasm-function[85]` (4)

**Calls:**
- `.wasm-function[2]` (1)

### `.wasm-function[41]`
`[native code]` | Self: 0.0% (3.3ms) | Total: 0.0% (3.3ms) | Samples: 2

**Called by:**
- `.wasm-function[15]` (1)
- `.wasm-function[21]` (1)

### `.wasm-function[71]`
`[native code]` | Self: 0.0% (3.3ms) | Total: 0.5% (18.5ms) | Samples: 2

**Called by:**
- `.wasm-function[45]` (8)
- `.wasm-function[85]` (3)
- `.wasm-function[33]` (2)

**Calls:**
- `.wasm-function[21]` (11)

### `.wasm-function[38]`
`[native code]` | Self: 0.0% (3.2ms) | Total: 0.5% (19.0ms) | Samples: 2

**Called by:**
- `.wasm-function[85]` (12)
- `.wasm-function[51]` (1)

**Calls:**
- `.wasm-function[29]` (9)
- `.wasm-function[104]` (2)

### `.wasm-function[40]`
`[native code]` | Self: 0.0% (3.1ms) | Total: 0.0% (3.1ms) | Samples: 1

**Called by:**
- `.wasm-function[85]` (1)

### `.wasm-function[65]`
`[native code]` | Self: 0.0% (2.8ms) | Total: 0.0% (2.8ms) | Samples: 2

**Called by:**
- `.wasm-function[85]` (2)

### `.wasm-function[58]`
`[native code]` | Self: 0.0% (2.7ms) | Total: 0.2% (9.9ms) | Samples: 2

**Called by:**
- `.wasm-function[33]` (6)
- `.wasm-function[85]` (1)

**Calls:**
- `.wasm-function[15]` (5)

### `.wasm-function[104]`
`[native code]` | Self: 0.0% (1.5ms) | Total: 0.1% (5.5ms) | Samples: 1

**Called by:**
- `.wasm-function[85]` (2)
- `.wasm-function[38]` (2)

**Calls:**
- `.wasm-function[2]` (3)

### `.wasm-function[31]`
`[native code]` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 1

**Called by:**
- `.wasm-function[3]` (1)

### `.wasm-function[3]`
`[native code]` | Self: 0.0% (1.4ms) | Total: 0.0% (2.9ms) | Samples: 1

**Called by:**
- `.wasm-function[6]` (2)

**Calls:**
- `.wasm-function[31]` (1)

### `.wasm-function[9]`
`[native code]` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 1

**Called by:**
- `.wasm-function[86]` (1)

### `getUint8ArrayMemory0`
`/Users/jemanuel/projects/cmaes_explainer/public/wasm/fs-cmaes/fs_cmaes_viz_wasm.js:84` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 1

**Called by:**
- `decodeText` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/[stdin]:5` | Self: 0.0% (0us) | Total: 100.0% (3.64s) | Samples: 0

**Calls:**
- `cmaes_viz_run` (2384)
- `cmaes_viz_run` (30)

### `.wasm-function[64]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.2ms) | Samples: 0

**Called by:**
- `.wasm-function[29]` (1)

**Calls:**
- `.wasm-function[15]` (1)

### `.wasm-function[51]`
`[native code]` | Self: 0.0% (0us) | Total: 1.4% (51.7ms) | Samples: 0

**Called by:**
- `.wasm-function[33]` (27)
- `.wasm-function[85]` (7)

**Calls:**
- `.wasm-function[29]` (33)
- `.wasm-function[38]` (1)

### `.wasm-function[45]`
`[native code]` | Self: 0.0% (0us) | Total: 0.3% (11.2ms) | Samples: 0

**Called by:**
- `.wasm-function[85]` (8)

**Calls:**
- `.wasm-function[71]` (8)

### `cmaes_viz_run`
`/Users/jemanuel/projects/cmaes_explainer/public/wasm/fs-cmaes/fs_cmaes_viz_wasm.js:51` | Self: 0.0% (0us) | Total: 1.2% (46.1ms) | Samples: 0

**Called by:**
- `(module)` (30)

**Calls:**
- `decode` (29)
- `decodeText` (1)

### `.wasm-function[61]`
`[native code]` | Self: 0.0% (0us) | Total: 0.4% (15.6ms) | Samples: 0

**Called by:**
- `.wasm-function[33]` (10)

**Calls:**
- `.wasm-function[15]` (10)

### `decodeText`
`/Users/jemanuel/projects/cmaes_explainer/public/wasm/fs-cmaes/fs_cmaes_viz_wasm.js:101` | Self: 0.0% (0us) | Total: 0.0% (1.2ms) | Samples: 0

**Called by:**
- `cmaes_viz_run` (1)

**Calls:**
- `getUint8ArrayMemory0` (1)

### `cmaes_viz_run`
`/Users/jemanuel/projects/cmaes_explainer/public/wasm/fs-cmaes/fs_cmaes_viz_wasm.js:48` | Self: 0.0% (0us) | Total: 98.7% (3.60s) | Samples: 0

**Called by:**
- `(module)` (2384)

**Calls:**
- `(unknown)` (2384)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 99.9% | 3.64s | `[native code]` |
| 0.0% | 1.2ms | `/Users/jemanuel/projects/cmaes_explainer/public/wasm/fs-cmaes/fs_cmaes_viz_wasm.js` |
