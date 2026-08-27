# Pass 11/20 — packed browser ABI

Status: accepted.

The midpoint cross-engine profile showed that the complete WASM path was not
faster than TypeScript: the JSON-boundary build was 3.70x slower on the UI
default and 3.93x slower at the admitted maximum. Formatting, transferring,
parsing, and adapting a 0.59–3.36 MB JSON envelope was the highest-confidence
remaining bottleneck.

The accepted candidate advances the audited browser kernel to 0.4.0 and
replaces the live JSON export with a versioned `Float64Array` packet. The
native JSON function remains as an exact conformance oracle. The TypeScript
decoder validates magic, schema, status, total length, dimensional shape,
fixed generation stride, generation/evaluation sequence, finite values,
positive ordered spectra, rank ordering, and elite-prefix invariants before
marking a packet trusted. Any malformed packet fails closed to the TypeScript
engine.

Alternating 100-trial measurements per arm:

- UI default old-WASM/packed-WASM/TS means: 7.525 / 5.171 / 1.916 ms.
  Packed WASM is 31.28% faster than the old WASM path, but remains 2.70x the
  TypeScript latency.
- Admitted maximum old-WASM/packed-WASM/TS means: 32.654 / 20.287 / 8.073 ms.
  Packed WASM is 37.87% faster than the old WASM path, but remains 2.51x the
  TypeScript latency.
- Boundary payload size fell from 589,097 to 247,056 bytes (-58.06%) on the UI
  default and from 3,356,756 to 1,203,584 bytes (-64.14%) at the maximum.

The old JSON and packed paths produced identical viewer states. Direct packet
comparison covered 30,874 UI-default and 150,440 maximum-workload numeric
values with zero bit differences, and repeated generation produced
word-identical packets. A root-independent release build reproduced SHA-256
`29bab2085fb37f7ed1415bd76dbae71d555175e322cb4a2dd7343c4976ad0386`
for the 105,022-byte WASM binary.

Root verification passed rustfmt, all 18 native tests, doc tests, strict
crate-local Clippy, wasm32 check, release wasm-pack build, all 17 focused Bun
tests (175 assertions), ESLint, and TypeScript checking. UBS's two “critical”
findings are false positives in wasm-bindgen-generated `__proto__: null`
object literals; the handwritten TypeScript scan has no critical finding.
