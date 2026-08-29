#!/usr/bin/env python3
"""Create all feature beads under the 6 epics and wire dependencies."""
import subprocess
import json
import os
import sys

REPO = "/Users/jemanuel/projects/cmaes_explainer"
BR = "/Users/jemanuel/.local/bin/br"

# Epic -> features mapping (label, type, priority, slug, title, deps)
# Each feature is a single self-contained description

EPIC_FEATURES = {
    "cmaes-epic-photoreal-envs-whk": [
        # pr1: Texture & material pipeline
        ("feature", 1, "feat-pr1-pbr-pipeline", "PBR texture & material pipeline (glTF 2.0, KTX2, sRGB/linear)"),
        # pr2: Procedural material authoring
        ("feature", 1, "feat-pr2-proc-materials", "Procedural material authoring (wood, fabric, ceramic, metal — deterministic)"),
        # pr3: IBL HDR envmap
        ("feature", 1, "feat-pr3-ibl-hdr", "Image-based lighting (IBL) HDR envmap with irradiance + prefilter"),
        # pr4: Real-time GI
        ("feature", 1, "feat-pr4-ddgi", "Real-time DDGI (Dynamic Diffuse Global Illumination) probe grid"),
        # pr5: Contact shadows
        ("feature", 1, "feat-pr5-contact-shadows", "Contact / soft shadows (VSM + SDF-projected)"),
        # pr6: SSR
        ("feature", 2, "feat-pr6-ssr", "Screen-space reflections (SSR) for polished floors + denoised TAA"),
        # pr7: Tonemap + post-FX
        ("feature", 2, "feat-pr7-postfx", "Tonemap + post-FX (ACES, bloom, vignette, CA) centralized"),
        # pr8: Emissive surfaces
        ("feature", 2, "feat-pr8-emissive", "Lumen-style emissive surfaces (recessed lights, oven, fireplace)"),
        # pr9: Volumetric
        ("feature", 2, "feat-pr9-volumetric", "Volumetric lighting (god rays through windows, exp height fog)"),
        # pr10: Material DB
        ("feature", 3, "feat-pr10-matdb", "Material database internal tool (browse, preview, iterate)"),
    ],
    "cmaes-epic-param-furniture-zpt": [
        # fg1: taxonomy
        ("feature", 1, "feat-fg1-taxonomy", "Furniture category taxonomy (30+ kinds, default size / mass / CoG / friction / articulation)"),
        # fg2: procedural shape
        ("feature", 1, "feat-fg2-proc-shape", "Procedural shape generation (primitives, swept/revolved, B-spline; outputs THREE.BufferGeometry + bv::OBB)"),
        # fg3: articulation graph
        ("feature", 1, "feat-fg3-articulation", "Articulation graph (joints: revolute/prismatic/fixed, limits, mass, inertia)"),
        # fg4: catalog data
        ("feature", 1, "feat-fg4-catalog-data", "Extend app/lib/houseScenes.ts: 60+ pieces, 3 room presets, parameterized specs"),
        # fg5: rolling
        ("feature", 2, "feat-fg5-rolling", "Rolling pieces (stools, office chairs, buckets) — cylinder primitives + rollingFriction"),
        # fg6: soft body
        ("feature", 2, "feat-fg6-soft", "Soft / deformable proxies (cushions, rugs, curtains) — bounded mass-spring lattice"),
        # fg7: appliance internals
        ("feature", 2, "feat-fg7-appliances", "Appliance internals (fridge shelves, oven racks, washer drum) — openable by arm"),
        # fg8: small objects
        ("feature", 2, "feat-fg8-small-objs", "Small objects (plate, glass, mug, pan, knife, remote) — small-mass, high-fragility"),
        # fg9: pets/people
        ("feature", 2, "feat-fg9-decor", "Pets & people silhouettes (display-only soft obstacles)"),
        # fg10: breakage
        ("feature", 3, "feat-fg10-breakage", "Procedural breakage (impulse threshold -> pre-baked fragment set)"),
        # fg11: catalog browser
        ("feature", 3, "feat-fg11-catbrowser", "Catalog browser / spec inspector (internal tool)"),
    ],
    "cmaes-epic-dyn-physics-qrq": [
        # ph1: Featherstone
        ("feature", 1, "feat-ph1-featherstone", "Articulated-body solver (Featherstone ABA + RNEA) in fs-mbd crate"),
        # ph2: rolling contact
        ("feature", 1, "feat-ph2-rolling", "Rolling contact (cylinder/sphere on plane, Coulomb + spinning friction)"),
        # ph3: multi-body contact
        ("feature", 1, "feat-ph3-contact-graph", "Multi-body contact graph (replace one-obstacle scene with Body[], AABB broadphase + GJK/EPA narrowphase)"),
        # ph4: LCP solver
        ("feature", 1, "feat-ph4-lcp", "Sequential impulse / LCP solver (projected-Gauss-Seidel or Newton; refusal envelope on non-convergence)"),
        # ph5: friction model
        ("feature", 1, "feat-ph5-friction", "Per-material-pair friction model (rubber/wood, ceramic/steel, fabric/fabric; conservative defaults)"),
        # ph6: breakage
        ("feature", 1, "feat-ph6-breakage", "Body breakage (impulse threshold -> fragment set; sum mass + inertia)"),
        # ph7: schema-8
        ("feature", 1, "feat-ph7-schema8", "Schema-8 (v068) wire format (Float64Array typed, packed ABI; round-trip tests)"),
        # ph8: browser adapter
        ("feature", 1, "feat-ph8-adapter", "Browser adapter fail-closed (refuses v067 with bodies>1; refuses v068 without manifest)"),
        # ph9: soft body
        ("feature", 2, "feat-ph9-soft-sim", "Soft-body / mass-spring proxy (rugs, cushions; ≤100 nodes/piece)"),
        # ph10: contact telemetry
        ("feature", 2, "feat-ph10-telemetry", "Contact impulse telemetry ((t, bodyA, bodyB, normalImpulse, tangentImpulse, point, slip) per contact)"),
        # ph11: restitution
        ("feature", 2, "feat-ph11-restitution", "Restitution & damping (per-material-pair; tuned for honest completedSteps)"),
        # ph12: CCD
        ("feature", 3, "feat-ph12-ccd", "Continuous collision detection (CCD) on SDFs (alt-spatial-temporal opt, CGF 2025)"),
        # ph13: sleep state
        ("feature", 3, "feat-ph13-sleep", "Multi-body sleep state (impulse+contact gate; explicit transition events)"),
        # ph14: perf instrumentation
        ("feature", 3, "feat-ph14-perf", "Per-step kernel perf instrumentation (broadphase / narrowphase / LCP / integrator timing)"),
    ],
    "cmaes-epic-clip-bnd-95e": [
        # cl1: BVH/SAH
        ("feature", 1, "feat-cl1-bvh", "BVH/SAH broadphase (top-down SAH; double-buffered AABB; 300k tris in ≤50 µs)"),
        # cl2: analytic SDFs
        ("feature", 1, "feat-cl2-primitive-sdf", "Analytic primitive SDFs (box, sphere, cylinder, capsule, OBB, plane, heightfield)"),
        # cl3: mesh SDF
        ("feature", 1, "feat-cl3-mesh-sdf", "Triangle-mesh SDF (sparse 3D grid + tri accel; Lipschitz=1; bounded error)"),
        # cl4: differentiable SDF
        ("feature", 1, "feat-cl4-diff-sdf", "Differentiable SDF (C¹-smooth; neural refinement in near-surface band)"),
        # cl5: penetration
        ("feature", 1, "feat-cl5-penetration", "Penetration depth & contact manifold (smallest separating translation + active joint impulses)"),
        # cl6: CCD
        ("feature", 1, "feat-cl6-ccd-sdf", "CCD on SDFs (alt-spatial-temporal opt; sub-100 µs per pair; 0.1 mm test)"),
        # cl7: heightfield
        ("feature", 2, "feat-cl7-heightfield", "Heightfield SDF (sparse voxel + bilinear; outdoor terrain)"),
        # cl8: clearance
        ("feature", 2, "feat-cl8-clearance", "Clearance query (whole-body + nearest-free-direction; Lipschitz-bounded)"),
        # cl9: self-intersection
        ("feature", 2, "feat-cl9-selfx", "Self-intersection test (G1 every link; arm every link)"),
        # cl10: neural refinement
        ("feature", 3, "feat-cl10-neural", "Neural SDF refinement per piece (≤20k params MLP; freeze at bake)"),
        # cl11: query telemetry
        ("feature", 3, "feat-cl11-qtelemetry", "Query telemetry (kind, µs, bytes, hitCount) into trace"),
    ],
    "cmaes-epic-oa-bz5": [
        # oa1: CBF
        ("feature", 1, "feat-oa1-cbf", "Safety barrier function (CBF, C¹-smooth; sub-ms QP)"),
        # oa2: filtered action
        ("feature", 1, "feat-oa2-filter", "Safety-filtered CMA action (project unsafe a -> closest safe a)"),
        # oa3: dynamic obstacle velocity
        ("feature", 1, "feat-oa3-velocity", "Dynamic obstacle velocity (linear extrapolation from contact telemetry)"),
        # oa4: G1 whole-body
        ("feature", 1, "feat-oa4-g1-wb", "Whole-body CBF for the G1 (29 actuated joints; min over links)"),
        # oa5: arm whole-body
        ("feature", 1, "feat-oa5-arm-wb", "Whole-body CBF for the arm (12 joints + gripper; strictest margin when carrying)"),
        # oa6: risk-aware margin
        ("feature", 1, "feat-oa6-margin", "Risk-aware safety margin ((velocity, material, surface angle) per MDPI 2025)"),
        # oa7: learned costmap
        ("feature", 2, "feat-oa7-costmap", "Learned costmap (≤100k params MLP; warm-start + bonus)"),
        # oa8: MPC safety filter
        ("feature", 2, "feat-oa8-mpc", "MPC safety filter (2-4 step receding horizon; bounded by geom cost)"),
        # oa9: recovery from infeasibility
        ("feature", 2, "feat-oa9-recover", "Recovery from infeasibility (safetyFilterInfeasible -> recent-safe + reflex)"),
        # oa10: rollup term
        ("feature", 2, "feat-oa10-rollup", "Obstacle-avoidance rollup term (per-step + trajectory-aggregated; multi-factor per cmaes-pvz)"),
        # oa11: pet/pedestrian
        ("feature", 3, "feat-oa11-soft", "Pedestrian / pet silhouette avoidance (display-only soft obstacles)"),
        # oa12: SSCBF
        ("feature", 3, "feat-oa12-sscbf", "Segment-safe CBF (SSCBF) for tight corridors (doorways)"),
    ],
    "cmaes-epic-flagships-qp8": [
        # fs1: indoor G1
        ("feature", 1, "feat-fs1-indoor-g1", "Indoor G1 walking flagship (kitchen + dining + doorway, with parameterized furniture)"),
        # fs2: outdoor G1
        ("feature", 1, "feat-fs2-outdoor-g1", "Outdoor G1 walking flagship (porch/garden, terrain heightfield)"),
        # fs3: kitchen arm
        ("feature", 1, "feat-fs3-kitchen-arm", "Indoor arm manipulation flagship (kitchen pick-place: open fridge, plate, place)"),
        # fs4: parlor arm
        ("feature", 1, "feat-fs4-parlor-arm", "Indoor arm manipulation flagship (parlor tidy: book from floor to coffee table)"),
        # fs5: porch arm
        ("feature", 1, "feat-fs5-porch-arm", "Outdoor arm manipulation flagship (porch cleanup: broom, leaf, bucket)"),
        # fs6: honesty chips
        ("feature", 1, "feat-fs6-honesty", "Honesty chip stack (full) — every chip clickable to source / bead id"),
        # fs7: house nav
        ("feature", 2, "feat-fs7-house-nav", "House navigation experiment (kitchen -> parlor -> bedroom -> bathroom waypoint chain)"),
        # fs8: multi-room tour
        ("feature", 2, "feat-fs8-tour", "Multi-room tour (single 720-step rollout, replayed as 3D fly-through)"),
        # fs9: live CMA
        ("feature", 2, "feat-fs9-live-cma", "Live CMA-ES in the household (3 scalable owners, real-time policy evolution)"),
        # fs10: stress test
        ("feature", 2, "feat-fs10-shuffle", "Re-shuffled furniture stress test (jittered positions + 1 rolling piece)"),
        # fs11: ablation
        ("feature", 2, "feat-fs11-ablation", "Side-by-side ablation (linear residual CMA vs learned-from-scratch transformer; same furniture/seed)"),
        # fs12: visitor mode
        ("feature", 3, "feat-fs12-visitor", "Visitor mode (deterministic 30-second clip; OG / landing / Twitter reference)"),
    ],
}

