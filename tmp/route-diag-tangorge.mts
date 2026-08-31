/** TanGorge — connectivity diagnostic for the estate route grid. */
import { CRAFTSMAN_WALKING_ROUTES } from "../app/lib/craftsmanCatalogData";
import {
  createSceneFromHouseFurniture,
  queryMultiObstacleScene,
} from "../app/lib/houseMultiObstacleKernel";

const scene = createSceneFromHouseFurniture();
const R = 0.2;

function clearanceAt(x: number, y: number): number {
  return queryMultiObstacleScene(
    { position: [x, 0.5, y], robotRadius: R, safetyMargin: 0.04 },
    scene,
  ).minimumClearanceMeters;
}

let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
for (const o of scene.obstacles) {
  minX = Math.min(minX, o.center[0] - o.halfExtents[0]);
  maxX = Math.max(maxX, o.center[0] + o.halfExtents[0]);
  minY = Math.min(minY, o.center[2] - o.halfExtents[2]);
  maxY = Math.max(maxY, o.center[2] + o.halfExtents[2]);
}
minX -= 0.5; maxX += 0.5; minY -= 0.5; maxY += 0.5;
const CELL = 0.05;
const NX = Math.ceil((maxX - minX) / CELL);
const NY = Math.ceil((maxY - minY) / CELL);

const FREE_MIN = 0.02;
const free = new Uint8Array(NX * NY);
for (let j = 0; j < NY; j++)
  for (let i = 0; i < NX; i++)
    free[j * NX + i] =
      clearanceAt(minX + (i + 0.5) * CELL, minY + (j + 0.5) * CELL) >= FREE_MIN ? 1 : 0;

// flood fill components (4-connected)
const comp = new Int32Array(NX * NY).fill(-1);
let nComp = 0;
const sizes: number[] = [];
for (let s = 0; s < NX * NY; s++) {
  if (!free[s] || comp[s] !== -1) continue;
  const id = nComp++;
  let size = 0;
  const stack = [s];
  comp[s] = id;
  while (stack.length) {
    const c = stack.pop()!;
    size++;
    const ci = c % NX;
    const cj = (c / NX) | 0;
    for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
      const ni = ci + di, nj = cj + dj;
      if (ni < 0 || nj < 0 || ni >= NX || nj >= NY) continue;
      const n = nj * NX + ni;
      if (free[n] && comp[n] === -1) {
        comp[n] = id;
        stack.push(n);
      }
    }
  }
  sizes.push(size);
}
const ranked = sizes.map((s, i) => [s, i] as const).sort((a, b) => b[0] - a[0]).slice(0, 6);
console.log(`components: ${nComp}; top: ${ranked.map(([s, i]) => `#${i}:${s}`).join(" ")}`);

function compAt(x: number, y: number): number {
  const i = Math.floor((x - minX) / CELL);
  const j = Math.floor((y - minY) / CELL);
  return comp[j * NX + i];
}

function findSafeNear(ox: number, oy: number): [number, number] {
  if (clearanceAt(ox, oy) >= 0.1) return [ox, oy];
  let best: [number, number] = [ox, oy];
  let bestScore = -Infinity;
  for (let rad = 0.1; rad <= 1.2; rad += 0.1)
    for (let a = 0; a < 360; a += 10) {
      const x = ox + rad * Math.cos((a * Math.PI) / 180);
      const y = oy + rad * Math.sin((a * Math.PI) / 180);
      const c = clearanceAt(x, y);
      if (c >= 0.1) {
        const score = Math.min(c, 0.4) - rad * 0.5;
        if (score > bestScore) { bestScore = score; best = [x, y]; }
      }
    }
  return best;
}

console.log("\nanchor components:");
for (const route of CRAFTSMAN_WALKING_ROUTES)
  for (const wp of route.waypoints) {
    const [x, y] = findSafeNear(wp.pos[0], wp.pos[1]);
    const c = compAt(x, y);
    console.log(`  ${route.id.padEnd(18)} ${wp.name.padEnd(24)} @(${x.toFixed(2)},${y.toFixed(2)}) comp=${c}${c >= 0 ? ` (size ${sizes[c]})` : " BLOCKED"}`);
  }

// required robot radius along the failing straight lines
function maxRadiusNeeded(x0: number, y0: number, x1: number, y1: number): number {
  // for the line to pass at radius r: clearance(r) = clearance(0.2) + 0.2 - r >= 0
  // need min over line of clearanceAt >= r - 0.2... i.e. rMax = 0.2 + min clearance
  const len = Math.hypot(x1 - x0, y1 - y0);
  const n = Math.max(1, Math.ceil(len / 0.02));
  let minC = Infinity;
  for (let k = 0; k <= n; k++) {
    const t = k / n;
    minC = Math.min(minC, clearanceAt(x0 + t * (x1 - x0), y0 + t * (y1 - y0)));
  }
  return 0.2 + minC;
}
console.log("\nrequired radius along original straight segments (grand-tour Colonnade->Dining, dining Buffet->KitchenDoor, kitchen PrepIsland->Hoosier):");
console.log(`  colonnade(0.4,2.2)->dining(1.6,2.4): ${maxRadiusNeeded(0.4, 2.2, 1.6, 2.4).toFixed(3)}m`);
console.log(`  buffet(2.1,0.8)->kitDoor(2.1,-0.2): ${maxRadiusNeeded(2.1, 0.8, 2.1, -0.2).toFixed(3)}m`);
console.log(`  prepIsland(2,-1)->hoosier(1.1,-2.3): ${maxRadiusNeeded(2, -1, 1.1, -2.3).toFixed(3)}m`);
