import { describe, expect, test } from "bun:test";
import { createSceneFromHouseFurniture } from "../../app/lib/houseMultiObstacleKernel";
import { CRAFTSMAN_BUNGALOW_1928 } from "../../app/lib/houseScenes";
import {
  clampSphereAgainstHouse,
  clampSphereAgainstLinks,
  computeImpulseResponse,
  G1_BODY_LINK_RADIUS_METERS,
  G1_INTERACTIVE_PINS,
  G1_KINEMATICS,
  limbPinRestPosition,
  solveFullBodyG1IK,
  solveTwoBoneIK,
} from "../../app/lib/humanoidRagdollIk";

describe("Multi-Limb Inverse Kinematics & Collision Ragdoll Suite", () => {
  test("two-bone IK reaches exact target when within range", () => {
    const root: [number, number, number] = [0, 0.75, 0];
    const target: [number, number, number] = [0, 0.2, 0];
    const upper = 0.32;
    const lower = 0.3;
    const pole: [number, number, number] = [1, 0, 0];

    const result = solveTwoBoneIK(root, target, upper, lower, pole);
    expect(result.reachedTarget[0]).toBeCloseTo(target[0], 3);
    expect(result.reachedTarget[1]).toBeCloseTo(target[1], 3);
    expect(result.reachedTarget[2]).toBeCloseTo(target[2], 3);

    // Mid joint must bend in the positive pole vector direction (X > 0)
    expect(result.midPosition[0]).toBeGreaterThan(0);
  });

  test("two-bone IK clamps gracefully when target exceeds maximum reach", () => {
    const root: [number, number, number] = [0, 0, 0];
    const target: [number, number, number] = [0, 2.0, 0]; // 2.0m exceeds upper+lower (0.62m)
    const upper = 0.32;
    const lower = 0.3;

    const result = solveTwoBoneIK(root, target, upper, lower, [1, 0, 0]);
    const maxReach = upper + lower - 0.001;
    expect(result.reachedTarget[1]).toBeCloseTo(maxReach, 2);
  });

  test("whole-body G1 collision clamping prevents wall and furniture penetration", () => {
    const scene = createSceneFromHouseFurniture(CRAFTSMAN_BUNGALOW_1928.furniture);
    const nominalPelvis: [number, number, number] = [0, 0.75, 0];

    // Attempt to drag left hand into a wall/obstacle
    const result = solveFullBodyG1IK(
      {
        leftHand: [-3.8, 1.0, 0], // Outside west wall bounds!
      },
      nominalPelvis,
      scene.obstacles,
    );

    expect(result.leftHandPosition[0]).toBeGreaterThan(-3.7);
    expect(result.minClearance).toBeGreaterThanOrEqual(0);
  });

  test("impulse dynamics computes linear inverted pendulum capture point step", () => {
    const impulse = computeImpulseResponse(20.0, 0.0, 35.0); // 20 N*s forward impulse
    expect(impulse.deltaV[0]).toBeCloseTo(20.0 / 35.0, 3);
    expect(impulse.recoveryStepOffset[0]).toBeGreaterThan(0.1); // robot must step forward >10cm
    expect(impulse.recoveryStepOffset[2]).toBeCloseTo(0, 3);
  });

  test("interactive limb pin definitions exist for all 6 key extremities", () => {
    expect(G1_INTERACTIVE_PINS.length).toBe(6);
    const ids = G1_INTERACTIVE_PINS.map((p) => p.id);
    expect(ids).toContain("head");
    expect(ids).toContain("pelvis");
    expect(ids).toContain("leftHand");
    expect(ids).toContain("rightHand");
    expect(ids).toContain("leftFoot");
    expect(ids).toContain("rightFoot");
  });
});

