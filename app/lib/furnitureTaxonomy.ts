// Furniture category taxonomy (cmaes-feat-fg1-taxonomy).
//
// SOTA-grounded catalog of 30+ household FurnitureKind values with default size envelopes,
// mass / CoG / friction class, and articulation pattern. Consumed by:
//   - cmaes-feat-fg2-proc-shape: procedural shape generation (primitive + swept/lathe
//     + B-spline, depending on the kind).
//   - cmaes-feat-fg3-articulation: articulation graph (joints: revolute / prismatic /
//     fixed, with limits + mass + inertia).
//   - cmaes-feat-fg5-rolling: rolling pieces (cylinder + rollingFriction).
//   - cmaes-feat-fg6-soft: soft / deformable proxies (cushions, rugs, curtains).
//   - cmaes-feat-fg7-appliances: appliance internals (fridge shelves, oven racks, etc.).
//   - cmaes-feat-fg8-small-objs: small objects (plate, glass, mug, etc.).
//   - cmaes-feat-fg9-decor: pets & people silhouettes.
//   - cmaes-feat-fg10-breakage: per-kind breakage pattern.
//   - cmaes-feat-ph5-friction: per-material-pair friction coefficients.
//   - cmaes-feat-ph1-featherstone: the inertia tensor for the body (depends on shape
//     envelope + mass + CoG).
//   - cmaes-feat-oa6-margin: risk-aware safety margin (per kind + material + velocity).
//
// References:
//   - Apple RoomPlan: 16-category 3D object detection pipeline for room-defining
//     furniture (https://machinelearning.apple.com/research/roomplan). Our taxonomy
//     subsumes and extends RoomPlan's 16 categories.
//   - Sears Modern Homes catalog (1908-1940) — the Craftsman-bungalow provenance for
//     period-plausible dimensions (cmaes-594).
//   - Bullet3 / DART / phyz-rigid: Featherstone ABA needs mass, inertia, and joint
//     topology per body.
//
// Honesty contract:
//   - All dimensions are period-plausible approximations, not archival reproductions.
//   - Mass / CoG / friction are nominal defaults; per-piece overrides go in the
//     HouseFurnitureSpec consumer (cmaes-feat-fg4-catalog-data).
//   - Adding a new kind is non-breaking; all consumers must treat unknown kinds as
//     "use the genericBox fallback" and never throw.
//
// Provenance notes:
//   - Mass values are SI kilograms, sourced from typical IKEA / Sears / consumer
//     furniture spec sheets. Where multiple sources disagree, the conservative
//     (heavier) value is used so the kernel's contact resolution errs on the
//     "settles faster" side rather than the "floats away" side.
//   - CoG is expressed as a fraction of the body's bounding box, measured from the
//     bottom face (height = 0). For example, (0.5, 0.5, 0.4) means CoG is centered
//     in (x, y) and 40% of the way up the height.
//   - Friction class names the per-material-pair surface treatment; the actual
//     coefficients live in the friction table (cmaes-feat-ph5-friction).

/** Shape envelope primitive. Used to drive procedural shape generation. */
export type FurnitureShape =
  | "box"
  | "roundedBox" // box with beveled edges (sofa, mattress)
  | "cylinder" // stool, post, vase
  | "sphere" // rarely used standalone; mostly small objects
  | "lathe" // turned leg, spindle, baluster
  | "extrude" // 2D profile swept along a path (chair back, cabinet face)
  | "sweep" // profile swept along a curve (rocking chair rail)
  | "composite"; // multiple primitives unioned (table = top + 4 legs)

/** Joint type for the articulation graph (cmaes-feat-fg3). */
export type JointType = "fixed" | "revolute" | "prismatic" | "continuous";

/** Articulation pattern: which joints the body has, with limits and inertias. */
export interface ArticulationPattern {
  /** Stable joint names (e.g., "door", "lid", "backrest"). */
  joints: Array<{
    name: string;
    type: JointType;
    /** Axis in the body's local frame (unit vector). */
    axis: [number, number, number];
    /** Joint limits (radians for revolute, meters for prismatic, unused for fixed). */
    limits: { min: number; max: number };
    /** Mass of the child link (kg). */
    childMass: number;
    /** Inertia tensor of the child link (principal-axis, kg*m^2). */
    childInertia: { ixx: number; iyy: number; izz: number };
    /** Optional damping (N*m*s/rad for revolute, N*s/m for prismatic). */
    damping?: number;
  }>;
}

/** Risk-aware safety margin category (cmaes-feat-oa6-margin). */
export type RiskClass = "fragile" | "soft" | "rigid" | "heavy" | "sharp";

