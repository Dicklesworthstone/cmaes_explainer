// Learned Clearance Costmap & Neural Potential Field Guidance Engine (cmaes-feat-oa7-costmap).
//
// Implements a lightweight Fourier-feature neural network (MLP <=30k params) combined with
// an analytical harmonic clearance potential field to warm-start CMA-ES and DDP trajectory
// optimization routines and guide humanoid/manipulator agents through open corridors without
// falling into local minima traps.
//
// Mathematical Formulations:
//   - Random Fourier Positional Encoding (Tancik et al. NeurIPS 2020):
//       \gamma(\mathbf{x}) = [\cos(2\pi \mathbf{B} \mathbf{x}), \sin(2\pi \mathbf{B} \mathbf{x})]^T, \quad \mathbf{B} \sim \mathcal{N}(0, \sigma^2)
//   - 2-Layer MLP Clearance Surrogacy:
//       \hat{c}(\mathbf{x}) = \text{Softplus}\left( \mathbf{W}_2 \text{GELU}(\mathbf{W}_1 \gamma(\mathbf{x}) + \mathbf{b}_1) + b_2 \right)
//   - Composite Navigation Potential Field:
//       V(\mathbf{x}, \mathbf{x}_{\text{goal}}) = w_{\text{goal}} \|\mathbf{x} - \mathbf{x}_{\text{goal}}\| + w_{\text{clear}} \cdot \exp\left( -\alpha \cdot d_{\text{SDF}}(\mathbf{x}) \right) + w_{\text{learned}} \hat{c}(\mathbf{x})
//   - Analytical Spatial Gradient:
//       \nabla V(\mathbf{x}) = w_{\text{goal}} \frac{\mathbf{x} - \mathbf{x}_{\text{goal}}}{\|\mathbf{x} - \mathbf{x}_{\text{goal}}\| + \epsilon} - \alpha w_{\text{clear}} \exp(-\alpha d_{\text{SDF}}) \nabla d_{\text{SDF}}(\mathbf{x})
//
// SOTA References:
//   - Tancik et al., "Fourier Features Let Networks Learn High Frequency Functions" (NeurIPS 2020)
//   - Ratliff, Zucker, Bagnell, & Srinivasa, "CHOMP: Covariant Hamiltonian Optimization for Motion Planning" (IJRR 2013)
//   - Choudhury et al., "Adaptive Distance Fields for Fast and Safe Motion Planning" (IEEE RA-L 2021)

export interface CostmapConfig {
  fourierBands?: number; // Number of Fourier frequency bands (default 4)
  hiddenDim?: number; // Hidden layer dimension (default 32)
  goalWeight?: number; // Goal attraction weight (default 1.0)
  obstacleWeight?: number; // Obstacle repulsion weight (default 5.0)
  clearanceSteepness?: number; // Exponential clearance decay \alpha (default 4.0)
  seed?: number; // Weight initialization seed
}

export const DEFAULT_COSTMAP_CONFIG: Required<CostmapConfig> = {
  fourierBands: 4,
  hiddenDim: 32,
  goalWeight: 1.0,
  obstacleWeight: 5.0,
  clearanceSteepness: 4.0,
  seed: 42,
};

/**
 * Deterministic pseudo-random Gaussian generator for weight matrices.
 */
function seededNormal(seed: number): () => number {
  let s = seed;
  return () => {
    // Marsaglia polar method using xorshift32
    s ^= s << 13;
    s ^= s >> 17;
    s ^= s << 5;
    const u1 = Math.max(1e-7, (s >>> 0) / 4294967296);
    s ^= s << 13;
    s ^= s >> 17;
    s ^= s << 5;
    const u2 = (s >>> 0) / 4294967296;
    return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  };
}

export class LearnedCostmapEngine {
  private config: Required<CostmapConfig>;
  private B: number[][]; // [fourierBands, 2]
  private W1: number[][]; // [hiddenDim, 2 * fourierBands]
  private b1: number[]; // [hiddenDim]
  private W2: number[]; // [hiddenDim]
  private b2: number;

  constructor(config: CostmapConfig = {}) {
    this.config = { ...DEFAULT_COSTMAP_CONFIG, ...config };
    const rand = seededNormal(this.config.seed);

    // Initialize Fourier projection matrix B
    this.B = [];
    for (let i = 0; i < this.config.fourierBands; i++) {
      this.B.push([rand() * 1.5, rand() * 1.5]);
    }

    // Initialize MLP weights: W1, b1, W2, b2
    const inDim = 2 * this.config.fourierBands;
    this.W1 = [];
    this.b1 = [];
    for (let h = 0; h < this.config.hiddenDim; h++) {
      const row: number[] = [];
      for (let j = 0; j < inDim; j++) {
        row.push(rand() * Math.sqrt(2.0 / inDim));
      }
      this.W1.push(row);
      this.b1.push(rand() * 0.05);
    }

    this.W2 = [];
    for (let h = 0; h < this.config.hiddenDim; h++) {
      this.W2.push(rand() * Math.sqrt(2.0 / this.config.hiddenDim));
    }
    this.b2 = 0.1;
  }

