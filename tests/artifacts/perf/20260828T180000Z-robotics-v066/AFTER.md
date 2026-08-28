# Robotics v0.6.6 performance result

## Matched sequential WASM result

The v0.6.6 owner kernel was measured under the same Bun 1.4.0 process, workload controls, two warmups, and 25 timed samples as the v0.6.5 baseline. The arm comparison holds its duration at the baseline's 4 seconds and the G1 comparison uses the same flat challenge. Candidate throughput counts physical rollouts.

| Workload | v0.6.5 p50 | v0.6.6 p50 | Speedup | Latency reduction |
| --- | ---: | ---: | ---: | ---: |
| Arm single, 128-D | 69.144 ms | 37.089 ms | 1.86× | 46.4% |
| Arm population, 12 × 128-D | 1,367.805 ms | 481.594 ms | 2.84× | 64.8% |
| G1 single, 5,040-D | 183.362 ms | 58.566 ms | 3.13× | 68.1% |
| G1 population, 16 × 5,040-D | 2,740.526 ms | 811.945 ms | 3.38× | 70.4% |

These gains include the new v0.6.6 implementation rather than removing work: arm rollouts now include owner-routed broad/narrow collision queries and compliant object contact, while the flagship G1 challenge adds terrain and push disturbances. The matched G1 benchmark deliberately remains on the flat challenge so it measures the same physical task as v0.6.5.

## Persistent browser-worker result

The actual Turbopack worker bootstrap was measured in Headless Chrome 143 from an inert same-origin page so Three.js rendering did not contend with the rollout threads. Each workload used two warmups and 10 timed samples. Four persistent lanes evaluated stable contiguous shards, restored candidate order, and compared every returned objective with the sequential owner using `Object.is`.

| Workload | Sequential p50 | Four-worker p50 | Speedup | Latency reduction | Parity |
| --- | ---: | ---: | ---: | ---: | --- |
| Arm population, 12 × 128-D | 475.925 ms | 253.745 ms | 1.88× | 46.7% | bit-exact |
| G1 population, 16 × 5,040-D | 529.945 ms | 288.325 ms | 1.84× | 45.6% | bit-exact |

The worker result is an additional browser wall-time gain on population evaluation; it must not be multiplied mechanically by the Bun baseline ratios because the runtimes, sample counts, and scheduling environments differ. Unsupported hardware, one-lane browsers, initialization failures, and parity failures retain the sequential owner fallback.

Raw measurements are in `after-sequential.json` and `after-browser-parallel.json`.
