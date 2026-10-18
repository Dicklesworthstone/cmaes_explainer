import { describe, expect, test } from "bun:test";
import {
  createRollingPieceState,
  ROLLING_PIECE_DEFAULTS,
  type RollingFurnitureKind,
  stepRollingPieceDynamics,
} from "../app/lib/rollingFurniturePieces";

describe("Rolling Furniture Pieces & Caster Kinematics Engine", () => {
  test("creates initial state with correct dimensions and wheel count for all kinds", () => {
    const kinds: RollingFurnitureKind[] = [
      "rolling-bar-stool",
      "office-chair-casters",
      "service-cart",
      "mop-bucket",
      "rolling-hamper",
    ];

    for (const kind of kinds) {
      const cfg = ROLLING_PIECE_DEFAULTS[kind];
      const state = createRollingPieceState(kind, [1.0, 2.0], Math.PI / 4);

      expect(state.position).toEqual([1.0, 2.0]);
      expect(state.headingYaw).toBeCloseTo(Math.PI / 4, 4);
      expect(state.velocity).toEqual([0.0, 0.0]);
      expect(state.wheelRotations.length).toBe(cfg.caster.wheelCount);
    }
  });

  test("rolling stool decelerates and comes to a full stop under rolling resistance", () => {
    const cfg = ROLLING_PIECE_DEFAULTS["rolling-bar-stool"];
    let state = createRollingPieceState("rolling-bar-stool", [0, 0], 0.0);
    // Impart initial forward push velocity of 1.0 m/s
    state.velocity = [1.0, 0.0];

    const dt = 1 / 60;
    let stopped = false;

    for (let frame = 0; frame < 600; frame++) {
      state = stepRollingPieceDynamics(cfg, state, dt);
      const speed = Math.hypot(state.velocity[0], state.velocity[1]);
      if (speed === 0.0) {
        stopped = true;
        break;
      }
    }

    expect(stopped).toBe(true);
    expect(state.position[0]).toBeGreaterThan(0.5); // Travelled forward before halting
    expect(state.velocity).toEqual([0.0, 0.0]);
  });

  test("external robot push accelerates the service cart forward", () => {
    const cfg = ROLLING_PIECE_DEFAULTS["service-cart"];
    let state = createRollingPieceState("service-cart", [0, 0], 0.0);

    // Apply continuous 20N forward push force for 0.5s (30 frames)
    const pushForce: [number, number] = [20.0, 0.0];
    for (let frame = 0; frame < 30; frame++) {
      state = stepRollingPieceDynamics(cfg, state, 1 / 60, pushForce);
    }

    expect(state.velocity[0]).toBeGreaterThan(0.3); // Accelerates forward
    expect(state.position[0]).toBeGreaterThan(0.05);
  });

  test("caster trail offset produces self-aligning swivel moment on lateral push", () => {
    const cfg = ROLLING_PIECE_DEFAULTS["office-chair-casters"];
    let state = createRollingPieceState("office-chair-casters", [0, 0], 0.0); // Facing +X
    state.velocity = [0.5, 0.0];

    // Apply lateral push in +Z direction
    const lateralPush: [number, number] = [0.0, 15.0];
    for (let frame = 0; frame < 15; frame++) {
      state = stepRollingPieceDynamics(cfg, state, 1 / 60, lateralPush);
    }

    // Caster self-aligning moment swivels chair towards +Z heading
    expect(state.headingYaw).toBeGreaterThan(0.0);
    expect(Number.isFinite(state.headingYaw)).toBe(true);
  });

  test("wheel rotations advance proportionally to semi-implicit Euler rolling distance including step 1 from rest", () => {
    const cfg = ROLLING_PIECE_DEFAULTS["mop-bucket"];
    let state = createRollingPieceState("mop-bucket", [0, 0], 0.0);
    state.velocity = [0.6, 0.0];

    const dt = 1 / 60;
    state = stepRollingPieceDynamics(cfg, state, dt);

    const expectedDeltaTheta = (state.velocity[0] * dt) / cfg.caster.wheelRadius;
    for (const rot of state.wheelRotations) {
      expect(rot).toBeCloseTo(expectedDeltaTheta, 5);
    }

    // Pushing from rest on step 1 immediately advances both position and wheel rotation
    const fromRest = stepRollingPieceDynamics(
      cfg,
      createRollingPieceState("mop-bucket", [0, 0], 0.0),
      dt,
      [25.0, 0.0],
    );
    expect(fromRest.position[0]).toBeGreaterThan(0);
    expect(fromRest.wheelRotations[0]).toBeCloseTo(
      fromRest.position[0] / cfg.caster.wheelRadius,
      5,
    );
  });

  test("passive lateral velocity decays monotonically without sign-reversal energy amplification", () => {
    const cfg = ROLLING_PIECE_DEFAULTS["office-chair-casters"];
    let state = createRollingPieceState("office-chair-casters", [0, 0], 0.0);
    // Small lateral slip velocity (0.02 m/s) with small forward velocity (0.05 m/s)
    state.velocity = [0.05, 0.02];

    const initialKineticEnergy =
      0.5 * cfg.massKg * (state.velocity[0] ** 2 + state.velocity[1] ** 2);

    const nextState = stepRollingPieceDynamics(cfg, state, 1 / 60);
    // Lateral velocity must be arrested without flipping sign to a larger negative velocity
    expect(nextState.velocity[1]).toBeGreaterThanOrEqual(-1e-6);
    expect(nextState.velocity[1]).toBeLessThanOrEqual(state.velocity[1]);

    const nextKineticEnergy =
      0.5 * cfg.massKg * (nextState.velocity[0] ** 2 + nextState.velocity[1] ** 2) +
      0.5 * cfg.momentOfInertiaZz * nextState.yawRate ** 2;
    expect(nextKineticEnergy).toBeLessThanOrEqual(initialKineticEnergy + 1e-6);
  });
});