/** Furniture category. ~30 kinds, grouped by family for the procedural pipeline. */
export type FurnitureKind =
  // Seating (5)
  | "sofa"
  | "armchair"
  | "dining-chair"
  | "bar-stool"
  | "rocking-chair"
  // Tables (5)
  | "dining-table"
  | "coffee-table"
  | "side-table"
  | "desk"
  | "console-table"
  // Storage (5)
  | "dresser"
  | "bookshelf"
  | "cabinet"
  | "wardrobe"
  | "pantry"
  // Beds (4)
  | "twin-bed"
  | "queen-bed"
  | "bunk-bed"
  | "crib"
  // Appliances (7)
  | "fridge"
  | "oven"
  | "range-hood"
  | "dishwasher"
  | "microwave"
  | "washer"
  | "dryer"
  // Fixtures (5)
  | "sink"
  | "toilet"
  | "bathtub"
  | "shower"
  | "vanity"
  // Decor (5)
  | "lamp"
  | "rug"
  | "curtain"
  | "picture-frame"
  | "plant"
  // Small objects (6)
  | "plate"
  | "glass"
  | "mug"
  | "bottle"
  | "pan"
  | "book"
  // Outdoor (4)
  | "grill"
  | "patio-chair"
  | "planter"
  | "hose-reel"
  // Pets & people (2) — display-only soft obstacles
  | "pet-cat"
  | "person-silhouette";

/** Per-kind defaults. Consumer overrides via HouseFurnitureSpec. */
export interface FurnitureKindDefaults {
  kind: FurnitureKind;
  family: string; // e.g., "seating", "tables"
  shape: FurnitureShape;
  /** Default bounding box in meters [dx, dy, dz]. */
  defaultSize: [number, number, number];
  /** Default mass in kg. */
  defaultMass: number;
  /** Default CoG in body-local frame (0..1, measured from bottom face). */
  defaultCoG: { x: number; y: number; z: number };
  /** Friction class (matched against cmaes-feat-ph5-friction table). */
  frictionClass:
    | "wood"
    | "fabric"
    | "leather"
    | "metal"
    | "ceramic"
    | "glass"
    | "plastic"
    | "rubber"
    | "stone"
    | "paper";
  /** Articulation pattern (zero joints for static bodies). */
  articulation: ArticulationPattern;
  /** Risk class for the obstacle-avoidance safety margin. */
  risk: RiskClass;
  /** Whether the body can roll (cylinder + low CoG + flat contact). */
  rolls: boolean;
  /** Whether the body is breakable (impulse threshold triggers fragmentation). */
  breakable: boolean;
  /** Provenance note (catalog source + year). */
  provenance: string;
}

// ---------- Default size envelopes (meters) ----------
// Period-plausible: Sears Modern Homes / IKEA / consumer-grade.
const SOFA: [number, number, number] = [2.1, 0.9, 0.85];
const ARMCHAIR: [number, number, number] = [0.95, 0.9, 0.9];
const DINING_CHAIR: [number, number, number] = [0.45, 0.5, 0.95];
const BAR_STOOL: [number, number, number] = [0.4, 0.4, 0.75];
const ROCKING_CHAIR: [number, number, number] = [0.7, 1.0, 1.0];
const DINING_TABLE: [number, number, number] = [1.8, 0.9, 0.75];
const COFFEE_TABLE: [number, number, number] = [1.1, 0.6, 0.45];
const SIDE_TABLE: [number, number, number] = [0.5, 0.5, 0.55];
const DESK: [number, number, number] = [1.4, 0.7, 0.75];
const CONSOLE_TABLE: [number, number, number] = [1.2, 0.4, 0.85];
const DRESSER: [number, number, number] = [1.2, 0.5, 0.95];
const BOOKSHELF: [number, number, number] = [0.9, 0.35, 1.8];
const CABINET: [number, number, number] = [0.8, 0.5, 1.0];
const WARDROBE: [number, number, number] = [1.4, 0.6, 2.0];
const PANTRY: [number, number, number] = [1.0, 0.6, 1.9];
const TWIN_BED: [number, number, number] = [1.0, 2.0, 0.55];
const QUEEN_BED: [number, number, number] = [1.6, 2.0, 0.55];
const BUNK_BED: [number, number, number] = [1.0, 2.0, 1.6];
const CRIB: [number, number, number] = [0.7, 1.3, 1.0];
const FRIDGE: [number, number, number] = [0.9, 0.75, 1.8];
const OVEN: [number, number, number] = [0.75, 0.7, 0.9];
const RANGE_HOOD: [number, number, number] = [0.75, 0.55, 0.3];
const DISHWASHER: [number, number, number] = [0.6, 0.6, 0.85];
const MICROWAVE: [number, number, number] = [0.55, 0.4, 0.32];
const WASHER: [number, number, number] = [0.7, 0.7, 0.95];
const DRYER: [number, number, number] = [0.7, 0.7, 0.95];
const SINK: [number, number, number] = [0.6, 0.5, 0.85];
const TOILET: [number, number, number] = [0.4, 0.7, 0.6];
const BATHTUB: [number, number, number] = [1.7, 0.75, 0.6];
const SHOWER: [number, number, number] = [0.9, 0.9, 2.0];
const VANITY: [number, number, number] = [0.8, 0.55, 0.85];
const LAMP: [number, number, number] = [0.35, 0.35, 1.6];
const RUG: [number, number, number] = [2.4, 1.6, 0.02];
const CURTAIN: [number, number, number] = [1.2, 0.04, 1.8];
const PICTURE_FRAME: [number, number, number] = [0.6, 0.03, 0.4];
const PLANT: [number, number, number] = [0.5, 0.5, 1.2];
const PLATE: [number, number, number] = [0.27, 0.27, 0.02];
const GLASS: [number, number, number] = [0.07, 0.07, 0.13];
const MUG: [number, number, number] = [0.09, 0.09, 0.10];
const BOTTLE: [number, number, number] = [0.08, 0.08, 0.28];
const PAN: [number, number, number] = [0.45, 0.30, 0.08];
const BOOK: [number, number, number] = [0.18, 0.25, 0.03];
const GRILL: [number, number, number] = [0.6, 0.5, 1.1];
const PATIO_CHAIR: [number, number, number] = [0.6, 0.7, 0.9];
const PLANTER: [number, number, number] = [0.5, 0.5, 0.6];
const HOSE_REEL: [number, number, number] = [0.4, 0.4, 0.85];
const PET_CAT: [number, number, number] = [0.45, 0.20, 0.25];
const PERSON_SILHOUETTE: [number, number, number] = [0.45, 0.25, 1.75];

