/**
 * TanGorge — route repair v3 (final): component-aware anchor relocation,
 * A* on 5cm clearance grid (r=0.20, FREE_MIN=0.02), furthest-visible
 * simplification, anchor-name-preserving emission + audit.
 */
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

const comp = new Int32Array(NX * NY).fill(-1);
const sizes: number[] = [];
for (let s = 0; s < NX * NY; s++) {
  if (!free[s] || comp[s] !== -1) continue;
  const id = sizes.length;
  let size = 0;
  const stack = [s];
  comp[s] = id;
  while (stack.length) {
    const c = stack.pop()!;
    size++;
    const ci = c % NX, cj = (c / NX) | 0;
    for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
      const ni = ci + di, nj = cj + dj;
      if (ni < 0 || nj < 0 || ni >= NX || nj >= NY) continue;
      const n = nj * NX + ni;
      if (free[n] && comp[n] === -1) { comp[n] = id; stack.push(n); }
    }
  }
  sizes.push(size);
}
const MAIN = sizes.indexOf(Math.max(...sizes));

const toCellIdx = (x: number, y: number): [number, number] => [
  Math.min(NX - 1, Math.max(0, Math.floor((x - minX) / CELL))),
  Math.min(NY - 1, Math.max(0, Math.floor((y - minY) / CELL))),
];

function astar(s: [number, number], g: [number, number]): [number, number][] | null {
  const N = NX * NY;
  const start = s[1] * NX + s[0];
  const goal = g[1] * NX + g[0];
  if (!free[goal] || !free[start]) return null;
  const gScore = new Float64Array(N).fill(Infinity);
  const cameFrom = new Int32Array(N).fill(-1);
  const open: Array<[number, number]> = [[0, start]];
  gScore[start] = 0;
  const gi = goal % NX, gj = (goal / NX) | 0;
  const h = (idx: number) => {
    const di = Math.abs((idx % NX) - gi), dj = Math.abs(((idx / NX) | 0) - gj);
    return Math.max(di, dj) + 0.41421356 * Math.min(di, dj);
  };
  let guard = 0;
  while (open.length && guard++ < 2_000_000) {
    let bi = 0;
    for (let k = 1; k < open.length; k++) if (open[k][0] < open[bi][0]) bi = k;
    const [, cur] = open.splice(bi, 1)[0];
    if (cur === goal) {
      const path: [number, number][] = [];
      let c = cur;
      while (c !== -1) { path.push([minX + ((c % NX) + 0.5) * CELL, minY + (((c / NX) | 0) + 0.5) * CELL]); c = cameFrom[c]; }
      return path.reverse();
    }
    const ci = cur % NX, cj = (cur / NX) | 0;
    for (let dj = -1; dj <= 1; dj++)
      for (let di = -1; di <= 1; di++) {
        if (!di && !dj) continue;
        const ni = ci + di, nj = cj + dj;
        if (ni < 0 || nj < 0 || ni >= NX || nj >= NY) continue;
        const nIdx = nj * NX + ni;
        if (!free[nIdx]) continue;
        if (di && dj && (!free[cj * NX + ni] || !free[nj * NX + ci])) continue;
        const ng = gScore[cur] + (di && dj ? Math.SQRT2 : 1);
        if (ng < gScore[nIdx]) { gScore[nIdx] = ng; cameFrom[nIdx] = cur; open.push([ng + h(nIdx), nIdx]); }
      }
  }
  return null;
}

function segMinClear(x0: number, y0: number, x1: number, y1: number): number {
  const len = Math.hypot(x1 - x0, y1 - y0);
  const n = Math.max(1, Math.ceil(len / 0.02));
  let min = Infinity;
  for (let k = 0; k <= n; k++) {
    const t = k / n;
    min = Math.min(min, clearanceAt(x0 + t * (x1 - x0), y0 + t * (y1 - y0)));
  }
  return min;
}