# Cross-epic dependency edges (feature -> feature)
# Each tuple: (child_feature_slug, parent_feature_slug, type)
DEPS = [
    # Epic 1 (cmaes-epic-photoreal-envs-whk) deps
    ("feat-pr2-proc-materials", "feat-pr1-pbr-pipeline", "blocks"),
    ("feat-pr3-ibl-hdr", "feat-pr1-pbr-pipeline", "blocks"),
    ("feat-pr4-ddgi", "feat-pr3-ibl-hdr", "blocks"),
    ("feat-pr5-contact-shadows", "feat-cl1-bvh", "blocks"),
    ("feat-pr6-ssr", "feat-pr3-ibl-hdr", "blocks"),
    ("feat-pr7-postfx", "feat-pr4-ddgi", "blocks"),
    ("feat-pr8-emissive", "feat-pr4-ddgi", "blocks"),
    ("feat-pr9-volumetric", "feat-pr4-ddgi", "blocks"),
    ("feat-pr10-matdb", "feat-pr2-proc-materials", "blocks"),

    # Epic 2 deps
    ("feat-fg2-proc-shape", "feat-fg1-taxonomy", "blocks"),
    ("feat-fg3-articulation", "feat-fg1-taxonomy", "blocks"),
    ("feat-fg4-catalog-data", "feat-fg2-proc-shape", "blocks"),
    ("feat-fg4-catalog-data", "feat-fg3-articulation", "blocks"),
    ("feat-fg5-rolling", "feat-fg2-proc-shape", "blocks"),
    ("feat-fg6-soft", "feat-fg2-proc-shape", "blocks"),
    ("feat-fg7-appliances", "feat-fg3-articulation", "blocks"),
    ("feat-fg8-small-objs", "feat-fg2-proc-shape", "blocks"),
    ("feat-fg9-decor", "feat-fg1-taxonomy", "blocks"),
    ("feat-fg10-breakage", "feat-fg2-proc-shape", "blocks"),
    ("feat-fg11-catbrowser", "feat-fg4-catalog-data", "blocks"),

    # Epic 2 -> Epic 1 (PBR materials on furniture)
    ("feat-fg4-catalog-data", "feat-pr1-pbr-pipeline", "blocks"),

    # Epic 3 deps
    ("feat-ph2-rolling", "feat-ph1-featherstone", "blocks"),
    ("feat-ph3-contact-graph", "feat-ph1-featherstone", "blocks"),
    ("feat-ph4-lcp", "feat-ph3-contact-graph", "blocks"),
    ("feat-ph5-friction", "feat-ph4-lcp", "blocks"),
    ("feat-ph6-breakage", "feat-ph4-lcp", "blocks"),
    ("feat-ph7-schema8", "feat-ph3-contact-graph", "blocks"),
    ("feat-ph8-adapter", "feat-ph7-schema8", "blocks"),
    ("feat-ph9-soft-sim", "feat-ph4-lcp", "blocks"),
    ("feat-ph10-telemetry", "feat-ph4-lcp", "blocks"),
    ("feat-ph11-restitution", "feat-ph4-lcp", "blocks"),
    ("feat-ph12-ccd", "feat-ph7-schema8", "blocks"),
    ("feat-ph13-sleep", "feat-ph4-lcp", "blocks"),
    ("feat-ph14-perf", "feat-ph4-lcp", "blocks"),

    # Epic 3 -> Epic 2 (consumes FurnitureSpec)
    ("feat-ph1-featherstone", "feat-fg1-taxonomy", "blocks"),
    ("feat-ph3-contact-graph", "feat-fg2-proc-shape", "blocks"),
    ("feat-ph3-contact-graph", "feat-fg3-articulation", "blocks"),
    ("feat-ph5-friction", "feat-fg1-taxonomy", "blocks"),
    ("feat-ph6-breakage", "feat-fg10-breakage", "blocks"),

    # Epic 4 deps
    ("feat-cl2-primitive-sdf", "feat-cl1-bvh", "blocks"),
    ("feat-cl3-mesh-sdf", "feat-cl1-bvh", "blocks"),
    ("feat-cl4-diff-sdf", "feat-cl2-primitive-sdf", "blocks"),
    ("feat-cl4-diff-sdf", "feat-cl3-mesh-sdf", "blocks"),
    ("feat-cl5-penetration", "feat-cl4-diff-sdf", "blocks"),
    ("feat-cl6-ccd-sdf", "feat-cl4-diff-sdf", "blocks"),
    ("feat-cl7-heightfield", "feat-cl2-primitive-sdf", "blocks"),
    ("feat-cl8-clearance", "feat-cl4-diff-sdf", "blocks"),
    ("feat-cl9-selfx", "feat-cl2-primitive-sdf", "blocks"),
    ("feat-cl10-neural", "feat-cl4-diff-sdf", "blocks"),
    ("feat-cl11-qtelemetry", "feat-cl4-diff-sdf", "blocks"),

    # Epic 4 -> Epic 2 (queries the mesh)
    ("feat-cl3-mesh-sdf", "feat-fg2-proc-shape", "blocks"),

    # Epic 5 deps
    ("feat-oa2-filter", "feat-oa1-cbf", "blocks"),
    ("feat-oa3-velocity", "feat-oa1-cbf", "blocks"),
    ("feat-oa3-velocity", "feat-ph10-telemetry", "blocks"),
    ("feat-oa4-g1-wb", "feat-oa1-cbf", "blocks"),
    ("feat-oa4-g1-wb", "feat-cl8-clearance", "blocks"),
    ("feat-oa5-arm-wb", "feat-oa1-cbf", "blocks"),
    ("feat-oa5-arm-wb", "feat-cl8-clearance", "blocks"),
    ("feat-oa6-margin", "feat-oa1-cbf", "blocks"),
    ("feat-oa7-costmap", "feat-oa1-cbf", "blocks"),
    ("feat-oa8-mpc", "feat-oa1-cbf", "blocks"),
    ("feat-oa8-mpc", "feat-cl5-penetration", "blocks"),
    ("feat-oa9-recover", "feat-oa1-cbf", "blocks"),
    ("feat-oa10-rollup", "feat-oa1-cbf", "blocks"),
    ("feat-oa11-soft", "feat-oa1-cbf", "blocks"),
    ("feat-oa12-sscbf", "feat-oa1-cbf", "blocks"),

    # Epic 6 deps
    ("feat-fs1-indoor-g1", "feat-fs1-indoor-g1", "self"),  # placeholder
    ("feat-fs1-indoor-g1", "feat-ph8-adapter", "blocks"),
    ("feat-fs1-indoor-g1", "feat-fg4-catalog-data", "blocks"),
    ("feat-fs1-indoor-g1", "feat-pr4-ddgi", "blocks"),
    ("feat-fs1-indoor-g1", "feat-oa4-g1-wb", "blocks"),
    ("feat-fs1-indoor-g1", "feat-oa10-rollup", "blocks"),
    ("feat-fs2-outdoor-g1", "feat-ph8-adapter", "blocks"),
    ("feat-fs2-outdoor-g1", "feat-cl7-heightfield", "blocks"),
    ("feat-fs2-outdoor-g1", "feat-oa4-g1-wb", "blocks"),
    ("feat-fs3-kitchen-arm", "feat-fg7-appliances", "blocks"),
    ("feat-fs3-kitchen-arm", "feat-oa5-arm-wb", "blocks"),
    ("feat-fs3-kitchen-arm", "feat-pr4-ddgi", "blocks"),
    ("feat-fs4-parlor-arm", "feat-fg4-catalog-data", "blocks"),
    ("feat-fs4-parlor-arm", "feat-oa5-arm-wb", "blocks"),
    ("feat-fs5-porch-arm", "feat-fg8-small-objs", "blocks"),
    ("feat-fs5-porch-arm", "feat-oa5-arm-wb", "blocks"),
    ("feat-fs6-honesty", "feat-fs1-indoor-g1", "blocks"),
    ("feat-fs7-house-nav", "feat-fs1-indoor-g1", "blocks"),
    ("feat-fs8-tour", "feat-fs7-house-nav", "blocks"),
    ("feat-fs9-live-cma", "feat-fs1-indoor-g1", "blocks"),
    ("feat-fs10-shuffle", "feat-fs1-indoor-g1", "blocks"),
    ("feat-fs11-ablation", "feat-fs1-indoor-g1", "blocks"),
    ("feat-fs12-visitor", "feat-fs1-indoor-g1", "blocks"),
]


