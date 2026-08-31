/**
 * TanGorge — estate route collision audit (ad-hoc, read-only).
 * Samples every CRAFTSMAN_WALKING_ROUTES polyline and queries the
 * furniture multi-obstacle scene, mirroring simulateG1HouseNavigationChallenge
 * conventions (query z = 0.5, robotRadius default 0.20).
 */
import { CRAFTSMAN_WALKING_ROUTES } from "../app/lib/craftsmanCatalogData";
import {
  createSceneFromHouseFurniture,
  queryMultiObstacleScene,
} from "../app/lib/houseMultiObstacleKernel";

const scene = createSceneFromHouseFurniture();
const STEP_M = 0.02;

for (const robotRadius of [0.2, 0.25] as const) {
  console.log(`\n=== robotRadius = ${robotRadius} m ===`);
  for (const route of CRAFTSMAN_WALKING_ROUTES) {
    let minClearance = Infinity;
    let worst: [number, number] | null = null;
    let worstNearest = "";
    let penetrations = 0;
    let samples = 0;

    const wps = route.waypoints;
    for (let i = 0; i < wps.length - 1; i++) {
      const [x0, y0] = wps[i].pos;
      const [x1, y1] = wps[i + 1].pos;
      const len = Math.hypot(x1 - x0, y1 - y0);
      const n = Math.max(1, Math.ceil(len / STEP_M));
      for (let k = 0; k <= n; k++) {
        const t = k / n;
        const x = x0 + t * (x1 - x0);
        const y = y0 + t * (y1 - y0);
        const res = queryMultiObstacleScene(
          { position: [x, 0.5, y], robotRadius, safetyMargin: 0.04 },
          scene,
        );
        samples++;
        if (res.minimumClearanceMeters < minClearance) {
          minClearance = res.minimumClearanceMeters;
          worst = [x, y];
          worstNearest = res.nearestObstacleName ?? "?";
        }
        if (res.minimumClearanceMeters < 0) penetrations++;
      }
    }
    const flag =
      penetrations > 0 ? "PENETRATION" : minClearance < 0.05 ? "TIGHT" : "ok";
    console.log(
      `${flag.padEnd(12)} ${route.id.padEnd(20)} minClearance=${minClearance.toFixed(3)}m samples=${samples} penetrations=${penetrations}` +
        (worst ? ` worst@(${worst[0].toFixed(2)},${worst[1].toFixed(2)}) near=${worstNearest}` : ""),
    );
  }
}

console.log(`\nscene obstacles: ${scene.obstacles.length}`);
for (const o of scene.obstacles.slice(0, 8)) {
  console.log(
    `  ${o.id.padEnd(24)} c=(${o.center[0].toFixed(2)},${o.center[1].toFixed(2)},${o.center[2].toFixed(2)}) he=(${o.halfExtents[0].toFixed(2)},${o.halfExtents[1].toFixed(2)},${o.halfExtents[2].toFixed(2)}) soft=${o.exemptFromPenalty === true}`,
  );
}
