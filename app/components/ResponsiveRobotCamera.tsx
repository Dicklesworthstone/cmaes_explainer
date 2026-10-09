"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { robotCameraVerticalFov } from "../lib/robotCameraFraming";

export function ResponsiveRobotCamera({
  fov,
  ...props
}: {
  position: [number, number, number];
  fov: number;
  near: number;
  far: number;
}) {
  const size = useThree((state) => state.size);
  return (
    <PerspectiveCamera
      {...props}
      makeDefault
      fov={robotCameraVerticalFov(fov, size.width, size.height)}
    />
  );
}
