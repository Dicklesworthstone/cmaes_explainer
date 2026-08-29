import { describe, expect, test } from "bun:test";
import {
  type RollingBody,
  stepRollingCylinder,
  stepRollingSphere,
} from "../app/lib/rollingContactDynamics";

describe("Rolling Contact & Limit Surface Friction Engine", () => {
  test("maintains pure rolling kinematics without slipping", () => {
    const R = 0.2;
    const body: RollingBody = {
      id: "sphere1",
      type: "sphere",
      position: [0, R, 0],
      velocity: [1.0, 0, 0], // Forward along +X at 1.0 m/s
      angularVelocity: [0, 0, -1.0 / R], // Angular velocity matching rolling: \omega_z = -v / R = -5 rad/s
      mass: 5.0,
      radius: R,
      muSliding: 0.5,
      muSpinning: 0.1,
      muRolling: 0.001,
      restitution: 0.2,
    };

    const res = stepRollingSphere(body, 0.0, 0.016);
    expect(res.hasContact).toBe(true);
    expect(res.isPureRolling).toBe(true);
    expect(res.slipSpeed).toBeCloseTo(0.0, 3);
  });

  test("slip-to-roll transition converges to no-slip condition", () => {
    const R = 0.15;
    const body: RollingBody = {
      id: "bowling_ball",
      type: "sphere",
      position: [0, R, 0],
      velocity: [3.0, 0, 0], // Fast sliding forward
      angularVelocity: [0, 0, 0], // No initial spin
      mass: 6.0,
      radius: R,
      muSliding: 0.4,
      muSpinning: 0.1,
      muRolling: 0.002,
      restitution: 0.1,
    };

    // Step simulation for 1 second (60 steps)
    for (let step = 0; step < 60; step++) {
      stepRollingSphere(body, 0.0, 0.016);
    }

    // Kinematic rolling condition: v_x + \omega_z * R \approx 0
    const slip = body.velocity[0] + body.angularVelocity[2] * R;
    expect(Math.abs(slip)).toBeLessThan(0.05);
    expect(body.velocity[0]).toBeGreaterThan(1.0); // Retains forward momentum
    expect(body.angularVelocity[2]).toBeLessThan(-5.0); // Has spun up
  });

  test("Contensou spinning friction dissipates vertical spin", () => {
    const body: RollingBody = {
      id: "spinning_top",
      type: "sphere",
      position: [0, 0.1, 0],
      velocity: [0, 0, 0],
      angularVelocity: [0, 20.0, 0], // 20 rad/s spin around Y
      mass: 1.0,
      radius: 0.1,
      muSliding: 0.3,
      muSpinning: 0.15,
      muRolling: 0.001,
      restitution: 0.2,
    };

    for (let step = 0; step < 100; step++) {
      stepRollingSphere(body, 0.0, 0.016);
    }

    expect(Math.abs(body.angularVelocity[1])).toBeLessThan(5.0); // Spin dissipated
  });

  test("stepRollingCylinder rolls wheels and stools forward", () => {
    const body: RollingBody = {
      id: "wheel",
      type: "cylinder",
      position: [0, 0.25, 0],
      velocity: [1.5, 0, 0],
      angularVelocity: [0, 0, 0],
      mass: 4.0,
      radius: 0.25,
      height: 0.1,
      muSliding: 0.5,
      muSpinning: 0.1,
      muRolling: 0.001,
      restitution: 0.1,
    };

    for (let step = 0; step < 50; step++) {
      stepRollingCylinder(body, 0.0, 0.016);
    }

    const slip = body.velocity[0] + body.angularVelocity[2] * body.radius;
    expect(Math.abs(slip)).toBeLessThan(0.05);
  });
});
