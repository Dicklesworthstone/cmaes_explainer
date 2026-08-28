# Robotics v0.6.6 performance campaign

## Workloads

- `arm_single`: one 128-D kitchen-mug curriculum policy, 4 s at 90 Hz.
- `arm_population_12`: twelve deterministic 128-D perturbations evaluated in one WASM boundary call.
- `g1_single`: one 5,040-D walking curriculum policy, 1.5 s at 480 Hz.
- `g1_population_16`: sixteen deterministic 5,040-D perturbations evaluated in one WASM boundary call.

The matched before/after measurements instantiate the v0.6.5 and v0.6.6 release WASM under Bun. Each workload has two warmups followed by 25 timed samples. Population throughput counts physical candidate rollouts, not optimizer bookkeeping.

The separate browser-worker measurement uses the actual Turbopack classic-worker blob bootstrap in Headless Chrome 143 from an inert same-origin page. It has two warmups followed by 10 timed samples and compares four persistent lanes against the sequential owner on every sample.

## Metrics and gates

- Report min, mean, p50, p95, p99, max, and p50 candidate throughput.
- Preserve owner receipt/trace SHA-256 goldens before modifying physics.
- A parallel evaluator is admissible only if its output is bit-identical to the sequential owner for the same flat population and candidate order.
- Any unsupported or failed parallel path must fall back to the existing sequential evaluation.
- Physics improvements may intentionally change receipt goldens, but must retain deterministic replay and pass owner curriculum/perturbation tests.

## Claim boundary

This campaign targets owner-composed CPU/WASM physics and worker-parallel population evaluation. It does not claim WebGPU execution, triangle-mesh contact, or hardware transfer unless those paths are independently implemented and measured.