describe("clampSphereAgainstHouse — yawed OBB regression (cmaes-pvz followup)", () => {
  test("a sphere inside a yawed chair must be projected out, not left inside", () => {
    // The user reported the G1 colliding with furniture when the chair is
    // yawed. The previous radial-from-center projection in
    // clampSphereAgainstHouse left the sphere inside. This test pins the
    // corrected behavior: the kernel's projectPointOutOfOBB (SDF gradient)
    // is used and the Y coordinate is updated when the OBB pushes the
    // sphere up.
    const yawedChair = {
      id: "yawed-chair",
      name: "yawed-chair",
      center: [1, 0.475, 1.6] as [number, number, number],
      halfExtents: [0.225, 0.475, 0.25] as [number, number, number],
      rotationYawRad: Math.PI, // 180-degree yaw
    };
    const sphere: [number, number, number] = [1.01, 0.85, 1.6];
    const radius = 0.06;
    const { clamped, contact } = clampSphereAgainstHouse(sphere, radius, [yawedChair], 0.0);
    expect(contact).not.toBeNull();
    expect(contact?.obstacleName).toBe("yawed-chair");
    // After projection, the sphere must clear the chair by the radius.
    const { distanceToOBB } = require("../../app/lib/houseMultiObstacleKernel");
    expect(distanceToOBB(clamped, yawedChair)).toBeGreaterThanOrEqual(radius - 1e-6);
    // The Y coordinate must have been updated (the chair is tall enough
    // to push the sphere above the original Y).
    expect(clamped[1]).toBeGreaterThan(sphere[1]);
  });

  test("detects Hardwood Floor contact when sphere penetrates below floorY + radius and remains contact-free when tangent", () => {
    const sunken = clampSphereAgainstHouse([0, 0.02, 0], 0.08, [], 0.0);
    expect(sunken.clamped[1]).toBeCloseTo(0.08, 6);
    expect(sunken.contact).not.toBeNull();
    expect(sunken.contact?.obstacleName).toBe("Hardwood Floor");
    expect(sunken.contact?.penetration).toBeCloseTo(0.06, 6);

    const tangent = clampSphereAgainstHouse([0, 0.08, 0], 0.08, [], 0.0);
    expect(tangent.clamped[1]).toBeCloseTo(0.08, 6);
    expect(tangent.contact).toBeNull();
  });

  test("solveFullBodyG1IK computes surface-to-OBB minClearance subtracting body sphere radii and remains collision-free in open space", () => {
    const wallBox = {
      id: "near-pillar",
      name: "near-pillar",
      center: [1.0, 0.75, 0] as [number, number, number],
      halfExtents: [0.2, 0.75, 0.2] as [number, number, number],
      rotationYawRad: 0,
    };
    const res = solveFullBodyG1IK({}, [0, 0.75, 0], [wallBox]);
    expect(res.isColliding).toBe(false);
    // Distance from pelvis center (x=0) to pillar surface (x=0.8) is 0.8m;
    // with hands/elbows reaching forward and sphere radii subtracted, minClearance must be < 0.8 - limbRadius
    expect(res.minClearance).toBeGreaterThan(0);
    expect(res.minClearance).toBeLessThan(0.8 - G1_KINEMATICS.limbRadius);
  });

  test("clampSphereAgainstHouse reports an outward unit normal and contact point on the OBB face", () => {
    const box = {
      id: "test-box",
      name: "test-box",
      center: [0, 0.5, 0] as [number, number, number],
      halfExtents: [0.5, 0.5, 0.5] as [number, number, number],
      rotationYawRad: 0,
    };
    // Sphere of radius 0.1 at x=0.55 penetrates the +X face (x=0.5) by 0.05m
    const { clamped, contact } = clampSphereAgainstHouse([0.55, 0.5, 0], 0.1, [box], 0.0);
    expect(clamped[0]).toBeCloseTo(0.6, 6);
    expect(contact).not.toBeNull();
    // Normal must point OUTWARD (+X), not inward (-X)
    expect(contact!.normal[0]).toBeCloseTo(1.0, 6);
    expect(contact!.normal[1]).toBeCloseTo(0.0, 6);
    expect(contact!.normal[2]).toBeCloseTo(0.0, 6);
    // Contact point must sit on the +X face of the box (x=0.5)
    expect(contact!.point[0]).toBeCloseTo(0.5, 6);
    expect(contact!.point[1]).toBeCloseTo(0.5, 6);
    expect(contact!.point[2]).toBeCloseTo(0.0, 6);
  });

  test("solveTwoBoneIK preserves bone lengths when poleVector is collinear with vertical target or root equals target", () => {
    const upper = 0.32;
    const lower = 0.3;
    // Target straight down along -Y with poleVector also along +Y (collinear!)
    const vertical = solveTwoBoneIK([0, 0.75, 0], [0, 0.25, 0], upper, lower, [0, 1, 0]);
    const dUpper = Math.hypot(
      vertical.midPosition[0],
      vertical.midPosition[1] - 0.75,
      vertical.midPosition[2],
    );
    const dLower = Math.hypot(
      vertical.reachedTarget[0] - vertical.midPosition[0],
      vertical.reachedTarget[1] - vertical.midPosition[1],
      vertical.reachedTarget[2] - vertical.midPosition[2],
    );
    expect(dUpper).toBeCloseTo(upper, 5);
    expect(dLower).toBeCloseTo(lower, 5);

    // Coincident root and target
    const coincident = solveTwoBoneIK([0, 0.75, 0], [0, 0.75, 0], upper, lower, [1, 0, 0]);
    const cUpper = Math.hypot(
      coincident.midPosition[0],
      coincident.midPosition[1] - 0.75,
      coincident.midPosition[2],
    );
    expect(cUpper).toBeCloseTo(upper, 5);
  });
});