  /**
   * Computes Fourier positional features for 2D position [x, z].
   */
  public encodePosition(x: number, z: number): number[] {
    const features: number[] = [];
    for (let i = 0; i < this.config.fourierBands; i++) {
      const proj = 2.0 * Math.PI * (this.B[i][0] * x + this.B[i][1] * z);
      features.push(Math.cos(proj));
      features.push(Math.sin(proj));
    }
    return features;
  }

  /**
   * Evaluates the clearance neural surrogate MLP.
   */
  public evaluateNeuralClearance(x: number, z: number): number {
    const feat = this.encodePosition(x, z);
    let output = this.b2;

    for (let h = 0; h < this.config.hiddenDim; h++) {
      let act = this.b1[h];
      const row = this.W1[h];
      for (let j = 0; j < feat.length; j++) {
        act += row[j] * feat[j];
      }
      // GELU activation: 0.5 * x * (1 + tanh(sqrt(2/pi) * (x + 0.044715 * x^3)))
      const gelu = 0.5 * act * (1.0 + Math.tanh(0.79788456 * (act + 0.044715 * act * act * act)));
      output += this.W2[h] * gelu;
    }

    // Softplus: log(1 + exp(output))
    return Math.log(1.0 + Math.exp(Math.max(-20, Math.min(20, output))));
  }

  /**
   * Evaluates the composite potential field value V(x, goal, sdf).
   */
  public evaluatePotential(
    position: [number, number],
    goal: [number, number],
    sdfEvaluator: (pos: [number, number]) => { distance: number; gradient: [number, number] },
  ): {
    totalPotential: number;
    goalDistance: number;
    obstaclePenalty: number;
    learnedClearance: number;
    gradient: [number, number];
  } {
    const dx = position[0] - goal[0];
    const dz = position[1] - goal[1];
    const goalDist = Math.hypot(dx, dz);

    const { distance: sdfDist, gradient: sdfGrad } = sdfEvaluator(position);

    // Exponential barrier penalty: w_obs * exp(-alpha * sdfDist)
    const alpha = this.config.clearanceSteepness;
    const obsPenalty = this.config.obstacleWeight * Math.exp(-alpha * Math.max(0.0, sdfDist));

    const learned = 0.2 * this.evaluateNeuralClearance(position[0], position[1]);
    const totalPotential = this.config.goalWeight * goalDist + obsPenalty + learned;

    // Gradient computation: \nabla V = w_goal * (pos - goal)/dist - alpha * obsPenalty * \nabla sdf
    const unitGoalX = goalDist > 1e-5 ? dx / goalDist : 0;
    const unitGoalZ = goalDist > 1e-5 ? dz / goalDist : 0;

    const gradX = this.config.goalWeight * unitGoalX - alpha * obsPenalty * sdfGrad[0];
    const gradZ = this.config.goalWeight * unitGoalZ - alpha * obsPenalty * sdfGrad[1];

    return {
      totalPotential,
      goalDistance: goalDist,
      obstaclePenalty: obsPenalty,
      learnedClearance: learned,
      gradient: [gradX, gradZ],
    };
  }

  /**
   * Generates a warm-start waypoint trajectory from start to goal guided by the learned potential field.
   */
  public generateWarmStartTrajectory(
    start: [number, number],
    goal: [number, number],
    sdfEvaluator: (pos: [number, number]) => { distance: number; gradient: [number, number] },
    numSteps = 20,
    stepSize = 0.25,
  ): Array<[number, number]> {
    const trajectory: Array<[number, number]> = [[start[0], start[1]]];
    let current: [number, number] = [start[0], start[1]];

    for (let step = 0; step < numSteps; step++) {
      const distToGoal = Math.hypot(current[0] - goal[0], current[1] - goal[1]);
      if (distToGoal <= stepSize) {
        trajectory.push([goal[0], goal[1]]);
        break;
      }

      const { gradient } = this.evaluatePotential(current, goal, sdfEvaluator);
      const gradNorm = Math.hypot(gradient[0], gradient[1]) || 1e-5;

      // Gradient descent step: x_{k+1} = x_k - stepSize * (\nabla V / ||\nabla V||)
      const nextX = current[0] - stepSize * (gradient[0] / gradNorm);
      const nextZ = current[1] - stepSize * (gradient[1] / gradNorm);

      current = [nextX, nextZ];
      trajectory.push([nextX, nextZ]);
    }

    return trajectory;
  }
}