// furthest-visible simplification (monotone guarantee)
function simplify(path: [number, number][]): [number, number][] {
  const out: [number, number][] = [];
  let anchor = 0;
  out.push(path[0]);
  while (anchor < path.length - 1) {
    let furthest = anchor + 1;
    for (let j = path.length - 1; j > anchor + 1; j--) {
      if (segMinClear(path[anchor][0], path[anchor][1], path[j][0], path[j][1]) >= 0.02) {
        furthest = j;
        break;
      }
    }
    out.push(path[furthest]);
    anchor = furthest;
  }
  return out;
}

function findSafeNear(ox: number, oy: number): [number, number] {
  const inMain = (x: number, y: number) => {
    const [i, j] = toCellIdx(x, y);
    return free[j * NX + i] && comp[j * NX + i] === MAIN;
  };
  if (clearanceAt(ox, oy) >= 0.1 && inMain(ox, oy)) return [ox, oy];
  let best: [number, number] | null = null;
  let bestScore = -Infinity;
  for (let rad = 0.1; rad <= 1.0; rad += 0.1)
    for (let a = 0; a < 360; a += 10) {
      const x = ox + rad * Math.cos((a * Math.PI) / 180);
      const y = oy + rad * Math.sin((a * Math.PI) / 180);
      if (!inMain(x, y)) continue;
      const c = clearanceAt(x, y);
      if (c >= 0.1) {
        const score = Math.min(c, 0.4) - rad * 0.5;
        if (score > bestScore) { bestScore = score; best = [x, y]; }
      }
    }
  if (best) return best;
  throw new Error(`no safe main-component position near (${ox},${oy})`);
}

console.log("=== repaired routes (anchors keep names; vias inserted) ===\n");
for (const route of CRAFTSMAN_WALKING_ROUTES) {
  const anchors = route.waypoints.map((wp) => findSafeNear(wp.pos[0], wp.pos[1]));
  const full: [number, number][] = [anchors[0]];
  let failed = false;
  for (let i = 0; i < anchors.length - 1; i++) {
    const seg = astar(toCellIdx(...anchors[i]), toCellIdx(...anchors[i + 1]));
    if (!seg) { console.log(`  !! ${route.id}: A* failed ${route.waypoints[i].name} -> ${route.waypoints[i + 1].name}`); failed = true; break; }
    full.push(...seg.slice(1));
  }
  if (failed) continue;
  const simple = simplify(full);

  // map simplified points to anchors by nearest distance (anchors must survive)
  const gates: Array<{ name: string; pos: [number, number]; speed: number; isAnchor: boolean }> = [];
  let cursor = 0;
  for (let a = 0; a < anchors.length; a++) {
    // nearest simplified index to this anchor from cursor forward
    let bestI = cursor, bestD = Infinity;
    for (let i = cursor; i < simple.length; i++) {
      const d = Math.hypot(simple[i][0] - anchors[a][0], simple[i][1] - anchors[a][1]);
      if (d < bestD) { bestD = d; bestI = i; }
    }
    // vias between cursor..bestI-1
    for (let i = cursor + 1; i < bestI; i++)
      gates.push({ name: `via`, pos: [+simple[i][0].toFixed(3), +simple[i][1].toFixed(3)], speed: 0.5, isAnchor: false });
    const orig = route.waypoints[a];
    gates.push({ name: orig.name, pos: [+anchors[a][0].toFixed(3), +anchors[a][1].toFixed(3)], speed: orig.speed, isAnchor: true });
    cursor = bestI;
  }

  let dist = 0, minC = Infinity;
  for (let i = 0; i < gates.length - 1; i++) {
    dist += Math.hypot(gates[i + 1].pos[0] - gates[i].pos[0], gates[i + 1].pos[1] - gates[i].pos[1]);
    minC = Math.min(minC, segMinClear(gates[i].pos[0], gates[i].pos[1], gates[i + 1].pos[0], gates[i + 1].pos[1]));
  }
  console.log(`  ${route.id}: gates=${gates.length} (anchors=${route.waypoints.length}) dist=${dist.toFixed(1)}m minClear=${minC.toFixed(3)}m`);
  let viaN = 0;
  for (const g of gates) {
    const nm = g.isAnchor ? g.name : `via ${++viaN}`;
    console.log(`    { name: ${JSON.stringify(nm)}, pos: [${g.pos[0]}, ${g.pos[1]}], speed: ${g.speed} },`);
  }
  console.log();
}