def run(cmd, **kw):
    return subprocess.run(cmd, capture_output=True, text=True, **kw)


def main():
    os.chdir(REPO)
    env = os.environ.copy()
    env["PATH"] = BR + ":" + env.get("PATH", "")

    created = {}  # slug -> bead id

    # 1) Create all features under their epic parents
    for epic_id, features in EPIC_FEATURES.items():
        for ftype, prio, slug, title in features:
            cmd = [
                BR, "create",
                "--slug", slug,
                "--title", title,
                "-t", ftype,
                "-p", str(prio),
            ]
            r = run(cmd, env=env)
            if r.returncode != 0:
                print(f"FAIL create {slug}: {r.stderr}", file=sys.stderr)
                continue
            # Parse the created id from "✓ Created <id>: <title>"
            line = r.stdout.strip().splitlines()[-1]
            bead_id = line.split()[2].rstrip(":")
            created[slug] = bead_id
            print(f"  + {bead_id}  ({slug})")

    # 2) Wire each feature -> its parent epic
    for epic_id, features in EPIC_FEATURES.items():
        for ftype, prio, slug, title in features:
            if slug in created:
                bead_id = created[slug]
                cmd = [BR, "dep", "add", bead_id, epic_id, "--type", "parent"]
                r = run(cmd, env=env)
                if r.returncode != 0:
                    print(f"FAIL dep add {bead_id} -> {epic_id}: {r.stderr}", file=sys.stderr)

    # 3) Wire cross-feature deps
    for child_slug, parent_slug, dep_type in DEPS:
        if child_slug == parent_slug:
            continue
        if child_slug not in created or parent_slug not in created:
            print(f"SKIP dep {child_slug} -> {parent_slug}: missing bead", file=sys.stderr)
            continue
        child_id = created[child_slug]
        parent_id = created[parent_slug]
        cmd = [BR, "dep", "add", child_id, parent_id, "--type", dep_type]
        r = run(cmd, env=env)
        if r.returncode != 0:
            print(f"FAIL dep add {child_id} -> {parent_id}: {r.stderr}", file=sys.stderr)

    print(f"\n=== Done. Created {len(created)} features across 6 epics ===")
    # Persist mapping
    with open(".planning/feature-bead-ids.json", "w") as f:
        json.dump(created, f, indent=2, sort_keys=True)


if __name__ == "__main__":
    main()
