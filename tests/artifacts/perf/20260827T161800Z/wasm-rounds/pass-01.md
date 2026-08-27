# Pass 1/20 — streaming JSON serialization

Status: accepted.

Opportunity: the named baseline attributed 39.1% total time to envelope
construction, including 30.2% in numeric-array serialization and 21.3% in
scalar formatting. Opportunity score: 10/10.

Change: write scalars and arrays directly into one pre-sized output `String`.
This removes a temporary `String` for every scalar, every array, every
generation object, and the intermediate generations array while retaining the
same formatter and field order.

Paired 80-run production A/B on the admitted-maximum workload:

| Metric | Before | After | Change |
|---|---:|---:|---:|
| p50 | 29.838 ms | 25.575 ms | -14.3% |
| p95 | 30.266 ms | 25.946 ms | -14.3% |
| mean | 29.932 ms | 25.612 ms | -14.4% |

UI-default p50/p95 improved from 6.624/6.776 ms to 5.737/5.872 ms.
An independent root rebuild measured 5.619/5.911 ms for UI-default and
25.129/25.495 ms for admitted-maximum.

Exact behavior proof:

- UI-default envelope stayed 589,097 bytes with SHA-256
  `85f75ee2a2df5d98c31e66b0cc032989abd59fd10ab346b88e0334e44150f688`.
- Admitted-maximum envelope stayed 3,356,756 bytes with SHA-256
  `b6ea32431e10f77c9d31db7eb1583ce8cc378a209f973560c86fcad14db33e1f`.
- All 17 native tests and all 17 browser-bundle differential tests passed.
- Rustfmt, strict local Clippy, release wasm-pack, diff checks, and UBS with
  zero critical findings passed.

The diagnostic serializer share fell from 39.1% to 33.2%; temporary
`format_inner` and reallocation hotspots disappeared.
