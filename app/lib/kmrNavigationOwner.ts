// Deterministic kinematic owner for the KMR iiwa household navigation rung.
//
// This is intentionally narrower than a rigid-body/WASM mobile-base owner:
// it owns pose integration, mecanum wheel commands, waypoint progress, swept
// obstacle refusal, clearance, distance, and elapsed time. The UI must label
// it "TS kinematic owner" and must not claim traction/contact dynamics.

import type { SDF2D, Vec2 } from "./dpValueIteration";
import {
  applyMecanumLimits,
  forwardMecanum,
  inverseMecanum,
  KUKA_KMR_IIWA_LIMITS,
  type MecanumCommand,
  type MecanumWheelSpeeds,
} from "./mecanumKinematics";
import {
  KMR_IIWA_PROCEDURAL_CHASSIS_ASSUMPTIONS,
  type KmrGeometryConfig,
} from "./kmrGeometry";
import type { OrientedBoundingBox } from "./houseMultiObstacleKernel";
import {
  createKmrPlanarSdf,
  KMR_PLANAR_CLEARANCE_RADIUS_METERS,
  pathIsCollisionFree,
  type WaypointPath,
} from "./kmrWaypointNav";

export interface KmrPose2D {
  x: number;
  y: number;
  theta: number;
}

export interface KmrNavigationOwnerConfig {
  dtSeconds: number;
  cruiseSpeedMps: number;
  headingGainPerSecond: number;
  waypointToleranceMeters: number;
  clearanceRadiusMeters: number;
  geometry: KmrGeometryConfig;
}

export interface KmrNavigationReceipt {
  owner: "ts-kinematic-mecanum-owner";
  pose: KmrPose2D;
  waypointIndex: number;
  totalWaypoints: number;
  completed: boolean;
  elapsedSeconds: number;
  distanceTraveledMeters: number;
  minimumClearanceMeters: number;
  collisionRefusals: number;
  bodyCommand: MecanumCommand;
  wheelSpeeds: MecanumWheelSpeeds;
}

const DEFAULT_CONFIG: KmrNavigationOwnerConfig = {
  dtSeconds: 1 / 60,
  cruiseSpeedMps: 0.6,
  headingGainPerSecond: 3.0,
  waypointToleranceMeters: 0.08,
  clearanceRadiusMeters: KMR_PLANAR_CLEARANCE_RADIUS_METERS,
  geometry: KMR_IIWA_PROCEDURAL_CHASSIS_ASSUMPTIONS,
};

function wrapAngle(angle: number): number {
  let wrapped = angle;
  while (wrapped > Math.PI) wrapped -= 2 * Math.PI;
  while (wrapped < -Math.PI) wrapped += 2 * Math.PI;
  return wrapped;
}

function segmentIsClear(
  from: Vec2,
  to: Vec2,
  sdf: SDF2D,
  clearanceRadiusMeters: number,
): boolean {
  const distance = Math.hypot(to[0] - from[0], to[1] - from[1]);
  const samples = Math.max(1, Math.ceil(distance / 0.02));
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const x = from[0] + (to[0] - from[0]) * t;
    const y = from[1] + (to[1] - from[1]) * t;
    if (sdf(x, y) < clearanceRadiusMeters) return false;
  }
  return true;
}

export class KmrNavigationOwner {
  private readonly path: WaypointPath;
  private readonly sdf: SDF2D;
  private readonly config: KmrNavigationOwnerConfig;
  private pose: KmrPose2D;
  private waypointIndex: number;
  private completed = false;
  private elapsedSeconds = 0;
  private distanceTraveledMeters = 0;
  private minimumClearanceMeters = Number.POSITIVE_INFINITY;
  private collisionRefusals = 0;
  private bodyCommand: MecanumCommand = { vX: 0, vY: 0, omega: 0 };
  private wheelSpeeds: MecanumWheelSpeeds = { speeds: [0, 0, 0, 0] };

  constructor(
    initialPose: KmrPose2D,
    path: WaypointPath,
    obstacles: readonly OrientedBoundingBox[],
    config: Partial<KmrNavigationOwnerConfig> = {},
  ) {
    if (path.points.length === 0) throw new Error("KMR owner requires a non-empty path");
    this.config = { ...DEFAULT_CONFIG, ...config };
    if (
      !pathIsCollisionFree(
        path,
        obstacles,
        this.config.clearanceRadiusMeters,
      )
    ) {
      throw new Error("KMR owner refuses a path that intersects the obstacle field");
    }
    this.pose = { ...initialPose };
    this.path = path;
    this.sdf = createKmrPlanarSdf(obstacles);
    this.waypointIndex = path.points.length > 1 ? 1 : 0;
    this.minimumClearanceMeters =
      this.sdf(initialPose.x, initialPose.y) - this.config.clearanceRadiusMeters;
    this.completed = path.points.length === 1;
  }

