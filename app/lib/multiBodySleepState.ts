// Multi-Body Sleep State & Impulse-Gated Activation Engine (cmaes-feat-ph13-sleep).
//
// Implements physical multi-body sleeping islands, kinetic energy dwell timers, and
// instantaneous impulse/contact activation gating to put settled household furniture
// and tabletop items to sleep (saving CPU/WASM budget) while waking them immediately
// upon robot perturbation.
//
// Mathematical Formulations:
//   - Kinetic Energy Metric:
//       E_k = \frac{1}{2} m \|\mathbf{v}\|^2 + \frac{1}{2} \boldsymbol{\omega}^T \mathbf{I} \boldsymbol{\omega}
//   - Sleep Transition Criteria:
//       \text{If } E_k(t) < E_{\text{sleep\_thresh}} \quad \forall t \in [t_{\text{now}} - T_{\text{dwell}}, t_{\text{now}}] \implies \text{State} \leftarrow \text{SLEEPING}
//   - Impulse Activation Gate:
//       \|\mathbf{J}_{\text{ext}}\| \ge J_{\text{wake\_thresh}} \implies \text{State} \leftarrow \text{AWAKE}, \quad \text{WakeConnectedIsland}(\text{body})
//
// SOTA References:
//   - Guendelman, Bridson, & Fedkiw, "Nonconvex Rigid Bodies with Stacking" (ACM TOG / SIGGRAPH 2003)
//   - Baraff, "Fast Contact Force Computation for Nonpenetrating Rigid Bodies" (SIGGRAPH 1994)
//   - Bullet Physics SDK & PhysX 5 Island Management Architecture (2024)

export type BodySleepState = "AWAKE" | "SLEEPING";

export interface SleepableBody {
  id: string;
  massKg: number;
  momentOfInertia: number;
  position: [number, number, number];
  velocity: [number, number, number];
  angularVelocity: [number, number, number];
  state: BodySleepState;
  lowEnergyDwellSeconds: number;
  connectedBodyIds: string[]; // Graph connectivity to stacked/touching objects
}

export interface SleepEngineConfig {
  energyThresholdJoules?: number; // default 5e-4 J (e.g. speed < 0.03 m/s for 1kg)
  dwellTimeSeconds?: number; // default 0.4s of quietness before sleep
  wakeImpulseThresholdNs?: number; // default 0.05 N*s impulse to wake
}

export const DEFAULT_SLEEP_CONFIG: Required<SleepEngineConfig> = {
  energyThresholdJoules: 5e-4,
  dwellTimeSeconds: 0.4,
  wakeImpulseThresholdNs: 0.05,
};

export interface SleepTransitionEvent {
  bodyId: string;
  fromState: BodySleepState;
  toState: BodySleepState;
  timeSeconds: number;
  reason: "energy_dwell" | "impulse_wake" | "island_wake" | "forced";
  impulseMagnitude?: number;
}

export class MultiBodySleepManager {
  private config: Required<SleepEngineConfig>;
  private bodies: Map<string, SleepableBody> = new Map();
  private eventHistory: SleepTransitionEvent[] = [];

  constructor(config: SleepEngineConfig = {}) {
    this.config = { ...DEFAULT_SLEEP_CONFIG, ...config };
  }

  public registerBody(body: SleepableBody): void {
    this.bodies.set(body.id, { ...body });
  }

  public getBody(id: string): SleepableBody | undefined {
    return this.bodies.get(id);
  }

  public getAllBodies(): SleepableBody[] {
    return Array.from(this.bodies.values());
  }

  public getEvents(): SleepTransitionEvent[] {
    return [...this.eventHistory];
  }

  /**
   * Applies an external impulse to a body and checks wake-up gating.
   */
  public applyImpulse(
    bodyId: string,
    impulse: [number, number, number],
    timeSeconds = 0.0,
  ): boolean {
    const body = this.bodies.get(bodyId);
    if (!body) return false;

    const impNorm = Math.hypot(impulse[0], impulse[1], impulse[2]);

    if (impNorm >= this.config.wakeImpulseThresholdNs) {
      if (body.state === "SLEEPING") {
        this.wakeIsland(bodyId, timeSeconds, "impulse_wake", impNorm);
      }
      // Apply delta velocity: \Delta v = J / m
      body.velocity[0] += impulse[0] / body.massKg;
      body.velocity[1] += impulse[1] / body.massKg;
      body.velocity[2] += impulse[2] / body.massKg;
      body.lowEnergyDwellSeconds = 0.0;
      return true;
    }

    return false; // Impulse below wake threshold
  }

  /**
   * Wakes a body and recursively activates all connected bodies in the contact graph island.
   */
  public wakeIsland(
    rootBodyId: string,
    timeSeconds = 0.0,
    reason: SleepTransitionEvent["reason"] = "impulse_wake",
    impulseMag?: number,
  ): void {
    const queue = [rootBodyId];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const curId = queue.shift()!;
      if (visited.has(curId)) continue;
      visited.add(curId);

      const b = this.bodies.get(curId);
      if (!b) continue;

      if (b.state === "SLEEPING") {
        b.state = "AWAKE";
        b.lowEnergyDwellSeconds = 0.0;
        this.eventHistory.push({
          bodyId: curId,
          fromState: "SLEEPING",
          toState: "AWAKE",
          timeSeconds,
          reason: curId === rootBodyId ? reason : "island_wake",
          impulseMagnitude: curId === rootBodyId ? impulseMag : undefined,
        });
      }

      for (const neighborId of b.connectedBodyIds) {
        if (!visited.has(neighborId)) {
          queue.push(neighborId);
        }
      }
    }
  }

  /**
   * Evaluates kinetic energy and updates sleeping state for all registered bodies.
   */
  public updateSleepStates(dt = 1 / 60, timeSeconds = 0.0): {
    sleepingCount: number;
    awakeCount: number;
  } {
    let sleepingCount = 0;
    let awakeCount = 0;

    for (const body of this.bodies.values()) {
      if (body.state === "SLEEPING") {
        sleepingCount++;
        continue;
      }

      // Compute total kinetic energy
      const vSq =
        body.velocity[0] ** 2 + body.velocity[1] ** 2 + body.velocity[2] ** 2;
      const omegaSq =
        body.angularVelocity[0] ** 2 +
        body.angularVelocity[1] ** 2 +
        body.angularVelocity[2] ** 2;

      const eKinetic =
        0.5 * body.massKg * vSq + 0.5 * body.momentOfInertia * omegaSq;

      if (eKinetic < this.config.energyThresholdJoules) {
        body.lowEnergyDwellSeconds += dt;
        if (body.lowEnergyDwellSeconds >= this.config.dwellTimeSeconds) {
          // Transition to SLEEPING
          body.state = "SLEEPING";
          body.velocity = [0, 0, 0];
          body.angularVelocity = [0, 0, 0];
          this.eventHistory.push({
            bodyId: body.id,
            fromState: "AWAKE",
            toState: "SLEEPING",
            timeSeconds,
            reason: "energy_dwell",
          });
          sleepingCount++;
          continue;
        }
      } else {
        body.lowEnergyDwellSeconds = 0.0;
      }

      awakeCount++;
    }

    return { sleepingCount, awakeCount };
  }
}
