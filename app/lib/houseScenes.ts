// House scenes: Sears Modern Homes (Craftsman-era catalog houses, ~1908-1940)
// floorplan data driving the house environments for BOTH robots.
//
// Provenance and honesty:
// - Room layouts are period-plausible simplifications of Sears Modern Homes
//   bungalow plans (e.g., the Ashmore / Valmont class: front porch, living
//   room with fireplace, dining room, kitchen, two bedrooms, bath).
//   Dimensions are catalog-plausible approximations — labeled as such; they
//   are set dressing and obstacle envelopes, not archival reproductions.
// - Coordinate system: owner frame (x lateral, y forward, z up), meters.
//   The full floorplan is in whole-house meters; the arm counter corner is
//   exported separately at counter scale for the arm stage slots.
//
// Layering contract:
// - Presentation layers (arm stage, G1 backdrop) render walls/furniture from
//   this module — single source of truth for both robots.
// - Physics: until the kernel supports multi-obstacle scenes (bead
//   cmaes-u53), exactly ONE furniture piece per task maps into the kernel's
//   single obstacle slot; everything else is display-only and labeled.

export interface HouseFurniture {
  /** Stable identifier, e.g. "dining-table". */
  name: string;
  room: string;
  /** Footprint center in whole-house meters [x, y]. */
  center: [number, number];
  /** Footprint size [dx, dy] in meters. */
  size: [number, number];
  /** Height in meters. */
  height: number;
  /** Yaw in radians (owner frame). */
  rotation: number;
  /** Period-catalog approximation note. */
  note: string;
}

export interface HouseRoom {
  name: string;
  center: [number, number];
  size: [number, number];
}

export interface HouseWall {
  from: [number, number];
  to: [number, number];
  thickness: number;
  height: number;
  /** Doorway gaps along the wall: [offset-from-start, width] in meters. */
  doorways: Array<{ at: number; width: number }>;
}

export interface HouseSceneConfig {
  model: string;
  catalogYear: number;
  citation: string;
  /** Whole-house bounds in meters. */
  bounds: { min: [number, number]; max: [number, number] };
  rooms: HouseRoom[];
  walls: HouseWall[];
  furniture: HouseFurniture[];
  /** G1 walking start: [x, y, heading-rad]. */
  startPose: [number, number, number];
  goals: Array<{ name: string; center: [number, number]; radius: number }>;
}

export interface ArmCounterPlacement {
  /** Furniture piece mapped into the kernel obstacle slot. */
  obstacleFurniture: string;
  /** Furniture piece carrying the placement goal ring. */
  goalFurniture: string;
  /** Counter-scale offsets applied to the corner furniture set (meters). */
  note: string;
}

const base = {
  catalogYear: 1928,
  citation:
    "Sears Modern Homes program (1908-1940); layout a period-plausible " +
    "simplification of the Craftsman bungalow class. Dimensions approximate.",
};

/** Craftsman bungalow: porch -> living (fireplace) -> dining -> kitchen;
 *  bedroom/bath wing across a central hall. */
