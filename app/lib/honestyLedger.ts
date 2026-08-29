// Project Honesty Ledger & Traceability Registry (cmaes-feat-fs6-honesty).
//
// Every physics claim, numerical integrator, PBR shader, and obstacle avoidance barrier in this
// explainer is explicitly registered with its source code file, verification test suite, mathematical
// formulation, academic literature citation, and Beads task tracking ID.
//
// Honesty Contract:
//   1. 100% Transparency: No hidden approximations, zero fake hardcoded rollouts.
//   2. Verifiable Math: Every chip links directly to its mathematical formulation and unit tests.
//   3. Grounded Citations: Every algorithm cites its founding peer-reviewed paper.

export type HonestyCategory =
  | "physics"
  | "graphics"
  | "clipping"
  | "obstacle-avoidance"
  | "navigation"
  | "telemetry";

export interface HonestyChip {
  id: string;
  beadId: string;
  title: string;
  category: HonestyCategory;
  sourceFile: string;
  testFile: string;
  citation: string;
  mathFormula: string;
  claim: string;
  status: "verified" | "active";
}

export const HONESTY_CHIP_REGISTRY: HonestyChip[] = [
  {
    id: "chip-featherstone",
    beadId: "cmaes-feat-ph1-featherstone-g9j",
    title: "Featherstone Articulated Body Solver",
    category: "physics",
    sourceFile: "app/lib/featherstoneDynamics.ts",
    testFile: "tests/featherstoneDynamics.test.ts",
    citation: "Roy Featherstone, Rigid Body Dynamics Algorithms (Springer 2008)",
    mathFormula: "\\mathbf{I}^A_i = \\mathbf{I}_i + \\sum_{j \\in \\mu(i)} \\left( \\mathbf{I}^A_j - \\frac{\\mathbf{I}^A_j \\mathbf{s}_j \\mathbf{s}_j^T \\mathbf{I}^A_j}{\\mathbf{s}_j^T \\mathbf{I}^A_j \\mathbf{s}_j} \\right)",
    claim: "O(n) exact forward articulated dynamics computed via spatial inertia recursions without matrix inversion.",
    status: "verified",
  },
  {
    id: "chip-rolling-contact",
    beadId: "cmaes-feat-ph2-rolling-r7z",
    title: "Rolling Limit Surface & Caster Kinematics",
    category: "physics",
    sourceFile: "app/lib/rollingFurniturePieces.ts",
    testFile: "tests/rollingFurniturePieces.test.ts",
    citation: "Goyal, Ruina, Papadopoulos, Planar Sliding with Dry Friction (Wear 1991)",
    mathFormula: "F_{\\text{roll}} = -c_{rr} F_N \\text{sgn}(v_{\\text{long}}), \\quad \\tau_{\\text{swivel}} = -d_{\\text{trail}} F_{\\text{lat}} - c_{\\text{damp}} \\dot{\\theta}",
    claim: "Anisotropic Coulomb scrub friction and self-aligning caster trail torque for rolling furniture pieces.",
    status: "verified",
  },
  {
    id: "chip-lcp-solver",
    beadId: "cmaes-feat-ph4-lcp-uqw",
    title: "Sequential Impulse Projected-Gauss-Seidel LCP",
    category: "physics",
    sourceFile: "app/lib/lcpSolver.ts",
    testFile: "tests/lcpSolver.test.ts",
    citation: "Erleben, Numerical Methods for Linear Complementarity Problems in Physics-Based Animation (2013)",
    mathFormula: "\\lambda_i^{k+1} = \\text{proj}_{\\mathcal{K}_i} \\left( \\lambda_i^k - \\omega \\frac{\\mathbf{A}_{ii}^{-1} (\\mathbf{A} \\boldsymbol{\\lambda}^k + \\mathbf{b})_i}{1 + \\epsilon} \\right)",
    claim: "Strictly convergent multi-body contact resolution with Coulomb 8-sided friction pyramid envelope.",
    status: "verified",
  },
  {
    id: "chip-xpbd-soft",
    beadId: "cmaes-feat-ph9-soft-sim-lk1",
    title: "Extended Position-Based Dynamics (XPBD)",
    category: "physics",
    sourceFile: "app/lib/xpbdSoftBody.ts",
    testFile: "tests/xpbdSoftBody.test.ts",
    citation: "Macklin et al., XPBD: Position-Based Simulation of Compliant Constrained Dynamics (MIG 2016)",
    mathFormula: "\\Delta \\lambda = \\frac{-C(\\mathbf{x}) - \\tilde{\\alpha} \\lambda}{\\sum w_i \\|\\nabla C_i\\|^2 + \\tilde{\\alpha}}, \\quad \\tilde{\\alpha} = \\frac{\\alpha}{\\Delta t^2}",
    claim: "Compliant mass-spring deformation for rugs, cushions, and curtains under a strict <=100 node budget.",
    status: "verified",
  },
  {
    id: "chip-restitution-damping",
    beadId: "cmaes-feat-ph11-restitution-q30",
    title: "Hunt-Crossley Contact Restitution & Damping",
    category: "physics",
    sourceFile: "app/lib/contactRestitutionIntegrator.ts",
    testFile: "tests/contactRestitutionIntegrator.test.ts",
    citation: "Hunt & Crossley, Coefficient of Restitution Interpreted as Damping in Vibroimpact (ASME JAM 1975)",
    mathFormula: "F_N = k_c \\delta^{1.5} + d_c \\delta^{1.5} \\dot{\\delta}, \\quad \\dot{E}_{\\text{total}} \\le 0",
    claim: "Velocity-thresholded restitution and viscoelastic damping preventing perpetual micro-bounce.",
    status: "verified",
  },
  {
    id: "chip-continuous-collision",
    beadId: "cmaes-feat-ph12-ccd-mhn",
    title: "Continuous Collision Detection (CCD) on SDFs",
    category: "clipping",
    sourceFile: "app/lib/continuousCollisionDetection.ts",
    testFile: "tests/continuousCollisionDetection.test.ts",
    citation: "Wang et al., Continuous Collision Detection on SDFs via Alternating Spatial-Temporal Optimization (CGF 2025)",
    mathFormula: "t^* = \\min \\{ t \\in [0, 1] \\mid d_{\\text{SDF}}(\\mathbf{x}_0 + t \\mathbf{v} \\Delta t) \\le r_{\\text{body}} \\}",
    claim: "Conservative space-time advancing preventing high-speed projectile and limb tunneling through thin obstacles.",
    status: "verified",
  },
  {
    id: "chip-sleep-state",
    beadId: "cmaes-feat-ph13-sleep-c6e",
    title: "Multi-Body Island Sleeping & Impulse Gate",
    category: "physics",
    sourceFile: "app/lib/multiBodySleepState.ts",
    testFile: "tests/multiBodySleepState.test.ts",
    citation: "Guendelman, Bridson, & Fedkiw, Nonconvex Rigid Bodies with Stacking (SIGGRAPH 2003)",
    mathFormula: "E_k(t) < E_{\\text{thresh}} \\; \\forall t \\in [t - T_{\\text{dwell}}, t] \\implies \\text{Sleep}, \\quad \\|\\mathbf{J}_{\\text{ext}}\\| \\ge J_{\\text{wake}} \\implies \\text{Wake}",
    claim: "Puts stationary furniture to sleep to conserve CPU cycles; wakes entire contact graph island instantly upon impact.",
    status: "verified",
  },
  {
    id: "chip-kernel-perf",
    beadId: "cmaes-feat-ph14-perf-p2b",
    title: "Kernel Micro-Performance Profiler & Quantiles",
    category: "telemetry",
    sourceFile: "app/lib/kernelPerfProfiler.ts",
    testFile: "tests/kernelPerfProfiler.test.ts",
    citation: "Jain & Chlamtac, The P2 Algorithm for Dynamic Quantile Estimation (CACM 1985)",
    mathFormula: "t_{\\text{total}} = t_{\\text{broad}} + t_{\\text{narrow}} + t_{\\text{lcp}} + t_{\\text{integ}}, \\quad \\text{Overrun} = t_{\\text{total}} > T_{\\text{budget}}",
    claim: "Sub-microsecond per-phase timing breakdown and rolling p50/p95/p99 budget monitoring across rollout frames.",
    status: "verified",
  },
  {
    id: "chip-cbf-safety-filter",
    beadId: "cmaes-feat-oa1-cbf-h0k",
    title: "Control Barrier Function (CBF) & Infeasibility Recovery",
    category: "obstacle-avoidance",
    sourceFile: "app/lib/safetyFilterRecovery.ts",
    testFile: "tests/safetyFilterRecovery.test.ts",
    citation: "Ames et al., Control Barrier Functions: Theory and Applications (ECC 2019)",
    mathFormula: "\\min_{\\mathbf{u}} \\frac{1}{2} \\|\\mathbf{u} - \\mathbf{u}_{\\text{des}}\\|^2 \\quad \\text{s.t.} \\quad \\nabla h(\\mathbf{x})^T \\mathbf{u} + \\gamma h(\\mathbf{x}) \\ge -\\epsilon_{\\text{slack}}",
    claim: "Hierarchical 3-tier safety filter with quadratic slack projection and verified waypoint retreat on infeasibility.",
    status: "verified",
  },
  {
    id: "chip-segment-safe-cbf",
    beadId: "cmaes-feat-oa12-sscbf-8y2",
    title: "Segment-Safe Corridor CBF (SSCBF)",
    category: "obstacle-avoidance",
    sourceFile: "app/lib/segmentSafeCbf.ts",
    testFile: "tests/segmentSafeCbf.test.ts",
    citation: "Jo, Zhang, Yang, Luo, Geometry-Aware Control Barrier Functions (ICRA 2026)",
    mathFormula: "h_{\\text{lat}}(\\mathbf{x}) = (w_{\\text{half}} - r_{\\text{robot}}) - |\\mathbf{n}_{\\perp} \\cdot (\\mathbf{x} - \\mathbf{a})| \\ge 0",
    claim: "Coordinate-decoupled corridor tangents for narrow doorway passage without artificial jamming.",
    status: "verified",
  },
  {
    id: "chip-learned-costmap",
    beadId: "cmaes-feat-oa7-costmap-s8p",
    title: "Learned Fourier Clearance Costmap",
    category: "obstacle-avoidance",
    sourceFile: "app/lib/learnedCostmap.ts",
    testFile: "tests/learnedCostmap.test.ts",
    citation: "Tancik et al., Fourier Features Let Networks Learn High Frequency Functions (NeurIPS 2020)",
    mathFormula: "\\gamma(\\mathbf{x}) = [\\cos(2\\pi \\mathbf{B} \\mathbf{x}), \\sin(2\\pi \\mathbf{B} \\mathbf{x})]^T, \\quad V(\\mathbf{x}) = w_g \\|\\mathbf{x} - \\mathbf{x}_g\\| + w_c \\hat{c}(\\gamma(\\mathbf{x}))",
    claim: "Compact MLP potential field guiding warm-start trajectories through open corridors away from local minima.",
    status: "verified",
  },
  {
    id: "chip-social-cbf",
    beadId: "cmaes-feat-oa11-soft-eca",
    title: "Social Force Potential & Pet/Pedestrian CBF",
    category: "obstacle-avoidance",
    sourceFile: "app/lib/decorAndSocialObstacles.ts",
    testFile: "tests/decorAndSocialObstacles.test.ts",
    citation: "Helbing & Molnar, Social Force Model for Pedestrian Dynamics (Phys. Rev. E 1995)",
    mathFormula: "V_{\\text{social}}(\\mathbf{x}) = A \\exp\\left( -\\frac{1}{2} [(\\Delta x / \\sigma_{\\text{fwd}})^2 + (\\Delta z / \\sigma_{\\text{side}})^2] \\right)",
    claim: "Anisotropic forward-elongated Gaussian comfort field preventing invasive paths near people and pets.",
    status: "verified",
  },
  {
    id: "chip-ssr-reflections",
    beadId: "cmaes-feat-pr4-ssr-w6d",
    title: "Hi-Z Hierarchical Screen-Space Reflections",
    category: "graphics",
    sourceFile: "app/lib/screenSpaceReflections.ts",
    testFile: "tests/screenSpaceReflections.test.ts",
    citation: "Uludag, Hi-Z Screen-Space Cone-Traced Reflections (GPU Pro 5 2014)",
    mathFormula: "\\mathbf{r} = \\mathbf{v} - 2 (\\mathbf{v} \\cdot \\mathbf{n}) \\mathbf{n}, \\quad F(\\theta) = F_0 + (1 - F_0) (1 - \\cos\\theta)^5",
    claim: "Hierarchical raymarching on depth buffers with Fresnel Schlick reflection weighting for polished hardwood and tiles.",
    status: "verified",
  },
  {
    id: "chip-volumetric-sunbeams",
    beadId: "cmaes-feat-pr9-volumetric-tns",
    title: "Henyey-Greenstein Volumetric Sunbeams & Height Fog",
    category: "graphics",
    sourceFile: "app/lib/volumetricLighting.ts",
    testFile: "tests/volumetricLighting.test.ts",
    citation: "Henyey & Greenstein, Diffuse Radiation in the Galaxy (Astrophys. J. 1941)",
    mathFormula: "p(\\theta, g) = \\frac{1}{4\\pi} \\frac{1 - g^2}{(1 + g^2 - 2g\\cos\\theta)^{3/2}}, \\quad \\tau(y_0, y_1, L) = \\rho_0 L \\frac{e^{-b(y_0 - y_{\\text{ref}})} - e^{-b(y_1 - y_{\\text{ref}})}}{b(y_1 - y_0)}",
    claim: "Closed-form analytical optical depth integration for exponential height fog with raymarched window god rays.",
    status: "verified",
  },
  {
    id: "chip-emissive-blackbody",
    beadId: "cmaes-feat-pr8-emissive-nd6",
    title: "Blackbody Kelvin Locus & Fireplace Turbulence",
    category: "graphics",
    sourceFile: "app/lib/emissiveSurfaces.ts",
    testFile: "tests/emissiveSurfaces.test.ts",
    citation: "Planck, On the Law of Distribution of Energy in the Normal Spectrum (Ann. Phys. 1901)",
    mathFormula: "B_{\\lambda}(T) = \\frac{2hc^2}{\\lambda^5 \\left(e^{\\frac{hc}{\\lambda k_B T}} - 1\\right)}, \\quad I_{\\text{flame}}(t) = I_0 \\left(0.85 + 0.15 \\sum_{k=1}^3 2^{1-k} \\sin(\\omega_k t)\\right)",
    claim: "Physical Planckian Kelvin-to-RGB conversion and multi-octave turbulence modulation for fireplace and sconces.",
    status: "verified",
  },
  {
    id: "chip-house-navigation",
    beadId: "cmaes-feat-fs7-house-nav-noa",
    title: "Whole-House 7-Room Waypoint Sequence",
    category: "navigation",
    sourceFile: "app/lib/houseNavigationChain.ts",
    testFile: "tests/houseNavigationChain.test.ts",
    citation: "LaValle, Planning Algorithms (Cambridge University Press 2006)",
    mathFormula: "\\|\\mathbf{x}(t) - \\mathbf{w}_k\\| \\le R_{\\text{accept}} \\implies k \\leftarrow k + 1",
    claim: "Sequential multi-room closed-loop navigation across 7 Craftsman bungalow rooms with doorway aperture safety filters.",
    status: "verified",
  },
  {
    id: "chip-multiroom-tour",
    beadId: "cmaes-feat-fs8-tour-sja",
    title: "Centripetal Catmull-Rom 720-Step Camera Tour",
    category: "graphics",
    sourceFile: "app/lib/multiRoomTour.ts",
    testFile: "tests/multiRoomTour.test.ts",
    citation: "Yuksel, Schaefer, Keyser, On the Parameterization of Catmull-Rom Curves (CGF 2011)",
    mathFormula: "\\mathbf{C}(u) = \\text{CatmullRom}_{\\alpha=0.5}(\\mathbf{P}_0, \\mathbf{P}_1, \\mathbf{P}_2, \\mathbf{P}_3, u)",
    claim: "C1-continuous centripetal spline camera trajectory generator producing exact 720-frame cinematic fly-through rollouts.",
    status: "verified",
  },
  {
    id: "chip-neural-sdf",
    beadId: "cmaes-feat-cl10-neural-gbn",
    title: "Near-Surface Neural SDF Refinement & Telemetry",
    category: "clipping",
    sourceFile: "app/lib/neuralSdfRefinement.ts",
    testFile: "tests/neuralSdfRefinement.test.ts",
    citation: "Park et al., DeepSDF: Learning Continuous Signed Distance Functions (CVPR 2019)",
    mathFormula: "d_{\\text{refined}}(\\mathbf{x}) = d_{\\text{base}}(\\mathbf{x}) + \\exp\\left(-\\frac{d_{\\text{base}}^2}{2\\sigma^2}\\right) \\text{MLP}_{\\le 20\\text{k}}(\\gamma(\\mathbf{x}))",
    claim: "Baked <=20k parameter MLP for procedural carved wood geometry with zero-heap-allocation query telemetry.",
    status: "verified",
  },
];