  step(): KmrNavigationReceipt {
    if (this.completed) return this.receipt();
    const target = this.path.points[this.waypointIndex];
    const dx = target[0] - this.pose.x;
    const dy = target[1] - this.pose.y;
    const distanceToTarget = Math.hypot(dx, dy);

    if (distanceToTarget <= this.config.waypointToleranceMeters) {
      if (this.waypointIndex >= this.path.points.length - 1) {
        this.completed = true;
        this.bodyCommand = { vX: 0, vY: 0, omega: 0 };
        this.wheelSpeeds = inverseMecanum(
          this.bodyCommand,
          this.config.geometry,
        );
        return this.receipt();
      }
      const nextTarget = this.path.points[this.waypointIndex + 1];
      // Do not cut a clearance-critical corner merely because the pose is
      // within a visual waypoint tolerance. Advance only when the swept
      // segment from the actual pose to the next waypoint remains certified.
      if (
        segmentIsClear(
          [this.pose.x, this.pose.y],
          nextTarget,
          this.sdf,
          this.config.clearanceRadiusMeters,
        )
      ) {
        this.waypointIndex += 1;
        return this.step();
      }
    }

    const speed = Math.min(
      this.config.cruiseSpeedMps,
      distanceToTarget / this.config.dtSeconds,
    );
    const worldVx = (dx / distanceToTarget) * speed;
    const worldVy = (dy / distanceToTarget) * speed;
    const cos = Math.cos(this.pose.theta);
    const sin = Math.sin(this.pose.theta);
    const desiredHeading = Math.atan2(worldVy, worldVx);
    const command = applyMecanumLimits(
      {
        vX: cos * worldVx + sin * worldVy,
        vY: -sin * worldVx + cos * worldVy,
        omega:
          wrapAngle(desiredHeading - this.pose.theta) *
          this.config.headingGainPerSecond,
      },
      KUKA_KMR_IIWA_LIMITS,
    );
    const wheels = inverseMecanum(command, this.config.geometry);
    const realized = forwardMecanum(wheels, this.config.geometry);
    const realizedWorldVx = cos * realized.vX - sin * realized.vY;
    const realizedWorldVy = sin * realized.vX + cos * realized.vY;
    const proposed: KmrPose2D = {
      x: this.pose.x + realizedWorldVx * this.config.dtSeconds,
      y: this.pose.y + realizedWorldVy * this.config.dtSeconds,
      theta: wrapAngle(
        this.pose.theta + realized.omega * this.config.dtSeconds,
      ),
    };

    if (
      !segmentIsClear(
        [this.pose.x, this.pose.y],
        [proposed.x, proposed.y],
        this.sdf,
        this.config.clearanceRadiusMeters,
      )
    ) {
      this.collisionRefusals += 1;
      this.bodyCommand = { vX: 0, vY: 0, omega: 0 };
      this.wheelSpeeds = inverseMecanum(
        this.bodyCommand,
        this.config.geometry,
      );
      this.elapsedSeconds += this.config.dtSeconds;
      return this.receipt();
    }

    const moved = Math.hypot(proposed.x - this.pose.x, proposed.y - this.pose.y);
    this.pose = proposed;
    this.bodyCommand = realized;
    this.wheelSpeeds = wheels;
    this.distanceTraveledMeters += moved;
    this.elapsedSeconds += this.config.dtSeconds;
    this.minimumClearanceMeters = Math.min(
      this.minimumClearanceMeters,
      this.sdf(this.pose.x, this.pose.y) - this.config.clearanceRadiusMeters,
    );
    return this.receipt();
  }

  receipt(): KmrNavigationReceipt {
    return {
      owner: "ts-kinematic-mecanum-owner",
      pose: { ...this.pose },
      waypointIndex: this.waypointIndex,
      totalWaypoints: this.path.points.length,
      completed: this.completed,
      elapsedSeconds: this.elapsedSeconds,
      distanceTraveledMeters: this.distanceTraveledMeters,
      minimumClearanceMeters: this.minimumClearanceMeters,
      collisionRefusals: this.collisionRefusals,
      bodyCommand: { ...this.bodyCommand },
      wheelSpeeds: { speeds: [...this.wheelSpeeds.speeds] },
    };
  }
}