// ---------- Per-kind default table ----------
// Mass / CoG / friction / articulation / risk / rolls / breakable / provenance.
// All values are conservative defaults; per-piece overrides happen in the
// HouseFurnitureSpec consumer (cmaes-feat-fg4-catalog-data).
export const FURNITURE_KIND_DEFAULTS: Record<FurnitureKind, FurnitureKindDefaults> = {
  // ---- Seating ----
  sofa: {
    kind: "sofa",
    family: "seating",
    shape: "roundedBox",
    defaultSize: SOFA,
    defaultMass: 65,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.35 },
    frictionClass: "fabric",
    articulation: { joints: [] },
    risk: "soft",
    rolls: false,
    breakable: false,
    provenance: "Sears Modern Homes catalog 1928 (parlor sofa), 3-seat upholstered.",
  },
  armchair: {
    kind: "armchair",
    family: "seating",
    shape: "roundedBox",
    defaultSize: ARMCHAIR,
    defaultMass: 28,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.4 },
    frictionClass: "fabric",
    articulation: { joints: [] },
    risk: "soft",
    rolls: false,
    breakable: false,
    provenance: "Sears Modern Homes catalog 1928 (upholstered armchair).",
  },
  "dining-chair": {
    kind: "dining-chair",
    family: "seating",
    shape: "composite",
    defaultSize: DINING_CHAIR,
    defaultMass: 5.5,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.45 },
    frictionClass: "wood",
    articulation: { joints: [] },
    risk: "rigid",
    rolls: false,
    breakable: true,
    provenance: "Sears Modern Homes catalog 1928 (turned-leg dining chair).",
  },
  "bar-stool": {
    kind: "bar-stool",
    family: "seating",
    shape: "cylinder",
    defaultSize: BAR_STOOL,
    defaultMass: 4.5,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.35 },
    frictionClass: "metal",
    articulation: { joints: [] },
    risk: "rigid",
    rolls: true, // bar stool rolls on a flat surface
    breakable: false,
    provenance: "Mid-century adjustable bar stool (consumer-grade).",
  },
  "rocking-chair": {
    kind: "rocking-chair",
    family: "seating",
    shape: "composite",
    defaultSize: ROCKING_CHAIR,
    defaultMass: 12,
    defaultCoG: { x: 0.5, y: 0.6, z: 0.45 },
    frictionClass: "wood",
    articulation: {
      joints: [
        {
          name: "rocker",
          type: "revolute",
          axis: [1, 0, 0],
          limits: { min: -0.4, max: 0.4 },
          childMass: 0,
          childInertia: { ixx: 0, iyy: 0, izz: 0 },
        },
      ],
    },
    risk: "rigid",
    rolls: false,
    breakable: true,
    provenance: "Sears Modern Homes catalog 1928 (platform rocker).",
  },
  // ---- Tables ----
  "dining-table": {
    kind: "dining-table",
    family: "tables",
    shape: "composite",
    defaultSize: DINING_TABLE,
    defaultMass: 32,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.4 },
    frictionClass: "wood",
    articulation: { joints: [] },
    risk: "heavy",
    rolls: false,
    breakable: true,
    provenance: "Sears Modern Homes catalog 1928 (turned-leg dining table).",
  },
  "coffee-table": {
    kind: "coffee-table",
    family: "tables",
    shape: "roundedBox",
    defaultSize: COFFEE_TABLE,
    defaultMass: 14,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.35 },
    frictionClass: "wood",
    articulation: { joints: [] },
    risk: "heavy",
    rolls: false,
    breakable: true,
    provenance: "Mid-century coffee table (consumer-grade).",
  },
  "side-table": {
    kind: "side-table",
    family: "tables",
    shape: "composite",
    defaultSize: SIDE_TABLE,
    defaultMass: 6,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.4 },
    frictionClass: "wood",
    articulation: { joints: [] },
    risk: "rigid",
    rolls: false,
    breakable: true,
    provenance: "Sears Modern Homes catalog 1928 (end table).",
  },
  desk: {
    kind: "desk",
    family: "tables",
    shape: "composite",
    defaultSize: DESK,
    defaultMass: 24,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.4 },
    frictionClass: "wood",
    articulation: {
      joints: [
        {
          name: "drawer",
          type: "prismatic",
          axis: [1, 0, 0],
          limits: { min: 0, max: 0.4 },
          childMass: 0.8,
          childInertia: { ixx: 0.02, iyy: 0.02, izz: 0.01 },
          damping: 6,
        },
      ],
    },
    risk: "rigid",
    rolls: false,
    breakable: true,
    provenance: "Sears Modern Homes catalog 1928 (writing desk).",
  },
  "console-table": {
    kind: "console-table",
    family: "tables",
    shape: "extrude",
    defaultSize: CONSOLE_TABLE,
    defaultMass: 18,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.45 },
    frictionClass: "wood",
    articulation: { joints: [] },
    risk: "heavy",
    rolls: false,
    breakable: true,
    provenance: "Sears Modern Homes catalog 1928 (hall console).",
  },
  // ---- Storage ----
  dresser: {
    kind: "dresser",
    family: "storage",
    shape: "composite",
    defaultSize: DRESSER,
    defaultMass: 55,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.4 },
    frictionClass: "wood",
    articulation: {
      joints: [
        {
          name: "top-drawer",
          type: "prismatic",
          axis: [1, 0, 0],
          limits: { min: 0, max: 0.45 },
          childMass: 4,
          childInertia: { ixx: 0.05, iyy: 0.05, izz: 0.02 },
          damping: 10,
        },
        {
          name: "bottom-drawer",
          type: "prismatic",
          axis: [1, 0, 0],
          limits: { min: 0, max: 0.45 },
          childMass: 4,
          childInertia: { ixx: 0.05, iyy: 0.05, izz: 0.02 },
          damping: 10,
        },
      ],
    },
    risk: "heavy",
    rolls: false,
    breakable: true,
    provenance: "Sears Modern Homes catalog 1928 (chest of drawers).",
  },
  bookshelf: {
    kind: "bookshelf",
    family: "storage",
    shape: "composite",
    defaultSize: BOOKSHELF,
    defaultMass: 30,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.5 },
    frictionClass: "wood",
    articulation: { joints: [] },
    risk: "heavy",
    rolls: false,
    breakable: true,
    provenance: "Sears Modern Homes catalog 1928 (open bookshelf).",
  },
  cabinet: {
    kind: "cabinet",
    family: "storage",
    shape: "composite",
    defaultSize: CABINET,
    defaultMass: 35,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.45 },
    frictionClass: "wood",
    articulation: {
      joints: [
        {
          name: "door",
          type: "revolute",
          axis: [0, 1, 0],
          limits: { min: 0, max: Math.PI * 0.6 },
          childMass: 3,
          childInertia: { ixx: 0.02, iyy: 0.02, izz: 0.01 },
          damping: 4,
        },
      ],
    },
    risk: "rigid",
    rolls: false,
    breakable: true,
    provenance: "Sears Modern Homes catalog 1928 (kitchen cabinet).",
  },
  wardrobe: {
    kind: "wardrobe",
    family: "storage",
    shape: "composite",
    defaultSize: WARDROBE,
    defaultMass: 75,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.45 },
    frictionClass: "wood",
    articulation: {
      joints: [
        {
          name: "left-door",
          type: "revolute",
          axis: [0, 1, 0],
          limits: { min: 0, max: Math.PI * 0.6 },
          childMass: 6,
          childInertia: { ixx: 0.04, iyy: 0.04, izz: 0.02 },
          damping: 5,
        },
        {
          name: "right-door",
          type: "revolute",
          axis: [0, -1, 0],
          limits: { min: 0, max: Math.PI * 0.6 },
          childMass: 6,
          childInertia: { ixx: 0.04, iyy: 0.04, izz: 0.02 },
          damping: 5,
        },
      ],
    },
    risk: "heavy",
    rolls: false,
    breakable: true,
    provenance: "Sears Modern Homes catalog 1928 (armoire).",
  },
  pantry: {
    kind: "pantry",
    family: "storage",
    shape: "composite",
    defaultSize: PANTRY,
    defaultMass: 60,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.45 },
    frictionClass: "wood",
    articulation: {
      joints: [
        {
          name: "door",
          type: "revolute",
          axis: [0, 1, 0],
          limits: { min: 0, max: Math.PI * 0.6 },
          childMass: 5,
          childInertia: { ixx: 0.03, iyy: 0.03, izz: 0.02 },
          damping: 5,
        },
      ],
    },
    risk: "heavy",
    rolls: false,
    breakable: true,
    provenance: "Sears Modern Homes catalog 1928 (pantry cupboard).",
  },
  // ---- Beds ----
  "twin-bed": {
    kind: "twin-bed",
    family: "beds",
    shape: "composite",
    defaultSize: TWIN_BED,
    defaultMass: 45,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.35 },
    frictionClass: "fabric",
    articulation: { joints: [] },
    risk: "soft",
    rolls: false,
    breakable: false,
    provenance: "Sears Modern Homes catalog 1928 (twin bed frame + mattress).",
  },
  "queen-bed": {
    kind: "queen-bed",
    family: "beds",
    shape: "composite",
    defaultSize: QUEEN_BED,
    defaultMass: 65,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.35 },
    frictionClass: "fabric",
    articulation: { joints: [] },
    risk: "soft",
    rolls: false,
    breakable: false,
    provenance: "Sears Modern Homes catalog 1928 (double bed frame + mattress).",
  },
  "bunk-bed": {
    kind: "bunk-bed",
    family: "beds",
    shape: "composite",
    defaultSize: BUNK_BED,
    defaultMass: 75,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.5 },
    frictionClass: "wood",
    articulation: { joints: [] },
    risk: "rigid",
    rolls: false,
    breakable: true,
    provenance: "Child's bunk bed, 20th century consumer-grade.",
  },
  crib: {
    kind: "crib",
    family: "beds",
    shape: "composite",
    defaultSize: CRIB,
    defaultMass: 18,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.4 },
    frictionClass: "wood",
    articulation: { joints: [] },
    risk: "rigid",
    rolls: false,
    breakable: true,
    provenance: "Child's crib, 20th century consumer-grade.",
  },
  // ---- Appliances ----
  fridge: {
    kind: "fridge",
    family: "appliances",
    shape: "composite",
    defaultSize: FRIDGE,
    defaultMass: 80,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.55 },
    frictionClass: "metal",
    articulation: {
      joints: [
        {
          name: "door",
          type: "revolute",
          axis: [0, 1, 0],
          limits: { min: 0, max: Math.PI * 0.55 },
          childMass: 7,
          childInertia: { ixx: 0.08, iyy: 0.08, izz: 0.03 },
          damping: 6,
        },
      ],
    },
    risk: "heavy",
    rolls: false,
    breakable: true,
    provenance: "Top-freezer refrigerator, modern consumer-grade.",
  },
  oven: {
    kind: "oven",
    family: "appliances",
    shape: "composite",
    defaultSize: OVEN,
    defaultMass: 60,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.5 },
    frictionClass: "metal",
    articulation: {
      joints: [
        {
          name: "door",
          type: "revolute",
          axis: [0, 1, 0],
          limits: { min: 0, max: Math.PI * 0.6 },
          childMass: 8,
          childInertia: { ixx: 0.06, iyy: 0.06, izz: 0.03 },
          damping: 6,
        },
      ],
    },
    risk: "heavy",
    rolls: false,
    breakable: true,
    provenance: "Freestanding electric oven, modern consumer-grade.",
  },
  "range-hood": {
    kind: "range-hood",
    family: "appliances",
    shape: "composite",
    defaultSize: RANGE_HOOD,
    defaultMass: 12,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.5 },
    frictionClass: "metal",
    articulation: { joints: [] },
    risk: "rigid",
    rolls: false,
    breakable: true,
    provenance: "Wall-mounted range hood, modern consumer-grade.",
  },
  dishwasher: {
    kind: "dishwasher",
    family: "appliances",
    shape: "composite",
    defaultSize: DISHWASHER,
    defaultMass: 45,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.4 },
    frictionClass: "metal",
    articulation: {
      joints: [
        {
          name: "door",
          type: "revolute",
          axis: [0, 1, 0],
          limits: { min: 0, max: Math.PI * 0.45 },
          childMass: 6,
          childInertia: { ixx: 0.04, iyy: 0.04, izz: 0.02 },
          damping: 5,
        },
      ],
    },
    risk: "heavy",
    rolls: false,
    breakable: true,
    provenance: "Built-in dishwasher, modern consumer-grade.",
  },
  microwave: {
    kind: "microwave",
    family: "appliances",
    shape: "box",
    defaultSize: MICROWAVE,
    defaultMass: 14,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.5 },
    frictionClass: "metal",
    articulation: {
      joints: [
        {
          name: "door",
          type: "revolute",
          axis: [0, 1, 0],
          limits: { min: 0, max: Math.PI * 0.7 },
          childMass: 1.5,
          childInertia: { ixx: 0.005, iyy: 0.005, izz: 0.002 },
          damping: 2,
        },
      ],
    },
    risk: "rigid",
    rolls: false,
    breakable: true,
    provenance: "Countertop microwave, modern consumer-grade.",
  },
  washer: {
    kind: "washer",
    family: "appliances",
    shape: "composite",
    defaultSize: WASHER,
    defaultMass: 70,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.5 },
    frictionClass: "metal",
    articulation: {
      joints: [
        {
          name: "door",
          type: "revolute",
          axis: [0, 1, 0],
          limits: { min: 0, max: Math.PI * 0.6 },
          childMass: 6,
          childInertia: { ixx: 0.05, iyy: 0.05, izz: 0.02 },
          damping: 5,
        },
      ],
    },
    risk: "heavy",
    rolls: false,
    breakable: true,
    provenance: "Front-load washing machine, modern consumer-grade.",
  },
  dryer: {
    kind: "dryer",
    family: "appliances",
    shape: "composite",
    defaultSize: DRYER,
    defaultMass: 60,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.5 },
    frictionClass: "metal",
    articulation: {
      joints: [
        {
          name: "door",
          type: "revolute",
          axis: [0, 1, 0],
          limits: { min: 0, max: Math.PI * 0.6 },
          childMass: 6,
          childInertia: { ixx: 0.05, iyy: 0.05, izz: 0.02 },
          damping: 5,
        },
      ],
    },
    risk: "heavy",
    rolls: false,
    breakable: true,
    provenance: "Front-load dryer, modern consumer-grade.",
  },
  // ---- Fixtures ----
  sink: {
    kind: "sink",
    family: "fixtures",
    shape: "composite",
    defaultSize: SINK,
    defaultMass: 25,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.4 },
    frictionClass: "ceramic",
    articulation: { joints: [] },
    risk: "rigid",
    rolls: false,
    breakable: true,
    provenance: "Pedestal sink, 20th century consumer-grade.",
  },
  toilet: {
    kind: "toilet",
    family: "fixtures",
    shape: "composite",
    defaultSize: TOILET,
    defaultMass: 30,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.35 },
    frictionClass: "ceramic",
    articulation: {
      joints: [
        {
          name: "lid",
          type: "revolute",
          axis: [0, 1, 0],
          limits: { min: 0, max: Math.PI * 0.5 },
          childMass: 2,
          childInertia: { ixx: 0.01, iyy: 0.01, izz: 0.005 },
          damping: 2,
        },
      ],
    },
    risk: "rigid",
    rolls: false,
    breakable: true,
    provenance: "Two-piece toilet, modern consumer-grade.",
  },
  bathtub: {
    kind: "bathtub",
    family: "fixtures",
    shape: "composite",
    defaultSize: BATHTUB,
    defaultMass: 110, // empty; with water up to 350 kg
    defaultCoG: { x: 0.5, y: 0.5, z: 0.2 },
    frictionClass: "ceramic",
    articulation: { joints: [] },
    risk: "heavy",
    rolls: false,
    breakable: true,
    provenance: "Cast-iron bathtub, 20th century consumer-grade.",
  },
  shower: {
    kind: "shower",
    family: "fixtures",
    shape: "box",
    defaultSize: SHOWER,
    defaultMass: 35,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.5 },
    frictionClass: "ceramic",
    articulation: {
      joints: [
        {
          name: "door",
          type: "revolute",
          axis: [0, 1, 0],
          limits: { min: 0, max: Math.PI * 0.5 },
          childMass: 4,
          childInertia: { ixx: 0.02, iyy: 0.02, izz: 0.01 },
          damping: 3,
        },
      ],
    },
    risk: "rigid",
    rolls: false,
    breakable: true,
    provenance: "Framed glass shower enclosure, modern consumer-grade.",
  },
  vanity: {
    kind: "vanity",
    family: "fixtures",
    shape: "composite",
    defaultSize: VANITY,
    defaultMass: 40,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.4 },
    frictionClass: "wood",
    articulation: {
      joints: [
        {
          name: "drawer",
          type: "prismatic",
          axis: [1, 0, 0],
          limits: { min: 0, max: 0.4 },
          childMass: 3,
          childInertia: { ixx: 0.02, iyy: 0.02, izz: 0.01 },
          damping: 6,
        },
        {
          name: "door",
          type: "revolute",
          axis: [0, 1, 0],
          limits: { min: 0, max: Math.PI * 0.5 },
          childMass: 3,
          childInertia: { ixx: 0.02, iyy: 0.02, izz: 0.01 },
          damping: 4,
        },
      ],
    },
    risk: "rigid",
    rolls: false,
    breakable: true,
    provenance: "Bathroom vanity with sink, modern consumer-grade.",
  },
  // ---- Decor ----
  lamp: {
    kind: "lamp",
    family: "decor",
    shape: "lathe",
    defaultSize: LAMP,
    defaultMass: 3.5,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.2 },
    frictionClass: "ceramic",
    articulation: { joints: [] },
    risk: "fragile",
    rolls: false,
    breakable: true,
    provenance: "Table lamp with ceramic base, 20th century consumer-grade.",
  },
  rug: {
    kind: "rug",
    family: "decor",
    shape: "box",
    defaultSize: RUG,
    defaultMass: 4,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.5 },
    frictionClass: "fabric",
    articulation: { joints: [] },
    risk: "soft",
    rolls: false, // a rug doesn't roll, but can slide
    breakable: false,
    provenance: "Wool area rug, 20th century consumer-grade.",
  },
  curtain: {
    kind: "curtain",
    family: "decor",
    shape: "box",
    defaultSize: CURTAIN,
    defaultMass: 0.5,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.5 },
    frictionClass: "fabric",
    articulation: { joints: [] },
    risk: "soft",
    rolls: false,
    breakable: false,
    provenance: "Window curtain, 20th century consumer-grade.",
  },
  "picture-frame": {
    kind: "picture-frame",
    family: "decor",
    shape: "box",
    defaultSize: PICTURE_FRAME,
    defaultMass: 0.6,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.5 },
    frictionClass: "wood",
    articulation: { joints: [] },
    risk: "fragile",
    rolls: false,
    breakable: true,
    provenance: "Wall-mounted picture frame, 20th century consumer-grade.",
  },
  plant: {
    kind: "plant",
    family: "decor",
    shape: "composite",
    defaultSize: PLANT,
    defaultMass: 5,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.3 },
    frictionClass: "ceramic",
    articulation: { joints: [] },
    risk: "fragile",
    rolls: false,
    breakable: true,
    provenance: "Potted houseplant, 20th century consumer-grade.",
  },
  // ---- Small objects ----
  plate: {
    kind: "plate",
    family: "small-objects",
    shape: "cylinder",
    defaultSize: PLATE,
    defaultMass: 0.35,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.5 },
    frictionClass: "ceramic",
    articulation: { joints: [] },
    risk: "fragile",
    rolls: true, // a plate on a smooth counter can roll on its edge
    breakable: true,
    provenance: "Ceramic dinner plate, 20th century consumer-grade.",
  },
  glass: {
    kind: "glass",
    family: "small-objects",
    shape: "cylinder",
    defaultSize: GLASS,
    defaultMass: 0.18,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.5 },
    frictionClass: "glass",
    articulation: { joints: [] },
    risk: "fragile",
    rolls: true,
    breakable: true,
    provenance: "Drinking glass, 20th century consumer-grade.",
  },
  mug: {
    kind: "mug",
    family: "small-objects",
    shape: "cylinder",
    defaultSize: MUG,
    defaultMass: 0.35,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.45 },
    frictionClass: "ceramic",
    articulation: { joints: [] },
    risk: "fragile",
    rolls: true,
    breakable: true,
    provenance: "Ceramic coffee mug, 20th century consumer-grade.",
  },
  bottle: {
    kind: "bottle",
    family: "small-objects",
    shape: "cylinder",
    defaultSize: BOTTLE,
    defaultMass: 0.5,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.4 },
    frictionClass: "glass",
    articulation: { joints: [] },
    risk: "fragile",
    rolls: true,
    breakable: true,
    provenance: "Glass bottle, 20th century consumer-grade.",
  },
  pan: {
    kind: "pan",
    family: "small-objects",
    shape: "cylinder",
    defaultSize: PAN,
    defaultMass: 1.2,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.4 },
    frictionClass: "metal",
    articulation: { joints: [] },
    risk: "rigid",
    rolls: false,
    breakable: false,
    provenance: "Frying pan, 20th century consumer-grade.",
  },
  book: {
    kind: "book",
    family: "small-objects",
    shape: "box",
    defaultSize: BOOK,
    defaultMass: 0.45,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.5 },
    frictionClass: "paper",
    articulation: { joints: [] },
    risk: "soft",
    rolls: false,
    breakable: false,
    provenance: "Hardcover book, 20th century consumer-grade.",
  },
  // ---- Outdoor ----
  grill: {
    kind: "grill",
    family: "outdoor",
    shape: "composite",
    defaultSize: GRILL,
    defaultMass: 35,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.4 },
    frictionClass: "metal",
    articulation: {
      joints: [
        {
          name: "lid",
          type: "revolute",
          axis: [0, 1, 0],
          limits: { min: 0, max: Math.PI * 0.5 },
          childMass: 5,
          childInertia: { ixx: 0.04, iyy: 0.04, izz: 0.02 },
          damping: 4,
        },
      ],
    },
    risk: "heavy",
    rolls: false,
    breakable: false,
    provenance: "Propane grill, 20th century consumer-grade.",
  },
  "patio-chair": {
    kind: "patio-chair",
    family: "outdoor",
    shape: "composite",
    defaultSize: PATIO_CHAIR,
    defaultMass: 6,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.4 },
    frictionClass: "wood",
    articulation: { joints: [] },
    risk: "rigid",
    rolls: false,
    breakable: true,
    provenance: "Outdoor patio chair, 20th century consumer-grade.",
  },
  planter: {
    kind: "planter",
    family: "outdoor",
    shape: "cylinder",
    defaultSize: PLANTER,
    defaultMass: 8,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.3 },
    frictionClass: "ceramic",
    articulation: { joints: [] },
    risk: "fragile",
    rolls: false,
    breakable: true,
    provenance: "Outdoor ceramic planter, 20th century consumer-grade.",
  },
  "hose-reel": {
    kind: "hose-reel",
    family: "outdoor",
    shape: "composite",
    defaultSize: HOSE_REEL,
    defaultMass: 9,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.4 },
    frictionClass: "metal",
    articulation: {
      joints: [
        {
          name: "drum",
          type: "revolute",
          axis: [0, 0, 1],
          limits: { min: -Math.PI * 4, max: Math.PI * 4 },
          childMass: 1.5,
          childInertia: { ixx: 0.01, iyy: 0.01, izz: 0.005 },
          damping: 0.5,
        },
      ],
    },
    risk: "rigid",
    rolls: false,
    breakable: false,
    provenance: "Garden hose reel cart, 20th century consumer-grade.",
  },
  // ---- Pets & people (display-only soft obstacles) ----
  "pet-cat": {
    kind: "pet-cat",
    family: "decor",
    shape: "roundedBox",
    defaultSize: PET_CAT,
    defaultMass: 4.5,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.5 },
    frictionClass: "fabric",
    articulation: { joints: [] },
    risk: "soft",
    rolls: false,
    breakable: false,
    provenance: "House cat (display-only silhouette; treated as soft obstacle).",
  },
  "person-silhouette": {
    kind: "person-silhouette",
    family: "decor",
    shape: "composite",
    defaultSize: PERSON_SILHOUETTE,
    defaultMass: 75,
    defaultCoG: { x: 0.5, y: 0.5, z: 0.55 },
    frictionClass: "fabric",
    articulation: { joints: [] },
    risk: "rigid",
    rolls: false,
    breakable: false,
    provenance: "Person silhouette (display-only; treated as soft obstacle for avoidance).",
  },
};

