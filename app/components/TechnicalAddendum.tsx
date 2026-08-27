"use client";

import { LatexRenderer } from "./LatexRenderer";
import { CovarianceMinimap } from "./CovarianceMinimap";
import { PracticalPlaybook } from "./PracticalPlaybook";
import { DLHybrids } from "./DLHybrids";
import { CommunitySplit } from "./CommunitySplit";
import { ColorizedEquation } from "./ColorizedEquation";
import { CMAES_EQUATIONS } from "../lib/cmaesEquations";
import {
  Compass,
  Layers,
  Sparkles,
  ShieldCheck,
  TrendingDown,
  Activity,
  Cpu,
  RefreshCw,
  Sigma,
  BookOpen,
  ArrowRight
} from "lucide-react";

export function TechnicalAddendum() {
  return (
    <div className="space-y-16">
      {/* Intro to Theory */}
      <div className="prose-cmaes">
        <p className="text-lg text-slate-300 leading-relaxed font-normal">
          This technical addendum covers the mathematical foundations of CMA-ES, synthesized from
          Nikolaus Hansen and Anne Auger&apos;s foundational publications, Akimoto et al.&apos;s information-geometric natural
          gradient proofs, and practical production engineering considerations.
        </p>

        <p className="border-l-4 border-sky-400 bg-slate-900/40 p-5 rounded-r-2xl my-6 text-slate-200 text-base md:text-lg leading-relaxed">
          The thesis of this addendum: CMA-ES is no ad-hoc biological heuristic. Its core update is a
          coordinate-invariant natural gradient step on the Riemannian manifold of multivariate Gaussian distributions.
        </p>
      </div>

      {/* Chapter 1: The Maximum Entropy Distribution */}
      <div className="space-y-6">
        <div className="prose-cmaes">
          <h2>1. The Search Distribution as an Optimization Object</h2>
          <p>
            In classical optimization, one maintains a single candidate vector <LatexRenderer math="x \in \mathbb{R}^n" block={false} />.
            In CMA-ES, one maintains a parameterized probability density{" "}
            <LatexRenderer math="P_\theta(x)" block={false} /> on <LatexRenderer math="\mathbb{R}^n" block={false} />, where{" "}
            <LatexRenderer math="\theta = \{m, \sigma, C\}" block={false} />:
          </p>
        </div>

        {/* Colorized Equation 1: Sampling */}
        <ColorizedEquation equation={CMAES_EQUATIONS["cmaes-sampling"]} />

        <div className="prose-cmaes">
          <p>
            <strong>Why a Gaussian?</strong> By the Principle of Maximum Entropy, the multivariate normal distribution is the unique distribution that maximizes information entropy for a specified mean and covariance matrix. It represents the least committal prior under second-order ignorance.
          </p>
        </div>

        <CovarianceMinimap />
      </div>

      {/* Chapter 2: Information Geometry & Natural Gradients */}
      <div className="space-y-6">
        <div className="prose-cmaes">
          <h2>2. Information Geometry & The Sampled Natural Gradient</h2>

          <p>
            Suppose the objective is to maximize expected performance under the search distribution <LatexRenderer math="J(\theta) = \mathbb{E}_{x \sim P_\theta} [-f(x)]" block={false} />.
            Standard Euclidean steepest ascent on <LatexRenderer math="\nabla_\theta J" block={false} /> depends arbitrarily on how the distribution is parameterized (such as Cholesky vs eigendecomposition vs matrix logarithm).
          </p>

          <p>
            To achieve coordinate invariance, information geometry equips the statistical manifold with the <strong>Fisher Information Metric</strong>:
          </p>

          <p>
            The canonical steepest ascent direction invariant to reparameterization is the <strong>Natural Gradient</strong>:
          </p>
        </div>

        {/* Colorized Equation 6: Natural Gradient */}
        <ColorizedEquation equation={CMAES_EQUATIONS["cmaes-natural-gradient"]} />

        <div className="prose-cmaes">
          <p>
            Akimoto et al. and Ollivier et al. demonstrated that when rank-based weights <LatexRenderer math="w_i" block={false} /> are substituted for raw fitness values <LatexRenderer math="f(x_i)" block={false} />, the CMA-ES mean update and rank-μ covariance update correspond exactly to a sampled natural gradient step on the Gaussian manifold. The evolution paths, the rank-1 term, and step-size adaptation accumulate cross-generation history that lies outside this derivation.
          </p>
        </div>
      </div>

      {/* Chapter 3: Cumulative Step-Size Adaptation (CSA) */}
      <div className="space-y-6">
        <div className="prose-cmaes">
          <h2>3. Cumulative Step-Size Adaptation (CSA)</h2>

          <p>
            Adapting step size <LatexRenderer math="\sigma" block={false} /> via standard 1/5th success rules fails in non-spherical landscapes. CMA-ES tracks an exponentially smoothed <strong>evolution path</strong> <LatexRenderer math="p_\sigma" block={false} /> in whitened coordinate space:
          </p>
        </div>

        {/* Colorized Equation 3: CSA Path */}
        <ColorizedEquation equation={CMAES_EQUATIONS["cmaes-csa-path"]} />

        <div className="prose-cmaes space-y-4">
          <p>
            Under random selection in a neutral fitness landscape, <LatexRenderer math="p_\sigma" block={false} /> behaves as a stationary Gaussian process with <LatexRenderer math="p_\sigma \sim \mathcal{N}(0, I_n)" block={false} />. The expected length of a standard normal vector serves as the baseline:
          </p>
        </div>

        {/* Colorized Equation 11: Expected Chi Length */}
        <ColorizedEquation equation={CMAES_EQUATIONS["cmaes-expected-chi"]} />

        <div className="prose-cmaes space-y-4">
          <p>
            CSA compares the empirical path length <LatexRenderer math="\|p_\sigma^{(g+1)}\|" block={false} /> to its expectation under random selection:
          </p>
        </div>

        {/* Colorized Equation 4: Step-Size Update */}
        <ColorizedEquation equation={CMAES_EQUATIONS["cmaes-sigma-update"]} />

        <div className="prose-cmaes">
          <ul>
            <li><strong>Consistently aligned steps:</strong> <LatexRenderer math="\|p_\sigma\| > \mathbb{E}\|\mathcal{N}(0, I)\|" block={false} /> causes <LatexRenderer math="\sigma" block={false} /> to increase (accelerating across flat valleys).</li>
            <li><strong>Oscillating or canceling steps:</strong> <LatexRenderer math="\|p_\sigma\| < \mathbb{E}\|\mathcal{N}(0, I)\|" block={false} /> causes <LatexRenderer math="\sigma" block={false} /> to decrease (zooming in around local minima).</li>
          </ul>
        </div>
      </div>

      {/* Chapter 4: Covariance Adaptation Derivation */}
      <div className="space-y-6">
        <div className="prose-cmaes">
          <h2>4. Covariance Matrix Adaptation (Rank-1 & Rank-μ Updates)</h2>

          <p>
            The full covariance update blends historical memory, rank-1 momentum path <LatexRenderer math="p_c" block={false} />, rank-μ batch spread, and active negative updates:
          </p>
        </div>

        {/* Colorized Equation 5: Covariance Update */}
        <ColorizedEquation equation={CMAES_EQUATIONS["cmaes-covariance-update"]} />

        <div className="prose-cmaes">
          <p>
            where the rank-1 anisotropic evolution path <LatexRenderer math="p_c" block={false} /> accumulates momentum in parameter coordinates:
          </p>
        </div>

        {/* Colorized Equation 7: Rank-1 Anisotropic Path */}
        <ColorizedEquation equation={CMAES_EQUATIONS["cmaes-pc-path"]} />

        <div className="prose-cmaes">
          <ul>
            <li><strong>Rank-1 Update (<LatexRenderer math="c_1" block={false} />):</strong> Exploits correlations between consecutive generations. It acts like an online Principal Component Analysis (PCA) along the trajectory of the mean.</li>
            <li><strong>Rank-<LatexRenderer math="\mu" block={false} /> Update (<LatexRenderer math="c_\mu" block={false} />):</strong> Exploits intra-generation variance among the top <LatexRenderer math="\mu" block={false} /> elite points in the current batch; crucial for large parallel populations.</li>
            <li><strong>Active CMA (<LatexRenderer math="\Delta C_{\text{active}}" block={false} />):</strong> Uses negative weights on the worst-ranked offspring (ranks <LatexRenderer math="\mu + 1, \dots, \lambda" block={false} />) to shrink variance along harmful directions.</li>
          </ul>
        </div>
      </div>

      {/* Chapter 5: Invariance Properties */}
      <div className="space-y-6">
        <div className="prose-cmaes">
          <h2>5. Fundamental Invariance Properties</h2>

          <p>
            A central reason CMA-ES is so well-behaved under black-box assumptions is its dual invariance:
          </p>
        </div>

        {/* Colorized Equation 9: Monotone Rank Invariance */}
        <ColorizedEquation equation={CMAES_EQUATIONS["cmaes-rank-invariance"]} />

        {/* Colorized Equation 10: Affine Coordinate Invariance */}
        <ColorizedEquation equation={CMAES_EQUATIONS["cmaes-affine-invariance"]} />
      </div>

      {/* Practical Playbook Integration */}
      <PracticalPlaybook />

      {/* Deep Learning & Creative Hybrids */}
      <DLHybrids />

      {/* Community Split */}
      <CommunitySplit />
    </div>
  );
}
