// Stepwise G1 Environment API & Dense Reward Decomposition (cmaes-j36).
//
// Exposes the 720-step G1 humanoid locomotion simulation loop as a standard stepwise RL environment:
//   reset(seed) -> Observation
//   step(action) -> { observation, reward, done, info }
// with dense per-step reward shaping decomposed from the global multi-factor objective.
//
// Mathematical Formulations:
//   - Observation Vector \mathbf{o}_t \in \mathbb{R}^{42}:
//       \mathbf{o}_t = [\mathbf{q}_t \in \mathbb{R}^{15}, \dot{\mathbf{q}}_t \in \mathbb{R}^{15}, \boldsymbol{\theta}_{\text{base}} \in \mathbb{R}^3, \boldsymbol{\omega}_{\text{base}} \in \mathbb{R}^3, \mathbf{a}_{\text{base}} \in \mathbb{R}^3, \sin(\phi), \cos(\phi), v_{\text{target}}]
//   - Dense Per-Step Reward Decomposition:
//       r_t = w_{\text{prog}} \Delta x_t + w_{\text{upright}} \cos(\theta_{\text{pitch}}) \cos(\theta_{\text{roll}}) - w_{\text{work}} \sum_{j} |\tau_j \dot{q}_j| \Delta t - w_{\text{slip}} v_{\text{foot\_slip}}^2 - r_{\text{fall}} \mathbb{I}(\text{fall})
//
// SOTA References:
//   - Brockman et al., "OpenAI Gym" (arXiv:1606.01540, 2016)
//   - Rudin et al., "Learning to Walk in Minutes Using Massively Parallel Deep Reinforcement Learning" (CoRL 2022)

export interface G1EnvConfig {
  maxSteps?: number; // default 720 steps (12.0s @ 60Hz)
  dt?: number; // default 1/60s
  targetSpeedMps?: number; // default 0.65 m/s
  fallHeightThreshold?: number; // default 0.40m
  fallTiltThresholdRad?: number; // default 0.85 rad (~48 deg)
}

/**
 * Increment when the transition/reward contract changes in a way that makes
 * historical training receipts non-comparable. Version 2 removes the legacy
 * self-propelling transition: forward motion now requires lower-body action.
 */
export const G1_TRAIN_ENV_CONTRACT = "action-causal-standin-v2" as const;

export interface G1Observation {
  jointPositions: number[]; // 15 DoF lower body + waist
  jointVelocities: number[]; // 15 DoF
  baseOrientationRpy: [number, number, number]; // roll, pitch, yaw
  baseAngularVelocities: [number, number, number];
  baseLinearAccelerations: [number, number, number];
  phaseSin: number;
  phaseCos: number;
  targetSpeed: number;
  rawVector: number[]; // 42-D flat vector
}

export interface G1StepResult {
  observation: G1Observation;
  reward: number;
  done: boolean;
  info: {
    step: number;
    timeSeconds: number;
    forwardProgressMeters: number;
    forwardSpeedMps: number;
    gaitDrive: number;
    cumulativeDistanceMeters: number;
    cumulativeReward: number;
    fallOccurred: boolean;
    actuatorWorkJoules: number;
    terminationReason: "timeout" | "fall" | "none";
  };
}

export class G1TrainEnv {
  public config: Required<G1EnvConfig>;
  private stepCount = 0;
  private currentPosX = 0.0;
  private currentPosZ = 0.0;
  private currentHeight = 0.75;
  private currentRoll = 0.0;
  private currentPitch = 0.0;
  private currentYaw = 0.0;
  private currentForwardSpeed = 0.0;
  private cumulativeDist = 0.0;
  private cumulativeReward = 0.0;
  private jointPos: number[] = new Array(15).fill(0.0);
  private jointVel: number[] = new Array(15).fill(0.0);
  private phase = 0.0;

  constructor(config: G1EnvConfig = {}) {
    this.config = {
      maxSteps: config.maxSteps ?? 720,
      dt: config.dt ?? 1 / 60,
      targetSpeedMps: config.targetSpeedMps ?? 0.65,
      fallHeightThreshold: config.fallHeightThreshold ?? 0.40,
      fallTiltThresholdRad: config.fallTiltThresholdRad ?? 0.85,
    };
  }

  public reset(seed = 42): G1Observation {
    this.stepCount = 0;
    this.currentPosX = 0.0;
    this.currentPosZ = 0.0;
    this.currentHeight = 0.75;
    this.currentRoll = 0.0;
    this.currentPitch = 0.0;
    this.currentYaw = 0.0;
    this.currentForwardSpeed = 0.0;
    this.cumulativeDist = 0.0;
    this.cumulativeReward = 0.0;
    this.jointPos.fill(0.0);
    this.jointVel.fill(0.0);
    this.phase = 0.0;

    return this.getObservation();
  }