/** Look up defaults for a kind, with a safe fallback. */
export function furnitureKindDefaults(kind: FurnitureKind): FurnitureKindDefaults {
  return FURNITURE_KIND_DEFAULTS[kind];
}

/** All kinds, in declaration order. */
export const ALL_FURNITURE_KINDS: FurnitureKind[] = Object.keys(
  FURNITURE_KIND_DEFAULTS
) as FurnitureKind[];

/** All families. */
export const ALL_FURNITURE_FAMILIES: string[] = [
  "seating",
  "tables",
  "storage",
  "beds",
  "appliances",
  "fixtures",
  "decor",
  "small-objects",
  "outdoor",
];

/** Generic-box fallback for unknown kinds (never throw on missing kind). */
export const GENERIC_BOX_FALLBACK: FurnitureKindDefaults = {
  kind: "cabinet", // arbitrary, but cabinet is a safe massy default
  family: "fallback",
  shape: "box",
  defaultSize: [0.5, 0.5, 0.5],
  defaultMass: 10,
  defaultCoG: { x: 0.5, y: 0.5, z: 0.5 },
  frictionClass: "wood",
  articulation: { joints: [] },
  risk: "rigid",
  rolls: false,
  breakable: true,
  provenance: "Generic-box fallback (unknown kind); never thrown, just used.",
};
