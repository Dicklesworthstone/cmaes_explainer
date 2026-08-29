// Per-Material-Pair Physics & Friction Matrix (cmaes-feat-ph5-friction).
//
// Implements calibrated physical friction (static \mu_s, kinetic \mu_k, rolling \mu_r),
// coefficient of restitution (e), and contact damping across household materials
// (rubber, hardwood, ceramic, steel, glass, fabric, leather, plastic, concrete).
//
// Formulations:
//   - Pairwise lookup table with empirical data (CRC Handbook / EngineeringToolbox)
//   - Geometric Mean fallback for unlisted pairs:
//       \mu_s = \sqrt{\mu_{s, 1} \cdot \mu_{s, 2}}, \quad \mu_k = \sqrt{\mu_{k, 1} \cdot \mu_{k, 2}}
//       e = \min(e_1, e_2), \quad \mu_r = \max(\mu_{r, 1}, \mu_{r, 2})
//   - Physical Law: \mu_k \le \mu_s always holds.
//
// SOTA References:
//   - CRC Handbook of Chemistry and Physics (Friction and Restitution Data)
//   - EngineeringToolbox Friction Coefficients Database (2024)

export type PhysicsMaterialId =
  | "rubber"
  | "hardwood"
  | "ceramic"
  | "steel"
  | "glass"
  | "fabric"
  | "leather"
  | "plastic"
  | "concrete";

export interface MaterialProperties {
  id: PhysicsMaterialId | string;
  staticFriction: number;
  kineticFriction: number;
  rollingFriction: number;
  restitution: number;
  damping: number;
}

export interface MaterialPairProperties {
  materialA: string;
  materialB: string;
  staticFriction: number; // \mu_s
  kineticFriction: number; // \mu_k
  rollingFriction: number; // \mu_r
  restitution: number; // e \in [0, 1]
  damping: number; // \zeta
}

// Single-material intrinsic baseline properties
export const INTRINSIC_MATERIALS: Record<PhysicsMaterialId, MaterialProperties> = {
  rubber: {
    id: "rubber",
    staticFriction: 0.90,
    kineticFriction: 0.75,
    rollingFriction: 0.020,
    restitution: 0.45,
    damping: 0.25,
  },
  hardwood: {
    id: "hardwood",
    staticFriction: 0.45,
    kineticFriction: 0.35,
    rollingFriction: 0.005,
    restitution: 0.30,
    damping: 0.15,
  },
  ceramic: {
    id: "ceramic",
    staticFriction: 0.40,
    kineticFriction: 0.30,
    rollingFriction: 0.003,
    restitution: 0.40,
    damping: 0.10,
  },
  steel: {
    id: "steel",
    staticFriction: 0.50,
    kineticFriction: 0.40,
    rollingFriction: 0.002,
    restitution: 0.60,
    damping: 0.05,
  },
  glass: {
    id: "glass",
    staticFriction: 0.35,
    kineticFriction: 0.25,
    rollingFriction: 0.002,
    restitution: 0.55,
    damping: 0.05,
  },
  fabric: {
    id: "fabric",
    staticFriction: 0.60,
    kineticFriction: 0.50,
    rollingFriction: 0.050,
    restitution: 0.08,
    damping: 0.40,
  },
  leather: {
    id: "leather",
    staticFriction: 0.55,
    kineticFriction: 0.45,
    rollingFriction: 0.030,
    restitution: 0.15,
    damping: 0.30,
  },
  plastic: {
    id: "plastic",
    staticFriction: 0.38,
    kineticFriction: 0.28,
    rollingFriction: 0.008,
    restitution: 0.40,
    damping: 0.20,
  },
  concrete: {
    id: "concrete",
    staticFriction: 0.70,
    kineticFriction: 0.55,
    rollingFriction: 0.015,
    restitution: 0.20,
    damping: 0.25,
  },
};

