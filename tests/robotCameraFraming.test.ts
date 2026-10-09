import { describe, expect, test } from "bun:test";
import { PerspectiveCamera, Vector3 } from "three";
import { robotCameraVerticalFov } from "../app/lib/robotCameraFraming";

describe("robot camera portrait framing", () => {
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
