// cmaes-r3r — Three.js stage integration in this repo
//
// Background: the new rendering + physics + control stack must be visible in the cmaes_explainer G1 and arm flagship pages. This is the integration bead. It re-parents cmaes-um2 (G1 stage backdrop) and cmaes-42t (arm stage render) under the new graph and adds the new layers: photo-real rendering (r3a), PBR materials (r3b), DDGI (r3d), parameterized assets (r3c), dynamic physics (r3i, r3j, r3k), clipping detection (r3n), obstacle avoidance HUD (r3e), safety reachability HUD (r3f), DDP/MPPI control HUD (r3g, r3q).
//
// Stack contents:
//   1. Replace the current G1WalkingFlagship's HouseFloorplanBackdrop (per cmaes-um2) with the r3c factory; the floorplan schema is unchanged; the visual output uses the new PBR + IBL + DDGI rendering.
//   2. Replace the current HouseholdArmFlagship's counter stage (per cmaes-42t) with the r3c factory; the arm's manipulation layer reads the factory's articulation hooks.
//   3. Add a "physics layer" toggle to the existing UI: off = display-only (current behavior), on = the furniture can be jostled/fall/roll in the browser worker via fs-rigid.
//   4. Add an "obstacle avoidance" toggle: off = current behavior, on = MPPI+CBF+RRT* control (r3e) replaces the residual policy.
//   5. Add a "safety reachability" overlay (r3f): the BRS is rendered as a green overlay on the floor; the start state is shown as a marker.
//   6. Honesty chip stack: extended with one chip per enabled layer (PBR, DDGI, parameterized, dynamic-physics, obstacle-avoidance, safety-reachability).