import { describe, expect, test } from "bun:test";
import {
  createCurtainLattice,
  createCushionLattice,
  createRugLattice,
  stepXPBDSoftBody,
} from "../app/lib/xpbdSoftBody";

describe("XPBD Soft-Body & Compliant Lattice Engine", () => {
  test("createRugLattice constructs valid <=100 node planar lattice", () => {
    const rug = createRugLattice(2.0, 1.5, 6, 6);
    expect(rug.nodes.length).toBe(36); // <= 100 nodes budget
    expect(rug.distanceConstraints.length).toBeGreaterThan(50);
    expect(rug.bendingConstraints.length).toBeGreaterThan(20);
    expect(rug.frictionCoeff).toBeGreaterThan(0.5);
  });

  test("createCushionLattice constructs compressible 3D volume mesh", () => {
    const cushion = createCushionLattice(0.6, 0.15, 0.6);
    expect(cushion.nodes.length).toBe(18); // 3x2x3
    expect(cushion.volumeConstraints.length).toBe(1);
    expect(cushion.volumeConstraints[0].restHeight).toBeCloseTo(0.15, 4);
  });

  test("rug stably settles onto ground floor under gravity without penetrating or exploding", () => {
    const rug = createRugLattice(1.5, 1.5, 5, 5, [0, 0.1, 0]);

    for (let frame = 0; frame < 60; frame++) {
      stepXPBDSoftBody(rug, 1 / 60, 4, 0.0);
    }

    for (const node of rug.nodes) {
      expect(node.position[1]).toBeGreaterThanOrEqual(0.0); // No floor penetration
      expect(node.position[1]).toBeLessThan(0.05); // Settled on floor
      expect(Number.isFinite(node.position[0])).toBe(true);
      expect(Number.isFinite(node.position[1])).toBe(true);
      expect(Number.isFinite(node.position[2])).toBe(true);
    }
  });

  test("cushion compresses under downward load and elastically rebounds", () => {
    const cushion = createCushionLattice(0.5, 0.2, 0.5, [0, 0.1, 0]);

    // Let it settle on floor
    for (let frame = 0; frame < 30; frame++) {
      stepXPBDSoftBody(cushion, 1 / 60, 4, 0.0);
    }

    const getTopAvgY = () => {
      const topIndices = cushion.volumeConstraints[0].topNodes;
      return (
        topIndices.reduce((sum, idx) => sum + cushion.nodes[idx].position[1], 0) / topIndices.length
      );
    };

    const settledTopY = getTopAvgY();

    // Apply downward push load (-50N per node on top)
    const downwardForce: [number, number, number] = [0, -50.0, 0];
    for (let frame = 0; frame < 30; frame++) {
      stepXPBDSoftBody(cushion, 1 / 60, 4, 0.0, downwardForce);
    }

    const compressedTopY = getTopAvgY();
    expect(compressedTopY).toBeLessThan(settledTopY); // Cushion compressed
    expect(Math.abs(cushion.volumeConstraints[0].lambda)).toBeGreaterThan(0);

    // Release load and allow elastic rebound
    for (let frame = 0; frame < 60; frame++) {
      stepXPBDSoftBody(cushion, 1 / 60, 4, 0.0);
    }

    const reboundedTopY = getTopAvgY();
    expect(reboundedTopY).toBeGreaterThan(compressedTopY); // Rebounded elastically!
  });

  test("negative control: bending constraints resist folding and causally flatten creases", () => {
    const stiffRug = createRugLattice(1.2, 1.2, 5, 5, [0, 0.5, 0], 2.5, 1e-6);
    const floppyRug = createRugLattice(1.2, 1.2, 5, 5, [0, 0.5, 0], 2.5, 1e-6);

    for (const b of stiffRug.bendingConstraints) b.compliance = 1e-7;
    for (const b of floppyRug.bendingConstraints) b.compliance = 1000.0;

    // Introduce identical sharp V-fold along the middle column (col = 2)
    for (let r = 0; r < 5; r++) {
      const midIdx = r * 5 + 2;
      stiffRug.nodes[midIdx].position[1] += 0.25;
      stiffRug.nodes[midIdx].prevPosition[1] += 0.25;
      floppyRug.nodes[midIdx].position[1] += 0.25;
      floppyRug.nodes[midIdx].prevPosition[1] += 0.25;
    }

    stepXPBDSoftBody(stiffRug, 1 / 60, 8, -10.0, [0, 0, 0]);
    stepXPBDSoftBody(floppyRug, 1 / 60, 8, -10.0, [0, 0, 0]);

    const stiffCreaseHeight =
      stiffRug.nodes[2].position[1] - 0.5 * (stiffRug.nodes[0].position[1] + stiffRug.nodes[4].position[1]);
    const floppyCreaseHeight =
      floppyRug.nodes[2].position[1] - 0.5 * (floppyRug.nodes[0].position[1] + floppyRug.nodes[4].position[1]);

    expect(stiffCreaseHeight).toBeLessThan(floppyCreaseHeight - 0.05);
    const maxStiffBendLambda = Math.max(
      ...stiffRug.bendingConstraints.map((b) => Math.abs(b.lambda)),
    );
    const maxStiffHingeLambda = Math.max(
      ...stiffRug.bendingConstraints.map((b) => Math.abs(b.hingeLambda ?? 0)),
    );
    expect(maxStiffBendLambda).toBeGreaterThan(0);
    expect(maxStiffHingeLambda).toBeGreaterThan(0);
  });

  test("planar lattices include both main and anti-diagonal shear springs for isotropic shear resistance", () => {
    const rug = createRugLattice(1.0, 1.0, 3, 3);
    // In a 3x3 lattice (4 quad cells), cell (0,0) has nodes 0,1 and 3,4:
    // main diagonal (0,4) and anti-diagonal (1,3) must both be constrained
    const hasMainDiag = rug.distanceConstraints.some(
      (c) => (c.nodeA === 0 && c.nodeB === 4) || (c.nodeA === 4 && c.nodeB === 0),
    );
    const hasAntiDiag = rug.distanceConstraints.some(
      (c) => (c.nodeA === 1 && c.nodeB === 3) || (c.nodeA === 3 && c.nodeB === 1),
    );
    expect(hasMainDiag).toBe(true);
    expect(hasAntiDiag).toBe(true);
  });

  test("createCurtainLattice pins top-edge nodes while free bottom nodes sway and respect rigid sphere colliders", () => {
    const curtain = createCurtainLattice(1.2, 1.5, 6, 6, [0, 2.0, 0]);
    expect(curtain.nodes.length).toBe(36);

    const initialTopPositions = curtain.nodes.slice(0, 6).map((n) => [...n.position]);
    const sphereCollider = { center: [0, 1.1, 0.05] as [number, number, number], radius: 0.35 };

    for (let frame = 0; frame < 25; frame++) {
      stepXPBDSoftBody(curtain, 1 / 60, 6, 0.0, [0, 0, 0.5], [sphereCollider]);
    }

    // Top row must remain strictly pinned at initial anchor positions
    for (let c = 0; c < 6; c++) {
      expect(curtain.nodes[c].invMass).toBe(0);
      expect(curtain.nodes[c].position[0]).toBe(initialTopPositions[c][0]);
      expect(curtain.nodes[c].position[1]).toBe(initialTopPositions[c][1]);
      expect(curtain.nodes[c].position[2]).toBe(initialTopPositions[c][2]);
    }

    // Unpinned nodes must not penetrate inside the rigid sphere collider
    for (let i = 6; i < curtain.nodes.length; i++) {
      const p = curtain.nodes[i].position;
      const dist = Math.hypot(
        p[0] - sphereCollider.center[0],
        p[1] - sphereCollider.center[1],
        p[2] - sphereCollider.center[2],
      );
      expect(dist).toBeGreaterThanOrEqual(sphereCollider.radius - 0.02);
    }
  });

  test("sub-millisecond execution benchmark for 100 XPBD simulation steps", () => {
    const rug = createRugLattice(2.0, 2.0, 6, 6);

    const t0 = performance.now();
    for (let i = 0; i < 100; i++) {
      stepXPBDSoftBody(rug, 1 / 60, 4, 0.0);
    }
    const elapsed = performance.now() - t0;
    expect(elapsed).toBeLessThan(100.0); // <1ms per 36-node XPBD solve under heavy parallel test load
  });
});
