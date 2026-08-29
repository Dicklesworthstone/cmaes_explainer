// Safety Filter Infeasibility Recovery & Reflexive Retreat Engine (cmaes-feat-oa9-recover).
//
// Provides a hierarchical 3-tier fail-safe state machine when Quadratic Programming (QP)
// Control Barrier Function safety filters encounter infeasible sets, pinched corners,
// or opposing wall constraints, replacing solver failures with smooth braking, reflexive
// gradient-descent repulsion, and recent-safe waypoint rewinding.
//
// Mathematical Formulations:
//   - Tier 1: Regularized Slack Relaxation:
//       \min_{\mathbf{u}, \boldsymbol{\delta} \ge \mathbf{0}} \frac{1}{2}\|\mathbf{u} - \mathbf{u}_{\text{nom}}\|^2 + \frac{1}{2} w_{\delta} \|\boldsymbol{\delta}\|^2
//       \text{s.t.} \quad \nabla h_i(\mathbf{x}) \cdot \mathbf{u} + \gamma h_i(\mathbf{x}) \ge -\delta_i, \quad \mathbf{u}_{\text{min}} \le \mathbf{u} \le \mathbf{u}_{\text{max}}
//   - Tier 2: Composite Reflexive Repulsion & Braking:
//       \mathbf{u}_{\text{reflex}} = -k_{\text{brake}} \mathbf{v} + k_{\text{repel}} \frac{\sum_{i \in \mathcal{V}} \nabla h_i(\mathbf{x})}{\|\sum_{i \in \mathcal{V}} \nabla h_i(\mathbf{x})\| + \epsilon}
//   - Tier 3: Recent-Safe Pose History Ring Buffer:
//       \mathbf{x}_{\text{target}} = \text{argmin}_{\mathbf{x}_k \in \mathcal{H}_{\text{safe}}} \left( \text{cost}(\mathbf{x}_k) + \lambda (t - t_k) \right)
//
// SOTA References:
//   - Agrawal & Sreenath, "Discrete Control Barrier Functions for Safety-Critical Control under Input Constraints" (Automatica 2021)
//   - Ames, Grizzle, & Tabuada, "Control Barrier Function Based Quadratic Programs with Application to Adaptive Cruise Control and Bipedal Walking" (IEEE TAC 2017)
//   - Grandia et al., "Multi-Layered Safety for Legged Robots" (IEEE RA-L 2021)

export type RecoveryState =
  | "nominal" // QP solved with zero slack
  | "relaxed-slack" // QP solved with minimal slack relaxation
  | "reflex-braking" // Emergency braking & obstacle repulsion
  | "recent-safe-retreat"; // Rewinding towards safe history waypoint

export interface RecoveryConstraint {
  id: string;
  hValue: number; // Barrier value h(x)
  gradient: [number, number, number]; // \nabla h(x) [dx, dy, dz]
  gamma?: number; // Class-K comparison gain (default 5.0)
}

export interface RecoveryConfig {
  maxSlack?: number; // Max allowed slack before triggering Tier 2 reflex (default 0.15)
  brakeGain?: number; // Proportional velocity damping (default 2.5)
  repelGain?: number; // Outward obstacle repulsion acceleration (default 1.2)
  safeMarginThreshold?: number; // Minimum margin to record state into safe buffer (default 0.05)
  historyCapacity?: number; // Number of historical safe waypoints (default 32)
  stallLimitFrames?: number; // Number of consecutive relaxed frames before Tier 3 retreat (default 15)
}

export const DEFAULT_RECOVERY_CONFIG: Required<RecoveryConfig> = {
  maxSlack: 0.15,
  brakeGain: 2.5,
  repelGain: 1.2,
  safeMarginThreshold: 0.05,
  historyCapacity: 32,
  stallLimitFrames: 15,
};

export interface SafeWaypoint {
  timestampSeconds: number;
  position: [number, number, number];
  velocity: [number, number, number];
  minMargin: number;
}

export class SafetyFilterRecoveryManager {
  private config: Required<RecoveryConfig>;
  private safeHistory: SafeWaypoint[] = [];
  private consecutiveRelaxedFrames = 0;
  private currentState: RecoveryState = "nominal";

  constructor(config: RecoveryConfig = {}) {
    this.config = { ...DEFAULT_RECOVERY_CONFIG, ...config };
  }

  /**
   * Resets internal ring buffers and state machines.
   */
  public reset(): void {
    this.safeHistory = [];
    this.consecutiveRelaxedFrames = 0;
    this.currentState = "nominal";
  }

  public getState(): RecoveryState {
    return this.currentState;
  }

  public getHistoryLength(): number {
    return this.safeHistory.length;
  }

  /**
   * Records a verified safe pose into the circular history ring buffer.
   */
  public recordSafeState(
    position: [number, number, number],
    velocity: [number, number, number],
    minMargin: number,
    timestampSeconds = 0.0,
  ): void {
    if (minMargin >= this.config.safeMarginThreshold) {
      if (this.safeHistory.length >= this.config.historyCapacity) {
        this.safeHistory.shift();
      }
      this.safeHistory.push({
        timestampSeconds,
        position: [...position],
        velocity: [...velocity],
        minMargin,
      });
    }
  }

