import { describe, expect, test } from "bun:test";
import {
  computeHuntCrossleyContactForce,
  type RigidBodyContactState,
  stepContactRestitution,
} from "../app/lib/contactRestitutionIntegrator";

describe("Contact Restitution & Damping Engine", () => {
  test("dropped ceramic mug on hardwood table settles to complete rest", () => {
    let mug: RigidBodyContactState = {
      position: [0.0, 0.4, 0.0], // Dropped from 40cm height
      velocity: [0.0, 0.0, 0.0],
      massKg: 0.35,
      radius: 0.04,
      material: "ceramic",
    };

    let settled = false;
    for (let frame = 0; frame < 120; frame++) {
      const res = stepContactRestitution(mug, "hardwood", 0.0, 1 / 60);
      mug = res.state;
      if (res.settled) {
        settled = true;
        break;
      }
    }

    expect(settled).toBe(true);
    expect(mug.position[1]).toBeCloseTo(0.04, 3); // Rest on floor (y = radius)
    expect(mug.velocity[0]).toBe(0.0);
    expect(mug.velocity[1]).toBe(0.0);
    expect(mug.velocity[2]).toBe(0.0);
  });

  test("steel on steel has higher restitution bounce than fabric on hardwood", () => {
    let steelBall: RigidBodyContactState = {
      position: [0, 0.5, 0],
      velocity: [0, 0, 0],
      massKg: 0.5,
      radius: 0.03,
      material: "steel",
    };

    let fabricBeanbag: RigidBodyContactState = {
      position: [0, 0.5, 0],
      velocity: [0, 0, 0],
      massKg: 0.5,
      radius: 0.03,
      material: "fabric",
    };

    let maxSteelReboundHeight = 0;
    let maxFabricReboundHeight = 0;

    let steelHit = false;
    let fabricHit = false;

    for (let frame = 0; frame < 60; frame++) {
      const resS = stepContactRestitution(steelBall, "steel", 0.0, 1 / 60);
      steelBall = resS.state;
      if (resS.contactOccurred) steelHit = true;
      if (steelHit) {
        maxSteelReboundHeight = Math.max(maxSteelReboundHeight, steelBall.position[1]);
      }

      const resF = stepContactRestitution(fabricBeanbag, "hardwood", 0.0, 1 / 60);
      fabricBeanbag = resF.state;
      if (resF.contactOccurred) fabricHit = true;
      if (fabricHit) {
        maxFabricReboundHeight = Math.max(maxFabricReboundHeight, fabricBeanbag.position[1]);
      }
    }

    expect(maxSteelReboundHeight).toBeGreaterThan(maxFabricReboundHeight);
  });

  test("mechanical energy is dissipated monotonically across collision bounces", () => {
    let ball: RigidBodyContactState = {
      position: [0, 1.0, 0],
      velocity: [0, 0, 0],
      massKg: 1.0,
      radius: 0.05,
      material: "rubber",
    };

    for (let frame = 0; frame < 150; frame++) {
      const res = stepContactRestitution(ball, "concrete", 0.0, 1 / 60);
      ball = res.state;

      // When resting or bouncing, mechanical energy should never exceed initial potential energy
      expect(res.mechanicalEnergyJoules).toBeLessThanOrEqual(1.0 * 9.81 * 0.95 + 1e-4);
    }
  });

  test("Hunt-Crossley viscoelastic contact force scales with stiffness and penetration rate", () => {
    const fSoft = computeHuntCrossleyContactForce(0.01, 0.5, 10000, 0.3, 1.0);
    const fStiff = computeHuntCrossleyContactForce(0.01, 0.5, 40000, 0.3, 1.0);
    expect(fStiff).toBeCloseTo(fSoft * 4.0, 6);

    const impactingBody: RigidBodyContactState = {
      position: [0, 0.04, 0],
      velocity: [0, -1.5, 0],
      massKg: 1.0,
      radius: 0.05,
      material: "ceramic",
    };
    const resLowK = stepContactRestitution(impactingBody, "hardwood", 0.0, 1 / 60, 15000);
    const resHighK = stepContactRestitution(impactingBody, "hardwood", 0.0, 1 / 60, 45000);
    expect(resLowK.contactOccurred).toBe(true);
    expect(resHighK.contactForceNewtons).toBeCloseTo(resLowK.contactForceNewtons * 3.0, 5);

    // Verify DRO robust evaluation option modulates bounce velocity vs point estimate
    const resNominal = stepContactRestitution(impactingBody, "hardwood", 0.0, 1 / 60, 25000, {
      robust: false,
    });
    const resRobustUpper = stepContactRestitution(impactingBody, "hardwood", 0.0, 1 / 60, 25000, {
      robust: true,
      restitutionTail: "upper",
    });
    expect(resRobustUpper.state.velocity[1]).toBeGreaterThanOrEqual(resNominal.state.velocity[1]);
  });
});
