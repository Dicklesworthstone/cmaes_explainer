import { describe, expect, test } from "bun:test";
import {
  CRAFTSMAN_DOORWAYS,
  CRAFTSMAN_WAYPOINT_CHAIN,
  simulateHouseNavigation,
} from "../app/lib/houseNavigationChain";

describe("Whole-House Multi-Room Navigation Chain Engine", () => {
  test("CRAFTSMAN_WAYPOINT_CHAIN covers 7 major house areas", () => {
    expect(CRAFTSMAN_WAYPOINT_CHAIN.length).toBe(7);
    const rooms = CRAFTSMAN_WAYPOINT_CHAIN.map((w) => w.room);
    expect(rooms).toEqual(["porch", "parlor", "dining", "kitchen", "hallway", "bedroom", "bath"]);
  });

  test("CRAFTSMAN_DOORWAYS defines doorway corridors for room transitions", () => {
    expect(CRAFTSMAN_DOORWAYS.length).toBe(6);
    for (const door of CRAFTSMAN_DOORWAYS) {
      expect(door.halfWidth).toBeGreaterThanOrEqual(0.40);
    }
  });

  test("simulateHouseNavigation successfully traverses the whole house without collisions", () => {
    const result = simulateHouseNavigation(CRAFTSMAN_WAYPOINT_CHAIN, CRAFTSMAN_DOORWAYS, 2500, 1 / 60);

    expect(result.allWaypointsReached).toBe(true);
    expect(result.completedWaypoints).toBe(7);
    expect(result.totalPathDistanceMeters).toBeGreaterThan(12.0); // >12m whole house route
    expect(result.minimumObstacleClearanceMeters).toBeGreaterThan(0.0); // Zero collisions!
    expect(result.trajectory.length).toBeGreaterThan(100);

    // Verify final waypoint reached in trajectory
    const lastStep = result.trajectory[result.trajectory.length - 1];
    expect(lastStep.activeRoom).toBe("bath");
  });
});
