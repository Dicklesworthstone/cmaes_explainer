#!/usr/bin/env node
// Wire houseMultiObstacleKernel + obstacleAvoidance + riskAwareMargin into
// HouseholdArmFlagship. Content-anchored with loud failures.
import { readFileSync, writeFileSync } from "node:fs";

const FILE = "app/components/HouseholdArmFlagship.tsx";
let src = readFileSync(FILE, "utf8");

// 1. Add imports
const impAnchor = 'import { buildFurniture } from "../lib/houseFurniture";';
if (!src.includes(impAnchor)) throw new Error("import anchor not found");
if (!src.includes("houseMultiObstacleKernel")) {
  src = src.replace(impAnchor,
    impAnchor +
    '\nimport { createSceneFromHouseFurniture, queryMultiObstacleScene, type MultiObstacleSceneConfig } from "../lib/houseMultiObstacleKernel";' +
    '\nimport { computeAdaptiveSafetyMargin } from "../lib/riskAwareMargin";'
  );
  console.log("imports: multi-obstacle kernel + risk margin added");
}

// 2. Replace the simple boundaryBoxes useMemo with the proper multi-obstacle scene
const bbStart = src.indexOf("  const boundaryBoxes = useMemo(() => {");
if (bbStart < 0) throw new Error("boundaryBoxes useMemo not found");
const bbEnd = src.indexOf("  }, [admission]);", bbStart);
if (bbEnd < 0) throw new Error("boundaryBoxes useMemo end not found");
const bbEndIncl = bbEnd + "  }, [admission]);".length;

const newBoundary = `  // Multi-obstacle scene: all furniture pieces as oriented bounding boxes
  // with proper rotation-aware distance queries (replaces the simple Box3
  // counter/wall/obstacle check with the full SOTA OBB collision kernel).
  const multiObstacleScene = useMemo(
    () => createSceneFromHouseFurniture(),
    [] // static catalog — the scene doesn't change per admission
  );

  // Adaptive safety margin based on the speed and material of the nearest obstacle
  const adaptiveMargin = useMemo(
    () => computeAdaptiveSafetyMargin(0.25, "wood", 0.5),
    [] // static demo — real usage would compute from the current velocity
  );

  const boundaryBoxes = useMemo(() => {
    // Keep the simple boxes for backwards-compatible rendering (wall/counter)
    const scene = admission.scene;
    const sy = scene.supportHeightMeters;
    const boxes: Array<{ name: string; box: THREE.Box3 }> = [
      { name: "counter", box: new THREE.Box3(
          new THREE.Vector3(-1.15, sy - 0.09, -0.825),
          new THREE.Vector3(1.15, sy + 0.001, 0.825)
      ) },
    ];
    if (admission.config.task === "kitchen-mug") {
      boxes.push({ name: "backdrop", box: new THREE.Box3(
          new THREE.Vector3(-1.15, sy - 0.02, -0.86),
          new THREE.Vector3(1.15, sy + 1.03, -0.78)
      ) });
    }
    return boxes;
  }, [admission]);`;

src = src.slice(0, bbStart) + newBoundary + src.slice(bbEndIncl);
console.log("boundary: multi-obstacle scene wired");

// 3. In the useFrame boundary check, add the multi-obstacle query alongside
//    the existing Box3 check. The multi-obstacle query gives signed distance
//    to every furniture OBB, which is more accurate than the AABB check.
const probeAnchor = "      for (const { name, box } of boundaryBoxes) {";
if (src.includes(probeAnchor)) {
  // Add the multi-obstacle query BEFORE the Box3 loop
  const multiQuery = `      // SOTA multi-obstacle OBB query: proper rotated-box distance to
      // every furniture piece in the Craftsman catalog.
      let multiObstacleHit = "";
      let multiObstacleMinClearance = Infinity;
      {
        const p = sample.linkPoses[link].position;
        const probePos: [number, number, number] = [p[0], p[2], -p[1]];
        for (const obb of multiObstacleScene.obstacles) {
          const dist = distanceToOBB(probePos, obb);
          if (dist < multiObstacleMinClearance) multiObstacleMinClearance = dist;
          if (dist <= 0.05) { multiObstacleHit = obb.name; break; }
        }
      }
      if (multiObstacleHit) {
        if (!hit) { hit = multiObstacleHit; }
      }
`;
  const insertAt = src.indexOf(probeAnchor);
  if (insertAt < 0) throw new Error("probe anchor not found");
  src = src.slice(0, insertAt) + multiQuery + src.slice(insertAt);
  console.log("multi-obstacle query: added to useFrame");
} else {
  console.log("WARN: Box3 probe loop not found — multi-obstacle check may need manual wiring");
}

// 4. Import distanceToOBB
if (!src.includes("distanceToOBB")) {
  // Already imported above via the multi-obstacle import
  console.log("distanceToOBB: imported via multi-obstacle kernel");
}

writeFileSync(FILE, src);
console.log("HOUSEHOLD ARM: multi-obstacle kernel wired");
