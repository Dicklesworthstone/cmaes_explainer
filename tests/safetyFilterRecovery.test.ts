import { describe, expect, test } from "bun:test";
import {
  type RecoveryConstraint,
  SafetyFilterRecoveryManager,
} from "../app/lib/safetyFilterRecovery";

describe("Safety Filter Infeasibility Recovery Engine", () => {
  test("maintains circular safe history buffer with capacity bounds", () => {
    const manager = new SafetyFilterRecoveryManager({ historyCapacity: 5 });

    // States with margin below threshold (0.05) should NOT be recorded
    manager.recordSafeState([0, 0, 0], [0, 0, 0], 0.01, 0.0);
    expect(manager.getHistoryLength()).toBe(0);

    // Record 6 safe states (> capacity 5)
    for (let i = 1; i <= 6; i++) {
      manager.recordSafeState([i, 0, 0], [0, 0, 0], 0.15, i * 0.1);
    }
    expect(manager.getHistoryLength()).toBe(5);
  });

  test("passes strictly feasible controls untouched in nominal state", () => {
    const manager = new SafetyFilterRecoveryManager();
    const pos: [number, number, number] = [0, 0, 0];
    const vel: [number, number, number] = [0, 0, 0];
    const uNom: [number, number, number] = [0.5, 0.0, 0.0];

    const constraint: RecoveryConstraint = {
      id: "front-wall",
      hValue: 1.0, // 1 meter safe margin
      gradient: [-1, 0, 0],
    };

    const res = manager.filterOrRecover(uNom, pos, vel, [constraint]);
    expect(res.state).toBe("nominal");
    expect(res.safeControl).toEqual(uNom);
    expect(res.maxViolationSlack).toBe(0);
  });

  test("applies bounded slack projection for minor violations in relaxed-slack state", () => {
    const manager = new SafetyFilterRecoveryManager({ maxSlack: 0.2 });
    const pos: [number, number, number] = [0, 0, 0];
    const vel: [number, number, number] = [0, 0, 0];
    const uNom: [number, number, number] = [0.5, 0.0, 0.0];

    const constraint: RecoveryConstraint = {
      id: "approaching-wall",
      hValue: 0.08, // Close to boundary
      gradient: [-1, 0, 0], // Inward normal
      gamma: 5.0,
    };
    // Constraint LHS: dot([-1, 0, 0], [0.5, 0, 0]) + 5.0 * 0.08 = -0.5 + 0.4 = -0.1 < 0 (violation = 0.1 <= maxSlack 0.2)

    const res = manager.filterOrRecover(uNom, pos, vel, [constraint]);
    expect(res.state).toBe("relaxed-slack");
    expect(res.maxViolationSlack).toBeCloseTo(0.1, 4);
    // Control should be projected to satisfy constraint: vx -> 0.5 + (-1) * 0.1 / 1.0 = 0.4
    expect(res.safeControl[0]).toBeCloseTo(0.4, 4);
  });

  test("triggers Tier 2 reflex-braking when constraint violation exceeds max slack", () => {
    const manager = new SafetyFilterRecoveryManager({ maxSlack: 0.1 });
    const pos: [number, number, number] = [0, 0, 0];
    const vel: [number, number, number] = [0.8, 0.0, 0.0]; // High forward speed
    const uNom: [number, number, number] = [1.0, 0.0, 0.0];

    const constraint: RecoveryConstraint = {
      id: "urgent-wall",
      hValue: 0.01,
      gradient: [-1, 0, 0],
      gamma: 5.0,
    };
    // LHS = -1.0 + 0.05 = -0.95 (violation = 0.95 > maxSlack 0.1)

    const res = manager.filterOrRecover(uNom, pos, vel, [constraint]);
    expect(res.state).toBe("reflex-braking");
    // Safe control must brake the +X velocity: safeVx < 0
    expect(res.safeControl[0]).toBeLessThan(0.0);
  });

  test("transitions to Tier 3 recent-safe retreat upon sustained stalls", () => {
    const manager = new SafetyFilterRecoveryManager({ stallLimitFrames: 3, maxSlack: 0.5 });

    // Record initial safe location at x = -2.0
    manager.recordSafeState([-2.0, 0, 0], [0, 0, 0], 0.25, 0.0);

    const pos: [number, number, number] = [0, 0, 0];
    const vel: [number, number, number] = [0, 0, 0];
    const uNom: [number, number, number] = [0.4, 0.0, 0.0];

    const trappedConstraint: RecoveryConstraint = {
      id: "corner-trap",
      hValue: 0.05,
      gradient: [-1, 0, 0],
      gamma: 5.0,
    };

    // Frame 1, 2, 3: relaxed slack
    for (let f = 0; f < 3; f++) {
      const res = manager.filterOrRecover(uNom, pos, vel, [trappedConstraint]);
      expect(res.state).toBe("relaxed-slack");
    }

    // Frame 4: Stall limit reached -> retreat to safe waypoint at x = -2.0
    const retreatRes = manager.filterOrRecover(uNom, pos, vel, [trappedConstraint]);
    expect(retreatRes.state).toBe("recent-safe-retreat");
    // Direction towards [-2, 0, 0] from [0, 0, 0] is negative X
    expect(retreatRes.safeControl[0]).toBeLessThan(-0.2);
  });
});
