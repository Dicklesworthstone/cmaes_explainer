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

import { type FurnitureKind } from "./furnitureTaxonomy";

export interface HouseFurniture {
  /** Stable identifier, e.g. "dining-table". */
  name: string;
  kind?: FurnitureKind | string;
  materialId?: string;
  fragility?: string | number;
  articulation?: any;
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
    // cmaes-feox: shrunk and shifted south so the dining/kitchen doorway
    // aperture x[1.025,1.975]@y=0.7 stays navigable at robotRadius 0.20.
    { name: "kitchen-island", room: "kitchen", center: [2.0, -0.3], size: [1.0, 0.6], height: 0.92, rotation: 0, note: "hoosier-style work table (sized for doorway clearance)" },
    { name: "stove", room: "kitchen", center: [2.9, -1.4], size: [0.75, 0.65], height: 0.95, rotation: 0, note: "cast-iron range" },
    { name: "bed-master", room: "bedroom", center: [-2.6, -2.9], size: [1.4, 1.9], height: 0.6, rotation: 0, note: "iron-frame bed" },
    { name: "dresser", room: "bedroom", center: [-0.9, -3.1], size: [1.1, 0.5], height: 0.95, rotation: 0, note: "oak dresser" },
    { name: "bookshelf", room: "living room", center: [-3.6, 4.6], size: [0.35, 1.2], height: 1.9, rotation: 0, note: "built-in craftsman shelving" },
    { name: "armchair-1", room: "living room", center: [-3.3, 3.6], size: [0.95, 0.9], height: 0.9, rotation: 0, kind: "armchair", materialId: "fabric-cotton", note: "Mission-style armchair" },
    { name: "armchair-2", room: "living room", center: [-0.9, 4.4], size: [0.95, 0.9], height: 0.9, rotation: -0.3, kind: "armchair", materialId: "fabric-leather", note: "leather armchair" },
    { name: "lamp-table", room: "living room", center: [-3.3, 1.6], size: [0.5, 0.5], height: 0.55, rotation: 0, kind: "side-table", materialId: "oak-wood", note: "Craftsman side table" },
    { name: "table-lamp", room: "living room", center: [-3.2, 1.5], size: [0.35, 0.35], height: 1.6, rotation: 0, kind: "lamp", materialId: "brass", note: "brass table lamp" },
    { name: "rug-living", room: "living room", center: [-1.4, 2.6], size: [2.4, 1.6], height: 0.02, rotation: 0, kind: "rug", materialId: "fabric-velvet", note: "oriental rug" },
    { name: "picture-frame-1", room: "living room", center: [-2.0, 4.9], size: [0.6, 0.03], height: 1.5, rotation: 0, kind: "picture-frame", materialId: "oak-wood", note: "wall art above sofa" },
    { name: "plant-floor", room: "living room", center: [-3.5, 0.7], size: [0.5, 0.5], height: 1.2, rotation: 0, kind: "plant", materialId: "concrete", note: "Boston fern in pot" },
    { name: "bookshelf-small", room: "living room", center: [-0.4, 1.0], size: [0.6, 0.3], height: 1.2, rotation: 0, kind: "bookshelf", materialId: "walnut-wood", note: "small walnut bookshelf" },
    { name: "dining-chair-1", room: "dining room", center: [1.0, 3.2], size: [0.45, 0.5], height: 0.95, rotation: 0, kind: "dining-chair", materialId: "oak-wood", note: "turned-leg chair" },
    { name: "dining-chair-2", room: "dining room", center: [2.2, 3.2], size: [0.45, 0.5], height: 0.95, rotation: 0, kind: "dining-chair", materialId: "oak-wood", note: "turned-leg chair" },
    { name: "dining-chair-3", room: "dining room", center: [1.0, 2.0], size: [0.45, 0.5], height: 0.95, rotation: 0, kind: "dining-chair", materialId: "oak-wood", note: "turned-leg chair" },
    { name: "dining-chair-4", room: "dining room", center: [2.2, 2.0], size: [0.45, 0.5], height: 0.95, rotation: 0, kind: "dining-chair", materialId: "oak-wood", note: "turned-leg chair" },
    { name: "dining-chair-5", room: "dining room", center: [1.0, 1.6], size: [0.45, 0.5], height: 0.95, rotation: 3.14159265, kind: "dining-chair", materialId: "oak-wood", note: "turned-leg chair" },
    { name: "dining-chair-6", room: "dining room", center: [2.2, 1.6], size: [0.45, 0.5], height: 0.95, rotation: 3.14159265, kind: "dining-chair", materialId: "oak-wood", note: "turned-leg chair" },
    // cmaes-feox: relocated to the dining-room east end against the south
    // wall; previously covered the west half of the dining/kitchen doorway.
    { name: "sideboard", room: "dining room", center: [2.75, 0.95], size: [1.5, 0.5], height: 0.9, rotation: 0, kind: "console-table", materialId: "oak-wood", note: "Craftsman sideboard with drawers" },
    { name: "rug-dining", room: "dining room", center: [1.6, 2.4], size: [2.6, 2.0], height: 0.02, rotation: 0, kind: "rug", materialId: "carpet", note: "woven rug" },
    { name: "wall-clock", room: "dining room", center: [1.6, 4.6], size: [0.3, 0.05], height: 1.8, rotation: 0, kind: "picture-frame", materialId: "oak-wood", note: "wall clock" },
    { name: "fridge", room: "kitchen", center: [3.4, -0.6], size: [0.9, 0.75], height: 1.8, rotation: 0, kind: "fridge", materialId: "chrome", note: "top-freezer refrigerator" },
    { name: "sink", room: "kitchen", center: [2.5, 0.2], size: [0.6, 0.5], height: 0.85, rotation: 0, kind: "sink", materialId: "porcelain", note: "pedestal sink" },
    { name: "range-hood", room: "kitchen", center: [2.9, -1.0], size: [0.75, 0.55], height: 0.3, rotation: 0, kind: "range-hood", materialId: "chrome", note: "wall-mounted hood above stove" },
    { name: "plate-1", room: "kitchen", center: [1.5, 0.15], size: [0.27, 0.27], height: 0.02, rotation: 0, kind: "plate", materialId: "porcelain", fragility: 1.5, note: "dinner plate on island" },
    { name: "plate-2", room: "kitchen", center: [1.7, 0.15], size: [0.27, 0.27], height: 0.02, rotation: 0, kind: "plate", materialId: "porcelain", fragility: 1.5, note: "dinner plate on island" },
    { name: "mug-1", room: "kitchen", center: [1.5, -0.05], size: [0.09, 0.09], height: 0.1, rotation: 0, kind: "mug", materialId: "porcelain", fragility: 0.8, note: "coffee mug" },
    { name: "pan", room: "kitchen", center: [2.4, 0.15], size: [0.45, 0.3], height: 0.08, rotation: 0, kind: "pan", materialId: "cast-iron", note: "cast iron skillet" },
    { name: "bottle-1", room: "kitchen", center: [2.4, -0.05], size: [0.08, 0.08], height: 0.28, rotation: 0, kind: "bottle", materialId: "glass-clear", fragility: 1.2, note: "glass bottle" },
    { name: "glass-1", room: "kitchen", center: [1.7, -0.05], size: [0.07, 0.07], height: 0.13, rotation: 0, kind: "glass", materialId: "glass-clear", fragility: 0.5, note: "drinking glass" },
    { name: "curtain-window-kitchen", room: "kitchen", center: [3.5, 0.5], size: [1.2, 0.04], height: 1.8, rotation: 0, kind: "curtain", materialId: "fabric-cotton", note: "kitchen window curtain" },
    { name: "bed-frame", room: "bedroom", center: [-2.6, -2.9], size: [1.4, 2.0], height: 0.55, rotation: 0, kind: "queen-bed", materialId: "oak-wood", note: "queen bed frame" },
    { name: "mattress", room: "bedroom", center: [-2.6, -2.9], size: [1.4, 2.0], height: 0.25, rotation: 0, kind: "queen-bed", materialId: "fabric-cotton", note: "mattress on frame" },
    { name: "pillow-1", room: "bedroom", center: [-2.6, -4.2], size: [0.4, 0.25], height: 0.15, rotation: 0, kind: "queen-bed", materialId: "fabric-cotton", note: "bedside pillow" },
    { name: "pillow-2", room: "bedroom", center: [-2.0, -4.2], size: [0.4, 0.25], height: 0.15, rotation: 0, kind: "queen-bed", materialId: "fabric-cotton", note: "bedside pillow" },
    { name: "nightstand-1", room: "bedroom", center: [-3.6, -3.5], size: [0.5, 0.5], height: 0.55, rotation: 0, kind: "side-table", materialId: "oak-wood", note: "oak nightstand" },
    { name: "nightstand-2", room: "bedroom", center: [-1.6, -3.5], size: [0.5, 0.5], height: 0.55, rotation: 0, kind: "side-table", materialId: "oak-wood", note: "oak nightstand" },
    { name: "lamp-bedside-1", room: "bedroom", center: [-3.5, -3.4], size: [0.35, 0.35], height: 0.6, rotation: 0, kind: "lamp", materialId: "brass", note: "bedside lamp" },
    { name: "lamp-bedside-2", room: "bedroom", center: [-1.5, -3.4], size: [0.35, 0.35], height: 0.6, rotation: 0, kind: "lamp", materialId: "brass", note: "bedside lamp" },
    { name: "wardrobe-1", room: "bedroom", center: [-0.3, -3.2], size: [1.4, 0.6], height: 2.0, rotation: 0, kind: "wardrobe", materialId: "walnut-wood", articulation: [{"name": "left-door", "type": "revolute", "axis": [0, 1, 0], "limits": {"min": 0, "max": 1.884955592}}, {"name": "right-door", "type": "revolute", "axis": [0, -1, 0], "limits": {"min": 0, "max": 1.884955592}}], note: "armoire with double doors" },
    { name: "book-bedroom", room: "bedroom", center: [-3.5, -0.9], size: [0.18, 0.25], height: 0.03, rotation: 0, kind: "book", materialId: "paper", note: "bedside book" },
    { name: "rug-bedroom", room: "bedroom", center: [-1.8, -2.5], size: [2.4, 1.6], height: 0.02, rotation: 0, kind: "rug", materialId: "carpet", note: "bedroom carpet" },
    { name: "curtain-window-bedroom", room: "bedroom", center: [-3.9, -1.0], size: [1.2, 0.04], height: 1.8, rotation: 0, kind: "curtain", materialId: "fabric-cotton", note: "bedroom window curtain" },
    { name: "twin-bed-2", room: "second bedroom", center: [1.9, -3.5], size: [1.0, 2.0], height: 0.55, rotation: 0, kind: "twin-bed", materialId: "oak-wood", note: "twin bed frame" },
    { name: "desk-2", room: "second bedroom", center: [3.0, -1.4], size: [1.4, 0.7], height: 0.75, rotation: 0, kind: "desk", materialId: "oak-wood", articulation: [{"name": "drawer", "type": "prismatic", "axis": [1, 0, 0], "limits": {"min": 0, "max": 0.4}}], note: "writing desk" },
    { name: "dresser-2", room: "second bedroom", center: [1.0, -1.4], size: [1.2, 0.5], height: 0.95, rotation: 0, kind: "dresser", materialId: "oak-wood", note: "second dresser" },
    { name: "book-2", room: "second bedroom", center: [1.5, -3.4], size: [0.18, 0.25], height: 0.03, rotation: 0, kind: "book", materialId: "paper", note: "stack of books" },
    { name: "lamp-table-2", room: "second bedroom", center: [3.2, -3.0], size: [0.5, 0.5], height: 0.55, rotation: 0, kind: "side-table", materialId: "oak-wood", note: "side table" },
    { name: "chair-desk", room: "second bedroom", center: [2.4, -2.4], size: [0.45, 0.5], height: 0.95, rotation: 0, kind: "dining-chair", materialId: "oak-wood", note: "desk chair" },
    { name: "rug-second-bedroom", room: "second bedroom", center: [1.9, -3.0], size: [2.0, 1.4], height: 0.02, rotation: 0, kind: "rug", materialId: "carpet", note: "second bedroom rug" },
    { name: "bathtub", room: "bath", center: [-0.3, -4.2], size: [1.7, 0.75], height: 0.6, rotation: 0, kind: "bathtub", materialId: "porcelain", note: "claw-foot tub" },
    { name: "toilet", room: "bath", center: [1.1, -3.5], size: [0.4, 0.7], height: 0.6, rotation: 0, kind: "toilet", materialId: "porcelain", articulation: [{"name": "lid", "type": "revolute", "axis": [0, 1, 0], "limits": {"min": 0, "max": 1.5707963}}], note: "two-piece toilet" },
    { name: "vanity", room: "bath", center: [0.4, -1.5], size: [0.8, 0.55], height: 0.85, rotation: 0, kind: "vanity", materialId: "oak-wood", note: "vanity with sink" },
    { name: "mirror", room: "bath", center: [0.4, -1.0], size: [0.6, 0.03], height: 1.5, rotation: 0, kind: "picture-frame", materialId: "glass-clear", note: "wall mirror" },
    { name: "shower-stall", room: "bath", center: [1.1, -4.5], size: [0.9, 0.9], height: 2.0, rotation: 0, kind: "shower", materialId: "ceramic-tile", note: "shower stall" },
    { name: "rug-bath", room: "bath", center: [0.4, -2.4], size: [0.8, 0.5], height: 0.02, rotation: 0, kind: "rug", materialId: "fabric-cotton", note: "bath mat" },
    { name: "towel-rack", room: "bath", center: [1.1, -2.3], size: [0.6, 0.15], height: 0.05, rotation: 0, kind: "cabinet", materialId: "chrome", note: "towel rack" },
    { name: "plant-porch", room: "entry porch", center: [-1.5, 5.2], size: [0.4, 0.4], height: 0.6, rotation: 0, kind: "planter", materialId: "concrete", note: "entry planter" },
    { name: "plant-porch-2", room: "entry porch", center: [1.5, 5.2], size: [0.4, 0.4], height: 0.6, rotation: 0, kind: "planter", materialId: "concrete", note: "entry planter" },
    { name: "bench-porch", room: "entry porch", center: [0, 5.4], size: [1.2, 0.4], height: 0.5, rotation: 3.14159265, kind: "side-table", materialId: "oak-wood", note: "porch bench" },
    { name: "doormat", room: "entry porch", center: [0, 5.7], size: [0.8, 0.4], height: 0.02, rotation: 0, kind: "rug", materialId: "carpet", note: "welcome mat" },
    { name: "console-hall", room: "central hall", center: [0.2, -0.6], size: [1.2, 0.4], height: 0.85, rotation: 0, kind: "console-table", materialId: "oak-wood", note: "hall console" },
    { name: "mirror-hall", room: "central hall", center: [0.2, -0.4], size: [0.6, 0.03], height: 1.5, rotation: 0, kind: "picture-frame", materialId: "glass-clear", note: "hall mirror" },
    { name: "coat-rack", room: "central hall", center: [-0.5, 0.5], size: [0.4, 0.4], height: 1.8, rotation: 0, kind: "cabinet", materialId: "oak-wood", note: "freestanding coat rack" },
    { name: "umbrella-stand", room: "central hall", center: [0.7, 0.5], size: [0.3, 0.3], height: 0.6, rotation: 0, kind: "planter", materialId: "ceramic-tile", note: "umbrella stand" },
    { name: "shoes-pair", room: "central hall", center: [0.2, 1.0], size: [0.3, 0.2], height: 0.15, rotation: 0, kind: "rug", materialId: "rubber", note: "shoes at hall" },
    { name: "cat-fireplace", room: "living room", center: [-2.4, 2.6], size: [0.45, 0.2], height: 0.25, rotation: 0, kind: "pet-cat", materialId: "fabric-cotton", note: "cat sleeping by fireplace (display-only)" },
    { name: "person-silhouette-kitchen", room: "kitchen", center: [2.0, -1.5], size: [0.45, 0.25], height: 1.75, rotation: 0, kind: "person-silhouette", materialId: "fabric-cotton", note: "person at stove (display-only)" }
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
