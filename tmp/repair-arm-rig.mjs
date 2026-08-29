#!/usr/bin/env node
// Repair: reconstruct ArmRig's scratch + useFrame (boundary checker woven in
// cleanly). Content-anchored replacement from the boundaryBoxes useMemo tail
// through the end of useFrame. No allocations per frame, no wall clock.
import { readFileSync, writeFileSync } from "node:fs";

const FILE = "app/components/HouseholdArmFlagship.tsx";
let src = readFileSync(FILE, "utf8");

const startAnchor = "  const boundaryStateRef = useRef(";
const endAnchor = "    if (objectRef.current) applyOwnerPose(objectRef.current, sample.objectPose);";
const a = src.indexOf(startAnchor);
if (a < 0) throw new Error("start anchor not found");
const b = src.indexOf(endAnchor, a);
if (b < 0) throw new Error("end anchor not found");

const replacement = `  const boundaryStateRef = useRef({ key: "", lastTick: 0 });
  const frameTick = useRef(0);
  const scratch = useMemo(
    () => ({
      start: new THREE.Vector3(),
      end: new THREE.Vector3(),
      direction: new THREE.Vector3(),
      midpoint: new THREE.Vector3(),
      yAxis: new THREE.Vector3(0, 1, 0),
      quaternion: new THREE.Quaternion(),
      probe: new THREE.Vector3(),
    }),
    []
  );

  useFrame((_, deltaSeconds) => {
    const samples = trace.samples;
    if (samples.length === 0) return;
    const duration = samples.at(-1)?.timeSeconds ?? 0;
    if (reduceMotion) {
      sampleIndex.current = samples.length - 1;
    } else if (duration > 0) {
      playbackSeconds.current =
        (playbackSeconds.current + Math.min(deltaSeconds, 0.1) * 0.72) % duration;
      if (samples[sampleIndex.current]?.timeSeconds > playbackSeconds.current) {
        sampleIndex.current = 0;
      }
      while (
        sampleIndex.current + 1 < samples.length &&
        samples[sampleIndex.current + 1].timeSeconds <= playbackSeconds.current
      ) {
        sampleIndex.current += 1;
      }
    }
    const sample: HouseholdManipulationTraceSample = samples[sampleIndex.current];
    for (let link = 0; link < sample.linkPoses.length; link++) {
      const group = linkRefs.current[link];
      if (group) applyOwnerPose(group, sample.linkPoses[link]);
      if (link === 0) continue;
      const segment = segmentRefs.current[link - 1];
      if (!segment) continue;
      const parent = sample.linkPoses[link - 1].position;
      const child = sample.linkPoses[link].position;
      scratch.start.set(parent[0], parent[2], -parent[1]);
      scratch.end.set(child[0], child[2], -child[1]);
      scratch.direction.subVectors(scratch.end, scratch.start);
      const length = Math.max(0.025, scratch.direction.length());
      scratch.midpoint.addVectors(scratch.start, scratch.end).multiplyScalar(0.5);
      scratch.quaternion.setFromUnitVectors(
        scratch.yAxis,
        scratch.direction.multiplyScalar(1 / length)
      );
      segment.position.copy(scratch.midpoint);
      segment.quaternion.copy(scratch.quaternion);
      segment.scale.set(1, length, 1);
    }
    if (objectRef.current) applyOwnerPose(objectRef.current, sample.objectPose);
    const halfWidth = 0.5 * sample.gripperWidthMeters;
    if (leftFingerRef.current) leftFingerRef.current.position.x = -halfWidth;
    if (rightFingerRef.current) rightFingerRef.current.position.x = halfWidth;
    if (contactRingRef.current) {
      const forceScale = 1 + Math.min(1.2, sample.gripNormalForceNewtons / 14);
      contactRingRef.current.scale.setScalar(forceScale);
      contactRingRef.current.visible = sample.gripNormalForceNewtons > 0.01;
    }
    if (contactMaterialRef.current) {
      contactMaterialRef.current.opacity = sample.grasped ? 0.95 : 0.45;
      contactMaterialRef.current.color.setHex(sample.grasped ? 0x34d399 : 0xfbbf24);
    }

    // Boundary-clipping detection: presentation-layer check of every arm link
    // origin against the declared counter/wall/obstacle volumes. A hit tints
    // that link's meshes red until the set of violations changes.
    frameTick.current += 1;
    let violatingLink = -1;
    let violatingVolume = "";
    for (let link = 0; link < sample.linkPoses.length && violatingLink < 0; link++) {
      const p = sample.linkPoses[link].position;
      scratch.probe.set(p[0], p[2], -p[1]);
      for (const { name, box } of boundaryBoxes) {
        if (box.distanceToPoint(scratch.probe) <= 0.05) {
          violatingLink = link;
          violatingVolume = name;
          break;
        }
      }
    }
    const violationKey = violatingLink < 0 ? "" : \`\${violatingLink}:\${violatingVolume}\`;
    if (violationKey !== boundaryStateRef.current.key && frameTick.current % 6 === 0) {
      boundaryStateRef.current.key = violationKey;
      for (let link = 0; link < sample.linkPoses.length; link++) {
        const group = linkRefs.current[link];
        if (!group) continue;
        const hot = link === violatingLink;
        group.traverse((child) => {
          const mesh = child as THREE.Mesh;
          const mat = mesh.material as THREE.MeshStandardMaterial | undefined;
          if (mat && "emissive" in mat) mat.emissive.setHex(hot ? 0xdc2626 : 0x000000);
        });
      }
    }
    `;

src = src.slice(0, a) + replacement + src.slice(b);
writeFileSync(FILE, src);
console.log("ARMRIG USEFRAME RECONSTRUCTED OK");
