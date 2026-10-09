import { describe, expect, test } from "bun:test";
import { BoxGeometry, Group, Mesh, MeshBasicMaterial, PerspectiveCamera, Raycaster, Vector3 } from "three";
import {
  robotCameraFittedFov,
  robotCameraFramingCorners,
  robotCameraHasOccluder,
  robotCameraTraceFramingCorners,
  robotCameraVerticalFov,
} from "../app/lib/robotCameraFraming";
import {
  buildG1Config,
  buildHouseholdManipulationConfig,
  decodeG1Trace,
  decodeHouseholdManipulationTrace,
  DEFAULT_G1_WALKING_CONFIG,
  DEFAULT_HOUSEHOLD_MANIPULATION_CONFIG,
} from "../app/lib/frankensimCmaes";

describe("robot camera portrait framing", () => {
  test("frames real Arm curriculum poses without changing the studio camera or owner receipt", async () => {
    const owner = await import("../public/wasm/fs-cmaes/v0623/fs_cmaes_viz_wasm.js");
    await owner.default({
      module_or_path: await Bun.file(
        new URL("../public/wasm/fs-cmaes/v0623/fs_cmaes_viz_wasm_bg.wasm", import.meta.url),
      ).arrayBuffer(),
    });
    let oldLensClippedPoints = 0;
    for (const task of ["kitchen-mug", "living-room-remote", "backyard-trowel"] as const) {
      const evaluator = new owner.HouseholdManipulationVizEvaluator(
        buildHouseholdManipulationConfig({ ...DEFAULT_HOUSEHOLD_MANIPULATION_CONFIG, task }),
      );
      try {
        const decoded = decodeHouseholdManipulationTrace(
          evaluator.trace(evaluator.curriculum_policy_mean()),
        );
        if (!("ok" in decoded)) throw new Error(decoded.refusal.name);
        const trace = decoded.ok;
        const before = JSON.stringify(trace);
        expect(trace.samples.length).toBeGreaterThan(2);
        for (const [width, height] of [[320, 568], [390, 844], [768, 1024], [844, 390], [1440, 900]]) {
          const camera = new PerspectiveCamera(38, width / height, 0.03, 30);
          camera.position.set(1.55, 1.25, 1.8);
          camera.lookAt(-0.05, 0.48, 0);
          camera.updateMatrixWorld();
          const position = camera.position.clone();
          const orientation = camera.quaternion.clone();
          // Actual shipped owner poses in the display coordinate convention.
          // This is projection evidence, not a device or arbitrary-policy claim.
          const points = trace.samples.flatMap(sample =>
            [...sample.linkPoses, sample.objectPose].map(pose =>
              new Vector3(pose.position[0], pose.position[2], -pose.position[1])),
          );
          oldLensClippedPoints += points.filter(point => {
            const projected = point.clone().project(camera);
            return Math.abs(projected.x) > 1 || Math.abs(projected.y) > 1;
          }).length;
          camera.fov = robotCameraVerticalFov(38, width, height);
          camera.updateProjectionMatrix();
          for (const point of points) {
            const projected = point.clone().project(camera);
            expect(Math.abs(projected.x)).toBeLessThan(0.9);
            expect(Math.abs(projected.y)).toBeLessThan(0.9);
          }
          if (width >= height) expect(camera.fov).toBe(38);
          expect(camera.position.equals(position)).toBe(true);
          expect(camera.quaternion.equals(orientation)).toBe(true);
          expect(camera.near).toBe(0.03);
          expect(camera.far).toBe(30);
        }
        expect(JSON.stringify(trace)).toBe(before);
      } finally {
        evaluator.free();
      }
    }
    expect(oldLensClippedPoints).toBeGreaterThan(0);
  });

  test("keeps the existing desktop and square lens exactly", () => {
    for (const [width, height] of [
      [1440, 900],
      [1024, 768],
      [844, 390],
      [800, 800],
    ]) {
      expect(robotCameraVerticalFov(36, width, height)).toBe(36);
    }
  });

  test("projects a whole-body framing envelope inside phone and tablet viewports", () => {
    for (const [width, height] of [
      [320, 932],
      [375, 667],
      [390, 844],
      [430, 932],
      [768, 1024],
    ]) {
      const fov = robotCameraVerticalFov(36, width, height);
      const camera = new PerspectiveCamera(fov, width / height, 0.05, 40);
      // Geometry check only, not a claim about an actual robot rollout or device.
      // The old fixed lens crops this 1.6m-wide gait envelope on narrow phones.
      for (const x of [-0.8, 0.8]) {
        for (const y of [-0.95, 0.95]) {
          const projected = new Vector3(x, y, -3).project(camera);
          expect(Math.abs(projected.x)).toBeLessThan(0.95);
          expect(Math.abs(projected.y)).toBeLessThan(0.95);
        }
      }
      const horizontalFov =
        2 * Math.atan((Math.tan((fov * Math.PI) / 360) * width) / height);
      expect((horizontalFov * 180) / Math.PI).toBeCloseTo(36, 10);
    }
  });

  test("the unchanged desktop lens reproduces the observed portrait crop", () => {
    const oldCamera = new PerspectiveCamera(36, 390 / 844, 0.05, 40);
    expect(new Vector3(0.8, 0, -3).project(oldCamera).x).toBeGreaterThan(1);
  });

  test("rotation restores the original lens without changing position or near/far planes", () => {
    const camera = new PerspectiveCamera(36, 844 / 390, 0.05, 40);
    camera.position.set(1.85, 1.15, 2.35);
    const position = camera.position.clone();
    const originalProjection = camera.projectionMatrix.clone();
    for (const [width, height] of [
      [390, 844],
      [844, 390],
    ]) {
      camera.aspect = width / height;
      camera.fov = robotCameraVerticalFov(36, width, height);
      camera.updateProjectionMatrix();
    }
    expect(camera.projectionMatrix.equals(originalProjection)).toBe(true);
    expect(camera.position.equals(position)).toBe(true);
    expect(camera.near).toBe(0.05);
    expect(camera.far).toBe(40);
  });

  test("mounting sizes stay finite and extremely narrow panes have a bounded lens", () => {
    for (const [width, height] of [
      [0, 844],
      [390, 0],
      [-1, 844],
      [NaN, 844],
      [390, Infinity],
    ]) {
      expect(robotCameraVerticalFov(36, width, height)).toBe(36);
    }
    expect(robotCameraVerticalFov(36, 1, 844)).toBe(100);
  });
});

