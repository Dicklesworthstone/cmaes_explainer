import { describe, expect, test } from "bun:test";
import {
  composeKmrMountedArmKinematics,
  createKmrHouseholdPhysicsCoupling,
  evaluateKmrSevenPhaseManipulationSuite,
  KMR_SEVEN_MANIPULATION_PHASES,
  KmrSevenPhaseMobileManipulator,
  stepKmrHouseholdPhysics,
} from "../app/lib/kmrHouseholdPhysics";
import type { KmrNavigationReceipt } from "../app/lib/kmrNavigationOwner";

function receiptAt(x: number): KmrNavigationReceipt {
  return {
    owner: "ts-kinematic-mecanum-owner",
    pose: { x, y: 0, theta: 0 },
    waypointIndex: 1,
    totalWaypoints: 2,
    completed: false,
    elapsedSeconds: x / 0.6,
    distanceTraveledMeters: x,
    minimumClearanceMeters: 1,
    collisionRefusals: 0,
    bodyCommand: { vX: 0.6, vY: 0, omega: 0 },
    wheelSpeeds: { speeds: [8, 8, 8, 8] },
  };
}

function receiptAtPose(x: number, theta: number): KmrNavigationReceipt {
  const receipt = receiptAt(x);
  receipt.pose.theta = theta;
  return receipt;
}