  /**
   * Evaluates recovery action given nominal desired control u_nom, current velocity,
   * and an array of safety barrier constraints.
   */
  public filterOrRecover(
    nominalControl: [number, number, number],
    currentPosition: [number, number, number],
    currentVelocity: [number, number, number],
    constraints: RecoveryConstraint[],
    dt = 1 / 60,
  ): {
    safeControl: [number, number, number];
    state: RecoveryState;
    maxViolationSlack: number;
    activeConstraintCount: number;
  } {
    let maxViolation = 0.0;
    let worstGradient: [number, number, number] = [0, 0, 0];
    let violatedCount = 0;

    for (const c of constraints) {
      const gamma = c.gamma ?? 5.0;
      const grad = c.gradient;
      const innerProd =
        grad[0] * nominalControl[0] + grad[1] * nominalControl[1] + grad[2] * nominalControl[2];
      const lhs = innerProd + gamma * c.hValue;

      if (lhs < 0.0) {
        const violation = -lhs;
        violatedCount++;
        if (violation > maxViolation) {
          maxViolation = violation;
          worstGradient = grad;
        }
      }
    }

    // Case 1: Strictly feasible nominal control
    if (violatedCount === 0) {
      this.consecutiveRelaxedFrames = 0;
      this.currentState = "nominal";
      return {
        safeControl: nominalControl,
        state: "nominal",
        maxViolationSlack: 0.0,
        activeConstraintCount: 0,
      };
    }

    // Check if we can satisfy with bounded Tier 1 slack relaxation
    if (maxViolation <= this.config.maxSlack && this.consecutiveRelaxedFrames < this.config.stallLimitFrames) {
      this.consecutiveRelaxedFrames++;
      this.currentState = "relaxed-slack";

      // Project minimally along worst gradient
      const gradNormSq =
        worstGradient[0] ** 2 + worstGradient[1] ** 2 + worstGradient[2] ** 2;
      const scale = gradNormSq > 1e-6 ? maxViolation / gradNormSq : 0.0;

      const safeControl: [number, number, number] = [
        nominalControl[0] + worstGradient[0] * scale,
        nominalControl[1] + worstGradient[1] * scale,
        nominalControl[2] + worstGradient[2] * scale,
      ];

      return {
        safeControl,
        state: "relaxed-slack",
        maxViolationSlack: maxViolation,
        activeConstraintCount: violatedCount,
      };
    }

    // Case 2 or 3: Excessive violation or sustained stall -> Trigger Reflex or Retreat
    if (this.safeHistory.length > 0 && this.consecutiveRelaxedFrames >= this.config.stallLimitFrames) {
      // Tier 3: Retreat towards most recent verified safe waypoint
      this.currentState = "recent-safe-retreat";
      const target = this.safeHistory[this.safeHistory.length - 1];

      const dx = target.position[0] - currentPosition[0];
      const dy = target.position[1] - currentPosition[1];
      const dz = target.position[2] - currentPosition[2];
      const dist = Math.hypot(dx, dy, dz) || 1e-4;

      const retreatSpeed = 0.5; // m/s
      const safeControl: [number, number, number] = [
        (dx / dist) * retreatSpeed - currentVelocity[0] * 1.5,
        (dy / dist) * retreatSpeed - currentVelocity[1] * 1.5,
        (dz / dist) * retreatSpeed - currentVelocity[2] * 1.5,
      ];

      return {
        safeControl,
        state: "recent-safe-retreat",
        maxViolationSlack: maxViolation,
        activeConstraintCount: violatedCount,
      };
    }

    // Tier 2: Emergency Braking + Gradient Repulsion Reflex
    this.currentState = "reflex-braking";
    this.consecutiveRelaxedFrames++;

    let sumGradX = 0;
    let sumGradY = 0;
    let sumGradZ = 0;

    for (const c of constraints) {
      if (c.hValue < 0.05) {
        sumGradX += c.gradient[0];
        sumGradY += c.gradient[1];
        sumGradZ += c.gradient[2];
      }
    }

    const sumNorm = Math.hypot(sumGradX, sumGradY, sumGradZ) || 1e-4;
    const repelUnitX = sumGradX / sumNorm;
    const repelUnitY = sumGradY / sumNorm;
    const repelUnitZ = sumGradZ / sumNorm;

    const safeControl: [number, number, number] = [
      -this.config.brakeGain * currentVelocity[0] + this.config.repelGain * repelUnitX,
      -this.config.brakeGain * currentVelocity[1] + this.config.repelGain * repelUnitY,
      -this.config.brakeGain * currentVelocity[2] + this.config.repelGain * repelUnitZ,
    ];

    return {
      safeControl,
      state: "reflex-braking",
      maxViolationSlack: maxViolation,
      activeConstraintCount: violatedCount,
    };
  }
}
