import {
  armCounterSlabObstacle,
  armStageObstacles,
  type OrientedBoundingBox,
  resolveCameraBoom,
} from "./houseMultiObstacleKernel";
import { type PerspectiveCamera, Vector3 } from "three";
import { robotCameraFittedFov, robotCameraFramingCorners } from "./robotCameraFraming";

type ArmTask = "kitchen-mug" | "living-room-remote" | "backyard-trowel";

/** Camera-only support plus exactly the keep-outs rendered in the Arm stage.
 * Whole-house colliders include invisible walls here and can collapse every
 * close-up boom onto the object. This never changes the owner's physics. */
export function armCameraObstacles(supportHeight: number, task: ArmTask): OrientedBoundingBox[] {
  return [armCounterSlabObstacle(supportHeight), ...armStageObstacles(supportHeight, task)];
}

export function armGraspCameraBoom(
  object: [number, number, number],
  obstacles: readonly OrientedBoundingBox[],
) {
  const lookAt: [number, number, number] = [object[0], object[1] + 0.1, object[2]];
  const offsets = [[0.7, 0.55, 0.7], [-0.7, 0.55, 0.7], [0.9, 0.65, -0.2], [-0.9, 0.65, -0.2]];
  const candidates = offsets.map(([x, y, z]) =>
    resolveCameraBoom(lookAt, [object[0] + x, object[1] + y, object[2] + z], obstacles, 0.06),
  );
  const boom = candidates.reduce((best, candidate) => candidate.fraction > best.fraction ? candidate : best);
  return { ...boom, lookAt };
}

/** Fit both the physical workpiece and the wrist/fingers, not just the point
 * the lens follows. Include mesh thickness and the gripper's local offsets.
 * This is a presentation-only lens adjustment; owner poses remain untouched. */
export function armGraspCameraFov(
  camera: PerspectiveCamera,
  object: [number, number, number],
  wrist: [number, number, number],
  minimumFov: number,
) {
  camera.updateMatrixWorld();
  const corners = robotCameraFramingCorners([object, wrist].map(([x, y, z]) => ({ x, y, z })));
  return robotCameraFittedFov(minimumFov, camera.aspect, corners.map(point =>
    new Vector3(point.x, point.y, point.z).applyMatrix4(camera.matrixWorldInverse),
  ));
}
