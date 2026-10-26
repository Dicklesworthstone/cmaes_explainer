import { describe, expect, test } from "bun:test";
import {
  CRAFTSMAN_DOORWAYS,
  CRAFTSMAN_WAYPOINT_CHAIN,
  evaluateHouseNavigationSafetyAndCostmap,
  runSegmentedHouseNavigation,
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
      expect(door.halfWidth).toBeGreaterThanOrEqual(0.4);
    }
  });

  test("simulateHouseNavigation successfully traverses the whole house without collisions", () => {
    const result = simulateHouseNavigation(
      CRAFTSMAN_WAYPOINT_CHAIN,
      CRAFTSMAN_DOORWAYS,
      2500,
      1 / 60,
    );

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

describe("simulateHouseNavigation final-sample clearance (regression)", () => {
  test("the final trajectory sample's clearanceMeters reflects the LAST step, not the historical min", () => {
    // The final sample (waypoint reached) must use the LAST step's
    // clearance, not the historical min across the trajectory. The
    // historical min is exposed in result.minimumObstacleClearanceMeters;
    // the final sample is result.trajectory[last].clearanceMeters.
    // If the bug regresses, the final sample's clearance would be the
    // min, which is dominated by the doorways (narrow).
    const result = simulateHouseNavigation(
      CRAFTSMAN_WAYPOINT_CHAIN,
      CRAFTSMAN_DOORWAYS,
      2500,
      1 / 60,
    );
    expect(result.allWaypointsReached).toBe(true);
    const last = result.trajectory[result.trajectory.length - 1];
    // The final sample should be near the bath waypoint (close to
    // 1, 5.5) with non-zero clearance; it should match or exceed
    // result.minimumObstacleClearanceMeters but not be artificially
    // clamped to it. The fix uses lastStepClearance.
    expect(last.clearanceMeters).toBeGreaterThanOrEqual(0.1);
    expect(last.clearanceMeters).toBeLessThanOrEqual(1.0);
  });

  test("runSegmentedHouseNavigation matches uninterrupted simulateHouseNavigation across checkpoint boundaries", () => {
    const uninterrupted = simulateHouseNavigation(
      CRAFTSMAN_WAYPOINT_CHAIN,
      CRAFTSMAN_DOORWAYS,
      2500,
      1 / 60,
    );
    const segmented = runSegmentedHouseNavigation(
      CRAFTSMAN_WAYPOINT_CHAIN,
      CRAFTSMAN_DOORWAYS,
      150,
      2500,
      1 / 60,
    );

    expect(segmented.allWaypointsReached).toBe(true);
    expect(segmented.completedWaypoints).toBe(uninterrupted.completedWaypoints);
    expect(segmented.trajectory.length).toBe(uninterrupted.trajectory.length);
    expect(segmented.totalPathDistanceMeters).toBeCloseTo(uninterrupted.totalPathDistanceMeters, 8);
    expect(segmented.minimumObstacleClearanceMeters).toBeCloseTo(
      uninterrupted.minimumObstacleClearanceMeters,
      8,
    );
    expect(segmented.simulatedPhysicalSeconds).toBeCloseTo(
      uninterrupted.simulatedPhysicalSeconds,
      8,
    );

    for (let i = 0; i < uninterrupted.trajectory.length; i++) {
      expect(segmented.trajectory[i].step).toBe(uninterrupted.trajectory[i].step);
      expect(segmented.trajectory[i].position[0]).toBeCloseTo(
        uninterrupted.trajectory[i].position[0],
        8,
      );
      expect(segmented.trajectory[i].position[1]).toBeCloseTo(
        uninterrupted.trajectory[i].position[1],
        8,
      );
      expect(segmented.trajectory[i].clearanceMeters).toBeCloseTo(
        uninterrupted.trajectory[i].clearanceMeters,
        8,
      );
    }
  });

  test("simulateHouseNavigation preserves raw negative clearances without positive clamping when starting inside furniture", () => {
    // [-3.3, 2.6] is the center of the brick fireplace in CRAFTSMAN_BUNGALOW_1928
    const blockedWaypoints = [
      {
        id: "wp-blocked",
        name: "Inside Fireplace",
        position: [-3.3, 2.6] as [number, number],
        acceptanceRadius: 0.2,
        targetSpeed: 0.5,
        room: "parlor",
      },
      ...CRAFTSMAN_WAYPOINT_CHAIN.slice(1),
    ];

    const res = simulateHouseNavigation(blockedWaypoints, CRAFTSMAN_DOORWAYS, 20, 1 / 60);
    expect(res.collisionOccurred).toBe(true);
    expect(res.minimumObstacleClearanceMeters).toBeLessThan(0.0);
    expect(res.trajectory.some((s) => s.clearanceMeters < 0.0)).toBe(true);
  });

  test("evaluateHouseNavigationSafetyAndCostmap computes 3-tier CBF recovery, Helbing-Molnar social force, decor tipping, and Fourier-feature costmap", () => {
    const diag = evaluateHouseNavigationSafetyAndCostmap([0.35, 2.5], [0.4, -0.5], [0.5, -0.5]);
    expect(["nominal", "relaxed-slack", "reflex-braking", "recent-safe-retreat"]).toContain(
      diag.recoveryState,
    );
    expect(diag.safeVelocity.length).toBe(2);
    expect(Number.isFinite(diag.safeVelocity[0])).toBe(true);
    expect(Number.isFinite(diag.safeVelocity[1])).toBe(true);
    expect(diag.socialPotential).toBeGreaterThan(0);
    expect(Number.isFinite(diag.socialCbf.hSocial)).toBe(true);
    expect(diag.socialCbf.filteredVelocity.length).toBe(2);
    expect(diag.g1ChallengePreview.waypointCount).toBeGreaterThanOrEqual(7);
    expect(diag.g1ChallengePreview.clearSpawnPosition.length).toBe(3);
    expect(diag.g1ChallengePreview.shortRolloutDistanceMeters).toBeGreaterThan(0);
    expect(diag.householdMultiObstacle.wallObstacleCount).toBeGreaterThan(0);
    expect(diag.householdMultiObstacle.enclosingRadiusMeters).toBeGreaterThan(0.5);
    expect(diag.householdMultiObstacle.spawnIsClear).toBe(true);
    expect(diag.householdMultiObstacle.armStageRoomCount).toBe(2);
    expect(diag.householdMultiObstacle.kernelObstacleRole).toBe("keep-out");
    expect(Number.isFinite(diag.householdMultiObstacle.objectiveScore)).toBe(true);
    expect(diag.householdMultiObstacle.recoveryConstraintCount).toBeGreaterThanOrEqual(0);
    expect(Number.isFinite(diag.householdMultiObstacle.sscbfH)).toBe(true);
    expect(diag.householdMultiObstacle.segmentProjectionT).toBeGreaterThanOrEqual(0);
    expect(diag.householdMultiObstacle.riskAwareMarginMeters).toBeGreaterThan(0);
    expect(diag.householdMultiObstacle.fragilityMultiplier).toBeGreaterThan(1.0);
    expect(diag.householdMultiObstacle.fragilityRiskScore).toBeGreaterThanOrEqual(0);
    expect(diag.decorTippingCheck.tippingThresholdNm).toBeGreaterThan(0);
    expect(diag.learnedCostmap.parameterCount).toBeGreaterThan(0);
    expect(Number.isFinite(diag.learnedCostmap.neuralClearanceValue)).toBe(true);
    expect(diag.learnedCostmap.neuralGradient.length).toBe(2);

    // Indoor & outdoor G1 campaign and causal interventions (cmaes-feat-fs1-indoor-g1-5dc, cmaes-feat-fs2-outdoor-g1-m1h)
    expect(diag.indoorOutdoorCampaigns.curriculumHorizonSteps).toBe(720);
    for (let i = 0; i < 3; i++) {
      expect(diag.indoorOutdoorCampaigns.shortGaitThreeSeedDistancesM[i]).toBeGreaterThanOrEqual(
        1.0,
      );
      expect(diag.indoorOutdoorCampaigns.shortGaitThreeSeedMeanSpeedsMps[i]).toBeGreaterThanOrEqual(
        0.5,
      );
    }
    expect(diag.indoorOutdoorCampaigns.indoorMinClearanceMeters).toBeGreaterThanOrEqual(0.001);
    expect(diag.indoorOutdoorCampaigns.blockedDoorwayMinClearanceMeters).toBeLessThan(
      diag.indoorOutdoorCampaigns.indoorMinClearanceMeters,
    );
    expect(diag.indoorOutdoorCampaigns.blockedDoorwayInfeasible).toBe(true);
    expect(diag.indoorOutdoorCampaigns.outdoorPorchFlatSdfM).not.toBeCloseTo(
      diag.indoorOutdoorCampaigns.outdoorGardenSlopedSdfM,
      3,
    );
    expect(diag.indoorOutdoorCampaigns.outdoorPlanterShiftedClearanceM).toBeLessThan(
      diag.indoorOutdoorCampaigns.outdoorPlanterNominalClearanceM,
    );
  });
});
