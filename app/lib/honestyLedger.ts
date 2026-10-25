// Source index for the explainer's numerical and rendering helpers.
// File existence and a mathematical citation are not runtime verification.
// These entries describe local implementations, not measured flagship outcomes.

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
  status: "implemented" | "conceptual" | "display-only";
}

export const HONESTY_CHIP_REGISTRY: HonestyChip[] = [
  {
    id: "chip-featherstone",
    beadId: "cmaes-feat-ph1-featherstone-lwy",
    title: "Featherstone Articulated Body Solver",
    category: "physics",
    sourceFile: "app/lib/featherstoneDynamics.ts",
    testFile: "tests/featherstoneDynamics.test.ts",
    citation: "Roy Featherstone, Rigid Body Dynamics Algorithms (Springer 2008)",
    mathFormula:
      "\\mathbf{I}^A_i = \\mathbf{I}_i + \\sum_{j \\in \\mu(i)} \\left( \\mathbf{I}^A_j - \\frac{\\mathbf{I}^A_j \\mathbf{s}_j \\mathbf{s}_j^T \\mathbf{I}^A_j}{\\mathbf{s}_j^T \\mathbf{I}^A_j \\mathbf{s}_j} \\right)",
    claim:
      "TypeScript articulated-dynamics helper with Rodrigues arbitrary-axis rotations, prismatic joint transforms, and world-frame potential energy. Cross-runtime parity with the deployed Rust owner is not established by this entry.",
    status: "implemented",
  },
  {
    id: "chip-rolling-contact",
    beadId: "cmaes-feat-ph2-rolling-woc",
    title: "Rolling Limit Surface & Caster Kinematics",
    category: "physics",
    sourceFile: "app/lib/rollingFurniturePieces.ts",
    testFile: "tests/rollingFurniturePieces.test.ts",
    citation: "Goyal, Ruina, Papadopoulos, Planar Sliding with Dry Friction (Wear 1991)",
    mathFormula:
      "F_{\\text{roll}} = -c_{rr} F_N \\text{sgn}(v_{\\text{long}}), \\quad \\tau_{\\text{swivel}} = -d_{\\text{trail}} F_{\\text{lat}} - c_{\\text{damp}} \\dot{\\theta}",
    claim:
      "Standalone rolling-friction and caster-trail model. This does not show that the G1 owner simulates movable household furniture.",
    status: "implemented",
  },
  {
    id: "chip-lcp-solver",
    beadId: "cmaes-feat-ph4-lcp-uqw",
    title: "Sequential Impulse Projected-Gauss-Seidel LCP",
    category: "physics",
    sourceFile: "app/lib/lcpSolver.ts",
    testFile: "tests/lcpSolver.test.ts",
    citation:
      "Erleben, Numerical Methods for Linear Complementarity Problems in Physics-Based Animation (2013)",
    mathFormula:
      "\\lambda_i^{k+1} = \\text{proj}_{\\mathcal{K}_i} \\left( \\lambda_i^k - \\omega \\frac{\\mathbf{A}_{ii}^{-1} (\\mathbf{A} \\boldsymbol{\\lambda}^k + \\mathbf{b})_i}{1 + \\epsilon} \\right)",
    claim:
      "Iterative projected contact solver with an eight-sided friction approximation. Convergence depends on the problem, tolerances and iteration budget.",
    status: "implemented",
  },
  {
    id: "chip-xpbd-soft",
    beadId: "cmaes-feat-ph9-soft-sim-lk1",
    title: "Extended Position-Based Dynamics (XPBD)",
    category: "physics",
    sourceFile: "app/lib/xpbdSoftBody.ts",
    testFile: "tests/xpbdSoftBody.test.ts",
    citation:
      "Macklin et al., XPBD: Position-Based Simulation of Compliant Constrained Dynamics (MIG 2016)",
    mathFormula:
      "\\Delta \\lambda = \\frac{-C(\\mathbf{x}) - \\tilde{\\alpha} \\lambda}{\\sum w_i \\|\\nabla C_i\\|^2 + \\tilde{\\alpha}}, \\quad \\tilde{\\alpha} = \\frac{\\alpha}{\\Delta t^2}",
    claim:
      "Budgeted compliant-constraint helper for soft objects. Coupled deformation in a flagship owner episode remains a separate integration requirement.",
    status: "implemented",
  },
  {
    id: "chip-restitution-damping",
    beadId: "cmaes-feat-ph11-restitution-q30",
    title: "Hunt-Crossley Contact Restitution & Damping",
    category: "physics",
    sourceFile: "app/lib/contactRestitutionIntegrator.ts",
    testFile: "tests/contactRestitutionIntegrator.test.ts",
    citation:
      "Hunt & Crossley, Coefficient of Restitution Interpreted as Damping in Vibroimpact (ASME JAM 1975)",
    mathFormula:
      "F_N = k_c \\delta^{1.5} + d_c \\delta^{1.5} \\dot{\\delta}, \\quad \\dot{E}_{\\text{total}} \\le 0",
    claim:
      "Contact-response helper with velocity thresholds and viscoelastic damping. Energy behavior must be checked for each integration setup.",
    status: "implemented",
  },
  {
    id: "chip-continuous-collision",
    beadId: "cmaes-feat-ph12-ccd-mhn",
    title: "Continuous Collision Detection (CCD) on SDFs",
    category: "clipping",
    sourceFile: "app/lib/continuousCollisionDetection.ts",
    testFile: "tests/continuousCollisionDetection.test.ts",
    citation:
      "Conservative advancement and signed-distance collision queries; the implementation below is not a validated reproduction of a specific paper.",
    mathFormula:
      "t^* = \\min \\{ t \\in [0, 1] \\mid d_{\\text{SDF}}(\\mathbf{x}_0 + t \\mathbf{v} \\Delta t) \\le r_{\\text{body}} \\}",
    claim:
      "SDF sweep helper with finite iteration and step limits. It does not establish a universal no-tunneling guarantee or deployed-owner parity.",
    status: "implemented",
  },
  {
    id: "chip-sleep-state",
    beadId: "cmaes-feat-ph13-sleep-c6e",
    title: "Multi-Body Island Sleeping & Impulse Gate",
    category: "physics",
    sourceFile: "app/lib/multiBodySleepState.ts",
    testFile: "tests/multiBodySleepState.test.ts",
    citation: "Guendelman, Bridson, & Fedkiw, Nonconvex Rigid Bodies with Stacking (SIGGRAPH 2003)",
    mathFormula:
      "E_k(t) < E_{\\text{thresh}} \\; \\forall t \\in [t - T_{\\text{dwell}}, t] \\implies \\text{Sleep}, \\quad \\|\\mathbf{J}_{\\text{ext}}\\| \\ge J_{\\text{wake}} \\implies \\text{Wake}",
    claim:
      "Energy-threshold and wake-propagation logic for a contact graph. Actual furniture-owner scheduling and performance need episode measurements.",
    status: "implemented",
  },
  {
    id: "chip-kernel-perf",
    beadId: "cmaes-feat-ph14-perf-p2b",
    title: "Kernel Micro-Performance Profiler & Quantiles",
    category: "telemetry",
    sourceFile: "app/lib/kernelPerfProfiler.ts",
    testFile: "tests/kernelPerfProfiler.test.ts",
    citation:
      "Hyndman & Fan, Sample Quantiles in Statistical Packages (The American Statistician, 1996) — Type 1 Nearest-Rank Order Statistic over Sliding Ring Buffer",
    mathFormula:
      "t_{\\text{total}} = t_{\\text{broad}} + t_{\\text{narrow}} + t_{\\text{lcp}} + t_{\\text{integ}}, \\quad Q_p = X_{(\\lceil p N \\rceil)}, \\quad \\text{Overrun} = t_{\\text{total}} > T_{\\text{budget}}",
    claim:
      "Timing aggregation and exact nearest-rank rolling quantiles over a bounded circular ring buffer. Clock resolution and measured workload are properties of the recording environment.",
    status: "implemented",
  },
  {
    id: "chip-cbf-safety-filter",
    beadId: "cmaes-feat-oa1-cbf-h0k",
    title: "Control Barrier Function (CBF) & Infeasibility Recovery",
    category: "obstacle-avoidance",
    sourceFile: "app/lib/safetyFilterRecovery.ts",
    testFile: "tests/safetyFilterRecovery.test.ts",
    citation: "Ames et al., Control Barrier Functions: Theory and Applications (ECC 2019)",
    mathFormula:
      "\\min_{\\mathbf{u}} \\frac{1}{2} \\|\\mathbf{u} - \\mathbf{u}_{\\text{des}}\\|^2 \\quad \\text{s.t.} \\quad \\nabla h(\\mathbf{x})^T \\mathbf{u} + \\gamma h(\\mathbf{x}) \\ge -\\epsilon_{\\text{slack}}",
    claim:
      "Three-tier projection and recovery helper. A safe retreat requires a reachable, collision-checked path under the actual robot dynamics.",
    status: "implemented",
  },
  {
    id: "chip-segment-safe-cbf",
    beadId: "cmaes-feat-oa12-sscbf-8y2",
    title: "Segment-Safe Corridor CBF (SSCBF)",
    category: "obstacle-avoidance",
    sourceFile: "app/lib/segmentSafeCbf.ts",
    testFile: "tests/segmentSafeCbf.test.ts",
    citation:
      "Corridor-coordinate barrier construction; the cited implementation must be evaluated under its own geometry and dynamics assumptions.",
    mathFormula:
      "h_{\\text{lat}}(\\mathbf{x}) = (w_{\\text{half}} - r_{\\text{robot}}) - |\\mathbf{n}_{\\perp} \\cdot (\\mathbf{x} - \\mathbf{a})| \\ge 0",
    claim:
      "Planar corridor barrier helper. Full-body doorway clearance and feasible control are not demonstrated by the scalar corridor calculation.",
    status: "implemented",
  },
  {
    id: "chip-learned-costmap",
    beadId: "cmaes-feat-oa7-costmap-s8p",
    title: "Learned Fourier Clearance Costmap",
    category: "obstacle-avoidance",
    sourceFile: "app/lib/learnedCostmap.ts",
    testFile: "tests/learnedCostmap.test.ts",
    citation:
      "Tancik et al., Fourier Features Let Networks Learn High Frequency Functions (NeurIPS 2020)",
    mathFormula:
      "\\gamma(\\mathbf{x}) = [\\cos(2\\pi \\mathbf{B} \\mathbf{x}), \\sin(2\\pi \\mathbf{B} \\mathbf{x})]^T, \\quad V(\\mathbf{x}) = w_g \\|\\mathbf{x} - \\mathbf{x}_g\\| + w_c \\hat{c}(\\gamma(\\mathbf{x}))",
    claim:
      "Fourier-feature MLP costmap with analytical chain-rule gradients and local SDF supervised fitting. A pre-baked household model artifact for the deployed Rust owner is not supplied by this registry.",
    status: "conceptual",
  },
  {
    id: "chip-social-cbf",
    beadId: "cmaes-feat-oa11-soft-eca",
    title: "Social Force Potential & Pet/Pedestrian CBF",
    category: "obstacle-avoidance",
    sourceFile: "app/lib/decorAndSocialObstacles.ts",
    testFile: "tests/decorAndSocialObstacles.test.ts",
    citation: "Helbing & Molnar, Social Force Model for Pedestrian Dynamics (Phys. Rev. E 1995)",
    mathFormula:
      "V_{\\text{social}}(\\mathbf{x}) = A \\exp\\left( -\\frac{1}{2} [(\\Delta x / \\sigma_{\\text{fwd}})^2 + (\\Delta z / \\sigma_{\\text{side}})^2] \\right)",
    claim:
      "Anisotropic comfort-cost helper for people and pets. A potential value alone does not constrain the trajectory of a deployed robot.",
    status: "implemented",
  },
  {
    id: "chip-ssr-reflections",
    beadId: "cmaes-feat-pr6-ssr-owf",
    title: "Hi-Z Hierarchical Screen-Space Reflections",
    category: "graphics",
    sourceFile: "app/lib/screenSpaceReflections.ts",
    testFile: "tests/screenSpaceReflections.test.ts",
    citation: "Uludag, Hi-Z Screen-Space Cone-Traced Reflections (GPU Pro 5 2014)",
    mathFormula:
      "\\mathbf{r} = \\mathbf{v} - 2 (\\mathbf{v} \\cdot \\mathbf{n}) \\mathbf{n}, \\quad F(\\theta) = F_0 + (1 - F_0) (1 - \\cos\\theta)^5",
    claim:
      "Depth-buffer reflection helpers and shader code. The registry does not establish that the flagship render pipeline executes this pass.",
    status: "implemented",
  },
  {
    id: "chip-volumetric-sunbeams",
    beadId: "cmaes-feat-pr9-volumetric-tns",
    title: "Henyey-Greenstein Volumetric Sunbeams & Height Fog",
    category: "graphics",
    sourceFile: "app/lib/volumetricLighting.ts",
    testFile: "tests/volumetricLighting.test.ts",
    citation: "Henyey & Greenstein, Diffuse Radiation in the Galaxy (Astrophys. J. 1941)",
    mathFormula:
      "p(\\theta, g) = \\frac{1}{4\\pi} \\frac{1 - g^2}{(1 + g^2 - 2g\\cos\\theta)^{3/2}}, \\quad \\tau(y_0, y_1, L) = \\rho_0 L \\frac{e^{-b(y_0 - y_{\\text{ref}})} - e^{-b(y_1 - y_{\\text{ref}})}}{b(y_1 - y_0)}",
    claim:
      "Height-fog integration and scattering helpers. Their presence does not establish a measured volumetric-lighting pass in the flagship.",
    status: "implemented",
  },
  {
    id: "chip-emissive-blackbody",
    beadId: "cmaes-feat-pr8-emissive-nd6",
    title: "Blackbody Kelvin Locus & Fireplace Turbulence",
    category: "graphics",
    sourceFile: "app/lib/emissiveSurfaces.ts",
    testFile: "tests/emissiveSurfaces.test.ts",
    citation:
      "Planck, On the Law of Distribution of Energy in the Normal Spectrum (Ann. Phys. 1901)",
    mathFormula:
      "B_{\\lambda}(T) = \\frac{2hc^2}{\\lambda^5 \\left(e^{\\frac{hc}{\\lambda k_B T}} - 1\\right)}, \\quad I_{\\text{flame}}(t) = I_0 \\left(0.85 + 0.15 \\sum_{k=1}^3 2^{1-k} \\sin(\\omega_k t)\\right)",
    claim:
      "Approximate Kelvin-to-RGB color and procedural flame modulation. These are visual approximations, not spectral radiometry or fluid simulation.",
    status: "display-only",
  },
  {
    id: "chip-house-navigation",
    beadId: "cmaes-feat-fs7-house-nav-noa",
    title: "Whole-House 7-Room Waypoint Sequence",
    category: "navigation",
    sourceFile: "app/lib/houseNavigationChain.ts",
    testFile: "tests/houseNavigationChain.test.ts",
    citation: "LaValle, Planning Algorithms (Cambridge University Press 2006)",
    mathFormula:
      "\\|\\mathbf{x}(t) - \\mathbf{w}_k\\| \\le R_{\\text{accept}} \\implies k \\leftarrow k + 1",
    claim:
      "Seven-room waypoint sequence with a planar navigation helper. Physical G1 traversal with preserved robot state is not demonstrated here.",
    status: "implemented",
  },
  {
    id: "chip-multiroom-tour",
    beadId: "cmaes-feat-fs8-tour-sja",
    title: "Centripetal Catmull-Rom 720-Step Camera Tour",
    category: "graphics",
    sourceFile: "app/lib/multiRoomTour.ts",
    testFile: "tests/multiRoomTour.test.ts",
    citation: "Yuksel, Schaefer, Keyser, On the Parameterization of Catmull-Rom Curves (CGF 2011)",
    mathFormula:
      "\\mathbf{C}(u) = \\text{CatmullRom}_{\\alpha=0.5}(\\mathbf{P}_0, \\mathbf{P}_1, \\mathbf{P}_2, \\mathbf{P}_3, u)",
    claim:
      "Centripetal spline camera-path generator. Its camera samples are display frames, not robot physics steps or successful navigation episodes.",
    status: "display-only",
  },
  {
    id: "chip-neural-sdf",
    beadId: "cmaes-feat-cl10-neural-gbn",
    title: "Near-Surface Neural SDF Refinement & Telemetry",
    category: "clipping",
    sourceFile: "app/lib/neuralSdfRefinement.ts",
    testFile: "tests/neuralSdfRefinement.test.ts",
    citation: "Park et al., DeepSDF: Learning Continuous Signed Distance Functions (CVPR 2019)",
    mathFormula:
      "d_{\\text{refined}}(\\mathbf{x}) = d_{\\text{base}}(\\mathbf{x}) + \\exp\\left(-\\frac{d_{\\text{base}}^2}{2\\sigma^2}\\right) \\text{MLP}_{\\le 20\\text{k}}(\\gamma(\\mathbf{x}))",
    claim:
      "Neural residual-SDF helper with supervised fitting, conservative error-envelope lower bounds, and allocation telemetry. A pre-baked production furniture SDF asset is not supplied by this registry.",
    status: "conceptual",
  },
  {
    id: "chip-ddp-ilqr-crocoddyl",
    beadId: "cmaes-epic-oa-bz5.1",
    title: "DDP / iLQR / Crocoddyl Whole-Body Trajectory Optimization",
    category: "obstacle-avoidance",
    sourceFile: "app/lib/ddpTrajectoryOptimization.ts",
    testFile: "tests/ddpTrajectoryOptimization.test.ts",
    citation:
      "Mayne 1966 (2nd-order gradient); Tassa, Mansard, Stewart, Vijayakumar 2012/2014 (iLQR); Mastalli et al. 2020 (Crocoddyl).",
    mathFormula:
      "\\delta u = k + K\\delta x, \\quad k = -Q_{uu}^{-1}Q_u, \\quad K = -Q_{uu}^{-1}Q_{ux} \\quad (Q_{uu} \\succ 0)",
    claim:
      "Trajectory-optimization prototype with regularization and line search. Whole-body dynamics fidelity, derivative accuracy and optimum quality need separate validation.",
    status: "implemented",
  },
  {
    id: "chip-cito",
    beadId: "cmaes-epic-oa-bz5.2",
    title: "Contact-Implicit Trajectory Optimization (C-ITO)",
    category: "obstacle-avoidance",
    sourceFile: "app/lib/contactImplicitTrajectoryOpt.ts",
    testFile: "tests/contactImplicitTrajectoryOpt.test.ts",
    citation: "Posa, Cantu, Tedrake 2014 (IJRR); Manchester, Kuindersma 2020 (IEEE TAC).",
    mathFormula:
      "\\Phi_{FB}(a, b, \\varepsilon) = a + b - \\sqrt{a^2 + b^2 + 2\\varepsilon^2}; \\quad 0 \\le \\gamma_{N,i}(t) \\perp \\phi_i(q(t)) \\ge 0 \\mathrm{via}\\ \\lim_{\\varepsilon\\to 0^+}\\Phi_{FB} = 0",
    claim:
      "Smoothed-complementarity trajectory prototype. Solver convergence, physical contact feasibility and deployed whole-body avoidance remain unproven by this entry.",
    status: "implemented",
  },
  {
    id: "chip-furniture-articulation",
    beadId: "cmaes-feat-fg3-articulation-set",
    title: "Articulated Furniture Revolute & Prismatic Joint Graph",
    category: "physics",
    sourceFile: "app/lib/furnitureArticulation.ts",
    testFile: "tests/furnitureArticulation.test.ts",
    citation:
      "Featherstone, Rigid Body Dynamics Algorithms (Springer 2008); Denavit & Hartenberg (ASME J. Appl. Mech. 1955).",
    mathFormula:
      "I \\ddot{q} + b \\dot{q} + k(q - q_{\\text{rest}}) = \\tau_{\\text{user}} + \\tau_{\\text{grav}}, \\quad q \\in [q_{\\min}, q_{\\max}]",
    claim:
      "Semi-implicit Euler joint dynamics and forward-kinematics pose tree for household doors, drawers, and lids, wired into householdPhysicsWorld and FurnitureCatalogInspector.",
    status: "implemented",
  },
  {
    id: "chip-contact-manifold",
    beadId: "cmaes-za0x.12",
    title: "3D Contact Manifold & Mirtich-Bridson Impulse Resolution",
    category: "physics",
    sourceFile: "app/lib/contactManifold.ts",
    testFile: "tests/contactManifold.test.ts",
    citation:
      "Mirtich, Impulse-Based Dynamic Simulation of Rigid Body Systems (PhD Thesis, UC Berkeley 1996); Bridson, Fedkiw, Anderson (ACM TOG 2002).",
    mathFormula:
      "j_n = \\frac{-(1 + e) v_{\\text{rel}, n}}{m_A^{-1} + m_B^{-1} + \\mathbf{n} \\cdot [(\\mathbf{I}_A^{-1}(\\mathbf{r}_A \\times \\mathbf{n})) \\times \\mathbf{r}_A + (\\mathbf{I}_B^{-1}(\\mathbf{r}_B \\times \\mathbf{n})) \\times \\mathbf{r}_B]}",
    claim:
      "Sphere-sphere, sphere-box, and capsule-plane contact manifold generation with Coulomb friction cone impulse resolution, wired into householdPhysicsWorld and FurnitureCatalogInspector.",
    status: "implemented",
  },
  {
    id: "chip-robot-self-collision",
    beadId: "cmaes-za0x.14",
    title: "G1 23-DOF & 7-DOF Arm Capsule Self-Collision Filter",
    category: "clipping",
    sourceFile: "app/lib/robotSelfCollision.ts",
    testFile: "tests/robotSelfCollision.test.ts",
    citation:
      "Ericson, Real-Time Collision Detection (Morgan Kaufmann 2004); Pan, Chitta, Manocha, FCL (ICRA 2012).",
    mathFormula:
      "d_{\\text{cap}}(A, B) = \\min_{s, t \\in [0, 1]} \\|\\mathbf{p}_A(s) - \\mathbf{p}_B(t)\\| - (r_A + r_B)",
    claim:
      "Capsule-pair minimum distance and penetration depth checker with kinematic adjacency filtering, wired into solveFullBodyG1IK and the G1/Arm physics debug overlays.",
    status: "implemented",
  },
  {
    id: "chip-mesh-sdf",
    beadId: "cmaes-za0x.17",
    title: "Voxelized 3D Triangle Mesh Signed Distance Field",
    category: "clipping",
    sourceFile: "app/lib/meshSdf.ts",
    testFile: "tests/meshSdf.test.ts",
    citation:
      "Barentzen & Aanaes, Signed Distance Computation Using the Angle Weighted Pseudonormal (IEEE TVCG 2005).",
    mathFormula:
      "\\phi(\\mathbf{x}) = \\text{sign}\\left((\\mathbf{x} - \\mathbf{p}^*) \\cdot \\mathbf{n}_{\\alpha}\\right) \\min_{\\triangle_k} \\|\\mathbf{x} - \\Pi_{\\triangle_k}(\\mathbf{x})\\|",
    claim:
      "Trilinearly interpolated 3D grid SDF baked from closed triangle meshes with central-difference surface normals, wired into FurnitureCatalogInspector.",
    status: "implemented",
  },
  {
    id: "chip-pbr-pipeline",
    beadId: "cmaes-feat-pr1-pbr-pipeline-2pm",
    title: "Cook-Torrance GGX Microfacet PBR Material Slot Pipeline",
    category: "graphics",
    sourceFile: "app/lib/pbrPipeline.ts",
    testFile: "tests/pbrPipeline.test.ts",
    citation:
      "Walter et al., Microfacet Models for Refraction through Rough Surfaces (EGSR 2007); Karis, Real Shading in Unreal Engine 4 (SIGGRAPH 2013).",
    mathFormula:
      "f_{\\text{spec}}(\\mathbf{l}, \\mathbf{v}) = \\frac{D_{\\text{GGX}}(\\mathbf{h}, \\alpha) F_{\\text{Schlick}}(\\mathbf{v}, \\mathbf{h}, F_0) G_{\\text{Smith}}(\\mathbf{l}, \\mathbf{v}, \\alpha)}{4 (\\mathbf{n} \\cdot \\mathbf{l})(\\mathbf{n} \\cdot \\mathbf{v})}",
    claim:
      "PBR material slot registry, texture memory budget accounting, and color-space validation helpers wired into MaterialDatabaseInspector.",
    status: "implemented",
  },
  {
    id: "chip-ddgi-probes",
    beadId: "cmaes-feat-pr4-ddgi-g8e",
    title: "Dynamic Diffuse Global Illumination (DDGI) Probe Volume",
    category: "graphics",
    sourceFile: "app/lib/ddgiProbes.ts",
    testFile: "tests/ddgiProbes.test.ts",
    citation:
      "Majercik et al., Dynamic Diffuse Global Illumination with Ray-Traced Irradiance Fields (JCGT 2019).",
    mathFormula:
      "E(\\mathbf{x}, \\mathbf{n}) = \\sum_{p \\in \\mathcal{N}_8(\\mathbf{x})} w_{\\text{tri}}(p) \\cdot w_{\\text{vis}}(p, \\mathbf{x}) \\cdot \\max(0, \\mathbf{n} \\cdot \\mathbf{d}_p) E_p(\\mathbf{n})",
    claim:
      "Trilinear SH probe grid with Chebyshev visibility moment weighting to reduce light leaking across walls, wired into MaterialDatabaseInspector.",
    status: "implemented",
  },
  {
    id: "chip-contact-shadows",
    beadId: "cmaes-feat-pr5-contact-shadows-win",
    title: "Analytical SDF Cone-Traced Soft Shadows & Ground Contact AO",
    category: "graphics",
    sourceFile: "app/lib/contactShadows.ts",
    testFile: "tests/contactShadows.test.ts",
    citation:
      "Fernando, Percentage-Closer Soft Shadows (SIGGRAPH 2005); Evans, Fast Approximations for Global Illumination on Dynamic Scenes (SIGGRAPH 2006).",
    mathFormula:
      "S(\\mathbf{x}, \\mathbf{l}, k) = \\text{clamp}\\left(\\min_{t \\in [t_{\\min}, t_{\\max}]} \\frac{k \\, \\phi(\\mathbf{x} + t\\mathbf{l})}{t}, 0, 1\\right)",
    claim:
      "SDF sphere-traced soft shadow factor, PCSS penumbra estimation, and ground-contact ambient occlusion kernel wired into MaterialDatabaseInspector and SearsCraftsmanEstate.",
    status: "implemented",
  },
  {
    id: "chip-postfx-pipeline",
    beadId: "cmaes-feat-pr7-postfx-x3f",
    title: "ACES Filmic Tonemapping, Threshold Bloom & Chromatic Aberration",
    category: "graphics",
    sourceFile: "app/lib/postProcessingPipeline.ts",
    testFile: "tests/postProcessingPipeline.test.ts",
    citation:
      "Narkowicz, ACES Filmic Tone Mapping Curve (2015); Jimenez et al., Practical Post-Process Anti-Aliasing (SIGGRAPH 2011).",
    mathFormula:
      "f_{\\text{ACES}}(x) = \\text{clamp}\\left(\\frac{x(2.51 x + 0.03)}{x(2.43 x + 0.59) + 0.14}, 0, 1\\right)",
    claim:
      "Software reference evaluator for ACES filmic tonemapping, soft-knee bloom extraction, radial vignette, and chromatic aberration UV offsets, wired into MaterialDatabaseInspector.",
    status: "implemented",
  },
  {
    id: "chip-shuffled-stress-test",
    beadId: "cmaes-feat-fs10-shuffle-dwu",
    title: "Shuffled Furniture Placement & Wilson 95% CI Stress Harness",
    category: "navigation",
    sourceFile: "app/lib/shuffledFurnitureStressTest.ts",
    testFile: "tests/shuffledFurnitureStressTest.test.ts",
    citation:
      "Wilson, Probable Inference, the Law of Succession, and Statistical Inference (JASA 1927); Kavraki et al., Probabilistic Roadmaps (IEEE TRA 1996).",
    mathFormula:
      "\\text{CI}_{95\\%} = \\frac{\\hat{p} + \\frac{z^2}{2n} \\pm z \\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n} + \\frac{z^2}{4n^2}}}{1 + \\frac{z^2}{n}}",
    claim:
      "Deterministic Mulberry32 furniture perturbation generator and planar navigation stress-test harness with exact Wilson confidence intervals, wired into FrankenRobotsResearchAnnex.",
    status: "implemented",
  },
  {
    id: "chip-visitor-mode-clip",
    beadId: "cmaes-feat-fs12-visitor-b5e",
    title: "Deterministic 60-Second Visitor Mode Trajectory & Camera Clip",
    category: "telemetry",
    sourceFile: "app/lib/visitorModeClip.ts",
    testFile: "tests/liveCmaesAndVisitor.test.ts",
    citation: "Yuksel, Schaefer, Keyser, On the Parameterization of Catmull-Rom Curves (CGF 2011).",
    mathFormula:
      "\\mathbf{p}_{\\text{cam}}(t) = (1 - \\alpha) \\mathbf{p}_{\\text{cam}}(t - \\Delta t) + \\alpha (\\mathbf{p}_{\\text{robot}}(t) + \\Delta \\mathbf{p}_{\\text{chase}})",
    claim:
      "Deterministic 3600-frame multi-room visitor playback generator with chase-camera keyframes and doorway-clearance telemetry, wired into FrankenRobotsResearchAnnex.",
    status: "display-only",
  },
  {
    id: "chip-browser-physics-adapter",
    beadId: "cmaes-phr3m-bench-8cv",
    title: "Browser Physics Adapter & Sub-Frame Benchmark Harness",
    category: "physics",
    sourceFile: "app/lib/browserPhysicsAdapter.ts",
    testFile: "tests/browserPhysicsAdapter.test.ts",
    citation:
      "Coumans & Bai, Bullet Physics Simulation (ACM SIGGRAPH Courses 2016); Rapier 3D Rigid-Body Physics Engine (Dimforge 2024).",
    mathFormula:
      "T_{\\text{step}} = T_{\\text{broadphase}} + T_{\\text{narrowphase}} + T_{\\text{solver}} \\le 16.67\\,\\text{ms}",
    claim:
      "Unified rigid-body physics adapter interface and deterministic benchmark workload runner with p50/p95/p99 frame-budget receipts, wired into FrankenRobotsResearchAnnex.",
    status: "implemented",
  },
  {
    id: "chip-schema8-wire-format",
    beadId: "cmaes-za0x.29",
    title: "Schema v8 Zero-Copy Binary Wire Format (544-Byte Packet)",
    category: "telemetry",
    sourceFile: "app/lib/schema8WireFormat.ts",
    testFile: "tests/schema8WireFormat.test.ts",
    citation:
      "IEEE 754-2019 Floating-Point Standard; Cap'n Proto / FlatBuffers Zero-Copy Binary Serialization.",
    mathFormula:
      "\\text{sizeof}(\\text{Packet}_{v8}) = 136 \\times 4\\,\\text{bytes} = 544\\,\\text{bytes}",
    claim:
      "Fixed-layout 544-byte Float32Array binary wire encoder and zero-copy view decoder for worker-to-main-thread physics telemetry, wired into FrankenRobotsResearchAnnex.",
    status: "implemented",
  },
  {
    id: "chip-arm-link-collision-response",
    beadId: "cmaes-pvz",
    title: "KUKA iiwa 7 Per-Link OBB Signed Distance Projection",
    category: "clipping",
    sourceFile: "app/lib/armLinkCollisionResponse.ts",
    testFile: "tests/armLinkCollisionResponse.test.ts",
    citation:
      "Ericson, Real-Time Collision Detection (Morgan Kaufmann 2005), §5.5.6 ClosestPtPointOBB & §6.5 Projection; Gottschalk, Lin, Manocha, OBBTree (SIGGRAPH 1996).",
    mathFormula:
      "\\mathbf{p}_{\\text{closest}} = \\mathbf{R}\\,\\text{clamp}(\\mathbf{R}^T(\\mathbf{p} - \\mathbf{c}), -\\mathbf{h}, \\mathbf{h}) + \\mathbf{c}, \\quad \\mathbf{p} \\leftarrow \\mathbf{p} + (r - d_{\\text{OBB}}) \\hat{\\mathbf{n}}",
    claim:
      "Sequential Gauss-Seidel per-link OBB surface projection and penetration depth accounting for the 8-link KUKA chain, wired into armInverseKinematics and ArmPhysicsDebugOverlay.",
    status: "implemented",
  },
];
