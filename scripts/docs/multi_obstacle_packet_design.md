# Multi-Obstacle Packet Envelope — Design Spec (cmaes-u53)

Status: **DRAFT, awaiting kernel landing in `frankensim` sibling crate.**
Owner: RubyThrush (this repo); kernel: frankensim maintainer.
Closes: bead cmaes-u53 (the TS-side consumer; the kernel-side change is the
sibling-crate piece tracked by cmaes-u53 in `frankensim`).
Unblocks: cmaes-1yu (G1 house-navigation challenge), and the honest
multi-obstacle arm scene in cmaes-42t.

## Why this spec exists

Today, `app/lib/frankensimCmaes.ts` decodes the **arm schema-2** packet
holding exactly one obstacle (center + half extents at slots 31-36) and the
**G1 schema-7** packet which has no obstacle slot at all. The house scene
config (`app/lib/houseScenes.ts`) describes 8 rooms, 8 walls, 10 furniture
pieces, and 4 goals — but the kernel only sees one obstacle at a time. The
G1 floorplan is rendered as display-only (bead cmaes-um2).

The multi-obstacle change moves both robots to a packet that carries up to
**N oriented box obstacles** (furniture) and up to **M goals** (waypoints),
each with conservative OBB collision equivalent to the existing single
counter box. This file pins the **wire format** so the TS-side decoder,
the kernel-side packet writer, and the worker adapter can all change in
lockstep without leaking an unstable shape to the browser.

## Schema bump

| Surface | Old schema | New schema | Rationale |
|---|---|---|---|
| Arm (CMA schema + arm schema) | `ARM_SCHEMA = 2` | `ARM_SCHEMA = 3` | New layout: header grows by 1 word (N count), body becomes variable-length with an explicit N ceiling. |
| G1 (CMA schema + G1 schema) | `G1_SCHEMA = 7` | `G1_SCHEMA = 8` | New: obstacle list + goal list at end of admission packet. Same wire layout as arm, by convention. |
| CMA family | `OWNER_CMA_SCHEMA = 2` | unchanged | The family ask/tell envelope does not change. |

The kernel bumps the magic-prefixed schema field. The TS decoder must
**refuse** the old schema for any decode path that would now expose
multi-obstacle — failure is "malformed packet: schema" exactly as today.

## Wire format (admission packet)

All numbers are Float64 little-endian. Word counts below are Floats, not
bytes.

### Common header (12 words)

| Word | Field | Notes |
|---:|---|---|
| 0 | magic | `ARM_MAGIC = 0x41524d31` for arm, `G1_MAGIC = 0x47315737` for G1. |
| 1 | schema | 3 for arm, 8 for G1. |
| 2 | kind | 1 = admission. |
| 3..11 | robot-specific constants | Same as today (policy dim, joint count, link count, pose words, etc.). |

### Robot constants block (same as today)

Arm: 37 words total today. G1: similar. The exact layout of the
robot-constants block is **unchanged** in schema-3/8.

### Obstacle list (new, after robot constants)

| Word | Field | Notes |
|---:|---|---|
| +0 | `N` | u64 (Float64, finite, integer-valued) count of obstacles. `0 ≤ N ≤ MAX_OBSTACLES`. |
| +1 .. +7N | per-obstacle | 7 Floats each: `center[3]`, `halfExtents[3]`, `yaw` (owner-frame radians, currently 0; reserved for oriented furniture). |
| +1 + 7N | `M` | count of goals. `0 ≤ M ≤ MAX_GOALS`. |
| +2 + 7N .. +(1 + 7N + 3M) | per-goal | 3 Floats each: `center[3]`. No radius on the wire (radius is a TS-side rendering concern; the kernel only needs the point). |

### Validation rules (TS-side, in `decodeHouseholdManipulationAdmission`)

```
N <= MAX_OBSTACLES (16, hard ceiling — keeps packet bounded)
M <= MAX_GOALS (8)
N + M >= 1 (admission must have at least one scene anchor)
for each obstacle:
  - halfExtents[i] > 0
  - center is finite
  - yaw is finite (NaN refused)
for each goal:
  - center is finite
```

If validation fails, return `{ refusal: { name: "malformed-packet" } }`
exactly as today. **No silent fallback to single-obstacle mode.**

## Constants

```ts
const MAX_OBSTACLES = 16;
const MAX_GOALS = 8;
```

