# Pass 12/20 — projected tuple reuse

Status: rejected; no production source change retained.

The refreshed complete-path baseline measured 4.759 ms mean for WASM versus
2.122 ms for TypeScript on the UI workload, and 18.263 versus 9.203 ms at the
admitted maximum. The viewer adapter accounted for 0.666 ms (14.0%) and
2.911 ms (15.9%), respectively. A CPU profile ranked `copyNumericSlice` first
at 428 samples and `projectPoint` second at 71 samples.

Opportunity score: 15. The tested lever reused `projectPoint`'s output tuple as
the sample's `projected3D` tuple, avoiding an estimated 1,920 allocations on
the UI workload and 9,600 at the maximum. Exact viewer-state hashes were
unchanged:

- UI: `2acc7676db7d21454747ec01a87f75346a99a9499af8275a40f4e82bb191bca7`
- Maximum: `6a3ceb9c7d270debf53f6f9dba02801b8e985b9557feafa983c7855919809254`

In 160 alternating trials per arm, the complete path changed by -1.13% on the
UI workload and -0.77% at the maximum. The isolated adapter was inconsistent:
UI mean regressed 3.90% (p50 +0.94%), while maximum mean improved 2.50%
(p50 -0.71%). Those mixed results are inside the 10% observed noise envelope,
so the candidate was rejected and manually restored. Both edited files match
commit `39ebaaf` exactly. All 17 focused tests (175 assertions), ESLint,
TypeScript checking, and the UBS critical scan passed.