describe("robot Follow camera fitting", () => {
  test("rejects rendered obstructions even without a collider, but respects cutaways and glass", () => {
    const house = new Group();
    const room = new Group();
    const geometry = new BoxGeometry(1, 1, 0.3);
    const material = new MeshBasicMaterial();
    const beam = new Mesh(geometry, material);
    beam.position.set(0, 0, 1.5);
    room.add(beam);
    house.add(room);
    house.updateWorldMatrix(true, true);
    const raycaster = new Raycaster();
    const eye = new Vector3(0, 0, 3);
    const target = new Vector3();
    try {
      expect(robotCameraHasOccluder(house, eye, target, raycaster)).toBe(true);
      expect(robotCameraHasOccluder(house, new Vector3(3, 0, 3), target, raycaster)).toBe(false);
      expect(beam.position.toArray()).toEqual([0, 0, 1.5]);
      expect(room.visible).toBe(true);
      room.visible = false;
      expect(robotCameraHasOccluder(house, eye, target, raycaster)).toBe(false);
      room.visible = true;
      material.transparent = true;
      material.opacity = 0.35;
      expect(robotCameraHasOccluder(house, eye, target, raycaster)).toBe(false);
      material.opacity = 1;
      material.wireframe = true;
      expect(robotCameraHasOccluder(house, eye, target, raycaster)).toBe(false);
      material.wireframe = false;
      expect(robotCameraHasOccluder(house, target, target, raycaster)).toBe(false);
      expect(robotCameraHasOccluder(house, new Vector3(0, 0, -3), target, raycaster)).toBe(false);
    } finally {
      geometry.dispose();
      material.dispose();
    }
  });

  test("encloses all input points with mesh allowance without mutating them", () => {
    const points = [
      { x: -0.4, y: -0.8, z: -0.3 },
      { x: 0.6, y: 0.7, z: 0.5 },
    ];
    const before = JSON.stringify(points);
    const corners = robotCameraFramingCorners(points);
    expect(corners).toHaveLength(8);
    expect(Math.min(...corners.map((p) => p.x))).toBeCloseTo(-0.52, 12);
    expect(Math.max(...corners.map((p) => p.y))).toBeCloseTo(0.82, 12);
    expect(Math.min(...corners.map((p) => p.z))).toBeCloseTo(-0.42, 12);
    expect(JSON.stringify(points)).toBe(before);
    expect(robotCameraFramingCorners([])).toEqual([]);
    expect(() => robotCameraFramingCorners([{ x: NaN, y: 0, z: 0 }])).toThrow("Non-finite");
    expect(robotCameraTraceFramingCorners([])).toEqual([]);
    expect(() => robotCameraTraceFramingCorners([points, []])).toThrow("Inconsistent");
    expect(robotCameraTraceFramingCorners([points, points])).toHaveLength(16);
  });

  test("retains the base lens for distant bounds and caps impossible framing", () => {
    expect(robotCameraFittedFov(36, 2, [{ x: 0.1, y: 0.1, z: -8 }])).toBeCloseTo(36, 12);
    expect(robotCameraFittedFov(36, 0, [{ x: 1, y: 1, z: -1 }])).toBe(36);
    expect(robotCameraFittedFov(36, NaN, [])).toBe(36);
    expect(robotCameraFittedFov(36, 2, [{ x: 1, y: 1, z: 0 }])).toBe(100);
    expect(robotCameraFittedFov(36, 2, [{ x: NaN, y: 1, z: -1 }])).toBe(100);
    expect(robotCameraFittedFov(36, 0.1, [{ x: 10, y: 1, z: -1 }])).toBe(100);
  });

  test("fits actual owner poses after a shortened boom in portrait and landscape", async () => {
    const owner = await import("../public/wasm/fs-cmaes/v0623/fs_cmaes_viz_wasm.js");
    await owner.default({
      module_or_path: await Bun.file(
        new URL("../public/wasm/fs-cmaes/v0623/fs_cmaes_viz_wasm_bg.wasm", import.meta.url),
      ).arrayBuffer(),
    });
    let oldLensClippedPoints = 0;
    for (const challenge of ["flat", "terrain-and-push"] as const) {
      const evaluator = new owner.G1WalkingVizEvaluator(
        buildG1Config({ ...DEFAULT_G1_WALKING_CONFIG, challenge }),
      );
      try {
        const decoded = decodeG1Trace(evaluator.trace(evaluator.walking_curriculum_mean()));
        if (!("ok" in decoded)) throw new Error(decoded.refusal.name);
        const trace = decoded.ok;
        const before = JSON.stringify(trace);
        expect(trace.samples).toHaveLength(61);
        const bodyPoints = trace.samples.map((sample) => {
          const pelvis = new Vector3(
            sample.linkPoses[0].position[0],
            sample.linkPoses[0].position[2],
            -sample.linkPoses[0].position[1],
          );
          const points = sample.linkPoses.map((link) =>
            new Vector3(link.position[0], link.position[2], -link.position[1]).sub(pelvis),
          );
          expect(points).toHaveLength(30);
          points.push(points[15].clone().add(new Vector3(0, 0.45, 0)));
          return points;
        });
        const corners = robotCameraTraceFramingCorners(bodyPoints);
        for (const [width, height] of [
          [844, 390],
          [390, 844],
          [320, 568],
          [1024, 768],
        ]) {
          const baseFov = robotCameraVerticalFov(36, width, height);
          const camera = new PerspectiveCamera(baseFov, width / height, 0.05, 40);
          // Actual owner poses, but an explicitly geometric camera test, not
          // device proof. This boom is shorter than the unobstructed 2.6m boom.
          camera.position.set(1.1, 1, 1.45);
          camera.lookAt(0, 0.15, 0);
          camera.updateMatrixWorld();
          const cameraPoints = corners.map((p) =>
            new Vector3(p.x, p.y, p.z).applyMatrix4(camera.matrixWorldInverse),
          );
          for (const points of bodyPoints) {
            oldLensClippedPoints += points.filter((p) => {
              const projected = p.clone().project(camera);
              return Math.abs(projected.x) > 1 || Math.abs(projected.y) > 1;
            }).length;
          }
          const position = camera.position.clone();
          const orientation = camera.quaternion.clone();
          camera.fov = robotCameraFittedFov(baseFov, camera.aspect, cameraPoints);
          camera.updateProjectionMatrix();
          expect(camera.fov).toBeGreaterThanOrEqual(baseFov);
          expect(camera.fov).toBeLessThan(100);
          for (const points of bodyPoints) {
            for (const point of points) {
              const projected = point.clone().project(camera);
              expect(Math.abs(projected.x)).toBeLessThan(0.85);
              expect(Math.abs(projected.y)).toBeLessThan(0.85);
            }
          }
          expect(camera.position.equals(position)).toBe(true);
          expect(camera.quaternion.equals(orientation)).toBe(true);
          expect(camera.near).toBe(0.05);
          expect(camera.far).toBe(40);
        }
        expect(JSON.stringify(trace)).toBe(before);
      } finally {
        evaluator.free();
      }
    }
    // The same real poses fail the old fixed landscape lens. A no-op fitter
    // cannot turn this negative control into a passing projection suite.
    expect(oldLensClippedPoints).toBeGreaterThan(0);
  });
});