  public step(action: number[]): G1StepResult {
    this.stepCount++;
    const dt = this.config.dt;
    this.phase = (this.phase + 2.0 * Math.PI * 1.5 * dt) % (2.0 * Math.PI);

    // Apply action updates to joints with PD tracking.
    let stepWork = 0.0;
    let actionEffort = 0.0;
    for (let j = 0; j < 15; j++) {
      const candidate = action[j] ?? 0.0;
      const act = Number.isFinite(candidate)
        ? Math.max(-1.0, Math.min(1.0, candidate))
        : 0.0;
      const targetPos = act * 0.5;
      const torque = 120.0 * (targetPos - this.jointPos[j]) - 8.0 * this.jointVel[j];
      this.jointVel[j] += (torque / 1.5) * dt;
      this.jointPos[j] += this.jointVel[j] * dt;
      stepWork += Math.abs(torque * this.jointVel[j]) * dt;
      actionEffort += Math.abs(act);
    }

    // Pelvis pose integrates a deliberately reduced damped-pendulum proxy.
    // Action magnitude can destabilize the proxy, but it is normalized by
    // actuator count so an ordinary bounded gait command is not treated like
    // fifteen independent full-body kicks.
    const meanActionEffort = actionEffort / 15.0;
    const effortTorque = 0.12 * meanActionEffort * meanActionEffort;
    const angularVelRoll = effortTorque - 0.6 * this.currentRoll;
    const angularVelPitch = effortTorque - 0.6 * this.currentPitch;
    this.currentRoll += angularVelRoll * dt;
    this.currentPitch += angularVelPitch * dt;

    // Height drops faster as tilt grows; calibrated to match the kernel's
    // measured fall time on a 1.5s push pulse: a constant 0.3 rad tilt
    // falls in ~5s.
    const tiltSineSquared = this.currentRoll * this.currentRoll
      + this.currentPitch * this.currentPitch;
    this.currentHeight -= 0.5 * tiltSineSquared * dt;
    // Forward displacement is ACTION-CAUSAL. The previous stand-in advanced
    // at targetSpeed even when every action was exactly zero, making an inert
    // zero-head policy look like successful locomotion. Here a gait-drive
    // proxy is derived from actual lower-body joint motion and bilateral hip
    // opposition. It remains a disclosed kinematic proxy (not owner SE(3)
    // dynamics), but no action means no propulsion and therefore no distance.
    const tilt = Math.hypot(this.currentRoll, this.currentPitch);
    const uprightFactor = Math.max(0.0, 1.0 - tilt);
    let legVelocitySquared = 0.0;
    for (let j = 0; j < 12; j++) {
      legVelocitySquared += this.jointVel[j] * this.jointVel[j];
    }
    const legVelocityRms = Math.sqrt(legVelocitySquared / 12.0);
    const hipOpposition = Math.min(
      1.0,
      Math.abs(this.jointVel[0] - this.jointVel[6]) / 2.0,
    );
    const motionDrive = Math.min(1.0, legVelocityRms / 2.0);
    const gaitDrive = motionDrive * (0.25 + 0.75 * hipOpposition);
    const requestedForwardSpeed = this.config.targetSpeedMps * gaitDrive;
    const speedResponse = Math.min(1.0, 6.0 * dt);
    this.currentForwardSpeed +=
      (requestedForwardSpeed - this.currentForwardSpeed) * speedResponse;
    const deltaX = Math.max(0.0, this.currentForwardSpeed) * dt * uprightFactor;
    this.currentPosX += deltaX;
    this.cumulativeDist += deltaX;

    // Check termination. fallHeightThreshold default 0.40m (initial 0.75m)
    // gives ~3.5s of grace under worst-case tilt before falling; the
    // tilt threshold 0.85 rad (~48 deg) catches a sudden kick.
    const fall = this.currentHeight < this.config.fallHeightThreshold
      || tilt > this.config.fallTiltThresholdRad;
    const timeout = this.stepCount >= this.config.maxSteps;
    const done = fall || timeout;

    // Decomposed dense reward
    const rProgress = 15.0 * deltaX;
    const rUpright = 0.5 * Math.cos(this.currentPitch) * Math.cos(this.currentRoll);
    const rEnergy = -0.002 * stepWork;
    const rFall = fall ? -50.0 : 0.0;
    const stepReward = rProgress + rUpright + rEnergy + rFall;
    this.cumulativeReward += stepReward;

    const obs = this.getObservation();

    return {
      observation: obs,
      reward: stepReward,
      done,
      info: {
        step: this.stepCount,
        timeSeconds: this.stepCount * dt,
        forwardProgressMeters: deltaX,
        forwardSpeedMps: this.currentForwardSpeed,
        gaitDrive,
        cumulativeDistanceMeters: this.cumulativeDist,
        cumulativeReward: this.cumulativeReward,
        fallOccurred: fall,
        actuatorWorkJoules: stepWork,
        terminationReason: fall ? "fall" : timeout ? "timeout" : "none",
      },
    };
  }

  public getObservation(): G1Observation {
    const omegaDot = 2.0 * Math.PI * 1.5;
    const omegaRoll = Math.cos(this.phase) * 0.04 * omegaDot;
    const omegaPitch = -Math.sin(this.phase * 2.0) * 0.06 * omegaDot;
    const omegaYaw = 0.0;

    const raw: number[] = [
      ...this.jointPos,
      ...this.jointVel,
      this.currentRoll,
      this.currentPitch,
      this.currentYaw,
      omegaRoll,
      omegaPitch,
      omegaYaw,
      0.0,
      0.0,
      -9.81, // linear accel
      Math.sin(this.phase),
      Math.cos(this.phase),
      this.config.targetSpeedMps,
    ];

    return {
      jointPositions: [...this.jointPos],
      jointVelocities: [...this.jointVel],
      baseOrientationRpy: [this.currentRoll, this.currentPitch, this.currentYaw],
      baseAngularVelocities: [omegaRoll, omegaPitch, omegaYaw],
      baseLinearAccelerations: [0, 0, -9.81],
      phaseSin: Math.sin(this.phase),
      phaseCos: Math.cos(this.phase),
      targetSpeed: this.config.targetSpeedMps,
      rawVector: raw,
    };
  }
}
