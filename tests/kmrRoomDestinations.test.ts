import { describe, expect, test } from "bun:test";
import { KMR_ROOM_DESTINATIONS } from "../app/components/KmrScene";
import { createHouseNavigationScene } from "../app/lib/houseMultiObstacleKernel";
import { CRAFTSMAN_BUNGALOW_1928 } from "../app/lib/houseScenes";
import {
  createKmrPlanarSdf,
  KMR_PLANAR_CLEARANCE_RADIUS_METERS,
  planWaypointPath,
} from "../app/lib/kmrWaypointNav";

describe("KMR room destinations", () => {
  const scene = createHouseNavigationScene();
  const start = {
    x: CRAFTSMAN_BUNGALOW_1928.goals[0].center[0],
    y: CRAFTSMAN_BUNGALOW_1928.goals[0].center[1],
    theta: 0,
  };

  test("every visible preset is clear and reachable from the initial pose", () => {
    const sdf = createKmrPlanarSdf(scene.obstacles);

    expect(KMR_ROOM_DESTINATIONS).toHaveLength(5);
    for (const destination of KMR_ROOM_DESTINATIONS) {
      expect(sdf(destination.x, destination.y)).toBeGreaterThanOrEqual(
        KMR_PLANAR_CLEARANCE_RADIUS_METERS,
      );
      const plan = planWaypointPath(
        start,
        destination,
        scene.obstacles,
        undefined,
        scene.bounds,
      );
      expect(plan.path.points.length).toBeGreaterThan(0);
      expect(plan.path.minimumClearanceMeters).toBeGreaterThanOrEqual(0);
    }
  });
});
