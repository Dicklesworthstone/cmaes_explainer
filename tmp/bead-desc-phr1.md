# Why this epic exists (background)

The user directive for phr-env-2026 says: "Part of the objective for
the humanoid and the arm robots should be robust obstacle avoidance.
This will require ultra-accurate clipping detection and physical
boundary detection so the physics are accurately modeled with the
frankensim physics stack. SOTA research, including dynamic programming
and similar techniques, must be researched and applied."

This epic is the **EPIC-level summary** for that work. The detailed
feature-level work lives under `cmaes-feat-oa*` (12 feature beads
authored by CreamHare) and the implementation epic is
`cmaes-phr8-ejq` (CreamHare). I (TurquoiseFalcon) own this alias epic
so the canonical `bv --robot-triage` view groups the
obstacle-avoidance work under a single P1 epic in the `cmaes-phr*`
family.

# What this epic is

A canonical summary of the obstacle-avoidance objective for the
humanoid and the arm. The objective must:

1. Be C¹-continuous in the state (no cliffs) so CMA-ES and PPO don't
   see reward gaps.
2. Decompose into a per-step reward (for the future PPO training
   crate `cmaes-jhv`) AND a per-rollout scalar (for CMA-ES /
   frankensim now).
3. Be safe under the no-reward-hacking test: removing all obstacles
   strictly increases the score for every state in a held-out set,
   and the zero policy is provably worse than the curriculum mean.
4. Be accepted by all three CMA owner families (separable / LM-CMA /
   LM-MA) with the same top-1 candidate.
5. Be implemented as a typed
   `evaluateObstacleObjective(state, obstacles, ctx)` API that
   returns `{ perStep, scalar, breakdown }`.

# SOTA grounding (verified — see `cmaes-phr3.1` for full citations)

- **Ames et al., IEEE TAC 2017** — control barrier functions (CBF).
- **Ames et al., ECC 2019** — multi-author CBF tutorial.
- **Jo, Zhang, Yang, Luo, ICRA 2026 (arXiv:2605.30696)** — geometry-aware
  CBF with Bernstein-polynomial SDFs.
- **Mirtich 1996** — impulse-based dynamics (anti-reward-hacking cap).
- **Catto 2011** — soft-constraint formulation.
- **Hansen 2016** + **Loshchilov 2014** — CMA-ES and LM-CMA conditioning.
- **Sutton-Barto 2018 ch. 4-5** — per-step decomposition.

# Acceptance (epic closes when all feature beads close AND all-family rank test green)

- All 12 `cmaes-feat-oa*` children close.
- All-family rank test: separable, LM-CMA, and LM-MA owners all rank
  the same top-1 candidate on both flagships (G1 5,040-D and
  household arm 128-D) with overlap >= 0.9.
- No-reward-hacking test: removing obstacles strictly increases the
  objective for every state in the held-out set.
- The typed API is the canonical per-rollout scalar and is
  decomposable into per-step reward.

# What I own vs. what CreamHare owns

- **TurquoiseFalcon (me)**: this EPIC bead + the SOTA research
  grounding in `cmaes-phr3.1` (math-side one-pagers).
- **CreamHare**: `cmaes-phr8-ejq` (the implementation epic) and the
  12 `cmaes-feat-oa*` children.
- **RubyThrush**: `cmaes-phr3m-meas-mlw` and the parity/perf
  measurement harnesses that gate the feature acceptance.

# Why this is an "alias epic"

Creating `cmaes-phr1.1..1.9` sub-beads would duplicate the existing
`cmaes-feat-oa*` hierarchy. Per `/just-say-no-to-process-porn-and-ceremony`,
aliasing via parent-child keeps the canonical `bv` view clean while
preserving the full information (background, SOTA citations,
acceptance criteria) in the feature-level beads.

# Out of scope (other slices)

- The visual / PBR / light transport / parameterized-furniture
  geometry (CreamHare's `cmaes-phr4`, `cmaes-phr5`).
- The kernel-side multi-body / contact / rolling / friction
  (CreamHare's `cmaes-phr6`).
- The clipping / boundary detection implementation (CreamHare's
  `cmaes-phr7`; my alias is `cmaes-phr2`).
- The measurement / parity / perf harnesses (RubyThrush's
  `cmaes-phr3m-*`).
- The CMA-ES / PPO training crate Rust work (`cmaes-j36` / `jhv` /
  `wsr` / `6m3` / `jk1`).
- The v067 G1 walking flagship regression (`cmaes-pvz`, TealCardinal).
