# Ranked hotspot ledger

| rank | hot path | evidence | expected lever |
| ---: | --- | --- | --- |
| 1 | G1 fixed-step rollout, especially free-floating articulated forward dynamics | 720 physical steps per candidate; 183.362 ms single p50; `g1_walking.rs::rollout` invokes kinematics, four point contacts per foot, policy evaluation, and `free_floating_forward_dynamics` each step | shard independent candidates across worker-owned WASM instances |
| 2 | Arm fixed-step rollout with inverse + forward articulated dynamics | 360 physical steps per candidate; 69.144 ms single p50; `manipulation.rs::rollout` invokes forward kinematics twice plus inverse and forward dynamics per step | shard independent candidates; avoid adding unbounded collision work |
| 3 | Sequential population loop at the WASM owner boundary | ×12 arm and ×16 G1 batches scale as serial rollouts and inherit multi-second tails | deterministic row partitioning, stable reassembly, sequential equivalence gate |
| 4 | G1 foot-contact construction and friction | up to eight normal/friction evaluations per 1/480 s step | retain fixed arrays; extend the existing pass with terrain normals instead of a second collision pass |
| 5 | Arm keep-out and grasp fidelity | current cost is small because collision is only link-origin/box proximity and grasp is a Boolean rigid latch | use bounded convex envelopes/broad rejection and compliant pad dynamics; measure the fidelity tax explicitly |

No rendering code appears in objective-only evaluation. Trace retention is a separate, user-requested path and is excluded from optimizer throughput claims.
