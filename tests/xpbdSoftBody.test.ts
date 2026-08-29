import { describe, expect, test } from "bun:test";
import {
  createCushionLattice,
  createRugLattice,
  stepXPBDSoftBody,
} from "../app/lib/xpbdSoftBody";

describe("XPBD Soft-Body & Compliant Lattice Engine", () => {
  test("createRugLattice constructs valid <=100 node planar lattice", () => {
    const rug = createRugLattice(2.0, 1.5, 6, 6);
    expect(rug.nodes.length).toBe(36); // <= 100 nodes budget
    expect(rug.distanceConstraints.length).toBeGreaterThan(50);
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
      return topIndices.reduce((sum, idx) => sum + cushion.nodes[idx].position[1], 0) / topIndices.length;
    };

    const settledTopY = getTopAvgY();

    // Apply downward push load (-50N per node on top)
    const downwardForce: [number, number, number] = [0, -50.0, 0];
    for (let frame = 0; frame < 30; frame++) {
      stepXPBDSoftBody(cushion, 1 / 60, 4, 0.0, downwardForce);
    }

    const compressedTopY = getTopAvgY();
    expect(compressedTopY).toBeLessThan(settledTopY); // Cushion compressed

    // Release load and allow elastic rebound
    for (let frame = 0; frame < 60; frame++) {
      stepXPBDSoftBody(cushion, 1 / 60, 4, 0.0);
    }

    const reboundedTopY = getTopAvgY();
    expect(reboundedTopY).toBeGreaterThan(compressedTopY); // Rebounded elastically!
  });

  test("sub-millisecond execution benchmark for 100 XPBD simulation steps", () => {
    const rug = createRugLattice(2.0, 2.0, 6, 6);

    const t0 = performance.now();
    for (let i = 0; i < 100; i++) {
      stepXPBDSoftBody(rug, 1 / 60, 4, 0.0);
    }
    const elapsed = performance.now() - t0;
    expect(elapsed).toBeLessThan(15.0); // <150µs per 36-node XPBD solve
  });
});