export const CRAFTSMAN_BUNGALOW_1928: HouseSceneConfig = {
  model: "Sears Craftsman Bungalow (Ashmore class)",
  ...base,
  bounds: { min: [-4, -5.5], max: [4, 5.5] },
  rooms: [
    { name: "entry porch", center: [0, 5.0], size: [4.4, 1.6] },
    { name: "living room", center: [-1.4, 2.6], size: [4.4, 4.2] },
    { name: "dining room", center: [1.6, 2.4], size: [2.8, 3.4] },
    { name: "kitchen", center: [1.9, -0.6], size: [2.6, 2.6] },
    { name: "central hall", center: [0.2, 0.2], size: [1.6, 3.2] },
    { name: "bedroom", center: [-1.8, -1.9], size: [3.4, 3.0] },
    { name: "second bedroom", center: [1.9, -2.6], size: [2.6, 2.4] },
    { name: "bath", center: [0.4, -2.9], size: [1.4, 1.8] },
  ],
  walls: [
    // Exterior envelope (counterclockwise corners) with the front-porch opening.
    { from: [-4, -5.5], to: [-4, 5.5], thickness: 0.12, height: 2.5, doorways: [] },
    { from: [-4, 5.5], to: [4, 5.5], thickness: 0.12, height: 2.5, doorways: [{ at: 4.0, width: 2.6 }] },
    { from: [4, 5.5], to: [4, -5.5], thickness: 0.12, height: 2.5, doorways: [] },
    { from: [4, -5.5], to: [-4, -5.5], thickness: 0.12, height: 2.5, doorways: [] },
    // Living / dining divider with a wide cased opening.
    { from: [0.2, 0.8], to: [0.2, 4.4], thickness: 0.1, height: 2.5, doorways: [{ at: 2.2, width: 1.2 }] },
    // Dining / kitchen divider with a door.
    { from: [0.6, 0.7], to: [3.2, 0.7], thickness: 0.1, height: 2.5, doorways: [{ at: 0.9, width: 0.95 }] },
    // Hall to bedrooms.
    { from: [-3.5, -1.3], to: [3.2, -1.3], thickness: 0.1, height: 2.5, doorways: [{ at: 2.9, width: 0.95 }, { at: 5.9, width: 0.9 }] },
    // Bath partitions.
    { from: [-0.3, -1.3], to: [-0.3, -3.8], thickness: 0.1, height: 2.5, doorways: [{ at: 1.6, width: 0.8 }] },
  ],
  furniture: [
    { name: "fireplace", room: "living room", center: [-3.3, 2.6], size: [0.4, 1.4], height: 1.3, rotation: 0, note: "brick surround, catalog feature" },
    { name: "sofa", room: "living room", center: [-1.2, 3.9], size: [1.9, 0.85], height: 0.8, rotation: 0, note: "period Mission-style silhouette" },
    { name: "library table", room: "living room", center: [-1.2, 1.6], size: [1.1, 0.6], height: 0.75, rotation: 0, note: "Craftsman oak table" },
    { name: "dining-table", room: "dining room", center: [1.6, 2.6], size: [1.4, 0.9], height: 0.76, rotation: 0, note: "solid oak, six chairs" },
    { name: "china-cabinet", room: "dining room", center: [2.85, 3.4], size: [0.45, 1.1], height: 1.8, rotation: 0, note: "built-in china niche" },
    { name: "kitchen-island", room: "kitchen", center: [1.9, 0.15], size: [1.3, 0.7], height: 0.92, rotation: 0, note: "hoosier-style work table" },
    { name: "stove", room: "kitchen", center: [2.9, -1.4], size: [0.75, 0.65], height: 0.95, rotation: 0, note: "cast-iron range" },
    { name: "bed-master", room: "bedroom", center: [-2.6, -2.9], size: [1.4, 1.9], height: 0.6, rotation: 0, note: "iron-frame bed" },
    { name: "dresser", room: "bedroom", center: [-0.9, -3.1], size: [1.1, 0.5], height: 0.95, rotation: 0, note: "oak dresser" },
    { name: "bookshelf", room: "living room", center: [-3.6, 4.6], size: [0.35, 1.2], height: 1.9, rotation: 0, note: "built-in craftsman shelving" },
  ],
  startPose: [0, 4.6, Math.PI],
  goals: [
    { name: "parlor-center", center: [-1.4, 2.6], radius: 0.5 },
    { name: "dining-nook", center: [1.6, 2.6], radius: 0.5 },
    { name: "kitchen-corner", center: [1.9, -0.6], radius: 0.5 },
    { name: "master-bedroom", center: [-1.8, -1.9], radius: 0.5 },
  ],
};

/** Arm counter-corner placement: which furniture fills the kernel's single
 *  obstacle slot and which carries the placement goal, per arm task. */
export const ARM_COUNTER_PLACEMENTS: Record<
  string,
  ArmCounterPlacement
> = {
  "kitchen-mug": {
    obstacleFurniture: "kitchen-island",
    goalFurniture: "china-cabinet",
    note: "kitchen corner of the Craftsman bungalow; island is the kernel obstacle",
  },
  "living-room-remote": {
    obstacleFurniture: "library-table",
    goalFurniture: "sofa",
    note: "parlor corner; library table is the kernel obstacle",
  },
  "backyard-trowel": {
    obstacleFurniture: "dresser",
    goalFurniture: "bookshelf",
    note: "porch workbench arrangement; dresser is the kernel obstacle",
  },
};

/** The designated furniture piece for an arm task, as a kernel-slot-sized
 *  obstacle envelope in counter-stage coordinates. The arm stage counter is
 *  ~2.3 x 1.65 m at the origin, so the furniture box is centered relative to
 *  the declared obstacle slot (admission.scene.obstacleCenterMeters). */
export function armTaskFurniture(task: string): {
  obstacle: HouseFurniture;
  goal: HouseFurniture;
  placement: ArmCounterPlacement;
} | null {
  const placement = ARM_COUNTER_PLACEMENTS[task];
  if (!placement) return null;
  const obstacle = CRAFTSMAN_BUNGALOW_1928.furniture.find(
    (f) => f.name === placement.obstacleFurniture
  );
  const goal = CRAFTSMAN_BUNGALOW_1928.furniture.find(
    (f) => f.name === placement.goalFurniture
  );
  if (!obstacle || !goal) return null;
  return { obstacle, goal, placement };
}

/** Whole-scene accessor used by both stages. */
export function houseScene(): HouseSceneConfig {
  return CRAFTSMAN_BUNGALOW_1928;
}
