#!/usr/bin/env python3
"""Re-wire feature->epic edges using parent-child, and create 6 new phr4-9 epics as aliases."""
import subprocess
import json
import os
import sys

REPO = "/Users/jemanuel/projects/cmaes_explainer"
BR = "/Users/jemanuel/.local/bin/br"

# Old epic -> new epic
EPIC_MAP = {
    "cmaes-epic-photoreal-envs-whk": "cmaes-phr4",
    "cmaes-epic-param-furniture-zpt": "cmaes-phr5",
    "cmaes-epic-dyn-physics-qrq": "cmaes-phr6",
    "cmaes-epic-clip-bnd-95e": "cmaes-phr7",
    "cmaes-epic-oa-bz5": "cmaes-phr8",
    "cmaes-epic-flagships-qp8": "cmaes-phr9",
}

# New epic descriptions (slim — the full text is in the .planning/bead-graphs/*.md files)
NEW_EPIC_BODIES = {
    "cmaes-phr4": "EPIC: Photo-real household environments (textures, lighting, IBL, post-FX). Alias of cmaes-epic-photoreal-envs-whk. 10 features (cmaes-feat-pr1..pr10-*) cover PBR pipeline, procedural materials, IBL HDR, DDGI probes, contact shadows, SSR, post-FX, emissive, volumetric, material DB. See .planning/bead-graphs/cmaes-pr0-epic-photoreal-envs.md for full background, SOTA references, acceptance criteria.",
    "cmaes-phr5": "EPIC: Parameterized furniture & household objects (catalog, procedural, articulation). Alias of cmaes-epic-param-furniture-zpt. 11 features (cmaes-feat-fg1..fg11-*) cover taxonomy, procedural shape, articulation graph, catalog data, rolling pieces, soft/deformable proxies, appliance internals, small objects, decor silhouettes, breakage, catalog browser. See .planning/bead-graphs/cmaes-fg0-epic-parameterized-furniture.md.",
    "cmaes-phr6": "EPIC: Frankensim dynamic-physics kernel (multi-body, contact, rolling, friction). Alias of cmaes-epic-dyn-physics-qrq. 14 features (cmaes-feat-ph1..ph14-*) cover Featherstone ABA+RNEA, rolling contact, multi-body contact graph, LCP solver, friction model, body breakage, schema-8 (v068), browser adapter fail-closed, soft-body, contact telemetry, restitution, CCD, sleep state, perf instrumentation. See .planning/bead-graphs/cmaes-ph0-epic-dynamic-physics.md.",
    "cmaes-phr7": "EPIC: Ultra-accurate clipping & boundary detection (SDF, BVH, CCD). Alias of cmaes-epic-clip-bnd-95e. 11 features (cmaes-feat-cl1..cl11-*) cover BVH/SAH broadphase, analytic primitive SDFs, triangle-mesh SDF, differentiable SDF, penetration depth + contact manifold, CCD on SDFs, heightfield SDF, clearance query, self-intersection, neural SDF refinement, query telemetry. See .planning/bead-graphs/cmaes-cl0-epic-clipping-boundary.md.",
    "cmaes-phr8": "EPIC: Robust obstacle avoidance objectives (CBF, MPC, learned costmap). Alias of cmaes-epic-oa-bz5. 12 features (cmaes-feat-oa1..oa12-*) cover CBF, safety-filtered CMA action, dynamic obstacle velocity, whole-body G1/arm CBF, risk-aware safety margin, learned costmap, MPC safety filter, recovery from infeasibility, obstacle-avoidance rollup term, pedestrian/pet avoidance, SSCBF for corridors. See .planning/bead-graphs/cmaes-oa0-epic-obstacle-avoidance.md.",
    "cmaes-phr9": "EPIC: G1 walking + arm manipulation in the photo-real household. Alias of cmaes-epic-flagships-qp8. 12 features (cmaes-feat-fs1..fs12-*) cover indoor/outdoor G1 walking, kitchen/parlor/porch arm, honesty chip stack, house nav, multi-room tour, live CMA, shuffle stress, ablation, visitor mode. See .planning/bead-graphs/cmaes-fs0-epic-flagships-in-photoreal-env.md.",
}

EPIC_TITLES = {
    "cmaes-phr4": "EPIC: Photo-real household environments (PBR / IBL / DDGI / post-FX)",
    "cmaes-phr5": "EPIC: Parameterized furniture & household objects (catalog / procedural / articulation)",
    "cmaes-phr6": "EPIC: Frankensim dynamic-physics kernel (multi-body / contact / rolling / friction / v068)",
    "cmaes-phr7": "EPIC: Ultra-accurate clipping & boundary detection (SDF / BVH / CCD)",
    "cmaes-phr8": "EPIC: Robust obstacle-avoidance objectives (CBF / MPC / learned costmap)",
    "cmaes-phr9": "EPIC: G1 walking + arm manipulation in the photo-real household",
}


def run(cmd, **kw):
    return subprocess.run(cmd, capture_output=True, text=True, **kw)


def main():
    os.chdir(REPO)
    env = os.environ.copy()
    env["PATH"] = BR + ":" + env.get("PATH", "")

    # 1) Create the 6 new phr4-9 epics
    for phr_id, body in NEW_EPIC_BODIES.items():
        cmd = [BR, "create",
               "--slug", phr_id.replace("cmaes-", ""),
               "--title", EPIC_TITLES[phr_id],
               "-t", "epic",
               "-p", "1",
               "-d", body,
               "--actor", "CreamHare"]
        r = run(cmd, env=env)
        if r.returncode != 0:
            print(f"FAIL create {phr_id}: {r.stderr}", file=sys.stderr)
        else:
            line = r.stdout.strip().splitlines()[-1]
            new_id = line.split()[2].rstrip(":")
            print(f"  + {new_id}  ({phr_id})")

    # 2) Wire old epic -> new epic alias (related)
    for old, new in EPIC_MAP.items():
        cmd = [BR, "dep", "add", new, old, "--type", "related"]
        r = run(cmd, env=env)
        if r.returncode != 0:
            print(f"FAIL alias {new} -> {old}: {r.stderr}", file=sys.stderr)

    # 3) Wire each feature -> its new epic (parent-child) — re-run with correct type
    # Reload the feature ids
    with open(".planning/feature-bead-ids.json") as f:
        created = json.load(f)

    # Map feature slug prefix -> new epic
    PREFIX_TO_EPIC = {
        "feat-pr": "cmaes-phr4",
        "feat-fg": "cmaes-phr5",
        "feat-ph": "cmaes-phr6",
        "feat-cl": "cmaes-phr7",
        "feat-oa": "cmaes-phr8",
        "feat-fs": "cmaes-phr9",
    }

    for slug, bead_id in created.items():
        # Identify the new epic from the slug prefix
        epic_id = None
        for prefix, eid in PREFIX_TO_EPIC.items():
            if slug.startswith(prefix):
                epic_id = eid
                break
        if not epic_id:
            print(f"SKIP {slug}: unknown prefix", file=sys.stderr)
            continue
        cmd = [BR, "dep", "add", bead_id, epic_id, "--type", "parent-child"]
        r = run(cmd, env=env)
        if r.returncode != 0:
            print(f"FAIL parent-child {bead_id} -> {epic_id}: {r.stderr}", file=sys.stderr)


if __name__ == "__main__":
    main()
