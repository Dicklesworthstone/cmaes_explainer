import { Mesh, type Object3D, Raycaster } from "three";

/** Preserve the desktop lens while retaining its horizontal coverage in portrait. */
export function robotCameraVerticalFov(
  baseFov: number,
  width: number,
  height: number,
): number {
  // Canvas may briefly have no measured size while mounting or rotating.
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    return baseFov;
  }
  if (width >= height) return baseFov;
  const portraitFov =
    (2 *
      Math.atan((Math.tan((baseFov * Math.PI) / 360) * height) / width) *
      180) /
    Math.PI;
  // Avoid an almost-flat projection in an exceptionally narrow split pane.
  return Math.min(100, portraitFov);
}

type CameraPoint = Readonly<{ x: number; y: number; z: number }>;

/** Check the rendered house as well as its coarser physics colliders. The
 * caller updates world matrices once before checking candidate camera booms. */
export function robotCameraHasOccluder(
  house: Object3D,
  eye: CameraPoint,
  target: CameraPoint,
  raycaster: Raycaster,
): boolean {
  raycaster.ray.origin.set(eye.x, eye.y, eye.z);
  raycaster.ray.direction.set(target.x, target.y, target.z).sub(raycaster.ray.origin);
  const distance = raycaster.ray.direction.length();
  if (distance <= 0.05) return false;
  raycaster.ray.direction.normalize();
  raycaster.near = 0;
  raycaster.far = distance - 0.05;
  return raycaster.intersectObject(house, true).some((hit) => {
    if (!(hit.object instanceof Mesh)) return false;
    for (let parent: Object3D | null = hit.object; parent; parent = parent.parent) {
      if (!parent.visible) return false;
    }
    const material = Array.isArray(hit.object.material)
      ? hit.object.material[hit.face?.materialIndex ?? 0]
      : hit.object.material;
    return (
      material?.visible &&
      (!material.transparent || material.opacity >= 0.5) &&
      !("wireframe" in material && material.wireframe)
    );
  });
}

/** Padded bounds for a set of display points, never a physics correction. */
export function robotCameraFramingCorners(points: readonly CameraPoint[]): CameraPoint[] {
  if (points.length === 0) return [];
  const min = { x: Infinity, y: Infinity, z: Infinity };
  const max = { x: -Infinity, y: -Infinity, z: -Infinity };
  for (const point of points) {
    for (const axis of ["x", "y", "z"] as const) {
      if (!Number.isFinite(point[axis])) throw new Error("Non-finite robot framing point");
      min[axis] = Math.min(min[axis], point[axis]);
      max[axis] = Math.max(max[axis], point[axis]);
    }
  }
  // Link origins omit mesh thickness, toes and fingers. This is a display
  // allowance, not a physical collision radius or an owner-pose correction.
  const padding = 0.12;
  const corners: CameraPoint[] = [];
  for (const x of [min.x - padding, max.x + padding]) {
    for (const y of [min.y - padding, max.y + padding]) {
      for (const z of [min.z - padding, max.z + padding]) corners.push({ x, y, z });
    }
  }
  return corners;
}

/** Stable bounds per body landmark across the trace, without filling the empty
 * diagonal corners of a single whole-body box. That box can demand an extreme
 * lens even when the robot itself is comfortably frameable. */
export function robotCameraTraceFramingCorners(
  samples: readonly (readonly CameraPoint[])[],
): CameraPoint[] {
  if (samples.length === 0) return [];
  const landmarkCount = samples[0].length;
  if (samples.some((sample) => sample.length !== landmarkCount)) {
    throw new Error("Inconsistent robot framing landmarks");
  }
  return samples[0].flatMap((_, index) =>
    robotCameraFramingCorners(samples.map((sample) => sample[index])),
  );
}

/** Fit camera-space bounds, including an off-centre subject after a blocked boom. */
export function robotCameraFittedFov(
  minimumFov: number,
  aspect: number,
  cameraSpaceCorners: readonly CameraPoint[],
): number {
  if (!Number.isFinite(aspect) || aspect <= 0) return minimumFov;
  let tangent = Math.tan((minimumFov * Math.PI) / 360);
  for (const point of cameraSpaceCorners) {
    // A point at/behind the lens cannot be fully framed by any forward
    // perspective. Keep a bounded lens; camera collision recovery owns that case.
    if (!Number.isFinite(point.x + point.y + point.z) || point.z >= -0.05) return 100;
    const depth = -point.z;
    tangent = Math.max(
      tangent,
      Math.abs(point.y) / (depth * 0.85),
      Math.abs(point.x) / (depth * aspect * 0.85),
    );
  }
  return Math.min(100, (2 * Math.atan(tangent) * 180) / Math.PI);
}