describe("interactive pins never overlap the humanoid (sphere-inside-robot regression)", () => {
  const heading: [number, number] = [1, 0];
  const links: [number, number, number][] = [
    [0, 0.77, 0],
    [0, 1.0, 0],
    [0, 0.45, 0.1],
    [0, 0.45, -0.1],
    [0.02, 0.05, 0.1],
    [0.02, 0.05, -0.1],
  ];

  test("every rest standoff places the pin at least one link radius plus one pin radius from every link", () => {
    for (const pin of G1_INTERACTIVE_PINS) {
      const anchor = links[0];
      const rest = limbPinRestPosition(anchor, heading, pin.standoff);
      const { clamped, overlapped } = clampSphereAgainstLinks(
        rest,
        pin.radius,
        links,
        G1_BODY_LINK_RADIUS_METERS,
      );
      for (const link of links) {
        const d = Math.hypot(clamped[0] - link[0], clamped[1] - link[1], clamped[2] - link[2]);
        expect(d, `${pin.id} vs link ${JSON.stringify(link)}`).toBeGreaterThanOrEqual(
          pin.radius + G1_BODY_LINK_RADIUS_METERS,
        );
      }
      // Standoffs are authored so that the pelvis-anchored rest pose is already
      // clear; only the lateral hand pins need a nudge from the clamp.
      if (pin.id === "pelvis" || pin.id === "head") expect(overlapped).toBe(false);
    }
  });

  test("a pin dragged into the torso is pushed back out along the shortest exit", () => {
    const inside: [number, number, number] = [0.02, 0.8, 0.01];
    const { clamped, overlapped } = clampSphereAgainstLinks(
      inside,
      0.05,
      links,
      G1_BODY_LINK_RADIUS_METERS,
    );
    expect(overlapped).toBe(true);
    for (const link of links) {
      const d = Math.hypot(clamped[0] - link[0], clamped[1] - link[1], clamped[2] - link[2]);
      expect(d).toBeGreaterThanOrEqual(0.05 + G1_BODY_LINK_RADIUS_METERS);
    }
  });

  test("heading-frame standoff rotates with the robot", () => {
    const behind = limbPinRestPosition([0, 0.77, 0], [0, 1], [-0.3, 0, 0]);
    expect(behind[0]).toBeCloseTo(0, 6);
    expect(behind[2]).toBeCloseTo(-0.3, 6);
    const left = limbPinRestPosition([0, 0.77, 0], [1, 0], [0, 0, 0.2]);
    // Lateral-left of +X heading in a Y-up right-handed frame is -Z.
    expect(left[2]).toBeCloseTo(-0.2, 6);
  });

  test("solveFullBodyG1IK reports selfCollision free in nominal pose and detects self-collision when limbs cross into torso", () => {
    const nominal = solveFullBodyG1IK({}, [0, 0.75, 0], []);
    expect(nominal.selfCollision.hasCollision).toBe(false);
    expect(nominal.selfCollision.minClearance).toBeGreaterThan(0.005);

    const crossed = solveFullBodyG1IK(
      {
        leftHand: [0.0, 0.92, 0.0], // Pushed directly inside torso centerline
      },
      [0, 0.75, 0],
      [],
    );
    expect(crossed.selfCollision.hasCollision).toBe(true);
    expect(crossed.selfCollision.collidingPairs.length).toBeGreaterThan(0);
  });

  test("evaluateG1DifferentiableSdfAndImpulseDiagnostics evaluates capture-point stepping, G1 capsules, differentiable scene SDF Hessian, and sphere-traced raymarching", async () => {
    const { evaluateG1DifferentiableSdfAndImpulseDiagnostics } = await import(
      "../../app/components/G1PhysicsDebugOverlay"
    );
    const diag = evaluateG1DifferentiableSdfAndImpulseDiagnostics([0, 0.75, 0], [], 18.0, 0.0);

    expect(diag.impulseDeltaV[0]).toBeGreaterThan(0);
    expect(diag.capturePointRecoveryStepOffset[0]).toBeGreaterThan(0);
    expect(diag.capsuleCount).toBe(11);
    expect(diag.diffSceneDistance).toBeCloseTo(0.75, 4);
    expect(Number.isFinite(diag.hessianTrace)).toBe(true);
    expect(diag.raymarchHit).toBe(true);
    expect(diag.raymarchDistance).toBeCloseTo(0.75, 3);
    expect(diag.smoothOpsCheck.sminPolyVal).toBeLessThanOrEqual(0.25);
    expect(diag.smoothOpsCheck.smaxPolyVal).toBeGreaterThanOrEqual(0.3);
  });
});
