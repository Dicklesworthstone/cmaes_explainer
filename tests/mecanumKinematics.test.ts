import { describe, expect, test } from "bun:test";
import {
  applyMecanumLimits,
  forwardMecanum,
  inverseMecanum,
  KUKA_KMR_IIWA_LIMITS,
  type MecanumCommand,
} from "../app/lib/mecanumKinematics";
import { KUKA_KMR_IIWA_PUBLIC_SPEC } from "../app/lib/kmrGeometry";

const cfg = KUKA_KMR_IIWA_PUBLIC_SPEC;
const r = cfg.wheelDiameterMeters / 2.0;
const a = cfg.wheelbaseXMeters / 2.0;
const b = cfg.wheelbaseYMeters / 2.0;

describe("Mecanum inverse kinematics (KMR iiwa)", () => {
  test("forward-only motion (v_x > 0) gives the standard forward pattern", () => {
    // For pure forward (v_x = 1, v_y = 0, omega = 0):
    //   omega_FL = v_x / r
    //   omega_FR = v_x / r
    //   omega_RL = v_x / r
    //   omega_RR = v_x / r
    // All four wheels spin the same way.
    const cmd: MecanumCommand = { vX: 1.0, vY: 0, omega: 0 };
    const out = inverseMecanum(cmd, cfg);
    expect(out.speeds[0]).toBeCloseTo(1.0 / r, 12);
    expect(out.speeds[1]).toBeCloseTo(1.0 / r, 12);
    expect(out.speeds[2]).toBeCloseTo(1.0 / r, 12);
    expect(out.speeds[3]).toBeCloseTo(1.0 / r, 12);
  });

  test("lateral-only motion (v_y > 0) gives the lateral pattern", () => {
    // For pure left (v_x = 0, v_y = 1, omega = 0):
    //   omega_FL = -v_y / r   (CCW)
    //   omega_FR = +v_y / r   (CW)
    //   omega_RL = +v_y / r   (CW)
    //   omega_RR = -v_y / r   (CCW)
    // FL and RR spin one way, FR and RL spin the other.
    const cmd: MecanumCommand = { vX: 0, vY: 1.0, omega: 0 };
    const out = inverseMecanum(cmd, cfg);
    expect(out.speeds[0]).toBeCloseTo(-1.0 / r, 12);
    expect(out.speeds[1]).toBeCloseTo(1.0 / r, 12);
    expect(out.speeds[2]).toBeCloseTo(1.0 / r, 12);
    expect(out.speeds[3]).toBeCloseTo(-1.0 / r, 12);
  });

  test("spin-in-place (omega > 0) gives the spin pattern", () => {
    // For pure CCW spin (v_x = 0, v_y = 0, omega = 1):
    //   omega_FL = -omega * (a + b) / r
    //   omega_FR = +omega * (a + b) / r
    //   omega_RL = -omega * (a + b) / r
    //   omega_RR = +omega * (a + b) / r
    // FL and RL spin one way, FR and RR spin the other.
    const cmd: MecanumCommand = { vX: 0, vY: 0, omega: 1.0 };
    const out = inverseMecanum(cmd, cfg);
    const s = (a + b) / r;
    expect(out.speeds[0]).toBeCloseTo(-s, 12);
    expect(out.speeds[1]).toBeCloseTo(s, 12);
    expect(out.speeds[2]).toBeCloseTo(-s, 12);
    expect(out.speeds[3]).toBeCloseTo(s, 12);
  });

  test("combined motion is the linear combination", () => {
    // IK is linear, so inverse(v_x + v_y + omega) = inverse(v_x) +
    // inverse(v_y) + inverse(omega). The wheel-speed superposition is
    // exact.
    const a0: MecanumCommand = { vX: 0.5, vY: 0, omega: 0 };
    const a1: MecanumCommand = { vX: 0, vY: 0.3, omega: 0 };
    const a2: MecanumCommand = { vX: 0, vY: 0, omega: 0.4 };
    const sum: MecanumCommand = { vX: 0.5, vY: 0.3, omega: 0.4 };
    const outSum = inverseMecanum(sum, cfg);
    const outLinear = [
      inverseMecanum(a0, cfg).speeds[0] +
        inverseMecanum(a1, cfg).speeds[0] +
        inverseMecanum(a2, cfg).speeds[0],
      inverseMecanum(a0, cfg).speeds[1] +
        inverseMecanum(a1, cfg).speeds[1] +
        inverseMecanum(a2, cfg).speeds[1],
      inverseMecanum(a0, cfg).speeds[2] +
        inverseMecanum(a1, cfg).speeds[2] +
        inverseMecanum(a2, cfg).speeds[2],
      inverseMecanum(a0, cfg).speeds[3] +
        inverseMecanum(a1, cfg).speeds[3] +
        inverseMecanum(a2, cfg).speeds[3],
    ];
    for (let i = 0; i < 4; i += 1) {
      expect(outSum.speeds[i]).toBeCloseTo(outLinear[i], 12);
    }
  });

  test("round-trip: forward(inverse(command)) ~ command", () => {
    // The IK and the forward map are inverses; every realistic command
    // must round-trip within f64 epsilon.
    for (const vX of [-1.0, 0.0, 0.5]) {
      for (const vY of [-0.5, 0.0, 0.7]) {
        for (const omega of [-0.8, 0.0, 0.4]) {
          const cmd: MecanumCommand = { vX, vY, omega };
          const out = forwardMecanum(inverseMecanum(cmd, cfg), cfg);
          expect(out.vX).toBeCloseTo(vX, 12);
          expect(out.vY).toBeCloseTo(vY, 12);
          expect(out.omega).toBeCloseTo(omega, 12);
        }
      }
    }
  });

  test("applyMecanumLimits clamps the linear speed", () => {
    const cmd: MecanumCommand = { vX: 10.0, vY: 0, omega: 0 };
    const limited = applyMecanumLimits(cmd, KUKA_KMR_IIWA_LIMITS);
    const vLin = Math.hypot(limited.vX, limited.vY);
    expect(vLin).toBeCloseTo(KUKA_KMR_IIWA_LIMITS.maxLinearMps, 12);
    expect(limited.omega).toBe(0);
  });

  test("applyMecanumLimits clamps the angular speed", () => {
    const cmd: MecanumCommand = { vX: 0, vY: 0, omega: 10.0 };
    const limited = applyMecanumLimits(cmd, KUKA_KMR_IIWA_LIMITS);
    expect(limited.omega).toBeCloseTo(
      KUKA_KMR_IIWA_LIMITS.maxAngularRadPerSec,
      12,
    );
    expect(limited.vX).toBe(0);
    expect(limited.vY).toBe(0);
  });

  test("applyMecanumLimits leaves in-spec commands unchanged", () => {
    const cmd: MecanumCommand = { vX: 0.3, vY: 0.2, omega: 0.1 };
    const limited = applyMecanumLimits(cmd, KUKA_KMR_IIWA_LIMITS);
    expect(limited.vX).toBeCloseTo(0.3, 12);
    expect(limited.vY).toBeCloseTo(0.2, 12);
    expect(limited.omega).toBeCloseTo(0.1, 12);
  });
});