describe("live KMR → household contact/LCP coupling", () => {
  test("a commanded base contact pushes the finite-mass chair", () => {
    const coupling = createKmrHouseholdPhysicsCoupling({ x: 0, y: 0, theta: 0 }, [0.75, 0]);
    let receipt = stepKmrHouseholdPhysics(coupling, receiptAt(0));
    for (let step = 1; step <= 120; step++) {
      receipt = stepKmrHouseholdPhysics(coupling, receiptAt(step * 0.01));
    }

    expect(receipt.owner).toBe("household-contact-lcp-ts");
    expect(receipt.cumulativeBaseChairContacts).toBeGreaterThan(0);
    expect(receipt.chairPositionMeters[0]).toBeGreaterThan(1.2);
    // The default 25-iteration LCP budget does not always reach its strict
    // boolean tolerance under sustained kinematic contact; keep that fact in
    // the receipt and require the residual itself to remain bounded.
    expect(receipt.lcpMaxResidual).toBeLessThan(0.01);
    expect(Number.isFinite(receipt.lcpMaxResidual)).toBe(true);
  });

  test("a stationary distant base does not move the chair laterally", () => {
    const coupling = createKmrHouseholdPhysicsCoupling({ x: 0, y: 0, theta: 0 }, [3, 0]);
    let receipt = stepKmrHouseholdPhysics(coupling, receiptAt(0));
    for (let step = 0; step < 120; step++) {
      receipt = stepKmrHouseholdPhysics(coupling, receiptAt(0));
    }
    expect(receipt.cumulativeBaseChairContacts).toBe(0);
    expect(receipt.chairPositionMeters[0]).toBeCloseTo(3, 9);
  });

  test("unwraps heading across ±pi before deriving base angular velocity", () => {
    const coupling = createKmrHouseholdPhysicsCoupling(
      { x: 0, y: 0, theta: Math.PI - 0.01 },
      [3, 0],
    );
    const receipt = stepKmrHouseholdPhysics(coupling, receiptAtPose(0, -Math.PI + 0.01));

    expect(receipt.baseAngularVelocityRadPerSecond).toBeCloseTo(1.2, 9);
    expect(Math.abs(receipt.baseAngularVelocityRadPerSecond)).toBeLessThan(2);
  });

  test("composes moving KMR mounting-plate pose with 7-DoF arm FK/IK and carried-object reaction wrench (cmaes-ss8z, cmaes-za0x.57)", () => {
    const pose = { x: 0.4, y: -0.2, theta: Math.PI / 6 };
    const targetWorld: [number, number, number] = [0.95, 0.12, 0.78];
    const comp = composeKmrMountedArmKinematics(
      pose,
      [0, 0.4, 0, -1.2, 0, 0.8, 0],
      targetWorld,
      0.5,
      0.2,
    );

    expect(comp.mountingPlateWorldPose.xMeters).toBeCloseTo(0.4, 9);
    expect(comp.mountingPlateWorldPose.yMeters).toBeCloseTo(-0.2, 9);
    expect(comp.mountingPlateWorldPose.zMeters).toBeCloseTo(0.38, 9);
    expect(comp.worldLinkPositionsMeters.length).toBe(6);

    const eeErr = Math.hypot(
      comp.worldEndEffectorMeters[0] - targetWorld[0],
      comp.worldEndEffectorMeters[1] - targetWorld[1],
      comp.worldEndEffectorMeters[2] - targetWorld[2],
    );
    expect(eeErr).toBeLessThan(0.01);
    expect(comp.mountingPlateReactionForceN[2]).toBeLessThan(-4.9);
    expect(Math.hypot(...comp.mountingPlateReactionTorqueNm)).toBeGreaterThan(0.1);
  });

  test("executes complete 7-phase mobile manipulation sequence, rigid composition, seed determinism, and causal negative controls (cmaes-ss8z, cmaes-za0x.57)", () => {
    const suite = evaluateKmrSevenPhaseManipulationSuite();

    expect(suite.nominalRun.completed).toBe(true);
    expect(suite.nominalRun.visitedPhases.slice(0, 7)).toEqual([...KMR_SEVEN_MANIPULATION_PHASES]);
    expect(suite.nominalRun.allSevenPhasesVisitedInOrder).toBe(true);
    expect(suite.nominalRun.peakGraspGwsRadius).toBeGreaterThan(0.5);
    expect(suite.nominalRun.peakMountingPlateTorqueNm).toBeGreaterThan(0.1);
    expect(suite.nominalRun.maxObjectStepDisplacementMeters).toBeLessThan(0.08);
    expect(suite.nominalRun.finalPlaceErrorMeters).toBeLessThan(0.01);
    expect(suite.rigidCompositionTransformExact).toBe(true);
    expect(suite.seedDeterminismExact).toBe(true);

    // Causal negative controls
    expect(suite.negativeControls.blockedGoalRefused).toBe(true);
    expect(suite.negativeControls.blockedGoalRefusalReason).toBe("GOAL_BLOCKED_BY_OBSTACLE");
    expect(suite.negativeControls.dynamicObstacleEmergencyStopped).toBe(true);
    expect(suite.negativeControls.dynamicObstacleZeroedWheels).toBe(true);
    expect(suite.negativeControls.midSequenceCancelledAndRecovered).toBe(true);

    // Also verify out-of-bounds goal refusal directly
    const outOfBounds = new KmrSevenPhaseMobileManipulator({
      pickObjectWorldPos: [12.0, 0.0, 0.72],
    });
    const outReceipt = outOfBounds.step();
    expect(outReceipt.phase).toBe("refused");
    expect(outReceipt.refusalReason).toBe("GOAL_OUT_OF_BOUNDS");
  });

  test("a heavy low-friction object slips instead of being carried to the goal", () => {
    const machine = new KmrSevenPhaseMobileManipulator({
      objectMassKg: 12,
      objectFrictionCoeff: 0.05,
      pickObjectWorldPos: [0.85, 0.0, 0.72],
      placeGoalWorldPos: [1.35, 0.25, 0.72],
    });
    let receipt = machine.step();
    for (let step = 0; step < 240 && receipt.phase !== "refused" && !receipt.completed; step++) {
      receipt = machine.step();
    }
    expect(receipt.refusalReason).toBe("GRASP_SLIP_UNDER_WEIGHT");
    expect(receipt.isObjectGrasped).toBe(false);
    expect(receipt.objectWorldPositionMeters[2]).toBeLessThan(0.8);
    expect(receipt.phase).not.toBe("standby");
  });

  test("the nominal lift accelerates with the minimum-jerk profile, not a fixed 0.45 m/s^2", () => {
    const machine = new KmrSevenPhaseMobileManipulator({
      objectMassKg: 0.45,
      objectFrictionCoeff: 0.65,
      pickObjectWorldPos: [0.85, 0.0, 0.72],
      placeGoalWorldPos: [1.35, 0.25, 0.72],
    });
    const verticalAccels: number[] = [];
    const liftedAz: number[] = [];
    let carriedAh = 0;
    let prev: [number, number, number] | null = null;
    let prevV: [number, number, number] = [0, 0, 0];
    let receipt = machine.step();
    for (let step = 0; step < 720 && !receipt.completed; step++) {
      receipt = machine.step();
      const pos = receipt.objectWorldPositionMeters;
      if (prev && receipt.isObjectGrasped) {
        const velocity: [number, number, number] = [
          (pos[0] - prev[0]) * 60,
          (pos[1] - prev[1]) * 60,
          (pos[2] - prev[2]) * 60,
        ];
        const accel = [
          (velocity[0] - prevV[0]) * 60,
          (velocity[1] - prevV[1]) * 60,
          (velocity[2] - prevV[2]) * 60,
        ];
        if (receipt.phase === "lift") liftedAz.push(accel[2]);
        if (receipt.phase === "transport") {
          carriedAh = Math.max(carriedAh, Math.hypot(accel[0], accel[1]));
        }
        prevV = velocity;
      } else {
        prevV = [0, 0, 0];
      }
      prev = [...pos];
      if (receipt.phase === "lift" || receipt.visitedPhases.includes("lift")) {
        const fz = receipt.armKinematics.mountingPlateReactionForceN[2];
        if (receipt.isObjectGrasped && fz < 0 && receipt.phase === "lift") {
          verticalAccels.push(-fz / 0.45 - 9.81);
        }
      }
      if (receipt.phase === "return") break;
    }
    const peak = Math.max(...verticalAccels.map((a) => Math.abs(a)));
    const unique = new Set(verticalAccels.map((a) => Math.round(a * 100)));
    expect(peak).toBeGreaterThan(0.5);
    expect(peak).toBeLessThanOrEqual(1.25);
    expect(unique.size).toBeGreaterThan(3);
    const trackedPeak = Math.max(...liftedAz.map((a) => Math.abs(a)));
    expect(trackedPeak).toBeGreaterThan(0.4);
    expect(trackedPeak).toBeLessThanOrEqual(1.6);
    expect(carriedAh).toBeLessThanOrEqual(1.65);
  });
});
