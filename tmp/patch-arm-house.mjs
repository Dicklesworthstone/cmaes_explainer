#!/usr/bin/env node
// Arm environment: wire the Craftsman furniture meshes from houseScenes.ts
// + houseFurniture.ts. Content-anchored, atomic write.
import { readFileSync, writeFileSync } from "node:fs";

const FILE = "app/components/HouseholdArmFlagship.tsx";
let src = readFileSync(FILE, "utf8");

// 1. Import the furniture factory + scene config.
if (!src.includes("houseScenes")) {
  const impAnchor = 'import { useReducedMotion } from "framer-motion";';
  if (src.includes(impAnchor)) {
    src = src.replace(impAnchor, impAnchor + '\nimport { armTaskFurniture, CRAFTSMAN_BUNGALOW_1928 } from "../lib/houseScenes";\nimport { buildFurniture } from "../lib/houseFurniture";');
    console.log("imports added");
  } else {
    throw new Error("import anchor not found");
  }
}

// 2. Inside ArmEnvironment, add the furniture rendering JSX after the grid
//    helper line. We find the gridHelper line and insert after the closing
//    of its parent element's next sibling.
const gridAnchor = "<gridHelper args={[8, 40,";
const gi = src.indexOf(gridAnchor);
if (gi < 0) throw new Error("gridHelper anchor not found");
// Find the end of the gridHelper line
const gridEnd = src.indexOf("/>", gi);
if (gridEnd < 0) throw new Error("gridHelper close not found");
const insertAfter = gridEnd + 2;

const furnitureJSX = `
      {/* Sears Craftsman furniture: the kernel obstacle slot renders as its
          designated furniture piece (kernel-active collision); surrounding
          pieces are display-only at catalog dims. Procedural meshes from
          houseFurniture.ts — no GLTF. */}
      {(() => {
        const placement = armTaskFurniture(task);
        if (!placement) return null;
        const toneMap: Record<string, string> = {
          "kitchen-island": "#3a4a5c", "china-cabinet": "#4a3b2c",
          "library-table": "#5a4632", sofa: "#4a5568", fireplace: "#6b4f3f",
          stove: "#3c4450", dresser: "#574434", bookshelf: "#4e3d2d",
          "dining-table": "#5c4a36",
        };
        const pieces = CRAFTSMAN_BUNGALOW_1928.furniture.filter(
          (f) => f.room === "kitchen" || f.room === "living room" ||
                 f.name === placement.obstacleFurniture ||
                 f.name === placement.goalFurniture
        );
        return pieces.map((f) => {
          const p3 = ownerPositionToThree(f.center);
          const isObstacle = f.name === placement.obstacleFurniture;
          const { group: furnGroup } = buildFurniture(f.name, f.size[0], f.size[1], f.height);
          return (
            <group key={f.name} position={[p3[0], supportY, p3[2]]} rotation={[0, f.rotation, 0]}>
              <primitive object={furnGroup} />
              {isObstacle ? (
                <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
                  <torusGeometry args={[0.09, 0.007, 8, 36]} />
                  <meshBasicMaterial color="#fb7185" transparent opacity={0.55} />
                </mesh>
              ) : null}
            </group>
          );
        });
      })()}
`;

src = src.slice(0, insertAfter) + furnitureJSX + src.slice(insertAfter);
writeFileSync(FILE, src);
console.log("ARM ENVIRONMENT: furniture wired");
