// Collision-safety contract for the estate walking-route gates.
//
// Each gate in CRAFTSMAN_WALKING_ROUTES is a stand-point the avatar/robot
// pose is displayed at, so every gate must keep strictly positive body
// clearance (robotRadius 0.20 m, matching the G1 house-navigation challenge)
// against the furniture multi-obstacle scene, and must clear the bungalow
// wall bodies (half-thickness + robot radius) outside authored doorway
// apertures. totalDistanceMeters must equal the straight-line gate polyline
// so the UI stays honest.
//
// Gate positions were produced by the clearance-field audit of 2026-08-30
// (TanGorge); see .beads for the audit notes. If a test fails here, furniture
// or walls moved — re-run the stand-point relocation before moving gates back
// into obstacles.

import { describe, expect, test } from "bun:test";
import { CRAFTSMAN_WALKING_ROUTES } from "../app/lib/craftsmanCatalogData";
import { CRAFTSMAN_BUNGALOW_1928 } from "../app/lib/houseScenes";
import {
  createSceneFromHouseFurniture,
  queryMultiObstacleScene,
} from "../app/lib/houseMultiObstacleKernel";

const ROBOT_RADIUS = 0.2;
// 2 mm manufacturing/stand-point tolerance, identical to the relocation audit.
const BODY_EPSILON = 0.002;

const scene = createSceneFromHouseFurniture();

/** True when the robot body at (x, y) overlaps a wall body (doorway gaps excluded). */
function bodyInsideWall(x: number, y: number): boolean {
  for (const wall of CRAFTSMAN_BUNGALOW_1928.walls) {
    const dx = wall.to[0] - wall.from[0];
    const dy = wall.to[1] - wall.from[1];
    const len = Math.hypot(dx, dy);
    const s = ((x - wall.from[0]) * dx + (y - wall.from[1]) * dy) / (len * len);
    if (s < 0 || s > 1) continue;

    const px = wall.from[0] + (s * len * dx) / len;
    const py = wall.from[1] + (s * len * dy) / len;
    const perp = Math.hypot(x - px, y - py);
    if (perp > wall.thickness / 2 + ROBOT_RADIUS - BODY_EPSILON) continue;
    const along = s * len;
    const inAperture = wall.doorways.some(
      (d) => along >= d.at - d.width / 2 && along <= d.at + d.width / 2,
    );
    if (!inAperture) return true;
  }
  return false;
}

function polylineDistance(route: (typeof CRAFTSMAN_WALKING_ROUTES)[number]): number {
  let total = 0;
  for (let i = 0; i < route.waypoints.length - 1; i++) {
    const a = route.waypoints[i].pos;
    const b = route.waypoints[i + 1].pos;
    total += Math.hypot(b[0] - a[0], b[1] - a[1]);
  }
  return total;
}

describe("Craftsman walking-route gate collision safety", () => {
  test("every route defines at least two gates with unique names", () => {
    for (const route of CRAFTSMAN_WALKING_ROUTES) {
      expect(route.waypoints.length).toBeGreaterThanOrEqual(2);
      const seenByName: Record<string, true> = {};
      for (const wp of route.waypoints) {
        expect(
          wp.name in seenByName,
          `${route.id}: duplicate gate name "${wp.name}"`,
        ).toBe(false);
        seenByName[wp.name] = true;
      }
    }
  });

  test("every gate keeps strictly positive furniture clearance at robotRadius 0.20", () => {
    for (const route of CRAFTSMAN_WALKING_ROUTES) {
      for (const wp of route.waypoints) {
        const res = queryMultiObstacleScene(
          { position: [wp.pos[0], 0.5, wp.pos[1]], robotRadius: ROBOT_RADIUS, safetyMargin: 0.04 },
          scene,
        );
        expect(res.minimumClearanceMeters).toBeGreaterThan(0);
      }
    }
  });

  test("worst gate clearance per route is reported and bounded away from zero", () => {
    for (const route of CRAFTSMAN_WALKING_ROUTES) {
      let worst = Infinity;
      let worstName = "";
      for (const wp of route.waypoints) {
        const res = queryMultiObstacleScene(
          { position: [wp.pos[0], 0.5, wp.pos[1]], robotRadius: ROBOT_RADIUS, safetyMargin: 0.04 },
          scene,
        );
        if (res.minimumClearanceMeters < worst) {
          worst = res.minimumClearanceMeters;
          worstName = wp.name;
        }
      }
      // Guards against silent erosion of stand-point quality. The 3 mm floor
      // matches the v7 relocation audit's free-grid threshold (5 mm) minus
      // the 2 mm body/wall tolerance; gates produced by the audit land at
      // 10-50 mm, so anything <= 3 mm is almost certainly a hand-edit
      // regression. The real safety contract (clearance > 0) is the
      // previous test.
      expect(
        worst,
        `${route.id}: worst gate "${worstName}" clearance ${worst.toFixed(3)} m`,
      ).toBeGreaterThan(0.003);
    }
  });

  test("no gate overlaps a wall body outside a doorway aperture", () => {
    for (const route of CRAFTSMAN_WALKING_ROUTES) {
      for (const wp of route.waypoints) {
        expect(
          bodyInsideWall(wp.pos[0], wp.pos[1]),
          `${route.id}/${wp.name} at (${wp.pos[0]}, ${wp.pos[1]}) overlaps a wall body`,
        ).toBe(false);
      }
    }
  });

  test("totalDistanceMeters matches the straight-line gate polyline", () => {
    for (const route of CRAFTSMAN_WALKING_ROUTES) {
      const actual = polylineDistance(route);
      expect(
        Math.abs(actual - route.totalDistanceMeters),
        `${route.id}: declared ${route.totalDistanceMeters} m vs polyline ${actual.toFixed(2)} m`,
      ).toBeLessThan(0.35);
    }
  });
});