These are conservative upper bounds chosen to keep the admission packet
under 1 KiB even with all slots filled (16 * 7 + 8 * 3 + 2 = 138 words,
~1.1 KB). The kernel can refuse earlier if its internal scene table
fills.

## TS-side types

```ts
export interface ObstacleBox {
  centerMeters: [number, number, number];
  halfExtentsMeters: [number, number, number];
  yawRadians: number;
}

export interface GoalPoint {
  centerMeters: [number, number, number];
}

export interface HouseholdManipulationSceneMultiObstacle {
  obstacles: ObstacleBox[];   // length 0..MAX_OBSTACLES
  goals: GoalPoint[];          // length 0..MAX_GOALS
  // legacy single-obstacle accessor for the kitchen-mug / living-room-remote
  // tasks that have exactly one obstacle + one goal: convenience readers.
  primaryObstacle(): ObstacleBox | null;
  primaryGoal(): GoalPoint | null;
}
```

`HouseholdManipulationScene` (the existing single-obstacle shape) is
**preserved** as a TypeScript type for legacy kernels (schema-2). The
`decodeHouseholdManipulationAdmission` function returns the legacy shape
when the schema is 2 and the new `HouseholdManipulationSceneMultiObstacle`
shape when the schema is 3. Callers branch on the schema, not on the
kernel version string.

## Worker fan-out

`app/workers/g1OptimizationWorker.ts` and the household arm worker
already build a `RoboticsEvaluationPool`. The pool key changes from
`family:seed:challenge` to `family:seed:challenge:sceneHash` where
`sceneHash` is a stable hash of the obstacles + goals arrays. This keeps
parallel evaluation deterministic across worker restarts.

## Kernel change (sibling crate)

The kernel-side patch in `/Users/jemanuel/projects/frankensim`:
- `crates/fs-cmaes-viz-wasm/src/scene.rs` (or wherever the obstacle list
  lives) gains `obstacles: Vec<ObstacleBox>` and `goals: Vec<Vec3>` on
  the scene struct.
- The single-`Obstacle` field is **removed**; every existing call site
  must be updated to consume the list. This is a hard cutover — schema
  bumps are non-additive by design.
- The OBB collision check that already exists for the counter is
  generalized to iterate the list. Per-piece penetration penalty is
  summed into the same `collisionRiskIntegral` scalar the receipt
  already exposes.

## Tests

Unit tests in `app/lib/frankensimCmaes.test.ts` (new file — extends
existing patterns):
- `decodeHouseholdManipulationAdmission` refuses schema-2 packets.
- `decodeHouseholdManipulationAdmission` decodes a 3-obstacle + 2-goal
  packet and exposes `primaryObstacle()` / `primaryGoal()` accessors.
- A N=MAX_OBSTACLES packet decodes; N=MAX_OBSTACLES+1 is refused.
- Mismatched magic/signature refused.
- NaN center in any obstacle refused.

Worker fan-out tests in `app/workers/g1OptimizationWorker.test.ts`:
- `sceneHash` is stable across reorders of identical arrays (sorted
  canonical form) — so the pool keys are deterministic.

Browser smoke test: visual difference (counter vs furniture layout) is
visible to a human reviewer. No console errors, no kernel refusal.

## Acceptance gates (close cmaes-u53 in this repo only after all green)

- TS-side decoder unit tests pass (8+ cases).
- Worker fan-out deterministic (3+ seeds, sceneHash stable).
- `bun test`, `bun lint`, `bun typecheck`, `bun run build` all green.
- Browser smoke (desktop + mobile): the household arm stage renders
  with the real furniture layout (kitchen-mug obstacle = kitchen-island
  + sofa in view; living-room-remote = library-table + sofa in view;
  backyard-trowel = dresser + bookshelf).
- No kernel refusal; receipts show the new per-piece collision
  breakdown (additive to the existing integral, not a new scalar).

## What this spec does NOT cover

- Kernel implementation (sibling crate).
- The v068 G1 multi-objective rollout (cmaes-pvz, separate bead).
- Re-baking the 5,040-D G1 weight space (cmaes-nxj, separate epic).
- ONNX export (cmaes-19t, depends on cmaes-jhv which is itself blocked
  on cmaes-6m3 / cmaes-wsr / cmaes-j36).
