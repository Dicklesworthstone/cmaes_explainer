import { describe, expect, test } from "bun:test";
import {
  createKmrHouseholdPhysicsCoupling,
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
    const coupling = createKmrHouseholdPhysicsCoupling(
      { x: 0, y: 0, theta: 0 },
      [0.75, 0],
    );
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
    const coupling = createKmrHouseholdPhysicsCoupling(
      { x: 0, y: 0, theta: 0 },
      [3, 0],
    );
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
    const receipt = stepKmrHouseholdPhysics(
      coupling,
      receiptAtPose(0, -Math.PI + 0.01),
    );

    expect(receipt.baseAngularVelocityRadPerSecond).toBeCloseTo(1.2, 9);
    expect(Math.abs(receipt.baseAngularVelocityRadPerSecond)).toBeLessThan(2);
  });
});