// Calibrated empirical material pair matrix (key = sorted "matA:matB")
const CALIBRATED_PAIRS: Record<string, Omit<MaterialPairProperties, "materialA" | "materialB">> = {
  // Rubber interactions (Robot feet & grippers)
  "hardwood:rubber": { staticFriction: 0.85, kineticFriction: 0.70, rollingFriction: 0.015, restitution: 0.35, damping: 0.20 },
  "ceramic:rubber": { staticFriction: 0.80, kineticFriction: 0.65, rollingFriction: 0.012, restitution: 0.30, damping: 0.20 },
  "rubber:steel": { staticFriction: 0.75, kineticFriction: 0.60, rollingFriction: 0.010, restitution: 0.40, damping: 0.18 },
  "glass:rubber": { staticFriction: 0.85, kineticFriction: 0.70, rollingFriction: 0.012, restitution: 0.40, damping: 0.18 },
  "fabric:rubber": { staticFriction: 0.90, kineticFriction: 0.80, rollingFriction: 0.040, restitution: 0.10, damping: 0.35 },
  "concrete:rubber": { staticFriction: 0.95, kineticFriction: 0.85, rollingFriction: 0.025, restitution: 0.25, damping: 0.30 },

  // Hardwood interactions (floors & furniture)
  "hardwood:hardwood": { staticFriction: 0.40, kineticFriction: 0.30, rollingFriction: 0.008, restitution: 0.25, damping: 0.15 },
  "ceramic:hardwood": { staticFriction: 0.35, kineticFriction: 0.25, rollingFriction: 0.005, restitution: 0.30, damping: 0.12 },
  "hardwood:steel": { staticFriction: 0.35, kineticFriction: 0.25, rollingFriction: 0.004, restitution: 0.25, damping: 0.10 },
  "glass:hardwood": { staticFriction: 0.30, kineticFriction: 0.22, rollingFriction: 0.004, restitution: 0.45, damping: 0.08 },
  "fabric:hardwood": { staticFriction: 0.45, kineticFriction: 0.35, rollingFriction: 0.035, restitution: 0.10, damping: 0.30 },

  // Ceramic interactions (kitchen / bathroom tiles & mugs)
  "ceramic:ceramic": { staticFriction: 0.45, kineticFriction: 0.35, rollingFriction: 0.004, restitution: 0.40, damping: 0.10 },
  "ceramic:steel": { staticFriction: 0.35, kineticFriction: 0.28, rollingFriction: 0.003, restitution: 0.45, damping: 0.08 },
  "ceramic:glass": { staticFriction: 0.30, kineticFriction: 0.20, rollingFriction: 0.003, restitution: 0.50, damping: 0.08 },

  // Steel interactions (metal legs & appliances)
  "steel:steel": { staticFriction: 0.50, kineticFriction: 0.40, rollingFriction: 0.002, restitution: 0.60, damping: 0.05 },
  "glass:steel": { staticFriction: 0.32, kineticFriction: 0.24, rollingFriction: 0.003, restitution: 0.55, damping: 0.06 },
  "fabric:steel": { staticFriction: 0.40, kineticFriction: 0.30, rollingFriction: 0.030, restitution: 0.10, damping: 0.25 },

  // Fabric interactions (rugs, cushions, upholstery)
  "fabric:fabric": { staticFriction: 0.65, kineticFriction: 0.55, rollingFriction: 0.080, restitution: 0.05, damping: 0.45 },
  "fabric:glass": { staticFriction: 0.35, kineticFriction: 0.28, rollingFriction: 0.030, restitution: 0.10, damping: 0.25 },
};

function pairKey(matA: string, matB: string): string {
  return matA < matB ? `${matA}:${matB}` : `${matB}:${matA}`;
}

/**
 * Retrieves the calibrated or combined physical friction properties for a material pair.
 */
export function getMaterialPairFriction(
  matA: PhysicsMaterialId | string,
  matB: PhysicsMaterialId | string,
): MaterialPairProperties {
  const key = pairKey(matA, matB);
  const calibrated = CALIBRATED_PAIRS[key];

  if (calibrated) {
    return {
      materialA: matA,
      materialB: matB,
      staticFriction: calibrated.staticFriction,
      kineticFriction: calibrated.kineticFriction,
      rollingFriction: calibrated.rollingFriction,
      restitution: calibrated.restitution,
      damping: calibrated.damping,
    };
  }

  // Fallback: Combine intrinsic materials using geometric mean
  const propA = INTRINSIC_MATERIALS[matA as PhysicsMaterialId] ?? {
    id: matA,
    staticFriction: 0.45,
    kineticFriction: 0.35,
    rollingFriction: 0.01,
    restitution: 0.3,
    damping: 0.2,
  };

  const propB = INTRINSIC_MATERIALS[matB as PhysicsMaterialId] ?? {
    id: matB,
    staticFriction: 0.45,
    kineticFriction: 0.35,
    rollingFriction: 0.01,
    restitution: 0.3,
    damping: 0.2,
  };

  return combineCustomMaterials(propA, propB);
}

/**
 * Combines two arbitrary material property sets using standard physics mixing laws.
 */
export function combineCustomMaterials(
  propA: MaterialProperties,
  propB: MaterialProperties,
): MaterialPairProperties {
  const staticFriction = Math.sqrt(propA.staticFriction * propB.staticFriction);
  // Ensure kinetic friction never exceeds static friction
  const rawKinetic = Math.sqrt(propA.kineticFriction * propB.kineticFriction);
  const kineticFriction = Math.min(staticFriction * 0.95, rawKinetic);

  const rollingFriction = Math.max(propA.rollingFriction, propB.rollingFriction);
  const restitution = Math.min(propA.restitution, propB.restitution);
  const damping = 0.5 * (propA.damping + propB.damping);

  return {
    materialA: propA.id,
    materialB: propB.id,
    staticFriction,
    kineticFriction,
    rollingFriction,
    restitution,
    damping,
  };
}
