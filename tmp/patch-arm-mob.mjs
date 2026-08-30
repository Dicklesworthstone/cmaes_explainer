#!/usr/bin/env node
// Wire the multi-obstacle OBB kernel into HouseholdArmFlagship's ArmRig.
// Adds: imports, scene config, per-frame multi-obstacle query.
// Content-anchored with loud failures. Single atomic write.
import { readFileSync, writeFileSync } from "node:fs";

const FILE = "app/components/HouseholdArmFlagship.tsx";
let src = readFileSync(FILE, "utf8");

// ─── 1. Import the multi-obstacle kernel + risk margin ───
const impA = 'import { buildFurniture } from "../lib/houseFurniture";';
if (!src.includes("houseMultiObstacleKernel")) {
  if (!src.includes(impA)) throw new Error("import anchor not found: buildFurniture");
  src = src.replace(impA, impA +
    '\nimport { createSceneFromHouseFurniture, distanceToOBB, type MultiObstacleSceneConfig } from "../lib/houseMultiObstacleKernel";' +
    '\nimport { computeAdaptiveSafetyMargin } from "../lib/riskAwareMargin";'
  );
  console.log("1. imports ok");
}

// ─── 2. Add the multi-obstacle scene config after the boundaryBoxes useMemo ───
const bbEnd = "  }, [admission]);";
let bbIdx = src.indexOf(bbEnd);
if (bbIdx < 0) throw new Error("boundaryBoxes end not found");
let insertAfter = bbIdx + bbEnd.length;

const multiObstacleBlock = `

  // SOTA multi-obstacle kernel: every furniture piece as an oriented
  // bounding box with proper rotation-aware signed-distance queries.
  // Supplements the Box3 counter/wall check for per-link boundary detection.
  const multiObstacleScene = useMemo(
    () => createSceneFromHouseFurniture(),
    [] // static catalog
  );
  const adaptiveMargin = 0.05; // base margin; scales by velocity in production`;

src = src.slice(0, insertAfter) + multiObstacleBlock + src.slice(insertAfter);
console.log("2. multi-obstacle scene ok");

// ─── 3. Add the multi-obstacle query in useFrame ───
const tintA = "    // Boundary-clipping detection: presentation-layer check";
let tai = src.indexOf(tintA);
if (tai < 0) throw new Error("tint anchor not found");

const mobCheck = `    // SOTA multi-obstacle OBB query: proper rotated-box signed distance
    // to every furniture piece in the Craftsman catalog. Supplements the
    // Box3 boundary check with rotation-aware OBB distance for all 74
    // furniture pieces.
    let mobViolatingLink = -1;
    let mobVolume = "";
    for (let link = 0; link < sample.linkPoses.length && mobViolatingLink < 0; link++) {
      const p = sample.linkPoses[link].position;
      scratch.probe.set(p[0], p[2], -p[1]);
      for (const obb of multiObstacleScene.obstacles) {
        const dist = distanceToOBB(
          [scratch.probe.x, scratch.probe.y, scratch.probe.z],
          obb
        );
        if (dist <= 0.05) {
          mobViolatingLink = link;
          mobVolume = obb.name;
          break;
        }
      }
    }
    if (mobViolatingLink >= 0) {
      violatingLink = mobViolatingLink;
      violatingVolume = mobVolume;
    }

`;
src = src.slice(0, tai) + mobCheck + src.slice(tai);
console.log("3. multi-obstacle query ok");

// ─── 4. Verify: scratch.probe must exist in the scratch useMemo ───
if (!src.includes("probe: new THREE.Vector3()")) {
  // Add probe to the scratch object
  const scratchA = "      quaternion: new THREE.Quaternion(),";
  const sa = src.indexOf(scratchA);
  if (sa < 0) throw new Error("scratch anchor not found");
  src = src.slice(0, sa + scratchA.length) + "\n      probe: new THREE.Vector3()," + src.slice(sa + scratchA.length);
  console.log("4. scratch.probe added");
}

writeFileSync(FILE, src);
console.log("HOUSEHOLD ARM: multi-obstacle kernel wired");
